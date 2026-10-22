import rawRegistry from "../../../../content/sources/registry.json";
import type {StudyEvent} from "@thiepn/domain";
import type {StudyLesson,StudyPrompt,StudyStep} from "@thiepn/study-player";
import {coreContent} from "../coreContent";
import {buildE02Journey,E02_AVAILABLE_SCENES} from "./a1ExcellenceCourse";

/**
 * C1 course pilot. This is an ordered projection of native StudyEvents, NOT a
 * second course progress store, grader, scheduler, or CEFR accreditation.
 * All teaching and new questions below are original THIEPN material.
 */
import {C2_A1_DAILY_ROUTINES} from "./c2A1DailyRoutine";
import {C3_A1_YESTERDAY} from "./c3A1Yesterday";
import {C3_A1_ORIGINS} from "./c3A1Origins";
import {C4_A1_PREFERENCES} from "./c4A1Preferences";
import {C4_A1_MEETING_TIMES} from "./c4A1MeetingTimes";
import {C5_A1_FAMILY} from "./c5A1Family";
import {C5_A1_CAFE} from "./c5A1Cafe";
import {validateAuthoredCourse,courseCoverage,isCourseFirstCapstone,type CourseFirstUnit as Unit,type CourseFirstLesson as Lesson,type EditorialRecord} from "./courseAuthoring";

