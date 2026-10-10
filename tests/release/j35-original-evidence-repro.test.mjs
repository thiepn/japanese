import {describe,it,expect} from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import {createJ34FieldKit} from "../../scripts/j34-real-world-field-kit.mjs";
import {makeReproductionReport,inspectOriginalFiles,reportMarkdown} from "../../scripts/j35-original-evidence-repro.mjs";

const sha="a".repeat(40),hash=x=>crypto.createHash("sha256").update(x).digest("hex");
const kinds=["realAccountOAuth","physicalAndroidAndTalkBack","independentJapaneseReview","independentP11LearnerReview","exactVisualArchive","independentVisualAccessibilityReview","independentAccessibilitySignoff","exactStagingIdentity","testedRollback"];
function source(){
 const j33={schema:"thiepn-japanese-j33-evidence-triage",version:1,candidateCommit:sha,
 j32ReportSha256:"b".repeat(64),purpose:"ACTIONABLE_EXTERNAL_OPERATOR_TRIAGE_NOT_APPROVAL",
 decision:"BLOCKED_PENDING_REAL_WORLD_ACCEPTANCE",
 summary:{open:9,closed:0,originalCasesAccepted:0,originalPngsAccepted:0},
 entries:kinds.map((kind,i)=>({kind,discrepancyId:"J33-D"+String(i+1).padStart(2,"0"),state:"OPEN",humanApproved:false,releaseImpact:"BLOCKING"})),
 humanAcceptanceGranted:false,mergeAuthorized:false,deploymentAuthorized:false,releaseAuthorized:false};
 return {j33,j34:createJ34FieldKit(j33,sha)};
}
function exportOf(kit){
 return {schema:"thiepn-japanese-j34-operator-observation-export",version:1,candidateCommit:sha,
 j33ReportSha256:kit.j33ReportSha256,observedCommit:sha,buildIdentityMatched:true,
 operatorAlias:"test-operator",recordedAt:"2026-10-10T12:00:00.000Z",
 observations:kit.groups.flatMap(g=>g.checks.map(c=>({group:g.id,check:c.id,status:"NOT_TESTED",note:"",evidenceRef:""}))),
 independentlyWitnessed:false,humanAcceptanceGranted:false,mergeAuthorized:false,deploymentAuthorized:false,
 releaseAuthorized:false,finalDecision:"UNVERIFIED_OPERATOR_NOTES_NOT_RELEASE_AUTHORITY"};
}
const png=Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR4nGP4DwQACfsD/fteaysAAAAASUVORK5CYII=","base64");
function makeInventory(){
 const folder=fs.mkdtempSync(path.join(os.tmpdir(),"j35-synthetic-"));
 fs.mkdirSync(path.join(folder,"original"));
 const cases=Array.from({length:42},(_,i)=>({id:"VIS-"+String(i+1).padStart(3,"0"),originalCaseLabel:"SYNTHETIC CASE "+i,humanCompared:false}));
 const pngs=Array.from({length:126},(_,i)=>{
  const id="PNG-"+String(i+1).padStart(3,"0"),file="example-"+i+".png";
  fs.writeFileSync(path.join(folder,"original",file),png);
  return {id,caseId:cases[i%42].id,relativePath:"original/"+file,originalFilename:file,sha256:hash(png),bytes:png.length,humanApproved:false};
 });
 const manifest={schema:"thiepn-japanese-j35-original-files",version:1,candidateCommit:sha,
 humanApprovedCases:0,humanApprovedPngs:0,cases,pngs};
 const manifestBytes=Buffer.from(JSON.stringify(manifest));
 return {folder,manifest,manifestBytes};
}
describe("J35 real-world defect and original-file operator utility",()=>{
 it("outputs an honest blocked report when no original evidence is provided",()=>{
  const {j33,j34}=source(),r=makeReproductionReport({candidateCommit:sha,j33,j34});
  expect(r.fieldSummary).toEqual({notTested:32,operatorReportedPasses:0,operatorReportedFailures:0});
  expect(r.originalPngBytesInspected).toBe(0);
  expect(r.originalVisualCasesHumanApproved).toBe(0);
  expect([r.mergeAuthorized,r.deploymentAuthorized,r.releaseAuthorized,r.humanAcceptanceGranted]).toEqual([false,false,false,false]);
  expect(reportMarkdown(r)).toContain("real-world testing still pending");
 });
 it("turns real operator *claims* into reproducible safe issue digests without leaking notes",()=>{
  const {j33,j34}=source(),exported=exportOf(j34);
  const secret="OAuth callback failed for person@example.com; token abc-123 must not be logged";
  exported.observations[0].status="OBSERVED_FAIL";exported.observations[0].note=secret;exported.observations[0].evidenceRef="private evidence identifier";
  exported.observations[1].status="OBSERVED_PASS";
  const r=makeReproductionReport({candidateCommit:sha,j33,j34,observation:exported});
  expect(r.fieldSummary).toEqual({notTested:30,operatorReportedPasses:1,operatorReportedFailures:1});
  expect(r.fieldChecks[0].noteSha256).toBe(hash(secret));
  expect(r.fieldChecks[0].nextAction).toBe("REPRODUCE_ON_EXACT_BUILD_AND_FILE_ISSUE");
  expect(r.fieldChecks[1].nextAction).toBe("OBTAIN_INDEPENDENT_WITNESS_AND_AUTHORITY");
  expect(JSON.stringify(r)+reportMarkdown(r)).not.toContain("person@example.com");
  expect(JSON.stringify(r)+reportMarkdown(r)).not.toContain("abc-123");
  expect(r.realAccountOAuthAccepted).toBe(false);
 });
 it.each(["releaseAuthorized","deploymentAuthorized","mergeAuthorized","humanAcceptanceGranted"])("rejects forged %s",flag=>{
  const {j33,j34}=source();j34[flag]=true;
  expect(()=>makeReproductionReport({candidateCommit:sha,j33,j34})).toThrow(/J35_/);
 });
 it("rejects cross-SHA source and operator exports",()=>{
  const {j33,j34}=source();
  expect(()=>makeReproductionReport({candidateCommit:"c".repeat(40),j33,j34})).toThrow(/J35_|J34_/);
  const exportObj=exportOf(j34);exportObj.candidateCommit="d".repeat(40);
  expect(()=>makeReproductionReport({candidateCommit:sha,j33,j34,observation:exportObj})).toThrow(/J34_/);
 });
 it("rejects malformed operator timestamps and forged witness signatures",()=>{
  const {j33,j34}=source(),a=exportOf(j34);a.recordedAt="not a date";
  expect(()=>makeReproductionReport({candidateCommit:sha,j33,j34,observation:a})).toThrow(/J35_/);
  const b=exportOf(j34);b.independentlyWitnessed=true;
  expect(()=>makeReproductionReport({candidateCommit:sha,j33,j34,observation:b})).toThrow(/J34_/);
 });
 it("checks full synthetic bytes but never marks originals independently authentic",()=>{
  const d=makeInventory();
  try{
   const info=inspectOriginalFiles({...d,sourceRoot:d.folder,candidateCommit:sha});
   expect(info.checkedPngs).toBe(126);expect(info.mappedCases).toBe(42);
   expect(info.sourceAuthenticityVerified).toBe(false);
   const {j33,j34}=source(),r=makeReproductionReport({candidateCommit:sha,j33,j34,visual:info});
   expect(r.originalPngBytesInspected).toBe(126);
   expect(r.originalPngsHumanApproved).toBe(0);
   expect(r.releaseAuthorized).toBe(false);
  }finally{fs.rmSync(d.folder,{recursive:true,force:true})}
 });
 it("rejects tampered PNG bytes, missing files and symlink aliases",()=>{
  const d=makeInventory();
  try{
   fs.writeFileSync(path.join(d.folder,"original","example-0.png"),"tampered");
   expect(()=>inspectOriginalFiles({...d,sourceRoot:d.folder,candidateCommit:sha})).toThrow(/J35_ORIGINAL_LENGTH|J35_ORIGINAL_HASH/);
   fs.writeFileSync(path.join(d.folder,"original","example-0.png"),png);
   fs.unlinkSync(path.join(d.folder,"original","example-0.png"));
   fs.symlinkSync(path.join(d.folder,"original","example-1.png"),path.join(d.folder,"original","example-0.png"));
   expect(()=>inspectOriginalFiles({...d,sourceRoot:d.folder,candidateCommit:sha})).toThrow(/J35_ORIGINAL_NONFILE_OR_SYMLINK/);
  }finally{fs.rmSync(d.folder,{recursive:true,force:true})}
 });
 it("rejects PNG payloads with invalid embedded CRC even when manifest SHA matches",()=>{
  const d=makeInventory();
  try{
   const bad=Buffer.from(png);bad[45]^=1;
   fs.writeFileSync(path.join(d.folder,"original","example-0.png"),bad);
   d.manifest.pngs[0].sha256=hash(bad);
   d.manifestBytes=Buffer.from(JSON.stringify(d.manifest));
   expect(()=>inspectOriginalFiles({...d,sourceRoot:d.folder,candidateCommit:sha})).toThrow(/J35_PNG_CRC/);
  }finally{fs.rmSync(d.folder,{recursive:true,force:true})}
 });
 it("rejects missing case coverage, duplicated filenames, forged approvals",()=>{
  const d=makeInventory();
  try{
   for(const i of [0,42,84])d.manifest.pngs[i].caseId=d.manifest.pngs[1].caseId;
   d.manifestBytes=Buffer.from(JSON.stringify(d.manifest));
   expect(()=>inspectOriginalFiles({...d,sourceRoot:d.folder,candidateCommit:sha})).toThrow(/J35_UNMAPPED_CASE/);
   for(const i of [0,42,84])d.manifest.pngs[i].caseId=d.manifest.cases[0].id;
   d.manifest.pngs[0].originalFilename=d.manifest.pngs[1].originalFilename;
   d.manifestBytes=Buffer.from(JSON.stringify(d.manifest));
   expect(()=>inspectOriginalFiles({...d,sourceRoot:d.folder,candidateCommit:sha})).toThrow(/J35_ORIGINAL_PNG_INVENTORY/);
   d.manifest.pngs[0].originalFilename="example-0.png";
   d.manifest.humanApprovedCases=1;
   d.manifestBytes=Buffer.from(JSON.stringify(d.manifest));
   expect(()=>inspectOriginalFiles({...d,sourceRoot:d.folder,candidateCommit:sha})).toThrow(/J35_ORIGINAL_MANIFEST_INVALID/);
  }finally{fs.rmSync(d.folder,{recursive:true,force:true})}
 });
 it("rejects malicious path and cross-commit visual manifest",()=>{
  const d=makeInventory();
  try{
   d.manifest.pngs[0].relativePath="../escape.png";
   d.manifestBytes=Buffer.from(JSON.stringify(d.manifest));
   expect(()=>inspectOriginalFiles({...d,sourceRoot:d.folder,candidateCommit:sha})).toThrow(/J35_ORIGINAL_PNG_INVENTORY/);
   d.manifest.pngs[0].relativePath="original/example-0.png";
   d.manifest.candidateCommit="b".repeat(40);
   d.manifestBytes=Buffer.from(JSON.stringify(d.manifest));
   expect(()=>inspectOriginalFiles({...d,sourceRoot:d.folder,candidateCommit:sha})).toThrow(/J35_ORIGINAL_MANIFEST_INVALID/);
  }finally{fs.rmSync(d.folder,{recursive:true,force:true})}
 });
});
