import {useEffect,useRef,useState} from "react";
import {listStudyEvents,saveStudyEvent} from "@thiepn/local-db";
import type {StudyEvent} from "@thiepn/domain";
import {a1CommunicationLessons,evaluateA1Exercise,type A1Exercise} from "../../../../packages/a1-communication-seed/src/index";
import {getDevelopmentAccountId} from "../study/runtime";

const SOURCE="original-a1-communication-v1";
export function A1Communication(){
  const [lessonIndex,setLessonIndex]=useState<number|null>(null);
  const [exerciseIndex,setExerciseIndex]=useState(0);
  const [response,setResponse]=useState("");
  const [ordered,setOrdered]=useState<string[]>([]);
  const [feedback,setFeedback]=useState<"correct"|"incorrect"|null>(null);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [showRomaji,setShowRomaji]=useState(true);
  const [showTranslation,setShowTranslation]=useState(true);
  const [dialogueStep,setDialogueStep]=useState(0);
  const [stage,setStage]=useState<"learn"|"dialogue"|"practice"|"finish">("learn");
  const [completed,setCompleted]=useState<Record<string,number>>({});
  const owner=getDevelopmentAccountId();
  const ownerRef=useRef(owner);
  ownerRef.current=owner;
  useEffect(()=>{
    let active=true;
    setLessonIndex(null);setFeedback(null);setCompleted({});
    void listStudyEvents(owner).then(events=>{
      if(!active||ownerRef.current!==owner)return;
      const next:Record<string,number>={};
      for(const event of events){
        if(event.sourceId!==SOURCE||event.userId!==owner||event.result!=="correct")continue;
        const key=event.metadata?.exerciseId;
        if(typeof key==="string")next[key]=(next[key]??0)+1;
      }
      setCompleted(next);
    }).catch(()=>{if(active)setError("Fortschritt konnte nicht geladen werden.");});
    return()=>{active=false;};
  },[owner]);
  const lesson=lessonIndex===null?null:a1CommunicationLessons[lessonIndex];
  const exercise=lesson?.exercises[exerciseIndex];
  function select(index:number){setStage("learn");setDialogueStep(0);setLessonIndex(index);setExerciseIndex(0);setResponse("");setOrdered([]);setFeedback(null);setError("");}
  function next(){
    if(!lesson)return;
    if(exerciseIndex+1>=lesson.exercises.length){setStage("finish");return;}
    setExerciseIndex(value=>value+1);setResponse("");setOrdered([]);setFeedback(null);setError("");
  }
  function speak(japanese:string){
    if(typeof window==="undefined"||!("speechSynthesis" in window))return;
    window.speechSynthesis.cancel();
    const utterance=new SpeechSynthesisUtterance(japanese);
    utterance.lang="ja-JP";utterance.rate=0.82;
    window.speechSynthesis.speak(utterance);
  }
  async function submit(){
    if(!lesson||!exercise||busy||feedback)return;
    const answer=exercise.kind==="order"?ordered:response;
    if(exercise.kind==="order"&&ordered.length!==exercise.tokens.length)return;
    if(exercise.kind!=="order"&&!response.trim())return;
    const correct=evaluateA1Exercise(exercise,answer);
    const currentOwner=ownerRef.current;
    const event:StudyEvent={
      id:crypto.randomUUID(),userId:currentOwner,deviceId:"japanese-communication-local",
      occurredAt:new Date().toISOString(),activity:"lesson",
      primaryTarget:{kind:"can_do",id:"communication:"+lesson.id},
      skillDimension:exercise.kind==="order"?"form_selection":"comprehension",
      promptFamily:"a1-communication-"+exercise.kind,responseMode:exercise.kind,
      result:correct?"correct":"incorrect",attempts:1,sourceId:SOURCE,contentVersion:"1",
      contextId:lesson.id,
      metadata:{exerciseId:exercise.id,answer:exercise.kind==="order"?ordered.join(" "):response,schedulerExcluded:true}
    };
    setBusy(true);setError("");
    try{
      await saveStudyEvent(event);
      if(ownerRef.current!==currentOwner)return;
      setFeedback(correct?"correct":"incorrect");
      if(correct)setCompleted(previous=>({...previous,[exercise.id]:(previous[exercise.id]??0)+1}));
    }catch{if(ownerRef.current===currentOwner)setError("Antwort nicht gespeichert. Bitte erneut versuchen.");}
    finally{setBusy(false);}
  }
  return <section aria-labelledby="a1-communication-title" className="j4-practice">
    <h2 id="a1-communication-title">A1 · Kommunikation</h2>
    <p>Originale Alltagssituationen · Deutsch, Japanisch und Romaji. Ergebnisse werden als lokale Lernereignisse gespeichert; keine automatische Meisterschaftsbehauptung.</p>
    {!lesson?<div>{a1CommunicationLessons.map((item,index)=><article key={item.id}>
      <h3>{item.title}</h3><p>{item.canDo}</p>
      <p>{item.exercises.filter(ex=>(completed[ex.id]??0)>0).length}/{item.exercises.length} Übungen mindestens einmal richtig</p>
      <button type="button" onClick={()=>select(index)}>Lektion öffnen</button>
    </article>)}</div>:<div>
      <button type="button" onClick={()=>setLessonIndex(null)}>Zurück zur Übersicht</button>
      <h3>{lesson.title}</h3><p>{lesson.canDo}</p>
      <nav aria-label="Lektionsnavigation"><button type="button" disabled={lessonIndex===0} onClick={()=>select(Math.max(0,(lessonIndex??0)-1))}>Vorherige Lektion</button> <span>Lektion {(lessonIndex??0)+1} von {a1CommunicationLessons.length}</span> <button type="button" disabled={lessonIndex===a1CommunicationLessons.length-1} onClick={()=>select(Math.min(a1CommunicationLessons.length-1,(lessonIndex??0)+1))}>Nächste Lektion</button></nav>
      <label><input type="checkbox" checked={showRomaji} onChange={event=>setShowRomaji(event.target.checked)}/> Romaji anzeigen</label> <label><input type="checkbox" checked={showTranslation} onChange={event=>setShowTranslation(event.target.checked)}/> Übersetzung anzeigen</label>
      <nav aria-label="Lernschritte"><button type="button" aria-current={stage==="learn"?"step":undefined} onClick={()=>setStage("learn")}>1 · Lernen</button> <button type="button" aria-current={stage==="dialogue"?"step":undefined} onClick={()=>setStage("dialogue")}>2 · Dialog</button> <button type="button" aria-current={stage==="practice"?"step":undefined} onClick={()=>setStage("practice")}>3 · Üben</button> <button type="button" aria-current={stage==="finish"?"step":undefined} onClick={()=>setStage("finish")}>4 · Ergebnis</button></nav>
      {stage==="learn"?<div><h4>Neue Wörter und Grammatik</h4><details open><summary>Grammatik und Wortschatz</summary>
        <ul>{lesson.grammar.map(point=><li key={point}>{point}</li>)}</ul>
        <dl>{lesson.vocabulary.map(word=><div key={word.japanese}><dt><span lang="ja">{word.japanese}</span> {showRomaji?<small>{word.romaji}</small>:null} <button type="button" onClick={()=>speak(word.japanese)} aria-label={`Aussprache: ${word.japanese}`}>Anhören</button></dt>{showTranslation?<dd>{word.german}</dd>:null}</div>)}</dl>
      </details>
      <button type="button" onClick={()=>setStage("dialogue")}>Weiter zum Dialog</button></div>:null}
      {stage==="dialogue"?<div><section aria-label="Interaktiver Dialog">
        <h4>Dialog üben</h4>
        <p>Zeile {dialogueStep+1} von {lesson.dialogue.length}</p>
        {lesson.dialogue.map((line,index)=>index===dialogueStep?<div key={index}>
          <p><strong>{line.speaker}:</strong> <span lang="ja">{line.japanese}</span></p>
          {showRomaji?<p>{line.romaji}</p>:null}
          {showTranslation?<p>{line.german}</p>:null}
          <button type="button" onClick={()=>speak(line.japanese)}>Japanisch anhören</button>
        </div>:null)}
        <button type="button" disabled={dialogueStep===0} onClick={()=>setDialogueStep(v=>Math.max(0,v-1))}>Vorherige Zeile</button>
        <button type="button" disabled={dialogueStep===lesson.dialogue.length-1} onClick={()=>setDialogueStep(v=>Math.min(lesson.dialogue.length-1,v+1))}>Nächste Zeile</button>
        <button type="button" onClick={()=>setDialogueStep(0)}>Dialog neu beginnen</button>
        <p><small>Sprachausgabe verwendet die japanische Stimme des Geräts, sofern verfügbar; keine Aussprachebewertung.</small></p>
      </section>
      <button type="button" onClick={()=>setStage("practice")}>Weiter zu den Übungen</button></div>:null}
      {stage==="practice"&&exercise?<div aria-labelledby="a1-question">
        <p>Übung {exerciseIndex+1}/{lesson.exercises.length}</p>
        <h4 id="a1-question">{exercise.prompt}</h4>
        {exercise.kind==="choice"?<fieldset disabled={busy||feedback!==null}><legend>Wähle eine Antwort</legend>{exercise.options.map(option=><label key={option} style={{display:"block"}}><input type="radio" name="a1-answer" checked={response===option} onChange={()=>setResponse(option)}/>{option}</label>)}</fieldset>:null}
        {exercise.kind==="fill"?<label>Deine Antwort <input disabled={busy||feedback!==null} value={response} onChange={event=>setResponse(event.target.value)}/></label>:null}
        {exercise.kind==="order"?<div><p>Tippe die Wörter in der richtigen Reihenfolge an.</p>
          <p aria-live="polite">{ordered.join("　")||"Noch keine Wörter gewählt"}</p>
          {exercise.tokens.map((token,index)=><button type="button" key={index} disabled={busy||feedback!==null||ordered.includes(token)} onClick={()=>setOrdered(items=>[...items,token])}>{token}</button>)}
          <button type="button" disabled={busy||feedback!==null} onClick={()=>setOrdered([])}>Zurücksetzen</button>
        </div>:null}
        {feedback===null?<button type="button" disabled={busy||(exercise.kind==="order"?ordered.length!==exercise.tokens.length:!response.trim())} onClick={()=>void submit()}>{busy?"Speichere…":"Antwort prüfen"}</button>:<div role="status" aria-live="polite"><strong>{feedback==="correct"?"Richtig":"Noch nicht richtig"}</strong><p>{exercise.explanation}</p><button type="button" onClick={next}>{exerciseIndex+1===lesson.exercises.length?"Lektion abschließen":"Weiter"}</button></div>}
      </div>:null}
      {stage==="finish"?<section aria-label="Lektionsergebnis"><h4>Lektion abgeschlossen</h4><p>{lesson.exercises.filter(ex=>(completed[ex.id]??0)>0).length} von {lesson.exercises.length} Übungen mindestens einmal richtig beantwortet.</p><p>Wiederhole schwierige Wörter anschließend im Bereich „Aktives Wiederholen“.</p><button type="button" onClick={()=>select(lessonIndex===null?0:Math.min(lessonIndex+1,a1CommunicationLessons.length-1))}>Nächste Lektion lernen</button><button type="button" onClick={()=>setLessonIndex(null)}>Zur Lektionsübersicht</button></section>:null}
    </div>}
    {error?<p role="alert">{error}</p>:null}
  </section>;
}
