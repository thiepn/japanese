import {useState} from "react";
import type {P49Document,P49Genre} from "../study/documents49";
import {p49AuthoredComparison} from "../study/documents49";

type P49Kind="comprehension"|"vocabulary"|"writing"|"return";
const genreNames:Record<P49Genre,string>={
 menu:"Menü",notice:"Aushang",timetable:"Fahrplan",form:"Formular",
 ticket:"Ticket",invitation:"Einladung",message:"Nachricht",
 advertisement:"Anzeige",instructions:"Anleitung", "public-info":"Öffentliche Information"
};
export function P49DocumentLibrary({documents,preferredId,disabled,onPractice,onWriting}:{
 documents:readonly P49Document[];preferredId?:string;disabled:boolean;
 onPractice:(documentId:string,kind:P49Kind)=>void;
 onWriting:(documentId:string)=>void;
}){
 const [selectedId,setSelectedId]=useState("");
 const [level,setLevel]=useState<"all"|"A1"|"A2">("all");
 const [genre,setGenre]=useState<P49Genre|"all">("all");
 const [query,setQuery]=useState("");
 const [questionIndex,setQuestionIndex]=useState(0);
 const [answer,setAnswer]=useState("");
 const [attempted,setAttempted]=useState(false);
 const [showEvidence,setShowEvidence]=useState(false);
 const [showVocabulary,setShowVocabulary]=useState(false);
 const [showNote,setShowNote]=useState(false);
 const current=documents.find(d=>d.id===selectedId)??
   documents.find(d=>d.id===preferredId)??documents[0];
 if(!current)return null;
 const visible=documents.filter(d=>
   (level==="all"||d.level===level)&&(genre==="all"||d.genre===genre)&&
   (!query.trim()||[d.title,d.purpose,d.audience,d.issuer,...d.blocks]
     .join(" ").toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())));
 const question=current.questions[questionIndex];
 const comparison=attempted&&question?p49AuthoredComparison(answer,
   [question.model,question.alternative],question.trap,question.explanation):null;
 const resetQuestion=()=>{
   setAnswer("");setAttempted(false);setShowEvidence(false);
 };
 const selectDocument=(id:string)=>{
  setSelectedId(id);setQuestionIndex(0);resetQuestion();
  setShowVocabulary(false);setShowNote(false);
 };
 return <section className="p27-journey__p49" aria-label="Originale japanische Alltagsdokumente lesen">
  <h4>Alltagsdokumente lesen und richtig handeln</h4>
  <p>40 original verfasste A1–A2 Dokumente. Erkenne Art und Zweck,
    finde präzise Informationen, prüfe Bedingungen und Ausnahmen, und
    formuliere die passende eigene japanische Reaktion.</p>
  <div className="p27-journey__p49-filters">
    <label htmlFor="p49-level">Sprachniveau</label>
    <select id="p49-level" value={level} onChange={e=>
      setLevel(e.target.value as "all"|"A1"|"A2")}>
      <option value="all">A1 + A2</option><option value="A1">A1</option><option value="A2">A2</option>
    </select>
    <label htmlFor="p49-genre">Dokumentart</label>
    <select id="p49-genre" value={genre} onChange={e=>
      setGenre(e.target.value as P49Genre|"all")}>
      <option value="all">Alle Dokumente</option>
      {(Object.keys(genreNames) as P49Genre[]).map(k=>
        <option key={k} value={k}>{genreNames[k]}</option>)}
    </select>
    <label htmlFor="p49-search">Dokument suchen</label>
    <input id="p49-search" type="search" value={query}
      onChange={e=>setQuery(e.target.value)}
      placeholder="Titel, Inhalt, Institution oder Lernziel"/>
  </div>
  <div className="p27-journey__p49-layout">
    <nav className="p27-journey__p49-catalog" aria-label="40 originale Alltagsdokumente">
      <p>{visible.length} von {documents.length} Dokumenten</p>
      {visible.map(d=><button type="button" key={d.id}
        aria-current={d.id===current.id?"page":undefined}
        onClick={()=>selectDocument(d.id)}>
        <strong>{documents.indexOf(d)+1}. {d.title}</strong>
        <small>{d.level} · {genreNames[d.genre]}
          {d.id===preferredId?" · Lernfokus":""}</small>
      </button>)}
      {!visible.length?<p>Keine Dokumente für diese Filter.</p>:null}
    </nav>
    <article className="p27-journey__p49-workspace">
      <header>
        <small>{current.level} · {genreNames[current.genre]}</small>
        <h5>{current.title}</h5>
        <p><strong>Wer hat es verfasst?</strong> {current.issuer} · {current.audience}</p>
        <p><strong>Dein Leseziel:</strong> {current.purpose}</p>
      </header>
      <div className="p27-journey__p49-paper" role="document"
        aria-label={"Japanisches "+genreNames[current.genre]+": "+current.title}>
        <div className="p27-journey__p49-paper-head">
          <strong>{current.title}</strong>
          <small>{current.issuer}</small>
        </div>
        <div className="p27-journey__p49-blocks" lang="ja">
          {current.blocks.map((block,i)=><p key={i}>{block}</p>)}
        </div>
      </div>
      <div className="p27-journey__p49-tools">
        <button type="button" aria-expanded={showNote}
          onClick={()=>setShowNote(v=>!v)}>
          {showNote?"Dokumentenhinweis verbergen":"Dokumentart und typische Lesefalle erklären"}
        </button>
        {showNote?<p>{current.contextNote}</p>:null}
        <button type="button" aria-expanded={showVocabulary}
          onClick={()=>setShowVocabulary(v=>!v)}>
          {showVocabulary?"Wortschatzhilfen verbergen":"Zwei Dokumentwörter erklären"}
        </button>
        {showVocabulary?<dl>{current.terms.map((w,i)=><div key={w.form+":"+i}>
          <dt lang="ja">{w.form}（{w.reading}）</dt>
          <dd>{w.meaning} · <span lang="ja">{w.context}</span></dd>
        </div>)}</dl>:null}
      </div>
      <section className="p27-journey__p49-comprehension">
        <h5>Dokumentkompetenz – drei aufeinander aufbauende Fragen</h5>
        <div className="p27-journey__p49-steps" role="group" aria-label="Dokumentenfragen">
          {current.questions.map((q,i)=><button type="button" key={q.id}
            aria-pressed={questionIndex===i} onClick={()=>{
              setQuestionIndex(i);resetQuestion();
            }}>{i+1}. {q.kind==="locate"?"Information finden":
              q.kind==="condition"?"Bedingung prüfen":"Schluss folgern"}</button>)}
        </div>
        {question?<div>
          <p><strong>Frage {questionIndex+1}:</strong> {question.question}</p>
          <label htmlFor="p49-answer">Antwort selbst auf Japanisch schreiben</label>
          <textarea id="p49-answer" lang="ja" rows={3} value={answer}
            onChange={e=>{setAnswer(e.target.value);setAttempted(false);setShowEvidence(false)}}/>
          <div className="p27-journey__actions">
            <button type="button" disabled={!answer.trim()}
              onClick={()=>setAttempted(true)}>Mit originalen Beispielen vergleichen</button>
            <button type="button" disabled={disabled}
              onClick={()=>onPractice(current.id,"comprehension")}>
              Fragen im bestehenden StudyPlayer beantworten
            </button>
          </div>
          {comparison?<div className="p27-journey__p49-feedback" role="status">
            <strong>{comparison.kind==="example"?"Entspricht einem Antwortbeispiel":
              comparison.kind==="specific-error"?"Typisches Dokumentmissverständnis":
              "Andere Formulierung – keine automatische Sprachbewertung"}</strong>
            <p>{comparison.message}</p>
            <p>{question.explanation}</p>
            <button type="button" aria-expanded={showEvidence}
              onClick={()=>setShowEvidence(v=>!v)}>
              {showEvidence?"Textbeleg und Muster ausblenden":
                "Originalbeleg und japanische Muster erst jetzt zeigen"}
            </button>
            {showEvidence?<div>
              <p><strong>Beleg:</strong> <span lang="ja">「{question.evidence}」</span></p>
              <p><strong>Muster:</strong> <span lang="ja">{question.model}</span></p>
              <p><strong>Weitere mögliche Antwort:</strong> <span lang="ja">
                {question.alternative}</span></p>
              <small>Weitere inhaltlich richtige japanische Sätze können möglich sein,
                ohne einem der festen Beispiele zu entsprechen.</small>
            </div>:null}
            {questionIndex<current.questions.length-1?
              <button type="button" onClick={()=>{
                setQuestionIndex(n=>n+1);resetQuestion();
              }}>Nächste Dokumentfrage</button>:null}
          </div>:null}
        </div>:null}
      </section>
      <section className="p27-journey__p49-writing">
        <h5>Eine zweckmäßige Antwort selbst schreiben</h5>
        <p>{current.writing.instruction}</p>
        <div className="p27-journey__actions">
          <button type="button" onClick={()=>onWriting(current.id)}>
            Im bestehenden Schreiben-Editor entwerfen und überarbeiten
          </button>
          <button type="button" disabled={disabled}
            onClick={()=>onPractice(current.id,"writing")}>
            Unabhängig im StudyPlayer schreiben
          </button>
          <button type="button" disabled={disabled}
            onClick={()=>onPractice(current.id,"vocabulary")}>
            Kontextwörter aus dem Gedächtnis abrufen
          </button>
        </div>
      </section>
      <section className="p27-journey__p49-return">
        <h5>Später in einer neuen Situation handeln</h5>
        <p>Ein anderer praktischer Kontext mit neuen Angaben und ohne alten
          Dokumenttext. Erst die bestehende FSRS-Mechanik kann eine Wiederholung
          aufgrund einer tatsächlichen Lernantwort fällig machen.</p>
        <button type="button" disabled={disabled}
          onClick={()=>onPractice(current.id,"return")}>
          Neuen Kontext freiwillig selbst bearbeiten
        </button>
      </section>
      <small>Alle Dokumente sind fiktive originale Unterrichtsmaterialien,
        keine aktuellen Behördenregeln, rechtlichen Hinweise, Angebote oder Fahrpläne.
        Diese Lese- und Schreibhilfe speichert keine Rohantworten oder eigenen Noten.</small>
    </article>
  </div>
 </section>;
}
