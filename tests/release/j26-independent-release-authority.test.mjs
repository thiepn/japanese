import {describe,expect,it} from "vitest";
import crypto from "node:crypto";
import {
  APPROVAL_ROLES,sha256,approvalPayload,recordBlockedDecision,
  inspectIndependentApprovals,verifyApprovalRoster,unsignedApprovalTemplate
} from "../../scripts/j26-independent-release-authority.mjs";

const SHA="b".repeat(40),OLD="a".repeat(40);
const DATE="2026-10-10T12:00:00.000Z";
const dig=x=>sha256(Buffer.from(x));
function machine(){
  return {candidateCommit:SHA,
    j23:{schema:"thiepn-japanese-j23-release-evidence-reconciliation",candidateCommit:SHA,
      automatedIntegrity:"passed",decision:"BLOCKED_AWAITING_INDEPENDENT_EVIDENCE",releaseAuthorized:false},
    j24:{schema:"thiepn-japanese-j24-operator-readiness",candidateCommit:SHA,
      decision:"BLOCKED_OPERATOR_EVIDENCE_NOT_PRESENT",externalSignaturesVerified:false,releaseAuthorized:false},
    j25:{schema:"thiepn-japanese-j25-controlled-release-decision",candidateCommit:SHA,
      decision:"BLOCKED_EXTERNAL_ACCEPTANCE_AND_HUMAN_APPROVAL",releaseAuthorized:false,
      mergeAuthorized:false,deploymentAuthorized:false,exactVisualArchiveCases:42,exactVisualImageFiles:126},
    signoff:{schema:"thiepn-japanese-j15d-d5-release-signoff",status:"pending",candidateCommit:null,
      signoffs:Object.fromEntries(["product","accessibility","releaseOperations"].map(r=>[r,{status:"pending",reviewer:null,evidenceRef:null}])),
      defects:[]},
    field:{schema:"thiepn-japanese-j16-field-acceptance",status:"pending",deployedCandidateCommit:null,
      stablePromotion:"not_authorized",rollback:{tested:false}},
    production:{schema:"thiepn-japanese-p22-production",status:"candidate",releaseCommit:null,releaseTag:null,activatedAt:null}
  };
}
function setup(){
  const admission={
    schema:"thiepn-japanese-j25-independent-admission-receipt",candidateCommit:SHA,
    checkedKinds:9,operatorAttestationsChecked:2,pinsVerified:true,revocationsCurrent:true,
    operatorSignaturesValidAgainstPinnedRoster:true,admissionDigest:dig("admission"),
    decision:"REQUIRES_INDEPENDENT_HUMAN_RELEASE_DECISION",
    releaseAuthorized:false,independentHumanIdentityVerified:false,inspectedAt:"2026-10-10T11:00:00.000Z"
  };
  const keys={};
  const signers=APPROVAL_ROLES.map(role=>{
    const {publicKey,privateKey}=crypto.generateKeyPairSync("ed25519");
    const id=role+"-fixture";
    keys[id]=privateKey;
    return {id,role,independentToProject:true,identityAuditedByOperator:true,revoked:false,
      validFrom:"2026-10-09T00:00:00Z",validUntil:"2026-10-12T00:00:00Z",
      identityEvidenceSha256:dig(role),
      publicKeyPem:publicKey.export({type:"spki",format:"pem"}),
      keyFingerprint:sha256(publicKey.export({type:"spki",format:"der"}))};
  });
  const rosterBytes=Buffer.from(JSON.stringify({schema:"thiepn-japanese-j26-independent-approval-roster",signers}));
  const pkg={schema:"thiepn-japanese-j26-independent-approval-package",candidateCommit:SHA,
    admissionReceiptSha256:sha256(Buffer.from(JSON.stringify(admission))),
    decisionContextSha256:dig("decision-context"),visualPacketSha256:dig("42x126 original archive"),
    reviewSha256:dig("language-review"),visualCases:42,originalPngCount:126,
    stagingCommit:SHA,rollbackCommit:OLD,requestedAt:"2026-10-10T11:30:00.000Z",
    expiresAt:"2026-10-11T11:30:00.000Z",releaseAuthorized:false,
    automaticCutover:false,merged:false,deployed:false,
    approvals:APPROVAL_ROLES.map(role=>{
      const signerId=role+"-fixture";
      return {role,signerId,signedAt:"2026-10-10T11:45:00.000Z",
        signature:crypto.sign(null,Buffer.from(approvalPayload({
          candidateCommit:SHA,admissionReceiptSha256:sha256(Buffer.from(JSON.stringify(admission))),
          decisionContextSha256:dig("decision-context"),visualPacketSha256:dig("42x126 original archive"),
          reviewSha256:dig("language-review"),stagingCommit:SHA,rollbackCommit:OLD,
          requestedAt:"2026-10-10T11:30:00.000Z",expiresAt:"2026-10-11T11:30:00.000Z",role,signerId
        })),keys[signerId]).toString("base64")};
    })
  };
  return {candidateCommit:SHA,j25Admission:admission,approvalPackage:pkg,rosterBytes,
    rosterPin:sha256(rosterBytes),inspectedAt:DATE,j24EvidenceSignerIds:["upstream-operator"],keys};
}
describe("J26 protected release and genuine approval boundaries",()=>{
  it("writes only a blocked decision from the exact-head machine evidence",()=>{
    const result=recordBlockedDecision(machine());
    expect(result.decision).toMatch(/^BLOCKED_/);
    expect(result.releaseAuthorized).toBe(false);
    expect(result.cutover).toBe("prohibited");
    expect(result.expectedVisualCases).toBe(42);
    expect(result.expectedOriginalVisualImages).toBe(126);
  });
  it("rejects forged human signoff, false field rollback and production identity",()=>{
    const x=machine();x.signoff.signoffs.product.status="pass";
    expect(()=>recordBlockedDecision(x)).toThrow(/J26_PREMATURE_HUMAN_SIGNOFF/);
    const y=machine();y.field.rollback.tested=true;
    expect(()=>recordBlockedDecision(y)).toThrow(/J26_UNVERIFIED_STAGING_OR_ROLLBACK/);
    const z=machine();z.production.releaseCommit=SHA;
    expect(()=>recordBlockedDecision(z)).toThrow(/J26_PRODUCTION_ACTIVATED_WITHOUT_APPROVAL/);
  });
  it("rejects mismatched machine SHA, J25 approval claim and wrong expected image count",()=>{
    const x=machine();x.j25.candidateCommit=OLD;
    expect(()=>recordBlockedDecision(x)).toThrow(/J26_UPSTREAM_MACHINE_RECORD_INVALID/);
    const y=machine();y.j25.mergeAuthorized=true;
    expect(()=>recordBlockedDecision(y)).toThrow(/J26_UPSTREAM_GATE_NOT_BLOCKED/);
    const z=machine();z.j25.exactVisualImageFiles=125;
    expect(()=>recordBlockedDecision(z)).toThrow(/J26_UPSTREAM_GATE_NOT_BLOCKED/);
  });
  it("issues no signed or approved reviewer fields in an empty template",()=>{
    const f=setup();const result=unsignedApprovalTemplate(SHA,f.j25Admission);
    expect(result.approvals).toHaveLength(4);
    expect(result.approvals.every(a=>a.signerId===null&&a.signature===null)).toBe(true);
    expect(result.releaseAuthorized).toBe(false);
  });
  it("validates four synthetic Ed25519 signatures but cannot authorize cutover",()=>{
    const result=inspectIndependentApprovals(setup());
    expect(result.fourIndependentSignaturesValid).toBe(true);
    expect(result.actualHumanIdentityReverifiedByThisProcess).toBe(false);
    expect(result.releaseAuthorized).toBe(false);
    expect(result.decision).toBe("WAITING_FOR_EXPLICIT_SEPARATE_RELEASE_AUTHORITY");
  });
  it("requires an independently pinned approval roster with unique non-revoked signers",()=>{
    const f=setup();
    expect(()=>verifyApprovalRoster({...f,externalSha256:"0".repeat(64)})).toThrow(/J26_APPROVAL_ROSTER_PIN_MISMATCH/);
    const r=JSON.parse(f.rosterBytes.toString("utf8"));r.signers[0].revoked=true;
    const raw=Buffer.from(JSON.stringify(r));
    expect(()=>inspectIndependentApprovals({...f,rosterBytes:raw,rosterPin:sha256(raw)}))
      .toThrow(/J26_UNTRUSTED_OR_REVOKED_APPROVER/);
    r.signers[0].revoked=false;r.signers[0].id=r.signers[1].id;
    const dup=Buffer.from(JSON.stringify(r));
    expect(()=>inspectIndependentApprovals({...f,rosterBytes:dup,rosterPin:sha256(dup)}))
      .toThrow(/J26_DUPLICATE_APPROVAL_SIGNER/);
  });
  it("fails on tampered signature, swapped role, reused reviewer or incomplete quorum",()=>{
    const f=setup();
    const bad=structuredClone(f.approvalPackage);bad.approvals[0].signature=Buffer.alloc(64).toString("base64");
    expect(()=>inspectIndependentApprovals({...f,approvalPackage:bad})).toThrow(/J26_APPROVAL_SIGNATURE_MISMATCH/);
    const swapped=structuredClone(f.approvalPackage);swapped.approvals[0].role="accessibility";
    expect(()=>inspectIndependentApprovals({...f,approvalPackage:swapped})).toThrow(/J26_APPROVER_ROLE_UNTRUSTED|J26_APPROVER_SEPARATION/);
    expect(()=>inspectIndependentApprovals({...f,j24EvidenceSignerIds:["product-fixture"]}))
      .toThrow(/J26_APPROVER_SEPARATION_OR_ROLE_INVALID/);
    const short=structuredClone(f.approvalPackage);short.approvals.pop();
    expect(()=>inspectIndependentApprovals({...f,approvalPackage:short})).toThrow(/J26_HUMAN_APPROVAL_QUORUM_INCOMPLETE/);
  });
  it("fails on stale/replayed signatures, wrong candidate, screenshot coverage or rollback identity",()=>{
    const f=setup();const expired=structuredClone(f.approvalPackage);
    expired.expiresAt="2026-10-10T11:59:00.000Z";
    expect(()=>inspectIndependentApprovals({...f,approvalPackage:expired,inspectedAt:"2026-10-10T12:02:00.000Z"}))
      .toThrow(/J26_STALE_FUTURE_OR_REPLAYED_APPROVAL/);
    const badSha=structuredClone(f.approvalPackage);badSha.stagingCommit=OLD;
    expect(()=>inspectIndependentApprovals({...f,approvalPackage:badSha}))
      .toThrow(/J26_EVIDENCE_STAGING_ROLLBACK_BINDING_INVALID/);
    const wrongPng=structuredClone(f.approvalPackage);wrongPng.originalPngCount=125;
    expect(()=>inspectIndependentApprovals({...f,approvalPackage:wrongPng}))
      .toThrow(/J26_EVIDENCE_STAGING_ROLLBACK_BINDING_INVALID/);
    const falseRelease=structuredClone(f.approvalPackage);falseRelease.releaseAuthorized=true;
    expect(()=>inspectIndependentApprovals({...f,approvalPackage:falseRelease}))
      .toThrow(/J26_AUTO_RELEASE_CLAIM_FORBIDDEN/);
  });
  it("refuses fabricated admission approval or missing verified upstream J25 quorum",()=>{
    const f=setup();const j25={...f.j25Admission,releaseAuthorized:true};
    expect(()=>inspectIndependentApprovals({...f,j25Admission:j25})).toThrow(/J26_J25_ADMISSION_NOT_QUALIFIED/);
    const f2=setup();const altered={...f2.j25Admission,operatorAttestationsChecked:1};
    expect(()=>inspectIndependentApprovals({...f2,j25Admission:altered})).toThrow(/J26_J25_ADMISSION_NOT_QUALIFIED/);
  });
});
