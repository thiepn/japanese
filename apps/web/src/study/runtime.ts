import { entityKey } from "@thiepn/domain";
import {projectUX1Engagement,type UX1Engagement} from "./ux1Engagement";
export type {UX1Engagement} from "./ux1Engagement";
import { getJapaneseDeviceId } from "../deviceIdentity";
import { replayStudyEvents, type LearnerState } from "@thiepn/learner-engine";
import { getMemoryTrace, listMemoryTraces, listStudyEvents, saveStudyReview } from "@thiepn/local-db";
import { createFsrsScheduler, type ReviewGrade } from "@thiepn/scheduler";
import { createStudyEvent, type StudyPrompt, type StudyStep } from "@thiepn/study-player";
import { pronunciationLessons, pronunciationPerceptionPrompts } from "./audioPrompts";
import { coreContent } from "../coreContent";
import { FOUNDATION_TOTAL_ITEMS, foundationApplicationPrompts, foundationLessons, foundationPrompts } from "./foundationPrompts";
import { a1Course, allGrammarCoursePrompts, courseUnitPrompts, courseUnitSession, grammarCourseLessons, isGrammarCoursePromptReady, selectNewCoursePrompts } from "./grammarCourse";
import { conjugationLessons, conjugationPrompts } from "./conjugation";
import {
  buildA1MilestoneAssessment,buildB1MilestoneAssessment,buildB2MilestoneAssessment,buildC1FoundationAssessment,buildUnitAssessment,getA1MilestoneProgress,getB1MilestoneProgress,getB2MilestoneProgress,getC1FoundationProgress,getUnitAssessmentProgress,
  type MilestoneAssessmentProgress,type UnitAssessmentProgress
} from "./assessment";
import { VOCABULARY_TOTAL, vocabularyApplicationPrompts, vocabularyLessons, vocabularyMeaningPrompts } from "./vocabulary";
import { buildPrivateVocabularyPrompts } from "./privateVocabulary";
import { buildPrivateSentencePrompts } from "./privateSentences";
import { productivePracticeSession,productiveTaskSession,productivePrompts } from "./productivePractice";
import { lexicalChunkLessons,lexicalChunkMeaningPrompts,lexicalChunkActivePrompts,lexicalChunkTransferPrompts,lexicalChunkPrompts,lexicalFluencySession } from "./lexicalFluency";
import { buildNextRealWorldChainSession,buildP9QualificationSession } from "./realWorldPerformance";
import { c1DiscoursePrompts,c1FoundationPractice } from "./c1Foundation";
import {buildE01Journey,buildE01DelayedJourney,e01ReviewPrompts,getE01Progress,type E01Progress} from "./a1Excellence";
export type {E01Progress} from "./a1Excellence";
import {buildE02Journey,buildE02DelayedJourney,buildE02Preview,e02ReviewPrompts,getE02Overview,type E02Overview} from "./a1ExcellenceCourse";
export type {E02Overview} from "./a1ExcellenceCourse";
import {buildE03Journey,buildE03DelayedJourney,buildE03Preview,e03ReviewPrompts,getE03Overview,type E03Overview} from "./a2ExcellenceCourse";
export type {E03Overview} from "./a2ExcellenceCourse";
import {buildE04Journey,buildE04Delayed,buildE04Preview,e04ReviewPrompts,getE04Overview,type E04Overview} from "./a2ExcellenceAdvancedCourse";
export type {E04Overview} from "./a2ExcellenceAdvancedCourse";
import {buildE05RepairJourney,getE05Evidence,type E05Evidence} from "./e05AdaptiveRecall";
export type {E05Evidence} from "./e05AdaptiveRecall";
import {buildE06Journey,buildE11OptionalSession,buildE06NextDailyStage,buildE06DailyStage,buildE06Preview,buildE06Delayed,buildE06NextDelayedStage,buildE06DelayedStage,getE06Overview,e06ReviewPrompts,type E06Overview} from "./e06IndependentCourse";
import {buildE13PracticalMix,type E13PracticeMode} from "./e13PracticalMixer";
import {buildE14HandoffSession,eligibleE14Cases,projectE14Review,type E14HandoffMode,type E14HandoffReview} from "./e14ListeningHandoff";
export type {E14HandoffMode,E14HandoffReview} from "./e14ListeningHandoff";
import {buildE15SourceRecovery,type E15Focus} from "./e15ContextRecovery";
export type {E15Focus} from "./e15ContextRecovery";
export type {E13PracticeMode} from "./e13PracticalMixer";
import type {E10StageId,E10DelayedId} from "./e10DailyStages";
export type {E10StageId,E10DelayedId} from "./e10DailyStages";
export type {E06Overview} from "./e06IndependentCourse";
import { buildC1SynthesisSession } from "./c1Synthesis";

