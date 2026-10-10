import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const HEX40=/^[0-9a-f]{40}$/;
const HEX64=/^[0-9a-f]{64}$/;
export const APPROVAL_ROLES=Object.freeze(["product","accessibility","release-operations","independent-audit"]);
export const VISUAL_CASES=42;
export const VISUAL_IMAGES=126;
const DAY=86_400_000;
function reject(msg){throw new Error("J26_"+msg);}
export function sha256(bytes){return crypto.createHash("sha256").update(bytes).digest("hex");}
function isSha(value){return typeof value==="string"&&HEX40.test(value);}
function isDigest(value){return typeof value==="string"&&HEX64.test(value);}
function sameSha(value,candidate,label){if(value!==candidate)reject("CANDIDATE_MISMATCH:"+label);}
function assertCandidate(candidate){if(!isSha(candidate))reject("EXACT_COMMIT_REQUIRED");}
function instant(value,label){
  if(typeof value!=="string"||!Number.isFinite(Date.parse(value)))reject("INVALID_TIME:"+label);
  return Date.parse(value);
}
function pending(record,schema,candidate,label){
  if(record?.schema!==schema||record.candidateCommit!==candidate||record.releaseAuthorized!==false){
    reject("UPSTREAM_MACHINE_RECORD_INVALID:"+label);
  }
}
/** CI path checks machine records and existing unapproved deployment/signoff manifests only. */
export function recordBlockedDecision({
  candidateCommit,j23,j24,j25,signoff,field,production
}){
  assertCandidate(candidateCommit);
  pending(j23,"thiepn-japanese-j23-release-evidence-reconciliation",candidateCommit,"J23");
  pending(j24,"thiepn-japanese-j24-operator-readiness",candidateCommit,"J24");
  pending(j25,"thiepn-japanese-j25-controlled-release-decision",candidateCommit,"J25");
  if(j23.decision!=="BLOCKED_AWAITING_INDEPENDENT_EVIDENCE"||j23.automatedIntegrity!=="passed"||
    j24.decision!=="BLOCKED_OPERATOR_EVIDENCE_NOT_PRESENT"||
    j24.externalSignaturesVerified!==false||
    j25.decision!=="BLOCKED_EXTERNAL_ACCEPTANCE_AND_HUMAN_APPROVAL"||
    j25.mergeAuthorized!==false||j25.deploymentAuthorized!==false||
    j25.exactVisualArchiveCases!==VISUAL_CASES||j25.exactVisualImageFiles!==VISUAL_IMAGES){
    reject("UPSTREAM_GATE_NOT_BLOCKED");
  }
  if(signoff?.schema!=="thiepn-japanese-j15d-d5-release-signoff"||
    signoff.status!=="pending"||signoff.candidateCommit!==null||
    Object.keys(signoff.signoffs??{}).sort().join("|")!=="accessibility|product|releaseOperations"||
    Object.values(signoff.signoffs).some(v=>v.status!=="pending"||v.reviewer!==null||v.evidenceRef!==null)||
    !Array.isArray(signoff.defects)||signoff.defects.length){
    reject("PREMATURE_HUMAN_SIGNOFF");
  }
  if(field?.schema!=="thiepn-japanese-j16-field-acceptance"||field.status!=="pending"||
    field.stablePromotion!=="not_authorized"||
    field.rollback?.tested!==false||field.deployedCandidateCommit!==null){
    reject("UNVERIFIED_STAGING_OR_ROLLBACK");
  }
  if(production?.schema!=="thiepn-japanese-p22-production"||
    production.status!=="candidate"||production.releaseCommit!==null||
    production.releaseTag!==null||production.activatedAt!==null){
    reject("PRODUCTION_ACTIVATED_WITHOUT_APPROVAL");
  }
  const evidenceDomains=[
    "42-case visual comparison and 126 authentic source PNGs",
    "qualified Japanese curriculum and external P11 reviews",
    "physical Android PWA, TalkBack, audio and microphone",
    "registered first-party THIEPN Account OAuth and real callbacks",
    "independent product, visual, accessibility and release-operations signoffs",
    "exact candidate staging identity and observed rollback drill",
    "independent approval-roster identity and detached signatures",
    "explicit final operator release approval"
  ];
  return {
    schema:"thiepn-japanese-j26-protected-release-decision",schemaVersion:1,
    candidateCommit,
    upstreamMachineSha256:{
      j23:sha256(Buffer.from(JSON.stringify(j23))),
      j24:sha256(Buffer.from(JSON.stringify(j24))),
      j25:sha256(Buffer.from(JSON.stringify(j25)))
    },
    expectedVisualCases:VISUAL_CASES,expectedOriginalVisualImages:VISUAL_IMAGES,
    independentAcceptanceEvidence:"pending",
    independentReviewerIdentity:"unverified",
    humanReleaseApproval:"not_provided",
    cutover:"prohibited",rollbackDrill:"not_verified_by_ci",
    mergeAuthorized:false,deploymentAuthorized:false,releaseAuthorized:false,
    decision:"BLOCKED_MISSING_INDEPENDENT_APPROVAL_AND_CUTOVER_AUTHORITY",
    remainingRequirements:evidenceDomains,
    note:"CI neither imports real external human evidence nor accepts release approval from source-controlled files."
  };
}
function publicKey(signer){
  try{
    const key=crypto.createPublicKey(signer.publicKeyPem);
    if(key.asymmetricKeyType!=="ed25519")reject("ED25519_ONLY");
    const fp=sha256(key.export({type:"spki",format:"der"}));
    if(signer.keyFingerprint!==fp)reject("TRUST_ROSTER_KEY_MISMATCH");
    return key;
  }catch(error){
    if(String(error).includes("J26_"))throw error;
    reject("BAD_PUBLIC_KEY");
  }
}
export function verifyApprovalRoster({rosterBytes,externalSha256,inspectedAt}){
  if(!Buffer.isBuffer(rosterBytes)||!isDigest(externalSha256))reject("INDEPENDENT_ROSTER_PIN_REQUIRED");
  const got=sha256(rosterBytes);
  if(!crypto.timingSafeEqual(Buffer.from(got,"hex"),Buffer.from(externalSha256,"hex"))){
    reject("APPROVAL_ROSTER_PIN_MISMATCH");
  }
  let roster;
  try{roster=JSON.parse(rosterBytes.toString("utf8"));}
  catch{reject("APPROVAL_ROSTER_INVALID_JSON");}
  if(roster?.schema!=="thiepn-japanese-j26-independent-approval-roster"||
     !Array.isArray(roster.signers)||roster.signers.length<APPROVAL_ROLES.length){
    reject("APPROVAL_ROSTER_INCOMPLETE");
  }
  const now=instant(inspectedAt,"inspection");
  const ids=new Map(),keys=new Set();
  for(const item of roster.signers){
    if(typeof item?.id!=="string"||!item.id.trim()||ids.has(item.id))reject("DUPLICATE_APPROVAL_SIGNER");
    const key=publicKey(item);
    if(keys.has(item.keyFingerprint))reject("DUPLICATE_APPROVAL_KEY");
    keys.add(item.keyFingerprint);
    if(!APPROVAL_ROLES.includes(item.role)||item.revoked!==false||
       item.independentToProject!==true||item.identityAuditedByOperator!==true||
       !isDigest(item.identityEvidenceSha256)){
      reject("UNTRUSTED_OR_REVOKED_APPROVER:"+item.id);
    }
    const from=instant(item.validFrom,"validFrom"),until=instant(item.validUntil,"validUntil");
    if(from>=until||now<from||now>until)reject("EXPIRED_APPROVAL_KEY:"+item.id);
    ids.set(item.id,{...item,key});
  }
  return {ids,sha256:got,inspectedAt:new Date(now).toISOString()};
}
/**
 * Exact canonical bytes approved by a signer. Signing is performed by the
 * separate operator; this module never creates keys, requests signatures, or
 * executes a production action.
 */
