import {
 VOWELS,WORDS,STAGES,PROTOTYPE_SCHEMA,PROTOTYPE_STORAGE_KEY,
 initialState,validState,currentStage,currentItem,vowel,word,
 start,pause,beginIntroCheck,setHint,revealAnswer,markAudioPlayed,submit,skipListening,skipListeningStage,advance,
 practiceAgain,practiceWeakItems,progress,firstAttemptSummary,allowedChoices,
 startPractice,currentPracticePrompt,hintPractice,revealPractice,answerPractice,advancePractice,practiceSummary
} from './engine.mjs';

const root=document.getElementById('app');
const STORAGE=PROTOTYPE_STORAGE_KEY;
let storageWarning='';
let writeAllowed=true;
let lastPersistedRaw=null;
let sourceState;
try{
  const raw=localStorage.getItem(STORAGE);
  lastPersistedRaw=raw;
  if(raw){
    const parsed=JSON.parse(raw);
    if(!validState(parsed))throw Error('The saved prototype has an unsupported or invalid schema.');
    sourceState=parsed;
  }
}catch(error){
  storageWarning='Saved prototype data could not be read safely. Running in memory without overwriting the existing data. You can still export this session.';
  writeAllowed=false;
}
let state=sourceState||initialState();
let audioStatus='';
let initialPracticeReload=state.practiceSession?.status==='active'&&!state.practiceSession?.feedback;
let practiceClock=null;
let practiceInputWarning='';
document.addEventListener('visibilitychange',()=>{if(practiceClock)practiceClock.invalid=true;});

