// Kana Foundations Unit 03: the S-row, including し = shi in Hepburn.
// Isolated progress and ungraded practice; Units 01–02 and canonical Account/FSRS remain untouched.
export const STORAGE_KEY='thiepn:kana-foundations:s-row:prototype-only:v1';
export const KANA=Object.freeze([
 {id:'sa',kana:'さ',reading:'sa',note:'S-row + a: a steady sa sound.'},
 {id:'shi',kana:'し',reading:'shi',aliases:['si'],note:'The important exception: し is shi in Hepburn, not English see. The alternative spelling si is accepted in typed answers (Kunrei-shiki).'},
 {id:'su',kana:'す',reading:'su',note:'S-row + u. In natural speech, the u may be quiet; do not add an English oo glide.'},
 {id:'se',kana:'せ',reading:'se',note:'S-row + e. Keep the e short, not English say.'},
 {id:'so',kana:'そ',reading:'so',note:'S-row + o. Avoid an English oh ending.'}
]);
export const WORDS=Object.freeze([
 {id:'kasa',kana:'かさ',reading:'kasa',meaning:'umbrella',kanji:'傘'},
 {id:'shio',kana:'しお',reading:'shio',aliases:['sio'],meaning:'salt',kanji:'塩'},
 {id:'sushi',kana:'すし',reading:'sushi',aliases:['susi'],meaning:'sushi',kanji:'寿司'},
 {id:'sekai',kana:'せかい',reading:'sekai',meaning:'world',kanji:'世界'},
 {id:'soko',kana:'そこ',reading:'soko',meaning:'there (near the listener)',kanji:'—'}
]);
const intro=KANA.map(v=>({id:'intro-'+v.id,mode:'introduction',kana:v.kana,answer:v.reading,aliases:v.aliases||[],sourceId:v.id,note:v.note}));
const recognition=KANA.map((v,i)=>({id:'recognition-'+v.id,mode:'recognition',kana:v.kana,answer:v.reading,aliases:[],sourceId:v.id,options:[...KANA.slice(i),...KANA.slice(0,i)].map(x=>x.reading)}));
const decoding=WORDS.map(v=>({id:'word-'+v.id,mode:'decoding',kana:v.kana,answer:v.reading,aliases:v.aliases||[],sourceId:v.id,meaning:v.meaning,kanji:v.kanji}));
export const TASKS=Object.freeze([...intro,...recognition,...decoding]);
const byId=Object.fromEntries(TASKS.map(t=>[t.id,t]));
export function initialState(){return {schema:1,index:0,paused:true,checking:false,feedback:null,records:[],corrections:[],finished:false};}
export function normalize(value){return typeof value==='string'?value.normalize('NFKC').trim().toLowerCase().replace(/[\s\u3000-]/g,''):'';}
export function validState(s){
 if(!s||typeof s!=='object'||s.schema!==1||!Number.isInteger(s.index)
  ||s.index<0||s.index>TASKS.length+TASKS.length||typeof s.paused!=='boolean'
  ||typeof s.checking!=='boolean'||typeof s.finished!=='boolean'
  ||!(s.feedback===null||(s.feedback&&typeof s.feedback==='object'&&[true,false,null].includes(s.feedback.correct)))
  ||!Array.isArray(s.records)||s.records.length>30||!Array.isArray(s.corrections)
  ||s.corrections.length>TASKS.length||new Set(s.corrections).size!==s.corrections.length
  ||!s.corrections.every(id=>Boolean(byId[id]))||s.index>TASKS.length+s.corrections.length)return false;
 if(s.finished&&(s.index!==TASKS.length+s.corrections.length||s.feedback!==null))return false;
 if(!s.finished&&s.index>=TASKS.length+s.corrections.length)return false;
 const seen=new Set();
 for(const r of s.records){
  if(!r||!byId[r.taskId]||typeof r.recordId!=='string'||seen.has(r.recordId)
   ||typeof r.submitted!=='string'||![true,false,null].includes(r.correct)
   ||typeof r.assisted!=='boolean'||typeof r.correction!=='boolean'
   ||typeof r.at!=='string'||Number.isNaN(Date.parse(r.at)))return false;
  seen.add(r.recordId);
  const t=byId[r.taskId];
  if(r.correct!==null&&(r.correct!==(r.submitted===t.answer||t.aliases.includes(r.submitted))))return false;
  if(r.correct===null&&(!r.assisted||r.submitted!==''))return false;
 }
 return true;
}
export function taskAt(s){
 if(s.finished)return null;
 const id=s.index<TASKS.length?TASKS[s.index].id:s.corrections[s.index-TASKS.length];
 const task=byId[id];
 return task?{...task,correction:s.index>=TASKS.length}:null;
}
export function resume(s){return validState(s)?{...s,paused:false}:s;}
export function pause(s){return validState(s)?{...s,paused:true}:s;}
export function beginRecall(s){
 const t=taskAt(s);
 return validState(s)&&!s.paused&&t?.mode==='introduction'&&!s.checking&&!s.feedback
  ?{...s,checking:true}:s;
}
function record(s,raw,correct,assisted,now){
 const t=taskAt(s);
 const entry={recordId:(t.correction?'correction-':'first-')+t.id,taskId:t.id,
  mode:t.mode,submitted:correct===null?'':normalize(raw),correct,assisted,
  correction:t.correction,at:new Date(now).toISOString()};
 const records=[...s.records,entry];
 return {...s,records,feedback:{correct,answer:t.answer,submitted:entry.submitted,assisted}};
}
export function answer(s,raw,now=Date.now()){
 if(!validState(s)||s.paused||s.feedback)return s;
 const t=taskAt(s);
 if(!t||(t.mode==='introduction'&&!t.correction&&!s.checking))return s;
 const response=normalize(raw);
 if(!response||!/^[a-z]+$/.test(response)||response.length>16)return s;
 if(t.mode==='recognition'&&!t.options.includes(response))return s;
 return record(s,raw,response===t.answer||t.aliases.includes(response),false,now);
}
export function reveal(s,now=Date.now()){
 if(!validState(s)||s.paused||s.feedback)return s;
 const t=taskAt(s);
 if(!t||(t.mode==='introduction'&&!t.correction&&!s.checking))return s;
 return record(s,'',null,true,now);
}
export function advance(s){
 if(!validState(s)||s.paused||!s.feedback)return s;
 const nextIndex=s.index+1;
 const base={...s,index:nextIndex,checking:false,feedback:null};
 if(nextIndex<TASKS.length)return base;
 if(nextIndex===TASKS.length){
  const wrong=s.records.filter(r=>!r.correction&&(r.correct!==true||r.assisted)).map(r=>r.taskId);
  const corrections=[...new Set(wrong)];
  return {...base,corrections,finished:corrections.length===0};
 }
 return {...base,finished:nextIndex===TASKS.length+s.corrections.length};
}
export function summary(s){
 const first=s.records.filter(r=>!r.correction);
 const result={};
 for(const mode of ['introduction','recognition','decoding']){
  const records=first.filter(r=>r.mode===mode);
  result[mode]={total:5,completed:records.length,independentCorrect:records.filter(r=>r.correct===true&&!r.assisted).length};
 }
 result.correctionCount=s.records.filter(r=>r.correction).length;
 result.corrected=s.records.filter(r=>r.correction&&r.correct===true&&!r.assisted).length;
 return result;
}
