// Kana Foundations Unit 12: voiced hiragana G- and Z-rows.
// Standalone prototype; no Account, FSRS, earlier-unit, or production writes.
export const STORAGE_KEY='thiepn:kana-foundations:dakuten-gz:prototype-only:v1';
export const BASE_KANA='あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん';
export const KANA=Object.freeze([
 {id:'ga',kana:'が',base:'か',reading:'ga',stage:'g',note:'Two small dakuten marks (゛) change か (ka) into が (ga). Keep the same short a vowel.'},
 {id:'gi',kana:'ぎ',base:'き',reading:'gi',stage:'g',note:'き (ki) becomes ぎ (gi) when voiced. The dakuten are part of the character, not a second syllable.'},
 {id:'gu',kana:'ぐ',base:'く',reading:'gu',stage:'g',note:'く (ku) becomes ぐ (gu). Voice the initial consonant and keep the u vowel short.'},
 {id:'ge',kana:'げ',base:'け',reading:'ge',stage:'g',note:'け (ke) becomes げ (ge). Compare the dakuten carefully when reading quickly.'},
 {id:'go',kana:'ご',base:'こ',reading:'go',stage:'g',note:'こ (ko) becomes ご (go). Dakuten mark the voiced consonant, not a longer vowel.'},
 {id:'za',kana:'ざ',base:'さ',reading:'za',stage:'z',note:'さ (sa) becomes ざ (za). The voiced z sound contrasts with the unvoiced s sound.'},
 {id:'ji',kana:'じ',base:'し',reading:'ji',aliases:['zi'],stage:'z',note:'し (shi) becomes じ, read ji in standard Japanese. Type zi if your keyboard convention uses it; it is not a different spoken sound.'},
 {id:'zu',kana:'ず',base:'す',reading:'zu',stage:'z',note:'す (su) becomes ず (zu). The similarly pronounced づ is taught later and is not this character.'},
 {id:'ze',kana:'ぜ',base:'せ',reading:'ze',stage:'z',note:'せ (se) becomes ぜ (ze). Look for both dakuten marks.'},
 {id:'zo',kana:'ぞ',base:'そ',reading:'zo',stage:'z',note:'そ (so) becomes ぞ (zo). In ぞう (elephant) the following う makes a long o sound.'}
]);
export const WORDS=Object.freeze([
 {id:'gakusei',kana:'がくせい',reading:'gakusei',stage:'g',meaning:'student',kanji:'学生',note:'A genuine everyday word: student.'},
 {id:'kagi',kana:'かぎ',reading:'kagi',stage:'g',meaning:'key',kanji:'鍵',note:'か (ka) is unvoiced; ぎ (gi) is voiced.'},
 {id:'kagu',kana:'かぐ',reading:'kagu',stage:'g',meaning:'furniture',kanji:'家具',note:'Furniture is a collective noun here.'},
 {id:'genki',kana:'げんき',reading:'genki',stage:'g',meaning:'well; energetic',kanji:'元気',note:'A common word for being healthy, well, or energetic; ん has its own timing beat.'},
 {id:'gohan',kana:'ごはん',reading:'gohan',stage:'g',meaning:'cooked rice; meal',kanji:'ご飯',note:'ごはん can refer to cooked rice or a meal, depending on context.'},
 {id:'zaseki',kana:'ざせき',reading:'zaseki',stage:'z',meaning:'seat',kanji:'座席',note:'A genuine word, often used for assigned or designated seats.'},
 {id:'jikan',kana:'じかん',reading:'jikan',aliases:['zikan'],stage:'z',meaning:'time; duration',kanji:'時間',note:'じ is pronounced ji; some typing systems spell it zi.'},
 {id:'mizu',kana:'みず',reading:'mizu',stage:'z',meaning:'water',kanji:'水',note:'み is unvoiced m, while ず begins with a voiced z sound.'},
 {id:'kaze',kana:'かぜ',reading:'kaze',stage:'z',meaning:'wind; common cold (depending on context)',kanji:'風 / 風邪',note:'かぜ can mean wind (風) or a common cold (風邪); context or kanji disambiguates it.'},
 {id:'zou',kana:'ぞう',reading:'zou',stage:'z',meaning:'elephant',kanji:'象',note:'ぞう is pronounced with a long o vowel. Type zou: zo alone omits the final vowel.'}
]);
export const CONTRASTS=Object.freeze([
 {id:'ga-ka',stage:'g',prompt:'Choose the voiced character for ga, not ka.',answer:'が',choices:['か','が'],note:'が has dakuten; か does not.'},
 {id:'gi-ki',stage:'g',prompt:'Choose the voiced character for gi, not ki.',answer:'ぎ',choices:['ぎ','き'],note:'ぎ is the voiced form of き.'},
 {id:'ji-shi',stage:'z',prompt:'Choose the voiced character for ji, not shi.',answer:'じ',choices:['し','じ'],note:'じ is read ji; し is read shi.'},
 {id:'zu-su',stage:'z',prompt:'Choose the voiced character for zu, not su.',answer:'ず',choices:['ず','す'],note:'ず is the voiced form of す.'}
]);
export const PHRASES=Object.freeze([
 {id:'kagi-sagasu',kana:'かぎをさがす',reading:'kagiosagasu',aliases:['kagiwosagasu'],stage:'application',meaning:'look for a key',kanji:'鍵を探す',note:'かぎ (key) + を (object, pronounced o) + さがす (look for).'},
 {id:'mizu-nomu',kana:'みずをのむ',reading:'mizuonomu',aliases:['mizuwonomu'],stage:'application',meaning:'drink water',kanji:'水を飲む',note:'みず (water) + を (object, pronounced o) + のむ (drink).'}
]);
export const CHECKPOINT_INDEX=17;
const intro=k=>({id:'intro-'+k.id,mode:'introduction',stage:k.stage,kana:k.kana,base:k.base,answer:k.reading,aliases:k.aliases||[],note:k.note});
const recognize=(k,group,index)=>({id:'recognition-'+k.id,mode:'recognition',stage:k.stage,kana:k.kana,answer:k.reading,aliases:[],choices:[...group.slice(index),...group.slice(0,index)].map(x=>({value:x.reading,label:x.reading})),note:'Identify this voiced kana by its sound.'});
const word=w=>({id:'word-'+w.id,mode:'word',stage:w.stage,kana:w.kana,answer:w.reading,aliases:w.aliases||[],meaning:w.meaning,kanji:w.kanji,note:w.note});
const contrast=c=>({id:'contrast-'+c.id,mode:'contrast',stage:c.stage,kana:c.prompt,answer:c.answer,aliases:[],choices:c.choices.map(value=>({value,label:value})),note:c.note});
const phrase=p=>({id:'phrase-'+p.id,mode:'phrase',stage:p.stage,kana:p.kana,answer:p.reading,aliases:p.aliases||[],meaning:p.meaning,kanji:p.kanji,note:p.note});
function makeStage(stage){
 const group=KANA.filter(k=>k.stage===stage);
 return [...group.map(intro),...group.map((k,i)=>recognize(k,group,i)),...WORDS.filter(w=>w.stage===stage).map(word),...CONTRASTS.filter(c=>c.stage===stage).map(contrast)];
}
export const TASKS=Object.freeze([...makeStage('g'),...makeStage('z'),...PHRASES.map(phrase)]);
export const MODES=Object.freeze([
 {id:'introduction',label:'Character recall',total:10},
 {id:'recognition',label:'Character recognition',total:10},
 {id:'word',label:'Word decoding',total:10},
 {id:'contrast',label:'Voicing contrasts',total:4},
 {id:'phrase',label:'Practical expressions',total:2}
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
 result.stageG=first.filter(r=>byId[r.taskId]?.stage==='g'&&r.correct===true&&!r.assisted).length;
 result.stageZ=first.filter(r=>byId[r.taskId]?.stage==='z'&&r.correct===true&&!r.assisted).length;
 return result;
}
