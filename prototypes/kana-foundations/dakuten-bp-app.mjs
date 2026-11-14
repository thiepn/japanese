// Unit 14 presentation reuses the Kana Foundations visual system without changing older lessons.
import {STORAGE_KEY,KANA,WORDS,TASKS,MODES,CHECKPOINT_INDEX,initialState,validState,taskAt,atCheckpoint,resume,pause,acknowledgeCheckpoint,beginRecall,answer,reveal,advance,summary} from './dakuten-bp-engine.mjs';

const root=document.getElementById('app');
let state=initialState(),lastRaw=null,writeAllowed=true,warning='',inputWarning='';
try{
 lastRaw=localStorage.getItem(STORAGE_KEY);
 if(lastRaw){
  const parsed=JSON.parse(lastRaw);
  if(!validState(parsed))throw Error('Invalid saved Unit 14 data');
  state=parsed;
 }
}catch{
 writeAllowed=false;
 warning='Saved Unit 14 progress is invalid or unavailable. The original data will not be overwritten. This session runs in memory; export it before leaving.';
}
const esc=x=>String(x??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
const button=(act,label,secondary=false)=>'<button type="button" class="'+(secondary?'secondary':'primary')+'" data-action="'+act+'">'+esc(label)+'</button>';
const link=(href,label)=>'<a class="secondary unit-link" href="'+href+'">'+esc(label)+'</a>';
const stageName=t=>t.stage==='b'?'B-row':t.stage==='p'?'P-row':'Application';
function commit(next){
 if(next===state)return;
 if(writeAllowed){
  try{
   if(localStorage.getItem(STORAGE_KEY)!==lastRaw){
    writeAllowed=false;
    warning='Another tab changed Unit 14. Reload to see its saved progress; this tab will not overwrite it.';
    render();return;
   }
   const raw=JSON.stringify(next);
   localStorage.setItem(STORAGE_KEY,raw);
   lastRaw=raw;
  }catch{
   writeAllowed=false;
   warning='Browser storage failed. Progress is in memory; export it before leaving.';
  }
 }
 state=next;inputWarning='';render();
}
function frame(body,actions=''){
 const active=!state.paused&&!state.finished,progress=Math.min(TASKS.length,state.index);
 root.innerHTML='<div class="shell"><header class="topbar"><div class="brand"><div class="brand-mark" lang="ja">ば</div><div><h2>Kana Foundations</h2>'
 +'<p class="eyebrow">UNIT 14 · B/P DAKUTEN</p></div></div>'
 +(active?'<button class="top-exit" data-action="pause" aria-label="Exit lesson; progress is saved">Exit</button>':'')+'</header>'
 +(active?'<div class="progress-track" aria-hidden="true"><div class="progress-bar" style="width:'+Math.round(progress/TASKS.length*100)+'%"></div></div>'
  +'<div class="progress-caption"><span>'+(state.index>=TASKS.length?'Correction practice':atCheckpoint(state)?'Stage A checkpoint':state.index<CHECKPOINT_INDEX?'Stage A · B-row':'Stage B · P-row and phrases')+'</span><span>'+progress+' / '+TASKS.length+' first prompts</span></div>':'')
 +'<main id="main" tabindex="-1">'+(warning?'<div class="warning" role="alert">'+esc(warning)+'</div>':'')+body+'</main>'
 +'<footer class="action-area">'+actions+'</footer>'
 +'<p class="footer-note">Isolated prototype · No Account, FSRS or production progress changes</p></div>';
 const field=root.querySelector('#answer');
 if(field)field.focus({preventScroll:true});
 else root.querySelector('#main')?.focus({preventScroll:true});
}
function kanaStrip(items){return '<div class="dakuten-strip" lang="ja">'+items.map(k=>'<span>'+esc(k.kana)+'</span>').join('')+'</div>';}
function welcome(){
 frame('<p class="kicker">Unit 14 · Dakuten and handakuten</p><h1>Learn the B-row and P-row</h1>'
 +'<p class="lead">Study the B-row with two-stroke dakuten (゛), then the P-row with the small circular handakuten (゜). Compare は (ha), ば (ba) and ぱ (pa) to notice how the marks change the reading.</p>'
 +'<div class="teaching-note"><span class="mini-label">Stage A · B-row · 17 prompts</span>'
 +kanaStrip(KANA.slice(0,5))+'Read five everyday words, then distinguish unmarked H-row kana from voiced B-row characters.</div>'
 +'<div class="teaching-note"><span class="mini-label">Stage B · P-row · 17 prompts</span>'
 +kanaStrip(KANA.slice(5))+'The circle marks a voiceless P sound, not a partially voiced B sound. Compare ふ / ぶ / ぷ carefully: Japanese ふ is not simply the English f sound.</div>'
 +'<div class="teaching-note"><span class="mini-label">Genuine words and spelling</span>'
 +'You will read familiar words including えんぴつ (pencil), さんぽ (stroll) and てんぷら (tempura). In ordinary Japanese these may be written in kanji or katakana. We show hiragana first to practice the characters.</div>'
 +'<div class="teaching-note"><span class="mini-label">Mimetic language in context</span>'
 +'The expressive word ぺこぺこ can mean very hungry in おなかがぺこぺこ, but has other meanings in other contexts. You are graded on reading, not on guessing a single unconditional translation.</div>'
 +'<div class="teaching-note"><span class="mini-label">Application · 2 prompts</span>'
 +'Read ぼうしはどこですか (Where is the hat?) and おなかがぺこぺこ (I am very hungry). The particle は is pronounced wa; ぼうし includes a long o vowel.</div>'
 +'<p class="status">36 first-attempt prompts, a resumable checkpoint and correction practice. No unapproved pronunciation audio is included.</p>',
 button('start',state.index?'Resume Unit 14':'Start Unit 14')
 +link('./dakuten-d.html','Back to Unit 13')
 +button('export','Export Unit 14 progress',true));
}
function checkpoint(){
 const s=summary(state);
 frame('<p class="kicker">Stage A complete · progress saved</p><h1>B-row checkpoint</h1>'
 +'<p class="lead">All 17 B-row first prompts are complete. You may stop here, reload later, or continue to the P-row. Corrections, if any, come after all 36 original prompts.</p>'
 +kanaStrip(KANA.slice(0,5))
 +'<div class="bp-checkpoint"><strong>'+s.stageB+' / 17</strong><span>Independent correct first answers for the B-row</span></div>'
 +'<div class="teaching-note"><span class="mini-label">Next: the small circle</span>'
 +'ぱ pa · ぴ pi · ぷ pu · ぺ pe · ぽ po. Each uses handakuten (゜), not dakuten (゛).</div>',
 button('checkpoint','Continue to Stage B · P-row')
 +button('pause','Exit and resume later',true)
 +link('./dakuten-d.html','Back to Unit 13'));
}
function results(){
 const s=summary(state);
 frame('<p class="kicker">Unit 14 · Original learning evidence</p><h1>B/P-row practice completed</h1>'
 +'<p class="lead">You have practiced ten B/P characters, ten authentic words, four writing-and-sound contrasts and two contextual expressions. Completing this session does not guarantee long-term retention.</p>'
 +'<div class="metrics">'+MODES.map(m=>'<div class="metric"><strong>'+s[m.id].independentCorrect+' / '+m.total+'</strong>'
 +'<span>'+esc(m.label)+' · independent first answers</span></div>').join('')+'</div>'
 +'<div class="teaching-note"><span class="mini-label">Separate correction evidence</span>'
 +s.corrected+' of '+s.correctionCount+' correction answers were independently correct. Earlier first-attempt evidence remains unchanged.</div>'
 +'<p class="status">Review again later to test retention; no unapproved audio was incorporated.</p>',
 link('./sokuon-rhythm.html','Continue to Unit 15 · Sokuon & Rhythm')+link('./dakuten-d.html','Return to Unit 13')
 +button('export','Export Unit 14 progress',true));
}
function taskView(){
 const task=taskAt(state);
 if(!task){frame('<h1>Unable to open the task</h1><p>Export your current state for recovery.</p>',button('export','Export Unit 14 progress'));return;}
 const teaching=task.mode==='introduction'&&!task.correction&&!state.checking&&!state.feedback;
 const titles={introduction:'Meet '+task.kana,recognition:'Choose the reading',word:'Read the word',contrast:'Choose the marked kana',phrase:'Read the expression'};
 const heading=titles[task.mode];
 const serial=TASKS.filter(x=>x.mode===task.mode&&x.stage===task.stage).findIndex(x=>x.id===task.id)+1;
 const count=TASKS.filter(x=>x.mode===task.mode&&x.stage===task.stage).length;
 const caption=task.correction?'Correction practice · first attempt retained':stageName(task)+' · '+task.mode+' '+serial+' / '+count;
 const prompt=teaching?'Study the character, reading and voice change. Then hide the reading and recall it.':
  task.mode==='recognition'?'Choose the correct spoken reading for the character.':
  task.mode==='word'?'Type the romaji reading of this genuine Japanese word. Its meaning appears after your answer.':
  task.mode==='contrast'?'Choose the correct marked character for the requested sound; the P-row uses the circular handakuten.':
  task.mode==='phrase'?'Read the complete expression. は used as a topic particle sounds wa; romaji spaces are optional.':
  'Type the spoken reading from memory.';
 let interaction='';
 if(teaching){
  interaction='<div class="teaching-note"><span class="mini-label">Sound and shape</span>'+esc(task.note)+'</div>';
 }else if(!state.feedback){
  if(task.choices){
   interaction='<div class="choices bp-choices '+(task.mode==='contrast'?'letter-choices':'')+'">'
    +task.choices.map(c=>'<button class="choice" type="button" data-action="choice" data-value="'+esc(c.value)+'" aria-label="'+esc((task.mode==='contrast'?'Character ':'Reading ')+c.label)+'">'+esc(c.label)+'</button>').join('')+'</div>';
  }else{
   interaction='<form id="answer-form"><label for="answer" class="form-label">Type the romaji reading</label>'
    +'<input id="answer" type="text" class="answer-input" inputmode="latin" maxlength="60" autocapitalize="off" autocomplete="off" spellcheck="false" required>'
    +'<button type="submit" class="primary">Check answer</button></form>';
  }
  interaction+='<div class="hint-actions"><button class="text-button" type="button" data-action="reveal">Show answer (no credit)</button></div>';
  if(inputWarning)interaction+='<p role="alert" class="warning">'+esc(inputWarning)+'</p>';
 }else{
  const f=state.feedback;
  interaction='<div class="feedback '+(f.correct===true?'good':f.correct===false?'bad':'neutral')+'" role="status" aria-live="polite" tabindex="-1">'
   +'<strong>'+(f.correct===true?'Correct.':f.correct===false?'Not quite.':'Answer revealed — no independent credit.')+'</strong>'
   +'Correct answer: '+esc(f.answer)
   +(f.correct===false?'<small>Your answer: '+esc(f.submitted)+'. Compare the written mark and the requested reading.</small>':'')
   +(task.meaning?'<small>Meaning: '+esc(task.meaning)+'</small>':'')
   +(task.kanji?'<small>Common writing: '+esc(task.kanji)+'</small>':'')
   +(task.note?'<small>'+esc(task.note)+'</small>':'')
   +(task.correction?'<small>Correction practice cannot replace the original first answer.</small>':'')+'</div>';
 }
 const glyph=task.mode==='contrast'
  ?'<div class="teaching-note"><span class="mini-label">Mark and sound contrast</span>'+esc(task.kana)+'</div>'
  :'<div class="glyph-panel bp-review-glyph"><span class="'+((task.mode==='introduction'||task.mode==='recognition')?'hero-glyph':'japanese-word')+'" lang="ja">'+esc(task.kana)+'</span>'
  +(teaching?'<span class="roman">'+esc(task.answer)+'</span>':'')+'</div>';
 const actions=teaching?button('recall','Try recalling '+task.kana):
   state.feedback?button('next',state.index===TASKS.length-1?'Continue to correction or results':'Continue'):'';
 frame('<section class="practice-screen"><p class="kicker">'+esc(caption)+'</p><h1>'+esc(heading)+'</h1>'
  +'<p class="lead">'+esc(prompt)+'</p>'+glyph+interaction+'</section>',actions);
 if(state.feedback)root.querySelector('[role="status"].feedback')?.focus({preventScroll:true});
}
function render(){if(state.paused)welcome();else if(state.finished)results();else if(atCheckpoint(state))checkpoint();else taskView();}
function exportProgress(){
 const blob=new Blob([JSON.stringify({prototype:true,unit:'dakuten-bp',exportedAt:new Date().toISOString(),state},null,2)],{type:'application/json'});
 const url=URL.createObjectURL(blob),node=document.createElement('a');
 node.href=url;node.download='kana-foundations-unit14.json';
 document.body.append(node);node.click();node.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
root.addEventListener('click',event=>{
 const el=event.target.closest('button[data-action]');
 if(!el||el.disabled)return;
 switch(el.dataset.action){
  case 'start':commit(resume(state));break;
  case 'pause':commit(pause(state));break;
  case 'checkpoint':commit(acknowledgeCheckpoint(state));break;
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
 if(next===state){inputWarning='Enter the reading using romaji letters.';render();}
 else commit(next);
});
render();
