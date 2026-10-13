import type {StudyPrompt} from "@thiepn/study-player";
import {normalizeP26} from "./pedagogy26";
import type {P55Scene,P55Question,P55Response} from "./listening55-types";
import {p53ById} from "./vocabulary53";
import {p53FamiliesFor} from "./vocabulary53-families";
import {p55ScenesA} from "./listening55-corpus-a";
import {p55ScenesB} from "./listening55-corpus-b";
import {p55ScenesC} from "./listening55-corpus-c";
import {p55ScenesD} from "./listening55-corpus-d";
import {p55ScenesE} from "./listening55-corpus-e";

export type {P55Scene,P55Question,P55QuestionKind,P55Genre} from "./listening55-types";
export const p55Scenes:readonly P55Scene[]=[
 ...p55ScenesA,...p55ScenesB,...p55ScenesC,...p55ScenesD,...p55ScenesE
];
export const p55ById=(id:string):P55Scene|undefined=>p55Scenes.find(s=>s.id===id);
export const p55ForUnit=(unitId:string):P55Scene[]=>p55Scenes.filter(s=>s.units.includes(unitId));
export function p55Progression(id:string):{stage:number;focus:string}{
 const i=p55Scenes.findIndex(s=>s.id===id);
 if(i<0)return {stage:0,focus:""};
 if(i<7)return {stage:1,focus:"Sieben Gesprächszüge: Absicht, direkte Fakten und Planänderung"};
 if(i<21)return {stage:2,focus:"Sieben Gesprächszüge: Bedingungen, Quelle und höfliche Reaktion"};
 if(i<28)return {stage:3,focus:"Sieben Gesprächszüge: Register, Ausnahme und mehrperspektivische Folgerung"};
 return {stage:4,focus:"Acht Gesprächszüge: berichtete Informationen, Sprecherwechsel und eigenständige Korrektur"};
}
export function p55RelatedWords(scene:P55Scene){
 return scene.words.flatMap(id=>{
  const w=p53ById(id);
  return w?[{...w,attested:scene.turns.some(t=>t.japanese.includes(w.written)),
    families:p53FamiliesFor(id)}]:[];
 });
}
export function p55AuthoredFeedback(value:string,models:readonly string[],mistake:string,why:string):
 {kind:"original"|"specific-error"|"unassessed";message:string}{
 const n=normalizeP26(value);
 if(models.some(m=>normalizeP26(m)===n))
  return {kind:"original",message:"Eigener vollständiger Satz entspricht einem original verfassten Muster."};
 if(normalizeP26(mistake)===n)
  return {kind:"specific-error",message:why};
 return {kind:"unassessed",message:"Diese freie japanische Antwort ist nicht semantisch bewertet. Prüfe Sprecher, ursprüngliche Aussage und Zeitpunkt. Unbekannt bedeutet nicht falsch."};
}
function shared(s:P55Scene,kind:string):Pick<StudyPrompt,
 "primaryTarget"|"cueFamily"|"answerNormalization"|"contextId"|"sourceId"|"contentVersion"|"eventMetadata">{
 return {primaryTarget:{kind:"can_do",id:"p55:connected-listening:"+s.id+":"+kind},
  cueFamily:"p55-original-listening-"+s.id+"-"+kind,
  answerNormalization:"japanese",contextId:"p55:listening:"+s.id,
  sourceId:"thiepn-original",contentVersion:"p55-1",
  eventMetadata:{p55:true,sceneId:s.id,unitIds:[...s.units],
    level:"A2",genre:s.genre,independentCue:true,sourceRights:"thiepn-original",
    playbackSource:"device-tts-optional",recordedNativeAudio:false,
    measuredListening:false}
 };
}
const readable=(s:P55Scene)=>s.turns.map(t=>t.role+"： "+t.japanese).join("\n");
function question(s:P55Scene,q:P55Question,i:number):StudyPrompt{
 const c=shared(s,"question-"+(i+1));
 return {...c,id:"p55-question-"+q.id,skill:"production",promptType:"typed",
  instruction:"Hörvorbereitung mit Geräte-TTS im Learn-Studio. Diese normale StudyPlayer-Karte enthält das Skript und ist eine textgestützte Nachhörübung, keine gemessene Audioprüfung.",
  prompt:"Situation: "+s.setting+"\nSkript zum Nachlesen:\n"+readable(s)+
    "\n\nFrage "+(i+1)+": "+q.question,
  acceptedAnswers:[normalizeP26(q.model),normalizeP26(q.alternative)],
  displayAnswer:q.model,
  explanation:q.why+" Originalbeleg: 「"+q.evidence+"」. "+
   "Weitere sinnvolle freie Paraphrasen können vom endlichen Antwortabgleich abweichen.",
  eventMetadata:{...c.eventMetadata,kind:"listening-text-supported-comprehension",
    questionId:q.id,questionKind:q.kind,evidenceBound:true}
 };
}
export const p55ComprehensionPrompts:StudyPrompt[]=p55Scenes.flatMap(s=>
 s.questions.map((q,i)=>question(s,q,i)));
