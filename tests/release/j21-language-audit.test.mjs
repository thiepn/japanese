import {describe,expect,it} from "vitest";
import {
  auditAndBuildPacket,blankReviewerTemplate,validateReviewerSubmission,verifyPacket
} from "../../scripts/j21-language-audit.mjs";

const SHA="b".repeat(40);
function fixture(){
  const originals="thiepn-original";
  const registry={sources:[
    {id:originals,title:"Fixture original",publicExport:true,license:"Fixture-owned original"},
    {id:"restricted",title:"Private reference only",publicExport:false,license:"all rights reserved"},
  ]};
  const manifest={sources:[originals]};
  const data={
    sourceIds:[originals],
    grammar:[{id:"grammar-test",label:"〜ながら",practice:{prompt:"歩きながら話します。"},sourceIds:[originals]}],
    lexemes:[{id:"word-test",canonicalForm:"日本語",readings:[{text:"にほんご"}],sourceIds:[originals]}],
    sentences:[{id:"sentence-test",text:"今日は日本語を勉強します。",translation:"I study Japanese today.",sourceIds:[originals]}],
    canDos:[{id:"can-do-test",statement:"I can introduce myself.",sourceIds:[originals]}]
  };
  const seeds=[{filename:"fixture.json",raw:JSON.stringify(data),data}];
  return {registry,manifest,seeds,candidateCommit:SHA};
}
function submitted(packet){
  const result=blankReviewerTemplate(packet);
  result.reviewer={label:"Fixture independent teacher (test only)",role:"teacher",externalToProject:true,
    reviewedAt:"2026-10-10T12:00:00Z",independentEvidenceRef:"fixture:test-only"};
  result.itemReviews=result.itemReviews.map(review=>({
    ...review,verdict:"accepted",
    scores:{accuracy:3,naturalness:3,register:3,pedagogy:3},notes:""
  }));
  result.decision="approve";
  return result;
}

describe("J21 content provenance and independent review boundaries",()=>{
  it("builds a deterministic exact-head packet using actual source-linked records",()=>{
    const a=auditAndBuildPacket(fixture()),b=auditAndBuildPacket(fixture());
    expect(a.packet).toEqual(b.packet);
    expect(a.packet.candidateCommit).toBe(SHA);
    expect(a.packet.items.map(x=>x.key)).toEqual(["grammar/grammar-test","lexemes/word-test","sentences/sentence-test","canDos/can-do-test"]);
    expect(a.report.semanticJapaneseReview).toBe("pending");
    expect(a.report.releaseAuthorized).toBe(false);
    verifyPacket(a.packet);
  });
  it("refuses private/reference-only or unregistered content sources",()=>{
    const bad=fixture();
    bad.seeds[0].data.grammar[0].sourceIds=["restricted"];
    expect(()=>auditAndBuildPacket(bad)).toThrow(/J21_NONEXPORTABLE_SOURCE/);
    bad.seeds[0].data.grammar[0].sourceIds=["unregistered"];
    expect(()=>auditAndBuildPacket(bad)).toThrow(/J21_UNKNOWN_SOURCE/);
  });
  it("rejects duplicate IDs and incomplete provenance without admitting records",()=>{
    const bad=fixture();
    bad.seeds[0].data.lexemes.push({...bad.seeds[0].data.lexemes[0]});
    expect(()=>auditAndBuildPacket(bad)).toThrow(/J21_DUPLICATE_CONTENT_ID/);
    bad.seeds[0].data.lexemes.pop();
    bad.seeds[0].data.lexemes[0].sourceIds=[];
    expect(()=>auditAndBuildPacket(bad)).toThrow(/J21_MISSING_PROVENANCE/);
  });
  it("generates a truly blank reviewer template, not pre-signed acceptance",()=>{
    const {packet}=auditAndBuildPacket(fixture());
    const template=blankReviewerTemplate(packet);
    expect(template.reviewer.label).toBe("");
    expect(template.reviewer.externalToProject).toBeNull();
    expect(template.itemReviews.every(item=>item.verdict==="pending")).toBe(true);
    expect(template.decision).toBe("pending");
  });
  it("detects tampered packet content and mismatched candidate fingerprints",()=>{
    const {packet}=auditAndBuildPacket(fixture());
    const altered=structuredClone(packet);
    altered.items[0].japanese="改ざん";
    expect(()=>verifyPacket(altered)).toThrow(/J21_PACKET_DIGEST_MISMATCH/);
    const submission=submitted(packet);
    submission.packetSha256="0".repeat(64);
    expect(()=>validateReviewerSubmission(packet,submission)).toThrow(/J21_SUBMISSION_PACKET_MISMATCH/);
  });
  it("refuses missing/duplicate reviewer items and unsupported approval without silently passing",()=>{
    const {packet}=auditAndBuildPacket(fixture());
    const incomplete=submitted(packet);
    incomplete.itemReviews.pop();
    expect(()=>validateReviewerSubmission(packet,incomplete)).toThrow(/J21_REVIEW_COMPLETENESS_REQUIRED/);
    const duplicate=submitted(packet);
    duplicate.itemReviews[1].key=duplicate.itemReviews[0].key;
    expect(()=>validateReviewerSubmission(packet,duplicate)).toThrow(/J21_REVIEW_ITEM_NOT_IN_PACKET/);
    const conflict=submitted(packet);
    conflict.itemReviews[0].verdict="needs-correction";
    conflict.itemReviews[0].notes="Fixture correction (test only)";
    expect(()=>validateReviewerSubmission(packet,conflict)).toThrow(/J21_INCONSISTENT_APPROVAL/);
  });
  it("structurally validates synthetic test submissions but never signs off human identity or release",()=>{
    const {packet}=auditAndBuildPacket(fixture());
    const receipt=validateReviewerSubmission(packet,submitted(packet));
    expect(receipt.structuralValidation).toBe("passed");
    expect(receipt.reviewerIdentityVerified).toBe(false);
    expect(receipt.independentReviewAdmitted).toBe(false);
    expect(receipt.releaseAuthorized).toBe(false);
  });
});
