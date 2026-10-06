import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const DEFAULT_REGRESSION="artifacts/p21-regression-evidence.json";
const DEFAULT_DEVICE="release/p21-device-acceptance.json";
const DEFAULT_P11="artifacts/p11-release-candidate-qualification.json";

export const P21_AUTOMATED_KEYS=[
  "typecheck",
  "unitTests",
  "contentValidation",
  "nativeProvenanceAudit",
  "productionBuild",
  "e2e",
  "desktopViewport",
  "androidViewport",
  "compactViewport",
  "pwaOffline",
  "accessibilitySmoke",
  "privateAudioBoundary"
];

export const P21_REQUIRED_DEVICE_CHECKS=[
  "installStandalone",
  "coreSurfaces",
  "studyControls",
  "speakerAudio",
  "headphoneAudio",
  "offlineReload",
  "backgroundResume",
  "rotation",
  "largeText",
  "microphoneRecording",
  "localAudioDelete",
  "safeAreaNavigation"
];

export function readJson(filePath){return JSON.parse(fs.readFileSync(filePath,"utf8"));}

export function normalizeP21RegressionEvidence(value={}){
  return Object.fromEntries(P21_AUTOMATED_KEYS.map((key)=>[key,value[key]===true]));
}

export function summarizeDeviceAcceptance(manifest){
  if(!manifest||typeof manifest!=="object")throw new Error("P21_DEVICE_ACCEPTANCE_INVALID");
  if(manifest.schema!=="thiepn-japanese-p21-device-acceptance")throw new Error("P21_DEVICE_ACCEPTANCE_SCHEMA_INVALID");
  if(manifest.schemaVersion!==1)throw new Error("P21_DEVICE_ACCEPTANCE_VERSION_UNSUPPORTED");
  if(!["pending","passed","failed"].includes(manifest.status))throw new Error("P21_DEVICE_ACCEPTANCE_STATUS_INVALID");
  if(!Array.isArray(manifest.devices))throw new Error("P21_DEVICE_ACCEPTANCE_DEVICES_REQUIRED");
  if(!Array.isArray(manifest.requiredChecks))throw new Error("P21_DEVICE_ACCEPTANCE_CHECKS_REQUIRED");
  if(!Array.isArray(manifest.defects))throw new Error("P21_DEVICE_ACCEPTANCE_DEFECTS_REQUIRED");

  const declared=new Set(manifest.requiredChecks);
  for(const check of P21_REQUIRED_DEVICE_CHECKS){
    if(!declared.has(check))throw new Error("P21_DEVICE_ACCEPTANCE_REQUIRED_CHECK_MISSING:"+check);
  }

  const ids=new Set();
  const deviceSummaries=manifest.devices.map((device,index)=>{
    const where="device "+(index+1);
    requireString(device?.id,where+" id");
    if(ids.has(device.id))throw new Error("P21_DEVICE_ACCEPTANCE_DUPLICATE_DEVICE:"+device.id);
    ids.add(device.id);
    requireString(device?.deviceModel,where+" deviceModel");
    requireString(device?.osVersion,where+" osVersion");
    requireString(device?.browserVersion,where+" browserVersion");
    if(device.installMode!=="standalone-pwa")throw new Error("P21_DEVICE_ACCEPTANCE_INSTALL_MODE_INVALID:"+device.id);
    requireIsoDate(device.testedAt,"P21_DEVICE_ACCEPTANCE_DATE_INVALID:"+device.id);
    if(!device.checks||typeof device.checks!=="object")throw new Error("P21_DEVICE_ACCEPTANCE_DEVICE_CHECKS_REQUIRED:"+device.id);
    const checks=Object.fromEntries(P21_REQUIRED_DEVICE_CHECKS.map((key)=>[key,device.checks[key]===true]));
    const passed=Object.values(checks).filter(Boolean).length;
    return {
      id:device.id,
      deviceModel:device.deviceModel,
      osVersion:device.osVersion,
      browserVersion:device.browserVersion,
      installMode:device.installMode,
      testedAt:device.testedAt,
      checks,
      passed,
      total:P21_REQUIRED_DEVICE_CHECKS.length,
      complete:passed===P21_REQUIRED_DEVICE_CHECKS.length
    };
  });

  const defects=manifest.defects.map((defect,index)=>{
    const where="defect "+(index+1);
    requireString(defect?.id,where+" id");
    requireString(defect?.summary,where+" summary");
    if(!["critical","high","medium","low"].includes(defect?.severity))throw new Error("P21_DEVICE_ACCEPTANCE_DEFECT_SEVERITY_INVALID:"+defect?.id);
    if(!["open","fixed","accepted"].includes(defect?.status))throw new Error("P21_DEVICE_ACCEPTANCE_DEFECT_STATUS_INVALID:"+defect?.id);
    return {
      id:defect.id,
      severity:defect.severity,
      status:defect.status,
      summary:defect.summary,
      releaseBlocking:defect.releaseBlocking===true||(["critical","high","medium"].includes(defect.severity)&&defect.status==="open")
    };
  });
  const blockingDefects=defects.filter((item)=>item.status==="open"&&item.releaseBlocking);
  const completeDevices=deviceSummaries.filter((item)=>item.complete).length;
  const qualified=manifest.status==="passed"&&completeDevices>=1&&blockingDefects.length===0;
  return {
    status:manifest.status,
    devices:deviceSummaries,
    physicalDevices:deviceSummaries.length,
    completeDevices,
    blockingDefects,
    defects,
    qualified
  };
}

