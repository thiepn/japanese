import {useState} from "react";
import {p57AuthoredComparison,p57Progression,p57RelatedWords,
 type P57Thread,type P57Genre,type P57PracticeKind} from "../study/writing57";
import "./p57-writing.css";
type Kind=Exclude<P57PracticeKind,"all">;
const genres:Record<P57Genre,string>={
 email:"E-Mail",chat:"Kurznachrichten",notice:"Öffentlicher Hinweis",
 request:"Anfrage",followup:"Nachfrage",work:"Beruflicher Austausch",community:"Organisation"
};
const questions={status:"Bestätigungsstatus",chronology:"Zeitfolge",speaker:"Sprecher",
 evidence:"Textbeleg",reason:"Ursache"} as const;
/** Read-only P57 message workbook. Existing Learn is the only ungraded revision journal. */
export function P57WritingStudio({threads,preferredId,recallReadyIds,disabled,onPractice,onWriting}:{
 threads:readonly P57Thread[];preferredId?:string;recallReadyIds:readonly string[];
 disabled:boolean;onPractice:(id:string,kind:Kind)=>void;onWriting:(id:string)=>void;
}){
 const [selected,setSelected]=useState("");
 const [genre,setGenre]=useState<P57Genre|"all">("all");
 const [search,setSearch]=useState("");
 const [visibleCount,setVisibleCount]=useState(21);
 const [german,setGerman]=useState<readonly number[]>([]);
 const [focus,setFocus]=useState<"question"|"compose"|"reply"|"revision">("question");
 const [questionIndex,setQuestionIndex]=useState(0);
 const [draft,setDraft]=useState("");
 const [attempted,setAttempted]=useState(false);
 const [showExamples,setShowExamples]=useState(false);
 const [followupOpen,setFollowupOpen]=useState(false);
 const [revisionOpen,setRevisionOpen]=useState(false);
 const [rewritten,setRewritten]=useState("");
 const [revisionAttempted,setRevisionAttempted]=useState(false);
 const [lexicalOpen,setLexicalOpen]=useState(false);
 const current=threads.find(t=>t.id===selected)??threads.find(t=>t.id===preferredId)??threads[0];
 if(!current)return null;
 const visible=threads.filter(t=>(genre==="all"||t.genre===genre)&&
  [t.title,t.setting,t.goal,t.contrast,...t.messages.map(m=>m.japanese)]
    .join(" ").toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()));
 const question=current.questions[questionIndex]??current.questions[0]!;
 const content=focus==="question"?{
  situation:question.question,model:question.model,alternative:question.alternate,
  misleading:question.misleading,why:question.why
 }:focus==="compose"?{
  situation:current.compose.situation,model:current.compose.model,
  alternative:current.compose.alternate,misleading:current.compose.misleading,
  why:current.compose.why
 }:focus==="reply"?{
  situation:current.reply.goal,model:current.reply.model,
  alternative:current.reply.alternate,misleading:current.reply.misleading,
  why:current.reply.why
 }:{
  situation:current.revision.instruction,model:current.revision.model,
  alternative:current.revision.alternate,misleading:current.revision.flawedDraft,
  why:current.revision.why
 };
 const feedback=attempted?p57AuthoredComparison(draft,[content.model,content.alternative],
  content.misleading,content.why):null;
 const rewrittenFeedback=revisionAttempted?p57AuthoredComparison(rewritten,
  [current.revision.model,current.revision.alternate],
  current.revision.flawedDraft,current.revision.why):null;
 const words=p57RelatedWords(current),stage=p57Progression(current.id);
 function reset(){
  setGerman([]);setFocus("question");setQuestionIndex(0);setDraft("");
  setAttempted(false);setShowExamples(false);setFollowupOpen(false);
  setRevisionOpen(false);setRewritten("");setRevisionAttempted(false);setLexicalOpen(false);
 }
 function move(next:"question"|"compose"|"reply"|"revision"){
  setFocus(next);setDraft("");setAttempted(false);setShowExamples(false);
 }
 function choose(id:string){setSelected(id);reset();}
 return <section className="p57-writing" aria-label="A2 funktionales Schreiben in verbundenen Nachrichten">
  <h4>A2 · Natürlich schreiben, antworten und Nachrichten überarbeiten</h4>
  <p>35 originale zusammenhängende Schriftwechsel mit wechselnden Informationen.
   Zuerst die Nachrichten lesen, dann selbst schreiben und erst anschließend
   verfasste Antworten vergleichen. Freies Japanisch wird hier nicht semantisch
   benotet; Entwürfe werden nur während dieser Ansicht gehalten.</p>
  <div className="p57-writing__filters">
   <label htmlFor="p57-genre">Textart</label>
   <select id="p57-genre" value={genre} onChange={e=>{
    setGenre(e.target.value as P57Genre|"all");setVisibleCount(21);
   }}>
    <option value="all">Alle Textarten</option>
    {([...new Set(threads.map(t=>t.genre))] as P57Genre[]).map(g=>
     <option key={g} value={g}>{genres[g]}</option>)}
   </select>
   <label htmlFor="p57-query">Titel, Situation oder Japanisch suchen</label>
   <input id="p57-query" type="search" value={search}
    onChange={e=>{setSearch(e.target.value);setVisibleCount(21)}}
    placeholder="z. B. 予約, 変更, 提出"/>
  </div>
  <div className="p57-writing__layout">
   <nav className="p57-writing__list" aria-label="P57 Originalnachrichten">
    <p>{visible.length} von {threads.length} Schriftwechseln</p>
    {visible.slice(0,visibleCount).map(t=><button key={t.id} type="button"
     aria-current={t.id===current.id?"page":undefined} onClick={()=>choose(t.id)}>
     <strong lang="ja">{threads.indexOf(t)+1}. {t.title}</strong>
     <small>{genres[t.genre]} · {t.messages.length} Nachrichten</small>
    </button>)}
    {visibleCount<visible.length?<button type="button" onClick={()=>setVisibleCount(n=>n+21)}>
     Weitere Texte anzeigen
    </button>:null}
    {!visible.length?<p>Keine Übereinstimmung gefunden.</p>:null}
   </nav>
   <article className="p57-writing__workspace">
    <header>
     <small>A2 · Stufe {stage.stage}/4 · {genres[current.genre]} · {current.register}</small>
     <h5 lang="ja">{current.title}</h5>
     <p><strong>Situation:</strong> {current.setting}</p>
     <p><strong>Schreibziel:</strong> {current.goal}</p>
     <p><strong>Progression:</strong> {stage.focus}</p>
    </header>
    <section>
     <h5>1 · Den gesamten Originalschriftwechsel lesen</h5>
     <div className="p57-writing__messages">
      {current.messages.map((m,i)=><div key={i}>
       <small>Nachricht {i+1} · {m.sender}</small>
       <p lang="ja">{m.japanese}</p>
       <button type="button" aria-expanded={german.includes(i)}
        onClick={()=>setGerman(old=>old.includes(i)?old.filter(n=>n!==i):[...old,i])}>
        {german.includes(i)?"Deutsche Bedeutung ausblenden":"Deutsche Bedeutung anzeigen"}
       </button>
       {german.includes(i)?<p lang="de" className="p57-writing__translation">{m.german}</p>:null}
      </div>)}
     </div>
     <p><strong>Zentrale Unterscheidung:</strong> {current.contrast}</p>
    </section>
    <section>
     <h5>2 · Textbelege und eigene Nachricht</h5>
     <div className="p57-writing__actions" role="group" aria-label="Unabhängige Übungsform wählen">
      <button type="button" aria-pressed={focus==="question"} onClick={()=>move("question")}>
       Text verstehen</button>
      <button type="button" aria-pressed={focus==="compose"} onClick={()=>move("compose")}>
       Neue Nachricht verfassen</button>
      <button type="button" aria-pressed={focus==="reply"} onClick={()=>{
       setFollowupOpen(true);move("reply");
      }}>Auf Folgeantwort reagieren</button>
      <button type="button" aria-pressed={focus==="revision"} onClick={()=>{
       setRevisionOpen(true);move("revision");
      }}>Nachricht korrigieren</button>
     </div>
     {focus==="question"?<div className="p57-writing__actions">
      {current.questions.map((q,i)=><button type="button" key={q.id}
       aria-pressed={questionIndex===i} onClick={()=>{
        setQuestionIndex(i);setDraft("");setAttempted(false);setShowExamples(false);
       }}>{i+1} · {questions[q.kind]}</button>)}
     </div>:null}
     {focus==="reply"&&followupOpen?<div className="p57-writing__incoming">
      <small>Neue Nachricht · andere Information</small>
      <p lang="ja">{current.reply.newMessage}</p>
      <details><summary>Deutsche Bedeutung</summary>{current.reply.newMessageGerman}</details>
     </div>:null}
     {focus==="revision"&&revisionOpen?<div className="p57-writing__incoming">
      <small>Fehlerhafter Originalentwurf (kein echter Nutzertext)</small>
      <p lang="ja">{current.revision.flawedDraft}</p>
     </div>:null}
     <p className="p57-writing__task">{content.situation}</p>
     <label htmlFor="p57-draft">Deine unabhängige japanische Antwort</label>
     <textarea id="p57-draft" lang="ja" rows={5} value={draft}
      onChange={e=>{setDraft(e.target.value);setAttempted(false);setShowExamples(false)}}
      aria-keyshortcuts="Control+Enter Meta+Enter"
      onKeyDown={e=>{if(!e.nativeEvent.isComposing&&(e.metaKey||e.ctrlKey)&&e.key==="Enter"&&draft.trim()){
       e.preventDefault();setAttempted(true);
      }}}/>
     <div className="p57-writing__actions">
      <button type="button" disabled={!draft.trim()} onClick={()=>setAttempted(true)}>
       Nach eigenem Versuch vergleichen
      </button>
      <button type="button" disabled={disabled} onClick={()=>onPractice(current.id,focus==="question"?
       "comprehension":focus==="compose"?"compose":focus==="reply"?"reply":"revision")}>
       Im bestehenden StudyPlayer unabhängig antworten
      </button>
     </div>
     {feedback?<div className="p57-writing__feedback" role="status">
      <strong>{feedback.kind==="example"?"Eines der Originalmodelle getroffen":
       feedback.kind==="specific-error"?"Gezieltes Missverständnis":"Nicht semantisch bewertet"}</strong>
      <p>{feedback.message}</p><p>{content.why}</p>
      {focus==="question"?<p><strong>Originalbeleg:</strong> <span lang="ja">{question.evidence}</span></p>:null}
      <button type="button" aria-expanded={showExamples} onClick={()=>setShowExamples(x=>!x)}>
       {showExamples?"Japanische Modelle verbergen":"Originalmodelle erst jetzt ansehen"}</button>
      {showExamples?<div><p lang="ja">{content.model}</p><p lang="ja">{content.alternative}</p>
       <p><strong>Typische falsche Aussage:</strong> <span lang="ja">{content.misleading}</span></p>
       <small>Gültige andere Paraphrasen sind möglich und bleiben unbewertet.</small>
      </div>:null}
     </div>:null}
    </section>
    <section>
     <h5>3 · Mehrstufig überarbeiten statt einfach kopieren</h5>
     <p>Formuliere zuerst deine eigene Nachricht oben. Danach eine zweite
      Fassung mit anderer Satzstruktur, passender Höflichkeit und korrektem
      Informationsstand. Diese Entwürfe werden nicht automatisch gespeichert.</p>
     <button type="button" aria-expanded={revisionOpen}
      onClick={()=>setRevisionOpen(x=>!x)}>
      {revisionOpen?"Vorgeschlagene Korrekturaufgabe verbergen":
       "Konkreten fehlerhaften Beispielentwurf anzeigen"}</button>
     {revisionOpen?<p lang="ja" className="p57-writing__incoming">{current.revision.flawedDraft}</p>:null}
     <label htmlFor="p57-rewrite">Zweite unabhängige Fassung</label>
     <textarea id="p57-rewrite" lang="ja" rows={5} value={rewritten}
      onChange={e=>{setRewritten(e.target.value);setRevisionAttempted(false)}}/>
     <div className="p57-writing__actions">
      <button type="button" disabled={!rewritten.trim()} onClick={()=>setRevisionAttempted(true)}>
       Überarbeitung reflektieren
      </button>
      <button type="button" onClick={()=>onWriting(current.id)}>
       Originalen mehrstufigen Learn-Schreibeditor verwenden
      </button>
     </div>
     {rewrittenFeedback?<div className="p57-writing__feedback" role="status">
      <p>{rewrittenFeedback.message}</p><p>{current.revision.why}</p>
      <small>Der vollständige Text wird hier nicht automatisch benotet.</small>
     </div>:null}
    </section>
    <section>
     <h5>4 · P53-Kontexte und Kollokationen</h5>
     <p>{words.length} referenzierte Originaleinträge, davon {words.filter(w=>w.attested).length}
      schriftlich in mindestens einer Nachricht belegt.</p>
     <button type="button" aria-expanded={lexicalOpen} onClick={()=>setLexicalOpen(x=>!x)}>
      {lexicalOpen?"Vokabular verbergen":"Wortfamilien und schriftliche Verwendungen"}</button>
     {lexicalOpen?<div className="p57-writing__words">
      {words.map(w=><div key={w.id}>
       <strong lang="ja">{w.written}（{w.reading}）</strong> · {w.meaning}
       <small>{w.attested?"Im Text belegt":"Thematischer Verweis"}</small>
       <p lang="ja">{w.collocations.join(" ／ ")}</p><p>{w.nuance}</p>
       {w.families.slice(0,1).map(f=><p key={f.id}>{f.explanation}</p>)}
      </div>)}
     </div>:null}
    </section>
    <section>
     <h5>5 · Später völlig neue Nachrichtensituation</h5>
     <p>Der eigenständige neue Kontext wird hier nicht angezeigt.
      Die Original-FSRS-Fälligkeit oder mindestens 24 Stunden nach einer
      tatsächlich bewerteten Quellfrage berechtigen zum ersten Transfer.
      Freigabe bedeutet noch keine fällige FSRS-Karte.</p>
     <button type="button" disabled={disabled||!recallReadyIds.includes(current.id)}
      onClick={()=>onPractice(current.id,"return")}>Neuen Kontext unabhängig schreiben</button>
     {!recallReadyIds.includes(current.id)?<small>Erst unabhängig im StudyPlayer
      üben, später zurückkehren.</small>:null}
    </section>
    <small>THIEPN-Originalmaterial; Marugoto nur Referenz. Keine E-Mails werden
     tatsächlich gesendet. Kein neuer Persistenz- oder Benotungsmechanismus.</small>
   </article>
  </div>
 </section>;
}
