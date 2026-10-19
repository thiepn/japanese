import "../design/ux1.css";
import "../design/beginner.css";
import {UX1CafeHeader,UX1CafeTiles,isUX1CafeJourney} from "./UX1Cafe";
import "./e11Practice.css";
import "./e08Revision.css";
import {useEffect,useRef,useState,type ReactNode} from "react";
import {eligibleE07Draft,e07DraftPreference,setE07DraftPreference,saveE07Draft,readE07Draft,clearE07Draft,clearAllE07Drafts,findE07RestorableStep,E07_DRAFT_LIMIT} from "./e07DraftBuffer";
import {getDefaultAudioProvider} from "@thiepn/audio";
import {gradeStudyPrompt,isStudyLesson,type GradeResult,type StudyPrompt,type StudyStep} from "@thiepn/study-player";
import {j5StudyMode,type J5StudyModeMeta} from "./j5StudyVisual";
import type {JSeason,JTheme} from "../design";
import {j9SensoryFeedback} from "../design/j9Sensory";
import {J10SeasonalWorld} from "../design/J10SeasonalWorld";
import {resolveJ10Season} from "../design/j10Season";
import {syncJ12ThemeColor} from "../design/j12Pwa";
import {applyJTheme,persistJTheme,readJTheme} from "../design/j14Theme";

export interface StudyAnswer{prompt:StudyPrompt;response:string;grade:GradeResult;responseTimeMs:number;}
interface StudyRecognition {
  lang:string;interimResults:boolean;continuous:boolean;start():void;abort():void;
  onresult:((event:{results:ArrayLike<{0?:{transcript?:string}}>})=>void)|null;
  onerror:(()=>void)|null;onend:(()=>void)|null;
}

