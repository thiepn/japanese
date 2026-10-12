import type {MemoryTrace} from "@thiepn/scheduler";
import type {StudyPrompt} from "@thiepn/study-player";
import {p33RolePrompts} from "./role33";
import {traceIdJourney} from "./journey27";
/** The native FSRS trace alone establishes whether a role cue is due. */
export function dueP36RolePrompts(unitId:string,scenarioId:string,
 traces:readonly MemoryTrace[],now=Date.now()):StudyPrompt[]{
 const known=new Map(traces.map(t=>[t.id,t]));
 return p33RolePrompts.filter(p=>{
   if(p.eventMetadata?.unitId!==unitId||p.eventMetadata?.scenarioId!==scenarioId)return false;
   const due=known.get(traceIdJourney(p))?.card.due;
   return typeof due==="string"&&Number.isFinite(Date.parse(due))&&Date.parse(due)<=now;
 }).sort((a,b)=>{
   const x=known.get(traceIdJourney(a))?.card.due??"";
   const y=known.get(traceIdJourney(b))?.card.due??"";
   return Date.parse(x)-Date.parse(y);
 });
}
