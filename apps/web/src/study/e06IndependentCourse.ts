import type {StudyEvent} from "@thiepn/domain";
import {isStudyLesson,type StudyLesson,type StudyPrompt,type StudyStep} from "@thiepn/study-player";
import {coreContent} from "../coreContent";
import {grammarContext,grammarLessons} from "./grammarCourse";
import {E02_AVAILABLE_SCENES,e02ReviewPrompts} from "./a1ExcellenceCourse";
import {E03_MAPPED,e03ReviewPrompts} from "./a2ExcellenceCourse";
import {E04_MAPPED,e04ReviewPrompts} from "./a2ExcellenceAdvancedCourse";
import {E06_CASES,type E06Case} from "./e06IndependentCases";
import {e08ByCase,type E08Extension} from "./e08ContextExtensions";
import {E09_BY_CASE,type E09CaseDepth} from "./e09CommunicationDepth";
import {e09RepairCueFor,type E09RepairCue} from "./e09MisconceptionRepairs";
import {E11_BY_CASE,type E11PracticalTransfer} from "./e11PracticalTransfer";
import {E10_DAILY_STAGES,E10_DELAYED_GROUPS,e10StageById,type E10StageId,type E10StageProgress,type E10DelayedId,type E10DelayedProgress} from "./e10DailyStages";

const PREFIX="e06-cumulative-";
const ORIGINAL="thiepn-original";
const DELAY_MS=20*60*60*1000;
type Cohort=E06Case["anchor"]["cohort"];
type Stage="encounter"|"understand"|"communicate"|"recall"|"independent"|"delayed";
export type E06Status="unstarted"|"needs-prerequisite"|"learning"|"waiting"|"ready"|"reviewed";
interface Anchor {
  unitId:string;canDoId:string;canDo:string;cohort:Cohort;sceneId:string;
  sourcePrompts:readonly StudyPrompt[];
}
export interface E06CaseProgress {
 id:string;title:string;objective:string;level:"A1"|"A2";anchorCohort:Cohort;anchorSceneId:string;
 canDoId:string|null;canonicalUnitId:string|null;canDo:string|null;
 status:E06Status;sourceListening:boolean;sourceReading:boolean;prerequisiteReady:boolean;
 correct:number;required:number;attempts:number;unscoredWriting:number;unscoredSpeaking:number;
 firstDraftSubmitted:boolean;revisedDraftSubmitted:boolean;contextProblemsCorrect:number;
 e11ListeningPractised:boolean;e11ReadingPractised:boolean;e11WritingSubmitted:boolean;e12RevisedWritingSubmitted:boolean;
 e09Correct:number;e09Required:number;e09DelayedCorrect:number;e09DelayedRequired:number;
 delayedCorrect:number;delayedRequired:number;availableAt?:string;
 dailyStages:E10StageProgress[];nextDailyStage:E10StageId|null;
 delayedStages:E10DelayedProgress[];nextDelayedStage:E10DelayedId|null;
}
export interface E06Overview {
 cases:E06CaseProgress[];total:number;linked:number;prerequisiteReady:number;
 active:number;waiting:number;ready:number;reviewed:number;unlinked:number;
 nextId:string|null;nextDelayedId:string|null;
}
const unitById=new Map(coreContent.courseUnits.map(u=>[u.id,u]));
const canDoById=new Map(coreContent.canDos.map(c=>[c.id,c]));
const canonicalA1=new Map(E02_AVAILABLE_SCENES.map(s=>[s.id,s.unitId]));
const e03ByScene=new Map(E03_MAPPED.map(b=>[b.scene.id,b.unit.id]));
const e04ByScene=new Map(E04_MAPPED.map(b=>[b.scene.id,b.unit.id]));
const promptsByCohort:Record<Cohort,readonly StudyPrompt[]>={
  e02:e02ReviewPrompts,e03:e03ReviewPrompts,e04:e04ReviewPrompts
};
function anchorOf(s:E06Case):Anchor|null{
 const {cohort,sceneId}=s.anchor;
 const unitId=cohort==="e02"?canonicalA1.get(sceneId):cohort==="e03"?e03ByScene.get(sceneId):e04ByScene.get(sceneId);
 if(!unitId)return null;
 const unit=unitById.get(unitId);
 if(!unit||!unit.sourceIds.length)return null;
 const canDo=canDoById.get(unit.canDoId);
 if(!canDo||!canDo.sourceIds.length)return null;
 if(s.level==="A1"&&unit.level!=="A1")return null;
 if(s.level==="A2"&&!["A2","A2.1","A2.2"].includes(unit.level))return null;
 const sourcePrompts=promptsByCohort[cohort].filter(p=>
  p.primaryTarget.kind==="can_do"&&p.primaryTarget.id===canDo.id&&
  p.eventMetadata?.[cohort+"SceneId"]===sceneId&&
  p.eventMetadata?.[cohort+"UnitId"]===unitId);
 if(!sourcePrompts.length)return null;
 return {unitId:unit.id,canDoId:canDo.id,canDo:canDo.statement,cohort,sceneId,sourcePrompts};
}
export const E06_LINKED_CASES=E06_CASES.filter(s=>anchorOf(s)!==null);
export const E06_UNLINKED_CASES=E06_CASES.filter(s=>anchorOf(s)===null)
 .map(s=>({id:s.id,title:s.title,level:s.level,anchor:s.anchor}));
