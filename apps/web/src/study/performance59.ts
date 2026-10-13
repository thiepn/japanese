import type {StudyPrompt} from "@thiepn/study-player";
import {normalizeP26} from "./pedagogy26";
import {p53ById} from "./vocabulary53";
import {p53FamiliesFor} from "./vocabulary53-families";
import {p58ForUnit} from "./missions58";
import {p57ForUnit} from "./writing57";
import {p56ForUnit} from "./interaction56";
import {p55ForUnit} from "./listening55";
import {p54ForUnit} from "./reading54";
import {p49ForUnit} from "./documents49";
import type {P59Mission,P59Question,P59Task} from "./performance59-types";
import {p59MissionsA} from "./performance59-corpus-a";
import {p59MissionsB} from "./performance59-corpus-b";
import {p59MissionsC} from "./performance59-corpus-c";
import {p59MissionsD} from "./performance59-corpus-d";
import {p59MissionsE} from "./performance59-corpus-e";
export type {P59Mission,P59Line,P59Question,P59Task,P59QuestionKind} from "./performance59-types";

export const p59Missions:readonly P59Mission[]=[
 ...p59MissionsA,...p59MissionsB,...p59MissionsC,...p59MissionsD,...p59MissionsE
];
export const p59ById=(id:string):P59Mission|undefined=>p59Missions.find(m=>m.id===id);
export const p59ForUnit=(unitId:string):P59Mission[]=>p59Missions.filter(m=>m.units.includes(unitId));
export function p59Stage(id:string):{number:number;heading:string;assistance:string}{
 const index=p59Missions.findIndex(m=>m.id===id);
 if(index<0)return {number:0,heading:"Nicht gefunden",assistance:""};
 if(index<7)return {number:1,heading:"Belege verbinden",
  assistance:"Schrittweise Quelle, Nachricht und Dialog lesen; optionales deutsches Verständnis pro Zeile"};
 if(index<21)return {number:2,heading:"Selbstständig vergleichen",
  assistance:"Zuerst selbst mehrere Aussagen überblicken; Modellhilfe und Belege erst nach eigenem Versuch"};
 if(index<28)return {number:3,heading:"Unsichere Information reparieren",
  assistance:"Längere Quellen ohne Vorauswahl der Belege; zusätzliche Rückfrage selbstständig beantworten"};
 return {number:4,heading:"Unabhängige Gesamtaufgabe",
  assistance:"Zuerst Auftrag selbst erfüllen, Hilfe auf eigener Anforderung; unbekannte neue Quellen später abrufen"};
}
export function p59RelatedSources(m:P59Mission){
 const unit=m.units[0]??"";
 // Read-only curricular precursors: NOT claims that historical sources share the new event.
 return {integrated:p58ForUnit(unit)[0],writing:p57ForUnit(unit)[0],
  interaction:p56ForUnit(unit)[0],listening:p55ForUnit(unit)[0],
  reading:p54ForUnit(unit)[0],document:p49ForUnit(unit)[0]};
}
export function p59RelatedVocabulary(m:P59Mission){
 const originalTexts=[...m.source,...m.messages,...m.dialogue].map(x=>x.japanese);
 return m.words.flatMap(id=>{
  const w=p53ById(id);
  return w?[{...w,attested:originalTexts.some(s=>s.includes(w.written)),
   families:p53FamiliesFor(w.id)}]:[];
 });
}
/** Example recognition only. This is not an automatic semantic grade of a drafted message. */
export function p59AuthoredFeedback(value:string,models:readonly string[],mistake:string,
 reason:string):{kind:"model"|"specific-error"|"unassessed";message:string}{
 const n=normalizeP26(value);
 if(models.some(a=>normalizeP26(a)===n))
  return {kind:"model",message:"Die vollständige Eingabe stimmt mit einer original geschriebenen japanischen Modellform überein."};
 if(normalizeP26(mistake)===n)return {kind:"specific-error",message:reason};
 return {kind:"unassessed",message:"Eine andere japanische Formulierung bleibt hier unbewertet, nicht automatisch falsch. Prüfe Quellenrang, Register, Bedingungen und den tatsächlich bestätigten Stand."};
}
function shared(m:P59Mission,k:string):Pick<StudyPrompt,
 "primaryTarget"|"cueFamily"|"answerNormalization"|"contextId"|"sourceId"|"contentVersion"|"eventMetadata">{
 return {primaryTarget:{kind:"can_do",id:"p59:independent-performance:"+m.id+":"+k},
  cueFamily:"p59-original-independent-"+m.id+"-"+k,
  answerNormalization:"japanese",contextId:"p59:mission:"+m.id,
  sourceId:"thiepn-original",contentVersion:"p59-1",
  eventMetadata:{p59:true,missionId:m.id,unitIds:[...m.units],
   level:"A2",originalRights:"thiepn-original",
   modality:"long-reading-message-device-tts",independentCue:true,
   relatedExamplesAreSeparate:true,deviceTtsOptional:true,recordedNativeAudio:false,
   measuredListening:false,openTextSemanticallyGraded:false,rawPrivateDraftStored:false}
 };
}
const completeSource=(m:P59Mission)=>"Japanische Originalquelle:\n"+
 m.source.map(x=>x.speaker+"： "+x.japanese).join("\n\n")+
 "\n\nNachrichten:\n"+m.messages.map(x=>x.speaker+"： "+x.japanese).join("\n")+
 "\n\nSprechtext (keine Aufnahme, sichtbar):\n"+
 m.dialogue.map(x=>x.speaker+"： "+x.japanese).join("\n");
