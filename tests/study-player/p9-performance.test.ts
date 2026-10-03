import { describe,expect,it } from "vitest";
import type { StudyEvent } from "../../packages/domain/src/index";
import { buildRealWorldPerformanceSummary,realWorldChains } from "../../apps/web/src/study/realWorldPerformance";
import { listeningRecallDelaySatisfied } from "../../apps/web/src/immerse/nativeListening";
import { P9_RELEASE_THRESHOLDS,qualifyP9Release,type P9RegressionCertification } from "../../apps/web/src/study/releaseQualification";

function performanceEvent(id:string,promptId:string,at:string,result:"correct"|"incorrect"="correct",within=true):StudyEvent{
  return {
    id,userId:"u",deviceId:"d",occurredAt:at,activity:"speaking",
    primaryTarget:{kind:"production_task",id:"p9-performance-"+promptId},skillDimension:"production",
    promptFamily:"p9-real-world-unseen_response",responseMode:"speech",result,
    metadata:{p9Performance:true,p9PerformancePromptId:promptId,withinTimeLimit:within,qualificationOnly:true,schedulerExcluded:true}
  };
}
const passingRegression:P9RegressionCertification={
  typecheck:true,unitTests:true,contentValidation:true,productionBuild:true,e2e:true,
  offlineDrill:true,providerOutageDrill:true,longHistoryDrill:true
};

describe("P9 real-world performance and release qualification",()=>{
  it("ships five functional chains with unseen, paraphrase, repair and timed follow-up dimensions",()=>{
    expect(realWorldChains).toHaveLength(5);
    for(const chain of realWorldChains){
      expect(chain.stages).toHaveLength(4);
      expect(new Set(chain.stages.map((stage)=>stage.dimension))).toEqual(new Set(["unseen_response","paraphrase","repair","timed_followup"]));
      expect(chain.stages.every((stage)=>stage.timeLimitSeconds>=30)).toBe(true);
    }
  });

  it("keeps first-attempt and time-target evidence separate from later retries",()=>{
    const first=realWorldChains[0]!.stages[0]!;
    const events=[
      performanceEvent("a",first.id,"2026-10-01T08:00:00Z","incorrect",false),
      performanceEvent("b",first.id,"2026-10-01T09:00:00Z","correct",true)
    ];
    const summary=buildRealWorldPerformanceSummary(realWorldChains,events);
    const stage=summary.chains[0]!.stages[0]!;
    expect(stage.attempts).toBe(2);
    expect(stage.correctAttempts).toBe(1);
    expect(stage.withinTimeAttempts).toBe(1);
    expect(summary.correctFirstAttempts).toBe(0);
    expect(summary.withinTimeFirstAttempts).toBe(0);
    expect(summary.unseenPrompts).toBe(19);
  });

  it("requires at least 20 hours before a delayed native-listening recall counts as delayed",()=>{
    expect(listeningRecallDelaySatisfied("2026-10-01T08:00:00Z","2026-10-02T04:00:00Z")).toBe(true);
    expect(listeningRecallDelaySatisfied("2026-10-01T08:00:00Z","2026-10-02T03:59:59Z")).toBe(false);
  });

  it("keeps the C1-roadmap gate closed when native-media depth is below the explicit release threshold",()=>{
    const result=qualifyP9Release({sourceDocuments:1,recordings:2,speakers:1,registers:1,speechRates:["natural"]},passingRegression);
    expect(result.releaseQualified).toBe(false);
    expect(result.c1RoadmapGateOpen).toBe(false);
    expect(result.checks.filter((check)=>check.category==="native_media"&&!check.passed).length).toBeGreaterThan(0);
  });

  it("opens the system-level release gate only when content, native media and all regression drills pass",()=>{
    const result=qualifyP9Release({
      sourceDocuments:P9_RELEASE_THRESHOLDS.nativeSourceDocuments,
      recordings:P9_RELEASE_THRESHOLDS.nativeRecordings,
      speakers:P9_RELEASE_THRESHOLDS.nativeSpeakers,
      registers:P9_RELEASE_THRESHOLDS.nativeRegisters,
      speechRates:["natural","fast"]
    },passingRegression);
    expect(result.releaseQualified).toBe(true);
    expect(result.c1RoadmapGateOpen).toBe(true);
    expect(result.passed).toBe(result.total);
  });
});
