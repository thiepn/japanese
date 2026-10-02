import { entityKey } from "@thiepn/domain";
import { replayStudyEvents, type LearnerState } from "@thiepn/learner-engine";
import { getMemoryTrace, listMemoryTraces, listStudyEvents, saveMemoryTrace, saveStudyEvent } from "@thiepn/local-db";
import { createFsrsScheduler, type ReviewGrade } from "@thiepn/scheduler";
import { createStudyEvent, type StudyPrompt, type StudyStep } from "@thiepn/study-player";
import { pronunciationLessons, pronunciationPerceptionPrompts } from "./audioPrompts";
import { FOUNDATION_TOTAL_ITEMS, foundationApplicationPrompts, foundationLessons, foundationPrompts } from "./foundationPrompts";
import { a1Course, allGrammarCoursePrompts, courseUnitPrompts, courseUnitSession, grammarCourseLessons, isGrammarCoursePromptReady, selectNewCoursePrompts } from "./grammarCourse";
import { conjugationLessons, conjugationPrompts } from "./conjugation";
import {
  buildA1MilestoneAssessment,buildUnitAssessment,getA1MilestoneProgress,getUnitAssessmentProgress,
  type MilestoneAssessmentProgress,type UnitAssessmentProgress
} from "./assessment";
import { VOCABULARY_TOTAL, vocabularyApplicationPrompts, vocabularyLessons, vocabularyMeaningPrompts } from "./vocabulary";
import { buildPrivateVocabularyPrompts } from "./privateVocabulary";

export const DEVELOPMENT_ACCOUNT_ID="00000000-0000-4000-8000-000000000001";
export const DEVELOPMENT_DEVICE_ID="p2-local-browser";

const scheduler=createFsrsScheduler();
const NEW_KANA_PER_SESSION=5;
const NEW_VOCAB_PER_SESSION=2;
const APPLICATION_ITEMS_PER_SESSION=3;
const COURSE_ITEMS_PER_SESSION=2;
const MAX_QUEUE_SIZE=16;
const MAX_DUE_PER_SESSION=11;

export interface StudySummary {
  due:number; newKana:number; newVocabulary:number; listening:number; application:number; course:number;
  learnedKana:number; totalKana:number; learnedVocabulary:number; totalVocabulary:number; memoryTraces:number;
}

export interface KanaMasterySummary {
  overall:number; hiragana:number; katakana:number; recognition:number; readingRecall:number; formSelection:number; listening:number;
  confidence:number; accuracy:number; matureSkills:number; expectedSkills:number; evidenceCount:number;
}
export interface VocabularyMasterySummary {
  overall:number; meaning:number; reading:number; listening:number; activeUse:number; confidence:number; accuracy:number;
  matureSkills:number; expectedSkills:number; evidenceCount:number;
}
export interface ConjugationMasterySummary {
  overall:number; politeNegative:number; politePast:number; politePastNegative:number; teForm:number; confidence:number; accuracy:number;
  matureSkills:number; expectedSkills:number; evidenceCount:number;
}
export interface GrammarMasterySummary {
  overall:number; comprehension:number; formSelection:number; confidence:number; accuracy:number;
  matureSkills:number; expectedSkills:number; evidenceCount:number;
}
export interface SentenceMasterySummary {
  overall:number; comprehension:number; production:number; confidence:number; accuracy:number;
  matureSkills:number; expectedSkills:number; evidenceCount:number;
}
export type CourseUnitStatus="ready"|"challenging"|"learning"|"mastered";
export interface CourseUnitProgress {
  id:string; order:number; title:string; canDo:string; status:CourseUnitStatus; mastery:number; evidenceCount:number;
  assessment:UnitAssessmentProgress;
}
export type A1MilestoneProgress=MilestoneAssessmentProgress;

function foundationApplicationPool():StudyPrompt[]{
  return [...pronunciationPerceptionPrompts,...foundationApplicationPrompts,...vocabularyApplicationPrompts,...conjugationPrompts];
}
function allPrompts():StudyPrompt[]{
  return [...foundationPrompts,...vocabularyMeaningPrompts,...foundationApplicationPool(),...allGrammarCoursePrompts];
}

