import type { StudyLesson, StudyPrompt } from "@thiepn/study-player";

export type KanaScript = "hiragana" | "katakana";
export type KanaCategory = "basic" | "voiced" | "yoon";

export interface KanaSeed {
  kana: string;
  reading: string;
  aliases?: string[];
  group: string;
  script: KanaScript;
  category: KanaCategory;
}

const BASIC_HIRAGANA_SOURCE = [
  ["あ","a","vowels"],["い","i","vowels"],["う","u","vowels"],["え","e","vowels"],["お","o","vowels"],
  ["か","ka","k"],["き","ki","k"],["く","ku","k"],["け","ke","k"],["こ","ko","k"],
  ["さ","sa","s"],["し","shi","s",["si"]],["す","su","s"],["せ","se","s"],["そ","so","s"],
  ["た","ta","t"],["ち","chi","t",["ti"]],["つ","tsu","t",["tu"]],["て","te","t"],["と","to","t"],
  ["な","na","n"],["に","ni","n"],["ぬ","nu","n"],["ね","ne","n"],["の","no","n"],
  ["は","ha","h"],["ひ","hi","h"],["ふ","fu","h",["hu"]],["へ","he","h"],["ほ","ho","h"],
  ["ま","ma","m"],["み","mi","m"],["む","mu","m"],["め","me","m"],["も","mo","m"],
  ["や","ya","y"],["ゆ","yu","y"],["よ","yo","y"],
  ["ら","ra","r"],["り","ri","r"],["る","ru","r"],["れ","re","r"],["ろ","ro","r"],
  ["わ","wa","w"],["を","o","w",["wo"]],["ん","n","w"]
] as const;

const VOICED_HIRAGANA_SOURCE = [
  ["が","ga","dakuten"],["ぎ","gi","dakuten"],["ぐ","gu","dakuten"],["げ","ge","dakuten"],["ご","go","dakuten"],
  ["ざ","za","dakuten"],["じ","ji","dakuten",["zi"]],["ず","zu","dakuten"],["ぜ","ze","dakuten"],["ぞ","zo","dakuten"],
  ["だ","da","dakuten"],["ぢ","ji","dakuten",["di"]],["づ","zu","dakuten",["du"]],["で","de","dakuten"],["ど","do","dakuten"],
  ["ば","ba","dakuten"],["び","bi","dakuten"],["ぶ","bu","dakuten"],["べ","be","dakuten"],["ぼ","bo","dakuten"],
  ["ぱ","pa","handakuten"],["ぴ","pi","handakuten"],["ぷ","pu","handakuten"],["ぺ","pe","handakuten"],["ぽ","po","handakuten"]
] as const;

const YOON_HIRAGANA_SOURCE = [
  ["きゃ","kya"],["きゅ","kyu"],["きょ","kyo"],
  ["ぎゃ","gya"],["ぎゅ","gyu"],["ぎょ","gyo"],
  ["しゃ","sha",["sya"]],["しゅ","shu",["syu"]],["しょ","sho",["syo"]],
  ["じゃ","ja",["jya","zya"]],["じゅ","ju",["jyu","zyu"]],["じょ","jo",["jyo","zyo"]],
  ["ちゃ","cha",["tya","cya"]],["ちゅ","chu",["tyu","cyu"]],["ちょ","cho",["tyo","cyo"]],
  ["ぢゃ","ja",["dya"]],["ぢゅ","ju",["dyu"]],["ぢょ","jo",["dyo"]],
  ["にゃ","nya"],["にゅ","nyu"],["にょ","nyo"],
  ["ひゃ","hya"],["ひゅ","hyu"],["ひょ","hyo"],
  ["びゃ","bya"],["びゅ","byu"],["びょ","byo"],
  ["ぴゃ","pya"],["ぴゅ","pyu"],["ぴょ","pyo"],
  ["みゃ","mya"],["みゅ","myu"],["みょ","myo"],
  ["りゃ","rya"],["りゅ","ryu"],["りょ","ryo"]
] as const;

