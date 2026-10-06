import { describe,expect,it } from "vitest";
import { ALLOWED_P22_CHANGE_TYPES,summarizeMaintenanceManifest } from "../../scripts/p22-maintenance-validate.mjs";

const COMMIT="c".repeat(40);

function manifest(entries=[]){
  return {
    schema:"thiepn-japanese-p22-maintenance",
    schemaVersion:1,
    policy:"defect-only",
    capabilityFreeze:"P20",
    entries
  };
}

describe("P22 defect-only maintenance policy",()=>{
  it("keeps the allowed maintenance classes narrow",()=>{
    expect(ALLOWED_P22_CHANGE_TYPES).toEqual([
      "defect","security","privacy","accessibility","dependency","content_correction","reliability","operations"
    ]);
  });

  it("accepts an explicitly scoped verified defect fix",()=>{
    const summary=summarizeMaintenanceManifest(manifest([{
      id:"m-1",
      changeType:"defect",
      summary:"Fix unreachable mobile action after rotation.",
      commit:COMMIT,
      risk:"medium",
      status:"verified",
      regressionScope:["mobile navigation","rotation","study controls"],
      requiresPhysicalDeviceRetest:true,
      capabilityExpansion:false
    }]));
    expect(summary.open).toBe(1);
    expect(summary.physicalRetestRequired).toBe(1);
  });

  it("rejects feature expansion disguised as maintenance",()=>{
    expect(()=>summarizeMaintenanceManifest(manifest([{
      id:"m-2",
      changeType:"feature",
      summary:"Add a new proficiency layer.",
      commit:COMMIT,
      risk:"high",
      status:"planned",
      regressionScope:["new feature"],
      requiresPhysicalDeviceRetest:true,
      capabilityExpansion:true
    }]))).toThrow(/CHANGE_TYPE_INVALID|CAPABILITY_EXPANSION_FORBIDDEN/);
  });

  it("requires released entries to carry a real release timestamp",()=>{
    const entry={
      id:"m-3",
      changeType:"security",
      summary:"Tighten release metadata validation.",
      commit:COMMIT,
      risk:"high",
      status:"released",
      regressionScope:["release activation"],
      requiresPhysicalDeviceRetest:false,
      capabilityExpansion:false
    };
    expect(()=>summarizeMaintenanceManifest(manifest([entry]))).toThrow("P22_MAINTENANCE_RELEASE_DATE_INVALID:m-3");
  });
});
