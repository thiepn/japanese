import {
 VOWELS,WORDS,STAGES,PROTOTYPE_SCHEMA,PROTOTYPE_STORAGE_KEY,
 initialState,validState,currentStage,currentItem,vowel,word,
 start,pause,beginIntroCheck,setHint,revealAnswer,markAudioPlayed,submit,skipListening,skipListeningStage,advance,
 practiceAgain,practiceWeakItems,progress,firstAttemptSummary,allowedChoices
} from './engine.mjs';

const root=document.getElementById('app');
const STORAGE=PROTOTYPE_STORAGE_KEY;
let storageWarning='';
let writeAllowed=true;
let sourceState;
try{
  const raw=localStorage.getItem(STORAGE);
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

function esc(s){
  return String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;')
    .replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
}
function persist(){
  state={...state,savedAt:new Date().toISOString()};
  if(!writeAllowed)return;
  try{localStorage.setItem(STORAGE,JSON.stringify(state));}
  catch(error){
    writeAllowed=false;
    storageWarning='Browser storage is unavailable. This session will work, but progress may not survive a refresh. Export your progress for safekeeping.';
  }
}
function commit(next){
  if(next===state)return;
  state=next;persist();render();
}
function unitHeader(){
  const p=progress(state);
  const active=!(state.paused||currentStage(state).mode==='results');
  return '<header class="topbar"><div class="brand"><div class="brand-mark" aria-hidden="true">あ</div>'
    +'<div><h2>Kana Foundations</h2><p class="eyebrow">HIRAGANA · FIVE VOWELS</p></div></div>'
    +(active?'<button class="top-exit" data-action="pause" aria-label="Exit lesson; progress is saved">Exit</button>':'')
    +'</header>'
    +(!active?'':'<div class="progress-track" aria-hidden="true"><div class="progress-bar" style="width:'+p.percent+'%"></div></div>'
      +'<div class="progress-caption"><span>'+esc(p.label)+'</span><span>'+p.done+' / '+p.total+' activities</span></div>');
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
    utterance.onstart=()=>{
      audioStatus='Playing the device-generated Japanese voice (not a native recording).';
      if(listening)commit(markAudioPlayed(state));else render();
    };
    utterance.onerror=()=>{
      audioStatus='Audio playback failed. Skip listening without a score or try again.';
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
  +(state.hintLevel>0||state.hint?'Guided practice, recorded as assisted.':'Independent answer recorded.')
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
 return cue+'<div class="hint-actions">'
  +(level<2?'<button class="text-button" data-action="hint">'+(level===0?'Need a hint?':'Try guided choices')+'</button>':'')
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
 const v=vowel(currentItem(state)),checking=state.introStep==='check';
 if(!checking){
  const discovery=v.id==='h-i'?'<div class="teaching-note"><span class="mini-label">Your first real word</span><span lang="ja">あい</span> (ai) means love, usually written <span lang="ja">愛</span>. You can already read its two hiragana.</div>':'';
  const body='<p class="kicker">'+esc(currentStage(state).title)+'</p>'
   +'<h1>Meet <span lang="ja">'+v.kana+'</span></h1>'
   +'<p class="lead">Observe the character and its reading. Then try recalling the sound with the answer hidden.</p>'
   +'<div class="glyph-panel"><span class="hero-glyph" lang="ja">'+v.kana+'</span><span class="roman">'+v.reading+'</span></div>'
   +'<div class="inline-actions"><button class="audio-button" data-action="audio">▶ Play device voice</button></div>'
   +'<p class="audio-note">Synthetic voice only; native recordings require verification.</p>'
   +'<div class="teaching-note"><span class="mini-label">Pronunciation</span>'+esc(v.tip)+'</div>'
   +'<div class="teaching-note"><span class="mini-label">Writing</span>'+v.strokes+' strokes. No unverified stroke-order diagrams.</div>'
   +discovery;
  wrap(body,primary('intro-check','Try recalling '+v.kana)+secondary('pause','Exit and save'));
  return;
 }
 const body='<p class="kicker">Quick recall · '+esc(currentStage(state).title)+'</p>'
  +'<h1>Recall this sound</h1><p class="lead">What is this character, without the reading visible?</p>'
  +'<div class="glyph-panel"><span class="hero-glyph" lang="ja">'+v.kana+'</span></div>'
  +(state.feedback?'':state.hintLevel>=2?guidedChoices():answerForm())
  +hintControls()+feedbackHtml();
 wrap(body,state.feedback?primary('advance','Continue'):secondary('pause','Exit and save'));
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
  const choices=allowedChoices(state);
  const body='<p class="kicker">Recognition · '+(state.retryMode?'Correction practice':'First attempt')+'</p>'
    +'<h1>How do you read this?</h1><p class="lead">Choose the sound represented by the character.</p>'
    +'<div class="glyph-panel"><span class="hero-glyph" lang="ja">'+v.kana+'</span></div>'
    +'<div class="choices">'+choices.map(c=>optionButton(c,c,false)).join('')+'</div>'
    +(state.hint?'<p class="hint">Hint: The reading is '+v.reading+'. Your answer will be marked assisted.</p>':'')
    +feedbackHtml();
  wrap(body,state.feedback?primary('advance','Continue'):
    '<button class="text-button" data-action="hint">Need a hint?</button>');
}
function typed(mode){
  const isWord=mode==='reading',v=isWord?word(currentItem(state)):vowel(currentItem(state));
  const glyph=isWord?v.kana:v.kana;
  const heading=isWord?'Read the word':'Type the reading';
  const body='<p class="kicker">'+(isWord?'Word reading':'Active recall')
    +(state.retryMode?' · Correction practice':'')+'</p>'
    +'<h1>'+heading+'</h1><p class="lead">'+(isWord
      ?'Read the kana and type the sounds together. The meaning appears after you answer.'
      :'No answer choices. Recall the vowel sound from memory.')+'</p>'
    +'<div class="glyph-panel"><span class="'+(isWord?'japanese-word':'hero-glyph')+'" lang="ja">'+glyph+'</span></div>'
    +(state.feedback?'': '<form id="answer-form"><label class="form-label" for="answer">Type the romaji reading</label>'
      +'<input id="answer" class="answer-input" name="answer" type="text" inputmode="latin" autocomplete="off" autocapitalize="off" spellcheck="false" required maxlength="24" aria-describedby="input-help">'
      +'<p id="input-help" class="status">Use letters such as a, i, u, e, o.</p>'
      +'<button class="primary" type="submit">Check answer</button></form>')
    +(state.hint?'<p class="hint">Hint: '+(isWord?v.reading:v.reading)+'. This is assisted practice.</p>':'')
    +feedbackHtml();
  wrap(body,state.feedback?primary('advance','Continue'):
    '<button class="text-button" data-action="hint">Reveal a hint (assisted)</button>');
}
function listening(){
  const v=vowel(currentItem(state));
  const voice=availableVoice();
  const body='<p class="kicker">Listening · '+(state.retryMode?'Correction practice':'Identify by sound')+'</p>'
    +'<h1>Which character do you hear?</h1>'
    +'<p class="lead">Listen, then choose the matching kana. You can replay the audio freely.</p>'
    +'<div class="glyph-panel"><button class="audio-button" data-action="audio"'
    +(voice?'':' disabled')+' aria-label="Play Japanese vowel using device speech synthesis">▶ Play sound</button>'
    +'<p class="audio-note">'+(voice?'Device-generated speech, not a native recording.'
      :'No Japanese device voice is available. You can skip this question.')+'</p></div>'
    +(state.audioPlayed||state.feedback?'<div class="choices kana-grid">'
      +allowedChoices(state).map(id=>optionButton(vowel(id).kana,id,true)).join('')+'</div>'
      :'<p class="status">The choices will become available after audio begins playing.</p>')
    +feedbackHtml();
  wrap(body,state.feedback?primary('advance','Continue'):
    secondary('skip-audio','Skip listening — no credit'));
}
function results(){
  const data=firstAttemptSummary(state);
  const fmt=m=>m.correct+' / '+m.total+(m.skipped?' ('+m.skipped+' skipped)':'');
  const body='<p class="kicker">Unit 01 · Session summary</p><h1>Your five-vowel results</h1>'
    +'<p class="lead">These are first-attempt results, not a proficiency score or a claim of long-term mastery.</p>'
    +'<div class="vowel-strip" lang="ja">'+VOWELS.map(v=>'<span>'+v.kana+'</span>').join('')+'</div>'
    +'<div class="metrics"><div class="metric"><strong>'+data.introduced+' / 5</strong><span>Characters introduced</span></div>'
    +'<div class="metric"><strong>'+data.recognition.correct+' / '+data.recognition.total+'</strong><span>Final recognition, independent</span></div>'
    +'<div class="metric"><strong>'+fmt(data.recall)+'</strong><span>Typed recall, independent</span></div>'
    +'<div class="metric"><strong>'+fmt(data.listening)+'</strong><span>Listening, independent</span></div>'
    +'<div class="metric"><strong>'+fmt(data.reading)+'</strong><span>Word reading, independent</span></div>'
    +'<div class="metric"><strong>'+data.recall.assisted+'</strong><span>Assisted recall attempts</span></div></div>'
    +'<div class="teaching-note"><span class="mini-label">Next step</span>'
    +'Return after a delay to check retention. This prototype does not change the real Japanese FSRS schedule, so there is no claimed due date.</div>'
    +'<p class="status">Additional practice keeps first-attempt results intact. It never promotes prototype practice to Account mastery.</p>';
  wrap(body,primary('practice-again','Practice again (no mastery credit)')
      +secondary('export','Export prototype progress'));
}
let lastScreenKey=null;
function render(){
  audioStatus=audioStatus||'';
  const mode=currentStage(state).mode;
  const screenKey=state.paused?'paused':currentStage(state).id+':'+currentItem(state)+':'+state.retryMode;
  const moved=lastScreenKey!==screenKey;
  if(state.paused)welcome();
  else if(mode==='teach')teach();
  else if(mode==='recognition')recognition();
  else if(mode==='recall'||mode==='reading')typed(mode);
  else if(mode==='listening')listening();
  else results();
  // Announce genuinely new screens to keyboard/screen-reader users. Avoid
  // stealing focus when feedback, hints or audio availability merely updates.
  if(moved){
    if((mode==='recall'||mode==='reading')&&!state.paused)
      document.getElementById('answer')?.focus({preventScroll:true});
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
root.addEventListener('click',event=>{
  const button=event.target.closest('button[data-action]');
  if(!button||button.disabled)return;
  const action=button.dataset.action;
  if(action==='start')commit(start(state));
  if(action==='pause')commit(pause(state));
  if(action==='advance')commit(advance(state));
  if(action==='hint')commit(setHint(state));
  if(action==='choice')commit(submit(state,button.dataset.value));
  if(action==='skip-audio')commit(skipListening(state));
  if(action==='audio'){
    const mode=currentStage(state).mode;
    const item=currentItem(state);
    const text=mode==='reading'?word(item)?.kana:vowel(item)?.kana;
    if(text)speech(text,mode==='listening');
  }
  if(action==='export')download();
  if(action==='practice-again')commit(practiceAgain(state));
});
root.addEventListener('submit',event=>{
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
