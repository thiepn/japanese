import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const css=read("apps/web/src/styles.css");
const main=read("apps/web/src/main.tsx");
const shell=read("apps/web/src/design/J2AppShell.tsx");
const study=read("apps/web/src/study/StudyPlayer.tsx");
const roadmap=read("docs/J15D_ACCEPTANCE.md");
const browser=read("tests/e2e/j15d-native-shell.spec.ts");

// Removed J0-era navigation / study shells. Do not match .j2-nav or .j5-study.
const forbidden=[
  "app-shell","topbar","content","nav","study-shell","study-player","study-head",
  "study-progress","study-card","study-prompt","study-choices","study-feedback","study-next",
];
const selectorRules=[...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
  .flatMap(match=>match[1].split(",").map(s=>s.trim()));
const leaks=selectorRules.filter(sel=>forbidden.some(name=>
  new RegExp("(?:^|[\\s>+~])\\."+name+"(?![A-Za-z0-9_-])").test(sel)
));
const failures=[];
if(leaks.length)failures.push("retired CSS selectors found: "+leaks.join(", "));
for(const essential of [".primary",".course-kicker",".result-card",".reader-token",".p20-readiness",".skip-link"]){
  if(!css.includes(essential+"{")&&!css.includes(essential+","))failures.push("shared active stylesheet selector lost: "+essential);
}
if(!shell.includes("j2-nav")||!study.includes("j5-study"))failures.push("current shell or Study chamber missing");
if(!main.includes('import "./styles.css";')||!main.includes('import "./design/j15b.css";'))failures.push("native style import boundary lost");
if(!roadmap.includes("60 selectors")||!roadmap.includes("physical Android"))failures.push("D qualification scope/boundary not documented");
if(!browser.includes("j5-study")||!browser.includes("box-shadow")||!browser.includes("Search Japanese"))failures.push("cross-surface browser gate missing");
const result={
  schema:"thiepn-japanese-j15d-native-css-purge",schemaVersion:1,
  passed:failures.length===0,
  removedLegacySelectors:forbidden,
  activeSelectorsProtected:["primary","course-kicker","result-card","reader-token","p20-readiness","skip-link"],
  entryCssRuleCount:selectorRules.length,
  removedSelectorsStillPresent:leaks,
  assertions:{oldShellPurged:!leaks.length,sharedLegacySurfacesProtected:!failures.some(s=>s.includes("active stylesheet")),jSeriesEntrypointIntact:main.includes('import "./design/j15b.css";')},
  failures,
};
fs.mkdirSync(path.join(root,"artifacts"),{recursive:true});
fs.writeFileSync(path.join(root,"artifacts/j15d-native-css-purge.json"),JSON.stringify(result,null,2)+"\n");
if(failures.length)throw new Error("J15D_NATIVE_CSS_PURGE_FAILED: "+failures.join(" | "));
process.stdout.write("J15D native CSS purge audit PASS — 13 retired roots, active styles protected\n");
