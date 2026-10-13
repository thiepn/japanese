import type {StudyPrompt} from "@thiepn/study-player";
import {normalizeP26} from "./pedagogy26";
import type {P48Case,P48Question,P48Task,P48Source} from "./connected48-types";
import {p48CasesA} from "./connected48-corpus-a";
import {p48CasesB} from "./connected48-corpus-b";
import {p48CasesC} from "./connected48-corpus-c";
import {p48CasesD} from "./connected48-corpus-d";
import {p48CasesE} from "./connected48-corpus-e";

export type {P48Case,P48Question,P48Task,P48Source} from "./connected48-types";
export const p48Cases:readonly P48Case[]=[
 ...p48CasesA,...p48CasesB,...p48CasesC,...p48CasesD,...p48CasesE
];
export function p48ForUnit(unitId:string):P48Case[]{
 return p48Cases.filter(c=>c.units.includes(unitId));
}
export function p48ById(id:string):P48Case|undefined{
 return p48Cases.find(c=>c.id===id);
}
export function p48Comparison(value:string,models:readonly string[],trap:string,why:string):
 {kind:"example"|"known-error"|"unassessed";message:string}{
 const normal=normalizeP26(value);
 if(models.some(s=>normalizeP26(s)===normal))return {
  kind:"example",message:"Deine Formulierung entspricht einem verfassten Antwortbeispiel."
 };
 if(normalizeP26(trap)===normal)return {
  kind:"known-error",message:why
 };
 return {
  kind:"unassessed",message:"Deine andere japanische Formulierung wurde nicht semantisch bewertet. Vergleiche sie mit den konkreten Belegen; unbekannt ist nicht automatisch falsch."
 };
}
function common(c:P48Case,kind:string):Pick<StudyPrompt,
 "primaryTarget"|"cueFamily"|"answerNormalization"|"contextId"|"sourceId"|"contentVersion"|"eventMetadata">{
 return {
  primaryTarget:{kind:"can_do",id:"p48:connected:"+c.id+":"+kind},
  cueFamily:"p48-original-"+c.id+"-"+kind,
  answerNormalization:"japanese",contextId:"p48:connected:"+c.id,
  sourceId:"thiepn-original",contentVersion:"p48-1",
  eventMetadata:{p48:true,caseId:c.id,unitIds:[...c.units],
   level:c.level,kind:"connected-sources",independentCue:true}
 };
}
const sourceDocuments=(c:P48Case)=>c.sources.map((s,i)=>
 "Quelle "+(i+1)+" ("+s.label+", "+s.medium+"):\n"+s.japanese).join("\n\n");
export const p48ComprehensionPrompts:StudyPrompt[]=p48Cases.flatMap(c=>
 c.questions.map((q,index)=>{
  const root=common(c,"question-"+(index+1));
  const cited=q.evidence.map(e=>{
   const source=c.sources.find(s=>s.id===e.sourceId);
   return (source?.label??"Originalquelle")+"「"+e.excerpt+"」 ("+e.role+")";
  }).join(" · ");
  return {...root,id:"p48-question-"+q.id,skill:"production",promptType:"typed",
   instruction:q.kind==="reconcile"?
     "Zwei oder mehr Quellen zusammenführen und die aktuell geltende Information auf Japanisch formulieren.":
     q.kind==="inference"?
     "Eigene Schlussfolgerung aus mehreren Originalquellen in Japanisch begründen.":
     "Quellenstatus, Aussage und textgestützte Evidenz unterscheiden.",
   prompt:"Situation: "+c.setup+"\n\n"+sourceDocuments(c)+"\n\nFrage: "+q.question,
   acceptedAnswers:[normalizeP26(q.model),normalizeP26(q.alternative)],
   displayAnswer:q.model,
   explanation:q.feedback+" Originalbelege: "+cited+
     ". Andere natürliche, sachlich richtige Antworten können außerhalb der zwei verfassten Beispiele liegen.",
   eventMetadata:{...root.eventMetadata,
     questionId:q.id,questionKind:q.kind,kind:"connected-text-supported-comprehension"}
  };
 })
);
function writingPrompt(c:P48Case,t:P48Task,kind:"write"|"return"):StudyPrompt{
 const root=common(c,kind);
 const isReturn=kind==="return";
 return {...root,id:"p48-"+kind+"-"+c.id,skill:"production",promptType:"typed",
  instruction:isReturn?
    "Spätere NEUE Situation: keine ursprünglichen Quellen und keine Muster; selbstständig auf Japanisch antworten.":
    "Nach dem Quellenvergleich ein eigenes japanisches Ergebnis mit gültigen Fakten formulieren.",
  prompt:isReturn?t.instruction:"Drei Originalquellen:\n"+sourceDocuments(c)+
    "\n\nEigenes Ergebnis: "+t.instruction,
  acceptedAnswers:[normalizeP26(t.model),normalizeP26(t.alternative)],
  displayAnswer:t.model,
  explanation:t.feedback+" Die verfassten Muster sind keine vollständige semantische Sprachbewertung.",
  eventMetadata:{...root.eventMetadata,
    kind:isReturn?"cross-context-transfer":"connected-writing",
    focus:isReturn?"delayed-independent-return":"source-supported-writing"}
 };
}
export const p48WritingPrompts:StudyPrompt[]=p48Cases.map(c=>writingPrompt(c,c.writing,"write"));
export const p48ReturnPrompts:StudyPrompt[]=p48Cases.map(c=>writingPrompt(c,c.returnCue,"return"));
export const p48Prompts:StudyPrompt[]=[
 ...p48ComprehensionPrompts,...p48WritingPrompts,...p48ReturnPrompts
];
export type P48PracticeKind="comprehension"|"writing"|"return"|"all";
export function p48PromptsForCase(id:string,kind:P48PracticeKind="all"):StudyPrompt[]{
 if(!p48ById(id))return [];
 const questions=p48ComprehensionPrompts.filter(p=>p.eventMetadata?.caseId===id);
 const writing=p48WritingPrompts.filter(p=>p.eventMetadata?.caseId===id);
 const later=p48ReturnPrompts.filter(p=>p.eventMetadata?.caseId===id);
 if(kind==="comprehension")return questions;
 if(kind==="writing")return writing;
 if(kind==="return")return later;
 return [...questions,...writing];
}
