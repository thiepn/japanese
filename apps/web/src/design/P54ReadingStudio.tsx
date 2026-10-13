import {useState} from "react";
import {p54AuthoredComparison,p54RelatedWords,p54Progression,type P54Genre,type P54Reading,type P54PracticeKind} from "../study/reading54";
import "./p54-reading.css";

type Kind=Exclude<P54PracticeKind,"all">;
const genres:Record<P54Genre,string>={
 message:"Nachricht",email:"E-Mail",notice:"Aushang",diary:"Tagebuch",
 story:"Erzählung",schedule:"Terminplan",article:"Sachtext",
 instructions:"Anleitung",conversation:"Gespräch",report:"Bericht"
};
const kinds={evidence:"Textbeleg",chronology:"Zeitfolge",cause:"Ursache",
 inference:"Schlussfolgerung",speaker:"Sprecherabsicht"} as const;

/** Read-only P54 reading surface. StudyPlayer owns every graded review. */
export function P54ReadingStudio({items,preferredId,recallReadyIds,disabled,onPractice,onWriting}:{
 items:readonly P54Reading[];preferredId?:string;recallReadyIds:readonly string[];
 disabled:boolean;onPractice:(id:string,kind:Kind)=>void;onWriting:(id:string)=>void;
}){
 const [selected,setSelected]=useState("");
 const [genre,setGenre]=useState<P54Genre|"all">("all");
 const [search,setSearch]=useState("");
 const [pageCount,setPageCount]=useState(20);
 const [questionIndex,setQuestionIndex]=useState(0);
 const [answer,setAnswer]=useState("");
 const [attempted,setAttempted]=useState(false);
 const [models,setModels]=useState(false);
 const [translations,setTranslations]=useState<readonly number[]>([]);
 const [vocabularyOpen,setVocabularyOpen]=useState(false);
 const [writingOpen,setWritingOpen]=useState(false);
 const item=items.find(r=>r.id===selected)??items.find(r=>r.id===preferredId)??items[0];
 if(!item)return null;
 const visible=items.filter(r=>(genre==="all"||r.genre===genre)&&
  [r.title,r.situation,r.purpose,r.genre,...r.paragraphs.map(p=>p.japanese)]
    .join(" ").toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()));
 const question=item.questions[questionIndex]??item.questions[0]!;
 const compare=attempted?p54AuthoredComparison(answer,
  [question.model,question.alternative],question.misconception,question.explanation):null;
 const words=p54RelatedWords(item);
 const progression=p54Progression(item.id);
 const attestedCount=words.filter(w=>w.attested).length;
 const reset=()=>{
  setQuestionIndex(0);setAnswer("");setAttempted(false);setModels(false);
  setTranslations([]);setVocabularyOpen(false);setWritingOpen(false);
 };
 function choose(id:string){setSelected(id);reset();}
 function changeQuestion(index:number){
  setQuestionIndex(index);setAnswer("");setAttempted(false);setModels(false);
 }
 return <section className="p54-reading" aria-label="Verbundene A2-Lesetexte und originaler Wortschatz">
  <h4>Verbundene A2-Lesetexte · Textbelege und eigene Antworten</h4>
  <p>Originale japanische Alltagsgeschichten und Mitteilungen mit echten
   Informationsunterschieden zwischen Absätzen. Die deutschen Absatzhilfen
   sind anfangs verborgen. Freie Eingaben hier sind unbenotet; FSRS verwendet
   ausschließlich die ursprünglichen StudyPlayer-Antworten.</p>
  <div className="p54-reading__filters">
   <label htmlFor="p54-genre">Textsorte</label>
   <select id="p54-genre" value={genre} onChange={e=>{
    setGenre(e.target.value as P54Genre|"all");setPageCount(20);
   }}>
    <option value="all">Alle Textsorten</option>
    {([...new Set(items.map(r=>r.genre))] as P54Genre[]).map(g=>
     <option key={g} value={g}>{genres[g]}</option>)}
   </select>
   <label htmlFor="p54-query">Text, Situation oder japanischen Begriff suchen</label>
   <input id="p54-query" type="search" value={search}
    onChange={e=>{setSearch(e.target.value);setPageCount(20)}}
    placeholder="z. B. 予約, 変更, 図書館"/>
  </div>
  <div className="p54-reading__layout">
   <nav className="p54-reading__list" aria-label="P54 Originaltexte">
    <p>{visible.length} von {items.length} Texten</p>
    {visible.slice(0,pageCount).map((r)=><button key={r.id} type="button"
      aria-current={r.id===item.id?"page":undefined} onClick={()=>choose(r.id)}>
      <strong lang="ja">{items.indexOf(r)+1}. {r.title}</strong>
      <small>{genres[r.genre]} · {r.paragraphs.length} Absätze</small>
    </button>)}
    {visible.length>pageCount?<button type="button" onClick={()=>setPageCount(n=>n+20)}>
      Weitere Texte anzeigen
    </button>:null}
    {!visible.length?<p>Kein passender Text gefunden.</p>:null}
   </nav>
   <article className="p54-reading__workspace">
    <header>
     <small>A2 · Stufe {progression.stage}/4 · {genres[item.genre]} · {items.indexOf(item)+1} / {items.length}</small>
     <p><strong>Progression:</strong> {progression.label} — {progression.focus}</p>
     <h5 lang="ja">{item.title}</h5>
     <p><strong>Situation:</strong> {item.situation}</p>
     <p><strong>Leseziel:</strong> {item.purpose}</p>
    </header>
    <section>
     <h5>1 · Zusammenhängenden Originaltext lesen</h5>
     <div className="p54-reading__paragraphs">
      {item.paragraphs.map((p,i)=><div key={i} className="p54-reading__paragraph">
       <small>Absatz {i+1}</small>
       <p lang="ja">{p.japanese}</p>
       <button type="button" aria-expanded={translations.includes(i)}
        onClick={()=>setTranslations(old=>old.includes(i)?old.filter(n=>n!==i):[...old,i])}>
        {translations.includes(i)?"Deutsche Hilfe verbergen":"Deutsche Absatzhilfe ansehen"}
       </button>
       {translations.includes(i)?<p className="p54-reading__translation" lang="de">{p.german}</p>:null}
      </div>)}
     </div>
     <p><strong>Grammatik im Text:</strong> <span lang="ja">{item.grammar}</span></p>
     <p><strong>Wichtige Unterscheidung:</strong> {item.contrast}</p>
    </section>
    <section>
     <h5>2 · Aus Textbelegen antworten</h5>
     <div className="p54-reading__questions" role="group" aria-label="Verständnisfrage auswählen">
      {item.questions.map((q,i)=><button type="button" key={q.id}
       aria-pressed={i===questionIndex} onClick={()=>changeQuestion(i)}>
       Frage {i+1} · {kinds[q.kind]}
      </button>)}
     </div>
     <p lang="ja" className="p54-reading__question">{question.question}</p>
     <label htmlFor="p54-answer">Japanische Antwort – zunächst ohne Textbeleg einblenden</label>
     <textarea id="p54-answer" rows={3} lang="ja" value={answer}
      onChange={e=>{setAnswer(e.target.value);setAttempted(false);setModels(false)}}
      onKeyDown={e=>{if(!e.nativeEvent.isComposing&&(e.ctrlKey||e.metaKey)&&e.key==="Enter"&&answer.trim()){
       e.preventDefault();setAttempted(true);
      }}} aria-keyshortcuts="Control+Enter Meta+Enter"/>
     <div className="p54-reading__actions">
      <button type="button" disabled={!answer.trim()} onClick={()=>setAttempted(true)}>
       Eigene Antwort mit Originalbeleg vergleichen
      </button>
      <button type="button" disabled={disabled}
       onClick={()=>onPractice(item.id,"comprehension")}>Unabhängig im StudyPlayer antworten</button>
     </div>
     {compare?<div role="status" className="p54-reading__feedback">
      <strong>{compare.kind==="original"?"Originalantwort getroffen":
       compare.kind==="specific-error"?"Spezifische Fehlannahme":"Nicht automatisch bewertet"}</strong>
      <p>{compare.message}</p>
      <p>{question.explanation}</p>
      <p><strong>Typische Fehlinterpretation:</strong> <span lang="ja">{question.misconception}</span></p>
      <button type="button" aria-expanded={models}
       onClick={()=>setModels(x=>!x)}>{models?"Textbeleg ausblenden":"Originalantworten und japanischen Textbeleg anzeigen"}</button>
      {models?<div className="p54-reading__models">
       <p lang="ja">{question.model}</p><p lang="ja">{question.alternative}</p>
       <blockquote lang="ja">{question.evidence}</blockquote>
       <small>Dieser begrenzte Originalmuster-Abgleich bewertet keine anderen korrekten Paraphrasen.</small>
      </div>:null}
     </div>:null}
    </section>
    <section>
     <h5>3 · P53-Wortgebrauch im Lesekontext</h5>
     <p>{words.length} verknüpfte Originaleinträge. Ein Wort wird nur dann als
      Textbeleg markiert, wenn seine schriftliche Form in einem Absatz vorkommt.</p>
     <button type="button" aria-expanded={vocabularyOpen}
      onClick={()=>setVocabularyOpen(v=>!v)}>{vocabularyOpen?"Wortkontexte verbergen":"P53-Wortfamilien öffnen"}</button>
     {vocabularyOpen?<div className="p54-reading__vocab">
      {words.map(w=><div key={w.id}>
       <strong lang="ja">{w.written}（{w.reading}）</strong> · {w.meaning}
       <small>{w.attested?"Im Text wörtlich belegt":"Thematisch verbundenes P53-Wort"}</small>
       <p lang="ja">{w.collocations.join(" ／ ")}</p>
       <p>{w.nuance}</p>
       {w.families.slice(0,2).map(f=><p key={f.id}>{f.explanation}</p>)}
      </div>)}
     </div>:null}
     <button type="button" disabled={disabled||attestedCount===0} onClick={()=>onPractice(item.id,"vocabulary")}>
      {attestedCount} im Text belegte P53-Wörter im StudyPlayer abrufen
     </button>
    </section>
    <section>
     <h5>4 · Lesen in eigene japanische Produktion übertragen</h5>
     <button type="button" aria-expanded={writingOpen}
      onClick={()=>setWritingOpen(x=>!x)}>{writingOpen?"Neue Schreibaufgabe verbergen":"Unabhängige andere Situation öffnen"}</button>
     {writingOpen?<div><p>{item.writing.situation}</p>
       <small>Modell erst im normalen StudyPlayer nach eigener Antwort ansehen.</small>
     </div>:null}
     <div className="p54-reading__actions">
      <button type="button" disabled={disabled}
       onClick={()=>onPractice(item.id,"writing")}>Neue Aufgabe im StudyPlayer bearbeiten</button>
      <button type="button" onClick={()=>onWriting(item.id)}>
       Originalen Learn-Schreibeditor verwenden
      </button>
     </div>
    </section>
    <section>
     <h5>5 · Wirklich neuer Kontext nach zeitlichem Abstand</h5>
     <p>Der andere Sachverhalt wird hier absichtlich nicht angezeigt.
      Erst eine tatsächlich fällige ursprüngliche Verständnis-Karte
      oder eine unabhängige bewertete Antwort von vor mindestens 24 Stunden
      schaltet den Transfer frei. Freigabe bedeutet nicht FSRS-Fälligkeit.</p>
     <button type="button" disabled={disabled||!recallReadyIds.includes(item.id)}
      onClick={()=>onPractice(item.id,"return")}>Ungesehenen Kontext abrufen</button>
     {!recallReadyIds.includes(item.id)?<small>Zunächst den Ursprungstext unabhängig
      im StudyPlayer bearbeiten; die spätere Situation bleibt verborgen.</small>:null}
    </section>
    <small>Alle Lesetexte sind THIEPN-Originalmaterial. Marugoto bleibt Referenz.
      Diese Leseansicht speichert keine eigenen Fortschrittsdaten.</small>
   </article>
  </div>
 </section>;
}
