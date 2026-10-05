import { useEffect,useMemo,useRef,useState } from "react";
import { c1InteractionScenarios,getC1InteractionSummary,recordC1SpontaneousTurn,type C1InteractionSummary } from "./c1Interaction";

interface RecognitionResultLike {0:{transcript:string};isFinal:boolean}
interface RecognitionEventLike {results:ArrayLike<RecognitionResultLike>}
interface RecognitionLike {
  lang:string;interimResults:boolean;continuous:boolean;
  start():void;stop():void;
  onresult:((event:RecognitionEventLike)=>void)|null;
  onend:(()=>void)|null;
  onerror:(()=>void)|null;
}
type RecognitionCtor=new()=>RecognitionLike;

export function C1SpontaneousLab(){
  const [scenarioId,setScenarioId]=useState(c1InteractionScenarios[0]!.id);
  const [stageIndex,setStageIndex]=useState(0);
  const [revealed,setRevealed]=useState(false);
  const [transcript,setTranscript]=useState("");
  const [listening,setListening]=useState(false);
  const [usedPreparation,setUsedPreparation]=useState(false);
  const [selfRepair,setSelfRepair]=useState(false);
  const [message,setMessage]=useState("");
  const [summary,setSummary]=useState<C1InteractionSummary>({turns:0,scenarios:0,spontaneousTurns:0,repairedTurns:0});
  const startedAt=useRef(0);
  const recognition=useRef<RecognitionLike|null>(null);
  const scenario=useMemo(()=>c1InteractionScenarios.find(x=>x.id===scenarioId)!,[scenarioId]);
  const stage=scenario.stages[Math.min(stageIndex,scenario.stages.length-1)]!;
  useEffect(()=>{void getC1InteractionSummary().then(setSummary);return()=>recognition.current?.stop();},[]);

  function reveal(){
    setRevealed(true);setTranscript("");setMessage("");setUsedPreparation(false);setSelfRepair(false);startedAt.current=performance.now();
  }
  function startRecognition(){
    const ctor=(window as unknown as {SpeechRecognition?:RecognitionCtor;webkitSpeechRecognition?:RecognitionCtor}).SpeechRecognition
      ??(window as unknown as {webkitSpeechRecognition?:RecognitionCtor}).webkitSpeechRecognition;
    if(!ctor){setMessage("Japanese browser speech recognition is unavailable. You can still type the transcript immediately after speaking.");return;}
    const rec=new ctor();recognition.current=rec;rec.lang="ja-JP";rec.interimResults=true;rec.continuous=true;
    rec.onresult=(event)=>{
      let value="";
      for(let i=0;i<event.results.length;i++)value+=event.results[i]?.[0]?.transcript??"";
      setTranscript(value);
    };
    rec.onend=()=>setListening(false);rec.onerror=()=>{setListening(false);setMessage("Speech recognition stopped. Your transcript can still be edited manually.");};
    setListening(true);rec.start();
  }
  async function save(){
    if(!transcript.trim())return;
    recognition.current?.stop();setListening(false);
    await recordC1SpontaneousTurn({
      scenarioId:scenario.id,stageId:stage.id,response:transcript,
      responseTimeMs:startedAt.current?performance.now()-startedAt.current:0,usedPreparation,selfRepair
    });
    setSummary(await getC1InteractionSummary());
    setMessage("Spontaneous turn saved as ungraded speaking evidence.");
    if(stageIndex<scenario.stages.length-1){setStageIndex(v=>v+1);setRevealed(false);setTranscript("");}
  }
  function changeScenario(id:string){setScenarioId(id);setStageIndex(0);setRevealed(false);setTranscript("");setMessage("");}

  return <section className="native-listening-lab">
    <div className="section-heading"><div><span className="course-kicker">P13 C1 SPONTANEOUS INTERACTION</span><h2>Respond before you can script the answer</h2></div><span className="course-count">{summary.turns} turns · {summary.scenarios} scenarios</span></div>
    <p>Each scenario reveals one stage at a time. The next challenge is hidden until the current turn is saved, so clarification, repair and stance changes cannot be fully scripted in advance.</p>
    <label className="native-recording-select"><span>Scenario</span><select value={scenarioId} onChange={e=>changeScenario(e.target.value)}>{c1InteractionScenarios.map(s=><option key={s.id} value={s.id}>{s.title}</option>)}</select></label>
    <p>{scenario.description}</p>
    <div className="mission-stage-list">{scenario.stages.map((s,i)=><span className={i<stageIndex?"done":i===stageIndex?"selected":""} key={s.id}>{i<stageIndex?"✓":"○"} {s.title}</span>)}</div>
    {!revealed?<button className="primary" type="button" onClick={reveal}>Reveal next challenge</button>:<article className="mission-card">
      <span>{scenario.domain} · target ~{stage.targetSeconds}s</span><h3>{stage.title}</h3>
      <p>{stage.prompt}</p><p className="course-note">{stage.pressure}</p>
      <div className="mission-stage-list">{stage.moves.map(move=><span key={move}>{move}</span>)}</div>
      <div className="productive-actions"><button className="unit-action" type="button" disabled={listening} onClick={startRecognition}>{listening?"Listening…":"Start microphone"}</button></div>
      <textarea rows={6} value={transcript} onChange={e=>setTranscript(e.target.value)} placeholder="話した内容の認識結果。音声認識が使えない場合は、先に声に出してからすぐに要約を入力…"/>
      <label><input type="checkbox" checked={usedPreparation} onChange={e=>setUsedPreparation(e.target.checked)}/> I used preparation notes before responding</label>
      <label><input type="checkbox" checked={selfRepair} onChange={e=>setSelfRepair(e.target.checked)}/> I repaired/rephrased my response during the turn</label>
      <button className="primary" type="button" disabled={!transcript.trim()} onClick={()=>void save()}>Save turn and reveal follow-up</button>
    </article>}
    {message?<p role="status" className="import-message">{message}</p>:null}
    <p className="course-note">{summary.spontaneousTurns} saved turns were marked unprepared; {summary.repairedTurns} included self-repair. Speech-recognition transcripts are interaction evidence, not acoustic pronunciation scores or semantic mastery.</p>
  </section>;
}
