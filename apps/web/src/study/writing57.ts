import type {StudyPrompt} from "@thiepn/study-player";
import {normalizeP26} from "./pedagogy26";
import type {P57Thread,P57Question,P57Task,P57Reply,P57Revision} from "./writing57-types";
import {p53ById} from "./vocabulary53";
import {p53FamiliesFor} from "./vocabulary53-families";
import {p57ThreadsA} from "./writing57-corpus-a";
import {p57ThreadsB} from "./writing57-corpus-b";
import {p57ThreadsC} from "./writing57-corpus-c";
import {p57ThreadsD} from "./writing57-corpus-d";
import {p57ThreadsE} from "./writing57-corpus-e";
export type {P57Thread,P57Genre,P57QuestionKind,P57Task,P57Reply,P57Revision} from "./writing57-types";
export const p57Threads:readonly P57Thread[]=[
 ...p57ThreadsA,...p57ThreadsB,...p57ThreadsC,...p57ThreadsD,...p57ThreadsE
];
export const p57ById=(id:string):P57Thread|undefined=>p57Threads.find(t=>t.id===id);
export const p57ForUnit=(unit:string):P57Thread[]=>p57Threads.filter(t=>t.units.includes(unit));
export function p57Progression(id:string):{stage:number;focus:string}{
 const n=p57Threads.findIndex(t=>t.id===id);
 if(n<0)return {stage:0,focus:""};
 if(n<7)return {stage:1,focus:"Vier konkrete Nachrichten: Höflichkeit, Datum und bestätigten Stand erkennen"};
 if(n<21)return {stage:2,focus:"Mehrere Nachrichten: Anlass, notwendige Handlung und neue Antwort verbinden"};
 if(n<28)return {stage:3,focus:"Mehrere Einschränkungen und sich ändernde Quellen in eigener Nachricht erhalten"};
 return {stage:4,focus:"Fünf verbundene Nachrichten, Quellenkorrektur und mehrteilige schriftliche Revision"};
}
export function p57RelatedWords(t:P57Thread){
 return t.words.flatMap(id=>{
  const word=p53ById(id);
  return word?[{...word,attested:t.messages.some(m=>m.japanese.includes(word.written)),
    families:p53FamiliesFor(word.id)}]:[];
 });
}
export function p57AuthoredComparison(value:string,models:readonly string[],
 misleading:string,explanation:string):{kind:"example"|"specific-error"|"unassessed";message:string}{
 const answer=normalizeP26(value);
 if(models.some(v=>normalizeP26(v)===answer))
  return {kind:"example",message:"Der vollständige japanische Satz stimmt mit einem eigens verfassten Beispiel überein."};
 if(normalizeP26(misleading)===answer)
  return {kind:"specific-error",message:explanation};
 return {kind:"unassessed",message:"Diese andere freie Formulierung ist nicht semantisch bewertet. Prüfe Inhalt, Register, Ursache, Frist und belegten Bestätigungsstatus. Eine unbekannte Form ist nicht automatisch falsch."};
}
function base(t:P57Thread,part:string):Pick<StudyPrompt,
 "primaryTarget"|"cueFamily"|"answerNormalization"|"contextId"|"sourceId"|"contentVersion"|"eventMetadata">{
 return {primaryTarget:{kind:"can_do",id:"p57:writing:"+t.id+":"+part},
  cueFamily:"p57-original-"+t.id+"-"+part,
  answerNormalization:"japanese",contextId:"p57:writing:"+t.id,
  sourceId:"thiepn-original",contentVersion:"p57-1",
  eventMetadata:{p57:true,threadId:t.id,unitIds:[...t.units],
   level:"A2",genre:t.genre,register:t.register,
   independentCue:true,sourceRights:"thiepn-original",
   freeWritingSemanticallyGraded:false,rawPrivateDraftPersisted:false}
 };
}
const threadText=(t:P57Thread)=>t.messages.map(m=>m.sender+"： "+m.japanese).join("\n\n");
function question(t:P57Thread,q:P57Question,i:number):StudyPrompt{
 const shared=base(t,"question-"+(i+1));
 return {...shared,id:"p57-question-"+q.id,skill:"production",promptType:"typed",
  instruction:"Mehrere Originalnachrichten lesen, den belegten Stand herausarbeiten und auf Japanisch präzise antworten.",
  prompt:"Situation: "+t.setting+"\n\n"+threadText(t)+"\n\nFrage: "+q.question,
  acceptedAnswers:[normalizeP26(q.model),normalizeP26(q.alternate)],
  displayAnswer:q.model,
  explanation:q.why+" Originalbeleg: 「"+q.evidence+"」. "+
   "Die zwei verfassten Modelle prüfen kein beliebig gutes freies Japanisch.",
  eventMetadata:{...shared.eventMetadata,kind:"connected-writing-source-question",questionId:q.id,
   questionKind:q.kind,evidenceBound:true}
 };
}
export const p57ComprehensionPrompts:StudyPrompt[]=p57Threads.flatMap(t=>
 t.questions.map((q,i)=>question(t,q,i)));
