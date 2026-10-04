import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const DEFAULT_MANIFEST="release/p11-external-validation.json";

export function readJson(filePath){
  return JSON.parse(fs.readFileSync(filePath,"utf8"));
}

export function sha256Text(value){
  return crypto.createHash("sha256").update(value,"utf8").digest("hex");
}

export function validateReviewPacket(packet){
  if(!packet||typeof packet!=="object")throw new Error("P11_REVIEW_PACKET_INVALID");
  if(packet.schema!=="thiepn-japanese-human-review-packet")throw new Error("P11_REVIEW_PACKET_SCHEMA_INVALID");
  if(packet.schemaVersion!==1)throw new Error("P11_REVIEW_PACKET_VERSION_UNSUPPORTED");
  if(packet.evidenceBoundary?.reviewDoesNotChangeMastery!==true||packet.evidenceBoundary?.reviewerScoreIsNotCefrCertification!==true)throw new Error("P11_REVIEW_PACKET_BOUNDARY_INVALID");
  if(!Array.isArray(packet.artifacts)||packet.artifacts.length===0)throw new Error("P11_REVIEW_PACKET_ARTIFACTS_REQUIRED");
  const ids=new Set();
  for(const artifact of packet.artifacts){
    requireString(artifact?.eventId,"packet artifact eventId");
    requireString(artifact?.taskId,"packet artifact taskId");
    if(ids.has(artifact.eventId))throw new Error("P11_REVIEW_PACKET_DUPLICATE_ARTIFACT:"+artifact.eventId);
    ids.add(artifact.eventId);
    if(!["writing","speaking"].includes(artifact?.mode))throw new Error("P11_REVIEW_PACKET_MODE_INVALID:"+artifact.eventId);
    requireString(artifact?.response,"packet artifact response");
  }
  return {artifacts:packet.artifacts.length};
}

export function validateExternalReviewSubmission(submission,packet){
  validateReviewPacket(packet);
  if(!submission||typeof submission!=="object")throw new Error("P11_EXTERNAL_SUBMISSION_INVALID");
  if(typeof submission.packetSha256==="string"&&submission.packetSha256!==sha256Text(JSON.stringify(packet,null,2)))throw new Error("P11_EXTERNAL_SUBMISSION_PACKET_DIGEST_MISMATCH");
  if(submission.schema!=="thiepn-japanese-p11-external-review-submission")throw new Error("P11_EXTERNAL_SUBMISSION_SCHEMA_INVALID");
  if(submission.schemaVersion!==1)throw new Error("P11_EXTERNAL_SUBMISSION_VERSION_UNSUPPORTED");
  requireString(submission.reviewerLabel,"reviewerLabel");
  if(!["teacher","tutor","language-professional"].includes(submission.reviewerRole))throw new Error("P11_EXTERNAL_SUBMISSION_ROLE_INVALID");
  if(submission.externalToProject!==true)throw new Error("P11_EXTERNAL_SUBMISSION_EXTERNAL_REQUIRED");
  if(typeof submission.reviewedAt!=="string"||!Number.isFinite(Date.parse(submission.reviewedAt)))throw new Error("P11_EXTERNAL_SUBMISSION_DATE_INVALID");
  if(!["approve","approve-with-notes","block"].includes(submission.verdict))throw new Error("P11_EXTERNAL_SUBMISSION_VERDICT_INVALID");
  if(!Array.isArray(submission.blockingIssues))throw new Error("P11_EXTERNAL_SUBMISSION_BLOCKERS_REQUIRED");
  for(const issue of submission.blockingIssues)requireString(issue,"blocking issue");
  if(!Array.isArray(submission.artifactReviews)||submission.artifactReviews.length===0)throw new Error("P11_EXTERNAL_SUBMISSION_ARTIFACT_REVIEWS_REQUIRED");

  const artifactById=new Map(packet.artifacts.map((artifact)=>[artifact.eventId,artifact]));
  const reviewedIds=new Set();
  const modalities=new Set();
  const scores=[];
  for(const review of submission.artifactReviews){
    requireString(review?.eventId,"artifact review eventId");
    if(reviewedIds.has(review.eventId))throw new Error("P11_EXTERNAL_SUBMISSION_DUPLICATE_ARTIFACT:"+review.eventId);
    reviewedIds.add(review.eventId);
    const artifact=artifactById.get(review.eventId);
    if(!artifact)throw new Error("P11_EXTERNAL_SUBMISSION_ARTIFACT_NOT_IN_PACKET:"+review.eventId);
    if(artifact.mode==="writing")modalities.add("writing");
    else modalities.add(review.spokenModality==="spoken_interaction"?"spoken_interaction":"spoken_production");
    for(const key of ["taskFulfillment","meaningAccuracy","coherence","register"]){
      const value=review?.rubric?.[key];
      if(!Number.isInteger(value)||value<0||value>4)throw new Error("P11_EXTERNAL_SUBMISSION_SCORE_INVALID:"+review.eventId+":"+key);
      scores.push(value);
    }
    if(!["accepted","concern"].includes(review?.disposition))throw new Error("P11_EXTERNAL_SUBMISSION_DISPOSITION_INVALID:"+review.eventId);
    if(artifact.mode==="speaking"&&!["spoken_interaction","spoken_production"].includes(review?.spokenModality))throw new Error("P11_EXTERNAL_SUBMISSION_SPOKEN_MODALITY_REQUIRED:"+review.eventId);
  }
  const hasWriting=modalities.has("writing");
  const hasSpeaking=modalities.has("spoken_interaction")||modalities.has("spoken_production");
  return {
    artifactCount:reviewedIds.size,
    modalities:[...modalities].sort(),
    hasWriting,
    hasSpeaking,
    averageRubric:round2(scores.reduce((sum,value)=>sum+value,0)/scores.length)
  };
}

