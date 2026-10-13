import type {StudyPrompt} from "@thiepn/study-player";
import {normalizeP26} from "./pedagogy26";
import type {P56Scene,P56RouteKey,P56Transfer} from "./interaction56-types";
import {p53ById} from "./vocabulary53";
import {p53FamiliesFor} from "./vocabulary53-families";
import {p56ScenesA} from "./interaction56-corpus-a";
import {p56ScenesB} from "./interaction56-corpus-b";
import {p56ScenesC} from "./interaction56-corpus-c";
import {p56ScenesD} from "./interaction56-corpus-d";
import {p56ScenesE} from "./interaction56-corpus-e";
export type {P56Scene,P56RouteKey,P56Register,P56Route,P56Transfer} from "./interaction56-types";
export const p56Scenes:readonly P56Scene[]=[
 ...p56ScenesA,...p56ScenesB,...p56ScenesC,...p56ScenesD,...p56ScenesE
];
export const p56ById=(id:string):P56Scene|undefined=>p56Scenes.find(scene=>scene.id===id);
export const p56ForUnit=(unit:string):P56Scene[]=>p56Scenes.filter(scene=>scene.units.includes(unit));
export function p56Progression(id:string):{stage:number;goal:string}{
 const i=p56Scenes.findIndex(scene=>scene.id===id);
 if(i<0)return {stage:0,goal:""};
 if(i<7)return {stage:1,goal:"Direkte Rückfrage, zeitliche Korrektur und passende Höflichkeit"};
 if(i<21)return {stage:2,goal:"Nicht bestätigte Wünsche, Belegprüfung und unerwartete Gegenfragen"};
 if(i<28)return {stage:3,goal:"Bedingungen, Aussagen unterschiedlicher Personen und neue Fristen"};
 return {stage:4,goal:"Mehrere Informationsquellen, echte Kursänderungen und selbstständige Reparatur"};
}
export function p56RelatedWords(scene:P56Scene){
 return scene.words.flatMap(id=>{
  const word=p53ById(id);
  return word?[{...word,attested:[
    scene.partner,scene.routes.direct.partner,scene.routes.alternate.partner,
    scene.mistake.partner].some(t=>t.includes(word.written)),
    families:p53FamiliesFor(word.id)}]:[];
 });
}
export function p56Compare(value:string,accepted:readonly string[],wrong:string,why:string):
 {kind:"model"|"misconception"|"unassessed";message:string}{
 const n=normalizeP26(value);
 if(accepted.some(t=>normalizeP26(t)===n))
  return {kind:"model",message:"Der eigene Satz stimmt mit einem vollständigen Originalmodell überein."};
 if(normalizeP26(wrong)===n)
  return {kind:"misconception",message:why};
 return {kind:"unassessed",message:"Andere natürliche korrekte japanische Formulierungen sind nicht automatisch bewertet. Vergleiche Absicht, neue Partneraussage und Gesprächsstatus."};
}
function base(s:P56Scene,step:string):Pick<StudyPrompt,
 "primaryTarget"|"cueFamily"|"answerNormalization"|"contextId"|"sourceId"|"contentVersion"|"eventMetadata">{
 return {primaryTarget:{kind:"can_do",id:"p56:interaction:"+s.id+":"+step},
  cueFamily:"p56-original-"+s.id+"-"+step,
  answerNormalization:"japanese",contextId:"p56:interaction:"+s.id,
  sourceId:"thiepn-original",contentVersion:"p56-1",
  eventMetadata:{p56:true,sceneId:s.id,unitIds:[...s.units],register:s.register,
   level:"A2",independentCue:true,sourceRights:"thiepn-original",
   liveConversationAssessment:false,recordedSpeech:false}};
}
export const p56DecisionPrompts:StudyPrompt[]=p56Scenes.map(s=>{
 const b=base(s,"decision");
 return {...b,id:"p56-decision-"+s.id,skill:"form_selection",promptType:"choice",
  instruction:"Zwei selbstständige, sozial passende Einstiege sind möglich. Der dritte verdeckt eine konkrete Fehlinterpretation.",
  prompt:s.setting+"\nPartner: "+s.partner+"\nZiel: "+s.goal,
  choices:[s.routes.direct.opening,s.mistake.misleading,s.routes.alternate.opening],
  acceptedAnswers:[normalizeP26(s.routes.direct.opening),normalizeP26(s.routes.alternate.opening)],
  displayAnswer:s.routes.direct.opening,
  explanation:"Direkte Option: "+s.routes.direct.openingGerman+
   ". Alternative: "+s.routes.alternate.openingGerman+
   ". Der Stolperstein bedeutet: "+s.mistake.meaning+". "+s.mistake.misconception+
   " Die zwei gültigen Wege haben verschiedene Folgeäußerungen.",
  eventMetadata:{...b.eventMetadata,kind:"interaction-route-choice"}
 };
});
export const p56RoutePrompts:StudyPrompt[]=p56Scenes.flatMap(s=>
 (["direct","alternate","repair"] as const).map(k=>{
  const b=base(s,"route-"+k),mis=k==="repair",route=mis?undefined:s.routes[k];
  const opening=mis?s.mistake.misleading:route!.opening;
  const partner=mis?s.mistake.partner:route!.partner;
  const task=mis?s.mistake.repairGoal:route!.nextGoal;
  const model=mis?s.mistake.repair:route!.reply;
  const alternative=mis?s.mistake.repairAlternative:route!.replyAlternative;
  const why=mis?s.mistake.misconception:route!.explanation;
  return {...b,id:"p56-route-"+k+"-"+s.id,skill:"production",promptType:"typed",
   instruction:mis?"Missverständnis nach dem echten Partnerwiderspruch ausdrücklich reparieren":
    "Nur den selbst gewählten Gesprächsweg eigenständig fortsetzen. Neues Partnerdetail berücksichtigen.",
   prompt:s.setting+"\nGegenüber: "+s.partner+
    "\nDeine erste Aussage: "+opening+"\nUnerwartete Partnerantwort: "+partner+
    "\nDein neues Ziel: "+task,
   acceptedAnswers:[normalizeP26(model),normalizeP26(alternative)],
   displayAnswer:model,
   explanation:why+" Modellalternative: "+alternative+
    " Andere korrekt formulierte Antworten sind nicht vollständig semantisch erfasst.",
   eventMetadata:{...b.eventMetadata,kind:mis?"interaction-misconception-repair":
    "interaction-independent-followup",branch:k}
  } as StudyPrompt;
 }));
