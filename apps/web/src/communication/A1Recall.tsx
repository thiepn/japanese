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
 const [mistakesOnly,setMistakesOnly]=useState(false);
 const [hint,setHint]=useState(false);
 const [session,setSession]=useState(0);
 const [choiceMode,setChoiceMode]=useState(false);
 const [listeningMode,setListeningMode]=useState(false);
 const [queue,setQueue]=useState<string[]>([]);
 const [reviewMode,setReviewMode]=useState(false);
 const owner=getDevelopmentAccountId();
 useEffect(()=>{let live=true;setHistory({});setIndex(0);setAnswer("");setRevealed(false);
 void listStudyEvents(owner).then(events=>{if(!live)return;const next:typeof history={};
 for(const event of events){if(event.userId!==owner||event.sourceId!==SOURCE)continue;
 const id=event.metadata?.recallId;if(typeof id!=="string")continue;
 const current=next[id]??{correct:0,wrong:0,last:""};
 if(event.result==="correct")current.correct++;else current.wrong++;
 current.last=event.occurredAt;next[id]=current;
 }setHistory(next);}).catch(()=>{if(live)setMessage("Lernverlauf konnte nicht geladen werden.");});
 return()=>{live=false};},[owner]);
 const today=new Date().toISOString().slice(0,10);
 const now=Date.now();
 const reviewDue=(card:Item)=>{
  const record=history[card.id];if(!record)return true;
  const correct=record.correct,wrong=record.wrong;
  const days=correct===0?0:wrong>=correct?1:correct===1?1:correct===2?3:correct===3?7:14;
  const last=Date.parse(record.last);return !Number.isFinite(last)||last+days*86400000<=now;
 };
 const dueTotal=items.filter(reviewDue).length;
 const pool=items.filter(item=>item.kind===mode&&(lessonFilter==="all"||item.id.includes(":"+lessonFilter+":"))&&(!dailyOnly||!history[item.id]?.last.startsWith(today))&&(!mistakesOnly||(history[item.id]?.wrong??0)>0)&&(!reviewMode||reviewDue(item))).sort((a,b)=>{
 const x=history[a.id],y=history[b.id];
 const priority=(h:typeof x)=>h?(h.wrong>h.correct?0:h.correct===0?1:h.wrong>0?2:3):-1;
 return priority(x)-priority(y)||a.id.localeCompare(b.id);
 });
 const item=pool.find(card=>card.id===queue[0])??pool[index%pool.length];
 const alternatives=item?items.filter(card=>card.kind===item.kind&&card.id!==item.id&&card.answer!==item.answer).slice(0,3):[];
 const choices=item?[item,...alternatives].sort((a,b)=>a.answer.localeCompare(b.answer,"ja")).map(card=>card.answer):[];
 function reset(){setAnswer("");setRevealed(false);setHint(false);setMessage("");}
 function changeMode(next:Item["kind"]){setMode(next);setIndex(0);setQueue([]);reset();}
 async function check(){
 if(!item||busy||revealed)return;
 const correct=normalize(answer)===normalize(item.answer);
 const event:StudyEvent={id:crypto.randomUUID(),userId:owner,deviceId:"japanese-communication-local",occurredAt:new Date().toISOString(),
 activity:"lesson",primaryTarget:{kind:"can_do",id:"recall:"+item.id},skillDimension:(mode==="kana"||mode==="katakana")?"reading":"meaning_recognition",
 promptFamily:"a1-recall-"+mode,responseMode:"typed",result:correct?"correct":"incorrect",attempts:1,
 sourceId:SOURCE,contentVersion:"1",contextId:item.context,metadata:{recallId:item.id,schedulerExcluded:true}};
 setBusy(true);setMessage("");
 try{await saveStudyEvent(event);setHistory(previous=>{const old=previous[item.id]??{correct:0,wrong:0,last:""};return {...previous,[item.id]:{correct:old.correct+(correct?1:0),wrong:old.wrong+(correct?0:1),last:event.occurredAt}}});setRevealed(true);if(!correct)setQueue(previous=>previous.includes(item.id)?previous:[...previous,item.id]);}
 catch{setMessage("Antwort konnte nicht gespeichert werden.");}finally{setBusy(false);}
 }
 function next(){if(queue[0]===item?.id)setQueue(previous=>previous.slice(1));setIndex(0);setSession(value=>value+1);reset();}
 return <section aria-labelledby="a1-recall-title" className="j4-practice a1-recall-shell">
 <h2 id="a1-recall-title">A1 · Aktives Wiederholen</h2>
 <p>Schriftzeichen, Wörter und Sätze selbst abrufen. Fehlerhafte und neue Karten erscheinen zuerst; Ergebnisse werden lokal pro Lernkonto gespeichert.</p>
 <fieldset><legend>Übungsmodus</legend>
 {(["kana","katakana","vocabulary","reverse","context"] as const).map(value=><label key={value} style={{marginRight:"1rem"}}><input type="radio" name="a1-recall-mode" checked={mode===value} onChange={()=>changeMode(value)}/>{value==="kana"?"Hiragana":value==="katakana"?"Katakana":value==="vocabulary"?"Wortschatz":value==="reverse"?"Deutsch → Japanisch":"Sätze verstehen"}</label>)}
 </fieldset>
 <label><input type="checkbox" checked={reviewMode} onChange={event=>{setReviewMode(event.target.checked);setIndex(0);setQueue([]);reset();}}/> Fällige Wiederholungen</label>
 <label><input type="checkbox" checked={mistakesOnly} onChange={event=>{setMistakesOnly(event.target.checked);setIndex(0);reset();}}/> Fehler gezielt wiederholen</label>
 <label><input type="checkbox" checked={dailyOnly} onChange={event=>{setDailyOnly(event.target.checked);setIndex(0);reset();}}/> Heute noch nicht geübt</label>
 {(mode==="vocabulary"||mode==="reverse"||mode==="context")?<label> Lektion <select value={lessonFilter} onChange={event=>{setLessonFilter(event.target.value);setIndex(0);reset();}}><option value="all">Alle Lektionen</option>{a1CommunicationLessons.map(lesson=><option key={lesson.id} value={lesson.id}>{lesson.title}</option>)}</select></label>:null}
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
