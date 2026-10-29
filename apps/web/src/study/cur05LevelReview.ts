import type {StudyPrompt} from "@thiepn/study-player";
import type {MemoryTrace} from "@thiepn/scheduler";
import {coreContent,senseForLexeme,sourceTitle} from "../coreContent";
import {COURSE_LEVELS,type CourseLevel} from "./cefrCourseCatalog";
import registry from "../../../../content/sources/registry.json";

export type CourseReviewLevel=CourseLevel|"unassigned";
/** Must match the existing native StudyPlayer session capacity, not create a second scheduler. */
export const CUR08_REVIEW_BATCH_SIZE=16;
export type Cur08ReviewOrder="earliest"|"balanced";
export interface Cur08ReviewBatchPlan {
 readonly selectionDue:number;readonly queueSize:number;readonly remainingDue:number;
 readonly selectedLevels:number;readonly order:Cur08ReviewOrder;
}

export interface VocabularyCourseLink {readonly id:string;readonly title:string;readonly level:CourseLevel;}
export interface CourseReviewWord {
 readonly id:string;readonly writing:string;readonly reading:string;readonly meaning:string;
 readonly sourceIds:readonly string[];readonly sourceTitles:readonly string[];
 readonly levels:readonly CourseLevel[];readonly units:readonly VocabularyCourseLink[];
 readonly due:number;readonly scheduled:number;
}
export interface CourseLevelReviewOverview {
 readonly accountId:string;readonly generatedAt:string;readonly globalDue:number;
 readonly mappedVocabularyDue:number;readonly otherDue:number;
 readonly perLevel:readonly {level:CourseReviewLevel;wordCount:number;due:number;scheduled:number}[];
 readonly words:readonly CourseReviewWord[];
}
const sourceById=new Map(registry.sources.map(source=>[source.id,source]));
const levels=new Set<string>(COURSE_LEVELS);
export const courseReviewTraceId=(prompt:StudyPrompt):string=>
 prompt.primaryTarget.kind+":"+prompt.primaryTarget.id+":"+prompt.skill+":"+prompt.cueFamily;
/** Never trust a stored due timestamp when its canonical identity fields disagree. */
function assertTraceIdentity(prompt:StudyPrompt,trace:MemoryTrace):void{
 if(trace.id!==courseReviewTraceId(prompt)||trace.entity.kind!==prompt.primaryTarget.kind||
  trace.entity.id!==prompt.primaryTarget.id||trace.skillDimension!==prompt.skill||
  trace.cueFamily!==prompt.cueFamily)
   throw Error("CUR08_TRACE_IDENTITY_CONFLICT:"+trace.id);
}


