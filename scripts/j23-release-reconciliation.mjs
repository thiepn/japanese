import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {verifyPacket as verifyLanguagePacket} from "./j21-language-audit.mjs";
import {visualCaseNames} from "./j16c-build-visual-review.mjs";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const HEX=/^[0-9a-f]{40}$/;
const DIGEST=/^sha256:[0-9a-f]{64}$/;
export const EVIDENCE_KINDS=[
  "exactVisualArchive","physicalAndroidAndTalkBack","realAccountOAuth",
  "independentJapaneseReview","independentVisualAccessibilityReview","testedRollback"
];

function sha256(value){return crypto.createHash("sha256").update(value).digest("hex");}
function requireSha(value){
  if(typeof value!=="string"||!HEX.test(value))throw new Error("J23_EXACT_CANDIDATE_SHA_REQUIRED");
}
function requireMatch(value,sha,name){
  if(value!==sha)throw new Error("J23_CANDIDATE_MISMATCH:"+name);
}
function input(value,schema,name){
  if(!value||typeof value!=="object"||value.schema!==schema)throw new Error("J23_INVALID_SOURCE:"+name);
  return value;
}
function assertNoApproval(value,label){
  if(value?.releaseAuthorized===true||value?.stablePromotion==="approved"||value?.releaseDecision==="approved"){
    throw new Error("J23_UNVERIFIED_AUTO_APPROVAL:"+label);
  }
}

/** Machine provenance only; no outside review or real-device assertion is inferred. */
export function checkMachinePrerequisites({candidateCommit,j20,j21,j21Packet,j22}){
  requireSha(candidateCommit);
  input(j20,"thiepn-japanese-j20-automated-qualification","j20");
  input(j21,"thiepn-japanese-j21-content-audit","j21");
  input(j21Packet,"thiepn-japanese-j21-language-review-packet","j21-packet");
  input(j22,"thiepn-japanese-j22-acceptance","j22");
  for(const [name,item] of [["j20",j20],["j21",j21],["j21-packet",j21Packet],["j22",j22]]){
    requireMatch(item.candidateCommit,candidateCommit,name);
    assertNoApproval(item,name);
  }
  if(j20.automated?.status!=="passed"||j20.releaseDecision!=="not_authorized"){
    throw new Error("J23_J20_AUTO_EVIDENCE_INVALID");
  }
  if(j21.integrityStatus!=="passed"||j21.semanticJapaneseReview!=="pending"||
      j21.externalHumanReview!=="not_obtained"||j21.releaseAuthorized!==false){
    throw new Error("J23_J21_CONTENT_EVIDENCE_INVALID");
  }
  verifyLanguagePacket(j21Packet);
  if(j22.expectedCases!==visualCaseNames().length||j22.requiredImageCount!==126||
      j22.visualArchiveStatus!=="pending-exact-head-j15d-d4-artifact"||
      j22.independentVisualReview!=="pending"||j22.humanAccessibility!=="pending"||
      j22.physicalAndroid!=="pending"||j22.realOAuth!=="pending"||
      j22.releaseAuthorized!==false){
    throw new Error("J23_J22_ACCEPTANCE_BOUNDARY_INVALID");
  }
  return {
    candidateCommit,machineRecords:[
      {phase:"J20",sha256:sha256(JSON.stringify(j20))},
      {phase:"J21",sha256:sha256(JSON.stringify(j21))},
      {phase:"J21-review-packet",sha256:sha256(JSON.stringify(j21Packet))},
      {phase:"J22",sha256:sha256(JSON.stringify(j22))}
    ],
    automatedRecordConsistency:"passed",
    humanEvidenceVerified:false
  };
}

