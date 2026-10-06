import type { StudyEvent } from "@thiepn/domain";
import { listStudyEvents,saveStudyEvent } from "@thiepn/local-db";
import { productiveTasks } from "../coreContent";
import { DEVELOPMENT_ACCOUNT_ID } from "./runtime";

const DEVICE_ID="p10-human-review";
export const P11_EXTERNAL_REVIEW_ARTIFACT_MIN=6;

export type HumanReviewScore=0|1|2|3|4;
export interface HumanReviewRubric {
  taskFulfillment:HumanReviewScore;
  meaningAccuracy:HumanReviewScore;
  coherence:HumanReviewScore;
  register:HumanReviewScore;
}
export interface HumanReviewRecord {
  eventId:string;
  sourceEventId:string;
  taskId:string;
  reviewerLabel:string;
  reviewedAt:string;
  rubric:HumanReviewRubric;
  overall:number;
  comment:string;
  strengths:string;
  nextPriority:string;
}
export interface HumanReviewArtifact {
  eventId:string;
  occurredAt:string;
  taskId:string;
  title:string;
  mode:"writing"|"speaking";
  response:string;
  structurallyCorrect:boolean;
  reviewed:boolean;
  latestReview?:HumanReviewRecord;
}
export interface HumanReviewSummary {
  reviewedArtifacts:number;
  unreviewedArtifacts:number;
  averageOverall:number;
  averageTaskFulfillment:number;
  averageMeaningAccuracy:number;
  averageCoherence:number;
  averageRegister:number;
  recentReviews:HumanReviewRecord[];
}
export interface ExternalReviewReadiness {
  ready:boolean;
  totalArtifacts:number;
  writingArtifacts:number;
  speakingArtifacts:number;
  uniqueTasks:number;
  selectedArtifacts:number;
  selectedWriting:number;
  selectedSpeaking:number;
  balanced:boolean;
  blockers:string[];
}
export interface P11ExternalReviewSubmissionTemplate {
  schema:"thiepn-japanese-p11-external-review-submission";
  schemaVersion:1;
  packetSha256?:string;
  reviewerLabel:string;
  reviewerRole:"teacher"|"tutor"|"language-professional";
  externalToProject:true;
  reviewedAt:string;
  verdict:"approve"|"approve-with-notes"|"block";
  blockingIssues:string[];
  notes:string;
  artifactReviews:Array<{
    eventId:string;
    rubric:HumanReviewRubric;
    disposition:"accepted"|"concern";
    spokenModality?:"spoken_interaction"|"spoken_production";
    comment:string;
  }>;
}

export interface HumanReviewPacketV1 {
  schema:"thiepn-japanese-human-review-packet";
  schemaVersion:1;
  generatedAt:string;
  evidenceBoundary:{
    reviewDoesNotChangeMastery:true;
    reviewerScoreIsNotCefrCertification:true;
  };
  artifacts:Array<Pick<HumanReviewArtifact,"eventId"|"occurredAt"|"taskId"|"title"|"mode"|"response"|"structurallyCorrect">>;
  rubricScale:{
    min:0;
    max:4;
    dimensions:["taskFulfillment","meaningAccuracy","coherence","register"];
  };
}

export async function listHumanReviewArtifacts():Promise<HumanReviewArtifact[]>{
  return buildHumanReviewArtifacts(await listStudyEvents(DEVELOPMENT_ACCOUNT_ID));
}

