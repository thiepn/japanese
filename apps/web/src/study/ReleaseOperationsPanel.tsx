import { useEffect,useMemo,useState } from "react";
import { coreContent } from "../coreContent";
import { buildNativeCurationSummary,listNativeCurationCandidates,type NativeCurationSummary } from "../immerse/nativeCuration";
import { getExternalReviewReadiness,getHumanReviewSummary,listHumanReviewArtifacts,type ExternalReviewReadiness,type HumanReviewSummary } from "./humanReview";
import { realWorldChains } from "./realWorldPerformance";
import { P9_RELEASE_THRESHOLDS } from "./releaseQualification";
import { languagePlatformCompatibility } from "../platformCompatibility";

export function ReleaseOperationsPanel(){
  const [curation,setCuration]=useState<NativeCurationSummary|null>(null);
  const [human,setHuman]=useState<HumanReviewSummary|null>(null);
  const [external,setExternal]=useState<ExternalReviewReadiness|null>(null);

  useEffect(()=>{
    void Promise.all([listNativeCurationCandidates(),getHumanReviewSummary(),listHumanReviewArtifacts()]).then(([candidates,reviews,artifacts])=>{
      setCuration(buildNativeCurationSummary(candidates));setHuman(reviews);setExternal(getExternalReviewReadiness(artifacts));
    }).catch(()=>{setCuration(null);setHuman(null);setExternal(null);});
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
      <div><span className="course-kicker">P11 / P21 RELEASE EVIDENCE</span><h2>Keep external validation and final device acceptance explicit</h2></div>
      <span className="course-count">P9 media provenance + external evidence remain authoritative</span>
    </div>
    <p>P11 remains the independent productive-language release-evidence track. P21 adds the final technical/device gate but does not replace P11: automated regression, physical-device acceptance and external validation remain separate evidence classes.</p>

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

    <div className="release-human-note pass">
      <strong>THIEPN Languages platform</strong>
      <span>Read-only · {languagePlatformCompatibility.platformContractVersion} · package {languagePlatformCompatibility.platformPackageVersion}</span>
      <p>Japanese remains authoritative for content, learner state, StudyEvents, FSRS memory, mastery, proficiency, orchestration and sync. This P7 integration only reads the shared compatibility contract and is pinned to audited source baseline <code>{languagePlatformCompatibility.consumerRevision.slice(0,8)}</code>.</p>
    </div>
    <div className="release-human-note">
      <strong>Human production review</strong>
      <span>{human?human.reviewedArtifacts:0} locally reviewed · {human?human.unreviewedArtifacts:0} awaiting local review</span>
      <p>Human scores remain descriptive. External review can support P11 release qualification, but neither local nor external reviewer judgment silently becomes learner mastery or an accredited CEFR result.</p>
    </div>
    <div className={"release-human-note "+(external?.ready?"pass":"blocked")}>
      <strong>P11 external-review handoff</strong>
      <span>{external?external.selectedArtifacts:0} / 6 packet artifacts · {external?external.selectedWriting:0} writing · {external?external.selectedSpeaking:0} speaking</span>
      <p>{external?.ready?"Representative learner evidence is ready for the offline external-review workspace.":"Complete enough B2 productive work to produce a six-artifact packet containing both writing and speaking evidence."}</p>
    </div>
    <div className="release-human-note">
      <strong>P21 physical-device gate</strong>
      <span>Repository/CI evidence only · never inferred from this browser session</span>
      <p>The final release candidate requires a real Android standalone-PWA pass bound to the exact tested commit. Playwright Pixel/compact profiles remain automated regression evidence and cannot satisfy the physical-device gate.</p>
    </div>
    <p className="course-note">P11 remains <code>HOLD_B2_RELEASE_CANDIDATE</code> until a real external review is admitted. P12 curriculum development is intentionally decoupled from that release-evidence gate by project-owner decision; the evidence record itself remains unchanged and can still be completed later.</p>
  </section>;
}