function getCase(id:string):E06Case{
 const c=E06_CASES.find(s=>s.id===id);
 if(!c)throw Error("E06_UNKNOWN_CASE:"+id);
 return c;
}
function getLinked(id:string):{s:E06Case;anchor:Anchor}{
 const s=getCase(id),anchor=anchorOf(s);
 if(!anchor)throw Error("E06_NO_VERIFIED_CAN_DO_LINK:"+id);
 return {s,anchor};
}
function lesson(s:E06Case,key:string,title:string,body:string,
 examples:StudyLesson["examples"]=[],a?:Anchor):StudyLesson{
 return {kind:"lesson",id:PREFIX+s.id+"-"+key,title,body,examples,
  contextId:PREFIX+s.id,sourceLabel:a?
  "Original THIEPN communication · "+ORIGINAL+" · linked source "+a.unitId+" (alignment inherited; no new certification)":
  "Original THIEPN reading only · "+ORIGINAL+" · no validated canonical Can-do",
  ...(a?{facts:[{label:"Existing Can-do used for practice",value:a.canDo}]}:{})};
}
function metadata(s:E06Case,a:Anchor,stage:Stage,extra:Record<string,unknown>={}):Record<string,unknown>{
 return {e06:true,e06CaseId:s.id,e06Stage:stage,e06SourceCohort:a.cohort,
  e06SourceSceneId:a.sceneId,e06UnitId:a.unitId,e06CanDoId:a.canDoId,
  originalSourceId:ORIGINAL,explicitLevel:s.level==="A1"?"A1":"A2 (provisional A2.1/A2.2 instructional position)",
  accreditedCefrVerdict:false,...extra};
}
function shuffled(answer:string,wrong:readonly [string,string],seed:number):string[]{
 const result=[...wrong];result.splice(seed%3,0,answer);return result;
}
function choice(s:E06Case,a:Anchor,key:string,stage:Stage,question:string,answer:string,
 wrong:readonly [string,string],wrongExplanations:readonly [string,string],
 skill:"listening"|"comprehension"|"form_selection",audio?:string):StudyPrompt{
 return {id:PREFIX+s.id+"-"+key,primaryTarget:{kind:"can_do",id:a.canDoId},
  skill,cueFamily:PREFIX+s.id+"-"+key,promptType:"choice",
  instruction:audio?"Listen without reading Japanese first.":"Answer using the current situation, not a previous model.",
  prompt:question,promptLanguage:audio?"en":"ja",
  choices:shuffled(answer,wrong,s.id.length+key.length),
  acceptedAnswers:[answer],displayAnswer:answer,
  explanation:"Look for who does what, when, and under which condition. "+(
   stage==="delayed"?s.transfer.correction:stage==="encounter"?"Compare the spoken information with the options.":"Use details from the original dialogue or notice."),
  speechSynthesisText:audio,speechSynthesisLanguage:audio?"ja-JP":undefined,
  sourceId:ORIGINAL,contentVersion:coreContent.version,contextId:PREFIX+s.id,
  languageActivity:audio?"listening":"reading",
  activity:stage==="delayed"?"assessment":"review",
  eventMetadata:metadata(s,a,stage,{
   e06Task:"controlled",e06FoilFeedback:[
     {response:wrong[0],feedback:wrongExplanations[0]},
     {response:wrong[1],feedback:wrongExplanations[1]}
   ],
   ...(audio?{audioKind:"device-speech-synthesis",nativeRecording:false}:{})
  })};
}
function typed(s:E06Case,a:Anchor,key:string,stage:Stage,
 question:string,answers:readonly string[],correction:string):StudyPrompt{
 return {id:PREFIX+s.id+"-"+key,primaryTarget:{kind:"can_do",id:a.canDoId},
  skill:"production",cueFamily:PREFIX+s.id+"-"+key,promptType:"typed",
  instruction:"Produce a bounded original Japanese expression without choices.",
  prompt:question,promptLanguage:"en",placeholder:"日本語で入力してください",
  acceptedAnswers:[...answers],displayAnswer:answers[0]??"",explanation:correction,
  answerNormalization:"japanese",sourceId:ORIGINAL,contentVersion:coreContent.version,
  contextId:PREFIX+s.id,activity:stage==="delayed"?"assessment":"review",
  languageActivity:"writing",eventMetadata:metadata(s,a,stage,{
   e06Task:"bounded-typed",notFreeWritingAssessment:true})};
}
function open(s:E06Case,a:Anchor,speech:boolean):StudyPrompt{
 const spec=speech?s.independent.speaking:s.independent.writing;
 const terms=speech?s.independent.speakingChecks:s.independent.writingChecks;
 const base={
  id:PREFIX+s.id+(speech?"-speak":"-write"),
  primaryTarget:{kind:"can_do" as const,id:a.canDoId},
  skill:speech?"production" as const:"writing_quality" as const,
  cueFamily:PREFIX+s.id+(speech?"-speech-draft":"-writing-draft"),
  prompt:spec,promptLanguage:"en" as const,
  instruction:speech?"Role-play in your own words. The transcript is not pronunciation grading.":
   "Write a connected response using your own facts, reasons and a polite request.",
  placeholder:"自分の日本語で答えてください",
  acceptedAnswers:[],displayAnswer:terms.join(" / "),requiredTerms:[...terms],minimumCharacters:s.level==="A1"?15:35,
  explanation:"Self-revision: "+s.independent.revision+
   " Automated checks detect structural features only. Meaning, adequacy, naturalness and pronunciation are not graded.",
  answerNormalization:"japanese" as const,contextId:PREFIX+s.id,
  sourceId:ORIGINAL,contentVersion:coreContent.version,
  languageActivity:speech?"spoken_production" as const:"writing" as const,
  activity:speech?"speaking" as const:"writing" as const,
  eventMetadata:metadata(s,a,"independent",{nonAuthoritative:true,schedulerExcluded:true,
   independentCompetenceVerified:false,acousticScore:false,structuralOnly:true})};
 return speech?{...base,promptType:"speech"}:{...base,promptType:"textarea"};
}
function e08Choice(s:E06Case,a:Anchor,key:string,
  question:string,answer:string,foils:readonly [string,string],
  reasons:readonly [string,string],audio?:string,delayed=false):StudyPrompt{
 return {
  ...choice(s,a,key,delayed?"delayed":"understand",question,answer,foils,reasons,
    audio?"listening":"comprehension",audio),
  instruction:audio?
   "E08: Listen to a different conversation before reading its transcript.":
   "E08: Read the independently authored notice. Distinguish stated facts from assumptions.",
  eventMetadata:metadata(s,a,delayed?"delayed":"understand",{
    e08:true,e08Task:key,e08SourceScene:s.anchor.sceneId,
    e06Task:"controlled",e06FoilFeedback:[
      {response:foils[0],feedback:reasons[0]},
      {response:foils[1],feedback:reasons[1]}
    ],
    ...(audio?{audioKind:"device-speech-synthesis",nativeRecording:false}:{})
  })
 };
}
function e08ContextPrompts(s:E06Case,a:Anchor,x:E08Extension):StudyPrompt[]{
 const dialogue=x.dialogue.map(t=>t.speaker+"： "+t.ja).join(" ");
 return [
  e08Choice(s,a,"e08-context-listen",x.evidence.question,x.evidence.answer,
    x.evidence.foils,x.evidence.reasons,dialogue),
  e08Choice(s,a,"e08-context-read",x.notice.ja+"\n\n"+x.decision.question,x.decision.answer,
    x.decision.foils,x.decision.reasons)
 ];
}
function e08RevisionPrompt(s:E06Case,a:Anchor,x:E08Extension):StudyPrompt{
 const baseId=PREFIX+s.id+"-write";
 return {
  id:PREFIX+s.id+"-e08-second-draft",
  primaryTarget:{kind:"can_do",id:a.canDoId},
  skill:"writing_quality",cueFamily:PREFIX+s.id+"-e08-revision",
  promptType:"textarea",instruction:"SECOND DRAFT · Rewrite the same response after checking its facts, audience and politeness.",
  prompt:x.revision.secondDraftTask+"\nAudience: "+x.revision.audience+
    "\nRevision checks:\n"+x.revision.contentChecks.map(([key,test])=>key+" — "+test).join("\n"),
  promptLanguage:"en",placeholder:"二回目の文を書いてください…",
  acceptedAnswers:[],displayAnswer:"Private revision draft · no automatic model answer",
  requiredTerms:[],minimumCharacters:s.level==="A1"?20:45,
  explanation:"This is a learner-owned revision, not an automatically validated Japanese essay. "+
    x.revision.modelPitfall+" "+x.revision.politeness,
  answerNormalization:"japanese",sourceId:ORIGINAL,contentVersion:coreContent.version,
  contextId:PREFIX+s.id,activity:"writing",languageActivity:"writing",
  eventMetadata:metadata(s,a,"independent",{
    e08:true,e08DraftStage:"revision",e08RevisionOf:baseId,
    e08RevisionChecks:x.revision.contentChecks.map(([heading,question,fix])=>({heading,question,fix})),
    e08Task:"independent-second-draft",nonAuthoritative:true,
    schedulerExcluded:true,structuralOnly:true,semanticScore:false,
    accreditedCefrVerdict:false
  })
 };
}
function e08SpeakingFollowUp(s:E06Case,a:Anchor,x:E08Extension):StudyPrompt{
 return {
  id:PREFIX+s.id+"-e08-roleplay",
  primaryTarget:{kind:"can_do",id:a.canDoId},
  skill:"production",cueFamily:PREFIX+s.id+"-e08-speech-transfer",
  promptType:"speech",instruction:"Unscored follow-up: respond to a different person and changed practical constraint.",
  prompt:x.revision.speakingFollowUp,promptLanguage:"en",
  acceptedAnswers:[],displayAnswer:"Your own Japanese speech transcript; no acoustic model",
  requiredTerms:[],minimumCharacters:s.level==="A1"?8:18,
  explanation:"Compare the content, courtesy and practical constraints yourself. A browser transcript cannot prove correct pronunciation, semantic adequacy or CEFR level.",
  contextId:PREFIX+s.id,sourceId:ORIGINAL,contentVersion:coreContent.version,
  activity:"speaking",languageActivity:"spoken_interaction",
  eventMetadata:metadata(s,a,"independent",{
    e08:true,e08Task:"different-role-speaking",nonAuthoritative:true,
    schedulerExcluded:true,acousticScore:false,semanticScore:false,structuralOnly:true
  })
 };
}
function e08TransferPrompts(s:E06Case,a:Anchor,x:E08Extension):StudyPrompt[]{
 const d=x.delayed;
 const common:[string,string]=[d.contrast,d.contrast];
 return [
  e08Choice(s,a,"e08-delayed-listen",d.question,d.answer,d.foils,common,d.spoken,true),
  e08Choice(s,a,"e08-delayed-read",d.reading+"\n\n"+d.readingQuestion,
    d.readingAnswer,d.readingFoils,common,undefined,true)
 ];
}
function e09Choice(s:E06Case,a:Anchor,key:string,question:string,correct:string,foils:readonly [string,string],
 reasons:readonly [string,string],audio?:string,delayed=false):StudyPrompt{
 const stage=delayed?"delayed":"understand";
 const original=choice(s,a,key,stage,question,correct,foils,reasons,
  audio?"listening":"comprehension",audio);
 return {
  ...original,
  instruction:audio?
   "E09 · Listen to the new multi-speaker Japanese situation. The transcript is revealed after your response.":
   "E09 · Use only what the independent written source actually confirms.",
  explanation:"Context-dependent comprehension. Correct detail: "+correct+
    ". "+(delayed?"Unseen transfer uses different speakers and facts.":"Compare the source and the assumption in the distractor."),
  eventMetadata:metadata(s,a,stage,{
   e09:true,e09CaseId:s.id,e09Task:key,
   e06Task:"controlled",e06FoilFeedback:[
    {response:foils[0],feedback:reasons[0]},
    {response:foils[1],feedback:reasons[1]}
   ],
   ...(audio?{audioKind:"device-speech-synthesis",nativeRecording:false}:{})
  })
 };
}
function e09ContextPrompts(s:E06Case,a:Anchor,d:E09CaseDepth):StudyPrompt[]{
 const dialogue=d.speakers.map(t=>t.name+"： "+t.ja).join(" ");
 return [
  e09Choice(s,a,"e09-dialogue-listen",d.listening.question,d.listening.answer,
   d.listening.wrong,d.listening.why,dialogue),
  e09Choice(s,a,"e09-notice-read",d.reading.ja+"\n\n"+d.readingCheck.question,
   d.readingCheck.answer,d.readingCheck.wrong,d.readingCheck.why)
 ];
}
function e09TransferPrompts(s:E06Case,a:Anchor,d:E09CaseDepth):StudyPrompt[]{
 const t=d.delayed;
 return [
  e09Choice(s,a,"e09-delayed-listen",t.question,t.answer,t.wrong,t.why,t.speech,true),
  e09Choice(s,a,"e09-delayed-read",t.notice+"\n\n"+t.readQuestion,
   t.readAnswer,t.readWrong,t.readWhy,undefined,true)
 ];
}
function e09RepairPrompt(s:E06Case,a:Anchor,cue:E09RepairCue):StudyPrompt{
 const isListening=cue.skill==="listening";
 const correctCue="e09-"+(isListening?"dialogue-listen":"notice-read");
 const key="e09-repair-"+cue.skill;
 const base=choice(s,a,key,"understand",isListening?cue.question:cue.japanese+"\n\n"+cue.question,
    cue.answer,cue.wrong,cue.reasons,
    isListening?"listening":"comprehension",isListening?cue.japanese:undefined);
 return {
   ...base,
   instruction:"Correct a specific E09 misunderstanding using an unfamiliar but related example.",
   explanation:cue.explanation,
   eventMetadata:metadata(s,a,"understand",{
     e09Repair:true,e09OriginalPromptId:PREFIX+s.id+"-"+correctCue,
     e09CaseId:s.id,e09RepairSkill:cue.skill,
     e06FoilFeedback:[
       {response:cue.wrong[0],feedback:cue.reasons[0]},
       {response:cue.wrong[1],feedback:cue.reasons[1]}
     ],
     schedulerExcluded:true,nonAuthoritative:true,
     accreditedCefrVerdict:false,
     ...(isListening?{audioKind:"device-speech-synthesis",nativeRecording:false}:{})
   })
 };
}
function e09UnscoredTransfer(s:E06Case,a:Anchor,d:E09CaseDepth):StudyPrompt{
 return {
  id:PREFIX+s.id+"-e09-original-response",
  primaryTarget:{kind:"can_do",id:a.canDoId},skill:"writing_quality",
  cueFamily:PREFIX+s.id+"-e09-written-transfer",promptType:"textarea",
  instruction:"Independent different-person writing · no semantic auto-grade",
  prompt:d.production.firstProblem+"\nWrite for: "+d.production.newAudience+
   "\nBefore submitting, check:\n"+d.production.selfCheck.join("\n"),
  promptLanguage:"en",placeholder:"自分の日本語で伝えてください…",
  acceptedAnswers:[],displayAnswer:"Your own original response; content is self-reviewed",
  requiredTerms:[],minimumCharacters:s.level==="A1"?20:45,
  explanation:"Original self-check and revision: "+d.production.revisionFocus+
   " Automated length, term or transcription checks do not establish naturalness or comprehension.",
  sourceId:ORIGINAL,contentVersion:coreContent.version,contextId:PREFIX+s.id,
  activity:"writing",languageActivity:"writing",
  eventMetadata:metadata(s,a,"independent",{
    e09:true,e09Task:"independent-written-transfer",
    nonAuthoritative:true,schedulerExcluded:true,semanticScore:false,
    structuralOnly:true,accreditedCefrVerdict:false
  })
 };
}

