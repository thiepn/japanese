// Kana Foundations Unit 05: the N-row, including the visual contrast ぬ / の.
// Its prototype storage never writes Units 01–04, canonical Account, or FSRS.
export const STORAGE_KEY='thiepn:kana-foundations:n-row:prototype-only:v1';
export const KANA=Object.freeze([
 {id:'na',kana:'な',reading:'na',note:'な is n + a. Say a clear Japanese na; notice the two parts of its shape and the small loop near the bottom.'},
 {id:'ni',kana:'に',reading:'ni',note:'に is n + i, with a short i vowel like い. Look for its left stroke and two separate right-side strokes.'},
 {id:'nu',kana:'ぬ',reading:'nu',note:'ぬ is n + u. Follow the long curved stroke into a loop and short trailing tail. Contrast it with の, which has no looped tail.'},
 {id:'ne',kana:'ね',reading:'ne',note:'ね is n + e. Notice its upright left stroke and the rounded loop to the right; keep the e sound short.'},
 {id:'no',kana:'の',reading:'no',note:'の is n + o. Trace its simple single curved stroke; unlike ぬ, it does not finish with a small loop and tail.'}
]);
export const WORDS=Object.freeze([
 {id:'nani',kana:'なに',reading:'nani',meaning:'what',kanji:'何'},
 {id:'inu',kana:'いぬ',reading:'inu',meaning:'dog',kanji:'犬'},
 {id:'neko',kana:'ねこ',reading:'neko',meaning:'cat',kanji:'猫'},
 {id:'kinoko',kana:'きのこ',reading:'kinoko',meaning:'mushroom',kanji:'—'},
 {id:'nuno',kana:'ぬの',reading:'nuno',meaning:'cloth; fabric',kanji:'布'}
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