export const basicHiragana: readonly KanaSeed[] = BASIC_HIRAGANA_SOURCE.map((item) => seedFromTuple(item,"hiragana","basic"));
export const voicedHiragana: readonly KanaSeed[] = VOICED_HIRAGANA_SOURCE.map((item) => seedFromTuple(item,"hiragana","voiced"));
export const yoonHiragana: readonly KanaSeed[] = YOON_HIRAGANA_SOURCE.map((item) => seedFromYoonTuple(item,"hiragana"));
export const basicKatakana: readonly KanaSeed[] = basicHiragana.map(toKatakanaSeed);
export const voicedKatakana: readonly KanaSeed[] = voicedHiragana.map(toKatakanaSeed);
export const yoonKatakana: readonly KanaSeed[] = yoonHiragana.map(toKatakanaSeed);

export const allKanaSeeds: readonly KanaSeed[] = [
  ...basicHiragana,...voicedHiragana,...yoonHiragana,
  ...basicKatakana,...voicedKatakana,...yoonKatakana
];

export const kanaRecognitionPrompts: StudyPrompt[] = allKanaSeeds.map(makeKanaRecognitionPrompt);
export const foundationApplicationPrompts: StudyPrompt[] = allKanaSeeds.flatMap((seed,index,all) => [
  makeKanaReadingRecallPrompt(seed),
  makeKanaFormSelectionPrompt(seed,index,all)
]);

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

const hiraganaSokuon: StudyPrompt = {
  id:"foundation-hiragana-small-tsu",primaryTarget:{kind:"kana",id:"hiragana-small-tsu"},skill:"reading",cueFamily:"sokuon-reading",
  promptType:"choice",instruction:"Choose the reading.",prompt:"きって",promptLanguage:"ja",
  choices:["kitte","kite","kiite","kitete"],acceptedAnswers:["kitte"],displayAnswer:"kitte",
  explanation:"Small っ marks a following consonant as doubled: きって is kitte, not kite.",contextId:"hiragana-sokuon"
};
const hiraganaSokuonApplication: StudyPrompt = {
  id:"foundation-hiragana-small-tsu-form",primaryTarget:{kind:"kana",id:"hiragana-small-tsu"},skill:"form_selection",cueFamily:"sokuon-form",
  promptType:"choice",instruction:"Choose the spelling for kitte.",prompt:"kitte",
  choices:["きって","きて","きいて","きつて"],acceptedAnswers:["きって"],displayAnswer:"きって",
  explanation:"The small っ comes before the consonant that is doubled.",contextId:"hiragana-sokuon",answerNormalization:"japanese"
};
const katakanaSokuon: StudyPrompt = {
  id:"foundation-katakana-small-tsu",primaryTarget:{kind:"kana",id:"katakana-small-tsu"},skill:"reading",cueFamily:"sokuon-reading",
  promptType:"choice",instruction:"Choose the reading.",prompt:"カップ",promptLanguage:"ja",
  choices:["kappu","kapu","kaapu","kappuu"],acceptedAnswers:["kappu"],displayAnswer:"kappu",
  explanation:"Small ッ marks a doubled following consonant: カップ is kappu.",contextId:"katakana-sokuon"
};
const katakanaSokuonApplication: StudyPrompt = {
  id:"foundation-katakana-small-tsu-form",primaryTarget:{kind:"kana",id:"katakana-small-tsu"},skill:"form_selection",cueFamily:"sokuon-form",
  promptType:"choice",instruction:"Choose the spelling for kappu.",prompt:"kappu",
  choices:["カップ","カプ","カープ","カツプ"],acceptedAnswers:["カップ"],displayAnswer:"カップ",
  explanation:"Small ッ is visually smaller than regular ツ.",contextId:"katakana-sokuon",answerNormalization:"japanese"
};
const katakanaLongVowel: StudyPrompt = {
  id:"foundation-katakana-long-vowel",primaryTarget:{kind:"kana",id:"katakana-long-vowel-mark"},skill:"reading",cueFamily:"long-vowel-reading",
  promptType:"choice",instruction:"Choose the reading.",prompt:"ケーキ",promptLanguage:"ja",
  choices:["keeki","keki","kekki","keiki"],acceptedAnswers:["keeki"],displayAnswer:"keeki",
  explanation:"ー lengthens the preceding vowel. ケーキ is read with a long e sound.",contextId:"katakana-long-vowel"
};
const katakanaLongVowelApplication: StudyPrompt = {
  id:"foundation-katakana-long-vowel-form",primaryTarget:{kind:"kana",id:"katakana-long-vowel-mark"},skill:"form_selection",cueFamily:"long-vowel-form",
  promptType:"choice",instruction:"Choose the spelling with a long e.",prompt:"keeki",
  choices:["ケーキ","ケキ","ケッキ","ケイキ"],acceptedAnswers:["ケーキ"],displayAnswer:"ケーキ",
  explanation:"Katakana commonly writes long vowels with ー.",contextId:"katakana-long-vowel",answerNormalization:"japanese"
};

