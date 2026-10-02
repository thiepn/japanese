import { listPrivateSentences } from "@thiepn/local-db";
import type { StudyPrompt } from "@thiepn/study-player";
import { AUTHENTIC_ACCOUNT_ID } from "../immerse/authentic";

export async function buildPrivateSentencePrompts():Promise<StudyPrompt[]>{
  const records=(await listPrivateSentences(AUTHENTIC_ACCOUNT_ID)).sort((a,b)=>a.createdAt.localeCompare(b.createdAt));
  return records.flatMap((record,index)=>[
    {
      id:"private-sentence-understand-"+record.id,
      primaryTarget:{kind:"sentence",id:record.id},
      skill:"comprehension",
      cueFamily:"private-sentence-ja-to-meaning",
      promptType:"choice",
      instruction:"Choose the meaning.",
      prompt:record.text,
      promptLanguage:"ja",
      choices:unique([record.translation,records[(index+1)%records.length]?.translation,records[(index+2)%records.length]?.translation,"Review the source sentence again."]),
      acceptedAnswers:[record.translation],
      displayAnswer:record.translation,
      explanation:"Mined from private authentic input.",
      contextId:"private-sentence-"+record.id,
      sourceId:"private-import",
      contentVersion:"private-sentence-v1"
    } satisfies StudyPrompt,
    {
      id:"private-sentence-produce-"+record.id,
      primaryTarget:{kind:"sentence",id:record.id},
      skill:"production",
      cueFamily:"private-meaning-to-sentence",
      promptType:"typed",
      instruction:"Write the mined Japanese sentence.",
      prompt:record.translation,
      promptLanguage:"en",
      placeholder:"日本語…",
      acceptedAnswers:[record.text],
      displayAnswer:record.text,
      explanation:"Mined from private authentic input.",
      contextId:"private-sentence-"+record.id,
      answerNormalization:"japanese",
      sourceId:"private-import",
      contentVersion:"private-sentence-v1"
    } satisfies StudyPrompt
  ]);
}
function unique(values:(string|undefined)[]):string[]{return [...new Set(values.filter((value):value is string=>Boolean(value)))].slice(0,4);}
