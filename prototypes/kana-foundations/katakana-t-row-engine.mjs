// Unit 23 katakana T-row; isolated Kana Foundations prototype, no old-unit or Account/FSRS writes.
export const STORAGE_KEY='thiepn:kana-foundations:katakana-t-row:prototype-only:v1';
export const PREVIOUS_KATAKANA='アイウエオカキクケコサシスセソ';
export const KANA=Object.freeze([
 {
  "id": "ta",
  "kana": "タ",
  "base": "た",
  "reading": "ta",
  "stage": "a",
  "note": "タ is katakana ta, corresponding to hiragana た. Its angular shape differs from the hiragana but the sound is identical."
 },
 {
  "id": "chi",
  "kana": "チ",
  "base": "ち",
  "reading": "chi",
  "aliases": [
   "ti"
  ],
  "stage": "a",
  "note": "チ is chi in Hepburn romanization, ti in Kunrei. Corresponds to hiragana ち. Chi is not the same reading as シ (shi)."
 },
 {
  "id": "tsu",
  "kana": "ツ",
  "base": "つ",
  "reading": "tsu",
  "aliases": [
   "tu"
  ],
  "stage": "a",
  "note": "ツ is tsu in Hepburn, tu in Kunrei, corresponding to つ. Compare ツ (top short marks and more upright long stroke) against シ (left short marks and rising long stroke)."
 },
 {
  "id": "te",
  "kana": "テ",
  "base": "て",
  "reading": "te",
  "stage": "a",
  "note": "テ is katakana te, matching hiragana て. Notice the two horizontal strokes and descending angled stroke."
 },
 {
  "id": "to",
  "kana": "ト",
  "base": "と",
  "reading": "to",
  "stage": "a",
  "note": "ト is katakana to, matching hiragana と. It has a tall stroke and a short diagonal mark."
 }
]);
export const WORDS=Object.freeze([
 {
  "id": "tako",
  "kana": "タコ",
  "reading": "tako",
  "stage": "a",
  "meaning": "octopus",
  "note": "タ・コ are two morae. タコ is a standard real katakana word for an octopus."
 },
 {
  "id": "kutsu",
  "kana": "クツ",
  "reading": "kutsu",
  "aliases": [
   "kutu"
  ],
  "stage": "a",
  "meaning": "shoes",
  "kanji": "靴",
  "note": "ク・ツ form two morae. クツ is used on clothing/shoe signs; 靴 or くつ are also used. ツ reads tsu (Kunrei tu)."
 },
 {
  "id": "chikachika",
  "kana": "チカチカ",
  "reading": "chikachika",
  "aliases": [
   "tikatika"
  ],
  "stage": "a",
  "meaning": "flickering / dazzling flashing",
  "note": "チ・カ・チ・カ: four morae. チカチカ is genuine Japanese mimetic language for a flickering light or eyes dazzled by light. Not the noun 地下 (underground)."
 },
 {
  "id": "tsukue",
  "kana": "ツクエ",
  "reading": "tsukue",
  "aliases": [
   "tukue"
  ],
  "stage": "b",
  "meaning": "desk",
  "kanji": "机",
  "note": "ツ・ク・エ are three morae. ツクエ is a katakana reading-practice spelling for 机 (desk), usually written 机 or つくえ."
 },
 {
  "id": "tokei",
  "kana": "トケイ",
  "reading": "tokei",
  "stage": "b",
  "meaning": "clock; watch",
  "kanji": "時計",
  "note": "ト・ケ・イ are three morae. トケイ represents 時計 (clock/watch), usually written 時計 or とけい in general texts."
 },
 {
  "id": "kotsu",
  "kana": "コツ",
  "reading": "kotsu",
  "aliases": [
   "kotu"
  ],
  "stage": "b",
  "meaning": "knack; practical trick / tip",
  "note": "コ・ツ are two morae. コツ is a common katakana word for a knack, practical trick, or tip. Do not confuse with クツ (shoes)."
 },
 {
  "id": "teko",
  "kana": "テコ",
  "reading": "teko",
  "stage": "b",
  "meaning": "lever",
  "kanji": "梃子",
  "note": "テ・コ: two morae. テコ is a standard Japanese writing for a lever, also written てこ or 梃子."
 },
 {
  "id": "kitsutsuki",
  "kana": "キツツキ",
  "reading": "kitsutsuki",
  "aliases": [
   "kitutuki"
  ],
  "stage": "b",
  "meaning": "woodpecker",
  "note": "キ・ツ・ツ・キ: four morae. キツツキ is a genuine and common katakana animal name for a woodpecker. It contains two full ツ, not small ッ."
 },
 {
  "id": "chikuchiku",
  "kana": "チクチク",
  "reading": "chikuchiku",
  "aliases": [
   "tikutiku"
  ],
  "stage": "b",
  "meaning": "pricking or stinging repeatedly",
  "note": "チ・ク・チ・ク: four morae. チクチク is a natural Japanese mimetic word for a pricking sensation; it is not a proper noun."
 },
 {
  "id": "take",
  "kana": "タケ",
  "reading": "take",
  "stage": "b",
  "meaning": "bamboo",
  "kanji": "竹",
  "note": "タ・ケ are two morae. タケ is a standard botanical katakana writing for bamboo; 竹 is more typical in everyday prose."
 }
]);
export const EXPRESSIONS=Object.freeze([]);
export const CONTRASTS=Object.freeze([
 {
  "id": "script-chi",
  "stage": "a",
  "kana": "Which is the KATAKANA form of hiragana ち (chi)?",
  "answer": "チ",
  "choices": [
   [
    "ち",
    "ち — hiragana chi"
   ],
   [
    "チ",
    "チ — katakana chi"
   ]
  ],
  "note": "ち and チ sound chi, written ti in Kunrei. Choose the katakana character チ."
 },
 {
  "id": "script-tsu",
  "stage": "a",
  "kana": "Which is the KATAKANA form of hiragana つ (tsu)?",
  "answer": "ツ",
  "choices": [
   [
    "つ",
    "つ — hiragana tsu"
   ],
   [
    "ツ",
    "ツ — katakana tsu"
   ]
  ],
  "note": "つ and ツ sound tsu, written tu in Kunrei. The script is different, not the sound."
 },
 {
  "id": "hira-ta",
  "stage": "b",
  "kana": "Which HIRAGANA corresponds to katakana タ?",
  "answer": "た",
  "choices": [
   [
    "た",
    "た — ta"
   ],
   [
    "ち",
    "ち — chi"
   ],
   [
    "つ",
    "つ — tsu"
   ]
  ],
  "note": "タ and た represent the same sound (ta) in different scripts."
 },
 {
  "id": "hira-chi",
  "stage": "b",
  "kana": "Which HIRAGANA corresponds to katakana チ?",
  "answer": "ち",
  "choices": [
   [
    "ち",
    "ち — chi"
   ],
   [
    "つ",
    "つ — tsu"
   ],
   [
    "て",
    "て — te"
   ]
  ],
  "note": "チ and ち represent the same sound (chi) in different scripts."
 },
 {
  "id": "hira-tsu",
  "stage": "b",
  "kana": "Which HIRAGANA corresponds to katakana ツ?",
  "answer": "つ",
  "choices": [
   [
    "つ",
    "つ — tsu"
   ],
   [
    "て",
    "て — te"
   ],
   [
    "と",
    "と — to"
   ]
  ],
  "note": "ツ and つ represent the same sound (tsu) in different scripts."
 },
 {
  "id": "hira-te",
  "stage": "b",
  "kana": "Which HIRAGANA corresponds to katakana テ?",
  "answer": "て",
  "choices": [
   [
    "て",
    "て — te"
   ],
   [
    "と",
    "と — to"
   ],
   [
    "た",
    "た — ta"
   ]
  ],
  "note": "テ and て represent the same sound (te) in different scripts."
 },
 {
  "id": "hira-to",
  "stage": "b",
  "kana": "Which HIRAGANA corresponds to katakana ト?",
  "answer": "と",
  "choices": [
   [
    "と",
    "と — to"
   ],
   [
    "た",
    "た — ta"
   ],
   [
    "ち",
    "ち — chi"
   ]
  ],
  "note": "ト and と represent the same sound (to) in different scripts."
 },
 {
  "id": "lookalike-shi-tsu",
  "stage": "b",
  "kana": "Which is ツ (tsu), NOT シ (shi)?",
  "answer": "ツ",
  "choices": [
   [
    "シ",
    "シ — shi"
   ],
   [
    "ツ",
    "ツ — tsu"
   ]
  ],
  "note": "ツ has short marks along the top, whereas シ has short marks along the left. The long-stroke direction differs; neither is ン."
 },
 {
  "id": "meaning-clock",
  "stage": "b",
  "kana": "Which fully readable word means a clock/watch, rather than a lever?",
  "answer": "トケイ",
  "choices": [
   [
    "テコ",
    "テコ — lever"
   ],
   [
    "トケイ",
    "トケイ — clock/watch"
   ]
  ],
  "note": "トケイ is a practice spelling of 時計 (clock/watch); テコ is a lever."
 },
 {
  "id": "meaning-octopus",
  "stage": "b",
  "kana": "Which fully readable word means octopus, rather than woodpecker?",
  "answer": "タコ",
  "choices": [
   [
    "キツツキ",
    "キツツキ — woodpecker"
   ],
   [
    "タコ",
    "タコ — octopus"
   ]
  ],
  "note": "タコ is octopus and キツツキ is woodpecker. Both are natural katakana animal names."
 },
 {
  "id": "meaning-shoes",
  "stage": "b",
  "kana": "Which fully readable word means shoes, rather than a desk?",
  "answer": "クツ",
  "choices": [
   [
    "ツクエ",
    "ツクエ — desk"
   ],
   [
    "クツ",
    "クツ — shoes"
   ]
  ],
  "note": "クツ is shoes (靴); ツクエ means desk (机), usually written 机."
 }
]);
export const CHECKPOINT_INDEX=15;
const intro=k=>({id:'intro-'+k.id,mode:'introduction',stage:k.stage,kana:k.kana,base:k.base,answer:k.reading,aliases:k.aliases||[],note:k.note});
const recognition=(k,group,index)=>({id:'recognition-'+k.id,mode:'recognition',stage:k.stage,kana:k.kana,answer:k.reading,aliases:[],choices:[...group.slice(index),...group.slice(0,index)].map(x=>({value:x.reading,label:x.reading})),note:'Choose the standard Hepburn reading for this T-row katakana; チ is chi (Kunrei ti) and ツ is tsu (Kunrei tu). The corresponding hiragana sounds match.'});
const word=w=>({id:'word-'+w.id,mode:'word',stage:w.stage,kana:w.kana,answer:w.reading,aliases:w.aliases||[],meaning:w.meaning,kanji:w.kanji,note:w.note});
const contrast=c=>({id:'contrast-'+c.id,mode:'contrast',stage:c.stage,kana:c.kana,answer:c.answer,aliases:[],choices:c.choices.map(([value,label])=>({value,label})),note:c.note});
const phrase=p=>({id:'phrase-'+p.id,mode:'phrase',stage:p.stage,kana:p.kana,answer:p.reading,aliases:p.aliases||[],meaning:p.meaning,kanji:p.kanji,note:p.note});
function makeStage(stage){
 const group=KANA.filter(k=>k.stage===stage);
 return [...group.map(intro),...group.map((k,i)=>recognition(k,group,i)),...WORDS.filter(w=>w.stage===stage).map(word),...CONTRASTS.filter(c=>c.stage===stage).map(contrast)];
}
export const TASKS=Object.freeze([...makeStage('a'),...makeStage('b')]);
export const MODES=Object.freeze([
 {id:'introduction',label:'Active T-row recall',total:5},
 {id:'recognition',label:'T-row sound recognition',total:5},
 {id:'word',label:'Fully decodable Japanese words',total:10},
 {id:'contrast',label:'Script, lookalike and vocabulary contrasts',total:11}
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
