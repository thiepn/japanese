import type { StudyLesson,StudyPrompt } from "@thiepn/study-player";
import { coreContent,lexicalChunks,sentenceRecord,sourceTitle } from "../coreContent";

export const lexicalChunkMeaningPrompts:StudyPrompt[]=lexicalChunks.map((chunk,index,all)=>{
  const distractors=[5,13,29].map((offset)=>all[(index+offset)%all.length]?.meaning).filter((value):value is string=>Boolean(value)&&value!==chunk.meaning);
  return {
    id:"chunk-meaning-"+chunk.id,
    primaryTarget:{kind:"lexical_chunk",id:chunk.id},
    skill:"meaning_recognition",
    cueFamily:"chunk-to-meaning",
    promptType:"choice",
    instruction:"Choose the meaning of this Japanese chunk.",
    prompt:chunk.expression,
    promptLanguage:"ja",
    choices:[...new Set([chunk.meaning,...distractors])].slice(0,4),
    acceptedAnswers:[chunk.meaning],
    displayAnswer:chunk.meaning,
    explanation:chunk.expression+" — "+chunk.meaning,
    contextId:"chunk-"+chunk.id,
    answerNormalization:"default",
    sourceId:chunk.sourceIds[0]??"thiepn-original",
    contentVersion:coreContent.version,
    eventMetadata:{register:chunk.register,level:chunk.level,lexemeIds:chunk.lexemeIds,grammarIds:chunk.grammarIds}
  };
});

export const lexicalChunkActivePrompts:StudyPrompt[]=lexicalChunks.map((chunk)=>({
  id:"chunk-active-"+chunk.id,
  primaryTarget:{kind:"lexical_chunk",id:chunk.id},
  skill:"active_use",
  cueFamily:"meaning-to-chunk",
  promptType:"typed",
  instruction:"Produce the Japanese collocation or lexical chunk.",
  prompt:chunk.meaning,
  promptLanguage:"en",
  placeholder:"日本語…",
  acceptedAnswers:[chunk.expression,...(chunk.variants??[])],
  displayAnswer:chunk.expression+(chunk.reading?"（"+chunk.reading+"）":""),
  explanation:"Prefer the whole reusable phrase rather than translating word by word.",
  contextId:"chunk-"+chunk.id,
  answerNormalization:"japanese",
  sourceId:chunk.sourceIds[0]??"thiepn-original",
  contentVersion:coreContent.version,
  eventMetadata:{register:chunk.register,level:chunk.level,lexemeIds:chunk.lexemeIds,grammarIds:chunk.grammarIds}
}));

export const lexicalChunkPrompts:StudyPrompt[]=[...lexicalChunkMeaningPrompts,...lexicalChunkActivePrompts];

export const lexicalChunkLessons:Record<string,StudyLesson>=Object.fromEntries(lexicalChunks.map((chunk)=>{
  const examples=chunk.exampleSentenceIds.slice(0,3).map((id)=>{
    const sentence=sentenceRecord(id);
    return {expression:sentence.text,note:sentence.translation};
  });
  return ["chunk-"+chunk.id,{
    kind:"lesson" as const,
    id:"lesson-chunk-"+chunk.id,
    title:chunk.expression,
    body:"Learn this as one reusable phrase. P7 tracks the chunk separately from knowing its individual words so fluent combinations can become durable evidence.",
    contextId:"chunk-"+chunk.id,
    facts:[
      {label:"Meaning",value:chunk.meaning,language:"en" as const},
      {label:"Register",value:chunk.register,language:"en" as const},
      {label:"Level",value:chunk.level,language:"en" as const},
      ...(chunk.reading?[{label:"Reading",value:chunk.reading,language:"ja" as const}]:[])
    ],
    ...(examples.length?{examples}:{}),
    sourceLabel:sourceTitle(chunk.sourceIds[0]??"thiepn-original")
  }];
}));

export function lexicalFluencySession(limit=12):StudyPrompt[]{
  const selected=lexicalChunks.slice(0,Math.max(1,limit));
  const ids=new Set(selected.map((chunk)=>chunk.id));
  return lexicalChunkPrompts.filter((prompt)=>ids.has(prompt.primaryTarget.id));
}
