import {useEffect,useMemo,useRef,useState} from "react";
import {listMemoryTraces,listStudyEvents,saveStudyEvent} from "@thiepn/local-db";
import {gradeStudyPrompt} from "@thiepn/study-player";
import type {StudyEvent} from "@thiepn/domain";
import type {MemoryTrace} from "@thiepn/scheduler";
import {DEVELOPMENT_DEVICE_ID,getDevelopmentAccountId,recordStudyAnswer} from "../study/runtime";
import {normalizeP26} from "../study/pedagogy26";
import {grammarReflection} from "../study/feedback27";
import {P28SentenceBuilder} from "./P28SentenceBuilder";
import {P28Continuity} from "./P28Continuity";
import {P33RolePractice} from "./P33RolePractice";
import {p33RolePrompts,p33RolesForUnit} from "../study/role33";
import {p33SentencePrompts} from "../study/sentence33";
import {p34SentencePrompts} from "../study/sentence34";
import {p35PragmaticPrompts} from "../study/pragmatics35";
import {p36CorrectionPrompts} from "../study/correction36";
import {p38CrossUnitPrompts,p38CrossUnitForUnit} from "../study/transfer38";
import {p38ProductionPrompts,p38ProductionForUnit} from "../study/production38";
import {p39LifePrompts,p39CasesForUnit,p39AuthoredFeedback} from "../study/life39";
import {p40Prompts,p40ReturnPrompts,p40ArcsForUnit,p40TurnFeedback} from "../study/dialogue40";
import {p41Prompts,p41ReturnPrompts,p41ArcsForUnit,p41ArcById} from "../study/dialogue41";
import {p42Prompts,p42ReturnPrompts,p42ArcsForUnit,p42ArcById} from "../study/dialogue42";
import {p43Prompts,p43ReturnPrompts,p43ForUnit,p43Feedback,p43SceneById,type P43RouteKey} from "../study/dialogue43";
import {P43BranchConversation} from "./P43BranchConversation";
import {p44Prompts,p44ReturnPrompts,p44ForUnit,p44ById,p44AuthoredFeedback,type P44PracticeStep} from "../study/pragmatics44";
import {P44PragmaticsStudy} from "./P44PragmaticsStudy";
import {p45Prompts,p45ReturnPrompts,p45ForUnit,p45ById,p45Feedback} from "../study/independence45";
import {P45IndependentConversation} from "./P45IndependentConversation";
import {p46Prompts,p46ReturnPrompts,p46Readings,p46ForUnit,p46ById,p46AuthoredComparison} from "../study/reading46";
import {P46ReadingLibrary} from "./P46ReadingLibrary";
import {p47Prompts,p47ReturnPrompts,p47Scenes,p47ForUnit,p47ById,p47AuthoredFeedback} from "../study/listening47";
import {P47ListeningStudio} from "./P47ListeningStudio";
import {p48Prompts,p48ReturnPrompts,p48Cases,p48ForUnit,p48ById,p48Comparison} from "../study/connected48";
import {P48ConnectedSources} from "./P48ConnectedSources";
import {p49Prompts,p49ReturnPrompts,p49Documents,p49ForUnit,p49ById,p49AuthoredComparison} from "../study/documents49";
import {P49DocumentLibrary} from "./P49DocumentLibrary";
import {p50Prompts,p50ReturnPrompts,p50Missions,p50ForUnit,p50ById,p50AuthoredComparison} from "../study/integrated50";
import {P50IntegratedStudio} from "./P50IntegratedStudio";
import {p51Prompts,p51ReturnPrompts,p51Contrasts,p51ForUnit,p51ById,p51AuthoredComparison} from "../study/grammar51";
import {P51GrammarStudio} from "./P51GrammarStudio";
import {p52Prompts,p52TransformPrompts,p52ReturnPrompts,p52Transformations,p52ForUnit,p52ById,p52Compare} from "../study/transformation52";
import {P52TransformationStudio} from "./P52TransformationStudio";
import {p53Prompts,p53MeaningPrompts,p53ReturnPrompts,p53Vocabulary,p53ForUnit,p53ById,p53Compare} from "../study/vocabulary53";
import {P53VocabularyStudio} from "./P53VocabularyStudio";
import {p54Prompts,p54ComprehensionPrompts,p54ReturnPrompts,p54Readings,p54ForUnit,p54ById,p54AuthoredComparison} from "../study/reading54";
import {P54ReadingStudio} from "./P54ReadingStudio";
import {p55Prompts,p55ComprehensionPrompts,p55ReturnPrompts,p55Scenes,p55ForUnit,p55ById,p55AuthoredFeedback} from "../study/listening55";
import {P55ListeningStudio} from "./P55ListeningStudio";
import {p56Prompts,p56DecisionPrompts,p56ReturnPrompts,p56Scenes,p56ForUnit,p56ById,p56Compare} from "../study/interaction56";
import {P56InteractionStudio} from "./P56InteractionStudio";
import {p57Prompts,p57ComprehensionPrompts,p57ReturnPrompts,p57Threads,p57ForUnit,p57ById,p57AuthoredComparison} from "../study/writing57";
import {P57WritingStudio} from "./P57WritingStudio";
import {p58Prompts,p58ComprehensionPrompts,p58ReturnPrompts,p58Missions,p58ForUnit,p58ById,p58Compare,p58RelatedSource} from "../study/missions58";
import {P58MissionsStudio} from "./P58MissionsStudio";
import {p59Prompts,p59ComprehensionPrompts,p59ReturnPrompts,p59Missions,p59ForUnit,p59ById,p59AuthoredFeedback,p59RelatedSources} from "../study/performance59";
import {P59PerformanceStudio} from "./P59PerformanceStudio";
import {p60Prompts,p60ComprehensionPrompts,p60ReturnPrompts,p60Units,p60ForUnit,p60ById,p60Compare,p60HistoricalSources} from "../study/consolidation60";
import {historicalReturnEligibility,isHistoricalReturn} from "../study/returnEligibilityR2";
import {P60ConsolidationStudio} from "./P60ConsolidationStudio";
import {p28NewSentencePrompts} from "../study/sentence28";
import {p29AdditionalPrompts,p29LexicalPrompts,lexicalLinksForUnit,recommendP29Actions} from "../study/depth29";
import {describeP29Revision,p29RegisterExampleForUnit} from "../study/revision29";
import {p30TransformationPrompts,transformationForUnit} from "../study/pedagogy30";
import {continuityPrompts} from "../study/continuity28";
import {register28Prompts} from "../study/register28";
import {deriveWeakAreas,areaLabels} from "../study/remediation30";
import {recentP35Mistakes} from "../study/remediation35";
import {p36RemediationHint} from "../study/remediation36";
import {p37ReviewSignal} from "../study/reviewSignal37";
import {p31ContrastPrompts,p31ContrastForUnit} from "../study/contrast31";
import {planP31Recall,p31GlobalDue} from "../study/recall31";
import {p31SentencePrompts} from "../study/sentence31";
import {p32SentencePrompts} from "../study/sentence32";
import {p32ContrastPrompts,p32ContrastForUnit} from "../study/contrast32";
import {
  deriveJourneyProgress,journeyTypedPrompt,journeyUnits,journeyUnit,nextTurn,recommendedJourneyUnit,promptsForUnit,traceIdJourney,
  type JourneyPractice,type JourneySource,type JourneyStage,type JourneyOption,type JourneyUnitProgress
} from "../study/journey27";
import "./p27-journey.css";

type InputMode="compose"|"choose";
type SourceMode="core"|"context"|"repair";
interface SpeechCapture {
  lang:string;continuous:boolean;interimResults:boolean;
  onresult:((event:{results:ArrayLike<ArrayLike<{transcript:string}>>})=>void)|null;
  onerror:(()=>void)|null;onend:(()=>void)|null;start():void;stop():void;
}
interface Feedback { kind:"graded"|"ungraded"|"choice";message:string;model:string;notes:string[];next:string|null; }
interface RewriteReport {changed:boolean;oldLength:number;newLength:number;found:string[];missing:string[];}
const extraJourneyPrompts=[...p28NewSentencePrompts,...p29AdditionalPrompts,
  ...p29LexicalPrompts,...p30TransformationPrompts,...continuityPrompts,...register28Prompts,...p31ContrastPrompts,...p31SentencePrompts,...p32ContrastPrompts,...p32SentencePrompts,...p33RolePrompts,...p33SentencePrompts,...p34SentencePrompts,...p35PragmaticPrompts,...p36CorrectionPrompts,...p38CrossUnitPrompts,...p38ProductionPrompts,...p39LifePrompts,...p40Prompts,...p41Prompts,...p42Prompts,...p43Prompts,...p44Prompts,...p45Prompts,...p46Prompts,...p47Prompts,...p48Prompts,...p49Prompts,...p50Prompts,...p51Prompts,...p52Prompts,...p53Prompts,...p54Prompts,...p55Prompts,...p56Prompts,...p57Prompts,...p58Prompts,...p59Prompts,...p60Prompts];
