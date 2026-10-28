import type {StudyPrompt} from "@thiepn/study-player";
import type {MemoryTrace} from "@thiepn/scheduler";
import {coursePositionFingerprint} from "./cur03CoursePosition";
import {courseReviewTraceId,normalizeCourseReviewLevels,CUR08_REVIEW_BATCH_SIZE,
 type CourseReviewLevel,type CourseLevelReviewOverview} from "./cur05LevelReview";

/** CUR-09: navigation-only Account/device-local receipt; no reviews, answers, or scheduler writes. */
const PREFIX="thiepn-japanese-cur09-review-v1:";
const MAX_AGE=7*24*60*60*1000;
const MAX_BYTES=4500;
export interface Cur09ReviewStore {
 getItem(key:string):string|null;
 setItem(key:string,value:string):void;
 removeItem(key:string):void;
}
export type Cur09ReviewReceipt={
 readonly version:1;readonly owner:string;readonly levels:readonly CourseReviewLevel[];
 readonly queue:readonly {id:string;traceId:string;sourceId:string;revision:number;due:string}[];
 readonly sourceFingerprint:string;readonly cursor:number;readonly savedAt:number;
};
function liveStore():Cur09ReviewStore|null{
 try{return typeof localStorage==="undefined"?null:localStorage;}catch{return null;}
}
function ownerKey(owner:string):string{
 if(!owner.trim()||owner.length>250)throw Error("CUR09_INVALID_OWNER");
 return PREFIX+encodeURIComponent(owner);
}
function sameScope(a:readonly CourseReviewLevel[],b:readonly CourseReviewLevel[]):boolean{
 return a.length===b.length&&a.every((level,i)=>b[i]===level);
}
function hasValidShape(raw:unknown,owner:string,now:number):raw is Cur09ReviewReceipt{
 if(!raw||typeof raw!=="object")return false;
 const r=raw as Partial<Cur09ReviewReceipt>;
 if(r.version!==1||r.owner!==owner||!Array.isArray(r.levels)||!Array.isArray(r.queue)||
   !Number.isFinite(now)||typeof r.savedAt!=="number"||!Number.isFinite(r.savedAt)||
   r.savedAt>now+300000||now-r.savedAt>MAX_AGE||r.queue.length<1||
   r.queue.length>CUR08_REVIEW_BATCH_SIZE||typeof r.cursor!=="number"||
   !Number.isSafeInteger(r.cursor)||r.cursor<0||r.cursor>=r.queue.length||
   typeof r.sourceFingerprint!=="string"||!/^[a-f0-9]{16}$/.test(r.sourceFingerprint))return false;
 try{
  if(!sameScope(normalizeCourseReviewLevels(r.levels as CourseReviewLevel[]),r.levels as CourseReviewLevel[]))
   return false;
 }catch{return false;}
 const ids=new Set<string>();
 for(const candidate of r.queue){
  if(!candidate||typeof candidate.id!=="string"||candidate.id.length<1||candidate.id.length>200||
    typeof candidate.traceId!=="string"||candidate.traceId.length<1||candidate.traceId.length>250||
    typeof candidate.sourceId!=="string"||candidate.sourceId.length<1||candidate.sourceId.length>150||
    !Number.isSafeInteger(candidate.revision)||candidate.revision<0||
    typeof candidate.due!=="string"||!Number.isFinite(Date.parse(candidate.due))||
    ids.has(candidate.traceId))return false;
  ids.add(candidate.traceId);
 }
 return true;
}
export function readCur09Review(owner:string,store:Cur09ReviewStore|null=liveStore(),
 now=Date.now()):Cur09ReviewReceipt|null{
 const key=ownerKey(owner);
 try{
  const raw=store?.getItem(key);
  if(!raw||raw.length>MAX_BYTES)return null;
  const parsed=JSON.parse(raw) as unknown;
  return hasValidShape(parsed,owner,now)?parsed:null;
 }catch{return null;}
}
function inspectTrace(prompt:StudyPrompt,trace:MemoryTrace,owner:string):void{
 if(trace.userId!==owner||trace.id!==courseReviewTraceId(prompt)||
  trace.entity.kind!==prompt.primaryTarget.kind||trace.entity.id!==prompt.primaryTarget.id||
  trace.skillDimension!==prompt.skill||trace.cueFamily!==prompt.cueFamily||
  !Number.isSafeInteger(trace.revision)||trace.revision<0||!Number.isFinite(Date.parse(trace.card.due)))
  throw Error("CUR09_TRACE_IDENTITY_CONFLICT:"+trace.id);
}
export function createCur09Review(owner:string,levels:readonly CourseReviewLevel[],
 queue:readonly StudyPrompt[],traces:readonly MemoryTrace[],now=Date.now()):Cur09ReviewReceipt{
 ownerKey(owner);
 const selected=normalizeCourseReviewLevels(levels);
 if(!Number.isFinite(now)||!queue.length||queue.length>CUR08_REVIEW_BATCH_SIZE)
  throw Error("CUR09_INVALID_QUEUE");
 const ids=new Set<string>();
 const byTrace=new Map(traces.map(trace=>[trace.id,trace]));
 if(byTrace.size!==traces.length||traces.some(t=>t.userId!==owner))
  throw Error("CUR09_CROSS_OWNER_OR_DUPLICATE_TRACE");
 const stored=queue.map(prompt=>{
  const id=courseReviewTraceId(prompt);
  const trace=byTrace.get(id);
  if(prompt.primaryTarget.kind!=="lexeme"||prompt.eventMetadata?.schedulerExcluded===true||
    prompt.eventMetadata?.nonAuthoritative===true||!prompt.sourceId||!trace||
    ids.has(id))throw Error("CUR09_INVALID_OR_DUPLICATE_PROMPT");
  inspectTrace(prompt,trace,owner);
  if(Date.parse(trace.card.due)>now)throw Error("CUR09_NOT_DUE");
  ids.add(id);
  return {id:prompt.id,traceId:id,sourceId:prompt.sourceId,
   revision:trace.revision,due:trace.card.due};
 });
 const receipt:Cur09ReviewReceipt={version:1,owner,levels:selected,queue:stored,
  sourceFingerprint:coursePositionFingerprint(queue),cursor:0,savedAt:now};
 if(JSON.stringify(receipt).length>MAX_BYTES)throw Error("CUR09_RECEIPT_TOO_LARGE");
 return receipt;
}
export function saveCur09Review(owner:string,receipt:Cur09ReviewReceipt,
 store:Cur09ReviewStore|null=liveStore(),now=Date.now()):boolean{
 const key=ownerKey(owner);
 if(!hasValidShape(receipt,owner,now))throw Error("CUR09_INVALID_RECEIPT");
 try{if(!store)return false;store.setItem(key,JSON.stringify(receipt));return true;}catch{return false;}
}
/** A navigation-only skip must never suppress an original FSRS due prompt.
 * The App provides only IDs observed after the native original StudyEvent commit. */