export const C1_A1_UNITS:readonly Unit[]=[
 {id:"a1-unit-01",title:"Greetings and first contact",
  objective:"Choose appropriate greetings, acknowledge a speaker and open a polite conversation.",
  lessons:[
  {id:"cf-a1-01-01",title:"Greetings at different times",objective:"Distinguish morning, daytime and evening greetings.",
   teach:"Japanese greetings respond to time and the situation. おはようございます is polite in the morning; こんにちは is a daytime greeting, and こんばんは is used in the evening. おやすみなさい is said when going to bed, not when meeting someone in the evening.",
   examples:[["朝：おはようございます。","Morning: Good morning (polite)."],["昼：こんにちは。","Daytime: Hello."],["夜：こんばんは。","Evening: Good evening."],["寝る前：おやすみなさい。","Before bed: Good night."]],
   checks:[["At 8 a.m. you meet your instructor. What do you say?","おはようございます。","こんばんは。","おやすみなさい。","A polite morning greeting fits a morning meeting."],
    ["You enter a shop in the afternoon. Select a greeting.","こんにちは。","おやすみなさい。","いただきます。","こんにちは is a daytime greeting, not an expression before food."],
    ["You meet a neighbor after sunset. Select a greeting.","こんばんは。","おはようございます。","さようなら。","こんばんは is used as an evening greeting."],
    ["Someone says おやすみなさい before sleeping. What are they doing?","Saying good night","Ordering dinner","Greeting someone at noon","おやすみなさい is a bedtime expression."]],
   recall:["Write the polite Japanese morning greeting.","おはようございます。"],
   writing:"Write three short greetings for morning, daytime and evening in your own order."},
  {id:"cf-a1-01-02",title:"Everyday politeness",objective:"Respond to thanks, apologies and requests for attention.",
   teach:"ありがとうございます expresses thanks; どういたしまして is one possible response. すみません can get someone's attention or apologize lightly. いいえ can mean no or reject a mistaken assumption, but is not always the most natural reply to an apology.",
   examples:[["ありがとうございます。","Thank you (polite)."],["どういたしまして。","You're welcome."],["すみません。","Excuse me / Sorry."],["はい、どうぞ。","Yes, here you go."]],
   checks:[["A person hands you the item you requested. What do you say?","ありがとうございます。","こんばんは。","おやすみなさい。","Thank someone for helping you."],
    ["You need to get a staff member's attention. Select an expression.","すみません。","いただきます。","おはようございます。","すみません can politely attract attention."],
    ["Someone says ありがとうございます. Which reply is appropriate?","どういたしまして。","どこですか。","お名前は？","どういたしまして acknowledges thanks."],
    ["What is one common function of すみません?","Getting someone's attention","Introducing your hometown","Saying good night","すみません can mean excuse me as well as sorry."]],
   recall:["Write a polite Japanese expression of thanks.","ありがとうございます。"],
   writing:"Write a two-line exchange in which a stranger helps you and you thank them."},
  {id:"cf-a1-01-03",title:"Meeting for the first time",objective:"Use a first-meeting greeting and close it appropriately.",
   teach:"はじめまして is used when meeting someone for the first time, not every time you see them. よろしくお願いします often follows a self-introduction. It is a social expression of goodwill or anticipated cooperation, not a literal translation of 'nice to meet you' in every setting.",
   examples:[["はじめまして。","How do you do / Nice to meet you (first encounter)."],["ミナです。","I am Mina."],["よろしくお願いします。","I look forward to getting along with you."]],
   checks:[["You meet a classmate for the first time. Open the introduction.","はじめまして。","おやすみなさい。","いただきます。","はじめまして marks a first meeting."],
    ["Which phrase often closes a first introduction?","よろしくお願いします。","何時ですか。","お会計お願いします。","よろしくお願いします conveys goodwill and cooperation."],
    ["You greet a close friend for the fifth time today. Which description is correct?","はじめまして is not appropriate for this repeated meeting.","はじめまして must be repeated.","よろしくお願いします means goodbye.","はじめまして is specifically for first meetings."],
    ["Which sequence suits meeting someone new?","はじめまして → 名前です → よろしくお願いします","おやすみなさい → 名前です → いただきます","さようなら → おはよう → はじめまして","A first-meeting greeting, name, and closing goodwill make a simple introduction."]],
   recall:["Type the Japanese first-meeting greeting.","はじめまして。"],
   writing:"Introduce yourself to a new neighbor in at least two sentences. Use your own name."},
  {id:"cf-a1-01-04",title:"Understand a short exchange",objective:"Read a greeting exchange and infer its context.",
   teach:"In a dialogue, pay attention to time words and to the relationship between the speakers. A polite reply should match the register of the person who greeted you. Japanese often omits information already understood from the situation.",
   examples:[["先生：おはようございます。","Teacher: Good morning."],["学生：おはようございます。","Student: Good morning."],["店員：いらっしゃいませ。","Shop assistant: Welcome (to a customer)."],["客：すみません。","Customer: Excuse me."]],
   checks:[["先生：おはようございます。学生：＿＿＿","おはようございます。","おやすみなさい。","いらっしゃいませ。","The student returns the teacher's morning greeting."],
    ["Who is most likely to say いらっしゃいませ?","A shop employee greeting customers","A friend going to sleep","A student answering an exam","いらっしゃいませ is a service greeting."],
    ["At the shop, a customer says すみません. What are they probably doing?","Getting attention","Announcing bedtime","Saying their name","すみません may call for assistance."],
    ["Teacher and student both use おはようございます. What register is this?","Polite","Intentionally rude","A bedtime formula","ございます makes the greeting polite."]],
   recall:["Write what a student can reply to おはようございます.","おはようございます。"],
   writing:"Create a three-turn greeting between a visitor and someone working in a shop."},
  {id:"cf-a1-01-05",title:"Choose the correct social response",objective:"Transfer greetings to new contexts without relying on matching keywords.",
   teach:"Do not choose a response only because a familiar word appears. Identify whether the speaker is arriving, thanking you, or leaving. A first meeting needs a different reply from a familiar greeting; an evening arrival is not a bedtime farewell.",
   examples:[["A：はじめまして。B：はじめまして。","A and B are meeting for the first time."],["A：ありがとうございます。B：どういたしまして。","Thanks and acknowledgment."],["A：こんばんは。B：こんばんは。","Evening greeting and reply."]],
   checks:[["A：はじめまして。B：＿＿＿","はじめまして。","おやすみなさい。","いただきます。","A first-meeting greeting can be reciprocated."],
    ["A：ありがとうございます。B：＿＿＿","どういたしまして。","お名前は何ですか。","こんばんは。","The second person acknowledges thanks."],
    ["You arrive at a gathering at 7 p.m. Which opening suits the time?","こんばんは。","おやすみなさい。","さようなら。","Arriving in the evening calls for an evening greeting."],
    ["A stranger is leaving after a brief conversation. Which phrase is a farewell?","さようなら。","はじめまして。","いただきます。","さようなら can be used for a parting, though context affects naturalness."]],
   recall:["Type the Japanese word for 'good evening'.","こんばんは。"],
   writing:"Write a four-line original exchange with a greeting, a request for attention, thanks, and a suitable reply."},
  {id:"cf-a1-01-06",title:"First-contact communication challenge",
   scene:"greetings",objective:"Understand an original dialogue, produce greetings, and revisit the scene later."}
 ]},
 {id:"a1-unit-02",title:"Names and introductions",
  objective:"Exchange names, use the topic marker, ask a basic question, and give a short polite introduction.",
  lessons:[
  {id:"cf-a1-02-01",title:"Say your name",objective:"Introduce yourself with noun + です.",
   teach:"A simple polite introduction is 名前 + です. You can say 私は…です when the topic needs to be explicit, but Japanese often omits 私は when the speaker is clear. です is a polite copular ending in this pattern.",
   examples:[["ユナです。","I'm Yuna."],["私はユナです。","I am Yuna."],["ケンです。","I'm Ken."]],
   checks:[["How does Yuna introduce herself simply?","ユナです。","ユナをください。","ユナに行きます。","Name + です is a natural brief introduction."],
    ["私はケンです。 What information is provided?","The speaker's name is Ken.","Ken is going somewhere.","Ken asks a question.","私は…です gives the speaker's identity."],
    ["Which phrase is a polite statement of a name?","ミナです。","ミナか。","ミナを。","です completes a polite nominal statement."],
    ["If it is already clear you are speaking about yourself, which is acceptable?","ユナです。","ユナは何ですか。","ユナをです。","Japanese can omit a recoverable subject or topic."]],
   recall:["Type 'I am Ken' using the short polite Japanese form.","ケンです。"],
   writing:"Write a two-line self-introduction using your name and a polite closing."},
  {id:"cf-a1-02-02",title:"Ask another person's name",objective:"Ask a name using お名前 and 何ですか.",
   teach:"お名前は何ですか is a straightforward polite name question, though in natural conversations お名前は？ can also be used. 何 is read なん here. Do not assume the same question is appropriate in every relationship; avoid repeatedly addressing strangers as あなた.",
   examples:[["お名前は何ですか。","What is your name?"],["お名前は？","And your name? / Your name?"],["ケンです。","My name is Ken."]],
   checks:[["You politely ask a new classmate their name. Which question fits?","お名前は何ですか。","お名前をください。","お名前に行きます。","お名前は何ですか is a polite name question."],
    ["お名前は？ in a meeting typically asks for what?","A name","A destination","A price","The omitted predicate is understood from the context."],
    ["ケン：お名前は？ ユナ：＿＿＿","ユナです。","水です。","さようなら。","The reply should give the person's name."],
    ["What is the function of 何 in お名前は何ですか?","Asking what","Marking the speaker's name","A farewell","何 is the question word 'what'."]],
   recall:["Write the complete polite question 'What is your name?'","お名前は何ですか。"],
   writing:"Create an exchange where one person asks a name and the other answers with their own name."},
  {id:"cf-a1-02-03",title:"The topic marker は",objective:"Recognize and use the particle は for a topic.",
   teach:"The particle は marks the topic and is pronounced wa in this use. The topic is what the sentence is about; it does not always equal the grammatical subject. Compare 私はミナです and the shorter ミナです. Do not replace は with the word for yes (はい).",
   examples:[["私は学生です。","As for me, I am a student."],["ケンさんは先生です。","Ken is a teacher."],["お名前は何ですか。","What is your name?"]],
   checks:[["In 私は学生です, which particle marks the topic?","は","を","で","The は after 私 marks the topic."],
    ["When は is a topic particle, how is it pronounced?","wa","ha","he","The topic particle は is pronounced wa."],
    ["ケンさんは先生です。 Who is the topic?","Ken","Teacher","The listener","ケンさん precedes the topic marker."],
    ["Choose the correct sentence 'I am a student.'","私は学生です。","私を学生です。","私で学生です。","A topic noun can be followed by は before the predicate."]],
   recall:["Write the sentence 'I am a student' using 私 and the topic particle.","私は学生です。"],
   writing:"Write two original sentences with は: one about you and one about another named person."},
  {id:"cf-a1-02-04",title:"Polite yes/no questions",objective:"Use か to ask a simple polite yes/no question.",
   teach:"Adding か at the end of an appropriate polite sentence can turn a statement into a question. はい means yes, いいえ means no. Listen to or read the entire predicate rather than treating か as a standalone question. In conversation, negative answers can be softened.",
   examples:[["学生ですか。","Are you a student?"],["はい、学生です。","Yes, I am a student."],["いいえ、学生ではありません。","No, I am not a student (polite)."]],
   checks:[["学生ですか。 Which kind of sentence is this?","A polite question","A command","A greeting","か marks the polite question."],
    ["Someone asks 学生ですか. You are a student. Reply.","はい、学生です。","いいえ、学生です。","さようなら。","はい agrees with the question."],
    ["Which particle forms the question in ケンさんは先生ですか?","か","を","で","か follows the predicate to signal a question."],
    ["Which response means no?","いいえ。","はい。","どうぞ。","いいえ expresses no; はい expresses yes."]],
   recall:["Write the polite question 'Are you a student?'","学生ですか。"],
   writing:"Make two original polite yes/no exchanges, one with an affirmative answer and one with a negative."},
  {id:"cf-a1-02-05",title:"Introduce two people",objective:"Combine names, roles, questions, and social closing expressions.",
   teach:"When introducing people, give enough context to identify them, then use familiar patterns rather than translating English word for word. こちらは…です can introduce someone to a third person. In a first meeting, the other person may answer はじめまして and よろしくお願いします.",
   examples:[["こちらはユナさんです。","This is Yuna."],["ユナさんは学生です。","Yuna is a student."],["はじめまして。よろしくお願いします。","Nice to meet you. I look forward to getting along."]],
   checks:[["You present a new person named Yuna. Which expression works?","こちらはユナさんです。","ユナさんをください。","ユナさんに行きます。","こちらは…です introduces a person."],
    ["ケン：こちらはユナさんです。ユナ：＿＿＿","はじめまして。","おやすみなさい。","いただきます。","A first-meeting response fits the introduction."],
    ["ユナさんは学生です。 What is Yuna's role?","Student","Teacher","Shopkeeper","学生 is student."],
    ["A new colleague says よろしくお願いします. Which reply is natural?","こちらこそ、よろしくお願いします。","おやすみなさい。","お会計お願いします。","こちらこそ reciprocates the sentiment."]],
   recall:["Write 'This is Yuna' in polite Japanese with さん.","こちらはユナさんです。"],
   writing:"Write a four-turn meeting in which you introduce a third person, mention one role and end politely."},
  {id:"cf-a1-02-06",title:"Independent introduction challenge",
   scene:"personal",objective:"Understand a name-exchange dialogue, respond independently and schedule its existing delayed transfer."}
 ]},
] as const;