/* Optional original source-linked transfer: these prompts are not graded for FSRS. */
function e11IndependentWriting(s:E06Case,a:Anchor,t:E11PracticalTransfer):StudyPrompt{
 return {
  id:PREFIX+s.id+"-e11-original-letter",
  primaryTarget:{kind:"can_do",id:a.canDoId},
  skill:"writing_quality",cueFamily:PREFIX+s.id+"-e11-letter",
  promptType:"textarea",instruction:"Optional independent Japanese message · unscored self-revision",
  prompt:"Write to: "+t.writingAudience+"\nSituation: "+t.setting+
   "\nWhat you must communicate: "+t.pragmaticDecision+
   "\nUse the original audience/fact/politeness checklist to revise your message.",
  promptLanguage:"en",placeholder:"自分の日本語で書いてください…",
  acceptedAnswers:[],displayAnswer:"Your own independent message; no automatic language grade",
  requiredTerms:[],minimumCharacters:s.level==="A1"?20:40,
  explanation:"Review audience and factual accuracy yourself. "+t.grammar.function+
    " Avoid: "+t.grammar.mistake,
  sourceId:ORIGINAL,contentVersion:coreContent.version,contextId:PREFIX+s.id,
  activity:"writing",languageActivity:"writing",
  eventMetadata:metadata(s,a,"independent",{
   e11:true,e11CaseId:s.id,e11Task:"independent-letter",e11Audience:t.writingAudience,
   e11WritingChecks:t.writingRevision.map(([heading,question,repair])=>({heading,question,repair})),
   nonAuthoritative:true,schedulerExcluded:true,semanticScore:false,
   structuralOnly:true,accreditedCefrVerdict:false
  })
 };
}
/**
 * Second learner-owned E11 draft, never a new graded cue.
 * Retains the original case/Can-do authority while using a distinct response ID.
 */