function writePrompt(t:P57Thread,kind:"compose"|"reply"|"revision"|"return"):StudyPrompt{
 const shared=base(t,kind),r=t.revision,reply=t.reply;
 const task: P57Task|undefined=kind==="compose"?t.compose:kind==="return"?t.returnCue:undefined;
 const prompt=task?.situation??(kind==="reply"?
  "Neue Nachricht: "+reply.newMessage+"\nAuftrag: "+reply.goal:
  "Problematischer Entwurf: "+r.flawedDraft+"\nRevision: "+r.instruction);
 const model=task?.model??(kind==="reply"?reply.model:r.model);
 const alternate=task?.alternate??(kind==="reply"?reply.alternate:r.alternate);
 const misleading=task?.misleading??(kind==="reply"?reply.misleading:r.flawedDraft);
 const why=task?.why??(kind==="reply"?reply.why:r.why);
 return {...shared,id:"p57-"+kind+"-"+t.id,skill:"production",promptType:"typed",
  instruction:kind==="return"?"Späterer völlig neuer Kontext, ohne frühere Nachrichten oder Modelle.":
   kind==="revision"?"Unzutreffenden Erstentwurf schriftlich reparieren; Status und Register beachten.":
   kind==="reply"?"Unerwartete neue Nachricht beantworten; gesamte bisherige Gesprächslage beachten.":
   "Eigenständig eine praktische japanische Nachricht verfassen, ohne fertige Vorlage.",
  prompt:(kind==="return"?"Unbekannte neue Schreibsituation: ":
    kind==="compose"?"Bisheriger Schriftwechsel:\n"+threadText(t)+"\n\nNeue Aufgabe: ":"")+prompt,
  acceptedAnswers:[normalizeP26(model),normalizeP26(alternate)],
  displayAnswer:model,
  explanation:why+" Häufiges Missverständnis: "+misleading+
   " Andere korrekte freie Texte liegen möglicherweise außerhalb der endlichen Antwortmodelle.",
  eventMetadata:{...shared.eventMetadata,
   kind:kind==="return"?"cross-context-written-return":
    kind==="compose"?"functional-original-writing":
    kind==="reply"?"multi-message-written-followup":"message-error-revision",
   focus:kind==="return"?"delayed-independent-return":kind}
 };
}
export const p57ComposePrompts:StudyPrompt[]=p57Threads.map(t=>writePrompt(t,"compose"));
export const p57ReplyPrompts:StudyPrompt[]=p57Threads.map(t=>writePrompt(t,"reply"));
export const p57RevisionPrompts:StudyPrompt[]=p57Threads.map(t=>writePrompt(t,"revision"));
export const p57ReturnPrompts:StudyPrompt[]=p57Threads.map(t=>writePrompt(t,"return"));
export const p57Prompts:StudyPrompt[]=[
 ...p57ComprehensionPrompts,...p57ComposePrompts,...p57ReplyPrompts,...p57RevisionPrompts,...p57ReturnPrompts
];
export type P57PracticeKind="comprehension"|"compose"|"reply"|"revision"|"return"|"all";
export function p57PromptsForThread(id:string,kind:P57PracticeKind="all"):StudyPrompt[]{
 if(!p57ById(id))return [];
 const c=p57ComprehensionPrompts.filter(p=>p.eventMetadata?.threadId===id);
 const w=p57ComposePrompts.filter(p=>p.eventMetadata?.threadId===id);
 const follow=p57ReplyPrompts.filter(p=>p.eventMetadata?.threadId===id);
 const rev=p57RevisionPrompts.filter(p=>p.eventMetadata?.threadId===id);
 const ret=p57ReturnPrompts.filter(p=>p.eventMetadata?.threadId===id);
 if(kind==="comprehension")return c;
 if(kind==="compose")return w;
 if(kind==="reply")return follow;
 if(kind==="revision")return rev;
 if(kind==="return")return ret;
 return [...c,...w,...follow,...rev];
}