export function canAdvanceCur09AfterCommit(steps:readonly StudyPrompt[],cursor:number,next:number,
 committed:ReadonlySet<string>):boolean{
 if(!Number.isSafeInteger(cursor)||!Number.isSafeInteger(next)||cursor<0||cursor>=steps.length||
  next<cursor||next>=steps.length)return false;
 return next===cursor||(next===cursor+1&&committed.has(steps[cursor]!.id));
}
/** Called only after original StudyPlayer successfully commits an original StudyEvent. */
export function advanceCur09Review(owner:string,steps:readonly StudyPrompt[],next:number,
 store:Cur09ReviewStore|null=liveStore(),now=Date.now()):boolean{
 const r=readCur09Review(owner,store,now);
 if(!r||coursePositionFingerprint(steps)!==r.sourceFingerprint||
  !Number.isSafeInteger(next)||next<r.cursor||next>Math.min(r.cursor+1,steps.length-1)||
  steps.length!==r.queue.length||steps.some((p,i)=>p.id!==r.queue[i]?.id||
  courseReviewTraceId(p)!==r.queue[i]?.traceId))return false;
 return saveCur09Review(owner,{...r,cursor:next,savedAt:now},store,now);
}
export function clearCur09Review(owner:string,store:Cur09ReviewStore|null=liveStore()):boolean{
 const key=ownerKey(owner);
 try{if(!store)return false;store.removeItem(key);return true;}catch{return false;}
}
export type Cur09Restoration={
 readonly levels:readonly CourseReviewLevel[];readonly prompts:StudyPrompt[];
 readonly skippedChanged:number;readonly pendingAtSnapshot:number;
};
/** Current original source content is authoritative; stale revisions and changed sources never replay. */
export function resolveCur09Review(owner:string,receipt:Cur09ReviewReceipt|null,
 original:readonly StudyPrompt[],traces:readonly MemoryTrace[],overview:CourseLevelReviewOverview,
 now=Date.now()):Cur09Restoration|null{
 ownerKey(owner);
 if(!receipt||!hasValidShape(receipt,owner,now)||overview.accountId!==owner||
  traces.some(t=>t.userId!==owner))return null;
 const byId=new Map(original.map(p=>[p.id,p]));
 if(byId.size!==original.length)return null;
 const ordered=receipt.queue.map(entry=>byId.get(entry.id));
 if(ordered.some(x=>!x))return null;
 const canonical=ordered as StudyPrompt[];
 if(coursePositionFingerprint(canonical)!==receipt.sourceFingerprint)return null;
 const words=new Map(overview.words.map(word=>[word.id,word] as const));
 for(let i=0;i<canonical.length;i++){
  const prompt=canonical[i]!,entry=receipt.queue[i]!,word=words.get(prompt.primaryTarget.id);
  if(prompt.primaryTarget.kind!=="lexeme"||prompt.id!==entry.id||
   courseReviewTraceId(prompt)!==entry.traceId||prompt.sourceId!==entry.sourceId||
   !word||!word.sourceIds.includes(entry.sourceId)||
   !receipt.levels.some(level=>level==="unassigned"?!word.levels.length:word.levels.includes(level))||
   prompt.eventMetadata?.schedulerExcluded===true||prompt.eventMetadata?.nonAuthoritative===true)
   return null;
 }
 const byTrace=new Map(traces.map(t=>[t.id,t]));
 if(byTrace.size!==traces.length)return null;
 const prompts:StudyPrompt[]=[];
 let skippedChanged=0;
 for(let i=receipt.cursor;i<canonical.length;i++){
  const prompt=canonical[i]!,entry=receipt.queue[i]!,trace=byTrace.get(entry.traceId);
  if(!trace){skippedChanged++;continue;}
  inspectTrace(prompt,trace,owner);
  if(trace.revision!==entry.revision||trace.card.due!==entry.due||
   Date.parse(trace.card.due)>now){skippedChanged++;continue;}
  prompts.push(prompt);
 }
 return {levels:receipt.levels,prompts,skippedChanged,
  pendingAtSnapshot:receipt.queue.length-receipt.cursor};
}
