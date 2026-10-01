import { useEffect,useState } from "react";
import { getDefaultAudioProvider } from "@thiepn/audio";
import type { SearchResult } from "@thiepn/search";
import { isStudyLesson,type StudyStep } from "@thiepn/study-player";
import { searchLocalJapanese } from "./content";
import { foundationSections } from "./study/foundationPrompts";
import { StudyPlayer,type StudyAnswer } from "./study/StudyPlayer";
import { buildTodayQueue,getKanaMasterySummary,getStudySummary,getVocabularyMasterySummary,recordStudyAnswer,type KanaMasterySummary,type StudySummary,type VocabularyMasterySummary } from "./study/runtime";

type Surface="Today"|"Learn"|"Immerse"|"Library"|"Progress";
const EMPTY_SUMMARY:StudySummary={due:0,newKana:5,newVocabulary:2,listening:0,application:0,learnedKana:0,totalKana:217,learnedVocabulary:0,totalVocabulary:34,memoryTraces:0};
const EMPTY_KANA:KanaMasterySummary={overall:0,hiragana:0,katakana:0,recognition:0,readingRecall:0,formSelection:0,listening:0,confidence:0,accuracy:0,matureSkills:0,expectedSkills:0,evidenceCount:0};
const EMPTY_VOCAB:VocabularyMasterySummary={overall:0,meaning:0,reading:0,listening:0,activeUse:0,confidence:0,accuracy:0,matureSkills:0,expectedSkills:0,evidenceCount:0};

export function App(){
  const [surface,setSurface]=useState<Surface>("Today");
  const [query,setQuery]=useState("");
  const [results,setResults]=useState<SearchResult[]>([]);
  const [libraryStatus,setLibraryStatus]=useState<"idle"|"loading"|"ready"|"error">("idle");
  const [session,setSession]=useState<StudyStep[]|null>(null);
  const [sessionStatus,setSessionStatus]=useState<"idle"|"loading"|"error">("idle");
  const [summary,setSummary]=useState<StudySummary>(EMPTY_SUMMARY);
  const [kanaMastery,setKanaMastery]=useState<KanaMasterySummary>(EMPTY_KANA);
  const [vocabMastery,setVocabMastery]=useState<VocabularyMasterySummary>(EMPTY_VOCAB);
  const [completedToday,setCompletedToday]=useState(0);

  useEffect(()=>{void refreshDashboard();},[]);
  useEffect(()=>{
    if(surface!=="Library")return;
    let cancelled=false;setLibraryStatus("loading");
    searchLocalJapanese(query).then((next)=>{if(!cancelled){setResults(next);setLibraryStatus("ready");}}).catch(()=>{if(!cancelled){setResults([]);setLibraryStatus("error");}});
    return()=>{cancelled=true;};
  },[query,surface]);

  async function refreshDashboard(){
    try{
      const [nextSummary,nextKana,nextVocab]=await Promise.all([getStudySummary(),getKanaMasterySummary(),getVocabularyMasterySummary()]);
      setSummary(nextSummary);setKanaMastery(nextKana);setVocabMastery(nextVocab);
    }catch{/* local storage can be unavailable in hardened browsers */}
  }

  async function startStudy(){
    setSessionStatus("loading");
    try{
      const queue=await buildTodayQueue();
      const audio=queue.filter((step)=>!isStudyLesson(step)&&Boolean(step.audio)).flatMap((step)=>isStudyLesson(step)||!step.audio?[]:[step.audio]);
      if(audio.length)void getDefaultAudioProvider().prefetch(audio);
      setSession(queue.length?queue:null);setSessionStatus("idle");
    }catch{setSessionStatus("error");}
  }

  async function handleAnswer(answer:StudyAnswer){await recordStudyAnswer({prompt:answer.prompt,response:answer.response,result:answer.grade.result,responseTimeMs:answer.responseTimeMs});setCompletedToday((value)=>value+1);}
  function finishSession(){setSession(null);void refreshDashboard();}

  if(session)return <div className="study-shell"><StudyPlayer steps={session} onAnswer={handleAnswer} onComplete={finishSession} onExit={finishSession}/></div>;

  return <div className="app-shell">
    <header className="topbar"><div><strong>Japanese</strong><span className="phase">P1.5 audio + mobile</span></div><button className="quiet-button account-button" type="button">Account</button></header>
    <main className="content">
      {surface==="Today"&&<Today summary={summary} completedToday={completedToday} status={sessionStatus} onStart={()=>void startStudy()}/>}
      {surface==="Learn"&&<Learn summary={summary} kana={kanaMastery} vocab={vocabMastery} status={sessionStatus} onStart={()=>void startStudy()}/>}
      {surface==="Immerse"&&<Placeholder title="Immerse" body="The listening engine now writes into the shared learner model. Longer reading and connected-speech immersion arrive after the Foundation loop is certified."/>}
      {surface==="Progress"&&<Progress kana={kanaMastery} vocab={vocabMastery} summary={summary} completedToday={completedToday}/>}
      {surface==="Library"&&<Library query={query} setQuery={setQuery} results={results} status={libraryStatus}/>}
    </main>
    <nav className="nav" aria-label="Primary">{(["Today","Learn","Immerse","Library","Progress"] as Surface[]).map((item)=><button key={item} className={surface===item?"active":""} onClick={()=>setSurface(item)} type="button">{item}</button>)}</nav>
  </div>;
}

