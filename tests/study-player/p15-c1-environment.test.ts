import { describe,expect,it } from "vitest";
import type { StudyEvent } from "@thiepn/domain";
import {
  buildC1EnvironmentProgress,buildC1WritingProjectProgress,c1PressureChallenges,c1SourcePortals,c1WritingProjects,
  drawC1PressureChallenge,isPortalUrl,portalById
} from "../../apps/web/src/study/c1Environment";

const T0="2026-10-01T09:00:00.000Z";
const T1="2026-10-02T06:00:00.000Z";
const T2="2026-10-02T07:00:00.000Z";

function event(input:Partial<StudyEvent>&Pick<StudyEvent,"occurredAt"|"activity">):StudyEvent{
  return {id:crypto.randomUUID(),userId:"test-user",deviceId:"test-device",...input};
}

function sourceRegistration(id:string,portalId:string,title:string,url:string,publisher:string,genre:string,role:string,domain:string,at=T0):StudyEvent{
  return event({
    occurredAt:at,activity:"reading",
    metadata:{
      p15C1Environment:true,p15SourceRegistration:true,
      sourceRecord:{id,portalId,title,url,publisher,genre,sourceRole:role,domain,registeredAt:at}
    }
  });
}

function evaluation(sourceId:string,at=T0):StudyEvent{
  return event({
    occurredAt:at,activity:"reading",
    metadata:{
      p15C1Environment:true,p15SourceEvaluation:true,
      evaluation:{
        sourceId,evaluatedAt:at,
        claim:"この資料は対象となる制度や現象について具体的な主張と観測結果を提示している。",
        evidence:"本文に示された統計、方法、制度上の記述を根拠として主張の範囲を確認できる。",
        limitation:"対象期間と母集団が限定されており、一般化や因果関係をそのまま導くことはできない。",
        rhetoricOrPurpose:"発行主体が政策または研究情報を特定の読者に説明する目的を持つ一次・分析資料である。",
        confidence:"medium"
      }
    }
  });
}

function projectEvidence():StudyEvent[]{
  return [
    sourceRegistration("s1","estat","人口動態の統計表","https://www.e-stat.go.jp/stat-search/files","政府統計","statistics","primary_data","population"),
    sourceRegistration("s2","jstage","人口移動に関する研究論文","https://www.jstage.jst.go.jp/article/example","科学技術振興機構","academic_article","research","population"),
    sourceRegistration("s3","ndl-issue","人口政策に関する調査と情報","https://www.ndl.go.jp/diet/publication/issue/example","国立国会図書館 調査及び立法考査局","legislative_brief","analysis","policy"),
    evaluation("s1"),evaluation("s2"),evaluation("s3"),
    event({
      occurredAt:T0,activity:"writing",
      metadata:{
        p15C1Environment:true,p15WritingProject:true,projectId:"p15-evidence-review",projectStage:"source_map",
        sourceMap:{projectId:"p15-evidence-review",occurredAt:T0,thesis:"人口動態の変化について、統計的な観測と研究上の解釈、政策上の含意を分けて検討し、どこまで結論できるかを評価する。",sourceIds:["s1","s2","s3"],citationKeys:{s1:"S1",s2:"S2",s3:"S3"}}
      }
    }),
    event({
      occurredAt:T0,activity:"writing",
      metadata:{p15C1Environment:true,p15WritingProject:true,projectId:"p15-evidence-review",projectStage:"draft",learnerDraft:"初稿 ".repeat(220)+"[S1] [S2] [S3]",citationKeys:["S1","S2","S3"]}
    }),
    event({
      occurredAt:"2026-10-01T10:00:00.000Z",activity:"speaking",
      metadata:{p15C1Environment:true,p15WritingProject:true,p15LiveDefense:true,projectId:"p15-evidence-review",projectStage:"defense",pressureId:"p15-pressure-causal",pressureType:"causal_overclaim",learnerResponse:"因果関係を断定せず、観測された関連の範囲に主張を限定し、追加の検証が必要だと説明します。".repeat(3),inputMode:"text"}
    }),
    event({
      occurredAt:"2026-10-01T11:00:00.000Z",activity:"speaking",
      metadata:{p15C1Environment:true,p15WritingProject:true,p15LiveDefense:true,projectId:"p15-evidence-review",projectStage:"defense",pressureId:"p15-pressure-credibility",pressureType:"source_credibility",learnerResponse:"資料の発行主体と目的を確認し、独立した研究資料と統計を組み合わせて役割を限定します。".repeat(3),inputMode:"speech"}
    })
  ];
}

