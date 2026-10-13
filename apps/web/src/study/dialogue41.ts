import type {StudyPrompt} from "@thiepn/study-player";
import {normalizeP26} from "./pedagogy26";
import type {P40DialogueArc,P40DialogueTurn} from "./dialogue40";
import {p41CorpusA} from "./dialogue41-corpus-a";
import {p41CorpusB} from "./dialogue41-corpus-b";
import {p41CorpusC} from "./dialogue41-corpus-c";
import {p41CorpusD} from "./dialogue41-corpus-d";

/** Original A1–A2 conversations that can be displayed by the existing P40 dialogue UI. */
export interface P41Turn extends P40DialogueTurn {shift:string;}
export interface P41Arc extends P40DialogueArc {
 level:"A1"|"A2";pivotTurn:number;outcome:string;turns:readonly P41Turn[];
}
export const p41Arcs:readonly P41Arc[]=[
 ...p41CorpusA,...p41CorpusB,...p41CorpusC,...p41CorpusD
];
export function p41ArcsForUnit(unitId:string):P41Arc[]{
 return p41Arcs.filter(a=>a.units.includes(unitId));
}
export function p41ArcById(id:string):P41Arc|undefined{
 return p41Arcs.find(a=>a.id===id);
}
function turnPrompt(arc:P41Arc,turn:P41Turn):StudyPrompt{
 const previous=arc.turns.slice(0,turn.number-1).map(t=>t.intention).join(" → ");
 return {
  id:"p41-turn-"+turn.id,
  primaryTarget:{kind:"can_do",id:"p41:dialogue:"+turn.id},
  skill:turn.number===1?"form_selection":"production",
  cueFamily:"p41-original-dialogue-"+turn.id,
  promptType:turn.number===1?"choice":"typed",
  ...(turn.number===1?{choices:[turn.misstep,turn.model,turn.alternative]}:{}),
  instruction:turn.number===arc.pivotTurn?"Korrigiere den Plan nach der neuen Information":
    "Antworte selbstständig und halte das bisherige Gesprächsziel bei",
  prompt:arc.setting+"\n"+arc.title+" · "+turn.number+"/"+arc.turns.length+
    (previous?"\nBisheriger Gesprächsverlauf: "+previous:"")+
    "\nGesprächspartner: "+turn.partner+
    "\nDeine Antwort: "+turn.intention+
    (turn.number===arc.pivotTurn?"\nMissverständliche Form: "+turn.misstep:""),
  acceptedAnswers:[normalizeP26(turn.model),normalizeP26(turn.alternative)],
  displayAnswer:turn.model,
  explanation:turn.why+" "+turn.shift+
    " Diese begrenzten Zielantworten ersetzen keine Bewertung beliebiger japanischer Formulierungen.",
  answerNormalization:"japanese",contextId:"p41:arc:"+arc.id,
  sourceId:"thiepn-original",contentVersion:"p41-1",
  eventMetadata:{p41:true,kind:turn.number===arc.pivotTurn?"cross-context-reformulation":"dialogue-continuity",
    unitIds:[...arc.units],arcId:arc.id,turnId:turn.id,turnNumber:turn.number,
    focus:turn.focus,turnCount:arc.turns.length,independentCue:true}
 };
}
export const p41DialoguePrompts:StudyPrompt[]=p41Arcs.flatMap(arc=>arc.turns.map(turn=>turnPrompt(arc,turn)));
export const p41ReturnPrompts:StudyPrompt[]=p41Arcs.map(arc=>({
 id:"p41-return-"+arc.id,
 primaryTarget:{kind:"can_do",id:"p41:return:"+arc.id},
 skill:"production",cueFamily:"p41-delayed-transfer-"+arc.id,promptType:"typed",
 instruction:"Übertrage die erlernte Absicht unabhängig in eine andere Situation",
 prompt:"Neue Situation nach "+arc.title+": "+arc.returnCue.intention,
 acceptedAnswers:[normalizeP26(arc.returnCue.model),normalizeP26(arc.returnCue.alternative)],
 displayAnswer:arc.returnCue.model,explanation:arc.returnCue.why,
 answerNormalization:"japanese",contextId:"p41:return:"+arc.id,
 sourceId:"thiepn-original",contentVersion:"p41-1",
 eventMetadata:{p41:true,kind:"cross-context-transfer",unitIds:[...arc.units],
  arcId:arc.id,focus:"delayed-independent-return",independentCue:true}
}));
export const p41Prompts:StudyPrompt[]=[...p41DialoguePrompts,...p41ReturnPrompts];
export function p41PromptsForArc(arcId:string):StudyPrompt[]{
 return p41DialoguePrompts.filter(p=>p.eventMetadata?.arcId===arcId)
   .sort((a,b)=>Number(a.eventMetadata?.turnNumber)-Number(b.eventMetadata?.turnNumber));
}
