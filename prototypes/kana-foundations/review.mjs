import {UNITS} from './course-map-model.mjs';
import {reviewFromSnapshot} from './review-model.mjs';
import {createReviewRound,rateReviewPrompt,moveReviewPrompt,finishReviewRound,
 reviewRoundSummary,retryReviewRound} from './review-session-model.mjs';
const root=document.getElementById('app');
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;')
 .replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
async function load(unit){
 try{
  const engine=await import(unit.engine);
  const key=unit.id===1?engine.PROTOTYPE_STORAGE_KEY:engine.STORAGE_KEY;
  if(typeof key!=='string'||!key.startsWith('thiepn:kana-foundations:'))
   return {items:[],unavailable:true};
  return reviewFromSnapshot(unit,engine,localStorage.getItem(key));
 }catch{return {items:[],unavailable:true};}
}
const loaded=await Promise.all(UNITS.map(load));
const items=loaded.flatMap(x=>x.items);
const unavailable=loaded.filter(x=>x.unavailable).length;
let selected='all',show=false;
// Typed practice answers are kept in memory, never in the lesson records.
// Each card freezes its first input when its answer is revealed.
const drafts=new Map(),attempts=new Map();
function clearTypedAnswers(){drafts.clear();attempts.clear();}
const scope=()=>items.map((item,id)=>({item,id})).filter(({item})=>
 selected==='all'||String(item.unitId)===selected).map(({id})=>id);
let round=createReviewRound(scope());
const button=(action,label,disabled=false)=>
 '<button type="button" data-action="'+action+'"'+(disabled?' disabled':'')+'>'+label+'</button>';
