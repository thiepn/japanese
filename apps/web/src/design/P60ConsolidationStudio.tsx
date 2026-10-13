import {useEffect,useMemo,useRef,useState} from "react";
import {p60Compare,p60RelatedVocabulary,p60Stage,p60CourseTracks,
 type P60Unit,type P60PracticeKind,type P60HistoricalReviewSource} from "../study/consolidation60";
import "./p60-consolidation.css";
type Practice=Exclude<P60PracticeKind,"all">;
type Step="reading"|"speaking"|"writing"|"reflection";
type Kind="question"|"strategy"|"writing"|"followup"|"revision";
const steps:readonly [Step,string][]=[
 ["reading","1 · Quellen"],["speaking","2 · Zuhören und reagieren"],
 ["writing","3 · Eigenständig schreiben"],["reflection","4 · Festigen und weiterlernen"]];
const statusText:Record<P60HistoricalReviewSource["status"],string>={
 "due":"Laut Original-FSRS fällig",
 "needs-repair":"Letzte bewertete Antwort war falsch · nicht zwingend fällig",
 "unseen":"Noch kein originaler Bewertungsnachweis",
 "previously-practiced":"Bereits bearbeitet · nur FSRS bestimmt nächste Fälligkeit"
};
/** UI reads original owner-authoritative evidence; every free draft remains in component memory. */
export function P60ConsolidationStudio({
 lessons,preferredId,readyIds,historical,disabled,onPractice,onHistorical,onWriting,onDirtyChange
}:{
 lessons:readonly P60Unit[];preferredId?:string;readyIds:readonly string[];
 historical:readonly P60HistoricalReviewSource[];disabled:boolean;
 onPractice:(id:string,kind:Practice)=>void;
 onHistorical:(id:string,unitId:string)=>void;
 onWriting:(id:string)=>void;
 onDirtyChange?:(dirty:boolean)=>void;
}){
 const [chosen,setChosen]=useState("");
 const [step,setStep]=useState<Step>("reading");
 const [sourceDisclosure,setSourceDisclosure]=useState<boolean|null>(null);
 const [mode,setMode]=useState<Kind>("question");
 const [questionIndex,setQuestionIndex]=useState(0);
 const [draft,setDraft]=useState("");
 // Ephemeral visibility only: never send or persist actual Japanese draft text.
 useEffect(()=>{onDirtyChange?.(Boolean(draft.trim()));return ()=>onDirtyChange?.(false);},
  [draft,onDirtyChange]);
 const [attempt,setAttempt]=useState(false);
 const [models,setModels]=useState(false);
 const [reveal,setReveal]=useState<readonly string[]>([]);
 const [spoken,setSpoken]=useState(false);
 const [showVocabulary,setShowVocabulary]=useState(false);
 const [catalog,setCatalog]=useState(false);
 const [reviewOnly,setReviewOnly]=useState<"all"|"due"|"needs-repair"|"unseen">("all");
 const [phase,setPhase]=useState("all");
 const [selectedTrack,setSelectedTrack]=useState("all");
 const [scope,setScope]=useState<"unit"|"all">("unit");
 const [search,setSearch]=useState("");
 const [showMore,setShowMore]=useState(15);
 const [lessonFilter,setLessonFilter]=useState("");
 const [ttsStatus,setTtsStatus]=useState("");
 const [ttsBusy,setTtsBusy]=useState(false);
 const speechToken=useRef(0);
 const lesson=lessons.find(x=>x.id===chosen)??lessons.find(x=>x.id===preferredId)??lessons[0];
 const stop=()=>{
  speechToken.current++;
  if(typeof window!=="undefined"&&"speechSynthesis" in window)window.speechSynthesis.cancel();
  setTtsBusy(false);
 };
 useEffect(()=>()=>{speechToken.current++;
  if(typeof window!=="undefined"&&"speechSynthesis" in window)window.speechSynthesis.cancel();
 },[]);
 useEffect(()=>{
  speechToken.current++;
  if(typeof window!=="undefined"&&"speechSynthesis" in window)window.speechSynthesis.cancel();
 },[lesson?.id]);
 const phaseNumbers=useMemo(()=>Array.from(new Set(historical.map(p=>p.phase)))
  .sort((a,b)=>a-b),[historical]);
 if(!lesson)return null;
 const stage=p60Stage(lesson.id),q=lesson.questions[questionIndex]??lesson.questions[0]!;
 const sourcesVisible=sourceDisclosure??stage.stage<=2;
 const task=mode==="question"?q:mode==="strategy"?lesson.strategy:
  mode==="writing"?lesson.writing:mode==="revision"?{
   situation:"Korrigiere den ursprünglichen originalen Fehltext ohne unbelegte Behauptungen.",
   model:lesson.revision.model,alternative:lesson.revision.alternative,
   trap:lesson.revision.flawed,why:lesson.revision.why
  }:{
   situation:lesson.reply.goal,model:lesson.reply.model,
   alternative:lesson.reply.alternative,trap:lesson.reply.trap,why:lesson.reply.why};
 const comparison=attempt?p60Compare(draft,[task.model,task.alternative],task.trap,task.why):null;
 const words=p60RelatedVocabulary(lesson);
 const filtered=historical.filter(item=>
  (scope==="all"||item.unitIds.includes(lesson.units[0]!))&&
  (phase==="all"||String(item.phase)===phase)&&
  (selectedTrack==="all"||p60CourseTracks.some(track=>track.id===selectedTrack&&
     (track.phases as readonly number[]).includes(item.phase)))&&
  (reviewOnly==="all"||item.status===reviewOnly)&&
  [item.title,item.instruction,item.id].join(" ").toLocaleLowerCase()
   .includes(search.trim().toLocaleLowerCase()));
 const shownLessons=lessons.filter(x=>[x.title,x.domain,x.goal].join(" ")
  .toLocaleLowerCase().includes(lessonFilter.trim().toLocaleLowerCase()));
 const due=historical.filter(x=>x.status==="due");
 const mistakes=historical.filter(x=>x.status==="needs-repair");
 const attempted=historical.filter(x=>x.status==="previously-practiced"||
  x.status==="needs-repair"||x.status==="due");
 const stepIndex=steps.findIndex(s=>s[0]===step);
 const toggle=(key:string)=>setReveal(old=>old.includes(key)?old.filter(v=>v!==key):[...old,key]);
 function allowDiscard():boolean{
  if(!draft.trim())return true;
  return typeof window!=="undefined"&&window.confirm(
   "Eine noch nicht abgeschlossene japanische Antwort würde beim Wechsel verworfen. Diese Eingabe wurde nicht gespeichert. Trotzdem wechseln?");
 }
 function choose(id:string){
  if(id!==lesson.id&&!allowDiscard())return;
  stop();setChosen(id);setStep("reading");setSourceDisclosure(null);setMode("question");setQuestionIndex(0);
  setDraft("");setAttempt(false);setModels(false);
  setReveal([]);setSpoken(false);setShowVocabulary(false);
  setSearch("");setShowMore(15);setTtsStatus("");
 }
 function taskMode(next:Kind){
  if(next!==mode&&!allowDiscard())return;
  setMode(next);setDraft("");setAttempt(false);setModels(false);
 }
 function next(){setStep(steps[Math.min(steps.length-1,stepIndex+1)]![0]);}
 function play(from=0){
  if(typeof window==="undefined"||!("speechSynthesis" in window)||
    typeof SpeechSynthesisUtterance==="undefined"){
   setTtsStatus("Keine Geräte-TTS verfügbar. Das japanische Skript bleibt lesbar.");return;
  }
  stop();setTtsStatus("");
  const synth=window.speechSynthesis;
  const voice=synth.getVoices().find(v=>v.lang.toLowerCase().startsWith("ja"));
  if(!voice)setTtsStatus("Keine japanische Geräte-Stimme erkannt; Aussprache kann abweichen.");
  const token=speechToken.current;setTtsBusy(true);
  const nextLine=(i:number)=>{
   if(token!==speechToken.current)return;
   if(i>=lesson.spoken.length){setTtsBusy(false);return;}
   const utterance=new SpeechSynthesisUtterance(lesson.spoken[i]!.japanese);
   utterance.lang="ja-JP";utterance.rate=.86;
   if(voice)utterance.voice=voice;
   utterance.onend=()=>nextLine(i+1);
   utterance.onerror=()=>{if(token===speechToken.current){
    setTtsBusy(false);setTtsStatus("Geräte-TTS fehlgeschlagen. Verwende das Originalskript.");
   }};
   synth.speak(utterance);
  };
  nextLine(from);
 }
 const source=(s:{speaker:string;japanese:string;german:string},key:string)=>
  <div className="p60-consolidation__source" key={key}>
   <small>{s.speaker}</small><p lang="ja">{s.japanese}</p>
   <button type="button" aria-expanded={reveal.includes(key)} onClick={()=>toggle(key)}>
    {reveal.includes(key)?"Deutsch verbergen":"Deutsch bei Bedarf zeigen"}</button>
   {reveal.includes(key)?<p>{s.german}</p>:null}
  </div>;
 return <section className="p60-consolidation" aria-label="A2 Kurskonsolidierung und unabhängige Wiederholung">
  <header>
   <h4>A2 · Originalkurs abschließen, Verstehen vertiefen, weiterlernen</h4>
   <p>20 neue quellenbasierte Konsolidierungslektionen plus direkte
    Lernwege zu echten P40–P59-Originalprompts. Keine zweite Lerndatenbank,
    kein neuer Bewertungsalgorithmus und <strong>kein offizieller Nachweis
    einer A2-Sprachprüfung</strong>.</p>
  </header>
  <div className="p60-consolidation__counts" aria-label="Nur beobachtete originale Reviewevidenz">
   <div><strong>{attempted.length}</strong><small>Früher bearbeitete Originalfragen, nicht bestandene Skills</small></div>
   <div><strong>{due.length}</strong><small>Momentan wirklich FSRS-fällige Originalfragen</small></div>
   <div><strong>{mistakes.length}</strong><small>Zuletzt falsch beantwortete Originalfragen; können später fällig sein</small></div>
  </div>
  <div className="p60-consolidation__actions">
   <button type="button" aria-expanded={catalog} onClick={()=>setCatalog(v=>!v)}>
    {catalog?"Originalquellenverzeichnis schließen":"Alle originalen P40–P59 Übungsquellen entdecken"}
   </button>
   <button type="button" disabled={!due.length} onClick={()=>{
    setCatalog(true);setScope("all");setPhase("all");setSelectedTrack("all");setReviewOnly("due");setShowMore(15);
   }}>Fällige ursprüngliche Karten finden</button>
   <button type="button" disabled={!mistakes.length} onClick={()=>{
    setCatalog(true);setScope("all");setPhase("all");setSelectedTrack("all");setReviewOnly("needs-repair");setShowMore(15);
   }}>Frühere Fehler gezielt aufrufen</button>
  </div>
  {catalog?<section className="p60-consolidation__history">
   <h5>Original-Lernquellen und aktuelle echte Reviewergebnisse</h5>
   <p>Die Auswahl öffnet <strong>die tatsächliche frühere StudyPrompt-ID</strong>.
    Originale Quelltexte bleiben in ihren eigenen Modulen. Noch nicht
    freigegebene historische Transferfragen werden hier nicht gezeigt.
    Fehlerstatus bedeutet nicht automatisch FSRS-fällig.</p>
   <div className="p60-consolidation__filters">
    <label>Bereich
     <select value={scope} onChange={e=>{setScope(e.target.value as typeof scope);setShowMore(15)}}>
      <option value="unit">Wie diese ausgewählte P60-Lektion</option>
      <option value="all">Alle Originaleinheiten</option>
     </select>
    </label>
    <label>Lernpfad
     <select value={selectedTrack} onChange={e=>{setSelectedTrack(e.target.value);setShowMore(15)}}>
      <option value="all">Alle sechs Wege</option>
      {p60CourseTracks.map(track=><option key={track.id} value={track.id}>{track.title}</option>)}
     </select>
    </label>
    <label>Originalphase
     <select value={phase} onChange={e=>{setPhase(e.target.value);setShowMore(15)}}>
      <option value="all">P40–P59 zusammen</option>
      {phaseNumbers.map(n=><option key={n} value={String(n)}>P{n}</option>)}
     </select>
    </label>
    <label>Übungsstatus
     <select value={reviewOnly} onChange={e=>{setReviewOnly(e.target.value as typeof reviewOnly);setShowMore(15)}}>
      <option value="all">Alle</option>
      <option value="due">Jetzt laut FSRS fällig</option>
      <option value="needs-repair">Zuletzt falsch, nicht zwingend fällig</option>
      <option value="unseen">Noch ohne Bewertungsnachweis</option>
     </select>
    </label>
    <label>Originalmaterial suchen
     <input type="search" value={search} onChange={e=>{setSearch(e.target.value);setShowMore(15)}}
      placeholder="P55, 文章, Höflichkeit …"/>
    </label>
   </div>
   <p>{filtered.length} tatsächliche ursprüngliche Prompts entsprechen der Auswahl.</p>
   <div className="p60-consolidation__history-list">
    {filtered.slice(0,showMore).map(item=><div key={item.id}>
     <strong>P{item.phase}</strong><span>{statusText[item.status]}</span>
     <p>{item.instruction.slice(0,150)}</p>
     <small>Ursprüngliche ID: <code>{item.id}</code> · Originaleinheiten: {item.unitIds.join(" · ")}</small>
     <button type="button" disabled={disabled}
      onClick={()=>onHistorical(item.id,item.unitIds.includes(lesson.units[0]!)?lesson.units[0]!:item.unitId)}>Originale StudyPlayer-Aufgabe öffnen</button>
    </div>)}
   </div>
   {filtered.length>showMore?<button type="button" onClick={()=>setShowMore(n=>n+20)}>Weitere ursprüngliche Quellen</button>:null}
   {!filtered.length?<p>Keine entsprechende belegte Originalquelle in dieser Auswahl.</p>:null}
  </section>:null}
  <section className="p60-consolidation__tracks" aria-label="Kohärenter Originalkurs-Lernpfad P40 bis P60">
   <h5>Zusammenhängender Kursweg · original P40–P59 nachlernen</h5>
   <p>Die folgenden sechs Bereiche sind Navigation nach tatsächlichen
    Originalquellen. Bearbeitete Übungsfragen sind keine als bestanden
    gewerteten CEFR-Kompetenzen. Nur echte FSRS-MemoryTraces bestimmen Fälligkeit.</p>
   <div className="p60-consolidation__tracks-grid">
    {p60CourseTracks.map(track=>{
     const items=historical.filter(item=>
       (track.phases as readonly number[]).includes(item.phase));
     const dueCount=items.filter(item=>item.status==="due").length;
     const wrongCount=items.filter(item=>item.status==="needs-repair").length;
     const candidate=items.find(item=>item.status==="due")??
      items.find(item=>item.status==="needs-repair")??items[0];
     return <div key={track.id}>
      <strong>{track.title}</strong>
      <small>Originalphasen: {track.phases.map(p=>"P"+p).join(" · ")}</small>
      <p>{track.aim}</p><p><strong>Nächste Aufgabe:</strong> {track.next}</p>
      <small>{items.length} tatsächlich auffindbare Originalfragen ·
       {dueCount} FSRS-fällig · {wrongCount} zuletzt falsch</small>
      <div className="p60-consolidation__actions">
       <button type="button" disabled={!items.length} onClick={()=>{
        setCatalog(true);setScope("all");setReviewOnly("all");
        setPhase("all");setSelectedTrack(track.id);setShowMore(15);
       }}>Originalquellen öffnen</button>
       <button type="button" disabled={!candidate||disabled}
        onClick={()=>{if(candidate)onHistorical(candidate.id,candidate.unitIds.includes(lesson.units[0]!)?lesson.units[0]!:candidate.unitId)}}>
        Konkrete nächste Originalübung</button>
      </div>
     </div>;
    })}
   </div>
  </section>
  <div className="p60-consolidation__layout">
   <nav className="p60-consolidation__lessons" aria-label="20 originale A2-Konsolidierungslektionen">
    <label htmlFor="p60-search">Neue P60-Lektion finden</label>
    <input id="p60-search" type="search" value={lessonFilter}
     onChange={e=>setLessonFilter(e.target.value)} placeholder="Thema oder Ziel"/>
    {shownLessons.map((entry,i)=><button type="button" key={entry.id}
     aria-current={entry.id===lesson.id?"page":undefined} onClick={()=>choose(entry.id)}>
     <small>Stufe {p60Stage(entry.id).stage}/4 · {entry.domain}</small>
     <strong lang="ja">{lessons.indexOf(entry)+1}. {entry.title}</strong>
     <small>{entry.goal}</small>
    </button>)}
   </nav>
   <article className="p60-consolidation__workspace">
    <small>A2-Fokus · Stufe {stage.stage}/4 · {stage.label}</small>
    <h5 lang="ja">{lesson.title}</h5>
    <p><strong>Lernziel:</strong> {lesson.goal}</p>
    <div className="p60-consolidation__actions" role="group" aria-label="Vier Teile dieser Lernlektion">
     {steps.map(([id,title])=><button key={id} type="button"
      aria-pressed={id===step} onClick={()=>{stop();setStep(id)}}>{title}</button>)}
    </div>
    {step==="reading"?<section>
     <h5>1 · Neue mehrteilige schriftliche Quelle</h5>
     <p>Lies die drei Originaltexte und zwei Nachrichten. Übersetzungen
      sind optional. Kennzeichne selbst, wer etwas vorschlägt und wer
      eine Änderung bestätigt.</p>
     <button type="button" aria-expanded={sourcesVisible}
      onClick={()=>setSourceDisclosure(!sourcesVisible)}>
      {sourcesVisible?"Originalquellen einklappen":"Originalquellen zum eigenständigen Lesen öffnen"}
     </button>
     {stage.stage>=3?<p>Stufe {stage.stage}: Die Originaltexte bleiben zunächst verborgen.
      Öffne sie selbst, wenn du den Sachstand belegen musst. Das Abrufen der
      Quelle ist keine Bewertung und erzeugt keine Lernhistorie.</p>:null}
     {sourcesVisible?<div className="p60-consolidation__source-set">
      {lesson.text.map((x,i)=>source(x,"text"+i))}
      <h5>Zwei neue Nachrichten</h5>
      {lesson.messages.map((x,i)=>source(x,"message"+i))}
     </div>:null}
     <button type="button" onClick={next}>Zum Gespräch und Hören</button>
    </section>:null}
    {step==="speaking"?<section>
     <h5>2 · Hören und situationsgerecht reagieren</h5>
     <p>Das Gerät kann drei japanische Äußerungen synthetisch vorlesen.
      Dabei können verschiedene Sprecher dieselbe Computerstimme haben.
      Das Transkript wird erst auf Wunsch sichtbar.</p>
     <div className="p60-consolidation__actions">
      <button type="button" onClick={()=>play(0)}>Drei japanische Beiträge hören</button>
      <button type="button" disabled={!ttsBusy} onClick={stop}>Stopp</button>
      <button type="button" aria-expanded={spoken} onClick={()=>setSpoken(v=>!v)}>
       {spoken?"Skript verbergen":"Originaltranskript anzeigen"}</button>
     </div>
     {ttsStatus?<p role="status">{ttsStatus}</p>:null}
     {spoken?lesson.spoken.map((x,i)=><div key={i}>
      {source(x,"spoken"+i)}
      <button type="button" onClick={()=>play(i)}>Ab diesem Sprecher hören</button>
     </div>):null}
     <button type="button" onClick={next}>Zum eigenen Schreiben</button>
    </section>:null}
    {step==="writing"?<section>
     <h5>3 · Eigenständige japanische Antworten</h5>
     <div className="p60-consolidation__actions" role="group" aria-label="Praxisarten">
      {(["question","strategy","writing","followup","revision"] as const).map(k=>
       <button key={k} type="button" aria-pressed={mode===k}
        onClick={()=>taskMode(k)}>{{
         question:"Belegfrage",strategy:"Entscheiden",writing:"Selbst schreiben",
         followup:"Unerwartete Antwort",revision:"Falsche Nachricht korrigieren"}[k]}</button>)}
     </div>
     {mode==="question"?<div className="p60-consolidation__actions">
      {lesson.questions.map((x,i)=><button key={x.id} type="button"
       aria-pressed={i===questionIndex} onClick={()=>{
        setQuestionIndex(i);setDraft("");setAttempt(false);setModels(false);
       }}>Frage {i+1}: {x.kind}</button>)}
     </div>:null}
     {mode==="followup"&&<div className="p60-consolidation__source">
      <small>Unerwartete neue Antwort: {lesson.reply.speaker}</small>
      <p lang="ja">{lesson.reply.japanese}</p>
      <details><summary>Deutsche Bedeutung</summary>{lesson.reply.german}</details>
     </div>}
     {mode==="revision"&&<div className="p60-consolidation__source">
      <small>Original verfasster fehlerhafter Satz</small>
      <p lang="ja">{lesson.revision.flawed}</p>
     </div>}
     <p className="p60-consolidation__task">{task.situation}</p>
     <label htmlFor="p60-own-answer">Deine eigene vollständige japanische Formulierung</label>
     <textarea id="p60-own-answer" rows={5} lang="ja" value={draft}
      onChange={e=>{setDraft(e.target.value);setAttempt(false);setModels(false)}}
      aria-keyshortcuts="Control+Enter Meta+Enter"
      onKeyDown={e=>{if(!e.nativeEvent.isComposing&&(e.metaKey||e.ctrlKey)&&e.key==="Enter"&&draft.trim()){
       e.preventDefault();setAttempt(true);
      }}}/>
     <div className="p60-consolidation__actions">
      <button type="button" disabled={!draft.trim()} onClick={()=>setAttempt(true)}>Erst nach eigenem Versuch vergleichen</button>
      <button type="button" disabled={disabled}
       onClick={()=>onPractice(lesson.id,mode==="question"?"comprehension":
        mode==="strategy"?"strategy":mode==="writing"?"writing":
        mode==="followup"?"followup":"revision")}>
       {mode==="question"?"Belegfrage im nativen StudyPlayer beantworten":
        "Quellenrichtige Originalantworten im nativen StudyPlayer auswählen"}</button>
      <small>Dein frei verfasster japanischer Text bleibt unbenotet. Der
       native StudyPlayer prüft bei längeren Schreib-, Korrektur- und
       Antwortaufgaben ausschließlich original verfasste Antwortoptionen,
       nicht die semantische Qualität deiner eigenen Formulierung.</small>
     </div>
     {comparison?<div className="p60-consolidation__feedback" role="status">
      <strong>{comparison.kind==="model"?"Originales Modell getroffen":
       comparison.kind==="known-error"?"Konkreter Quellenfehler":"Unbenoteter anderer Ausdruck"}</strong>
      <p>{comparison.message}</p><p>{task.why}</p>
      {mode==="question"?<details>
       <summary>Originale getrennte Quellenbelege anzeigen</summary>
       <p lang="ja">「{q.documentEvidence}」</p><p lang="ja">「{q.spokenEvidence}」</p>
      </details>:null}
      <button type="button" aria-expanded={models} onClick={()=>setModels(v=>!v)}>
       {models?"Modelle ausblenden":"Erst jetzt originale japanische Modelle anzeigen"}</button>
      {models?<div>
       <p lang="ja">{task.model}</p><p lang="ja">{task.alternative}</p>
       <p>Typischer Fehlschluss: <span lang="ja">{task.trap}</span></p>
      </div>:null}
     </div>:null}
     <button type="button" onClick={()=>onWriting(lesson.id)}>
      Eigene Nachricht im ursprünglichen mehrstufigen Learn-Editor weiter überarbeiten</button>
     <button type="button" onClick={next}>Zum eigenständigen Review</button>
    </section>:null}
    {step==="reflection"?<section>
     <h5>4 · Was ist tatsächlich belegt, was braucht Wiederholung?</h5>
     <p><strong>Sprachlicher Gegensatz:</strong> {lesson.grammar}</p>
     <p>{words.length} P53-Originalwortfamilien, davon {words.filter(w=>w.attested).length}
      genaue Schreibformen in diesen neuen Originalquellen belegt.</p>
     <button type="button" aria-expanded={showVocabulary} onClick={()=>setShowVocabulary(v=>!v)}>
      {showVocabulary?"Wortfamilien schließen":"Originalwortfamilien und Kollokationen entdecken"}</button>
     {showVocabulary?<div className="p60-consolidation__words">{words.map(w=><div key={w.id}>
      <strong lang="ja">{w.written}（{w.reading}）</strong> · {w.meaning}
      <small>{w.attested?"Wörtlich hier belegt":"Thematisch verbunden; nicht wörtlich belegt"}</small>
      <p lang="ja">{w.collocations.join(" ／ ")}</p><p>{w.nuance}</p>
      {w.families.slice(0,1).map(f=><p key={f.id}>{f.explanation}</p>)}
     </div>)}</div>:null}
     <h5>Ein späterer wirklich anderer Transferfall</h5>
     <p>Neue Quellen sind nicht als gewöhnliche neue Karten sichtbar.
      Die Original-FSRS-Fälligkeit oder ein tatsächliches früheres
      bewertetes Quellen-StudyEvent von mindestens 24 Stunden ist nötig,
      um den neuen Fall erstmals zu öffnen.</p>
     <button type="button" disabled={disabled||!readyIds.includes(lesson.id)}
      onClick={()=>onPractice(lesson.id,"return")}>
      Ungesehenen eigenständigen Alltagstransfer starten</button>
     {!readyIds.includes(lesson.id)?<small>Erst die originale Quellenfrage im
      nativen StudyPlayer beantworten und Lernabstand abwarten.</small>:null}
     <h5>Nächster Lernschritt</h5>
     <p>Ungeübte und früher falsch beantwortete Originalquellen können
      gezielt wiederholt werden. Nur der bestehende StudyPlayer und FSRS
      bestimmen echte Bewertungen und Wiederholungstermine.
      A2-Lektionen abzuschließen ist keine automatische CEFR- oder JLPT-Zertifizierung.</p>
     <div className="p60-consolidation__actions">
      <button type="button" onClick={()=>{
       setCatalog(true);setReviewOnly("needs-repair");setScope("all");setSelectedTrack("all");setPhase("all");
      }}>Gezielt Fehler aus P40–P59 nacharbeiten</button>
      <button type="button" onClick={()=>{
       setCatalog(true);setReviewOnly("due");setScope("all");setSelectedTrack("all");setPhase("all");
      }}>Heute fällige Originalkarten aufrufen</button>
      <button type="button" onClick={()=>{
       const nextIndex=lessons.findIndex(x=>x.id===lesson.id)+1;
       if(nextIndex<lessons.length)choose(lessons[nextIndex]!.id);
      }} disabled={lessons.findIndex(x=>x.id===lesson.id)>=lessons.length-1}>
       Nächste neue A2-Konsolidierungslektion</button>
     </div>
    </section>:null}
    <small>Originaltext: THIEPN. Marugoto-A1/A2 nur als didaktische Referenz.
     Kein gespeicherter privater Rohentwurf, keine neue Bewertungsinstanz,
     keine gemessene Audio-/Sprechleistung und kein offizielles Level-Zertifikat.</small>
   </article>
  </div>
 </section>;
}
