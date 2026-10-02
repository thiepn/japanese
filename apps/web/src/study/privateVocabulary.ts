import type { PrivateVocabularyRecord } from "@thiepn/local-db";
import { listPrivateVocabulary } from "@thiepn/local-db";
import type { StudyPrompt } from "@thiepn/study-player";
import { coreContent,senseForLexeme } from "../coreContent";
import { AUTHENTIC_ACCOUNT_ID } from "../immerse/authentic";

export interface PrivateVocabularyPromptSet {
  meaning:StudyPrompt[];
  application:StudyPrompt[];
  records:PrivateVocabularyRecord[];
}

export async function buildPrivateVocabularyPrompts():Promise<PrivateVocabularyPromptSet>{
  const records=(await listPrivateVocabulary(AUTHENTIC_ACCOUNT_ID)).sort((a,b)=>a.createdAt.localeCompare(b.createdAt));
  const canonicalDistractors=coreContent.lexemes.slice(0,40).map((lexeme)=>senseForLexeme(lexeme).glosses.join(" / "));
  const meaning=records.map((record,index)=>makeMeaningPrompt(record,index,records,canonicalDistractors));
  const application=records.flatMap((record)=>[
    ...(record.reading?[makeReadingPrompt(record)]:[]),
    makeActiveUsePrompt(record)
  ]);
  return {meaning,application,records};
}

function makeMeaningPrompt(record:PrivateVocabularyRecord,index:number,records:PrivateVocabularyRecord[],fallback:string[]):StudyPrompt{
  const distractors=[
    records[(index+1)%records.length]?.meaning,
    records[(index+3)%records.length]?.meaning,
    fallback[(index*7)%fallback.length]
  ].filter((value):value is string=>Boolean(value)&&value!==record.meaning);
  return {
    id:"private-vocab-meaning-"+record.id,primaryTarget:{kind:"lexeme",id:record.id},skill:"meaning_recognition",cueFamily:"private-written-to-meaning",
    promptType:"choice",instruction:"Choose the meaning.",prompt:record.canonicalForm,promptLanguage:"ja",
    choices:[...new Set([record.meaning,...distractors])].slice(0,4),acceptedAnswers:[record.meaning],displayAnswer:record.meaning,
    explanation:`${record.canonicalForm}${record.reading?`（${record.reading}）`:""} — ${record.meaning}. Mined from private authentic input.`,
    contextId:"private-vocab-"+record.id,sourceId:"private-import",contentVersion:"private-vocabulary-v1"
  };
}

function makeReadingPrompt(record:PrivateVocabularyRecord):StudyPrompt{
  return {
    id:"private-vocab-reading-"+record.id,primaryTarget:{kind:"lexeme",id:record.id},skill:"reading",cueFamily:"private-word-to-reading",
    promptType:"typed",instruction:"Type the reading in kana.",prompt:record.canonicalForm,promptLanguage:"ja",placeholder:"かな…",
    acceptedAnswers:[record.reading!],displayAnswer:record.reading!,answerNormalization:"japanese",
    explanation:`${record.canonicalForm} is read ${record.reading}.`,contextId:"private-vocab-"+record.id,sourceId:"private-import",contentVersion:"private-vocabulary-v1"
  };
}

function makeActiveUsePrompt(record:PrivateVocabularyRecord):StudyPrompt{
  return {
    id:"private-vocab-active-"+record.id,primaryTarget:{kind:"lexeme",id:record.id},skill:"active_use",cueFamily:"private-meaning-to-word",
    promptType:"typed",instruction:"Type the Japanese word.",prompt:record.meaning,promptLanguage:"en",placeholder:"日本語…",
    acceptedAnswers:[record.canonicalForm,...(record.reading?[record.reading]:[])],displayAnswer:record.reading?`${record.canonicalForm}（${record.reading}）`:record.canonicalForm,
    answerNormalization:"japanese",explanation:`${record.meaning} → ${record.canonicalForm}`,contextId:"private-vocab-"+record.id,sourceId:"private-import",contentVersion:"private-vocabulary-v1"
  };
}
