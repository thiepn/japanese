// Unit 11 uses the established Kana Foundations visual language but does not
// rewrite the character-row UI, canonical progress, Account, or FSRS records.
import {STORAGE_KEY,TASKS,MODES,initialState,validState,taskAt,resume,pause,answer,reveal,advance,summary} from './reading-review-engine.mjs';

const root=document.getElementById('app');
let state=initialState(),lastRaw=null,writeAllowed=true,warning='',inputWarning='';
try{
 lastRaw=localStorage.getItem(STORAGE_KEY);
 if(lastRaw){
  const loaded=JSON.parse(lastRaw);
  if(!validState(loaded))throw Error('Unit 11 progress is invalid');
  state=loaded;
 }
}catch{
 writeAllowed=false;
 warning='Saved Unit 11 progress is invalid or unavailable. It will not be overwritten. Practice runs in memory; export it before leaving.';
}
const esc=x=>String(x??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
const button=(action,label,secondary=false)=>'<button type="button" data-action="'+action+'" class="'+(secondary?'secondary':'primary')+'">'+esc(label)+'</button>';
const link=(href,label)=>'<a class="secondary unit-link" href="'+href+'">'+esc(label)+'</a>';
function commit(next){
 if(next===state)return;
 if(writeAllowed){
  try{
   if(localStorage.getItem(STORAGE_KEY)!==lastRaw){
    writeAllowed=false;
    warning='Another tab changed Unit 11. Reload to see the latest progress; this tab will not overwrite it.';
    render();return;
   }
   const raw=JSON.stringify(next);
   localStorage.setItem(STORAGE_KEY,raw);
   lastRaw=raw;
  }catch{
   writeAllowed=false;
   warning='Browser storage failed. This session is in memory; export the results before leaving.';
  }
 }
 state=next;inputWarning='';render();
}
function frame(body,actions=''){
 const active=!state.paused&&!state.finished;
 const progress=Math.min(TASKS.length,state.index);
 root.innerHTML='<div class="shell"><header class="topbar"><div class="brand"><div class="brand-mark" lang="ja">あ</div><div>'
  +'<h2>Kana Foundations</h2><p class="eyebrow">UNIT 11 · READ & UNDERSTAND</p></div></div>'
  +(active?'<button class="top-exit" data-action="pause" aria-label="Exit lesson; progress is saved">Exit</button>':'')+'</header>'
  +(active?'<div class="progress-track" aria-hidden="true"><div class="progress-bar" style="width:'+Math.round(progress/TASKS.length*100)+'%"></div></div>'
   +'<div class="progress-caption"><span>'+(state.index>=TASKS.length?'Correction practice':'Reading and comprehension')+'</span><span>'+progress+' / '+TASKS.length+' first prompts</span></div>':'')
  +'<main id="main" tabindex="-1">'+(warning?'<div role="alert" class="warning">'+esc(warning)+'</div>':'')+body+'</main>'
  +'<footer class="action-area">'+actions+'</footer>'
  +'<p class="footer-note">Isolated prototype · No Account, FSRS or production progress changes</p></div>';
 const field=root.querySelector('#answer');
 if(field)field.focus({preventScroll:true});
 else root.querySelector('#main')?.focus({preventScroll:true});
}
function welcome(){
 frame('<p class="kicker">Unit 11 · Cumulative practice</p><h1>Hiragana in action</h1>'
  +'<p class="lead">You know the basic hiragana. Now read real words, use topic and object particles, sound out short sentences, and understand what they say.</p>'
  +'<div class="vowel-strip" lang="ja"><span>は</span><span>を</span><span>ん</span></div>'
  +'<div class="teaching-note"><span class="mini-label">は · topic</span>'
  +'After a topic, は is pronounced <strong>wa</strong>: ねこはねる (the cat sleeps). Inside はしる (to run), は is read <strong>ha</strong>.</div>'
  +'<div class="teaching-note"><span class="mini-label">を · object</span>'
  +'The direct-object marker を is pronounced <strong>o</strong>: ほんをよむ (read a book). Typed <strong>wo</strong> is also accepted for this particle in sentence readings.</div>'
  +'<div class="teaching-note"><span class="mini-label">ん · one timing beat</span>'
  +'The nasal ん counts as its own beat: ほん (book), みかん (mandarin). Its sound can shift depending on the following sound.</div>'
  +'<div class="teaching-note"><span class="mini-label">Your practice</span>'
  +'5 words · 4 particle choices · 4 sentence readings · 4 comprehension questions. Japanese normally has no spaces between words; romaji spaces in your typed answers are optional. Wrong or revealed first answers return for corrections without changing their original record.</div>'
  +'<p class="status">Only kana introduced in Units 01–10 appear in the Japanese exercises. Reading practice is not a certification of long-term mastery.</p>',
  button('start',state.index>0?'Resume Unit 11':'Start Unit 11')
  +link('./w-row.html','Back to Unit 10')+button('export','Export Unit 11 progress',true));
}
function completed(){
 const scores=summary(state);
 frame('<p class="kicker">Unit 11 · First-attempt evidence</p><h1>Reading review completed</h1>'
  +'<p class="lead">You practiced practical reading and comprehension, not just letter recall. A corrected answer does not erase a missed or revealed first attempt.</p>'
  +'<div class="metrics">'+MODES.map(m=>'<div class="metric"><strong>'+scores[m.id].independentCorrect+' / '+scores[m.id].total+'</strong><span>'+esc(m.label)+' · independent first answers</span></div>').join('')+'</div>'
  +'<div class="teaching-note"><span class="mini-label">Correction round</span>'+scores.corrected+' of '+scores.correctionCount+' correction answers were correct. Earlier evidence remains unchanged.'
  +'<p class="status">Read the sentences again after a delay to test retention.</p></div>',
  link('./w-row.html','Return to Unit 10')+button('export','Export Unit 11 progress',true));
}
function labelFor(task,value){
 const choice=task.choices?.find(c=>c.value===value);
 return choice?choice.label:value;
}
function practice(){
 const task=taskAt(state);
 if(!task){frame('<h1>Session unavailable</h1><p>Export your saved data for recovery.</p>',button('export','Export Unit 11 progress'));return;}
 const heading={word:'Read the word',particle:'Choose the particle',sentence:'Read the sentence',meaning:'Understand the sentence'}[task.mode];
 const count=MODES.find(m=>m.id===task.mode);
 const localIndex=TASKS.filter(t=>t.mode===task.mode).findIndex(t=>t.id===task.id);
 const title=task.correction?'Correction practice · first attempt retained':count.label+' · '+(localIndex+1)+' / '+count.total;
 const instruction={
  word:'Read every hiragana and type its romaji. The meaning appears after you answer.',
  particle:'Select the particle that fits the blank. は marks the topic (wa); を marks the object (o).',
  sentence:'Read the entire Japanese sentence aloud in your mind. Type its spoken romaji; spaces are optional.',
  meaning:'Choose the English meaning of this new sentence, paying attention to who acts and what receives the action.'
 }[task.mode];
 let interaction='';
 if(!state.feedback){
  if(task.choices){
   interaction='<div class="choices review-choices">'+task.choices.map(c=>'<button type="button" class="choice" data-action="choice" data-value="'+esc(c.value)+'" aria-label="'+esc((task.mode==='particle'?'Particle ':'Answer ')+c.label)+'">'+esc(c.label)+'</button>').join('')+'</div>';
  }else{
   interaction='<form id="answer-form"><label class="form-label" for="answer">Type the romaji reading</label>'
    +'<input id="answer" class="answer-input" type="text" inputmode="latin" autocapitalize="off" autocomplete="off" spellcheck="false" maxlength="60" required>'
    +'<button type="submit" class="primary">Check answer</button></form>';
  }
  interaction+='<div class="hint-actions"><button type="button" class="text-button" data-action="reveal">Show answer (no credit)</button></div>';
  if(inputWarning)interaction+='<p role="alert" class="warning">'+esc(inputWarning)+'</p>';
 }else{
  const f=state.feedback;
  interaction='<div class="feedback '+(f.correct===true?'good':f.correct===false?'bad':'neutral')+'" role="status" aria-live="polite" tabindex="-1">'
   +'<strong>'+(f.correct===true?'Correct.':f.correct===false?'Not quite.':'Answer revealed — no independent credit.')+'</strong>'
   +'Correct answer: '+esc(labelFor(task,f.answer))
   +(f.correct===false?'<small>Your answer: '+esc(labelFor(task,f.submitted))+'. Compare the roles and readings.</small>':'')
   +(task.meaning?'<small>Meaning: '+esc(task.meaning)+'</small>':'')
   +(task.kanji?'<small>Common writing: '+esc(task.kanji)+'</small>':'')
   +(task.note?'<small>'+esc(task.note)+'</small>':'')
   +(task.correction?'<small>This practice does not replace the original first answer.</small>':'')+'</div>';
 }
 const last=state.index===TASKS.length-1&&state.corrections.length===0;
 frame('<section class="practice-screen"><p class="kicker">'+esc(title)+'</p><h1>'+esc(heading)+'</h1>'
  +'<p class="lead">'+esc(instruction)+'</p><div class="glyph-panel review-glyph"><span class="japanese-word" lang="ja">'+esc(task.kana)+'</span></div>'
  +interaction+'</section>',state.feedback?button('next',last?'See results':'Continue'):'');
 if(state.feedback)root.querySelector('[role="status"].feedback')?.focus({preventScroll:true});
}
function render(){if(state.finished)completed();else if(state.paused)welcome();else practice();}
function download(){
 const blob=new Blob([JSON.stringify({prototype:true,unit:'reading-review',exportedAt:new Date().toISOString(),state},null,2)],{type:'application/json'});
 const url=URL.createObjectURL(blob),node=document.createElement('a');
 node.href=url;node.download='kana-foundations-unit11.json';
 document.body.append(node);node.click();node.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
root.addEventListener('click',e=>{
 const el=e.target.closest('button[data-action]');
 if(!el||el.disabled)return;
 switch(el.dataset.action){
  case 'start':commit(resume(state));break;
  case 'pause':commit(pause(state));break;
  case 'choice':commit(answer(state,el.dataset.value));break;
  case 'reveal':commit(reveal(state));break;
  case 'next':commit(advance(state));break;
  case 'export':download();break;
 }
});
root.addEventListener('submit',e=>{
 if(e.target.id!=='answer-form')return;
 e.preventDefault();
 const next=answer(state,e.target.querySelector('input').value);
 if(next===state){inputWarning='Enter the reading using romaji letters.';render();}
 else commit(next);
});
render();
