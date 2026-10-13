import type {StudyPrompt} from "@thiepn/study-player";
import type {StudyEvent} from "@thiepn/domain";
import type {MemoryTrace} from "@thiepn/scheduler";
import {normalizeP26} from "./pedagogy26";
import {p53ById} from "./vocabulary53";
import {p53FamiliesFor} from "./vocabulary53-families";
import {p60UnitsA} from "./consolidation60-corpus-a";
import {p60UnitsB} from "./consolidation60-corpus-b";
import {p60UnitsC} from "./consolidation60-corpus-c";
import {p60UnitsD} from "./consolidation60-corpus-d";
import type {P60Unit,P60Task,P60Question} from "./consolidation60-types";
export type {P60Unit,P60Line,P60Task,P60Question} from "./consolidation60-types";
export const p60Units:readonly P60Unit[]=[...p60UnitsA,...p60UnitsB,...p60UnitsC,...p60UnitsD];
export const p60ById=(id:string):P60Unit|undefined=>p60Units.find(x=>x.id===id);
export const p60ForUnit=(id:string):P60Unit[]=>p60Units.filter(x=>x.units.includes(id));
export function p60Stage(id:string):{stage:number;label:string}{
 const index=p60Units.findIndex(x=>x.id===id);
 return index<0?{stage:0,label:""}:index<5?{stage:1,label:"Verstehen und belegen"}:
  index<10?{stage:2,label:"Zusammenführen und antworten"}:
  index<15?{stage:3,label:"Unabhängig korrigieren"}:
  {stage:4,label:"Selbstständig kommunizieren"};
}
export function p60RelatedVocabulary(m:P60Unit){
 const source=[...m.text,...m.messages,...m.spoken].map(x=>x.japanese);
 return m.vocabulary.flatMap(id=>{
  const lex=p53ById(id);
  return lex?[{...lex,attested:source.some(s=>s.includes(lex.written)),
   families:p53FamiliesFor(id)}]:[];
 });
}
/** This only recognizes an authored exact example; no semantic evaluation of independent prose. */
export function p60Compare(value:string,models:readonly string[],trap:string,why:string):
 {kind:"model"|"known-error"|"unassessed";message:string}{
 const v=normalizeP26(value);
 if(models.some(s=>normalizeP26(s)===v))
  return {kind:"model",message:"Die gesamte Eingabe entspricht einem vollständig verfassten Originalmodell."};
 if(v===normalizeP26(trap))return {kind:"known-error",message:why};
 return {kind:"unassessed",message:"Weitere gültige freie Formulierungen sind möglich und werden hier nicht semantisch bewertet. Vergleiche selbst Belege, passende Höflichkeit, neueste Einschränkungen und tatsächlichen Sachstand."};
}
function basics(m:P60Unit,k:string):Pick<StudyPrompt,
 "primaryTarget"|"cueFamily"|"answerNormalization"|"contextId"|"sourceId"|"contentVersion"|"eventMetadata">{
 return {primaryTarget:{kind:"can_do",id:"p60:a2-consolidation:"+m.id+":"+k},
  cueFamily:"p60-original-"+m.id+"-"+k,
  answerNormalization:"japanese",contextId:"p60:unit:"+m.id,
  sourceId:"thiepn-original",contentVersion:"p60-1",
  eventMetadata:{p60:true,sourceUnit:m.id,unitIds:[...m.units],
   kind:"cumulative-a2-review",level:"A2",publisherRights:"thiepn-original",
   transcriptIsTextSupported:true,recordedAudio:false,measuredListening:false,
   semanticWritingGrade:false,rawPrivateWritingStored:false,
   historicalRecordsAreSeparate:true,independentCue:true}
 };
}
const sources=(m:P60Unit)=>"Originale verknüpfte Schrifttexte:\n"+
 m.text.map(s=>s.speaker+"： "+s.japanese).join("\n")+
 "\nNachrichten:\n"+m.messages.map(s=>s.speaker+"： "+s.japanese).join("\n")+
 "\nGesprächstranskript (optional Geräte-TTS; keine Aufnahme):\n"+
 m.spoken.map(s=>s.speaker+"： "+s.japanese).join("\n");
