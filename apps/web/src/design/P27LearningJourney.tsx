import {useEffect,useMemo,useRef,useState} from "react";
import {listMemoryTraces,listStudyEvents,saveStudyEvent} from "@thiepn/local-db";
import {gradeStudyPrompt} from "@thiepn/study-player";
import type {StudyEvent} from "@thiepn/domain";
import type {MemoryTrace} from "@thiepn/scheduler";
import {DEVELOPMENT_DEVICE_ID,getDevelopmentAccountId,recordStudyAnswer} from "../study/runtime";
import {normalizeP26} from "../study/pedagogy26";
import {grammarReflection} from "../study/feedback27";
import {P28SentenceBuilder} from "./P28SentenceBuilder";
import {P28Continuity} from "./P28Continuity";
import {P33RolePractice} from "./P33RolePractice";
import {p33RolePrompts,p33RolesForUnit} from "../study/role33";
import {p33SentencePrompts} from "../study/sentence33";
import {p34SentencePrompts} from "../study/sentence34";
import {p35PragmaticPrompts} from "../study/pragmatics35";
import {p36CorrectionPrompts} from "../study/correction36";
import {p38CrossUnitPrompts,p38CrossUnitForUnit} from "../study/transfer38";
import {p38ProductionPrompts,p38ProductionForUnit} from "../study/production38";
import {p39LifePrompts,p39CasesForUnit,p39AuthoredFeedback} from "../study/life39";
import {p40Prompts,p40ReturnPrompts,p40ArcsForUnit,p40TurnFeedback} from "../study/dialogue40";
import {p41Prompts,p41ReturnPrompts,p41ArcsForUnit,p41ArcById} from "../study/dialogue41";
import {p42Prompts,p42ReturnPrompts,p42ArcsForUnit,p42ArcById} from "../study/dialogue42";
import {p28NewSentencePrompts} from "../study/sentence28";
import {p29AdditionalPrompts,p29LexicalPrompts,lexicalLinksForUnit,recommendP29Actions} from "../study/depth29";
import {describeP29Revision,p29RegisterExampleForUnit} from "../study/revision29";
import {p30TransformationPrompts,transformationForUnit} from "../study/pedagogy30";
import {continuityPrompts} from "../study/continuity28";
import {register28Prompts} from "../study/register28";
import {deriveWeakAreas,areaLabels} from "../study/remediation30";
import {recentP35Mistakes} from "../study/remediation35";
import {p36RemediationHint} from "../study/remediation36";
import {p37ReviewSignal} from "../study/reviewSignal37";
import {p31ContrastPrompts,p31ContrastForUnit} from "../study/contrast31";
import {planP31Recall,p31GlobalDue} from "../study/recall31";
import {p31SentencePrompts} from "../study/sentence31";
import {p32SentencePrompts} from "../study/sentence32";
import {p32ContrastPrompts,p32ContrastForUnit} from "../study/contrast32";
import {
  deriveJourneyProgress,journeyTypedPrompt,journeyUnits,journeyUnit,nextTurn,recommendedJourneyUnit,promptsForUnit,traceIdJourney,
  type JourneyPractice,type JourneySource,type JourneyStage,type JourneyOption,type JourneyUnitProgress
} from "../study/journey27";
import "./p27-journey.css";

type InputMode="compose"|"choose";
type SourceMode="core"|"context"|"repair";
interface SpeechCapture {
  lang:string;continuous:boolean;interimResults:boolean;
  onresult:((event:{results:ArrayLike<ArrayLike<{transcript:string}>>})=>void)|null;
  onerror:(()=>void)|null;onend:(()=>void)|null;start():void;stop():void;
}
interface Feedback { kind:"graded"|"ungraded"|"choice";message:string;model:string;notes:string[];next:string|null; }
interface RewriteReport {changed:boolean;oldLength:number;newLength:number;found:string[];missing:string[];}
const extraJourneyPrompts=[...p28NewSentencePrompts,...p29AdditionalPrompts,
  ...p29LexicalPrompts,...p30TransformationPrompts,...continuityPrompts,...register28Prompts,...p31ContrastPrompts,...p31SentencePrompts,...p32ContrastPrompts,...p32SentencePrompts,...p33RolePrompts,...p33SentencePrompts,...p34SentencePrompts,...p35PragmaticPrompts,...p36CorrectionPrompts,...p38CrossUnitPrompts,...p38ProductionPrompts,...p39LifePrompts,...p40Prompts,...p41Prompts,...p42Prompts];
