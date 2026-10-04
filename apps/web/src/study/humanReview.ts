import type { StudyEvent } from "@thiepn/domain";
import { listStudyEvents,saveStudyEvent } from "@thiepn/local-db";
import { productiveTasks } from "../coreContent";

const ACCOUNT_ID="00000000-0000-4000-8000-000000000001";
const DEVICE_ID="p10-human-review";

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
  return buildHumanReviewArtifacts(await listStudyEvents(ACCOUNT_ID));
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
    id:eventId,userId:ACCOUNT_ID,deviceId:DEVICE_ID,occurredAt:reviewedAt,
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
  const events=await listStudyEvents(ACCOUNT_ID);
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
