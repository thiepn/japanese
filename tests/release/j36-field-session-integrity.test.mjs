import {describe,it,expect} from "vitest";
import {createJ34FieldKit,renderJ34FieldKit} from "../../scripts/j34-real-world-field-kit.mjs";
import {makeReproductionReport} from "../../scripts/j35-original-evidence-repro.mjs";
const commit="a".repeat(40);
const kinds=["realAccountOAuth","physicalAndroidAndTalkBack","independentJapaneseReview","independentP11LearnerReview","exactVisualArchive","independentVisualAccessibilityReview","independentAccessibilitySignoff","exactStagingIdentity","testedRollback"];
function fixture(){
 const j33={schema:"thiepn-japanese-j33-evidence-triage",version:1,candidateCommit:commit,
 j32ReportSha256:"b".repeat(64),purpose:"ACTIONABLE_EXTERNAL_OPERATOR_TRIAGE_NOT_APPROVAL",
 decision:"BLOCKED_PENDING_REAL_WORLD_ACCEPTANCE",
 summary:{open:9,closed:0,originalCasesAccepted:0,originalPngsAccepted:0},
 entries:kinds.map((kind,i)=>({kind,discrepancyId:"J33-D"+String(i+1).padStart(2,"0"),state:"OPEN",humanApproved:false,releaseImpact:"BLOCKING"})),
 humanAcceptanceGranted:false,mergeAuthorized:false,deploymentAuthorized:false,releaseAuthorized:false};
 return {j33,j34:createJ34FieldKit(j33,commit)};
}
describe("J36 source integrity and offline recovery",()=>{
 it("demonstrates and blocks forged 126-file visual inspection summaries",()=>{
  const {j33,j34}=fixture();
  const forged={schema:"thiepn-japanese-j35-original-bytes-inventory",version:1,
    candidateCommit:commit,checkedPngs:126,mappedCases:42,manifestSha256:"f".repeat(64),
    humanApprovedCases:0,humanApprovedPngs:0,sourceAuthenticityVerified:false,
    humanAcceptanceGranted:false,releaseAuthorized:false};
  expect(()=>makeReproductionReport({candidateCommit:commit,j33,j34,visual:forged}))
    .toThrow(/J35_VISUAL_SUMMARY_INVALID/);
  expect(makeReproductionReport({candidateCommit:commit,j33,j34}).originalPngBytesInspected).toBe(0);
 });
 it("requires offline import to remain an unverified local-only session",()=>{
  const {j34}=fixture(),html=renderJ34FieldKit(j34);
  expect(html).toContain('id="resume" type="file"');
  expect(html).toContain("Prior unverified notes restored locally");
  expect(html).toContain("Import rejected: missing, altered or mismatched");
  expect(html).not.toMatch(/fetch\(|XMLHttpRequest|localStorage|sessionStorage|indexedDB/);
  expect(j34.releaseAuthorized).toBe(false);
 });
});
