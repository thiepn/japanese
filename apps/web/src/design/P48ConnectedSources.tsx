import {useEffect,useRef,useState} from "react";
import type {P48Case,P48Source} from "../study/connected48";
import {p48Comparison} from "../study/connected48";
type Kind="comprehension"|"writing"|"return";
const aural=new Set(["spoken","voicemail","announcement"]);
/** Read-only, owner-keyed local teaching view. This UI does not grade or persist. */
export function P48ConnectedSources({cases,preferredId,disabled,onPractice,onWriting}:{
 cases:readonly P48Case[];preferredId?:string;disabled:boolean;
 onPractice:(caseId:string,kind:Kind)=>void;onWriting:(caseId:string)=>void;
}){
 const [selected,setSelected]=useState("");
 const [level,setLevel]=useState<"all"|"A1"|"A2">("all");
 const [query,setQuery]=useState("");
 const [visibleAudio,setVisibleAudio]=useState<string[]>([]);
 const [german,setGerman]=useState<string[]>([]);
 const [selectedEvidence,setSelectedEvidence]=useState<string[]>([]);
 const [questionIndex,setQuestionIndex]=useState(0);
 const [answer,setAnswer]=useState("");
 const [submitted,setSubmitted]=useState(false);
 const [showEvidence,setShowEvidence]=useState(false);
 const [showPrinciple,setShowPrinciple]=useState(false);
 const [voiceState,setVoiceState]=useState("");
 const voiceRef=useRef(0);
 const item=cases.find(c=>c.id===selected)??cases.find(c=>c.id===preferredId)??cases[0];
 const question=item?.questions[questionIndex];
 const compared=submitted&&question?p48Comparison(answer,[question.model,question.alternative],
   question.misconception,question.feedback):null;
 const visible=cases.filter(c=>(level==="all"||c.level===level)&&
   (!query.trim()||(c.title+" "+c.domain+" "+c.goal+" "+c.setup)
      .toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())));
 const stop=()=>{
  voiceRef.current+=1;
  if(typeof window!=="undefined"&&"speechSynthesis" in window)
   window.speechSynthesis.cancel();
  setVoiceState("");
 };
 useEffect(()=>()=>{voiceRef.current+=1;
  if(typeof window!=="undefined"&&"speechSynthesis" in window)
    window.speechSynthesis.cancel();
 },[]);
 useEffect(()=>{
  voiceRef.current+=1;
  if(typeof window!=="undefined"&&"speechSynthesis" in window)
    window.speechSynthesis.cancel();
  setVoiceState("");
 },[item?.id]);
 if(!item)return null;
 const choose=(id:string)=>{
  stop();setSelected(id);setQuestionIndex(0);setAnswer("");
  setSubmitted(false);setShowEvidence(false);setSelectedEvidence([]);
  setVisibleAudio([]);setGerman([]);setShowPrinciple(false);
 };
 const setQ=(index:number)=>{
  setQuestionIndex(index);setAnswer("");setSubmitted(false);
  setShowEvidence(false);setSelectedEvidence([]);
 };
 const toggle=(values:string[],id:string,update:(next:string[])=>void)=>{
  update(values.includes(id)?values.filter(x=>x!==id):[...values,id]);
 };
 const speak=(source:P48Source)=>{
  if(typeof window==="undefined"||!("speechSynthesis" in window)||
     typeof SpeechSynthesisUtterance==="undefined"){
   setVoiceState("Keine Geräte-Sprachausgabe verfügbar. Das Transkript kann angezeigt werden.");
   return;
  }
  stop();
  const speech=new SpeechSynthesisUtterance(source.japanese);
  speech.lang="ja-JP";speech.rate=.87;
  const japanese=window.speechSynthesis.getVoices().find(v=>v.lang.toLowerCase().startsWith("ja"));
  if(japanese)speech.voice=japanese;
  const token=voiceRef.current;
  speech.onend=()=>{if(voiceRef.current===token)setVoiceState("")};
  speech.onerror=()=>{if(voiceRef.current===token)
    setVoiceState("Geräte-TTS konnte diese Quelle nicht abspielen. Nutze das Transkript.")};
  setVoiceState("Synthetische Geräte-Stimme · "+source.label);
  window.speechSynthesis.speak(speech);
 };
 return <section className="p27-journey__p48" aria-label="Mehrere Japanischquellen zusammenführen">
   <h4>Verstehen, was wirklich gilt</h4>
   <p>25 eigene japanische Alltagssituationen verbinden jeweils drei unabhängige
     Nachrichten, Pläne, Hinweise oder gesprochene Auskünfte. Entscheide,
     <strong> welche Angaben aktuell, belegt oder nur möglich sind</strong> –
     bevor du auf Japanisch antwortest.</p>
   <div className="p27-journey__p48-filters">
     <label htmlFor="p48-level">Sprachniveau</label>
     <select id="p48-level" value={level} onChange={e=>
       setLevel(e.target.value as "all"|"A1"|"A2")}>
       <option value="all">A1 + A2</option><option value="A1">A1</option>
       <option value="A2">A2</option>
     </select>
     <label htmlFor="p48-search">Situation suchen</label>
     <input id="p48-search" type="search" value={query} onChange={e=>setQuery(e.target.value)}
       placeholder="Thema oder Kommunikationsziel"/>
   </div>
   <div className="p27-journey__p48-layout">
     <nav className="p27-journey__p48-catalog" aria-label="Originale Quellenaufgaben">
       <p>{visible.length} von {cases.length} Situationen</p>
       {visible.map(c=><button key={c.id} type="button"
         aria-current={item.id===c.id?"page":undefined} onClick={()=>choose(c.id)}>
         <strong>{cases.indexOf(c)+1}. {c.title}</strong>
         <small>{c.level} · {c.domain}{c.id===preferredId?" · Lernfokus":""}</small>
       </button>)}
       {visible.length===0?<p>Keine passende Situation.</p>:null}
     </nav>
     <article className="p27-journey__p48-workspace">
       <header>
         <small>{item.level} · {item.domain}</small>
         <h5>{item.title}</h5>
         <p><strong>Auftrag:</strong> {item.goal}</p>
         <p>{item.setup}</p>
         <button type="button" aria-expanded={showPrinciple}
           onClick={()=>setShowPrinciple(v=>!v)}>
           {showPrinciple?"Leseprinzip ausblenden":"Quellenvergleich verstehen"}
         </button>
         {showPrinciple?<p>{item.sourceNotes}</p>:null}
       </header>
       <div className="p27-journey__p48-source-heading">
         <h5>Drei getrennte Originalquellen</h5>
         <p>In Mitteilungsreihenfolge. Der spätere Text ersetzt nicht automatisch
           alles aus dem früheren: beachte Sprecher, Zweck, Geltungsbereich und Bedingungen.</p>
       </div>
       <div className="p27-journey__p48-sources">
         {item.sources.map((src,i)=>{
          const audio=aural.has(src.medium);
          const transcriptOpen=visibleAudio.includes(src.id);
          const translationOpen=german.includes(src.id);
          return <section key={src.id} aria-label={"Quelle "+(i+1)+": "+src.label}>
            <div className="p27-journey__p48-source-title">
              <strong>Quelle {i+1} · {src.label}</strong>
              <small>{src.medium}</small>
            </div>
            <p>{src.context}</p>
            {audio?<div>
              <button type="button" onClick={()=>speak(src)}>
                Quelle mit Geräte-TTS anhören
              </button>
              <button type="button" aria-expanded={transcriptOpen}
                onClick={()=>toggle(visibleAudio,src.id,setVisibleAudio)}>
                {transcriptOpen?"Transkript ausblenden":"Japanisches Transkript zeigen"}
              </button>
            </div>:null}
            {(!audio||transcriptOpen)?<p lang="ja" className="p27-journey__p48-japanese">
              {src.japanese}
            </p>:<p><small>Gesprochene Originalquelle: erst optional anhören;
              Text wird auf Wunsch eingeblendet.</small></p>}
            <button type="button" aria-expanded={translationOpen}
              onClick={()=>toggle(german,src.id,setGerman)}>
              {translationOpen?"Deutsche Hilfe verbergen":"Deutsche Hilfe anzeigen"}
            </button>
            {translationOpen?<p>{src.german}</p>:null}
          </section>
         })}
       </div>
       {voiceState?<p role="status">{voiceState}</p>:null}
       <div className="p27-journey__p48-questions">
         <h5>Vergleichen · erschließen · belegen</h5>
         <div className="p27-journey__p48-question-nav" role="group" aria-label="Fragen zu den Quellen">
           {item.questions.map((q,i)=><button type="button" key={q.id}
             aria-pressed={i===questionIndex} onClick={()=>setQ(i)}>
             {i+1}. {q.kind==="reconcile"?"Was gilt?":
               q.kind==="inference"?"Was folgt daraus?":"Was belegt es?"}
           </button>)}
         </div>
         {question?<div>
           <p><strong>Frage {questionIndex+1}:</strong> {question.question}</p>
           <fieldset className="p27-journey__p48-evidence-select">
             <legend>Welche Originalquellen stützen deine Antwort? (freiwillig)</legend>
             {item.sources.map((src,i)=><label key={src.id}>
               <input type="checkbox" checked={selectedEvidence.includes(src.id)}
                 onChange={()=>toggle(selectedEvidence,src.id,setSelectedEvidence)}/>
               Quelle {i+1} · {src.label}
             </label>)}
           </fieldset>
           <label htmlFor="p48-answer">Eigene japanische Antwort</label>
           <textarea id="p48-answer" rows={3} lang="ja" value={answer}
             onChange={e=>{setAnswer(e.target.value);setSubmitted(false);setShowEvidence(false)}}/>
           <div className="p27-journey__actions">
             <button type="button" disabled={!answer.trim()} onClick={()=>setSubmitted(true)}>
               Mit authored Antwortbeispielen vergleichen
             </button>
             <button type="button" disabled={disabled}
               onClick={()=>onPractice(item.id,"comprehension")}>
               Drei unabhängige StudyPlayer-Fragen
             </button>
           </div>
           {compared?<div className="p27-journey__p48-feedback" role="status">
             <strong>{compared.kind==="example"?"Entspricht einem Beispiel":
               compared.kind==="known-error"?"Bekannter Quellenfehler":
               "Andere Formulierung – nicht automatisch bewertet"}</strong>
             <p>{compared.message}</p>
             <p>{question.feedback}</p>
             <button type="button" aria-expanded={showEvidence}
               onClick={()=>setShowEvidence(v=>!v)}>
               {showEvidence?"Belege und Muster verbergen":"Originalbelege und Muster nach dem Versuch zeigen"}
             </button>
             {showEvidence?<div>
               <p><strong>Belegstellen und Funktion:</strong></p>
               <ul>{question.evidence.map((e,i)=>{
                 const src=item.sources.find(s=>s.id===e.sourceId);
                 return <li key={e.sourceId+":"+i}>
                   <strong>{src?.label}:</strong> <span lang="ja">「{e.excerpt}」</span>
                   <span> · {e.role}</span>
                 </li>;
               })}</ul>
               {selectedEvidence.length?<p>
                 Von dir gewählte Quellen: {selectedEvidence.map(id=>
                   item.sources.find(s=>s.id===id)?.label).filter(Boolean).join(", ")}.
                 <small>Die Quellenwahl ist eine Lesehilfe und erhält keine Note.</small>
               </p>:null}
               <p><strong>Muster:</strong> <span lang="ja">{question.model}</span></p>
               <p><strong>Weitere mögliche Formulierung:</strong>
                 <span lang="ja"> {question.alternative}</span></p>
             </div>:null}
             {questionIndex<item.questions.length-1?
               <button type="button" onClick={()=>setQ(questionIndex+1)}>
                 Nächste Frage
               </button>:null}
           </div>:null}
         </div>:null}
       </div>
       <section className="p27-journey__p48-writing">
         <h5>Eigenes Ergebnis auf Japanisch schreiben</h5>
         <p>{item.writing.instruction}</p>
         <div className="p27-journey__actions">
           <button type="button" onClick={()=>onWriting(item.id)}>
             Im bestehenden Entwurf- und Überarbeitungseditor
           </button>
           <button type="button" disabled={disabled}
             onClick={()=>onPractice(item.id,"writing")}>
             Unabhängig im StudyPlayer schreiben
           </button>
         </div>
       </section>
       <section className="p27-journey__p48-return">
         <h5>Später in anderer Situation anwenden</h5>
         <p>Der Transfer enthält andere Fakten und keine drei vorgelesenen Quellen.
           Freiwilliges Üben ist nicht automatisch eine laut FSRS fällige Wiederholung.</p>
         <button type="button" disabled={disabled}
           onClick={()=>onPractice(item.id,"return")}>
           Neuen Kontext unabhängig abrufen
         </button>
       </section>
       <small>Alle Quellen und Belege sind eigens verfasste Unterrichtsmaterialien.
         Das aktuelle Lese- und Hörfeld erzeugt keine Bewertungen, Speichereinträge
         oder FSRS-Fälligkeiten. Geräte-TTS ist synthetisch und nicht aufgezeichnet.</small>
     </article>
   </div>
 </section>;
}