export async function buildTodayQueue(now=new Date()):Promise<StudyStep[]>{
  const [traces,events,privateSet]=await Promise.all([listMemoryTraces(DEVELOPMENT_ACCOUNT_ID),listStudyEvents(DEVELOPMENT_ACCOUNT_ID),buildPrivateVocabularyPrompts()]);
  const byId=new Map(traces.map((trace)=>[trace.id,trace]));
  const traceIds=new Set(byId.keys());
  const privatePrompts=[...privateSet.meaning,...privateSet.application];
  const all=[...allPrompts(),...privatePrompts];
  const due=all.filter((prompt)=>isDue(prompt,byId,now)).sort((a,b)=>dueAt(a,byId)-dueAt(b,byId));
  if(due.length>=MAX_DUE_PER_SESSION)return insertFirstExposureLessons(due.slice(0,MAX_QUEUE_SIZE),byId,privatePrompts);

  const unseenKana=foundationPrompts.filter((prompt)=>!byId.has(traceIdFor(prompt)));
  const unseenVocabulary=[...vocabularyMeaningPrompts,...privateSet.meaning].filter((prompt)=>!byId.has(traceIdFor(prompt)));
  const readyApplication=[...foundationApplicationPool(),...privateSet.application].filter((prompt)=>!byId.has(traceIdFor(prompt))&&isApplicationPromptReady(prompt,traceIds));
  const readyCourse=selectNewCoursePrompts(traceIds,COURSE_ITEMS_PER_SESSION);
  const mined=pendingMinedVocabulary(events).slice(0,2);
  const queue:StudyPrompt[]=[];

  addUnique(queue,due);
  addUnique(queue,mined);
  addUnique(queue,selectBalancedApplications(readyApplication,Math.min(APPLICATION_ITEMS_PER_SESSION,slots(queue))));
  addUnique(queue,readyCourse);
  addUnique(queue,unseenKana.slice(0,Math.min(NEW_KANA_PER_SESSION,slots(queue))));
  addUnique(queue,unseenVocabulary.slice(0,Math.min(NEW_VOCAB_PER_SESSION,slots(queue))));
  if(queue.length<MAX_QUEUE_SIZE)addUnique(queue,due.slice(0,MAX_QUEUE_SIZE));
  return insertFirstExposureLessons(queue,byId,privatePrompts);
}

export async function buildCourseUnitSession(unitId:string):Promise<StudyStep[]>{
  return courseUnitSession(unitId);
}
export async function buildUnitAssessmentSession(unitId:string):Promise<StudyStep[]>{
  return buildUnitAssessment(unitId);
}
export async function buildA1MilestoneSession():Promise<StudyStep[]>{
  return buildA1MilestoneAssessment();
}
export async function getA1MilestoneAssessmentProgress():Promise<MilestoneAssessmentProgress>{
  return getA1MilestoneProgress(await listStudyEvents(DEVELOPMENT_ACCOUNT_ID));
}

export async function getStudySummary(now=new Date()):Promise<StudySummary>{
  const [traces,privateSet]=await Promise.all([listMemoryTraces(DEVELOPMENT_ACCOUNT_ID),buildPrivateVocabularyPrompts()]);
  const byId=new Map(traces.map((trace)=>[trace.id,trace]));
  const traceIds=new Set(byId.keys());
  const privatePrompts=[...privateSet.meaning,...privateSet.application];
  const all=[...allPrompts(),...privatePrompts];
  const due=all.filter((prompt)=>isDue(prompt,byId,now)).length;
  const learnedKana=foundationPrompts.filter((prompt)=>byId.has(traceIdFor(prompt))).length;
  const allMeaning=[...vocabularyMeaningPrompts,...privateSet.meaning];
  const learnedVocabulary=allMeaning.filter((prompt)=>byId.has(traceIdFor(prompt))).length;
  const ready=[...foundationApplicationPool(),...privateSet.application].filter((prompt)=>!byId.has(traceIdFor(prompt))&&isApplicationPromptReady(prompt,traceIds));
  const listeningReady=ready.filter(isListeningPrompt).length;
  const nonListeningReady=ready.length-listeningReady;
  const course=selectNewCoursePrompts(traceIds,COURSE_ITEMS_PER_SESSION).length;
  const pauseNew=due>=MAX_DUE_PER_SESSION;
  return {
    due,
    newKana:pauseNew?0:Math.min(NEW_KANA_PER_SESSION,Math.max(0,FOUNDATION_TOTAL_ITEMS-learnedKana)),
    newVocabulary:pauseNew?0:Math.min(NEW_VOCAB_PER_SESSION,Math.max(0,VOCABULARY_TOTAL+privateSet.meaning.length-learnedVocabulary)),
    listening:Math.min(2,listeningReady),
    application:Math.min(2,nonListeningReady),
    course:pauseNew?0:course,
    learnedKana,totalKana:FOUNDATION_TOTAL_ITEMS,learnedVocabulary,totalVocabulary:VOCABULARY_TOTAL+privateSet.meaning.length,memoryTraces:traces.length
  };
}

