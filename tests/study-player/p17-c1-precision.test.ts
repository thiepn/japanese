import { describe,expect,it } from "vitest";
import type { StudyEvent } from "@thiepn/domain";
import {
  buildC1PrecisionProgress,buildDiscourseProgress,c1DiscourseStages,c1PrecisionChallenges,
  validateC1PrecisionTransformation,type C1SpecialistDiscourseTurn
} from "../../apps/web/src/study/c1Precision";
import type { C1SpecialistTrack } from "../../apps/web/src/study/c1ResearchQuality";

const D1="2026-10-01T09:00:00.000Z";
const D2="2026-10-02T07:00:00.000Z";

function event(metadata:Record<string,unknown>,occurredAt=D1,activity:StudyEvent["activity"]="writing"):StudyEvent{
  return {id:crypto.randomUUID(),userId:"test-user",deviceId:"test-device",occurredAt,activity,metadata};
}

const track:C1SpecialistTrack={
  id:"track-policy",title:"Japanese policy analysis",domain:"policy",
  goal:"Build precise Japanese argumentation from real policy sources while separating evidence, recommendation and uncertainty.",
  sourceIds:["s1"],termIds:["t1"],projectIds:["p1"],createdAt:D1
};

function discourseTurn(stageId:C1SpecialistDiscourseTurn["stageId"],occurredAt:string,inputMode:"text"|"speech"="text"):C1SpecialistDiscourseTurn{
  return {id:crypto.randomUUID(),trackId:track.id,stageId,response:"専門的な論点について、前提・根拠・留保を明示しながら説明し、結論の射程を限定します。".repeat(4),inputMode,occurredAt};
}

describe("P17 C1→C2 precision bridge",()=>{
  it("defines eight precision modes and a five-stage specialist discourse cycle",()=>{
    expect(c1PrecisionChallenges).toHaveLength(8);
    expect(new Set(c1PrecisionChallenges.map((item)=>item.mode)).size).toBe(8);
    expect(c1DiscourseStages.map((item)=>item.id)).toEqual(["position","mechanism","challenge","audience_shift","synthesis"]);
  });

  it("enforces structural compression and expansion requirements without pretending to score semantics",()=>{
    const compression=c1PrecisionChallenges.find((item)=>item.mode==="compression")!;
    const expansion=c1PrecisionChallenges.find((item)=>item.mode==="expansion")!;
    const original="これは複数の資料を比較し、因果関係と相関関係を区別しながら、政策的含意を慎重に検討するための長い日本語の文章です。".repeat(6);
    const compressed="複数資料を比較すると関連は確認できるが、因果は断定できない。したがって政策判断は限定的な結論と追加検証を前提にすべきである。".repeat(2);
    expect(()=>validateC1PrecisionTransformation(compression,original,compressed,"結論、最強の根拠、最大の留保を残し、背景説明と重複表現を削った。".repeat(3))).not.toThrow();

    const short="観測された関連だけでは因果関係を断定できない。政策判断には追加検証が必要である。".repeat(6);
    const expanded="観測された関連は政策上重要だが、それだけで因果関係を断定することはできない。対象期間、母集団、代替説明を確認し、どの仮定の下で結論が成立するかを明示する必要がある。さらに、反対方向の因果や未観測要因が残るため、提言は暫定的なものとして見直し条件を設定すべきである。".repeat(4);
    expect(()=>validateC1PrecisionTransformation(expansion,short,expanded,"暗黙の前提、適用範囲、代替説明、見直し条件を明示して専門家向けに論証を展開した。".repeat(3))).not.toThrow();
  });

  it("requires delayed repetition of every discourse function before calling specialist performance sustained",()=>{
    const first=c1DiscourseStages.map((stage,index)=>discourseTurn(stage.id,new Date(Date.parse(D1)+index*60_000).toISOString(),index%2?"speech":"text"));
    const once=buildDiscourseProgress(track,first);
    expect(once.cycleComplete).toBe(true);
    expect(once.sustainedAcrossSessions).toBe(false);
    expect(once.stagesCovered).toBe(5);
    expect(once.repeatedStages).toBe(0);

    const second=c1DiscourseStages.map((stage,index)=>discourseTurn(stage.id,new Date(Date.parse(D2)+index*60_000).toISOString(),"speech"));
    const repeated=buildDiscourseProgress(track,[...first,...second]);
    expect(repeated.sustainedAcrossSessions).toBe(true);
    expect(repeated.repeatedStages).toBe(5);
    expect(repeated.activeDays).toBe(2);
    expect(repeated.spanHours).toBeGreaterThanOrEqual(20);
    expect(repeated.speechTurns).toBeGreaterThan(5);
  });

  it("derives precision, refresh and repair evidence from StudyEvents rather than a parallel progress store",()=>{
    const turns=c1DiscourseStages.map((stage)=>discourseTurn(stage.id,D1));
    const events:StudyEvent[]=[
      event({p17C1Precision:true,p17PrecisionArtifact:true,precisionArtifact:{id:"a1",challengeId:"p17-register",mode:"register_shift",originalText:"a".repeat(200),revisedText:"b".repeat(210),rationale:"c".repeat(100),occurredAt:D1}}),
      event({p17C1Precision:true,p17SourceRefresh:true,sourceRefresh:{id:"r1",baseSourceId:"s1",updateSourceId:"s2",changedClaim:"a".repeat(70),continuity:"b".repeat(60),impact:"c".repeat(70),uncertainty:"d".repeat(60),occurredAt:D1}},D1,"reading"),
      event({p17C1Precision:true,p17ReviewRepair:true,reviewRepair:{id:"rr1",reviewId:"review1",projectId:"p1",strategy:"modify",revisedPassage:"改".repeat(180),rationale:"理".repeat(120),occurredAt:D2}},D2),
      ...turns.map((turn)=>event({p17C1Precision:true,p17SpecialistDiscourse:true,specialistDiscourseTurn:turn},turn.occurredAt,"speaking"))
    ];
    const progress=buildC1PrecisionProgress(events,[track]);
    expect(progress.activeDays).toBe(2);
    expect(progress.precisionArtifacts).toHaveLength(1);
    expect(progress.precisionModes).toBe(1);
    expect(progress.sourceRefreshes).toHaveLength(1);
    expect(progress.reviewRepairs).toHaveLength(1);
    expect(progress.completedDiscourseCycles).toBe(1);
    expect(progress.sustainedSpecialistTracks).toBe(0);
  });
});