function Today({summary,completedToday,status,onStart}:{summary:StudySummary;completedToday:number;status:string;onStart:()=>void}){
  const remaining=summary.due+summary.newKana+summary.newVocabulary+summary.listening+summary.application;
  return <section className="dashboard"><p className="eyebrow">TODAY</p><h1>{remaining?"Continue Japanese":"You’re caught up"}</h1><p className="lead">One queue protects due reviews, introduces a bounded amount of new material, and mixes listening with reading and recall only when its prerequisites are ready.</p>
    <div className="stat-row five"><Stat value={summary.due} label="Due"/><Stat value={summary.newKana} label="New kana"/><Stat value={summary.newVocabulary} label="New words"/><Stat value={summary.listening} label="Listening"/><Stat value={summary.application} label="Practice"/></div>
    <p className="session-note">{completedToday} answers recorded this session.</p>
    <button className="primary" disabled={status==="loading"} onClick={onStart} type="button">{status==="loading"?"Preparing…":remaining?"Continue study":"Review anyway"}</button>
    {status==="error"&&<p className="error-text" role="status">Could not open local study data. Reload and try again.</p>}</section>;
}

function Learn({summary,kana,vocab,status,onStart}:{summary:StudySummary;kana:KanaMasterySummary;vocab:VocabularyMasterySummary;status:string;onStart:()=>void}){
  const kanaCoverage=summary.totalKana?Math.round(summary.learnedKana/summary.totalKana*100):0;
  const vocabCoverage=summary.totalVocabulary?Math.round(summary.learnedVocabulary/summary.totalVocabulary*100):0;
  return <section className="dashboard"><p className="eyebrow">LEARN</p><h1>Foundation Japanese</h1><p className="lead">Script, words and sound now share one learning path. Recorded native audio appears only after enough meaning knowledge exists for the listening task to measure listening rather than guessing.</p>
    <div className="course-stack">
      <article className="course-card"><div><span className="course-kicker">SCRIPT FOUNDATION</span><h2>Kana</h2><p>{foundationSections.map((section)=>section.label).join(" · ")}</p></div><div className="course-progress"><strong>{kanaCoverage}%</strong><span>{summary.learnedKana} / {summary.totalKana} introduced</span></div></article>
      <article className="course-card"><div><span className="course-kicker">STARTER LEXICON</span><h2>Useful words + kanji in context</h2><p>Meaning · reading · listening · active recall</p></div><div className="course-progress"><strong>{vocabCoverage}%</strong><span>{summary.learnedVocabulary} / {summary.totalVocabulary} words introduced</span></div></article>
      <article className="course-card"><div><span className="course-kicker">SOUND FOUNDATION</span><h2>Native listening + mora timing</h2><p>Word recognition · vowel length · small っ · moraic ん · replay · slow playback · shadowing</p><p className="credit-note">Pronunciation recordings: Tofugu/WaniKani, CC BY-SA 4.0.</p></div><div className="course-progress"><strong>{percent((kana.listening+vocab.listening)/2)}</strong><span>listening mastery</span></div></article>
    </div>
    <div className="mastery-grid"><MasteryBar label="Kana durable mastery" value={kana.overall}/><MasteryBar label="Vocabulary durable mastery" value={vocab.overall}/></div>
    <button className="primary" disabled={status==="loading"} onClick={onStart} type="button">{summary.learnedKana+summary.learnedVocabulary?"Continue learning":"Start learning"}</button>
  </section>;
}

