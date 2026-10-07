import type {StudyLesson,StudyPrompt,StudyStep} from "@thiepn/study-player";

export type J5StudyMode=
  |"lesson"
  |"kana"
  |"kanji"
  |"vocabulary"
  |"grammar"
  |"sentence"
  |"listening"
  |"writing"
  |"speaking"
  |"assessment"
  |"review";

export interface J5StudyModeMeta{
  mode:J5StudyMode;
  glyph:string;
  japanese:string;
  english:string;
  note:string;
}

const META:Record<J5StudyMode,J5StudyModeMeta>={
  lesson:{mode:"lesson",glyph:"学",japanese:"学ぶ",english:"Lesson",note:"Understand before recalling"},
  kana:{mode:"kana",glyph:"仮",japanese:"かな",english:"Kana",note:"Shape · sound · recall"},
  kanji:{mode:"kanji",glyph:"字",japanese:"漢字",english:"Kanji",note:"Form · reading · meaning"},
  vocabulary:{mode:"vocabulary",glyph:"語",japanese:"語彙",english:"Vocabulary",note:"Meaning · reading · use"},
  grammar:{mode:"grammar",glyph:"文",japanese:"文法",english:"Grammar",note:"Function · form · context"},
  sentence:{mode:"sentence",glyph:"句",japanese:"文",english:"Sentence",note:"Meaning · structure · production"},
  listening:{mode:"listening",glyph:"聴",japanese:"聴く",english:"Listening",note:"Hear first · answer second"},
  writing:{mode:"writing",glyph:"書",japanese:"書く",english:"Writing",note:"Produce connected Japanese"},
  speaking:{mode:"speaking",glyph:"話",japanese:"話す",english:"Speaking",note:"Respond aloud"},
  assessment:{mode:"assessment",glyph:"試",japanese:"試す",english:"Assessment",note:"Independent evidence"},
  review:{mode:"review",glyph:"復",japanese:"復習",english:"Review",note:"Retrieve from memory"},
};

export function j5StudyMode(step:StudyStep):J5StudyModeMeta{
  if(isPrompt(step)){
    if(step.activity==="assessment")return META.assessment;
    if(step.promptType==="speech")return META.speaking;
    if(step.promptType==="textarea")return META.writing;
    if(step.audio||step.speechSynthesisText||step.skill==="listening"||step.skill==="audio_recognition")return META.listening;

    switch(step.primaryTarget.kind){
      case "kana":return META.kana;
      case "kanji":return META.kanji;
      case "lexeme":
      case "sense":
      case "lexical_chunk":return META.vocabulary;
      case "grammar":return META.grammar;
      case "sentence":return META.sentence;
      case "production_task":
        return step.languageActivity==="speaking"||step.languageActivity==="spoken_interaction"||step.languageActivity==="spoken_production"
          ?META.speaking
          :META.writing;
      default:return META.review;
    }
  }

  return lessonMode(step);
}

function lessonMode(step:StudyLesson):J5StudyModeMeta{
  const clue=(step.id+" "+step.contextId+" "+step.title).toLowerCase();
  if(/hiragana|katakana|kana|vowel|sokuon|moraic/.test(clue))return META.kana;
  if(/kanji/.test(clue))return META.kanji;
  if(/vocab|lexeme|word/.test(clue))return META.vocabulary;
  if(/grammar|conjugat|particle|adjective|verb/.test(clue))return META.grammar;
  if(/sentence/.test(clue))return META.sentence;
  if(/listen|audio|pronunciation|shadow/.test(clue))return META.listening;
  if(/speak|speech|conversation|interaction/.test(clue))return META.speaking;
  if(/writ|production|composition/.test(clue))return META.writing;
  if(/assessment|milestone|diagnostic|check/.test(clue))return META.assessment;
  return META.lesson;
}

function isPrompt(step:StudyStep):step is StudyPrompt{
  return !("kind" in step&&step.kind==="lesson");
}
