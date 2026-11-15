// Unit 27 presentation reuses the Kana Foundations visual system without changing older lessons.
import {STORAGE_KEY,KANA,WORDS,TASKS,MODES,CHECKPOINT_INDEX,initialState,validState,taskAt,atCheckpoint,resume,pause,acknowledgeCheckpoint,beginRecall,answer,reveal,advance,summary} from './katakana-y-row-engine.mjs';

const root=document.getElementById('app');
let state=initialState(),lastRaw=null,writeAllowed=true,warning='',inputWarning='';
try{
 lastRaw=localStorage.getItem(STORAGE_KEY);
 if(lastRaw){
  const parsed=JSON.parse(lastRaw);
  if(!validState(parsed))throw Error('Invalid saved Unit 27 data');
  state=parsed;
 }
}catch{
 writeAllowed=false;
 warning='Saved Unit 27 progress is invalid or unavailable. The original data will not be overwritten. This session runs in memory; export it before leaving.';
}
const esc=x=>String(x??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
const button=(act,label,secondary=false)=>'<button type="button" class="'+(secondary?'secondary':'primary')+'" data-action="'+act+'">'+esc(label)+'</button>';
const link=(href,label)=>'<a class="secondary unit-link" href="'+href+'">'+esc(label)+'</a>';
const stageName=t=>t.stage==='a'?'Learn Y-row forms':t.stage==='b'?'Read and compare words':'Practice';
function commit(next){
 if(next===state)return;
 if(writeAllowed){
  try{
   if(localStorage.getItem(STORAGE_KEY)!==lastRaw){
    writeAllowed=false;
    warning='Another tab changed Unit 27. Reload to see its saved progress; this tab will not overwrite it.';
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
 root.innerHTML='<div class="shell"><header class="topbar"><div class="brand"><div class="brand-mark" lang="ja">ヤ</div><div><h2>Kana Foundations</h2>'
 +'<p class="eyebrow">UNIT 27 · KATAKANA Y-ROW</p></div></div>'
 +(active?'<button class="top-exit" data-action="pause" aria-label="Exit lesson; progress is saved">Exit</button>':'')+'</header>'
 +(active?'<div class="progress-track" aria-hidden="true"><div class="progress-bar" style="width:'+Math.round(progress/TASKS.length*100)+'%"></div></div>'
  +'<div class="progress-caption"><span>'+(state.index>=TASKS.length?'Correction practice':atCheckpoint(state)?'Stage A checkpoint':state.index<CHECKPOINT_INDEX?'Stage A · Y-row foundations':'Stage B · Independent word reading')+'</span><span>'+progress+' / '+TASKS.length+' first prompts</span></div>':'')
 +'<main id="main" tabindex="-1">'+(warning?'<div class="warning" role="alert">'+esc(warning)+'</div>':'')+body+'</main>'
 +'<footer class="action-area">'+actions+'</footer>'
 +'<p class="footer-note">Isolated prototype · No Account, FSRS or production progress changes</p></div>';
 const field=root.querySelector('#answer');
 if(field)field.focus({preventScroll:true});
 else root.querySelector('#main')?.focus({preventScroll:true});
}
function welcome(){
 frame('<p class="kicker">Unit 27 · Katakana Y-row</p><h1>Learn ヤ・ユ・ヨ</h1>'
 +'<p class="lead">The modern basic Y-row has exactly three characters: ヤ ya · ユ yu · ヨ yo. They match hiragana や・ゆ・よ. There are no basic yi or ye slots. Small ャ・ュ・ョ make different combined sounds and are not introduced here.</p>'
 +'<div class="teaching-note"><span class="mini-label">Stage A · 11 independent first attempts</span>'
 +'<div class="katakana-pairs" lang="ja">'+KANA.map(k=>'<span>'+esc(k.kana)+'<small>↔ '+esc(k.base)+'</small></span>').join('')+'</div>'
 +'Learn and actively recall the three forms, recognize their readings, read ヤマ (mountain), ユキ (snow), and ヨコ (side), and distinguish katakana from hiragana in two questions.</div>'
 +'<div class="teaching-note"><span class="mini-label">Stage B · 11 independent first attempts</span>'
 +'Read ユカタ (summer robe), ヤキイモ (roasted sweet potato), ヤマイモ (Japanese yam), ヤサイ (vegetables) and ヤネ (roof). Practice three script matches and three meaning distinctions.</div>'
 +'<div class="teaching-note"><span class="mini-label">Writing and decoding scope</span>'
 +'All eight words are genuine Japanese expressions. ヤマ, ユキ, ヨコ, ヤサイ and ヤネ are normally written in kanji or hiragana, not katakana; their spelling here is intentional reading practice. ヤキイモ and ヤマイモ are different foods, not alternate spellings. We use only the 38 basic katakana taught through this unit, without small kana, ー, ッ or ン.</div>'
 +'<p class="status">22 independent first responses, a saved checkpoint after 11 and separately preserved correction evidence. No Account, FSRS, audio or production progress writes.</p>',
 button('start',state.index?'Resume Unit 27':'Start Unit 27')+link('./katakana-m-row.html','Back to Unit 26')+button('export','Export Unit 27 progress',true));
}
function checkpoint(){
 const score=summary(state);
 frame('<p class="kicker">Stage A complete · saved</p><h1>Katakana Y-row checkpoint</h1>'
 +'<p class="lead">The first 11 independent attempts are preserved. Continue to five fully decodable words, three hiragana matches and three contextual meaning contrasts, or exit and resume later without losing the original answers.</p>'
 +'<div class="yoon-checkpoint"><strong>'+score.stageA+' / 11</strong><span>Independent Stage A first answers correct</span></div>'
 +'<div class="teaching-note"><span class="mini-label">Stage B</span>ユカタ · ヤキイモ · ヤマイモ · ヤサイ · ヤネ, followed by script and meaning distinctions.</div>',
 button('checkpoint','Continue to Stage B · Words')+button('pause','Exit and resume later',true)+link('./katakana-m-row.html','Back to Unit 26'));
}
function results(){
 const score=summary(state);
 frame('<p class="kicker">Unit 27 · Original first-attempt evidence</p><h1>Katakana Y-row completed</h1>'
 +'<p class="lead">You practiced the three standard Y-row forms, eight fully readable Japanese words, three hiragana correspondences and contextual meaning distinctions. Original responses remain separate from corrections.</p>'
 +'<div class="metrics">'+MODES.map(m=>'<div class="metric"><strong>'+score[m.id].independentCorrect+' / '+m.total+'</strong><span>'+esc(m.label)+' · independent first attempts</span></div>').join('')+'</div>'
 +'<div class="teaching-note"><span class="mini-label">Correction evidence</span>'+score.corrected+' / '+score.correctionCount+' corrected independently; first responses were not overwritten.</div>'
 +'<p class="status">This written decoding lesson is not evidence of spoken proficiency, listening, delayed retention or human Japanese-language acceptance.</p>',
 link('./katakana-m-row.html','Return to Unit 26')+button('export','Export Unit 27 progress',true));
}
function taskView(){
 const task=taskAt(state);
 if(!task){frame('<h1>Unable to open the task</h1><p>Export your current state for recovery.</p>',button('export','Export Unit 27 progress'));return;}
 const teaching=task.mode==='introduction'&&!task.correction&&!state.checking&&!state.feedback;
 const titles={introduction:'Meet '+task.kana,recognition:'Choose the Y-row reading',word:'Read the authentic word',contrast:'Match the script or meaning'};
 const heading=titles[task.mode];
 const serial=TASKS.filter(x=>x.mode===task.mode&&x.stage===task.stage).findIndex(x=>x.id===task.id)+1;
 const count=TASKS.filter(x=>x.mode===task.mode&&x.stage===task.stage).length;
 const caption=task.correction?'Correction practice · first attempt retained':stageName(task)+' · '+task.mode+' '+serial+' / '+count;
 const prompt=teaching?'Study one of three full-size Y-row katakana and its matching hiragana. Hide the reading and recall from memory; small ャ・ュ・ョ are different future forms.':
  task.mode==='recognition'?'Choose one of the three full-size Y-row readings: ya, yu or yo.':
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
 const blob=new Blob([JSON.stringify({prototype:true,unit:'katakana-y-row',exportedAt:new Date().toISOString(),state},null,2)],{type:'application/json'});
 const url=URL.createObjectURL(blob),node=document.createElement('a');
 node.href=url;node.download='kana-foundations-unit27.json';
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
