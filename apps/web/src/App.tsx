import { useEffect,useState } from "react";
import { getDefaultAudioProvider } from "@thiepn/audio";
import type { SearchResult } from "@thiepn/search";
import { isStudyLesson,type StudyStep } from "@thiepn/study-player";
import { searchLocalJapanese } from "./content";
import { foundationSections } from "./study/foundationPrompts";
import { Immersion } from "./immerse/Immersion";
import { StudyPlayer,type StudyAnswer } from "./study/StudyPlayer";
import {
  buildA1MilestoneSession,buildCourseUnitSession,buildTodayQueue,buildUnitAssessmentSession,getA1MilestoneAssessmentProgress,getConjugationMasterySummary,getCourseProgress,getGrammarMasterySummary,getKanaMasterySummary,getSentenceMasterySummary,getStudySummary,getVocabularyMasterySummary,recordStudyAnswer,
  type A1MilestoneProgress,type ConjugationMasterySummary,type CourseUnitProgress,type GrammarMasterySummary,type KanaMasterySummary,type SentenceMasterySummary,type StudySummary,type VocabularyMasterySummary
} from "./study/runtime";

type Surface="Today"|"Learn"|"Immerse"|"Library"|"Progress";
const EMPTY_SUMMARY:StudySummary={due:0,newKana:5,newVocabulary:2,listening:0,application:0,course:0,learnedKana:0,totalKana:217,learnedVocabulary:0,totalVocabulary:145,memoryTraces:0};
const EMPTY_KANA:KanaMasterySummary={overall:0,hiragana:0,katakana:0,recognition:0,readingRecall:0,formSelection:0,listening:0,confidence:0,accuracy:0,matureSkills:0,expectedSkills:0,evidenceCount:0};
const EMPTY_VOCAB:VocabularyMasterySummary={overall:0,meaning:0,reading:0,listening:0,activeUse:0,confidence:0,accuracy:0,matureSkills:0,expectedSkills:0,evidenceCount:0};
const EMPTY_CONJUGATION:ConjugationMasterySummary={overall:0,politeNegative:0,politePast:0,politePastNegative:0,teForm:0,confidence:0,accuracy:0,matureSkills:0,expectedSkills:0,evidenceCount:0};
const EMPTY_GRAMMAR:GrammarMasterySummary={overall:0,comprehension:0,formSelection:0,confidence:0,accuracy:0,matureSkills:0,expectedSkills:0,evidenceCount:0};
const EMPTY_MILESTONE:A1MilestoneProgress={complete:false,answered:0,total:15,scores:{
  reading:{activity:"reading",correct:0,answered:0,total:3,score:0},
  listening:{activity:"listening",correct:0,answered:0,total:3,score:0},
  spoken_interaction:{activity:"spoken_interaction",correct:0,answered:0,total:3,score:0},
  spoken_production:{activity:"spoken_production",correct:0,answered:0,total:3,score:0},
  writing:{activity:"writing",correct:0,answered:0,total:3,score:0}
}};
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
  const [conjugationMastery,setConjugationMastery]=useState<ConjugationMasterySummary>(EMPTY_CONJUGATION);
  const [grammarMastery,setGrammarMastery]=useState<GrammarMasterySummary>(EMPTY_GRAMMAR);
  const [sentenceMastery,setSentenceMastery]=useState<SentenceMasterySummary>(EMPTY_SENTENCE);
  const [courseProgress,setCourseProgress]=useState<CourseUnitProgress[]>([]);
  const [milestone,setMilestone]=useState<A1MilestoneProgress>(EMPTY_MILESTONE);
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
      const [nextSummary,nextKana,nextVocab,nextConjugation,nextGrammar,nextSentence,nextCourse,nextMilestone]=await Promise.all([
        getStudySummary(),getKanaMasterySummary(),getVocabularyMasterySummary(),getConjugationMasterySummary(),getGrammarMasterySummary(),getSentenceMasterySummary(),getCourseProgress(),getA1MilestoneAssessmentProgress()
      ]);
      setSummary(nextSummary);setKanaMastery(nextKana);setVocabMastery(nextVocab);setConjugationMastery(nextConjugation);setGrammarMastery(nextGrammar);setSentenceMastery(nextSentence);setCourseProgress(nextCourse);setMilestone(nextMilestone);
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
  async function startUnitAssessment(unitId:string){
    setSessionStatus("loading");
    try{openSession(await buildUnitAssessmentSession(unitId));setSessionStatus("idle");}catch{setSessionStatus("error");}
  }
  async function startMilestoneAssessment(){
    setSessionStatus("loading");
    try{openSession(await buildA1MilestoneSession());setSessionStatus("idle");}catch{setSessionStatus("error");}
  }

  async function handleAnswer(answer:StudyAnswer){
    await recordStudyAnswer({prompt:answer.prompt,response:answer.response,result:answer.grade.result,responseTimeMs:answer.responseTimeMs});
    setCompletedToday((value)=>value+1);
  }
  function finishSession(){setSession(null);void refreshDashboard();}

  if(session)return <div className="study-shell"><StudyPlayer steps={session} onAnswer={handleAnswer} onComplete={finishSession} onExit={finishSession}/></div>;

  return <div className="app-shell">
    <header className="topbar"><div><strong>Japanese</strong><span className="phase">P3 reader + connected listening</span></div><button className="quiet-button account-button" type="button">Account</button></header>
    <main className="content">
      {surface==="Today"&&<Today summary={summary} completedToday={completedToday} status={sessionStatus} onStart={()=>void startStudy()}/>}
      {surface==="Learn"&&<Learn summary={summary} kana={kanaMastery} vocab={vocabMastery} conjugation={conjugationMastery} grammar={grammarMastery} sentence={sentenceMastery} course={courseProgress} milestone={milestone} status={sessionStatus} onStart={()=>void startStudy()} onStartUnit={(id)=>void startCourseUnit(id)} onStartAssessment={(id)=>void startUnitAssessment(id)} onStartMilestone={()=>void startMilestoneAssessment()}/>} 
      {surface==="Immerse"&&<Immersion/>}
      {surface==="Progress"&&<Progress kana={kanaMastery} vocab={vocabMastery} conjugation={conjugationMastery} grammar={grammarMastery} sentence={sentenceMastery} milestone={milestone} summary={summary} course={courseProgress} completedToday={completedToday}/>} 
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

