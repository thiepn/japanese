import type {StudyEvent} from "@thiepn/domain";
import type {StudyLesson,StudyPrompt,StudyStep} from "@thiepn/study-player";
import {coreContent} from "../coreContent";
import {a1Course,grammarLessons,grammarContext} from "./grammarCourse";

// E01 is original teaching content, not a Marugoto transcription or a second course.
// Only an existing source-backed A1 introduction Can-do may own its practice events.
const introduction=a1Course.find(({unit,canDo})=>unit.level==="A1"&&/introduc|name|meet|self.intro|greet/i.test(unit.title+" "+canDo));
export const E01_AVAILABLE=Boolean(introduction);
const unitId=introduction?.unit.id??"";
const canDoId=introduction?.unit.canDoId??"";
const originUnit=a1Course.find(({unit})=>unit.id==="a1-unit-05"&&unit.level==="A1");
const targetFor=(id:string)=>/origin|review-recall|delayed-production/.test(id)&&originUnit?originUnit.unit.canDoId:canDoId;
const SOURCE="thiepn-original";
const VERSION=coreContent.version;
const PREFIX="a1-e01-";
export type E01Status="not_started"|"learning"|"waiting"|"ready"|"reviewed";
export interface E01Progress{
  status:E01Status;answered:number;correct:number;unscored:number;stages:string[];
  canDo:string;unitId:string;reviewAvailableAt?:string;delayedCorrect:number;
}
type Stage="encounter"|"understand"|"discover"|"practice"|"communicate"|"independent"|"delayed";
function metadata(stage:Stage,additional:Record<string,unknown>={}):Record<string,unknown>{
  return {e01:true,e01Stage:stage,e01Original:true,e01UnitId:unitId,e01CanDoId:canDoId,...additional};
}
function card(id:string,title:string,body:string,examples:{expression:string;note:string}[]=[]):StudyLesson{
  return {kind:"lesson",id:PREFIX+id,title,body,contextId:PREFIX+id,examples,sourceLabel:"THIEPN original A1 teaching · existing Can-do "+canDoId};
}
function question(id:string,stage:Stage,prompt:string,choices:string[],answer:string,explanation:string,skill:"comprehension"|"form_selection"|"listening"):StudyPrompt{
  return {
    id:PREFIX+id,primaryTarget:{kind:"can_do",id:targetFor(id)},skill,
    cueFamily:PREFIX+id,promptType:"choice",instruction:stage==="encounter"?"Listen before choosing.":stage==="understand"?"Read and understand.":"Choose the natural response.",
    prompt,promptLanguage:stage==="encounter"?"en":"ja",
    choices,acceptedAnswers:[answer],displayAnswer:answer,explanation,
    sourceId:SOURCE,contentVersion:VERSION,contextId:PREFIX+"first-conversations",languageActivity:stage==="encounter"?"listening":"reading",
    eventMetadata:metadata(stage,{e01CanDoId:targetFor(id),automaticAssessment:"controlled-response"})
  };
}
function typed(id:string,stage:Stage,prompt:string,acceptedAnswers:string[],explanation:string):StudyPrompt{
  return {id:PREFIX+id,primaryTarget:{kind:"can_do",id:targetFor(id)},skill:"production",
    cueFamily:PREFIX+id,promptType:"typed",instruction:"Answer in Japanese without choices.",
    prompt,promptLanguage:"en",placeholder:"日本語で答えてください",
    acceptedAnswers,displayAnswer:acceptedAnswers[0]!,explanation,answerNormalization:"japanese",
    sourceId:SOURCE,contentVersion:VERSION,contextId:PREFIX+"first-conversations",languageActivity:"writing",
    eventMetadata:metadata(stage,{e01CanDoId:targetFor(id),automaticAssessment:"bounded-exact-answer",notFreeProduction:true})};
}
function listening(id:string,audio:string,options:string[],answer:string,explanation:string):StudyPrompt{
  const base=question(id,"encounter","Listen to the device Japanese voice. The words are hidden until feedback.",options,answer,explanation,"listening");
  return {...base,speechSynthesisText:audio,speechSynthesisLanguage:"ja-JP",
    eventMetadata:metadata("encounter",{e01CanDoId:targetFor(id),audioKind:"device-speech-synthesis",notNativeAudio:true,automaticAssessment:"controlled-listening"})};
}
function openResponse(id:string,kind:"speech"|"textarea",prompt:string,targets:string[],minimum:number):StudyPrompt{
  const basis={id:PREFIX+id,primaryTarget:{kind:"can_do" as const,id:targetFor(id)},skill:kind==="speech"?"production" as const:"writing_quality" as const,
    cueFamily:PREFIX+id,contextId:PREFIX+"first-conversations",instruction:kind==="speech"?"Speak your own introduction.":"Write an original introduction.",
    prompt,promptLanguage:"en" as const,placeholder:"日本語…",acceptedAnswers:[],displayAnswer:targets.join(" / "),
    explanation:kind==="speech"?"A recognized transcript is not a pronunciation or conversational proficiency score. Compare your meaning and politeness with the model.":"This check measures only structural targets and length, not meaning, naturalness or independent A1 certification.",
    answerNormalization:"japanese" as const,requiredTerms:targets,minimumCharacters:minimum,
    languageActivity:kind==="speech"?"spoken_production" as const:"writing" as const,
    sourceId:SOURCE,contentVersion:VERSION,
    eventMetadata:metadata("independent",{e01CanDoId:targetFor(id),nonAuthoritative:true,schedulerExcluded:true,structuralOnly:true,accreditedCefrVerdict:false,acousticScore:false})};
  return kind==="speech"?{...basis,promptType:"speech"}:{...basis,promptType:"textarea"};
}
const reviewSet=():StudyPrompt[]=>[
  question("review-context","communicate","山田：お名前は何ですか。\nあなた：＿＿＿＿",["私はミナです。","私は日本語です。","駅はどこですか。"],"私はミナです。","お名前 is someone's name; 私は〜です introduces yourself. Use a name, not a language.","comprehension"),
  typed("review-recall","independent","Someone asks where you are from. Give the complete model answer: 'I came from Korea.'",["韓国から来ました。","かんこくからきました。"],"から indicates the starting point or origin; 来ました is the polite past of 来ます."),
  question("review-followup","communicate","ミナ：はじめまして。よろしくお願いします。\nあなた：＿＿＿＿",["こちらこそ、よろしくお願いします。","いってきます。","おやすみなさい。"],"こちらこそ、よろしくお願いします。","こちらこそ returns the sentiment. いってきます is for leaving home; おやすみなさい is for night-time.","form_selection")
];
export const e01ReviewPrompts:StudyPrompt[]=introduction?reviewSet():[];

