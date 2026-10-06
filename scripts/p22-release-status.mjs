import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { summarizeProductionManifest } from "./p22-production-monitor.mjs";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");

export function buildP22ReleaseStatus({p21,productionManifest,smoke=null,generatedAt=new Date().toISOString(),commit=process.env.GITHUB_SHA??null}){
  if(!p21||typeof p21!=="object")throw new Error("P22_P21_REPORT_REQUIRED");
  const production=summarizeProductionManifest(productionManifest);
  const p21Ready=p21.stableReleaseReady===true;
  const active=production.active;
  const smokeHealthy=smoke?.healthy===true;
  const productionCommitMatches=active&&production.releaseCommit
    ?String(smoke?.expectedCommit??production.releaseCommit).toLowerCase()===production.releaseCommit.toLowerCase()
    :false;

  let decision;
  if(!p21Ready&&!active)decision="HOLD_P21_RELEASE_GATE";
  else if(p21Ready&&!active)decision="READY_TO_ACTIVATE";
  else if(active&&production.maintenanceMode)decision="PRODUCTION_MAINTENANCE";
  else if(active&&production.blockingIncidents.length)decision="HOLD_PRODUCTION_INCIDENT";
  else if(active&&!smokeHealthy)decision="HOLD_PRODUCTION_MONITOR";
  else if(active&&!productionCommitMatches)decision="HOLD_RELEASE_IDENTITY_MISMATCH";
  else decision="PRODUCTION_STABLE";

  const stableProduction=decision==="PRODUCTION_STABLE";
  return {
    schema:"thiepn-japanese-p22-release-status",
    schemaVersion:1,
    generatedAt,
    commit,
    capabilityFreeze:"P20",
    hardeningBaseline:"P21",
    decision,
    p21Ready,
    activationReady:p21Ready&&!active,
    productionActive:active,
    productionStable:stableProduction,
    production,
    productionSmoke:smoke,
    evidenceBoundary:{
      p21CanBeWaived:false,
      productionCanBeClaimedWithoutDeployment:false,
      syntheticSmokeIsRealDeviceAcceptance:false,
      productReleaseIsLearnerCefrCertification:false
    }
  };
}

export function reportMarkdown(report){
  return [
    "# P22 Stable Release Status",
    "",
    "- Generated: "+report.generatedAt,
    "- Repository commit: "+(report.commit??"local"),
    "- Decision: "+report.decision,
    "- P21 gate ready: "+(report.p21Ready?"yes":"no"),
    "- Activation ready: "+(report.activationReady?"yes":"no"),
    "- Production active: "+(report.productionActive?"yes":"no"),
    "- Production stable: "+(report.productionStable?"yes":"no"),
    "",
    "## Production",
    "",
    "- Status: "+report.production.status,
    "- URL: "+(report.production.publicUrl??"not configured"),
    "- Release commit: "+(report.production.releaseCommit??"none"),
    "- Release tag: "+(report.production.releaseTag??"none"),
    "- Maintenance mode: "+(report.production.maintenanceMode?"on":"off"),
    "- Open incidents: "+report.production.openIncidents.length,
    "- Blocking incidents: "+report.production.blockingIncidents.length,
    "",
    "## Evidence boundary",
    "",
    "- P22 does not waive the strict P21 release gate.",
    "- A GitHub release artifact is not evidence that production deployment succeeded.",
    "- Synthetic production monitoring is not a substitute for physical-device acceptance.",
    "- Product release state is not an accredited learner CEFR result."
  ].join("\n");
}

export function runCli(args=process.argv.slice(2)){
  let p21Path="artifacts/p21-release-candidate.json";
  let productionPath="release/p22-production.json";
  let smokePath=null;
  let outDir="artifacts";
  for(let i=0;i<args.length;i+=1){
    const arg=args[i];
    if(arg==="--p21"){p21Path=args[++i];continue;}
    if(arg==="--production"){productionPath=args[++i];continue;}
    if(arg==="--smoke"){smokePath=args[++i];continue;}
    if(arg==="--out-dir"){outDir=args[++i];continue;}
    throw new Error("UNKNOWN_ARGUMENT:"+arg);
  }

  const p21=JSON.parse(fs.readFileSync(path.resolve(ROOT,p21Path),"utf8"));
  const productionManifest=JSON.parse(fs.readFileSync(path.resolve(ROOT,productionPath),"utf8"));
  const smoke=smokePath&&fs.existsSync(path.resolve(ROOT,smokePath))
    ?JSON.parse(fs.readFileSync(path.resolve(ROOT,smokePath),"utf8"))
    :null;
  const report=buildP22ReleaseStatus({p21,productionManifest,smoke});
  const target=path.resolve(ROOT,outDir);
  fs.mkdirSync(target,{recursive:true});
  fs.writeFileSync(path.join(target,"p22-release-status.json"),JSON.stringify(report,null,2)+"\n");
  fs.writeFileSync(path.join(target,"p22-release-status.md"),reportMarkdown(report)+"\n");
  process.stdout.write("P22 "+report.decision+"\n");
  return report;
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))runCli();
