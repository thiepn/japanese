import { describe,expect,it } from "vitest";
import { selectProviderCandidate,senseResolutionForIds } from "../../packages/japanese-nlp/src/index";

describe("P6 morphology contracts",()=>{
  it("keeps ambiguous senses explicit instead of pretending to disambiguate them",()=>{
    expect(senseResolutionForIds(["sense-a","sense-b"])).toBe("ambiguous");
    expect(senseResolutionForIds(["sense-a"])).toBe("single");
  });

  it("prefers provider-backed dictionary analysis when one is available",()=>{
    const chosen=selectProviderCandidate([
      {surface:"示した",lemma:"示す",lexemeId:"local",senseIds:["s1"],resolution:"deinflected",confidence:.9,senseResolution:"single"},
      {surface:"示した",lemma:"示す",lexemeId:"provider",senseIds:["s1"],resolution:"provider",confidence:.8,senseResolution:"provider-resolved",provider:"dictionary-fixture"}
    ]);
    expect(chosen).toMatchObject({resolution:"provider",provider:"dictionary-fixture"});
  });
});
