import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {auditArchive,validateReviewSubmission} from "./j22-visual-accessibility.mjs";
import {validateReviewerSubmission,verifyPacket as verifyLanguagePacket} from "./j21-language-audit.mjs";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const SHA=/^[0-9a-f]{40}$/;
const HASH=/^[0-9a-f]{64}$/;
const EVIDENCE=/^sha256:[0-9a-f]{64}$/;
export const REQUIRED_ROLES=Object.freeze({
  exactVisualArchive:"visual",
  physicalAndroidAndTalkBack:"android",
  realAccountOAuth:"oauth",
  independentJapaneseReview:"language",
  independentVisualAccessibilityReview:"visual",
  independentAccessibilitySignoff:"accessibility",
  independentP11LearnerReview:"language",
  exactStagingIdentity:"release-operator",
  testedRollback:"release-operator"
});
export const ANDROID_CHECKS=Object.freeze([
  "realAndroidDevice","exactCandidateCommit","standaloneInstall","coldLaunch",
  "darkLightAndPersistence","todayLearnImmerseLibraryProgress",
  "studyFullScreenAndTouch","readerNavigationAndSupport","librarySearchAndFilters",
  "offlineReload","backgroundResume","rotationPortraitLandscape","safeAreaBottomNav",
  "textScale200Percent","keyboardFocus","screenReaderTalkBack",
  "speakerHeadphoneAudio","microphonePermissionAndCapture","localAudioDelete",
  "noHorizontalOverflow320","noBlockingVisualDefects"
]);
function fail(code){throw new Error("J24_"+code);}
function exactSha(sha){if(typeof sha!=="string"||!SHA.test(sha))fail("EXACT_SHA_REQUIRED");}
function digest(raw){return crypto.createHash("sha256").update(raw).digest("hex");}
function nonblank(value){return typeof value==="string"&&value.trim().length>0;}
function dated(value){return typeof value==="string"&&Number.isFinite(Date.parse(value));}
function evidence(value){return typeof value==="string"&&EVIDENCE.test(value);}
function exact(obj,candidateCommit,label){
  if(obj?.candidateCommit!==candidateCommit)fail("CANDIDATE_MISMATCH:"+label);
}
function readSafe(root,relative,maxBytes=2_000_000){
  if(typeof relative!=="string"||!relative||relative.startsWith("/")||
    relative.includes("\\")||relative.split("/").some(part=>!part||part==="."||part==="..")||
    !/^[a-zA-Z0-9_./-]+$/.test(relative))fail("UNSAFE_EVIDENCE_PATH");
  const absolute=path.resolve(root,relative),rootReal=fs.realpathSync(root);
  if(!absolute.startsWith(path.resolve(root)+path.sep))fail("PATH_TRAVERSAL");
  const real=fs.realpathSync(absolute);
  if(!real.startsWith(rootReal+path.sep)||!fs.statSync(real).isFile()||
    fs.lstatSync(absolute).isSymbolicLink())fail("EVIDENCE_SYMLINK_OR_ESCAPE");
  const size=fs.statSync(real).size;
  if(size<1||size>maxBytes)fail("EVIDENCE_FILE_SIZE");
  return fs.readFileSync(real);
}
function parse(raw,label){
  try{return JSON.parse(raw.toString("utf8"));}
  catch{fail("INVALID_JSON:"+label);}
}
export function pendingReadiness(candidateCommit,j23){
  exactSha(candidateCommit);
  if(j23?.schema!=="thiepn-japanese-j23-release-evidence-reconciliation"||
    j23.candidateCommit!==candidateCommit||
    j23.automatedIntegrity!=="passed"||
    j23.decision!=="BLOCKED_AWAITING_INDEPENDENT_EVIDENCE"||
    j23.releaseAuthorized!==false)fail("J23_EXACT_HEAD_GATE_INVALID");
  return {
    schema:"thiepn-japanese-j24-operator-readiness",
    schemaVersion:1,candidateCommit,
    automatedJ23Reconciliation:"passed",
    expectedExternalEvidence:Object.keys(REQUIRED_ROLES),
    independentEvidenceTrustRoster:"operator-only-not-provided-to-ci",
    visualArchive:"pending-real-42-case-126-PNG-evidence",
    androidTalkBackPwa:"pending-physical-device",
    actualAccountOAuth:"pending-operator-session",
    languageAndP11:"pending-independent-review",
    accessibility:"pending-independent-review",
    stagingIdentity:"pending-exact-deployed-sha",
    rollbackDrill:"pending-tested-recovery",
    externalSignaturesVerified:false,
    independentHumanIdentityVerified:false,
    releaseAuthorized:false,
    decision:"BLOCKED_OPERATOR_EVIDENCE_NOT_PRESENT",
    note:"CI never supplies a trust keyring, an independent reviewer, device tests or rollout authorization."
  };
}
function validateRecord(kind,raw,candidateCommit,context){
  const obj=parse(raw,kind);
  exact(obj,candidateCommit,kind);
  switch(kind){
    case "exactVisualArchive":{
      const packet=auditArchive({
        candidateCommit,report:obj,
        readImage:name=>readSafe(context.rootDir,"screenshots/"+name,25_000_000)
      });
      const recorded=context.records.exactVisualArchive.imagesDigest;
      const actual=digest(Buffer.from(JSON.stringify(packet.imageMeta)));
      if(recorded!==actual)fail("VISUAL_IMAGE_DIGEST_MISMATCH");
      context.visualPacket=packet;
      break;
    }
    case "independentJapaneseReview":{
      verifyLanguagePacket(context.languagePacket);
      exact(context.languagePacket,candidateCommit,"language-packet");
      const receipt=validateReviewerSubmission(context.languagePacket,obj);
      if(receipt.structuralValidation!=="passed"||obj.decision!=="approve"||receipt.concerns!==0)fail("LANGUAGE_REVIEW_NOT_CLEAR");
      break;
    }
    case "independentVisualAccessibilityReview":{
      if(!context.visualPacket)fail("VISUAL_ARCHIVE_MUST_PRECEDE_REVIEW");
      const receipt=validateReviewSubmission(context.visualPacket,obj);
      if(!receipt.structureValidated||obj.decision!=="reviewed-no-defects"||receipt.defects!==0)fail("VISUAL_REVIEW_NOT_CLEAR");
      break;
    }
    case "physicalAndroidAndTalkBack":{
      if(obj.schema!=="thiepn-japanese-j16b-android-session"||obj.status!=="pass"||
        !nonblank(obj.sessionId)||!dated(obj.completedAt)||!nonblank(obj.device?.model)||
        !nonblank(obj.device?.androidVersion)||!nonblank(obj.device?.browserVersion)||
        obj.device?.installedPwa!==true||obj.accountSso?.status!=="pass")fail("REAL_ANDROID_SESSION_INCOMPLETE");
      for(const check of ANDROID_CHECKS){
        const row=obj.checks?.[check];
        if(row?.status!=="pass"||!dated(row.verifiedAt)||!evidence(row.evidenceRef)){
          fail("ANDROID_CHECK_MISSING:"+check);
        }
      }
      break;
    }
    case "realAccountOAuth":{
      if(obj.schema!=="thiepn-japanese-j24-oauth-session"||obj.status!=="pass"||
        obj.provider!=="THIEPN Account"||obj.firstPartyClientRegistered!==true||
        obj.chromeCallbackVerified!==true||obj.installedPwaCallbackVerified!==true||
        obj.stateAndNonceVerified!==true||obj.sessionPersistenceVerified!==true||
        obj.signOutVerified!==true||obj.tokensRedacted!==true||
        !dated(obj.testedAt)||!evidence(obj.evidenceRef))fail("OAUTH_SESSION_NOT_VERIFIED");
      break;
    }
    case "independentAccessibilitySignoff":{
      if(obj.schema!=="thiepn-japanese-j24-accessibility-signoff"||
        obj.status!=="pass"||obj.talkBackVerified!==true||
        obj.keyboardVerified!==true||obj.textScaleVerified!==true||
        !dated(obj.reviewedAt)||!evidence(obj.evidenceRef))fail("ACCESSIBILITY_SIGNOFF_NOT_VERIFIED");
      break;
    }
    case "independentP11LearnerReview":{
      if(obj.schema!=="thiepn-japanese-j24-p11-review"||
        obj.status!=="pass"||obj.externalReviewComplete!==true||
        !dated(obj.reviewedAt)||!evidence(obj.evidenceRef))fail("P11_HUMAN_REVIEW_MISSING");
      break;
    }
    case "exactStagingIdentity":{
      if(obj.schema!=="thiepn-japanese-j24-staging-identity"||
        obj.status!=="pass"||obj.deployedCommit!==candidateCommit||
        obj.releaseMetaCommit!==candidateCommit||
        typeof obj.url!=="string"||!obj.url.startsWith("https://")||
        !dated(obj.observedAt)||!evidence(obj.evidenceRef))fail("STAGING_SHA_NOT_MATCHED");
      break;
    }
    case "testedRollback":{
      if(obj.schema!=="thiepn-japanese-j24-rollback-drill"||
        obj.tested!==true||obj.preRollbackCommit!==candidateCommit||
        !SHA.test(obj.restoredCommit??"")||obj.restoredCommit===candidateCommit||
        !dated(obj.performedAt)||!evidence(obj.evidenceRef))fail("ROLLBACK_NOT_TESTED");
      break;
    }
    default:fail("UNSUPPORTED_EVIDENCE_KIND");
  }
}
function checkSignature({candidateCommit,kind,record,keyring,signerIds}){
  const att=record.attestation;
  if(!nonblank(att?.signerId)||typeof att?.signature!=="string"||
     !/^[a-zA-Z0-9+/]+={0,2}$/.test(att.signature))fail("SIGNATURE_NOT_PROVIDED:"+kind);
  const signer=keyring.signers.find(entry=>entry.id===att.signerId);
  if(!signer||signer.revoked!==false||signer.independentToProject!==true||
    !Array.isArray(signer.roles)||!signer.roles.includes(REQUIRED_ROLES[kind])||
    !nonblank(signer.publicKeyPem))fail("UNTRUSTED_REVIEWER_ROLE:"+kind);
  if(["independentJapaneseReview","independentVisualAccessibilityReview","independentAccessibilitySignoff"]
    .includes(kind)&&signerIds["exactStagingIdentity"]===att.signerId){
    fail("REVIEWER_NOT_INDEPENDENT_OF_OPERATOR");
  }
  const message=JSON.stringify({
    schema:"thiepn-japanese-j24-detached-evidence-signature",
    candidateCommit,kind,file:record.file,sha256:record.sha256,
    imagesDigest:record.imagesDigest??null,signerId:att.signerId
  });
  let valid=false;
  try{valid=crypto.verify(null,Buffer.from(message,"utf8"),crypto.createPublicKey(signer.publicKeyPem),
    Buffer.from(att.signature,"base64"));}
  catch{fail("INVALID_SIGNER_KEY:"+kind);}
  if(!valid)fail("INVALID_SIGNATURE:"+kind);
  return att.signerId;
}
/**
 * Offline structural/cryptographic assessment only.
 * A valid trust roster must be provisioned by a separate, authorized operator.
 * A signature and file hash never prove that a human actually did a physical test.
 */
