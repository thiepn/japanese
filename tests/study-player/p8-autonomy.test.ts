import { describe,expect,it } from "vitest";
import type { StudyEvent } from "../../packages/domain/src/index";
import { autonomyMissions,buildAutonomyMissionProgress } from "../../apps/web/src/study/autonomyMissions";
import { buildB2PortfolioSummary,buildProductionReliabilitySummary } from "../../apps/web/src/study/reliability";

function event(input:{id:string;at:string;kind:"text"|"production_task";target:string;activity:"reading"|"listening"|"writing"|"speaking";result?:"correct"|"incorrect";metadata?:Record<string,unknown>}):StudyEvent{
  return {
    id:input.id,userId:"u",deviceId:"d",occurredAt:input.at,activity:input.activity,
    primaryTarget:{kind:input.kind,id:input.target},
    ...(input.kind==="text"?{skillDimension:input.activity==="listening"?"listening" as const:"comprehension" as const}:{skillDimension:input.activity==="writing"?"writing_quality" as const:"production" as const}),
    result:input.result??"correct",metadata:input.metadata??{}
  };
}

describe("P8 autonomy and production reliability",()=>{
  it("builds six multi-document missions from existing canonical texts/tasks",()=>{
    expect(autonomyMissions).toHaveLength(6);
    expect(autonomyMissions.every((mission)=>mission.stages.length>=6)).toBe(true);
    expect(autonomyMissions.every((mission)=>mission.stages.some((stage)=>stage.kind==="reading")&&mission.stages.some((stage)=>stage.kind==="listening")&&mission.stages.some((stage)=>stage.kind==="production")&&mission.stages.some((stage)=>stage.kind==="delayed_transfer"))).toBe(true);
  });

  it("does not complete delayed transfer until production evidence is separated by 20+ hours",()=>{
    const mission=autonomyMissions[0]!;
    const delayed=mission.stages.find((stage)=>stage.kind==="delayed_transfer")!;
    const first=event({id:"a",at:"2026-10-01T08:00:00Z",kind:"production_task",target:delayed.taskId!,activity:"writing"});
    let progress=buildAutonomyMissionProgress([mission],[first])[0]!;
    expect(progress.stages.find((stage)=>stage.id===delayed.id)?.complete).toBe(false);
    const later=event({id:"b",at:"2026-10-02T06:30:00Z",kind:"production_task",target:delayed.taskId!,activity:"writing"});
    progress=buildAutonomyMissionProgress([mission],[first,later])[0]!;
    expect(progress.stages.find((stage)=>stage.id===delayed.id)?.complete).toBe(true);
  });

  it("requires repeated successful production across days for reliability",()=>{
    const events=[
      event({id:"p1",at:"2026-10-01T08:00:00Z",kind:"production_task",target:"p7-writing-ai",activity:"writing",metadata:{learnerResponse:"初回",targetChunkIds:["chunk-shared"]}}),
      event({id:"p2",at:"2026-10-02T09:00:00Z",kind:"production_task",target:"p7-writing-ai",activity:"writing",metadata:{learnerResponse:"再挑戦",targetChunkIds:["chunk-shared"]}}),
      event({id:"p3",at:"2026-10-02T10:00:00Z",kind:"production_task",target:"p7-writing-policy",activity:"writing",metadata:{learnerResponse:"別の課題",targetChunkIds:["chunk-shared"]}})
    ];
    const summary=buildProductionReliabilitySummary(events);
    expect(summary.reliableTasks).toBe(1);
    expect(summary.taskEvidence.find((item)=>item.taskId==="p7-writing-ai")?.reliableAcrossSessions).toBe(true);
    expect(summary.transferredChunks).toBe(1);
  });

  it("keeps portfolio evidence descriptive and retains recent learner artifacts",()=>{
    const events=[
      event({id:"w",at:"2026-10-01T08:00:00Z",kind:"production_task",target:"p7-writing-ai",activity:"writing",metadata:{learnerResponse:"人工知能を活用する場合、情報源を確認します。"}}),
      event({id:"r",at:"2026-10-01T09:00:00Z",kind:"text",target:"p7-text-ai-work",activity:"reading"})
    ];
    const portfolio=buildB2PortfolioSummary(events);
    expect(portfolio.writingTasks).toBe(1);
    expect(portfolio.readingTexts).toBe(1);
    expect(portfolio.recentArtifacts[0]).toMatchObject({taskId:"p7-writing-ai",response:"人工知能を活用する場合、情報源を確認します。"});
    expect(portfolio).not.toHaveProperty("passed");
    expect(portfolio).not.toHaveProperty("cefrScore");
  });
});
