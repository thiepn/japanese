import { describe,expect,it } from "vitest";
import { basicHiragana,foundationPrompts } from "../../apps/web/src/study/foundationPrompts";

describe("foundation kana curriculum",()=>{
  it("contains each of the 46 basic hiragana exactly once",()=>{
    expect(basicHiragana).toHaveLength(46);
    expect(new Set(basicHiragana.map((item)=>item.kana)).size).toBe(46);
  });
  it("includes common typing aliases for irregular Hepburn spellings",()=>{
    expect(basicHiragana.find((item)=>item.kana==="し")?.aliases).toContain("si");
    expect(basicHiragana.find((item)=>item.kana==="ち")?.aliases).toContain("ti");
    expect(basicHiragana.find((item)=>item.kana==="つ")?.aliases).toContain("tu");
    expect(basicHiragana.find((item)=>item.kana==="ふ")?.aliases).toContain("hu");
  });
  it("adds word bridges without bypassing the shared StudyPrompt contract",()=>{
    expect(foundationPrompts.some((prompt)=>prompt.primaryTarget.kind==="lexeme")).toBe(true);
  });
});
