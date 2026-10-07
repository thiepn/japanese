import {useMemo} from "react";
import {AdaptiveRemediation} from "../study/AdaptiveRemediation";
import {AiCoach} from "../ai/AiCoach";
import {RealWorldPerformancePanel} from "../study/RealWorldPerformancePanel";
import type {
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
import {JCartouche,JInkProgress,JPattern,JSeal} from "./index";

type Props={
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
  onStartUnit:(id:string)=>void;
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
    summary,kana,vocab,conjugation,grammar,sentence,lexicalFluency,course,
    milestone,b1Milestone,b2Milestone,c1Foundation,preferredCoachChain,
    onPreferredCoachChainApplied,status,onStart,onStartUnit,onStartAssessment,
    onStartMilestone,onStartB1Milestone,onStartB2Milestone,onStartC1Foundation,
    onC1Practice,onProductive,onLexicalFluency,onRealWorldChain,onRealWorldQualification,
  }=props;

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

  return <section className="j4-learn" aria-labelledby="j4-title">
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

      <details className="j4-practice__drawer">
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
