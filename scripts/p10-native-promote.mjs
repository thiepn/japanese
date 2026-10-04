import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const DEFAULT_CANDIDATES="release/p10-native-candidates.json";
const DEFAULT_INVENTORY="release/p9-native-inventory.json";

export function readJson(filePath){return JSON.parse(fs.readFileSync(filePath,"utf8"));}

export function validateCandidateManifest(manifest){
  if(!manifest||typeof manifest!=="object")throw new Error("P10_NATIVE_CANDIDATES_INVALID");
  if(manifest.schema!=="thiepn-japanese-p10-native-candidates")throw new Error("P10_NATIVE_CANDIDATES_SCHEMA_INVALID");
  if(manifest.schemaVersion!==1)throw new Error("P10_NATIVE_CANDIDATES_VERSION_UNSUPPORTED");
  if(!Array.isArray(manifest.documents))throw new Error("P10_NATIVE_CANDIDATES_DOCUMENTS_REQUIRED");

  const documentIds=new Set(),recordingIds=new Set();
  for(const [documentIndex,document] of manifest.documents.entries()){
    const where="document "+(documentIndex+1);
    requireString(document?.id,where+" id");
    requireString(document?.title,where+" title");
    requireString(document?.text,where+" text");
    requireHttpUrl(document?.sourceUrl,where+" sourceUrl");
    if(documentIds.has(document.id))throw new Error("P10_NATIVE_CANDIDATE_DUPLICATE_DOCUMENT:"+document.id);
    documentIds.add(document.id);
    if(!Array.isArray(document.recordings)||document.recordings.length===0)throw new Error("P10_NATIVE_CANDIDATE_RECORDINGS_REQUIRED:"+document.id);

    for(const [recordingIndex,recording] of document.recordings.entries()){
      const audioWhere=document.id+" recording "+(recordingIndex+1);
      requireString(recording?.id,audioWhere+" id");
      requireHttpUrl(recording?.url,audioWhere+" url");
      requireString(recording?.credit,audioWhere+" credit");
      requireString(recording?.licenseName,audioWhere+" licenseName");
      requireString(recording?.speakerLabel,audioWhere+" speakerLabel");
      if(recording.nativeSpeaker!==true)throw new Error("P10_NATIVE_SPEAKER_VERIFICATION_REQUIRED:"+recording.id);
      if(!["slow","natural","fast"].includes(recording.speechRate))throw new Error("P10_NATIVE_SPEECH_RATE_REQUIRED:"+recording.id);
      if(!["casual","neutral","polite","formal"].includes(recording.register))throw new Error("P10_NATIVE_REGISTER_REQUIRED:"+recording.id);
      if(!allowedReusableLicense(recording.licenseName))throw new Error("P10_NATIVE_AUDIO_LICENSE_NOT_ADMITTED:"+recording.id);
      if(requiresAttribution(recording.licenseName))requireHttpUrl(recording?.attributionUrl,audioWhere+" attributionUrl");
      if(recordingIds.has(recording.id))throw new Error("P10_NATIVE_CANDIDATE_DUPLICATE_RECORDING:"+recording.id);
      recordingIds.add(recording.id);
      validateVerification(recording.verification,recording.id);
    }
  }
  return {documents:documentIds.size,recordings:recordingIds.size};
}

export function promoteCandidateManifest(candidateManifest,currentInventory){
  validateCandidateManifest(candidateManifest);
  validateInventoryShape(currentInventory);
  const documents=new Map(currentInventory.documents.map((document)=>[document.id,structuredClone(document)]));
  for(const candidate of candidateManifest.documents){
    const promoted={
      id:candidate.id,
      title:candidate.title,
      sourceUrl:candidate.sourceUrl,
      ...(candidate.sourceLabel?{sourceLabel:candidate.sourceLabel}:{}),
      recordings:candidate.recordings.map((recording)=>({
        id:recording.id,
        url:recording.url,
        credit:recording.credit,
        licenseName:recording.licenseName,
        ...(recording.attributionUrl?{attributionUrl:recording.attributionUrl}:{}),
        nativeSpeaker:true,
        speechRate:recording.speechRate,
        register:recording.register,
        speakerLabel:recording.speakerLabel,
        verification:{
          reviewerLabel:recording.verification.reviewerLabel,
          reviewedAt:recording.verification.reviewedAt,
          checklist:{...recording.verification.checklist},
          ...(recording.verification.notes?{notes:recording.verification.notes}:{})
        }
      }))
    };
    const existing=documents.get(candidate.id);
    if(!existing){documents.set(candidate.id,promoted);continue;}
    if(existing.sourceUrl!==candidate.sourceUrl)throw new Error("P10_PROMOTION_DOCUMENT_SOURCE_CONFLICT:"+candidate.id);
    const byRecording=new Map((existing.recordings??[]).map((recording)=>[recording.id,recording]));
    for(const recording of promoted.recordings){
      const old=byRecording.get(recording.id);
      if(old&&JSON.stringify(old)!==JSON.stringify(recording))throw new Error("P10_PROMOTION_RECORDING_CONFLICT:"+recording.id);
      byRecording.set(recording.id,recording);
    }
    documents.set(candidate.id,{...existing,...promoted,recordings:[...byRecording.values()]});
  }
  return {
    schema:"thiepn-japanese-p9-native-inventory",
    schemaVersion:1,
    updatedAt:new Date().toISOString().slice(0,10),
    documents:[...documents.values()].sort((a,b)=>String(a.id).localeCompare(String(b.id)))
  };
}

