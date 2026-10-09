import {describe,expect,it} from "vitest";
import {auditAndBuildPacket} from "../../scripts/j21-language-audit.mjs";
import {
 checkMachinePrerequisites,validateSubmittedEvidence,reconcile,EVIDENCE_KINDS
} from "../../scripts/j23-release-reconciliation.mjs";
const SHA="d".repeat(40);
const packet=()=>{
 const data={sourceIds:["thiepn-original"],
   grammar:[{id:"a",sourceIds:["thiepn-original"],label:"〜ながら"}],
   lexemes:[{id:"b",sourceIds:["thiepn-original"],canonicalForm:"日本語"}]};
 return auditAndBuildPacket({
   candidateCommit:SHA,registry:{sources:[{id:"thiepn-original",publicExport:true,license:"owned"}]},
   manifest:{sources:["thiepn-original"]},seeds:[{filename:"fixture.json",raw:JSON.stringify(data),data}]
 }).packet;
};
function fixture(){
 return {
  candidateCommit:SHA,
  machine:{
   j20:{schema:"thiepn-japanese-j20-automated-qualification",candidateCommit:SHA,
    automated:{status:"passed"},releaseDecision:"not_authorized"},
   j21:{schema:"thiepn-japanese-j21-content-audit",candidateCommit:SHA,
    integrityStatus:"passed",semanticJapaneseReview:"pending",externalHumanReview:"not_obtained",releaseAuthorized:false},
   j21Packet:packet(),
   j22:{schema:"thiepn-japanese-j22-acceptance",candidateCommit:SHA,
    baselineCommit:"d962c352aab9cd7ad2d9183fb40a3c5671ab7b4a",
    expectedCases:42,requiredImageCount:126,visualArchiveStatus:"pending-exact-head-j15d-d4-artifact",
    independentVisualReview:"pending",humanAccessibility:"pending",physicalAndroid:"pending",realOAuth:"pending",releaseAuthorized:false}
  },
  visualReview:{schema:"thiepn-japanese-j15d-d5-visual-review",status:"pending",reviewedCases:[]},
  deviceReview:{schema:"thiepn-japanese-j15d-d4-physical-acceptance",status:"pending",deviceEvidence:[]},
  p21Device:{schema:"thiepn-japanese-p21-device-acceptance",status:"pending",devices:[]},
  p11External:{schema:"thiepn-japanese-p11-external-validation",reviews:[]},
  signoff:{schema:"thiepn-japanese-j15d-d5-release-signoff",status:"pending",defects:[],
   signoffs:{product:{status:"pending"},accessibility:{status:"pending"},releaseOperations:{status:"pending"}}},
  field:{schema:"thiepn-japanese-j16-field-acceptance",status:"pending",
   stablePromotion:"not_authorized",rollback:{tested:false,lastKnownGoodCommit:null}},
  production:{schema:"thiepn-japanese-p22-production",status:"candidate",releaseCommit:null,activatedAt:null}
 };
}
function completeSubmission(){
 const digest="sha256:"+"a".repeat(64);
 const records=Object.fromEntries(EVIDENCE_KINDS.map(name=>[name,{
   status:"submitted",candidateCommit:SHA,artifactDigest:digest,evidenceRef:digest
 }]));
 return {schema:"thiepn-japanese-j23-independent-evidence-submission",
  candidateCommit:SHA,releaseAuthorized:false,humanApprovalGranted:false,records,
  reviewerAssertions:[{role:"release-operator",evidenceRef:digest,identityVerified:false,approved:false}]};
}
describe("J23 release evidence gate — never infer human or release approval",()=>{
 it("builds a BLOCKED report with explicit missing review/device/OAuth/visual/rollback blockers",()=>{
  const result=reconcile(fixture());
  expect(result.automatedIntegrity).toBe("passed");
  expect(result.decision).toBe("BLOCKED_AWAITING_INDEPENDENT_EVIDENCE");
  expect(result.blockers).toHaveLength(9);
  expect(result.expectedVisualCases).toBe(42);
  expect(result.expectedVisualImages).toBe(126);
  expect(result.releaseAuthorized).toBe(false);
 });
 it("rejects a J20 artifact from another candidate",()=>{
  const value=fixture();value.machine.j20.candidateCommit="a".repeat(40);
  expect(()=>checkMachinePrerequisites({candidateCommit:SHA,...value.machine})).toThrow(/J23_CANDIDATE_MISMATCH:j20/);
 });
 it("rejects tampered J21 review-packet SHA-256 and fabricated semantic review",()=>{
  const value=fixture();value.machine.j21Packet.items[0].japanese="tampered";
  expect(()=>reconcile(value)).toThrow(/J21_PACKET_DIGEST_MISMATCH/);
  const other=fixture();other.machine.j21.semanticJapaneseReview="approved";
  expect(()=>reconcile(other)).toThrow(/J23_J21_CONTENT_EVIDENCE_INVALID/);
 });
 it("refuses missing exact-SHA visual archive and forged automated release authorization",()=>{
  const value=fixture();value.machine.j22.visualArchiveStatus="passed";
  expect(()=>reconcile(value)).toThrow(/J23_J22_ACCEPTANCE_BOUNDARY_INVALID/);
  const other=fixture();other.machine.j22.releaseAuthorized=true;
  expect(()=>reconcile(other)).toThrow(/J23_UNVERIFIED_AUTO_APPROVAL/);
 });
 it("rejects forged physical Android evidence in checked-in source-branch manifest",()=>{
  const value=fixture();value.deviceReview.status="pass";
  expect(()=>reconcile(value)).toThrow(/J23_UNVERIFIED_HUMAN_MANIFEST_CHANGED/);
  const other=fixture();other.p21Device.devices=[{status:"passed"}];
  expect(()=>reconcile(other)).toThrow(/J23_UNVERIFIED_EVIDENCE_INSERTED_IN_SOURCE_BRANCH/);
 });
 it("rejects unauthorized production and fictitious rollback drill/signoff",()=>{
  const first=fixture();first.production.releaseCommit=SHA;
  expect(()=>reconcile(first)).toThrow(/J23_UNAUTHORIZED_PRODUCTION_IDENTITY/);
  const second=fixture();second.field.rollback.tested=true;
  expect(()=>reconcile(second)).toThrow(/J23_RELEASE_SIGNOFF_OR_ROLLBACK_SPOOFED/);
  const third=fixture();third.signoff.signoffs.accessibility.status="pass";
  expect(()=>reconcile(third)).toThrow(/J23_RELEASE_SIGNOFF_OR_ROLLBACK_SPOOFED/);
 });
 it("validates content-addressed receipt syntax but never authorizes actual human approvals",()=>{
  const result=validateSubmittedEvidence({candidateCommit:SHA,bundle:completeSubmission()});
  expect(result.structureValid).toBe(true);
  expect(result.reviewerIdentityVerified).toBe(false);
  expect(result.physicalAndroidVerified).toBe(false);
  expect(result.releaseAuthorized).toBe(false);
 });
 it("rejects fake approvals, wrong commit, missing categories and arbitrary evidence URLs",()=>{
  const approve=completeSubmission();approve.releaseAuthorized=true;
  expect(()=>validateSubmittedEvidence({candidateCommit:SHA,bundle:approve})).toThrow(/J23_SUBMISSION_CANNOT_APPROVE_RELEASE/);
  const mismatch=completeSubmission();mismatch.records.realAccountOAuth.candidateCommit="c".repeat(40);
  expect(()=>validateSubmittedEvidence({candidateCommit:SHA,bundle:mismatch})).toThrow(/J23_EVIDENCE_NOT_EXACT_SHA/);
  const missing=completeSubmission();delete missing.records.independentJapaneseReview;
  expect(()=>validateSubmittedEvidence({candidateCommit:SHA,bundle:missing})).toThrow(/J23_EVIDENCE_CATEGORIES_INCOMPLETE/);
  const forged=completeSubmission();forged.records.physicalAndroidAndTalkBack.evidenceRef="https://example.com/a-secret";
  expect(()=>validateSubmittedEvidence({candidateCommit:SHA,bundle:forged})).toThrow(/J23_CONTENT_ADDRESSED_EVIDENCE_REQUIRED/);
  const human=completeSubmission();human.reviewerAssertions[0].identityVerified=true;
  expect(()=>validateSubmittedEvidence({candidateCommit:SHA,bundle:human})).toThrow(/J23_UNVERIFIED_OR_DUPLICATE_REVIEWER_ASSERTION/);
 });
});
