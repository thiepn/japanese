import type {StudyEvent} from "@thiepn/domain";
import type {StudyPrompt} from "@thiepn/study-player";
import {promptsForUnit} from "./journey27";

/** Only the most recent independently graded event counts for each prompt. */
export interface P35Mistake {
  promptId:string;unitId:string;area:"dialogue"|"sentence"|"grammar"|"lexicon";
  label:string;lastIncorrectAt:string;context:string;
}
function classify(prompt:StudyPrompt):P35Mistake["area"]{
  const kind=prompt.eventMetadata?.kind;
  if(kind==="dialogue-continuity"||kind==="role-response"||typeof kind==="string"&&kind.startsWith("continuity")||
    prompt.id.startsWith("p27-typed"))return "dialogue";
  if(prompt.skill==="form_selection"||kind==="register-contrast"||kind==="contextual-contrast")
    return "grammar";
  if(kind==="linked-lexicon"||kind==="lexical-transfer"||kind==="cross-context-transfer")
    return "lexicon";
  return prompt.skill==="production"?"sentence":"lexicon";
}
export function recentP35Mistakes(
 unitId:string,events:readonly StudyEvent[],extras:readonly StudyPrompt[],limit=5
):P35Mistake[]{
  const latest=new Map<string,StudyEvent>();
  for(const event of events){
    if(event.metadata?.schedulerExcluded===true||
      (event.result!=="correct"&&event.result!=="incorrect"))continue;
    const id=event.metadata?.promptId;
    if(typeof id!=="string")continue;
    const before=latest.get(id);
    if(!before||before.occurredAt<event.occurredAt)latest.set(id,event);
  }
  const prompts=promptsForUnit(unitId,extras);
  return prompts.flatMap(prompt=>{
    const event=latest.get(prompt.id);
    if(!event||event.result!=="incorrect")return [];
    const area=classify(prompt);
    const label=area==="dialogue"?"Gesprächsreaktion":
      area==="grammar"?"Partikel / Funktion / Register":
      area==="sentence"?"Satzproduktion":"Kontextwortschatz";
    return [{promptId:prompt.id,unitId,area,label,lastIncorrectAt:event.occurredAt,
      context:prompt.instruction||"Situation erneut bearbeiten"}];
  }).sort((a,b)=>b.lastIncorrectAt.localeCompare(a.lastIncorrectAt)).slice(0,Math.max(0,limit));
}
export interface P35RemediationSummary{
  failures:P35Mistake[];hasScheduledReview:boolean;
  message:string;
}
export function p35RemediationSummary(
 unitId:string,events:readonly StudyEvent[],extras:readonly StudyPrompt[],
 hasScheduledReview:boolean
):P35RemediationSummary{
 const failures=recentP35Mistakes(unitId,events,extras);
 return {failures,hasScheduledReview,message:failures.length
  ?"Letzte unabhängig bewertete Fehler sind optionale gezielte Übung; FSRS-Fälligkeit ist davon getrennt."
  :"Kein zuletzt fehlerhaft bewerteter Übungscue bekannt. Ungraded Antworten gelten nicht als Fehler."};
}
