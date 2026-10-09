import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const COLLECTIONS=["grammar","lexemes","sentences","canDos","courseUnits"];
const SEEDS=[
  "content/seed/jp-core.json",
  "content/seed/jp-c1-lexicon.json",
  "content/seed/jp-c1-language.json",
  "content/seed/jp-c1-course.json",
];
const PACKET_SCHEMA="thiepn-japanese-j21-language-review-packet";
const SUBMISSION_SCHEMA="thiepn-japanese-j21-language-review-submission";
const REVIEW_DIMENSIONS=["accuracy","naturalness","register","pedagogy"];

export function sha256(input){
  return crypto.createHash("sha256").update(input,"utf8").digest("hex");
}
function required(value,label){
  if(typeof value!=="string"||!value.trim())throw new Error("J21_REQUIRED:"+label);
}
function assertSha(sha){
  if(typeof sha!=="string"||!/^[0-9a-f]{40}$/.test(sha))throw new Error("J21_EXACT_SHA_REQUIRED");
}
function publicSource(sourceId,sources,declared,where){
  const source=sources.get(sourceId);
  if(!source)throw new Error("J21_UNKNOWN_SOURCE:"+where+":"+sourceId);
  if(source.publicExport!==true||typeof source.license!=="string"||!source.license.trim()){
    throw new Error("J21_NONEXPORTABLE_SOURCE:"+where+":"+sourceId);
  }
  if(!declared.has(sourceId))throw new Error("J21_SOURCE_NOT_IN_MANIFEST:"+where+":"+sourceId);
  return source;
}
function displayOf(kind,item){
  if(kind==="grammar")return {japanese:item.label??"",context:item.practice?.prompt??"",english:item.summary??""};
  if(kind==="lexemes")return {japanese:item.canonicalForm??"",context:item.readings?.[0]?.text??"",english:""};
  if(kind==="sentences")return {japanese:item.text??item.japanese??"",context:"",english:item.translation??""};
  if(kind==="canDos")return {japanese:"",context:"",english:item.statement??""};
  return {japanese:"",context:"",english:item.title??item.name??""};
}
function cleanText(value){
  return typeof value==="string"?value.slice(0,400):"";
}

/** Data-structure and licensing audit; does NOT pronounce any Japanese wording correct. */
export function auditAndBuildPacket({registry,manifest,seeds,candidateCommit}){
  assertSha(candidateCommit);
  if(!Array.isArray(registry?.sources)||!Array.isArray(manifest?.sources)||!Array.isArray(seeds)||!seeds.length){
    throw new Error("J21_CONTENT_INPUT_INVALID");
  }
  const sources=new Map();
  for(const source of registry.sources){
    required(source?.id,"registry.source.id");
    if(sources.has(source.id))throw new Error("J21_DUPLICATE_SOURCE:"+source.id);
    sources.set(source.id,source);
  }
  const declared=new Set(manifest.sources);
  for(const sourceId of declared)publicSource(sourceId,sources,declared,"manifest");
  const seen=new Map(COLLECTIONS.map(kind=>[kind,new Set()]));
  const records=[];
  const counts=Object.fromEntries(COLLECTIONS.map(kind=>[kind,0]));
  const seedDigests=[];
  for(const {filename,data,raw} of seeds){
    required(filename,"seed filename");
    if(!data||typeof data!=="object")throw new Error("J21_SEED_INVALID:"+filename);
    seedDigests.push({filename,sha256:sha256(raw)});
    for(const sourceId of data.sourceIds??[])publicSource(sourceId,sources,declared,filename);
    for(const kind of COLLECTIONS){
      const entries=data[kind]??[];
      if(!Array.isArray(entries))throw new Error("J21_COLLECTION_INVALID:"+filename+":"+kind);
      for(const item of entries){
        required(item?.id,kind+".id");
        const key=kind+"/"+item.id;
        if(seen.get(kind).has(item.id))throw new Error("J21_DUPLICATE_CONTENT_ID:"+key);
        seen.get(kind).add(item.id);
        if(!Array.isArray(item.sourceIds)||item.sourceIds.length===0){
          throw new Error("J21_MISSING_PROVENANCE:"+key);
        }
        const sourceInfo=item.sourceIds.map(sourceId=>publicSource(sourceId,sources,declared,key));
        const display=displayOf(kind,item);
        if(Object.values(display).some(value=>typeof value==="string"&&(/[\uFFFD\u0000]/u).test(value))){
          throw new Error("J21_CORRUPTED_LANGUAGE_TEXT:"+key);
        }
        counts[kind]+=1;
        records.push({
          key,kind,id:item.id,sourceFile:filename,
          sourceIds:[...item.sourceIds],
          sourceLicenses:sourceInfo.map(source=>source.license),
          japanese:cleanText(display.japanese),
          context:cleanText(display.context),
          english:cleanText(display.english),
          level:typeof item.level==="string"?item.level:null,
          humanQuestions:["Japanese accuracy","naturalness","register","learner-level appropriateness"],
        });
      }
    }
  }
  if(!records.some(record=>record.kind==="grammar")||!records.some(record=>record.kind==="lexemes")){
    throw new Error("J21_REQUIRED_REVIEW_DOMAINS_ABSENT");
  }
  // Stable, bounded review sample from actual exported seed records, not generated reviews.
  const selected=COLLECTIONS.flatMap(kind=>records.filter(row=>row.kind===kind)
    .sort((a,b)=>a.id.localeCompare(b.id,"en")).slice(0,8));
  const body={
    schema:PACKET_SCHEMA,schemaVersion:1,candidateCommit,
    contentSeedDigests:seedDigests.sort((a,b)=>a.filename.localeCompare(b.filename,"en")),
    reviewStatus:"pending-independent-japanese-review",
    items:selected
  };
  const packet={...body,packetSha256:sha256(JSON.stringify(body))};
  const report={
    schema:"thiepn-japanese-j21-content-audit",schemaVersion:1,candidateCommit,
    integrityStatus:"passed",semanticJapaneseReview:"pending",
    counts,sourceFileCount:seeds.length,reviewPacketItemCount:selected.length,
    externalHumanReview:"not_obtained",releaseAuthorized:false,
    limitations:["Structure and public licensing only; grammar, meanings, levels, pronunciation and naturalness need independent fluent review."]
  };
  return {packet,report};
}