function qPrompt(m:P60Unit,q:P60Question,i:number):StudyPrompt{
 const base=basics(m,"question-"+(i+1));
 return {...base,id:"p60-question-"+q.id,skill:"production",promptType:"typed",
  instruction:"Originale schriftliche und gesprochene Textquellen vergleichen. Ein lesbares Transkript misst keine reale Hörleistung.",
  prompt:sources(m)+"\nFrage: "+q.situation,
  acceptedAnswers:[normalizeP26(q.model),normalizeP26(q.alternative)],
  displayAnswer:q.model,explanation:q.why+" Quellenbelege: 「"+q.documentEvidence+
   "」 und 「"+q.spokenEvidence+
   "」. Weitere natürliche Japanischantworten können außerhalb der endlichen Varianten liegen.",
  eventMetadata:{...base.eventMetadata,kind:"a2-cumulative-evidence",questionId:q.id,questionKind:q.kind}
 };
}
export const p60ComprehensionPrompts:StudyPrompt[]=p60Units.flatMap(m=>m.questions.map((q,i)=>qPrompt(m,q,i)));
export const p60StrategyPrompts:StudyPrompt[]=p60Units.map(m=>{
 const b=basics(m,"strategy"),t=m.strategy;
 return {...b,id:"p60-strategy-"+m.id,skill:"form_selection",promptType:"choice",
  instruction:"Zwei vernünftige eigenständige Strategien; eine quellenwidrige plausible Annahme.",
  prompt:sources(m)+"\nAuftrag: "+t.situation,
  choices:[t.model,t.trap,t.alternative],acceptedAnswers:[normalizeP26(t.model),normalizeP26(t.alternative)],
  displayAnswer:t.model,explanation:t.why+" Typischer Quellenfehler: "+t.trap,
  eventMetadata:{...b.eventMetadata,kind:"a2-cumulative-pragmatics"}
 };
});
function taskPrompt(m:P60Unit,t:P60Task,k:"writing"|"return"):StudyPrompt{
 const b=basics(m,k),isReturn=k==="return";
 return {...b,id:"p60-"+k+"-"+m.id,skill:"production",promptType:"typed",
  instruction:isReturn?"Ein vollständig anderer noch ungesehener A2-Kontext ohne altes Antwortmodell.":
   "Eigene mehrsätzige Japanischnachricht: native Mustererkennung ist keine vollständige Freitextnote.",
  prompt:(isReturn?"Neue eigenständige Lebenssituation: ":sources(m)+"\nEigene Aufgabe: ")+t.situation,
  acceptedAnswers:[normalizeP26(t.model),normalizeP26(t.alternative)],displayAnswer:t.model,
  explanation:t.why+" Bekannter Fehlschluss: "+t.trap+
   " Andere selbstständig richtige Texte können vom Originalmustervergleich abweichen.",
  eventMetadata:{...b.eventMetadata,kind:isReturn?"a2-unseen-distant-transfer":"a2-cumulative-independent-writing",
   focus:isReturn?"delayed-independent-return":"writing"}
 };
}
export const p60WritingPrompts:StudyPrompt[]=p60Units.map(m=>taskPrompt(m,m.writing,"writing"));
export const p60ReturnPrompts:StudyPrompt[]=p60Units.map(m=>taskPrompt(m,m.unseen,"return"));
export const p60FollowupPrompts:StudyPrompt[]=p60Units.map(m=>{
 const b=basics(m,"followup"),q=m.reply;
 return {...b,id:"p60-followup-"+m.id,skill:"production",promptType:"typed",
  instruction:"Ändere deine eigenständige japanische Reaktion nach neuem, tatsächlich autorisiertem Gesprächsbeitrag.",
  prompt:sources(m)+"\nNeue Nachricht: "+q.speaker+"： "+q.japanese+
   "\nNeue Aufgabe: "+q.goal,acceptedAnswers:[normalizeP26(q.model),normalizeP26(q.alternative)],
  displayAnswer:q.model,explanation:q.why+" Falsche Fortsetzung: "+q.trap,
  eventMetadata:{...b.eventMetadata,kind:"a2-updated-response"}
 };
});
export const p60RevisionPrompts:StudyPrompt[]=p60Units.map(m=>{
 const b=basics(m,"revision"),q=m.revision;
 return {...b,id:"p60-revision-"+m.id,skill:"production",promptType:"typed",
  instruction:"Quellenwidrige mehrteilige praktische Nachricht eigenständig mit neuestem Beleg korrigieren.",
  prompt:sources(m)+"\nFalscher originaler Beispieltext: "+q.flawed,
  acceptedAnswers:[normalizeP26(q.model),normalizeP26(q.alternative)],
  displayAnswer:q.model,explanation:q.why+" Freie sinngleiche Ausdrücke sind nicht automatisch bewertbar.",
  eventMetadata:{...b.eventMetadata,kind:"a2-cumulative-misconception-repair"}
 };
});
export const p60Prompts:StudyPrompt[]=[
 ...p60ComprehensionPrompts,...p60StrategyPrompts,...p60WritingPrompts,
 ...p60FollowupPrompts,...p60RevisionPrompts,...p60ReturnPrompts
];
export type P60PracticeKind="comprehension"|"strategy"|"writing"|"followup"|"revision"|"return"|"all";
export function p60PromptsForUnit(id:string,kind:P60PracticeKind="all"):StudyPrompt[]{
 if(!p60ById(id))return [];
 const matching=(a:readonly StudyPrompt[])=>a.filter(p=>p.eventMetadata?.sourceUnit===id);
 const c=matching(p60ComprehensionPrompts),s=matching(p60StrategyPrompts),
  w=matching(p60WritingPrompts),f=matching(p60FollowupPrompts),
  r=matching(p60RevisionPrompts),ret=matching(p60ReturnPrompts);
 if(kind==="comprehension")return c;
 if(kind==="strategy")return s;
 if(kind==="writing")return w;
 if(kind==="followup")return f;
 if(kind==="revision")return r;
 if(kind==="return")return ret;
 return [...c,...s,...w,...f,...r];
}
export type P60ReviewStatus="due"|"needs-repair"|"unseen"|"previously-practiced";
export interface P60HistoricalReviewSource{
 id:string;phase:number;unitId:string;title:string;instruction:string;
 status:P60ReviewStatus;lastEventAt?:string;scheduledAt?:string;
}
/** Discovery of existing P40–P59 *original* prompt identities from the catalog.
 * This view neither writes grades nor infers proficiency. Retained return
 * prompts are hidden: only existing direct return gates can open those.
 */
