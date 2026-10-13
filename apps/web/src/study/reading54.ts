import type {StudyPrompt} from "@thiepn/study-player";
import {normalizeP26} from "./pedagogy26";
import type {P54Reading,P54Question,P54Transfer} from "./reading54-types";
import {p53ById} from "./vocabulary53";
import {p53FamiliesFor} from "./vocabulary53-families";
import {p54ReadingsA} from "./reading54-corpus-a";
import {p54ReadingsB} from "./reading54-corpus-b";
import {p54ReadingsC} from "./reading54-corpus-c";
import {p54ReadingsD} from "./reading54-corpus-d";
import {p54ReadingsE} from "./reading54-corpus-e";

export type {P54Reading,P54Question,P54QuestionKind,P54Genre} from "./reading54-types";
export const p54Readings:readonly P54Reading[]=[
 ...p54ReadingsA,...p54ReadingsB,...p54ReadingsC,...p54ReadingsD,...p54ReadingsE
];
export function p54Progression(id:string):{stage:number;label:string;focus:string}{
 const index=p54Readings.findIndex(r=>r.id===id);
 if(index<0)return {stage:0,label:"Nicht gefunden",focus:""};
 if(index<7)return {stage:1,label:"Alltagsinformationen verbinden",
  focus:"Drei zusammenhängende Absätze mit Ursache, Zeitpunkt und einfachem Ergebnis"};
 if(index<21)return {stage:2,label:"Mehrere Aussagen unterscheiden",
  focus:"Verschiedene Sprecher, geänderte Planung und nicht bestätigte Informationen"};
 if(index<28)return {stage:3,label:"Vergleichen und begründen",
  focus:"Daten vergleichen, Bedingungen und Ergebnisse über mehrere Textabschnitte verfolgen"};
 return {stage:4,label:"Mehrabsätzige Quellenintegration",
  focus:"Vier längere Absätze, konkurrierende Quellen, Grenzen der Aussage und unabhängige Folgerung"};
}
export const p54ById=(id:string):P54Reading|undefined=>p54Readings.find(r=>r.id===id);
export const p54ForUnit=(id:string):P54Reading[]=>p54Readings.filter(r=>r.units.includes(id));

/** Read-only re-use of P53-authored language; unknown references are omitted, never fabricated. */
export function p54RelatedWords(r:P54Reading){
 return r.words.flatMap(id=>{
  const word=p53ById(id);
  return word?[{...word,attested:r.paragraphs.some(p=>p.japanese.includes(word.written)),
    families:p53FamiliesFor(word.id)}]:[];
 });
}
export function p54AuthoredComparison(value:string,models:readonly string[],
 misconception:string,explanation:string):{kind:"original"|"specific-error"|"unassessed";message:string}{
 const cleaned=normalizeP26(value);
 if(models.some(a=>normalizeP26(a)===cleaned))
  return {kind:"original",message:"Antwort stimmt vollständig mit einer eigens verfassten japanischen Modellform überein."};
 if(normalizeP26(misconception)===cleaned)
  return {kind:"specific-error",message:explanation};
 return {kind:"unassessed",message:"Andere sinnvolle japanische Antworten wurden hier nicht semantisch bewertet. Prüfe Aussage, zeitliche Reihenfolge und Textbeleg."};
}
function shared(r:P54Reading,kind:string):Pick<StudyPrompt,
 "primaryTarget"|"cueFamily"|"answerNormalization"|"contextId"|"sourceId"|"contentVersion"|"eventMetadata">{
 return {primaryTarget:{kind:"can_do",id:"p54:connected-reading:"+r.id+":"+kind},
  cueFamily:"p54-original-"+r.id+"-"+kind,answerNormalization:"japanese",
  contextId:"p54:reading:"+r.id,sourceId:"thiepn-original",contentVersion:"p54-1",
  eventMetadata:{p54:true,readingId:r.id,unitIds:[...r.units],
   level:"A2",genre:r.genre,independentCue:true,sourceRights:"thiepn-original"}
 };
}
const passage=(r:P54Reading)=>r.title+"\n\n"+r.paragraphs.map(p=>p.japanese).join("\n\n");
function questionPrompt(r:P54Reading,q:P54Question,index:number):StudyPrompt{
 const c=shared(r,"question-"+(index+1));
 return {...c,id:"p54-question-"+q.id,skill:"production",promptType:"typed",
  instruction:q.kind==="chronology"?"Zuerst Ablauf im Text rekonstruieren, dann auf Japanisch antworten":
   q.kind==="cause"?"Grund aus dem gelesenen Text belegen, nicht frei erfinden":
   q.kind==="inference"?"Belegbare Schlussfolgerung aus mehreren Textstellen formulieren":
   q.kind==="speaker"?"Sprecherrollen und zugeschriebene Aussagen im Text beachten":
   "Eine nachprüfbare Angabe aus dem japanischen Text wiedergeben",
  prompt:passage(r)+"\n\nFrage "+(index+1)+": "+q.question,
  acceptedAnswers:[normalizeP26(q.model),normalizeP26(q.alternative)],
  displayAnswer:q.model,
  explanation:q.explanation+" Originaler Textbeleg: 「"+q.evidence+"」. "+
   "Die beiden Originalmuster sind keine erschöpfende semantische Bewertung.",
  eventMetadata:{...c.eventMetadata,kind:"connected-reading-comprehension",
   questionId:q.id,questionKind:q.kind,evidenceBound:true}
 };
}
export const p54ComprehensionPrompts:StudyPrompt[]=p54Readings.flatMap(r=>
 r.questions.map((q,i)=>questionPrompt(r,q,i)));

