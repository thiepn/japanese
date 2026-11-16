// Kana Foundations Unit 04: the T-row, with ち = chi and つ = tsu in Hepburn.
// Isolated progress and practice-only results. Units 01–03 and canonical Account/FSRS stay untouched.
export const STORAGE_KEY='thiepn:kana-foundations:t-row:prototype-only:v1';
export const KANA=Object.freeze([
 {id:'ta',kana:'た',reading:'ta',note:'た is ta: the t sound followed by a short Japanese a. Look for the crossing stroke on the left.'},
 {id:'chi',kana:'ち',reading:'chi',aliases:['ti'],note:'ち is chi in Hepburn, not English tea. Type chi; the systematic Kunrei spelling ti is also accepted.'},
 {id:'tsu',kana:'つ',reading:'tsu',aliases:['tu'],note:'つ is tsu: begin with a brief t closure and flow into su. Do not confuse its curved shape with し (shi). The Kunrei spelling tu is also accepted.'},
 {id:'te',kana:'て',reading:'te',note:'て is te: one sweeping horizontal-to-curved stroke. Keep the vowel short, without English tay.'},
 {id:'to',kana:'と',reading:'to',note:'と is to: two separate marks. Keep the o vowel steady, without English toe diphthong.'}
]);
export const WORDS=Object.freeze([
 {id:'tako',kana:'たこ',reading:'tako',meaning:'octopus',kanji:'蛸'},
 {id:'chikai',kana:'ちかい',reading:'chikai',aliases:['tikai'],meaning:'near; close (in distance)',kanji:'近い'},
 {id:'tsuki',kana:'つき',reading:'tsuki',aliases:['tuki'],meaning:'moon; month',kanji:'月'},
 {id:'suteki',kana:'すてき',reading:'suteki',meaning:'lovely; wonderful',kanji:'素敵'},
 {id:'tokei',kana:'とけい',reading:'tokei',meaning:'clock; watch',kanji:'時計'}
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
