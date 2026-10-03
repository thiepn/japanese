import { describe,expect,it } from "vitest";
import { evaluateCoachResponseQuality,type CoachRequest,type CoachResponse } from "../../packages/coach/src/index";
import { runCoachProviderBenchmark,type CoachBenchmarkCase } from "../../services/api/src/provider-benchmark";

const request:CoachRequest={
  sessionId:"p9-quality",mode:"writing_revision",targetLevel:"B2",
  learnerText:"私は昨日、駅を行きました。",history:[],
  scenario:"Correct the destination particle.",goals:["駅に","particle"],register:"formal"
};
function response(original="駅を"):CoachResponse{
  return {
    replyJapanese:"「駅に行きました」のほうが自然です。",
    revisionPrompt:"助詞を直して、文をもう一度書いてください。",
    feedback:{
      grammar:{summary:"目的地の助詞を直します。",items:[{message:"目的地には「に」を使います。",original,suggestion:"駅に"}],confidence:.9},
      vocabulary:{summary:"語彙は適切です。",items:[],confidence:.8},
      coherence:{summary:"一文なので大きな問題はありません。",items:[],confidence:.8},
      taskAchievement:{summary:"意図は明確です。",items:[],confidence:.8}
    },
    evidenceContract:{advisoryOnly:true,changesMastery:false,modelJudgmentIsLearnerTruth:false,acousticAnalysis:false,provider:"fixture"}
  };
}

describe("P9 coach feedback grounding and provider benchmark",()=>{
  it("scores corrections anchored to the learner's actual text higher than invented spans",()=>{
    const grounded=evaluateCoachResponseQuality(request,response("駅を"));
    const ungrounded=evaluateCoachResponseQuality(request,response("学校を"));
    expect(grounded.anchoredCorrections).toBe(1);
    expect(ungrounded.anchoredCorrections).toBe(0);
    expect(grounded.score).toBeGreaterThan(ungrounded.score);
    expect(ungrounded.warningCodes).toContain("UNANCHORED_CORRECTION");
  });

  it("benchmarks semantic signals without granting provider output mastery authority",async()=>{
    const testCase:CoachBenchmarkCase={
      id:"fixture",request,expectedSignals:["駅に"],forbiddenSignals:["b2 certified","合格しました"]
    };
    const result=await runCoachProviderBenchmark({
      provider:"fixture",
      async completeJson(){
        const base=response();
        return {replyJapanese:base.replyJapanese,revisionPrompt:base.revisionPrompt,feedback:base.feedback};
      }
    },[testCase]);
    expect(result.safe).toBe(true);
    expect(result.passRate).toBe(1);
    expect(result.semanticRecall).toBe(1);
    expect(result.averageGroundingScore).toBeGreaterThanOrEqual(.5);
  });
});