function esc(s){
  return String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;')
    .replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
}
function persist(){
  state={...state,savedAt:new Date().toISOString()};
  if(!writeAllowed)return;
  try{
    const encoded=JSON.stringify(state);
    localStorage.setItem(STORAGE,encoded);
    lastPersistedRaw=encoded;
  }catch(error){
    writeAllowed=false;
    storageWarning='Browser storage is unavailable. This session will work, but progress may not survive a refresh. Export your progress for safekeeping.';
  }
}
function commit(next){
  if(next===state)return;
  // Fail closed on sequential stale-tab updates to optional practice evidence.
  // This browser check is not an atomic compare-and-swap across processes.
  if(writeAllowed&&(state.practiceSession||next.practiceSession)){
    try{
      if(localStorage.getItem(STORAGE)!==lastPersistedRaw){
        writeAllowed=false;
        storageWarning='Saved progress changed in another tab since this tab loaded. This tab will not overwrite newer evidence. Reload or export before continuing.';
        render();return;
      }
    }catch{
      writeAllowed=false;
      storageWarning='Saved progress could not be checked safely. Export this session; no further writes will be made.';
      render();return;
    }
  }
  state=next;persist();render();
}
function unitHeader(){
  const p=progress(state);
  const practicing=!state.paused&&state.practiceSession?.status==='active';
  const active=!(state.paused||(currentStage(state).mode==='results'&&!practicing));
  return '<header class="topbar"><div class="brand"><div class="brand-mark" aria-hidden="true">あ</div>'
    +'<div><h2>Kana Foundations</h2><p class="eyebrow">HIRAGANA · FIVE VOWELS</p></div></div>'
    +(active?'<button class="top-exit" data-action="pause" aria-label="Exit lesson; progress is saved">Exit</button>':'')
    +'</header>'
    +(!active?'':'<div class="progress-track" aria-hidden="true"><div class="progress-bar" style="width:'+(practicing?Math.round(100*Math.min(15,state.practiceSession.promptIndex)/15):p.percent)+'%"></div></div>'
      +'<div class="progress-caption"><span>'+esc(practicing?'Mixed practice · No mastery credit':p.label)+'</span><span>'+(practicing?Math.min(15,state.practiceSession.promptIndex)+' / 15 first prompts':p.done+' / '+p.total+' activities')+'</span></div>');
}
function wrap(body,actions){
  root.innerHTML='<div class="shell">'+unitHeader()
    +'<main id="main" tabindex="-1">'+(storageWarning?'<div role="alert" class="warning">'+esc(storageWarning)+'</div>':'')
    +body+(audioStatus?'<p class="status" role="status">'+esc(audioStatus)+'</p>':'')
    +'</main><footer class="action-area">'+(actions||'')+'</footer>'
    +'<p class="footer-note">Isolated learning prototype · Device voice is synthetic · No Account or FSRS writes</p></div>';
}
function primary(action,label,disabled=false){
  return '<button class="primary" data-action="'+action+'"'+(disabled?' disabled':'')+'>'+esc(label)+'</button>';
}
function secondary(action,label){
  return '<button class="secondary" data-action="'+action+'">'+esc(label)+'</button>';
}
function availableVoice(){
  if(typeof speechSynthesis==='undefined'||typeof SpeechSynthesisUtterance==='undefined')return null;
  return speechSynthesis.getVoices().find(v=>/^ja(?:-|$)/i.test(v.lang))||null;
}
function speech(text,listening){
  const voice=availableVoice();
  if(!voice){
    audioStatus='Japanese synthetic voice unavailable on this device. Listening practice can be skipped without credit.';
    render();return;
  }
  try{
    speechSynthesis.cancel();
    const utterance=new SpeechSynthesisUtterance(text);
    utterance.lang='ja-JP';utterance.voice=voice;utterance.rate=.78;
    const requestKey=currentStage(state).id+':'+currentItem(state);
    utterance.onstart=()=>{
      audioStatus='Playing synthetic audio; this is not verified pronunciation evidence.';
      render();
    };
    utterance.onend=()=>{
      if(listening&&!state.paused&&!state.feedback
        &&currentStage(state).id+':'+currentItem(state)===requestKey)
        commit(markAudioPlayed(state));
    };
    utterance.onerror=()=>{
      audioStatus='Audio playback failed. Try again or continue without listening.';
      render();
    };
    speechSynthesis.speak(utterance);
  }catch(error){audioStatus='Audio playback failed. You can skip the listening prompt.';render();}
}
function feedbackHtml(){
 if(!state.feedback)return '';
 const f=state.feedback,mode=currentStage(state).mode;
 if(f.correct===null&&!f.revealed)return '<div role="status" aria-live="polite" class="feedback neutral"><strong>Listening not assessed</strong>No listening evidence was recorded.</div>';
 const item=mode==='reading'?word(currentItem(state)):vowel(currentItem(state));
 const correctText=mode==='listening'?item?.kana+' ('+item?.reading+')':item?.reading;
 if(f.revealed)return '<div role="status" aria-live="polite" class="feedback neutral"><strong>Answer revealed: '+esc(correctText)+'</strong>This is recorded as help, not independent recall. You will revisit the item.</div>';
 if(f.correct)return '<div role="status" aria-live="polite" class="feedback good"><strong>Correct.</strong>'
  +(state.practiceOnly?'Practice-only correct answer. Your original first attempt remains unchanged.':state.hintLevel>0||state.hint?'Guided practice, recorded as assisted.':'Independent answer recorded.')
  +(mode==='reading'?'<small>Meaning: '+esc(item.meaning)+' · Common kanji: '+esc(item.common)+'</small>':'')+'</div>';
 const confused=['recognition','teach','recall'].includes(mode)?VOWELS.find(v=>v.reading===f.submitted)
  :mode==='listening'?vowel(f.submitted):null;
 const contrast=confused&&item&&confused.id!==item.id
  ?' You chose the reading of '+confused.kana+' ('+confused.reading+'). Compare it with '+item.kana+' ('+item.reading+').'
  :' Review the character shape and try to recall its sound.';
 return '<div role="status" aria-live="polite" class="feedback bad"><strong>Not quite. Correct: '+esc(correctText)+'</strong>'
  +'<small>Your answer: '+esc(f.submitted)+'.'+esc(contrast)+'</small>'
  +(mode==='reading'?'<small>Meaning: '+esc(item.meaning)+' · Common kanji: '+esc(item.common)+'</small>':'')
  +'<small>'+(state.retryMode?'Still unresolved. It remains on your practice list.':'We will revisit this after other questions.')+'</small></div>';
}
function hintControls(){
 if(state.feedback)return '';
 const level=state.hintLevel||0,stage=currentStage(state),item=currentItem(state);
 const v=stage.mode==='reading'?null:vowel(item);
 const cue=level>=1?'<div class="hint" role="status"><strong>Recall cue:</strong> '
  +esc(stage.mode==='reading'?'Read each kana in order, without trying to guess the meaning.'
   :v?.cue||'Try recalling the character from your introduction.')+'</div>':'';
 const canOfferChoices=stage.mode!=='recognition'&&!(stage.mode==='teach'&&state.phase===0&&state.cursor===0);
 const nextHint=level===0?'Need a hint?':(level===1&&canOfferChoices?'Try guided choices':null);
 return cue+'<div class="hint-actions">'
  +(nextHint?'<button class="text-button" data-action="hint">'+nextHint+'</button>':'')
  +'<button class="text-button" data-action="reveal">Show answer (no credit)</button></div>';
}
function answerForm(){
 return '<form id="answer-form"><label class="form-label" for="answer">Type the romaji reading</label>'
  +'<input id="answer" class="answer-input" name="answer" type="text" inputmode="latin" autocomplete="off" autocapitalize="off" spellcheck="false" required maxlength="24" aria-describedby="input-help">'
  +'<p id="input-help" class="status">Use romaji letters such as a, i, u, e or o.</p>'
  +'<button class="primary" type="submit">Check answer</button></form>';
}
function guidedChoices(){
 return '<p class="status">Guided choices — this attempt counts as assisted.</p>'
  +'<div class="choices">'+allowedChoices(state).map(c=>optionButton(c,c,false)).join('')+'</div>';
}
function welcome(){
  const done=state.phase>0||state.introduced.length>0||state.records.length>0;
  const body='<p class="kicker">Unit 01 · Beginner Japanese</p><h1>Read your first Japanese characters</h1>'
    +'<p class="lead">Meet the five hiragana vowels, recognize their sounds, recall them without hints, and read real Japanese words.</p>'
    +'<div class="vowel-strip" lang="ja">'+VOWELS.map(v=>'<span>'+v.kana+'</span>').join('')+'</div>'
    +'<div class="teaching-note"><span class="mini-label">What you will do</span>'
    +'Learn two vowels first, practice them, learn three more, and then try reading and listening. Correcting mistakes is part of learning.</div>'
    +'<div class="section-list"><div><strong>1 · Learn</strong><span>Sound and shape</span></div>'
    +'<div><strong>2 · Practice</strong><span>Recognize and recall</span></div>'
    +'<div><strong>3 · Apply</strong><span>Listen and read words</span></div>'
    +'<div><strong>4 · Return</strong><span>Review later</span></div></div>'
    +'<p class="status">Your activity stays in this browser under a separate prototype-only storage key. Nothing is transferred to your Japanese account.</p>';
  const actions=primary('start',done?'Resume learning':'Start learning')
    +(done?secondary('export','Export prototype progress'):'');
  wrap(body,actions);
}
function teach(){
 const v=vowel(currentItem(state)),checking=state.introStep==='check',voice=availableVoice();
 if(!checking){
  const discovery=v.id==='h-i'?'<div class="teaching-note discovery-note"><span class="mini-label">First word discovery</span>'
   +'<span lang="ja">あい</span> (ai) means love, commonly written <span lang="ja">愛</span>. '
   +'You can recognize its two hiragana.</div>':'';
  const body='<section class="intro-screen"><p class="kicker">'+esc(currentStage(state).title)+'</p>'
   +'<h1>Meet <span lang="ja">'+v.kana+'</span></h1>'
   +'<p class="lead">Meet its shape and sound. Then recall it without the reading.</p>'
   +'<div class="glyph-panel"><span class="hero-glyph" lang="ja">'+v.kana+'</span>'
   +'<span class="roman">'+v.reading+'</span></div>'
   +'<div class="essential-teaching"><button class="audio-button" data-action="audio" '
   +(voice?'':' disabled')+' aria-label="'+(voice?'Play synthesized Japanese sound '+v.reading:'Japanese audio unavailable')
   +'">'+(voice?'▶ Listen':'Audio unavailable')+'</button>'
   +'<p class="audio-note">'+(voice?'Device-generated voice; pronunciation not independently verified.'
     :'No Japanese device voice is installed. Continue with the written reading.')+'</p>'
   +'<div class="teaching-note essential-note"><span class="mini-label">Sound &amp; shape</span>'
   +esc(v.tip)+' <span class="stroke-count">Written in '+v.strokes+' strokes.</span></div></div>'
   +discovery+'</section>';
  wrap(body,primary('intro-check','Try recalling '+v.kana));
  return;
 }
 const body='<p class="kicker">Quick recall · '+esc(currentStage(state).title)+'</p>'
  +'<h1>Recall this sound</h1><p class="lead">What is this character, without the reading visible?</p>'
  +'<div class="glyph-panel"><span class="hero-glyph" lang="ja">'+v.kana+'</span></div>'
  +(state.feedback?'':state.hintLevel>=2?guidedChoices():answerForm())
  +hintControls()+feedbackHtml();
 wrap(body,state.feedback?primary('advance','Continue'):'');
}
function optionButton(label,value,isKana){
  const submitted=state.feedback?.submitted;
  const picked=submitted===String(value).replaceAll('-','').toLowerCase();
  const expected=state.feedback?.expected;
  const isRight=expected===value;
  const cls=state.feedback?(isRight?' correct-choice':picked&&!state.feedback.correct?' wrong-choice':''):'';
  return '<button type="button" class="choice'+(isKana?' kana-choice':'')+cls
    +'" data-action="choice" data-value="'+esc(value)+'"'+(state.feedback?' disabled':'')
    +' aria-label="'+esc(isKana?'Character '+label:'Reading '+label)+'">'+esc(label)+'</button>';
}
function recognition(){
 const v=vowel(currentItem(state));
 const body='<p class="kicker">Recognition · '+(state.retryMode?'Correction practice':'Independent attempt')+'</p>'
  +'<h1>How do you read this?</h1><p class="lead">Choose the sound of this character.</p>'
  +'<div class="glyph-panel"><span class="hero-glyph" lang="ja">'+v.kana+'</span></div>'
  +'<div class="choices">'+allowedChoices(state).map(c=>optionButton(c,c,false)).join('')+'</div>'
  +hintControls()+feedbackHtml();
 wrap(body,state.feedback?primary('advance','Continue'):'');
}
function typed(mode){
 const isWord=mode==='reading',v=isWord?word(currentItem(state)):vowel(currentItem(state));
 const body='<p class="kicker">'+(isWord?'Word reading':'Active recall')
  +(state.retryMode?' · Correction practice':'')+'</p>'
  +'<h1>'+(isWord?'Read the word':'Type the reading')+'</h1>'
  +'<p class="lead">'+(isWord?'Read the kana in order. The meaning appears after you answer.'
    :'Remember the sound without the written reading.')+'</p>'
  +'<div class="glyph-panel"><span class="'+(isWord?'japanese-word':'hero-glyph')+'" lang="ja">'+v.kana+'</span></div>'
  +(state.feedback?'':state.hintLevel>=2?guidedChoices():answerForm())
  +hintControls()+feedbackHtml();
 wrap(body,state.feedback?primary('advance','Continue'):'');
}
function listening(){
 const voice=availableVoice();
 const body='<p class="kicker">Listening · '+(state.retryMode?'Correction practice':'Identify by sound')+'</p>'
  +'<h1>Which character do you hear?</h1>'
  +'<p class="lead">Listen, then select the matching kana. Audio is synthesized and optional in this prototype.</p>'
  +'<div class="glyph-panel"><button class="audio-button" data-action="audio"'
  +(voice?'':' disabled')+' aria-label="Play Japanese vowel using device speech synthesis">▶ Play sound</button>'
  +'<p class="audio-note">'+(voice?'Device-generated Japanese voice. Replays are allowed.'
   :'No Japanese device voice is available. Continue to reading without listening assessment.')+'</p></div>'
  +(state.audioPlayed||state.feedback?'<div class="choices kana-grid">'
   +allowedChoices(state).map(id=>optionButton(vowel(id).kana,id,true)).join('')+'</div>'
   :'<p class="status">The choices appear after playback finishes.</p>')
  +feedbackHtml();
 wrap(body,state.feedback?primary('advance','Continue')
  :(voice?'<button class="text-button" data-action="skip-audio">Skip this sound (no credit)</button>':'')
  +secondary('skip-audio-stage','Continue without listening (not assessed)'));
}
function results(){
 const data=firstAttemptSummary(state),weak=data.needsPractice.map(vowel).filter(Boolean);
 const wordWeak=data.needsWordPractice.map(word).filter(Boolean);
 const fmt=m=>m.correct+' / '+m.total+(m.skipped?' ('+m.skipped+' not assessed)':'');
 const weakLabel=weak.length?weak.map(v=>v.kana+' ('+v.reading+')').join(' · '):'No unresolved individual kana errors today';
 const body='<p class="kicker">Unit 01 · Learning evidence</p><h1>Your five-vowel results</h1>'
  +'<p class="lead">First-attempt results are not a long-term mastery or retention score.</p>'
  +'<div class="vowel-strip" lang="ja">'+VOWELS.map(v=>'<span>'+v.kana+'</span>').join('')+'</div>'
  +'<div class="metrics"><div class="metric"><strong>'+data.introduced+' / 5</strong><span>Introduced</span></div>'
  +'<div class="metric"><strong>'+data.introChecks.correct+' / '+data.introChecks.total+'</strong><span>Independent intro recall</span></div>'
  +'<div class="metric"><strong>'+data.recognition.correct+' / '+data.recognition.total+'</strong><span>Final recognition</span></div>'
  +'<div class="metric"><strong>'+fmt(data.recall)+'</strong><span>Typed recall</span></div>'
  +'<div class="metric"><strong>'+fmt(data.listening)+'</strong><span>Listening</span></div>'
  +'<div class="metric"><strong>'+fmt(data.reading)+'</strong><span>Word decoding</span></div></div>'
  +'<div class="teaching-note"><span class="mini-label">What to practice next</span>'
  +esc(weakLabel)
  +(wordWeak.length?'<p class="status">Also practice: '+esc(wordWeak.map(w=>w.kana).join(' · '))+'</p>':'')
  +'<p class="status">Return after a delay to check retention. No real Account or FSRS dates are changed.</p></div>';
 const pr=practiceSummary(state);
 const practiceResult=pr?'<div class="teaching-note practice-summary"><span class="mini-label">Optional mixed practice · No mastery credit</span><strong>'+pr.firstIndependentCorrect+' independent answers out of 15</strong><p class="status">'+pr.firstCompleted+' first prompts completed; '+pr.corrections+' correction responses. No Account or FSRS progress was changed.</p></div>':'';
 const actions='<div class="results-actions">'+(state.introduced.length===5?primary('start-practice',pr?'Start new 15-question practice':'Start 15-question mixed practice'):'')
  +(weak.length?primary('practice-weak','Practice '+weak.length+' weak character'+(weak.length===1?'':'s')):'')
  +secondary('practice-again','Repeat mixed practice (no mastery credit)')
  +secondary('export','Export prototype progress')+'</div>';
 wrap(body+practiceResult+actions,'');
}

