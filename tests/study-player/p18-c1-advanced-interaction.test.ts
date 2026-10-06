import { describe,expect,it } from "vitest";
import type { StudyEvent } from "@thiepn/domain";
import {
  buildC1AdvancedInteractionProgress,buildInteractionSessionProgress,c1InteractionPressureMoves,
  drawC1InteractionPressure,type C1AdvancedInteractionTurn
} from "../../apps/web/src/study/c1AdvancedInteraction";

const D1="2026-10-01T09:00:00.000Z";
const D2="2026-10-02T10:00:00.000Z";

function turn(index:number,overrides:Partial<C1AdvancedInteractionTurn>={}):C1AdvancedInteractionTurn{
  const move=c1InteractionPressureMoves[index%c1InteractionPressureMoves.length]!;
  return {
    id:"turn-"+index,sessionId:"session-a",moveId:move.id,pressureType:move.type,family:move.family,
    committedStatement:"前提、根拠、留保を区別しながら立場を説明し、必要に応じて結論の射程を限定します。".repeat(4),
    pressureResponse:"相手の指摘を受け止めつつ、曖昧な部分を修正し、維持できる主張と変更すべき主張を明確にします。".repeat(4),
    inputMode:index%2?"speech":"text",responseSeconds:8+index,occurredAt:new Date(Date.parse(D1)+index*60_000).toISOString(),...overrides
  };
}

function event(metadata:Record<string,unknown>,occurredAt=D1,activity:StudyEvent["activity"]="speaking"):StudyEvent{
  return {id:crypto.randomUUID(),userId:"u",deviceId:"d",occurredAt,activity,metadata};
}

describe("P18 advanced native interaction",()=>{
  it("defines twelve hidden pressure moves across five interaction families",()=>{
    expect(c1InteractionPressureMoves).toHaveLength(12);
    expect(new Set(c1InteractionPressureMoves.map((item)=>item.type)).size).toBe(12);
    expect(new Set(c1InteractionPressureMoves.map((item)=>item.family)).size).toBe(5);
  });

  it("draws unused pressure before recycling",()=>{
    const first=drawC1InteractionPressure([],()=>0);
    const second=drawC1InteractionPressure([first.id],()=>0);
    expect(second.id).not.toBe(first.id);
  });

  it("distinguishes complete sessions from robust pressure coverage",()=>{
    const complete=buildInteractionSessionProgress("session-a",[turn(0),turn(1),turn(2),turn(3)]);
    expect(complete.complete).toBe(true);
    expect(complete.robustPressureCoverage).toBe(false);
    expect(complete.pressureTypes).toBe(4);

    const robust=buildInteractionSessionProgress("session-a",[turn(0),turn(1),turn(2),turn(3),turn(4),turn(8)]);
    expect(robust.complete).toBe(true);
    expect(robust.robustPressureCoverage).toBe(true);
    expect(robust.pressureTypes).toBe(6);
    expect(robust.families).toBeGreaterThanOrEqual(4);
    expect(robust.averageResponseSeconds).toBeGreaterThan(0);
  });

  it("derives simulated, AI, human and transfer evidence from StudyEvents",()=>{
    const t1=turn(0);
    const t2=turn(1,{occurredAt:D2});
    const events:StudyEvent[]=[
      event({p18AdvancedInteraction:true,p18InteractionTurn:true,interactionTurn:t1}),
      event({p18AdvancedInteraction:true,p18InteractionTurn:true,interactionTurn:t2},D2),
      event({p18AdvancedInteraction:true,p18AdvancedCoach:true},D2),
      event({p18AdvancedInteraction:true,p18HumanInteraction:true,humanInteraction:{
        id:"human-1",medium:"in_person",partnerProfile:"native_japanese",durationMinutes:25,domain:"work",
        interactionSummary:"会話の流れと目的を十分に記録した内容です。".repeat(5),
        difficultMoment:"割り込みと聞き返しが重なった場面を記録します。".repeat(4),
        repairUsed:"確認質問と言い換えを使って修復しました。".repeat(4),
        reflection:"次回はより短く明確に発言権を取り戻す必要があります。".repeat(5),occurredAt:D2
      }},D2),
      event({p18AdvancedInteraction:true,p18CrossDomainTransfer:true,crossDomainTransfer:{
        id:"transfer-1",sourceTrackId:"track-1",targetDomain:"education",transferablePrinciple:"原則".repeat(40),
        transferResponse:"転用".repeat(80),boundaryCondition:"条件".repeat(50),occurredAt:D2
      }},D2)
    ];
    const progress=buildC1AdvancedInteractionProgress(events);
    expect(progress.activeDays).toBe(2);
    expect(progress.turns).toHaveLength(2);
    expect(progress.aiPressureTurns).toBe(1);
    expect(progress.humanInteractions).toHaveLength(1);
    expect(progress.humanInteractionMinutes).toBe(25);
    expect(progress.transfers).toHaveLength(1);
  });
});
