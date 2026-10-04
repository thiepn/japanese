import { useEffect,useMemo,useState } from "react";
import { coreContent } from "../coreContent";
import { buildNativeCurationSummary,listNativeCurationCandidates,type NativeCurationSummary } from "../immerse/nativeCuration";
import { getHumanReviewSummary,type HumanReviewSummary } from "./humanReview";
import { realWorldChains } from "./realWorldPerformance";
import { P9_RELEASE_THRESHOLDS } from "./releaseQualification";

export function ReleaseOperationsPanel(){
  const [curation,setCuration]=useState<NativeCurationSummary|null>(null);
  const [human,setHuman]=useState<HumanReviewSummary|null>(null);

  useEffect(()=>{
    void Promise.all([listNativeCurationCandidates(),getHumanReviewSummary()]).then(([candidates,reviews])=>{
      setCuration(buildNativeCurationSummary(candidates));setHuman(reviews);
    }).catch(()=>{setCuration(null);setHuman(null);});
  },[]);

  const staticChecks=useMemo(()=>[
    ["B2 texts",coreContent.readingTexts.filter((text)=>text.level==="B2").length,P9_RELEASE_THRESHOLDS.b2Texts],
    ["B2 productive tasks",coreContent.productiveTasks.filter((task)=>task.level==="B2").length,P9_RELEASE_THRESHOLDS.b2ProductiveTasks],
    ["Lexical chunks",coreContent.lexicalChunks.length,P9_RELEASE_THRESHOLDS.lexicalChunks],
    ["Real-world chains",realWorldChains.length,P9_RELEASE_THRESHOLDS.realWorldChains],
    ["Performance prompts",realWorldChains.reduce((sum,chain)=>sum+chain.stages.length,0),P9_RELEASE_THRESHOLDS.realWorldPrompts]
  ] as const,[]);

  const mediaChecks=curation?[
    ["Verified documents",curation.promotableDocuments,P9_RELEASE_THRESHOLDS.nativeSourceDocuments],
    ["Verified recordings",curation.promotableRecordings,P9_RELEASE_THRESHOLDS.nativeRecordings],
    ["Verified speakers",curation.speakers,P9_RELEASE_THRESHOLDS.nativeSpeakers],
    ["Verified registers",curation.registers.length,P9_RELEASE_THRESHOLDS.nativeRegisters]
  ] as const:[];

  return <section className="release-operations">
    <div className="section-heading">
      <div><span className="course-kicker">P10 RELEASE OPERATIONS</span><h2>Turn source-dependent blockers into auditable work</h2></div>
      <span className="course-count">P9 gate remains authoritative</span>
    </div>
    <p>P10 does not weaken the P9 release gate. It adds the operational path needed to satisfy it: human-verified media curation, reviewable production evidence and export/promotion tooling. The official release result still comes from repository CI and the checked-in native inventory.</p>

    <div className="release-check-columns">
      <article>
        <span className="course-kicker">STATIC PRODUCT GATES</span>
        <h3>Implemented in the repository</h3>
        <div className="release-check-list">{staticChecks.map(([label,actual,required])=><div className={actual>=required?"pass":"blocked"} key={label}><span>{actual>=required?"✓":"○"}</span><strong>{label}</strong><small>{actual} / {required}</small></div>)}</div>
      </article>
      <article>
        <span className="course-kicker">LOCAL VERIFIED MEDIA</span>
        <h3>Curation readiness</h3>
        {curation?<div className="release-check-list">{mediaChecks.map(([label,actual,required])=><div className={actual>=required?"pass":"blocked"} key={label}><span>{actual>=required?"✓":"○"}</span><strong>{label}</strong><small>{actual} / {required}</small></div>)}
          <div className={curation.speechRates.includes("natural")?"pass":"blocked"}><span>{curation.speechRates.includes("natural")?"✓":"○"}</span><strong>Natural-rate source</strong><small>{curation.speechRates.join(", ")||"none"}</small></div>
          <div className={curation.speechRates.includes("fast")?"pass":"blocked"}><span>{curation.speechRates.includes("fast")?"✓":"○"}</span><strong>Fast/stretch source</strong><small>{curation.speechRates.join(", ")||"none"}</small></div>
        </div>:<small>Local media curation data unavailable.</small>}
      </article>
    </div>

    <div className="release-human-note">
      <strong>Human production review</strong>
      <span>{human?human.reviewedArtifacts:0} artifacts reviewed · {human?human.unreviewedArtifacts:0} awaiting review</span>
      <p>Human scores remain descriptive. They improve release-quality evidence and external reviewability without silently converting reviewer judgment into learner mastery.</p>
    </div>
    <p className="course-note">To move verified recordings into the repository gate: export candidates from Immerse, place the reviewed manifest into the repository candidate queue, preview with <code>pnpm native:p10:preview</code>, review the diff, then apply with <code>pnpm native:p10:apply</code> and let CI recertify P9.</p>
  </section>;
}