export function normalizeCourseReviewLevels(input:readonly CourseReviewLevel[]):CourseReviewLevel[]{
 if(!input.length||input.some(v=>v!=="unassigned"&&!levels.has(v)))throw Error("CUR05_INVALID_LEVEL_SELECTION");
 return [...new Set(input)];
}
function trustedLexemeSource(ids:readonly string[]):boolean{
 return ids.length>0&&ids.every(id=>Boolean(sourceById.get(id)?.publicExport));
}
export function projectCourseLevelReview(input:{
 accountId:string;traces:readonly MemoryTrace[];vocabularyPrompts:readonly StudyPrompt[];
 globalPrompts:readonly StudyPrompt[];now:Date;
}):CourseLevelReviewOverview{
 const {accountId,traces,vocabularyPrompts,globalPrompts,now}=input;
 if(!accountId.trim()||!Number.isFinite(now.getTime()))throw Error("CUR05_INVALID_OWNER_OR_CLOCK");
 if(traces.some(t=>t.userId!==accountId))throw Error("CUR05_FOREIGN_ACCOUNT_TRACE");
 const tracesById=new Map<string,MemoryTrace>();
 for(const trace of traces){
  if(tracesById.has(trace.id))throw Error("CUR05_DUPLICATE_TRACE");
  tracesById.set(trace.id,trace);
 }
 const due=(prompt:StudyPrompt):boolean=>{
  const trace=tracesById.get(courseReviewTraceId(prompt));
  if(!trace)return false;
  assertTraceIdentity(prompt,trace);
  const at=Date.parse(trace.card.due);
  if(!Number.isFinite(at))throw Error("CUR05_INVALID_DUE_DATE:"+trace.id);
  return at<=now.getTime();
 };
 const uniqueGlobal=new Map(globalPrompts.map(prompt=>[courseReviewTraceId(prompt),prompt] as const));
 const globalDue=[...uniqueGlobal.values()].filter(due).length;
 const unitsByWord=new Map<string,VocabularyCourseLink[]>();
 const allUnits=coreContent.courseUnits;
 for(const unit of allUnits){
  if(!levels.has(unit.level))throw Error("CUR05_INVALID_CANONICAL_LEVEL:"+unit.id);
  if(!trustedLexemeSource(unit.sourceIds))throw Error("CUR05_UNLICENSED_UNIT:"+unit.id);
  for(const wordId of unit.vocabularyIds){
   const arr=unitsByWord.get(wordId)??[];
   if(!arr.some(v=>v.id===unit.id))arr.push({id:unit.id,title:unit.title,level:unit.level as CourseLevel});
   unitsByWord.set(wordId,arr);
  }
 }
 const wordsById=new Map(coreContent.lexemes.map(w=>[w.id,w]));
 const grouped=new Map<string,StudyPrompt[]>();
 for(const prompt of vocabularyPrompts){
  if(prompt.primaryTarget.kind!=="lexeme")throw Error("CUR05_NON_VOCAB_PROMPT");
  const word=wordsById.get(prompt.primaryTarget.id);
  if(!word||!trustedLexemeSource(word.sourceIds)||!prompt.sourceId||!word.sourceIds.includes(prompt.sourceId))
   throw Error("CUR05_UNKNOWN_OR_UNLICENSED_WORD:"+prompt.id);
  const arr=grouped.get(word.id)??[];
  if(!arr.some(p=>courseReviewTraceId(p)===courseReviewTraceId(prompt)))arr.push(prompt);
  grouped.set(word.id,arr);
 }
 const words:CourseReviewWord[]=[];
 for(const lexeme of coreContent.lexemes){
  const prompts=grouped.get(lexeme.id);if(!prompts?.length)continue;
  const units=unitsByWord.get(lexeme.id)??[];
  const usedLevels=COURSE_LEVELS.filter(level=>units.some(unit=>unit.level===level));
  const sourceIds=lexeme.sourceIds.filter(id=>sourceById.get(id)?.publicExport);
  const sense=senseForLexeme(lexeme);
  const active=prompts.filter(p=>{const trace=tracesById.get(courseReviewTraceId(p));if(trace)assertTraceIdentity(p,trace);return Boolean(trace);});
  words.push({id:lexeme.id,writing:lexeme.canonicalForm,reading:lexeme.readings[0]?.text??lexeme.canonicalForm,
   meaning:sense.glosses.join(" / "),sourceIds,sourceTitles:sourceIds.map(sourceTitle),
   levels:usedLevels,units,due:prompts.filter(due).length,
   scheduled:active.length});
 }
 const knownDue=new Set<string>();
 for(const prompt of vocabularyPrompts)if(due(prompt))knownDue.add(courseReviewTraceId(prompt));
 const perLevel:CourseLevelReviewOverview["perLevel"]=([...COURSE_LEVELS,"unassigned"] as CourseReviewLevel[]).map(level=>{
  const selected=words.filter(word=>level==="unassigned"?!word.levels.length:word.levels.includes(level as CourseLevel));
  return {level,wordCount:selected.length,due:selected.reduce((total,word)=>total+word.due,0),
   scheduled:selected.reduce((total,word)=>total+word.scheduled,0)};
 });
 return {accountId,generatedAt:now.toISOString(),globalDue,mappedVocabularyDue:knownDue.size,
  otherDue:Math.max(0,globalDue-knownDue.size),perLevel,words};
}
/** Deduplicates shared cross-level prompts and never creates a new review card. */
export function selectCourseDuePrompts(input:{
 levels:readonly CourseReviewLevel[];overview:CourseLevelReviewOverview;
 prompts:readonly StudyPrompt[];traces:readonly MemoryTrace[];now:Date;limit?:number;
 order?:Cur08ReviewOrder;
}):StudyPrompt[]{
 const selected=normalizeCourseReviewLevels(input.levels);
 if(!Number.isFinite(input.now.getTime()))throw Error("CUR05_INVALID_CLOCK");
 const limit=input.limit??CUR08_REVIEW_BATCH_SIZE;
 if(!Number.isSafeInteger(limit)||limit<1||limit>64)throw Error("CUR05_INVALID_LIMIT");
 const order=input.order??(selected.length>1?"balanced":"earliest");
 if(order!=="earliest"&&order!=="balanced")throw Error("CUR08_INVALID_ORDER");
 const chosenWords=input.overview.words.filter(word=>selected.includes("unassigned")&&!word.levels.length
  ||word.levels.some(level=>selected.includes(level)));
 const words=new Set(chosenWords.map(word=>word.id));
 const byWord=new Map(chosenWords.map(word=>[word.id,word] as const));
 const traces=new Map(input.traces.map(trace=>[trace.id,trace]));
 if(input.traces.some(trace=>trace.userId!==input.overview.accountId)||traces.size!==input.traces.length)
  throw Error("CUR05_CROSS_OWNER_OR_DUPLICATE_TRACE");
 const candidates=new Map<string,{prompt:StudyPrompt;due:number}>();
 for(const prompt of input.prompts){
  if(prompt.primaryTarget.kind!=="lexeme"||!words.has(prompt.primaryTarget.id))continue;
  const word=byWord.get(prompt.primaryTarget.id);
  if(!word||!prompt.sourceId||!word.sourceIds.includes(prompt.sourceId)||
    !Boolean(sourceById.get(prompt.sourceId)?.publicExport))
    throw Error("CUR08_SOURCE_ATTRIBUTION_CONFLICT:"+prompt.id);
  const id=courseReviewTraceId(prompt),trace=traces.get(id);if(!trace)continue;
  assertTraceIdentity(prompt,trace);
  const at=Date.parse(trace.card.due);
  if(!Number.isFinite(at))throw Error("CUR05_INVALID_DUE_DATE:"+id);
  if(at<=input.now.getTime())candidates.set(id,{prompt,due:at});
 }
 const due=[...candidates.values()].sort((a,b)=>a.due-b.due||a.prompt.id.localeCompare(b.prompt.id));
 if(order==="earliest"||selected.length===1)return due.slice(0,limit).map(x=>x.prompt);
 // Each original due trace enters exactly one bucket; shared-unit words never get duplicated.
 // Within each source-level bucket, the original FSRS due priority stays chronological.
 const buckets=new Map(selected.map(level=>[level,[] as typeof due]));
 for(const entry of due){
  const word=byWord.get(entry.prompt.primaryTarget.id)!;
  const eligible=selected.filter(level=>level==="unassigned"?!word.levels.length:word.levels.includes(level));
  if(!eligible.length)throw Error("CUR08_UNATTRIBUTED_REVIEW:"+entry.prompt.id);
  const target=eligible.reduce((best,level)=>buckets.get(level)!.length<buckets.get(best)!.length?level:best,eligible[0]!);
  buckets.get(target)!.push(entry);
 }
 const result:StudyPrompt[]=[];
 let cursor=0;
 while(result.length<limit){
  let added=false;
  for(const level of selected){
   const bucket=buckets.get(level)!;
   if(cursor<bucket.length){result.push(bucket[cursor]!.prompt);added=true;}
   if(result.length===limit)break;
  }
  if(!added)break;
  cursor++;
 }
 return result;
}
export function courseReviewBatchPlan(overview:CourseLevelReviewOverview,selection:readonly CourseReviewLevel[]):Cur08ReviewBatchPlan{
 const levels=normalizeCourseReviewLevels(selection);
 const due=reviewSelectionCounts(overview,levels).due;
 if(!Number.isSafeInteger(due)||due<0)throw Error("CUR08_INVALID_DUE_COUNT");
 const queueSize=Math.min(due,CUR08_REVIEW_BATCH_SIZE);
 return {selectionDue:due,queueSize,remainingDue:due-queueSize,
  selectedLevels:levels.length,order:levels.length>1?"balanced":"earliest"};
}
export function reviewSelectionCounts(overview:CourseLevelReviewOverview,selection:readonly CourseReviewLevel[]){
 const active=normalizeCourseReviewLevels(selection);
 const words=overview.words.filter(w=>(!w.levels.length&&active.includes("unassigned"))
   ||w.levels.some(level=>active.includes(level)));
 return {wordCount:words.length,due:words.reduce((n,w)=>n+w.due,0),scheduled:words.reduce((n,w)=>n+w.scheduled,0)};
}
