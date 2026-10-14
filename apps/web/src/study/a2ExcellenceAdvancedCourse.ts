import type {StudyEvent} from "@thiepn/domain";
import type {CanDoDescriptor,CourseUnit} from "@thiepn/content-schema";
import type {StudyLesson,StudyPrompt,StudyStep} from "@thiepn/study-player";
import {coreContent} from "../coreContent";
import {grammarContext,grammarLessons} from "./grammarCourse";
import {E04_SCENES,type E04Scene} from "./a2ExcellenceAdvancedScenes";

const PREFIX="a2-e04-";
const SOURCE="thiepn-original";
const HOURS=20;
export type E04State="not_started"|"learning"|"waiting"|"ready"|"reviewed";
type Stage="encounter"|"understand"|"discover"|"practice"|"communicate"|"independent"|"delayed";
interface BoundScene {scene:E04Scene;unit:CourseUnit;canDo:CanDoDescriptor}
export interface E04SceneProgress {
  id:string;title:string;goal:string;unitId:string;canDoId:string;canDo:string;
  status:E04State;guidedCorrect:number;guidedTotal:number;controlledAttempts:number;
  unscoredDrafts:number;delayedCorrect:number;delayedTotal:number;
  reviewAvailableAt?:string;
}
export interface E04Overview{
  scenes:E04SceneProgress[];authored:number;linked:number;unmapped:readonly {id:string;title:string}[];
  started:number;reviewReady:number;reviewed:number;nextSceneId:string|null;
}

const byCanDo=new Map(coreContent.canDos.map(x=>[x.id,x]));
const canonicalA2=coreContent.courseUnits.filter(u=>
  (u.level==="A2"||u.level==="A2.1"||u.level==="A2.2")&&byCanDo.has(u.canDoId)
).sort((a,b)=>a.order-b.order);
const hasExplicitA22=canonicalA2.some(u=>u.level==="A2.2");
const a22=hasExplicitA22?canonicalA2.filter(u=>u.level==="A2.2"):
  canonicalA2.slice(Math.ceil(canonicalA2.length/2));
// The latter is ONLY an operational tentative second-half grouping,
// not a verified JF or CEFR A2.2 classification.
const SEMANTIC_ANCHOR_RE=/[a-z\u3040-\u30ff\u3400-\u9fff]/iu;
function tokensFor(text:string):Set<string>{
  const tokens=text.toLocaleLowerCase("en").match(/[\p{L}\p{N}]+/gu)??[];
  return new Set(tokens.filter(t=>t.length>=3&&SEMANTIC_ANCHOR_RE.test(t)));
}
function associationScore(scene:E04Scene,unit:CourseUnit):number{
  const descriptor=byCanDo.get(unit.canDoId);
  if(!descriptor)return 0;
  const haystack=tokensFor(unit.title+" "+descriptor.statement);
  return scene.keywords.reduce((n,key)=>n+(tokensFor(key).size>0&&[...tokensFor(key)].every(token=>haystack.has(token))?1:0),0);
}
const occupied=new Set<string>();
export const E04_MAPPED:readonly BoundScene[]=E04_SCENES.flatMap(scene=>{
  const options=a22.filter(u=>!occupied.has(u.id))
   .map(unit=>({unit,score:associationScore(scene,unit)}))
   .sort((a,b)=>b.score-a.score||a.unit.order-b.unit.order);
  const best=options[0];
  // A lexical theme match is insufficient to claim objective equivalence.
  // Keep the association visibly provisional pending curriculum audit.
  if(!best||best.score<1)return [];
  occupied.add(best.unit.id);
  return [{scene,unit:best.unit,canDo:byCanDo.get(best.unit.canDoId)!}];
});
export const E04_UNMAPPED=E04_SCENES.filter(scene=>!E04_MAPPED.some(item=>item.scene.id===scene.id))
 .map(scene=>({id:scene.id,title:scene.title}));
