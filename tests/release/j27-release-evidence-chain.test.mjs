import {describe,it,expect} from "vitest";
import {buildEvidenceChain,verifyEvidenceChain,SOURCES,REQUIRED_MANIFESTS} from "../../scripts/j27-release-evidence-chain.mjs";
const C="a".repeat(40),OLD="b".repeat(40),D="e".repeat(64);
function fixture(){
 const r={
  J20:{automated:{status:"passed"},releaseDecision:"not_authorized"},
  J21:{integrityStatus:"passed",externalHumanReview:"not_obtained",semanticJapaneseReview:"pending",releaseAuthorized:false},
  "J21-review":{items:[{key:"grammar/example"}],packetSha256:D},
  J22:{expectedCases:42,requiredImageCount:126,visualArchiveStatus:"pending-exact-head-j15d-d4-artifact",
    screenshotBaselineUpdated:false,independentVisualReview:"pending",releaseAuthorized:false},
  J23:{automatedIntegrity:"passed",decision:"BLOCKED_AWAITING_INDEPENDENT_EVIDENCE",
    actualVisualCasesVerified:0,actualVisualImagesVerified:0,releaseAuthorized:false},
  J24:{automatedJ23Reconciliation:"passed",decision:"BLOCKED_OPERATOR_EVIDENCE_NOT_PRESENT",
    externalSignaturesVerified:false,releaseAuthorized:false},
  J25:{decision:"BLOCKED_EXTERNAL_ACCEPTANCE_AND_HUMAN_APPROVAL",
    exactVisualArchiveCases:42,exactVisualImageFiles:126,
    releaseAuthorized:false,mergeAuthorized:false,deploymentAuthorized:false},
  J26:{decision:"BLOCKED_MISSING_INDEPENDENT_APPROVAL_AND_CUTOVER_AUTHORITY",
    cutover:"prohibited",expectedVisualCases:42,expectedOriginalVisualImages:126,humanReleaseApproval:"not_provided",
    releaseAuthorized:false,mergeAuthorized:false,deploymentAuthorized:false}
 };
 const manifest={
  signoffs:{schema:"thiepn-japanese-j15d-d5-release-signoff",status:"pending",candidateCommit:null,
    signoffs:{product:{status:"pending",reviewer:null,evidenceRef:null}}},
  field:{schema:"thiepn-japanese-j16-field-acceptance",status:"pending",stablePromotion:"not_authorized",
    rollback:{tested:false},deployedCandidateCommit:null},
  production:{schema:"thiepn-japanese-p22-production",status:"candidate",releaseCommit:null,releaseTag:null,activatedAt:null}
 };
 const fileMap=new Map();
 for(const [name,path,schema] of SOURCES)fileMap.set(path,Buffer.from(JSON.stringify({...r[name],schema,candidateCommit:C})));
 for(const [name,path] of REQUIRED_MANIFESTS)fileMap.set(path,Buffer.from(JSON.stringify(manifest[name])));
 return {fileMap,readRaw:path=>fileMap.get(path)};
}
describe("J27 machine evidence chain and fail-closed human boundary",()=>{
  it("seals eight exact-head records and three unsigned manifests in order",()=>{
    const f=fixture(),report=buildEvidenceChain({candidateCommit:C,readRaw:f.readRaw});
    expect(report.sequence).toHaveLength(8);
    expect(report.releaseManifestDigests).toHaveLength(3);
    expect(report.originalScreenshotCases).toBe(42);
    expect(report.originalImageFiles).toBe(126);
    expect(report.decision).toMatch(/^BLOCKED_/);
    expect(report.releaseAuthorized).toBe(false);
    expect(report.sequence[1].previous).toBe(report.sequence[0].chainSha256);
    expect(verifyEvidenceChain({candidateCommit:C,report,readRaw:f.readRaw}).verified).toBe(true);
  });
  it("fails for a cross-candidate record and malformed content",()=>{
    const f=fixture(),p=SOURCES[1][1];f.fileMap.set(p,Buffer.from(JSON.stringify({schema:SOURCES[1][2],candidateCommit:OLD})));
    expect(()=>buildEvidenceChain({candidateCommit:C,readRaw:f.readRaw})).toThrow(/J27_HEAD_MISMATCH/);
    f.fileMap.set(p,Buffer.from("not-json"));
    expect(()=>buildEvidenceChain({candidateCommit:C,readRaw:f.readRaw})).toThrow(/J27_JSON_INVALID/);
  });
  it("rejects reordered or falsified chain records and changed source bytes",()=>{
    const f=fixture(),report=buildEvidenceChain({candidateCommit:C,readRaw:f.readRaw});
    report.sequence.reverse();
    expect(()=>verifyEvidenceChain({candidateCommit:C,report,readRaw:f.readRaw})).toThrow(/J27_EVIDENCE_CHAIN_TAMPERED_OR_STALE/);
    const f2=fixture(),report2=buildEvidenceChain({candidateCommit:C,readRaw:f2.readRaw});
    const original=f2.fileMap.get(SOURCES[2][1]);
    f2.fileMap.set(SOURCES[2][1],Buffer.concat([original,Buffer.from(" ")]));
    expect(()=>verifyEvidenceChain({candidateCommit:C,report:report2,readRaw:f2.readRaw})).toThrow(/J27_EVIDENCE_CHAIN_TAMPERED_OR_STALE/);
  });
  it("rejects automated approval, missing original screenshot requirement and forged review",()=>{
    const f=fixture(),p=SOURCES[7][1],item=JSON.parse(f.fileMap.get(p));
    item.releaseAuthorized=true;f.fileMap.set(p,Buffer.from(JSON.stringify(item)));
    expect(()=>buildEvidenceChain({candidateCommit:C,readRaw:f.readRaw})).toThrow(/J27_RELEASE_FLAG_NOT_FALSE/);
    const b=fixture(),q=SOURCES[3][1],record=JSON.parse(b.fileMap.get(q));
    record.requiredImageCount=0;b.fileMap.set(q,Buffer.from(JSON.stringify(record)));
    expect(()=>buildEvidenceChain({candidateCommit:C,readRaw:b.readRaw})).toThrow(/J27_J22_VISUAL_BOUNDARY_INVALID/);
    const c=fixture(),t=SOURCES[1][1],lang=JSON.parse(c.fileMap.get(t));
    lang.semanticJapaneseReview="approved";c.fileMap.set(t,Buffer.from(JSON.stringify(lang)));
    expect(()=>buildEvidenceChain({candidateCommit:C,readRaw:c.readRaw})).toThrow(/J27_J21_INDEPENDENT_REVIEW_INVALID/);
  });
  it("rejects unauthorized field release, production cutover and forged signoffs",()=>{
    const f=fixture(),p=REQUIRED_MANIFESTS[1][1],v=JSON.parse(f.fileMap.get(p));
    v.rollback.tested=true;f.fileMap.set(p,Buffer.from(JSON.stringify(v)));
    expect(()=>buildEvidenceChain({candidateCommit:C,readRaw:f.readRaw})).toThrow(/J27_STAGING_MANIFEST_MUTATED/);
    const g=fixture(),q=REQUIRED_MANIFESTS[2][1],prod=JSON.parse(g.fileMap.get(q));
    prod.activatedAt="2026-10-10T10:00:00Z";g.fileMap.set(q,Buffer.from(JSON.stringify(prod)));
    expect(()=>buildEvidenceChain({candidateCommit:C,readRaw:g.readRaw})).toThrow(/J27_PRODUCTION_ACTIVATION_FORGED/);
    const h=fixture(),r=REQUIRED_MANIFESTS[0][1],sign=JSON.parse(h.fileMap.get(r));
    sign.signoffs.product.status="approved";h.fileMap.set(r,Buffer.from(JSON.stringify(sign)));
    expect(()=>buildEvidenceChain({candidateCommit:C,readRaw:h.readRaw})).toThrow(/J27_HUMAN_SIGNOFF_MUTATED/);
  });
  it("never accepts a fabricated passed standalone release authorization",()=>{
    const f=fixture(),report=buildEvidenceChain({candidateCommit:C,readRaw:f.readRaw});
    report.decision="APPROVED";report.releaseAuthorized=true;
    expect(()=>verifyEvidenceChain({candidateCommit:C,report,readRaw:f.readRaw})).toThrow(/J27_EVIDENCE_CHAIN_TAMPERED_OR_STALE/);
    expect(()=>buildEvidenceChain({candidateCommit:"short",readRaw:f.readRaw})).toThrow(/J27_EXACT_SHA_REQUIRED/);
  });
});