function Progress({kana,vocab,summary,completedToday}:{kana:KanaMasterySummary;vocab:VocabularyMasterySummary;summary:StudySummary;completedToday:number}){
  return <section className="dashboard"><p className="eyebrow">PROGRESS</p><h1>Real mastery</h1><p className="lead">Written recognition, reading recall, listening and production remain independent evidence dimensions. Hearing a word correctly no longer inherits mastery from seeing it correctly.</p>
    <section className="mastery-section"><div className="section-heading"><div><span className="course-kicker">KANA + SOUND</span><h2>Script and perception</h2></div><strong>{percent(kana.overall)}</strong></div><div className="mastery-grid"><MasteryBar label="Hiragana" value={kana.hiragana}/><MasteryBar label="Katakana" value={kana.katakana}/><MasteryBar label="Recognition" value={kana.recognition}/><MasteryBar label="Typed reading" value={kana.readingRecall}/><MasteryBar label="Form selection" value={kana.formSelection}/><MasteryBar label="Mora listening" value={kana.listening}/><MasteryBar label="Model confidence" value={kana.confidence}/></div></section>
    <section className="mastery-section"><div className="section-heading"><div><span className="course-kicker">VOCABULARY</span><h2>Word mastery</h2></div><strong>{percent(vocab.overall)}</strong></div><div className="mastery-grid"><MasteryBar label="Meaning recognition" value={vocab.meaning}/><MasteryBar label="Reading recall" value={vocab.reading}/><MasteryBar label="Listening recognition" value={vocab.listening}/><MasteryBar label="Active use" value={vocab.activeUse}/><MasteryBar label="Model confidence" value={vocab.confidence}/></div></section>
    <div className="stat-row"><Stat value={kana.evidenceCount+vocab.evidenceCount} label="Graded answers"/><Stat value={vocab.matureSkills} label="Mature word skills"/><Stat value={summary.due} label="Due now"/></div>
    <p className="session-note">{completedToday} answers recorded in this open session.</p>
  </section>;
}

function Library({query,setQuery,results,status}:{query:string;setQuery:(value:string)=>void;results:SearchResult[];status:string}){
  return <section className="library"><p className="eyebrow">LIBRARY</p><h1>Japanese knowledge</h1><p className="lead">Search the canonical local content database by Japanese form, reading, meaning, or kanji meaning.</p><input aria-label="Search Japanese" value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="食べる, たべる, eat…"/>{status==="loading"&&<p className="muted" role="status">Searching local Japanese content…</p>}{status==="error"&&<p role="status">Local content database is unavailable in this browser.</p>}<div className="results">{results.map((item)=><article className="result-card" key={`${item.entity.kind}:${item.entity.id}`}><strong lang="ja">{item.title}</strong><span>{item.subtitle}</span></article>)}</div></section>;
}

function MasteryBar({label,value}:{label:string;value:number}){const pct=Math.round(value*100);return <div className="mastery-row"><div><span>{label}</span><strong>{pct}%</strong></div><div className="meter" aria-label={`${label} ${pct}%`}><span style={{width:`${pct}%`}}/></div></div>;}
function Stat({value,label}:{value:number|string;label:string}){return <div className="stat"><strong>{value}</strong><span>{label}</span></div>;}
function Placeholder({title,body}:{title:string;body:string}){return <section className="hero"><p className="eyebrow">{title.toUpperCase()}</p><h1>{title}</h1><p>{body}</p></section>;}
function percent(value:number):string{return `${Math.round(value*100)}%`;}
