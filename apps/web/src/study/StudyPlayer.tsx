import { useEffect,useRef,useState } from "react";
import { getDefaultAudioProvider } from "@thiepn/audio";
import { gradeStudyPrompt, isStudyLesson, type GradeResult, type StudyPrompt, type StudyStep } from "@thiepn/study-player";

export interface StudyAnswer{prompt:StudyPrompt;response:string;grade:GradeResult;responseTimeMs:number;}

export function StudyPlayer({steps,onAnswer,onComplete,onExit}:{steps:StudyStep[];onAnswer:(answer:StudyAnswer)=>Promise<void>|void;onComplete:()=>void;onExit:()=>void;}){
  const [index,setIndex]=useState(0);
  const [response,setResponse]=useState("");
  const [feedback,setFeedback]=useState<GradeResult|null>(null);
  const [saving,setSaving]=useState(false);
  const [audioState,setAudioState]=useState<"idle"|"playing"|"error">("idle");
  const [audioPlayed,setAudioPlayed]=useState(false);
  const startedAt=useRef(performance.now());
  const audioProvider=useRef(getDefaultAudioProvider());
  const step=steps[index];

  useEffect(()=>{
    const provider=audioProvider.current;
    provider.stop();
    setAudioState("idle");
    setAudioPlayed(false);
    return()=>provider.stop();
  },[index]);

  if(!step)return null;
  const activeStep=step;

  function advance(){
    audioProvider.current.stop();
    if(index+1>=steps.length){onComplete();return;}
    setIndex((value)=>value+1);setResponse("");setFeedback(null);startedAt.current=performance.now();
  }

  async function playAudio(mode:"normal"|"slow"|"shadow"){
    if(!activeStep.audio||audioState==="playing")return;
    setAudioState("playing");
    try{
      if(mode==="slow")await audioProvider.current.play(activeStep.audio,{rate:.82});
      else if(mode==="shadow")await audioProvider.current.play(activeStep.audio,{rate:.92,repeats:2,gapMs:1200});
      else await audioProvider.current.play(activeStep.audio);
      setAudioPlayed(true);setAudioState("idle");
    }catch{setAudioState("error");}
  }

  if(isStudyLesson(activeStep)){
    return <section className="study-player" aria-live="polite">
      <StudyHeader index={index} total={steps.length} completed={false} onExit={onExit}/>
      <div className="study-card study-lesson">
        <p className="eyebrow">LEARN</p>
        <h1>{activeStep.title}</h1>
        <p className="lesson-body">{activeStep.body}</p>
        {activeStep.audio?<div className="lesson-audio"><button className="audio-inline" type="button" disabled={audioState==="playing"} onClick={()=>void playAudio("normal")}>{audioState==="playing"?"Playing…":audioPlayed?"Replay pronunciation":"Hear pronunciation"}</button><button className="quiet-button audio-inline-slow" type="button" disabled={audioState==="playing"} onClick={()=>void playAudio("slow")}>Slower</button></div>:null}
        {activeStep.facts?.length?<div className="lesson-facts">{activeStep.facts.map((fact)=><div key={fact.label}><span>{fact.label}</span><strong lang={fact.language}>{fact.value}</strong></div>)}</div>:null}
        {activeStep.examples?.length?<div className="lesson-examples">{activeStep.examples.map((example)=><div key={`${example.expression}:${example.note}`}><strong lang="ja">{example.expression}</strong><span>{example.note}</span></div>)}</div>:null}
        {activeStep.sourceLabel?<p className="source-note">Source: {activeStep.sourceLabel}</p>:null}
        <button className="primary study-next" type="button" onClick={advance}>Continue</button>
      </div>
    </section>;
  }

  const currentPrompt=activeStep;
  const answerLocked=Boolean(currentPrompt.audio)&&!audioPlayed;
  const interactionLocked=answerLocked||audioState==="playing";
  async function submit(value=response){
    if(!value.trim()||feedback||saving||interactionLocked)return;
    const grade=gradeStudyPrompt(currentPrompt,value);setSaving(true);
    try{await onAnswer({prompt:currentPrompt,response:value,grade,responseTimeMs:Math.max(0,Math.round(performance.now()-startedAt.current))});setResponse(value);setFeedback(grade);}finally{setSaving(false);}
  }

  return <section className="study-player" aria-live="polite">
    <StudyHeader index={index} total={steps.length} completed={Boolean(feedback)} onExit={onExit}/>
    <div className="study-card">
      <p className="eyebrow">{currentPrompt.instruction.toUpperCase()}</p>
      {currentPrompt.audio?
        <div className="audio-question">
          <p className="audio-question-label">{currentPrompt.prompt}</p>
          <button className="audio-play" type="button" aria-label={audioPlayed?"Replay Japanese audio":"Play Japanese audio"} disabled={audioState==="playing"} onClick={()=>void playAudio("normal")}>{audioState==="playing"?"Playing…":audioPlayed?"Replay":"Play audio"}</button>
          <div className="audio-tools" aria-label="Audio playback controls">
            <button type="button" disabled={audioState==="playing"} onClick={()=>void playAudio("slow")}>Slower</button>
            <button type="button" disabled={audioState==="playing"} onClick={()=>void playAudio("shadow")}>Shadow ×2</button>
          </div>
          {audioState==="error"?<div className="audio-error" role="status"><p>Audio is not available yet. Retry when connected, or skip this listening item without creating mastery evidence.</p><button className="quiet-button audio-skip" type="button" onClick={advance}>Skip for now</button></div>:null}
        </div>
        :<div className="study-prompt" lang={currentPrompt.promptLanguage}>{currentPrompt.prompt}</div>}
      {currentPrompt.promptType==="choice"?
        <div className="study-choices">{currentPrompt.choices.map((choice)=><button disabled={Boolean(feedback)||saving||interactionLocked} type="button" key={choice} onClick={()=>void submit(choice)}>{choice}</button>)}</div>
        :<form onSubmit={(event)=>{event.preventDefault();void submit();}}><input autoFocus disabled={Boolean(feedback)||saving||interactionLocked} value={response} onChange={(event)=>setResponse(event.target.value)} placeholder={currentPrompt.placeholder}/><button className="primary" disabled={!response.trim()||Boolean(feedback)||saving||interactionLocked} type="submit">Check</button></form>}
      {currentPrompt.audio&&!audioPlayed&&audioState!=="error"?<p className="audio-gate">Play the recording before answering.</p>:null}
      {feedback&&<div className={`study-feedback ${feedback.result}`}>
        <strong>{feedback.result==="correct"?"Correct":`Answer: ${feedback.expectedAnswer}`}</strong>
        {currentPrompt.audio?<div className="audio-reveal"><span lang="ja">{currentPrompt.audio.text}</span>{currentPrompt.audio.reading&&<small lang="ja">{currentPrompt.audio.reading}</small>}</div>:null}
        {currentPrompt.explanation&&<p>{currentPrompt.explanation}</p>}
        <button className="primary study-next" type="button" onClick={advance}>{index+1>=steps.length?"Finish":"Continue"}</button>
      </div>}
    </div>
  </section>;
}

function StudyHeader({index,total,completed,onExit}:{index:number;total:number;completed:boolean;onExit:()=>void}){
  return <><header className="study-head"><button className="quiet-button" type="button" onClick={onExit}>Exit</button><span>{index+1} / {total}</span></header><div className="study-progress"><span style={{width:`${((index+(completed?1:0))/total)*100}%`}}/></div></>;
}
