// Unit 17 presentation reuses the Kana Foundations visual system without changing older lessons.
import {STORAGE_KEY,KANA,WORDS,TASKS,MODES,CHECKPOINT_INDEX,initialState,validState,taskAt,atCheckpoint,resume,pause,acknowledgeCheckpoint,beginRecall,answer,reveal,advance,summary} from './yoon-nhmr-engine.mjs';

const root=document.getElementById('app');
let state=initialState(),lastRaw=null,writeAllowed=true,warning='',inputWarning='';
try{
 lastRaw=localStorage.getItem(STORAGE_KEY);
 if(lastRaw){
  const parsed=JSON.parse(lastRaw);
  if(!validState(parsed))throw Error('Invalid saved Unit 17 data');
  state=parsed;
 }
}catch{
 writeAllowed=false;
 warning='Saved Unit 17 progress is invalid or unavailable. The original data will not be overwritten. This session runs in memory; export it before leaving.';
}
const esc=x=>String(x??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
const button=(act,label,secondary=false)=>'<button type="button" class="'+(secondary?'secondary':'primary')+'" data-action="'+act+'">'+esc(label)+'</button>';
const link=(href,label)=>'<a class="secondary unit-link" href="'+href+'">'+esc(label)+'</a>';
const stageName=t=>t.stage==='a'?'N/H yōon':t.stage==='b'?'M/R yōon':'Application';
function commit(next){
 if(next===state)return;
 if(writeAllowed){
  try{
   if(localStorage.getItem(STORAGE_KEY)!==lastRaw){
    writeAllowed=false;
    warning='Another tab changed Unit 17. Reload to see its saved progress; this tab will not overwrite it.';
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
 root.innerHTML='<div class="shell"><header class="topbar"><div class="brand"><div class="brand-mark" lang="ja">にゃ</div><div><h2>Kana Foundations</h2>'
 +'<p class="eyebrow">UNIT 17 · YŌON N/H/M/R</p></div></div>'
 +(active?'<button class="top-exit" data-action="pause" aria-label="Exit lesson; progress is saved">Exit</button>':'')+'</header>'
 +(active?'<div class="progress-track" aria-hidden="true"><div class="progress-bar" style="width:'+Math.round(progress/TASKS.length*100)+'%"></div></div>'
  +'<div class="progress-caption"><span>'+(state.index>=TASKS.length?'Correction practice':atCheckpoint(state)?'Stage A checkpoint':state.index<CHECKPOINT_INDEX?'Stage A · N/H contracted sounds':'Stage B · M/R and application')+'</span><span>'+progress+' / '+TASKS.length+' first prompts</span></div>':'')
 +'<main id="main" tabindex="-1">'+(warning?'<div class="warning" role="alert">'+esc(warning)+'</div>':'')+body+'</main>'
 +'<footer class="action-area">'+actions+'</footer>'
 +'<p class="footer-note">Isolated prototype · No Account, FSRS or production progress changes</p></div>';
 const field=root.querySelector('#answer');
 if(field)field.focus({preventScroll:true});
 else root.querySelector('#main')?.focus({preventScroll:true});
}
function kanaStrip(items){return '<div class="yoon-strip" lang="ja">'+items.map(k=>'<span>'+esc(k.kana)+'</span>').join('')+'</div>';}
function welcome(){
 frame('<p class="kicker">Unit 17 · Contracted yōon</p><h1>Read N, H, M and R yōon</h1>'
 +'<p class="lead">Small ゃ, ゅ and ょ attach to に, ひ, み or り to form one mora: にゃ (nya), not にや (niya). Long vowels still add a mora: りょう is りょ・う.</p>'
 +'<div class="teaching-note"><span class="mini-label">Stage A · N and H · 18 original prompts</span>'
 +kanaStrip(KANA.slice(0,6))
 +'Learn six written sounds and useful words such as にゅうがく (school entry) and ひゃく (100). Compare ひょう (chart) with ひよう (expenses).</div>'
 +'<div class="teaching-note"><span class="mini-label">Stage B · M and R · 21 original prompts</span>'
 +kanaStrip(KANA.slice(6))
 +'Learn six further sounds plus みょうじ (surname), りゅう (dragon), りょうり (cooking) and practical expressions.</div>'
 +'<div class="teaching-note"><span class="mini-label">Realistic vocabulary, not forced examples</span>'
 +'にょ, ひゅ and みゅ are taught in character-reading exercises; no fabricated everyday hiragana words are attached to them. Spell long vowels fully (nyuu, hyou, myou, ryuu, ryou). Readings use Hepburn-style romaji.</div>'
 +'<p class="status">39 first attempts, a resumable checkpoint and separate corrections. Text-only tasks cannot verify listening, pronunciation or spoken timing. No unapproved audio is included.</p>',
 button('start',state.index?'Resume Unit 17':'Start Unit 17')+link('./yoon-kshch.html','Back to Unit 16')+button('export','Export Unit 17 progress',true));
}
function checkpoint(){
 const score=summary(state);
 frame('<p class="kicker">Stage A complete · progress saved</p><h1>Yōon checkpoint</h1>'
 +'<p class="lead">All 18 N/H first-attempt records are saved. Resume safely or continue to M/R. Corrections remain separate and happen after all 39 prompts.</p>'
 +kanaStrip(KANA.slice(0,6))
 +'<div class="yoon-checkpoint"><strong>'+score.stageNH+' / 18</strong><span>Independent first answers correct</span></div>'
 +'<div class="teaching-note"><span class="mini-label">Coming next</span>みゃ mya · みゅ myu · みょ myo · りゃ rya · りゅ ryu · りょ ryo. Remember that small ゃ/ゅ/ょ form one contracted mora.</div>',
 button('checkpoint','Continue to Stage B · M/R')+button('pause','Exit and resume later',true)+link('./yoon-kshch.html','Back to Unit 16'));
}
function results(){
 const score=summary(state);
 frame('<p class="kicker">Unit 17 · First-attempt evidence</p><h1>N/H/M/R yōon completed</h1>'
 +'<p class="lead">You practiced 12 contracted sounds, nine genuine words, four written meaning/mora contrasts and two expressions. Corrected responses do not replace independent first attempts. This is not a listening or retention assessment.</p>'
 +'<div class="metrics">'+MODES.map(m=>'<div class="metric"><strong>'+score[m.id].independentCorrect+' / '+m.total+'</strong><span>'+esc(m.label)+' · independent first answers</span></div>').join('')+'</div>'
 +'<div class="teaching-note"><span class="mini-label">Correction evidence</span>'+score.corrected+' / '+score.correctionCount+' corrected independently. Original first-attempt records are unchanged.</div>'
 +'<p class="status">Japanese-language and audio-rights review remains unapproved.</p>',
 link('./yoon-kshch.html','Return to Unit 16')+button('export','Export Unit 17 progress',true));
}
function taskView(){
 const task=taskAt(state);
 if(!task){frame('<h1>Unable to open the task</h1><p>Export your current state for recovery.</p>',button('export','Export Unit 17 progress'));return;}
 const teaching=task.mode==='introduction'&&!task.correction&&!state.checking&&!state.feedback;
 const titles={introduction:'Meet '+task.kana,recognition:'Choose the reading',word:'Read the word',contrast:'Form, meaning and mora',phrase:'Read the expression'};
 const heading=titles[task.mode];
 const serial=TASKS.filter(x=>x.mode===task.mode&&x.stage===task.stage).findIndex(x=>x.id===task.id)+1;
 const count=TASKS.filter(x=>x.mode===task.mode&&x.stage===task.stage).length;
 const caption=task.correction?'Correction practice · first attempt retained':stageName(task)+' · '+task.mode+' '+serial+' / '+count;
 const prompt=teaching?'Study the contracted combination, its one-mora reading and the small kana. Then hide the reading and recall.':
  task.mode==='recognition'?'Choose the correct spoken reading for the character.':
  task.mode==='word'?'Type the romaji reading of this genuine Japanese word. Its meaning appears after your answer.':
  task.mode==='contrast'?'Choose the written answer matching the meaning or mora-count question, not an unapproved sound sample.':
  task.mode==='phrase'?'Read the expression in kana-faithful romaji. The particle を sounds o. Keep long vowels.':
  'Type the spoken reading from memory.';
 let interaction='';
 if(teaching){
  interaction='<div class="teaching-note"><span class="mini-label">Sound and shape</span>'+esc(task.note)+'</div>';
 }else if(!state.feedback){
  if(task.choices){
   interaction='<div class="choices yoon-choices '+(task.mode==='contrast'?'letter-choices':'')+'">'
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
   +(f.correct===false?'<small>Your answer: '+esc(f.submitted)+'. Compare kana size, meaning and mora timing.</small>':'')
   +(task.meaning?'<small>Meaning: '+esc(task.meaning)+'</small>':'')
   +(task.kanji?'<small>Common writing: '+esc(task.kanji)+'</small>':'')
   +(task.note?'<small>'+esc(task.note)+'</small>':'')
   +(task.correction?'<small>Correction practice cannot replace the original first answer.</small>':'')+'</div>';
 }
 const glyph=task.mode==='contrast'
  ?'<div class="teaching-note"><span class="mini-label">Meaning and mora contrast</span>'+esc(task.kana)+'</div>'
  :'<div class="glyph-panel yoon-review-glyph"><span class="'+((task.mode==='introduction'||task.mode==='recognition')?'hero-glyph':'japanese-word')+'" lang="ja">'+esc(task.kana)+'</span>'
  +(teaching?'<span class="roman">'+esc(task.answer)+'</span>':'')+'</div>';
 const actions=teaching?button('recall','Try recalling '+task.kana):
   state.feedback?button('next',state.index===TASKS.length-1?'Continue to correction or results':'Continue'):'';
 frame('<section class="practice-screen"><p class="kicker">'+esc(caption)+'</p><h1>'+esc(heading)+'</h1>'
  +'<p class="lead">'+esc(prompt)+'</p>'+glyph+interaction+'</section>',actions);
 if(state.feedback)root.querySelector('[role="status"].feedback')?.focus({preventScroll:true});
}
function render(){if(state.paused)welcome();else if(state.finished)results();else if(atCheckpoint(state))checkpoint();else taskView();}
function exportProgress(){
 const blob=new Blob([JSON.stringify({prototype:true,unit:'yoon-nhmr',exportedAt:new Date().toISOString(),state},null,2)],{type:'application/json'});
 const url=URL.createObjectURL(blob),node=document.createElement('a');
 node.href=url;node.download='kana-foundations-unit17.json';
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
