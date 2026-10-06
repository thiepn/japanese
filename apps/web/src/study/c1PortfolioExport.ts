import { getC1NativeDepthProgress,type C1NativeDepthProgress } from "./c1NativeDepth";
import { getC1PortfolioSummary,type C1PortfolioSummary } from "./c1Reliability";
import { getC1EnvironmentProgress,type C1EnvironmentProgress } from "./c1Environment";
import { getC1ResearchQualityProgress,type C1ResearchQualityProgress } from "./c1ResearchQuality";
import { getC1PrecisionProgress,type C1PrecisionProgress } from "./c1Precision";
import { getC1AdvancedInteractionProgress,type C1AdvancedInteractionProgress } from "./c1AdvancedInteraction";

export interface C1PortfolioExport {
  schema:"thiepn-japanese-c1-portfolio";
  schemaVersion:5;
  generatedAt:string;
  phase:"P18";
  evidenceBoundary:{
    accreditedCefrVerdict:false;
    aiFeedbackChangesMastery:false;
    structuralChecksAreSemanticScores:false;
    speechRecognitionIsAcousticScoring:false;
    nativePlaybackIsComprehensionMastery:false;
    crossSessionReliabilityIsExternalCertification:false;
    externalSourceEvaluationIsIndependentVerification:false;
    typedDefenseIsAcousticScoring:false;
    bibliographyFormattingIsSourceVerification:false;
    privateExcerptIsRedistributable:false;
    humanReviewIsAccreditedCefrCertification:false;
    humanReviewChangesMastery:false;
    precisionTransformationIsSemanticScore:false;
    specialistDiscourseStructureIsSubjectExpertise:false;
    sourceRefreshIsIndependentFactVerification:false;
    reviewRepairChangesMastery:false;
    simulatedPressureIsNativeSpeakerInteraction:false;
    responseTimingIsFluencyScore:false;
    partnerProfileIsVerified:false;
    humanInteractionChangesMastery:false;
    crossDomainTransferIsSubjectExpertise:false;
  };
  portfolio:C1PortfolioSummary;
  nativeDepth:C1NativeDepthProgress;
  environment:C1EnvironmentProgress;
  researchQuality:C1ResearchQualityProgress;
  precision:C1PrecisionProgress;
  advancedInteraction:C1AdvancedInteractionProgress;
}

export async function getC1PortfolioExport(now=new Date()):Promise<C1PortfolioExport>{
  const [portfolio,nativeDepth,environment,researchQuality,precision,advancedInteraction]=await Promise.all([getC1PortfolioSummary(),getC1NativeDepthProgress(),getC1EnvironmentProgress(),getC1ResearchQualityProgress(),getC1PrecisionProgress(),getC1AdvancedInteractionProgress()]);
  return {
    schema:"thiepn-japanese-c1-portfolio",schemaVersion:5,generatedAt:now.toISOString(),phase:"P18",
    evidenceBoundary:{
      accreditedCefrVerdict:false,
      aiFeedbackChangesMastery:false,
      structuralChecksAreSemanticScores:false,
      speechRecognitionIsAcousticScoring:false,
      nativePlaybackIsComprehensionMastery:false,
      crossSessionReliabilityIsExternalCertification:false,
      externalSourceEvaluationIsIndependentVerification:false,
      typedDefenseIsAcousticScoring:false,
      bibliographyFormattingIsSourceVerification:false,
      privateExcerptIsRedistributable:false,
      humanReviewIsAccreditedCefrCertification:false,
      humanReviewChangesMastery:false,
      precisionTransformationIsSemanticScore:false,
      specialistDiscourseStructureIsSubjectExpertise:false,
      sourceRefreshIsIndependentFactVerification:false,
      reviewRepairChangesMastery:false,
      simulatedPressureIsNativeSpeakerInteraction:false,
      responseTimingIsFluencyScore:false,
      partnerProfileIsVerified:false,
      humanInteractionChangesMastery:false,
      crossDomainTransferIsSubjectExpertise:false
    },
    portfolio,nativeDepth,environment,researchQuality,precision,advancedInteraction
  };
}

export function serializeC1PortfolioJson(value:C1PortfolioExport):string{
  return JSON.stringify(value,null,2);
}

