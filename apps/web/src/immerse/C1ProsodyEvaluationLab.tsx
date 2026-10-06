import { useEffect,useRef,useState } from "react";
import type { PrivateProsodyCaptureRecord } from "@thiepn/local-db";
import {
  analyzeAmplitudeEnvelope,buildC2OrientedReviewPacket,c1OverlapListeningTasks,c1ProsodyTargets,
  deleteLocalP19ProsodyCapture,getC1ProsodyEvaluationProgress,listLocalP19ProsodyCaptures,
  overlapSources,saveC1OverlapListeningAttempt,saveC1ProsodyCapture,saveC2ExternalHumanReview,
  type C1OverlapListeningTask,type C1ProsodyEvaluationProgress,type C1ProsodyTargetId,
  type C1ProsodyTimingMetrics,type C2ExternalReviewerRole,type C2ExternalReviewModality,
  type C2ReviewDimension,type C2ReviewScores
} from "../study/c1ProsodyEvaluation";

type Tab="prosody"|"overlap"|"review";
type RecordingState="idle"|"requesting"|"recording"|"analyzing"|"ready"|"error";

const EMPTY_PROGRESS:C1ProsodyEvaluationProgress={
  activeDays:0,prosodyCaptures:[],overlapAttempts:[],externalReviews:[],
  prosodyTargets:0,overlapTasks:0,reviewedSessions:0,broadlyCoveredReviews:0,localCaptureCount:0
};
const DIMENSIONS:Array<{id:C2ReviewDimension;label:string}>=[
  {id:"lexicalPrecision",label:"Lexical precision"},
  {id:"grammaticalControl",label:"Grammatical control"},
  {id:"discourseOrganization",label:"Discourse organization"},
  {id:"interactionRepair",label:"Interaction repair"},
  {id:"registerFlexibility",label:"Register flexibility"},
  {id:"prosodicControl",label:"Prosodic control"},
  {id:"listeningUnderPressure",label:"Listening under pressure"}
];
const EMPTY_SCORES:C2ReviewScores={
  lexicalPrecision:null,grammaticalControl:null,discourseOrganization:null,interactionRepair:null,
  registerFlexibility:null,prosodicControl:null,listeningUnderPressure:null
};

