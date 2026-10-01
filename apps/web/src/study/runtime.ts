import { getMemoryTrace, listMemoryTraces, saveMemoryTrace, saveStudyEvent } from "@thiepn/local-db";
import { createFsrsScheduler, type ReviewGrade } from "@thiepn/scheduler";
import { createStudyEvent, type StudyPrompt, type StudyStep } from "@thiepn/study-player";
import { FOUNDATION_TOTAL_ITEMS, foundationApplicationPrompts, foundationLessons, foundationPrompts } from "./foundationPrompts";

export const DEVELOPMENT_ACCOUNT_ID="00000000-0000-4000-8000-000000000001";
export const DEVELOPMENT_DEVICE_ID="p1-local-browser";
const scheduler=createFsrsScheduler();
const NEW_ITEMS_PER_SESSION=5;
const APPLICATION_ITEMS_PER_SESSION=2;
const MAX_QUEUE_SIZE=12;

export async function buildFoundationQueue(now=new Date()):Promise<StudyStep[]>{
  const traces=await listMemoryTraces(DEVELOPMENT_ACCOUNT_ID);
  const byId=new Map(traces.map((trace)=>[trace.id,trace]));
  const allPrompts=[...foundationPrompts,...foundationApplicationPrompts];
  const due=allPrompts.filter((prompt)=>{const trace=byId.get(traceIdFor(prompt));return Boolean(trace)&&new Date(trace!.card.due).getTime()<=now.getTime();});
  const unseen=foundationPrompts.filter((prompt)=>!byId.has(traceIdFor(prompt)));
  const application=foundationApplicationPrompts.filter((prompt)=>!byId.has(traceIdFor(prompt))&&hasRecognitionEvidence(prompt,byId));

  const queue:StudyPrompt[]=[];
  queue.push(...due.slice(0,MAX_QUEUE_SIZE));
  const applicationSlots=Math.min(APPLICATION_ITEMS_PER_SESSION,Math.max(0,MAX_QUEUE_SIZE-queue.length));
  queue.push(...application.filter((prompt)=>!queue.some((item)=>item.id===prompt.id)).slice(0,applicationSlots));
  const newSlots=Math.min(NEW_ITEMS_PER_SESSION,Math.max(0,MAX_QUEUE_SIZE-queue.length));
  queue.push(...unseen.filter((prompt)=>!queue.some((item)=>item.id===prompt.id)).slice(0,newSlots));
  return insertFirstExposureLessons(queue,byId);
}

export async function getFoundationStudySummary(now=new Date()):Promise<{due:number;newItems:number;application:number;learned:number;total:number;memoryTraces:number}>{
  const traces=await listMemoryTraces(DEVELOPMENT_ACCOUNT_ID);
  const byId=new Map(traces.map((trace)=>[trace.id,trace]));
  const allPrompts=[...foundationPrompts,...foundationApplicationPrompts];
  const due=allPrompts.filter((prompt)=>{const trace=byId.get(traceIdFor(prompt));return Boolean(trace)&&new Date(trace!.card.due).getTime()<=now.getTime();}).length;
  const learned=foundationPrompts.filter((prompt)=>byId.has(traceIdFor(prompt))).length;
  const application=foundationApplicationPrompts.filter((prompt)=>!byId.has(traceIdFor(prompt))&&hasRecognitionEvidence(prompt,byId)).length;
  return {due,newItems:Math.min(NEW_ITEMS_PER_SESSION,FOUNDATION_TOTAL_ITEMS-learned),application:Math.min(APPLICATION_ITEMS_PER_SESSION,application),learned,total:FOUNDATION_TOTAL_ITEMS,memoryTraces:traces.length};
}

export async function recordStudyAnswer(input:{prompt:StudyPrompt;response:string;result:"correct"|"incorrect";responseTimeMs:number}):Promise<void>{
  const traceId=traceIdFor(input.prompt);
  const existing=await getMemoryTrace(DEVELOPMENT_ACCOUNT_ID,traceId);
  const now=new Date().toISOString();
  const base=existing??scheduler.create({id:traceId,userId:DEVELOPMENT_ACCOUNT_ID,entity:input.prompt.primaryTarget,skillDimension:input.prompt.skill,cueFamily:input.prompt.cueFamily},now);
  const event=createStudyEvent({id:crypto.randomUUID(),userId:DEVELOPMENT_ACCOUNT_ID,deviceId:DEVELOPMENT_DEVICE_ID,prompt:input.prompt,response:input.response,occurredAt:now,responseTimeMs:input.responseTimeMs,baseRevision:base.revision});
  await saveStudyEvent(event);
  await saveMemoryTrace(DEVELOPMENT_ACCOUNT_ID,scheduler.review(base,{grade:gradeFor(input.result),reviewedAt:now}));
}

function insertFirstExposureLessons(queue:StudyPrompt[],byId:Map<string,Awaited<ReturnType<typeof listMemoryTraces>>[number]>):StudyStep[]{
  const steps:StudyStep[]=[];
  const inserted=new Set<string>();
  const promptByTrace=new Map(foundationPrompts.map((prompt)=>[traceIdFor(prompt),prompt]));
  const seenContexts=new Set<string>();
  for(const trace of byId.values()){const prompt=promptByTrace.get(trace.id);if(prompt?.contextId)seenContexts.add(prompt.contextId);}
  for(const prompt of queue){
    const isNew=!byId.has(traceIdFor(prompt));
    const contextId=prompt.contextId;
    if(isNew&&contextId&&!seenContexts.has(contextId)&&!inserted.has(contextId)){
      const lesson=foundationLessons[contextId];
      if(lesson){steps.push(lesson);inserted.add(contextId);}
    }
    steps.push(prompt);
  }
  return steps;
}

function hasRecognitionEvidence(prompt:StudyPrompt,byId:Map<string,unknown>):boolean{
  const recognitionId=`${prompt.primaryTarget.kind}:${prompt.primaryTarget.id}:recognition:kana-to-sound`;
  return byId.has(recognitionId);
}
function gradeFor(result:"correct"|"incorrect"):ReviewGrade{return result==="correct"?"good":"again";}
export function traceIdFor(prompt:StudyPrompt):string{return `${prompt.primaryTarget.kind}:${prompt.primaryTarget.id}:${prompt.skill}:${prompt.cueFamily}`;}
