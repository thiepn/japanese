import { describe,expect,it } from "vitest";
import { coreContent } from "../../apps/web/src/coreContent";
import { productivePracticeSession,productiveSpeakingPrompts,productiveWritingPrompts } from "../../apps/web/src/study/productivePractice";
import { gradeStudyPrompt } from "../../packages/study-player/src/index";

describe("P5 productive language",()=>{
  it("ships canonical B1 productive tasks with reusable rubrics",()=>{
    expect(coreContent.productiveTasks).toHaveLength(10);
    expect(coreContent.productiveTasks.every((task)=>task.level==="B1"&&task.rubric.length===4&&task.requiredTerms.length>=3)).toBe(true);
  });
  it("uses connected writing and real speech prompt modes",()=>{
    expect(productiveWritingPrompts.every((prompt)=>prompt.promptType==="textarea"&&prompt.skill==="writing_quality")).toBe(true);
    expect(productiveSpeakingPrompts.every((prompt)=>prompt.promptType==="speech"&&prompt.skill==="production")).toBe(true);
    expect(productiveSpeakingPrompts.length).toBeGreaterThanOrEqual(6);
  });
  it("grades structural target coverage without claiming semantic or acoustic scoring",()=>{
    const prompt=productiveWritingPrompts[0]!;
    const good=(prompt.requiredTerms!.join("。")+"。私は地域のサービスについて自分の意見と理由を説明します。利用する人にとって便利になることは大切ですが、安全についても考える必要があります。具体的な例を一つ挙げて、最後に自分の考えをまとめます。").repeat(2);
    expect(gradeStudyPrompt(prompt,good).result).toBe("correct");
    expect(gradeStudyPrompt(prompt,"短いです。").result).toBe("incorrect");
  });
  it("builds reusable productive sessions through the normal StudyPlayer contract",()=>{
    const writing=productivePracticeSession("writing");
    const speaking=productivePracticeSession("speaking");
    expect(writing[0]).toMatchObject({kind:"lesson"});
    expect(speaking.some((step)=>!("kind" in step)&&step.promptType==="speech")).toBe(true);
  });
});
