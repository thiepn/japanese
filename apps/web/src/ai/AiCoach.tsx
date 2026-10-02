import { useMemo,useRef,useState } from "react";
import { createHttpCoachTransport,type CoachFeedback,type CoachHistoryTurn,type CoachMode,type CoachResponse } from "@thiepn/coach";
import { saveStudyEvent } from "@thiepn/local-db";
import { productiveTasks } from "../coreContent";
import { DEVELOPMENT_ACCOUNT_ID,DEVELOPMENT_DEVICE_ID } from "../study/runtime";

type InputMode="text"|"speech";
const endpoint=import.meta.env.VITE_JAPANESE_COACH_ENDPOINT??"/api/japanese/coach";

export function AiCoach(){
  const transport=useMemo(()=>createHttpCoachTransport(endpoint),[]);
  const [mode,setMode]=useState<CoachMode>("conversation");
  const [text,setText]=useState("");
  const [history,setHistory]=useState<CoachHistoryTurn[]>([]);
  const [last,setLast]=useState<CoachResponse|null>(null);
  const [status,setStatus]=useState<"idle"|"sending"|"error">("idle");
  const [speechState,setSpeechState]=useState<"idle"|"listening"|"unsupported"|"error">("idle");
  const [inputMode,setInputMode]=useState<InputMode>("text");
  const sessionId=useRef(crypto.randomUUID());
  const conversationTask=productiveTasks.find((task)=>task.level==="B2"&&task.tags.includes("ai-conversation"));
  const writingTask=productiveTasks.find((task)=>task.level==="B2"&&task.tags.includes("writing-revision"));
  const activeTask=mode==="conversation"?conversationTask:writingTask;
  const scenario=activeTask?.situation??(mode==="conversation"?"Discuss a current everyday issue and support your view with reasons and examples.":"Write and revise a connected B2-level response.");
  const goals=activeTask?.requiredTerms?.length?activeTask.requiredTerms:["clear stance","supporting reason","appropriate register"];

  async function submit(){
    const learnerText=text.trim();if(!learnerText||status==="sending")return;
    setStatus("sending");
    try{
      const response=await transport.evaluate({
        sessionId:sessionId.current,mode,targetLevel:"B2",learnerText,history,scenario,goals,
        register:mode==="conversation"?"neutral":"formal"
      });
      const nextHistory:CoachHistoryTurn[]=mode==="conversation"
        ?[...history,{role:"learner",text:learnerText},{role:"coach",text:response.replyJapanese}]
        :history;
      setHistory(nextHistory.slice(-12));setLast(response);setText("");setStatus("idle");
      await saveStudyEvent({
        id:crypto.randomUUID(),userId:DEVELOPMENT_ACCOUNT_ID,deviceId:DEVELOPMENT_DEVICE_ID,
        occurredAt:new Date().toISOString(),activity:mode==="conversation"?"speaking":"writing",
        primaryTarget:{kind:"production_task",id:activeTask?.id??(mode==="conversation"?"b2-production-conversation-01":"b2-production-writing-01")},
        skillDimension:mode==="conversation"?"production":"writing_quality",
        promptFamily:"ai-coach-"+mode,responseMode:"ai-coach-"+inputMode,result:"skipped",
        contextId:"ai-coach-"+sessionId.current,sourceId:"thiepn-original",
        metadata:{
          coachSessionId:sessionId.current,mode,targetLevel:"B2",learnerText,coachReply:response.replyJapanese,
          feedback:response.feedback,evidenceContract:response.evidenceContract,
          modelFeedbackAppliedToMastery:false
        }
      });
    }catch{setStatus("error");}
  }

  function switchMode(next:CoachMode){
    setMode(next);setText("");setLast(null);setHistory([]);setStatus("idle");sessionId.current=crypto.randomUUID();
  }

  function startSpeech(){
    const w=window as unknown as {
      SpeechRecognition?:new()=>{lang:string;interimResults:boolean;continuous:boolean;start():void;onresult:((event:{results:ArrayLike<{0?:{transcript?:string}}>} )=>void)|null;onerror:(()=>void)|null;onend:(()=>void)|null};
      webkitSpeechRecognition?:new()=>{lang:string;interimResults:boolean;continuous:boolean;start():void;onresult:((event:{results:ArrayLike<{0?:{transcript?:string}}>} )=>void)|null;onerror:(()=>void)|null;onend:(()=>void)|null};
    };
    const Recognition=w.SpeechRecognition??w.webkitSpeechRecognition;
    if(!Recognition){setSpeechState("unsupported");return;}
    const recognition=new Recognition();recognition.lang="ja-JP";recognition.interimResults=false;recognition.continuous=false;
    recognition.onresult=(event)=>{const transcript=event.results[0]?.[0]?.transcript?.trim()??"";if(transcript){setText(transcript);setInputMode("speech");}};
    recognition.onerror=()=>setSpeechState("error");
    recognition.onend=()=>setSpeechState((state)=>state==="error"?state:"idle");
    setSpeechState("listening");try{recognition.start();}catch{setSpeechState("error");}
  }

  return <section className="ai-coach-card">
    <div className="section-heading"><div><span className="course-kicker">B2 INDEPENDENT COMMUNICATION</span><h2>AI conversation & revision coach</h2></div><span className="status-pill">advisory</span></div>
    <p className="coach-explainer">Model feedback is kept separate from durable learner mastery. It can suggest corrections and next revisions, but it cannot silently mark grammar, writing or speaking as mastered. No acoustic pronunciation score is claimed.</p>
    <div className="coach-mode" role="tablist" aria-label="Coach mode">
      <button className={mode==="conversation"?"active":""} type="button" onClick={()=>switchMode("conversation")}>Conversation</button>
      <button className={mode==="writing_revision"?"active":""} type="button" onClick={()=>switchMode("writing_revision")}>Writing revision</button>
    </div>
    <div className="coach-scenario"><small>Scenario</small><p>{scenario}</p></div>
    {mode==="conversation"&&history.length?<div className="coach-thread">{history.map((turn,index)=><div className={"coach-turn "+turn.role} key={index}><span>{turn.role==="learner"?"You":"Coach"}</span><p lang="ja">{turn.text}</p></div>)}</div>:null}
    <label className="coach-input"><span>{mode==="conversation"?"Respond in Japanese":"Draft or paste your Japanese response"}</span><textarea rows={mode==="conversation"?4:8} value={text} onChange={(event)=>{setText(event.target.value);setInputMode("text");}} placeholder="日本語で書いてください…"/></label>
    <div className="coach-actions">
      {mode==="conversation"?<button className="unit-action" type="button" disabled={status==="sending"||speechState==="listening"} onClick={startSpeech}>{speechState==="listening"?"Listening…":"Use microphone"}</button>:null}
      <button className="primary" type="button" disabled={!text.trim()||status==="sending"} onClick={()=>void submit()}>{status==="sending"?"Getting feedback…":mode==="conversation"?"Send turn":"Review draft"}</button>
    </div>
    {speechState==="unsupported"?<p className="coach-warning">Japanese speech recognition is unavailable in this browser. Typed conversation remains available.</p>:null}
    {speechState==="error"?<p className="coach-warning">Speech recognition failed. Retry or use text input.</p>:null}
    {status==="error"?<p className="coach-warning">The AI coach endpoint is unavailable. No learner evidence was changed. Configure <code>VITE_JAPANESE_COACH_ENDPOINT</code> to a server-side coach route and try again.</p>:null}
    {last?<FeedbackPanel response={last}/>:null}
  </section>;
}

