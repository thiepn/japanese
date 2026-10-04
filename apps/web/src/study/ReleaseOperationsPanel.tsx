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
      <div><span className="course-kicker">P11.2 RELEASE EVIDENCE</span><h2>Qualify B2 before opening C1</h2></div>
      <span className="course-count">P9 media provenance + external evidence remain authoritative</span>
    </div>
    <p>P11.2 adds repository-owned provenance verification for the P9 native-media gate. Local curation remains preparatory; the official release-candidate decision is still produced in repository CI from provenance-audited P9 evidence, admitted external validation, the release profile and the full regression suite.</p>

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
      <p>Human scores remain descriptive. External review can support P11 release qualification, but neither local nor external reviewer judgment silently becomes learner mastery or an accredited CEFR result.</p>
    </div>
    <p className="course-note">The repository-native media gate is now handled by the P11.2 provenance audit. To advance the release candidate, admit a real external review through the P11.1 intake workflow, then run <code>pnpm qualify:p11:strict</code>. C1 remains closed until that decision is fully green.</p>
  </section>;
}
