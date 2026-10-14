/**
 * Optional private, local-only editing buffer for ungraded production.
 * Deliberately separate from the authoritative StudyEvent/FSRS persistence.
 * Not synced, not encrypted, never stores recorded voice or graded answers.
 */
import type {StudyPrompt} from "@thiepn/study-player";
const PREFIX="thiepn-japanese-e07-original-draft-v1";
const PREFERENCE="thiepn-japanese-e07-keep-drafts";
const MAX=9000;
const ownerKey=(owner:string)=>encodeURIComponent(owner).slice(0,220);
function safeStorage():Storage|null{
 try{return typeof window!=="undefined"?window.localStorage:null;}
 catch{return null;}
}
function scopedKey(owner:string,prompt:StudyPrompt):string{
 return [PREFIX,ownerKey(owner),encodeURIComponent(prompt.id),encodeURIComponent(prompt.contentVersion??"original")].join(":");
}
export function eligibleE07Draft(prompt:StudyPrompt):boolean{
 return (prompt.promptType==="textarea"||prompt.promptType==="speech")
  &&prompt.eventMetadata?.nonAuthoritative===true
  &&(prompt.eventMetadata?.e01===true||prompt.eventMetadata?.e02===true
   ||prompt.eventMetadata?.e03===true||prompt.eventMetadata?.e04===true
   ||prompt.eventMetadata?.e06===true);
}
export function e07DraftPreference(owner:string):boolean{
 try{return safeStorage()?.getItem(PREFERENCE+":"+ownerKey(owner))==="yes";}
 catch{return false;}
}
export function setE07DraftPreference(owner:string,enabled:boolean):boolean{
 try{
  const store=safeStorage();if(!store)return false;
  if(enabled)store.setItem(PREFERENCE+":"+ownerKey(owner),"yes");
  else store.removeItem(PREFERENCE+":"+ownerKey(owner));
  return true;
 }catch{return false;}
}
export function saveE07Draft(owner:string,prompt:StudyPrompt,text:string):boolean{
 if(!owner||!eligibleE07Draft(prompt))return false;
 try{
  const store=safeStorage();if(!store)return false;
  if(!text.trim()){store.removeItem(scopedKey(owner,prompt));return true;}
  if(text.length>MAX)return false;
  store.setItem(scopedKey(owner,prompt),JSON.stringify({text,updatedAt:new Date().toISOString()}));
  return true;
 }catch{return false;}
}
export function readE07Draft(owner:string,prompt:StudyPrompt):string{
 if(!owner||!eligibleE07Draft(prompt)||!e07DraftPreference(owner))return "";
 try{
  const raw=safeStorage()?.getItem(scopedKey(owner,prompt));
  if(!raw)return "";
  const data=JSON.parse(raw) as {text?:unknown};
  return typeof data.text==="string"?data.text.slice(0,MAX):"";
 }catch{return "";}
}
export function clearE07Draft(owner:string,prompt:StudyPrompt):void{
 if(!owner||!eligibleE07Draft(prompt))return;
 try{safeStorage()?.removeItem(scopedKey(owner,prompt));}catch{/* Private mode or restricted storage */ }
}
export const E07_DRAFT_LIMIT=MAX;
