import {describe,expect,it} from "vitest";
import {a1FuriganaParts,hasA1Furigana,isA1FuriganaStep,sentenceFuriganaParts} from "../../apps/web/src/study/a1Furigana";
import {coreContent} from "../../apps/web/src/coreContent";
import {vocabularyMeaningPrompts,vocabularyApplicationPrompts} from "../../apps/web/src/study/vocabulary";
import {sentenceComprehensionPrompts,sentenceProductionPrompts,grammarCourseLessons} from "../../apps/web/src/study/grammarCourse";
import type {Sentence} from "@thiepn/content-schema";

describe("F1 A1 furigana — display-only",()=>{
  it("respects complete canonical sentence token alignment and keeps punctuation",()=>{
    const sentence={
      text:"学校へ行きます。",
      tokens:[{surface:"学校",reading:"がっこう"},{surface:"へ"},{surface:"行きます",reading:"いきます"},{surface:"。"}]
    } as Sentence;
    expect(sentenceFuriganaParts(sentence)).toEqual([
      {surface:"学校",reading:"がっこう"},
      {surface:"へ"},
      {surface:"行きます",reading:"いきます"},
      {surface:"。"}
    ]);
    // Actual A1 source tokens omit sentence-final punctuation.
    const authentic=coreContent.sentences.find((item)=>item.id==="sentence-a1-001")!;
    expect(authentic.tokens.map((item)=>item.surface).join("")).toBe("学生です");
    expect(sentenceFuriganaParts(authentic)).toEqual([
      {surface:"学生",reading:"がくせい"},{surface:"です"},{surface:"。"}
    ]);
    expect(hasA1Furigana(authentic.text)).toBe(true);
    expect(sentenceFuriganaParts({...sentence,tokens:[{surface:"学校",reading:"がっこう"}]})).toEqual([
      {surface:"学校",reading:"がっこう"},{surface:"へ行きます。"}
    ]);
  });

  it("never guesses a reading for unannotated or kana-only tokens",()=>{
    const sentence={
      text:"今日ときょうです。",
      tokens:[{surface:"今日"},{surface:"と"},{surface:"きょう",reading:"きょう"},{surface:"です"},{surface:"。"}]
    } as Sentence;
    expect(sentenceFuriganaParts(sentence)).toEqual([
      {surface:"今日"},{surface:"と"},{surface:"きょう"},{surface:"です"},{surface:"。"}
    ]);
    expect(a1FuriganaParts("unlisted non-Japanese text")).toEqual([{surface:"unlisted non-Japanese text"}]);
    expect(hasA1Furigana("unlisted non-Japanese text")).toBe(false);
  });

  it("limits A1 display to lessons, meaning and comprehension, excluding recall and production",()=>{
    const vocab=vocabularyMeaningPrompts.find((item)=>coreContent.courseUnits.some((unit)=>unit.level==="A1"&&unit.vocabularyIds.includes(item.primaryTarget.id)));
    expect(vocab).toBeDefined();
    expect(isA1FuriganaStep(vocab!)).toBe(true);
    const recall=vocabularyApplicationPrompts.find((item)=>item.primaryTarget.id===vocab?.primaryTarget.id&&item.skill==="reading");
    expect(recall).toBeDefined();
    expect(isA1FuriganaStep(recall!)).toBe(false);

    const comprehension=sentenceComprehensionPrompts.find((item)=>coreContent.sentences.some((sentence)=>sentence.id===item.primaryTarget.id&&sentence.level==="A1"));
    expect(comprehension).toBeDefined();
    expect(isA1FuriganaStep(comprehension!)).toBe(true);
    expect(isA1FuriganaStep(sentenceProductionPrompts.find((item)=>item.primaryTarget.id===comprehension?.primaryTarget.id)!)).toBe(false);
    const lesson=grammarCourseLessons["sentence-context-"+comprehension?.primaryTarget.id];
    expect(lesson).toBeDefined();
    expect(isA1FuriganaStep(lesson)).toBe(true);
  });
  it("retains sparse A1 annotations and all omitted particles verbatim",()=>{
    const example=coreContent.sentences.find((item)=>item.id==="sentence-a1-023")!;
    const parts=sentenceFuriganaParts(example);
    expect(parts).toEqual([
      {surface:"これ"},{surface:"は"},{surface:"本",reading:"ほん"},{surface:"です。"}
    ]);
    expect(parts.map((part)=>part.surface).join("")).toBe(example.text);
    expect(hasA1Furigana(example.text)).toBe(true);
  });

  it("audits A1 source coverage rather than assuming full tokenization",()=>{
    const sentences=coreContent.sentences.filter((item)=>item.level==="A1");
    expect(sentences).toHaveLength(89);
    const covered=sentences.filter((item)=>hasA1Furigana(item.text));
    // Pure-kana sentences are not expected to generate ruby.
    expect(covered.length).toBeGreaterThanOrEqual(80);
    for(const sentence of sentences){
      const parts=a1FuriganaParts(sentence.text);
      expect(parts.map((item)=>item.surface).join("")).toBe(sentence.text);
      for(const part of parts){
        if(part.reading){
          expect(part.surface).toMatch(/[\u3400-\u9fff々]/u);
          expect(part.reading).toMatch(/^[\u3040-\u30ffー]+$/u);
        }
      }
    }
  });

  it("does not attach readings when a sparse token is not found in the sentence",()=>{
    const corrupt={
      text:"学校に行きます。",
      tokens:[{surface:"外国",reading:"がいこく"},{surface:"学校",reading:"がっこう"}]
    } as Sentence;
    expect(sentenceFuriganaParts(corrupt)).toEqual([{surface:corrupt.text}]);
  });

});
