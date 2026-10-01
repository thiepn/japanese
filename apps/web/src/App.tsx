import { useEffect,useState } from "react";
import { getDefaultAudioProvider } from "@thiepn/audio";
import type { SearchResult } from "@thiepn/search";
import { isStudyLesson,type StudyStep } from "@thiepn/study-player";
import { searchLocalJapanese } from "./content";
import { foundationSections } from "./study/foundationPrompts";
import { StudyPlayer,type StudyAnswer } from "./study/StudyPlayer";
import {
  buildCourseUnitSession,buildTodayQueue,getCourseProgress,getGrammarMasterySummary,getKanaMasterySummary,getSentenceMasterySummary,getStudySummary,getVocabularyMasterySummary,recordStudyAnswer,
  type CourseUnitProgress,type GrammarMasterySummary,type KanaMasterySummary,type SentenceMasterySummary,type StudySummary,type VocabularyMasterySummary
} from "./study/runtime";

type Surface="Today"|"Learn"|"Immerse"|"Library"|"Progress";
const EMPTY_SUMMARY:StudySummary={due:0,newKana:5,newVocabulary:2,listening:0,application:0,course:0,learnedKana:0,totalKana:217,learnedVocabulary:0,totalVocabulary:36,memoryTraces:0};
const EMPTY_KANA:KanaMasterySummary={overall:0,hiragana:0,katakana:0,recognition:0,readingRecall:0,formSelection:0,listening:0,confidence:0,accuracy:0,matureSkills:0,expectedSkills:0,evidenceCount:0};
const EMPTY_VOCAB:VocabularyMasterySummary={overall:0,meaning:0,reading:0,listening:0,activeUse:0,confidence:0,accuracy:0,matureSkills:0,expectedSkills:0,evidenceCount:0};
const EMPTY_GRAMMAR:GrammarMasterySummary={overall:0,comprehension:0,formSelection:0,confidence:0,accuracy:0,matureSkills:0,expectedSkills:0,evidenceCount:0};
const EMPTY_SENTENCE:SentenceMasterySummary={overall:0,comprehension:0,production:0,confidence:0,accuracy:0,matureSkills:0,expectedSkills:0,evidenceCount:0};

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
  const [grammarMastery,setGrammarMastery]=useState<GrammarMasterySummary>(EMPTY_GRAMMAR);
  const [sentenceMastery,setSentenceMastery]=useState<SentenceMasterySummary>(EMPTY_SENTENCE);
  const [courseProgress,setCourseProgress]=useState<CourseUnitProgress[]>([]);
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
      const [nextSummary,nextKana,nextVocab,nextGrammar,nextSentence,nextCourse]=await Promise.all([
        getStudySummary(),getKanaMasterySummary(),getVocabularyMasterySummary(),getGrammarMasterySummary(),getSentenceMasterySummary(),getCourseProgress()
      ]);
      setSummary(nextSummary);setKanaMastery(nextKana);setVocabMastery(nextVocab);setGrammarMastery(nextGrammar);setSentenceMastery(nextSentence);setCourseProgress(nextCourse);
    }catch{/* local storage can be unavailable in hardened browsers */}
  }

  function openSession(queue:StudyStep[]){
    const audio=queue.filter((step)=>Boolean(step.audio)).flatMap((step)=>step.audio?[step.audio]:[]);
    if(audio.length)void getDefaultAudioProvider().prefetch(audio);
    setSession(queue.length?queue:null);
  }

  async function startStudy(){
    setSessionStatus("loading");
    try{openSession(await buildTodayQueue());setSessionStatus("idle");}catch{setSessionStatus("error");}
  }
  async function startCourseUnit(unitId:string){
    setSessionStatus("loading");
    try{openSession(await buildCourseUnitSession(unitId));setSessionStatus("idle");}catch{setSessionStatus("error");}
  }

  async function handleAnswer(answer:StudyAnswer){
    await recordStudyAnswer({prompt:answer.prompt,response:answer.response,result:answer.grade.result,responseTimeMs:answer.responseTimeMs});
    setCompletedToday((value)=>value+1);
  }
  function finishSession(){setSession(null);void refreshDashboard();}

  if(session)return <div className="study-shell"><StudyPlayer steps={session} onAnswer={handleAnswer} onComplete={finishSession} onExit={finishSession}/></div>;

  return <div className="app-shell">
    <header className="topbar"><div><strong>Japanese</strong><span className="phase">P2 grammar + sentences</span></div><button className="quiet-button account-button" type="button">Account</button></header>
    <main className="content">
      {surface==="Today"&&<Today summary={summary} completedToday={completedToday} status={sessionStatus} onStart={()=>void startStudy()}/>}
      {surface==="Learn"&&<Learn summary={summary} kana={kanaMastery} vocab={vocabMastery} grammar={grammarMastery} sentence={sentenceMastery} course={courseProgress} status={sessionStatus} onStart={()=>void startStudy()} onStartUnit={(id)=>void startCourseUnit(id)}/>}
      {surface==="Immerse"&&<Placeholder title="Immerse" body="Sentence knowledge is now canonical and linked to vocabulary and grammar. P3 can build reading and connected listening on those same sentence/entity relationships instead of creating another progress system."/>}
      {surface==="Progress"&&<Progress kana={kanaMastery} vocab={vocabMastery} grammar={grammarMastery} sentence={sentenceMastery} summary={summary} course={courseProgress} completedToday={completedToday}/>}
      {surface==="Library"&&<Library query={query} setQuery={setQuery} results={results} status={libraryStatus}/>}
    </main>
    <nav className="nav" aria-label="Primary">{(["Today","Learn","Immerse","Library","Progress"] as Surface[]).map((item)=><button key={item} className={surface===item?"active":""} onClick={()=>setSurface(item)} type="button">{item}</button>)}</nav>
  </div>;
}