function Learn({summary,kana,vocab,conjugation,grammar,sentence,course,milestone,status,onStart,onStartUnit,onStartAssessment,onStartMilestone}:{summary:StudySummary;kana:KanaMasterySummary;vocab:VocabularyMasterySummary;conjugation:ConjugationMasterySummary;grammar:GrammarMasterySummary;sentence:SentenceMasterySummary;course:CourseUnitProgress[];milestone:A1MilestoneProgress;status:string;onStart:()=>void;onStartUnit:(id:string)=>void;onStartAssessment:(id:string)=>void;onStartMilestone:()=>void}){
  const kanaCoverage=summary.totalKana?Math.round(summary.learnedKana/summary.totalKana*100):0;
  const vocabCoverage=summary.totalVocabulary?Math.round(summary.learnedVocabulary/summary.totalVocabulary*100):0;
  return <section className="dashboard learn-page"><p className="eyebrow">LEARN</p><h1>Foundation → A1</h1>
    <p className="lead">The A1 path now combines broader everyday vocabulary, reusable grammar, generated conjugation practice, sentence transfer and delayed Can-do checks. All evidence stays in the same learner model.</p>
    <div className="course-stack foundation-stack">
      <article className="course-card"><div><span className="course-kicker">SCRIPT FOUNDATION</span><h2>Kana</h2><p>{foundationSections.map((section)=>section.label).join(" · ")}</p></div><div className="course-progress"><strong>{kanaCoverage}%</strong><span>{summary.learnedKana} / {summary.totalKana} introduced</span></div></article>
      <article className="course-card"><div><span className="course-kicker">A1 LEXICON</span><h2>Useful words + kanji in context</h2><p>Meaning · reading · listening · active recall</p></div><div className="course-progress"><strong>{vocabCoverage}%</strong><span>{summary.learnedVocabulary} / {summary.totalVocabulary} words introduced</span></div></article>
    </div>

    <section className="course-section">
      <div className="section-heading"><div><span className="course-kicker">STRUCTURED A1</span><h2>Capability course</h2></div><span className="course-count">{course.filter((unit)=>unit.status==="mastered").length} / {course.length} mastered</span></div>
      <div className="unit-list">
        {course.map((unit)=><article className={"unit-card "+unit.status} key={unit.id}>
          <div className="unit-index">{String(unit.order).padStart(2,"0")}</div>
          <div className="unit-copy">
            <div className="unit-title-row"><h3>{unit.title}</h3><span className={"status-pill "+unit.status}>{statusLabel(unit.status)}</span></div>
            <p>{unit.canDo}</p>
            <div className="unit-meter"><span style={{width:Math.round(unit.mastery*100)+"%"}}/></div>
            <small>{Math.round(unit.mastery*100)}% durable mastery · {unit.evidenceCount} evidence · {assessmentLabel(unit)}</small>
          </div>
          <div className="unit-actions">
            <button className="unit-action" disabled={status==="loading"} type="button" onClick={()=>onStartUnit(unit.id)}>{unit.status==="challenging"?"Study anyway":unit.status==="mastered"?"Review unit":unit.status==="learning"?"Continue unit":"Start unit"}</button>
            <button className="quiet-button assessment-action" disabled={status==="loading"||!assessmentCanStart(unit)} type="button" onClick={()=>onStartAssessment(unit.id)}>{assessmentActionLabel(unit)}</button>
          </div>
        </article>)}
      </div>
      <p className="course-note">Unit checks unlock 20 hours after the unit’s essential first-pass evidence is complete. “Challenging” remains advisory rather than a hard lock.</p>
    </section>

    <section className="mastery-section milestone-card">
      <div className="section-heading"><div><span className="course-kicker">A1 MILESTONE</span><h2>Five activity areas</h2></div><strong>{milestone.answered} / {milestone.total}</strong></div>
      <p>Reading, listening, spoken interaction, spoken production and writing are reported separately. The two spoken sections currently use say-then-type tasks and do not score pronunciation.</p>
      <div className="mastery-grid">
        <MasteryBar label="Reading" value={milestone.scores.reading.score}/>
        <MasteryBar label="Listening" value={milestone.scores.listening.score}/>
        <MasteryBar label="Spoken interaction" value={milestone.scores.spoken_interaction.score}/>
        <MasteryBar label="Spoken production" value={milestone.scores.spoken_production.score}/>
        <MasteryBar label="Writing" value={milestone.scores.writing.score}/>
      </div>
      <button className="primary" disabled={status==="loading"} onClick={onStartMilestone} type="button">{milestone.complete?"Retake A1 milestone":"Start A1 milestone"}</button>
    </section>

    <div className="mastery-grid four-skill">
      <MasteryBar label="Kana durable mastery" value={kana.overall}/>
      <MasteryBar label="Vocabulary durable mastery" value={vocab.overall}/>
      <MasteryBar label="Conjugation pattern mastery" value={conjugation.overall}/>
      <MasteryBar label="Grammar durable mastery" value={grammar.overall}/>
      <MasteryBar label="Sentence durable mastery" value={sentence.overall}/>
    </div>
    <button className="primary" disabled={status==="loading"} onClick={onStart} type="button">Continue adaptive study</button>
  </section>;
}

