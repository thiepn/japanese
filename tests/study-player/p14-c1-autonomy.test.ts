import { describe,expect,it } from "vitest";
import type { StudyEvent } from "@thiepn/domain";
import {
  buildC1AutonomyMissionProgress,buildC1DomainProfiles,c1AutonomyMissions
} from "../../apps/web/src/study/c1Autonomy";
import {
  buildC1PortfolioSummary,buildC1ProductionReliabilitySummary
} from "../../apps/web/src/study/c1Reliability";
import { scenarioChain } from "../../apps/web/src/ai/scenarioChains";

const DAY1="2026-10-01T10:00:00.000Z";
const DAY2="2026-10-02T12:00:00.000Z";

function event(input:Partial<StudyEvent> & Pick<StudyEvent,"occurredAt"|"activity">):StudyEvent{
  return {
    id:crypto.randomUUID(),
    userId:"test-user",
    deviceId:"test-device",
    ...input
  };
}

function researchMissionEvidence(secondAt=DAY2):StudyEvent[]{
  const chain=scenarioChain("c1-research-defense");
  return [
    event({occurredAt:DAY1,activity:"reading",primaryTarget:{kind:"text",id:"p12-text-causality"},result:"correct"}),
    event({occurredAt:DAY1,activity:"reading",primaryTarget:{kind:"text",id:"p12-text-policy-evidence"},result:"correct"}),
    event({occurredAt:DAY1,activity:"listening",metadata:{p13C1NativeSynthesis:true,nativeSetId:"p13-native-policy-continuity"}}),
    event({occurredAt:DAY1,activity:"writing",result:"correct",metadata:{p13MultiSourceSynthesis:true,synthesisPackId:"p13-synthesis-evidence-causality",learnerResponse:"留保と因果を区別した統合。"}}),
    ...chain.stages.map((stage,index)=>event({
      occurredAt:index<3?DAY1:secondAt,
      activity:"speaking",
      promptFamily:"ai-coach-conversation",
      metadata:{p13C1SpontaneousInteraction:true,scenarioChainId:chain.id,scenarioStageId:stage.id,targetLevel:"C1",learnerText:"現時点では断定できません。"}
    })),
    event({occurredAt:DAY1,activity:"writing",primaryTarget:{kind:"production_task",id:"p12-writing-causal-analysis"},result:"correct",metadata:{learnerResponse:"第一回の因果分析です。"}}),
    event({occurredAt:secondAt,activity:"writing",primaryTarget:{kind:"production_task",id:"p12-writing-causal-analysis"},result:"correct",metadata:{learnerResponse:"時間を置いて再構成した因果分析です。"}}),
    event({occurredAt:secondAt,activity:"writing",promptFamily:"p14-c1-autonomy-reflection",metadata:{p14C1Autonomy:true,missionId:"p14-research-evidence",learnerReflection:"複数の資料と反論を通じて、相関から因果を断定せず、留保と代替説明を明示して結論の強さを調整する必要性を再確認した。"}})
  ];
}

describe("P14 C1 long-form autonomy and reliability",()=>{
  it("defines five eight-stage domain missions across source, synthesis, interaction, production and delayed transfer",()=>{
    expect(c1AutonomyMissions).toHaveLength(5);
    for(const mission of c1AutonomyMissions){
      expect(mission.stages).toHaveLength(8);
      expect(new Set(mission.stages.map((stage)=>stage.kind))).toEqual(new Set([
        "reading","native_synthesis","multi_source_synthesis","spontaneous_interaction","production","delayed_transfer","reflection"
      ]));
      expect(mission.stages.at(-1)?.kind).toBe("reflection");
    }
  });

  it("completes a mission only when the full cross-modal and delayed chain is present",()=>{
    const progress=buildC1AutonomyMissionProgress(c1AutonomyMissions,researchMissionEvidence());
    const research=progress.find((entry)=>entry.mission.id==="p14-research-evidence")!;
    expect(research.completedStages).toBe(8);
    expect(research.totalStages).toBe(8);
    expect(research.completionRatio).toBe(1);
    expect(research.activeDays).toBe(2);
    expect(research.nextStage).toBeNull();
    expect(research.stages.find((stage)=>stage.kind==="spontaneous_interaction")).toMatchObject({complete:true,detail:"5/5 hidden interaction stages"});
    expect(research.stages.find((stage)=>stage.kind==="delayed_transfer")?.complete).toBe(true);
  });

  it("does not count same-session repetition as delayed reliability",()=>{
    const tooSoon="2026-10-01T18:00:00.000Z";
    const progress=buildC1AutonomyMissionProgress(c1AutonomyMissions,researchMissionEvidence(tooSoon));
    const delayed=progress.find((entry)=>entry.mission.id==="p14-research-evidence")!.stages.find((stage)=>stage.kind==="delayed_transfer")!;
    expect(delayed.complete).toBe(false);
  });

  it("derives domain specialization status from mission evidence rather than storing a separate badge",()=>{
    const events=researchMissionEvidence();
    const progress=buildC1AutonomyMissionProgress(c1AutonomyMissions,events);
    const profiles=buildC1DomainProfiles(progress,events);
    expect(profiles.find((item)=>item.missionId==="p14-research-evidence")).toMatchObject({
      status:"sustained",completedStages:8,totalStages:8,activeDays:2
    });
    expect(profiles.find((item)=>item.missionId==="p14-media-argument")?.status).toBe("not_started");
  });

  it("requires cross-day structural success for C1 productive reliability and tracks interaction transfer separately",()=>{
    const events=researchMissionEvidence();
    events.push(
      event({occurredAt:DAY2,activity:"writing",result:"correct",metadata:{p13MultiSourceSynthesis:true,synthesisPackId:"p13-synthesis-evidence-causality",learnerResponse:"二回目の統合です。"}})
    );
    const reliability=buildC1ProductionReliabilitySummary(events);
    expect(reliability.reliableArtifacts).toBeGreaterThanOrEqual(1);
    expect(reliability.artifactEvidence.find((item)=>item.id==="task:p12-writing-causal-analysis")?.reliableAcrossSessions).toBe(true);
    expect(reliability.interactionEvidence.find((item)=>item.chainId==="c1-research-defense")?.reliableAcrossSessions).toBe(true);
    expect(reliability.reliableInteractions).toBe(1);
  });

  it("builds a descriptive C1 portfolio without turning internal evidence into a certification result",()=>{
    const portfolio=buildC1PortfolioSummary(researchMissionEvidence());
    expect(portfolio.readingTexts).toBe(2);
    expect(portfolio.writingTasks).toBe(1);
    expect(portfolio.synthesisPacks).toBe(1);
    expect(portfolio.nativeSourceSyntheses).toBe(1);
    expect(portfolio.spontaneousCoachTurns).toBe(5);
    expect(portfolio.autonomyMissionsCompleted).toBe(1);
    expect(portfolio.domains.find((item)=>item.missionId==="p14-research-evidence")?.status).toBe("sustained");
  });
});
