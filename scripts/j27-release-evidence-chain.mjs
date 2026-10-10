import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const SHA=/^[a-f0-9]{40}$/;
const HASH=/^[a-f0-9]{64}$/;
export const SOURCES=Object.freeze([
  ["J20","artifacts/j20-automated-qualification.json","thiepn-japanese-j20-automated-qualification"],
  ["J21","artifacts/j21-content-audit.json","thiepn-japanese-j21-content-audit"],
  ["J21-review","artifacts/j21-language-review-packet.json","thiepn-japanese-j21-language-review-packet"],
  ["J22","artifacts/j22-automated-acceptance.json","thiepn-japanese-j22-acceptance"],
  ["J23","artifacts/j23-release-evidence-reconciliation.json","thiepn-japanese-j23-release-evidence-reconciliation"],
  ["J24","artifacts/j24-operator-readiness.json","thiepn-japanese-j24-operator-readiness"],
  ["J25","artifacts/j25-controlled-release-decision.json","thiepn-japanese-j25-controlled-release-decision"],
  ["J26","artifacts/j26-protected-release-decision.json","thiepn-japanese-j26-protected-release-decision"]
]);
export const REQUIRED_MANIFESTS=Object.freeze([
  ["signoffs","release/j15d-d5-release-signoff.json"],
  ["field","release/j16-field-acceptance.json"],
  ["production","release/p22-production.json"]
]);
function fail(s){throw new Error("J27_"+s);}
function digest(raw){return crypto.createHash("sha256").update(raw).digest("hex");}
function requireSha(s){if(typeof s!=="string"||!SHA.test(s))fail("EXACT_SHA_REQUIRED");}
function json(bytes,label){
  if(!Buffer.isBuffer(bytes)||bytes.length===0||bytes.length>2_000_000)fail("SOURCE_SIZE_INVALID:"+label);
  try{return JSON.parse(bytes.toString("utf8"));}
  catch{fail("JSON_INVALID:"+label);}
}
function falseFlag(record,key,label){if(record[key]!==false)fail("RELEASE_FLAG_NOT_FALSE:"+label+":"+key);}
function validatePhase(name,record,sha){
  if(record.candidateCommit!==sha)fail("HEAD_MISMATCH:"+name);
  switch(name){
    case "J20":
      if(record.automated?.status!=="passed"||record.releaseDecision!=="not_authorized")fail("J20_PREREQUISITE_INVALID");
      break;
    case "J21":
      if(record.integrityStatus!=="passed"||record.externalHumanReview!=="not_obtained"||
        record.semanticJapaneseReview!=="pending")fail("J21_INDEPENDENT_REVIEW_INVALID");
      falseFlag(record,"releaseAuthorized",name);break;
    case "J21-review":
      if(!Array.isArray(record.items)||!record.items.length||
        !HASH.test(record.packetSha256??""))fail("J21_REVIEW_PACKET_INVALID");
      break;
    case "J22":
      if(record.expectedCases!==42||record.requiredImageCount!==126||
        record.visualArchiveStatus!=="pending-exact-head-j15d-d4-artifact"||
        record.screenshotBaselineUpdated!==false||
        record.independentVisualReview!=="pending")fail("J22_VISUAL_BOUNDARY_INVALID");
      falseFlag(record,"releaseAuthorized",name);break;
    case "J23":
      if(record.automatedIntegrity!=="passed"||
        record.decision!=="BLOCKED_AWAITING_INDEPENDENT_EVIDENCE"||
        record.actualVisualCasesVerified!==0||
        record.actualVisualImagesVerified!==0)fail("J23_HUMAN_ACCEPTANCE_INVALID");
      falseFlag(record,"releaseAuthorized",name);break;
    case "J24":
      if(record.automatedJ23Reconciliation!=="passed"||
        record.decision!=="BLOCKED_OPERATOR_EVIDENCE_NOT_PRESENT"||
        record.externalSignaturesVerified!==false)fail("J24_EXTERNAL_EVIDENCE_INVALID");
      falseFlag(record,"releaseAuthorized",name);break;
    case "J25":
      if(record.decision!=="BLOCKED_EXTERNAL_ACCEPTANCE_AND_HUMAN_APPROVAL"||
        record.exactVisualArchiveCases!==42||record.exactVisualImageFiles!==126)fail("J25_APPROVAL_BOUNDARY_INVALID");
      for(const key of ["releaseAuthorized","mergeAuthorized","deploymentAuthorized"])falseFlag(record,key,name);
      break;
    case "J26":
      if(record.decision!=="BLOCKED_MISSING_INDEPENDENT_APPROVAL_AND_CUTOVER_AUTHORITY"||
        record.cutover!=="prohibited"||record.expectedVisualCases!==42||
        record.expectedOriginalVisualImages!==126||record.humanReleaseApproval!=="not_provided")fail("J26_PROTECTED_RELEASE_INVALID");
      for(const key of ["releaseAuthorized","mergeAuthorized","deploymentAuthorized"])falseFlag(record,key,name);
      break;
    default:fail("UNKNOWN_PHASE");
  }
}
function validateManifest(name,record){
  if(name==="signoffs"){
    if(record.schema!=="thiepn-japanese-j15d-d5-release-signoff"||
       record.status!=="pending"||record.candidateCommit!==null||
       Object.values(record.signoffs??{}).some(x=>x.status!=="pending"||x.reviewer!==null||x.evidenceRef!==null)){
      fail("HUMAN_SIGNOFF_MUTATED");
    }
  }else if(name==="field"){
    if(record.schema!=="thiepn-japanese-j16-field-acceptance"||
      record.status!=="pending"||record.stablePromotion!=="not_authorized"||
      record.rollback?.tested!==false||record.deployedCandidateCommit!==null)fail("STAGING_MANIFEST_MUTATED");
  }else if(name==="production"){
    if(record.schema!=="thiepn-japanese-p22-production"||
      record.status!=="candidate"||record.releaseCommit!==null||
      record.releaseTag!==null||record.activatedAt!==null)fail("PRODUCTION_ACTIVATION_FORGED");
  }
}
/**
 * Hash raw exact-head CI records in required immutable order, no secret
 * external human artifacts are imported and no approvals are manufactured.
 */
