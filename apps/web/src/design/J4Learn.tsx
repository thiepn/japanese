import "./j4.css";
import {CourseCatalog} from "./CourseCatalog";
import {BeginnerEntry} from "./BeginnerEntry";
import {KanaReview} from "./KanaReview";
import type {KanaReviewOverview,KanaReviewScript,KanaReviewSkill} from "../study/kanaReview";
import type {BeginnerOverview} from "../study/beginnerCourse";
import "../study/e10DailyStages.css";
import {useEffect,useMemo,useRef,useState} from "react";
import {UX2TransferPath,type UX2StudioTarget} from "./UX2TransferPath";
import {UX3MixedRecall} from "./UX3MixedRecall";
import {E19SourceWritingStudio} from "./E19SourceWritingStudio";
import {E20SourceOnlyA2} from "./E20SourceOnlyA2";
import type {E18Mode,E18Cohort} from "../study/e18OriginalMixedReview";
import {UX1LearningPath} from "./UX1LearningPath";
import type {E22Selection} from "../study/e22ChapterProgression";
import {AdaptiveRemediation} from "../study/AdaptiveRemediation";
import {AiCoach} from "../ai/AiCoach";
import {RealWorldPerformancePanel} from "../study/RealWorldPerformancePanel";
import type {
  E01Progress,
  E02Overview,
  E03Overview,
  E04Overview,
  E05Evidence,
  E06Overview,
  E19Overview,
  A1MilestoneProgress,
  B1MilestoneProgress,
  B2MilestoneProgress,
  C1FoundationProgress,
  ConjugationMasterySummary,
  CourseUnitProgress,
  GrammarMasterySummary,
  KanaMasterySummary,
  LexicalFluencySummary,
  SentenceMasterySummary,
  StudySummary,
  VocabularyMasterySummary,
} from "../study/runtime";
import {E07JourneyPanel} from "./E07JourneyPanel";
import {E13PracticalLab} from "./E13PracticalLab";
import {E14HandoffStudio} from "./E14HandoffStudio";
import {E15RecoveryQueue} from "./E15RecoveryQueue";
import {E16ConversationStudio} from "./E16ConversationStudio";
import type {E15Focus} from "../study/e15ContextRecovery";
import type {E14HandoffMode,E14HandoffReview} from "../study/e14ListeningHandoff";
import type {E13PracticeMode} from "../study/e13PracticalMixer";
import type {E07Journey,E07Action} from "../study/e07LearningRoute";
import {JCartouche,JInkProgress,JPattern,JSeal} from "./index";

type Props={
   beginner:BeginnerOverview;onStartBeginner:()=>void;onReviewDue:()=>void;
   kanaReview:KanaReviewOverview;onStartKanaReview:(script:KanaReviewScript,skill:KanaReviewSkill)=>void;onFlashcardsChanged:()=>void;
  e01:E01Progress;onStartE01:()=>void;onStartE01Delayed:()=>void;
  e02:E02Overview;onStartE02:(id:string)=>void;onStartE02Delayed:(id:string)=>void;
  e03:E03Overview;onStartE03:(id:string)=>void;onStartE03Delayed:(id:string)=>void;
  e04:E04Overview;onStartE04:(id:string)=>void;onStartE04Delayed:(id:string)=>void;onStartE04Preview:(id:string)=>void;
  e05:E05Evidence;onStartE05Repair:()=>void;onStartE03Preview:(id:string)=>void;onStartE02Preview:(id:string)=>void;
  e06:E06Overview;e19:E19Overview;onStartE19:(key:string)=>void;e14Reviews:readonly E14HandoffReview[];e16WorkspaceId:string;e16WorkspaceCurrent:()=>boolean;onStartE06:(id:string)=>void;onStartE06Full:(id:string)=>void;onStartE11Micro:(id:string)=>void;onStartE13:(ids:readonly string[],mode:E13PracticeMode)=>void;onStartE18:(keys:readonly string[],mode:E18Mode)=>void;onStartE14:(id:string,mode:E14HandoffMode)=>void;onStartE15:(id:string,focus:E15Focus)=>void;onStartE10Stage:(id:string,stage:import("../study/e10DailyStages").E10StageId)=>void;onStartE10DelayedStage:(id:string,stage:import("../study/e10DailyStages").E10DelayedId)=>void;onStartE06FullDelayed:(id:string)=>void;onStartE06Delayed:(id:string)=>void;onStartE06Preview:(id:string)=>void;
  e07:E07Journey;onOpenE07:(action:E07Action)=>void;
  e22Selection:E22Selection|null;onE22Selection:(selection:E22Selection)=>void;
  summary:StudySummary;
  kana:KanaMasterySummary;
  vocab:VocabularyMasterySummary;
  conjugation:ConjugationMasterySummary;
  grammar:GrammarMasterySummary;
  sentence:SentenceMasterySummary;
  lexicalFluency:LexicalFluencySummary;
  course:CourseUnitProgress[];
  milestone:A1MilestoneProgress;
  b1Milestone:B1MilestoneProgress;
  b2Milestone:B2MilestoneProgress;
  c1Foundation:C1FoundationProgress;
  preferredCoachChain:string|null;
  onPreferredCoachChainApplied:()=>void;
  status:string;
  onStart:()=>void;
  onStartUnit:(id:string,intent?:"resume"|"restart")=>void;
  onStartAssessment:(id:string)=>void;
  onStartMilestone:()=>void;
  onStartB1Milestone:()=>void;
  onStartB2Milestone:()=>void;
  onStartC1Foundation:()=>void;
  onC1Practice:()=>void;
  onProductive:(mode:"writing"|"speaking")=>void;
  onLexicalFluency:()=>void;
  onRealWorldChain:(id:string)=>void;
  onRealWorldQualification:()=>void;
};

