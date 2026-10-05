import { useEffect,useLayoutEffect,useState } from "react";
import { createThiepnAccountAuthProvider,type AuthContext } from "@thiepn/auth";
import { getDefaultAudioProvider } from "@thiepn/audio";
import { claimGuestWorkspace } from "@thiepn/local-db";
import type { SearchResult } from "@thiepn/search";
import { isStudyLesson,type StudyStep } from "@thiepn/study-player";
import { searchLocalJapanese } from "./content";
import { foundationSections } from "./study/foundationPrompts";
import { Immersion } from "./immerse/Immersion";
import { getImmersionProgress,type ImmersionProgress } from "./immerse/reader";
import { AUTHENTIC_GUEST_ACCOUNT_ID,setAuthenticAccountId } from "./immerse/authentic";
import { StudyPlayer,type StudyAnswer } from "./study/StudyPlayer";
import { AiCoach } from "./ai/AiCoach";
import { AdaptiveRemediation } from "./study/AdaptiveRemediation";
import { B2Portfolio } from "./study/B2Portfolio";
import { C1Portfolio } from "./study/C1Portfolio";
import { ProviderHealthPanel } from "./study/ProviderHealthPanel";
import { HumanReviewPanel } from "./study/HumanReviewPanel";
import { ReleaseOperationsPanel } from "./study/ReleaseOperationsPanel";
import { RealWorldPerformancePanel } from "./study/RealWorldPerformancePanel";
import { createJapaneseLanguageDashboardPublisher } from "./languageDashboard";
import {
  buildA1MilestoneSession,buildB1MilestoneSession,buildB2MilestoneSession,buildC1FoundationPractice,buildC1FoundationSession,buildCourseUnitSession,buildLexicalFluencyPractice,buildP13C1SynthesisSession,buildP9RealWorldChainSession,buildP9RealWorldQualificationSession,buildProductivePractice,buildProductiveTaskPractice,buildTodayQueue,buildUnitAssessmentSession,getA1MilestoneAssessmentProgress,getB1MilestoneAssessmentProgress,getB2MilestoneAssessmentProgress,getC1FoundationAssessmentProgress,getConjugationMasterySummary,getCourseProgress,getGrammarMasterySummary,getKanaMasterySummary,getLexicalFluencySummary,getSentenceMasterySummary,getStudySummary,getVocabularyMasterySummary,recordStudyAnswer,GUEST_ACCOUNT_ID,setDevelopmentAccountId,
  type A1MilestoneProgress,type B1MilestoneProgress,type B2MilestoneProgress,type C1FoundationProgress,type ConjugationMasterySummary,type CourseUnitProgress,type GrammarMasterySummary,type KanaMasterySummary,type LexicalFluencySummary,type SentenceMasterySummary,type StudySummary,type VocabularyMasterySummary
} from "./study/runtime";

type Surface="Today"|"Learn"|"Immerse"|"Library"|"Progress";
const EMPTY_SUMMARY:StudySummary={due:0,newKana:5,newVocabulary:2,listening:0,application:0,course:0,learnedKana:0,totalKana:217,learnedVocabulary:0,totalVocabulary:658,memoryTraces:0};
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
const EMPTY_B1_MILESTONE:B1MilestoneProgress={complete:false,answered:0,total:15,scores:{
  reading:{activity:"reading",correct:0,answered:0,total:3,score:0},
  listening:{activity:"listening",correct:0,answered:0,total:3,score:0},
  spoken_interaction:{activity:"spoken_interaction",correct:0,answered:0,total:3,score:0},
  spoken_production:{activity:"spoken_production",correct:0,answered:0,total:3,score:0},
  writing:{activity:"writing",correct:0,answered:0,total:3,score:0}
}};
const EMPTY_B2_MILESTONE:B2MilestoneProgress={complete:false,answered:0,total:15,scores:{
  reading:{activity:"reading",correct:0,answered:0,total:3,score:0},
  listening:{activity:"listening",correct:0,answered:0,total:3,score:0},
  spoken_interaction:{activity:"spoken_interaction",correct:0,answered:0,total:3,score:0},
  spoken_production:{activity:"spoken_production",correct:0,answered:0,total:3,score:0},
  writing:{activity:"writing",correct:0,answered:0,total:3,score:0}
}};
const EMPTY_C1_FOUNDATION:C1FoundationProgress={complete:false,answered:0,total:15,scores:{
  reading:{activity:"reading",correct:0,answered:0,total:3,score:0},
  listening:{activity:"listening",correct:0,answered:0,total:3,score:0},
  spoken_interaction:{activity:"spoken_interaction",correct:0,answered:0,total:3,score:0},
  spoken_production:{activity:"spoken_production",correct:0,answered:0,total:3,score:0},
  writing:{activity:"writing",correct:0,answered:0,total:3,score:0}
}};
const EMPTY_SENTENCE:SentenceMasterySummary={overall:0,comprehension:0,production:0,confidence:0,accuracy:0,matureSkills:0,expectedSkills:0,evidenceCount:0};
const EMPTY_LEXICAL_FLUENCY:LexicalFluencySummary={overall:0,recognition:0,activeUse:0,registerTransfer:0,confidence:0,accuracy:0,matureSkills:0,expectedSkills:0,evidenceCount:0,totalChunks:152,transferPrompts:18};
const EMPTY_IMMERSION:ImmersionProgress={texts:[],minedWords:0,lookups:0,readingChecks:0,listeningChecks:0};