export const p54VocabularyPrompts:StudyPrompt[]=p54Readings.flatMap(r=>
 p54RelatedWords(r).filter(w=>w.attested).map((w,index)=>{
  const c=shared(r,"lexicon-"+w.id);
  const snippet=r.paragraphs.find(p=>p.japanese.includes(w.written))!.japanese;
  return {...c,id:"p54-vocabulary-"+r.id+"-"+w.id,skill:"production",
   promptType:"typed",
   instruction:"Originalen P53-Wortschatz aus einer P54-Gesamtpassage abrufen. Der Wortgebrauch ist im Text belegt.",
   prompt:"Lesetext: "+r.title+"\nDeutscher Begriff: "+w.meaning+
    "\nOriginaler Textausschnitt: "+snippet.replace(w.written,"＿＿")+
    "\nWelcher japanische Ausdruck gehört in die Lücke?",
   acceptedAnswers:[normalizeP26(w.written)],displayAnswer:w.written,
   explanation:"Lesung: "+w.reading+". Natürliche Wortverbindungen: "+
    w.collocations.join(" / ")+". "+w.nuance+" "+
    w.families.map(f=>f.explanation).slice(0,1).join(" ")+
    " Originalbeleg: 「"+snippet+"」.",
   eventMetadata:{...c.eventMetadata,kind:"linked-lexicon",
    vocabularyId:w.id,attested:true,wordIndex:index+1}
  } as StudyPrompt;
 }));
function transfer(r:P54Reading,t:P54Transfer,kind:"write"|"return"):StudyPrompt{
 const delayed=kind==="return",c=shared(r,kind);
 return {...c,id:"p54-"+kind+"-"+r.id,skill:"production",promptType:"typed",
  instruction:delayed?"Neuer, unabhängiger Sachverhalt. Der alte Passageinhalt wird nicht vorgegeben; ohne Textvorlage korrekt übertragen.":
   "Eigenständig schreiben: Den Ursprungstext verstehen und einen eigenen japanischen Satz für eine andere Situation formulieren.",
  prompt:(delayed?"Unbekannte spätere Situation: ":passage(r)+"\n\nNeue Schreibaufgabe: ")+t.situation,
  acceptedAnswers:[normalizeP26(t.model),normalizeP26(t.alternative)],
  displayAnswer:t.model,
  explanation:t.why+" Fehlannahme: "+t.misconception+
   " Das originale Antwortpaar begrenzt den automatischen Abgleich.",
  eventMetadata:{...c.eventMetadata,
   kind:delayed?"cross-context-reading-return":"connected-reading-writing",
   focus:delayed?"delayed-independent-return":"reading-independent-writing"}
 };
}
export const p54WritingPrompts:StudyPrompt[]=p54Readings.map(r=>transfer(r,r.writing,"write"));
export const p54ReturnPrompts:StudyPrompt[]=p54Readings.map(r=>transfer(r,r.returnCue,"return"));
export const p54Prompts:StudyPrompt[]=[
 ...p54ComprehensionPrompts,...p54VocabularyPrompts,...p54WritingPrompts,...p54ReturnPrompts
];
export type P54PracticeKind="comprehension"|"vocabulary"|"writing"|"return"|"all";
export function p54PromptsForReading(id:string,kind:P54PracticeKind="all"):StudyPrompt[]{
 if(!p54ById(id))return [];
 const c=p54ComprehensionPrompts.filter(p=>p.eventMetadata?.readingId===id);
 const v=p54VocabularyPrompts.filter(p=>p.eventMetadata?.readingId===id);
 const w=p54WritingPrompts.filter(p=>p.eventMetadata?.readingId===id);
 const t=p54ReturnPrompts.filter(p=>p.eventMetadata?.readingId===id);
 if(kind==="comprehension")return c;
 if(kind==="vocabulary")return v;
 if(kind==="writing")return w;
 if(kind==="return")return t;
 return [...c,...v,...w];
}
