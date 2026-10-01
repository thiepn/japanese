import type { CourseUnit, GrammarConcept, Sentence } from "@thiepn/content-schema";
import type { StudyLesson, StudyPrompt, StudyStep } from "@thiepn/study-player";
import { a1CourseUnits, canDoDescriptor, coreContent, grammarConcept, sentenceRecord } from "../coreContent";

const SOURCE_ID="thiepn-original";

export interface CourseUnitView {
  unit:CourseUnit;
  canDo:string;
  grammar:GrammarConcept[];
  sentences:Sentence[];
}

export const a1Course:CourseUnitView[]=a1CourseUnits.map((unit)=>({
  unit,
  canDo:canDoDescriptor(unit.canDoId).statement,
  grammar:unit.grammarIds.map(grammarConcept),
  sentences:unit.sentenceIds.map(sentenceRecord)
}));

export const grammarLessons:Record<string,StudyLesson>=Object.fromEntries(
  coreContent.grammar.map((grammar)=>[grammarContext(grammar.id),makeGrammarLesson(grammar)])
);

export const sentenceLessons:Record<string,StudyLesson>=Object.fromEntries(
  coreContent.sentences.map((sentence)=>[sentenceContext(sentence.id),makeSentenceLesson(sentence)])
);

export const grammarMeaningPrompts:StudyPrompt[]=coreContent.grammar.map((grammar,index,all)=>({
  id:"grammar-meaning-"+grammar.id,
  primaryTarget:{kind:"grammar",id:grammar.id},
  skill:"comprehension",
  cueFamily:"grammar-label-to-function",
  promptType:"choice",
  instruction:"Choose the core function.",
  prompt:grammar.label,
  promptLanguage:"ja",
  choices:rotateChoices(uniqueChoices(grammar.summary,[3,7,11].map((offset)=>all[(index+offset)%all.length]?.summary)),index),
  acceptedAnswers:[grammar.summary],
  displayAnswer:grammar.summary,
  explanation:grammar.mentalModel,
  contextId:grammarContext(grammar.id),
  sourceId:SOURCE_ID,
  contentVersion:coreContent.version
}));

const CLOZE:Readonly<Record<string,{prompt:string;answer:string;choices:string[];explanation:string}>>={
  "grammar-desu":{prompt:"学生 ___。",answer:"です",choices:["です","ます","を","で"],explanation:"A noun predicate can end in polite です."},
  "grammar-wa-topic":{prompt:"名前 ___ 何ですか。",answer:"は",choices:["は","が","を","に"],explanation:"は marks 名前 as the topic of the question."},
  "grammar-ka-question":{prompt:"日本語が好きです ___。",answer:"か",choices:["か","を","で","と"],explanation:"Final か marks this polite sentence as a question."},
  "grammar-masu":{prompt:"本を読み ___。",answer:"ます",choices:["ます","です","ません","でした"],explanation:"読みます is the polite nonpast form used here."},
  "grammar-o-object":{prompt:"お茶 ___ 飲みます。",answer:"を",choices:["を","で","に","と"],explanation:"お茶 is the direct object of 飲みます, so it is marked by を."},
  "grammar-de-action-place":{prompt:"学校 ___ 日本語を話します。",answer:"で",choices:["で","に","を","が"],explanation:"The speaking action happens at school, so the action location takes で."},
  "grammar-ni-destination":{prompt:"駅 ___ 行きます。",answer:"に",choices:["に","で","を","と"],explanation:"駅 is the destination of movement, so it takes に."},
  "grammar-to-with":{prompt:"友達 ___ 話します。",answer:"と",choices:["と","を","が","に"],explanation:"The friend is the companion in the action, so と is used."},
  "grammar-mo-also":{prompt:"友達 ___ 学生です。",answer:"も",choices:["も","を","で","に"],explanation:"も adds the friend as another person who is a student."},
  "grammar-ga-subject":{prompt:"学校に先生 ___ います。",answer:"が",choices:["が","は","を","で"],explanation:"The person presented as existing is marked by が."},
  "grammar-aru-iru":{prompt:"家に本が ___。",answer:"あります",choices:["あります","います","行きます","です"],explanation:"本 is inanimate, so polite あります expresses its existence."},
  "grammar-suki-ga":{prompt:"本 ___ 好きです。",answer:"が",choices:["が","を","で","と"],explanation:"The liked thing is commonly marked by が with 好き."},
  "grammar-i-adj-polite":{prompt:"家は大きい ___。",answer:"です",choices:["です","ます","を","が"],explanation:"An い-adjective can be a predicate; です adds politeness."},
  "grammar-masen":{prompt:"今日は学校に行き ___。",answer:"ません",choices:["ません","ます","ました","です"],explanation:"行きません is the polite nonpast negative form."},
  "grammar-mashita":{prompt:"お茶を飲み ___。",answer:"ました",choices:["ました","ます","ません","です"],explanation:"飲みました reports a completed past action politely."}
};

