import { describe,expect,it } from "vitest";
import { conjugateLexeme,conjugationPrompts } from "../../apps/web/src/study/conjugation";
import { coreContent } from "../../apps/web/src/coreContent";

function lexeme(id:string){
  const item=coreContent.lexemes.find((value)=>value.id===id);
  if(!item)throw new Error(id);
  return item;
}

describe("P2.5 conjugation model",()=>{
  it("generates ichidan, godan and irregular verb forms",()=>{
    expect(conjugateLexeme(lexeme("lex-taberu"),"te_form")).toBe("食べて");
    expect(conjugateLexeme(lexeme("lex-nomu"),"plain_past")).toBe("飲んだ");
    expect(conjugateLexeme(lexeme("lex-kaku"),"polite_negative")).toBe("書きません");
    expect(conjugateLexeme(lexeme("lex-iku"),"te_form")).toBe("行って");
    expect(conjugateLexeme(lexeme("lex-kuru"),"polite_past")).toBe("来ました");
    expect(conjugateLexeme(lexeme("lex-benkyou-suru"),"plain_negative")).toBe("勉強しない");
    expect(conjugateLexeme(lexeme("lex-aru"),"plain_negative")).toBe("ない");
  });

  it("handles adjective paradigms including the いい exception",()=>{
    expect(conjugateLexeme(lexeme("lex-takai"),"polite_past")).toBe("高かったです");
    expect(conjugateLexeme(lexeme("lex-ii"),"polite_negative")).toBe("よくないです");
    expect(conjugateLexeme(lexeme("lex-shizuka"),"polite_past_negative")).toBe("静かじゃなかったです");
  });

  it("creates cue-specific form-selection prompts rather than stored phrase records",()=>{
    expect(conjugationPrompts.length).toBeGreaterThan(150);
    expect(conjugationPrompts.every((prompt)=>prompt.primaryTarget.kind==="lexeme"&&prompt.skill==="form_selection")).toBe(true);
    expect(new Set(conjugationPrompts.map((prompt)=>prompt.cueFamily))).toContain("conjugation-te_form");
    expect(new Set(conjugationPrompts.map((prompt)=>prompt.cueFamily))).toContain("conjugation-polite_past_negative");
  });
});