function e12RevisedWriting(s:E06Case,a:Anchor,t:E11PracticalTransfer):StudyPrompt{
 const first=e11IndependentWriting(s,a,t);
 return {...first,
  id:PREFIX+s.id+"-e12-revised-letter",
  cueFamily:PREFIX+s.id+"-e12-letter-revision",
  instruction:"Optional second draft · revise your own Japanese, without automatic language grading",
  prompt:"Write a revised message for: "+t.writingAudience+"\nRecheck this situation: "+t.setting+
   "\nResolve: "+t.pragmaticDecision+"\nChange the text where necessary; ticking review questions is not a correctness verdict.",
  explanation:"You revised your own original message. Compare what changed in audience, facts and politeness; no semantic or CEFR score is assigned. "+t.grammar.function,
  eventMetadata:{...first.eventMetadata,e12:true,e11Task:"revised-letter",e12DraftStage:"revision"}
 };
}
function e11Practice(s:E06Case,a:Anchor,t:E11PracticalTransfer,mode:"listening"|"reading"):StudyPrompt{
 const x=mode==="listening"?t.listening:t.readingQuestion,spoken=mode==="listening";
 const key="e11-micro-"+mode;
 const original=choice(s,a,key,"understand",
    spoken?x.question:t.reading.ja+"\n\n"+x.question,x.answer,x.wrong,x.wrongWhy,
    spoken?"listening":"comprehension",
    spoken?t.turns.map(v=>v.speaker+"： "+v.ja).join(" "):undefined);
 return {...original,instruction:spoken?"Optional new spoken context; device speech synthesis, not native audio.":
    "Optional original reading: answer only from this new written notice.",
   explanation:t.grammar.function+" Watch out: "+t.grammar.mistake,
   eventMetadata:metadata(s,a,"understand",{
    e11:true,e11CaseId:s.id,e11Task:key,nonAuthoritative:true,schedulerExcluded:true,
    e11OriginalCanDo:a.canDoId,
    e06FoilFeedback:[{response:x.wrong[0],feedback:x.wrongWhy[0]},
      {response:x.wrong[1],feedback:x.wrongWhy[1]}],
    ...(spoken?{audioKind:"device-speech-synthesis",nativeRecording:false}:{})
   })
 };
}
function controlledPrompts(s:E06Case,a:Anchor):StudyPrompt[]{
 const audio=s.turns.map(t=>t.speaker+"： "+t.ja).join(" ");
 return [
  choice(s,a,"listen","encounter",s.listen.question,s.listen.answer,s.listen.wrong,s.listen.feedback,"listening",audio),
  choice(s,a,"read","understand",s.reading.ja+"\n\n"+s.read.question,s.read.answer,s.read.wrong,s.read.feedback,"comprehension"),
  choice(s,a,"negotiate","communicate",s.negotiate.question,s.negotiate.answer,s.negotiate.wrong,s.negotiate.feedback,"form_selection"),
  typed(s,a,"recall","recall",s.recall.question,s.recall.answers,s.recall.correction),
  ...(e08ByCase.has(s.id)?e08ContextPrompts(s,a,e08ByCase.get(s.id)!):[]),
  ...(E09_BY_CASE.has(s.id)?e09ContextPrompts(s,a,E09_BY_CASE.get(s.id)!):[])
 ];
}
function transferPrompts(s:E06Case,a:Anchor):StudyPrompt[]{
 const t=s.transfer,feedback:[t.correction,t.correction] as const;
 return [
  choice(s,a,"delayed-listen","delayed",t.question,t.answer,t.wrong,feedback,"listening",t.audio),
  choice(s,a,"delayed-read","delayed",t.reading+"\n\n"+t.readQuestion,t.readAnswer,t.readWrong,feedback,"comprehension"),
  typed(s,a,"delayed-recall","delayed",t.freeQuestion,t.freeAnswers,t.correction),
  ...(e08ByCase.has(s.id)?e08TransferPrompts(s,a,e08ByCase.get(s.id)!):[]),
  ...(E09_BY_CASE.has(s.id)?e09TransferPrompts(s,a,E09_BY_CASE.get(s.id)!):[])
 ];
}
export const e06ReviewPrompts:StudyPrompt[]=E06_LINKED_CASES.flatMap(s=>controlledPrompts(s,anchorOf(s)!));
const CONTROLLED_KEYS=["listen","read","negotiate","recall","e08-context-listen","e08-context-read","e09-dialogue-listen","e09-notice-read"];
const DELAYED_KEYS=["delayed-listen","delayed-read","delayed-recall","e08-delayed-listen","e08-delayed-read","e09-delayed-listen","e09-delayed-read"];
function isOriginalSourceEvidence(event:StudyEvent,a:Anchor):boolean{
 const raw=event.metadata;
 if(event.primaryTarget?.kind!=="can_do"||event.primaryTarget.id!==a.canDoId)return false;
 if(raw?.[a.cohort]!==true||raw?.[a.cohort+"SceneId"]!==a.sceneId||raw?.[a.cohort+"UnitId"]!==a.unitId)return false;
 if(raw?.e05Repair===true||raw?.e06===true||raw?.nonAuthoritative===true)return false;
 return a.sourcePrompts.some(p=>p.id===raw?.promptId);
}
function prerequisites(a:Anchor,events:readonly StudyEvent[]):{listening:boolean;reading:boolean;ready:boolean}{
 // A previously correct answer does not mask a more recent incorrect attempt.
 // Only the last event for EACH of the actual original source cue IDs counts.
 const latest=latestById(events.filter(event=>isOriginalSourceEvidence(event,a)));
 const passing=a.sourcePrompts.filter(prompt=>latest.get(prompt.id)?.result==="correct");
 const listening=passing.some(prompt=>["listening","audio_recognition"].includes(prompt.skill));
 const reading=passing.some(prompt=>["reading","comprehension","form_selection"].includes(prompt.skill));
 return {listening,reading,ready:listening&&reading};
}
function eventsFor(s:E06Case,a:Anchor,events:readonly StudyEvent[]):StudyEvent[]{
 return events.filter(e=>e.metadata?.e06===true&&e.metadata.e06CaseId===s.id&&
  e.metadata.e06UnitId===a.unitId&&e.primaryTarget?.kind==="can_do"&&
  e.primaryTarget.id===a.canDoId);
}
function latestById(events:readonly StudyEvent[]):Map<string,StudyEvent>{
 const out=new Map<string,StudyEvent>();
 for(const event of events){
  const key=typeof event.metadata?.promptId==="string"?event.metadata.promptId:"";
  if(!key)continue;
  const old=out.get(key);
  if(!old||Date.parse(event.occurredAt)>Date.parse(old.occurredAt))out.set(key,event);
 }
 return out;
}
/**
 * Derive stage completion exclusively from the ORIGINAL prompt IDs and this
 * account's StudyEvents. Textarea/speech stages count submission, not a grade.
 * Optional speaking never prevents next-stage access.
 */
function e10StageProgress(s:E06Case,a:Anchor|null,events:readonly StudyEvent[],
 sourceReady:boolean):{stages:E10StageProgress[];next:E10StageId|null}{
 if(!a)return {stages:[],next:null};
 const own=eventsFor(s,a,events),latest=latestById(own),prefix=PREFIX+s.id+"-";
 let unlocked=sourceReady;
 const stages:E10StageProgress[]=E10_DAILY_STAGES.map(stage=>{
   const submitted=stage.keys.filter(key=>{
     const e=latest.get(prefix+key);
     return stage.kind==="controlled"?e?.result==="correct":
       Boolean(e&&e.metadata?.nonAuthoritative===true);
   }).length;
   const attempted=stage.keys.some(key=>latest.has(prefix+key));
   const complete=submitted===stage.keys.length;
   const status:E10StageProgress["status"]=!unlocked?"locked":
     complete?"complete":attempted?"started":"ready";
   // Original source progression: fail closed if the current controlled or
   // unscored work is incomplete. Role-play is optional, not a gate.
   if(stage.kind!=="optional"&&!complete)unlocked=false;
   return {id:stage.id,title:stage.label,purpose:stage.purpose,
     kind:stage.kind,status,answered:submitted,required:stage.keys.length};
 });
 // When optional role-play is ready, prefer the later independent writing;
 // students may still select speech explicitly from Learn.
 const next=stages.find(p=>p.kind!=="optional"&&["ready","started"].includes(p.status))
   // An untouched optional speaking section stays discoverable in Learn; it
   // must not keep reappearing as mandatory daily work.
   ??stages.find(p=>p.kind==="optional"&&p.status==="started");
 return {stages,next:next?.id??null};
}
function e10DelayedProgress(s:E06Case,a:Anchor|null,events:readonly StudyEvent[],
 eligibleSince:number,now:Date):{stages:E10DelayedProgress[];next:E10DelayedId|null}{
 if(!a)return {stages:[],next:null};
 const latest=latestById(eventsFor(s,a,events)),pre=PREFIX+s.id+"-";
 const isEligible=Number.isFinite(eligibleSince)&&now.getTime()>=eligibleSince;
 // Old delayed answers remain in history, but only answers recorded after the
 // CURRENT eight-cue success boundary satisfy this exact spaced transfer.
 const current=(key:string)=>{
   const event=latest.get(pre+key);
   return event&&Number.isFinite(eligibleSince)&&Date.parse(event.occurredAt)>=eligibleSince?event:null;
 };
 let unlocked=isEligible;
 const stages:E10DelayedProgress[]=E10_DELAYED_GROUPS.map(group=>{
  const correct=group.keys.filter(key=>current(key)?.result==="correct").length;
  const complete=correct===group.keys.length;
  const attempted=group.keys.some(key=>Boolean(current(key)));
  const status:E10DelayedProgress["status"]=!unlocked?"locked":
    complete?"complete":attempted?"started":"ready";
  if(!complete)unlocked=false;
  return {id:group.id,title:group.label,purpose:group.purpose,status,
    correct,required:group.keys.length};
 });
 const next=stages.find(p=>["started","ready"].includes(p.status));
 return {stages,next:next?.id??null};
}
/**
 * For each required original cue use the FIRST successful submission AFTER its
 * most recent failure. Ordinary later correct FSRS retrieval does not postpone
 * transfer forever. A newer incorrect answer reopens that cue's requirement.
 * No extra clock/store is introduced; this is replayed from real StudyEvents.
 */
