import { useEffect,useMemo,useRef,useState } from "react";
import {
  c1InteractionPressureMoves,drawC1InteractionPressure,getC1AdvancedInteractionProgress,
  saveC1AdvancedInteractionTurn,saveC1CrossDomainTransfer,saveC1HumanInteraction,specialistTrackLabel,
  type C1AdvancedInteractionProgress,type C1HumanInteractionMedium,type C1InteractionPressureMove,type C1PartnerProfile
} from "../study/c1AdvancedInteraction";
import { getC1ResearchQualityProgress,type C1ResearchQualityProgress } from "../study/c1ResearchQuality";

type Tab="live"|"human"|"transfer";
type SpeechTarget="statement"|"response";

const EMPTY_PROGRESS:C1AdvancedInteractionProgress={
  activeDays:0,turns:[],sessions:[],completeSessions:0,robustSessions:0,pressureTypes:0,aiPressureTurns:0,humanInteractions:[],
  humanInteractionMinutes:0,transfers:[]
};
const EMPTY_QUALITY:C1ResearchQualityProgress={
  bibliographyRecords:[],excerpts:[],humanReviews:[],specialistTracks:[],
  bibliographySources:0,privateExcerpts:0,redistributableExcerpts:0,reviewedProjects:0,specialistDomains:0
};

