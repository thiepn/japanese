import {A1_NAV_EVENT,type A1Navigation} from "./a1-navigation";
import {useEffect,useState} from "react";
import {listStudyEvents,saveStudyEvent} from "@thiepn/local-db";
import type {StudyEvent} from "@thiepn/domain";
import {getDevelopmentAccountId} from "../study/runtime";


type Turn={speaker:string;prompt:string;choices:readonly {japanese:string;german:string;correct:boolean;reply:string;replyGerman:string;next?:number|null}[]};
type Scenario={id:string;title:string;intro:string;turns:readonly Turn[]};
const scenarios:readonly Scenario[]=[
 {id:"cafe",title:"Im Café",intro:"Bestelle ein Getränk und entscheide, ob du noch etwas möchtest.",turns:[
 {speaker:"店員",prompt:"いらっしゃいませ。ごちゅうもんは？",choices:[
 {japanese:"おちゃをください。",german:"Einen Tee bitte.",correct:true,reply:"はい、おちゃですね。",replyGerman:"Ja, einen Tee.",next:1},
 {japanese:"コーヒーをください。",german:"Einen Kaffee bitte.",correct:true,reply:"はい、コーヒーですね。",replyGerman:"Ja, einen Kaffee.",next:2},
 {japanese:"えきはどこですか。",german:"Wo ist der Bahnhof?",correct:false,reply:"ここはカフェです。",replyGerman:"Hier ist ein Café."}]},
 {speaker:"店員",prompt:"おちゃです。ほかに何か？",choices:[
 {japanese:"みずをください。",german:"Wasser bitte.",correct:true,reply:"はい、どうぞ。",replyGerman:"Ja, bitte schön.",next:3},
 {japanese:"いいえ、けっこうです。",german:"Nein, danke.",correct:true,reply:"ありがとうございます。",replyGerman:"Vielen Dank.",next:null},
 {japanese:"さんじです。",german:"Es ist drei Uhr.",correct:false,reply:"え？",replyGerman:"Wie bitte?"}]},
 {speaker:"店員",prompt:"コーヒーです。ほかに何か？",choices:[
 {japanese:"みずをください。",german:"Wasser bitte.",correct:true,reply:"はい、どうぞ。",replyGerman:"Ja, bitte schön.",next:3},
 {japanese:"いいえ、けっこうです。",german:"Nein, danke.",correct:true,reply:"ありがとうございます。",replyGerman:"Vielen Dank.",next:null},
 {japanese:"わたしはアンナです。",german:"Ich bin Anna.",correct:false,reply:"え？",replyGerman:"Wie bitte?"}]},
 {speaker:"店員",prompt:"ほかに何か？",choices:[
 {japanese:"いいえ、けっこうです。",german:"Nein, danke.",correct:true,reply:"ありがとうございました。",replyGerman:"Vielen Dank.",next:null},
 {japanese:"おちゃをください。",german:"Noch einen Tee bitte.",correct:true,reply:"はい、どうぞ。",replyGerman:"Ja, bitte schön.",next:null},
 {japanese:"おやすみなさい。",german:"Gute Nacht.",correct:false,reply:"え？",replyGerman:"Wie bitte?"}]}
 ]},
 {id:"station",title:"Am Bahnhof",intro:"Frage nach dem Bahnhof und entscheide, wie du weiterreist.",turns:[
 {speaker:"通行人",prompt:"こんにちは。どうしましたか。",choices:[
 {japanese:"えきはどこですか。",german:"Wo ist der Bahnhof?",correct:true,reply:"えきはみぎです。",replyGerman:"Der Bahnhof ist rechts.",next:1},
 {japanese:"バスはどこですか。",german:"Wo ist der Bus?",correct:true,reply:"バスはひだりです。",replyGerman:"Der Bus ist links.",next:2},
 {japanese:"おちゃをください。",german:"Tee bitte.",correct:false,reply:"ここはカフェではありません。",replyGerman:"Hier ist kein Café."}]},
 {speaker:"駅員",prompt:"どこへいきますか。",choices:[
 {japanese:"とうきょうへいきます。",german:"Ich fahre nach Tokio.",correct:true,reply:"でんしゃですね。",replyGerman:"Also mit dem Zug.",next:3},
 {japanese:"ありがとうございます。",german:"Vielen Dank, das ist alles.",correct:true,reply:"どういたしまして。",replyGerman:"Gern geschehen.",next:null},
 {japanese:"さんじです。",german:"Es ist drei Uhr.",correct:false,reply:"どこへ？",replyGerman:"Wohin?"}]},
 {speaker:"通行人",prompt:"バスでいきますか。",choices:[
 {japanese:"はい、バスでいきます。",german:"Ja, ich fahre mit dem Bus.",correct:true,reply:"わかりました。",replyGerman:"Verstanden.",next:null},
 {japanese:"いいえ、でんしゃでいきます。",german:"Nein, ich fahre mit dem Zug.",correct:true,reply:"えきはみぎです。",replyGerman:"Der Bahnhof ist rechts.",next:1},
 {japanese:"わたしはアンナです。",german:"Ich bin Anna.",correct:false,reply:"え？",replyGerman:"Wie bitte?"}]},
 {speaker:"駅員",prompt:"でんしゃですね。",choices:[
 {japanese:"ありがとうございます。",german:"Vielen Dank.",correct:true,reply:"どういたしまして。",replyGerman:"Gern geschehen.",next:null},
 {japanese:"えきはどこですか。",german:"Wo ist der Bahnhof?",correct:false,reply:"ここはえきです。",replyGerman:"Das hier ist der Bahnhof."}]}
 ]},
 {id:"meeting",title:"Neue Bekanntschaft",intro:"Begrüße eine neue Person und sprich über Namen oder Interessen.",turns:[
 {speaker:"相手",prompt:"はじめまして。",choices:[
 {japanese:"はじめまして。",german:"Schön, Sie kennenzulernen.",correct:true,reply:"おなまえは？",replyGerman:"Wie heißen Sie?",next:1},
 {japanese:"こんにちは。",german:"Guten Tag.",correct:true,reply:"おんがくがすきですか。",replyGerman:"Mögen Sie Musik?",next:2},
 {japanese:"これをください。",german:"Das bitte.",correct:false,reply:"え？",replyGerman:"Wie bitte?"}]},
 {speaker:"相手",prompt:"おなまえは？",choices:[
 {japanese:"わたしはアンナです。",german:"Ich bin Anna.",correct:true,reply:"よろしくおねがいします。",replyGerman:"Freut mich.",next:3},
 {japanese:"わたしはたなかです。",german:"Ich bin Tanaka.",correct:true,reply:"よろしくおねがいします。",replyGerman:"Freut mich.",next:3},
 {japanese:"いくらですか。",german:"Wie viel kostet es?",correct:false,reply:"おなまえは？",replyGerman:"Wie heißen Sie?"}]},
 {speaker:"相手",prompt:"おんがくがすきですか。",choices:[
 {japanese:"はい、おんがくがすきです。",german:"Ja, ich mag Musik.",correct:true,reply:"わたしもです。",replyGerman:"Ich auch.",next:3},
 {japanese:"ほんがすきです。",german:"Ich mag Bücher.",correct:true,reply:"そうですか。",replyGerman:"Ach so.",next:3},
 {japanese:"えきはみぎです。",german:"Der Bahnhof ist rechts.",correct:false,reply:"え？",replyGerman:"Wie bitte?"}]},
 {speaker:"相手",prompt:"よろしくおねがいします。",choices:[
 {japanese:"こちらこそ、よろしくおねがいします。",german:"Ganz meinerseits.",correct:true,reply:"ありがとうございます。",replyGerman:"Vielen Dank.",next:null},
 {japanese:"さようなら。",german:"Auf Wiedersehen.",correct:true,reply:"さようなら。",replyGerman:"Auf Wiedersehen.",next:null},
 {japanese:"おちゃをください。",german:"Tee bitte.",correct:false,reply:"え？",replyGerman:"Wie bitte?"}]}
 ]}

];
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
 const scenario=scenarios[scenarioIndex],turn=scenario.turns[turnIndex],choice=choiceIndex===null?null:turn.choices[choiceIndex];
 const done=choice!==null&&choice.correct&&(choice.next===null||(choice.next===undefined&&turnIndex===scenario.turns.length-1));
 function start(index:number){setScenarioIndex(index);setTurnIndex(0);setChoiceIndex(null);setScore(0);setVisited([]);setPreviousMismatch(false);setError("");}
 async function choose(index:number){
  if(busy||choiceIndex!==null)return;
  const selected=turn.choices[index];
  const event:StudyEvent={id:crypto.randomUUID(),userId:owner,deviceId:"japanese-communication-local",occurredAt:new Date().toISOString(),activity:"lesson",
   primaryTarget:{kind:"can_do",id:"roleplay:"+scenario.id},skillDimension:"comprehension",promptFamily:"a1-roleplay-choice",responseMode:"choice",
   result:selected.correct?"correct":"incorrect",attempts:1,sourceId:"original-a1-roleplay-v1",contentVersion:"1",contextId:scenario.id,
   metadata:{scenarioId:scenario.id,turnIndex,selected:index,nextTurn:selected.next===undefined?turnIndex+1:selected.next,schedulerExcluded:true}};
  setBusy(true);setError("");
  try{await saveStudyEvent(event);setChoiceIndex(index);setVisited(previous=>previous.includes(turnIndex)?previous:[...previous,turnIndex]);if(selected.correct){setScore(v=>v+1);setPreviousMismatch(false);}else setPreviousMismatch(true);
 setHistory(previous=>{const old=previous[scenario.id]??{correct:0,incorrect:0};return {...previous,[scenario.id]:{correct:old.correct+(selected.correct?1:0),incorrect:old.incorrect+(selected.correct?0:1)}};});}
  catch{setError("Antwort konnte nicht gespeichert werden. Bitte erneut versuchen.");}
  finally{setBusy(false);}
 }
 return <section className="j4-practice a1-roleplay-shell" aria-labelledby="a1-roleplay-title">
  <h2 id="a1-roleplay-title">A1 · Gesprächstraining</h2>
  <p>Wähle passende Antworten. Dein Gegenüber reagiert auf deine Entscheidung. Die Auswahl wird lokal als Übung gespeichert.</p>
  <label>Situation <select value={scenarioIndex} onChange={e=>start(Number(e.target.value))}>{scenarios.map((s,i)=><option key={s.id} value={i}>{s.title}</option>)}</select></label>
  <p>{scenario.intro}</p>
 <p>{history[scenario.id]?history[scenario.id].correct+" passende · "+history[scenario.id].incorrect+" unpassende Antworten bisher":"Noch kein gespeicherter Verlauf in dieser Situation."}</p>
 {historyError?<p role="alert">{historyError}</p>:null}
 <p>Empfohlene Wiederholung: {scenarios.find(s=>s.id===Object.entries(history).sort((a,b)=>b[1].incorrect-a[1].incorrect)[0]?.[0])?.title??"Noch keine Fehler erfasst"}</p><progress value={turnIndex+(choice===null?0:1)} max={scenario.turns.length} aria-label="Gesprächsfortschritt"/>
  <p>Gesprächsknoten {turnIndex+1} von {scenario.turns.length} · Dein Weg kann sich je nach Antwort verzweigen.</p>{previousMismatch&&choiceIndex===null?<p role="status">Dein Gegenüber war irritiert. Wähle jetzt eine Antwort, die zur Situation passt.</p>:null}
  <article><strong>{turn.speaker}</strong><p lang="ja">{turn.prompt}</p><button type="button" onClick={()=>speak(turn.prompt)}>Anhören</button></article>
  <fieldset disabled={choice!==null||busy}><legend>Was antwortest du?</legend><div className="a1-choice-grid">
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