/** Original C1 lesson IDs remain stable; C2 expands the same native journey. */
export const C2_A1_UNITS:readonly Unit[]=[...C1_A1_UNITS,C2_A1_DAILY_ROUTINES];
export const C2_EDITORIAL_RECORDS:readonly EditorialRecord[]=C2_A1_UNITS.map(unit=>({
 unitId:unit.id,sourceId:"thiepn-original",level:"A1",rights:"original-owned",
 stageSequence:["encounter","explain","guided","read","transfer","independent"] as const,
 lessonObjectives:unit.lessons.map(x=>x.objective),grammarFocus:unit.id==="a1-unit-03"?
 ["grammar-masu","grammar-ni-destination"]:unit.id==="a1-unit-02"?
 ["grammar-desu","grammar-wa-topic","grammar-ka-question"]:["grammar-desu","grammar-ne"],
 recordedAudio:"none",synthesis:"device-only",independentWriting:"ungraded",
 linguisticReview:"pending",measuredStudyMinutes:null
}));
export const C2_COVERAGE_LEDGER=courseCoverage(C2_A1_UNITS,C2_EDITORIAL_RECORDS);

/** C3 expands the original sequential course without changing its first 18 IDs. */
export const C3_A1_UNITS:readonly Unit[]=[...C2_A1_UNITS,C3_A1_YESTERDAY,C3_A1_ORIGINS];
export const C3_EDITORIAL_RECORDS:readonly EditorialRecord[]=[
 ...C2_EDITORIAL_RECORDS,
 ...[C3_A1_YESTERDAY,C3_A1_ORIGINS].map(unit=>({
  unitId:unit.id,sourceId:"thiepn-original" as const,level:"A1" as const,rights:"original-owned" as const,
  stageSequence:["encounter","explain","guided","read","transfer","independent"] as const,
  lessonObjectives:unit.lessons.map(lesson=>lesson.objective),
  grammarFocus:unit.id==="a1-unit-04"?
   ["grammar-masu","grammar-ni-destination","grammar-mo-also"]:
   ["grammar-ka-question","grammar-masu","grammar-ni-destination"],
  recordedAudio:"none" as const,synthesis:"device-only" as const,independentWriting:"ungraded" as const,
  linguisticReview:"pending" as const,measuredStudyMinutes:null
 }))
];
export const C3_COVERAGE_LEDGER=courseCoverage(C3_A1_UNITS,C3_EDITORIAL_RECORDS);