const JAPANESE_ACCOUNT = createThiepnAccountAuthProvider();
const JAPANESE_LANGUAGE_DASHBOARD =
  createJapaneseLanguageDashboardPublisher(JAPANESE_ACCOUNT);
const ANONYMOUS_AUTH:AuthContext={
  accountId:null,
  status:"anonymous",
  permissions:new Set<string>()
};

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
  const [lexicalFluency,setLexicalFluency]=useState<LexicalFluencySummary>(EMPTY_LEXICAL_FLUENCY);
  const [courseProgress,setCourseProgress]=useState<CourseUnitProgress[]>([]);
  const [milestone,setMilestone]=useState<A1MilestoneProgress>(EMPTY_MILESTONE);
  const [b1Milestone,setB1Milestone]=useState<B1MilestoneProgress>(EMPTY_B1_MILESTONE);
  const [b2Milestone,setB2Milestone]=useState<B2MilestoneProgress>(EMPTY_B2_MILESTONE);
  const [c1Foundation,setC1Foundation]=useState<C1FoundationProgress>(EMPTY_C1_FOUNDATION);
  const [immersion,setImmersion]=useState<ImmersionProgress>(EMPTY_IMMERSION);
  const [completedToday,setCompletedToday]=useState(0);
  const [preferredCoachChain,setPreferredCoachChain]=useState<string|null>(null);
  const [account,setAccount]=useState<AuthContext>(ANONYMOUS_AUTH);
  const [accountConnected,setAccountConnected]=useState(false);
  const [accountBusy,setAccountBusy]=useState(false);

  useEffect(()=>{
    let active=true;
    let generation=0;
    const apply=async(next:AuthContext)=>{
      const epoch=++generation;
      const authenticatedId=next.status==="authenticated"&&next.accountId
        ?next.accountId
        :null;
      const connected=authenticatedId
        ?await JAPANESE_ACCOUNT.completePendingConnection()
        :false;
      const accountId=authenticatedId&&connected
        ?authenticatedId
        :GUEST_ACCOUNT_ID;
      if(authenticatedId&&connected){
        await claimGuestWorkspace(GUEST_ACCOUNT_ID,authenticatedId);
      }
      if(!active||epoch!==generation)return;
      setDevelopmentAccountId(accountId);
      setAuthenticAccountId(accountId);
      setAccountConnected(connected);
      setAccount(next);
    };
    const unsubscribe=JAPANESE_ACCOUNT.subscribe((next)=>{
      void apply(next).catch(()=>{
        if(!active)return;
        setDevelopmentAccountId(GUEST_ACCOUNT_ID);
        setAuthenticAccountId(AUTHENTIC_GUEST_ACCOUNT_ID);
        setAccountConnected(false);
        setAccount(ANONYMOUS_AUTH);
      });
    });
    void JAPANESE_ACCOUNT.refresh().catch(()=>{
      if(!active)return;
      setDevelopmentAccountId(GUEST_ACCOUNT_ID);
      setAuthenticAccountId(AUTHENTIC_GUEST_ACCOUNT_ID);
      setAccountConnected(false);
      setAccount(ANONYMOUS_AUTH);
    });
    return()=>{active=false;generation+=1;unsubscribe();};
  },[]);
  useEffect(()=>{void refreshDashboard();},[]);
  useEffect(()=>{
    if(account.status==="authenticated"&&accountConnected){
      void refreshDashboard().then(()=>{
        void JAPANESE_LANGUAGE_DASHBOARD.publish().catch(()=>{/* Core dashboard is non-blocking */});
      });
    }
  },[account.status,account.accountId,accountConnected]);
  useEffect(()=>{
    if(surface!=="Library")return;
    let cancelled=false;setLibraryStatus("loading");
    searchLocalJapanese(query).then((next)=>{if(!cancelled){setResults(next);setLibraryStatus("ready");}}).catch(()=>{if(!cancelled){setResults([]);setLibraryStatus("error");}});
    return()=>{cancelled=true;};
  },[query,surface]);

  async function refreshDashboard(){
    try{
      const [nextSummary,nextKana,nextVocab,nextConjugation,nextGrammar,nextSentence,nextLexicalFluency,nextCourse,nextMilestone,nextB1Milestone,nextB2Milestone,nextC1Foundation,nextImmersion]=await Promise.all([
        getStudySummary(),getKanaMasterySummary(),getVocabularyMasterySummary(),getConjugationMasterySummary(),getGrammarMasterySummary(),getSentenceMasterySummary(),getLexicalFluencySummary(),getCourseProgress(),getA1MilestoneAssessmentProgress(),getB1MilestoneAssessmentProgress(),getB2MilestoneAssessmentProgress(),getC1FoundationAssessmentProgress(),getImmersionProgress()
      ]);
      setSummary(nextSummary);setKanaMastery(nextKana);setVocabMastery(nextVocab);setConjugationMastery(nextConjugation);setGrammarMastery(nextGrammar);setSentenceMastery(nextSentence);setLexicalFluency(nextLexicalFluency);setCourseProgress(nextCourse);setMilestone(nextMilestone);setB1Milestone(nextB1Milestone);setB2Milestone(nextB2Milestone);setC1Foundation(nextC1Foundation);setImmersion(nextImmersion);
    }catch{/* local storage can be unavailable in hardened browsers */}
  }

  async function toggleAccount(){
    if(accountBusy)return;
    setAccountBusy(true);
    try{
      if(account.status!=="authenticated"){
        await JAPANESE_ACCOUNT.signIn();
        return;
      }
      if(!accountConnected){
        await JAPANESE_ACCOUNT.connectApp();
        const accountId=account.accountId;
        if(accountId){
          await claimGuestWorkspace(GUEST_ACCOUNT_ID,accountId);
          setDevelopmentAccountId(accountId);
          setAuthenticAccountId(accountId);
          setAccountConnected(true);
          await refreshDashboard();
          await JAPANESE_LANGUAGE_DASHBOARD.publish();
        }
        return;
      }
      await JAPANESE_ACCOUNT.signOut();
      setDevelopmentAccountId(GUEST_ACCOUNT_ID);
      setAuthenticAccountId(AUTHENTIC_GUEST_ACCOUNT_ID);
      setAccountConnected(false);
    }finally{
      setAccountBusy(false);
    }
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
  async function startB1MilestoneAssessment(){
    setSessionStatus("loading");
    try{openSession(await buildB1MilestoneSession());setSessionStatus("idle");}catch{setSessionStatus("error");}
  }
  async function startB2MilestoneAssessment(){
    setSessionStatus("loading");
    try{openSession(await buildB2MilestoneSession());setSessionStatus("idle");}catch{setSessionStatus("error");}
  }
  async function startC1FoundationAssessment(){
    setSessionStatus("loading");
    try{openSession(await buildC1FoundationSession());setSessionStatus("idle");}catch{setSessionStatus("error");}
  }
  async function startC1FoundationPractice(){
    setSessionStatus("loading");
    try{openSession(await buildC1FoundationPractice());setSessionStatus("idle");}catch{setSessionStatus("error");}
  }
  async function startProductive(mode:"writing"|"speaking"){
    setSessionStatus("loading");
    try{openSession(await buildProductivePractice(mode));setSessionStatus("idle");}catch{setSessionStatus("error");}
  }
  async function startLexicalFluency(){
    setSessionStatus("loading");
    try{openSession(await buildLexicalFluencyPractice(12));setSessionStatus("idle");}catch{setSessionStatus("error");}
  }
  async function startProductiveTask(taskId:string){
    setSessionStatus("loading");
    try{openSession(await buildProductiveTaskPractice(taskId));setSessionStatus("idle");}catch{setSessionStatus("error");}
  }
  async function startC1Synthesis(packId:string){
    setSessionStatus("loading");
    try{openSession(await buildP13C1SynthesisSession(packId));setSessionStatus("idle");}catch{setSessionStatus("error");}
  }
  async function startRealWorldChain(chainId:string){
    setSessionStatus("loading");
    try{openSession(await buildP9RealWorldChainSession(chainId));setSessionStatus("idle");}catch{setSessionStatus("error");}
  }
  async function startRealWorldQualification(){
    setSessionStatus("loading");
    try{openSession(await buildP9RealWorldQualificationSession(10));setSessionStatus("idle");}catch{setSessionStatus("error");}
  }

  async function handleAnswer(answer:StudyAnswer){
    await recordStudyAnswer({prompt:answer.prompt,response:answer.response,result:answer.grade.result,responseTimeMs:answer.responseTimeMs});
    setCompletedToday((value)=>value+1);
  }
  function finishSession(){
    const active=document.activeElement;
    if(active instanceof HTMLElement)active.blur();
    setSession(null);
    requestAnimationFrame(()=>requestAnimationFrame(()=>window.scrollTo({top:0,left:0,behavior:"auto"})));
    void refreshDashboard().then(()=>{
      if(account.status==="authenticated"&&accountConnected){
        void JAPANESE_LANGUAGE_DASHBOARD.publish().catch(()=>{/* Core dashboard is non-blocking */});
      }
    });
  }

  useLayoutEffect(()=>{
    if(session===null)window.scrollTo({top:0,left:0,behavior:"instant"});
  },[session]);

  return <>
    {session?<div className="study-shell"><StudyPlayer steps={session} onAnswer={handleAnswer} onComplete={finishSession} onExit={finishSession}/></div>:<div className="app-shell">
      <header className="topbar"><div><strong>Japanese</strong><span className="phase">P16 C1 research quality · bibliography · human review · specialist tracks</span></div><button className="quiet-button account-button" disabled={accountBusy} onClick={()=>void toggleAccount()} type="button">{accountBusy?"Account…":account.status!=="authenticated"?"Connect Account":accountConnected?"Sign out":"Connect Account"}</button></header>
      <main className="content">
        {surface==="Today"&&<Today summary={summary} completedToday={completedToday} status={sessionStatus} onStart={()=>void startStudy()}/>}
        {surface==="Learn"&&<Learn summary={summary} kana={kanaMastery} vocab={vocabMastery} conjugation={conjugationMastery} grammar={grammarMastery} sentence={sentenceMastery} lexicalFluency={lexicalFluency} course={courseProgress} milestone={milestone} b1Milestone={b1Milestone} b2Milestone={b2Milestone} c1Foundation={c1Foundation} preferredCoachChain={preferredCoachChain} onPreferredCoachChainApplied={()=>setPreferredCoachChain(null)} status={sessionStatus} onStart={()=>void startStudy()} onStartUnit={(id)=>void startCourseUnit(id)} onStartAssessment={(id)=>void startUnitAssessment(id)} onStartMilestone={()=>void startMilestoneAssessment()} onStartB1Milestone={()=>void startB1MilestoneAssessment()} onStartB2Milestone={()=>void startB2MilestoneAssessment()} onStartC1Foundation={()=>void startC1FoundationAssessment()} onC1Practice={()=>void startC1FoundationPractice()} onProductive={(mode)=>void startProductive(mode)} onLexicalFluency={()=>void startLexicalFluency()} onRealWorldChain={(id)=>void startRealWorldChain(id)} onRealWorldQualification={()=>void startRealWorldQualification()}/>} 
        {surface==="Immerse"&&<Immersion onStartProductionTask={(taskId)=>void startProductiveTask(taskId)} onStartC1Synthesis={(packId)=>void startC1Synthesis(packId)} onOpenC1Coach={(chainId)=>{setPreferredCoachChain(chainId);setSurface("Learn");}}/>} 
        {surface==="Progress"&&<Progress kana={kanaMastery} vocab={vocabMastery} conjugation={conjugationMastery} grammar={grammarMastery} sentence={sentenceMastery} lexicalFluency={lexicalFluency} milestone={milestone} b1Milestone={b1Milestone} b2Milestone={b2Milestone} c1Foundation={c1Foundation} immersion={immersion} summary={summary} course={courseProgress} completedToday={completedToday}/>} 
        {surface==="Library"&&<Library query={query} setQuery={setQuery} results={results} status={libraryStatus}/>}
      </main>
    </div>}
    <nav className={"nav"+(session?" study-active":"")} aria-label="Primary" aria-hidden={session?true:undefined}>{(["Today","Learn","Immerse","Library","Progress"] as Surface[]).map((item)=><button key={item} disabled={Boolean(session)} tabIndex={session?-1:0} className={surface===item?"active":""} onClick={()=>setSurface(item)} type="button">{item}</button>)}</nav>
  </>;
}