function FeedbackPanel({response}:{response:CoachResponse}){
  return <div className="coach-feedback">
    <div className="coach-reply"><span>{response.evidenceContract.provider}</span><p lang="ja">{response.replyJapanese}</p>{response.replyEnglishHint?<details><summary>English hint</summary><p>{response.replyEnglishHint}</p></details>:null}</div>
    <div className="coach-feedback-grid">
      <FeedbackArea title="Grammar" area={response.feedback.grammar}/>
      <FeedbackArea title="Vocabulary" area={response.feedback.vocabulary}/>
      <FeedbackArea title="Coherence" area={response.feedback.coherence}/>
      <FeedbackArea title="Task achievement" area={response.feedback.taskAchievement}/>
    </div>
    {response.revisionPrompt?<div className="coach-revision"><strong>Next revision</strong><p>{response.revisionPrompt}</p></div>:null}
    <p className="course-note">AI feedback is advisory only · mastery unchanged · acoustic analysis: off</p>
  </div>;
}
function FeedbackArea({title,area}:{title:string;area:CoachFeedback[keyof CoachFeedback]}){
  return <article><div><strong>{title}</strong><span>{Math.round(area.confidence*100)}% feedback confidence</span></div><p>{area.summary}</p>{area.items.length?<ul>{area.items.map((item,index)=><li key={index}>{item.original&&item.suggestion?<><code>{item.original}</code> → <code>{item.suggestion}</code> — </>:null}{item.message}{item.explanation?" "+item.explanation:""}</li>)}</ul>:null}</article>;
}
