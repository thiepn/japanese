import type { StudyLesson, StudyPrompt } from "@thiepn/study-player";
import { audioAsset, coreContent } from "../coreContent";

export const pronunciationPerceptionPrompts:StudyPrompt[]=[
  {
    id:"audio-perception-sokuon",
    primaryTarget:{kind:"kana",id:"hiragana-small-tsu"},
    skill:"listening",
    cueFamily:"sokuon-audio-discrimination",
    promptType:"choice",
    instruction:"Listen for the consonant closure.",
    prompt:"Which spelling matches the audio?",
    choices:["さっか","さか","さあか","さっかあ"],
    acceptedAnswers:["さっか"],
    displayAnswer:"さっか",
    explanation:"作家（さっか） contains the moraic closure written with small っ before か.",
    contextId:"audio-sokuon",
    answerNormalization:"japanese",
    sourceId:"thiepn-original",
    contentVersion:coreContent.version,
    audio:audioAsset("audio-perception-sokuon-sakka")
  },
  {
    id:"audio-perception-long-vowel",
    primaryTarget:{kind:"kana",id:"hiragana-long-vowel"},
    skill:"listening",
    cueFamily:"long-vowel-audio-discrimination",
    promptType:"choice",
    instruction:"Listen for vowel length.",
    prompt:"Which spelling matches the audio?",
    choices:["おばあさん","おばさん","おばっさん","おばんさん"],
    acceptedAnswers:["おばあさん"],
    displayAnswer:"おばあさん",
    explanation:"お婆さん（おばあさん） has a long /a/ spanning two morae: ば・あ.",
    contextId:"audio-long-vowel",
    answerNormalization:"japanese",
    sourceId:"thiepn-original",
    contentVersion:coreContent.version,
    audio:audioAsset("audio-perception-long-vowel-obaasan")
  },
  {
    id:"audio-perception-moraic-n",
    primaryTarget:{kind:"kana",id:"hiragana-ん"},
    skill:"listening",
    cueFamily:"moraic-n-audio-discrimination",
    promptType:"choice",
    instruction:"Listen for the final mora.",
    prompt:"Which reading matches the audio?",
    choices:["ほん","ほ","ほう","ほっ"],
    acceptedAnswers:["ほん"],
    displayAnswer:"ほん",
    explanation:"本（ほん） ends in the moraic nasal ん, which occupies its own mora.",
    contextId:"audio-moraic-n",
    answerNormalization:"japanese",
    sourceId:"thiepn-original",
    contentVersion:coreContent.version,
    audio:audioAsset("audio-lex-hon")
  }
];

export const pronunciationLessons:Record<string,StudyLesson>={
  "audio-sokuon":{
    kind:"lesson",id:"lesson-audio-sokuon",title:"Hear the small っ",
    body:"Small っ is not an extra vowel. In speech it creates a brief closure before the following consonant. Train the timing by listening before looking at the answer.",
    contextId:"audio-sokuon",
    examples:[{expression:"さか ↔ さっか",note:"The second form contains a closure before か."}],
    sourceLabel:"THIEPN pedagogy · Tofugu/WaniKani audio (CC BY-SA 4.0)"
  },
  "audio-long-vowel":{
    kind:"lesson",id:"lesson-audio-long-vowel",title:"Vowel length changes timing",
    body:"Japanese distinguishes short and long vowels by mora timing. A long vowel occupies an extra mora; do not reduce it to an English-style stress difference.",
    contextId:"audio-long-vowel",
    examples:[{expression:"おばさん ↔ おばあさん",note:"The second form contains an extra あ mora."}],
    sourceLabel:"THIEPN pedagogy · Tofugu/WaniKani audio (CC BY-SA 4.0)"
  },
  "audio-moraic-n":{
    kind:"lesson",id:"lesson-audio-moraic-n",title:"Hear ん as its own mora",
    body:"Moraic ん contributes one timing unit. Its exact phonetic realization changes with surrounding sounds, but the learner model first tracks whether you perceive its presence.",
    contextId:"audio-moraic-n",
    examples:[{expression:"ほ → ほん",note:"Adding ん adds a mora at the end."}],
    sourceLabel:"THIEPN pedagogy · Tofugu/WaniKani audio (CC BY-SA 4.0)"
  }
};
