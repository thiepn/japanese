import { entityKey } from "@thiepn/domain";
import { replayStudyEvents, type LearnerState } from "@thiepn/learner-engine";
import { getMemoryTrace, listMemoryTraces, listStudyEvents, saveMemoryTrace, saveStudyEvent } from "@thiepn/local-db";
import { createFsrsScheduler, type ReviewGrade } from "@thiepn/scheduler";
import { createStudyEvent, type StudyPrompt, type StudyStep } from "@thiepn/study-player";
import { FOUNDATION_TOTAL_ITEMS, foundationApplicationPrompts, foundationLessons, foundationPrompts } from "./foundationPrompts";
import { VOCABULARY_TOTAL, vocabularyApplicationPrompts, vocabularyLessons, vocabularyMeaningPrompts } from "./vocabulary";

export const DEVELOPMENT_ACCOUNT_ID="00000000-0000-4000-8000-000000000001";
export const DEVELOPMENT_DEVICE_ID="p1-local-browser";

const scheduler=createFsrsScheduler();
const NEW_KANA_PER_SESSION=5;
const NEW_VOCAB_PER_SESSION=2;
const APPLICATION_ITEMS_PER_SESSION=3;
const MAX_QUEUE_SIZE=14;
const MAX_DUE_PER_SESSION=10;

export interface StudySummary {
  due:number; newKana:number; newVocabulary:number; application:number;
  learnedKana:number; totalKana:number; learnedVocabulary:number; totalVocabulary:number; memoryTraces:number;
}

export interface KanaMasterySummary {
  overall:number; hiragana:number; katakana:number; recognition:number; readingRecall:number; formSelection:number;
  confidence:number; accuracy:number; matureSkills:number; expectedSkills:number; evidenceCount:number;
}

export interface VocabularyMasterySummary {
  overall:number; meaning:number; reading:number; activeUse:number; confidence:number; accuracy:number;
  matureSkills:number; expectedSkills:number; evidenceCount:number;
}

export async function buildTodayQueue(now=new Date()):Promise<StudyStep[]>{
  const traces=await listMemoryTraces(DEVELOPMENT_ACCOUNT_ID);
  const byId=new Map(traces.map((trace)=>[trace.id,trace]));
  const primary=[...foundationPrompts,...vocabularyMeaningPrompts];
  const application=[...foundationApplicationPrompts,...vocabularyApplicationPrompts];
  const all=[...primary,...application];
  const due=all.filter((prompt)=>isDue(prompt,byId,now)).sort((a,b)=>dueAt(a,byId)-dueAt(b,byId));
  const unseenKana=foundationPrompts.filter((prompt)=>!byId.has(traceIdFor(prompt)));
  const unseenVocabulary=vocabularyMeaningPrompts.filter((prompt)=>!byId.has(traceIdFor(prompt)));
  const readyApplication=application.filter((prompt)=>!byId.has(traceIdFor(prompt))&&hasPrerequisiteEvidence(prompt,byId));
  if(due.length>=MAX_DUE_PER_SESSION)return insertFirstExposureLessons(due.slice(0,MAX_QUEUE_SIZE),byId);

  const queue:StudyPrompt[]=[];
  queue.push(...due);
  addUnique(queue,selectDiverseTargets(readyApplication,Math.min(APPLICATION_ITEMS_PER_SESSION,slots(queue))));
  addUnique(queue,unseenKana.slice(0,Math.min(NEW_KANA_PER_SESSION,slots(queue))));
  addUnique(queue,unseenVocabulary.slice(0,Math.min(NEW_VOCAB_PER_SESSION,slots(queue))));
  if(queue.length<MAX_QUEUE_SIZE)addUnique(queue,due.slice(0,MAX_QUEUE_SIZE));
  return insertFirstExposureLessons(queue,byId);
}

export async function getStudySummary(now=new Date()):Promise<StudySummary>{
  const traces=await listMemoryTraces(DEVELOPMENT_ACCOUNT_ID);
  const byId=new Map(traces.map((trace)=>[trace.id,trace]));
  const all=[...foundationPrompts,...foundationApplicationPrompts,...vocabularyMeaningPrompts,...vocabularyApplicationPrompts];
  const due=all.filter((prompt)=>isDue(prompt,byId,now)).length;
  const learnedKana=foundationPrompts.filter((prompt)=>byId.has(traceIdFor(prompt))).length;
  const learnedVocabulary=vocabularyMeaningPrompts.filter((prompt)=>byId.has(traceIdFor(prompt))).length;
  const application=[...foundationApplicationPrompts,...vocabularyApplicationPrompts].filter((prompt)=>!byId.has(traceIdFor(prompt))&&hasPrerequisiteEvidence(prompt,byId)).length;
  const pauseNew=due>=MAX_DUE_PER_SESSION;
  return {
    due,
    newKana:pauseNew?0:Math.min(NEW_KANA_PER_SESSION,Math.max(0,FOUNDATION_TOTAL_ITEMS-learnedKana)),
    newVocabulary:pauseNew?0:Math.min(NEW_VOCAB_PER_SESSION,Math.max(0,VOCABULARY_TOTAL-learnedVocabulary)),
    application:Math.min(APPLICATION_ITEMS_PER_SESSION,application),
    learnedKana,totalKana:FOUNDATION_TOTAL_ITEMS,learnedVocabulary,totalVocabulary:VOCABULARY_TOTAL,memoryTraces:traces.length
  };
}

