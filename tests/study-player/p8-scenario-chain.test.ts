import { describe,expect,it } from "vitest";
import { scenarioChain,scenarioChainsForLevel } from "../../apps/web/src/ai/scenarioChains";

describe("P8 sustained interaction scenario chains",()=>{
  it("ships several four-stage B2 chains with planning, clarification, repair and follow-up",()=>{
    const scenarioChains=scenarioChainsForLevel("B2");
    expect(scenarioChains.length).toBeGreaterThanOrEqual(4);
    for(const chain of scenarioChains){
      expect(chain.level).toBe("B2");
      expect(chain.interactionStyle).toBe("guided");
      expect(chain.stages).toHaveLength(4);
      expect(chain.stages.map((stage)=>stage.id)).toEqual(["plan","clarify","repair","follow-up"]);
      expect(chain.stages.every((stage)=>stage.goals.length>=3&&stage.scenario.length>20)).toBe(true);
    }
  });
  it("resolves stable chain identities",()=>{
    expect(scenarioChain("media-claim").title).toMatch(/online claim/i);
    expect(()=>scenarioChain("missing")).toThrow(/UNKNOWN_SCENARIO_CHAIN/);
  });
});