function comprehension(m:P59Mission,q:P59Question,i:number):StudyPrompt{
 const root=shared(m,"question-"+(i+1));
 return {...root,id:"p59-question-"+q.id,skill:"production",promptType:"typed",
  instruction:"Vergleiche alle originalen Dokument- und Gesprächsangaben. Dieses Textskript und der Antwortvergleich belegen KEINE gemessene Hörleistung.",
  prompt:"Situation: "+m.situation+"\n"+completeSource(m)+"\n\nFrage: "+q.question,
  acceptedAnswers:[normalizeP26(q.model),normalizeP26(q.alternative)],
  displayAnswer:q.model,
  explanation:q.explanation+" Quellenbeleg: 「"+q.sourceQuote+
   "」; Sprecherbeleg: 「"+q.dialogueQuote+
   "」. Die begrenzten Originalmuster sind keine vollständige Freitextbewertung.",
  eventMetadata:{...root.eventMetadata,kind:"independent-cross-source-comprehension",
   questionId:q.id,questionKind:q.kind,evidenceBound:true}
 };
}
export const p59ComprehensionPrompts:StudyPrompt[]=p59Missions.flatMap(m=>
 m.questions.map((q,i)=>comprehension(m,q,i)));
export const p59StrategyPrompts:StudyPrompt[]=p59Missions.map(m=>{
 const root=shared(m,"strategy"),t=m.strategy;
 return {...root,id:"p59-strategy-"+m.id,skill:"form_selection",promptType:"choice",
  instruction:"Ohne Hilfsmuster zwischen zwei verantwortlichen, quellentreuen Antworten und einer erfundenen Annahme unterscheiden.",
  prompt:completeSource(m)+"\n\nAuftrag: "+t.situation,
  choices:[t.model,t.misleading,t.alternative],
  acceptedAnswers:[normalizeP26(t.model),normalizeP26(t.alternative)],
  displayAnswer:t.model,
  explanation:t.explanation+" Unbegründete Annahme: "+t.misleading,
  eventMetadata:{...root.eventMetadata,kind:"independent-multi-source-strategy"}
 };
});
function taskPrompt(m:P59Mission,t:P59Task,k:"write"|"return"):StudyPrompt{
 const root=shared(m,k),later=k==="return";
 return {...root,id:"p59-"+k+"-"+m.id,skill:"production",promptType:"typed",
  instruction:later?"Ungesehene veränderte Situation unabhängig bearbeiten; keine früheren Quellen oder Modelle verwenden.":
   "Originale Quellen ohne automatische offene Sprachbewertung in einer eigenen vollständigen Nachricht verknüpfen.",
  prompt:(later?"Neue unabhängige A2-Situation: ":
   completeSource(m)+"\n\nEigenständiger Schreibauftrag: ")+t.situation,
  acceptedAnswers:[normalizeP26(t.model),normalizeP26(t.alternative)],
  displayAnswer:t.model,
  explanation:t.explanation+" Häufiger Fehlschluss: "+t.misleading+
   ". Weitere natürliche gültige Antworten können außerhalb der endlichen Muster liegen.",
  eventMetadata:{...root.eventMetadata,kind:later?"independent-unseen-transfer":"independent-connected-writing",
   focus:later?"delayed-independent-return":"composition",semanticGrade:"finite-authored-forms"}
 };
}
export const p59WritingPrompts:StudyPrompt[]=p59Missions.map(m=>taskPrompt(m,m.write,"write"));
export const p59ReturnPrompts:StudyPrompt[]=p59Missions.map(m=>taskPrompt(m,m.returnCue,"return"));
export const p59ReplyPrompts:StudyPrompt[]=p59Missions.map(m=>{
 const root=shared(m,"reply"),t=m.reply;
 return {...root,id:"p59-reply-"+m.id,skill:"production",promptType:"typed",
  instruction:"Auf eine unerwartete geänderte Information unabhängig in natürlichem Japanisch antworten.",
  prompt:"Bisherige Quellen:\n"+completeSource(m)+"\n\nNeue Nachricht: "+
   t.incomingSpeaker+"： "+t.incomingJapanese+"\nNeuer Kommunikationsauftrag: "+t.newGoal,
  acceptedAnswers:[normalizeP26(t.model),normalizeP26(t.alternative)],
  displayAnswer:t.model,
  explanation:t.explanation+" Falsche Annahme: "+t.misleading+
   ". Nicht gemessene spontane Sprachleistung, sondern textgestützte Ausgabe.",
  eventMetadata:{...root.eventMetadata,kind:"independent-new-turn-repair",sourceRole:t.incomingSpeaker}
 };
});
export const p59RevisionPrompts:StudyPrompt[]=p59Missions.map(m=>{
 const root=shared(m,"revision"),t=m.revision;
 return {...root,id:"p59-revision-"+m.id,skill:"production",promptType:"typed",
  instruction:"Eine nachprüfbar falsche ursprüngliche Mitteilung aus der tatsächlich letzten Quellenlage korrigieren.",
  prompt:completeSource(m)+"\n\nFehlerhafter Beispieltext: "+t.flawed+"\nAuftrag: "+t.goal,
  acceptedAnswers:[normalizeP26(t.model),normalizeP26(t.alternative)],
  displayAnswer:t.model,explanation:t.explanation+
   " Andere gleichwertige Umschreibungen werden vom endlichen Abgleich nicht vollständig erkannt.",
  eventMetadata:{...root.eventMetadata,kind:"independent-message-correction"}
 };
});
export const p59Prompts:StudyPrompt[]=[
 ...p59ComprehensionPrompts,...p59StrategyPrompts,...p59WritingPrompts,
 ...p59ReplyPrompts,...p59RevisionPrompts,...p59ReturnPrompts
];
export type P59PracticeKind="comprehension"|"strategy"|"writing"|"reply"|"revision"|"return"|"all";
export function p59PromptsForMission(id:string,kind:P59PracticeKind="all"):StudyPrompt[]{
 if(!p59ById(id))return [];
 const filter=(prompts:readonly StudyPrompt[])=>prompts.filter(p=>p.eventMetadata?.missionId===id);
 const c=filter(p59ComprehensionPrompts),strategy=filter(p59StrategyPrompts),
  write=filter(p59WritingPrompts),reply=filter(p59ReplyPrompts),
  rev=filter(p59RevisionPrompts),ret=filter(p59ReturnPrompts);
 if(kind==="comprehension")return c;
 if(kind==="strategy")return strategy;
 if(kind==="writing")return write;
 if(kind==="reply")return reply;
 if(kind==="revision")return rev;
 if(kind==="return")return ret;
 return [...c,...strategy,...write,...reply,...rev];
}