function output(s:P56Scene,t:P56Transfer,delayed:boolean):StudyPrompt{
 const b=base(s,delayed?"return":"production");
 return {...b,id:(delayed?"p56-return-":"p56-production-")+s.id,
  skill:"production",promptType:"typed",
  instruction:delayed?"Wirklich neuer unabhängiger Kontext ohne frühere Gesprächsantworten.":
   "Spontane eigenständige A2-Reaktion auf veränderte Umstände; zuerst selbst formulieren.",
  prompt:t.situation,
  acceptedAnswers:[normalizeP26(t.model),normalizeP26(t.alternative)],
  displayAnswer:t.model,
  explanation:t.explanation+" Häufiger Fehler: "+t.misleading+
   " Der native Musterabgleich kann nicht alle gültigen japanischen Paraphrasen erfassen.",
  eventMetadata:{...b.eventMetadata,
   kind:delayed?"cross-context-dialogue-return":"interaction-independent-production",
   focus:delayed?"delayed-independent-return":"independent-repair-transfer"}
 };
}
export const p56ProductionPrompts:StudyPrompt[]=p56Scenes.map(s=>output(s,s.production,false));
export const p56ReturnPrompts:StudyPrompt[]=p56Scenes.map(s=>output(s,s.returnCue,true));
export const p56Prompts:StudyPrompt[]=[
 ...p56DecisionPrompts,...p56RoutePrompts,...p56ProductionPrompts,...p56ReturnPrompts
];
export type P56PracticeKind="decision"|"direct"|"alternate"|"repair"|"production"|"return"|"all";
export function p56PromptsForScene(id:string,kind:P56PracticeKind="all"):StudyPrompt[]{
 if(!p56ById(id))return [];
 const d=p56DecisionPrompts.filter(p=>p.eventMetadata?.sceneId===id);
 const routes=p56RoutePrompts.filter(p=>p.eventMetadata?.sceneId===id);
 const prod=p56ProductionPrompts.filter(p=>p.eventMetadata?.sceneId===id);
 const ret=p56ReturnPrompts.filter(p=>p.eventMetadata?.sceneId===id);
 if(kind==="decision")return d;
 if(kind==="direct"||kind==="alternate"||kind==="repair")
  return routes.filter(p=>p.eventMetadata?.branch===kind);
 if(kind==="production")return prod;
 if(kind==="return")return ret;
 return [...d,...routes,...prod];
}
export const p56Route=(s:P56Scene,key:P56RouteKey)=>{
 if(key==="repair")return {
  first:s.mistake.misleading,firstGerman:s.mistake.meaning,
  partner:s.mistake.partner,partnerGerman:s.mistake.partnerGerman,
  task:s.mistake.repairGoal,model:s.mistake.repair,
  alternative:s.mistake.repairAlternative,explanation:s.mistake.misconception
 };
 const r=s.routes[key];
 return {first:r.opening,firstGerman:r.openingGerman,partner:r.partner,
  partnerGerman:r.partnerGerman,task:r.nextGoal,model:r.reply,
  alternative:r.replyAlternative,explanation:r.explanation};
};
