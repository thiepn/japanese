import {describe,it,expect} from "vitest";
import {DOMAINS,sha256,blockedWorkbench} from "../../scripts/j28-independent-custody.mjs";
import {reconcileMachine} from "../../scripts/j29-witness-reconciliation.mjs";
import {buildBlockedAudit} from "../../scripts/j30-primary-evidence-audit.mjs";
import {machineHandoff} from "../../scripts/j31-operator-handoff.mjs";
import {machinePreparation} from "../../scripts/j32-signoff-intake.mjs";
import {ESCALATION_PLAN,blankOperatorObservations,reconcileTriage,renderTriageHtml} from "../../scripts/j33-acceptance-triage.mjs";

const SHA="a".repeat(40);
const json=x=>Buffer.from(JSON.stringify(x));
function j27(){
 let previous="0".repeat(64);
 const sequence=["J20","J21","J21-review","J22","J23","J24","J25","J26"].map((name,i)=>{
  const row={name,path:"artifacts/"+name+".json",sha256:sha256(Buffer.from(name)),bytes:i+2};
  const chainSha256=sha256(json({candidateCommit:SHA,previous,...row}));
  const out={...row,previous,chainSha256};previous=chainSha256;return out;
 });
 const releaseManifestDigests=["signoffs","field","production"].map(name=>({name,path:"release/"+name+".json",sha256:sha256(Buffer.from(name)),bytes:3}));
 const base={schema:"thiepn-japanese-j27-evidence-chain",schemaVersion:1,candidateCommit:SHA,sequence,
  releaseManifestDigests,chainRoot:previous,manifestRoot:sha256(json(releaseManifestDigests)),
  originalScreenshotCases:42,originalImageFiles:126,independentVisualArchive:"not_supplied_to_ci",
  trustedHumanApprovals:"not_verified_by_ci",mergeAuthorized:false,deploymentAuthorized:false,
  releaseAuthorized:false,decision:"BLOCKED_INDEPENDENT_ACCEPTANCE_EVIDENCE"};
 return {...base,reportSha256:sha256(json(base))};
}
function fixture(){
 const j27Report=j27(),j28=blockedWorkbench({candidateCommit:SHA,j27:j27Report});
 const j29=reconcileMachine({candidateCommit:SHA,j27:j27Report,j28});
 const j30=buildBlockedAudit({candidateCommit:SHA,j27:j27Report,j28,j29});
 const j31=machineHandoff({candidateCommit:SHA,j27:j27Report,j28,j29,j30});
 const j32=machinePreparation({candidateCommit:SHA,j27:j27Report,j28,j29,j30,j31});
 return {candidateCommit:SHA,j27:j27Report,j28,j29,j30,j31,j32};
}
function observation(kind="realAccountOAuth"){
 return {id:"OBS_OAUTH_001",kind,assessment:"DEFECT_REPORTED",
  description:"Observed signed-out return in physical Android test; requires original device proof",
  reporterRole:"Android field operator",reportedAt:"2026-10-10T12:00:00Z",
  evidencePath:"evidence/android-session.json",evidenceSha256:"f".repeat(64),
  humanAccepted:false,independentIdentityVerified:false,releaseAuthorized:false};
}
function notes(input,observations=[]){
 return {...blankOperatorObservations({candidateCommit:SHA,j32ReportDigest:sha256(json(input.j32))}),
  observations};
}
describe("J33 independent operator discrepancy triage",()=>{
 it("maps all nine J31 discrepancies to prioritized concrete human-owned actions and denies release",()=>{
  const r=reconcileTriage(fixture());
  expect(r.openDiscrepancies).toBe(9);
  expect(r.closedDiscrepancies).toBe(0);
  expect(r.priorities).toHaveLength(9);
  expect(new Set(r.priorities.map(x=>x.kind)).size).toBe(9);
  expect(r.priorities.map(x=>x.kind)).toEqual(ESCALATION_PLAN.map(x=>x.kind));
  expect(r.priorities.slice(0,5).every(x=>x.priority==="P0")).toBe(true);
  expect(r.priorities.every(x=>x.state==="OPEN"&&x.independentHumanAcceptance===false&&x.releaseImpact==="BLOCKING")).toBe(true);
  expect(r.priorities.map(x=>x.discrepancyId)).toEqual(["J31-D02","J31-D03","J31-D04","J31-D07","J31-D01","J31-D05","J31-D06","J31-D08","J31-D09"]);
  expect(r.originalVisualCasesHumanAccepted).toBe(0);
  expect(r.originalPngsHumanAccepted).toBe(0);
  expect(r.operatorNotesAreNotEvidence).toBe(true);
  expect(r.decision).toMatch(/^BLOCKED_/);
  expect([r.humanAcceptanceGranted,r.mergeAuthorized,r.deploymentAuthorized,r.releaseAuthorized]).toEqual([false,false,false,false]);
 });
 it("accepts a source-pointer or defect note ONLY as unverified worklist information",()=>{
  const input=fixture(),o=observation(),r=reconcileTriage({...input,operatorNotes:notes(input,[o])});
  expect(r.reportedObservations).toBe(1);
  expect(r.unverifiedSourceReferences).toBe(1);
  const gate=r.priorities.find(x=>x.kind==="realAccountOAuth");
  expect(gate.triageState).toBe("REPORTED_DEFECT_REQUIRES_REPRODUCTION");
  expect(gate.state).toBe("OPEN");
  expect(gate.observations[0].originalBytesAuthenticated).toBe(false);
  expect(gate.observations[0].reporterIdentityVerified).toBe(false);
  expect(gate.observations[0].humanAccepted).toBe(false);
  expect(r.releaseAuthorized).toBe(false);
 });
 it("escalates conflicting notes without turning them into an accepted signature or human review",()=>{
  const input=fixture();
  const a=observation(),b={...observation(),id:"OBS_CONFLICT_2",assessment:"CONFLICT_REPORTED",description:"Reported evidence checksum conflicts with the earlier account witness"};
  const r=reconcileTriage({...input,operatorNotes:notes(input,[a,b])});
  expect(r.priorities.find(x=>x.kind==="realAccountOAuth").triageState).toBe("CONFLICT_REQUIRES_INDEPENDENT_REVIEW");
  expect(r.openDiscrepancies).toBe(9);
  expect(r.humanAcceptanceGranted).toBe(false);
 });
 it("rejects forged human or release permission in operator notes",()=>{
  const input=fixture(),n=notes(input,[observation()]);
  expect(()=>reconcileTriage({...input,operatorNotes:{...n,releaseAuthorized:true}})).toThrow(/J33_OBSERVATION_ENVELOPE_INVALID/);
  const altered={...observation(),humanAccepted:true};
  expect(()=>reconcileTriage({...input,operatorNotes:notes(input,[altered])})).toThrow(/J33_UNTRUSTED_OBSERVATION/);
  const fake={...observation(),assessment:"APPROVED"};
  expect(()=>reconcileTriage({...input,operatorNotes:notes(input,[fake])})).toThrow(/J33_UNTRUSTED_OBSERVATION/);
 });
 it("rejects wrong candidate, swapped J32 digest, duplicate observations and unsafe source paths",()=>{
  const input=fixture(),n=notes(input,[observation()]);
  expect(()=>reconcileTriage({...input,operatorNotes:{...n,candidateCommit:"b".repeat(40)}})).toThrow(/J33_OBSERVATION_ENVELOPE_INVALID/);
  expect(()=>reconcileTriage({...input,operatorNotes:{...n,j32ReportDigest:"b".repeat(64)}})).toThrow(/J33_OBSERVATION_ENVELOPE_INVALID/);
  expect(()=>reconcileTriage({...input,operatorNotes:notes(input,[observation(),observation()])})).toThrow(/J33_UNTRUSTED_OBSERVATION/);
  const bad={...observation(),evidencePath:"../private.json"};
  expect(()=>reconcileTriage({...input,operatorNotes:notes(input,[bad])})).toThrow(/J33_UNSAFE_UNPINNED_SOURCE_REFERENCE/);
 });
 it("rejects canonical ancestry tamper or fabricated J32 source acceptance",()=>{
  const input=fixture(),bad=structuredClone(input.j32);
  bad.originalCasesHumanAccepted=42;
  expect(()=>reconcileTriage({...input,j32:bad})).toThrow(/J32_CANONICAL|J33_J32_CANONICAL/);
  const wrong=structuredClone(input.j31);
  wrong.discrepancies[0].closureState="CLOSED";
  expect(()=>reconcileTriage({...input,j31:wrong})).toThrow();
 });
 it("separates empty template from primary physical and source evidence",()=>{
  const input=fixture(),template=blankOperatorObservations({candidateCommit:SHA,j32ReportDigest:sha256(json(input.j32))});
  expect(template.observations).toEqual([]);
  expect(template.humanAcceptanceGranted).toBe(false);
  expect(template.mergeAuthorized).toBe(false);
  expect(reconcileTriage({...input,operatorNotes:template}).reportedObservations).toBe(0);
 });
 it("escapes malicious note text and emits no approval, button, form or sign-in controls",()=>{
  const input=fixture(),o={...observation(),description:"<img src=x onerror=alert(1)> & evidence"};
  const r=reconcileTriage({...input,operatorNotes:notes(input,[o])});
  const html=renderTriageHtml(r);
  expect(html).toContain("&lt;img");
  expect(html).not.toContain("<img");
  expect(html).not.toMatch(/<button|<form|<input/i);
  expect(html).toContain("0 / 42");
  expect(html).toContain("0 / 126");
  expect(html).toContain("nine acceptance domains remain OPEN");
  expect(()=>renderTriageHtml({...r,releaseAuthorized:true})).toThrow(/J33_UNSAFE_OPERATOR_REPORT/);
 });
});
