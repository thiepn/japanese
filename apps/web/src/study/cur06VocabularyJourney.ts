import type {StudyLesson,StudyPrompt,StudyStep} from "@thiepn/study-player";
import {coreContent,senseForLexeme,sourceTitle,canDoDescriptor,audioForLexeme} from "../coreContent";
import {vocabularyLessons,starterVocabulary} from "./vocabulary";
import {COURSE_LEVELS} from "./cefrCourseCatalog";
import registry from "../../../../content/sources/registry.json";

/** CUR-06 never authors Japanese corpus quotations: it refers to installed source IDs. */
export type Cur06Mode="explore"|"practice";
const PUBLIC_SOURCES=new Set(registry.sources.filter(source=>source.publicExport).map(source=>source.id));
type LinkedUnit=typeof coreContent.courseUnits[number];
type LinkedSentence=typeof coreContent.sentences[number];
export interface Cur06Coverage {
 lexemeId:string;word:string;reading:string;meaning:string;sourceIds:readonly string[];
 units:readonly {id:string;level:string;title:string;canDoId:string;sentenceIds:readonly string[]}[];
 attestedSentences:readonly {unitId:string;id:string;text:string;translation:string}[];
}
const checkSources=(ids:readonly string[],ownerId:string)=>{
 if(!ids.length||ids.some(id=>!PUBLIC_SOURCES.has(id)))throw Error("CUR06_SOURCE_NOT_AUTHORIZED:"+ownerId);
};
function sourceWord(id:string){
 const lexeme=coreContent.lexemes.find(x=>x.id===id);
 if(!lexeme)throw Error("CUR06_UNKNOWN_LEXEME:"+id);
 checkSources(lexeme.sourceIds,id);
 const sense=senseForLexeme(lexeme);
 const item=starterVocabulary.find(x=>x.lexeme.id===id);
 if(!item||!vocabularyLessons["vocab-"+id])throw Error("CUR06_NO_CANONICAL_VOCABULARY:"+id);
 return {lexeme,sense,item};
}
function linkedUnits(id:string):LinkedUnit[]{
 return [...coreContent.courseUnits].filter(unit=>unit.vocabularyIds.includes(id)).sort((a,b)=>a.order-b.order);
}
function attested(unit:LinkedUnit,word:string):LinkedSentence[]{
 // Match only the original Japanese text of sentences explicitly linked by this unit.
 return coreContent.sentences.filter(sentence=>unit.sentenceIds.includes(sentence.id)
   &&sentence.text.includes(word)&&sentence.sourceIds.length>0
   &&sentence.sourceIds.every(id=>PUBLIC_SOURCES.has(id)));
}
export function inspectCur06Word(id:string):Cur06Coverage{
 const {lexeme,item}=sourceWord(id);
 const units=linkedUnits(id);
 for(const unit of units){
  if(!COURSE_LEVELS.some(level=>level===unit.level))throw Error("CUR06_UNSUPPORTED_UNIT_LEVEL:"+unit.id);
  checkSources(unit.sourceIds,unit.id);
  const canDo=canDoDescriptor(unit.canDoId);
  checkSources(canDo.sourceIds,canDo.id);
 }
 return {
  lexemeId:id,word:item.lexeme.canonicalForm,reading:item.reading,meaning:item.meaning,
  sourceIds:lexeme.sourceIds,
  units:units.map(unit=>({id:unit.id,level:unit.level,title:unit.title,canDoId:unit.canDoId,
   sentenceIds:attested(unit,lexeme.canonicalForm).map(sentence=>sentence.id)})),
  attestedSentences:units.flatMap(unit=>attested(unit,lexeme.canonicalForm)
   .map(sentence=>({unitId:unit.id,id:sentence.id,text:sentence.text,translation:sentence.translation})))
 };
}
function lesson(id:string,title:string,body:string,source:string,facts:StudyLesson["facts"],examples?:StudyLesson["examples"]):StudyLesson{
 return {kind:"lesson",id,title,body,contextId:id,sourceLabel:source,
  ...(facts?{facts}:{}),...(examples?.length?{examples}:{})};
}
function prompt(id:string,wordId:string,instruction:string,question:string,answer:string,foils:readonly string[],
 notes:readonly string[],kind:"meaning"|"reading"):StudyPrompt{
 const {lexeme}=sourceWord(wordId);
 return {id,primaryTarget:{kind:"lexeme",id:wordId},skill:kind==="reading"?"reading":"meaning_recognition",
  cueFamily:"cur06-"+kind+"-guided",promptType:"choice",instruction,prompt:question,promptLanguage:kind==="reading"?"ja":"en",
  choices:[answer,...foils].filter((v,i,arr)=>arr.indexOf(v)===i),
  acceptedAnswers:[answer],displayAnswer:answer,
  explanation:kind==="reading"
   ?"Check the original reading listed for "+lexeme.canonicalForm+". This guided check does not schedule a review."
   :"Compare the installed lexical sense and each other source word, not merely the character shapes.",
  contextId:"cur06-"+wordId,sourceId:lexeme.sourceIds[0]!,contentVersion:coreContent.version,
  activity:"review",languageActivity:"reading",
  eventMetadata:{cur06:true,cur06WordId:wordId,nonAuthoritative:true,schedulerExcluded:true,
    independentCompetenceVerified:false,
    e06FoilFeedback:foils.map((response,i)=>({response,feedback:notes[i]??"This belongs to another original lexical entry."}))}};
}
function foilWords(id:string){
 const nearby=new Set(linkedUnits(id).flatMap(unit=>unit.vocabularyIds));
 const words=starterVocabulary.filter(item=>item.lexeme.id!==id&&nearby.has(item.lexeme.id));
 // Use distinct original senses/readings; fallback to other original public lexemes, never fabricated alternatives.
 const fallback=starterVocabulary.filter(item=>item.lexeme.id!==id);
 const valid=(item:typeof starterVocabulary[number])=>item.lexeme.sourceIds.length>0
  &&item.lexeme.sourceIds.every(source=>PUBLIC_SOURCES.has(source));
 return [...words,...fallback].filter(valid).filter((item,i,arr)=>arr.findIndex(x=>x.lexeme.id===item.lexeme.id)===i);
}
export function buildCur06VocabularyJourney(id:string,mode:Cur06Mode,focusUnitId?:string,contrastUnitId?:string):StudyStep[]{
 if(mode!=="explore"&&mode!=="practice")throw Error("CUR06_UNKNOWN_MODE");
 const {lexeme,item,sense}=sourceWord(id),coverage=inspectCur06Word(id);
 const units=linkedUnits(id);
 if(focusUnitId&&!units.some(u=>u.id===focusUnitId))throw Error("CUR06_UNLINKED_FOCUS_UNIT:"+focusUnitId);
 if(contrastUnitId&&(!focusUnitId||mode!=="practice"||contrastUnitId===focusUnitId||
    !units.some(u=>u.id===contrastUnitId)))throw Error("CUR07_INVALID_CONTRAST:"+contrastUnitId);
 const linked=contrastUnitId
   ?[units.find(u=>u.id===focusUnitId)!,units.find(u=>u.id===contrastUnitId)!]
   :focusUnitId?[units.find(u=>u.id===focusUnitId)!]:units;
 // Unbounded cross-unit browsing belongs to Explore, not a 20-page prerequisite to practice.
 // Practice includes the first native unit and a second distinct level when available.
 const far=linked.find(u=>u.level!==linked[0]?.level)??linked[linked.length-1];
 const picked=mode==="practice"&&linked.length>2
   ?[linked[0]!,...(far&&far.id!==linked[0]?.id?[far]:[])]
   :linked;
 const original=vocabularyLessons["vocab-"+id]!;
 const source=lexeme.sourceIds.map(sourceTitle).join(" · ");
 const context="cur06-"+id;
 const facts:StudyLesson["facts"]=[
  {label:"Japanese",value:lexeme.canonicalForm,language:"ja"},
  {label:"Reading",value:item.reading,language:"ja"},
  {label:"Recorded sense",value:sense.glosses.join(" / "),language:"en"},
  {label:"Original source",value:source,language:"en"}
 ];
 const start=lesson(context+"-distinction","Spelling, reading and meaning",
  "The Japanese spelling, the kana reading and the lexical meaning are different kinds of information. Read each field separately before choosing an answer. Any additional forms below come from the original lexeme—not guessed pronunciations.",
  source,facts,lexeme.forms.slice(0,5).map(form=>({expression:form.text,note:"Attested lexical form in the installed entry."})));
 const steps:StudyStep[]=[original,start];
 if(picked.length){
  for(const [n,unit] of picked.entries()){
   const canDo=canDoDescriptor(unit.canDoId);
   const examples=attested(unit,lexeme.canonicalForm).slice(0,3).map(sentence=>({
    expression:sentence.text,
    note:sentence.translation+(sentence.reading?" · Reading: "+sentence.reading:"")
   }));
   const compare=picked.length>1
    ?"Contrast this word's role here with the other original units in this journey. A shared word does not prove equal communicative demands or CEFR competence."
    :"Use the original unit's task and Can-do to distinguish context from isolated translation.";
   steps.push(lesson(context+"-unit-"+unit.id,unit.level+" · "+unit.title,
    "Canonical Can-do: "+canDo.statement+". "+compare+(examples.length
      ?" The Japanese lines below are exact original source-linked unit sentences that contain this word."
      :" This unit links the word, but has no verified sentence containing its exact spelling; no example has been invented."),
    unit.sourceIds.map(sourceTitle).join(" · "),
    [{label:"Canonical unit",value:unit.id},{label:"Course grouping",value:unit.level},
      {label:"Source Can-do",value:canDo.id}],
    examples));
   void n;
  }
  if(contrastUnitId&&picked.length===2){
   const a=picked[0]!,b=picked[1]!;
   const ac=canDoDescriptor(a.canDoId),bc=canDoDescriptor(b.canDoId);
   steps.push(lesson(context+"-compare-"+a.id+"-"+b.id,
    "Compare two authentic communication contexts",
    "You chose these two different original source units. Compare their documented Can-do aims and the attested Japanese sentences on the preceding screens. A word shared by both units does not alone establish linguistic proficiency or identical communicative function. Where no attested example exists, refrain from supplying a model sentence.",
    [a,b].flatMap(u=>u.sourceIds).map(sourceTitle).filter((v,i,arr)=>arr.indexOf(v)===i).join(" · "),
    [{label:a.level+" · "+a.title,value:ac.statement},{label:b.level+" · "+b.title,value:bc.statement}]));
  }
 }else{
  steps.push(lesson(context+"-unassigned","No original course-unit attribution",
   "This word is in the installed licensed lexicon but is not linked by any original CourseUnit.vocabularyIds. No unit level or Japanese example sentence is inferred.",
   source,[{label:"Course grouping",value:"Unassigned"}]));
 }
 // Pure exploration returns only StudyLessons: it writes NO StudyEvent and moves no FSRS due date.
 if(mode==="explore")return steps;
 const alternatives=foilWords(id);
 const meanings=alternatives.filter(x=>x.meaning!==item.meaning)
  .filter((x,i,a)=>a.findIndex(y=>y.meaning===x.meaning)===i).slice(0,2);
 const readings=alternatives.filter(x=>x.reading!==item.reading)
  .filter((x,i,a)=>a.findIndex(y=>y.reading===x.reading)===i).slice(0,2);
 if(meanings.length<2||readings.length<2)throw Error("CUR06_INSUFFICIENT_AUTHENTIC_FOILS:"+id);
 steps.push(prompt(context+"-meaning-check",id,"Guided meaning distinction (unscored)",
  "What does "+lexeme.canonicalForm+" mean in the installed lexical entry?",item.meaning,
  meanings.map(x=>x.meaning),meanings.map(x=>"That meaning belongs to "+x.lexeme.canonicalForm+
   " ("+x.reading+"), not to the selected word."),"meaning"));
 steps.push(prompt(context+"-reading-check",id,"Guided reading distinction (unscored)",
  "Which recorded kana reading belongs to "+lexeme.canonicalForm+"?",item.reading,
  readings.map(x=>x.reading),readings.map(x=>"That reading belongs to "+x.lexeme.canonicalForm+
   " ("+x.meaning+"). Compare the recorded spelling and reading."),"reading"));
 steps.push(lesson(context+"-independent-guide","Recall without selecting an answer",
  "The next two tasks remove the multiple-choice foils. Recall the word in kana and in Japanese independently. The self-check records only unscored practice, never FSRS mastery. For genuine scheduled review use Review selected due in Course.",
  source,[{label:"Study method",value:"Independent retrieval before seeing a model"}]));
 const metadata={cur06:true,cur06WordId:id,nonAuthoritative:true,schedulerExcluded:true,independentCompetenceVerified:false};
 steps.push({id:context+"-reading-recall",primaryTarget:{kind:"lexeme",id},skill:"reading",
  cueFamily:"cur06-independent-reading",promptType:"typed",instruction:"Independent kana recall (unscored)",
  prompt:lexeme.canonicalForm,promptLanguage:"ja",placeholder:"かな…",
  acceptedAnswers:lexeme.readings.map(r=>r.text),displayAnswer:item.reading,
  explanation:"Compare the kana you produced with the original recorded reading. This practice is not a scheduled FSRS review.",
  contextId:context,sourceId:lexeme.sourceIds[0]!,contentVersion:coreContent.version,
  activity:"review",languageActivity:"reading",answerNormalization:"japanese",eventMetadata:metadata});
 steps.push({id:context+"-word-recall",primaryTarget:{kind:"lexeme",id},skill:"active_use",
  cueFamily:"cur06-independent-word",promptType:"typed",instruction:"Independent Japanese word recall (unscored)",
  prompt:item.meaning,promptLanguage:"en",placeholder:"日本語…",
  acceptedAnswers:[...new Set([lexeme.canonicalForm,...lexeme.forms.map(f=>f.text),...lexeme.readings.map(r=>r.text)])],
  displayAnswer:lexeme.canonicalForm,explanation:"Compare your response with the original lexical entry; recognition or a bounded match is not proof of free production.",
  contextId:context,sourceId:lexeme.sourceIds[0]!,contentVersion:coreContent.version,
  activity:"review",languageActivity:"writing",answerNormalization:"japanese",eventMetadata:metadata});
 steps.push(lesson(context+"-transfer-guide","Use the word in your own situation",
  "Write a short Japanese exchange using this word, then compare its intended meaning and reading with the installed lexical entry and its original unit contexts. No automatic semantic or proficiency grade is awarded.",
  source,[{label:"Writing",value:"Optional independent self-review"}]));
 steps.push({id:context+"-own-context",primaryTarget:{kind:"lexeme",id},skill:"writing_quality",
  cueFamily:"cur06-independent-context",promptType:"textarea",instruction:"Your own context (ungraded)",
  prompt:"Write an original Japanese exchange using "+lexeme.canonicalForm+
   ". Check the word's meaning and your particle choices; treat this as self-review rather than a certified assessment.",
  promptLanguage:"en",placeholder:"日本語で書いてください…",acceptedAnswers:[],
  displayAnswer:"Self-review only.",explanation:"No automatic grade of communicative accuracy. Compare with the original licensed lexical and unit records.",
  contextId:context,sourceId:lexeme.sourceIds[0]!,contentVersion:coreContent.version,
  activity:"writing",languageActivity:"writing",eventMetadata:metadata});
 return steps;
}
