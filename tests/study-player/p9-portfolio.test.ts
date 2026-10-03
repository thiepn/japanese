import { describe,expect,it } from "vitest";
import type { StudyEvent } from "../../packages/domain/src/index";
import { buildB2PortfolioSummary } from "../../apps/web/src/study/reliability";
import { buildRealWorldPerformanceSummary,realWorldChains } from "../../apps/web/src/study/realWorldPerformance";
import { serializeB2PortfolioJson,serializeB2PortfolioMarkdown,type B2PortfolioExportV1 } from "../../apps/web/src/study/portfolioExport";

function event(index:number):StudyEvent{
  const writing=index%3!==0;
  return {
    id:"evt-"+index,userId:"u",deviceId:"d",occurredAt:new Date(Date.UTC(2026,8,1+Math.floor(index/200),8,index%60)).toISOString(),
    activity:writing?"writing":"reading",
    primaryTarget:writing?{kind:"production_task",id:index%2===0?"p7-writing-ai":"p7-writing-policy"}:{kind:"text",id:"p7-text-ai-work"},
    skillDimension:writing?"writing_quality":"comprehension",
    promptFamily:writing?"connected-writing":"graded-reader-comprehension",
    responseMode:writing?"textarea":"choice",result:index%5===0?"incorrect":"correct",
    metadata:writing?{learnerResponse:"理由と条件を説明します。",targetChunkIds:["p7-chunk-basis-show"]}:{}
  };
}

describe("P9 portfolio export and long-history stability",()=>{
  it("projects a long evidence history without creating an overall CEFR verdict",()=>{
    const events=Array.from({length:5000},(_,index)=>event(index));
    const portfolio=buildB2PortfolioSummary(events);
    expect(portfolio.activeDays).toBeGreaterThan(1);
    expect(portfolio.productiveArtifacts).toBeGreaterThan(1000);
    expect(portfolio.recentArtifacts).toHaveLength(12);
    expect(portfolio).not.toHaveProperty("passed");
    expect(portfolio).not.toHaveProperty("cefrScore");
  });

  it("exports explicit evidence boundaries in JSON and readable Markdown",()=>{
    const events=[event(1),event(2),event(3)];
    const portfolio=buildB2PortfolioSummary(events);
    const realWorld=buildRealWorldPerformanceSummary(realWorldChains,events);
    const value:B2PortfolioExportV1={
      schema:"thiepn-japanese-b2-portfolio",schemaVersion:1,generatedAt:"2026-10-03T08:00:00.000Z",phase:"P9",
      evidenceBoundary:{accreditedCefrVerdict:false,aiFeedbackChangesMastery:false,structuralChecksAreSemanticScores:false,speechRecognitionIsAcousticScoring:false},
      portfolio,realWorldPerformance:realWorld,
      nativeListening:{sourceDocuments:0,recordings:0,speakers:0,registers:[],speechRates:[],multiSourceSessions:0,delayedRecalls:0}
    };
    const json=serializeB2PortfolioJson(value);
    const markdown=serializeB2PortfolioMarkdown(value);
    expect(JSON.parse(json).evidenceBoundary.accreditedCefrVerdict).toBe(false);
    expect(markdown).toContain("not an accredited CEFR result");
    expect(markdown).toContain("Real-world performance");
    expect(markdown).toContain("Native listening depth");
  });
});
