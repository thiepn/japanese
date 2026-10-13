import type {StudyPrompt} from "@thiepn/study-player";
import {normalizeP26} from "./pedagogy26";
import {p52TransformationsA} from "./transformation52-corpus-a";
import {p52TransformationsB} from "./transformation52-corpus-b";
import {p52TransformationsC} from "./transformation52-corpus-c";
import type {P52Transformation,P52FollowUp} from "./transformation52-types";

export type {P52Transformation,P52FollowUp,P52Domain,P52Mode} from "./transformation52-types";
export const p52Transformations:readonly P52Transformation[]=[
 ...p52TransformationsA,...p52TransformationsB,...p52TransformationsC
];
export const p52ById=(id:string):P52Transformation|undefined=>
 p52Transformations.find(t=>t.id===id);
export const p52ForUnit=(id:string):P52Transformation[]=>
 p52Transformations.filter(t=>t.units.includes(id));

/** Finite authored comparison only; this never grades arbitrary grammatical Japanese. */
export function p52Compare(value:string,models:readonly string[],wrong:string,explanation:string):
 {kind:"example"|"specific-error"|"unassessed";message:string}{
 const answer=normalizeP26(value);
 if(models.some(m=>normalizeP26(m)===answer))return {
  kind:"example",message:"Deine Formulierung entspricht einem der originalen vollständigen Satzmodelle."
 };
 if(normalizeP26(wrong)===answer)return {
  kind:"specific-error",message:explanation
 };
 return {kind:"unassessed",
  message:"Keine automatische semantische Bewertung: Andere natürliche Antworten können richtig sein. Prüfe, ob Sprecherrolle, Fakten und geforderte Bedeutungsänderung stimmen."};
}
function shared(t:P52Transformation,kind:"transform"|"production"|"return"):Pick<StudyPrompt,
 "primaryTarget"|"cueFamily"|"answerNormalization"|"contextId"|"sourceId"|"contentVersion"|"eventMetadata">{
 return {primaryTarget:{kind:"can_do",id:"p52:transformation:"+t.id+":"+kind},
  cueFamily:"p52-original-"+t.id+"-"+kind,
  answerNormalization:"japanese",contextId:"p52:transformation:"+t.id,
  sourceId:"thiepn-original",contentVersion:"p52-1",
  eventMetadata:{p52:true,transformationId:t.id,unitIds:[...t.units],level:"A2",
   domain:t.domain,operation:t.mode,independentCue:true,sourceRights:"thiepn-original"}
 };
}
const primary=(t:P52Transformation):StudyPrompt=>{
 const common=shared(t,"transform");
 return {...common,id:"p52-transform-"+t.id,skill:"production",promptType:"typed",
  instruction:"Originalsatz in Japanisch umformen, ohne ein Satzfragment auszufüllen. Schreibe einen vollständigen, zur Absicht passenden Satz.",
  prompt:"Sprecher und Adressat: "+t.role+"\nSituation: "+t.scene+
   "\nAusgangssatz: "+t.input+"\nZiel ("+
   (t.mode==="preserve"?"Bedeutung erhalten":"Bedeutung gezielt ändern")+"): "+t.goal+
   "\nFormuliere die gesamte japanische Äußerung neu.",
  acceptedAnswers:[t.model,...t.alternatives].map(normalizeP26),
  displayAnswer:t.model,
  explanation:t.nuance+" "+t.repair+
   " Die native Antwortprüfung erfasst nur die drei verfassten Muster, nicht jede richtige Paraphrase.",
  eventMetadata:{...common.eventMetadata,kind:"sentence-transformation",focus:"meaning-and-speaker"}
 };
};
function follow(t:P52Transformation,kind:"production"|"return",f:P52FollowUp):StudyPrompt{
 const common=shared(t,kind),delayed=kind==="return";
 return {...common,id:"p52-"+kind+"-"+t.id,skill:"production",promptType:"typed",
  instruction:delayed?
    "Unbekannte neue Anwendung ohne Vorlage aus dem Ausgangsfall: erst Bedeutung, Rolle und Satzzeit erfassen, dann frei formulieren.":
    "Eigenständig übertragen: neue Person, anderer Sachverhalt oder anderes Ziel. Zwei vollständige Originalantworten sind als begrenzte Muster hinterlegt.",
  prompt:(delayed?"Neue spätere Kommunikationssituation: ":"Unabhängige Produktionssituation: ")+f.scene+
   "\nNeuer Ausgangssatz: "+f.input+"\nNeue Zielabsicht: "+f.goal+
   "\nSchreibe eine eigene vollständige japanische Äußerung.",
  acceptedAnswers:[f.model,f.alternative].map(normalizeP26),
  displayAnswer:f.model,
  explanation:f.why+" Originale Beispielsätze sind keine vollständige semantische Grammatikbewertung.",
  eventMetadata:{...common.eventMetadata,kind:delayed?"cross-context-transfer":"independent-transformation",
   focus:delayed?"delayed-independent-return":"transformation-production"}
 };
}
export const p52TransformPrompts:StudyPrompt[]=p52Transformations.map(primary);
export const p52ProductionPrompts:StudyPrompt[]=p52Transformations.map(t=>follow(t,"production",t.production));
export const p52ReturnPrompts:StudyPrompt[]=p52Transformations.map(t=>follow(t,"return",t.return));
export const p52Prompts:StudyPrompt[]=[
 ...p52TransformPrompts,...p52ProductionPrompts,...p52ReturnPrompts
];
export type P52PracticeKind="transform"|"production"|"return"|"all";
export function p52PromptsForTransformation(id:string,kind:P52PracticeKind="all"):StudyPrompt[]{
 const t=p52ById(id);
 if(!t)return [];
 if(kind==="transform")return p52TransformPrompts.filter(p=>p.eventMetadata?.transformationId===id);
 if(kind==="production")return p52ProductionPrompts.filter(p=>p.eventMetadata?.transformationId===id);
 if(kind==="return")return p52ReturnPrompts.filter(p=>p.eventMetadata?.transformationId===id);
 return [...p52TransformPrompts,...p52ProductionPrompts].filter(p=>p.eventMetadata?.transformationId===id);
}
