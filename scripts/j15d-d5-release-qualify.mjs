import fs from "node:fs";
import path from "node:path";
import {execFileSync} from "node:child_process";
import {fileURLToPath} from "node:url";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const BASELINE="d962c352aab9cd7ad2d9183fb40a3c5671ab7b4a";
const HEX=/^[a-f0-9]{40}$/;
const args=process.argv.slice(2);
function option(name){const i=args.indexOf(name);return i<0?null:args[i+1]??null;}
const strict=args.includes("--strict");
const requireAutomated=args.includes("--require-automated");
const candidate=option("--candidate")??process.env.J15D_CANDIDATE_SHA??execFileSync("git",["rev-parse","HEAD"],{cwd:ROOT,encoding:"utf8"}).trim();
const visualFile=option("--visual");
function get(name){
  const filename=path.resolve(ROOT,name);
  if(!fs.existsSync(filename))return null;
  try{return JSON.parse(fs.readFileSync(filename,"utf8"));}
  catch{return {invalidJson:true};}
}
const records={
  legacy:get("artifacts/j15d-native-css-purge.json"),
  ownership:get("artifacts/j15d-css-ownership.json"),
  modular:get("artifacts/j15d-d3-css-boundary.json"),
  p22:get("artifacts/p22-bundle-budget.json"),
  j14:get("artifacts/j14-experience-budget.json"),
  theme:get("artifacts/j15-native-theme-audit.json"),
  grammar:get("artifacts/j15b-visual-grammar-audit.json"),
  legibility:get("artifacts/j15c-legibility-audit.json"),
  regression:get("artifacts/j15d-d5-regression-evidence.json"),
  visual:visualFile?get(visualFile):null,
  review:get("release/j15d-d5-visual-review.json"),
  android:get("release/j15d-d4-device-acceptance.json"),
  release:get("release/j15d-d5-release-signoff.json")
};
const requiredAutomated=["typecheck","unitTests","contentValidation","nativeSourceAudit","productionBuild","fullPlaywright","lightDark","accessibilitySmoke","responsive320","offlinePwa"];
const criteria={
  candidateSha:HEX.test(candidate)&&candidate!==BASELINE,
  legacyCss:records.legacy?.passed===true,
  sourceOwnership:records.ownership?.passed===true,
  modularCss:records.modular?.passed===true&&records.modular?.production?.technicalCssChunkNames?.length===1,
  initialEntry:records.p22?.entryGzipBytes<=records.p22?.entryGzipBudgetBytes&&records.p22?.entryGzipBytes>0,
  initialCss:records.p22?.cssGzipBytes<=records.p22?.cssGzipBudgetBytes&&records.p22?.cssGzipBytes>0,
  responsiveLazy:records.j14?.assertions?.technicalDiagnosticsLazy===true&&records.j14?.assertions?.mobileLayerLazy===true&&records.j14?.assertions?.exhibitionLayerLazy===true,
  semanticTheme:records.theme?.passed===true,
  visualGrammar:records.grammar?.passed===true,
  legibility:records.legibility?.passed===true,
  ciRegression:records.regression?.schema==="thiepn-japanese-j15d-d5-regression-evidence"
    &&records.regression?.candidateCommit===candidate
    &&requiredAutomated.every(x=>records.regression?.checks?.[x]===true)
};
const automatedMissing=Object.entries(criteria).filter(([,v])=>v!==true).map(([key])=>key);
const automatedPass=automatedMissing.length===0;
function expectedCaseNames(){
  const rows=[];
  for(const viewport of ["desktop","tablet","android-emulated"])for(const theme of ["light","dark"])for(const surface of ["today","learn","immerse","library","progress"])rows.push([viewport,theme,surface].join("_"));
  for(const [viewport,surface] of [["desktop","study"],["android-emulated","study"],["tablet","reader"],["android-emulated","reader"],["desktop","diagnostics-review"],["android-emulated","diagnostics-release"]])for(const theme of ["light","dark"])rows.push([viewport,theme,surface].join("_"));
  return rows.sort();
}
const expectedNames=expectedCaseNames();
const visual=records.visual;
const visualCaseNames=visual?.cases?.map(x=>x.name).sort();
const visualPass=visual?.schema==="thiepn-japanese-j15d-d4-visual-comparison"
  &&visual?.passed===true&&visual?.baselineCommit===BASELINE&&visual?.candidateCommit===candidate
  &&Array.isArray(visualCaseNames)&&JSON.stringify(visualCaseNames)===JSON.stringify(expectedNames)
  &&visual.cases.every(x=>x.passed===true&&Number.isFinite(x.changedPixelRatio)&&x.changedPixelRatio>=0&&x.changedPixelRatio<=.008);
const review=records.review;
const visualReviewPass=visualPass&&review?.schema==="thiepn-japanese-j15d-d5-visual-review"
  &&review.status==="pass"&&review.baselineCommit===BASELINE&&review.candidateCommit===candidate
  &&review.reviewer&&review.reviewedAt&&Number.isFinite(Date.parse(review.reviewedAt))
  &&typeof review.evidenceRef==="string"&&review.evidenceRef.trim().length>0
  &&Array.isArray(review.reviewedCases)&&JSON.stringify([...new Set(review.reviewedCases)].sort())===JSON.stringify(expectedNames)
  &&!review.defects?.some(x=>x.severity==="blocking"&&x.status!=="resolved");