function Today({summary,completedToday,status,onStart}:{summary:StudySummary;completedToday:number;status:string;onStart:()=>void}){
  const remaining=summary.due+summary.newKana+summary.newVocabulary+summary.listening+summary.application+summary.course;
  return <section className="dashboard"><p className="eyebrow">TODAY</p><h1>{remaining?"Continue Japanese":"You’re caught up"}</h1>
    <p className="lead">One queue now combines memory reviews, Foundation skills and the current Foundation→C1 capability path. Grammar enters through meaning and sentence context instead of living in a separate grammar app.</p>
    <div className="stat-row six"><Stat value={summary.due} label="Due"/><Stat value={summary.newKana} label="New kana"/><Stat value={summary.newVocabulary} label="New words"/><Stat value={summary.listening} label="Listening"/><Stat value={summary.course} label="Course"/><Stat value={summary.application} label="Practice"/></div>
    <p className="session-note">{completedToday} answers recorded this session.</p>
    <button className="primary" disabled={status==="loading"} onClick={onStart} type="button">{status==="loading"?"Preparing…":remaining?"Continue study":"Review anyway"}</button>
    {status==="error"&&<p className="error-text" role="status">Could not open local study data. Reload and try again.</p>}
  </section>;
}

function Learn({summary,kana,vocab,conjugation,grammar,sentence,lexicalFluency,course,milestone,b1Milestone,b2Milestone,c1Foundation,preferredCoachChain,onPreferredCoachChainApplied,status,onStart,onStartUnit,onStartAssessment,onStartMilestone,onStartB1Milestone,onStartB2Milestone,onStartC1Foundation,onC1Practice,onProductive,onLexicalFluency,onRealWorldChain,onRealWorldQualification}:{summary:StudySummary;kana:KanaMasterySummary;vocab:VocabularyMasterySummary;conjugation:ConjugationMasterySummary;grammar:GrammarMasterySummary;sentence:SentenceMasterySummary;lexicalFluency:LexicalFluencySummary;course:CourseUnitProgress[];milestone:A1MilestoneProgress;b1Milestone:B1MilestoneProgress;b2Milestone:B2MilestoneProgress;c1Foundation:C1FoundationProgress;preferredCoachChain:string|null;onPreferredCoachChainApplied:()=>void;status:string;onStart:()=>void;onStartUnit:(id:string)=>void;onStartAssessment:(id:string)=>void;onStartMilestone:()=>void;onStartB1Milestone:()=>void;onStartB2Milestone:()=>void;onStartC1Foundation:()=>void;onC1Practice:()=>void;onProductive:(mode:"writing"|"speaking")=>void;onLexicalFluency:()=>void;onRealWorldChain:(id:string)=>void;onRealWorldQualification:()=>void}){
  const kanaCoverage=summary.totalKana?Math.round(summary.learnedKana/summary.totalKana*100):0;
  const vocabCoverage=summary.totalVocabulary?Math.round(summary.learnedVocabulary/summary.totalVocabulary*100):0;
  return <section className="dashboard learn-page"><p className="eyebrow">LEARN</p><h1>Foundation → C1</h1>
    <p className="lead">P16 keeps the structured Foundation→C1 graph and the P15 real-source environment, then deepens research quality through bibliography, provenance-safe source excerpts, artifact-bound human review and evidence-linked specialist tracks.</p>
    <div className="course-stack foundation-stack">
      <article className="course-card"><div><span className="course-kicker">SCRIPT FOUNDATION</span><h2>Kana</h2><p>{foundationSections.map((section)=>section.label).join(" · ")}</p></div><div className="course-progress"><strong>{kanaCoverage}%</strong><span>{summary.learnedKana} / {summary.totalKana} introduced</span></div></article>
      <article className="course-card"><div><span className="course-kicker">A1→C1 LEXICON</span><h2>Useful words + kanji in context</h2><p>Meaning · reading · listening · active recall</p></div><div className="course-progress"><strong>{vocabCoverage}%</strong><span>{summary.learnedVocabulary} / {summary.totalVocabulary} words introduced</span></div></article>
    </div>

    <section className="mastery-section productive-card">
      <div className="section-heading"><div><span className="course-kicker">B2 LEXICAL FLUENCY</span><h2>Collocations + reusable chunks</h2></div><span className="course-count">{lexicalFluency.totalChunks} chunks</span></div>
      <p>Knowing individual words is not counted as knowing the combination. P8 adds context/register transfer on top of recognition and active production, so similar phrases must be selected appropriately rather than merely recognized.</p>
      <div className="mastery-grid"><MasteryBar label="Chunk recognition" value={lexicalFluency.recognition}/><MasteryBar label="Chunk active use" value={lexicalFluency.activeUse}/><MasteryBar label="Register + phrase-family transfer" value={lexicalFluency.registerTransfer}/></div>
      <button className="unit-action" disabled={status==="loading"} type="button" onClick={onLexicalFluency}>Practice lexical fluency</button>
    </section>

    <section className="course-section">
      <div className="section-heading"><div><span className="course-kicker">STRUCTURED A1→C1</span><h2>Capability course</h2></div><span className="course-count">{course.filter((unit)=>unit.status==="mastered").length} / {course.length} mastered</span></div>
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
      <p className="course-note">Unit checks unlock 20 hours after essential first-pass evidence. B1, B2 and C1 units continue the same graph and remain advisory rather than hard-locked.</p>
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

    <section className="mastery-section productive-card">
      <div className="section-heading"><div><span className="course-kicker">PRODUCTIVE B1</span><h2>Write + speak connected Japanese</h2></div><span className="course-count">real responses</span></div>
      <p>Writing uses multi-sentence text areas and structural target checks. Speaking uses Japanese browser speech recognition when available. Neither mode pretends to replace human semantic correction or acoustic pronunciation scoring.</p>
      <div className="productive-actions"><button className="unit-action" disabled={status==="loading"} type="button" onClick={()=>onProductive("writing")}>Practice writing</button><button className="unit-action" disabled={status==="loading"} type="button" onClick={()=>onProductive("speaking")}>Practice speaking</button></div>
    </section>
    <section className="mastery-section milestone-card">
      <div className="section-heading"><div><span className="course-kicker">B1 MILESTONE</span><h2>Five activity areas</h2></div><strong>{b1Milestone.answered} / {b1Milestone.total}</strong></div>
      <p>Reading and listening stay separate from microphone-based interaction/production and connected writing. Speaking recognition checks intelligible target language; pronunciation is practiced separately through listen-record-compare shadowing.</p>
      <div className="mastery-grid">
        <MasteryBar label="Reading" value={b1Milestone.scores.reading.score}/>
        <MasteryBar label="Listening" value={b1Milestone.scores.listening.score}/>
        <MasteryBar label="Spoken interaction" value={b1Milestone.scores.spoken_interaction.score}/>
        <MasteryBar label="Spoken production" value={b1Milestone.scores.spoken_production.score}/>
        <MasteryBar label="Writing" value={b1Milestone.scores.writing.score}/>
      </div>
      <button className="primary" disabled={status==="loading"} onClick={onStartB1Milestone} type="button">{b1Milestone.complete?"Retake B1 milestone":"Start B1 milestone"}</button>
    </section>

    <AdaptiveRemediation onStartUnit={onStartUnit} onStartProduction={onProductive}/>
    <RealWorldPerformancePanel onStartChain={onRealWorldChain} onStartQualification={onRealWorldQualification}/>
    <AiCoach preferredChainId={preferredCoachChain} onPreferredChainApplied={onPreferredCoachChainApplied}/>
    <section className="mastery-section milestone-card">
      <div className="section-heading"><div><span className="course-kicker">B2 MILESTONE</span><h2>Independent receptive + productive activity areas</h2></div><strong>{b2Milestone.answered} / {b2Milestone.total}</strong></div>
      <p>B2 reading, connected listening, microphone interaction/production and connected writing are reported separately. Device speech synthesis is labeled as synthesized; AI coach feedback is excluded from milestone scoring.</p>
      <div className="mastery-grid">
        <MasteryBar label="Reading" value={b2Milestone.scores.reading.score}/>
        <MasteryBar label="Listening" value={b2Milestone.scores.listening.score}/>
        <MasteryBar label="Spoken interaction" value={b2Milestone.scores.spoken_interaction.score}/>
        <MasteryBar label="Spoken production" value={b2Milestone.scores.spoken_production.score}/>
        <MasteryBar label="Writing" value={b2Milestone.scores.writing.score}/>
      </div>
      <button className="primary" disabled={status==="loading"} onClick={onStartB2Milestone} type="button">{b2Milestone.complete?"Retake B2 milestone":"Start B2 milestone"}</button>
    </section>

    <section className="mastery-section productive-card">
      <div className="section-heading"><div><span className="course-kicker">C1 FOUNDATION</span><h2>Advanced discourse control</h2></div><span className="course-count">8 discourse moves · 12 prompts</span></div>
      <p>Practice separating evidence from inference, calibrating certainty, synthesizing competing views, answering counterarguments precisely and matching register to purpose. This is normal learner evidence, not external CEFR certification.</p>
      <button className="unit-action" disabled={status==="loading"} type="button" onClick={onC1Practice}>Practice C1 discourse control</button>
    </section>

    <section className="mastery-section milestone-card">
      <div className="section-heading"><div><span className="course-kicker">C1 FOUNDATION DIAGNOSTIC</span><h2>Advanced independent activity areas</h2></div><strong>{c1Foundation.answered} / {c1Foundation.total}</strong></div>
      <p>This internal diagnostic samples C1 reading, synthesized connected listening, microphone interaction/production and advanced writing separately. It is a product learning diagnostic, not an accredited CEFR examination.</p>
      <div className="mastery-grid">
        <MasteryBar label="Reading" value={c1Foundation.scores.reading.score}/>
        <MasteryBar label="Listening" value={c1Foundation.scores.listening.score}/>
        <MasteryBar label="Spoken interaction" value={c1Foundation.scores.spoken_interaction.score}/>
        <MasteryBar label="Spoken production" value={c1Foundation.scores.spoken_production.score}/>
        <MasteryBar label="Writing" value={c1Foundation.scores.writing.score}/>
      </div>
      <button className="primary" disabled={status==="loading"} onClick={onStartC1Foundation} type="button">{c1Foundation.complete?"Retake C1 foundation diagnostic":"Start C1 foundation diagnostic"}</button>
    </section>

    <div className="mastery-grid four-skill">
      <MasteryBar label="Kana durable mastery" value={kana.overall}/>
      <MasteryBar label="Vocabulary durable mastery" value={vocab.overall}/>
      <MasteryBar label="Conjugation pattern mastery" value={conjugation.overall}/>
      <MasteryBar label="Grammar durable mastery" value={grammar.overall}/>
      <MasteryBar label="Sentence durable mastery" value={sentence.overall}/>
      <MasteryBar label="Lexical chunk fluency" value={lexicalFluency.overall}/>
    </div>
    <button className="primary" disabled={status==="loading"} onClick={onStart} type="button">Continue adaptive study</button>
  </section>;
}