export async function getKanaMasterySummary():Promise<KanaMasterySummary>{
  const events=await listStudyEvents(DEVELOPMENT_ACCOUNT_ID);
  const state=replayStudyEvents(events);
  const expected=uniqueSkillPrompts([...foundationPrompts,...foundationApplicationPrompts,...pronunciationPerceptionPrompts].filter((prompt)=>prompt.primaryTarget.kind==="kana"));
  const hiragana=expected.filter((prompt)=>prompt.primaryTarget.id.startsWith("hiragana-"));
  const katakana=expected.filter((prompt)=>prompt.primaryTarget.id.startsWith("katakana-"));
  const recognition=expected.filter((prompt)=>prompt.skill==="recognition");
  const readingRecall=expected.filter((prompt)=>prompt.skill==="reading");
  const formSelection=expected.filter((prompt)=>prompt.skill==="form_selection");
  const listening=expected.filter((prompt)=>prompt.skill==="listening");
  const projections=projectionsFor(expected,state);
  const expectedIds=new Set(expected.map((prompt)=>prompt.primaryTarget.id));
  const graded=gradedEvents(events,"kana").filter((event)=>event.primaryTarget&&expectedIds.has(event.primaryTarget.id));
  return {
    overall:scoreFor(expected,state),hiragana:scoreFor(hiragana,state),katakana:scoreFor(katakana,state),
    recognition:scoreFor(recognition,state),readingRecall:scoreFor(readingRecall,state),formSelection:scoreFor(formSelection,state),listening:scoreFor(listening,state),
    confidence:meanConfidence(projections,expected.length),accuracy:accuracyFor(graded),
    matureSkills:matureCount(projections),expectedSkills:expected.length,evidenceCount:graded.length
  };
}

export async function getVocabularyMasterySummary():Promise<VocabularyMasterySummary>{
  const [events,privateSet]=await Promise.all([listStudyEvents(DEVELOPMENT_ACCOUNT_ID),buildPrivateVocabularyPrompts()]);
  const state=replayStudyEvents(events);
  const expected=uniqueSkillPrompts([...vocabularyMeaningPrompts,...vocabularyApplicationPrompts,...privateSet.meaning,...privateSet.application]);
  const meaning=expected.filter((prompt)=>prompt.skill==="meaning_recognition");
  const reading=expected.filter((prompt)=>prompt.skill==="reading");
  const listening=expected.filter((prompt)=>prompt.skill==="audio_recognition");
  const active=expected.filter((prompt)=>prompt.skill==="active_use");
  const projections=projectionsFor(expected,state);
  const expectedIds=new Set(expected.map((prompt)=>prompt.primaryTarget.id));
  const graded=gradedEvents(events,"lexeme").filter((event)=>event.primaryTarget&&expectedIds.has(event.primaryTarget.id));
  return {
    overall:scoreFor(expected,state),meaning:scoreFor(meaning,state),reading:scoreFor(reading,state),listening:scoreFor(listening,state),activeUse:scoreFor(active,state),
    confidence:meanConfidence(projections,expected.length),accuracy:accuracyFor(graded),
    matureSkills:matureCount(projections),expectedSkills:expected.length,evidenceCount:graded.length
  };
}