const steps:[JourneyStage,string][]=[["learn","1 · Verstehen"],["build","2 · Satzbau"],["conversation","3 · Antworten"],["write","4 · Schreiben"],["practice","5 · Festigen"]];
function compareWriting(before:string,after:string,features:readonly string[]):RewriteReport{
  const oldText=normalizeP26(before),newText=normalizeP26(after);
  return {changed:oldText!==newText,oldLength:[...oldText].length,newLength:[...newText].length,
    found:features.filter(f=>newText.includes(normalizeP26(f))),
    missing:features.filter(f=>!newText.includes(normalizeP26(f)))};
}
export function P27LearningJourney({disabled,onSourcePractice,onJourneyPractice,onMistakePractice,onRoleDuePractice,onCorrectionDuePractice}:{
  disabled:boolean;
  onSourcePractice:(source:JourneySource,sourceId:string,mode:SourceMode)=>void;
  onJourneyPractice:(id:string,mode:JourneyPractice)=>void;
  onMistakePractice:(id:string,promptId:string)=>void;
  onRoleDuePractice:(unitId:string,scenarioId:string)=>void;
  onCorrectionDuePractice:(unitId:string,scenarioId:string)=>void;
}){
  const owner=getDevelopmentAccountId();
  const currentOwner=useRef(owner);currentOwner.current=owner;
  const [unitId,setUnitId]=useState(journeyUnits[0]!.id);
  const [level,setLevel]=useState<"all"|"A1"|"A2">("all");
  const [query,setQuery]=useState("");
  const [stage,setStage]=useState<JourneyStage>("learn");
  const [progress,setProgress]=useState<JourneyUnitProgress[]>([]);
  const [evidence,setEvidence]=useState<{events:StudyEvent[];traces:MemoryTrace[]}|null>(null);
  const [loading,setLoading]=useState(true);
  const [loadError,setLoadError]=useState("");
  const [reload,setReload]=useState(0);
  const [nodeId,setNodeId]=useState("");
  const [stepsTaken,setStepsTaken]=useState(0);
  const [inputMode,setInputMode]=useState<InputMode>("compose");
  const [answer,setAnswer]=useState("");
  const [firstConversationDraft,setFirstConversationDraft]=useState("");
  const [choiceExampleSeen,setChoiceExampleSeen]=useState(false);
  const [feedback,setFeedback]=useState<Feedback|null>(null);
  const [hintUsed,setHintUsed]=useState(false);
  const [speechUsed,setSpeechUsed]=useState(false);
  const [showTranslation,setShowTranslation]=useState(false);
  const [inlineContrastAnswer,setInlineContrastAnswer]=useState<string|null>(null);
  const [p38Choice,setP38Choice]=useState<{id:string;answer:string}|null>(null);
  const [p39Choice,setP39Choice]=useState<{id:string;answer:string}|null>(null);
  const [p39WritingId,setP39WritingId]=useState("");
  const [p40ArcId,setP40ArcId]=useState("");
  const [p40TurnIndex,setP40TurnIndex]=useState(0);
  const [p40Choice,setP40Choice]=useState("");
  const [p40GuidedHistory,setP40GuidedHistory]=useState<Array<{turnId:string;partner:string;answer:string;note:string}>>([]);
  const [p40GuidedFinished,setP40GuidedFinished]=useState(false);
  const [p40WritingArcId,setP40WritingArcId]=useState("");
  const [p40WritingTurnIndex,setP40WritingTurnIndex]=useState(1);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [voiceStatus,setVoiceStatus]=useState("");
  const [draft,setDraft]=useState("");
  const [rewrite,setRewrite]=useState("");
  const [rewriteStage,setRewriteStage]=useState<"draft"|"revise"|"compare">("draft");
  const [report,setReport]=useState<RewriteReport|null>(null);
  const [saved,setSaved]=useState(false);
  const microphone=useRef<SpeechCapture|null>(null);
  const started=useRef(0);
  // Ephemeral exposure guards: preserve FSRS evidence across a replay in the same unit.
  const revealedTurnIds=useRef<Set<string>>(new Set());
  const unit=journeyUnit(unitId);
  const turn=unit.turns.find(t=>t.id===nodeId)??unit.turns[0]!;
  const profile=progress.find(p=>p.id===unitId);
  const recommended=recommendedJourneyUnit(progress);
  const recommendedUnit=journeyUnit(recommended);
  const learningLinks=lexicalLinksForUnit(unitId);
  const pragmatics=p29RegisterExampleForUnit(unitId);
  const transformation=transformationForUnit(unitId);
  const contrast=p31ContrastForUnit(unitId);
  const roleScenarios=p33RolesForUnit(unitId);
  const p32Contrast=p32ContrastForUnit(unitId);
  const p32Question=p32ContrastPrompts.find(p=>p.eventMetadata?.unitId===unitId);
  const p38TransferCases=p38CrossUnitForUnit(unitId);
  const p38WritingCases=p38ProductionForUnit(unitId);
  const p39UnitCases=p39CasesForUnit(unitId);
  const p41UnitArcs=p41ArcsForUnit(unitId);
  const p42UnitArcs=p42ArcsForUnit(unitId);
  const p40UnitArcs=[...p42UnitArcs,...p41UnitArcs,...p40ArcsForUnit(unitId)];
  const globalRecall=useMemo(()=>evidence?
    p31GlobalDue(evidence.traces,evidence.events,extraJourneyPrompts):[],
    [evidence]);
  const dueUnits=globalRecall.filter(item=>item.due>0).slice(0,4);
  const nearestReturn=globalRecall.filter(item=>item.nextDueAt)
    .sort((a,b)=>Date.parse(a.nextDueAt!)-Date.parse(b.nextDueAt!))[0];
  const recallPlan=useMemo(()=>evidence?
    planP31Recall(unitId,evidence.traces,evidence.events,extraJourneyPrompts):null,
    [unitId,evidence]);
  const weakAreas=useMemo(()=>evidence?deriveWeakAreas(unitId,evidence.traces,evidence.events,
    extraJourneyPrompts):null,[unitId,evidence]);
  const mistakes=useMemo(()=>evidence?
    recentP35Mistakes(unitId,evidence.events,extraJourneyPrompts):[],
    [unitId,evidence]);
  const p39Priority=p39UnitCases.find(c=>mistakes.some(m=>m.promptId==="p39-context-"+c.id||m.promptId==="p39-repair-"+c.id))??p39UnitCases[0];
  const p39Chosen=p39UnitCases.find(c=>c.id===p39WritingId);
  const p40Recommended=p40UnitArcs.find(arc=>mistakes.some(m=>
    m.promptId.startsWith("p40-turn-"+arc.id+"-t")||
    m.promptId.startsWith("p41-turn-"+arc.id+"-t")||
    m.promptId.startsWith("p42-turn-"+arc.id+"-t")||
    m.promptId==="p40-return-"+arc.id||m.promptId==="p41-return-"+arc.id||m.promptId==="p42-return-"+arc.id))??p40UnitArcs[0];
  const p40ActiveArc=p40UnitArcs.find(arc=>arc.id===p40ArcId)??p40Recommended;
  const p40CurrentTurn=p40ActiveArc?.turns[p40TurnIndex];
  const p40WritingArc=p40UnitArcs.find(arc=>arc.id===p40WritingArcId);
  const p40WritingTurn=p40WritingArc?.turns[p40WritingTurnIndex];
  const p41ActiveArc=p40ActiveArc?(p41ArcById(p40ActiveArc.id)??p42ArcById(p40ActiveArc.id)):undefined;
  const p42ActiveArc=p40ActiveArc?p42ArcById(p40ActiveArc.id):undefined;
  const p40ReturnCueStatus=[...p42ReturnPrompts,...p41ReturnPrompts,...p40ReturnPrompts].filter(p=>
    Array.isArray(p.eventMetadata?.unitIds)&&p.eventMetadata.unitIds.includes(unitId))
    .map(prompt=>{
      const trace=evidence?.traces.find(t=>t.id===traceIdJourney(prompt));
      const when=trace?Date.parse(trace.card.due):NaN;
      return {id:prompt.id,arcId:String(prompt.eventMetadata?.arcId),
        planned:Boolean(trace&&Number.isFinite(when)),
        due:Boolean(trace&&Number.isFinite(when)&&when<=Date.now())};
    });
  const reviewCatalog=useMemo(()=>promptsForUnit(unitId,extraJourneyPrompts),[unitId]);
  const nextActions=useMemo(()=>evidence?
    recommendP29Actions(unitId,progress,evidence.events,evidence.traces):[],
    [unitId,progress,evidence]);
  const filtered=useMemo(()=>journeyUnits.filter(u=>
    (level==="all"||u.level===level)&&(!query.trim()||
      (u.title+" "+u.goal+" "+u.words.map(w=>w.form+" "+w.meaning).join(" ")).toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))
  ),[level,query]);
  useEffect(()=>{
    let active=true;setLoading(true);setLoadError("");setEvidence(null);
    void Promise.all([listStudyEvents(owner),listMemoryTraces(owner)]).then(([events,traces])=>{
      if(active&&currentOwner.current===owner){
        const personalTraces=traces.filter(t=>t.userId===owner);
        const personalEvents=events.filter(e=>e.userId===owner);
        setEvidence({events:personalEvents,traces:personalTraces});
        setProgress(deriveJourneyProgress(personalTraces,personalEvents,Date.now(),extraJourneyPrompts));
      }
    }).catch(()=>{if(active)setLoadError("Lernverlauf nicht verfügbar; die Übungen können trotzdem verwendet werden.");})
      .finally(()=>{if(active)setLoading(false);});
    return()=>{active=false;};
  },[owner,reload]);
  useEffect(()=>{
    microphone.current?.stop();microphone.current=null;revealedTurnIds.current.clear();
    setNodeId(unit.turns[0]!.id);setStepsTaken(0);setAnswer("");setFirstConversationDraft("");setFeedback(null);
    setChoiceExampleSeen(false);
    setHintUsed(false);setSpeechUsed(false);setShowTranslation(false);setInputMode("compose");setInlineContrastAnswer(null);setP38Choice(null);setP39Choice(null);setP39WritingId("");
    setP40ArcId("");setP40TurnIndex(0);setP40Choice("");setP40WritingArcId("");setP40WritingTurnIndex(1);
    setP40GuidedHistory([]);setP40GuidedFinished(false);
    setError("");setDraft("");setRewrite("");
    setRewriteStage("draft");setReport(null);setSaved(false);setVoiceStatus("");
    started.current=performance.now();
  },[unitId,owner]);
  // A German explanation is a learning scaffold even if switched off later.
  // Track the turn, not just the current checkbox value, across navigation.
  useEffect(()=>{
    if(showTranslation&&nodeId!=="__finished__"){
      revealedTurnIds.current.add(unitId+":"+turn.id);
    }
  },[unitId,nodeId,showTranslation,turn.id]);
  useEffect(()=>()=>microphone.current?.stop(),[]);
  function selectUnit(id:string){setUnitId(id);setStage("learn");}
  function chooseP40Writing(arcId:string,turnIndex?:number){
    setP40WritingArcId(arcId);setP39WritingId("");
    const target=p41ArcById(arcId)??p42ArcById(arcId);
    setP40WritingTurnIndex(turnIndex??(target?target.pivotTurn-1:1));
    setDraft("");setRewrite("");setRewriteStage("draft");setReport(null);setSaved(false);
    setStage("write");
  }
  function resetDialogue(){
    setNodeId(unit.turns[0]!.id);setStepsTaken(0);setAnswer("");setFirstConversationDraft("");setFeedback(null);
    setChoiceExampleSeen(false);
    setHintUsed(false);setSpeechUsed(false);setError("");started.current=performance.now();
  }
  function speak(text:string){
    if(!("speechSynthesis" in window))return;
    window.speechSynthesis.cancel();
    const utterance=new SpeechSynthesisUtterance(text);utterance.lang="ja-JP";utterance.rate=.85;
    window.speechSynthesis.speak(utterance);
  }
  function recognize(target:"answer"|"draft"|"rewrite"){
    const browser=window as typeof window & {SpeechRecognition?:new()=>SpeechCapture;webkitSpeechRecognition?:new()=>SpeechCapture};
    const Recognition=browser.SpeechRecognition??browser.webkitSpeechRecognition;
    if(!Recognition){setVoiceStatus("Spracherkennung nicht verfügbar. Text eintippen.");return;}
    microphone.current?.stop();
    const rec=new Recognition();microphone.current=rec;rec.lang="ja-JP";
    rec.continuous=false;rec.interimResults=false;
    rec.onresult=e=>{
      const value=e.results[0]?.[0]?.transcript?.trim()??"";
      if(!value)return;
      if(target==="answer"){setAnswer(value);setSpeechUsed(true);setFeedback(null);}
      if(target==="draft"){setDraft(value);setRewriteStage("draft");setReport(null);}
      if(target==="rewrite"){setRewrite(value);setRewriteStage("revise");setReport(null);}
    };
    rec.onerror=()=>setVoiceStatus("Spracherkennung fehlgeschlagen; bitte eintippen.");
    rec.onend=()=>setVoiceStatus("Erkennung beendet. Transkript bitte überprüfen.");
    try{rec.start();setVoiceStatus("Spracherkennung läuft …");}
    catch{setVoiceStatus("Mikrofon konnte nicht gestartet werden.");}
  }
  async function ungraded(kind:"response"|"rewrite",text:string,help:boolean){
    const account=currentOwner.current;
    if(account!==getDevelopmentAccountId())throw new Error("P27_WORKSPACE_CHANGED");
    const event:StudyEvent={
      id:crypto.randomUUID(),userId:account,deviceId:DEVELOPMENT_DEVICE_ID,
      occurredAt:new Date().toISOString(),activity:"writing",
      primaryTarget:{kind:"production_task",id:"p27:"+kind+":"+unit.id},
      skillDimension:"production",promptFamily:"p27-free-response",
      responseMode:"typed",result:"skipped",attempts:1,
      contextId:"p27:unit:"+unit.id,sourceId:"thiepn-original",contentVersion:"p27-1",
      metadata:{p27:true,unitId:unit.id,kind,ungraded:true,schedulerExcluded:true,
        rawTextStored:false,length:[...normalizeP26(text)].length,helpUsed:help,
        ...(kind==="response"?{turnId:turn.id}:{}),
        ...(kind==="rewrite"&&p39Chosen?{p39:true,authoredCaseId:p39Chosen.id,
          sourceContextId:"p39:repair:"+p39Chosen.id}:{}),
        ...(kind==="rewrite"&&p40WritingTurn?{
          ...(p42ArcById(p40WritingArc!.id)?{p42:true}:p41ArcById(p40WritingArc!.id)?{p41:true}:{p40:true}),
          authoredArcId:p40WritingArc!.id,
          authoredTurnId:p40WritingTurn.id,
          sourceContextId:(p42ArcById(p40WritingArc!.id)?"p42:arc:":p41ArcById(p40WritingArc!.id)?"p41:arc:":"p40:dialogue:")+p40WritingArc!.id
        }:{})}
    };
    await saveStudyEvent(event);
  }
  async function submitText(){
    if(!answer.trim()||busy||feedback||disabled)return;
    const account=currentOwner.current;
    if(account!==getDevelopmentAccountId())return;
    const prompt=journeyTypedPrompt(unit,turn);
    const normalized=normalizeP26(answer);
    const exact=gradeStudyPrompt(prompt,normalized).result==="correct";
    const independent=exact&&!hintUsed&&!speechUsed&&!choiceExampleSeen&&!showTranslation&&
      !revealedTurnIds.current.has(unitId+":"+turn.id);
    const choice=turn.options.find(o=>o.valid&&normalizeP26(o.japanese)===normalized);
    setBusy(true);setError("");
    try{
      if(independent)await recordStudyAnswer({prompt,response:normalized,result:"correct",
        responseTimeMs:Math.max(0,Math.round(performance.now()-started.current))});
      else await ungraded("response",answer,hintUsed||speechUsed||showTranslation);
      if(currentOwner.current!==account)return;
      if(!firstConversationDraft)setFirstConversationDraft(answer);
      setChoiceExampleSeen(true);revealedTurnIds.current.add(unitId+":"+turn.id);
      setHintUsed(true); // The displayed model makes any subsequent retry ungraded.
      setFeedback({kind:independent?"graded":"ungraded",model:turn.reference,
        message:independent?"Geübte Zielform unabhängig getroffen. FSRS-Übung gespeichert."
          :exact?"Zielform getroffen, aber mit Hilfe oder Spracherkennung: unbewerteter Versuch."
          :"Deine freie Antwort lässt sich mit den begrenzten Mustern nicht sicher beurteilen. Sie ist nicht automatisch falsch.",
        notes:[turn.hint,...grammarReflection(unit,answer)],
        next:exact?nextTurn(unit,turn,choice):turn.id});
      setReload(n=>n+1);
    }catch{if(currentOwner.current===account)setError("Antwort konnte nicht gespeichert werden.");}
    finally{if(currentOwner.current===account)setBusy(false);}
  }
  async function choose(option:JourneyOption){
    if(busy||feedback||disabled)return;
    const account=currentOwner.current;
    if(account!==getDevelopmentAccountId())return;
    setBusy(true);setError("");
    try{
      if(turn.originalPrompt?.promptType==="choice"&&!choiceExampleSeen&&!showTranslation&&
        !revealedTurnIds.current.has(unitId+":"+turn.id)){
        const prompt=turn.originalPrompt;
        await recordStudyAnswer({prompt,response:option.japanese,
          result:gradeStudyPrompt(prompt,option.japanese).result,
          responseTimeMs:Math.max(0,Math.round(performance.now()-started.current))});
      }else await ungraded("response",option.japanese,true);
      if(currentOwner.current!==account)return;
      setChoiceExampleSeen(true);revealedTurnIds.current.add(unitId+":"+turn.id);
      setFeedback({kind:"choice",message:choiceExampleSeen||showTranslation?"Auswahl nach Sprachhilfe: unbewertet.":option.valid?"Situationsgerechte Auswahl.":"Missverständnis: Versuche eine passendere Antwort.",
        model:turn.reference,notes:[option.explanation,turn.hint],next:nextTurn(unit,turn,option)});
      setReload(n=>n+1);
    }catch{if(currentOwner.current===account)setError("Antwortauswahl konnte nicht gespeichert werden.");}
    finally{if(currentOwner.current===account)setBusy(false);}
  }
  function continueDialogue(){
    if(!feedback||busy)return;
    setStepsTaken(n=>n+1);
    setNodeId(feedback.next??"__finished__");
    setFeedback(null);setAnswer("");setFirstConversationDraft("");setHintUsed(false);setSpeechUsed(false);setChoiceExampleSeen(false);
    started.current=performance.now();
  }
  async function saveRevision(){
    if(!report||saved||busy||disabled)return;
    const account=currentOwner.current;
    setBusy(true);setError("");
    try{
      await ungraded("rewrite",rewrite,false);
      if(account===currentOwner.current){setSaved(true);setReload(n=>n+1);}
    }catch{if(account===currentOwner.current)setError("Überarbeitung konnte nicht gespeichert werden.");}
    finally{if(account===currentOwner.current)setBusy(false);}
  }
  return <section className="p27-journey" aria-labelledby="p27-title">
    <header><p className="j4-kicker">JAPANESE · EIN LERNWEG</p>
      <h2 id="p27-title">Japanisch im Zusammenhang lernen</h2>
      <p>18 Originaleinheiten mit fünf verbundenen Lernschritten; jetzt mit vertieftem Satzbau, neuen Themenübergängen und angeleiteten Wiederholungen.</p>
    </header>
    <div className="p27-journey__next">
      <div><strong>Empfohlene nächste Einheit</strong><p>{loading?"Lernverlauf laden …":recommendedUnit.title}</p></div>
      <button type="button" disabled={loading||disabled} onClick={()=>{
        selectUnit(recommended);
        if((progress.find(p=>p.id===recommended)?.due??0)>0)setStage("practice");
      }}>Empfehlung öffnen</button>
    </div>
    {loadError?<p role="status">{loadError}</p>:null}
    <div className="p27-journey__layout">
      <aside className="p27-journey__sidebar">
        <label htmlFor="p27-search">Lerneinheiten suchen</label>
        <input type="search" id="p27-search" value={query} onChange={e=>setQuery(e.target.value)}
          placeholder="Thema oder japanisches Wort"/>
        <div className="p27-journey__filters" role="group" aria-label="Niveau">
          {(["all","A1","A2"] as const).map(l=><button key={l} aria-pressed={level===l}
            type="button" onClick={()=>setLevel(l)}>{l==="all"?"Alle":l}</button>)}
        </div>
        <nav className="p27-journey__units" aria-label="Einheiten">
          {filtered.map(u=>{
            const state=progress.find(p=>p.id===u.id);
            return <button type="button" key={u.id} aria-current={u.id===unitId?"true":undefined}
              onClick={()=>selectUnit(u.id)}>
              <small>{u.level} · Einheit {journeyUnits.indexOf(u)+1}</small>
              <strong>{u.title}</strong>
              <small>{state?state.attempted+"/"+state.total+" Übungsziele geübt":"Neu"}
                {state?.due?" · "+state.due+" fällig":state?.retry?" · "+state.retry+" Fehler":""}</small>
            </button>;
          })}
          {!filtered.length?<p>Keine Einheiten gefunden.</p>:null}
        </nav>
      </aside>
      <div className="p27-journey__content">
        <h3>{unit.title}</h3><p><strong>Lernziel:</strong> {unit.goal}</p>
        <div className="p27-journey__position">
          <span>{journeyUnits.indexOf(unit)+1} / {journeyUnits.length} · {unit.level} · {steps.findIndex(([name])=>name===stage)+1} / {steps.length} Lernschritte</span>
          <div>
            <button type="button" onClick={()=>selectUnit(journeyUnits[Math.max(0,journeyUnits.indexOf(unit)-1)]!.id)}
              disabled={journeyUnits.indexOf(unit)===0}>Vorherige Einheit</button>
            <button type="button" onClick={()=>selectUnit(journeyUnits[Math.min(journeyUnits.length-1,journeyUnits.indexOf(unit)+1)]!.id)}
              disabled={journeyUnits.indexOf(unit)===journeyUnits.length-1}>Nächste Einheit</button>
          </div>
        </div>
        <nav className="p27-journey__steps" aria-label="Lernschritte" onKeyDown={event=>{
          if(event.key!=="ArrowLeft"&&event.key!=="ArrowRight")return;
          event.preventDefault();
          const direction=event.key==="ArrowRight"?1:-1;
          const index=Math.max(0,Math.min(steps.length-1,steps.findIndex(([name])=>name===stage)+direction));
          setStage(steps[index]![0]);
          const target=event.currentTarget.querySelectorAll("button")[index];
          target?.focus();
        }}>
          {steps.map(([id,label])=><button type="button" key={id} aria-current={stage===id?"step":undefined}
            onClick={()=>{setStage(id);setError("");}}>{label}</button>)}
        </nav>
        <div className="p27-journey__step-navigation" role="group" aria-label="Zwischen Lernschritten wechseln">
          <button type="button" disabled={stage==="learn"}
            onClick={()=>setStage(steps[Math.max(0,steps.findIndex(([s])=>s===stage)-1)]![0])}>Vorheriger Schritt</button>
          <button type="button" disabled={stage==="practice"}
            onClick={()=>setStage(steps[Math.min(steps.length-1,steps.findIndex(([s])=>s===stage)+1)]![0])}>Nächster Schritt</button>
        </div>
        {stage==="learn"?<section className="p27-journey__panel">
          <div className="p27-journey__note"><strong>Situation</strong><p>{unit.situation}</p></div>
          <h4>So funktioniert das Muster</h4><p>{unit.model}</p>
          {transformation?<div className="p27-journey__quality-example">
            <h5>Ausdruck bewusst verbessern</h5>
            <p><strong>Ziel:</strong> {transformation.context}</p>
            <p><span lang="ja">{transformation.startingSentence}</span> → <span lang="ja">{transformation.model}</span></p>
            <p>{transformation.explanation}</p>
            <small>Im anschließenden Satzbau kannst du dieses Muster ohne Vorlage selbst formulieren.</small>
          </div>:null}
          <div className="p27-journey__contrast"><div><strong>Unterscheide</strong><p>{unit.contrast}</p></div>
            <div><strong>Höflichkeit & Fehlerquelle</strong><p>{unit.register}</p></div></div>
          {contrast?<div className="p27-journey__quality-example">
            <h5>Welche Form passt hier besser?</h5>
            <p><strong>Situation:</strong> {contrast.situation}</p>
            <p><span lang="ja">{contrast.preferred}</span> / <span lang="ja">{contrast.alternative}</span></p>
            <details><summary>Warum die Formen sich unterscheiden</summary><p>{contrast.why}</p></details>
            <button type="button" disabled={disabled}
              onClick={()=>onJourneyPractice(unitId,"grammar")}>Grammatik und Register aktiv entscheiden</button>
          </div>:null}
          {p32Contrast&&p32Question?<div className="p27-journey__p32-explorer">
            <h5>Partikel, Bedeutung und Register aktiv unterscheiden</h5>
            <p>{p32Question.prompt}</p>
            <div role="group" aria-label="Grammatische Funktion vergleichen">
              {p32Question.promptType==="choice"?p32Question.choices.map((form,i)=>
                <button key={i} type="button"
                  aria-pressed={inlineContrastAnswer===form}
                  onClick={()=>setInlineContrastAnswer(form)}
                  lang="ja">{form}</button>):null}
            </div>
            {inlineContrastAnswer?<div role="status" className="p27-journey__p32-explanation">
              <strong>{inlineContrastAnswer===p32Contrast.first?
                "Die gefragte Funktion erkannt":"Das ist eine andere Funktion – beide Formen können gültig sein"}</strong>
              <p>{p32Contrast.explanation}</p>
              <p>Unbewertete Erklärung im Unterricht. Ein unabhängiger Abruf erfolgt separat im StudyPlayer.</p>
            </div>:null}
          </div>:null}
          {p38TransferCases.length?<section className="p27-journey__p38-cross" aria-label="Grammatik über Themen hinweg anwenden">
            <h4>Eine Funktion in zwei Alltagssituationen</h4>
            <p>Übertrage Partikel und Sprechabsichten in ein anderes Thema. Diese
              Erklärung ist <strong>unbewertet</strong>; unabhängige Wiederholung
              läuft getrennt im StudyPlayer.</p>
            {p38TransferCases.slice(0,3).map(item=>{
              const selected=p38Choice?.id===item.id?p38Choice.answer:null;
              const other=item.units.find(id=>id!==unitId);
              return <article key={item.id}>
                <h5>{item.title}</h5>
                <p>{item.question}</p>
                <div className="p27-journey__p38-options" role="group"
                  aria-label={"Ausdruck im Kontext: "+item.title}>
                  {[item.preferred,item.contrast].map((answer,i)=><button
                    key={i} type="button" lang="ja"
                    aria-pressed={selected===answer}
                    onClick={()=>setP38Choice({id:item.id,answer})}>{answer}</button>)}
                </div>
                {selected?<div role="status" className="p27-journey__p38-result">
                  <strong>{selected===item.preferred?
                    "Passt zur gefragten Bedeutung":
                    "Diese Form erfüllt eine andere Funktion oder ist in diesem Satz unpassend"}</strong>
                  <p>{item.explanation}</p>
                  <p>Eine einzelne Auswahl ist kein bewerteter Lernnachweis.</p>
                </div>:null}
                {other?<button type="button" className="p27-journey__p38-related"
                  onClick={()=>selectUnit(other)}>
                  Verwandtes Thema öffnen: {journeyUnit(other).title}
                </button>:null}
              </article>;
            })}
            <button type="button" disabled={disabled}
              onClick={()=>onJourneyPractice(unitId,"transfer")}>
              Themenübergreifende Aufgaben selbst abrufen
            </button>
          </section>:null}
          {p39Priority?<section className="p27-journey__p39-lesson" aria-label="Situationsspezifische Sprachwahl">
            <h4>Alltagssprache bewusst unterscheiden</h4>
            <p>Wähle die zum Gespräch passende Aussage. Die Erklärung ist unbewertet;
              neue unabhängige Aufgaben erscheinen im vorhandenen StudyPlayer.</p>
            <h5>{p39Priority.title}</h5><p>{p39Priority.situation}</p>
            <div className="p27-journey__p39-options" role="group" aria-label="Japanische Ausdrucksweise wählen">
              {[p39Priority.model,...p39Priority.distractors.map(d=>d.form)].map(form=><button key={form}
                type="button" lang="ja" aria-pressed={p39Choice?.id===p39Priority.id&&p39Choice.answer===form}
                onClick={()=>setP39Choice({id:p39Priority.id,answer:form})}>{form}</button>)}
            </div>
            {p39Choice?.id===p39Priority.id?<div className="p27-journey__p39-feedback" role="status">
              <strong>{p39AuthoredFeedback(p39Priority,p39Choice.answer).kind==="model"
                ?"Diese Ausdrucksweise erfüllt die Gesprächsabsicht":"Hier passt eine andere Ausdrucksweise"}</strong>
              <p>{p39AuthoredFeedback(p39Priority,p39Choice.answer).message}</p>
              <small>Unbewerteter Vergleich mit Originalbeispielen, kein FSRS-Nachweis.</small>
            </div>:null}
            <div className="p27-journey__actions">
              <button type="button" disabled={disabled} onClick={()=>onJourneyPractice(unitId,"grammar")}>
                Selbstständig unterscheiden</button>
              <button type="button" onClick={()=>{setStage("write");setP39WritingId(p39Priority.id);}}>
                Diese Situation schriftlich überarbeiten</button>
            </div>
          </section>:null}
          {p42UnitArcs.length>0?<section className="p27-journey__p42-variation" aria-label="Sprechrollen und Situationen übertragen">
            <h4>Andere Person, anderes Register, neue Entscheidung</h4>
            <p>Vergleiche, was gegenüber dem bekannten Dialog anders geworden ist.
              Das Beispiel bleibt unbewertet. Erst der native StudyPlayer bewertet
              eigenständige Antworten; neue Transferfragen werden separat wiederholt.</p>
            {p42UnitArcs.slice(0,4).map(arc=><article key={arc.id}>
              <h5>{arc.title} · {arc.level}</h5>
              <p><strong>Gegenüber:</strong> {arc.interlocutor} · {arc.relationship}</p>
              <p><strong>Register:</strong> {arc.register==="polite"?"höfliche Formen":"vertrautes Gespräch"}</p>
              <p><strong>Bekannter Ausgangsfall:</strong> {p41ArcById(arc.baseArcId)?.title??"frühere Einheit"}</p>
              <p><strong>Veränderte Information:</strong> {arc.variation}</p>
              <p>{arc.contrast}</p>
              <button type="button" onClick={()=>{setP40ArcId(arc.id);setP40TurnIndex(0);
                setP40Choice("");setP40GuidedHistory([]);setP40GuidedFinished(false);
                setStage("conversation");}}>
                Diese neue Gesprächsrolle untersuchen
              </button>
            </article>)}
          </section>:null}
          {p40Recommended?<section className="p27-journey__p40-guidance">
            <h4>Mehrere Antworten im selben Gespräch</h4>
            <p>Über {p40Recommended.turns.length} Gesprächszüge bleiben Ziel, Bedeutung
              und höfliche Reaktionen zusammenhängend. Ein unerwarteter Hinweis
              verändert einen Teil des Plans, nicht das gesamte Gespräch.</p>
            <p><strong>{p40Recommended.title}</strong> — {p40Recommended.setting}</p>
            <button type="button" onClick={()=>{setP40ArcId(p40Recommended.id);setP40TurnIndex(0);
              setP40Choice("");setP40GuidedHistory([]);setP40GuidedFinished(false);setStage("conversation");}}>
              {p40Recommended.turns.length} zusammenhängende Gesprächszüge öffnen
            </button>
          </section>:null}
          <h4>Wörter in Sätzen</h4>
          <div className="p27-journey__words">{unit.words.map(w=><div key={w.form+"-"+w.reading}>
            <strong lang="ja">{w.form}</strong><small lang="ja">{w.reading}</small>
            <span>{w.meaning}</span><small lang="ja">{w.example}</small></div>)}</div>
          <div className="p27-journey__actions">
            <button type="button" disabled={disabled} onClick={()=>onSourcePractice(unit.source,unit.sourceId,"core")}>Originale Grundlagen üben</button>
            <button type="button" onClick={()=>setStage("build")}>Weiter zum Satzbau</button>
          </div>
        </section>:null}
        {stage==="build"?<section className="p27-journey__panel">
          <P28SentenceBuilder key={unit.id+":"+owner} unitId={unit.id} owner={owner} disabled={disabled}
            onReviewed={()=>setReload(n=>n+1)} onContinue={()=>setStage("conversation")}/>
        </section>:null}
        {stage==="conversation"?<section className="p27-journey__panel">
          <h4>Mehrstufiger Dialog</h4>
          {p40ActiveArc&&p40CurrentTurn?<section className="p27-journey__p40-dialogue"
            aria-label={"Originales Gespräch mit "+p40ActiveArc.turns.length+" Schritten"}>
            <h5>{p40ActiveArc.turns.length} Gesprächszüge — Bedeutung beibehalten</h5>
            <p>Diese geführte Gegenüberstellung ist <strong>unbewertet</strong>.
              Die Antworten der Gesprächspartner sind vorgegeben. Die getrennten
              StudyPlayer-Aufgaben prüfen anschließend ohne eingeblendete Lösung.</p>
            <div className="p27-journey__p40-arcs" role="group" aria-label="Gesprächssituation wechseln">
              {p40UnitArcs.map(arc=><button key={arc.id} type="button"
                aria-pressed={p40ActiveArc.id===arc.id}
                onClick={()=>{setP40ArcId(arc.id);setP40TurnIndex(0);setP40Choice("");
                  setP40GuidedHistory([]);setP40GuidedFinished(false);}}>
                {arc.title}</button>)}
            </div>
            <p>{p40ActiveArc.setting}</p>
            {p42ActiveArc?<div className="p27-journey__p42-speaker" aria-label="Sprecherrolle und sozialer Kontext">
              <strong>Sprecherwechsel gegenüber der früheren Situation</strong>
              <p>{p42ActiveArc.interlocutor} · {p42ActiveArc.relationship}</p>
              <p><strong>Passendes Register:</strong>{" "}
                {p42ActiveArc.register==="polite"?"Höflicher Erst- oder Servicekontakt":"Vertraut und informell"}</p>
              <p><strong>Ausgangsfall:</strong> {p41ArcById(p42ActiveArc.baseArcId)?.title??"früherer Dialog"}</p>
              <p><strong>Geändert:</strong> {p42ActiveArc.variation}</p>
              {p41ArcById(p42ActiveArc.baseArcId)&&
                p41ArcById(p42ActiveArc.baseArcId)!.units.includes(unitId)?
                <button type="button" onClick={()=>{
                  setP40ArcId(p42ActiveArc.baseArcId);setP40TurnIndex(0);setP40Choice("");
                  setP40GuidedHistory([]);setP40GuidedFinished(false);
                }}>Ursprüngliche Gesprächssituation ansehen</button>:null}
              <details><summary>Welche Funktion musst du übertragen?</summary>
                <p>{p42ActiveArc.contrast}</p>
                <p>Diese Hilfe erklärt den Kontext, gibt aber keine unabhängige Abrufbewertung.</p>
              </details>
            </div>:null}
            {p41ActiveArc?<p className="p27-journey__p41-outcome">
              <strong>Ziel der Unterhaltung:</strong> {p41ActiveArc.outcome} · {p41ActiveArc.level}
            </p>:null}
            {p40GuidedHistory.length>0?<div className="p27-journey__p41-history">
              <strong>Bisherige Gesprächsantworten</strong>
              <ol>{p40GuidedHistory.map(h=><li key={h.turnId}>
                <span lang="ja">{h.partner}</span> →
                <span lang="ja">{h.answer}</span>
                <small>{h.note}</small>
              </li>)}</ol>
              <small>Nur die ausgewählten Originalbeispiele dieser Unterrichtsansicht.
                Keine gespeicherten Antworten oder Lernbewertungen.</small>
            </div>:null}
            <article aria-label={"Gesprächsschritt "+p40CurrentTurn.number}>
              <strong>Schritt {p40CurrentTurn.number} von {p40ActiveArc.turns.length}</strong>
              <p><strong>Gesprächspartner:</strong> <span lang="ja">{p40CurrentTurn.partner}</span></p>
              <p><strong>Dein Ziel:</strong> {p40CurrentTurn.intention}</p>
              {p41ActiveArc?.pivotTurn===p40CurrentTurn.number?<div className="p27-journey__p41-pivot">
                <strong>Neue Information: passe nur den betroffenen Teil des bisherigen Plans an.</strong>
                <p>{p41ActiveArc.turns[p40TurnIndex]?.shift}</p>
                <small>Gegenstand, Tag, Preis oder Ort können wechseln; andere Zusagen bleiben gültig.</small>
              </div>:null}
              <div className="p27-journey__p40-options" role="group" aria-label="Antwort im Verlauf auswählen">
                {[p40CurrentTurn.misstep,p40CurrentTurn.model,p40CurrentTurn.alternative].map(form=>
                  <button key={form} type="button" lang="ja" disabled={p40GuidedFinished}
                    aria-pressed={p40Choice===form} onClick={()=>setP40Choice(form)}>{form}</button>)}
              </div>
              {p40Choice?<div className="p27-journey__p40-feedback" role="status">
                <strong>{p40TurnFeedback(p40CurrentTurn,p40Choice).kind==="authored"?
                  "Passende Ausdrucksweise":"Diese Antwort verfehlt die beabsichtigte Gesprächsrichtung"}</strong>
                <p>{p40TurnFeedback(p40CurrentTurn,p40Choice).message}</p>
                {p42ActiveArc?<p>{p42ActiveArc.contrast}</p>:null}
                <small>Nur dieses Beispiel ist beurteilt; keine Aussage über freie Alternativen.</small>
              </div>:null}
              <div className="p27-journey__actions">
                <button type="button" disabled={!p40Choice||p40GuidedFinished}
                  onClick={()=>{
                    const feedback=p40TurnFeedback(p40CurrentTurn,p40Choice);
                    setP40GuidedHistory(previous=>[...previous,{
                      turnId:p40CurrentTurn.id,partner:p40CurrentTurn.partner,
                      answer:p40Choice,note:feedback.kind==="authored"?
                        "Zur beabsichtigten Aussage passend":feedback.message
                    }]);
                    if(p40TurnIndex+1===p40ActiveArc.turns.length)setP40GuidedFinished(true);
                    else {setP40TurnIndex(i=>i+1);setP40Choice("");}
                  }}>
                  {p40TurnIndex===p40ActiveArc.turns.length-1?"Gespräch abschließen":
                    "Nächste Gesprächsantwort"}
                </button>
                <button type="button" onClick={()=>{setP40TurnIndex(0);setP40Choice("");
                  setP40GuidedHistory([]);setP40GuidedFinished(false);}}>
                  Gespräch von vorn ansehen
                </button>
              </div>
            </article>
            {p40GuidedFinished?<div className="p27-journey__p41-completed" role="status">
              <strong>Geführter Gesprächsverlauf abgeschlossen</strong>
              <p>{p41ActiveArc?.outcome??p40ActiveArc.setting}</p>
              <p>Prüfe die falschen und richtigen Richtungsentscheidungen oben.
                Dieses Gespräch war eine unbewertete Unterrichtsaktivität.
                Eine spätere unabhängige Wiederholung wird ausschließlich durch
                deine wirkliche FSRS-Karte bestimmt.</p>
            </div>:null}
            <div className="p27-journey__actions">
              <button type="button" disabled={disabled}
                onClick={()=>onJourneyPractice(unitId,`dialogue:${p40ActiveArc.id}`)}>
                {p40ActiveArc.turns.length} Schritte im StudyPlayer selbstständig beantworten
              </button>
              <button type="button" onClick={()=>chooseP40Writing(p40ActiveArc.id)}>
                {p41ActiveArc?"Den Planwechsel":"Den zweiten Zug"} schriftlich korrigieren
              </button>
            </div>
          </section>:null}
          <div className="p27-journey__filters" role="group" aria-label="Antwortart">
            <button type="button" aria-pressed={inputMode==="compose"} onClick={()=>{setInputMode("compose");setFeedback(null);}}>Selbst formulieren</button>
            <button type="button" aria-pressed={inputMode==="choose"} onClick={()=>{setInputMode("choose");setHintUsed(true);setChoiceExampleSeen(true);setFeedback(null);}}>Antworten auswählen</button>
          </div>
          {nodeId!=="__finished__"&&stepsTaken<14?<div>
            <p className="p27-journey__muted">Gesprächsschritt {stepsTaken+1} · höchstens 14</p>
            <div className="p27-journey__note"><strong>Gesprächspartner</strong>
              <p className="p27-journey__japanese" lang="ja">{turn.partner}</p>
              {showTranslation?<p>{turn.meaning}</p>:null}
              <button type="button" onClick={()=>speak(turn.partner)}>Synthetisch anhören</button>
            </div>
            <label><input type="checkbox" checked={showTranslation}
              onChange={e=>{
                setShowTranslation(e.target.checked);
                if(e.target.checked){
                  setHintUsed(true);
                  revealedTurnIds.current.add(unitId+":"+turn.id);
                }
              }}/> Deutsche Hilfe anzeigen</label>
            {inputMode==="compose"?<>
              <label htmlFor="p27-reply">Deine japanische Antwort</label>
              <textarea rows={3} id="p27-reply" lang="ja" value={answer} disabled={disabled||Boolean(feedback)||busy}
                aria-keyshortcuts="Control+Enter Meta+Enter"
                onKeyDown={e=>{if(!e.nativeEvent.isComposing&&(e.ctrlKey||e.metaKey)&&e.key==="Enter"){
                  e.preventDefault();if(answer.trim()&&!disabled&&!busy&&!feedback)void submitText();
                }}}
                onChange={e=>setAnswer(e.target.value)}/>
              <div className="p27-journey__actions">
                <button type="button" disabled={disabled||busy||Boolean(feedback)||!answer.trim()}
                  onClick={()=>void submitText()}>Antwort vergleichen</button>
                <button type="button" disabled={busy||Boolean(feedback)} onClick={()=>recognize("answer")}>Diktieren</button>
                <button type="button" disabled={busy||Boolean(feedback)}
                  onClick={()=>{setHintUsed(true);speak(turn.reference);}}>Musterhilfe anhören (unbewertet)</button>
              </div>
              {voiceStatus?<p role="status">{voiceStatus} Die Browser-Spracherkennung kann externe Dienste verwenden.</p>:null}
            </>:<div className="p27-journey__choices">
              {turn.options.map((o,i)=><button type="button" key={i} disabled={disabled||busy||Boolean(feedback)}
                onClick={()=>void choose(o)}><span lang="ja">{o.japanese}</span>
                {showTranslation?<small>{o.meaning}</small>:null}</button>)}
            </div>}
            {feedback?<div className="p27-journey__note" role="status">
              <strong>{feedback.message}</strong>
              <p><span lang="ja">{feedback.model}</span> · mögliche Musterantwort</p>
              {firstConversationDraft&&answer&&firstConversationDraft!==answer?<div className="p27-journey__revision">
                <strong>Deine überarbeitete Antwort</strong>
                <p>Erste Fassung: <span lang="ja">{firstConversationDraft}</span></p>
                <p>Neue Fassung: <span lang="ja">{answer}</span></p>
                <ul>{describeP29Revision(firstConversationDraft,answer,unit).suggestions.map((tip,i)=>
                  <li key={i}>{tip}</li>)}</ul>
                <small>Nach dem Vergleich mit einer Musterantwort wird diese Revision nicht als unabhängiger FSRS-Abruf gewertet.</small>
              </div>:null}
              <ul>{feedback.notes.map((n,i)=><li key={i}>{n}</li>)}</ul>
              {feedback.next===turn.id?<div className="p27-journey__intents">
                <strong>Gesprächsrichtung wählen — ohne Bewertungsnachweis</strong>
                <p>Deine freie Antwort war nicht sicher einzuordnen. Wähle die Absicht,
                  damit die nächste Rückfrage zu deinem Vorhaben passt.</p>
                {turn.options.filter(o=>o.valid).map((o,i)=><button type="button" key={i}
                  onClick={()=>{
                    const followup=nextTurn(unit,turn,o);
                    setFeedback(null);setStepsTaken(n=>n+1);setNodeId(followup??"__finished__");
                    setAnswer("");setFirstConversationDraft("");setHintUsed(false);
                    setChoiceExampleSeen(false);setSpeechUsed(false);started.current=performance.now();
                  }}><span lang="ja">{o.japanese}</span> — {o.meaning}</button>)}
              </div>:null}
              <div className="p27-journey__actions">
                <button type="button" onClick={()=>{setFeedback(null);setHintUsed(true);setChoiceExampleSeen(true);setSpeechUsed(false);started.current=performance.now();}}>Antwort überarbeiten (Text beibehalten)</button>
                <button type="button" onClick={continueDialogue}>Fortfahren</button>
              </div>
            </div>:null}
          </div>:<div className="p27-journey__note" role="status">
            <strong>{nodeId==="__finished__"?"Gespräch abgeschlossen":"Nach wiederholten Versuchen unterbrochen"}</strong>
            <p>Auswahl oder Mustererkennung sind keine umfassende Bewertung freier Gespräche.</p>
          </div>}
          {roleScenarios.length?<details className="p27-journey__role">
            <summary>Rollen wechseln & ohne Vorlage antworten · {roleScenarios.length} Situation{roleScenarios.length===1?"":"en"}</summary>
            <P33RolePractice key={unit.id+":"+owner} unitId={unit.id} owner={owner}
              disabled={disabled} onReviewed={()=>setReload(n=>n+1)}
              dueCount={recallPlan?.dueNow.length??0}
              onReview={()=>onJourneyPractice(unitId,"review")}
              onGrammar={()=>onJourneyPractice(unitId,"grammar")}
              traces={evidence?.traces??[]}
              onRoleDue={scenarioId=>onRoleDuePractice(unitId,scenarioId)}
              onCorrectionDue={scenarioId=>onCorrectionDuePractice(unitId,scenarioId)}/>
          </details>:null}
          {(nodeId==="__finished__"||stepsTaken>=14)?<P28Continuity key={unit.id+":"+owner}
            unitId={unit.id} owner={owner} disabled={disabled} onReviewed={()=>setReload(n=>n+1)}
            onOpenUnit={selectUnit}/>:null}
          <div className="p27-journey__actions">
            <button type="button" onClick={resetDialogue}>Gespräch wiederholen</button>
            <button type="button" onClick={()=>setStage("write")}>Weiter: Schreiben</button>
          </div>
        </section>:null}
        {stage==="write"?<section className="p27-journey__panel">
          <h4>Eigene Sätze schreiben oder sprechen und überarbeiten</h4>
          {p38WritingCases.length>0?<section className="p27-journey__p38-writing" aria-label="Neue Situationen schriftlich übertragen">
            <h5>Aus anderen Themen in den Alltag übertragen</h5>
            <p>Übertrage gelernte Partikel, Zeitformen und höfliche Bitten. Die
              Musterlösungen werden erst im bestehenden StudyPlayer nach einem Versuch
              gezeigt. Freies Schreiben hier bleibt unabhängig von FSRS-Bewertungen.</p>
            {p38WritingCases.slice(0,3).map(item=><div key={item.id}>
              <strong>{item.title}</strong><p>{item.task}</p>
              <small>Im StudyPlayer sind zwei sinnvolle japanische Formulierungen hinterlegt.</small>
            </div>)}
            <button type="button" disabled={disabled}
              onClick={()=>onJourneyPractice(unitId,"transfer")}>
              Situationswechsel selbstständig üben
            </button>
          </section>:null}
          {p40UnitArcs.length?<section className="p27-journey__p40-writing" aria-label="Zusammenhängendes Gespräch schriftlich korrigieren">
            <h5>Antwort aus einem Gespräch korrigieren</h5>
            <p>Wähle einen Gesprächskontext. Überarbeite die entscheidende Antwort
              nach dem unerwarteten Hinweis. Bei längeren Dialogen kannst du auch andere Züge auswählen.
              Die Musterantwort erscheint erst im vorhandenen Überarbeitungsablauf.</p>
            <div className="p27-journey__p40-arcs" role="group" aria-label="Gespräch für Schreibaufgabe wählen">
              {p40UnitArcs.map(arc=><button key={arc.id} type="button"
                aria-pressed={p40WritingArc?.id===arc.id} onClick={()=>chooseP40Writing(arc.id)}>
                {arc.title}</button>)}
            </div>
            {p40WritingArc&&p40WritingTurn?<div className="p27-journey__p40-context">
              {(p41ArcById(p40WritingArc.id)||p42ArcById(p40WritingArc.id))?<div className="p27-journey__p41-writing-turns"
                role="group" aria-label="Gesprächszug zur schriftlichen Korrektur auswählen">
                {p40WritingArc.turns.slice(1).map((item,i)=><button key={item.id}
                  type="button" aria-pressed={p40WritingTurnIndex===i+1}
                  onClick={()=>chooseP40Writing(p40WritingArc.id,i+1)}>
                  Schritt {item.number}{(p41ArcById(p40WritingArc.id)??p42ArcById(p40WritingArc.id))?.pivotTurn===item.number?" · Planwechsel":""}
                </button>)}
              </div>:null}
              {p40WritingTurnIndex>0?<p><strong>Vorherige Ziele:</strong>{" "}
                {p40WritingArc.turns.slice(0,p40WritingTurnIndex).map(t=>t.intention).join(" → ")}</p>:null}
              <p><strong>Bisheriger Verlauf:</strong> {p40WritingArc.setting}</p>
              {p42ArcById(p40WritingArc.id)?<p><strong>Adressat und Register:</strong>{" "}
                {p42ArcById(p40WritingArc.id)?.interlocutor} ·
                {p42ArcById(p40WritingArc.id)?.register==="polite"?" höflich":" vertraut"}.
                {p42ArcById(p40WritingArc.id)?.contrast}</p>:null}
              <p><strong>Gesprächspartner:</strong> <span lang="ja">{p40WritingTurn.partner}</span></p>
              <p><strong>Fehlerhafter Satz:</strong> <span lang="ja">{p40WritingTurn.misstep}</span></p>
              <p><strong>Absicht:</strong> {p40WritingTurn.intention}</p>
              {(p41ArcById(p40WritingArc.id)||p42ArcById(p40WritingArc.id))?<p><strong>Gesprächsziel:</strong>{" "}
                {(p41ArcById(p40WritingArc.id)??p42ArcById(p40WritingArc.id))?.outcome}</p>:null}
            </div>:null}
            <button type="button" disabled={disabled}
              onClick={()=>onJourneyPractice(unitId,"production")}>
              Weitere unabhängige Schreibaufgaben im StudyPlayer
            </button>
          </section>:null}
          {p39UnitCases.length?<section className="p27-journey__p39-writing" aria-label="Alltagssituation für das Schreiben wählen">
            <h5>Gezielte Schreibkorrektur</h5>
            <p>Wähle einen Kontext; eine zuletzt verfehlte Lernkarte wird bevorzugt vorgeschlagen.
              Dein Entwurf bleibt im bestehenden Schreibfeld und wird nicht automatisch sprachlich bewertet.</p>
            <div className="p27-journey__p39-picker" role="group" aria-label="Schreibsituation">
              <button type="button" aria-pressed={!p39Chosen&&!p40WritingTurn}
                onClick={()=>{setP39WritingId("");setP40WritingArcId("");setDraft("");setRewrite("");setRewriteStage("draft");setReport(null);setSaved(false);}}>
                Reguläres Lernziel</button>
              {p39UnitCases.map(c=><button key={c.id} type="button" aria-pressed={p39Chosen?.id===c.id}
                onClick={()=>{setP39WritingId(c.id);setP40WritingArcId("");setDraft("");setRewrite("");setRewriteStage("draft");setReport(null);setSaved(false);}}>
                {c.title}{p39Priority?.id===c.id?" · Vorschlag":""}</button>)}
            </div>
            {p39Chosen?<p>Problematischer Ausgangssatz: <span lang="ja">{p39Chosen.distractors[0]?.form}</span>.
              Formuliere diesen Satz für die vorgegebene Absicht neu.</p>:null}
            <button type="button" disabled={disabled} onClick={()=>onJourneyPractice(unitId,"production")}>
              Unabhängige Schreibkorrekturen im StudyPlayer</button>
          </section>:null}
          <p>{p40WritingTurn?p40WritingTurn.intention:p39Chosen?p39Chosen.situation:unit.writing.task}</p>
          <p className="p27-journey__keyhint">Tastatur: Strg + Enter (Mac: ⌘ + Enter) vergleicht Antworten oder öffnet den nächsten Schreibschritt. Japanische IME-Eingabe bleibt ungestört.</p>
          <label htmlFor="p27-draft">Erste Fassung</label>
          <textarea id="p27-draft" rows={4} lang="ja" value={draft}
            aria-keyshortcuts="Control+Enter Meta+Enter"
            onKeyDown={e=>{if(!e.nativeEvent.isComposing&&(e.ctrlKey||e.metaKey)&&e.key==="Enter"){
              e.preventDefault();if(draft.trim()&&!busy){
                setRewrite(draft);setRewriteStage("revise");setReport(null);setSaved(false);
              }
            }}}
            onChange={e=>{
            setDraft(e.target.value);setRewriteStage("draft");setReport(null);setSaved(false);
          }}/>
          <div className="p27-journey__actions">
            <button type="button" onClick={()=>recognize("draft")}>Diktieren</button>
            <button type="button" disabled={!draft.trim()} onClick={()=>{
              setRewrite(draft);setRewriteStage("revise");setReport(null);setSaved(false);
            }}>Überarbeiten</button>
          </div>
          {rewriteStage!=="draft"?<>
            <div className="p27-journey__note">
              <strong>Orientierung zur Korrektur</strong>
              <p>{p40WritingTurn?p40WritingTurn.why:p39Chosen?p39Chosen.rule:unit.writing.reflection}</p>
              {!p39Chosen&&!p40WritingTurn?<p><span lang="ja">{unit.writing.features.join(" · ")}</span></p>:null}
              <details><summary>Originales Beispiel vergleichen</summary>
                <p lang="ja">{p40WritingTurn?p40WritingTurn.model:p39Chosen?p39Chosen.model:unit.writing.reference}</p>
                {p40WritingTurn?<p lang="ja">{p40WritingTurn.alternative}</p>:
                  p39Chosen?<p lang="ja">{p39Chosen.alternative}</p>:null}</details>
            </div>
            <label htmlFor="p27-rewrite">Überarbeitete Version</label>
            <textarea id="p27-rewrite" rows={4} lang="ja" value={rewrite}
              aria-keyshortcuts="Control+Enter Meta+Enter"
              onKeyDown={e=>{if(!e.nativeEvent.isComposing&&(e.ctrlKey||e.metaKey)&&e.key==="Enter"){
                e.preventDefault();if(rewrite.trim()&&!busy){
                  setReport(compareWriting(draft,rewrite,p39Chosen||p40WritingTurn?[]:unit.writing.features));setRewriteStage("compare");
                }
              }}}
              onChange={e=>{
              setRewrite(e.target.value);setRewriteStage("revise");setReport(null);setSaved(false);
            }}/>
            <div className="p27-journey__actions">
              <button type="button" onClick={()=>recognize("rewrite")}>Überarbeitung diktieren</button>
              <button type="button" disabled={!rewrite.trim()} onClick={()=>{
                setReport(compareWriting(draft,rewrite,p39Chosen||p40WritingTurn?[]:unit.writing.features));setRewriteStage("compare");
              }}>Versionen vergleichen</button>
            </div>
          </>:null}
          {rewriteStage==="compare"&&report?<div className="p27-journey__note" role="status">
            <strong>Zeichenbasierte Beobachtungen, keine Sprachbewertung</strong>
            <p>{report.oldLength} → {report.newLength} Zeichen. Geändert: {report.changed?"ja":"nein"}</p>
            {p40WritingTurn?<div className="p27-journey__p40-feedback">
              <strong>Kontextgebundene Schreibkorrektur, keine freie Sprachnotenvergabe</strong>
              <p>{p40TurnFeedback(p40WritingTurn,rewrite).message}</p>
              {p40TurnFeedback(p40WritingTurn,rewrite).kind==="unknown"?<small>
                Andere japanische Antworten bleiben ausdrücklich ungeprüft.</small>:null}
            </div>:p39Chosen?<div className="p27-journey__p39-feedback">
              <strong>Nur Abgleich mit bekannten Beispielvarianten</strong>
              <p>{p39AuthoredFeedback(p39Chosen,rewrite).message}</p>
              {p39AuthoredFeedback(p39Chosen,rewrite).kind==="unknown"?<small>
                Andere Formulierungen können richtig sein und bleiben hier unbewertet.</small>:null}
            </div>:<>
              <p>Erkannte Zielzeichenfolgen: {report.found.join(" · ")||"keine"}</p>
              <p>Nicht erkannt: {report.missing.join(" · ")||"keine"}</p>
              <ul>{grammarReflection(unit,rewrite).map((note,i)=><li key={i}>{note}</li>)}</ul>
            </>}
            {!p39Chosen&&!p40WritingTurn?<div className="p27-journey__revision">
              <strong>Überarbeitete Partikeln und Formen</strong>
              <p>Neue Partikeln: {describeP29Revision(draft,rewrite,unit).addedParticles.join(" · ")||"keine"}</p>
              <p>Entfernte Partikeln: {describeP29Revision(draft,rewrite,unit).removedParticles.join(" · ")||"keine"}</p>
              <p>Geänderte Höflichkeits-/Zeitformen: {describeP29Revision(draft,rewrite,unit).formChanges.join(" · ")||"keine"}</p>
              {pragmatics?<details><summary>Höflicher und lockerer Stil im Vergleich</summary>
                <p lang="ja">{pragmatics.polite} / {pragmatics.casual}</p>
                <p>{pragmatics.explanation}</p></details>:null}
            </div>:null}
            <button type="button" disabled={disabled||busy||saved} onClick={()=>void saveRevision()}>
              Unbewertete Überarbeitung protokollieren</button>
            {saved?<p>Ohne Rohtext oder Audiodatei gespeichert; kein FSRS-Erfolg.</p>:null}
          </div>:null}
          <button type="button" onClick={()=>setStage("practice")}>Weiter: Wiederholen</button>
        </section>:null}
        {stage==="practice"?<section className="p27-journey__panel">
          <h4>Kontextualisierte Wiederholung</h4>
          {dueUnits.length?<div className="p27-journey__due-shortcuts">
            <h5>Jetzt fällige Wiederholungen</h5>
            <p>Diese direkten Aktionen starten die bestehenden FSRS-Wiederholungssitzungen,
              keine neuen oder bloß freiwilligen Übungen.</p>
            {dueUnits.map(item=><div key={item.unitId} className="p27-journey__due-row">
              <div><strong>{journeyUnit(item.unitId).title}</strong>
                <small>{item.due} fällige Karten</small></div>
              <button type="button" disabled={disabled}
                onClick={()=>onJourneyPractice(item.unitId,"review")}>Jetzt wiederholen</button>
              <button type="button" onClick={()=>{
                setUnitId(item.unitId);setStage("practice");
              }}>Einheit ansehen</button>
            </div>)}
          </div>:nearestReturn?<div className="p27-journey__return-navigation">
            <strong>Nächste bereits geplante Wiederholung</strong>
            <p>{journeyUnit(nearestReturn.unitId).title} ·
              {new Date(nearestReturn.nextDueAt!).toLocaleString("de-DE",{dateStyle:"medium",timeStyle:"short"})}</p>
            <button type="button" disabled={disabled} onClick={()=>{
              setUnitId(nearestReturn.unitId);setStage("practice");
            }}>Einheit für später ansehen</button>
          </div>:null}
          {recallPlan?<section className="p27-journey__recall" aria-label="Geplante FSRS-Wiederholung">
            <h5>Später wieder abrufen · tatsächliche FSRS-Termine</h5>
            <p>{recallPlan.explanation}</p>
            <div className="p27-journey__recall-stats">
              <span><strong>{recallPlan.dueNow.length}</strong> jetzt fällig</span>
              <span><strong>{recallPlan.notYetDue}</strong> später geplant</span>
            </div>
            {recallPlan.nextDue?<p>Nächster geplanter Termin: <strong>
              {new Date(recallPlan.nextDue.dueAt).toLocaleString("de-DE",{dateStyle:"medium",timeStyle:"short"})}
            </strong></p>:null}
            {recallPlan.recentlyReviewed>0?<p>{recallPlan.recentlyReviewed} geübte Abrufe innerhalb der letzten {recallPlan.recentWindowMinutes} Minuten.
              Für noch nicht fällige Inhalte ist kein sofortiger erneuter FSRS-Abruf erforderlich.</p>:null}
            <button type="button" disabled={disabled||recallPlan.dueNow.length===0}
              onClick={()=>onJourneyPractice(unitId,"review")}>Fällige Karten jetzt wiederholen</button>
          </section>:null}
          {p40ReturnCueStatus.length?<section className="p27-journey__p40-return"
            aria-label="Gesprächsinhalte in neuem Kontext wieder abrufen">
            <h5>Später ohne Dialogvorlage wieder abrufen</h5>
            <p>Jeder Fall hat eine zusätzliche, anders formulierte Alltagsaufgabe.
              Nur nach einem unabhängigen ersten Abruf erzeugt die bestehende
              FSRS-Karte einen zukünftigen Termin. Ohne Termin ist die Übung
              <strong> nicht überfällig</strong>. Freiwilliges Vorziehen kann FSRS aktualisieren.</p>
            {p40ReturnCueStatus.map(cue=><div key={cue.id} className="p27-journey__p40-return-item">
              <div><strong>{p40UnitArcs.find(arc=>arc.id===cue.arcId)?.title??"Gesprächstransfer"}</strong>
                <small>{cue.due?"Jetzt laut FSRS fällig":
                  cue.planned?"Für einen späteren FSRS-Termin eingeplant":
                  "Noch kein FSRS-Termin vorhanden"}</small></div>
              <button type="button" disabled={disabled||!cue.due}
                onClick={()=>onJourneyPractice(unitId,`return-due:${cue.arcId}`)}>
                Fälligen Abruf üben
              </button>
              <button type="button" disabled={disabled}
                onClick={()=>onJourneyPractice(unitId,`return:${cue.arcId}`)}>
                Freiwillig selbstständig üben
              </button>
            </div>)}
          </section>:null}
          <p>Heute fällige Karten, letzte Fehler und neue Situationen werden aus demselben bestehenden Lernverlauf ermittelt.</p>
          <div className="p27-journey__practice-paths" aria-label="Drei unterschiedliche Lernwege">
            <section>
              <strong>{profile?.unseen??0} neu</strong>
              <p>Erste Begegnung mit noch nicht unabhängig bewerteten oder
                eingeplanten Aufgaben. Nicht als überfällig bezeichnet.</p>
              <button type="button" disabled={disabled||!(profile?.unseen)}
                onClick={()=>onJourneyPractice(unitId,"new")}>Neu lernen</button>
            </section>
            <section>
              <strong>{profile?.retry??0} zuletzt fehlerhaft</strong>
              <p>Freiwillige erneute Übung nach einem bewerteten Fehler.
                Dies kann einen zukünftigen FSRS-Termin vorziehen.</p>
              <button type="button" disabled={disabled||!(profile?.retry)}
                onClick={()=>onJourneyPractice(unitId,"retry")}>Fehler üben</button>
            </section>
            <section>
              <strong>{profile?.due??0} laut FSRS fällig</strong>
              <p>Nur Karten, deren festgelegter FSRS-Wiederholungstermin
                bereits erreicht wurde.</p>
              <button type="button" disabled={disabled||!(profile?.due)}
                onClick={()=>onJourneyPractice(unitId,"review")}>Jetzt wiederholen</button>
            </section>
          </div>
          {mistakes.length>0?<section className="p27-journey__mistakes" aria-labelledby="p35-mistakes-title">
            <h5 id="p35-mistakes-title">Konkrete letzte Fehler gezielt wiederholen</h5>
            <p>Diese Aufgaben hatten zuletzt einen <strong>unabhängig bewerteten</strong>
              fehlerhaften Versuch. Das ist nicht automatisch ein fälliger FSRS-Termin.
              Eine freiwillige gezielte Wiederholung kann deinen FSRS-Zeitplan aktualisieren.</p>
            {mistakes.map(mistake=><div className="p27-journey__mistake" key={mistake.promptId}>
              <div><strong>{mistake.label}</strong>
                <span>{mistake.context}</span>
                <small>Letzter Fehler: {new Date(mistake.lastIncorrectAt).toLocaleString("de-DE",{dateStyle:"medium",timeStyle:"short"})}</small>
                <small><strong>{p37ReviewSignal(mistake.promptId,reviewCatalog,evidence?.traces??[]).status}</strong></small>
                <small>{p37ReviewSignal(mistake.promptId,reviewCatalog,evidence?.traces??[]).explanation}</small>
                {p37ReviewSignal(mistake.promptId,reviewCatalog,evidence?.traces??[]).nextDueAt?
                  <small>FSRS-Wiederholung ab {new Date(p37ReviewSignal(mistake.promptId,reviewCatalog,evidence?.traces??[]).nextDueAt!).toLocaleString("de-DE",{dateStyle:"medium",timeStyle:"short"})}</small>:null}
              </div>
              <div className="p27-journey__mistake-actions">
                <button type="button" disabled={disabled}
                  onClick={()=>onMistakePractice(unitId,mistake.promptId)}>
                  Genau diese Aufgabe üben
                </button>
                <details>
                  <summary>Worauf achten? (ohne Antwortvorgabe)</summary>
                  <strong>{p36RemediationHint(mistake.promptId,extraJourneyPrompts).title}</strong>
                  <p>{p36RemediationHint(mistake.promptId,extraJourneyPrompts).promptSpecificGoal}</p>
                  <button type="button" onClick={()=>
                    setStage(p36RemediationHint(mistake.promptId,extraJourneyPrompts).lessonStage)}>
                    {p36RemediationHint(mistake.promptId,extraJourneyPrompts).action}
                  </button>
                </details>
              </div>
            </div>)}
          </section>:null}
          {weakAreas?<div className="p27-journey__weakareas">
            <h5>Übungsschwerpunkte aus echten Versuchen</h5>
            <p>Diese Zahlen sind <strong>keine</strong> Sprachstand- oder Beherrschungsprozente. Sie beruhen auf fälligen Karten und zuletzt bewerteten Antworten.</p>
            <div className="p27-journey__weakgrid">
              {weakAreas.areas.filter(area=>area.total>0).map(area=><div key={area.area}>
                <strong>{areaLabels[area.area]}</strong>
                <p>{area.reason}</p>
                <small>{area.practiced} von {area.total} Übungscues bisher versucht</small>
                <button type="button" disabled={disabled} onClick={()=>{
                  if(area.area==="sentence"){setStage("build");return;}
                  if(area.area==="grammar"){onJourneyPractice(unitId,"grammar");return;}
                  if(area.area==="dialogue"){onJourneyPractice(unitId,"production");return;}
                  onJourneyPractice(unitId,"transfer");
                }}>
                  {area.area==="sentence"?"Satzbau gezielt üben":
                  area.area==="grammar"?"Grammatikkontraste üben":
                  area.area==="dialogue"?"Aktive Antworten üben":"Wörter übertragen"}
                </button>
              </div>)}
            </div>
          </div>:null}
          {nextActions.length?<div className="p27-journey__adaptive">
            <h5>Deine nächsten Lernschritte</h5>
            <p>Aus dem vorhandenen lokalen Lernverlauf abgeleitet, ohne neue Beherrschungsnote.</p>
            {nextActions.map(action=><button key={action.id} type="button"
              disabled={disabled} onClick={()=>{
                if(action.focus==="review"){
                  const target=progress.find(p=>p.id===action.unitId);
                  onJourneyPractice(action.unitId,(target?.due??0)>0?"review":"retry");
                  return;
                }
                if(action.focus==="transfer"){onJourneyPractice(action.unitId,"transfer");return;}
                if(action.unitId!==unitId)selectUnit(action.unitId);
                setStage(action.focus==="sentence"?"build":"conversation");
              }}>
              <strong>{action.label}</strong><small>{action.reason}</small>
            </button>)}
          </div>:null}
          {learningLinks.length?<div className="p27-journey__linked">
            <h5>Wörter zwischen Themen verbinden</h5>
            {learningLinks.map(link=><article key={link.id}>
              <p lang="ja">{link.example}</p><p>{link.translation}</p>
              <small>{link.first} ({link.firstMeaning}) · {link.second} ({link.secondMeaning})</small>
            </article>)}
            <button type="button" disabled={disabled}
              onClick={()=>onJourneyPractice(unitId,"transfer")}>Verknüpften Wortschatz im StudyPlayer abrufen</button>
          </div>:null}
          <div className="p27-journey__actions">
            <button type="button" disabled={disabled} onClick={()=>onJourneyPractice(unitId,"transfer")}>Transfer in neue Situationen</button>
            <button type="button" disabled={disabled} onClick={()=>onJourneyPractice(unitId,"register")}>Höflichkeit & Register</button>
            <button type="button" disabled={disabled} onClick={()=>onSourcePractice(unit.source,unit.sourceId,"context")}>Weitere Übungen zu diesem Thema</button>
          </div>
          <button type="button" onClick={()=>selectUnit(journeyUnits[(journeyUnits.indexOf(unit)+1)%journeyUnits.length]!.id)}>
            Nächste Einheit öffnen</button>
        </section>:null}
        {error?<p role="alert" className="p27-journey__error">{error}</p>:null}
      </div>
    </div>
    <p className="p27-journey__muted">Unabhängige Originalinhalte; Marugoto wurde nicht importiert. Nur eigenständig getippte passende Zielantworten zählen als FSRS-Abruf. Freie alternative Antworten bleiben unbewertet, statt pauschal falsch zu sein.</p>
  </section>;
}
