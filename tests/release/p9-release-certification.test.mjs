import { describe,expect,it } from "vitest";
import {
  THRESHOLDS,
  buildQualificationReport,
  getStaticProductMetrics,
  normalizeRegressionEvidence,
  summarizeNativeInventory
} from "../../scripts/p9-release-certify.mjs";

const passingRegression={
  typecheck:true,
  unitTests:true,
  contentValidation:true,
  productionBuild:true,
  e2e:true,
  offlineDrill:true,
  providerOutageDrill:true,
  longHistoryDrill:true
};

function passingInventory(){
  const documents=[];
  let recordingIndex=0;
  for(let d=0;d<4;d+=1){
    const recordings=[];
    for(let r=0;r<2;r+=1){
      recordingIndex+=1;
      recordings.push({
        id:"rec-"+recordingIndex,
        url:"https://example.org/audio/"+recordingIndex+".mp3",
        credit:"Speaker "+((recordingIndex%3)+1),
        licenseName:"CC BY 4.0",
        attributionUrl:"https://example.org/audio/"+recordingIndex,
        nativeSpeaker:true,
        speechRate:recordingIndex===8?"fast":"natural",
        register:d%2===0?"polite":"neutral",
        speakerLabel:"Speaker "+((recordingIndex%3)+1)
      });
    }
    documents.push({
      id:"doc-"+(d+1),
      title:"Source "+(d+1),
      sourceUrl:"https://example.org/source/"+(d+1),
      recordings
    });
  }
  return {schema:"thiepn-japanese-p9-native-inventory",schemaVersion:1,documents};
}

describe("P9 release certification CLI model",()=>{
  it("derives static product evidence from the repository rather than hard-coding pass flags",()=>{
    const metrics=getStaticProductMetrics();
    expect(metrics.b2Texts).toBeGreaterThanOrEqual(THRESHOLDS.b2Texts);
    expect(metrics.b2ProductiveTasks).toBeGreaterThanOrEqual(THRESHOLDS.b2ProductiveTasks);
    expect(metrics.lexicalChunks).toBeGreaterThanOrEqual(THRESHOLDS.lexicalChunks);
    expect(metrics.realWorldChains).toBe(5);
    expect(metrics.realWorldPrompts).toBe(20);
  });

  it("derives native-media depth only from explicit reusable native recordings",()=>{
    const summary=summarizeNativeInventory(passingInventory());
    expect(summary.sourceDocuments).toBe(4);
    expect(summary.recordings).toBe(8);
    expect(summary.speakers).toBe(3);
    expect(summary.registers).toEqual(["neutral","polite"]);
    expect(summary.speechRates).toEqual(["fast","natural"]);
  });

  it("rejects inferred native-speaker status and non-reusable licensing",()=>{
    const inferred=passingInventory();
    inferred.documents[0].recordings[0].nativeSpeaker=false;
    expect(()=>summarizeNativeInventory(inferred)).toThrow(/NATIVE_SPEAKER_DECLARATION_REQUIRED/);

    const restricted=passingInventory();
    restricted.documents[0].recordings[0].licenseName="CC BY-NC 4.0";
    expect(()=>summarizeNativeInventory(restricted)).toThrow(/LICENSE_NOT_ADMITTED/);
  });

  it("opens the C1 roadmap gate only when static, native-media and regression evidence all pass",()=>{
    const report=buildQualificationReport({
      staticMetrics:getStaticProductMetrics(),
      native:summarizeNativeInventory(passingInventory()),
      regression:normalizeRegressionEvidence(passingRegression),
      generatedAt:"2026-10-03T10:00:00.000Z",
      commit:"fixture"
    });
    expect(report.releaseQualified).toBe(true);
    expect(report.c1RoadmapGateOpen).toBe(true);
    expect(report.passed).toBe(report.total);
  });

  it("keeps an empty real deployment inventory explicitly blocked without weakening static evidence",()=>{
    const report=buildQualificationReport({
      staticMetrics:getStaticProductMetrics(),
      native:summarizeNativeInventory({schema:"thiepn-japanese-p9-native-inventory",schemaVersion:1,documents:[]}),
      regression:normalizeRegressionEvidence(passingRegression)
    });
    expect(report.releaseQualified).toBe(false);
    expect(report.checks.filter((check)=>check.category==="content"||check.category==="performance").every((check)=>check.passed)).toBe(true);
    expect(report.checks.filter((check)=>check.category==="native_media").every((check)=>!check.passed)).toBe(true);
  });
});