export function approvalPayload({candidateCommit,admissionReceiptSha256,
  decisionContextSha256,stagingCommit,rollbackCommit,visualPacketSha256,
  reviewSha256,requestedAt,expiresAt,role,signerId,signedAt}){
  return JSON.stringify({
    schema:"thiepn-japanese-j26-detached-human-approval",version:1,
    candidateCommit,admissionReceiptSha256,decisionContextSha256,
    stagingCommit,rollbackCommit,visualPacketSha256,reviewSha256,
    requestedAt,expiresAt,role,signerId,signedAt,
    disposition:"ACKNOWLEDGE_EVIDENCE_ONLY_NO_AUTOMATIC_CUTOVER"
  });
}
/**
 * Offline independent operator-only inspection; even four valid signatures
 * are a STRUCTURAL acceptance receipt, not production authorization.
 */
export function inspectIndependentApprovals({
  candidateCommit,j25Admission,approvalPackage,rosterBytes,rosterPin,
  inspectedAt,j24EvidenceSignerIds
}){
  assertCandidate(candidateCommit);
  const roster=verifyApprovalRoster({rosterBytes,externalSha256:rosterPin,inspectedAt});
  if(j25Admission?.schema!=="thiepn-japanese-j25-independent-admission-receipt"||
    j25Admission.candidateCommit!==candidateCommit||
    j25Admission.checkedKinds!==9||j25Admission.operatorAttestationsChecked!==2||
    j25Admission.pinsVerified!==true||j25Admission.revocationsCurrent!==true||
    j25Admission.operatorSignaturesValidAgainstPinnedRoster!==true||
    j25Admission.decision!=="REQUIRES_INDEPENDENT_HUMAN_RELEASE_DECISION"||
    j25Admission.releaseAuthorized!==false||j25Admission.independentHumanIdentityVerified!==false||
    !isDigest(j25Admission.admissionDigest)){
    reject("J25_ADMISSION_NOT_QUALIFIED");
  }
  const pkg=approvalPackage;
  if(pkg?.schema!=="thiepn-japanese-j26-independent-approval-package"||
    pkg.releaseAuthorized!==false||pkg.automaticCutover===true||
    pkg.merged===true||pkg.deployed===true)reject("AUTO_RELEASE_CLAIM_FORBIDDEN");
  sameSha(pkg.candidateCommit,candidateCommit,"package");
  if(pkg.admissionReceiptSha256!==sha256(Buffer.from(JSON.stringify(j25Admission)))||
    !isDigest(pkg.decisionContextSha256)||
    !isDigest(pkg.visualPacketSha256)||!isDigest(pkg.reviewSha256)||
    pkg.visualCases!==VISUAL_CASES||pkg.originalPngCount!==VISUAL_IMAGES||
    pkg.stagingCommit!==candidateCommit||
    !isSha(pkg.rollbackCommit)||pkg.rollbackCommit===candidateCommit){
    reject("EVIDENCE_STAGING_ROLLBACK_BINDING_INVALID");
  }
  const checked=instant(inspectedAt,"inspection");
  const requested=instant(pkg.requestedAt,"request");
  const expiry=instant(pkg.expiresAt,"expiry");
  const admitted=instant(j25Admission.inspectedAt,"admission");
  if(requested<admitted||requested>checked+5*60_000||
    expiry<=requested||expiry-requested>48*60*60_000||expiry<checked){
    reject("STALE_FUTURE_OR_REPLAYED_APPROVAL");
  }
  if(!Array.isArray(pkg.approvals)||pkg.approvals.length!==APPROVAL_ROLES.length){
    reject("HUMAN_APPROVAL_QUORUM_INCOMPLETE");
  }
  if(!Array.isArray(j24EvidenceSignerIds)||j24EvidenceSignerIds.length!==9||
    j24EvidenceSignerIds.some(x=>typeof x!=="string"||!x.trim())){
    reject("EVIDENCE_SIGNER_CONTEXT_REQUIRED");
  }
  const usedRoles=new Set(),usedIds=new Set();
  for(const approval of pkg.approvals){
    const {role,signerId}=approval??{};
    if(!APPROVAL_ROLES.includes(role)||usedRoles.has(role)||
      typeof signerId!=="string"||usedIds.has(signerId)||
      j24EvidenceSignerIds.includes(signerId)){
      reject("APPROVER_SEPARATION_OR_ROLE_INVALID");
    }
    const signer=roster.ids.get(signerId);
    if(!signer||signer.role!==role)reject("APPROVER_ROLE_UNTRUSTED:"+role);
    const signed=instant(approval.signedAt,"signature");
    if(signed<requested||signed>checked+5*60_000||signed>expiry||
       signed<instant(signer.validFrom,"approver-key-start")||
       signed>instant(signer.validUntil,"approver-key-expiry")){
      reject("STALE_OR_FUTURE_APPROVER_SIGNATURE");
    }
    if(typeof approval.signature!=="string"||
      !/^[A-Za-z0-9+/]+={0,2}$/.test(approval.signature)){
      reject("APPROVAL_SIGNATURE_NOT_BASE64");
    }
    const body=approvalPayload({...pkg,role,signerId,signedAt:approval.signedAt});
    const sig=Buffer.from(approval.signature,"base64");
    if(sig.length!==64||!crypto.verify(null,Buffer.from(body),signer.key,sig)){
      reject("APPROVAL_SIGNATURE_MISMATCH:"+role);
    }
    usedRoles.add(role);usedIds.add(signerId);
  }
  if(usedRoles.size!==APPROVAL_ROLES.length)reject("MISSING_APPROVAL_ROLE");
  return {
    schema:"thiepn-japanese-j26-operator-intake-receipt",candidateCommit,
    rosterDigest:roster.sha256,admissionReceiptDigest:pkg.admissionReceiptSha256,
    approvalPackageDigest:sha256(Buffer.from(JSON.stringify(pkg))),
    fourIndependentSignaturesValid:true,operatorIdentityEvidence:"declared-in-externally-pinned-roster",
    actualHumanIdentityReverifiedByThisProcess:false,
    physicalAndroidSessionPersonallyWitnessed:false,
    actualGoogleOAuthCallbackPersonallyWitnessed:false,
    realScreenshotArchivePersonallyInspected:false,
    stagingAndRollbackPersonallyWitnessed:false,
    finalProductionReleaseAuthorization:"not_granted",
    mergeAuthorized:false,deploymentAuthorized:false,releaseAuthorized:false,
    decision:"WAITING_FOR_EXPLICIT_SEPARATE_RELEASE_AUTHORITY"
  };
}
export function unsignedApprovalTemplate(candidateCommit,j25Admission){
  assertCandidate(candidateCommit);
  sameSha(j25Admission?.candidateCommit,candidateCommit,"admission");
  return {
    schema:"thiepn-japanese-j26-independent-approval-package",candidateCommit,
    admissionReceiptSha256:sha256(Buffer.from(JSON.stringify(j25Admission))),
    decisionContextSha256:null,visualPacketSha256:null,reviewSha256:null,
    visualCases:42,originalPngCount:126,stagingCommit:null,rollbackCommit:null,
    requestedAt:null,expiresAt:null,releaseAuthorized:false,automaticCutover:false,
    merged:false,deployed:false,
    approvals:APPROVAL_ROLES.map(role=>({role,signerId:null,signedAt:null,signature:null}))
  };
}
function read(file){return JSON.parse(fs.readFileSync(path.join(ROOT,file),"utf8"));}
export function runCli(args=process.argv.slice(2)){
  const candidateCommit=process.env.J26_CANDIDATE_SHA;
  assertCandidate(candidateCommit);
  if(!args.length){
    const decision=recordBlockedDecision({
      candidateCommit,
      j23:read("artifacts/j23-release-evidence-reconciliation.json"),
      j24:read("artifacts/j24-operator-readiness.json"),
      j25:read("artifacts/j25-controlled-release-decision.json"),
      signoff:read("release/j15d-d5-release-signoff.json"),
      field:read("release/j16-field-acceptance.json"),
      production:read("release/p22-production.json")
    });
    fs.mkdirSync(path.join(ROOT,"artifacts"),{recursive:true});
    fs.writeFileSync(path.join(ROOT,"artifacts/j26-protected-release-decision.json"),JSON.stringify(decision,null,2)+"\n");
    process.stdout.write("J26 exact-head protected release BLOCKED: missing authentic independent operator acceptance\n");
    return decision;
  }
  if(args.length!==8||args[0]!=="--inspect-approval"||args[2]!=="--admission"||args[4]!=="--roster"||args[6]!=="--evidence-receipt"){
    reject("OFFLINE_INSPECTION_USAGE");
  }
  if(!isDigest(process.env.J26_APPROVAL_ROSTER_SHA256))reject("INDEPENDENT_ROSTER_PIN_REQUIRED");
  const j25Admission=JSON.parse(fs.readFileSync(path.resolve(args[3]),"utf8"));
  const approvalPackage=JSON.parse(fs.readFileSync(path.resolve(args[1]),"utf8"));
  const rosterBytes=fs.readFileSync(path.resolve(args[5]));
  const j24Receipt=JSON.parse(fs.readFileSync(path.resolve(args[7]),"utf8"));
  if(j24Receipt?.schema!=="thiepn-japanese-j24-cryptographic-provenance-receipt"||
     j24Receipt.candidateCommit!==candidateCommit||
     j24Receipt.locallyHashedEvidenceCount!==9||
     j24Receipt.signaturesValidAgainstSuppliedRoster!==true||
     j24Receipt.releaseAuthorized!==false||
     !Array.isArray(j24Receipt.evidence)||j24Receipt.evidence.length!==9||
     j24Receipt.evidence.some(row=>!row||typeof row.signerId!=="string"||!row.signerId.trim())){
    reject("J24_EVIDENCE_RECEIPT_INVALID");
  }
  const receipt=inspectIndependentApprovals({
    candidateCommit,j25Admission,approvalPackage,rosterBytes,
    rosterPin:process.env.J26_APPROVAL_ROSTER_SHA256,inspectedAt:new Date().toISOString(),
    j24EvidenceSignerIds:j24Receipt.evidence.map(row=>row.signerId)
  });
  process.stdout.write(JSON.stringify(receipt,null,2)+"\n");
  return receipt;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))runCli();
