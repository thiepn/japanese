import type {StudyPrompt} from "@thiepn/study-player";
import {normalizeP26} from "./pedagogy26";
import type {P51Contrast,P51Task} from "./grammar51-types";
import {p51ContrastsA} from "./grammar51-corpus-a";
import {p51ContrastsB} from "./grammar51-corpus-b";
import {p51ContrastsC} from "./grammar51-corpus-c";
import {p51ContrastsD} from "./grammar51-corpus-d";
import {p51ContrastsE} from "./grammar51-corpus-e";

export type {P51Contrast,P51Task,P51Example,P51Domain} from "./grammar51-types";
export const p51Contrasts:readonly P51Contrast[]=[
 ...p51ContrastsA,...p51ContrastsB,...p51ContrastsC,...p51ContrastsD,...p51ContrastsE
];
export function p51ForUnit(unitId:string):P51Contrast[]{
 return p51Contrasts.filter(c=>c.units.includes(unitId));
}
export function p51ById(id:string):P51Contrast|undefined{
 return p51Contrasts.find(c=>c.id===id);
}
export function p51AuthoredComparison(value:string,valid:readonly string[],misconception:string,reason:string):
 {kind:"example"|"specific-error"|"unassessed";message:string}{
 const normalized=normalizeP26(value);
 if(valid.some(v=>normalizeP26(v)===normalized))return {
  kind:"example",message:"Diese Form entspricht einem der zwei originalen Modellbeispiele."
 };
 if(normalizeP26(misconception)===normalized)return {kind:"specific-error",message:reason};
 return {kind:"unassessed",
  message:"Deine andere japanische Antwort wurde nicht semantisch beurteilt. Prüfe Sprecherrolle, Bedeutung und die Erklärung. Eine unbekannte Form ist nicht automatisch falsch."};
}
function common(c:P51Contrast,kind:string):Pick<StudyPrompt,
 "primaryTarget"|"cueFamily"|"answerNormalization"|"contextId"|"sourceId"|"contentVersion"|"eventMetadata">{
 return {
  primaryTarget:{kind:"can_do",id:"p51:contrast:"+c.id+":"+kind},
  cueFamily:"p51-original-"+c.id+"-"+kind,
  answerNormalization:"japanese",contextId:"p51:contrast:"+c.id,
  sourceId:"thiepn-original",contentVersion:"p51-1",
  eventMetadata:{p51:true,contrastId:c.id,unitIds:[...c.units],level:"A2",
   domain:c.domain,independentCue:true}
 };
}
export const p51MeaningPrompts:StudyPrompt[]=p51Contrasts.map(c=>{
 const shared=common(c,"meaning");
 return {...shared,id:"p51-meaning-"+c.id,skill:"form_selection",promptType:"typed",
  instruction:"Bedeutungskontrast aktiv unterscheiden: genau ein passendes original japanisches Beispiel wiedergeben. Diese textgestützte Übung ist kein offener Grammatikrichter.",
  prompt:"Kommunikativer Kontext: "+c.scene+"\nHörer: "+c.audience+
   "\nUnterscheide: "+c.formA+" ("+c.meaningA+") oder "+
   c.formB+" ("+c.meaningB+")?\nZiel: "+c.examples[0]!.english+
   "\nSchreibe die passende japanische Beispieläußerung.",
  acceptedAnswers:[normalizeP26(c.examples[0]!.japanese)],
  displayAnswer:c.examples[0]!.japanese,
  explanation:c.examples[0]!.why+" "+c.choiceRule+
    " "+c.errorRepair+" Weitere korrekte Formulierungen können außerhalb des Originalmusters liegen.",
  eventMetadata:{...shared.eventMetadata,kind:"contextual-meaning",focus:"meaning-contrast"}
 };
});
function taskPrompt(c:P51Contrast,t:P51Task,kind:"production"|"return"):StudyPrompt{
 const shared=common(c,kind),isReturn=kind==="return";
 return {...shared,id:"p51-"+kind+"-"+c.id,
  skill:"production",promptType:"typed",
  instruction:isReturn?
    "Neue eigenständige Kommunikationssituation ohne altes Beispiel: wahre Sprecherabsicht und passend gewählte Form produzieren.":
    "Situationsgerechte grammatische Wahl in unabhängig geschriebenem Japanisch; nur verfasste Modellformen können technisch verglichen werden.",
  prompt:(isReturn?"Neue Situation: ":"Kontext: "+c.scene+"\nAdressat: "+
    c.audience+"\nRegister: "+c.register+"\nAuftrag: ")+t.situation,
  acceptedAnswers:[normalizeP26(t.model),normalizeP26(t.alternative)],
  displayAnswer:t.model,
  explanation:t.feedback+" Grammatikregel: "+c.choiceRule+
    ". Nicht jedes grammatisch korrekte Synonym ist in diesen Antwortmustern erfasst.",
  eventMetadata:{...shared.eventMetadata,
   kind:isReturn?"cross-context-transfer":"grammar-choice-production",
   focus:isReturn?"delayed-independent-return":"contextual-grammar-writing"}
 };
}
export const p51ProductionPrompts:StudyPrompt[]=p51Contrasts.map(c=>
 taskPrompt(c,c.production,"production"));
export const p51ReturnPrompts:StudyPrompt[]=p51Contrasts.map(c=>
 taskPrompt(c,c.transfer,"return"));
export const p51Prompts:StudyPrompt[]=[
 ...p51MeaningPrompts,...p51ProductionPrompts,...p51ReturnPrompts
];
export type P51PracticeKind="meaning"|"production"|"return"|"all";
export function p51PromptsForContrast(id:string,kind:P51PracticeKind="all"):StudyPrompt[]{
 if(!p51ById(id))return [];
 const meaning=p51MeaningPrompts.filter(p=>p.eventMetadata?.contrastId===id);
 const production=p51ProductionPrompts.filter(p=>p.eventMetadata?.contrastId===id);
 const returns=p51ReturnPrompts.filter(p=>p.eventMetadata?.contrastId===id);
 if(kind==="meaning")return meaning;
 if(kind==="production")return production;
 if(kind==="return")return returns;
 return [...meaning,...production];
}
