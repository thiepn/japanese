import type {StudyEvent} from "@thiepn/domain";

/** XP and streaks are read-only motivation metrics, never FSRS grades. */
export interface UX1Engagement{
 totalXp:number;
 streakDays:number;
 todayUniqueAnswers:number;
 dailyGoal:number;
}

const MAIN_SUFFIXES=["hear","read","reply","recall"] as const;
function localDay(d:Date):string{
 return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-");
}
function previousDay(d:Date):Date{
 return new Date(d.getFullYear(),d.getMonth(),d.getDate()-1,12);
}

/** Shared read-only filter for daily metrics: optional practice, duplicates and
 * future/invalid events must not count as saved assessed answers. */
function scoredAttempts(events:readonly StudyEvent[],now:Date):StudyEvent[]{
 const seenEvents=new Set<string>();
 return events.filter(event=>{
  if(seenEvents.has(event.id))return false;
  seenEvents.add(event.id);
  if((event.result!=="correct"&&event.result!=="incorrect")||event.metadata?.nonAuthoritative===true)return false;
  const time=Date.parse(event.occurredAt);
  return Number.isFinite(time)&&time<=now.getTime()+1000;
 });
}

/** Counts actual assessed attempts, not XP, unique prompts or optional drafts. */
export function countUX1SavedAnswersToday(events:readonly StudyEvent[],now=new Date()):number{
 const today=localDay(now);
 return scoredAttempts(events,now).filter(event=>localDay(new Date(event.occurredAt))===today).length;
}

/** Deterministically projects engagement from the existing owner-scoped StudyEvents. */
export function projectUX1Engagement(events:readonly StudyEvent[],now=new Date()):UX1Engagement{
 const visible=scoredAttempts(events,now)
  .sort((a,b)=>a.occurredAt.localeCompare(b.occurredAt)||a.id.localeCompare(b.id));
 const days=new Set<string>();
 const rewardedPromptDays=new Set<string>();
 const todayPromptIds=new Set<string>();
 const completedScenes=new Set<string>();
 const sceneAnswers=new Map<string,Map<string,boolean>>();
 const today=localDay(now);
 let totalXp=0;
 for(const event of visible){
  const day=localDay(new Date(event.occurredAt));
  const promptId=typeof event.metadata?.promptId==="string"&&event.metadata.promptId
   ?event.metadata.promptId
   :event.promptFamily;
  if(!promptId)continue;
  days.add(day);
  if(day===today)todayPromptIds.add(promptId);
  if(event.result==="correct"){
   const rewardKey=day+"|"+promptId;
   if(!rewardedPromptDays.has(rewardKey)){
    totalXp+=5;
    rewardedPromptDays.add(rewardKey);
   }
  }
  const scene=event.metadata?.e02SceneId;
  if(typeof scene!=="string"||!scene||completedScenes.has(scene))continue;
  const required=MAIN_SUFFIXES.find(suffix=>promptId==="a1-e02-"+scene+"-"+suffix);
  if(!required)continue;
  const answers=sceneAnswers.get(scene)??new Map<string,boolean>();
  answers.set(required,event.result==="correct");
  sceneAnswers.set(scene,answers);
  if(MAIN_SUFFIXES.every(suffix=>answers.get(suffix)===true)){
   completedScenes.add(scene);
   totalXp+=15;
  }
 }
 let date=new Date(now.getFullYear(),now.getMonth(),now.getDate(),12);
 if(!days.has(localDay(date)))date=previousDay(date);
 let streakDays=0;
 while(days.has(localDay(date))&&streakDays<days.size){
  streakDays++;
  date=previousDay(date);
 }
 return {totalXp,streakDays,todayUniqueAnswers:todayPromptIds.size,dailyGoal:3};
}
