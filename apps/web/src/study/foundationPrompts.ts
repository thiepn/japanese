import type { StudyPrompt } from "@thiepn/study-player";

export const foundationPrompts: StudyPrompt[] = [
  {
    id: "foundation-kana-a", primaryTarget: { kind: "kana", id: "kana-a" }, skill: "recognition", cueFamily: "kana-to-sound",
    promptType: "choice", instruction: "Choose the sound.", prompt: "あ", promptLanguage: "ja",
    choices: ["a", "i", "u", "e"], acceptedAnswers: ["a"], displayAnswer: "a",
    explanation: "あ represents the Japanese vowel sound a.", contextId: "foundation-001"
  },
  {
    id: "foundation-kana-i", primaryTarget: { kind: "kana", id: "kana-i" }, skill: "recognition", cueFamily: "kana-to-sound",
    promptType: "choice", instruction: "Choose the sound.", prompt: "い", promptLanguage: "ja",
    choices: ["i", "a", "o", "u"], acceptedAnswers: ["i"], displayAnswer: "i",
    explanation: "い represents the Japanese vowel sound i.", contextId: "foundation-001"
  },
  {
    id: "foundation-kana-u", primaryTarget: { kind: "kana", id: "kana-u" }, skill: "recognition", cueFamily: "kana-to-sound",
    promptType: "typed", instruction: "Type the sound.", prompt: "う", promptLanguage: "ja",
    placeholder: "Type the sound…", acceptedAnswers: ["u"], displayAnswer: "u",
    explanation: "う represents the Japanese vowel sound u.", contextId: "foundation-001"
  },
  {
    id: "foundation-taberu", primaryTarget: { kind: "lexeme", id: "lex-taberu" }, skill: "meaning_recognition", cueFamily: "written-to-meaning",
    promptType: "choice", instruction: "Choose the meaning.", prompt: "食べる", promptLanguage: "ja",
    choices: ["to eat", "to drink", "to read", "to go"], acceptedAnswers: ["to eat"], displayAnswer: "to eat",
    explanation: "食べる（たべる） means “to eat.”", contextId: "foundation-001"
  },
  {
    id: "foundation-gakkou", primaryTarget: { kind: "lexeme", id: "lex-gakkou" }, skill: "meaning_recognition", cueFamily: "written-to-meaning",
    promptType: "typed", instruction: "Type the English meaning.", prompt: "学校", promptLanguage: "ja",
    placeholder: "Meaning…", acceptedAnswers: ["school", "a school"], displayAnswer: "school",
    explanation: "学校（がっこう） means “school.”", contextId: "foundation-001"
  }
];
