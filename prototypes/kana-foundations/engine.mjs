// Kana Foundations v1: deterministic, standalone lesson engine.
// No imports from Account, Japanese IndexedDB, StudyEvents or FSRS.
// Every record here is prototype-only pedagogical evidence.
export const VOWELS=Object.freeze([
  {id:'h-a',kana:'あ',reading:'a',strokes:3,tip:'Open a, approximately the vowel in father. Keep it short.'},
  {id:'h-i',kana:'い',reading:'i',strokes:2,tip:'A short i, similar to the vowel in see without lengthening it.'},
  {id:'h-u',kana:'う',reading:'u',strokes:2,tip:'Japanese u has much less lip rounding than English oo.'},
  {id:'h-e',kana:'え',reading:'e',strokes:2,tip:'A pure e, similar to the vowel in get.'},
  {id:'h-o',kana:'お',reading:'o',strokes:3,tip:'A pure o without the ending glide of English oh.'}
]);
export const WORDS=Object.freeze([
  {id:'ie',kana:'いえ',reading:'ie',meaning:'house',common:'家',ids:['h-i','h-e']},
  {id:'ao',kana:'あお',reading:'ao',meaning:'blue',common:'青',ids:['h-a','h-o']},
  {id:'ue',kana:'うえ',reading:'ue',meaning:'above / on top',common:'上',ids:['h-u','h-e']}
]);
export const STAGES=Object.freeze([
  {id:'introduce-first',mode:'teach',items:['h-a','h-i'],title:'Meet the first vowels'},
  {id:'recognize-first',mode:'recognition',items:['h-a','h-i'],title:'Recognize two sounds'},
  {id:'introduce-rest',mode:'teach',items:['h-u','h-e','h-o'],title:'Meet three more vowels'},
  {id:'recognize-all',mode:'recognition',items:['h-a','h-i','h-u','h-e','h-o'],title:'Recognize all five'},
  {id:'recall',mode:'recall',items:['h-u','h-e','h-a','h-o','h-i'],title:'Recall without choices'},
  {id:'listening',mode:'listening',items:['h-e','h-a','h-o','h-i','h-u'],title:'Listen and identify'},
  {id:'reading',mode:'reading',items:['ie','ao','ue'],title:'Read real words'},
  {id:'results',mode:'results',items:[],title:'Your learning results'}
]);
const LOOKUP=Object.fromEntries(VOWELS.map(v=>[v.id,v]));
const WORD_LOOKUP=Object.fromEntries(WORDS.map(v=>[v.id,v]));
export const PROTOTYPE_STORAGE_KEY='thiepn:kana-foundations:prototype-only:v1';
export const PROTOTYPE_SCHEMA=1;
export function initialState(){
  return {schema:PROTOTYPE_SCHEMA,phase:0,cursor:0,retryMode:false,retryItems:[],
    feedback:null,hint:false,audioPlayed:false,paused:true,practiceOnly:false,
    introduced:[],records:[],savedAt:null};
}
export function validState(s){
  return Boolean(s&&typeof s==='object'&&s.schema===PROTOTYPE_SCHEMA
    &&Number.isInteger(s.phase)&&s.phase>=0&&s.phase<STAGES.length
    &&Number.isInteger(s.cursor)&&s.cursor>=0&&s.cursor<=5
    &&typeof s.paused==='boolean'&&typeof s.practiceOnly==='boolean'
    &&typeof s.hint==='boolean'&&typeof s.audioPlayed==='boolean'
    &&typeof s.retryMode==='boolean'&&Array.isArray(s.introduced)
    &&s.introduced.every(id=>Boolean(LOOKUP[id]))
    &&Array.isArray(s.retryItems)&&s.retryItems.every(id=>typeof id==='string')
    &&Array.isArray(s.records)&&s.records.length<=1000);
}
export function currentStage(s){return STAGES[s.phase];}
export function currentItems(s){return s.retryMode?s.retryItems:currentStage(s).items;}
export function currentItem(s){return currentItems(s)[s.cursor]??null;}
export function vowel(id){return LOOKUP[id]||null;}
export function word(id){return WORD_LOOKUP[id]||null;}
export function normalizeReading(value){
  return String(value??'').normalize('NFKC').toLowerCase().replace(/[\s\u3000-]+/g,'').trim();
}
export function start(s){
  if(!validState(s))throw Error('INVALID_PROTOTYPE_STATE');
  return {...s,paused:false};
}
export function pause(s){return {...s,paused:true};}
export function setHint(s){
  if(s.feedback||s.paused||!['recognition','recall','reading'].includes(currentStage(s).mode))return s;
  return {...s,hint:true};
}
export function markAudioPlayed(s){
  if(s.paused||s.feedback||currentStage(s).mode!=='listening')return s;
  return {...s,audioPlayed:true};
}
function record(s,result,submitted,now){
  const item=currentItem(s),stage=currentStage(s);
  const entry={stage:stage.id,mode:stage.mode,item,correct:result,
    assisted:s.hint,correction:s.retryMode,practiceOnly:s.practiceOnly,
    submitted:submitted===null?null:normalizeReading(submitted),
    at:new Date(now).toISOString()};
  return {...s,records:[...s.records,entry]};
}
export function submit(s,submitted,now=Date.now()){
  if(!validState(s)||s.paused||s.feedback)return s;
  const stage=currentStage(s);
  if(!['recognition','recall','listening','reading'].includes(stage.mode))return s;
  if(stage.mode==='listening'&&!s.audioPlayed)return s;
  const value=normalizeReading(submitted);
  if(!value)return s;
  const item=currentItem(s);
  const expected=stage.mode==='reading'?word(item)?.reading
    :stage.mode==='listening'?vowel(item)?.id:vowel(item)?.reading;
  const correct=value===normalizeReading(expected);
  const result=record(s,correct,submitted,now);
  const retryItems=(!correct&&!s.retryMode&&!s.retryItems.includes(item))
    ?[...s.retryItems,item]:s.retryItems;
  return {...result,retryItems,feedback:{correct,expected:String(expected||''),submitted:value}};
}
export function skipListening(s,now=Date.now()){
  if(!validState(s)||s.paused||s.feedback||currentStage(s).mode!=='listening')return s;
  const next=record(s,null,null,now);
  return {...next,feedback:{correct:null,expected:'',submitted:''}};
}
export function advance(s,now=Date.now()){
  if(!validState(s)||s.paused)return s;
  const stage=currentStage(s);
  if(stage.mode==='results')return s;
  if(stage.mode!=='teach'&&!s.feedback)return s;
  let next=s;
  if(stage.mode==='teach'){
    const item=currentItem(s);
    const introduced=s.introduced.includes(item)?s.introduced:[...s.introduced,item];
    next={...s,introduced,records:[...s.records,
      {stage:stage.id,mode:'introduction',item,correct:null,assisted:false,
       correction:false,practiceOnly:s.practiceOnly,submitted:null,at:new Date(now).toISOString()}]};
  }
  const items=currentItems(next);
  if(next.cursor+1<items.length){
    return {...next,cursor:next.cursor+1,feedback:null,hint:false,audioPlayed:false};
  }
  if(stage.mode!=='teach'&&!next.retryMode&&next.retryItems.length>0){
    return {...next,retryMode:true,cursor:0,feedback:null,hint:false,audioPlayed:false};
  }
  return {...next,phase:Math.min(STAGES.length-1,s.phase+1),cursor:0,
    retryMode:false,retryItems:[],feedback:null,hint:false,audioPlayed:false};
}
export function practiceAgain(s){
  if(!validState(s)||currentStage(s).mode!=='results')return s;
  // Practice-only replay; original independent evidence is retained, not overwritten.
  return {...s,phase:3,cursor:0,paused:false,practiceOnly:true,retryMode:false,
    retryItems:[],feedback:null,hint:false,audioPlayed:false};
}
export function progress(s){
  const stage=currentStage(s),before=STAGES.slice(0,s.phase)
    .reduce((sum,x)=>sum+x.items.length,0);
  const total=STAGES.reduce((sum,x)=>sum+x.items.length,0);
  return {done:Math.min(total,before+s.cursor),total,percent:Math.floor(100*Math.min(total,before+s.cursor)/total),
    label:stage.title};
}
export function firstAttemptSummary(s){
  const scored=s.records.filter(r=>r.mode!=='introduction'&&!r.correction&&!r.practiceOnly);
  const count=(mode)=>{const v=scored.filter(r=>r.mode===mode);return {
    correct:v.filter(r=>r.correct===true&&!r.assisted).length,total:v.length,
    skipped:v.filter(r=>r.correct===null).length,assisted:v.filter(r=>r.assisted).length
  };};
  const recognition=scored.filter(r=>r.stage==='recognize-all');
  return {introduced:s.introduced.length,recognition:{
    correct:recognition.filter(r=>r.correct===true&&!r.assisted).length,
    total:recognition.length},recall:count('recall'),
    listening:count('listening'),reading:count('reading')};
}
export function readingChoices(id,all=VOWELS){
  const chosen=vowel(id);
  return chosen?all.filter(v=>v.id!==id).slice(0,3).concat(chosen)
    .sort((a,b)=>a.id.localeCompare(b.id)):[]; // deterministic, no hidden randomness
}
export function allowedChoices(s){
  const item=currentItem(s),stage=currentStage(s);
  let choices=[];
  if(stage.mode==='recognition')choices=(s.phase===1?VOWELS.slice(0,2):VOWELS).map(v=>v.reading);
  else if(stage.mode==='listening')choices=VOWELS.map(v=>v.id);
  if(!choices.length)return [];
  // Stable per-question shuffle to avoid memorizing answer positions. The same
  // session state produces the same options after rerender or browser refresh.
  const key=stage.id+'|'+item+'|'+(s.retryMode?'correction':'first');
  let seed=2166136261;
  for(let i=0;i<key.length;i++)seed=Math.imul(seed^key.charCodeAt(i),16777619)>>>0;
  for(let i=choices.length-1;i>0;i--){
    seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;
    const j=(seed>>>0)%(i+1);
    [choices[i],choices[j]]=[choices[j],choices[i]];
  }
  // Balance correct-button positions across the five first-pass questions;
  // a learner must read the glyph rather than exploit a fixed response slot.
  const target=stage.mode==='recognition'?vowel(item)?.reading:item;
  const from=choices.indexOf(target);
  if(from>=0){
    const slot=(s.cursor*3+s.phase+(s.retryMode?1:0))%choices.length;
    choices.splice(from,1);
    choices.splice(slot,0,target);
  }
  return choices;
}
