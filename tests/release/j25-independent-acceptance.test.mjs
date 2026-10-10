import crypto from "node:crypto";
import {describe,it,expect} from "vitest";
import {evaluateAdmission,pendingDecision,verifyTrustRoots} from "../../scripts/j25-independent-acceptance.mjs";
import {REQUIRED_ROLES} from "../../scripts/j24-operator-evidence-qualification.mjs";
const C="a".repeat(40),NOW="2026-10-10T12:00:00.000Z";
const hash=raw=>crypto.createHash("sha256").update(raw).digest("hex");
function fixture(){
  const signers=[],privates={};
  for(const [kind,role] of Object.entries(REQUIRED_ROLES)){
    const {publicKey,privateKey}=crypto.generateKeyPairSync("ed25519");
    const id="independent-"+kind;
    privates[id]=privateKey;
    signers.push({id,roles:[role],revoked:false,independentToProject:true,
      validFrom:"2026-10-01T00:00:00Z",validUntil:"2026-12-01T00:00:00Z",
      publicKeyPem:publicKey.export({format:"pem",type:"spki"}),
      keyFingerprint:hash(publicKey.export({format:"der",type:"spki"}))});
  }
  for(let i=0;i<2;i++){
    const {publicKey,privateKey}=crypto.generateKeyPairSync("ed25519");
    const id="admission-operator-"+i;
    privates[id]=privateKey;
    signers.push({id,roles:["release-operator"],revoked:false,independentToProject:true,
      validFrom:"2026-10-01T00:00:00Z",validUntil:"2026-12-01T00:00:00Z",
      publicKeyPem:publicKey.export({format:"pem",type:"spki"}),
      keyFingerprint:hash(publicKey.export({format:"der",type:"spki"}))});
  }
  const rosterBytes=Buffer.from(JSON.stringify({schema:"thiepn-japanese-j24-external-trust-roster",signers}));
  const revocationBytes=Buffer.from(JSON.stringify({schema:"thiepn-japanese-j25-revocation-snapshot",
    validFrom:"2026-10-09T00:00:00Z",validUntil:"2026-10-11T00:00:00Z",revokedIds:[]}));
  const bundle={schema:"thiepn-japanese-j24-independent-evidence-bundle",
    candidateCommit:C,releaseAuthorized:false,humanApprovalGranted:false,records:{}};
  const evidence=[];
  for(const kind of Object.keys(REQUIRED_ROLES)){
    const id="independent-"+kind,sha256=hash(Buffer.from(kind));
    bundle.records[kind]={candidateCommit:C,status:"submitted",sha256,attestation:{signerId:id}};
    evidence.push({kind,sha256,signerId:id});
  }
  const receipt={schema:"thiepn-japanese-j24-cryptographic-provenance-receipt",
    candidateCommit:C,locallyHashedEvidenceCount:9,signaturesValidAgainstSuppliedRoster:true,
    releaseAuthorized:false,humanIdentityIndependentlyVerified:false,evidence};
  const props={candidateCommit:C,bundle,j24Receipt:receipt,rosterBytes,
    rosterPin:hash(rosterBytes),revocationBytes,revocationPin:hash(revocationBytes),
    inspectedAt:NOW};
  const body={
    schema:"thiepn-japanese-j25-independent-admission",version:1,candidateCommit:C,
    evidenceDigest:hash(Buffer.from(JSON.stringify(bundle))),
    j24ReceiptDigest:hash(Buffer.from(JSON.stringify(receipt))),
    rosterDigest:hash(rosterBytes),revocationDigest:hash(revocationBytes),
    inspectedAt:NOW,decision:"EVIDENCE_ADMISSION_ONLY_NO_RELEASE_AUTHORIZATION"
  };
  props.operatorAttestations=[0,1].map(i=>{
    const signerId="admission-operator-"+i;
    return {signerId,signature:crypto.sign(null,Buffer.from(JSON.stringify(body)),privates[signerId]).toString("base64")};
  });
  return {props,privates,body};
}
describe("J25 operator trust root and fail-closed release decision",()=>{
  it("keeps CI qualification blocked, even with green J24 machine evidence",()=>{
    const x=pendingDecision(C,{schema:"thiepn-japanese-j24-operator-readiness",
      candidateCommit:C,automatedJ23Reconciliation:"passed",
      decision:"BLOCKED_OPERATOR_EVIDENCE_NOT_PRESENT",releaseAuthorized:false,externalSignaturesVerified:false});
    expect(x.decision).toBe("BLOCKED_EXTERNAL_ACCEPTANCE_AND_HUMAN_APPROVAL");
    expect(x.releaseAuthorized).toBe(false);
    expect(x.exactVisualArchiveCases).toBe(42);
    expect(x.exactVisualImageFiles).toBe(126);
  });
  it("requires two independently pinned trust roots and fresh revocation ledger",()=>{
    const {props}=fixture();
    expect(()=>verifyTrustRoots({rosterBytes:props.rosterBytes,rosterPin:"0".repeat(64),
      revocationBytes:props.revocationBytes,revocationPin:props.revocationPin,now:NOW}))
      .toThrow(/J25_TRUST_ROOT_PIN_MISMATCH/);
    const forged=Buffer.from(JSON.stringify({schema:"thiepn-japanese-j25-revocation-snapshot",
      validFrom:"2025-01-01T00:00:00Z",validUntil:"2025-02-01T00:00:00Z",revokedIds:[]}));
    expect(()=>verifyTrustRoots({rosterBytes:props.rosterBytes,rosterPin:props.rosterPin,
      revocationBytes:forged,revocationPin:hash(forged),now:NOW}))
      .toThrow(/J25_REVOCATION_SNAPSHOT_STALE/);
  });
  it("verifies both operator signatures yet never grants release or authenticates people",()=>{
    const result=evaluateAdmission(fixture().props);
    expect(result.operatorAttestationsChecked).toBe(2);
    expect(result.operatorSignaturesValidAgainstPinnedRoster).toBe(true);
    expect(result.independentHumanIdentityVerified).toBe(false);
    expect(result.releaseAuthorized).toBe(false);
    expect(result.decision).toBe("REQUIRES_INDEPENDENT_HUMAN_RELEASE_DECISION");
  });
  it("rejects swapped candidate SHA, mismatched evidence hash and missing evidence categories",()=>{
    const {props}=fixture();
    const wrong=structuredClone(props.bundle);wrong.records.realAccountOAuth.sha256="b".repeat(64);
    expect(()=>evaluateAdmission({...props,bundle:wrong})).toThrow(/J25_EVIDENCE_RECEIPT_MISMATCH/);
    const missing=structuredClone(props.bundle);delete missing.records.exactVisualArchive;
    expect(()=>evaluateAdmission({...props,bundle:missing})).toThrow(/J25_CANDIDATE_BUNDLE_INVALID/);
    expect(()=>evaluateAdmission({...props,candidateCommit:"b".repeat(40)}))
      .toThrow(/J25_J24_RECEIPT_INVALID/);
  });
  it("rejects forged operator co-signatures, duplicated signers and missing quorum",()=>{
    const {props}=fixture();
    const forged=structuredClone(props.operatorAttestations);
    forged[0].signature=Buffer.alloc(64).toString("base64");
    expect(()=>evaluateAdmission({...props,operatorAttestations:forged}))
      .toThrow(/J25_OPERATOR_SIGNATURE_INVALID/);
    expect(()=>evaluateAdmission({...props,operatorAttestations:[props.operatorAttestations[0]]}))
      .toThrow(/J25_TWO_OPERATOR_ATTESTATIONS_REQUIRED/);
    expect(()=>evaluateAdmission({...props,operatorAttestations:[
      props.operatorAttestations[0],props.operatorAttestations[0]
    ]})).toThrow(/J25_INDEPENDENT_OPERATORS_REQUIRED/);
  });
  it("enforces signer/key uniqueness, proper roles and independent reviewers",()=>{
    const {props}=fixture();
    const roster=JSON.parse(props.rosterBytes.toString("utf8"));
    roster.signers[1].id=roster.signers[0].id;
    let mutated=Buffer.from(JSON.stringify(roster));
    expect(()=>evaluateAdmission({...props,rosterBytes:mutated,rosterPin:hash(mutated)}))
      .toThrow(/J25_DUPLICATE_OR_MISSING_SIGNER/);
    const roster2=JSON.parse(props.rosterBytes.toString("utf8"));
    roster2.signers.find(s=>s.id==="independent-independentJapaneseReview").roles=["release-operator"];
    mutated=Buffer.from(JSON.stringify(roster2));
    expect(()=>evaluateAdmission({...props,rosterBytes:mutated,rosterPin:hash(mutated)}))
      .toThrow(/J25_SIGNER_ROLE_OR_TRUST_MISMATCH/);
    const other=structuredClone(props.j24Receipt);
    other.evidence.find(x=>x.kind==="independentP11LearnerReview").signerId="independent-independentJapaneseReview";
    const b=structuredClone(props.bundle);
    b.records.independentP11LearnerReview.attestation.signerId="independent-independentJapaneseReview";
    expect(()=>evaluateAdmission({...props,j24Receipt:other,bundle:b}))
      .toThrow(/J25_REVIEWER_SEPARATION_REQUIRED/);
  });
  it("rejects revocation, expiry and malicious trust-root substitutions",()=>{
    const {props}=fixture();
    let rev=JSON.parse(props.revocationBytes.toString("utf8"));
    rev.revokedIds=["admission-operator-0"];
    let bytes=Buffer.from(JSON.stringify(rev));
    expect(()=>evaluateAdmission({...props,revocationBytes:bytes,revocationPin:hash(bytes)}))
      .toThrow(/J25_REVOKED_SIGNER/);
    const roster=JSON.parse(props.rosterBytes.toString("utf8"));
    roster.signers[0].validUntil="2026-10-01T12:00:00Z";
    bytes=Buffer.from(JSON.stringify(roster));
    expect(()=>evaluateAdmission({...props,rosterBytes:bytes,rosterPin:hash(bytes)}))
      .toThrow(/J25_SIGNER_EXPIRED_OR_PREMATURE/);
  });
  it("rejects automatic human approval and altered J24 provenance claims",()=>{
    const {props}=fixture();
    expect(()=>evaluateAdmission({...props,bundle:{...props.bundle,releaseAuthorized:true}}))
      .toThrow(/J25_CANDIDATE_BUNDLE_INVALID/);
    expect(()=>evaluateAdmission({...props,j24Receipt:{...props.j24Receipt,humanIdentityIndependentlyVerified:true}}))
      .toThrow(/J25_J24_RECEIPT_INVALID/);
    expect(()=>pendingDecision(C,{schema:"thiepn-japanese-j24-operator-readiness",candidateCommit:C,
      automatedJ23Reconciliation:"passed",decision:"AUTHORIZED",releaseAuthorized:true,
      externalSignaturesVerified:true})).toThrow(/J25_J24_EXACT_HEAD_PREREQUISITE_INVALID/);
  });
});
