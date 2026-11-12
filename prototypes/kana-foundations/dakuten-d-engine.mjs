// Kana Foundations Unit 13: D-row dakuten and standard-japanese spelling.
// Unit-local prototype only; never touches Unit 01-12, Account, FSRS, audio assets or IndexedDB.
export const STORAGE_KEY='thiepn:kana-foundations:dakuten-d:prototype-only:v1';
export const PREVIOUS_KANA='あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんがぎぐげござじずぜぞ';
export const KANA=Object.freeze([
 {id:'da',kana:'だ',base:'た',reading:'da',note:'だ (da) adds dakuten to た (ta). Voice the first consonant; the vowel stays short.'},
 {id:'di',kana:'ぢ',base:'ち',reading:'ji',note:'ぢ is generally pronounced ji, like じ in modern standard Japanese. The spelling ぢ appears in special cases such as ちぢむ. Some Japanese input methods type di to produce ぢ; di is not a different spoken reading.'},
 {id:'du',kana:'づ',base:'つ',reading:'zu',note:'づ is generally pronounced zu, like ず in modern standard Japanese. The spelling づ appears in special cases such as つづく. Some Japanese input methods type du to produce づ; du is not a different spoken reading.'},
 {id:'de',kana:'で',base:'て',reading:'de',note:'で (de) is the voiced counterpart of て (te). Do not confuse the reading with the unvoiced sound.'},
 {id:'do',kana:'ど',base:'と',reading:'do',note:'ど (do) adds dakuten to と (to). It appears in everyday words such as どこ (where).'}
]);
export const WORDS=Object.freeze([
 {id:'dare',kana:'だれ',reading:'dare',meaning:'who',note:'だれ is the everyday question word who.',kanji:'誰'},
 {id:'chijimu',kana:'ちぢむ',reading:'chijimu',meaning:'to shrink',note:'Standard spelling uses ぢ after ち; it is pronounced ji in ordinary standard Japanese.',kanji:'縮む'},
 {id:'tsuzuku',kana:'つづく',reading:'tsuzuku',meaning:'to continue',note:'Standard spelling uses づ after つ; it is pronounced zu in ordinary standard Japanese.',kanji:'続く'},
 {id:'denwa',kana:'でんわ',reading:'denwa',meaning:'telephone; phone call',note:'でんわ means telephone or phone call. The nasal ん gets one timing beat.',kanji:'電話'},
 {id:'doko',kana:'どこ',reading:'doko',meaning:'where',note:'どこ is the everyday question word where.',kanji:'どこ'}
]);
export const SPELLINGS=Object.freeze([
 {id:'chijimu',kana:'Which is the standard hiragana spelling for “to shrink” (chijimu)?',answer:'ちぢむ',choices:['ちぢむ','ちじむ'],meaning:'to shrink',note:'ちぢむ follows the established repeated-origin spelling: ち followed by voiced ぢ. The two ji kana generally sound alike in standard Japanese.'},
 {id:'tsuzuku',kana:'Which is the standard hiragana spelling for “to continue” (tsuzuku)?',answer:'つづく',choices:['つずく','つづく'],meaning:'to continue',note:'つづく is written つ + づ, even though づ and ず are generally pronounced alike in standard Japanese.'}
]);
export const CONTRASTS=Object.freeze([
 {id:'da-ta',kana:'Select the voiced kana for da, not ta.',answer:'だ',choices:['た','だ'],note:'だ is the voiced form of た.'},
 {id:'de-te',kana:'Select the voiced kana for de, not te.',answer:'で',choices:['で','て'],note:'で is the voiced form of て.'}
]);
export const EXPRESSIONS=Object.freeze([
 {id:'denwa-suru',kana:'でんわをする',reading:'denwaosuru',aliases:['denwawosuru'],meaning:'make a phone call',kanji:'電話をする',note:'でんわ (telephone) + を (object marker pronounced o) + する (do).'},
 {id:'michi-tsuzuku',kana:'みちはつづく',reading:'michiwatsuzuku',meaning:'the road continues',kanji:'道は続く',note:'みち (road) + は (topic marker pronounced wa) + つづく (continue). づ is spelled with dakuten and pronounced zu.'}
]);
export const COMPREHENSION=Object.freeze([
 {id:'where-key',kana:'かぎはどこですか',answer:'wherekey',choices:[['wherekey','Where is the key?'],['whophone','Where is the telephone?'],['keyshrinks','The key shrinks.']],meaning:'Where is the key?',note:'かぎ (key) + は (topic, wa) + どこ (where) + です (polite copula) + か (question marker).'},
 {id:'clothes-shrink',kana:'ふくはちぢむ',answer:'clothesshrink',choices:[['roadcontinues','The road continues.'],['clothesshrink','Clothes shrink.'],['drinkwater','Drink water.']],meaning:'Clothes shrink.',note:'ふく (clothes) + は (topic, wa) + ちぢむ (shrink), written with ぢ.'}
]);
const taskIntro=k=>({id:'intro-'+k.id,mode:'introduction',kana:k.kana,answer:k.reading,aliases:[],base:k.base,note:k.note});
const taskRecognize=k=>({id:'recognition-'+k.id,mode:'recognition',kana:k.kana,answer:k.reading,aliases:[],choices:KANA.map(v=>({value:v.reading,label:v.reading})),note:'Select the spoken reading. ぢ and じ usually sound alike; so do づ and ず.'});
const taskWord=w=>({id:'word-'+w.id,mode:'word',kana:w.kana,answer:w.reading,aliases:[],meaning:w.meaning,kanji:w.kanji,note:w.note});
const taskSpelling=s=>({id:'spelling-'+s.id,mode:'spelling',kana:s.kana,answer:s.answer,aliases:[],choices:s.choices.map(v=>({value:v,label:v})),meaning:s.meaning,note:s.note});
const taskContrast=c=>({id:'contrast-'+c.id,mode:'contrast',kana:c.kana,answer:c.answer,aliases:[],choices:c.choices.map(v=>({value:v,label:v})),note:c.note});
const taskExpression=e=>({id:'expression-'+e.id,mode:'expression',kana:e.kana,answer:e.reading,aliases:e.aliases||[],meaning:e.meaning,kanji:e.kanji,note:e.note});
const taskMeaning=e=>({id:'meaning-'+e.id,mode:'meaning',kana:e.kana,answer:e.answer,aliases:[],choices:e.choices.map(([value,label])=>({value,label})),meaning:e.meaning,note:e.note});
export const TASKS=Object.freeze([
 ...KANA.map(taskIntro),...KANA.map(taskRecognize),...WORDS.map(taskWord),
 ...SPELLINGS.map(taskSpelling),...CONTRASTS.map(taskContrast),
 ...EXPRESSIONS.map(taskExpression),...COMPREHENSION.map(taskMeaning)
]);
export const MODES=Object.freeze([
 {id:'introduction',label:'Guided recall',total:5},
 {id:'recognition',label:'Character reading',total:5},
 {id:'word',label:'Word decoding',total:5},
 {id:'spelling',label:'Correct spelling',total:2},
 {id:'contrast',label:'Voicing contrast',total:2},
 {id:'expression',label:'Expression reading',total:2},
 {id:'meaning',label:'Comprehension',total:2}
]);
const byId=Object.fromEntries(TASKS.map(t=>[t.id,t]));
export function initialState(){return {schema:1,index:0,paused:true,checking:false,feedback:null,records:[],corrections:[],finished:false};}
export function normalize(value){return typeof value==='string'?value.normalize('NFKC').trim().toLowerCase().replace(/[\s\u3000-]/g,''):'';}
export function taskAt(s){
 if(!s||s.finished)return null;
 const id=s.index<TASKS.length?TASKS[s.index]?.id:s.corrections[s.index-TASKS.length];
 return id&&byId[id]?{...byId[id],correction:s.index>=TASKS.length}:null;
}
export function validState(s){
 if(!s||typeof s!=='object'||s.schema!==1||!Number.isInteger(s.index)||s.index<0||s.index>2*TASKS.length
  ||typeof s.paused!=='boolean'||typeof s.checking!=='boolean'||typeof s.finished!=='boolean'
  ||!Array.isArray(s.records)||s.records.length>2*TASKS.length||!Array.isArray(s.corrections)
  ||s.corrections.length>TASKS.length||new Set(s.corrections).size!==s.corrections.length
  ||!s.corrections.every(id=>Boolean(byId[id]))
  ||!(s.feedback===null||(s.feedback&&typeof s.feedback==='object'&&[true,false,null].includes(s.feedback.correct)))
  ||s.records.length!==s.index+(s.feedback?1:0)||s.index>TASKS.length+s.corrections.length)return false;
 if(s.index<TASKS.length&&s.corrections.length)return false;
 if(s.finished&&(s.index!==TASKS.length+s.corrections.length||s.feedback!==null||s.checking))return false;
 if(!s.finished&&s.index>=TASKS.length+s.corrections.length)return false;
 if(s.index>=TASKS.length){
  const missed=s.records.slice(0,TASKS.length).filter(r=>r.correct!==true||r.assisted).map(r=>r.taskId);
  if(missed.length!==s.corrections.length||missed.some((id,i)=>id!==s.corrections[i]))return false;
 }
 const t=taskAt(s);
 if(s.checking&&(!t||t.mode!=='introduction'||t.correction||s.feedback))return false;
 const seen=new Set();
 for(let i=0;i<s.records.length;i++){
  const r=s.records[i],task=i<TASKS.length?TASKS[i]:byId[s.corrections[i-TASKS.length]],correction=i>=TASKS.length;
  if(!r||!task||r.taskId!==task.id||r.mode!==task.mode||r.correction!==correction
    ||r.recordId!==(correction?'correction-':'first-')+task.id||seen.has(r.recordId)
    ||typeof r.submitted!=='string'||r.submitted.length>60
    ||![true,false,null].includes(r.correct)||typeof r.assisted!=='boolean'
    ||typeof r.at!=='string'||Number.isNaN(Date.parse(r.at)))return false;
  seen.add(r.recordId);
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
export function beginRecall(s){
 const t=taskAt(s);
 return validState(s)&&!s.paused&&t?.mode==='introduction'&&!t.correction&&!s.checking&&!s.feedback
  ?{...s,checking:true}:s;
}
function record(s,submitted,correct,assisted,now){
 const task=taskAt(s);
 const r={recordId:(task.correction?'correction-':'first-')+task.id,
   taskId:task.id,mode:task.mode,submitted:correct===null?'':submitted,
   correct,assisted,correction:task.correction,at:new Date(now).toISOString()};
 return {...s,checking:false,records:[...s.records,r],
  feedback:{correct,answer:task.answer,submitted:r.submitted,assisted}};
}
export function answer(s,raw,now=Date.now()){
 if(!validState(s)||s.paused||s.feedback)return s;
 const t=taskAt(s),v=normalize(raw);
 if(!t||!v||v.length>60||(t.mode==='introduction'&&!t.correction&&!s.checking))return s;
 if(t.choices){if(!t.choices.some(c=>c.value===v))return s;}
 else if(!/^[a-z]+$/.test(v))return s;
 return record(s,v,v===t.answer||t.aliases.includes(v),false,now);
}
export function reveal(s,now=Date.now()){
 if(!validState(s)||s.paused||s.feedback)return s;
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
  const rows=first.filter(r=>r.mode===id);
  result[id]={total,completed:rows.length,independentCorrect:rows.filter(r=>r.correct===true&&!r.assisted).length};
 }
 result.correctionCount=s.records.filter(r=>r.correction).length;
 result.corrected=s.records.filter(r=>r.correction&&r.correct===true&&!r.assisted).length;
 return result;
}
