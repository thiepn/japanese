// Kana Foundations Unit 15: sokuon, small tsu and Japanese mora timing.
// Dedicated prototype namespace only; never writes Unit 01-14, Account, FSRS, IndexedDB or production.
export const STORAGE_KEY='thiepn:kana-foundations:sokuon-rhythm:prototype-only:v1';
export const PREVIOUS_KANA='あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんがぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽ';
export const CHECKPOINT_INDEX=18;
export const FORM=Object.freeze([
 {id:'small-tsu',kana:'Which character is the small っ used in きって (stamp)?',answer:'っ',choices:[['つ','つ (full tsu)'],['っ','っ (small tsu)']],note:'Full つ (tsu) represents a spoken mora, while small っ marks one mora of length for the following consonant. Do not pronounce っ as tsu.'},
 {id:'mora-count',kana:'How many morae does きって (stamp) contain?',answer:'3',choices:[['2','2 morae'],['3','3 morae'],['4','4 morae']],note:'き・っ・て counts as three morae: ki, one timing unit for the held consonant, te. Small っ is not a separately pronounced tsu.'}
]);
export const PAIRS=Object.freeze([
 {id:'kite-kitte',kana:'Choose the Japanese word meaning “postage stamp” (not “come”).',answer:'きって',choices:[['きて','きて — come'],['きって','きって — postage stamp']],note:'きて (kite) and きって (kitte) are different words; small っ adds consonant length and a mora.'},
 {id:'saka-sakka',kana:'Choose the Japanese word meaning “writer” (not “slope”).',answer:'さっか',choices:[['さか','さか — slope'],['さっか','さっか — writer']],note:'さか (saka) is slope; さっか (sakka) is writer. The doubled k in kana-faithful romaji represents the small っ.'},
 {id:'kako-kakko',kana:'Choose the Japanese word meaning “parentheses” (not “past”).',answer:'かっこ',choices:[['かこ','かこ — past'],['かっこ','かっこ — parentheses']],note:'かこ (kako) means past; かっこ (kakko) can mean parentheses or brackets. This is a written contrast, not a listening assessment.'},
 {id:'seken-sekken',kana:'Choose the Japanese word meaning “soap” (not “society”).',answer:'せっけん',choices:[['せけん','せけん — society'],['せっけん','せっけん — soap']],note:'せけん (seken) means society/the world; せっけん (sekken) is soap. Extra っ changes the word.'}
]);
export const WORDS=Object.freeze([
 {id:'kitte',kana:'きって',reading:'kitte',meaning:'postage stamp',kanji:'切手',note:'Small っ before て doubles the t in romaji. き・っ・て is three morae.'},
 {id:'kippu',kana:'きっぷ',reading:'kippu',meaning:'ticket',kanji:'切符',note:'Small っ before ぷ doubles p. きっぷ means ticket; omitting the extra consonant is incorrect.'},
 {id:'sakka',kana:'さっか',reading:'sakka',meaning:'writer; author',kanji:'作家',note:'Small っ before か doubles k. Writer is not the same word as さか (slope).'},
 {id:'zasshi',kana:'ざっし',reading:'zasshi',meaning:'magazine',kanji:'雑誌',note:'Small っ before し lengthens the sh consonant sequence, conventionally written ssh in zasshi (not zashi).'},
 {id:'sekken',kana:'せっけん',reading:'sekken',meaning:'soap',kanji:'石鹸',note:'Small っ before け doubles k, producing sekken rather than seken (society).'},
 {id:'happa',kana:'はっぱ',reading:'happa',meaning:'leaf',kanji:'葉っぱ',note:'Small っ before ぱ doubles p. Leaves are commonly written 葉っぱ.'},
 {id:'matte',kana:'まって',reading:'matte',meaning:'wait (casual request)',kanji:'待って',note:'まって is the casual te-form request to wait, not the polite imperative. っ doubles t.'},
 {id:'motto',kana:'もっと',reading:'motto',meaning:'more; further',note:'もっと is an adverb meaning more or further. Small っ doubles the t.'}
]);
export const SPELLINGS=Object.freeze([
 {id:'kitte',kana:'きって',answer:'kitte',choices:[['kite','kite'],['kitte','kitte']],note:'きって is kitte with a doubled t. きて is kite, a different word.'},
 {id:'kippu',kana:'きっぷ',answer:'kippu',choices:[['kippu','kippu'],['kipu','kipu']],note:'きっぷ is kippu with doubled p; ki-pu does not represent the small っ.'},
 {id:'zasshi',kana:'ざっし',answer:'zasshi',choices:[['zashi','zashi'],['zasshi','zasshi']],note:'ざっし is written zasshi, not zashi. Japanese sh remains a single consonant sound with extra timing.'},
 {id:'happa',kana:'はっぱ',answer:'happa',choices:[['hapa','hapa'],['happa','happa']],note:'はっぱ is happa with doubled p, not hapa.'}
]);
export const VOWELS=Object.freeze([
 {id:'grandmother',kana:'Choose the word meaning “grandmother” rather than “aunt”.',answer:'おばあさん',choices:[['おばさん','おばさん — aunt'],['おばあさん','おばあさん — grandmother']],note:'おばさん (aunt) and おばあさん (grandmother) contrast in vowel length. The extra あ contributes one mora.'},
 {id:'grandfather',kana:'Choose the word meaning “grandfather” rather than “uncle”.',answer:'おじいさん',choices:[['おじいさん','おじいさん — grandfather'],['おじさん','おじさん — uncle']],note:'おじさん (uncle) and おじいさん (grandfather) contrast in vowel length; the extra い adds a mora.'},
 {id:'boushi',kana:'ぼうし',reading:'boushi',meaning:'hat',kanji:'帽子',note:'The う extends the preceding o sound; kana-faithful input is boushi, not boshi. Pronunciation-oriented Hepburn can use bōshi.'},
 {id:'gakkou',kana:'がっこう',reading:'gakkou',meaning:'school',kanji:'学校',note:'がっこう contains both っ for doubled k and う for a long o: が・っ・こ・う is four morae. Use gakkou, not gakko.'}
]);
export const EXPRESSIONS=Object.freeze([
 {id:'buy-ticket',kana:'きっぷをかう',reading:'kippuokau',aliases:['kippuwokau'],meaning:'buy a ticket',kanji:'切符を買う',note:'きっぷ (ticket) retains doubled p. The object particle を is pronounced o; wo is accepted only as a keyboard/romaji spelling convention.'},
 {id:'read-magazine',kana:'ざっしをよむ',reading:'zasshioyomu',aliases:['zasshiwoyomu'],meaning:'read a magazine',kanji:'雑誌を読む',note:'ざっし (magazine) retains doubled s before sh. The object particle を is pronounced o; wo is an accepted typing convention.'}
]);
const selected=(entry,mode,stage)=>({id:mode+'-'+entry.id,mode,stage,kana:entry.kana,answer:entry.answer,aliases:[],choices:entry.choices.map(([value,label])=>({value,label})),note:entry.note});
const word=w=>({id:'word-'+w.id,mode:'word',stage:'sokuon',kana:w.kana,answer:w.reading,aliases:[],meaning:w.meaning,kanji:w.kanji,note:w.note});
const review=v=>v.choices?selected(v,'vowel-choice','rhythm'):{
 id:'vowel-read-'+v.id,mode:'vowel-read',stage:'rhythm',kana:v.kana,answer:v.reading,aliases:[],meaning:v.meaning,kanji:v.kanji,note:v.note
};
const phrase=p=>({id:'phrase-'+p.id,mode:'phrase',stage:'application',kana:p.kana,answer:p.reading,aliases:p.aliases,meaning:p.meaning,kanji:p.kanji,note:p.note});
export const TASKS=Object.freeze([
 ...FORM.map(x=>selected(x,'form','sokuon')),
 ...PAIRS.map(x=>selected(x,'pair','sokuon')),
 ...WORDS.map(word),
 ...SPELLINGS.map(x=>selected(x,'spelling','sokuon')),
 ...VOWELS.map(review),
 ...EXPRESSIONS.map(phrase)
]);
export const MODES=Object.freeze([
 {id:'form',label:'Small っ and mora counting',total:2},
 {id:'pair',label:'Meaning-changing contrasts',total:4},
 {id:'word',label:'Sokuon word decoding',total:8},
 {id:'spelling',label:'Consonant-doubling spelling',total:4},
 {id:'vowel-choice',label:'Long-vowel meaning contrasts',total:2},
 {id:'vowel-read',label:'Long-vowel word reading',total:2},
 {id:'phrase',label:'Cumulative expressions',total:2}
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
 result.stageSokuon=first.filter(r=>byId[r.taskId]?.stage==='sokuon'&&r.correct===true&&!r.assisted).length;
 result.stageRhythm=first.filter(r=>byId[r.taskId]?.stage==='rhythm'&&r.correct===true&&!r.assisted).length;
 return result;
}
