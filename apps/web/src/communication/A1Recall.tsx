import {notifyA1Progress} from "./a1-events";
import {A1_NAV_EVENT,type A1Navigation} from "./a1-navigation";
import {recallSchedule,isRecallDue,type RecallAttempt} from "./a1-review-schedule";
import "./a1-mobile.css";
import {useEffect,useState} from "react";
import {listStudyEvents,saveStudyEvent} from "@thiepn/local-db";
import type {StudyEvent} from "@thiepn/domain";
import {a1CommunicationLessons} from "../../../../packages/a1-communication-seed/src/index";
import {getDevelopmentAccountId} from "../study/runtime";

const kana=[["あ","a"],["い","i"],["う","u"],["え","e"],["お","o"],["か","ka"],["き","ki"],["く","ku"],["け","ke"],["こ","ko"],["さ","sa"],["し","shi"],["す","su"],["せ","se"],["そ","so"],["た","ta"],["ち","chi"],["つ","tsu"],["て","te"],["と","to"],["な","na"],["に","ni"],["ぬ","nu"],["ね","ne"],["の","no"],["は","ha"],["ひ","hi"],["ふ","fu"],["へ","he"],["ほ","ho"],["ま","ma"],["み","mi"],["む","mu"],["め","me"],["も","mo"],["や","ya"],["ゆ","yu"],["よ","yo"],["ら","ra"],["り","ri"],["る","ru"],["れ","re"],["ろ","ro"],["わ","wa"],["を","o"],["ん","n"]] as const;
type Item={id:string;front:string;answer:string;context:string;kind:"kana"|"katakana"|"vocabulary"|"context"|"reverse"};
const katakana=[["ア","a"],["イ","i"],["ウ","u"],["エ","e"],["オ","o"],["カ","ka"],["キ","ki"],["ク","ku"],["ケ","ke"],["コ","ko"],["サ","sa"],["シ","shi"],["ス","su"],["セ","se"],["ソ","so"],["タ","ta"],["チ","chi"],["ツ","tsu"],["テ","te"],["ト","to"],["ナ","na"],["ニ","ni"],["ヌ","nu"],["ネ","ne"],["ノ","no"],["ハ","ha"],["ヒ","hi"],["フ","fu"],["ヘ","he"],["ホ","ho"],["マ","ma"],["ミ","mi"],["ム","mu"],["メ","me"],["モ","mo"],["ヤ","ya"],["ユ","yu"],["ヨ","yo"],["ラ","ra"],["リ","ri"],["ル","ru"],["レ","re"],["ロ","ro"],["ワ","wa"],["ヲ","o"],["ン","n"]] as const;
const items:Item[]=[
 ...katakana.map(([front,answer])=>({id:"katakana:"+front,front,answer,context:"Katakana lesen",kind:"katakana" as const})),
 ...kana.map(([front,answer])=>({id:"kana:"+front,front,answer,context:"Hiragana lesen",kind:"kana" as const})),
 ...a1CommunicationLessons.flatMap(lesson=>lesson.vocabulary.map(word=>({id:"vocab:"+lesson.id+":"+word.japanese,front:word.japanese,answer:word.german,context:lesson.title,kind:"vocabulary" as const}))),
 ...a1CommunicationLessons.flatMap(lesson=>lesson.vocabulary.map(word=>({id:"reverse:"+lesson.id+":"+word.japanese,front:word.german,answer:word.japanese,context:lesson.title+" · Deutsch → Japanisch",kind:"reverse" as const}))),
 ...a1CommunicationLessons.flatMap(lesson=>lesson.dialogue.map((line,index)=>({id:"context:"+lesson.id+":"+index,front:line.japanese,answer:line.german,context:lesson.title+" · "+line.speaker,kind:"context" as const})))
];
const SOURCE="original-a1-recall-v1";
function normalize(value:string){return value.normalize("NFKC").trim().replace(/\\s+/g," ").toLocaleLowerCase("de");}
export function A1Recall(){
 const [mode,setMode]=useState<Item["kind"]>("kana");
 const [dailyOnly,setDailyOnly]=useState(false);
 const [lessonFilter,setLessonFilter]=useState("all");
 const [index,setIndex]=useState(0);
 const [answer,setAnswer]=useState("");
 const [revealed,setRevealed]=useState(false);
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState("");
 const [history,setHistory]=useState<Record<string,{correct:number;wrong:number;last:string}>>({});
 const [attempts,setAttempts]=useState<RecallAttempt[]>([]);
 const [activeId,setActiveId]=useState<string|null>(null);
 const [mistakesOnly,setMistakesOnly]=useState(false);
 const [hint,setHint]=useState(false);
 const [session,setSession]=useState(0);
 const [choiceMode,setChoiceMode]=useState(false);
 const [listeningMode,setListeningMode]=useState(false);
 const [queue,setQueue]=useState<string[]>([]);
 const [reviewMode,setReviewMode]=useState(false);
 const [seen,setSeen]=useState<string[]>([]);
 const owner=getDevelopmentAccountId();
 useEffect(()=>{let live=true;setHistory({});setAttempts([]);setActiveId(null);setIndex(0);setAnswer("");setRevealed(false);
 void listStudyEvents(owner).then(events=>{if(!live)return;const next:typeof history={};const loaded:RecallAttempt[]=[];
 for(const event of events){if(event.userId!==owner||event.sourceId!==SOURCE)continue;
 const id=event.metadata?.recallId;if(typeof id!=="string")continue;
 loaded.push({id,at:event.occurredAt,correct:event.result==="correct"});
 const current=next[id]??{correct:0,wrong:0,last:""};
 if(event.result==="correct")current.correct++;else current.wrong++;
 current.last=event.occurredAt;next[id]=current;
 }setHistory(next);setAttempts(loaded);}).catch(()=>{if(live)setMessage("Lernverlauf konnte nicht geladen werden.");});
 return()=>{live=false};},[owner]);
 useEffect(()=>{const handle=(event:Event)=>{const request=(event as CustomEvent<A1Navigation>).detail;if(request.destination!=="recall")return;setMode(request.mode??"vocabulary");setLessonFilter(request.lessonId??"all");setIndex(0);setQueue([]);setSeen([]);reset();};window.addEventListener(A1_NAV_EVENT,handle);return()=>window.removeEventListener(A1_NAV_EVENT,handle);},[]);
 const today=new Date().toLocaleDateString("sv-SE");
 const now=Date.now();
 const schedule=recallSchedule(attempts,now);
 const reviewDue=(card:Item)=>isRecallDue(schedule[card.id],now);
 const dueTotal=items.filter(card=>reviewDue(card)).length;
 const pool=items.filter(item=>item.kind===mode&&(lessonFilter==="all"||item.id.includes(":"+lessonFilter+":"))&&(!dailyOnly||!history[item.id]?.last||new Date(history[item.id].last).toLocaleDateString("sv-SE")!==today)&&(!mistakesOnly||(schedule[item.id]?.streak===0&&schedule[item.id]?.incorrect>0))&&(!reviewMode||reviewDue(item))).sort((a,b)=>{
 const x=history[a.id],y=history[b.id];
 const priority=(h:typeof x)=>h?(h.wrong>h.correct?0:h.correct===0?1:h.wrong>0?2:3):-1;
 return priority(x)-priority(y)||a.id.localeCompare(b.id);
 });
 const retryItem=queue.length?items.find(card=>card.id===queue[0]&&card.kind===mode&&(lessonFilter==="all"||card.id.includes(":"+lessonFilter+":"))):undefined;
 const item=items.find(card=>card.id===activeId)??retryItem??pool.find(card=>!seen.includes(card.id))??pool[index%pool.length];
 const alternatives=item?items.filter(card=>card.kind===item.kind&&card.id!==item.id&&card.answer!==item.answer&&card.front!==item.front).slice(0,3):[];
 const choices=item?[item,...alternatives].sort((a,b)=>a.answer.localeCompare(b.answer,"ja")).map(card=>card.answer):[];
 function reset(){setActiveId(null);setAnswer("");setRevealed(false);setHint(false);setMessage("");}
 function changeMode(next:Item["kind"]){setMode(next);setIndex(0);setQueue([]);setSeen([]);reset();}
 async function check(){
 if(!item||busy||revealed)return;
 const correct=normalize(answer)===normalize(item.answer);
 const event:StudyEvent={id:crypto.randomUUID(),userId:owner,deviceId:"japanese-communication-local",occurredAt:new Date().toISOString(),
 activity:"lesson",primaryTarget:{kind:"can_do",id:"recall:"+item.id},skillDimension:(mode==="kana"||mode==="katakana")?"reading":"meaning_recognition",
 promptFamily:"a1-recall-"+mode,responseMode:"typed",result:correct?"correct":"incorrect",attempts:1,
 sourceId:SOURCE,contentVersion:"1",contextId:item.context,metadata:{recallId:item.id,schedulerExcluded:true}};
 setBusy(true);setMessage("");
 try{await saveStudyEvent(event);notifyA1Progress();setActiveId(item.id);setAttempts(previous=>[...previous,{id:item.id,at:event.occurredAt,correct}]);setHistory(previous=>{const old=previous[item.id]??{correct:0,wrong:0,last:""};return {...previous,[item.id]:{correct:old.correct+(correct?1:0),wrong:old.wrong+(correct?0:1),last:event.occurredAt}}});setRevealed(true);if(!correct)setQueue(previous=>previous.includes(item.id)?previous:[...previous,item.id]);}
 catch{setMessage("Antwort konnte nicht gespeichert werden.");}finally{setBusy(false);}
 }
 function next(){if(!item)return;
 if(queue[0]===item.id)setQueue(previous=>previous.slice(1));
 setSeen(previous=>previous.length>=pool.length?[]:[...previous,item.id]);
 setIndex(value=>value+1);setSession(value=>value+1);reset();}
 return <section aria-labelledby="a1-recall-title" className="j4-practice a1-recall-shell">
 <h2 id="a1-recall-title">A1 · Aktives Wiederholen</h2>
 <p>Schriftzeichen, Wörter und Sätze selbst abrufen. Fehlerhafte und neue Karten erscheinen zuerst; Ergebnisse werden lokal pro Lernkonto gespeichert.</p>
 <fieldset><legend>Übungsmodus</legend>
 {(["kana","katakana","vocabulary","reverse","context"] as const).map(value=><label key={value} style={{marginRight:"1rem"}}><input type="radio" name="a1-recall-mode" checked={mode===value} onChange={()=>changeMode(value)}/>{value==="kana"?"Hiragana":value==="katakana"?"Katakana":value==="vocabulary"?"Wortschatz":value==="reverse"?"Deutsch → Japanisch":"Sätze verstehen"}</label>)}
 </fieldset>
 <label><input type="checkbox" checked={reviewMode} onChange={event=>{setReviewMode(event.target.checked);setIndex(0);setQueue([]);setSeen([]);reset();}}/> Fällige Wiederholungen</label>
 <label><input type="checkbox" checked={mistakesOnly} onChange={event=>{setMistakesOnly(event.target.checked);setIndex(0);setQueue([]);setSeen([]);reset();}}/> Fehler gezielt wiederholen</label>
 <label><input type="checkbox" checked={dailyOnly} onChange={event=>{setDailyOnly(event.target.checked);setIndex(0);setQueue([]);setSeen([]);reset();}}/> Heute noch nicht geübt</label>
 {(mode==="vocabulary"||mode==="reverse"||mode==="context")?<label> Lektion <select value={lessonFilter} onChange={event=>{setLessonFilter(event.target.value);setIndex(0);setQueue([]);setSeen([]);reset();}}><option value="all">Alle Lektionen</option>{a1CommunicationLessons.map(lesson=><option key={lesson.id} value={lesson.id}>{lesson.title}</option>)}</select></label>:null}
 <div className="a1-mobile-actions"><label><input type="checkbox" checked={choiceMode} onChange={event=>{setChoiceMode(event.target.checked);reset();}}/> Auswahl statt Tippen</label><label><input type="checkbox" checked={listeningMode} onChange={event=>{setListeningMode(event.target.checked);reset();}}/> Hörmodus</label></div>
 <p>{dueTotal} von {items.length} Karten aktuell zur Wiederholung fällig (einfache Intervall-Heuristik).</p>
 <p>{session} Karten in dieser Sitzung bearbeitet · {pool.length} Karten · {pool.filter(card=>(history[card.id]?.correct??0)>0).length} mindestens einmal richtig</p>
 {!item?<p role="status">Keine Karten in dieser Auswahl. Deaktiviere einen Filter oder wähle eine andere Lektion.</p>:null}
 {item?<div><p>{item.context}</p>{!listeningMode||mode==="reverse"?<h3 lang={mode==="reverse"?"de":"ja"}>{item.front}</h3>:<h3>Höre zu und beantworte die Frage</h3>}
 {listeningMode&&mode!=="reverse"?<button type="button" onClick={()=>{if("speechSynthesis" in window){window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(item.front);u.lang="ja-JP";u.rate=0.8;window.speechSynthesis.speak(u);}}}>Audio abspielen</button>:null}
 {mode==="context"?<button type="button" onClick={()=>{if("speechSynthesis" in window){window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(item.front);u.lang="ja-JP";u.rate=0.8;window.speechSynthesis.speak(u);}}}>Satz anhören</button>:null}
 {!revealed?<button type="button" onClick={()=>setHint(true)}>Hinweis anzeigen</button>:null}
 {hint&&!revealed?<p role="status">Die Antwort beginnt mit: {item.answer.slice(0,mode==="kana"||mode==="katakana"?1:2)}…</p>:null}
 <form onSubmit={event=>{event.preventDefault();void check();}}>
 {choiceMode?<fieldset disabled={busy||revealed}><legend>Wähle die richtige Antwort</legend><div className="a1-choice-grid">{choices.map(option=><label key={option}><input type="radio" name="a1-recall-choice" checked={answer===option} onChange={()=>setAnswer(option)}/>{option}</label>)}</div></fieldset>:<label>Deine Antwort <input autoComplete="off" value={answer} disabled={busy||revealed} onChange={event=>setAnswer(event.target.value)}/></label>}
 {!revealed?<button type="submit" disabled={!answer.trim()||busy}>Prüfen</button>:null}
 </form>
 {revealed?<div role="status"><p>Richtige Antwort: <strong>{item.answer}</strong></p><p>{normalize(answer)===normalize(item.answer)?"Richtig":"Noch nicht richtig – diese Karte kommt in die Wiederholungsschlange."}</p><button type="button" onClick={next}>Nächste Karte</button></div>:null}
 </div>:null}
 {message?<p role="alert">{message}</p>:null}
 </section>;
}
