// Kana Foundations Unit 16: yōon / contracted hiragana (K, SH, CH).
// Standalone prototype: no earlier-unit, Account, FSRS, IndexedDB or audio modifications.
export const STORAGE_KEY='thiepn:kana-foundations:yoon-kshch:prototype-only:v1';
export const PREVIOUS_KANA='あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんがぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽっ';
export const KANA=Object.freeze([
 {id:'kya',kana:'きゃ',base:'き',reading:'kya',stage:'a',note:'き + small ゃ forms きゃ (kya), one mora. きや (kiya) uses full や and has two morae.'},
 {id:'kyu',kana:'きゅ',base:'き',reading:'kyu',stage:'a',note:'き + small ゅ forms きゅ (kyu), one mora. Full きゆ would contain two morae.'},
 {id:'kyo',kana:'きょ',base:'き',reading:'kyo',stage:'a',note:'き + small ょ forms きょ (kyo), one mora. In きょう, う adds a second mora for the long vowel.'},
 {id:'sha',kana:'しゃ',base:'し',reading:'sha',aliases:['sya'],stage:'a',note:'し + small ゃ forms しゃ, one mora, pronounced sha. sya is a typing/romanization convention, not another spoken sound.'},
 {id:'shu',kana:'しゅ',base:'し',reading:'shu',aliases:['syu'],stage:'a',note:'し + small ゅ forms しゅ (shu), one mora. syu is a permitted typing spelling, not a different pronunciation.'},
 {id:'sho',kana:'しょ',base:'し',reading:'sho',aliases:['syo'],stage:'a',note:'し + small ょ forms しょ (sho), one mora. In しょうゆ, う lengthens the vowel.'},
 {id:'cha',kana:'ちゃ',base:'ち',reading:'cha',aliases:['tya','cya'],stage:'b',note:'ち + small ゃ forms ちゃ (cha), one mora. tya/cya are keyboard conventions, not distinct sounds.'},
 {id:'chu',kana:'ちゅ',base:'ち',reading:'chu',aliases:['tyu','cyu'],stage:'b',note:'ち + small ゅ forms ちゅ (chu), one mora. In ちゅうい, う adds a second mora to the long vowel.'},
 {id:'cho',kana:'ちょ',base:'ち',reading:'cho',aliases:['tyo','cyo'],stage:'b',note:'ち + small ょ forms ちょ (cho), one mora. ちょっと has three morae: ちょ・っ・と.'}
]);
export const WORDS=Object.freeze([
 {id:'kyaku',kana:'きゃく',reading:'kyaku',stage:'a',meaning:'guest; customer',kanji:'客',note:'きゃ is one mora, く is the next. Distinguish きゃく (guest) from きやく (rules/agreement).'},
 {id:'kyuuri',kana:'きゅうり',reading:'kyuuri',stage:'a',meaning:'cucumber',kanji:'胡瓜 / キュウリ',note:'きゅ・う・り is three morae; う extends the vowel. きゅうり is commonly written in hiragana or katakana.'},
 {id:'kyou',kana:'きょう',reading:'kyou',stage:'a',meaning:'today',kanji:'今日',note:'きょ・う contains two morae; do not type kiyou (three morae).'},
 {id:'shashin',kana:'しゃしん',reading:'shashin',aliases:['syasin'],stage:'a',meaning:'photograph',kanji:'写真',note:'しゃ・し・ん is three morae. syasin represents the same Japanese pronunciation in another romanization convention.'},
 {id:'shumi',kana:'しゅみ',reading:'shumi',aliases:['syumi'],stage:'a',meaning:'hobby; interest',kanji:'趣味',note:'しゅ・み is two morae. syumi is a permitted keyboard convention.'},
 {id:'shouyu',kana:'しょうゆ',reading:'shouyu',aliases:['syouyu'],stage:'a',meaning:'soy sauce',kanji:'醤油',note:'しょ・う・ゆ is three morae. shouyu keeps the long o spelling; syouyu is a permitted convention.'},
 {id:'ocha',kana:'おちゃ',reading:'ocha',aliases:['otya','ocya'],stage:'b',meaning:'tea',kanji:'お茶',note:'お・ちゃ is two morae. tya/cya represent the same cha sound as keyboard conventions.'},
 {id:'chuui',kana:'ちゅうい',reading:'chuui',aliases:['tyuui','cyuui'],stage:'b',meaning:'attention; caution',kanji:'注意',note:'ちゅ・う・い is three morae, including a long u vowel.'},
 {id:'chotto',kana:'ちょっと',reading:'chotto',aliases:['tyotto','cyotto'],stage:'b',meaning:'a little; a moment',note:'ちょ・っ・と is three morae, including the one-mora consonant hold っ.'}
]);
export const CONTRASTS=Object.freeze([
 {id:'kyaku-kiyaku',stage:'a',kana:'Choose the word meaning “guest/customer” (not “rules or agreement”).',answer:'きゃく',choices:[['きやく','きやく — rules/agreement'],['きゃく','きゃく — guest/customer']],note:'きゃく (客) is kyaku, two morae; きやく (規約) is kiyaku, three morae. The size of ゃ changes both reading and meaning.'},
 {id:'kyou-kiyou',stage:'a',kana:'Choose the word meaning “today” (not “skillful”).',answer:'きょう',choices:[['きょう','きょう — today'],['きよう','きよう — skillful']],note:'きょう (今日) has two morae: きょ・う. きよう (器用) has three: き・よ・う.'},
 {id:'cha-chiya',stage:'b',kana:'Which form has the contracted, one-mora reading cha?',answer:'ちゃ',choices:[['ちや','ちや — chi + ya (two morae)'],['ちゃ','ちゃ — cha (one mora)']],note:'ちゃ is one contracted mora; ちや has two full-size kana and reads chiya. This compares written forms, not two independently defined words.'},
 {id:'chotto-mora',stage:'b',kana:'How many morae are in ちょっと?',answer:'3',choices:[['2','2 morae'],['3','3 morae'],['4','4 morae']],note:'ちょ・っ・と: contracted ちょ is one mora; small っ adds one; と is the third.'}
]);
export const EXPRESSIONS=Object.freeze([
 {id:'photo',kana:'しゃしんをみる',reading:'shashinomiru',aliases:['syasinomiru','shashinwomiru'],stage:'application',meaning:'look at a photograph',kanji:'写真を見る',note:'しゃ・し・ん are three morae. を is pronounced o; wo is permitted only as a typing convention.'},
 {id:'tea',kana:'きょうはおちゃをのむ',reading:'kyouwaochaonomu',aliases:['kyouwaotyanomu','kyouwaocyanomu'],stage:'application',meaning:'drink tea today',kanji:'今日はお茶を飲む',note:'きょう is two morae. は (topic particle) sounds wa, and を (object particle) sounds o; ちゃ is one mora.'}
]);
export const CHECKPOINT_INDEX=20;
const intro=k=>({id:'intro-'+k.id,mode:'introduction',stage:k.stage,kana:k.kana,base:k.base,answer:k.reading,aliases:k.aliases||[],note:k.note});
const recognition=(k,group,index)=>({id:'recognition-'+k.id,mode:'recognition',stage:k.stage,kana:k.kana,answer:k.reading,aliases:[],choices:[...group.slice(index),...group.slice(0,index)].map(x=>({value:x.reading,label:x.reading})),note:'Choose the standard pronunciation and recognize small ゃ, ゅ or ょ.'});
const word=w=>({id:'word-'+w.id,mode:'word',stage:w.stage,kana:w.kana,answer:w.reading,aliases:w.aliases||[],meaning:w.meaning,kanji:w.kanji,note:w.note});
const contrast=c=>({id:'contrast-'+c.id,mode:'contrast',stage:c.stage,kana:c.kana,answer:c.answer,aliases:[],choices:c.choices.map(([value,label])=>({value,label})),note:c.note});
const phrase=p=>({id:'phrase-'+p.id,mode:'phrase',stage:p.stage,kana:p.kana,answer:p.reading,aliases:p.aliases||[],meaning:p.meaning,kanji:p.kanji,note:p.note});
function makeStage(stage){
 const group=KANA.filter(k=>k.stage===stage);
 return [...group.map(intro),...group.map((k,i)=>recognition(k,group,i)),...WORDS.filter(w=>w.stage===stage).map(word),...CONTRASTS.filter(c=>c.stage===stage).map(contrast)];
}
export const TASKS=Object.freeze([...makeStage('a'),...makeStage('b'),...EXPRESSIONS.map(phrase)]);
export const MODES=Object.freeze([
 {id:'introduction',label:'Contracted-sound recall',total:9},
 {id:'recognition',label:'Character recognition',total:9},
 {id:'word',label:'Authentic word decoding',total:9},
 {id:'contrast',label:'Form, meaning and mora contrasts',total:4},
 {id:'phrase',label:'Practical expression reading',total:2}
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
 result.stageCH=first.filter(r=>byId[r.taskId]?.stage==='b'&&r.correct===true&&!r.assisted).length;
 result.stageKSH=first.filter(r=>byId[r.taskId]?.stage==='a'&&r.correct===true&&!r.assisted).length;
 return result;
}
