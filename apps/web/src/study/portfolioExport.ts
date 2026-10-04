import { getNativeListeningDepthSummary,type NativeListeningDepthSummary } from "../immerse/nativeListening";
import { getRealWorldPerformanceSummary,type RealWorldPerformanceSummary } from "./realWorldPerformance";
import { getB2PortfolioSummary,type B2PortfolioSummary } from "./reliability";
import { getHumanReviewSummary,type HumanReviewSummary } from "./humanReview";

export interface B2PortfolioExportV1 {
  schema:"thiepn-japanese-b2-portfolio";
  schemaVersion:1;
  generatedAt:string;
  phase:"P9";
  evidenceBoundary:{
    accreditedCefrVerdict:false;
    aiFeedbackChangesMastery:false;
    structuralChecksAreSemanticScores:false;
    speechRecognitionIsAcousticScoring:false;
  };
  portfolio:B2PortfolioSummary;
  realWorldPerformance:RealWorldPerformanceSummary;
  nativeListening:NativeListeningDepthSummary;
}

export interface B2PortfolioExportV2 {
  schema:"thiepn-japanese-b2-portfolio";
  schemaVersion:2;
  generatedAt:string;
  phase:"P10";
  evidenceBoundary:{
    accreditedCefrVerdict:false;
    aiFeedbackChangesMastery:false;
    humanReviewChangesMastery:false;
    structuralChecksAreSemanticScores:false;
    speechRecognitionIsAcousticScoring:false;
  };
  portfolio:B2PortfolioSummary;
  realWorldPerformance:RealWorldPerformanceSummary;
  nativeListening:NativeListeningDepthSummary;
  humanReviews:HumanReviewSummary;
}

export async function getB2PortfolioExport(now=new Date()):Promise<B2PortfolioExportV2>{
  const [portfolio,realWorldPerformance,nativeListening,humanReviews]=await Promise.all([
    getB2PortfolioSummary(),getRealWorldPerformanceSummary(),getNativeListeningDepthSummary(),getHumanReviewSummary()
  ]);
  return {
    schema:"thiepn-japanese-b2-portfolio",schemaVersion:2,generatedAt:now.toISOString(),phase:"P10",
    evidenceBoundary:{
      accreditedCefrVerdict:false,
      aiFeedbackChangesMastery:false,
      humanReviewChangesMastery:false,
      structuralChecksAreSemanticScores:false,
      speechRecognitionIsAcousticScoring:false
    },
    portfolio,realWorldPerformance,nativeListening,humanReviews
  };
}

export function serializeB2PortfolioJson(value:B2PortfolioExportV1|B2PortfolioExportV2):string{
  return JSON.stringify(value,null,2);
}

export function serializeB2PortfolioMarkdown(value:B2PortfolioExportV1|B2PortfolioExportV2):string{
  const p=value.portfolio,r=p.reliability,perf=value.realWorldPerformance,native=value.nativeListening;
  const lines=[
    "# THIEPN Japanese — B2 Portfolio Export",
    "",
    "Generated: "+value.generatedAt,
    "Phase: "+value.phase,
    "",
    "## Evidence boundary",
    "",
    "- Descriptive learner evidence only; this is not an accredited CEFR result.",
    "- AI feedback is advisory and does not alter mastery.",
    ...("humanReviews" in value?["- Human review is descriptive evidence and does not alter mastery automatically."]:[]),
    "- Structural target checks are not complete semantic-quality scores.",
    "- Browser speech recognition is transcript evidence, not acoustic pronunciation scoring.",
    "",
    "## Longitudinal portfolio",
    "",
    "- Active B2 days: "+p.activeDays,
    "- B2 texts read: "+p.readingTexts,
    "- B2 texts heard: "+p.listeningTexts,
    "- Speaking tasks: "+p.speakingTasks,
    "- Writing tasks: "+p.writingTasks,
    "- Productive artifacts: "+p.productiveArtifacts,
    "- Delayed revisions: "+p.delayedRevisions,
    "- Cross-session reliable tasks: "+r.reliableTasks,
    "- Chunks transferred across contexts: "+r.transferredChunks,
    "",
    "## Real-world performance",
    "",
    "- Performance prompts attempted: "+perf.attemptedPrompts+" / "+perf.totalPrompts,
    "- Unseen prompts remaining: "+perf.unseenPrompts,
    "- Correct first attempts: "+perf.correctFirstAttempts,
    "- First attempts within time target: "+perf.withinTimeFirstAttempts,
    ...perf.chains.map((entry)=>"- "+entry.chain.title+": "+entry.attemptedStages+"/4 attempted · "+entry.correctStages+" structurally successful · "+entry.withinTimeStages+" within time"),
    "",
    "## Native listening depth",
    "",
    "- Native-source documents: "+native.sourceDocuments,
    "- Licensed recordings: "+native.recordings,
    "- Speaker labels/credits: "+native.speakers,
    "- Registers represented: "+(native.registers.join(", ")||"none"),
    "- Source-rate labels: "+(native.speechRates.join(", ")||"none"),
    "- Multi-source syntheses: "+native.multiSourceSessions,
    "- Delayed recalls: "+native.delayedRecalls,
    "",
    ...("humanReviews" in value?[
      "## Human review",
      "",
      "- Reviewed artifacts: "+value.humanReviews.reviewedArtifacts,
      "- Unreviewed artifacts: "+value.humanReviews.unreviewedArtifacts,
      "- Average overall rubric: "+value.humanReviews.averageOverall+" / 4",
      "- Average task fulfillment: "+value.humanReviews.averageTaskFulfillment+" / 4",
      "- Average meaning/accuracy: "+value.humanReviews.averageMeaningAccuracy+" / 4",
      "- Average coherence: "+value.humanReviews.averageCoherence+" / 4",
      "- Average register: "+value.humanReviews.averageRegister+" / 4",
      ""
    ]:[]),
    "## Recent productive artifacts",
    "",
    ...p.recentArtifacts.flatMap((artifact)=>[
      "### "+artifact.title+" — "+artifact.mode,
      "",
      artifact.occurredAt+" · "+(artifact.advisory?"AI-coach artifact (advisory)":"Study Player artifact ("+artifact.result+")"),
      "",
      artifact.response,
      ""
    ])
  ];
  return lines.join("\n");
}

export function downloadPortfolioText(filename:string,content:string,mime:string):void{
  const blob=new Blob([content],{type:mime});
  const url=URL.createObjectURL(blob);
  const anchor=document.createElement("a");
  anchor.href=url;anchor.download=filename;anchor.click();
  setTimeout(()=>URL.revokeObjectURL(url),0);
}