const basicHiraPrompts = kanaRecognitionPrompts.filter((prompt) => prompt.primaryTarget.id.startsWith("hiragana-") && basicHiragana.some((seed) => prompt.primaryTarget.id === entityId(seed)));
const voicedHiraPrompts = kanaRecognitionPrompts.filter((prompt) => voicedHiragana.some((seed) => prompt.primaryTarget.id === entityId(seed)));
const yoonHiraPrompts = kanaRecognitionPrompts.filter((prompt) => yoonHiragana.some((seed) => prompt.primaryTarget.id === entityId(seed)));
const basicKataPrompts = kanaRecognitionPrompts.filter((prompt) => basicKatakana.some((seed) => prompt.primaryTarget.id === entityId(seed)));
const voicedKataPrompts = kanaRecognitionPrompts.filter((prompt) => voicedKatakana.some((seed) => prompt.primaryTarget.id === entityId(seed)));
const yoonKataPrompts = kanaRecognitionPrompts.filter((prompt) => yoonKatakana.some((seed) => prompt.primaryTarget.id === entityId(seed)));

export const foundationPrompts: StudyPrompt[] = [
  ...basicHiraPrompts.slice(0,5),...bridgeVocabulary,...basicHiraPrompts.slice(5),
  ...voicedHiraPrompts,...yoonHiraPrompts,hiraganaSokuon,
  ...basicKataPrompts,...voicedKataPrompts,...yoonKataPrompts,katakanaSokuon,katakanaLongVowel
];

foundationApplicationPrompts.push(hiraganaSokuonApplication,katakanaSokuonApplication,katakanaLongVowelApplication);

export const FOUNDATION_TOTAL_ITEMS = foundationPrompts.length;
export const BASIC_HIRAGANA_TOTAL = basicHiragana.length;
export const BASIC_KATAKANA_TOTAL = basicKatakana.length;

export const foundationSections = [
  {id:"hiragana-basic",label:"Basic hiragana",items:basicHiragana.length},
  {id:"hiragana-advanced",label:"Hiragana marks & combinations",items:voicedHiragana.length+yoonHiragana.length+1},
  {id:"katakana-basic",label:"Basic katakana",items:basicKatakana.length},
  {id:"katakana-advanced",label:"Katakana marks & combinations",items:voicedKatakana.length+yoonKatakana.length+2}
] as const;