function Today({summary,completedToday,status,onStart}:{summary:StudySummary;completedToday:number;status:string;onStart:()=>void}){
  const remaining=summary.due+summary.newKana+summary.newVocabulary+summary.listening+summary.application+summary.course;
  return <section className="dashboard"><p className="eyebrow">TODAY</p><h1>{remaining?"Continue Japanese":"You’re caught up"}</h1>
    <p className="lead">One queue now combines memory reviews, Foundation skills and the current A1 capability path. Grammar enters through meaning and sentence context instead of living in a separate grammar app.</p>
    <div className="stat-row six"><Stat value={summary.due} label="Due"/><Stat value={summary.newKana} label="New kana"/><Stat value={summary.newVocabulary} label="New words"/><Stat value={summary.listening} label="Listening"/><Stat value={summary.course} label="A1 course"/><Stat value={summary.application} label="Practice"/></div>
    <p className="session-note">{completedToday} answers recorded this session.</p>
    <button className="primary" disabled={status==="loading"} onClick={onStart} type="button">{status==="loading"?"Preparing…":remaining?"Continue study":"Review anyway"}</button>
    {status==="error"&&<p className="error-text" role="status">Could not open local study data. Reload and try again.</p>}
  </section>;
}

function Learn({summary,kana,vocab,grammar,sentence,course,status,onStart,onStartUnit}:{summary:StudySummary;kana:KanaMasterySummary;vocab:VocabularyMasterySummary;grammar:GrammarMasterySummary;sentence:SentenceMasterySummary;course:CourseUnitProgress[];status:string;onStart:()=>void;onStartUnit:(id:string)=>void}){
  const kanaCoverage=summary.totalKana?Math.round(summary.learnedKana/summary.totalKana*100):0;
  const vocabCoverage=summary.totalVocabulary?Math.round(summary.learnedVocabulary/summary.totalVocabulary*100):0;
  return <section className="dashboard learn-page"><p className="eyebrow">LEARN</p><h1>Foundation → A1</h1>
    <p className="lead">The course is capability-centered. Each unit teaches reusable grammar concepts, applies them in canonical sentences, and writes every answer into the same learner model used by reviews and future immersion.</p>
    <div className="course-stack foundation-stack">
      <article className="course-card"><div><span className="course-kicker">SCRIPT FOUNDATION</span><h2>Kana</h2><p>{foundationSections.map((section)=>section.label).join(" · ")}</p></div><div className="course-progress"><strong>{kanaCoverage}%</strong><span>{summary.learnedKana} / {summary.totalKana} introduced</span></div></article>
      <article className="course-card"><div><span className="course-kicker">STARTER LEXICON</span><h2>Useful words + kanji in context</h2><p>Meaning · reading · listening · active recall</p></div><div className="course-progress"><strong>{vocabCoverage}%</strong><span>{summary.learnedVocabulary} / {summary.totalVocabulary} words introduced</span></div></article>
    </div>

    <section className="course-section">
      <div className="section-heading"><div><span className="course-kicker">STRUCTURED A1</span><h2>Capability course</h2></div><span className="course-count">{course.filter((unit)=>unit.status==="mastered").length} / {course.length} mastered</span></div>
      <div className="unit-list">
        {course.map((unit)=><article className={"unit-card "+unit.status} key={unit.id}>
          <div className="unit-index">{String(unit.order).padStart(2,"0")}</div>
          <div className="unit-copy"><div className="unit-title-row"><h3>{unit.title}</h3><span className={"status-pill "+unit.status}>{statusLabel(unit.status)}</span></div><p>{unit.canDo}</p><div className="unit-meter"><span style={{width:Math.round(unit.mastery*100)+"%"}}/></div><small>{Math.round(unit.mastery*100)}% durable mastery · {unit.evidenceCount} evidence</small></div>
          <button className="unit-action" disabled={status==="loading"} type="button" onClick={()=>onStartUnit(unit.id)}>{unit.status==="challenging"?"Study anyway":unit.status==="mastered"?"Review unit":unit.status==="learning"?"Continue unit":"Start unit"}</button>
        </article>)}
      </div>
      <p className="course-note">“Challenging” is advisory, not a hard lock. Prerequisites guide sequencing while free study remains available.</p>
    </section>

    <div className="mastery-grid four-skill">
      <MasteryBar label="Kana durable mastery" value={kana.overall}/>
      <MasteryBar label="Vocabulary durable mastery" value={vocab.overall}/>
      <MasteryBar label="Grammar durable mastery" value={grammar.overall}/>
      <MasteryBar label="Sentence durable mastery" value={sentence.overall}/>
    </div>
    <button className="primary" disabled={status==="loading"} onClick={onStart} type="button">Continue adaptive study</button>
  </section>;
}

