import { describe,expect,it } from "vitest";
import { getReleaseIdentity } from "../../apps/web/src/study/ReleaseIdentityPanel";

describe("P22 deployment identity",()=>{
  it("accepts a well-formed stable release identity",async()=>{
    const identity=await getReleaseIdentity(async()=>new Response(JSON.stringify({
      schema:"thiepn-japanese-release-meta",
      schemaVersion:1,
      phase:"P22",
      channel:"stable",
      commit:"a".repeat(40),
      builtAt:"2026-10-06T14:00:00Z"
    }),{status:200,headers:{"content-type":"application/json"}}));
    expect(identity?.channel).toBe("stable");
    expect(identity?.commit).toBe("a".repeat(40));
  });

  it("fails closed on malformed or unsupported release metadata",async()=>{
    const malformed=await getReleaseIdentity(async()=>new Response(JSON.stringify({
      schema:"wrong-schema",
      schemaVersion:1,
      phase:"P22",
      channel:"stable",
      commit:"a".repeat(40),
      builtAt:"2026-10-06T14:00:00Z"
    }),{status:200}));
    expect(malformed).toBeNull();

    const invalidCommit=await getReleaseIdentity(async()=>new Response(JSON.stringify({
      schema:"thiepn-japanese-release-meta",
      schemaVersion:1,
      phase:"P22",
      channel:"stable",
      commit:"short",
      builtAt:"not-a-date"
    }),{status:200}));
    expect(invalidCommit).toBeNull();
  });
});
