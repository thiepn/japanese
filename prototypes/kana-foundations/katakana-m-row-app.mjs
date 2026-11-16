// Unit 26 presentation reuses the Kana Foundations visual system without changing older lessons.
import {STORAGE_KEY,KANA,WORDS,TASKS,MODES,CHECKPOINT_INDEX,initialState,validState,taskAt,atCheckpoint,resume,pause,acknowledgeCheckpoint,beginRecall,answer,reveal,advance,summary} from './katakana-m-row-engine.mjs';

const root=document.getElementById('app');
let state=initialState(),lastRaw=null,writeAllowed=true,warning='',inputWarning='';
try{
 lastRaw=localStorage.getItem(STORAGE_KEY);
 if(lastRaw){
  const parsed=JSON.parse(lastRaw);
  if(!validState(parsed))throw Error('Invalid saved Unit 26 data');
  state=parsed;
 }
}catch{
 writeAllowed=false;
 warning='Saved Unit 26 progress is invalid or unavailable. The original data will not be overwritten. This session runs in memory; export it before leaving.';
}
const esc=x=>String(x??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
const button=(act,label,secondary=false)=>'<button type="button" class="'+(secondary?'secondary':'primary')+'" data-action="'+act+'">'+esc(label)+'</button>';
const link=(href,label)=>'<a class="secondary unit-link" href="'+href+'">'+esc(label)+'</a>';
const stageName=t=>t.stage==='a'?'Learn M-row forms':t.stage==='b'?'Read and compare words':'Practice';
function commit(next){
 if(next===state)return;
 if(writeAllowed){
  try{
   if(localStorage.getItem(STORAGE_KEY)!==lastRaw){
    writeAllowed=false;
    warning='Another tab changed Unit 26. Reload to see its saved progress; this tab will not overwrite it.';
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
 root.innerHTML='<div class="shell"><header class="topbar"><div class="brand"><div class="brand-mark" lang="ja">マ</div><div><h2>Kana Foundations</h2>'
 +'<p class="eyebrow">UNIT 26 · KATAKANA M-ROW</p></div></div>'
 +(active?'<button class="top-exit" data-action="pause" aria-label="Exit lesson; progress is saved">Exit</button>':'<a class="top-course-map-link" href="./course-map.html">All units</a>')+'</header>'
 +(active?'<div class="progress-track" aria-hidden="true"><div class="progress-bar" style="width:'+Math.round(progress/TASKS.length*100)+'%"></div></div>'
  +'<div class="progress-caption"><span>'+(state.index>=TASKS.length?'Correction practice':atCheckpoint(state)?'Stage A checkpoint':state.index<CHECKPOINT_INDEX?'Stage A · M-row foundations':'Stage B · Independent word reading')+'</span><span>'+progress+' / '+TASKS.length+' first prompts</span></div>':'')
 +'<main id="main" tabindex="-1">'+(warning?'<div class="warning" role="alert">'+esc(warning)+'</div>':'')+body+'</main>'
 +'<footer class="action-area">'+actions+'</footer>'
 +'<p class="footer-note">Isolated prototype · No Account, FSRS or production progress changes</p></div>';
 const field=root.querySelector('#answer');
 if(field)field.focus({preventScroll:true});
 else root.querySelector('#main')?.focus({preventScroll:true});
}
function welcome(){
 frame('<p class="kicker">Unit 26 · Katakana M-row</p><h1>Learn マ・ミ・ム・メ・モ</h1>'
 +'<p class="lead">Add the five M-row katakana to vowels and K, S, T, N and H rows: マ ma · ミ mi · ム mu · メ me · モ mo. They correspond to the hiragana ま・み・む・め・も. These are straightforward ma/mi/mu/me/mo sounds, with no new special romanization rule.</p>'
 +'<div class="teaching-note"><span class="mini-label">Stage A · 15 original first attempts</span>'
 +'<div class="katakana-pairs" lang="ja">'+KANA.map(k=>'<span>'+esc(k.kana)+'<small>↔ '+esc(k.base)+'</small></span>').join('')+'</div>'
 +'Hide and recall all five new forms, recognize each reading, and read マメ (beans), ミミ (ear), and ムシ (insect). Finish with two katakana/hiragana distinctions.</div>'
 +'<div class="teaching-note"><span class="mini-label">Stage B · 16 original first attempts</span>'
 +'Read メモ (memo), モモ (peach), マスク (face mask), ママ (mom), マウス (computer mouse), モチ (rice cake), and ムネ (chicken breast cut). Then answer five hiragana matches and four contextual meaning contrasts.</div>'
 +'<div class="teaching-note"><span class="mini-label">Accurate Japanese usage</span>'
 +'メモ, マスク, ママ and マウス are everyday katakana loanwords. Some Japanese-native words are presented in katakana for decoding, although kanji or hiragana are more common in normal prose. モモ means peach in a fruit shop but may mean chicken thigh in a poultry shop; ムネ means the breast meat cut in a poultry context.</div>'
 +'<p class="status">All ten assessed words use only the 35 katakana taught through Unit 26. Your independent first attempts and any corrections remain separate, with an explicit checkpoint after 15. No Account, FSRS or canonical progress changes.</p>',
 button('start',state.index?'Resume Unit 26':'Start Unit 26')+link('./katakana-h-row.html','Back to Unit 25')+button('export','Export Unit 26 progress',true));
}
function checkpoint(){
 const score=summary(state);
 frame('<p class="kicker">Stage A complete · saved</p><h1>Katakana M-row checkpoint</h1>'
 +'<p class="lead">The first 15 independent responses are preserved. Continue to seven fully decodable words and nine hiragana or word-meaning contrasts, or exit and resume later without losing your first attempts.</p>'
 +'<div class="yoon-checkpoint"><strong>'+score.stageA+' / 15</strong><span>Stage A independent first answers correct</span></div>'
 +'<div class="teaching-note"><span class="mini-label">Stage B</span>メモ · モモ · マスク · ママ · マウス · モチ · ムネ, then script and contextual vocabulary contrasts.</div>',
 button('checkpoint','Continue to Stage B · Words')+button('pause','Exit and resume later',true)+link('./katakana-h-row.html','Back to Unit 25'));
}
function results(){
 const score=summary(state);
 frame('<p class="kicker">Unit 26 · Independent first-attempt evidence</p><h1>Katakana M-row completed</h1>'
 +'<p class="lead">You practiced five M-row characters, ten authentic fully decodable words, hiragana script matching and contextual vocabulary distinctions. The independent first answers are retained apart from correction practice.</p>'
 +'<div class="metrics">'+MODES.map(m=>'<div class="metric"><strong>'+score[m.id].independentCorrect+' / '+m.total+'</strong><span>'+esc(m.label)+' · independent first answers</span></div>').join('')+'</div>'
 +'<div class="teaching-note"><span class="mini-label">Correction evidence</span>'+score.corrected+' / '+score.correctionCount+' corrected independently. The first-response records are not replaced.</div>'
 +'<p class="status">Written decoding evidence does not establish pronunciation, listening comprehension, delayed retention or human Japanese editorial acceptance.</p>',
 link('./katakana-y-row.html','Continue to Unit 27 · Y-row')+link('./katakana-h-row.html','Return to Unit 25')+button('export','Export Unit 26 progress',true));
}
function taskView(){
 const task=taskAt(state);
 if(!task){frame('<h1>Unable to open the task</h1><p>Export your current state for recovery.</p>',button('export','Export Unit 26 progress'));return;}
 const teaching=task.mode==='introduction'&&!task.correction&&!state.checking&&!state.feedback;
 const titles={introduction:'Meet '+task.kana,recognition:'Choose the M-row reading',word:'Read the authentic word',contrast:'Match the script or meaning'};
 const heading=titles[task.mode];
 const serial=TASKS.filter(x=>x.mode===task.mode&&x.stage===task.stage).findIndex(x=>x.id===task.id)+1;
 const count=TASKS.filter(x=>x.mode===task.mode&&x.stage===task.stage).length;
 const caption=task.correction?'Correction practice · first attempt retained':stageName(task)+' · '+task.mode+' '+serial+' / '+count;
 const prompt=teaching?'Study the M-row katakana and its matching hiragana. Hide the sound before recalling it from memory.':
  task.mode==='recognition'?'Choose the correct M-row reading, using the familiar ma/mi/mu/me/mo sounds.':
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
   +(f.correct===false?'<small>Your answer: '+esc(f.submitted)+'. Compare the script, sound or context-dependent word meaning shown in the prompt.</small>':'')
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
 const blob=new Blob([JSON.stringify({prototype:true,unit:'katakana-m-row',exportedAt:new Date().toISOString(),state},null,2)],{type:'application/json'});
 const url=URL.createObjectURL(blob),node=document.createElement('a');
 node.href=url;node.download='kana-foundations-unit26.json';
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
