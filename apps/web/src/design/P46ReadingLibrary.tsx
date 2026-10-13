import {useState} from "react";
import type {P46Reading} from "../study/reading46";
import {p46AuthoredComparison} from "../study/reading46";

type ReadingPractice="comprehension"|"vocabulary"|"writing"|"return";
/** First-party reading view within Learn. It is a teaching surface, not
 * a second scheduler or semantic scorer. All draft answers stay local React state. */
export function P46ReadingLibrary({readings,preferredId,disabled,onPractice,onWriting}:{
 readings:readonly P46Reading[];preferredId?:string;disabled:boolean;
 onPractice:(readingId:string,kind:ReadingPractice)=>void;
 onWriting:(readingId:string)=>void;
}){
 const [selectedId,setSelectedId]=useState("");
 const [level,setLevel]=useState<"all"|"A1"|"A2">("all");
 const [search,setSearch]=useState("");
 const [questionIndex,setQuestionIndex]=useState(0);
 const [draft,setDraft]=useState("");
 const [compared,setCompared]=useState(false);
 const [revealEvidence,setRevealEvidence]=useState(false);
 const [revealVocab,setRevealVocab]=useState(false);
 const active=readings.find(r=>r.id===selectedId)??
   readings.find(r=>r.id===preferredId)??readings[0];
 if(!active)return null;
 const filtered=readings.filter(r=>
   (level==="all"||r.level===level)&&
   (!search.trim()||(r.title+" "+r.genre+" "+r.purpose+" "+r.paragraphs.join(" "))
     .toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())));
 const question=active.questions[questionIndex];
 const comparison=compared&&question?p46AuthoredComparison(draft,
   [question.model,question.alternative],question.misconception,question.why):null;
 const choose=(id:string)=>{
   setSelectedId(id);setQuestionIndex(0);setDraft("");
   setCompared(false);setRevealEvidence(false);setRevealVocab(false);
 };
 const nextQuestion=()=>{
   setQuestionIndex(n=>Math.min(active.questions.length-1,n+1));
   setDraft("");setCompared(false);setRevealEvidence(false);
 };
 return <section className="p27-journey__p46" aria-label="Japanische Lesebibliothek">
   <h4>Originaltexte verstehen – vom Alltag zur A2-Lesepraxis</h4>
   <p>30 eigene japanische Lesetexte. Beginne mit A1-Nachrichten und kurzen Regeln,
     und lies später längere Berichte, Interviews, Geschichten und Hinweise.
     Wörtliche Informationen, Schlussfolgerungen und Textabsichten sind
     voneinander getrennte Lernziele.</p>
   <div className="p27-journey__p46-filters">
     <label htmlFor="p46-level">Schwierigkeit</label>
     <select id="p46-level" value={level} onChange={e=>
       setLevel(e.target.value as "all"|"A1"|"A2")}>
       <option value="all">A1 und A2</option><option value="A1">A1</option>
       <option value="A2">A2</option>
     </select>
     <label htmlFor="p46-find">Titel oder Textinhalt suchen</label>
     <input id="p46-find" type="search" value={search}
       onChange={e=>setSearch(e.target.value)} placeholder="Lesetext suchen"/>
   </div>
   <div className="p27-journey__p46-layout">
    <nav className="p27-journey__p46-catalog" aria-label="Lesetexte">
     <p>{filtered.length} von {readings.length} Texten</p>
     {filtered.map((r,i)=><button key={r.id} type="button"
       aria-current={active.id===r.id?"page":undefined}
       onClick={()=>choose(r.id)}>
       <strong>{readings.indexOf(r)+1}. {r.title}</strong>
       <small>{r.level} · {r.genre}{r.id===preferredId?" · Lernfokus":""}</small>
     </button>)}
     {filtered.length===0?<p>Keine Texte für diese Suche.</p>:null}
    </nav>
    <article className="p27-journey__p46-reader" aria-labelledby="p46-reading-title">
      <header>
        <span>{active.level} · {active.genre}</span>
        <h5 id="p46-reading-title">{active.title}</h5>
        <p><strong>Lesekompetenz:</strong> {active.purpose}</p>
        <p>{active.setting}</p>
      </header>
      <div className="p27-journey__p46-passage" lang="ja">
        {active.paragraphs.map((p,i)=><p key={i}>{p}</p>)}
      </div>
      <details className="p27-journey__p46-context">
        <summary>Text- und Situationskontext erklären</summary>
        <p>{active.contextNote}</p>
      </details>
      <div className="p27-journey__p46-vocab">
        <button type="button" aria-expanded={revealVocab}
          onClick={()=>setRevealVocab(x=>!x)}>
          {revealVocab?"Wortschatzhilfen verbergen":"Vier Wortschatzhilfen einblenden"}
        </button>
        {revealVocab?<dl>{active.words.map(w=><div key={w.form}>
          <dt lang="ja">{w.form} <span>（{w.reading}）</span></dt>
          <dd>{w.meaning} · <span lang="ja">{w.inContext}</span></dd>
        </div>)}</dl>:null}
      </div>
      <div className="p27-journey__p46-questions">
        <h5>Lesen, belegen, erklären</h5>
        <div className="p27-journey__p46-steps" role="group" aria-label="Frage aus dem Lesetext">
          {active.questions.map((q,i)=><button key={q.id} type="button"
            aria-pressed={questionIndex===i} onClick={()=>{
              setQuestionIndex(i);setDraft("");setCompared(false);setRevealEvidence(false);
            }}>
            {i+1}. {q.kind==="detail"?"Textdetail":q.kind==="inference"?"Schlussfolgerung":"Textabsicht"}
          </button>)}
        </div>
        {question?<section aria-label="Japanische Leseantwort verfassen">
          <strong>Frage {questionIndex+1}</strong>
          <p>{question.question}</p>
          <label htmlFor="p46-answer">Deine eigene japanische Antwort</label>
          <textarea id="p46-answer" lang="ja" rows={3} value={draft}
            onChange={e=>{setDraft(e.target.value);setCompared(false);setRevealEvidence(false)}}/>
          <div className="p27-journey__actions">
            <button type="button" disabled={!draft.trim()} onClick={()=>setCompared(true)}>
              Mit Originalbeispielen vergleichen
            </button>
            <button type="button" disabled={disabled}
              onClick={()=>onPractice(active.id,"comprehension")}>
              Drei Fragen im StudyPlayer unabhängig beantworten
            </button>
          </div>
          {comparison?<div className="p27-journey__p46-feedback" role="status">
            <strong>{comparison.kind==="authored"?"Mit Originalbeispiel vergleichbar":
              comparison.kind==="misconception"?"Typisches Missverständnis":
              "Andere Formulierung – nicht automatisch bewertet"}</strong>
            <p>{comparison.message}</p>
            <p>{question.why}</p>
            <button type="button" onClick={()=>setRevealEvidence(x=>!x)}>
              {revealEvidence?"Beleg und Modelle ausblenden":"Passage, Beleg und Modellantworten zeigen"}
            </button>
            {revealEvidence?<div>
              <p><strong>Textbeleg:</strong> <span lang="ja">{question.evidence}</span></p>
              <p><strong>Erste Musterantwort:</strong> <span lang="ja">{question.model}</span></p>
              <p><strong>Weitere mögliche Antwort:</strong> <span lang="ja">{question.alternative}</span></p>
              <small>Ein anderer inhaltlich gleichwertiger japanischer Satz kann korrekt sein.
                Diese Unterrichtsansicht stellt keine automatische Sprachbewertung dar.</small>
            </div>:null}
            {questionIndex+1<active.questions.length?
              <button type="button" onClick={nextQuestion}>Nächste Frage</button>:null}
          </div>:null}
        </section>:null}
      </div>
      <section className="p27-journey__p46-writing">
        <h5>Gelesenes selbst formulieren</h5>
        <p>{active.writing.situation}</p>
        <div className="p27-journey__actions">
          <button type="button" onClick={()=>onWriting(active.id)}>
            Im bestehenden Schreibeditor entwerfen und überarbeiten
          </button>
          <button type="button" disabled={disabled} onClick={()=>
            onPractice(active.id,"writing")}>Unabhängig schreiben</button>
          <button type="button" disabled={disabled} onClick={()=>
            onPractice(active.id,"vocabulary")}>Wörter unabhängig abrufen</button>
        </div>
      </section>
      <section className="p27-journey__p46-transfer">
        <h5>Spätere Übertragung</h5>
        <p>Ein weiterer Auftrag verändert die Situation. Der volle Mustersatz
          wird hier nicht gezeigt; ein echter FSRS-Termin entsteht nur nach
          selbstständiger Bewertung im bestehenden StudyPlayer.</p>
        <button type="button" disabled={disabled} onClick={()=>
          onPractice(active.id,"return")}>Neue Situation freiwillig selbst beantworten</button>
      </section>
      <small>Lesen, Hilfeanzeigen und das lokale Antwortfeld sind unbewertet.
        Sie schreiben weder einen FSRS-Erfolg noch neue Lernkonten oder Rohantworten.</small>
    </article>
   </div>
 </section>;
}
