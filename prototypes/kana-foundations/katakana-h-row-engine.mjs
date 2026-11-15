// Unit 25 H-row, isolated Kana Foundations prototype. No Account/FSRS or prior-unit learner writes.
export const STORAGE_KEY='thiepn:kana-foundations:katakana-h-row:prototype-only:v1';
export const PREVIOUS_KATAKANA='アイウエオカキクケコサシスセソタチツテトナニヌネノ';
export const KANA=Object.freeze([
 {
  "id": "ha",
  "kana": "ハ",
  "base": "は",
  "reading": "ha",
  "stage": "a",
  "note": "ハ is katakana ha, corresponding to hiragana は. Recognize its two outward-sloping strokes. Do not confuse its sound with フ (fu)."
 },
 {
  "id": "hi",
  "kana": "ヒ",
  "base": "ひ",
  "reading": "hi",
  "stage": "a",
  "note": "ヒ is katakana hi, corresponding to hiragana ひ. The straight and curved parts distinguish it from the kana ヒ is sometimes confused with."
 },
 {
  "id": "fu",
  "kana": "フ",
  "base": "ふ",
  "reading": "fu",
  "aliases": [
   "hu"
  ],
  "stage": "a",
  "note": "フ is fu in standard Hepburn romanization and hu in Kunrei. Its actual Japanese sound is commonly described as [ɸɯ], not an English f or h. Both romanizations are accepted in typed recall."
 },
 {
  "id": "he",
  "kana": "ヘ",
  "base": "へ",
  "reading": "he",
  "stage": "a",
  "note": "ヘ is katakana he and corresponds to hiragana へ. They are visually almost identical but encoded as different script characters. In a standalone kana lesson, ヘ is pronounced he; the grammar particle へ can be pronounced e."
 },
 {
  "id": "ho",
  "kana": "ホ",
  "base": "ほ",
  "reading": "ho",
  "stage": "a",
  "note": "ホ is katakana ho, corresponding to hiragana ほ. Its crossbars and side strokes distinguish it from the earlier ト (to)."
 }
]);
export const WORDS=Object.freeze([
 {
  "id": "hachi",
  "kana": "ハチ",
  "reading": "hachi",
  "aliases": [
   "hati"
  ],
  "stage": "a",
  "meaning": "bee / wasp (insect)",
  "kanji": "蜂",
  "note": "ハ・チ are two morae. ハチ is a standard animal-name spelling for bees, wasps or hornets (蜂). Eight is a different word with the same reading, 八/はち; that number is not the assessed meaning. チ is chi, or ti in Kunrei."
 },
 {
  "id": "futa",
  "kana": "フタ",
  "reading": "futa",
  "aliases": [
   "huta"
  ],
  "stage": "a",
  "meaning": "lid; cover",
  "kanji": "蓋",
  "note": "フ・タ are two morae. フタ is a natural katakana spelling for a lid/cover, also written ふた or 蓋. フ is fu in Hepburn or hu in Kunrei."
 },
 {
  "id": "hotate",
  "kana": "ホタテ",
  "reading": "hotate",
  "stage": "a",
  "meaning": "scallop",
  "kanji": "帆立",
  "note": "ホ・タ・テ: three morae. ホタテ is an authentic and common seafood name for the Japanese scallop, also written 帆立."
 },
 {
  "id": "hako",
  "kana": "ハコ",
  "reading": "hako",
  "stage": "b",
  "meaning": "box",
  "kanji": "箱",
  "note": "ハ・コ: two morae. ハコ is a valid katakana reading-practice spelling of box, usually written 箱 or はこ in everyday prose."
 },
 {
  "id": "hana",
  "kana": "ハナ",
  "reading": "hana",
  "stage": "b",
  "meaning": "flower (plant context)",
  "kanji": "花",
  "note": "ハ・ナ: two morae. ハナ represents flower (花) in this plant context; ハナ can also be nose (鼻). 花/はな is usually preferred for this meaning in everyday writing."
 },
 {
  "id": "hito",
  "kana": "ヒト",
  "reading": "hito",
  "stage": "b",
  "meaning": "person; human",
  "kanji": "人",
  "note": "ヒ・ト: two morae. ヒト is a recognized katakana writing meaning a person or human, especially when treating humans as a species; 人/ひと are more usual in general prose."
 },
 {
  "id": "fuku",
  "kana": "フク",
  "reading": "fuku",
  "aliases": [
   "huku"
  ],
  "stage": "b",
  "meaning": "clothes; clothing",
  "kanji": "服",
  "note": "フ・ク: two morae. Here フク means clothes (服), typically written with kanji in general use; 福 (good fortune) has the same pronunciation but is not assessed. Kunrei huku is valid."
 },
 {
  "id": "fune",
  "kana": "フネ",
  "reading": "fune",
  "aliases": [
   "hune"
  ],
  "stage": "b",
  "meaning": "boat; ship",
  "kanji": "船",
  "note": "フ・ネ: two morae. フネ is a fully decodable reading-practice spelling for boat/ship, usually written 船 or ふね. Kunrei hune is accepted."
 },
 {
  "id": "heso",
  "kana": "ヘソ",
  "reading": "heso",
  "stage": "b",
  "meaning": "navel; belly button",
  "kanji": "臍",
  "note": "ヘ・ソ: two morae. ヘソ is a natural kana spelling of navel, also written へそ; the kanji 臍 is uncommon."
 },
 {
  "id": "hone",
  "kana": "ホネ",
  "reading": "hone",
  "stage": "b",
  "meaning": "bone",
  "kanji": "骨",
  "note": "ホ・ネ: two morae. ホネ is a real Japanese word for bone (骨), used in katakana in labels and reading practice; 骨/ほね are more usual in prose."
 }
]);
export const EXPRESSIONS=Object.freeze([]);
export const CONTRASTS=Object.freeze([
 {
  "id": "script-fu",
  "stage": "a",
  "kana": "Which is KATAKANA fu (also Kunrei hu), corresponding to ふ?",
  "answer": "フ",
  "choices": [
   [
    "ふ",
    "ふ — hiragana fu"
   ],
   [
    "フ",
    "フ — katakana fu"
   ]
  ],
  "note": "ふ and フ represent the same mora fu; hu is the Kunrei romanization. Select the katakana symbol フ."
 },
 {
  "id": "script-he",
  "stage": "a",
  "kana": "Which is KATAKANA he, corresponding to へ?",
  "answer": "ヘ",
  "choices": [
   [
    "へ",
    "へ — hiragana he"
   ],
   [
    "ヘ",
    "ヘ — katakana he"
   ]
  ],
  "note": "The characters へ and ヘ are extremely similar visually but belong to different scripts. Choose the katakana character."
 },
 {
  "id": "hira-ha",
  "stage": "b",
  "kana": "Which HIRAGANA corresponds to katakana ハ?",
  "answer": "は",
  "choices": [
   [
    "は",
    "は — ha"
   ],
   [
    "ひ",
    "ひ — hi"
   ],
   [
    "ふ",
    "ふ — fu"
   ]
  ],
  "note": "ハ and は represent the same sound (ha) in different scripts. "
 },
 {
  "id": "hira-hi",
  "stage": "b",
  "kana": "Which HIRAGANA corresponds to katakana ヒ?",
  "answer": "ひ",
  "choices": [
   [
    "ひ",
    "ひ — hi"
   ],
   [
    "ふ",
    "ふ — fu"
   ],
   [
    "へ",
    "へ — he"
   ]
  ],
  "note": "ヒ and ひ represent the same sound (hi) in different scripts. "
 },
 {
  "id": "hira-fu",
  "stage": "b",
  "kana": "Which HIRAGANA corresponds to katakana フ?",
  "answer": "ふ",
  "choices": [
   [
    "ふ",
    "ふ — fu"
   ],
   [
    "へ",
    "へ — he"
   ],
   [
    "ほ",
    "ほ — ho"
   ]
  ],
  "note": "フ and ふ represent the same sound (fu) in different scripts. Kunrei hu is an alternate romanization of fu."
 },
 {
  "id": "hira-he",
  "stage": "b",
  "kana": "Which HIRAGANA corresponds to katakana ヘ?",
  "answer": "へ",
  "choices": [
   [
    "へ",
    "へ — he"
   ],
   [
    "ほ",
    "ほ — ho"
   ],
   [
    "は",
    "は — ha"
   ]
  ],
  "note": "ヘ and へ represent the same sound (he) in different scripts. "
 },
 {
  "id": "hira-ho",
  "stage": "b",
  "kana": "Which HIRAGANA corresponds to katakana ホ?",
  "answer": "ほ",
  "choices": [
   [
    "ほ",
    "ほ — ho"
   ],
   [
    "は",
    "は — ha"
   ],
   [
    "ひ",
    "ひ — hi"
   ]
  ],
  "note": "ホ and ほ represent the same sound (ho) in different scripts. "
 },
 {
  "id": "insect",
  "stage": "b",
  "kana": "Which word means a bee/wasp, not a scallop?",
  "answer": "ハチ",
  "choices": [
   [
    "ホタテ",
    "ホタテ — scallop"
   ],
   [
    "ハチ",
    "ハチ — bee / wasp"
   ]
  ],
  "note": "ハチ means bee/wasp/hornet (蜂) in insect context; ホタテ is a scallop. ハチ can also mean eight in another context."
 },
 {
  "id": "flower",
  "stage": "b",
  "kana": "At a flower shop, which means flower rather than a box?",
  "answer": "ハナ",
  "choices": [
   [
    "ハコ",
    "ハコ — box"
   ],
   [
    "ハナ",
    "ハナ — flower"
   ]
  ],
  "note": "ハナ means 花 (flower) in a plant context, whereas ハコ means 箱 (box). ハナ can also mean nose in another context."
 },
 {
  "id": "clothes",
  "stage": "b",
  "kana": "Which word means clothes, rather than a lid?",
  "answer": "フク",
  "choices": [
   [
    "フタ",
    "フタ — lid"
   ],
   [
    "フク",
    "フク — clothes"
   ]
  ],
  "note": "フク is clothes (服) here; フタ is a lid/cover (蓋). 福 has the same reading as フク but different meaning."
 },
 {
  "id": "navel",
  "stage": "b",
  "kana": "Which word means navel, rather than bone?",
  "answer": "ヘソ",
  "choices": [
   [
    "ホネ",
    "ホネ — bone"
   ],
   [
    "ヘソ",
    "ヘソ — navel"
   ]
  ],
  "note": "ヘソ is navel/belly button; ホネ is bone. Both can be read using already-taught kana."
 }
]);
export const CHECKPOINT_INDEX=15;
const intro=k=>({id:'intro-'+k.id,mode:'introduction',stage:k.stage,kana:k.kana,base:k.base,answer:k.reading,aliases:k.aliases||[],note:k.note});
const recognition=(k,group,index)=>({id:'recognition-'+k.id,mode:'recognition',stage:k.stage,kana:k.kana,answer:k.reading,aliases:[],choices:[...group.slice(index),...group.slice(0,index)].map(x=>({value:x.reading,label:x.reading})),note:'Choose the standard Hepburn H-row reading. フ is fu (Kunrei hu). The full H-row matches the hiragana は・ひ・ふ・へ・ほ.'});
const word=w=>({id:'word-'+w.id,mode:'word',stage:w.stage,kana:w.kana,answer:w.reading,aliases:w.aliases||[],meaning:w.meaning,kanji:w.kanji,note:w.note});
const contrast=c=>({id:'contrast-'+c.id,mode:'contrast',stage:c.stage,kana:c.kana,answer:c.answer,aliases:[],choices:c.choices.map(([value,label])=>({value,label})),note:c.note});
const phrase=p=>({id:'phrase-'+p.id,mode:'phrase',stage:p.stage,kana:p.kana,answer:p.reading,aliases:p.aliases||[],meaning:p.meaning,kanji:p.kanji,note:p.note});
function makeStage(stage){
 const group=KANA.filter(k=>k.stage===stage);
 return [...group.map(intro),...group.map((k,i)=>recognition(k,group,i)),...WORDS.filter(w=>w.stage===stage).map(word),...CONTRASTS.filter(c=>c.stage===stage).map(contrast)];
}
export const TASKS=Object.freeze([...makeStage('a'),...makeStage('b')]);
export const MODES=Object.freeze([
 {id:'introduction',label:'Active H-row recall',total:5},
 {id:'recognition',label:'H-row sound recognition',total:5},
 {id:'word',label:'Fully decodable authentic words',total:10},
 {id:'contrast',label:'Script and context-specific meaning contrasts',total:11}
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
