import { useEffect,useState } from "react";
import type { SearchResult } from "@thiepn/search";
import type { StudyStep } from "@thiepn/study-player";
import { searchLocalJapanese } from "./content";
import { BASIC_HIRAGANA_TOTAL,BASIC_KATAKANA_TOTAL,foundationSections } from "./study/foundationPrompts";
import { StudyPlayer,type StudyAnswer } from "./study/StudyPlayer";
import { buildFoundationQueue,getFoundationMasterySummary,getFoundationStudySummary,recordStudyAnswer,type FoundationMasterySummary,type FoundationStudySummary } from "./study/runtime";

type Surface="Today"|"Learn"|"Immerse"|"Library"|"Progress";
const EMPTY_SUMMARY:FoundationStudySummary={due:0,newItems:5,application:0,learned:0,total:BASIC_HIRAGANA_TOTAL+BASIC_KATAKANA_TOTAL,memoryTraces:0};
const EMPTY_MASTERY:FoundationMasterySummary={overall:0,hiragana:0,katakana:0,recognition:0,readingRecall:0,formSelection:0,confidence:0,accuracy:0,matureSkills:0,expectedSkills:0,evidenceCount:0};

export function App(){
  const [surface,setSurface]=useState<Surface>("Today");
  const [query,setQuery]=useState("");
  const [results,setResults]=useState<SearchResult[]>([]);
  const [libraryStatus,setLibraryStatus]=useState<"idle"|"loading"|"ready"|"error">("idle");
  const [session,setSession]=useState<StudyStep[]|null>(null);
  const [sessionStatus,setSessionStatus]=useState<"idle"|"loading"|"error">("idle");
  const [summary,setSummary]=useState<FoundationStudySummary>(EMPTY_SUMMARY);
  const [mastery,setMastery]=useState<FoundationMasterySummary>(EMPTY_MASTERY);
  const [completedToday,setCompletedToday]=useState(0);

  useEffect(()=>{void refreshDashboard();},[]);
  useEffect(()=>{
    if(surface!=="Library")return;
    let cancelled=false;setLibraryStatus("loading");
    searchLocalJapanese(query).then((next)=>{if(!cancelled){setResults(next);setLibraryStatus("ready");}}).catch(()=>{if(!cancelled){setResults([]);setLibraryStatus("error");}});
    return()=>{cancelled=true;};
  },[query,surface]);

  async function refreshDashboard(){
    try{const [nextSummary,nextMastery]=await Promise.all([getFoundationStudySummary(),getFoundationMasterySummary()]);setSummary(nextSummary);setMastery(nextMastery);}catch{/* storage can be unavailable in hardened browsers */}
  }
  async function startFoundationStudy(){
    setSessionStatus("loading");
    try{const queue=await buildFoundationQueue();setSession(queue.length?queue:null);setSessionStatus("idle");}catch{setSessionStatus("error");}
  }
  async function handleAnswer(answer:StudyAnswer){await recordStudyAnswer({prompt:answer.prompt,response:answer.response,result:answer.grade.result,responseTimeMs:answer.responseTimeMs});setCompletedToday((v)=>v+1);}
  function finishSession(){setSession(null);void refreshDashboard();}

  if(session)return <div className="study-shell"><StudyPlayer steps={session} onAnswer={handleAnswer} onComplete={finishSession} onExit={finishSession}/></div>;

  return <div className="app-shell">
    <header className="topbar"><div><strong>Japanese</strong><span className="phase">P1.3 kana + mastery</span></div><button className="quiet-button" type="button">Account</button></header>
    <main className="content">
      {surface==="Today"&&<Today summary={summary} completedToday={completedToday} status={sessionStatus} onStart={()=>void startFoundationStudy()}/>} 
      {surface==="Learn"&&<Learn summary={summary} mastery={mastery} status={sessionStatus} onStart={()=>void startFoundationStudy()}/>} 
      {surface==="Immerse"&&<Placeholder title="Immerse" body="Reading and listening will enter the same learner model after the foundation Study Player is stable."/>}
      {surface==="Progress"&&<Progress mastery={mastery} summary={summary} completedToday={completedToday}/>} 
      {surface==="Library"&&<section className="library"><p className="eyebrow">LIBRARY</p><h1>Search Japanese</h1><input aria-label="Search Japanese" value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="食べる, たべる, eat…"/>{libraryStatus==="loading"&&<p className="muted" role="status">Searching local Japanese content…</p>}{libraryStatus==="error"&&<p role="status">Local content database is unavailable in this browser.</p>}<div className="results">{results.map((item)=><article className="result-card" key={`${item.entity.kind}:${item.entity.id}`}><strong lang="ja">{item.title}</strong><span>{item.subtitle}</span></article>)}</div></section>}
    </main>
    <nav className="nav" aria-label="Primary">{(["Today","Learn","Immerse","Library","Progress"] as Surface[]).map((item)=><button key={item} className={surface===item?"active":""} onClick={()=>setSurface(item)} type="button">{item}</button>)}</nav>
  </div>;
}

