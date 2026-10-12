import {useEffect,useMemo,useRef,useState} from "react";
import {listMemoryTraces,listStudyEvents,saveStudyEvent} from "@thiepn/local-db";
import {gradeStudyPrompt} from "@thiepn/study-player";
import type {StudyEvent} from "@thiepn/domain";
import {DEVELOPMENT_DEVICE_ID,getDevelopmentAccountId,recordStudyAnswer} from "../study/runtime";
import {
  conversationForScenario,dialoguePrompt,grammarTransferPrompts,
  inspectProduction,productionTasks,recommendPractice,sentencePuzzlePrompt,sentencePuzzles,
  type GuidedChoice,type PracticeMode,type PracticeRecommendation,type ProductionChecklist
} from "../study/pedagogy24";
import "./p24-guided-lab.css";

type View="conversation"|"construction"|"production";
type ProductionMode="writing"|"speaking";
interface SpeechRecognizer {
  lang:string;interimResults:boolean;continuous:boolean;
  onresult:((event:{results:ArrayLike<ArrayLike<{transcript:string}>>})=>void)|null;
  onerror:(()=>void)|null;onend:(()=>void)|null;
  start:()=>void;stop:()=>void;
}
const EMPTY_RECOMMENDATION:PracticeRecommendation={track:"sentence",due:0,incorrect:0,unseen:0,reason:"Noch nicht geübt"};
function mixedOrder(tokens:readonly string[],seed:string):number[]{
  const result=tokens.map((_,index)=>index);
  let state=[...seed].reduce((hash,char)=>(Math.imul(hash,33)+char.charCodeAt(0))>>>0,2166136261);
  for(let i=result.length-1;i>0;i--){
    state=(Math.imul(state,1664525)+1013904223)>>>0;
    const j=state%(i+1);
    [result[i],result[j]]=[result[j]!,result[i]!];
  }
  if(result.length>1&&result.every((item,index)=>item===index))result.reverse();
  return result;
}
export function P24GuidedLab({
  scenarioId,onPractice,disabled
}:{
  scenarioId:string;onPractice:(id:string,mode:PracticeMode)=>void;disabled:boolean
}){
  const owner=getDevelopmentAccountId();
  const ownerRef=useRef(owner);ownerRef.current=owner;
  const [view,setView]=useState<View>("conversation");
  const [turnId,setTurnId]=useState("start");
  const [visited,setVisited]=useState(0);
  const [dialogueDone,setDialogueDone]=useState(false);
  const [dialogueCapped,setDialogueCapped]=useState(false);
  const [answer,setAnswer]=useState<GuidedChoice|null>(null);
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState("");
  const [showGerman,setShowGerman]=useState(false);
  const [puzzleIndex,setPuzzleIndex]=useState(0);
  const [selectedTiles,setSelectedTiles]=useState<number[]>([]);
  const [puzzleFeedback,setPuzzleFeedback]=useState<"correct"|"incorrect"|null>(null);
  const [productionMode,setProductionMode]=useState<ProductionMode>("writing");
  const [draft,setDraft]=useState("");
  const [checklist,setChecklist]=useState<ProductionChecklist|null>(null);
  const [productionSaved,setProductionSaved]=useState(false);
  const [speechStatus,setSpeechStatus]=useState("Mikrofon optional; alternativ kannst du den Text eingeben.");
  const recognizerRef=useRef<SpeechRecognizer|null>(null);
  const [revision,setRevision]=useState(0);
  const [recommendation,setRecommendation]=useState<PracticeRecommendation>(EMPTY_RECOMMENDATION);
  const [historyError,setHistoryError]=useState("");
  const conversation=conversationForScenario(scenarioId)!;
  const puzzles=sentencePuzzles.filter(p=>p.scenarioId===scenarioId);
  const puzzle=puzzles[puzzleIndex]??puzzles[0]!;
  const production=productionTasks.find(p=>p.scenarioId===scenarioId)!;
  const turn=conversation.turns.find(t=>t.id===turnId)??conversation.turns[0]!;
  const shuffle=useMemo(()=>mixedOrder(puzzle.tokens,puzzle.id),[puzzle]);
  const sentence=selectedTiles.map(index=>puzzle.tokens[index]).join("");
  const instruction=productionMode==="writing"?production.writingPrompt:production.speakingPrompt;
  const elapsedRef=useRef(0);
  useEffect(()=>{
    recognizerRef.current?.stop();
    recognizerRef.current=null;
    setTurnId("start");setVisited(0);setDialogueDone(false);setDialogueCapped(false);setAnswer(null);
    elapsedRef.current=performance.now();
    setSaving(false);setError("");setPuzzleIndex(0);setSelectedTiles([]);
    setPuzzleFeedback(null);setDraft("");setChecklist(null);setProductionSaved(false);
    setView("conversation");
  },[scenarioId,owner]);
  useEffect(()=>()=>recognizerRef.current?.stop(),[]);
  useEffect(()=>{
    let active=true;
    setHistoryError("");
    void Promise.all([listStudyEvents(owner),listMemoryTraces(owner)]).then(([events,traces])=>{
      if(active&&ownerRef.current===owner)
        setRecommendation(recommendPractice(scenarioId,traces.filter(x=>x.userId===owner),events.filter(x=>x.userId===owner)));
    }).catch(()=>{
      if(active)setHistoryError("Lernverlauf konnte nicht geladen werden; direkte Übungen bleiben verfügbar.");
    });
    return()=>{active=false;};
  },[owner,scenarioId,revision]);
  function resetConversation(){
    setTurnId("start");setVisited(0);setDialogueDone(false);setDialogueCapped(false);setAnswer(null);setError("");
    elapsedRef.current=performance.now();
  }
  async function chooseReply(choice:GuidedChoice){
    if(saving||answer||dialogueDone||disabled)return;
    const requestedOwner=ownerRef.current;
    const prompt=dialoguePrompt(scenarioId,turn);
    const grade=gradeStudyPrompt(prompt,choice.japanese);
    setSaving(true);setError("");
    try{
      await recordStudyAnswer({
        prompt,response:choice.japanese,result:grade.result,
        responseTimeMs:Math.max(0,Math.round(performance.now()-elapsedRef.current))
      });
      if(ownerRef.current!==requestedOwner)return;
      setAnswer(choice);setRevision(n=>n+1);
    }catch{
      if(ownerRef.current===requestedOwner)setError("Antwort konnte nicht lokal gespeichert werden. Bitte erneut versuchen.");
    }finally{if(ownerRef.current===requestedOwner)setSaving(false);}
  }
  function continueConversation(){
    if(!answer)return;
    const next=answer.next;
    const turnsTaken=visited+1;
    setVisited(turnsTaken);setAnswer(null);setError("");
    if(next===null||turnsTaken>=14){setDialogueCapped(next!==null);setDialogueDone(true);return;}
    setTurnId(next);elapsedRef.current=performance.now();
  }
  function newPuzzle(index:number){
    setPuzzleIndex(index);setSelectedTiles([]);setPuzzleFeedback(null);setError("");elapsedRef.current=performance.now();
  }
  async function checkSentence(){
    if(saving||puzzleFeedback||selectedTiles.length!==puzzle.tokens.length||disabled)return;
    const requestedOwner=ownerRef.current;
    const prompt=sentencePuzzlePrompt(puzzle);
    const grade=gradeStudyPrompt(prompt,sentence);
    setSaving(true);setError("");
    try{
      await recordStudyAnswer({prompt,response:sentence,result:grade.result,
        responseTimeMs:Math.max(0,Math.round(performance.now()-elapsedRef.current))});
      if(ownerRef.current!==requestedOwner)return;
      setPuzzleFeedback(grade.result);setRevision(n=>n+1);
    }catch{
      if(ownerRef.current===requestedOwner)setError("Satzversuch konnte nicht gespeichert werden.");
    }finally{if(ownerRef.current===requestedOwner)setSaving(false);}
  }
  function showChecklist(){
    if(!draft.trim())return;
    setChecklist(inspectProduction(draft,production));
    setProductionSaved(false);
  }
  function beginSpeech(){
    const capture=window as typeof window & {
      SpeechRecognition?:new()=>SpeechRecognizer;
      webkitSpeechRecognition?:new()=>SpeechRecognizer;
    };
    const Recognition=capture.SpeechRecognition??capture.webkitSpeechRecognition;
    if(!Recognition){setSpeechStatus("Spracherkennung ist in diesem Browser nicht verfügbar. Antwort eintippen.");return;}
    recognizerRef.current?.stop();
    const recognizer=new Recognition();
    recognizerRef.current=recognizer;recognizer.lang="ja-JP";
    recognizer.interimResults=false;recognizer.continuous=false;
    recognizer.onresult=(event)=>{
      const transcript=event.results[0]?.[0]?.transcript?.trim()??"";
      if(transcript){setDraft(transcript);setChecklist(null);setProductionSaved(false);}
    };
    recognizer.onerror=()=>setSpeechStatus("Spracherkennung fehlgeschlagen. Antwort eintippen.");
    recognizer.onend=()=>setSpeechStatus(s=>s.startsWith("Spracherkennung fehl")?s:"Aufnahme beendet. Transkript prüfen oder selbst eingeben.");
    try{recognizer.start();setSpeechStatus("Zuhören …");}
    catch{setSpeechStatus("Mikrofon konnte nicht gestartet werden. Antwort eintippen.");}
  }
  async function savePractice(){
    if(saving||disabled||!checklist||productionSaved)return;
    const requestedOwner=ownerRef.current;
    if(getDevelopmentAccountId()!==requestedOwner)return;
    const event:StudyEvent={
      id:crypto.randomUUID(),userId:requestedOwner,deviceId:DEVELOPMENT_DEVICE_ID,
      occurredAt:new Date().toISOString(),activity:productionMode==="writing"?"writing":"speaking",
      primaryTarget:{kind:"production_task",id:"p24:"+scenarioId+":"+productionMode},
      skillDimension:productionMode==="writing"?"writing_quality":"production",
      promptFamily:"p24-self-review",responseMode:productionMode==="writing"?"textarea":"transcript",
      result:"skipped",attempts:1,contextId:"p24:production:"+scenarioId,
      sourceId:"thiepn-original",contentVersion:"p24-1",
      metadata:{
        p24:true,scenarioId,mode:productionMode,checklistOnly:true,
        automatedLanguageScore:false,schedulerExcluded:true,textStored:false,
        observedLength:checklist.length,
        observedFeatures:checklist.features.filter(feature=>feature.present).map(feature=>feature.text),
        requestedFeatures:production.features,
        microphoneTranscriptNotStored:true
      }
    };
    setSaving(true);setError("");
    try{
      await saveStudyEvent(event);
      if(ownerRef.current===requestedOwner){setProductionSaved(true);setRevision(n=>n+1);}
    }catch{
      if(ownerRef.current===requestedOwner)setError("Unbewerteter Übungsversuch konnte nicht gespeichert werden.");
    }finally{if(ownerRef.current===requestedOwner)setSaving(false);}
  }
  function resetProduction(mode:ProductionMode){
    recognizerRef.current?.stop();setProductionMode(mode);setDraft("");setChecklist(null);
    setProductionSaved(false);setError("");
  }
  return <section className="p24-lab" aria-labelledby="p24-lab-heading">
    <header>
      <p className="j4-kicker">ACTIVE PRACTICE · P24</p>
      <h3 id="p24-lab-heading">In der Situation handeln</h3>
      <p>Antworte im Dialog, baue Sätze aus einzelnen Teilen und übe freie Sprachproduktion.</p>
    </header>
    {historyError?<p role="status">{historyError}</p>:null}
    <div className="p24-lab__recommend" role="status">
      <strong>Gezielter nächster Schritt: {recommendation.track==="dialogue"?"Gespräch":recommendation.track==="sentence"?"Satzbau":"Grammatiktransfer"}</strong>
      <span>{recommendation.reason}{recommendation.due?" · "+recommendation.due+" fällig":""}</span>
      <button type="button" disabled={disabled} onClick={()=>{
        if(recommendation.track==="transfer")onPractice(scenarioId,"repair");
        else{setView(recommendation.track==="dialogue"?"conversation":"construction");if(recommendation.track==="dialogue")resetConversation();else newPuzzle(0);}
      }}>Empfehlung öffnen</button>
    </div>
    <nav aria-label="Übungsart" className="p24-lab__tabs">
      {([["conversation","Gespräch"],["construction","Satzbau"],["production","Schreiben & Sprechen"]] as const).map(([key,title])=>
        <button key={key} type="button" aria-pressed={view===key} onClick={()=>{setView(key);setError("");elapsedRef.current=performance.now();}}>{title}</button>
      )}
    </nav>
    {view==="conversation"?<div className="p24-lab__content">
      <h4>{conversation.title}</h4><p>{conversation.intro}</p>
      {dialogueDone?<div role="status">
        <strong>{dialogueCapped?"Gespräch unterbrochen":"Gespräch beendet"}</strong>
        <p>{visited} beantwortete Gesprächsschritte. {dialogueCapped?"Nach zu vielen Reparaturversuchen wurde die Schleife beendet. Wiederhole die Situation gezielt.":"Richtige Auswahl bedeutet nicht automatisch freies Sprechen."}</p>
        <button type="button" onClick={resetConversation}>Erneut sprechen</button>
      </div>:<>
        <p className="p24-lab__step">Gesprächsschritt {visited+1} · {turn.situation}</p>
        <div className="p24-lab__bubble"><strong>{turn.speaker}</strong><p lang="ja">{turn.japanese}</p>
          {showGerman?<small>{turn.german}</small>:null}
          <button type="button" onClick={()=>speakJapanese(turn.japanese)}>Synthetisch anhören</button>
        </div>
        <label className="p24-lab__toggle"><input type="checkbox" checked={showGerman} onChange={e=>setShowGerman(e.target.checked)}/> Deutsche Hilfe anzeigen</label>
        <fieldset disabled={saving||disabled||Boolean(answer)}><legend>Wie antwortest du?</legend>
          <div className="p24-lab__choices">{turn.choices.map(choice=><button key={choice.japanese} type="button" onClick={()=>void chooseReply(choice)}>
            <span lang="ja">{choice.japanese}</span>{showGerman?<small>{choice.german}</small>:null}
          </button>)}</div>
        </fieldset>
        {answer?<div className="p24-lab__response" role="status">
          <strong>{answer.appropriate?"Passende Antwort":"Missverständnis — Gespräch reparieren"}</strong>
          <p>{answer.explanation}</p><p>{answer.next==="repair"||answer.next==="repair-second"?"Dein Gegenüber bittet gleich um eine neue Antwort.":""}</p>
          <button type="button" onClick={continueConversation}>{answer.next===null?"Gespräch abschließen":"Gespräch fortsetzen"}</button>
        </div>:null}
      </>}
      <button type="button" onClick={resetConversation} disabled={saving}>Neu starten</button>
    </div>:null}
    {view==="construction"?<div className="p24-lab__content">
      <h4>Baue den passenden japanischen Satz</h4>
      <div className="p24-lab__puzzles" role="group" aria-label="Satz auswählen">
        {puzzles.map((p,index)=><button key={p.id} type="button" aria-pressed={puzzle.id===p.id} onClick={()=>newPuzzle(index)}>Satz {index+1}</button>)}
      </div>
      <p><strong>Situation:</strong> {puzzle.situation}</p><p><strong>Bedeutung:</strong> {puzzle.meaning}</p>
      <div className="p24-lab__sentence" aria-label="Gebildeter Satz" lang="ja">
        {selectedTiles.length?selectedTiles.map((originalIndex,position)=><button key={originalIndex} type="button" disabled={Boolean(puzzleFeedback)||saving}
            onClick={()=>setSelectedTiles(previous=>previous.filter((_,i)=>i!==position))}>{puzzle.tokens[originalIndex]}</button>)
          :<span>Tippe die Satzteile in der richtigen Reihenfolge an.</span>}
      </div>
      <div className="p24-lab__tiles" role="group" aria-label="Verfügbare Satzteile">
        {shuffle.filter(originalIndex=>!selectedTiles.includes(originalIndex)).map(originalIndex=><button
          key={originalIndex} type="button" disabled={Boolean(puzzleFeedback)||saving} lang="ja"
          onClick={()=>setSelectedTiles(previous=>[...previous,originalIndex])}>{puzzle.tokens[originalIndex]}</button>)}
      </div>
      <div className="p24-lab__actions">
        <button type="button" disabled={saving||Boolean(puzzleFeedback)||!selectedTiles.length} onClick={()=>setSelectedTiles([])}>Zurücksetzen</button>
        <button type="button" disabled={disabled||saving||Boolean(puzzleFeedback)||selectedTiles.length!==puzzle.tokens.length} onClick={()=>void checkSentence()}>Satz prüfen und speichern</button>
      </div>
      {puzzleFeedback?<div role="status" className="p24-lab__response">
        <strong>{puzzleFeedback==="correct"?"Zielwortfolge getroffen":"Reihenfolge stimmt noch nicht"}</strong>
        <p lang="ja">Modell: {puzzle.answer}</p><p>{puzzle.explanation}</p>
        <button type="button" onClick={()=>newPuzzle((puzzleIndex+1)%puzzles.length)}>Nächsten Satz üben</button>
      </div>:null}
      <div className="p24-lab__actions">
        <button type="button" disabled={disabled} onClick={()=>onPractice(scenarioId,"full")}>Satzbau + {grammarTransferPrompts.filter(p=>p.eventMetadata?.scenarioId===scenarioId).length} Grammatik-Transfers im StudyPlayer</button>
        <button type="button" disabled={disabled} onClick={()=>onPractice(scenarioId,"repair")}>Gezielt Fehler üben</button>
      </div>
    </div>:null}
    {view==="production"?<div className="p24-lab__content">
      <h4>Eigene japanische Antwort</h4>
      <div className="p24-lab__puzzles" role="group" aria-label="Produktionsmodus">
        <button type="button" aria-pressed={productionMode==="writing"} onClick={()=>resetProduction("writing")}>Schreiben</button>
        <button type="button" aria-pressed={productionMode==="speaking"} onClick={()=>resetProduction("speaking")}>Sprechen</button>
      </div>
      <p><strong>Aufgabe:</strong> {instruction}</p>
      <label htmlFor="p24-response-text">Deine japanische Antwort</label>
      <textarea id="p24-response-text" rows={4} lang="ja" value={draft}
        onChange={e=>{setDraft(e.target.value);setChecklist(null);setProductionSaved(false);}}
        placeholder="日本語で書いてください…" />
      {productionMode==="speaking"?<div>
        <button type="button" onClick={beginSpeech}>Japanisch diktieren</button>
        <p role="status">{speechStatus}</p>
        <small>Bei verfügbarer Browser-Spracherkennung. Das Transkript bleibt hier bearbeitbar; keine Tonaufnahme wird in der App gespeichert.</small>
      </div>:null}
      <div className="p24-lab__actions">
        <button type="button" disabled={!draft.trim()||saving} onClick={showChecklist}>Strukturhinweise anzeigen</button>
        <button type="button" disabled={!checklist||saving||productionSaved} onClick={()=>void savePractice()}>Unbewerteten Versuch speichern</button>
      </div>
      {checklist?<div className="p24-lab__checklist" role="status">
        <h5>Transparente Strukturbeobachtung — keine Sprachbewertung</h5>
        <p>Zeichen: {checklist.length} / Richtwert {checklist.minimumCharacters}</p>
        <ul>{checklist.features.map(feature=><li key={feature.text}>
          {feature.present?"Vorhanden":"Nicht erkannt"}: <span lang="ja">{feature.text}</span>
        </li>)}</ul>
        <p><strong>Selbst prüfen:</strong> {checklist.guidance}</p>
        <details><summary>Beispielantwort vergleichen</summary><p lang="ja">{checklist.reference}</p></details>
        <small>Eine gefundene Zeichenfolge beweist weder Grammatikrichtigkeit noch Verständlichkeit oder gute Aussprache.</small>
      </div>:null}
      {productionSaved?<p role="status">Unbewerteter Übungsversuch gespeichert (ohne Antworttext, Mikrofondatei, FSRS-Bewertung oder Meisterschaftsänderung).</p>:null}
    </div>:null}
    {error?<p role="alert">{error}</p>:null}
    <p className="p24-lab__disclaimer">Geschlossene Aufgaben erzeugen reguläre Lernereignisse mit FSRS-Wiederholungen. Freie Antworten erzeugen nur unbewertete Übungsereignisse. Kein KI-Sprachurteil und keine Aussprachebewertung.</p>
  </section>;
}
function speakJapanese(text:string):void{
  if(typeof window==="undefined"||!("speechSynthesis" in window))return;
  window.speechSynthesis.cancel();
  const utterance=new SpeechSynthesisUtterance(text);
  utterance.lang="ja-JP";utterance.rate=.84;
  window.speechSynthesis.speak(utterance);
}
