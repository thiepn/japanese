import { Suspense,lazy,useEffect,useLayoutEffect,useRef,useState } from "react";
import { createThiepnAccountAuthProvider,getRecentJapaneseAuthFailure,type AuthContext } from "@thiepn/auth";
import { getDefaultAudioProvider } from "@thiepn/audio";
import { claimGuestWorkspace } from "@thiepn/local-db";
import type { SearchResult } from "@thiepn/search";
import { isStudyLesson,type StudyStep } from "@thiepn/study-player";
import { searchLocalJapanese } from "./content";
import { Immersion } from "./immerse/Immersion";
import { getImmersionProgress,type ImmersionProgress } from "./immerse/reader";
import { AUTHENTIC_GUEST_ACCOUNT_ID,setAuthenticAccountId } from "./immerse/authentic";
import { StudyPlayer,type StudyAnswer } from "./study/StudyPlayer";
import "./study/a1Excellence.css";
import "./study/a1ExcellenceE02.css";
import "./study/a2ExcellenceE03.css";
import "./study/a2ExcellenceE04.css";
import "./study/e05AdaptiveRecall.css";
import "./study/e06IndependentCourse.css";
import { StudySessionFence } from "./study/sessionFence";
import { DashboardRefreshGuard } from "./study/dashboardRefreshGuard";
import { AccountWorkspaceLease,attachWorkspaceWithLease,type WorkspaceLease } from "./study/accountWorkspaceLease";
import { J2AppShell,type J2Surface } from "./design/J2AppShell";
import { J3Today } from "./design/J3Today";
import { J4Learn } from "./design/J4Learn";
import { J7Library } from "./design/J7Library";
import { J8Progress } from "./design/J8Progress";
import { createJapaneseLanguageDashboardPublisher } from "./languageDashboard";
import {
  buildA1MilestoneSession,buildE01Session,buildE01DelayedSession,getE01Evidence,buildE02Session,buildE02DelayedSession,getE02Evidence,buildE03Session,buildE03DelayedSession,getE03Evidence,buildE04Session,buildE04DelayedSession,buildE04PreviewSession,getE04Evidence,buildE03PreviewSession,buildE05RepairSession,getE05Dashboard,buildE06Session,buildE06PreviewSession,buildE06DelayedSession,getE06Evidence,buildB1MilestoneSession,buildB2MilestoneSession,buildC1FoundationPractice,buildC1FoundationSession,buildCourseUnitSession,buildLexicalFluencyPractice,buildP13C1SynthesisSession,buildP9RealWorldChainSession,buildP9RealWorldQualificationSession,buildProductivePractice,buildProductiveTaskPractice,buildTodayQueue,buildUnitAssessmentSession,getA1MilestoneAssessmentProgress,getB1MilestoneAssessmentProgress,getB2MilestoneAssessmentProgress,getC1FoundationAssessmentProgress,getConjugationMasterySummary,getCourseProgress,getGrammarMasterySummary,getKanaMasterySummary,getLexicalFluencySummary,getSentenceMasterySummary,getCompletedTodayCount,getStudySummary,getVocabularyMasterySummary,recordStudyAnswer,GUEST_ACCOUNT_ID,getDevelopmentAccountId,setDevelopmentAccountId,
  type E01Progress,type E02Overview,type E03Overview,type E04Overview,type E05Evidence,type E06Overview,type A1MilestoneProgress,type B1MilestoneProgress,type B2MilestoneProgress,type C1FoundationProgress,type ConjugationMasterySummary,type CourseUnitProgress,type GrammarMasterySummary,type KanaMasterySummary,type LexicalFluencySummary,type SentenceMasterySummary,type StudySummary,type VocabularyMasterySummary
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
  const [sessionStatus,setSessionStatus]=useState<"idle"|"loading"|"error"|"empty">("idle");
  const [summary,setSummary]=useState<StudySummary>(EMPTY_SUMMARY);
  const [kanaMastery,setKanaMastery]=useState<KanaMasterySummary>(EMPTY_KANA);
  const [vocabMastery,setVocabMastery]=useState<VocabularyMasterySummary>(EMPTY_VOCAB);
  const [conjugationMastery,setConjugationMastery]=useState<ConjugationMasterySummary>(EMPTY_CONJUGATION);
  const [grammarMastery,setGrammarMastery]=useState<GrammarMasterySummary>(EMPTY_GRAMMAR);
  const [sentenceMastery,setSentenceMastery]=useState<SentenceMasterySummary>(EMPTY_SENTENCE);
  const [lexicalFluency,setLexicalFluency]=useState<LexicalFluencySummary>(EMPTY_LEXICAL_FLUENCY);
  const [courseProgress,setCourseProgress]=useState<CourseUnitProgress[]>([]);
  const [milestone,setMilestone]=useState<A1MilestoneProgress>(EMPTY_MILESTONE);
  const [e01,setE01]=useState<E01Progress>({status:"not_started",answered:0,correct:0,unscored:0,stages:[],canDo:"A1 introductory exchange",unitId:"",delayedCorrect:0});
  const [e02,setE02]=useState<E02Overview>({scenes:[],nextSceneId:null,started:0,readyForDelay:0,delayedReviewed:0,total:0});
  const [e03,setE03]=useState<E03Overview>({scenes:[],nextSceneId:null,started:0,readyForDelay:0,delayedReviewed:0,total:0,authored:10,unmapped:[],unmappedScenes:[]});
  const [e04,setE04]=useState<E04Overview>({scenes:[],authored:8,linked:0,unmapped:[],started:0,reviewReady:0,reviewed:0,nextSceneId:null});
  const [e05,setE05]=useState<E05Evidence>({controlled:{attempts:0,correct:0,distinctCorrect:0,listening:0,reading:0,formSelection:0,typedProduction:0},unscored:{writing:0,speech:0},delayed:{correct:0,attempts:0},repair:{pending:0,repaired:0,available:0},targets:[],canonical:{a1:0,a2:0,explicitA21:0,explicitA22:0,unsplitA2:0}});
  const [e06,setE06]=useState<E06Overview>({cases:[],total:0,linked:0,prerequisiteReady:0,active:0,waiting:0,ready:0,reviewed:0,unlinked:0,nextId:null,nextDelayedId:null});
  const [b1Milestone,setB1Milestone]=useState<B1MilestoneProgress>(EMPTY_B1_MILESTONE);
  const [b2Milestone,setB2Milestone]=useState<B2MilestoneProgress>(EMPTY_B2_MILESTONE);
  const [c1Foundation,setC1Foundation]=useState<C1FoundationProgress>(EMPTY_C1_FOUNDATION);
  const [immersion,setImmersion]=useState<ImmersionProgress>(EMPTY_IMMERSION);
  const [completedToday,setCompletedToday]=useState(0);
  const [preferredCoachChain,setPreferredCoachChain]=useState<string|null>(null);
  const [account,setAccount]=useState<AuthContext>(ANONYMOUS_AUTH);
  const [accountConnected,setAccountConnected]=useState(false);
  const [accountBusy,setAccountBusy]=useState(false);
  const [accountResolving,setAccountResolving]=useState(true);
  const [accountMessage,setAccountMessage]=useState<string|null>(null);
  const sessionFence=useRef(new StudySessionFence());
  const dashboardRefreshGuard=useRef(new DashboardRefreshGuard());
  const workspaceLease=useRef(new AccountWorkspaceLease());
  const sessionOwner=useRef<string|null>(null);

  // Never leave the previous owner's learner state visible after switching.
  function clearLearnerView(){
    sessionFence.current.invalidate();
    dashboardRefreshGuard.current.invalidate();
    JAPANESE_LANGUAGE_DASHBOARD.invalidate();
    sessionOwner.current=null;
    setSession(null);
    setSessionStatus("idle");
    setSummary(EMPTY_SUMMARY);
    setKanaMastery(EMPTY_KANA);
    setVocabMastery(EMPTY_VOCAB);
    setConjugationMastery(EMPTY_CONJUGATION);
    setGrammarMastery(EMPTY_GRAMMAR);
    setSentenceMastery(EMPTY_SENTENCE);
    setLexicalFluency(EMPTY_LEXICAL_FLUENCY);
    setCourseProgress([]);
    setMilestone(EMPTY_MILESTONE);
    setE01({status:"not_started",answered:0,correct:0,unscored:0,stages:[],canDo:"A1 introductory exchange",unitId:"",delayedCorrect:0});
    setE02({scenes:[],nextSceneId:null,started:0,readyForDelay:0,delayedReviewed:0,total:0});
    setE03({scenes:[],nextSceneId:null,started:0,readyForDelay:0,delayedReviewed:0,total:0,authored:10,unmapped:[],unmappedScenes:[]});
    setE04({scenes:[],authored:8,linked:0,unmapped:[],started:0,reviewReady:0,reviewed:0,nextSceneId:null});
    setE05({controlled:{attempts:0,correct:0,distinctCorrect:0,listening:0,reading:0,formSelection:0,typedProduction:0},unscored:{writing:0,speech:0},delayed:{correct:0,attempts:0},repair:{pending:0,repaired:0,available:0},targets:[],canonical:{a1:0,a2:0,explicitA21:0,explicitA22:0,unsplitA2:0}});
    setE06({cases:[],total:0,linked:0,prerequisiteReady:0,active:0,waiting:0,ready:0,reviewed:0,unlinked:0,nextId:null,nextDelayedId:null});
    setB1Milestone(EMPTY_B1_MILESTONE);
    setB2Milestone(EMPTY_B2_MILESTONE);
    setC1Foundation(EMPTY_C1_FOUNDATION);
    setImmersion(EMPTY_IMMERSION);
    setCompletedToday(0);
    // The local core Library index is public and not owner-scoped; keep its
    // current search results so switching accounts cannot strand its UI.
    setPreferredCoachChain(null);
  }

  useEffect(()=>{
    let active=true;
    const lease=workspaceLease.current;
    const switchWorkspace=(accountId:string)=>{
      if(getDevelopmentAccountId()!==accountId)clearLearnerView();
      setDevelopmentAccountId(accountId);
      setAuthenticAccountId(accountId);
    };
    const useGuestWorkspace=()=>{
      switchWorkspace(GUEST_ACCOUNT_ID);
      setAccountConnected(false);
    };
    const apply=async(next:AuthContext,ticket:WorkspaceLease)=>{
      const valid=()=>active&&lease.isCurrent(ticket);
      const authenticatedId=next.status==="authenticated"&&next.accountId
        ?next.accountId
        :null;
      if(!authenticatedId){
        if(!valid())return;
        useGuestWorkspace();
        setAccount(next);
        const diagnostic=getRecentJapaneseAuthFailure();
        setAccountMessage(next.status==="expired"||diagnostic
          ?`THIEPN Account sign-in did not complete${diagnostic?` (${diagnostic.code})`:""}. Open Japanese in Chrome and try again. Local study data is unchanged.`
          :null);
        return;
      }

      let attachment;
      try{
        attachment=await attachWorkspaceWithLease(lease,ticket,{
          connect:()=>JAPANESE_ACCOUNT.completePendingConnection(),
          readAuth:()=>JAPANESE_ACCOUNT.getCurrentContext(),
          claim:(allowed)=>claimGuestWorkspace(GUEST_ACCOUNT_ID,authenticatedId,allowed),
        });
      }catch{
        if(!valid())return;
        if(getDevelopmentAccountId()===authenticatedId){
          setAccountMessage("THIEPN Account connection or workspace attachment is temporarily unavailable. Your current local workspace remains available.");
          return;
        }
        useGuestWorkspace();
        setAccount(next);
        setAccountMessage("THIEPN Account is signed in, but Japanese could not safely attach this device. Guest progress remains available and no other workspace was overwritten.");
        return;
      }

      if(!valid()||!attachment)return;
      const accountId=attachment.connected?authenticatedId:GUEST_ACCOUNT_ID;
      switchWorkspace(accountId);
      setAccountConnected(attachment.connected);
      setAccount(next);
      setAccountMessage(
        attachment.connected
          ?attachment.claimResult==="target-populated"
            ?"THIEPN Account already has Japanese data on this device. Guest progress was kept separate rather than merged or overwritten; sign out to access the guest workspace."
            :attachment.claimResult==="migrated"
              ?"Local guest progress was attached to your THIEPN Account on this device."
              :null
          :"Signed in to THIEPN Account. Connect Japanese to attach this device.",
      );
    };
    const authUnavailable=()=>{
      if(!active)return;
      lease.invalidate();
      setAccountMessage("THIEPN Account could not be reached. Your current local workspace remains available.");
    };
    const unsubscribe=JAPANESE_ACCOUNT.subscribe((next)=>{
      const ticket=lease.observe(next);
      void apply(next,ticket).catch(()=>{
        if(active&&lease.isCurrent(ticket))authUnavailable();
      });
    });
    // A restored Android PWA may complete OAuth in another Chrome window.
    const revalidate=()=>{
      if(document.visibilityState!=="visible")return;
      void JAPANESE_ACCOUNT.refresh().catch(authUnavailable);
    };
    const onVisibility=()=>{if(document.visibilityState==="visible")revalidate();};
    window.addEventListener("focus",revalidate);
    window.addEventListener("pageshow",revalidate);
    document.addEventListener("visibilitychange",onVisibility);
    void JAPANESE_ACCOUNT.refresh()
      .catch(authUnavailable)
      .finally(()=>{if(active)setAccountResolving(false);});
    return()=>{
      active=false;lease.invalidate();unsubscribe();
      window.removeEventListener("focus",revalidate);
      window.removeEventListener("pageshow",revalidate);
      document.removeEventListener("visibilitychange",onVisibility);
    };
  },[]);
  useEffect(()=>{
    void refreshDashboard().then((applied)=>{
      // Do not publish an earlier owner's dashboard after an auth transition.
      if(applied&&account.status==="authenticated"&&accountConnected&&getDevelopmentAccountId()===account.accountId){
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

  function refreshDashboard():Promise<boolean>{
    const workspaceId=getDevelopmentAccountId();
    return dashboardRefreshGuard.current.run(
      workspaceId,
      getDevelopmentAccountId,
      ()=>Promise.all([
        getStudySummary(),getKanaMasterySummary(),getVocabularyMasterySummary(),getConjugationMasterySummary(),getGrammarMasterySummary(),getSentenceMasterySummary(),getLexicalFluencySummary(),getCourseProgress(),getA1MilestoneAssessmentProgress(),getB1MilestoneAssessmentProgress(),getB2MilestoneAssessmentProgress(),getC1FoundationAssessmentProgress(),getImmersionProgress(),getCompletedTodayCount(),getE01Evidence(),getE02Evidence(),getE03Evidence(),getE04Evidence(),getE05Dashboard(),getE06Evidence()
      ]),
      ([nextSummary,nextKana,nextVocab,nextConjugation,nextGrammar,nextSentence,nextLexicalFluency,nextCourse,nextMilestone,nextB1Milestone,nextB2Milestone,nextC1Foundation,nextImmersion,nextCompletedToday,nextE01,nextE02,nextE03,nextE04,nextE05,nextE06])=>{
        setSummary(nextSummary);setKanaMastery(nextKana);setVocabMastery(nextVocab);setConjugationMastery(nextConjugation);setGrammarMastery(nextGrammar);setSentenceMastery(nextSentence);setLexicalFluency(nextLexicalFluency);setCourseProgress(nextCourse);setMilestone(nextMilestone);setB1Milestone(nextB1Milestone);setB2Milestone(nextB2Milestone);setC1Foundation(nextC1Foundation);setImmersion(nextImmersion);setCompletedToday(nextCompletedToday);setE01(nextE01);setE02(nextE02);setE03(nextE03);setE04(nextE04);setE05(nextE05);setE06(nextE06);
      },
    );
  }

  async function performAccountAction(action:"signIn"|"connect"|"signOut"){
    if(accountBusy)return;
    setAccountBusy(true);
    setAccountMessage(null);
    const lease=workspaceLease.current;
    const ticket=lease.capture(account);
    try{
      if(action==="signIn"){
        if(account.status==="authenticated")return;
        await JAPANESE_ACCOUNT.signIn();
        return;
      }
      if(account.status!=="authenticated")return;
      if(action==="connect"){
        if(accountConnected||!ticket||!ticket.accountId)return;
        const accountId=ticket.accountId;
        const attachment=await attachWorkspaceWithLease(lease,ticket,{
          connect:async()=>{await JAPANESE_ACCOUNT.connectApp();return true;},
          readAuth:()=>JAPANESE_ACCOUNT.getCurrentContext(),
          claim:(allowed)=>claimGuestWorkspace(GUEST_ACCOUNT_ID,accountId,allowed),
        });
        if(!attachment?.connected||!lease.isCurrent(ticket))return;
        if(getDevelopmentAccountId()!==accountId)clearLearnerView();
        setDevelopmentAccountId(accountId);
        setAuthenticAccountId(accountId);
        setAccountConnected(true);
        setAccountMessage(
          attachment.claimResult==="target-populated"
            ?"THIEPN Account already has Japanese data on this device. Guest progress was kept separate rather than merged or overwritten; sign out to access the guest workspace."
            :attachment.claimResult==="migrated"
              ?"Local guest progress was attached to your THIEPN Account on this device."
              :null,
        );
        const dashboardApplied=await refreshDashboard();
        if(dashboardApplied&&lease.isCurrent(ticket)&&getDevelopmentAccountId()===accountId)
          void JAPANESE_LANGUAGE_DASHBOARD.publish().catch(()=>{
            if(lease.isCurrent(ticket))
              setAccountMessage("Japanese is connected to THIEPN Account, but the shared language dashboard could not be refreshed yet.");
          });
        return;
      }
      if(action!=="signOut")return;
      // Invalidate pending automatic and explicit claims before auth sign-out.
      lease.invalidate();
      await JAPANESE_ACCOUNT.signOut();
      // A different account might have signed in while sign-out was pending.
      if(!lease.isAnonymous())return;
      if(getDevelopmentAccountId()!==GUEST_ACCOUNT_ID)clearLearnerView();
      setDevelopmentAccountId(GUEST_ACCOUNT_ID);
      setAuthenticAccountId(AUTHENTIC_GUEST_ACCOUNT_ID);
      setAccountConnected(false);
      setAccount(ANONYMOUS_AUTH);
      setAccountMessage(null);
    }catch{
      if(action==="connect"&&(!ticket||!lease.isCurrent(ticket)))return;
      if(action==="signOut"&&!lease.isAnonymous())return;
      setAccountMessage("THIEPN Account is temporarily unavailable. Your local Japanese data has not been changed.");
    }finally{
      setAccountBusy(false);
    }
  }

  function openSession(queue:StudyStep[]){
    const audio=queue.filter((step)=>Boolean(step.audio)).flatMap((step)=>step.audio?[step.audio]:[]);
    if(audio.length)void getDefaultAudioProvider().prefetch(audio).catch(()=>{/* Audio prefetch failure is nonfatal. */});
    sessionOwner.current=queue.length?getDevelopmentAccountId():null;
    setSession(queue.length?queue:null);
  }

  async function loadStudySession(build:()=>Promise<StudyStep[]>){
    const ticket=sessionFence.current.begin(getDevelopmentAccountId());
    setSessionStatus("loading");
    try{
      const queue=await build();
      if(!sessionFence.current.accepts(ticket,getDevelopmentAccountId()))return;
      openSession(queue);
      setSessionStatus(queue.length?"idle":"empty");
    }catch{
      if(sessionFence.current.accepts(ticket,getDevelopmentAccountId()))setSessionStatus("error");
    }
  }

  const startStudy=()=>loadStudySession(()=>buildTodayQueue());
  const startE06=(id:string)=>loadStudySession(()=>buildE06Session(id));
  const startE06Preview=(id:string)=>loadStudySession(()=>buildE06PreviewSession(id));
  const startE06Delayed=(id:string)=>loadStudySession(()=>buildE06DelayedSession(id));
  const startE05Repair=()=>loadStudySession(()=>buildE05RepairSession());
  const startE03Preview=(id:string)=>loadStudySession(()=>buildE03PreviewSession(id));
  const startE04=(id:string)=>loadStudySession(()=>buildE04Session(id));
  const startE04Delayed=(id:string)=>loadStudySession(()=>buildE04DelayedSession(id));
  const startE04Preview=(id:string)=>loadStudySession(()=>buildE04PreviewSession(id));
  const startE03=(id:string)=>loadStudySession(()=>buildE03Session(id));
  const startE03Delayed=(id:string)=>loadStudySession(()=>buildE03DelayedSession(id));
  const startE02=(id:string)=>loadStudySession(()=>buildE02Session(id));
  const startE02Delayed=(id:string)=>loadStudySession(()=>buildE02DelayedSession(id));
  const startE01=()=>loadStudySession(()=>buildE01Session());
  const startE01Delayed=()=>loadStudySession(()=>buildE01DelayedSession());
  const startCourseUnit=(unitId:string)=>loadStudySession(()=>buildCourseUnitSession(unitId));
  const startUnitAssessment=(unitId:string)=>loadStudySession(()=>buildUnitAssessmentSession(unitId));
  const startMilestoneAssessment=()=>loadStudySession(()=>buildA1MilestoneSession());
  const startB1MilestoneAssessment=()=>loadStudySession(()=>buildB1MilestoneSession());
  const startB2MilestoneAssessment=()=>loadStudySession(()=>buildB2MilestoneSession());
  const startC1FoundationAssessment=()=>loadStudySession(()=>buildC1FoundationSession());
  const startC1FoundationPractice=()=>loadStudySession(()=>buildC1FoundationPractice());
  const startProductive=(mode:"writing"|"speaking")=>loadStudySession(()=>buildProductivePractice(mode));
  const startLexicalFluency=()=>loadStudySession(()=>buildLexicalFluencyPractice(12));
  const startProductiveTask=(taskId:string)=>loadStudySession(()=>buildProductiveTaskPractice(taskId));
  const startC1Synthesis=(packId:string)=>loadStudySession(()=>buildP13C1SynthesisSession(packId));
  const startRealWorldChain=(chainId:string)=>loadStudySession(()=>buildP9RealWorldChainSession(chainId));
  const startRealWorldQualification=()=>loadStudySession(()=>buildP9RealWorldQualificationSession(10));

  async function handleAnswer(answer:StudyAnswer){
    const workspaceId=getDevelopmentAccountId();
    if(sessionOwner.current!==workspaceId)throw new Error("Study session belongs to a different workspace.");
    await recordStudyAnswer({prompt:answer.prompt,response:answer.response,result:answer.grade.result,responseTimeMs:answer.responseTimeMs});
    if(getDevelopmentAccountId()===workspaceId)setCompletedToday((value)=>value+1);
  }
  function finishSession(){
    sessionFence.current.invalidate();
    sessionOwner.current=null;
    const active=document.activeElement;
    if(active instanceof HTMLElement)active.blur();
    setSession(null);
    requestAnimationFrame(()=>requestAnimationFrame(()=>window.scrollTo({top:0,left:0,behavior:"auto"})));
    void refreshDashboard().then((applied)=>{
      if(applied&&account.status==="authenticated"&&accountConnected&&getDevelopmentAccountId()===account.accountId){
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
      ?<main className="j5-study-shell" id="main-content" tabIndex={-1}><StudyPlayer steps={session} accountScope={getDevelopmentAccountId()} onAnswer={handleAnswer} onComplete={finishSession} onExit={finishSession}/></main>
      :<J2AppShell
        surface={surface}
        onSurfaceChange={navigateSurface}
        accountState={accountResolving?"loading":account.status}
        accountConnected={accountConnected}
        accountBusy={accountBusy||accountResolving}
        onAccountAction={(action)=>void performAccountAction(action)}
        accountStatus={accountMessage}
        diagnosticsMode={diagnosticsMode}
      >
        {diagnosticsMode
          ?<Suspense fallback={<p className="j2-account-status" role="status">Opening technical workspace…</p>}><J11Diagnostics key={getDevelopmentAccountId()} onExit={()=>navigateSurface(surface)} accountStatus={account.status} accountConnected={accountConnected}/></Suspense>
          :<>
            {surface==="Today"&&<J3Today e06={e06} onStartE06={(id)=>void startE06(id)} onStartE06Delayed={(id)=>void startE06Delayed(id)} e05={e05} onStartE05Repair={()=>void startE05Repair()} e04={e04} onStartE04={(id)=>void startE04(id)} onStartE04Delayed={(id)=>void startE04Delayed(id)} e03={e03} onStartE03={(id)=>void startE03(id)} onStartE03Delayed={(id)=>void startE03Delayed(id)} e02={e02} onStartE02={(id)=>void startE02(id)} onStartE02Delayed={(id)=>void startE02Delayed(id)} summary={summary} completedToday={completedToday} status={sessionStatus} e01={e01} onStartE01={()=>void startE01()} onStartE01Delayed={()=>void startE01Delayed()} onStart={()=>void startStudy()}/>}
            {surface==="Learn"&&<J4Learn e06={e06} onStartE06={(id)=>void startE06(id)} onStartE06Delayed={(id)=>void startE06Delayed(id)} onStartE06Preview={(id)=>void startE06Preview(id)} e05={e05} onStartE05Repair={()=>void startE05Repair()} onStartE03Preview={(id)=>void startE03Preview(id)} e04={e04} onStartE04={(id)=>void startE04(id)} onStartE04Delayed={(id)=>void startE04Delayed(id)} onStartE04Preview={(id)=>void startE04Preview(id)} e03={e03} onStartE03={(id)=>void startE03(id)} onStartE03Delayed={(id)=>void startE03Delayed(id)} e02={e02} onStartE02={(id)=>void startE02(id)} onStartE02Delayed={(id)=>void startE02Delayed(id)} e01={e01} onStartE01={()=>void startE01()} onStartE01Delayed={()=>void startE01Delayed()} summary={summary} kana={kanaMastery} vocab={vocabMastery} conjugation={conjugationMastery} grammar={grammarMastery} sentence={sentenceMastery} lexicalFluency={lexicalFluency} course={courseProgress} milestone={milestone} b1Milestone={b1Milestone} b2Milestone={b2Milestone} c1Foundation={c1Foundation} preferredCoachChain={preferredCoachChain} onPreferredCoachChainApplied={()=>setPreferredCoachChain(null)} status={sessionStatus} onStart={()=>void startStudy()} onStartUnit={(id)=>void startCourseUnit(id)} onStartAssessment={(id)=>void startUnitAssessment(id)} onStartMilestone={()=>void startMilestoneAssessment()} onStartB1Milestone={()=>void startB1MilestoneAssessment()} onStartB2Milestone={()=>void startB2MilestoneAssessment()} onStartC1Foundation={()=>void startC1FoundationAssessment()} onC1Practice={()=>void startC1FoundationPractice()} onProductive={(mode)=>void startProductive(mode)} onLexicalFluency={()=>void startLexicalFluency()} onRealWorldChain={(id)=>void startRealWorldChain(id)} onRealWorldQualification={()=>void startRealWorldQualification()}/>}
            {surface==="Immerse"&&<Immersion key={getDevelopmentAccountId()} e06={e06} onStartE06={(id)=>void startE06(id)} onStartE06Delayed={(id)=>void startE06Delayed(id)} onStartE06Preview={(id)=>void startE06Preview(id)} e05={e05} onStartE05Repair={()=>void startE05Repair()} onStartE03Preview={(id)=>void startE03Preview(id)} e04={e04} onStartE04={(id)=>void startE04(id)} onStartE04Preview={(id)=>void startE04Preview(id)} e03={e03} onStartE03={(id)=>void startE03(id)} e02={e02} onStartE02={(id)=>void startE02(id)} onStartE01={()=>void startE01()} onStartProductionTask={(taskId)=>void startProductiveTask(taskId)} onStartC1Synthesis={(packId)=>void startC1Synthesis(packId)} onOpenC1Coach={(chainId)=>{setPreferredCoachChain(chainId);setSurface("Learn");}}/>}
            {surface==="Progress"&&<J8Progress e06={e06} e05={e05} onStartE05Repair={()=>void startE05Repair()} e04={e04} e03={e03} e02={e02} e01={e01} kana={kanaMastery} vocab={vocabMastery} conjugation={conjugationMastery} grammar={grammarMastery} sentence={sentenceMastery} lexicalFluency={lexicalFluency} milestone={milestone} b1Milestone={b1Milestone} b2Milestone={b2Milestone} c1Foundation={c1Foundation} immersion={immersion} summary={summary} course={courseProgress} completedToday={completedToday}/>}
            {surface==="Library"&&<J7Library query={query} setQuery={(value)=>{setLibraryStatus("loading");setResults([]);setQuery(value);}} results={results} status={libraryStatus}/>}
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
