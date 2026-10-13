import type {StudyPrompt} from "@thiepn/study-player";
import {normalizeP26} from "./pedagogy26";
import {p53ById} from "./vocabulary53";
import {p53FamiliesFor} from "./vocabulary53-families";
import {p54ById} from "./reading54";
import {p55ById} from "./listening55";
import {p57ById} from "./writing57";
import type {P58Mission,P58Question,P58Task} from "./missions58-types";
import {p58MissionsA} from "./missions58-corpus-a";
import {p58MissionsB} from "./missions58-corpus-b";
import {p58MissionsC} from "./missions58-corpus-c";
import {p58MissionsD} from "./missions58-corpus-d";
import {p58MissionsE} from "./missions58-corpus-e";
export type {P58Mission,P58Line,P58Question,P58Task} from "./missions58-types";

export const p58Missions:readonly P58Mission[]=[
 ...p58MissionsA,...p58MissionsB,...p58MissionsC,...p58MissionsD,...p58MissionsE
];
export const p58ById=(id:string):P58Mission|undefined=>p58Missions.find(m=>m.id===id);
export const p58ForUnit=(id:string):P58Mission[]=>p58Missions.filter(m=>m.units.includes(id));
export function p58Progression(id:string):{stage:number;focus:string}{
 const index=p58Missions.findIndex(m=>m.id===id);
 if(index<0)return {stage:0,focus:""};
 if(index<7)return {stage:1,focus:"Grundlegende Änderungen über Schild, Nachricht und Gespräch erkennen"};
 if(index<21)return {stage:2,focus:"Zeit, Regel, Genehmigung und tatsächliche Handlung differenzieren"};
 if(index<28)return {stage:3,focus:"Mehrere Bedingungen, neue Rückfragen und sichere selbstständige Entscheidung"};
 return {stage:4,focus:"Kumulative Quellenhierarchie, Statuskorrektur und selbstständige Gesamtantwort"};
}
/** Historical P54/P55/P57 sources are separate, unrelated examples, NOT a common timeline. */
export function p58RelatedSource(m:P58Mission){
 const reading=p54ById(m.reading54Id),listening=p55ById(m.listening55Id),
  writing=p57ById(m.writing57Id);
 return {reading,listening,writing};
}
export function p58RelatedWords(m:P58Mission){
 const sources=[m.notice.japanese,m.message.japanese,...m.spoken.map(t=>t.japanese)];
 return m.words.flatMap(id=>{
  const w=p53ById(id);
  return w?[{...w,attested:sources.some(s=>s.includes(w.written)),
    families:p53FamiliesFor(id)}]:[];
 });
}
export function p58Compare(input:string,models:readonly string[],misleading:string,why:string):
 {kind:"model"|"specific-error"|"unassessed";message:string}{
 const n=normalizeP26(input);
 if(models.some(m=>normalizeP26(m)===n))
  return {kind:"model",message:"Eigener Satz entspricht einer vollständig verfassten Originalmodellform."};
 if(normalizeP26(misleading)===n)
  return {kind:"specific-error",message:why};
 return {kind:"unassessed",message:"Eine andere natürliche japanische Formulierung ist hier nicht semantisch bewertet. Unbewertet bedeutet nicht falsch. Prüfe beide Quellen, Sprecher, Zeitpunkt und Bestätigung."};
}
function shared(m:P58Mission,kind:string):Pick<StudyPrompt,
 "primaryTarget"|"cueFamily"|"answerNormalization"|"contextId"|"sourceId"|"contentVersion"|"eventMetadata">{
 return {primaryTarget:{kind:"can_do",id:"p58:practical-mission:"+m.id+":"+kind},
  cueFamily:"p58-original-"+m.id+"-"+kind,answerNormalization:"japanese",
  contextId:"p58:mission:"+m.id,sourceId:"thiepn-original",contentVersion:"p58-1",
  eventMetadata:{p58:true,missionId:m.id,unitIds:[...m.units],level:"A2",
   independentCue:true,sourceRights:"thiepn-original",
   modality:"notice-message-device-tts",measuredListening:false,
   authoredVoiceOnly:true,freeWritingSemanticallyGraded:false,
   relatedExamplesAreIndependent:true}
 };
}
const source=(m:P58Mission)=>"Originaler Aushang: "+m.notice.speaker+"： "+m.notice.japanese+
 "\nOriginale Nachricht: "+m.message.speaker+"： "+m.message.japanese+
 "\nGesprochenes Skript (keine Aufnahme):\n"+m.spoken.map(t=>
 t.speaker+"： "+t.japanese).join("\n");
function qPrompt(m:P58Mission,q:P58Question,i:number):StudyPrompt{
 const b=shared(m,"question-"+(i+1));
 return {...b,id:"p58-question-"+q.id,skill:"production",promptType:"typed",
  instruction:"Originalen Schrifttext und sichtbares Transkript als zwei Quellen auswerten. Der native Textabgleich misst KEIN nachgewiesenes Hörverstehen.",
  prompt:"Situation: "+m.setting+"\n"+source(m)+"\nFrage: "+q.question,
  acceptedAnswers:[normalizeP26(q.model),normalizeP26(q.alternative)],
  displayAnswer:q.model,
  explanation:q.why+" Originale Text-/Nachrichtenquelle: 「"+q.evidenceA+
   "」. Originaler gesprochener Beleg: 「"+q.evidenceB+
   "」. Andere semantisch richtige Sätze können außerhalb der Modelle liegen.",
  eventMetadata:{...b.eventMetadata,kind:"integrated-text-supported-comprehension",
   questionId:q.id,questionKind:q.kind,evidenceBound:true}
 };
}
export const p58ComprehensionPrompts:StudyPrompt[]=p58Missions.flatMap(m=>
 m.questions.map((q,i)=>qPrompt(m,q,i)));