type RegionMeta={
  level:string;
  japanese:string;
  subtitle:string;
  landscape:string;
};

const REGION_META:Record<string,RegionMeta>={
  A1:{level:"A1",japanese:"はじまり",subtitle:"First forms",landscape:"village"},
  A2:{level:"A2",japanese:"暮らし",subtitle:"Everyday life",landscape:"river"},
  B1:{level:"B1",japanese:"つながり",subtitle:"Connected language",landscape:"bridge"},
  B2:{level:"B2",japanese:"広がり",subtitle:"Independent world",landscape:"city"},
  C1:{level:"C1",japanese:"深み",subtitle:"Advanced depth",landscape:"mountain"},
};

const LEVEL_ORDER=["A1","A2","B1","B2","C1"];

export function J4Learn(props:Props){
  const {
    beginner,onStartBeginner,onReviewDue,kanaReview,onStartKanaReview,onFlashcardsChanged,e01,onStartE01,onStartE01Delayed,e02,onStartE02,onStartE02Delayed,e03,onStartE03,onStartE03Delayed,e04,onStartE04,onStartE04Delayed,onStartE04Preview,e05,onStartE05Repair,onStartE03Preview,onStartE02Preview,e06,e14Reviews,e16WorkspaceId,e16WorkspaceCurrent,onStartE06,onStartE06Full,onStartE11Micro,onStartE13,onStartE18,onStartE14,onStartE15,onStartE10Stage,onStartE06Delayed,onStartE10DelayedStage,onStartE06FullDelayed,onStartE06Preview,e19,onStartE19,e07,onOpenE07,e22Selection,onE22Selection,summary,kana,vocab,conjugation,grammar,sentence,lexicalFluency,course,
    milestone,b1Milestone,b2Milestone,c1Foundation,preferredCoachChain,
    onPreferredCoachChainApplied,status,onStart,onStartUnit,onStartAssessment,
    onStartMilestone,onStartB1Milestone,onStartB2Milestone,onStartC1Foundation,
    onC1Practice,onProductive,onLexicalFluency,onRealWorldChain,onRealWorldQualification,
  }=props;

  const beginnerMode=!beginner.complete||Boolean(e01.unitId&&(e01.status==="not_started"||e01.status==="learning"))||Boolean(e02.nextSceneId);
  const [showFullCourse,setShowFullCourse]=useState(!beginnerMode);
  const [advancedOpen,setAdvancedOpen]=useState(!beginnerMode);
  const coachDrawer=useRef<HTMLDetailsElement|null>(null);
  // Hydrated A0/A1 progress can arrive after this screen initially mounts.
  useEffect(()=>{if(!beginnerMode){setAdvancedOpen(true);setShowFullCourse(true);}},[beginnerMode]);
  useEffect(()=>{
    if(!preferredCoachChain)return;
    setAdvancedOpen(true);
    setShowFullCourse(true);
    const frame=window.requestAnimationFrame(()=>{
      const drawer=coachDrawer.current;
      if(!drawer)return;
      drawer.open=true;
      drawer.querySelector("summary")?.focus({preventScroll:true});
      drawer.scrollIntoView({block:"nearest"});
    });
    return ()=>window.cancelAnimationFrame(frame);
  },[preferredCoachChain]);
  const [showTransfer,setShowTransfer]=useState(e07.primary.origin==="e06");
  const [studioTarget,setStudioTarget]=useState<UX2StudioTarget|null>(null);
  const [a2SourceTarget,setA2SourceTarget]=useState<{key:string;sequence:number}|null>(null);
  useEffect(()=>{if(e07.primary.origin==="e06")setShowTransfer(true);},[e07.primary.key,e07.primary.origin]);
  // Open and focus the existing E13–E17 studio even if the catalogue was hidden.
  useEffect(()=>{
    if(!studioTarget||!showFullCourse)return;
    const frame=window.requestAnimationFrame(()=>{
      const heading=document.getElementById(studioTarget);
      if(heading){heading.setAttribute("tabindex","-1");heading.focus({preventScroll:true});heading.scrollIntoView({block:"start"});}
      setStudioTarget(null);
    });
    return ()=>window.cancelAnimationFrame(frame);
  },[studioTarget,showFullCourse]);
  const openOriginalStudio=(target:UX2StudioTarget)=>{setShowFullCourse(true);setStudioTarget(target);};
  const groups=useMemo(()=>{
    const byLevel=new Map<string,CourseUnitProgress[]>();
    for(const unit of course){
      const key=unit.level||"Course";
      const list=byLevel.get(key)??[];
      list.push(unit);
      byLevel.set(key,list);
    }
    return [...byLevel.entries()]
      .sort(([a],[b])=>{
        const ai=LEVEL_ORDER.indexOf(a);
        const bi=LEVEL_ORDER.indexOf(b);
        return (ai<0?999:ai)-(bi<0?999:bi);
      })
      .map(([level,units])=>({level,units:units.sort((a,b)=>a.order-b.order)}));
  },[course]);

  const current=course.find((unit)=>unit.status!=="mastered")??course.at(-1)??null;
  const mastered=course.filter((unit)=>unit.status==="mastered").length;
  const overall=course.length?course.reduce((sum,unit)=>sum+unit.mastery,0)/course.length:0;
  const kanaCoverage=summary.totalKana?summary.learnedKana/summary.totalKana:0;
  const vocabCoverage=summary.totalVocabulary?summary.learnedVocabulary/summary.totalVocabulary:0;

  return <section className="j4-learn" aria-label="Japanese lessons">
    <span className="j13-marginal" aria-hidden="true">学</span>
    <CourseCatalog course={course} status={status} ownerId={e16WorkspaceId} onStartUnit={onStartUnit} onStartAssessment={onStartAssessment}/>
    {beginnerMode?<BeginnerEntry overview={beginner}
      a1Next={e01.unitId&&(e01.status==="not_started"||e01.status==="learning")?"First conversations":
        e02.scenes.find(scene=>scene.id===e02.nextSceneId)?.title??"A1 practice"}
      due={summary.due} busy={status==="loading"}
      sessionError={status==="error"} onContinue={onStartBeginner} onReview={onReviewDue}/>:null}
    <KanaReview overview={kanaReview} busy={status==="loading"} status={status} onStart={onStartKanaReview} onFlashcardsChanged={onFlashcardsChanged}/>
    <details className="beginner-explore" open={advancedOpen}
      onToggle={event=>setAdvancedOpen(event.currentTarget.open)}>
      <summary>Browse other lessons and advanced practice</summary>
    <UX1LearningPath e01={e01} e02={e02} e03={e03} e04={e04} e19={e19} route={e07}
      selection={e22Selection} onSelectionChange={onE22Selection} onE01={onStartE01} onE01Delayed={onStartE01Delayed} busy={status==="loading"} onOpenE07={onOpenE07} onE02={onStartE02} onE02Delayed={onStartE02Delayed} onE02Preview={onStartE02Preview} onE03={onStartE03} onE03Delayed={onStartE03Delayed} onE03Preview={onStartE03Preview} onE04={onStartE04} onE04Delayed={onStartE04Delayed} onE04Preview={onStartE04Preview} onE19={onStartE19}
       onE20={key=>setA2SourceTarget(previous=>({key,sequence:(previous?.sequence??0)+1}))}/>
    <UX3MixedRecall e02={e02} e03={e03} e04={e04} busy={status==="loading"}
      onStart={onStartE18} onSource={(cohort:E18Cohort,id:string)=>{
        if(cohort==="e02")onStartE02(id);else if(cohort==="e03")onStartE03(id);else onStartE04(id);
      }}/>
    <E19SourceWritingStudio overview={e19} busy={status==="loading"} onWrite={onStartE19}
      onSource={(cohort,id)=>{if(cohort==="e02")onStartE02(id);else if(cohort==="e03")onStartE03(id);else onStartE04(id);}}/>
    <E20SourceOnlyA2 key={e16WorkspaceId} requested={a2SourceTarget} busy={status==="loading"}
      onOriginalPreview={(cohort,id)=>{if(cohort==="e03")onStartE03Preview(id);else onStartE04Preview(id);}}/>
    <button className="ux2-path-toggle" type="button" aria-expanded={showTransfer} aria-controls="ux2-transfer-panel" onClick={()=>setShowTransfer(v=>!v)}>
      <strong>{showTransfer?"Hide":"Open"} cumulative A1–A2 practice</strong>
      <small>{e06.total} original situations · source prerequisites, delayed transfer and conversation studios</small>
    </button>
    <div id="ux2-transfer-panel" hidden={!showTransfer}>
      <UX2TransferPath e06={e06} e05={e05} busy={status==="loading"}
       onSource={c=>{if(c.anchorCohort==="e02")onStartE02(c.anchorSceneId);else if(c.anchorCohort==="e03")onStartE03(c.anchorSceneId);else onStartE04(c.anchorSceneId);}}
       onShort={onStartE06} onFull={onStartE06Full} onPreview={onStartE06Preview} onReview={onStartE06Delayed} onPractical={onStartE11Micro} onRepair={onStartE05Repair} onOpenStudio={openOriginalStudio}/>
    </div>
    <button className="ux1-mobile-catalogue-toggle" type="button" aria-controls="ux1-expanded-catalogue" aria-expanded={showFullCourse} onClick={()=>setShowFullCourse(v=>!v)}>{showFullCourse?"Hide full course and advanced practice":"Open full course and advanced practice"}</button>
    <div id="ux1-expanded-catalogue" className="ux1-expanded-catalogue" data-open={showFullCourse?"yes":"no"}>
    <header className="j4-hero">
      <JPattern name="seigaiha" className="j4-hero__pattern"/>
      <div className="j4-hero__cloud j4-hero__cloud--one" aria-hidden="true"/>
      <div className="j4-hero__cloud j4-hero__cloud--two" aria-hidden="true"/>
      <div className="j4-hero__sun" aria-hidden="true"/>

      <div className="j4-hero__copy">
        <JCartouche japanese="学" subtitle="Learn"/>
        <p className="j4-hero__kicker">A1 → C1 · 学びの絵巻</p>
        <h1 id="j4-title">Your Japanese journey</h1>
        <p>
          Move through one continuous path from script foundations to advanced discourse.
          Each landmark reflects the same course order, evidence, mastery and delayed checks already used by the learning engine.
        </p>
        {status==="empty"?<p role="status">No steps are available for that activity yet. Try another lesson.</p>:null}
        {status==="error"?<p role="alert">This activity could not be loaded. Try again.</p>:null}
        <div className="j4-hero__actions">
          <button className="j4-primary" disabled={status==="loading"} onClick={onStart} type="button">
            <span aria-hidden="true">進</span>
            <span><strong>{current?"Continue the path":"Review the path"}</strong><small>{current?current.title:"Adaptive review"}</small></span>
          </button>
          <div className="j4-hero__mastery">
            <strong>{Math.round(overall*100)}%</strong>
            <span>{mastered} / {course.length} landmarks mastered</span>
          </div>
        </div>
      </div>

      <div className="j4-hero__crest" aria-label="Course progress">
        <span className="j4-hero__crest-ring"/>
        <span className="j4-hero__crest-kanji" aria-hidden="true">道</span>
        <strong>{current?.level??"C1"}</strong>
        <small>{current?"current region":"journey reviewed"}</small>
      </div>
    </header>

    <E07JourneyPanel route={e07} onActivate={onOpenE07} busy={status==="loading"} variant="learn"/>
    <E13PracticalLab cases={e06.cases} busy={status==="loading"} onStart={onStartE13}/>
    <E14HandoffStudio cases={e06.cases} reviews={e14Reviews} busy={status==="loading"} onStart={onStartE14}/>
    <E15RecoveryQueue reviews={e14Reviews} busy={status==="loading"} onStart={onStartE15}/>
    <E16ConversationStudio key={e16WorkspaceId} cases={e06.cases} busy={status==="loading"}
      workspaceId={e16WorkspaceId} workspaceCurrent={e16WorkspaceCurrent}
      onHandoff={caseId=>onStartE14(caseId,"complete-handoff")}/>
    <details className="e07-track-list">
      <summary>Browse every original A1/A2 situation, repair studio and cumulative lesson</summary>
    <section className="e01-entry" aria-label="Original A1 guided conversation journey">
      <div className="e01-entry__copy"><strong>First conversations · A1 contextual learning</strong><p>{e01.canDo} · {e01.answered} guided attempts · {e01.unscored} independent draft attempts. Spoken recognition and structure-only writing never certify fluency.</p>{e01.status==="waiting"&&e01.reviewAvailableAt?<p>Delayed review opens {new Date(e01.reviewAvailableAt).toLocaleString()}.</p>:null}</div>
      <div className="e01-entry__actions"><button type="button" disabled={status==="loading"} onClick={onStartE01}>{e01.answered?"Practice again":"Start contextual lesson"}</button>{(e01.status==="ready"||e01.status==="reviewed")?<button type="button" disabled={status==="loading"} onClick={onStartE01Delayed}>Delayed transfer</button>:null}</div>
    </section>
    <section className="e02-course" aria-labelledby="e02-course-title">
      <header className="e02-course__head"><div><p className="j4-kicker">E02 · ORIGINAL A1 COMMUNICATION</p><h2 id="e02-course-title">Practice Japanese in real situations</h2><p>Each original scene combines hidden-text listening, connected reading, canonical grammar, responses, unscored speaking and writing, then delayed transfer.</p></div><strong>{e02.delayedReviewed}/{e02.total} delayed checks</strong></header>
      <ol className="e02-course__list">{e02.scenes.map((item,index)=><li className="e02-course__item" key={item.id}>
        <div className="e02-course__number">{String(index+1).padStart(2,"0")}</div>
        <div className="e02-course__info"><h3>{item.title}</h3><p>{item.canDo}</p><small>{item.completedControlled}/{item.requiredControlled} controlled items correct · {item.unscoredDrafts} unscored drafts · {item.state.replaceAll("_"," ")}</small>
          {item.state==="waiting"&&item.reviewAvailableAt?<small>Delayed transfer available {new Date(item.reviewAvailableAt).toLocaleString()}</small>:null}</div>
        <div className="e02-course__actions"><button type="button" disabled={status==="loading"} onClick={()=>onStartE02(item.id)}>{item.state==="not_started"?"Study situation":"Repeat situation"}</button>
          {(item.state==="ready"||item.state==="reviewed")?<button className="secondary" type="button" disabled={status==="loading"} onClick={()=>onStartE02Delayed(item.id)}>Delayed transfer</button>:null}</div>
      </li>)}</ol>
      {e02.unmappedScenes.length>0?<details className="e07-source-only"><summary>{e02.unmappedScenes.length} original A1 conversations awaiting complete source-backed unit linkage</summary><p>These original texts have no scored prompts or fabricated Can-do evidence.</p><ul>{e02.unmappedScenes.map(s=><li key={s.id}><strong>{s.title}</strong><button type="button" disabled={status==="loading"} onClick={()=>onStartE02Preview(s.id)}>Read original conversation</button></li>)}</ul></details>:null}
      {e02.total===0?<p role="status">No E02 scenes currently have a complete canonical A1 source link. Original lessons remain readable above without graded events.</p>:null}
    </section>
    <section className="e03-path" aria-labelledby="e03-path-title">
      <header className="e03-path__heading"><div><p className="j4-kicker">E03 · ORIGINAL A2.1 COMMUNICATION</p><h2 id="e03-path-title">Use Japanese across connected situations</h2><p>{e03.authored} original scenes authored · {e03.total} linked to an existing A2 Can-do. A2.1 placement is provisional and does not certify a CEFR level.</p></div><strong>{e03.delayedReviewed}/{e03.total} delayed transfer checks</strong></header>
      {e03.unmappedScenes.length>0?<details className="e03-path__scope"><summary>{e03.unmappedScenes.length} original situations awaiting a verified A2 Can-do association</summary><p>These original texts remain reading-only, with no graded events.</p><ul>{e03.unmappedScenes.map(s=><li key={s.id}><strong>{s.title}</strong><button type="button" disabled={status==="loading"} onClick={()=>onStartE03Preview(s.id)}>Open reading</button></li>)}</ul></details>:null}
      <ol className="e03-path__list">{e03.scenes.map((scene,index)=><li key={scene.id} className="e03-path__item">
        <span className="e03-path__number">{String(index+1).padStart(2,"0")}</span>
        <div className="e03-path__copy"><h3>{scene.title}</h3><p>{scene.setting}</p><small>{scene.canDo} · {scene.unitId}</small><small>{scene.correct}/{scene.required} distinct controlled answers correct · {scene.unscoredDrafts} unscored drafts · {scene.state.replaceAll("_"," ")}</small>
          {scene.state==="waiting"&&scene.reviewAvailableAt?<small>Delayed transfer opens {new Date(scene.reviewAvailableAt).toLocaleString()}</small>:null}</div>
        <div className="e03-path__actions"><button type="button" disabled={status==="loading"} onClick={()=>onStartE03(scene.id)}>{scene.state==="not_started"?"Start situation":"Practise situation"}</button>
          {(scene.state==="ready"||scene.state==="reviewed")?<button type="button" className="secondary" disabled={status==="loading"} onClick={()=>onStartE03Delayed(scene.id)}>Delayed transfer</button>:null}</div>
      </li>)}</ol>
      {e03.total===0?<p role="status">The A2.1 material has no safely verified Can-do links in the current canonical course. No invented progress is offered.</p>:null}
    </section>
    <section className="e04-path" aria-labelledby="e04-path-title">
      <header className="e04-path__heading"><div><p className="j4-kicker">E04 · ORIGINAL ADVANCED ELEMENTARY COMMUNICATION</p><h2 id="e04-path-title">Solve everyday problems in Japanese</h2><p>{e04.authored} original scenes authored; {e04.linked} provisionally linked to existing second-half A2 course objectives. Independent drafts are unscored and language ability is not externally certified.</p></div><strong>{e04.reviewed}/{e04.linked} delayed transfer checks completed</strong></header>
      <ol className="e04-path__list">{e04.scenes.map((scene,index)=><li className="e04-path__item" key={scene.id}>
        <span className="e04-path__number">{String(index+1).padStart(2,"0")}</span>
        <div className="e04-path__copy"><h3>{scene.title}</h3><p>{scene.goal}</p><small>Provisional link: {scene.unitId} · {scene.canDo}</small><small>{scene.guidedCorrect}/{scene.guidedTotal} controlled correct · {scene.unscoredDrafts} unscored drafts · {scene.status.replaceAll("_"," ")}</small>
          {scene.status==="waiting"&&scene.reviewAvailableAt?<small>Delayed review available {new Date(scene.reviewAvailableAt).toLocaleString()}</small>:null}</div>
        <div className="e04-path__actions"><button type="button" disabled={status==="loading"} onClick={()=>onStartE04(scene.id)}>{scene.status==="not_started"?"Start scenario":"Practise scenario"}</button>
          {(scene.status==="ready"||scene.status==="reviewed")?<button type="button" className="secondary" disabled={status==="loading"} onClick={()=>onStartE04Delayed(scene.id)}>Delayed transfer</button>:null}</div>
      </li>)}</ol>
      {e04.unmapped.length>0?<details className="e04-path__unmapped"><summary>{e04.unmapped.length} original scenes are available as unscored readings pending canonical A2 mapping</summary><p>No Can-do progress or assessment scores are assigned to these scenes.</p>
        <ul>{e04.unmapped.map(scene=><li key={scene.id}><strong>{scene.title}</strong><button type="button" disabled={status==="loading"} onClick={()=>onStartE04Preview(scene.id)}>Open original dialogue and reading</button></li>)}</ul></details>:null}
      {e04.linked===0?<p role="status">No sufficiently matched canonical A2.2 objectives. Original content is available above in reading-only form, without fabricated mastery.</p>:null}
    </section>
    <section className="e05-panel e05-panel--learn" aria-labelledby="e05-learn-title">
      <header><div><p className="j4-kicker">E05 · ADAPTIVE CORRECTION</p><h2 id="e05-learn-title">Correct the distinction you missed</h2><p>Original alternative questions target misconceptions. The usual FSRS review must still be completed.</p></div><strong>{e05.repair.pending} outstanding</strong></header>
      {e05.targets.length?<ol>{e05.targets.slice(0,6).map(t=><li key={t.promptId}><strong>{t.title}</strong><small>{t.cohort.toUpperCase()} · {t.skill} · canonical {t.canonicalId}</small></li>)}</ol>:<p>No specific repair targets are pending. Continue your normal lessons.</p>}
      <button type="button" disabled={status==="loading"||e05.repair.pending===0} onClick={onStartE05Repair}>Practise changed-question corrections</button>
      <details><summary>Canonical A1/A2 structure and subdivision limits</summary><p>A1 units: {e05.canonical.a1}; unsplit A2 units: {e05.canonical.unsplitA2}; explicitly labeled A2.1: {e05.canonical.explicitA21}; explicitly labeled A2.2: {e05.canonical.explicitA22}. If the source only labels A2, dividing it in halves is not a verified CEFR/JF A2.1/A2.2 mapping.</p></details>
    </section>
    <section className="e06-course" aria-labelledby="e06-course-title">
      <header className="e06-course__header"><div><p className="j4-kicker">E06 · ORIGINAL INDEPENDENT A1/A2</p><h2 id="e06-course-title">Communicate across everyday situations</h2><p>Seven source-linked cases retain their eight controlled FSRS cues, seven delayed-transfer prompts and two-draft writing. E11 adds original listening and reading plus two new practical reply decisions per case, all optional and excluded from mastery. E12 lets you compare and revise your own message without inventing a spoken proficiency score.</p></div><strong>{e06.reviewed}/{e06.total} delayed sets</strong></header>
      <ol className="e06-course__cases">{e06.cases.map((c,i)=><li key={c.id} className="e06-course__case">
        <span className="e06-course__number">{String(i+1).padStart(2,"0")}</span>
        <div className="e06-course__info"><h3>{c.title}</h3><p>{c.objective}</p><small>{c.level} · {c.anchorCohort.toUpperCase()} source {c.anchorSceneId}{c.canonicalUnitId?" · "+c.canonicalUnitId:" · unlinked original reading"}</small>
          <small>{c.sourceListening?"Listening source done":"Original listening needed"} · {c.sourceReading?"Text/form source done":"Original text/form needed"}</small>
          {c.canDoId?<><small>{c.correct}/{c.required} controlled correct · E08 {c.contextProblemsCorrect}/2 · E09 {c.e09Correct}/{c.e09Required} third-context correct · {c.delayedCorrect}/{c.delayedRequired} delayed correct</small>
          <small>Writing: {c.firstDraftSubmitted?"first draft recorded":"first draft pending"} → {c.revisedDraftSubmitted?"revised draft recorded":"revision pending"} · {c.unscoredWriting} unscored written responses · {c.unscoredSpeaking} unscored speech transcripts</small>
          <small>Next short lesson: {c.dailyStages.find(stage=>stage.id===c.nextDailyStage)?.title??"No new required stage"} · E11 optional: {Number(c.e11ListeningPractised)+Number(c.e11ReadingPractised)}/2 context attempts · {c.e11ResponseAttempts}/2 practical reply decisions (not a mastery score), {c.e11WritingSubmitted?"first message recorded":"first message pending"} → {c.e12RevisedWritingSubmitted?"revised message recorded":"optional revision pending"}</small></>:<small>No verified Can-do link: original teaching preview only, never graded</small>}
          {c.canDoId&&c.dailyStages.length>0?<details className="e10-stage-list">
            <summary>Eight short lessons · choose a source-supported stage</summary>
            <ol>{c.dailyStages.map((stage,index)=><li key={stage.id}>
              <div><strong>{index+1}. {stage.title}</strong><small>{stage.purpose}</small>
                <small>{stage.kind==="optional"?"Optional speaking · can be skipped":stage.kind==="unscored"?"Unscored production · submitted text, not correctness":"Bounded answers"} · {stage.answered}/{stage.required} · {stage.status.replaceAll("_"," ")}</small></div>
              <button type="button" disabled={status==="loading"||stage.status==="locked"} onClick={()=>onStartE10Stage(c.id,stage.id)}>
                {stage.status==="locked"?"Finish earlier lesson":stage.status==="complete"?"Review this stage":"Open short lesson"}
              </button>
            </li>)}</ol>
          </details>:null}
          {c.canDoId&&c.delayedStages.length>0?<details className="e10-stage-list">
            <summary>Three short delayed groups · original twenty-hour gate</summary>
            <ol>{c.delayedStages.map((stage,i)=><li key={stage.id}>
              <div><strong>{i+1}. {stage.title}</strong><small>{stage.purpose}</small>
                <small>{stage.correct}/{stage.required} bounded correct · {stage.status}</small></div>
              <button type="button" disabled={status==="loading"||stage.status==="locked"} onClick={()=>onStartE10DelayedStage(c.id,stage.id)}>
                {stage.status==="locked"?"Wait for source or prior group":stage.status==="complete"?"Review group":"Open delayed group"}
              </button>
            </li>)}</ol>
          </details>:null}
          {c.status==="waiting"&&c.availableAt?<small>Delayed recall opens {new Date(c.availableAt).toLocaleString()}</small>:null}</div>
        <div className="e06-course__actions">
          {c.status==="needs-prerequisite"&&c.canDoId?<button type="button" disabled={status==="loading"} onClick={()=>{if(c.anchorCohort==="e02")onStartE02(c.anchorSceneId);else if(c.anchorCohort==="e03")onStartE03(c.anchorSceneId);else onStartE04(c.anchorSceneId);}}>Practise original source</button>:null}
          {!c.canDoId?<button type="button" disabled={status==="loading"} onClick={()=>onStartE06Preview(c.id)}>Read original case</button>:null}
          {c.prerequisiteReady?<><button type="button" disabled={status==="loading"} onClick={()=>onStartE06(c.id)}>{c.firstDraftSubmitted&&!c.revisedDraftSubmitted?"Continue second draft":c.nextDailyStage?"Continue: "+(c.dailyStages.find(s=>s.id===c.nextDailyStage)?.title??"short lesson"):"Read completion guidance"}</button>
          <button type="button" disabled={status==="loading"} onClick={()=>onStartE06Full(c.id)}>Review full original lesson</button>
          <button type="button" disabled={status==="loading"} onClick={()=>onStartE11Micro(c.id)}>Optional E11–E12 conversation + writing revision</button></>:null}
          {(c.status==="ready"||c.status==="reviewed")?<button type="button" disabled={status==="loading"} onClick={()=>onStartE06Delayed(c.id)}>{c.nextDelayedStage?"Next delayed group: "+(c.delayedStages.find(s=>s.id===c.nextDelayedStage)?.title??"review"):"Delayed set completed"}</button>:null}
          {(c.status==="ready"||c.status==="reviewed")&&c.delayedCorrect>0?<button type="button" disabled={status==="loading"} onClick={()=>onStartE06FullDelayed(c.id)}>Review all seven delayed questions</button>:null}
        </div>
      </li>)}</ol>
      <p>New-context comprehension uses the original Can-do's verified source identity; no new canonical identifiers were invented. Additional A2.1/A2.2 placement remains provisional, and open writing or speech transcripts are not semantic or acoustic proficiency scores.</p>
    </section>
    </details>
    <section className="j4-foundation" aria-labelledby="j4-foundation-title">
      <header>
        <span className="j4-vertical-label" aria-hidden="true" lang="ja">土台</span>
        <div>
          <p className="j4-kicker">FOUNDATION · 土台</p>
          <h2 id="j4-foundation-title">Before the road opens</h2>
          <p>Script and core vocabulary feed every later landmark instead of living in a separate app.</p>
        </div>
      </header>

      <div className="j4-foundation__tracks">
        <article>
          <span className="j4-foundation__glyph" aria-hidden="true">あ</span>
          <div>
            <small>Script</small>
            <h3>Kana + sound</h3>
            <p>{summary.learnedKana} of {summary.totalKana} introduced</p>
            <JInkProgress value={kanaCoverage} label="Kana introduction coverage"/>
          </div>
          <strong>{Math.round(kana.overall*100)}%</strong>
        </article>
        <article>
          <span className="j4-foundation__glyph" aria-hidden="true">語</span>
          <div>
            <small>Lexicon</small>
            <h3>Words + kanji in context</h3>
            <p>{summary.learnedVocabulary} of {summary.totalVocabulary} words introduced</p>
            <JInkProgress value={vocabCoverage} label="Vocabulary introduction coverage"/>
          </div>
          <strong>{Math.round(vocab.overall*100)}%</strong>
        </article>
      </div>
    </section>

    <section className="j4-scroll-section" aria-labelledby="j4-scroll-title">
      <div className="j4-scroll-heading">
        <div>
          <p className="j4-kicker">EMAKIMONO · 学びの絵巻</p>
          <h2 id="j4-scroll-title">The learning road</h2>
          <p>Scroll through the regions. The scenery changes; the prerequisite graph does not.</p>
        </div>
        <JSeal size="large" label="Learning path">学</JSeal>
      </div>

      <div className="j4-emaki" role="region" aria-label="A1 to C1 learning journey" tabIndex={0}>
        <div className="j4-emaki__sky" aria-hidden="true"/>
        <div className="j4-emaki__mountains" aria-hidden="true"/>
        <div className="j4-emaki__water" aria-hidden="true"/>
        <div className="j4-emaki__road" aria-hidden="true"/>

        <div className="j4-emaki__regions">
          {groups.map((group,index)=>{
            const meta=REGION_META[group.level]??{level:group.level,japanese:"学び",subtitle:"Course region",landscape:"plain"};
            const regionMastery=group.units.length?group.units.reduce((sum,item)=>sum+item.mastery,0)/group.units.length:0;
            const regionMastered=group.units.filter((unit)=>unit.status==="mastered").length;
            return <section className={"j4-region j4-region--"+meta.landscape} key={group.level} aria-labelledby={"j4-region-"+group.level}>
              <header className="j4-region__head">
                <span className="j4-region__number">{String(index+1).padStart(2,"0")}</span>
                <div>
                  <small lang="ja">{meta.japanese}</small>
                  <h3 id={"j4-region-"+group.level}>{group.level}</h3>
                  <p>{meta.subtitle}</p>
                </div>
                <div className="j4-region__progress">
                  <strong>{Math.round(regionMastery*100)}%</strong>
                  <span>{regionMastered}/{group.units.length} mastered</span>
                </div>
              </header>

              <div className="j4-region__terrain" aria-hidden="true">
                <span className="j4-terrain__hill j4-terrain__hill--a"/>
                <span className="j4-terrain__hill j4-terrain__hill--b"/>
                <span className="j4-terrain__tree j4-terrain__tree--a"/>
                <span className="j4-terrain__tree j4-terrain__tree--b"/>
              </div>

              <ol className="j4-landmarks">
                {group.units.map((unit,unitIndex)=><li
                  className={"j4-landmark "+unit.status+(current?.id===unit.id?" is-current":"")}
                  key={unit.id}
                >
                  <div className="j4-landmark__marker" aria-hidden="true">
                    <span>{unit.status==="mastered"?"済":unit.status==="learning"?"進":unit.status==="ready"?"開":"未"}</span>
                  </div>
                  <article>
                    <div className="j4-landmark__title">
                      <span>{String(unit.order).padStart(2,"0")}</span>
                      <h4>{unit.title}</h4>
                    </div>
                    <p>{unit.canDo}</p>
                    <div className="j4-landmark__meta">
                      <span>{Math.round(unit.mastery*100)}% mastery</span>
                      <span>{unit.evidenceCount} evidence</span>
                    </div>
                    <JInkProgress value={unit.mastery} label={unit.title+" mastery"}/>
                    <div className="j4-landmark__actions">
                      <button disabled={status==="loading"} onClick={()=>onStartUnit(unit.id)} type="button">
                        {unitActionLabel(unit)}
                      </button>
                      <button
                        className="secondary"
                        disabled={status==="loading"||!assessmentCanStart(unit)}
                        onClick={()=>onStartAssessment(unit.id)}
                        type="button"
                      >
                        {assessmentActionLabel(unit)}
                      </button>
                    </div>
                  </article>
                  {unitIndex<group.units.length-1?<span className="j4-landmark__trail" aria-hidden="true"/>:null}
                </li>)}
              </ol>

              <LevelGate
                level={group.level}
                milestone={milestone}
                b1={b1Milestone}
                b2={b2Milestone}
                c1={c1Foundation}
                disabled={status==="loading"}
                onA1={onStartMilestone}
                onB1={onStartB1Milestone}
                onB2={onStartB2Milestone}
                onC1={onStartC1Foundation}
              />
            </section>;
          })}
        </div>
      </div>
      <p className="j4-scroll-hint">Desktop/tablet: scroll sideways through the illustrated road. Mobile: the same journey becomes a vertical route.</p>
    </section>

    <section className="j4-practice" aria-labelledby="j4-practice-title">
      <header className="j4-practice__head">
        <div>
          <p className="j4-kicker">TRAINING GROUNDS · 稽古場</p>
          <h2 id="j4-practice-title">Practice beyond the road</h2>
          <p>The course path stays primary. Specialist practice remains available without turning Learn back into an endless dashboard.</p>
        </div>
        <span className="j4-practice__brush" aria-hidden="true"/>
      </header>

      <div className="j4-practice__quick">
        <button disabled={status==="loading"} onClick={onLexicalFluency} type="button">
          <span aria-hidden="true">語</span>
          <strong>Lexical fluency</strong>
          <small>{lexicalFluency.totalChunks} chunks · {Math.round(lexicalFluency.overall*100)}% mastery</small>
        </button>
        <button disabled={status==="loading"} onClick={()=>onProductive("writing")} type="button">
          <span aria-hidden="true">書</span>
          <strong>Writing</strong>
          <small>connected production</small>
        </button>
        <button disabled={status==="loading"} onClick={()=>onProductive("speaking")} type="button">
          <span aria-hidden="true">話</span>
          <strong>Speaking</strong>
          <small>connected production</small>
        </button>
        <button disabled={status==="loading"} onClick={onC1Practice} type="button">
          <span aria-hidden="true">深</span>
          <strong>C1 discourse</strong>
          <small>advanced control</small>
        </button>
      </div>

      <details className="j4-practice__drawer">
        <summary><span aria-hidden="true">補</span><strong>Adaptive remediation</strong><small>Open targeted recovery tools</small></summary>
        <div><AdaptiveRemediation onStartUnit={onStartUnit} onStartProduction={onProductive}/></div>
      </details>

      <details className="j4-practice__drawer">
        <summary><span aria-hidden="true">実</span><strong>Real-world performance</strong><small>Chains, qualification and transfer</small></summary>
        <div><RealWorldPerformancePanel onStartChain={onRealWorldChain} onStartQualification={onRealWorldQualification}/></div>
      </details>

      <details ref={coachDrawer} className="j4-practice__drawer">
        <summary><span aria-hidden="true">対</span><strong>AI coach</strong><small>Advisory practice only</small></summary>
        <div><AiCoach preferredChainId={preferredCoachChain} onPreferredChainApplied={onPreferredCoachChainApplied}/></div>
      </details>
    </section>

    <section className="j4-evidence" aria-label="Learning evidence overview">
      <Evidence value={kana.overall} glyph="仮" label="Kana"/>
      <Evidence value={vocab.overall} glyph="語" label="Vocabulary"/>
      <Evidence value={conjugation.overall} glyph="活" label="Conjugation"/>
      <Evidence value={grammar.overall} glyph="文" label="Grammar"/>
      <Evidence value={sentence.overall} glyph="句" label="Sentences"/>
      <Evidence value={lexicalFluency.overall} glyph="連" label="Chunks"/>
    </section>
    </div>
    </details>
  </section>;
}