/** Reference-only intake: SHA/digest checks do not authenticate an independent human. */
export function validateSubmittedEvidence({candidateCommit,bundle}){
  requireSha(candidateCommit);
  input(bundle,"thiepn-japanese-j23-independent-evidence-submission","bundle");
  requireMatch(bundle.candidateCommit,candidateCommit,"submitted-bundle");
  if(bundle.releaseAuthorized!==false||bundle.humanApprovalGranted===true){
    throw new Error("J23_SUBMISSION_CANNOT_APPROVE_RELEASE");
  }
  if(!bundle.records||typeof bundle.records!=="object"||
      Object.keys(bundle.records).length!==EVIDENCE_KINDS.length){
    throw new Error("J23_EVIDENCE_CATEGORIES_INCOMPLETE");
  }
  for(const kind of EVIDENCE_KINDS){
    const row=bundle.records[kind];
    if(!row||row.status!=="submitted"||row.candidateCommit!==candidateCommit){
      throw new Error("J23_EVIDENCE_NOT_EXACT_SHA:"+kind);
    }
    if(typeof row.artifactDigest!=="string"||!DIGEST.test(row.artifactDigest)||
        typeof row.evidenceRef!=="string"||!DIGEST.test(row.evidenceRef)){
      throw new Error("J23_CONTENT_ADDRESSED_EVIDENCE_REQUIRED:"+kind);
    }
    if(row.approved===true||row.verified===true){
      throw new Error("J23_UNVERIFIED_REVIEWER_CLAIM:"+kind);
    }
  }
  if(!Array.isArray(bundle.reviewerAssertions)||bundle.reviewerAssertions.length===0){
    throw new Error("J23_REVIEWER_ASSERTIONS_REQUIRED");
  }
  const names=new Set();
  for(const row of bundle.reviewerAssertions){
    if(typeof row?.role!=="string"||!["language","visual","accessibility","android","oauth","release-operator"].includes(row.role)||
      names.has(row.role)||typeof row.evidenceRef!=="string"||!DIGEST.test(row.evidenceRef)||
      row.identityVerified===true||row.approved===true){
      throw new Error("J23_UNVERIFIED_OR_DUPLICATE_REVIEWER_ASSERTION");
    }
    names.add(row.role);
  }
  return {
    schema:"thiepn-japanese-j23-submission-structural-receipt",
    candidateCommit,submittedEvidenceKinds:EVIDENCE_KINDS.length,
    structureValid:true,artifactContentVerified:false,reviewerIdentityVerified:false,
    independentApprovalVerified:false,physicalAndroidVerified:false,realOAuthVerified:false,
    rollbackVerified:false,releaseAuthorized:false,
    status:"awaiting-independent-operator-verification"
  };
}