function Progress({kana,vocab,conjugation,grammar,sentence,milestone,summary,course,completedToday}:{kana:KanaMasterySummary;vocab:VocabularyMasterySummary;conjugation:ConjugationMasterySummary;grammar:GrammarMasterySummary;sentence:SentenceMasterySummary;milestone:A1MilestoneProgress;summary:StudySummary;course:CourseUnitProgress[];completedToday:number}){
  return <section className="dashboard"><p className="eyebrow">PROGRESS</p><h1>Real mastery</h1>
    <p className="lead">Course position is derived from evidence. Lesson exposure, delayed assessment and later retrieval remain distinct so recent familiarity does not automatically count as mastery.</p>
    <section className="mastery-section"><div className="section-heading"><div><span className="course-kicker">KANA + SOUND</span><h2>Script and perception</h2></div><strong>{percent(kana.overall)}</strong></div><div className="mastery-grid"><MasteryBar label="Hiragana" value={kana.hiragana}/><MasteryBar label="Katakana" value={kana.katakana}/><MasteryBar label="Recognition" value={kana.recognition}/><MasteryBar label="Typed reading" value={kana.readingRecall}/><MasteryBar label="Mora listening" value={kana.listening}/><MasteryBar label="Model confidence" value={kana.confidence}/></div></section>
    <section className="mastery-section"><div className="section-heading"><div><span className="course-kicker">VOCABULARY</span><h2>Word mastery</h2></div><strong>{percent(vocab.overall)}</strong></div><div className="mastery-grid"><MasteryBar label="Meaning recognition" value={vocab.meaning}/><MasteryBar label="Reading recall" value={vocab.reading}/><MasteryBar label="Listening recognition" value={vocab.listening}/><MasteryBar label="Active use" value={vocab.activeUse}/><MasteryBar label="Model confidence" value={vocab.confidence}/></div></section>
    <section className="mastery-section"><div className="section-heading"><div><span className="course-kicker">CONJUGATION</span><h2>Generated forms</h2></div><strong>{percent(conjugation.overall)}</strong></div><div className="mastery-grid"><MasteryBar label="Polite negative" value={conjugation.politeNegative}/><MasteryBar label="Polite past" value={conjugation.politePast}/><MasteryBar label="Polite past negative" value={conjugation.politePastNegative}/><MasteryBar label="て-form" value={conjugation.teForm}/><MasteryBar label="Model confidence" value={conjugation.confidence}/></div></section>
    <section className="mastery-section"><div className="section-heading"><div><span className="course-kicker">GRAMMAR</span><h2>Concept + contextual form</h2></div><strong>{percent(grammar.overall)}</strong></div><div className="mastery-grid"><MasteryBar label="Function comprehension" value={grammar.comprehension}/><MasteryBar label="Contextual form selection" value={grammar.formSelection}/><MasteryBar label="Model confidence" value={grammar.confidence}/></div></section>
    <section className="mastery-section"><div className="section-heading"><div><span className="course-kicker">SENTENCES</span><h2>Connected knowledge</h2></div><strong>{percent(sentence.overall)}</strong></div><div className="mastery-grid"><MasteryBar label="Sentence comprehension" value={sentence.comprehension}/><MasteryBar label="Sentence production" value={sentence.production}/><MasteryBar label="Model confidence" value={sentence.confidence}/></div></section>
    <section className="mastery-section"><div className="section-heading"><div><span className="course-kicker">A1 ASSESSMENT</span><h2>Language activities</h2></div><strong>{milestone.answered} / {milestone.total}</strong></div><div className="mastery-grid"><MasteryBar label="Reading" value={milestone.scores.reading.score}/><MasteryBar label="Listening" value={milestone.scores.listening.score}/><MasteryBar label="Spoken interaction*" value={milestone.scores.spoken_interaction.score}/><MasteryBar label="Spoken production*" value={milestone.scores.spoken_production.score}/><MasteryBar label="Writing" value={milestone.scores.writing.score}/></div><p className="course-note">*Text-backed say-then-type proxy; pronunciation is not scored in P2.5.</p></section>
    <div className="stat-row four"><Stat value={kana.evidenceCount+vocab.evidenceCount+conjugation.evidenceCount+grammar.evidenceCount+sentence.evidenceCount} label="Graded answers"/><Stat value={course.filter((unit)=>unit.assessment.status==="passed").length} label="Unit checks passed"/><Stat value={summary.due} label="Due now"/><Stat value={summary.memoryTraces} label="Memory traces"/></div>
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
function assessmentCanStart(unit:CourseUnitProgress):boolean{return ["ready","in_progress","passed","needs_review"].includes(unit.assessment.status);}
function assessmentLabel(unit:CourseUnitProgress):string{
  const a=unit.assessment;
  if(a.status==="passed")return "delayed check passed "+Math.round((a.score??0)*100)+"%";
  if(a.status==="needs_review")return "delayed check "+Math.round((a.score??0)*100)+"% · retry";
  if(a.status==="in_progress")return "delayed check in progress";
  if(a.status==="ready")return "delayed check ready";
  if(a.status==="waiting"&&a.availableAt)return "delayed check after "+new Date(a.availableAt).toLocaleString();
  return "delayed check unlocks after first-pass coverage";
}
function assessmentActionLabel(unit:CourseUnitProgress):string{
  const a=unit.assessment;
  if(a.status==="passed")return "Retake check";
  if(a.status==="needs_review")return "Retry check";
  if(a.status==="in_progress")return "Continue check";
  if(a.status==="ready")return "Take delayed check";
  if(a.status==="waiting")return "Delayed check waiting";
  return "Delayed check locked";
}