export function serializeC1PortfolioMarkdown(value:C1PortfolioExport):string{
  const p=value.portfolio,r=p.reliability,n=value.nativeDepth,e=value.environment,q=value.researchQuality,x=value.precision,i=value.advancedInteraction;
  const lines=[
    "# THIEPN Japanese — C1 Portfolio Export",
    "",
    "Generated: "+value.generatedAt,
    "Phase: "+value.phase,
    "",
    "## Evidence boundary",
    "",
    "- Descriptive learner evidence only; this is not an accredited CEFR result.",
    "- AI feedback is advisory and does not alter mastery automatically.",
    "- Structural completion is not complete semantic-quality grading.",
    "- Browser speech recognition is transcript evidence, not acoustic pronunciation scoring.",
    "- Native-source playback documents exposure; it does not by itself prove comprehension.",
    "- Cross-session reliability describes repeated internal evidence; it is not external certification.",
    "- Learner source evaluation is a critical-reading record, not independent verification of the source.",
    "- Typed defense is a speaking-task proxy; speech-recognition transcripts are not acoustic scoring.",
    "- Bibliography formatting improves traceability; it is not independent verification of source interpretation.",
    "- Private-reference excerpts are not redistributable unless explicit license evidence is recorded.",
    "- Human review is external qualitative evidence; it is not accredited CEFR certification and does not update mastery automatically.",
    "- Precision transformations are structural/reflective evidence, not automatic semantic-quality scores.",
    "- Specialist discourse stage completion does not prove subject-matter expertise or C2 certification.",
    "- Fresh-source refresh records learner comparison; it is not independent fact verification.",
    "- Human-review repair records response to feedback but does not change mastery automatically.",
    "- Simulated native-style pressure is not verified native-speaker interaction.",
    "- Response latency is descriptive timing, not a fluency score.",
    "- Logged human-partner profile is learner-reported and not independently verified.",
    "- Human interaction logs and cross-domain transfer do not update mastery or establish subject expertise.",
    "",
    "## C1 longitudinal evidence",
    "",
    "- Active C1 days: "+p.activeDays,
    "- C1 texts read: "+p.readingTexts,
    "- C1 texts heard: "+p.listeningTexts,
    "- C1 speaking tasks: "+p.speakingTasks,
    "- C1 writing tasks: "+p.writingTasks,
    "- Multi-source synthesis packs attempted: "+p.synthesisPacks,
    "- Native-source syntheses: "+p.nativeSourceSyntheses,
    "- Spontaneous coach turns: "+p.spontaneousCoachTurns,
    "- Long-form autonomy missions complete: "+p.autonomyMissionsCompleted+" / "+p.autonomyMissions.length,
    "",
    "## Domain specialization",
    "",
    ...p.domains.map((domain)=>"- "+domain.title+": "+domain.status+" · "+domain.completedStages+"/"+domain.totalStages+" stages · "+domain.activeDays+" active days"),
    "",
    "## Cross-session productive reliability",
    "",
    "- Graded attempts: "+r.gradedAttempts,
    "- Structurally successful attempts: "+r.successfulAttempts,
    "- Reliable repeated artifacts: "+r.reliableArtifacts,
    "- C1 spontaneous interaction turns: "+r.interactionTurns,
    "- Reliable interaction chains across sessions: "+r.reliableInteractions,
    "- Delayed AI revisions: "+r.delayedRevisions,
    "",
    ...r.artifactEvidence.slice(0,12).map((item)=>"- "+item.title+": "+item.attempts+" attempts · "+item.successfulDays+" successful days · "+Math.round(item.spanHours)+"h span · "+(item.reliableAcrossSessions?"reliable across sessions":"not yet repeated reliably")),
    "",
    "## P15 authentic C1 environment",
    "",
    "- Active environment days: "+e.activeDays,
    "- External sources registered: "+e.registeredSources,
    "- Sources evaluated: "+e.evaluatedSources,
    "- Source genres represented: "+e.sourceGenres,
    "- Publishers/institutions represented: "+e.sourcePublishers,
    "- Specialist terms mined: "+e.specialistTerms,
    "- Writing projects started: "+e.writingProjectsStarted,
    "- Writing projects completed: "+e.writingProjectsCompleted,
    "- Live-defense turns: "+e.defenseTurns,
    "- Unique pressure types encountered: "+e.uniquePressureTypes,
    "",
    "### Writing-project status",
    "",
    ...e.projects.map((item)=>"- "+item.project.title+": "+item.nextStage.replaceAll("_"," ")+" · "+item.defenses.length+" defenses"+(item.draft?" · draft saved":"")+(item.revision?" · delayed revision saved":"")),
    "",
    "### Evaluated external sources",
    "",
    ...e.sources.map((source)=>{
      const evaluation=e.sourceEvaluations.find((item)=>item.sourceId===source.id);
      return "- "+source.publisher+" — "+source.title+" · "+source.genre+(evaluation?" · evaluated "+evaluation.confidence:" · not yet evaluated")+" · "+source.url;
    }),
    "",
    "## P16 research quality",
    "",
    "- Sources with bibliography metadata: "+q.bibliographySources,
    "- Private-reference excerpts: "+q.privateExcerpts,
    "- Redistributable/licensed excerpts: "+q.redistributableExcerpts,
    "- Human-reviewed projects: "+q.reviewedProjects,
    "- Human review records: "+q.humanReviews.length,
    "- Specialist tracks: "+q.specialistTracks.length,
    "- Specialist domains: "+q.specialistDomains,
    "",
    "### Human review evidence",
    "",
    ...q.humanReviews.map((review)=>"- "+review.projectTitle+" — "+review.reviewerRole+" · argument "+review.scores.argumentControl+"/4 · source use "+review.scores.sourceUse+"/4 · language "+review.scores.languagePrecision+"/4 · register "+review.scores.registerControl+"/4"+(review.blockingIssues.length?" · blocking issues: "+review.blockingIssues.length:"")),
    "",
    "### Specialist tracks",
    "",
    ...q.specialistTracks.map((track)=>"- "+track.title+" — "+track.domain+" · "+track.sourceIds.length+" sources · "+track.termIds.length+" terms · "+track.projectIds.length+" projects"),
    "",
    "## P17 C1→C2 precision bridge",
    "",
    "- Active precision days: "+x.activeDays,
    "- Precision transformations: "+x.precisionArtifacts.length,
    "- Precision modes practiced: "+x.precisionModes,
    "- Specialist discourse turns: "+x.specialistTurns.length,
    "- Complete specialist discourse cycles: "+x.completedDiscourseCycles,
    "- Specialist tracks with delayed reliability: "+x.sustainedSpecialistTracks,
    "- Fresh-source refreshes: "+x.sourceRefreshes.length,
    "- Human-review repair passes: "+x.reviewRepairs.length,
    "",
    "### Specialist discourse reliability",
    "",
    ...x.specialistTracks.map((track)=>"- "+track.title+" — "+track.domain+" · "+track.turns+" turns · "+track.stagesCovered+"/5 stages · "+track.repeatedStages+"/5 delayed repeats · "+Math.round(track.spanHours)+"h span · "+(track.sustainedAcrossSessions?"sustained across sessions":track.cycleComplete?"one complete cycle":"developing")),
    "",
    "## P18 advanced interaction",
    "",
    "- Active interaction days: "+i.activeDays,
    "- Live pressure turns: "+i.turns.length,
    "- Pressure types encountered: "+i.pressureTypes,
    "- Advanced AI pressure turns: "+i.aiPressureTurns,
    "- Complete 4-turn pressure sessions: "+i.completeSessions,
    "- Robust pressure sessions: "+i.robustSessions,
    "- Real human interactions logged: "+i.humanInteractions.length,
    "- Real human interaction minutes logged: "+i.humanInteractionMinutes,
    "- Cross-domain transfer attempts: "+i.transfers.length,
    "",
    "### Pressure sessions",
    "",
    ...i.sessions.map((session)=>"- "+session.turns+" turns · "+session.pressureTypes+" pressure types · "+session.families+" families · "+session.speechTurns+" speech transcript turns · "+session.averageResponseSeconds.toFixed(1)+"s average latency · "+(session.robustPressureCoverage?"robust pressure coverage":session.complete?"complete session":"developing")),
    "",
    "### Human interaction logs",
    "",
    ...i.humanInteractions.map((entry)=>"- "+entry.medium+" · "+entry.partnerProfile+" (learner-reported) · "+entry.durationMinutes+" minutes · "+entry.domain),
    "",
    "## Native-source depth",
    "",
    "- Verified sources: "+n.verifiedSources+" / "+n.sourceCount,
    "- Speakers: "+n.speakers,
    "- Registers: "+n.registers.join(", "),
    "- Source-rate conditions: "+n.speechRates.join(", "),
    "- Sources listened: "+n.exposedSources,
    "- Native source sets synthesized: "+n.completedSets,
    "",
    "## Long-form autonomy missions",
    "",
    ...p.autonomyMissions.flatMap((entry)=>[
      "### "+entry.mission.title,
      "",
      entry.mission.domain+" · "+entry.completedStages+"/"+entry.totalStages+" stages · "+entry.activeDays+" active days",
      "",
      ...entry.stages.map((stage)=>"- "+(stage.complete?"✓":"○")+" "+stage.title+(stage.detail?" — "+stage.detail:"")),
      ""
    ]),
    "## Recent C1 productive artifacts",
    "",
    ...p.recentArtifacts.flatMap((artifact)=>[
      "### "+artifact.title+" — "+artifact.mode,
      "",
      artifact.occurredAt+" · "+artifact.kind+(artifact.advisory?" · advisory":" · structural result: "+artifact.result),
      "",
      artifact.response,
      ""
    ])
  ];
  return lines.join("\n");
}

export function downloadC1Portfolio(filename:string,content:string,mime:string):void{
  const blob=new Blob([content],{type:mime});
  const url=URL.createObjectURL(blob);
  const anchor=document.createElement("a");
  anchor.href=url;anchor.download=filename;anchor.click();
  setTimeout(()=>URL.revokeObjectURL(url),0);
}
