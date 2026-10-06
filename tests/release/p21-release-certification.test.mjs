const COMMIT="a".repeat(40);
import fs from "node:fs";
import { describe,expect,it } from "vitest";
import {
  P21_AUTOMATED_KEYS,P21_REQUIRED_DEVICE_CHECKS,buildP21ReleaseReport,normalizeP21RegressionEvidence,
  summarizeDeviceAcceptance
} from "../../scripts/p21-release-certify.mjs";

function automated(value=true){
  return Object.fromEntries(P21_AUTOMATED_KEYS.map((key)=>[key,value]));
}

function deviceManifest(status="passed"){
  return {
    schema:"thiepn-japanese-p21-device-acceptance",
    schemaVersion:1,
    status,
    generatedAt:"2026-10-06T12:00:00Z",
    requiredChecks:[...P21_REQUIRED_DEVICE_CHECKS],
    devices:status==="passed"?[{
      id:"android-1",
      deviceModel:"Test Android Phone",
      platform:"android",
      osVersion:"Android 16",
      browserEngine:"chromium",
      browserVersion:"Chromium 156",
      buildCommit:COMMIT,
      installMode:"standalone-pwa",
      testedAt:"2026-10-06T11:00:00Z",
      checks:Object.fromEntries(P21_REQUIRED_DEVICE_CHECKS.map((key)=>[key,true]))
    }]:[],
    defects:[]
  };
}

function p11(qualified=true){
  return {
    releaseCandidateQualified:qualified,
    decision:qualified?"OPEN_C1_ROADMAP":"HOLD_B2_RELEASE_CANDIDATE",
    passed:qualified?9:8,
    total:9
  };
}

describe("P21 final release certification",()=>{
  it("keeps the checked-in physical-device manifest honestly pending",()=>{
    const manifest=JSON.parse(fs.readFileSync("release/p21-device-acceptance.json","utf8"));
    const summary=summarizeDeviceAcceptance(manifest);
    expect(summary.status).toBe("pending");
    expect(summary.physicalDevices).toBe(0);
    expect(summary.qualified).toBe(false);
  });

  it("requires one complete standalone physical-device pass",()=>{
    const summary=summarizeDeviceAcceptance(deviceManifest("passed"));
    expect(summary.completeDevices).toBe(1);
    expect(summary.blockingDefects).toHaveLength(0);
    expect(summary.qualified).toBe(true);

    const incomplete=deviceManifest("passed");
    incomplete.devices[0].checks.microphoneRecording=false;
    expect(summarizeDeviceAcceptance(incomplete).qualified).toBe(false);
  });

  it("treats open medium-or-higher device defects as release blockers",()=>{
    const manifest=deviceManifest("passed");
    manifest.defects=[{id:"d1",severity:"medium",status:"open",summary:"Landscape controls become unreachable."}];
    const summary=summarizeDeviceAcceptance(manifest);
    expect(summary.blockingDefects).toHaveLength(1);
    expect(summary.qualified).toBe(false);
  });

  it("opens stable release only when automated, device and independent P11 evidence are all green",()=>{
    const report=buildP21ReleaseReport({
      regression:normalizeP21RegressionEvidence(automated(true)),
      device:summarizeDeviceAcceptance(deviceManifest("passed")),
      p11:p11(true),
      generatedAt:"2026-10-06T12:00:00Z",
      commit:COMMIT
    });
    expect(report.technicalReleaseReady).toBe(true);
    expect(report.evidenceReleaseReady).toBe(true);
    expect(report.stableReleaseReady).toBe(true);
    expect(report.decision).toBe("READY_FOR_STABLE_RELEASE");

    const pending=buildP21ReleaseReport({
      regression:automated(true),
      device:summarizeDeviceAcceptance(deviceManifest("pending")),
      p11:p11(false)
    });
    expect(pending.stableReleaseReady).toBe(false);
    expect(pending.decision).toBe("HOLD_EXTERNAL_VALIDATION_AND_DEVICE");
    expect(pending.evidenceBoundary.automatedBrowserProfilesArePhysicalDevices).toBe(false);
  });
});
