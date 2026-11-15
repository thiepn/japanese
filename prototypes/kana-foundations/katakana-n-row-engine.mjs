// Unit 24 katakana N-row: isolated prototype, never writes earlier-unit or Account/FSRS data.
export const STORAGE_KEY='thiepn:kana-foundations:katakana-n-row:prototype-only:v1';
export const PREVIOUS_KATAKANA='アイウエオカキクケコサシスセソタチツテト';
export const KANA=Object.freeze([
 {
  "id": "na",
  "kana": "ナ",
  "base": "な",
  "reading": "na",
  "stage": "a",
  "note": "ナ is katakana na, matching hiragana な. Learn its angular stroke arrangement and distinguish it from previously studied タ."
 },
 {
  "id": "ni",
  "kana": "ニ",
  "base": "に",
  "reading": "ni",
  "stage": "a",
  "note": "ニ (ni) corresponds to hiragana に. Its two horizontal strokes may resemble the kanji 二 (two), but these are different characters with different uses."
 },
 {
  "id": "nu",
  "kana": "ヌ",
  "base": "ぬ",
  "reading": "nu",
  "stage": "a",
  "note": "ヌ is katakana nu, corresponding to hiragana ぬ. It has crossing curves/lines; compare with the older ス (su), which sounds different."
 },
 {
  "id": "ne",
  "kana": "ネ",
  "base": "ね",
  "reading": "ne",
  "stage": "a",
  "note": "ネ is katakana ne, corresponding to hiragana ね. It has multiple strokes, unlike the simpler ノ (no)."
 },
 {
  "id": "no",
  "kana": "ノ",
  "base": "の",
  "reading": "no",
  "stage": "a",
  "note": "ノ is katakana no, matching hiragana の. It is a simple diagonal stroke; it is not ソ (so) and is not the upcoming ン (n)."
 }
]);
export const WORDS=Object.freeze([
 {
  "id": "neko",
  "kana": "ネコ",
  "reading": "neko",
  "stage": "a",
  "meaning": "cat",
  "kanji": "猫",
  "note": "ネ・コ are two morae. ネコ is an accepted katakana animal name (猫 / ねこ also occur)."
 },
 {
  "id": "inu",
  "kana": "イヌ",
  "reading": "inu",
  "stage": "a",
  "meaning": "dog",
  "kanji": "犬",
  "note": "イ・ヌ are two morae. イヌ is an ordinary katakana animal name, also written 犬 or いぬ."
 },
 {
  "id": "nasu",
  "kana": "ナス",
  "reading": "nasu",
  "stage": "a",
  "meaning": "eggplant; aubergine",
  "kanji": "茄子",
  "note": "ナ・ス are two morae. ナス is a common produce-label spelling for eggplant, also written 茄子 or なす."
 },
 {
  "id": "kinoko",
  "kana": "キノコ",
  "reading": "kinoko",
  "stage": "b",
  "meaning": "mushroom",
  "kanji": "茸",
  "note": "キ・ノ・コ are three morae. キノコ is a common katakana spelling for mushroom; きのこ and 茸 also occur. The newly learned ノ is fully assessed."
 },
 {
  "id": "kitsune",
  "kana": "キツネ",
  "reading": "kitsune",
  "aliases": [
   "kitune"
  ],
  "stage": "b",
  "meaning": "fox",
  "kanji": "狐",
  "note": "キ・ツ・ネ are three morae. キツネ is a natural animal-name spelling for fox; ツ is tsu (Kunrei tu), not small ッ."
 },
 {
  "id": "tanuki",
  "kana": "タヌキ",
  "reading": "tanuki",
  "stage": "b",
  "meaning": "Japanese raccoon dog (tanuki)",
  "kanji": "狸",
  "note": "タ・ヌ・キ are three morae. タヌキ names a Japanese raccoon dog, not a raccoon or a fox. Animal names commonly use katakana."
 },
 {
  "id": "kani",
  "kana": "カニ",
  "reading": "kani",
  "stage": "b",
  "meaning": "crab",
  "kanji": "蟹",
  "note": "カ・ニ are two morae. カニ is a common katakana writing of crab on menus and seafood labels."
 },
 {
  "id": "nashi",
  "kana": "ナシ",
  "reading": "nashi",
  "aliases": [
   "nasi"
  ],
  "stage": "b",
  "meaning": "Japanese pear (fruit context)",
  "kanji": "梨",
  "note": "ナ・シ are two morae. ナシ is pear (梨) in fruit context; the same sound can also mean none (無し), which is not assessed. シ is shi (Kunrei si)."
 },
 {
  "id": "neta",
  "kana": "ネタ",
  "reading": "neta",
  "stage": "b",
  "meaning": "sushi topping; topic/story material",
  "note": "ネ・タ are two morae. ネタ is a common Japanese word meaning sushi topping/ingredient or story material; the intended sense depends on context. The contrast question specifies sushi."
 },
 {
  "id": "tane",
  "kana": "タネ",
  "reading": "tane",
  "stage": "b",
  "meaning": "seed",
  "kanji": "種",
  "note": "タ・ネ are two morae. タネ means seed, especially on gardening or seed packets; 種 or たね are also common in everyday writing."
 }
]);
export const EXPRESSIONS=Object.freeze([]);
export const CONTRASTS=Object.freeze([
 {
  "id": "script-nu",
  "stage": "a",
  "kana": "Which is KATAKANA nu, the counterpart of ぬ?",
  "answer": "ヌ",
  "choices": [
   [
    "ぬ",
    "ぬ — hiragana nu"
   ],
   [
    "ヌ",
    "ヌ — katakana nu"
   ]
  ],
  "note": "ぬ and ヌ represent the same nu sound in different scripts."
 },
 {
  "id": "script-no",
  "stage": "a",
  "kana": "Which is KATAKANA no, the counterpart of の?",
  "answer": "ノ",
  "choices": [
   [
    "の",
    "の — hiragana no"
   ],
   [
    "ノ",
    "ノ — katakana no"
   ]
  ],
  "note": "の and ノ represent the same no sound in different scripts. ノ is a single diagonal stroke."
 },
 {
  "id": "hira-na",
  "stage": "b",
  "kana": "Which HIRAGANA corresponds to katakana ナ?",
  "answer": "な",
  "choices": [
   [
    "な",
    "な — na"
   ],
   [
    "に",
    "に — ni"
   ],
   [
    "ぬ",
    "ぬ — nu"
   ]
  ],
  "note": "ナ and な have the same sound na in two different scripts."
 },
 {
  "id": "hira-ni",
  "stage": "b",
  "kana": "Which HIRAGANA corresponds to katakana ニ?",
  "answer": "に",
  "choices": [
   [
    "に",
    "に — ni"
   ],
   [
    "ぬ",
    "ぬ — nu"
   ],
   [
    "ね",
    "ね — ne"
   ]
  ],
  "note": "ニ and に have the same sound ni in two different scripts."
 },
 {
  "id": "hira-nu",
  "stage": "b",
  "kana": "Which HIRAGANA corresponds to katakana ヌ?",
  "answer": "ぬ",
  "choices": [
   [
    "ぬ",
    "ぬ — nu"
   ],
   [
    "ね",
    "ね — ne"
   ],
   [
    "の",
    "の — no"
   ]
  ],
  "note": "ヌ and ぬ have the same sound nu in two different scripts."
 },
 {
  "id": "hira-ne",
  "stage": "b",
  "kana": "Which HIRAGANA corresponds to katakana ネ?",
  "answer": "ね",
  "choices": [
   [
    "ね",
    "ね — ne"
   ],
   [
    "の",
    "の — no"
   ],
   [
    "な",
    "な — na"
   ]
  ],
  "note": "ネ and ね have the same sound ne in two different scripts."
 },
 {
  "id": "hira-no",
  "stage": "b",
  "kana": "Which HIRAGANA corresponds to katakana ノ?",
  "answer": "の",
  "choices": [
   [
    "の",
    "の — no"
   ],
   [
    "な",
    "な — na"
   ],
   [
    "に",
    "に — ni"
   ]
  ],
  "note": "ノ and の have the same sound no in two different scripts."
 },
 {
  "id": "fox",
  "stage": "b",
  "kana": "Which Japanese animal name means fox, not raccoon dog?",
  "answer": "キツネ",
  "choices": [
   [
    "タヌキ",
    "タヌキ — raccoon dog"
   ],
   [
    "キツネ",
    "キツネ — fox"
   ]
  ],
  "note": "キツネ is fox and タヌキ is the Japanese raccoon dog. Both are natural katakana animal names."
 },
 {
  "id": "pear",
  "stage": "b",
  "kana": "In a produce shop, which word means pear instead of eggplant?",
  "answer": "ナシ",
  "choices": [
   [
    "ナス",
    "ナス — eggplant"
   ],
   [
    "ナシ",
    "ナシ — pear"
   ]
  ],
  "note": "ナシ (梨) is pear in produce context; ナス (茄子) is eggplant. ナシ can mean none in unrelated contexts."
 },
 {
  "id": "mushroom",
  "stage": "b",
  "kana": "Which word means mushroom, not crab?",
  "answer": "キノコ",
  "choices": [
   [
    "カニ",
    "カニ — crab"
   ],
   [
    "キノコ",
    "キノコ — mushroom"
   ]
  ],
  "note": "キノコ means mushroom; カニ means crab. Both are fully decodable in Units 20–24."
 },
 {
  "id": "seed",
  "stage": "b",
  "kana": "Which word means seed for planting, rather than a sushi topping?",
  "answer": "タネ",
  "choices": [
   [
    "ネタ",
    "ネタ — sushi topping"
   ],
   [
    "タネ",
    "タネ — seed"
   ]
  ],
  "note": "タネ is a seed (種). ネタ is sushi topping/ingredient in a sushi context; it also means story material in other contexts."
 }
]);
export const CHECKPOINT_INDEX=15;
const intro=k=>({id:'intro-'+k.id,mode:'introduction',stage:k.stage,kana:k.kana,base:k.base,answer:k.reading,aliases:k.aliases||[],note:k.note});
const recognition=(k,group,index)=>({id:'recognition-'+k.id,mode:'recognition',stage:k.stage,kana:k.kana,answer:k.reading,aliases:[],choices:[...group.slice(index),...group.slice(0,index)].map(x=>({value:x.reading,label:x.reading})),note:'Choose the sound of this N-row katakana. It corresponds directly to the matching hiragana and is different from the standalone nasal ン, which is not taught yet.'});
const word=w=>({id:'word-'+w.id,mode:'word',stage:w.stage,kana:w.kana,answer:w.reading,aliases:w.aliases||[],meaning:w.meaning,kanji:w.kanji,note:w.note});
const contrast=c=>({id:'contrast-'+c.id,mode:'contrast',stage:c.stage,kana:c.kana,answer:c.answer,aliases:[],choices:c.choices.map(([value,label])=>({value,label})),note:c.note});
const phrase=p=>({id:'phrase-'+p.id,mode:'phrase',stage:p.stage,kana:p.kana,answer:p.reading,aliases:p.aliases||[],meaning:p.meaning,kanji:p.kanji,note:p.note});
function makeStage(stage){
 const group=KANA.filter(k=>k.stage===stage);
 return [...group.map(intro),...group.map((k,i)=>recognition(k,group,i)),...WORDS.filter(w=>w.stage===stage).map(word),...CONTRASTS.filter(c=>c.stage===stage).map(contrast)];
}
export const TASKS=Object.freeze([...makeStage('a'),...makeStage('b')]);
export const MODES=Object.freeze([
 {id:'introduction',label:'Active N-row recall',total:5},
 {id:'recognition',label:'N-row sound recognition',total:5},
 {id:'word',label:'Fully decodable authentic words',total:10},
 {id:'contrast',label:'Script and context-specific word meanings',total:11}
]);
const byId=Object.fromEntries(TASKS.map(t=>[t.id,t]));
export function initialState(){return {schema:1,index:0,paused:true,checking:false,checkpointPassed:false,feedback:null,records:[],corrections:[],finished:false};}
export function normalize(value){return typeof value==='string'?value.normalize('NFKC').trim().toLowerCase().replace(/[\s\u3000-]/g,''):'';}
export function atCheckpoint(s){return Boolean(s&&!s.paused&&!s.finished&&s.index===CHECKPOINT_INDEX&&!s.checkpointPassed&&!s.feedback);}
export function taskAt(s){
 if(!s||s.finished||atCheckpoint(s))return null;
 const id=s.index<TASKS.length?TASKS[s.index]?.id:s.corrections[s.index-TASKS.length];
 return id&&byId[id]?{...byId[id],correction:s.index>=TASKS.length}:null;
}
export function validState(s){
 if(!s||typeof s!=='object'||s.schema!==1||!Number.isInteger(s.index)||s.index<0||s.index>2*TASKS.length
  ||typeof s.paused!=='boolean'||typeof s.checking!=='boolean'||typeof s.checkpointPassed!=='boolean'
  ||typeof s.finished!=='boolean'||!Array.isArray(s.records)||s.records.length>2*TASKS.length
  ||!Array.isArray(s.corrections)||s.corrections.length>TASKS.length
  ||new Set(s.corrections).size!==s.corrections.length||!s.corrections.every(id=>Boolean(byId[id]))
  ||!(s.feedback===null||(s.feedback&&typeof s.feedback==='object'&&[true,false,null].includes(s.feedback.correct)))
  ||s.records.length!==s.index+(s.feedback?1:0)||s.index>TASKS.length+s.corrections.length)return false;
 if((s.index<CHECKPOINT_INDEX&&s.checkpointPassed)||(s.index>CHECKPOINT_INDEX&&!s.checkpointPassed))return false;
 if(s.index===CHECKPOINT_INDEX&&!s.checkpointPassed&&(s.feedback!==null||s.checking))return false;
 if(s.index<TASKS.length&&s.corrections.length)return false;
 if(s.finished&&(s.index!==TASKS.length+s.corrections.length||s.feedback!==null||s.checking))return false;
 if(!s.finished&&s.index>=TASKS.length+s.corrections.length)return false;
 if(s.index>=TASKS.length){
  const wrong=s.records.slice(0,TASKS.length).filter(r=>r.correct!==true||r.assisted).map(r=>r.taskId);
  if(wrong.length!==s.corrections.length||wrong.some((id,i)=>id!==s.corrections[i]))return false;
 }
 const t=s.index===CHECKPOINT_INDEX&&!s.checkpointPassed?null:taskAt({...s,paused:true});
 if(s.checking&&(!t||t.mode!=='introduction'||t.correction||s.feedback))return false;
 const ids=new Set();
 for(let i=0;i<s.records.length;i++){
  const r=s.records[i],task=i<TASKS.length?TASKS[i]:byId[s.corrections[i-TASKS.length]];
  const correction=i>=TASKS.length;
  if(!r||!task||r.taskId!==task.id||r.mode!==task.mode||r.correction!==correction
   ||r.recordId!==(correction?'correction-':'first-')+task.id||ids.has(r.recordId)
   ||typeof r.submitted!=='string'||r.submitted.length>60
   ||![true,false,null].includes(r.correct)||typeof r.assisted!=='boolean'
   ||typeof r.at!=='string'||Number.isNaN(Date.parse(r.at)))return false;
  ids.add(r.recordId);
  if(r.correct===null){if(!r.assisted||r.submitted!=='')return false;}
  else if(r.assisted||r.correct!==(r.submitted===task.answer||task.aliases.includes(r.submitted)))return false;
 }
 if(s.feedback){
  const last=s.records.at(-1);
  if(!t||!last||last.taskId!==t.id||last.correct!==s.feedback.correct
    ||last.submitted!==s.feedback.submitted||s.feedback.answer!==t.answer
    ||last.assisted!==s.feedback.assisted)return false;
 }
 return true;
}
export function resume(s){return validState(s)?{...s,paused:false}:s;}
export function pause(s){return validState(s)?{...s,paused:true}:s;}
export function acknowledgeCheckpoint(s){
 return validState(s)&&atCheckpoint(s)?{...s,checkpointPassed:true}:s;
}
export function beginRecall(s){
 const task=taskAt(s);
 return validState(s)&&!s.paused&&task?.mode==='introduction'&&!task.correction&&!s.checking&&!s.feedback?{...s,checking:true}:s;
}
function record(s,response,correct,assisted,now){
 const t=taskAt(s);
 const r={recordId:(t.correction?'correction-':'first-')+t.id,taskId:t.id,mode:t.mode,
  submitted:correct===null?'':response,correct,assisted,correction:t.correction,at:new Date(now).toISOString()};
 return {...s,records:[...s.records,r],feedback:{correct,answer:t.answer,submitted:r.submitted,assisted},checking:false};
}
export function answer(s,raw,now=Date.now()){
 if(!validState(s)||s.paused||s.feedback||atCheckpoint(s))return s;
 const t=taskAt(s),value=normalize(raw);
 if(!t||!value||value.length>60||(t.mode==='introduction'&&!t.correction&&!s.checking))return s;
 if(t.choices){if(!t.choices.some(c=>c.value===value))return s;}
 else if(!/^[a-z]+$/.test(value))return s;
 return record(s,value,value===t.answer||t.aliases.includes(value),false,now);
}
export function reveal(s,now=Date.now()){
 if(!validState(s)||s.paused||s.feedback||atCheckpoint(s))return s;
 const t=taskAt(s);
 if(!t||(t.mode==='introduction'&&!t.correction&&!s.checking))return s;
 return record(s,'',null,true,now);
}
export function advance(s){
 if(!validState(s)||s.paused||!s.feedback)return s;
 const index=s.index+1,base={...s,index,checking:false,feedback:null};
 if(index<TASKS.length)return base;
 if(index===TASKS.length){
  const corrections=s.records.filter(r=>!r.correction&&(r.correct!==true||r.assisted)).map(r=>r.taskId);
  return {...base,corrections,finished:corrections.length===0};
 }
 return {...base,finished:index===TASKS.length+s.corrections.length};
}
export function summary(s){
 const first=s.records.filter(r=>!r.correction),result={};
 for(const {id,total} of MODES){
  const records=first.filter(r=>r.mode===id);
  result[id]={total,completed:records.length,independentCorrect:records.filter(r=>r.correct===true&&!r.assisted).length};
 }
 result.correctionCount=s.records.filter(r=>r.correction).length;
 result.corrected=s.records.filter(r=>r.correction&&r.correct===true&&!r.assisted).length;
 result.stageB=first.filter(r=>['b','application'].includes(byId[r.taskId]?.stage)&&r.correct===true&&!r.assisted).length;
 result.stageA=first.filter(r=>byId[r.taskId]?.stage==='a'&&r.correct===true&&!r.assisted).length;
 return result;
}
