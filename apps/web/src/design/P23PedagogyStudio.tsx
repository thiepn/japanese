import {useEffect,useState} from "react";
import {P24GuidedLab} from "./P24GuidedLab";
import {listMemoryTraces,listStudyEvents} from "@thiepn/local-db";
import {getDevelopmentAccountId} from "../study/runtime";
import {navigateA1} from "../communication/a1-navigation";
import {
  pedagogyScenarios,pedagogyProgress,recommendPedagogyScenario,
  type PedagogyMode,type PedagogyProgress
} from "../study/pedagogy23";
import "./p23-pedagogy.css";

type Props={onStart:(scenarioId:string,mode:PedagogyMode)=>void;onStartTransfer:(scenarioId:string,mode:"full"|"repair")=>void;disabled:boolean};
export function P23PedagogyStudio({onStart,onStartTransfer,disabled}:Props){
  const owner=getDevelopmentAccountId();
  const [selected,setSelected]=useState(pedagogyScenarios[0]!.id);
  const [progress,setProgress]=useState<PedagogyProgress[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  useEffect(()=>{
    let active=true;
    setLoading(true);setError("");setProgress([]);
    void Promise.all([listMemoryTraces(owner),listStudyEvents(owner)])
      .then(([traces,events])=>{
        if(!active||getDevelopmentAccountId()!==owner)return;
        setProgress(pedagogyProgress(traces.filter(t=>t.userId===owner),events.filter(e=>e.userId===owner)));
      }).catch(()=>{
        if(active)setError("Lernverlauf ist nicht verfügbar; die Übungen können trotzdem gestartet werden.");
      }).finally(()=>{if(active)setLoading(false);});
    return ()=>{active=false;};
  },[owner]);
  const scenario=pedagogyScenarios.find(s=>s.id===selected)??pedagogyScenarios[0]!;
  const current=progress.find(p=>p.scenarioId===scenario.id);
  const recommendation=progress.length?recommendPedagogyScenario(progress):pedagogyScenarios[0]!.id;
  const recommended=pedagogyScenarios.find(s=>s.id===recommendation)!;
  const dialogueScenario=scenario.id==="cafe"?"cafe":scenario.id==="places"?"station":scenario.id==="greetings"||scenario.id==="introduction"?"meeting":null;
  function hear(japanese:string){
    if(typeof window==="undefined"||!("speechSynthesis" in window))return;
    window.speechSynthesis.cancel();
    const utterance=new SpeechSynthesisUtterance(japanese);
    utterance.lang="ja-JP";utterance.rate=.85;
    window.speechSynthesis.speak(utterance);
  }
  return <section className="p23-studio" aria-labelledby="p23-studio-title">
    <header className="p23-studio__header">
      <p className="j4-kicker">ORIGINAL JAPANESE · KONTEKSTLABOR</p>
      <h2 id="p23-studio-title">Japanisch verstehen und anwenden</h2>
      <p>Erst die Situation, dann das sprachliche Muster, danach Abruf und Anwendung.
        Acht eigenständige A1–A2-Lernsequenzen; keine importierten Lehrbuchlektionen.</p>
    </header>
    <div className="p23-studio__recommendation" aria-live="polite">
      <div><strong>Empfohlener nächster Schritt</strong>
        <p>{loading?"Lernstand wird geladen":recommended.title}
          {!loading&&progress.find(p=>p.scenarioId===recommendation)?.due
            ?" · fällige Wiederholungen":""}
        </p>
      </div>
      <button type="button" disabled={disabled||loading} onClick={()=>{setSelected(recommendation);onStart(recommendation,"lesson");}}>Übung starten</button>
    </div>
    {error?<p role="alert">{error}</p>:null}
    <div className="p23-studio__layout">
      <nav className="p23-studio__navigation" aria-label="Kontextmodule">
        {pedagogyScenarios.map((item,index)=>{
          const state=progress.find(p=>p.scenarioId===item.id);
          return <button key={item.id} type="button" aria-current={scenario.id===item.id?"true":undefined}
            onClick={()=>setSelected(item.id)} className={scenario.id===item.id?"is-selected":""}>
            <span className="p23-studio__number">{String(index+1).padStart(2,"0")} · {item.level}</span>
            <strong>{item.title}</strong>
            <small>{state?.practicedPrompts??0}/{state?.totalPrompts??item.questions.length} Aufgaben erprobt{state?.due?" · "+state.due+" fällig":""}</small>
          </button>;
        })}
      </nav>
      <article className="p23-studio__lesson">
        <header>
          <small>{scenario.level} · Alltagssituation</small>
          <h3>{scenario.title}</h3>
          <p><strong>Das kannst du danach:</strong> {scenario.canDo}</p>
        </header>
        <div className="p23-studio__situation"><strong>Stell dir vor …</strong><p>{scenario.situation}</p></div>
        <h4>Das Muster verstehen</h4><p>{scenario.model}</p>
        <div className="p23-studio__comparison">
          <div><strong>Vergleiche</strong><p>{scenario.contrast}</p></div>
          <div><strong>Typischer Fehler</strong><p>{scenario.trap}</p></div>
        </div>
        <h4>Wörter im Zusammenhang</h4>
        <ul className="p23-studio__words">{scenario.words.map(word=><li key={word.written}>
          <strong lang="ja">{word.written}</strong><span lang="ja">{word.reading}</span>
          <span>{word.meaning}</span><small lang="ja">{word.example}</small>
        </li>)}</ul>
        <h4>Mini-Dialog</h4>
        <div className="p23-studio__dialogue">{scenario.dialogue.map((line,index)=><div key={index}>
          <strong>{line.speaker}</strong><p lang="ja">{line.japanese}</p><small>{line.german}</small>
          <button type="button" onClick={()=>hear(line.japanese)} aria-label={"Synthetisch abspielen: "+line.japanese}>Anhören</button>
        </div>)}</div>
        <p className="p23-studio__disclaimer">Aussprache über Gerätesynthese; keine bestätigte Muttersprachler-Aufnahme.</p>
        <div className="p23-studio__transfer">
          <strong>Selbst anwenden</strong><p>{scenario.transfer}</p>
          <small>Freie Sprechaufgabe zum eigenen Üben; ohne automatische Qualitätsbewertung.</small>
        </div>
        <div className="p23-studio__actions">
          <button className="j4-primary" disabled={disabled} type="button" onClick={()=>onStart(scenario.id,"lesson")}>Lernen + {scenario.questions.length} Aufgaben</button>
          <button disabled={disabled||loading||(current?.attempts??0)===0} type="button" onClick={()=>onStart(scenario.id,"repair")}>Gezielt wiederholen</button>
          {dialogueScenario?<button type="button" onClick={()=>navigateA1({destination:"roleplay",scenarioId:dialogueScenario})}>Verwandten Dialog üben</button>:null}
        </div>
        <p className="p23-studio__disclaimer">Geschlossene Aufgaben haben eindeutige Zielantworten. Richtige Antworten belegen keinen freien Gesprächserfolg; die FSRS-Wiederholungen nutzen den vorhandenen Lernstand.</p>
      </article>
      <P24GuidedLab key={scenario.id+":"+owner} scenarioId={scenario.id} onPractice={onStartTransfer} disabled={disabled}/>
    </div>
  </section>;
}
