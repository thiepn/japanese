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
  needsRetry:number;
}

type ReadingAttempt={at:number;outcome:"correct"|"incorrect"|"unknown"};
function readingAttempts(events:readonly StudyEvent[]):Map<string,ReadingAttempt>{
  const canonical=new Set(pool.map(sentence=>sentence.id));
  const latest=new Map<string,ReadingAttempt>();
  for(const event of events){
    if(event.result!=="skipped"||event.primaryTarget?.kind!=="sentence")continue;
    const id=event.primaryTarget.id;
    if(!canonical.has(id)||event.metadata?.nonAuthoritative!==true
      ||event.metadata?.kanaSourceReadingContext!==true
      ||event.metadata?.promptId!==promptId(id))continue;
    const raw=event.metadata?.structuralResult;
    const outcome=raw==="correct"||raw==="incorrect"?raw:"unknown";
    const time=Date.parse(event.occurredAt);
    const at=Number.isFinite(time)?time:Number.NEGATIVE_INFINITY;
    const previous=latest.get(id);
    if(previous&&(at<previous.at||
      at===previous.at&&previous.outcome==="incorrect"&&outcome!=="incorrect"))continue;
    latest.set(id,{at,outcome});
  }
  return latest;
}
export function projectKanaReadingContext(events:readonly StudyEvent[]):KanaReadingContextOverview{
  const complete=projectBeginnerOverview(events).complete;
  const attempts=complete?readingAttempts(events):new Map<string,ReadingAttempt>();
  const needsRetry=[...attempts.values()].filter(attempt=>attempt.outcome==="incorrect").length;
  const remaining=complete?pool.length-attempts.size:0;
  return {available:complete&&pool.length>0&&(remaining>0||needsRetry>0),
    completed:attempts.size,total:pool.length,remaining,needsRetry};
}
const sensesByLexeme=new Map(coreContent.senses
  .filter(sense=>sense.sourceIds.includes("thiepn-original"))
  .map(sense=>[sense.lexemeId,sense.glosses] as const));
const grammarById=new Map(coreContent.grammar
  .filter(grammar=>grammar.sourceIds.includes("thiepn-original"))
  .map(grammar=>[grammar.id,grammar] as const));
function sourceExplanation(sentence:(typeof pool)[number]):string{
  const details:string[]=[];
  for(const token of sentence.tokens){
    const entity=token.entityRef;
    if(entity?.kind==="lexeme"){
      const glosses=sensesByLexeme.get(entity.id);
      if(glosses?.length)details.push(token.surface+(token.reading?" ("+token.reading+")":"")+" — "+glosses.join(" / "));
    }else if(entity?.kind==="grammar"){
      const grammar=grammarById.get(entity.id);
      if(grammar)details.push(token.surface+" — "+grammar.summary);
    }
  }
  // Include an original sentence-level grammar concept when it has no separate token.
  for(const id of sentence.grammarIds){
    const grammar=grammarById.get(id);
    if(grammar&&!sentence.tokens.some(token=>token.entityRef?.kind==="grammar"&&token.entityRef.id===id))
      details.push(grammar.label+" — "+grammar.summary);
  }
  return sentence.text+" — "+sentence.translation+
    (details.length?". Source: "+[...new Set(details)].join("; "):"");
}
function sourcePrompt(index:number):StudyPrompt{
  const sentence=pool[index]!;
  const distractors=pool.filter(item=>item.id!==sentence.id&&item.translation!==sentence.translation);
  const foilRecords=[1,3,5].map(offset=>distractors[(index+offset)%distractors.length])
    .filter((item):item is (typeof pool)[number]=>Boolean(item));
  const choices=[...new Set(foilRecords.map(item=>item.translation))];
  if(choices.length<3)throw new Error("A0_SOURCE_READING_CHOICES_INCOMPLETE:"+sentence.id);
  choices.splice(index%(choices.length+1),0,sentence.translation);
  // StudyPlayer already shows e06FoilFeedback only after an incorrect choice.
  // Each contrast is an original sentence with an authored reading and translation.
  const foilFeedback=foilRecords.map(item=>({
    response:item.translation,
    feedback:"That meaning belongs to "+item.reading+" ("+item.text+
      "), not "+sentence.reading+" ("+sentence.text+")."
  }));
  return {
    id:promptId(sentence.id),
    primaryTarget:{kind:"sentence",id:sentence.id},
    skill:"comprehension",cueFamily:"a0-source-sentence-reading-unscored",
    promptType:"choice",instruction:"Choose the meaning of this Japanese sentence.",
    prompt:sentence.reading!,promptLanguage:"ja",
    choices,acceptedAnswers:[sentence.translation],displayAnswer:sentence.translation,
    explanation:sourceExplanation(sentence),
    contextId:"a0-source-sentence-"+sentence.id,sourceId:sentence.sourceIds[0],
    contentVersion:coreContent.version,activity:"reading",languageActivity:"reading",
    eventMetadata:{nonAuthoritative:true,schedulerExcluded:true,kanaSourceReadingContext:true,
      e06FoilFeedback:foilFeedback}
  };
}
export function buildKanaReadingContext(events:readonly StudyEvent[]):StudyStep[]{
  const state=projectKanaReadingContext(events);
  if(!state.available)return [];
  const attempts=readingAttempts(events);
  const candidates=pool.map((sentence,index)=>({sentence,index}));
  const unseen=candidates.filter(item=>!attempts.has(item.sentence.id));
  const missed=candidates.filter(item=>attempts.get(item.sentence.id)?.outcome==="incorrect");
  return [...unseen,...missed].slice(0,2).map(item=>sourcePrompt(item.index));
}
