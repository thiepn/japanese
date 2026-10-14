import {useEffect,useRef,useState} from "react";
import {r4ForP60,type R4Line} from "../study/extensionR4";
import {r5RepairForR4} from "../study/sourceRepairsR5";
import "./r4-independent.css";
/** Optional, author-only ungraded independent A2 work.
 * Mounted for the full selected lesson even when its P60 step is hidden,
 * so moving between existing reading/listening/writing/reflection never loses
 * unsent Japanese prose. No raw text is ever sent to StudyEvents or storage.
 */
export function R4IndependentDossier({
 lessonId,stage,visible,disabled,onDirtyChange,onOriginalPractice,onOriginalWriting
}:{
 lessonId:string;stage:number;visible:boolean;disabled:boolean;
 onDirtyChange:(dirty:boolean)=>void;
 onOriginalPractice:()=>void;
 onOriginalWriting:(text:string,stage:"first"|"reply"|"transfer")=>void;
}){
 const dossier=r4ForP60(lessonId);
 const r5Repair=dossier?r5RepairForR4(dossier.id):undefined;
 const [sourceOpen,setSourceOpen]=useState(stage<=2);
 const [transcriptOpen,setTranscriptOpen]=useState(false);
 const [reveals,setReveals]=useState<readonly string[]>([]);
 const [draft,setDraft]=useState("");
 const [attempted,setAttempted]=useState(false);
 const [showModels,setShowModels]=useState(false);
 const [revisionDraft,setRevisionDraft]=useState("");
 const [revisionAttempt,setRevisionAttempt]=useState(false);
 const [replyDraft,setReplyDraft]=useState("");
 const [replyAttempt,setReplyAttempt]=useState(false);
 const [showReplies,setShowReplies]=useState(false);
 const [transferDraft,setTransferDraft]=useState("");
 const [transferAttempt,setTransferAttempt]=useState(false);
 const [showTransferModels,setShowTransferModels]=useState(false);
 const [speechStatus,setSpeechStatus]=useState("");
 const voiceToken=useRef(0);
 // Upward communication is a boolean only. We never write or transmit prose.
 useEffect(()=>{
  onDirtyChange(Boolean(draft.trim()||revisionDraft.trim()||replyDraft.trim()||transferDraft.trim()));
  return ()=>onDirtyChange(false);
 },[draft,revisionDraft,replyDraft,transferDraft,onDirtyChange]);
 useEffect(()=>{
  if(visible)return;
  voiceToken.current+=1;
  if(typeof window!=="undefined"&&"speechSynthesis" in window){
   window.speechSynthesis.cancel();
  }
 },[visible]);
 useEffect(()=>()=>{voiceToken.current+=1;
  if(typeof window!=="undefined"&&"speechSynthesis" in window){
   window.speechSynthesis.cancel();
  }
 },[]);
 if(!dossier)return null;
 const toggle=(id:string)=>setReveals(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id]);
 const lang=(line:R4Line,key:string)=><div className="r4-independent__source" key={key}>
  <small>{line.role}</small>
  <p lang="ja">{line.ja}</p>
  <button type="button" aria-expanded={reveals.includes(key)}
   onClick={()=>toggle(key)}>{reveals.includes(key)?"Deutsch verbergen":"Deutsche Bedeutung zeigen"}</button>
  {reveals.includes(key)?<p>{line.de}</p>:null}
 </div>;
 const stopSpeech=()=>{
  voiceToken.current+=1;
  if(typeof window!=="undefined"&&"speechSynthesis" in window)window.speechSynthesis.cancel();
 };
 const speak=(ja:string)=>{
  if(typeof window==="undefined"||!("speechSynthesis" in window)||
   typeof SpeechSynthesisUtterance==="undefined"){
   setSpeechStatus("Keine Gerätesprachsynthese verfügbar; der Text bleibt auf Wunsch lesbar.");return;
  }
  stopSpeech();setSpeechStatus("");
  const voice=window.speechSynthesis.getVoices().find(v=>v.lang.toLowerCase().startsWith("ja"));
  if(!voice)setSpeechStatus("Keine japanische Gerätestimme erkannt; Aussprache kann abweichen.");
  const token=voiceToken.current;
  const utterance=new SpeechSynthesisUtterance(ja);
  utterance.lang="ja-JP";utterance.rate=.85;
  if(voice)utterance.voice=voice;
  utterance.onerror=()=>{if(token===voiceToken.current){
   setSpeechStatus("Sprachausgabe nicht verfügbar. Originaltranskript öffnen.");
  }};
  window.speechSynthesis.speak(utterance);
 };
 const actions=(ready:boolean,handler:()=>void,label:string)=>
  <button type="button" disabled={!ready} onClick={handler}>{label}</button>;
 return <section className="r4-independent" aria-label={"Eigenständige A2-Vertiefung: "+dossier.title}>
  <header>
   <p className="r4-independent__eyebrow">R4 · Eigenständig mehrteilige Quellen übertragen</p>
   <h5 lang="ja">{dossier.title}</h5>
   <p>{dossier.purpose}</p>
   <p><strong>Adressat und Register:</strong> {dossier.register==="polite"?"Höfliche です／ます-Formen für institutionelle Kommunikation":"Natürliche vertraute Formulierungen für Bekannte"}</p>
   <p>Originaler Zusatzfall zur vorhandenen P60-Lektion. Verfasse zuerst
    eigene japanische Texte. Zwei zusätzliche Sprecherbeiträge und ein
    anderer Kontext fordern begründete Änderungen. <strong>Keine</strong> automatische
    Freitextprüfung, kein FSRS-Termin und kein A2-Zertifikat.</p>
  </header>
  <ol className="r4-independent__stages" aria-label="Drei eigenständige Versuche">
   <li>Schriftliche und gesprochene Quellen abgleichen</li>
   <li>Erste eigene Nachricht anhand zweier Belege überarbeiten</li>
   <li>Auf eine neue Aussage reagieren</li>
   <li>Andere Alltagssituation unabhängig lösen</li>
  </ol>
  <div className="r4-independent__section">
   <h6>1 · Originale Quellen und erste eigenständige Nachricht</h6>
   <button type="button" aria-expanded={sourceOpen}
    onClick={()=>setSourceOpen(v=>!v)}>
    {sourceOpen?"Zwei schriftliche Quellen einklappen":"Zwei Quellen selbständig aufrufen"}
   </button>
   {stage>=3?<small>Reduzierte Hilfe in Stufe {stage}:
    Quellen sind zunächst eingeklappt, aber immer selbst abrufbar.</small>:null}
   {sourceOpen?dossier.reading.map((v,i)=>lang(v,"source"+i)):null}
   <div className="r4-independent__speech">
    <strong>Neuer gesprochener Kontext · Gerätesynthese, keine gemessene Hörprüfung</strong>
    <div className="r4-independent__actions">
     {dossier.spoken.map((v,i)=><button key={i} type="button"
      onClick={()=>speak(v.ja)}>Sprecher {i+1} anhören</button>)}
     <button type="button" onClick={stopSpeech}>Wiedergabe stoppen</button>
     <button type="button" aria-expanded={transcriptOpen}
      onClick={()=>setTranscriptOpen(v=>!v)}>{transcriptOpen?"Transkript verbergen":"Transkript anzeigen"}</button>
    </div>
    {speechStatus?<p role="status">{speechStatus}</p>:null}
    {transcriptOpen?dossier.spoken.map((v,i)=>lang(v,"spoken"+i)):null}
   </div>
   <p><strong>Aufgabe:</strong> {dossier.task}</p>
   <label htmlFor={"r4-draft-"+dossier.id}>Deine eigene mehrteilige japanische Mitteilung (unbenotet)</label>
   <textarea id={"r4-draft-"+dossier.id} lang="ja" rows={6} value={draft}
    onChange={e=>{setDraft(e.target.value);setAttempted(false);setShowModels(false);
     setRevisionAttempt(false);}}
    aria-keyshortcuts="Control+Enter Meta+Enter"
    onKeyDown={e=>{if(!e.nativeEvent.isComposing&&(e.ctrlKey||e.metaKey)&&e.key==="Enter"&&draft.trim()){
     e.preventDefault();setAttempted(true);
    }}}/>
   <div className="r4-independent__actions">
    {actions(Boolean(draft.trim()),()=>setAttempted(true),"Eigene Antwort festhalten und Quellenhinweise öffnen")}
    <button type="button" disabled={disabled} onClick={onOriginalPractice}>
     Originale P60-Belegfrage im StudyPlayer üben</button>
   </div>
   {attempted?<div className="r4-independent__feedback" role="status">
    <strong>Belegbasierte Selbstprüfung, keine automatische Note</strong>
    {dossier.evidence.map((e,i)=><div key={i}>
     <p lang="ja">「{e.quote}」</p><p>{e.meaning}</p>
    </div>)}
    <ul>{dossier.selfCheck.map(x=><li key={x}>{x}</li>)}</ul>
    <p><strong>Konkreter möglicher Denkfehler:</strong> {dossier.misconception}</p>
    <div className="r4-independent__revision">
      <label htmlFor={"r5-rewrite-"+dossier.id}>
       Überarbeite die eigene erste japanische Nachricht anhand der gerade gezeigten Belege.
       Welche konkrete Behauptung muss genauer oder vorsichtiger werden?
      </label>
      <textarea id={"r5-rewrite-"+dossier.id} lang="ja" rows={6}
       value={revisionDraft} onChange={e=>{
        setRevisionDraft(e.target.value);setRevisionAttempt(false);setShowModels(false);
       }}/>
      <div className="r4-independent__actions">
       <button type="button" disabled={!revisionDraft.trim()||
        revisionDraft.trim()===draft.trim()} onClick={()=>setRevisionAttempt(true)}>
        Eigenständig überarbeitete zweite Fassung festhalten
       </button>
       <small>Die zweite Version muss sich vom ersten Text unterscheiden.
        Das ist nur eine Bearbeitungsbedingung, keine Sprachbewertung.</small>
      </div>
      {revisionAttempt?<div className="r4-independent__feedback" role="status">
       <strong>Zweite Fassung selbstständig erstellt · keine automatische Japanischbewertung</strong>
       {r5Repair?<details className="r4-independent__editorial">
        <summary>R5 · Beleg, fehlerhafte Schlussfolgerung und Höflichkeit genau unterscheiden</summary>
        <p><strong>Unbelegte Aussage:</strong></p>
        <p lang="ja">{r5Repair.wrongJapanese}</p>
        <p>{r5Repair.wrongGerman}</p>
        <p><strong>Quellengerechter Gegenbeleg:</strong></p>
        <p lang="ja">{r5Repair.groundedJapanese}</p>
        <p>{r5Repair.groundedGerman}</p>
        <p><strong>Warum:</strong> {r5Repair.sourceDistinction}</p>
        <p><strong>Angemessene Sprache:</strong> {r5Repair.registerContrast}</p>
        <p><strong>Neue eigenständige Reparaturaufgabe:</strong> {r5Repair.independentRepairTask}</p>
        <small>Originaler redaktioneller Lernhinweis, kein Urteil über deinen freien Text.
         Die zwei verfassten Modellantworten kannst du gesondert anzeigen.</small>
       </details>:null}
       <p>Prüfe die neue Fassung gegenüber den zitierten Quellen, dem Adressaten
        ({dossier.register==="polite"?"höfliche Nachricht":"vertrauliche Nachricht"})
        und dieser spezifischen Fehlannahme: {dossier.misconception}</p>
       <button type="button" aria-expanded={showModels}
        onClick={()=>setShowModels(v=>!v)}>{showModels?"Modelle verbergen":
         "Zwei original verfasste japanische Vergleichsbeispiele öffnen"}</button>
       {showModels?<div className="r4-independent__examples">
        {dossier.models.map((m,i)=><p lang="ja" key={i}>{m}</p>)}
        <p>Zu vermeidende Fehlbehauptung: <span lang="ja">{dossier.trap}</span></p>
       </div>:null}
      </div>:null}
    </div>
   </div>:null}
  </div>
  {revisionAttempt?<div className="r4-independent__section">
   <h6>3 · Eine neue Aussage verändert den Sachverhalt</h6>
   {lang(dossier.newMessage,"new-message")}
   <p><strong>Neue Aufgabe:</strong> {dossier.followupTask}</p>
   <label htmlFor={"r4-repair-"+dossier.id}>Eigenständige neue japanische Reaktion</label>
   <textarea id={"r4-repair-"+dossier.id} lang="ja" rows={5} value={replyDraft}
    onChange={e=>{setReplyDraft(e.target.value);setReplyAttempt(false);setShowReplies(false)}}/>
   {actions(Boolean(replyDraft.trim()),()=>setReplyAttempt(true),
    "Neue Antwort festhalten und Korrekturerklärung lesen")}
   {replyAttempt?<div className="r4-independent__feedback" role="status">
    <p><strong>Quellenbezogene Reparatur:</strong> {dossier.followupRepair}</p>
    <button type="button" aria-expanded={showReplies} onClick={()=>setShowReplies(v=>!v)}>
     {showReplies?"Antwortmodelle verbergen":"Zwei alternative neue Antworten vergleichen"}</button>
    {showReplies?<div className="r4-independent__examples">
     {dossier.followupModels.map((m,i)=><p lang="ja" key={i}>{m}</p>)}
     <p>Falsche Schlussfolgerung: <span lang="ja">{dossier.followupTrap}</span></p>
    </div>:null}
   </div>:null}
  </div>:null}
  {replyAttempt?<div className="r4-independent__section">
   <h6>4 · Anderer, erst jetzt gezeigter Kontext</h6>
   <p>{dossier.transfer.scenario}</p>
   <p><strong>Eigenständige Aufgabe:</strong> {dossier.transfer.task}</p>
   <label htmlFor={"r4-transfer-"+dossier.id}>Japanische Lösung für den anderen Alltag (unbenotet)</label>
   <textarea id={"r4-transfer-"+dossier.id} lang="ja" rows={5} value={transferDraft}
    onChange={e=>{setTransferDraft(e.target.value);setTransferAttempt(false);
     setShowTransferModels(false)}}/>
   {actions(Boolean(transferDraft.trim()),()=>setTransferAttempt(true),
    "Transferantwort festhalten und Beleggrenzen prüfen")}
   {transferAttempt?<div className="r4-independent__feedback" role="status">
    <p>{dossier.transfer.why}</p>
    <button type="button" aria-expanded={showTransferModels}
     onClick={()=>setShowTransferModels(v=>!v)}>
     {showTransferModels?"Neue Beispiele verbergen":"Originale neue Lösungsmöglichkeiten zeigen"}
    </button>
    {showTransferModels?<div className="r4-independent__examples">
     {dossier.transfer.models.map((m,i)=><p key={i} lang="ja">{m}</p>)}
     <p>Fehlerannahme: <span lang="ja">{dossier.transfer.trap}</span></p>
    </div>:null}
   </div>:null}
  </div>:null}
  <div className="r4-independent__actions">
   <button type="button" disabled={!revisionDraft.trim()&&!draft.trim()}
    onClick={()=>onOriginalWriting(revisionDraft.trim()||draft,"first")}>
    Eigenen ersten oder überarbeiteten Text im Original-Learn-Editor fortsetzen
   </button>
   {replyAttempt?<button type="button" disabled={!replyDraft.trim()}
    onClick={()=>onOriginalWriting(replyDraft,"reply")}>
    Antwort auf die geänderte Nachricht im Learn-Editor weiter überarbeiten
   </button>:null}
   {transferAttempt?<button type="button" disabled={!transferDraft.trim()}
    onClick={()=>onOriginalWriting(transferDraft,"transfer")}>
    Neue Kontextaufgabe mit deinem Text im Learn-Editor weiterführen
   </button>:null}
  </div>
  <small>Diese zusätzliche Originalaufgabe ist nicht als zeitversetzte FSRS-Rückkehr
   geplant. Der neue Kontext wird erst nach deiner zweiten Antwort sichtbar,
   aber dadurch wird kein Reviewtermin, Abschluss oder Kompetenznachweis erstellt.
   Die zweite eigene Fassung wird ausschließlich mit authored Quellenhinweisen
   verglichen, nicht automatisch benotet.
   Unvollendeter Text existiert nur im Speicher dieser geöffneten Seite.</small>
 </section>;
}
