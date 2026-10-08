import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const sha=process.env.J15D_CANDIDATE_SHA;
if(!/^[a-f0-9]{40}$/.test(sha??""))throw Error("J15D_D5_EXACT_SHA_REQUIRED");
if(!process.env.GITHUB_RUN_ID||!process.env.GITHUB_WORKFLOW)throw Error("J15D_D5_CI_PROOF_REQUIRED");
function load(filename){
  const file=path.join(root,filename);
  if(!fs.existsSync(file))throw Error("J15D_D5_MISSING_UPSTREAM_ARTIFACT:"+filename);
  return JSON.parse(fs.readFileSync(file,"utf8"));
}
const mustPass=[
  "artifacts/j15-native-theme-audit.json",
  "artifacts/j15b-visual-grammar-audit.json",
  "artifacts/j15c-legibility-audit.json",
  "artifacts/j15d-native-css-purge.json",
  "artifacts/j15d-css-ownership.json",
  "artifacts/j15d-d3-css-boundary.json"
];
for(const filename of mustPass)if(load(filename).passed!==true)throw Error("J15D_D5_UPSTREAM_AUDIT_FAILED:"+filename);
if(load("artifacts/j14-qualification.json").automatedPass!==true)throw Error("J15D_D5_J14_QUALIFICATION_NOT_PASS");
const budget=load("artifacts/p22-bundle-budget.json");
if(!(budget.entryGzipBytes>0&&budget.entryGzipBytes<=budget.entryGzipBudgetBytes&&budget.cssGzipBytes>0&&budget.cssGzipBytes<=budget.cssGzipBudgetBytes))throw Error("J15D_D5_BUNDLE_FAIL");
const d3=load("artifacts/j15d-d3-css-boundary.json");
if(d3.production?.technicalCssChunkNames?.length!==1)throw Error("J15D_D5_D3_LAZY_SPLIT_FAIL");
// This is written only by the sequential CI job AFTER previous commands and the
// complete Playwright suite have returned successfully. Not proof of a real device.
const report={
  schema:"thiepn-japanese-j15d-d5-regression-evidence",schemaVersion:1,
  candidateCommit:sha,workflowRunId:process.env.GITHUB_RUN_ID,
  workflowName:process.env.GITHUB_WORKFLOW,
  checks:{
    typecheck:true,unitTests:true,contentValidation:true,nativeSourceAudit:true,
    productionBuild:true,fullPlaywright:true,lightDark:true,
    accessibilitySmoke:true,responsive320:true,offlinePwa:true
  },
  note:"Sequential CI success only. Physical Android/TalkBack, image review, and stable release require separate human evidence."
};
fs.mkdirSync(path.join(root,"artifacts"),{recursive:true});
fs.writeFileSync(path.join(root,"artifacts/j15d-d5-regression-evidence.json"),JSON.stringify(report,null,2)+"\n");
process.stdout.write("J15D D5 regression evidence bound to "+sha+"\n");