function Progress({kana,vocab,grammar,sentence,summary,course,completedToday}:{kana:KanaMasterySummary;vocab:VocabularyMasterySummary;grammar:GrammarMasterySummary;sentence:SentenceMasterySummary;summary:StudySummary;course:CourseUnitProgress[];completedToday:number}){
  return <section className="dashboard"><p className="eyebrow">PROGRESS</p><h1>Real mastery</h1>
    <p className="lead">Course position is derived from evidence. Completing a lesson never marks its grammar or sentences as mastered; delayed retrieval and later use continue to change the same projections.</p>
    <section className="mastery-section"><div className="section-heading"><div><span className="course-kicker">KANA + SOUND</span><h2>Script and perception</h2></div><strong>{percent(kana.overall)}</strong></div><div className="mastery-grid"><MasteryBar label="Hiragana" value={kana.hiragana}/><MasteryBar label="Katakana" value={kana.katakana}/><MasteryBar label="Recognition" value={kana.recognition}/><MasteryBar label="Typed reading" value={kana.readingRecall}/><MasteryBar label="Mora listening" value={kana.listening}/><MasteryBar label="Model confidence" value={kana.confidence}/></div></section>
    <section className="mastery-section"><div className="section-heading"><div><span className="course-kicker">VOCABULARY</span><h2>Word mastery</h2></div><strong>{percent(vocab.overall)}</strong></div><div className="mastery-grid"><MasteryBar label="Meaning recognition" value={vocab.meaning}/><MasteryBar label="Reading recall" value={vocab.reading}/><MasteryBar label="Listening recognition" value={vocab.listening}/><MasteryBar label="Active use" value={vocab.activeUse}/><MasteryBar label="Model confidence" value={vocab.confidence}/></div></section>
    <section className="mastery-section"><div className="section-heading"><div><span className="course-kicker">GRAMMAR</span><h2>Concept + contextual form</h2></div><strong>{percent(grammar.overall)}</strong></div><div className="mastery-grid"><MasteryBar label="Function comprehension" value={grammar.comprehension}/><MasteryBar label="Contextual form selection" value={grammar.formSelection}/><MasteryBar label="Model confidence" value={grammar.confidence}/></div></section>
    <section className="mastery-section"><div className="section-heading"><div><span className="course-kicker">SENTENCES</span><h2>Connected knowledge</h2></div><strong>{percent(sentence.overall)}</strong></div><div className="mastery-grid"><MasteryBar label="Sentence comprehension" value={sentence.comprehension}/><MasteryBar label="Sentence production" value={sentence.production}/><MasteryBar label="Model confidence" value={sentence.confidence}/></div></section>
    <div className="stat-row four"><Stat value={kana.evidenceCount+vocab.evidenceCount+grammar.evidenceCount+sentence.evidenceCount} label="Graded answers"/><Stat value={course.filter((unit)=>unit.status==="mastered").length} label="A1 units mastered"/><Stat value={summary.due} label="Due now"/><Stat value={summary.memoryTraces} label="Memory traces"/></div>
    <p className="session-note">{completedToday} answers recorded in this open session.</p>
  </section>;
}

