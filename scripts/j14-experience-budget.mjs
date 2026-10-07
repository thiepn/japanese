import fs from "node:fs";
import path from "node:path";
import {gzipSync} from "node:zlib";
import {fileURLToPath} from "node:url";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const DIST=path.join(ROOT,"apps/web/dist");
const ASSETS=path.join(DIST,"assets");
const INDEX=path.join(DIST,"index.html");

const MAX_LAZY_CSS_GZIP=12*1024;
const MAX_LAZY_JS_GZIP=64*1024;
const MAX_VISUAL_ASSET_BYTES=1536*1024;
const MAX_VISUAL_TOTAL_BYTES=4*1024*1024;
const REQUIRED_LAZY=["J11Diagnostics","J12MobileRuntime","J13ExhibitionRuntime"];

if(!fs.existsSync(INDEX)||!fs.existsSync(ASSETS))throw new Error("J14_DIST_MISSING");

const html=fs.readFileSync(INDEX,"utf8");
for(const name of REQUIRED_LAZY){
  if(html.includes(name))throw new Error("J14_LAZY_CHUNK_EAGERLY_REFERENCED:"+name);
}

const assetFiles=fs.readdirSync(ASSETS).map(name=>path.join(ASSETS,name)).filter(file=>fs.statSync(file).isFile());
const lazy={};
for(const name of REQUIRED_LAZY){
  const matches=assetFiles.filter(file=>path.basename(file).startsWith(name+"-"));
  if(!matches.length)throw new Error("J14_LAZY_CHUNK_MISSING:"+name);
  lazy[name]=matches.map(file=>{
    const bytes=fs.readFileSync(file);
    const gzipBytes=gzipSync(bytes).byteLength;
    const ext=path.extname(file).toLowerCase();
    const budget=ext===".css"?MAX_LAZY_CSS_GZIP:MAX_LAZY_JS_GZIP;
    if(gzipBytes>budget)throw new Error(`J14_LAZY_CHUNK_TOO_LARGE:${path.basename(file)}:${gzipBytes}>${budget}`);
    return {file:path.relative(DIST,file),rawBytes:bytes.byteLength,gzipBytes};
  });
}

const visualExtensions=new Set([".png",".jpg",".jpeg",".webp",".avif",".gif",".svg",".woff",".woff2",".ttf",".otf"]);
const visuals=[];
walk(DIST,file=>{
  if(!visualExtensions.has(path.extname(file).toLowerCase()))return;
  const bytes=fs.statSync(file).size;
  if(bytes>MAX_VISUAL_ASSET_BYTES)throw new Error(`J14_VISUAL_ASSET_TOO_LARGE:${path.relative(DIST,file)}:${bytes}>${MAX_VISUAL_ASSET_BYTES}`);
  visuals.push({file:path.relative(DIST,file),bytes});
});
const visualTotalBytes=visuals.reduce((sum,item)=>sum+item.bytes,0);
if(visualTotalBytes>MAX_VISUAL_TOTAL_BYTES){
  throw new Error(`J14_VISUAL_ASSET_TOTAL_TOO_LARGE:${visualTotalBytes}>${MAX_VISUAL_TOTAL_BYTES}`);
}

const report={
  schema:"thiepn-japanese-j14-experience-budget",
  schemaVersion:1,
  lazyChunkBudgets:{cssGzipBytes:MAX_LAZY_CSS_GZIP,jsGzipBytes:MAX_LAZY_JS_GZIP},
  lazy,
  visualAssetBudgets:{individualBytes:MAX_VISUAL_ASSET_BYTES,totalBytes:MAX_VISUAL_TOTAL_BYTES},
  visualAssets:visuals,
  visualTotalBytes,
  assertions:{
    technicalDiagnosticsLazy:true,
    mobileLayerLazy:true,
    exhibitionLayerLazy:true,
    noOversizedVisualAsset:true
  }
};

fs.mkdirSync(path.join(ROOT,"artifacts"),{recursive:true});
fs.writeFileSync(path.join(ROOT,"artifacts/j14-experience-budget.json"),JSON.stringify(report,null,2)+"\n");
process.stdout.write("J14 experience budget PASS — J11/J12/J13 remain lazy; visual assets within budget\n");

function walk(dir,visit){
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    const file=path.join(dir,entry.name);
    if(entry.isDirectory())walk(file,visit);
    else if(entry.isFile())visit(file);
  }
}