function readablePracticeAnswer(p,value){
 return p.mode==='reverse'?vowel(value)?.kana||'':value;
}
function practiceHelp(p){
 if(p.mode==='sequence')return 'Read each of the three characters from left to right, one vowel per character.';
 if(p.mode==='reverse')return 'Remember the kana shape matching the shown vowel sound.';
 return 'Recall the short vowel sound you learned for the displayed character.';
}
function practiceScreen(){
 const p=state.practiceSession,item=currentPracticePrompt(state);
 if(!item){wrap('<h1>Practice session unavailable</h1><p>Export your progress and reload without resetting the original lesson.</p>','');return;}
 const mode=item.mode,title=mode==='recognition'?'Mixed recognition':mode==='reverse'?'Reverse matching':'Three-character reading';
 const correction=Boolean(item.correctionOf),feedback=p.feedback;
 const shown=mode==='recognition'?vowel(item.kanaIds[0]).kana:
  mode==='reverse'?vowel(item.kanaIds[0]).reading:item.kanaIds.map(id=>vowel(id).kana).join('');
 const instruction=mode==='recognition'?'Choose the correct reading.':
  mode==='reverse'?'Choose the Japanese character for this reading.':
  'Read all three kana and type their vowel sounds in order. This is not a vocabulary question.';
 const context=correction?'Correction practice · original first attempt preserved':
  'Independent first attempt · '+(p.promptIndex+1)+' of 15';
 let responses='';
 if(!feedback){
  if(mode==='sequence'){
   responses='<form id="practice-answer-form"><label class="form-label" for="practice-answer">Type the three-vowel reading</label>'
    +'<input id="practice-answer" name="practice-answer" class="answer-input" autocomplete="off" autocapitalize="off" spellcheck="false" type="text" inputmode="latin" maxlength="20" aria-describedby="practice-input-help" required>'
    +'<p class="status" id="practice-input-help">Type three romaji vowels, with optional spaces or hyphens.</p>'
    +(practiceInputWarning?'<p role="alert" class="status">'+esc(practiceInputWarning)+'</p>':'')
    +'<button class="primary" type="submit">Check practice answer</button></form>';
  }else{
   responses='<div class="choices '+(mode==='reverse'?'kana-grid':'')+'">'
    +item.choices.map(value=>{
     const kana=mode==='reverse',label=kana?vowel(value).kana:value;
     return '<button type="button" class="choice'+(kana?' kana-choice':'')+'" data-action="practice-choice" data-practice-value="'+esc(value)+'" aria-label="'+esc(kana?'Character '+label:'Reading '+label)+'">'+esc(label)+'</button>';
    }).join('')+'</div>';
  }
  if(p.assistanceLevel==='cue')responses+='<div class="hint" role="status"><strong>Recall cue: </strong>'+esc(practiceHelp(item))+'</div>';
  responses+='<div class="hint-actions">'
   +(p.assistanceLevel==='none'?'<button class="text-button" data-action="practice-hint">Need a hint?</button>':'')
   +'<button class="text-button" data-action="practice-reveal">Show answer (no credit)</button></div>';
 }
 const result=feedback?'<div role="status" aria-live="polite" class="feedback '
  +(feedback.correct===true?'good':feedback.correct===false?'bad':'neutral')+'">'
  +'<strong>'+(feedback.revealed?'Practice-only: answer revealed (no credit).':
    feedback.correct===true?'Practice-only: correct.':'Practice-only: incorrect.')+'</strong>'
  +'<p>'+esc(feedback.revealed?'This counts as assistance. Correct: '+readablePracticeAnswer(item,item.answer)
    :'Correct answer: '+readablePracticeAnswer(item,item.answer))+'</p>'
  +(p.assistanceLevel!=='none'&&!feedback.revealed?'<small>Assisted practice — no independent credit.</small>':'')
  +(correction?'<small>Your first attempt remains unchanged.</small>':'')
  +'</div>':'';
 const body='<section class="practice-screen"><p class="kicker">'+esc(context)+'</p>'
  +'<h1>'+esc(title)+'</h1><p class="lead">'+esc(instruction)+'</p>'
  +'<div class="glyph-panel"><span class="'+(mode==='sequence'?'japanese-word':'hero-glyph')+'"'
  +(mode!=='reverse'?' lang="ja"':'')+'>'+esc(shown)+'</span></div>'
  +responses+result+'<p class="status">Practice only · No Account or FSRS grades</p></section>';
 wrap(body,feedback?primary('practice-advance','Next practice question'):'');
}

