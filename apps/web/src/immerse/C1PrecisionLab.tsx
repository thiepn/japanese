import { useEffect,useMemo,useState } from "react";
import {
  c1DiscourseStages,c1PrecisionChallenges,getC1PrecisionProgress,reviewLabel,saveC1PrecisionArtifact,saveC1ReviewRepair,
  saveC1SourceRefresh,saveC1SpecialistDiscourseTurn,sourceLabel,
  type C1DiscourseStageId,type C1PrecisionProgress,type C1ReviewRepairStrategy
} from "../study/c1Precision";
import { getC1EnvironmentProgress,type C1EnvironmentProgress } from "../study/c1Environment";
import { getC1ResearchQualityProgress,type C1ResearchQualityProgress } from "../study/c1ResearchQuality";

type P17Tab="precision"|"specialist"|"refresh"|"repair";

const EMPTY_ENV:C1EnvironmentProgress={
  activeDays:0,registeredSources:0,evaluatedSources:0,sourceGenres:0,sourcePublishers:0,specialistTerms:0,
  writingProjectsStarted:0,writingProjectsCompleted:0,defenseTurns:0,uniquePressureTypes:0,
  sourceEvaluations:[],sources:[],specialistTermItems:[],projects:[]
};
const EMPTY_QUALITY:C1ResearchQualityProgress={
  bibliographyRecords:[],excerpts:[],humanReviews:[],specialistTracks:[],
  bibliographySources:0,privateExcerpts:0,redistributableExcerpts:0,reviewedProjects:0,specialistDomains:0
};
const EMPTY_PROGRESS:C1PrecisionProgress={
  activeDays:0,precisionArtifacts:[],precisionModes:0,specialistTurns:[],specialistTracks:[],
  completedDiscourseCycles:0,sustainedSpecialistTracks:0,sourceRefreshes:[],reviewRepairs:[]
};

