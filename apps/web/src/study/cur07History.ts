import type {StudyStep} from "@thiepn/study-player";
import {coursePositionFingerprint,coursePositionKey,saveCoursePosition,type PositionStore} from "./cur03CoursePosition";

/** Device-local, account-scoped navigation receipts, not answer history or signed credentials. */
const PREFIX="thiepn-japanese-cur07-history-v1:";
const MAX_ENTRIES=4;
const MAX_AGE_MS=180*24*60*60*1000;
const MAX_STORE_BYTES=2200;
const MAX_KEY=220;
export type Cur07Receipt={
 version:1;sessionKey:string;sectionId:string;sectionHash:string;sessionHash:string;
 ordinal:number;recordedAt:number;
};
export type Cur07Recovery={
 receipt:Cur07Receipt;currentOrdinal:number|null;status:"recoverable"|"changed_or_removed";
};
export interface Cur07HistoryStore extends PositionStore {}
function defaultStore():Cur07HistoryStore|null{
 try{return typeof localStorage==="undefined"?null:localStorage;}catch{return null}
}
function keyFor(owner:string,sessionKey:string):string{
 // Use the same owner and trusted session-name requirements as CUR-04.
 coursePositionKey(owner,sessionKey);
 if(sessionKey.length>MAX_KEY||!sessionKey.startsWith("cur06-")&&!sessionKey.startsWith("cur07-"))
  throw Error("CUR07_NOT_VOCABULARY_SESSION");
 return PREFIX+encodeURIComponent(owner)+":"+sessionKey;
}
function validatedReceipt(r:unknown,key:string,now:number):r is Cur07Receipt{
 if(typeof r!=="object"||r===null)return false;
 const v=r as Partial<Cur07Receipt>;
 return v.version===1&&v.sessionKey===key&&
  typeof v.sectionId==="string"&&v.sectionId.length>0&&v.sectionId.length<201&&
  typeof v.sectionHash==="string"&&/^[a-f0-9]{16}$/.test(v.sectionHash)&&
  typeof v.sessionHash==="string"&&/^[a-f0-9]{16}$/.test(v.sessionHash)&&
  typeof v.ordinal==="number"&&Number.isSafeInteger(v.ordinal)&&v.ordinal>=0&&v.ordinal<=1200&&
  typeof v.recordedAt==="number"&&Number.isFinite(v.recordedAt)&&v.recordedAt<=now+300000&&
  now-v.recordedAt<=MAX_AGE_MS;
}
function read(owner:string,sessionKey:string,store:Cur07HistoryStore|null,now:number):Cur07Receipt[]{
 const storageKey=keyFor(owner,sessionKey);
 try{
  const raw=store?.getItem(storageKey);
  if(!raw||raw.length>MAX_STORE_BYTES)return [];
  const parsed=JSON.parse(raw) as unknown;
  if(!Array.isArray(parsed)||parsed.length>MAX_ENTRIES||
   !parsed.every(entry=>validatedReceipt(entry,sessionKey,now)))return [];
  if(new Set(parsed.map(item=>(item as Cur07Receipt).sectionId+":"+(item as Cur07Receipt).sessionHash)).size!==parsed.length)return [];
  return parsed as Cur07Receipt[];
 }catch{return []}
}
function identity(source:StudyStep[],sectionId:string,sectionHash:string):number|null{
 const matching=source.map((step,index)=>({step,index})).filter(x=>x.step.id===sectionId);
 if(matching.length!==1)return null;
 return coursePositionFingerprint([matching[0]!.step])===sectionHash?matching[0]!.index:null;
}
export function cur07HistoryKey(owner:string,sessionKey:string):string{return keyFor(owner,sessionKey)}
/** Saves only the original source section's hash and bounded device-local position. */
export function rememberCur07Section(owner:string,sessionKey:string,steps:StudyStep[],ordinal:number,
 store:Cur07HistoryStore|null=defaultStore(),now=Date.now()):boolean{
 const storageKey=keyFor(owner,sessionKey);
 const sessionHash=coursePositionFingerprint(steps);
 if(!Number.isSafeInteger(ordinal)||ordinal<0||ordinal>=steps.length)throw Error("CUR07_INVALID_ORDINAL");
 if(!Number.isFinite(now))throw Error("CUR07_INVALID_TIME");
 const step=steps[ordinal]!;
 const snapshot:Cur07Receipt={version:1,sessionKey,sectionId:step.id,
  sectionHash:coursePositionFingerprint([step]),sessionHash,ordinal,recordedAt:now};
 try{
  if(!store)return false;
  const old=read(owner,sessionKey,store,now).filter(r=>r.sectionId!==snapshot.sectionId||r.sessionHash!==sessionHash);
  const next=[snapshot,...old].slice(0,MAX_ENTRIES);
  // Best-effort same-turn continuity, not atomic CAS across tabs.
  const seen=store.getItem(storageKey);
  if(seen&&seen.length>MAX_STORE_BYTES)return false;
  store.setItem(storageKey,JSON.stringify(next));
  return true;
 }catch{return false}
}
export function inspectCur07History(owner:string,sessionKey:string,steps:StudyStep[],
 store:Cur07HistoryStore|null=defaultStore(),now=Date.now()):Cur07Recovery[]{
 keyFor(owner,sessionKey);
 const current=coursePositionFingerprint(steps);
 return read(owner,sessionKey,store,now).filter(r=>r.sessionHash!==current).map(receipt=>{
  const index=identity(steps,receipt.sectionId,receipt.sectionHash);
  return {receipt,currentOrdinal:index,status:index===null?"changed_or_removed":"recoverable"};
 });
}
/** Only the exact same original source section can become a new CUR-04 current pointer. */
export function restoreCur07Section(owner:string,sessionKey:string,steps:StudyStep[],
 receipt:Cur07Receipt,store:Cur07HistoryStore|null=defaultStore(),now=Date.now()):number|null{
 keyFor(owner,sessionKey);
 const old=read(owner,sessionKey,store,now);
 if(!old.some(r=>r.sectionId===receipt.sectionId&&r.sessionHash===receipt.sessionHash&&
  r.sectionHash===receipt.sectionHash&&r.recordedAt===receipt.recordedAt))return null;
 const current=coursePositionFingerprint(steps);
 if(current===receipt.sessionHash)return null; // ordinary CUR-04 resume handles identical sessions
 const index=identity(steps,receipt.sectionId,receipt.sectionHash);
 if(index===null)return null;
 if(!saveCoursePosition(owner,sessionKey,steps,index,store))return null;
 // Preserve receipt until new section navigation explicitly adds its own generation.
 return index;
}