function controlledReadyAt(own:readonly StudyEvent[],prefix:string):number{
 const completedAt=CONTROLLED_KEYS.map(key=>{
  const answers=own.filter(e=>e.metadata?.promptId===prefix+key)
    .filter(e=>Number.isFinite(Date.parse(e.occurredAt)))
    .sort((a,b)=>Date.parse(a.occurredAt)-Date.parse(b.occurredAt));
  const lastFailure=answers.filter(e=>e.result==="incorrect"||e.result==="partial"||e.result==="revealed").at(-1);
  const boundary=lastFailure?Date.parse(lastFailure.occurredAt):Number.NEGATIVE_INFINITY;
  const success=answers.find(e=>e.result==="correct"&&Date.parse(e.occurredAt)>boundary);
  return success?Date.parse(success.occurredAt):NaN;
 });
 return completedAt.every(Number.isFinite)?Math.max(...completedAt):NaN;
}
export function getE06Overview(events:readonly StudyEvent[],now=new Date()):E06Overview{
 const cases=E06_CASES.map(s=>{
  const a=anchorOf(s),pr=a?prerequisites(a,events):{listening:false,reading:false,ready:false};
  const own=a?eventsFor(s,a,events):[];
  const by=latestById(own),prefix=PREFIX+s.id+"-";
  const ctrl=CONTROLLED_KEYS.map(k=>by.get(prefix+k));
  const correct=ctrl.filter(e=>e?.result==="correct").length;
  const firstComplete=correct===CONTROLLED_KEYS.length?controlledReadyAt(own,prefix):NaN;
  const due=Number.isFinite(firstComplete)?firstComplete+DELAY_MS:NaN;
  const delayedCorrect=DELAYED_KEYS.filter(k=>{
    const event=by.get(prefix+k);
    return event?.result==="correct"&&Number.isFinite(due)&&
      Date.parse(event.occurredAt)>=due;
  }).length;
  const daily=e10StageProgress(s,a,events,pr.ready);
  const controlledComplete=correct===CONTROLLED_KEYS.length&&Number.isFinite(due);
  const delayed=e10DelayedProgress(s,a,events,a&&pr.ready&&controlledComplete?due:NaN,now);
  // A previously completed delayed set cannot mask a *newer* source error.
  const status:E06Status=!a||!pr.ready?"needs-prerequisite":
    !controlledComplete?(!own.length?"unstarted":"learning"):
    delayedCorrect===DELAYED_KEYS.length?"reviewed":
    now.getTime()<due?"waiting":"ready";
  return {
   id:s.id,title:s.title,objective:s.objective,level:s.level,
   anchorCohort:s.anchor.cohort,anchorSceneId:s.anchor.sceneId,
   canDoId:a?.canDoId??null,canonicalUnitId:a?.unitId??null,canDo:a?.canDo??null,
   status,sourceListening:pr.listening,sourceReading:pr.reading,prerequisiteReady:pr.ready,
   correct,required:CONTROLLED_KEYS.length,
   attempts:own.filter(e=>e.metadata?.e06Stage!=="delayed"&&e.metadata?.nonAuthoritative!==true).length,
   unscoredWriting:own.filter(e=>e.metadata?.nonAuthoritative===true&&e.responseMode==="textarea").length,
   unscoredSpeaking:own.filter(e=>e.metadata?.nonAuthoritative===true&&e.responseMode==="speech").length,
   e11ListeningPractised:own.some(e=>e.metadata?.promptId===prefix+"e11-micro-listening"&&e.metadata?.e11===true&&e.metadata?.nonAuthoritative===true),
   e11ReadingPractised:own.some(e=>e.metadata?.promptId===prefix+"e11-micro-reading"&&e.metadata?.e11===true&&e.metadata?.nonAuthoritative===true),
   e11WritingSubmitted:own.some(e=>e.metadata?.promptId===prefix+"e11-original-letter"&&e.metadata?.e11===true&&e.metadata?.nonAuthoritative===true),
   e12RevisedWritingSubmitted:own.some(e=>e.metadata?.promptId===prefix+"e12-revised-letter"&&e.metadata?.e12===true&&e.metadata?.nonAuthoritative===true),
   firstDraftSubmitted:own.some(e=>e.metadata?.promptId===prefix+"write"&&e.metadata?.nonAuthoritative===true),
   revisedDraftSubmitted:own.some(e=>e.metadata?.promptId===prefix+"e08-second-draft"&&e.metadata?.nonAuthoritative===true),
   contextProblemsCorrect:["e08-context-listen","e08-context-read"].filter(k=>by.get(prefix+k)?.result==="correct").length,
   e09Correct:["e09-dialogue-listen","e09-notice-read"].filter(k=>by.get(prefix+k)?.result==="correct").length,
   e09Required:2,
   e09DelayedCorrect:["e09-delayed-listen","e09-delayed-read"].filter(k=>by.get(prefix+k)?.result==="correct").length,
   e09DelayedRequired:2,
   dailyStages:daily.stages,nextDailyStage:daily.next,
   delayedStages:delayed.stages,nextDelayedStage:delayed.next,
   delayedCorrect,delayedRequired:DELAYED_KEYS.length,
   ...(Number.isFinite(due)?{availableAt:new Date(due).toISOString()}: {})
  } satisfies E06CaseProgress;
 });
 const next=cases.find(c=>c.prerequisiteReady&&c.nextDailyStage!==null)??cases.find(c=>c.status==="unstarted"&&c.prerequisiteReady);
 return {cases,total:cases.length,linked:cases.filter(c=>c.canDoId!==null).length,
  prerequisiteReady:cases.filter(c=>c.prerequisiteReady).length,
  active:cases.filter(c=>c.status==="learning").length,
  waiting:cases.filter(c=>c.status==="waiting").length,
  ready:cases.filter(c=>c.status==="ready").length,
  reviewed:cases.filter(c=>c.status==="reviewed").length,
  unlinked:cases.filter(c=>c.canDoId===null).length,
  nextId:next?.id??null,nextDelayedId:cases.find(c=>c.status==="ready")?.id??null};
}
function previewLessons(s:E06Case):StudyLesson[]{
 const ext=e08ByCase.get(s.id),depth=E09_BY_CASE.get(s.id),micro=E11_BY_CASE.get(s.id);
 return [
  lesson(s,"preview-intro","Original cumulative communication · "+s.title,
   s.setting+" "+s.objective+" No verified canonical Can-do is linked to this capstone. Review the original situation without graded events."),
  lesson(s,"preview-dialogue","Dialogue and speaker intentions",
   "Read the original multi-turn exchange. Independent answers and other source skills cannot be graded here.",
   s.turns.map(t=>({expression:t.speaker+"： "+t.ja,note:t.en+" · "+t.purpose}))),
  lesson(s,"preview-text",s.reading.title,s.reading.en,
   [{expression:s.reading.ja,note:s.reading.en}]),
  ...(ext?[
   lesson(s,"preview-e08","An unfamiliar continuation · "+ext.focus,ext.why+" "+ext.culture,ext.dialogue.map(t=>({expression:t.speaker+"： "+t.ja,note:t.en+" · "+t.intention}))),
   lesson(s,"preview-e08-reading",ext.notice.title,ext.notice.en,[{expression:ext.notice.ja,note:ext.notice.en}]),
   lesson(s,"preview-e08-revision","A second draft · Self-directed",ext.revision.task+" "+ext.revision.secondDraftTask+" "+ext.revision.modelPitfall)
  ]:[]),
  ...(depth?[
   lesson(s,"preview-e09-dialogue","E09 · "+depth.title,depth.communicativeGoal,
      depth.speakers.map(t=>({expression:t.name+"： "+t.ja,note:t.meaning+" · "+t.intention}))),
   lesson(s,"preview-e09-reading",depth.reading.title,depth.reading.meaning,
      [{expression:depth.reading.ja,note:depth.reading.meaning}]),
   lesson(s,"preview-e09-grammar","Grammar and vocabulary in context",
      "These original notes are source-only while the canonical Can-do association remains unresolved.",
      [...depth.grammar.map(g=>({expression:g.expression,note:g.role+" · Avoid: "+g.misconception})),
       ...depth.vocabulary.map(v=>({expression:v.ja,note:v.meaning+" · "+v.contrast}))])
  ]:[]),
  ...(micro?[
    lesson(s,"e11-preview-dialogue","E11 source-only practice · "+micro.goal,
      "Original dialogue and written source remain available. Without a verified Can-do link no scored prompts are created. "+
      micro.setting,
      micro.turns.map(v=>({expression:v.speaker+"： "+v.ja,note:v.en+" · "+v.intent}))),
    lesson(s,"e11-preview-reading",micro.reading.title,micro.reading.en,
      [{expression:micro.reading.ja,note:micro.reading.en}]),
    lesson(s,"e11-preview-grammar","Precision in practical Japanese",
      micro.pragmaticDecision+" "+micro.grammar.function+" Avoid: "+micro.grammar.mistake,
      [...micro.vocabulary.map(v=>({expression:v.expression,note:v.meaning+" · "+v.contrast})),
       {expression:micro.grammar.pattern,note:micro.grammar.function}])
  ]:[]),
  lesson(s,"preview-revision","Independent self-revision",
   s.independent.writing+" "+s.independent.speaking+" "+s.independent.revision)
 ];
}
export function buildE06Preview(id:string):StudyStep[]{
 const s=getCase(id);
 if(anchorOf(s))throw Error("E06_PREVIEW_ONLY_FOR_UNLINKED:"+id);
 return previewLessons(s);
}
export function buildE06Journey(id:string,events:readonly StudyEvent[]):StudyStep[]{
 const {s,anchor:a}=getLinked(id);
 if(!prerequisites(a,events).ready)throw Error("E06_SOURCE_LISTENING_AND_TEXT_NOT_YET_PRACTISED:"+id);
 const [listen,read,negotiate,recall,secondListen,secondRead,thirdListen,thirdRead]=controlledPrompts(s,a);
 const ext=e08ByCase.get(s.id),depth=E09_BY_CASE.get(s.id),micro=E11_BY_CASE.get(s.id);
 const ownEvents=eventsFor(s,a,events);
 const recent=latestById(ownEvents);
 const previousContextListeningIncorrect=recent.get(PREFIX+s.id+"-e08-context-listen")?.result==="incorrect";
 const previousContextReadingIncorrect=recent.get(PREFIX+s.id+"-e08-context-read")?.result==="incorrect";
 const previousE09ListeningIncorrect=recent.get(PREFIX+s.id+"-e09-dialogue-listen")?.result==="incorrect";
 const previousE09ReadingIncorrect=recent.get(PREFIX+s.id+"-e09-notice-read")?.result==="incorrect";
 const previousFirst=ownEvents.filter(e=>e.metadata?.promptId===PREFIX+s.id+"-write"&&e.metadata?.nonAuthoritative===true&&typeof e.metadata.learnerResponse==="string")
  .sort((x,y)=>y.occurredAt.localeCompare(x.occurredAt))[0];
 const privateFirst=typeof previousFirst?.metadata?.learnerResponse==="string"?previousFirst.metadata.learnerResponse:"";
 // Only first drafts from this original case, its canonical source and the active
 // account's StudyEvents may be shown during optional E12 revision.
 const previousE11=ownEvents.filter(e=>e.metadata?.promptId===PREFIX+s.id+"-e11-original-letter"&&
   e.metadata?.e11===true&&e.metadata?.nonAuthoritative===true&&
   typeof e.metadata.learnerResponse==="string")
  .sort((x,y)=>y.occurredAt.localeCompare(x.occurredAt))[0];
 const privateE11=typeof previousE11?.metadata?.learnerResponse==="string"?previousE11.metadata.learnerResponse:"";
 const unit=unitById.get(a.unitId)!;
 const grammar=unit.grammarIds.slice(0,3).map(id=>grammarLessons[grammarContext(id)])
  .filter((l):l is StudyLesson=>Boolean(l));
 return [
  lesson(s,"set-up","Cumulative A1/A2 · "+s.title,
   "Goal: "+s.objective+". "+s.setting+
   " You have already answered a listening and reading/form task in its original lesson. Now use those skills in a longer exchange; audio uses device synthesis, not a native recording.",[],a),
  listen,
  lesson(s,"dialogue","Encounter · Check the dialogue",
   "Reveal the conversation only after the audio answer. Check each speaker's intention before reading the translation.",
   s.turns.map(t=>({expression:t.speaker+"： "+t.ja,note:t.en+" · Speaker goal: "+t.purpose})),a),
  read,
  lesson(s,"notice","Connected source reading · "+s.reading.title,
   "Check the new notice's conditions and compare them with the dialogue. You cannot infer unstated outcomes.",
   [{expression:s.reading.ja,note:s.reading.en}],a),
  ...grammar,
  lesson(s,"interact","Negotiate · Less prompting",
   "Use the interlocutor's actual constraint. Choose one appropriate response, then produce a full Japanese expression without options.",[],a),
  negotiate,recall,
  ...(ext&&secondListen&&secondRead?[
    lesson(s,"e08-change","A second real-world problem · "+ext.focus,
      ext.why+" First listen without reading the dialogue. This is newly authored contextual teaching, not a copied lesson.",[],a),
    ...(previousContextListeningIncorrect?[
      lesson(s,"e08-audio-misconception","Targeted listening repair · New attempt",
        "Your last answer to this exact audio task was incorrect. Listen for the relevant changed detail rather than recognizing one familiar word. "+
        ext.why,[
          {expression:"Distinction A",note:ext.evidence.reasons[0]},
          {expression:"Distinction B",note:ext.evidence.reasons[1]}
        ],a)
    ]:[]),
    secondListen,
    lesson(s,"e08-dialogue","Reveal the revised conversation · Speaker intentions",
      "The characters and practical constraint have changed. Identify what each person knows and what remains uncertain.",
      ext.dialogue.map(t=>({expression:t.speaker+"： "+t.ja,note:t.en+" · "+t.intention})),a),
    ...(previousContextReadingIncorrect?[
      lesson(s,"e08-reading-misconception","Targeted reading repair · Separate fact from assumption",
        "Your previous answer to this new notice did not match the source. Verify time, conditions, who made a promise and what remains unconfirmed.",[
          {expression:"Check the first alternative",note:ext.decision.reasons[0]},
          {expression:"Check the second alternative",note:ext.decision.reasons[1]}
        ],a)
    ]:[]),
    secondRead,
    lesson(s,"e08-reading","Independent practical notice · "+ext.notice.title,
      ext.notice.en+" Notice what is explicitly stated before inferring a recommendation.",
      [{expression:ext.notice.ja,note:ext.notice.en}],a),
    lesson(s,"e08-pragmatics","Grammar in use · Evidence and cultural appropriateness",
      ext.why+" "+ext.culture+" "+ext.revision.modelPitfall,[],a)
   ]:[]),
  ...(depth&&thirdListen&&thirdRead?[
    lesson(s,"e09-setup","Independent transfer · "+depth.title,
     depth.communicativeGoal+" Listen for the new problem before reading the dialogue. "+
     "You must distinguish an explicit confirmation from an assumption.",[],a),
    ...(previousE09ListeningIncorrect&&e09RepairCueFor(s.id,"listening")?[
      lesson(s,"e09-listening-repair","New speakers · Repair the missed listening distinction",
       "Your latest E09 dialogue response missed a specific distinction. First compare the two alternatives in a new short situation; this corrective answer will not alter FSRS mastery.",
       depth.grammar.slice(0,2).map(g=>({expression:g.expression,note:g.misconception})),a),
      e09RepairPrompt(s,a,e09RepairCueFor(s.id,"listening")!)
    ]:[]),
    thirdListen,
    lesson(s,"e09-conversation","Interpret the third original conversation",
     "Track who knows which facts, what remains unsettled and which request actually helps.",
     depth.speakers.map(t=>({expression:t.name+"： "+t.ja,note:t.meaning+" · Communicative intent: "+t.intention})),a),
    ...(previousE09ReadingIncorrect&&e09RepairCueFor(s.id,"reading")?[
      lesson(s,"e09-reading-repair","Changed notice · Repair the mistaken inference",
       "Your latest E09 source-notice answer did not match the written evidence. Read another original notice, then return to the original. This alternate response is practice, not new mastery.",
       depth.vocabulary.slice(0,2).map(v=>({expression:v.ja,note:v.contrast})),a),
      e09RepairPrompt(s,a,e09RepairCueFor(s.id,"reading")!)
    ]:[]),
    thirdRead,
    lesson(s,"e09-notice","Connected original source · "+depth.reading.title,
     "Compare the real notice with the dialogue. "+depth.reading.meaning,
     [{expression:depth.reading.ja,note:depth.reading.meaning}],a),
    lesson(s,"e09-vocabulary","Words and lexical contrasts that change the situation",
     "Contrast each pair in this particular situation, not as interchangeable translations.",
     depth.vocabulary.map(v=>({expression:v.ja,note:v.meaning+" · Contrast: "+v.contrast})),a),
    lesson(s,"e09-grammar","Pragmatic grammar · Meaning before pattern matching",
     "Read each construction in context. The explanation names the conversational function and a common misleading interpretation.",
     depth.grammar.map(g=>({expression:g.expression,note:g.role+" · Common mistake: "+g.misconception})),a)
   ]:[]),
  ...(micro?[
   lesson(s,"e11-setup","A new practical clarification · "+micro.goal,
      micro.setting+" Optional source-linked practice. No CEFR score is assigned.",[],a),
   e11Practice(s,a,micro,"listening"),
   lesson(s,"e11-dialogue","Reveal the conversational intentions",
      "First listen, then compare what was confirmed, proposed and still unknown.",
      micro.turns.map(v=>({expression:v.speaker+"： "+v.ja,note:v.en+" · "+v.intent})),a),
   e11Practice(s,a,micro,"reading"),
   lesson(s,"e11-notice",micro.reading.title,micro.reading.en,
      [{expression:micro.reading.ja,note:micro.reading.en}],a),
   lesson(s,"e11-contrasts","Precise grammar, vocabulary and register",
      micro.pragmaticDecision+" "+micro.grammar.function+" Common misreading: "+micro.grammar.mistake,
      [...micro.vocabulary.map(v=>({expression:v.expression,note:v.meaning+" · "+v.contrast})),
       {expression:micro.grammar.pattern,note:micro.grammar.function}],a),
   lesson(s,"e11-letter-coach","Write to the actual recipient · Revise deliberately",
     "Audience: "+micro.writingAudience+". "+micro.pragmaticDecision+
     " These prompts help you review, not certify, your own Japanese.",
     micro.writingRevision.map(([heading,question,repair])=>({expression:heading+" · "+question,note:repair})),a),
   e11IndependentWriting(s,a,micro),
   lesson(s,"e12-revision-coach","Revise the message, not just the checklist",
     "Write a second independent version for the same recipient. Compare factual constraints, intent and register with your own first message. A textual change does not certify correct Japanese.",
     [...micro.writingRevision.map(([heading,question,repair])=>({expression:heading+" · "+question,note:repair})),
       ...(privateE11?[{expression:"Your prior E11 first draft (private)",note:privateE11}]:[])],a),
   e12RevisedWriting(s,a,micro),
   lesson(s,"e11-speaking-prep","Prepare a considerate spoken follow-up",
     micro.spokenChallenge+" Practice aloud without submitting audio or claiming pronunciation mastery.",[],a)
  ]:[]),
  lesson(s,"production","Own the exchange · Independent writing and speaking",
   "Your original text and transcript are stored as unscored drafts only. Evaluate politeness, meaning and revision with the provided guidance; no synthetic pronunciation grade.",[],a),
  open(s,a,false),
  ...(ext?[
    lesson(s,"e08-revision-coach","Revise deliberately · First draft → Second draft",
      ext.revision.task+" Read the first draft against these content, audience and politeness checks. "+ext.revision.politeness,
      [...ext.revision.contentChecks.map(([name,question,fix])=>({expression:name+" · "+question,note:fix})),
       ...(privateFirst?[{expression:"Your prior submitted first draft (private)",note:privateFirst}]:[])],a),
    e08RevisionPrompt(s,a,ext),
    lesson(s,"e08-oral-transfer","Speak without reading the model",
      ext.revision.speakingFollowUp+" No speech transcript is an acoustic or pragmatic proficiency score.",[],a)
  ]:[]),
  open(s,a,true),
  ...(ext?[e08SpeakingFollowUp(s,a,ext)]:[]),
  ...(depth?[
    lesson(s,"e09-independent","New audience · Reuse the language, not the old facts",
      depth.production.newAudience+" · "+depth.production.firstProblem+" "+depth.production.revisionFocus,
      depth.production.selfCheck.map((check,i)=>({expression:"Self-check "+(i+1),note:check})),a),
    e09UnscoredTransfer(s,a,depth),
    lesson(s,"e09-followup","Different-role speaking · Self-directed",
      depth.production.followUp+" "+(micro?.spokenChallenge??"")+" This is a speaking practice suggestion; do not infer an acoustic or CEFR score.",[],a)
  ]:[]),
  lesson(s,"revise","Review your own output",
   s.independent.revision+" The next time, respond without copying the revealed dialogue.",[],a),
  lesson(s,"spaced-return","Independent later transfer",
   "The eight source-bound controlled prompts share the existing FSRS authority. Only after all eight latest results are correct and at least twenty hours have passed do seven different-context delayed tasks become available. Free writing and transcripts are unscored even when revised.",[],a)
 ];
}
/**
 * E09 continuation is a VIEW into the SAME native session, not another engine.
 * Uses original account-owned StudyEvents to choose a lesson boundary and
 * NEVER grades, marks as complete, schedules or inserts phantom prior steps.
 */