export const GUEST_ACCOUNT_ID="00000000-0000-4000-8000-000000000001";
export let DEVELOPMENT_ACCOUNT_ID=GUEST_ACCOUNT_ID;
export function setDevelopmentAccountId(accountId:string):void{
  const next=accountId.trim();
  if(!next)throw new Error("ACCOUNT_ID_REQUIRED");
  DEVELOPMENT_ACCOUNT_ID=next;
}
export function getDevelopmentAccountId():string{
  return DEVELOPMENT_ACCOUNT_ID;
}
export const DEVELOPMENT_DEVICE_ID=getJapaneseDeviceId();

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
export interface LexicalFluencySummary {
  overall:number; recognition:number; activeUse:number; registerTransfer:number; confidence:number; accuracy:number;
  matureSkills:number; expectedSkills:number; evidenceCount:number; totalChunks:number; transferPrompts:number;
}
export type CourseUnitStatus="ready"|"challenging"|"learning"|"mastered";
export interface CourseUnitProgress {
  id:string; order:number; title:string; level:string; canDo:string; status:CourseUnitStatus; mastery:number; evidenceCount:number;
  assessment:UnitAssessmentProgress;
}
export type A1MilestoneProgress=MilestoneAssessmentProgress;
export type B1MilestoneProgress=MilestoneAssessmentProgress;
export type B2MilestoneProgress=MilestoneAssessmentProgress;
export type C1FoundationProgress=MilestoneAssessmentProgress;

function foundationApplicationPool():StudyPrompt[]{
  return [...pronunciationPerceptionPrompts,...foundationApplicationPrompts,...vocabularyApplicationPrompts,...conjugationPrompts,...lexicalChunkPrompts,...productivePrompts,...c1DiscoursePrompts];
}
function allPrompts():StudyPrompt[]{
  return [...foundationPrompts,...vocabularyMeaningPrompts,...foundationApplicationPool(),...allGrammarCoursePrompts,...e01ReviewPrompts,...e02ReviewPrompts,...e03ReviewPrompts,...e04ReviewPrompts,...e06ReviewPrompts];
}

