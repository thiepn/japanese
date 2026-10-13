import {useState} from "react";
import {p51AuthoredComparison,type P51Contrast,type P51Domain} from "../study/grammar51";

type Kind="meaning"|"production"|"return";
const domainLabels:Record<P51Domain,string>={
 time:"Zeit und zeitliche Einordnung",aspect:"Verlauf und Zustand",
 condition:"Bedingung",intention:"Absicht und Zweck",
 permission:"Erlaubnis und Pflicht",comparison:"Vergleich und Umfang",
 evidence:"Information und Gewissheit",social:"Soziale Rollen und Höflichkeit",
 sequence:"Reihenfolge",description:"Beschreibung und Möglichkeit"
};
/** Ephemeral, owner-keyed via existing Learn shell. No parallel grading or progress. */
export function P51GrammarStudio({contrasts,preferredId,disabled,onPractice,onWriting}:{
 contrasts:readonly P51Contrast[];preferredId?:string;disabled:boolean;
 onPractice:(id:string,kind:Kind)=>void;onWriting:(id:string)=>void;
}){
 const [selectedId,setSelectedId]=useState("");
 const [domain,setDomain]=useState<P51Domain|"all">("all");
 const [query,setQuery]=useState("");
 const [showPrinciple,setShowPrinciple]=useState(false);
 const [showExamples,setShowExamples]=useState(false);
 const [showContrast,setShowContrast]=useState(false);
 const [answer,setAnswer]=useState("");
 const [attempted,setAttempted]=useState(false);
 const [showModels,setShowModels]=useState(false);
 const item=contrasts.find(c=>c.id===selectedId)??
   contrasts.find(c=>c.id===preferredId)??contrasts[0];
 if(!item)return null;
 const visible=contrasts.filter(c=>(domain==="all"||c.domain===domain)&&
   (!query.trim()||[c.title,c.formA,c.formB,c.scene,c.choiceRule,c.audience]
     .join(" ").toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())));
 const result=attempted?p51AuthoredComparison(answer,
   [item.production.model,item.production.alternative],
   item.production.misconception,item.production.feedback):null;
 function choose(id:string){
  setSelectedId(id);setAnswer("");setAttempted(false);
  setShowModels(false);setShowPrinciple(false);setShowExamples(false);setShowContrast(false);
 }
 return <section className="p27-journey__p51" aria-label="Japanische Grammatik in konkreten A2-Gesprächen">
  <h4>A2 Grammatik: Bedeutung vor bloßer Form</h4>
  <p>50 originale Kontraste mit Sprecherrolle, Kommunikationsziel und passenden
    Gebrauchssituationen. Lies zuerst die Szene. Formuliere eigenständig und vergleiche
    danach mit den begründeten Beispielen. Diese Lernansicht gibt keine
    automatischen Noten oder künstlichen FSRS-Erfolge.</p>
  <div className="p27-journey__p51-filters">
   <label htmlFor="p51-domain">Grammatikbereich</label>
   <select id="p51-domain" value={domain} onChange={e=>
     setDomain(e.target.value as P51Domain|"all")}>
    <option value="all">Alle Kontraste</option>
    {(Object.keys(domainLabels) as P51Domain[]).map(k=>
     <option key={k} value={k}>{domainLabels[k]}</option>)}
   </select>
   <label htmlFor="p51-search">Satzform, Kontext oder Bedeutung suchen</label>
   <input id="p51-search" type="search" value={query}
    onChange={e=>setQuery(e.target.value)} placeholder="z. B. 〜たら, Erlaubnis, Absage"/>
  </div>
  <div className="p27-journey__p51-layout">
   <nav className="p27-journey__p51-catalog" aria-label="50 A2 Grammatik-Kontraste">
    <p>{visible.length} von {contrasts.length} Kontexten</p>
    {visible.map(c=><button type="button" key={c.id}
     aria-current={c.id===item.id?"page":undefined} onClick={()=>choose(c.id)}>
      <strong>{contrasts.indexOf(c)+1}. {c.title}</strong>
      <small>{domainLabels[c.domain]}{c.id===preferredId?" · Lernfokus":""}</small>
    </button>)}
    {!visible.length?<p>Kein passender Kontext.</p>:null}
   </nav>
   <article className="p27-journey__p51-workspace">
    <header>
     <small>A2 · {domainLabels[item.domain]}</small>
     <h5>{item.title}</h5>
     <p><strong>Situation:</strong> {item.scene}</p>
     <p><strong>Sprecher / Adressat:</strong> {item.audience}</p>
     <p><strong>Register:</strong> {item.register}</p>
    </header>
    <section className="p27-journey__p51-comparison">
     <h5>1 · Zwei Formen, unterschiedliche kommunikative Funktion</h5>
     <div className="p27-journey__p51-pair">
      <div><strong lang="ja">{item.formA}</strong><p>{item.meaningA}</p></div>
      <div><strong lang="ja">{item.formB}</strong><p>{item.meaningB}</p></div>
     </div>
     <button type="button" aria-expanded={showPrinciple} onClick={()=>
      setShowPrinciple(v=>!v)}>
      {showPrinciple?"Unterscheidungsregel ausblenden":"Wann welche Form sinnvoll ist"}
     </button>
     {showPrinciple?<p>{item.choiceRule}</p>:null}
    </section>
    <section className="p27-journey__p51-production">
     <h5>2 · Eine eigene japanische Aussage machen</h5>
     <p><strong>Unabhängige Situation:</strong> {item.production.situation}</p>
     <label htmlFor="p51-answer">Eigene Antwort auf Japanisch</label>
     <textarea id="p51-answer" rows={3} lang="ja" value={answer}
      onChange={e=>{setAnswer(e.target.value);setAttempted(false);setShowModels(false)}}/>
     <div className="p27-journey__actions">
      <button type="button" disabled={!answer.trim()}
       onClick={()=>setAttempted(true)}>Mit originalen Beispielen vergleichen</button>
      <button type="button" disabled={disabled}
       onClick={()=>onPractice(item.id,"meaning")}>
       Kontrast im bestehenden StudyPlayer abrufen
      </button>
     </div>
     {result?<div className="p27-journey__p51-feedback" role="status">
      <strong>{result.kind==="example"?"Verfasstem Beispiel entsprechend":
       result.kind==="specific-error"?"Konkrete Fehlinterpretation":
       "Andere Formulierung – keine allgemeine japanische Grammatikbewertung"}</strong>
      <p>{result.message}</p>
      <p>{item.production.feedback}</p>
      <button type="button" aria-expanded={showModels}
       onClick={()=>setShowModels(v=>!v)}>
       {showModels?"Beispiele wieder ausblenden":"Verfasste Antwortmodelle nach dem Versuch sehen"}
      </button>
      {showModels?<div>
       <p lang="ja">{item.production.model}</p>
       <p lang="ja">{item.production.alternative}</p>
       <small>Weitere richtige japanische Sätze sind möglich und werden hier
        nicht automatisch semantisch bewertet.</small>
      </div>:null}
     </div>:null}
     <button type="button" disabled={disabled}
      onClick={()=>onPractice(item.id,"production")}>
      Eigenständig in vorhandener StudyPlayer-Produktion antworten
     </button>
    </section>
    <section className="p27-journey__p51-examples">
     <h5>3 · Bedeutung an drei neuen Originalbelegen prüfen</h5>
     <button type="button" aria-expanded={showExamples} onClick={()=>
      setShowExamples(v=>!v)}>
      {showExamples?"Beispiele verbergen":"Drei japanische Kontextsätze mit Erklärungen zeigen"}
     </button>
     {showExamples?<div>
      {item.examples.map((e,i)=><div key={i}>
       <strong>Beispiel {i+1}</strong>
       <p lang="ja">{e.japanese}</p>
       <p>{e.english}</p><small>{e.why}</small>
      </div>)}
     </div>:null}
     <button type="button" aria-expanded={showContrast} onClick={()=>
      setShowContrast(v=>!v)}>
      {showContrast?"Typische Verwechslung verbergen":"Häufige falsche Bedeutungsentscheidung erklären"}
     </button>
     {showContrast?<div className="p27-journey__p51-feedback">
      <strong>Fehlinterpretation:</strong> {item.commonError}
      <p>{item.errorRepair}</p><small>{item.teachingLink}</small>
     </div>:null}
    </section>
    <section className="p27-journey__p51-writing">
     <h5>4 · Unabhängig schreiben und überarbeiten</h5>
     <p>{item.production.situation}</p>
     <button type="button" onClick={()=>onWriting(item.id)}>
      In vorhandenen Learn-Schreiben-Editor übernehmen
     </button>
    </section>
    <section className="p27-journey__p51-transfer">
     <h5>5 · Eine neue Situation ohne alte Muster</h5>
     <p>Der neue Kontext verändert Gesprächspartner, Absicht oder Fakten.
      Der freiwillige Abruf ist noch kein laut FSRS fälliger Lerntermin.</p>
     <button type="button" disabled={disabled}
      onClick={()=>onPractice(item.id,"return")}>
      Unbekannten Kontext selbstständig bearbeiten
     </button>
    </section>
    <small>Original verfasste A2-Lehrtexte, keine übernommenen Marugoto-Aufgaben.
     Die Antwortvergleichshilfe speichert keine freien Lernertexte und
     bestätigt keine allgemeinen Sprachkompetenzen.</small>
   </article>
  </div>
 </section>;
}