export const p58ChoicePrompts:StudyPrompt[]=p58Missions.map(m=>{
 const b=shared(m,"decision"),c=m.choice;
 return {...b,id:"p58-decision-"+m.id,skill:"form_selection",promptType:"choice",
  instruction:"Zwei angemessene Entscheidungen aus mehreren echten Quellen; eine falsche Überinterpretation.",
  prompt:"Situation: "+m.setting+"\n"+source(m)+"\nWas ist richtig? "+c.question,
  choices:[c.valid,c.misleading,c.alternative],
  acceptedAnswers:[normalizeP26(c.valid),normalizeP26(c.alternative)],
  displayAnswer:c.valid,explanation:c.why+" Die dritte Möglichkeit behauptet: "+c.misleading,
  eventMetadata:{...b.eventMetadata,kind:"cross-modal-pragmatic-choice"}
 };
});
function taskPrompt(m:P58Mission,t:P58Task,kind:"write"|"repair"|"return"):StudyPrompt{
 const b=shared(m,kind),later=kind==="return";
 return {...b,id:"p58-"+kind+"-"+m.id,skill:"production",promptType:"typed",
  instruction:later?"Wirklich neue, nicht vorgezeigte unabhängige Japanischsituation.":
   kind==="repair"?"Vorherige gefährliche oder falsche Aussage berichtigen, ohne Status zu erfinden.":
   "Originalquellen in einer eigenständig geschriebenen, zweckmäßigen Nachricht verbinden.",
  prompt:(later?"Neuer ungesehener Kontext: ":"Originalquellen:\n"+source(m)+"\nAufgabe: ")+t.situation,
  acceptedAnswers:[normalizeP26(t.model),normalizeP26(t.alternative)],
  displayAnswer:t.model,
  explanation:t.why+" Typischer Fehlschluss: "+t.misleading+
   " Der normale native Musterabgleich beurteilt keine beliebigen freien Texte.",
  eventMetadata:{...b.eventMetadata,kind:later?"cross-context-integrated-return":
   kind==="repair"?"cross-source-misconception-repair":"independent-integrated-writing",
   focus:later?"delayed-independent-return":kind}
 };
}
export const p58WritingPrompts:StudyPrompt[]=p58Missions.map(m=>taskPrompt(m,m.write,"write"));
export const p58RepairPrompts:StudyPrompt[]=p58Missions.map(m=>taskPrompt(m,m.repair,"repair"));
export const p58ReturnPrompts:StudyPrompt[]=p58Missions.map(m=>taskPrompt(m,m.returnCue,"return"));
export const p58ReplyPrompts:StudyPrompt[]=p58Missions.map(m=>{
 const b=shared(m,"reply"),t=m.reply;
 return {...b,id:"p58-reply-"+m.id,skill:"production",promptType:"typed",
  instruction:"Neue unerwartete Nachricht nach dem Quellenvergleich selbstständig beantworten.",
  prompt:"Ursprüngliche Lage:\n"+source(m)+"\nUnerwartete neue Aussage: "+
   t.incoming+"\nNeues Ziel: "+t.goal,
  acceptedAnswers:[normalizeP26(t.model),normalizeP26(t.alternative)],
  displayAnswer:t.model,
  explanation:t.why+" Falscher Reflex: "+t.misleading+
   " Die neue Aussage ändert möglicherweise ältere Bedingungen.",
  eventMetadata:{...b.eventMetadata,kind:"multi-source-followup-response"}
 };
});
export const p58Prompts:StudyPrompt[]=[
 ...p58ComprehensionPrompts,...p58ChoicePrompts,...p58WritingPrompts,
 ...p58ReplyPrompts,...p58RepairPrompts,...p58ReturnPrompts
];
export type P58PracticeKind="comprehension"|"choice"|"writing"|"reply"|"repair"|"return"|"all";
export function p58PromptsForMission(id:string,kind:P58PracticeKind="all"):StudyPrompt[]{
 if(!p58ById(id))return [];
 const c=p58ComprehensionPrompts.filter(p=>p.eventMetadata?.missionId===id);
 const a=p58ChoicePrompts.filter(p=>p.eventMetadata?.missionId===id);
 const w=p58WritingPrompts.filter(p=>p.eventMetadata?.missionId===id);
 const follow=p58ReplyPrompts.filter(p=>p.eventMetadata?.missionId===id);
 const fix=p58RepairPrompts.filter(p=>p.eventMetadata?.missionId===id);
 const ret=p58ReturnPrompts.filter(p=>p.eventMetadata?.missionId===id);
 if(kind==="comprehension")return c;
 if(kind==="choice")return a;
 if(kind==="writing")return w;
 if(kind==="reply")return follow;
 if(kind==="repair")return fix;
 if(kind==="return")return ret;
 return [...c,...a,...w,...follow,...fix];
}
