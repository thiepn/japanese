import {describe,it,expect} from "vitest";
import {triageJ33,renderJ33} from "../../scripts/j33-evidence-triage.mjs";
import {DOMAINS} from "../../scripts/j28-independent-custody.mjs";
const sha="a".repeat(40);
const fixture=()=>({
 schema:"thiepn-japanese-j32-signoff-intake",version:1,candidateCommit:sha,
 mode:"OPERATOR_ONLY_OFFLINE_INTAKE_NOT_APPROVAL",
 decision:"BLOCKED_REAL_WORLD_ACCEPTANCE_AND_SIGNOFF",missingEvidenceGates:9,
 domains:DOMAINS.map(kind=>({kind,status:"OPEN",humanAcceptance:false,verifiedReviewerIdentity:false,externalPrimarySource:"NOT_PROVIDED_TO_CI"})),
 originalCaseSlots:Array.from({length:42},(_,i)=>({id:"VIS-"+String(i+1).padStart(3,"0"),state:"AWAITING_ORIGINAL"})),
 originalPngSlots:Array.from({length:126},(_,i)=>({id:"PNG-"+String(i+1).padStart(3,"0"),state:"AWAITING_ORIGINAL"})),
 originalCasesHumanAccepted:0,originalPngsHumanAccepted:0,
 humanAcceptanceGranted:false,mergeAuthorized:false,deploymentAuthorized:false,releaseAuthorized:false
});
describe("J33 exact-head operator triage",()=>{
 it("produces 9 genuinely actionable open entries with separately blocked authority",()=>{
  const r=triageJ33(fixture(),sha);
  expect(r.summary).toEqual({open:9,closed:0,p0:5,p1:4,originalCasesAccepted:0,originalPngsAccepted:0,independentHumanSignoffs:0});
  expect(r.entries.map(x=>x.kind).sort()).toEqual([...DOMAINS].sort());
  expect(r.entries.every(x=>x.nextAction.length>50&&x.requiredOriginalWitness&&!x.humanApproved)).toBe(true);
  expect([r.mergeAuthorized,r.deploymentAuthorized,r.releaseAuthorized,r.humanAcceptanceGranted]).toEqual([false,false,false,false]);
 });
 it("renders read-only accessible operator report without release controls",()=>{
  const h=renderJ33(triageJ33(fixture(),sha));
  expect(h).toContain('role="status"');
  expect((h.match(/<tr><th scope="row">/g)||[]).length).toBe(9);
  expect(h).not.toMatch(/<button|<form|<input/i);
 });
 it.each(["humanAcceptanceGranted","mergeAuthorized","deploymentAuthorized","releaseAuthorized"])("rejects forged authority %s",field=>{
  const x=fixture();x[field]=true;expect(()=>triageJ33(x,sha)).toThrow(/J33_/)
 });
 it("rejects cross-commit or malformed source",()=>{
  expect(()=>triageJ33(fixture(),"b".repeat(40))).toThrow(/J33_/);
  expect(()=>triageJ33(fixture(),"main")).toThrow(/J33_/);
 });
 it("rejects forged domain closure and signer identity",()=>{
  const x=fixture();x.domains[0].status="CLOSED";expect(()=>triageJ33(x,sha)).toThrow(/J33_/);
  const y=fixture();y.domains[1].verifiedReviewerIdentity=true;expect(()=>triageJ33(y,sha)).toThrow(/J33_/);
 });
 it("rejects duplicate domains and missing original images",()=>{
  const x=fixture();x.domains[0].kind=x.domains[1].kind;expect(()=>triageJ33(x,sha)).toThrow(/J33_/);
  const y=fixture();y.originalPngSlots.pop();expect(()=>triageJ33(y,sha)).toThrow(/J33_/);
 });
 it("rejects fictitious visual acceptance and tampered slot identities",()=>{
  const x=fixture();x.originalCasesHumanAccepted=1;expect(()=>triageJ33(x,sha)).toThrow(/J33_/);
  const y=fixture();y.originalCaseSlots[0].id="VIS-999";expect(()=>triageJ33(y,sha)).toThrow(/J33_/);
 });
});
