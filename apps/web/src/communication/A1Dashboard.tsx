import {useEffect,useState} from "react";
import {listStudyEvents} from "@thiepn/local-db";
import {a1CommunicationLessons} from "../../../../packages/a1-communication-seed/src/index";
import {getDevelopmentAccountId} from "../study/runtime";
import "./a1-mobile.css";

type Summary={lessons:number;correctExercises:number;totalExercises:number;roleplayCorrect:number;roleplayAttempts:number;roleplayMistakes:Record<string,number>;recallCorrect:number;recallWrong:number;recallDue:number;lastPractice:string};
const EMPTY:Summary={lessons:0,correctExercises:0,totalExercises:a1CommunicationLessons.reduce((n,l)=>n+l.exercises.length,0),roleplayCorrect:0,roleplayAttempts:0,roleplayMistakes:{},recallCorrect:0,recallWrong:0,recallDue:0,lastPractice:""};
export function A1Dashboard(){
 const owner=getDevelopmentAccountId();
 const [summary,setSummary]=useState<Summary>(EMPTY),[error,setError]=useState(""),[loading,setLoading]=useState(true);
 useEffect(()=>{let active=true;setLoading(true);setError("");setSummary(EMPTY);
 void listStudyEvents(owner).then(events=>{
  if(!active)return;
  const own=events.filter(e=>e.userId===owner);
  const successful=new Set<string>(),mistakes:Record<string,number>={},recall=new Map<string,{last:string;correct:number;wrong:number}>();
  let roleplayCorrect=0,roleplayAttempts=0,recallCorrect=0,recallWrong=0,lastPractice="";
  for(const event of own){
   if(!["original-a1-communication-v1","original-a1-roleplay-v1","original-a1-recall-v1"].includes(event.sourceId??""))continue;
   if(event.occurredAt>lastPractice)lastPractice=event.occurredAt;
   if(event.sourceId==="original-a1-communication-v1"&&event.result==="correct"&&typeof event.metadata?.exerciseId==="string")successful.add(event.metadata.exerciseId);
   if(event.sourceId==="original-a1-roleplay-v1"){
    roleplayAttempts++;if(event.result==="correct")roleplayCorrect++;
    else{const key=typeof event.metadata?.scenarioId==="string"?event.metadata.scenarioId:"unbekannt";mistakes[key]=(mistakes[key]??0)+1;}
   }
   if(event.sourceId==="original-a1-recall-v1"&&typeof event.metadata?.recallId==="string"){
    const key=event.metadata.recallId,old=recall.get(key)??{last:"",correct:0,wrong:0};
    if(event.result==="correct"){old.correct++;recallCorrect++;}else{old.wrong++;recallWrong++;}
    if(event.occurredAt>old.last)old.last=event.occurredAt;
    recall.set(key,old);
   }
  }
  const lessons=a1CommunicationLessons.filter(l=>l.exercises.every(e=>successful.has(e.id))).length;
  const now=Date.now();let due=0;
  for(const item of recall.values()){
   const days=item.correct===0?0:item.wrong>=item.correct?1:item.correct===1?1:item.correct===2?3:item.correct===3?7:14;
   if(!Number.isFinite(Date.parse(item.last))||Date.parse(item.last)+days*86400000<=now)due++;
  }
  setSummary({lessons,correctExercises:successful.size,totalExercises:EMPTY.totalExercises,roleplayCorrect,roleplayAttempts,roleplayMistakes:mistakes,recallCorrect,recallWrong,recallDue:due,lastPractice});
 }).catch(()=>{if(active)setError("Der A1-Fortschritt konnte nicht geladen werden.");}).finally(()=>{if(active)setLoading(false);});
 return()=>{active=false};},[owner]);
 const retry=Object.entries(summary.roleplayMistakes).sort((a,b)=>b[1]-a[1]).slice(0,3);
 return <section id="a1-dashboard" className="j4-practice a1-dashboard" aria-labelledby="a1-dashboard-title">
  <h2 id="a1-dashboard-title">A1 · Lernübersicht</h2>
  {loading?<p role="status">Lernverlauf wird geladen …</p>:null}
  {error?<p role="alert">{error}</p>:null}
  <div className="a1-dashboard-grid">
   <article><strong>{summary.lessons} / {a1CommunicationLessons.length}</strong><span>Lektionen mit allen Aufgaben richtig</span><progress value={summary.lessons} max={a1CommunicationLessons.length} aria-label="Abgeschlossene Lektionen"/></article>
   <article><strong>{summary.correctExercises} / {summary.totalExercises}</strong><span>Unterschiedliche Aufgaben richtig</span><progress value={summary.correctExercises} max={summary.totalExercises||1} aria-label="Aufgabenfortschritt"/></article>
   <article><strong>{summary.roleplayCorrect} / {summary.roleplayAttempts}</strong><span>Passende Gesprächsantworten</span></article>
   <article><strong>{summary.recallCorrect} richtig · {summary.recallWrong} Fehler</strong><span>Wiederholungsversuche · {summary.recallDue} bereits geübte Karten fällig</span></article>
  </div>
  {retry.length?<p>Gesprächssituationen zur Wiederholung: {retry.map(([name,count])=>name+" ("+count+" Fehler)").join(", ")}.</p>:<p>Noch keine Fehler in Gesprächssituationen gespeichert.</p>}
  {summary.lastPractice?<p>Letzte gespeicherte Übung: {new Date(summary.lastPractice).toLocaleString("de-DE")}</p>:null}
  <nav aria-label="A1-Lernweg" className="a1-dashboard-links"><a href="#a1-communication-title">1. Lektion lernen</a><a href="#a1-roleplay-title">2. Gespräch üben</a><a href="#a1-recall-title">3. Wiederholen</a></nav>
  <p><small>Die Übersicht basiert auf lokal gespeicherten Lernereignissen. Fällige Karten umfassen hier nur bereits geübte Karten; noch nicht eingeführte Karten werden nicht als fällig gezählt.</small></p>
 </section>;
}
