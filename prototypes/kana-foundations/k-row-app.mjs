// Shared Units 02–05 presentation; each unit keeps its own engine and storage key.
const rowCode=document.documentElement.dataset.kanaRow;
const isSRow=rowCode==='s',isTRow=rowCode==='t',isNRow=rowCode==='n';
const unit=isNRow
 ?{number:'05',previous:'04',previousPage:'./t-row.html',nextPage:null,nextLabel:null,row:'N',slug:'n-row'}
 :isTRow
 ?{number:'04',previous:'03',previousPage:'./s-row.html',nextPage:'./n-row.html',nextLabel:'Continue to Unit 05 · なにぬねの',row:'T',slug:'t-row'}
 :isSRow
 ?{number:'03',previous:'02',previousPage:'./k-row.html',nextPage:'./t-row.html',nextLabel:'Continue to Unit 04 · たちつてと',row:'S',slug:'s-row'}
 :{number:'02',previous:'01',previousPage:'./index.html',nextPage:'./s-row.html',nextLabel:'Continue to Unit 03 · さしすせそ',row:'K',slug:'k-row'};
const {STORAGE_KEY,KANA,TASKS,WORDS,initialState,validState,taskAt,resume,pause,beginRecall,answer,reveal,advance,summary}
 =await import(isNRow?'./n-row-engine.mjs':isTRow?'./t-row-engine.mjs':isSRow?'./s-row-engine.mjs':'./k-row-engine.mjs');
