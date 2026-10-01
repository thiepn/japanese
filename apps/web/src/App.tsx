import { useEffect,useState } from "react";
import type { SearchResult } from "@thiepn/search";
import type { StudyStep } from "@thiepn/study-player";
import { searchLocalJapanese } from "./content";
import { BASIC_HIRAGANA_TOTAL,foundationGroups } from "./study/foundationPrompts";
import { StudyPlayer,type StudyAnswer } from "./study/StudyPlayer";
import { buildFoundationQueue,getFoundationStudySummary,recordStudyAnswer } from "./study/runtime";

type Surface="Today"|"Learn"|"Immerse"|"Library"|"Progress";
type StudySummary={due:number;newItems:number;application:number;learned:number;total:number;memoryTraces:number};

export function App(){
  const [surface,setSurface]=useState<Surface>("Today");const [query,setQuery]=useState("");const [results,setResults]=useState<SearchResult[]>([]);
  const [libraryStatus,setLibraryStatus]=useState<"idle"|"loading"|"ready"|"error">("idle");const [session,setSession]=useState<StudyStep[]|null>(null);
  const [sessionStatus,setSessionStatus]=useState<"idle"|"loading"|"error">("idle");
  const [summary,setSummary]=useState<StudySummary>({due:0,newItems:5,application:0,learned:0,total:BASIC_HIRAGANA_TOTAL+2,memoryTraces:0});
  const [completedToday,setCompletedToday]=useState(0);
  useEffect(()=>{void refreshSummary();},[]);
  useEffect(()=>{if(surface!=="Library")return;let cancelled=false;setLibraryStatus("loading");searchLocalJapanese(query).then((next)=>{if(!cancelled){setResults(next);setLibraryStatus("ready");}}).catch(()=>{if(!cancelled){setResults([]);setLibraryStatus("error");}});return()=>{cancelled=true;};},[query,surface]);
  async function refreshSummary(){try{setSummary(await getFoundationStudySummary());}catch{/* storage unavailable */}}
  async function startFoundationStudy(){setSessionStatus("loading");try{const queue=await buildFoundationQueue();setSession(queue.length?queue:null);setSessionStatus("idle");}catch{setSessionStatus("error");}}
  async function handleAnswer(answer:StudyAnswer){await recordStudyAnswer({prompt:answer.prompt,response:answer.response,result:answer.grade.result,responseTimeMs:answer.responseTimeMs});setCompletedToday((v)=>v+1);}
  function finishSession(){setSession(null);void refreshSummary();}
  if(session)return <div className="study-shell"><StudyPlayer steps={session} onAnswer={handleAnswer} onComplete={finishSession} onExit={finishSession}/></div>;
  return <div className="app-shell"><header className="topbar"><div><strong>Japanese</strong><span className="phase">P1 learning engine</span></div><button className="quiet-button" type="button">Account</button></header><main className="content">
    {surface==="Today"&&<Today summary={summary} completedToday={completedToday} status={sessionStatus} onStart={()=>void startFoundationStudy()}/>} 
    {surface==="Learn"&&<Learn summary={summary} status={sessionStatus} onStart={()=>void startFoundationStudy()}/>} 
    {surface==="Immerse"&&<Placeholder title="Immerse" body="Reading and listening will enter the same learner model after the foundation Study Player is stable."/>}
    {surface==="Progress"&&<Progress summary={summary} completedToday={completedToday}/>} 
    {surface==="Library"&&<section className="library"><p className="eyebrow">LIBRARY</p><h1>Search Japanese</h1><input aria-label="Search Japanese" value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="食べる, たべる, eat…"/>{libraryStatus==="loading"&&<p className="muted" role="status">Searching local Japanese content…</p>}{libraryStatus==="error"&&<p role="status">Local content database is unavailable in this browser.</p>}<div className="results">{results.map((item)=><article className="result-card" key={`${item.entity.kind}:${item.entity.id}`}><strong lang="ja">{item.title}</strong><span>{item.subtitle}</span></article>)}</div></section>}
  </main><nav className="nav" aria-label="Primary">{(["Today","Learn","Immerse","Library","Progress"] as Surface[]).map((item)=><button key={item} className={surface===item?"active":""} onClick={()=>setSurface(item)} type="button">{item}</button>)}</nav></div>;
}

function Today({summary,completedToday,status,onStart}:{summary:StudySummary;completedToday:number;status:string;onStart:()=>void}){
  const remaining=summary.due+summary.newItems+summary.application;
  return <section className="dashboard"><p className="eyebrow">TODAY</p><h1>{remaining?"Continue Japanese":"You’re caught up"}</h1><p className="lead">Today mixes due memory reviews, a small amount of new material, and reverse-cue practice once a kana has been introduced.</p><div className="stat-row"><Stat value={summary.due} label="Due"/><Stat value={summary.newItems} label="New"/><Stat value={summary.application} label="Apply"/></div><p className="session-note">{completedToday} answers recorded this session.</p><button className="primary" disabled={status==="loading"} onClick={onStart} type="button">{status==="loading"?"Preparing…":remaining?"Continue study":"Review foundation"}</button>{status==="error"&&<p className="error-text" role="status">Could not open local study data. Reload and try again.</p>}</section>;
}

function Learn({summary,status,onStart}:{summary:StudySummary;status:string;onStart:()=>void}){const progress=summary.total?Math.round((summary.learned/summary.total)*100):0;return <section className="dashboard"><p className="eyebrow">LEARN</p><h1>Foundation</h1><p className="lead">Learn the basic 46 hiragana in ordered batches with short explanations and early real-word bridges. Reverse-cue practice appears automatically after recognition evidence exists.</p><article className="course-card"><div><span className="course-kicker">FOUNDATION PATH</span><h2>Basic hiragana</h2><p>{foundationGroups.map((group)=>group.label).join(" · ")}</p></div><div className="course-progress"><strong>{progress}%</strong><span>{summary.learned} / {summary.total} learning items</span></div></article><button className="primary" disabled={status==="loading"} onClick={onStart} type="button">{summary.learned?"Continue foundation":"Start foundation"}</button></section>;}
function Progress({summary,completedToday}:{summary:StudySummary;completedToday:number}){return <section className="dashboard"><p className="eyebrow">PROGRESS</p><h1>Your Japanese</h1><p className="lead">Recognition and reverse-cue practice create separate memory traces, so “seen once” is not treated as full knowledge.</p><div className="stat-row"><Stat value={summary.learned} label="Learning items"/><Stat value={summary.memoryTraces} label="Memory traces"/><Stat value={summary.due} label="Due now"/></div><p className="session-note">{completedToday} answers recorded this session.</p></section>;}
function Stat({value,label}:{value:number;label:string}){return <div className="stat"><strong>{value}</strong><span>{label}</span></div>;}
function Placeholder({title,body}:{title:string;body:string}){return <section className="hero"><p className="eyebrow">{title.toUpperCase()}</p><h1>{title}</h1><p>{body}</p></section>;}