export function buildE06ContinuationJourney(id:string,events:readonly StudyEvent[]):StudyStep[]{
 const {s,anchor:a}=getLinked(id);
 const full=buildE06Journey(id,events);
 const recent=latestById(eventsFor(s,a,events));
 const pre=PREFIX+s.id+"-";
 const correct=(keys:readonly string[])=>keys.every(k=>recent.get(pre+k)?.result==="correct");
 const original=["listen","read","negotiate","recall"];
 const second=[...original,"e08-context-listen","e08-context-read"];
 const third=[...second,"e09-dialogue-listen","e09-notice-read"];
 const hasFirst=eventsFor(s,a,events).some(e=>e.metadata?.promptId===pre+"write"&&e.metadata?.nonAuthoritative===true);
 const hasSecond=eventsFor(s,a,events).some(e=>e.metadata?.promptId===pre+"e08-second-draft"&&e.metadata?.nonAuthoritative===true);
 const hasThirdResponse=eventsFor(s,a,events).some(e=>e.metadata?.promptId===pre+"e09-original-response"&&e.metadata?.nonAuthoritative===true);
 let lessonKey:string|null=null;
 let reason="";
 if(correct(third)){
   if(!hasFirst){lessonKey="production";reason="All eight controlled tasks have source-backed correct answers; continue with your independent first draft.";}
   else if(!hasSecond){lessonKey="e08-revision-coach";reason="Your first draft is recorded. Compare it and produce a changed second draft without automatic semantic grading.";}
   else if(!hasThirdResponse){lessonKey="e09-independent";reason="Both drafts are recorded. Apply what you learnt to another audience and a genuinely different problem.";}
   else {lessonKey="e09-followup";reason="Bounded answers and written transfer are already recorded. Continue unscored speaking and self-reflection.";}
 }else if(correct(second)){
   lessonKey="e09-setup";reason="Previous E06/E08 bounded cues are correct. Continue with a third independently authored listening and reading situation.";
 }else if(correct(original)){
   lessonKey="e08-change";reason="The original guided source cues are correct. Continue with a different conversation rather than replaying the first model.";
 }
 if(!lessonKey)return full;
 const at=full.findIndex(step=>isStudyLesson(step)&&step.id===pre+lessonKey);
 if(at<=0)return full;
 return [
  lesson(s,"e09-resume","Continue from your last source-backed learning stage",
   reason+" This does not award new credit to skipped earlier screens. Your original StudyEvents and FSRS remain authoritative. Open the full lesson from Learn whenever you want the earlier context.",[],a),
  ...full.slice(at)
 ];
}
/**
 * Slice the existing cumulative lesson; no prompt IDs or grading change.
 * A section starts at its original authored lesson boundary and stops BEFORE
 * the next stage. Explicit stage selection respects the actual source events.
 */
