import type { Lexeme } from "@thiepn/content-schema";
import type { StudyLesson, StudyPrompt } from "@thiepn/study-player";
import { coreContent, kanjiForLexeme, senseForLexeme, sourceTitle, starterLexemes } from "../coreContent";

export interface VocabularyStudyItem {
  lexeme: Lexeme;
  meaning: string;
  reading: string;
}

export const starterVocabulary: VocabularyStudyItem[] = starterLexemes.map((lexeme)=>({
  lexeme,
  meaning:senseForLexeme(lexeme).glosses.join(" / "),
  reading:lexeme.readings[0]?.text ?? lexeme.canonicalForm
}));

export const vocabularyMeaningPrompts: StudyPrompt[] = starterVocabulary.map((item,index,all)=>makeMeaningPrompt(item,index,all));
export const vocabularyApplicationPrompts: StudyPrompt[] = starterVocabulary.flatMap((item)=>[
  makeReadingPrompt(item),
  makeActiveUsePrompt(item)
]);
export const vocabularyLessons: Record<string,StudyLesson> = Object.fromEntries(starterVocabulary.map((item)=>[
  contextId(item.lexeme),
  makeVocabularyLesson(item.lexeme)
]));

export const VOCABULARY_TOTAL = starterVocabulary.length;

function makeMeaningPrompt(item:VocabularyStudyItem,index:number,all:readonly VocabularyStudyItem[]):StudyPrompt {
  const distractors=[3,7,13].map((offset)=>all[(index+offset)%all.length]?.meaning).filter((value):value is string=>Boolean(value)&&value!==item.meaning);
  return {
    id:`vocab-meaning-${item.lexeme.id}`,
    primaryTarget:{kind:"lexeme",id:item.lexeme.id},
    skill:"meaning_recognition",
    cueFamily:"written-to-meaning",
    promptType:"choice",
    instruction:"Choose the meaning.",
    prompt:item.lexeme.canonicalForm,
    promptLanguage:"ja",
    choices:[...new Set([item.meaning,...distractors])].slice(0,4),
    acceptedAnswers:[item.meaning],
    displayAnswer:item.meaning,
    explanation:`${item.lexeme.canonicalForm}（${item.reading}） means ${item.meaning}.`,
    contextId:contextId(item.lexeme),
    sourceId:item.lexeme.sourceIds[0],
    contentVersion:coreContent.version
  };
}

function makeReadingPrompt(item:VocabularyStudyItem):StudyPrompt {
  return {
    id:`vocab-reading-${item.lexeme.id}`,
    primaryTarget:{kind:"lexeme",id:item.lexeme.id},
    skill:"reading",
    cueFamily:"word-to-reading",
    promptType:"typed",
    instruction:"Type the reading in kana.",
    prompt:item.lexeme.canonicalForm,
    promptLanguage:"ja",
    placeholder:"かな…",
    acceptedAnswers:item.lexeme.readings.map((reading)=>reading.text),
    displayAnswer:item.reading,
    explanation:`${item.lexeme.canonicalForm} is read ${item.reading}.`,
    contextId:contextId(item.lexeme),
    answerNormalization:"japanese",
    sourceId:item.lexeme.sourceIds[0],
    contentVersion:coreContent.version
  };
}

function makeActiveUsePrompt(item:VocabularyStudyItem):StudyPrompt {
  const accepted=[item.lexeme.canonicalForm,...item.lexeme.forms.map((form)=>form.text),...item.lexeme.readings.map((reading)=>reading.text)];
  return {
    id:`vocab-active-${item.lexeme.id}`,
    primaryTarget:{kind:"lexeme",id:item.lexeme.id},
    skill:"active_use",
    cueFamily:"meaning-to-word",
    promptType:"typed",
    instruction:"Type the Japanese word.",
    prompt:item.meaning,
    promptLanguage:"en",
    placeholder:"日本語…",
    acceptedAnswers:[...new Set(accepted)],
    displayAnswer:`${item.lexeme.canonicalForm}（${item.reading}）`,
    explanation:`${item.meaning} → ${item.lexeme.canonicalForm}（${item.reading}）`,
    contextId:contextId(item.lexeme),
    answerNormalization:"japanese",
    sourceId:item.lexeme.sourceIds[0],
    contentVersion:coreContent.version
  };
}

function makeVocabularyLesson(lexeme:Lexeme):StudyLesson {
  const sense=senseForLexeme(lexeme);
  const reading=lexeme.readings[0]?.text ?? lexeme.canonicalForm;
  const linkedKanji=kanjiForLexeme(lexeme);
  const examples=lexeme.kanjiLinks.map((link)=>{
    const character=linkedKanji.find((item)=>item.id===link.kanjiId);
    const readingPart=link.readingInWord?` → ${link.readingInWord}`:"";
    const meaning=character?.meanings.join(", ") ?? "linked kanji";
    return {
      expression:`${character?.literal ?? link.kanjiId}${readingPart}`,
      note:link.readingNote?`${meaning}. ${link.readingNote}`:meaning
    };
  });
  return {
    kind:"lesson",
    id:`lesson-${lexeme.id}`,
    title:lexeme.canonicalForm,
    body:"Learn the word as one usable unit. Kanji information below is tied to this word; the app does not ask you to memorize an isolated list of possible readings.",
    contextId:contextId(lexeme),
    facts:[
      {label:"Reading",value:reading,language:"ja"},
      {label:"Meaning",value:sense.glosses.join(" / "),language:"en"},
      {label:"Type",value:(sense.partOfSpeech??[]).join(", ")||"word",language:"en"}
    ],
    ...(examples.length?{examples}:{}),
    sourceLabel:sourceTitle(lexeme.sourceIds[0] ?? "unknown")
  };
}

function contextId(lexeme:Lexeme):string { return `vocab-${lexeme.id}`; }
