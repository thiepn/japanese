// Kana Foundations Unit 17: N/H/M/R contracted hiragana (yōon).
// Standalone prototype only. No production, Account, IndexedDB, FSRS, audio or earlier-unit writes.
export const STORAGE_KEY='thiepn:kana-foundations:yoon-nhmr:prototype-only:v1';
export const PREVIOUS_KANA='あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんがぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽっ';
export const KANA=Object.freeze([
 {id:'nya',kana:'にゃ',base:'に',reading:'nya',stage:'a',note:'に + small ゃ forms にゃ (nya), one mora. Full-size にや (niya) has two morae.'},
 {id:'nyu',kana:'にゅ',base:'に',reading:'nyu',stage:'a',note:'に + small ゅ forms にゅ (nyu), one mora. In にゅうがく, the next う adds a second mora.'},
 {id:'nyo',kana:'にょ',base:'に',reading:'nyo',stage:'a',note:'に + small ょ forms にょ (nyo), one mora. This combination is less frequent in basic everyday vocabulary; learn to recognize its written sound.'},
 {id:'hya',kana:'ひゃ',base:'ひ',reading:'hya',stage:'a',note:'ひ + small ゃ forms ひゃ (hya), one mora. ひゃく (100) has two morae: ひゃ・く.'},
 {id:'hyu',kana:'ひゅ',base:'ひ',reading:'hyu',stage:'a',note:'ひ + small ゅ forms ひゅ (hyu), one mora. Full-size ひゆ has separate hi and yu morae.'},
 {id:'hyo',kana:'ひょ',base:'ひ',reading:'hyo',stage:'a',note:'ひ + small ょ forms ひょ (hyo), one mora. ひょう has a second mora because of う.'},
 {id:'mya',kana:'みゃ',base:'み',reading:'mya',stage:'b',note:'み + small ゃ forms みゃ (mya), one mora. みゃく (pulse) has two morae.'},
 {id:'myu',kana:'みゅ',base:'み',reading:'myu',stage:'b',note:'み + small ゅ forms みゅ (myu), one mora. This sound often appears in loanwords written in katakana; no artificial hiragana vocabulary is required here.'},
 {id:'myo',kana:'みょ',base:'み',reading:'myo',stage:'b',note:'み + small ょ forms みょ (myo), one mora. みょうじ (surname) has three morae: みょ・う・じ.'},
 {id:'rya',kana:'りゃ',base:'り',reading:'rya',stage:'b',note:'り + small ゃ forms りゃ (rya), one mora. In しょうりゃく (abbreviation), りゃ is a single mora.'},
 {id:'ryu',kana:'りゅ',base:'り',reading:'ryu',stage:'b',note:'り + small ゅ forms りゅ (ryu), one mora. りゅう (dragon) contains an additional う mora.'},
 {id:'ryo',kana:'りょ',base:'り',reading:'ryo',stage:'b',note:'り + small ょ forms りょ (ryo), one mora. りょうり (cooking) has three morae: りょ・う・り.'}
]);
export const WORDS=Object.freeze([
 {id:'nyanko',kana:'にゃんこ',reading:'nyanko',stage:'a',meaning:'kitty; cat (casual)',note:'にゃ・ん・こ contains three morae. にゃんこ is an informal word; ねこ is the neutral everyday word for cat.'},
 {id:'nyuugaku',kana:'にゅうがく',reading:'nyuugaku',stage:'a',meaning:'entering or enrolling in school',kanji:'入学',note:'にゅ・う・が・く: four morae. The long vowel is written にゅう, not にゆう.'},
 {id:'hyaku',kana:'ひゃく',reading:'hyaku',stage:'a',meaning:'one hundred',kanji:'百',note:'ひゃ・く: two morae. ひやく (飛躍, leap) is hi-ya-ku, a different word.'},
 {id:'hyouji',kana:'ひょうじ',reading:'hyouji',stage:'a',meaning:'display; indication',kanji:'表示',note:'ひょ・う・じ: three morae. ひょうじ uses the long ō vowel, represented here by ou.'},
 {id:'myaku',kana:'みゃく',reading:'myaku',stage:'b',meaning:'pulse',kanji:'脈',note:'みゃ・く: two morae. Use small ゃ, not full-size や.'},
 {id:'myouji',kana:'みょうじ',reading:'myouji',stage:'b',meaning:'surname; family name',kanji:'名字',note:'みょ・う・じ: three morae. Full-size みようじ would read mi-yo-u-ji.'},
 {id:'shouryaku',kana:'しょうりゃく',reading:'shouryaku',stage:'b',meaning:'omission; abbreviation',kanji:'省略',note:'しょ・う・りゃ・く: four morae. This combines しょ (Unit 16) with the new りゃ.'},
 {id:'ryuu',kana:'りゅう',reading:'ryuu',stage:'b',meaning:'dragon',kanji:'竜／龍',note:'りゅ・う: two morae. The second う lengthens the vowel.'},
 {id:'ryouri',kana:'りょうり',reading:'ryouri',stage:'b',meaning:'cooking; cuisine',kanji:'料理',note:'りょ・う・り: three morae. The long vowel is spelled りょう, not りよ.'}
]);
export const CONTRASTS=Object.freeze([
 {id:'nya-niya',stage:'a',kana:'Which written form has the contracted one-mora sound nya?',answer:'にゃ',choices:[['にや','にや — ni + ya, two morae'],['にゃ','にゃ — nya, one mora']],note:'This is a written sound contrast: にゃ has one mora; にや has two. The second form is not presented as a vocabulary word.'},
 {id:'hyou-hiyou',stage:'a',kana:'Choose the word meaning “table/chart” (not “expenses”).',answer:'ひょう',choices:[['ひよう','ひよう — expenses'],['ひょう','ひょう — chart/table']],note:'ひょう (表) has two morae: ひょ・う. ひよう (費用) has three: ひ・よ・う. Small ょ changes the word.'},
 {id:'myouji-mora',stage:'b',kana:'How many morae are in みょうじ (surname)?',answer:'3',choices:[['2','2 morae'],['3','3 morae'],['4','4 morae']],note:'みょ・う・じ is three morae. Small ょ stays with み; う lengthens its vowel.'},
 {id:'ryou-riyou',stage:'b',kana:'Choose the word meaning “quantity” (not “use/utilization”).',answer:'りょう',choices:[['りょう','りょう — quantity'],['りよう','りよう — use/utilization']],note:'りょう (量) has two morae: りょ・う; りよう (利用) has three: り・よ・う.'}
]);
export const EXPRESSIONS=Object.freeze([
 {id:'price',kana:'ひゃくえんです',reading:'hyakuendesu',stage:'application',meaning:'It is 100 yen.',kanji:'百円です',note:'ひゃく is 100 and えん means yen. Read ひゃ・く・え・ん・で・す; the small ゃ makes one mora.'},
 {id:'cooking',kana:'りょうりをする',reading:'ryouriosuru',aliases:['ryouriwosuru'],stage:'application',meaning:'to cook; to do cooking',kanji:'料理をする',note:'りょうり has three morae. The object particle を is pronounced o; wo is allowed as a typing convention, not as an extra sound.'}
]);
export const CHECKPOINT_INDEX=18;
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
 {id:'introduction',label:'Contracted-sound recall',total:12},
 {id:'recognition',label:'Character recognition',total:12},
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
 result.stageMR=first.filter(r=>byId[r.taskId]?.stage==='b'&&r.correct===true&&!r.assisted).length;
 result.stageNH=first.filter(r=>byId[r.taskId]?.stage==='a'&&r.correct===true&&!r.assisted).length;
 return result;
}
