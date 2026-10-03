import { describe,expect,it } from "vitest";
import { createHttpJapaneseMorphologyProvider,parseMorphologyAnalysis,selectProviderCandidate,senseResolutionForIds } from "../../packages/japanese-nlp/src/index";
import { createMorphologyFetchHandler } from "../../services/api/src/morphology";

describe("P8 morphology contracts and observability",()=>{
  it("keeps ambiguous senses explicit instead of pretending to disambiguate them",()=>{
    expect(senseResolutionForIds(["sense-a","sense-b"])).toBe("ambiguous");
    expect(senseResolutionForIds(["sense-a"])).toBe("single");
  });

  it("validates a real provider payload instead of trusting a dictionary-grade label blindly",()=>{
    const analysis=parseMorphologyAnalysis({
      provider:"sudachi",dictionaryGrade:true,tokens:[{
        surface:"示した",start:0,end:3,candidates:[{surface:"示した",lemma:"示す",senseIds:[],resolution:"provider",confidence:.97,senseResolution:"none"}]
      }]
    },"示した","sudachi");
    expect(analysis).toMatchObject({provider:"sudachi",dictionaryGrade:true});
    expect(analysis.tokens[0]?.candidates[0]).toMatchObject({lemma:"示す",resolution:"provider"});
    expect(()=>parseMorphologyAnalysis({provider:"fake",dictionaryGrade:false,tokens:[]},"示した")).toThrow(/NOT_DICTIONARY_GRADE/);
  });

  it("uses the HTTP provider contract and preserves server provider identity",async()=>{
    const provider=createHttpJapaneseMorphologyProvider("https://example.test/morphology",{providerId:"sudachi",fetchImpl:async()=>new Response(JSON.stringify({
      provider:"sudachi",dictionaryGrade:true,tokens:[{surface:"制度",start:0,end:2,candidates:[{surface:"制度",lemma:"制度",lexemeId:"b2-system",senseIds:["s"],confidence:.99,senseResolution:"provider-resolved"}]}]
    }),{status:200,headers:{"content-type":"application/json"}})});
    const result=await provider.analyze("制度");
    expect(result.provider).toBe("sudachi");
    expect(result.tokens[0]?.candidates[0]).toMatchObject({lexemeId:"b2-system",resolution:"provider"});
  });

  it("reports dictionary-provider health independently of tokenization requests",async()=>{
    let tokenizations=0;
    const handler=createMorphologyFetchHandler({
      provider:"fixture-dictionary",
      tokenize(){tokenizations+=1;return [];},
      healthCheck(){return {ok:true,detail:"dictionary loaded"};}
    });
    const response=await handler(new Request("https://example.test/api/japanese/morphology",{method:"GET"}));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({service:"japanese-morphology",status:"ok",provider:"fixture-dictionary",dictionaryGrade:true,operational:true});
    expect(tokenizations).toBe(0);
  });

  it("prefers provider-backed dictionary analysis when one is available",()=>{
    const chosen=selectProviderCandidate([
      {surface:"示した",lemma:"示す",lexemeId:"local",senseIds:["s1"],resolution:"deinflected",confidence:.9,senseResolution:"single"},
      {surface:"示した",lemma:"示す",lexemeId:"provider",senseIds:["s1"],resolution:"provider",confidence:.8,senseResolution:"provider-resolved",provider:"dictionary-fixture"}
    ]);
    expect(chosen).toMatchObject({resolution:"provider",provider:"dictionary-fixture"});
  });
});
