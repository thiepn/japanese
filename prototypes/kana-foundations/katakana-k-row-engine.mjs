// Unit 21: katakana K-row, isolated from historical progress, Account/FSRS, media and production.
export const STORAGE_KEY='thiepn:kana-foundations:katakana-k-row:prototype-only:v1';
export const PREVIOUS_KATAKANA='アイウエオ';
export const KANA=Object.freeze([
 {
  "id": "ka",
  "kana": "カ",
  "base": "か",
  "reading": "ka",
  "stage": "a",
  "note": "カ (ka) is the katakana counterpart of hiragana か. The vowel and consonant sound remain the same. Keep カ distinct from ク and ケ."
 },
 {
  "id": "ki",
  "kana": "キ",
  "base": "き",
  "reading": "ki",
  "stage": "a",
  "note": "キ (ki) corresponds to hiragana き. This angular sign has two horizontal strokes and a vertical stroke; compare the shape deliberately."
 },
 {
  "id": "ku",
  "kana": "ク",
  "base": "く",
  "reading": "ku",
  "stage": "a",
  "note": "ク (ku) corresponds to hiragana く. This form uses angled strokes; do not confuse it with ケ (ke)."
 },
 {
  "id": "ke",
  "kana": "ケ",
  "base": "け",
  "reading": "ke",
  "stage": "a",
  "note": "ケ (ke) corresponds to hiragana け. Compare the extra intersecting stroke with the simpler ク (ku)."
 },
 {
  "id": "ko",
  "kana": "コ",
  "base": "こ",
  "reading": "ko",
  "stage": "a",
  "note": "コ (ko) corresponds to hiragana こ. Recognize the rectangular open-left shape; do not mistake it for the vowel エ."
 }
]);
export const WORDS=Object.freeze([
 {
  "id": "kaki",
  "kana": "カキ",
  "reading": "kaki",
  "stage": "a",
  "meaning": "oyster (in seafood context)",
  "kanji": "牡蠣",
  "note": "カ・キ: two morae. カキ is a standard way to write oyster on seafood labels. The same reading can refer to persimmon (柿) in other contexts; context determines meaning."
 },
 {
  "id": "kiku",
  "kana": "キク",
  "reading": "kiku",
  "stage": "a",
  "meaning": "chrysanthemum flower",
  "kanji": "菊",
  "note": "キ・ク: two morae. Plant names can be written in katakana, as in a botany label. キク (菊) here means chrysanthemum; きく can also be a different verb."
 },
 {
  "id": "koke",
  "kana": "コケ",
  "reading": "koke",
  "stage": "a",
  "meaning": "moss",
  "kanji": "苔",
  "note": "コ・ケ: two morae. コケ is the Japanese word for moss and is a natural katakana writing in nature contexts."
 },
 {
  "id": "kiui",
  "kana": "キウイ",
  "reading": "kiui",
  "stage": "b",
  "meaning": "kiwifruit",
  "note": "キ・ウ・イ: three vowel/consonant morae. A common genuine katakana loanword; every character was introduced in Units 20–21."
 },
 {
  "id": "kokoa",
  "kana": "ココア",
  "reading": "kokoa",
  "stage": "b",
  "meaning": "cocoa drink; cocoa",
  "note": "コ・コ・ア: three morae. The genuine loanword ココア is often used for a cocoa drink; contrast カカオ (cacao)."
 },
 {
  "id": "kakao",
  "kana": "カカオ",
  "reading": "kakao",
  "stage": "b",
  "meaning": "cacao; cacao tree/bean",
  "note": "カ・カ・オ: three morae. カカオ refers to cacao, the source of chocolate. It is not the same word as ココア (cocoa)."
 },
 {
  "id": "eko",
  "kana": "エコ",
  "reading": "eko",
  "stage": "b",
  "meaning": "eco; environmentally friendly",
  "note": "エ・コ: two morae. エコ is a common borrowed shorthand meaning eco or environmentally friendly, used alone and in compounds."
 }
]);
export const EXPRESSIONS=Object.freeze([]);
export const CONTRASTS=Object.freeze([
 {
  "id": "script-ka",
  "stage": "a",
  "kana": "Which is the KATAKANA form of か (ka)?",
  "answer": "カ",
  "choices": [
   [
    "か",
    "か"
   ],
   [
    "カ",
    "カ"
   ]
  ],
  "note": "か and カ represent ka in different scripts. Select the katakana shape カ."
 },
 {
  "id": "script-ke",
  "stage": "a",
  "kana": "Which is the KATAKANA form of け (ke)?",
  "answer": "ケ",
  "choices": [
   [
    "け",
    "け"
   ],
   [
    "ケ",
    "ケ"
   ]
  ],
  "note": "け and ケ represent ke in different scripts. Select the katakana form ケ."
 },
 {
  "id": "hira-ka",
  "stage": "b",
  "kana": "Which HIRAGANA corresponds to katakana カ?",
  "answer": "か",
  "choices": [
   [
    "か",
    "か"
   ],
   [
    "き",
    "き"
   ],
   [
    "く",
    "く"
   ]
  ],
  "note": "カ and か have the same sound ka; the writing systems differ."
 },
 {
  "id": "hira-ki",
  "stage": "b",
  "kana": "Which HIRAGANA corresponds to katakana キ?",
  "answer": "き",
  "choices": [
   [
    "き",
    "き"
   ],
   [
    "く",
    "く"
   ],
   [
    "け",
    "け"
   ]
  ],
  "note": "キ and き have the same sound ki; the writing systems differ."
 },
 {
  "id": "hira-ku",
  "stage": "b",
  "kana": "Which HIRAGANA corresponds to katakana ク?",
  "answer": "く",
  "choices": [
   [
    "く",
    "く"
   ],
   [
    "け",
    "け"
   ],
   [
    "こ",
    "こ"
   ]
  ],
  "note": "ク and く have the same sound ku; the writing systems differ."
 },
 {
  "id": "hira-ke",
  "stage": "b",
  "kana": "Which HIRAGANA corresponds to katakana ケ?",
  "answer": "け",
  "choices": [
   [
    "け",
    "け"
   ],
   [
    "こ",
    "こ"
   ],
   [
    "か",
    "か"
   ]
  ],
  "note": "ケ and け have the same sound ke; the writing systems differ."
 },
 {
  "id": "hira-ko",
  "stage": "b",
  "kana": "Which HIRAGANA corresponds to katakana コ?",
  "answer": "こ",
  "choices": [
   [
    "こ",
    "こ"
   ],
   [
    "か",
    "か"
   ],
   [
    "き",
    "き"
   ]
  ],
  "note": "コ and こ have the same sound ko; the writing systems differ."
 },
 {
  "id": "cocoa",
  "stage": "b",
  "kana": "Which Japanese word means a cocoa drink, rather than cacao?",
  "answer": "ココア",
  "choices": [
   [
    "ココア",
    "ココア"
   ],
   [
    "カカオ",
    "カカオ"
   ]
  ],
  "note": "ココア is cocoa; カカオ is cacao. Both words are authentic and can be read entirely with known katakana."
 },
 {
  "id": "kiwi",
  "stage": "b",
  "kana": "Which word is the genuine katakana name for kiwifruit?",
  "answer": "キウイ",
  "choices": [
   [
    "キウイ",
    "キウイ"
   ],
   [
    "カキ",
    "カキ"
   ],
   [
    "キク",
    "キク"
   ]
  ],
  "note": "キウイ means kiwifruit; カキ is oyster in this lesson's seafood context, and キク is chrysanthemum."
 },
 {
  "id": "moss",
  "stage": "b",
  "kana": "Which word names moss, not a chrysanthemum?",
  "answer": "コケ",
  "choices": [
   [
    "キク",
    "キク"
   ],
   [
    "コケ",
    "コケ"
   ]
  ],
  "note": "コケ means moss (苔), while キク means chrysanthemum (菊). Both are legitimate katakana nature labels."
 }
]);
export const CHECKPOINT_INDEX=15;
const intro=k=>({id:'intro-'+k.id,mode:'introduction',stage:k.stage,kana:k.kana,base:k.base,answer:k.reading,aliases:k.aliases||[],note:k.note});
const recognition=(k,group,index)=>({id:'recognition-'+k.id,mode:'recognition',stage:k.stage,kana:k.kana,answer:k.reading,aliases:[],choices:[...group.slice(index),...group.slice(0,index)].map(x=>({value:x.reading,label:x.reading})),note:'Choose the correct K-row reading of this katakana. It matches the sound of the corresponding hiragana.'});
const word=w=>({id:'word-'+w.id,mode:'word',stage:w.stage,kana:w.kana,answer:w.reading,aliases:w.aliases||[],meaning:w.meaning,kanji:w.kanji,note:w.note});
const contrast=c=>({id:'contrast-'+c.id,mode:'contrast',stage:c.stage,kana:c.kana,answer:c.answer,aliases:[],choices:c.choices.map(([value,label])=>({value,label})),note:c.note});
const phrase=p=>({id:'phrase-'+p.id,mode:'phrase',stage:p.stage,kana:p.kana,answer:p.reading,aliases:p.aliases||[],meaning:p.meaning,kanji:p.kanji,note:p.note});
function makeStage(stage){
 const group=KANA.filter(k=>k.stage===stage);
 return [...group.map(intro),...group.map((k,i)=>recognition(k,group,i)),...WORDS.filter(w=>w.stage===stage).map(word),...CONTRASTS.filter(c=>c.stage===stage).map(contrast)];
}
export const TASKS=Object.freeze([...makeStage('a'),...makeStage('b')]);
export const MODES=Object.freeze([
 {id:'introduction',label:'Active K-row recall',total:5},
 {id:'recognition',label:'K-row shape recognition',total:5},
 {id:'word',label:'Fully decodable authentic words',total:7},
 {id:'contrast',label:'Script and word meaning contrasts',total:10}
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