/** Additional source-linked units; missing canonical 06 and 08–11 are NOT awarded. */
export const C4_A1_UNITS:readonly Unit[]=[...C3_A1_UNITS,C4_A1_PREFERENCES,C4_A1_MEETING_TIMES];
export const C4_EDITORIAL_RECORDS:readonly EditorialRecord[]=[
 ...C3_EDITORIAL_RECORDS,
 ...[C4_A1_PREFERENCES,C4_A1_MEETING_TIMES].map(unit=>({
  unitId:unit.id,sourceId:"thiepn-original" as const,level:"A1" as const,
  rights:"original-owned" as const,
  stageSequence:["encounter","explain","guided","read","transfer","independent"] as const,
  lessonObjectives:unit.lessons.map(lesson=>lesson.objective),
  grammarFocus:unit.id==="a1-unit-07"?
    ["grammar-wa-topic","grammar-ka-question","grammar-mo-also"]:
    ["grammar-wa-topic","grammar-ka-question"],
  recordedAudio:"none" as const,synthesis:"device-only" as const,
  independentWriting:"ungraded" as const,linguisticReview:"pending" as const,measuredStudyMinutes:null
 }))
];
export const C4_COVERAGE_LEDGER=courseCoverage(C4_A1_UNITS,C4_EDITORIAL_RECORDS);

