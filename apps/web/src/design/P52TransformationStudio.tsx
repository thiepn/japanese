import {useState} from "react";
import {p52Compare,type P52Domain,type P52Transformation,type P52PracticeKind} from "../study/transformation52";
type Kind=Exclude<P52PracticeKind,"all">;
const labels:Record<P52Domain,string>={
 register:"Sprecherrolle & Höflichkeit",intention:"Absicht & Planung",
 chronology:"Chronologie & Fristen",aspect:"Aspekt & Zustand",
 condition:"Bedingungen & Gründe",evidence:"Quellen & Vermutungen",
 potential:"Fähigkeiten & Möglichkeiten",contrast:"Vergleich & Kontrast",
 perspective:"Perspektive & Gefallen",voice:"Aktiv & Passiv"
};
/** An ungraded rehearsal; all actual reviews are delegated to the original StudyPlayer. */
export function P52TransformationStudio({items,preferredId,disabled,onPractice,onWriting}:{
 items:readonly P52Transformation[];preferredId?:string;disabled:boolean;
 onPractice:(id:string,kind:Kind)=>void;onWriting:(id:string)=>void;
}){
 const [id,setId]=useState("");
 const [domain,setDomain]=useState<P52Domain|"all">("all");
 const [search,setSearch]=useState("");
 const [draft,setDraft]=useState("");
 const [attempt,setAttempt]=useState(false);
 const [showModels,setShowModels]=useState(false);
 const [showProduction,setShowProduction]=useState(false);
 const item=items.find(t=>t.id===id)??items.find(t=>t.id===preferredId)??items[0];
 if(!item)return null;
 const visible=items.filter(t=>(domain==="all"||t.domain===domain)&&
  [t.title,t.goal,t.scene,t.input,t.role,t.id].join(" ").toLocaleLowerCase()
   .includes(search.trim().toLocaleLowerCase()));
 const feedback=attempt?p52Compare(draft,[item.model,...item.alternatives],
  item.wrong,item.repair):null;
 function choose(next:string){
  setId(next);setDraft("");setAttempt(false);setShowModels(false);setShowProduction(false);
 }
 return <section className="p27-journey__p52" aria-label="A2 Japanische Sätze im Kontext umformen">
  <h4>Japanische Satztransformation · A2</h4>
  <p>Schreibe vollständige Sätze statt isolierter Endungen. Manchmal bleibt die
   sachliche Bedeutung erhalten, manchmal ändert sich absichtlich Verpflichtung,
   Zeitpunkt, Quellenstatus oder Sprecherrolle. Eigene Entwürfe hier sind unbenotet;
   verbindliche Lernereignisse entstehen nur im vorhandenen StudyPlayer.</p>
  <div className="p27-journey__p52-filters">
   <label htmlFor="p52-domain">Lernbereich</label>
   <select id="p52-domain" value={domain} onChange={e=>setDomain(e.target.value as P52Domain|"all")}>
    <option value="all">Alle Transformationsbereiche</option>
    {(Object.keys(labels) as P52Domain[]).map(k=><option key={k} value={k}>{labels[k]}</option>)}
   </select>
   <label htmlFor="p52-search">Satz, Ziel oder Gesprächskontext suchen</label>
   <input id="p52-search" type="search" value={search}
    onChange={e=>setSearch(e.target.value)} placeholder="z. B. てから, Lehrer, Bedingung"/>
  </div>
  <div className="p27-journey__p52-layout">
   <nav className="p27-journey__p52-list" aria-label="Originale Satztransformationen">
    <p>{visible.length} von {items.length} originalen Aufgaben</p>
    {visible.map(t=><button key={t.id} type="button" aria-current={t.id===item.id?"page":undefined}
     onClick={()=>choose(t.id)}>
     <strong>{items.indexOf(t)+1}. {t.title}</strong>
     <small>{labels[t.domain]} · {t.mode==="preserve"?"Gleiche Bedeutung":"Gezielte Änderung"}</small>
    </button>)}
    {visible.length===0?<p>Keine Aufgabe gefunden. Suche oder Bereich ändern.</p>:null}
   </nav>
   <article className="p27-journey__p52-workspace">
    <header>
     <small>A2 · {labels[item.domain]}</small>
     <h5>{item.title}</h5>
     <p><strong>Rollen:</strong> {item.role}</p>
     <p><strong>Situation:</strong> {item.scene}</p>
     <p><strong>Transformation:</strong> {item.mode==="preserve"?
      "Die wesentliche Aussage erhalten; Blickwinkel oder Register anpassen.":
      "Die beabsichtigte Änderung ausdrücklich kodieren. Alte Aussagen nicht als synonym behandeln."}</p>
    </header>
    <section>
     <h5>1 · Ausgangssatz und Kommunikationsziel</h5>
     <blockquote lang="ja">{item.input}</blockquote>
     <p><strong>Ziel:</strong> {item.goal}</p>
     <label htmlFor="p52-draft">Eigener vollständiger japanischer Zielsatz</label>
     <textarea id="p52-draft" rows={3} lang="ja" value={draft}
      onChange={e=>{setDraft(e.target.value);setAttempt(false);setShowModels(false)}}
      onKeyDown={e=>{if(!e.nativeEvent.isComposing&&(e.ctrlKey||e.metaKey)&&e.key==="Enter"&&draft.trim()){
       e.preventDefault();setAttempt(true);
      }}} aria-keyshortcuts="Control+Enter Meta+Enter"/>
     <div className="p27-journey__actions">
      <button type="button" disabled={!draft.trim()} onClick={()=>setAttempt(true)}>Eigene Fassung vergleichen</button>
      <button type="button" disabled={disabled} onClick={()=>onPractice(item.id,"transform")}>
       Mit Original-StudyPlayer üben
      </button>
     </div>
     {feedback?<div className="p27-journey__p52-feedback" role="status">
      <strong>{feedback.kind==="example"?"Entspricht Originalmodell":
       feedback.kind==="specific-error"?"Konkrete Fehlannahme":"Nicht automatisch bewertet"}</strong>
      <p>{feedback.message}</p>
      <p>{item.nuance}</p>
      <p><strong>Häufige Verwechslung:</strong> {item.misconception}</p>
      <button type="button" aria-expanded={showModels}
       onClick={()=>setShowModels(v=>!v)}>{showModels?"Muster verbergen":"Drei Originalvarianten ansehen"}</button>
      {showModels?<div className="p27-journey__p52-models">
       {[item.model,...item.alternatives].map((m,i)=><p lang="ja" key={i}>{m}</p>)}
       <small>Diese Beispiele beschreiben nicht sämtliche natürlichen Alternativen.</small>
      </div>:null}
      <p><strong>Typische falsche Umformung:</strong> <span lang="ja">{item.wrong}</span> · {item.repair}</p>
     </div>:null}
    </section>
    <section>
     <h5>2 · Neues Sachthema selbstständig produzieren</h5>
     <p>Nach dem ersten Versuch kannst du eine neue, unabhängig geschriebene
      Alltagssituation verwenden. Sie nutzt eine neue Handlung oder Person.</p>
     <button type="button" aria-expanded={showProduction} onClick={()=>setShowProduction(v=>!v)}>
      {showProduction?"Kontext verbergen":"Neue eigenständige Aufgabe lesen"}
     </button>
     {showProduction?<div className="p27-journey__p52-secondary">
      <p>{item.production.scene}</p>
      <p lang="ja">{item.production.input}</p>
      <p><strong>Neue Absicht:</strong> {item.production.goal}</p>
      <p><small>Die Antworten bleiben vor dem Versuch im StudyPlayer verborgen.</small></p>
     </div>:null}
     <div className="p27-journey__actions">
      <button type="button" disabled={disabled} onClick={()=>onPractice(item.id,"production")}>
       Unabhängige Produktion im StudyPlayer
      </button>
      <button type="button" onClick={()=>onWriting(item.id)}>
       Im vorhandenen Schreiben-Editor überarbeiten
      </button>
     </div>
    </section>
    <section>
     <h5>3 · Verzögerter Abruf in wirklich verändertem Kontext</h5>
     <p>Ein neuer, hier absichtlich nicht gezeigter Fall verändert Fakten,
      Rollen oder Intention. Nur tatsächliche FSRS-MemoryTraces im bestehenden
      Lernsystem begründen einen später fälligen Termin.</p>
     <button type="button" disabled={disabled} onClick={()=>onPractice(item.id,"return")}>
      Neuen, noch ungesehenen Kontext freiwillig abrufen
     </button>
    </section>
    <small>First-party Originalinhalt; Marugoto nur Referenz. Keine Speicherung
     dieser Probeeingabe, keine automatischen Noten für unbekannte Paraphrasen.</small>
   </article>
  </div>
 </section>;
}