export async function getConjugationMasterySummary():Promise<ConjugationMasterySummary>{
  const events=await listStudyEvents(DEVELOPMENT_ACCOUNT_ID);
  const state=replayStudyEvents(events);
  const expectedByLexeme=uniqueSkillPrompts(conjugationPrompts);
  const projections=projectionsFor(expectedByLexeme,state);
  const expectedIds=new Set(conjugationPrompts.map((prompt)=>prompt.primaryTarget.id));
  const graded=gradedEvents(events,"lexeme").filter((event)=>event.primaryTarget&&expectedIds.has(event.primaryTarget.id)&&String(event.promptFamily??"").startsWith("conjugation-"));
  const familyAccuracy=(family:string)=>accuracyFor(graded.filter((event)=>event.promptFamily===family));
  return {
    overall:scoreFor(expectedByLexeme,state),
    politeNegative:familyAccuracy("conjugation-polite_negative"),
    politePast:familyAccuracy("conjugation-polite_past"),
    politePastNegative:familyAccuracy("conjugation-polite_past_negative"),
    teForm:familyAccuracy("conjugation-te_form"),
    confidence:meanConfidence(projections,expectedByLexeme.length),
    accuracy:accuracyFor(graded),
    matureSkills:matureCount(projections),
    expectedSkills:conjugationPrompts.length,
    evidenceCount:graded.length
  };
}

export async function getGrammarMasterySummary():Promise<GrammarMasterySummary>{
  const events=await listStudyEvents(DEVELOPMENT_ACCOUNT_ID);
  const state=replayStudyEvents(events);
  const expected=uniqueSkillPrompts(allGrammarCoursePrompts.filter((prompt)=>prompt.primaryTarget.kind==="grammar"));
  const comprehension=expected.filter((prompt)=>prompt.skill==="comprehension");
  const formSelection=expected.filter((prompt)=>prompt.skill==="form_selection");
  const projections=projectionsFor(expected,state);
  const graded=gradedEvents(events,"grammar");
  return {
    overall:scoreFor(expected,state),comprehension:scoreFor(comprehension,state),formSelection:scoreFor(formSelection,state),
    confidence:meanConfidence(projections,expected.length),accuracy:accuracyFor(graded),
    matureSkills:matureCount(projections),expectedSkills:expected.length,evidenceCount:graded.length
  };
}

export async function getSentenceMasterySummary():Promise<SentenceMasterySummary>{
  const events=await listStudyEvents(DEVELOPMENT_ACCOUNT_ID);
  const state=replayStudyEvents(events);
  const expected=uniqueSkillPrompts(allGrammarCoursePrompts.filter((prompt)=>prompt.primaryTarget.kind==="sentence"));
  const comprehension=expected.filter((prompt)=>prompt.skill==="comprehension");
  const production=expected.filter((prompt)=>prompt.skill==="production");
  const projections=projectionsFor(expected,state);
  const graded=gradedEvents(events,"sentence");
  return {
    overall:scoreFor(expected,state),comprehension:scoreFor(comprehension,state),production:scoreFor(production,state),
    confidence:meanConfidence(projections,expected.length),accuracy:accuracyFor(graded),
    matureSkills:matureCount(projections),expectedSkills:expected.length,evidenceCount:graded.length
  };
}

