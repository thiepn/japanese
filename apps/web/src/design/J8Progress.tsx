import type {ReactNode} from "react";
import {B2Portfolio} from "../study/B2Portfolio";
import {C1Portfolio} from "../study/C1Portfolio";
import type {ImmersionProgress} from "../immerse/reader";
import type {
  E01Progress,
  E02Overview,
  E03Overview,
  E04Overview,
  E05Evidence,
  E06Overview,
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
import type {E07Journey,E07Action} from "../study/e07LearningRoute";
import {JCartouche,JInkProgress,JPattern,JSeal} from "./index";

type Props={
  e01:E01Progress;
  e02:E02Overview;
  e03:E03Overview;
  e04:E04Overview;
  e05:E05Evidence;onStartE05Repair:()=>void;
  e06:E06Overview;
  e07:E07Journey;onOpenE07:(action:E07Action)=>void;
  kana:KanaMasterySummary;
  vocab:VocabularyMasterySummary;
  conjugation:ConjugationMasterySummary;
  grammar:GrammarMasterySummary;
  sentence:SentenceMasterySummary;
  lexicalFluency:LexicalFluencySummary;
  milestone:A1MilestoneProgress;
  b1Milestone:B1MilestoneProgress;
  b2Milestone:B2MilestoneProgress;
  c1Foundation:C1FoundationProgress;
  immersion:ImmersionProgress;
  summary:StudySummary;
  course:CourseUnitProgress[];
  completedToday:number;
};

type Skill={
  id:string;
  glyph:string;
  japanese:string;
  label:string;
  value:number;
  confidence:number;
  evidence:number;
  details:{label:string;value:number}[];
};

export function J8Progress({
  e04,e03,e02,e01,e05,e06,e07,onOpenE07,onStartE05Repair,kana,vocab,conjugation,grammar,sentence,lexicalFluency,milestone,b1Milestone,b2Milestone,c1Foundation,immersion,summary,course,completedToday,
}:Props){
  const immersionReading=mean(immersion.texts.map((item)=>item.readingMastery));
  const immersionListening=mean(immersion.texts.map((item)=>item.listeningMastery));
  const immersionReadiness=mean(immersion.texts.map((item)=>item.readiness));
  const immersionOverall=mean([immersionReading,immersionListening]);

  const skills:Skill[]=[
    {
      id:"script",glyph:"仮",japanese:"文字",label:"Script + sound",value:kana.overall,confidence:kana.confidence,evidence:kana.evidenceCount,
      details:[
        {label:"Hiragana",value:kana.hiragana},
        {label:"Katakana",value:kana.katakana},
        {label:"Recognition",value:kana.recognition},
        {label:"Typed reading",value:kana.readingRecall},
        {label:"Mora listening",value:kana.listening},
      ],
    },
    {
      id:"words",glyph:"語",japanese:"語彙",label:"Vocabulary",value:vocab.overall,confidence:vocab.confidence,evidence:vocab.evidenceCount,
      details:[
        {label:"Meaning recognition",value:vocab.meaning},
        {label:"Reading recall",value:vocab.reading},
        {label:"Listening recognition",value:vocab.listening},
        {label:"Active use",value:vocab.activeUse},
      ],
    },
    {
      id:"forms",glyph:"活",japanese:"活用",label:"Generated forms",value:conjugation.overall,confidence:conjugation.confidence,evidence:conjugation.evidenceCount,
      details:[
        {label:"Polite negative",value:conjugation.politeNegative},
        {label:"Polite past",value:conjugation.politePast},
        {label:"Polite past negative",value:conjugation.politePastNegative},
        {label:"て-form",value:conjugation.teForm},
      ],
    },
    {
      id:"grammar",glyph:"文",japanese:"文法",label:"Grammar",value:grammar.overall,confidence:grammar.confidence,evidence:grammar.evidenceCount,
      details:[
        {label:"Function comprehension",value:grammar.comprehension},
        {label:"Contextual form selection",value:grammar.formSelection},
      ],
    },
    {
      id:"connected",glyph:"連",japanese:"つながり",label:"Connected language",value:mean([sentence.overall,lexicalFluency.overall]),confidence:mean([sentence.confidence,lexicalFluency.confidence]),evidence:sentence.evidenceCount+lexicalFluency.evidenceCount,
      details:[
        {label:"Sentence comprehension",value:sentence.comprehension},
        {label:"Sentence production",value:sentence.production},
        {label:"Lexical chunks",value:lexicalFluency.overall},
        {label:"Register transfer",value:lexicalFluency.registerTransfer},
      ],
    },
    {
      id:"immersion",glyph:"浸",japanese:"実読",label:"Immersion transfer",value:immersionOverall,confidence:immersionReadiness,evidence:immersion.readingChecks+immersion.listeningChecks,
      details:[
        {label:"Reading text mastery",value:immersionReading},
        {label:"Connected listening",value:immersionListening},
        {label:"Lexical readiness",value:immersionReadiness},
      ],
    },
  ];

  const landscapeMean=mean(skills.map((skill)=>skill.value));
  const stage=landscapeMean>=.72?4:landscapeMean>=.5?3:landscapeMean>=.3?2:landscapeMean>=.12?1:0;
  const masteredUnits=course.filter((unit)=>unit.status==="mastered").length;
  const passedChecks=course.filter((unit)=>unit.assessment.status==="passed").length;
  const currentUnit=course.find((unit)=>unit.status!=="mastered")??course.at(-1)??null;
  const gradedAnswers=kana.evidenceCount+vocab.evidenceCount+conjugation.evidenceCount+grammar.evidenceCount+sentence.evidenceCount+lexicalFluency.evidenceCount;

  return <section className="j8-progress" aria-labelledby="j8-progress-title">
    <span className="j13-marginal" aria-hidden="true">道</span>
    <header className="j8-hero">
      <JPattern name="seigaiha" className="j8-hero__pattern"/>
      <div className="j8-hero__copy">
        <JCartouche japanese="道" subtitle="Progress"/>
        <p className="j8-kicker">LONGITUDINAL EVIDENCE · 学びの道</p>
        <h1 id="j8-progress-title">The path you have actually built</h1>
        <p>Progress is evidence, not exposure. Reviews, delayed checks, connected reading and production stay distinct so recent familiarity cannot masquerade as durable mastery.</p>

        <div className="j8-hero__state">
          <div>
            <span>CURRENT REGION</span>
            <strong>{currentUnit?.level??"C1"}</strong>
            <small>{currentUnit?.title??"Course path reviewed"}</small>
          </div>
          <div>
            <span>COURSE LANDMARKS</span>
            <strong>{masteredUnits}<i>/</i>{course.length}</strong>
            <small>mastered</small>
          </div>
          <div>
            <span>DELAYED CHECKS</span>
            <strong>{passedChecks}</strong>
            <small>passed</small>
          </div>
        </div>
      </div>

      <div className={"j8-world j8-world--"+stage} aria-label={"Decorative progress landscape, stage "+stage+" of 4"}>
        <div className="j8-world__sun" aria-hidden="true"/>
        <div className="j8-world__mountain j8-world__mountain--far" aria-hidden="true"/>
        <div className="j8-world__mountain j8-world__mountain--near" aria-hidden="true"/>
        <div className="j8-world__river" aria-hidden="true"/>
        <div className="j8-world__bridge" aria-hidden="true"/>
        <div className="j8-world__trees" aria-hidden="true"><i/><i/><i/></div>
        <div className="j8-world__town" aria-hidden="true"><i/><i/><i/></div>
        <div className="j8-world__books" aria-hidden="true"><i/><i/></div>
        <div className="j8-world__seal" aria-hidden="true">道</div>
        <p><strong>{Math.round(landscapeMean*100)}%</strong><span>display mean across the six mastery views below</span></p>
      </div>
    </header>

    <E07JourneyPanel route={e07} onActivate={onOpenE07} busy={false} variant="progress"/>
    <details className="e07-track-list">
      <summary>Review detailed E01–E06 controlled, unscored and delayed evidence</summary>
    <section className="e01-progress" aria-label="A1 first conversations evidence">
      <strong>A1 · First conversations · controlled evidence only</strong>
      <p>{e01.canDo}. This is practice evidence, not a verified A1 proficiency decision. Independent writing and speech are explicitly unscored.</p>
      <dl><div><dt>Guided attempts</dt><dd>{e01.answered}</dd></div><div><dt>Correct controlled answers</dt><dd>{e01.correct}</dd></div><div><dt>Unscored drafts</dt><dd>{e01.unscored}</dd></div><div><dt>Delayed controlled answers</dt><dd>{e01.delayedCorrect} / 3</dd></div><div><dt>State</dt><dd>{e01.status.replaceAll("_"," ")}</dd></div></dl>
    </section>
    <section className="e02-course e02-course--progress" aria-labelledby="e02-progress-title">
      <header className="e02-course__head"><div><p className="j8-kicker">E02 · BEGINNER COMMUNICATION EVIDENCE</p><h2 id="e02-progress-title">What you have practised</h2><p>Controlled responses, independent unscored drafts and delayed checks are counted separately. These are not CEFR or acoustic scores.</p></div><strong>{e02.started}/{e02.total} scenes started</strong></header>
      <div className="e02-evidence"><span>{e02.readyForDelay} delayed checks ready</span><span>{e02.delayedReviewed} delayed checks complete</span></div>
      <ol className="e02-progress-list">{e02.scenes.map(item=><li key={item.id}><strong>{item.title}</strong><span>{item.completedControlled}/{item.requiredControlled} controlled correct</span><span>{item.unscoredDrafts} unscored drafts</span><span>{item.delayedCorrect}/{item.delayedTotal} delayed correct</span></li>)}</ol>
    </section>
    <section className="e03-path e03-path--progress" aria-labelledby="e03-progress-title">
      <header className="e03-path__heading"><div><p className="j8-kicker">E03 · ORIGINAL A2.1 EVIDENCE</p><h2 id="e03-progress-title">Connected communication practice</h2><p>Original controlled answers are distinct from structural-only drafts and new-context delayed evidence. Neither is externally validated CEFR proficiency.</p></div><strong>{e03.started}/{e03.total} scenes started</strong></header>
      <div className="e03-progress-metrics"><span>{e03.readyForDelay} transfer reviews ready</span><span>{e03.delayedReviewed} transfer reviews complete</span><span>{e03.unmapped.length} awaiting canonical association</span></div>
      <ol className="e03-progress-list">{e03.scenes.map(scene=><li key={scene.id}><strong>{scene.title}</strong><span>{scene.correct}/{scene.required} controlled correct</span><span>{scene.unscoredDrafts} unscored drafts</span><span>{scene.delayedCorrect}/{scene.delayedTotal} delayed correct</span></li>)}</ol>
    </section>
    <section className="e04-path e04-path--progress" aria-labelledby="e04-progress-title">
      <header className="e04-path__heading"><div><p className="j8-kicker">E04 · SOURCE-OWNED A2 COMMUNICATION EVIDENCE</p><h2 id="e04-progress-title">Real practice, not a fluency percentage</h2><p>Distinct counts for guided controlled answers, independent unscored drafts and delayed changed-context responses. No validated A2.2 or spoken acoustic certification is implied.</p></div><strong>{e04.started}/{e04.linked} linked scenarios started</strong></header>
      <div className="e04-evidence"><span>{e04.reviewReady} delayed checks ready</span><span>{e04.reviewed} transfer checks complete</span><span>{e04.unmapped.length} source-only readings awaiting a Can-do association</span></div>
      <ol className="e04-progress-list">{e04.scenes.map(scene=><li key={scene.id}><strong>{scene.title}</strong><span>{scene.guidedCorrect}/{scene.guidedTotal} guided correct</span><span>{scene.unscoredDrafts} unscored drafts</span><span>{scene.delayedCorrect}/{scene.delayedTotal} delayed correct</span></li>)}</ol>
    </section>
    <section className="e05-panel e05-panel--progress" aria-labelledby="e05-progress-title">
      <header><div><p className="j8-kicker">E05 · SOURCE-OWNED LEARNER EVIDENCE</p><h2 id="e05-progress-title">Listening, reading, response and original production</h2><p>Counts derive from canonical Can-do-linked StudyEvents. They do not represent a CEFR score or actual pronunciation mastery.</p></div><strong>{e05.controlled.distinctCorrect} distinct correct controlled cues</strong></header>
      <div className="e05-stats">
        <div><strong>{e05.controlled.listening}</strong><span>Correct listening responses</span></div>
        <div><strong>{e05.controlled.reading}</strong><span>Correct reading/comprehension</span></div>
        <div><strong>{e05.controlled.formSelection}</strong><span>Correct context/form selections</span></div>
        <div><strong>{e05.controlled.typedProduction}</strong><span>Correct bounded typed responses</span></div>
        <div><strong>{e05.unscored.writing}</strong><span>Unscored personal writing drafts</span></div>
        <div><strong>{e05.unscored.speech}</strong><span>Unscored browser speech transcripts</span></div>
        <div><strong>{e05.delayed.correct}/{e05.delayed.attempts}</strong><span>Correct / attempted delayed transfer</span></div>
        <div><strong>{e05.repair.pending}</strong><span>Specific corrections awaiting practice</span></div>
      </div>
      {e05.repair.pending>0?<button type="button" onClick={onStartE05Repair}>Repair with different questions</button>:null}
      <p>Listening and reading counts represent controlled responses, while independent production records drafts without semantic or acoustic scores. One new-context correction never grants mastery.</p>
    </section>
    <section className="e06-course e06-course--progress" aria-labelledby="e06-progress-title">
      <header className="e06-course__header"><div><p className="j8-kicker">E06 · ORIGINAL CUMULATIVE EVIDENCE</p><h2 id="e06-progress-title">Independent communication practice</h2><p>Account-scoped original StudyEvents: six independent bounded prompts, five changed-context delayed tasks and two explicitly separate unscored writing drafts. No second learner-state or grading authority.</p></div><strong>{e06.reviewed} delayed sets complete</strong></header>
      <div className="e06-course__metrics"><span>{e06.linked}/{e06.total} linked</span><span>{e06.prerequisiteReady} prerequisites satisfied</span><span>{e06.active} learning</span><span>{e06.waiting} waiting</span><span>{e06.ready} delayed due</span><span>{e06.unlinked} ungraded previews</span></div>
      <ol className="e06-course__progress">{e06.cases.map(c=><li key={c.id}><strong>{c.title}</strong><span>{c.correct}/{c.required} controlled · {c.contextProblemsCorrect}/2 different-context correct</span><span>{c.firstDraftSubmitted?"Draft 1 ✓":"Draft 1 —"} · {c.revisedDraftSubmitted?"Draft 2 ✓":"Draft 2 —"} · {c.unscoredSpeaking} speech transcripts</span><span>{c.delayedCorrect}/{c.delayedRequired} delayed correct</span></li>)}</ol>
      <p>A submitted revision means a second text exists; it does not mean the grammar, pragmatics or communication succeeded. Controlled recognition, timed listening, independent typed recall and delayed transfer remain separate evidence categories, not CEFR certification.</p>
    </section>
    </details>
    <section className="j8-skills" aria-labelledby="j8-skills-title">
      <header className="j8-section-head">
        <div>
          <p className="j8-kicker">SKILL CRESTS · 六つの力</p>
          <h2 id="j8-skills-title">Six views of durable ability</h2>
          <p>Each crest is backed by the existing mastery projection. Open one for the numerical dimensions underneath it.</p>
        </div>
        <JSeal label="Skill crests">力</JSeal>
      </header>

      <div className="j8-crests">
        {skills.map((skill)=><details className={"j8-crest j8-crest--"+skill.id} key={skill.id}>
          <summary>
            <span className="j8-crest__disc" aria-hidden="true">
              <i style={{transform:"rotate("+Math.round(skill.value*260-130)+"deg)"}}/>
              <strong>{skill.glyph}</strong>
            </span>
            <span className="j8-crest__copy">
              <small lang="ja">{skill.japanese}</small>
              <strong>{skill.label}</strong>
              <em>{Math.round(skill.value*100)}%</em>
            </span>
            <span className="j8-crest__evidence">{skill.evidence}<small>evidence</small></span>
          </summary>
          <div className="j8-crest__details">
            {skill.details.map((item)=><EvidenceBar key={item.label} label={item.label} value={item.value}/>)}
            <EvidenceBar label={skill.id==="immersion"?"Lexical readiness":"Model confidence"} value={skill.confidence}/>
          </div>
        </details>)}
      </div>
    </section>

    <section className="j8-milestones" aria-labelledby="j8-milestones-title">
      <header className="j8-section-head">
        <div>
          <p className="j8-kicker">MILESTONE SEALS · 関所</p>
          <h2 id="j8-milestones-title">Checkpoints on the road</h2>
          <p>These are the existing assessment records. A seal becomes complete only when its underlying milestone is complete.</p>
        </div>
      </header>

      <div className="j8-milestone-road">
        <MilestoneSeal label="A1 ASSESSMENT" japanese="初" progress={milestone} note="Language activities"/>
        <span className="j8-milestone-road__path" aria-hidden="true"/>
        <MilestoneSeal label="B1 ASSESSMENT" japanese="続" progress={b1Milestone} note="Independent language activities"/>
        <span className="j8-milestone-road__path" aria-hidden="true"/>
        <MilestoneSeal label="B2 ASSESSMENT" japanese="広" progress={b2Milestone} note="Independent communication"/>
        <span className="j8-milestone-road__path" aria-hidden="true"/>
        <MilestoneSeal label="C1 FOUNDATION" japanese="深" progress={c1Foundation} note="Advanced discourse diagnostic"/>
      </div>
    </section>

    <section className="j8-ledger" aria-labelledby="j8-ledger-title">
      <header>
        <p className="j8-kicker">EVIDENCE LEDGER · 記録</p>
        <h2 id="j8-ledger-title">What exists behind the picture</h2>
      </header>
      <div className="j8-ledger__rows">
        <Ledger value={gradedAnswers} label="Graded answers" glyph="答"/>
        <Ledger value={summary.memoryTraces} label="Memory traces" glyph="記"/>
        <Ledger value={summary.due} label="Due now" glyph="復"/>
        <Ledger value={immersion.texts.length} label="Connected texts" glyph="読"/>
        <Ledger value={immersion.minedWords} label="Mined words" glyph="採"/>
        <Ledger value={completedToday} label="Answers today" glyph="今"/>
      </div>
      <p>{immersion.lookups} reader lookups · {immersion.readingChecks} reading checks · {immersion.listeningChecks} listening checks</p>
    </section>

    <section className="j8-evidence-vaults" aria-labelledby="j8-vault-title">
      <header className="j8-section-head">
        <div>
          <p className="j8-kicker">EVIDENCE ARCHIVE · 証拠</p>
          <h2 id="j8-vault-title">Open the underlying portfolios</h2>
          <p>The landscape stays readable by default. Detailed B2/C1 longitudinal evidence remains available here without being mistaken for a single certification score.</p>
        </div>
        <JSeal label="Evidence archive">証</JSeal>
      </header>

      <PortfolioVault glyph="二" title="B2 longitudinal portfolio" subtitle="Repeated production, transfer and delayed revision" testId="j8-b2-vault">
        <B2Portfolio/>
      </PortfolioVault>
      <PortfolioVault glyph="一" title="C1→C2 advanced evidence" subtitle="Advanced longitudinal evidence, human review and internal qualification" testId="j8-c1-vault">
        <C1Portfolio/>
      </PortfolioVault>
    </section>

    <p className="j8-boundary">The landscape and crest arrangement are visual summaries only. Existing mastery projections, milestone records, StudyEvents and portfolio evidence remain the authoritative data.</p>
  </section>;
}

function EvidenceBar({label,value}:{label:string;value:number}){
  const pct=Math.round(value*100);
  return <div className="j8-evidence-bar">
    <div><span>{label}</span><strong>{pct}%</strong></div>
    <div className="j8-evidence-bar__track" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}><span style={{width:pct+"%"}}/></div>
  </div>;
}

