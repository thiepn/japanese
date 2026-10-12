import type {MemoryTrace} from "@thiepn/scheduler";
import type {StudyPrompt} from "@thiepn/study-player";
import {traceIdJourney} from "./journey27";
export interface P37ReviewSignal{
  dueNow:boolean;nextDueAt?:string;hasTrace:boolean;
  status:string;explanation:string;
}
/** Evidence label for an exact last-incorrect prompt, never a new scheduler. */
export function p37ReviewSignal(promptId:string,prompts:readonly StudyPrompt[],
 traces:readonly MemoryTrace[],now=Date.now()):P37ReviewSignal{
 const prompt=prompts.find(p=>p.id===promptId);
 if(!prompt)return {dueNow:false,hasTrace:false,status:"Lerninhalt nicht mehr verfügbar",
   explanation:"Keinen FSRS-Status für dieses unbekannte Übungsziel behaupten."};
 const trace=traces.find(t=>t.id===traceIdJourney(prompt));
 const due=trace?.card.due;
 if(typeof due!=="string"||!Number.isFinite(Date.parse(due)))
   return {dueNow:false,hasTrace:Boolean(trace),status:"Noch kein gültiger FSRS-Termin",
     explanation:"Du kannst die letzte fehlerhafte Aufgabe freiwillig üben. Sie gilt nicht automatisch als fällig."};
 if(Date.parse(due)<=now)return {dueNow:true,hasTrace:true,status:"Jetzt nach FSRS fällig",
   explanation:"Dieses Übungsziel ist sowohl zuletzt fehlerhaft als auch tatsächlich fällig."};
 return {dueNow:false,hasTrace:true,nextDueAt:due,status:"Für später geplant",
   explanation:"Der letzte Fehler kann separat und freiwillig bearbeitet werden; FSRS verlangt noch keinen neuen Abruf."};
}
