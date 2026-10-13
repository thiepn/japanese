import type {StudyPrompt} from "@thiepn/study-player";
import {normalizeP26} from "./pedagogy26";
import type {P44Case} from "./pragmatics44-types";
import {p44CorpusA} from "./pragmatics44-corpus-a";
import {p44CorpusB} from "./pragmatics44-corpus-b";
import {p44CorpusC} from "./pragmatics44-corpus-c";
import {p44CorpusD} from "./pragmatics44-corpus-d";
import {p44CorpusE} from "./pragmatics44-corpus-e";

export type {P44Case,P44Focus} from "./pragmatics44-types";
export const p44Cases:readonly P44Case[]=[
 ...p44CorpusA,...p44CorpusB,...p44CorpusC,...p44CorpusD,...p44CorpusE
];
export function p44ForUnit(unitId:string):P44Case[]{
 return p44Cases.filter(c=>c.unitIds.includes(unitId));
}
export function p44ById(id:string):P44Case|undefined{
 return p44Cases.find(c=>c.id===id);
}
export type P44PracticeStep="contrast"|"production"|"reply"|"return";
export function p44AuthoredFeedback(answer:string,candidates:readonly string[],misleading:string,
 why:string):{kind:"matched"|"misconception"|"unknown";message:string}{
 const value=normalizeP26(answer);
 if(candidates.some(v=>normalizeP26(v)===value))return {
  kind:"matched",message:"Die gewählte Beispielantwort passt zur beschriebenen Beziehung und Absicht."
 };
 if(normalizeP26(misleading)===value)return {kind:"misconception",message:why};
 return {kind:"unknown",message:"Andere mögliche japanische Formulierungen werden hier nicht sprachlich bewertet."};
}
function base(c:P44Case,step:P44PracticeStep):Pick<StudyPrompt,
 "primaryTarget"|"cueFamily"|"answerNormalization"|"contextId"|"sourceId"|"contentVersion"|"eventMetadata">{
 return {
  primaryTarget:{kind:"can_do",id:"p44:pragmatics:"+c.id+":"+step},
  cueFamily:"p44-original-pragmatic-"+c.id+"-"+step,
  answerNormalization:"japanese",contextId:"p44:case:"+c.id,
  sourceId:"thiepn-original",contentVersion:"p44-1",
  eventMetadata:{p44:true,caseId:c.id,stage:step,focus:c.focus,
   kind:step==="return"?"cross-context-transfer":
        step==="reply"?"dialogue-continuity":
        step==="production"?"cross-context-reformulation":"register-contrast",
   unitIds:[...c.unitIds],register:c.register,independentCue:true}
 };
}
export const p44ContrastPrompts:StudyPrompt[]=p44Cases.map(c=>({
 ...base(c,"contrast"),id:"p44-contrast-"+c.id,
 skill:"form_selection",promptType:"choice",
 instruction:"Erkenne den Unterschied zwischen Absicht, sozialer Passung und einem irreführenden Ausdruck.",
 prompt:c.setting+"\nBeziehung: "+c.relationship+
  "\nSituation: "+c.context+"\nGegenüber: "+c.partner+
  "\nDein Ziel: "+c.intention,
 choices:[c.misleading,c.model,c.alternative],
 acceptedAnswers:[normalizeP26(c.model),normalizeP26(c.alternative)],
 displayAnswer:c.model,explanation:c.misconception+" "+c.nuance
}));
export const p44ProductionPrompts:StudyPrompt[]=p44Cases.map(c=>({
 ...base(c,"production"),id:"p44-production-"+c.id,
 skill:"production",promptType:"typed",
 instruction:"Formuliere ohne Auswahlmöglichkeiten selbst eine situationsgerechte Antwort auf Japanisch.",
 prompt:c.setting+"\n"+c.context+"\nBeziehung: "+c.relationship+
  "\nDeine Absicht: "+c.intention+"\nPartner: "+c.partner,
 acceptedAnswers:[normalizeP26(c.model),normalizeP26(c.alternative)],
 displayAnswer:c.model,
 explanation:c.nuance+" Zur Fehlervermeidung: "+c.misconception+
  " Die begrenzten Muster erfassen nicht jede mögliche korrekte japanische Antwort."
}));
export const p44ReplyPrompts:StudyPrompt[]=p44Cases.map(c=>({
 ...base(c,"reply"),id:"p44-reply-"+c.id,
 skill:"production",promptType:"typed",
 instruction:"Setze das japanische Gespräch nach der nächsten Aussage des Gegenübers passend fort.",
 prompt:c.setting+"\nNach deiner ursprünglichen Absicht: "+c.intention+
  "\nGesprächspartner: "+c.partnerFollowup+
  "\nDein neues Ziel: "+c.followupTask,
 acceptedAnswers:[normalizeP26(c.followupModel),normalizeP26(c.followupAlternative)],
 displayAnswer:c.followupModel,
 explanation:c.followupWhy+" Dieser Folgeschritt ist eine eigene unabhängig bewertbare Lernkarte."
}));
export const p44ReturnPrompts:StudyPrompt[]=p44Cases.map(c=>({
 ...base(c,"return"),id:"p44-return-"+c.id,
 skill:"production",promptType:"typed",
 instruction:"Übertrage dieselbe soziale Funktion unabhängig auf eine neue Person oder Situation.",
 prompt:c.returnTask,
 acceptedAnswers:[normalizeP26(c.returnModel),normalizeP26(c.returnAlternative)],
 displayAnswer:c.returnModel,
 explanation:c.returnWhy+" Die vorhandene FSRS-Karte legt nach einem echten unabhängigen Abruf allein die Fälligkeit fest."
}));
export const p44Prompts:StudyPrompt[]=[
 ...p44ContrastPrompts,...p44ProductionPrompts,...p44ReplyPrompts,...p44ReturnPrompts
];
export function p44PromptsForCase(id:string,step?:P44PracticeStep):StudyPrompt[]{
 if(!p44ById(id))return [];
 if(step==="contrast")return p44ContrastPrompts.filter(p=>p.eventMetadata?.caseId===id);
 if(step==="production")return p44ProductionPrompts.filter(p=>p.eventMetadata?.caseId===id);
 if(step==="reply")return p44ReplyPrompts.filter(p=>p.eventMetadata?.caseId===id);
 if(step==="return")return p44ReturnPrompts.filter(p=>p.eventMetadata?.caseId===id);
 return [
  ...p44ContrastPrompts.filter(p=>p.eventMetadata?.caseId===id),
  ...p44ProductionPrompts.filter(p=>p.eventMetadata?.caseId===id),
  ...p44ReplyPrompts.filter(p=>p.eventMetadata?.caseId===id)
 ];
}
