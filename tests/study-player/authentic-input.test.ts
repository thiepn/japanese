import { afterEach,describe,expect,it,vi } from "vitest";
import { analyzeAuthenticText,extractSubtitleText,importTatoebaSentence,isAllowedReusableAudioLicense,lemmatizeJapaneseSurface,normalizeImportedText,resolveJapaneseSurface,splitJapaneseSentences } from "../../apps/web/src/immerse/authentic";

afterEach(()=>{
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("P4 authentic-input pipeline",()=>{
  it("segments arbitrary Japanese and links known canonical or inflected forms",()=>{
    const analysis=analyzeAuthenticText("来週は東京に行きたいです。知らない単語もあります。");
    expect(analysis.tokens.some((token)=>token.kind==="known"&&token.lexemeId==="lex-raishuu")).toBe(true);
    expect(analysis.tokens.some((token)=>token.kind==="known"&&token.lexemeId==="lex-tokyo")).toBe(true);
    expect(analysis.tokens.some((token)=>token.kind==="known"&&token.lexemeId==="lex-iku")).toBe(true);
    expect(analysis.unknownTypes.length).toBeGreaterThan(0);
    expect(analysis.knownRatio).toBeGreaterThan(0);
    expect(analysis.knownRatio).toBeLessThan(1);
  });

  it("lemmatizes common B1 derived forms back to canonical dictionary identities",()=>{
    expect(lemmatizeJapaneseSurface("続けられる")).toMatchObject({lexemeId:"lex-tsuzukeru",baseForm:"続ける",resolution:"deinflected"});
    expect(lemmatizeJapaneseSurface("考えれば")).toMatchObject({lexemeId:"lex-kangaeru",baseForm:"考える"});
    expect(splitJapaneseSentences("今日は忙しいです。でも、行きます！")).toEqual(["今日は忙しいです。","でも、行きます！"]);
  });

  it("resolves additional B2 forms with explicit confidence and sense identity",()=>{
    expect(lemmatizeJapaneseSurface("認めさせられる")).toMatchObject({lexemeId:"b2-acknowledge",baseForm:"認める",resolution:"deinflected"});
    expect(lemmatizeJapaneseSurface("取り組むことになる")).toMatchObject({lexemeId:"b2-address",baseForm:"取り組む"});
    const resolution=resolveJapaneseSurface("示す");
    expect(resolution).toMatchObject({lexemeId:"b2-indicate",senseResolution:"single"});
    expect(resolution?.senseIds.length).toBeGreaterThan(0);
    expect(resolution?.confidence).toBeGreaterThan(.9);
  });

  it("strips SRT/VTT timing while preserving Japanese dialogue",()=>{
    const raw=`1
00:00:01,000 --> 00:00:03,000
こんにちは。

2
00:00:04,000 --> 00:00:06,000
駅はどこですか。`;
    const cleaned=extractSubtitleText(raw);
    expect(cleaned).toContain("こんにちは。");
    expect(cleaned).toContain("駅はどこですか。");
    expect(cleaned).not.toContain("-->");
    expect(normalizeImportedText(raw,"subtitle")).not.toContain("00:00");
  });

  it("rejects invalid Tatoeba IDs before any network request",async()=>{
    const fetch=vi.fn();
    vi.stubGlobal("fetch",fetch);
    await expect(importTatoebaSentence("1234567890123")).rejects.toThrow("TATOEBA_ID_REQUIRED");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("fails closed when the Tatoeba API does not respond",async()=>{
    vi.useFakeTimers();
    vi.stubGlobal("fetch",vi.fn((_input:RequestInfo|URL,init?:RequestInit)=>new Promise<Response>((_resolve,reject)=>{
      const signal=init?.signal;
      signal?.addEventListener("abort",()=>reject(new Error("aborted")),{once:true});
    })));
    const expectation=expect(importTatoebaSentence("432825")).rejects.toThrow("TATOEBA_FETCH_TIMEOUT");
    await vi.advanceTimersByTimeAsync(10_001);
    await expectation;
  });

  it("admits reusable CC licenses and rejects missing, NC and ND audio",()=>{
    expect(isAllowedReusableAudioLicense("CC0 1.0")).toBe(true);
    expect(isAllowedReusableAudioLicense("CC BY 4.0")).toBe(true);
    expect(isAllowedReusableAudioLicense("CC BY-SA 4.0")).toBe(true);
    expect(isAllowedReusableAudioLicense("CC BY-NC 4.0")).toBe(false);
    expect(isAllowedReusableAudioLicense("CC BY-ND 4.0")).toBe(false);
    expect(isAllowedReusableAudioLicense("")).toBe(false);
  });
});
