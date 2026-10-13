import {useEffect,useRef,useState} from "react";
import {p50AuthoredComparison,type P50Mission} from "../study/integrated50";

type P50Kind="comprehension"|"vocabulary"|"writing"|"return";
/** Local-only guided workspace. Sound is optional device synthesis, never publisher audio. */
export function P50IntegratedStudio({missions,preferredId,disabled,onPractice,onWriting}:{
 missions:readonly P50Mission[];preferredId?:string;disabled:boolean;
 onPractice:(id:string,kind:P50Kind)=>void;onWriting:(id:string)=>void;
}){
 const [selected,setSelected]=useState("");
 const [level,setLevel]=useState<"all"|"A1"|"A2">("all");
 const [query,setQuery]=useState("");
 const [speed,setSpeed]=useState(.85);
 const [playing,setPlaying]=useState(false);
 const [paused,setPaused]=useState(false);
 const [audioNotice,setAudioNotice]=useState("");
 const [showScript,setShowScript]=useState(false);
 const [showTranslations,setShowTranslations]=useState(false);
 const [showNotes,setShowNotes]=useState(false);
 const [questionIndex,setQuestionIndex]=useState(0);
 const [answer,setAnswer]=useState("");
 const [compared,setCompared]=useState(false);
 const [revealEvidence,setRevealEvidence]=useState(false);
 const [activeLine,setActiveLine]=useState<number|null>(null);
 const playGeneration=useRef(0);
 const item=missions.find(m=>m.id===selected)??missions.find(m=>m.id===preferredId)??missions[0];
 const stop=()=>{
  playGeneration.current++;
  if(typeof window!=="undefined"&&"speechSynthesis" in window)
   window.speechSynthesis.cancel();
  setPlaying(false);setPaused(false);
 };
 useEffect(()=>()=>{playGeneration.current++;
  if(typeof window!=="undefined"&&"speechSynthesis" in window)
   window.speechSynthesis.cancel();
 },[]);
 useEffect(()=>{
  playGeneration.current++;
  if(typeof window!=="undefined"&&"speechSynthesis" in window)
   window.speechSynthesis.cancel();
  setPlaying(false);setPaused(false);
 },[item?.id]);
 if(!item)return null;
 const filtered=missions.filter(m=>(level==="all"||m.level===level)&&
  (!query.trim()||[m.title,m.genre,m.situation,m.goal]
     .join(" ").toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())));
 const q=item.questions[questionIndex];
 const checked=q&&compared?p50AuthoredComparison(answer,[q.model,q.alternative],
  q.misconception,q.feedback):null;
 const resetQuestion=()=>{setAnswer("");setCompared(false);setRevealEvidence(false)};
 const choose=(id:string)=>{
  stop();setSelected(id);setShowScript(false);setShowTranslations(false);
  setShowNotes(false);setQuestionIndex(0);resetQuestion();
  setActiveLine(null);setAudioNotice("");
 };
 const speak=(start:number,oneLine:boolean)=>{
  if(typeof window==="undefined"||!("speechSynthesis" in window)||
     typeof SpeechSynthesisUtterance==="undefined"){
   setAudioNotice("Keine japanische Geräte-TTS verfügbar. Öffne das Originaltranskript.");
   setPlaying(false);return;
  }
  stop();setAudioNotice("");
  const synth=window.speechSynthesis;
  const japanese=synth.getVoices().find(v=>v.lang.toLowerCase().startsWith("ja"));
  if(!japanese)setAudioNotice("Keine japanische Stimme gefunden. Die Geräte-Aussprache kann ungenau sein.");
  const token=playGeneration.current;
  const next=(index:number)=>{
   if(token!==playGeneration.current)return;
   if(index>=item.listening.length||(oneLine&&index>start)){
    setPlaying(false);setPaused(false);return;
   }
   const line=item.listening[index]!;
   const utter=new SpeechSynthesisUtterance(line.japanese);
   utter.lang="ja-JP";utter.rate=speed;
   if(japanese)utter.voice=japanese;
   utter.onend=()=>{if(token!==playGeneration.current)return;
    if(oneLine){setActiveLine(index);setPlaying(false);setPaused(false)}
    else next(index+1);
   };
   utter.onerror=()=>{if(token===playGeneration.current){
     setPlaying(false);setPaused(false);
     setAudioNotice("Geräte-TTS konnte nicht abspielen. Japanischer Text verfügbar.");
   }};
   synth.speak(utter);
  };
  setPlaying(true);setPaused(false);next(start);
 };
 const pause=()=>{
  if(typeof window==="undefined"||!("speechSynthesis" in window))return;
  if(paused){window.speechSynthesis.resume();setPaused(false)}
  else {window.speechSynthesis.pause();setPaused(true)}
 };
 return <section className="p27-journey__p50" aria-label="Lesen und Hören in japanischen Alltagssituationen">
  <h4>Lesen, hören, entscheiden und antworten</h4>
  <p>20 eigens verfasste A1–A2 Missionen. Ein schriftliches Dokument und ein
    späteres japanisches Gespräch oder eine Ansage enthalten Informationen,
    die du gemeinsam verstehen musst. Der Ton ist <strong>optionale Geräte-TTS</strong>,
    keine Aufnahme japanischer Muttersprachler.</p>
  <div className="p27-journey__p50-filters">
   <label htmlFor="p50-level">Niveau</label>
   <select id="p50-level" value={level} onChange={e=>setLevel(e.target.value as "all"|"A1"|"A2")}>
    <option value="all">A1 und A2</option><option value="A1">A1</option><option value="A2">A2</option>
   </select>
   <label htmlFor="p50-search">Mission suchen</label>
   <input id="p50-search" type="search" value={query} onChange={e=>setQuery(e.target.value)}
    placeholder="Ort, Problem oder Kommunikationsziel"/>
  </div>
  <div className="p27-journey__p50-layout">
   <nav className="p27-journey__p50-catalog" aria-label="Integrierte Lernmissionen">
    <p>{filtered.length} von {missions.length} Missionen</p>
    {filtered.map(m=><button type="button" key={m.id}
     aria-current={m.id===item.id?"page":undefined} onClick={()=>choose(m.id)}>
      <strong>{missions.indexOf(m)+1}. {m.title}</strong>
      <small>{m.level} · {m.genre}{m.id===preferredId?" · Lernfokus":""}</small>
    </button>)}
    {!filtered.length?<p>Keine passende Mission.</p>:null}
   </nav>
   <article className="p27-journey__p50-workspace">
    <header>
     <small>{item.level} · {item.genre}</small>
     <h5>{item.title}</h5>
     <p><strong>Situation:</strong> {item.situation}</p>
     <p><strong>Kommunikationsziel:</strong> {item.goal}</p>
    </header>
    <section className="p27-journey__p50-reading" aria-label="Japanisches Originaldokument">
     <h5>1 · Zuerst lesen: {item.readLabel}</h5>
     <small>{item.readGenre}</small>
     <div lang="ja" className="p27-journey__p50-document">
      {item.reading.map((part,i)=><p key={i}>{part}</p>)}
     </div>
    </section>
    <section className="p27-journey__p50-listening" aria-label="Optionale gesprochene Information">
     <h5>2 · Dann hören: {item.spokenContext}</h5>
     <p>Höre ohne Transkript und prüfe, welche schriftliche Angabe
      aktualisiert, bestätigt oder ausdrücklich offen gelassen wird.</p>
     <strong>Japanische Sprachsynthese deines Geräts – keine echte Aufnahme</strong>
     <label htmlFor="p50-rate">Sprechgeschwindigkeit</label>
     <select id="p50-rate" value={speed} onChange={e=>setSpeed(Number(e.target.value))}>
      <option value={.7}>0,7 ×</option><option value={.85}>0,85 ×</option>
      <option value={1}>1,0 ×</option>
     </select>
     <div className="p27-journey__actions">
      <button type="button" onClick={()=>speak(0,false)}>Ganzes Gespräch abspielen / wiederholen</button>
      <button type="button" disabled={!playing} onClick={pause}>
       {paused?"Wiedergabe fortsetzen":"Pause"}
      </button>
      <button type="button" disabled={!playing&&!paused} onClick={stop}>Stoppen</button>
     </div>
     {audioNotice?<p role="status">{audioNotice}</p>:null}
     {playing?<p role="status">{paused?"Geräte-TTS pausiert":"Geräte-TTS läuft"}</p>:null}
     <div className="p27-journey__p50-sentences" role="group" aria-label="Einzelsätze hören">
      {item.listening.map((l,i)=><div key={i}>
       <button type="button" onClick={()=>speak(i,true)}>Satz {i+1} · {l.speaker} anhören</button>
       {activeLine===i?<small role="status">Diesen Satz jetzt selbst nachsprechen;
        keine Aufnahme und keine Aussprachewertung.</small>:null}
      </div>)}
     </div>
     <button type="button" aria-expanded={showScript}
      onClick={()=>setShowScript(v=>!v)}>
      {showScript?"Japanisches Transkript ausblenden":"Japanisches Transkript erst nach dem Hören zeigen"}
     </button>
     {showScript?<div className="p27-journey__p50-transcript">
      {item.listening.map((line,i)=><div key={i}>
       <strong>{line.speaker}</strong>
       <p lang="ja">{line.japanese}</p>
       {showTranslations?<p>{line.german}</p>:null}
      </div>)}
      <button type="button" onClick={()=>setShowTranslations(v=>!v)}>
       {showTranslations?"Deutsche Hilfe ausblenden":"Deutsche Zeilenhilfe anzeigen"}
      </button>
     </div>:null}
    </section>
    <section className="p27-journey__p50-understand">
     <h5>3 · Informationen aus beiden Quellen verbinden</h5>
     <div className="p27-journey__p50-question-nav" role="group" aria-label="Drei Verständnisfragen">
      {item.questions.map((question,i)=><button type="button" key={question.id}
       aria-pressed={questionIndex===i} onClick={()=>{setQuestionIndex(i);resetQuestion()}}>
       {i+1}. {question.reason==="detail"?"Fakt erkennen":
        question.reason==="correction"?"Änderung prüfen":"Bedeutung erschließen"}
      </button>)}
     </div>
     {q?<div>
      <p><strong>Frage {questionIndex+1}:</strong> {q.question}</p>
      <label htmlFor="p50-answer">Japanische Antwort ohne vorgegebene Auswahl</label>
      <textarea id="p50-answer" rows={3} lang="ja" value={answer}
       onChange={e=>{setAnswer(e.target.value);setCompared(false);setRevealEvidence(false)}}/>
      <div className="p27-journey__actions">
       <button type="button" disabled={!answer.trim()} onClick={()=>setCompared(true)}>
        Antwort mit verfassten Mustern vergleichen
       </button>
       <button type="button" disabled={disabled}
        onClick={()=>onPractice(item.id,"comprehension")}>
        Textgestützte Fragen im StudyPlayer üben
       </button>
      </div>
      {checked?<div role="status" className="p27-journey__p50-feedback">
       <strong>{checked.kind==="example"?"Entspricht einer Modellform":
        checked.kind==="misconception"?"Typischer Informationsfehler":
        "Andere japanische Form – keine semantische Bewertung"}</strong>
       <p>{checked.message}</p>
       <p>{q.feedback}</p>
       <button type="button" aria-expanded={revealEvidence}
        onClick={()=>setRevealEvidence(v=>!v)}>
        {revealEvidence?"Quellenbelege verbergen":"Originalbelege und Muster nach dem Versuch zeigen"}
       </button>
       {revealEvidence?<div>
        <ul>{q.evidence.map((e,i)=><li key={i}>
         <strong>{e.modality==="reading"?"Gelesen":"Gesprochen"}</strong>
         <span lang="ja"> 「{e.excerpt}」</span> · {e.purpose}
        </li>)}</ul>
        <p><strong>Japanisches Muster:</strong> <span lang="ja">{q.model}</span></p>
        <p><strong>Alternative:</strong> <span lang="ja">{q.alternative}</span></p>
       </div>:null}
       {questionIndex<item.questions.length-1?<button type="button"
        onClick={()=>{setQuestionIndex(i=>i+1);resetQuestion()}}>
        Nächste Frage
       </button>:null}
      </div>:null}
     </div>:null}
    </section>
    <section className="p27-journey__p50-output">
     <h5>4 · Selbstständig schriftlich reagieren</h5>
     <p>{item.writing.instruction}</p>
     <div className="p27-journey__actions">
      <button type="button" onClick={()=>onWriting(item.id)}>Im bestehenden Schreiben-Editor</button>
      <button type="button" disabled={disabled}
       onClick={()=>onPractice(item.id,"writing")}>Unabhängig im StudyPlayer schreiben</button>
     </div>
     <button type="button" aria-expanded={showNotes} onClick={()=>setShowNotes(v=>!v)}>
      {showNotes?"Strategie und Wortschatz verbergen":"Strategie und Kontextvokabeln anzeigen"}
     </button>
     {showNotes?<div>
      <p>{item.pedagogy}</p>
      <dl>{item.vocabulary.map((w,i)=><div key={i}>
       <dt lang="ja">{w.form}（{w.reading}）</dt>
       <dd>{w.meaning} · <span lang="ja">{w.source}</span></dd>
      </div>)}</dl>
      <button type="button" disabled={disabled}
       onClick={()=>onPractice(item.id,"vocabulary")}>Wörter kontextuell abrufen</button>
     </div>:null}
    </section>
    <section className="p27-journey__p50-return">
     <h5>5 · Später unbekannte Fakten übertragen</h5>
     <p>Eigene Antwort auf veränderte Daten, ohne alte Vorlagen.
      Eine FSRS-Fälligkeit entsteht ausschließlich durch den bestehenden Scheduler.</p>
     <button type="button" disabled={disabled}
      onClick={()=>onPractice(item.id,"return")}>Neuen Kontext freiwillig abrufen</button>
    </section>
    <small>Die hiesige Hör-, Lese- und Musteroberfläche bewertet keine Leistung,
     zeichnet nichts auf und speichert keine neue Lernhistorie. Der ursprüngliche
     StudyPlayer zeigt vollständige schriftliche Transkripte und ist daher kein
     Audio-only-Test. Gerätetöne können falsche Aussprache haben.</small>
   </article>
  </div>
 </section>;
}
