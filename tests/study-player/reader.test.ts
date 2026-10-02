import { describe,expect,it } from "vitest";
import { buildReaderText,segmentSentence } from "../../apps/web/src/immerse/reader";
import { coreContent,sentenceRecord } from "../../apps/web/src/coreContent";

describe("P7 graded reader",()=>{
  it("ships a canonical A1→B2 connected-reading path",()=>{
    expect(coreContent.readingTexts).toHaveLength(42);
    expect(coreContent.readingTexts.map((text)=>text.level)).toContain("A2-entry");
    expect(coreContent.readingTexts.map((text)=>text.level)).toContain("A2");
    expect(coreContent.readingTexts.map((text)=>text.level)).toContain("B1");
    expect(coreContent.readingTexts.map((text)=>text.level)).toContain("B2");
    expect(coreContent.readingTexts.filter((text)=>text.level==="B2")).toHaveLength(20);
    expect(coreContent.readingTexts.every((text)=>text.sentenceIds.length>=5&&text.comprehensionQuestions.length>=2)).toBe(true);
    const p7=coreContent.readingTexts.filter((text)=>text.tags.includes("p7"));
    expect(p7).toHaveLength(12);
    expect(p7.every((text)=>text.listeningSegments?.length===text.sentenceIds.length&&text.comprehensionQuestions.length===3)).toBe(true);
  });

  it("builds reader views from the existing sentence graph rather than duplicate prose",()=>{
    const view=buildReaderText("text-a1-morning");
    expect(view.sentences).toHaveLength(5);
    expect(view.sentences[0]?.sentence.id).toBe("sentence-a1-043");
    expect(view.joinedJapanese).toContain("毎日七時に起きます。");
  });

  it("recognizes generated inflected forms as linked lexemes",()=>{
    const routine=segmentSentence(sentenceRecord("sentence-a1-043"));
    expect(routine.some((token)=>token.lexemeId==="lex-okiru"&&token.surface==="起きます")).toBe(true);
    const negativePast=segmentSentence(sentenceRecord("sentence-a1-047"));
    expect(negativePast.some((token)=>token.lexemeId==="lex-benkyou-suru"&&token.surface==="勉強しませんでした")).toBe(true);
  });

  it("keeps comprehension questions attached to text-level evidence",()=>{
    const text=coreContent.readingTexts.find((item)=>item.id==="text-a1-shopping");
    expect(text?.comprehensionQuestions[0]?.answer).toBe("300 yen");
    expect(text?.targetLexemeIds).toContain("lex-ikura");
    expect(text?.grammarIds.length).toBeGreaterThan(0);
  });
});