export function verifyPacket(packet){
  if(packet?.schema!==PACKET_SCHEMA||packet.schemaVersion!==1||!Array.isArray(packet.items))throw new Error("J21_PACKET_INVALID");
  assertSha(packet.candidateCommit);
  const {packetSha256,...body}=packet;
  if(typeof packetSha256!=="string"||packetSha256!==sha256(JSON.stringify(body)))throw new Error("J21_PACKET_DIGEST_MISMATCH");
  const ids=packet.items.map(item=>item.key);
  if(new Set(ids).size!==ids.length||ids.length===0)throw new Error("J21_PACKET_KEYS_INVALID");
}

export function blankReviewerTemplate(packet){
  verifyPacket(packet);
  return {
    schema:SUBMISSION_SCHEMA,schemaVersion:1,
    candidateCommit:packet.candidateCommit,packetSha256:packet.packetSha256,
    reviewer:{label:"",role:null,externalToProject:null,reviewedAt:null,independentEvidenceRef:""},
    itemReviews:packet.items.map(item=>({
      key:item.key,verdict:"pending",scores:{accuracy:null,naturalness:null,register:null,pedagogy:null},notes:""
    })),
    decision:"pending",blockingIssues:[],
    notice:"BLANK TEMPLATE ONLY. Human identity, independence and correctness are not verified by automated intake."
  };
}