export const foundationLessons: Record<string,StudyLesson> = {
  "hiragana-vowels":{kind:"lesson",id:"lesson-hiragana-vowels",title:"Five vowel sounds",body:"Japanese kana represent sound units. Start with the five vowels; their sound values stay much more stable than English vowel spelling.",contextId:"hiragana-vowels",examples:[{expression:"あ · い · う · え · お",note:"a · i · u · e · o"}]},
  "foundation-bridge":{kind:"lesson",id:"lesson-first-words",title:"Read something real",body:"You can already combine the first vowels into useful Japanese words. Reading words early keeps kana tied to language rather than treating them as isolated symbols.",contextId:"foundation-bridge",examples:[{expression:"いえ",note:"house / home"},{expression:"うえ",note:"above / on top"}]},
  "hiragana-k":rowLesson("hiragana-k","The K row","Add k before each vowel: ka, ki, ku, ke, ko."),
  "hiragana-s":rowLesson("hiragana-s","The S row","Most of this row follows s + vowel. し is conventionally written shi in common romanization.",[{expression:"し",note:"shi; si is also accepted"}]),
  "hiragana-t":rowLesson("hiragana-t","The T row","This row contains two forms worth noticing early: ち is chi and つ is tsu.",[{expression:"ち",note:"chi"},{expression:"つ",note:"tsu"}]),
  "hiragana-n":rowLesson("hiragana-n","The N row","The N row follows na, ni, nu, ne, no."),
  "hiragana-h":rowLesson("hiragana-h","The H row","The H row is mostly regular. ふ is commonly romanized fu.",[{expression:"ふ",note:"fu; hu is also accepted"}]),
  "hiragana-m":rowLesson("hiragana-m","The M row","The M row follows ma, mi, mu, me, mo."),
  "hiragana-y":rowLesson("hiragana-y","The Y row","Modern standard Japanese uses three basic Y-row kana here: や, ゆ, よ."),
  "hiragana-r":rowLesson("hiragana-r","The R row","Treat ra, ri, ru, re, ro as one row now; pronunciation practice can refine the Japanese r sound separately."),
  "hiragana-w":rowLesson("hiragana-w","W row and ん","Finish the basic set with わ, を and ん. を is normally pronounced o in modern Japanese.",[{expression:"を",note:"usually pronounced o"},{expression:"ん",note:"n"}]),
  "hiragana-dakuten":{kind:"lesson",id:"lesson-hiragana-dakuten",title:"Dakuten changes the consonant",body:"The two marks ゛ change several consonant rows: k→g, s→z, t→d, and h→b. Learn the changed sound together with the familiar base shape.",contextId:"hiragana-dakuten",examples:[{expression:"か → が",note:"ka → ga"},{expression:"は → ば",note:"ha → ba"}]},
  "hiragana-handakuten":{kind:"lesson",id:"lesson-hiragana-handakuten",title:"Handakuten makes the P row",body:"The small circle ゜ changes the H row to p sounds.",contextId:"hiragana-handakuten",examples:[{expression:"は → ぱ",note:"ha → pa"}]},
  "hiragana-yoon":{kind:"lesson",id:"lesson-hiragana-yoon",title:"Small ゃ・ゅ・ょ combinations",body:"A small ゃ, ゅ or ょ combines with the preceding i-row kana into one contracted sound unit.",contextId:"hiragana-yoon",examples:[{expression:"きゃ",note:"kya"},{expression:"しゅ",note:"shu"},{expression:"ちょ",note:"cho"}]},
  "hiragana-sokuon":{kind:"lesson",id:"lesson-hiragana-sokuon",title:"Small っ doubles the next consonant",body:"Small っ does not have a standalone vowel sound. It marks a brief closure before the following consonant and is reflected as a doubled consonant in romanization.",contextId:"hiragana-sokuon",examples:[{expression:"きて",note:"kite"},{expression:"きって",note:"kitte"}]},
  "katakana-dakuten":{kind:"lesson",id:"lesson-katakana-dakuten",title:"Dakuten works the same in katakana",body:"The same voicing pattern applies in katakana: k→g, s→z, t→d, h→b.",contextId:"katakana-dakuten"},
  "katakana-handakuten":{kind:"lesson",id:"lesson-katakana-handakuten",title:"The katakana P row",body:"Handakuten ゜ changes the katakana H row to p sounds.",contextId:"katakana-handakuten"},
  "katakana-yoon":{kind:"lesson",id:"lesson-katakana-yoon",title:"Small ャ・ュ・ョ combinations",body:"Small ャ, ュ and ョ combine with an i-row katakana in the same way as hiragana yōon.",contextId:"katakana-yoon",examples:[{expression:"キャ",note:"kya"},{expression:"シュ",note:"shu"}]},
  "katakana-sokuon":{kind:"lesson",id:"lesson-katakana-sokuon",title:"Small ッ",body:"Small ッ marks consonant doubling in katakana. It is common in loanwords.",contextId:"katakana-sokuon",examples:[{expression:"カップ",note:"kappu"}]},
  "katakana-long-vowel":{kind:"lesson",id:"lesson-katakana-long-vowel",title:"Long vowels with ー",body:"Katakana commonly writes a long vowel with the long-vowel mark ー. Hold the preceding vowel for an extra mora.",contextId:"katakana-long-vowel",examples:[{expression:"ケーキ",note:"keeki / kēki"}]}
};

for (const [group,label] of [["vowels","vowels"],["k","K row"],["s","S row"],["t","T row"],["n","N row"],["h","H row"],["m","M row"],["y","Y row"],["r","R row"],["w","W row & ン"]] as const) {
  foundationLessons[`katakana-${group}`] = {
    kind:"lesson",id:`lesson-katakana-${group}`,title:`Katakana: ${label}`,
    body:"Katakana represents the same core sound system as hiragana, but with a second set of shapes used heavily for loanwords, names, emphasis and other conventions.",
    contextId:`katakana-${group}`
  };
}

