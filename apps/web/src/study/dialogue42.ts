import type {StudyPrompt} from "@thiepn/study-player";
import {normalizeP26} from "./pedagogy26";
import type {P41Arc,P41Turn} from "./dialogue41";
import {p42CorpusA} from "./dialogue42-corpus-a";
import {p42CorpusB} from "./dialogue42-corpus-b";
import {p42CorpusC} from "./dialogue42-corpus-c";

/** Fresh source-owned variations linked to the earlier dialogue for context,
 * never aliases of an earlier cue or of an FSRS trace. */
export interface P42Arc extends P41Arc {
  baseArcId:string; interlocutor:string;relationship:string;
  register:"polite"|"casual";variation:string;contrast:string;
}
export type P42Line=readonly [string,string,string,string,string,string,string];
export type P42Return=readonly [string,string,string,string,string];
export function makeP42Arc(input:{
  id:string; baseArcId:string;level:"A1"|"A2";units:readonly string[];
  title:string;setting:string;interlocutor:string;relationship:string;
  register:"polite"|"casual";variation:string;contrast:string;
  pivotTurn:number;outcome:string;turns:readonly P42Line[];
  returnCue:P42Return;
}):P42Arc{
  const turns:P41Turn[]=input.turns.map(([partner,intention,model,alternative,misstep,why,focus],i)=>({
    id:input.id+"-t"+(i+1),number:i+1,partner,intention,model,alternative,misstep,why,focus,
    shift:(i+1===input.pivotTurn?"Neuer Sachverhalt — ":"Kontextziel — ")+intention
  }));
  const [intention,model,alternative,misstep,why]=input.returnCue;
  return {...input,turns,returnCue:{intention,model,alternative,misstep,why}};
}
export const p42Arcs:readonly P42Arc[]=[...p42CorpusA,...p42CorpusB,...p42CorpusC];
export function p42ArcsForUnit(unitId:string):P42Arc[]{
  return p42Arcs.filter(a=>a.units.includes(unitId));
}
export function p42ArcById(id:string):P42Arc|undefined{
  return p42Arcs.find(a=>a.id===id);
}
function p42TurnPrompt(arc:P42Arc,turn:P41Turn):StudyPrompt{
  const prior=arc.turns.slice(0,turn.number-1).map(t=>t.intention).join(" → ");
  return {
    id:"p42-turn-"+turn.id,
    primaryTarget:{kind:"can_do",id:"p42:dialogue:"+turn.id},
    skill:turn.number===1?"form_selection":"production",
    cueFamily:"p42-speaker-transfer-"+turn.id,
    promptType:turn.number===1?"choice":"typed",
    ...(turn.number===1?{choices:[turn.misstep,turn.model,turn.alternative]}:{}),
    instruction:turn.number===arc.pivotTurn?
      "Korrigiere deine Antwort an den tatsächlichen Sprecher und die geänderte Tatsache":
      "Antworte selbstständig mit passendem Register und halte den Gesprächskontext ein",
    prompt:arc.setting+"\nGegenüber: "+arc.interlocutor+" ("+arc.relationship+")"+
      "\nSprechstil: "+(arc.register==="polite"?"höflich":"vertraut")+
      "\nNeue Bedingung: "+arc.variation+
      "\nSchritt "+turn.number+"/"+arc.turns.length+
      (prior?"\nBisher vereinbart: "+prior:"")+
      "\nAussage des Gegenübers: "+turn.partner+
      "\nDein Ziel: "+turn.intention+
      (turn.number===arc.pivotTurn?"\nProblematische Antwort: "+turn.misstep:""),
    acceptedAnswers:[normalizeP26(turn.model),normalizeP26(turn.alternative)],
    displayAnswer:turn.model,explanation:turn.why+" "+arc.contrast,
    answerNormalization:"japanese",contextId:"p42:arc:"+arc.id,
    sourceId:"thiepn-original",contentVersion:"p42-1",
    eventMetadata:{p42:true,kind:turn.number===arc.pivotTurn?
       "cross-context-reformulation":"dialogue-continuity",
      unitIds:[...arc.units],arcId:arc.id,baseArcId:arc.baseArcId,
      turnId:turn.id,turnNumber:turn.number,focus:turn.focus,
      relationship:arc.relationship,register:arc.register,independentCue:true}
  };
}
export const p42DialoguePrompts:StudyPrompt[]=p42Arcs.flatMap(arc=>
  arc.turns.map(t=>p42TurnPrompt(arc,t))
);
export const p42ReturnPrompts:StudyPrompt[]=p42Arcs.map(arc=>({
  id:"p42-return-"+arc.id,
  primaryTarget:{kind:"can_do",id:"p42:return:"+arc.id},
  skill:"production",cueFamily:"p42-unseen-speaker-return-"+arc.id,promptType:"typed",
  instruction:"Antworte in einer neuen Gesprächsrolle ohne eingeblendetes Muster",
  prompt:"Neues Gegenüber nach "+arc.title+": "+arc.returnCue.intention,
  acceptedAnswers:[normalizeP26(arc.returnCue.model),normalizeP26(arc.returnCue.alternative)],
  displayAnswer:arc.returnCue.model,
  explanation:arc.returnCue.why+" Rückkehrtermine bestimmt nur die vorhandene FSRS-Karte nach unabhängiger Bewertung.",
  answerNormalization:"japanese",contextId:"p42:return:"+arc.id,
  sourceId:"thiepn-original",contentVersion:"p42-1",
  eventMetadata:{p42:true,kind:"cross-context-transfer",unitIds:[...arc.units],
    arcId:arc.id,baseArcId:arc.baseArcId,focus:"delayed-independent-return",
    relationship:arc.relationship,register:arc.register,independentCue:true}
}));
export const p42Prompts:StudyPrompt[]=[...p42DialoguePrompts,...p42ReturnPrompts];
export function p42PromptsForArc(arcId:string):StudyPrompt[]{
  return p42DialoguePrompts.filter(p=>p.eventMetadata?.arcId===arcId)
    .sort((a,b)=>Number(a.eventMetadata?.turnNumber)-Number(b.eventMetadata?.turnNumber));
}
