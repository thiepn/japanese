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
import {p35AlternativesForTurn} from "../study/alternatives35";
import {p34RepairContinuationFor} from "../study/repair34";
import {p34RoleFeedback} from "../study/feedback34";
import {p36IntentsForRole} from "../study/intent36";
import {P37ResponseRevision} from "./P37ResponseRevision";
import {p36CorrectionsForScenario,p36CorrectionRecognized} from "../study/correction36";
import {p37CorrectionAlternativesFor} from "../study/correction37";
import {normalizeP26} from "../study/pedagogy26";
import type {MemoryTrace} from "@thiepn/scheduler";
import {dueP36RolePrompts} from "../study/roleDue36";
import "./p33-role.css";

interface AnswerFeedback{correctModel:boolean;independent:boolean;notes:string[];}
export function P33RolePractice({unitId,owner,disabled,onReviewed,dueCount,onReview,onGrammar,traces,onRoleDue}:{
  unitId:string;owner:string;disabled:boolean;onReviewed:()=>void;
  dueCount:number;onReview:()=>void;onGrammar:()=>void;
  traces:readonly MemoryTrace[];onRoleDue:(scenarioId:string)=>void;
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
  const [intentPathId,setIntentPathId]=useState("");
  const [intentStage,setIntentStage]=useState<"idle"|"first"|"second"|"complete">("idle");
  const [intentFirst,setIntentFirst]=useState("");
  const [intentSecond,setIntentSecond]=useState("");
  const [correctionId,setCorrectionId]=useState("");
  const [correctionDraft,setCorrectionDraft]=useState("");
  const [correctionMatch,setCorrectionMatch]=useState<boolean|null>(null);
  const exposed=useRef(new Set<string>());
  const startTime=useRef(0);
  const ownerRef=useRef(owner);ownerRef.current=owner;
  const scenario=scenarios.find(s=>s.id===scenarioId)??scenarios[0];
  const role=scenario?.roles.find(r=>r.id===perspective)??scenario?.roles[0];
  const scenarioDue=scenario?dueP36RolePrompts(unitId,scenario.id,traces).length:0;
  const turn=role?.turns[turnIndex];
  const repair=p33RepairForScenario(scenario?.id??"");
  const repairFollowup=p34RepairContinuationFor(scenario?.id??"");
  const intentPaths=p36IntentsForRole(scenario?.id??"",perspective);
  const intentPath=intentPaths.find(p=>p.id===intentPathId);
  const corrections=p36CorrectionsForScenario(scenario?.id??"");
  const correction=corrections.find(c=>c.id===correctionId);
  const correctionAlternatives=p37CorrectionAlternativesFor(correctionId);
  const alternatives=[
    ...p34AlternativesForTurn(scenario?.id??"",perspective,turnIndex),
    ...p35AlternativesForTurn(scenario?.id??"",perspective,turnIndex)
  ];
  const identity=scenario?.id+":"+perspective+":"+turnIndex;
  const completedInScenario=(scenario?.roles??[]).filter(r=>completedRoles.has(scenario!.id+":"+r.id)).length;
  const prompt=p33RolePrompts.find(p=>p.eventMetadata?.scenarioId===scenario?.id&&
    p.eventMetadata?.role===perspective&&p.eventMetadata?.turnIndex===turnIndex);
  function resetIntents(){
    setIntentPathId("");setIntentStage("idle");setIntentFirst("");setIntentSecond("");
  }
  function resetCorrection(){
    setCorrectionId("");setCorrectionDraft("");setCorrectionMatch(null);
  }
  useEffect(()=>{
    setScenarioId(p33RolesForUnit(unitId)[0]?.id??"");
    setPerspective("guest");setTurnIndex(0);setDraft("");setFirstDraft("");
    setAssisted(false);setFeedback(null);setBusy(false);setError("");
    setRepairOpen(false);setRepairDraft("");setRepairDone(false);
    setFollowupDraft("");setFollowupDone(false);
    setShowPartner(true);setShowMeaning(false);exposed.current.clear();
    setCompletedRoles(new Set());resetIntents();resetCorrection();
    startTime.current=performance.now();
  },[unitId,owner]);
  function switchPath(id:string,p:"guest"|"host"){
    if(busy)return;
    setScenarioId(id);setPerspective(p);setTurnIndex(0);setDraft("");setFirstDraft("");
    setFeedback(null);setAssisted(false);setError("");setShowPartner(true);setShowMeaning(false);
    setRepairOpen(false);setRepairDraft("");setRepairDone(false);
    setFollowupDraft("");setFollowupDone(false);resetIntents();resetCorrection();
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
  async function submitIntentStep(stage:"first"|"second"){
    const active=intentPath;
    const text=stage==="first"?intentFirst:intentSecond;
    if(!active||!text.trim()||busy||disabled||!feedback||
      intentStage!==stage||ownerRef.current!==getDevelopmentAccountId())return;
    const account=ownerRef.current;
    setBusy(true);setError("");
    try{
      const event:StudyEvent={
        id:crypto.randomUUID(),userId:account,deviceId:DEVELOPMENT_DEVICE_ID,
        occurredAt:new Date().toISOString(),activity:"writing",
        primaryTarget:{kind:"production_task",id:"p36:intent:"+scenario!.id},
        skillDimension:"production",promptFamily:"p36-contextual-intent-response",
        responseMode:"typed",result:"skipped",attempts:1,
        contextId:"p33:role:"+scenario!.id,sourceId:"thiepn-original",contentVersion:"p36-1",
        metadata:{p36:true,kind:"intent-scaffold",scenarioId:scenario!.id,
          unitId,role:perspective,turnIndex,stage,intentId:active.id,
          assisted:true,schedulerExcluded:true,rawTextStored:false,
          length:[...normalizeP26(text)].length}
      };
      await saveStudyEvent(event);
      if(ownerRef.current!==account)return;
      exposed.current.add(identity);
      setIntentStage(stage==="first"?"second":"complete");
      onReviewed();
    }catch{
      if(ownerRef.current===account)setError("Die freie Anschlussantwort konnte nicht protokolliert werden. Erneut versuchen.");
    }finally{if(ownerRef.current===account)setBusy(false);}
  }
  async function submitCorrection(){
    if(!correction||!correctionDraft.trim()||correctionMatch!==null||busy||disabled||!feedback)return;
    const account=ownerRef.current;
    if(account!==getDevelopmentAccountId())return;
    setBusy(true);setError("");
    try{
      const event:StudyEvent={
        id:crypto.randomUUID(),userId:account,deviceId:DEVELOPMENT_DEVICE_ID,
        occurredAt:new Date().toISOString(),activity:"writing",
        primaryTarget:{kind:"production_task",id:"p36:reformulation:"+correction.id},
        skillDimension:"production",promptFamily:"p36-assisted-role-correction",
        responseMode:"typed",result:"skipped",attempts:1,
        contextId:"p33:role:"+scenario!.id,sourceId:"thiepn-original",contentVersion:"p36-1",
        metadata:{p36:true,kind:"assisted-correction",unitId,scenarioId:scenario!.id,
          role:perspective,turnIndex,taskId:correction.id,
          schedulerExcluded:true,assisted:true,rawTextStored:false,
          length:[...normalizeP26(correctionDraft)].length}
      };
      await saveStudyEvent(event);
      if(ownerRef.current!==account)return;
      setCorrectionMatch(p36CorrectionRecognized(correction,correctionDraft));
      exposed.current.add(identity);
      setAssisted(true);onReviewed();
    }catch{
      if(ownerRef.current===account)setError("Korrektur konnte nicht protokolliert werden. Erneut versuchen.");
    }finally{if(ownerRef.current===account)setBusy(false);}
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
    setFollowupDraft("");setFollowupDone(false);resetIntents();resetCorrection();
    setShowMeaning(false);startTime.current=performance.now();
  }
  if(!scenario||!role||!turn)return null;
  return <section className="p33-role" aria-labelledby="p33-role-title">
    <h4 id="p33-role-title">Rollenwechsel: selbst antworten</h4>
    <p>Reagiere in drei aufeinanderfolgenden Gesprächsschritten. Danach kannst du die Perspektive wechseln und den Dialog aus der anderen Rolle führen. Freie Alternativen werden nicht pauschal als Fehler gewertet.</p>
    {dueCount>0?<div className="p33-role__due">
      <p><strong>{dueCount} FSRS-Karten dieser Einheit jetzt fällig.</strong>
        Du kannst den Dialog weiterüben oder die gespeicherte Wiederholungsrunde direkt öffnen.</p>
      <button type="button" disabled={disabled||busy} onClick={onReview}>
        {dueCount} fällige Karten im StudyPlayer wiederholen
      </button>
    </div>:<p className="p33-role__due-note">
      Keine bekannten fälligen Karten dieser Einheit. Neue Dialoge sind freiwillige Übung, keine überfällige Wiederholung.
    </p>}
    <div className="p33-role__exact-due" aria-label="Wiederholung der gewählten Gesprächssituation">
      <strong>{scenarioDue} FSRS-fällige Antworten genau für diese Situation</strong>
      <button type="button" disabled={disabled||busy||scenarioDue===0}
        onClick={()=>onRoleDue(scenario!.id)}>Genau diesen Dialog fällig wiederholen</button>
      <small>Es werden ausschließlich die nach dem bestehenden FSRS-Termin fälligen
        Antwortkarten gestartet. Neue und freiwillige Fehlerübungen sind getrennt.</small>
    </div>
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
        <p className="p33-role__shortcut">Strg / ⌘ + Enter zum Vergleichen · Escape zum Gespräch</p>
        <textarea id="p33-repair-draft" lang="ja" rows={2} value={repairDraft}
          aria-keyshortcuts="Control+Enter Meta+Enter"
          onKeyDown={e=>{if(!e.nativeEvent.isComposing&&(e.ctrlKey||e.metaKey)&&e.key==="Enter"){
            e.preventDefault();if(!busy&&!repairDone&&!disabled)void submitRepair();
          }}}
          disabled={busy||repairDone} onChange={e=>setRepairDraft(e.target.value)}
          onKeyUp={e=>{if(e.key==="Escape")setRepairOpen(false);}}/>
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
              aria-keyshortcuts="Control+Enter Meta+Enter"
              onKeyDown={e=>{if(!e.nativeEvent.isComposing&&(e.ctrlKey||e.metaKey)&&e.key==="Enter"){
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
      aria-keyshortcuts="Control+Enter Meta+Enter"
      onKeyDown={e=>{if(!e.nativeEvent.isComposing&&(e.ctrlKey||e.metaKey)&&e.key==="Enter"){
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
    {feedback?<div className="p33-role__feedback" role="status" aria-label="Antwortfeedback und nächster Dialogschritt">
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
      {corrections.length>0?<section className="p33-role__correction" aria-label="Partikeln und Register verbessern">
        <h5>Einen ähnlichen Satz selbst verbessern</h5>
        <p>Hier wird erst nach deiner Antwort eine Zielform gezeigt. Der Vergleich im
          Gespräch bleibt unbewertet; die unabhängige Übung ist im StudyPlayer verfügbar.</p>
        <div className="p33-role__choices" role="group" aria-label="Korrekturschwerpunkt">
          {corrections.map(item=><button type="button" key={item.id}
            disabled={busy} aria-pressed={correctionId===item.id}
            onClick={()=>{setCorrectionId(item.id);setCorrectionDraft("");setCorrectionMatch(null);}}>
            {item.focus==="particle"?"Partikeln":item.focus==="register"?"Höflichkeit":
              item.focus==="time"?"Vergangenheit":"Sprechabsicht"}</button>)}
        </div>
        {correction?<div>
          <p><strong>Situation:</strong> {correction.situation}</p>
          <p>Zu überarbeiten: <span lang="ja">{correction.startingSentence}</span></p>
          <label htmlFor="p36-role-correction">Dein korrigierter japanischer Satz</label>
          <textarea id="p36-role-correction" lang="ja" rows={2} value={correctionDraft}
            aria-keyshortcuts="Control+Enter Meta+Enter"
            disabled={busy||correctionMatch!==null} onChange={e=>setCorrectionDraft(e.target.value)}
            onKeyDown={e=>{if(!e.nativeEvent.isComposing&&(e.ctrlKey||e.metaKey)&&e.key==="Enter"){
              e.preventDefault();void submitCorrection();
            }}}/>
          <button type="button" disabled={busy||disabled||correctionMatch!==null||!correctionDraft.trim()}
            onClick={()=>void submitCorrection()}>Mit Zielform vergleichen</button>
          {correctionMatch!==null?<div role="status">
            <strong>{correctionMatch?"Eine qualifizierte Zielform getroffen":"Deine Form entspricht keiner hinterlegten Variante"}</strong>
            <p>Ein Beispiel: <span lang="ja">{correction.model}</span></p>
            <p>{correction.explanation}</p>
            <details>
              <summary>Weitere passende Korrekturen und Unterschiede</summary>
              {correctionAlternatives.map(alt=><div key={alt.answer}>
                <p lang="ja">{alt.answer}</p><p>{alt.nuance}</p>
              </div>)}
            </details>
            <p>Andere korrekte Lösungen sind möglich. Das ist kein unabhängiger FSRS-Abruf.</p>
            <P37ResponseRevision key={identity+":"+correction.id}
              owner={owner} unitId={unitId} scenarioId={scenario!.id} role={perspective}
              taskId={correction.id} original={correctionDraft} model={correction.model}
              onReviewed={onReviewed}/>
          </div>:null}
        </div>:null}
      </section>:null}
      {turnIndex===role.turns.length-1&&intentPaths.length>0?<section
        className="p33-role__intents" aria-label="Situationsbezogenes Gespräch fortsetzen">
        <h5>Das Gespräch selbstständig weiterführen</h5>
        <p>Wähle deine kommunikative Absicht auf Deutsch. Formuliere anschließend zwei
          japanische Antworten. Weil das Gespräch hier bereits Hilfen enthält, werden
          beide Versuche unbewertet protokolliert und nicht als FSRS-Abruf gezählt.</p>
        <div className="p33-role__choices" role="group" aria-label="Gesprächsabsicht">
          {intentPaths.map(path=><button type="button" key={path.id}
            aria-pressed={intentPathId===path.id} disabled={busy}
            onClick={()=>{setIntentPathId(path.id);setIntentStage("first");
              setIntentFirst("");setIntentSecond("");}}>{path.goal}</button>)}
        </div>
        {intentPath?<div>
          {intentStage==="first"?<>
            <label htmlFor="p36-intent-first">1 · Drücke dein Anliegen auf Japanisch aus</label>
            <textarea id="p36-intent-first" lang="ja" rows={2}
              aria-keyshortcuts="Control+Enter Meta+Enter"
              value={intentFirst} disabled={busy}
              onChange={e=>setIntentFirst(e.target.value)}
              onKeyDown={e=>{if(!e.nativeEvent.isComposing&&(e.ctrlKey||e.metaKey)&&e.key==="Enter"){
                e.preventDefault();void submitIntentStep("first");
              }}}/>
            <button type="button" disabled={busy||disabled||!intentFirst.trim()}
              onClick={()=>void submitIntentStep("first")}>Ersten Beitrag vergleichen</button>
          </>:null}
          {(intentStage==="second"||intentStage==="complete")?<div role="status">
            <strong>1 · Vergleich nach eigener Formulierung</strong>
            <p>Dein Beitrag: <span lang="ja">{intentFirst}</span></p>
            <p>Eine mögliche Form: <span lang="ja">{intentPath.firstModel}</span></p>
            <p><strong>Gesprächspartner:</strong> <span lang="ja">{intentPath.partner}</span></p>
            <p>{intentPath.partnerMeaning}</p>
          </div>:null}
          {intentStage==="second"?<>
            <label htmlFor="p36-intent-second">2 · Reagiere auf die Rückfrage</label>
            <textarea id="p36-intent-second" lang="ja" rows={2} value={intentSecond}
              aria-keyshortcuts="Control+Enter Meta+Enter"
              disabled={busy} onChange={e=>setIntentSecond(e.target.value)}
              onKeyDown={e=>{if(!e.nativeEvent.isComposing&&(e.ctrlKey||e.metaKey)&&e.key==="Enter"){
                e.preventDefault();void submitIntentStep("second");
              }}}/>
            <button type="button" disabled={busy||disabled||!intentSecond.trim()}
              onClick={()=>void submitIntentStep("second")}>Anschlussantwort vergleichen</button>
          </>:null}
          {intentStage==="complete"?<div role="status">
            <strong>Zwei eigene Gesprächsbeiträge abgeschlossen – unbewertet</strong>
            <p>Deine Antwort: <span lang="ja">{intentSecond}</span></p>
            <p>Mögliche Antwort: <span lang="ja">{intentPath.secondModel}</span></p>
            <p>{intentPath.explanation}</p>
            <P37ResponseRevision key={identity+":"+intentPath.id+":first"}
              owner={owner} unitId={unitId} scenarioId={scenario!.id} role={perspective}
              taskId={scenario!.id+"-"+perspective+"-"+intentPath.id+"-first"}
              original={intentFirst} model={intentPath.firstModel} onReviewed={onReviewed}/>
            <P37ResponseRevision key={identity+":"+intentPath.id+":second"}
              owner={owner} unitId={unitId} scenarioId={scenario!.id} role={perspective}
              taskId={scenario!.id+"-"+perspective+"-"+intentPath.id+"-second"}
              original={intentSecond} model={intentPath.secondModel} onReviewed={onReviewed}/>
            <button type="button" disabled={busy} onClick={next}>Zur nächsten Rolle</button>
          </div>:null}
        </div>:null}
      </section>:null}
      <div className="p33-role__actions">
        <button type="button" disabled={disabled} onClick={onGrammar}>
          Partikeln und Höflichkeit im StudyPlayer vertiefen</button>
        <button type="button" disabled={busy} onClick={()=>{
          setFeedback(null);setAssisted(true);resetIntents();resetCorrection();startTime.current=performance.now();
        }}>Antwort überarbeiten (unbewertet)</button>
        <button type="button" disabled={busy} onClick={next}>Nächste Antwort / Rolle wechseln</button>
      </div>
    </div>:null}
    {error?<p role="alert">{error}</p>:null}
  </section>;
}
