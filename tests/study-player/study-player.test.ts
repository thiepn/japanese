import { describe, expect, it } from "vitest";
import { createStudyEvent, gradeStudyPrompt, normalizeResponse, type StudyPrompt } from "../../packages/study-player/src/index";

const prompt: StudyPrompt = {
  id:"p-1", primaryTarget:{kind:"lexeme",id:"lex-gakkou"}, skill:"meaning_recognition", cueFamily:"written-to-meaning",
  promptType:"typed", instruction:"Type the meaning.", prompt:"学校", acceptedAnswers:["school","a school"], displayAnswer:"school", contextId:"foundation-001"
};

describe("Study Player domain",()=>{
  it("normalizes Unicode/spacing/case before grading",()=>{
    expect(normalizeResponse("  SCHOOL  ")).toBe("school");
    expect(gradeStudyPrompt(prompt,"School").result).toBe("correct");
  });
  it("creates durable evidence with the prompt context",()=>{
    const event=createStudyEvent({id:"evt",userId:"u",deviceId:"d",prompt,response:"school",occurredAt:"2026-10-01T12:00:00Z",responseTimeMs:900,baseRevision:2});
    expect(event).toMatchObject({contextId:"foundation-001",baseRevision:2,result:"correct",promptFamily:"written-to-meaning"});
  });
});