export function buildP21ReleaseReport({regression,device,p11,generatedAt=new Date().toISOString(),commit=process.env.GITHUB_SHA??null}){
  const automated=normalizeP21RegressionEvidence(regression);
  const automatedChecks=P21_AUTOMATED_KEYS.map((key)=>check(
    "automated-"+key,
    automatedLabel(key),
    "pass",
    automated[key]?"pass":"not certified",
    automated[key],
    "automated"
  ));
  const automatedQualified=Object.values(automated).every(Boolean);
  const p11Qualified=p11?.releaseCandidateQualified===true;
  const deviceChecks=[
    check("physical-device-recorded","Physical Android/PWA acceptance recorded",">=1 complete device",String(device.completeDevices),device.completeDevices>=1,"device"),
    check("physical-device-status","Physical-device manifest status","passed",device.status,device.status==="passed","device"),
    check("device-blockers","Open release-blocking device defects","0",String(device.blockingDefects.length),device.blockingDefects.length===0,"device")
  ];
  const evidenceCheck=check(
    "p11-external-release-evidence",
    "Independent P11 external productive-language validation",
    "qualified",
    p11Qualified?"qualified":String(p11?.decision??"not qualified"),
    p11Qualified,
    "evidence"
  );
  const checks=[...automatedChecks,...deviceChecks,evidenceCheck];
  const technicalReleaseReady=automatedQualified&&device.qualified;
  const evidenceReleaseReady=p11Qualified;
  const stableReleaseReady=technicalReleaseReady&&evidenceReleaseReady;
  let decision;
  if(!automatedQualified)decision="HOLD_AUTOMATED_REGRESSION";
  else if(!device.qualified&&!p11Qualified)decision="HOLD_EXTERNAL_VALIDATION_AND_DEVICE";
  else if(!device.qualified)decision="HOLD_REAL_DEVICE_ACCEPTANCE";
  else if(!p11Qualified)decision="HOLD_EXTERNAL_VALIDATION";
  else decision="READY_FOR_STABLE_RELEASE";

  return {
    schema:"thiepn-japanese-p21-release-candidate",
    schemaVersion:1,
    generatedAt,
    commit,
    capabilityFreeze:"P20",
    hardeningPhase:"P21",
    stableReleaseReady,
    technicalReleaseReady,
    evidenceReleaseReady,
    decision,
    passed:checks.filter((item)=>item.passed).length,
    total:checks.length,
    checks,
    automatedEvidence:automated,
    physicalDeviceAcceptance:device,
    p11:{
      releaseCandidateQualified:p11Qualified,
      decision:p11?.decision??null,
      passed:p11?.passed??null,
      total:p11?.total??null
    },
    evidenceBoundary:{
      automatedBrowserProfilesArePhysicalDevices:false,
      physicalDeviceAcceptanceCanBeInferred:false,
      p11ExternalValidationCanBeWaivedByP21:false,
      productReleaseIsLearnerCefrCertification:false
    }
  };
}