function MilestoneSeal({
  label,japanese,progress,note,
}:{
  label:string;
  japanese:string;
  progress:A1MilestoneProgress|B1MilestoneProgress|B2MilestoneProgress|C1FoundationProgress;
  note:string;
}){
  const score=mean(Object.values(progress.scores).map((item)=>item.score));
  return <article className={"j8-milestone"+(progress.complete?" complete":"")}>
    <div className="j8-milestone__seal" aria-hidden="true">{progress.complete?"済":japanese}</div>
    <div>
      <small>{label}</small>
      <strong>{progress.answered} / {progress.total}</strong>
      <span>{note}</span>
      <JInkProgress value={progress.total?progress.answered/progress.total:0} label={label+" completion"}/>
      <em>{progress.answered?Math.round(score*100)+"% activity mean":"No scored activity yet"}</em>
    </div>
  </article>;
}

function Ledger({value,label,glyph}:{value:number;label:string;glyph:string}){
  return <div className="j8-ledger__item">
    <span aria-hidden="true">{glyph}</span>
    <div><strong>{value}</strong><small>{label}</small></div>
  </div>;
}

function PortfolioVault({glyph,title,subtitle,testId,children}:{glyph:string;title:string;subtitle:string;testId:string;children:ReactNode}){
  return <details className="j8-vault" data-testid={testId}>
    <summary>
      <span className="j8-vault__glyph" aria-hidden="true">{glyph}</span>
      <span><strong>{title}</strong><small>{subtitle}</small></span>
      <i aria-hidden="true">＋</i>
    </summary>
    <div className="j8-vault__body">{children}</div>
  </details>;
}

function mean(values:number[]):number{
  const valid=values.filter((value)=>Number.isFinite(value));
  return valid.length?valid.reduce((sum,value)=>sum+value,0)/valid.length:0;
}
