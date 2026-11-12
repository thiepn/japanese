// Unit 15 standalone prototype; built on the existing Kana Foundations UI conventions.
import {STORAGE_KEY,TASKS,MODES,CHECKPOINT_INDEX,initialState,validState,taskAt,atCheckpoint,resume,pause,acknowledgeCheckpoint,answer,reveal,advance,summary} from './sokuon-rhythm-engine.mjs';
const root=document.getElementById('app');
let state=initialState(),lastRaw=null,writeAllowed=true,warning='',inputWarning='';
try{
 lastRaw=localStorage.getItem(STORAGE_KEY);
 if(lastRaw){const value=JSON.parse(lastRaw);if(!validState(value))throw Error('Invalid saved Unit 15 data');state=value;}
}catch{
 writeAllowed=false;
 warning='Saved Unit 15 progress is invalid or unavailable. The original data will not be overwritten. This session runs in memory; export before leaving.';
}
const esc=v=>String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
const button=(id,label,secondary=false)=>'<button type="button" class="'+(secondary?'secondary':'primary')+'" data-action="'+id+'">'+esc(label)+'</button>';
const link=(href,label)=>'<a class="secondary unit-link" href="'+href+'">'+esc(label)+'</a>';
function commit(next){
 if(next===state)return;
 if(writeAllowed){
  try{
   if(localStorage.getItem(STORAGE_KEY)!==lastRaw){
    writeAllowed=false;warning='Another tab changed Unit 15. Reload to see the latest saved progress; this tab will not overwrite it.';render();return;
   }
   const raw=JSON.stringify(next);localStorage.setItem(STORAGE_KEY,raw);lastRaw=raw;
  }catch{
   writeAllowed=false;warning='Browser storage failed. This session is in memory; export before leaving.';
  }
 }
 state=next;inputWarning='';render();
}
function frame(body,actions=''){
 const active=!state.paused&&!state.finished,progress=Math.min(state.index,TASKS.length);
 root.innerHTML='<div class="shell"><header class="topbar"><div class="brand">'
  +'<div class="brand-mark" lang="ja">っ</div><div><h2>Kana Foundations</h2>'
  +'<p class="eyebrow">UNIT 15 · SOKUON & RHYTHM</p></div></div>'
  +(active?'<button type="button" class="top-exit" data-action="pause" aria-label="Exit lesson; progress is saved">Exit</button>':'')
  +'</header>'
  +(active?'<div class="progress-track" aria-hidden="true"><div class="progress-bar" style="width:'+Math.round(progress/TASKS.length*100)+'%"></div></div>'
   +'<div class="progress-caption"><span>'+(state.index>=TASKS.length?'Correction practice':atCheckpoint(state)?'Sokuon checkpoint':state.index<CHECKPOINT_INDEX?'Sokuon and consonant timing':'Long vowels and expressions')+'</span><span>'+progress+' / '+TASKS.length+' first prompts</span></div>':'')
  +'<main id="main" tabindex="-1">'+(warning?'<div class="warning" role="alert">'+esc(warning)+'</div>':'')+body+'</main>'
  +'<footer class="action-area">'+actions+'</footer>'
  +'<p class="footer-note">Isolated prototype · No Account, FSRS, earlier-unit or production progress changes</p></div>';
 const field=root.querySelector('#answer');
 if(field)field.focus({preventScroll:true});else root.querySelector('#main')?.focus({preventScroll:true});
}
const moraStrip=()=>'<div class="rhythm-strip" aria-label="Three morae: ki, consonant hold, te"><span lang="ja">き</span><span lang="ja">っ</span><span lang="ja">て</span></div>';
function welcome(){
 frame('<p class="kicker">Unit 15 · Sokuon and mora timing</p><h1>Small っ and Japanese rhythm</h1>'
 +'<p class="lead">Compare full つ (tsu) with small っ (sokuon), then learn why consonant length and vowel length can change Japanese words.</p>'
 +'<div class="teaching-note"><span class="mini-label">Stage A · Sokuon · 18 prompts</span>'
 +'Small っ is not spoken as a separate tsu syllable. It adds one mora of consonant length: き・っ・て has three morae.'
 +moraStrip()+'Before k, t or p the closure is held; before s/sh the frication is prolonged. Kana-faithful romaji uses doubled consonants such as kitte, kippu, sakka, and zasshi.</div>'
 +'<div class="teaching-note"><span class="mini-label">Stage B · Long vowels · 6 prompts</span>'
 +'At the checkpoint, switch to おばさん versus おばあさん, おじさん versus おじいさん, and full readings including がっこう. Its っ and う both add a mora.</div>'
 +'<div class="teaching-note"><span class="mini-label">Assessment limits</span>'
 +'These are written reading and mora-counting tasks, not listening or spoken pronunciation tests. Wrong or revealed first attempts remain unchanged after corrections. No approved pronunciation audio is available.</div>',
 button('start',state.index?'Resume Unit 15':'Start Unit 15')
 +link('./dakuten-bp.html','Back to Unit 14')+button('export','Export Unit 15 progress',true));
}
function checkpoint(){
 const score=summary(state);
 frame('<p class="kicker">Section complete · progress saved</p><h1>Rhythm checkpoint</h1>'
 +'<p class="lead">You completed 18 small-っ tasks. Save this checkpoint and continue with the four long-vowel reviews and two meaningful expressions.</p>'
 +moraStrip()
 +'<div class="rhythm-checkpoint"><strong>'+score.stageSokuon+' / 18</strong><span>Independent correct sokuon first attempts</span></div>'
 +'<div class="teaching-note"><span class="mini-label">Long-vowel timing</span>'
 +'おばさん and おばあさん differ by one mora. がっこう is が・っ・こ・う: four morae, including both consonant and vowel length.</div>',
 button('checkpoint','Continue to long-vowel review')+button('pause','Exit and resume later',true)
 +link('./dakuten-bp.html','Back to Unit 14'));
}
function results(){
 const score=summary(state);
 frame('<p class="kicker">Unit 15 · First-attempt evidence</p><h1>Sokuon & Rhythm completed</h1>'
 +'<p class="lead">You practiced written small-っ forms, meaning contrasts, consonant doubling, long vowels and full expressions. This does not verify spoken timing or retention.</p>'
 +'<div class="metrics">'+MODES.map(m=>'<div class="metric"><strong>'+score[m.id].independentCorrect+' / '+m.total+'</strong><span>'+esc(m.label)+' · independent first answers</span></div>').join('')+'</div>'
 +'<div class="teaching-note"><span class="mini-label">Separate corrections</span>'+score.corrected+' of '+score.correctionCount+' correction answers were independently correct. First attempts were not replaced.</div>',
 link('./dakuten-bp.html','Return to Unit 14')+button('export','Export Unit 15 progress',true));
}
function taskView(){
 const t=taskAt(state);
 if(!t){frame('<h1>Lesson unavailable</h1><p>Export your evidence for recovery.</p>',button('export','Export Unit 15 progress'));return;}
 const titles={form:'Shape and mora timing',pair:'Meaning-changing contrast',word:'Read the word',spelling:'Choose the romaji','vowel-choice':'Long-vowel meaning','vowel-read':'Read the long vowel',phrase:'Read the expression'};
 const hints={form:'Choose the correct written form or mora count.',pair:'Choose the word matching the requested meaning.',
  word:'Type the kana-faithful romaji, retaining doubled consonants.',spelling:'Select the exact kana-faithful romaji spelling.',
  'vowel-choice':'Choose the correct Japanese word; vowel length changes meaning.','vowel-read':'Type the full romaji including the long vowel.',
  phrase:'Read the whole expression. を is pronounced o; typing wo is accepted only as an alternative spelling.'};
 const peers=TASKS.filter(x=>x.mode===t.mode),serial=peers.findIndex(x=>x.id===t.id)+1;
 const caption=t.correction?'Correction practice · first attempt retained':(t.stage==='sokuon'?'Sokuon':t.stage==='rhythm'?'Long vowels':'Application')+' · '+t.mode+' '+serial+' / '+peers.length;
 const question=['form','pair','vowel-choice'].includes(t.mode);
 const display=question?'<div class="teaching-note rhythm-question"><span class="mini-label">Written question</span>'+esc(t.kana)+'</div>'
  :'<div class="glyph-panel rhythm-glyph"><span class="japanese-word" lang="ja">'+esc(t.kana)+'</span></div>';
 let interaction='';
 if(!state.feedback){
  if(t.choices){
   interaction='<div class="choices rhythm-choices '+(['pair','vowel-choice'].includes(t.mode)?'rhythm-phrase-choices':'')+'">'
    +t.choices.map(c=>'<button class="choice" type="button" data-action="choice" data-value="'+esc(c.value)+'" aria-label="'+esc('Option '+c.label)+'">'+esc(c.label)+'</button>').join('')+'</div>';
  }else{
   interaction='<form id="answer-form"><label class="form-label" for="answer">Type the romaji reading</label>'
    +'<input id="answer" type="text" class="answer-input" inputmode="latin" maxlength="60" autocapitalize="off" autocomplete="off" spellcheck="false" required>'
    +'<button type="submit" class="primary">Check answer</button></form>';
  }
  interaction+='<div class="hint-actions"><button class="text-button" type="button" data-action="reveal">Show answer (no credit)</button></div>';
  if(inputWarning)interaction+='<p class="warning" role="alert">'+esc(inputWarning)+'</p>';
 }else{
  const f=state.feedback,correctLabel=t.choices?.find(c=>c.value===f.answer)?.label||f.answer;
  const submittedLabel=t.choices?.find(c=>c.value===f.submitted)?.label||f.submitted;
  interaction='<div class="feedback '+(f.correct===true?'good':f.correct===false?'bad':'neutral')+'" role="status" aria-live="polite" tabindex="-1">'
   +'<strong>'+(f.correct===true?'Correct.':f.correct===false?'Not quite.':'Answer revealed — no independent credit.')+'</strong>'
   +'Correct answer: '+esc(correctLabel)
   +(f.correct===false?'<small>Your answer: '+esc(submittedLabel)+'. Check consonant and vowel duration.</small>':'')
   +(t.meaning?'<small>Meaning: '+esc(t.meaning)+'</small>':'')
   +(t.kanji?'<small>Common writing: '+esc(t.kanji)+'</small>':'')
   +(t.note?'<small>'+esc(t.note)+'</small>':'')
   +(t.correction?'<small>Original first-attempt evidence is unchanged.</small>':'')+'</div>';
 }
 frame('<section class="practice-screen"><p class="kicker">'+esc(caption)+'</p><h1>'+esc(titles[t.mode])+'</h1>'
  +'<p class="lead">'+esc(hints[t.mode])+'</p>'+display+interaction+'</section>',
  state.feedback?button('next','Continue'):'');
 if(state.feedback)root.querySelector('[role="status"].feedback')?.focus({preventScroll:true});
 else root.querySelector('[data-action="choice"]')?.focus({preventScroll:true});
}
function render(){if(state.paused)welcome();else if(state.finished)results();else if(atCheckpoint(state))checkpoint();else taskView();}
function exportProgress(){
 const blob=new Blob([JSON.stringify({prototype:true,unit:'sokuon-rhythm',exportedAt:new Date().toISOString(),state},null,2)],{type:'application/json'});
 const url=URL.createObjectURL(blob),node=document.createElement('a');
 node.href=url;node.download='kana-foundations-unit15.json';document.body.append(node);node.click();node.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
root.addEventListener('click',event=>{
 const el=event.target.closest('button[data-action]');if(!el||el.disabled)return;
 switch(el.dataset.action){
  case 'start':commit(resume(state));break;
  case 'pause':commit(pause(state));break;
  case 'checkpoint':commit(acknowledgeCheckpoint(state));break;
  case 'choice':commit(answer(state,el.dataset.value));break;
  case 'reveal':commit(reveal(state));break;
  case 'next':commit(advance(state));break;
  case 'export':exportProgress();break;
 }
});
root.addEventListener('submit',event=>{
 if(event.target.id!=='answer-form')return;event.preventDefault();
 const next=answer(state,event.target.querySelector('input').value);
 if(next===state){inputWarning='Enter the spoken reading with romaji letters.';render();}else commit(next);
});
render();
