// Kana Foundations Unit 22: katakana S-row, isolated prototype without historical or Account/FSRS writes.
export const STORAGE_KEY='thiepn:kana-foundations:katakana-s-row:prototype-only:v1';
export const PREVIOUS_KATAKANA='アイウエオカキクケコ';
export const KANA=Object.freeze([
 {
  "id": "sa",
  "kana": "サ",
  "base": "さ",
  "reading": "sa",
  "stage": "a",
  "note": "サ is katakana sa, matching hiragana さ. Its angular lines are different from the hiragana shape."
 },
 {
  "id": "shi",
  "kana": "シ",
  "base": "し",
  "reading": "shi",
  "aliases": [
   "si"
  ],
  "stage": "a",
  "note": "シ is shi in standard Hepburn romanization (si in Kunrei). Its three short strokes rise toward the right; distinguish it from the later kana ツ (tsu), which is not taught here."
 },
 {
  "id": "su",
  "kana": "ス",
  "base": "す",
  "reading": "su",
  "stage": "a",
  "note": "ス is katakana su, matching hiragana す. Notice the two diagonal directions and compare with the vowels."
 },
 {
  "id": "se",
  "kana": "セ",
  "base": "せ",
  "reading": "se",
  "stage": "a",
  "note": "セ is katakana se, matching hiragana せ. Notice its crossed horizontal and vertical strokes."
 },
 {
  "id": "so",
  "kana": "ソ",
  "base": "そ",
  "reading": "so",
  "stage": "a",
  "note": "ソ is katakana so, matching hiragana そ. It resembles part of シ but does not represent the same sound; study the stroke positions."
 }
]);
export const WORDS=Object.freeze([
 {
  "id": "sushi",
  "kana": "スシ",
  "reading": "sushi",
  "aliases": [
   "susi"
  ],
  "stage": "a",
  "meaning": "sushi",
  "kanji": "寿司",
  "note": "ス・シ are two morae. スシ is real katakana spelling in instructional and menu contexts; 寿司 and すし also occur. シ is shi (si in Kunrei)."
 },
 {
  "id": "isu",
  "kana": "イス",
  "reading": "isu",
  "stage": "a",
  "meaning": "chair",
  "kanji": "椅子",
  "note": "イ・ス form two morae, both already taught. イス is a genuine and common kana spelling for a chair."
 },
 {
  "id": "ashi",
  "kana": "アシ",
  "reading": "ashi",
  "aliases": [
   "asi"
  ],
  "stage": "a",
  "meaning": "leg; foot",
  "kanji": "足",
  "note": "ア・シ form two morae. アシ appears in katakana reading exercises; 足/あし are more typical general spellings. The word means leg or foot by context."
 },
 {
  "id": "suika",
  "kana": "スイカ",
  "reading": "suika",
  "stage": "b",
  "meaning": "watermelon",
  "kanji": "西瓜",
  "note": "ス・イ・カ form three morae. スイカ is a common katakana writing of watermelon."
 },
 {
  "id": "asa",
  "kana": "アサ",
  "reading": "asa",
  "stage": "b",
  "meaning": "morning",
  "kanji": "朝",
  "note": "ア・サ: two morae. アサ is a legitimate katakana exercise spelling, but 朝/あさ are the usual everyday writings."
 },
 {
  "id": "ishi",
  "kana": "イシ",
  "reading": "ishi",
  "aliases": [
   "isi"
  ],
  "stage": "b",
  "meaning": "stone",
  "kanji": "石",
  "note": "イ・シ: two morae. Here イシ stands for 石 (stone); いし can also refer to intention as 意思. Usually 石/いし in everyday writing."
 },
 {
  "id": "uso",
  "kana": "ウソ",
  "reading": "uso",
  "stage": "b",
  "meaning": "lie; falsehood",
  "kanji": "嘘",
  "note": "ウ・ソ: two morae. ウソ is a natural katakana spelling for a lie or falsehood (嘘)."
 },
 {
  "id": "esa",
  "kana": "エサ",
  "reading": "esa",
  "stage": "b",
  "meaning": "animal feed; bait",
  "kanji": "餌",
  "note": "エ・サ: two morae. エサ is commonly written in katakana for animal feed or bait."
 },
 {
  "id": "seki",
  "kana": "セキ",
  "reading": "seki",
  "stage": "b",
  "meaning": "seat (place to sit)",
  "kanji": "席",
  "note": "セ・キ: two morae. Here the meaning is 席 (seat); せき can also mean cough (咳). 席 is more usual in everyday writing."
 },
 {
  "id": "sake",
  "kana": "サケ",
  "reading": "sake",
  "stage": "b",
  "meaning": "salmon (fish)",
  "kanji": "鮭",
  "note": "サ・ケ: two morae. サケ is standard for salmon in food and biology contexts; さけ (酒) can instead mean an alcoholic drink. The fish meaning is assessed here."
 }
]);
export const EXPRESSIONS=Object.freeze([]);
export const CONTRASTS=Object.freeze([
 {
  "id": "script-shi",
  "stage": "a",
  "kana": "Which is KATAKANA shi, corresponding to し?",
  "answer": "シ",
  "choices": [
   [
    "し",
    "し — hiragana shi"
   ],
   [
    "シ",
    "シ — katakana shi"
   ]
  ],
  "note": "し and シ represent the same sound shi. Select the katakana form."
 },
 {
  "id": "script-se",
  "stage": "a",
  "kana": "Which is KATAKANA se, corresponding to せ?",
  "answer": "セ",
  "choices": [
   [
    "せ",
    "せ — hiragana se"
   ],
   [
    "セ",
    "セ — katakana se"
   ]
  ],
  "note": "せ is hiragana, and セ is the katakana counterpart."
 },
 {
  "id": "hira-sa",
  "stage": "b",
  "kana": "Which HIRAGANA corresponds to katakana サ?",
  "answer": "さ",
  "choices": [
   [
    "さ",
    "さ — sa"
   ],
   [
    "し",
    "し — shi"
   ],
   [
    "す",
    "す — su"
   ]
  ],
  "note": "サ and さ represent the same sound  sa, in different scripts."
 },
 {
  "id": "hira-shi",
  "stage": "b",
  "kana": "Which HIRAGANA corresponds to katakana シ?",
  "answer": "し",
  "choices": [
   [
    "し",
    "し — shi"
   ],
   [
    "す",
    "す — su"
   ],
   [
    "せ",
    "せ — se"
   ]
  ],
  "note": "シ and し represent the same sound shi, in different scripts."
 },
 {
  "id": "hira-su",
  "stage": "b",
  "kana": "Which HIRAGANA corresponds to katakana ス?",
  "answer": "す",
  "choices": [
   [
    "す",
    "す — su"
   ],
   [
    "せ",
    "せ — se"
   ],
   [
    "そ",
    "そ — so"
   ]
  ],
  "note": "ス and す represent the same sound  su, in different scripts."
 },
 {
  "id": "hira-se",
  "stage": "b",
  "kana": "Which HIRAGANA corresponds to katakana セ?",
  "answer": "せ",
  "choices": [
   [
    "せ",
    "せ — se"
   ],
   [
    "そ",
    "そ — so"
   ],
   [
    "さ",
    "さ — sa"
   ]
  ],
  "note": "セ and せ represent the same sound  se, in different scripts."
 },
 {
  "id": "hira-so",
  "stage": "b",
  "kana": "Which HIRAGANA corresponds to katakana ソ?",
  "answer": "そ",
  "choices": [
   [
    "そ",
    "そ — so"
   ],
   [
    "さ",
    "さ — sa"
   ],
   [
    "し",
    "し — shi"
   ]
  ],
  "note": "ソ and そ represent the same sound  so, in different scripts."
 },
 {
  "id": "watermelon",
  "stage": "b",
  "kana": "Which word means watermelon, not sushi?",
  "answer": "スイカ",
  "choices": [
   [
    "スシ",
    "スシ — sushi"
   ],
   [
    "スイカ",
    "スイカ — watermelon"
   ]
  ],
  "note": "スイカ means watermelon, while スシ refers to sushi. Both are fully decodable."
 },
 {
  "id": "seat",
  "stage": "b",
  "kana": "Which word means a seat, not a stone?",
  "answer": "セキ",
  "choices": [
   [
    "イシ",
    "イシ — stone"
   ],
   [
    "セキ",
    "セキ — seat"
   ]
  ],
  "note": "セキ stands for 席 (seat); イシ stands for 石 (stone). In regular prose, their kanji are common."
 },
 {
  "id": "lie",
  "stage": "b",
  "kana": "Which word means a lie, not morning?",
  "answer": "ウソ",
  "choices": [
   [
    "アサ",
    "アサ — morning"
   ],
   [
    "ウソ",
    "ウソ — lie"
   ]
  ],
  "note": "ウソ means falsehood; アサ represents morning (usually 朝 or あさ)."
 },
 {
  "id": "salmon",
  "stage": "b",
  "kana": "Which word means salmon, not animal bait?",
  "answer": "サケ",
  "choices": [
   [
    "エサ",
    "エサ — bait / feed"
   ],
   [
    "サケ",
    "サケ — salmon"
   ]
  ],
  "note": "サケ (鮭) means salmon in fish contexts; エサ (餌) is feed or bait. A separate さけ (酒) can mean an alcoholic drink."
 }
]);
export const CHECKPOINT_INDEX=15;
const intro=k=>({id:'intro-'+k.id,mode:'introduction',stage:k.stage,kana:k.kana,base:k.base,answer:k.reading,aliases:k.aliases||[],note:k.note});
const recognition=(k,group,index)=>({id:'recognition-'+k.id,mode:'recognition',stage:k.stage,kana:k.kana,answer:k.reading,aliases:[],choices:[...group.slice(index),...group.slice(0,index)].map(x=>({value:x.reading,label:x.reading})),note:'Choose the S-row romanization for this katakana. シ is written shi in Hepburn (si in Kunrei). Katakana and hiragana have the same basic sounds.'});
const word=w=>({id:'word-'+w.id,mode:'word',stage:w.stage,kana:w.kana,answer:w.reading,aliases:w.aliases||[],meaning:w.meaning,kanji:w.kanji,note:w.note});
const contrast=c=>({id:'contrast-'+c.id,mode:'contrast',stage:c.stage,kana:c.kana,answer:c.answer,aliases:[],choices:c.choices.map(([value,label])=>({value,label})),note:c.note});
const phrase=p=>({id:'phrase-'+p.id,mode:'phrase',stage:p.stage,kana:p.kana,answer:p.reading,aliases:p.aliases||[],meaning:p.meaning,kanji:p.kanji,note:p.note});
function makeStage(stage){
 const group=KANA.filter(k=>k.stage===stage);
 return [...group.map(intro),...group.map((k,i)=>recognition(k,group,i)),...WORDS.filter(w=>w.stage===stage).map(word),...CONTRASTS.filter(c=>c.stage===stage).map(contrast)];
}
export const TASKS=Object.freeze([...makeStage('a'),...makeStage('b')]);
export const MODES=Object.freeze([
 {id:'introduction',label:'Active S-row recall',total:5},
 {id:'recognition',label:'S-row sound recognition',total:5},
 {id:'word',label:'Authentic fully decodable words',total:10},
 {id:'contrast',label:'Script and word-meaning contrasts',total:11}
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
