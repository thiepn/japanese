import {useEffect,useRef,useState} from "react";
import {p56Compare,p56Progression,p56RelatedWords,p56Route,
 type P56Scene,type P56RouteKey,type P56Register,type P56PracticeKind} from "../study/interaction56";
import "./p56-interaction.css";
type Kind=Exclude<P56PracticeKind,"all">;
const registerLabel:Record<P56Register,string>={casual:"Vertraut",polite:"Höflich",service:"Service"};
/** Original branching teaching only. Native StudyPlayer remains the sole assessment writer. */
export function P56InteractionStudio({scenes,preferredId,recallReadyIds,disabled,onPractice,onWriting}:{
 scenes:readonly P56Scene[];preferredId?:string;recallReadyIds:readonly string[];
 disabled:boolean;onPractice:(id:string,kind:Kind)=>void;onWriting:(id:string)=>void;
}){
 const [id,setId]=useState("");
 const [filter,setFilter]=useState<P56Register|"all">("all");
 const [query,setQuery]=useState("");
 const [limit,setLimit]=useState(24);
 const [branch,setBranch]=useState<P56RouteKey|null>(null);
 const [draft,setDraft]=useState("");
 const [attempted,setAttempted]=useState(false);
 const [models,setModels]=useState(false);
 const [german,setGerman]=useState(false);
 const [wordsOpen,setWordsOpen]=useState(false);
 const [responseOpen,setResponseOpen]=useState(false);
 const [audioNotice,setAudioNotice]=useState("");
 const speakVersion=useRef(0);
 const current=scenes.find(s=>s.id===id)??scenes.find(s=>s.id===preferredId)??scenes[0];
 const reset=()=>{
  setBranch(null);setDraft("");setAttempted(false);setModels(false);
  setGerman(false);setWordsOpen(false);setResponseOpen(false);setAudioNotice("");
 };
 const stop=()=>{
  speakVersion.current++;
  if(typeof window!=="undefined"&&"speechSynthesis" in window)window.speechSynthesis.cancel();
 };
 useEffect(()=>()=>{speakVersion.current++;
  if(typeof window!=="undefined"&&"speechSynthesis" in window)window.speechSynthesis.cancel();
 },[]);
 useEffect(()=>{speakVersion.current++;
  if(typeof window!=="undefined"&&"speechSynthesis" in window)window.speechSynthesis.cancel();
 },[current?.id,branch]);
 if(!current)return null;
 const visible=scenes.filter(s=>(filter==="all"||filter===s.register)&&
   [s.title,s.setting,s.goal,s.partner,...Object.values(s.routes).map(r=>r.partner),s.mistake.partner]
    .join(" ").toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
 const route=branch?p56Route(current,branch):null;
 const feedback=route&&attempted?p56Compare(draft,[route.model,route.alternative],
   branch==="repair"?current.mistake.misleading:current.mistake.misleading,
   route.explanation):null;
 const words=p56RelatedWords(current),progress=p56Progression(current.id);
 const choose=(sceneId:string)=>{stop();setId(sceneId);reset();};
 const take=(k:P56RouteKey)=>{
  stop();setBranch(k);setDraft("");setAttempted(false);setModels(false);
 };
 const speak=(text:string)=>{
  if(typeof window==="undefined"||!("speechSynthesis" in window)||
    typeof SpeechSynthesisUtterance==="undefined"){
    setAudioNotice("Geräte-TTS ist nicht verfügbar. Die japanischen Originaltexte bleiben lesbar.");return;
  }
  stop();setAudioNotice("");
  const voice=window.speechSynthesis.getVoices().find(v=>v.lang.toLowerCase().startsWith("ja"));
  if(!voice)setAudioNotice("Keine japanische Geräte-Stimme erkannt. Aussprache kann ungenau sein.");
  const utter=new SpeechSynthesisUtterance(text);utter.lang="ja-JP";utter.rate=.85;
  if(voice)utter.voice=voice;
  utter.onerror=()=>setAudioNotice("TTS unterbrochen. Bitte erneut abspielen oder den Text lesen.");
  window.speechSynthesis.speak(utter);
 };
 return <section className="p56-interaction" aria-label="Spontane A2-Gesprächsreparatur">
  <h4>A2 · Spontan reagieren und Missverständnisse beheben</h4>
  <p>35 originale verzweigte Alltagssituationen. Wähle zunächst ohne Modellhilfe
   zwei legitime Gesprächswege oder erkunde eine konkrete Fehlinterpretation.
   Jede Wahl führt zu einer <strong>anderen Partneräußerung</strong>, auf die du
   wieder eigenständig reagierst. Dieses Studio speichert oder benotet keine Antworten.</p>
  <div className="p56-interaction__filters">
   <label htmlFor="p56-register">Beziehung und Register</label>
   <select id="p56-register" value={filter} onChange={e=>{
     setFilter(e.target.value as P56Register|"all");setLimit(24);
   }}>
    <option value="all">Alle Situationen</option>
    {(["casual","polite","service"] as const).map(v=><option key={v} value={v}>
     {registerLabel[v]}</option>)}
   </select>
   <label htmlFor="p56-search">Situation suchen</label>
   <input id="p56-search" type="search" placeholder="z. B. 変更, 予約, 返事"
     value={query} onChange={e=>{setQuery(e.target.value);setLimit(24)}}/>
  </div>
  <div className="p56-interaction__layout">
   <nav className="p56-interaction__catalog" aria-label="P56 Originalkonversationen">
    <p>{visible.length} von {scenes.length} Situationen</p>
    {visible.slice(0,limit).map(s=><button key={s.id} type="button"
     aria-current={s.id===current.id?"page":undefined} onClick={()=>choose(s.id)}>
     <strong lang="ja">{scenes.indexOf(s)+1}. {s.title}</strong>
     <small>{registerLabel[s.register]} · {s.relation}</small>
    </button>)}
    {visible.length>limit?<button type="button" onClick={()=>setLimit(n=>n+24)}>
      Weitere Fälle</button>:null}
    {!visible.length?<p>Keine passende Situation.</p>:null}
   </nav>
   <article className="p56-interaction__workspace">
    <header>
     <small>A2 · Stufe {progress.stage}/4 · {registerLabel[current.register]}</small>
     <h5 lang="ja">{current.title}</h5>
     <p><strong>Rollen:</strong> {current.relation}</p>
     <p><strong>Situation:</strong> {current.setting}</p>
     <p><strong>Gesprächsabsicht:</strong> {current.goal}</p>
     <p><strong>Progression:</strong> {progress.goal}</p>
    </header>
    <section>
     <h5>1 · Erst zuhören und selbst entscheiden</h5>
     <p><strong>Dein Gegenüber:</strong></p>
     <p lang="ja" className="p56-interaction__partner">{current.partner}</p>
     <div className="p56-interaction__actions">
      <button type="button" onClick={()=>speak(current.partner)}>Originalaussage über Geräte-TTS hören</button>
      <button type="button" aria-expanded={german} onClick={()=>setGerman(x=>!x)}>
       {german?"Deutsche Hilfe verbergen":"Deutsche Bedeutung zeigen"}</button>
     </div>
     {german?<p lang="de">{current.partnerGerman}</p>:null}
     {audioNotice?<p role="status">{audioNotice}</p>:null}
     <p>Wähle eine erste Antwort. Die dritte zeigt gezielt einen typischen Fehler –
      sie ist eine Lernroute, keine Empfehlung.</p>
     <div className="p56-interaction__choices" role="group" aria-label="Erste Gesprächsantwort wählen">
      <button type="button" aria-pressed={branch==="direct"} onClick={()=>take("direct")}>
       <span lang="ja">{current.routes.direct.opening}</span><small>Direkte Strategie</small>
      </button>
      <button type="button" aria-pressed={branch==="alternate"} onClick={()=>take("alternate")}>
       <span lang="ja">{current.routes.alternate.opening}</span><small>Alternative legitime Strategie</small>
      </button>
      <button type="button" aria-pressed={branch==="repair"} onClick={()=>take("repair")}>
       <span lang="ja">{current.mistake.misleading}</span><small>Missverständnis untersuchen</small>
      </button>
     </div>
     <button type="button" disabled={disabled} onClick={()=>onPractice(current.id,"decision")}>
      Eigene Entscheidung im ursprünglichen StudyPlayer treffen
     </button>
    </section>
    {route?<section className="p56-interaction__followup" aria-live="polite">
     <h5>2 · Unerwartete Antwort des Gegenübers</h5>
     <p>Deine erste Aussage: <span lang="ja">{route.first}</span></p>
     <p><strong>Neue Gegenfrage oder Korrektur:</strong></p>
     <p lang="ja" className="p56-interaction__partner">{route.partner}</p>
     <div className="p56-interaction__actions">
      <button type="button" onClick={()=>speak(route.partner)}>Antwort über Geräte-TTS hören</button>
      <button type="button" onClick={()=>setGerman(x=>!x)} aria-expanded={german}>
       {german?"Deutsche Bedeutungen verbergen":"Bedeutung der neuen Antwort anzeigen"}</button>
      <button type="button" onClick={()=>take(branch!)}>Diesen Zweig neu beantworten</button>
     </div>
     {german?<p>{route.partnerGerman}</p>:null}
     <p><strong>Neues Ziel:</strong> {route.task}</p>
     <label htmlFor="p56-draft">Deine nächste eigene vollständige japanische Antwort</label>
     <textarea id="p56-draft" rows={3} lang="ja" value={draft}
      onChange={e=>{setDraft(e.target.value);setAttempted(false);setModels(false)}}
      aria-keyshortcuts="Control+Enter Meta+Enter"
      onKeyDown={e=>{if(!e.nativeEvent.isComposing&&(e.metaKey||e.ctrlKey)&&e.key==="Enter"&&draft.trim()){
       e.preventDefault();setAttempted(true);
      }}}/>
     <div className="p56-interaction__actions">
      <button type="button" disabled={!draft.trim()} onClick={()=>setAttempted(true)}>
       Nach eigener Antwort mit Originalvarianten vergleichen
      </button>
      <button type="button" disabled={disabled} onClick={()=>onPractice(current.id,branch)}>
       Genau diesen Gesprächszweig im StudyPlayer üben
      </button>
     </div>
     {feedback?<div role="status" className="p56-interaction__feedback">
      <strong>{feedback.kind==="model"?"Originalantwort getroffen":
        feedback.kind==="misconception"?"Gezieltes Missverständnis":"Nicht semantisch bewertet"}</strong>
      <p>{feedback.message}</p><p>{route.explanation}</p>
      <button type="button" aria-expanded={models} onClick={()=>setModels(x=>!x)}>
       {models?"Originalbeispiele ausblenden":"Originalantworten erst jetzt zeigen"}</button>
      {models?<div><p lang="ja">{route.model}</p><p lang="ja">{route.alternative}</p>
       <p>Dieses Modellpaar bewertet keine weiteren natürlichen Varianten.</p></div>:null}
     </div>:null}
     <p><strong>Routenregel:</strong> {current.nuance}</p>
    </section>:null}
    <section>
     <h5>3 · Eigenständige kommunikative Übertragung</h5>
     <button type="button" aria-expanded={responseOpen} onClick={()=>setResponseOpen(x=>!x)}>
      {responseOpen?"Neue Aufgabe verbergen":"Weitere originelle Gesprächssituation öffnen"}
     </button>
     {responseOpen?<p>{current.production.situation}</p>:null}
     <div className="p56-interaction__actions">
      <button type="button" disabled={disabled} onClick={()=>onPractice(current.id,"production")}>
       Unabhängig im StudyPlayer formulieren
      </button>
      <button type="button" onClick={()=>onWriting(current.id)}>
       Im bestehenden Learn-Schreibeditor überarbeiten
      </button>
     </div>
    </section>
    <section>
     <h5>4 · P53-Vokabeln, registergerechte Kollokationen</h5>
     <p>{words.length} Originalverweise, davon {words.filter(w=>w.attested).length}
      in den originalen Partneräußerungen wörtlich belegt.</p>
     <button type="button" aria-expanded={wordsOpen} onClick={()=>setWordsOpen(x=>!x)}>
      {wordsOpen?"Verbindungen ausblenden":"Originale Wortfamilien und Kollokationen"}</button>
     {wordsOpen?<div className="p56-interaction__words">
      {words.map(w=><div key={w.id}>
       <strong lang="ja">{w.written}（{w.reading}）</strong> · {w.meaning}
       <small>{w.attested?"Wörtlicher Partnerbeleg":"Thematisch verknüpft"}</small>
       <p lang="ja">{w.collocations.join(" ／ ")}</p><p>{w.nuance}</p>
       {w.families.slice(0,1).map(f=><p key={f.id}>{f.explanation}</p>)}
      </div>)}
     </div>:null}
    </section>
    <section>
     <h5>5 · Neuer unbekannter Kontext nach Lernabstand</h5>
     <p>Der spätere Fall erscheint nicht in diesem Studio. Er wird erst nach
      einer tatsächlich fälligen Erstkarte oder nach mindestens 24 Stunden
      seit einem echten bewerteten Originalversuch freigegeben. Die Freigabe
      erfindet keinen fälligen FSRS-Termin.</p>
     <button type="button" disabled={disabled||!recallReadyIds.includes(current.id)}
      onClick={()=>onPractice(current.id,"return")}>Veränderten Kontext unabhängig abrufen</button>
     {!recallReadyIds.includes(current.id)?<small>Erst eigenständig im StudyPlayer
      antworten, dann Lernabstand abwarten.</small>:null}
    </section>
    <small>Alle Originaldialoge sind THIEPN-eigenes Material. Geräte-TTS ist
     synthetisch; keine Aufnahme, keine echte Live-Gesprächsbenotung,
     keine zweite Lernhistorie. Marugoto bleibt reine Referenz.</small>
   </article>
  </div>
 </section>;
}
