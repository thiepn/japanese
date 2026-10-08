import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=(p)=>fs.readFileSync(path.join(root,p),"utf8");
const css=read("apps/web/src/design/j15b.css");
const main=read("apps/web/src/main.tsx");
const doc=read("docs/J15B_VISUAL_GRAMMAR.md");
const test=read("tests/e2e/j15b-visual-grammar.spec.ts");
const cssTokens=[
  "--j-vg-paper","--j-vg-sheet","--j-vg-ink","--j-vg-indigo",
  "--j-vg-lacquer","--j-vg-seal","--j-vg-ceremonial-gold",
  "--j-vg-rule","--j-vg-type-japanese","--j-vg-type-interface",
  "--j-vg-paper-corner","--j-vg-reading-leading","--j-vg-touch-min"
];
const surfaces=[
  ".j3-today__hero",".j4-hero",".j6-hero",
  ".j7-library__masthead",".j8-hero"
];
const failures=[];
const missingTokens=cssTokens.filter(v=>!css.includes(v+":"));
const missingSurfaces=surfaces.filter(v=>!css.includes(v));
if(missingTokens.length)failures.push("missing design tokens: "+missingTokens.join(", "));
if(missingSurfaces.length)failures.push("missing surface identity: "+missingSurfaces.join(", "));
const importString='import "./design/j15b.css";';
if(!main.includes(importString))failures.push("J15B terminal CSS is not imported");
if(main.indexOf(importString)<=main.indexOf('import "./design/j10.css";'))failures.push("J15B must follow J10");
if(!css.includes(".j2-shell .j2-nav")||!css.includes("backdrop-filter:none!important")||!css.includes("box-shadow:none!important")){
  failures.push("flat editorial navigation guard absent");
}
if(!css.includes(":focus-visible")||!css.includes("--j-focus"))failures.push("keyboard focus protection missing");
if(!css.includes("prefers-reduced-motion:reduce"))failures.push("reduced motion protection missing");
if(!css.includes(".j6-reader-japanese")||!css.includes(".j7-search__field input"))failures.push("reader/library clarity contracts missing");
if(/#[0-9a-f]{3,8}\b/i.test(css))failures.push("literal hex color introduced in grammar overlay");
if(/(?:backdrop-filter\s*:\s*(?!none)|box-shadow\s*:\s*(?!none))/i.test(css.replace(/\/\*[\s\S]*?\*\//g,"")))failures.push("glass or elevation reintroduced");
for(const word of ["Today","Learn","Immerse","Library","Progress","reduced-motion","keyboard","anti-pattern","J12","J13"]){
  if(!doc.toLowerCase().includes(word.toLowerCase()))failures.push("design contract missing "+word);
}
if(!test.includes("test(")||!test.includes("box-shadow")||!test.includes("backdrop-filter"))failures.push("runtime regression coverage absent");
const report={
  schema:"thiepn-japanese-j15b-visual-grammar",
  schemaVersion:1,
  passed:failures.length===0,
  assertions:{
    semanticTokens:missingTokens.length===0,
    fiveDistinctSurfaces:missingSurfaces.length===0,
    terminalImport:main.includes(importString),
    clarityAndA11y:css.includes(":focus-visible")&&css.includes(".j6-reader-japanese"),
    noNewSaasMaterials:!failures.some(v=>v.includes("glass")||v.includes("hex")),
    documentedVisualGrammar:doc.includes("## Anti-pattern review checklist"),
    playwrightContract:test.includes("test(")
  },
  failures
};
fs.mkdirSync(path.join(root,"artifacts"),{recursive:true});
fs.writeFileSync(path.join(root,"artifacts/j15b-visual-grammar-audit.json"),JSON.stringify(report,null,2)+"\n");
if(failures.length)throw new Error("J15B_VISUAL_GRAMMAR_AUDIT_FAILED: "+failures.join(" | "));
process.stdout.write("J15B visual grammar audit PASS\n");
