import {scenarios} from "./a1-roleplay-scenarios";
import {validateRoleplayGraph} from "./a1-roleplay-graph";
import {notifyA1Progress} from "./a1-events";
import {A1_NAV_EVENT,type A1Navigation} from "./a1-navigation";
import {useEffect,useState} from "react";
import {listStudyEvents,saveStudyEvent} from "@thiepn/local-db";
import type {StudyEvent} from "@thiepn/domain";
import {getDevelopmentAccountId} from "../study/runtime";


function speak(text:string){if(typeof window==="undefined"||!("speechSynthesis" in window))return;window.speechSynthesis.cancel();const voice=new SpeechSynthesisUtterance(text);voice.lang="ja-JP";voice.rate=.82;window.speechSynthesis.speak(voice);}
export function A1Roleplay(){
 const [scenarioIndex,setScenarioIndex]=useState(0),[turnIndex,setTurnIndex]=useState(0);
 const [choiceIndex,setChoiceIndex]=useState<number|null>(null),[score,setScore]=useState(0);
 const [busy,setBusy]=useState(false),[error,setError]=useState("");
 const [showGerman,setShowGerman]=useState(false);
 const [visited,setVisited]=useState<number[]>([]);
 const [previousMismatch,setPreviousMismatch]=useState(false);
 const [history,setHistory]=useState<Record<string,{correct:number;incorrect:number}>>({});
 const [historyError,setHistoryError]=useState("");
 const owner=getDevelopmentAccountId();
 useEffect(()=>{let active=true;setHistory({});setHistoryError("");
 void listStudyEvents(owner).then(events=>{if(!active)return;const next:Record<string,{correct:number;incorrect:number}>={};
 for(const event of events){if(event.userId!==owner||event.sourceId!=="original-a1-roleplay-v1")continue;
 const key=event.metadata?.scenarioId;if(typeof key!=="string")continue;
 const old=next[key]??{correct:0,incorrect:0};if(event.result==="correct")old.correct++;else old.incorrect++;next[key]=old;
 }setHistory(next);}).catch(()=>{if(active)setHistoryError("Gesprächsfortschritt konnte nicht geladen werden.");});
 return()=>{active=false};},[owner]);
 useEffect(()=>{const handle=(event:Event)=>{const request=(event as CustomEvent<A1Navigation>).detail;if(request.destination!=="roleplay")return;const index=scenarios.findIndex(s=>s.id===request.scenarioId);if(index>=0)start(index);};window.addEventListener(A1_NAV_EVENT,handle);return()=>window.removeEventListener(A1_NAV_EVENT,handle);},[]);
 const scenario=scenarios[scenarioIndex]!,turn=scenario.turns[turnIndex]!,choice=choiceIndex===null?null:turn.choices[choiceIndex]??null;
 const graphErrors=validateRoleplayGraph(scenario.turns);
 const done=choice!==null&&choice.correct&&(choice.next===null||(choice.next===undefined&&turnIndex===scenario.turns.length-1));
 function start(index:number){setScenarioIndex(index);setTurnIndex(0);setChoiceIndex(null);setScore(0);setVisited([]);setPreviousMismatch(false);setError("");}
 async function choose(index:number){
  if(busy||choiceIndex!==null)return;
  const selected=turn.choices[index];
  if(!selected||graphErrors.length)return;
  const event:StudyEvent={id:crypto.randomUUID(),userId:owner,deviceId:"japanese-communication-local",occurredAt:new Date().toISOString(),activity:"lesson",
   primaryTarget:{kind:"can_do",id:"roleplay:"+scenario.id},skillDimension:"comprehension",promptFamily:"a1-roleplay-choice",responseMode:"choice",
   result:selected.correct?"correct":"incorrect",attempts:1,sourceId:"original-a1-roleplay-v1",contentVersion:"1",contextId:scenario.id,
   metadata:{scenarioId:scenario.id,turnIndex,selected:index,nextTurn:selected.next===undefined?turnIndex+1:selected.next,schedulerExcluded:true}};
  setBusy(true);setError("");
  try{await saveStudyEvent(event);notifyA1Progress();setChoiceIndex(index);setVisited(previous=>previous.includes(turnIndex)?previous:[...previous,turnIndex]);if(selected.correct){setScore(v=>v+1);setPreviousMismatch(false);}else setPreviousMismatch(true);
 setHistory(previous=>{const old=previous[scenario.id]??{correct:0,incorrect:0};return {...previous,[scenario.id]:{correct:old.correct+(selected.correct?1:0),incorrect:old.incorrect+(selected.correct?0:1)}};});}
  catch{setError("Antwort konnte nicht gespeichert werden. Bitte erneut versuchen.");}
  finally{setBusy(false);}
 }
 return <section className="j4-practice a1-roleplay-shell" aria-labelledby="a1-roleplay-title">
  <h2 id="a1-roleplay-title">A1 · Gesprächstraining</h2>
  <p>Wähle passende Antworten. Dein Gegenüber reagiert auf deine Entscheidung. Die Auswahl wird lokal als Übung gespeichert.</p>
  <label>Situation <select value={scenarioIndex} onChange={e=>start(Number(e.target.value))}>{scenarios.map((s,i)=><option key={s.id} value={i}>{s.title}</option>)}</select></label>
  <p>{scenario.intro}</p>
 {graphErrors.length?<p role="alert">Dieser Gesprächspfad ist fehlerhaft und wurde zur Sicherheit deaktiviert.</p>:null}
 <p>{history[scenario.id]?history[scenario.id]!.correct+" passende · "+history[scenario.id]!.incorrect+" unpassende Antworten bisher":"Noch kein gespeicherter Verlauf in dieser Situation."}</p>
 {historyError?<p role="alert">{historyError}</p>:null}
 <p>Empfohlene Wiederholung: {scenarios.find(s=>s.id===Object.entries(history).sort((a,b)=>b[1].incorrect-a[1].incorrect)[0]?.[0])?.title??"Noch keine Fehler erfasst"}</p><progress value={turnIndex+(choice===null?0:1)} max={scenario.turns.length} aria-label="Gesprächsfortschritt"/>
  <p>Gesprächsknoten {turnIndex+1} von {scenario.turns.length} · Dein Weg kann sich je nach Antwort verzweigen.</p>{previousMismatch&&choiceIndex===null?<p role="status">Dein Gegenüber war irritiert. Wähle jetzt eine Antwort, die zur Situation passt.</p>:null}
  <article><strong>{turn.speaker}</strong><p lang="ja">{turn.prompt}</p><button type="button" onClick={()=>speak(turn.prompt)}>Anhören</button></article>
  <fieldset disabled={choice!==null||busy||graphErrors.length>0}><legend>Was antwortest du?</legend><div className="a1-choice-grid">
  {turn.choices.map((option,index)=><button type="button" key={option.japanese} onClick={()=>void choose(index)} aria-pressed={choiceIndex===index}>
    <span lang="ja">{option.japanese}</span>{showGerman?<small> — {option.german}</small>:null}
  </button>)}</div></fieldset>
  <label><input type="checkbox" checked={showGerman} onChange={e=>setShowGerman(e.target.checked)}/> Deutsche Hilfen anzeigen</label>
  {choice?<div role="status"><strong>{choice.correct?"Passende Antwort":"In dieser Situation unpassend"}</strong>
   <p>{choice.german}</p><p><strong>{turn.speaker}:</strong> <span lang="ja">{choice.reply}</span> — {choice.replyGerman}</p>
   <button type="button" onClick={()=>speak(choice.reply)}>Reaktion anhören</button>
   <p>{!choice.correct?"Versuche beim nächsten Durchgang eine passendere Antwort.":""}</p>
   {!choice.correct?<button type="button" onClick={()=>{setChoiceIndex(null);}}>Missverständnis klären und erneut antworten</button>:null}
   {done?<div><p>{score} passende Antworten auf {visited.length} besuchten Gesprächsschritten.</p><button type="button" onClick={()=>start(scenarioIndex)}>Gespräch wiederholen</button></div>
    :<button type="button" disabled={!choice.correct} onClick={()=>{setTurnIndex(choice.next??Math.min(turnIndex+1,scenario.turns.length-1));setChoiceIndex(null);setPreviousMismatch(false);}}>Gespräch fortsetzen</button>}
  </div>:null}
  {error?<p role="alert">{error}</p>:null}
 </section>;
}
