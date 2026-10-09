import {describe,expect,it} from "vitest";
import {PNG} from "pngjs";
import {
  auditArchive,blankReview,createPendingEvidence,
  digest,requiredImageNames,validateReviewSubmission,verifyPacket,
} from "../../scripts/j22-visual-accessibility.mjs";
import {BASELINE,visualCaseNames} from "../../scripts/j16c-build-visual-review.mjs";

const SHA="c".repeat(40);
const png=new PNG({width:12,height:12});
for(let i=0;i<png.data.length;i+=4){
  png.data[i]=(i/4)%256;png.data[i+1]=(i/4*11)%256;
  png.data[i+2]=(i/4*73)%256;png.data[i+3]=255;
}
const image=PNG.sync.write(png);
const report=()=>({
  schema:"thiepn-japanese-j15d-d4-visual-comparison",schemaVersion:1,
  baselineCommit:BASELINE,candidateCommit:SHA,passed:true,
  cases:visualCaseNames().map(name=>({name,changedPixelRatio:0,passed:true}))
});
const valid=()=>auditArchive({candidateCommit:SHA,report:report(),readImage:()=>image});
function submitted(packet){
  const result=blankReview(packet);
  result.reviewer={name:"Synthetic reviewer for test only",role:"visual-reviewer",independentToProject:true,
    reviewedAt:"2026-10-10T11:00:00Z",evidenceRef:"fixture-only:not-an-approval"};
  result.cases=result.cases.map(item=>({...item,status:"pass"}));
  result.accessibility=Object.fromEntries(Object.keys(result.accessibility).map(key=>[key,{
    status:"pass",evidenceRef:"fixture-only:"+key,notes:""
  }]));
  result.decision="reviewed-no-defects";
  return result;
}
describe("J22 42-case visual integrity and separate human acceptance",()=>{
  it("requires all 42 cases, 126 actual decodable PNG images and exact source SHA",()=>{
    expect(requiredImageNames()).toHaveLength(126);
    const packet=valid();
    expect(packet.cases).toHaveLength(42);
    expect(packet.imageMeta).toHaveLength(126);
    expect(packet.imageMeta.every(item=>item.sha256===digest(image))).toBe(true);
    verifyPacket(packet);
  });
  it("fails closed for wrong commit, missing or invalid screenshot and changed-pixel drift",()=>{
    expect(()=>auditArchive({candidateCommit:"d".repeat(40),report:report(),readImage:()=>image})).toThrow(/J22_VISUAL_ARCHIVE_INVALID/);
    expect(()=>auditArchive({candidateCommit:SHA,report:report(),readImage:name=>name.endsWith("_diff.png")?null:image})).toThrow(/J22_VISUAL_ARCHIVE_INVALID/);
    expect(()=>auditArchive({candidateCommit:SHA,report:report(),readImage:()=>Buffer.alloc(256)})).toThrow(/J22_VISUAL_ARCHIVE_INVALID/);
    const changed=report();changed.cases[0].changedPixelRatio=.03;
    expect(()=>auditArchive({candidateCommit:SHA,report:changed,readImage:()=>image})).toThrow(/J22_VISUAL_ARCHIVE_INVALID/);
  });
  it("rejects packet fingerprint tampering",()=>{
    const packet=valid();
    packet.cases[0].name="modified";
    expect(()=>verifyPacket(packet)).toThrow(/J22_PACKET_TAMPERED/);
  });
  it("starts with a completely unsigned 42-case and 5-accessibility-item worksheet",()=>{
    const packet=valid(),template=blankReview(packet);
    expect(template.decision).toBe("pending");
    expect(template.reviewer.independentToProject).toBeNull();
    expect(template.cases).toHaveLength(42);
    expect(template.cases.every(c=>c.status==="pending")).toBe(true);
    expect(Object.values(template.accessibility).every(v=>v.status==="pending")).toBe(true);
  });
  it("rejects missing case, unreviewed accessibility and misleading no-defects conclusions",()=>{
    const packet=valid();
    const short=submitted(packet);short.cases.pop();
    expect(()=>validateReviewSubmission(packet,short)).toThrow(/J22_REVIEW_COVERAGE_REQUIRED/);
    const pending=submitted(packet);pending.accessibility.physicalAndroid.status="pending";
    expect(()=>validateReviewSubmission(packet,pending)).toThrow(/J22_ACCESSIBILITY_STATUS_INVALID/);
    const conflict=submitted(packet);conflict.cases[0].status="defect";
    conflict.cases[0].observations="Fixture defect";
    expect(()=>validateReviewSubmission(packet,conflict)).toThrow(/J22_REVIEW_DECISION_CONFLICT/);
  });
  it("never confuses a syntactically valid test submission with verified human acceptance",()=>{
    const packet=valid(),receipt=validateReviewSubmission(packet,submitted(packet));
    expect(receipt.structureValidated).toBe(true);
    expect(receipt.independentReviewerVerified).toBe(false);
    expect(receipt.humanVisualApproved).toBe(false);
    expect(receipt.humanAccessibilityApproved).toBe(false);
    expect(receipt.releaseAuthorized).toBe(false);
  });
  it("always documents missing screenshot archives in default CI instead of forging a pass",()=>{
    const pending=createPendingEvidence(SHA);
    expect(pending.expectedCases).toBe(42);
    expect(pending.requiredImageCount).toBe(126);
    expect(pending.visualArchiveStatus).toContain("pending");
    expect(pending.releaseAuthorized).toBe(false);
    expect(pending.screenshotBaselineUpdated).toBe(false);
  });
});