const allById=new Map(E04_SCENES.map(s=>[s.id,s]));
function getScene(id:string):E04Scene{
  const scene=allById.get(id);if(!scene)throw Error("E04_UNKNOWN_SCENE:"+id);return scene;
}
function getBound(id:string):BoundScene{
  const b=E04_MAPPED.find(item=>item.scene.id===id);
  if(!b)throw Error("E04_CAN_DO_UNMAPPED:"+id);
  return b;
}
function metadata(b:BoundScene,stage:Stage,extras:Record<string,unknown>={}):Record<string,unknown>{
 return {e04:true,e04SceneId:b.scene.id,e04Stage:stage,e04UnitId:b.unit.id,e04CanDoId:b.canDo.id,
  e04SourceId:SOURCE,e04UnitSourceIds:b.unit.sourceIds,e04Placement:hasExplicitA22?"canonical-A2.2-label":"provisional-A2-second-half",
  originalAuthoring:true,accreditedCefrVerdict:false,...extras};
}
function lesson(id:string,key:string,title:string,body:string,examples:StudyLesson["examples"]=[],b?:BoundScene):StudyLesson{
 return {kind:"lesson",id:PREFIX+id+"-"+key,title,body,contextId:PREFIX+id,examples,
  sourceLabel:b?"Original THIEPN E04 · "+SOURCE+" · provisional link "+b.unit.id:"Original THIEPN E04 · "+SOURCE+" · unlinked reader (no graded events)",
  ...(b?{facts:[{label:"Canonical A2 Can-do (provisional fit)",value:b.canDo.statement}]}:{})};
}
function options(correct:string,foils:readonly [string,string],seed:number):string[]{
 const result=[...foils];result.splice(seed%3,0,correct);return result;
}
function choice(b:BoundScene,key:string,stage:Stage,prompt:string,correct:string,foils:readonly [string,string],
 explanation:string,skill:"listening"|"comprehension"|"form_selection",audio?:string):StudyPrompt{
 return {
  id:PREFIX+b.scene.id+"-"+key,primaryTarget:{kind:"can_do",id:b.canDo.id},
  skill,cueFamily:PREFIX+b.scene.id+"-"+key,promptType:"choice",
  instruction:audio?"Listen without the transcript.":"Use the actual passage or situation, not remembered answer position.",
  prompt,promptLanguage:audio?"en":"ja",choices:options(correct,foils,key.length+b.scene.id.length),
  acceptedAnswers:[correct],displayAnswer:correct,explanation,
  contextId:PREFIX+b.scene.id,sourceId:SOURCE,contentVersion:coreContent.version,
  ...(audio?{speechSynthesisText:audio,speechSynthesisLanguage:"ja-JP"}:{}),
  activity:stage==="delayed"?"assessment":"review",
  languageActivity:audio?"listening":"reading",
  eventMetadata:metadata(b,stage,{assessmentKind:"controlled-exact",
   ...(audio?{audioKind:"device-speech-synthesis",nativeAudio:false}:{})})
 };
}
function recall(b:BoundScene,key:string,stage:Stage,question:string,answers:readonly string[],feedback:string):StudyPrompt{
 return {
  id:PREFIX+b.scene.id+"-"+key,primaryTarget:{kind:"can_do",id:b.canDo.id},
  skill:"production",cueFamily:PREFIX+b.scene.id+"-"+key,promptType:"typed",
  instruction:"Produce the requested model without multiple-choice cues.",
  prompt:question,promptLanguage:"en",placeholder:"日本語で答えてください",
  acceptedAnswers:[...answers],displayAnswer:answers[0]??"",explanation:feedback,
  answerNormalization:"japanese",sourceId:SOURCE,contentVersion:coreContent.version,
  contextId:PREFIX+b.scene.id,languageActivity:"writing",
  activity:stage==="delayed"?"assessment":"review",
  eventMetadata:metadata(b,stage,{assessmentKind:"bounded-exact-model",notFreeWritingAssessment:true})
 };
}
function open(b:BoundScene,mode:"textarea"|"speech"):StudyPrompt{
 const speaking=mode==="speech",task=speaking?b.scene.speaking:b.scene.writing;
 const terms=[...task.selfChecks];
 const base={
  id:PREFIX+b.scene.id+(speaking?"-speak":"-write"),
  primaryTarget:{kind:"can_do" as const,id:b.canDo.id},
  skill:speaking?"production" as const:"writing_quality" as const,
  cueFamily:PREFIX+b.scene.id+(speaking?"-open-speech":"-open-writing"),
  prompt:task.prompt,promptLanguage:"en" as const,
  instruction:speaking?"Speak using your own information.":"Write your own cohesive answer and justify your choices.",
  placeholder:"自分の日本語で答えてください",
  acceptedAnswers:[],displayAnswer:terms.join(" / "),requiredTerms:terms,minimumCharacters:22,
  explanation:speaking?"Recognized transcripts can be structurally checked; this is NOT a pronunciation, fluency or CEFR score."
   :"The structural word/length check cannot judge pragmatics, supporting evidence, coherence or real communicative success.",
  answerNormalization:"japanese" as const,
  sourceId:SOURCE,contentVersion:coreContent.version,contextId:PREFIX+b.scene.id,
  activity:speaking?"speaking" as const:"writing" as const,
  languageActivity:speaking?"spoken_production" as const:"writing" as const,
  eventMetadata:metadata(b,"independent",{nonAuthoritative:true,schedulerExcluded:true,
   structuralOnly:true,acousticScore:false,independentCompetenceVerified:false})
 };
 return speaking?{...base,promptType:"speech"}:{...base,promptType:"textarea"};
}
function guided(b:BoundScene):StudyPrompt[]{
 const s=b.scene,dialogue=s.turns.map(t=>t.who+"： "+t.ja).join(" ");
 return [
  choice(b,"listen-gist","encounter","Listen to the complete exchange. What outcome do the speakers reach?",
   s.listening.gist,s.listening.foils,s.listening.correction,"listening",dialogue),
  choice(b,"listen-detail","encounter","Listen carefully and answer: "+s.listening.detailQuestion,
   s.listening.detailAnswer,s.listening.detailFoils,s.listening.correction,"listening",dialogue),
  choice(b,"read-gist","understand",s.reading.title+"\n"+s.reading.ja+"\n\nWhat is the main purpose?",
   s.comprehension.gist,s.comprehension.foils,s.comprehension.correction,"comprehension"),
  choice(b,"read-evidence","understand",s.reading.title+"\n"+s.reading.ja+"\n\n"+s.comprehension.detailQuestion,
   s.comprehension.detailAnswer,s.comprehension.detailFoils,s.comprehension.correction,"comprehension"),
  choice(b,"context-response","communicate",s.response.question,s.response.answer,s.response.foils,
   s.response.correction,"form_selection"),
  recall(b,"model-recall","practice",s.recall.question,s.recall.answers,s.recall.correction)
 ];
}
function transfer(b:BoundScene):StudyPrompt[]{
 const t=b.scene.transfer;
 return [
  choice(b,"delayed-listen","delayed","Listen to a different problem. "+t.question,t.answer,t.foils,t.correction,"listening",t.audio),
  choice(b,"delayed-reading","delayed",t.reading+"\n\n"+t.readingQuestion,t.readingAnswer,t.readingFoils,t.correction,"comprehension"),
  recall(b,"delayed-model","delayed",b.scene.recall.question,b.scene.recall.answers,b.scene.recall.correction)
 ];
}
export const e04ReviewPrompts:StudyPrompt[]=E04_MAPPED.flatMap(guided);
const CONTROLLED=["listen-gist","listen-detail","read-gist","read-evidence","context-response","model-recall"];
const DELAYED=["delayed-listen","delayed-reading","delayed-model"];
function ownerEvents(b:BoundScene,events:readonly StudyEvent[]):StudyEvent[]{
 return events.filter(e=>e.metadata?.e04===true&&e.metadata.e04SceneId===b.scene.id&&
   e.metadata.e04UnitId===b.unit.id&&e.primaryTarget?.kind==="can_do"&&e.primaryTarget.id===b.canDo.id);
}
function latestByPrompt(events:readonly StudyEvent[]):Map<string,StudyEvent>{
 const byId=new Map<string,StudyEvent>();
 for(const event of events){
  const id=typeof event.metadata?.promptId==="string"?event.metadata.promptId:"";
  if(!id)continue;
  const previous=byId.get(id);
  if(!previous||event.occurredAt>previous.occurredAt)byId.set(id,event);
 }
 return byId;
}
export function getE04Overview(events:readonly StudyEvent[],now=new Date()):E04Overview{
 const scenes=E04_MAPPED.map(b=>{
  const own=ownerEvents(b,events),byId=latestByPrompt(own);
  const ids=CONTROLLED.map(key=>PREFIX+b.scene.id+"-"+key);
  const guidedCorrect=ids.filter(id=>byId.get(id)?.result==="correct").length;
  const timestamps=ids.map(id=>Date.parse(byId.get(id)?.occurredAt??""));
  const finished=guidedCorrect===ids.length&&timestamps.every(Number.isFinite);
  const readyAt=finished?Math.max(...timestamps)+HOURS*3600000:NaN;
  const delayedCorrect=DELAYED.filter(key=>byId.get(PREFIX+b.scene.id+"-"+key)?.result==="correct").length;
  const status:E04State=!own.length?"not_started":delayedCorrect===DELAYED.length?"reviewed":
   !Number.isFinite(readyAt)?"learning":now.getTime()<readyAt?"waiting":"ready";
  const progress:E04SceneProgress={
   id:b.scene.id,title:b.scene.title,goal:b.scene.goal,unitId:b.unit.id,canDoId:b.canDo.id,
   canDo:b.canDo.statement,status,guidedCorrect,guidedTotal:CONTROLLED.length,
   controlledAttempts:own.filter(e=>e.metadata?.e04Stage!=="delayed"&&e.metadata?.nonAuthoritative!==true).length,
   unscoredDrafts:own.filter(e=>e.metadata?.nonAuthoritative===true).length,
   delayedCorrect,delayedTotal:DELAYED.length,
   ...(Number.isFinite(readyAt)?{reviewAvailableAt:new Date(readyAt).toISOString()}: {})
  };
  return progress;
 });
 const next=scenes.find(x=>x.status==="learning")??scenes.find(x=>x.status==="not_started")??
  scenes.find(x=>x.status==="ready")??null;
 return {scenes,authored:E04_SCENES.length,linked:scenes.length,unmapped:E04_UNMAPPED,
  started:scenes.filter(x=>x.status!=="not_started").length,
  reviewReady:scenes.filter(x=>x.status==="ready").length,
  reviewed:scenes.filter(x=>x.status==="reviewed").length,nextSceneId:next?.id??null};
}
function baseLessons(scene:E04Scene,b?:BoundScene):StudyStep[]{
 const id=scene.id;
 return [
  lesson(id,"situation","A2.2 · "+scene.title,
   "Situation: "+scene.setting+" Communicative goal: "+scene.goal+
   (b?" The scene is provisionally attached to the actual canonical A2 Can-do "+b.canDo.id+".":" This scene is original educational source only; no canonical Can-do or graded evidence is assigned."),
   [],b),
  lesson(id,"dialogue","Dialogue · Understand speaker intentions",
   "The conversation is fully original. Read each speaker's role and why the utterance is appropriate. In a graded journey this reveal follows audio-only listening.",
   scene.turns.map(turn=>({expression:turn.who+"： "+turn.ja,note:turn.en+" · Purpose: "+turn.intention})),b),
  lesson(id,"reading","Connected reading · "+scene.reading.title,
   "This is an independently authored practical notice or message. Compare the actual stated conditions with the characters' assumptions.",
   [{expression:scene.reading.ja,note:scene.reading.en}],b),
  lesson(id,"focus","Discover · Meaning, politeness and likely confusions",
   "A form that is grammatically possible may still be inappropriate for the situation. Notice how the original dialogue respects constraints, uncertainty and the listener.",
   scene.focus.map(item=>({expression:item.expression,note:item.meaning+" · Pitfall: "+item.trap})),b),
 ];
}
export function buildE04Preview(id:string):StudyStep[]{
 const s=getScene(id);
 if(E04_MAPPED.some(b=>b.scene.id===id))throw Error("E04_PREVIEW_ONLY_FOR_UNLINKED_SCENES");
 return [...baseLessons(s),lesson(s.id,"preview-boundary","Original reading available · No grading",
  "This original A2-oriented scene has no sufficiently verified A2.2 Can-do association. It is readable here, without StudyEvents, proficiency evidence or scheduler changes. A curriculum audit must link the right canonical objective before scored practice can open.")];
}
export function buildE04Journey(id:string):StudyStep[]{
 const b=getBound(id),s=b.scene;
 const [listenGist,listenDetail,readGist,readEvidence,respond,retrieve]=guided(b);
 const canonicalLessons=b.unit.grammarIds.slice(0,5)
  .map(id=>grammarLessons[grammarContext(id)]).filter((x):x is StudyLesson=>Boolean(x));
 return [
  lesson(s.id,"situation","A2.2 · "+s.title,
   "Situation: "+s.setting+" Goal: "+s.goal+
   " First listen and infer the problem. Device-synthesized speech is explicitly not a native recording. The A2.2 placement of this canonical A2 Can-do is provisional.",[],b),
  listenGist,listenDetail,
  lesson(s.id,"dialogue","Encounter · Read after listening",
   "Compare what each person wanted, how they asked and what they actually agreed.",
   s.turns.map(turn=>({expression:turn.who+"： "+turn.ja,note:turn.en+" · Purpose: "+turn.intention})),b),
  readGist,readEvidence,
  lesson(s.id,"reading","Connected reading · Evidence and conditions",
   "The notice is an independently authored text. Check which conditions and deadlines it actually supports.",
   [{expression:s.reading.ja,note:s.reading.en}],b),
  lesson(s.id,"focus","Discover · Pragmatics and misconceptions",
   "Compare alternatives, identify conditions, and notice why some plausible expressions would be contextually inappropriate.",
   s.focus.map(item=>({expression:item.expression,note:item.meaning+" · Common mistake: "+item.trap})),b),
  ...canonicalLessons,
  lesson(s.id,"remove-hints","Communicate · Reduced scaffolding",
   "Now select a response appropriate to this situation, then recall a complete Japanese model without seeing choices.",[],b),
  respond,retrieve,
  lesson(s.id,"independent","Independent performance · Your own response",
   "Write and speak your own version: explain the practical problem, give reasons, make a culturally considerate request, and negotiate a resolution. Structural checks are NOT validated speaking or writing scores.",[],b),
  open(b,"textarea"),open(b,"speech"),
  lesson(s.id,"retrieval","Delayed retrieval · New circumstances",
   "Your six controlled prompts are eligible for the existing Today/FSRS review system. A separate changed-context listening and reading check becomes available after correct answers and 20 hours. Open drafts are never counted as proficiency.",[],b)
 ];
}
export function buildE04Delayed(id:string,events:readonly StudyEvent[],now=new Date()):StudyStep[]{
 const b=getBound(id),p=getE04Overview(events,now).scenes.find(s=>s.id===id);
 if(p?.status!=="ready"&&p?.status!=="reviewed")throw Error("E04_DELAYED_NOT_READY:"+id);
 return [
  lesson(id,"delayed-intro","A2.2 · Independent transfer",
   "A different context with different people and constraints. Pay attention to the new source; do not assume answers from the guided dialogue. Controlled response evidence is not a CEFR award.",[],b),
  ...transfer(b)
 ];
}
