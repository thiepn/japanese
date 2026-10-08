import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

// Evidence inventory, not an automated CSS deletion tool. Dynamic classes are unresolved.
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=rel=>fs.readFileSync(path.join(root,rel),"utf8");
const ignoredDirs=new Set(["node_modules","dist","coverage","artifacts",".git","build"]);
function sourceFiles(rel){
  const base=path.join(root,rel);
  if(!fs.existsSync(base))return [];
  const found=[];
  function walk(dir){
    for(const item of fs.readdirSync(dir,{withFileTypes:true})){
      if(item.isDirectory()&&!ignoredDirs.has(item.name))walk(path.join(dir,item.name));
      else if(item.isFile()&&/\.(?:tsx?|jsx?)$/.test(item.name)&&!/\.(?:test|spec)\.[jt]sx?$/.test(item.name)){
        found.push(path.relative(root,path.join(dir,item.name)).replaceAll(path.sep,"/"));
      }
    }
  }
  walk(base);
  return found;
}
const files=[...new Set(["apps/web/src","packages","services"].flatMap(sourceFiles))].sort();
const fileSources=files.map(p=>({path:p,content:read(p)}));
const stylesheet=read("apps/web/src/styles.css");
const noComments=stylesheet.replace(/\/\*[\s\S]*?\*\//g,"");
const names=new Set();
for(const rule of noComments.matchAll(/([^{}]+)\{[^{}]*\}/g)){
  // Includes nested @media rules without treating media-query identifiers as classes.
  for(const match of rule[1].matchAll(/\.([A-Za-z_][\w-]*)/g))names.add(match[1]);
}
const cssClasses=[...names].sort();
function mentioned(text,name){
  let offset=0;
  while(true){
    const i=text.indexOf(name,offset);
    if(i<0)return false;
    const before=i?text[i-1]:"";
    const after=text[i+name.length]??"";
    if(!/[A-Za-z0-9_-]/.test(before)&&!/[A-Za-z0-9_-]/.test(after))return true;
    offset=i+name.length;
  }
}
const covered=[],unresolved=[],mentions={};
for(const name of cssClasses){
  const hits=fileSources.filter(f=>mentioned(f.content,name)).map(f=>f.path);
  if(hits.length){covered.push(name);mentions[name]=hits;}
  else unresolved.push(name);
}
const protectedShared=["primary","course-kicker","result-card","reader-token","p20-readiness","skip-link"];
const dynamicSources=fileSources.filter(f=>/className\s*=\s*\{|classList\.(?:add|toggle)|className\s*\+|className=\{.*\?/.test(f.content))
  .map(f=>f.path);
function group(name){
  if(/^j\d+/.test(name))return "j-series";
  if(/^p\d+/.test(name))return "phase-specific";
  return "shared-or-legacy";
}
const groups=Object.fromEntries(["j-series","phase-specific","shared-or-legacy"].map(k=>[
  k,{defined:cssClasses.filter(x=>group(x)===k).length,observed:covered.filter(x=>group(x)===k).length,unresolved:unresolved.filter(x=>group(x)===k).length}
]));
const failures=[];
if(files.length<30)failures.push("incomplete source inventory: "+files.length+" files");
for(const key of protectedShared){
  if(!names.has(key))failures.push("active shared CSS selector missing: "+key);
  if(!covered.includes(key))failures.push("active source reference missing: "+key);
}
if(!dynamicSources.length)failures.push("dynamic class use missing from inventory");
if(!read("docs/J15D_ACCEPTANCE.md").includes("D2 ownership inventory"))failures.push("D2 ownership safeguards not documented");
const report={
  schema:"thiepn-japanese-j15d-css-ownership",schemaVersion:1,passed:!failures.length,
  warning:"Unresolved selectors are NOT confirmed dead. Dynamic class construction, runtime content, and external renderers require manual inspection before deletion.",
  sourcesScanned:files.length,sourcePaths:files,
  cssBytes:Buffer.byteLength(stylesheet),
  definedClassCount:cssClasses.length,observedClassCount:covered.length,
  unresolvedClassCount:unresolved.length,groups,protectedShared,
  dynamicSourceCount:dynamicSources.length,dynamicSourcePaths:dynamicSources,
  unresolvedNeedsManualReview:unresolved,observedSourcePaths:mentions,
  failures
};
fs.mkdirSync(path.join(root,"artifacts"),{recursive:true});
fs.writeFileSync(path.join(root,"artifacts/j15d-css-ownership.json"),JSON.stringify(report,null,2)+"\n");
if(failures.length)throw new Error("J15D_CSS_OWNERSHIP_FAILED: "+failures.join(" | "));
process.stdout.write("J15D ownership inventory PASS — "+files.length+" sources, "+cssClasses.length+" classes, "+unresolved.length+" unresolved (not automatically removed)\n");
