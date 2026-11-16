// Kana Foundations Unit 11: cumulative hiragana reading and application.
// Prototype-only local records; never writes Units 01–10, Account, FSRS or IndexedDB.
export const STORAGE_KEY='thiepn:kana-foundations:reading-review:prototype-only:v1';
export const KNOWN_KANA='あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん';
export const WORDS=Object.freeze([
 {id:'sakana',kana:'さかな',reading:'sakana',meaning:'fish',kanji:'魚',note:'さ・か・な each has one short vowel.'},
 {id:'neru',kana:'ねる',reading:'neru',meaning:'to sleep',kanji:'寝る',note:'ねる is a dictionary-form verb meaning to sleep.'},
 {id:'hashiru',kana:'はしる',reading:'hashiru',aliases:['hasiru'],meaning:'to run',kanji:'走る',note:'The は in はしる is ha, not the topic particle wa.'},
 {id:'muku',kana:'むく',reading:'muku',meaning:'to peel',kanji:'むく',note:'むく is commonly written in kana when referring to peeling fruit.'},
 {id:'omoshiroi',kana:'おもしろい',reading:'omoshiroi',aliases:['omosiroi'],meaning:'interesting',kanji:'面白い',note:'おもしろい is an i-adjective: it can end a sentence without です.'}
]);
export const PARTICLES=Object.freeze([
 {id:'topic-watashi',kana:'わたし □ ほんをよむ',answer:'wa',note:'わたし is the topic (I). は is written ha but pronounced wa as a topic particle.',meaning:'I read a book.'},
 {id:'object-hon',kana:'わたしは ほん □ よむ',answer:'o',note:'ほん (book) is what is read, so を marks the direct object and is pronounced o.',meaning:'I read a book.'},
 {id:'topic-neko',kana:'ねこ □ ねる',answer:'wa',note:'ねこ is the topic (cat). は is pronounced wa here; ねる means sleeps.',meaning:'The cat sleeps.'},
 {id:'object-yama',kana:'わたしは やま □ みる',answer:'o',note:'やま (mountain) is the thing being looked at, so を marks it as the object.',meaning:'I look at a mountain.'}
]);
export const SENTENCES=Object.freeze([
 {id:'watashi-hon',kana:'わたしはほんをよむ',reading:'watashiwahonoyomu',aliases:['watasiwahonoyomu','watashiwahonwoyomu','watasiwahonwoyomu'],meaning:'I read a book.',note:'わたし / は / ほん / を / よむ: は sounds wa and を sounds o.'},
 {id:'neko-neru',kana:'ねこはねる',reading:'nekowaneru',meaning:'The cat sleeps.',note:'ねこ / は / ねる: は marks the topic and is pronounced wa.'},
 {id:'yama-takai',kana:'やまはたかい',reading:'yamawatakai',meaning:'The mountain is high.',note:'やま / は / たかい: たかい is an i-adjective (high). No copula is needed.'},
 {id:'sensei-hon',kana:'せんせいはほんをよむ',reading:'senseiwahonoyomu',aliases:['senseiwahonwoyomu'],meaning:'The teacher reads a book.',note:'せんせい / は / ほん / を / よむ: topic then object then verb.'}
]);
export const COMPREHENSION=Object.freeze([
 {id:'dog-runs',kana:'いぬははしる',answer:'dogruns',choices:[['catrests','The cat sleeps.'],['dogruns','The dog runs.'],['bookread','I read a book.']],meaning:'The dog runs.',note:'いぬ (dog) / は (topic, wa) / はしる (runs). The first は is a particle; the second starts a word and sounds ha.'},
 {id:'cat-fish',kana:'ねこはさかなをみる',answer:'catfish',choices:[['catfish','The cat sees the fish.'],['fishruns','The fish runs.'],['catbook','The cat reads a book.']],meaning:'The cat sees the fish.',note:'ねこ (cat) / は (wa) / さかな (fish) / を (o) / みる (sees).'},
 {id:'peel-orange',kana:'わたしはみかんをむく',answer:'peelorange',choices:[['orangeread','I read about an orange.'],['peelorange','I peel a mandarin orange.'],['catpeels','The cat peels an orange.']],meaning:'I peel a mandarin orange.',note:'わたし (I) / は (wa) / みかん (mandarin) / を (o) / むく (peel).'},
 {id:'interesting-book',kana:'ほんはおもしろい',answer:'bookinteresting',choices:[['teacherinteresting','The teacher is interesting.'],['bookhigh','The book is high.'],['bookinteresting','The book is interesting.']],meaning:'The book is interesting.',note:'ほん (book) / は (wa) / おもしろい (interesting). The i-adjective completes the sentence.'}
]);
const wordTasks=WORDS.map(w=>({id:'word-'+w.id,mode:'word',kana:w.kana,answer:w.reading,aliases:w.aliases||[],meaning:w.meaning,note:w.note,kanji:w.kanji}));
const particleTasks=PARTICLES.map(p=>({...p,id:'particle-'+p.id,mode:'particle',aliases:[],choices:[{value:'wa',label:'は · topic (wa)'},{value:'o',label:'を · object (o)'}]}));
const sentenceTasks=SENTENCES.map(v=>({id:'sentence-'+v.id,mode:'sentence',kana:v.kana,answer:v.reading,aliases:v.aliases||[],meaning:v.meaning,note:v.note}));
const meaningTasks=COMPREHENSION.map(v=>({id:'meaning-'+v.id,mode:'meaning',kana:v.kana,answer:v.answer,aliases:[],meaning:v.meaning,note:v.note,choices:v.choices.map(([value,label])=>({value,label}))}));
export const TASKS=Object.freeze([...wordTasks,...particleTasks,...sentenceTasks,...meaningTasks]);
const byId=Object.fromEntries(TASKS.map(t=>[t.id,t]));
export const MODES=Object.freeze([{id:'word',label:'Word reading',total:WORDS.length},{id:'particle',label:'Particles',total:PARTICLES.length},{id:'sentence',label:'Sentence reading',total:SENTENCES.length},{id:'meaning',label:'Comprehension',total:COMPREHENSION.length}]);
export function initialState(){return {schema:1,index:0,paused:true,feedback:null,records:[],corrections:[],finished:false};}
export function normalize(value){return typeof value==='string'?value.normalize('NFKC').trim().toLowerCase().replace(/[\s\u3000-]/g,''):'';}
export function taskAt(state){
 if(!state||state.finished)return null;
 const id=state.index<TASKS.length?TASKS[state.index]?.id:state.corrections[state.index-TASKS.length];
 return id&&byId[id]?{...byId[id],correction:state.index>=TASKS.length}:null;
}
export function validState(s){
 if(!s||typeof s!=='object'||s.schema!==1||!Number.isInteger(s.index)
 ||s.index<0||s.index>2*TASKS.length||typeof s.paused!=='boolean'
 ||typeof s.finished!=='boolean'||!Array.isArray(s.records)||s.records.length>2*TASKS.length
 ||!Array.isArray(s.corrections)||s.corrections.length>TASKS.length
 ||new Set(s.corrections).size!==s.corrections.length||!s.corrections.every(id=>Boolean(byId[id]))
 ||!(s.feedback===null||(s.feedback&&typeof s.feedback==='object'&&[true,false,null].includes(s.feedback.correct)))
 ||s.records.length!==s.index+(s.feedback?1:0)||s.index>TASKS.length+s.corrections.length)return false;
 if(s.index<TASKS.length&&s.corrections.length)return false;
 if(s.finished&&(s.index!==TASKS.length+s.corrections.length||s.feedback!==null))return false;
 if(!s.finished&&s.index>=TASKS.length+s.corrections.length)return false;
 if(s.index>=TASKS.length){
  const failed=s.records.slice(0,TASKS.length).filter(r=>r.correct!==true||r.assisted).map(r=>r.taskId);
  if(failed.length!==s.corrections.length||failed.some((id,i)=>s.corrections[i]!==id))return false;
 }
 const seen=new Set();
 for(let i=0;i<s.records.length;i++){
  const r=s.records[i],task=i<TASKS.length?TASKS[i]:byId[s.corrections[i-TASKS.length]];
  const correction=i>=TASKS.length;
  if(!task||!r||r.taskId!==task.id||r.recordId!==(correction?'correction-':'first-')+task.id
   ||seen.has(r.recordId)||r.mode!==task.mode||r.correction!==correction
   ||typeof r.submitted!=='string'||r.submitted.length>60||![true,false,null].includes(r.correct)
   ||typeof r.assisted!=='boolean'||typeof r.at!=='string'||Number.isNaN(Date.parse(r.at)))return false;
  seen.add(r.recordId);
  if(r.correct===null){if(!r.assisted||r.submitted!=='')return false;}
  else if(r.assisted||r.correct!==(r.submitted===task.answer||task.aliases.includes(r.submitted)))return false;
 }
 if(s.feedback){
  const last=s.records.at(-1),task=taskAt(s);
  if(!last||!task||last.taskId!==task.id||s.feedback.correct!==last.correct
   ||s.feedback.submitted!==last.submitted||s.feedback.answer!==task.answer
   ||s.feedback.assisted!==last.assisted)return false;
 }
 return true;
}
export function resume(s){return validState(s)?{...s,paused:false}:s;}
export function pause(s){return validState(s)?{...s,paused:true}:s;}
function record(s,response,correct,assisted,now){
 const t=taskAt(s);
 const entry={recordId:(t.correction?'correction-':'first-')+t.id,taskId:t.id,
  mode:t.mode,submitted:correct===null?'':response,correct,assisted,correction:t.correction,
  at:new Date(now).toISOString()};
 return {...s,records:[...s.records,entry],feedback:{correct,answer:t.answer,submitted:entry.submitted,assisted}};
}
export function answer(s,raw,now=Date.now()){
 if(!validState(s)||s.paused||s.feedback)return s;
 const t=taskAt(s),response=normalize(raw);
 if(!t||!response||response.length>60||!/^[a-z]+$/.test(response))return s;
 if((t.mode==='particle'||t.mode==='meaning')&&!t.choices.some(c=>c.value===response))return s;
 return record(s,response,response===t.answer||t.aliases.includes(response),false,now);
}
export function reveal(s,now=Date.now()){
 if(!validState(s)||s.paused||s.feedback||!taskAt(s))return s;
 return record(s,'',null,true,now);
}
export function advance(s){
 if(!validState(s)||s.paused||!s.feedback)return s;
 const index=s.index+1,base={...s,index,feedback:null};
 if(index<TASKS.length)return base;
 if(index===TASKS.length){
  const corrections=s.records.filter(r=>!r.correction&&(r.correct!==true||r.assisted)).map(r=>r.taskId);
  return {...base,corrections,finished:corrections.length===0};
 }
 return {...base,finished:index===TASKS.length+s.corrections.length};
}
export function summary(s){
 const first=s.records.filter(r=>!r.correction),result={};
 for(const mode of MODES){
  const found=first.filter(r=>r.mode===mode.id);
  result[mode.id]={total:mode.total,completed:found.length,independentCorrect:found.filter(r=>r.correct===true&&!r.assisted).length};
 }
 result.correctionCount=s.records.filter(r=>r.correction).length;
 result.corrected=s.records.filter(r=>r.correction&&r.correct===true&&!r.assisted).length;
 return result;
}
