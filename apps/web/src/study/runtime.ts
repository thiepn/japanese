import { entityKey } from "@thiepn/domain";
import { replayStudyEvents, type LearnerState } from "@thiepn/learner-engine";
import { getMemoryTrace, listMemoryTraces, listStudyEvents, saveMemoryTrace, saveStudyEvent } from "@thiepn/local-db";
import { createFsrsScheduler, type ReviewGrade } from "@thiepn/scheduler";
import { createStudyEvent, type StudyPrompt, type StudyStep } from "@thiepn/study-player";
import { FOUNDATION_TOTAL_ITEMS, foundationApplicationPrompts, foundationLessons, foundationPrompts } from "./foundationPrompts";

export const DEVELOPMENT_ACCOUNT_ID="00000000-0000-4000-8000-000000000001";
export const DEVELOPMENT_DEVICE_ID="p1-local-browser";
const scheduler=createFsrsScheduler();
const NEW_ITEMS_PER_SESSION=5;
const APPLICATION_ITEMS_PER_SESSION=3;
const MAX_QUEUE_SIZE=12;

export interface FoundationStudySummary {
  due:number; newItems:number; application:number; learned:number; total:number; memoryTraces:number;
}

export interface FoundationMasterySummary {
  overall:number;
  hiragana:number;
  katakana:number;
  recognition:number;
  readingRecall:number;
  formSelection:number;
  confidence:number;
  accuracy:number;
  matureSkills:number;
  expectedSkills:number;
  evidenceCount:number;
}

export async function buildFoundationQueue(now=new Date()):Promise<StudyStep[]>{
  const traces=await listMemoryTraces(DEVELOPMENT_ACCOUNT_ID);
  const byId=new Map(traces.map((trace)=>[trace.id,trace]));
  const allPrompts=[...foundationPrompts,...foundationApplicationPrompts];
  const due=allPrompts.filter((prompt)=>{const trace=byId.get(traceIdFor(prompt));return Boolean(trace)&&new Date(trace!.card.due).getTime()<=now.getTime();});
  const unseen=foundationPrompts.filter((prompt)=>!byId.has(traceIdFor(prompt)));
  const application=foundationApplicationPrompts.filter((prompt)=>!byId.has(traceIdFor(prompt))&&hasPrerequisiteEvidence(prompt,byId));

  const queue:StudyPrompt[]=[];
  queue.push(...due.slice(0,MAX_QUEUE_SIZE));
  const applicationSlots=Math.min(APPLICATION_ITEMS_PER_SESSION,Math.max(0,MAX_QUEUE_SIZE-queue.length));
  queue.push(...selectDiverseTargets(application.filter((prompt)=>!queue.some((item)=>item.id===prompt.id)),applicationSlots));
  const newSlots=Math.min(NEW_ITEMS_PER_SESSION,Math.max(0,MAX_QUEUE_SIZE-queue.length));
  queue.push(...unseen.filter((prompt)=>!queue.some((item)=>item.id===prompt.id)).slice(0,newSlots));
  return insertFirstExposureLessons(queue,byId);
}

export async function getFoundationStudySummary(now=new Date()):Promise<FoundationStudySummary>{
  const traces=await listMemoryTraces(DEVELOPMENT_ACCOUNT_ID);
  const byId=new Map(traces.map((trace)=>[trace.id,trace]));
  const allPrompts=[...foundationPrompts,...foundationApplicationPrompts];
  const due=allPrompts.filter((prompt)=>{const trace=byId.get(traceIdFor(prompt));return Boolean(trace)&&new Date(trace!.card.due).getTime()<=now.getTime();}).length;
  const learned=foundationPrompts.filter((prompt)=>byId.has(traceIdFor(prompt))).length;
  const application=foundationApplicationPrompts.filter((prompt)=>!byId.has(traceIdFor(prompt))&&hasPrerequisiteEvidence(prompt,byId)).length;
  return {due,newItems:Math.min(NEW_ITEMS_PER_SESSION,Math.max(0,FOUNDATION_TOTAL_ITEMS-learned)),application:Math.min(APPLICATION_ITEMS_PER_SESSION,application),learned,total:FOUNDATION_TOTAL_ITEMS,memoryTraces:traces.length};
}

