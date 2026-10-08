import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const load=(pathName)=>fs.readFileSync(path.join(root,pathName),"utf8");
const sheets={
  archive:load("apps/web/src/design/j7.css"),
  progress:load("apps/web/src/design/j8.css"),
  mobile:load("apps/web/src/design/j12.css"),
  exhibition:load("apps/web/src/design/j13.css"),
  shell:load("apps/web/src/design/j2.css"),
};
function sizeAfterSelector(css,selector,occurrence=0){
  const needle=selector+"{";
  let from=0,start=-1;
  for(let i=0;i<=occurrence;i++){
    start=css.indexOf(needle,from);
    if(start<0)return null;
    from=start+needle.length;
  }
  const close=css.indexOf("}",start);
  const size=css.slice(start,close).match(/font-size\s*:\s*(\d+(?:\.\d+)?)px/);
  return size?Number(size[1]):null;
}
const thresholds=[
  ["archive",".j7-filter-strip strong",11],
  ["archive",".j7-filter-strip small",10],
  ["archive",".j7-result__body small",11],
  ["archive",".j7-result__body>span",12],
  ["archive",".j7-reference__badges span",11],
  ["archive",".j7-reference__section>span",11],
  ["archive",".j7-reference__section p,\n.j7-reference__section ul",14],
  ["archive",".j7-reference__provenance span",10],
  ["archive",".j7-reference__provenance strong,\n.j7-reference__provenance code",11],
  ["archive",".j7-reference__empty p",12],
  ["archive",".j7-library__footer p",11],
  ["progress",".j8-crest__evidence small",10],
  ["progress",".j8-ledger__item small",11],
  ["progress",".j8-ledger>p",12],
  ["mobile",".j2-nav__label small",10],
  ["exhibition",".j2-nav__label small",10],
];
const checks=thresholds.map(([sheet,selector,min])=>({sheet,selector,min,actual:sizeAfterSelector(sheets[sheet],selector)}));
checks.push({sheet:"mobile",selector:".j2-nav__label small (narrow)",min:10,actual:sizeAfterSelector(sheets.mobile,".j2-nav__label small",1)});
const docs=load("docs/J15C_ACCEPTANCE.md");
const tests=load("tests/e2e/j15c-legibility.spec.ts");
const failures=checks.filter(x=>x.actual===null||x.actual<x.min).map(x=>x.sheet+" "+x.selector+" "+x.actual+" < "+x.min);
if(!docs.toLowerCase().includes("physical android")||!docs.includes("J15B"))failures.push("missing release and inheritance boundaries");
if(!tests.includes("keyboard")||!tests.includes("fontSize"))failures.push("browser acceptance missing");
const result={schema:"thiepn-japanese-j15c-legibility",schemaVersion:1,passed:!failures.length,checks,failures};
fs.mkdirSync(path.join(root,"artifacts"),{recursive:true});
fs.writeFileSync(path.join(root,"artifacts/j15c-legibility-audit.json"),JSON.stringify(result,null,2)+"\n");
if(failures.length)throw new Error("J15C_LEGIBILITY_FAILED: "+failures.join(" | "));
process.stdout.write("J15C legibility audit PASS — "+checks.length+" source thresholds\n");
