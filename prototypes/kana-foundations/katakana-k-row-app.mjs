// Unit 21 presentation reuses the Kana Foundations visual system without changing older lessons.
import {STORAGE_KEY,KANA,WORDS,TASKS,MODES,CHECKPOINT_INDEX,initialState,validState,taskAt,atCheckpoint,resume,pause,acknowledgeCheckpoint,beginRecall,answer,reveal,advance,summary} from './katakana-k-row-engine.mjs';

const root=document.getElementById('app');
let state=initialState(),lastRaw=null,writeAllowed=true,warning='',inputWarning='';
try{
 lastRaw=localStorage.getItem(STORAGE_KEY);
 if(lastRaw){
  const parsed=JSON.parse(lastRaw);
  if(!validState(parsed))throw Error('Invalid saved Unit 21 data');
  state=parsed;
 }
}catch{
 writeAllowed=false;
 warning='Saved Unit 21 progress is invalid or unavailable. The original data will not be overwritten. This session runs in memory; export it before leaving.';
}
const esc=x=>String(x??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
const button=(act,label,secondary=false)=>'<button type="button" class="'+(secondary?'secondary':'primary')+'" data-action="'+act+'">'+esc(label)+'</button>';
const link=(href,label)=>'<a class="secondary unit-link" href="'+href+'">'+esc(label)+'</a>';
const stageName=t=>t.stage==='a'?'Learn K-row forms':t.stage==='b'?'Read and compare words':'Practice';
function commit(next){
 if(next===state)return;
 if(writeAllowed){
  try{
   if(localStorage.getItem(STORAGE_KEY)!==lastRaw){
    writeAllowed=false;
    warning='Another tab changed Unit 21. Reload to see its saved progress; this tab will not overwrite it.';
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
 root.innerHTML='<div class="shell"><header class="topbar"><div class="brand"><div class="brand-mark" lang="ja">カ</div><div><h2>Kana Foundations</h2>'
 +'<p class="eyebrow">UNIT 21 · KATAKANA K-ROW</p></div></div>'
 +(active?'<button class="top-exit" data-action="pause" aria-label="Exit lesson; progress is saved">Exit</button>':'')+'</header>'
 +(active?'<div class="progress-track" aria-hidden="true"><div class="progress-bar" style="width:'+Math.round(progress/TASKS.length*100)+'%"></div></div>'
  +'<div class="progress-caption"><span>'+(state.index>=TASKS.length?'Correction practice':atCheckpoint(state)?'Stage A checkpoint':state.index<CHECKPOINT_INDEX?'Stage A · K-row foundations':'Stage B · Independent word reading')+'</span><span>'+progress+' / '+TASKS.length+' first prompts</span></div>':'')
 +'<main id="main" tabindex="-1">'+(warning?'<div class="warning" role="alert">'+esc(warning)+'</div>':'')+body+'</main>'
 +'<footer class="action-area">'+actions+'</footer>'
 +'<p class="footer-note">Isolated prototype · No Account, FSRS or production progress changes</p></div>';
 const field=root.querySelector('#answer');
 if(field)field.focus({preventScroll:true});
 else root.querySelector('#main')?.focus({preventScroll:true});
}
function welcome(){
 frame('<p class="kicker">Unit 21 · Katakana K-row</p><h1>Learn カ・キ・ク・ケ・コ</h1>'
 +'<p class="lead">Your five katakana vowels are already familiar. Now add the K-row: カ ka, キ ki, ク ku, ケ ke, コ ko. Their sounds correspond directly to hiragana か・き・く・け・こ, but the written forms are different.</p>'
 +'<div class="teaching-note"><span class="mini-label">Stage A · 15 first attempts</span>'
 +'<div class="katakana-pairs" lang="ja">'+KANA.map(k=>'<span>'+esc(k.kana)+'<small>↔ '+esc(k.base)+'</small></span>').join('')+'</div>'
 +'Study and recall the five characters, recognize their readings, decode カキ (oyster), キク (chrysanthemum), コケ (moss), and distinguish katakana from hiragana.</div>'
 +'<div class="teaching-note"><span class="mini-label">Stage B · 12 first attempts</span>'
 +'Read four real loanwords: キウイ (kiwifruit), ココア (cocoa), カカオ (cacao), エコ (eco). Then check K-row script transfer and three vocabulary meaning contrasts.</div>'
 +'<div class="teaching-note"><span class="mini-label">Vocabulary precision</span>'
 +'Every assessed word uses only the vowel kana of Unit 20 and this K-row. Nature terms may be written with kanji or hiragana in other contexts. カキ specifically means oyster in the seafood context; persimmon shares the reading kaki.</div>'
 +'<p class="status">27 independent first attempts, a resumable checkpoint after 15, and separately saved corrections. Text reading only; no certified audio or canonical learning-status writes.</p>',
 button('start',state.index?'Resume Unit 21':'Start Unit 21')+link('./katakana-vowels.html','Back to Unit 20')+button('export','Export Unit 21 progress',true));
}
function checkpoint(){
 const score=summary(state);
 frame('<p class="kicker">Stage A complete · saved</p><h1>Katakana K-row checkpoint</h1>'
 +'<p class="lead">Your first 15 independent answers are preserved. Continue into four fully decodable loanwords and eight script/meaning contrasts, or exit and resume without losing evidence.</p>'
 +'<div class="yoon-checkpoint"><strong>'+score.stageA+' / 15</strong><span>Independent Stage A first answers correct</span></div>'
 +'<div class="teaching-note"><span class="mini-label">Coming next</span>キウイ · ココア · カカオ · エコ. Contrast カカオ with ココア and map each K-row katakana back to hiragana.</div>',
 button('checkpoint','Continue to Stage B · Words')+button('pause','Exit and resume later',true)+link('./katakana-vowels.html','Back to Unit 20'));
}
function results(){
 const score=summary(state);
 frame('<p class="kicker">Unit 21 · First-attempt evidence</p><h1>Katakana K-row completed</h1>'
 +'<p class="lead">You practiced five new K-row glyphs and read seven authentic words using only previously taught katakana. Vocabulary meaning checks, original attempts and corrections are recorded separately.</p>'
 +'<div class="metrics">'+MODES.map(m=>'<div class="metric"><strong>'+score[m.id].independentCorrect+' / '+m.total+'</strong><span>'+esc(m.label)+' · independent first answers</span></div>').join('')+'</div>'
 +'<div class="teaching-note"><span class="mini-label">Correction evidence</span>'+score.corrected+' / '+score.correctionCount+' independently corrected. Original first attempts remain unchanged.</div>'
 +'<p class="status">Written decoding is not spoken fluency, listening comprehension or delayed retention; independent human review remains pending.</p>',
 link('./katakana-s-row.html','Continue to Unit 22 · S-row')+link('./katakana-vowels.html','Return to Unit 20')+button('export','Export Unit 21 progress',true));
}
function taskView(){
 const task=taskAt(state);
 if(!task){frame('<h1>Unable to open the task</h1><p>Export your current state for recovery.</p>',button('export','Export Unit 21 progress'));return;}
 const teaching=task.mode==='introduction'&&!task.correction&&!state.checking&&!state.feedback;
 const titles={introduction:'Meet '+task.kana,recognition:'Choose the K-row reading',word:'Read the authentic word',contrast:'Match the script or meaning'};
 const heading=titles[task.mode];
 const serial=TASKS.filter(x=>x.mode===task.mode&&x.stage===task.stage).findIndex(x=>x.id===task.id)+1;
 const count=TASKS.filter(x=>x.mode===task.mode&&x.stage===task.stage).length;
 const caption=task.correction?'Correction practice · first attempt retained':stageName(task)+' · '+task.mode+' '+serial+' / '+count;
 const prompt=teaching?'Study this katakana K-row glyph and corresponding hiragana sound. Then hide the reading and recall.':
  task.mode==='recognition'?'Choose the correct K-row reading of the katakana.':
  task.mode==='word'?'Read the entire authentic word in romaji. Every katakana character has been introduced. Its meaning appears after your answer.':
  task.mode==='contrast'?'Choose the requested script counterpart or genuine word. Compare meanings only when asked.':
  task.mode==='phrase'?'Read this sentence in kana-faithful romaji. は as a topic particle sounds wa; を sounds o. Keep long vowels and consonant doubling.':
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
   +(f.correct===false?'<small>Your answer: '+esc(f.submitted)+'. Compare the script, sound, or vocabulary meaning shown in the prompt.</small>':'')
   +(task.meaning?'<small>Meaning: '+esc(task.meaning)+'</small>':'')
   +(task.kanji?'<small>Common writing: '+esc(task.kanji)+'</small>':'')
   +(task.note?'<small>'+esc(task.note)+'</small>':'')
   +(task.correction?'<small>Correction practice cannot replace the original first answer.</small>':'')+'</div>';
 }
 const glyph=task.mode==='contrast'
  ?'<div class="teaching-note"><span class="mini-label">Script and vocabulary contrast</span>'+esc(task.kana)+'</div>'
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
 const blob=new Blob([JSON.stringify({prototype:true,unit:'katakana-k-row',exportedAt:new Date().toISOString(),state},null,2)],{type:'application/json'});
 const url=URL.createObjectURL(blob),node=document.createElement('a');
 node.href=url;node.download='kana-foundations-unit21.json';
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