const steps:[JourneyStage,string][]=[["learn","1 · Verstehen"],["build","2 · Satzbau"],["conversation","3 · Antworten"],["write","4 · Schreiben"],["practice","5 · Festigen"]];
function compareWriting(before:string,after:string,features:readonly string[]):RewriteReport{
  const oldText=normalizeP26(before),newText=normalizeP26(after);
  return {changed:oldText!==newText,oldLength:[...oldText].length,newLength:[...newText].length,
    found:features.filter(f=>newText.includes(normalizeP26(f))),
    missing:features.filter(f=>!newText.includes(normalizeP26(f)))};
}
export function P27LearningJourney({disabled,onSourcePractice,onJourneyPractice,onMistakePractice,onRoleDuePractice,onCorrectionDuePractice}:{
  disabled:boolean;
  onSourcePractice:(source:JourneySource,sourceId:string,mode:SourceMode)=>void;
  onJourneyPractice:(id:string,mode:JourneyPractice)=>void;
  onMistakePractice:(id:string,promptId:string)=>void;
  onRoleDuePractice:(unitId:string,scenarioId:string)=>void;
  onCorrectionDuePractice:(unitId:string,scenarioId:string)=>void;
}){
  const owner=getDevelopmentAccountId();
  const currentOwner=useRef(owner);currentOwner.current=owner;
  const dirtySpecialistDrafts=useRef(new Set<string>());
  // Only flags live in component memory; never persist actual learner prose.
  function reportSpecialistDraft(id:string,dirty:boolean){
    if(dirty)dirtySpecialistDrafts.current.add(id);
    else dirtySpecialistDrafts.current.delete(id);
  }
  const [unitId,setUnitId]=useState(journeyUnits[0]!.id);
  const [level,setLevel]=useState<"all"|"A1"|"A2">("all");
  const [query,setQuery]=useState("");
  const [stage,setStage]=useState<JourneyStage>("learn");
  const [progress,setProgress]=useState<JourneyUnitProgress[]>([]);
  const [evidence,setEvidence]=useState<{events:StudyEvent[];traces:MemoryTrace[]}|null>(null);
  const [loading,setLoading]=useState(true);
  const [loadError,setLoadError]=useState("");
  const [reload,setReload]=useState(0);
  const [nodeId,setNodeId]=useState("");
  const [stepsTaken,setStepsTaken]=useState(0);
  const [inputMode,setInputMode]=useState<InputMode>("compose");
  const [answer,setAnswer]=useState("");
  const [firstConversationDraft,setFirstConversationDraft]=useState("");
  const [choiceExampleSeen,setChoiceExampleSeen]=useState(false);
  const [feedback,setFeedback]=useState<Feedback|null>(null);
  const [hintUsed,setHintUsed]=useState(false);
  const [speechUsed,setSpeechUsed]=useState(false);
  const [showTranslation,setShowTranslation]=useState(false);
  const [inlineContrastAnswer,setInlineContrastAnswer]=useState<string|null>(null);
  const [p38Choice,setP38Choice]=useState<{id:string;answer:string}|null>(null);
  const [p39Choice,setP39Choice]=useState<{id:string;answer:string}|null>(null);
  const [p39WritingId,setP39WritingId]=useState("");
  const [p40ArcId,setP40ArcId]=useState("");
  const [p40TurnIndex,setP40TurnIndex]=useState(0);
  const [p40Choice,setP40Choice]=useState("");
  const [p40GuidedHistory,setP40GuidedHistory]=useState<Array<{turnId:string;partner:string;answer:string;note:string}>>([]);
  const [p40GuidedFinished,setP40GuidedFinished]=useState(false);
  const [p40WritingArcId,setP40WritingArcId]=useState("");
  const [p40WritingTurnIndex,setP40WritingTurnIndex]=useState(1);
  const [p43WritingSceneId,setP43WritingSceneId]=useState("");
  const [p43WritingRoute,setP43WritingRoute]=useState<P43RouteKey>("repair");
  const [p44WritingId,setP44WritingId]=useState("");
  const [p44WritingStep,setP44WritingStep]=useState<"production"|"reply">("production");
  const [p45WritingId,setP45WritingId]=useState("");
  const [p45WritingIndex,setP45WritingIndex]=useState(2);
  const [p46WritingId,setP46WritingId]=useState("");
  const [p47WritingId,setP47WritingId]=useState("");
  const [p48WritingId,setP48WritingId]=useState("");
  const [p49WritingId,setP49WritingId]=useState("");
  const [p50WritingId,setP50WritingId]=useState("");
  const [p51WritingId,setP51WritingId]=useState("");
  const [p52WritingId,setP52WritingId]=useState("");
  const [p53WritingId,setP53WritingId]=useState("");
  const [p54WritingId,setP54WritingId]=useState("");
  const [p55WritingId,setP55WritingId]=useState("");
  const [p56WritingId,setP56WritingId]=useState("");
  const [p57WritingId,setP57WritingId]=useState("");
  const [p58WritingId,setP58WritingId]=useState("");
  const [p59WritingId,setP59WritingId]=useState("");
  const [p60WritingId,setP60WritingId]=useState("");
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [voiceStatus,setVoiceStatus]=useState("");
  const [draft,setDraft]=useState("");
  const [rewrite,setRewrite]=useState("");
  const [rewriteStage,setRewriteStage]=useState<"draft"|"revise"|"compare">("draft");
  const [report,setReport]=useState<RewriteReport|null>(null);
  const [saved,setSaved]=useState(false);
  const microphone=useRef<SpeechCapture|null>(null);
  const started=useRef(0);
  // Ephemeral exposure guards: preserve FSRS evidence across a replay in the same unit.
  const revealedTurnIds=useRef<Set<string>>(new Set());
  const unit=journeyUnit(unitId);
  const turn=unit.turns.find(t=>t.id===nodeId)??unit.turns[0]!;
  const profile=progress.find(p=>p.id===unitId);
  const recommended=recommendedJourneyUnit(progress);
  const recommendedUnit=journeyUnit(recommended);
  // Resume only from actual owner-scoped graded StudyEvents, never from an
  // invented course-completion ledger or previously unsent Japanese drafts.
  const lastWorked=progress.filter(item=>Boolean(item.lastPracticedAt))
    .sort((a,b)=>(b.lastPracticedAt??"").localeCompare(a.lastPracticedAt??""))[0];
  const lastWorkedUnit=lastWorked?journeyUnits.find(item=>item.id===lastWorked.id):undefined;
  const learningLinks=lexicalLinksForUnit(unitId);
  const pragmatics=p29RegisterExampleForUnit(unitId);
  const transformation=transformationForUnit(unitId);
  const contrast=p31ContrastForUnit(unitId);
  const roleScenarios=p33RolesForUnit(unitId);
  const p32Contrast=p32ContrastForUnit(unitId);
  const p32Question=p32ContrastPrompts.find(p=>p.eventMetadata?.unitId===unitId);
  const p38TransferCases=p38CrossUnitForUnit(unitId);
  const p38WritingCases=p38ProductionForUnit(unitId);
  const p39UnitCases=p39CasesForUnit(unitId);
  const p41UnitArcs=p41ArcsForUnit(unitId);
  const p42UnitArcs=p42ArcsForUnit(unitId);
  const p43UnitScenes=p43ForUnit(unitId);
  const p44UnitCases=p44ForUnit(unitId);
  const p45UnitChallenges=p45ForUnit(unitId);
  const p46UnitReadings=p46ForUnit(unitId);
  const p47UnitScenes=p47ForUnit(unitId);
  const p48UnitCases=p48ForUnit(unitId);
  const p49UnitDocuments=p49ForUnit(unitId);
  const p50UnitMissions=p50ForUnit(unitId);
  const p51UnitContrasts=p51ForUnit(unitId);
  const p52UnitTasks=p52ForUnit(unitId);
  const p53UnitWords=p53ForUnit(unitId);
  const p54UnitReadings=p54ForUnit(unitId);
  const p55UnitScenes=p55ForUnit(unitId);
  const p56UnitScenes=p56ForUnit(unitId);
  const p57UnitThreads=p57ForUnit(unitId);
  const p58UnitMissions=p58ForUnit(unitId);
  const p59UnitMissions=p59ForUnit(unitId);
  const p60UnitLessons=p60ForUnit(unitId);
  const p40UnitArcs=[...p42UnitArcs,...p41UnitArcs,...p40ArcsForUnit(unitId)];
  const globalRecall=useMemo(()=>evidence?
    p31GlobalDue(evidence.traces,evidence.events,extraJourneyPrompts):[],
    [evidence]);
  const dueUnits=globalRecall.filter(item=>item.due>0).slice(0,4);
  const nearestReturn=globalRecall.filter(item=>item.nextDueAt)
    .sort((a,b)=>Date.parse(a.nextDueAt!)-Date.parse(b.nextDueAt!))[0];
  const recallPlan=useMemo(()=>evidence?
    planP31Recall(unitId,evidence.traces,evidence.events,extraJourneyPrompts):null,
    [unitId,evidence]);
  const weakAreas=useMemo(()=>evidence?deriveWeakAreas(unitId,evidence.traces,evidence.events,
    extraJourneyPrompts):null,[unitId,evidence]);
  const mistakes=useMemo(()=>evidence?
    recentP35Mistakes(unitId,evidence.events,extraJourneyPrompts):[],
    [unitId,evidence]);
  const p39Priority=p39UnitCases.find(c=>mistakes.some(m=>m.promptId==="p39-context-"+c.id||m.promptId==="p39-repair-"+c.id))??p39UnitCases[0];
  const p39Chosen=p39UnitCases.find(c=>c.id===p39WritingId);
  const p40Recommended=p40UnitArcs.find(arc=>mistakes.some(m=>
    m.promptId.startsWith("p40-turn-"+arc.id+"-t")||
    m.promptId.startsWith("p41-turn-"+arc.id+"-t")||
    m.promptId.startsWith("p42-turn-"+arc.id+"-t")||
    m.promptId==="p40-return-"+arc.id||m.promptId==="p41-return-"+arc.id||m.promptId==="p42-return-"+arc.id))??p40UnitArcs[0];
  const p40ActiveArc=p40UnitArcs.find(arc=>arc.id===p40ArcId)??p40Recommended;
  const p40CurrentTurn=p40ActiveArc?.turns[p40TurnIndex];
  const p40WritingArc=p40UnitArcs.find(arc=>arc.id===p40WritingArcId);
  const p40WritingTurn=p40WritingArc?.turns[p40WritingTurnIndex];
  const p41ActiveArc=p40ActiveArc?(p41ArcById(p40ActiveArc.id)??p42ArcById(p40ActiveArc.id)):undefined;
  const p42ActiveArc=p40ActiveArc?p42ArcById(p40ActiveArc.id):undefined;
  const p51WritingContrast=p51ById(p51WritingId);
  const p52WritingTask=p52ById(p52WritingId);
  const p53WritingWord=p53ById(p53WritingId);
  const p54WritingReading=p54ById(p54WritingId);
  const p55WritingScene=p55ById(p55WritingId);
  const p56WritingScene=p56ById(p56WritingId);
  const p57WritingThread=p57ById(p57WritingId);
  const p58WritingMission=p58ById(p58WritingId);
  const p59WritingMission=p59ById(p59WritingId);
  const p60WritingLesson=p60ById(p60WritingId);
  const p50WritingMission=p50ById(p50WritingId);
  const p49WritingDocument=p49ById(p49WritingId);
  const p48WritingCase=p48ById(p48WritingId);
  const p47WritingScene=p47ById(p47WritingId);
  const p46WritingPassage=p46ById(p46WritingId);
  const p45WritingChallenge=p45UnitChallenges.find(c=>c.id===p45WritingId);
  const p45WritingTurn=p45WritingChallenge?.turns[p45WritingIndex];
  const p44WritingCase=p44UnitCases.find(c=>c.id===p44WritingId);
  const p44WritingTask=p44WritingCase?(p44WritingStep==="reply"?
    p44WritingCase.followupTask:p44WritingCase.intention):null;
  const p43WritingScene=p43UnitScenes.find(s=>s.id===p43WritingSceneId);
  const p43WritingDetail=p43WritingScene?.routes[p43WritingRoute];
  const p43Recommended=p43UnitScenes.find(s=>mistakes.some(m=>
    m.promptId==="p43-decision-"+s.id||m.promptId==="p43-return-"+s.id||
    m.promptId.endsWith("-"+s.id)&&m.promptId.startsWith("p43-route-")))??p43UnitScenes[0];
  const p60Recommended=p60UnitLessons.find(lesson=>mistakes.some(m=>
    m.promptId==="p60-strategy-"+lesson.id||m.promptId==="p60-writing-"+lesson.id||
    m.promptId==="p60-followup-"+lesson.id||m.promptId==="p60-revision-"+lesson.id||
    m.promptId==="p60-return-"+lesson.id||m.promptId.startsWith("p60-question-"+lesson.id+"-")))??p60UnitLessons[0];
  const p59Recommended=p59UnitMissions.find(mission=>mistakes.some(m=>
    m.promptId==="p59-strategy-"+mission.id||m.promptId==="p59-write-"+mission.id||
    m.promptId==="p59-reply-"+mission.id||m.promptId==="p59-revision-"+mission.id||
    m.promptId==="p59-return-"+mission.id||m.promptId.startsWith("p59-question-"+mission.id+"-")))??p59UnitMissions[0];
  const p58Recommended=p58UnitMissions.find(mission=>mistakes.some(m=>
    m.promptId==="p58-decision-"+mission.id||m.promptId==="p58-write-"+mission.id||
    m.promptId==="p58-reply-"+mission.id||m.promptId==="p58-repair-"+mission.id||
    m.promptId==="p58-return-"+mission.id||m.promptId.startsWith("p58-question-"+mission.id+"-")))??p58UnitMissions[0];
  const p57Recommended=p57UnitThreads.find(thread=>mistakes.some(m=>
    m.promptId==="p57-compose-"+thread.id||m.promptId==="p57-reply-"+thread.id||
    m.promptId==="p57-revision-"+thread.id||m.promptId==="p57-return-"+thread.id||
    m.promptId.startsWith("p57-question-"+thread.id+"-")))??p57UnitThreads[0];
  const p56Recommended=p56UnitScenes.find(scene=>mistakes.some(m=>
    m.promptId==="p56-decision-"+scene.id||m.promptId==="p56-production-"+scene.id||
    m.promptId==="p56-return-"+scene.id||
    m.promptId.startsWith("p56-route-")&&m.promptId.endsWith("-"+scene.id)))??p56UnitScenes[0];
  const p55Recommended=p55UnitScenes.find(scene=>mistakes.some(m=>
    m.promptId==="p55-response-"+scene.id||m.promptId==="p55-return-"+scene.id||
    m.promptId.startsWith("p55-question-"+scene.id+"-")||
    m.promptId.startsWith("p55-word-"+scene.id+"-")))??p55UnitScenes[0];
  const p54Recommended=p54UnitReadings.find(r=>mistakes.some(m=>
    m.promptId==="p54-write-"+r.id||m.promptId==="p54-return-"+r.id||
    m.promptId.startsWith("p54-question-"+r.id+"-")||
    m.promptId.startsWith("p54-vocabulary-"+r.id+"-")))??p54UnitReadings[0];
  const p53Recommended=p53UnitWords.find(v=>mistakes.some(m=>
    ["p53-meaning-","p53-production-","p53-return-"].some(prefix=>
      m.promptId===prefix+v.id)))??p53UnitWords[0];
  const p52Recommended=p52UnitTasks.find(t=>mistakes.some(m=>
    ["p52-transform-","p52-production-","p52-return-"].some(prefix=>
      m.promptId===prefix+t.id)))??p52UnitTasks[0];
  const p51Recommended=p51UnitContrasts.find(c=>mistakes.some(m=>
    m.promptId==="p51-production-"+c.id||m.promptId==="p51-return-"+c.id||
    m.promptId==="p51-meaning-"+c.id))??p51UnitContrasts[0];
  const p50Recommended=p50UnitMissions.find(mission=>mistakes.some(m=>
    m.promptId==="p50-write-"+mission.id||m.promptId==="p50-return-"+mission.id||
    m.promptId.startsWith("p50-question-"+mission.id+"-")||
    m.promptId.startsWith("p50-word-"+mission.id+"-")))??p50UnitMissions[0];
  const p49Recommended=p49UnitDocuments.find(d=>mistakes.some(m=>
    m.promptId==="p49-write-"+d.id||m.promptId==="p49-return-"+d.id||
    m.promptId.startsWith("p49-question-"+d.id+"-")||
    m.promptId.startsWith("p49-word-"+d.id+"-")))??p49UnitDocuments[0];
  const p48Recommended=p48UnitCases.find(c=>mistakes.some(m=>
    m.promptId==="p48-write-"+c.id||m.promptId==="p48-return-"+c.id||
    m.promptId.startsWith("p48-question-"+c.id+"-")))??p48UnitCases[0];
  const p47Recommended=p47UnitScenes.find(scene=>mistakes.some(m=>
    m.promptId==="p47-response-"+scene.id||m.promptId==="p47-return-"+scene.id||
    m.promptId.startsWith("p47-question-"+scene.id+"-")))??p47UnitScenes[0];
  const p46Recommended=p46UnitReadings.find(r=>mistakes.some(m=>
    m.promptId==="p46-write-"+r.id||m.promptId==="p46-return-"+r.id||
    m.promptId.startsWith("p46-question-"+r.id+"-")||m.promptId.startsWith("p46-word-"+r.id+"-")))??p46UnitReadings[0];
  const p45Recommended=p45UnitChallenges.find(c=>mistakes.some(m=>
    m.promptId==="p45-return-"+c.id||
    c.turns.some(t=>m.promptId==="p45-turn-"+t.id)))??p45UnitChallenges[0];
  const p44Recommended=p44UnitCases.find(c=>mistakes.some(m=>
    ["p44-contrast-","p44-production-","p44-reply-","p44-return-"].some(prefix=>
      m.promptId===prefix+c.id)))??p44UnitCases[0];
  const p52RecallReadyIds=useMemo(()=>{
    if(!evidence)return [];
    const now=Date.now(),yesterday=now-24*60*60*1000;
    const dueOrSpaced=(promptId:string)=>{
      const original=p52TransformPrompts.find(p=>p.id===promptId);
      if(!original)return false;
      const trace=evidence.traces.find(t=>t.id===traceIdJourney(original));
      const dueAt=trace?Date.parse(trace.card.due):NaN;
      if(trace&&Number.isFinite(dueAt)&&dueAt<=now)return true;
      // Genuine prior graded event plus elapsed delay unlocks a new transfer;
      // it does not claim the transfer itself has an FSRS due time.
      return evidence.events.some(e=>e.metadata?.promptId===original.id&&
        (e.result==="correct"||e.result==="incorrect")&&
        e.metadata?.schedulerExcluded!==true&&
        Number.isFinite(Date.parse(e.occurredAt))&&Date.parse(e.occurredAt)<=yesterday);
    };
    return p52Transformations.filter(t=>dueOrSpaced("p52-transform-"+t.id)).map(t=>t.id);
  },[evidence]);
  const p53RecallReadyIds=useMemo(()=>{
    if(!evidence)return [];
    const now=Date.now(),aged=now-86400000;
    const traces=new Map(evidence.traces.map(t=>[t.id,t]));
    const old=new Set(evidence.events.filter(e=>
      (e.result==="correct"||e.result==="incorrect")&&
      e.metadata?.schedulerExcluded!==true&&
      typeof e.metadata?.promptId==="string"&&
      Number.isFinite(Date.parse(e.occurredAt))&&Date.parse(e.occurredAt)<=aged)
     .map(e=>String(e.metadata?.promptId)));
    const firstByWord=new Map(p53MeaningPrompts.map(p=>[String(p.eventMetadata?.vocabularyId),p]));
    const returnByWord=new Map(p53ReturnPrompts.map(p=>[String(p.eventMetadata?.vocabularyId),p]));
    return p53Vocabulary.filter(v=>{
      const first=firstByWord.get(v.id),ret=returnByWord.get(v.id);
      if(!first||!ret)return false;
      if(traces.has(traceIdJourney(ret)))return true;
      const trace=traces.get(traceIdJourney(first));
      const due=trace?Date.parse(trace.card.due):NaN;
      return (Number.isFinite(due)&&due<=now)||old.has(first.id);
    }).map(v=>v.id);
  },[evidence]);
  const p54RecallReadyIds=useMemo(()=>{
    if(!evidence)return [];
    const now=Date.now(),aged=now-86400000;
    const traceById=new Map(evidence.traces.map(t=>[t.id,t]));
    const gradedOld=new Set(evidence.events.filter(e=>
      (e.result==="correct"||e.result==="incorrect")&&
      e.metadata?.schedulerExcluded!==true&&
      Number.isFinite(Date.parse(e.occurredAt))&&Date.parse(e.occurredAt)<=aged&&
      typeof e.metadata?.promptId==="string")
      .map(e=>String(e.metadata?.promptId)));
    const originals=new Map<string,typeof p54ComprehensionPrompts[number]>();
    for(const prompt of p54ComprehensionPrompts){
      const id=String(prompt.eventMetadata?.readingId);
      if(!originals.has(id))originals.set(id,prompt);
    }
    const returnById=new Map(p54ReturnPrompts.map(p=>[String(p.eventMetadata?.readingId),p]));
    return p54Readings.filter(reading=>{
      const first=originals.get(reading.id),ret=returnById.get(reading.id);
      if(!first||!ret)return false;
      if(traceById.has(traceIdJourney(ret)))return true;
      const prior=traceById.get(traceIdJourney(first));
      const when=prior?Date.parse(prior.card.due):NaN;
      return (Number.isFinite(when)&&when<=now)||gradedOld.has(first.id);
    }).map(r=>r.id);
  },[evidence]);
  const p55RecallReadyIds=useMemo(()=>{
    if(!evidence)return [];
    const now=Date.now(),aged=now-86400000;
    const traceById=new Map(evidence.traces.map(t=>[t.id,t]));
    const older=new Set(evidence.events.filter(e=>
      (e.result==="correct"||e.result==="incorrect")&&
      e.metadata?.schedulerExcluded!==true&&
      Number.isFinite(Date.parse(e.occurredAt))&&Date.parse(e.occurredAt)<=aged&&
      typeof e.metadata?.promptId==="string")
      .map(e=>String(e.metadata?.promptId)));
    const firstByScene=new Map<string,typeof p55ComprehensionPrompts[number]>();
    for(const prompt of p55ComprehensionPrompts){
      const id=String(prompt.eventMetadata?.sceneId);
      if(!firstByScene.has(id))firstByScene.set(id,prompt);
    }
    const returns=new Map(p55ReturnPrompts.map(p=>[String(p.eventMetadata?.sceneId),p]));
    return p55Scenes.filter(scene=>{
      const first=firstByScene.get(scene.id),ret=returns.get(scene.id);
      if(!first||!ret)return false;
      if(traceById.has(traceIdJourney(ret)))return true;
      const previous=traceById.get(traceIdJourney(first));
      const due=previous?Date.parse(previous.card.due):NaN;
      return (Number.isFinite(due)&&due<=now)||older.has(first.id);
    }).map(s=>s.id);
  },[evidence]);
  const p56RecallReadyIds=useMemo(()=>{
    if(!evidence)return [];
    const now=Date.now(),aged=now-86400000;
    const traceById=new Map(evidence.traces.map(t=>[t.id,t]));
    const older=new Set(evidence.events.filter(e=>
      (e.result==="correct"||e.result==="incorrect")&&
      e.metadata?.schedulerExcluded!==true&&
      Number.isFinite(Date.parse(e.occurredAt))&&Date.parse(e.occurredAt)<=aged&&
      typeof e.metadata?.promptId==="string").map(e=>String(e.metadata?.promptId)));
    const firstByScene=new Map(p56DecisionPrompts.map(p=>[String(p.eventMetadata?.sceneId),p]));
    const returns=new Map(p56ReturnPrompts.map(p=>[String(p.eventMetadata?.sceneId),p]));
    return p56Scenes.filter(scene=>{
      const first=firstByScene.get(scene.id),ret=returns.get(scene.id);
      if(!first||!ret)return false;
      if(traceById.has(traceIdJourney(ret)))return true;
      const prior=traceById.get(traceIdJourney(first));
      const due=prior?Date.parse(prior.card.due):NaN;
      return (Number.isFinite(due)&&due<=now)||older.has(first.id);
    }).map(scene=>scene.id);
  },[evidence]);
  const p57RecallReadyIds=useMemo(()=>{
    if(!evidence)return [];
    const now=Date.now(),aged=now-86400000;
    const traceById=new Map(evidence.traces.map(t=>[t.id,t]));
    const older=new Set(evidence.events.filter(e=>
      (e.result==="correct"||e.result==="incorrect")&&
      e.metadata?.schedulerExcluded!==true&&
      Number.isFinite(Date.parse(e.occurredAt))&&Date.parse(e.occurredAt)<=aged&&
      typeof e.metadata?.promptId==="string")
      .map(e=>String(e.metadata?.promptId)));
    const firstById=new Map<string,typeof p57ComprehensionPrompts[number]>();
    for(const prompt of p57ComprehensionPrompts){
      const id=String(prompt.eventMetadata?.threadId);
      if(!firstById.has(id))firstById.set(id,prompt);
    }
    const returns=new Map(p57ReturnPrompts.map(p=>[String(p.eventMetadata?.threadId),p]));
    return p57Threads.filter(thread=>{
      const first=firstById.get(thread.id),ret=returns.get(thread.id);
      if(!first||!ret)return false;
      if(traceById.has(traceIdJourney(ret)))return true;
      const prior=traceById.get(traceIdJourney(first));
      const due=prior?Date.parse(prior.card.due):NaN;
      return (Number.isFinite(due)&&due<=now)||older.has(first.id);
    }).map(t=>t.id);
  },[evidence]);
  const p58RecallReadyIds=useMemo(()=>{
    if(!evidence)return [];
    const now=Date.now(),aged=now-86400000;
    const traceById=new Map(evidence.traces.map(t=>[t.id,t]));
    const older=new Set(evidence.events.filter(e=>
      (e.result==="correct"||e.result==="incorrect")&&
      e.metadata?.schedulerExcluded!==true&&
      Number.isFinite(Date.parse(e.occurredAt))&&Date.parse(e.occurredAt)<=aged&&
      typeof e.metadata?.promptId==="string").map(e=>String(e.metadata?.promptId)));
    const firstById=new Map<string,typeof p58ComprehensionPrompts[number]>();
    for(const prompt of p58ComprehensionPrompts){
      const id=String(prompt.eventMetadata?.missionId);
      if(!firstById.has(id))firstById.set(id,prompt);
    }
    const returns=new Map(p58ReturnPrompts.map(p=>[String(p.eventMetadata?.missionId),p]));
    return p58Missions.filter(mission=>{
      const first=firstById.get(mission.id),ret=returns.get(mission.id);
      if(!first||!ret)return false;
      if(traceById.has(traceIdJourney(ret)))return true;
      const previous=traceById.get(traceIdJourney(first));
      const due=previous?Date.parse(previous.card.due):NaN;
      return (Number.isFinite(due)&&due<=now)||older.has(first.id);
    }).map(m=>m.id);
  },[evidence]);
  const p59RecallReadyIds=useMemo(()=>{
    if(!evidence)return [];
    const now=Date.now(),aged=now-86400000;
    const traceById=new Map(evidence.traces.map(t=>[t.id,t]));
    const older=new Set(evidence.events.filter(e=>
      (e.result==="correct"||e.result==="incorrect")&&
      e.metadata?.schedulerExcluded!==true&&
      Number.isFinite(Date.parse(e.occurredAt))&&Date.parse(e.occurredAt)<=aged&&
      typeof e.metadata?.promptId==="string").map(e=>String(e.metadata?.promptId)));
    const firstById=new Map<string,typeof p59ComprehensionPrompts[number]>();
    for(const prompt of p59ComprehensionPrompts){
      const id=String(prompt.eventMetadata?.missionId);
      if(!firstById.has(id))firstById.set(id,prompt);
    }
    const returns=new Map(p59ReturnPrompts.map(p=>[String(p.eventMetadata?.missionId),p]));
    return p59Missions.filter(mission=>{
      const first=firstById.get(mission.id),ret=returns.get(mission.id);
      if(!first||!ret)return false;
      if(traceById.has(traceIdJourney(ret)))return true;
      const previous=traceById.get(traceIdJourney(first));
      const due=previous?Date.parse(previous.card.due):NaN;
      return (Number.isFinite(due)&&due<=now)||older.has(first.id);
    }).map(m=>m.id);
  },[evidence]);
  const p60Historical=useMemo(()=>{
    if(!evidence)return [];
    const validIds=new Set(journeyUnits.map(unit=>unit.id));
    return p60HistoricalSources("*",extraJourneyPrompts,
      evidence.events,evidence.traces,traceIdJourney,Date.now(),validIds);
  },[evidence]);
  const p60RecallReadyIds=useMemo(()=>{
    if(!evidence)return [];
    const now=Date.now(),aged=now-86400000;
    const traces=new Map(evidence.traces.map(t=>[t.id,t]));
    const gradedOld=new Set(evidence.events.filter(e=>
      (e.result==="correct"||e.result==="incorrect")&&
      e.metadata?.schedulerExcluded!==true&&
      Number.isFinite(Date.parse(e.occurredAt))&&Date.parse(e.occurredAt)<=aged&&
      typeof e.metadata?.promptId==="string").map(e=>String(e.metadata?.promptId)));
    const first=new Map<string,typeof p60ComprehensionPrompts[number]>();
    for(const p of p60ComprehensionPrompts){
      const id=String(p.eventMetadata?.sourceUnit);
      if(!first.has(id))first.set(id,p);
    }
    const ret=new Map(p60ReturnPrompts.map(p=>[String(p.eventMetadata?.sourceUnit),p]));
    return p60Units.filter(unit=>{
      const q=first.get(unit.id),returnPrompt=ret.get(unit.id);
      if(!q||!returnPrompt)return false;
      if(traces.has(traceIdJourney(returnPrompt)))return true;
      const initial=traces.get(traceIdJourney(q));
      const due=initial?Date.parse(initial.card.due):NaN;
      return (Number.isFinite(due)&&due<=now)||gradedOld.has(q.id);
    }).map(u=>u.id);
  },[evidence]);
  const p40ReturnCueStatus=[...p60ReturnPrompts,...p59ReturnPrompts,...p58ReturnPrompts,...p57ReturnPrompts,...p56ReturnPrompts,...p55ReturnPrompts,...p54ReturnPrompts,...p53ReturnPrompts,...p52ReturnPrompts,...p51ReturnPrompts,...p50ReturnPrompts,...p49ReturnPrompts,...p48ReturnPrompts,...p47ReturnPrompts,...p46ReturnPrompts,...p45ReturnPrompts,...p44ReturnPrompts,...p43ReturnPrompts,...p42ReturnPrompts,...p41ReturnPrompts,...p40ReturnPrompts].filter(p=>
    Array.isArray(p.eventMetadata?.unitIds)&&p.eventMetadata.unitIds.includes(unitId))
    .map(prompt=>{
      const historicalReturn=isHistoricalReturn(prompt);
      const historicalStatus=historicalReturn?historicalReturnEligibility(
        prompt,evidence?.traces??[],evidence?.events??[],Date.now()):null;
      const trace=evidence?.traces.find(t=>t.id===traceIdJourney(prompt));
      const when=trace?Date.parse(trace.card.due):NaN;
      return {id:prompt.id,historicalReturn,historicalReady:historicalStatus?.eligible??false,
        historicalStatus:historicalStatus?.status,arcId:String(prompt.eventMetadata?.arcId??prompt.eventMetadata?.sceneId??
          prompt.eventMetadata?.caseId??prompt.eventMetadata?.challengeId??prompt.eventMetadata?.readingId??prompt.eventMetadata?.sceneId??prompt.eventMetadata?.documentId??prompt.eventMetadata?.missionId??prompt.eventMetadata?.sourceUnit??prompt.eventMetadata?.contrastId??prompt.eventMetadata?.transformationId??prompt.eventMetadata?.vocabularyId),
        planned:Boolean(trace&&Number.isFinite(when)),
        due:Boolean(trace&&Number.isFinite(when)&&when<=Date.now()),
        p52Ready:prompt.eventMetadata?.p52===true&&p52RecallReadyIds.includes(String(prompt.eventMetadata?.transformationId)),
        p53Ready:prompt.eventMetadata?.p53===true&&p53RecallReadyIds.includes(String(prompt.eventMetadata?.vocabularyId)),
        p54Ready:prompt.eventMetadata?.p54===true&&p54RecallReadyIds.includes(String(prompt.eventMetadata?.readingId)),
        p55Ready:prompt.eventMetadata?.p55===true&&p55RecallReadyIds.includes(String(prompt.eventMetadata?.sceneId)),
        p56Ready:prompt.eventMetadata?.p56===true&&p56RecallReadyIds.includes(String(prompt.eventMetadata?.sceneId)),
        p57Ready:prompt.eventMetadata?.p57===true&&p57RecallReadyIds.includes(String(prompt.eventMetadata?.threadId)),
        p58Ready:prompt.eventMetadata?.p58===true&&p58RecallReadyIds.includes(String(prompt.eventMetadata?.missionId)),
        p59Ready:prompt.eventMetadata?.p59===true&&p59RecallReadyIds.includes(String(prompt.eventMetadata?.missionId)),
        p60Ready:prompt.eventMetadata?.p60===true&&p60RecallReadyIds.includes(String(prompt.eventMetadata?.sourceUnit))};
    });
  const reviewCatalog=useMemo(()=>promptsForUnit(unitId,extraJourneyPrompts),[unitId]);
  const nextActions=useMemo(()=>evidence?
    recommendP29Actions(unitId,progress,evidence.events,evidence.traces):[],
    [unitId,progress,evidence]);
  const filtered=useMemo(()=>journeyUnits.filter(u=>
    (level==="all"||u.level===level)&&(!query.trim()||
      (u.title+" "+u.goal+" "+u.words.map(w=>w.form+" "+w.meaning).join(" ")).toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))
  ),[level,query]);
  useEffect(()=>{
    let active=true;setLoading(true);setLoadError("");setEvidence(null);
    void Promise.all([listStudyEvents(owner),listMemoryTraces(owner)]).then(([events,traces])=>{
      if(active&&currentOwner.current===owner){
        const personalTraces=traces.filter(t=>t.userId===owner);
        const personalEvents=events.filter(e=>e.userId===owner);
        setEvidence({events:personalEvents,traces:personalTraces});
        setProgress(deriveJourneyProgress(personalTraces,personalEvents,Date.now(),extraJourneyPrompts));
      }
    }).catch(()=>{if(active)setLoadError("Lernverlauf nicht verfügbar; die Übungen können trotzdem verwendet werden.");})
      .finally(()=>{if(active)setLoading(false);});
    return()=>{active=false;};
  },[owner,reload]);
  useEffect(()=>{
    microphone.current?.stop();microphone.current=null;revealedTurnIds.current.clear();
    setNodeId(unit.turns[0]!.id);setStepsTaken(0);setAnswer("");setFirstConversationDraft("");setFeedback(null);
    setChoiceExampleSeen(false);
    setHintUsed(false);setSpeechUsed(false);setShowTranslation(false);setInputMode("compose");setInlineContrastAnswer(null);setP38Choice(null);setP39Choice(null);setP39WritingId("");
    setP40ArcId("");setP40TurnIndex(0);setP40Choice("");setP40WritingArcId("");setP40WritingTurnIndex(1);
    setP43WritingSceneId("");setP43WritingRoute("repair");
    setP44WritingId("");setP44WritingStep("production");
    setP45WritingId("");setP45WritingIndex(2);
    setP46WritingId(prev=>p46ById(prev)?.units.includes(unitId)?prev:"");
    setP47WritingId(prev=>p47ById(prev)?.units.includes(unitId)?prev:"");
    setP48WritingId(prev=>p48ById(prev)?.units.includes(unitId)?prev:"");
    setP49WritingId(prev=>p49ById(prev)?.units.includes(unitId)?prev:"");
    setP50WritingId(prev=>p50ById(prev)?.units.includes(unitId)?prev:"");
    setP51WritingId(prev=>p51ById(prev)?.units.includes(unitId)?prev:"");
    setP52WritingId(prev=>p52ById(prev)?.units.includes(unitId)?prev:"");
    setP53WritingId(prev=>p53ById(prev)?.units.includes(unitId)?prev:"");
    setP54WritingId(prev=>p54ById(prev)?.units.includes(unitId)?prev:"");
    setP55WritingId(prev=>p55ById(prev)?.units.includes(unitId)?prev:"");
    setP56WritingId(prev=>p56ById(prev)?.units.includes(unitId)?prev:"");
    setP57WritingId(prev=>p57ById(prev)?.units.includes(unitId)?prev:"");
    setP58WritingId(prev=>p58ById(prev)?.units.includes(unitId)?prev:"");
    setP59WritingId(prev=>p59ById(prev)?.units.includes(unitId)?prev:"");
    setP60WritingId(prev=>p60ById(prev)?.units.includes(unitId)?prev:"");
    setP40GuidedHistory([]);setP40GuidedFinished(false);
    setError("");setDraft("");setRewrite("");
    setRewriteStage("draft");setReport(null);setSaved(false);setVoiceStatus("");
    started.current=performance.now();
  },[unitId,owner]);
  // A German explanation is a learning scaffold even if switched off later.
  // Track the turn, not just the current checkbox value, across navigation.
  useEffect(()=>{
    if(showTranslation&&nodeId!=="__finished__"){
      revealedTurnIds.current.add(unitId+":"+turn.id);
    }
  },[unitId,nodeId,showTranslation,turn.id]);
  useEffect(()=>()=>microphone.current?.stop(),[]);
  function confirmUnsentWriting():boolean{
    // A native confirmation preserves the current component in place on cancel.
    // No private Japanese prose is written into localStorage/sessionStorage or
    // any second persistence system.
    if((stage!=="write"||(!draft.trim()&&!rewrite.trim()))&&
       dirtySpecialistDrafts.current.size===0)return true;
    return typeof window!=="undefined"&&window.confirm(
      "Du hast einen noch nicht abgeschlossenen japanischen Entwurf. Beim Wechsel geht dieser ungespeicherte Text verloren. Entwurf verwerfen und wechseln?");
  }
  function startPractice(id:string,focus:JourneyPractice){
    if(!confirmUnsentWriting())return;
    onJourneyPractice(id,focus);
  }
  function startSourcePractice(source:JourneySource,id:string,mode:SourceMode){
    if(!confirmUnsentWriting())return;
    onSourcePractice(source,id,mode);
  }
  function startMistakePractice(id:string,promptId:string){
    if(!confirmUnsentWriting())return;
    onMistakePractice(id,promptId);
  }
  function startRoleDuePractice(id:string,scenarioId:string){
    if(!confirmUnsentWriting())return;
    onRoleDuePractice(id,scenarioId);
  }
  function startCorrectionDuePractice(id:string,scenarioId:string){
    if(!confirmUnsentWriting())return;
    onCorrectionDuePractice(id,scenarioId);
  }
  function selectUnit(id:string,next:JourneyStage="learn"):boolean{
    if(!journeyUnits.some(item=>item.id===id))return false;
    if(id!==unitId&&!confirmUnsentWriting())return false;
    setUnitId(id);setStage(next);return true;
  }
  function chooseP40Writing(arcId:string,turnIndex?:number){
    if(!confirmUnsentWriting())return;
    setP53WritingId("");setP54WritingId("");setP55WritingId("");setP56WritingId("");setP57WritingId("");setP58WritingId("");setP59WritingId("");setP60WritingId("");
    setP40WritingArcId(arcId);setP39WritingId("");setP43WritingSceneId("");setP44WritingId("");setP45WritingId("");setP46WritingId("");setP47WritingId("");setP48WritingId("");setP49WritingId("");setP50WritingId("");setP51WritingId("");setP52WritingId("");setP53WritingId("");setP54WritingId("");setP55WritingId("");setP56WritingId("");setP57WritingId("");setP58WritingId("");setP59WritingId("");setP60WritingId("");
    const target=p41ArcById(arcId)??p42ArcById(arcId);
    setP40WritingTurnIndex(turnIndex??(target?target.pivotTurn-1:1));
    setDraft("");setRewrite("");setRewriteStage("draft");setReport(null);setSaved(false);
    setStage("write");
  }
  function chooseP43Writing(sceneId:string,route:P43RouteKey){
    if(!confirmUnsentWriting())return;
    if(!p43ForUnit(unitId).some(s=>s.id===sceneId))return;
    setP43WritingSceneId(sceneId);setP43WritingRoute(route);
    setP40WritingArcId("");setP39WritingId("");setP44WritingId("");setP45WritingId("");setP46WritingId("");setP47WritingId("");setP48WritingId("");setP49WritingId("");setP50WritingId("");setP51WritingId("");setP52WritingId("");setP53WritingId("");setP54WritingId("");setP55WritingId("");setP56WritingId("");setP57WritingId("");setP58WritingId("");setP59WritingId("");setP60WritingId("");
    setDraft("");setRewrite("");setRewriteStage("draft");setReport(null);setSaved(false);
    setStage("write");
  }
  function chooseP44Writing(id:string,step:"production"|"reply"){
    if(!confirmUnsentWriting())return;
    if(!p44ForUnit(unitId).some(c=>c.id===id))return;
    setP44WritingId(id);setP44WritingStep(step);
    setP40WritingArcId("");setP39WritingId("");setP43WritingSceneId("");setP45WritingId("");setP46WritingId("");setP47WritingId("");setP48WritingId("");setP49WritingId("");setP50WritingId("");setP51WritingId("");setP52WritingId("");setP53WritingId("");setP54WritingId("");setP55WritingId("");setP56WritingId("");setP57WritingId("");setP58WritingId("");setP59WritingId("");setP60WritingId("");
    setDraft("");setRewrite("");setRewriteStage("draft");setReport(null);setSaved(false);
    setStage("write");
  }
  function chooseP45Writing(id:string,turnIndex:number){
    if(!confirmUnsentWriting())return;
    if(!p45ForUnit(unitId).some(c=>c.id===id))return;
    setP45WritingId(id);setP45WritingIndex(turnIndex);
    setP40WritingArcId("");setP39WritingId("");setP43WritingSceneId("");setP44WritingId("");setP46WritingId("");setP47WritingId("");setP48WritingId("");setP49WritingId("");setP50WritingId("");setP51WritingId("");setP52WritingId("");setP53WritingId("");setP54WritingId("");setP55WritingId("");setP56WritingId("");setP57WritingId("");setP58WritingId("");setP59WritingId("");setP60WritingId("");
    setDraft("");setRewrite("");setRewriteStage("draft");setReport(null);setSaved(false);
    setStage("write");
  }
  function chooseP46Writing(readingId:string){
    if(!confirmUnsentWriting())return;
    const reading=p46ById(readingId);
    if(!reading)return;
    setUnitId(reading.units[0]!);
    setP46WritingId(reading.id);
    setP40WritingArcId("");setP39WritingId("");setP43WritingSceneId("");
    setP44WritingId("");setP45WritingId("");setP47WritingId("");setP48WritingId("");setP49WritingId("");setP50WritingId("");setP51WritingId("");setP52WritingId("");setP53WritingId("");setP54WritingId("");setP55WritingId("");setP56WritingId("");setP57WritingId("");setP58WritingId("");setP59WritingId("");setP60WritingId("");
    setDraft("");setRewrite("");setRewriteStage("draft");setReport(null);setSaved(false);
    setStage("write");
  }
  function chooseP47Writing(sceneId:string){
    if(!confirmUnsentWriting())return;
    const scene=p47ById(sceneId);
    if(!scene)return;
    setUnitId(scene.units[0]!);
    setP47WritingId(scene.id);
    setP40WritingArcId("");setP39WritingId("");setP43WritingSceneId("");
    setP44WritingId("");setP45WritingId("");setP46WritingId("");setP48WritingId("");setP49WritingId("");setP50WritingId("");setP51WritingId("");setP52WritingId("");setP53WritingId("");setP54WritingId("");setP55WritingId("");setP56WritingId("");setP57WritingId("");setP58WritingId("");setP59WritingId("");setP60WritingId("");
    setDraft("");setRewrite("");setRewriteStage("draft");setReport(null);setSaved(false);
    setStage("write");
  }
  function chooseP48Writing(caseId:string){
    if(!confirmUnsentWriting())return;
    const item=p48ById(caseId);
    if(!item)return;
    setUnitId(item.units[0]!);
    setP48WritingId(item.id);
    setP40WritingArcId("");setP39WritingId("");setP43WritingSceneId("");
    setP44WritingId("");setP45WritingId("");setP46WritingId("");setP47WritingId("");
    setDraft("");setRewrite("");setRewriteStage("draft");setReport(null);setSaved(false);
    setStage("write");
  }
  function chooseP49Writing(documentId:string){
    if(!confirmUnsentWriting())return;
    const doc=p49ById(documentId);
    if(!doc)return;
    setUnitId(doc.units[0]!);
    setP49WritingId(doc.id);
    setP40WritingArcId("");setP39WritingId("");setP43WritingSceneId("");
    setP44WritingId("");setP45WritingId("");setP46WritingId("");
    setP47WritingId("");setP48WritingId("");
    setDraft("");setRewrite("");setRewriteStage("draft");setReport(null);setSaved(false);
    setStage("write");
  }
  function chooseP50Writing(missionId:string){
    if(!confirmUnsentWriting())return;
    const mission=p50ById(missionId);
    if(!mission)return;
    setUnitId(mission.units[0]!);
    setP50WritingId(mission.id);
    setP40WritingArcId("");setP39WritingId("");setP43WritingSceneId("");
    setP44WritingId("");setP45WritingId("");setP46WritingId("");
    setP47WritingId("");setP48WritingId("");setP49WritingId("");
    setDraft("");setRewrite("");setRewriteStage("draft");setReport(null);setSaved(false);
    setStage("write");
  }
  function chooseP51Writing(contrastId:string){
    if(!confirmUnsentWriting())return;
    const contrast=p51ById(contrastId);
    if(!contrast)return;
    setUnitId(contrast.units[0]!);
    setP51WritingId(contrast.id);setP52WritingId("");setP53WritingId("");setP54WritingId("");setP55WritingId("");setP56WritingId("");setP57WritingId("");setP58WritingId("");setP59WritingId("");setP60WritingId("");
    setP40WritingArcId("");setP39WritingId("");setP43WritingSceneId("");
    setP44WritingId("");setP45WritingId("");setP46WritingId("");
    setP47WritingId("");setP48WritingId("");setP49WritingId("");setP50WritingId("");
    setDraft("");setRewrite("");setRewriteStage("draft");setReport(null);setSaved(false);
    setStage("write");
  }
  function chooseP52Writing(taskId:string){
    if(!confirmUnsentWriting())return;
    const t=p52ById(taskId);
    if(!t)return;
    setUnitId(t.units[0]!);
    setP52WritingId(t.id);setP53WritingId("");setP54WritingId("");setP55WritingId("");setP56WritingId("");setP57WritingId("");setP58WritingId("");setP59WritingId("");setP60WritingId("");
    setP51WritingId("");setP50WritingId("");setP49WritingId("");
    setP48WritingId("");setP47WritingId("");setP46WritingId("");
    setP45WritingId("");setP44WritingId("");setP43WritingSceneId("");
    setP40WritingArcId("");setP39WritingId("");
    setDraft("");setRewrite("");setRewriteStage("draft");setReport(null);setSaved(false);
    setStage("write");
  }
  function chooseP53Writing(id:string){
    if(!confirmUnsentWriting())return;
    const v=p53ById(id);
    if(!v)return;
    setUnitId(v.units[0]!);setP53WritingId(v.id);setP54WritingId("");setP55WritingId("");setP56WritingId("");setP57WritingId("");setP58WritingId("");setP59WritingId("");setP60WritingId("");
    setP52WritingId("");setP51WritingId("");setP50WritingId("");
    setP49WritingId("");setP48WritingId("");setP47WritingId("");
    setP46WritingId("");setP45WritingId("");setP44WritingId("");
    setP43WritingSceneId("");setP40WritingArcId("");setP39WritingId("");
    setDraft("");setRewrite("");setRewriteStage("draft");setReport(null);setSaved(false);
    setStage("write");
  }
  function chooseP54Writing(id:string){
    if(!confirmUnsentWriting())return;
    const r=p54ById(id);
    if(!r)return;
    setUnitId(r.units[0]!);setP54WritingId(r.id);setP55WritingId("");setP56WritingId("");setP57WritingId("");setP58WritingId("");setP59WritingId("");setP60WritingId("");
    setP53WritingId("");setP52WritingId("");setP51WritingId("");
    setP50WritingId("");setP49WritingId("");setP48WritingId("");
    setP47WritingId("");setP46WritingId("");setP45WritingId("");
    setP44WritingId("");setP43WritingSceneId("");
    setP40WritingArcId("");setP39WritingId("");
    setDraft("");setRewrite("");setRewriteStage("draft");setReport(null);setSaved(false);
    setStage("write");
  }
  function chooseP55Writing(id:string){
    if(!confirmUnsentWriting())return;
    const scene=p55ById(id);
    if(!scene)return;
    setUnitId(scene.units[0]!);setP55WritingId(scene.id);setP56WritingId("");setP57WritingId("");setP58WritingId("");setP59WritingId("");setP60WritingId("");
    setP54WritingId("");setP53WritingId("");setP52WritingId("");
    setP51WritingId("");setP50WritingId("");setP49WritingId("");
    setP48WritingId("");setP47WritingId("");setP46WritingId("");
    setP45WritingId("");setP44WritingId("");setP43WritingSceneId("");
    setP40WritingArcId("");setP39WritingId("");
    setDraft("");setRewrite("");setRewriteStage("draft");setReport(null);setSaved(false);
    setStage("write");
  }
  function chooseP56Writing(id:string){
    if(!confirmUnsentWriting())return;
    const scene=p56ById(id);
    if(!scene)return;
    setUnitId(scene.units[0]!);setP56WritingId(scene.id);setP57WritingId("");setP58WritingId("");setP59WritingId("");setP60WritingId("");
    setP55WritingId("");setP54WritingId("");setP53WritingId("");
    setP52WritingId("");setP51WritingId("");setP50WritingId("");
    setP49WritingId("");setP48WritingId("");setP47WritingId("");
    setP46WritingId("");setP45WritingId("");setP44WritingId("");
    setP43WritingSceneId("");setP40WritingArcId("");setP39WritingId("");
    setDraft("");setRewrite("");setRewriteStage("draft");setReport(null);setSaved(false);
    setStage("write");
  }
  function chooseP57Writing(id:string){
    if(!confirmUnsentWriting())return;
    const thread=p57ById(id);
    if(!thread)return;
    setUnitId(thread.units[0]!);setP57WritingId(thread.id);setP58WritingId("");setP59WritingId("");setP60WritingId("");
    setP56WritingId("");setP55WritingId("");setP54WritingId("");
    setP53WritingId("");setP52WritingId("");setP51WritingId("");
    setP50WritingId("");setP49WritingId("");setP48WritingId("");
    setP47WritingId("");setP46WritingId("");setP45WritingId("");
    setP44WritingId("");setP43WritingSceneId("");
    setP40WritingArcId("");setP39WritingId("");
    setDraft("");setRewrite("");setRewriteStage("draft");setReport(null);setSaved(false);
    setStage("write");
  }
  function chooseP58Writing(id:string){
    if(!confirmUnsentWriting())return;
    const mission=p58ById(id);
    if(!mission)return;
    setUnitId(mission.units[0]!);setP58WritingId(mission.id);setP59WritingId("");setP60WritingId("");
    setP57WritingId("");setP56WritingId("");setP55WritingId("");
    setP54WritingId("");setP53WritingId("");setP52WritingId("");
    setP51WritingId("");setP50WritingId("");setP49WritingId("");
    setP48WritingId("");setP47WritingId("");setP46WritingId("");
    setP45WritingId("");setP44WritingId("");setP43WritingSceneId("");
    setP40WritingArcId("");setP39WritingId("");
    setDraft("");setRewrite("");setRewriteStage("draft");setReport(null);setSaved(false);
    setStage("write");
  }
  function chooseP59Writing(id:string){
    if(!confirmUnsentWriting())return;
    const mission=p59ById(id);
    if(!mission)return;
    setUnitId(mission.units[0]!);setP59WritingId(mission.id);setP60WritingId("");
    setP58WritingId("");setP57WritingId("");setP56WritingId("");
    setP55WritingId("");setP54WritingId("");setP53WritingId("");
    setP52WritingId("");setP51WritingId("");setP50WritingId("");
    setP49WritingId("");setP48WritingId("");setP47WritingId("");
    setP46WritingId("");setP45WritingId("");setP44WritingId("");
    setP43WritingSceneId("");setP40WritingArcId("");setP39WritingId("");
    setDraft("");setRewrite("");setRewriteStage("draft");setReport(null);setSaved(false);
    setStage("write");
  }
  function chooseP60Writing(id:string){
    if(!confirmUnsentWriting())return;
    const lesson=p60ById(id);
    if(!lesson)return;
    setUnitId(lesson.units[0]!);setP59WritingId("");
    setP60WritingId(lesson.id);setP58WritingId("");setP57WritingId("");
    setP56WritingId("");setP55WritingId("");setP54WritingId("");
    setP53WritingId("");setP52WritingId("");setP51WritingId("");
    setP50WritingId("");setP49WritingId("");setP48WritingId("");
    setP47WritingId("");setP46WritingId("");setP45WritingId("");
    setP44WritingId("");setP43WritingSceneId("");setP40WritingArcId("");
    setP39WritingId("");
    setDraft("");setRewrite("");setRewriteStage("draft");setReport(null);setSaved(false);
    setStage("write");
  }
  function resetDialogue(){
    setNodeId(unit.turns[0]!.id);setStepsTaken(0);setAnswer("");setFirstConversationDraft("");setFeedback(null);
    setChoiceExampleSeen(false);
    setHintUsed(false);setSpeechUsed(false);setError("");started.current=performance.now();
  }
  function speak(text:string){
    if(!("speechSynthesis" in window))return;
    window.speechSynthesis.cancel();
    const utterance=new SpeechSynthesisUtterance(text);utterance.lang="ja-JP";utterance.rate=.85;
    window.speechSynthesis.speak(utterance);
  }
  function recognize(target:"answer"|"draft"|"rewrite"){
    const browser=window as typeof window & {SpeechRecognition?:new()=>SpeechCapture;webkitSpeechRecognition?:new()=>SpeechCapture};
    const Recognition=browser.SpeechRecognition??browser.webkitSpeechRecognition;
    if(!Recognition){setVoiceStatus("Spracherkennung nicht verfügbar. Text eintippen.");return;}
    microphone.current?.stop();
    const rec=new Recognition();microphone.current=rec;rec.lang="ja-JP";
    rec.continuous=false;rec.interimResults=false;
    rec.onresult=e=>{
      const value=e.results[0]?.[0]?.transcript?.trim()??"";
      if(!value)return;
      if(target==="answer"){setAnswer(value);setSpeechUsed(true);setFeedback(null);}
      if(target==="draft"){setDraft(value);setRewriteStage("draft");setReport(null);}
      if(target==="rewrite"){setRewrite(value);setRewriteStage("revise");setReport(null);}
    };
    rec.onerror=()=>setVoiceStatus("Spracherkennung fehlgeschlagen; bitte eintippen.");
    rec.onend=()=>setVoiceStatus("Erkennung beendet. Transkript bitte überprüfen.");
    try{rec.start();setVoiceStatus("Spracherkennung läuft …");}
    catch{setVoiceStatus("Mikrofon konnte nicht gestartet werden.");}
  }
  async function ungraded(kind:"response"|"rewrite",text:string,help:boolean){
    const account=currentOwner.current;
    if(account!==getDevelopmentAccountId())throw new Error("P27_WORKSPACE_CHANGED");
    const event:StudyEvent={
      id:crypto.randomUUID(),userId:account,deviceId:DEVELOPMENT_DEVICE_ID,
      occurredAt:new Date().toISOString(),activity:"writing",
      primaryTarget:{kind:"production_task",id:"p27:"+kind+":"+unit.id},
      skillDimension:"production",promptFamily:"p27-free-response",
      responseMode:"typed",result:"skipped",attempts:1,
      contextId:"p27:unit:"+unit.id,sourceId:"thiepn-original",contentVersion:"p27-1",
      metadata:{p27:true,unitId:unit.id,kind,ungraded:true,schedulerExcluded:true,
        rawTextStored:false,length:[...normalizeP26(text)].length,helpUsed:help,
        ...(kind==="response"?{turnId:turn.id}:{}),
        ...(kind==="rewrite"&&p39Chosen?{p39:true,authoredCaseId:p39Chosen.id,
          sourceContextId:"p39:repair:"+p39Chosen.id}:{}),
        ...(kind==="rewrite"&&p60WritingLesson?{
          p60:true,authoredLessonId:p60WritingLesson.id,
          sourceContextId:"p60:unit:"+p60WritingLesson.id,
          cumulativeA2:true,multisourceWriting:true,
          freeWritingSemanticallyGraded:false,recordedNativeAudio:false,
          rawTextStored:false,schedulerExcluded:true
        }:{}),
        ...(kind==="rewrite"&&p59WritingMission?{
          p59:true,authoredMissionId:p59WritingMission.id,
          sourceContextId:"p59:mission:"+p59WritingMission.id,
          modality:"long-reading-message-device-tts",guidedRewrite:true,
          independentLongSourceWriting:true,measuredListening:false,
          freeWritingSemanticallyGraded:false,rawTextStored:false,
          schedulerExcluded:true
        }:{}),
        ...(kind==="rewrite"&&p58WritingMission?{
          p58:true,authoredMissionId:p58WritingMission.id,
          sourceContextId:"p58:mission:"+p58WritingMission.id,
          modality:"notice-message-device-tts",guidedRewrite:true,
          crossModalContext:true,measuredListening:false,
          freeWritingSemanticallyGraded:false,rawTextStored:false,
          schedulerExcluded:true
        }:{}),
        ...(kind==="rewrite"&&p57WritingThread?{
          p57:true,authoredThreadId:p57WritingThread.id,
          sourceContextId:"p57:writing:"+p57WritingThread.id,
          genre:p57WritingThread.genre,register:p57WritingThread.register,
          guidedRewrite:true,multiMessageContext:true,
          freeWritingSemanticallyGraded:false,rawTextStored:false,
          schedulerExcluded:true
        }:{}),
        ...(kind==="rewrite"&&p56WritingScene?{
          p56:true,authoredSceneId:p56WritingScene.id,
          sourceContextId:"p56:interaction:"+p56WritingScene.id,
          register:p56WritingScene.register,guidedRewrite:true,
          conversationSimulated:true,liveConversationAssessment:false,
          rawTextStored:false,schedulerExcluded:true
        }:{}),
        ...(kind==="rewrite"&&p55WritingScene?{
          p55:true,authoredSceneId:p55WritingScene.id,
          sourceContextId:"p55:listening:"+p55WritingScene.id,
          genre:p55WritingScene.genre,sourceModality:"device-tts-optional",
          speakerPracticeUnassessed:true,recordedAudio:false,guidedRewrite:true
        }:{}),
        ...(kind==="rewrite"&&p54WritingReading?{
          p54:true,authoredReadingId:p54WritingReading.id,
          sourceContextId:"p54:reading:"+p54WritingReading.id,
          genre:p54WritingReading.genre,guidedRewrite:true,evidenceBased:true
        }:{}),
        ...(kind==="rewrite"&&p53WritingWord?{
          p53:true,authoredVocabularyId:p53WritingWord.id,
          sourceContextId:"p53:usage:"+p53WritingWord.id,
          lexicalDomain:p53WritingWord.domain,guidedRewrite:true
        }:{}),
        ...(kind==="rewrite"&&p52WritingTask?{
          p52:true,authoredTransformationId:p52WritingTask.id,
          sourceContextId:"p52:transformation:"+p52WritingTask.id,
          grammarDomain:p52WritingTask.domain,operation:p52WritingTask.mode,
          guidedRewrite:true
        }:{}),
        ...(kind==="rewrite"&&p51WritingContrast?{
          p51:true,authoredContrastId:p51WritingContrast.id,
          sourceContextId:"p51:contrast:"+p51WritingContrast.id,
          grammarDomain:p51WritingContrast.domain,guidedRewrite:true
        }:{ }),
        ...(kind==="rewrite"&&p50WritingMission?{
          p50:true,authoredMissionId:p50WritingMission.id,
          sourceContextId:"p50:integrated:"+p50WritingMission.id,
          sourceModalities:["reading","synthetic-tts"],guidedRewrite:true
        }:{ }),
        ...(kind==="rewrite"&&p49WritingDocument?{
          p49:true,authoredDocumentId:p49WritingDocument.id,
          sourceContextId:"p49:document:"+p49WritingDocument.id,
          documentGenre:p49WritingDocument.genre,guidedRewrite:true
        }:{ }),
        ...(kind==="rewrite"&&p48WritingCase?{
          p48:true,authoredCaseId:p48WritingCase.id,
          sourceContextId:"p48:connected:"+p48WritingCase.id,
          sourceCount:p48WritingCase.sources.length,guidedRewrite:true
        }:{ }),
        ...(kind==="rewrite"&&p47WritingScene?{
          p47:true,authoredSceneId:p47WritingScene.id,
          sourceContextId:"p47:scene:"+p47WritingScene.id,
          guidedRewrite:true,modality:"post-listening-written"
        }:{ }),
        ...(kind==="rewrite"&&p46WritingPassage?{
          p46:true,authoredReadingId:p46WritingPassage.id,
          sourceContextId:"p46:reading:"+p46WritingPassage.id,
          guidedRewrite:true
        }:{ }),
        ...(kind==="rewrite"&&p45WritingTurn?{
          p45:true,authoredChallengeId:p45WritingChallenge!.id,
          authoredTurnId:p45WritingTurn.id,
          sourceContextId:"p45:conversation:"+p45WritingChallenge!.id,
          scaffoldedWriting:true
        }:{ }),
        ...(kind==="rewrite"&&p44WritingCase?{
          p44:true,authoredCaseId:p44WritingCase.id,authoredStage:p44WritingStep,
          sourceContextId:"p44:case:"+p44WritingCase.id,
          guidedRewrite:true
        }:{ }),
        ...(kind==="rewrite"&&p43WritingScene?{
          p43:true,authoredSceneId:p43WritingScene.id,authoredRoute:p43WritingRoute,
          sourceContextId:"p43:branch:"+p43WritingScene.id,
          guidedRewrite:true
        }:{ }),
        ...(kind==="rewrite"&&p40WritingTurn?{
          ...(p42ArcById(p40WritingArc!.id)?{p42:true}:p41ArcById(p40WritingArc!.id)?{p41:true}:{p40:true}),
          authoredArcId:p40WritingArc!.id,
          authoredTurnId:p40WritingTurn.id,
          sourceContextId:(p42ArcById(p40WritingArc!.id)?"p42:arc:":p41ArcById(p40WritingArc!.id)?"p41:arc:":"p40:dialogue:")+p40WritingArc!.id
        }:{})}
    };
    await saveStudyEvent(event);
  }
  async function submitText(){
    if(!answer.trim()||busy||feedback||disabled)return;
    const account=currentOwner.current;
    if(account!==getDevelopmentAccountId())return;
    const prompt=journeyTypedPrompt(unit,turn);
    const normalized=normalizeP26(answer);
    const exact=gradeStudyPrompt(prompt,normalized).result==="correct";
    const independent=exact&&!hintUsed&&!speechUsed&&!choiceExampleSeen&&!showTranslation&&
      !revealedTurnIds.current.has(unitId+":"+turn.id);
    const choice=turn.options.find(o=>o.valid&&normalizeP26(o.japanese)===normalized);
    setBusy(true);setError("");
    try{
      if(independent)await recordStudyAnswer({prompt,response:normalized,result:"correct",
        responseTimeMs:Math.max(0,Math.round(performance.now()-started.current))});
      else await ungraded("response",answer,hintUsed||speechUsed||showTranslation);
      if(currentOwner.current!==account)return;
      if(!firstConversationDraft)setFirstConversationDraft(answer);
      setChoiceExampleSeen(true);revealedTurnIds.current.add(unitId+":"+turn.id);
      setHintUsed(true); // The displayed model makes any subsequent retry ungraded.
      setFeedback({kind:independent?"graded":"ungraded",model:turn.reference,
        message:independent?"Geübte Zielform unabhängig getroffen. FSRS-Übung gespeichert."
          :exact?"Zielform getroffen, aber mit Hilfe oder Spracherkennung: unbewerteter Versuch."
          :"Deine freie Antwort lässt sich mit den begrenzten Mustern nicht sicher beurteilen. Sie ist nicht automatisch falsch.",
        notes:[turn.hint,...grammarReflection(unit,answer)],
        next:exact?nextTurn(unit,turn,choice):turn.id});
      setReload(n=>n+1);
    }catch{if(currentOwner.current===account)setError("Antwort konnte nicht gespeichert werden.");}
    finally{if(currentOwner.current===account)setBusy(false);}
  }
  async function choose(option:JourneyOption){
    if(busy||feedback||disabled)return;
    const account=currentOwner.current;
    if(account!==getDevelopmentAccountId())return;
    setBusy(true);setError("");
    try{
      if(turn.originalPrompt?.promptType==="choice"&&!choiceExampleSeen&&!showTranslation&&
        !revealedTurnIds.current.has(unitId+":"+turn.id)){
        const prompt=turn.originalPrompt;
        await recordStudyAnswer({prompt,response:option.japanese,
          result:gradeStudyPrompt(prompt,option.japanese).result,
          responseTimeMs:Math.max(0,Math.round(performance.now()-started.current))});
      }else await ungraded("response",option.japanese,true);
      if(currentOwner.current!==account)return;
      setChoiceExampleSeen(true);revealedTurnIds.current.add(unitId+":"+turn.id);
      setFeedback({kind:"choice",message:choiceExampleSeen||showTranslation?"Auswahl nach Sprachhilfe: unbewertet.":option.valid?"Situationsgerechte Auswahl.":"Missverständnis: Versuche eine passendere Antwort.",
        model:turn.reference,notes:[option.explanation,turn.hint],next:nextTurn(unit,turn,option)});
      setReload(n=>n+1);
    }catch{if(currentOwner.current===account)setError("Antwortauswahl konnte nicht gespeichert werden.");}
    finally{if(currentOwner.current===account)setBusy(false);}
  }
  function continueDialogue(){
    if(!feedback||busy)return;
    setStepsTaken(n=>n+1);
    setNodeId(feedback.next??"__finished__");
    setFeedback(null);setAnswer("");setFirstConversationDraft("");setHintUsed(false);setSpeechUsed(false);setChoiceExampleSeen(false);
    started.current=performance.now();
  }
  async function saveRevision(){
    if(!report||saved||busy||disabled)return;
    const account=currentOwner.current;
    setBusy(true);setError("");
    try{
      await ungraded("rewrite",rewrite,false);
      if(account===currentOwner.current){setSaved(true);setReload(n=>n+1);}
    }catch{if(account===currentOwner.current)setError("Überarbeitung konnte nicht gespeichert werden.");}
    finally{if(account===currentOwner.current)setBusy(false);}
  }
  return <section className="p27-journey" aria-labelledby="p27-title">
    <header><p className="j4-kicker">JAPANESE · EIN LERNWEG</p>
      <h2 id="p27-title">Japanisch im Zusammenhang lernen</h2>
      <p>18 Originaleinheiten mit fünf verbundenen Lernschritten; jetzt mit vertieftem Satzbau, neuen Themenübergängen und angeleiteten Wiederholungen.</p>
    </header>
    <div className="p27-journey__next">
      <div><strong>Empfohlene nächste Einheit</strong><p>{loading?"Lernverlauf laden …":recommendedUnit.title}</p></div>
      <button type="button" disabled={loading||disabled} onClick={()=>{
        selectUnit(recommended,(progress.find(p=>p.id===recommended)?.due??0)>0?"practice":"learn");
      }}>Empfehlung öffnen</button>
    </div>
    {lastWorkedUnit&&!loading?<div className="p27-journey__return-navigation">
      <strong>Zuletzt tatsächlich geübte Originaleinheit</strong>
      <p>{lastWorkedUnit.title} · {lastWorked?.lastPracticedAt?
       new Date(lastWorked.lastPracticedAt).toLocaleString("de-DE",{dateStyle:"medium",timeStyle:"short"}):""}</p>
      <button type="button" onClick={()=>selectUnit(lastWorkedUnit.id,"learn")}>
        Zu dieser Originaleinheit zurückkehren
      </button>
      <small>Aus deinen vorhandenen bewerteten StudyEvents rekonstruiert;
        ungesendete Entwürfe werden nicht gespeichert oder vorgetäuscht.</small>
    </div>:null}
    {loadError?<p role="status">{loadError}</p>:null}
    <div className="p27-journey__layout">
      <aside className="p27-journey__sidebar">
        <label htmlFor="p27-search">Lerneinheiten suchen</label>
        <input type="search" id="p27-search" value={query} onChange={e=>setQuery(e.target.value)}
          placeholder="Thema oder japanisches Wort"/>
        <div className="p27-journey__filters" role="group" aria-label="Niveau">
          {(["all","A1","A2"] as const).map(l=><button key={l} aria-pressed={level===l}
            type="button" onClick={()=>setLevel(l)}>{l==="all"?"Alle":l}</button>)}
        </div>
        <nav className="p27-journey__units" aria-label="Einheiten">
          {filtered.map(u=>{
            const state=progress.find(p=>p.id===u.id);
            return <button type="button" key={u.id} aria-current={u.id===unitId?"true":undefined}
              onClick={()=>selectUnit(u.id)}>
              <small>{u.level} · Einheit {journeyUnits.indexOf(u)+1}</small>
              <strong>{u.title}</strong>
              <small>{state?state.attempted+"/"+state.total+" Übungsziele geübt":"Neu"}
                {state?.due?" · "+state.due+" fällig":state?.retry?" · "+state.retry+" Fehler":""}</small>
            </button>;
          })}
          {!filtered.length?<p>Keine Einheiten gefunden.</p>:null}
        </nav>
      </aside>
      <div className="p27-journey__content">
        <h3>{unit.title}</h3><p><strong>Lernziel:</strong> {unit.goal}</p>
        <div className="p27-journey__position">
          <span>{journeyUnits.indexOf(unit)+1} / {journeyUnits.length} · {unit.level} · {steps.findIndex(([name])=>name===stage)+1} / {steps.length} Lernschritte</span>
          <div>
            <button type="button" onClick={()=>selectUnit(journeyUnits[Math.max(0,journeyUnits.indexOf(unit)-1)]!.id)}
              disabled={journeyUnits.indexOf(unit)===0}>Vorherige Einheit</button>
            <button type="button" onClick={()=>selectUnit(journeyUnits[Math.min(journeyUnits.length-1,journeyUnits.indexOf(unit)+1)]!.id)}
              disabled={journeyUnits.indexOf(unit)===journeyUnits.length-1}>Nächste Einheit</button>
          </div>
        </div>
        <nav className="p27-journey__steps" aria-label="Lernschritte" onKeyDown={event=>{
          if(event.key!=="ArrowLeft"&&event.key!=="ArrowRight")return;
          event.preventDefault();
          const direction=event.key==="ArrowRight"?1:-1;
          const index=Math.max(0,Math.min(steps.length-1,steps.findIndex(([name])=>name===stage)+direction));
          setStage(steps[index]![0]);
          const target=event.currentTarget.querySelectorAll("button")[index];
          target?.focus();
        }}>
          {steps.map(([id,label])=><button type="button" key={id} aria-current={stage===id?"step":undefined}
            onClick={()=>{setStage(id);setError("");}}>{label}</button>)}
        </nav>
        <div className="p27-journey__step-navigation" role="group" aria-label="Zwischen Lernschritten wechseln">
          <button type="button" disabled={stage==="learn"}
            onClick={()=>setStage(steps[Math.max(0,steps.findIndex(([s])=>s===stage)-1)]![0])}>Vorheriger Schritt</button>
          <button type="button" disabled={stage==="practice"}
            onClick={()=>setStage(steps[Math.min(steps.length-1,steps.findIndex(([s])=>s===stage)+1)]![0])}>Nächster Schritt</button>
        </div>
        {stage==="learn"?<section className="p27-journey__panel">
          <div className="p27-journey__note"><strong>Situation</strong><p>{unit.situation}</p></div>
          <h4>So funktioniert das Muster</h4><p>{unit.model}</p>
          {transformation?<div className="p27-journey__quality-example">
            <h5>Ausdruck bewusst verbessern</h5>
            <p><strong>Ziel:</strong> {transformation.context}</p>
            <p><span lang="ja">{transformation.startingSentence}</span> → <span lang="ja">{transformation.model}</span></p>
            <p>{transformation.explanation}</p>
            <small>Im anschließenden Satzbau kannst du dieses Muster ohne Vorlage selbst formulieren.</small>
          </div>:null}
          <div className="p27-journey__contrast"><div><strong>Unterscheide</strong><p>{unit.contrast}</p></div>
            <div><strong>Höflichkeit & Fehlerquelle</strong><p>{unit.register}</p></div></div>
          {contrast?<div className="p27-journey__quality-example">
            <h5>Welche Form passt hier besser?</h5>
            <p><strong>Situation:</strong> {contrast.situation}</p>
            <p><span lang="ja">{contrast.preferred}</span> / <span lang="ja">{contrast.alternative}</span></p>
            <details><summary>Warum die Formen sich unterscheiden</summary><p>{contrast.why}</p></details>
            <button type="button" disabled={disabled}
              onClick={()=>startPractice(unitId,"grammar")}>Grammatik und Register aktiv entscheiden</button>
          </div>:null}
          {p32Contrast&&p32Question?<div className="p27-journey__p32-explorer">
            <h5>Partikel, Bedeutung und Register aktiv unterscheiden</h5>
            <p>{p32Question.prompt}</p>
            <div role="group" aria-label="Grammatische Funktion vergleichen">
              {p32Question.promptType==="choice"?p32Question.choices.map((form,i)=>
                <button key={i} type="button"
                  aria-pressed={inlineContrastAnswer===form}
                  onClick={()=>setInlineContrastAnswer(form)}
                  lang="ja">{form}</button>):null}
            </div>
            {inlineContrastAnswer?<div role="status" className="p27-journey__p32-explanation">
              <strong>{inlineContrastAnswer===p32Contrast.first?
                "Die gefragte Funktion erkannt":"Das ist eine andere Funktion – beide Formen können gültig sein"}</strong>
              <p>{p32Contrast.explanation}</p>
              <p>Unbewertete Erklärung im Unterricht. Ein unabhängiger Abruf erfolgt separat im StudyPlayer.</p>
            </div>:null}
          </div>:null}
          {p38TransferCases.length?<section className="p27-journey__p38-cross" aria-label="Grammatik über Themen hinweg anwenden">
            <h4>Eine Funktion in zwei Alltagssituationen</h4>
            <p>Übertrage Partikel und Sprechabsichten in ein anderes Thema. Diese
              Erklärung ist <strong>unbewertet</strong>; unabhängige Wiederholung
              läuft getrennt im StudyPlayer.</p>
            {p38TransferCases.slice(0,3).map(item=>{
              const selected=p38Choice?.id===item.id?p38Choice.answer:null;
              const other=item.units.find(id=>id!==unitId);
              return <article key={item.id}>
                <h5>{item.title}</h5>
                <p>{item.question}</p>
                <div className="p27-journey__p38-options" role="group"
                  aria-label={"Ausdruck im Kontext: "+item.title}>
                  {[item.preferred,item.contrast].map((answer,i)=><button
                    key={i} type="button" lang="ja"
                    aria-pressed={selected===answer}
                    onClick={()=>setP38Choice({id:item.id,answer})}>{answer}</button>)}
                </div>
                {selected?<div role="status" className="p27-journey__p38-result">
                  <strong>{selected===item.preferred?
                    "Passt zur gefragten Bedeutung":
                    "Diese Form erfüllt eine andere Funktion oder ist in diesem Satz unpassend"}</strong>
                  <p>{item.explanation}</p>
                  <p>Eine einzelne Auswahl ist kein bewerteter Lernnachweis.</p>
                </div>:null}
                {other?<button type="button" className="p27-journey__p38-related"
                  onClick={()=>selectUnit(other)}>
                  Verwandtes Thema öffnen: {journeyUnit(other).title}
                </button>:null}
              </article>;
            })}
            <button type="button" disabled={disabled}
              onClick={()=>startPractice(unitId,"transfer")}>
              Themenübergreifende Aufgaben selbst abrufen
            </button>
          </section>:null}
          {p39Priority?<section className="p27-journey__p39-lesson" aria-label="Situationsspezifische Sprachwahl">
            <h4>Alltagssprache bewusst unterscheiden</h4>
            <p>Wähle die zum Gespräch passende Aussage. Die Erklärung ist unbewertet;
              neue unabhängige Aufgaben erscheinen im vorhandenen StudyPlayer.</p>
            <h5>{p39Priority.title}</h5><p>{p39Priority.situation}</p>
            <div className="p27-journey__p39-options" role="group" aria-label="Japanische Ausdrucksweise wählen">
              {[p39Priority.model,...p39Priority.distractors.map(d=>d.form)].map(form=><button key={form}
                type="button" lang="ja" aria-pressed={p39Choice?.id===p39Priority.id&&p39Choice.answer===form}
                onClick={()=>setP39Choice({id:p39Priority.id,answer:form})}>{form}</button>)}
            </div>
            {p39Choice?.id===p39Priority.id?<div className="p27-journey__p39-feedback" role="status">
              <strong>{p39AuthoredFeedback(p39Priority,p39Choice.answer).kind==="model"
                ?"Diese Ausdrucksweise erfüllt die Gesprächsabsicht":"Hier passt eine andere Ausdrucksweise"}</strong>
              <p>{p39AuthoredFeedback(p39Priority,p39Choice.answer).message}</p>
              <small>Unbewerteter Vergleich mit Originalbeispielen, kein FSRS-Nachweis.</small>
            </div>:null}
            <div className="p27-journey__actions">
              <button type="button" disabled={disabled} onClick={()=>startPractice(unitId,"grammar")}>
                Selbstständig unterscheiden</button>
              <button type="button" onClick={()=>{setStage("write");setP39WritingId(p39Priority.id);}}>
                Diese Situation schriftlich überarbeiten</button>
            </div>
          </section>:null}
          {p42UnitArcs.length>0?<section className="p27-journey__p42-variation" aria-label="Sprechrollen und Situationen übertragen">
            <h4>Andere Person, anderes Register, neue Entscheidung</h4>
            <p>Vergleiche, was gegenüber dem bekannten Dialog anders geworden ist.
              Das Beispiel bleibt unbewertet. Erst der native StudyPlayer bewertet
              eigenständige Antworten; neue Transferfragen werden separat wiederholt.</p>
            {p42UnitArcs.slice(0,4).map(arc=><article key={arc.id}>
              <h5>{arc.title} · {arc.level}</h5>
              <p><strong>Gegenüber:</strong> {arc.interlocutor} · {arc.relationship}</p>
              <p><strong>Register:</strong> {arc.register==="polite"?"höfliche Formen":"vertrautes Gespräch"}</p>
              <p><strong>Bekannter Ausgangsfall:</strong> {p41ArcById(arc.baseArcId)?.title??"frühere Einheit"}</p>
              <p><strong>Veränderte Information:</strong> {arc.variation}</p>
              <p>{arc.contrast}</p>
              <button type="button" onClick={()=>{setP40ArcId(arc.id);setP40TurnIndex(0);
                setP40Choice("");setP40GuidedHistory([]);setP40GuidedFinished(false);
                setStage("conversation");}}>
                Diese neue Gesprächsrolle untersuchen
              </button>
            </article>)}
          </section>:null}
          {p51Recommended?<section className="p27-journey__p51-intro"
            aria-label="A2 Grammatikform und Sprechabsicht unterscheiden">
            <h4>A2 Grammatik – Situationen erklären statt Satzenden sammeln</h4>
            <p><strong>{p51Recommended.title}</strong> ·
               <span lang="ja"> {p51Recommended.formA} / {p51Recommended.formB}</span></p>
            <p>{p51Recommended.scene} Kontrast, eigene Formulierung,
              Fehlannahme, praktische Überarbeitung und späterer Transfer
              laufen über die vorhandene Lernarchitektur.</p>
            <button type="button" disabled={disabled}
              onClick={()=>startPractice(p51Recommended.units[0]!,
                `contrast-kind:${p51Recommended.id}:meaning`)}>
              Grammatikbedeutung im StudyPlayer abrufen
            </button>
          </section>:null}
          {p50Recommended?<section className="p27-journey__p50-intro"
            aria-label="Gelesene und gehörte Japanischinformationen verknüpfen">
            <h4>Japanisch kombiniert verstehen: erst lesen, dann hören</h4>
            <p><strong>{p50Recommended.title}</strong> · {p50Recommended.level}</p>
            <p>{p50Recommended.goal}. Ursprünglichen schriftlichen Stand
              lesen, danach eine neue gesprochene Information beachten,
              schriftlich reagieren und spätere andere Fakten übertragen.</p>
            <button type="button" disabled={disabled}
              onClick={()=>startPractice(p50Recommended.units[0]!,
                `integrated-kind:${p50Recommended.id}:comprehension`)}>
              Kombinierte Quelle und Textfragen im StudyPlayer bearbeiten
            </button>
          </section>:null}
          {p49Recommended?<section className="p27-journey__p49-intro"
            aria-label="Alltagsdokumente mit echten Bedingungen lesen">
            <h4>Dokumente verstehen statt nur Wörter wiedererkennen</h4>
            <p><strong>{p49Recommended.title}</strong> · {p49Recommended.level} · {p49Recommended.genre}</p>
            <p>{p49Recommended.purpose}. Aus Originalbeispielen die gültige
              Anweisung, Bedingung oder Ausnahme erschließen und selbst auf
              Japanisch handeln.</p>
            <button type="button" disabled={disabled}
              onClick={()=>startPractice(p49Recommended.units[0]!,
                `document-kind:${p49Recommended.id}:comprehension`)}>
              Dokumentfragen unabhängig im StudyPlayer bearbeiten
            </button>
          </section>:null}
          {p48Recommended?<section className="p27-journey__p48-intro"
            aria-label="Mehrere Quellen und aktuelle Information">
            <h4>Japanische Angaben zusammenführen statt auswendig kopieren</h4>
            <p><strong>{p48Recommended.title}</strong> · {p48Recommended.level}</p>
            <p>{p48Recommended.goal}. Drei Originalquellen vergleichen,
              Quelle und Zeitpunkt unterscheiden, eigene Antworten begründen
              und eine spätere andere Situation bewältigen.</p>
            <button type="button" disabled={disabled}
              onClick={()=>startPractice(p48Recommended.units[0]!,
                `connected-kind:${p48Recommended.id}:comprehension`)}>
              Drei unabhängige Quellenfragen bearbeiten
            </button>
          </section>:null}
          {p47Recommended?<section className="p27-journey__p47-intro"
            aria-label="Erst hören, dann mit Transkript abgleichen">
            <h4>Japanisch verstehen – vom Hören zur eigenen Antwort</h4>
            <p><strong>{p47Recommended.title}</strong> · {p47Recommended.level} · {p47Recommended.listeningGoal}</p>
            <p>40 Originalskripte, optional von der TTS-Stimme deines Geräts vorgelesen:
              erst hören, dann Fragen beantworten und Transkript oder Textbeleg einblenden.
              Keine vorgetäuschte menschliche Sprecheraufnahme oder Audioprüfung.</p>
            <button type="button" disabled={disabled}
              onClick={()=>startPractice(p47Recommended.units[0]!,
                `listening-kind:${p47Recommended.id}:comprehension`)}>
              Nachgehörte Fragen textgestützt im StudyPlayer bearbeiten
            </button>
          </section>:null}
          {p46Recommended?<section className="p27-journey__p46-intro"
            aria-label="Progressiv Japanisch lesen">
            <h4>Vom Textdetail zur begründeten Schlussfolgerung</h4>
            <p><strong>{p46Recommended.title}</strong> · {p46Recommended.level} · {p46Recommended.purpose}</p>
            <p>In den 30 eigenständig verfassten Texten werden konkrete Aussagen,
              implizite Zusammenhänge und Textabsichten unterschieden.
              Die Originalstelle bleibt im Leseunterricht verfügbar;
              spätere Transferfragen verändern die Situation.</p>
            <button type="button" disabled={disabled}
              onClick={()=>startPractice(p46Recommended.units[0]!,
                `reading-kind:${p46Recommended.id}:comprehension`)}>
              Textfragen unabhängig im StudyPlayer bearbeiten
            </button>
          </section>:null}
          {p45Recommended?<section className="p27-journey__p45-intro"
            aria-label="Gespräch zunehmend selbstständig führen">
            <h4>Japanisch ohne Auswahlantworten</h4>
            <p><strong>{p45Recommended.title}</strong> — {p45Recommended.purpose}</p>
            <p>Vier echte Partneräußerungen mit unerwarteter Änderung. Schreibe selbst,
              behalte frühere Zusagen bei und reduziere die eingeblendeten Hilfen.
              Die geführte Ansicht erzeugt keine Lernbewertung.</p>
            <div className="p27-journey__actions">
              <button type="button" onClick={()=>setStage("conversation")}>
                Ohne Auswahlliste selbst antworten
              </button>
              <button type="button" disabled={disabled}
                onClick={()=>startPractice(unitId,`independent:${p45Recommended.id}`)}>
                Vier unabhängige StudyPlayer-Züge üben
              </button>
            </div>
          </section>:null}
          {p44Recommended?<section className="p27-journey__p44-intro"
            aria-label="Höflichkeit und soziale Gesprächsabsichten">
            <h4>Höflichkeit ist eine Entscheidung im Kontext</h4>
            <p><strong>{p44Recommended.title}</strong> — {p44Recommended.context}</p>
            <p>Wer spricht mit wem, mit welcher Absicht? Zwei passende Beispiele
              zeigen unterschiedliche Nuancen; eine dritte Form verfehlt die Absicht
              oder passt sozial nicht gut. Beurteile sie im Gesprächskontext.</p>
            <div className="p27-journey__actions">
              <button type="button" onClick={()=>setStage("conversation")}>
                Sozialen Gesprächskontrast ansehen
              </button>
              <button type="button" disabled={disabled}
                onClick={()=>startPractice(unitId,`pragmatic:${p44Recommended.id}`)}>
                Ohne Beispiel selbst antworten
              </button>
            </div>
          </section>:null}
          {p43Recommended?<section className="p27-journey__p43-intro" aria-label="Gespräch mit Entscheidungen">
            <h4>Deine Entscheidung verändert den Gesprächsverlauf</h4>
            <p><strong>{p43Recommended.title}</strong> — {p43Recommended.goal}</p>
            <p>Zwei passende Lösungen führen zu anderen Gesprächsverläufen.
              Eine dritte Antwort verursacht ein konkretes Missverständnis.
              Die angezeigten Beispiele sind unbewertet.</p>
            <button type="button" onClick={()=>setStage("conversation")}>Situation ausprobieren</button>
            <button type="button" disabled={disabled}
              onClick={()=>startPractice(unitId,`branch:${p43Recommended.id}`)}>
              Entscheidung unabhängig abrufen
            </button>
          </section>:null}
          {p40Recommended?<section className="p27-journey__p40-guidance">
            <h4>Mehrere Antworten im selben Gespräch</h4>
            <p>Über {p40Recommended.turns.length} Gesprächszüge bleiben Ziel, Bedeutung
              und höfliche Reaktionen zusammenhängend. Ein unerwarteter Hinweis
              verändert einen Teil des Plans, nicht das gesamte Gespräch.</p>
            <p><strong>{p40Recommended.title}</strong> — {p40Recommended.setting}</p>
            <button type="button" onClick={()=>{setP40ArcId(p40Recommended.id);setP40TurnIndex(0);
              setP40Choice("");setP40GuidedHistory([]);setP40GuidedFinished(false);setStage("conversation");}}>
              {p40Recommended.turns.length} zusammenhängende Gesprächszüge öffnen
            </button>
          </section>:null}
          <P60ConsolidationStudio key={"p60:"+owner+":"+unitId}
            onDirtyChange={(dirty)=>reportSpecialistDraft("p60",dirty)} lessons={p60Units}
            preferredId={p60Recommended?.id} readyIds={p60RecallReadyIds}
            historical={p60Historical} disabled={disabled}
            onPractice={(lessonId,kind)=>{
              const lesson=p60ById(lessonId);
              if(lesson&&(kind!=="return"||p60RecallReadyIds.includes(lessonId)))
                startPractice(lesson.units[0]!,`consolidation60-kind:${lesson.id}:${kind}`);
            }}
            onHistorical={(promptId,originalUnitId)=>{
              if(p60Historical.some(item=>item.id===promptId&&item.unitIds.includes(originalUnitId)))
                startPractice(originalUnitId,`source60:${promptId}`);
            }}
            onWriting={chooseP60Writing}
          />
          <P59PerformanceStudio key={"p59:"+owner+":"+unitId}
            onDirtyChange={(dirty)=>reportSpecialistDraft("p59",dirty)} missions={p59Missions}
            preferredId={p59Recommended?.id} recallReadyIds={p59RecallReadyIds}
            disabled={disabled}
            onPractice={(missionId,kind)=>{
              const mission=p59ById(missionId);
              if(mission&&(kind!=="return"||p59RecallReadyIds.includes(missionId)))
                startPractice(mission.units[0]!,`performance59-kind:${mission.id}:${kind}`);
            }}
            onWriting={chooseP59Writing}
            onRelated={(missionId,kind)=>{
              const mission=p59ById(missionId);
              if(!mission)return;
              const related=p59RelatedSources(mission);
              if(kind==="integrated"&&related.integrated)
                startPractice(related.integrated.units[0]!,`mission58-kind:${related.integrated.id}:comprehension`);
              if(kind==="writing"&&related.writing)
                startPractice(related.writing.units[0]!,`writing57-kind:${related.writing.id}:comprehension`);
              if(kind==="interaction"&&related.interaction)
                startPractice(related.interaction.units[0]!,`interaction56-kind:${related.interaction.id}:decision`);
              if(kind==="listening"&&related.listening)
                startPractice(related.listening.units[0]!,`listening55-kind:${related.listening.id}:comprehension`);
              if(kind==="reading"&&related.reading)
                startPractice(related.reading.units[0]!,`reading54-kind:${related.reading.id}:comprehension`);
              if(kind==="document"&&related.document)
                startPractice(related.document.units[0]!,`document-kind:${related.document.id}:comprehension`);
            }}
          />
          <P58MissionsStudio key={"p58:"+owner+":"+unitId}
            onDirtyChange={(dirty)=>reportSpecialistDraft("p58",dirty)} missions={p58Missions}
            preferredId={p58Recommended?.id} recallReadyIds={p58RecallReadyIds}
            disabled={disabled}
            onPractice={(missionId,kind)=>{
              const mission=p58ById(missionId);
              if(mission&&(kind!=="return"||p58RecallReadyIds.includes(missionId)))
                startPractice(mission.units[0]!,`mission58-kind:${mission.id}:${kind}`);
            }}
            onWriting={chooseP58Writing}
            onRelated={(missionId,kind)=>{
              const mission=p58ById(missionId);
              if(!mission)return;
              const related=p58RelatedSource(mission);
              if(kind==="reading"&&related.reading)
                startPractice(related.reading.units[0]!,`reading54-kind:${related.reading.id}:comprehension`);
              if(kind==="listening"&&related.listening)
                startPractice(related.listening.units[0]!,`listening55-kind:${related.listening.id}:comprehension`);
              if(kind==="writing"&&related.writing)
                startPractice(related.writing.units[0]!,`writing57-kind:${related.writing.id}:comprehension`);
              if(kind==="document"&&related.document)
                startPractice(related.document.units[0]!,`document-kind:${related.document.id}:comprehension`);
              if(kind==="interaction"&&related.interaction)
                startPractice(related.interaction.units[0]!,`interaction56-kind:${related.interaction.id}:decision`);
              if(kind==="conversation"&&related.conversation)
                startPractice(related.conversation.unitIds[0]!,`branch:${related.conversation.id}`);
              if(kind==="independence"&&related.independence)
                startPractice(related.independence.units[0]!,`independent:${related.independence.id}`);
            }}
          />
          <P57WritingStudio key={"p57:"+owner} threads={p57Threads}
            preferredId={p57Recommended?.id} recallReadyIds={p57RecallReadyIds}
            disabled={disabled}
            onPractice={(threadId,kind)=>{
              const thread=p57ById(threadId);
              if(thread&&(kind!=="return"||p57RecallReadyIds.includes(threadId)))
                startPractice(thread.units[0]!,`writing57-kind:${thread.id}:${kind}`);
            }}
            onWriting={chooseP57Writing}
          />
          <P56InteractionStudio key={"p56:"+owner} scenes={p56Scenes}
            preferredId={p56Recommended?.id} recallReadyIds={p56RecallReadyIds}
            disabled={disabled}
            onPractice={(sceneId,kind)=>{
              const scene=p56ById(sceneId);
              if(scene&&(kind!=="return"||p56RecallReadyIds.includes(sceneId)))
                startPractice(scene.units[0]!,`interaction56-kind:${scene.id}:${kind}`);
            }}
            onWriting={chooseP56Writing}
          />
          <P55ListeningStudio key={"p55:"+owner} scenes={p55Scenes}
            preferredId={p55Recommended?.id} recallReadyIds={p55RecallReadyIds}
            disabled={disabled}
            onPractice={(sceneId,kind)=>{
              const scene=p55ById(sceneId);
              if(scene&&(kind!=="return"||p55RecallReadyIds.includes(sceneId)))
                startPractice(scene.units[0]!,`listening55-kind:${scene.id}:${kind}`);
            }}
            onWriting={chooseP55Writing}
          />
          <P54ReadingStudio key={"p54:"+owner} items={p54Readings}
            preferredId={p54Recommended?.id} recallReadyIds={p54RecallReadyIds}
            disabled={disabled}
            onPractice={(readingId,kind)=>{
              const reading=p54ById(readingId);
              if(reading&&(kind!=="return"||p54RecallReadyIds.includes(readingId)))
                startPractice(reading.units[0]!,`reading54-kind:${reading.id}:${kind}`);
            }}
            onWriting={chooseP54Writing}
          />
          <P53VocabularyStudio key={"p53:"+owner} items={p53Vocabulary}
            preferredId={p53Recommended?.id} recallReadyIds={p53RecallReadyIds} disabled={disabled}
            onPractice={(wordId,kind)=>{
              const v=p53ById(wordId);
              if(v&&(kind!=="return"||p53RecallReadyIds.includes(v.id)))
                startPractice(v.units[0]!,`lexical-kind:${v.id}:${kind}`);
            }}
            onWriting={chooseP53Writing}
          />
          <P52TransformationStudio key={"p52:"+owner} items={p52Transformations}
            preferredId={p52Recommended?.id} recallReadyIds={p52RecallReadyIds} disabled={disabled}
            onPractice={(taskId,kind)=>{
              const t=p52ById(taskId);
              if(t&&(kind!=="return"||p52RecallReadyIds.includes(t.id)))
                startPractice(t.units[0]!,`transform-kind:${t.id}:${kind}`);
            }}
            onWriting={chooseP52Writing}
          />
          <P51GrammarStudio key={"p51:"+owner} contrasts={p51Contrasts}
            preferredId={p51Recommended?.id} disabled={disabled}
            onPractice={(contrastId,kind)=>{
              const contrast=p51ById(contrastId);
              if(contrast)startPractice(contrast.units[0]!,
                `contrast-kind:${contrast.id}:${kind}`);
            }}
            onWriting={chooseP51Writing}
          />
          <P50IntegratedStudio key={"p50:"+owner} missions={p50Missions}
            preferredId={p50Recommended?.id} disabled={disabled}
            onPractice={(missionId,kind)=>{
              const source=p50ById(missionId);
              if(source)startPractice(source.units[0]!,
                `integrated-kind:${source.id}:${kind}`);
            }}
            onWriting={chooseP50Writing}
          />
          <P49DocumentLibrary key={"p49:"+owner} documents={p49Documents}
            preferredId={p49Recommended?.id} disabled={disabled}
            onPractice={(documentId,kind)=>{
              const target=p49ById(documentId);
              if(target)startPractice(target.units[0]!,
                `document-kind:${target.id}:${kind}`);
            }}
            onWriting={chooseP49Writing}
          />
          <P48ConnectedSources key={"p48:"+owner} cases={p48Cases}
            preferredId={p48Recommended?.id} disabled={disabled}
            onPractice={(caseId,kind)=>{
              const source=p48ById(caseId);
              if(source)startPractice(source.units[0]!,
                `connected-kind:${source.id}:${kind}`);
            }}
            onWriting={chooseP48Writing}
          />
          <P47ListeningStudio key={"p47:"+owner} scenes={p47Scenes}
            preferredId={p47Recommended?.id} disabled={disabled}
            onPractice={(sceneId,kind)=>{
              const source=p47ById(sceneId);
              if(source)startPractice(source.units[0]!,
                `listening-kind:${source.id}:${kind}`);
            }}
            onWriting={chooseP47Writing}
          />
          <P46ReadingLibrary
            key={owner} readings={p46Readings} preferredId={p46Recommended?.id}
            disabled={disabled}
            onPractice={(readingId,kind)=>{
              const target=p46ById(readingId);
              if(target)startPractice(target.units[0]!,
                `reading-kind:${target.id}:${kind}`);
            }}
            onWriting={chooseP46Writing}
          />
          <h4>Wörter in Sätzen</h4>
          <div className="p27-journey__words">{unit.words.map(w=><div key={w.form+"-"+w.reading}>
            <strong lang="ja">{w.form}</strong><small lang="ja">{w.reading}</small>
            <span>{w.meaning}</span><small lang="ja">{w.example}</small></div>)}</div>
          <div className="p27-journey__actions">
            <button type="button" disabled={disabled} onClick={()=>startSourcePractice(unit.source,unit.sourceId,"core")}>Originale Grundlagen üben</button>
            <button type="button" onClick={()=>setStage("build")}>Weiter zum Satzbau</button>
          </div>
        </section>:null}
        {stage==="build"?<section className="p27-journey__panel">
          <P28SentenceBuilder key={unit.id+":"+owner} unitId={unit.id} owner={owner} disabled={disabled}
            onReviewed={()=>setReload(n=>n+1)} onContinue={()=>setStage("conversation")}/>
        </section>:null}
        {stage==="conversation"?<section className="p27-journey__panel">
          <h4>Mehrstufiger Dialog</h4>
          {p45UnitChallenges.length?<P45IndependentConversation
            key={unitId+":"+owner} challenges={p45UnitChallenges}
            preferredId={p45Recommended?.id} disabled={disabled}
            onPractice={id=>startPractice(unitId,`independent:${id}`)}
            onWriting={chooseP45Writing}
          />:null}
          {p44UnitCases.length?<P44PragmaticsStudy key={unitId+":"+owner}
            cases={p44UnitCases} preferredId={p44Recommended?.id} disabled={disabled}
            onPractice={(caseId,step:undefined|P44PracticeStep)=>
              startPractice(unitId,step?
                `pragmatic-step:${caseId}:${step}`:`pragmatic:${caseId}`)}
            onWriting={chooseP44Writing}
          />:null}
          {p43UnitScenes.length?<P43BranchConversation key={unitId+":"+owner}
            scenes={p43UnitScenes} preferredId={p43Recommended?.id} disabled={disabled}
            onIndependent={(sceneId,route)=>
              startPractice(unitId,route?`branch-route:${sceneId}:${route}`:`branch:${sceneId}`)}
            onWriting={chooseP43Writing}
          />:null}
          {p40ActiveArc&&p40CurrentTurn?<section className="p27-journey__p40-dialogue"
            aria-label={"Originales Gespräch mit "+p40ActiveArc.turns.length+" Schritten"}>
            <h5>{p40ActiveArc.turns.length} Gesprächszüge — Bedeutung beibehalten</h5>
            <p>Diese geführte Gegenüberstellung ist <strong>unbewertet</strong>.
              Die Antworten der Gesprächspartner sind vorgegeben. Die getrennten
              StudyPlayer-Aufgaben prüfen anschließend ohne eingeblendete Lösung.</p>
            <div className="p27-journey__p40-arcs" role="group" aria-label="Gesprächssituation wechseln">
              {p40UnitArcs.map(arc=><button key={arc.id} type="button"
                aria-pressed={p40ActiveArc.id===arc.id}
                onClick={()=>{setP40ArcId(arc.id);setP40TurnIndex(0);setP40Choice("");
                  setP40GuidedHistory([]);setP40GuidedFinished(false);}}>
                {arc.title}</button>)}
            </div>
            <p>{p40ActiveArc.setting}</p>
            {p42ActiveArc?<div className="p27-journey__p42-speaker" aria-label="Sprecherrolle und sozialer Kontext">
              <strong>Sprecherwechsel gegenüber der früheren Situation</strong>
              <p>{p42ActiveArc.interlocutor} · {p42ActiveArc.relationship}</p>
              <p><strong>Passendes Register:</strong>{" "}
                {p42ActiveArc.register==="polite"?"Höflicher Erst- oder Servicekontakt":"Vertraut und informell"}</p>
              <p><strong>Ausgangsfall:</strong> {p41ArcById(p42ActiveArc.baseArcId)?.title??"früherer Dialog"}</p>
              <p><strong>Geändert:</strong> {p42ActiveArc.variation}</p>
              {p41ArcById(p42ActiveArc.baseArcId)&&
                p41ArcById(p42ActiveArc.baseArcId)!.units.includes(unitId)?
                <button type="button" onClick={()=>{
                  setP40ArcId(p42ActiveArc.baseArcId);setP40TurnIndex(0);setP40Choice("");
                  setP40GuidedHistory([]);setP40GuidedFinished(false);
                }}>Ursprüngliche Gesprächssituation ansehen</button>:null}
              <details><summary>Welche Funktion musst du übertragen?</summary>
                <p>{p42ActiveArc.contrast}</p>
                <p>Diese Hilfe erklärt den Kontext, gibt aber keine unabhängige Abrufbewertung.</p>
              </details>
            </div>:null}
            {p41ActiveArc?<p className="p27-journey__p41-outcome">
              <strong>Ziel der Unterhaltung:</strong> {p41ActiveArc.outcome} · {p41ActiveArc.level}
            </p>:null}
            {p40GuidedHistory.length>0?<div className="p27-journey__p41-history">
              <strong>Bisherige Gesprächsantworten</strong>
              <ol>{p40GuidedHistory.map(h=><li key={h.turnId}>
                <span lang="ja">{h.partner}</span> →
                <span lang="ja">{h.answer}</span>
                <small>{h.note}</small>
              </li>)}</ol>
              <small>Nur die ausgewählten Originalbeispiele dieser Unterrichtsansicht.
                Keine gespeicherten Antworten oder Lernbewertungen.</small>
            </div>:null}
            <article aria-label={"Gesprächsschritt "+p40CurrentTurn.number}>
              <strong>Schritt {p40CurrentTurn.number} von {p40ActiveArc.turns.length}</strong>
              <p><strong>Gesprächspartner:</strong> <span lang="ja">{p40CurrentTurn.partner}</span></p>
              <p><strong>Dein Ziel:</strong> {p40CurrentTurn.intention}</p>
              {p41ActiveArc?.pivotTurn===p40CurrentTurn.number?<div className="p27-journey__p41-pivot">
                <strong>Neue Information: passe nur den betroffenen Teil des bisherigen Plans an.</strong>
                <p>{p41ActiveArc.turns[p40TurnIndex]?.shift}</p>
                <small>Gegenstand, Tag, Preis oder Ort können wechseln; andere Zusagen bleiben gültig.</small>
              </div>:null}
              <div className="p27-journey__p40-options" role="group" aria-label="Antwort im Verlauf auswählen">
                {[p40CurrentTurn.misstep,p40CurrentTurn.model,p40CurrentTurn.alternative].map(form=>
                  <button key={form} type="button" lang="ja" disabled={p40GuidedFinished}
                    aria-pressed={p40Choice===form} onClick={()=>setP40Choice(form)}>{form}</button>)}
              </div>
              {p40Choice?<div className="p27-journey__p40-feedback" role="status">
                <strong>{p40TurnFeedback(p40CurrentTurn,p40Choice).kind==="authored"?
                  "Passende Ausdrucksweise":"Diese Antwort verfehlt die beabsichtigte Gesprächsrichtung"}</strong>
                <p>{p40TurnFeedback(p40CurrentTurn,p40Choice).message}</p>
                {p42ActiveArc?<p>{p42ActiveArc.contrast}</p>:null}
                <small>Nur dieses Beispiel ist beurteilt; keine Aussage über freie Alternativen.</small>
              </div>:null}
              <div className="p27-journey__actions">
                <button type="button" disabled={!p40Choice||p40GuidedFinished}
                  onClick={()=>{
                    const feedback=p40TurnFeedback(p40CurrentTurn,p40Choice);
                    setP40GuidedHistory(previous=>[...previous,{
                      turnId:p40CurrentTurn.id,partner:p40CurrentTurn.partner,
                      answer:p40Choice,note:feedback.kind==="authored"?
                        "Zur beabsichtigten Aussage passend":feedback.message
                    }]);
                    if(p40TurnIndex+1===p40ActiveArc.turns.length)setP40GuidedFinished(true);
                    else {setP40TurnIndex(i=>i+1);setP40Choice("");}
                  }}>
                  {p40TurnIndex===p40ActiveArc.turns.length-1?"Gespräch abschließen":
                    "Nächste Gesprächsantwort"}
                </button>
                <button type="button" onClick={()=>{setP40TurnIndex(0);setP40Choice("");
                  setP40GuidedHistory([]);setP40GuidedFinished(false);}}>
                  Gespräch von vorn ansehen
                </button>
              </div>
            </article>
            {p40GuidedFinished?<div className="p27-journey__p41-completed" role="status">
              <strong>Geführter Gesprächsverlauf abgeschlossen</strong>
              <p>{p41ActiveArc?.outcome??p40ActiveArc.setting}</p>
              <p>Prüfe die falschen und richtigen Richtungsentscheidungen oben.
                Dieses Gespräch war eine unbewertete Unterrichtsaktivität.
                Eine spätere unabhängige Wiederholung wird ausschließlich durch
                deine wirkliche FSRS-Karte bestimmt.</p>
            </div>:null}
            <div className="p27-journey__actions">
              <button type="button" disabled={disabled}
                onClick={()=>startPractice(unitId,`dialogue:${p40ActiveArc.id}`)}>
                {p40ActiveArc.turns.length} Schritte im StudyPlayer selbstständig beantworten
              </button>
              <button type="button" onClick={()=>chooseP40Writing(p40ActiveArc.id)}>
                {p41ActiveArc?"Den Planwechsel":"Den zweiten Zug"} schriftlich korrigieren
              </button>
            </div>
          </section>:null}
          <div className="p27-journey__filters" role="group" aria-label="Antwortart">
            <button type="button" aria-pressed={inputMode==="compose"} onClick={()=>{setInputMode("compose");setFeedback(null);}}>Selbst formulieren</button>
            <button type="button" aria-pressed={inputMode==="choose"} onClick={()=>{setInputMode("choose");setHintUsed(true);setChoiceExampleSeen(true);setFeedback(null);}}>Antworten auswählen</button>
          </div>
          {nodeId!=="__finished__"&&stepsTaken<14?<div>
            <p className="p27-journey__muted">Gesprächsschritt {stepsTaken+1} · höchstens 14</p>
            <div className="p27-journey__note"><strong>Gesprächspartner</strong>
              <p className="p27-journey__japanese" lang="ja">{turn.partner}</p>
              {showTranslation?<p>{turn.meaning}</p>:null}
              <button type="button" onClick={()=>speak(turn.partner)}>Synthetisch anhören</button>
            </div>
            <label><input type="checkbox" checked={showTranslation}
              onChange={e=>{
                setShowTranslation(e.target.checked);
                if(e.target.checked){
                  setHintUsed(true);
                  revealedTurnIds.current.add(unitId+":"+turn.id);
                }
              }}/> Deutsche Hilfe anzeigen</label>
            {inputMode==="compose"?<>
              <label htmlFor="p27-reply">Deine japanische Antwort</label>
              <textarea rows={3} id="p27-reply" lang="ja" value={answer} disabled={disabled||Boolean(feedback)||busy}
                aria-keyshortcuts="Control+Enter Meta+Enter"
                onKeyDown={e=>{if(!e.nativeEvent.isComposing&&(e.ctrlKey||e.metaKey)&&e.key==="Enter"){
                  e.preventDefault();if(answer.trim()&&!disabled&&!busy&&!feedback)void submitText();
                }}}
                onChange={e=>setAnswer(e.target.value)}/>
              <div className="p27-journey__actions">
                <button type="button" disabled={disabled||busy||Boolean(feedback)||!answer.trim()}
                  onClick={()=>void submitText()}>Antwort vergleichen</button>
                <button type="button" disabled={busy||Boolean(feedback)} onClick={()=>recognize("answer")}>Diktieren</button>
                <button type="button" disabled={busy||Boolean(feedback)}
                  onClick={()=>{setHintUsed(true);speak(turn.reference);}}>Musterhilfe anhören (unbewertet)</button>
              </div>
              {voiceStatus?<p role="status">{voiceStatus} Die Browser-Spracherkennung kann externe Dienste verwenden.</p>:null}
            </>:<div className="p27-journey__choices">
              {turn.options.map((o,i)=><button type="button" key={i} disabled={disabled||busy||Boolean(feedback)}
                onClick={()=>void choose(o)}><span lang="ja">{o.japanese}</span>
                {showTranslation?<small>{o.meaning}</small>:null}</button>)}
            </div>}
            {feedback?<div className="p27-journey__note" role="status">
              <strong>{feedback.message}</strong>
              <p><span lang="ja">{feedback.model}</span> · mögliche Musterantwort</p>
              {firstConversationDraft&&answer&&firstConversationDraft!==answer?<div className="p27-journey__revision">
                <strong>Deine überarbeitete Antwort</strong>
                <p>Erste Fassung: <span lang="ja">{firstConversationDraft}</span></p>
                <p>Neue Fassung: <span lang="ja">{answer}</span></p>
                <ul>{describeP29Revision(firstConversationDraft,answer,unit).suggestions.map((tip,i)=>
                  <li key={i}>{tip}</li>)}</ul>
                <small>Nach dem Vergleich mit einer Musterantwort wird diese Revision nicht als unabhängiger FSRS-Abruf gewertet.</small>
              </div>:null}
              <ul>{feedback.notes.map((n,i)=><li key={i}>{n}</li>)}</ul>
              {feedback.next===turn.id?<div className="p27-journey__intents">
                <strong>Gesprächsrichtung wählen — ohne Bewertungsnachweis</strong>
                <p>Deine freie Antwort war nicht sicher einzuordnen. Wähle die Absicht,
                  damit die nächste Rückfrage zu deinem Vorhaben passt.</p>
                {turn.options.filter(o=>o.valid).map((o,i)=><button type="button" key={i}
                  onClick={()=>{
                    const followup=nextTurn(unit,turn,o);
                    setFeedback(null);setStepsTaken(n=>n+1);setNodeId(followup??"__finished__");
                    setAnswer("");setFirstConversationDraft("");setHintUsed(false);
                    setChoiceExampleSeen(false);setSpeechUsed(false);started.current=performance.now();
                  }}><span lang="ja">{o.japanese}</span> — {o.meaning}</button>)}
              </div>:null}
              <div className="p27-journey__actions">
                <button type="button" onClick={()=>{setFeedback(null);setHintUsed(true);setChoiceExampleSeen(true);setSpeechUsed(false);started.current=performance.now();}}>Antwort überarbeiten (Text beibehalten)</button>
                <button type="button" onClick={continueDialogue}>Fortfahren</button>
              </div>
            </div>:null}
          </div>:<div className="p27-journey__note" role="status">
            <strong>{nodeId==="__finished__"?"Gespräch abgeschlossen":"Nach wiederholten Versuchen unterbrochen"}</strong>
            <p>Auswahl oder Mustererkennung sind keine umfassende Bewertung freier Gespräche.</p>
          </div>}
          {roleScenarios.length?<details className="p27-journey__role">
            <summary>Rollen wechseln & ohne Vorlage antworten · {roleScenarios.length} Situation{roleScenarios.length===1?"":"en"}</summary>
            <P33RolePractice key={unit.id+":"+owner} unitId={unit.id} owner={owner}
              disabled={disabled} onReviewed={()=>setReload(n=>n+1)}
              dueCount={recallPlan?.dueNow.length??0}
              onReview={()=>startPractice(unitId,"review")}
              onGrammar={()=>startPractice(unitId,"grammar")}
              traces={evidence?.traces??[]}
              onRoleDue={scenarioId=>startRoleDuePractice(unitId,scenarioId)}
              onCorrectionDue={scenarioId=>startCorrectionDuePractice(unitId,scenarioId)}/>
          </details>:null}
          {(nodeId==="__finished__"||stepsTaken>=14)?<P28Continuity key={unit.id+":"+owner}
            unitId={unit.id} owner={owner} disabled={disabled} onReviewed={()=>setReload(n=>n+1)}
            onOpenUnit={selectUnit}/>:null}
          <div className="p27-journey__actions">
            <button type="button" onClick={resetDialogue}>Gespräch wiederholen</button>
            <button type="button" onClick={()=>setStage("write")}>Weiter: Schreiben</button>
          </div>
        </section>:null}
        {stage==="write"?<section className="p27-journey__panel">
          <h4>Eigene Sätze schreiben oder sprechen und überarbeiten</h4>
          {p38WritingCases.length>0?<section className="p27-journey__p38-writing" aria-label="Neue Situationen schriftlich übertragen">
            <h5>Aus anderen Themen in den Alltag übertragen</h5>
            <p>Übertrage gelernte Partikel, Zeitformen und höfliche Bitten. Die
              Musterlösungen werden erst im bestehenden StudyPlayer nach einem Versuch
              gezeigt. Freies Schreiben hier bleibt unabhängig von FSRS-Bewertungen.</p>
            {p38WritingCases.slice(0,3).map(item=><div key={item.id}>
              <strong>{item.title}</strong><p>{item.task}</p>
              <small>Im StudyPlayer sind zwei sinnvolle japanische Formulierungen hinterlegt.</small>
            </div>)}
            <button type="button" disabled={disabled}
              onClick={()=>startPractice(unitId,"transfer")}>
              Situationswechsel selbstständig üben
            </button>
          </section>:null}
          {p60WritingLesson?<section className="p27-journey__p51-writing-selection"
            aria-label="Eigenständige P60-Konsolidierungsnachricht schreiben und revidieren">
            <h5>P60 · Zusammenhängende japanische Nachricht überarbeiten</h5>
            <p><strong>{p60WritingLesson.title}</strong> · {p60WritingLesson.goal}</p>
            <p><strong>Originale Schreibaufgabe:</strong> {p60WritingLesson.writing.situation}</p>
            <p>Der erste Entwurf und die eigene Überarbeitung verwenden den
              ursprünglichen unbenoteten Learn-Editor. Private Textentwürfe
              werden hier nicht dauerhaft gespeichert. Original-StudyPlayer
              und FSRS bleiben alleinige autoritative Auswerter.</p>
            <div className="p27-journey__actions">
              <button type="button" disabled={disabled}
                onClick={()=>startPractice(unitId,`consolidation60-kind:${p60WritingLesson.id}:writing`)}>
                Originalen eigenständigen StudyPlayer-Schreibprompt öffnen
              </button>
              <button type="button" disabled={disabled}
                onClick={()=>startPractice(unitId,`consolidation60-kind:${p60WritingLesson.id}:revision`)}>
                Mehrteilige Fehlannahme im StudyPlayer korrigieren
              </button>
              <button type="button" onClick={()=>setP60WritingId("")}>Reguläre Schreibaufgabe wählen</button>
            </div>
          </section>:null}
          {p59WritingMission?<section className="p27-journey__p51-writing-selection"
            aria-label="Eigenständige lange Quellen zusammenfassen und japanische Mitteilung revidieren">
            <h5>Unabhängige A2-Kommunikationsaufgabe: mehrstufige Revision</h5>
            <p><strong>{p59WritingMission.title}</strong> · {p59WritingMission.situation}</p>
            <p><strong>Eigenständige Produktionsaufgabe:</strong> {p59WritingMission.write.situation}</p>
            <p>Nutze den unveränderten Learn-Editor: eigenen Erstentwurf,
              eigene längere Korrektur, erst danach Originalmuster ansehen.
              Diese Arbeit ist unbenotet, enthält kein aufgezeichnetes Audio
              und speichert keinen privaten Rohtext. Graded StudyPlayer
              und vorhandene FSRS-MemoryTraces bleiben alleinige
              Autorität über echte geplante Wiederholungen.</p>
            <div className="p27-journey__actions">
              <button type="button" disabled={disabled}
                onClick={()=>startPractice(unitId,`performance59-kind:${p59WritingMission.id}:writing`)}>
                Originalen unabhängigen Schreibprompt üben
              </button>
              <button type="button" disabled={disabled}
                onClick={()=>startPractice(unitId,`performance59-kind:${p59WritingMission.id}:revision`)}>
                Quellengebundene Reparatur üben
              </button>
              <button type="button" onClick={()=>setP59WritingId("")}>Zur regulären Aufgabe</button>
            </div>
          </section>:null}
          {p58WritingMission?<section className="p27-journey__p51-writing-selection"
            aria-label="Integrierte P58-Mehrquellenmission eigenständig schreiben und überarbeiten">
            <h5>Aus drei Quellen selbständig eine japanische Nachricht schreiben</h5>
            <p><strong>{p58WritingMission.title}</strong> · {p58WritingMission.setting}</p>
            <p><strong>Schreibauftrag:</strong> {p58WritingMission.write.situation}</p>
            <p>Nutze den unveränderten mehrstufigen Learn-Editor für ersten
              Entwurf und eigene Überarbeitung. Beide Phasen sind unbenotet;
              die Anwendung speichert keinen privaten Rohtext.
              Die originalen StudyPlayer-Antworten bleiben die einzige
              Autorität für eine FSRS-Wiederholung.</p>
            <div className="p27-journey__actions">
              <button type="button" disabled={disabled}
                onClick={()=>startPractice(unitId,`mission58-kind:${p58WritingMission.id}:writing`)}>
                Native unabhängige Schreibaufgabe
              </button>
              <button type="button" disabled={disabled}
                onClick={()=>startPractice(unitId,`mission58-kind:${p58WritingMission.id}:repair`)}>
                Native Quellenkorrektur
              </button>
              <button type="button" onClick={()=>setP58WritingId("")}>Reguläre Aufgabe wählen</button>
            </div>
          </section>:null}
          {p57WritingThread?<section className="p27-journey__p51-writing-selection"
            aria-label="Originalen verbundenen A2-Schriftwechsel eigenständig fortsetzen und überarbeiten">
            <h5>Mehrere A2-Nachrichten verstehen, eigenständig schreiben und revidieren</h5>
            <p><strong>{p57WritingThread.title}</strong> · {p57WritingThread.setting}</p>
            <p><strong>Neuer Schreibauftrag:</strong> {p57WritingThread.compose.situation}</p>
            <p>Nutze den ursprünglichen mehrstufigen Learn-Editor zum Entwerfen
              und Überarbeiten. Diese Arbeit ist unbenotet und speichert keinen
              privaten Rohtext. Der originale StudyPlayer bleibt zuständig für
              einen separaten unabhängig bewerteten Abruf und FSRS.</p>
            <div className="p27-journey__actions">
              <button type="button" disabled={disabled}
                onClick={()=>startPractice(unitId,`writing57-kind:${p57WritingThread.id}:compose`)}>
                Unabhängig im StudyPlayer schreiben
              </button>
              <button type="button" disabled={disabled}
                onClick={()=>startPractice(unitId,`writing57-kind:${p57WritingThread.id}:revision`)}>
                Originalen Korrekturauftrag üben
              </button>
              <button type="button" onClick={()=>setP57WritingId("")}>Reguläre Aufgabe wählen</button>
            </div>
          </section>:null}
          {p56WritingScene?<section className="p27-journey__p51-writing-selection"
            aria-label="Selbstständige Gesprächsantwort nach unerwarteter Rückfrage schriftlich überarbeiten">
            <h5>Eigene spontane A2-Reaktion schreiben und überarbeiten</h5>
            <p><strong>{p56WritingScene.title}</strong> · {p56WritingScene.setting}</p>
            <p><strong>Andere unabhängige Gesprächssituation:</strong> {p56WritingScene.production.situation}</p>
            <p>Der Lernentwurf nutzt ausschließlich den bisherigen lokalen Learn-Schreibeditor.
              Die Revision ist unbenotet und wird ohne privaten Rohtext oder Audio
              als bestehendes StudyEvent erfasst. Nur unabhängiger StudyPlayer
              kann die ursprüngliche FSRS-Lernplanung aktualisieren.</p>
            <div className="p27-journey__actions">
              <button type="button" disabled={disabled}
                onClick={()=>startPractice(unitId,`interaction56-kind:${p56WritingScene.id}:production`)}>
                Gesprächsantwort im StudyPlayer bearbeiten
              </button>
              <button type="button" onClick={()=>setP56WritingId("")}>Reguläre Aufgabe wählen</button>
            </div>
          </section>:null}
          {p55WritingScene?<section className="p27-journey__p51-writing-selection"
            aria-label="Nach dem japanischen Hördialog eigenständig schreiben und überarbeiten">
            <h5>A2 Hörsituationen in eigene Sprechabsicht und schriftliche Revision übertragen</h5>
            <p><strong>{p55WritingScene.title}</strong> · {p55WritingScene.setting}</p>
            <p><strong>Neue Sprecherrolle:</strong> {p55WritingScene.response.situation}</p>
            <p>Die japanische Antwort kannst du selbst laut formulieren und anschließend
              im ursprünglichen Texteditor schreiben. Der Entwurf und die sprachliche
              Selbstrevision sind unbenotet. Kein Audio wird hier gespeichert und
              keine FSRS-Beherrschung erfunden.</p>
            <div className="p27-journey__actions">
              <button type="button" disabled={disabled}
                onClick={()=>startPractice(unitId,`listening55-kind:${p55WritingScene.id}:response`)}>
                Originalen Antwortauftrag im StudyPlayer versuchen
              </button>
              <button type="button" onClick={()=>setP55WritingId("")}>Reguläre Aufgabe wählen</button>
            </div>
          </section>:null}
          {p54WritingReading?<section className="p27-journey__p51-writing-selection"
            aria-label="Zusammenhängenden Lesetext in eine neue Schreibaufgabe übertragen">
            <h5>A2 Lesetext verstehen, eigenständig schreiben und revidieren</h5>
            <p><strong>{p54WritingReading.title}</strong> · {p54WritingReading.situation}</p>
            <p><strong>Neue Schreibsituation:</strong> {p54WritingReading.writing.situation}</p>
            <p>Der Kontext ist original; diese Draft-Revision ist unbewertet und
              verwendet die existierenden StudyEvents ohne gespeicherten Rohtext.
              Eine native FSRS-Bewertung entsteht nur nach einer unabhängigen
              StudyPlayer-Antwort.</p>
            <div className="p27-journey__actions">
              <button type="button" disabled={disabled}
                onClick={()=>startPractice(unitId,`reading54-kind:${p54WritingReading.id}:writing`)}>
                Kontext unabhängig im StudyPlayer schreiben
              </button>
              <button type="button" onClick={()=>setP54WritingId("")}>Standard-Schreibaufgabe wählen</button>
            </div>
          </section>:null}
          {p53WritingWord?<section className="p27-journey__p51-writing-selection"
            aria-label="Wortschatz in eigener Japanischproduktion wiederverwenden">
            <h5>Alltagswort im vorhandenen Schreibeditor aktiv verwenden</h5>
            <p lang="ja"><strong>{p53WritingWord.written}</strong> ·
              {p53WritingWord.reading} · {p53WritingWord.collocations.join(" ／ ")}</p>
            <p>{p53WritingWord.production.situation}</p>
            <p>Erst eigenständig schreiben, dann überarbeiten und mit dem
              begrenzten Originalmodell vergleichen. Diese Schreibnotiz führt
              zu keiner FSRS-Note und enthält keinen gespeicherten Volltext.</p>
            <div className="p27-journey__actions">
              <button type="button" disabled={disabled}
                onClick={()=>startPractice(unitId,`lexical-kind:${p53WritingWord.id}:production`)}>
                Eigenständigen Gebrauch im StudyPlayer üben
              </button>
              <button type="button" onClick={()=>setP53WritingId("")}>Reguläre Aufgabe wählen</button>
            </div>
          </section>:null}
          {p52WritingTask?<section className="p27-journey__p51-writing-selection"
            aria-label="Neue grammatische Satztransformation schreiben und revidieren">
            <h5>Eigene A2-Satzumformung im vorhandenen Schreibeditor</h5>
            <p><strong>{p52WritingTask.title}</strong> · {p52WritingTask.role}</p>
            <p lang="ja">{p52WritingTask.production.input}</p>
            <p><strong>Neue Aufgabe:</strong> {p52WritingTask.production.scene} {p52WritingTask.production.goal}</p>
            <p>Dieses Schreiben ist unbenotet und aus der FSRS-Bewertung ausgeschlossen.
              Nur die folgende unabhängige StudyPlayer-Antwort nutzt die normale native Planung.</p>
            <div className="p27-journey__actions">
              <button type="button" disabled={disabled}
                onClick={()=>startPractice(unitId,`transform-kind:${p52WritingTask.id}:production`)}>
                Originale Transformation im StudyPlayer üben
              </button>
              <button type="button" onClick={()=>setP52WritingId("")}>Reguläre Schreibaufgabe wählen</button>
            </div>
          </section>:null}
          {p51WritingContrast?<section className="p27-journey__p51-writing-selection"
            aria-label="A2 grammatische Form im eigenen Kontext überarbeiten">
            <h5>Grammatik aus der Situation heraus schriftlich verwenden</h5>
            <p><strong>{p51WritingContrast.title}</strong> · <span lang="ja">
              {p51WritingContrast.formA} / {p51WritingContrast.formB}</span></p>
            <p>{p51WritingContrast.production.situation}</p>
            <p>Das vorhandene Schreiben-System erfasst den Entwurf und
              die Revision, aber bewertet freies Japanisch nicht semantisch.
              Nur unabhängige StudyPlayer-Antworten nutzen die native FSRS-Instanz.</p>
            <div className="p27-journey__actions">
              <button type="button" disabled={disabled}
                onClick={()=>startPractice(unitId,
                  `contrast-kind:${p51WritingContrast.id}:production`)}>
                Eigenständige Grammatikproduktion im StudyPlayer
              </button>
              <button type="button" onClick={()=>setP51WritingId("")}>Standardaufgabe wählen</button>
            </div>
          </section>:null}
          {p50WritingMission?<section className="p27-journey__p50-writing-selection"
            aria-label="Auf gelesene und gehörte Originalinformation reagieren">
            <h5>Informationen verbinden und eigenständig antworten</h5>
            <p><strong>{p50WritingMission.title}</strong> · {p50WritingMission.level}</p>
            <p>{p50WritingMission.writing.instruction}</p>
            <p>Deine Antwort entsteht in unserem bestehenden Entwurf- und
              Überarbeitungssystem. Geführtes Vergleichen ist nicht gleich
              einer unabhängigen FSRS-Erfolgswertung.</p>
            <div className="p27-journey__actions">
              <button type="button" disabled={disabled}
                onClick={()=>startPractice(unitId,
                  `integrated-kind:${p50WritingMission.id}:writing`)}>
                Eigenständig im StudyPlayer schreiben
              </button>
              <button type="button" onClick={()=>setP50WritingId("")}>
                Standardaufgabe wählen
              </button>
            </div>
          </section>:null}
          {p49WritingDocument?<section className="p27-journey__p49-writing-selection"
            aria-label="Aus einem Japanischdokument selbstständig schreiben">
            <h5>Praktische Dokumentantwort eigenständig verfassen</h5>
            <p><strong>{p49WritingDocument.title}</strong> · {p49WritingDocument.level}</p>
            <p>{p49WritingDocument.writing.instruction}</p>
            <p>Nutze die bisherige Entwurf- und Überarbeitungsansicht.
              Originalmuster erscheinen erst nach eigenem Schreiben;
              Lesehilfe ist nicht automatisch eine FSRS-Erfolgswertung.</p>
            <div className="p27-journey__actions">
              <button type="button" disabled={disabled}
                onClick={()=>startPractice(unitId,
                  `document-kind:${p49WritingDocument.id}:writing`)}>
                Unabhängig im StudyPlayer beantworten
              </button>
              <button type="button" onClick={()=>setP49WritingId("")}>
                Standardaufgabe wählen
              </button>
            </div>
          </section>:null}
          {p48WritingCase?<section className="p27-journey__p48-writing-selection"
            aria-label="Aus drei Japanischquellen ein eigenes Ergebnis schreiben">
            <h5>Zusammengeführtes Ergebnis unabhängig schreiben</h5>
            <p><strong>{p48WritingCase.title}</strong> · {p48WritingCase.level}</p>
            <p>{p48WritingCase.writing.instruction}</p>
            <p>Nutze die drei originalen Belege und überarbeite dein Ergebnis
              im existierenden Schreibeditor. Nur die nativen StudyPlayer-Antworten
              können einen echten FSRS-Lernnachweis erzeugen.</p>
            <div className="p27-journey__actions">
              <button type="button" disabled={disabled}
                onClick={()=>startPractice(unitId,
                  `connected-kind:${p48WritingCase.id}:writing`)}>
                Eigenständig im StudyPlayer schreiben
              </button>
              <button type="button" onClick={()=>setP48WritingId("")}>
                Standardaufgabe wählen
              </button>
            </div>
          </section>:null}
          {p47WritingScene?<section className="p27-journey__p47-writing-selection"
            aria-label="Aus dem gehörten Gespräch eine eigene Antwort verfassen">
            <h5>Gehörte Situation eigenständig weiterführen</h5>
            <p><strong>{p47WritingScene.title}</strong> · {p47WritingScene.level}</p>
            <p>{p47WritingScene.response.instruction}</p>
            <p>Der vorhandene Schreibeditor erfasst deinen Entwurf und deine Überarbeitung.
              Originalbeispiele erscheinen erst nach dem eigenen Versuch; geführte
              Antworten erzeugen keine FSRS-Erfolge.</p>
            <div className="p27-journey__actions">
              <button type="button" disabled={disabled}
                onClick={()=>startPractice(unitId,
                  `listening-kind:${p47WritingScene.id}:response`)}>
                Im StudyPlayer eigenständig formulieren
              </button>
              <button type="button" onClick={()=>setP47WritingId("")}>Standardaufgabe wählen</button>
            </div>
          </section>:null}
          {p46WritingPassage?<section className="p27-journey__p46-writing-selection"
            aria-label="Aus dem Lesetext einen eigenen Satz verfassen">
            <h5>Originaler Lesetext · eigene Erklärung</h5>
            <p><strong>{p46WritingPassage.title}</strong> · {p46WritingPassage.level}</p>
            <p>{p46WritingPassage.writing.situation}</p>
            <p>Verknüpfe die Informationen der Passage. Im bereits bestehenden Editor
              bleibt die Musterlösung bis zur Überarbeitungsphase verborgen.
              Dein lokaler Vergleich ist keine FSRS-Bewertung.</p>
            <div className="p27-journey__actions">
              <button type="button" disabled={disabled}
                onClick={()=>startPractice(unitId,
                  `reading-kind:${p46WritingPassage.id}:writing`)}>
                Ohne Beispiel im StudyPlayer schreiben
              </button>
              <button type="button" onClick={()=>setP46WritingId("")}>Standardaufgabe wählen</button>
            </div>
          </section>:null}
          {p45UnitChallenges.length?<section className="p27-journey__p45-writing"
            aria-label="Gesprächsantwort in ursprünglichem Schreibeditor überarbeiten">
            <h5>Einen Gesprächszug ohne Vorlage schreiben</h5>
            <p>Wähle eine der längeren Originalunterhaltungen und einen einzelnen
              Gesprächszug. Das erste eigene Ergebnis bleibt unbeurteilt,
              bis du die vorhandene Entwurf-Überarbeitung geöffnet hast.</p>
            <div className="p27-journey__p45-picker" role="group"
              aria-label="Selbstständige Situation zum Schreiben auswählen">
              {p45UnitChallenges.map(c=><button key={c.id} type="button"
                aria-pressed={p45WritingChallenge?.id===c.id}
                onClick={()=>chooseP45Writing(c.id,2)}>{c.title}</button>)}
            </div>
            {p45WritingChallenge&&p45WritingTurn?<div className="p27-journey__p45-writing-context">
              <p><strong>Rahmen:</strong> {p45WritingChallenge.setting}</p>
              <p><strong>Absicht:</strong> {p45WritingChallenge.purpose}</p>
              <div className="p27-journey__p45-turn-select" role="group"
                aria-label="Welchen Dialogzug selbstständig überarbeiten">
                {p45WritingChallenge.turns.map((t,i)=><button key={t.id} type="button"
                  aria-pressed={i===p45WritingIndex}
                  onClick={()=>chooseP45Writing(p45WritingChallenge.id,i)}>Zug {i+1}</button>)}
              </div>
              <p><strong>Gegenüber:</strong> <span lang="ja">{p45WritingTurn.partner}</span></p>
              <p><strong>Dein Ziel:</strong> {p45WritingTurn.goal}</p>
              <p><strong>Kontextänderung:</strong> {p45WritingChallenge.unexpected}</p>
            </div>:null}
            <button type="button" disabled={disabled||!p45WritingChallenge}
              onClick={()=>p45WritingChallenge&&startPractice(unitId,
                `independent:${p45WritingChallenge.id}`)}>
              Alle vier Züge unabhängig im StudyPlayer beantworten
            </button>
          </section>:null}
          {p44UnitCases.length?<section className="p27-journey__p44-writing"
            aria-label="Pragmatischen Gesprächskontext selbst verfassen">
            <h5>Situationsgerechte Antwort selbst schreiben</h5>
            <p>Wähle, ob du die erste Bitte, Einladung, Absage oder Korrektur
              ausdrückst oder auf die nachfolgende Person reagierst.
              Schreibe zuerst selbst; Musterbeispiele bleiben im bestehenden Überarbeitungsschritt.</p>
            <div className="p27-journey__p44-picker" role="group"
              aria-label="Pragmatischen Kontrast zum Schreiben wählen">
              {p44UnitCases.map(item=><button key={item.id} type="button"
                aria-pressed={p44WritingCase?.id===item.id}
                onClick={()=>chooseP44Writing(item.id,"production")}>{item.title}</button>)}
            </div>
            {p44WritingCase?<div className="p27-journey__p44-writing-context">
              <p><strong>Beziehung:</strong> {p44WritingCase.relationship}</p>
              <p><strong>Ausgangslage:</strong> {p44WritingCase.context}</p>
              <div className="p27-journey__p44-step-choice" role="group"
                aria-label="Erste Aussage oder anschließende Antwort wählen">
                <button type="button" aria-pressed={p44WritingStep==="production"}
                  onClick={()=>chooseP44Writing(p44WritingCase.id,"production")}>Erste Antwort</button>
                <button type="button" aria-pressed={p44WritingStep==="reply"}
                  onClick={()=>chooseP44Writing(p44WritingCase.id,"reply")}>Gesprächsfortsetzung</button>
              </div>
              <p><strong>Gesprächspartner:</strong>{" "}
                <span lang="ja">{p44WritingStep==="reply"?p44WritingCase.partnerFollowup:p44WritingCase.partner}</span></p>
              <p><strong>Deine Absicht:</strong> {p44WritingTask}</p>
              <p><strong>Missverständliche Beispielantwort:</strong>{" "}
                <span lang="ja">{p44WritingStep==="reply"?p44WritingCase.followupMisstep:p44WritingCase.misleading}</span></p>
            </div>:null}
            <button type="button" disabled={disabled||!p44WritingCase}
              onClick={()=>p44WritingCase&&startPractice(unitId,
                `pragmatic-step:${p44WritingCase.id}:${p44WritingStep}`)}>
              Diese Antwort im StudyPlayer unabhängig schreiben
            </button>
          </section>:null}
          {p43UnitScenes.length?<section className="p27-journey__p43-writing"
            aria-label="Verzweigung und Reparatur gezielt schreiben">
            <h5>Entscheidung oder Missverständnis schriftlich korrigieren</h5>
            <p>Wähle eine selbstverfasste Antwort aus einem echten Gesprächszweig.
              Benutze die vorhandenen Felder für Entwurf, Überarbeitung und Vergleich.
              Die Vergleichshilfe ist nicht die unabhängige StudyPlayer-Bewertung.</p>
            <div className="p27-journey__p43-picker" role="group"
              aria-label="Verzweigendes Gespräch für das Schreiben">
              {p43UnitScenes.map(scene=><button key={scene.id} type="button"
                aria-pressed={p43WritingSceneId===scene.id}
                onClick={()=>chooseP43Writing(scene.id,"repair")}>{scene.title}</button>)}
            </div>
            {p43WritingScene&&p43WritingDetail?<div className="p27-journey__p43-writing-context">
              <p><strong>Situation:</strong> {p43WritingScene.setting}</p>
              <div className="p27-journey__p43-branches" role="group"
                aria-label="Gesprächszweig für die Schreibaufgabe">
                {(["direct","alternate","repair"] as const).map(route=><button key={route}
                  type="button" aria-pressed={p43WritingRoute===route}
                  onClick={()=>chooseP43Writing(p43WritingScene.id,route)}>
                  {route==="direct"?"Direkte Lösung":route==="alternate"?"Alternative":"Missverständnis reparieren"}
                </button>)}
              </div>
              <p><strong>Gesprächspartner:</strong> <span lang="ja">{p43WritingDetail.partner}</span></p>
              <p><strong>Dein Ziel:</strong> {p43WritingDetail.intention}</p>
              <p><strong>Missverständlicher Satz:</strong> <span lang="ja">{p43WritingDetail.misstep}</span></p>
            </div>:null}
            <button type="button" disabled={disabled||!p43WritingScene}
              onClick={()=>p43WritingScene&&startPractice(unitId,
                `branch-route:${p43WritingScene.id}:${p43WritingRoute}`)}>
              Diesen Gesprächszweig unabhängig beantworten
            </button>
          </section>:null}
          {p40UnitArcs.length?<section className="p27-journey__p40-writing" aria-label="Zusammenhängendes Gespräch schriftlich korrigieren">
            <h5>Antwort aus einem Gespräch korrigieren</h5>
            <p>Wähle einen Gesprächskontext. Überarbeite die entscheidende Antwort
              nach dem unerwarteten Hinweis. Bei längeren Dialogen kannst du auch andere Züge auswählen.
              Die Musterantwort erscheint erst im vorhandenen Überarbeitungsablauf.</p>
            <div className="p27-journey__p40-arcs" role="group" aria-label="Gespräch für Schreibaufgabe wählen">
              {p40UnitArcs.map(arc=><button key={arc.id} type="button"
                aria-pressed={p40WritingArc?.id===arc.id} onClick={()=>chooseP40Writing(arc.id)}>
                {arc.title}</button>)}
            </div>
            {p40WritingArc&&p40WritingTurn?<div className="p27-journey__p40-context">
              {(p41ArcById(p40WritingArc.id)||p42ArcById(p40WritingArc.id))?<div className="p27-journey__p41-writing-turns"
                role="group" aria-label="Gesprächszug zur schriftlichen Korrektur auswählen">
                {p40WritingArc.turns.slice(1).map((item,i)=><button key={item.id}
                  type="button" aria-pressed={p40WritingTurnIndex===i+1}
                  onClick={()=>chooseP40Writing(p40WritingArc.id,i+1)}>
                  Schritt {item.number}{(p41ArcById(p40WritingArc.id)??p42ArcById(p40WritingArc.id))?.pivotTurn===item.number?" · Planwechsel":""}
                </button>)}
              </div>:null}
              {p40WritingTurnIndex>0?<p><strong>Vorherige Ziele:</strong>{" "}
                {p40WritingArc.turns.slice(0,p40WritingTurnIndex).map(t=>t.intention).join(" → ")}</p>:null}
              <p><strong>Bisheriger Verlauf:</strong> {p40WritingArc.setting}</p>
              {p42ArcById(p40WritingArc.id)?<p><strong>Adressat und Register:</strong>{" "}
                {p42ArcById(p40WritingArc.id)?.interlocutor} ·
                {p42ArcById(p40WritingArc.id)?.register==="polite"?" höflich":" vertraut"}.
                {p42ArcById(p40WritingArc.id)?.contrast}</p>:null}
              <p><strong>Gesprächspartner:</strong> <span lang="ja">{p40WritingTurn.partner}</span></p>
              <p><strong>Fehlerhafter Satz:</strong> <span lang="ja">{p40WritingTurn.misstep}</span></p>
              <p><strong>Absicht:</strong> {p40WritingTurn.intention}</p>
              {(p41ArcById(p40WritingArc.id)||p42ArcById(p40WritingArc.id))?<p><strong>Gesprächsziel:</strong>{" "}
                {(p41ArcById(p40WritingArc.id)??p42ArcById(p40WritingArc.id))?.outcome}</p>:null}
            </div>:null}
            <button type="button" disabled={disabled}
              onClick={()=>startPractice(unitId,"production")}>
              Weitere unabhängige Schreibaufgaben im StudyPlayer
            </button>
          </section>:null}
          {p39UnitCases.length?<section className="p27-journey__p39-writing" aria-label="Alltagssituation für das Schreiben wählen">
            <h5>Gezielte Schreibkorrektur</h5>
            <p>Wähle einen Kontext; eine zuletzt verfehlte Lernkarte wird bevorzugt vorgeschlagen.
              Dein Entwurf bleibt im bestehenden Schreibfeld und wird nicht automatisch sprachlich bewertet.</p>
            <div className="p27-journey__p39-picker" role="group" aria-label="Schreibsituation">
              <button type="button" aria-pressed={!p39Chosen&&!p40WritingTurn&&!p43WritingDetail&&!p44WritingCase&&!p45WritingTurn&&!p46WritingPassage&&!p47WritingScene&&!p48WritingCase&&!p49WritingDocument&&!p50WritingMission&&!p51WritingContrast&&!p52WritingTask&&!p53WritingWord&&!p54WritingReading&&!p55WritingScene&&!p56WritingScene&&!p57WritingThread&&!p58WritingMission&&!p59WritingMission&&!p60WritingLesson}
                onClick={()=>{setP39WritingId("");setP40WritingArcId("");setP43WritingSceneId("");setP44WritingId("");setP45WritingId("");setP46WritingId("");setP47WritingId("");setP48WritingId("");setP49WritingId("");setP50WritingId("");setP51WritingId("");setP52WritingId("");setP53WritingId("");setP54WritingId("");setP55WritingId("");setP56WritingId("");setP57WritingId("");setP58WritingId("");setP59WritingId("");setP60WritingId("");setDraft("");setRewrite("");setRewriteStage("draft");setReport(null);setSaved(false);}}>
                Reguläres Lernziel</button>
              {p39UnitCases.map(c=><button key={c.id} type="button" aria-pressed={p39Chosen?.id===c.id}
                onClick={()=>{setP39WritingId(c.id);setP40WritingArcId("");setP43WritingSceneId("");setP44WritingId("");setP45WritingId("");setP46WritingId("");setP47WritingId("");setP48WritingId("");setP49WritingId("");setP50WritingId("");setP51WritingId("");setP52WritingId("");setP53WritingId("");setP54WritingId("");setP55WritingId("");setP56WritingId("");setP57WritingId("");setP58WritingId("");setP59WritingId("");setP60WritingId("");setDraft("");setRewrite("");setRewriteStage("draft");setReport(null);setSaved(false);}}>
                {c.title}{p39Priority?.id===c.id?" · Vorschlag":""}</button>)}
            </div>
            {p39Chosen?<p>Problematischer Ausgangssatz: <span lang="ja">{p39Chosen.distractors[0]?.form}</span>.
              Formuliere diesen Satz für die vorgegebene Absicht neu.</p>:null}
            <button type="button" disabled={disabled} onClick={()=>startPractice(unitId,"production")}>
              Unabhängige Schreibkorrekturen im StudyPlayer</button>
          </section>:null}
          <p>{p60WritingLesson?p60WritingLesson.writing.situation:
            p59WritingMission?p59WritingMission.write.situation:
            p58WritingMission?p58WritingMission.write.situation:
            p57WritingThread?p57WritingThread.compose.situation:
            p56WritingScene?p56WritingScene.production.situation:
            p55WritingScene?p55WritingScene.response.situation:
            p54WritingReading?p54WritingReading.writing.situation:
            p53WritingWord?p53WritingWord.production.situation:
            p52WritingTask?(p52WritingTask.production.scene+" "+p52WritingTask.production.goal):
            p51WritingContrast?p51WritingContrast.production.situation:
            p50WritingMission?p50WritingMission.writing.instruction:
            p49WritingDocument?p49WritingDocument.writing.instruction:
            p48WritingCase?p48WritingCase.writing.instruction:
            p47WritingScene?p47WritingScene.response.instruction:
            p46WritingPassage?p46WritingPassage.writing.situation:
            p45WritingTurn?p45WritingTurn.goal:
            p44WritingCase?p44WritingTask:p43WritingDetail?p43WritingDetail.intention:
            p40WritingTurn?p40WritingTurn.intention:
            p39Chosen?p39Chosen.situation:unit.writing.task}</p>
          <p className="p27-journey__keyhint">Tastatur: Strg + Enter (Mac: ⌘ + Enter) vergleicht Antworten oder öffnet den nächsten Schreibschritt. Japanische IME-Eingabe bleibt ungestört.</p>
          <label htmlFor="p27-draft">Erste Fassung</label>
          <textarea id="p27-draft" rows={4} lang="ja" value={draft}
            aria-keyshortcuts="Control+Enter Meta+Enter"
            onKeyDown={e=>{if(!e.nativeEvent.isComposing&&(e.ctrlKey||e.metaKey)&&e.key==="Enter"){
              e.preventDefault();if(draft.trim()&&!busy){
                setRewrite(draft);setRewriteStage("revise");setReport(null);setSaved(false);
              }
            }}}
            onChange={e=>{
            setDraft(e.target.value);setRewriteStage("draft");setReport(null);setSaved(false);
          }}/>
          <div className="p27-journey__actions">
            <button type="button" onClick={()=>recognize("draft")}>Diktieren</button>
            <button type="button" disabled={!draft.trim()} onClick={()=>{
              setRewrite(draft);setRewriteStage("revise");setReport(null);setSaved(false);
            }}>Überarbeiten</button>
          </div>
          {rewriteStage!=="draft"?<>
            <div className="p27-journey__note">
              <strong>Orientierung zur Korrektur</strong>
              <p>{p60WritingLesson?p60WritingLesson.writing.why:
                p59WritingMission?p59WritingMission.write.explanation:
                p58WritingMission?p58WritingMission.write.why:
                p57WritingThread?p57WritingThread.compose.why:
                p56WritingScene?p56WritingScene.production.explanation:
                p55WritingScene?p55WritingScene.response.why:
                p54WritingReading?p54WritingReading.writing.why:
                p53WritingWord?(p53WritingWord.nuance+" "+p53WritingWord.repair):
                p52WritingTask?p52WritingTask.production.why:
                p51WritingContrast?p51WritingContrast.production.feedback:
                p50WritingMission?p50WritingMission.writing.feedback:
                p49WritingDocument?p49WritingDocument.writing.explanation:
                p48WritingCase?p48WritingCase.writing.feedback:
                p47WritingScene?p47WritingScene.response.feedback:
                p46WritingPassage?p46WritingPassage.writing.why:
                p45WritingTurn?p45WritingTurn.why:
                p44WritingCase?(p44WritingStep==="reply"?p44WritingCase.followupWhy:p44WritingCase.nuance):
                p43WritingDetail?p43WritingDetail.why:p40WritingTurn?p40WritingTurn.why:
                p39Chosen?p39Chosen.rule:unit.writing.reflection}</p>
              {!p39Chosen&&!p40WritingTurn&&!p43WritingDetail&&!p44WritingCase&&!p45WritingTurn&&!p46WritingPassage&&!p47WritingScene&&!p48WritingCase&&!p49WritingDocument&&!p50WritingMission&&!p51WritingContrast&&!p52WritingTask&&!p53WritingWord&&!p54WritingReading&&!p55WritingScene&&!p56WritingScene&&!p57WritingThread&&!p58WritingMission&&!p59WritingMission&&!p60WritingLesson?
                <p><span lang="ja">{unit.writing.features.join(" · ")}</span></p>:null}
              <details><summary>Originales Beispiel vergleichen</summary>
                <p lang="ja">{p60WritingLesson?p60WritingLesson.writing.model:
                  p59WritingMission?p59WritingMission.write.model:
                  p58WritingMission?p58WritingMission.write.model:
                  p57WritingThread?p57WritingThread.compose.model:
                  p56WritingScene?p56WritingScene.production.model:
                  p55WritingScene?p55WritingScene.response.model:
                  p54WritingReading?p54WritingReading.writing.model:
                  p53WritingWord?p53WritingWord.production.model:
                  p52WritingTask?p52WritingTask.production.model:
                  p51WritingContrast?p51WritingContrast.production.model:
                  p50WritingMission?p50WritingMission.writing.model:
                  p49WritingDocument?p49WritingDocument.writing.model:
                  p48WritingCase?p48WritingCase.writing.model:
                  p47WritingScene?p47WritingScene.response.model:
                  p46WritingPassage?p46WritingPassage.writing.model:
                  p45WritingTurn?p45WritingTurn.model:
                  p44WritingCase?(p44WritingStep==="reply"?p44WritingCase.followupModel:p44WritingCase.model):
                  p43WritingDetail?p43WritingDetail.model:p40WritingTurn?p40WritingTurn.model:
                  p39Chosen?p39Chosen.model:unit.writing.reference}</p>
                {p60WritingLesson?<p lang="ja">{p60WritingLesson.writing.alternative}</p>:
                  p59WritingMission?<p lang="ja">{p59WritingMission.write.alternative}</p>:
                  p58WritingMission?<p lang="ja">{p58WritingMission.write.alternative}</p>:
                  p57WritingThread?<p lang="ja">{p57WritingThread.compose.alternate}</p>:
                  p56WritingScene?<p lang="ja">{p56WritingScene.production.alternative}</p>:
                  p55WritingScene?<p lang="ja">{p55WritingScene.response.alternative}</p>:
                  p54WritingReading?<p lang="ja">{p54WritingReading.writing.alternative}</p>:
                  p52WritingTask?<p lang="ja">{p52WritingTask.production.alternative}</p>:
                  p51WritingContrast?<p lang="ja">{p51WritingContrast.production.alternative}</p>:
                  p50WritingMission?<p lang="ja">{p50WritingMission.writing.alternative}</p>:
                  p49WritingDocument?<p lang="ja">{p49WritingDocument.writing.alternative}</p>:
                  p48WritingCase?<p lang="ja">{p48WritingCase.writing.alternative}</p>:
                  p47WritingScene?<p lang="ja">{p47WritingScene.response.alternative}</p>:
                  p46WritingPassage?<p lang="ja">{p46WritingPassage.writing.alternative}</p>:
                  p45WritingTurn?<p lang="ja">{p45WritingTurn.alternative}</p>:
                  p44WritingCase?<p lang="ja">{p44WritingStep==="reply"?
                  p44WritingCase.followupAlternative:p44WritingCase.alternative}</p>:
                  p43WritingDetail?<p lang="ja">{p43WritingDetail.alternative}</p>:
                  p40WritingTurn?<p lang="ja">{p40WritingTurn.alternative}</p>:
                  p39Chosen?<p lang="ja">{p39Chosen.alternative}</p>:null}</details>
            </div>
            <label htmlFor="p27-rewrite">Überarbeitete Version</label>
            <textarea id="p27-rewrite" rows={4} lang="ja" value={rewrite}
              aria-keyshortcuts="Control+Enter Meta+Enter"
              onKeyDown={e=>{if(!e.nativeEvent.isComposing&&(e.ctrlKey||e.metaKey)&&e.key==="Enter"){
                e.preventDefault();if(rewrite.trim()&&!busy){
                  setReport(compareWriting(draft,rewrite,p39Chosen||p40WritingTurn||p43WritingDetail||p44WritingCase||p45WritingTurn||p46WritingPassage||p47WritingScene||p48WritingCase||p49WritingDocument||p50WritingMission||p51WritingContrast||p52WritingTask||p53WritingWord||p54WritingReading||p55WritingScene||p56WritingScene||p57WritingThread||p58WritingMission||p59WritingMission||p60WritingLesson?[]:unit.writing.features));setRewriteStage("compare");
                }
              }}}
              onChange={e=>{
              setRewrite(e.target.value);setRewriteStage("revise");setReport(null);setSaved(false);
            }}/>
            <div className="p27-journey__actions">
              <button type="button" onClick={()=>recognize("rewrite")}>Überarbeitung diktieren</button>
              <button type="button" disabled={!rewrite.trim()} onClick={()=>{
                setReport(compareWriting(draft,rewrite,p39Chosen||p40WritingTurn||p43WritingDetail||p44WritingCase||p45WritingTurn||p46WritingPassage||p47WritingScene||p48WritingCase||p49WritingDocument||p50WritingMission||p51WritingContrast||p52WritingTask||p53WritingWord||p54WritingReading||p55WritingScene||p56WritingScene||p57WritingThread||p58WritingMission||p59WritingMission||p60WritingLesson?[]:unit.writing.features));setRewriteStage("compare");
              }}>Versionen vergleichen</button>
            </div>
          </>:null}
          {rewriteStage==="compare"&&report?<div className="p27-journey__note" role="status">
            <strong>Zeichenbasierte Beobachtungen, keine Sprachbewertung</strong>
            <p>{report.oldLength} → {report.newLength} Zeichen. Geändert: {report.changed?"ja":"nein"}</p>
            {p60WritingLesson?<div className="p27-journey__p51-comparison-feedback">
              <strong>P60 · Quellengebundener eigenständiger Entwurf ohne automatische Freitextnote</strong>
              <p>{p60Compare(rewrite,
                [p60WritingLesson.writing.model,p60WritingLesson.writing.alternative],
                p60WritingLesson.writing.trap,p60WritingLesson.writing.why).message}</p>
              <p>{p60WritingLesson.grammar}</p>
              <small>Ein passender fremder japanischer Satz ist nicht automatisch
                falsch, wenn er von beiden Originalmodellen abweicht.
                Keine CEFR-/JLPT-Zertifizierung aus diesem Entwurf.</small>
            </div>:p59WritingMission?<div className="p27-journey__p51-comparison-feedback">
              <strong>Unbenoteter originaler Quellenvergleich, keine pauschale Freitextbewertung</strong>
              <p>{p59AuthoredFeedback(rewrite,
                [p59WritingMission.write.model,p59WritingMission.write.alternative],
                p59WritingMission.write.misleading,
                p59WritingMission.write.explanation).message}</p>
              <p>{p59WritingMission.contrast}</p>
              <small>Spontane Sprachleistung, JLPT/CEFR-Niveau und sonstige
                korrekte unabhängige Paraphrasen werden hier nicht gemessen.</small>
            </div>:p58WritingMission?<div className="p27-journey__p51-comparison-feedback">
              <strong>Mehrquellen-Schreibauftrag: Originalvergleich ohne automatische Freitextnote</strong>
              <p>{p58Compare(rewrite,
                [p58WritingMission.write.model,p58WritingMission.write.alternative],
                p58WritingMission.write.misleading,p58WritingMission.write.why).message}</p>
              <p>{p58WritingMission.contrast}</p>
              <small>Weder das Lesen, noch Geräte-TTS, noch der freie Entwurf
                belegen gemessene Hörleistung oder A2-Beherrschung.</small>
            </div>:p57WritingThread?<div className="p27-journey__p51-comparison-feedback">
              <strong>Originale funktionale Nachricht – keine offene Textbenotung</strong>
              <p>{p57AuthoredComparison(rewrite,
                [p57WritingThread.compose.model,p57WritingThread.compose.alternate],
                p57WritingThread.compose.misleading,p57WritingThread.compose.why).message}</p>
              <p>{p57WritingThread.contrast}</p>
              <small>Weder andere gültige Formulierungen noch CEFR-Beherrschung
                werden aus einem freien Text automatisch festgestellt.</small>
            </div>:p56WritingScene?<div className="p27-journey__p51-comparison-feedback">
              <strong>Pragmatischer A2-Selbstvergleich, keine Live-Sprachbenotung</strong>
              <p>{p56Compare(rewrite,
                [p56WritingScene.production.model,p56WritingScene.production.alternative],
                p56WritingScene.production.misleading,
                p56WritingScene.production.explanation).message}</p>
              <p>{p56WritingScene.nuance}</p>
              <small>Andere mögliche natürliche japanische Antworten bleiben unbewertet.</small>
            </div>:p55WritingScene?<div className="p27-journey__p51-comparison-feedback">
              <strong>Gesprochene Absicht und schriftliche Revision – keine Sprechbewertung</strong>
              <p>{p55AuthoredFeedback(rewrite,
                [p55WritingScene.response.model,p55WritingScene.response.alternative],
                p55WritingScene.response.misconception,p55WritingScene.response.why).message}</p>
              <p>{p55WritingScene.contrast}</p>
              <small>Nur zwei Originalmuster; keine Aufzeichnung oder allgemeine Japanischbewertung.</small>
            </div>:p54WritingReading?<div className="p27-journey__p51-comparison-feedback">
              <strong>Originaltextgestützter Satzvergleich, keine freie Sprachbewertung</strong>
              <p>{p54AuthoredComparison(rewrite,
                [p54WritingReading.writing.model,p54WritingReading.writing.alternative],
                p54WritingReading.writing.misconception,
                p54WritingReading.writing.why).message}</p>
              <p>{p54WritingReading.contrast}</p>
              <small>Nur authored Muster; andere korrekte Antworten bleiben ohne automatische Bewertung.</small>
            </div>:p53WritingWord?<div className="p27-journey__p51-comparison-feedback">
              <strong>Originalwort und neuer Satz – kein offenes Sprachurteil</strong>
              <p>{p53Compare(rewrite,[p53WritingWord.production.model],p53WritingWord).message}</p>
              <p>{p53WritingWord.nuance}</p>
              <p><strong>Wortverbindungen:</strong> <span lang="ja">
                {p53WritingWord.collocations.join(" ／ ")}</span></p>
            </div>:p52WritingTask?<div className="p27-journey__p51-comparison-feedback">
              <strong>Originalmodell-Abgleich, keine allgemeine automatische Bewertung</strong>
              <p>{p52Compare(rewrite,[p52WritingTask.production.model,
                p52WritingTask.production.alternative],
                p52WritingTask.wrong,p52WritingTask.repair).message}</p>
              <p>{p52WritingTask.production.why}</p>
              <small>Nur verfasste Modellformen können als solche erkannt werden.</small>
            </div>:p51WritingContrast?<div className="p27-journey__p51-comparison-feedback">
              <strong>Grammatische Sprecherabsicht – begrenzter Originalbeispielvergleich</strong>
              <p>{p51AuthoredComparison(rewrite,
                [p51WritingContrast.production.model,p51WritingContrast.production.alternative],
                p51WritingContrast.production.misconception,
                p51WritingContrast.production.feedback).message}</p>
              <p>{p51WritingContrast.choiceRule}</p>
              <small>Außerhalb dieser Beispiele formulierte richtige japanische Sätze
                können hier nicht automatisch als richtig erkannt werden.</small>
            </div>:p50WritingMission?<div className="p27-journey__p50-comparison">
              <strong>Quellenbezogener Mustervergleich – keine allgemeine Bedeutungsbewertung</strong>
              <p>{p50AuthoredComparison(rewrite,
                [p50WritingMission.writing.model,p50WritingMission.writing.alternative],
                p50WritingMission.writing.misconception,p50WritingMission.writing.feedback).message}</p>
              <p>{p50WritingMission.pedagogy}</p>
              <small>Andere gültige eigene Formulierungen bleiben unbenotet.
                Weder Textentwurf noch Transkriptbezug beweisen unabhängig erbrachte Hörleistung.</small>
            </div>:p49WritingDocument?<div className="p27-journey__p49-comparison">
              <strong>Dokumentbezogener Mustervergleich – keine offene Sprachbenotung</strong>
              <p>{p49AuthoredComparison(rewrite,
                [p49WritingDocument.writing.model,p49WritingDocument.writing.alternative],
                p49WritingDocument.writing.trap,p49WritingDocument.writing.explanation).message}</p>
              <p>{p49WritingDocument.contextNote}</p>
              <small>Andere inhaltlich gültige japanische Antworten können korrekt sein,
                auch wenn sie keinem dieser verfassten Beispiele entsprechen.</small>
            </div>:p48WritingCase?<div className="p27-journey__p48-comparison">
              <strong>Quellenbezogener Mustervergleich – keine automatisch bewertete Japanischprosa</strong>
              <p>{p48Comparison(rewrite,
                [p48WritingCase.writing.model,p48WritingCase.writing.alternative],
                p48WritingCase.writing.misconception,p48WritingCase.writing.feedback).message}</p>
              <p>{p48WritingCase.sourceNotes}</p>
              <small>Weitere sachlich korrekte Antworten können außerhalb der verfassten
                Muster liegen und werden nicht als falsch eingeordnet.</small>
            </div>:p47WritingScene?<div className="p27-journey__p47-comparison">
              <strong>Gehörter Kontext – begrenzter schriftlicher Mustervergleich</strong>
              <p>{p47AuthoredFeedback(rewrite,
                [p47WritingScene.response.model,p47WritingScene.response.alternative],
                p47WritingScene.response.misconception,p47WritingScene.response.feedback).message}</p>
              <p>{p47WritingScene.notes}</p>
              <small>Dies ist keine phonetische oder semantische Bewertung beliebiger Sprache.
                Andere gültige Antworten können unklassifiziert bleiben.</small>
            </div>:p46WritingPassage?<div className="p27-journey__p46-comparison">
              <strong>Textgebundener Schreibvergleich – keine automatische Freitextnote</strong>
              <p>{p46AuthoredComparison(rewrite,
                 [p46WritingPassage.writing.model,p46WritingPassage.writing.alternative],
                 p46WritingPassage.writing.misconception,p46WritingPassage.writing.why).message}</p>
              <p>{p46WritingPassage.contextNote}</p>
              <small>Gleichwertige andere japanische Sätze können richtig sein und
                werden hier nicht als falsch klassifiziert.</small>
            </div>:p45WritingTurn?<div className="p27-journey__p45-comparison">
              <strong>Originalbezogener Mustervergleich – keine Bewertung beliebigen Japanischs</strong>
              <p>{p45Feedback(rewrite,p45WritingTurn).message}</p>
              <p>{p45WritingTurn.continuity}</p>
              {p45Feedback(rewrite,p45WritingTurn).kind==="unassessed"?<small>
                Andere korrekt formulierte Antworten können existieren und bleiben unbewertet.
              </small>:null}
            </div>:p44WritingCase?<div className="p27-journey__p44-feedback">
              <strong>Kontextgebundener Mustervergleich, keine universelle Sprachnote</strong>
              <p>{p44AuthoredFeedback(rewrite,
                p44WritingStep==="reply"?
                  [p44WritingCase.followupModel,p44WritingCase.followupAlternative]:
                  [p44WritingCase.model,p44WritingCase.alternative],
                p44WritingStep==="reply"?p44WritingCase.followupMisstep:p44WritingCase.misleading,
                p44WritingStep==="reply"?p44WritingCase.followupWhy:p44WritingCase.misconception
              ).message}</p>
              <p>{p44WritingCase.nuance}</p>
            </div>:p43WritingDetail?<div className="p27-journey__p43-comparison">
              <strong>Originaler Mustervergleich — keine globale Bewertung freier Sprache</strong>
              <p>{p43Feedback(rewrite,[p43WritingDetail.model,p43WritingDetail.alternative],
                p43WritingDetail.misstep,p43WritingDetail.why).message}</p>
              {p43Feedback(rewrite,[p43WritingDetail.model,p43WritingDetail.alternative],
                p43WritingDetail.misstep,p43WritingDetail.why).kind==="unknown"?<small>
                  Andere gültige japanische Formulierungen bleiben unbewertet.</small>:null}
            </div>:p40WritingTurn?<div className="p27-journey__p40-feedback">
              <strong>Kontextgebundene Schreibkorrektur, keine freie Sprachnotenvergabe</strong>
              <p>{p40TurnFeedback(p40WritingTurn,rewrite).message}</p>
              {p40TurnFeedback(p40WritingTurn,rewrite).kind==="unknown"?<small>
                Andere japanische Antworten bleiben ausdrücklich ungeprüft.</small>:null}
            </div>:p39Chosen?<div className="p27-journey__p39-feedback">
              <strong>Nur Abgleich mit bekannten Beispielvarianten</strong>
              <p>{p39AuthoredFeedback(p39Chosen,rewrite).message}</p>
              {p39AuthoredFeedback(p39Chosen,rewrite).kind==="unknown"?<small>
                Andere Formulierungen können richtig sein und bleiben hier unbewertet.</small>:null}
            </div>:<>
              <p>Erkannte Zielzeichenfolgen: {report.found.join(" · ")||"keine"}</p>
              <p>Nicht erkannt: {report.missing.join(" · ")||"keine"}</p>
              <ul>{grammarReflection(unit,rewrite).map((note,i)=><li key={i}>{note}</li>)}</ul>
            </>}
            {!p39Chosen&&!p40WritingTurn&&!p43WritingDetail&&!p44WritingCase&&!p45WritingTurn&&!p46WritingPassage&&!p47WritingScene&&!p48WritingCase&&!p49WritingDocument&&!p50WritingMission&&!p51WritingContrast&&!p52WritingTask&&!p53WritingWord&&!p54WritingReading&&!p55WritingScene&&!p56WritingScene&&!p57WritingThread&&!p58WritingMission&&!p59WritingMission&&!p60WritingLesson?
              <div className="p27-journey__revision">
              <strong>Überarbeitete Partikeln und Formen</strong>
              <p>Neue Partikeln: {describeP29Revision(draft,rewrite,unit).addedParticles.join(" · ")||"keine"}</p>
              <p>Entfernte Partikeln: {describeP29Revision(draft,rewrite,unit).removedParticles.join(" · ")||"keine"}</p>
              <p>Geänderte Höflichkeits-/Zeitformen: {describeP29Revision(draft,rewrite,unit).formChanges.join(" · ")||"keine"}</p>
              {pragmatics?<details><summary>Höflicher und lockerer Stil im Vergleich</summary>
                <p lang="ja">{pragmatics.polite} / {pragmatics.casual}</p>
                <p>{pragmatics.explanation}</p></details>:null}
            </div>:null}
            <button type="button" disabled={disabled||busy||saved} onClick={()=>void saveRevision()}>
              Unbewertete Überarbeitung protokollieren</button>
            {saved?<p>Ohne Rohtext oder Audiodatei gespeichert; kein FSRS-Erfolg.</p>:null}
          </div>:null}
          <button type="button" onClick={()=>setStage("practice")}>Weiter: Wiederholen</button>
        </section>:null}
        {stage==="practice"?<section className="p27-journey__panel">
          <h4>Kontextualisierte Wiederholung</h4>
          {dueUnits.length?<div className="p27-journey__due-shortcuts">
            <h5>Jetzt fällige Wiederholungen</h5>
            <p>Diese direkten Aktionen starten die bestehenden FSRS-Wiederholungssitzungen,
              keine neuen oder bloß freiwilligen Übungen.</p>
            {dueUnits.map(item=><div key={item.unitId} className="p27-journey__due-row">
              <div><strong>{journeyUnit(item.unitId).title}</strong>
                <small>{item.due} fällige Karten</small></div>
              <button type="button" disabled={disabled}
                onClick={()=>startPractice(item.unitId,"review")}>Jetzt wiederholen</button>
              <button type="button" onClick={()=>selectUnit(item.unitId,"practice")}>Einheit ansehen</button>
            </div>)}
          </div>:nearestReturn?<div className="p27-journey__return-navigation">
            <strong>Nächste bereits geplante Wiederholung</strong>
            <p>{journeyUnit(nearestReturn.unitId).title} ·
              {new Date(nearestReturn.nextDueAt!).toLocaleString("de-DE",{dateStyle:"medium",timeStyle:"short"})}</p>
            <button type="button" disabled={disabled} onClick={()=>selectUnit(nearestReturn.unitId,"practice")}>Einheit für später ansehen</button>
          </div>:null}
          {recallPlan?<section className="p27-journey__recall" aria-label="Geplante FSRS-Wiederholung">
            <h5>Später wieder abrufen · tatsächliche FSRS-Termine</h5>
            <p>{recallPlan.explanation}</p>
            <div className="p27-journey__recall-stats">
              <span><strong>{recallPlan.dueNow.length}</strong> jetzt fällig</span>
              <span><strong>{recallPlan.notYetDue}</strong> später geplant</span>
            </div>
            {recallPlan.nextDue?<p>Nächster geplanter Termin: <strong>
              {new Date(recallPlan.nextDue.dueAt).toLocaleString("de-DE",{dateStyle:"medium",timeStyle:"short"})}
            </strong></p>:null}
            {recallPlan.recentlyReviewed>0?<p>{recallPlan.recentlyReviewed} geübte Abrufe innerhalb der letzten {recallPlan.recentWindowMinutes} Minuten.
              Für noch nicht fällige Inhalte ist kein sofortiger erneuter FSRS-Abruf erforderlich.</p>:null}
            <button type="button" disabled={disabled||recallPlan.dueNow.length===0}
              onClick={()=>startPractice(unitId,"review")}>Fällige Karten jetzt wiederholen</button>
          </section>:null}
          {p40ReturnCueStatus.length?<section className="p27-journey__p40-return"
            aria-label="Gesprächsinhalte in neuem Kontext wieder abrufen">
            <h5>Später ohne Dialogvorlage wieder abrufen</h5>
            <p>Jeder Fall hat eine zusätzliche, anders formulierte Alltagsaufgabe.
              Nur nach einem unabhängigen ersten Abruf erzeugt die bestehende
              FSRS-Karte einen zukünftigen Termin. Ohne Termin ist die Übung
              <strong> nicht überfällig</strong>. Freiwilliges Vorziehen kann FSRS aktualisieren.</p>
            {p40ReturnCueStatus.map(cue=><div key={cue.id} className="p27-journey__p40-return-item">
              <div><strong>{p40UnitArcs.find(arc=>arc.id===cue.arcId)?.title??
                p43SceneById(cue.arcId)?.title??p44ById(cue.arcId)?.title??
                p45ById(cue.arcId)?.title??p46ById(cue.arcId)?.title??p47ById(cue.arcId)?.title??p48ById(cue.arcId)?.title??p49ById(cue.arcId)?.title??p50ById(cue.arcId)?.title??p51ById(cue.arcId)?.title??p52ById(cue.arcId)?.title??p53ById(cue.arcId)?.written??p54ById(cue.arcId)?.title??p55ById(cue.arcId)?.title??p56ById(cue.arcId)?.title??p57ById(cue.arcId)?.title??p58ById(cue.arcId)?.title??p59ById(cue.arcId)?.title??p60ById(cue.arcId)?.title??"Gesprächstransfer"}</strong>
                <small>{cue.due?"Jetzt laut FSRS fällig":
                  cue.p60Ready?"Neue P60-unabhängige A2-Konsolidierung nach echtem Lernabstand freigegeben":
                  cue.p59Ready?"Neue P59-unabhängige A2-Performance nach echtem Lernabstand freigegeben":
                  cue.p58Ready?"Neue P58-Mehrquellenmission nach echtem Lernabstand freigegeben":
                  cue.p57Ready?"Neue P57-Schreibsituation nach echtem Lernabstand freigegeben":
                  cue.p56Ready?"Neue P56-Gesprächsreparatur nach echtem Lernabstand freigegeben":
                  cue.p55Ready?"Neuer P55-Hördialog-Kontext nach echtem Lernabstand freigegeben":
                  cue.p54Ready?"Neuer P54-Lesetransfer nach echtem Lernabstand freigegeben":
                  cue.p53Ready?"Neuer P53-Wortgebrauch nach echtem Lernabstand freigegeben":
                  cue.historicalReturn&&cue.historicalReady?
                    "Originaler P40–P52-Transfer: anhand echter früherer Übung freigegeben":
                  cue.historicalReturn?
                    "Erst nach einer bewerteten Originalaufgabe und echtem Lernabstand verfügbar":
                  cue.p52Ready?"Neuer P52-Transfer nach echtem Lernabstand freigegeben":
                  cue.planned?"Für einen späteren FSRS-Termin eingeplant":
                  "Noch kein FSRS-Termin vorhanden"}</small></div>
              <button type="button" disabled={disabled||!cue.due}
                onClick={()=>startPractice(unitId,cue.historicalReturn?`return-due-id:${cue.id}`:`return-due:${cue.arcId}`)}>
                Fälligen Abruf üben
              </button>
              <button type="button" disabled={disabled||
                  (cue.historicalReturn&&!cue.historicalReady)||
                  (!cue.historicalReturn&&Boolean(p52ById(cue.arcId))&&!cue.p52Ready&&!cue.due)||
                  (Boolean(p53ById(cue.arcId))&&!cue.p53Ready&&!cue.due)||
                  (Boolean(p54ById(cue.arcId))&&!cue.p54Ready&&!cue.due)||
                  (Boolean(p55ById(cue.arcId))&&!cue.p55Ready&&!cue.due)||
                  (Boolean(p56ById(cue.arcId))&&!cue.p56Ready&&!cue.due)||
                  (Boolean(p57ById(cue.arcId))&&!cue.p57Ready&&!cue.due)||
                  (Boolean(p58ById(cue.arcId))&&!cue.p58Ready&&!cue.due)||
                  (Boolean(p59ById(cue.arcId))&&!cue.p59Ready&&!cue.due)||
                  (Boolean(p60ById(cue.arcId))&&!cue.p60Ready&&!cue.due)}
                onClick={()=>startPractice(unitId,cue.historicalReturn?`return-id:${cue.id}`:`return:${cue.arcId}`)}>
                Freiwillig selbstständig üben
              </button>
            </div>)}
          </section>:null}
          <p>Heute fällige Karten, letzte Fehler und neue Situationen werden aus demselben bestehenden Lernverlauf ermittelt.</p>
          <div className="p27-journey__practice-paths" aria-label="Drei unterschiedliche Lernwege">
            <section>
              <strong>{profile?.unseen??0} neu</strong>
              <p>Erste Begegnung mit noch nicht unabhängig bewerteten oder
                eingeplanten Aufgaben. Nicht als überfällig bezeichnet.</p>
              <button type="button" disabled={disabled||!(profile?.unseen)}
                onClick={()=>startPractice(unitId,"new")}>Neu lernen</button>
            </section>
            <section>
              <strong>{profile?.retry??0} zuletzt fehlerhaft</strong>
              <p>Freiwillige erneute Übung nach einem bewerteten Fehler.
                Dies kann einen zukünftigen FSRS-Termin vorziehen.</p>
              <button type="button" disabled={disabled||!(profile?.retry)}
                onClick={()=>startPractice(unitId,"retry")}>Fehler üben</button>
            </section>
            <section>
              <strong>{profile?.due??0} laut FSRS fällig</strong>
              <p>Nur Karten, deren festgelegter FSRS-Wiederholungstermin
                bereits erreicht wurde.</p>
              <button type="button" disabled={disabled||!(profile?.due)}
                onClick={()=>startPractice(unitId,"review")}>Jetzt wiederholen</button>
            </section>
          </div>
          {mistakes.length>0?<section className="p27-journey__mistakes" aria-labelledby="p35-mistakes-title">
            <h5 id="p35-mistakes-title">Konkrete letzte Fehler gezielt wiederholen</h5>
            <p>Diese Aufgaben hatten zuletzt einen <strong>unabhängig bewerteten</strong>
              fehlerhaften Versuch. Das ist nicht automatisch ein fälliger FSRS-Termin.
              Eine freiwillige gezielte Wiederholung kann deinen FSRS-Zeitplan aktualisieren.</p>
            {mistakes.map(mistake=><div className="p27-journey__mistake" key={mistake.promptId}>
              <div><strong>{mistake.label}</strong>
                <span>{mistake.context}</span>
                <small>Letzter Fehler: {new Date(mistake.lastIncorrectAt).toLocaleString("de-DE",{dateStyle:"medium",timeStyle:"short"})}</small>
                <small><strong>{p37ReviewSignal(mistake.promptId,reviewCatalog,evidence?.traces??[]).status}</strong></small>
                <small>{p37ReviewSignal(mistake.promptId,reviewCatalog,evidence?.traces??[]).explanation}</small>
                {p37ReviewSignal(mistake.promptId,reviewCatalog,evidence?.traces??[]).nextDueAt?
                  <small>FSRS-Wiederholung ab {new Date(p37ReviewSignal(mistake.promptId,reviewCatalog,evidence?.traces??[]).nextDueAt!).toLocaleString("de-DE",{dateStyle:"medium",timeStyle:"short"})}</small>:null}
              </div>
              <div className="p27-journey__mistake-actions">
                <button type="button" disabled={disabled}
                  onClick={()=>startMistakePractice(unitId,mistake.promptId)}>
                  Genau diese Aufgabe üben
                </button>
                <details>
                  <summary>Worauf achten? (ohne Antwortvorgabe)</summary>
                  <strong>{p36RemediationHint(mistake.promptId,extraJourneyPrompts).title}</strong>
                  <p>{p36RemediationHint(mistake.promptId,extraJourneyPrompts).promptSpecificGoal}</p>
                  <button type="button" onClick={()=>
                    setStage(p36RemediationHint(mistake.promptId,extraJourneyPrompts).lessonStage)}>
                    {p36RemediationHint(mistake.promptId,extraJourneyPrompts).action}
                  </button>
                </details>
              </div>
            </div>)}
          </section>:null}
          {weakAreas?<div className="p27-journey__weakareas">
            <h5>Übungsschwerpunkte aus echten Versuchen</h5>
            <p>Diese Zahlen sind <strong>keine</strong> Sprachstand- oder Beherrschungsprozente. Sie beruhen auf fälligen Karten und zuletzt bewerteten Antworten.</p>
            <div className="p27-journey__weakgrid">
              {weakAreas.areas.filter(area=>area.total>0).map(area=><div key={area.area}>
                <strong>{areaLabels[area.area]}</strong>
                <p>{area.reason}</p>
                <small>{area.practiced} von {area.total} Übungscues bisher versucht</small>
                <button type="button" disabled={disabled} onClick={()=>{
                  if(area.area==="sentence"){setStage("build");return;}
                  if(area.area==="grammar"){startPractice(unitId,"grammar");return;}
                  if(area.area==="dialogue"){startPractice(unitId,"production");return;}
                  startPractice(unitId,"transfer");
                }}>
                  {area.area==="sentence"?"Satzbau gezielt üben":
                  area.area==="grammar"?"Grammatikkontraste üben":
                  area.area==="dialogue"?"Aktive Antworten üben":"Wörter übertragen"}
                </button>
              </div>)}
            </div>
          </div>:null}
          {nextActions.length?<div className="p27-journey__adaptive">
            <h5>Deine nächsten Lernschritte</h5>
            <p>Aus dem vorhandenen lokalen Lernverlauf abgeleitet, ohne neue Beherrschungsnote.</p>
            {nextActions.map(action=><button key={action.id} type="button"
              disabled={disabled} onClick={()=>{
                if(action.focus==="review"){
                  const target=progress.find(p=>p.id===action.unitId);
                  startPractice(action.unitId,(target?.due??0)>0?"review":"retry");
                  return;
                }
                if(action.focus==="transfer"){startPractice(action.unitId,"transfer");return;}
                if(action.unitId!==unitId&&!selectUnit(action.unitId))return;
                setStage(action.focus==="sentence"?"build":"conversation");
              }}>
              <strong>{action.label}</strong><small>{action.reason}</small>
            </button>)}
          </div>:null}
          {learningLinks.length?<div className="p27-journey__linked">
            <h5>Wörter zwischen Themen verbinden</h5>
            {learningLinks.map(link=><article key={link.id}>
              <p lang="ja">{link.example}</p><p>{link.translation}</p>
              <small>{link.first} ({link.firstMeaning}) · {link.second} ({link.secondMeaning})</small>
            </article>)}
            <button type="button" disabled={disabled}
              onClick={()=>startPractice(unitId,"transfer")}>Verknüpften Wortschatz im StudyPlayer abrufen</button>
          </div>:null}
          <div className="p27-journey__actions">
            <button type="button" disabled={disabled} onClick={()=>startPractice(unitId,"transfer")}>Transfer in neue Situationen</button>
            <button type="button" disabled={disabled} onClick={()=>startPractice(unitId,"register")}>Höflichkeit & Register</button>
            <button type="button" disabled={disabled} onClick={()=>startSourcePractice(unit.source,unit.sourceId,"context")}>Weitere Übungen zu diesem Thema</button>
          </div>
          <button type="button" onClick={()=>selectUnit(journeyUnits[(journeyUnits.indexOf(unit)+1)%journeyUnits.length]!.id)}>
            Nächste Einheit öffnen</button>
        </section>:null}
        {error?<p role="alert" className="p27-journey__error">{error}</p>:null}
      </div>
    </div>
    <p className="p27-journey__muted">Unabhängige Originalinhalte; Marugoto wurde nicht importiert. Nur eigenständig getippte passende Zielantworten zählen als FSRS-Abruf. Freie alternative Antworten bleiben unbewertet, statt pauschal falsch zu sein.</p>
  </section>;
}
