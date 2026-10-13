import {useEffect,useRef,useState} from "react";
import {p59Stage,p59AuthoredFeedback,p59RelatedVocabulary,p59RelatedSources,
 type P59Mission,type P59PracticeKind,type P59Line} from "../study/performance59";
import "./p59-performance.css";
type Kind=Exclude<P59PracticeKind,"all">;
const registerText={casual:"Vertraut",polite:"Höflich",service:"Service"} as const;
/** Source-specific teaching UI only. The original StudyPlayer alone grades and updates FSRS. */
export function P59PerformanceStudio({missions,preferredId,recallReadyIds,disabled,
 onPractice,onWriting,onRelated}:{
 missions:readonly P59Mission[];preferredId?:string;recallReadyIds:readonly string[];
 disabled:boolean;onPractice:(id:string,kind:Kind)=>void;onWriting:(id:string)=>void;
 onRelated:(id:string,kind:"integrated"|"writing"|"interaction"|"listening"|"reading"|"document")=>void;
}){
 const [selected,setSelected]=useState("");
 const [query,setQuery]=useState("");
 const [limit,setLimit]=useState(20);
 const [mode,setMode]=useState<"comprehension"|"strategy"|"writing"|"reply"|"revision">("comprehension");
 const [question,setQuestion]=useState(0);
 const [draft,setDraft]=useState("");
 const [attempt,setAttempt]=useState(false);
 const [showAnswer,setShowAnswer]=useState(false);
 const [meaning,setMeaning]=useState<readonly string[]>([]);
 const [openedSources,setOpenedSources]=useState(false);
 const [transcript,setTranscript]=useState(false);
 const [unexpected,setUnexpected]=useState(false);
 const [vocab,setVocab]=useState(false);
 const [related,setRelated]=useState(false);
 const [ttsStatus,setTtsStatus]=useState("");
 const [ttsPlaying,setTtsPlaying]=useState(false);
 const speechRun=useRef(0);
 const current=missions.find(m=>m.id===selected)??missions.find(m=>m.id===preferredId)??missions[0];
 const stop=()=>{
  speechRun.current++;
  if(typeof window!=="undefined"&&"speechSynthesis" in window)window.speechSynthesis.cancel();
  setTtsPlaying(false);
 };
 useEffect(()=>()=>{speechRun.current++;
  if(typeof window!=="undefined"&&"speechSynthesis" in window)window.speechSynthesis.cancel();
 },[]);
 useEffect(()=>{
  speechRun.current++;
  if(typeof window!=="undefined"&&"speechSynthesis" in window)window.speechSynthesis.cancel();
 },[current?.id]);
 if(!current)return null;
 const stage=p59Stage(current.id);
 const words=p59RelatedVocabulary(current),sources=p59RelatedSources(current);
 const matches=missions.filter(m=>
  [m.title,m.situation,m.goal,...m.source.map(t=>t.japanese)]
   .join(" ").toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
 const q=current.questions[question]??current.questions[0]!;
 const selectedTask=mode==="comprehension"?{
   situation:q.question,model:q.model,alternative:q.alternative,
   misleading:q.misleading,explanation:q.explanation
  }:mode==="strategy"?current.strategy:
   mode==="writing"?current.write:
   mode==="reply"?{situation:current.reply.newGoal,model:current.reply.model,
     alternative:current.reply.alternative,misleading:current.reply.misleading,
     explanation:current.reply.explanation
   }:{situation:current.revision.goal,model:current.revision.model,
     alternative:current.revision.alternative,misleading:current.revision.flawed,
     explanation:current.revision.explanation};
 const comparison=attempt?p59AuthoredFeedback(draft,[selectedTask.model,
  selectedTask.alternative],selectedTask.misleading,selectedTask.explanation):null;
 const translate=(key:string)=>setMeaning(v=>v.includes(key)?
  v.filter(k=>k!==key):[...v,key]);
 function reset(id:string){
  stop();setSelected(id);setMode("comprehension");setQuestion(0);setDraft("");
  setAttempt(false);setShowAnswer(false);setMeaning([]);
  setOpenedSources(p59Stage(id).number<=2);setTranscript(false);
  setUnexpected(false);setVocab(false);setRelated(false);setTtsStatus("");
 }
 function move(next:typeof mode){
  stop();setMode(next);setDraft("");setAttempt(false);setShowAnswer(false);
  if(next==="reply")setUnexpected(true);
 }
 function play(from=0){
  if(typeof window==="undefined"||!("speechSynthesis" in window)||
   typeof SpeechSynthesisUtterance==="undefined"){
   setTtsStatus("Keine Geräte-TTS verfügbar. Bitte das japanische Originalskript verwenden.");return;
  }
  stop();setTtsStatus("");
  const local=window.speechSynthesis,voices=local.getVoices();
  const japanese=voices.find(v=>v.lang.toLowerCase().startsWith("ja"));
  if(!japanese)setTtsStatus("Keine japanische Geräte-Stimme erkannt. Aussprache kann abweichen.");
  const run=speechRun.current;setTtsPlaying(true);
  const speak=(i:number)=>{
   if(run!==speechRun.current)return;
   if(i>=current.dialogue.length){setTtsPlaying(false);return;}
   const utter=new SpeechSynthesisUtterance(current.dialogue[i]!.japanese);
   utter.lang="ja-JP";utter.rate=.85;if(japanese)utter.voice=japanese;
   utter.onend=()=>speak(i+1);
   utter.onerror=()=>{if(run===speechRun.current){
    setTtsPlaying(false);setTtsStatus("Geräte-TTS fehlgeschlagen. Schriftliches Original bleibt zugänglich.");
   }};
   local.speak(utter);
  };
  speak(from);
 }
 const sourceLine=(line:P59Line,key:string)=><div key={key} className="p59-performance__source">
  <small>{line.speaker}</small>
  <p lang="ja">{line.japanese}</p>
  <button type="button" aria-expanded={meaning.includes(key)} onClick={()=>translate(key)}>
   {meaning.includes(key)?"Deutsche Bedeutung verbergen":"Deutsch bei Bedarf anzeigen"}</button>
  {meaning.includes(key)?<p>{line.german}</p>:null}
 </div>;
 return <section className="p59-performance" aria-label="Unabhängige A2-Performance-Missionen">
  <h4>A2 · 35 selbstständige praktische Japanischmissionen</h4>
  <p>Mehrere originale schriftliche Quellen und echte unterschiedliche Sprecherrollen
   zu einer begründeten Entscheidung und eigenen Nachricht verbinden.
   Die Hilfe wird in vier Stufen reduziert; Aufgaben sind <strong>keine
   automatisch zertifizierten Prüfungen</strong>. Keine zweite Lernhistorie,
   keine Speicherung privater Rohentwürfe.</p>
  <label htmlFor="p59-search">Originalmission suchen</label>
  <input id="p59-search" type="search" placeholder="z. B. 変更, 出典, 予約" value={query}
   onChange={value=>{setQuery(value.target.value);setLimit(20)}}/>
  <div className="p59-performance__layout">
   <nav className="p59-performance__catalog" aria-label="P59 Missionsverzeichnis">
    <p>{matches.length} von {missions.length} · 4 Stufen</p>
    {matches.slice(0,limit).map(m=><button key={m.id} type="button"
     aria-current={m.id===current.id?"page":undefined} onClick={()=>reset(m.id)}>
     <small>A2 · Stufe {p59Stage(m.id).number}/4</small>
     <strong lang="ja">{missions.indexOf(m)+1}. {m.title}</strong>
     <small>{m.genre}</small>
    </button>)}
    {matches.length>limit?<button type="button" onClick={()=>setLimit(c=>c+20)}>
     Weitere Missionen</button>:null}
    {matches.length===0?<p>Keine passende Mission.</p>:null}
   </nav>
   <article className="p59-performance__workspace">
    <header>
     <small>A2 · Stufe {stage.number}/4 · {registerText[current.register]}</small>
     <h5 lang="ja">{current.title}</h5>
     <p><strong>Situation:</strong> {current.situation}</p>
     <p><strong>Ziel:</strong> {current.goal}</p>
     <p><strong>Unterstützungsgrad:</strong> {stage.assistance}</p>
    </header>
    <section>
     <h5>1 · Drei zusammenhängende Originalinformationen verstehen</h5>
     <p>{stage.number>=3?"Später Abschnitt: Du entscheidest selbst, wann du die Quellen benötigst.":
      "Lies die längeren Quellen zuerst und decke die Bedeutungen nur bei Bedarf auf."}</p>
     <button type="button" aria-expanded={openedSources||stage.number<=2}
      onClick={()=>setOpenedSources(v=>!v)}>
      {openedSources||stage.number<=2?"Schriftliche Quellen einklappen":"Originalquellen eigenständig öffnen"}</button>
     {openedSources||stage.number<=2?<div className="p59-performance__sources">
      {current.source.map((line,i)=>sourceLine(line,"source"+i))}
     </div>:null}
     <h5>2 · Zwei zugehörige Nachrichten</h5>
     {current.messages.map((line,i)=>sourceLine(line,"message"+i))}
    </section>
    <section>
     <h5>3 · Vier gesprochene Gesprächszüge</h5>
     <p>Optionale synthetische Geräte-TTS mit Sprecherrollen. Die Stimme muss
       nicht jedem tatsächlichen Sprecher entsprechen. Das vollständige Skript
       ist abrufbar, aber eine sichtbare Textantwort misst keine Hörleistung.</p>
     <div className="p59-performance__actions">
      <button type="button" onClick={()=>play(0)}>Alle vier japanischen Züge hören</button>
      <button type="button" disabled={!ttsPlaying} onClick={stop}>Wiedergabe stoppen</button>
      <button type="button" aria-expanded={transcript} onClick={()=>setTranscript(v=>!v)}>
       {transcript?"Transkript verbergen":"Japanisches Transkript zeigen"}</button>
     </div>
     {ttsStatus?<p role="status">{ttsStatus}</p>:null}
     {transcript?<div className="p59-performance__sources">
      {current.dialogue.map((line,i)=><div key={i}>
       {sourceLine(line,"dialogue"+i)}
       <button type="button" onClick={()=>play(i)}>Ab diesem Sprecher hören</button>
      </div>)}
     </div>:null}
    </section>
    <section>
     <h5>4 · Unabhängig entscheiden, erklären und selbst schreiben</h5>
     <div className="p59-performance__actions" role="group" aria-label="P59 Praxisaufgabe wählen">
      {(["comprehension","strategy","writing","reply","revision"] as const).map(k=>
       <button type="button" key={k} aria-pressed={mode===k} onClick={()=>move(k)}>
        {{comprehension:"Belegfrage",strategy:"Strategie",writing:"Schreibauftrag",
         reply:"Neue Rückfrage",revision:"Fehlerreparatur"}[k]}</button>)}
     </div>
     {mode==="comprehension"?<div className="p59-performance__actions">
      {current.questions.map((v,i)=><button type="button" key={v.id}
       aria-pressed={question===i} onClick={()=>{
        setQuestion(i);setDraft("");setAttempt(false);setShowAnswer(false);
       }}>Frage {i+1} · {v.kind}</button>)}
     </div>:null}
     {mode==="reply"&&unexpected?<div className="p59-performance__incoming">
      <small>Neu eingetroffene Information · {current.reply.incomingSpeaker}</small>
      <p lang="ja">{current.reply.incomingJapanese}</p>
      <details><summary>Deutsche Bedeutung bei Bedarf</summary>
       {current.reply.incomingGerman}</details>
     </div>:null}
     {mode==="revision"?<div className="p59-performance__incoming">
      <small>Falscher Quellenbeitrag (eigens geschriebener Lehrtext)</small>
      <p lang="ja">{current.revision.flawed}</p>
     </div>:null}
     <p className="p59-performance__task">{selectedTask.situation}</p>
     <label htmlFor="p59-draft">Eigene zusammenhängende japanische Formulierung</label>
     <textarea id="p59-draft" lang="ja" rows={5} value={draft}
      onChange={e=>{setDraft(e.target.value);setAttempt(false);setShowAnswer(false)}}
      aria-keyshortcuts="Control+Enter Meta+Enter"
      onKeyDown={e=>{if(!e.nativeEvent.isComposing&&(e.metaKey||e.ctrlKey)&&e.key==="Enter"
       &&draft.trim()){e.preventDefault();setAttempt(true)}}}/>
     <div className="p59-performance__actions">
      <button type="button" disabled={!draft.trim()} onClick={()=>setAttempt(true)}>
       Eigene Antwort mit verfassten Varianten vergleichen
      </button>
      <button type="button" disabled={disabled} onClick={()=>onPractice(current.id,
       mode==="comprehension"?"comprehension":mode==="strategy"?"strategy":
       mode==="writing"?"writing":mode==="reply"?"reply":"revision")}>
       Im nativen StudyPlayer unabhängig üben</button>
     </div>
     {comparison?<div role="status" className="p59-performance__feedback">
      <strong>{comparison.kind==="model"?"Eines der Modelle getroffen":
       comparison.kind==="specific-error"?"Konkretes Missverständnis":"Nicht semantisch bewertet"}</strong>
      <p>{comparison.message}</p><p>{selectedTask.explanation}</p>
      {mode==="comprehension"?<details><summary>Zwei unabhängige japanische Quellenbelege</summary>
       <p lang="ja">「{q.sourceQuote}」</p><p lang="ja">「{q.dialogueQuote}」</p>
      </details>:null}
      <button type="button" aria-expanded={showAnswer} onClick={()=>setShowAnswer(v=>!v)}>
       {showAnswer?"Originalmodelle ausblenden":"Originalmodelle erst jetzt öffnen"}</button>
      {showAnswer?<div>
       <p lang="ja">{selectedTask.model}</p><p lang="ja">{selectedTask.alternative}</p>
       <p><strong>Typischer Fehlschluss:</strong> <span lang="ja">{selectedTask.misleading}</span></p>
       <small>Diese Muster sind keine vollständige Bewertung anderer natürlicher japanischer Sätze.</small>
      </div>:null}
     </div>:null}
     <p><strong>Übertragbarer Bedeutungsunterschied:</strong> {current.contrast}</p>
     <button type="button" onClick={()=>onWriting(current.id)}>
      Im ursprünglichen Learn-Schreibeditor eigenständig entwerfen und revidieren</button>
    </section>
    <section>
     <h5>5 · Frühere originale Lernquellen zum eigenständigen Nacharbeiten</h5>
     <p>Verwandte original P49/P54/P55/P56/P57/P58-Lernfälle sind eigenständige
       Situationen, keine erfundenen Belege dieses Ereignisses.</p>
     <button type="button" aria-expanded={related} onClick={()=>setRelated(v=>!v)}>
      {related?"Übungsquellen verbergen":"Verwandte originale Übungen öffnen"}</button>
     {related?<div className="p59-performance__actions">
      {(["integrated","writing","interaction","listening","reading","document"] as const)
       .map((k)=>{
        const item=sources[k];
        return item?<button type="button" key={k} disabled={disabled}
         onClick={()=>onRelated(current.id,k)}>{{
          integrated:"P58 Mehrquellen",writing:"P57 Schreiben",interaction:"P56 Gespräch",
          listening:"P55 Hören",reading:"P54 Lesen",document:"P49 Dokument"}[k]}: {item.title}</button>:null;
       })}
     </div>:null}
     <p>{words.length} P53-Originalwortverweise; {words.filter(w=>w.attested).length}
      genaue Wortformen sind im eigenständigen P59-Originaltext belegt.</p>
     <button type="button" aria-expanded={vocab} onClick={()=>setVocab(v=>!v)}>
      {vocab?"Wortfamilien ausblenden":"Kollokationen und Wortfamilien öffnen"}</button>
     {vocab?<div className="p59-performance__words">{words.map(w=><div key={w.id}>
      <strong lang="ja">{w.written}（{w.reading}）</strong> · {w.meaning}
      <small>{w.attested?"Wörtlich in P59 belegt":"Thematisch, nicht wörtlich belegt"}</small>
      <p lang="ja">{w.collocations.join(" ／ ")}</p><p>{w.nuance}</p>
      {w.families.slice(0,1).map(f=><p key={f.id}>{f.explanation}</p>)}
     </div>)}</div>:null}
    </section>
    <section>
     <h5>6 · Neuer ungesehener unabhängiger Kontext nach Lernabstand</h5>
     <p>Die spätere Quelle und Musterantwort bleiben in Learn unsichtbar.
      Erst eine tatsächlich fällige Erstkarte oder mindestens 24 Stunden
      seit einem original unabhängig bewerteten Verständnis-StudyEvent erlaubt
      die erstmalige Transferaufgabe. Eine Freigabe ist keine erfundene
      Fälligkeit, und das native FSRS bleibt alleiniger Zeitplan.</p>
     <button type="button" disabled={disabled||!recallReadyIds.includes(current.id)}
      onClick={()=>onPractice(current.id,"return")}>Neuen unabhängigen Fall beantworten</button>
     {!recallReadyIds.includes(current.id)?<small>Zunächst eine Originalquellenfrage
       im nativen StudyPlayer bearbeiten und Lernabstand abwarten.</small>:null}
    </section>
    <small>THIEPN-originales Quellenmaterial. Marugoto bleibt reine Referenz.
     Nicht: offizielle A2-Bestätigung, echte Audioaufnahme, automatisierte
     freie Japanischbewertung oder persistente private Textsammlung.</small>
   </article>
  </div>
 </section>;
}
