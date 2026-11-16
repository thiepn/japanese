// Kana Foundations Unit 07: the M-row, taught through real early-kana words.
// Practice-only, isolated progress. Units 01–06 and Account/FSRS are untouched.
export const STORAGE_KEY='thiepn:kana-foundations:m-row:prototype-only:v1';
export const KANA=Object.freeze([
 {id:'ma',kana:'ま',reading:'ma',note:'ま is m + a: close both lips for the m sound, then release into a short a. Notice the two horizontal strokes and the right-hand loop.'},
 {id:'mi',kana:'み',reading:'mi',note:'み is m + i: keep the i short and clear. Follow the long curved line into its final rise; do not confuse this shape with に (ni).'},
 {id:'mu',kana:'む',reading:'mu',note:'む is m + u: gently close your lips for m, then use a short Japanese u without English oo rounding. Compare its curved loop with ぬ (nu).'},
 {id:'me',kana:'め',reading:'me',note:'め is m + e: use a short e, not English may. Notice the crossed lines and rounded finish; unlike ぬ (nu), there is no tiny looped tail.'},
 {id:'mo',kana:'も',reading:'mo',note:'も is m + o: keep the o steady. Unlike ま (ma), its two horizontal strokes cross a single vertical line with a low curve.'}
]);
export const WORDS=Object.freeze([
 {id:'mame',kana:'まめ',reading:'mame',meaning:'bean; beans',kanji:'豆'},
 {id:'mimi',kana:'みみ',reading:'mimi',meaning:'ear',kanji:'耳'},
 {id:'mushi',kana:'むし',reading:'mushi',aliases:['musi'],meaning:'insect; bug',kanji:'虫'},
 {id:'meshi',kana:'めし',reading:'meshi',aliases:['mesi'],meaning:'cooked rice; meal (informal word)',kanji:'飯'},
 {id:'momo',kana:'もも',reading:'momo',meaning:'peach',kanji:'桃'}
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
