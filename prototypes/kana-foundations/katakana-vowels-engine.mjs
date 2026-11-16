// Unit 20 katakana vowels: isolated prototype; no older-unit, Account/FSRS/IndexedDB or production writes.
export const STORAGE_KEY='thiepn:kana-foundations:katakana-vowels:prototype-only:v1';
export const KANA=Object.freeze([
 {
  "id": "a",
  "kana": "ア",
  "base": "あ",
  "reading": "a",
  "stage": "a",
  "note": "ア is katakana a, representing the same vowel as hiragana あ. Different script, same basic sound."
 },
 {
  "id": "i",
  "kana": "イ",
  "base": "い",
  "reading": "i",
  "stage": "a",
  "note": "イ is katakana i, representing the same vowel as hiragana い. Different script, same basic sound."
 },
 {
  "id": "u",
  "kana": "ウ",
  "base": "う",
  "reading": "u",
  "stage": "a",
  "note": "ウ is katakana u, representing the same vowel as hiragana う. Different script, same basic sound."
 },
 {
  "id": "e",
  "kana": "エ",
  "base": "え",
  "reading": "e",
  "stage": "a",
  "note": "エ is katakana e, representing the same vowel as hiragana え. Different script, same basic sound."
 },
 {
  "id": "o",
  "kana": "オ",
  "base": "お",
  "reading": "o",
  "stage": "a",
  "note": "オ is katakana o, representing the same vowel as hiragana お. Different script, same basic sound."
 }
]);
export const WORDS=Object.freeze([
 {
  "id": "ea",
  "kana": "エア",
  "reading": "ea",
  "stage": "a",
  "meaning": "air (loanword, often in compounds)",
  "note": "エ・ア are two vowel morae. エア is genuine, and both its katakana are taught here."
 }
]);
export const EXPRESSIONS=Object.freeze([]);
export const CONTRASTS=Object.freeze([
 {
  "id": "script-a",
  "stage": "a",
  "kana": "Which symbol is KATAKANA a (the counterpart of あ)?",
  "answer": "ア",
  "choices": [
   [
    "あ",
    "あ — hiragana a"
   ],
   [
    "ア",
    "ア — katakana a"
   ]
  ],
  "note": "Hiragana あ and katakana ア have the same vowel a; the shapes differ."
 },
 {
  "id": "script-e",
  "stage": "a",
  "kana": "Which symbol is KATAKANA e (the counterpart of え)?",
  "answer": "エ",
  "choices": [
   [
    "え",
    "え — hiragana e"
   ],
   [
    "エ",
    "エ — katakana e"
   ]
  ],
  "note": "Hiragana え and katakana エ both read e."
 },
 {
  "id": "start-ice",
  "stage": "b",
  "kana": "アイス (ice cream): which taught vowel is FIRST?",
  "answer": "ア",
  "choices": [
   [
    "ア",
    "ア — a"
   ],
   [
    "イ",
    "イ — i"
   ],
   [
    "ウ",
    "ウ — u"
   ],
   [
    "エ",
    "エ — e"
   ],
   [
    "オ",
    "オ — o"
   ]
  ],
  "note": "Only the initial ア is tested in authentic アイス. All other characters are ungraded context preview for later lessons."
 },
 {
  "id": "start-event",
  "stage": "b",
  "kana": "イベント (event): which taught vowel is FIRST?",
  "answer": "イ",
  "choices": [
   [
    "イ",
    "イ — i"
   ],
   [
    "ウ",
    "ウ — u"
   ],
   [
    "エ",
    "エ — e"
   ],
   [
    "オ",
    "オ — o"
   ],
   [
    "ア",
    "ア — a"
   ]
  ],
  "note": "Only the initial イ is tested in authentic イベント. All other characters are ungraded context preview for later lessons."
 },
 {
  "id": "start-virus",
  "stage": "b",
  "kana": "ウイルス (virus): which taught vowel is FIRST?",
  "answer": "ウ",
  "choices": [
   [
    "ウ",
    "ウ — u"
   ],
   [
    "エ",
    "エ — e"
   ],
   [
    "オ",
    "オ — o"
   ],
   [
    "ア",
    "ア — a"
   ],
   [
    "イ",
    "イ — i"
   ]
  ],
  "note": "Only the initial ウ is tested in authentic ウイルス. All other characters are ungraded context preview for later lessons."
 },
 {
  "id": "start-aircon",
  "stage": "b",
  "kana": "エアコン (air conditioner): which taught vowel is FIRST?",
  "answer": "エ",
  "choices": [
   [
    "エ",
    "エ — e"
   ],
   [
    "オ",
    "オ — o"
   ],
   [
    "ア",
    "ア — a"
   ],
   [
    "イ",
    "イ — i"
   ],
   [
    "ウ",
    "ウ — u"
   ]
  ],
  "note": "Only the initial エ is tested in authentic エアコン. All other characters are ungraded context preview for later lessons."
 },
 {
  "id": "start-orange",
  "stage": "b",
  "kana": "オレンジ (orange): which taught vowel is FIRST?",
  "answer": "オ",
  "choices": [
   [
    "オ",
    "オ — o"
   ],
   [
    "ア",
    "ア — a"
   ],
   [
    "イ",
    "イ — i"
   ],
   [
    "ウ",
    "ウ — u"
   ],
   [
    "エ",
    "エ — e"
   ]
  ],
  "note": "Only the initial オ is tested in authentic オレンジ. All other characters are ungraded context preview for later lessons."
 },
 {
  "id": "hira-a",
  "stage": "b",
  "kana": "Which HIRAGANA corresponds to katakana ア?",
  "answer": "あ",
  "choices": [
   [
    "あ",
    "あ — a"
   ],
   [
    "い",
    "い — i"
   ],
   [
    "う",
    "う — u"
   ]
  ],
  "note": "ア and あ both read a, but are different scripts."
 },
 {
  "id": "hira-i",
  "stage": "b",
  "kana": "Which HIRAGANA corresponds to katakana イ?",
  "answer": "い",
  "choices": [
   [
    "い",
    "い — i"
   ],
   [
    "う",
    "う — u"
   ],
   [
    "え",
    "え — e"
   ]
  ],
  "note": "イ and い both read i, but are different scripts."
 },
 {
  "id": "hira-u",
  "stage": "b",
  "kana": "Which HIRAGANA corresponds to katakana ウ?",
  "answer": "う",
  "choices": [
   [
    "う",
    "う — u"
   ],
   [
    "え",
    "え — e"
   ],
   [
    "お",
    "お — o"
   ]
  ],
  "note": "ウ and う both read u, but are different scripts."
 },
 {
  "id": "hira-e",
  "stage": "b",
  "kana": "Which HIRAGANA corresponds to katakana エ?",
  "answer": "え",
  "choices": [
   [
    "え",
    "え — e"
   ],
   [
    "お",
    "お — o"
   ],
   [
    "あ",
    "あ — a"
   ]
  ],
  "note": "エ and え both read e, but are different scripts."
 },
 {
  "id": "hira-o",
  "stage": "b",
  "kana": "Which HIRAGANA corresponds to katakana オ?",
  "answer": "お",
  "choices": [
   [
    "お",
    "お — o"
   ],
   [
    "あ",
    "あ — a"
   ],
   [
    "い",
    "い — i"
   ]
  ],
  "note": "オ and お both read o, but are different scripts."
 }
]);
export const CHECKPOINT_INDEX=13;
const intro=k=>({id:'intro-'+k.id,mode:'introduction',stage:k.stage,kana:k.kana,base:k.base,answer:k.reading,aliases:k.aliases||[],note:k.note});
const recognition=(k,group,index)=>({id:'recognition-'+k.id,mode:'recognition',stage:k.stage,kana:k.kana,answer:k.reading,aliases:[],choices:[...group.slice(index),...group.slice(0,index)].map(x=>({value:x.reading,label:x.reading})),note:'Choose the vowel sound of this katakana. It matches the corresponding hiragana vowel.'});
const word=w=>({id:'word-'+w.id,mode:'word',stage:w.stage,kana:w.kana,answer:w.reading,aliases:w.aliases||[],meaning:w.meaning,kanji:w.kanji,note:w.note});
const contrast=c=>({id:'contrast-'+c.id,mode:'contrast',stage:c.stage,kana:c.kana,answer:c.answer,aliases:[],choices:c.choices.map(([value,label])=>({value,label})),note:c.note});
const phrase=p=>({id:'phrase-'+p.id,mode:'phrase',stage:p.stage,kana:p.kana,answer:p.reading,aliases:p.aliases||[],meaning:p.meaning,kanji:p.kanji,note:p.note});
function makeStage(stage){
 const group=KANA.filter(k=>k.stage===stage);
 return [...group.map(intro),...group.map((k,i)=>recognition(k,group,i)),...WORDS.filter(w=>w.stage===stage).map(word),...CONTRASTS.filter(c=>c.stage===stage).map(contrast)];
}
export const TASKS=Object.freeze([...makeStage('a'),...makeStage('b')]);
export const MODES=Object.freeze([
 {id:'introduction',label:'Active vowel recall',total:5},
 {id:'recognition',label:'Vowel recognition',total:5},
 {id:'word',label:'Complete real-word reading',total:1},
 {id:'contrast',label:'Script correspondence and contextual spotting',total:12}
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
