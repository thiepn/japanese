import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const args=process.argv.slice(2);
const i=args.indexOf("--visual");
const visualPath=i>=0?args[i+1]:null;
const strict=args.includes("--strict");
const manifest=JSON.parse(fs.readFileSync(path.join(root,"release/j15d-d4-device-acceptance.json"),"utf8"));
const visual=visualPath&&fs.existsSync(path.resolve(root,visualPath))?JSON.parse(fs.readFileSync(path.resolve(root,visualPath),"utf8")):null;
const issues=[];
const checks=manifest.requiredChecks??[];
if(manifest.schema!=="thiepn-japanese-j15d-d4-physical-acceptance"||manifest.schemaVersion!==1)issues.push("invalid physical manifest schema");
if(checks.length<20||new Set(checks).size!==checks.length)issues.push("physical checks incomplete or duplicated");
if(!["pending","fail","pass"].includes(manifest.status))issues.push("invalid status");
const validCommit=value=>typeof value==="string"&&/^[a-f0-9]{40}$/.test(value);
if(manifest.status==="pass"){
  if(!validCommit(manifest.targetCommit))issues.push("physical pass requires exact 40-hex commit");
  if(!manifest.verifiedAt||!Number.isFinite(Date.parse(manifest.verifiedAt)))issues.push("physical pass missing verification date");
  if(!Array.isArray(manifest.deviceEvidence)||manifest.deviceEvidence.length===0)issues.push("physical device records missing");
  for(const record of manifest.deviceEvidence??[]){
    if(record.platform!=="android"||!record.model||!record.osVersion||!record.browserVersion||record.installedPwa!==true||record.buildCommit!==manifest.targetCommit)issues.push("physical device identity/build mismatch");
    for(const key of checks){
      const value=record.checks?.[key];
      if(value?.status!=="pass"||!value?.verifiedAt||!value?.evidence)issues.push("physical check not verified: "+key);
    }
  }
  if(manifest.defects?.some(d=>d.severity==="blocking"&&d.status!=="resolved"))issues.push("open blocking device defect");
}
const visualValid=visual?.schema==="thiepn-japanese-j15d-d4-visual-comparison"&&visual.passed===true
  &&visual.baselineCommit==="d962c352aab9cd7ad2d9183fb40a3c5671ab7b4a"&&validCommit(visual.candidateCommit)
  &&Array.isArray(visual.cases)&&visual.cases.length>=30&&visual.cases.every(c=>c.passed===true);
if(visual&&!visualValid)issues.push("invalid/failed visual evidence");
if(visualValid&&manifest.status==="pass"&&manifest.targetCommit!==visual.candidateCommit)issues.push("different physical and visual candidate commits");
const automatedStatus=visualValid?"pass":visual?"fail":"pending_visual_comparison";
const physicalStatus=manifest.status==="pass"&&!issues.length?"pass":manifest.status==="fail"?"fail":"pending";
const overall=issues.length?"blocked_invalid_evidence":automatedStatus==="pass"&&physicalStatus==="pass"?"pass":"blocked_physical_or_visual";
const report={schema:"thiepn-japanese-j15d-d4-qualification",schemaVersion:1,overall,automatedStatus,physicalStatus,visualReferenceCommit:"d962c352aab9cd7ad2d9183fb40a3c5671ab7b4a",visualCandidateCommit:visual?.candidateCommit??null,physicalCandidateCommit:manifest.targetCommit??null,comparedCases:visual?.cases?.length??0,physicalRequiredChecks:checks.length,issues,notes:["Emulated Chromium cannot validate TalkBack, hardware safe areas, native audio or actual PWA installation."]};
fs.mkdirSync(path.join(root,"artifacts"),{recursive:true});
fs.writeFileSync(path.join(root,"artifacts/j15d-d4-qualification.json"),JSON.stringify(report,null,2)+"\n");
if(issues.length||(strict&&overall!=="pass"))throw Error("J15D_D4_QUALIFICATION_BLOCKED: "+(issues.join(" | ")||overall));
process.stdout.write("J15D D4 evidence recorded: "+overall+"; visual="+automatedStatus+"; physical="+physicalStatus+"\n");
