import { describe,expect,it } from "vitest";
import { isApplicationPromptReady } from "../../apps/web/src/study/runtime";
import { vocabularyApplicationPrompts } from "../../apps/web/src/study/vocabulary";

describe("vocabulary skill staging",()=>{
  const reading=vocabularyApplicationPrompts.find((prompt)=>prompt.primaryTarget.id==="lex-taberu"&&prompt.skill==="reading");
  const listening=vocabularyApplicationPrompts.find((prompt)=>prompt.primaryTarget.id==="lex-taberu"&&prompt.skill==="audio_recognition");
  const active=vocabularyApplicationPrompts.find((prompt)=>prompt.primaryTarget.id==="lex-taberu"&&prompt.skill==="active_use");

  it("unlocks reading only after meaning evidence",()=>{
    expect(reading).toBeDefined();
    const none=new Set<string>();
    expect(isApplicationPromptReady(reading!,none)).toBe(false);
    const meaning=new Set(["lexeme:lex-taberu:meaning_recognition:written-to-meaning"]);
    expect(isApplicationPromptReady(reading!,meaning)).toBe(true);
  });

  it("unlocks listening only after meaning evidence",()=>{expect(listening).toBeDefined();expect(isApplicationPromptReady(listening!,new Set())).toBe(false);expect(isApplicationPromptReady(listening!,new Set(["lexeme:lex-taberu:meaning_recognition:written-to-meaning"]))).toBe(true);});

  it("unlocks active use only after meaning and reading evidence",()=>{
    expect(active).toBeDefined();
    const meaning=new Set(["lexeme:lex-taberu:meaning_recognition:written-to-meaning"]);
    expect(isApplicationPromptReady(active!,meaning)).toBe(false);
    const ready=new Set([
      "lexeme:lex-taberu:meaning_recognition:written-to-meaning",
      "lexeme:lex-taberu:reading:word-to-reading"
    ]);
    expect(isApplicationPromptReady(active!,ready)).toBe(true);
  });
});
