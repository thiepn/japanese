import type {StudyEvent} from "@thiepn/domain";
import {isStudyLesson,type StudyLesson,type StudyPrompt,type StudyStep} from "@thiepn/study-player";
import {coreContent} from "../coreContent";
import {E02_AVAILABLE_SCENES,buildE02Journey} from "./a1ExcellenceCourse";
import {E03_MAPPED,buildE03Journey} from "./a2ExcellenceCourse";
import {E04_MAPPED,buildE04Journey} from "./a2ExcellenceAdvancedCourse";

/** E19: a second, owner-private writing draft for ORIGINAL source-linked A1/A2
 * scene writing, previously absent outside the seven E06/E11 cases.
 * The FIRST draft is the unchanged E02/E03/E04 original StudyPrompt.
 * Revision uses a separate non-authoritative prompt, never a new Can-do,
 * grading rule, FSRS card, audio claim or synced document namespace.
 */
export type E19Cohort="e02"|"e03"|"e04";
type Source={cohort:E19Cohort;id:string;title:string;level:"A1"|"A2";
 setting:string;goal:string;sourceReading:string;sourceNotice:string;
 unitId:string;canDoId:string;writingTask:string};
export type E19Status="study-source"|"first-draft"|"revise"|"review";
export interface E19CaseProgress {
 key:string;cohort:E19Cohort;sceneId:string;title:string;level:"A1"|"A2";
 setting:string;goal:string;writingTask:string;sourceNotice:string;
 sourceListening:boolean;sourceReading:boolean;sourceReady:boolean;
 status:E19Status;firstDraft:string|null;revisedDraft:string|null;
 firstAt:string|null;revisionAt:string|null;
}
export interface E19Overview{
 cases:E19CaseProgress[];total:number;sourceReady:number;drafted:number;revised:number;
}
const canDoByUnit=new Map(coreContent.courseUnits.map(unit=>[unit.id,unit.canDoId]));
const sources:readonly Source[]=[
 ...E02_AVAILABLE_SCENES.map(s=>({
  cohort:"e02" as const,id:s.id,title:s.title,level:"A1" as const,setting:s.setting,
  goal:s.writingTask,sourceReading:s.dialogue.map(t=>t.ja).join(" "),
  sourceNotice:s.notice,unitId:s.unitId,canDoId:canDoByUnit.get(s.unitId)??"",
  writingTask:s.writingTask
 })),
 ...E03_MAPPED.map(b=>({
  cohort:"e03" as const,id:b.scene.id,title:b.scene.title,level:"A2" as const,
  setting:b.scene.setting,goal:b.scene.objective,sourceReading:b.scene.read.ja,
  sourceNotice:b.scene.notice,unitId:b.unit.id,canDoId:b.canDo.id,
  writingTask:b.scene.writing
 })),
 ...E04_MAPPED.map(b=>({
  cohort:"e04" as const,id:b.scene.id,title:b.scene.title,level:"A2" as const,
  setting:b.scene.setting,goal:b.scene.goal,sourceReading:b.scene.reading.ja,
  sourceNotice:b.scene.focus.map(x=>x.expression+" — "+x.trap).join("; "),
  unitId:b.unit.id,canDoId:b.canDo.id,writingTask:b.scene.writing.prompt
 }))
];
const sourceByKey=new Map(sources.map(source=>[source.cohort+":"+source.id,source]));
function original(source:Source):{first:StudyPrompt;listening:StudyPrompt;reading:StudyPrompt;lessons:StudyLesson[]}{
 if(!source.canDoId||!source.unitId)throw Error("E19_CANONICAL_SOURCE_UNLINKED");
 const steps=source.cohort==="e02"?buildE02Journey(source.id)
  :source.cohort==="e03"?buildE03Journey(source.id):buildE04Journey(source.id);
 const prompts=steps.filter((x):x is StudyPrompt=>!isStudyLesson(x));
 const isOwn=(p:StudyPrompt)=>p.sourceId==="thiepn-original"&&
  p.primaryTarget.kind==="can_do"&&p.primaryTarget.id===source.canDoId&&
  p.eventMetadata?.[source.cohort+"SceneId"]===source.id&&
  p.eventMetadata?.[source.cohort+"UnitId"]===source.unitId;
 const first=prompts.find(p=>p.promptType==="textarea"&&p.id.endsWith("-write")&&isOwn(p));
 const listening=prompts.find(p=>p.skill==="listening"&&p.promptType==="choice"&&isOwn(p));
 const reading=prompts.find(p=>p.skill==="comprehension"&&p.promptType==="choice"&&isOwn(p));
 if(!first||!listening||!reading||first.eventMetadata?.nonAuthoritative!==true||
  first.eventMetadata?.schedulerExcluded!==true||!first.contentVersion||
  listening.eventMetadata?.nonAuthoritative===true||reading.eventMetadata?.nonAuthoritative===true)
  throw Error("E19_ORIGINAL_SOURCE_PROMPTS_MISSING:"+source.id);
 const lessons=steps.filter(isStudyLesson).filter(x=>
  /-(setup|situation|reveal|transcript|dialogue|reading-reveal|reading|notice|focus|independent)$/.test(x.id));
 if(lessons.length<2)throw Error("E19_ORIGINAL_TEACHING_NOT_AVAILABLE:"+source.id);
 return {first,listening,reading,lessons};
}
function latest(events:readonly StudyEvent[],owner:string,prompt:StudyPrompt,now:Date):StudyEvent|null{
 return events.filter(e=>e.userId===owner&&e.metadata?.promptId===prompt.id&&
  e.sourceId===prompt.sourceId&&e.contextId===prompt.contextId&&
  e.contentVersion===prompt.contentVersion&&e.primaryTarget?.kind==="can_do"&&
  e.primaryTarget.id===prompt.primaryTarget.id&&
  e.metadata?.[String(prompt.eventMetadata?.e02?"e02":prompt.eventMetadata?.e03?"e03":"e04")+"SceneId"]===
   prompt.eventMetadata?.[String(prompt.eventMetadata?.e02?"e02":prompt.eventMetadata?.e03?"e03":"e04")+"SceneId"]&&
  Number.isFinite(Date.parse(e.occurredAt))&&Date.parse(e.occurredAt)<=now.getTime()+1000)
  .sort((a,b)=>b.occurredAt.localeCompare(a.occurredAt)||b.id.localeCompare(a.id))[0]??null;
}
function revisionFor(source:Source,first:StudyPrompt):StudyPrompt{
 return {...first,
  id:"e19-"+source.cohort+"-"+source.id+"-revised-writing",
  cueFamily:"e19-"+source.cohort+"-"+source.id+"-revision",
  instruction:"Revise the original Japanese message after inspecting your own first draft",
  prompt:"ORIGINAL SITUATION: "+source.setting+"\nORIGINAL TASK: "+source.writingTask+
   "\nCompare your first message to the source dialogue, notice and audience. Make a meaningful revision; do not copy the first text unchanged.",
  displayAnswer:"Independent second draft · no automatic language grade",
  explanation:"Revision recorded. Compare factual meaning, audience, social register and clarity against the original situation yourself. A changed text alone is not proof of correctness.",
  requiredTerms:[],
  eventMetadata:{...first.eventMetadata,e19:true,e19Stage:"revision",
   e19SourcePromptId:first.id,
   e19WritingChecks:[
    {heading:"Original purpose",question:"Does your revised message accomplish the actual source task?",repair:source.writingTask},
    {heading:"Factual support",question:"Does every claimed fact match what the original source actually said?",repair:source.sourceReading.slice(0,450)},
    {heading:"Audience and appropriateness",question:"Does your wording suit the reader and original practical setting?",repair:source.sourceNotice.slice(0,450)}
   ],
   nonAuthoritative:true,schedulerExcluded:true,
   structuralOnly:true,semanticScore:false,acousticScore:false,accreditedCefrVerdict:false}
 };
}
function textFor(e:StudyEvent|null):string|null{
 if(e?.result!=="skipped"||e.metadata?.nonAuthoritative!==true)return null;
 const v=e.metadata?.learnerResponse;
 return typeof v==="string"&&v.trim()?v.slice(0,9000):null;
}
function evidence(source:Source,owner:string,events:readonly StudyEvent[],now:Date):E19CaseProgress{
 const {first,listening,reading}=original(source);
 const listen=latest(events,owner,listening,now)?.result==="correct";
 const read=latest(events,owner,reading,now)?.result==="correct";
 const firstEvent=latest(events,owner,first,now);
 const firstText=textFor(firstEvent);
 const revisedEvent=latest(events,owner,revisionFor(source,first),now);
 const revisedText=textFor(revisedEvent);
 const ready=listen&&read;
 const status:E19Status=!ready?"study-source":!firstText?"first-draft":!revisedText?"revise":"review";
 return {key:source.cohort+":"+source.id,cohort:source.cohort,sceneId:source.id,title:source.title,
  level:source.level,setting:source.setting,goal:source.goal,writingTask:source.writingTask,
  sourceNotice:source.sourceNotice,sourceListening:listen,sourceReading:read,sourceReady:ready,
  status,firstDraft:firstText,revisedDraft:revisedText,
  firstAt:firstText?firstEvent!.occurredAt:null,revisionAt:revisedText?revisedEvent!.occurredAt:null};
}
export function projectE19Overview(owner:string,events:readonly StudyEvent[],now=new Date()):E19Overview{
 if(!owner||!Number.isFinite(now.getTime()))throw Error("E19_INVALID_OWNER_OR_CLOCK");
 if(events.some(e=>e.userId!==owner))throw Error("E19_OWNER_WORKSPACE_MISMATCH");
 const cases=sources.map(source=>evidence(source,owner,events,now));
 return {cases,total:cases.length,sourceReady:cases.filter(c=>c.sourceReady).length,
  drafted:cases.filter(c=>c.firstDraft!==null).length,
  revised:cases.filter(c=>c.revisedDraft!==null).length};
}
/** Minimal textual change highlight, not a grammar or content score. */
export function compareE19Drafts(first:string,revised:string){
 const before=[...first.trim()],after=[...revised.trim()];
 let prefix=0;while(prefix<before.length&&prefix<after.length&&before[prefix]===after[prefix])prefix++;
 let suffix=0;while(suffix<before.length-prefix&&suffix<after.length-prefix&&
  before[before.length-1-suffix]===after[after.length-1-suffix])suffix++;
 return {changed:first.trim()!==revised.trim(),
  beforeChange:before.slice(prefix,before.length-suffix).join(""),
  afterChange:after.slice(prefix,after.length-suffix).join(""),
  beforeLength:before.length,afterLength:after.length};
}
/** Explicit first/revised stages. The first StudyPrompt is original, revision
 * is optional + unscored, never a second canonical grade or scheduler. */
