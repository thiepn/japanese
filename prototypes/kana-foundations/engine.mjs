// Kana Foundations v1: deterministic five-vowel instruction, isolated from
// Account, Japanese IndexedDB, canonical StudyEvents and FSRS.
// Schema 1 records are preserved verbatim when old prototype state is resumed.
export const VOWELS=Object.freeze([
 {id:'h-a',kana:'あ',reading:'a',strokes:3,tip:'An open, short Japanese vowel. Keep it steady.',cue:'Recall the open vowel sound from the introduction.'},
 {id:'h-i',kana:'い',reading:'i',strokes:2,tip:'A short, high front vowel without a long ending.',cue:'Recall the high front vowel with relaxed lips.'},
 {id:'h-u',kana:'う',reading:'u',strokes:2,tip:'Japanese u has less lip rounding than English oo.',cue:'Remember the sound made with less lip rounding.'},
 {id:'h-e',kana:'え',reading:'e',strokes:2,tip:'A clear mid front vowel without an ending glide.',cue:'Recall the short mid front vowel.'},
 {id:'h-o',kana:'お',reading:'o',strokes:3,tip:'A clear mid back vowel without the glide in English oh.',cue:'Recall the rounded vowel without an English ending glide.'}
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
  nextRetryItems:[],retryRounds:0,targeted:false,introStep:'explain',
  feedback:null,hint:false,hintLevel:0,audioPlayed:false,paused:true,practiceOnly:false,
  introduced:[],records:[],savedAt:null};
}
export function validState(s){
 return Boolean(s&&typeof s==='object'&&s.schema===PROTOTYPE_SCHEMA
  &&Number.isInteger(s.phase)&&s.phase>=0&&s.phase<STAGES.length
  &&Number.isInteger(s.cursor)&&s.cursor>=0&&s.cursor<=5
  &&typeof s.paused==='boolean'&&typeof s.practiceOnly==='boolean'
  &&typeof s.hint==='boolean'&&typeof s.audioPlayed==='boolean'
  &&typeof s.retryMode==='boolean'
  &&(!('hintLevel' in s)||(Number.isInteger(s.hintLevel)&&s.hintLevel>=0&&s.hintLevel<=2))
  &&(!('introStep' in s)||['explain','check'].includes(s.introStep))
  &&(!('retryRounds' in s)||(Number.isInteger(s.retryRounds)&&s.retryRounds>=0&&s.retryRounds<=2))
  &&Array.isArray(s.introduced)&&s.introduced.every(id=>Boolean(LOOKUP[id]))
  &&Array.isArray(s.retryItems)&&s.retryItems.every(id=>typeof id==='string')
  &&(!('nextRetryItems' in s)||Array.isArray(s.nextRetryItems))
  &&Array.isArray(s.records)&&s.records.length<=1000);
}
const hydrate=s=>({...initialState(),...s,records:s.records,introduced:s.introduced,retryItems:s.retryItems});
export const currentStage=s=>STAGES[s.phase];
export const currentItems=s=>s.retryMode?s.retryItems:currentStage(s).items;
export const currentItem=s=>currentItems(s)[s.cursor]??null;
export const vowel=id=>LOOKUP[id]||null;
export const word=id=>WORD_LOOKUP[id]||null;
export function normalizeReading(value){
 return String(value??'').normalize('NFKC').toLowerCase().replace(/[\s\u3000-]+/g,'').trim();
}
export function start(s){
 if(!validState(s))throw Error('INVALID_PROTOTYPE_STATE');
 return {...hydrate(s),paused:false};
}
export function pause(s){return {...hydrate(s),paused:true};}
export function beginIntroCheck(s){
 if(!validState(s)||s.paused||currentStage(s).mode!=='teach'||s.feedback)return s;
 return {...hydrate(s),introStep:'check',hint:false,hintLevel:0};
}
export function setHint(s){
 if(!validState(s)||s.feedback||s.paused)return s;
 const mode=currentStage(s).mode;
 if(!['teach','recognition','recall','reading'].includes(mode))return s;
 if(mode==='teach'&&(s.introStep||'explain')!=='check')return s;
 return {...hydrate(s),hint:true,hintLevel:Math.min(2,(s.hintLevel||0)+1)};
}
export function markAudioPlayed(s){
 if(s.paused||s.feedback||currentStage(s).mode!=='listening')return s;
 return {...hydrate(s),audioPlayed:true};
}
function withRecord(s,correct,submitted,now,{reason=null,revealed=false}={}){
 const stage=currentStage(s),item=currentItem(s);
 const mode=stage.mode==='teach'?'intro-check':stage.mode;
 const entry={stage:stage.id,mode,item,correct,assisted:Boolean(s.hint||s.hintLevel),
  correction:Boolean(s.retryMode),practiceOnly:Boolean(s.practiceOnly),submitted:submitted===null?null:normalizeReading(submitted),
  at:new Date(now).toISOString(),reason,revealed};
 return {...s,records:[...s.records,entry]};
}
export function submit(s,submitted,now=Date.now()){
 if(!validState(s)||s.paused||s.feedback)return s;
 const stage=currentStage(s);
 if(stage.mode==='teach'&&(s.introStep||'explain')!=='check')return s;
 if(!['teach','recognition','recall','listening','reading'].includes(stage.mode))return s;
 if(stage.mode==='listening'&&!s.audioPlayed)return s;
 const value=normalizeReading(submitted);
 if(!value)return s;
 const item=currentItem(s);
 const expected=stage.mode==='reading'?word(item)?.reading:
  stage.mode==='listening'?vowel(item)?.id:vowel(item)?.reading;
 const correct=value===normalizeReading(expected);
 const next=withRecord(hydrate(s),correct,submitted,now);
 const retryItems=(!correct&&stage.mode!=='teach'&&!s.retryMode&&!s.retryItems.includes(item))
  ?[...s.retryItems,item]:s.retryItems;
 const nextRetryItems=(!correct&&s.retryMode&&!(s.nextRetryItems||[]).includes(item))
  ?[...(s.nextRetryItems||[]),item]:(s.nextRetryItems||[]);
 return {...next,retryItems,nextRetryItems,feedback:{correct,expected:String(expected||''),
  submitted:value,revealed:false}};
}
export function revealAnswer(s,now=Date.now()){
 if(!validState(s)||s.paused||s.feedback)return s;
 const stage=currentStage(s);
 if(stage.mode==='teach'&&(s.introStep||'explain')!=='check')return s;
 if(!['teach','recognition','recall','reading'].includes(stage.mode))return s;
 const item=currentItem(s),expected=stage.mode==='reading'?word(item)?.reading:vowel(item)?.reading;
 const next=withRecord({...hydrate(s),hint:true,hintLevel:2},null,null,now,{reason:'revealed',revealed:true});
 const retryItems=stage.mode!=='teach'&&!s.retryMode&&!s.retryItems.includes(item)?[...s.retryItems,item]:s.retryItems;
 const nextRetryItems=s.retryMode?[...(s.nextRetryItems||[]),item]:(s.nextRetryItems||[]);
 return {...next,retryItems,nextRetryItems,
  feedback:{correct:null,expected:String(expected||''),submitted:'',revealed:true}};
}
export function skipListening(s,now=Date.now()){
 if(!validState(s)||s.paused||s.feedback||currentStage(s).mode!=='listening')return s;
 const next=withRecord(hydrate(s),null,null,now,{reason:'audio-skipped'});
 return {...next,feedback:{correct:null,expected:'',submitted:'',revealed:false}};
}
export function skipListeningStage(s,now=Date.now()){
 if(!validState(s)||s.paused||currentStage(s).mode!=='listening')return s;
 const items=currentItems(s);
 let next=hydrate(s);
 const startIndex=s.feedback?s.cursor+1:s.cursor;
 for(let i=startIndex;i<items.length;i++){
  const entry={stage:currentStage(s).id,mode:'listening',item:items[i],correct:null,
   assisted:false,correction:Boolean(s.retryMode),practiceOnly:Boolean(s.practiceOnly),
   submitted:null,at:new Date(now).toISOString(),reason:'audio-unavailable'};
  next={...next,records:[...next.records,entry]};
 }
 return {...next,phase:6,cursor:0,retryMode:false,retryItems:[],nextRetryItems:[],
  feedback:null,hint:false,hintLevel:0,audioPlayed:false,retryRounds:0};
}
function clearPrompt(s){return {...s,feedback:null,hint:false,hintLevel:0,audioPlayed:false,introStep:'explain'};}
export function advance(s,now=Date.now()){
 if(!validState(s)||s.paused)return s;
 const stage=currentStage(s);
 if(stage.mode==='results')return s;
 // The learner cannot skip active teaching. An attempt (even an unsuccessful
 // one) is necessary before an introduction is recorded.
 if(!s.feedback)return s;
 let next=hydrate(s);
 if(stage.mode==='teach'){
  const item=currentItem(s);
  const introduced=s.introduced.includes(item)?s.introduced:[...s.introduced,item];
  next={...next,introduced,records:[...next.records,
   {stage:stage.id,mode:'introduction',item,correct:null,assisted:false,
    correction:false,practiceOnly:Boolean(s.practiceOnly),submitted:null,at:new Date(now).toISOString()}]};
 }
 const items=currentItems(next);
 if(next.cursor+1<items.length)return clearPrompt({...next,cursor:next.cursor+1});
 if(stage.mode!=='teach'&&!next.retryMode&&next.retryItems.length){
  return clearPrompt({...next,retryMode:true,cursor:0,nextRetryItems:[],retryRounds:0});
 }
 // One additional correction round is allowed, then outstanding weaknesses
 // remain visible and actionable rather than forcing an endless quiz.
 if(next.retryMode&&(next.nextRetryItems||[]).length&&next.retryRounds<1){
  return clearPrompt({...next,cursor:0,retryItems:next.nextRetryItems,
   nextRetryItems:[],retryRounds:next.retryRounds+1});
 }
 if(next.targeted){
  return clearPrompt({...next,phase:7,cursor:0,retryMode:false,retryItems:[],
   nextRetryItems:[],retryRounds:0,targeted:false});
 }
 return clearPrompt({...next,phase:Math.min(STAGES.length-1,s.phase+1),
  cursor:0,retryMode:false,retryItems:[],nextRetryItems:[],retryRounds:0});
}
export function practiceAgain(s){
 if(!validState(s)||currentStage(s).mode!=='results')return s;
 return clearPrompt({...hydrate(s),phase:3,cursor:0,paused:false,practiceOnly:true,
  targeted:false,retryMode:false,retryItems:[],nextRetryItems:[],retryRounds:0});
}
export function needsPractice(s){
 // Treat reading mistakes separately, without falsely attributing a failed
 // multi-character word to either vowel. Correction/practice-only answers never
 // erase original weak evidence, though later independent full-stage answers can.
 const unresolved=new Map();
 for(const r of s.records){
  const item=LOOKUP[r.item]?r.item:null;
  if(!item||r.mode==='introduction'||r.mode==='listening'||r.correct===null)continue;
  if(r.correct===false||r.assisted){
   unresolved.set(item,true);
  }else if(r.correct===true&&!r.assisted&&!r.correction&&!r.practiceOnly){
   unresolved.delete(item);
  }
 }
 return VOWELS.filter(v=>unresolved.has(v.id)).map(v=>v.id);
}
export function needsWordPractice(s){
 const weak=new Set();
 for(const r of s.records){
  if(!WORD_LOOKUP[r.item]||r.mode!=='reading')continue;
  if(r.correct===false||r.assisted)weak.add(r.item);
  if(r.correct===true&&!r.assisted&&!r.correction&&!r.practiceOnly)weak.delete(r.item);
 }
 return WORDS.filter(w=>weak.has(w.id)).map(w=>w.id);
}
export function practiceWeakItems(s){
 if(!validState(s)||currentStage(s).mode!=='results')return s;
 const ids=needsPractice(s);
 if(!ids.length)return s;
 return clearPrompt({...hydrate(s),phase:4,cursor:0,paused:false,
  practiceOnly:true,targeted:true,retryMode:true,retryItems:ids,
  nextRetryItems:[],retryRounds:0});
}
export function progress(s){
 const stage=currentStage(s),before=STAGES.slice(0,s.phase).reduce((n,x)=>n+x.items.length,0);
 const total=STAGES.reduce((n,x)=>n+x.items.length,0);
 const done=Math.min(total,before+s.cursor);
 return {done,total,percent:Math.floor(100*done/total),label:stage.title};
}
export function firstAttemptSummary(s){
 const scored=s.records.filter(r=>r.mode!=='introduction'&&r.mode!=='intro-check'&&!r.correction&&!r.practiceOnly);
 const count=mode=>{
  const v=scored.filter(r=>r.mode===mode);
  return {correct:v.filter(r=>r.correct===true&&!r.assisted).length,total:v.length,
   skipped:v.filter(r=>r.correct===null).length,assisted:v.filter(r=>r.assisted).length};
 };
 const recognition=scored.filter(r=>r.stage==='recognize-all');
 const introducedCheck=s.records.filter(r=>r.mode==='intro-check'&&!r.practiceOnly);
 return {introduced:s.introduced.length,recognition:{
  correct:recognition.filter(r=>r.correct===true&&!r.assisted).length,total:recognition.length},
  recall:count('recall'),listening:count('listening'),reading:count('reading'),
  introChecks:{correct:introducedCheck.filter(r=>r.correct===true&&!r.assisted).length,
    total:introducedCheck.length},
  needsPractice:needsPractice(s),needsWordPractice:needsWordPractice(s)};
}
export function allowedChoices(s){
 const item=currentItem(s),stage=currentStage(s);
 let choices=[];
 if(stage.mode==='recognition')choices=(s.phase===1?VOWELS.slice(0,2):VOWELS).map(v=>v.reading);
 else if(stage.mode==='listening')choices=VOWELS.map(v=>v.id);
 else if(['teach','recall','reading'].includes(stage.mode)&&s.hintLevel>=2){
  if(stage.mode==='reading')choices=WORDS.map(w=>w.reading);
  else if(stage.mode==='teach'){
   const introducedCount=stage.id==='introduce-first'?s.cursor+1:3+s.cursor;
   choices=VOWELS.slice(0,introducedCount).map(v=>v.reading);
  }else choices=VOWELS.map(v=>v.reading);
 }
 if(!choices.length)return [];
 const key=stage.id+'|'+item+'|'+(s.retryMode?'correction':'first');
 let seed=2166136261;
 for(let i=0;i<key.length;i++)seed=Math.imul(seed^key.charCodeAt(i),16777619)>>>0;
 for(let i=choices.length-1;i>0;i--){
  seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;
  const j=(seed>>>0)%(i+1);[choices[i],choices[j]]=[choices[j],choices[i]];
 }
 const target=stage.mode==='listening'?item:stage.mode==='reading'?word(item)?.reading:vowel(item)?.reading;
 const from=choices.indexOf(target);
 if(from>=0){
  const slot=(s.cursor*3+s.phase+(s.retryMode?1:0))%choices.length;
  choices.splice(from,1);choices.splice(slot,0,target);
 }
 return choices;
}
