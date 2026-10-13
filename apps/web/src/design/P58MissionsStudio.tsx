import {useEffect,useRef,useState} from "react";
import {p58Compare,p58Progression,p58RelatedSource,p58RelatedWords,
 type P58Mission,type P58PracticeKind} from "../study/missions58";
import "./p58-missions.css";
type Kind=Exclude<P58PracticeKind,"all">;
export function P58MissionsStudio({missions,preferredId,recallReadyIds,disabled,
 onPractice,onWriting,onRelated,onDirtyChange}:{
 missions:readonly P58Mission[];preferredId?:string;recallReadyIds:readonly string[];
 disabled:boolean;onPractice:(id:string,kind:Kind)=>void;
 onWriting:(id:string)=>void;onRelated:(id:string,kind:"reading"|"listening"|"writing"|"document"|"interaction"|"conversation"|"independence")=>void;
 onDirtyChange?:(dirty:boolean)=>void;
}){
 const [selected,setSelected]=useState("");
 const [search,setSearch]=useState("");
 const [limit,setLimit]=useState(20);
 const [german,setGerman]=useState<string[]>([]);
 const [showSpoken,setShowSpoken]=useState(false);
 const [focus,setFocus]=useState<"question"|"choice"|"write"|"reply"|"repair">("question");
 const [questionIndex,setQuestionIndex]=useState(0);
 const [draft,setDraft]=useState("");
 // Ephemeral visibility only: never send or persist actual Japanese draft text.
 useEffect(()=>{onDirtyChange?.(Boolean(draft.trim()));return ()=>onDirtyChange?.(false);},
  [draft,onDirtyChange]);
 const [attempted,setAttempted]=useState(false);
 const [models,setModels]=useState(false);
 const [voiceMessage,setVoiceMessage]=useState("");
 const [voiceActive,setVoiceActive]=useState(false);
 const [relatedOpen,setRelatedOpen]=useState(false);
 const [vocabOpen,setVocabOpen]=useState(false);
 const [replyOpen,setReplyOpen]=useState(false);
 const speechToken=useRef(0);
 const current=missions.find(m=>m.id===selected)??missions.find(m=>m.id===preferredId)??missions[0];
 const stop=()=>{speechToken.current++;
  if(typeof window!=="undefined"&&"speechSynthesis" in window)window.speechSynthesis.cancel();
  setVoiceActive(false);
 };
 useEffect(()=>()=>{speechToken.current++;
  if(typeof window!=="undefined"&&"speechSynthesis" in window)window.speechSynthesis.cancel();
 },[]);
 useEffect(()=>{
  speechToken.current++;
  if(typeof window!=="undefined"&&"speechSynthesis" in window)window.speechSynthesis.cancel();
  setVoiceActive(false);
 },[current?.id]);
 if(!current)return null;
 const available=missions.filter(m=>
  [m.title,m.setting,m.goal,m.notice.japanese,m.message.japanese,
    ...m.spoken.map(t=>t.japanese)].join(" ").toLocaleLowerCase()
   .includes(search.trim().toLocaleLowerCase()));
 const q=current.questions[questionIndex]??current.questions[0]!;
 const task=focus==="question"?{situation:q.question,model:q.model,
   alternative:q.alternative,misleading:q.misleading,why:q.why}:
  focus==="choice"?{situation:current.choice.question,model:current.choice.valid,
   alternative:current.choice.alternative,misleading:current.choice.misleading,why:current.choice.why}:
  focus==="write"?current.write:focus==="repair"?current.repair:
   {situation:current.reply.goal,model:current.reply.model,alternative:current.reply.alternative,
    misleading:current.reply.misleading,why:current.reply.why};
 const feedback=attempted?p58Compare(draft,[task.model,task.alternative],task.misleading,task.why):null;
 const related=p58RelatedSource(current),words=p58RelatedWords(current),stage=p58Progression(current.id);
 const toggleGerman=(id:string)=>setGerman(old=>old.includes(id)?old.filter(a=>a!==id):[...old,id]);
 function allowDiscard():boolean{
  if(!draft.trim())return true;
  return typeof window!=="undefined"&&window.confirm(
   "Eine noch nicht abgeschlossene japanische Antwort würde beim Wechsel verworfen. Diese Eingabe wurde nicht gespeichert. Trotzdem wechseln?");
 }
 function reset(){
  stop();setGerman([]);setShowSpoken(false);setFocus("question");setQuestionIndex(0);
  setDraft("");setAttempted(false);setModels(false);setVoiceMessage("");
  setRelatedOpen(false);setVocabOpen(false);setReplyOpen(false);
 }
 function choose(id:string){if(id!==current.id&&!allowDiscard())return;reset();setSelected(id);}
 function setTask(key:typeof focus){
  if(key!==focus&&!allowDiscard())return;
  setFocus(key);setDraft("");setAttempted(false);setModels(false);
  if(key==="reply")setReplyOpen(true);
 }
 function speak(start=0){
  if(typeof window==="undefined"||!("speechSynthesis" in window)||
    typeof SpeechSynthesisUtterance==="undefined"){
    setVoiceMessage("Keine Geräte-TTS verfügbar. Das japanische Skript bleibt zugänglich.");return;
  }
  stop();setVoiceMessage("");
  const synth=window.speechSynthesis,voice=synth.getVoices().find(v=>v.lang.toLowerCase().startsWith("ja"));
  if(!voice)setVoiceMessage("Keine japanische Geräte-Stimme erkannt. Die Aussprache kann abweichen.");
  const token=speechToken.current;
  setVoiceActive(true);
  const say=(i:number)=>{
   if(token!==speechToken.current)return;
   if(i>=current.spoken.length){setVoiceActive(false);return;}
   const u=new SpeechSynthesisUtterance(current.spoken[i]!.japanese);
   u.lang="ja-JP";u.rate=.86;if(voice)u.voice=voice;
   u.onend=()=>{if(token===speechToken.current)say(i+1)};
   u.onerror=()=>{if(token===speechToken.current){
    setVoiceActive(false);setVoiceMessage("Geräte-TTS ist fehlgeschlagen; lies das Originalskript.");
   }};
   synth.speak(u);
  };
  say(start);
 }
 const compare=()=>{if(draft.trim())setAttempted(true);};
 return <section className="p58-missions" aria-label="A2 übergreifende praktische Japanischmissionen">
  <h4>Integrierte A2-Praxis · Lesen, Hören, Schreiben und reagieren</h4>
  <p>35 original verfasste selbstständige Alltagssituationen.
   Vergleiche eine praktische schriftliche Bekanntmachung, eine Nachricht und
   zwei mündliche Aussagen. Eine spätere Aussage kann den Stand ändern.
   Geräte-TTS ist optional und keine aufgezeichnete Stimme.
   Antworten bleiben hier unbenotet und werden nicht gespeichert.</p>
  <label htmlFor="p58-search">Originalmission suchen</label>
  <input id="p58-search" type="search" value={search} placeholder="z. B. 変更, 予約, 確認"
   onChange={e=>{setSearch(e.target.value);setLimit(20)}}/>
  <div className="p58-missions__layout">
   <nav className="p58-missions__catalog" aria-label="P58 Missionsauswahl">
    <p>{available.length} von {missions.length} Missionen</p>
    {available.slice(0,limit).map(m=><button type="button" key={m.id}
     aria-current={m.id===current.id?"page":undefined} onClick={()=>choose(m.id)}>
     <strong lang="ja">{missions.indexOf(m)+1}. {m.title}</strong>
     <small>{m.goal}</small>
    </button>)}
    {available.length>limit?<button type="button" onClick={()=>setLimit(v=>v+20)}>
      Weitere Missionen</button>:null}
    {!available.length?<p>Keine entsprechende Mission.</p>:null}
   </nav>
   <article className="p58-missions__workspace">
    <header>
     <small>A2 · Stufe {stage.stage}/4</small>
     <h5 lang="ja">{current.title}</h5>
     <p><strong>Situation:</strong> {current.setting}</p>
     <p><strong>Ziel:</strong> {current.goal}</p>
     <p><strong>Lernschwerpunkt:</strong> {stage.focus}</p>
    </header>
    <section>
     <h5>1 · Die ursprüngliche schriftliche Information</h5>
     <div className="p58-missions__source">
      <small>{current.notice.speaker}</small><p lang="ja">{current.notice.japanese}</p>
      <button type="button" aria-expanded={german.includes("notice")} onClick={()=>toggleGerman("notice")}>
       {german.includes("notice")?"Deutsch verbergen":"Deutsch anzeigen"}</button>
      {german.includes("notice")?<p lang="de">{current.notice.german}</p>:null}
     </div>
     <h5>2 · Neue schriftliche Nachricht</h5>
     <div className="p58-missions__source">
      <small>{current.message.speaker}</small><p lang="ja">{current.message.japanese}</p>
      <button type="button" aria-expanded={german.includes("message")} onClick={()=>toggleGerman("message")}>
       {german.includes("message")?"Deutsch verbergen":"Deutsch anzeigen"}</button>
      {german.includes("message")?<p lang="de">{current.message.german}</p>:null}
     </div>
    </section>
    <section>
     <h5>3 · Zwei neue gesprochene Angaben</h5>
     <p>Höre zuerst über Geräte-TTS. Es kann beide Sprecher mit derselben
      synthetischen Stimme vorlesen. Wenn Audio fehlt, nutze das nachlesbare Skript.</p>
     <div className="p58-missions__actions">
      <button type="button" onClick={()=>speak(0)}>Beide Sprechzüge hören</button>
      <button type="button" onClick={stop} disabled={!voiceActive}>Stopp</button>
      <button type="button" aria-expanded={showSpoken} onClick={()=>setShowSpoken(x=>!x)}>
       {showSpoken?"Skript verbergen":"Japanische Sprechertexte anzeigen"}</button>
     </div>
     {voiceMessage?<p role="status">{voiceMessage}</p>:null}
     {showSpoken?<div className="p58-missions__spoken">
      {current.spoken.map((t,i)=><div key={i}>
       <small>Sprechzug {i+1} · {t.speaker}</small>
       <p lang="ja">{t.japanese}</p>
       <div className="p58-missions__actions">
        <button type="button" onClick={()=>speak(i)}>Ab dieser Zeile hören</button>
        <button type="button" aria-expanded={german.includes("voice"+i)}
         onClick={()=>toggleGerman("voice"+i)}>
         {german.includes("voice"+i)?"Deutsch verbergen":"Bedeutung zeigen"}</button>
       </div>
       {german.includes("voice"+i)?<p lang="de">{t.german}</p>:null}
      </div>)}
     </div>:null}
    </section>
    <section>
     <h5>4 · Quellenbasierte Antwort und pragmatische Entscheidung</h5>
     <div className="p58-missions__actions" role="group" aria-label="P58 Übungsmodus">
      <button type="button" aria-pressed={focus==="question"} onClick={()=>setTask("question")}>Verstehen</button>
      <button type="button" aria-pressed={focus==="choice"} onClick={()=>setTask("choice")}>Entscheiden</button>
      <button type="button" aria-pressed={focus==="write"} onClick={()=>setTask("write")}>Selbst schreiben</button>
      <button type="button" aria-pressed={focus==="reply"} onClick={()=>setTask("reply")}>Auf Änderung reagieren</button>
      <button type="button" aria-pressed={focus==="repair"} onClick={()=>setTask("repair")}>Fehler korrigieren</button>
     </div>
     {focus==="question"?<div className="p58-missions__actions">
      {current.questions.map((question,i)=><button key={question.id} type="button"
       aria-pressed={questionIndex===i} onClick={()=>{
        if(i!==questionIndex&&!allowDiscard())return;
        setQuestionIndex(i);setDraft("");setAttempted(false);setModels(false);
       }}>Frage {i+1} · {question.kind}</button>)}
     </div>:null}
     {focus==="reply"&&replyOpen?<div className="p58-missions__source">
      <small>Neue unerwartete Aussage</small><p lang="ja">{current.reply.incoming}</p>
      <details><summary>Deutsche Bedeutung</summary>{current.reply.incomingGerman}</details>
     </div>:null}
     <p className="p58-missions__question">{task.situation}</p>
     <label htmlFor="p58-draft">Deine eigene vollständige japanische Antwort</label>
     <textarea id="p58-draft" rows={4} lang="ja" value={draft}
      onChange={e=>{setDraft(e.target.value);setAttempted(false);setModels(false)}}
      aria-keyshortcuts="Control+Enter Meta+Enter"
      onKeyDown={e=>{if(!e.nativeEvent.isComposing&&(e.ctrlKey||e.metaKey)&&e.key==="Enter"){
       e.preventDefault();compare();
      }}}/>
     <div className="p58-missions__actions">
      <button type="button" disabled={!draft.trim()} onClick={compare}>Nach eigenem Versuch vergleichen</button>
      <button type="button" disabled={disabled}
       onClick={()=>onPractice(current.id,focus==="question"?"comprehension":
        focus==="choice"?"choice":focus==="write"?"writing":focus)}>
       Im ursprünglichen StudyPlayer üben</button>
     </div>
     {feedback?<div className="p58-missions__feedback" role="status">
      <strong>{feedback.kind==="model"?"Originalantwort getroffen":
       feedback.kind==="specific-error"?"Konkreter Fehlschluss":"Nicht semantisch bewertet"}</strong>
      <p>{feedback.message}</p><p>{task.why}</p>
      {focus==="question"?<p>Belege aus eigenen Quellen:
       <span lang="ja">「{q.evidenceA}」 「{q.evidenceB}」</span></p>:null}
      <button type="button" aria-expanded={models} onClick={()=>setModels(x=>!x)}>
       {models?"Muster verbergen":"Japanische Modelle erst jetzt zeigen"}</button>
      {models?<div><p lang="ja">{task.model}</p><p lang="ja">{task.alternative}</p>
       <p>Typischer Fehler: <span lang="ja">{task.misleading}</span></p>
      </div>:null}
     </div>:null}
     <p><strong>Pragmatischer Kontrast:</strong> {current.contrast}</p>
     <button type="button" onClick={()=>onWriting(current.id)}>
      Eigene Antwort im ursprünglichen mehrstufigen Learn-Editor überarbeiten</button>
    </section>
    <section>
     <h5>5 · Quellen- und Interaktionsübungen aus P43–P57</h5>
     <p>Diese früheren Texte und Gesprächsübungen sind ausdrücklich
       <strong> unabhängige Lernbeispiele</strong>, keine weiteren Meldungen
       desselben Ereignisses. Sie trainieren den Transfer ähnlicher Strukturen.</p>
     <button type="button" aria-expanded={relatedOpen} onClick={()=>setRelatedOpen(x=>!x)}>
      {relatedOpen?"Querverweise verbergen":"Passende Originalübungen aus älteren Phasen anzeigen"}</button>
     {relatedOpen?<div className="p58-missions__actions">
      {related.reading?<button type="button" disabled={disabled}
       onClick={()=>onRelated(current.id,"reading")}>P54 Lesen: {related.reading.title}</button>:null}
      {related.listening?<button type="button" disabled={disabled}
       onClick={()=>onRelated(current.id,"listening")}>P55 Hören: {related.listening.title}</button>:null}
      {related.writing?<button type="button" disabled={disabled}
       onClick={()=>onRelated(current.id,"writing")}>P57 Schreiben: {related.writing.title}</button>:null}
      {related.document?<button type="button" disabled={disabled}
       onClick={()=>onRelated(current.id,"document")}>P49 Dokument: {related.document.title}</button>:null}
      {related.interaction?<button type="button" disabled={disabled}
       onClick={()=>onRelated(current.id,"interaction")}>P56 Gespräch: {related.interaction.title}</button>:null}
      {related.conversation?<button type="button" disabled={disabled}
       onClick={()=>onRelated(current.id,"conversation")}>P43 Dialog: {related.conversation.title}</button>:null}
      {related.independence?<button type="button" disabled={disabled}
       onClick={()=>onRelated(current.id,"independence")}>P45 Eigenständig: {related.independence.title}</button>:null}
     </div>:null}
     <p>{words.length} P53-Wortverweise, davon {words.filter(w=>w.attested).length}
       wörtlich in den neuen Originalquellen belegt.</p>
     <button type="button" aria-expanded={vocabOpen} onClick={()=>setVocabOpen(x=>!x)}>
      {vocabOpen?"Wortfamilien schließen":"Wortfamilien und Kollokationen öffnen"}</button>
     {vocabOpen?<div className="p58-missions__words">
      {words.map(w=><div key={w.id}>
       <strong lang="ja">{w.written}（{w.reading}）</strong> · {w.meaning}
       <small>{w.attested?"Wörtlich belegt":"Nur thematisch verknüpft"}</small>
       <p lang="ja">{w.collocations.join(" ／ ")}</p><p>{w.nuance}</p>
       {w.families.slice(0,1).map(f=><p key={f.id}>{f.explanation}</p>)}
      </div>)}
     </div>:null}
    </section>
    <section>
     <h5>6 · Wirklich neuer späterer Alltagstransfer</h5>
     <p>Der neue Fall bleibt verborgen bis ein ursprünglicher bewerteter
      Verständnisversuch tatsächlich fällig ist oder mindestens 24 Stunden
      zurückliegt. Der native Scheduler bestimmt unabhängig echte Fälligkeit.</p>
     <button type="button" disabled={disabled||!recallReadyIds.includes(current.id)}
      onClick={()=>onPractice(current.id,"return")}>Ungesehenen anderen Kontext bearbeiten</button>
     {!recallReadyIds.includes(current.id)?<small>Erst ursprüngliche Frage im StudyPlayer beantworten.</small>:null}
    </section>
    <small>Eigenständig verfasste THIEPN-Originaltexte. Marugoto ausschließlich als Referenz.
     Keine Audioaufnahme, keine gemessene Hörleistung, keine semantische
     Freitextprüfung und keine zusätzlichen persönlichen Datenbanken.</small>
   </article>
  </div>
 </section>;
}
