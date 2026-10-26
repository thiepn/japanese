import type {StudyStep} from "@thiepn/study-player";

/** Navigation only. Learner's Japanese, audio, answers and grades never enter this store. */
const PREFIX="thiepn-japanese-cur03-position-v1:";
const MAX_STEPS=1200;
type Position={version:1;unitId:string;stepId:string;ordinal:number;manifest:string;updatedAt:number};
export interface PositionStore {getItem(key:string):string|null;setItem(key:string,value:string):void;removeItem(key:string):void;}
export const coursePositionKey=(owner:string,unitId:string)=>{
 if(!owner.trim()||owner.length>250||!/^[-a-z0-9]+$/i.test(unitId))throw Error("CUR03_BAD_SCOPE");
 return PREFIX+encodeURIComponent(owner)+":"+unitId;
};
function storage():PositionStore|null{try{return typeof localStorage==="undefined"?null:localStorage}catch{return null}}
function identity(steps:readonly StudyStep[]):string{
 if(!steps.length||steps.length>MAX_STEPS||steps.some(s=>!s?.id||s.id.length>200))throw Error("CUR03_INVALID_STEPS");
 const ids=steps.map(step=>step.id);
 if(new Set(ids).size!==ids.length)throw Error("CUR03_DUPLICATE_STEP");
 // Bound to exact original lesson, controlled prompts and authored step ordering.
 return ids.map(x=>x.length+":"+x).join("|");
}
export function readCoursePosition(owner:string,unitId:string,steps:readonly StudyStep[],store:PositionStore|null=storage()):number{
 const key=coursePositionKey(owner,unitId),manifest=identity(steps);
 try{
  const raw=store?.getItem(key);if(!raw||raw.length>160_000)return 0;
  const p=JSON.parse(raw) as Position;
  if(p.version!==1||p.unitId!==unitId||p.manifest!==manifest||
     !Number.isInteger(p.ordinal)||p.ordinal<0||p.ordinal>=steps.length||
     p.stepId!==steps[p.ordinal]?.id||!Number.isFinite(p.updatedAt))
   return 0;
  return p.ordinal;
 }catch{return 0}
}
export function saveCoursePosition(owner:string,unitId:string,steps:readonly StudyStep[],index:number,store:PositionStore|null=storage()):boolean{
 const key=coursePositionKey(owner,unitId),manifest=identity(steps);
 if(!Number.isInteger(index)||index<0||index>=steps.length)throw Error("CUR03_BAD_POSITION");
 const next:Position={version:1,unitId,stepId:steps[index]!.id,ordinal:index,manifest,updatedAt:Date.now()};
 try{if(!store)return false;store.setItem(key,JSON.stringify(next));return true}catch{return false}
}
export function clearCoursePosition(owner:string,unitId:string,store:PositionStore|null=storage()):boolean{
 const key=coursePositionKey(owner,unitId);
 try{if(!store)return false;store.removeItem(key);return true}catch{return false}
}
/** A durable answer makes the following step the safe resume point; no answer is replayed. */
export function nextSavedPosition(index:number,steps:readonly StudyStep[]):number{
 identity(steps);
 if(!Number.isInteger(index)||index<0||index>=steps.length)throw Error("CUR03_BAD_POSITION");
 return Math.min(index+1,steps.length-1);
}
