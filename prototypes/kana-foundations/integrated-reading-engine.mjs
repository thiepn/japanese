// Unit 19: integrated hiragana reading; no new kana, no production/Account/FSRS writes.
export const STORAGE_KEY='thiepn:kana-foundations:integrated-reading:prototype-only:v1';
export const PREVIOUS_KANA='あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんがぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽっゃゅょ';
export const KANA=Object.freeze([]);
export const WORDS=Object.freeze([
 {id:'kippu',kana:'きっぷ',reading:'kippu',stage:'a',meaning:'ticket',kanji:'切符',note:'き・っ・ぷ: three morae. Small っ holds the consonant; type pp.'},
 {id:'gakkou',kana:'がっこう',reading:'gakkou',stage:'a',meaning:'school',kanji:'学校',note:'が・っ・こ・う: four morae, including small っ and long-vowel う.'},
 {id:'ryokou',kana:'りょこう',reading:'ryokou',stage:'a',meaning:'trip; travel',kanji:'旅行',note:'りょ・こ・う: three morae. Small ょ contracts りょ; う lengthens こ.'},
 {id:'biyouin',kana:'びよういん',reading:'biyouin',stage:'a',meaning:'beauty salon',kanji:'美容院',note:'び・よ・う・い・ん: five morae. Contrast びょういん (hospital), four.'},
 {id:'kyoushitsu',kana:'きょうしつ',reading:'kyoushitsu',aliases:['kyousitu'],stage:'a',meaning:'classroom',kanji:'教室',note:'きょ・う・し・つ: four morae. situ is an accepted Kunrei spelling of shitsu.'},
 {id:'chuushajou',kana:'ちゅうしゃじょう',reading:'chuushajou',stage:'a',meaning:'parking lot',kanji:'駐車場',note:'ちゅ・う・しゃ・じょ・う: five morae; three contracted groups and two long vowels.'},
 {id:'jisho',kana:'じしょ',reading:'jisho',aliases:['zisyo'],stage:'a',meaning:'dictionary',kanji:'辞書',note:'じ・しょ: two morae; small ょ belongs to the しょ combination.'},
 {id:'shuumatsu',kana:'しゅうまつ',reading:'shuumatsu',aliases:['syuumatu'],stage:'a',meaning:'weekend',kanji:'週末',note:'しゅ・う・ま・つ: four morae. Do not omit the long-vowel う.'},
 {id:'byouin',kana:'びょういん',reading:'byouin',stage:'a',meaning:'hospital',kanji:'病院',note:'びょ・う・い・ん: four morae. びよういん is a beauty salon.'},
 {id:'sanbyaku',kana:'さんびゃく',reading:'sanbyaku',stage:'a',meaning:'three hundred',kanji:'三百',note:'さ・ん・びゃ・く: four morae. 300 has voiced びゃ.'},
 {id:'kyaku',kana:'きゃく',reading:'kyaku',stage:'a',meaning:'guest; customer',kanji:'客',note:'きゃ・く: two morae. きやく (規約) is a different word.'},
 {id:'shokudou',kana:'しょくどう',reading:'shokudou',aliases:['syokudou'],stage:'a',meaning:'cafeteria; dining hall',kanji:'食堂',note:'しょ・く・ど・う: four morae; small ょ and a long vowel.'}
]);
export const EXPRESSIONS=Object.freeze([
 {id:'school',kana:'きょうはがっこうにいきます',reading:'kyouwagakkouniikimasu',stage:'application',meaning:'I go to school today',kanji:'今日は学校に行きます',note:'Topic particle は sounds wa; に is the destination particle. Keep っ and long vowels.'},
 {id:'ticket',kana:'きっぷをかいます',reading:'kippuokaimasu',aliases:['kippuwokaimasu'],stage:'application',meaning:'I buy a ticket',kanji:'切符を買います',note:'The object particle を is spoken o. wo is only a permitted typing convention.'},
 {id:'hospital',kana:'びょういんはどこですか',reading:'byouinwadokodesuka',stage:'application',meaning:'Where is the hospital?',kanji:'病院はどこですか',note:'びょ is contracted; topic particle は is pronounced wa.'},
 {id:'photo',kana:'しゃしんをみせてください',reading:'shashinomisetekudasai',aliases:['shashinwomisetekudasai','syasinomisetekudasai'],stage:'application',meaning:'Please show me the photograph',kanji:'写真を見せてください',note:'しゃ is a contracted mora and を is pronounced o.'},
 {id:'tomorrow',kana:'あしたはやすみです',reading:'ashitawayasumidesu',aliases:['asitawayasumidesu'],stage:'application',meaning:'Tomorrow is a day off',kanji:'明日は休みです',note:'Topic particle は is pronounced wa, but regular は in a word is ha.'},
 {id:'class',kana:'じゅぎょうはなんじですか',reading:'jugyouwananjidesuka',stage:'application',meaning:'What time is class?',kanji:'授業は何時ですか',note:'じゅ・ぎょ・う is three morae. なんじ means what time. は sounds wa.'},
 {id:'wait',kana:'ちょっとまってください',reading:'chottomattekudasai',stage:'application',meaning:'Please wait a moment',kanji:'ちょっと待ってください',note:'ちょ・っ・と・ま・っ・て: six morae before ください. Two small っ are heard as holds.'},
 {id:'travel',kana:'りょこうがすきです',reading:'ryokougasukidesu',stage:'application',meaning:'I like traveling',kanji:'旅行が好きです',note:'りょ is one contracted mora. う lengthens こ. が marks the liked subject.'}
]);
export const CONTRASTS=Object.freeze([
 {id:'salon-hospital',stage:'a',kana:'Which word means beauty salon rather than hospital?',answer:'びよういん',choices:[['びょういん','びょういん — hospital'],['びよういん','びよういん — beauty salon']],note:'び・よ・う・い・ん has five morae; びょ・う・い・ん has four.'},
 {id:'kippu-mora',stage:'a',kana:'How many morae are in きっぷ?',answer:'3',choices:[['2','2 morae'],['3','3 morae'],['4','4 morae']],note:'き・っ・ぷ is three morae; small っ counts as one.'},
 {id:'today',stage:'a',kana:'Which word means today (not skillful)?',answer:'きょう',choices:[['きよう','きよう — skillful'],['きょう','きょう — today']],note:'今日 (きょ・う) has two morae; 器用 (き・よ・う) has three.'},
 {id:'parking-mora',stage:'a',kana:'How many morae are in ちゅうしゃじょう?',answer:'5',choices:[['4','4 morae'],['5','5 morae'],['6','6 morae']],note:'ちゅ・う・しゃ・じょ・う is five morae.'},
 {id:'topic-ha',stage:'b',kana:'How is きょうは pronounced with topic particle は?',answer:'kyouwa',choices:[['kyouha','kyouha — ordinary character ha'],['kyouwa','kyouwa — particle sounds wa']],note:'The topic particle は sounds wa; the sound ha is used inside ordinary words.'},
 {id:'object-wo',stage:'b',kana:'What is the standard spoken reading of きっぷを?',answer:'kippuo',choices:[['kippuwo','kippuwo — typing convention'],['kippuo','kippuo — spoken object particle o']],note:'を is typed wo in input methods but normally pronounced o as a particle.'},
 {id:'nasal-ni',stage:'b',kana:'Which reading retains ん and に in びょういんに?',answer:'byouinni',choices:[['byouini','byouini — misses nasal ん'],['byouinni','byouinni — びょういん + に']],note:'byouin + ni is byouinni: retain ん as n and に as ni.'},
 {id:'wait-mora',stage:'b',kana:'How many morae are in ちょっとまって?',answer:'6',choices:[['5','5 morae'],['6','6 morae'],['7','7 morae']],note:'ちょ・っ・と・ま・っ・て is six morae.'}
]);
export const CHECKPOINT_INDEX=16;
const intro=k=>({id:'intro-'+k.id,mode:'introduction',stage:k.stage,kana:k.kana,base:k.base,answer:k.reading,aliases:k.aliases||[],note:k.note});
const recognition=(k,group,index)=>({id:'recognition-'+k.id,mode:'recognition',stage:k.stage,kana:k.kana,answer:k.reading,aliases:[],choices:[...group.slice(index),...group.slice(0,index)].map(x=>({value:x.reading,label:x.reading})),note:'Choose the standard pronunciation and recognize small ゃ, ゅ or ょ.'});
const word=w=>({id:'word-'+w.id,mode:'word',stage:w.stage,kana:w.kana,answer:w.reading,aliases:w.aliases||[],meaning:w.meaning,kanji:w.kanji,note:w.note});
const contrast=c=>({id:'contrast-'+c.id,mode:'contrast',stage:c.stage,kana:c.kana,answer:c.answer,aliases:[],choices:c.choices.map(([value,label])=>({value,label})),note:c.note});
const phrase=p=>({id:'phrase-'+p.id,mode:'phrase',stage:p.stage,kana:p.kana,answer:p.reading,aliases:p.aliases||[],meaning:p.meaning,kanji:p.kanji,note:p.note});
function makeStage(stage){
 const group=KANA.filter(k=>k.stage===stage);
 return [...group.map(intro),...group.map((k,i)=>recognition(k,group,i)),...WORDS.filter(w=>w.stage===stage).map(word),...CONTRASTS.filter(c=>c.stage===stage).map(contrast)];
}
export const TASKS=Object.freeze([...makeStage('a'),...EXPRESSIONS.map(phrase),...makeStage('b')]);
export const MODES=Object.freeze([
 {id:'word',label:'Authentic word decoding',total:12},
 {id:'phrase',label:'Independent sentence reading',total:8},
 {id:'contrast',label:'Meaning, sound and mora contrasts',total:8}
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
 result.stageB=first.filter(r=>['b','application'].includes(byId[r.taskId]?.stage)&&r.correct===true&&!r.assisted).length;
 result.stageA=first.filter(r=>byId[r.taskId]?.stage==='a'&&r.correct===true&&!r.assisted).length;
 return result;
}