function Progress({kana,vocab,conjugation,grammar,sentence,lexicalFluency,milestone,b1Milestone,b2Milestone,c1Foundation,immersion,summary,course,completedToday}:{kana:KanaMasterySummary;vocab:VocabularyMasterySummary;conjugation:ConjugationMasterySummary;grammar:GrammarMasterySummary;sentence:SentenceMasterySummary;lexicalFluency:LexicalFluencySummary;milestone:A1MilestoneProgress;b1Milestone:B1MilestoneProgress;b2Milestone:B2MilestoneProgress;c1Foundation:C1FoundationProgress;immersion:ImmersionProgress;summary:StudySummary;course:CourseUnitProgress[];completedToday:number}){
  return <section className="dashboard"><p className="eyebrow">PROGRESS</p><h1>Real mastery</h1>
    <p className="lead">Course position is derived from evidence. Lesson exposure, delayed assessment and later retrieval remain distinct so recent familiarity does not automatically count as mastery.</p>
    <section className="mastery-section"><div className="section-heading"><div><span className="course-kicker">KANA + SOUND</span><h2>Script and perception</h2></div><strong>{percent(kana.overall)}</strong></div><div className="mastery-grid"><MasteryBar label="Hiragana" value={kana.hiragana}/><MasteryBar label="Katakana" value={kana.katakana}/><MasteryBar label="Recognition" value={kana.recognition}/><MasteryBar label="Typed reading" value={kana.readingRecall}/><MasteryBar label="Mora listening" value={kana.listening}/><MasteryBar label="Model confidence" value={kana.confidence}/></div></section>
    <section className="mastery-section"><div className="section-heading"><div><span className="course-kicker">VOCABULARY</span><h2>Word mastery</h2></div><strong>{percent(vocab.overall)}</strong></div><div className="mastery-grid"><MasteryBar label="Meaning recognition" value={vocab.meaning}/><MasteryBar label="Reading recall" value={vocab.reading}/><MasteryBar label="Listening recognition" value={vocab.listening}/><MasteryBar label="Active use" value={vocab.activeUse}/><MasteryBar label="Model confidence" value={vocab.confidence}/></div></section>
    <section className="mastery-section"><div className="section-heading"><div><span className="course-kicker">CONJUGATION</span><h2>Generated forms</h2></div><strong>{percent(conjugation.overall)}</strong></div><div className="mastery-grid"><MasteryBar label="Polite negative" value={conjugation.politeNegative}/><MasteryBar label="Polite past" value={conjugation.politePast}/><MasteryBar label="Polite past negative" value={conjugation.politePastNegative}/><MasteryBar label="て-form" value={conjugation.teForm}/><MasteryBar label="Model confidence" value={conjugation.confidence}/></div></section>
    <section className="mastery-section"><div className="section-heading"><div><span className="course-kicker">GRAMMAR</span><h2>Concept + contextual form</h2></div><strong>{percent(grammar.overall)}</strong></div><div className="mastery-grid"><MasteryBar label="Function comprehension" value={grammar.comprehension}/><MasteryBar label="Contextual form selection" value={grammar.formSelection}/><MasteryBar label="Model confidence" value={grammar.confidence}/></div></section>
    <section className="mastery-section"><div className="section-heading"><div><span className="course-kicker">SENTENCES</span><h2>Connected knowledge</h2></div><strong>{percent(sentence.overall)}</strong></div><div className="mastery-grid"><MasteryBar label="Sentence comprehension" value={sentence.comprehension}/><MasteryBar label="Sentence production" value={sentence.production}/><MasteryBar label="B2 lexical chunks" value={lexicalFluency.overall}/><MasteryBar label="Register transfer" value={lexicalFluency.registerTransfer}/><MasteryBar label="Model confidence" value={sentence.confidence}/></div></section>
    <section className="mastery-section"><div className="section-heading"><div><span className="course-kicker">IMMERSION</span><h2>Connected text transfer</h2></div><strong>{immersion.texts.length} texts</strong></div><div className="mastery-grid"><MasteryBar label="Reading text mastery" value={mean(immersion.texts.map((item)=>item.readingMastery))}/><MasteryBar label="Connected listening mastery" value={mean(immersion.texts.map((item)=>item.listeningMastery))}/><MasteryBar label="Average lexical readiness" value={mean(immersion.texts.map((item)=>item.readiness))}/></div><p className="course-note">{immersion.minedWords} mined words · {immersion.lookups} reader lookups · {immersion.readingChecks} reading checks · {immersion.listeningChecks} listening checks</p></section>
    <section className="mastery-section"><div className="section-heading"><div><span className="course-kicker">A1 ASSESSMENT</span><h2>Language activities</h2></div><strong>{milestone.answered} / {milestone.total}</strong></div><div className="mastery-grid"><MasteryBar label="Reading" value={milestone.scores.reading.score}/><MasteryBar label="Listening" value={milestone.scores.listening.score}/><MasteryBar label="Spoken interaction*" value={milestone.scores.spoken_interaction.score}/><MasteryBar label="Spoken production*" value={milestone.scores.spoken_production.score}/><MasteryBar label="Writing" value={milestone.scores.writing.score}/></div><p className="course-note">*Text-backed say-then-type proxy; pronunciation is not scored in P2.5.</p></section>
    <section className="mastery-section"><div className="section-heading"><div><span className="course-kicker">B1 ASSESSMENT</span><h2>Independent language activities</h2></div><strong>{b1Milestone.answered} / {b1Milestone.total}</strong></div><div className="mastery-grid"><MasteryBar label="Reading" value={b1Milestone.scores.reading.score}/><MasteryBar label="Listening" value={b1Milestone.scores.listening.score}/><MasteryBar label="Spoken interaction" value={b1Milestone.scores.spoken_interaction.score}/><MasteryBar label="Spoken production" value={b1Milestone.scores.spoken_production.score}/><MasteryBar label="Writing" value={b1Milestone.scores.writing.score}/></div><p className="course-note">Speech uses recognized Japanese transcripts and writing uses structural target coverage. Shadowing self-review is tracked separately as pronunciation evidence.</p></section>
    <B2Portfolio/>
    <C1Portfolio/>
    <HumanReviewPanel/>
    <ReleaseOperationsPanel/>
    <ProviderHealthPanel/>
    <section className="mastery-section"><div className="section-heading"><div><span className="course-kicker">B2 ASSESSMENT</span><h2>Independent communication</h2></div><strong>{b2Milestone.answered} / {b2Milestone.total}</strong></div><div className="mastery-grid"><MasteryBar label="Reading" value={b2Milestone.scores.reading.score}/><MasteryBar label="Listening" value={b2Milestone.scores.listening.score}/><MasteryBar label="Spoken interaction" value={b2Milestone.scores.spoken_interaction.score}/><MasteryBar label="Spoken production" value={b2Milestone.scores.spoken_production.score}/><MasteryBar label="Writing" value={b2Milestone.scores.writing.score}/></div><p className="course-note">B2 listening currently uses an explicitly labeled device Japanese voice where no reusable native recording exists. AI feedback never changes these scores.</p></section>
    <section className="mastery-section"><div className="section-heading"><div><span className="course-kicker">C1 FOUNDATION</span><h2>Advanced independent discourse diagnostic</h2></div><strong>{c1Foundation.answered} / {c1Foundation.total}</strong></div><div className="mastery-grid"><MasteryBar label="Reading" value={c1Foundation.scores.reading.score}/><MasteryBar label="Listening" value={c1Foundation.scores.listening.score}/><MasteryBar label="Spoken interaction" value={c1Foundation.scores.spoken_interaction.score}/><MasteryBar label="Spoken production" value={c1Foundation.scores.spoken_production.score}/><MasteryBar label="Writing" value={c1Foundation.scores.writing.score}/></div><p className="course-note">Internal P12 diagnostic only. Device synthesis, speech-recognition transcripts and structural writing checks remain explicitly narrower than external CEFR assessment.</p></section>
    <div className="stat-row four"><Stat value={kana.evidenceCount+vocab.evidenceCount+conjugation.evidenceCount+grammar.evidenceCount+sentence.evidenceCount+lexicalFluency.evidenceCount} label="Graded answers"/><Stat value={course.filter((unit)=>unit.assessment.status==="passed").length} label="Unit checks passed"/><Stat value={summary.due} label="Due now"/><Stat value={summary.memoryTraces} label="Memory traces"/></div>
    <p className="session-note">{completedToday} answers recorded in this open session.</p>
  </section>;
}

