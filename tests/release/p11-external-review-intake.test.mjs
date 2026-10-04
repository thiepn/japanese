import { describe,expect,it } from "vitest";
import {
  appendExternalValidation,
  buildExternalValidationEntry,
  sha256Text,
  submissionTemplate,
  validateExternalReviewSubmission,
  validateReviewPacket
} from "../../scripts/p11-external-review-intake.mjs";

function packet(){
  return {
    schema:"thiepn-japanese-human-review-packet",
    schemaVersion:1,
    generatedAt:"2026-10-04T12:00:00Z",
    evidenceBoundary:{reviewDoesNotChangeMastery:true,reviewerScoreIsNotCefrCertification:true},
    artifacts:[
      {eventId:"w1",occurredAt:"2026-10-03T10:00:00Z",taskId:"task-w1",title:"Writing 1",mode:"writing",response:"文章です。",structurallyCorrect:true},
      {eventId:"w2",occurredAt:"2026-10-03T11:00:00Z",taskId:"task-w2",title:"Writing 2",mode:"writing",response:"別の文章です。",structurallyCorrect:true},
      {eventId:"w3",occurredAt:"2026-10-03T12:00:00Z",taskId:"task-w3",title:"Writing 3",mode:"writing",response:"三つ目です。",structurallyCorrect:false},
      {eventId:"s1",occurredAt:"2026-10-03T13:00:00Z",taskId:"task-s1",title:"Speaking 1",mode:"speaking",response:"話した内容です。",structurallyCorrect:true},
      {eventId:"s2",occurredAt:"2026-10-03T14:00:00Z",taskId:"task-s2",title:"Speaking 2",mode:"speaking",response:"二つ目の発話です。",structurallyCorrect:true},
      {eventId:"s3",occurredAt:"2026-10-03T15:00:00Z",taskId:"task-s3",title:"Speaking 3",mode:"speaking",response:"三つ目の発話です。",structurallyCorrect:true}
    ],
    rubricScale:{min:0,max:4,dimensions:["taskFulfillment","meaningAccuracy","coherence","register"]}
  };
}

function submission(){
  return {
    schema:"thiepn-japanese-p11-external-review-submission",
    schemaVersion:1,
    reviewerLabel:"Independent Japanese teacher",
    reviewerRole:"teacher",
    externalToProject:true,
    reviewedAt:"2026-10-04T13:00:00Z",
    verdict:"approve-with-notes",
    blockingIssues:[],
    notes:"Representative B2 productive evidence reviewed.",
    artifactReviews:packet().artifacts.map((artifact)=>({
      eventId:artifact.eventId,
      rubric:{taskFulfillment:3,meaningAccuracy:3,coherence:3,register:3},
      disposition:"accepted",
      ...(artifact.mode==="speaking"?{spokenModality:"spoken_production"}:{}),
      comment:""
    }))
  };
}

describe("P11.1 external review intake",()=>{
  it("validates the exported review packet evidence boundary",()=>{
    expect(validateReviewPacket(packet())).toEqual({artifacts:6});
    const bad=packet();
    bad.evidenceBoundary.reviewDoesNotChangeMastery=false;
    expect(()=>validateReviewPacket(bad)).toThrow(/BOUNDARY_INVALID/);
  });

  it("derives reviewed artifact count and modalities from packet-linked reviews",()=>{
    const summary=validateExternalReviewSubmission(submission(),packet());
    expect(summary.artifactCount).toBe(6);
    expect(summary.modalities).toEqual(["spoken_production","writing"]);
    expect(summary.hasWriting).toBe(true);
    expect(summary.hasSpeaking).toBe(true);
    expect(summary.averageRubric).toBe(3);
  });

  it("rejects reviews that reference artifacts outside the signed packet",()=>{
    const bad=submission();
    bad.artifactReviews[0].eventId="not-in-packet";
    expect(()=>validateExternalReviewSubmission(bad,packet())).toThrow(/ARTIFACT_NOT_IN_PACKET/);
  });

  it("builds deterministic packet and submission digests into the release evidence entry",()=>{
    const packetText=JSON.stringify(packet(),null,2)+"\n";
    const submissionText=JSON.stringify(submission(),null,2)+"\n";
    const entry=buildExternalValidationEntry({packetText,submissionText});
    expect(entry.packetSha256).toBe(sha256Text(packetText));
    expect(entry.submissionSha256).toBe(sha256Text(submissionText));
    expect(entry.artifactCount).toBe(6);
    expect(entry.modalities).toEqual(["spoken_production","writing"]);
  });

  it("does not silently overwrite a conflicting review identity",()=>{
    const packetText=JSON.stringify(packet(),null,2)+"\n";
    const submissionText=JSON.stringify(submission(),null,2)+"\n";
    const entry=buildExternalValidationEntry({packetText,submissionText});
    const manifest={schema:"thiepn-japanese-p11-external-validation",schemaVersion:1,generatedAt:"2026-10-04T00:00:00Z",reviews:[]};
    const next=appendExternalValidation(manifest,entry);
    expect(next.reviews).toHaveLength(1);
    const conflict={...entry,reviewerLabel:"Different reviewer"};
    expect(()=>appendExternalValidation(next,conflict)).toThrow(/REVIEW_CONFLICT/);
  });

  it("generates a reviewer template bound to every packet artifact",()=>{
    const template=submissionTemplate(packet());
    expect(template.artifactReviews).toHaveLength(6);
    expect(template.artifactReviews.filter((item)=>"spokenModality" in item)).toHaveLength(3);
  });
});