export function reconcile({candidateCommit,machine,visualReview,deviceReview,p21Device,p11External,signoff,field,production}){
  requireSha(candidateCommit);
  const integrity=checkMachinePrerequisites({candidateCommit,...machine});
  input(visualReview,"thiepn-japanese-j15d-d5-visual-review","visual-review");
  input(deviceReview,"thiepn-japanese-j15d-d4-physical-acceptance","android");
  input(p21Device,"thiepn-japanese-p21-device-acceptance","p21-device");
  input(p11External,"thiepn-japanese-p11-external-validation","p11-external");
  input(signoff,"thiepn-japanese-j15d-d5-release-signoff","release-signoff");
  input(field,"thiepn-japanese-j16-field-acceptance","field");
  input(production,"thiepn-japanese-p22-production","production");

  // Checked-in human manifests are intentionally unsigned templates.
  // If they unexpectedly contain approval, never accept it from a source-branch CI run.
  for(const [label,record] of [["visual",visualReview],["android",deviceReview],["p21-device",p21Device],
    ["signoff",signoff],["field",field]]){
    if(record.status!=="pending"||record.releaseAuthorized===true){
      throw new Error("J23_UNVERIFIED_HUMAN_MANIFEST_CHANGED:"+label);
    }
  }
  if(!Array.isArray(p21Device.devices)||p21Device.devices.length||
    !Array.isArray(deviceReview.deviceEvidence)||deviceReview.deviceEvidence.length||
    !Array.isArray(visualReview.reviewedCases)||visualReview.reviewedCases.length||
    !Array.isArray(p11External.reviews)||p11External.reviews.length||
    !Array.isArray(signoff.defects)||signoff.defects.length){
    throw new Error("J23_UNVERIFIED_EVIDENCE_INSERTED_IN_SOURCE_BRANCH");
  }
  if(Object.values(signoff.signoffs??{}).some(row=>row?.status!=="pending")||
    field.stablePromotion!=="not_authorized"||field.rollback?.tested!==false){
    throw new Error("J23_RELEASE_SIGNOFF_OR_ROLLBACK_SPOOFED");
  }
  if(production.status!=="candidate"||production.releaseCommit!==null||production.activatedAt!==null){
    throw new Error("J23_UNAUTHORIZED_PRODUCTION_IDENTITY");
  }
  const blockers=[
    "EXACT_SHA_42_CASE_VISUAL_ARCHIVE_NOT_VERIFIED",
    "INDEPENDENT_JAPANESE_LANGUAGE_REVIEW_NOT_VERIFIED",
    "P11_EXTERNAL_LEARNER_REVIEW_NOT_VERIFIED",
    "PHYSICAL_ANDROID_PWA_TALKBACK_AUDIO_NOT_VERIFIED",
    "REAL_FIRST_PARTY_OAUTH_CALLBACK_NOT_VERIFIED",
    "INDEPENDENT_VISUAL_ACCESSIBILITY_REVIEW_NOT_VERIFIED",
    "PRODUCT_ACCESSIBILITY_RELEASE_SIGNOFF_NOT_VERIFIED",
    "EXACT_SHA_STAGING_AND_ROLLBACK_DRILL_NOT_VERIFIED",
    "PRODUCTION_ACTIVATION_NOT_AUTHORIZED"
  ];
  return {
    schema:"thiepn-japanese-j23-release-evidence-reconciliation",schemaVersion:1,
    candidateCommit,baselineCommit:machine.j22.baselineCommit,
    generatedAt:new Date().toISOString(),automatedRecords:integrity.machineRecords,
    automatedIntegrity:"passed",actualVisualCasesVerified:0,expectedVisualCases:42,
    actualVisualImagesVerified:0,expectedVisualImages:126,
    independentHumanIdentityVerified:false,
    humanJapaneseReviewVerified:false,physicalAndroidVerified:false,
    oauthCallbackVerified:false,rollbackDrillVerified:false,
    releaseAuthorized:false,decision:"BLOCKED_AWAITING_INDEPENDENT_EVIDENCE",
    blockers,nextGate:"independent evidence intake and human release authorization on separate evidence ref",
    notice:"CI verifies machine artifacts and pending templates only; it does not authenticate people, screenshot runs, OAuth or devices."
  };
}
function readJson(name){
  return JSON.parse(fs.readFileSync(path.resolve(ROOT,name),"utf8"));
}
export function runCli(args=process.argv.slice(2)){
  const candidateCommit=process.env.J23_CANDIDATE_SHA;
  requireSha(candidateCommit);
  if(args[0]==="--inspect-submission"){
    if(args.length!==2)throw new Error("J23_SUBMISSION_USAGE");
    const file=path.resolve(ROOT,args[1]);
    if(fs.statSync(file).size>2_000_000)throw new Error("J23_EVIDENCE_INPUT_TOO_LARGE");
    const result=validateSubmittedEvidence({candidateCommit,bundle:readJson(args[1])});
    process.stdout.write(JSON.stringify(result,null,2)+"\n");
    return result;
  }
  if(args.length)throw new Error("J23_UNKNOWN_CLI_ARGUMENT");
  const report=reconcile({
    candidateCommit,
    machine:{
      j20:readJson("artifacts/j20-automated-qualification.json"),
      j21:readJson("artifacts/j21-content-audit.json"),
      j21Packet:readJson("artifacts/j21-language-review-packet.json"),
      j22:readJson("artifacts/j22-automated-acceptance.json")
    },
    visualReview:readJson("release/j15d-d5-visual-review.json"),
    deviceReview:readJson("release/j15d-d4-device-acceptance.json"),
    p21Device:readJson("release/p21-device-acceptance.json"),
    p11External:readJson("release/p11-external-validation.json"),
    signoff:readJson("release/j15d-d5-release-signoff.json"),
    field:readJson("release/j16-field-acceptance.json"),
    production:readJson("release/p22-production.json")
  });
  fs.mkdirSync(path.resolve(ROOT,"artifacts"),{recursive:true});
  fs.writeFileSync(path.resolve(ROOT,"artifacts/j23-release-evidence-reconciliation.json"),JSON.stringify(report,null,2)+"\n");
  console.log("J23 machine evidence consistent for "+candidateCommit+"; release BLOCKED on human and operator gates");
  return report;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))runCli();
