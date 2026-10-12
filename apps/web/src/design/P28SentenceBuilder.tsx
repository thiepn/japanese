import {useEffect,useMemo,useRef,useState} from "react";
import {listMemoryTraces,listStudyEvents,saveStudyEvent} from "@thiepn/local-db";
import {gradeStudyPrompt} from "@thiepn/study-player";
import type {StudyEvent} from "@thiepn/domain";
import {DEVELOPMENT_DEVICE_ID,getDevelopmentAccountId,recordStudyAnswer} from "../study/runtime";
import {
  builtAnswer,journeySentencePuzzles,sentencePuzzlesForUnit,sentenceQueue,shuffledTiles,
  wordOrderFeedback,type JourneySentencePuzzle
} from "../study/sentence28";
import {grammarReflection} from "../study/feedback27";
import {journeyUnit} from "../study/journey27";
import "./p28-sentence.css";

type Submission={status:"correct"|"incorrect"|"assisted";feedback:string[]};
export function P28SentenceBuilder({
  unitId,owner,disabled,onReviewed,onContinue
}:{
  unitId:string;owner:string;disabled:boolean;
  onReviewed:()=>void;onContinue:()=>void;
}){
  const accountRef=useRef(owner);accountRef.current=owner;
  const [ordered,setOrdered]=useState<JourneySentencePuzzle[]>(()=>sentencePuzzlesForUnit(unitId));
  const [choice,setChoice]=useState<string|undefined>(undefined);
  const [selection,setSelection]=useState<number[]>([]);
  const [assisted,setAssisted]=useState(false);
  const [submission,setSubmission]=useState<Submission|null>(null);
  const [busy,setBusy]=useState(false);
  const [loading,setLoading]=useState(true);
  const [historyError,setHistoryError]=useState("");
  const [error,setError]=useState("");
  const [sequence,setSequence]=useState(0);
  const started=useRef(0);
  const current=ordered.find(p=>p.id===choice)??ordered[0]??journeySentencePuzzles[0]!;
  const original=useMemo(()=>shuffledTiles(current),[current.id]);
  const remaining=original.filter(i=>!selection.includes(i));
  const answer=builtAnswer(current,selection);
  useEffect(()=>{
    let mounted=true;setLoading(true);setHistoryError("");
    void Promise.all([listMemoryTraces(owner),listStudyEvents(owner)]).then(([traces,events])=>{
      if(!mounted||accountRef.current!==owner)return;
      const queue=sentenceQueue(unitId,traces.filter(t=>t.userId===owner),events.filter(e=>e.userId===owner));
      setOrdered(queue);
      if(!choice||!queue.some(p=>p.id===choice))setChoice(queue[0]?.id);
    }).catch(()=>{if(mounted)setHistoryError("Lernverlauf nicht verfügbar. Satzbau bleibt möglich.");})
      .finally(()=>{if(mounted)setLoading(false);});
    return()=>{mounted=false;};
  },[owner,unitId,sequence]);
  useEffect(()=>{
    setChoice(undefined);setSelection([]);setAssisted(false);setSubmission(null);
    setError("");started.current=performance.now();
  },[unitId,owner]);
  function selectPuzzle(id:string){
    if(busy)return;
    setChoice(id);setSelection([]);setAssisted(false);setSubmission(null);setError("");
    started.current=performance.now();
  }
  function removeTile(position:number){
    if(submission||busy)return;
    setSelection(list=>list.filter((_,index)=>index!==position));
  }
  async function saveAssisted(text:string){
    if(getDevelopmentAccountId()!==owner)throw new Error("P28_WORKSPACE_CHANGED");
    const event:StudyEvent={
      id:crypto.randomUUID(),userId:owner,deviceId:DEVELOPMENT_DEVICE_ID,
      occurredAt:new Date().toISOString(),activity:"writing",
      primaryTarget:{kind:"production_task",id:"p28:guided-sentence:"+current.id},
      skillDimension:"production",promptFamily:"p28-sentence-assistance",
      responseMode:"typed",result:"skipped",attempts:1,
      contextId:"p28:unit:"+unitId,sourceId:"thiepn-original",contentVersion:"p28-1",
      metadata:{
        p28:true,kind:"guided-sentence",puzzleId:current.id,unitId,assisted:true,
        schedulerExcluded:true,textStored:false,length:[...text].length
      }
    };
    await saveStudyEvent(event);
  }
  async function submit(){
    if(disabled||busy||submission||selection.length!==current.tiles.length)return;
    const account=accountRef.current;
    if(getDevelopmentAccountId()!==account)return;
    const grade=gradeStudyPrompt(current.prompt,answer);
    setBusy(true);setError("");
    try{
      if(assisted)await saveAssisted(answer);
      else await recordStudyAnswer({
        prompt:current.prompt,response:answer,result:grade.result,
        responseTimeMs:Math.max(0,Math.round(performance.now()-started.current))
      });
      if(accountRef.current!==account)return;
      setSubmission({
        status:assisted?"assisted":grade.result,
        feedback:wordOrderFeedback(current,selection)
      });
      setSequence(n=>n+1);onReviewed();
    }catch{
      if(accountRef.current===account)setError("Satzversuch konnte nicht gespeichert werden. Bitte erneut versuchen.");
    }finally{if(accountRef.current===account)setBusy(false);}
  }
  function next(){
    const i=ordered.findIndex(p=>p.id===current.id);
    selectPuzzle(ordered[(i+1)%ordered.length]?.id??current.id);
  }
  return <section className="p28-builder" aria-labelledby="p28-builder-heading">
    <h4 id="p28-builder-heading">Japanische Sätze selbst zusammensetzen</h4>
    <p>Wähle die passenden Satzteile in der geübten Reihenfolge. Mit jedem Klick baust du einen vollständigen Satz.</p>
    <div className="p28-builder__selector" role="group" aria-label="Satzaufgabe auswählen">
      {ordered.map((p,i)=><button key={p.id} type="button" aria-pressed={p.id===current.id}
        disabled={busy} onClick={()=>selectPuzzle(p.id)}>Satz {i+1}</button>)}
    </div>
    {loading?<p role="status">Passende Übungen werden ermittelt …</p>:null}
    {historyError?<p role="status">{historyError}</p>:null}
    <div className="p28-builder__cue">
      <small>Situation</small><p>{current.context}</p>
      <strong>Aufgabe</strong><p>{current.meaning}</p>
    </div>
    <p><strong>Dein Satz</strong></p>
    <div className="p28-builder__assembly" role="group" aria-label="Gebildeter japanischer Satz">
      {selection.length?selection.map((originalIndex,pos)=><button type="button"
        key={originalIndex} disabled={busy||Boolean(submission)} lang="ja"
        aria-label={"Satzteil "+(pos+1)+": "+current.tiles[originalIndex]+" entfernen"}
        onClick={()=>removeTile(pos)}>{current.tiles[originalIndex]}</button>)
        :<span>Satzteile unten in der passenden Reihenfolge auswählen.</span>}
    </div>
    <p><strong>Verfügbare Teile</strong></p>
    <div className="p28-builder__available" role="group" aria-label="Verfügbare Wortbausteine">
      {remaining.map(index=><button type="button" key={index} lang="ja"
        disabled={busy||Boolean(submission)}
        onClick={()=>setSelection(s=>[...s,index])}>{current.tiles[index]}</button>)}
      {!remaining.length?<span>Alle Teile verwendet.</span>:null}
    </div>
    <div className="p28-builder__actions">
      <button type="button" disabled={busy||Boolean(submission)||!selection.length} onClick={()=>setSelection([])}>Zurücksetzen</button>
      <button type="button" disabled={busy||Boolean(submission)} onClick={()=>setAssisted(true)}>
        {assisted?"Mit Hilfe (unbewerteter Versuch)":"Grammatiktipp anzeigen"}
      </button>
      <button type="button" disabled={disabled||busy||Boolean(submission)||selection.length!==current.tiles.length}
        onClick={()=>void submit()}>Satz überprüfen</button>
    </div>
    {assisted&&!submission?<div role="status" className="p28-builder__help">
      <strong>Hinweis</strong><p>{current.explanation}</p>
      <p>Mit aufgerufener Hilfe zählt der Satz als unbewertete Übung, nicht als FSRS-Leistungsnachweis.</p>
    </div>:null}
    {submission?<div className="p28-builder__result" role="status">
      <strong>{submission.status==="correct"?"Zielreihenfolge erkannt":
        submission.status==="incorrect"?"Zielreihenfolge weicht ab":"Mit Hilfe bearbeitet · unbewertet"}</strong>
      <p lang="ja">Ziel: {current.answer}</p>
      <ul>{submission.feedback.concat(grammarReflection(journeyUnit(unitId),answer)).map((note,i)=><li key={i}>{note}</li>)}</ul>
      <p>Die Prüfung vergleicht die authored Zielreihenfolge; alternative korrekte Satzstellungen werden nicht vollständig erkannt.</p>
      <div className="p28-builder__actions">
        <button type="button" onClick={()=>selectPuzzle(current.id)}>Erneut bauen</button>
        <button type="button" onClick={next}>Nächster Satz</button>
        <button type="button" onClick={onContinue}>Weiter zum Gespräch</button>
      </div>
    </div>:null}
    {error?<p role="alert">{error}</p>:null}
  </section>;
}
