import type {StudyEvent} from "@thiepn/domain";
import type {CourseUnit,CanDoDescriptor} from "@thiepn/content-schema";
import type {StudyLesson,StudyPrompt,StudyStep} from "@thiepn/study-player";
import {coreContent} from "../coreContent";
import {grammarContext,grammarLessons} from "./grammarCourse";
import {E03_SCENES,type E03Scene} from "./a2ExcellenceScenes";

const PREFIX="a2-e03-";
const SOURCE="thiepn-original";
export type E03State="not_started"|"learning"|"waiting"|"ready"|"reviewed";
type Stage="encounter"|"understand"|"discover"|"practice"|"communicate"|"independent"|"delayed";
interface BoundScene {scene:E03Scene;unit:CourseUnit;canDo:CanDoDescriptor}
export interface E03SceneProgress {
 id:string;title:string;setting:string;unitId:string;canDoId:string;canDo:string;
 state:E03State;answered:number;correct:number;required:number;unscoredDrafts:number;
 delayedCorrect:number;delayedTotal:number;reviewAvailableAt?:string;
}
export interface E03Overview {
 scenes:E03SceneProgress[];nextSceneId:string|null;started:number;readyForDelay:number;
 delayedReviewed:number;total:number;authored:number;unmapped:string[];unmappedScenes:{id:string;title:string}[];
}

// There is no independently verified A2.1 subdivision in the canonical P4
// course. Resolve a conservative semantic match against a real A2 Can-do;
// never give a fabricated A2 ID or attach a different communicative skill.
const byCanDo=new Map(coreContent.canDos.map(d=>[d.id,d]));
const a2=coreContent.courseUnits
 .filter(u=>(u.level==="A2"||u.level==="A2.1")&&byCanDo.has(u.canDoId))
 .sort((a,b)=>a.order-b.order);
const a21=a2.some(u=>u.level==="A2.1")?a2.filter(u=>u.level==="A2.1"):
 a2.slice(0,Math.max(1,Math.ceil(a2.length/2))); // tentative A2 sequencing only; not certified A2.1