/** Next verified E02 scenes: family=15 and food=16. Canonical 13/14 remain unclaimed. */
export const C5_A1_UNITS:readonly Unit[]=[...C4_A1_UNITS,C5_A1_FAMILY,C5_A1_CAFE];
export const C5_EDITORIAL_RECORDS:readonly EditorialRecord[]=[
 ...C4_EDITORIAL_RECORDS,
 ...[C5_A1_FAMILY,C5_A1_CAFE].map(unit=>({
  unitId:unit.id,sourceId:"thiepn-original" as const,level:"A1" as const,
  rights:"original-owned" as const,
  stageSequence:["encounter","explain","guided","read","transfer","independent"] as const,
  lessonObjectives:unit.lessons.map(lesson=>lesson.objective),
  grammarFocus:unit.id==="a1-unit-15"?
    ["grammar-desu","grammar-wa-topic"]:
    ["grammar-o-kudasai","grammar-o-object"],
  recordedAudio:"none" as const,synthesis:"device-only" as const,
  independentWriting:"ungraded" as const,linguisticReview:"pending" as const,measuredStudyMinutes:null
 }))
];
export const C5_COVERAGE_LEDGER=courseCoverage(C5_A1_UNITS,C5_EDITORIAL_RECORDS);
const byId=new Map(C5_A1_UNITS.flatMap(unit=>unit.lessons.map(lesson=>[lesson.id,{unit,lesson}] as const)));
const ORIGINAL_SOURCE="thiepn-original";
const anchors=new Map(E02_AVAILABLE_SCENES.map(scene=>[scene.id,scene]));
function canon(unit:Unit){const record=coreContent.courseUnits.find(x=>x.id===unit.id);
  if(!record||record.level!=="A1"||!coreContent.canDos.some(x=>x.id===record.canDoId))
    throw Error("C1_A1_CANONICAL_UNIT_UNAVAILABLE:"+unit.id);
  return record.canDoId;
}
const isCapstone=isCourseFirstCapstone;
function ids(unit:Unit,lesson:Lesson):readonly string[]{
 if(isCapstone(lesson))return ["hear","read","reply","recall"].map(k=>"a1-e02-"+lesson.scene+"-"+k);
 return lesson.checks.map((_,i)=>lesson.id+"-choice-"+(i+1)).concat(lesson.id+"-recall");
}
function matched(events:readonly StudyEvent[],unit:Unit,lesson:Lesson){
 const target=canon(unit),latest=new Map<string,StudyEvent>();
 for(const event of events){
  if(event.primaryTarget?.kind!=="can_do"||event.primaryTarget.id!==target||
    event.metadata?.nonAuthoritative===true)continue;
  const id=event.metadata?.promptId;
  if(typeof id!=="string"||!ids(unit,lesson).includes(id))continue;
  const prev=latest.get(id);
  if(!prev||event.occurredAt>=prev.occurredAt)latest.set(id,event);
 }
 return latest;
}
export interface C1A1LessonProgress{id:string;title:string;done:number;required:number;completed:boolean;unlocked:boolean;}
export interface C1A1UnitProgress{id:string;title:string;completed:number;total:number;lessons:C1A1LessonProgress[];}
export function projectC1A1Course(events:readonly StudyEvent[]):{units:C1A1UnitProgress[];nextId:string|null}{
 let prior=true,nextId:string|null=null;
 const units=C5_A1_UNITS.map(unit=>{
  const lessons=unit.lessons.map(lesson=>{
   const latest=matched(events,unit,lesson);
   const required=ids(unit,lesson);
   const done=required.filter(id=>latest.get(id)?.result==="correct").length;
   const completed=done===required.length;
   const unlocked=prior;
   if(!completed&&prior&&nextId===null)nextId=lesson.id;
   prior=prior&&completed;
   return {id:lesson.id,title:lesson.title,done,required:required.length,completed,unlocked};
  });
  return {id:unit.id,title:unit.title,completed:lessons.filter(x=>x.completed).length,total:lessons.length,lessons};
 });
 return {units,nextId};
}
export function buildC1A1CourseLesson(id:string,events:readonly StudyEvent[]):StudyStep[]{
 const pair=byId.get(id);if(!pair)throw Error("C1_A1_LESSON_NOT_FOUND:"+id);
 const state=projectC1A1Course(events);
 if(!state.units.some(u=>u.lessons.some(l=>l.id===id&&l.unlocked)))
   throw Error("C1_A1_LESSON_LOCKED:"+id);
 const {unit,lesson}=pair;
 if(isCapstone(lesson)){
  const scene=anchors.get(lesson.scene);
  if(!scene||scene.unitId!==unit.id)throw Error("C1_A1_SCENE_NOT_LINKED:"+lesson.scene);
  return buildE02Journey(lesson.scene); // Preserve native E02 prompt IDs, events and FSRS.
 }
 const target=canon(unit),latest=matched(events,unit,lesson);
 const introduction:StudyLesson={kind:"lesson",id:lesson.id+"-introduction",title:lesson.title,
  body:lesson.objective+" "+lesson.teach,contextId:lesson.id,sourceLabel:"THIEPN original teaching · "+ORIGINAL_SOURCE,
  examples:lesson.examples.map(([expression,note])=>({expression,note}))};
 const checks:StudyPrompt[]=lesson.checks.map(([prompt,answer,foil1,foil2,explanation],i)=>({
  id:lesson.id+"-choice-"+(i+1),primaryTarget:{kind:"can_do",id:target},skill:"comprehension",
  cueFamily:lesson.id+"-choice-"+(i+1),promptType:"choice",instruction:"Choose the answer that fits the context.",
  prompt,promptLanguage:"en",choices:[answer,foil1,foil2],acceptedAnswers:[answer],displayAnswer:answer,
  explanation,contextId:lesson.id,sourceId:ORIGINAL_SOURCE,contentVersion:coreContent.version,
  languageActivity:"reading",activity:"review",eventMetadata:{
   c1CourseFirst:true,c1LessonId:lesson.id,c1UnitId:unit.id,
   schedulerExcluded:true,accreditedCefrVerdict:false}
 }));
 const recall:StudyPrompt={
  id:lesson.id+"-recall",primaryTarget:{kind:"can_do",id:target},skill:"production",
  cueFamily:lesson.id+"-recall",promptType:"typed",instruction:"Recall the exact expression without choices.",
  prompt:lesson.recall[0],promptLanguage:"en",placeholder:"日本語…",
  acceptedAnswers:[lesson.recall[1],lesson.recall[1].replace(/。$/,"")],
  displayAnswer:lesson.recall[1],answerNormalization:"japanese",
  explanation:"Compare with the model. This checks an exact expression, not independent speaking competence.",
  contextId:lesson.id,sourceId:ORIGINAL_SOURCE,contentVersion:coreContent.version,
  languageActivity:"writing",activity:"review",
  eventMetadata:{c1CourseFirst:true,c1LessonId:lesson.id,c1UnitId:unit.id,
   schedulerExcluded:true,accreditedCefrVerdict:false}
 };
 const writing:StudyPrompt={
  id:lesson.id+"-independent",primaryTarget:{kind:"can_do",id:target},skill:"writing_quality",
  cueFamily:lesson.id+"-independent",promptType:"textarea",
  instruction:"Produce your own response. This task is ungraded.",
  prompt:lesson.writing,promptLanguage:"en",placeholder:"日本語で書いてください",
  acceptedAnswers:[],displayAnswer:"Independent writing — no automatic semantic score",
  answerNormalization:"japanese",contextId:lesson.id,
  sourceId:ORIGINAL_SOURCE,contentVersion:coreContent.version,languageActivity:"writing",activity:"writing",
  eventMetadata:{c1CourseFirst:true,c1LessonId:lesson.id,c1UnitId:unit.id,
    nonAuthoritative:true,schedulerExcluded:true,structuralOnly:true,
    independentCompetenceVerified:false,accreditedCefrVerdict:false}
 };
 // Native StudyEvents are the only checkpoint. Previously correct controlled
 // prompts need not be repeated after reopening an interrupted lesson.
 const pending=[...checks,recall].filter(p=>latest.get(p.id)?.result!=="correct");
 return [introduction,...(pending.length?pending:[...checks,recall]),writing];
}
export function validateC1A1Course():string[]{
 const errors:string[]=[],seen=new Set<string>();
 for(const unit of C1_A1_UNITS){
  try{canon(unit);}catch{errors.push("canonical-unit:"+unit.id);}
  if(unit.lessons.length!==6)errors.push("not-six-lessons:"+unit.id);
  for(const lesson of unit.lessons){
   if(seen.has(lesson.id))errors.push("duplicate:"+lesson.id);
   seen.add(lesson.id);
   if(isCapstone(lesson)){
    if(anchors.get(lesson.scene)?.unitId!==unit.id)errors.push("unlinked-capstone:"+lesson.id);
   }else if(lesson.checks.length<4||lesson.examples.length<3||!lesson.writing)
    errors.push("thin-lesson:"+lesson.id);
  }
 }
 return errors;
}

