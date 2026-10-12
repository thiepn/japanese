import type {MemoryTrace} from "@thiepn/scheduler";
import type {StudyPrompt} from "@thiepn/study-player";
import {p36CorrectionPrompts} from "./correction36";
import {traceIdJourney} from "./journey27";
/** Filter only current owner-scoped, FSRS-scheduled correction prompts. */
export function dueP37CorrectionPrompts(unitId:string,scenarioId:string,
  traces:readonly MemoryTrace[],now=Date.now()):StudyPrompt[]{
  const byId=new Map(traces.map(t=>[t.id,t]));
  return p36CorrectionPrompts.filter(prompt=>{
    if(prompt.eventMetadata?.unitId!==unitId||
      prompt.eventMetadata?.scenarioId!==scenarioId)return false;
    const due=byId.get(traceIdJourney(prompt))?.card.due;
    return typeof due==="string"&&Number.isFinite(Date.parse(due))&&Date.parse(due)<=now;
  }).sort((a,b)=>{
    const date=(p:StudyPrompt)=>Date.parse(byId.get(traceIdJourney(p))?.card.due??"");
    return date(a)-date(b);
  });
}
