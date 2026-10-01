import { describe,expect,it } from "vitest";
import { createStudyEvent,gradeStudyPrompt,isStudyLesson,normalizeResponse,type StudyLesson,type StudyPrompt } from "../../packages/study-player/src/index";

const prompt:StudyPrompt={id:"p-1",primaryTarget:{kind:"lexeme",id:"lex-gakkou"},skill:"meaning_recognition",cueFamily:"written-to-meaning",promptType:"typed",instruction:"Type the meaning.",prompt:"学校",acceptedAnswers:["school","a school"],displayAnswer:"school",contextId:"foundation-001"};

describe("Study Player domain",()=>{
  it("normalizes Unicode/spacing/case before grading",()=>{expect(normalizeResponse("  SCHOOL  ")).toBe("school");expect(gradeStudyPrompt(prompt,"School").result).toBe("correct");});
  it("canonicalizes common Hepburn/Kunrei romaji alternatives",()=>{expect(normalizeResponse("ＳＩ","romaji")).toBe("shi");expect(normalizeResponse("sya","romaji")).toBe("sha");expect(normalizeResponse("tyo","romaji")).toBe("cho");expect(normalizeResponse("zya","romaji")).toBe("ja");});
  it("normalizes Japanese spacing without collapsing hiragana and katakana",()=>{expect(normalizeResponse("　きゃ　","japanese")).toBe("きゃ");expect(normalizeResponse("キャ","japanese")).not.toBe(normalizeResponse("きゃ","japanese"));});
  it("grades a romaji alias through prompt normalization",()=>{const kana:StudyPrompt={id:"kana",primaryTarget:{kind:"kana",id:"hiragana-し"},skill:"reading",cueFamily:"kana-to-romaji-recall",promptType:"typed",instruction:"Read.",prompt:"し",acceptedAnswers:["shi"],displayAnswer:"shi",answerNormalization:"romaji"};expect(gradeStudyPrompt(kana,"si").result).toBe("correct");});
  it("creates durable evidence with context and content provenance",()=>{const provenanced={...prompt,sourceId:"thiepn-original",contentVersion:"0.1.0"};const event=createStudyEvent({id:"evt",userId:"u",deviceId:"d",prompt:provenanced,response:"school",occurredAt:"2026-10-01T12:00:00Z",responseTimeMs:900,baseRevision:2});expect(event).toMatchObject({contextId:"foundation-001",sourceId:"thiepn-original",contentVersion:"0.1.0",baseRevision:2,result:"correct",promptFamily:"written-to-meaning"});});
  it("keeps lesson cards distinct from graded prompts",()=>{const lesson:StudyLesson={kind:"lesson",id:"l",title:"Five vowels",body:"Learn them.",contextId:"hiragana-vowels"};expect(isStudyLesson(lesson)).toBe(true);expect(isStudyLesson(prompt)).toBe(false);});
});
