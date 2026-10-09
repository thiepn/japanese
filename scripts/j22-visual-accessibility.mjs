import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {PNG} from "pngjs";
import {auditVisualReview,visualCaseNames,BASELINE} from "./j16c-build-visual-review.mjs";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const HEX=/^[0-9a-f]{40}$/;
const PACKET_SCHEMA="thiepn-japanese-j22-visual-archive-packet";
const REVIEW_SCHEMA="thiepn-japanese-j22-independent-visual-review";
const KINDS=["reference","candidate","diff"];
const HUMAN_ACCESSIBILITY=["keyboard","reducedMotion","screenReaderTalkBack","textScale200Percent","physicalAndroid"];

export function digest(value){
  return crypto.createHash("sha256").update(value).digest("hex");
}
function exactSha(value){
  if(typeof value!=="string"||!HEX.test(value))throw new Error("J22_EXACT_SHA_REQUIRED");
}
function required(value,label){
  if(typeof value!=="string"||!value.trim())throw new Error("J22_FIELD_REQUIRED:"+label);
}
export function requiredImageNames(){
  return visualCaseNames().flatMap(name=>KINDS.map(kind=>name+"_"+kind+".png"));
}
export function createPendingEvidence(candidateCommit){
  exactSha(candidateCommit);
  return {
    schema:"thiepn-japanese-j22-acceptance",schemaVersion:1,candidateCommit,
    baselineCommit:BASELINE,expectedCases:visualCaseNames().length,
    requiredImageCount:requiredImageNames().length,
    automatedBrowserVerification:"covered-by-exact-head-ci",
    visualArchiveStatus:"pending-exact-head-j15d-d4-artifact",
    independentVisualReview:"pending",
    humanAccessibility:"pending",
    physicalAndroid:"pending",
    realOAuth:"pending",
    screenshotBaselineUpdated:false,
    releaseAuthorized:false,
    note:"Automated J22 workflow checks browser regressions and archive requirements only. It does not generate screenshots or grant human approval."
  };
}
/** Use images from the independent exact-SHA D4 workflow, never synthetic screenshots from CI. */
export function auditArchive({candidateCommit,report,readImage}){
  exactSha(candidateCommit);
  if(typeof readImage!=="function")throw new Error("J22_IMAGE_PROVIDER_REQUIRED");
  const imageMeta=[];
  const failures=[];
  const exists=name=>{
    try{
      const raw=readImage(name);
      if(!Buffer.isBuffer(raw)||raw.byteLength<=100||raw.byteLength>25_000_000)throw new Error("size");
      const decoded=PNG.sync.read(raw,{checkCRC:true});
      if(!decoded.width||!decoded.height||decoded.width>12000||decoded.height>12000)throw new Error("dimensions");
      imageMeta.push({name,sha256:digest(raw),bytes:raw.byteLength,width:decoded.width,height:decoded.height});
      return true;
    }catch{
      failures.push(name);
      return false;
    }
  };
  const audit=auditVisualReview({report,expectedCommit:candidateCommit,imageExists:exists});
  if(!audit.passed||failures.length||imageMeta.length!==126){
    throw new Error("J22_VISUAL_ARCHIVE_INVALID:"+audit.failures.join("|"));
  }
  const caseByName=new Map(report.cases.map(entry=>[entry.name,entry]));
  const body={
    schema:PACKET_SCHEMA,schemaVersion:1,
    candidateCommit,baselineCommit:BASELINE,
    cases:visualCaseNames().map(name=>({
      name,changedPixelRatio:caseByName.get(name).changedPixelRatio
    })),
    imageMeta:imageMeta.sort((a,b)=>a.name.localeCompare(b.name,"en")),
    provenance:"external-exact-SHA-J15D-D4-archive",
    reviewStatus:"pending-independent-human-review"
  };
  return {...body,packetSha256:digest(JSON.stringify(body))};
}
export function verifyPacket(packet){
  if(packet?.schema!==PACKET_SCHEMA||packet.schemaVersion!==1)throw new Error("J22_PACKET_SCHEMA_INVALID");
  exactSha(packet.candidateCommit);
  if(packet.baselineCommit!==BASELINE)throw new Error("J22_PACKET_BASELINE_INVALID");
  const {packetSha256,...body}=packet;
  if(packetSha256!==digest(JSON.stringify(body)))throw new Error("J22_PACKET_TAMPERED");
  const expected=visualCaseNames(),ids=packet.cases?.map(row=>row.name);
  if(!Array.isArray(ids)||ids.length!==42||new Set(ids).size!==42||
    expected.some(name=>!ids.includes(name))||packet.imageMeta?.length!==126){
    throw new Error("J22_PACKET_COVERAGE_INVALID");
  }
  const files=new Set(requiredImageNames());
  const actual=packet.imageMeta.map(image=>image.name);
  if(new Set(actual).size!==126||actual.some(name=>!files.has(name))||
    packet.imageMeta.some(image=>!/^[0-9a-f]{64}$/.test(image.sha256)||
      !Number.isInteger(image.bytes)||image.bytes<=100||
      !Number.isInteger(image.width)||image.width<1||
      !Number.isInteger(image.height)||image.height<1)){
    throw new Error("J22_PACKET_IMAGE_INVALID");
  }
}
export function blankReview(packet){
  verifyPacket(packet);
  return {
    schema:REVIEW_SCHEMA,schemaVersion:1,
    candidateCommit:packet.candidateCommit,packetSha256:packet.packetSha256,
    reviewer:{name:"",role:"",independentToProject:null,reviewedAt:null,evidenceRef:""},
    cases:packet.cases.map(entry=>({name:entry.name,status:"pending",observations:""})),
    accessibility:Object.fromEntries(HUMAN_ACCESSIBILITY.map(key=>[key,{
      status:"pending",evidenceRef:"",notes:""
    }])),
    defects:[],decision:"pending",
    notice:"Unsigned template only. No screenshot, accessibility, Android, identity or independent human approval is implied."
  };
}
/** Validate a returned packet's completeness, NOT a person's identity or independent signoff. */
export function validateReviewSubmission(packet,submission){
  verifyPacket(packet);
  if(submission?.schema!==REVIEW_SCHEMA||submission.schemaVersion!==1)throw new Error("J22_SUBMISSION_INVALID");
  if(submission.candidateCommit!==packet.candidateCommit||submission.packetSha256!==packet.packetSha256){
    throw new Error("J22_REVIEW_COMMIT_OR_PACKET_MISMATCH");
  }
  required(submission.reviewer?.name,"reviewer.name");
  if(submission.reviewer?.independentToProject!==true||
    !["visual-reviewer","accessibility-specialist","product-reviewer"].includes(submission.reviewer?.role)){
    throw new Error("J22_REVIEWER_DECLARATION_INVALID");
  }
  required(submission.reviewer.evidenceRef,"reviewer.evidenceRef");
  if(typeof submission.reviewer.reviewedAt!=="string"||!Number.isFinite(Date.parse(submission.reviewer.reviewedAt))){
    throw new Error("J22_REVIEW_DATE_INVALID");
  }
  if(!Array.isArray(submission.cases)||submission.cases.length!==42)throw new Error("J22_REVIEW_COVERAGE_REQUIRED");
  const expected=new Set(packet.cases.map(row=>row.name)),seen=new Set();
  let defects=0;
  for(const c of submission.cases){
    if(!expected.has(c?.name)||seen.has(c.name))throw new Error("J22_REVIEW_CASE_INVALID");
    seen.add(c.name);
    if(!["pass","defect"].includes(c.status))throw new Error("J22_CASE_STATUS_INVALID:"+c.name);
    if(c.status==="defect"){defects+=1;required(c.observations,"defect observation");}
  }
  if(!submission.accessibility||Object.keys(submission.accessibility).length!==HUMAN_ACCESSIBILITY.length){
    throw new Error("J22_ACCESSIBILITY_EVIDENCE_REQUIRED");
  }
  for(const key of HUMAN_ACCESSIBILITY){
    const item=submission.accessibility[key];
    if(!item||!["pass","defect"].includes(item.status))throw new Error("J22_ACCESSIBILITY_STATUS_INVALID:"+key);
    required(item.evidenceRef,"accessibility evidence "+key);
    if(item.status==="defect"){defects+=1;required(item.notes,"accessibility notes "+key);}
  }
  if(!["reviewed-no-defects","reviewed-with-defects"].includes(submission.decision)){
    throw new Error("J22_REVIEW_DECISION_INVALID");
  }
  if((submission.decision==="reviewed-no-defects")!==(defects===0)){
    throw new Error("J22_REVIEW_DECISION_CONFLICT");
  }
  return {
    schema:"thiepn-japanese-j22-structural-review-receipt",
    candidateCommit:packet.candidateCommit,packetSha256:packet.packetSha256,
    submissionSha256:digest(JSON.stringify(submission)),reviewedCases:seen.size,defects,
    structureValidated:true,independentReviewerVerified:false,
    humanVisualApproved:false,humanAccessibilityApproved:false,
    physicalAndroidApproved:false,releaseAuthorized:false,
    state:"awaiting-independent-human-identity-and-evidence-verification"
  };
}
function readJson(filename){return JSON.parse(fs.readFileSync(path.resolve(ROOT,filename),"utf8"));}
function write(name,data){
  const file=path.resolve(ROOT,"artifacts",name);
  fs.mkdirSync(path.dirname(file),{recursive:true});
  fs.writeFileSync(file,JSON.stringify(data,null,2)+"\n");
}
export function runCli(args=process.argv.slice(2)){
  if(args[0]==="--verify-submission"){
    if(args.length!==3)throw new Error("J22_VERIFY_USAGE");
    const packet=readJson(args[1]),submission=readJson(args[2]);
    const receipt=validateReviewSubmission(packet,submission);
    process.stdout.write(JSON.stringify(receipt,null,2)+"\n");
    return receipt;
  }
  const candidateCommit=process.env.J22_CANDIDATE_SHA;
  const record=createPendingEvidence(candidateCommit);
  if(args.length===0){
    write("j22-automated-acceptance.json",record);
    console.log("J22 automated acceptance boundary recorded; 42-case archive and human review pending");
    return record;
  }
  if(args.length!==4||args[0]!=="--archive"||args[2]!=="--images"){
    throw new Error("J22_ARCHIVE_USAGE:--archive <report.json> --images <dir>");
  }
  const imageDir=path.resolve(ROOT,args[3]);
  const packet=auditArchive({
    candidateCommit,report:readJson(args[1]),
    readImage:name=>fs.readFileSync(path.join(imageDir,name))
  });
  record.visualArchiveStatus="exact-SHA-42-case-PNG-integrity-passed";
  write("j22-automated-acceptance.json",record);
  write("j22-visual-review-packet.json",packet);
  write("j22-reviewer-blank.json",blankReview(packet));
  console.log("J22 archive integrity verified; independent visual/TalkBack/Android review still pending");
  return record;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))runCli();