export function C1ProsodyEvaluationLab(){
  const [tab,setTab]=useState<Tab>("prosody");
  const [progress,setProgress]=useState<C1ProsodyEvaluationProgress>(EMPTY_PROGRESS);
  const [localCaptures,setLocalCaptures]=useState<PrivateProsodyCaptureRecord[]>([]);
  const [message,setMessage]=useState("");

  const [targetId,setTargetId]=useState<C1ProsodyTargetId>("formal_chunking");
  const [recordingState,setRecordingState]=useState<RecordingState>("idle");
  const [pendingBlob,setPendingBlob]=useState<Blob|null>(null);
  const [pendingMetrics,setPendingMetrics]=useState<C1ProsodyTimingMetrics|null>(null);
  const [transcript,setTranscript]=useState(c1ProsodyTargets[0]!.japanesePrompt);
  const [reflection,setReflection]=useState("");
  const recorderRef=useRef<MediaRecorder|null>(null);
  const streamRef=useRef<MediaStream|null>(null);
  const chunksRef=useRef<Blob[]>([]);

  const [overlapId,setOverlapId]=useState(c1OverlapListeningTasks[0]!.id);
  const [overlapPlayed,setOverlapPlayed]=useState(false);
  const [overlapMixValid,setOverlapMixValid]=useState(false);
  const [overlapPlaying,setOverlapPlaying]=useState(false);
  const [recall,setRecall]=useState("");
  const [uncertain,setUncertain]=useState("");
  const [repairPlan,setRepairPlan]=useState("");
  const primaryAudio=useRef<HTMLAudioElement|null>(null);
  const maskerAudio=useRef<HTMLAudioElement|null>(null);
  const maskerTimer=useRef<number|null>(null);

  const [reviewerLabel,setReviewerLabel]=useState("");
  const [reviewerRole,setReviewerRole]=useState<C2ExternalReviewerRole>("teacher");
  const [modality,setModality]=useState<C2ExternalReviewModality>("combined");
  const [observed,setObserved]=useState({longFormProduction:true,liveInteraction:true,audioProsody:false,overlapListening:false});
  const [scores,setScores]=useState<C2ReviewScores>(EMPTY_SCORES);
  const [strengths,setStrengths]=useState("");
  const [priorities,setPriorities]=useState("");
  const [evidenceNotes,setEvidenceNotes]=useState("");

  async function refresh(){
    const [nextProgress,nextCaptures]=await Promise.all([getC1ProsodyEvaluationProgress(),listLocalP19ProsodyCaptures()]);
    setProgress(nextProgress);setLocalCaptures(nextCaptures);
  }
  useEffect(()=>{void refresh().catch(()=>{setProgress(EMPTY_PROGRESS);setLocalCaptures([]);});return()=>stopAllAudio();},[]);

  const target=c1ProsodyTargets.find((item)=>item.id===targetId)??c1ProsodyTargets[0]!;
  const overlap=c1OverlapListeningTasks.find((item)=>item.id===overlapId)??c1OverlapListeningTasks[0]!;
  const overlapPair=overlapSources(overlap);

  function selectTarget(id:C1ProsodyTargetId){
    const next=c1ProsodyTargets.find((item)=>item.id===id)!;
    setTargetId(id);setTranscript(next.japanesePrompt);setReflection("");setPendingBlob(null);setPendingMetrics(null);setRecordingState("idle");setMessage("");
  }

  async function startRecording(){
    setMessage("");setPendingBlob(null);setPendingMetrics(null);setRecordingState("requesting");
    if(!navigator.mediaDevices?.getUserMedia||typeof MediaRecorder==="undefined"){setRecordingState("error");setMessage("Audio recording is unavailable in this browser.");return;}
    try{
      const stream=await navigator.mediaDevices.getUserMedia({audio:true});
      streamRef.current=stream;
      const recorder=new MediaRecorder(stream);
      recorderRef.current=recorder;chunksRef.current=[];
      recorder.ondataavailable=(event)=>{if(event.data.size)chunksRef.current.push(event.data);};
      recorder.onerror=()=>{setRecordingState("error");stopRecorderStream();};
      recorder.onstop=()=>{void finishRecording(recorder.mimeType||"audio/webm");};
      recorder.start();setRecordingState("recording");
    }catch{
      setRecordingState("error");setMessage("Microphone permission or recording initialization failed.");
    }
  }

  function stopRecording(){
    if(recorderRef.current?.state==="recording"){setRecordingState("analyzing");recorderRef.current.stop();}
  }

  async function finishRecording(mimeType:string){
    const blob=new Blob(chunksRef.current,{type:mimeType});
    stopRecorderStream();
    try{
      const metrics=await analyzeAudioBlob(blob);
      setPendingBlob(blob);setPendingMetrics(metrics);setRecordingState("ready");
    }catch{
      setRecordingState("error");setMessage("The recording was captured but its audio signal could not be decoded for timing analysis.");
    }
  }

  function stopRecorderStream(){
    streamRef.current?.getTracks().forEach((track)=>track.stop());
    streamRef.current=null;recorderRef.current=null;
  }

  async function saveProsody(){
    if(!pendingBlob||!pendingMetrics)return;
    setMessage("");
    try{
      await saveC1ProsodyCapture({targetId,audioBlob:pendingBlob,metrics:pendingMetrics,transcript,selfReflection:reflection});
      setPendingBlob(null);setPendingMetrics(null);setReflection("");setRecordingState("idle");
      setMessage("Prosody capture saved. Raw audio stays in this device's private IndexedDB; only bounded evidence metadata enters the StudyEvent stream.");
      await refresh();
    }catch(error){setMessage(errorMessage(error));}
  }

  async function deleteCapture(id:string){
    await deleteLocalP19ProsodyCapture(id);setMessage("Local audio deleted. Previously saved evidence metadata remains in the StudyEvent history.");await refresh();
  }

  function stopAllAudio(){
    if(maskerTimer.current!==null){window.clearTimeout(maskerTimer.current);maskerTimer.current=null;}
    for(const audio of [primaryAudio.current,maskerAudio.current]){if(audio){audio.pause();audio.removeAttribute("src");audio.load();}}
    primaryAudio.current=null;maskerAudio.current=null;setOverlapPlaying(false);
  }

  async function playOverlap(task:C1OverlapListeningTask){
    stopAllAudio();setMessage("");setOverlapPlayed(false);setOverlapMixValid(false);setOverlapPlaying(true);
    const pair=overlapSources(task);
    const primary=new Audio(pair.primary.recording.url),masker=new Audio(pair.masker.recording.url);
    primaryAudio.current=primary;maskerAudio.current=masker;
    primary.preload="auto";masker.preload="auto";primary.playbackRate=task.primaryRate;masker.volume=task.maskerVolume;
    primary.onended=()=>{stopAllAudio();setOverlapPlayed(true);};
    primary.onerror=()=>{stopAllAudio();setMessage("The primary verified native recording could not be played.");};
    masker.onerror=()=>setMessage("The competing recording could not be played; this attempt should not be saved as overlap evidence.");
    try{
      await primary.play();
      maskerTimer.current=window.setTimeout(()=>{void masker.play().then(()=>setOverlapMixValid(true)).catch(()=>{setOverlapMixValid(false);setMessage("The competing recording could not start; this attempt cannot be saved as overlap evidence.");});},task.maskerDelayMs);
    }catch{
      stopAllAudio();setMessage("The verified native source could not start in this browser.");
    }
  }

  function selectOverlap(id:string){
    stopAllAudio();setOverlapId(id);setOverlapPlayed(false);setOverlapMixValid(false);setRecall("");setUncertain("");setRepairPlan("");setMessage("");
  }

  async function saveOverlap(){
    setMessage("");
    try{
      await saveC1OverlapListeningAttempt({taskId:overlap.id,recall,uncertainSegment:uncertain,repairPlan});
      setOverlapPlayed(false);setRecall("");setUncertain("");setRepairPlan("");
      setMessage("Overlap-listening attempt saved as structural listening-under-pressure evidence, not comprehension mastery.");
      await refresh();
    }catch(error){setMessage(errorMessage(error));}
  }

  async function exportReviewPacket(){
    const packet=await buildC2OrientedReviewPacket();
    downloadText("japanese-c2-oriented-review-packet-"+packet.generatedAt.slice(0,10)+".json",JSON.stringify(packet,null,2),"application/json");
  }

  async function saveReview(){
    setMessage("");
    try{
      await saveC2ExternalHumanReview({
        reviewerLabel,reviewerRole,modality,evidenceObserved:observed,scores,strengths,priorities,evidenceNotes
      });
      setReviewerLabel("");setScores(EMPTY_SCORES);setStrengths("");setPriorities("");setEvidenceNotes("");
      setMessage("External C2-oriented review saved as qualitative human evidence. It does not change mastery or certify CEFR C2.");
      await refresh();
    }catch(error){setMessage(errorMessage(error));}
  }

  return <section className="p19-evidence" id="p19-prosody-overlap-review">
    <div className="section-heading">
      <div><span className="course-kicker">P19 PROSODY · OVERLAP · EXTERNAL REVIEW</span><h2>Add real audio evidence without inventing acoustic scores</h2></div>
      <span className="course-count">{progress.activeDays} P19 evidence day{progress.activeDays===1?"":"s"}</span>
    </div>
    <p className="course-note">P19 analyzes only audio properties the browser actually receives: duration, speech activity, pauses and amplitude dynamics. It does not infer pitch-accent correctness, intonation quality or pronunciation mastery. Overlap tasks use artificial mixes of repository-verified native recordings and are labeled as such.</p>

    <div className="p19-stats">
      <P19Stat value={progress.prosodyCaptures.length} label="prosody captures"/>
      <P19Stat value={progress.prosodyTargets} label="prosody targets"/>
      <P19Stat value={progress.overlapAttempts.length} label="overlap attempts"/>
      <P19Stat value={progress.overlapTasks} label="overlap tasks"/>
      <P19Stat value={progress.externalReviews.length} label="external reviews"/>
      <P19Stat value={progress.broadlyCoveredReviews} label="broad reviews"/>
      <P19Stat value={progress.localCaptureCount} label="local audio files"/>
    </div>

    <div className="p19-tabs" role="tablist" aria-label="P19 evidence workspace">
      <button className={tab==="prosody"?"active":""} type="button" onClick={()=>setTab("prosody")}>Prosodic control</button>
      <button className={tab==="overlap"?"active":""} type="button" onClick={()=>setTab("overlap")}>Listening under overlap</button>
      <button className={tab==="review"?"active":""} type="button" onClick={()=>setTab("review")}>External C2-oriented review</button>
    </div>

    {tab==="prosody"?<div className="p19-workspace">
      <div className="p19-target-grid">{c1ProsodyTargets.map((item)=><button className={item.id===targetId?"active":""} key={item.id} type="button" onClick={()=>selectTarget(item.id)}>
        <strong>{item.title}</strong><small>{item.situation}</small>
      </button>)}</div>
      <article className="p19-card">
        <div className="p19-card-head"><div><span>LOCAL AUDIO CAPTURE</span><h3>{target.title}</h3></div><strong>{recordingState}</strong></div>
        <p>{target.situation}</p>
        <blockquote lang="ja">{target.japanesePrompt}</blockquote>
        <div className="p19-chip-row">{target.intendedControl.map((item)=><span key={item}>{item}</span>)}</div>
        <div className="p19-actions">
          {recordingState!=="recording"?<button className="primary" type="button" disabled={recordingState==="requesting"||recordingState==="analyzing"} onClick={()=>void startRecording()}>Record real audio</button>:<button className="primary" type="button" onClick={stopRecording}>Stop + analyze timing</button>}
          {pendingBlob?<BlobAudio blob={pendingBlob}/>:null}
        </div>
        {pendingMetrics?<div className="p19-metrics">
          <Metric value={(pendingMetrics.durationMs/1000).toFixed(1)+"s"} label="duration"/>
          <Metric value={Math.round(pendingMetrics.activeSpeechRatio*100)+"%"} label="active speech"/>
          <Metric value={Math.round(pendingMetrics.pauseRatio*100)+"%"} label="pause ratio"/>
          <Metric value={pendingMetrics.longPauseCount} label="300ms+ pauses"/>
          <Metric value={pendingMetrics.phraseCount} label="timing phrases"/>
          <Metric value={pendingMetrics.dynamicRangeDb.toFixed(1)+" dB"} label="amplitude range"/>
        </div>:null}
        <label>Spoken text / transcript<textarea lang="ja" rows={5} value={transcript} onChange={(event)=>setTranscript(event.target.value)}/></label>
        <label>Self-review of timing and phrasing<textarea rows={5} value={reflection} onChange={(event)=>setReflection(event.target.value)} placeholder="Where did the phrasing, pausing or turn-entry timing support the intended discourse move? What would you change on the next take?"/></label>
        <button className="primary" type="button" disabled={!pendingBlob||!pendingMetrics||transcript.trim().length<40||reflection.trim().length<80} onClick={()=>void saveProsody()}>Save local audio evidence</button>
        <p className="p19-boundary">Raw recording stays local-only. Synced evidence stores timing metrics and your reflection, not the audio blob. Signal metrics describe timing/amplitude, not Japanese pitch accent or intonation correctness.</p>
      </article>

      {localCaptures.length?<section className="p19-local-list">
        <div className="section-heading"><div><span className="course-kicker">PRIVATE DEVICE AUDIO</span><h3>Recent recordings stored only on this device</h3></div><span>{localCaptures.length} files</span></div>
        {localCaptures.slice(0,8).map((capture)=><LocalCapture key={capture.id} capture={capture} onDelete={()=>void deleteCapture(capture.id)}/>)}
      </section>:null}
    </div>:null}

    {tab==="overlap"?<div className="p19-workspace">
      <div className="p19-overlap-grid">{c1OverlapListeningTasks.map((task)=><button className={task.id===overlapId?"active":""} type="button" key={task.id} onClick={()=>selectOverlap(task.id)}>
        <strong>{task.title}</strong><small>{task.focus}</small>
      </button>)}</div>
      <article className="p19-card">
        <div className="p19-card-head"><div><span>ARTIFICIAL OVERLAP OF VERIFIED NATIVE SOURCES</span><h3>{overlap.title}</h3></div><strong>{overlap.primaryRate.toFixed(2)}× primary · {Math.round(overlap.maskerVolume*100)}% masker</strong></div>
        <p>{overlap.focus}</p>
        <div className="p19-source-pair">
          <div><span>PRIMARY</span><strong>{overlapPair.primary.title}</strong><small>{overlapPair.primary.recording.speakerLabel} · {overlapPair.primary.recording.register} · {overlapPair.primary.recording.speechRate}</small></div>
          <div><span>COMPETING SOURCE</span><strong>{overlapPair.masker.title}</strong><small>{overlapPair.masker.recording.speakerLabel} · starts {overlap.maskerDelayMs}ms later</small></div>
        </div>
        <div className="p19-actions">
          <button className="primary" disabled={overlapPlaying} type="button" onClick={()=>void playOverlap(overlap)}>{overlapPlaying?"Playing overlap…":overlapPlayed?"Replay overlap challenge":"Play overlap challenge"}</button>
          {overlapPlaying?<button className="quiet-button" type="button" onClick={stopAllAudio}>Stop</button>:null}
        </div>
        <label>Reconstruct the primary message without reopening a transcript<textarea lang="ja" rows={6} value={recall} onChange={(event)=>setRecall(event.target.value)} placeholder="主音声の主張、条件、留保、次の行動などを再構成する…"/></label>
        <label>What could you not resolve confidently?<textarea lang="ja" rows={4} value={uncertain} onChange={(event)=>setUncertain(event.target.value)} placeholder="聞き取れなかった箇所、競合音声で曖昧になった点…"/></label>
        <label>Recovery strategy<textarea lang="ja" rows={4} value={repairPlan} onChange={(event)=>setRepairPlan(event.target.value)} placeholder="次回どの手掛かりを優先するか、聞き逃した後にどう復帰するか…"/></label>
        <button className="primary" type="button" disabled={!overlapPlayed||!overlapMixValid||recall.trim().length<100||uncertain.trim().length<50||repairPlan.trim().length<50} onClick={()=>void saveOverlap()}>Save overlap attempt</button>
        {!overlapMixValid&&overlapPlayed?<p className="coach-warning">The competing stream was not confirmed as playing, so this run cannot be saved as overlap evidence. Replay the challenge.</p>:null}
        <p className="p19-boundary">The overlap itself is artificially created in-browser from two separately verified native recordings. That is demanding listening evidence, but not evidence of a naturally occurring multi-speaker conversation.</p>
      </article>
    </div>:null}

    {tab==="review"?<div className="p19-workspace">
      <article className="p19-card">
        <div className="p19-card-head"><div><span>EXTERNAL C2-ORIENTED HUMAN REVIEW</span><h3>Give a reviewer evidence without giving the app a fake C2 authority</h3></div><button className="unit-action" type="button" onClick={()=>void exportReviewPacket()}>Export reviewer packet</button></div>
        <p>The rubric is C2-oriented, not a CEFR certification exam. Reviewer identity and qualifications are entered by the learner and are not independently verified by the app. Scores never change FSRS or mastery.</p>
        <div className="p19-two">
          <label>Reviewer label<input value={reviewerLabel} onChange={(event)=>setReviewerLabel(event.target.value)} placeholder="Teacher / evaluator name or label"/></label>
          <label>Reviewer role<select value={reviewerRole} onChange={(event)=>setReviewerRole(event.target.value as C2ExternalReviewerRole)}><option value="teacher">Teacher</option><option value="examiner">Examiner</option><option value="language_professional">Language professional</option><option value="native_specialist">Native specialist</option></select></label>
          <label>Review modality<select value={modality} onChange={(event)=>setModality(event.target.value as C2ExternalReviewModality)}><option value="combined">Combined</option><option value="live_interview">Live interview</option><option value="recording_review">Recording review</option><option value="portfolio_review">Portfolio review</option></select></label>
        </div>
        <fieldset className="p19-observed"><legend>Evidence directly observed by reviewer</legend>
          {([
            ["longFormProduction","Long-form production"],
            ["liveInteraction","Live interaction"],
            ["audioProsody","Actual audio / prosody"],
            ["overlapListening","Listening under pressure"]
          ] as const).map(([key,label])=><label key={key}><input type="checkbox" checked={observed[key]} onChange={(event)=>setObserved((current)=>({...current,[key]:event.target.checked}))}/><span>{label}</span></label>)}
        </fieldset>
        <div className="p19-rubric">{DIMENSIONS.map((dimension)=><label key={dimension.id}><span>{dimension.label}</span><select value={scores[dimension.id]===null?"":String(scores[dimension.id])} onChange={(event)=>setScores((current)=>({...current,[dimension.id]:event.target.value===""?null:Number(event.target.value)}))}>
          <option value="">Not observed</option>{[0,1,2,3,4,5].map((value)=><option value={value} key={value}>{value}/5</option>)}
        </select></label>)}</div>
        <label>Observed strengths<textarea rows={5} value={strengths} onChange={(event)=>setStrengths(event.target.value)} placeholder="Anchor comments in specific observed language or interaction evidence…"/></label>
        <label>Highest-priority improvements<textarea rows={5} value={priorities} onChange={(event)=>setPriorities(event.target.value)} placeholder="Identify the few changes that would most improve advanced control…"/></label>
        <label>Evidence notes<textarea rows={6} value={evidenceNotes} onChange={(event)=>setEvidenceNotes(event.target.value)} placeholder="Which live turns, recordings, overlap tasks, writing artifacts or specialist work were actually reviewed?"/></label>
        <button className="primary" type="button" disabled={!reviewerLabel.trim()||strengths.trim().length<100||priorities.trim().length<100||evidenceNotes.trim().length<120||Object.values(scores).filter((value)=>value!==null).length<4} onClick={()=>void saveReview()}>Save external review</button>
        <p className="p19-boundary">Broad coverage requires 6+ scored dimensions plus direct observation of long-form production, live interaction, actual audio and listening under pressure. Even broad coverage remains external qualitative evidence—not accredited C2 certification.</p>
      </article>

      {progress.externalReviews.length?<section className="p19-review-history">{progress.externalReviews.slice().reverse().slice(0,6).map((review)=><article key={review.id}>
        <div><strong>{review.reviewerLabel}</strong><span>{review.reviewerRole.replaceAll("_"," ")} · {review.modality.replaceAll("_"," ")}</span></div>
        <small>{review.scoreCoverage}/7 dimensions · {review.broadCoverage?"broad evidence coverage":"partial evidence coverage"} · {new Date(review.reviewedAt).toLocaleDateString()}</small>
        <p>{review.priorities}</p>
      </article>)}</section>:null}
    </div>:null}

    {message?<p className="p19-message" role="status">{message}</p>:null}
  </section>;
}

