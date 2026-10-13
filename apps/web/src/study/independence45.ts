import type {StudyPrompt} from "@thiepn/study-player";
import {normalizeP26} from "./pedagogy26";
import {p45CorpusA} from "./independence45-corpus-a";
import {p45CorpusB} from "./independence45-corpus-b";
import {p45CorpusC} from "./independence45-corpus-c";
import {p45CorpusD} from "./independence45-corpus-d";
import {p45CorpusE} from "./independence45-corpus-e";

export interface P45Turn{
 id:string;partner:string;goal:string;model:string;alternative:string;
 misconception:string;why:string;continuity:string;
}
export interface P45Challenge{
 id:string;title:string;level:"A1"|"A2";units:readonly string[];
 parentCase:string;relationship:string;setting:string;purpose:string;
 unexpected:string;outcome:string;turns:readonly P45Turn[];
 returnCue:{situation:string;model:string;alternative:string;misconception:string;why:string};
}
export const p45Challenges:readonly P45Challenge[]=[
 ...p45CorpusA,...p45CorpusB,...p45CorpusC,...p45CorpusD,...p45CorpusE
];
export function p45ForUnit(id:string):P45Challenge[]{
 return p45Challenges.filter(c=>c.units.includes(id));
}
export function p45ById(id:string):P45Challenge|undefined{
 return p45Challenges.find(c=>c.id===id);
}
export type P45Scaffold="supported"|"reduced"|"unguided";
/** Guided exact-example comparison. Unknown Japanese remains unknown. */
export function p45Feedback(response:string,turn:Pick<P45Turn,"model"|"alternative"|"misconception"|"why">):
 {kind:"known"|"misconception"|"unassessed";message:string}{
 const norm=normalizeP26(response);
 if([turn.model,turn.alternative].some(a=>normalizeP26(a)===norm))
  return {kind:"known",message:"Passt zu einem der ausdrücklich verfassten Beispiele."};
 if(normalizeP26(turn.misconception)===norm)
  return {kind:"misconception",message:turn.why};
 return {kind:"unassessed",message:"Eine andere japanische Antwort wurde nicht semantisch bewertet. Vergleiche die Absicht selbst oder öffne ein Muster; sie gilt nicht automatisch als falsch."};
}
function createTurnPrompt(challenge:P45Challenge,turn:P45Turn,index:number):StudyPrompt{
 const earlier=challenge.turns.slice(0,index).map(t=>t.partner).join(" / ");
 return {
  id:"p45-turn-"+turn.id,
  primaryTarget:{kind:"can_do",id:"p45:independent:"+turn.id},
  skill:"production",promptType:"typed",
  cueFamily:"p45-independent-turn-"+turn.id,
  instruction:index===0?"Antworte ohne Antwortauswahl in angemessenem Japanisch":
    index===1?"Setze das selbst gewählte Ziel in der nächsten Reaktion fort":
    index===2?"Reagiere auf die unerwartete Wendung, ohne den alten Plan falsch zu bestätigen":
    "Führe die Vereinbarung ohne sprachliche Stütze zum Abschluss",
  prompt:challenge.setting+"\nBeziehung: "+challenge.relationship+
    "\nGesprächsziel: "+challenge.purpose+
    (earlier?"\nFrühere Partneräußerungen: "+earlier:"")+
    "\nNeue Partneräußerung: "+turn.partner+
    (index<2?"\nDein kommunikatives Ziel: "+turn.goal:""),
  acceptedAnswers:[normalizeP26(turn.model),normalizeP26(turn.alternative)],
  displayAnswer:turn.model,
  explanation:turn.why+" "+turn.continuity+
    " Ein frei formulierter anderer korrekter Satz kann außerhalb der endlichen Schlüssel liegen.",
  answerNormalization:"japanese",contextId:"p45:conversation:"+challenge.id,
  sourceId:"thiepn-original",contentVersion:"p45-1",
  eventMetadata:{p45:true,kind:index===2?"cross-context-reformulation":"dialogue-continuity",
   unitIds:[...challenge.units],challengeId:challenge.id,turnId:turn.id,
   turnNumber:index+1,independentCue:true,scaffold:"none",parentCase:challenge.parentCase}
 };
}
export const p45DialoguePrompts:StudyPrompt[]=p45Challenges.flatMap(c=>
 c.turns.map((turn,i)=>createTurnPrompt(c,turn,i))
);
export const p45ReturnPrompts:StudyPrompt[]=p45Challenges.map(c=>({
 id:"p45-return-"+c.id,
 primaryTarget:{kind:"can_do",id:"p45:return:"+c.id},
 skill:"production",promptType:"typed",cueFamily:"p45-unseen-transfer-"+c.id,
 instruction:"Antworte ohne Musterdialog und ohne Auswahlliste in einer neuen Situation",
 prompt:c.returnCue.situation,
 acceptedAnswers:[normalizeP26(c.returnCue.model),normalizeP26(c.returnCue.alternative)],
 displayAnswer:c.returnCue.model,
 explanation:c.returnCue.why+
   " Ein späterer FSRS-Termin erfordert eine echte unabhängig bewertete Antwort.",
 answerNormalization:"japanese",contextId:"p45:return:"+c.id,
 sourceId:"thiepn-original",contentVersion:"p45-1",
 eventMetadata:{p45:true,kind:"cross-context-transfer",unitIds:[...c.units],
   challengeId:c.id,focus:"delayed-independent-return",independentCue:true}
}));
export const p45Prompts:StudyPrompt[]=[...p45DialoguePrompts,...p45ReturnPrompts];
export function p45PromptsForChallenge(id:string):StudyPrompt[]{
 return p45DialoguePrompts.filter(p=>p.eventMetadata?.challengeId===id)
   .sort((a,b)=>Number(a.eventMetadata?.turnNumber)-Number(b.eventMetadata?.turnNumber));
}
