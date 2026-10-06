import { describe,expect,it } from "vitest";
import { buildReleaseMeta } from "../../scripts/p22-write-release-meta.mjs";
import { probeProduction,summarizeProductionManifest } from "../../scripts/p22-production-monitor.mjs";
import { buildP22ReleaseStatus } from "../../scripts/p22-release-status.mjs";

const COMMIT="a".repeat(40);
const OTHER="b".repeat(40);

function inactiveManifest(){
  return {
    schema:"thiepn-japanese-p22-production",
    schemaVersion:1,
    status:"inactive",
    publicUrl:null,
    releaseCommit:null,
    releaseTag:null,
    activatedAt:null,
    maintenanceMode:false,
    monitor:{requiredPaths:["/","/manifest.webmanifest","/sw.js","/release-meta.json"],maxHomepageMs:5000},
    knownIncidents:[]
  };
}

function activeManifest(){
  return {
    ...inactiveManifest(),
    status:"active",
    publicUrl:"https://example.com",
    releaseCommit:COMMIT,
    releaseTag:"japanese-v1.0.0",
    activatedAt:"2026-10-06T14:00:00Z"
  };
}

function p21(ready){
  return {
    stableReleaseReady:ready,
    decision:ready?"READY_FOR_STABLE_RELEASE":"HOLD_EXTERNAL_VALIDATION_AND_DEVICE",
    commit:COMMIT
  };
}

describe("P22 stable release operations",()=>{
  it("writes exact immutable release identity metadata",()=>{
    const meta=buildReleaseMeta({commit:COMMIT,builtAt:"2026-10-06T14:00:00Z",channel:"stable"});
    expect(meta.phase).toBe("P22");
    expect(meta.channel).toBe("stable");
    expect(meta.commit).toBe(COMMIT);
    expect(()=>buildReleaseMeta({commit:"short"})).toThrow("P22_RELEASE_COMMIT_INVALID");
  });

  it("keeps the checked-in inactive production state honest",()=>{
    const summary=summarizeProductionManifest(inactiveManifest());
    expect(summary.active).toBe(false);
    expect(summary.operationallyHealthy).toBe(false);
    const invalid=inactiveManifest();
    invalid.publicUrl="https://example.com";
    expect(()=>summarizeProductionManifest(invalid)).toThrow("P22_INACTIVE_PRODUCTION_MUST_NOT_CLAIM_RELEASE");
  });

  it("verifies production availability and exact release identity",async()=>{
    const fetchImpl=async(url)=>{
      const pathname=new URL(String(url)).pathname;
      if(pathname==="/release-meta.json"){
        return new Response(JSON.stringify({
          schema:"thiepn-japanese-release-meta",schemaVersion:1,phase:"P22",channel:"stable",commit:COMMIT,builtAt:"2026-10-06T14:00:00Z"
        }),{status:200,headers:{"content-type":"application/json"}});
      }
      return new Response(pathname==="/"?"<!doctype html><title>Japanese</title>":"ok",{status:200});
    };
    const report=await probeProduction({
      baseUrl:"https://example.com",
      expectedCommit:COMMIT,
      requiredPaths:["/","/manifest.webmanifest","/sw.js","/release-meta.json"],
      maxHomepageMs:5000,
      fetchImpl,
      now:new Date("2026-10-06T15:00:00Z")
    });
    expect(report.healthy).toBe(true);
    expect(report.releaseMetaValid).toBe(true);

    const mismatch=await probeProduction({
      baseUrl:"https://example.com",
      expectedCommit:OTHER,
      requiredPaths:["/","/release-meta.json"],
      maxHomepageMs:5000,
      fetchImpl
    });
    expect(mismatch.healthy).toBe(false);
    expect(mismatch.releaseMetaValid).toBe(false);
  });

  it("does not call an inactive repository state production",()=>{
    const blocked=buildP22ReleaseStatus({p21:p21(false),productionManifest:inactiveManifest(),generatedAt:"2026-10-06T15:00:00Z",commit:COMMIT});
    expect(blocked.decision).toBe("HOLD_P21_RELEASE_GATE");
    expect(blocked.productionActive).toBe(false);

    const ready=buildP22ReleaseStatus({p21:p21(true),productionManifest:inactiveManifest(),generatedAt:"2026-10-06T15:00:00Z",commit:COMMIT});
    expect(ready.decision).toBe("READY_TO_ACTIVATE");
    expect(ready.activationReady).toBe(true);
    expect(ready.productionStable).toBe(false);
  });

  it("treats maintenance mode as active production but never stable",()=>{
    const productionManifest={...activeManifest(),status:"maintenance",maintenanceMode:true};
    const report=buildP22ReleaseStatus({
      p21:p21(true),
      productionManifest,
      smoke:{healthy:true,expectedCommit:COMMIT},
      commit:COMMIT
    });
    expect(report.productionActive).toBe(true);
    expect(report.productionStable).toBe(false);
    expect(report.decision).toBe("PRODUCTION_MAINTENANCE");
  });

  it("blocks stable production while a release-blocking incident is open",()=>{
    const productionManifest={
      ...activeManifest(),
      knownIncidents:[{
        id:"inc-1",severity:"medium",status:"open",summary:"Offline reload is broken on the deployed PWA.",
        openedAt:"2026-10-06T14:30:00Z",resolvedAt:null,releaseBlocking:true
      }]
    };
    const report=buildP22ReleaseStatus({
      p21:p21(true),
      productionManifest,
      smoke:{healthy:true,expectedCommit:COMMIT},
      commit:COMMIT
    });
    expect(report.productionStable).toBe(false);
    expect(report.decision).toBe("HOLD_PRODUCTION_INCIDENT");
    expect(report.production.blockingIncidents).toHaveLength(1);
  });

  it("reports active production stable only with a healthy matching smoke check",()=>{
    const productionManifest=activeManifest();
    const healthySmoke={healthy:true,expectedCommit:COMMIT};
    const stable=buildP22ReleaseStatus({p21:p21(true),productionManifest,smoke:healthySmoke,commit:COMMIT});
    expect(stable.decision).toBe("PRODUCTION_STABLE");
    expect(stable.productionStable).toBe(true);

    const unhealthy=buildP22ReleaseStatus({p21:p21(true),productionManifest,smoke:{healthy:false,expectedCommit:COMMIT},commit:COMMIT});
    expect(unhealthy.decision).toBe("HOLD_PRODUCTION_MONITOR");
  });
});
