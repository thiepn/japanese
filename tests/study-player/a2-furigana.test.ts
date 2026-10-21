import {describe,expect,it} from "vitest";
import {coreContent} from "../../apps/web/src/coreContent";
import {a2FuriganaParts,hasA2Furigana,isA2FuriganaStep} from "../../apps/web/src/study/a2Furigana";
import {grammarCourseLessons,grammarApplicationPrompts,sentenceComprehensionPrompts,sentenceProductionPrompts} from "../../apps/web/src/study/grammarCourse";
import {vocabularyApplicationPrompts,vocabularyMeaningPrompts} from "../../apps/web/src/study/vocabulary";
import {buildA1MilestoneAssessment} from "../../apps/web/src/study/assessment";

describe("F2 A2 canonical furigana",()=>{
  it("segments A2 corpus with linked lexeme evidence, preserves exact sentence text",()=>{
    const sentences=coreContent.sentences.filter((sentence)=>sentence.level==="A2");
    expect(sentences).toHaveLength(72);
    const withReading=sentences.filter((sentence)=>hasA2Furigana(sentence.text));
    // Coverage is measured, not simulated with all-kanji conversions.
    expect(withReading.length).toBeGreaterThanOrEqual(60);
    for(const sentence of sentences){
      const segments=a2FuriganaParts(sentence.text);
      expect(segments.map((segment)=>segment.surface).join("")).toBe(sentence.text);
      expect(segments.filter((item)=>item.reading).every((part)=>
        /^[\u3040-\u30ffー]+$/u.test(part.reading!)&&/[\u3400-\u9fff々]/u.test(part.surface)
      )).toBe(true);
    }
  });

  it("annotates canonical names, nouns and supported inflections without guessing absent words",()=>{
    const fragments=a2FuriganaParts("東京に住んでいます。");
    expect(fragments).toContainEqual({surface:"東京",reading:"とうきょう"});
    expect(fragments).toContainEqual({surface:"住んで",reading:"すんで"});
    expect(a2FuriganaParts("架空の未知語")).toEqual([{surface:"架空の未知語"}]);
    expect(hasA2Furigana("架空の未知語")).toBe(false);
  });

  it("enables grammar lessons, sentence lessons, meaning comprehension, and A2-only vocabulary",()=>{
    const grammar=grammarCourseLessons["grammar-context-grammar-te-iru"];
    expect(grammar).toBeDefined();
    expect(isA2FuriganaStep(grammar)).toBe(true);
    expect(grammar.examples?.some((example)=>hasA2Furigana(example.expression))).toBe(true);
    const sentence=grammarCourseLessons["sentence-context-sentence-a2-090"];
    expect(isA2FuriganaStep(sentence)).toBe(true);
    expect(hasA2Furigana(sentence.title)).toBe(true);
    const understood=sentenceComprehensionPrompts.find((prompt)=>prompt.primaryTarget.id==="sentence-a2-090")!;
    expect(isA2FuriganaStep(understood)).toBe(true);
    const vocab=vocabularyMeaningPrompts.find((prompt)=>prompt.primaryTarget.id==="lex-ongaku")!;
    expect(isA2FuriganaStep(vocab)).toBe(true);
  });

  it("never exposes furigana in cloze, reading recall, production, or assessments",()=>{
    expect(isA2FuriganaStep(grammarApplicationPrompts.find((item)=>item.primaryTarget.id==="grammar-te-iru")!)).toBe(false);
    expect(isA2FuriganaStep(sentenceProductionPrompts.find((item)=>item.primaryTarget.id==="sentence-a2-090")!)).toBe(false);
    const wordReading=vocabularyApplicationPrompts.find((item)=>item.primaryTarget.id==="lex-ongaku"&&item.skill==="reading")!;
    expect(isA2FuriganaStep(wordReading)).toBe(false);
    const fakeAssessment={...sentenceComprehensionPrompts.find((item)=>item.primaryTarget.id==="sentence-a2-090")!,id:"a2-milestone-sentence",skill:"comprehension" as const};
    expect(isA2FuriganaStep(fakeAssessment)).toBe(false);
  });
  it("does not misread unlinked kanji compounds using embedded known words",()=>{
    const compounds=["人気","人間","日本人","今年"];
    for(const compound of compounds){
      const parts=a2FuriganaParts(compound);
      expect(parts.map((part)=>part.surface).join("")).toBe(compound);
      expect(parts.filter((part)=>part.reading)).toHaveLength(0);
    }
    expect(a2FuriganaParts("東京に住んでいます。")).toContainEqual({surface:"東京",reading:"とうきょう"});
  });

});