export function buildEvidenceChain({candidateCommit,readRaw}){
  requireSha(candidateCommit);
  if(typeof readRaw!=="function")fail("SOURCE_READER_REQUIRED");
  const inputs=[],checks={};
  for(const [name,file,schema] of SOURCES){
    const raw=readRaw(file),parsed=json(raw,name);
    if(parsed.schema!==schema)fail("SCHEMA_MISMATCH:"+name);
    validatePhase(name,parsed,candidateCommit);
    inputs.push({name,path:file,sha256:digest(raw),bytes:raw.length});
    checks[name]="checked-exact-head";
  }
  const manifests=[];
  for(const [name,file] of REQUIRED_MANIFESTS){
    const raw=readRaw(file),parsed=json(raw,name);
    validateManifest(name,parsed);
    manifests.push({name,path:file,sha256:digest(raw),bytes:raw.length});
  }
  let predecessor="0".repeat(64);
  const chain=inputs.map(row=>{
    const previous=predecessor;
    predecessor=digest(Buffer.from(JSON.stringify({candidateCommit,previous,...row})));
    return {...row,previous,chainSha256:predecessor};
  });
  const result={
    schema:"thiepn-japanese-j27-evidence-chain",
    schemaVersion:1,candidateCommit,
    sequence:chain,
    releaseManifestDigests:manifests,
    chainRoot:predecessor,
    manifestRoot:digest(Buffer.from(JSON.stringify(manifests))),
    independentVisualArchive:"not_supplied_to_ci",
    originalScreenshotCases:42,originalImageFiles:126,
    realAndroidAndTalkBack:"not_verified_by_ci",
    genuineGoogleOAuth:"not_verified_by_ci",
    independentJapaneseReview:"not_verified_by_ci",
    trustedHumanApprovals:"not_verified_by_ci",
    stableReleaseTag:"not_created",
    mergeAuthorized:false,deploymentAuthorized:false,releaseAuthorized:false,
    decision:"BLOCKED_INDEPENDENT_ACCEPTANCE_EVIDENCE",
    checks
  };
  return {...result,reportSha256:digest(Buffer.from(JSON.stringify(result)))};
}
export function verifyEvidenceChain({candidateCommit,report,readRaw}){
  const computed=buildEvidenceChain({candidateCommit,readRaw});
  if(report?.schema!==computed.schema||report.reportSha256!==computed.reportSha256||
    JSON.stringify(report)!==JSON.stringify(computed)){
    fail("EVIDENCE_CHAIN_TAMPERED_OR_STALE");
  }
  return {candidateCommit,verified:true,chainRoot:computed.chainRoot,
    authorization:"not_granted"};
}
function rootRead(relative){
  const absolute=path.resolve(ROOT,relative);
  if(!absolute.startsWith(ROOT+path.sep))fail("PATH_OUTSIDE_ROOT");
  return fs.readFileSync(absolute);
}
export function runCli(args=process.argv.slice(2)){
  const candidateCommit=process.env.J27_CANDIDATE_SHA;
  requireSha(candidateCommit);
  if(!args.length){
    const report=buildEvidenceChain({candidateCommit,readRaw:rootRead});
    fs.mkdirSync(path.join(ROOT,"artifacts"),{recursive:true});
    fs.writeFileSync(path.join(ROOT,"artifacts/j27-evidence-chain.json"),JSON.stringify(report,null,2)+"\n");
    console.log("J27 "+candidateCommit+" machine evidence chain verified; human acceptance and release remain BLOCKED");
    return report;
  }
  if(args.length!==2||args[0]!=="--verify-chain")fail("UNKNOWN_ARGUMENTS");
  const report=json(fs.readFileSync(path.resolve(args[1])),"report");
  const receipt=verifyEvidenceChain({candidateCommit,report,readRaw:rootRead});
  process.stdout.write(JSON.stringify(receipt,null,2)+"\n");
  return receipt;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))runCli();
