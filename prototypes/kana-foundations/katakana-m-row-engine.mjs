// Unit 26 katakana M-row, isolated prototype, no historical learner data or Account/FSRS writes.
export const STORAGE_KEY='thiepn:kana-foundations:katakana-m-row:prototype-only:v1';
export const PREVIOUS_KATAKANA='アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ';
export const KANA=Object.freeze([
 {
  "id": "ma",
  "kana": "マ",
  "base": "ま",
  "reading": "ma",
  "stage": "a",
  "note": "マ is katakana ma, matching hiragana ま. The pointed form differs from ム (mu) and from the existing kana ア (a)."
 },
 {
  "id": "mi",
  "kana": "ミ",
  "base": "み",
  "reading": "mi",
  "stage": "a",
  "note": "ミ is katakana mi, matching hiragana み. Its three descending horizontal strokes distinguish it from ニ (ni), which has two."
 },
 {
  "id": "mu",
  "kana": "ム",
  "base": "む",
  "reading": "mu",
  "stage": "a",
  "note": "ム is katakana mu, matching hiragana む. Note the closing angle and short rightward stroke; do not confuse it with マ (ma)."
 },
 {
  "id": "me",
  "kana": "メ",
  "base": "め",
  "reading": "me",
  "stage": "a",
  "note": "メ is katakana me, matching hiragana め. Its two intersecting strokes distinguish it from the earlier ナ (na)."
 },
 {
  "id": "mo",
  "kana": "モ",
  "base": "も",
  "reading": "mo",
  "stage": "a",
  "note": "モ is katakana mo, matching hiragana も. Notice the pair of horizontal strokes and hooked vertical stroke; compare キ (ki), which has a different shape."
 }
]);
export const WORDS=Object.freeze([
 {
  "id": "mame",
  "kana": "マメ",
  "reading": "mame",
  "stage": "a",
  "meaning": "bean; beans",
  "kanji": "豆",
  "note": "マ・メ are two morae. マメ is a real Japanese word for bean/beans (豆); a plant or produce label can use katakana. 豆/まめ are also familiar general writings."
 },
 {
  "id": "mimi",
  "kana": "ミミ",
  "reading": "mimi",
  "stage": "a",
  "meaning": "ear",
  "kanji": "耳",
  "note": "ミ・ミ are two morae. ミミ represents ear (耳); this is a legitimate full-katakana reading exercise, though everyday writing normally uses 耳 or みみ."
 },
 {
  "id": "mushi",
  "kana": "ムシ",
  "reading": "mushi",
  "aliases": [
   "musi"
  ],
  "stage": "a",
  "meaning": "insect; bug",
  "kanji": "虫",
  "note": "ム・シ are two morae. ムシ is a natural katakana animal name for an insect (虫), also written むし. シ is shi in Hepburn, si in Kunrei, so musi is a valid alternate transcription."
 },
 {
  "id": "memo",
  "kana": "メモ",
  "reading": "memo",
  "stage": "b",
  "meaning": "memo; note",
  "note": "メ・モ are two morae. メモ is the ordinary katakana loanword for a brief note/memo; it is not ママ (mom)."
 },
 {
  "id": "momo",
  "kana": "モモ",
  "reading": "momo",
  "stage": "b",
  "meaning": "peach (fruit context)",
  "kanji": "桃",
  "note": "モ・モ are two morae. モモ is peach (桃) at a fruit shop. In poultry labels モモ can instead indicate the thigh cut; the fruit meaning is assessed here."
 },
 {
  "id": "masuku",
  "kana": "マスク",
  "reading": "masuku",
  "stage": "b",
  "meaning": "face mask",
  "note": "マ・ス・ク are three morae. マスク is the everyday katakana loanword for a mask; all characters were previously taught. It is not マウス (computer mouse)."
 },
 {
  "id": "mama",
  "kana": "ママ",
  "reading": "mama",
  "stage": "b",
  "meaning": "mama; mom (informal)",
  "note": "マ・マ are two morae. ママ is a familiar Japanese address for one's mother, especially in children's speech. It is distinct from メモ (a written note)."
 },
 {
  "id": "mausu",
  "kana": "マウス",
  "reading": "mausu",
  "stage": "b",
  "meaning": "computer mouse (pointing device)",
  "note": "マ・ウ・ス are three morae. マウス is the common katakana loanword for a computer mouse, also used for some animal/laboratory contexts. Here it means the pointing device."
 },
 {
  "id": "mochi",
  "kana": "モチ",
  "reading": "mochi",
  "aliases": [
   "moti"
  ],
  "stage": "b",
  "meaning": "mochi; Japanese rice cake",
  "kanji": "餅",
  "note": "モ・チ are two morae. モチ is Japanese rice cake (餅), also written もち or 餅. チ is chi in Hepburn, ti in Kunrei, so moti is a valid written alternative."
 },
 {
  "id": "mune",
  "kana": "ムネ",
  "reading": "mune",
  "stage": "b",
  "meaning": "chicken breast meat (poultry-label context)",
  "kanji": "胸",
  "note": "ム・ネ are two morae. ムネ refers to breast/chest (胸), and on poultry labels means the chicken breast cut; it is not the fruit モモ. The everyday body-part spelling is normally 胸 or むね."
 }
]);
export const EXPRESSIONS=Object.freeze([]);
export const CONTRASTS=Object.freeze([
 {
  "id": "script-mu",
  "stage": "a",
  "kana": "Which is KATAKANA mu, the counterpart of hiragana む?",
  "answer": "ム",
  "choices": [
   [
    "む",
    "む — hiragana mu"
   ],
   [
    "ム",
    "ム — katakana mu"
   ]
  ],
  "note": "む and ム encode the same sound mu, but belong to different scripts."
 },
 {
  "id": "script-me",
  "stage": "a",
  "kana": "Which is KATAKANA me, the counterpart of hiragana め?",
  "answer": "メ",
  "choices": [
   [
    "め",
    "め — hiragana me"
   ],
   [
    "メ",
    "メ — katakana me"
   ]
  ],
  "note": "め and メ encode the same sound me, in different scripts."
 },
 {
  "id": "hira-ma",
  "stage": "b",
  "kana": "Which HIRAGANA corresponds to katakana マ?",
  "answer": "ま",
  "choices": [
   [
    "ま",
    "ま — ma"
   ],
   [
    "み",
    "み — mi"
   ],
   [
    "む",
    "む — mu"
   ]
  ],
  "note": "マ and ま have the same sound (ma) in different writing systems."
 },
 {
  "id": "hira-mi",
  "stage": "b",
  "kana": "Which HIRAGANA corresponds to katakana ミ?",
  "answer": "み",
  "choices": [
   [
    "み",
    "み — mi"
   ],
   [
    "む",
    "む — mu"
   ],
   [
    "め",
    "め — me"
   ]
  ],
  "note": "ミ and み have the same sound (mi) in different writing systems."
 },
 {
  "id": "hira-mu",
  "stage": "b",
  "kana": "Which HIRAGANA corresponds to katakana ム?",
  "answer": "む",
  "choices": [
   [
    "む",
    "む — mu"
   ],
   [
    "め",
    "め — me"
   ],
   [
    "も",
    "も — mo"
   ]
  ],
  "note": "ム and む have the same sound (mu) in different writing systems."
 },
 {
  "id": "hira-me",
  "stage": "b",
  "kana": "Which HIRAGANA corresponds to katakana メ?",
  "answer": "め",
  "choices": [
   [
    "め",
    "め — me"
   ],
   [
    "も",
    "も — mo"
   ],
   [
    "ま",
    "ま — ma"
   ]
  ],
  "note": "メ and め have the same sound (me) in different writing systems."
 },
 {
  "id": "hira-mo",
  "stage": "b",
  "kana": "Which HIRAGANA corresponds to katakana モ?",
  "answer": "も",
  "choices": [
   [
    "も",
    "も — mo"
   ],
   [
    "ま",
    "ま — ma"
   ],
   [
    "み",
    "み — mi"
   ]
  ],
  "note": "モ and も have the same sound (mo) in different writing systems."
 },
 {
  "id": "memo",
  "stage": "b",
  "kana": "Which word means a written memo, not 'mama'?",
  "answer": "メモ",
  "choices": [
   [
    "ママ",
    "ママ — mom"
   ],
   [
    "メモ",
    "メモ — note / memo"
   ]
  ],
  "note": "メモ is a memo or note; ママ is mom. Every kana in both words has been taught."
 },
 {
  "id": "mask",
  "stage": "b",
  "kana": "Which word means a face mask, not a computer mouse?",
  "answer": "マスク",
  "choices": [
   [
    "マウス",
    "マウス — computer mouse"
   ],
   [
    "マスク",
    "マスク — face mask"
   ]
  ],
  "note": "マスク means a face mask; マウス means a computer mouse in the given context. Both are normal loanwords."
 },
 {
  "id": "peach",
  "stage": "b",
  "kana": "At a fruit shop, which word means peach rather than chicken breast meat?",
  "answer": "モモ",
  "choices": [
   [
    "ムネ",
    "ムネ — chicken breast"
   ],
   [
    "モモ",
    "モモ — peach"
   ]
  ],
  "note": "At a fruit shop モモ is peach (桃), while ムネ on poultry labels is breast meat. In poultry contexts モモ can mean thigh."
 },
 {
  "id": "bug",
  "stage": "b",
  "kana": "Which word means insect/bug, rather than bean?",
  "answer": "ムシ",
  "choices": [
   [
    "マメ",
    "マメ — bean"
   ],
   [
    "ムシ",
    "ムシ — insect"
   ]
  ],
  "note": "ムシ means insect (虫); マメ means bean (豆). Both are naturally attested words, fully decodable here."
 }
]);
export const CHECKPOINT_INDEX=15;
const intro=k=>({id:'intro-'+k.id,mode:'introduction',stage:k.stage,kana:k.kana,base:k.base,answer:k.reading,aliases:k.aliases||[],note:k.note});
const recognition=(k,group,index)=>({id:'recognition-'+k.id,mode:'recognition',stage:k.stage,kana:k.kana,answer:k.reading,aliases:[],choices:[...group.slice(index),...group.slice(0,index)].map(x=>({value:x.reading,label:x.reading})),note:'Choose the correct M-row sound in Hepburn romanization. All five M-row sounds map directly to matching hiragana ま・み・む・め・も.'});
const word=w=>({id:'word-'+w.id,mode:'word',stage:w.stage,kana:w.kana,answer:w.reading,aliases:w.aliases||[],meaning:w.meaning,kanji:w.kanji,note:w.note});
const contrast=c=>({id:'contrast-'+c.id,mode:'contrast',stage:c.stage,kana:c.kana,answer:c.answer,aliases:[],choices:c.choices.map(([value,label])=>({value,label})),note:c.note});
const phrase=p=>({id:'phrase-'+p.id,mode:'phrase',stage:p.stage,kana:p.kana,answer:p.reading,aliases:p.aliases||[],meaning:p.meaning,kanji:p.kanji,note:p.note});
function makeStage(stage){
 const group=KANA.filter(k=>k.stage===stage);
 return [...group.map(intro),...group.map((k,i)=>recognition(k,group,i)),...WORDS.filter(w=>w.stage===stage).map(word),...CONTRASTS.filter(c=>c.stage===stage).map(contrast)];
}
export const TASKS=Object.freeze([...makeStage('a'),...makeStage('b')]);
export const MODES=Object.freeze([
 {id:'introduction',label:'Active M-row recall',total:5},
 {id:'recognition',label:'M-row sound recognition',total:5},
 {id:'word',label:'Fully decodable authentic words',total:10},
 {id:'contrast',label:'Script and contextual vocabulary contrasts',total:11}
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