let lastScreenKey=null;
function render(){
 const mode=currentStage(state).mode;
 const activePractice=!state.paused&&state.practiceSession?.status==='active';
 const screenKey=state.paused?'paused':activePractice?
  'practice:'+state.practiceSession.sessionId+':'+currentPracticePrompt(state)?.id:
  currentStage(state).id+':'+currentItem(state)+':'+state.retryMode+':'+(state.introStep||'explain');
 const moved=lastScreenKey!==screenKey;
 const previous=document.getElementById('answer')||document.getElementById('practice-answer');
 const retained=!moved&&previous?{value:previous.value,start:previous.selectionStart,
  end:previous.selectionEnd,focused:document.activeElement===previous}:null;
 if(state.paused)welcome();
 else if(activePractice)practiceScreen();
 else if(mode==='teach')teach();
 else if(mode==='recognition')recognition();
 else if(mode==='recall'||mode==='reading')typed(mode);
 else if(mode==='listening')listening();
 else results();
 const input=document.getElementById('answer')||document.getElementById('practice-answer');
 if(retained&&input&&!state.feedback){
  input.value=retained.value;
  if(retained.focused){
   input.focus({preventScroll:true});
   try{input.setSelectionRange(retained.start,retained.end);}catch{}
  }
 }
 if(moved){
  if(activePractice){
   practiceClock={id:currentPracticePrompt(state)?.id,startedAt:performance.now(),invalid:Boolean(initialPracticeReload)};
   initialPracticeReload=false;
   practiceInputWarning='';
  }else practiceClock=null;
  if(input&&!state.paused)input.focus({preventScroll:true});
  else document.getElementById('main')?.focus({preventScroll:true});
 }
 lastScreenKey=screenKey;
}
function download(){
  const blob=new Blob([JSON.stringify({prototype:true,exportedAt:new Date().toISOString(),state},null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob),anchor=document.createElement('a');
  anchor.href=url;anchor.download='kana-foundations-prototype-progress.json';
  document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function elapsedPracticeTime(){
 if(!practiceClock||practiceClock.invalid||document.visibilityState!=='visible'
  ||practiceClock.id!==currentPracticePrompt(state)?.id)return null;
 return Math.max(0,performance.now()-practiceClock.startedAt);
}
function createPracticeFromResults(){
 const buf=new Uint32Array(1);
 crypto.getRandomValues(buf);
 const seed=buf[0];
 commit(startPractice(state,seed,'prototype-'+Date.now().toString(36)+'-'+seed.toString(36)));
}
root.addEventListener('click',event=>{
  const button=event.target.closest('button[data-action]');
  if(!button||button.disabled)return;
  const action=button.dataset.action;
  if(action==='start')commit(start(state));
  if(action==='pause')commit(pause(state));
  if(action==='advance')commit(advance(state));
  if(action==='hint')commit(setHint(state));
  if(action==='intro-check')commit(beginIntroCheck(state));
  if(action==='reveal')commit(revealAnswer(state));
  if(action==='choice')commit(submit(state,button.dataset.value));
  if(action==='skip-audio')commit(skipListening(state));
  if(action==='skip-audio-stage')commit(skipListeningStage(state));
  if(action==='audio'){
    const mode=currentStage(state).mode;
    const item=currentItem(state);
    const text=mode==='reading'?word(item)?.kana:vowel(item)?.kana;
    if(text)speech(text,mode==='listening');
  }
  if(action==='export')download();
  if(action==='start-practice')createPracticeFromResults();
  if(action==='practice-hint')commit(hintPractice(state));
  if(action==='practice-reveal')commit(revealPractice(state));
  if(action==='practice-choice')commit(answerPractice(state,button.dataset.practiceValue,{elapsedMs:elapsedPracticeTime()}));
  if(action==='practice-advance')commit(advancePractice(state));
  if(action==='practice-again')commit(practiceAgain(state));
  if(action==='practice-weak')commit(practiceWeakItems(state));
});
root.addEventListener('submit',event=>{
  if(event.target.id==='practice-answer-form'){
    event.preventDefault();
    const value=event.target.elements.namedItem('practice-answer')?.value;
    const next=answerPractice(state,value,{elapsedMs:elapsedPracticeTime()});
    if(next===state){practiceInputWarning='Enter exactly three vowels (a, i, u, e, o), with optional spaces or hyphens.';render();}
    else commit(next);
    return;
  }
  if(event.target.id!=='answer-form')return;
  event.preventDefault();
  const value=event.target.elements.namedItem('answer')?.value;
  commit(submit(state,value));
});
if(typeof speechSynthesis!=='undefined'){
  speechSynthesis.addEventListener?.('voiceschanged',()=>{
    if(!state.paused&&currentStage(state).mode==='listening'&&!state.feedback)render();
  });
}
render();
