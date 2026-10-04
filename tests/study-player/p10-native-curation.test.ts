import { describe,expect,it } from "vitest";
import type { PrivateDocumentRecord,PrivateMediaReviewRecord,PrivateNativeAudio } from "../../packages/local-db/src/index";
import {
  buildNativeCurationSummary,buildP10NativeCandidateManifest,curationBlockers,type NativeCurationCandidate
} from "../../apps/web/src/immerse/nativeCuration";

const document:PrivateDocumentRecord={
  id:"doc-1",accountId:"a",title:"Verified dialogue",sourceKind:"source_pack",text:"確認します。",importedAt:"2026-10-01T00:00:00Z",updatedAt:"2026-10-01T00:00:00Z",
  sourceUrl:"https://example.org/source",sourceLabel:"Example source"
};
const audio:PrivateNativeAudio={
  url:"https://example.org/audio.ogg",credit:"Speaker A",licenseName:"CC BY 4.0",attributionUrl:"https://example.org/audio",
  externalId:"audio-1",speechRate:"natural",register:"polite",speakerLabel:"Speaker A"
};
const review:PrivateMediaReviewRecord={
  id:"r",accountId:"a",documentId:"doc-1",recordingKey:"audio-1",status:"verified",reviewerLabel:"Curator",reviewedAt:"2026-10-02T00:00:00Z",
  checklist:{sourceReachable:true,licenseVerified:true,nativeSpeakerVerified:true,transcriptMatchVerified:true,registerReviewed:true,speechRateReviewed:true}
};

function candidate(overrides:Partial<NativeCurationCandidate>={}):NativeCurationCandidate{
  return {document,recording:audio,recordingKey:"audio-1",review,eligibleForPromotion:true,blockers:[],...overrides};
}

describe("P10 native corpus curation",()=>{
  it("blocks promotion until source metadata and every human-verification field are complete",()=>{
    const incomplete={...review,checklist:{...review.checklist,licenseVerified:false}};
    expect(curationBlockers(document,audio,incomplete)).toContain("verification incomplete: licenseVerified");
    expect(curationBlockers({...document,sourceUrl:undefined},audio,review)).toContain("document source URL missing");
  });

  it("summarizes only promotable media toward speaker/register/rate readiness",()=>{
    const secondAudio={...audio,externalId:"audio-2",speakerLabel:"Speaker B",speechRate:"fast" as const,register:"neutral" as const};
    const secondReview={...review,id:"r2",recordingKey:"audio-2"};
    const blocked=candidate({recording:{...audio,externalId:"audio-3"},recordingKey:"audio-3",review:undefined,eligibleForPromotion:false,blockers:["human verification missing"]});
    const summary=buildNativeCurationSummary([candidate(),candidate({recording:secondAudio,recordingKey:"audio-2",review:secondReview}),blocked]);
    expect(summary).toMatchObject({recordings:3,verified:2,promotableRecordings:2,speakers:2});
    expect(summary.registers).toEqual(["neutral","polite"]);
    expect(summary.speechRates).toEqual(["fast","natural"]);
  });

  it("exports only human-verified promotion candidates with audit metadata",()=>{
    const manifest=buildP10NativeCandidateManifest([candidate()],new Date("2026-10-04T10:00:00Z"));
    expect(manifest.schema).toBe("thiepn-japanese-p10-native-candidates");
    expect(manifest.documents).toHaveLength(1);
    expect(manifest.documents[0]?.recordings[0]).toMatchObject({
      id:"audio-1",nativeSpeaker:true,speechRate:"natural",register:"polite",
      verification:{reviewerLabel:"Curator"}
    });
  });
});