export function buildE01Journey():StudyStep[]{
  if(!introduction)throw new Error("E01_A1_INTRODUCTION_CAN_DO_NOT_FOUND");
  const steps:StudyStep[]=[
    card("orientation","A1 · First conversations","Goal: meet someone, exchange names, give a simple origin and respond politely. First listen without Japanese text; the original dialogues and corrections become available after you answer. This is guided beginner practice, not a validated speaking examination.",
      [{expression:"こんにちは",note:"Hello; an ordinary daytime greeting."},{expression:"はじめまして",note:"Used when meeting someone for the first time."}]),
    listening("hear-first","こんにちは。私は田中です。お名前は何ですか。",["The speaker introduces themselves and asks your name.","The speaker asks the time.","The speaker is buying a ticket."],"The speaker introduces themselves and asks your name.",
      "私は田中です = I am Tanaka. お名前は何ですか = What is your name? The topic marker は is pronounced wa."),
    card("encounter-reveal","Encounter · Tanaka meets someone","Read the original conversation now that you have listened. Do not memorize every word: notice what the question requires.",
      [{expression:"田中：こんにちは。私は田中です。お名前は何ですか。",note:"Hello. I'm Tanaka. What is your name?"},
       {expression:"ミナ：はじめまして。ミナです。よろしくお願いします。",note:"Nice to meet you. I'm Mina. I look forward to getting along with you."}]),
    question("meaning","understand","田中：お名前は何ですか。\n何を聞いていますか。",["Your name","Where you live","What time it is"],"Your name",
      "お名前 means someone's name and 何ですか asks what it is. お makes the question polite when asking another person's name.","comprehension"),
    card("discover-pattern","Discover · Build your introduction","Japanese commonly omits information already clear from context. 〜です is a polite noun sentence ending. は marks the topic and is pronounced わ. A short 「ミナです」 can sound more natural than repeating 「私は」 in every reply.",
      [{expression:"私はミナです。",note:"I am Mina; explicitly states the topic."},
       {expression:"ミナです。",note:"I'm Mina; natural when the subject is already clear."},
       {expression:"お名前は何ですか。",note:"Polite request for another person's name."}]),
  ];
  for(const id of ["grammar-desu","grammar-wa-topic","grammar-ka-question"]){
    const lesson=grammarLessons[grammarContext(id)];
    if(lesson)steps.push(lesson);
  }
  steps.push(
    question("choice-reply","practice","田中：お名前は何ですか。\nミナ：＿＿＿＿",["ミナです。","おいしいです。","十時です。"],"ミナです。",
      "A name answers お名前. おいしいです describes taste, while 十時です gives a time.","form_selection"),
    question("choice-politeness","practice","はじめまして。＿＿＿＿",["よろしくお願いします。","ごちそうさまでした。","ただいま。"],"よろしくお願いします。",
      "よろしくお願いします is appropriate during introductions. ごちそうさまでした follows a meal; ただいま announces arriving home.","form_selection"),
    typed("write-model","practice","Write a polite complete Japanese sentence: 'I am Mina.'",["私はミナです。","わたしはミナです。"],"Use 私は (topic) + name + です. In natural dialogue you can often omit 私は."),
    card("scene-two","Communicate · Introduce your origin","A new person introduces themselves. Follow the conversation, notice how から shows where someone comes from, then choose a suitable reply.",
      [{expression:"ユナ：はじめまして。ユナです。韓国から来ました。",note:"Nice to meet you. I'm Yuna. I came from Korea."},
       {expression:"ケン：ケンです。日本から来ました。よろしくお願いします。",note:"I'm Ken. I came from Japan. Nice to meet you."}]),
    listening("hear-origin","はじめまして。ユナです。韓国から来ました。よろしくお願いします。",["Yuna says she came from Korea.","Yuna says she lives in France.","Yuna asks the price."],"Yuna says she came from Korea.",
      "韓国から来ました means 'I came from Korea.' から marks origin and 来ました means came."),
    question("read-origin","understand","ユナ：韓国から来ました。\nどこから来ましたか。",["韓国","日本","フランス"],"韓国",
      "The country before から is the origin. 日本 is Japan and フランス is France.","comprehension"),
    question("reply-origin","communicate","ユナ：はじめまして。ユナです。よろしくお願いします。\nあなた：＿＿＿＿",["こちらこそ、よろしくお願いします。","またあした、先生。","お水をください。"],"こちらこそ、よろしくお願いします。",
      "こちらこそ reciprocates the greeting. The other choices mean 'see you tomorrow, teacher' and 'water please'.","form_selection"),
    card("less-support","Independent task · Less guidance","Now produce language without seeing answer choices. You can use your own name and country in the open tasks. Exact-answer practice below uses a model name solely for automatic checking. Open answers are recorded as unscored drafts."),
    ...reviewSet(),
    openResponse("independent-writing","textarea","Write at least two connected sentences introducing yourself and where you come from. Use your real details. The structure-only check is NOT a meaning score.",["です","から"],12),
    openResponse("independent-speaking","speech","Introduce yourself aloud in Japanese, give your country, and greet the listener. Browser speech recognition may fail or be unavailable; skip rather than inventing spoken mastery.",["です","から"],12),
    card("closing","Reflect and return later","Can you greet someone, ask a name, introduce yourself and respond appropriately without seeing a model? Review the corresponding native vocabulary and grammar in Today. A different delayed check becomes available after your first guided journey has had at least 20 hours to settle.")
  );
  return steps;
}
function delayedSet():StudyPrompt[]{
  return [
    listening("delayed-hear","こんにちは。山本です。お名前は何ですか。",["Yamamoto asks your name.","Yamamoto asks for your ticket.","Yamamoto asks where the station is."],"Yamamoto asks your name.",
      "Different speaker and name: お名前は何ですか still requests your name."),
    question("delayed-transfer","delayed","友達：はじめまして。私はケンです。\nあなた：＿＿＿＿",["はじめまして。ミナです。よろしくお願いします。","さようなら。","これはいくらですか。"],"はじめまして。ミナです。よろしくお願いします。",
      "Return the first-meeting greeting and introduce yourself. The other choices are goodbye and a price question.","form_selection"),
    typed("delayed-production","delayed","Without looking back, give a polite model response: 'I came from Japan.'",["日本から来ました。","にほんからきました。"],"日本から来ました uses origin + から + polite past 来ました.")
  ].map((p):StudyPrompt=>({...p,activity:"assessment" as const,eventMetadata:metadata("delayed",{e01CanDoId:p.primaryTarget.id,assessmentScope:"e01-delayed",automaticAssessment:"bounded-only",accreditedCefrVerdict:false})}));
}
export function getE01Progress(events:readonly StudyEvent[],now=new Date()):E01Progress{
  const e01=events.filter(e=>e.metadata?.e01===true&&String(e.metadata?.promptId??"").startsWith(PREFIX)&&canDoId);
  const guided=e01.filter(e=>e.metadata?.e01Stage!=="delayed"&&e.metadata?.nonAuthoritative!==true);
  const first=new Map<string,StudyEvent>();
  for(const event of [...guided].sort((a,b)=>a.occurredAt.localeCompare(b.occurredAt))){
    const id=String(event.metadata?.promptId??"");if(id&&!first.has(id))first.set(id,event);
  }
  const required=["a1-e01-hear-first","a1-e01-meaning","a1-e01-choice-reply","a1-e01-write-model","a1-e01-hear-origin","a1-e01-read-origin","a1-e01-reply-origin"];
  const completed=required.every(id=>first.has(id));
  const lastFirst=completed?Math.max(...required.map(id=>new Date(first.get(id)!.occurredAt).getTime())):NaN;
  const at=completed&&Number.isFinite(lastFirst)?new Date(lastFirst+20*60*60*1000):null;
  const delayed=e01.filter(e=>e.metadata?.e01Stage==="delayed");
  const delayedCorrect=new Set(delayed.filter(e=>e.result==="correct").map(e=>String(e.metadata?.promptId))).size;
  const status:E01Status=!e01.length?"not_started":delayedCorrect>=3?"reviewed":!at?"learning":at>now?"waiting":"ready";
  return {status,answered:guided.length,correct:guided.filter(e=>e.result==="correct").length,
    unscored:e01.filter(e=>e.metadata?.nonAuthoritative===true).length,
    stages:[...new Set(e01.map(e=>String(e.metadata?.e01Stage??"")).filter(Boolean))],
    canDo:introduction?.canDo??"A1 introductory exchange",unitId,
    ...(at?{reviewAvailableAt:at.toISOString()}:{}),delayedCorrect};
}
export function buildE01DelayedJourney(events:readonly StudyEvent[],now=new Date()):StudyStep[]{
  if(getE01Progress(events,now).status!=="ready"&&getE01Progress(events,now).status!=="reviewed")throw new Error("E01_DELAYED_REVIEW_NOT_READY");
  return [card("delayed-intro","A1 · Delayed transfer","The questions use different names and situations. This check records controlled performance, not a CEFR level or pronunciation score."),...delayedSet()];
}
