import {useEffect,useRef,useState,type ReactNode} from "react";
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

export function StudyPlayer({steps,onAnswer,onComplete,onExit}:{steps:StudyStep[];onAnswer:(answer:StudyAnswer)=>Promise<void>|void;onComplete:()=>void;onExit:()=>void;}){
  const [index,setIndex]=useState(0);
  const [response,setResponse]=useState("");
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
  const mode=j5StudyMode(activeStep);
  const timeLimitSeconds=!isStudyLesson(activeStep)?activeStep.timeLimitSeconds:undefined;
  const elapsedSeconds=Math.max(0,Math.floor((performance.now()-startedAt.current)/1000));
  const remainingSeconds=timeLimitSeconds===undefined?null:Math.max(0,timeLimitSeconds-elapsedSeconds);
  void timerTick;

  function advance(){
    audioProvider.current.stop();
    if(index+1>=steps.length){onComplete();return;}
    setIndex((value)=>value+1);
    setResponse("");
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
      if(transcript)setResponse(transcript);
    };
    recognition.onerror=()=>setSpeechState("error");
    recognition.onend=()=>setSpeechState((value)=>value==="error"?value:"idle");
    setSpeechState("listening");
    try{recognition.start();}catch{stopRecognition();setSpeechState("error");}
  }

  if(isStudyLesson(activeStep)){
    return <StudyFrame mode={mode} theme={theme} season={season} index={index} total={steps.length} completed={false} onExit={onExit} onTheme={toggleTheme}>
      <div className="study-lesson j5-sheet j5-sheet--lesson">
        <div className="j5-sheet__cap">
          <span className="eyebrow">LEARN</span>
          <span className="j5-sheet__counter">{index+1} / {steps.length}</span>
        </div>
        <h1>{activeStep.title}</h1>
        <p className="lesson-body">{activeStep.body}</p>

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
        </div>)}</div>:null}

        {activeStep.sourceLabel?<p className="source-note">Source: {activeStep.sourceLabel}</p>:null}
        <button className="primary j5-next" type="button" onClick={advance}><span>Continue</span><i aria-hidden="true">→</i></button>
      </div>
    </StudyFrame>;
  }

  const currentPrompt=activeStep;
  const hasListeningCue=Boolean(currentPrompt.audio||currentPrompt.speechSynthesisText);
  const answerLocked=hasListeningCue&&!audioPlayed;
  const interactionLocked=answerLocked||audioState==="playing";

  async function submit(value=response){
    if(!value.trim()||feedback||savingRef.current||interactionLocked)return;
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
            <div className="j5-writing__paper">
              <textarea autoFocus disabled={Boolean(feedback)||saving||interactionLocked} value={response} onChange={(event)=>setResponse(event.target.value)} placeholder={currentPrompt.placeholder??"日本語で書いてください…"} rows={7}/>
            </div>
            <div className="productive-response-meta">
              <span>{response.length} characters{currentPrompt.minimumCharacters?" · target "+currentPrompt.minimumCharacters+"+":""}</span>
              <button className="primary" disabled={!response.trim()||Boolean(feedback)||saving||interactionLocked} type="submit">Check structure</button>
            </div>
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
              <input autoFocus disabled={Boolean(feedback)||saving||interactionLocked} value={response} onChange={(event)=>setResponse(event.target.value)} placeholder={currentPrompt.placeholder}/>
              <button className="primary" disabled={!response.trim()||Boolean(feedback)||saving||interactionLocked} type="submit">Check</button>
            </form>}

      {saveError?<p className="audio-error" role="alert">This answer was not saved on your device. Check browser storage and retry.</p>:null}
      {hasListeningCue&&!audioPlayed&&audioState!=="error"?<p className="audio-gate j5-audio-gate">Play the listening cue before answering.</p>:null}

      {feedback?<div className={"j5-feedback "+feedback.result}>
        <div className="j5-feedback__head">
          <span className="j5-feedback__seal" aria-hidden="true">{feedback.result==="correct"?"正":"直"}</span>
          <div>
            <small>{feedback.result==="correct"?"RETRIEVED":"CORRECTION"}</small>
            <strong>{feedback.result==="correct"?"Correct":"Answer: "+feedback.expectedAnswer}</strong>
          </div>
        </div>
        {currentPrompt.audio?<div className="audio-reveal j5-audio-reveal">
          <span lang="ja">{currentPrompt.audio.text}</span>
          {currentPrompt.audio.reading?<small lang="ja">{currentPrompt.audio.reading}</small>:null}
        </div>:null}
        {currentPrompt.explanation?<p>{currentPrompt.explanation}</p>:null}
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