export async function getCourseProgress():Promise<CourseUnitProgress[]>{
  const events=await listStudyEvents(DEVELOPMENT_ACCOUNT_ID);
  const state=replayStudyEvents(events);
  const traces=await listMemoryTraces(DEVELOPMENT_ACCOUNT_ID);
  const traceIds=new Set(traces.map((trace)=>trace.id));
  const statuses=new Map<string,CourseUnitStatus>();
  const result:CourseUnitProgress[]=[];
  for(const view of a1Course){
    const prompts=uniqueSkillPrompts(courseUnitPrompts(view.unit.id).filter((prompt)=>prompt.skill!=="production"));
    const projections=projectionsFor(prompts,state);
    const mastery=scoreFor(prompts,state);
    const allEstablished=prompts.length>0&&prompts.every((prompt)=>(state.mastery[entityKey(prompt.primaryTarget,prompt.skill)]?.estimate??0)>=0.55);
    const hasEvidence=prompts.some((prompt)=>traceIds.has(traceIdFor(prompt)));
    const prereqsReady=view.unit.prerequisiteUnitIds.every((id)=>{
      const status=statuses.get(id);return status==="learning"||status==="mastered";
    });
    const status:CourseUnitStatus=allEstablished?"mastered":hasEvidence?"learning":prereqsReady?"ready":"challenging";
    statuses.set(view.unit.id,status);
    const assessment=getUnitAssessmentProgress(view.unit.id,events);
    result.push({id:view.unit.id,order:view.unit.order,title:view.unit.title,canDo:view.canDo,status,mastery,evidenceCount:projections.reduce((sum,item)=>sum+item.evidenceCount,0),assessment});
  }
  return result;
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

function insertFirstExposureLessons(queue:StudyPrompt[],byId:Map<string,Awaited<ReturnType<typeof listMemoryTraces>>[number]>,extraPrompts:StudyPrompt[]=[]):StudyStep[]{
  const lessons={...foundationLessons,...vocabularyLessons,...pronunciationLessons,...grammarCourseLessons,...conjugationLessons};
  const promptByTrace=new Map([...allPrompts(),...extraPrompts].map((prompt)=>[traceIdFor(prompt),prompt]));
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

export function isApplicationPromptReady(prompt:StudyPrompt,traceIds:ReadonlySet<string>):boolean{
  if(prompt.primaryTarget.kind==="grammar"||prompt.primaryTarget.kind==="sentence")return isGrammarCoursePromptReady(prompt,traceIds);
  if(prompt.primaryTarget.kind==="lexeme"){
    const isPrivate=prompt.cueFamily.startsWith("private-");
    const meaning=isPrivate
      ?"lexeme:"+prompt.primaryTarget.id+":meaning_recognition:private-written-to-meaning"
      :"lexeme:"+prompt.primaryTarget.id+":meaning_recognition:written-to-meaning";
    if(prompt.skill==="reading"||prompt.skill==="audio_recognition"||prompt.skill==="form_selection")return traceIds.has(meaning);
    if(prompt.skill==="active_use"){
      if(isPrivate){
        const privateReading="lexeme:"+prompt.primaryTarget.id+":reading:private-word-to-reading";
        return traceIds.has(meaning)&&(traceIds.has(privateReading)||!prompt.cueFamily.includes("reading"));
      }
      const reading="lexeme:"+prompt.primaryTarget.id+":reading:word-to-reading";return traceIds.has(meaning)&&traceIds.has(reading);
    }
    return true;
  }
  if(prompt.cueFamily==="sokuon-audio-discrimination")return traceIds.has("kana:hiragana-small-tsu:reading:sokuon-reading");
  if(prompt.cueFamily==="katakana-sokuon-audio-discrimination")return traceIds.has("kana:katakana-small-tsu:reading:sokuon-reading");
  if(prompt.cueFamily==="long-vowel-audio-discrimination")return traceIds.has("kana:hiragana-あ:recognition:kana-to-sound")&&traceIds.has("kana:hiragana-ば:recognition:kana-to-sound");
  if(prompt.cueFamily==="moraic-n-audio-discrimination")return traceIds.has("kana:hiragana-ん:recognition:kana-to-sound");
  const target=prompt.primaryTarget.id;
  if(target==="hiragana-small-tsu")return traceIds.has("kana:hiragana-small-tsu:reading:sokuon-reading");
  if(target==="katakana-small-tsu")return traceIds.has("kana:katakana-small-tsu:reading:sokuon-reading");
  if(target==="katakana-long-vowel-mark")return traceIds.has("kana:katakana-long-vowel-mark:reading:long-vowel-reading");
  return traceIds.has(prompt.primaryTarget.kind+":"+target+":recognition:kana-to-sound");
}

function isListeningPrompt(prompt:StudyPrompt):boolean{return prompt.skill==="audio_recognition"||prompt.skill==="listening"||Boolean(prompt.audio);}
function isDue(prompt:StudyPrompt,byId:Map<string,Awaited<ReturnType<typeof listMemoryTraces>>[number]>,now:Date):boolean{
  const trace=byId.get(traceIdFor(prompt));return Boolean(trace)&&new Date(trace!.card.due).getTime()<=now.getTime();
}
function dueAt(prompt:StudyPrompt,byId:Map<string,Awaited<ReturnType<typeof listMemoryTraces>>[number]>):number{return new Date(byId.get(traceIdFor(prompt))?.card.due??"9999-12-31T00:00:00Z").getTime();}
function slots(queue:StudyPrompt[]):number{return Math.max(0,MAX_QUEUE_SIZE-queue.length);}
function addUnique(queue:StudyPrompt[],items:readonly StudyPrompt[]):void{for(const item of items){if(queue.length>=MAX_QUEUE_SIZE)break;if(!queue.some((existing)=>existing.id===item.id))queue.push(item);}}
function pendingMinedVocabulary(events:Awaited<ReturnType<typeof listStudyEvents>>):StudyPrompt[]{
  const latestMine=new Map<string,string>();
  const latestGraded=new Map<string,string>();
  for(const event of events){
    if(event.primaryTarget?.kind!=="lexeme")continue;
    if(event.activity==="mining"){
      const prior=latestMine.get(event.primaryTarget.id);
      if(!prior||prior<event.occurredAt)latestMine.set(event.primaryTarget.id,event.occurredAt);
    }
    if(event.skillDimension==="meaning_recognition"&&["correct","incorrect","partial","revealed"].includes(event.result??"")){
      const prior=latestGraded.get(event.primaryTarget.id);
      if(!prior||prior<event.occurredAt)latestGraded.set(event.primaryTarget.id,event.occurredAt);
    }
  }
  return [...latestMine.entries()]
    .filter(([id,at])=>!latestGraded.get(id)||latestGraded.get(id)!<at)
    .sort((a,b)=>b[1].localeCompare(a[1]))
    .map(([id])=>vocabularyMeaningPrompts.find((prompt)=>prompt.primaryTarget.id===id))
    .filter((prompt):prompt is StudyPrompt=>Boolean(prompt));
}

function selectBalancedApplications(prompts:StudyPrompt[],limit:number):StudyPrompt[]{
  const selected:StudyPrompt[]=[];const targets=new Set<string>();
  const preferredSkills=["audio_recognition","reading","listening","form_selection","active_use"] as const;
  for(const skill of preferredSkills){
    const candidate=prompts.find((prompt)=>prompt.skill===skill&&!targets.has(prompt.primaryTarget.kind+":"+prompt.primaryTarget.id));
    if(candidate){selected.push(candidate);targets.add(candidate.primaryTarget.kind+":"+candidate.primaryTarget.id);}
    if(selected.length>=limit)return selected;
  }
  for(const prompt of prompts){
    const key=prompt.primaryTarget.kind+":"+prompt.primaryTarget.id;
    if(selected.includes(prompt)||targets.has(key))continue;
    selected.push(prompt);targets.add(key);if(selected.length>=limit)return selected;
  }
  for(const prompt of prompts){if(selected.includes(prompt))continue;selected.push(prompt);if(selected.length>=limit)break;}
  return selected;
}
function uniqueSkillPrompts(prompts:StudyPrompt[]):StudyPrompt[]{const seen=new Set<string>();return prompts.filter((prompt)=>{const key=entityKey(prompt.primaryTarget,prompt.skill);if(seen.has(key))return false;seen.add(key);return true;});}
function projectionsFor(prompts:StudyPrompt[],state:LearnerState){return prompts.map((prompt)=>state.mastery[entityKey(prompt.primaryTarget,prompt.skill)]).filter((value)=>value!==undefined);}
function scoreFor(prompts:StudyPrompt[],state:LearnerState):number{if(!prompts.length)return 0;return prompts.reduce((sum,prompt)=>sum+(state.mastery[entityKey(prompt.primaryTarget,prompt.skill)]?.estimate??0),0)/prompts.length;}
function gradedEvents(events:Awaited<ReturnType<typeof listStudyEvents>>,kind:"kana"|"lexeme"|"grammar"|"sentence"){return events.filter((event)=>event.primaryTarget?.kind===kind&&["correct","incorrect","partial","revealed"].includes(event.result??""));}
function accuracyFor(events:ReturnType<typeof gradedEvents>):number{if(!events.length)return 0;return events.filter((event)=>event.result==="correct").length/events.length;}
function meanConfidence(projections:ReturnType<typeof projectionsFor>,expected:number):number{if(!expected)return 0;return projections.reduce((sum,item)=>sum+item.confidence,0)/expected;}
function matureCount(projections:ReturnType<typeof projectionsFor>):number{return projections.filter((item)=>item.estimate>=0.72&&item.confidence>=0.35).length;}
function gradeFor(result:"correct"|"incorrect"):ReviewGrade{return result==="correct"?"good":"again";}
export function traceIdFor(prompt:StudyPrompt):string{return prompt.primaryTarget.kind+":"+prompt.primaryTarget.id+":"+prompt.skill+":"+prompt.cueFamily;}

export const buildFoundationQueue=buildTodayQueue;
export const getFoundationStudySummary=getStudySummary;
export const getFoundationMasterySummary=getKanaMasterySummary;
export type FoundationStudySummary=StudySummary;
export type FoundationMasterySummary=KanaMasterySummary;