export function buildE06DailyStage(id:string,stageId:E10StageId,events:readonly StudyEvent[]):StudyStep[]{
 const {s,anchor:a}=getLinked(id);
 const stage=e10StageById(stageId);
 if(!stage)throw Error("E10_UNKNOWN_DAILY_STAGE:"+stageId);
 const progress=e10StageProgress(s,a,events,prerequisites(a,events).ready)
   .stages.find(p=>p.id===stageId);
 if(!progress||progress.status==="locked")throw Error("E10_STAGE_SOURCE_OR_PRIOR_STEP_NOT_READY:"+id+":"+stageId);
 const full=buildE06Journey(id,events);
 const base=PREFIX+s.id+"-";
 const start=full.findIndex(step=>isStudyLesson(step)&&step.id===base+stage.start);
 const end=stage.end===null?full.length:full.findIndex((step,i)=>
   i>start&&isStudyLesson(step)&&step.id===base+stage.end);
 if(start<0||end<0||end<=start)throw Error("E10_MISSING_ORIGINAL_STAGE_BOUNDARY:"+id+":"+stageId);
 return [
   lesson(s,"e10-"+stage.id+"-intro",stage.label+" · "+s.title,
     stage.purpose+" Today's section reuses the original lesson, source identity and prompts. "+
     "The next section uses actual saved StudyEvents; an unfinished session does not record invented completion. "+
     "Audio is device-synthesized, and independent drafts/speech are never semantic or acoustic grades.",[],a),
   ...full.slice(start,end)
 ];
}