function render(focus=''){
 const available=UNITS.filter(u=>items.some(x=>x.unitId===u.id));
 const options=available.map(u=>'<option value="'+u.id+'"'+(selected===String(u.id)?' selected':'')
  +'>Unit '+String(u.id).padStart(2,'0')+' · '+esc(u.title)+'</option>').join('');
 const item=items[round.ids[round.position]];
 const results=reviewRoundSummary(round);
 let content='';
 if(items.length){
  content='<div class="review-toolbar"><label for="review-unit">Review unit'
   +'<select id="review-unit"><option value="all">All units with difficult prompts</option>'
   +options+'</select></label><span class="review-count" id="review-count" role="status" aria-live="polite">'
   +(round.finished?'Round '+round.number+' complete':(round.position+1)+' / '+round.ids.length+' prompts · Round '+round.number)
   +'</span></div>';
  if(round.finished){
   content+='<section class="review-summary" aria-label="Self-check summary">'
    +'<h2>Round '+round.number+' summary</h2>'
    +'<dl><div><dt>Remembered</dt><dd>'+results.remembered+'</dd></div>'
    +'<div><dt>Review again</dt><dd>'+results.again+'</dd></div>'
    +'<div><dt>Skipped</dt><dd>'+results.unrated+'</dd></div></dl>'
    +'<p>Self-reported in this page only. Lesson scores and saved progress are unchanged.</p>'
    +'<div class="review-actions">'
    +(results.again+results.unrated?button('retry','Retry missed or skipped'):'')
    +button('restart','Review all again')+'</div></section>';
  }else if(item){
   const id=round.ids[round.position];
   const rating=round.ratings[id];
   const locked=attempts.has(id),draft=drafts.get(id)||'';
   const response=locked?attempts.get(id):'';
   const responseField='<div class="review-response"><label for="review-input">Your answer (optional)</label>'
    +'<input type="text" id="review-input" name="review-input" maxlength="180"'
    +' spellcheck="false" autocomplete="off" autocapitalize="off" inputmode="text"'
    +' placeholder="Kana, romaji, or text" value="'+esc(draft)+'"'
    +(locked?' disabled':'')+'>'
    +(locked?'<p>Answer already revealed for this card. Retry to enter a new response.</p>':'')
    +'</div>';
   const responseDisplay=locked&&response?'<div class="review-your-response" id="review-your-response">'
    +'<span>Your response</span><strong>'+esc(response)+'</strong></div>':'';
   const alternatives=Array.isArray(item.alternatives)?item.alternatives:[];
   content+='<article class="review-card"><p class="context">Unit '+String(item.unitId).padStart(2,'0')
    +' · '+esc(item.unitTitle)+'</p><p class="reason">'+esc(item.reason)+'</p>'
    +'<h2>'+esc(item.prompt)+'</h2>'
    +(show?responseDisplay+'<div class="review-answer" id="review-answer">'
       +'<span>Lesson answer</span><strong>'+esc(item.answer)+'</strong>'
       +(alternatives.length?'<p>Other lesson-accepted spellings: '
         +alternatives.map(esc).join(' · ')+'</p>':'')
       +(item.meaning?'<p>Meaning: '+esc(item.meaning)+'</p>':'')
       +(item.note?'<p>'+esc(item.note)+'</p>':'')
       +'<p class="review-comparison-note">Compare your response yourself. Other scripts or spellings may also be valid; no automatic score is assigned.</p>'
       +'</div>':responseField)
    +(rating?'<p class="review-previous-rating">Marked: '
      +(rating==='remembered'?'Remembered':'Review again')+'</p>':'')
    +'</article><div class="review-actions">'
    +button('previous','Previous',round.position===0)
    +button('toggle',show?'Hide answer':'Reveal answer')
    +button('next','Next',round.position+1===round.ids.length)
    +'</div>'
    +(show?'<section class="review-rating" aria-label="Rate your recall">'
       +'<p>Before seeing the answer, did you remember it correctly?</p>'
       +'<div class="review-actions">'+button('remembered','I remembered')
       +button('again','Review again')+'</div></section>':'')
    +(round.position+1===round.ids.length?'<div class="review-finish">'
       +button('finish','Finish round')+'</div>':'')
    +'<a class="review-lesson" href="'+item.href+'">Open Unit '
    +String(item.unitId).padStart(2,'0')+'</a>';
  }
 }else{
  content='<p class="review-empty">No first-attempt difficulties are saved in this browser.</p>';
 }
 root.innerHTML='<div class="course-shell"><header class="course-header">'
  +'<div class="brand"><div class="brand-mark" lang="ja">あ</div><div><h2>Kana Foundations</h2></div></div>'
  +'<a href="./course-map.html" class="course-back">All units</a></header>'
  +'<main id="main" class="course-main"><h1>Review first attempts</h1>'
  +'<p class="review-intro">Try recalling the answer or type a response before revealing it. Compare your response with the lesson answer and rate your own recall. Your typed responses and ratings stay on this page only; lesson evidence and scores are unchanged. Corrections, practice-only rounds and unverified listening prompts are excluded.</p>'
  +(unavailable?'<p class="review-warning" role="alert">'+unavailable+' saved '
    +(unavailable===1?'unit is':'units are')+' unavailable or invalid. Records were not changed.</p>':'')
  +content+'</main></div>';
 if(focus)root.querySelector(focus)?.focus();
}
root.addEventListener('input',event=>{
 if(event.target.id==='review-input'&&!show&&!round.finished){
  const id=round.ids[round.position];
  if(!attempts.has(id))drafts.set(id,event.target.value);
 }
});
root.addEventListener('change',event=>{
 if(event.target.id==='review-unit'){
  selected=event.target.value;round=createReviewRound(scope());show=false;clearTypedAnswers();render('#review-unit');
 }
});
root.addEventListener('click',event=>{
 const act=event.target.closest('button[data-action]')?.dataset.action;
 if(!act)return;
 if(act==='previous'||act==='next'){
  round=moveReviewPrompt(round,act==='previous'?-1:1);show=false;
 }else if(act==='toggle'){
  if(!show){
   const id=round.ids[round.position];
   if(!attempts.has(id))attempts.set(id,drafts.get(id)||'');
  }
  show=!show;
 }else if(act==='remembered'||act==='again'){
  if(!show)return;
  round=rateReviewPrompt(round,act);show=false;
 }else if(act==='finish'){
  round=finishReviewRound(round);show=false;
 }else if(act==='retry'){
  const newRound=retryReviewRound(round);
  if(newRound){round=newRound;clearTypedAnswers();}
  show=false;
 }else if(act==='restart'){
  round=createReviewRound(scope());clearTypedAnswers();show=false;
 }
 const focus=(act==='toggle')?'[data-action="toggle"]':
  round.finished?'[data-action="restart"]':'[data-action="toggle"]';
 render(focus);
});
render();