export const p55VocabularyPrompts:StudyPrompt[]=p55Scenes.flatMap(s=>
 p55RelatedWords(s).filter(w=>w.attested).map(w=>{
  const c=shared(s,"word-"+w.id);
  const line=s.turns.find(t=>t.japanese.includes(w.written))!;
  return {...c,id:"p55-word-"+s.id+"-"+w.id,skill:"production",promptType:"typed",
   instruction:"Originalen P53-Wortgebrauch aus der P55-Sprechsituation abrufen; skriptgestützte Übung ohne gemessene Hörleistung.",
   prompt:"Situation: "+s.setting+"\nWortbedeutung: "+w.meaning+
    "\nGesprochener Satz zum Nachlesen: "+line.japanese.replace(w.written,"＿＿")+
    "\nWelches japanische Wort fehlt?",
   acceptedAnswers:[normalizeP26(w.written)],displayAnswer:w.written,
   explanation:"Lesung: "+w.reading+"; typische Verbindungen: "+w.collocations.join(" / ")+
    ". "+w.nuance+" Gesprochener Originalbeleg: 「"+line.japanese+"」.",
   eventMetadata:{...c.eventMetadata,kind:"spoken-context-lexicon",vocabularyId:w.id,
     attested:true,spokenRole:line.role}
  } as StudyPrompt;
 }));
function output(s:P55Scene,t:P55Response,k:"response"|"return"):StudyPrompt{
 const c=shared(s,k),later=k==="return";
 return {...c,id:"p55-"+k+"-"+s.id,skill:"production",promptType:"typed",
  instruction:later?"Späterer neuer Alltagssachverhalt: eigenständig japanisch reagieren, ohne bekanntes Skript oder Muster.":
   "Eigene Reaktion auf eine neue Gesprächslage. Das Originalskript wird nicht als bereits erbrachte Hörprüfung bewertet.",
  prompt:(later?"Neuer ungesehener Kontext: ":"Nach dem ursprünglichen Hördialog: ")+t.situation,
  acceptedAnswers:[normalizeP26(t.model),normalizeP26(t.alternative)],
  displayAnswer:t.model,
  explanation:t.why+" Mögliche Fehlannahme: "+t.misconception+
   " Die originalen Antwortbeispiele sind keine umfassende Bewertung freier Sprache.",
  eventMetadata:{...c.eventMetadata,kind:later?"cross-context-spoken-return":"connected-listening-response",
   focus:later?"delayed-independent-return":"spoken-or-typed-independent-response"}
 };
}
export const p55ResponsePrompts:StudyPrompt[]=p55Scenes.map(s=>output(s,s.response,"response"));
export const p55ReturnPrompts:StudyPrompt[]=p55Scenes.map(s=>output(s,s.delayed,"return"));
export const p55Prompts:StudyPrompt[]=[
 ...p55ComprehensionPrompts,...p55VocabularyPrompts,...p55ResponsePrompts,...p55ReturnPrompts
];
export type P55PracticeKind="comprehension"|"vocabulary"|"response"|"return"|"all";
export function p55PromptsForScene(id:string,kind:P55PracticeKind="all"):StudyPrompt[]{
 if(!p55ById(id))return [];
 const q=p55ComprehensionPrompts.filter(p=>p.eventMetadata?.sceneId===id);
 const v=p55VocabularyPrompts.filter(p=>p.eventMetadata?.sceneId===id);
 const w=p55ResponsePrompts.filter(p=>p.eventMetadata?.sceneId===id);
 const x=p55ReturnPrompts.filter(p=>p.eventMetadata?.sceneId===id);
 if(kind==="comprehension")return q;
 if(kind==="vocabulary")return v;
 if(kind==="response")return w;
 if(kind==="return")return x;
 return [...q,...v,...w];
}