/** Strict publication gate: rights, objective map, 6-stage progression and native E02 anchors. */
export function validateC2A1Course():string[]{
 const targets=new Map(coreContent.courseUnits.filter(x=>x.level==="A1").map(x=>[x.id,x.canDoId]));
 const scenes=new Map(E02_AVAILABLE_SCENES.map(x=>[x.id,x.unitId]));
 const source=rawRegistry.sources.find(x=>x.id==="thiepn-original");
 return validateAuthoredCourse(C2_A1_UNITS,C2_EDITORIAL_RECORDS,targets,scenes,source?.publicExport===true);
}

/** C3 validation prevents publishing unlinked E02 scenes, malformed checks or rights claims. */
export function validateC3A1Course():string[]{
 const targets=new Map(coreContent.courseUnits.filter(x=>x.level==="A1").map(x=>[x.id,x.canDoId]));
 const scenes=new Map(E02_AVAILABLE_SCENES.map(x=>[x.id,x.unitId]));
 const source=rawRegistry.sources.find(x=>x.id==="thiepn-original");
 return validateAuthoredCourse(C3_A1_UNITS,C3_EDITORIAL_RECORDS,targets,scenes,source?.publicExport===true);
}

/** Original-source publication gate; absence of 06 and 08–11 remains a documented gap. */
export function validateC4A1Course():string[]{
 const targets=new Map(coreContent.courseUnits.filter(x=>x.level==="A1").map(x=>[x.id,x.canDoId]));
 const scenes=new Map(E02_AVAILABLE_SCENES.map(x=>[x.id,x.unitId]));
 const source=rawRegistry.sources.find(x=>x.id==="thiepn-original");
 return validateAuthoredCourse(C4_A1_UNITS,C4_EDITORIAL_RECORDS,targets,scenes,source?.publicExport===true);
}

/** C5 validation: original rights, all native can-do targets, six-step lessons and E02 continuity. */
export function validateC5A1Course():string[]{
 const targets=new Map(coreContent.courseUnits.filter(x=>x.level==="A1").map(x=>[x.id,x.canDoId]));
 const scenes=new Map(E02_AVAILABLE_SCENES.map(x=>[x.id,x.unitId]));
 const source=rawRegistry.sources.find(x=>x.id==="thiepn-original");
 return validateAuthoredCourse(C5_A1_UNITS,C5_EDITORIAL_RECORDS,targets,scenes,source?.publicExport===true);
}