export const grammarApplicationPrompts:StudyPrompt[]=coreContent.grammar.map((grammar,index)=>{
  const cloze=CLOZE[grammar.id];
  if(!cloze)throw new Error("MISSING_GRAMMAR_CLOZE:"+grammar.id);
  return {
    id:"grammar-form-"+grammar.id,
    primaryTarget:{kind:"grammar",id:grammar.id},
    skill:"form_selection",
    cueFamily:"grammar-context-cloze",
    promptType:"choice",
    instruction:"Complete the sentence.",
    prompt:cloze.prompt,
    promptLanguage:"ja",
    choices:rotateChoices(cloze.choices,index),
    acceptedAnswers:[cloze.answer],
    displayAnswer:cloze.answer,
    explanation:cloze.explanation,
    contextId:grammarContext(grammar.id),
    answerNormalization:"japanese",
    sourceId:SOURCE_ID,
    contentVersion:coreContent.version
  };
});

export const sentenceComprehensionPrompts:StudyPrompt[]=coreContent.sentences.map((sentence,index,all)=>({
  id:"sentence-understand-"+sentence.id,
  primaryTarget:{kind:"sentence",id:sentence.id},
  skill:"comprehension",
  cueFamily:"sentence-ja-to-meaning",
  promptType:"choice",
  instruction:"Choose the meaning.",
  prompt:sentence.text,
  promptLanguage:"ja",
  choices:rotateChoices(uniqueChoices(sentence.translation,[4,9,15].map((offset)=>all[(index+offset)%all.length]?.translation)),index),
  acceptedAnswers:[sentence.translation],
  displayAnswer:sentence.translation,
  explanation:(sentence.reading ?? sentence.text)+" — "+sentence.translation,
  contextId:sentenceContext(sentence.id),
  sourceId:SOURCE_ID,
  contentVersion:coreContent.version
}));

export const sentenceProductionPrompts:StudyPrompt[]=coreContent.sentences.map((sentence)=>({
  id:"sentence-produce-"+sentence.id,
  primaryTarget:{kind:"sentence",id:sentence.id},
  skill:"production",
  cueFamily:"meaning-to-sentence",
  promptType:"typed",
  instruction:"Write the Japanese sentence.",
  prompt:sentence.translation,
  promptLanguage:"en",
  placeholder:"日本語…",
  acceptedAnswers:[sentence.text,sentence.normalizedText],
  displayAnswer:sentence.text,
  ...(sentence.reading?{explanation:"Reading: "+sentence.reading}:{}),
  contextId:sentenceContext(sentence.id),
  answerNormalization:"japanese",
  sourceId:SOURCE_ID,
  contentVersion:coreContent.version
}));

export const allGrammarCoursePrompts:StudyPrompt[]=[
  ...grammarMeaningPrompts,...grammarApplicationPrompts,...sentenceComprehensionPrompts,...sentenceProductionPrompts
];

export const grammarCourseLessons:Record<string,StudyLesson>={...grammarLessons,...sentenceLessons};

export function courseUnitSession(unitId:string):StudyStep[]{
  const view=a1Course.find((item)=>item.unit.id===unitId);
  if(!view)throw new Error("UNKNOWN_COURSE_UNIT:"+unitId);
  const intro:StudyLesson={
    kind:"lesson",id:"lesson-"+unitId+"-intro",title:view.unit.title,
    body:view.canDo,contextId:unitId+"-intro",
    facts:[{label:"Level",value:view.unit.level},{label:"Grammar",value:String(view.grammar.length)},{label:"Sentences",value:String(view.sentences.length)}],
    sourceLabel:"THIEPN Japanese original A1 course"
  };
  const steps:StudyStep[]=[intro];
  for(const grammar of view.grammar){
    steps.push(grammarLessons[grammarContext(grammar.id)]!);
    const meaning=grammarMeaningPrompts.find((prompt)=>prompt.primaryTarget.id===grammar.id);
    const form=grammarApplicationPrompts.find((prompt)=>prompt.primaryTarget.id===grammar.id);
    if(meaning)steps.push(meaning);
    if(form)steps.push(form);
  }
  for(const sentence of view.sentences){
    steps.push(sentenceLessons[sentenceContext(sentence.id)]!);
    const comprehension=sentenceComprehensionPrompts.find((prompt)=>prompt.primaryTarget.id===sentence.id);
    if(comprehension)steps.push(comprehension);
  }
  const firstSentence=view.sentences[0];
  if(firstSentence){const production=sentenceProductionPrompts.find((prompt)=>prompt.primaryTarget.id===firstSentence.id);if(production)steps.push(production);}
  return steps;
}

export function courseUnitPrompts(unitId:string):StudyPrompt[]{
  const view=a1Course.find((item)=>item.unit.id===unitId);
  if(!view)return [];
  const grammarIds=new Set(view.unit.grammarIds);
  const sentenceIds=new Set(view.unit.sentenceIds);
  return allGrammarCoursePrompts.filter((prompt)=>
    (prompt.primaryTarget.kind==="grammar"&&grammarIds.has(prompt.primaryTarget.id))||
    (prompt.primaryTarget.kind==="sentence"&&sentenceIds.has(prompt.primaryTarget.id))
  );
}

