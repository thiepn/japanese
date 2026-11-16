// Kana Foundations Unit 18: voiced yōon G/J/B/P, self-contained prototype.
// No production, existing-unit, Account, StudyEvents, IndexedDB, FSRS, sync or audio writes.
export const STORAGE_KEY='thiepn:kana-foundations:yoon-gjbp:prototype-only:v1';
export const PREVIOUS_KANA='あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんがぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽっ';
export const KANA=Object.freeze([
 {id:'gya',kana:'ぎゃ',base:'ぎ',reading:'gya',stage:'a',note:'ぎ + small ゃ makes ぎゃ (gya), one mora. Full-size ぎや (giya) has two morae.'},
 {id:'gyu',kana:'ぎゅ',base:'ぎ',reading:'gyu',stage:'a',note:'ぎ + small ゅ makes ぎゅ (gyu), one mora. In ぎゅうにゅう, the う after each contracted sound contributes another mora.'},
 {id:'gyo',kana:'ぎょ',base:'ぎ',reading:'gyo',stage:'a',note:'ぎ + small ょ makes ぎょ (gyo), one mora. In ぎょうじ, the う adds one mora for the long vowel.'},
 {id:'ja',kana:'じゃ',base:'じ',reading:'ja',aliases:['zya','jya'],stage:'a',note:'じ + small ゃ makes じゃ (ja), one mora. zya/jya are permitted romanization or keyboard conventions, not separate pronunciations.'},
 {id:'ju',kana:'じゅ',base:'じ',reading:'ju',aliases:['zyu','jyu'],stage:'a',note:'じ + small ゅ makes じゅ (ju), one mora. Spell じゅう (ten) with the extra う mora.'},
 {id:'jo',kana:'じょ',base:'じ',reading:'jo',aliases:['zyo','jyo'],stage:'a',note:'じ + small ょ makes じょ (jo), one mora. じょうず (skillful) has an additional う mora.'},
 {id:'bya',kana:'びゃ',base:'び',reading:'bya',stage:'b',note:'び + small ゃ makes びゃ (bya), one mora. The number 300 is さんびゃく, not さんひゃく.'},
 {id:'byu',kana:'びゅ',base:'び',reading:'byu',stage:'b',note:'び + small ゅ makes びゅ (byu), one mora. This combination is uncommon in beginner native vocabulary; recognition does not require an invented example.'},
 {id:'byo',kana:'びょ',base:'び',reading:'byo',stage:'b',note:'び + small ょ makes びょ (byo), one mora. びょういん has a second mora after びょ because of う.'},
 {id:'pya',kana:'ぴゃ',base:'ぴ',reading:'pya',stage:'b',note:'ぴ + small ゃ makes ぴゃ (pya), one mora. In ろっぴゃく (600), small っ is a separate mora.'},
 {id:'pyu',kana:'ぴゅ',base:'ぴ',reading:'pyu',stage:'b',note:'ぴ + small ゅ makes ぴゅ (pyu), one mora. This combination is uncommon in everyday hiragana vocabulary; learn the sound-shape mapping.'},
 {id:'pyo',kana:'ぴょ',base:'ぴ',reading:'pyo',stage:'b',note:'ぴ + small ょ makes ぴょ (pyo), one mora. ぴょんぴょん is sound-symbolic language for repeated hopping.'}
]);
export const WORDS=Object.freeze([
 {id:'gyaku',kana:'ぎゃく',reading:'gyaku',stage:'a',meaning:'reverse; opposite',kanji:'逆',note:'ぎゃ・く: two morae. Full-size ぎやく would have three written morae and is not introduced as a vocabulary item.'},
 {id:'gyuunyuu',kana:'ぎゅうにゅう',reading:'gyuunyuu',stage:'a',meaning:'milk',kanji:'牛乳',note:'ぎゅ・う・にゅ・う: four morae. ぎゅ and にゅ are one contracted mora each; both long vowels add う.'},
 {id:'gyouji',kana:'ぎょうじ',reading:'gyouji',stage:'a',meaning:'event; occasion',kanji:'行事',note:'ぎょ・う・じ: three morae. Do not omit the long-vowel う.'},
 {id:'jama',kana:'じゃま',reading:'jama',aliases:['zyama','jyama'],stage:'a',meaning:'hindrance; getting in the way',kanji:'邪魔',note:'じゃ・ま: two morae. zya/jya reflect alternate typing of じゃ, not distinct speech.'},
 {id:'jugyou',kana:'じゅぎょう',reading:'jugyou',aliases:['zyugyou','jyugyou'],stage:'a',meaning:'class; lesson',kanji:'授業',note:'じゅ・ぎょ・う: three morae. This word combines J and G voiced yōon; the final う lengthens ぎょ.'},
 {id:'jouzu',kana:'じょうず',reading:'jouzu',aliases:['zyouzu','jyouzu'],stage:'a',meaning:'skillful; good at',kanji:'上手',note:'じょ・う・ず: three morae. じょうず uses small ょ and an extra う mora.'},
 {id:'sanbyaku',kana:'さんびゃく',reading:'sanbyaku',stage:'b',meaning:'three hundred',kanji:'三百',note:'さ・ん・びゃ・く: four morae. The voiced びゃ is required in the ordinary reading of 300.'},
 {id:'byouin',kana:'びょういん',reading:'byouin',stage:'b',meaning:'hospital',kanji:'病院',note:'びょ・う・い・ん: four morae. The う is the long vowel after contracted びょ.'},
 {id:'byouki',kana:'びょうき',reading:'byouki',stage:'b',meaning:'illness; sickness',kanji:'病気',note:'びょ・う・き: three morae. Full-size びようき is not the correct reading.'},
 {id:'roppyaku',kana:'ろっぴゃく',reading:'roppyaku',stage:'b',meaning:'six hundred',kanji:'六百',note:'ろ・っ・ぴゃ・く: four morae. The small っ contributes its own mora before ぴゃ.'},
 {id:'happyaku',kana:'はっぴゃく',reading:'happyaku',stage:'b',meaning:'eight hundred',kanji:'八百',note:'は・っ・ぴゃ・く: four morae. Do not omit the doubled p (small っ) or expand ぴゃ to piya.'},
 {id:'pyonpyon',kana:'ぴょんぴょん',reading:'pyonpyon',stage:'b',meaning:'repeatedly hopping or bouncing (sound-symbolic adverb)',note:'ぴょ・ん・ぴょ・ん: four morae. ぴょんぴょん is an onomatopoeic/mimetic expression, not an ordinary noun.'}
]);
export const CONTRASTS=Object.freeze([
 {id:'gya-giya',stage:'a',kana:'Which spelling contains the contracted gya of ぎゃく (reverse)?',answer:'ぎゃく',choices:[['ぎやく','ぎやく — gi + ya + ku (three morae)'],['ぎゃく','ぎゃく — gya + ku (two morae)']],note:'ぎゃく (逆, reverse) is ぎゃ・く, two morae. ぎやく is a written sound contrast, not taught as a word.'},
 {id:'juu-jiyuu',stage:'a',kana:'Choose the real word meaning “freedom” rather than “ten”.',answer:'じゆう',choices:[['じゅう','じゅう — ten'],['じゆう','じゆう — freedom']],note:'じゅう (十, ten) is じゅ・う, two morae. じゆう (自由, freedom) is じ・ゆ・う, three. Small ゅ changes both reading and meaning.'},
 {id:'sanbyaku-voicing',stage:'b',kana:'Which is the standard reading for 300?',answer:'さんびゃく',choices:[['さんひゃく','さんひゃく — unvoiced form; not the standard 300 reading'],['さんびゃく','さんびゃく — three hundred']],note:'三百 is さんびゃく (さ・ん・びゃ・く). The written さんひゃく form is a distractor, not a second vocabulary item.'},
 {id:'happyaku-mora',stage:'b',kana:'How many morae are in はっぴゃく (800)?',answer:'4',choices:[['3','3 morae'],['4','4 morae'],['5','5 morae']],note:'は・っ・ぴゃ・く: four morae. Small っ adds one mora while small ゃ merges with ぴ.'}
]);
export const EXPRESSIONS=Object.freeze([
 {id:'milk',kana:'ぎゅうにゅうをのみます',reading:'gyuunyuuonomimasu',aliases:['gyuunyuuwonomimasu'],stage:'application',meaning:'(I) drink milk',kanji:'牛乳を飲みます',note:'ぎゅうにゅう (milk) contains two contracted sounds. Object particle を sounds o; wo is permitted as a typing spelling only.'},
 {id:'hospital',kana:'びょういんにいきます',reading:'byouinniikimasu',stage:'application',meaning:'(I) go to the hospital',kanji:'病院に行きます',note:'びょういん is びょ・う・い・ん. Destination particle に is followed by いきます; keep both adjacent n sounds in byouin-ni.'}
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
 {id:'introduction',label:'Contracted-sound recall',total:12},
 {id:'recognition',label:'Character recognition',total:12},
 {id:'word',label:'Authentic word decoding',total:12},
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
 result.stageBP=first.filter(r=>byId[r.taskId]?.stage==='b'&&r.correct===true&&!r.assisted).length;
 result.stageGJ=first.filter(r=>byId[r.taskId]?.stage==='a'&&r.correct===true&&!r.assisted).length;
 return result;
}
