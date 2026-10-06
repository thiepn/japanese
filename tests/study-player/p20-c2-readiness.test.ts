import { describe,expect,it } from "vitest";
import type { C1PortfolioSummary } from "../../apps/web/src/study/c1Reliability";
import type { C1PrecisionProgress } from "../../apps/web/src/study/c1Precision";
import type { C1AdvancedInteractionProgress } from "../../apps/web/src/study/c1AdvancedInteraction";
import type { C1ProsodyEvaluationProgress,C2ExternalHumanReview,C2ReviewScores } from "../../apps/web/src/study/c1ProsodyEvaluation";
import { buildC2ReadinessSummary,buildReviewerCalibration } from "../../apps/web/src/study/c2Readiness";

const AUG1="2026-08-01T09:00:00.000Z";
const SEP5="2026-09-05T09:00:00.000Z";

function scores(value=4):C2ReviewScores{
  return {
    lexicalPrecision:value,grammaticalControl:value,discourseOrganization:value,interactionRepair:value,
    registerFlexibility:value,prosodicControl:value,listeningUnderPressure:value
  };
}

function review(id:string,label:string,date:string,value=4):C2ExternalHumanReview{
  return {
    id,reviewerLabel:label,reviewerRole:"teacher",modality:"combined",
    evidenceObserved:{longFormProduction:true,liveInteraction:true,audioProsody:true,overlapListening:true},
    scores:scores(value),strengths:"Observed advanced strengths across the reviewed evidence. ".repeat(3),
    priorities:"Concrete priorities grounded in directly observed language performance. ".repeat(3),
    evidenceNotes:"Reviewed long-form production, live interaction, actual audio and listening-under-pressure evidence. ".repeat(3),
    reviewedAt:date,scoreCoverage:7,broadCoverage:true
  };
}

function portfolio():C1PortfolioSummary{
  return {
    firstEvidenceAt:AUG1,lastEvidenceAt:SEP5,activeDays:12,readingTexts:8,listeningTexts:8,speakingTasks:4,writingTasks:4,
    synthesisPacks:4,nativeSourceSyntheses:4,spontaneousCoachTurns:20,autonomyMissionsCompleted:3,autonomyMissions:[],domains:[],
    reliability:{
      activeDays:6,gradedAttempts:14,successfulAttempts:12,reliableArtifacts:3,interactionTurns:20,reliableInteractions:2,
      delayedRevisions:3,artifactEvidence:[],interactionEvidence:[]
    },
    recentArtifacts:[]
  };
}

function precision():C1PrecisionProgress{
  const modes=["compression","expansion","register_shift","stance_calibration","lexical_precision","cohesion_restructure","counterargument_integration","audience_translation"] as const;
  return {
    activeDays:4,
    precisionArtifacts:modes.map((mode,index)=>({
      id:"precision-"+index,challengeId:"challenge-"+index,mode,originalText:"原文".repeat(80),revisedText:"修正".repeat(80),
      rationale:"rationale".repeat(15),occurredAt:new Date(Date.parse(AUG1)+index*DAY).toISOString()
    })),
    precisionModes:8,
    specialistTurns:Array.from({length:10},(_,index)=>({
      id:"turn-"+index,trackId:"track",stageId:(["position","mechanism","challenge","audience_shift","synthesis"] as const)[index%5]!,
      response:"専門的な応答".repeat(30),inputMode:"speech" as const,occurredAt:new Date(Date.parse(AUG1)+(index+1)*DAY).toISOString()
    })),
    specialistTracks:[],completedDiscourseCycles:2,sustainedSpecialistTracks:1,sourceRefreshes:[],reviewRepairs:[]
  };
}

function interaction():C1AdvancedInteractionProgress{
  return {
    activeDays:4,turns:[],completeSessions:2,robustSessions:2,pressureTypes:12,aiPressureTurns:8,
    sessions:[
      {sessionId:"s1",turns:6,pressureTypes:6,families:4,speechTurns:4,averageResponseSeconds:12,firstAt:"2026-08-10T09:00:00.000Z",lastAt:"2026-08-10T09:20:00.000Z",complete:true,robustPressureCoverage:true},
      {sessionId:"s2",turns:7,pressureTypes:7,families:5,speechTurns:5,averageResponseSeconds:11,firstAt:"2026-08-20T09:00:00.000Z",lastAt:"2026-08-20T09:20:00.000Z",complete:true,robustPressureCoverage:true}
    ],
    humanInteractions:[
      {id:"h1",medium:"in_person",partnerProfile:"native_japanese",durationMinutes:30,domain:"work",interactionSummary:"summary".repeat(20),difficultMoment:"hard".repeat(20),repairUsed:"repair".repeat(20),reflection:"reflection".repeat(20),occurredAt:"2026-08-12T09:00:00.000Z"},
      {id:"h2",medium:"voice_call",partnerProfile:"advanced_japanese",durationMinutes:30,domain:"study",interactionSummary:"summary".repeat(20),difficultMoment:"hard".repeat(20),repairUsed:"repair".repeat(20),reflection:"reflection".repeat(20),occurredAt:"2026-08-22T09:00:00.000Z"}
    ],
    humanInteractionMinutes:60,transfers:[]
  };
}

