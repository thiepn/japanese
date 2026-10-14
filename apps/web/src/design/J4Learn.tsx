import {useMemo} from "react";
import {AdaptiveRemediation} from "../study/AdaptiveRemediation";
import {AiCoach} from "../ai/AiCoach";
import {RealWorldPerformancePanel} from "../study/RealWorldPerformancePanel";
import type {
  E01Progress,
  E02Overview,
  E03Overview,
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
  e01:E01Progress;onStartE01:()=>void;onStartE01Delayed:()=>void;
  e02:E02Overview;onStartE02:(id:string)=>void;onStartE02Delayed:(id:string)=>void;
  e03:E03Overview;onStartE03:(id:string)=>void;onStartE03Delayed:(id:string)=>void;
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
    e01,onStartE01,onStartE01Delayed,e02,onStartE02,onStartE02Delayed,e03,onStartE03,onStartE03Delayed,summary,kana,vocab,conjugation,grammar,sentence,lexicalFluency,course,
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
    <span className="j13-marginal" aria-hidden="true">学</span>
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
      {e02.total===0?<p role="status">No E02 scenes are mapped to the current canonical A1 course.</p>:null}
    </section>
    <section className="e03-path" aria-labelledby="e03-path-title">
      <header className="e03-path__heading"><div><p className="j4-kicker">E03 · ORIGINAL A2.1 COMMUNICATION</p><h2 id="e03-path-title">Use Japanese across connected situations</h2><p>{e03.authored} original scenes authored · {e03.total} linked to an existing A2 Can-do. A2.1 placement is provisional and does not certify a CEFR level.</p></div><strong>{e03.delayedReviewed}/{e03.total} delayed transfer checks</strong></header>
      {e03.unmapped.length>0?<details className="e03-path__scope"><summary>{e03.unmapped.length} original situations awaiting a verified A2 Can-do association</summary><p>{e03.unmapped.join(" · ")}. No learning or mastery events are fabricated for unlinked content.</p></details>:null}
      <ol className="e03-path__list">{e03.scenes.map((scene,index)=><li key={scene.id} className="e03-path__item">
        <span className="e03-path__number">{String(index+1).padStart(2,"0")}</span>
        <div className="e03-path__copy"><h3>{scene.title}</h3><p>{scene.setting}</p><small>{scene.canDo} · {scene.unitId}</small><small>{scene.correct}/{scene.required} distinct controlled answers correct · {scene.unscoredDrafts} unscored drafts · {scene.state.replaceAll("_"," ")}</small>
          {scene.state==="waiting"&&scene.reviewAvailableAt?<small>Delayed transfer opens {new Date(scene.reviewAvailableAt).toLocaleString()}</small>:null}</div>
        <div className="e03-path__actions"><button type="button" disabled={status==="loading"} onClick={()=>onStartE03(scene.id)}>{scene.state==="not_started"?"Start situation":"Practise situation"}</button>
          {(scene.state==="ready"||scene.state==="reviewed")?<button type="button" className="secondary" disabled={status==="loading"} onClick={()=>onStartE03Delayed(scene.id)}>Delayed transfer</button>:null}</div>
      </li>)}</ol>
      {e03.total===0?<p role="status">The A2.1 material has no safely verified Can-do links in the current canonical course. No invented progress is offered.</p>:null}
    </section>
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