export function buildHumanReviewArtifacts(events:readonly StudyEvent[]):HumanReviewArtifact[]{
  const taskById=new Map(productiveTasks.filter((task)=>task.level==="B2").map((task)=>[task.id,task] as const));
  const reviews=extractHumanReviews(events);
  const latestBySource=new Map<string,HumanReviewRecord>();
  for(const review of reviews.sort((a,b)=>a.reviewedAt.localeCompare(b.reviewedAt)))latestBySource.set(review.sourceEventId,review);

  const artifacts:HumanReviewArtifact[]=[];
  for(const event of events){
    if(event.primaryTarget?.kind!=="production_task")continue;
    const task=taskById.get(event.primaryTarget.id);
    if(!task)continue;
    if(String(event.promptFamily??"").startsWith("p10-human-review"))continue;
    const response=typeof event.metadata?.learnerResponse==="string"?event.metadata.learnerResponse:
      typeof event.metadata?.learnerText==="string"?event.metadata.learnerText:"";
    if(!response.trim())continue;
    const latestReview=latestBySource.get(event.id);
    artifacts.push({
      eventId:event.id,occurredAt:event.occurredAt,taskId:task.id,title:task.title,mode:task.mode,response,
      structurallyCorrect:event.result==="correct",reviewed:Boolean(latestReview),...(latestReview?{latestReview}:{})
    });
  }
  return artifacts.sort((a,b)=>b.occurredAt.localeCompare(a.occurredAt));
}

export async function saveHumanReview(input:{
  artifact:HumanReviewArtifact;
  reviewerLabel:string;
  rubric:HumanReviewRubric;
  comment:string;
  strengths:string;
  nextPriority:string;
}):Promise<HumanReviewRecord>{
  validateRubric(input.rubric);
  const reviewerLabel=input.reviewerLabel.trim();
  if(!reviewerLabel)throw new Error("HUMAN_REVIEWER_REQUIRED");
  const overall=round2(mean(Object.values(input.rubric)));
  const reviewedAt=new Date().toISOString();
  const eventId=crypto.randomUUID();
  const record:HumanReviewRecord={
    eventId,sourceEventId:input.artifact.eventId,taskId:input.artifact.taskId,reviewerLabel,reviewedAt,
    rubric:{...input.rubric},overall,
    comment:input.comment.trim(),strengths:input.strengths.trim(),nextPriority:input.nextPriority.trim()
  };
  await saveStudyEvent({
    id:eventId,userId:DEVELOPMENT_ACCOUNT_ID,deviceId:DEVICE_ID,occurredAt:reviewedAt,
    activity:"assessment",primaryTarget:{kind:"production_task",id:input.artifact.taskId},
    skillDimension:input.artifact.mode==="writing"?"writing_quality":"production",
    promptFamily:"p10-human-review",responseMode:"human_rubric",result:"skipped",
    metadata:{
      humanReview:true,
      reviewOfEventId:input.artifact.eventId,
      reviewerLabel,
      rubric:{...input.rubric},
      overall,
      comment:record.comment,
      strengths:record.strengths,
      nextPriority:record.nextPriority,
      humanReviewAppliedToMastery:false,
      accreditedCefrVerdict:false
    }
  });
  return record;
}

export async function getHumanReviewSummary():Promise<HumanReviewSummary>{
  const events=await listStudyEvents(DEVELOPMENT_ACCOUNT_ID);
  const artifacts=buildHumanReviewArtifacts(events);
  const reviews=extractHumanReviews(events);
  return buildHumanReviewSummary(artifacts,reviews);
}

export function buildHumanReviewSummary(artifacts:readonly HumanReviewArtifact[],reviews:readonly HumanReviewRecord[]):HumanReviewSummary{
  const latestBySource=new Map<string,HumanReviewRecord>();
  for(const review of [...reviews].sort((a,b)=>a.reviewedAt.localeCompare(b.reviewedAt)))latestBySource.set(review.sourceEventId,review);
  const latest=[...latestBySource.values()];
  return {
    reviewedArtifacts:artifacts.filter((artifact)=>artifact.reviewed).length,
    unreviewedArtifacts:artifacts.filter((artifact)=>!artifact.reviewed).length,
    averageOverall:average(latest.map((review)=>review.overall)),
    averageTaskFulfillment:average(latest.map((review)=>review.rubric.taskFulfillment)),
    averageMeaningAccuracy:average(latest.map((review)=>review.rubric.meaningAccuracy)),
    averageCoherence:average(latest.map((review)=>review.rubric.coherence)),
    averageRegister:average(latest.map((review)=>review.rubric.register)),
    recentReviews:latest.sort((a,b)=>b.reviewedAt.localeCompare(a.reviewedAt)).slice(0,12)
  };
}