export function buildE19WritingSession(key:string,owner:string,events:readonly StudyEvent[],now=new Date()):StudyStep[]{
 if(!owner||events.some(e=>e.userId!==owner))throw Error("E19_OWNER_WORKSPACE_MISMATCH");
 const source=sourceByKey.get(key);
 if(!source)throw Error("E19_UNLINKED_OR_UNKNOWN_SOURCE:"+key);
 const progress=evidence(source,owner,events,now);
 if(!progress.sourceReady)throw Error("E19_LISTENING_AND_READING_SOURCE_FIRST:"+key);
 const {first,lessons}=original(source);
 // StudyLesson.contextId is required whereas StudyPrompt.contextId is optional.
 // Fail closed rather than manufacturing a context for a source writing prompt.
 const contextId=first.contextId;
 if(!contextId)throw Error("E19_ORIGINAL_CONTEXT_MISSING:"+key);
 const guide:StudyLesson={kind:"lesson",id:"e19-"+source.cohort+"-"+source.id+"-guide",
  title:"Independent Japanese · "+source.title,
  body:"Original setting: "+source.setting+" Original writing task: "+source.writingTask+
   " Read the original source text, identify its actual facts and reader, and decide what you mean before drafting. A structural word or length check is not a Japanese-language grade.",
  contextId,sourceLabel:"Original THIEPN scene · "+source.unitId+" · unscored independent writing",
  facts:[{label:"Original linked Can-do",value:source.canDoId},
   {label:"Original source task",value:source.writingTask}],
  examples:[{expression:source.sourceReading,note:"Original Japanese source context; compare the facts, not merely vocabulary."}]};
 const context=lessons.filter(item=>!/-(independent)$/.test(item.id)).slice(0,4);
 if(!progress.firstDraft)return [guide,...context,first,
  {kind:"lesson",id:"e19-"+source.cohort+"-"+source.id+"-return",
   title:"First draft saved · return for your revision",
   body:"The original optional response is stored only as an unscored StudyEvent. Return to Learn → Independent writing for the second draft. No automatic grammar, pragmatics or pronunciation assessment occurred.",
   contextId,sourceLabel:"Original THIEPN independent A1/A2 practice"}];
 const revision=revisionFor(source,first);
 const checklist:StudyLesson={kind:"lesson",id:"e19-"+source.cohort+"-"+source.id+"-revision-coach",
  title:"Compare facts and audience · then rewrite",
  body:"Use the original written situation and source teaching to examine your own message. Does the recipient know the necessary details? Have you preserved conditions and avoided claiming an unconfirmed outcome? Does the response sound appropriate for the described relationship? These are questions for self-review, not an automatic verdict.",
  contextId,sourceLabel:"Original THIEPN source teaching · privately saved writing",
  examples:[{expression:"Your prior E19 source first draft (private)",note:progress.firstDraft},
   {expression:"Source explanation",note:source.sourceNotice}]};
 return [guide,...context,checklist,revision,
  {kind:"lesson",id:"e19-"+source.cohort+"-"+source.id+"-compare",
   title:"Second message recorded · review real changes",
   body:"Return to Learn to compare your private first and revised messages. Only genuine text edits are displayed; nothing here is a semantic score, certified skill, or new FSRS review.",
   contextId,sourceLabel:"Original THIEPN independent A1/A2 practice"}];
}
