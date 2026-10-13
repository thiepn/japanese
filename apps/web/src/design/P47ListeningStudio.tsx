import {useEffect,useRef,useState} from "react";
import type {P47Scene,P47Question} from "../study/listening47";
import {p47AuthoredFeedback} from "../study/listening47";

type P47Kind="comprehension"|"response"|"return";
const rates=[.7,.85,1] as const;
/**
 * Teach listening-first using the device's SpeechSynthesis voices, not native
 * recordings. No server audio, transcription service, extra stores or grades.
 */
export function P47ListeningStudio({scenes,preferredId,disabled,onPractice,onWriting}:{
 scenes:readonly P47Scene[];preferredId?:string;disabled:boolean;
 onPractice:(sceneId:string,kind:P47Kind)=>void;
 onWriting:(sceneId:string)=>void;
}){
 const [id,setId]=useState("");
 const [level,setLevel]=useState<"all"|"A1"|"A2">("all");
 const [search,setSearch]=useState("");
 const [rate,setRate]=useState<number>(.85);
 const [playing,setPlaying]=useState(false);
 const [paused,setPaused]=useState(false);
 const [error,setError]=useState("");
 const [shadow,setShadow]=useState<number|null>(null);
 const [transcript,setTranscript]=useState(false);
 const [translation,setTranslation]=useState(false);
 const [vocabulary,setVocabulary]=useState(false);
 const [questionIndex,setQuestionIndex]=useState(0);
 const [draft,setDraft]=useState("");
 const [compared,setCompared]=useState(false);
 const [showEvidence,setShowEvidence]=useState(false);
 const playToken=useRef(0);
 const current=scenes.find(s=>s.id===id)??scenes.find(s=>s.id===preferredId)??scenes[0];
 const stop=()=>{
  playToken.current+=1;
  if(typeof window!=="undefined"&&"speechSynthesis" in window)
   window.speechSynthesis.cancel();
  setPlaying(false);setPaused(false);
 };
 useEffect(()=>()=>{playToken.current+=1;
  if(typeof window!=="undefined"&&"speechSynthesis" in window)
   window.speechSynthesis.cancel();
 },[]);
 useEffect(()=>{
  playToken.current+=1;
  if(typeof window!=="undefined"&&"speechSynthesis" in window)
   window.speechSynthesis.cancel();
  setPlaying(false);setPaused(false);
 },[current?.id]);
 if(!current)return null;
 const filtered=scenes.filter(s=>(level==="all"||s.level===level)&&
   (!search.trim()||[s.title,s.genre,s.situation,s.listeningGoal]
     .join(" ").toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())));
 const question:P47Question|undefined=current.questions[questionIndex];
 const feedback=question&&compared?p47AuthoredFeedback(draft,
   [question.answer,question.alternative],question.misconception,question.feedback):null;
 const speak=(start:number,onlyOne:boolean)=>{
  if(typeof window==="undefined"||!("speechSynthesis" in window)||
     typeof SpeechSynthesisUtterance==="undefined"){
   setError("Auf diesem Gerät gibt es keine Sprachsynthese. Das japanische Transkript ist weiterhin lesbar.");
   setPlaying(false);return;
  }
  stop();setError("");
  const synth=window.speechSynthesis;
  const voices=synth.getVoices();
  const japanese=voices.find(v=>v.lang.toLowerCase().startsWith("ja"));
  if(!japanese)setError("Keine japanische Stimme ermittelt. Die Geräte-Aussprache kann ungenau sein.");
  const token=playToken.current;
  const utter=(index:number)=>{
   if(token!==playToken.current)return;
   if(index>=current.lines.length||onlyOne&&index>start){
    setPlaying(false);setPaused(false);return;
   }
   const message=new SpeechSynthesisUtterance(current.lines[index]!.japanese);
   message.lang="ja-JP";message.rate=rate;
   if(japanese)message.voice=japanese;
   message.onerror=()=>{
    if(token===playToken.current){setPlaying(false);setPaused(false);
      setError("Geräte-TTS konnte diesen Satz nicht abspielen. Transkript verfügbar.");}
   };
   message.onend=()=>{
    if(token!==playToken.current)return;
    if(onlyOne){setShadow(index);setPlaying(false);setPaused(false);}
    else utter(index+1);
   };
   synth.speak(message);
  };
  setPlaying(true);setPaused(false);
  utter(start);
 };
 const togglePause=()=>{
  if(typeof window==="undefined"||!("speechSynthesis" in window))return;
  if(paused){window.speechSynthesis.resume();setPaused(false);}
  else {window.speechSynthesis.pause();setPaused(true);}
 };
 const choose=(newId:string)=>{
  stop();setId(newId);setQuestionIndex(0);setDraft("");setCompared(false);
  setShowEvidence(false);setTranscript(false);setTranslation(false);
  setVocabulary(false);setShadow(null);setError("");
 };
 const next=()=>{
  setQuestionIndex(i=>Math.min(current.questions.length-1,i+1));
  setDraft("");setCompared(false);setShowEvidence(false);
 };
 return <section className="p27-journey__p47" aria-label="Japanische Hörbibliothek">
  <h4>Japanisch hören – erst zuhören, dann prüfen</h4>
  <p>40 original verfasste A1–A2 Hörsituationen. Der Ton kommt nur aus der
   <strong> Sprachausgabe deines Geräts (TTS)</strong>, nicht von aufgenommenen
   japanischen Sprechern. Höre zuerst ohne Text; das Transkript lässt sich
   später gezielt einblenden.</p>
  <div className="p27-journey__p47-filters">
   <label htmlFor="p47-level">Schwierigkeit</label>
   <select id="p47-level" value={level} onChange={e=>setLevel(e.target.value as "all"|"A1"|"A2")}>
    <option value="all">A1 und A2</option><option value="A1">A1</option><option value="A2">A2</option>
   </select>
   <label htmlFor="p47-search">Situation suchen</label>
   <input id="p47-search" type="search" value={search} onChange={e=>setSearch(e.target.value)}
     placeholder="Thema oder Hörziel"/>
  </div>
  <div className="p27-journey__p47-layout">
   <nav className="p27-journey__p47-catalog" aria-label="Hörszenarien auswählen">
    <p>{filtered.length} von {scenes.length} Szenarien</p>
    {filtered.map(s=><button type="button" key={s.id} onClick={()=>choose(s.id)}
      aria-current={s.id===current.id?"page":undefined}>
      <strong>{scenes.indexOf(s)+1}. {s.title}</strong>
      <small>{s.level} · {s.genre}{s.id===preferredId?" · Übungsfokus":""}</small>
    </button>)}
    {filtered.length===0?<p>Keine passende Hörsituation.</p>:null}
   </nav>
   <article className="p27-journey__p47-studio">
    <header>
     <small>{current.level} · {current.genre}</small>
     <h5>{current.title}</h5>
     <p><strong>Situation:</strong> {current.situation}</p>
     <p><strong>Hörziel:</strong> {current.listeningGoal}</p>
     <details><summary>Hörstrategie vor dem Anhören</summary><p>{current.prediction}</p></details>
    </header>
    <div className="p27-journey__p47-playback" aria-label="Optionale Gerätesprachausgabe">
     <strong>Japanische Geräte-TTS · keine Originalaufnahme</strong>
     <label htmlFor="p47-rate">Sprechtempo</label>
     <select id="p47-rate" value={rate} onChange={e=>setRate(Number(e.target.value))}>
      {rates.map(r=><option key={r} value={r}>{r===1?"Normal":r+" ×"}</option>)}
     </select>
     <div className="p27-journey__actions">
      <button type="button" onClick={()=>{setShadow(null);speak(0,false)}}>Gesamtes Gespräch abspielen / wiederholen</button>
      <button type="button" disabled={!playing} onClick={togglePause}>{paused?"Fortsetzen":"Pause"}</button>
      <button type="button" disabled={!playing&&!paused} onClick={stop}>Stoppen</button>
     </div>
     {error?<p role="status">{error}</p>:null}
     {playing?<p role="status">{paused?"Sprachausgabe pausiert":"Geräte-TTS wird abgespielt"}</p>:null}
     <p>Einzelsätze zum Wiederholen und Nachsprechen, ohne Aufzeichnung:</p>
     <div className="p27-journey__p47-sentences" role="group" aria-label="Satzweise hören und nachsprechen">
      {current.lines.map((line,index)=><div key={index}>
       <button type="button" onClick={()=>speak(index,true)}>
        Satz {index+1} hören · {line.speaker}
       </button>
       {shadow===index?<p role="status">Jetzt selbst nachsprechen: Satz {index+1}.
         Es wird nichts aufgenommen oder benotet.</p>:null}
      </div>)}
     </div>
    </div>
    <div className="p27-journey__p47-reveal">
     <button type="button" aria-expanded={transcript}
       onClick={()=>setTranscript(v=>!v)}>
       {transcript?"Japanisches Transkript verbergen":"Japanisches Transkript anzeigen"}
     </button>
     {transcript?<div className="p27-journey__p47-transcript" aria-label="Japanisches Originaltranskript">
      {current.lines.map((line,i)=><div key={i}>
       <strong>{line.speaker}</strong>
       <p lang="ja">{line.japanese}</p>
       {translation?<p>{line.german}</p>:null}
      </div>)}
      <button type="button" onClick={()=>setTranslation(v=>!v)}>
       {translation?"Deutsche Zeilenhilfe ausblenden":"Deutsche Zeilenhilfe anzeigen"}
      </button>
      <p>{current.notes}</p>
     </div>:null}
     <button type="button" aria-expanded={vocabulary}
       onClick={()=>setVocabulary(v=>!v)}>
       {vocabulary?"Wortschatzhilfe ausblenden":"Schlüsselwörter einblenden"}
     </button>
     {vocabulary?<dl>{current.vocabulary.map(v=><div key={v.word}>
       <dt lang="ja">{v.word}（{v.reading}）</dt>
       <dd>{v.meaning} · <span lang="ja">{v.context}</span></dd>
     </div>)}</dl>:null}
    </div>
    <section className="p27-journey__p47-comprehension">
     <h5>Nach dem Hören selbst antworten</h5>
     <div className="p27-journey__p47-questions" role="group" aria-label="Hörverständnisfrage">
      {current.questions.map((q,i)=><button key={q.id} type="button"
       aria-pressed={i===questionIndex} onClick={()=>{
        setQuestionIndex(i);setDraft("");setCompared(false);setShowEvidence(false);
       }}>{i+1}. {q.kind==="detail"?"Detail":q.kind==="inference"?"Schlussfolgerung":"Absicht"}</button>)}
     </div>
     {question?<div>
      <p><strong>Frage {questionIndex+1}:</strong> {question.question}</p>
      <label htmlFor="p47-answer">Eigenständige japanische Antwort</label>
      <textarea id="p47-answer" rows={3} lang="ja" value={draft}
       onChange={e=>{setDraft(e.target.value);setCompared(false);setShowEvidence(false)}}/>
      <div className="p27-journey__actions">
       <button type="button" disabled={!draft.trim()} onClick={()=>setCompared(true)}>
        Mit Originalbeispielen abgleichen
       </button>
       <button type="button" disabled={disabled} onClick={()=>onPractice(current.id,"comprehension")}>
        Drei Fragen als textgestützte StudyPlayer-Wiederholung
       </button>
      </div>
      {feedback?<div role="status" className="p27-journey__p47-feedback">
       <strong>{feedback.kind==="authored"?"Mit Originalbeispiel vergleichbar":
         feedback.kind==="misconception"?"Bekanntes Missverständnis":
         "Andere mögliche Antwort – nicht semantisch bewertet"}</strong>
       <p>{feedback.message}</p>
       <p>{question.feedback}</p>
       <button type="button" aria-expanded={showEvidence} onClick={()=>setShowEvidence(v=>!v)}>
        {showEvidence?"Textbeleg und Muster verbergen":"Hörbeleg und Muster nach dem Versuch zeigen"}
       </button>
       {showEvidence?<div>
        <p><strong>Hörbeleg:</strong> <span lang="ja">{question.evidence}</span></p>
        <p><strong>Muster:</strong> <span lang="ja">{question.answer}</span></p>
        <p><strong>Alternative:</strong> <span lang="ja">{question.alternative}</span></p>
       </div>:null}
       {questionIndex<current.questions.length-1?
        <button type="button" onClick={next}>Nächste Hörfrage</button>:null}
      </div>:null}
     </div>:null}
    </section>
    <section className="p27-journey__p47-production">
     <h5>Gehörtes eigenständig anwenden</h5>
     <p>{current.response.instruction}</p>
     <div className="p27-journey__actions">
      <button type="button" onClick={()=>onWriting(current.id)}>
       Im bisherigen Schreibeditor ausformulieren
      </button>
      <button type="button" disabled={disabled} onClick={()=>onPractice(current.id,"response")}>
       Im StudyPlayer unabhängig schreiben
      </button>
     </div>
    </section>
    <section className="p27-journey__p47-transfer">
     <h5>Neue Situation später abrufen</h5>
     <p>Diese eigene Übertragung verändert Fakten der Hörszene und zeigt keine Musterantwort.
       Sie wird im bisherigen StudyPlayer geübt; nur echte FSRS-Traces machen sie fällig.</p>
     <button type="button" disabled={disabled} onClick={()=>onPractice(current.id,"return")}>
      Neuen Kontext freiwillig abrufen
     </button>
    </section>
    <small>Geräte-TTS kann Aussprachefehler enthalten. Das Hörtraining ist unbewertet;
      native StudyPlayer-Fragen sind zur Fairness textgestützt und keine
      beweisbare Hörprüfung. Keine Aufzeichnung, Audioablage oder zweite Lernhistorie.</small>
   </article>
  </div>
 </section>;
}
