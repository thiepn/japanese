import type {StudyPrompt} from "@thiepn/study-player";
import type {MemoryTrace} from "@thiepn/scheduler";
import type {StudyEvent} from "@thiepn/domain";
import {promptsForUnit,traceIdJourney} from "./journey27";
export type PracticeArea="sentence"|"grammar"|"dialogue"|"lexicon";
export interface AreaEvidence{
  area:PracticeArea;due:number;retry:number;newItems:number;practiced:number;
  total:number;signal:"review"|"retry"|"explore"|"maintain";reason:string;
}
export interface LearningEvidence{
  areas:AreaEvidence[];recommendedArea:PracticeArea;totalDue:number;totalRetry:number;
}
const order:readonly PracticeArea[]=["sentence","dialogue","grammar","lexicon"];
export const areaLabels:Record<PracticeArea,string>={
  sentence:"Satzbau & eigene Sätze",
  grammar:"Grammatik & Sprachregister",
  dialogue:"Reaktion im Gespräch",
  lexicon:"Wörter im Zusammenhang"
};
/** The cues are independent, not an asserted CEFR proficiency model. */
function areaFor(prompt:StudyPrompt):PracticeArea{
  const kind=prompt.eventMetadata?.kind;
  if(kind==="linked-lexicon"||kind==="lexical-transfer"||
    kind==="cross-context-transfer"&&prompt.skill==="comprehension"||
    prompt.id.startsWith("p26-vocab"))return "lexicon";
  if(kind==="reformulation"||kind==="sentence-order"||kind==="sentence-build"||
    kind==="sentence"||prompt.id.startsWith("p24-build-"))return "sentence";
  if(kind==="independent-dialogue"||typeof kind==="string"&&kind.startsWith("continuity")||
    kind==="guided-response"||prompt.id.startsWith("p24-dialogue-")||
    prompt.id.startsWith("p27-typed-")||prompt.id.startsWith("p25-dialogue-"))return "dialogue";
  if(kind==="register-contrast"||kind==="contrast"||prompt.skill==="form_selection")return "grammar";
  return prompt.skill==="production"?"sentence":"lexicon";
}
export function deriveWeakAreas(
  unitId:string,traces:readonly MemoryTrace[],events:readonly StudyEvent[],
  extraPrompts:readonly StudyPrompt[],now=Date.now()
):LearningEvidence{
  const tracesById=new Map(traces.map(t=>[t.id,t]));
  const latest=new Map<string,StudyEvent>();
  for(const event of events){
    const id=event.metadata?.promptId;
    if(typeof id!=="string"||(event.result!=="incorrect"&&event.result!=="correct")||
      event.metadata?.schedulerExcluded===true)continue;
    const prev=latest.get(id);
    if(!prev||prev.occurredAt<event.occurredAt)latest.set(id,event);
  }
  const prompts=promptsForUnit(unitId,extraPrompts);
  const bucket=new Map<PracticeArea,AreaEvidence>(order.map(area=>[area,{
    area,due:0,retry:0,newItems:0,practiced:0,total:0,
    signal:"explore",reason:"Noch keine unabhängigen Übungsnachweise"
  }]));
  for(const prompt of prompts){
    const a=bucket.get(areaFor(prompt))!;
    a.total++;
    const trace=tracesById.get(traceIdJourney(prompt));
    const event=latest.get(prompt.id);
    if(trace||event)a.practiced++;
    // A prompt is counted in exactly one urgency class, never both due and retry.
    if(trace&&Number.isFinite(Date.parse(trace.card.due))&&Date.parse(trace.card.due)<=now)a.due++;
    else if(event?.result==="incorrect")a.retry++;
    else if(!trace&&!event)a.newItems++;
  }
  const areas=order.map(area=>{
    const a=bucket.get(area)!;
    a.signal=a.due?"review":a.retry?"retry":a.newItems?"explore":"maintain";
    a.reason=a.due?String(a.due)+" laut FSRS fällig":
      a.retry?String(a.retry)+" letzte unabhängige Versuche fehlerhaft":
      a.newItems?String(a.newItems)+" noch nicht versucht":
      a.total?"Aktuell keine fälligen oder neuen Einträge":"Noch keine Übungen vorhanden";
    return a;
  });
  areas.sort((a,b)=>(b.due*5+b.retry*3+Number(b.newItems>0))-
    (a.due*5+a.retry*3+Number(a.newItems>0)));
  return {
    areas,recommendedArea:areas.find(a=>a.total)?.area??"sentence",
    totalDue:areas.reduce((sum,a)=>sum+a.due,0),
    totalRetry:areas.reduce((sum,a)=>sum+a.retry,0)
  };
}
