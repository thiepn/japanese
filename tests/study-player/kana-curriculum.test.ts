import { describe,expect,it } from "vitest";
import { allKanaSeeds,basicHiragana,basicKatakana,foundationApplicationPrompts,foundationPrompts,foundationSections,voicedHiragana,voicedKatakana,yoonHiragana,yoonKatakana } from "../../apps/web/src/study/foundationPrompts";

describe("complete kana foundation",()=>{
  it("contains both complete 46-character basic syllabaries",()=>{expect(basicHiragana).toHaveLength(46);expect(basicKatakana).toHaveLength(46);expect(new Set(basicHiragana.map((item)=>item.kana)).size).toBe(46);expect(new Set(basicKatakana.map((item)=>item.kana)).size).toBe(46);});
  it("contains voiced/semi-voiced and yoon inventories for both scripts",()=>{expect(voicedHiragana).toHaveLength(25);expect(voicedKatakana).toHaveLength(25);expect(yoonHiragana).toHaveLength(33);expect(yoonKatakana).toHaveLength(33);expect(allKanaSeeds).toHaveLength(208);});
  it("includes small-tsu and katakana long-vowel teaching targets",()=>{const ids=foundationPrompts.map((prompt)=>prompt.primaryTarget.id);expect(ids).toContain("hiragana-small-tsu");expect(ids).toContain("katakana-small-tsu");expect(ids).toContain("katakana-long-vowel-mark");});
  it("adds reading-recall and form-selection practice for every regular kana seed",()=>{const reading=foundationApplicationPrompts.filter((prompt)=>prompt.skill==="reading");const forms=foundationApplicationPrompts.filter((prompt)=>prompt.skill==="form_selection");expect(reading.length).toBeGreaterThanOrEqual(208);expect(forms.length).toBeGreaterThanOrEqual(208);expect(foundationApplicationPrompts.some((prompt)=>prompt.promptType==="typed"&&prompt.answerNormalization==="romaji")).toBe(true);});
  it("exposes all four foundation sections",()=>{expect(foundationSections.map((section)=>section.id)).toEqual(["hiragana-basic","hiragana-advanced","katakana-basic","katakana-advanced"]);expect(foundationSections.reduce((sum,section)=>sum+section.items,0)).toBe(210);});
});
