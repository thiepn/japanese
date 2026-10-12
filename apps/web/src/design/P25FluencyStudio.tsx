import {useEffect,useRef,useState} from "react";
import {listMemoryTraces,listStudyEvents,saveStudyEvent} from "@thiepn/local-db";
import {gradeStudyPrompt} from "@thiepn/study-player";
import type {StudyEvent} from "@thiepn/domain";
import {DEVELOPMENT_DEVICE_ID,getDevelopmentAccountId,recordStudyAnswer} from "../study/runtime";
import {
  observeRevision,p25DialoguePrompt,p25Scenarios,p25Stats,recommendP25,
  type P25Choice,type P25Mode,type P25Scenario,type P25Stats,type RevisionObservations
} from "../study/pedagogy25";
import "./p25-fluency-studio.css";

type PracticeTab="dialogue"|"revision";
type OutputMode="writing"|"speaking";
interface BrowserSpeechRecognition {
  lang:string;continuous:boolean;interimResults:boolean;
  onresult:((event:{results:ArrayLike<ArrayLike<{transcript:string}>>})=>void)|null;
  onerror:(()=>void)|null;onend:(()=>void)|null;
  start:()=>void;stop:()=>void;
}
export function P25FluencyStudio({
  disabled,onStart
}:{
  disabled:boolean;onStart:(scenarioId:string,mode:P25Mode)=>void;
}){
  const owner=getDevelopmentAccountId();
  const ownerRef=useRef(owner);ownerRef.current=owner;
  const [scenarioId,setScenarioId]=useState(p25Scenarios[0]!.id);
  const [stats,setStats]=useState<P25Stats[]>([]);
  const [statsLoaded,setStatsLoaded]=useState(false);
  const [statsError,setStatsError]=useState("");
  const [revision,setRevision]=useState(0);
  const [tab,setTab]=useState<PracticeTab>("dialogue");
  const [turnIndex,setTurnIndex]=useState(0);
  const [attempts,setAttempts]=useState(0);
  const [lastChoice,setLastChoice]=useState<P25Choice|null>(null);
  const [conversationDone,setConversationDone]=useState(false);
  const [conversationCapped,setConversationCapped]=useState(false);
  const [showGerman,setShowGerman]=useState(false);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const startedAt=useRef(0);
  const [mode,setMode]=useState<OutputMode>("writing");
  const [draft,setDraft]=useState("");
  const [revised,setRevised]=useState("");
  const [stage,setStage]=useState<"draft"|"revise"|"compare">("draft");
  const [observations,setObservations]=useState<RevisionObservations|null>(null);
  const [practiceSaved,setPracticeSaved]=useState(false);
  const [speechStatus,setSpeechStatus]=useState("Du kannst alternativ die Antwort eintippen.");
  const recorder=useRef<BrowserSpeechRecognition|null>(null);
  const scenario=p25Scenarios.find(s=>s.id===scenarioId)??p25Scenarios[0]!;
  const turn=scenario.turns[turnIndex]??scenario.turns[0]!;
  const current=stats.find(row=>row.id===scenarioId);
  const next=recommendP25(stats);
  const recommended=p25Scenarios.find(s=>s.id===next)??p25Scenarios[0]!;
  const [loadingHistory,setLoadingHistory]=useState(true);
  useEffect(()=>{
    let active=true;setLoadingHistory(true);setStatsLoaded(false);setStatsError("");setStats([]);
    void Promise.all([listStudyEvents(owner),listMemoryTraces(owner)]).then(([events,traces])=>{
      if(!active||ownerRef.current!==owner)return;
      setStats(p25Stats(traces.filter(t=>t.userId===owner),events.filter(e=>e.userId===owner)));
      setStatsLoaded(true);
    }).catch(()=>{
      if(active)setStatsError("Lernverlauf ist nicht erreichbar. Die Übungen bleiben nutzbar.");
    }).finally(()=>{if(active)setLoadingHistory(false);});
    return()=>{active=false;};
  },[owner,revision]);
  useEffect(()=>{
    recorder.current?.stop();recorder.current=null;
    setTurnIndex(0);setAttempts(0);setLastChoice(null);
    setConversationDone(false);setConversationCapped(false);
    setTab("dialogue");setDraft("");setRevised("");setStage("draft");
    setObservations(null);setPracticeSaved(false);setError("");
    startedAt.current=performance.now();
  },[owner,scenarioId]);
  useEffect(()=>()=>recorder.current?.stop(),[]);
  function restart(){
    setTurnIndex(0);setAttempts(0);setLastChoice(null);
    setConversationDone(false);setConversationCapped(false);setError("");
    startedAt.current=performance.now();
  }
  async function submitChoice(choice:P25Choice){
    if(busy||lastChoice||conversationDone||disabled)return;
    const account=ownerRef.current;
    const prompt=p25DialoguePrompt(scenarioId,turn);
    const grade=gradeStudyPrompt(prompt,choice.japanese);
    setBusy(true);setError("");
    try{
      await recordStudyAnswer({prompt,response:choice.japanese,result:grade.result,
        responseTimeMs:Math.max(0,Math.round(performance.now()-startedAt.current))});
      if(ownerRef.current!==account)return;
      setLastChoice(choice);setRevision(value=>value+1);
    }catch{
      if(ownerRef.current===account)setError("Antwort konnte nicht gespeichert werden.");
    }finally{if(ownerRef.current===account)setBusy(false);}
  }
  function continueDialogue(){
    if(!lastChoice)return;
    const n=attempts+1;
    setAttempts(n);setLastChoice(null);
    if(n>=12){setConversationCapped(true);setConversationDone(true);return;}
    if(!lastChoice.correct){startedAt.current=performance.now();return;}
    if(turnIndex+1>=scenario.turns.length){setConversationDone(true);return;}
    setTurnIndex(n=>n+1);startedAt.current=performance.now();
  }
  function beginRevision(nextMode:OutputMode){
    recorder.current?.stop();setMode(nextMode);setDraft("");setRevised("");
    setStage("draft");setObservations(null);setPracticeSaved(false);setError("");
  }
  function beginSpeech(target:"draft"|"revised"){
    const environment=window as typeof window & {
      SpeechRecognition?:new()=>BrowserSpeechRecognition;
      webkitSpeechRecognition?:new()=>BrowserSpeechRecognition;
    };
    const Recognizer=environment.SpeechRecognition??environment.webkitSpeechRecognition;
    if(!Recognizer){setSpeechStatus("Die Spracherkennung wird nicht unterstützt. Text selbst eingeben.");return;}
    recorder.current?.stop();
    const instance=new Recognizer();recorder.current=instance;
    instance.lang="ja-JP";instance.continuous=false;instance.interimResults=false;
    instance.onresult=event=>{
      const transcript=event.results[0]?.[0]?.transcript?.trim()??"";
      if(transcript){
        if(target==="draft")setDraft(transcript);
        else setRevised(transcript);
        setObservations(null);setPracticeSaved(false);
      }
    };
    instance.onerror=()=>setSpeechStatus("Keine Erkennung. Bitte eintippen.");
    instance.onend=()=>setSpeechStatus("Aufnahme beendet. Transkript prüfen.");
    try{instance.start();setSpeechStatus("Spracherkennung läuft …");}
    catch{setSpeechStatus("Mikrofon nicht verfügbar. Bitte eintippen.");}
  }
  function reviewText(){
    if(!draft.trim())return;
    setRevised(draft);setStage("revise");setObservations(null);setPracticeSaved(false);
  }
  function compare(){
    if(!draft.trim()||!revised.trim())return;
    setObservations(observeRevision(draft,revised,scenario.revision.features));
    setStage("compare");setPracticeSaved(false);
  }
  async function saveUngraded(){
    if(busy||disabled||!observations||practiceSaved)return;
    const account=ownerRef.current;
    if(account!==getDevelopmentAccountId())return;
    const observation=observations;
    const event:StudyEvent={
      id:crypto.randomUUID(),userId:account,deviceId:DEVELOPMENT_DEVICE_ID,
      occurredAt:new Date().toISOString(),activity:mode==="writing"?"writing":"speaking",
      primaryTarget:{kind:"production_task",id:"p25:"+scenarioId+":"+mode},
      skillDimension:mode==="writing"?"writing_quality":"production",
      promptFamily:"p25-guided-revision",responseMode:mode==="writing"?"textarea":"editable-transcript",
      result:"skipped",attempts:1,
      contextId:"p25:revision:"+scenarioId,sourceId:"thiepn-original",contentVersion:"p25-1",
      metadata:{
        p25:true,scenarioId,mode,revisionAttempt:true,
        schedulerExcluded:true,graded:false,storedRawText:false,
        beforeCharacters:observation.beforeCount,afterCharacters:observation.afterCount,
        addedFeatureCount:observation.addedFeatures.length,
        changedText:observation.newWriting,
        detectedFeatureCount:observation.afterFeatures.length
      }
    };
    setBusy(true);setError("");
    try{
      await saveStudyEvent(event);
      if(ownerRef.current===account){setPracticeSaved(true);setRevision(x=>x+1);}
    }catch{
      if(ownerRef.current===account)setError("Der unbewertete Übungsversuch konnte nicht gespeichert werden.");
    }finally{if(ownerRef.current===account)setBusy(false);}
  }
  function pronounce(text:string){
    if(!("speechSynthesis" in window))return;
    window.speechSynthesis.cancel();
    const utterance=new SpeechSynthesisUtterance(text);utterance.lang="ja-JP";utterance.rate=.85;
    window.speechSynthesis.speak(utterance);
  }
  function canStart(mode:P25Mode):boolean{
    return !disabled&&(mode!=="repair"||Boolean(current&&current.due+current.retry>0));
  }
  return <section className="p25-studio" aria-labelledby="p25-fluency-title">
    <header>
      <p className="j4-kicker">ORIGINAL CONTENT · AKTIVE SPRACHPRAXIS</p>
      <h2 id="p25-fluency-title">Situationen verstehen, antworten, überarbeiten</h2>
      <p>Sechs zusätzliche A1–A2-Lernsituationen mit eigenständigen Erklärungen,
        aktivem Abruf, mehrstufigen Gesprächen und selbstständiger sprachlicher Überarbeitung.</p>
    </header>
    <div className="p25-studio__banner">
      <div><strong>Nächste sinnvolle Aufgabe</strong>
        <p>{loadingHistory?"Lernverlauf wird geladen":recommended.title}
          {statsLoaded&&stats.find(s=>s.id===next)?.due?" · fällige Wiederholungen":""}
        </p></div>
      <button type="button" disabled={disabled||loadingHistory} onClick={()=>{
        setScenarioId(recommended.id);
        const nextStats=stats.find(s=>s.id===recommended.id);
        onStart(recommended.id,((nextStats?.due??0)+(nextStats?.retry??0))>0?"repair":"lesson");
      }}>Empfohlenes Training öffnen</button>
    </div>
    {statsError?<p role="status" className="p25-studio__error">{statsError}</p>:null}
    <div className="p25-studio__layout">
      <nav className="p25-studio__nav" aria-label="Neue A1–A2-Situationen">
        {p25Scenarios.map((s,i)=>{
          const row=stats.find(x=>x.id===s.id);
          return <button key={s.id} type="button" aria-current={scenarioId===s.id?"true":undefined}
            onClick={()=>setScenarioId(s.id)}>
            <small>{String(i+1).padStart(2,"0")} · {s.level}</small><strong>{s.title}</strong>
            <small>{row?row.attempted+"/"+row.total+" Aufgaben erprobt":"Noch ohne Nachweis"}
              {row?.due?" · "+row.due+" fällig":""}</small>
          </button>;
        })}
      </nav>
      <div className="p25-studio__body">
        <h3>{scenario.title}</h3><p><strong>Das kannst du danach:</strong> {scenario.canDo}</p>
        <div className="p25-studio__situation"><strong>Situation</strong><p>{scenario.situation}</p></div>
        <h4>Wie die Sprache funktioniert</h4><p>{scenario.mentalModel}</p>
        <div className="p25-studio__concepts">
          <article><strong>Unterscheide</strong><p>{scenario.contrast}</p></article>
          <article><strong>Vermeide</strong><p>{scenario.pitfall}</p></article>
        </div>
        <h4>Wortschatz in Beispielsätzen</h4>
        <ul className="p25-studio__vocab">{scenario.words.map(w=><li key={w.japanese}>
          <strong lang="ja">{w.japanese}</strong><small lang="ja">{w.reading}</small>
          <span>{w.german}</span><small lang="ja">{w.example}</small></li>)}</ul>
        <div className="p25-studio__toolbar">
          <button disabled={!canStart("lesson")} onClick={()=>onStart(scenarioId,"lesson")}>6 Lernaufgaben starten</button>
          <button disabled={!canStart("transfer")} onClick={()=>onStart(scenarioId,"transfer")}>Transfer + fällige Aufgaben</button>
          <button disabled={!canStart("repair")} onClick={()=>onStart(scenarioId,"repair")}>Fehler gezielt wiederholen {((current?.due??0)+(current?.retry??0))>0?"("+((current?.due??0)+(current?.retry??0))+")":""}</button>
        </div>
        <div className="p25-studio__mode" aria-label="Trainingsmodus">
          <button type="button" aria-pressed={tab==="dialogue"} onClick={()=>setTab("dialogue")}>Mehrstufiger Dialog</button>
          <button type="button" aria-pressed={tab==="revision"} onClick={()=>setTab("revision")}>Schreiben / Sprechen überarbeiten</button>
        </div>
        {tab==="dialogue"?<div className="p25-studio__dialogue">
          <h4>Im Gespräch reagieren</h4>
          {conversationDone?<div role="status">
            <strong>{conversationCapped?"Gespräch nach vielen Versuchen unterbrochen":"Gespräch abgeschlossen"}</strong>
            <p>{attempts} beantwortete Gesprächsschritte. Gesprächsauswahl ist keine Bewertung freien Sprechens.</p>
            <button type="button" onClick={restart}>Gespräch wiederholen</button>
          </div>:<>
            <p className="p25-studio__step">Schritt {turnIndex+1}/{scenario.turns.length} · Versuch {attempts+1}/12</p>
            <blockquote><strong>Gesprächspartner</strong><p lang="ja">{turn.japanese}</p>
              {showGerman?<small>{turn.german}</small>:null}
              <div className="p25-studio__actions"><button type="button" onClick={()=>pronounce(turn.japanese)}>Gerätestimme anhören</button></div>
            </blockquote>
            <label><input type="checkbox" checked={showGerman} onChange={e=>setShowGerman(e.target.checked)}/> Deutsche Hilfe anzeigen</label>
            <div className="p25-studio__choices" role="group" aria-label="Antwort wählen">
              {turn.choices.map(choice=><button key={choice.id} type="button" disabled={disabled||busy||Boolean(lastChoice)}
                onClick={()=>void submitChoice(choice)}>
                <span lang="ja">{choice.japanese}</span>{showGerman?<small>{choice.german}</small>:null}
              </button>)}
            </div>
            {lastChoice?<div className="p25-studio__response" role="status">
              <strong>{lastChoice.correct?"Angemessene Antwort":"Missverständnis: antworte erneut"}</strong>
              <p>{lastChoice.explanation}</p>
              {lastChoice.correct?<p><strong>Deine Antwort:</strong> <span lang="ja">{lastChoice.japanese}</span></p>
                :<p>Dein Gesprächspartner bittet um eine passende Antwort auf dieselbe Frage.</p>}
              <button type="button" onClick={continueDialogue}>
                {lastChoice.correct?"Gespräch fortsetzen":"Antwort reparieren"}
              </button>
            </div>:null}
          </>}
          <button type="button" disabled={busy} onClick={restart}>Von vorn beginnen</button>
          <p className="p25-studio__disclaimer">Szenarien sind regelbasiert, nicht KI-generiert. Antworten werden als normale Lernereignisse mit FSRS erfasst.</p>
        </div>:<div className="p25-studio__revision">
          <h4>Eine eigene Antwort verbessern</h4>
          <div className="p25-studio__mode">
            <button type="button" aria-pressed={mode==="writing"} onClick={()=>beginRevision("writing")}>Schreiben</button>
            <button type="button" aria-pressed={mode==="speaking"} onClick={()=>beginRevision("speaking")}>Sprechen</button>
          </div>
          <p><strong>Aufgabe:</strong> {mode==="writing"?scenario.revision.writing:scenario.revision.speaking}</p>
          <label htmlFor="p25-draft">Erste Fassung (Japanisch)</label>
          <textarea id="p25-draft" lang="ja" rows={4} value={draft} onChange={e=>{
            setDraft(e.target.value);setStage("draft");setObservations(null);setPracticeSaved(false);
          }} placeholder="日本語で答えてください…"/>
          {mode==="speaking"?<button type="button" onClick={()=>beginSpeech("draft")}>Erste Fassung diktieren</button>:null}
          {mode==="speaking"?<p role="status">{speechStatus} Browser-Erkennung kann einen externen Spracherkennungsdienst verwenden.</p>:null}
          <div className="p25-studio__actions"><button type="button" disabled={!draft.trim()} onClick={reviewText}>Mit Überarbeitung fortfahren</button></div>
          {stage!=="draft"?<>
            <div className="p25-studio__response">
              <h5>Überarbeitungshilfen</h5>
              <p>{scenario.revision.advice}</p>
              <p><strong>Beobachtbare Zielausdrücke:</strong> <span lang="ja">{scenario.revision.features.join(" · ")}</span></p>
              <details><summary>Beispielantwort zum Vergleichen</summary><p lang="ja">{scenario.revision.reference}</p></details>
            </div>
            <label htmlFor="p25-revised">Überarbeitete Fassung (Japanisch)</label>
            <textarea id="p25-revised" lang="ja" rows={4} value={revised} onChange={e=>{
              setRevised(e.target.value);setStage("revise");setObservations(null);setPracticeSaved(false);
            }}/>
            {mode==="speaking"?<button type="button" onClick={()=>beginSpeech("revised")}>Überarbeitete Fassung diktieren</button>:null}
            <div className="p25-studio__actions">
              <button type="button" disabled={!revised.trim()} onClick={compare}>Änderungen vergleichen</button>
            </div>
          </>:null}
          {stage==="compare"&&observations?<div className="p25-studio__response" role="status">
            <h5>Überarbeitung beobachtet (keine Qualitätsnote)</h5>
            <p>{observations.beforeCount} → {observations.afterCount} Zeichen; Text verändert: {observations.newWriting?"ja":"nein"}</p>
            <p>Neu erkannte Zeichenfolgen: {observations.addedFeatures.length?observations.addedFeatures.join(", "):"keine"}</p>
            <p>Bereits erkannte Merkmale: {observations.afterFeatures.length?observations.afterFeatures.join(", "):"keine"}</p>
            <p className="p25-studio__disclaimer">Muster-Treffer beweisen keine korrekte Grammatik, Verständlichkeit oder Aussprache. Bewerte deinen Text kritisch anhand der Erklärung.</p>
            <button type="button" disabled={disabled||busy||practiceSaved} onClick={()=>void saveUngraded()}>Überarbeitung als unbewerteten Versuch speichern</button>
          </div>:null}
          {practiceSaved?<p role="status">Übung ohne Sprachbewertung gespeichert. Weder Text noch Audiodatei werden durch diese App gespeichert.</p>:null}
        </div>}
        {error?<p role="alert" className="p25-studio__error">{error}</p>:null}
      </div>
    </div>
    <p className="p25-studio__disclaimer">Die Fortschrittsempfehlung entsteht ausschließlich aus bestehenden accountgebundenen StudyEvents und FSRS-Daten. Fälligkeit bedeutet Termin gemäß Scheduler, nicht automatisch Beherrschung.</p>
  </section>;
}
