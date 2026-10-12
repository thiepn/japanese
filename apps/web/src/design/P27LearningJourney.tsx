import {useEffect,useMemo,useRef,useState} from "react";
import {listMemoryTraces,listStudyEvents,saveStudyEvent} from "@thiepn/local-db";
import {gradeStudyPrompt} from "@thiepn/study-player";
import type {StudyEvent} from "@thiepn/domain";
import {DEVELOPMENT_DEVICE_ID,getDevelopmentAccountId,recordStudyAnswer} from "../study/runtime";
import {normalizeP26} from "../study/pedagogy26";
import {grammarReflection} from "../study/feedback27";
import {
  deriveJourneyProgress,journeyTypedPrompt,journeyUnits,journeyUnit,nextTurn,recommendedJourneyUnit,
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
const steps:[JourneyStage,string][]=[["learn","1 · Verstehen"],["conversation","2 · Antworten"],["write","3 · Schreiben"],["practice","4 · Festigen"]];
function compareWriting(before:string,after:string,features:readonly string[]):RewriteReport{
  const oldText=normalizeP26(before),newText=normalizeP26(after);
  return {changed:oldText!==newText,oldLength:[...oldText].length,newLength:[...newText].length,
    found:features.filter(f=>newText.includes(normalizeP26(f))),
    missing:features.filter(f=>!newText.includes(normalizeP26(f)))};
}
export function P27LearningJourney({disabled,onSourcePractice,onJourneyPractice}:{
  disabled:boolean;
  onSourcePractice:(source:JourneySource,sourceId:string,mode:SourceMode)=>void;
  onJourneyPractice:(id:string,mode:JourneyPractice)=>void;
}){
  const owner=getDevelopmentAccountId();
  const currentOwner=useRef(owner);currentOwner.current=owner;
  const [unitId,setUnitId]=useState(journeyUnits[0]!.id);
  const [level,setLevel]=useState<"all"|"A1"|"A2">("all");
  const [query,setQuery]=useState("");
  const [stage,setStage]=useState<JourneyStage>("learn");
  const [progress,setProgress]=useState<JourneyUnitProgress[]>([]);
  const [loading,setLoading]=useState(true);
  const [loadError,setLoadError]=useState("");
  const [reload,setReload]=useState(0);
  const [nodeId,setNodeId]=useState("");
  const [stepsTaken,setStepsTaken]=useState(0);
  const [inputMode,setInputMode]=useState<InputMode>("compose");
  const [answer,setAnswer]=useState("");
  const [feedback,setFeedback]=useState<Feedback|null>(null);
  const [hintUsed,setHintUsed]=useState(false);
  const [speechUsed,setSpeechUsed]=useState(false);
  const [showTranslation,setShowTranslation]=useState(false);
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
  const unit=journeyUnit(unitId);
  const turn=unit.turns.find(t=>t.id===nodeId)??unit.turns[0]!;
  const profile=progress.find(p=>p.id===unitId);
  const recommended=recommendedJourneyUnit(progress);
  const recommendedUnit=journeyUnit(recommended);
  const filtered=useMemo(()=>journeyUnits.filter(u=>
    (level==="all"||u.level===level)&&(!query.trim()||
      (u.title+" "+u.goal+" "+u.words.map(w=>w.form+" "+w.meaning).join(" ")).toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))
  ),[level,query]);
  useEffect(()=>{
    let active=true;setLoading(true);setLoadError("");
    void Promise.all([listStudyEvents(owner),listMemoryTraces(owner)]).then(([events,traces])=>{
      if(active&&currentOwner.current===owner)
        setProgress(deriveJourneyProgress(traces.filter(t=>t.userId===owner),events.filter(e=>e.userId===owner)));
    }).catch(()=>{if(active)setLoadError("Lernverlauf nicht verfügbar; die Übungen können trotzdem verwendet werden.");})
      .finally(()=>{if(active)setLoading(false);});
    return()=>{active=false;};
  },[owner,reload]);
  useEffect(()=>{
    microphone.current?.stop();microphone.current=null;
    setNodeId(unit.turns[0]!.id);setStepsTaken(0);setAnswer("");setFeedback(null);
    setHintUsed(false);setSpeechUsed(false);setShowTranslation(false);setInputMode("compose");
    setError("");setDraft("");setRewrite("");
    setRewriteStage("draft");setReport(null);setSaved(false);setVoiceStatus("");
    started.current=performance.now();
  },[unitId,owner]);
  useEffect(()=>()=>microphone.current?.stop(),[]);
  function selectUnit(id:string){setUnitId(id);setStage("learn");}
  function resetDialogue(){
    setNodeId(unit.turns[0]!.id);setStepsTaken(0);setAnswer("");setFeedback(null);
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
        ...(kind==="response"?{turnId:turn.id}:{})}
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
    const independent=exact&&!hintUsed&&!speechUsed;
    const choice=turn.options.find(o=>o.valid&&normalizeP26(o.japanese)===normalized);
    setBusy(true);setError("");
    try{
      if(independent)await recordStudyAnswer({prompt,response:normalized,result:"correct",
        responseTimeMs:Math.max(0,Math.round(performance.now()-started.current))});
      else await ungraded("response",answer,hintUsed||speechUsed);
      if(currentOwner.current!==account)return;
      setFeedback({kind:independent?"graded":"ungraded",model:turn.reference,
        message:independent?"Geübte Zielform unabhängig getroffen. FSRS-Übung gespeichert."
          :exact?"Zielform getroffen, aber mit Hilfe oder Spracherkennung: unbewerteter Versuch."
          :"Deine freie Antwort lässt sich mit den begrenzten Mustern nicht sicher beurteilen. Sie ist nicht automatisch falsch.",
        notes:[turn.hint,...grammarReflection(unit,answer)],
        next:exact?nextTurn(unit,turn,choice):turn.next});
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
      if(turn.originalPrompt?.promptType==="choice"){
        const prompt=turn.originalPrompt;
        await recordStudyAnswer({prompt,response:option.japanese,
          result:gradeStudyPrompt(prompt,option.japanese).result,
          responseTimeMs:Math.max(0,Math.round(performance.now()-started.current))});
      }else await ungraded("response",option.japanese,true);
      if(currentOwner.current!==account)return;
      setFeedback({kind:"choice",message:option.valid?"Situationsgerechte Auswahl.":"Missverständnis: Versuche eine passendere Antwort.",
        model:turn.reference,notes:[option.explanation,turn.hint],next:nextTurn(unit,turn,option)});
      setReload(n=>n+1);
    }catch{if(currentOwner.current===account)setError("Antwortauswahl konnte nicht gespeichert werden.");}
    finally{if(currentOwner.current===account)setBusy(false);}
  }
  function continueDialogue(){
    if(!feedback||busy)return;
    setStepsTaken(n=>n+1);
    setNodeId(feedback.next??"__finished__");
    setFeedback(null);setAnswer("");setHintUsed(false);setSpeechUsed(false);
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
      <p>18 Originaleinheiten mit vier Lernschritten: verstehen, antworten, eigene Texte schreiben und gezielt wiederholen.</p>
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
        <nav className="p27-journey__steps" aria-label="Lernschritte">
          {steps.map(([id,label])=><button type="button" key={id} aria-current={stage===id?"step":undefined}
            onClick={()=>{setStage(id);setError("");}}>{label}</button>)}
        </nav>
        {stage==="learn"?<section className="p27-journey__panel">
          <div className="p27-journey__note"><strong>Situation</strong><p>{unit.situation}</p></div>
          <h4>So funktioniert das Muster</h4><p>{unit.model}</p>
          <div className="p27-journey__contrast"><div><strong>Unterscheide</strong><p>{unit.contrast}</p></div>
            <div><strong>Höflichkeit & Fehlerquelle</strong><p>{unit.register}</p></div></div>
          <h4>Wörter in Sätzen</h4>
          <div className="p27-journey__words">{unit.words.map(w=><div key={w.form+"-"+w.reading}>
            <strong lang="ja">{w.form}</strong><small lang="ja">{w.reading}</small>
            <span>{w.meaning}</span><small lang="ja">{w.example}</small></div>)}</div>
          <div className="p27-journey__actions">
            <button type="button" disabled={disabled} onClick={()=>onSourcePractice(unit.source,unit.sourceId,"core")}>Originale Grundlagen üben</button>
            <button type="button" onClick={()=>setStage("conversation")}>Weiter zum Gespräch</button>
          </div>
        </section>:null}
        {stage==="conversation"?<section className="p27-journey__panel">
          <h4>Mehrstufiger Dialog</h4>
          <div className="p27-journey__filters" role="group" aria-label="Antwortart">
            <button type="button" aria-pressed={inputMode==="compose"} onClick={()=>{setInputMode("compose");setFeedback(null);}}>Selbst formulieren</button>
            <button type="button" aria-pressed={inputMode==="choose"} onClick={()=>{setInputMode("choose");setHintUsed(true);setFeedback(null);}}>Antworten auswählen</button>
          </div>
          {nodeId!=="__finished__"&&stepsTaken<14?<div>
            <p className="p27-journey__muted">Gesprächsschritt {stepsTaken+1} · höchstens 14</p>
            <div className="p27-journey__note"><strong>Gesprächspartner</strong>
              <p className="p27-journey__japanese" lang="ja">{turn.partner}</p>
              {showTranslation?<p>{turn.meaning}</p>:null}
              <button type="button" onClick={()=>speak(turn.partner)}>Synthetisch anhören</button>
            </div>
            <label><input type="checkbox" checked={showTranslation}
              onChange={e=>setShowTranslation(e.target.checked)}/> Deutsche Hilfe anzeigen</label>
            {inputMode==="compose"?<>
              <label htmlFor="p27-reply">Deine japanische Antwort</label>
              <textarea rows={3} id="p27-reply" lang="ja" value={answer} disabled={Boolean(feedback)||busy}
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
              <ul>{feedback.notes.map((n,i)=><li key={i}>{n}</li>)}</ul>
              <div className="p27-journey__actions">
                <button type="button" onClick={()=>{setFeedback(null);setAnswer("");setSpeechUsed(false);started.current=performance.now();}}>Anders antworten</button>
                <button type="button" onClick={continueDialogue}>Fortfahren</button>
              </div>
            </div>:null}
          </div>:<div className="p27-journey__note" role="status">
            <strong>{nodeId==="__finished__"?"Gespräch abgeschlossen":"Nach wiederholten Versuchen unterbrochen"}</strong>
            <p>Auswahl oder Mustererkennung sind keine umfassende Bewertung freier Gespräche.</p>
          </div>}
          <div className="p27-journey__actions">
            <button type="button" onClick={resetDialogue}>Gespräch wiederholen</button>
            <button type="button" onClick={()=>setStage("write")}>Weiter: Schreiben</button>
          </div>
        </section>:null}
        {stage==="write"?<section className="p27-journey__panel">
          <h4>Eigene Sätze schreiben oder sprechen und überarbeiten</h4>
          <p>{unit.writing.task}</p>
          <label htmlFor="p27-draft">Erste Fassung</label>
          <textarea id="p27-draft" rows={4} lang="ja" value={draft} onChange={e=>{
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
              <strong>Orientierung zur Korrektur</strong><p>{unit.writing.reflection}</p>
              <p><span lang="ja">{unit.writing.features.join(" · ")}</span></p>
              <details><summary>Originales Beispiel vergleichen</summary><p lang="ja">{unit.writing.reference}</p></details>
            </div>
            <label htmlFor="p27-rewrite">Überarbeitete Version</label>
            <textarea id="p27-rewrite" rows={4} lang="ja" value={rewrite} onChange={e=>{
              setRewrite(e.target.value);setRewriteStage("revise");setReport(null);setSaved(false);
            }}/>
            <div className="p27-journey__actions">
              <button type="button" onClick={()=>recognize("rewrite")}>Überarbeitung diktieren</button>
              <button type="button" disabled={!rewrite.trim()} onClick={()=>{
                setReport(compareWriting(draft,rewrite,unit.writing.features));setRewriteStage("compare");
              }}>Versionen vergleichen</button>
            </div>
          </>:null}
          {rewriteStage==="compare"&&report?<div className="p27-journey__note" role="status">
            <strong>Zeichenbasierte Beobachtungen, keine Sprachbewertung</strong>
            <p>{report.oldLength} → {report.newLength} Zeichen. Geändert: {report.changed?"ja":"nein"}</p>
            <p>Erkannte Zielzeichenfolgen: {report.found.join(" · ")||"keine"}</p>
            <p>Nicht erkannt: {report.missing.join(" · ")||"keine"}</p>
            <ul>{grammarReflection(unit,rewrite).map((note,i)=><li key={i}>{note}</li>)}</ul>
            <button type="button" disabled={disabled||busy||saved} onClick={()=>void saveRevision()}>
              Unbewertete Überarbeitung protokollieren</button>
            {saved?<p>Ohne Rohtext oder Audiodatei gespeichert; kein FSRS-Erfolg.</p>:null}
          </div>:null}
          <button type="button" onClick={()=>setStage("practice")}>Weiter: Wiederholen</button>
        </section>:null}
        {stage==="practice"?<section className="p27-journey__panel">
          <h4>Kontextualisierte Wiederholung</h4>
          <p>Heute fällige Karten, letzte Fehler und neue Situationen werden aus demselben bestehenden Lernverlauf ermittelt.</p>
          <div className="p27-journey__stats">
            <div><strong>{profile?.due??0}</strong><span>fällig</span></div>
            <div><strong>{profile?.retry??0}</strong><span>zuletzt falsch</span></div>
            <div><strong>{profile?.unseen??0}</strong><span>noch nicht geübt</span></div>
          </div>
          <div className="p27-journey__actions">
            <button type="button" disabled={disabled} onClick={()=>onJourneyPractice(unitId,"review")}>Fehler und FSRS-Karten wiederholen</button>
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
