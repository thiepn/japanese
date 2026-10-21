import type {StudyEvent} from "@thiepn/domain";
import type {StudyPrompt,StudyStep} from "@thiepn/study-player";
import {basicHiragana,basicKatakana} from "./foundationPrompts";
import {projectBeginnerOverview,projectKatakanaOverview} from "./beginnerCourse";
import {projectKanaReadingContext,type KanaReadingContextOverview} from "./kanaReadingContext";
import {starterVocabulary,vocabularyApplicationPrompts,vocabularyLessons,vocabularyMeaningPrompts} from "./vocabulary";

type Script="hiragana"|"katakana";
type BridgeWord={
  id:string;form:string;meaning:string;script:Script;
  meaningPrompt:StudyPrompt;readingPrompt:StudyPrompt;activePrompt:StudyPrompt;
};
export type KanaWordBridgeOverview={
  eligible:number;learned:number;read:number;transferred:number;newWords:number;readyToRead:number;readyToUse:number;pendingReview:number;
  available:boolean;readingContext:KanaReadingContextOverview;
};
const meaningById=new Map(vocabularyMeaningPrompts.map(prompt=>[prompt.primaryTarget.id,prompt] as const));
const readingById=new Map(vocabularyApplicationPrompts.filter(prompt=>prompt.skill==="reading")
  .map(prompt=>[prompt.primaryTarget.id,prompt] as const));
const activeById=new Map(vocabularyApplicationPrompts.filter(prompt=>prompt.skill==="active_use")
  .map(prompt=>[prompt.primaryTarget.id,prompt] as const));
