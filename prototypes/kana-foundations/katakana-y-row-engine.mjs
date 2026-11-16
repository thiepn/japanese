// Unit 27 Y-row: exactly three basic kana, isolated prototype; no older learner, Account or FSRS writes.
export const STORAGE_KEY='thiepn:kana-foundations:katakana-y-row:prototype-only:v1';
export const PREVIOUS_KATAKANA='アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモ';
export const KANA=Object.freeze([
 {
  "id": "ya",
  "kana": "ヤ",
  "base": "や",
  "reading": "ya",
  "stage": "a",
  "note": "ヤ is the standard basic katakana ya, corresponding to hiragana や. Compare its diagonal crossed shape with the earlier マ (ma). There is no basic yi or ye character in the modern Y-row."
 },
 {
  "id": "yu",
  "kana": "ユ",
  "base": "ゆ",
  "reading": "yu",
  "stage": "a",
  "note": "ユ is the standard basic katakana yu, corresponding to hiragana ゆ. The bottom stroke extends to the left of the vertical; contrast the older コ (ko). Small ュ is a different, later combination character."
 },
 {
  "id": "yo",
  "kana": "ヨ",
  "base": "よ",
  "reading": "yo",
  "stage": "a",
  "note": "ヨ is the standard basic katakana yo, corresponding to hiragana よ. It has three horizontal strokes; the older エ (e) and コ (ko) have different structures. Small ョ is a later combination character."
 }
]);
export const WORDS=Object.freeze([
 {
  "id": "yama",
  "kana": "ヤマ",
  "reading": "yama",
  "stage": "a",
  "meaning": "mountain",
  "kanji": "山",
  "note": "ヤ・マ are two morae. ヤマ is an authentic reading of mountain (山); in ordinary writing 山 or やま is much more usual than katakana. The katakana here is intentional decoding practice."
 },
 {
  "id": "yuki",
  "kana": "ユキ",
  "reading": "yuki",
  "stage": "a",
  "meaning": "snow",
  "kanji": "雪",
  "note": "ユ・キ are two morae. ユキ represents snow (雪); normal prose generally uses 雪 or ゆき. Full katakana here is an explicitly marked script-decoding exercise."
 },
 {
  "id": "yoko",
  "kana": "ヨコ",
  "reading": "yoko",
  "stage": "a",
  "meaning": "side; horizontal direction",
  "kanji": "横",
  "note": "ヨ・コ are two morae. ヨコ means side or horizontal (横), ordinarily written 横 or よこ. Katakana is used here for controlled reading practice."
 },
 {
  "id": "yukata",
  "kana": "ユカタ",
  "reading": "yukata",
  "stage": "b",
  "meaning": "yukata; lightweight Japanese summer robe",
  "kanji": "浴衣",
  "note": "ユ・カ・タ are three morae. ユカタ is a fully readable form of yukata (浴衣), commonly seen in fashion or retail headings; 浴衣 is also standard writing."
 },
 {
  "id": "yakiimo",
  "kana": "ヤキイモ",
  "reading": "yakiimo",
  "stage": "b",
  "meaning": "roasted sweet potato",
  "kanji": "焼き芋",
  "note": "ヤ・キ・イ・モ are four morae. ヤキイモ means roasted sweet potato (焼き芋), common at food stalls. The adjacent キ and イ are two full morae, not a long-vowel bar or a small kana."
 },
 {
  "id": "yamaimo",
  "kana": "ヤマイモ",
  "reading": "yamaimo",
  "stage": "b",
  "meaning": "Japanese yam",
  "kanji": "山芋",
  "note": "ヤ・マ・イ・モ are four morae. ヤマイモ means Japanese yam (山芋) and is a natural produce-label spelling, distinct from roasted sweet potato (ヤキイモ)."
 },
 {
  "id": "yasai",
  "kana": "ヤサイ",
  "reading": "yasai",
  "stage": "b",
  "meaning": "vegetables",
  "kanji": "野菜",
  "note": "ヤ・サ・イ are three morae. ヤサイ means vegetables (野菜); ordinary text usually writes 野菜 or やさい. Full katakana is a marked reading-exercise form or stylized label."
 },
 {
  "id": "yane",
  "kana": "ヤネ",
  "reading": "yane",
  "stage": "b",
  "meaning": "roof",
  "kanji": "屋根",
  "note": "ヤ・ネ are two morae. ヤネ means roof (屋根), typically written 屋根 or やね in normal prose; katakana is used here for beginner decoding practice."
 }
]);
export const EXPRESSIONS=Object.freeze([]);
export const CONTRASTS=Object.freeze([
 {
  "id": "script-yu",
  "stage": "a",
  "kana": "Which is KATAKANA yu, matching hiragana ゆ?",
  "answer": "ユ",
  "choices": [
   [
    "ゆ",
    "ゆ — hiragana yu"
   ],
   [
    "ユ",
    "ユ — katakana yu"
   ]
  ],
  "note": "Both read yu; ユ is katakana, and ゆ is hiragana. The small ュ is a different future character."
 },
 {
  "id": "script-yo",
  "stage": "a",
  "kana": "Which is KATAKANA yo, matching hiragana よ?",
  "answer": "ヨ",
  "choices": [
   [
    "よ",
    "よ — hiragana yo"
   ],
   [
    "ヨ",
    "ヨ — katakana yo"
   ]
  ],
  "note": "Both read yo; ヨ is katakana, and よ is hiragana. The small ョ is a different future character."
 },
 {
  "id": "hira-ya",
  "stage": "b",
  "kana": "Which HIRAGANA corresponds to katakana ヤ?",
  "answer": "や",
  "choices": [
   [
    "や",
    "や — ya"
   ],
   [
    "ゆ",
    "ゆ — yu"
   ],
   [
    "よ",
    "よ — yo"
   ]
  ],
  "note": "ヤ and や have identical basic sounds (ya) but different scripts."
 },
 {
  "id": "hira-yu",
  "stage": "b",
  "kana": "Which HIRAGANA corresponds to katakana ユ?",
  "answer": "ゆ",
  "choices": [
   [
    "ゆ",
    "ゆ — yu"
   ],
   [
    "よ",
    "よ — yo"
   ],
   [
    "や",
    "や — ya"
   ]
  ],
  "note": "ユ and ゆ have identical basic sounds (yu) but different scripts."
 },
 {
  "id": "hira-yo",
  "stage": "b",
  "kana": "Which HIRAGANA corresponds to katakana ヨ?",
  "answer": "よ",
  "choices": [
   [
    "よ",
    "よ — yo"
   ],
   [
    "や",
    "や — ya"
   ],
   [
    "ゆ",
    "ゆ — yu"
   ]
  ],
  "note": "ヨ and よ have identical basic sounds (yo) but different scripts."
 },
 {
  "id": "roof",
  "stage": "b",
  "kana": "Which word means a roof, not a mountain?",
  "answer": "ヤネ",
  "choices": [
   [
    "ヤマ",
    "ヤマ — mountain"
   ],
   [
    "ヤネ",
    "ヤネ — roof"
   ]
  ],
  "note": "ヤネ (屋根) means roof, while ヤマ (山) means mountain; both are usually written in kanji or hiragana."
 },
 {
  "id": "yam",
  "stage": "b",
  "kana": "At a food stall, which means ROASTED sweet potato, rather than Japanese yam?",
  "answer": "ヤキイモ",
  "choices": [
   [
    "ヤマイモ",
    "ヤマイモ — Japanese yam"
   ],
   [
    "ヤキイモ",
    "ヤキイモ — roasted sweet potato"
   ]
  ],
  "note": "ヤキイモ means roasted sweet potato (焼き芋); ヤマイモ is Japanese yam (山芋). The distinction is not simply script style."
 },
 {
  "id": "yukata",
  "stage": "b",
  "kana": "Which word names a Japanese summer robe rather than vegetables?",
  "answer": "ユカタ",
  "choices": [
   [
    "ヤサイ",
    "ヤサイ — vegetables"
   ],
   [
    "ユカタ",
    "ユカタ — summer robe"
   ]
  ],
  "note": "ユカタ is a Japanese lightweight summer robe (浴衣); ヤサイ means vegetables (野菜). Both are fully decodable."
 }
]);
export const CHECKPOINT_INDEX=11;
const intro=k=>({id:'intro-'+k.id,mode:'introduction',stage:k.stage,kana:k.kana,base:k.base,answer:k.reading,aliases:k.aliases||[],note:k.note});
const recognition=(k,group,index)=>({id:'recognition-'+k.id,mode:'recognition',stage:k.stage,kana:k.kana,answer:k.reading,aliases:[],choices:[...group.slice(index),...group.slice(0,index)].map(x=>({value:x.reading,label:x.reading})),note:'Choose one of the three standard basic Y-row readings: ヤ ya, ユ yu or ヨ yo. There is no basic yi or ye in the modern katakana chart.'});
const word=w=>({id:'word-'+w.id,mode:'word',stage:w.stage,kana:w.kana,answer:w.reading,aliases:w.aliases||[],meaning:w.meaning,kanji:w.kanji,note:w.note});
const contrast=c=>({id:'contrast-'+c.id,mode:'contrast',stage:c.stage,kana:c.kana,answer:c.answer,aliases:[],choices:c.choices.map(([value,label])=>({value,label})),note:c.note});
const phrase=p=>({id:'phrase-'+p.id,mode:'phrase',stage:p.stage,kana:p.kana,answer:p.reading,aliases:p.aliases||[],meaning:p.meaning,kanji:p.kanji,note:p.note});
function makeStage(stage){
 const group=KANA.filter(k=>k.stage===stage);
 return [...group.map(intro),...group.map((k,i)=>recognition(k,group,i)),...WORDS.filter(w=>w.stage===stage).map(word),...CONTRASTS.filter(c=>c.stage===stage).map(contrast)];
}
export const TASKS=Object.freeze([...makeStage('a'),...makeStage('b')]);
export const MODES=Object.freeze([
 {id:'introduction',label:'Active Y-row recall',total:3},
 {id:'recognition',label:'Three Y-row sound recognitions',total:3},
 {id:'word',label:'Eight fully decodable real words',total:8},
 {id:'contrast',label:'Scripts and contextual word meanings',total:8}
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
