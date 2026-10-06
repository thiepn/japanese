import { useEffect,useMemo,useRef,useState } from "react";
import { createHttpCoachTransport,type CoachFeedback,type CoachHistoryTurn,type CoachLevel,type CoachMode,type CoachResponse } from "@thiepn/coach";
import { listStudyEvents,saveStudyEvent } from "@thiepn/local-db";
import { productiveTasks } from "../coreContent";
import { DEVELOPMENT_ACCOUNT_ID,DEVELOPMENT_DEVICE_ID } from "../study/runtime";
import { scenarioChain,scenarioChainsForLevel,type ScenarioLevel } from "./scenarioChains";

type InputMode="text"|"speech";
interface DelayedRevisionCandidate {
  eventId:string;
  taskId:string;
  learnerText:string;
  at:string;
  delayHours:number;
  feedbackMessages:string[];
  targetLevel:CoachLevel;
}
interface CoachHistorySummary {
  turns:number;
  areaCounts:Record<"grammar"|"vocabulary"|"coherence"|"taskAchievement",number>;
  patterns:Array<{message:string;count:number}>;
  recent:Array<{mode:string;learnerText:string;at:string}>;
  dueRevisions:DelayedRevisionCandidate[];
}
const EMPTY_HISTORY:CoachHistorySummary={turns:0,areaCounts:{grammar:0,vocabulary:0,coherence:0,taskAchievement:0},patterns:[],recent:[],dueRevisions:[]};
const endpoint=import.meta.env.VITE_JAPANESE_COACH_ENDPOINT??"/api/japanese/coach";

