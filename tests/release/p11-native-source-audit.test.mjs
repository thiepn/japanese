import fs from "node:fs";
import { describe,expect,it } from "vitest";
import {
  auditReport,
  buildP9Inventory,
  validateNativeSourceRegistry
} from "../../scripts/p11-native-source-audit.mjs";
import { summarizeNativeInventory } from "../../scripts/p9-release-certify.mjs";

function registry(){
  return JSON.parse(fs.readFileSync("release/p11-native-sources.json","utf8"));
}

describe("P11.2 native corpus provenance audit",()=>{
  it("qualifies the checked-in verified registry for every P9 native-media threshold",()=>{
    const sourceRegistry=registry();
    const validation=validateNativeSourceRegistry(sourceRegistry);
    expect(validation.releaseMediaGateSatisfied).toBe(true);
    expect(validation.sources).toBeGreaterThanOrEqual(8);
    expect(validation.uniqueSpeakers).toBeGreaterThanOrEqual(3);
    expect(validation.registers.length).toBeGreaterThanOrEqual(2);
    expect(validation.speechRates).toContain("natural");
    expect(validation.speechRates).toContain("fast");

    const inventory=buildP9Inventory(sourceRegistry);
    const summary=summarizeNativeInventory(inventory);
    expect(summary.sourceDocuments).toBeGreaterThanOrEqual(4);
    expect(summary.recordings).toBeGreaterThanOrEqual(8);
    expect(summary.speakers).toBeGreaterThanOrEqual(3);
  });

  it("requires independent provenance URLs instead of accepting bare native/license labels",()=>{
    const sourceRegistry=registry();
    delete sourceRegistry.sources[0].nativeSpeakerEvidenceUrl;
    expect(()=>validateNativeSourceRegistry(sourceRegistry)).toThrow(/nativeSpeakerEvidenceUrl/);

    const second=registry();
    delete second.sources[0].licenseEvidenceUrl;
    expect(()=>validateNativeSourceRegistry(second)).toThrow(/licenseEvidenceUrl/);

    const third=registry();
    delete third.sources[0].contentEvidenceUrl;
    expect(()=>validateNativeSourceRegistry(third)).toThrow(/contentEvidenceUrl/);
  });

  it("rejects restricted licensing and short non-connected clips",()=>{
    const restricted=registry();
    restricted.sources[0].licenseName="CC BY-NC 4.0";
    expect(()=>validateNativeSourceRegistry(restricted)).toThrow(/LICENSE_NOT_ADMITTED/);

    const short=registry();
    short.sources[0].durationSeconds=12;
    expect(()=>validateNativeSourceRegistry(short)).toThrow(/CONNECTED_DURATION_REQUIRED/);
  });

  it("requires an explicit stretch-condition rationale before a source can satisfy the fast gate",()=>{
    const sourceRegistry=registry();
    const fast=sourceRegistry.sources.find((source)=>source.speechRate==="fast");
    expect(fast).toBeTruthy();
    fast.speechRateEvidence.stretchCondition=false;
    expect(()=>validateNativeSourceRegistry(sourceRegistry)).toThrow(/FAST_REQUIRES_STRETCH_EVIDENCE/);
  });

  it("requires every provenance checklist field to remain explicit",()=>{
    const sourceRegistry=registry();
    sourceRegistry.sources[0].verification.nativeSpeakerVerified=false;
    expect(()=>validateNativeSourceRegistry(sourceRegistry)).toThrow(/VERIFICATION_INCOMPLETE/);
  });

  it("detects hand-edited P9 inventory drift from the provenance registry",()=>{
    const sourceRegistry=registry();
    const inventory=buildP9Inventory(sourceRegistry);
    expect(auditReport(sourceRegistry,inventory).p9MediaGateReady).toBe(true);

    inventory.documents[0].recordings[0].url="https://example.invalid/replaced.ogg";
    const drift=auditReport(sourceRegistry,inventory);
    expect(drift.checkedInInventoryMatchesRegistry).toBe(false);
    expect(drift.p9MediaGateReady).toBe(false);
  });

  it("keeps checked-in inventory reproducible from the registry",()=>{
    const sourceRegistry=registry();
    const current=JSON.parse(fs.readFileSync("release/p9-native-inventory.json","utf8"));
    expect(current).toEqual(buildP9Inventory(sourceRegistry));
    expect(auditReport(sourceRegistry,current).p9MediaGateReady).toBe(true);
  });
});
