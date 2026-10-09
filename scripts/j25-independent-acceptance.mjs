import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {inspectBundle,REQUIRED_ROLES} from "./j24-operator-evidence-qualification.mjs";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const SHA=/^[a-f0-9]{40}$/;
const HASH=/^[a-f0-9]{64}$/;
const ADMISSION_SCHEMA="thiepn-japanese-j25-independent-admission";
const ROLES=Object.keys(REQUIRED_ROLES);
function reject(reason){throw new Error("J25_"+reason);}
function hash(bytes){return crypto.createHash("sha256").update(bytes).digest("hex");}
function shaCheck(sha){if(typeof sha!=="string"||!SHA.test(sha))reject("EXACT_HEAD_REQUIRED");}
function asJson(bytes,label){
  try{return JSON.parse(Buffer.from(bytes).toString("utf8"));}
  catch{reject("BAD_JSON:"+label);}
}
function distinct(values){return new Set(values).size===values.length;}
function time(value,label){
  const ms=typeof value==="string"?Date.parse(value):NaN;
  if(!Number.isFinite(ms))reject("INVALID_TIMESTAMP:"+label);
  return ms;
}
function pinnedJson(raw,expected,label){
  if(typeof expected!=="string"||!HASH.test(expected))reject("EXTERNAL_PIN_REQUIRED:"+label);
  const actual=hash(raw);
  if(!crypto.timingSafeEqual(Buffer.from(actual,"hex"),Buffer.from(expected,"hex"))){
    reject("TRUST_ROOT_PIN_MISMATCH:"+label);
  }
  return asJson(raw,label);
}
function pubkey(record){
  try{
    const key=crypto.createPublicKey(record.publicKeyPem);
    if(key.asymmetricKeyType!=="ed25519")reject("ED25519_REQUIRED");
    const fingerprint=hash(key.export({format:"der",type:"spki"}));
    if(record.keyFingerprint!==fingerprint)reject("PUBLIC_KEY_FINGERPRINT_MISMATCH");
    return key;
  }catch(error){
    if(String(error).includes("J25_"))throw error;
    reject("INVALID_PUBLIC_KEY");
  }
}
function checkSigned(body,attestation,publicKey){
  if(typeof attestation?.signature!=="string"||
    !/^[A-Za-z0-9+/]+={0,2}$/.test(attestation.signature))reject("OPERATOR_SIGNATURE_MISSING");
  const signature=Buffer.from(attestation.signature,"base64");
  if(signature.length!==64||
    !crypto.verify(null,Buffer.from(JSON.stringify(body),"utf8"),publicKey,signature)){
    reject("OPERATOR_SIGNATURE_INVALID");
  }
}
/** J25 cannot establish trust from a self-issued roster; the caller MUST supply two independent pinned digests. */
export function verifyTrustRoots({
  rosterBytes,rosterPin,revocationBytes,revocationPin,now
}){
  const roster=pinnedJson(rosterBytes,rosterPin,"roster");
  const revocations=pinnedJson(revocationBytes,revocationPin,"revocations");
  const current=time(now,"inspection");
  if(roster?.schema!=="thiepn-japanese-j24-external-trust-roster"||
     !Array.isArray(roster.signers)||roster.signers.length<3){
    reject("TRUST_ROSTER_SCHEMA_OR_COVERAGE");
  }
  if(revocations?.schema!=="thiepn-japanese-j25-revocation-snapshot"||
     !Array.isArray(revocations.revokedIds)||
     !distinct(revocations.revokedIds)||
     !revocations.revokedIds.every(id=>typeof id==="string"&&id.length>0)){
    reject("REVOCATIONS_SCHEMA");
  }
  const validFrom=time(revocations.validFrom,"revocations.validFrom");
  const validUntil=time(revocations.validUntil,"revocations.validUntil");
  if(!(validFrom<=current&&current<=validUntil)||
     validUntil-validFrom>72*60*60*1000)reject("REVOCATION_SNAPSHOT_STALE");
  const byId=new Map(),keys=new Set();
  for(const signer of roster.signers){
    if(typeof signer?.id!=="string"||!signer.id.trim()||byId.has(signer.id)){
      reject("DUPLICATE_OR_MISSING_SIGNER");
    }
    const key=pubkey(signer);
    if(keys.has(signer.keyFingerprint))reject("DUPLICATE_SIGNING_KEY");
    keys.add(signer.keyFingerprint);
    if(!Array.isArray(signer.roles)||!signer.roles.length||!distinct(signer.roles)||
       !signer.roles.every(role=>Object.values(REQUIRED_ROLES).includes(role))||
       signer.independentToProject!==true){
      reject("INVALID_SIGNER_SCOPE");
    }
    const from=time(signer.validFrom,"signer.validFrom");
    const to=time(signer.validUntil,"signer.validUntil");
    if(to<=from||current<from||current>to)reject("SIGNER_EXPIRED_OR_PREMATURE:"+signer.id);
    if(signer.revoked!==false||revocations.revokedIds.includes(signer.id)){
      reject("REVOKED_SIGNER:"+signer.id);
    }
    byId.set(signer.id,{...signer,key});
  }
  return {byId,roster,revocations,rosterDigest:hash(rosterBytes),
    revocationDigest:hash(revocationBytes),asOf:new Date(current).toISOString()};
}
/**
 * Admission requires a full J24 cryptographic receipt plus externally pinned roster,
 * fresh revocation snapshot, separate reviewers and TWO independent release operators.
 * A successful receipt is ONLY candidate evidence integrity, never deployment permission.
 */