function e06FoilCorrection(prompt:StudyPrompt,response:string):string|undefined{
  const raw=prompt.eventMetadata?.e06FoilFeedback;
  if(!Array.isArray(raw))return undefined;
  const matched=raw.find(item=>typeof item==="object"&&item!==null&&item.response===response&&typeof item.feedback==="string");
  return typeof matched?.feedback==="string"?matched.feedback:undefined;
}
export function StudyPlayer({steps,accountScope,onAnswer,onComplete,onExit}:{steps:StudyStep[];accountScope:string;onAnswer:(answer:StudyAnswer)=>Promise<void>|void;onComplete:()=>void;onExit:()=>void;}){
  const [index,setIndex]=useState(0);
  const [response,setResponse]=useState("");
  const [draftEnabled,setDraftEnabled]=useState(()=>e07DraftPreference(accountScope));
  const [draftNotice,setDraftNotice]=useState<"idle"|"saved"|"restored"|"unavailable">("idle");
  const [e08FirstDraft,setE08FirstDraft]=useState("");
  const [e12FirstDraft,setE12FirstDraft]=useState("");
  const [e08Checks,setE08Checks]=useState<string[]>([]);
  const [feedback,setFeedback]=useState<GradeResult|null>(null);
  const [saving,setSaving]=useState(false);
  const [saveError,setSaveError]=useState(false);
  const [audioState,setAudioState]=useState<"idle"|"playing"|"error">("idle");
  const [audioPlayed,setAudioPlayed]=useState(false);
  const [speechState,setSpeechState]=useState<"idle"|"listening"|"unsupported"|"error">("idle");
  const [timerTick,setTimerTick]=useState(0);
  const [theme,setTheme]=useState<JTheme>(readJTheme);
  const season=resolveJ10Season();
  const startedAt=useRef(performance.now());
  const audioProvider=useRef(getDefaultAudioProvider());
  const recognitionRef=useRef<StudyRecognition|null>(null);
  const cueGeneration=useRef(0);
  const savingRef=useRef(false);
  const step=steps[index];
  const ux1Cafe=isUX1CafeJourney(steps);
  const restorableIndex=findE07RestorableStep(accountScope,steps);

  useEffect(()=>{
    const next=steps[index];
    if(!next||isStudyLesson(next)||!draftEnabled||!eligibleE07Draft(next))return;
    const saved=readE07Draft(accountScope,next);
    if(saved){setResponse(saved);setDraftNotice("restored");}
  },[accountScope,index,steps,draftEnabled]);

  function stopRecognition(){
    const recognition=recognitionRef.current;
    recognitionRef.current=null;
    if(!recognition)return;
    recognition.onresult=null;recognition.onerror=null;recognition.onend=null;
    try{recognition.abort();}catch{/* Already stopped. */}
  }

  useEffect(()=>{
    cueGeneration.current+=1;
    stopRecognition();
    const provider=audioProvider.current;
    provider.stop();
    if(typeof speechSynthesis!=="undefined")speechSynthesis.cancel();
    setAudioState("idle");
    setAudioPlayed(false);
    setSpeechState("idle");
    return()=>{cueGeneration.current+=1;stopRecognition();provider.stop();if(typeof speechSynthesis!=="undefined")speechSynthesis.cancel();};
  },[index]);

  useEffect(()=>{
    persistJTheme(theme);
    applyJTheme(theme);
    document.documentElement.dataset.jSeason=season;
    syncJ12ThemeColor(theme);
  },[theme,season]);

  useEffect(()=>{
    if(!step||isStudyLesson(step)||!step.timeLimitSeconds||feedback)return;
    const id=window.setInterval(()=>setTimerTick((value)=>value+1),1000);
    return()=>window.clearInterval(id);
  },[step,index,feedback]);

  if(!step)return null;

  const activeStep=step;
  const e08StoredDraft=steps.filter(isStudyLesson).flatMap(item=>item.examples??[])
    .find(item=>item.expression==="Your prior submitted first draft (private)")?.note??"";
  const e08DraftReference=e08FirstDraft||e08StoredDraft;
  // E12 must never compare an E11 message to the earlier E08 original draft.
  const e12StoredDraft=steps.filter(isStudyLesson).flatMap(item=>item.examples??[])
    .find(item=>item.expression==="Your prior E11 first draft (private)")?.note??"";
  const e12DraftReference=e12FirstDraft||e12StoredDraft;
  const e19StoredDraft=steps.filter(isStudyLesson).flatMap(item=>item.examples??[])
    .find(item=>item.expression==="Your prior E19 source first draft (private)")?.note??"";
  const e12RevisionIndex=steps.findIndex(item=>!isStudyLesson(item)&&item.eventMetadata?.e12DraftStage==="revision");
  const e12FirstIndex=steps.findIndex(item=>!isStudyLesson(item)&&item.eventMetadata?.e11Task==="independent-letter");
  const e08RevisionIndex=steps.findIndex(item=>!isStudyLesson(item)&&item.eventMetadata?.e08DraftStage==="revision");
  const e08FirstIndex=steps.findIndex(item=>!isStudyLesson(item)&&item.eventMetadata?.e06===true&&item.promptType==="textarea"&&item.id.endsWith("-write"));
  const e08Revision=!isStudyLesson(activeStep)&&activeStep.eventMetadata?.e08DraftStage==="revision";
  const e08Unchanged=e08Revision&&Boolean(e08DraftReference.trim())&&response.trim()===e08DraftReference.trim();
  const e12Revision=!isStudyLesson(activeStep)&&activeStep.eventMetadata?.e12DraftStage==="revision";
  const e12Unchanged=e12Revision&&Boolean(e12DraftReference.trim())&&response.trim()===e12DraftReference.trim();
  const e19Revision=!isStudyLesson(activeStep)&&activeStep.eventMetadata?.e19Stage==="revision";
  const e19Unchanged=e19Revision&&Boolean(e19StoredDraft.trim())&&response.trim()===e19StoredDraft.trim();
  const e11OptionalWriting=!isStudyLesson(activeStep)&&activeStep.eventMetadata?.e11Task==="independent-letter";
  const e11OptionalPractice=!isStudyLesson(activeStep)&&activeStep.eventMetadata?.e11===true&&activeStep.eventMetadata?.nonAuthoritative===true;
  const mode=j5StudyMode(activeStep);
  const timeLimitSeconds=!isStudyLesson(activeStep)?activeStep.timeLimitSeconds:undefined;
  const elapsedSeconds=Math.max(0,Math.floor((performance.now()-startedAt.current)/1000));
  const remainingSeconds=timeLimitSeconds===undefined?null:Math.max(0,timeLimitSeconds-elapsedSeconds);
  void timerTick;

  function updateResponse(value:string){
    setResponse(value);
    if(isStudyLesson(activeStep)||!eligibleE07Draft(activeStep)||!draftEnabled)return;
    setDraftNotice(saveE07Draft(accountScope,activeStep,value)?"saved":"unavailable");
  }

  function changeDraftPreference(enabled:boolean){
    if(!setE07DraftPreference(accountScope,enabled)){setDraftNotice("unavailable");return;}
    setDraftEnabled(enabled);
    if(!enabled){
      if(!clearAllE07Drafts(accountScope))setDraftNotice("unavailable");
      else setDraftNotice("idle");
      return;
    }
    if(!isStudyLesson(activeStep)&&eligibleE07Draft(activeStep)&&response.trim()){
      setDraftNotice(saveE07Draft(accountScope,activeStep,response)?"saved":"unavailable");
    }
  }

  function clearCurrentDraft(){
    if(isStudyLesson(activeStep)||!eligibleE07Draft(activeStep))return;
    clearE07Draft(accountScope,activeStep);
    setResponse("");
    setDraftNotice("idle");
  }

  function resumeIndependentDraft(){
    if(!draftEnabled||restorableIndex<0)return;
    const candidate=steps[restorableIndex];
    if(!candidate||isStudyLesson(candidate)||!eligibleE07Draft(candidate))return;
    const saved=readE07Draft(accountScope,candidate);
    if(!saved)return;
    setIndex(restorableIndex);
    setResponse(saved);
    setFeedback(null);
    setSaveError(false);
    setAudioPlayed(false);
    setDraftNotice("restored");
    startedAt.current=performance.now();
  }

  function advance(){
    audioProvider.current.stop();
    setE08Checks([]);
    if(index+1>=steps.length){onComplete();return;}
    setIndex((value)=>value+1);
    setResponse("");
    setDraftNotice("idle");
    setFeedback(null);
    setSaveError(false);
    setTimerTick(0);
    startedAt.current=performance.now();
  }

  async function playAudio(playback:"normal"|"slow"|"shadow"){
    const ttsText=!isStudyLesson(activeStep)?activeStep.speechSynthesisText:undefined;
    if((!activeStep.audio&&!ttsText)||audioState==="playing")return;
    setAudioState("playing");
    const generation=cueGeneration.current;
    try{
      if(activeStep.audio){
        if(playback==="slow")await audioProvider.current.play(activeStep.audio,{rate:.82});
        else if(playback==="shadow")await audioProvider.current.play(activeStep.audio,{rate:.92,repeats:2,gapMs:1200});
        else await audioProvider.current.play(activeStep.audio);
      }else if(ttsText){
        await speakWithDevice(
          ttsText,
          playback==="slow"?.78:.94,
          playback==="shadow"?2:1,
          (!isStudyLesson(activeStep)?activeStep.speechSynthesisLanguage:undefined)??"ja-JP",
        );
      }
      if(generation!==cueGeneration.current)return;
      setAudioPlayed(true);
      setAudioState("idle");
    }catch{
      if(generation===cueGeneration.current)setAudioState("error");
    }
  }

  async function playBeginnerSound(expression:string){
    if(audioState==="playing")return;
    const generation=cueGeneration.current;
    setAudioState("playing");
    try{
      await speakWithDevice(expression,.82,1,"ja-JP");
      if(generation===cueGeneration.current)setAudioState("idle");
    }catch{
      if(generation===cueGeneration.current)setAudioState("error");
    }
  }
  function toggleTheme(){
    setTheme(theme==="light"?"dark":"light");
  }

  function startSpeechRecognition(){
    const w=window as unknown as {
      SpeechRecognition?:new()=>StudyRecognition;
      webkitSpeechRecognition?:new()=>StudyRecognition;
    };
    const Recognition=w.SpeechRecognition??w.webkitSpeechRecognition;
    if(!Recognition){setSpeechState("unsupported");return;}
    stopRecognition();
    const recognition=new Recognition();
    recognitionRef.current=recognition;
    recognition.lang="ja-JP";
    recognition.interimResults=false;
    recognition.continuous=false;
    recognition.onresult=(event)=>{
      const transcript=event.results[0]?.[0]?.transcript?.trim()??"";
      if(transcript)updateResponse(transcript);
    };
    recognition.onerror=()=>setSpeechState("error");
    recognition.onend=()=>setSpeechState((value)=>value==="error"?value:"idle");
    setSpeechState("listening");
    try{recognition.start();}catch{stopRecognition();setSpeechState("error");}
  }

  if(isStudyLesson(activeStep)){
    return <StudyFrame mode={mode} theme={theme} season={season} index={index} total={steps.length} completed={false} onExit={onExit} onTheme={toggleTheme}>
      {ux1Cafe?<UX1CafeHeader steps={steps} index={index}/>:null}
      {draftEnabled&&restorableIndex>index?<div className="e07-draft-resume" role="status"><p>Unfinished original writing or recognized speech text is saved on this device. You can resume it without submitting or grading skipped steps.</p><button type="button" onClick={resumeIndependentDraft}>Resume saved draft <span aria-hidden="true">→</span></button></div>:null}
      {e08StoredDraft&&e08RevisionIndex>index?<div className="e08-return" role="status">
        <div><strong>Your first draft is already recorded</strong><p>Resume the revision directly. Earlier questions will not be marked completed again.</p></div>
        <button type="button" onClick={()=>{setIndex(e08RevisionIndex);setResponse("");setFeedback(null);setSaveError(false);setE08Checks([]);startedAt.current=performance.now();}}>Continue second draft</button>
      </div>:null}
      {e12StoredDraft&&e12RevisionIndex>index?<div className="e08-return" role="status">
        <div><strong>Your optional E11 message was recorded</strong><p>Continue with its independent revision; skipped contextual questions receive no completion or grading evidence.</p></div>
        <button type="button" onClick={()=>{setIndex(e12RevisionIndex);setResponse("");setFeedback(null);setSaveError(false);setE08Checks([]);startedAt.current=performance.now();}}>Continue E12 revision</button>
      </div>:null}
      <div className="study-lesson j5-sheet j5-sheet--lesson">
        <div className="j5-sheet__cap">
          <span className="eyebrow">LEARN</span>
          <span className="j5-sheet__counter">{index+1} / {steps.length}</span>
        </div>
        <h1>{activeStep.title}</h1>
        <p className="lesson-body">{activeStep.body}</p>
        {ux1Cafe&&activeStep.id==="a1-e02-food-try"?<UX1CafeTiles/>:null}

        {activeStep.audio?<div className="lesson-audio j5-lesson-audio">
          <button className="audio-inline j5-audio-inline" type="button" disabled={audioState==="playing"} onClick={()=>void playAudio("normal")}>
            <span aria-hidden="true">聴</span>
            {audioState==="playing"?"Playing…":audioPlayed?"Replay pronunciation":"Hear pronunciation"}
          </button>
          <button className="quiet-button audio-inline-slow" type="button" disabled={audioState==="playing"} onClick={()=>void playAudio("slow")}>Slower</button>
        </div>:null}

        {activeStep.facts?.length?<div className="lesson-facts j5-lesson-facts">{activeStep.facts.map((fact)=><div key={fact.label}>
          <span>{fact.label}</span>
          <strong lang={fact.language}>{fact.value}</strong>
        </div>)}</div>:null}

        {activeStep.examples?.length?<div className="lesson-examples j5-lesson-examples">{activeStep.examples.map((example)=><div key={example.expression+":"+example.note}>
          <strong lang="ja">{example.expression}</strong>
          <span>{example.note}</span>
          {activeStep.id.startsWith("a0-hiragana-")?<div className="j5-kana-audio">
            <button type="button" disabled={audioState==="playing"}
              aria-label={"Hear "+example.expression+" pronounced"} onClick={()=>void playBeginnerSound(example.expression)}>
              {audioState==="playing"?"Playing…":"Listen"}
            </button>
          </div>:null}
        </div>)}</div>:null}
        {activeStep.id.startsWith("a0-hiragana-")&&audioState==="error"
          ?<p role="status">Japanese device speech is unavailable. You can continue reading and return for listening later.</p>:null}

        {activeStep.sourceLabel?<p className="source-note">Source: {activeStep.sourceLabel}</p>:null}
        <button className="primary j5-next" type="button" onClick={advance}><span>Continue</span><i aria-hidden="true">→</i></button>
      </div>
    </StudyFrame>;
  }

  const currentPrompt=activeStep;
  const misconceptionNote=feedback?.result==="incorrect"?e06FoilCorrection(currentPrompt,response):undefined;
  const hasListeningCue=Boolean(currentPrompt.audio||currentPrompt.speechSynthesisText);
  const answerLocked=hasListeningCue&&!audioPlayed;
  const interactionLocked=answerLocked||audioState==="playing";

  async function submit(value=response){
    if(!value.trim()||feedback||savingRef.current||interactionLocked)return;
    if(e08Revision&&(!e08DraftReference.trim()||value.trim()===e08DraftReference.trim()))return;
    if(e12Revision&&(!e12DraftReference.trim()||value.trim()===e12DraftReference.trim()))return;
    if(e19Revision&&(!e19StoredDraft.trim()||value.trim()===e19StoredDraft.trim()))return;
    const grade=gradeStudyPrompt(currentPrompt,value);
    setSaving(true);
    savingRef.current=true;
    setSaveError(false);
    try{
      await onAnswer({
        prompt:currentPrompt,
        response:value,
        grade,
        responseTimeMs:Math.max(0,Math.round(performance.now()-startedAt.current)),
      });
      if(currentPrompt.eventMetadata?.e06===true&&currentPrompt.promptType==="textarea"&&currentPrompt.id.endsWith("-write")){
        setE08FirstDraft(value);
      }
      if(currentPrompt.eventMetadata?.e11Task==="independent-letter"&&currentPrompt.promptType==="textarea"){
        setE12FirstDraft(value);
      }
      clearE07Draft(accountScope,currentPrompt);
      setDraftNotice("idle");
      setResponse(value);
      setFeedback(grade);
      j9SensoryFeedback(grade.result==="correct"?"success":"correction");
    }catch{
      setSaveError(true);
    }finally{
      savingRef.current=false;
      setSaving(false);
    }
  }

  return <StudyFrame mode={mode} theme={theme} season={season} index={index} total={steps.length} completed={Boolean(feedback)} onExit={()=>{if(!savingRef.current)onExit();}} onTheme={toggleTheme}>
    {ux1Cafe?<UX1CafeHeader steps={steps} index={index}/>:null}
    {draftEnabled&&restorableIndex>index?<div className="e07-draft-resume" role="status"><p>Continue unfinished unscored production from this device; earlier prompts are not marked completed by this shortcut.</p><button type="button" onClick={resumeIndependentDraft}>Resume saved draft <span aria-hidden="true">→</span></button></div>:null}
    <div className={"j5-sheet j5-sheet--"+mode.mode}>
      <div className="j5-sheet__cap">
        <span className="eyebrow">{currentPrompt.instruction.toUpperCase()}</span>
        <span className="j5-sheet__counter">{index+1} / {steps.length}</span>
      </div>

      {remainingSeconds!==null?<div className={"timed-prompt j5-timer "+(remainingSeconds===0?"expired":"")}>
        <span>Timed response</span>
        <strong>{remainingSeconds>0?remainingSeconds+"s remaining":"time target elapsed"}</strong>
        <small>Submissions after the target are still accepted but recorded as outside the time limit.</small>
      </div>:null}

      {hasListeningCue
        ?<div className="audio-question j5-listening">
          <p className="audio-question-label">{currentPrompt.prompt}</p>
          {currentPrompt.speechSynthesisText&&!currentPrompt.audio?<p className="audio-source-label">Device Japanese voice · synthesized listening cue</p>:null}
          <button
            className="audio-play j5-audio-orb"
            type="button"
            aria-label={audioPlayed?"Replay Japanese audio":"Play Japanese audio"}
            disabled={audioState==="playing"}
            onClick={()=>void playAudio("normal")}
          >
            <span className="j5-audio-orb__glyph" aria-hidden="true">{audioState==="playing"?"…":"聴"}</span>
            <span>{audioState==="playing"?"Playing…":audioPlayed?"Replay":"Play audio"}</span>
          </button>
          <div className="audio-tools j5-audio-tools" aria-label="Audio playback controls">
            <button type="button" disabled={audioState==="playing"} onClick={()=>void playAudio("slow")}>Slower</button>
            <button type="button" disabled={audioState==="playing"} onClick={()=>void playAudio("shadow")}>Shadow ×2</button>
          </div>
          {audioState==="error"?<div className="audio-error j5-audio-error" role="status">
            <p>Audio is not available yet. Retry when connected, or skip this listening item without creating mastery evidence.</p>
            <button className="quiet-button audio-skip" type="button" onClick={advance}>Skip for now</button>
          </div>:null}
        </div>
        :<div className={"j5-prompt j5-prompt--"+mode.mode} lang={currentPrompt.promptLanguage}>{currentPrompt.prompt}</div>}

      {currentPrompt.promptType==="choice"
        ?<div className="j5-choices">{currentPrompt.choices.map((choice,index)=><button
          disabled={Boolean(feedback)||saving||interactionLocked}
          type="button"
          key={choice}
          onClick={()=>void submit(choice)}
        ><span className="j5-choice-index" aria-hidden="true">{index+1}</span><span>{choice}</span></button>)}</div>
        :currentPrompt.promptType==="textarea"
          ?<form className="productive-response j5-writing" onSubmit={(event)=>{event.preventDefault();void submit();}}>
            {e11OptionalWriting?<section className="e11-self-review" aria-label="Independent Japanese writing self-review">
              <h2>Write for your audience, then revise</h2>
              <p>Recipient: {String(currentPrompt.eventMetadata?.e11Audience??"the stated real-world reader")}. These optional checks are questions to ask yourself, not automatic assessments.</p>
              {Array.isArray(currentPrompt.eventMetadata?.e11WritingChecks)?currentPrompt.eventMetadata.e11WritingChecks.map((item,i)=>{
                if(!item||typeof item!=="object"||typeof item.question!=="string"||typeof item.heading!=="string")return null;
                const key="e11-"+i;
                return <label key={key}><input type="checkbox" checked={e08Checks.includes(key)}
                  onChange={(event)=>{const checked=event.target.checked;setE08Checks(old=>checked?[...old,key]:old.filter(v=>v!==key));}}/>
                  <span><strong>{item.heading}</strong> {item.question}{typeof item.repair==="string"?<small>{item.repair}</small>:null}</span></label>;
              }):null}
              <small>Ticking a box confirms only that you reviewed the question. It does not verify grammar, meaning, politeness or level.</small>
            </section>:null}
            {e12Revision?<div className="e08-revision e12-revision" aria-label="Compare and revise your optional Japanese message">
              <h2>Second message · revise your own E11 writing</h2>
              {e12DraftReference?<div className="e08-revision__previous">
                <strong>E11 first draft · private, original learner text</strong>
                <pre lang="ja">{e12DraftReference}</pre>
                <button type="button" className="quiet-button" disabled={Boolean(feedback)||saving} onClick={()=>updateResponse(e12DraftReference)}>Use my first draft as a starting point</button>
              </div>:<div className="e08-revision__previous"><p role="status">No submitted E11 first draft is available for this learner and case. The revision cannot be recorded without it.</p>
                {e12FirstIndex>=0?<button type="button" onClick={()=>{setIndex(e12FirstIndex);setFeedback(null);setResponse("");setSaveError(false);setE08Checks([]);}}>Return to the first E11 message</button>:null}
              </div>}
              <div className="e08-revision__checks"><p>Review the original recipient, factual constraints and politeness; checks are not language grades.</p>
                {Array.isArray(currentPrompt.eventMetadata?.e11WritingChecks)?currentPrompt.eventMetadata.e11WritingChecks.map((item,i)=>{
                  if(!item||typeof item!=="object"||typeof item.question!=="string"||typeof item.heading!=="string")return null;
                  const key="e12-"+i;
                  return <label key={key}><input type="checkbox" checked={e08Checks.includes(key)}
                    onChange={(event)=>setE08Checks(old=>event.target.checked?[...old,key]:old.filter(v=>v!==key))}/>
                    <span><strong>{item.heading}</strong> {item.question}{typeof item.repair==="string"?<small>{item.repair}</small>:null}</span></label>;
                }):null}
              </div>
              {e12Unchanged?<p role="status">Both messages are identical. Change the draft deliberately before recording a revision; a change alone does not demonstrate accuracy.</p>:null}
              <p className="e11-practice-disclaimer">Optional unscored writing only. Your original StudyEvents remain account-bound; this revision does not affect FSRS or CEFR proficiency.</p>
            </div>:null}
            {e19Revision?<section className="e08-revision e19-revision" aria-label="Source-grounded independent Japanese writing revision">
              <h2>Revise your first original Japanese message</h2>
              {e19StoredDraft?<div className="e08-revision__previous"><strong>First draft · private original source response</strong><pre lang="ja">{e19StoredDraft}</pre>
                <button type="button" className="quiet-button" disabled={Boolean(feedback)||saving}
                  onClick={()=>updateResponse(e19StoredDraft)}>Use my original as a starting point</button></div>
               :<p role="status">The original source draft is not available for this account. The revision cannot be recorded.</p>}
              <div className="e08-revision__checks"><p>Compare with the original source. These are self-review questions, not validated writing feedback.</p>
                {Array.isArray(currentPrompt.eventMetadata?.e19WritingChecks)?currentPrompt.eventMetadata.e19WritingChecks.map((item,i)=>{
                  if(!item||typeof item!=="object"||typeof item.question!=="string"||typeof item.heading!=="string")return null;
                  const key="e19-"+i;
                  return <label key={key}><input type="checkbox" checked={e08Checks.includes(key)}
                    onChange={event=>setE08Checks(old=>event.target.checked?[...old,key]:old.filter(v=>v!==key))}/>
                    <span><strong>{item.heading}</strong> {item.question}{typeof item.repair==="string"?<small>{item.repair}</small>:null}</span></label>;
                }):null}
              </div>
              {e19Unchanged?<p role="status">This text still matches the original draft. Make a deliberate revision before recording; a difference alone is not a language score.</p>:null}
              <p className="e11-practice-disclaimer">Optional second Japanese message. Original source and learner IDs are preserved; no scheduler or CEFR grade is created.</p>
            </section>:null}
            {e08Revision?<div className="e08-revision" aria-label="Compare and revise your Japanese writing">
              <h2>Second draft · compare before sending</h2>
              {e08DraftReference?<div className="e08-revision__previous"><strong>First draft · your own Japanese</strong><pre lang="ja">{e08DraftReference}</pre>
                <button type="button" className="quiet-button" disabled={Boolean(feedback)||saving} onClick={()=>updateResponse(e08DraftReference)}>Use as starting text</button></div>
              :<div className="e08-revision__previous"><p role="status">A submitted first draft is required before this revision can be compared. Return to the first draft instead of creating a fake revision.</p>
                {e08FirstIndex>=0?<button type="button" onClick={()=>{setIndex(e08FirstIndex);setFeedback(null);setResponse("");setE08Checks([]);}}>Return to first draft</button>:null}</div>}
              <div className="e08-revision__checks"><p>Use these questions as self-review, not automatic correctness marks:</p>
                {Array.isArray(currentPrompt.eventMetadata?.e08RevisionChecks)?currentPrompt.eventMetadata.e08RevisionChecks.map((item,i)=>{
                  if(!item||typeof item!=="object"||typeof item.question!=="string"||typeof item.heading!=="string")return null;
                  const key=String(i);
                  return <label key={key}><input type="checkbox" checked={e08Checks.includes(key)} onChange={(event)=>{const checked=event.target.checked;setE08Checks(old=>checked?[...old,key]:old.filter(v=>v!==key));}}/>
                    <span><strong>{item.heading}</strong> {item.question}{typeof item.fix==="string"?<small>{item.fix}</small>:null}</span></label>;
                }):null}
              </div>
              {e08Unchanged?<p role="status">Your two drafts are identical. Revise at least one detail before submitting; changed text is not proof of linguistic accuracy.</p>:null}
            </div>:null}
            <div className="j5-writing__paper">
              <textarea autoFocus disabled={Boolean(feedback)||saving||interactionLocked} value={response} onChange={(event)=>updateResponse(event.target.value)} maxLength={E07_DRAFT_LIMIT} placeholder={currentPrompt.placeholder??"日本語で書いてください…"} rows={7}/>
            </div>
            <div className="productive-response-meta">
              <span>{response.length} characters{currentPrompt.minimumCharacters?" · target "+currentPrompt.minimumCharacters+"+":""}</span>
              <button className="primary" disabled={!response.trim()||Boolean(feedback)||saving||interactionLocked||(e08Revision&&(!e08DraftReference.trim()||e08Unchanged))||(e12Revision&&(!e12DraftReference.trim()||e12Unchanged))||(e19Revision&&(!e19StoredDraft.trim()||e19Unchanged))} type="submit">{e19Revision?"Record E19 unscored revision":e12Revision?"Record E12 unscored revision":e08Revision?"Record unscored second draft":e11OptionalWriting?"Record unscored E11 writing":currentPrompt.eventMetadata?.nonAuthoritative===true?"Record unscored writing":"Check structure"}</button>
            </div>
            {(e11OptionalWriting||e12Revision)?<button type="button" className="quiet-button e11-skip" disabled={saving||interactionLocked} onClick={advance}>Skip optional {e12Revision?"revision":"writing"} without grading</button>:null}
          </form>
          :currentPrompt.promptType==="speech"
            ?<div className="speech-response j5-speaking">
              <button className="primary j5-speak-button" disabled={Boolean(feedback)||saving||interactionLocked||speechState==="listening"} type="button" onClick={startSpeechRecognition}>
                <span aria-hidden="true">{speechState==="listening"?"…":"話"}</span>
                <strong>{speechState==="listening"?"Listening…":response?"Speak again":"Start speaking"}</strong>
              </button>
              {response?<div className="speech-transcript j5-speech-transcript"><span>Recognized transcript</span><strong lang="ja">{response}</strong></div>:null}
              {speechState==="unsupported"?<p className="audio-error">Japanese speech recognition is not available in this browser. Skip this item; no speaking mastery will be recorded.</p>:null}
              {speechState==="error"?<p className="audio-error">Speech recognition failed. Try again or skip without recording speaking mastery.</p>:null}
              <div className="speech-actions">
                {response?<button className="unit-action" disabled={Boolean(feedback)||saving||interactionLocked} type="button" onClick={()=>void submit(response)}>Check transcript</button>:null}
                <button className="quiet-button" type="button" onClick={advance}>Skip for now</button>
              </div>
            </div>
            :<form className="j5-typed-form" onSubmit={(event)=>{event.preventDefault();void submit();}}>
              <input autoFocus disabled={Boolean(feedback)||saving||interactionLocked} value={response} onChange={(event)=>updateResponse(event.target.value)} placeholder={currentPrompt.placeholder}/>
              <button className="primary" disabled={!response.trim()||Boolean(feedback)||saving||interactionLocked} type="submit">Check</button>
            </form>}

      {e11OptionalPractice&&!feedback&&currentPrompt.promptType==="choice"?<div className="e11-optional-note">
        <p>Additional original context. Your choice is stored as unscored practice only and does not satisfy the eight required FSRS cues.</p>
        <button type="button" className="quiet-button" onClick={advance}>Skip optional context without grading</button>
      </div>:null}
      {eligibleE07Draft(currentPrompt)&&!feedback?<div className="e07-draft-controls">
        <label><input type="checkbox" checked={draftEnabled} onChange={event=>changeDraftPreference(event.target.checked)}/> Keep unfinished ungraded writing or recognized speech text on this device</label>
        <p>Optional. Stored locally, unencrypted and scoped to this learner account. Not synced, not an assessment, and no audio is stored. Turning this off clears E07 drafts for this account.</p>
        {draftEnabled&&draftNotice==="restored"?<p role="status">Your previous unsent draft was restored on this device.</p>:null}
        {draftEnabled&&draftNotice==="saved"?<p role="status">Draft saved locally.</p>:null}
        {draftNotice==="unavailable"?<p role="alert">This browser could not keep the draft. Copy your text before leaving.</p>:null}
        {draftEnabled&&response.trim()?<button type="button" className="quiet-button" onClick={clearCurrentDraft}>Discard this local draft</button>:null}
      </div>:null}
      {saveError?<p className="audio-error" role="alert">This answer was not saved on your device. Check browser storage and retry.</p>:null}
      {hasListeningCue&&!audioPlayed&&audioState!=="error"?<p className="audio-gate j5-audio-gate">Play the listening cue before answering.</p>:null}

      {feedback?<div className={"j5-feedback "+feedback.result}>
        <div className="j5-feedback__head">
          <span className="j5-feedback__seal" aria-hidden="true">{feedback.result==="correct"?"正":"直"}</span>
          <div>
            <small>{currentPrompt.eventMetadata?.nonAuthoritative===true?(currentPrompt.promptType==="choice"?"UNSCORED CONTEXT CHECK":"UNSCORED RESPONSE"):feedback.result==="correct"?"RETRIEVED":"CORRECTION"}</small>
            <strong>{currentPrompt.eventMetadata?.nonAuthoritative===true?(currentPrompt.promptType==="choice"?(feedback.result==="correct"?"Context matched · not a mastery grade":"Recheck the new context · not an FSRS grade"):"Response recorded · no language grade"):feedback.result==="correct"?"Correct":"Answer: "+feedback.expectedAnswer}</strong>
          </div>
        </div>
        {currentPrompt.audio?<div className="audio-reveal j5-audio-reveal">
          <span lang="ja">{currentPrompt.audio.text}</span>
          {currentPrompt.audio.reading?<small lang="ja">{currentPrompt.audio.reading}</small>:null}
        </div>:null}
        {currentPrompt.explanation?<p>{currentPrompt.explanation}</p>:null}
        {misconceptionNote?<p className="e06-correction"><strong>Why that option does not fit:</strong> {misconceptionNote}</p>:null}
        {currentPrompt.eventMetadata?.e11===true&&currentPrompt.eventMetadata?.nonAuthoritative===true?<p className="e11-practice-disclaimer">E11 practice is independent of the eight required source-linked prompts. A recorded attempt, even with a correct bounded answer, is not Japanese proficiency or FSRS mastery.</p>:null}
        {currentPrompt.eventMetadata?.e06===true?<p className="e06-boundary">{currentPrompt.eventMetadata.e06Stage==="delayed"?"Changed-context bounded retrieval—not formal proficiency.":currentPrompt.eventMetadata.nonAuthoritative===true?(currentPrompt.promptType==="choice"?"Optional comprehension evidence only: no original FSRS or CEFR award.":"Unscored response: device recognition and structural checks cannot grade meaning or pronunciation."):"Controlled response: independent communication is practised separately."}</p>:null}
        {currentPrompt.eventMetadata?.e05Repair===true?<p className="e05-feedback">Changed-question correction: this answer is saved as original practice but does not alter the FSRS card for your previously missed cue. Revisit the original cue on its normal schedule.</p>:null}
        {currentPrompt.eventMetadata?.e05Repair!==true&&(currentPrompt.eventMetadata?.e01===true||currentPrompt.eventMetadata?.e02===true||currentPrompt.eventMetadata?.e03===true||currentPrompt.eventMetadata?.e04===true)?<p className="e05-feedback">{currentPrompt.promptType==="typed"?"Answer choices removed: bounded model recall.":currentPrompt.promptType==="choice"?"Guided recognition; later independent recall and delayed transfer remove the choices.":"This structural-only task does not prove pronunciation or semantic proficiency."}</p>:null}
        {(currentPrompt.promptType==="textarea"||currentPrompt.promptType==="speech")&&currentPrompt.requiredTerms?.length?<p className="productive-rubric">
          Structural check: include at least 60% of these targets: {currentPrompt.requiredTerms.join(" · ")}. This is not a full semantic or pronunciation score.
        </p>:null}
        <button className="primary j5-next" type="button" onClick={advance}>
          <span>{index+1>=steps.length?"Finish":"Continue"}</span><i aria-hidden="true">→</i>
        </button>
      </div>:null}
    </div>
  </StudyFrame>;
}

