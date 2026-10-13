import type {StudyPrompt} from "@thiepn/study-player";
import {normalizeP26} from "./pedagogy26";
import type {P49Document,P49Task,P49Question} from "./documents49-types";
import {p49DocumentsA} from "./documents49-corpus-a";
import {p49DocumentsB} from "./documents49-corpus-b";
import {p49DocumentsC} from "./documents49-corpus-c";
import {p49DocumentsD} from "./documents49-corpus-d";
import {p49DocumentsE} from "./documents49-corpus-e";

export type {P49Document,P49Task,P49Question,P49Word,P49Genre} from "./documents49-types";
export const p49Documents:readonly P49Document[]=[
 ...p49DocumentsA,...p49DocumentsB,...p49DocumentsC,...p49DocumentsD,...p49DocumentsE
];
export function p49ForUnit(id:string):P49Document[]{
 return p49Documents.filter(d=>d.units.includes(id));
}
export function p49ById(id:string):P49Document|undefined{
 return p49Documents.find(d=>d.id===id);
}
export function p49AuthoredComparison(text:string,models:readonly string[],
 trap:string,explanation:string):{kind:"example"|"specific-error"|"unassessed";message:string}{
 const value=normalizeP26(text);
 if(models.some(m=>normalizeP26(m)===value))return {
   kind:"example",message:"Die Antwort entspricht einem eigens verfassten japanischen Beispiel."
 };
 if(normalizeP26(trap)===value)return {
   kind:"specific-error",message:explanation
 };
 return {
   kind:"unassessed",message:"Diese andere japanische Formulierung wurde hier nicht semantisch bewertet. Prüfe Bedeutung und Textbeleg; unbewertet ist nicht automatisch falsch."
 };
}
const docText=(d:P49Document)=>d.title+"\n"+d.blocks.join("\n");
function root(d:P49Document,kind:string):Pick<StudyPrompt,
 "primaryTarget"|"cueFamily"|"answerNormalization"|"contextId"|"sourceId"|"contentVersion"|"eventMetadata">{
 return {
  primaryTarget:{kind:"can_do",id:"p49:document:"+d.id+":"+kind},
  cueFamily:"p49-original-"+d.id+"-"+kind,
  answerNormalization:"japanese",contextId:"p49:document:"+d.id,
  sourceId:"thiepn-original",contentVersion:"p49-1",
  eventMetadata:{p49:true,documentId:d.id,unitIds:[...d.units],
    level:d.level,genre:d.genre,independentCue:true,
    kind:"practical-document"}
 };
}
export const p49ComprehensionPrompts:StudyPrompt[]=p49Documents.flatMap(d=>
 d.questions.map((q,i)=>{
  const shared=root(d,"question-"+(i+1));
  return {...shared,id:"p49-question-"+q.id,
   skill:"production",promptType:"typed",
   instruction:q.kind==="locate"?
     "Finde ein ausdrücklich belegtes japanisches Dokumentdetail.":
     q.kind==="condition"?
     "Prüfe die geltende Bedingung, Frist, Ausnahme oder Berechtigung.":
     "Schließe nur das, was dieses Originaldokument tatsächlich zulässt.",
   prompt:"Situation: "+d.purpose+"\nDokument von "+d.issuer+":\n"+
     docText(d)+"\n\nFrage: "+q.question,
   acceptedAnswers:[normalizeP26(q.model),normalizeP26(q.alternative)],
   displayAnswer:q.model,
   explanation:q.explanation+" Textbeleg: 「"+q.evidence+"」. "+
     "Inhaltlich gleichwertiges anderes Japanisch kann außerhalb der zwei Modellformen liegen.",
   eventMetadata:{...shared.eventMetadata,questionId:q.id,
     questionKind:q.kind,kind:"practical-document-comprehension"}
  };
 })
);
export const p49VocabularyPrompts:StudyPrompt[]=p49Documents.flatMap(d=>
 d.terms.map((w,i)=>{
  const shared=root(d,"word-"+(i+1));
  return {...shared,id:"p49-word-"+d.id+"-"+(i+1),skill:"production",
   promptType:"typed",instruction:"Dokumentwort mit seinem konkreten Gebrauch selbst abrufen.",
   prompt:"Dokument: "+d.title+"\nDeutsche Bedeutung: "+w.meaning+
     "\nKontext: "+w.context.replace(w.form,"＿＿"),
   acceptedAnswers:[normalizeP26(w.form)],displayAnswer:w.form,
   explanation:"Lesung: "+w.reading+". Originalkontext: 「"+w.context+"」.",
   eventMetadata:{...shared.eventMetadata,kind:"linked-lexicon",
     wordIndex:i+1}
  };
 })
);
function taskPrompt(d:P49Document,t:P49Task,step:"write"|"return"):StudyPrompt{
 const shared=root(d,step),isReturn=step==="return";
 return {...shared,id:"p49-"+step+"-"+d.id,
  skill:"production",promptType:"typed",
  instruction:isReturn?
   "UNBEKANNTER NEUER Kontext: Formuliere ohne das gelesene Dokument auf Japanisch.":
   "Nach der Dokumentlektüre selbst einen zweckmäßigen japanischen Satz verfassen.",
  prompt:(isReturn?"Neue Situation: ":docText(d)+"\n\nEigene Reaktion: ")+t.instruction,
  acceptedAnswers:[normalizeP26(t.model),normalizeP26(t.alternative)],
  displayAnswer:t.model,
  explanation:t.explanation+" Die Beispielsätze sind keine umfassende Freitextbewertung.",
  eventMetadata:{...shared.eventMetadata,
   kind:isReturn?"cross-context-transfer":"document-writing",
   focus:isReturn?"delayed-independent-return":"document-supported-writing"}
 };
}
export const p49WritingPrompts:StudyPrompt[]=p49Documents.map(d=>
 taskPrompt(d,d.writing,"write"));
export const p49ReturnPrompts:StudyPrompt[]=p49Documents.map(d=>
 taskPrompt(d,d.returnCue,"return"));
export const p49Prompts:StudyPrompt[]=[
 ...p49ComprehensionPrompts,...p49VocabularyPrompts,
 ...p49WritingPrompts,...p49ReturnPrompts
];
export type P49PracticeKind="comprehension"|"vocabulary"|"writing"|"return"|"all";
export function p49PromptsForDocument(id:string,kind:P49PracticeKind="all"):StudyPrompt[]{
 if(!p49ById(id))return [];
 const q=p49ComprehensionPrompts.filter(p=>p.eventMetadata?.documentId===id);
 const v=p49VocabularyPrompts.filter(p=>p.eventMetadata?.documentId===id);
 const w=p49WritingPrompts.filter(p=>p.eventMetadata?.documentId===id);
 const r=p49ReturnPrompts.filter(p=>p.eventMetadata?.documentId===id);
 if(kind==="comprehension")return q;
 if(kind==="vocabulary")return v;
 if(kind==="writing")return w;
 if(kind==="return")return r;
 return [...q,...v,...w];
}