export function C1AdvancedInteractionLab(){
  const [tab,setTab]=useState<Tab>("live");
  const [progress,setProgress]=useState<C1AdvancedInteractionProgress>(EMPTY_PROGRESS);
  const [quality,setQuality]=useState<C1ResearchQualityProgress>(EMPTY_QUALITY);
  const [message,setMessage]=useState("");
  const sessionId=useRef(crypto.randomUUID());

  const [trackId,setTrackId]=useState("");
  const [statement,setStatement]=useState("");
  const [move,setMove]=useState<C1InteractionPressureMove|null>(null);
  const [response,setResponse]=useState("");
  const [inputMode,setInputMode]=useState<"text"|"speech">("text");
  const revealAt=useRef<number|null>(null);
  const [elapsed,setElapsed]=useState(0);
  const [speechState,setSpeechState]=useState<"idle"|"listening"|"unsupported"|"error">("idle");

  const [medium,setMedium]=useState<C1HumanInteractionMedium>("in_person");
  const [partnerProfile,setPartnerProfile]=useState<C1PartnerProfile>("native_japanese");
  const [duration,setDuration]=useState("20");
  const [humanDomain,setHumanDomain]=useState("");
  const [interactionSummary,setInteractionSummary]=useState("");
  const [difficultMoment,setDifficultMoment]=useState("");
  const [repairUsed,setRepairUsed]=useState("");
  const [humanReflection,setHumanReflection]=useState("");

  const [transferTrackId,setTransferTrackId]=useState("");
  const [targetDomain,setTargetDomain]=useState("");
  const [principle,setPrinciple]=useState("");
  const [transferResponse,setTransferResponse]=useState("");
  const [boundaryCondition,setBoundaryCondition]=useState("");

  async function refresh(){
    const [nextProgress,nextQuality]=await Promise.all([getC1AdvancedInteractionProgress(),getC1ResearchQualityProgress()]);
    setProgress(nextProgress);setQuality(nextQuality);
    if(!trackId&&nextQuality.specialistTracks[0])setTrackId(nextQuality.specialistTracks[0].id);
    if(!transferTrackId&&nextQuality.specialistTracks[0])setTransferTrackId(nextQuality.specialistTracks[0].id);
  }
  useEffect(()=>{void refresh().catch(()=>{setProgress(EMPTY_PROGRESS);setQuality(EMPTY_QUALITY);});},[]);
  useEffect(()=>{
    if(!move||revealAt.current===null)return;
    const tick=()=>setElapsed(Math.max(0,(performance.now()-revealAt.current!)/1000));
    tick();const timer=window.setInterval(tick,250);return()=>window.clearInterval(timer);
  },[move]);

  const currentTurns=useMemo(()=>progress.turns.filter((item)=>item.sessionId===sessionId.current),[progress]);
  const currentSession=useMemo(()=>progress.sessions.find((item)=>item.sessionId===sessionId.current)??null,[progress]);
  const selectedTrack=quality.specialistTracks.find((item)=>item.id===trackId)??null;
  const selectedTransferTrack=quality.specialistTracks.find((item)=>item.id===transferTrackId)??null;

  function revealPressure(){
    if(statement.trim().length<100)return;
    const next=drawC1InteractionPressure(currentTurns.map((item)=>item.moveId));
    setMove(next);setResponse("");setInputMode("text");setElapsed(0);revealAt.current=performance.now();setMessage("");
  }

  async function saveTurn(){
    if(!move||revealAt.current===null)return;
    setMessage("");
    try{
      const responseSeconds=(performance.now()-revealAt.current)/1000;
      await saveC1AdvancedInteractionTurn({
        sessionId:sessionId.current,moveId:move.id,...(trackId?{specialistTrackId:trackId}:{}),
        committedStatement:statement,pressureResponse:response,inputMode,responseSeconds
      });
      setStatement(response.trim());setResponse("");setMove(null);setInputMode("text");revealAt.current=null;setElapsed(0);
      setMessage("Pressure turn saved. The repaired answer has become the next committed position.");
      await refresh();
    }catch(error){setMessage(errorMessage(error));}
  }

  function newSession(){
    sessionId.current=crypto.randomUUID();setStatement("");setResponse("");setMove(null);setInputMode("text");revealAt.current=null;setElapsed(0);setMessage("");
  }

  function startSpeech(target:SpeechTarget){
    const w=window as unknown as {
      SpeechRecognition?:new()=>{lang:string;interimResults:boolean;continuous:boolean;start():void;onresult:((event:{results:ArrayLike<{0?:{transcript?:string}}>} )=>void)|null;onerror:(()=>void)|null;onend:(()=>void)|null};
      webkitSpeechRecognition?:new()=>{lang:string;interimResults:boolean;continuous:boolean;start():void;onresult:((event:{results:ArrayLike<{0?:{transcript?:string}}>} )=>void)|null;onerror:(()=>void)|null;onend:(()=>void)|null};
    };
    const Recognition=w.SpeechRecognition??w.webkitSpeechRecognition;
    if(!Recognition){setSpeechState("unsupported");return;}
    const recognition=new Recognition();recognition.lang="ja-JP";recognition.interimResults=false;recognition.continuous=false;
    recognition.onresult=(event)=>{
      const transcript=event.results[0]?.[0]?.transcript?.trim()??"";
      if(transcript){
        if(target==="statement")setStatement(transcript);
        else{setResponse(transcript);setInputMode("speech");}
      }
    };
    recognition.onerror=()=>setSpeechState("error");
    recognition.onend=()=>setSpeechState((state)=>state==="error"?state:"idle");
    setSpeechState("listening");try{recognition.start();}catch{setSpeechState("error");}
  }

  async function saveHuman(){
    setMessage("");
    try{
      await saveC1HumanInteraction({
        medium,partnerProfile,durationMinutes:Number(duration),domain:humanDomain,
        interactionSummary,difficultMoment,repairUsed,reflection:humanReflection
      });
      setInteractionSummary("");setDifficultMoment("");setRepairUsed("");setHumanReflection("");
      setMessage("Human interaction log saved as external interaction evidence.");
      await refresh();
    }catch(error){setMessage(errorMessage(error));}
  }

  async function saveTransfer(){
    setMessage("");
    try{
      await saveC1CrossDomainTransfer({
        sourceTrackId:transferTrackId,targetDomain,transferablePrinciple:principle,transferResponse,boundaryCondition
      });
      setTargetDomain("");setPrinciple("");setTransferResponse("");setBoundaryCondition("");
      setMessage("Cross-domain transfer saved as bounded specialist-transfer evidence.");
      await refresh();
    }catch(error){setMessage(errorMessage(error));}
  }

  return <section className="p18-interaction" id="p18-advanced-interaction">
    <div className="section-heading">
      <div><span className="course-kicker">P18 ADVANCED NATIVE INTERACTION</span><h2>Repair, reformulate and hold the floor under live pressure</h2></div>
      <span className="course-count">{progress.robustSessions} robust pressure session{progress.robustSessions===1?"":"s"}</span>
    </div>
    <p className="course-note">The live simulator uses native-style Japanese discourse pressure, not a verified native speaker. Actual human interaction is logged separately. Response timing is descriptive only; it is not a fluency score or pronunciation grade.</p>

    <div className="p18-stats">
      <P18Stat value={progress.turns.length} label="pressure turns"/>
      <P18Stat value={progress.pressureTypes} label="pressure types"/>
      <P18Stat value={progress.aiPressureTurns} label="AI pressure turns"/>
      <P18Stat value={progress.completeSessions} label="4-turn sessions"/>
      <P18Stat value={progress.robustSessions} label="robust sessions"/>
      <P18Stat value={progress.humanInteractions.length} label="human interactions"/>
      <P18Stat value={progress.humanInteractionMinutes} label="human minutes"/>
      <P18Stat value={progress.transfers.length} label="domain transfers"/>
      <P18Stat value={progress.activeDays} label="interaction days"/>
    </div>

    <div className="p18-tabs" role="tablist" aria-label="Advanced interaction workspace">
      <button className={tab==="live"?"active":""} type="button" onClick={()=>setTab("live")}>Live pressure</button>
      <button className={tab==="human"?"active":""} type="button" onClick={()=>setTab("human")}>Real partner log</button>
      <button className={tab==="transfer"?"active":""} type="button" onClick={()=>setTab("transfer")}>Cross-domain transfer</button>
    </div>

    {tab==="live"?<div className="p18-live">
      <article className="p18-session-card">
        <div className="p18-session-head">
          <div><span>LIVE SESSION</span><strong>{currentTurns.length} saved turn{currentTurns.length===1?"":"s"} · {currentSession?.pressureTypes??0} pressure types</strong></div>
          <button className="quiet-button" type="button" onClick={newSession}>New session</button>
        </div>
        {quality.specialistTracks.length?<label>Specialist context<select value={trackId} onChange={(event)=>setTrackId(event.target.value)}><option value="">General advanced interaction</option>{quality.specialistTracks.map((track)=><option key={track.id} value={track.id}>{specialistTrackLabel(track)}</option>)}</select></label>:null}
        {selectedTrack?<div className="p18-context"><strong>{selectedTrack.title}</strong><span>{selectedTrack.domain} · {selectedTrack.sourceIds.length} sources · {selectedTrack.termIds.length} terms</span><p>{selectedTrack.goal}</p></div>:null}

        {!move?<>
          <div className="p18-hidden-pressure"><span>PRESSURE HIDDEN</span><strong>Commit before you know what the interlocutor will do.</strong><p>The next move is drawn only after your position is fixed. Reusing the repaired answer as the next position creates a continuous chain rather than isolated prompts.</p></div>
          <label>Committed Japanese position<textarea lang="ja" rows={8} value={statement} onChange={(event)=>setStatement(event.target.value)} placeholder="立場・理由・留保を含む発言をまず確定する…"/></label>
          <div className="p18-actions">
            <button className="unit-action" type="button" disabled={speechState==="listening"} onClick={()=>startSpeech("statement")}>{speechState==="listening"?"Listening…":"Speak position"}</button>
            <button className="primary" type="button" disabled={statement.trim().length<100} onClick={revealPressure}>Commit + reveal pressure</button>
          </div>
        </>:<>
          <div className="p18-pressure-card">
            <div><span>{move.type.replaceAll("_"," ")}</span><strong>{elapsed.toFixed(1)}s since reveal</strong></div>
            <h3>{move.title}</h3><p lang="ja">{move.partnerMove}</p><small>{move.repairGoal}</small>
          </div>
          <details className="p18-committed"><summary>Committed position — locked for this turn</summary><p lang="ja">{statement}</p></details>
          <label>Respond immediately in Japanese<textarea lang="ja" rows={8} value={response} onChange={(event)=>{setResponse(event.target.value);setInputMode("text");}} placeholder="割り込み・確認要求・反論などを受けて、その場で修復・言い換え・限定を行う…"/></label>
          <small>{response.trim().length}/{move.minimumCharacters} minimum characters · {inputMode==="speech"?"speech-recognition transcript":"typed speaking proxy"}</small>
          <div className="p18-actions">
            <button className="unit-action" type="button" disabled={speechState==="listening"} onClick={()=>startSpeech("response")}>{speechState==="listening"?"Listening…":"Use microphone"}</button>
            <button className="primary" type="button" disabled={response.trim().length<move.minimumCharacters} onClick={()=>void saveTurn()}>Save live repair</button>
          </div>
        </>}
        {speechState==="unsupported"?<p className="coach-warning">Japanese speech recognition is unavailable in this browser. Typed interaction remains available and is labeled as a speaking proxy.</p>:null}
        {speechState==="error"?<p className="coach-warning">Speech recognition failed. Retry or type the response.</p>:null}

        {currentTurns.length?<div className="p18-turn-history">{currentTurns.map((turn,index)=><div key={turn.id}>
          <span>{index+1}</span><div><strong>{turn.pressureType.replaceAll("_"," ")}</strong><small>{turn.responseSeconds.toFixed(1)}s · {turn.inputMode==="speech"?"speech transcript":"typed proxy"}</small></div>
        </div>)}</div>:null}
        {currentSession?<p className="p18-evidence-note">{currentSession.complete?"A complete pressure session exists (4+ turns, 4+ pressure types).":"Complete at least 4 distinct pressure types."} {currentSession.robustPressureCoverage?"Robust pressure coverage reached: 6+ types across 4+ pressure families.":"Robust coverage requires 6+ pressure types across at least 4 pressure families."}</p>:null}
      </article>
    </div>:null}

    {tab==="human"?<article className="p18-human-card">
      <div className="p18-card-head"><div><span>REAL PARTNER LOG</span><h3>Separate actual human interaction from simulation</h3></div><strong>{progress.humanInteractionMinutes} logged minutes</strong></div>
      <p>Log only what actually happened. Partner background is self-reported by you and is not verified by the app. No name is required.</p>
      <div className="p18-two">
        <label>Medium<select value={medium} onChange={(event)=>setMedium(event.target.value as C1HumanInteractionMedium)}><option value="in_person">In person</option><option value="voice_call">Voice call</option><option value="video_call">Video call</option><option value="text_chat">Text chat</option></select></label>
        <label>Partner Japanese profile<select value={partnerProfile} onChange={(event)=>setPartnerProfile(event.target.value as C1PartnerProfile)}><option value="native_japanese">Native Japanese</option><option value="near_native">Near-native</option><option value="advanced_japanese">Advanced Japanese user</option><option value="unknown">Unknown / not stated</option></select></label>
        <label>Duration (minutes)<input type="number" min="3" max="480" value={duration} onChange={(event)=>setDuration(event.target.value)}/></label>
        <label>Domain / situation<input value={humanDomain} onChange={(event)=>setHumanDomain(event.target.value)} placeholder="研究討論、仕事、教会、友人との会話…"/></label>
      </div>
      <label>What happened?<textarea lang="ja" rows={5} value={interactionSummary} onChange={(event)=>setInteractionSummary(event.target.value)} placeholder="会話の目的、主な論点、やり取りの流れ…"/></label>
      <label>Hardest interaction moment<textarea lang="ja" rows={4} value={difficultMoment} onChange={(event)=>setDifficultMoment(event.target.value)} placeholder="聞き返し、割り込み、誤解、反論、言い直しなど…"/></label>
      <label>Repair or adaptation used<textarea lang="ja" rows={4} value={repairUsed} onChange={(event)=>setRepairUsed(event.target.value)} placeholder="どう聞き返したか、言い換えたか、発言権を取り戻したか…"/></label>
      <label>Post-session reflection<textarea lang="ja" rows={5} value={humanReflection} onChange={(event)=>setHumanReflection(event.target.value)} placeholder="次回再現したい表現、改善点、まだ不安定な部分…"/></label>
      <button className="primary" type="button" disabled={Number(duration)<3||humanDomain.trim().length<3||interactionSummary.trim().length<80||difficultMoment.trim().length<60||repairUsed.trim().length<50||humanReflection.trim().length<80} onClick={()=>void saveHuman()}>Save human interaction</button>
    </article>:null}

    {tab==="transfer"?<article className="p18-transfer-card">
      <div className="p18-card-head"><div><span>EXPERT-DOMAIN TRANSFER</span><h3>Make a specialist principle survive a new context</h3></div><strong>{progress.transfers.length} saved</strong></div>
      {quality.specialistTracks.length?<>
        <label>Source specialist track<select value={transferTrackId} onChange={(event)=>setTransferTrackId(event.target.value)}>{quality.specialistTracks.map((track)=><option key={track.id} value={track.id}>{specialistTrackLabel(track)}</option>)}</select></label>
        {selectedTransferTrack?<div className="p18-context"><strong>{selectedTransferTrack.title}</strong><span>{selectedTransferTrack.domain}</span><p>{selectedTransferTrack.goal}</p></div>:null}
        <label>Unexpected target domain<input value={targetDomain} onChange={(event)=>setTargetDomain(event.target.value)} placeholder="教育政策、医療、組織運営、地域社会…"/></label>
        <label>Portable principle<textarea lang="ja" rows={4} value={principle} onChange={(event)=>setPrinciple(event.target.value)} placeholder="元の専門領域から持ち出せる原則は何か…"/></label>
        <label>Transfer response<textarea lang="ja" rows={7} value={transferResponse} onChange={(event)=>setTransferResponse(event.target.value)} placeholder="別領域にどう適用し、何をそのまま移さず調整するか…"/></label>
        <label>Boundary condition<textarea lang="ja" rows={5} value={boundaryCondition} onChange={(event)=>setBoundaryCondition(event.target.value)} placeholder="どの条件ではこの原則が成立しない、または追加検証が必要か…"/></label>
        <button className="primary" type="button" disabled={!transferTrackId||targetDomain.trim().length<3||principle.trim().length<70||transferResponse.trim().length<150||boundaryCondition.trim().length<80} onClick={()=>void saveTransfer()}>Save transfer response</button>
      </>:<p className="p18-empty">Create a P16 specialist track before testing expert-domain transfer.</p>}
    </article>:null}

    {message?<p className="p18-message" role="status">{message}</p>:null}
  </section>;
}

function P18Stat({value,label}:{value:number;label:string}){return <div><strong>{value}</strong><span>{label}</span></div>;}

function errorMessage(error:unknown):string{
  const code=error instanceof Error?error.message:String(error);
  const friendly:Record<string,string>={
    P18_COMMITTED_STATEMENT_TOO_SHORT:"Commit a fuller initial Japanese position before drawing pressure.",
    P18_PRESSURE_RESPONSE_TOO_SHORT:"Develop the live repair response further before saving.",
    P18_HUMAN_DURATION_INVALID:"Use a real interaction duration between 3 and 480 minutes.",
    P18_HUMAN_DOMAIN_REQUIRED:"Name the interaction domain or situation.",
    P18_HUMAN_REFLECTION_TOO_SHORT:"Develop the human-interaction evidence fields in more detail.",
    P18_SPECIALIST_TRACK_REQUIRED:"Choose an existing P16 specialist track first.",
    P18_TARGET_DOMAIN_REQUIRED:"Name an unexpected target domain.",
    P18_TRANSFER_TOO_SHORT:"Develop the principle, transfer and boundary condition in more detail.",
    P18_UNKNOWN_SPECIALIST_TRACK:"The selected specialist track no longer exists."
  };
  return friendly[code]??code;
}
