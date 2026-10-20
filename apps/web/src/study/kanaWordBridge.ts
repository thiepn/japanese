import type {StudyEvent} from "@thiepn/domain";
import type {StudyPrompt,StudyStep} from "@thiepn/study-player";
import {basicHiragana,basicKatakana} from "./foundationPrompts";
import {projectBeginnerOverview,projectKatakanaOverview} from "./beginnerCourse";
import {starterVocabulary,vocabularyApplicationPrompts,vocabularyLessons,vocabularyMeaningPrompts} from "./vocabulary";

type Script="hiragana"|"katakana";
type BridgeWord={
  id:string;form:string;meaning:string;script:Script;
  meaningPrompt:StudyPrompt;readingPrompt:StudyPrompt;activePrompt:StudyPrompt;
};
export type KanaWordBridgeOverview={
  eligible:number;learned:number;read:number;transferred:number;newWords:number;readyToRead:number;readyToUse:number;
  nextWord:string|null;available:boolean;
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
type WordProgress={word:BridgeWord;meaningCorrect:boolean;readingCorrect:boolean;activeCorrect:boolean;meaningAttempted:boolean;readingAttempted:boolean;activeAttempted:boolean};
function evidence(events:readonly StudyEvent[]):{correct:Set<string>;attempted:Set<string>}{
  const correct=new Set<string>(),attempted=new Set<string>();
  for(const event of events){
    if(event.primaryTarget?.kind!=="lexeme"||event.metadata?.nonAuthoritative===true)continue;
    if(event.result!=="correct"&&event.result!=="incorrect")continue;
    if(typeof event.metadata?.promptId!=="string")continue;
    const key=event.primaryTarget.id+"|"+event.metadata.promptId;
    attempted.add(key);
    if(event.result==="correct")correct.add(key);
  }
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
  return eligibleWords.filter(word=>[...word.form].every(kana=>allowed.has(word.script+":"+kana)))
    .map(word=>{
      const meaningKey=word.id+"|"+word.meaningPrompt.id;
      const readingKey=word.id+"|"+word.readingPrompt.id;
      const activeKey=word.id+"|"+word.activePrompt.id;
      return {word,meaningCorrect:correct.has(meaningKey),readingCorrect:correct.has(readingKey),
        activeCorrect:correct.has(activeKey),meaningAttempted:attempted.has(meaningKey),
        readingAttempted:attempted.has(readingKey),activeAttempted:attempted.has(activeKey)};
    });
}
export function projectKanaWordBridge(events:readonly StudyEvent[]):KanaWordBridgeOverview{
  const progress=progressedWords(events);
  const newWords=progress.filter(p=>!p.meaningAttempted);
  const readyToRead=progress.filter(p=>p.meaningCorrect&&!p.readingAttempted);
  const readyToUse=progress.filter(p=>p.meaningCorrect&&p.readingCorrect&&!p.activeAttempted);
  return {eligible:progress.length,learned:progress.filter(p=>p.meaningCorrect).length,
    read:progress.filter(p=>p.readingCorrect).length,
    transferred:progress.filter(p=>p.activeCorrect).length,
    newWords:newWords.length,readyToRead:readyToRead.length,readyToUse:readyToUse.length,
    nextWord:(readyToUse[0]??readyToRead[0]??newWords[0])?.word.form??null,
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
    steps.push({...lesson,body:"Read this word in kana. Then choose its meaning."});
    steps.push(entry.word.meaningPrompt);
  }
  return steps;
}