export function buildExternalValidationEntry({packetText,submissionText}){
  const packet=JSON.parse(packetText);
  const submission=JSON.parse(submissionText);
  const summary=validateExternalReviewSubmission(submission,packet);
  const packetSha256=sha256Text(packetText);
  const submissionSha256=sha256Text(submissionText);
  const packetId="review-packet:"+packetSha256.slice(0,16);
  const id="external-review:"+submissionSha256.slice(0,16);
  return {
    id,
    reviewerLabel:submission.reviewerLabel.trim(),
    reviewerRole:submission.reviewerRole,
    externalToProject:true,
    reviewedAt:submission.reviewedAt,
    packetId,
    packetSha256,
    submissionSha256,
    artifactCount:summary.artifactCount,
    modalities:summary.modalities,
    verdict:submission.verdict,
    blockingIssues:[...submission.blockingIssues],
    averageRubric:summary.averageRubric,
    ...(typeof submission.notes==="string"&&submission.notes.trim()?{notes:submission.notes.trim()}:{})
  };
}

export function appendExternalValidation(manifest,entry){
  if(!manifest||manifest.schema!=="thiepn-japanese-p11-external-validation"||manifest.schemaVersion!==1||!Array.isArray(manifest.reviews))throw new Error("P11_EXTERNAL_VALIDATION_INVALID");
  const existing=manifest.reviews.find((review)=>review.id===entry.id);
  if(existing){
    if(JSON.stringify(existing)!==JSON.stringify(entry))throw new Error("P11_EXTERNAL_VALIDATION_REVIEW_CONFLICT:"+entry.id);
    return structuredClone(manifest);
  }
  return {...manifest,generatedAt:new Date().toISOString(),reviews:[...manifest.reviews,entry].sort((a,b)=>a.reviewedAt.localeCompare(b.reviewedAt)||a.id.localeCompare(b.id))};
}

export function submissionTemplate(packet){
  validateReviewPacket(packet);
  return {
    schema:"thiepn-japanese-p11-external-review-submission",
    schemaVersion:1,
    reviewerLabel:"",
    reviewerRole:"teacher",
    externalToProject:true,
    reviewedAt:new Date().toISOString(),
    verdict:"approve-with-notes",
    blockingIssues:[],
    notes:"",
    artifactReviews:packet.artifacts.map((artifact)=>({
      eventId:artifact.eventId,
      rubric:{taskFulfillment:0,meaningAccuracy:0,coherence:0,register:0},
      disposition:"accepted",
      ...(artifact.mode==="speaking"?{spokenModality:"spoken_production"}:{}),
      comment:""
    }))
  };
}

function parseArgs(args){
  const out={packet:null,submission:null,manifest:DEFAULT_MANIFEST,apply:false,template:null};
  for(let i=0;i<args.length;i+=1){
    const arg=args[i];
    if(arg==="--packet"){out.packet=args[++i];continue;}
    if(arg==="--submission"){out.submission=args[++i];continue;}
    if(arg==="--manifest"){out.manifest=args[++i];continue;}
    if(arg==="--apply"){out.apply=true;continue;}
    if(arg==="--template"){out.template=args[++i];continue;}
    throw new Error("UNKNOWN_ARGUMENT:"+arg);
  }
  return out;
}

export function runCli(args=process.argv.slice(2)){
  const options=parseArgs(args);
  if(!options.packet)throw new Error("P11_PACKET_PATH_REQUIRED");
  const packetPath=path.resolve(ROOT,options.packet);
  const packetText=fs.readFileSync(packetPath,"utf8");
  const packet=JSON.parse(packetText);
  validateReviewPacket(packet);

  if(options.template){
    const outPath=path.resolve(ROOT,options.template);
    fs.mkdirSync(path.dirname(outPath),{recursive:true});
    fs.writeFileSync(outPath,JSON.stringify(submissionTemplate(packet),null,2)+"\n");
    process.stdout.write("Wrote external-review template to "+path.relative(ROOT,outPath)+"\n");
    return {mode:"template",outPath};
  }

  if(!options.submission)throw new Error("P11_SUBMISSION_PATH_REQUIRED");
  const submissionText=fs.readFileSync(path.resolve(ROOT,options.submission),"utf8");
  const entry=buildExternalValidationEntry({packetText,submissionText});
  const manifestPath=path.resolve(ROOT,options.manifest);
  const manifest=readJson(manifestPath);
  const next=appendExternalValidation(manifest,entry);
  process.stdout.write("P11 EXTERNAL REVIEW VALID — "+entry.artifactCount+" artifact(s), "+entry.modalities.join(", ")+"\n");
  process.stdout.write("Packet SHA-256: "+entry.packetSha256+"\n");
  process.stdout.write("Submission SHA-256: "+entry.submissionSha256+"\n");
  if(options.apply){
    fs.writeFileSync(manifestPath,JSON.stringify(next,null,2)+"\n");
    process.stdout.write("Applied review to "+path.relative(ROOT,manifestPath)+"\n");
  }else{
    process.stdout.write(JSON.stringify(entry,null,2)+"\n");
    process.stdout.write("Preview only. Re-run with --apply after verifying reviewer identity and submission provenance.\n");
  }
  return {entry,manifest:next};
}

function requireString(value,label){if(typeof value!=="string"||!value.trim())throw new Error("P11_FIELD_REQUIRED:"+label);}
function round2(value){return Math.round(value*100)/100;}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))runCli();