export function p60HistoricalSources(
 unitId:string,prompts:readonly StudyPrompt[],events:readonly StudyEvent[],
 traces:readonly MemoryTrace[],traceId:(p:StudyPrompt)=>string,now=Date.now()
):P60HistoricalReviewSource[]{
 const map=new Map(traces.map(t=>[t.id,t]));
 const last=new Map<string,StudyEvent>();
 for(const e of events){
  const id=e.metadata?.promptId;
  if(typeof id!=="string"||(e.result!=="correct"&&e.result!=="incorrect")||
   e.metadata?.schedulerExcluded===true)continue;
  const prev=last.get(id);
  if(!prev||prev.occurredAt<e.occurredAt)last.set(id,e);
 }
 const result:P60HistoricalReviewSource[]=[];
 const seen=new Set<string>();
 for(const p of prompts){
  const match=/^p(4\d|5\d)-/.exec(p.id);
  if(!match||p.id.includes("-return-")||seen.has(p.id))continue;
  const phase=Number(match[1]);
  const meta=p.eventMetadata;
  const resolvedUnit=typeof meta?.unitId==="string"?meta.unitId:
   Array.isArray(meta?.unitIds)?meta.unitIds.find((u):u is string=>typeof u==="string"):
   typeof meta?.sourceUnit==="string"?meta.sourceUnit:"";
  const owned=Boolean(resolvedUnit)&&(unitId==="*"||resolvedUnit===unitId||
   (Array.isArray(meta?.unitIds)&&meta.unitIds.includes(unitId)));
  if(!owned)continue;
  seen.add(p.id);
  const trace=map.get(traceId(p));
  const time=trace?Date.parse(trace.card.due):NaN;
  const latest=last.get(p.id);
  const status:P60ReviewStatus=trace&&Number.isFinite(time)&&time<=now?"due":
   latest?.result==="incorrect"?"needs-repair":
   !trace&&!latest?"unseen":"previously-practiced";
  result.push({id:p.id,phase,unitId:resolvedUnit,
   title:"P"+phase+" · "+(p.instruction||"Originale Lernübung").slice(0,112),
   instruction:p.instruction||"Originale Quellenpraxis",status,
   lastEventAt:latest?.occurredAt,
   scheduledAt:Number.isFinite(time)?trace?.card.due:undefined});
 }
 return result.sort((a,b)=>{
  const rank=(s:P60ReviewStatus)=>s==="due"?0:s==="needs-repair"?1:s==="unseen"?2:3;
  return rank(a.status)-rank(b.status)||b.phase-a.phase||a.id.localeCompare(b.id);
 });
}