export async function getKanaMasterySummary():Promise<KanaMasterySummary>{
  const events=await listStudyEvents(DEVELOPMENT_ACCOUNT_ID);
  const state=replayStudyEvents(events);
  const expected=uniqueSkillPrompts([...foundationPrompts,...foundationApplicationPrompts].filter((prompt)=>prompt.primaryTarget.kind==="kana"));
  const hiragana=expected.filter((prompt)=>prompt.primaryTarget.id.startsWith("hiragana-"));
  const katakana=expected.filter((prompt)=>prompt.primaryTarget.id.startsWith("katakana-"));
  const recognition=expected.filter((prompt)=>prompt.skill==="recognition");
  const readingRecall=expected.filter((prompt)=>prompt.skill==="reading");
  const formSelection=expected.filter((prompt)=>prompt.skill==="form_selection");
  const projections=projectionsFor(expected,state);
  const graded=gradedEvents(events,"kana");
  return {
    overall:scoreFor(expected,state),hiragana:scoreFor(hiragana,state),katakana:scoreFor(katakana,state),
    recognition:scoreFor(recognition,state),readingRecall:scoreFor(readingRecall,state),formSelection:scoreFor(formSelection,state),
    confidence:meanConfidence(projections,expected.length),accuracy:accuracyFor(graded),
    matureSkills:projections.filter((item)=>item.estimate>=0.72&&item.confidence>=0.35).length,expectedSkills:expected.length,evidenceCount:graded.length
  };
}

