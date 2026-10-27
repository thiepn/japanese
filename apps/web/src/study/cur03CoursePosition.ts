import type {StudyStep} from "@thiepn/study-player";

/**
 * Local navigation only. The hash covers the authoritative ordered source
 * content while storing no prompt bodies, responses, accepted answers or grades.
 */
const PREFIX="thiepn-japanese-cur04-position-v2:";
const MAX_STEPS=1200;
type Position={version:2;unitId:string;stepId:string;ordinal:number;fingerprint:string;updatedAt:number};
export interface PositionStore {getItem(key:string):string|null;setItem(key:string,value:string):void;removeItem(key:string):void;}
export function coursePositionKey(owner:string,unitId:string):string{
 if(!owner.trim()||owner.length>250||!/^[-a-z0-9]+$/i.test(unitId))throw Error("CUR03_BAD_SCOPE");
 return PREFIX+encodeURIComponent(owner)+":"+unitId;
}
function storage():PositionStore|null{try{return typeof localStorage==="undefined"?null:localStorage}catch{return null}}
/** 64-bit FNV-1a is a change detector, not authentication or a security proof. */
function hashSource(text:string):string{
 let hash=0xcbf29ce484222325n;
 for(let i=0;i<text.length;i++)hash=BigInt.asUintN(64,(hash^BigInt(text.charCodeAt(i)))*0x100000001b3n);
 return hash.toString(16).padStart(16,"0");
}
export function coursePositionFingerprint(steps:readonly StudyStep[]):string{
 if(!steps.length||steps.length>MAX_STEPS||steps.some(step=>!step||!step.id||step.id.length>200))
  throw Error("CUR03_INVALID_STEPS");
 const ids=steps.map(step=>step.id);
 if(new Set(ids).size!==ids.length)throw Error("CUR03_DUPLICATE_STEP");
 // Includes source/content version, actual instructional explanations, option
 // semantics and per-prompt provenance, not just the old display order.
 return hashSource(JSON.stringify(steps));
}
export function readCoursePosition(owner:string,unitId:string,steps:readonly StudyStep[],store:PositionStore|null=storage()):number{
 const key=coursePositionKey(owner,unitId),fingerprint=coursePositionFingerprint(steps);
 try{
  const raw=store?.getItem(key);if(!raw||raw.length>2048)return 0;
  const p=JSON.parse(raw) as Position;
  if(p.version!==2||p.unitId!==unitId||p.fingerprint!==fingerprint||
     !Number.isSafeInteger(p.ordinal)||p.ordinal<0||p.ordinal>=steps.length||
     p.stepId!==steps[p.ordinal]?.id||!Number.isFinite(p.updatedAt))
   return 0;
  return p.ordinal;
 }catch{return 0}
}
export function saveCoursePosition(owner:string,unitId:string,steps:readonly StudyStep[],index:number,store:PositionStore|null=storage()):boolean{
 const key=coursePositionKey(owner,unitId),fingerprint=coursePositionFingerprint(steps);
 if(!Number.isSafeInteger(index)||index<0||index>=steps.length)throw Error("CUR03_BAD_POSITION");
 const next:Position={version:2,unitId,stepId:steps[index]!.id,ordinal:index,fingerprint,updatedAt:Date.now()};
 try{if(!store)return false;store.setItem(key,JSON.stringify(next));return true}catch{return false}
}
export function clearCoursePosition(owner:string,unitId:string,store:PositionStore|null=storage()):boolean{
 const key=coursePositionKey(owner,unitId);
 try{if(!store)return false;store.removeItem(key);return true}catch{return false}
}
/** A saved answer makes the following step the safe starting point. */
export function nextSavedPosition(index:number,steps:readonly StudyStep[]):number{
 coursePositionFingerprint(steps);
 if(!Number.isSafeInteger(index)||index<0||index>=steps.length)throw Error("CUR03_BAD_POSITION");
 return Math.min(index+1,steps.length-1);
}
