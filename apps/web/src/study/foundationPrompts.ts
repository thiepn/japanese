import type { StudyPrompt } from "@thiepn/study-player";

interface KanaSeed {
  kana: string;
  reading: string;
  aliases?: string[];
  group: string;
}

export const basicHiragana: readonly KanaSeed[] = [
  { kana:"あ",reading:"a",group:"vowels" },{ kana:"い",reading:"i",group:"vowels" },{ kana:"う",reading:"u",group:"vowels" },{ kana:"え",reading:"e",group:"vowels" },{ kana:"お",reading:"o",group:"vowels" },
  { kana:"か",reading:"ka",group:"k" },{ kana:"き",reading:"ki",group:"k" },{ kana:"く",reading:"ku",group:"k" },{ kana:"け",reading:"ke",group:"k" },{ kana:"こ",reading:"ko",group:"k" },
  { kana:"さ",reading:"sa",group:"s" },{ kana:"し",reading:"shi",aliases:["si"],group:"s" },{ kana:"す",reading:"su",group:"s" },{ kana:"せ",reading:"se",group:"s" },{ kana:"そ",reading:"so",group:"s" },
  { kana:"た",reading:"ta",group:"t" },{ kana:"ち",reading:"chi",aliases:["ti"],group:"t" },{ kana:"つ",reading:"tsu",aliases:["tu"],group:"t" },{ kana:"て",reading:"te",group:"t" },{ kana:"と",reading:"to",group:"t" },
  { kana:"な",reading:"na",group:"n" },{ kana:"に",reading:"ni",group:"n" },{ kana:"ぬ",reading:"nu",group:"n" },{ kana:"ね",reading:"ne",group:"n" },{ kana:"の",reading:"no",group:"n" },
  { kana:"は",reading:"ha",group:"h" },{ kana:"ひ",reading:"hi",group:"h" },{ kana:"ふ",reading:"fu",aliases:["hu"],group:"h" },{ kana:"へ",reading:"he",group:"h" },{ kana:"ほ",reading:"ho",group:"h" },
  { kana:"ま",reading:"ma",group:"m" },{ kana:"み",reading:"mi",group:"m" },{ kana:"む",reading:"mu",group:"m" },{ kana:"め",reading:"me",group:"m" },{ kana:"も",reading:"mo",group:"m" },
  { kana:"や",reading:"ya",group:"y" },{ kana:"ゆ",reading:"yu",group:"y" },{ kana:"よ",reading:"yo",group:"y" },
  { kana:"ら",reading:"ra",group:"r" },{ kana:"り",reading:"ri",group:"r" },{ kana:"る",reading:"ru",group:"r" },{ kana:"れ",reading:"re",group:"r" },{ kana:"ろ",reading:"ro",group:"r" },
  { kana:"わ",reading:"wa",group:"w" },{ kana:"を",reading:"o",aliases:["wo"],group:"w" },{ kana:"ん",reading:"n",group:"w" }
] as const;

const kanaPrompts = basicHiragana.map(makeKanaPrompt);

const bridgeVocabulary: StudyPrompt[] = [
  {
    id:"foundation-word-ie",primaryTarget:{kind:"lexeme",id:"lex-ie"},skill:"meaning_recognition",cueFamily:"written-to-meaning",
    promptType:"choice",instruction:"Choose the meaning.",prompt:"いえ",promptLanguage:"ja",
    choices:["house","blue","above","dog"],acceptedAnswers:["house","a house"],displayAnswer:"house",
    explanation:"いえ means “house / home.” It only uses kana from the first vowel set.",contextId:"foundation-bridge"
  },
  {
    id:"foundation-word-ue",primaryTarget:{kind:"lexeme",id:"lex-ue"},skill:"meaning_recognition",cueFamily:"written-to-meaning",
    promptType:"choice",instruction:"Choose the meaning.",prompt:"うえ",promptLanguage:"ja",
    choices:["above / on top","house","sea","station"],acceptedAnswers:["above / on top","above","on top"],displayAnswer:"above / on top",
    explanation:"うえ means “above / on top.”",contextId:"foundation-bridge"
  }
];

export const foundationPrompts: StudyPrompt[] = [
  ...kanaPrompts.slice(0,5),
  ...bridgeVocabulary,
  ...kanaPrompts.slice(5)
];

export const FOUNDATION_TOTAL_ITEMS = foundationPrompts.length;
export const BASIC_HIRAGANA_TOTAL = basicHiragana.length;

export const foundationGroups = [
  { id:"vowels",label:"Vowels",items:5 },
  { id:"k-s",label:"K & S rows",items:10 },
  { id:"t-n",label:"T & N rows",items:10 },
  { id:"h-m",label:"H & M rows",items:10 },
  { id:"y-r-w",label:"Y, R, W & ん",items:11 }
] as const;

function makeKanaPrompt(seed: KanaSeed, index: number, all: readonly KanaSeed[]): StudyPrompt {
  const distractors = [1,5,11,19]
    .map((offset)=>all[(index+offset)%all.length]?.reading)
    .filter((value): value is string => Boolean(value) && value !== seed.reading);
  const choices = [...new Set([seed.reading,...distractors])].slice(0,4);
  return {
    id:`foundation-hiragana-${index+1}`,primaryTarget:{kind:"kana",id:`hiragana-${seed.kana}`},skill:"recognition",cueFamily:"kana-to-sound",
    promptType:"choice",instruction:"Choose the sound.",prompt:seed.kana,promptLanguage:"ja",
    choices,acceptedAnswers:[seed.reading,...(seed.aliases ?? [])],displayAnswer:seed.reading,
    explanation:`${seed.kana} is read ${seed.reading}.`,contextId:`hiragana-${seed.group}`
  };
}
