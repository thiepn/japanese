import {useEffect,useRef,useState} from "react";
import {saveStudyEvent} from "@thiepn/local-db";
import type {StudyEvent} from "@thiepn/domain";
import {gradeStudyPrompt} from "@thiepn/study-player";
import {DEVELOPMENT_DEVICE_ID,getDevelopmentAccountId,recordStudyAnswer} from "../study/runtime";
import {grammarReflection} from "../study/feedback27";
import {journeyUnit} from "../study/journey27";
import {normalizeP26} from "../study/pedagogy26";
import {describeP29Revision,p29RegisterExampleForUnit} from "../study/revision29";
import {
  continuityForUnit,continuityPrompt,chooseContinuityNext,
  type ContinuityReply
} from "../study/continuity28";
import "./p28-continuity.css";
interface ContinuityFeedback{
  message:string;next:string|null;model:string;notes:string[];
}
export function P28Continuity({
  unitId,owner,disabled,onReviewed,onOpenUnit
}:{
  unitId:string;owner:string;disabled:boolean;onReviewed:()=>void;onOpenUnit:(id:string)=>void
}){
  const scenario=continuityForUnit(unitId);
  const accountRef=useRef(owner);accountRef.current=owner;
  const [started,setStarted]=useState(false);
  const [nodeId,setNodeId]=useState("start");
  const [count,setCount]=useState(0);
  const [mode,setMode]=useState<"typed"|"choice">("typed");
  const [draft,setDraft]=useState("");
  const [feedback,setFeedback]=useState<ContinuityFeedback|null>(null);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [showMeaning,setShowMeaning]=useState(false);
  const [firstDraft,setFirstDraft]=useState("");
  const [revisions,setRevisions]=useState(0);
  const [modelRevealed,setModelRevealed]=useState(false);
  const startedAt=useRef(0);
  const node=scenario?.turns.find(t=>t.id===nodeId)??scenario?.turns[0];
  const register=p29RegisterExampleForUnit(unitId);
  const revision=firstDraft&&draft&&revisions>0?describeP29Revision(firstDraft,draft,journeyUnit(unitId)):null;
  useEffect(()=>{
    setStarted(false);setNodeId("start");setCount(0);setMode("typed");
    setDraft("");setFeedback(null);setError("");setShowMeaning(false);setBusy(false);
    setFirstDraft("");setRevisions(0);setModelRevealed(false);
    startedAt.current=performance.now();
  },[unitId,owner]);
  if(!scenario||!node)return null;
  async function saveUngraded(response:string){
    const account=accountRef.current;
    if(account!==getDevelopmentAccountId())throw new Error("P28_WORKSPACE_CHANGED");
    const event:StudyEvent={
      id:crypto.randomUUID(),userId:account,deviceId:DEVELOPMENT_DEVICE_ID,
      occurredAt:new Date().toISOString(),activity:"writing",
      primaryTarget:{kind:"production_task",id:"p28:continuity:"+scenario!.id},
      skillDimension:"production",promptFamily:"p28-extended-dialogue",
      responseMode:"typed",result:"skipped",attempts:1,
      contextId:"p28:continuity:"+scenario!.id,
      sourceId:"thiepn-original",contentVersion:"p28-1",
      metadata:{p28:true,kind:"continuity-ungraded",scenarioId:scenario!.id,
        turnId:node!.id,helpUsed:modelRevealed,revisions, revisedAfterModel:revisions>0,textStored:false,
        characters:[...normalizeP26(response)].length,schedulerExcluded:true}
    };
    await saveStudyEvent(event);
  }
  async function submit(response:string,kind:"typed"|"choice"){
    if(busy||feedback||disabled)return;
    const account=accountRef.current;
    if(account!==getDevelopmentAccountId())return;
    const prompt=continuityPrompt(scenario!,node!,kind);
    const grade=gradeStudyPrompt(prompt,response);
    const accepted=grade.result==="correct";
    const independentlyProduced=kind==="typed"&&accepted&&!modelRevealed&&revisions===0;
    const choice=node!.choices.find(c=>normalizeP26(c.japanese)===normalizeP26(response));
    const next=choice?.next??node!.id;
    setBusy(true);setError("");
    try{
      if(kind==="choice"||independentlyProduced){
        await recordStudyAnswer({
          prompt,response,result:grade.result,
          responseTimeMs:Math.max(0,Math.round(performance.now()-startedAt.current))
        });
      }else await saveUngraded(response);
      if(accountRef.current!==account)return;
      if(kind==="typed"&&!firstDraft)setFirstDraft(response);
      setModelRevealed(true);
      setFeedback({
        message:kind==="choice"?(accepted?"Passende situationsbezogene Wahl.":"Diese Antwort führt zu einer Reparatur.")
          :independentlyProduced?"Eine der geübten Zielformen unabhängig produziert; FSRS-Ereignis gespeichert."
            :accepted?"Geübte Zielform bei einer Überarbeitung getroffen; wegen zuvor gezeigter Hilfe unbewertet."
            :"Freie andere Formulierung: nicht automatisch beurteilbar und nicht als Fehler eingestuft.",
        model:node!.choices.find(c=>c.appropriate)?.japanese??"",
        next,
        notes:[
          choice?.note??"Die Referenzantworten decken nicht alle sprachlich richtigen Varianten ab.",
          ...grammarReflection(journeyUnit(unitId),response)
        ]
      });
      onReviewed();
    }catch{
      if(accountRef.current===account)setError("Antwort konnte nicht gespeichert werden. Erneut versuchen.");
    }finally{if(accountRef.current===account)setBusy(false);}
  }
  function advance(next:string|null){
    setCount(n=>n+1);setNodeId(next??"__done__");setDraft("");
    setFeedback(null);setError("");setFirstDraft("");setRevisions(0);setModelRevealed(false);
    startedAt.current=performance.now();
  }
  const completed=nodeId==="__done__";
  return <section className="p28-continuity" aria-labelledby="p28-continuity-title">
    <header>
      <small>KONTEXTWECHSEL · AKTIVE KOMMUNIKATION</small>
      <h4 id="p28-continuity-title">{scenario.title}</h4>
      <p>{scenario.situation}</p>
    </header>
    {!started?<button type="button" onClick={()=>{setStarted(true);startedAt.current=performance.now();}}>
      Folgegespräch mit neuem Kontext starten</button>:completed||count>=10?<div role="status" className="p28-continuity__feedback">
      <strong>{completed?"Folgegespräch abgeschlossen":"Nach mehreren Reparaturen beendet"}</strong>
      <p>Der nächste Kontext ist Teil desselben A1–A2-Lernwegs; bisherige Antworten bleiben in StudyEvents.</p>
      <div className="p28-continuity__actions">
        <button type="button" onClick={()=>onOpenUnit(scenario.destinationUnitId)}>
          Verknüpfte nächste Einheit öffnen</button>
        <button type="button" onClick={()=>{setCount(0);setNodeId("start");setFeedback(null);setDraft("");setFirstDraft("");setRevisions(0);setModelRevealed(false);startedAt.current=performance.now();}}>
          Folgegespräch erneut beginnen</button>
      </div>
    </div>:<div className="p28-continuity__dialogue">
      <p><strong>Folgeschritt {count+1}</strong> · deine Entscheidung verändert die nächste Nachfrage.</p>
      <blockquote><p lang="ja">{node.partner}</p>{showMeaning?<small>{node.meaning}</small>:null}</blockquote>
      <label className="p28-continuity__check"><input type="checkbox" checked={showMeaning}
        onChange={e=>setShowMeaning(e.target.checked)}/> Deutsche Bedeutung anzeigen</label>
      <div className="p28-continuity__mode" role="group" aria-label="Antwortmodus">
        <button type="button" aria-pressed={mode==="typed"} disabled={busy} onClick={()=>{setMode("typed");setFeedback(null);}}>Selbst eintippen</button>
        <button type="button" aria-pressed={mode==="choice"} disabled={busy} onClick={()=>{setMode("choice");setFeedback(null);}}>Antwortauswahl</button>
      </div>
      {mode==="typed"?<div>
        <label htmlFor="p28-continuity-draft">Japanische Antwort</label>
        <textarea id="p28-continuity-draft" lang="ja" rows={3} value={draft}
          disabled={Boolean(feedback)||busy} onChange={e=>setDraft(e.target.value)}/>
        <button type="button" disabled={disabled||busy||Boolean(feedback)||!draft.trim()}
          onClick={()=>void submit(draft,"typed")}>Antwort prüfen</button>
      </div>:<div className="p28-continuity__choices">
        {node.choices.map((c:ContinuityReply,i)=><button key={i} type="button" disabled={disabled||busy||Boolean(feedback)}
          onClick={()=>void submit(c.japanese,"choice")}>
          <span lang="ja">{c.japanese}</span>{showMeaning?<small>{c.meaning}</small>:null}</button>)}
      </div>}
      {feedback?<div className="p28-continuity__feedback" role="status">
        <strong>{feedback.message}</strong>
        <p>Mögliche Antwort: <span lang="ja">{feedback.model}</span></p>
        {revision?<div className="p28-continuity__revision">
          <strong>Vorher–nachher-Beobachtung (keine Qualitätsnote)</strong>
          <p>Zeichen {revision.beforeLength} → {revision.afterLength} · Änderung {revision.changed?"ja":"nein"}</p>
          <p>Neu sichtbare Partikeln: {revision.addedParticles.join(" · ")||"keine"}</p>
          <p>Nicht mehr sichtbare Partikeln: {revision.removedParticles.join(" · ")||"keine"}</p>
          <ul>{revision.suggestions.map((note,i)=><li key={i}>{note}</li>)}</ul>
        </div>:null}
        {register?<details>
          <summary>Höflichkeitskontrast zum Thema</summary>
          <p>Höflich: <span lang="ja">{register.polite}</span></p>
          <p>Informell: <span lang="ja">{register.casual}</span></p>
          <p>{register.explanation}</p>
        </details>:null}
        <ul>{feedback.notes.map((n,i)=><li key={i}>{n}</li>)}</ul>
        <div className="p28-continuity__actions">
          <button type="button" onClick={()=>{setFeedback(null);setRevisions(n=>n+1);setModelRevealed(true);startedAt.current=performance.now();}}>Antwort überarbeiten (erste Fassung bleibt erhalten)</button>
          <button type="button" onClick={()=>advance(feedback.next)}>Gespräch fortsetzen</button>
          {feedback.next===node.id?<button type="button" onClick={()=>advance(node.choices.find(c=>c.appropriate)?.next??null)}>
            Ohne Bewertung einen möglichen Weg wählen</button>:null}
        </div>
      </div>:null}
      {error?<p role="alert">{error}</p>:null}
    </div>}
    <p className="p28-continuity__caveat">Auswahlen und unabhängig geschriebene geübte Formen erzeugen Lernereignisse. Revisionen nach Musteranzeige und unbekannte freie Antworten bleiben unbewertet; grammatische oder semantische Richtigkeit wird nicht automatisch garantiert.</p>
  </section>;
}