function StudyFrame({
  mode,theme,season,index,total,completed,onExit,onTheme,children,
}:{
  mode:J5StudyModeMeta;
  theme:JTheme;
  season:JSeason;
  index:number;
  total:number;
  completed:boolean;
  onExit:()=>void;
  onTheme:()=>void;
  children:ReactNode;
}){
  return <section className={"j5-study j5-study--"+mode.mode} data-j-theme={theme} data-j-season={season} data-j-study-mode={mode.mode} aria-live="polite">
    <div className="j5-study__ambient" aria-hidden="true">
      <J10SeasonalWorld season={season} compact/>
      <span className="j5-study__enso"/>
      <span className="j5-study__brush j5-study__brush--a"/>
      <span className="j5-study__brush j5-study__brush--b"/>
      <span className="j5-study__grid"/>
    </div>
    <StudyHeader mode={mode} theme={theme} index={index} total={total} completed={completed} onExit={onExit} onTheme={onTheme}/>
    <div className="j5-stage">
      <aside className="j5-mode-rail" aria-label={mode.english+" study mode"}>
        <span className="j5-mode-rail__glyph" aria-hidden="true" lang="ja">{mode.glyph}</span>
        <span className="j5-mode-rail__jp" lang="ja">{mode.japanese}</span>
        <span className="j5-mode-rail__en">{mode.english}</span>
        <i/>
        <small>{mode.note}</small>
      </aside>
      <div className="j5-stage__content">{children}</div>
    </div>
  </section>;
}

