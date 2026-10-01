import { describe,expect,it } from "vitest";
import { coreContent,starterLexemes } from "../../apps/web/src/coreContent";
import { pronunciationPerceptionPrompts } from "../../apps/web/src/study/audioPrompts";
import { vocabularyListeningPrompts } from "../../apps/web/src/study/vocabulary";

describe("P1.5 production audio",()=>{
  it("maps every starter lexeme to one pinned native recording",()=>{
    expect(vocabularyListeningPrompts).toHaveLength(starterLexemes.length);
    const ids=new Set(coreContent.audioAssets.map((asset)=>asset.id));
    for(const lexeme of starterLexemes){
      expect(lexeme.audioIds).toHaveLength(1);
      expect(ids.has(lexeme.audioIds[0]!)).toBe(true);
    }
  });
  it("pins recordings to the verified Tofugu/WaniKani source commit",()=>{
    for(const asset of coreContent.audioAssets){
      expect(asset.sourceIds).toContain("tofugu-wanikani-audio");
      expect(asset.url).toContain("9725e0e7d628ab616e8b14e126d3daa33eba8d36");
      expect(asset.url.endsWith(".ogg")).toBe(true);
    }
  });
  it("ships explicit perception tasks for hiragana っ, katakana ッ, long vowels and moraic n",()=>{
    expect(pronunciationPerceptionPrompts.map((prompt)=>prompt.cueFamily)).toEqual([
      "sokuon-audio-discrimination","katakana-sokuon-audio-discrimination","long-vowel-audio-discrimination","moraic-n-audio-discrimination"
    ]);
    expect(pronunciationPerceptionPrompts.every((prompt)=>Boolean(prompt.audio))).toBe(true);
  });
  it("never exposes the audio transcript in the listening prompt cue",()=>{
    for(const prompt of vocabularyListeningPrompts){
      expect(prompt.audio).toBeDefined();
      expect(prompt.prompt).not.toContain(prompt.audio!.text);
      if(prompt.audio!.reading)expect(prompt.prompt).not.toContain(prompt.audio!.reading!);
    }
  });
});
