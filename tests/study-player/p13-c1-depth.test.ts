import { describe,expect,it } from "vitest";
import { buildSystemPrompt } from "../../services/api/src/ai-coach";
import { scenarioChainsForLevel } from "../../apps/web/src/ai/scenarioChains";
import { c1NativeSourceSets,c1NativeSources,c1NativeSourceSet } from "../../apps/web/src/study/c1NativeDepth";
import { buildC1SynthesisSession,c1SynthesisPacks,c1SynthesisPrompt } from "../../apps/web/src/study/c1Synthesis";

describe("P13 C1 native depth, multi-source synthesis and spontaneous interaction",()=>{
  it("uses only repository-verified native sources in the P13 depth sets",()=>{
    expect(c1NativeSources).toHaveLength(8);
    expect(c1NativeSources.every((source)=>source.verified)).toBe(true);
    expect(new Set(c1NativeSources.map((source)=>source.recording.speakerLabel)).size).toBeGreaterThanOrEqual(5);
    expect(new Set(c1NativeSources.map((source)=>source.recording.register))).toEqual(new Set(["formal","polite"]));
    expect(new Set(c1NativeSources.map((source)=>source.recording.speechRate))).toEqual(new Set(["fast","natural"]));
    for(const set of c1NativeSourceSets){
      expect(set.sourceIds.length).toBeGreaterThanOrEqual(2);
      expect(set.targetMoves.length).toBeGreaterThanOrEqual(3);
      for(const id of set.sourceIds)expect(c1NativeSources.some((source)=>source.id===id)).toBe(true);
    }
    expect(c1NativeSourceSet("p13-native-register-shift").sourceIds).toHaveLength(2);
  });

  it("ships six multi-source C1 synthesis packs that reuse canonical C1 texts",()=>{
    expect(c1SynthesisPacks).toHaveLength(6);
    for(const pack of c1SynthesisPacks){
      expect(pack.sourceTextIds.length).toBeGreaterThanOrEqual(2);
      expect(pack.requiredMoves).toHaveLength(3);
      expect(pack.requiredTerms).toHaveLength(3);
      const prompt=c1SynthesisPrompt(pack);
      expect(prompt.eventMetadata).toMatchObject({
        p13MultiSourceSynthesis:true,
        synthesisPackId:pack.id,
        semanticGrading:false,
        structuralResultOnly:true,
        accreditedCefrVerdict:false
      });
      expect(prompt.primaryTarget.kind).toBe("text");
    }
  });

  it("builds synthesis through the normal StudyPlayer contract",()=>{
    const session=buildC1SynthesisSession("p13-synthesis-evidence-causality");
    expect(session).toHaveLength(2);
    expect(session[0]).toMatchObject({kind:"lesson",id:"lesson-p13-synthesis-evidence-causality"});
    expect(session[1]).toMatchObject({id:"prompt-p13-synthesis-evidence-causality",promptType:"textarea",languageActivity:"writing"});
  });

  it("keeps the five original P13 hidden-future interaction chains intact",()=>{
    const originalIds=["c1-policy-briefing","c1-research-defense","c1-institutional-negotiation","c1-public-interview","c1-cross-domain-transfer"];
    const chains=scenarioChainsForLevel("C1").filter((chain)=>originalIds.includes(chain.id));
    expect(chains).toHaveLength(5);
    for(const chain of chains){
      expect(chain.level).toBe("C1");
      expect(chain.interactionStyle).toBe("spontaneous");
      expect(chain.hiddenFutureStages).toBe(true);
      expect(chain.stages).toHaveLength(5);
      expect(chain.stages.map((stage)=>stage.id)).toEqual(["position","probe","pressure","repair","synthesis"]);
      expect(chain.stages.slice(1).every((stage)=>Boolean(stage.pressure))).toBe(true);
      expect(chain.stages.every((stage)=>stage.goals.length>=3)).toBe(true);
    }
  });

  it("instructs the server coach to behave as an interlocutor at C1 instead of previewing hidden goals",()=>{
    const system=buildSystemPrompt({
      sessionId:"p13-c1",
      mode:"conversation",
      targetLevel:"C1",
      learnerText:"現時点では断定できません。",
      history:[],
      scenario:"Defend a qualified recommendation.",
      goals:["state a caveat","answer the challenge"],
      register:"polite",
      interactionStyle:"spontaneous"
    });
    expect(system).toContain("Target level: C1");
    expect(system).toContain("act as the interlocutor first");
    expect(system).toContain("do not preview future challenges");
    expect(system).toContain("Interaction style: spontaneous");
  });
});
