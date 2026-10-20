import type {StudyEvent} from "@thiepn/domain";
import type {StudyPrompt,StudyStep} from "@thiepn/study-player";
import {coreContent} from "../coreContent";
import {basicHiragana} from "./foundationPrompts";
import {projectBeginnerOverview} from "./beginnerCourse";

const basic=new Set(basicHiragana.map(seed=>seed.kana));
const punctuation=new Set(["。","、","！","？"," ","　"]);
const sourceSentences=coreContent.sentences.filter(sentence=>
  sentence.level==="A1"&&sentence.sourceIds.includes("thiepn-original")
  &&Boolean(sentence.reading&&sentence.translation.trim())
  &&[...sentence.reading!].every(char=>basic.has(char)||punctuation.has(char))
);
const pool=sourceSentences.filter(sentence=>new Set(sourceSentences.map(item=>item.translation)).size>=4);
const promptId=(id:string)=>"a0-source-reading-"+id;

export interface KanaReadingContextOverview {
  available:boolean;
  completed:number;
  total:number;
  remaining:number;
}

function encountered(events:readonly StudyEvent[]):Set<string>{
  const canonical=new Set(pool.map(sentence=>sentence.id));
  return new Set(events.filter(event=>event.result==="skipped"
    &&event.primaryTarget?.kind==="sentence"
    &&canonical.has(event.primaryTarget.id)
    &&event.metadata?.nonAuthoritative===true
    &&event.metadata?.kanaSourceReadingContext===true
    &&event.metadata?.promptId===promptId(event.primaryTarget.id))
    .map(event=>event.primaryTarget!.id));
}
export function projectKanaReadingContext(events:readonly StudyEvent[]):KanaReadingContextOverview{
  const complete=projectBeginnerOverview(events).complete;
  const done=complete?encountered(events):new Set<string>();
  return {available:complete&&done.size<pool.length&&pool.length>0,
    completed:done.size,total:pool.length,remaining:complete?pool.length-done.size:0};
}
function sourcePrompt(index:number):StudyPrompt{
  const sentence=pool[index]!;
  const distractors=pool.filter(item=>item.id!==sentence.id&&item.translation!==sentence.translation);
  const foils=[1,3,5].map(offset=>distractors[(index+offset)%distractors.length]?.translation)
    .filter((item):item is string=>Boolean(item));
  const choices=[...new Set(foils)];
  if(choices.length<3)throw new Error("A0_SOURCE_READING_CHOICES_INCOMPLETE:"+sentence.id);
  choices.splice(index%(choices.length+1),0,sentence.translation);
  return {
    id:promptId(sentence.id),
    primaryTarget:{kind:"sentence",id:sentence.id},
    skill:"comprehension",cueFamily:"a0-source-sentence-reading-unscored",
    promptType:"choice",instruction:"Choose the meaning of this Japanese sentence.",
    prompt:sentence.reading!,promptLanguage:"ja",
    choices,acceptedAnswers:[sentence.translation],displayAnswer:sentence.translation,
    explanation:sentence.text+" — "+sentence.translation,
    contextId:"a0-source-sentence-"+sentence.id,sourceId:sentence.sourceIds[0],
    contentVersion:coreContent.version,activity:"reading",languageActivity:"reading",
    eventMetadata:{nonAuthoritative:true,schedulerExcluded:true,kanaSourceReadingContext:true}
  };
}
export function buildKanaReadingContext(events:readonly StudyEvent[]):StudyStep[]{
  const state=projectKanaReadingContext(events);
  if(!state.available)return [];
  const done=encountered(events);
  return pool.map((sentence,index)=>({sentence,index}))
    .filter(item=>!done.has(item.sentence.id))
    .slice(0,2)
    .map(item=>sourcePrompt(item.index));
}