const physical=records.android;
const physicalChecks=physical?.requiredChecks;
const physicalPass=physical?.schema==="thiepn-japanese-j15d-d4-physical-acceptance"
  &&physical.status==="pass"&&physical.targetCommit===candidate
  &&physical.verifiedAt&&Number.isFinite(Date.parse(physical.verifiedAt))
  &&Array.isArray(physicalChecks)&&physicalChecks.length>=20
  &&Array.isArray(physical.deviceEvidence)&&physical.deviceEvidence.length>0
  &&physical.deviceEvidence.every(d=>d.platform==="android"&&d.buildCommit===candidate&&d.installedPwa===true
    &&d.model&&d.osVersion&&d.browserVersion
    &&physicalChecks.every(key=>d.checks?.[key]?.status==="pass"&&d.checks[key].verifiedAt&&d.checks[key].evidence))
  &&!physical.defects?.some(x=>x.severity==="blocking"&&x.status!=="resolved");
const release=records.release;
const requiredSignoffs=["product","accessibility","releaseOperations"];
const releasePass=release?.schema==="thiepn-japanese-j15d-d5-release-signoff"
  &&release.status==="approved"&&release.candidateCommit===candidate
  &&release.approvedAt&&Number.isFinite(Date.parse(release.approvedAt))
  &&requiredSignoffs.every(key=>release.signoffs?.[key]?.status==="approved"
    &&release.signoffs[key].reviewer&&release.signoffs[key].reviewedAt
    &&release.signoffs[key].evidenceRef)
  &&!release.defects?.some(x=>x.severity==="blocking"&&x.status!=="resolved");
const blockers=[];
if(!automatedPass)blockers.push("Automated integrity/regression evidence missing or failed: "+automatedMissing.join(", "));
if(!visualPass)blockers.push("Exact-candidate 42-case screenshot comparison missing or failed");
if(!visualReviewPass)blockers.push("Independent visual-diff review and signoff still pending");
if(!physicalPass)blockers.push("Exact-commit physical Android PWA tests still pending");
if(!releasePass)blockers.push("Product, accessibility, and release-operations signoffs still pending");
let status="ready_for_controlled_promotion";
if(!automatedPass)status="blocked_automated";
else if(!visualPass)status="blocked_visual_comparison";
else if(!visualReviewPass)status="blocked_visual_review";
else if(!physicalPass)status="blocked_physical_device";
else if(!releasePass)status="blocked_release_signoff";
const report={
  schema:"thiepn-japanese-j15d-d5-release-qualification",schemaVersion:1,
  status,candidateCommit:candidate,baselineCommit:BASELINE,
  automatedPass,automatedChecks:criteria,automatedMissing,
  visualComparisonPass:Boolean(visualPass),visualReviewPass:Boolean(visualReviewPass),
  physicalAndroidPass:Boolean(physicalPass),releaseSignoffsPass:Boolean(releasePass),
  visualComparedCases:visual?.cases?.length??0,requiredVisualCases:expectedNames.length,
  requiredRegressionChecks:requiredAutomated,
  initialBundle:records.p22?{jsGzip:records.p22.entryGzipBytes,jsBudget:records.p22.entryGzipBudgetBytes,cssGzip:records.p22.cssGzipBytes,cssBudget:records.p22.cssGzipBudgetBytes}:null,
  blockers,notes:[
    "A green CI build is not a physical-device, screen-reader, or release approval.",
    "Do not merge or deploy as stable based on a non-strict report.",
    "Visual comparisons and real Android acceptance must reference this exact candidate commit.",
    "Physical evidence and signoff must be obtained on a deployed candidate, not an emulated browser."
  ]
};
fs.mkdirSync(path.join(ROOT,"artifacts"),{recursive:true});
const dst=path.join(ROOT,"artifacts/j15d-d5-release-qualification.json");
fs.writeFileSync(dst,JSON.stringify(report,null,2)+"\n");
const markdown=[
  "# J15D-D5 — Release Qualification","",
  "Candidate: \`"+candidate+"\`",
  "Reference: \`"+BASELINE+"\`",
  "","**Decision: "+status+"**","",
  "| Gate | Evidence |","| --- | --- |",
  "| Automated build, CSS, bundles, browser tests | "+(automatedPass?"PASS":"BLOCKED")+" |",
  "| Visual screenshot comparison (42 cases) | "+(visualPass?"PASS":"PENDING / FAIL")+" |",
  "| Independent visual review | "+(visualReviewPass?"PASS":"PENDING")+" |",
  "| Physical Android PWA | "+(physicalPass?"PASS":"PENDING")+" |",
  "| Product/accessibility/ops approval | "+(releasePass?"PASS":"PENDING")+" |",
  "","## Blockers","",...(blockers.length?blockers.map(x=>"- "+x):["- None"]),
  "","This report is not authorization to mark a pending device manifest as passed.",""
].join("\n");
fs.writeFileSync(path.join(ROOT,"artifacts/j15d-d5-release-qualification.md"),markdown);
process.stdout.write("J15D-D5 release assessment: "+status+" ("+candidate.slice(0,12)+")\n");
if(blockers.length)process.stdout.write(blockers.map(x=>"- "+x).join("\n")+"\n");
if((requireAutomated&&!automatedPass)||(strict&&status!=="ready_for_controlled_promotion"))process.exitCode=1;