export function evaluateAdmission({
  candidateCommit,j24Receipt,bundle,rosterBytes,rosterPin,
  revocationBytes,revocationPin,operatorAttestations,inspectedAt
}){
  shaCheck(candidateCommit);
  const trust=verifyTrustRoots({rosterBytes,rosterPin,revocationBytes,revocationPin,now:inspectedAt});
  if(j24Receipt?.schema!=="thiepn-japanese-j24-cryptographic-provenance-receipt"||
     j24Receipt.candidateCommit!==candidateCommit||
     j24Receipt.locallyHashedEvidenceCount!==ROLES.length||
     j24Receipt.signaturesValidAgainstSuppliedRoster!==true||
     j24Receipt.releaseAuthorized!==false||
     j24Receipt.humanIdentityIndependentlyVerified!==false||
     !Array.isArray(j24Receipt.evidence)||j24Receipt.evidence.length!==ROLES.length){
    reject("J24_RECEIPT_INVALID");
  }
  if(bundle?.schema!=="thiepn-japanese-j24-independent-evidence-bundle"||
     bundle.candidateCommit!==candidateCommit||
     bundle.releaseAuthorized!==false||bundle.humanApprovalGranted===true||
     !bundle.records||Object.keys(bundle.records).length!==ROLES.length){
    reject("CANDIDATE_BUNDLE_INVALID");
  }
  const reviewKinds=[
    "independentJapaneseReview","independentVisualAccessibilityReview",
    "independentAccessibilitySignoff","independentP11LearnerReview"
  ];
  const signerFor={},receiptByKind=new Map();
  for(const item of j24Receipt.evidence){
    if(!ROLES.includes(item?.kind)||receiptByKind.has(item.kind)||
      typeof item.sha256!=="string"||!HASH.test(item.sha256)){
      reject("DUPLICATED_OR_UNKNOWN_EVIDENCE_RECEIPT");
    }
    receiptByKind.set(item.kind,item);
  }
  for(const kind of ROLES){
    const row=bundle.records[kind],receipt=receiptByKind.get(kind);
    if(!row||!receipt||row.status!=="submitted"||
       row.candidateCommit!==candidateCommit||
       row.sha256!==receipt.sha256||
       row.attestation?.signerId!==receipt.signerId){
      reject("EVIDENCE_RECEIPT_MISMATCH:"+kind);
    }
    const signer=trust.byId.get(receipt.signerId);
    if(!signer||!signer.roles.includes(REQUIRED_ROLES[kind])){
      reject("SIGNER_ROLE_OR_TRUST_MISMATCH:"+kind);
    }
    signerFor[kind]=receipt.signerId;
  }
  if(!distinct(reviewKinds.map(kind=>signerFor[kind]))||
     signerFor.exactVisualArchive===signerFor.independentVisualAccessibilityReview||
     signerFor.physicalAndroidAndTalkBack===signerFor.independentAccessibilitySignoff){
    reject("REVIEWER_SEPARATION_REQUIRED");
  }
  const operatorIds=Object.entries(signerFor)
    .filter(([kind])=>kind==="exactStagingIdentity"||kind==="testedRollback")
    .map(([,id])=>id);
  if(operatorIds.length!==2||!distinct(operatorIds)||
    reviewKinds.some(kind=>operatorIds.includes(signerFor[kind]))){
    reject("OPERATOR_REVIEWER_SEPARATION_REQUIRED");
  }
  if(!Array.isArray(operatorAttestations)||operatorAttestations.length!==2){
    reject("TWO_OPERATOR_ATTESTATIONS_REQUIRED");
  }
  const attestingIds=operatorAttestations.map(a=>a?.signerId);
  if(!distinct(attestingIds)||attestingIds.some(id=>!trust.byId.get(id)?.roles.includes("release-operator"))||
     attestingIds.some(id=>reviewKinds.some(kind=>signerFor[kind]===id))){
    reject("INDEPENDENT_OPERATORS_REQUIRED");
  }
  const auditBody={
    schema:ADMISSION_SCHEMA,version:1,candidateCommit,
    evidenceDigest:hash(Buffer.from(JSON.stringify(bundle))),
    j24ReceiptDigest:hash(Buffer.from(JSON.stringify(j24Receipt))),
    rosterDigest:trust.rosterDigest,revocationDigest:trust.revocationDigest,
    inspectedAt:trust.asOf,decision:"EVIDENCE_ADMISSION_ONLY_NO_RELEASE_AUTHORIZATION"
  };
  for(const attestation of operatorAttestations){
    const signer=trust.byId.get(attestation.signerId);
    checkSigned(auditBody,attestation,signer.key);
  }
  return {
    schema:"thiepn-japanese-j25-independent-admission-receipt",
    candidateCommit,checkedKinds:ROLES.length,operatorAttestationsChecked:2,
    admissionDigest:hash(Buffer.from(JSON.stringify(auditBody))),
    pinnedRosterDigest:trust.rosterDigest,pinnedRevocationsDigest:trust.revocationDigest,
    inspectedAt:trust.asOf,
    pinsVerified:true,revocationsCurrent:true,evidenceReceiptConsistent:true,
    operatorSignaturesValidAgainstPinnedRoster:true,
    independentHumanIdentityVerified:false,
    externalPrimaryEvidenceWitnessedByThisTool:false,
    humanReleaseApprovalVerified:false,releaseAuthorized:false,
    decision:"REQUIRES_INDEPENDENT_HUMAN_RELEASE_DECISION"
  };
}
export function pendingDecision(candidateCommit,j24){
  shaCheck(candidateCommit);
  if(j24?.schema!=="thiepn-japanese-j24-operator-readiness"||
     j24.candidateCommit!==candidateCommit||
     j24.automatedJ23Reconciliation!=="passed"||
     j24.decision!=="BLOCKED_OPERATOR_EVIDENCE_NOT_PRESENT"||
     j24.releaseAuthorized!==false||j24.externalSignaturesVerified!==false){
    reject("J24_EXACT_HEAD_PREREQUISITE_INVALID");
  }
  return {
    schema:"thiepn-japanese-j25-controlled-release-decision",
    version:1,candidateCommit,automatedUpstream:"qualified",
    expectedExternalEvidence:ROLES,
    pinnedExternalTrustRoster:"not_provided_in_ci",
    independentRevocationSnapshot:"not_provided_in_ci",
    independentHumanAndDeviceEvidence:"not_provided_in_ci",
    operatorAttestations:"not_provided_in_ci",
    exactVisualArchiveCases:42,exactVisualImageFiles:126,
    humanReviewerIdentityVerified:false,realOAuthAccepted:false,
    realAndroidTalkBackAccepted:false,japaneseLanguageAccepted:false,
    physicalRollbackWitnessed:false,
    releaseAuthorized:false,mergeAuthorized:false,deploymentAuthorized:false,
    decision:"BLOCKED_EXTERNAL_ACCEPTANCE_AND_HUMAN_APPROVAL"
  };
}
export function runCli(args=process.argv.slice(2)){
  const sha=process.env.J25_CANDIDATE_SHA;
  shaCheck(sha);
  if(!args.length){
    const readiness=pendingDecision(sha,JSON.parse(fs.readFileSync(path.join(ROOT,"artifacts/j24-operator-readiness.json"),"utf8")));
    fs.mkdirSync(path.join(ROOT,"artifacts"),{recursive:true});
    fs.writeFileSync(path.join(ROOT,"artifacts/j25-controlled-release-decision.json"),JSON.stringify(readiness,null,2)+"\n");
    console.log("J25 exact-head automated readiness recorded: BLOCKED; independent acceptance and release authorization missing");
    return readiness;
  }
  if(args.length!==6||args[0]!=="--inspect-bundle"||args[2]!=="--roster"||args[4]!=="--revocations"){
    reject("OFFLINE_CLI_USAGE");
  }
  const rootDir=path.resolve(args[1]),rosterBytes=fs.readFileSync(path.resolve(args[3])),
    revocationBytes=fs.readFileSync(path.resolve(args[5]??""));
  const pins={
    rosterPin:process.env.J25_TRUST_ROSTER_SHA256,
    revocationPin:process.env.J25_REVOCATION_SHA256
  };
  // Hash pins MUST be supplied independently by the operator's trusted channel.
  verifyTrustRoots({rosterBytes,revocationBytes,...pins,now:new Date().toISOString()});
  const bundle=JSON.parse(fs.readFileSync(path.join(rootDir,"manifest.json"),"utf8"));
  const roster=asJson(rosterBytes,"roster");
  const languagePacket=JSON.parse(fs.readFileSync(path.join(ROOT,"artifacts/j21-language-review-packet.json"),"utf8"));
  const j24Receipt=inspectBundle({candidateCommit:sha,bundle,keyring:roster,rootDir,languagePacket});
  const att=JSON.parse(fs.readFileSync(path.join(rootDir,"operator-attestations.json"),"utf8"));
  const receipt=evaluateAdmission({candidateCommit:sha,j24Receipt,bundle,
    rosterBytes,revocationBytes,...pins,operatorAttestations:att.attestations,inspectedAt:new Date().toISOString()});
  process.stdout.write(JSON.stringify(receipt,null,2)+"\n");
  return receipt;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))runCli();
