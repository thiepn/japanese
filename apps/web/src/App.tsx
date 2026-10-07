import { Suspense,lazy,useEffect,useLayoutEffect,useState } from "react";
import { createThiepnAccountAuthProvider,type AuthContext } from "@thiepn/auth";
import { getDefaultAudioProvider } from "@thiepn/audio";
import { claimGuestWorkspace } from "@thiepn/local-db";
import type { SearchResult } from "@thiepn/search";
import { isStudyLesson,type StudyStep } from "@thiepn/study-player";
import { searchLocalJapanese } from "./content";
import { Immersion } from "./immerse/Immersion";
import { getImmersionProgress,type ImmersionProgress } from "./immerse/reader";
import { AUTHENTIC_GUEST_ACCOUNT_ID,setAuthenticAccountId } from "./immerse/authentic";
import { StudyPlayer,type StudyAnswer } from "./study/StudyPlayer";
import { J2AppShell,type J2Surface } from "./design/J2AppShell";
import { J3Today } from "./design/J3Today";
import { J4Learn } from "./design/J4Learn";
import { J7Library } from "./design/J7Library";
import { J8Progress } from "./design/J8Progress";
import { createJapaneseLanguageDashboardPublisher } from "./languageDashboard";
import {
  buildA1MilestoneSession,buildB1MilestoneSession,buildB2MilestoneSession,buildC1FoundationPractice,buildC1FoundationSession,buildCourseUnitSession,buildLexicalFluencyPractice,buildP13C1SynthesisSession,buildP9RealWorldChainSession,buildP9RealWorldQualificationSession,buildProductivePractice,buildProductiveTaskPractice,buildTodayQueue,buildUnitAssessmentSession,getA1MilestoneAssessmentProgress,getB1MilestoneAssessmentProgress,getB2MilestoneAssessmentProgress,getC1FoundationAssessmentProgress,getConjugationMasterySummary,getCourseProgress,getGrammarMasterySummary,getKanaMasterySummary,getLexicalFluencySummary,getSentenceMasterySummary,getStudySummary,getVocabularyMasterySummary,recordStudyAnswer,GUEST_ACCOUNT_ID,setDevelopmentAccountId,
  type A1MilestoneProgress,type B1MilestoneProgress,type B2MilestoneProgress,type C1FoundationProgress,type ConjugationMasterySummary,type CourseUnitProgress,type GrammarMasterySummary,type KanaMasterySummary,type LexicalFluencySummary,type SentenceMasterySummary,type StudySummary,type VocabularyMasterySummary
} from "./study/runtime";

type Surface=J2Surface;
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

