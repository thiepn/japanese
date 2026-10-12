import {useEffect,useRef,useState} from "react";
import {saveStudyEvent} from "@thiepn/local-db";
import type {StudyEvent} from "@thiepn/domain";
import {gradeStudyPrompt} from "@thiepn/study-player";
import {DEVELOPMENT_DEVICE_ID,getDevelopmentAccountId,recordStudyAnswer} from "../study/runtime";
import {grammarReflection} from "../study/feedback27";
import {p32ContrastForUnit} from "../study/contrast32";
import {journeyUnit} from "../study/journey27";
import {p33RolesForUnit,p33RolePrompts} from "../study/role33";
import {p33RepairForScenario} from "../study/repair33";
import {p34AlternativesForTurn} from "../study/alternatives34";
import {p34RepairContinuationFor} from "../study/repair34";
import {p34RoleFeedback} from "../study/feedback34";
import {normalizeP26} from "../study/pedagogy26";
import "./p33-role.css";

interface AnswerFeedback{correctModel:boolean;independent:boolean;notes:string[];}
export function P33RolePractice({unitId,owner,disabled,onReviewed,dueCount,onReview,onGrammar}:{
  unitId:string;owner:string;disabled:boolean;onReviewed:()=>void;
  dueCount:number;onReview:()=>void;onGrammar:()=>void;
}){
  const scenarios=p33RolesForUnit(unitId);
  const [scenarioId,setScenarioId]=useState(scenarios[0]?.id??"");
  const [perspective,setPerspective]=useState<"guest"|"host">("guest");
  const [turnIndex,setTurnIndex]=useState(0);
  const [draft,setDraft]=useState("");
  const [firstDraft,setFirstDraft]=useState("");
  const [assisted,setAssisted]=useState(false);
  const [showPartner,setShowPartner]=useState(true);
  const [showMeaning,setShowMeaning]=useState(false);
  const [feedback,setFeedback]=useState<AnswerFeedback|null>(null);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [repairOpen,setRepairOpen]=useState(false);
  const [repairDraft,setRepairDraft]=useState("");
  const [repairDone,setRepairDone]=useState(false);
  const [followupDraft,setFollowupDraft]=useState("");
  const [followupDone,setFollowupDone]=useState(false);
  const [completedRoles,setCompletedRoles]=useState<Set<string>>(()=>new Set());
  const exposed=useRef(new Set<string>());
  const startTime=useRef(0);
  const ownerRef=useRef(owner);ownerRef.current=owner;
  const scenario=scenarios.find(s=>s.id===scenarioId)??scenarios[0];
  const role=scenario?.roles.find(r=>r.id===perspective)??scenario?.roles[0];
  const turn=role?.turns[turnIndex];
  const repair=p33RepairForScenario(scenario?.id??"");
  const repairFollowup=p34RepairContinuationFor(scenario?.id??"");
  const alternatives=p34AlternativesForTurn(scenario?.id??"",perspective,turnIndex);
  const identity=scenario?.id+":"+perspective+":"+turnIndex;
  const completedInScenario=(scenario?.roles??[]).filter(r=>completedRoles.has(scenario!.id+":"+r.id)).length;
  const prompt=p33RolePrompts.find(p=>p.eventMetadata?.scenarioId===scenario?.id&&
    p.eventMetadata?.role===perspective&&p.eventMetadata?.turnIndex===turnIndex);
  useEffect(()=>{
    setScenarioId(p33RolesForUnit(unitId)[0]?.id??"");
    setPerspective("guest");setTurnIndex(0);setDraft("");setFirstDraft("");
    setAssisted(false);setFeedback(null);setBusy(false);setError("");
    setRepairOpen(false);setRepairDraft("");setRepairDone(false);
    setFollowupDraft("");setFollowupDone(false);
    setShowPartner(true);setShowMeaning(false);exposed.current.clear();
    setCompletedRoles(new Set());
    startTime.current=performance.now();
  },[unitId,owner]);
  function switchPath(id:string,p:"guest"|"host"){
    if(busy)return;
    setScenarioId(id);setPerspective(p);setTurnIndex(0);setDraft("");setFirstDraft("");
    setFeedback(null);setAssisted(false);setError("");setShowPartner(true);setShowMeaning(false);
    setRepairOpen(false);setRepairDraft("");setRepairDone(false);
    setFollowupDraft("");setFollowupDone(false);
    startTime.current=performance.now();
  }
  function playPartner(){
    if(!turn||!("speechSynthesis" in window))return;
    window.speechSynthesis.cancel();
    const utterance=new SpeechSynthesisUtterance(turn.partner);
    utterance.lang="ja-JP";utterance.rate=.83;
    window.speechSynthesis.speak(utterance);
  }
  async function ungraded(response:string){
    if(ownerRef.current!==getDevelopmentAccountId())throw new Error("P33_WORKSPACE_CHANGED");
    const event:StudyEvent={
      id:crypto.randomUUID(),userId:ownerRef.current,deviceId:DEVELOPMENT_DEVICE_ID,
      occurredAt:new Date().toISOString(),activity:"writing",
      primaryTarget:{kind:"production_task",id:"p33:role:"+scenario!.id},
      skillDimension:"production",promptFamily:"p33-free-role-response",
      responseMode:"typed",result:"skipped",attempts:1,
      contextId:"p33:role:"+scenario!.id,sourceId:"thiepn-original",contentVersion:"p33-1",
      metadata:{p33:true,kind:"role-ungraded",unitId,scenarioId:scenario!.id,
        role:perspective,turnIndex,assisted:assisted||exposed.current.has(identity),
        schedulerExcluded:true,rawTextStored:false,length:[...normalizeP26(response)].length}
    };
    await saveStudyEvent(event);
  }
  async function submit(){
    if(!prompt||!turn||!draft.trim()||busy||feedback||disabled)return;
    const account=ownerRef.current;
    if(account!==getDevelopmentAccountId())return;
    const matched=gradeStudyPrompt(prompt,normalizeP26(draft)).result==="correct";
    const independent=matched&&!assisted&&!exposed.current.has(identity);
    setBusy(true);setError("");
    try{
      if(independent){
        await recordStudyAnswer({prompt,response:normalizeP26(draft),result:"correct",
          responseTimeMs:Math.max(0,Math.round(performance.now()-startTime.current))});
      }else await ungraded(draft);
      if(account!==ownerRef.current)return;
      if(!firstDraft)setFirstDraft(draft);
      exposed.current.add(identity);
      setAssisted(true);
      setFeedback({correctModel:matched,independent,notes:[
        turn.gloss,...grammarReflection(journeyUnit(unitId),draft),
        ...p34RoleFeedback(scenario!.id,draft),
        ...(p32ContrastForUnit(unitId)?[p32ContrastForUnit(unitId)!.explanation]:[]),
        "Weitere natürlich richtige Formulierungen sind möglich und werden hier nicht automatisch bewertet."
      ]});
      onReviewed();
    }catch{if(account===ownerRef.current)setError("Antwort konnte nicht gespeichert werden. Erneut versuchen.");}
    finally{if(account===ownerRef.current)setBusy(false);}
  }
  async function submitRepair(){
    if(!repair||!repairDraft.trim()||busy||disabled||repairDone)return;
    const account=ownerRef.current;
    if(account!==getDevelopmentAccountId())return;
    const event:StudyEvent={
      id:crypto.randomUUID(),userId:account,deviceId:DEVELOPMENT_DEVICE_ID,
      occurredAt:new Date().toISOString(),activity:"writing",
      primaryTarget:{kind:"production_task",id:"p33:repair:"+scenario!.id},
      skillDimension:"production",promptFamily:"p33-clarification-repair",
      responseMode:"typed",result:"skipped",attempts:1,
      contextId:"p33:role:"+scenario!.id,sourceId:"thiepn-original",contentVersion:"p33-1",
      metadata:{p33:true,kind:"repair-ungraded",unitId,scenarioId:scenario!.id,
        role:perspective,turnIndex,schedulerExcluded:true,rawTextStored:false,
        length:[...normalizeP26(repairDraft)].length}
    };
    setBusy(true);setError("");
    try{
      await saveStudyEvent(event);
      if(ownerRef.current!==account)return;
      exposed.current.add(identity);
      setAssisted(true);setRepairDone(true);onReviewed();
    }catch{if(ownerRef.current===account)setError("Rückfrage konnte nicht gespeichert werden.");}
    finally{if(ownerRef.current===account)setBusy(false);}
  }
  async function submitRepairFollowup(){
    if(!repairFollowup||!followupDraft.trim()||!repairDone||followupDone||disabled||busy)return;
    const account=ownerRef.current;
    if(account!==getDevelopmentAccountId())return;
    const event:StudyEvent={
      id:crypto.randomUUID(),userId:account,deviceId:DEVELOPMENT_DEVICE_ID,
      occurredAt:new Date().toISOString(),activity:"writing",
      primaryTarget:{kind:"production_task",id:"p34:repair-followup:"+scenario!.id},
      skillDimension:"production",promptFamily:"p34-clarification-continuation",
      responseMode:"typed",result:"skipped",attempts:1,
      contextId:"p33:role:"+scenario!.id,sourceId:"thiepn-original",contentVersion:"p34-1",
      metadata:{p34:true,kind:"repair-continuation",unitId,scenarioId:scenario!.id,
        role:perspective,turnIndex,schedulerExcluded:true,rawTextStored:false,
        length:[...normalizeP26(followupDraft)].length}
    };
    setBusy(true);setError("");
    try{
      await saveStudyEvent(event);
      if(ownerRef.current!==account)return;
      setFollowupDone(true);
      exposed.current.add(identity);
      setAssisted(true);onReviewed();
    }catch{if(ownerRef.current===account)setError("Anschlussantwort konnte nicht gespeichert werden.");}
    finally{if(ownerRef.current===account)setBusy(false);}
  }
  function next(){
    if(!role)return;
    if(turnIndex+1<role.turns.length)setTurnIndex(t=>t+1);
    else{
      const completedKey=scenario!.id+":"+perspective;
      setCompletedRoles(previous=>new Set([...previous,completedKey]));
      setTurnIndex(0);setPerspective(p=>p==="guest"?"host":"guest");
    }
    setDraft("");setFirstDraft("");setAssisted(false);setFeedback(null);setError("");
    setRepairOpen(false);setRepairDraft("");setRepairDone(false);
    setFollowupDraft("");setFollowupDone(false);
    setShowMeaning(false);startTime.current=performance.now();
  }
  if(!scenario||!role||!turn)return null;
  return <section className="p33-role" aria-labelledby="p33-role-title">
    <h4 id="p33-role-title">Rollenwechsel: selbst antworten</h4>
    <p>In zwei aufeinanderfolgenden Runden reagieren. Danach kannst du die Perspektive tauschen. Freie Alternativen bleiben unbewertet.</p>
    {dueCount>0?<div className="p33-role__due">
      <p><strong>{dueCount} FSRS-Karten dieser Einheit jetzt fällig.</strong>
        Du kannst den Dialog weiterüben oder die gespeicherte Wiederholungsrunde direkt öffnen.</p>
      <button type="button" disabled={disabled||busy} onClick={onReview}>
        {dueCount} fällige Karten im StudyPlayer wiederholen
      </button>
    </div>:<p className="p33-role__due-note">
      Keine bekannten fälligen Karten dieser Einheit. Neue Dialoge sind freiwillige Übung, keine überfällige Wiederholung.
    </p>}
    <div role="group" aria-label="Situationsauswahl" className="p33-role__choices">
      {scenarios.map(s=><button type="button" key={s.id} disabled={busy}
        aria-pressed={scenario.id===s.id} onClick={()=>switchPath(s.id,perspective)}>{s.title}</button>)}
    </div>
    <div role="group" aria-label="Deine Rolle" className="p33-role__choices">
      {scenario.roles.map(r=><button type="button" key={r.id} disabled={busy}
        aria-pressed={perspective===r.id} onClick={()=>switchPath(scenario.id,r.id)}>
        Als {r.label} antworten</button>)}
    </div>
    <div className="p33-role__position" aria-live="polite">
      <p><strong>{role.label}</strong> · Antwort {turnIndex+1} von {role.turns.length}</p>
      <p>Rollendurchläufe dieser Sitzung: {completedInScenario} von {scenario.roles.length}.
        Das ist keine gespeicherte Beherrschungsbewertung.</p>
      {completedInScenario===scenario.roles.length?<p>
        Beide Rollen wurden mindestens einmal abgeschlossen. Du kannst andere Formulierungen ausprobieren
        oder fällige FSRS-Karten wiederholen.</p>:null}
    </div>
    <div className="p33-role__partner">
      <button type="button" onClick={playPartner} disabled={busy}>Gesprächspartner synthetisch anhören</button>
      <label><input type="checkbox" checked={showPartner} onChange={e=>setShowPartner(e.target.checked)}/> Japanischen Gesprächspartner zeigen</label>
      {showPartner?<p lang="ja">{turn.partner}</p>:<p>Nur hören und selbst antworten. Synthetische Stimme; keine Aussprachebewertung.</p>}
      <label><input type="checkbox" checked={showMeaning} onChange={e=>{setShowMeaning(e.target.checked);if(e.target.checked){setAssisted(true);exposed.current.add(identity);}}}/> Deutsche Verständnisstütze</label>
      {showMeaning?<p>{turn.meaning} · Mit deutscher Hilfe ist diese Antwort unbewertete Übung.</p>:null}
    </div>
    {repair?<div className="p33-role__repair">
      <button type="button" disabled={disabled||busy||Boolean(feedback)}
        onClick={()=>{
          setRepairOpen(v=>!v);
          setAssisted(true);exposed.current.add(identity);
        }}>{repairOpen?"Verständnisreparatur schließen":"Ich habe nicht verstanden: Rückfrage formulieren"}</button>
      {repairOpen?<div>
        <p><strong>Verständnisproblem:</strong> <span lang="ja">{repair.partner}</span></p>
        <p>{repair.meaning}</p>
        <label htmlFor="p33-repair-draft">Bitte auf Japanisch um Wiederholung oder Erklärung</label>
        <textarea id="p33-repair-draft" lang="ja" rows={2} value={repairDraft}
          onKeyDown={e=>{if((e.ctrlKey||e.metaKey)&&e.key==="Enter"){
            e.preventDefault();if(!busy&&!repairDone&&!disabled)void submitRepair();
          }}}
          disabled={busy||repairDone} onChange={e=>setRepairDraft(e.target.value)}/>
        <button type="button" disabled={disabled||busy||repairDone||!repairDraft.trim()}
          onClick={()=>void submitRepair()}>Rückfrage vergleichen (unbewertet)</button>
        {repairDone?<div role="status">
          <p>Muster für eine Bitte: <span lang="ja">{repair.model}</span> · {repair.gloss}</p>
          <p>{repair.explanation}</p>
          <p><strong>Partner erklärt:</strong> <span lang="ja">{repair.clarification}</span>
            {" — "}{repair.clarificationMeaning}</p>
          {repairFollowup?<div className="p33-role__repair-next">
            <h5>2 · Nach der Erklärung weiterreden</h5>
            <p>So könntest du auf die Klärung reagieren:
              <span lang="ja"> {repairFollowup.clarifiedAnswer}</span> — {repairFollowup.clarifiedMeaning}</p>
            <p>Der Partner fragt weiter:
              <span lang="ja"> {repairFollowup.partnerFollowup}</span> — {repairFollowup.partnerMeaning}</p>
            <label htmlFor="p34-repair-followup">Formuliere selbst eine Anschlussantwort</label>
            <textarea id="p34-repair-followup" lang="ja" rows={2} value={followupDraft}
              onKeyDown={e=>{if((e.ctrlKey||e.metaKey)&&e.key==="Enter"){
                e.preventDefault();if(!busy&&!followupDone&&!disabled)void submitRepairFollowup();
              }}}
              disabled={busy||followupDone} onChange={e=>setFollowupDraft(e.target.value)}/>
            <button type="button" disabled={disabled||busy||followupDone||!followupDraft.trim()}
              onClick={()=>void submitRepairFollowup()}>Anschlussantwort vergleichen (unbewertet)</button>
            {followupDone?<div role="status">
              <p>Ein mögliches Muster:
                <span lang="ja"> {repairFollowup.modelReply}</span> — {repairFollowup.modelMeaning}</p>
              <p>{repairFollowup.note}</p>
              <p>Eine freie Alternative ist nicht automatisch falsch. Diese Reparatur verleiht keine FSRS-Beherrschung.</p>
            </div>:null}
          </div>:null}
          <button type="button" onClick={()=>setRepairOpen(false)}>Zum ursprünglichen Gespräch zurück</button>
        </div>:null}
      </div>:null}
    </div>:null}
    <label htmlFor="p33-role-draft">Deine japanische Antwort</label>
    <textarea id="p33-role-draft" value={draft} onChange={e=>setDraft(e.target.value)}
      onKeyDown={e=>{if((e.ctrlKey||e.metaKey)&&e.key==="Enter"){
        e.preventDefault();if(!busy&&!repairOpen&&!feedback&&!disabled)void submit();
      }}}
      disabled={busy||repairOpen||Boolean(feedback)} rows={3} lang="ja"/>
    <small className="p33-role__shortcut">Strg + Enter (Mac: ⌘ + Enter): Antwort vergleichen</small>
    <div className="p33-role__actions">
      <button type="button" disabled={busy||Boolean(feedback)} onClick={()=>{setAssisted(true);exposed.current.add(identity);}}>
        {assisted?"Mit Hilfe · unbewertet":"Hinweis zum Gesprächsziel"}</button>
      <button type="button" disabled={disabled||busy||repairOpen||Boolean(feedback)||!draft.trim()}
        onClick={()=>void submit()}>Antwort vergleichen</button>
    </div>
    {assisted&&!feedback?<p role="status">Aufgabe: {turn.gloss}. Die nächste Eingabe zählt nicht als unabhängiger FSRS-Abruf.</p>:null}
    {feedback?<div className="p33-role__feedback" role="status">
      <strong>{feedback.independent?"Geübte Antwort unabhängig getroffen":
        feedback.correctModel?"Geübte Form mit Hilfe getroffen":"Eigene Alternative · unbewertet"}</strong>
      <p>Mögliche Antwort: <span lang="ja">{turn.model}</span></p>
      {alternatives.length?<details className="p33-role__alternatives">
        <summary>Weitere kontextuell passende Antworten ({alternatives.length})</summary>
        <ul>{alternatives.map((alt,i)=><li key={i}>
          <p lang="ja">{alt.answer}</p><p>{alt.nuance}</p></li>)}</ul>
      </details>:null}
      {firstDraft&&draft!==firstDraft?<div className="p33-role__revision">
        <strong>Überarbeitung – nicht bewertet</strong>
        <p>Erste Fassung: <span lang="ja">{firstDraft}</span></p>
        <p>Neue Fassung: <span lang="ja">{draft}</span></p>
      </div>:null}
      <ul>{feedback.notes.map((note,i)=><li key={i}>{note}</li>)}</ul>
      <div className="p33-role__actions">
        <button type="button" disabled={disabled} onClick={onGrammar}>
          Partikeln und Höflichkeit im StudyPlayer vertiefen</button>
        <button type="button" onClick={()=>{
          setFeedback(null);setAssisted(true);startTime.current=performance.now();
        }}>Antwort überarbeiten (unbewertet)</button>
        <button type="button" onClick={next}>Nächste Antwort / Rolle wechseln</button>
      </div>
    </div>:null}
    {error?<p role="alert">{error}</p>:null}
  </section>;
}