export async function getVocabularyMasterySummary():Promise<VocabularyMasterySummary>{
  const events=await listStudyEvents(DEVELOPMENT_ACCOUNT_ID);
  const state=replayStudyEvents(events);
  const expected=uniqueSkillPrompts([...vocabularyMeaningPrompts,...vocabularyApplicationPrompts]);
  const meaning=expected.filter((prompt)=>prompt.skill==="meaning_recognition");
  const reading=expected.filter((prompt)=>prompt.skill==="reading");
  const active=expected.filter((prompt)=>prompt.skill==="active_use");
  const projections=projectionsFor(expected,state);
  const expectedIds=new Set(expected.map((prompt)=>prompt.primaryTarget.id));
  const graded=gradedEvents(events,"lexeme").filter((event)=>event.primaryTarget&&expectedIds.has(event.primaryTarget.id));
  return {
    overall:scoreFor(expected,state),meaning:scoreFor(meaning,state),reading:scoreFor(reading,state),activeUse:scoreFor(active,state),
    confidence:meanConfidence(projections,expected.length),accuracy:accuracyFor(graded),
    matureSkills:projections.filter((item)=>item.estimate>=0.72&&item.confidence>=0.35).length,expectedSkills:expected.length,evidenceCount:graded.length
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
  const lessons={...foundationLessons,...vocabularyLessons};
  const primary=[...foundationPrompts,...vocabularyMeaningPrompts];
  const promptByTrace=new Map(primary.map((prompt)=>[traceIdFor(prompt),prompt]));
  const seenContexts=new Set<string>();
  for(const trace of byId.values()){const prompt=promptByTrace.get(trace.id);if(prompt?.contextId)seenContexts.add(prompt.contextId);}
  const steps:StudyStep[]=[];const inserted=new Set<string>();
  for(const prompt of queue){
    const isNew=!byId.has(traceIdFor(prompt));const contextId=prompt.contextId;
    if(isNew&&contextId&&!seenContexts.has(contextId)&&!inserted.has(contextId)){const lesson=lessons[contextId];if(lesson){steps.push(lesson);inserted.add(contextId);}}
    steps.push(prompt);
  }
  return steps;
}

function hasPrerequisiteEvidence(prompt:StudyPrompt,byId:Map<string,unknown>):boolean{return isApplicationPromptReady(prompt,new Set(byId.keys()));}

export function isApplicationPromptReady(prompt:StudyPrompt,traceIds:ReadonlySet<string>):boolean{
  if(prompt.primaryTarget.kind==="lexeme"){
    const meaning="lexeme:"+prompt.primaryTarget.id+":meaning_recognition:written-to-meaning";
    if(prompt.skill==="reading")return traceIds.has(meaning);
    if(prompt.skill==="active_use"){const reading="lexeme:"+prompt.primaryTarget.id+":reading:word-to-reading";return traceIds.has(meaning)&&traceIds.has(reading);}
    return true;
  }
  const target=prompt.primaryTarget.id;
  if(target==="hiragana-small-tsu")return traceIds.has("kana:hiragana-small-tsu:reading:sokuon-reading");
  if(target==="katakana-small-tsu")return traceIds.has("kana:katakana-small-tsu:reading:sokuon-reading");
  if(target==="katakana-long-vowel-mark")return traceIds.has("kana:katakana-long-vowel-mark:reading:long-vowel-reading");
  return traceIds.has(prompt.primaryTarget.kind+":"+target+":recognition:kana-to-sound");
}

function isDue(prompt:StudyPrompt,byId:Map<string,Awaited<ReturnType<typeof listMemoryTraces>>[number]>,now:Date):boolean{
  const trace=byId.get(traceIdFor(prompt));return Boolean(trace)&&new Date(trace!.card.due).getTime()<=now.getTime();
}
function dueAt(prompt:StudyPrompt,byId:Map<string,Awaited<ReturnType<typeof listMemoryTraces>>[number]>):number{return new Date(byId.get(traceIdFor(prompt))?.card.due??"9999-12-31T00:00:00Z").getTime();}
function slots(queue:StudyPrompt[]):number{return Math.max(0,MAX_QUEUE_SIZE-queue.length);}
function addUnique(queue:StudyPrompt[],items:readonly StudyPrompt[]):void{for(const item of items){if(queue.length>=MAX_QUEUE_SIZE)break;if(!queue.some((existing)=>existing.id===item.id))queue.push(item);}}
function selectDiverseTargets(prompts:StudyPrompt[],limit:number):StudyPrompt[]{
  const selected:StudyPrompt[]=[];const targets=new Set<string>();
  for(const prompt of prompts){const key=prompt.primaryTarget.kind+":"+prompt.primaryTarget.id;if(targets.has(key))continue;selected.push(prompt);targets.add(key);if(selected.length>=limit)break;}
  if(selected.length<limit){for(const prompt of prompts){if(selected.includes(prompt))continue;selected.push(prompt);if(selected.length>=limit)break;}}
  return selected;
}
function uniqueSkillPrompts(prompts:StudyPrompt[]):StudyPrompt[]{const seen=new Set<string>();return prompts.filter((prompt)=>{const key=entityKey(prompt.primaryTarget,prompt.skill);if(seen.has(key))return false;seen.add(key);return true;});}
function projectionsFor(prompts:StudyPrompt[],state:LearnerState){return prompts.map((prompt)=>state.mastery[entityKey(prompt.primaryTarget,prompt.skill)]).filter((value)=>value!==undefined);}
function scoreFor(prompts:StudyPrompt[],state:LearnerState):number{if(!prompts.length)return 0;return prompts.reduce((sum,prompt)=>sum+(state.mastery[entityKey(prompt.primaryTarget,prompt.skill)]?.estimate??0),0)/prompts.length;}
function gradedEvents(events:Awaited<ReturnType<typeof listStudyEvents>>,kind:"kana"|"lexeme"){return events.filter((event)=>event.primaryTarget?.kind===kind&&["correct","incorrect","partial","revealed"].includes(event.result??""));}
function accuracyFor(events:ReturnType<typeof gradedEvents>):number{if(!events.length)return 0;return events.filter((event)=>event.result==="correct").length/events.length;}
function meanConfidence(projections:ReturnType<typeof projectionsFor>,expected:number):number{if(!expected)return 0;return projections.reduce((sum,item)=>sum+item.confidence,0)/expected;}
function gradeFor(result:"correct"|"incorrect"):ReviewGrade{return result==="correct"?"good":"again";}
export function traceIdFor(prompt:StudyPrompt):string{return prompt.primaryTarget.kind+":"+prompt.primaryTarget.id+":"+prompt.skill+":"+prompt.cueFamily;}

export const buildFoundationQueue=buildTodayQueue;
export const getFoundationStudySummary=getStudySummary;
export const getFoundationMasterySummary=getKanaMasterySummary;
export type FoundationStudySummary=StudySummary;
export type FoundationMasterySummary=KanaMasterySummary;
