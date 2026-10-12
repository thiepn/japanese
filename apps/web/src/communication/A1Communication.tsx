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
  function select(index:number){setLessonIndex(index);setExerciseIndex(0);setResponse("");setOrdered([]);setFeedback(null);setError("");}
  function next(){
    if(!lesson)return;
    if(exerciseIndex+1>=lesson.exercises.length){setLessonIndex(null);return;}
    setExerciseIndex(value=>value+1);setResponse("");setOrdered([]);setFeedback(null);setError("");
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
      <p>{item.exercises.filter(ex=>completed[ex.id]>0).length}/{item.exercises.length} Übungen mindestens einmal richtig</p>
      <button type="button" onClick={()=>select(index)}>Lektion öffnen</button>
    </article>)}</div>:<div>
      <button type="button" onClick={()=>setLessonIndex(null)}>Zurück zur Übersicht</button>
      <h3>{lesson.title}</h3><p>{lesson.canDo}</p>
      <details><summary>Grammatik und Wortschatz</summary>
        <ul>{lesson.grammar.map(point=><li key={point}>{point}</li>)}</ul>
        <dl>{lesson.vocabulary.map(word=><div key={word.japanese}><dt lang="ja">{word.japanese} ({word.romaji})</dt><dd>{word.german}</dd></div>)}</dl>
      </details>
      <details open><summary>Dialog mit Übersetzung</summary>
        {lesson.dialogue.map((line,index)=><p key={index}><strong>{line.speaker}:</strong> <span lang="ja">{line.japanese}</span> <small>{line.romaji} — {line.german}</small></p>)}
      </details>
      {exercise?<div aria-labelledby="a1-question">
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
    </div>}
    {error?<p role="alert">{error}</p>:null}
  </section>;
}