const J11Diagnostics=lazy(()=>import("./design/J11Diagnostics").then((module)=>({default:module.J11Diagnostics})));

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
  const [accountMessage,setAccountMessage]=useState<string|null>(null);

  useEffect(()=>{
    let active=true;
    let generation=0;
    const useGuestWorkspace=()=>{
      setDevelopmentAccountId(GUEST_ACCOUNT_ID);
      setAuthenticAccountId(AUTHENTIC_GUEST_ACCOUNT_ID);
      setAccountConnected(false);
    };
    const apply=async(next:AuthContext)=>{
      const epoch=++generation;
      const authenticatedId=next.status==="authenticated"&&next.accountId
        ?next.accountId
        :null;
      if(!authenticatedId){
        if(!active||epoch!==generation)return;
        useGuestWorkspace();
        setAccount(next);
        setAccountMessage(next.status==="expired"
          ?"THIEPN Account sign-in could not be completed. Try signing in again; your local Japanese data is unchanged."
          :null);
        return;
      }

      let connected=false;
      try{
        connected=await JAPANESE_ACCOUNT.completePendingConnection();
      }catch{
        if(!active||epoch!==generation)return;
        useGuestWorkspace();
        setAccount(next);
        setAccountMessage("Signed in to THIEPN Account, but the Japanese connection is temporarily unavailable. Local study remains available.");
        return;
      }

      let claimResult:"same-account"|"guest-empty"|"target-populated"|"migrated"="guest-empty";
      if(connected){
        try{
          claimResult=await claimGuestWorkspace(GUEST_ACCOUNT_ID,authenticatedId);
        }catch{
          if(!active||epoch!==generation)return;
          useGuestWorkspace();
          setAccount(next);
          setAccountMessage("THIEPN Account is signed in, but this device workspace could not be attached safely. No local data was overwritten.");
          return;
        }
      }

      if(!active||epoch!==generation)return;
      const accountId=connected?authenticatedId:GUEST_ACCOUNT_ID;
      setDevelopmentAccountId(accountId);
      setAuthenticAccountId(accountId);
      setAccountConnected(connected);
      setAccount(next);
      setAccountMessage(
        connected
          ?claimResult==="target-populated"
            ?"THIEPN Account already has Japanese data on this device. Guest progress was kept separate rather than merged or overwritten; sign out to access the guest workspace."
            :claimResult==="migrated"
              ?"Local guest progress was attached to your THIEPN Account on this device."
              :null
          :"Signed in to THIEPN Account. Connect Japanese to attach this device.",
      );
    };
    const authUnavailable=()=>{
      if(!active)return;
      useGuestWorkspace();
      setAccount(ANONYMOUS_AUTH);
      setAccountMessage("THIEPN Account could not be verified. Japanese is staying local on this device.");
    };
    const unsubscribe=JAPANESE_ACCOUNT.subscribe((next)=>{
      void apply(next).catch(authUnavailable);
    });
    void JAPANESE_ACCOUNT.refresh().catch(authUnavailable);
    return()=>{active=false;generation+=1;unsubscribe();};
  },[]);
  useEffect(()=>{
    void refreshDashboard().then(()=>{
      if(account.status==="authenticated"&&accountConnected){
        void JAPANESE_LANGUAGE_DASHBOARD.publish().catch(()=>{/* Core dashboard is non-blocking */});
      }
    });
  },[account.status,account.accountId,accountConnected]);
  useEffect(()=>{
    if(surface!=="Library")return;
    let cancelled=false;
    const run=()=>{
      setLibraryStatus("loading");
      searchLocalJapanese(query)
        .then((next)=>{if(!cancelled){setResults(next);setLibraryStatus("ready");}})
        .catch(()=>{if(!cancelled){setResults([]);setLibraryStatus("error");}});
    };
    if(!query.trim()){
      run();
      return()=>{cancelled=true;};
    }
    const timeout=globalThis.setTimeout(run,120);
    return()=>{cancelled=true;globalThis.clearTimeout(timeout);};
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
    setAccountMessage(null);
    try{
      if(account.status!=="authenticated"){
        await JAPANESE_ACCOUNT.signIn();
        return;
      }
      if(!accountConnected){
        await JAPANESE_ACCOUNT.connectApp();
        const accountId=account.accountId;
        if(accountId){
          const claimResult=await claimGuestWorkspace(GUEST_ACCOUNT_ID,accountId);
          setDevelopmentAccountId(accountId);
          setAuthenticAccountId(accountId);
          setAccountConnected(true);
          setAccountMessage(
            claimResult==="target-populated"
              ?"THIEPN Account already has Japanese data on this device. Guest progress was kept separate rather than merged or overwritten; sign out to access the guest workspace."
              :claimResult==="migrated"
                ?"Local guest progress was attached to your THIEPN Account on this device."
                :null,
          );
          await refreshDashboard();
          void JAPANESE_LANGUAGE_DASHBOARD.publish().catch(()=>{
            setAccountMessage("Japanese is connected to THIEPN Account, but the shared language dashboard could not be refreshed yet.");
          });
        }
        return;
      }
      await JAPANESE_ACCOUNT.signOut();
      setDevelopmentAccountId(GUEST_ACCOUNT_ID);
      setAuthenticAccountId(AUTHENTIC_GUEST_ACCOUNT_ID);
      setAccountConnected(false);
      setAccount(ANONYMOUS_AUTH);
      setAccountMessage(null);
    }catch{
      setAccountMessage("THIEPN Account is temporarily unavailable. Your local Japanese data has not been changed.");
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

  const [diagnosticsMode,setDiagnosticsMode]=useState(
    ()=>new URLSearchParams(window.location.search).get("diagnostics")==="1",
  );
  const accountActionLabel=account.status!=="authenticated"
    ?"Sign in with THIEPN Account"
    :accountConnected
      ?"Sign out"
      :"Connect THIEPN Account";
  const navigateSurface=(next:Surface)=>{
    if(diagnosticsMode){
      const url=new URL(window.location.href);
      url.searchParams.delete("diagnostics");
      url.searchParams.delete("panel");
      window.history.replaceState({},"",url.pathname+url.search+url.hash);
      setDiagnosticsMode(false);
    }
    setSurface(next);
  };

  return <>
    <a className="skip-link" href="#main-content">Skip to main content</a>
    {session
      ?<main className="study-shell j5-study-shell" id="main-content" tabIndex={-1}><StudyPlayer steps={session} onAnswer={handleAnswer} onComplete={finishSession} onExit={finishSession}/></main>
      :<J2AppShell
        surface={surface}
        onSurfaceChange={navigateSurface}
        accountActionLabel={accountActionLabel}
        accountBusy={accountBusy}
        onAccountAction={()=>void toggleAccount()}
        accountStatus={accountMessage}
        diagnosticsMode={diagnosticsMode}
      >
        {diagnosticsMode
          ?<Suspense fallback={<p className="j2-account-status" role="status">Opening technical workspace…</p>}><J11Diagnostics onExit={()=>navigateSurface(surface)}/></Suspense>
          :<>
            {surface==="Today"&&<J3Today summary={summary} completedToday={completedToday} status={sessionStatus} onStart={()=>void startStudy()}/>}
            {surface==="Learn"&&<J4Learn summary={summary} kana={kanaMastery} vocab={vocabMastery} conjugation={conjugationMastery} grammar={grammarMastery} sentence={sentenceMastery} lexicalFluency={lexicalFluency} course={courseProgress} milestone={milestone} b1Milestone={b1Milestone} b2Milestone={b2Milestone} c1Foundation={c1Foundation} preferredCoachChain={preferredCoachChain} onPreferredCoachChainApplied={()=>setPreferredCoachChain(null)} status={sessionStatus} onStart={()=>void startStudy()} onStartUnit={(id)=>void startCourseUnit(id)} onStartAssessment={(id)=>void startUnitAssessment(id)} onStartMilestone={()=>void startMilestoneAssessment()} onStartB1Milestone={()=>void startB1MilestoneAssessment()} onStartB2Milestone={()=>void startB2MilestoneAssessment()} onStartC1Foundation={()=>void startC1FoundationAssessment()} onC1Practice={()=>void startC1FoundationPractice()} onProductive={(mode)=>void startProductive(mode)} onLexicalFluency={()=>void startLexicalFluency()} onRealWorldChain={(id)=>void startRealWorldChain(id)} onRealWorldQualification={()=>void startRealWorldQualification()}/>}
            {surface==="Immerse"&&<Immersion onStartProductionTask={(taskId)=>void startProductiveTask(taskId)} onStartC1Synthesis={(packId)=>void startC1Synthesis(packId)} onOpenC1Coach={(chainId)=>{setPreferredCoachChain(chainId);setSurface("Learn");}}/>}
            {surface==="Progress"&&<J8Progress kana={kanaMastery} vocab={vocabMastery} conjugation={conjugationMastery} grammar={grammarMastery} sentence={sentenceMastery} lexicalFluency={lexicalFluency} milestone={milestone} b1Milestone={b1Milestone} b2Milestone={b2Milestone} c1Foundation={c1Foundation} immersion={immersion} summary={summary} course={courseProgress} completedToday={completedToday}/>}
            {surface==="Library"&&<J7Library query={query} setQuery={setQuery} results={results} status={libraryStatus}/>}
          </>}
      </J2AppShell>}
  </>;
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