export function C1PrecisionLab(){
  const [tab,setTab]=useState<P17Tab>("precision");
  const [environment,setEnvironment]=useState<C1EnvironmentProgress>(EMPTY_ENV);
  const [quality,setQuality]=useState<C1ResearchQualityProgress>(EMPTY_QUALITY);
  const [progress,setProgress]=useState<C1PrecisionProgress>(EMPTY_PROGRESS);
  const [message,setMessage]=useState("");

  const [challengeId,setChallengeId]=useState(c1PrecisionChallenges[0]!.id);
  const [originalText,setOriginalText]=useState("");
  const [revisedText,setRevisedText]=useState("");
  const [rationale,setRationale]=useState("");
  const [precisionTrackId,setPrecisionTrackId]=useState("");

  const [discourseTrackId,setDiscourseTrackId]=useState("");
  const [stageId,setStageId]=useState<C1DiscourseStageId>("position");
  const [discourseResponse,setDiscourseResponse]=useState("");
  const [discourseMode,setDiscourseMode]=useState<"text"|"speech">("text");
  const [speechState,setSpeechState]=useState<"idle"|"listening"|"unsupported"|"error">("idle");

  const [baseSourceId,setBaseSourceId]=useState("");
  const [updateSourceId,setUpdateSourceId]=useState("");
  const [changedClaim,setChangedClaim]=useState("");
  const [continuity,setContinuity]=useState("");
  const [impact,setImpact]=useState("");
  const [uncertainty,setUncertainty]=useState("");

  const [reviewId,setReviewId]=useState("");
  const [repairStrategy,setRepairStrategy]=useState<C1ReviewRepairStrategy>("modify");
  const [repairedPassage,setRepairedPassage]=useState("");
  const [repairRationale,setRepairRationale]=useState("");

  async function refresh(){
    const [nextEnvironment,nextQuality,nextProgress]=await Promise.all([
      getC1EnvironmentProgress(),getC1ResearchQualityProgress(),getC1PrecisionProgress()
    ]);
    setEnvironment(nextEnvironment);setQuality(nextQuality);setProgress(nextProgress);
    if(!discourseTrackId&&nextQuality.specialistTracks[0])setDiscourseTrackId(nextQuality.specialistTracks[0].id);
    if(!precisionTrackId&&nextQuality.specialistTracks[0])setPrecisionTrackId(nextQuality.specialistTracks[0].id);
    if(!baseSourceId&&nextEnvironment.sources[0])setBaseSourceId(nextEnvironment.sources[0].id);
    if(!updateSourceId&&nextEnvironment.sources[1])setUpdateSourceId(nextEnvironment.sources[1].id);
    if(!reviewId&&nextQuality.humanReviews[0])setReviewId(nextQuality.humanReviews[0].id);
  }
  useEffect(()=>{void refresh().catch(()=>{setEnvironment(EMPTY_ENV);setQuality(EMPTY_QUALITY);setProgress(EMPTY_PROGRESS);});},[]);

  const challenge=useMemo(()=>c1PrecisionChallenges.find((item)=>item.id===challengeId)??c1PrecisionChallenges[0]!,[challengeId]);
  const stage=useMemo(()=>c1DiscourseStages.find((item)=>item.id===stageId)??c1DiscourseStages[0]!,[stageId]);
  const discourseProgress=progress.specialistTracks.find((item)=>item.trackId===discourseTrackId)??null;
  const discourseTrack=quality.specialistTracks.find((item)=>item.id===discourseTrackId)??null;
  const baseSource=environment.sources.find((item)=>item.id===baseSourceId)??null;
  const updateSource=environment.sources.find((item)=>item.id===updateSourceId)??null;
  const selectedReview=quality.humanReviews.find((item)=>item.id===reviewId)??null;

  async function savePrecision(){
    setMessage("");
    try{
      await saveC1PrecisionArtifact({
        challengeId,originalText,revisedText,rationale,
        ...(precisionTrackId?{specialistTrackId:precisionTrackId}:{})
      });
      setOriginalText("");setRevisedText("");setRationale("");
      setMessage("Precision transformation saved as descriptive advanced-production evidence.");
      await refresh();
    }catch(error){setMessage(errorMessage(error));}
  }

  async function saveDiscourse(){
    setMessage("");
    try{
      await saveC1SpecialistDiscourseTurn({trackId:discourseTrackId,stageId,response:discourseResponse,inputMode:discourseMode});
      setDiscourseResponse("");setDiscourseMode("text");
      setMessage("Specialist discourse turn saved. Reliability only becomes sustained after delayed repetition of every stage.");
      await refresh();
    }catch(error){setMessage(errorMessage(error));}
  }

  async function saveRefresh(){
    setMessage("");
    try{
      await saveC1SourceRefresh({baseSourceId,updateSourceId,changedClaim,continuity,impact,uncertainty});
      setChangedClaim("");setContinuity("");setImpact("");setUncertainty("");
      setMessage("Source refresh saved as comparative reading evidence, not independent fact verification.");
      await refresh();
    }catch(error){setMessage(errorMessage(error));}
  }

  async function saveRepair(){
    setMessage("");
    try{
      await saveC1ReviewRepair({reviewId,strategy:repairStrategy,revisedPassage:repairedPassage,rationale:repairRationale});
      setRepairedPassage("");setRepairRationale("");
      setMessage("Human-review repair pass saved without changing mastery.");
      await refresh();
    }catch(error){setMessage(errorMessage(error));}
  }

  function startSpeech(){
    const w=window as unknown as {
      SpeechRecognition?:new()=>{lang:string;interimResults:boolean;continuous:boolean;start():void;onresult:((event:{results:ArrayLike<{0?:{transcript?:string}}>} )=>void)|null;onerror:(()=>void)|null;onend:(()=>void)|null};
      webkitSpeechRecognition?:new()=>{lang:string;interimResults:boolean;continuous:boolean;start():void;onresult:((event:{results:ArrayLike<{0?:{transcript?:string}}>} )=>void)|null;onerror:(()=>void)|null;onend:(()=>void)|null};
    };
    const Recognition=w.SpeechRecognition??w.webkitSpeechRecognition;
    if(!Recognition){setSpeechState("unsupported");return;}
    const recognition=new Recognition();recognition.lang="ja-JP";recognition.interimResults=false;recognition.continuous=false;
    recognition.onresult=(event)=>{const transcript=event.results[0]?.[0]?.transcript?.trim()??"";if(transcript){setDiscourseResponse(transcript);setDiscourseMode("speech");}};
    recognition.onerror=()=>setSpeechState("error");
    recognition.onend=()=>setSpeechState((current)=>current==="error"?current:"idle");
    setSpeechState("listening");try{recognition.start();}catch{setSpeechState("error");}
  }

  return <section className="p17-precision" id="p17-c1-c2-precision">
    <div className="section-heading">
      <div><span className="course-kicker">C1→C2 PRECISION BRIDGE</span><h2>Make advanced Japanese more exact, adaptive and specialist</h2></div>
      <span className="course-count">{progress.activeDays} active precision day{progress.activeDays===1?"":"s"}</span>
    </div>
    <p className="course-note">This precision workspace does not add a C2 badge. It trains the gap between advanced competence and expert-like control: exact lexical choice, controlled register, calibrated certainty, sustained specialist discourse, fresh-source revision and deliberate repair after human feedback.</p>

    <div className="p17-stats">
      <P17Stat value={progress.precisionArtifacts.length} label="precision transformations"/>
      <P17Stat value={progress.precisionModes} label="precision modes"/>
      <P17Stat value={progress.specialistTurns.length} label="specialist turns"/>
      <P17Stat value={progress.sustainedSpecialistTracks} label="sustained tracks"/>
      <P17Stat value={progress.sourceRefreshes.length} label="source refreshes"/>
      <P17Stat value={progress.reviewRepairs.length} label="review repairs"/>
    </div>

    <div className="p17-tabs" role="tablist" aria-label="C1 to C2 precision workspace">
      <button className={tab==="precision"?"active":""} type="button" onClick={()=>setTab("precision")}>Precision</button>
      <button className={tab==="specialist"?"active":""} type="button" onClick={()=>setTab("specialist")}>Specialist discourse</button>
      <button className={tab==="refresh"?"active":""} type="button" onClick={()=>setTab("refresh")}>Fresh-source refresh</button>
      <button className={tab==="repair"?"active":""} type="button" onClick={()=>setTab("repair")}>Human-review repair</button>
    </div>

    {tab==="precision"?<div className="p17-workspace">
      <div className="p17-challenge-grid">{c1PrecisionChallenges.map((item)=><button className={item.id===challengeId?"active":""} type="button" key={item.id} onClick={()=>setChallengeId(item.id)}>
        <span>{item.mode.replaceAll("_"," ")}</span><strong>{item.title}</strong><small>{item.target}</small>
      </button>)}</div>
      <article className="p17-editor">
        <div className="p17-head"><div><span>{challenge.mode.replaceAll("_"," ")}</span><h3>{challenge.title}</h3></div><strong>{challenge.target}</strong></div>
        <p>{challenge.brief}</p>
        <div className="p17-requirements">{challenge.requirements.map((item)=><span key={item}>{item}</span>)}</div>
        {quality.specialistTracks.length?<label>Optional specialist track<select value={precisionTrackId} onChange={(event)=>setPrecisionTrackId(event.target.value)}><option value="">General precision work</option>{quality.specialistTracks.map((track)=><option value={track.id} key={track.id}>{track.domain} · {track.title}</option>)}</select></label>:null}
        <label>Original Japanese<textarea lang="ja" rows={9} value={originalText} onChange={(event)=>setOriginalText(event.target.value)} placeholder="変換前の文章…"/></label>
        <small>{originalText.trim().length} characters</small>
        <label>Rewritten Japanese<textarea lang="ja" rows={9} value={revisedText} onChange={(event)=>setRevisedText(event.target.value)} placeholder="目的に合わせて精密に書き直す…"/></label>
        <small>{revisedText.trim().length} characters{originalText.trim().length?" · "+Math.round(revisedText.trim().length/originalText.trim().length*100)+"% of original":""}</small>
        <label>Why this revision is better<textarea rows={5} value={rationale} onChange={(event)=>setRationale(event.target.value)} placeholder="語彙、断定度、文体、情報構造など、何をどう変えたか説明する…"/></label>
        <button className="primary" type="button" disabled={originalText.trim().length<180||revisedText.trim().length<100||rationale.trim().length<80} onClick={()=>void savePrecision()}>Save precision transformation</button>
      </article>
    </div>:null}

    {tab==="specialist"?<div className="p17-workspace">
      {quality.specialistTracks.length?<article className="p17-editor">
        <div className="p17-head"><div><span>SPECIALIST DISCOURSE CYCLE</span><h3>Sustain one domain across five discourse functions</h3></div>{discourseProgress?<strong>{discourseProgress.stagesCovered}/5 stages · {discourseProgress.repeatedStages}/5 delayed repeats</strong>:null}</div>
        <label>Specialist track<select value={discourseTrackId} onChange={(event)=>setDiscourseTrackId(event.target.value)}>{quality.specialistTracks.map((track)=><option value={track.id} key={track.id}>{track.domain} · {track.title}</option>)}</select></label>
        {discourseTrack?<div className="p17-track-context"><strong>{discourseTrack.title}</strong><span>{discourseTrack.domain} · {discourseTrack.sourceIds.length} sources · {discourseTrack.termIds.length} terms · {discourseTrack.projectIds.length} projects</span><p>{discourseTrack.goal}</p></div>:null}
        <div className="p17-stage-grid">{c1DiscourseStages.map((item)=><button className={stageId===item.id?"active":""} type="button" key={item.id} onClick={()=>setStageId(item.id)}>
          <strong>{item.title}</strong><small>{discourseProgress?.stageCounts[item.id]??0} saved</small>
        </button>)}</div>
        <div className="p17-prompt"><span>{stage.title}</span><p>{stage.prompt}</p><small>{stage.minimumCharacters}+ Japanese characters</small></div>
        <label>Respond in Japanese<textarea lang="ja" rows={9} value={discourseResponse} onChange={(event)=>{setDiscourseResponse(event.target.value);setDiscourseMode("text");}} placeholder="専門領域の論点を、前提・根拠・留保を明示しながら展開する…"/></label>
        <div className="p17-actions">
          <button className="unit-action" type="button" disabled={speechState==="listening"} onClick={startSpeech}>{speechState==="listening"?"Listening…":"Use microphone"}</button>
          <button className="primary" type="button" disabled={!discourseTrackId||discourseResponse.trim().length<stage.minimumCharacters} onClick={()=>void saveDiscourse()}>Save specialist turn</button>
        </div>
        {speechState==="unsupported"?<p className="coach-warning">Japanese speech recognition is unavailable in this browser. Typed responses remain available and are labeled as a speaking proxy.</p>:null}
        {speechState==="error"?<p className="coach-warning">Speech recognition failed. Retry or type the response.</p>:null}
        {discourseProgress?<p className="p17-evidence-note">{discourseProgress.cycleComplete?"One complete five-stage cycle exists.":"Complete all five discourse stages once."} {discourseProgress.sustainedAcrossSessions?"Every stage has also survived a 20+ hour delayed repeat.":"Sustained status requires a 20+ hour delayed repeat of every stage."}</p>:null}
      </article>:<p className="p17-empty">Create a specialist track in Research quality first. Specialist discourse is deliberately anchored in your real sources, terminology and projects.</p>}
    </div>:null}

    {tab==="refresh"?<div className="p17-workspace">
      {environment.sources.length>=2?<article className="p17-editor">
        <div className="p17-head"><div><span>FRESH-SOURCE REFRESH</span><h3>Reopen a conclusion when newer evidence appears</h3></div><strong>{progress.sourceRefreshes.length} saved</strong></div>
        <p>Choose an earlier source and a different registered source. Compare what changed without pretending the app independently verified either source.</p>
        <div className="p17-two">
          <label>Earlier source<select value={baseSourceId} onChange={(event)=>setBaseSourceId(event.target.value)}>{environment.sources.map((source)=><option value={source.id} key={source.id}>{sourceLabel(source)}</option>)}</select>{baseSource?<a href={baseSource.url} target="_blank" rel="noreferrer">Open earlier source ↗</a>:null}</label>
          <label>New / comparison source<select value={updateSourceId} onChange={(event)=>setUpdateSourceId(event.target.value)}>{environment.sources.map((source)=><option value={source.id} key={source.id}>{sourceLabel(source)}</option>)}</select>{updateSource?<a href={updateSource.url} target="_blank" rel="noreferrer">Open comparison source ↗</a>:null}</label>
        </div>
        <label>What changed?<textarea lang="ja" rows={5} value={changedClaim} onChange={(event)=>setChangedClaim(event.target.value)} placeholder="新しい資料によって、以前の主張のどの部分を変える必要があるか…"/></label>
        <label>What still holds?<textarea lang="ja" rows={4} value={continuity} onChange={(event)=>setContinuity(event.target.value)} placeholder="以前の結論のうち、どの部分はまだ維持できるか…"/></label>
        <label>Impact on the argument<textarea lang="ja" rows={5} value={impact} onChange={(event)=>setImpact(event.target.value)} placeholder="結論、提言、因果解釈などをどう修正するか…"/></label>
        <label>Remaining uncertainty<textarea lang="ja" rows={4} value={uncertainty} onChange={(event)=>setUncertainty(event.target.value)} placeholder="新資料を読んでも残る不確実性は何か…"/></label>
        <button className="primary" type="button" disabled={!baseSourceId||!updateSourceId||baseSourceId===updateSourceId||changedClaim.trim().length<60||continuity.trim().length<50||impact.trim().length<60||uncertainty.trim().length<50} onClick={()=>void saveRefresh()}>Save source refresh</button>
      </article>:<p className="p17-empty">Register and evaluate at least two real sources in the real-source environment before running a fresh-source refresh.</p>}
    </div>:null}

    {tab==="repair"?<div className="p17-workspace">
      {quality.humanReviews.length?<article className="p17-editor">
        <div className="p17-head"><div><span>HUMAN-REVIEW REPAIR</span><h3>Turn external feedback into a deliberate second pass</h3></div><strong>{progress.reviewRepairs.length} repairs</strong></div>
        <label>Human review<select value={reviewId} onChange={(event)=>setReviewId(event.target.value)}>{quality.humanReviews.map((review)=><option value={review.id} key={review.id}>{reviewLabel(review)}</option>)}</select></label>
        {selectedReview?<div className="p17-review-card">
          <div><strong>{selectedReview.projectTitle}</strong><span>{selectedReview.reviewerName} · {selectedReview.reviewerRole.replaceAll("_"," ")}</span></div>
          <p>{selectedReview.feedback}</p>
          <small>argument {selectedReview.scores.argumentControl}/4 · sources {selectedReview.scores.sourceUse}/4 · language {selectedReview.scores.languagePrecision}/4 · register {selectedReview.scores.registerControl}/4</small>
        </div>:null}
        <label>Response strategy<select value={repairStrategy} onChange={(event)=>setRepairStrategy(event.target.value as C1ReviewRepairStrategy)}><option value="accept">Accept feedback</option><option value="modify">Partly accept / modify</option><option value="reject">Reject with reasons</option></select></label>
        <label>Repaired Japanese passage<textarea lang="ja" rows={8} value={repairedPassage} onChange={(event)=>setRepairedPassage(event.target.value)} placeholder="フィードバックを踏まえた修正版…"/></label>
        <label>Reasoning<textarea rows={6} value={repairRationale} onChange={(event)=>setRepairRationale(event.target.value)} placeholder="何を採用し、何を採用しなかったか。なぜその判断をしたか…"/></label>
        <button className="primary" type="button" disabled={!reviewId||repairedPassage.trim().length<160||repairRationale.trim().length<100} onClick={()=>void saveRepair()}>Save repair pass</button>
      </article>:<p className="p17-empty">A research-quality human review is required before the repair loop can start.</p>}
    </div>:null}

    {message?<p className="p17-message" role="status">{message}</p>:null}
  </section>;
}

