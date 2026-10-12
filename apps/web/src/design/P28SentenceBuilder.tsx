import {useEffect,useMemo,useRef,useState,type KeyboardEvent} from "react";
import {listMemoryTraces,listStudyEvents,saveStudyEvent} from "@thiepn/local-db";
import type {StudyEvent} from "@thiepn/domain";
import {DEVELOPMENT_DEVICE_ID,getDevelopmentAccountId,recordStudyAnswer} from "../study/runtime";
import {
  builtAnswer,shuffledTiles,type JourneySentencePuzzle
} from "../study/sentence28";
import {grammarReflection} from "../study/feedback27";
import {
  p29AllSentencePuzzles,sentence29Queue,acceptedSentenceOrder,sentenceVariants,orderFeedback29
} from "../study/depth29";
import {journeyUnit} from "../study/journey27";
import {transformationForUnit,inspectTransformation,p30TransformationPrompts} from "../study/pedagogy30";
import {normalizeP26} from "../study/pedagogy26";
import "./p28-sentence.css";

type Submission={status:"correct"|"unrecognized"|"assisted";feedback:string[]};
export function P28SentenceBuilder({
  unitId,owner,disabled,onReviewed,onContinue
}:{
  unitId:string;owner:string;disabled:boolean;
  onReviewed:()=>void;onContinue:()=>void;
}){
  const accountRef=useRef(owner);accountRef.current=owner;
  const [ordered,setOrdered]=useState<JourneySentencePuzzle[]>(()=>p29AllSentencePuzzles.filter(p=>p.unitId===unitId));
  const [choice,setChoice]=useState<string|undefined>(undefined);
  const [selection,setSelection]=useState<number[]>([]);
  const [assisted,setAssisted]=useState(false);
  const [submission,setSubmission]=useState<Submission|null>(null);
  const [busy,setBusy]=useState(false);
  const [loading,setLoading]=useState(true);
  const [historyError,setHistoryError]=useState("");
  const [error,setError]=useState("");
  const [sequence,setSequence]=useState(0);
  const [transformText,setTransformText]=useState("");
  const [transformAssisted,setTransformAssisted]=useState(false);
  const [transformResult,setTransformResult]=useState<{recognized:boolean;assisted:boolean;notes:string[]}|null>(null);
  const [transformBusy,setTransformBusy]=useState(false);
  const seenModels=useRef<Set<string>>(new Set());
  const started=useRef(0);
  const current=ordered.find(p=>p.id===choice)??ordered[0]??p29AllSentencePuzzles[0]!;
  const transform=transformationForUnit(unitId);
  const original=useMemo(()=>shuffledTiles(current),[current.id]);
  const remaining=original.filter(i=>!selection.includes(i));
  const answer=builtAnswer(current,selection);
  useEffect(()=>{
    let mounted=true;setLoading(true);setHistoryError("");
    void Promise.all([listMemoryTraces(owner),listStudyEvents(owner)]).then(([traces,events])=>{
      if(!mounted||accountRef.current!==owner)return;
      const queue=sentence29Queue(unitId,traces.filter(t=>t.userId===owner),events.filter(e=>e.userId===owner));
      setOrdered(queue);
      if(!choice||!queue.some(p=>p.id===choice))setChoice(queue[0]?.id);
    }).catch(()=>{if(mounted)setHistoryError("Lernverlauf nicht verfügbar. Satzbau bleibt möglich.");})
      .finally(()=>{if(mounted)setLoading(false);});
    return()=>{mounted=false;};
  },[owner,unitId,sequence]);
  useEffect(()=>{
    setChoice(undefined);setSelection([]);setAssisted(false);setSubmission(null);
    setError("");seenModels.current.clear();setTransformText("");setTransformAssisted(false);
    setTransformResult(null);started.current=performance.now();
  },[unitId,owner]);
  function selectPuzzle(id:string){
    if(busy)return;
    setChoice(id);setSelection([]);setAssisted(seenModels.current.has(id));setSubmission(null);setError("");
    started.current=performance.now();
  }
  function removeTile(position:number){
    if(submission||busy)return;
    setSelection(list=>list.filter((_,index)=>index!==position));
  }
  async function saveUngraded(text:string,reason:"hint"|"unrecognized"){
    if(getDevelopmentAccountId()!==owner)throw new Error("P28_WORKSPACE_CHANGED");
    const event:StudyEvent={
      id:crypto.randomUUID(),userId:owner,deviceId:DEVELOPMENT_DEVICE_ID,
      occurredAt:new Date().toISOString(),activity:"writing",
      primaryTarget:{kind:"production_task",id:"p28:guided-sentence:"+current.id},
      skillDimension:"production",promptFamily:"p28-sentence-assistance",
      responseMode:"typed",result:"skipped",attempts:1,
      contextId:"p28:unit:"+unitId,sourceId:"thiepn-original",contentVersion:"p28-1",
      metadata:{
        p28:true,kind:"guided-sentence",puzzleId:current.id,unitId,assisted:reason==="hint",reason,
        schedulerExcluded:true,textStored:false,length:[...text].length
      }
    };
    await saveStudyEvent(event);
  }
  async function submit(){
    if(disabled||busy||submission||selection.length!==current.tiles.length)return;
    const account=accountRef.current;
    if(getDevelopmentAccountId()!==account)return;
    const recognized=acceptedSentenceOrder(current,answer);
    setBusy(true);setError("");
    try{
      if(assisted||!recognized)await saveUngraded(answer,assisted?"hint":"unrecognized");
      else await recordStudyAnswer({
        prompt:current.prompt,response:answer,result:"correct",
        responseTimeMs:Math.max(0,Math.round(performance.now()-started.current))
      });
      if(accountRef.current!==account)return;
      seenModels.current.add(current.id);
      setSubmission({
        status:assisted?"assisted":recognized?"correct":"unrecognized",
        feedback:orderFeedback29(current,answer,selection)
      });
      setSequence(n=>n+1);onReviewed();
    }catch{
      if(accountRef.current===account)setError("Satzversuch konnte nicht gespeichert werden. Bitte erneut versuchen.");
    }finally{if(accountRef.current===account)setBusy(false);}
  }
  function undo(){if(!submission&&!busy)setSelection(list=>list.slice(0,-1));}
  function onTilesKeyboard(event:KeyboardEvent<HTMLElement>){
    if(disabled||busy||submission||event.altKey||event.ctrlKey||event.metaKey)return;
    const target=event.target as HTMLElement;
    if(target.tagName==="INPUT"||target.tagName==="TEXTAREA"||target.isContentEditable)return;
    if(/^[1-9]$/.test(event.key)){
      const number=Number(event.key)-1;
      const available=shuffledTiles(current).filter(i=>!selection.includes(i));
      if(available[number]!==undefined){
        event.preventDefault();
        setSelection(previous=>[...previous,available[number]!]);
      }
    }else if(event.key==="Backspace"&&selection.length){
      event.preventDefault();undo();
    }else if(event.key==="Escape"&&selection.length){
      event.preventDefault();setSelection([]);
    }
  }
  async function submitTransformation(){
    if(!transform||!transformText.trim()||transformResult||transformBusy||disabled)return;
    const account=accountRef.current;
    if(getDevelopmentAccountId()!==account)return;
    const prompt=p30TransformationPrompts.find(p=>p.eventMetadata?.taskId===transform.id);
    if(!prompt)return;
    const observation=inspectTransformation(transform,transformText);
    const independentlyRecognized=observation.known&&!transformAssisted;
    setTransformBusy(true);setError("");
    try{
      if(independentlyRecognized){
        await recordStudyAnswer({prompt,response:normalizeP26(transformText),result:"correct",
          responseTimeMs:Math.max(0,Math.round(performance.now()-started.current))});
      }else{
        const event:StudyEvent={
          id:crypto.randomUUID(),userId:account,deviceId:DEVELOPMENT_DEVICE_ID,
          occurredAt:new Date().toISOString(),activity:"writing",
          primaryTarget:{kind:"production_task",id:"p30:reformulation:"+transform.id},
          skillDimension:"production",promptFamily:"p30-guided-reformulation",
          responseMode:"typed",result:"skipped",attempts:1,
          contextId:"p30:unit:"+unitId,sourceId:"thiepn-original",contentVersion:"p30-1",
          metadata:{p30:true,kind:"reformulation",taskId:transform.id,unitId,
            schedulerExcluded:true,rawTextStored:false,assisted:transformAssisted,
            characters:[...normalizeP26(transformText)].length}
        };
        await saveStudyEvent(event);
      }
      if(accountRef.current!==account)return;
      setTransformAssisted(true); // The model becomes visible after checking.
      setTransformResult({recognized:observation.known,assisted:!independentlyRecognized,
        notes:observation.remarks});onReviewed();
    }catch{
      if(accountRef.current===account)setError("Umformulierung konnte nicht gespeichert werden. Bitte erneut versuchen.");
    }finally{if(accountRef.current===account)setTransformBusy(false);}
  }
  function next(){
    const i=ordered.findIndex(p=>p.id===current.id);
    selectPuzzle(ordered[(i+1)%ordered.length]?.id??current.id);
  }
  return <section className="p28-builder" aria-labelledby="p28-builder-heading"
    tabIndex={0} onKeyDown={onTilesKeyboard}
    aria-describedby="p32-keyboard-help">
    <h4 id="p28-builder-heading">Japanische Sätze selbst zusammensetzen</h4>
    <p id="p32-keyboard-help" className="p28-builder__keyboard-help">
      Tastatur: Bereich fokussieren, 1–9 für die angezeigten verfügbaren Teile,
      Rücktaste zum Entfernen des letzten Teils, Escape zum Leeren. Alle Bausteine sind auch anklickbar.
    </p>
    <p>Baue einen vollständigen Satz. Mehrere natürlich passende Wortstellungen werden bei ausgewählten Aufgaben ausdrücklich akzeptiert.</p>
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
      {remaining.map((index,i)=><button type="button" key={index} lang="ja"
        aria-keyshortcuts={i<9?String(i+1):undefined}
        aria-label={"Baustein "+(i+1)+": "+current.tiles[index]}
        disabled={busy||Boolean(submission)}
        onClick={()=>setSelection(s=>[...s,index])}>{current.tiles[index]}</button>)}
      {!remaining.length?<span>Alle Teile verwendet.</span>:null}
    </div>
    <div className="p28-builder__actions">
      <button type="button" disabled={busy||Boolean(submission)||!selection.length} onClick={undo}>Letzten Schritt zurück</button>
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
      <strong>{submission.status==="correct"?"Zulässige Zielreihenfolge erkannt":
        submission.status==="unrecognized"?"Weitere Wortstellung · unbewertet":"Mit Hinweis bearbeitet · unbewertet"}</strong>
      <p lang="ja">Ziel: {current.answer}</p>
      {sentenceVariants(current).length>1?<details>
        <summary>Weitere ausdrücklich akzeptierte Formulierungen</summary>
        <ul>{sentenceVariants(current).slice(1).map((variant,i)=><li key={i}>
          <span lang="ja">{variant.answer}</span> — {variant.note}</li>)}</ul>
      </details>:null}
      <ul>{submission.feedback.concat(grammarReflection(journeyUnit(unitId),answer)).map((note,i)=><li key={i}>{note}</li>)}</ul>
      <p>Nur ausdrücklich hinterlegte Alternativen zählen als Treffer. Andere Wortstellungen können dennoch korrekt sein und werden deshalb unbewertet statt automatisch als Fehler gespeichert.</p>
      <div className="p28-builder__actions">
        <button type="button" onClick={()=>selectPuzzle(current.id)}>Erneut bauen</button>
        <button type="button" onClick={next}>Nächster Satz</button>
        <button type="button" onClick={onContinue}>Weiter zum Gespräch</button>
      </div>
    </div>:null}
    {transform?<div className="p28-builder__transform" aria-label="Satz im Kontext umformen">
      <h4>Eigene Umformulierung</h4>
      <p><strong>Kommunikative Aufgabe:</strong> {transform.context}</p>
      <p><strong>Ausgangssatz:</strong> <span lang="ja">{transform.startingSentence}</span></p>
      <label htmlFor="p30-transform-input">Formuliere selbst einen passenden japanischen Satz</label>
      <textarea id="p30-transform-input" lang="ja" rows={3} value={transformText}
        disabled={transformBusy||Boolean(transformResult)} onChange={e=>setTransformText(e.target.value)}/>
      <div className="p28-builder__actions">
        <button type="button" disabled={transformBusy||Boolean(transformResult)} onClick={()=>setTransformAssisted(true)}>
          Grammatikhilfe ansehen (danach unbewertet)</button>
        <button type="button" disabled={transformBusy||disabled||Boolean(transformResult)||!transformText.trim()}
          onClick={()=>void submitTransformation()}>Formulierung vergleichen</button>
      </div>
      {transformAssisted&&!transformResult?<p role="status">{transform.explanation}</p>:null}
      {transformResult?<div className="p28-builder__result" role="status">
        <strong>{transformResult.recognized
          ?transformResult.assisted?"Passendes Muster – unterstützt, unbewertet":"Zielform unabhängig getroffen"
          :"Freie Alternative – nicht automatisch beurteilbar"}</strong>
        <p>Beispiel: <span lang="ja">{transform.model}</span></p>
        <ul>{transformResult.notes.map((note,i)=><li key={i}>{note}</li>)}</ul>
        <button type="button" onClick={()=>{
          setTransformResult(null);setTransformAssisted(true);started.current=performance.now();
        }}>Antwort mit Hilfe überarbeiten</button>
      </div>:null}
    </div>:null}
    {error?<p role="alert">{error}</p>:null}
  </section>;
}
