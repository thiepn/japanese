import { describe,expect,it } from "vitest";
import { normalizeJapaneseSearch,searchDocuments } from "../../packages/search/src/index";

describe("Japanese search",()=>{
  it("normalizes katakana to hiragana for lookup",()=>{ expect(normalizeJapaneseSearch("タベル")).toBe("たべる"); });
  it("finds a lexeme by English gloss",()=>{
    const results=searchDocuments("eat",[{entity:{kind:"lexeme",id:"lex-taberu"},title:"食べる",reading:"たべる",glosses:["to eat"]}]);
    expect(results[0]?.entity.id).toBe("lex-taberu");
  });
});
