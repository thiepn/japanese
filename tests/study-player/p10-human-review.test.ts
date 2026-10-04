import { describe,expect,it } from "vitest";
import type { StudyEvent } from "../../packages/domain/src/index";
import {
  buildExternalReviewerWorkspace,buildExternalReviewSubmissionTemplate,buildHumanReviewArtifacts,buildHumanReviewPacket,
  buildHumanReviewSummary,extractHumanReviews,getExternalReviewReadiness,selectExternalReviewArtifacts,type HumanReviewArtifact
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


  it("builds a deterministic six-artifact external packet with balanced modes and task diversity",()=>{
    const artifacts:HumanReviewArtifact[]=[
      artifact("w-new","writing","task-w1","2026-10-04T12:00:00Z"),
      artifact("w-2","writing","task-w2","2026-10-04T11:00:00Z"),
      artifact("w-dup","writing","task-w1","2026-10-04T10:00:00Z"),
      artifact("w-3","writing","task-w3","2026-10-04T09:00:00Z"),
      artifact("s-new","speaking","task-s1","2026-10-04T08:00:00Z"),
      artifact("s-2","speaking","task-s2","2026-10-04T07:00:00Z"),
      artifact("s-3","speaking","task-s3","2026-10-04T06:00:00Z")
    ];
    const selected=selectExternalReviewArtifacts(artifacts);
    const readiness=getExternalReviewReadiness(artifacts);
    expect(selected).toHaveLength(6);
    expect(selected.filter((item)=>item.mode==="writing")).toHaveLength(3);
    expect(selected.filter((item)=>item.mode==="speaking")).toHaveLength(3);
    expect(selected.map((item)=>item.taskId)).toEqual(expect.arrayContaining(["task-w1","task-w2","task-w3","task-s1","task-s2","task-s3"]));
    expect(readiness).toMatchObject({ready:true,selectedArtifacts:6,selectedWriting:3,selectedSpeaking:3,balanced:true});
  });

  it("keeps the external gate blocked until six artifacts include both writing and speaking",()=>{
    const writingOnly:Array<HumanReviewArtifact>=Array.from({length:6},(_,index)=>artifact("w"+index,"writing","task-w"+index,"2026-10-04T0"+index+":00:00Z"));
    expect(getExternalReviewReadiness(writingOnly)).toMatchObject({ready:false,speakingArtifacts:0});

    const mixed=[...writingOnly.slice(0,5),artifact("s1","speaking","task-s1","2026-10-04T12:00:00Z")];
    expect(getExternalReviewReadiness(mixed)).toMatchObject({ready:true,selectedArtifacts:6,selectedWriting:5,selectedSpeaking:1,balanced:false});
  });

  it("generates an offline reviewer workspace and matching submission structure without changing mastery",()=>{
    const artifacts:Array<HumanReviewArtifact>=[
      artifact("w1","writing","task-w1","2026-10-04T12:00:00Z"),
      artifact("w2","writing","task-w2","2026-10-04T11:00:00Z"),
      artifact("w3","writing","task-w3","2026-10-04T10:00:00Z"),
      artifact("s1","speaking","task-s1","2026-10-04T09:00:00Z"),
      artifact("s2","speaking","task-s2","2026-10-04T08:00:00Z"),
      artifact("s3","speaking","task-s3","2026-10-04T07:00:00Z")
    ];
    const packet=buildHumanReviewPacket(artifacts,new Date("2026-10-04T13:00:00Z"));
    const template=buildExternalReviewSubmissionTemplate(packet,new Date("2026-10-04T14:00:00Z"));
    const html=buildExternalReviewerWorkspace(packet);
    expect(template.artifactReviews).toHaveLength(6);
    expect(template.externalToProject).toBe(true);
    expect(template.artifactReviews.filter((item)=>item.spokenModality)).toHaveLength(3);
    expect(html).toContain("Japanese B2 external productive-language review");
    expect(html).toContain("Packet SHA-256");
    expect(html).toContain("reviewDoesNotChangeMastery");
    expect(html).toContain("w1");
    expect(html).toContain("s3");
  });
});

function artifact(eventId:string,mode:"writing"|"speaking",taskId:string,occurredAt:string):HumanReviewArtifact{
  return {
    eventId,occurredAt,taskId,title:taskId,mode,response:"日本語の回答 "+eventId,
    structurallyCorrect:true,reviewed:false
  };
}
