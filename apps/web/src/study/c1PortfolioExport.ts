import { getC1NativeDepthProgress,type C1NativeDepthProgress } from "./c1NativeDepth";
import { getC1PortfolioSummary,type C1PortfolioSummary } from "./c1Reliability";

export interface C1PortfolioExport {
  schema:"thiepn-japanese-c1-portfolio";
  schemaVersion:1;
  generatedAt:string;
  phase:"P14";
  evidenceBoundary:{
    accreditedCefrVerdict:false;
    aiFeedbackChangesMastery:false;
    structuralChecksAreSemanticScores:false;
    speechRecognitionIsAcousticScoring:false;
    nativePlaybackIsComprehensionMastery:false;
    crossSessionReliabilityIsExternalCertification:false;
  };
  portfolio:C1PortfolioSummary;
  nativeDepth:C1NativeDepthProgress;
}

export async function getC1PortfolioExport(now=new Date()):Promise<C1PortfolioExport>{
  const [portfolio,nativeDepth]=await Promise.all([getC1PortfolioSummary(),getC1NativeDepthProgress()]);
  return {
    schema:"thiepn-japanese-c1-portfolio",schemaVersion:1,generatedAt:now.toISOString(),phase:"P14",
    evidenceBoundary:{
      accreditedCefrVerdict:false,
      aiFeedbackChangesMastery:false,
      structuralChecksAreSemanticScores:false,
      speechRecognitionIsAcousticScoring:false,
      nativePlaybackIsComprehensionMastery:false,
      crossSessionReliabilityIsExternalCertification:false
    },
    portfolio,nativeDepth
  };
}

export function serializeC1PortfolioJson(value:C1PortfolioExport):string{
  return JSON.stringify(value,null,2);
}

export function serializeC1PortfolioMarkdown(value:C1PortfolioExport):string{
  const p=value.portfolio,r=p.reliability,n=value.nativeDepth;
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
