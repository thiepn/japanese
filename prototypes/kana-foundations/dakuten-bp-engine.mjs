// Kana Foundations Unit 14: B/P hiragana with a durable checkpoint.
// No writes to earlier kana units, Account, FSRS, audio materials or production.
export const STORAGE_KEY='thiepn:kana-foundations:dakuten-bp:prototype-only:v1';
export const PREVIOUS_KANA='あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんがぎぐげござじずぜぞだぢづでど';
export const KANA=Object.freeze([
 {id:'ba',kana:'ば',base:'は',reading:'ba',stage:'b',note:'は (ha) gets dakuten ゛ to make ば (ba). The B consonant is voiced.'},
 {id:'bi',kana:'び',base:'ひ',reading:'bi',stage:'b',note:'ひ (hi) with dakuten ゛ becomes び (bi). Distinguish the two diagonal marks from the round handakuten.'},
 {id:'bu',kana:'ぶ',base:'ふ',reading:'bu',stage:'b',note:'ふ (fu) becomes ぶ (bu) with dakuten ゛. Japanese fu is not identical to English f; do not treat this as simply voicing English f.'},
 {id:'be',kana:'べ',base:'へ',reading:'be',stage:'b',note:'へ (he) with dakuten ゛ becomes べ (be). In べんり, the noun/adjective means convenient.'},
 {id:'bo',kana:'ぼ',base:'ほ',reading:'bo',stage:'b',note:'ほ (ho) with dakuten ゛ becomes ぼ (bo). In ぼうし, the う extends the o vowel.'},
 {id:'pa',kana:'ぱ',base:'は',reading:'pa',stage:'p',note:'The small circle ゜ is handakuten: は (ha) with this circle becomes ぱ (pa). P is voiceless, not partially voiced.'},
 {id:'pi',kana:'ぴ',base:'ひ',reading:'pi',stage:'p',note:'ひ (hi) with handakuten ゜ becomes ぴ (pi), not び (bi), which has dakuten strokes.'},
 {id:'pu',kana:'ぷ',base:'ふ',reading:'pu',stage:'p',note:'ふ (fu) with handakuten ゜ becomes ぷ (pu). Contrast ふ / ぶ / ぷ visually; the starting sounds are not simply an English f/b/p voicing trio.'},
 {id:'pe',kana:'ぺ',base:'へ',reading:'pe',stage:'p',note:'へ (he) with a small circle ゜ becomes ぺ (pe). ぺこぺこ can describe strong hunger in context, but has other meanings.'},
 {id:'po',kana:'ぽ',base:'ほ',reading:'po',stage:'p',note:'ほ (ho) with the round handakuten ゜ becomes ぽ (po), as in さんぽ (stroll).'}
]);
export const WORDS=Object.freeze([
 {id:'barabara',kana:'ばらばら',reading:'barabara',stage:'b',meaning:'scattered; in pieces',note:'ばらばら describes things scattered or separated. This is one contextual meaning of a Japanese mimetic expression.'},
 {id:'bin',kana:'びん',reading:'bin',stage:'b',meaning:'bottle',kanji:'瓶 / ビン',note:'びん means bottle. Real-world writing also includes 瓶 or ビン; kana-only spelling here is for reading practice.'},
 {id:'buta',kana:'ぶた',reading:'buta',stage:'b',meaning:'pig',kanji:'豚',note:'ぶた is pig. Kanji 豚 is common, while hiragana is appropriate for early reading.'},
 {id:'benri',kana:'べんり',reading:'benri',stage:'b',meaning:'convenient',kanji:'便利',note:'べんり is convenient. Writing is often 便利, shown after the response.'},
 {id:'boushi',kana:'ぼうし',reading:'boushi',stage:'b',meaning:'hat',kanji:'帽子',note:'ぼうし is a hat. The う gives a long o vowel; bo-shi without the long vowel is not an accurate reading.'},
 {id:'sanpatsu',kana:'さんぱつ',reading:'sanpatsu',stage:'p',meaning:'haircut',kanji:'散髪',note:'さんぱつ means a haircut, commonly written 散髪. The ん occupies its own timing beat before ぱ.'},
 {id:'enpitsu',kana:'えんぴつ',reading:'enpitsu',stage:'p',meaning:'pencil',kanji:'鉛筆',note:'えんぴつ means pencil, commonly written 鉛筆. The mora ん remains in the reading.'},
 {id:'tenpura',kana:'てんぷら',reading:'tenpura',stage:'p',meaning:'tempura',kanji:'天ぷら / 天麩羅 / テンプラ',note:'てんぷら is tempura; Japanese writing commonly uses 天ぷら or テンプラ, not only hiragana. This is not evidence that loanwords generally use hiragana.'},
 {id:'pekopeko',kana:'ぺこぺこ',reading:'pekopeko',stage:'p',meaning:'very hungry (in context)',note:'ぺこぺこ describes hunger in the later おなかがぺこぺこ expression, but can also mean bowing or bending repeatedly; meaning depends on context.'},
 {id:'sanpo',kana:'さんぽ',reading:'sanpo',stage:'p',meaning:'walk; stroll',kanji:'散歩',note:'さんぽ is a walk or stroll, often written 散歩. The ん is a separate timing unit.'}
]);
export const CONTRASTS=Object.freeze([
 {id:'ba-ha',stage:'b',prompt:'Choose the B-row voiced character ba, not ha.',answer:'ば',choices:['は','ば'],note:'ば has two dakuten strokes; は is unmarked.'},
 {id:'bo-ho',stage:'b',prompt:'Choose the B-row voiced character bo, not ho.',answer:'ぼ',choices:['ぼ','ほ'],note:'ぼ has dakuten, while ほ is unmarked.'},
 {id:'pa-ha-ba',stage:'p',prompt:'Choose pa: the version marked with the small circle (not ha or ba).',answer:'ぱ',choices:['は','ば','ぱ'],note:'は has no mark; ば has the two-stroke dakuten; ぱ has the small circular handakuten.'},
 {id:'pu-fu-bu',stage:'p',prompt:'Choose pu: the circle-marked character (not fu or bu).',answer:'ぷ',choices:['ふ','ぶ','ぷ'],note:'The different marks produce ふ (fu), ぶ (bu) and ぷ (pu); do not describe this as voicing an English f sound.'}
]);
export const PHRASES=Object.freeze([
 {id:'where-hat',kana:'ぼうしはどこですか',reading:'boushiwadokodesuka',stage:'application',meaning:'Where is the hat?',note:'ぼうし (hat) has a long o; は is the topic particle pronounced wa; どこ (where) + ですか makes a polite question.'},
 {id:'hungry',kana:'おなかがぺこぺこ',reading:'onakagapekopeko',stage:'application',meaning:'My stomach is empty / I am very hungry.',note:'おなか (stomach) + が (subject particle) + ぺこぺこ (extremely hungry in this context). The mimetic word has other senses elsewhere.'}
]);
export const CHECKPOINT_INDEX=17;
const intro=k=>({id:'intro-'+k.id,mode:'introduction',stage:k.stage,kana:k.kana,base:k.base,answer:k.reading,aliases:k.aliases||[],note:k.note});
const recognize=(k,group,index)=>({id:'recognition-'+k.id,mode:'recognition',stage:k.stage,kana:k.kana,answer:k.reading,aliases:[],choices:[...group.slice(index),...group.slice(0,index)].map(x=>({value:x.reading,label:x.reading})),note:'Choose the spoken reading of this character.'});
const word=w=>({id:'word-'+w.id,mode:'word',stage:w.stage,kana:w.kana,answer:w.reading,aliases:w.aliases||[],meaning:w.meaning,kanji:w.kanji,note:w.note});
const contrast=c=>({id:'contrast-'+c.id,mode:'contrast',stage:c.stage,kana:c.prompt,answer:c.answer,aliases:[],choices:c.choices.map(value=>({value,label:value})),note:c.note});
const phrase=p=>({id:'phrase-'+p.id,mode:'phrase',stage:p.stage,kana:p.kana,answer:p.reading,aliases:p.aliases||[],meaning:p.meaning,note:p.note});
function makeStage(stage){
 const group=KANA.filter(k=>k.stage===stage);
 return [...group.map(intro),...group.map((k,i)=>recognize(k,group,i)),...WORDS.filter(w=>w.stage===stage).map(word),...CONTRASTS.filter(c=>c.stage===stage).map(contrast)];
}
export const TASKS=Object.freeze([...makeStage('b'),...makeStage('p'),...PHRASES.map(phrase)]);
export const MODES=Object.freeze([
 {id:'introduction',label:'Character recall',total:10},
 {id:'recognition',label:'Character recognition',total:10},
 {id:'word',label:'Word decoding',total:10},
 {id:'contrast',label:'Mark and sound contrasts',total:4},
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
 result.stageB=first.filter(r=>byId[r.taskId]?.stage==='b'&&r.correct===true&&!r.assisted).length;
 result.stageP=first.filter(r=>byId[r.taskId]?.stage==='p'&&r.correct===true&&!r.assisted).length;
 return result;
}
