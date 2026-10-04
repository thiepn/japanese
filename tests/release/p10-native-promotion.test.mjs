import { describe,expect,it } from "vitest";
import { promoteCandidateManifest,promotionSummary,validateCandidateManifest } from "../../scripts/p10-native-promote.mjs";

function candidate(){
  return {
    schema:"thiepn-japanese-p10-native-candidates",schemaVersion:1,generatedAt:"2026-10-04T10:00:00Z",
    documents:[{
      id:"doc-1",title:"Dialogue",text:"確認します。",sourceUrl:"https://example.org/source",sourceLabel:"Fixture",
      recordings:[{
        id:"audio-1",url:"https://example.org/audio.ogg",credit:"Speaker A",licenseName:"CC BY 4.0",attributionUrl:"https://example.org/audio",
        nativeSpeaker:true,speechRate:"natural",register:"polite",speakerLabel:"Speaker A",
        verification:{
          reviewerLabel:"Curator",reviewedAt:"2026-10-04T09:00:00Z",
          checklist:{sourceReachable:true,licenseVerified:true,nativeSpeakerVerified:true,transcriptMatchVerified:true,registerReviewed:true,speechRateReviewed:true}
        }
      }]
    }]
  };
}
function inventory(){return {schema:"thiepn-japanese-p9-native-inventory",schemaVersion:1,updatedAt:"2026-10-03",documents:[]};}

describe("P10 native promotion CLI model",()=>{
  it("accepts only fully verified candidate manifests",()=>{
    expect(validateCandidateManifest(candidate())).toEqual({documents:1,recordings:1});
    const bad=candidate();
    bad.documents[0].recordings[0].verification.checklist.nativeSpeakerVerified=false;
    expect(()=>validateCandidateManifest(bad)).toThrow(/VERIFICATION_INCOMPLETE/);
  });

  it("promotes verified candidates without dropping their audit trail",()=>{
    const before=inventory();
    const after=promoteCandidateManifest(candidate(),before);
    expect(after.documents).toHaveLength(1);
    expect(after.documents[0].recordings[0]).toMatchObject({
      id:"audio-1",nativeSpeaker:true,speechRate:"natural",register:"polite",
      verification:{reviewerLabel:"Curator"}
    });
    expect(promotionSummary(before,after)).toMatchObject({documentsAdded:1,recordingsAdded:1});
  });

  it("refuses to silently overwrite conflicting recording identities",()=>{
    const first=promoteCandidateManifest(candidate(),inventory());
    const changed=candidate();
    changed.documents[0].recordings[0].url="https://example.org/other.ogg";
    expect(()=>promoteCandidateManifest(changed,first)).toThrow(/RECORDING_CONFLICT/);
  });

  it("rejects restricted noncommercial audio",()=>{
    const bad=candidate();
    bad.documents[0].recordings[0].licenseName="CC BY-NC 4.0";
    expect(()=>validateCandidateManifest(bad)).toThrow(/LICENSE_NOT_ADMITTED/);
  });
});