export function AiCoach({preferredChainId,onPreferredChainApplied}:{preferredChainId?:string|null;onPreferredChainApplied?:()=>void}={}){
  const transport=useMemo(()=>createHttpCoachTransport(endpoint),[]);
  const [mode,setMode]=useState<CoachMode>("conversation");
  const [text,setText]=useState("");
  const [history,setHistory]=useState<CoachHistoryTurn[]>([]);
  const [last,setLast]=useState<CoachResponse|null>(null);
  const [status,setStatus]=useState<"idle"|"sending"|"error">("idle");
  const [speechState,setSpeechState]=useState<"idle"|"listening"|"unsupported"|"error">("idle");
  const [inputMode,setInputMode]=useState<InputMode>("text");
  const [revisionHistory,setRevisionHistory]=useState<CoachHistorySummary>(EMPTY_HISTORY);
  const [targetLevel,setTargetLevel]=useState<ScenarioLevel>("C1");
  const [chainId,setChainId]=useState(scenarioChainsForLevel("C1")[0]!.id);
  const [delayedRevision,setDelayedRevision]=useState<DelayedRevisionCandidate|null>(null);
  const sessionId=useRef(crypto.randomUUID());
  const learnerTurns=history.filter((turn)=>turn.role==="learner").length;
  const availableChains=scenarioChainsForLevel(targetLevel);
  const chain=scenarioChain(chainId);
  useEffect(()=>{
    if(!preferredChainId)return;
    try{
      const preferred=scenarioChain(preferredChainId);
      setTargetLevel(preferred.level);setChainId(preferred.id);setMode("conversation");setHistory([]);setLast(null);onPreferredChainApplied?.();
    }catch{/* ignore stale cross-surface chain requests */}
  },[preferredChainId,onPreferredChainApplied]);
  const chainStage=chain.stages[Math.min(learnerTurns,chain.stages.length-1)]!;
  const effectiveLevel:CoachLevel=delayedRevision?.targetLevel??targetLevel;
  const conversationTask=productiveTasks.find((task)=>task.level===effectiveLevel&&task.mode==="speaking"&&(effectiveLevel==="B2"?task.tags.includes("ai-conversation"):task.milestoneArea==="spoken_interaction"))
    ??productiveTasks.find((task)=>task.level===effectiveLevel&&task.mode==="speaking");
  const writingTask=productiveTasks.find((task)=>task.level===effectiveLevel&&task.mode==="writing"&&(effectiveLevel==="B2"?task.tags.includes("writing-revision"):task.tags.includes("advanced-production")))
    ??productiveTasks.find((task)=>task.level===effectiveLevel&&task.mode==="writing");
  const delayedTask=delayedRevision?productiveTasks.find((task)=>task.id===delayedRevision.taskId):undefined;
  const activeTask=delayedTask??(mode==="conversation"?conversationTask:writingTask);
  const scenario=mode==="conversation"
    ?chainStage.scenario
    :delayedRevision
      ?"Rewrite a previous "+effectiveLevel+" response after a delay. Preserve the intended meaning, fix high-value recurring issues, and improve coherence without copying a model answer."
      :(activeTask?.situation??"Write and revise a connected "+effectiveLevel+" response.");
  const goals=mode==="conversation"
    ?chainStage.goals
    :delayedRevision
      ?[...new Set([...(activeTask?.requiredTerms??[]),...delayedRevision.feedbackMessages.slice(0,3).map((item)=>"Address prior feedback: "+item)])]
      :(activeTask?.requiredTerms?.length?activeTask.requiredTerms:["clear stance","supporting reason","appropriate register"]);

  async function refreshRevisionHistory(){
    const events=await listStudyEvents(DEVELOPMENT_ACCOUNT_ID);
    const coachEvents=events.filter((event)=>String(event.promptFamily??"").startsWith("ai-coach-")).sort((a,b)=>b.occurredAt.localeCompare(a.occurredAt));
    const areaCounts:CoachHistorySummary["areaCounts"]={grammar:0,vocabulary:0,coherence:0,taskAchievement:0};
    const patternCounts=new Map<string,number>();
    const recent:CoachHistorySummary["recent"]=[];
    for(const event of coachEvents){
      const metadata=event.metadata??{};
      const feedback=metadata.feedback;
      if(feedback&&typeof feedback==="object"){
        for(const area of Object.keys(areaCounts) as Array<keyof typeof areaCounts>){
          const value=(feedback as Record<string,unknown>)[area];
          const items=value&&typeof value==="object"&&Array.isArray((value as Record<string,unknown>).items)?(value as Record<string,unknown>).items as unknown[]:[];
          areaCounts[area]+=items.length;
          for(const raw of items){
            if(!raw||typeof raw!=="object")continue;
            const message=String((raw as Record<string,unknown>).message??"").trim();
            if(message)patternCounts.set(message,(patternCounts.get(message)??0)+1);
          }
        }
      }
      const learnerText=typeof metadata.learnerText==="string"?metadata.learnerText.trim():"";
      if(learnerText&&recent.length<5)recent.push({mode:String(metadata.mode??""),learnerText,at:event.occurredAt});
    }
    const patterns=[...patternCounts.entries()].map(([message,count])=>({message,count})).sort((a,b)=>b.count-a.count||a.message.localeCompare(b.message)).slice(0,5);
    const revised=new Set(coachEvents.map((event)=>typeof event.metadata?.revisionOfEventId==="string"?event.metadata.revisionOfEventId:null).filter((id):id is string=>Boolean(id)));
    const now=Date.now();
    const dueRevisions:DelayedRevisionCandidate[]=[];
    for(const event of coachEvents){
      if(revised.has(event.id))continue;
      const learnerText=typeof event.metadata?.learnerText==="string"?event.metadata.learnerText.trim():"";
      if(!learnerText)continue;
      const ageHours=(now-Date.parse(event.occurredAt))/3_600_000;
      if(!Number.isFinite(ageHours)||ageHours<20)continue;
      const taskId=event.primaryTarget?.kind==="production_task"?event.primaryTarget.id:"";
      const task=productiveTasks.find((item)=>item.id===taskId);
      if(!taskId||task?.mode!=="writing"||event.activity!=="writing")continue;
      const feedbackMessages:string[]=[];
      const feedback=event.metadata?.feedback;
      if(feedback&&typeof feedback==="object"){
        for(const rawArea of Object.values(feedback as Record<string,unknown>)){
          if(!rawArea||typeof rawArea!=="object")continue;
          const items=Array.isArray((rawArea as Record<string,unknown>).items)?(rawArea as Record<string,unknown>).items as unknown[]:[];
          for(const raw of items){
            if(raw&&typeof raw==="object"){
              const message=String((raw as Record<string,unknown>).message??"").trim();
              if(message&&!feedbackMessages.includes(message))feedbackMessages.push(message);
            }
          }
        }
      }
      const savedLevel=event.metadata?.targetLevel;
      const revisionLevel:CoachLevel=savedLevel==="C1"||savedLevel==="B1+"||savedLevel==="B2"?savedLevel:(task?.level==="C1"?"C1":"B2");
      dueRevisions.push({eventId:event.id,taskId,learnerText,at:event.occurredAt,delayHours:ageHours,feedbackMessages,targetLevel:revisionLevel});
      if(dueRevisions.length>=5)break;
    }
    setRevisionHistory({turns:coachEvents.length,areaCounts,patterns,recent,dueRevisions});
  }
  useEffect(()=>{void refreshRevisionHistory().catch(()=>setRevisionHistory(EMPTY_HISTORY));},[]);

  async function submit(){
    const learnerText=text.trim();if(!learnerText||status==="sending")return;
    setStatus("sending");
    try{
      const response=await transport.evaluate({
        sessionId:sessionId.current,mode,targetLevel:effectiveLevel,learnerText,history,scenario,goals,
        register:mode==="conversation"?(effectiveLevel==="C1"?"polite":"neutral"):"formal",
        interactionStyle:mode==="conversation"?chain.interactionStyle:"guided"
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
          coachSessionId:sessionId.current,mode,targetLevel:effectiveLevel,learnerText,coachReply:response.replyJapanese,
          feedback:response.feedback,evidenceContract:response.evidenceContract,
          modelFeedbackAppliedToMastery:false,
          ...(mode==="conversation"?{scenarioChainId:chain.id,scenarioStageId:chainStage.id,scenarioStageIndex:Math.min(learnerTurns,chain.stages.length-1),interactionStyle:chain.interactionStyle,...(chainStage.pressure?{spontaneousPressure:chainStage.pressure}:{}),...(effectiveLevel==="C1"?{p13C1SpontaneousInteraction:true,p18AdvancedInteraction:true,p18AdvancedCoach:true}:{} )}:{}),
          ...(delayedRevision?{revisionOfEventId:delayedRevision.eventId,revisionDelayHours:Math.round(delayedRevision.delayHours)}:{})
        }
      });
      if(delayedRevision)setDelayedRevision(null);
      void refreshRevisionHistory();
    }catch{setStatus("error");}
  }

  function switchMode(next:CoachMode){
    setMode(next);setText("");setLast(null);setHistory([]);setDelayedRevision(null);setStatus("idle");sessionId.current=crypto.randomUUID();
  }
  function selectChain(nextId:string){
    setChainId(nextId);setHistory([]);setLast(null);setText("");setDelayedRevision(null);sessionId.current=crypto.randomUUID();
  }
  function selectLevel(next:ScenarioLevel){
    setTargetLevel(next);setChainId(scenarioChainsForLevel(next)[0]!.id);setHistory([]);setLast(null);setText("");setDelayedRevision(null);setStatus("idle");sessionId.current=crypto.randomUUID();
  }
  function startDelayedRevision(candidate:DelayedRevisionCandidate){
    const nextLevel:ScenarioLevel=candidate.targetLevel==="C1"?"C1":"B2";
    setTargetLevel(nextLevel);setChainId(scenarioChainsForLevel(nextLevel)[0]!.id);setMode("writing_revision");setDelayedRevision(candidate);setHistory([]);setLast(null);setText("");setStatus("idle");sessionId.current=crypto.randomUUID();
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
    <div className="section-heading"><div><span className="course-kicker">{targetLevel==="C1"?"P18 ADVANCED LIVE INTERACTION":"B2 AI COACH"}</span><h2>{targetLevel==="C1"?"Hidden pressure, repair and reformulation":"Guided B2 interaction"}</h2></div><span className="status-pill">advisory</span></div>
    <p className="coach-explainer">{targetLevel==="C1"?"P18 C1 conversation hides future complications and now includes interruption, hostile paraphrase, register shifts and cross-domain transfer. The AI interlocutor is a simulation, not a native speaker; model feedback remains separate from durable mastery and no acoustic pronunciation score is claimed.":"B2 conversation keeps the immediate communication goal visible and uses advisory model feedback without changing mastery."}</p>
    <div className="coach-mode" role="tablist" aria-label="Conversation level">
      <button className={targetLevel==="B2"?"active":""} type="button" onClick={()=>selectLevel("B2")}>B2 guided</button>
      <button className={targetLevel==="C1"?"active":""} type="button" onClick={()=>selectLevel("C1")}>C1 spontaneous</button>
    </div>
    <div className="coach-mode" role="tablist" aria-label="Coach mode">
      <button className={mode==="conversation"?"active":""} type="button" onClick={()=>switchMode("conversation")}>Conversation</button>
      <button className={mode==="writing_revision"?"active":""} type="button" onClick={()=>switchMode("writing_revision")}>Writing revision</button>
    </div>
    {mode==="conversation"?<div className="coach-chain">
      <label><span>Scenario chain</span><select value={chainId} onChange={(event)=>selectChain(event.target.value)}>{availableChains.map((item)=><option value={item.id} key={item.id}>{item.title}</option>)}</select></label>
      <div className="coach-chain-stages">{(chain.hiddenFutureStages?chain.stages.slice(0,Math.min(learnerTurns,chain.stages.length-1)+1):chain.stages).map((stage,index)=><span className={index<learnerTurns?"done":index===Math.min(learnerTurns,chain.stages.length-1)?"active":""} key={stage.id}>{index+1}. {stage.title}</span>)}{chain.hiddenFutureStages&&learnerTurns<chain.stages.length-1?<span>future pressure hidden · {chain.stages.length-learnerTurns-1}</span>:null}</div>
      <p>{chain.description}</p>
    </div>:null}
    {delayedRevision?<section className="delayed-revision-source"><div><span className="course-kicker">DELAYED REVISION</span><strong>{Math.round(delayedRevision.delayHours)}h since original attempt</strong></div><details><summary>Original response + prior feedback targets</summary><p lang="ja">{delayedRevision.learnerText}</p>{delayedRevision.feedbackMessages.length?<ul>{delayedRevision.feedbackMessages.slice(0,5).map((item)=><li key={item}>{item}</li>)}</ul>:null}</details></section>:null}
    <div className="coach-scenario"><small>{mode==="conversation"?"Current stage · "+effectiveLevel:"Scenario · "+effectiveLevel}</small><p>{scenario}</p>{goals.length?(mode==="conversation"&&chain.hiddenFutureStages?<details><summary>Reveal target moves</summary><ul className="coach-goals">{goals.map((goal)=><li key={goal}>{goal}</li>)}</ul></details>:<ul className="coach-goals">{goals.map((goal)=><li key={goal}>{goal}</li>)}</ul>):null}</div>
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
    {revisionHistory.turns?<section className="coach-history">
      <div className="section-heading"><div><span className="course-kicker">REVISION HISTORY</span><h3>Reusable feedback patterns</h3></div><span>{revisionHistory.turns} advisory turns</span></div>
      <div className="coach-history-areas">
        <span>Grammar {revisionHistory.areaCounts.grammar}</span><span>Vocabulary {revisionHistory.areaCounts.vocabulary}</span><span>Coherence {revisionHistory.areaCounts.coherence}</span><span>Task {revisionHistory.areaCounts.taskAchievement}</span>
      </div>
      {revisionHistory.patterns.length?<div className="coach-patterns"><strong>Repeated correction themes</strong><ul>{revisionHistory.patterns.map((pattern)=><li key={pattern.message}>{pattern.message}{pattern.count>1?<small> ×{pattern.count}</small>:null}</li>)}</ul></div>:null}
      {revisionHistory.dueRevisions.length?<div className="delayed-revision-queue"><strong>Delayed revisions due</strong>{revisionHistory.dueRevisions.map((candidate)=><article key={candidate.eventId}><div><span>{Math.round(candidate.delayHours)}h old</span><p lang="ja">{candidate.learnerText}</p></div><button className="unit-action" type="button" onClick={()=>startDelayedRevision(candidate)}>Revise after delay</button></article>)}</div>:null}
      {revisionHistory.recent.length?<details><summary>Recent learner revisions</summary>{revisionHistory.recent.map((item,index)=><div className="coach-history-turn" key={item.at+index}><small>{item.mode} · {new Date(item.at).toLocaleDateString()}</small><p lang="ja">{item.learnerText}</p></div>)}</details>:null}
      <p className="course-note">History is derived from stored advisory coach events. P13 can continue a C1 pressure exchange or schedule a delayed rewrite after 20+ hours, but AI judgments still do not alter mastery or FSRS scheduling.</p>
    </section>:null}
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
    {response.quality?<div className="coach-quality"><strong>Feedback grounding {Math.round(response.quality.score*100)}%</strong><span>{response.quality.anchoredCorrections}/{response.quality.correctionItems} correction items anchored to the learner text · {response.quality.goalMentions} goal mentions</span>{response.quality.warningCodes.length?<small>{response.quality.warningCodes.join(" · ")}</small>:<small>No grounding warnings detected by the bounded evaluator.</small>}</div>:null}
    <p className="course-note">AI feedback is advisory only · mastery unchanged · acoustic analysis: off</p>
  </div>;
}
function FeedbackArea({title,area}:{title:string;area:CoachFeedback[keyof CoachFeedback]}){
  return <article><div><strong>{title}</strong><span>{Math.round(area.confidence*100)}% feedback confidence</span></div><p>{area.summary}</p>{area.items.length?<ul>{area.items.map((item,index)=><li key={index}>{item.original&&item.suggestion?<><code>{item.original}</code> → <code>{item.suggestion}</code> — </>:null}{item.message}{item.explanation?" "+item.explanation:""}</li>)}</ul>:null}</article>;
}
