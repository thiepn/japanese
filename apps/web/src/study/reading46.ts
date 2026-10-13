import type {StudyPrompt} from "@thiepn/study-player";
import {normalizeP26} from "./pedagogy26";
import type {P46Reading,P46Question,P46Output} from "./reading46-types";
import {p46ReadingsA} from "./reading46-corpus-a";
import {p46ReadingsB} from "./reading46-corpus-b";
import {p46ReadingsC} from "./reading46-corpus-c";
import {p46ReadingsD} from "./reading46-corpus-d";
import {p46ReadingsE} from "./reading46-corpus-e";

export type {P46Reading,P46Question,P46Word,P46Genre} from "./reading46-types";
export const p46Readings:readonly P46Reading[]=[
 ...p46ReadingsA,...p46ReadingsB,...p46ReadingsC,...p46ReadingsD,...p46ReadingsE
];
export function p46ForUnit(unitId:string):P46Reading[]{
 return p46Readings.filter(reading=>reading.units.includes(unitId));
}
export function p46ById(id:string):P46Reading|undefined{
 return p46Readings.find(reading=>reading.id===id);
}
export function p46AuthoredComparison(answer:string,correct:readonly string[],
 misconception:string,why:string):{kind:"authored"|"misconception"|"unknown";message:string}{
 const normalized=normalizeP26(answer);
 if(correct.some(item=>normalizeP26(item)===normalized))
  return {kind:"authored",message:"Diese Formulierung stimmt mit einem originalen Antwortbeispiel überein."};
 if(normalizeP26(misconception)===normalized)
  return {kind:"misconception",message:why};
 return {kind:"unknown",message:"Diese andere mögliche japanische Antwort wurde nicht semantisch bewertet. Prüfe sie am Textbeleg; unbekannt ist nicht automatisch falsch."};
}
function root(reading:P46Reading,kind:string):Pick<StudyPrompt,
  "primaryTarget"|"cueFamily"|"answerNormalization"|"contextId"|"sourceId"|"contentVersion"|"eventMetadata">{
 return {
  primaryTarget:{kind:"can_do",id:"p46:reading:"+reading.id+":"+kind},
  cueFamily:"p46-original-reading-"+reading.id+"-"+kind,
  answerNormalization:"japanese",contextId:"p46:reading:"+reading.id,
  sourceId:"thiepn-original",contentVersion:"p46-1",
  eventMetadata:{p46:true,readingId:reading.id,unitIds:[...reading.units],
   level:reading.level,genre:reading.genre,kind:"reading-comprehension",
   independentCue:true}
 };
}
const passage=(reading:P46Reading):string=>
 reading.title+" ("+reading.level+")\n"+reading.paragraphs.join("\n\n");
export const p46ComprehensionPrompts:StudyPrompt[]=p46Readings.flatMap(reading=>
 reading.questions.map((question,index)=>({
  ...root(reading,"question-"+(index+1)),id:"p46-question-"+question.id,
  skill:"production",promptType:"typed",
  instruction:question.kind==="detail"?"Finde das belegbare Textdetail und antworte auf Japanisch":
    question.kind==="inference"?"Verbinde mehrere Textinformationen und begründe die Schlussfolgerung":
    "Erkläre die Absicht oder Bedeutung einer Passage durch Textbelege",
  prompt:passage(reading)+"\n\nFrage "+(index+1)+": "+question.question,
  acceptedAnswers:[normalizeP26(question.model),normalizeP26(question.alternative)],
  displayAnswer:question.model,
  explanation:question.why+" Textbeleg: 「"+question.evidence+"」. "+
    "Freies, inhaltlich gleichwertiges Japanisch kann außerhalb der verfassten Antwortschlüssel liegen.",
  eventMetadata:{...root(reading,"question-"+(index+1)).eventMetadata,
   questionId:question.id,questionKind:question.kind}
 }))
);
export const p46VocabularyPrompts:StudyPrompt[]=p46Readings.flatMap(reading=>
 reading.words.map((word,index)=>({
  ...root(reading,"word-"+(index+1)),id:"p46-word-"+reading.id+"-"+(index+1),
  skill:"production",promptType:"typed",
  instruction:"Rufe das japanische Wort aus dem tatsächlichen Lesekontext ab",
  prompt:reading.title+"\nBedeutung: "+word.meaning+
    "\nIm Originaltext steht der Ausdruck innerhalb von: "+word.inContext.replace(word.form,"＿＿"),
  acceptedAnswers:[normalizeP26(word.form)],displayAnswer:word.form,
  explanation:"Lesung: "+word.reading+". Beleg aus der Passage: 「"+word.inContext+"」.",
  eventMetadata:{...root(reading,"word-"+(index+1)).eventMetadata,
    kind:"linked-lexicon",wordIndex:index+1}
 }))
);
function outputPrompt(reading:P46Reading,output:P46Output,kind:"write"|"return"):StudyPrompt{
 const isReturn=kind==="return";
 return {
  ...root(reading,kind),id:"p46-"+kind+"-"+reading.id,
  skill:"production",promptType:"typed",
  instruction:isReturn?"Neue Situation ohne den zuvor gelesenen Text. Antworte eigenständig auf Japanisch.":
    "Fasse oder formuliere zum gelesenen Inhalt selbst einen japanischen Satz.",
  prompt:(isReturn?"Neuer Kontext: ":passage(reading)+"\n\nEigene Formulierung: ")+output.situation,
  acceptedAnswers:[normalizeP26(output.model),normalizeP26(output.alternative)],
  displayAnswer:output.model,
  explanation:output.why+" Die beiden verfassten Muster sind keine erschöpfende Sprachbewertung.",
  eventMetadata:{...root(reading,kind).eventMetadata,
    kind:isReturn?"cross-context-transfer":"reading-writing",
    focus:isReturn?"delayed-independent-return":"reading-independent-writing"}
 };
}
export const p46WritingPrompts:StudyPrompt[]=p46Readings.map(reading=>
 outputPrompt(reading,reading.writing,"write"));
export const p46ReturnPrompts:StudyPrompt[]=p46Readings.map(reading=>
 outputPrompt(reading,reading.returnCue,"return"));
export const p46Prompts:StudyPrompt[]=[
 ...p46ComprehensionPrompts,...p46VocabularyPrompts,...p46WritingPrompts,...p46ReturnPrompts
];
export function p46PromptsForReading(id:string,kind:"comprehension"|"vocabulary"|"writing"|"return"|"all"="all"):StudyPrompt[]{
 if(!p46ById(id))return [];
 const q=p46ComprehensionPrompts.filter(p=>p.eventMetadata?.readingId===id);
 const v=p46VocabularyPrompts.filter(p=>p.eventMetadata?.readingId===id);
 const w=p46WritingPrompts.filter(p=>p.eventMetadata?.readingId===id);
 const r=p46ReturnPrompts.filter(p=>p.eventMetadata?.readingId===id);
 if(kind==="comprehension")return q;
 if(kind==="vocabulary")return v;
 if(kind==="writing")return w;
 if(kind==="return")return r;
 return [...q,...v,...w];
}