describe("P15 authentic C1 environment",()=>{
  it("offers a diverse set of real Japanese source portals and validates exact portal URLs safely",()=>{
    expect(c1SourcePortals.length).toBeGreaterThanOrEqual(12);
    expect(new Set(c1SourcePortals.map((portal)=>portal.genre)).size).toBeGreaterThanOrEqual(9);
    const env=portalById("env-whitepaper");
    expect(isPortalUrl(env,"https://www.env.go.jp/policy/hakusyo/")).toBe(true);
    expect(isPortalUrl(env,"https://sub.env.go.jp/example")).toBe(true);
    expect(isPortalUrl(env,"http://www.env.go.jp/policy/hakusyo/")).toBe(false);
    expect(isPortalUrl(env,"https://env.go.jp.example.com/policy/hakusyo/")).toBe(false);
  });

  it("defines multi-day writing projects that require source diversity, defenses and longer delayed revisions",()=>{
    expect(c1WritingProjects).toHaveLength(5);
    for(const project of c1WritingProjects){
      expect(project.minimumSources).toBeGreaterThanOrEqual(3);
      expect(project.minimumGenres).toBeGreaterThanOrEqual(2);
      expect(project.minimumPublishers).toBeGreaterThanOrEqual(2);
      expect(project.requiredDefenseTurns).toBeGreaterThanOrEqual(2);
      expect(project.revisionMinimumCharacters).toBeGreaterThanOrEqual(project.draftMinimumCharacters);
    }
  });

  it("keeps a completed source map and draft in waiting state until the 20-hour revision delay is satisfied",()=>{
    const events=projectEvidence();
    const at19h=Date.parse(T0)+19*60*60*1000;
    const at21h=Date.parse(T0)+21*60*60*1000;
    const before=buildC1WritingProjectProgress(events,at19h).find((item)=>item.project.id==="p15-evidence-review")!;
    const after=buildC1WritingProjectProgress(events,at21h).find((item)=>item.project.id==="p15-evidence-review")!;
    expect(before.nextStage).toBe("waiting_revision");
    expect(before.defenses).toHaveLength(2);
    expect(after.nextStage).toBe("revision");
    expect(after.delayHours).toBeGreaterThanOrEqual(20);
  });

  it("requires defenses after the latest draft and ignores stale pressure evidence from an earlier draft",()=>{
    const events=projectEvidence();
    events.push(event({
      occurredAt:"2026-10-01T12:00:00.000Z",activity:"writing",
      metadata:{p15C1Environment:true,p15WritingProject:true,projectId:"p15-evidence-review",projectStage:"draft",learnerDraft:"更新した初稿 ".repeat(220)+"[S1] [S2] [S3]",citationKeys:["S1","S2","S3"]}
    }));
    const progress=buildC1WritingProjectProgress(events,Date.parse(T2)).find((item)=>item.project.id==="p15-evidence-review")!;
    expect(progress.defenses).toHaveLength(0);
    expect(progress.nextStage).toBe("defense");
  });

  it("completes a project only after delayed revision and reflection",()=>{
    const events=projectEvidence();
    events.push(
      event({
        occurredAt:T1,activity:"writing",
        metadata:{p15C1Environment:true,p15WritingProject:true,projectId:"p15-evidence-review",projectStage:"revision",learnerRevision:"改稿 ".repeat(300)+"[S1] [S2] [S3]",citationKeys:["S1","S2","S3"]}
      }),
      event({
        occurredAt:T2,activity:"writing",
        metadata:{p15C1Environment:true,p15WritingProject:true,projectId:"p15-evidence-review",projectStage:"reflection",learnerReflection:"資料の役割を区別し、反論を受けて結論の射程を狭めたことで、初稿よりも根拠と解釈の境界が明確になった。未解決なのは長期的な因果関係であり、追加資料が必要だと判断した。".repeat(2)}
      })
    );
    const progress=buildC1WritingProjectProgress(events,Date.parse(T2)).find((item)=>item.project.id==="p15-evidence-review")!;
    expect(progress.nextStage).toBe("complete");
    expect(progress.complete).toBe(true);
    expect(progress.revision?.citationKeys).toEqual(["S1","S2","S3"]);
  });

  it("derives environment breadth, specialist terms and pressure diversity from StudyEvents",()=>{
    const events=projectEvidence();
    events.push(event({
      occurredAt:T1,activity:"mining",
      metadata:{p15C1Environment:true,p15SpecialistTerm:true,term:{id:"private-lex-p15-1",sourceId:"s1",canonicalForm:"母集団",reading:"ぼしゅうだん",meaning:"population",context:"統計の対象となる母集団を確認する。",domain:"population",savedAt:T1}}
    }));
    const summary=buildC1EnvironmentProgress(events);
    expect(summary.registeredSources).toBe(3);
    expect(summary.evaluatedSources).toBe(3);
    expect(summary.sourceGenres).toBe(3);
    expect(summary.sourcePublishers).toBe(3);
    expect(summary.specialistTerms).toBe(1);
    expect(summary.defenseTurns).toBe(2);
    expect(summary.uniquePressureTypes).toBe(2);
    expect(summary.writingProjectsStarted).toBe(1);
  });

  it("draws hidden pressure from the remaining pool and can be deterministic in tests",()=>{
    expect(c1PressureChallenges.length).toBeGreaterThanOrEqual(16);
    const excluded=c1PressureChallenges.slice(0,3).map((item)=>item.id);
    const drawn=drawC1PressureChallenge(excluded,0);
    expect(excluded).not.toContain(drawn.id);
    expect(c1PressureChallenges.map((item)=>item.type)).toContain(drawn.type);
  });
});
