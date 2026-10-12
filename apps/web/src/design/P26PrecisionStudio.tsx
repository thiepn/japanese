import {useEffect,useRef,useState} from "react";
import {listMemoryTraces,listStudyEvents,saveStudyEvent} from "@thiepn/local-db";
import type {StudyEvent} from "@thiepn/domain";
import {DEVELOPMENT_DEVICE_ID,getDevelopmentAccountId,recordStudyAnswer} from "../study/runtime";
import {
  inspectP26Reply,missionTurnPrompt,normalizeP26,p26Grammar,p26Missions,
  p26Recommendations,type P26Feedback,type P26Mission,type P26Mode,type P26Recommendation
} from "../study/pedagogy26";
import "./p26-precision-studio.css";

type Pane="conversation"|"compose"|"precision";
interface SpeechCapture{
  lang:string;continuous:boolean;interimResults:boolean;
  onresult:((event:{results:ArrayLike<ArrayLike<{transcript:string}>>})=>void)|null;
  onerror:(()=>void)|null;onend:(()=>void)|null;
  start():void;stop():void;
}
const missions=p26Missions;
const writingTasks:Record<string,{task:string;hints:string[];model:string}>={
  "station-to-campus":{
    task:"Schreibe eine kurze Nachricht an eine Freundin: Du kommst mit dem Bus zur Universität und musst nach einer Uhrzeit fragen.",
    hints:["Fahrtziel mit に","Verkehrsmittel mit で","Frage mit 何時に"],
    model:"バスで大学に行きます。バスは何時に出ますか。"
  },
  "library-project":{
    task:"Bitte am Bibliotheksschalter um eine Ausleihe und schlage einer Freundin anschließend einen Lerntermin vor.",
    hints:["Wunsch mit たい","Erlaubnis mit てもいいですか","Einladung mit ませんか"],
    model:"この本を借りてもいいですか。金曜日に一緒に勉強しませんか。"
  },
  "cafe-conversation":{
    task:"Formuliere eine höfliche Bestellung und korrigiere die Menge, nachdem das Personal sie falsch verstanden hat.",
    hints:["Bitte mit をください","Menge mit 一つ oder 二つ","Korrektur mit いいえ oder すみません"],
    model:"コーヒーを一つください。すみません、二つじゃなくて一つです。"
  },
  "weekend-switch":{
    task:"Lehne eine Einladung mit Grund höflich ab, nenne eine Alternative und erzähle, was du letztes Wochenende gemacht hast.",
    hints:["Einladung mit ませんか","Grund mit から","Vergangenheit mit ました"],
    model:"すみません、土曜日は予定があるから、日曜日はどうですか。先週末は映画を見ました。"
  }
};
type DraftReport={
  length:number;features:{label:string;found:boolean}[];changed:boolean;
};
function compareDraft(text:string,rewrite:string,clues:readonly string[]):DraftReport{
  const normalized=normalizeP26(rewrite);
  return {
    length:[...normalized].length,
    features:clues.map(label=>{
      const simple=label.match(/[ぁ-んァ-ヶ一-龯]+/gu)?.at(-1)??"";
      return {label,found:Boolean(simple&&normalized.includes(simple))};
    }),
    changed:normalizeP26(text)!==normalized
  };
}
export function P26PrecisionStudio({
  disabled,onStart
}:{disabled:boolean;onStart:(id:string,mode:P26Mode)=>void}){
  const owner=getDevelopmentAccountId();
  const ownerRef=useRef(owner);ownerRef.current=owner;
  const [missionId,setMissionId]=useState(missions[0]!.id);
  const [rows,setRows]=useState<P26Recommendation[]>([]);
  const [historyLoading,setHistoryLoading]=useState(true);
  const [historyError,setHistoryError]=useState("");
  const [historyRevision,setHistoryRevision]=useState(0);
  const [pane,setPane]=useState<Pane>("conversation");
  const [turn,setTurn]=useState(0);
  const [draft,setDraft]=useState("");
  const [feedback,setFeedback]=useState<P26Feedback|null>(null);
  const [recorded,setRecorded]=useState(false);
  const [modelRevealed,setModelRevealed]=useState(false);
  const [recognitionUsed,setRecognitionUsed]=useState(false);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [showGerman,setShowGerman]=useState(false);
  const [speechStatus,setSpeechStatus]=useState("");
  const [revisionDraft,setRevisionDraft]=useState("");
  const [revisionText,setRevisionText]=useState("");
  const [draftReport,setDraftReport]=useState<DraftReport|null>(null);
  const [practiceSaved,setPracticeSaved]=useState(false);
  const [composeStep,setComposeStep]=useState<"write"|"revise"|"compare">("write");
  const started=useRef(0);
  const recognizer=useRef<SpeechCapture|null>(null);
  const mission=missions.find(m=>m.id===missionId)??missions[0]!;
  const task=writingTasks[missionId]!;
  const active=mission.turns[turn];
  const recommended=rows[0];
  const groups=p26Grammar.filter(group=>group.mission===missionId);
  const stats=rows.find(r=>r.missionId===missionId);
  useEffect(()=>{
    let mounted=true;setHistoryLoading(true);setRows([]);setHistoryError("");
    void Promise.all([listStudyEvents(owner),listMemoryTraces(owner)])
      .then(([events,traces])=>{
        if(mounted&&ownerRef.current===owner)
          setRows(p26Recommendations(traces.filter(t=>t.userId===owner),events.filter(e=>e.userId===owner)));
      }).catch(()=>{if(mounted)setHistoryError("Lernverlauf konnte nicht geladen werden. Übungen bleiben verfügbar.");})
      .finally(()=>{if(mounted)setHistoryLoading(false);});
    return()=>{mounted=false;};
  },[owner,historyRevision]);
  useEffect(()=>{
    recognizer.current?.stop();
    recognizer.current=null;
    setPane("conversation");setTurn(0);setDraft("");setFeedback(null);setRecorded(false);
    setModelRevealed(false);setRecognitionUsed(false);
    setBusy(false);setError("");setSpeechStatus("");setRevisionDraft("");setRevisionText("");
    setDraftReport(null);setPracticeSaved(false);setComposeStep("write");
    started.current=performance.now();
  },[missionId,owner]);
  useEffect(()=>()=>recognizer.current?.stop(),[]);
  function resetConversation(){
    setTurn(0);setDraft("");setFeedback(null);setRecorded(false);
    setModelRevealed(false);setRecognitionUsed(false);
    setError("");started.current=performance.now();
  }
  async function submitReply(){
    if(!active||!draft.trim()||busy||feedback||disabled)return;
    const account=ownerRef.current;
    if(getDevelopmentAccountId()!==account)return;
    const candidate=inspectP26Reply(mission,turn,draft);
    const eligible=candidate.matched&&!modelRevealed&&!recognitionUsed;
    setError("");setBusy(true);
    try{
      if(eligible){
        const prompt=missionTurnPrompt(mission,turn);
        await recordStudyAnswer({
          prompt,response:normalizeP26(draft),result:"correct",
          responseTimeMs:Math.max(0,Math.round(performance.now()-started.current))
        });
      }
      if(ownerRef.current!==account)return;
      setFeedback(candidate);setRecorded(eligible);
      if(eligible)setHistoryRevision(n=>n+1);
    }catch{
      if(ownerRef.current===account)setError("Deine Antwort konnte nicht gespeichert werden. Erneut versuchen.");
    }finally{if(ownerRef.current===account)setBusy(false);}
  }
  async function ungradedEvent(kind:"reply"|"draft"){
    const account=ownerRef.current;
    if(getDevelopmentAccountId()!==account)throw new Error("WORKSPACE_CHANGED");
    const event:StudyEvent={
      id:crypto.randomUUID(),userId:account,deviceId:DEVELOPMENT_DEVICE_ID,
      occurredAt:new Date().toISOString(),activity:"writing",
      primaryTarget:{kind:"production_task",id:"p26:"+missionId+":"+kind},
      skillDimension:"production",promptFamily:"p26-original-free-production",
      responseMode:"typed",result:"skipped",attempts:1,
      contextId:"p26:free:"+missionId,sourceId:"thiepn-original",contentVersion:"p26-1",
      metadata:{
        p26:true,missionId,kind,ungraded:true,schedulerExcluded:true,
        rawTextStored:false,turnIndex:kind==="reply"?turn:undefined,
        responseLength:kind==="reply"?[...normalizeP26(draft)].length:
          [...normalizeP26(revisionText)].length,
        revised:kind==="draft"?draftReport?.changed:undefined
      }
    };
    await saveStudyEvent(event);
  }
  async function advance(){
    if(!feedback||busy||disabled)return;
    if(!recorded){
      const account=ownerRef.current;setBusy(true);setError("");
      try{
        await ungradedEvent("reply");
        if(ownerRef.current!==account)return;
      }catch{
        if(ownerRef.current===account)setError("Unbewerteter Versuch konnte nicht gespeichert werden.");
        return;
      }finally{if(ownerRef.current===account)setBusy(false);}
    }
    setTurn(current=>current+1);setFeedback(null);setRecorded(false);setDraft("");
    setModelRevealed(false);setRecognitionUsed(false);
    setHistoryRevision(x=>x+1);started.current=performance.now();
  }
  async function saveComposition(){
    if(busy||!draftReport||practiceSaved||disabled)return;
    const account=ownerRef.current;setBusy(true);setError("");
    try{
      await ungradedEvent("draft");
      if(ownerRef.current!==account)return;
      setPracticeSaved(true);setHistoryRevision(x=>x+1);
    }catch{
      if(ownerRef.current===account)setError("Der unbewertete Übungsversuch konnte nicht gespeichert werden.");
    }finally{if(ownerRef.current===account)setBusy(false);}
  }
  function beginSpeech(target:"dialogue"|"composition"|"revision"){
    const browser=window as typeof window&{
      SpeechRecognition?:new()=>SpeechCapture;webkitSpeechRecognition?:new()=>SpeechCapture;
    };
    const Recognition=browser.SpeechRecognition??browser.webkitSpeechRecognition;
    if(!Recognition){setSpeechStatus("Spracherkennung nicht verfügbar. Antwort eintippen.");return;}
    recognizer.current?.stop();
    const speech=new Recognition();
    recognizer.current=speech;speech.lang="ja-JP";
    speech.continuous=false;speech.interimResults=false;
    speech.onresult=e=>{
      const transcript=e.results[0]?.[0]?.transcript?.trim()??"";
      if(!transcript)return;
      if(target==="dialogue"){setDraft(transcript);setFeedback(null);setRecognitionUsed(true);}
      else if(target==="composition"){setRevisionDraft(transcript);setComposeStep("write");}
      else{setRevisionText(transcript);setComposeStep("revise");setDraftReport(null);}
    };
    speech.onerror=()=>setSpeechStatus("Erkennung fehlgeschlagen. Text eingeben.");
    speech.onend=()=>setSpeechStatus("Erkennung beendet. Transkript prüfen.");
    try{speech.start();setSpeechStatus("Spracheingabe aktiv …");}
    catch{setSpeechStatus("Mikrofon nicht verfügbar. Text eingeben.");}
  }
  function hear(japanese:string){
    if(!("speechSynthesis" in window))return;
    window.speechSynthesis.cancel();
    const voice=new SpeechSynthesisUtterance(japanese);
    voice.lang="ja-JP";voice.rate=.86;window.speechSynthesis.speak(voice);
  }
  return <section className="p26-studio" aria-labelledby="p26-title">
    <header>
      <p className="j4-kicker">P26 · PRAXISWERKSTATT</p>
      <h2 id="p26-title">Selbst antworten · Grammatik präzisieren</h2>
      <p>Vier mehrstufige A1–A2-Missionen. Antworte selbst auf Japanisch, überarbeite freie Sätze
        und übe Grammatik und Wörter im vertrauten StudyPlayer.</p>
    </header>
    <div className="p26-studio__recommendation">
      <div><strong>Empfohlener nächster Schritt</strong>
        <p>{historyLoading?"Lernstand wird geladen":recommended?
          (missions.find(m=>m.id===recommended.missionId)?.title??recommended.missionId)+" · "+recommended.reason:"Noch keine Historie"}</p>
      </div>
      <button type="button" disabled={disabled||historyLoading||!recommended}
        onClick={()=>{if(recommended){setMissionId(recommended.missionId);onStart(recommended.missionId,recommended.due||recommended.incorrect?"repair":"course");}}}>
        Empfohlene Übung öffnen
      </button>
    </div>
    {historyError?<p role="status">{historyError}</p>:null}
    <div className="p26-studio__layout">
      <nav aria-label="Kommunikationsmissionen" className="p26-studio__missions">
        {missions.map(m=>{
          const item=rows.find(x=>x.missionId===m.id);
          return <button key={m.id} type="button" aria-pressed={mission.id===m.id} onClick={()=>setMissionId(m.id)}>
            <small>{m.level} · {item?.due??0} fällig</small>
            <strong>{m.title}</strong><small>{item?.reason??"Noch nicht begonnen"}</small>
          </button>;
        })}
      </nav>
      <div className="p26-studio__body">
        <h3>{mission.title}</h3><p><strong>Du kannst danach:</strong> {mission.objective}</p>
        <div className="p26-studio__situation"><strong>Situation</strong><p>{mission.situation}</p></div>
        <h4>Erklärung und Kontrast</h4><p>{mission.mental}</p>
        <div className="p26-studio__compare">
          <div><strong>Unterschied</strong><p>{mission.contrast}</p></div>
          <div><strong>Höflichkeit & Register</strong><p>{mission.register}</p></div>
        </div>
        <h4>Vier Wörter in Gebrauch</h4>
        <ul className="p26-studio__words">
          {mission.words.map(word=><li key={word.written}>
            <strong lang="ja">{word.written}</strong><span lang="ja">{word.reading}</span>
            <span>{word.meaning}</span><small lang="ja">{word.example}</small>
          </li>)}
        </ul>
        <div className="p26-studio__actions">
          <button type="button" disabled={disabled} onClick={()=>onStart(missionId,"course")}>Lernrunde (bis 20 Aufgaben)</button>
          <button type="button" disabled={disabled} onClick={()=>onStart(missionId,"transfer")}>Wörter im neuen Kontext</button>
          <button type="button" disabled={disabled} onClick={()=>onStart(missionId,"repair")}>Schwächen wiederholen {stats?.due?"("+stats.due+" fällig)":""}</button>
        </div>
        <div className="p26-studio__tabs" role="group" aria-label="Trainingsbereich">
          <button type="button" aria-pressed={pane==="conversation"} onClick={()=>setPane("conversation")}>Gespräch</button>
          <button type="button" aria-pressed={pane==="compose"} onClick={()=>setPane("compose")}>Eigene Sätze</button>
          <button type="button" aria-pressed={pane==="precision"} onClick={()=>setPane("precision")}>Grammatikpräzision</button>
        </div>
        {pane==="conversation"?<div className="p26-studio__workbench">
          <h4>Mehrstufiger Dialog · selbst formulieren</h4>
          {active?<div>
            <p className="p26-studio__step">Gespräch {turn+1} von {mission.turns.length}</p>
            <div className="p26-studio__partner"><strong>Gesprächspartner</strong>
              <p lang="ja">{active.partner}</p>
              {showGerman?<small>{active.meaning}</small>:null}
              <button type="button" onClick={()=>hear(active.partner)}>Gerätestimme anhören</button>
            </div>
            <label><input type="checkbox" checked={showGerman} onChange={e=>setShowGerman(e.target.checked)}/> Deutsche Übersetzung</label>
            <label htmlFor="p26-reply"><strong>Deine Antwort auf Japanisch</strong></label>
            <textarea id="p26-reply" lang="ja" rows={3} value={draft} disabled={Boolean(feedback)||busy}
              placeholder="日本語で答えてください…"
              onChange={e=>{setDraft(e.target.value);setRecognitionUsed(false);}}/>
            <div className="p26-studio__actions">
              <button type="button" disabled={busy||disabled||!draft.trim()||Boolean(feedback)} onClick={()=>void submitReply()}>Antwort prüfen</button>
              <button type="button" disabled={busy||Boolean(feedback)} onClick={()=>beginSpeech("dialogue")}>Japanisch diktieren</button>
              <button type="button" onClick={()=>{setModelRevealed(true);hear(active.accepted[0]!);}}>Musterhilfe anhören (danach unbewertet)</button>
            </div>
            {speechStatus?<p role="status">{speechStatus} Browsererkennung kann einen externen Spracherkennungsdienst nutzen.</p>:null}
            {feedback?<div className="p26-studio__feedback" role="status">
              <strong>{recorded?"Unabhängig geübte Zielform getroffen":feedback.matched?"Zielmuster erkannt – mit Hilfe oder Transkript, unbewertet":"Eigene Antwort – nicht automatisch bewertbar"}</strong>
              <p>{feedback.matched?(recorded?"Die Wortfolge stimmt mit einem hinterlegten Zielmuster überein und wurde als FSRS-Übung gespeichert.":"Das Zielmuster wurde erkannt, aber nach Musterhilfe oder mit Browsertranskript wird keine FSRS-Meisterschaft behauptet."):"Deine Antwort ist möglicherweise sinnvoll; der Vergleich mit den geübten Mustern ist keine freie Sprachbewertung."}</p>
              <p><strong>Muster:</strong> <span lang="ja">{feedback.model}</span> — {feedback.modelMeaning}</p>
              <p><strong>Grammatik:</strong> {feedback.contrast}</p>
              <ul>{feedback.notes.map(note=><li key={note}>{note}</li>)}</ul>
              {!feedback.matched?<button type="button" disabled={busy} onClick={()=>{setFeedback(null);started.current=performance.now();}}>Antwort überarbeiten</button>:null}
              <button type="button" disabled={busy||disabled} onClick={()=>void advance()}>
                {turn+1===mission.turns.length?"Gespräch abschließen":"Weiter zum nächsten Gesprächsschritt"}
              </button>
            </div>:null}
          </div>:<div role="status" className="p26-studio__feedback">
            <strong>Gespräch durchlaufen</strong><p>Fünf Gesprächsschritte bearbeitet. Nicht erkannte Formulierungen bleiben ausdrücklich unbewertet.</p>
            <button type="button" onClick={resetConversation}>Gespräch wiederholen</button>
          </div>}
        </div>:null}
        {pane==="compose"?<div className="p26-studio__workbench">
          <h4>Freie Sätze verfassen und überarbeiten</h4><p>{task.task}</p>
          <label htmlFor="p26-first">Erste Fassung (Japanisch)</label>
          <textarea id="p26-first" rows={4} lang="ja" value={revisionDraft} onChange={e=>{
            setRevisionDraft(e.target.value);setComposeStep("write");setDraftReport(null);setPracticeSaved(false);
          }}/>
          <button type="button" onClick={()=>beginSpeech("composition")}>Erste Fassung diktieren</button>
          <div className="p26-studio__actions"><button type="button" disabled={!revisionDraft.trim()} onClick={()=>{
            setRevisionText(revisionDraft);setComposeStep("revise");setDraftReport(null);setPracticeSaved(false);
          }}>Überarbeitung beginnen</button></div>
          {composeStep!=="write"?<>
            <div className="p26-studio__feedback"><strong>Überarbeitungshinweise</strong>
              <ul>{task.hints.map(hint=><li key={hint}>{hint}</li>)}</ul>
              <details><summary>Beispielsatz zum Vergleichen</summary><p lang="ja">{task.model}</p></details>
            </div>
            <label htmlFor="p26-revision">Deine überarbeitete Version</label>
            <textarea id="p26-revision" lang="ja" rows={4} value={revisionText} onChange={e=>{
              setRevisionText(e.target.value);setDraftReport(null);setComposeStep("revise");setPracticeSaved(false);
            }}/>
            <button type="button" onClick={()=>beginSpeech("revision")}>Überarbeitung diktieren</button>
            <div className="p26-studio__actions"><button type="button" disabled={!revisionText.trim()} onClick={()=>{
              setDraftReport(compareDraft(revisionDraft,revisionText,task.hints));setComposeStep("compare");setPracticeSaved(false);
            }}>Änderungen untersuchen</button></div>
          </>:null}
          {composeStep==="compare"&&draftReport?<div className="p26-studio__feedback" role="status">
            <strong>Strukturbeobachtung – keine Grammatiknote</strong>
            <p>{draftReport.length} Zeichen in der neuen Antwort · Änderung {draftReport.changed?"vorhanden":"nicht erkannt"}.</p>
            <ul>{draftReport.features.map(f=><li key={f.label}>{f.label} · {f.found?"Zeichenfolge gefunden":"nicht gefunden (keine Fehlerfeststellung)"}</li>)}</ul>
            <p>Ein Treffer ist kein semantischer, stilistischer oder Aussprachebeweis. Prüfe die Situation und vergleiche eigenständig mit dem Modell.</p>
            <button type="button" disabled={busy||disabled||practiceSaved} onClick={()=>void saveComposition()}>Unbewertete Übung protokollieren</button>
          </div>:null}
          {practiceSaved?<p role="status">Übungsereignis ohne rohe Texte, Audiodatei oder Meisterschaftsbewertung gespeichert.</p>:null}
        </div>:null}
        {pane==="precision"?<div className="p26-studio__workbench">
          <h4>Grammatik kontrastiv üben</h4>
          <p>Die Erklärungen verknüpfen Grammatik, echte Satzkontexte und kommunikative Absicht.</p>
          {groups.map(g=><article className="p26-studio__rule" key={g.id}>
            <h5>{g.label}</h5><p>{g.explanation}</p>
            <p lang="ja">{g.items[0]?.stem}</p>
          </article>)}
          <div className="p26-studio__actions">
            <button type="button" disabled={disabled} onClick={()=>onStart(missionId,"precision")}>Grammatikfragen im StudyPlayer</button>
            <button type="button" disabled={disabled} onClick={()=>onStart(missionId,"transfer")}>Verknüpfte Wörter aktiv abrufen</button>
          </div>
        </div>:null}
        {error?<p role="alert" className="p26-studio__error">{error}</p>:null}
      </div>
    </div>
    <p className="p26-studio__caveat">Nur unabhängige, selbst getippte Übereinstimmungen mit original erstellten Antwortmustern werden als reguläre FSRS-Lernnachweise gespeichert. Freie andere Sätze sind unbewertet. Spracheingabe ist optional, browserabhängig und keine Ausspracheprüfung.</p>
  </section>;
}