/** A single read-only map over established original learning phases;
 * milestones are navigation categories, never mastery or official level results.
 */
export const p60CourseTracks=[
 {id:"interaction",title:"Höflich sprechen, nachfragen und reparieren",
  phases:[40,41,42,43,44,45,56],
  aim:"Rollen, Register, Missverständnisse und geänderte Absichten eigenständig behandeln",
  next:"Erst einen unbelegten Plan klären, dann mit natürlichem Japanisch reagieren"},
 {id:"reading",title:"Verbunden lesen und Quellen vergleichen",
  phases:[46,48,49,54],
  aim:"Längere Informationen, Belege, Gründe, Quellenstatus und Chronologie finden",
  next:"Die neueste Quelle zitieren, ohne andere Texte zum selben Ereignis umzudeuten"},
 {id:"listening",title:"Gesprochene Informationen und Sprecher verfolgen",
  phases:[47,55],
  aim:"Sprecherrollen, Sprechtempo, Absicht und korrigierte Angaben bewusst erschließen",
  next:"Gespräch erst ohne Transkript hören; dann die tatsächlichen Aussagen textgestützt prüfen"},
 {id:"language",title:"Formen, Bedeutungen und Wortfamilien übertragen",
  phases:[51,52,53],
  aim:"Originale A2-Grammatik, Satztransformation und kontextuelles Vokabular verbinden",
  next:"Eine sprachliche Form in einem neuen tatsächlichen Alltagskontext verwenden"},
 {id:"writing",title:"Eigene Nachrichten schreiben und überarbeiten",
  phases:[57],
  aim:"Anfragen, Bestätigungen, längere Antworten und eigene mehrstufige Revision",
  next:"Zuerst eigenständig verfassen, dann belegte Fehler und Register überarbeiten"},
 {id:"integrated",title:"Komplexe praktische Missionen unabhängig lösen",
  phases:[50,58,59],
  aim:"Lesen, Sprecherangaben, Entscheidung, höfliche Antwort und neue Transferfrage kombinieren",
  next:"Im P60-Abschlussfall keine unbekannte Genehmigung oder Bestätigung erfinden"}
] as const;