export async function getFoundationMasterySummary():Promise<FoundationMasterySummary>{
  const events=await listStudyEvents(DEVELOPMENT_ACCOUNT_ID);
  const state=replayStudyEvents(events);
  const expected=uniqueSkillPrompts([...foundationPrompts,...foundationApplicationPrompts].filter((prompt)=>prompt.primaryTarget.kind==="kana"));
  const hiragana=expected.filter((prompt)=>prompt.primaryTarget.id.startsWith("hiragana-"));
  const katakana=expected.filter((prompt)=>prompt.primaryTarget.id.startsWith("katakana-"));
  const recognition=expected.filter((prompt)=>prompt.skill==="recognition");
  const readingRecall=expected.filter((prompt)=>prompt.skill==="reading");
  const formSelection=expected.filter((prompt)=>prompt.skill==="form_selection");
  const projections=expected.map((prompt)=>state.mastery[entityKey(prompt.primaryTarget,prompt.skill)]).filter((value)=>value!==undefined);
  const graded=events.filter((event)=>event.primaryTarget?.kind==="kana"&&["correct","incorrect","partial","revealed"].includes(event.result??""));
  const correct=graded.filter((event)=>event.result==="correct").length;
  return {
    overall:scoreFor(expected,state),
    hiragana:scoreFor(hiragana,state),
    katakana:scoreFor(katakana,state),
    recognition:scoreFor(recognition,state),
    readingRecall:scoreFor(readingRecall,state),
    formSelection:scoreFor(formSelection,state),
    confidence:expected.length?projections.reduce((sum,item)=>sum+(item?.confidence??0),0)/expected.length:0,
    accuracy:graded.length?correct/graded.length:0,
    matureSkills:projections.filter((item)=>item&&item.estimate>=0.72&&item.confidence>=0.35).length,
    expectedSkills:expected.length,
    evidenceCount:graded.length
  };
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
  const steps:StudyStep[]=[];const inserted=new Set<string>();
  const promptByTrace=new Map(foundationPrompts.map((prompt)=>[traceIdFor(prompt),prompt]));
  const seenContexts=new Set<string>();
  for(const trace of byId.values()){const prompt=promptByTrace.get(trace.id);if(prompt?.contextId)seenContexts.add(prompt.contextId);}
  for(const prompt of queue){
    const isNew=!byId.has(traceIdFor(prompt));const contextId=prompt.contextId;
    if(isNew&&contextId&&!seenContexts.has(contextId)&&!inserted.has(contextId)){const lesson=foundationLessons[contextId];if(lesson){steps.push(lesson);inserted.add(contextId);}}
    steps.push(prompt);
  }
  return steps;
}

function hasPrerequisiteEvidence(prompt:StudyPrompt,byId:Map<string,unknown>):boolean{
  const target=prompt.primaryTarget.id;
  if(target==="hiragana-small-tsu")return byId.has("kana:hiragana-small-tsu:reading:sokuon-reading");
  if(target==="katakana-small-tsu")return byId.has("kana:katakana-small-tsu:reading:sokuon-reading");
  if(target==="katakana-long-vowel-mark")return byId.has("kana:katakana-long-vowel-mark:reading:long-vowel-reading");
  return byId.has(`${prompt.primaryTarget.kind}:${target}:recognition:kana-to-sound`);
}

function selectDiverseTargets(prompts:StudyPrompt[],limit:number):StudyPrompt[]{
  const selected:StudyPrompt[]=[];const targets=new Set<string>();
  for(const prompt of prompts){const key=`${prompt.primaryTarget.kind}:${prompt.primaryTarget.id}`;if(targets.has(key))continue;selected.push(prompt);targets.add(key);if(selected.length>=limit)break;}
  if(selected.length<limit){for(const prompt of prompts){if(selected.includes(prompt))continue;selected.push(prompt);if(selected.length>=limit)break;}}
  return selected;
}

function uniqueSkillPrompts(prompts:StudyPrompt[]):StudyPrompt[]{
  const seen=new Set<string>();
  return prompts.filter((prompt)=>{const key=entityKey(prompt.primaryTarget,prompt.skill);if(seen.has(key))return false;seen.add(key);return true;});
}

function scoreFor(prompts:StudyPrompt[],state:LearnerState):number{
  if(!prompts.length)return 0;
  const total=prompts.reduce((sum,prompt)=>sum+(state.mastery[entityKey(prompt.primaryTarget,prompt.skill)]?.estimate??0),0);
  return total/prompts.length;
}

function gradeFor(result:"correct"|"incorrect"):ReviewGrade{return result==="correct"?"good":"again";}
export function traceIdFor(prompt:StudyPrompt):string{return `${prompt.primaryTarget.kind}:${prompt.primaryTarget.id}:${prompt.skill}:${prompt.cueFamily}`;}
