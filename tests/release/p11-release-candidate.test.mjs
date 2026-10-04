import fs from "node:fs";
import { describe,expect,it } from "vitest";
import {
  buildP11QualificationReport,
  summarizeExternalValidation,
  summarizeProviderBenchmarks
} from "../../scripts/p11-release-candidate.mjs";

function p9Report(releaseQualified=true){
  const regressionEvidence={
    typecheck:true,unitTests:true,contentValidation:true,productionBuild:true,
    e2e:true,offlineDrill:true,providerOutageDrill:true,longHistoryDrill:true
  };
  return {releaseQualified,passed:releaseQualified?19:13,total:19,regressionEvidence};
}

function externalValidation(){
  return {
    schema:"thiepn-japanese-p11-external-validation",
    schemaVersion:1,
    generatedAt:"2026-10-04T12:00:00Z",
    reviews:[{
      id:"review-1",
      reviewerLabel:"External teacher",
      reviewerRole:"teacher",
      externalToProject:true,
      reviewedAt:"2026-10-04T11:00:00Z",
      packetId:"packet-1",
      packetSha256:"a".repeat(64),
      artifactCount:6,
      modalities:["writing","spoken_interaction"],
      verdict:"approve-with-notes",
      blockingIssues:[]
    }]
  };
}

function offlineProviders(){
  return {
    schema:"thiepn-japanese-p11-provider-benchmarks",
    schemaVersion:1,
    generatedAt:"2026-10-04T12:00:00Z",
    releaseProfile:"offline-only",
    configuredProviders:[],
    runs:[]
  };
}

function connectedProviders(){
  return {
    schema:"thiepn-japanese-p11-provider-benchmarks",
    schemaVersion:1,
    generatedAt:"2026-10-04T12:00:00Z",
    releaseProfile:"connected",
    configuredProviders:[{id:"coach-prod",type:"coach"}],
    runs:[{
      id:"run-1",providerId:"coach-prod",runAt:"2026-10-04T11:30:00Z",
      cases:20,passedCases:20,p95Ms:850,fallbackVerified:true,outcome:"pass"
    }]
  };
}

describe("P11 release candidate qualification",()=>{
  it("requires representative external review across writing and speaking",()=>{
    const summary=summarizeExternalValidation(externalValidation());
    expect(summary.qualified).toBe(true);
    expect(summary.reviewers).toBe(1);
    expect(summary.reviewedArtifacts).toBe(6);
    expect(summary.hasWriting).toBe(true);
    expect(summary.hasSpeaking).toBe(true);

    const missingSpeaking=externalValidation();
    missingSpeaking.reviews[0].modalities=["writing"];
    expect(summarizeExternalValidation(missingSpeaking).qualified).toBe(false);
  });

  it("treats a blocking external verdict as a hard blocker",()=>{
    const blocked=externalValidation();
    blocked.reviews[0].verdict="block";
    blocked.reviews[0].blockingIssues=["Prompt rubric is not stable enough for release."];
    const summary=summarizeExternalValidation(blocked);
    expect(summary.qualified).toBe(false);
    expect(summary.blockingIssues.length).toBeGreaterThan(0);
  });

  it("supports an explicit offline-only release profile without pretending providers were benchmarked",()=>{
    const summary=summarizeProviderBenchmarks(offlineProviders());
    expect(summary.releaseProfile).toBe("offline-only");
    expect(summary.configuredProviders).toBe(0);
    expect(summary.qualified).toBe(true);
  });


  it("keeps the checked-in release profile explicitly offline-only until connected providers are qualified",()=>{
    const manifest=JSON.parse(fs.readFileSync("release/p11-provider-benchmarks.json","utf8"));
    const summary=summarizeProviderBenchmarks(manifest);
    expect(summary.releaseProfile).toBe("offline-only");
    expect(summary.configuredProviders).toBe(0);
    expect(summary.qualified).toBe(true);
  });

  it("requires the latest connected provider run to pass all cases and fallback verification",()=>{
    expect(summarizeProviderBenchmarks(connectedProviders()).qualified).toBe(true);
    const failed=connectedProviders();
    failed.runs[0].passedCases=19;
    failed.runs[0].outcome="fail";
    expect(summarizeProviderBenchmarks(failed).qualified).toBe(false);
  });

  it("opens C1 only when P9, external validation, provider evidence and RC regression are all green",()=>{
    const report=buildP11QualificationReport({
      p9Report:p9Report(true),
      external:summarizeExternalValidation(externalValidation()),
      providers:summarizeProviderBenchmarks(offlineProviders()),
      generatedAt:"2026-10-04T12:00:00Z",
      commit:"fixture"
    });
    expect(report.releaseCandidateQualified).toBe(true);
    expect(report.c1RoadmapGateOpen).toBe(true);
    expect(report.decision).toBe("OPEN_C1_ROADMAP");

    const blocked=buildP11QualificationReport({
      p9Report:p9Report(false),
      external:summarizeExternalValidation(externalValidation()),
      providers:summarizeProviderBenchmarks(offlineProviders())
    });
    expect(blocked.releaseCandidateQualified).toBe(false);
    expect(blocked.c1RoadmapGateOpen).toBe(false);
    expect(blocked.decision).toBe("HOLD_B2_RELEASE_CANDIDATE");
  });
});