/**
 * An optional short native listening/reading lesson. It is NOT a new review
 * engine or required prerequisite and cannot add CEFR mastery or FSRS cards.
 * Full original lessons preserve all historical teaching and the E11 material.
 */
export function buildE11OptionalSession(id:string,events:readonly StudyEvent[]):StudyStep[]{
 const {s,anchor:a}=getLinked(id);
 if(!E11_BY_CASE.has(id))throw Error("E11_ORIGINAL_TRANSFER_NOT_AUTHORED:"+id);
 if(!prerequisites(a,events).ready)throw Error("E11_SOURCE_LESSON_FIRST:"+id);
 const full=buildE06Journey(id,events),prefix=PREFIX+s.id+"-";
 const first=full.findIndex(step=>isStudyLesson(step)&&step.id===prefix+"e11-setup");
 const last=full.findIndex((step,i)=>i>first&&isStudyLesson(step)&&step.id===prefix+"production");
 if(first<0||last<=first)throw Error("E11_NATIVE_MICRO_LESSON_BOUNDARY_MISSING:"+id);
 return [
  lesson(s,"e11-optional-intro","Extra practice · "+s.title,
   "One original conversational misunderstanding and a separate everyday notice. "+
   "Answers offer specific correction, but are optional and deliberately excluded "+
   "from the authoritative eight-prompt controlled gate and FSRS schedule. "+
   "Audio is synthesized on your device.",[],a),
  ...full.slice(first,last)
 ];
}
export function buildE06NextDailyStage(id:string,events:readonly StudyEvent[]):StudyStep[]{
 const {s,anchor:a}=getLinked(id);
 const summary=e10StageProgress(s,a,events,prerequisites(a,events).ready);
 if(summary.next)return buildE06DailyStage(id,summary.next,events);
 if(!prerequisites(a,events).ready)throw Error("E10_SOURCE_PREREQUISITES_MISSING:"+id);
 return [
  lesson(s,"e10-no-work","Cumulative communication · no new bounded work due",
   "All required E10 short sections already have the relevant original saved evidence. "+
   "Your existing FSRS reviews and the twenty-hour delayed transfer remain separate. "+
   "Open the full original lesson from Learn to revisit dialogue, reading and grammar.",[],a)
 ];
}
/** Original delayed responses, exposed in short blocks without resetting spacing. */
export function buildE06DelayedStage(id:string,stageId:E10DelayedId,
 events:readonly StudyEvent[],now=new Date()):StudyStep[]{
 const {s,anchor:a}=getLinked(id);
 const group=E10_DELAYED_GROUPS.find(x=>x.id===stageId);
 if(!group)throw Error("E10_UNKNOWN_DELAYED_GROUP:"+stageId);
 const progress=getE06Overview(events,now).cases.find(c=>c.id===id);
 const status=progress?.delayedStages.find(x=>x.id===stageId)?.status;
 if(!status||status==="locked")throw Error("E10_DELAYED_SOURCE_OR_EARLIER_GROUP_NOT_READY:"+id+":"+stageId);
 const original=transferPrompts(s,a);
 const block=group.keys.map(k=>original.find(p=>p.id===PREFIX+s.id+"-"+k));
 if(block.some(p=>!p))throw Error("E10_MISSING_ORIGINAL_DELAYED_PROMPT:"+id+":"+stageId);
 return [
  lesson(s,"e10-delayed-"+stageId,group.label+" · "+s.title,
   group.purpose+" This small session uses the same original graded prompts, "+
   "latest StudyEvents and existing FSRS. No new clock or mastery certificate is created.",[],a),
  ...block.filter((p):p is StudyPrompt=>Boolean(p))
 ];
}
export function buildE06NextDelayedStage(id:string,events:readonly StudyEvent[],now=new Date()):StudyStep[]{
 const {s,anchor:a}=getLinked(id);
 const progress=getE06Overview(events,now).cases.find(c=>c.id===id);
 if(progress?.nextDelayedStage)return buildE06DelayedStage(id,progress.nextDelayedStage,events,now);
 if(progress?.status==="reviewed")return [
  lesson(s,"e10-delayed-complete","All delayed communication checks have recorded correct answers",
   "The original seven changed-context checks have saved evidence. Continue your "+
   "existing FSRS reviews or open a full original teaching session from Learn; no additional graded work is invented.",[],a)
 ];
 throw Error("E10_DELAYED_SPACING_OR_EARLIER_GROUP_NOT_READY:"+id+":"+a.unitId);
}
export function buildE06Delayed(id:string,events:readonly StudyEvent[],now=new Date()):StudyStep[]{
 const {s,anchor:a}=getLinked(id);
 const progress=getE06Overview(events,now).cases.find(c=>c.id===id);
 if(progress?.status!=="ready"&&progress?.status!=="reviewed")throw Error("E06_DELAYED_NOT_READY:"+id);
 return [
  lesson(s,"delayed-intro","Cumulative transfer · "+s.title,
   "The details and task constraints have changed. Listen to the new spoken situation, read its separate notice, and retrieve a new expression without answer choices. Scores remain bounded original StudyEvents.",[],a),
  ...transferPrompts(s,a)
 ];
}
