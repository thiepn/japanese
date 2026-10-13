import {useEffect,useRef,useState} from "react";
import {p55AuthoredFeedback,p55Progression,p55RelatedWords,type P55Genre,type P55Scene,type P55PracticeKind} from "../study/listening55";
import "./p55-listening.css";
type Kind=Exclude<P55PracticeKind,"all">;
const genres:Record<P55Genre,string>={
 dialogue:"Dialog",announcement:"Durchsage", "voice-message":"Sprachnachricht",
 service:"Kundenkontakt",meeting:"Besprechung",interview:"Interview",
 instructions:"Anweisung",conversation:"Gespräch"
};
const labels={evidence:"Textdetail",speaker:"Sprecher",chronology:"Ablauf",cause:"Grund",inference:"Folgerung",intention:"Absicht"} as const;
const speeds=[0.7,0.85,1] as const;
/** Native P47-style device TTS, not native recorded audio or audio assessment. */
export function P55ListeningStudio({scenes,preferredId,recallReadyIds,disabled,onPractice,onWriting}:{
 scenes:readonly P55Scene[];preferredId?:string;recallReadyIds:readonly string[];
 disabled:boolean;onPractice:(id:string,kind:Kind)=>void;onWriting:(id:string)=>void;
}){
 const [id,setId]=useState("");
 const [genre,setGenre]=useState<P55Genre|"all">("all");
 const [query,setQuery]=useState("");
 const [listLimit,setListLimit]=useState(24);
 const [speed,setSpeed]=useState<number>(.85);
 const [playing,setPlaying]=useState(false);
 const [paused,setPaused]=useState(false);
 const [audioMessage,setAudioMessage]=useState("");
 const [currentTurn,setCurrentTurn]=useState<number|null>(null);
 const [scriptVisible,setScriptVisible]=useState(false);
 const [translationVisible,setTranslationVisible]=useState(false);
 const [wordsVisible,setWordsVisible]=useState(false);
 const [questionIndex,setQuestionIndex]=useState(0);
 const [draft,setDraft]=useState("");
 const [compared,setCompared]=useState(false);
 const [reveal,setReveal]=useState(false);
 const [responseVisible,setResponseVisible]=useState(false);
 const version=useRef(0);
 const current=scenes.find(s=>s.id===id)??scenes.find(s=>s.id===preferredId)??scenes[0];
 function stop(){
  version.current++;
  if(typeof window!=="undefined"&&"speechSynthesis" in window)
   window.speechSynthesis.cancel();
  setPlaying(false);setPaused(false);setCurrentTurn(null);
 }
 useEffect(()=>()=>{version.current++;
  if(typeof window!=="undefined"&&"speechSynthesis" in window)
   window.speechSynthesis.cancel();
 },[]);
 useEffect(()=>{
  version.current++;
  if(typeof window!=="undefined"&&"speechSynthesis" in window)
   window.speechSynthesis.cancel();
  setPlaying(false);setPaused(false);setCurrentTurn(null);
 },[current?.id]);
 if(!current)return null;
 const filtered=scenes.filter(s=>(genre==="all"||s.genre===genre)&&
  (!query.trim()||[s.title,s.setting,s.listeningGoal,s.contrast,...s.turns.map(t=>t.japanese)]
   .join(" ").toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())));
 const question=current.questions[questionIndex]??current.questions[0]!;
 const feedback=compared?p55AuthoredFeedback(draft,[question.model,question.alternative],
  question.misconception,question.why):null;
 const progress=p55Progression(current.id),words=p55RelatedWords(current);
 const attested=words.filter(w=>w.attested).length;
 const reset=()=>{
  setQuestionIndex(0);setDraft("");setCompared(false);setReveal(false);
  setScriptVisible(false);setTranslationVisible(false);setWordsVisible(false);
  setResponseVisible(false);setAudioMessage("");
 };
 const choose=(newId:string)=>{stop();setId(newId);reset();};
 const selectQuestion=(index:number)=>{
  setQuestionIndex(index);setDraft("");setCompared(false);setReveal(false);
 };
 const speak=(start:number,one:boolean)=>{
  if(typeof window==="undefined"||!("speechSynthesis" in window)||
    typeof SpeechSynthesisUtterance==="undefined"){
   setAudioMessage("Keine Geräte-Sprachausgabe verfügbar. Das japanische Skript kann weiterhin gelesen werden.");
   setPlaying(false);return;
  }
  stop();setAudioMessage("");
  const synth=window.speechSynthesis;
  const voices=synth.getVoices();
  const japanese=voices.find(v=>v.lang.toLowerCase().startsWith("ja"));
  if(!japanese)setAudioMessage("Keine japanische TTS-Stimme erkannt. Die Geräte-Aussprache ist möglicherweise ungenau.");
  const token=version.current;
  const playTurn=(index:number)=>{
   if(token!==version.current)return;
   if(index>=current.turns.length||(one&&index>start)){
    setPlaying(false);setPaused(false);setCurrentTurn(null);return;
   }
   setCurrentTurn(index);
   const message=new SpeechSynthesisUtterance(current.turns[index]!.japanese);
   message.lang="ja-JP";message.rate=speed;
   if(japanese)message.voice=japanese;
   message.onend=()=>{
    if(token!==version.current)return;
    if(one){setPlaying(false);setPaused(false);setCurrentTurn(null);}
    else playTurn(index+1);
   };
   message.onerror=()=>{
    if(token===version.current){
     setPlaying(false);setPaused(false);setCurrentTurn(null);
     setAudioMessage("Geräte-TTS wurde unterbrochen oder ist fehlgeschlagen. Wähle die letzte Zeile erneut oder lies das Skript.");
    }
   };
   synth.speak(message);
  };
  setPlaying(true);setPaused(false);playTurn(start);
 };
 const togglePause=()=>{
  if(typeof window==="undefined"||!("speechSynthesis" in window))return;
  if(paused){window.speechSynthesis.resume();setPaused(false);}
  else {window.speechSynthesis.pause();setPaused(true);}
 };
 return <section className="p55-listening" aria-label="A2 verbundene Hörsituationen">
  <h4>Japanisch hören · zusammenhängende A2-Situationen</h4>
  <p>35 Originaldialoge und Mitteilungen. Die optionale Aussprache erfolgt mit
   der <strong>japanischen Sprachausgabe deines Geräts (TTS)</strong> – nicht durch
   aufgenommene Muttersprachler. Höre zuerst ohne Transkript und prüfe dann
   die Aussagen und Sprecherrollen. Diese Oberfläche benotet kein Hörverstehen.</p>
  <div className="p55-listening__filters">
   <label htmlFor="p55-genre">Gesprächsart</label>
   <select id="p55-genre" value={genre} onChange={e=>{
    setGenre(e.target.value as P55Genre|"all");setListLimit(24);
   }}>
    <option value="all">Alle Arten</option>
    {([...new Set(scenes.map(s=>s.genre))] as P55Genre[]).map(g=>
      <option value={g} key={g}>{genres[g]}</option>)}
   </select>
   <label htmlFor="p55-search">Inhalte und japanische Wörter suchen</label>
   <input id="p55-search" type="search" value={query}
    onChange={e=>{setQuery(e.target.value);setListLimit(24)}}
    placeholder="z. B. 変更, 予約, 発表"/>
  </div>
  <div className="p55-listening__layout">
   <nav className="p55-listening__catalog" aria-label="P55 Originalhörszenen">
    <p>{filtered.length} von {scenes.length} Situationen</p>
    {filtered.slice(0,listLimit).map(s=><button type="button" key={s.id}
     aria-current={s.id===current.id?"page":undefined} onClick={()=>choose(s.id)}>
     <strong lang="ja">{scenes.indexOf(s)+1}. {s.title}</strong>
     <small>{genres[s.genre]} · {s.turns.length} Sprechzüge</small>
    </button>)}
    {filtered.length>listLimit?<button type="button" onClick={()=>setListLimit(n=>n+24)}>
     Weitere Gespräche anzeigen
    </button>:null}
    {!filtered.length?<p>Keine passende Situation gefunden.</p>:null}
   </nav>
   <article className="p55-listening__workspace">
    <header>
     <small>A2 · Lernstufe {progress.stage}/4 · {genres[current.genre]}</small>
     <h5 lang="ja">{current.title}</h5>
     <p><strong>Situation:</strong> {current.setting}</p>
     <p><strong>Hörziel:</strong> {current.listeningGoal}</p>
     <p><strong>Progression:</strong> {progress.focus}</p>
     <details><summary>Vor dem Hören: worauf achten?</summary><p>{current.prediction}</p></details>
    </header>
    <section>
     <h5>1 · Zuerst hören, dann Sprecherwechsel prüfen</h5>
     <p>Stimmenwahl und Pausen können je nach Gerät unnatürlich sein.
      Eine einzelne Geräte-TTS-Stimme kann mehrere Gesprächspartner sprechen;
      sie beweist keine echte Sprecherunterscheidung.</p>
     <label htmlFor="p55-speed">TTS-Sprechtempo</label>
     <select id="p55-speed" value={speed} onChange={e=>setSpeed(Number(e.target.value))}>
      {speeds.map(x=><option key={x} value={x}>{x===1?"Normal":x+" ×"}</option>)}
     </select>
     <div className="p55-listening__actions">
      <button type="button" onClick={()=>speak(0,false)}>Ganzes Gespräch hören / wiederholen</button>
      <button type="button" disabled={!playing} onClick={togglePause}>{paused?"Weiter":"Pause"}</button>
      <button type="button" disabled={!playing&&!paused} onClick={stop}>Stopp</button>
     </div>
     {audioMessage?<p role="status">{audioMessage}</p>:null}
     {playing?<p role="status">{paused?"Geräte-TTS pausiert":
      "Geräte-TTS aktiv · Sprechzug "+((currentTurn??0)+1)+" von "+current.turns.length}</p>:null}
     <div className="p55-listening__turn-buttons" role="group" aria-label="Einzelne japanische Sprechzüge wiederholen">
      {current.turns.map((t,i)=><button key={i} type="button"
       aria-pressed={currentTurn===i&&playing}
       onClick={()=>speak(i,true)}>{i+1} · {t.role}</button>)}
     </div>
    </section>
    <section>
     <h5>2 · Text erst nach eigener Hörphase öffnen</h5>
     <button type="button" aria-expanded={scriptVisible}
      onClick={()=>setScriptVisible(x=>!x)}>{scriptVisible?"Skript wieder verbergen":
       "Japanisches Originaltranskript und Sprecher anzeigen"}</button>
     {scriptVisible?<div>
      <div className="p55-listening__transcript">
       {current.turns.map((t,i)=><div key={i}>
        <small>Sprechzug {i+1} · {t.role}</small>
        <p lang="ja">{t.japanese}</p>
        {translationVisible?<p lang="de">{t.german}</p>:null}
       </div>)}
      </div>
      <button type="button" aria-expanded={translationVisible}
       onClick={()=>setTranslationVisible(x=>!x)}>{translationVisible?
        "Deutsche Zeilenhilfe verbergen":"Deutsche Zeilenhilfe einblenden"}</button>
      <p><strong>Entscheidender Bedeutungskontrast:</strong> {current.contrast}</p>
     </div>:null}
    </section>
    <section>
     <h5>3 · Nachhören, erklären und ohne Modell antworten</h5>
     <div className="p55-listening__questions" role="group" aria-label="Verständnisfragen">
      {current.questions.map((q,i)=><button key={q.id} type="button"
       aria-pressed={questionIndex===i} onClick={()=>selectQuestion(i)}>
       {i+1} · {labels[q.kind]}</button>)}
     </div>
     <p lang="ja" className="p55-listening__question">{question.question}</p>
     <label htmlFor="p55-draft">Eigenständige vollständige japanische Antwort</label>
     <textarea id="p55-draft" rows={3} lang="ja" value={draft}
      onChange={e=>{setDraft(e.target.value);setCompared(false);setReveal(false)}}
      aria-keyshortcuts="Control+Enter Meta+Enter"
      onKeyDown={e=>{if(!e.nativeEvent.isComposing&&(e.ctrlKey||e.metaKey)&&e.key==="Enter"&&draft.trim()){
       e.preventDefault();setCompared(true);
      }}}/>
     <div className="p55-listening__actions">
      <button type="button" disabled={!draft.trim()} onClick={()=>setCompared(true)}>
       Nach eigenem Versuch mit Originalmodellen vergleichen
      </button>
      <button type="button" disabled={disabled} onClick={()=>onPractice(current.id,"comprehension")}>
       Textgestützte Nachhörfragen im StudyPlayer</button>
     </div>
     {feedback?<div className="p55-listening__feedback" role="status">
      <strong>{feedback.kind==="original"?"Originales Antwortmodell getroffen":
       feedback.kind==="specific-error"?"Bekannte Fehlinterpretation":"Keine automatische Sprachbewertung"}</strong>
      <p>{feedback.message}</p>
      <p>{question.why}</p>
      <button type="button" aria-expanded={reveal} onClick={()=>setReveal(x=>!x)}>
       {reveal?"Modelle und Beleg verbergen":"Japanische Modellantworten und Sprecherbeleg anzeigen"}
      </button>
      {reveal?<div><p lang="ja">{question.model}</p>
       <p lang="ja">{question.alternative}</p>
       <blockquote lang="ja">{question.evidence}</blockquote>
       <p><strong>Verwechslungsantwort:</strong> <span lang="ja">{question.misconception}</span></p>
      </div>:null}
     </div>:null}
    </section>
    <section>
     <h5>4 · P53-Wortwahl im gesprochenen Kontext</h5>
     <p>{words.length} thematische Originalverweise, davon {attested} wörtlich
      in diesen Sprechzügen belegt.</p>
     <button type="button" aria-expanded={wordsVisible}
      onClick={()=>setWordsVisible(x=>!x)}>{wordsVisible?"Wortfamilien ausblenden":"Kollokationen und Bedeutungsfamilien ansehen"}</button>
     {wordsVisible?<div className="p55-listening__words">
      {words.map(w=><div key={w.id}>
       <strong lang="ja">{w.written}（{w.reading}）</strong> · {w.meaning}
       <small>{w.attested?"Wörtlich im Gespräch":"Nur thematisch verknüpft"}</small>
       <p lang="ja">{w.collocations.join(" ／ ")}</p>
       <p>{w.nuance}</p>
       {w.families.slice(0,1).map(f=><p key={f.id}>{f.explanation}</p>)}
      </div>)}
     </div>:null}
     <button type="button" disabled={disabled||attested===0}
      onClick={()=>onPractice(current.id,"vocabulary")}>
      {attested} tatsächlich genannte P53-Ausdrücke abrufen
     </button>
    </section>
    <section>
     <h5>5 · Eigenständige gesprochene oder getippte Reaktion</h5>
     <button type="button" aria-expanded={responseVisible}
      onClick={()=>setResponseVisible(v=>!v)}>{responseVisible?"Neuen Auftrag verbergen":
        "Andere praktische Gesprächssituation zeigen"}</button>
     {responseVisible?<p>{current.response.situation}</p>:null}
     <p>Laut selbst sprechen und optional den ganzen Satz eingeben.
      Ohne gesonderte Aufnahme und Prüfung wird keine Aussprache- oder Sprechleistung bewertet.</p>
     <div className="p55-listening__actions">
      <button type="button" disabled={disabled} onClick={()=>onPractice(current.id,"response")}>
       Eigenständig im bestehenden StudyPlayer formulieren
      </button>
      <button type="button" onClick={()=>onWriting(current.id)}>
       Im bestehenden Learn-Schreibeditor überarbeiten
      </button>
     </div>
    </section>
    <section>
     <h5>6 · Späterer neuer Kontext</h5>
     <p>Der ungesehene Fall verändert Sprecher, Orte, Zeit oder Ziel und bleibt
      hier absichtlich verborgen. Freigabe setzt echte FSRS-Fälligkeit der
      ursprünglichen Frage oder 24 Stunden nach einer bewerteten Erstfrage
      voraus, behauptet aber selbst keine Fälligkeit.</p>
     <button type="button" disabled={disabled||!recallReadyIds.includes(current.id)}
      onClick={()=>onPractice(current.id,"return")}>Ungesehenen neuen Fall bearbeiten</button>
     {!recallReadyIds.includes(current.id)?<small>Erst ursprüngliche Verständnisfrage
      im StudyPlayer bearbeiten und Lernabstand abwarten.</small>:null}
    </section>
    <small>Erstveröffentlichte THIEPN-Texte. Marugoto dient nur als Referenz.
     Geräte-TTS ist keine Muttersprachleraufnahme; keine Aufzeichnung oder
     selbständige Bewertung im Studio.</small>
   </article>
  </div>
 </section>;
}
