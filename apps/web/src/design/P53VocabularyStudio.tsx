import {useState} from "react";
import {p53Compare,type P53Vocabulary,type P53Domain,type P53PracticeKind} from "../study/vocabulary53";
import "./p53-vocabulary.css";
type Kind=Exclude<P53PracticeKind,"all">;
const domains:Record<P53Domain,string>={
 travel:"Unterwegs und Termine",time:"Zeit",services:"Läden und Dienstleistungen",
 shopping:"Einkaufen",study:"Studium, Arbeit und Digitales",work:"Arbeit",
 digital:"Digitales",home:"Wohnen, Essen und Gesundheit",health:"Gesundheit",
 social:"Miteinander und Sprechabsichten"
};
/** Study-only model inspection; graded events remain in the original StudyPlayer. */
export function P53VocabularyStudio({items,preferredId,recallReadyIds,disabled,onPractice,onWriting}:{
 items:readonly P53Vocabulary[];preferredId?:string;recallReadyIds:readonly string[];
 disabled:boolean;onPractice:(id:string,kind:Kind)=>void;onWriting:(id:string)=>void;
}){
 const [selected,setSelected]=useState("");
 const [domain,setDomain]=useState<P53Domain|"all">("all");
 const [search,setSearch]=useState("");
 const [mode,setMode]=useState<"meaning"|"production">("meaning");
 const [draft,setDraft]=useState("");
 const [attempted,setAttempted]=useState(false);
 const [showModel,setShowModel]=useState(false);
 const [details,setDetails]=useState(false);
 const item=items.find(v=>v.id===selected)??items.find(v=>v.id===preferredId)??items[0];
 if(!item)return null;
 const visible=items.filter(v=>(domain==="all"||v.domain===domain)&&
  (!search.trim()||[v.written,v.reading,v.meaning,v.scene,...v.collocations,v.nuance]
   .join(" ").toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())));
 const feedback=attempted?p53Compare(draft,
  [mode==="meaning"?item.example:item.production.model],item):null;
 function choose(id:string){
  setSelected(id);setDraft("");setAttempted(false);setShowModel(false);setDetails(false);
  setMode("meaning");
 }
 function switchMode(next:"meaning"|"production"){
  setMode(next);setDraft("");setAttempted(false);setShowModel(false);
 }
 const goal=mode==="meaning"?item.translation:item.production.situation;
 return <section className="p53-study" aria-label="A2 Wörter kontextuell verstehen und verwenden">
  <h4>Japanische Wörter natürlich verwenden · A2</h4>
  <p>Originale Alltagssätze statt isolierter Vokabelkarten: Bedeutung, zwei
   typische Wortverbindungen, passendes Gesprächsregister, eigene Produktion
   und später ein neuer Kontext. Diese Ansicht benotet nichts und schreibt
   keine neuen Lernstände.</p>
  <div className="p53-study__filters">
   <label htmlFor="p53-domain">Bereich</label>
   <select id="p53-domain" value={domain}
    onChange={e=>setDomain(e.target.value as P53Domain|"all")}>
    <option value="all">Alle Themenbereiche</option>
    {([...new Set(items.map(x=>x.domain))] as P53Domain[]).map(k=>
     <option key={k} value={k}>{domains[k]}</option>)}
   </select>
   <label htmlFor="p53-search">Japanisch oder Bedeutung suchen</label>
   <input id="p53-search" type="search" value={search} onChange={e=>setSearch(e.target.value)}
    placeholder="z. B. 予約, のりかえ, erklären"/>
  </div>
  <div className="p53-study__layout">
   <nav className="p53-study__catalog" aria-label="P53 originale Wörter">
    <p>{visible.length} von {items.length} Einträgen</p>
    {visible.map((v)=><button type="button" key={v.id}
      aria-current={v.id===item.id?"page":undefined} onClick={()=>choose(v.id)}>
      <strong lang="ja">{v.written}</strong> <small lang="ja">{v.reading}</small>
      <small>{v.meaning} · {domains[v.domain]}</small>
    </button>)}
    {!visible.length?<p>Kein Wort gefunden.</p>:null}
   </nav>
   <article className="p53-study__workspace">
    <header>
     <small>A2 · {domains[item.domain]} · {items.indexOf(item)+1}/{items.length}</small>
     <h5 lang="ja">{item.written} <small>（{item.reading}）</small></h5>
     <p><strong>Bedeutung:</strong> {item.meaning}</p>
     <p><strong>Natürlich verbinden:</strong> <span lang="ja">{item.collocations.join(" · ")}</span></p>
    </header>
    <section>
     <h5>1 · Kommunikationssituation</h5>
     <p>{mode==="meaning"?item.scene:item.production.situation}</p>
     <div className="p53-study__modes" role="group" aria-label="Lernfunktion wählen">
      <button type="button" aria-pressed={mode==="meaning"}
       onClick={()=>switchMode("meaning")}>Bedeutung aktiv abrufen</button>
      <button type="button" aria-pressed={mode==="production"}
       onClick={()=>switchMode("production")}>Neuen Satz produzieren</button>
     </div>
     <p><strong>Auftrag:</strong> {mode==="meaning"?
      "Übertrage die folgende Bedeutung in den vollständigen ursprünglichen japanischen Satz: "+goal:
      "Produziere eine natürliche japanische Aussage für diese andere, unabhängig geschriebene Situation."}</p>
     <label htmlFor="p53-draft">Eigener vollständiger Satz auf Japanisch</label>
     <textarea id="p53-draft" rows={3} lang="ja" value={draft}
      onChange={e=>{setDraft(e.target.value);setAttempted(false);setShowModel(false)}}
      onKeyDown={e=>{
       if(!e.nativeEvent.isComposing&&(e.ctrlKey||e.metaKey)&&e.key==="Enter"&&draft.trim()){
        e.preventDefault();setAttempted(true);
       }
      }} aria-keyshortcuts="Control+Enter Meta+Enter"/>
     <div className="p53-study__actions">
      <button type="button" disabled={!draft.trim()} onClick={()=>setAttempted(true)}>
       Eigene Formulierung mit Originalmodell vergleichen
      </button>
      <button type="button" disabled={disabled} onClick={()=>onPractice(item.id,mode)}>
       Im vorhandenen StudyPlayer antworten
      </button>
     </div>
     {feedback?<div className="p53-study__feedback" role="status">
       <strong>{feedback.kind==="example"?"Entspricht einem Originalsatz":
         "Keine automatische semantische Beurteilung"}</strong>
       <p>{feedback.message}</p>
       <button type="button" aria-expanded={showModel} onClick={()=>setShowModel(x=>!x)}>
        {showModel?"Muster verbergen":"Originalen vollständigen Beispielsatz zeigen"}
       </button>
       {showModel?<p lang="ja">{mode==="meaning"?item.example:item.production.model}</p>:null}
       <p><strong>Missverständnis:</strong> {item.misconception}</p>
       <p>{item.repair}</p>
     </div>:null}
    </section>
    <section>
     <h5>2 · Bedeutung und Kollokationen verstehen</h5>
     <button type="button" aria-expanded={details} onClick={()=>setDetails(x=>!x)}>
      {details?"Hinweise ausblenden":"Begründete Wortwahl und Alltagsnuance öffnen"}
     </button>
     {details?<div>
      <p>{item.nuance}</p>
      <p><strong>Beispielübersetzung:</strong> {item.translation}</p>
      <p><strong>Typischer Fehler:</strong> {item.misconception} {item.repair}</p>
     </div>:null}
     <button type="button" onClick={()=>onWriting(item.id)}>
      Im vorhandenen Learn-Schreiben-Editor überarbeiten
     </button>
    </section>
    <section>
     <h5>3 · Wirklich neuer Kontext nach Lernabstand</h5>
     <p>Der spätere Fall ändert Gegenstand oder Sprecherabsicht und wird
      nicht hier angezeigt. Er ist erst nach einem real fälligen Erstabruf
      oder mindestens 24 Stunden nach einer echten bewerteten Erstantwort
      freigegeben; das ist selbst keine FSRS-Fälligkeit.</p>
     <button type="button" disabled={disabled||!recallReadyIds.includes(item.id)}
      onClick={()=>onPractice(item.id,"return")}>Unbekannten Kontext abrufen</button>
     {!recallReadyIds.includes(item.id)?<small>Erst ursprüngliche Karte
      im StudyPlayer bearbeiten und den Lernabstand abwarten.</small>:null}
    </section>
    <small>THIEPN Originaltexte; Marugoto nur referenziert. Offene Paraphrasen
     werden nicht automatisch bewertet. Keine neue Speicherung in dieser Ansicht.</small>
   </article>
  </div>
 </section>;
}
