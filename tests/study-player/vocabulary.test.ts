import { describe,expect,it } from "vitest";
import { coreContent,starterLexemes } from "../../apps/web/src/coreContent";
import { starterVocabulary,vocabularyApplicationPrompts,vocabularyMeaningPrompts,vocabularyLessons } from "../../apps/web/src/study/vocabulary";

describe("production A1→A2 vocabulary",()=>{
  it("ships a source-provenanced starter lexicon",()=>{
    expect(starterLexemes).toHaveLength(274);
    expect(coreContent.version).toBe("0.6.0");
    expect(starterLexemes.every((lexeme)=>lexeme.sourceIds.includes("thiepn-original"))).toBe(true);
    expect(coreContent.senses.every((sense)=>sense.sourceIds.includes("thiepn-original"))).toBe(true);
    expect(coreContent.kanji.every((kanji)=>kanji.sourceIds.includes("thiepn-original"))).toBe(true);
  });
  it("keeps every kanji link resolvable to a canonical kanji entity",()=>{
    const ids=new Set(coreContent.kanji.map((kanji)=>kanji.id));
    for(const lexeme of starterLexemes)for(const link of lexeme.kanjiLinks)expect(ids.has(link.kanjiId)).toBe(true);
  });
  it("teaches kanji through lexemes rather than isolated kanji review cards",()=>{
    expect([...vocabularyMeaningPrompts,...vocabularyApplicationPrompts].every((prompt)=>prompt.primaryTarget.kind==="lexeme")).toBe(true);
    const lesson=vocabularyLessons["vocab-lex-taberu"];
    expect(lesson?.examples?.some((example)=>example.expression.startsWith("食"))).toBe(true);
    expect(lesson?.audio?.id).toBe("audio-lex-taberu");
  });
  it("creates meaning, reading and active-use evidence for every word and listening evidence only when audio exists",()=>{
    for(const item of starterVocabulary){
      const prompts=[...vocabularyMeaningPrompts,...vocabularyApplicationPrompts].filter((prompt)=>prompt.primaryTarget.id===item.lexeme.id);
      const skills=new Set(prompts.map((prompt)=>prompt.skill));
      expect(skills).toContain("meaning_recognition");
      expect(skills).toContain("reading");
      expect(skills).toContain("active_use");
      expect(skills.has("audio_recognition")).toBe(item.lexeme.audioIds.length>0);
    }
  });
  it("does not invent per-character readings for whole-word readings such as 今日",()=>{
    const kyou=starterLexemes.find((lexeme)=>lexeme.id==="lex-kyou");
    expect(kyou?.readings[0]?.text).toBe("きょう");
    expect(kyou?.kanjiLinks.every((link)=>link.readingInWord===undefined)).toBe(true);
    expect(kyou?.kanjiLinks[0]?.readingNote).toContain("word-level reading");
  });
  it("carries source and content version onto study prompts",()=>{
    const prompt=vocabularyMeaningPrompts.find((item)=>item.primaryTarget.id==="lex-taberu");
    expect(prompt?.sourceId).toBe("thiepn-original");
    expect(prompt?.contentVersion).toBe("0.6.0");
  });
});
