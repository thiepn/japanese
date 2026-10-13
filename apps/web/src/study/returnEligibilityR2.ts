import type {StudyEvent} from "@thiepn/domain";
import type {MemoryTrace} from "@thiepn/scheduler";
import type {StudyPrompt} from "@thiepn/study-player";
import {p40Prompts,p40ReturnPrompts} from "./dialogue40";
import {p41Prompts,p41ReturnPrompts} from "./dialogue41";
import {p42Prompts,p42ReturnPrompts} from "./dialogue42";
import {p43Prompts,p43ReturnPrompts} from "./dialogue43";
import {p44Prompts,p44ReturnPrompts} from "./pragmatics44";
import {p45Prompts,p45ReturnPrompts} from "./independence45";
import {p46Prompts,p46ReturnPrompts} from "./reading46";
import {p47Prompts,p47ReturnPrompts} from "./listening47";
import {p48Prompts,p48ReturnPrompts} from "./connected48";
import {p49Prompts,p49ReturnPrompts} from "./documents49";
import {p50Prompts,p50ReturnPrompts} from "./integrated50";
import {p51Prompts,p51ReturnPrompts} from "./grammar51";
import {p52Prompts,p52ReturnPrompts} from "./transformation52";

/** Existing prompt IDs/targets/FSRS cards are the only authorities. This is read-only. */
const originals:readonly (readonly StudyPrompt[])[]=[
 p40Prompts,p41Prompts,p42Prompts,p43Prompts,p44Prompts,p45Prompts,
 p46Prompts,p47Prompts,p48Prompts,p49Prompts,p50Prompts,p51Prompts,p52Prompts
];
export const originalHistoricalReturns:readonly StudyPrompt[]=[
 ...p40ReturnPrompts,...p41ReturnPrompts,...p42ReturnPrompts,
 ...p43ReturnPrompts,...p44ReturnPrompts,...p45ReturnPrompts,
 ...p46ReturnPrompts,...p47ReturnPrompts,...p48ReturnPrompts,...p49ReturnPrompts,
 ...p50ReturnPrompts,...p51ReturnPrompts,...p52ReturnPrompts
];

const keyByPhase:Readonly<Record<number,string>>={
 40:"arcId",41:"arcId",42:"arcId",43:"sceneId",44:"caseId",
 45:"challengeId",46:"readingId",47:"sceneId",48:"caseId",
 49:"documentId",50:"missionId",51:"contrastId",52:"transformationId"
};
const byId=new Map(originalHistoricalReturns.map(p=>[p.id,p]));
/** R2 supports only real P40–P52 original delayed-return prompts. */
export function isHistoricalReturn(prompt:StudyPrompt):boolean{
 return byId.get(prompt.id)===prompt;
}
const sourceAnchors=new Map<string,readonly StudyPrompt[]>();
for(const ret of originalHistoricalReturns){
 const phase=Number(/^p(\d+)-return-/.exec(ret.id)?.[1]);
 const sourceKey=keyByPhase[phase];
 const authoredId=ret.eventMetadata?.[sourceKey];
 // The last item may be malformed; never unlock based on unrelated exercises.
 if(typeof authoredId!=="string"||!sourceKey)continue;
 const catalog=originals[phase-40]??[];
 const group=catalog.filter(p=>p.id!==ret.id&&
  !/^p(?:4\d|5[0-2])-return-/.test(p.id)&&
  p.eventMetadata?.[sourceKey]===authoredId);
 sourceAnchors.set(ret.id,group);
}
export interface HistoricalReturnEligibility{
 eligible:boolean;status:"existing"|"source-due"|"elapsed"|"locked";
 sourcePromptIds:readonly string[];
}
/** Genuine original owner-scoped evidence: old graded source events after 24 h,
 * an already-due original FSRS source trace, or an existing original return
 * trace. Merely clicking a model/reading/transcript never unlocks a return.
 * Inputs are the original Account-filtered StudyEvents/MemoryTraces; the caller
 * must also enforce the source's declared unit before offering the route.
 */
export function historicalReturnEligibility(
 prompt:StudyPrompt,traces:readonly MemoryTrace[],events:readonly StudyEvent[],
 now=Date.now()
):HistoricalReturnEligibility{
 const anchors=sourceAnchors.get(prompt.id);
 const locked={eligible:false,status:"locked" as const,
  sourcePromptIds:anchors?.map(p=>p.id)??[]};
 if(!anchors?.length||!isHistoricalReturn(prompt))return locked;
 const traceId=(p:StudyPrompt)=>p.primaryTarget.kind+":"+
  p.primaryTarget.id+":"+p.skill+":"+p.cueFamily;
 const owner=traces[0]?.userId??events[0]?.userId;
 if(!owner)return locked;
 const scopedTraces=traces.filter(t=>t.userId===owner);
 const scopedEvents=events.filter(e=>e.userId===owner&&
  (e.result==="correct"||e.result==="incorrect")&&
  e.metadata?.schedulerExcluded!==true);
 const traceById=new Map(scopedTraces.map(t=>[t.id,t]));
 if(traceById.has(traceId(prompt)))
  return {eligible:true,status:"existing",sourcePromptIds:anchors.map(p=>p.id)};
 for(const p of anchors){
  const t=traceById.get(traceId(p));
  const due=t?Date.parse(t.card.due):NaN;
  if(Number.isFinite(due)&&due<=now)
   return {eligible:true,status:"source-due",sourcePromptIds:anchors.map(p=>p.id)};
 }
 const earliest=now-24*60*60*1000;
 const eligibleIds=new Set(anchors.map(p=>p.id));
 const aged=scopedEvents.some(e=>
  typeof e.metadata?.promptId==="string"&&eligibleIds.has(e.metadata.promptId)&&
  Number.isFinite(Date.parse(e.occurredAt))&&Date.parse(e.occurredAt)<=earliest);
 return aged?{eligible:true,status:"elapsed",sourcePromptIds:anchors.map(p=>p.id)}:locked;
}