function LevelGate({
  level,milestone,b1,b2,c1,disabled,onA1,onB1,onB2,onC1,
}:{
  level:string;
  milestone:A1MilestoneProgress;
  b1:B1MilestoneProgress;
  b2:B2MilestoneProgress;
  c1:C1FoundationProgress;
  disabled:boolean;
  onA1:()=>void;
  onB1:()=>void;
  onB2:()=>void;
  onC1:()=>void;
}){
  if(level==="A2")return <div className="j4-gate j4-gate--bridge"><span aria-hidden="true">橋</span><div><strong>A2 crossing</strong><small>Continue through the course path</small></div></div>;

  const config=level==="A1"
    ?{title:"A1 milestone",progress:milestone,onClick:onA1}
    :level==="B1"
      ?{title:"B1 milestone",progress:b1,onClick:onB1}
      :level==="B2"
        ?{title:"B2 milestone",progress:b2,onClick:onB2}
        :level==="C1"
          ?{title:"C1 foundation diagnostic",progress:c1,onClick:onC1}
          :null;
  if(!config)return null;

  const pct=config.progress.total?config.progress.answered/config.progress.total:0;
  return <div className={"j4-gate"+(config.progress.complete?" complete":"")}>
    <JSeal shape="square" label={config.title}>{config.progress.complete?"済":"門"}</JSeal>
    <div>
      <small>{level} GATE</small>
      <strong>{config.title}</strong>
      <span>{config.progress.answered} / {config.progress.total} activities</span>
      <JInkProgress value={pct} label={config.title+" completion"}/>
    </div>
    <button disabled={disabled} onClick={config.onClick} type="button">
      {config.progress.complete?"Retake":"Enter"}
    </button>
  </div>;
}

function Evidence({value,glyph,label}:{value:number;glyph:string;label:string}){
  return <div className="j4-evidence__item">
    <span aria-hidden="true">{glyph}</span>
    <div><strong>{Math.round(value*100)}%</strong><small>{label}</small></div>
  </div>;
}

function unitActionLabel(unit:CourseUnitProgress):string{
  if(unit.status==="mastered")return "Review landmark";
  if(unit.status==="learning")return "Continue landmark";
  if(unit.status==="challenging")return "Study anyway";
  return "Enter landmark";
}

function assessmentCanStart(unit:CourseUnitProgress):boolean{
  return ["ready","in_progress","passed","needs_review"].includes(unit.assessment.status);
}

function assessmentActionLabel(unit:CourseUnitProgress):string{
  const state=unit.assessment.status;
  if(state==="passed")return "Retake check";
  if(state==="needs_review")return "Retry check";
  if(state==="in_progress")return "Continue check";
  if(state==="ready")return "Delayed check";
  if(state==="waiting")return "Check waiting";
  return "Check locked";
}
