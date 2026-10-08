import fs from "node:fs";
import path from "node:path";
import {gzipSync} from "node:zlib";
import {fileURLToPath} from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const entry=read("apps/web/src/styles.css");
const ops=read("apps/web/src/design/j11-operations.css");
const diagnostics=read("apps/web/src/design/J11Diagnostics.tsx");
const j11=read("apps/web/src/design/j11.css");
const main=read("apps/web/src/main.tsx");
const app=read("apps/web/src/App.tsx");
const doc=read("docs/J15D_ACCEPTANCE.md");
const failures=[];
const names=["human-review-panel","native-curation-panel","release-operations","curation-workspace","release-check-columns","human-review-stats"];
const selector=n=>new RegExp("\\."+n+"(?:[\\s.#:,{>]|$)");
for(const n of names){
  if(!selector(n).test(ops))failures.push("Missing isolated technical CSS selector "+n);
  if(selector(n).test(entry))failures.push("J11 CSS leaked into eager styles: "+n);
}
if(entry.includes("/* P10 release operations"))failures.push("Unmoved P10 technical CSS section");
if(!ops.startsWith("/* P10 release operations"))failures.push("Technical CSS provenance marker lost");
if(!diagnostics.startsWith('import "./j11-operations.css";\nimport "./j11.css";'))failures.push("J11 lazy CSS import order broken");
if(!app.includes('const J11Diagnostics=lazy(()=>import("./design/J11Diagnostics")'))failures.push("J11 no longer lazy at route boundary");
if(main.includes("j11-operations.css")||main.includes("J11Diagnostics"))failures.push("J11 technical CSS added to entry");
for(const n of ["primary","course-kicker","result-card","reader-token","p20-readiness","skip-link"]){
  if(!selector(n).test(entry))failures.push("Active shared CSS selector lost: "+n);
}
if(!j11.includes(".j11-diagnostics"))failures.push("Existing J11 CSS lost");
if(!doc.includes("D3 — Diagnostics CSS extraction")||!doc.includes("physical Android"))failures.push("D3 acceptance or device boundary missing");
const report={
  schema:"thiepn-japanese-j15d-d3-css-boundary",schemaVersion:1,
  passed:failures.length===0,
  oldSharedCssSourceBytes:92129,
  sharedCssSourceBytes:Buffer.byteLength(entry),
  routeOnlyCssSourceBytes:Buffer.byteLength(ops),
  routeOnlyCssGzipBytes:gzipSync(ops).byteLength,
  lazyOwner:"apps/web/src/design/J11Diagnostics.tsx",
  sourceOrder:["styles.css","j1.css through j15b.css","J11Diagnostics: j11-operations.css then j11.css"],
  movedSelectorRoots:names,
  note:"Static source bytes are not page-load transfer sizes. Production entry and lazy CSS bytes are recorded after a real Vite build.",
  failures
};
if(process.argv.includes("--dist")){
  const dist=path.join(root,"apps/web/dist");
  const html=fs.readFileSync(path.join(dist,"index.html"),"utf8");
  const entryLinks=[...html.matchAll(/<link[^>]*href=["']([^"']+\\.css)["'][^>]*>/g)].map(m=>m[1]);
  let entryGzip=0,entryFiles=[];
  for(const link of entryLinks){
    const name=link.split("/").pop(),file=fs.readFileSync(path.join(dist,"assets",name));
    entryGzip+=gzipSync(file).byteLength;
    entryFiles.push(name);
    if(file.toString().includes(".human-review-panel"))failures.push("P10 CSS remains in initial Vite CSS asset "+name);
  }
  const lazyCss=fs.readdirSync(path.join(dist,"assets")).filter(f=>f.endsWith(".css")&&!entryFiles.includes(f));
  const owning=lazyCss.filter(f=>fs.readFileSync(path.join(dist,"assets",f),"utf8").includes(".human-review-panel"));
  if(owning.length!==1)failures.push("Expected exactly one lazy CSS asset owning P10, found "+owning.length);
  const lazyBytes=owning.map(f=>gzipSync(fs.readFileSync(path.join(dist,"assets",f))).byteLength);
  report.production={entryCssGzipBytes:entryGzip,entryCssBudgetBytes:40960,entryFiles,technicalCssChunkNames:owning,technicalCssChunkGzipBytes:lazyBytes,lazyChunkIncludesExistingJ11Css:owning.some(f=>fs.readFileSync(path.join(dist,"assets",f),"utf8").includes(".j11-diagnostics"))};
  if(entryGzip>40960)failures.push("P22 initial CSS budget exceeded");
  if(!report.production.lazyChunkIncludesExistingJ11Css)failures.push("J11 technical styles not bundled with diagnostics CSS");
}
report.passed=failures.length===0;
fs.mkdirSync(path.join(root,"artifacts"),{recursive:true});
fs.writeFileSync(path.join(root,"artifacts/j15d-d3-css-boundary.json"),JSON.stringify(report,null,2)+"\n");
if(failures.length)throw new Error("J15D_D3_CSS_BOUNDARY_FAILED: "+failures.join(" | "));
process.stdout.write("J15D D3 CSS boundary PASS — isolated "+report.routeOnlyCssSourceBytes+" source bytes behind lazy J11; initial CSS unchanged budget\n");