export function isGrammarCoursePromptReady(prompt:StudyPrompt,traceIds:ReadonlySet<string>):boolean{
  if(prompt.primaryTarget.kind==="grammar"){
    if(prompt.skill==="form_selection")return traceIds.has("grammar:"+prompt.primaryTarget.id+":comprehension:grammar-label-to-function");
    return prerequisiteGrammarReady(prompt.primaryTarget.id,traceIds);
  }
  if(prompt.primaryTarget.kind==="sentence"){
    if(prompt.skill==="production")return traceIds.has("sentence:"+prompt.primaryTarget.id+":comprehension:sentence-ja-to-meaning");
    const sentence=sentenceRecord(prompt.primaryTarget.id);
    return sentence.grammarIds.every((id)=>hasAnyGrammarEvidence(id,traceIds));
  }
  return true;
}

export function nextCourseUnitId(traceIds:ReadonlySet<string>):string{
  for(const view of a1Course){
    const prompts=courseUnitPrompts(view.unit.id).filter((prompt)=>prompt.skill!=="production");
    if(prompts.some((prompt)=>!traceIds.has(traceIdFor(prompt))))return view.unit.id;
  }
  return a1Course.at(-1)?.unit.id ?? "a1-unit-01";
}

export function selectNewCoursePrompts(traceIds:ReadonlySet<string>,limit=2):StudyPrompt[]{
  const introducedVocabulary=[...traceIds].filter((id)=>id.startsWith("lexeme:")&&id.includes(":meaning_recognition:")).length;
  if(introducedVocabulary<2)return [];
  const selected:StudyPrompt[]=[];
  const pendingProduction=sentenceProductionPrompts.find((prompt)=>!traceIds.has(traceIdFor(prompt))&&isGrammarCoursePromptReady(prompt,traceIds));
  if(pendingProduction)selected.push(pendingProduction);
  if(selected.length>=limit)return selected;
  const unitId=nextCourseUnitId(traceIds);
  const candidates=courseUnitPrompts(unitId)
    .filter((prompt)=>prompt.skill!=="production"&&!traceIds.has(traceIdFor(prompt))&&isGrammarCoursePromptReady(prompt,traceIds))
    .sort((a,b)=>courseSkillOrder(a.skill)-courseSkillOrder(b.skill));
  for(const prompt of candidates){if(selected.length>=limit)break;selected.push(prompt);}
  return selected;
}

export function grammarContext(id:string):string{return "grammar-context-"+id;}
export function sentenceContext(id:string):string{return "sentence-context-"+id;}
export function traceIdFor(prompt:StudyPrompt):string{return prompt.primaryTarget.kind+":"+prompt.primaryTarget.id+":"+prompt.skill+":"+prompt.cueFamily;}

function prerequisiteGrammarReady(grammarId:string,traceIds:ReadonlySet<string>):boolean{
  return grammarConcept(grammarId).prerequisiteIds.every((id)=>hasAnyGrammarEvidence(id,traceIds));
}
function hasAnyGrammarEvidence(grammarId:string,traceIds:ReadonlySet<string>):boolean{
  return [...traceIds].some((id)=>id.startsWith("grammar:"+grammarId+":"));
}
function uniqueChoices(answer:string,values:(string|undefined)[]):string[]{
  return [...new Set([answer,...values.filter((value):value is string=>Boolean(value)&&value!==answer)])].slice(0,4);
}
function rotateChoices<T>(values:readonly T[],seed:number):T[]{
  if(values.length<2)return [...values];
  const offset=seed%values.length;
  return [...values.slice(offset),...values.slice(0,offset)];
}
function courseSkillOrder(skill:string):number{
  const order=["comprehension","form_selection","production"];
  const index=order.indexOf(skill);return index<0?order.length:index;
}
function makeGrammarLesson(grammar:GrammarConcept):StudyLesson{
  const examples=coreContent.sentences.filter((sentence)=>sentence.grammarIds.includes(grammar.id)).slice(0,3).map((sentence)=>({expression:sentence.text,note:sentence.translation}));
  return {
    kind:"lesson",id:"lesson-"+grammar.id,title:grammar.label,body:grammar.mentalModel,contextId:grammarContext(grammar.id),
    facts:[
      {label:"Core function",value:grammar.summary},
      {label:"Form",value:grammar.formation.join(" · "),language:"ja"},
      {label:"Register",value:grammar.register}
    ],
    examples,
    sourceLabel:"THIEPN Japanese original grammar synthesis"
  };
}
function makeSentenceLesson(sentence:Sentence):StudyLesson{
  return {
    kind:"lesson",id:"lesson-"+sentence.id,title:sentence.text,body:sentence.translation,contextId:sentenceContext(sentence.id),
    facts:[
      ...(sentence.reading?[{label:"Reading",value:sentence.reading,language:"ja" as const}]:[]),
      {label:"Level",value:sentence.level},
      {label:"Register",value:sentence.register}
    ],
    examples:sentence.tokens.filter((token)=>token.grammarRole).map((token)=>({expression:token.surface,note:token.grammarRole ?? ""})),
    sourceLabel:"THIEPN Japanese original sentence"
  };
}
