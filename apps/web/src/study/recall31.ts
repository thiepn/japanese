import type {StudyEvent} from "@thiepn/domain";
import type {MemoryTrace} from "@thiepn/scheduler";
import type {StudyPrompt} from "@thiepn/study-player";
import {journeyUnits,promptsForUnit,traceIdJourney} from "./journey27";
import {p31ContrastPrompts} from "./contrast31";
export interface P31DueCard {
  promptId:string;unitId:string;dueAt:string;lastAt?:string;
}
export interface P31RecallPlan {
  dueNow:P31DueCard[];nextDue?:P31DueCard;notYetDue:number;
  recentlyReviewed:number;recentWindowMinutes:number;
  explanation:string;
}
/**
 * Reads FSRS-issued due dates. Does not create a local reminder, interval,
 * deferred event or independent scheduler.
 */
export function planP31Recall(unitId:string,traces:readonly MemoryTrace[],
  events:readonly StudyEvent[],extras:readonly StudyPrompt[],
  now=Date.now(),recentWindowMinutes=20
):P31RecallPlan{
  const traceMap=new Map(traces.map(t=>[t.id,t]));
  const latest=new Map<string,string>();
  for(const event of events){
    if(event.result!=="correct"&&event.result!=="incorrect")continue;
    if(event.metadata?.schedulerExcluded)continue;
    const promptId=event.metadata?.promptId;
    if(typeof promptId!=="string")continue;
    const previous=latest.get(promptId);
    if(!previous||previous<event.occurredAt)latest.set(promptId,event.occurredAt);
  }
  const unitPrompts=promptsForUnit(unitId,[...extras,...p31ContrastPrompts]);
  const found:P31DueCard[]=[];
  const seen=new Set<string>();
  let recentlyReviewed=0;
  for(const prompt of unitPrompts){
    if(seen.has(prompt.id))continue;
    seen.add(prompt.id);
    const lastAt=latest.get(prompt.id);
    if(lastAt&&Number.isFinite(Date.parse(lastAt))&&
      now-Date.parse(lastAt)>=0&&now-Date.parse(lastAt)<recentWindowMinutes*60_000)
      recentlyReviewed++;
    const dueAt=traceMap.get(traceIdJourney(prompt))?.card.due;
    if(dueAt&&Number.isFinite(Date.parse(dueAt)))found.push({
      promptId:prompt.id,unitId,dueAt,...(lastAt?{lastAt}:{})
    });
  }
  found.sort((a,b)=>Date.parse(a.dueAt)-Date.parse(b.dueAt));
  const dueNow=found.filter(p=>Date.parse(p.dueAt)<=now);
  const nextDue=found.find(p=>Date.parse(p.dueAt)>now);
  return {
    dueNow,...(nextDue?{nextDue}:{}),notYetDue:found.length-dueNow.length,
    recentlyReviewed,recentWindowMinutes,
    explanation:dueNow.length
      ?"Diese Karten sind nach ihrem bestehenden FSRS-Termin fällig. Der Plan ist keine Bewertung deiner allgemeinen Sprachfähigkeit."
      :nextDue
        ?"Aktuell ist keine bekannte FSRS-Karte dieser Einheit fällig. Neue Lerninhalte kannst du unabhängig davon üben."
        :"Noch kein gültiger FSRS-Fälligkeitstermin für diese Einheit vorhanden. Neue Aufgaben sind nicht automatisch überfällig."
  };
}
export function p31GlobalDue(traces:readonly MemoryTrace[],events:readonly StudyEvent[],
  extras:readonly StudyPrompt[],now=Date.now()):{unitId:string;due:number;nextDueAt?:string}[]{
  return journeyUnits.map(u=>{
    const plan=planP31Recall(u.id,traces,events,extras,now);
    return {unitId:u.id,due:plan.dueNow.length,
      ...(plan.nextDue?{nextDueAt:plan.nextDue.dueAt}:{})};
  }).sort((a,b)=>b.due-a.due||
    Date.parse(a.nextDueAt??"9999-12-31")-Date.parse(b.nextDueAt??"9999-12-31"));
}
