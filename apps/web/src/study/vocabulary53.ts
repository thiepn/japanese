import type {StudyPrompt} from "@thiepn/study-player";
import {normalizeP26} from "./pedagogy26";
import type {P53Vocabulary} from "./vocabulary53-types";
import {p53FamiliesFor} from "./vocabulary53-families";
import {p53TravelVocabulary} from "./vocabulary53-travel";
import {p53ServiceVocabulary} from "./vocabulary53-services";
import {p53StudyVocabulary} from "./vocabulary53-study";
import {p53HomeVocabulary} from "./vocabulary53-home";
import {p53SocialVocabulary} from "./vocabulary53-social";

export type {P53Vocabulary,P53Domain} from "./vocabulary53-types";
export const p53Vocabulary:readonly P53Vocabulary[]=[
 ...p53TravelVocabulary,...p53ServiceVocabulary,...p53StudyVocabulary,
 ...p53HomeVocabulary,...p53SocialVocabulary
];
export const p53ById=(id:string):P53Vocabulary|undefined=>p53Vocabulary.find(v=>v.id===id);
export const p53ForUnit=(id:string):P53Vocabulary[]=>p53Vocabulary.filter(v=>v.units.includes(id));

/** Comparison can recognize authored examples, not semantically evaluate arbitrary Japanese. */
export function p53Compare(answer:string,examples:readonly string[],v:P53Vocabulary):
 {kind:"example"|"unassessed";message:string}{
 const n=normalizeP26(answer);
 return examples.some(e=>normalizeP26(e)===n)?
  {kind:"example",message:"Der vollständige Satz entspricht einem originalen Textmodell; Kontext und Register trotzdem prüfen."}:
  {kind:"unassessed",message:"Nicht automatisch sprachlich beurteilt. Auch andere natürliche japanische Sätze können richtig sein. Prüfe: "+v.nuance+" Typische Verwechslung: "+v.misconception+" "+v.repair};
}
function shared(v:P53Vocabulary,k:"meaning"|"production"|"return"):Pick<StudyPrompt,
 "primaryTarget"|"cueFamily"|"answerNormalization"|"contextId"|"sourceId"|"contentVersion"|"eventMetadata">{
 return {primaryTarget:{kind:"can_do",id:"p53:usage:"+v.id+":"+k},
 cueFamily:"p53-original-"+v.id+"-"+k,answerNormalization:"japanese",
 contextId:"p53:usage:"+v.id,sourceId:"thiepn-original",contentVersion:"p53-1",
 eventMetadata:{p53:true,vocabularyId:v.id,unitIds:[...v.units],level:"A2",domain:v.domain,
  independentCue:true,sourceRights:"thiepn-original"}};
}
const meaningPrompt=(v:P53Vocabulary):StudyPrompt=>{
 const c=shared(v,"meaning");
 return {...c,id:"p53-meaning-"+v.id,skill:"form_selection",promptType:"typed",
 instruction:"Aktiv einen vollständigen originalen japanischen Satz abrufen. Der Mustervergleich ist keine offene Grammatikbewertung.",
 prompt:"Alltagssituation: "+v.scene+"\nZielwort: "+v.written+"（"+v.reading+"）"+
  "\nBedeutung: "+v.meaning+"\nWiedergabe der Originalaussage: "+v.translation+
  "\nSchreibe den gesamten japanischen Satz.",
 acceptedAnswers:[normalizeP26(v.example)],displayAnswer:v.example,
 explanation:"Typischer Gebrauch: "+v.collocations.join(" / ")+". "+v.nuance+
  " Verwandte Ausdrücke: "+p53FamiliesFor(v.id).map(f=>f.explanation).slice(0,2).join(" ")+" Fehlergefahr: "+v.misconception+" "+v.repair,
 eventMetadata:{...c.eventMetadata,kind:"contextual-lexical-meaning",focus:"lexical-distinction"}};
};
function situationalPrompt(v:P53Vocabulary,kind:"production"|"return"):StudyPrompt{
 const c=shared(v,kind),isReturn=kind==="return",t=isReturn?v.return:v.production;
 return {...c,id:"p53-"+kind+"-"+v.id,skill:"production",promptType:"typed",
 instruction:isReturn?"Neue noch ungesehene Alltagssituation: Bedeutung und Kollokation ohne früheres Beispiel selbst abrufen.":
 "Eigenständige situative Produktion mit einem anderen Sachverhalt; vollständige japanische Aussage schreiben.",
 prompt:t.situation+"\nNutze "+v.written+" in einem passenden vollständigen japanischen Satz, ohne die frühere Beispielaussage zu wiederholen.",
 acceptedAnswers:[normalizeP26(t.model)],displayAnswer:t.model,
 explanation:"Originales mögliches Satzmodell; weitere korrekte Formulierungen bleiben außerhalb des endlichen Abgleichs. "+
  "Kollokationen: "+v.collocations.join(" / ")+". "+v.nuance+" "+
  p53FamiliesFor(v.id).map(f=>f.explanation).slice(0,1).join(" ")+" "+v.repair,
 eventMetadata:{...c.eventMetadata,kind:isReturn?"cross-context-lexical-return":"lexical-independent-production",
  focus:isReturn?"delayed-independent-return":"situated-active-vocabulary"}};
}
export const p53MeaningPrompts:StudyPrompt[]=p53Vocabulary.map(meaningPrompt);
export const p53ProductionPrompts:StudyPrompt[]=p53Vocabulary.map(v=>situationalPrompt(v,"production"));
export const p53ReturnPrompts:StudyPrompt[]=p53Vocabulary.map(v=>situationalPrompt(v,"return"));
export const p53Prompts:StudyPrompt[]=[...p53MeaningPrompts,...p53ProductionPrompts,...p53ReturnPrompts];
export type P53PracticeKind="meaning"|"production"|"return"|"all";
export function p53PromptsForVocabulary(id:string,k:P53PracticeKind="all"):StudyPrompt[]{
 if(!p53ById(id))return [];
 if(k==="meaning")return p53MeaningPrompts.filter(p=>p.eventMetadata?.vocabularyId===id);
 if(k==="production")return p53ProductionPrompts.filter(p=>p.eventMetadata?.vocabularyId===id);
 if(k==="return")return p53ReturnPrompts.filter(p=>p.eventMetadata?.vocabularyId===id);
 return [...p53MeaningPrompts,...p53ProductionPrompts].filter(p=>p.eventMetadata?.vocabularyId===id);
}