const hira=new Set(basicHiragana.map(seed=>seed.kana));
const kata=new Set(basicKatakana.map(seed=>seed.kana));
const eligibleWords:BridgeWord[]=starterVocabulary.flatMap(item=>{
  const {lexeme}=item;
  if(!lexeme.id.startsWith("lex-")||!lexeme.sourceIds.includes("thiepn-original"))return [];
  const form=lexeme.canonicalForm;
  const script:Script|null=/^[ぁ-ゖ]+$/u.test(form)?"hiragana":/^[ァ-ヺ]+$/u.test(form)?"katakana":null;
  if(!script||![...form].every(kana=>(script==="hiragana"?hira:kata).has(kana)))return [];
  const meaningPrompt=meaningById.get(lexeme.id);
  const readingPrompt=readingById.get(lexeme.id);
  const activePrompt=activeById.get(lexeme.id);
  if(!meaningPrompt||!readingPrompt||!activePrompt)return [];
  return [{id:lexeme.id,form,meaning:item.meaning,script,meaningPrompt,readingPrompt,activePrompt}];
});
type WordProgress={word:BridgeWord;meaningCorrect:boolean;readingCorrect:boolean;activeCorrect:boolean;meaningAttempted:boolean;readingAttempted:boolean;activeAttempted:boolean;firstSightAttempted:boolean};
const kanaByForm=new Map([...basicHiragana,...basicKatakana].map(seed=>[seed.kana,seed.reading] as const));
function meaningPromptForBridge(word:BridgeWord):StudyPrompt{
  const original=word.meaningPrompt;
  if(original.promptType!=="choice")throw new Error("A0_SOURCE_WORD_MEANING_CHOICE_MISSING:"+word.id);
  const correct=original.acceptedAnswers[0];
  if(!correct||!original.choices.includes(correct))
    throw new Error("A0_SOURCE_WORD_ANSWER_MISSING:"+word.id);
  const position=eligibleWords.findIndex(entry=>entry.id===word.id);
  if(position<0)throw new Error("A0_SOURCE_WORD_IDENTITY_MISSING:"+word.id);
  if(original.choices.length<2)throw new Error("A0_SOURCE_WORD_DISTRACTORS_MISSING:"+word.id);
  const choices=original.choices.filter(choice=>choice!==correct);
  // Every new word requires choosing past at least one original distractor.
  choices.splice(position%(original.choices.length-1)+1,0,correct);
  return {...original,choices};
}
function firstSightPrompt(word:BridgeWord):StudyPrompt{
  const sounds=[...word.form].map(char=>{
    const sound=kanaByForm.get(char);
    if(!sound)throw new Error("MISSING_AUTHORED_KANA_SOUND:"+char);
    return sound;
  });
  const romaji=sounds.join("");
  return {
    id:"a0-kana-first-sight-"+word.id,
    primaryTarget:word.meaningPrompt.primaryTarget,
    skill:"reading",
    cueFamily:"a0-kana-first-sight-unscored",
    promptType:"typed",
    instruction:"Read this unfamiliar word in romaji.",
    prompt:word.form,promptLanguage:"ja",placeholder:"Romaji…",
    acceptedAnswers:[romaji],displayAnswer:romaji,answerNormalization:"romaji",
    explanation:[...word.form].map((char,index)=>char+" ("+sounds[index]+")").join(" + ")+" → "+romaji+
      ". This checks basic kana transcription, not pronunciation or vocabulary mastery.",
    contextId:"a0-kana-first-sight-"+word.id,
    ...(word.meaningPrompt.sourceId?{sourceId:word.meaningPrompt.sourceId}:{}),
    contentVersion:word.meaningPrompt.contentVersion,
    activity:"reading",
    eventMetadata:{nonAuthoritative:true,schedulerExcluded:true,kanaWordFirstSight:true}
  };
}
function evidence(events:readonly StudyEvent[]):{correct:Set<string>;attempted:Set<string>}{
  // IndexedDB getAll() is ordered by record key, not by when a review occurred.
  // A later incorrect canonical answer must not be overridden by an older pass.
  const latest=new Map<string,StudyEvent>();
  for(const event of events){
    if(event.primaryTarget?.kind!=="lexeme"||event.metadata?.nonAuthoritative===true)continue;
    if(event.result!=="correct"&&event.result!=="incorrect")continue;
    if(typeof event.metadata?.promptId!=="string")continue;
    const key=event.primaryTarget.id+"|"+event.metadata.promptId;
    const previous=latest.get(key);
    if(previous){
      const time=Date.parse(event.occurredAt),previousTime=Date.parse(previous.occurredAt);
      const current=Number.isFinite(time)?time:Number.NEGATIVE_INFINITY;
      const prior=Number.isFinite(previousTime)?previousTime:Number.NEGATIVE_INFINITY;
      if(current<prior)continue;
      // Equal timestamps are ambiguous; prefer a lapse to an unearned unlock.
      if(current===prior&&previous.result==="incorrect"&&event.result==="correct")continue;
    }
    latest.set(key,event);
  }
  const attempted=new Set(latest.keys()),correct=new Set<string>();
  for(const [key,event] of latest)if(event.result==="correct")correct.add(key);
  return {correct,attempted};
}
function progressedWords(events:readonly StudyEvent[]):WordProgress[]{
  const hiraganaStages=projectBeginnerOverview(events).stages;
  const katakanaStages=projectKatakanaOverview(events).stages;
  const allowed=new Set<string>();
  for(const [script,stages,seeds] of [
    ["hiragana",hiraganaStages,basicHiragana],
    ["katakana",katakanaStages,basicKatakana]
  ] as const){
    for(const stage of stages){
      if(!stage.completed)continue;
      for(const seed of seeds)if(seed.group===stage.id)allowed.add(script+":"+seed.kana);
    }
  }
  const {correct,attempted}=evidence(events);
  const firstSightAttempts=new Set(events.filter(event=>event.result==="skipped"
    &&event.primaryTarget?.kind==="lexeme"
    &&event.metadata?.nonAuthoritative===true
    &&event.metadata?.kanaWordFirstSight===true
    &&event.metadata?.promptId==="a0-kana-first-sight-"+event.primaryTarget.id)
    .map(event=>event.primaryTarget!.id));
  return eligibleWords.filter(word=>[...word.form].every(kana=>allowed.has(word.script+":"+kana)))
    .map(word=>{
      const meaningKey=word.id+"|"+word.meaningPrompt.id;
      const readingKey=word.id+"|"+word.readingPrompt.id;
      const activeKey=word.id+"|"+word.activePrompt.id;
      return {word,meaningCorrect:correct.has(meaningKey),readingCorrect:correct.has(readingKey),
        activeCorrect:correct.has(activeKey),meaningAttempted:attempted.has(meaningKey),
        readingAttempted:attempted.has(readingKey),activeAttempted:attempted.has(activeKey),
        firstSightAttempted:firstSightAttempts.has(word.id)};
    });
}
function needsCanonicalReview(p:WordProgress):boolean{
  return (p.meaningAttempted&&!p.meaningCorrect)
    ||(p.meaningCorrect&&p.readingAttempted&&!p.readingCorrect)
    ||(p.meaningCorrect&&p.readingCorrect&&p.activeAttempted&&!p.activeCorrect);
}
export function buildKanaWordSourceRepair(events:readonly StudyEvent[]):StudyStep[]{
  // Reopen original authored word explanations, never a premature graded retry.
  // A word is available only after its original cue has actually been attempted
  // and its latest canonical result still requires the existing FSRS review.
  return progressedWords(events).filter(needsCanonicalReview).map(entry=>{
    const lesson=vocabularyLessons[entry.word.meaningPrompt.contextId??""];
    if(!lesson)throw new Error("MISSING_SOURCE_VOCABULARY_LESSON:"+entry.word.id);
    return lesson;
  });
}
export function projectKanaWordBridge(events:readonly StudyEvent[]):KanaWordBridgeOverview{
  const progress=progressedWords(events);
  const newWords=progress.filter(p=>!p.meaningAttempted);
  const readyToRead=progress.filter(p=>p.meaningCorrect&&!p.readingAttempted);
  const readyToUse=progress.filter(p=>p.meaningCorrect&&p.readingCorrect&&!p.activeAttempted);
  const pendingReview=progress.filter(needsCanonicalReview);
  return {eligible:progress.length,learned:progress.filter(p=>p.meaningCorrect).length,
    read:progress.filter(p=>p.readingCorrect).length,
    transferred:progress.filter(p=>p.activeCorrect).length,
    newWords:newWords.length,readyToRead:readyToRead.length,readyToUse:readyToUse.length,
    pendingReview:pendingReview.length,
    readingContext:projectKanaReadingContext(events),
    available:newWords.length>0||readyToRead.length>0||readyToUse.length>0};
}
export function buildKanaWordBridge(events:readonly StudyEvent[]):StudyStep[]{
  const progress=progressedWords(events);
  const transfer=progress.filter(p=>p.meaningCorrect&&p.readingCorrect&&!p.activeAttempted).slice(0,2);
  const reading=progress.filter(p=>p.meaningCorrect&&!p.readingAttempted).slice(0,2);
  const introductions=progress.filter(p=>!p.meaningAttempted).slice(0,2);
  const steps:StudyStep[]=[];
  // These are the existing meaning, reading, active-use staging prerequisites.
  for(const entry of transfer)steps.push(entry.word.activePrompt);
  for(const entry of reading)steps.push(entry.word.readingPrompt);
  for(const entry of introductions){
    const lesson=vocabularyLessons[entry.word.meaningPrompt.contextId??""];
    if(!lesson)throw new Error("MISSING_SOURCE_VOCABULARY_LESSON:"+entry.word.id);
    // First encounter checks decoding before the canonical lesson reveals meaning.
    // Its event is explicitly unscored and never updates the FSRS scheduler.
    if(!entry.firstSightAttempted)steps.push(firstSightPrompt(entry.word));
    steps.push({...lesson,body:"Read this word in kana. Then choose its meaning."});
    steps.push(meaningPromptForBridge(entry.word));
  }
  return steps;
}