export function selectExternalReviewArtifacts(artifacts:readonly HumanReviewArtifact[],limit=P11_EXTERNAL_REVIEW_ARTIFACT_MIN):HumanReviewArtifact[]{
  const usable=[...artifacts].filter((artifact)=>artifact.response.trim()).sort((a,b)=>b.occurredAt.localeCompare(a.occurredAt)||a.eventId.localeCompare(b.eventId));
  const writing=prioritizeDistinctTasks(usable.filter((artifact)=>artifact.mode==="writing"));
  const speaking=prioritizeDistinctTasks(usable.filter((artifact)=>artifact.mode==="speaking"));
  const selected:HumanReviewArtifact[]=[];
  let wi=0,si=0;
  while(selected.length<limit&&(wi<writing.length||si<speaking.length)){
    const writingCount=selected.filter((artifact)=>artifact.mode==="writing").length;
    const speakingCount=selected.length-writingCount;
    const preferWriting=writingCount<=speakingCount;
    if(preferWriting&&wi<writing.length)selected.push(writing[wi++]!);
    else if(!preferWriting&&si<speaking.length)selected.push(speaking[si++]!);
    else if(wi<writing.length)selected.push(writing[wi++]!);
    else if(si<speaking.length)selected.push(speaking[si++]!);
  }
  return selected;
}

export function getExternalReviewReadiness(artifacts:readonly HumanReviewArtifact[]):ExternalReviewReadiness{
  const usable=artifacts.filter((artifact)=>artifact.response.trim());
  const writingArtifacts=usable.filter((artifact)=>artifact.mode==="writing").length;
  const speakingArtifacts=usable.filter((artifact)=>artifact.mode==="speaking").length;
  const selected=selectExternalReviewArtifacts(usable);
  const selectedWriting=selected.filter((artifact)=>artifact.mode==="writing").length;
  const selectedSpeaking=selected.length-selectedWriting;
  const blockers:string[]=[];
  if(usable.length<P11_EXTERNAL_REVIEW_ARTIFACT_MIN)blockers.push("Need at least "+P11_EXTERNAL_REVIEW_ARTIFACT_MIN+" B2 productive artifacts.");
  if(writingArtifacts<1)blockers.push("Need at least one writing artifact.");
  if(speakingArtifacts<1)blockers.push("Need at least one speaking artifact.");
  return {
    ready:blockers.length===0,
    totalArtifacts:usable.length,
    writingArtifacts,
    speakingArtifacts,
    uniqueTasks:new Set(usable.map((artifact)=>artifact.taskId)).size,
    selectedArtifacts:selected.length,
    selectedWriting,
    selectedSpeaking,
    balanced:selectedWriting>=3&&selectedSpeaking>=3,
    blockers
  };
}

export function buildExternalReviewSubmissionTemplate(packet:HumanReviewPacketV1,reviewedAt=new Date()):P11ExternalReviewSubmissionTemplate{
  return {
    schema:"thiepn-japanese-p11-external-review-submission",
    schemaVersion:1,
    reviewerLabel:"",
    reviewerRole:"teacher",
    externalToProject:true,
    reviewedAt:reviewedAt.toISOString(),
    verdict:"approve-with-notes",
    blockingIssues:[],
    notes:"",
    artifactReviews:packet.artifacts.map((artifact)=>({
      eventId:artifact.eventId,
      rubric:{taskFulfillment:0,meaningAccuracy:0,coherence:0,register:0},
      disposition:"accepted",
      ...(artifact.mode==="speaking"?{spokenModality:"spoken_production" as const}:{}),
      comment:""
    }))
  };
}