function Library({query,setQuery,results,status}:{query:string;setQuery:(value:string)=>void;results:SearchResult[];status:string}){
  return <section className="library"><p className="eyebrow">LIBRARY</p><h1>Japanese knowledge</h1><p className="lead">Search canonical words, kanji, grammar and sentences by Japanese form, reading or English meaning/function.</p>
    <input aria-label="Search Japanese" value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="食べる, たべる, eat, topic…"/>
    {status==="loading"&&<p className="muted" role="status">Searching local Japanese content…</p>}{status==="error"&&<p role="status">Local content database is unavailable in this browser.</p>}
    <div className="results">{results.map((item)=><article className={"result-card result-"+item.entity.kind} key={item.entity.kind+":"+item.entity.id}><div><small>{item.entity.kind}</small><strong lang="ja">{item.title}</strong></div><span>{item.subtitle}</span></article>)}</div>
  </section>;
}

function MasteryBar({label,value}:{label:string;value:number}){const pct=Math.round(value*100);return <div className="mastery-row"><div><span>{label}</span><strong>{pct}%</strong></div><div className="meter" aria-label={label+" "+pct+"%"}><span style={{width:pct+"%"}}/></div></div>;}
function Stat({value,label}:{value:number|string;label:string}){return <div className="stat"><strong>{value}</strong><span>{label}</span></div>;}
function Placeholder({title,body}:{title:string;body:string}){return <section className="hero"><p className="eyebrow">{title.toUpperCase()}</p><h1>{title}</h1><p>{body}</p></section>;}
function percent(value:number):string{return Math.round(value*100)+"%";}
function statusLabel(status:CourseUnitProgress["status"]):string{return status==="mastered"?"Mastered":status==="learning"?"Learning":status==="challenging"?"Challenging":"Ready";}
