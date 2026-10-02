import { describe,expect,it } from "vitest";
import { parseCoachResponse } from "../../packages/coach/src/index";
import { createCoachHandler } from "../../services/api/src/ai-coach";

const safeFeedback={
  grammar:{summary:"Mostly controlled.",items:[],confidence:.8},
  vocabulary:{summary:"Appropriate range.",items:[],confidence:.7},
  coherence:{summary:"Clear progression.",items:[],confidence:.75},
  taskAchievement:{summary:"The main task is addressed.",items:[],confidence:.85}
};

describe("P6 AI coach evidence contract",()=>{
  it("accepts advisory feedback only when it explicitly cannot alter mastery",()=>{
    const response=parseCoachResponse({
      replyJapanese:"なるほど。では、反対の立場からも考えてみましょう。",
      feedback:safeFeedback,
      evidenceContract:{advisoryOnly:true,changesMastery:false,modelJudgmentIsLearnerTruth:false,acousticAnalysis:false,provider:"test"}
    });
    expect(response.evidenceContract).toMatchObject({advisoryOnly:true,changesMastery:false,modelJudgmentIsLearnerTruth:false,acousticAnalysis:false});
  });

  it("rejects a model payload that attempts to claim mastery authority",()=>{
    expect(()=>parseCoachResponse({
      replyJapanese:"修正しました。",
      feedback:safeFeedback,
      evidenceContract:{advisoryOnly:false,changesMastery:true,modelJudgmentIsLearnerTruth:true,acousticAnalysis:true,provider:"unsafe"}
    })).toThrow("COACH_EVIDENCE_CONTRACT_UNSAFE");
  });

  it("server handler injects the safe evidence contract regardless of model output",async()=>{
    const handler=createCoachHandler({
      provider:"fixture-provider",model:"fixture-model",
      async completeJson(){return {replyJapanese:"一方で、別の観点もあります。",feedback:safeFeedback,revisionPrompt:"Add one concrete example."};}
    });
    const response=await handler({
      sessionId:"session-1",mode:"conversation",targetLevel:"B2",learnerText:"私はこの案に賛成です。",
      history:[],scenario:"Discuss a proposal.",goals:["state a view"],register:"neutral"
    });
    expect(response.evidenceContract).toEqual({
      advisoryOnly:true,changesMastery:false,modelJudgmentIsLearnerTruth:false,acousticAnalysis:false,
      provider:"fixture-provider",model:"fixture-model"
    });
  });
});