export async function buildTodayQueue(now=new Date()):Promise<StudyStep[]>{
  const [traces,events,privateSet,privateSentences]=await Promise.all([listMemoryTraces(DEVELOPMENT_ACCOUNT_ID),listStudyEvents(DEVELOPMENT_ACCOUNT_ID),buildPrivateVocabularyPrompts(),buildPrivateSentencePrompts()]);
  const byId=new Map(traces.map((trace)=>[trace.id,trace]));
  const traceIds=new Set(byId.keys());
  const privatePrompts=[...privateSet.meaning,...privateSet.application,...privateSentences];
  const all=[...allPrompts(),...privatePrompts];
  const due=all.filter((prompt)=>isDue(prompt,byId,now)).sort((a,b)=>dueAt(a,byId)-dueAt(b,byId));
  if(due.length>=MAX_DUE_PER_SESSION)return insertFirstExposureLessons(due.slice(0,MAX_QUEUE_SIZE),byId,privatePrompts);

  const unseenKana=foundationPrompts.filter((prompt)=>!byId.has(traceIdFor(prompt)));
  const unseenVocabulary=[...vocabularyMeaningPrompts,...privateSet.meaning].filter((prompt)=>!byId.has(traceIdFor(prompt)));
  const readyApplication=[...foundationApplicationPool(),...privateSet.application,...privateSentences].filter((prompt)=>!byId.has(traceIdFor(prompt))&&isApplicationPromptReady(prompt,traceIds));
  const readyCourse=selectNewCoursePrompts(traceIds,COURSE_ITEMS_PER_SESSION);
  const mined=pendingMinedVocabulary(events,privateSet.meaning).slice(0,2);
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

export async function buildE11MicroSession(id:string):Promise<StudyStep[]>{return buildE11OptionalSession(id,await listStudyEvents(DEVELOPMENT_ACCOUNT_ID));}
export async function buildE13PracticalSession(caseIds:readonly string[],mode:E13PracticeMode):Promise<StudyStep[]>{
  const owner=DEVELOPMENT_ACCOUNT_ID;
  const events=await listStudyEvents(owner);
  if(DEVELOPMENT_ACCOUNT_ID!==owner)throw Error("E13_WORKSPACE_CHANGED_DURING_BUILD");
  return buildE13PracticalMix(caseIds,mode,events);
}
export async function buildE14HandoffPractice(caseId:string,mode:E14HandoffMode):Promise<StudyStep[]>{
  const owner=DEVELOPMENT_ACCOUNT_ID;
  const events=await listStudyEvents(owner);
  if(DEVELOPMENT_ACCOUNT_ID!==owner)throw Error("E14_WORKSPACE_CHANGED_DURING_BUILD");
  return buildE14HandoffSession(caseId,mode,owner,events);
}
export async function getE14PrivateHandoffReviews():Promise<E14HandoffReview[]>{
  const owner=DEVELOPMENT_ACCOUNT_ID;
  const events=await listStudyEvents(owner);
  if(DEVELOPMENT_ACCOUNT_ID!==owner)throw Error("E14_WORKSPACE_CHANGED_DURING_READ");
  const eligible=eligibleE14Cases(getE06Overview(events).cases);
  return eligible.map(c=>projectE14Review(c.id,owner,events));
}
export async function buildE15RecoverySession(caseId:string,focus:E15Focus):Promise<StudyStep[]>{
  const owner=DEVELOPMENT_ACCOUNT_ID;
  const events=await listStudyEvents(owner);
  if(DEVELOPMENT_ACCOUNT_ID!==owner)throw Error("E15_WORKSPACE_CHANGED_DURING_BUILD");
  return buildE15SourceRecovery(caseId,focus,owner,events);
}
export async function buildE06Session(id:string):Promise<StudyStep[]>{return buildE06NextDailyStage(id,await listStudyEvents(DEVELOPMENT_ACCOUNT_ID));}
export async function buildE10DailyStageSession(id:string,stageId:E10StageId):Promise<StudyStep[]>{return buildE06DailyStage(id,stageId,await listStudyEvents(DEVELOPMENT_ACCOUNT_ID));}
export async function buildE06FullSession(id:string):Promise<StudyStep[]>{return buildE06Journey(id,await listStudyEvents(DEVELOPMENT_ACCOUNT_ID));}
export async function buildE06PreviewSession(id:string):Promise<StudyStep[]>{return buildE06Preview(id);}
export async function buildE06DelayedSession(id:string):Promise<StudyStep[]>{return buildE06NextDelayedStage(id,await listStudyEvents(DEVELOPMENT_ACCOUNT_ID));}
export async function buildE10DelayedStageSession(id:string,stageId:E10DelayedId):Promise<StudyStep[]>{return buildE06DelayedStage(id,stageId,await listStudyEvents(DEVELOPMENT_ACCOUNT_ID));}
export async function buildE06FullDelayedSession(id:string):Promise<StudyStep[]>{return buildE06Delayed(id,await listStudyEvents(DEVELOPMENT_ACCOUNT_ID));}
export async function getE06Evidence():Promise<E06Overview>{return getE06Overview(await listStudyEvents(DEVELOPMENT_ACCOUNT_ID));}
export async function buildE05RepairSession():Promise<StudyStep[]>{return buildE05RepairJourney(await listStudyEvents(DEVELOPMENT_ACCOUNT_ID));}
export async function getE05Dashboard():Promise<E05Evidence>{return getE05Evidence(await listStudyEvents(DEVELOPMENT_ACCOUNT_ID));}
export async function buildE04Session(sceneId:string):Promise<StudyStep[]>{return buildE04Journey(sceneId);}
export async function buildE04PreviewSession(sceneId:string):Promise<StudyStep[]>{return buildE04Preview(sceneId);}
export async function buildE04DelayedSession(sceneId:string):Promise<StudyStep[]>{return buildE04Delayed(sceneId,await listStudyEvents(DEVELOPMENT_ACCOUNT_ID));}
export async function getE04Evidence():Promise<E04Overview>{return getE04Overview(await listStudyEvents(DEVELOPMENT_ACCOUNT_ID));}
export async function buildE03PreviewSession(sceneId:string):Promise<StudyStep[]>{return buildE03Preview(sceneId);}
export async function buildE03Session(sceneId:string):Promise<StudyStep[]>{return buildE03Journey(sceneId);}
export async function buildE03DelayedSession(sceneId:string):Promise<StudyStep[]>{return buildE03DelayedJourney(sceneId,await listStudyEvents(DEVELOPMENT_ACCOUNT_ID));}
export async function getE03Evidence():Promise<E03Overview>{return getE03Overview(await listStudyEvents(DEVELOPMENT_ACCOUNT_ID));}
export async function buildE02PreviewSession(sceneId:string):Promise<StudyStep[]>{return buildE02Preview(sceneId);}
export async function buildE02Session(sceneId:string):Promise<StudyStep[]>{return buildE02Journey(sceneId);}
export async function buildE02DelayedSession(sceneId:string):Promise<StudyStep[]>{return buildE02DelayedJourney(sceneId,await listStudyEvents(DEVELOPMENT_ACCOUNT_ID));}
export async function getE02Evidence():Promise<E02Overview>{return getE02Overview(await listStudyEvents(DEVELOPMENT_ACCOUNT_ID));}
export async function buildE01Session():Promise<StudyStep[]>{return buildE01Journey();}
export async function buildE01DelayedSession():Promise<StudyStep[]>{return buildE01DelayedJourney(await listStudyEvents(DEVELOPMENT_ACCOUNT_ID));}
export async function getE01Evidence():Promise<E01Progress>{return getE01Progress(await listStudyEvents(DEVELOPMENT_ACCOUNT_ID));}

export async function buildCourseUnitSession(unitId:string):Promise<StudyStep[]>{
  return courseUnitSession(unitId);
}
export async function buildUnitAssessmentSession(unitId:string):Promise<StudyStep[]>{
  return buildUnitAssessment(unitId);
}
export async function buildA1MilestoneSession():Promise<StudyStep[]>{
  return buildA1MilestoneAssessment();
}
export async function buildB1MilestoneSession():Promise<StudyStep[]>{
  return buildB1MilestoneAssessment();
}
export async function buildB2MilestoneSession():Promise<StudyStep[]>{
  return buildB2MilestoneAssessment();
}
export async function buildC1FoundationSession():Promise<StudyStep[]>{
  return buildC1FoundationAssessment();
}
export async function buildC1FoundationPractice(limit=12):Promise<StudyStep[]>{
  return c1FoundationPractice(limit);
}
export async function buildP13C1SynthesisSession(packId:string):Promise<StudyStep[]>{
  return buildC1SynthesisSession(packId);
}
export async function buildProductivePractice(mode:"writing"|"speaking"):Promise<StudyStep[]>{
  return productivePracticeSession(mode);
}
export async function buildProductiveTaskPractice(taskId:string):Promise<StudyStep[]>{
  return productiveTaskSession(taskId);
}
export async function buildP9RealWorldChainSession(chainId:string):Promise<StudyStep[]>{
  return buildNextRealWorldChainSession(chainId);
}
export async function buildP9RealWorldQualificationSession(limit=10):Promise<StudyStep[]>{
  return buildP9QualificationSession(limit);
}
export async function buildLexicalFluencyPractice(limit=12):Promise<StudyStep[]>{
  const prompts=lexicalFluencySession(limit);
  const steps:StudyStep[]=[];const seen=new Set<string>();
  for(const prompt of prompts){
    const context=prompt.contextId;
    if(context&&!seen.has(context)){const lesson=lexicalChunkLessons[context];if(lesson){steps.push(lesson);seen.add(context);}}
    steps.push(prompt);
  }
  return steps;
}
export async function getA1MilestoneAssessmentProgress():Promise<MilestoneAssessmentProgress>{
  return getA1MilestoneProgress(await listStudyEvents(DEVELOPMENT_ACCOUNT_ID));
}
export async function getB1MilestoneAssessmentProgress():Promise<MilestoneAssessmentProgress>{
  return getB1MilestoneProgress(await listStudyEvents(DEVELOPMENT_ACCOUNT_ID));
}
export async function getB2MilestoneAssessmentProgress():Promise<MilestoneAssessmentProgress>{
  return getB2MilestoneProgress(await listStudyEvents(DEVELOPMENT_ACCOUNT_ID));
}
export async function getC1FoundationAssessmentProgress():Promise<MilestoneAssessmentProgress>{
  return getC1FoundationProgress(await listStudyEvents(DEVELOPMENT_ACCOUNT_ID));
}

/** Motivation is derived from the same owner-owned events, never a separate store. */
export async function getUX1Engagement(now=new Date()):Promise<UX1Engagement>{
 const owner=DEVELOPMENT_ACCOUNT_ID;
 const events=await listStudyEvents(owner);
 if(DEVELOPMENT_ACCOUNT_ID!==owner)throw new Error("UX1_ENGAGEMENT_WORKSPACE_CHANGED");
 return projectUX1Engagement(events,now);
}

// Derive the daily counter from durable, account-scoped events. React component
// state must never be the authority for progress displayed after a reload.
export async function getCompletedTodayCount(now=new Date()):Promise<number>{
  const today=now.toDateString();
  const events=await listStudyEvents(DEVELOPMENT_ACCOUNT_ID);
  return events.filter((event)=>{
    if(event.result!=="correct"&&event.result!=="incorrect")return false;
    const occurredAt=new Date(event.occurredAt);
    return !Number.isNaN(occurredAt.getTime())&&occurredAt.toDateString()===today;
  }).length;
}

export async function getStudySummary(now=new Date()):Promise<StudySummary>{
  const [traces,privateSet,privateSentences]=await Promise.all([listMemoryTraces(DEVELOPMENT_ACCOUNT_ID),buildPrivateVocabularyPrompts(),buildPrivateSentencePrompts()]);
  const byId=new Map(traces.map((trace)=>[trace.id,trace]));
  const traceIds=new Set(byId.keys());
  const privatePrompts=[...privateSet.meaning,...privateSet.application,...privateSentences];
  const all=[...allPrompts(),...privatePrompts];
  const due=all.filter((prompt)=>isDue(prompt,byId,now)).length;
  const learnedKana=foundationPrompts.filter((prompt)=>byId.has(traceIdFor(prompt))).length;
  const allMeaning=[...vocabularyMeaningPrompts,...privateSet.meaning];
  const learnedVocabulary=allMeaning.filter((prompt)=>byId.has(traceIdFor(prompt))).length;
  const ready=[...foundationApplicationPool(),...privateSet.application,...privateSentences].filter((prompt)=>!byId.has(traceIdFor(prompt))&&isApplicationPromptReady(prompt,traceIds));
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
  const transfer=expected.filter((prompt)=>prompt.skill==="form_selection");
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
  const [events,privateSentences]=await Promise.all([listStudyEvents(DEVELOPMENT_ACCOUNT_ID),buildPrivateSentencePrompts()]);
  const state=replayStudyEvents(events);
  const expected=uniqueSkillPrompts([...allGrammarCoursePrompts.filter((prompt)=>prompt.primaryTarget.kind==="sentence"),...privateSentences]);
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


export async function getLexicalFluencySummary():Promise<LexicalFluencySummary>{
  const events=await listStudyEvents(DEVELOPMENT_ACCOUNT_ID);
  const state=replayStudyEvents(events);
  const expected=uniqueSkillPrompts(lexicalChunkPrompts);
  const recognition=expected.filter((prompt)=>prompt.skill==="meaning_recognition");
  const active=expected.filter((prompt)=>prompt.skill==="active_use");
  const transfer=expected.filter((prompt)=>prompt.skill==="form_selection");
  const projections=projectionsFor(expected,state);
  const graded=events.filter((event)=>event.primaryTarget?.kind==="lexical_chunk"&&["correct","incorrect","partial","revealed"].includes(event.result??""));
  return {
    overall:scoreFor(expected,state),recognition:scoreFor(recognition,state),activeUse:scoreFor(active,state),registerTransfer:scoreFor(transfer,state),
    confidence:meanConfidence(projections,expected.length),
    accuracy:graded.length?graded.filter((event)=>event.result==="correct").length/graded.length:0,
    matureSkills:matureCount(projections),expectedSkills:expected.length,evidenceCount:graded.length,totalChunks:lexicalChunkMeaningPrompts.length,transferPrompts:lexicalChunkTransferPrompts.length
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
    result.push({id:view.unit.id,order:view.unit.order,title:view.unit.title,level:view.unit.level,canDo:view.canDo,status,mastery,evidenceCount:projections.reduce((sum,item)=>sum+item.evidenceCount,0),assessment});
  }
  return result;
}

const pendingReviews=new Map<string,Promise<void>>();
export function recordStudyAnswer(input:{prompt:StudyPrompt;response:string;result:"correct"|"incorrect";responseTimeMs:number}):Promise<void>{
  const accountId=DEVELOPMENT_ACCOUNT_ID;
  const traceId=traceIdFor(input.prompt);
  const key=accountId+":"+traceId;
  const previous=pendingReviews.get(key)??Promise.resolve();
  const attempt=previous.catch(()=>{}).then(async()=>{
    const existing=await getMemoryTrace(accountId,traceId);
    const now=new Date().toISOString();
    const base=existing??scheduler.create({id:traceId,userId:accountId,entity:input.prompt.primaryTarget,skillDimension:input.prompt.skill,cueFamily:input.prompt.cueFamily},now);
    const event=createStudyEvent({id:crypto.randomUUID(),userId:accountId,deviceId:DEVELOPMENT_DEVICE_ID,prompt:input.prompt,response:input.response,occurredAt:now,responseTimeMs:input.responseTimeMs,baseRevision:base.revision});
    const nonAuthoritative=input.prompt.eventMetadata?.nonAuthoritative===true;
    if(nonAuthoritative){event.result="skipped";event.metadata={...event.metadata,structuralResult:input.result,nonAuthoritative:true};}
    const trace=nonAuthoritative||input.prompt.eventMetadata?.schedulerExcluded===true?undefined:scheduler.review(base,{grade:gradeFor(input.result),reviewedAt:now});
    await saveStudyReview(event,trace);
  });
  pendingReviews.set(key,attempt);
  void attempt.finally(()=>{if(pendingReviews.get(key)===attempt)pendingReviews.delete(key);}).catch(()=>{});
  return attempt;
}

function insertFirstExposureLessons(queue:StudyPrompt[],byId:Map<string,Awaited<ReturnType<typeof listMemoryTraces>>[number]>,extraPrompts:StudyPrompt[]=[]):StudyStep[]{
  const lessons={...foundationLessons,...vocabularyLessons,...pronunciationLessons,...grammarCourseLessons,...conjugationLessons,...lexicalChunkLessons};
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
  if(prompt.primaryTarget.kind==="lexical_chunk"){
    const chunk=coreContent.lexicalChunks.find((item)=>item.id===prompt.primaryTarget.id);
    const requiredLevel=chunk?.level==="C1"?"C1":"B2";
    const levelReady=[...traceIds].some((trace)=>requiredLevel==="C1"
      ?trace.startsWith("grammar:c1-")||trace.startsWith("sentence:p12-")||trace.startsWith("production_task:p12-")
      :trace.startsWith("grammar:b2-")||trace.startsWith("sentence:b2-")||trace.startsWith("production_task:b2-"));
    if(!levelReady)return false;
    if(prompt.skill==="meaning_recognition")return true;
    if(prompt.skill==="active_use"||prompt.skill==="form_selection")return traceIds.has("lexical_chunk:"+prompt.primaryTarget.id+":meaning_recognition:chunk-to-meaning");
    return true;
  }
  if(prompt.primaryTarget.kind==="production_task"){
    const targetGrammarIds=Array.isArray(prompt.eventMetadata?.targetGrammarIds)?prompt.eventMetadata!.targetGrammarIds.filter((id):id is string=>typeof id==="string"):[];
    return targetGrammarIds.length===0||targetGrammarIds.every((id)=>[...traceIds].some((trace)=>trace.startsWith("grammar:"+id+":")));
  }
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
function pendingMinedVocabulary(events:Awaited<ReturnType<typeof listStudyEvents>>,extraMeaningPrompts:StudyPrompt[]=[]):StudyPrompt[]{
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
    .map(([id])=>[...vocabularyMeaningPrompts,...extraMeaningPrompts].find((prompt)=>prompt.primaryTarget.id===id))
    .filter((prompt):prompt is StudyPrompt=>Boolean(prompt));
}

function selectBalancedApplications(prompts:StudyPrompt[],limit:number):StudyPrompt[]{
  const selected:StudyPrompt[]=[];const targets=new Set<string>();
  const preferredSkills=["audio_recognition","reading","listening","form_selection","active_use","production","writing_quality"] as const;
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
