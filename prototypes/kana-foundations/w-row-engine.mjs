// Kana Foundations Unit 10: わ・を・ん, including object-particle を and moraic nasal ん.
// Isolated prototype evidence: Units 01–09, original records and Account/FSRS stay untouched.
export const STORAGE_KEY='thiepn:kana-foundations:w-row:prototype-only:v1';
export const KANA=Object.freeze([
 {id:'wa',kana:'わ',reading:'wa',note:'わ is wa: start with a quick w glide into short a. Watch its curved right-hand shape; it resembles ね (ne) but has no loop. わ can begin ordinary words such as わに.'},
 {id:'wo',kana:'を',reading:'o',aliases:['wo'],note:'を marks the direct object of a verb: in ほんをよむ (read a book), ほん is the thing being read. In standard modern speech を is pronounced o, just like お. Some keyboard systems write the kana as wo; typed wo is accepted here, but pronounce it o.'},
 {id:'n',kana:'ん',reading:'n',note:'ん is the moraic nasal, written n in romaji. Give it its own short timing beat; it is not na, ni or nu. Its exact nasal sound changes with the next sound, as in ほん (book) or みかん (mandarin orange).'}
]);
export const WORDS=Object.freeze([
 {id:'wani',kana:'わに',reading:'wani',meaning:'crocodile; alligator',kanji:'鰐'},
 {id:'hon',kana:'ほん',reading:'hon',meaning:'book',kanji:'本'},
 {id:'mikan',kana:'みかん',reading:'mikan',meaning:'mandarin orange',kanji:'蜜柑'},
 {id:'sensei',kana:'せんせい',reading:'sensei',meaning:'teacher',kanji:'先生'},
 {id:'wakaru',kana:'わかる',reading:'wakaru',meaning:'to understand',kanji:'分かる'}
]);
export const PHRASES=Object.freeze([
 {id:'hon-o-yomu',kana:'ほんをよむ',reading:'honoyomu',aliases:['honwoyomu'],meaning:'read a book',kanji:'本を読む',note:'ほん (book) + を (object marker, pronounced o) + よむ (read, plain dictionary form).'}
]);
const intro=KANA.map(v=>({id:'intro-'+v.id,mode:'introduction',kana:v.kana,answer:v.reading,aliases:v.aliases||[],sourceId:v.id,note:v.note}));
const recognition=KANA.map((v,i)=>({id:'recognition-'+v.id,mode:'recognition',kana:v.kana,answer:v.reading,aliases:[],sourceId:v.id,options:[...KANA.slice(i),...KANA.slice(0,i)].map(x=>x.reading)}));
const decoding=WORDS.map(v=>({id:'word-'+v.id,mode:'decoding',kana:v.kana,answer:v.reading,aliases:v.aliases||[],sourceId:v.id,meaning:v.meaning,kanji:v.kanji}));
const phrases=PHRASES.map(v=>({id:'phrase-'+v.id,mode:'decoding',kind:'phrase',kana:v.kana,answer:v.reading,aliases:v.aliases||[],sourceId:v.id,meaning:v.meaning,kanji:v.kanji,note:v.note}));
export const TASKS=Object.freeze([...intro,...recognition,...decoding,...phrases]);
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
  result[mode]={total:mode==='decoding'?WORDS.length+PHRASES.length:KANA.length,completed:records.length,independentCorrect:records.filter(r=>r.correct===true&&!r.assisted).length};
 }
 result.correctionCount=s.records.filter(r=>r.correction).length;
 result.corrected=s.records.filter(r=>r.correction&&r.correct===true&&!r.assisted).length;
 return result;
}
