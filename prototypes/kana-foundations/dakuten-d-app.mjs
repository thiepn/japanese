// Unit 13: independent D-row lesson surface, reusing the Kana Foundations design.
import {STORAGE_KEY,KANA,TASKS,MODES,initialState,validState,taskAt,resume,pause,beginRecall,answer,reveal,advance,summary} from './dakuten-d-engine.mjs';

const root=document.getElementById('app');
let state=initialState(),lastRaw=null,writeAllowed=true,warning='',inputWarning='';
try{
 lastRaw=localStorage.getItem(STORAGE_KEY);
 if(lastRaw){
  const parsed=JSON.parse(lastRaw);
  if(!validState(parsed))throw Error('Invalid saved Unit 13 evidence');
  state=parsed;
 }
}catch{
 writeAllowed=false;
 warning='Saved Unit 13 progress is invalid or unavailable. It will not be overwritten. Practice runs in memory; export it before leaving.';
}
const esc=v=>String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
const button=(act,label,secondary=false)=>'<button type="button" data-action="'+act+'" class="'+(secondary?'secondary':'primary')+'">'+esc(label)+'</button>';
const link=(href,label)=>'<a class="secondary unit-link" href="'+href+'">'+esc(label)+'</a>';
function commit(next){
 if(next===state)return;
 if(writeAllowed){
  try{
   if(localStorage.getItem(STORAGE_KEY)!==lastRaw){
    writeAllowed=false;
    warning='Another tab changed Unit 13. Reload to see the latest saved progress; this tab will not overwrite it.';
    render();return;
   }
   const raw=JSON.stringify(next);
   localStorage.setItem(STORAGE_KEY,raw);
   lastRaw=raw;
  }catch{
   writeAllowed=false;
   warning='Browser storage failed. This session runs in memory; export before leaving.';
  }
 }
 state=next;inputWarning='';render();
}
function frame(body,actions=''){
 const active=!state.paused&&!state.finished;
 const progress=Math.min(TASKS.length,state.index);
 root.innerHTML='<div class="shell"><header class="topbar"><div class="brand"><div class="brand-mark" lang="ja">だ</div><div>'
  +'<h2>Kana Foundations</h2><p class="eyebrow">UNIT 13 · D-ROW & ORTHOGRAPHY</p></div></div>'
  +(active?'<button class="top-exit" data-action="pause" aria-label="Exit lesson; progress is saved">Exit</button>':'')
  +'</header>'
  +(active?'<div class="progress-track" aria-hidden="true"><div class="progress-bar" style="width:'+Math.round(progress/TASKS.length*100)+'%"></div></div>'
   +'<div class="progress-caption"><span>'+(state.index>=TASKS.length?'Correction practice':'Voiced D-row and authentic reading')+'</span>'
   +'<span>'+progress+' / '+TASKS.length+' first prompts</span></div>':'')
  +'<main id="main" tabindex="-1">'+(warning?'<div class="warning" role="alert">'+esc(warning)+'</div>':'')+body+'</main>'
  +'<footer class="action-area">'+actions+'</footer>'
  +'<p class="footer-note">Isolated prototype · No Account, FSRS, earlier-unit or production progress changes</p></div>';
 const field=root.querySelector('#answer');
 if(field)field.focus({preventScroll:true});
 else root.querySelector('#main')?.focus({preventScroll:true});
}
function welcome(){
 frame('<p class="kicker">Unit 13 · Five D-row kana</p><h1>Voiced D-row</h1>'
 +'<p class="lead">Learn だ・ぢ・づ・で・ど, decode real Japanese words, and choose correct spellings when two kana sound alike.</p>'
 +'<div class="d-kana-strip" lang="ja">'+KANA.map(k=>'<span>'+esc(k.kana)+'</span>').join('')+'</div>'
 +'<div class="teaching-note"><span class="mini-label">Two sounds, two spellings</span>'
 +'In modern standard Japanese, <strong>ぢ</strong> usually sounds like <strong>じ</strong> (ji), and <strong>づ</strong> usually sounds like <strong>ず</strong> (zu). The differences are normally <strong>spelling</strong>, not audible sound distinctions. Dialects can differ.</div>'
 +'<div class="teaching-note"><span class="mini-label">Correct orthography</span>'
 +'The familiar words <strong>ちぢむ</strong> (shrink) and <strong>つづく</strong> (continue) use ぢ and づ. You will select their spellings visually; you will never be asked to hear which character was used.</div>'
 +'<div class="teaching-note"><span class="mini-label">Keyboard versus pronunciation</span>'
 +'Some Japanese IMEs accept the typing sequences <strong>di</strong> for ぢ and <strong>du</strong> for づ. Those are keyboard instructions, <strong>not spoken romaji answers</strong>. Type ji and zu to show how they sound. English meanings and grammar explanations appear after the corresponding responses.</div>'
 +'<div class="teaching-note"><span class="mini-label">23 first attempts, then corrections</span>'
 +'5 guided recalls · 5 recognition choices · 5 genuine words · 2 spelling choices · 2 voicing choices · 2 expressions · 2 comprehension questions. Incorrect or revealed responses return later, but first-attempt records never change.</div>'
 +'<p class="status">No unapproved pronunciation audio is embedded. Reading completion is not a claim of long-term mastery.</p>',
 button('start',state.index?'Resume Unit 13':'Start Unit 13')
 +link('./dakuten-gz.html','Back to Unit 12')
 +button('export','Export Unit 13 progress',true));
}
function completed(){
 const s=summary(state);
 frame('<p class="kicker">Unit 13 · Recorded first attempts</p><h1>D-row practice completed</h1>'
 +'<p class="lead">You read all five D-row characters, recognized conventional spellings and applied them in short expressions.</p>'
 +'<div class="metrics">'+MODES.map(m=>'<div class="metric"><strong>'+s[m.id].independentCorrect+' / '+m.total+'</strong>'
  +'<span>'+esc(m.label)+' · independent first answers</span></div>').join('')+'</div>'
 +'<div class="teaching-note"><span class="mini-label">Corrections do not change original evidence</span>'
 +s.corrected+' / '+s.correctionCount+' correction answers were correct. Revisit the words later to test retention.</div>',
 link('./dakuten-gz.html','Return to Unit 12')+button('export','Export Unit 13 progress',true));
}
function practice(){
 const t=taskAt(state);
 if(!t){frame('<h1>Session unavailable</h1><p>Export your evidence for recovery.</p>',button('export','Export Unit 13 progress'));return;}
 const guided=t.mode==='introduction'&&!t.correction&&!state.checking&&!state.feedback;
 const titles={introduction:'Meet '+t.kana,recognition:'Choose the sound',word:'Read the word',spelling:'Choose the standard spelling',contrast:'Choose the voiced kana',expression:'Read the expression',meaning:'Understand the Japanese'};
 const instructions={
  introduction:guided?'Study the shape and spoken reading. Then hide the answer and recall it.':'Type the spoken romaji from memory, not an IME keyboard command.',
  recognition:'Choose the modern standard-Japanese spoken reading, not a keyboard input sequence.',
  word:'Read every kana and type the spoken romaji. The meaning appears after you answer.',
  spelling:'Choose the conventional written spelling. These choices are NOT different sounds.',
  contrast:'Choose the voiced written character. Compare the dakuten marks visually.',
  expression:'Type the spoken romaji of the entire expression. Spaces are optional; を sounds o and は as a topic sounds wa.',
  meaning:'Choose the English meaning, using the topic marker and question context.'
 };
 const subtitle=t.correction?'Correction practice · original first attempt retained':
  MODES.find(m=>m.id===t.mode)?.label+' · '+(TASKS.filter(x=>x.mode===t.mode).findIndex(x=>x.id===t.id)+1)
  +' / '+TASKS.filter(x=>x.mode===t.mode).length;
 let interaction='';
 if(guided){
  interaction='<div class="teaching-note"><span class="mini-label">Sound and spelling</span>'+esc(t.note)+'</div>';
 }else if(!state.feedback){
  if(t.choices){
   const type=t.mode==='spelling'?'Spelling ':t.mode==='contrast'?'Character ':t.mode==='recognition'?'Reading ':'Meaning ';
   const cls=t.mode==='meaning'?'d-meaning-choices':t.mode==='spelling'?'d-spelling-choices':'';
   interaction='<div class="choices d-choices '+cls+'">'+t.choices.map(c=>
    '<button type="button" class="choice" data-action="choice" data-value="'+esc(c.value)+'" aria-label="'+esc(type+c.label)+'">'+esc(c.label)+'</button>'
   ).join('')+'</div>';
  }else{
   interaction='<form id="answer-form"><label for="answer" class="form-label">Type the romaji reading</label>'
    +'<input id="answer" class="answer-input" type="text" inputmode="latin" maxlength="60" autocapitalize="off" autocomplete="off" spellcheck="false" required>'
    +'<button class="primary" type="submit">Check answer</button></form>';
  }
  interaction+='<div class="hint-actions"><button class="text-button" type="button" data-action="reveal">Show answer (no credit)</button></div>';
  if(inputWarning)interaction+='<p class="warning" role="alert">'+esc(inputWarning)+'</p>';
 }else{
  const f=state.feedback;
  const label=t.choices?.find(c=>c.value===f.answer)?.label||f.answer;
  interaction='<div class="feedback '+(f.correct===true?'good':f.correct===false?'bad':'neutral')+'" role="status" aria-live="polite" tabindex="-1">'
   +'<strong>'+(f.correct===true?'Correct.':f.correct===false?'Not quite.':'Answer revealed — no independent credit.')+'</strong>'
   +'Correct answer: '+esc(label)
   +(f.correct===false?'<small>Your answer: '+esc(t.choices?.find(c=>c.value===f.submitted)?.label||f.submitted)+'</small>':'')
   +(t.meaning?'<small>Meaning: '+esc(t.meaning)+'</small>':'')
   +(t.kanji?'<small>Common writing: '+esc(t.kanji)+'</small>':'')
   +(t.note?'<small>'+esc(t.note)+'</small>':'')
   +(t.correction?'<small>This correction never replaces the earlier first attempt.</small>':'')+'</div>';
 }
 const glyph=t.mode==='spelling'||t.mode==='contrast'
  ?'<div class="teaching-note"><span class="mini-label">Written-form choice</span>'+esc(t.kana)+'</div>'
  :'<div class="glyph-panel d-glyph-panel"><span class="'+((t.mode==='introduction'||t.mode==='recognition')?'hero-glyph':'japanese-word')+'" lang="ja">'+esc(t.kana)+'</span>'
   +(guided?'<span class="roman">'+esc(t.answer)+'</span>':'')+'</div>';
 const actions=guided?button('recall','Try recalling '+t.kana):state.feedback?button('next','Continue'):'';
 frame('<section class="practice-screen"><p class="kicker">'+esc(subtitle)+'</p><h1>'+esc(titles[t.mode])+'</h1>'
  +'<p class="lead">'+esc(instructions[t.mode])+'</p>'+glyph+interaction+'</section>',actions);
 if(state.feedback)root.querySelector('[role="status"].feedback')?.focus({preventScroll:true});
}
function render(){if(state.finished)completed();else if(state.paused)welcome();else practice();}
function exportProgress(){
 const blob=new Blob([JSON.stringify({prototype:true,unit:'dakuten-d',exportedAt:new Date().toISOString(),state},null,2)],{type:'application/json'});
 const url=URL.createObjectURL(blob),node=document.createElement('a');
 node.href=url;node.download='kana-foundations-unit13.json';
 document.body.append(node);node.click();node.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
root.addEventListener('click',event=>{
 const el=event.target.closest('button[data-action]');
 if(!el||el.disabled)return;
 switch(el.dataset.action){
  case 'start':commit(resume(state));break;
  case 'pause':commit(pause(state));break;
  case 'recall':commit(beginRecall(state));break;
  case 'choice':commit(answer(state,el.dataset.value));break;
  case 'reveal':commit(reveal(state));break;
  case 'next':commit(advance(state));break;
  case 'export':exportProgress();break;
 }
});
root.addEventListener('submit',event=>{
 if(event.target.id!=='answer-form')return;
 event.preventDefault();
 const next=answer(state,event.target.querySelector('input').value);
 if(next===state){inputWarning='Enter the spoken reading using romaji letters.';render();}
 else commit(next);
});
render();