/** Structural intake ONLY. Never promotes an independent review or release. */
export function validateReviewerSubmission(packet,submission){
  verifyPacket(packet);
  if(submission?.schema!==SUBMISSION_SCHEMA||submission.schemaVersion!==1){
    throw new Error("J21_SUBMISSION_SCHEMA_INVALID");
  }
  if(submission.packetSha256!==packet.packetSha256||submission.candidateCommit!==packet.candidateCommit){
    throw new Error("J21_SUBMISSION_PACKET_MISMATCH");
  }
  required(submission.reviewer?.label,"reviewer.label");
  if(!["teacher","tutor","language-professional"].includes(submission.reviewer?.role)||submission.reviewer?.externalToProject!==true){
    throw new Error("J21_REVIEWER_DECLARATION_INVALID");
  }
  required(submission.reviewer?.independentEvidenceRef,"reviewer.independentEvidenceRef");
  if(typeof submission.reviewer.reviewedAt!=="string"||!Number.isFinite(Date.parse(submission.reviewer.reviewedAt))){
    throw new Error("J21_REVIEW_DATE_INVALID");
  }
  if(!["approve","revise","block"].includes(submission.decision)||!Array.isArray(submission.blockingIssues)){
    throw new Error("J21_SUBMISSION_DECISION_INVALID");
  }
  if(!Array.isArray(submission.itemReviews)||submission.itemReviews.length!==packet.items.length){
    throw new Error("J21_REVIEW_COMPLETENESS_REQUIRED");
  }
  const expected=new Set(packet.items.map(item=>item.key));
  const seen=new Set();
  let concerns=0;
  for(const review of submission.itemReviews){
    if(!expected.has(review?.key)||seen.has(review.key))throw new Error("J21_REVIEW_ITEM_NOT_IN_PACKET");
    seen.add(review.key);
    if(!["accepted","needs-correction","block"].includes(review.verdict))throw new Error("J21_REVIEW_VERDICT_INVALID:"+review.key);
    for(const dimension of REVIEW_DIMENSIONS){
      const score=review.scores?.[dimension];
      if(!Number.isInteger(score)||score<0||score>4)throw new Error("J21_REVIEW_SCORE_INVALID:"+review.key+":"+dimension);
    }
    if(review.verdict!=="accepted"){
      concerns+=1;required(review.notes,review.key+".notes");
    }
  }
  if(submission.decision==="approve"&&(concerns!==0||submission.blockingIssues.length)){
    throw new Error("J21_INCONSISTENT_APPROVAL");
  }
  if(submission.decision==="block"&&concerns===0&&submission.blockingIssues.length===0){
    throw new Error("J21_BLOCK_REASONS_REQUIRED");
  }
  for(const issue of submission.blockingIssues)required(issue,"blocking issue");
  return {
    schema:"thiepn-japanese-j21-review-structural-receipt",
    packetSha256:packet.packetSha256,submissionSha256:sha256(JSON.stringify(submission)),
    candidateCommit:packet.candidateCommit,reviewedItems:seen.size,concerns,
    structuralValidation:"passed",reviewerIdentityVerified:false,
    independentReviewAdmitted:false,releaseAuthorized:false,
    status:"awaiting-independent-human-provenance-verification"
  };
}
function readJson(relative){
  const abs=path.resolve(ROOT,relative);
  return JSON.parse(fs.readFileSync(abs,"utf8"));
}
function writeArtifact(filename,value){
  const target=path.join(ROOT,"artifacts",filename);
  fs.mkdirSync(path.dirname(target),{recursive:true});
  fs.writeFileSync(target,JSON.stringify(value,null,2)+"\n");
}
export function runCli(args=process.argv.slice(2)){
  if(args[0]==="--verify-submission"){
    if(args.length!==3)throw new Error("J21_VERIFY_USAGE:--verify-submission <packet.json> <submission.json>");
    const [packetFile,submissionFile]=args.slice(1).map(p=>path.resolve(ROOT,p));
    if(fs.statSync(packetFile).size>2_000_000||fs.statSync(submissionFile).size>2_000_000){
      throw new Error("J21_REVIEW_INPUT_TOO_LARGE");
    }
    const receipt=validateReviewerSubmission(
      JSON.parse(fs.readFileSync(packetFile,"utf8")),
      JSON.parse(fs.readFileSync(submissionFile,"utf8"))
    );
    process.stdout.write(JSON.stringify(receipt,null,2)+"\n");
    return receipt;
  }
  if(args.length!==0)throw new Error("J21_ARGUMENT_INVALID");
  const candidateCommit=process.env.J21_CANDIDATE_SHA;
  const registry=readJson("content/sources/registry.json");
  const manifest=readJson("content/manifests/jp-core.json");
  const seeds=SEEDS.map(filename=>({
    filename,raw:fs.readFileSync(path.resolve(ROOT,filename),"utf8"),
    data:readJson(filename),
  }));
  const {packet,report}=auditAndBuildPacket({registry,manifest,seeds,candidateCommit});
  writeArtifact("j21-content-audit.json",report);
  writeArtifact("j21-language-review-packet.json",packet);
  writeArtifact("j21-reviewer-submission-blank.json",blankReviewerTemplate(packet));
  process.stdout.write("J21 content provenance audited at "+candidateCommit+"; independent Japanese review PENDING\n");
  return report;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))runCli();
