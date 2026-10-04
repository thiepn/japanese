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
      <div><span className="course-kicker">P11 RELEASE CANDIDATE</span><h2>Qualify B2 before opening C1</h2></div>
      <span className="course-count">P9 + external evidence remain authoritative</span>
    </div>
    <p>P11 does not turn local readiness into a release verdict. Local human review and native-media curation remain preparatory evidence; the official release-candidate decision is produced in repository CI from P9 qualification, admitted external validation, provider release evidence and the full regression suite.</p>

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
    <p className="course-note">To advance the release candidate: promote verified native media through P10, admit external review and provider evidence into the P11 manifests, then run the strict <code>pnpm qualify:p11:strict</code> workflow. C1 remains closed until that decision is fully green.</p>
  </section>;
}