const grammarIds=new Set(coreContent.grammar.map(g=>g.id));
const sentenceIds=new Set(coreContent.sentences.map(s=>s.id));
const lexicalIds=new Set(coreContent.lexemes.map(l=>l.id));
function canonicalUnitUsable(u:CourseUnit):boolean{
 const canDo=byCanDo.get(u.canDoId);
 return Boolean(canDo&&u.id&&u.sourceIds.length&&canDo.sourceIds.length
   &&u.grammarIds.every(g=>grammarIds.has(g))
   &&u.sentenceIds.every(s=>sentenceIds.has(s))
   &&u.vocabularyIds.every(id=>lexicalIds.has(id)));
}
function tokenMatches(text:string,term:string):boolean{
 const safe=term.trim().toLowerCase();
 if(!safe)return false;
 return text.includes(safe); // thematic match against authored synonyms, with explicit score threshold
}
function matchScore(scene:E03Scene,unit:CourseUnit):number{
 const descriptor=byCanDo.get(unit.canDoId);
 if(!descriptor)return 0;
 const haystack=(unit.title+" "+descriptor.statement).toLowerCase();
 return scene.keywords.reduce((sum,term)=>sum+(tokenMatches(haystack,term)?1:0),0);
}
const taken=new Set<string>();
export const E03_MAPPED:readonly BoundScene[]=E03_SCENES.flatMap(scene=>{
 const options=a21.filter(unit=>!taken.has(unit.id)&&canonicalUnitUsable(unit))
   .map(unit=>({unit,score:matchScore(scene,unit)}))
   .sort((a,b)=>b.score-a.score||a.unit.order-b.unit.order);
 const selected=options[0];
 // One shared topic word or a tied match is not a verified communicative objective.
 if(!selected||selected.score<2||selected.score===(options[1]?.score??-1))return [];
 taken.add(selected.unit.id);
 return [{scene,unit:selected.unit,canDo:byCanDo.get(selected.unit.canDoId)!}];
});
export const E03_UNMAPPED_SCENES=E03_SCENES.filter(scene=>!E03_MAPPED.some(b=>b.scene.id===scene.id)).map(scene=>({id:scene.id,title:scene.title}));
export const E03_UNMAPPED=E03_UNMAPPED_SCENES.map(scene=>scene.title);
function bound(id:string):BoundScene {
 const item=E03_MAPPED.find(b=>b.scene.id===id);
 if(!item)throw Error("E03_A2_CAN_DO_UNMAPPED:"+id);
 return item;
}
function metadata(b:BoundScene,stage:Stage,extras:Record<string,unknown>={}):Record<string,unknown>{
 return {e03:true,e03SceneId:b.scene.id,e03Stage:stage,e03UnitId:b.unit.id,
 e03CanDoId:b.canDo.id,e03A21Placement:"provisional",e03Original:true,
 originalSourceId:SOURCE,canonicalSourceIds:b.unit.sourceIds,
 accreditedCefrVerdict:false,...extras};
}
function lesson(b:BoundScene,key:string,title:string,body:string,examples:StudyLesson["examples"]=[]):StudyLesson{
 return {kind:"lesson",id:PREFIX+b.scene.id+"-"+key,title,body,
 contextId:PREFIX+b.scene.id,examples,
 sourceLabel:"Original THIEPN A2 communication · "+SOURCE+" · linked to "+b.unit.id+" (provisional A2.1)",
 facts:[{label:"Linked A2 Can-do",value:b.canDo.statement}]};
}
function choices(answer:string,foils:readonly [string,string],seed:number):string[]{
 const items=[...foils];items.splice(seed%3,0,answer);return items;
}
function choice(b:BoundScene,key:string,stage:Stage,question:string,answer:string,
 foils:readonly [string,string],feedback:string,skill:"listening"|"comprehension"|"form_selection",audio?:string):StudyPrompt{
 return {id:PREFIX+b.scene.id+"-"+key,primaryTarget:{kind:"can_do",id:b.canDo.id},
 skill,cueFamily:PREFIX+b.scene.id+"-"+key,promptType:"choice",
 instruction:audio?"Listen before viewing Japanese text.":"Interpret the new context and choose the best answer.",
 prompt:question,promptLanguage:audio?"en":"ja",
 choices:choices(answer,foils,key.length+b.scene.id.length),
 acceptedAnswers:[answer],displayAnswer:answer,explanation:feedback,
 contextId:PREFIX+b.scene.id,
 ...(audio?{speechSynthesisText:audio,speechSynthesisLanguage:"ja-JP"}:{}),
 activity:stage==="delayed"?"assessment":"review",
 languageActivity:audio?"listening":"reading",
 sourceId:SOURCE,contentVersion:coreContent.version,
 eventMetadata:metadata(b,stage,{assessmentKind:"controlled",...(audio?{audioKind:"device-speech-synthesis",nativeAudio:false}:{})})};
}
function typed(b:BoundScene,key:string,stage:Stage,question:string,answers:readonly string[],feedback:string):StudyPrompt{
 return {id:PREFIX+b.scene.id+"-"+key,primaryTarget:{kind:"can_do",id:b.canDo.id},skill:"production",
 cueFamily:PREFIX+b.scene.id+"-"+key,promptType:"typed",instruction:"Retrieve the requested expression without answer choices.",
 prompt:question,promptLanguage:"en",placeholder:"日本語で入力してください",
 acceptedAnswers:[...answers],displayAnswer:answers[0]??"",explanation:feedback,
 answerNormalization:"japanese",contextId:PREFIX+b.scene.id,
 sourceId:SOURCE,contentVersion:coreContent.version,activity:stage==="delayed"?"assessment":"review",
 languageActivity:"writing",eventMetadata:metadata(b,stage,{assessmentKind:"bounded-model-only",notFreeWritingAssessment:true})};
}
function open(b:BoundScene,mode:"speech"|"textarea"):StudyPrompt{
 const speaking=mode==="speech", terms=speaking?b.scene.speakingTerms:b.scene.writingTerms;
 const common={id:PREFIX+b.scene.id+(speaking?"-speak":"-write"),
 primaryTarget:{kind:"can_do" as const,id:b.canDo.id},
 skill:speaking?"production" as const:"writing_quality" as const,
 cueFamily:PREFIX+b.scene.id+(speaking?"-open-speech":"-open-writing"),
 prompt:speaking?b.scene.speaking:b.scene.writing,promptLanguage:"en" as const,
 instruction:speaking?"Speak your own response, with less scaffolding.":"Write a connected response using your own facts.",
 placeholder:"日本語で答えてください",acceptedAnswers:[],displayAnswer:terms.join(" / "),
 requiredTerms:[...terms],minimumCharacters:18,
 explanation:speaking
 ?"The app checks transcript structure only; browser recognition is not an acoustic or pronunciation assessment."
 :"A required-term/length check is not proof of meaning, naturalness, correctness or A2 speaking/writing proficiency.",
 answerNormalization:"japanese" as const,contextId:PREFIX+b.scene.id,
 sourceId:SOURCE,contentVersion:coreContent.version,
 languageActivity:speaking?"spoken_production" as const:"writing" as const,
 activity:speaking?"speaking" as const:"writing" as const,
 eventMetadata:metadata(b,"independent",{nonAuthoritative:true,schedulerExcluded:true,
 independentCompetenceVerified:false,structuralOnly:true,acousticScore:false})};
 return speaking?{...common,promptType:"speech"}:{...common,promptType:"textarea"};
}
function main(b:BoundScene):StudyPrompt[]{
 const s=b.scene, audio=s.dialogue.map(x=>x.ja).join(" ");
 return [
  choice(b,"hear-gist","encounter","Listen to the complete exchange. What happens?",
   s.listen.gist,s.listen.gistFoils,s.listen.feedback,"listening",audio),
  choice(b,"hear-detail","encounter",s.listen.detailQuestion,
   s.listen.detailAnswer,s.listen.detailFoils,s.listen.feedback,"listening",audio),
  choice(b,"read-gist","understand",s.read.ja+"\n\n"+ "Choose the best summary.",
   s.read.gist,s.read.gistFoils,s.read.feedback,"comprehension"),
  choice(b,"read-detail","understand",s.read.ja+"\n\n"+s.read.detailQuestion,
   s.read.detailAnswer,s.read.detailFoils,s.read.feedback,"comprehension"),
  choice(b,"reply","communicate",s.respond.question,s.respond.answer,
   s.respond.foils,s.respond.feedback,"form_selection"),
  typed(b,"recall","practice",s.recall.question,s.recall.answers,s.recall.feedback)
 ];
}
function delayed(b:BoundScene):StudyPrompt[]{
 const t=b.scene.transfer;
 return [
  choice(b,"delayed-hear","delayed","Listen to a new related situation. Answer the question: "+t.question,
   t.answer,t.foils,t.feedback,"listening",t.audio),
  choice(b,"delayed-read","delayed",t.reading+"\n\n"+t.readingQuestion,
   t.readingAnswer,t.readingFoils,t.feedback,"comprehension"),
  typed(b,"delayed-recall","delayed",b.scene.recall.question,b.scene.recall.answers,b.scene.recall.feedback)
 ];
}
export const e03ReviewPrompts:StudyPrompt[]=E03_MAPPED.flatMap(main);
const REQUIRED=["hear-gist","hear-detail","read-gist","read-detail","reply","recall"];
function existing(b:BoundScene,all:readonly StudyEvent[]):StudyEvent[]{
 return all.filter(e=>e.metadata?.e03===true&&e.metadata.e03SceneId===b.scene.id&&
 e.metadata.e03UnitId===b.unit.id&&e.primaryTarget?.id===b.canDo.id);
}
function mostRecent(events:readonly StudyEvent[]):Map<string,StudyEvent>{
 const latest=new Map<string,StudyEvent>();
 for(const e of events){const id=typeof e.metadata?.promptId==="string"?e.metadata.promptId:"";if(!id)continue;
  const prev=latest.get(id);if(!prev||e.occurredAt>=prev.occurredAt)latest.set(id,e);}
 return latest;
}
export function getE03Overview(events:readonly StudyEvent[],now=new Date()):E03Overview{
 const scenes=E03_MAPPED.map(b=>{
  const all=existing(b,events),last=mostRecent(all);
  const names=REQUIRED.map(k=>PREFIX+b.scene.id+"-"+k);
  const correct=names.filter(id=>last.get(id)?.result==="correct").length;
  const times=names.map(id=>Date.parse(last.get(id)?.occurredAt??""));
  const complete=correct===names.length&&times.every(Number.isFinite);
  const due=complete?Math.max(...times)+20*60*60*1000:NaN;
  const delayedKeys=["delayed-hear","delayed-read","delayed-recall"];
  const delayedCorrect=delayedKeys.filter(k=>last.get(PREFIX+b.scene.id+"-"+k)?.result==="correct").length;
  const state:E03State=!all.length?"not_started":delayedCorrect===delayedKeys.length?"reviewed":
   !Number.isFinite(due)?"learning":now.getTime()<due?"waiting":"ready";
  return {id:b.scene.id,title:b.scene.title,setting:b.scene.setting,
   unitId:b.unit.id,canDoId:b.canDo.id,canDo:b.canDo.statement,
   state,answered:all.filter(e=>e.metadata?.e03Stage!=="delayed"&&e.metadata?.nonAuthoritative!==true).length,
   correct,required:names.length,unscoredDrafts:all.filter(e=>e.metadata?.nonAuthoritative===true).length,
   delayedCorrect,delayedTotal:delayedKeys.length,
   ...(Number.isFinite(due)?{reviewAvailableAt:new Date(due).toISOString()}: {})} satisfies E03SceneProgress;
 });
 const next=scenes.find(x=>x.state==="learning")??scenes.find(x=>x.state==="not_started")??scenes.find(x=>x.state==="ready");
 return {scenes,nextSceneId:next?.id??null,started:scenes.filter(x=>x.state!=="not_started").length,
  readyForDelay:scenes.filter(x=>x.state==="ready").length,delayedReviewed:scenes.filter(x=>x.state==="reviewed").length,
  total:scenes.length,authored:E03_SCENES.length,unmapped:E03_UNMAPPED,unmappedScenes:E03_UNMAPPED_SCENES};
}
export function buildE03Journey(id:string):StudyStep[]{
 const b=bound(id),s=b.scene;
 const [hearGist,hearDetail,readGist,readDetail,reply,recall]=main(b);
 if(!hearGist||!hearDetail||!readGist||!readDetail||!reply||!recall)throw Error("E03_MISSING_ORIGINAL_CONTROLLED_PROMPT:"+id);
 const lessons=b.unit.grammarIds.slice(0,4).map(g=>grammarLessons[grammarContext(g)]).filter((step):step is StudyLesson=>Boolean(step));
 const linked=new Set(b.unit.vocabularyIds);
 const vocab=s.vocabulary.map(v=>{
  const known=coreContent.lexemes.find(l=>linked.has(l.id)&&l.forms.some(f=>f.text===v.ja));
  return {expression:v.ja,note:v.en+(known?" · Canonical vocabulary: "+known.id:" · Original context support")};
 });
 return [
  lesson(b,"setup","A2.1 · "+s.title,
    "Situation: "+s.setting+" Communicative goal: "+s.objective+
    " The linked canonical A2 Can-do is provisional, not externally CEFR certified. First listen without seeing the dialogue."),
  hearGist,hearDetail,
  lesson(b,"transcript","Encounter · Full conversation",
    "Compare speaker intentions and key details with your audio impressions. Replay any difficult lines in a future review.",
    s.dialogue.map(turn=>({expression:turn.speaker+"： "+turn.ja,note:turn.en}))),
  readGist,readDetail,
  lesson(b,"reading-reveal","Reading · Check your interpretation",
    "The reading is a separate connected passage, not merely a transcript. Review its meaning only after answering the questions.",
    [{expression:s.read.ja,note:s.read.en}]),
  lesson(b,"notice","Discover · Form, meaning and social use",s.notice,vocab),
  ...lessons,
  lesson(b,"reduce-hints","Respond · Less guidance",
    "First select the appropriate response to a changed conversational turn; then recall a Japanese model without choices."),
  reply,recall,
  lesson(b,"independent","Independent communication · Your own content",
    "Write and speak about your own situation. Drafts are deliberately not given a proficiency or acoustic score. Browser speech recognition may be unavailable."),
  open(b,"textarea"),open(b,"speech"),
  lesson(b,"return","Return · Long-term transfer",
    "The six controlled prompts use the existing StudyEvent/FSRS review path. After correct performance and at least 20 hours, the app offers new audio and reading transfer checks. This is not a CEFR award.")
 ];
}
export function buildE03DelayedJourney(id:string,events:readonly StudyEvent[],now=new Date()):StudyStep[]{
 const b=bound(id),progress=getE03Overview(events,now).scenes.find(x=>x.id===id);
 if(progress?.state!=="ready"&&progress?.state!=="reviewed")throw Error("E03_DELAYED_NOT_AVAILABLE:"+id);
 return [lesson(b,"transfer","Delayed transfer · "+b.scene.title,
  "Answer changed-situation listening, connected reading and model recall without the previous example. This is controlled review only."),
  ...delayed(b)];
}