export function promotionSummary(before,after){
  const beforeRecordings=(before.documents??[]).reduce((sum,document)=>sum+(document.recordings?.length??0),0);
  const afterRecordings=(after.documents??[]).reduce((sum,document)=>sum+(document.recordings?.length??0),0);
  return {
    documentsBefore:before.documents?.length??0,
    documentsAfter:after.documents?.length??0,
    recordingsBefore:beforeRecordings,
    recordingsAfter:afterRecordings,
    documentsAdded:(after.documents?.length??0)-(before.documents?.length??0),
    recordingsAdded:afterRecordings-beforeRecordings
  };
}

function parseArgs(args){
  const out={candidates:DEFAULT_CANDIDATES,inventory:DEFAULT_INVENTORY,apply:false,out:"artifacts/p10-native-promotion-preview.json"};
  for(let i=0;i<args.length;i+=1){
    const arg=args[i];
    if(arg==="--apply"){out.apply=true;continue;}
    if(arg==="--candidates"){out.candidates=args[++i];continue;}
    if(arg==="--inventory"){out.inventory=args[++i];continue;}
    if(arg==="--out"){out.out=args[++i];continue;}
    throw new Error("UNKNOWN_ARGUMENT:"+arg);
  }
  return out;
}

export function runCli(args=process.argv.slice(2)){
  const options=parseArgs(args);
  const candidatePath=path.resolve(ROOT,options.candidates);
  const inventoryPath=path.resolve(ROOT,options.inventory);
  const outPath=path.resolve(ROOT,options.out);
  const candidates=readJson(candidatePath);
  const inventory=readJson(inventoryPath);
  const promoted=promoteCandidateManifest(candidates,inventory);
  const summary=promotionSummary(inventory,promoted);

  fs.mkdirSync(path.dirname(outPath),{recursive:true});
  fs.writeFileSync(outPath,JSON.stringify(promoted,null,2)+"\n");
  process.stdout.write("P10 NATIVE PROMOTION PREVIEW — "+summary.documentsAdded+" document(s), "+summary.recordingsAdded+" recording(s) added\n");

  if(options.apply){
    fs.writeFileSync(inventoryPath,JSON.stringify(promoted,null,2)+"\n");
    process.stdout.write("Applied verified candidates to "+path.relative(ROOT,inventoryPath)+"\n");
  }else{
    process.stdout.write("Preview only. Re-run with --apply after reviewing the generated inventory diff.\n");
  }
  return {summary,promoted};
}

function validateVerification(value,recordingId){
  if(!value||typeof value!=="object")throw new Error("P10_MEDIA_VERIFICATION_REQUIRED:"+recordingId);
  requireString(value.reviewerLabel,"verification reviewerLabel");
  if(!Number.isFinite(Date.parse(value.reviewedAt)))throw new Error("P10_MEDIA_VERIFICATION_DATE_INVALID:"+recordingId);
  const checklist=value.checklist;
  if(!checklist||typeof checklist!=="object")throw new Error("P10_MEDIA_VERIFICATION_CHECKLIST_REQUIRED:"+recordingId);
  const required=["sourceReachable","licenseVerified","nativeSpeakerVerified","transcriptMatchVerified","registerReviewed","speechRateReviewed"];
  for(const key of required)if(checklist[key]!==true)throw new Error("P10_MEDIA_VERIFICATION_INCOMPLETE:"+recordingId+":"+key);
}
function validateInventoryShape(value){
  if(!value||typeof value!=="object"||value.schema!=="thiepn-japanese-p9-native-inventory"||value.schemaVersion!==1||!Array.isArray(value.documents))throw new Error("P9_NATIVE_INVENTORY_INVALID");
}
function requireString(value,label){if(typeof value!=="string"||!value.trim())throw new Error("P10_FIELD_REQUIRED:"+label);}
function requireHttpUrl(value,label){
  requireString(value,label);
  let url;try{url=new URL(value);}catch{throw new Error("P10_URL_INVALID:"+label);}
  if(!["http:","https:"].includes(url.protocol))throw new Error("P10_URL_INVALID:"+label);
}
function allowedReusableLicense(value){
  const normalized=String(value).toLowerCase().replace(/[_-]+/g," ").replace(/\s+/g," ").trim();
  if(!normalized)return false;
  if(/\bnc\b/.test(normalized)||normalized.includes("noncommercial")||/\bnd\b/.test(normalized)||normalized.includes("no derivatives"))return false;
  return normalized.includes("cc0")||normalized.includes("public domain")||normalized.includes("cc by")||normalized.includes("creative commons attribution");
}
function requiresAttribution(value){
  const normalized=String(value).toLowerCase();
  return !(normalized.includes("cc0")||normalized.includes("public domain"));
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))runCli();
