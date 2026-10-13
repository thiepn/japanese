import type {StudyEvent} from "@thiepn/domain";
import type {MemoryTrace} from "@thiepn/scheduler";
import type {StudyLesson,StudyPrompt,StudyStep} from "@thiepn/study-player";
import {pedagogyScenarios,pedagogyPrompts,pedagogyLessons} from "./pedagogy23";
import {conversationForScenario,p24ReviewPrompts,dialoguePrompt,productionTasks} from "./pedagogy24";
import {p40DialogueById,p40PromptsForArc,p40ReturnPrompts} from "./dialogue40";
import {p41ArcById,p41PromptsForArc,p41ReturnPrompts} from "./dialogue41";
import {p42ArcById,p42PromptsForArc,p42ReturnPrompts} from "./dialogue42";
import {p43SceneById,p43BranchPrompts,p43ReturnPrompts,type P43RouteKey} from "./dialogue43";
import {p44ById,p44PromptsForCase,p44ReturnPrompts,type P44PracticeStep} from "./pragmatics44";
import {p45ById,p45PromptsForChallenge,p45ReturnPrompts} from "./independence45";
import {p46ById,p46PromptsForReading,p46ReturnPrompts} from "./reading46";
import {p47ById,p47PromptsForScene,p47ReturnPrompts,type P47PracticeKind} from "./listening47";
import {p48ById,p48PromptsForCase,p48ReturnPrompts,type P48PracticeKind} from "./connected48";
import {p49ById,p49PromptsForDocument,p49ReturnPrompts,type P49PracticeKind} from "./documents49";
import {p50ById,p50PromptsForMission,p50ReturnPrompts,type P50PracticeKind} from "./integrated50";
import {p51ById,p51PromptsForContrast,p51ReturnPrompts,type P51PracticeKind} from "./grammar51";
import {p52ById,p52PromptsForTransformation,p52ReturnPrompts,type P52PracticeKind} from "./transformation52";
import {p53ById,p53PromptsForVocabulary,p53ReturnPrompts,p53MeaningPrompts,type P53PracticeKind} from "./vocabulary53";
import {p54ById,p54PromptsForReading,p54ReturnPrompts,p54ComprehensionPrompts,type P54PracticeKind} from "./reading54";
import {p25Scenarios,p25Prompts,p25Lessons,p25DialoguePrompt} from "./pedagogy25";
import {p26Missions,p26Prompts,p26Lessons,missionTurnPrompt,normalizeP26} from "./pedagogy26";

/** A single read-only course adapter over independently authored P23–P26 material.
 * No per-phase progress, duplicate learner events, or additional master store.
 */