export function inspectBundle({candidateCommit,bundle,keyring,rootDir,languagePacket}){
  exactSha(candidateCommit);
  if(bundle?.schema!=="thiepn-japanese-j24-independent-evidence-bundle"||
     bundle.releaseAuthorized!==false||bundle.humanApprovalGranted===true)fail("BUNDLE_CANNOT_AUTHORIZE_RELEASE");
  exact(bundle,candidateCommit,"bundle");
  if(keyring?.schema!=="thiepn-japanese-j24-external-trust-roster"||
     !Array.isArray(keyring.signers)||!keyring.signers.length)fail("INDEPENDENT_TRUST_ROSTER_REQUIRED");
  if(!rootDir||!fs.statSync(rootDir).isDirectory())fail("BUNDLE_DIRECTORY_REQUIRED");
  const expected=Object.keys(REQUIRED_ROLES);
  if(!bundle.records||Object.keys(bundle.records).length!==expected.length)fail("EVIDENCE_CATEGORY_COVERAGE_INVALID");
  const context={rootDir,records:bundle.records,languagePacket,visualPacket:null};
  const signerIds={},verified=[];
  for(const kind of expected){
    const record=bundle.records[kind];
    if(record?.candidateCommit!==candidateCommit||record.status!=="submitted"||
      !HASH.test(record.sha256??"")||!nonblank(record.file)){
      fail("RECORD_INCOMPLETE_OR_WRONG_SHA:"+kind);
    }
    const raw=readSafe(rootDir,record.file);
    const actual=digest(raw);
    if(!crypto.timingSafeEqual(Buffer.from(actual,"hex"),Buffer.from(record.sha256,"hex"))){
      fail("ARTIFACT_HASH_MISMATCH:"+kind);
    }
    signerIds[kind]=checkSignature({candidateCommit,kind,record,keyring,signerIds});
    validateRecord(kind,raw,candidateCommit,context);
    verified.push({kind,sha256:actual,signerId:signerIds[kind]});
  }
  if(signerIds.independentJapaneseReview===signerIds.exactStagingIdentity||
     signerIds.independentVisualAccessibilityReview===signerIds.exactStagingIdentity||
     signerIds.independentAccessibilitySignoff===signerIds.exactStagingIdentity){
    fail("REVIEWERS_NOT_INDEPENDENT_FROM_OPERATOR");
  }
  return {
    schema:"thiepn-japanese-j24-cryptographic-provenance-receipt",
    candidateCommit,locallyHashedEvidenceCount:verified.length,
    signaturesValidAgainstSuppliedRoster:true,
    signerRosterExternallyAudited:false,humanIdentityIndependentlyVerified:false,
    physicalDeviceActuallyWitnessed:false,realOAuthActuallyWitnessed:false,
    independentLanguageReviewActuallyWitnessed:false,
    rollbackIndependentlyWitnessed:false,
    finalHumanReleaseDecision:"PENDING_OPERATOR_AUTHORIZATION",releaseAuthorized:false,
    status:"CONTENT_INTEGRITY_VERIFIED_HUMAN_AUTHENTICITY_UNVERIFIED",
    evidence:verified
  };
}
function readJson(name){return JSON.parse(fs.readFileSync(path.resolve(ROOT,name),"utf8"));}
export function runCli(args=process.argv.slice(2)){
  const candidateCommit=process.env.J24_CANDIDATE_SHA;
  exactSha(candidateCommit);
  if(args[0]==="--inspect-bundle"){
    if(args.length!==4||args[2]!=="--roster")fail("OFFLINE_INTAKE_USAGE");
    const rootDir=path.resolve(args[1]);
    const bundle=JSON.parse(readSafe(rootDir,"manifest.json"));
    const keyring=readJson(args[3]);
    const languagePacket=readJson("artifacts/j21-language-review-packet.json");
    const receipt=inspectBundle({candidateCommit,bundle,keyring,rootDir,languagePacket});
    process.stdout.write(JSON.stringify(receipt,null,2)+"\n");
    return receipt;
  }
  if(args.length!==0)fail("UNKNOWN_CLI_ARGUMENT");
  const report=pendingReadiness(candidateCommit,readJson("artifacts/j23-release-evidence-reconciliation.json"));
  fs.mkdirSync(path.join(ROOT,"artifacts"),{recursive:true});
  fs.writeFileSync(path.join(ROOT,"artifacts/j24-operator-readiness.json"),JSON.stringify(report,null,2)+"\n");
  console.log("J24 machine reconciliation valid for "+candidateCommit+"; independent operator evidence remains absent and release blocked");
  return report;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))runCli();