function P19Stat({value,label}:{value:number;label:string}){return <div><strong>{value}</strong><span>{label}</span></div>;}
function Metric({value,label}:{value:string|number;label:string}){return <div><strong>{value}</strong><span>{label}</span></div>;}

function BlobAudio({blob}:{blob:Blob}){
  const [url,setUrl]=useState("");
  useEffect(()=>{const next=URL.createObjectURL(blob);setUrl(next);return()=>URL.revokeObjectURL(next);},[blob]);
  return url?<audio controls src={url}/>:null;
}

function LocalCapture({capture,onDelete}:{capture:PrivateProsodyCaptureRecord;onDelete:()=>void}){
  const [url,setUrl]=useState("");
  useEffect(()=>{const next=URL.createObjectURL(capture.audioBlob);setUrl(next);return()=>URL.revokeObjectURL(next);},[capture]);
  return <article><div><strong>{capture.targetLabel??"Prosody capture"}</strong><span>{new Date(capture.createdAt).toLocaleString()}</span></div>
    {url?<audio controls src={url}/>:null}
    <small>{(capture.durationMs/1000).toFixed(1)}s · {Math.round(capture.pauseRatio*100)}% pause ratio · {capture.longPauseCount} long pauses · {capture.dynamicRangeDb.toFixed(1)} dB amplitude range</small>
    <button className="quiet-button" type="button" onClick={onDelete}>Delete local audio</button>
  </article>;
}