export type JourneySource="p23"|"p25"|"p26";
export type JourneyStage="learn"|"build"|"conversation"|"write"|"practice";
export type JourneyPractice="review"|"retry"|"new"|"transfer"|"register"|"grammar"|"production"|`dialogue:${string}`|`branch:${string}`|`branch-route:${string}`|`pragmatic:${string}`|`pragmatic-step:${string}`|`independent:${string}`|`reading:${string}`|`reading-kind:${string}`|`listening:${string}`|`listening-kind:${string}`|`connected:${string}`|`connected-kind:${string}`|`document:${string}`|`document-kind:${string}`|`integrated:${string}`|`integrated-kind:${string}`|`contrast:${string}`|`contrast-kind:${string}`|`transform:${string}`|`transform-kind:${string}`|`lexical:${string}`|`lexical-kind:${string}`|`reading54:${string}`|`reading54-kind:${string}`|`return:${string}`|`return-due:${string}`;
export interface JourneyWord{form:string;reading:string;meaning:string;example:string;}
export interface JourneyOption{
  japanese:string;meaning:string;valid:boolean;explanation:string;next?:string|null;
}
export interface JourneyTurn{
  id:string;partner:string;meaning:string;hint:string;
  options:readonly JourneyOption[];next:string|null;reference:string;
  originalPrompt?:StudyPrompt;
}
export interface JourneyUnit{
  id:string;source:JourneySource;sourceId:string;title:string;level:"A1"|"A2";
  goal:string;situation:string;model:string;contrast:string;register:string;
  words:readonly JourneyWord[];turns:readonly JourneyTurn[];
  writing:{task:string;reference:string;features:readonly string[];reflection:string};
  lesson:StudyLesson;
}
function toP23():JourneyUnit[]{
  return pedagogyScenarios.map(s=>{
    const conversation=conversationForScenario(s.id)!;
    return {
      id:"p23:"+s.id,source:"p23",sourceId:s.id,title:s.title,level:s.level,
      goal:s.canDo,situation:s.situation,model:s.model,contrast:s.contrast,
      register:s.trap,words:s.words.map(w=>({form:w.written,reading:w.reading,meaning:w.meaning,example:w.example})),
      turns:conversation.turns.map(t=>({
        id:t.id,partner:t.japanese,meaning:t.german,hint:t.situation,
        options:t.choices.map(c=>({japanese:c.japanese,meaning:c.german,valid:c.appropriate,explanation:c.explanation,next:c.next})),
        next:null,reference:t.choices.find(c=>c.appropriate)?.japanese??t.choices[0]!.japanese,
        originalPrompt:dialoguePrompt(s.id,t)
      })),
      writing:{
        task:productionTasks.find(p=>p.scenarioId===s.id)!.writingPrompt,
        reference:productionTasks.find(p=>p.scenarioId===s.id)!.reference,
        features:productionTasks.find(p=>p.scenarioId===s.id)!.features,
        reflection:productionTasks.find(p=>p.scenarioId===s.id)!.guidance
      },
      lesson:pedagogyLessons["p23:context:"+s.id]!
    };
  });
}
function toP25():JourneyUnit[]{
  return p25Scenarios.map(s=>({
    id:"p25:"+s.id,source:"p25",sourceId:s.id,title:s.title,level:s.level,
    goal:s.canDo,situation:s.situation,model:s.mentalModel,contrast:s.contrast,register:s.pitfall,
    words:s.words.map(w=>({form:w.japanese,reading:w.reading,meaning:w.german,example:w.example})),
    turns:s.turns.map((t,index)=>({
      id:t.id,partner:t.japanese,meaning:t.german,hint:"Reagiere passend auf diese Situation.",
      options:t.choices.map(c=>({japanese:c.japanese,meaning:c.german,valid:c.correct,explanation:c.explanation})),
      next:index+1<s.turns.length?s.turns[index+1]!.id:null,
      reference:t.choices.find(c=>c.correct)?.japanese??t.choices[0]!.japanese,
      originalPrompt:p25DialoguePrompt(s.id,t)
    })),
    writing:{task:s.revision.writing,reference:s.revision.reference,features:s.revision.features,reflection:s.revision.advice},
    lesson:p25Lessons["p25:"+s.id]!
  }));
}
function toP26():JourneyUnit[]{
  return p26Missions.map(m=>({
    id:"p26:"+m.id,source:"p26",sourceId:m.id,title:m.title,level:m.level,
    goal:m.objective,situation:m.situation,model:m.mental,contrast:m.contrast,register:m.register,
    words:m.words.map(w=>({form:w.written,reading:w.reading,meaning:w.meaning,example:w.example})),
    turns:m.turns.map((t,index)=>({
      id:"turn-"+index,partner:t.partner,meaning:t.meaning,hint:t.explanation,
      options:t.accepted.map((japanese,i)=>({japanese,meaning:i===0?t.modelMeaning:"Alternative",valid:true,explanation:t.explanation})),
      next:index+1<m.turns.length?"turn-"+(index+1):null,reference:t.accepted[0]!,
      originalPrompt:missionTurnPrompt(m,index)
    })),
    writing:{
      task:m.situation+" Verfasse eine eigene kurze Nachricht, die das Lernziel erfüllt: "+m.objective,
      reference:m.turns.slice(0,2).map(t=>t.accepted[0]).join("。")+"。",
      features:m.words.slice(0,3).map(w=>w.written),
      reflection:"Überprüfe besonders: "+m.contrast+" Höflichkeit: "+m.register
    },
    lesson:p26Lessons["p26:mission:"+m.id]!
  }));
}
export const journeyUnits:readonly JourneyUnit[]=[...toP23(),...toP25(),...toP26()];
export function journeyUnit(id:string):JourneyUnit{
  const unit=journeyUnits.find(item=>item.id===id);
  if(!unit)throw new Error("P27_UNIT_NOT_FOUND:"+id);
  return unit;
}
export function nextTurn(unit:JourneyUnit,turn:JourneyTurn,choice:JourneyOption|undefined):string|null{
  if(choice){
    if(choice.next!==undefined)return choice.next;
    if(!choice.valid)return turn.id;
  }
  return turn.next;
}
export function journeyTypedPrompt(unit:JourneyUnit,turn:JourneyTurn):StudyPrompt{
  if(unit.source==="p26")return turn.originalPrompt!;
  return {
    id:"p27-typed-"+unit.id+"-"+turn.id,
    primaryTarget:{kind:"can_do",id:"p27:dialogue:"+unit.id},
    skill:"production",cueFamily:"p27-independent-"+turn.id,
    promptType:"typed",instruction:"Antwort frei eintippen, ohne Modellhilfe",prompt:turn.partner,
    promptLanguage:"ja",
    acceptedAnswers:turn.options.filter(o=>o.valid).map(o=>normalizeP26(o.japanese)),
    displayAnswer:turn.reference,explanation:turn.hint,
    contextId:"p27:unit:"+unit.id,answerNormalization:"japanese",
    sourceId:"thiepn-original",contentVersion:"p27-1",
    eventMetadata:{p27:true,unitId:unit.id,kind:"independent-dialogue",turnId:turn.id}
  };
}
/** Original pragmatic contrasts across different situations (not textbook transcriptions). */
interface TransferCase{
  id:string;units:readonly string[];theme:string;context:string;target:string;
  choices:readonly string[];explanation:string;
}
const transferCases:readonly TransferCase[]=[
  {id:"student-topic",units:["p23:introduction","p25:appointment"],theme:"Topic",context:"Jemand fragt, ob du studierst: 私 ___ 学生です。",target:"は",choices:["は","で","を"],explanation:"は markiert 私 als Thema; で bezeichnet keinen nominalen Prädikatsträger."},
  {id:"polite-first",units:["p23:greetings","p23:introduction","p25:directions"],theme:"Höflich ansprechen",context:"Du triffst morgens eine unbekannte Lehrkraft.",target:"おはようございます",choices:["おはようございます","おやすみなさい","いただきます"],explanation:"Die höfliche Morgenbegrüßung passt, nicht die Nachtformel."},
  {id:"ownership-question",units:["p23:ownership","p25:lostfound"],theme:"Besitz",context:"Im Fundbüro fragst du: これはだれ ___ 傘ですか。",target:"の",choices:["の","を","で"],explanation:"の verbindet die Besitzerfrage mit 傘."},
  {id:"destination",units:["p23:places","p25:transport","p25:directions","p26:station-to-campus"],theme:"Ziel",context:"駅 ___ 行きます。 Du beschreibst das Ziel, nicht den Ort der Handlung.",target:"に",choices:["に","で","を"],explanation:"行きます verlangt hier eine Zielmarkierung mit に."},
  {id:"action-location",units:["p23:places","p23:routine","p25:library","p26:station-to-campus"],theme:"Handlungsort",context:"図書館 ___ 日本語を勉強します。",target:"で",choices:["で","に","を"],explanation:"で markiert den Ort der Tätigkeit 勉強します."},
  {id:"transport-means",units:["p25:transport","p25:directions","p26:station-to-campus"],theme:"Verkehrsmittel",context:"大学までバス ___ 行きます。",target:"で",choices:["で","に","が"],explanation:"で benennt das Verkehrsmittel."},
  {id:"departure-time",units:["p25:transport","p25:appointment","p26:station-to-campus"],theme:"Zeit",context:"バスは九時 ___ 出ます。",target:"に",choices:["に","を","で"],explanation:"Konkrete Uhrzeit mit に; で wäre eine andere Funktion."},
  {id:"past-correct",units:["p23:routine","p23:past","p25:lostfound","p26:weekend-switch"],theme:"Vergangenheit",context:"週末、映画を見 ___。 Vergangene Aktivität.",target:"ました",choices:["ました","ます","ましょう"],explanation:"ました ist die höfliche Vergangenheitsform."},
  {id:"past-negative",units:["p23:past","p25:lostfound","p26:weekend-switch"],theme:"Vergangenheit verneinen",context:"昨日、学校に行き ___。 Ich ging gestern nicht zur Schule.",target:"ませんでした",choices:["ませんでした","ませんか","ます"],explanation:"ませんでした drückt höfliche verneinte Vergangenheit aus."},
  {id:"item-request",units:["p23:cafe","p25:shopping","p26:cafe-conversation"],theme:"Bitte um Sache",context:"水 ___ ください。 Bestellung im Café.",target:"を",choices:["を","に","で"],explanation:"を markiert das gewünschte Objekt."},
  {id:"request-vs-wish",units:["p25:library","p26:library-project","p23:cafe"],theme:"Erlaubnis",context:"この本を借り ___ いいですか。 Frage nach Erlaubnis.",target:"ても",choices:["ても","たい","ます"],explanation:"て-Form + もいいですか bittet um Erlaubnis; たい ist ein Wunsch."},
  {id:"invite",units:["p23:plans","p25:appointment","p26:weekend-switch","p26:library-project"],theme:"Einladung",context:"友達を誘う: 一緒に行き ___ か。",target:"ません",choices:["ません","ました","ましょう"],explanation:"行きませんか fragt höflich, ob die andere Person mitkommen möchte."},
  {id:"suggest",units:["p23:plans","p25:appointment","p26:weekend-switch"],theme:"Vorschlag",context:"Der Plan ist akzeptiert. 一緒に行き ___。",target:"ましょう",choices:["ましょう","ません","ました"],explanation:"ましょう ist eine Einladung zum gemeinsamen Handeln."},
  {id:"conditional-time",units:["p25:appointment","p26:weekend-switch","p23:plans"],theme:"Bedingung",context:"土曜日 ___ 大丈夫です。 Samstag passt mir.",target:"なら",choices:["なら","で","を"],explanation:"なら grenzt die Zusage auf Samstag ein."},
  {id:"single-item",units:["p23:cafe","p25:shopping","p26:cafe-conversation"],theme:"Menge korrigieren",context:"ケーキは一つ ___ です。 Nur ein Stück.",target:"だけ",choices:["だけ","で","から"],explanation:"だけ beschränkt die Menge auf eins."},
  {id:"lost-adjective",units:["p25:lostfound","p25:shopping","p23:ownership"],theme:"Eigenschaft",context:"___ 傘をなくしました。 Ein schwarzer Schirm.",target:"黒い",choices:["黒い","黒く","黒で"],explanation:"い-Adjektive stehen mit い unmittelbar vor dem Nomen."},
  {id:"this-noun",units:["p23:ownership","p25:shopping"],theme:"Demonstrativ",context:"___ かばんはいくらですか。",target:"この",choices:["この","これ","ここ"],explanation:"この modifiziert ein folgendes Nomen; これ steht selbstständig."},
  {id:"reason",units:["p23:past","p26:weekend-switch","p25:appointment"],theme:"Begründung",context:"予定がある ___ 行けません。 Der Termin ist der Grund.",target:"から",choices:["から","まで","を"],explanation:"から kann die vorangehende Begründung verbinden."},
  {id:"action-request",units:["p25:directions","p25:library","p26:library-project"],theme:"Handlungsbitte",context:"右に曲がっ ___。 Bitte rechts abbiegen.",target:"てください",choices:["てください","ます","です"],explanation:"Verb て-Form + ください ist eine höfliche Handlungsaufforderung."},
  {id:"politeness",units:["p25:lostfound","p25:appointment","p26:cafe-conversation"],theme:"Höfliche Nachfrage",context:"Du sprichst mit fremdem Personal: Welche Form ist passend?",target:"すみません、もう一度お願いします。",choices:["すみません、もう一度お願いします。","もう一度言え。","何だよ。"],explanation:"Bitte und すみません machen diese Nachfrage höflich. Die Alternativen sind deutlich direkt bzw. grob."},
  {id:"teacher-register",units:["p23:greetings","p25:directions","p26:station-to-campus"],theme:"Register",context:"Du fragst einen unbekannten Lehrer um Hilfe. Welche Form ist höflicher?",target:"すみません、教えていただけますか。",choices:["教えて。","すみません、教えていただけますか。","教えろ。"],explanation:"Die Bitte mit いただけますか ist besonders höflich; das Verb いただく muss nicht selbst für A1 produziert werden."},
  {id:"peer-register",units:["p23:greetings","p23:introduction","p26:weekend-switch"],theme:"Registerwechsel",context:"Ein enger Freund begrüßt dich morgens. Was ist eine natürliche lockere Antwort?",target:"おはよう",choices:["おはよう","おはようございます、先生","いただきます"],explanation:"おはよう ist gegenüber Freunden üblich; die höfliche Form bleibt grammatisch möglich."},
  {id:"register-invitation",units:["p23:plans","p25:appointment","p26:weekend-switch"],theme:"Einladungston",context:"Du möchtest eine neue Bekanntschaft höflich einladen.",target:"一緒に行きませんか。",choices:["一緒に行きませんか。","一緒に行け。","行くぞ。"],explanation:"ませんか ist eine höfliche Einladung; Befehle sind situationsbedingt unpassend."},
  {id:"payment-means",units:["p23:cafe","p26:cafe-conversation","p25:shopping"],theme:"Zahlung",context:"現金 ___ 払います。 Mit Bargeld.",target:"で",choices:["で","を","に"],explanation:"で kennzeichnet das Mittel, hier die Zahlungsart."}
];
export const journeyTransferPrompts:StudyPrompt[]=transferCases.map(c=>({
  id:"p27-transfer-"+c.id,
  primaryTarget:{kind:"can_do",id:"p27:transfer:"+c.id},
  skill:"form_selection",cueFamily:"p27-contrast-"+c.id,promptType:"choice",
  instruction:c.theme+" · im neuen Kontext entscheiden",
  prompt:c.context,choices:[...c.choices],acceptedAnswers:[c.target],
  displayAnswer:c.target,explanation:c.explanation,
  contextId:"p27:transfer:"+c.id,answerNormalization:"japanese",
  sourceId:"thiepn-original",contentVersion:"p27-1",
  eventMetadata:{p27:true,kind:"cross-context-transfer",transferId:c.id,unitIds:[...c.units]}
}));
export const journeyTypedPrompts:StudyPrompt[]=journeyUnits.flatMap(unit=>
  unit.source==="p26"?[]:unit.turns.map(t=>journeyTypedPrompt(unit,t))
);
export const journeyPrompts:StudyPrompt[]=[...journeyTypedPrompts,...journeyTransferPrompts];
const transferByUnit=new Map(journeyUnits.map(u=>[u.id,journeyTransferPrompts.filter(p=>
  Array.isArray(p.eventMetadata?.unitIds)&&p.eventMetadata.unitIds.includes(u.id)
)]));
export function transferForUnit(id:string):StudyPrompt[]{return transferByUnit.get(id)??[];}
export const journeyLessons:Record<string,StudyLesson>=Object.fromEntries(journeyUnits.map(unit=>[
  "p27:unit:"+unit.id,{
    ...unit.lesson,id:"p27-intro-"+unit.id,contextId:"p27:unit:"+unit.id,
    sourceLabel:"THIEPN Japanese · original learning journey"
  }
]));
function initialPrompts(unit:JourneyUnit):StudyPrompt[]{
  if(unit.source==="p23")return [
    ...pedagogyPrompts.filter(p=>p.contextId==="p23:context:"+unit.sourceId),
    ...p24ReviewPrompts.filter(p=>p.eventMetadata?.scenarioId===unit.sourceId)
  ];
  if(unit.source==="p25")return p25Prompts.filter(p=>p.contextId==="p25:"+unit.sourceId);
  return p26Prompts.filter(p=>p.contextId==="p26:mission:"+unit.sourceId);
}
export function promptsForUnit(unitId:string,extras:readonly StudyPrompt[]=[]):StudyPrompt[]{
  const unit=journeyUnit(unitId);
  const seen=new Set<string>();
  return [...initialPrompts(unit),...unit.turns.map(t=>journeyTypedPrompt(unit,t)),...transferForUnit(unitId),...extras.filter(p=>p.eventMetadata?.unitId===unitId||p.eventMetadata?.sourceUnit===unitId||
      (Array.isArray(p.eventMetadata?.unitIds)&&p.eventMetadata.unitIds.includes(unitId)))]
    // P52 unseen transfer must not leak into ordinary "new"/"production" practice.
    // Dedicated return / return-due routes and native Today FSRS-due remain authoritative.
    .filter(p=>{
      if(p.id.startsWith("p52-return-")||p.id.startsWith("p53-return-")||p.id.startsWith("p54-return-")||seen.has(p.id))return false;
      seen.add(p.id);return true;
    });
}
export function traceIdJourney(p:StudyPrompt):string{
  return p.primaryTarget.kind+":"+p.primaryTarget.id+":"+p.skill+":"+p.cueFamily;
}
export type JourneyStatus="due"|"retry"|"unseen"|"maintain";
export interface JourneyUnitProgress{
  id:string;attempted:number;total:number;due:number;retry:number;unseen:number;
  recommendation:"repeat"|"continue"|"new";lastPracticedAt?:string;
}
export function deriveJourneyProgress(
  traces:readonly MemoryTrace[],events:readonly StudyEvent[],now=Date.now(),extras:readonly StudyPrompt[]=[]
):JourneyUnitProgress[]{
  const traceMap=new Map(traces.map(t=>[t.id,t]));
  const lastEvent=new Map<string,StudyEvent>();
  for(const event of events){
    const id=event.metadata?.promptId;
    if(typeof id!=="string"||(event.result!=="correct"&&event.result!=="incorrect")||event.metadata?.schedulerExcluded===true)continue;
    const prior=lastEvent.get(id);
    if(!prior||prior.occurredAt<event.occurredAt)lastEvent.set(id,event);
  }
  return journeyUnits.map(u=>{
    const prompts=promptsForUnit(u.id,extras);
    let due=0,retry=0,unseen=0,attempted=0;
    let lastPracticedAt:string|undefined;
    for(const p of prompts){
      const trace=traceMap.get(traceIdJourney(p));
      const latest=lastEvent.get(p.id);
      if(latest&&(!lastPracticedAt||lastPracticedAt<latest.occurredAt))lastPracticedAt=latest.occurredAt;
      // A graded event remains practice evidence even if its FSRS trace is missing.
      const alreadyPracticed=Boolean(trace||latest);
      if(alreadyPracticed)attempted++;
      if(trace&&Number.isFinite(Date.parse(trace.card.due))&&Date.parse(trace.card.due)<=now){
        due++;continue;
      }
      if(latest?.result==="incorrect"){retry++;continue;}
      if(!alreadyPracticed)unseen++;
    }
    return {
      id:u.id,attempted,total:prompts.length,due,retry,unseen,
      recommendation:due||retry?"repeat":unseen?"continue":"new",
      ...(lastPracticedAt?{lastPracticedAt}:{})
    };
  });
}
export function recommendedJourneyUnit(progress:readonly JourneyUnitProgress[]):string{
  const candidates=progress.filter(p=>p.due||p.retry).sort((a,b)=>b.due-a.due||b.retry-a.retry);
  if(candidates.length)return candidates[0]!.id;
  // Optional repair and alternative cues may remain unseen by design.
  // Visit completely untouched units before repeatedly recommending the
  // earliest partially attempted dialogue.
  return progress.find(p=>p.attempted===0&&p.unseen>0)?.id
    ??progress.filter(p=>p.unseen>0).sort((a,b)=>
      (a.attempted/a.total)-(b.attempted/b.total))[0]?.id
    ??journeyUnits[0]!.id;
}
export function journeySession(unitId:string,focus:JourneyPractice,traces:readonly MemoryTrace[],events:readonly StudyEvent[],now=Date.now(),extras:readonly StudyPrompt[]=[]):StudyStep[]{
  const unit=journeyUnit(unitId);
  const known=new Map(traces.map(t=>[t.id,t]));
  const pragmatic=extras.filter(p=>{
    const ids=p.eventMetadata?.unitIds;
    return p.eventMetadata?.kind==="register-contrast"&&Array.isArray(ids)&&ids.includes(unitId);
  });
  const relatedRegister=transferForUnit(unitId).filter(p=>/register|polite|tone|Höflich|Einladungston/.test(p.id+" "+p.instruction));
  const reading54Id=focus.startsWith("reading54:")?
    focus.slice("reading54:".length):"";
  const reading54Input=focus.startsWith("reading54-kind:")?
    focus.slice("reading54-kind:".length):"";
  const reading54Split=reading54Input.lastIndexOf(":");
  const reading54KindId=reading54Split>0?reading54Input.slice(0,reading54Split):"";
  const reading54KindName=reading54Split>0?reading54Input.slice(reading54Split+1):"";
  const reading54Kind=(["comprehension","vocabulary","writing","return"] as const)
    .find(k=>k===reading54KindName) as P54PracticeKind|undefined;
  const reading54Cues=reading54Id&&p54ById(reading54Id)?.units.includes(unitId)?
    p54PromptsForReading(reading54Id):[];
  const reading54KindCues=reading54Kind&&p54ById(reading54KindId)?.units.includes(unitId)?
    p54PromptsForReading(reading54KindId,reading54Kind):[];
  const reading54ReturnUnlocked=(id:string):boolean=>{
    const source=p54ById(id);
    const first=p54ComprehensionPrompts.find(p=>p.eventMetadata?.readingId===id);
    const ret=p54ReturnPrompts.find(p=>p.eventMetadata?.readingId===id);
    if(!source||!first||!ret||!source.units.includes(unitId))return false;
    if(known.has(traceIdJourney(ret)))return true;
    const initial=known.get(traceIdJourney(first));
    const due=initial?Date.parse(initial.card.due):NaN;
    if(Number.isFinite(due)&&due<=now)return true;
    return events.some(e=>e.metadata?.promptId===first.id&&
      (e.result==="correct"||e.result==="incorrect")&&
      e.metadata?.schedulerExcluded!==true&&
      Number.isFinite(Date.parse(e.occurredAt))&&Date.parse(e.occurredAt)<=now-86400000);
  };
  const lexicalId=focus.startsWith("lexical:")?
    focus.slice("lexical:".length):"";
  const lexicalInput=focus.startsWith("lexical-kind:")?
    focus.slice("lexical-kind:".length):"";
  const lexicalSplit=lexicalInput.lastIndexOf(":");
  const lexicalKindId=lexicalSplit>0?lexicalInput.slice(0,lexicalSplit):"";
  const lexicalKindName=lexicalSplit>0?lexicalInput.slice(lexicalSplit+1):"";
  const lexicalKind=(["meaning","production","return"] as const)
    .find(k=>k===lexicalKindName) as P53PracticeKind|undefined;
  const lexicalCues=lexicalId&&p53ById(lexicalId)?.units.includes(unitId)?
    p53PromptsForVocabulary(lexicalId):[];
  const lexicalKindCues=lexicalKind&&p53ById(lexicalKindId)?.units.includes(unitId)?
    p53PromptsForVocabulary(lexicalKindId,lexicalKind):[];
  // Read the existing owner-bound FSRS state; eligibility never creates a review.
  const lexicalReturnUnlocked=(id:string):boolean=>{
    const first=p53MeaningPrompts.find(p=>p.eventMetadata?.vocabularyId===id);
    const returned=p53ReturnPrompts.find(p=>p.eventMetadata?.vocabularyId===id);
    if(!first||!returned)return false;
    if(known.has(traceIdJourney(returned)))return true;
    const original=known.get(traceIdJourney(first));
    const due=original?Date.parse(original.card.due):NaN;
    if(Number.isFinite(due)&&due<=now)return true;
    return events.some(e=>e.metadata?.promptId===first.id&&
      (e.result==="correct"||e.result==="incorrect")&&e.metadata?.schedulerExcluded!==true&&
      Number.isFinite(Date.parse(e.occurredAt))&&Date.parse(e.occurredAt)<=now-86400000);
  };
  const transformId=focus.startsWith("transform:")?
    focus.slice("transform:".length):"";
  const transformInput=focus.startsWith("transform-kind:")?
    focus.slice("transform-kind:".length):"";
  const transformSplit=transformInput.lastIndexOf(":");
  const transformKindId=transformSplit>0?transformInput.slice(0,transformSplit):"";
  const transformKindName=transformSplit>0?transformInput.slice(transformSplit+1):"";
  const transformKind=(["transform","production","return"] as const)
    .find(k=>k===transformKindName) as P52PracticeKind|undefined;
  const transformCues=transformId&&p52ById(transformId)?.units.includes(unitId)?
    p52PromptsForTransformation(transformId):[];
  const transformKindCues=transformKind&&p52ById(transformKindId)?.units.includes(unitId)?
    p52PromptsForTransformation(transformKindId,transformKind):[];
  const contrastId=focus.startsWith("contrast:")?
    focus.slice("contrast:".length):"";
  const contrastInput=focus.startsWith("contrast-kind:")?
    focus.slice("contrast-kind:".length):"";
  const contrastSplit=contrastInput.lastIndexOf(":");
  const contrastKindId=contrastSplit>0?contrastInput.slice(0,contrastSplit):"";
  const contrastKindName=contrastSplit>0?contrastInput.slice(contrastSplit+1):"";
  const contrastKind=(["meaning","production","return"] as const)
    .find(k=>k===contrastKindName) as P51PracticeKind|undefined;
  const contrastCues=contrastId&&p51ById(contrastId)?.units.includes(unitId)?
    p51PromptsForContrast(contrastId):[];
  const contrastKindCues=contrastKind&&p51ById(contrastKindId)?.units.includes(unitId)?
    p51PromptsForContrast(contrastKindId,contrastKind):[];
  const integratedId=focus.startsWith("integrated:")?
    focus.slice("integrated:".length):"";
  const integratedInput=focus.startsWith("integrated-kind:")?
    focus.slice("integrated-kind:".length):"";
  const integratedSplit=integratedInput.lastIndexOf(":");
  const integratedKindId=integratedSplit>0?integratedInput.slice(0,integratedSplit):"";
  const integratedKindName=integratedSplit>0?integratedInput.slice(integratedSplit+1):"";
  const integratedKind=(["comprehension","vocabulary","writing","return"] as const)
    .find(k=>k===integratedKindName) as P50PracticeKind|undefined;
  const integratedCues=integratedId&&p50ById(integratedId)?.units.includes(unitId)?
    p50PromptsForMission(integratedId):[];
  const integratedKindCues=integratedKind&&p50ById(integratedKindId)?.units.includes(unitId)?
    p50PromptsForMission(integratedKindId,integratedKind):[];
  const documentId=focus.startsWith("document:")?
    focus.slice("document:".length):"";
  const documentInput=focus.startsWith("document-kind:")?
    focus.slice("document-kind:".length):"";
  const documentSplit=documentInput.lastIndexOf(":");
  const documentKindId=documentSplit>0?documentInput.slice(0,documentSplit):"";
  const documentKindName=documentSplit>0?documentInput.slice(documentSplit+1):"";
  const documentKind=(["comprehension","vocabulary","writing","return"] as const)
    .find(k=>k===documentKindName) as P49PracticeKind|undefined;
  const documentCues=documentId&&p49ById(documentId)?.units.includes(unitId)?
    p49PromptsForDocument(documentId):[];
  const documentKindCues=documentKind&&p49ById(documentKindId)?.units.includes(unitId)?
    p49PromptsForDocument(documentKindId,documentKind):[];
  const connectedId=focus.startsWith("connected:")?
    focus.slice("connected:".length):"";
  const connectedInput=focus.startsWith("connected-kind:")?
    focus.slice("connected-kind:".length):"";
  const connectedSplit=connectedInput.lastIndexOf(":");
  const connectedKindId=connectedSplit>0?connectedInput.slice(0,connectedSplit):"";
  const connectedKindPart=connectedSplit>0?connectedInput.slice(connectedSplit+1):"";
  const connectedKind=(["comprehension","writing","return"] as const)
    .find(k=>k===connectedKindPart) as P48PracticeKind|undefined;
  const connectedCues=connectedId&&p48ById(connectedId)?.units.includes(unitId)?
    p48PromptsForCase(connectedId):[];
  const connectedKindCues=connectedKind&&p48ById(connectedKindId)?.units.includes(unitId)?
    p48PromptsForCase(connectedKindId,connectedKind):[];
  const listeningId=focus.startsWith("listening:")?
    focus.slice("listening:".length):"";
  const listeningInput=focus.startsWith("listening-kind:")?
    focus.slice("listening-kind:".length):"";
  const listeningSplit=listeningInput.lastIndexOf(":");
  const listeningKindId=listeningSplit>0?listeningInput.slice(0,listeningSplit):"";
  const listeningKindName=listeningSplit>0?listeningInput.slice(listeningSplit+1):"";
  const listeningKind=(["comprehension","response","return"] as const)
    .find(k=>k===listeningKindName) as P47PracticeKind|undefined;
  const listeningCues=listeningId&&p47ById(listeningId)?.units.includes(unitId)?
    p47PromptsForScene(listeningId):[];
  const listeningKindCues=listeningKind&&p47ById(listeningKindId)?.units.includes(unitId)?
    p47PromptsForScene(listeningKindId,listeningKind):[];
  const readingId=focus.startsWith("reading:")?focus.slice("reading:".length):"";
  const readingKindInput=focus.startsWith("reading-kind:")?focus.slice("reading-kind:".length):"";
  const readingKindSep=readingKindInput.lastIndexOf(":");
  const readingKindId=readingKindSep>0?readingKindInput.slice(0,readingKindSep):"";
  const readingKindPart=readingKindSep>0?readingKindInput.slice(readingKindSep+1):"";
  const readingKind=(["comprehension","vocabulary","writing","return"] as const)
    .find(part=>part===readingKindPart);
  const readingCues=readingId&&p46ById(readingId)?.units.includes(unitId)?
    p46PromptsForReading(readingId):[];
  const readingKindCues=readingKind&&p46ById(readingKindId)?.units.includes(unitId)?
    p46PromptsForReading(readingKindId,readingKind):[];
  const independentId=focus.startsWith("independent:")?
    focus.slice("independent:".length):"";
  const independentCues=independentId&&p45ById(independentId)?.units.includes(unitId)?
    p45PromptsForChallenge(independentId):[];
  const pragmaticId=focus.startsWith("pragmatic:")?focus.slice("pragmatic:".length):"";
  const pragmaticInput=focus.startsWith("pragmatic-step:")?focus.slice("pragmatic-step:".length):"";
  const pragmaticSep=pragmaticInput.lastIndexOf(":");
  const pragmaticStepId=pragmaticSep>0?pragmaticInput.slice(0,pragmaticSep):"";
  const pragmaticStepPart=pragmaticSep>0?pragmaticInput.slice(pragmaticSep+1):"";
  const pragmaticStep=(["contrast","production","reply","return"] as const).find(s=>s===pragmaticStepPart) as P44PracticeStep|undefined;
  const pragmaticCues=pragmaticId&&p44ById(pragmaticId)?.unitIds.includes(unitId)?
    p44PromptsForCase(pragmaticId):[];
  const pragmaticStepCues=pragmaticStep&&p44ById(pragmaticStepId)?.unitIds.includes(unitId)?
    p44PromptsForCase(pragmaticStepId,pragmaticStep):[];
  const branchId=focus.startsWith("branch:")?focus.slice("branch:".length):"";
  const branchRouteInput=focus.startsWith("branch-route:")?focus.slice("branch-route:".length):"";
  const branchRouteColon=branchRouteInput.lastIndexOf(":");
  const branchRouteId=branchRouteColon>0?branchRouteInput.slice(0,branchRouteColon):"";
  const routePart=branchRouteColon>0?branchRouteInput.slice(branchRouteColon+1):"";
  const branchRouteKey=routePart==="direct"||routePart==="alternate"||routePart==="repair"?
    routePart as P43RouteKey:null;
  const branchCues=branchId&&p43SceneById(branchId)?.unitIds.includes(unitId)?
    p43BranchPrompts(branchId):[];
  const branchRouteCues=branchRouteKey&&p43SceneById(branchRouteId)?.unitIds.includes(unitId)?
    p43BranchPrompts(branchRouteId,branchRouteKey):[];
  const dialogueId=focus.startsWith("dialogue:")?focus.slice("dialogue:".length):"";
  const dialogueArc=dialogueId?(p40DialogueById(dialogueId)??p41ArcById(dialogueId)??p42ArcById(dialogueId)):undefined;
  const dialogueCues=dialogueArc?.units.includes(unitId)?
    (p40DialogueById(dialogueId)?p40PromptsForArc(dialogueId):
      p41ArcById(dialogueId)?p41PromptsForArc(dialogueId):p42PromptsForArc(dialogueId)):[];
  const returnId=focus.startsWith("return-due:")?focus.slice("return-due:".length):
    focus.startsWith("return:")?focus.slice("return:".length):"";
  const returnArc=returnId?(p40DialogueById(returnId)??p41ArcById(returnId)??p42ArcById(returnId)):undefined;
  const branchReturnScene=returnId?p43SceneById(returnId):undefined;
  const pragmaticReturn=returnId?p44ById(returnId):undefined;
  const independentReturn=returnId?p45ById(returnId):undefined;
  const readingReturn=returnId?p46ById(returnId):undefined;
  const listeningReturn=returnId?p47ById(returnId):undefined;
  const connectedReturn=returnId?p48ById(returnId):undefined;
  const documentReturn=returnId?p49ById(returnId):undefined;
  const integratedReturn=returnId?p50ById(returnId):undefined;
  const contrastReturn=returnId?p51ById(returnId):undefined;
  const transformationReturn=returnId?p52ById(returnId):undefined;
  const lexicalReturn=returnId?p53ById(returnId):undefined;
  const reading54Return=returnId?p54ById(returnId):undefined;
  const returnCue=returnArc?.units.includes(unitId)?
    [...p40ReturnPrompts,...p41ReturnPrompts,...p42ReturnPrompts].filter(p=>p.eventMetadata?.arcId===returnId):
    branchReturnScene?.unitIds.includes(unitId)?
    p43ReturnPrompts.filter(p=>p.eventMetadata?.sceneId===returnId):
    pragmaticReturn?.unitIds.includes(unitId)?
    p44ReturnPrompts.filter(p=>p.eventMetadata?.caseId===returnId):
    independentReturn?.units.includes(unitId)?
    p45ReturnPrompts.filter(p=>p.eventMetadata?.challengeId===returnId):
    readingReturn?.units.includes(unitId)?
    p46ReturnPrompts.filter(p=>p.eventMetadata?.readingId===returnId):
    listeningReturn?.units.includes(unitId)?
    p47ReturnPrompts.filter(p=>p.eventMetadata?.sceneId===returnId):
    connectedReturn?.units.includes(unitId)?
    p48ReturnPrompts.filter(p=>p.eventMetadata?.caseId===returnId):
    documentReturn?.units.includes(unitId)?
    p49ReturnPrompts.filter(p=>p.eventMetadata?.documentId===returnId):
    integratedReturn?.units.includes(unitId)?
    p50ReturnPrompts.filter(p=>p.eventMetadata?.missionId===returnId):
    contrastReturn?.units.includes(unitId)?
    p51ReturnPrompts.filter(p=>p.eventMetadata?.contrastId===returnId):
    transformationReturn?.units.includes(unitId)?
    p52ReturnPrompts.filter(p=>p.eventMetadata?.transformationId===returnId):
    lexicalReturn?.units.includes(unitId)&&lexicalReturnUnlocked(returnId)?
    p53ReturnPrompts.filter(p=>p.eventMetadata?.vocabularyId===returnId):
    reading54Return?.units.includes(unitId)&&reading54ReturnUnlocked(returnId)?
    p54ReturnPrompts.filter(p=>p.eventMetadata?.readingId===returnId):[];
  const relevant=reading54Id?reading54Cues
    :reading54KindId?(reading54Kind==="return"&&!reading54ReturnUnlocked(reading54KindId)?[]:reading54KindCues)
    :lexicalId?lexicalCues
    :lexicalKindId?(lexicalKind==="return"&&!lexicalReturnUnlocked(lexicalKindId)?[]:lexicalKindCues)
    :transformId?transformCues
    :transformKindId?transformKindCues
    :contrastId?contrastCues
    :contrastKindId?contrastKindCues
    :integratedId?integratedCues
    :integratedKindId?integratedKindCues
    :documentId?documentCues
    :documentKindId?documentKindCues
    :connectedId?connectedCues
    :connectedKindId?connectedKindCues
    :listeningId?listeningCues
    :listeningKindId?listeningKindCues
    :readingId?readingCues
    :readingKindId?readingKindCues
    :independentId?independentCues
    :pragmaticId?pragmaticCues
    :pragmaticStepId?pragmaticStepCues
    :branchId?branchCues
    :branchRouteId?branchRouteCues
    :dialogueId?dialogueCues
    :returnId?returnCue
    :focus==="register"?[...pragmatic,...relatedRegister]
    :focus==="transfer"?[
      ...transferForUnit(unitId),
      ...extras.filter(p=>(p.eventMetadata?.kind==="linked-lexicon"||
          p.eventMetadata?.kind==="cross-context-transfer"||
          p.eventMetadata?.kind==="cross-context-reformulation")&&
        Array.isArray(p.eventMetadata?.unitIds)&&p.eventMetadata.unitIds.includes(unitId))
    ]
    :focus==="grammar"?promptsForUnit(unitId,extras).filter(p=>
      p.skill==="form_selection"||p.eventMetadata?.kind==="register-contrast")
    :focus==="production"?promptsForUnit(unitId,extras).filter(p=>
      p.promptType==="typed"&&p.skill==="production")
    :promptsForUnit(unitId,extras);
  const latest=new Map<string,StudyEvent>();
  for(const e of events){
    if(typeof e.metadata?.promptId!=="string"||(e.result!=="correct"&&e.result!=="incorrect")||e.metadata?.schedulerExcluded===true)continue;
    const id=e.metadata.promptId,prev=latest.get(id);
    if(!prev||prev.occurredAt<e.occurredAt)latest.set(id,e);
  }
  const priority=(p:StudyPrompt):number=>{
    const trace=known.get(traceIdJourney(p));
    if(trace&&Date.parse(trace.card.due)<=now)return 3;
    if(latest.get(p.id)?.result==="incorrect")return 2;
    if(!trace)return 1;
    return 0;
  };
  // Do not silently substitute unrelated unit exercises for an empty specialist queue.
  const list=reading54Id||reading54KindId||lexicalId||lexicalKindId||transformId||transformKindId||contrastId||contrastKindId||integratedId||integratedKindId||documentId||documentKindId||connectedId||connectedKindId||listeningId||listeningKindId||readingId||readingKindId||independentId||dialogueId||branchId||branchRouteId||pragmaticId||pragmaticStepId?relevant.slice():relevant.slice().sort((a,b)=>priority(b)-priority(a));
  // Only FSRS-issued due timestamps establish that a card is due.
  // A last-incorrect event may warrant optional remediation but does not
  // override a future FSRS due date or silently turn new prompts into "due".
  const scheduledDue=(p:StudyPrompt)=>{
    const trace=known.get(traceIdJourney(p));
    return Boolean(trace&&Number.isFinite(Date.parse(trace.card.due))&&Date.parse(trace.card.due)<=now);
  };
  const selected=(focus==="review"||focus.startsWith("return-due:"))?list.filter(scheduledDue)
    :focus==="retry"?list.filter(p=>latest.get(p.id)?.result==="incorrect")
    :focus==="new"?list.filter(p=>!known.has(traceIdJourney(p))&&!latest.has(p.id))
    :list;
  const final=selected;
  return [journeyLessons["p27:unit:"+unit.id]!,...final.slice(0,14)];
}