function Today({summary,completedToday,status,onStart}:{summary:FoundationStudySummary;completedToday:number;status:string;onStart:()=>void}){
  const remaining=summary.due+summary.newItems+summary.application;
  return <section className="dashboard"><p className="eyebrow">TODAY</p><h1>{remaining?"Continue Japanese":"You’re caught up"}</h1><p className="lead">A single queue now mixes due memory work, new kana, and recall/application practice. New material stays bounded even though the full kana foundation is available.</p>
    <div className="stat-row"><Stat value={summary.due} label="Due"/><Stat value={summary.newItems} label="New"/><Stat value={summary.application} label="Apply"/></div>
    <p className="session-note">{completedToday} answers recorded this session.</p>
    <button className="primary" disabled={status==="loading"} onClick={onStart} type="button">{status==="loading"?"Preparing…":remaining?"Continue study":"Review foundation"}</button>
    {status==="error"&&<p className="error-text" role="status">Could not open local study data. Reload and try again.</p>}</section>;
}

function Learn({summary,mastery,status,onStart}:{summary:FoundationStudySummary;mastery:FoundationMasterySummary;status:string;onStart:()=>void}){
  const coverage=summary.total?Math.round((summary.learned/summary.total)*100):0;
  return <section className="dashboard"><p className="eyebrow">LEARN</p><h1>Kana foundation</h1><p className="lead">The path covers basic hiragana and katakana, dakuten and handakuten, yōon, small っ / ッ, and the katakana long-vowel mark. Recognition, typed reading recall, and form selection are tracked separately.</p>
    <div className="course-card"><div><span className="course-kicker">FOUNDATION COVERAGE</span><h2>Complete kana system</h2><p>{foundationSections.map((section)=>`${section.label} · ${section.items}`).join("  ·  ")}</p></div><div className="course-progress"><strong>{coverage}%</strong><span>{summary.learned} / {summary.total} introduced</span></div></div>
    <MasteryBar label="Durable mastery" value={mastery.overall}/>
    <button className="primary" disabled={status==="loading"} onClick={onStart} type="button">{summary.learned?"Continue foundation":"Start foundation"}</button>
  </section>;
}

function Progress({mastery,summary,completedToday}:{mastery:FoundationMasterySummary;summary:FoundationStudySummary;completedToday:number}){
  return <section className="dashboard"><p className="eyebrow">PROGRESS</p><h1>Real mastery</h1><p className="lead">These percentages are projections from your actual answer evidence. Unseen skills count as zero, and recognition, reading recall, and form selection remain separate instead of collapsing “seen once” into “known.”</p>
    <div className="mastery-hero"><div><span>Overall kana mastery</span><strong>{percent(mastery.overall)}</strong></div><div><span>Mature skill traces</span><strong>{mastery.matureSkills} / {mastery.expectedSkills}</strong></div></div>
    <div className="mastery-grid"><MasteryBar label="Hiragana" value={mastery.hiragana}/><MasteryBar label="Katakana" value={mastery.katakana}/><MasteryBar label="Recognition" value={mastery.recognition}/><MasteryBar label="Typed reading recall" value={mastery.readingRecall}/><MasteryBar label="Form selection" value={mastery.formSelection}/><MasteryBar label="Model confidence" value={mastery.confidence}/></div>
    <div className="stat-row"><Stat value={mastery.evidenceCount} label="Graded answers"/><Stat value={percent(mastery.accuracy)} label="Accuracy"/><Stat value={summary.due} label="Due now"/></div>
    <p className="session-note">{completedToday} answers recorded in this open session.</p>
  </section>;
}

function MasteryBar({label,value}:{label:string;value:number}){const pct=Math.round(value*100);return <div className="mastery-row"><div><span>{label}</span><strong>{pct}%</strong></div><div className="meter" aria-label={`${label} ${pct}%`}><span style={{width:`${pct}%`}}/></div></div>;}
function Stat({value,label}:{value:number|string;label:string}){return <div className="stat"><strong>{value}</strong><span>{label}</span></div>;}
function Placeholder({title,body}:{title:string;body:string}){return <section className="hero"><p className="eyebrow">{title.toUpperCase()}</p><h1>{title}</h1><p>{body}</p></section>;}
function percent(value:number):string{return `${Math.round(value*100)}%`;}
