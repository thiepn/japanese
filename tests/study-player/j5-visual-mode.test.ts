import {describe,expect,it} from "vitest";
import type {StudyLesson,StudyPrompt} from "../../packages/study-player/src/index";
import {j5StudyMode} from "../../apps/web/src/study/j5StudyVisual";

function prompt(overrides:Partial<StudyPrompt>):StudyPrompt{
  return {
    id:"p",
    primaryTarget:{kind:"lexeme",id:"x"},
    skill:"meaning_recognition",
    cueFamily:"test",
    promptType:"typed",
    instruction:"Answer.",
    prompt:"語",
    acceptedAnswers:["word"],
    displayAnswer:"word",
    ...overrides,
  } as StudyPrompt;
}

describe("J5 study visual classification",()=>{
  it("maps durable prompt kinds onto focused study modes",()=>{
    expect(j5StudyMode(prompt({primaryTarget:{kind:"kana",id:"あ"}})).mode).toBe("kana");
    expect(j5StudyMode(prompt({primaryTarget:{kind:"kanji",id:"日"}})).mode).toBe("kanji");
    expect(j5StudyMode(prompt({primaryTarget:{kind:"grammar",id:"g"}})).mode).toBe("grammar");
    expect(j5StudyMode(prompt({primaryTarget:{kind:"sentence",id:"s"}})).mode).toBe("sentence");
    expect(j5StudyMode(prompt({primaryTarget:{kind:"lexical_chunk",id:"c"}})).mode).toBe("vocabulary");
  });

  it("lets interaction mode override entity type where the learning task demands it",()=>{
    expect(j5StudyMode(prompt({promptType:"textarea",skill:"writing_quality"})).mode).toBe("writing");
    expect(j5StudyMode(prompt({promptType:"speech",skill:"production"})).mode).toBe("speaking");
    expect(j5StudyMode(prompt({speechSynthesisText:"日本語",skill:"listening"})).mode).toBe("listening");
    expect(j5StudyMode(prompt({activity:"assessment"})).mode).toBe("assessment");
  });

  it("classifies lesson context without changing the StudyStep contract",()=>{
    const kana:StudyLesson={kind:"lesson",id:"hiragana-vowels",title:"Five vowel sounds",body:"Learn.",contextId:"hiragana-vowels"};
    const writing:StudyLesson={kind:"lesson",id:"productive-writing-intro",title:"Writing practice",body:"Write.",contextId:"productive-writing"};
    const speaking:StudyLesson={kind:"lesson",id:"productive-speaking-intro",title:"Speaking practice",body:"Speak.",contextId:"productive-speaking"};
    expect(j5StudyMode(kana).mode).toBe("kana");
    expect(j5StudyMode(writing).mode).toBe("writing");
    expect(j5StudyMode(speaking).mode).toBe("speaking");
  });
});
