import { describe,expect,it } from "vitest";
import type { StudyEvent } from "../../packages/domain/src/index";
import {
  buildHumanReviewArtifacts,buildHumanReviewPacket,buildHumanReviewSummary,extractHumanReviews
} from "../../apps/web/src/study/humanReview";

function productiveEvent():StudyEvent{
  return {
    id:"artifact-1",userId:"u",deviceId:"d",occurredAt:"2026-10-01T08:00:00Z",activity:"writing",
    primaryTarget:{kind:"production_task",id:"p7-writing-ai"},skillDimension:"writing_quality",
    promptFamily:"connected-writing",responseMode:"textarea",result:"correct",
    metadata:{learnerResponse:"人工知能を使う場合、情報源を確認して根拠を示します。"}
  };
}
function reviewEvent():StudyEvent{
  return {
    id:"review-1",userId:"u",deviceId:"reviewer",occurredAt:"2026-10-02T08:00:00Z",activity:"assessment",
    primaryTarget:{kind:"production_task",id:"p7-writing-ai"},skillDimension:"writing_quality",
    promptFamily:"p10-human-review",responseMode:"human_rubric",result:"skipped",
    metadata:{
      humanReview:true,reviewOfEventId:"artifact-1",reviewerLabel:"Tutor",
      rubric:{taskFulfillment:4,meaningAccuracy:3,coherence:3,register:2},overall:3,
      comment:"Clear meaning.",strengths:"Evidence language.",nextPriority:"Register.",
      humanReviewAppliedToMastery:false,accreditedCefrVerdict:false
    }
  };
}

describe("P10 human evaluation",()=>{
  it("links descriptive human review to a learner artifact without creating mastery",()=>{
    const events=[productiveEvent(),reviewEvent()];
    const artifacts=buildHumanReviewArtifacts(events);
    const reviews=extractHumanReviews(events);
    expect(artifacts).toHaveLength(1);
    expect(artifacts[0]).toMatchObject({eventId:"artifact-1",reviewed:true});
    expect(reviews[0]).toMatchObject({reviewerLabel:"Tutor",overall:3});
    expect(reviewEvent().result).toBe("skipped");
    expect(reviewEvent().metadata).toMatchObject({humanReviewAppliedToMastery:false,accreditedCefrVerdict:false});
  });

  it("builds latest-review summary and a portable review packet with explicit boundaries",()=>{
    const artifacts=buildHumanReviewArtifacts([productiveEvent(),reviewEvent()]);
    const reviews=extractHumanReviews([reviewEvent()]);
    const summary=buildHumanReviewSummary(artifacts,reviews);
    const packet=buildHumanReviewPacket(artifacts,new Date("2026-10-04T10:00:00Z"));
    expect(summary).toMatchObject({reviewedArtifacts:1,unreviewedArtifacts:0,averageOverall:3});
    expect(packet.evidenceBoundary).toEqual({reviewDoesNotChangeMastery:true,reviewerScoreIsNotCefrCertification:true});
    expect(packet.artifacts[0]?.response).toContain("情報源");
  });
});