const root=document.getElementById('app');
let state=initialState(),lastRaw=null,writeAllowed=true,warning='',inputWarning='';
try{
 lastRaw=localStorage.getItem(STORAGE_KEY);
 if(lastRaw){const parsed=JSON.parse(lastRaw);if(!validState(parsed))throw Error('Saved Unit '+unit.number+' data is invalid');state=parsed;}
}catch{
 writeAllowed=false;warning='Saved Unit '+unit.number+' progress is invalid or unavailable. It will not be overwritten. This session runs in memory and can be exported.';
}
const esc=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
function commit(next){
 if(next===state)return;
 if(writeAllowed){
  try{
   if(localStorage.getItem(STORAGE_KEY)!==lastRaw){
    writeAllowed=false;warning='Another tab changed this unit. Reload to see the latest saved progress; this tab will not overwrite it.';
    render();return;
   }
   const raw=JSON.stringify(next);localStorage.setItem(STORAGE_KEY,raw);lastRaw=raw;
  }catch{writeAllowed=false;warning='Browser storage failed. Your current session is in memory; export it before leaving.';}
 }
 state=next;inputWarning='';render();
}
function button(action,label,secondary=false){return '<button type="button" data-action="'+action+'" class="'+(secondary?'secondary':'primary')+'">'+esc(label)+'</button>';}
function link(url,label){return '<a class="secondary unit-link" href="'+url+'">'+esc(label)+'</a>';}
function wrap(body,actions=''){
 const done=state.finished;
 const progress=Math.min(15,state.index);
 const active=!state.paused&&!done;
 root.innerHTML='<div class="shell"><header class="topbar"><div class="brand"><div class="brand-mark" lang="ja">'+esc(KANA[0].kana)+'</div><div>'
  +'<h2>Kana Foundations</h2><p class="eyebrow">UNIT '+unit.number+' · '+unit.row+'-ROW</p></div></div>'
  +(active?'<button class="top-exit" data-action="pause" aria-label="Exit lesson; progress is saved">Exit</button>':'')+'</header>'
  +(active?'<div class="progress-track" aria-hidden="true"><div class="progress-bar" style="width:'+Math.round(progress/15*100)+'%"></div></div>'
   +'<div class="progress-caption"><span>'+(state.index>=15?'Correction practice':'New characters and words')+'</span><span>'+progress+' / 15 first prompts</span></div>':'')
  +'<main id="main" tabindex="-1">'+(warning?'<div role="alert" class="warning">'+esc(warning)+'</div>':'')+body+'</main>'
  +'<footer class="action-area">'+actions+'</footer>'
  +'<p class="footer-note">Isolated prototype · No Account, FSRS or production progress changes</p></div>';
 const input=root.querySelector('#answer');
 if(input)input.focus({preventScroll:true});
 else root.querySelector('#main')?.focus({preventScroll:true});
}
function welcome(){
 const kanaList=KANA.map(k=>k.kana).join('・');
 const wordList=WORDS.map(w=>w.kana).join('、');
 const description=isNRow
  ?'Learn the five N-row kana な・に・ぬ・ね・の. Listen to the sounds in your mind, distinguish the looped ぬ from the simpler の, then read five familiar Japanese words.'
  :isTRow
  ?'Use the vowels, K-row, and S-row you know to learn た・ち・つ・て・と. Watch for ち = chi and つ = tsu. Build confidence by decoding five everyday words.'
  :isSRow
  ?'Build on the vowels and K-row from Units 01–02. Learn five S-row characters and the special reading し = shi, then read real words.'
  :'Build on the five vowels from Unit 01. Learn five new characters, recall their readings, and decode five real Japanese words.';
 wrap('<p class="kicker">Unit '+unit.number+' · Hiragana</p><h1>Learn '+esc(kanaList)+'</h1>'
   +'<p class="lead">'+esc(description)+'</p>'
   +'<div class="vowel-strip" lang="ja">'+KANA.map(k=>'<span>'+k.kana+'</span>').join('')+'</div>'
   +'<div class="teaching-note"><span class="mini-label">What you will do</span>'
   +'See each character with its reading, recall it without the answer, recognize all five, then read '
   +esc(wordList)+'. Incorrect or revealed first answers return once as correction practice.</div>'
   +'<p class="status">Earlier unit progress is preserved separately. This page never writes canonical study events or grades.</p>',
   button('start',state.index>0?'Resume Unit '+unit.number:'Start Unit '+unit.number)
    +link(unit.previousPage,'Back to Unit '+unit.previous));
}
function results(){
 const s=summary(state);
 const metric=(name,v)=>'<div class="metric"><strong>'+v.independentCorrect+' / '+v.total+'</strong><span>'+name+' · independent first answers</span></div>';
 wrap('<p class="kicker">Unit '+unit.number+' · First-attempt evidence</p><h1>Five more hiragana learned</h1>'
 +'<p class="lead">Completion shows today’s practice, not long-term retention or certified mastery.</p>'
 +'<div class="vowel-strip" lang="ja">'+KANA.map(k=>'<span>'+k.kana+'</span>').join('')+'</div>'
 +'<div class="metrics">'+metric('Character recall',s.introduction)+metric('Recognition',s.recognition)+metric('Word decoding',s.decoding)+'</div>'
 +'<div class="teaching-note"><span class="mini-label">Correction round</span>'
 +s.corrected+' of '+s.correctionCount+' correction responses were correct. Original first answers are unchanged.'
 +'<p class="status">Try reading again after a delay to check what you still remember.</p></div>',
 (unit.nextPage?link(unit.nextPage,unit.nextLabel):'')
 +link(unit.previousPage,'Return to Unit '+unit.previous)
 +button('export','Export Unit '+unit.number+' progress',true));
}
function taskView(){
 const t=taskAt(state);if(!t){wrap('<h1>Session unavailable</h1><p>Export your saved data for recovery.</p>',button('export','Export Unit '+unit.number+' progress'));return;}
 const teaching=t.mode==='introduction'&&!state.checking&&!t.correction;
 const heading=t.mode==='introduction'?'Meet '+t.kana:t.mode==='recognition'?'Choose the reading':'Read the word';
 const caption=t.correction?'Correction practice · first attempt retained':
  t.mode==='introduction'?'Character '+(state.index+1)+' of 5':
  t.mode==='recognition'?'Recognition '+(state.index-4)+' of 5':'Word decoding '+(state.index-9)+' of 5';
 const glyph='<div class="glyph-panel"><span class="'+(t.mode==='decoding'?'japanese-word':'hero-glyph')+'" lang="ja">'+esc(t.kana)+'</span>'
  +(teaching?'<span class="roman">'+esc(t.answer)+'</span>':'')+'</div>';
 const lead=teaching?'Look at the shape and sound. When ready, hide the reading and recall it.':
  t.mode==='recognition'?'Choose the reading without using a hint.':
  t.mode==='decoding'?'Read the kana left to right. The meaning appears after you answer.':
  'Type the romaji reading without seeing the answer.';
 let interaction='';
 if(teaching){
  interaction='<div class="teaching-note"><span class="mini-label">Sound pattern</span>'+esc(t.note)+'</div>';
 }else if(!state.feedback){
  if(t.mode==='recognition'){
   interaction='<div class="choices">'+t.options.map(x=>'<button type="button" class="choice" data-action="choice" data-value="'+esc(x)+'" aria-label="Reading '+esc(x)+'">'+esc(x)+'</button>').join('')+'</div>';
  }else{
   interaction='<form id="answer-form"><label class="form-label" for="answer">Type the romaji reading</label>'
    +'<input id="answer" class="answer-input" type="text" inputmode="latin" autocapitalize="off" autocomplete="off" spellcheck="false" maxlength="16" required>'
    +'<button type="submit" class="primary">Check answer</button></form>';
  }
  interaction+='<div class="hint-actions"><button type="button" class="text-button" data-action="reveal">Show answer (no credit)</button></div>';
  if(inputWarning)interaction+='<p role="alert" class="warning">'+esc(inputWarning)+'</p>';
 }else{
  const f=state.feedback;
  interaction='<div class="feedback '+(f.correct===true?'good':f.correct===false?'bad':'neutral')+'" role="status" aria-live="polite" tabindex="-1">'
   +'<strong>'+(f.correct===true?'Correct.':f.correct===false?'Not quite.':'Answer revealed — no independent credit.')+'</strong>'
   +'Correct reading: '+esc(f.answer)
   +(f.correct===false?'<small>Your reading: '+esc(f.submitted)+'. Compare the characters and try again later.</small>':'')
   +(t.mode==='decoding'?'<small>Meaning: '+esc(t.meaning)+' · Common writing: '+esc(t.kanji)+'</small>':'')
   +(t.correction?'<small>This correction does not replace your first attempt.</small>':'')+'</div>';
 }
 const actions=teaching?button('check','Try recalling '+t.kana):
  state.feedback?button('next',state.index===14&&state.corrections.length===0?'See next step':'Continue'):'';
 wrap('<section class="practice-screen"><p class="kicker">'+esc(caption)+'</p><h1>'+esc(heading)+'</h1>'
  +'<p class="lead">'+esc(lead)+'</p>'+glyph+interaction+'</section>',actions);
 if(state.feedback)root.querySelector('[role="status"].feedback')?.focus({preventScroll:true});
}
function render(){if(state.paused)welcome();else if(state.finished)results();else taskView();}
function download(){
 const blob=new Blob([JSON.stringify({prototype:true,unit:unit.slug,exportedAt:new Date().toISOString(),state},null,2)],{type:'application/json'});
 const url=URL.createObjectURL(blob),node=document.createElement('a');node.href=url;node.download='kana-foundations-unit'+unit.number+'.json';
 document.body.append(node);node.click();node.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
root.addEventListener('click',event=>{
 const el=event.target.closest('button[data-action]');if(!el||el.disabled)return;
 switch(el.dataset.action){
  case 'start':commit(resume(state));break;
  case 'pause':commit(pause(state));break;
  case 'check':commit(beginRecall(state));break;
  case 'choice':commit(answer(state,el.dataset.value));break;
  case 'reveal':commit(reveal(state));break;
  case 'next':commit(advance(state));break;
  case 'export':download();break;
 }
});
root.addEventListener('submit',event=>{
 if(event.target.id!=='answer-form')return;event.preventDefault();
 const next=answer(state,event.target.querySelector('input').value);
 if(next===state){inputWarning='Enter the reading using romaji letters.';render();}
 else commit(next);
});
render();
