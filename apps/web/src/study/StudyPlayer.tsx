import { useRef, useState } from "react";
import { gradeStudyPrompt, isStudyLesson, type GradeResult, type StudyPrompt, type StudyStep } from "@thiepn/study-player";

export interface StudyAnswer{prompt:StudyPrompt;response:string;grade:GradeResult;responseTimeMs:number;}

export function StudyPlayer({steps,onAnswer,onComplete,onExit}:{steps:StudyStep[];onAnswer:(answer:StudyAnswer)=>Promise<void>|void;onComplete:()=>void;onExit:()=>void;}){
  const [index,setIndex]=useState(0);
  const [response,setResponse]=useState("");
  const [feedback,setFeedback]=useState<GradeResult|null>(null);
  const [saving,setSaving]=useState(false);
  const startedAt=useRef(performance.now());
  const step=steps[index];
  if(!step)return null;

  function advance(){
    if(index+1>=steps.length){onComplete();return;}
    setIndex((value)=>value+1);setResponse("");setFeedback(null);startedAt.current=performance.now();
  }

  if(isStudyLesson(step)){
    return <section className="study-player" aria-live="polite"><StudyHeader index={index} total={steps.length} completed={false} onExit={onExit}/><div className="study-card study-lesson"><p className="eyebrow">LEARN</p><h1>{step.title}</h1><p className="lesson-body">{step.body}</p>{step.examples?.length?<div className="lesson-examples">{step.examples.map((example)=><div key={`${example.expression}:${example.note}`}><strong lang="ja">{example.expression}</strong><span>{example.note}</span></div>)}</div>:null}<button className="primary" type="button" onClick={advance}>Continue</button></div></section>;
  }

  const currentPrompt=step;
  async function submit(value=response){
    if(!value.trim()||feedback||saving)return;
    const grade=gradeStudyPrompt(currentPrompt,value);setSaving(true);
    try{await onAnswer({prompt:currentPrompt,response:value,grade,responseTimeMs:Math.max(0,Math.round(performance.now()-startedAt.current))});setResponse(value);setFeedback(grade);}finally{setSaving(false);}
  }

  return <section className="study-player" aria-live="polite"><StudyHeader index={index} total={steps.length} completed={Boolean(feedback)} onExit={onExit}/><div className="study-card"><p className="eyebrow">{currentPrompt.instruction.toUpperCase()}</p><div className="study-prompt" lang={currentPrompt.promptLanguage}>{currentPrompt.prompt}</div>{currentPrompt.promptType==="choice"?<div className="study-choices">{currentPrompt.choices.map((choice)=><button disabled={Boolean(feedback)||saving} type="button" key={choice} onClick={()=>void submit(choice)}>{choice}</button>)}</div>:<form onSubmit={(event)=>{event.preventDefault();void submit();}}><input autoFocus disabled={Boolean(feedback)||saving} value={response} onChange={(event)=>setResponse(event.target.value)} placeholder={currentPrompt.placeholder}/><button className="primary" disabled={!response.trim()||Boolean(feedback)||saving} type="submit">Check</button></form>}{feedback&&<div className={`study-feedback ${feedback.result}`}><strong>{feedback.result==="correct"?"Correct":`Answer: ${feedback.expectedAnswer}`}</strong>{currentPrompt.explanation&&<p>{currentPrompt.explanation}</p>}<button className="primary" type="button" onClick={advance}>{index+1>=steps.length?"Finish":"Continue"}</button></div>}</div></section>;
}

function StudyHeader({index,total,completed,onExit}:{index:number;total:number;completed:boolean;onExit:()=>void}){
  return <><header className="study-head"><button className="quiet-button" type="button" onClick={onExit}>Exit</button><span>{index+1} / {total}</span></header><div className="study-progress"><span style={{width:`${((index+(completed?1:0))/total)*100}%`}}/></div></>;
}
