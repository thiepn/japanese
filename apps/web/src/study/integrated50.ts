import type {StudyPrompt} from "@thiepn/study-player";
import {normalizeP26} from "./pedagogy26";
import type {P50Mission,P50Task} from "./integrated50-types";
import {p50MissionsA} from "./integrated50-corpus-a";
import {p50MissionsB} from "./integrated50-corpus-b";
import {p50MissionsC} from "./integrated50-corpus-c";
import {p50MissionsD} from "./integrated50-corpus-d";

export type {P50Mission,P50Question,P50Evidence,P50Task,P50Line} from "./integrated50-types";
export const p50Missions:readonly P50Mission[]=[
 ...p50MissionsA,...p50MissionsB,...p50MissionsC,...p50MissionsD
];
export function p50ForUnit(id:string):P50Mission[]{
 return p50Missions.filter(m=>m.units.includes(id));
}
export function p50ById(id:string):P50Mission|undefined{
 return p50Missions.find(m=>m.id===id);
}
/** A bounded authored comparison, never an open-ended Japanese semantic evaluator. */
export function p50AuthoredComparison(text:string,models:readonly string[],
 misconception:string,feedback:string):{kind:"example"|"misconception"|"unassessed";message:string}{
 const normalized=normalizeP26(text);
 if(models.some(m=>normalizeP26(m)===normalized))return {
  kind:"example",message:"Entspricht einer eigens geschriebenen japanischen Modellform."
 };
 if(normalizeP26(misconception)===normalized)return {
  kind:"misconception",message:feedback
 };
 return {
  kind:"unassessed",message:"Diese alternative japanische Form wurde nicht semantisch bewertet. Prüfe beide Quellen und ihre gültigen Fakten; unbewertet bedeutet nicht automatisch falsch."
 };
}
const sourceText=(m:P50Mission)=>"Lesetext ("+m.readLabel+"):\n"+
 m.reading.join("\n")+"\n\nGesprochener Text (Transkript, keine Audioaufnahme):\n"+
 m.listening.map(l=>l.speaker+"： "+l.japanese).join("\n");
function root(m:P50Mission,kind:string):Pick<StudyPrompt,
 "primaryTarget"|"cueFamily"|"answerNormalization"|"contextId"|"sourceId"|"contentVersion"|"eventMetadata">{
 return {
  primaryTarget:{kind:"can_do",id:"p50:integrated:"+m.id+":"+kind},
  cueFamily:"p50-original-"+m.id+"-"+kind,
  answerNormalization:"japanese",contextId:"p50:integrated:"+m.id,
  sourceId:"thiepn-original",contentVersion:"p50-1",
  eventMetadata:{p50:true,missionId:m.id,unitIds:[...m.units],
   level:m.level,genre:m.genre,independentCue:true,
   modality:"reading-plus-device-tts"}
 };
}
export const p50ComprehensionPrompts:StudyPrompt[]=p50Missions.flatMap(m=>
 m.questions.map((q,i)=>{
  const shared=root(m,"question-"+(i+1));
  return {...shared,id:"p50-question-"+q.id,skill:"production",promptType:"typed",
   instruction:"Eigenständige TEXTGESTÜTZTE StudyPlayer-Frage: Originaltext und vollständiges Skript lesen. Der native Text-Test ist kein Beweis für Hörverständnis ohne Transkript.",
   prompt:"Situation: "+m.situation+"\n\n"+sourceText(m)+
     "\n\nFrage: "+q.question,
   acceptedAnswers:[normalizeP26(q.model),normalizeP26(q.alternative)],
   displayAnswer:q.model,
   explanation:q.feedback+" Belege: "+q.evidence.map(e=>
     (e.modality==="reading"?"Lesetext":"Sprechtext")+
     "「"+e.excerpt+"」("+e.purpose+")").join("; ")+
     ". Andere natürliche richtige japanische Antworten können außerhalb der Beispiele liegen.",
   eventMetadata:{...shared.eventMetadata,kind:"integrated-text-supported-comprehension",
     questionId:q.id,questionKind:q.reason}
  };
 })
);
export const p50VocabularyPrompts:StudyPrompt[]=p50Missions.flatMap(m=>
 m.vocabulary.map((w,i)=>{
  const shared=root(m,"word-"+(i+1));
  return {...shared,id:"p50-word-"+m.id+"-"+(i+1),
   skill:"production",promptType:"typed",
   instruction:"Kontextbezogenes Wort aus schriftlicher oder gesprochener Originalquelle erinnern.",
   prompt:"Situation: "+m.title+"\nBedeutung: "+w.meaning+
    "\nQuellenhinweis: "+w.source.replace(w.form,"＿＿"),
   acceptedAnswers:[normalizeP26(w.form)],displayAnswer:w.form,
   explanation:"Lesung: "+w.reading+". Originalquellenkontext: "+w.source,
   eventMetadata:{...shared.eventMetadata,kind:"cross-modal-context-word",wordIndex:i+1}
  };
 })
);
function taskPrompt(m:P50Mission,t:P50Task,kind:"write"|"return"):StudyPrompt{
 const shared=root(m,kind),isReturn=kind==="return";
 return {...shared,id:"p50-"+kind+"-"+m.id,
  skill:"production",promptType:"typed",
  instruction:isReturn?
   "EIGENSTÄNDIGER veränderter Alltagskontext; kein ursprünglicher Lesetext, keine gehörte Originalantwort.":
   "Schriftlich eigenständig auf beiden Originalquellen aufbauen. Es wird ausschließlich Textproduktion bewertet, keine überprüfte Audioleistung.",
  prompt:(isReturn?"Neue Situation: ":sourceText(m)+"\n\nEigene Reaktion: ")+t.instruction,
  acceptedAnswers:[normalizeP26(t.model),normalizeP26(t.alternative)],
  displayAnswer:t.model,
  explanation:t.feedback+" Endliche Muster sind keine umfassende Bedeutungsbewertung.",
  eventMetadata:{...shared.eventMetadata,kind:isReturn?"cross-context-transfer":"integrated-writing",
   focus:isReturn?"delayed-independent-return":"integrated-source-writing"}
 };
}
export const p50WritingPrompts:StudyPrompt[]=p50Missions.map(m=>
 taskPrompt(m,m.writing,"write"));
export const p50ReturnPrompts:StudyPrompt[]=p50Missions.map(m=>
 taskPrompt(m,m.transfer,"return"));
export const p50Prompts:StudyPrompt[]=[
 ...p50ComprehensionPrompts,...p50VocabularyPrompts,
 ...p50WritingPrompts,...p50ReturnPrompts
];
export type P50PracticeKind="comprehension"|"vocabulary"|"writing"|"return"|"all";
export function p50PromptsForMission(id:string,kind:P50PracticeKind="all"):StudyPrompt[]{
 if(!p50ById(id))return [];
 const q=p50ComprehensionPrompts.filter(p=>p.eventMetadata?.missionId===id);
 const v=p50VocabularyPrompts.filter(p=>p.eventMetadata?.missionId===id);
 const w=p50WritingPrompts.filter(p=>p.eventMetadata?.missionId===id);
 const r=p50ReturnPrompts.filter(p=>p.eventMetadata?.missionId===id);
 if(kind==="comprehension")return q;
 if(kind==="vocabulary")return v;
 if(kind==="writing")return w;
 if(kind==="return")return r;
 return [...q,...v,...w];
}