/** Original E03 reading-only fallback: no prompt, study event or invented association. */
export function buildE03Preview(id:string):StudyStep[]{
 const scene=E03_SCENES.find(s=>s.id===id&&E03_UNMAPPED_SCENES.some(x=>x.id===id));
 if(!scene)throw Error("E03_PREVIEW_REQUIRES_UNMAPPED_SCENE:"+id);
 const contextId="a2-e03-preview-"+id;
 const mk=(key:string,title:string,body:string,examples:StudyLesson["examples"]=[]):StudyLesson=>({
  kind:"lesson",id:contextId+"-"+key,contextId,title,body,examples,
  sourceLabel:"Original THIEPN E03 · thiepn-original · no Can-do association or graded events"
 });
 return [
  mk("situation","A2-oriented original · "+scene.title,scene.setting+" "+scene.objective+" The course source does not yet substantiate a precise Can-do link; this reading-only journey records no scored evidence."),
  mk("dialogue","Dialogue · Observe the negotiation",scene.notice,scene.dialogue.map(t=>({expression:t.speaker+"： "+t.ja,note:t.en}))),
  mk("text","Connected reading",scene.read.en,[{expression:scene.read.ja,note:scene.read.en}]),
  mk("terms","Language to notice","Original explanatory vocabulary; no automatic proficiency score.",scene.vocabulary.map(v=>({expression:v.ja,note:v.en}))),
  mk("independent","Independent practice · Self-directed",scene.writing+" "+scene.speaking+" Write or say your answer outside this unscored preview until the canonical association can be verified.")
 ];
}
