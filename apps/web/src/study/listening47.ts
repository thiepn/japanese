import type {StudyPrompt} from "@thiepn/study-player";
import {normalizeP26} from "./pedagogy26";
import type {P47Scene,P47Question,P47Task} from "./listening47-types";
import {p47ScenesA} from "./listening47-corpus-a";
import {p47ScenesB} from "./listening47-corpus-b";
import {p47ScenesC} from "./listening47-corpus-c";
import {p47ScenesD} from "./listening47-corpus-d";
import {p47ScenesE} from "./listening47-corpus-e";

export type {P47Scene,P47Question,P47Task,P47Line} from "./listening47-types";
export const p47Scenes:readonly P47Scene[]=[
 ...p47ScenesA,...p47ScenesB,...p47ScenesC,...p47ScenesD,...p47ScenesE
];
export function p47ForUnit(unitId:string):P47Scene[]{
 return p47Scenes.filter(scene=>scene.units.includes(unitId));
}
export function p47ById(id:string):P47Scene|undefined{
 return p47Scenes.find(scene=>scene.id===id);
}
export function p47AuthoredFeedback(answer:string,correct:readonly string[],
 misconception:string,why:string):{kind:"authored"|"misconception"|"unknown";message:string}{
 const value=normalizeP26(answer);
 if(correct.some(candidate=>normalizeP26(candidate)===value))return {
  kind:"authored",message:"Die Antwort entspricht einem ausdrücklich verfassten Japanisch-Beispiel."
 };
 if(normalizeP26(misconception)===value)return {
  kind:"misconception",message:why
 };
 return {kind:"unknown",message:"Diese andere mögliche japanische Antwort ist hier nicht semantisch bewertet. Prüfe die gehörten Fakten; unbekannt bedeutet nicht falsch."};
}
function shared(scene:P47Scene,step:string):Pick<StudyPrompt,
 "primaryTarget"|"cueFamily"|"answerNormalization"|"contextId"|"sourceId"|"contentVersion"|"eventMetadata">{
 return {
  primaryTarget:{kind:"can_do",id:"p47:listening:"+scene.id+":"+step},
  cueFamily:"p47-original-"+scene.id+"-"+step,answerNormalization:"japanese",
  contextId:"p47:scene:"+scene.id,sourceId:"thiepn-original",contentVersion:"p47-1",
  eventMetadata:{p47:true,sceneId:scene.id,unitIds:[...scene.units],
    level:scene.level,genre:scene.genre,step,independentCue:true,
    kind:"listening-followup"}
 };
}
const transcript=(scene:P47Scene)=>scene.lines.map(
 line=>line.speaker+"： "+line.japanese).join("\n");
export const p47ComprehensionPrompts:StudyPrompt[]=p47Scenes.flatMap(scene=>
 scene.questions.map((question,index)=>{
  const root=shared(scene,"question-"+(index+1));
  return {...root,id:"p47-question-"+question.id,
   skill:"production",promptType:"typed",
   instruction:"Eigenständige NACHHÖR-Frage: Höre die Szene zuerst im Learn-Hörbereich. Dieser textgestützte StudyPlayer-Hinweis ist keine Audioprüfung.",
   prompt:"Situation: "+scene.situation+"\nSkript zum Nachlesen:\n"+
     transcript(scene)+"\n\nFrage: "+question.question,
   acceptedAnswers:[normalizeP26(question.answer),normalizeP26(question.alternative)],
   displayAnswer:question.answer,
   explanation:question.feedback+" Hörbeleg: 「"+question.evidence+"」. "+
     "Andere korrekte japanische Formulierungen können außerhalb der Antwortbeispiele liegen.",
   eventMetadata:{...root.eventMetadata,kind:"listening-text-supported-comprehension",
     questionId:question.id,questionKind:question.kind}
  };
 })
);
export const p47ResponsePrompts:StudyPrompt[]=p47Scenes.map(scene=>{
 const root=shared(scene,"response");
 return {...root,id:"p47-response-"+scene.id,skill:"production",promptType:"typed",
  instruction:"Eigenständige japanische Reaktion nach der gehörten Szene. Die Situation ist als Erinnerung genannt, nicht als gespeicherte Tonaufnahme.",
  prompt:scene.situation+"\nNeue Reaktion: "+scene.response.instruction,
  acceptedAnswers:[normalizeP26(scene.response.model),normalizeP26(scene.response.alternative)],
  displayAnswer:scene.response.model,
  explanation:scene.response.feedback+" Freie sprachlich gültige Varianten bleiben außerhalb der festen Antwortschlüssel.",
  eventMetadata:{...root.eventMetadata,kind:"listening-followup-writing"}
 };
});
export const p47ReturnPrompts:StudyPrompt[]=p47Scenes.map(scene=>{
 const root=shared(scene,"return");
 return {...root,id:"p47-return-"+scene.id,skill:"production",promptType:"typed",
  instruction:"Späterer unabhängiger Abruf in einer VERÄNDERTEN Alltagssituation, ohne Hörskript oder Musterantwort.",
  prompt:scene.transfer.instruction,
  acceptedAnswers:[normalizeP26(scene.transfer.model),normalizeP26(scene.transfer.alternative)],
  displayAnswer:scene.transfer.model,
  explanation:scene.transfer.feedback+" Nur der bestehende FSRS-Scheduler kann eine echte Fälligkeit aus Lernantworten erzeugen.",
  eventMetadata:{...root.eventMetadata,kind:"cross-context-transfer",
    focus:"delayed-independent-return"}
 };
});
export const p47Prompts:StudyPrompt[]=[
 ...p47ComprehensionPrompts,...p47ResponsePrompts,...p47ReturnPrompts
];
export type P47PracticeKind="comprehension"|"response"|"return"|"all";
export function p47PromptsForScene(id:string,kind:P47PracticeKind="all"):StudyPrompt[]{
 if(!p47ById(id))return [];
 const q=p47ComprehensionPrompts.filter(p=>p.eventMetadata?.sceneId===id);
 const w=p47ResponsePrompts.filter(p=>p.eventMetadata?.sceneId===id);
 const r=p47ReturnPrompts.filter(p=>p.eventMetadata?.sceneId===id);
 if(kind==="comprehension")return q;
 if(kind==="response")return w;
 if(kind==="return")return r;
 return [...q,...w];
}
