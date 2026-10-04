import { describe,expect,it } from "vitest";
import { coreContent,lexicalChunks } from "../../apps/web/src/coreContent";
import { lexicalChunkActivePrompts,lexicalChunkLessons,lexicalChunkMeaningPrompts,lexicalChunkTransferPrompts,lexicalFluencySession } from "../../apps/web/src/study/lexicalFluency";

describe("P8 lexical and collocational fluency",()=>{
  it("ships first-class B2 lexical chunks instead of inferring fluency from single words",()=>{
    expect(coreContent.lexicalChunks).toHaveLength(152);
    const b2=lexicalChunks.filter((chunk)=>chunk.level==="B2");
    expect(b2).toHaveLength(120);
    expect(b2.every((chunk)=>chunk.tags?.includes("collocation"))).toBe(true);
    expect(lexicalChunks.filter((chunk)=>chunk.level==="C1")).toHaveLength(32);
    expect(lexicalChunks.some((chunk)=>chunk.expression==="影響を与える")).toBe(true);
    expect(lexicalChunks.some((chunk)=>chunk.expression==="合意に達する")).toBe(true);
    expect(lexicalChunks.some((chunk)=>chunk.expression==="根拠を示す")).toBe(true);
  });

  it("keeps chunk references attached to canonical lexemes, grammar and sentences",()=>{
    const lexemeIds=new Set(coreContent.lexemes.map((item)=>item.id));
    const grammarIds=new Set(coreContent.grammar.map((item)=>item.id));
    const sentenceIds=new Set(coreContent.sentences.map((item)=>item.id));
    for(const chunk of lexicalChunks){
      expect(chunk.lexemeIds.every((id)=>lexemeIds.has(id))).toBe(true);
      expect(chunk.grammarIds.every((id)=>grammarIds.has(id))).toBe(true);
      expect(chunk.exampleSentenceIds.every((id)=>sentenceIds.has(id))).toBe(true);
    }
  });

  it("creates separate recognition and active-use evidence for every chunk",()=>{
    expect(lexicalChunkMeaningPrompts).toHaveLength(152);
    expect(lexicalChunkActivePrompts).toHaveLength(152);
    expect(lexicalChunkMeaningPrompts.every((prompt)=>prompt.primaryTarget.kind==="lexical_chunk"&&prompt.skill==="meaning_recognition")).toBe(true);
    expect(lexicalChunkActivePrompts.every((prompt)=>prompt.primaryTarget.kind==="lexical_chunk"&&prompt.skill==="active_use")).toBe(true);
  });

  it("adds register and phrase-family transfer without replacing chunk recognition/production",()=>{
    expect(lexicalChunkTransferPrompts).toHaveLength(18);
    expect(lexicalChunkTransferPrompts.every((prompt)=>prompt.skill==="form_selection"&&prompt.cueFamily==="chunk-register-transfer")).toBe(true);
    expect(lexicalChunkTransferPrompts.some((prompt)=>prompt.acceptedAnswers.includes("根拠を示す"))).toBe(true);
    expect(lexicalChunkTransferPrompts.some((prompt)=>prompt.acceptedAnswers.includes("情報源を確認する"))).toBe(true);
  });

  it("provides first-exposure lessons and reusable normal-study sessions",()=>{
    const first=lexicalChunks[0]!;
    expect(lexicalChunkLessons["chunk-"+first.id]?.title).toBe(first.expression);
    const session=lexicalFluencySession(8);
    expect(session.length).toBeGreaterThanOrEqual(16);
    expect(new Set(session.map((prompt)=>prompt.primaryTarget.id)).size).toBe(8);
  });
});