export function reportMarkdown(report){
  const blockers=report.checks.filter((item)=>!item.passed);
  return [
    "# P21 Final Product Release Candidate",
    "",
    "Generated: "+report.generatedAt,
    "Commit: "+(report.commit??"local"),
    "Decision: "+report.decision,
    "Stable release ready: "+(report.stableReleaseReady?"YES":"NO"),
    "Technical release ready: "+(report.technicalReleaseReady?"YES":"NO"),
    "Independent release-evidence ready: "+(report.evidenceReleaseReady?"YES":"NO"),
    "Checks: "+report.passed+" / "+report.total,
    "",
    "P21 freezes capability growth at P20. This gate is product/release evidence, not learner CEFR certification.",
    "",
    "## Checks",
    "",
    "| Category | Check | Required | Actual | Result |",
    "| --- | --- | --- | --- | --- |",
    ...report.checks.map((item)=>"| "+item.category+" | "+item.label+" | "+item.required+" | "+item.actual+" | "+(item.passed?"PASS":"HOLD")+" |"),
    "",
    "## Physical-device acceptance",
    "",
    "- Manifest status: "+report.physicalDeviceAcceptance.status,
    "- Physical devices recorded: "+report.physicalDeviceAcceptance.physicalDevices,
    "- Complete devices: "+report.physicalDeviceAcceptance.completeDevices,
    "- Open release-blocking defects: "+report.physicalDeviceAcceptance.blockingDefects.length,
    ...report.physicalDeviceAcceptance.devices.map((item)=>"- "+item.deviceModel+" · "+item.osVersion+" · "+item.browserVersion+" · "+item.passed+"/"+item.total+" checks · "+(item.complete?"complete":"incomplete")),
    "",
    "## Blockers",
    "",
    ...(blockers.length?blockers.map((item)=>"- "+item.label+": requires "+item.required+", actual "+item.actual):["- None. The stable-release gate is open."]),
    "",
    "## Evidence boundary",
    "",
    "- Playwright mobile profiles do not count as a physical handset.",
    "- P21 cannot infer or fabricate physical-device acceptance.",
    "- P21 does not waive the independent P11 external-validation track.",
    "- Product release qualification is not an accredited learner CEFR result."
  ].join("\n");
}

function automatedLabel(key){
  const labels={
    typecheck:"TypeScript typecheck",
    unitTests:"Unit/integration tests",
    contentValidation:"Content validation",
    nativeProvenanceAudit:"Native/provenance audit",
    productionBuild:"Production build",
    e2e:"Full Playwright suite",
    desktopViewport:"Desktop Chromium acceptance",
    androidViewport:"Android device-profile acceptance",
    compactViewport:"Compact 360×740 acceptance",
    pwaOffline:"PWA offline reload drill",
    accessibilitySmoke:"Keyboard/accessibility smoke",
    privateAudioBoundary:"Private P19 raw-audio boundary test"
  };
  return labels[key]??key;
}

function check(id,label,required,actual,passed,category){return {id,label,required,actual,passed:Boolean(passed),category};}
function requireString(value,label){if(typeof value!=="string"||!value.trim())throw new Error("P21_FIELD_REQUIRED:"+label);}
function requireIsoDate(value,errorCode){if(typeof value!=="string"||!Number.isFinite(Date.parse(value)))throw new Error(errorCode);}

function parseArgs(args){
  const out={regression:DEFAULT_REGRESSION,device:DEFAULT_DEVICE,p11:DEFAULT_P11,outDir:"artifacts",strict:false};
  for(let i=0;i<args.length;i+=1){
    const arg=args[i];
    if(arg==="--strict"){out.strict=true;continue;}
    if(arg==="--regression"){out.regression=args[++i];continue;}
    if(arg==="--device"){out.device=args[++i];continue;}
    if(arg==="--p11"){out.p11=args[++i];continue;}
    if(arg==="--out-dir"){out.outDir=args[++i];continue;}
    throw new Error("UNKNOWN_ARGUMENT:"+arg);
  }
  return out;
}

export function runCli(args=process.argv.slice(2)){
  const options=parseArgs(args);
  const regression=readJson(path.resolve(ROOT,options.regression));
  const device=summarizeDeviceAcceptance(readJson(path.resolve(ROOT,options.device)));
  const p11=readJson(path.resolve(ROOT,options.p11));
  const report=buildP21ReleaseReport({regression,device,p11});
  const outDir=path.resolve(ROOT,options.outDir);
  fs.mkdirSync(outDir,{recursive:true});
  fs.writeFileSync(path.join(outDir,"p21-release-candidate.json"),JSON.stringify(report,null,2)+"\n");
  fs.writeFileSync(path.join(outDir,"p21-release-candidate.md"),reportMarkdown(report)+"\n");
  process.stdout.write("P21 "+report.decision+" — "+report.passed+"/"+report.total+" checks passed\n");
  for(const blocker of report.checks.filter((item)=>!item.passed)){
    process.stdout.write("HOLD "+blocker.id+": "+blocker.actual+" (required "+blocker.required+")\n");
  }
  if(options.strict&&!report.stableReleaseReady)process.exitCode=1;
  return report;
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))runCli();