export function buildExternalReviewerWorkspace(packet:HumanReviewPacketV1):string{
  const packetText=serializeHumanReviewPacket(packet);
  const embedded=JSON.stringify(packetText).replace(/</g,"\\u003c");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Japanese B2 External Review</title>
<style>
:root{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color-scheme:light dark}
body{max-width:960px;margin:0 auto;padding:32px 20px;line-height:1.5}
header,.card,.artifact{border:1px solid color-mix(in srgb,currentColor 18%,transparent);border-radius:14px;padding:20px;margin:0 0 18px}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}
label{display:grid;gap:6px;margin:10px 0}input,select,textarea,button{font:inherit;padding:10px;border-radius:8px;border:1px solid color-mix(in srgb,currentColor 25%,transparent)}
textarea{width:100%;box-sizing:border-box}button{cursor:pointer;font-weight:700}blockquote{white-space:pre-wrap;margin:12px 0;padding:14px;border-left:4px solid currentColor;background:color-mix(in srgb,currentColor 6%,transparent)}
.meta{opacity:.72;font-size:.92rem}.boundary{font-size:.92rem}.error{color:#b42318}.ok{color:#067647}h1,h2,h3{line-height:1.2}
</style>
</head>
<body>
<header>
<h1>Japanese B2 external productive-language review</h1>
<p>This offline reviewer workspace contains learner-authored evidence selected for the THIEPN Japanese P11 release-candidate gate.</p>
<p class="boundary"><strong>Boundary:</strong> your scores are descriptive external evidence. They do not change learner mastery and do not constitute accredited CEFR certification.</p>
<p id="fingerprint" class="meta">Calculating packet fingerprint…</p>
</header>
<section class="card">
<h2>Reviewer</h2>
<div class="grid">
<label>Reviewer label<input id="reviewerLabel" placeholder="Name or stable professional label"></label>
<label>Role<select id="reviewerRole"><option value="teacher">Teacher</option><option value="tutor">Tutor</option><option value="language-professional">Language professional</option></select></label>
</div>
</section>
<div id="artifacts"></div>
<section class="card">
<h2>Overall release-review verdict</h2>
<label>Verdict<select id="verdict"><option value="approve">Approve</option><option value="approve-with-notes" selected>Approve with notes</option><option value="block">Block</option></select></label>
<label>Blocking issues — one per line<textarea id="blockingIssues" rows="4" placeholder="Leave empty if there are no blocking issues"></textarea></label>
<label>Overall notes<textarea id="notes" rows="5"></textarea></label>
<button id="download" type="button">Download completed review JSON</button>
<p id="status" role="status"></p>
</section>
<script>
const packetText=${embedded};
const packet=JSON.parse(packetText);
const root=document.getElementById("artifacts");
const scoreLabels=["not demonstrated","limited","adequate","strong","consistently strong"];
function scoreSelect(key,eventId){
  const label=document.createElement("label");label.textContent=key;
  const select=document.createElement("select");select.dataset.score=key;select.dataset.eventId=eventId;
  for(let i=0;i<=4;i++){const option=document.createElement("option");option.value=String(i);option.textContent=i+" — "+scoreLabels[i];select.appendChild(option);}
  select.value="0";label.appendChild(select);return label;
}
for(const artifact of packet.artifacts){
  const card=document.createElement("section");card.className="artifact";card.dataset.eventId=artifact.eventId;
  const h=document.createElement("h2");h.textContent=artifact.title;card.appendChild(h);
  const meta=document.createElement("p");meta.className="meta";meta.textContent=artifact.mode+" · "+artifact.occurredAt+" · task "+artifact.taskId;card.appendChild(meta);
  const quote=document.createElement("blockquote");quote.lang="ja";quote.textContent=artifact.response;card.appendChild(quote);
  const grid=document.createElement("div");grid.className="grid";
  for(const key of ["taskFulfillment","meaningAccuracy","coherence","register"])grid.appendChild(scoreSelect(key,artifact.eventId));
  card.appendChild(grid);
  if(artifact.mode==="speaking"){
    const label=document.createElement("label");label.textContent="Speaking modality";
    const select=document.createElement("select");select.dataset.spokenModality=artifact.eventId;
    for(const [value,text] of [["spoken_production","Spoken production"],["spoken_interaction","Spoken interaction"]]){const option=document.createElement("option");option.value=value;option.textContent=text;select.appendChild(option);}
    label.appendChild(select);card.appendChild(label);
  }
  const disposition=document.createElement("label");disposition.textContent="Disposition";
  const dispositionSelect=document.createElement("select");dispositionSelect.dataset.disposition=artifact.eventId;
  for(const value of ["accepted","concern"]){const option=document.createElement("option");option.value=value;option.textContent=value;dispositionSelect.appendChild(option);}
  disposition.appendChild(dispositionSelect);card.appendChild(disposition);
  const comment=document.createElement("label");comment.textContent="Artifact comment";
  const textarea=document.createElement("textarea");textarea.rows=3;textarea.dataset.comment=artifact.eventId;comment.appendChild(textarea);card.appendChild(comment);
  root.appendChild(card);
}
async function sha256(text){
  const bytes=new TextEncoder().encode(text);
  const digest=await crypto.subtle.digest("SHA-256",bytes);
  return [...new Uint8Array(digest)].map((value)=>value.toString(16).padStart(2,"0")).join("");
}
let packetSha256="";
sha256(packetText).then((hash)=>{packetSha256=hash;document.getElementById("fingerprint").textContent="Packet SHA-256: "+hash;}).catch(()=>{document.getElementById("fingerprint").textContent="Packet fingerprint unavailable in this browser.";});
document.getElementById("download").addEventListener("click",async()=>{
  const status=document.getElementById("status");status.textContent="";status.className="";
  const reviewerLabel=document.getElementById("reviewerLabel").value.trim();
  if(!reviewerLabel){status.textContent="Reviewer label is required.";status.className="error";return;}
  if(!packetSha256){try{packetSha256=await sha256(packetText);}catch{}}
  const artifactReviews=packet.artifacts.map((artifact)=>{
    const card=document.querySelector('[data-event-id="'+CSS.escape(artifact.eventId)+'"]');
    const scores={};
    for(const key of ["taskFulfillment","meaningAccuracy","coherence","register"])scores[key]=Number(card.querySelector('[data-score="'+key+'"]').value);
    const result={
      eventId:artifact.eventId,
      rubric:scores,
      disposition:card.querySelector("[data-disposition]").value,
      comment:card.querySelector("[data-comment]").value.trim()
    };
    if(artifact.mode==="speaking")result.spokenModality=card.querySelector("[data-spoken-modality]").value;
    return result;
  });
  const blockingIssues=document.getElementById("blockingIssues").value.split(/\\r?\\n/).map((value)=>value.trim()).filter(Boolean);
  const submission={
    schema:"thiepn-japanese-p11-external-review-submission",
    schemaVersion:1,
    ...(packetSha256?{packetSha256}:{}),
    reviewerLabel,
    reviewerRole:document.getElementById("reviewerRole").value,
    externalToProject:true,
    reviewedAt:new Date().toISOString(),
    verdict:document.getElementById("verdict").value,
    blockingIssues,
    notes:document.getElementById("notes").value.trim(),
    artifactReviews
  };
  const blob=new Blob([JSON.stringify(submission,null,2)+"\\n"],{type:"application/json"});
  const url=URL.createObjectURL(blob);const a=document.createElement("a");
  a.href=url;a.download="japanese-p11-external-review-"+new Date().toISOString().slice(0,10)+".json";a.click();
  setTimeout(()=>URL.revokeObjectURL(url),0);
  status.textContent="Review exported. Return this JSON file together with the original packet to the project owner.";status.className="ok";
});
</script>
</body>
</html>`;
}

function prioritizeDistinctTasks(items:readonly HumanReviewArtifact[]):HumanReviewArtifact[]{
  const seen=new Set<string>(),unique:HumanReviewArtifact[]=[],duplicates:HumanReviewArtifact[]=[];
  for(const item of items){
    if(seen.has(item.taskId))duplicates.push(item);
    else{seen.add(item.taskId);unique.push(item);}
  }
  return [...unique,...duplicates];
}

export function buildHumanReviewPacket(artifacts:readonly HumanReviewArtifact[],now=new Date()):HumanReviewPacketV1{
  return {
    schema:"thiepn-japanese-human-review-packet",schemaVersion:1,generatedAt:now.toISOString(),
    evidenceBoundary:{reviewDoesNotChangeMastery:true,reviewerScoreIsNotCefrCertification:true},
    artifacts:artifacts.map((artifact)=>({
      eventId:artifact.eventId,occurredAt:artifact.occurredAt,taskId:artifact.taskId,title:artifact.title,
      mode:artifact.mode,response:artifact.response,structurallyCorrect:artifact.structurallyCorrect
    })),
    rubricScale:{min:0,max:4,dimensions:["taskFulfillment","meaningAccuracy","coherence","register"]}
  };
}

export function serializeHumanReviewPacket(packet:HumanReviewPacketV1):string{
  return JSON.stringify(packet,null,2);
}

export function extractHumanReviews(events:readonly StudyEvent[]):HumanReviewRecord[]{
  const records:HumanReviewRecord[]=[];
  for(const event of events){
    if(event.metadata?.humanReview!==true||event.promptFamily!=="p10-human-review")continue;
    const sourceEventId=typeof event.metadata.reviewOfEventId==="string"?event.metadata.reviewOfEventId:"";
    const taskId=event.primaryTarget?.kind==="production_task"?event.primaryTarget.id:"";
    const reviewerLabel=typeof event.metadata.reviewerLabel==="string"?event.metadata.reviewerLabel:"";
    const raw=event.metadata.rubric;
    if(!sourceEventId||!taskId||!reviewerLabel||!raw||typeof raw!=="object")continue;
    const rubric=parseRubric(raw as Record<string,unknown>);
    if(!rubric)continue;
    records.push({
      eventId:event.id,sourceEventId,taskId,reviewerLabel,reviewedAt:event.occurredAt,rubric,
      overall:typeof event.metadata.overall==="number"?event.metadata.overall:round2(mean(Object.values(rubric))),
      comment:typeof event.metadata.comment==="string"?event.metadata.comment:"",
      strengths:typeof event.metadata.strengths==="string"?event.metadata.strengths:"",
      nextPriority:typeof event.metadata.nextPriority==="string"?event.metadata.nextPriority:""
    });
  }
  return records;
}

function parseRubric(raw:Record<string,unknown>):HumanReviewRubric|null{
  const values=["taskFulfillment","meaningAccuracy","coherence","register"].map((key)=>raw[key]);
  if(values.some((value)=>!isScore(value)))return null;
  return {
    taskFulfillment:values[0] as HumanReviewScore,
    meaningAccuracy:values[1] as HumanReviewScore,
    coherence:values[2] as HumanReviewScore,
    register:values[3] as HumanReviewScore
  };
}
function validateRubric(rubric:HumanReviewRubric):void{
  for(const value of Object.values(rubric))if(!isScore(value))throw new Error("HUMAN_REVIEW_SCORE_OUT_OF_RANGE");
}
function isScore(value:unknown):value is HumanReviewScore{
  return typeof value==="number"&&Number.isInteger(value)&&value>=0&&value<=4;
}
function mean(values:number[]):number{return values.length?values.reduce((sum,value)=>sum+value,0)/values.length:0;}
function average(values:number[]):number{return round2(mean(values));}
function round2(value:number):number{return Math.round(value*100)/100;}
