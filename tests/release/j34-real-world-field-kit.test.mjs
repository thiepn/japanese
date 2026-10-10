import {describe,it,expect} from "vitest";
import {createJ34FieldKit,validateObservationExport,renderJ34FieldKit,J34_GROUPS} from "../../scripts/j34-real-world-field-kit.mjs";

const SHA="a".repeat(40);
const kinds=["realAccountOAuth","physicalAndroidAndTalkBack","independentJapaneseReview",
 "independentP11LearnerReview","exactVisualArchive","independentVisualAccessibilityReview",
 "independentAccessibilitySignoff","exactStagingIdentity","testedRollback"];
const fake=()=>({
 schema:"thiepn-japanese-j33-evidence-triage",version:1,candidateCommit:SHA,
 j32ReportSha256:"b".repeat(64),purpose:"ACTIONABLE_EXTERNAL_OPERATOR_TRIAGE_NOT_APPROVAL",
 decision:"BLOCKED_PENDING_REAL_WORLD_ACCEPTANCE",
 summary:{open:9,closed:0,originalCasesAccepted:0,originalPngsAccepted:0},
 entries:kinds.map((kind,i)=>({kind,discrepancyId:"J33-D"+String(i+1).padStart(2,"0"),state:"OPEN",humanApproved:false,releaseImpact:"BLOCKING"})),
 humanAcceptanceGranted:false,mergeAuthorized:false,deploymentAuthorized:false,releaseAuthorized:false
});
const exportOf=kit=>({
 schema:"thiepn-japanese-j34-operator-observation-export",version:1,candidateCommit:SHA,
 j33ReportSha256:kit.j33ReportSha256,observedCommit:SHA,buildIdentityMatched:true,
 observations:kit.groups.flatMap(g=>g.checks.map(c=>({group:g.id,check:c.id,status:"NOT_TESTED",note:"",evidenceRef:""}))),
 independentlyWitnessed:false,humanAcceptanceGranted:false,mergeAuthorized:false,
 deploymentAuthorized:false,releaseAuthorized:false,finalDecision:"UNVERIFIED_OPERATOR_NOTES_NOT_RELEASE_AUTHORITY"
});
describe("J34 actionable offline field kit",()=>{
 it("binds real test instructions to exact-head blocked J33 with no automatic claims",()=>{
  const kit=createJ34FieldKit(fake(),SHA);
  expect(kit.groups.map(g=>g.id)).toEqual(["oauth","android","language","visual"]);
  expect(kit.groups.find(g=>g.id==="android").checks.map(c=>c.id)).toContain("talkBackTraversal");
  expect(kit.groups.find(g=>g.id==="android").checks.map(c=>c.id)).toContain("localAudioDelete");
  expect(kit.groups.flatMap(g=>g.checks).every(c=>c.state==="NOT_TESTED")).toBe(true);
  expect([kit.humanAcceptanceGranted,kit.mergeAuthorized,kit.deploymentAuthorized,kit.releaseAuthorized]).toEqual([false,false,false,false]);
  expect(J34_GROUPS).toHaveLength(4);
 });
 it("HTML is responsive, local-only, interactive and cannot silently approve",()=>{
  const html=renderJ34FieldKit(createJ34FieldKit(fake(),SHA));
  expect(html).toContain('id="observed"');
  expect(html).toContain("Export unverified session JSON");
  expect(html).toContain("200%"); // original Android procedure
  expect(html).not.toMatch(/fetch\(|XMLHttpRequest|localStorage|indexedDB/);
  expect(html).toContain("independentlyWitnessed:false");
 });
 it("keeps operator passes explicitly unverified",()=>{
  const kit=createJ34FieldKit(fake(),SHA);const e=exportOf(kit);
  e.observations[0].status="OBSERVED_PASS";
  expect(validateObservationExport(e,kit)).toEqual({observations:e.observations.length,operatorPasses:1,independentApprovals:0,decision:"UNVERIFIED_ONLY"});
 });
 it.each(["mergeAuthorized","deploymentAuthorized","releaseAuthorized","humanAcceptanceGranted"])("rejects forged release flag %s",flag=>{
  const f=fake();f[flag]=true;expect(()=>createJ34FieldKit(f,SHA)).toThrow(/J34_/);
  const kit=createJ34FieldKit(fake(),SHA),e=exportOf(kit);e[flag]=true;expect(()=>validateObservationExport(e,kit)).toThrow(/J34_/);
 });
 it("rejects cross head, spoofed close and malformed inventories",()=>{
  const f=fake();expect(()=>createJ34FieldKit(f,"c".repeat(40))).toThrow(/J34_/);
  const a=fake();a.entries[0].state="CLOSED";expect(()=>createJ34FieldKit(a,SHA)).toThrow(/J34_/);
  const b=fake();b.entries.pop();expect(()=>createJ34FieldKit(b,SHA)).toThrow(/J34_/);
  const c=fake();c.summary.originalPngsAccepted=1;expect(()=>createJ34FieldKit(c,SHA)).toThrow(/J34_/);
 });
 it("rejects a pass from the wrong deployed SHA and missing observations",()=>{
  const kit=createJ34FieldKit(fake(),SHA),e=exportOf(kit);e.observedCommit="d".repeat(40);e.buildIdentityMatched=false;e.observations[0].status="OBSERVED_PASS";
  expect(()=>validateObservationExport(e,kit)).toThrow(/J34_CROSS_SHA_PASS_FORBIDDEN/);
  const g=exportOf(kit);g.observations.pop();expect(()=>validateObservationExport(g,kit)).toThrow(/J34_OBSERVATION_COVERAGE/);
 });
 it("rejects forged independent witness claims",()=>{
  const kit=createJ34FieldKit(fake(),SHA),e=exportOf(kit);e.independentlyWitnessed=true;
  expect(()=>validateObservationExport(e,kit)).toThrow(/J34_UNSAFE_OBSERVATION_EXPORT/);
 });
});
