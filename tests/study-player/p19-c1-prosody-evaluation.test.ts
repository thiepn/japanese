import { describe,expect,it } from "vitest";
import type { StudyEvent } from "@thiepn/domain";
import {
  analyzeAmplitudeEnvelope,buildC1ProsodyEvaluationProgress,c1OverlapListeningTasks,c1ProsodyTargets,c2ReviewScaleAnchors,
  isBroadC2ReviewCoverage,overlapTask,reviewScoreCoverage,type C2ExternalHumanReview,type C2ReviewScores
} from "../../apps/web/src/study/c1ProsodyEvaluation";

const D1="2026-10-01T09:00:00.000Z";
const D2="2026-10-02T10:00:00.000Z";

function event(metadata:Record<string,unknown>,occurredAt=D1,activity:StudyEvent["activity"]="speaking"):StudyEvent{
  return {id:crypto.randomUUID(),userId:"u",deviceId:"d",occurredAt,activity,metadata};
}

describe("P19 prosody, overlap listening and external C2-oriented review",()=>{
  it("derives real timing-envelope metrics without pretending to score pitch accent",()=>{
    const sampleRate=1000;
    const samples=new Float32Array(2500);
    for(let i=0;i<1000;i++)samples[i]=Math.sin(i/7)*.35;
    for(let i=1500;i<2500;i++)samples[i]=Math.sin(i/7)*.35;
    const metrics=analyzeAmplitudeEnvelope(samples,sampleRate,20);
    expect(metrics.durationMs).toBe(2500);
    expect(metrics.longPauseCount).toBe(1);
    expect(metrics.phraseCount).toBe(2);
    expect(metrics.pauseRatio).toBeGreaterThan(.15);
    expect(metrics.pauseRatio).toBeLessThan(.3);
    expect(metrics.activeSpeechRatio).toBeGreaterThan(.7);
    expect(metrics.activeSpeechRatio).toBeLessThan(.9);
  });

  it("ships four prosody targets and four overlap tasks backed by verified P13 native recordings",()=>{
    expect(c1ProsodyTargets).toHaveLength(4);
    expect(c1OverlapListeningTasks).toHaveLength(4);
    for(const task of c1OverlapListeningTasks){
      expect(()=>overlapTask(task.id)).not.toThrow();
      expect(task.primarySourceId).not.toBe(task.maskerSourceId);
      expect(task.primaryRate).toBeGreaterThanOrEqual(1);
      expect(task.maskerVolume).toBeGreaterThan(0);
      expect(task.maskerVolume).toBeLessThan(.5);
    }
  });

  it("anchors the 0–5 external reviewer scale while preserving not-observed separately",()=>{
    expect(c2ReviewScaleAnchors.map((item)=>item.score)).toEqual([0,1,2,3,4,5]);
    expect(c2ReviewScaleAnchors[5]?.description).toMatch(/not a CEFR certification/i);
  });

  it("distinguishes partial external review from broad evidence coverage",()=>{
    const partial:C2ReviewScores={
      lexicalPrecision:4,grammaticalControl:4,discourseOrganization:4,interactionRepair:4,
      registerFlexibility:null,prosodicControl:null,listeningUnderPressure:null
    };
    expect(reviewScoreCoverage(partial)).toBe(4);
    expect(isBroadC2ReviewCoverage({
      scores:partial,
      evidenceObserved:{longFormProduction:true,liveInteraction:true,audioProsody:false,overlapListening:false}
    })).toBe(false);

    const broad:C2ReviewScores={
      lexicalPrecision:4,grammaticalControl:4,discourseOrganization:5,interactionRepair:4,
      registerFlexibility:4,prosodicControl:3,listeningUnderPressure:4
    };
    expect(reviewScoreCoverage(broad)).toBe(7);
    expect(isBroadC2ReviewCoverage({
      scores:broad,
      evidenceObserved:{longFormProduction:true,liveInteraction:true,audioProsody:true,overlapListening:true}
    })).toBe(true);
  });

  it("projects P19 evidence from StudyEvents while keeping local-audio availability separate",()=>{
    const metrics={durationMs:4200,activeSpeechRatio:.72,pauseRatio:.18,longPauseCount:2,phraseCount:3,dynamicRangeDb:11.2,frameMs:20};
    const review:C2ExternalHumanReview={
      id:"review-1",reviewerLabel:"External teacher",reviewerRole:"teacher",modality:"combined",
      evidenceObserved:{longFormProduction:true,liveInteraction:true,audioProsody:true,overlapListening:true},
      scores:{lexicalPrecision:4,grammaticalControl:4,discourseOrganization:4,interactionRepair:4,registerFlexibility:4,prosodicControl:4,listeningUnderPressure:4},
      strengths:"Specific strengths observed across live and recorded evidence. ".repeat(3),
      priorities:"Specific priorities grounded in the reviewed interaction evidence. ".repeat(3),
      evidenceNotes:"The reviewer directly observed long-form, live interaction, audio prosody and overlap listening evidence. ".repeat(3),
      reviewedAt:D2,scoreCoverage:7,broadCoverage:true
    };
    const events:StudyEvent[]=[
      event({p19ProsodyEvaluation:true,p19ProsodyCapture:true,prosodyCapture:{
        id:"prosody-1",localCaptureId:"local-1",targetId:"formal_chunking",transcript:"発話".repeat(40),
        selfReflection:"reflection".repeat(20),metrics,mimeType:"audio/webm",sizeBytes:5000,occurredAt:D1
      }}),
      event({p19ProsodyEvaluation:true,p19OverlapListening:true,overlapAttempt:{
        id:"overlap-1",taskId:"p19-overlap-policy-vs-press",primarySourceId:"a",maskerSourceId:"b",
        recall:"再構成".repeat(40),uncertainSegment:"不明".repeat(30),repairPlan:"復帰".repeat(30),occurredAt:D2
      }},D2,"listening"),
      event({p19ProsodyEvaluation:true,p19ExternalC2Review:true,externalC2Review:review},D2)
    ];
    const progress=buildC1ProsodyEvaluationProgress(events,1);
    expect(progress.activeDays).toBe(2);
    expect(progress.prosodyCaptures).toHaveLength(1);
    expect(progress.overlapAttempts).toHaveLength(1);
    expect(progress.externalReviews).toHaveLength(1);
    expect(progress.broadlyCoveredReviews).toBe(1);
    expect(progress.localCaptureCount).toBe(1);
  });
});