function makeKanaRecognitionPrompt(seed:KanaSeed,index:number,all:readonly KanaSeed[]):StudyPrompt {
  const sameScript = all.filter((item)=>item.script===seed.script && item.category===seed.category);
  const localIndex = sameScript.findIndex((item)=>item.kana===seed.kana);
  const distractors=[1,5,11,19].map((offset)=>sameScript[(localIndex+offset)%sameScript.length]?.reading).filter((value):value is string=>Boolean(value)&&value!==seed.reading);
  return {
    id:`foundation-${seed.script}-recognition-${index+1}`,primaryTarget:{kind:"kana",id:entityId(seed)},skill:"recognition",cueFamily:"kana-to-sound",
    promptType:"choice",instruction:"Choose the sound.",prompt:seed.kana,promptLanguage:"ja",
    choices:[...new Set([seed.reading,...distractors])].slice(0,4),acceptedAnswers:[seed.reading,...(seed.aliases??[])],displayAnswer:seed.reading,
    explanation:`${seed.kana} is read ${seed.reading}.`,contextId:`${seed.script}-${seed.group}`,answerNormalization:"romaji"
  };
}

function makeKanaReadingRecallPrompt(seed:KanaSeed):StudyPrompt {
  return {
    id:`foundation-${seed.script}-reading-${seed.kana}`,primaryTarget:{kind:"kana",id:entityId(seed)},skill:"reading",cueFamily:"kana-to-romaji-recall",
    promptType:"typed",instruction:"Type the reading.",prompt:seed.kana,promptLanguage:"ja",placeholder:"Romaji…",
    acceptedAnswers:[seed.reading,...(seed.aliases??[])],displayAnswer:seed.reading,explanation:`${seed.kana} → ${seed.reading}`,
    contextId:`${seed.script}-${seed.group}`,answerNormalization:"romaji"
  };
}

function makeKanaFormSelectionPrompt(seed:KanaSeed,index:number,all:readonly KanaSeed[]):StudyPrompt {
  const sameScript=all.filter((item)=>item.script===seed.script);
  const localIndex=sameScript.findIndex((item)=>item.kana===seed.kana);
  const distractors=[1,7,17,29].map((offset)=>sameScript[(localIndex+offset)%sameScript.length]?.kana).filter((value):value is string=>Boolean(value)&&value!==seed.kana);
  return {
    id:`foundation-${seed.script}-form-${seed.kana}`,primaryTarget:{kind:"kana",id:entityId(seed)},skill:"form_selection",cueFamily:"sound-to-kana",
    promptType:"choice",instruction:`Choose the ${seed.script}.`,prompt:seed.reading,
    choices:[...new Set([seed.kana,...distractors])].slice(0,4),acceptedAnswers:[seed.kana],displayAnswer:seed.kana,
    explanation:`${seed.reading} → ${seed.kana}`,contextId:`${seed.script}-${seed.group}`,answerNormalization:"japanese"
  };
}

function seedFromTuple(item: readonly [string,string,string] | readonly [string,string,string,readonly string[]],script:KanaScript,category:KanaCategory):KanaSeed {
  const [kana,reading,group,aliases]=item;
  return aliases ? {kana,reading,group,aliases:[...aliases],script,category} : {kana,reading,group,script,category};
}

function seedFromYoonTuple(item: readonly [string,string] | readonly [string,string,readonly string[]],script:KanaScript):KanaSeed {
  const [kana,reading,aliases]=item;
  return aliases ? {kana,reading,group:"yoon",aliases:[...aliases],script,category:"yoon"} : {kana,reading,group:"yoon",script,category:"yoon"};
}

function toKatakanaSeed(seed:KanaSeed):KanaSeed {
  return {...seed,kana:toKatakana(seed.kana),script:"katakana",group:seed.group};
}

function toKatakana(value:string):string {
  return Array.from(value,(char)=>{
    const code=char.charCodeAt(0);
    return code>=0x3041&&code<=0x3096?String.fromCharCode(code+0x60):char;
  }).join("");
}

function entityId(seed:KanaSeed):string { return `${seed.script}-${seed.kana}`; }

function rowLesson(contextId:string,title:string,body:string,examples?:{expression:string;note:string}[]):StudyLesson {
  return examples ? {kind:"lesson",id:`lesson-${contextId}`,title,body,contextId,examples} : {kind:"lesson",id:`lesson-${contextId}`,title,body,contextId};
}
