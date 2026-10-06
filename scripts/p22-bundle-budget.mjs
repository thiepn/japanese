import fs from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";
import { fileURLToPath } from "node:url";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const DIST=path.join(ROOT,"apps/web/dist");
const INDEX=path.join(DIST,"index.html");
const MAX_ENTRY_GZIP_BYTES=500*1024;
const MAX_CSS_GZIP_BYTES=40*1024;

if(!fs.existsSync(INDEX))throw new Error("P22_BUNDLE_INDEX_MISSING");
const html=fs.readFileSync(INDEX,"utf8");
const entryMatch=html.match(/<script[^>]+type=["']module["'][^>]+src=["']([^"']+)["']/i)
  ??html.match(/<script[^>]+src=["']([^"']+)["'][^>]+type=["']module["']/i);
if(!entryMatch?.[1])throw new Error("P22_BUNDLE_ENTRY_MISSING");

const entryPath=resolveAsset(entryMatch[1]);
const entry=fs.readFileSync(entryPath);
const entryGzip=gzipSync(entry).byteLength;
if(entryGzip>MAX_ENTRY_GZIP_BYTES){
  throw new Error(`P22_ENTRY_BUNDLE_TOO_LARGE:${entryGzip}>${MAX_ENTRY_GZIP_BYTES}`);
}

const cssHrefs=[...html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["']/gi)].map(m=>m[1]);
let cssGzip=0;
for(const href of cssHrefs){
  const file=fs.readFileSync(resolveAsset(href));
  cssGzip+=gzipSync(file).byteLength;
}
if(cssGzip>MAX_CSS_GZIP_BYTES){
  throw new Error(`P22_CSS_BUNDLE_TOO_LARGE:${cssGzip}>${MAX_CSS_GZIP_BYTES}`);
}

const report={
  schema:"thiepn-japanese-p22-bundle-budget",
  schemaVersion:1,
  entry:path.relative(DIST,entryPath),
  entryRawBytes:entry.byteLength,
  entryGzipBytes:entryGzip,
  entryGzipBudgetBytes:MAX_ENTRY_GZIP_BYTES,
  cssGzipBytes:cssGzip,
  cssGzipBudgetBytes:MAX_CSS_GZIP_BYTES,
  note:"SQLite/WASM is lazy-loaded with Library and is intentionally excluded from the initial-entry budget."
};
fs.mkdirSync(path.join(ROOT,"artifacts"),{recursive:true});
fs.writeFileSync(path.join(ROOT,"artifacts/p22-bundle-budget.json"),JSON.stringify(report,null,2)+"\n");
process.stdout.write(`P22 bundle budget PASS — entry ${Math.round(entryGzip/1024)} KiB gzip / ${Math.round(MAX_ENTRY_GZIP_BYTES/1024)} KiB\n`);

function resolveAsset(urlPath){
  const stripped=urlPath.replace(/^https?:\/\/[^/]+/,"").replace(/^\/japanese\//,"").replace(/^\//,"");
  const target=path.resolve(DIST,stripped);
  if(!target.startsWith(DIST+path.sep))throw new Error("P22_BUNDLE_PATH_INVALID");
  if(!fs.existsSync(target))throw new Error("P22_BUNDLE_ASSET_MISSING:"+urlPath);
  return target;
}
