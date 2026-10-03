import { describe,expect,it } from "vitest";
import { getProviderHealthSnapshot } from "../../apps/web/src/providerHealth";

describe("P9 provider outage fallback",()=>{
  it("reports the AI coach unreachable without converting provider failure into learner evidence",async()=>{
    const fetchImpl=(async()=>{throw new Error("offline");}) as typeof fetch;
    const snapshot=await getProviderHealthSnapshot(fetchImpl);
    const coach=snapshot.find((item)=>item.id==="coach");
    const morphology=snapshot.find((item)=>item.id==="morphology");
    expect(coach).toMatchObject({state:"unreachable",operational:false});
    expect(morphology?.state).toBe("unconfigured");
  });
});