function Library({query,setQuery,results,status}:{query:string;setQuery:(value:string)=>void;results:SearchResult[];status:string}){
  return <section className="library"><p className="eyebrow">LIBRARY</p><h1>Japanese knowledge</h1><p className="lead">Search canonical words, collocations, kanji, grammar, sentences and graded texts by Japanese form, reading or English meaning/function.</p>
    <input aria-label="Search Japanese" value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="食べる, たべる, eat, topic…"/>
    {status==="loading"&&<p className="muted" role="status">Searching local Japanese content…</p>}{status==="error"&&<p role="status">Local content database is unavailable in this browser.</p>}
    <div className="results">{results.map((item)=><article className={"result-card result-"+item.entity.kind} key={item.entity.kind+":"+item.entity.id}><div><small>{item.entity.kind}</small><strong lang="ja">{item.title}</strong></div><span>{item.subtitle}</span></article>)}</div>
  </section>;
}

function MasteryBar({label,value}:{label:string;value:number}){const pct=Math.round(value*100);return <div className="mastery-row"><div><span>{label}</span><strong>{pct}%</strong></div><div className="meter" aria-label={label+" "+pct+"%"}><span style={{width:pct+"%"}}/></div></div>;}
function Stat({value,label}:{value:number|string;label:string}){return <div className="stat"><strong>{value}</strong><span>{label}</span></div>;}
function Placeholder({title,body}:{title:string;body:string}){return <section className="hero"><p className="eyebrow">{title.toUpperCase()}</p><h1>{title}</h1><p>{body}</p></section>;}
function percent(value:number):string{return Math.round(value*100)+"%";}
function mean(values:number[]):number{return values.length?values.reduce((sum,value)=>sum+value,0)/values.length:0;}
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