function p19(reviews:C2ExternalHumanReview[]):C1ProsodyEvaluationProgress{
  const targetIds=["formal_chunking","contrast_repair","compressed_answer","floor_recovery"] as const;
  const taskIds=["p19-overlap-press-vs-memorial","p19-overlap-policy-vs-press","p19-overlap-public-communication","p19-overlap-fast-repair"];
  return {
    activeDays:4,
    prosodyCaptures:targetIds.map((targetId,index)=>({
      id:"p-"+index,localCaptureId:"local-"+index,targetId,transcript:"発話".repeat(30),selfReflection:"reflection".repeat(20),
      metrics:{durationMs:5000,activeSpeechRatio:.75,pauseRatio:.15,longPauseCount:2,phraseCount:3,dynamicRangeDb:10,frameMs:20},
      mimeType:"audio/webm",sizeBytes:5000,occurredAt:new Date(Date.parse("2026-08-15T09:00:00.000Z")+index*DAY).toISOString()
    })),
    overlapAttempts:taskIds.map((taskId,index)=>({
      id:"o-"+index,taskId,primarySourceId:"a",maskerSourceId:"b",recall:"再構成".repeat(40),uncertainSegment:"不明".repeat(30),repairPlan:"復帰".repeat(30),
      occurredAt:new Date(Date.parse("2026-08-25T09:00:00.000Z")+index*DAY).toISOString()
    })),
    externalReviews:reviews,prosodyTargets:4,overlapTasks:4,reviewedSessions:reviews.length,
    broadlyCoveredReviews:reviews.filter((item)=>item.broadCoverage).length,localCaptureCount:4
  };
}

const DAY=24*60*60*1000;

describe("P20 longitudinal C2 readiness consolidation",()=>{
  it("qualifies the internal advanced pathway only after longitudinal, external and dimension gates all pass",()=>{
    const summary=buildC2ReadinessSummary({
      portfolio:portfolio(),precision:precision(),interaction:interaction(),
      p19:p19([review("r1","Reviewer Alpha","2026-08-20T12:00:00.000Z"),review("r2","Reviewer Beta","2026-09-01T12:00:00.000Z")])
    },new Date("2026-09-05T12:00:00.000Z"));

    expect(summary.status).toBe("advanced_pathway_qualified");
    expect(summary.qualified).toBe(true);
    expect(summary.requirements.every((item)=>item.met)).toBe(true);
    expect(summary.stableDimensions).toBe(7);
    expect(summary.externalAverage).toBe(4);
    expect(summary.calibration.identityVerified).toBe(false);
    expect(summary.evidenceBoundary.accreditedCefrCertification).toBe(false);
  });

  it("blocks qualification when broad reviewers diverge sharply on a jointly observed dimension",()=>{
    const first=review("r1","Reviewer Alpha","2026-08-20T12:00:00.000Z",4);
    const second=review("r2","Reviewer Beta","2026-09-01T12:00:00.000Z",4);
    second.scores.lexicalPrecision=1;
    const summary=buildC2ReadinessSummary({portfolio:portfolio(),precision:precision(),interaction:interaction(),p19:p19([first,second])});
    expect(summary.calibration.status).toBe("divergent");
    expect(summary.calibration.divergentDimensions).toContain("lexicalPrecision");
    expect(summary.status).toBe("reviewer_divergence");
    expect(summary.qualified).toBe(false);
  });

  it("requires label-distinct repeated broad review without pretending reviewer identity is verified",()=>{
    const calibration=buildReviewerCalibration([
      review("r1","Same Reviewer","2026-08-20T12:00:00.000Z"),
      review("r2","Same Reviewer","2026-09-01T12:00:00.000Z")
    ]);
    expect(calibration.status).toBe("single_reviewer_label");
    expect(calibration.distinctReviewerLabels).toBe(1);
    expect(calibration.identityVerified).toBe(false);
  });

  it("surfaces persistent weak dimensions rather than averaging them out",()=>{
    const first=review("r1","Reviewer Alpha","2026-08-20T12:00:00.000Z",4);
    const second=review("r2","Reviewer Beta","2026-09-01T12:00:00.000Z",4);
    first.scores.listeningUnderPressure=2;second.scores.listeningUnderPressure=2;
    const summary=buildC2ReadinessSummary({portfolio:portfolio(),precision:precision(),interaction:interaction(),p19:p19([first,second])});
    const listening=summary.dimensions.find((item)=>item.dimension==="listeningUnderPressure")!;
    expect(listening.status).toBe("weak");
    expect(listening.persistentWeakness).toBe(true);
    expect(summary.unresolvedWeakDimensions).toContain("listeningUnderPressure");
    expect(summary.qualified).toBe(false);
  });
});