function P17Stat({value,label}:{value:number;label:string}){return <div><strong>{value}</strong><span>{label}</span></div>;}

function errorMessage(error:unknown):string{
  const code=error instanceof Error?error.message:String(error);
  const friendly:Record<string,string>={
    P17_PRECISION_ORIGINAL_TOO_SHORT:"Use a substantial source passage of at least 180 characters.",
    P17_PRECISION_REVISION_TOO_SHORT:"The rewritten passage is too short for meaningful precision work.",
    P17_PRECISION_REVISION_MUST_CHANGE:"The revision must materially differ from the original.",
    P17_PRECISION_RATIONALE_TOO_SHORT:"Explain the linguistic and rhetorical choices in more detail.",
    P17_COMPRESSION_RATIO_OUT_OF_RANGE:"Compression should reduce the passage to roughly 30–75% of its original length.",
    P17_EXPANSION_NOT_SUBSTANTIAL:"Expansion should increase the passage by at least about 20%.",
    P17_SPECIALIST_TRACK_REQUIRED:"Choose a Research quality specialist track first.",
    P17_SPECIALIST_RESPONSE_TOO_SHORT:"Develop the specialist response further before saving.",
    P17_REFRESH_REQUIRES_TWO_SOURCES:"Choose two different registered sources.",
    P17_REFRESH_ANALYSIS_TOO_SHORT:"Develop each source-refresh section in more detail.",
    P17_HUMAN_REVIEW_REQUIRED:"Choose an existing research-quality human review.",
    P17_REPAIR_PASSAGE_TOO_SHORT:"The repair passage is too short.",
    P17_REPAIR_RATIONALE_TOO_SHORT:"Explain how you handled the reviewer feedback in more detail."
  };
  return friendly[code]??code;
}