async function analyzeAudioBlob(blob:Blob):Promise<C1ProsodyTimingMetrics>{
  const AudioContextCtor=window.AudioContext;
  if(!AudioContextCtor)throw new Error("AUDIO_CONTEXT_UNAVAILABLE");
  const context=new AudioContextCtor();
  try{
    const buffer=await context.decodeAudioData(await blob.arrayBuffer());
    const channels=buffer.numberOfChannels;
    const samples=new Float32Array(buffer.length);
    for(let channel=0;channel<channels;channel++){
      const data=buffer.getChannelData(channel);
      for(let index=0;index<data.length;index++)samples[index]=(samples[index]??0)+(data[index]??0)/channels;
    }
    return analyzeAmplitudeEnvelope(samples,buffer.sampleRate);
  }finally{await context.close();}
}

function downloadText(filename:string,content:string,mime:string){
  const blob=new Blob([content],{type:mime});
  const url=URL.createObjectURL(blob);
  const anchor=document.createElement("a");anchor.href=url;anchor.download=filename;anchor.click();
  setTimeout(()=>URL.revokeObjectURL(url),0);
}

function errorMessage(error:unknown):string{
  const code=error instanceof Error?error.message:String(error);
  const friendly:Record<string,string>={
    P19_AUDIO_SIZE_INVALID:"Record a smaller audio sample (maximum 20 MB).",
    P19_AUDIO_DURATION_INVALID:"Use a real spoken sample between about 1.5 seconds and 3 minutes.",
    P19_PROSODY_TRANSCRIPT_TOO_SHORT:"Provide the spoken text or transcript before saving.",
    P19_PROSODY_REFLECTION_TOO_SHORT:"Reflect on the timing and phrasing in more detail.",
    P19_OVERLAP_RECALL_TOO_SHORT:"Reconstruct the primary source in more detail.",
    P19_OVERLAP_UNCERTAINTY_TOO_SHORT:"Identify the unresolved listening uncertainty more precisely.",
    P19_OVERLAP_REPAIR_TOO_SHORT:"Describe a concrete recovery strategy for the next attempt.",
    P19_REVIEWER_REQUIRED:"Add the reviewer label.",
    P19_REVIEW_SCORE_INVALID:"Reviewer dimension scores must be whole numbers from 0 to 5 or left unobserved.",
    P19_REVIEW_COVERAGE_TOO_LOW:"At least four review dimensions must be directly scored.",
    P19_REVIEW_COMMENT_TOO_SHORT:"The external reviewer comments need more concrete observed evidence."
  };
  return friendly[code]??code;
}