function StudyHeader({
  mode,theme,index,total,completed,onExit,onTheme,
}:{
  mode:J5StudyModeMeta;
  theme:JTheme;
  index:number;
  total:number;
  completed:boolean;
  onExit:()=>void;
  onTheme:()=>void;
}){
  const pct=((index+(completed?1:0))/Math.max(1,total))*100;
  return <>
    <header className="j5-study-head">
      <button className="quiet-button j5-exit" type="button" onClick={onExit}><span aria-hidden="true">←</span><span>Exit</span></button>
      <div className="j5-study-head__mode">
        <span lang="ja">{mode.japanese}</span>
        <i/>
        <strong>{mode.english}</strong>
      </div>
      <div className="j5-study-head__right">
        <span className="j5-step-count">{index+1} / {total}</span>
        <button className="j5-study-theme" type="button" aria-label={theme==="light"?"Use dark theme":"Use light theme"} onClick={onTheme}>{theme==="light"?"墨":"紙"}</button>
      </div>
    </header>
    <div className="j5-study-progress" aria-hidden="true"><span style={{width:pct+"%"}}/></div>
  </>;
}

function speakWithDevice(text:string,rate:number,repeats:number,lang:string):Promise<void>{
  return new Promise((resolve,reject)=>{
    if(typeof speechSynthesis==="undefined"){reject(new Error("SPEECH_SYNTHESIS_UNAVAILABLE"));return;}
    let remaining=Math.max(1,repeats);
    const play=()=>{
      const utterance=new SpeechSynthesisUtterance(text);
      utterance.lang=lang;
      utterance.rate=rate;
      const voice=speechSynthesis.getVoices().find((item)=>item.lang.toLowerCase().startsWith("ja"));
      if(voice)utterance.voice=voice;
      utterance.onerror=()=>reject(new Error("SPEECH_SYNTHESIS_FAILED"));
      utterance.onend=()=>{
        remaining-=1;
        if(remaining>0)setTimeout(play,450);
        else resolve();
      };
      speechSynthesis.speak(utterance);
    };
    speechSynthesis.cancel();
    play();
  });
}
