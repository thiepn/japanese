import { describe,expect,it } from "vitest";
import { c1NativeSources,c1SynthesisMissions } from "../../apps/web/src/immerse/c1NativeSources";
import { c1InteractionScenarios } from "../../apps/web/src/study/c1Interaction";

describe("P13 C1 native-source depth and spontaneous interaction",()=>{
  it("reuses only provenance-audited P11.2 native sources for C1 source work",()=>{
    expect(c1NativeSources).toHaveLength(8);
    expect(new Set(c1NativeSources.map(source=>source.id)).size).toBe(8);
    expect(c1NativeSources.every(source=>source.licenseName&&source.attributionUrl&&source.mediaUrl)).toBe(true);
    expect(c1NativeSources.every(source=>["polite","formal"].includes(source.register))).toBe(true);
    expect(c1NativeSources.some(source=>source.speechRate==="fast")).toBe(true);
    expect(c1NativeSources.some(source=>source.speechRate==="natural")).toBe(true);
  });

  it("defines multi-source C1 synthesis missions with real independent source combinations",()=>{
    expect(c1SynthesisMissions).toHaveLength(4);
    const ids=new Set(c1NativeSources.map(source=>source.id));
    for(const mission of c1SynthesisMissions){
      expect(mission.sourceIds.length).toBeGreaterThanOrEqual(2);
      expect(new Set(mission.sourceIds).size).toBe(mission.sourceIds.length);
      expect(mission.sourceIds.every(id=>ids.has(id))).toBe(true);
      expect(mission.requiredMoves.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("defines hidden-stage spontaneous interaction across multiple C1 domains",()=>{
    expect(c1InteractionScenarios).toHaveLength(4);
    expect(new Set(c1InteractionScenarios.map(s=>s.domain)).size).toBe(4);
    for(const scenario of c1InteractionScenarios){
      expect(scenario.stages).toHaveLength(4);
      expect(scenario.stages.every(stage=>stage.targetSeconds>=25&&stage.targetSeconds<=60)).toBe(true);
      expect(scenario.stages.every(stage=>stage.moves.length>=2)).toBe(true);
    }
  });

  it("requires challenge progression beyond prepared monologue",()=>{
    const stages=c1InteractionScenarios.flatMap(s=>s.stages);
    expect(stages.some(stage=>/challenge|objection|interrupt|misread|binary/i.test(stage.title))).toBe(true);
    expect(stages.some(stage=>/repair|reframe|respond/i.test(stage.prompt))).toBe(true);
    expect(stages.some(stage=>stage.moves.includes("counterargument"))).toBe(true);
    expect(stages.some(stage=>stage.moves.includes("accountability"))).toBe(true);
  });
});
