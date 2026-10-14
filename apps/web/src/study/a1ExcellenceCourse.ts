import type {StudyEvent} from "@thiepn/domain";
import type {StudyLesson,StudyPrompt,StudyStep} from "@thiepn/study-player";
import {coreContent} from "../coreContent";
import {grammarContext,grammarLessons} from "./grammarCourse";
import {E02_SCENES,type E02Scene} from "./a1ExcellenceScenes";

const PREFIX="a1-e02-";
const VERSION=coreContent.version;
const SOURCE="thiepn-original";
export type E02Stage="encounter"|"understand"|"discover"|"practice"|"communicate"|"independent"|"delayed";
export type E02State="not_started"|"learning"|"waiting"|"ready"|"reviewed";
export interface E02SceneProgress{
  id:string;title:string;unitId:string;canDoId:string;canDo:string;state:E02State;
  completedControlled:number;requiredControlled:number;attempts:number;unscoredDrafts:number;
  delayedCorrect:number;delayedTotal:number;reviewAvailableAt?:string;
}
export interface E02Overview{
  scenes:E02SceneProgress[];
  nextSceneId:string|null;
  started:number;readyForDelay:number;delayedReviewed:number;total:number;
}
const UNIT_MAP=new Map(coreContent.courseUnits.map(unit=>[unit.id,unit]));
const CAN_DO_MAP=new Map(coreContent.canDos.map(canDo=>[canDo.id,canDo]));
// Fail closed: no duplicate or invented canonical identities.
export const E02_AVAILABLE_SCENES:readonly E02Scene[]=E02_SCENES.filter(scene=>{
  const unit=UNIT_MAP.get(scene.unitId);
  return unit?.level==="A1"&&CAN_DO_MAP.has(unit.canDoId);
});
function requireScene(id:string):E02Scene{
  const scene=E02_AVAILABLE_SCENES.find(s=>s.id===id);
  if(!scene)throw Error("E02_UNKNOWN_OR_UNMAPPED_A1_SCENE:"+id);
  return scene;
}
function meta(scene:E02Scene,stage:E02Stage,extra:Record<string,unknown>={}):Record<string,unknown>{
  const unit=UNIT_MAP.get(scene.unitId)!;
  return {e02:true,e02SceneId:scene.id,e02Stage:stage,e02UnitId:scene.unitId,
    e02CanDoId:unit.canDoId,e02Original:true,accreditedCefrVerdict:false,...extra};
}
function lesson(scene:E02Scene,key:string,title:string,body:string,examples:StudyLesson["examples"]=[]):StudyLesson{
  return {kind:"lesson",id:PREFIX+scene.id+"-"+key,
    title,body,contextId:PREFIX+scene.id,examples,
    facts:[{label:"Can-do",value:CAN_DO_MAP.get(UNIT_MAP.get(scene.unitId)!.canDoId)!.statement}],
    sourceLabel:"THIEPN original teaching · "+SOURCE+" · canonical "+scene.unitId};
}
function ordered(answer:string,foils:readonly [string,string],seed:number):string[]{
  const choices=[...foils];choices.splice(seed%3,0,answer);return choices;
}
function choice(scene:E02Scene,key:string,stage:E02Stage,question:string,answer:string,
  foils:readonly [string,string],feedback:string,skill:"listening"|"comprehension"|"form_selection",
  audio?:string):StudyPrompt{
  const unit=UNIT_MAP.get(scene.unitId)!;
  return {id:PREFIX+scene.id+"-"+key,primaryTarget:{kind:"can_do",id:unit.canDoId},
    skill,cueFamily:PREFIX+scene.id+"-"+key,promptType:"choice",
    instruction:stage==="encounter"||stage==="delayed"&&audio?"Listen without reading the transcript.":"Choose the contextually appropriate answer.",
    prompt:question,promptLanguage:audio?"en":"ja",
    choices:ordered(answer,foils,scene.id.length+key.length),acceptedAnswers:[answer],displayAnswer:answer,
    explanation:feedback,contextId:PREFIX+scene.id,
    ...(audio?{speechSynthesisText:audio,speechSynthesisLanguage:"ja-JP"}:{}),
    languageActivity:audio?"listening":"reading",sourceId:SOURCE,contentVersion:VERSION,
    activity:stage==="delayed"?"assessment":"review",
    eventMetadata:meta(scene,stage,{answerType:"controlled",
      ...(audio?{audioKind:"device-speech-synthesis",nativeAudio:false}:{})})};
}
function typed(scene:E02Scene,key:string,stage:E02Stage,question:string,answers:readonly string[],feedback:string):StudyPrompt{
  const unit=UNIT_MAP.get(scene.unitId)!;
  return {id:PREFIX+scene.id+"-"+key,primaryTarget:{kind:"can_do",id:unit.canDoId},
    skill:"production",cueFamily:PREFIX+scene.id+"-"+key,promptType:"typed",
    instruction:"Recall the requested exact model expression, without choices.",
    prompt:question,promptLanguage:"en",placeholder:"日本語…",
    acceptedAnswers:[...answers],displayAnswer:answers[0]??"",explanation:feedback,
    answerNormalization:"japanese",contextId:PREFIX+scene.id,sourceId:SOURCE,contentVersion:VERSION,
    languageActivity:"writing",activity:stage==="delayed"?"assessment":"review",
    eventMetadata:meta(scene,stage,{answerType:"bounded-exact-model",notFreeWritingAssessment:true})};
}
function independent(scene:E02Scene,mode:"speech"|"textarea"):StudyPrompt{
  const unit=UNIT_MAP.get(scene.unitId)!;
  const speaking=mode==="speech",terms=speaking?scene.speakingTargets:scene.writingTargets;
  const common={id:PREFIX+scene.id+(speaking?"-speak":"-write"),primaryTarget:{kind:"can_do" as const,id:unit.canDoId},
    skill:speaking?"production" as const:"writing_quality" as const,
    cueFamily:PREFIX+scene.id+(speaking?"-free-speech":"-free-writing"),
    instruction:speaking?"Speak with your own information.":"Write your own short response, not a model copy.",
    prompt:speaking?scene.speakingTask:scene.writingTask,promptLanguage:"en" as const,
    placeholder:speaking?"日本語で話してください":"日本語で書いてください",
    acceptedAnswers:[],displayAnswer:terms.join(" / "),
    requiredTerms:[...terms],minimumCharacters:10,
    explanation:speaking
      ?"Only a browser-recognized transcript was checked for structural terms. No pitch-accent, pronunciation, native-likeness or independent speaking score is claimed."
      :"This is a visible structural self-check, not an evaluation of truth, naturalness, communicative success or a CEFR outcome.",
    answerNormalization:"japanese" as const,contextId:PREFIX+scene.id,
    sourceId:SOURCE,contentVersion:VERSION,languageActivity:speaking?"spoken_production" as const:"writing" as const,
    activity:speaking?"speaking" as const:"writing" as const,
    eventMetadata:meta(scene,"independent",{nonAuthoritative:true,schedulerExcluded:true,
      structuralOnly:true,acousticScore:false,independentCompetenceVerified:false})};
  return speaking?{...common,promptType:"speech"}:{...common,promptType:"textarea"};
}
function mainPrompts(scene:E02Scene):StudyPrompt[]{
  const transcript=scene.dialogue.map(turn=>turn.ja).join(" ");
  return [
    choice(scene,"hear","encounter","Listen first: what is the main situation?",
      scene.listening.answer,scene.listening.foils,scene.listening.feedback,"listening",transcript),
    choice(scene,"read","understand",scene.reading.prompt,scene.reading.answer,
      scene.reading.foils,scene.reading.feedback,"comprehension"),
    choice(scene,"reply","communicate",scene.reply.prompt,scene.reply.answer,
      scene.reply.foils,scene.reply.feedback,"form_selection"),
    typed(scene,"recall","practice",scene.recall.prompt,scene.recall.answers,scene.recall.feedback)
  ];
}
function delayedPrompts(scene:E02Scene):StudyPrompt[]{
  return [
    choice(scene,"delayed-hear","delayed","Listen to the changed situation without a transcript.",
      scene.transfer.meaning,scene.transfer.meaningFoils,scene.transfer.feedback,"listening",scene.transfer.audio),
    choice(scene,"delayed-reply","delayed",scene.transfer.prompt,
      scene.transfer.answer,scene.transfer.foils,scene.transfer.feedback,"form_selection"),
    typed(scene,"delayed-recall","delayed",scene.recall.prompt,scene.recall.answers,
      scene.recall.feedback)
  ];
}
export const e02ReviewPrompts:StudyPrompt[]=E02_AVAILABLE_SCENES.flatMap(mainPrompts);
const REQUIRED=["hear","read","reply","recall"];
function ownEvents(scene:E02Scene,events:readonly StudyEvent[]):StudyEvent[]{
  return events.filter(e=>e.metadata?.e02===true&&e.metadata.e02SceneId===scene.id&&
    e.metadata.e02UnitId===scene.unitId&&e.primaryTarget?.id===UNIT_MAP.get(scene.unitId)?.canDoId);
}
function latestEvents(events:readonly StudyEvent[]):Map<string,StudyEvent>{
  const map=new Map<string,StudyEvent>();
  for(const event of events){
    const id=typeof event.metadata?.promptId==="string"?event.metadata.promptId:"";
    const old=map.get(id);
    if(id&&(!old||event.occurredAt>=old.occurredAt))map.set(id,event);
  }
  return map;
}
export function getE02Overview(events:readonly StudyEvent[],now=new Date()):E02Overview{
  const scenes=E02_AVAILABLE_SCENES.map(scene=>{
    const own=ownEvents(scene,events),latest=latestEvents(own);
    const ids=REQUIRED.map(suffix=>PREFIX+scene.id+"-"+suffix);
    const correct=ids.filter(id=>latest.get(id)?.result==="correct").length;
    const complete=correct===ids.length;
    const dates=ids.map(id=>Date.parse(latest.get(id)?.occurredAt??""));
    const eligibleAt=complete&&dates.every(Number.isFinite)?Math.max(...dates)+20*60*60*1000:NaN;
    const reviewKeys=["delayed-hear","delayed-reply","delayed-recall"];
    const reviewed=reviewKeys.filter(key=>latest.get(PREFIX+scene.id+"-"+key)?.result==="correct").length;
    const state:E02State=!own.length?"not_started":reviewed===reviewKeys.length?"reviewed"
      :!Number.isFinite(eligibleAt)?"learning":now.getTime()<eligibleAt?"waiting":"ready";
    const unit=UNIT_MAP.get(scene.unitId)!;
    const progress:E02SceneProgress={id:scene.id,title:scene.title,unitId:unit.id,
      canDoId:unit.canDoId,canDo:CAN_DO_MAP.get(unit.canDoId)!.statement,
      state,completedControlled:correct,requiredControlled:ids.length,
      attempts:own.filter(e=>e.metadata?.nonAuthoritative!==true&&e.metadata?.e02Stage!=="delayed").length,
      unscoredDrafts:own.filter(e=>e.metadata?.nonAuthoritative===true).length,
      delayedCorrect:reviewed,delayedTotal:reviewKeys.length,
      ...(Number.isFinite(eligibleAt)?{reviewAvailableAt:new Date(eligibleAt).toISOString()}:{})};
    return progress;
  });
  const next=scenes.find(s=>s.state==="learning")??scenes.find(s=>s.state==="not_started")??scenes.find(s=>s.state==="ready")??scenes.find(s=>s.state==="waiting");
  return {scenes,nextSceneId:next?.id??null,started:scenes.filter(s=>s.state!=="not_started").length,
    readyForDelay:scenes.filter(s=>s.state==="ready").length,
    delayedReviewed:scenes.filter(s=>s.state==="reviewed").length,total:scenes.length};
}
export function buildE02Journey(id:string):StudyStep[]{
  const scene=requireScene(id),unit=UNIT_MAP.get(scene.unitId)!;
  const transcript=scene.dialogue.map(turn=>({expression:turn.ja,note:turn.en}));
  const grammar=scene.grammarIds
    .filter(g=>coreContent.grammar.some(item=>item.id===g))
    .map(g=>grammarLessons[grammarContext(g)])
    .filter((item):item is StudyLesson=>Boolean(item));
  const [hear,read,reply,recall]=mainPrompts(scene);
  const canDo=CAN_DO_MAP.get(unit.canDoId)!.statement;
  return [
    lesson(scene,"setup","A1 · "+scene.title,
      scene.setting+" Objective: "+canDo+". Start with an audio-only exchange. Device speech synthesis is an identified fallback, not a native recording."),
    hear,
    lesson(scene,"reveal","Encounter · Read the dialogue after listening",
      "Compare the speakers' intentions with your first listening guess. These original lines are teaching examples, not copied from source textbooks.",transcript),
    read,
    lesson(scene,"notice","Discover · Why the expressions work",scene.notice),
    ...grammar,
    lesson(scene,"try","Guided practice","The next response needs to fit the actual question. Look for the relevant information, not merely a familiar word."),
    reply,
    recall,
    lesson(scene,"free","Independent use · Remove the model",
      "Create your own Japanese response in this situation. The next writing and speech prompts are deliberately unscored drafts: structural terms or recognized transcripts never establish full meaning or spoken proficiency."),
    independent(scene,"textarea"),independent(scene,"speech"),
    lesson(scene,"return","Return for spaced transfer",
      "Completed controlled prompts enter your existing Today review history through the canonical StudyEvent and FSRS scheduler. A changed listening and conversation situation unlocks after at least 20 hours of successful controlled practice. You can repeat the lesson at any time.")
  ];
}
export function buildE02DelayedJourney(id:string,events:readonly StudyEvent[],now=new Date()):StudyStep[]{
  const scene=requireScene(id);
  const state=getE02Overview(events,now).scenes.find(s=>s.id===id)?.state;
  if(state!=="ready"&&state!=="reviewed")throw Error("E02_DELAYED_TRANSFER_NOT_READY:"+id);
  return [lesson(scene,"delayed","Delayed A1 transfer · "+scene.title,
    "The roles and information have changed. Answer without consulting your earlier model. This is a controlled review, not a proficiency certificate."),...delayedPrompts(scene)];
}
