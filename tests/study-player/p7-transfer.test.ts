import { describe,expect,it } from "vitest";
import { findLexicalChunksInText } from "../../apps/web/src/immerse/authentic";
import { buildExtensiveTracks } from "../../apps/web/src/immerse/extensive";
import { coreContent } from "../../apps/web/src/coreContent";
import type { ImmersionProgress } from "../../apps/web/src/immerse/reader";

describe("P7 B2 transfer breadth",()=>{
  it("detects canonical lexical chunks inside connected authentic text",()=>{
    const chunks=findLexicalChunksInText("情報源を確認し、根拠を示しながら意見を述べることが大切です。");
    const expressions=new Set(chunks.map((chunk)=>chunk.expression));
    expect(expressions.has("情報源を確認する")).toBe(false);
    expect(expressions.has("根拠を示す")).toBe(true);
    expect(expressions.has("意見を述べる")).toBe(true);
  });

  it("builds advisory extensive tracks from canonical B2 texts without locking content",()=>{
    const progress:ImmersionProgress={
      texts:coreContent.readingTexts.map((text)=>({
        id:text.id,title:text.title,description:text.description,level:text.level,kind:text.kind,estimatedMinutes:text.estimatedMinutes,
        readiness:text.tags.includes("p7") ? .82 : .5,knownWords:5,totalWords:8,readingMastery:0,listeningMastery:0,readingEvidence:0,listeningEvidence:0
      })),
      minedWords:0,lookups:0,readingChecks:0,listeningChecks:0
    };
    const tracks=buildExtensiveTracks(progress);
    expect(tracks.length).toBeGreaterThanOrEqual(4);
    expect(tracks.every((track)=>track.total>=1&&track.nextText)).toBe(true);
    expect(tracks.some((track)=>track.title.includes("Work"))).toBe(true);
  });
});
