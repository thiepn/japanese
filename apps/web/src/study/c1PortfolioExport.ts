import { getC1NativeDepthProgress,type C1NativeDepthProgress } from "./c1NativeDepth";
import { getC1PortfolioSummary,type C1PortfolioSummary } from "./c1Reliability";
import { getC1EnvironmentProgress,type C1EnvironmentProgress } from "./c1Environment";
import { getC1ResearchQualityProgress,type C1ResearchQualityProgress } from "./c1ResearchQuality";

export interface C1PortfolioExport {
  schema:"thiepn-japanese-c1-portfolio";
  schemaVersion:3;
  generatedAt:string;
  phase:"P16";
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
  };
  portfolio:C1PortfolioSummary;
  nativeDepth:C1NativeDepthProgress;
  environment:C1EnvironmentProgress;
  researchQuality:C1ResearchQualityProgress;
}

export async function getC1PortfolioExport(now=new Date()):Promise<C1PortfolioExport>{
  const [portfolio,nativeDepth,environment,researchQuality]=await Promise.all([getC1PortfolioSummary(),getC1NativeDepthProgress(),getC1EnvironmentProgress(),getC1ResearchQualityProgress()]);
  return {
    schema:"thiepn-japanese-c1-portfolio",schemaVersion:3,generatedAt:now.toISOString(),phase:"P16",
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
      humanReviewChangesMastery:false
    },
    portfolio,nativeDepth,environment,researchQuality
  };
}

export function serializeC1PortfolioJson(value:C1PortfolioExport):string{
  return JSON.stringify(value,null,2);
}

export function serializeC1PortfolioMarkdown(value:C1PortfolioExport):string{
  const p=value.portfolio,r=p.reliability,n=value.nativeDepth,e=value.environment,q=value.researchQuality;
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
