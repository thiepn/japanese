import type {StudyPrompt} from "@thiepn/study-player";
import {normalizeP26} from "./pedagogy26";
import {p43CorpusA} from "./dialogue43-corpus-a";
import {p43CorpusB} from "./dialogue43-corpus-b";
import {p43CorpusC} from "./dialogue43-corpus-c";
import {p43CorpusD} from "./dialogue43-corpus-d";
import {p43CorpusE} from "./dialogue43-corpus-e";

export type P43RouteKey="direct"|"alternate"|"repair";
export interface P43OpeningChoice{form:string;meaning:string;consequence:string}
export interface P43Route{
 partner:string;intention:string;model:string;alternative:string;
 misstep:string;why:string;outcome:string;
}
export interface P43ReturnCue{
 intention:string;model:string;alternative:string;misstep:string;why:string;
}
/** A true authored choice graph: two valid decisions reach distinct partner
 * replies and resolutions; a misunderstanding routes through real repair. */
export interface P43Scene{
 id:string;baseArcId:string;level:"A1"|"A2";unitIds:readonly string[];
 title:string;setting:string;goal:string;register:"polite"|"casual";
 opening:{partner:string;intention:string;direct:P43OpeningChoice;
  alternate:P43OpeningChoice;mistake:P43OpeningChoice;misconception:string};
 routes:Record<P43RouteKey,P43Route>;
 returnCue:P43ReturnCue;
}
export const p43Scenes:readonly P43Scene[]=[
 ...p43CorpusA,...p43CorpusB,...p43CorpusC,...p43CorpusD,...p43CorpusE
];
export function p43ForUnit(id:string):P43Scene[]{return p43Scenes.filter(s=>s.unitIds.includes(id));}
export function p43SceneById(id:string):P43Scene|undefined{
 return p43Scenes.find(s=>s.id===id);
}
export function p43Feedback(value:string,valid:readonly string[],error:string,
  explanation:string):{kind:"authored"|"misconception"|"unknown";message:string}{
 const v=normalizeP26(value);
 if(valid.some(a=>normalizeP26(a)===v))
   return {kind:"authored",message:"Diese Originalantwort ist mit dem konkreten Ziel vereinbar."};
 if(normalizeP26(error)===v)
   return {kind:"misconception",message:explanation};
 return {kind:"unknown",message:"Diese andere freie Formulierung ist nicht automatisch beurteilt."};
}
function promptBase(scene:P43Scene,kind:string):Pick<StudyPrompt,
 "primaryTarget"|"cueFamily"|"answerNormalization"|"contextId"|"sourceId"|"contentVersion"|"eventMetadata">{
 return {
  primaryTarget:{kind:"can_do",id:"p43:branch:"+scene.id+":"+kind},
  cueFamily:"p43-branch-"+scene.id+"-"+kind,
  answerNormalization:"japanese",contextId:"p43:branch:"+scene.id,
  sourceId:"thiepn-original",contentVersion:"p43-1",
  eventMetadata:{p43:true,kind:kind==="return"?"cross-context-transfer":
   kind==="repair"?"cross-context-reformulation":"dialogue-continuity",
   unitIds:[...scene.unitIds],sceneId:scene.id,route:kind,
   independentCue:true,register:scene.register}
 };
}
export const p43DecisionPrompts:StudyPrompt[]=p43Scenes.map(scene=>({
 ...promptBase(scene,"opening"),
 id:"p43-decision-"+scene.id,skill:"form_selection",promptType:"choice",
 instruction:"Wähle ohne Hilfen eine der passenden Entscheidungen; unterschiedliche Antworten führen zu unterschiedlichen Konsequenzen.",
 prompt:scene.setting+"\n"+scene.goal+"\n"+scene.opening.partner+"\n"+scene.opening.intention,
 choices:[scene.opening.mistake.form,scene.opening.direct.form,scene.opening.alternate.form],
 acceptedAnswers:[scene.opening.direct.form,scene.opening.alternate.form],
 displayAnswer:scene.opening.direct.form,
 explanation:scene.opening.misconception+" "+
  "Die zwei akzeptierten Entscheidungen verfolgen unterschiedliche legitime Wege. "+
  "Die passende Folgeantwort wird im jeweiligen eigenständigen Zweig geprüft."
}));
export const p43RoutePrompts:StudyPrompt[]=p43Scenes.flatMap(scene=>
 (["direct","alternate","repair"] as const).map(key=>{
  const route=scene.routes[key];
  const context=key==="direct"?scene.opening.direct:
    key==="alternate"?scene.opening.alternate:scene.opening.mistake;
  return {
   ...promptBase(scene,key),
   id:"p43-route-"+key+"-"+scene.id,
   skill:"production",promptType:"typed",
   instruction:key==="repair"?"Behebe das Missverständnis mit einer neuen eigenen Antwort":
     "Setze genau diesen selbstständig gewählten Gesprächszweig fort",
   prompt:scene.setting+"\nDeine vorangegangene Entscheidung: "+context.form+
     "\nKonsequenz: "+context.consequence+
     "\nGesprächspartner: "+route.partner+"\nAufgabe: "+route.intention+
     (key==="repair"?"\nFehlerhafter Ausdruck: "+route.misstep:""),
   acceptedAnswers:[normalizeP26(route.model),normalizeP26(route.alternative)],
   displayAnswer:route.model,
   explanation:route.why+" Ergebnis dieser Route: "+route.outcome
  } as StudyPrompt;
 })
);
export const p43ReturnPrompts:StudyPrompt[]=p43Scenes.map(scene=>({
 ...promptBase(scene,"return"),
 id:"p43-return-"+scene.id,
 skill:"production",promptType:"typed",
 instruction:"Neue Situation: ohne Gesprächsvorlage einen passenden japanischen Satz bilden",
 prompt:scene.returnCue.intention,
 acceptedAnswers:[normalizeP26(scene.returnCue.model),normalizeP26(scene.returnCue.alternative)],
 displayAnswer:scene.returnCue.model,
 explanation:scene.returnCue.why+
  " Ein späterer FSRS-Termin entsteht nur aus einer unabhängig bewerteten Antwort."
}));
export const p43Prompts:StudyPrompt[]=[
 ...p43DecisionPrompts,...p43RoutePrompts,...p43ReturnPrompts
];
export function p43BranchPrompts(sceneId:string,route?:P43RouteKey):StudyPrompt[]{
 if(!p43SceneById(sceneId))return [];
 if(!route)return p43DecisionPrompts.filter(p=>p.eventMetadata?.sceneId===sceneId);
 return p43RoutePrompts.filter(p=>p.eventMetadata?.sceneId===sceneId&&p.eventMetadata?.route===route);
}
