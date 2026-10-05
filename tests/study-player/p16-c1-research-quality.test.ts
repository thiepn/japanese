import { describe,expect,it } from "vitest";
import type { StudyEvent } from "@thiepn/domain";
import { buildC1ResearchQualityProgress,buildC1ReviewPacket,formatC1Bibliography,type C1BibliographyRecord } from "../../apps/web/src/study/c1ResearchQuality";
import { buildC1WritingProjectProgress,type C1RegisteredSource } from "../../apps/web/src/study/c1Environment";

const T0="2026-10-01T09:00:00.000Z";
const T1="2026-10-02T06:00:00.000Z";
const T2="2026-10-02T07:00:00.000Z";
function event(metadata:Record<string,unknown>,occurredAt=T0):StudyEvent{
  return {id:crypto.randomUUID(),userId:"test",deviceId:"device",occurredAt,activity:"writing",metadata};
}

describe("P16 C1 research quality",()=>{
  it("formats structured bibliography without changing source identity",()=>{
    const record:C1BibliographyRecord={
      sourceId:"s1",title:"人口動態統計",organization:"政府統計",publishedDate:"2026-04-01",accessedDate:"2026-10-05",
      url:"https://www.e-stat.go.jp/example",doi:"10.1234/example",savedAt:T0
    };
    expect(formatC1Bibliography(record,"japanese")).toContain("政府統計（2026）");
    expect(formatC1Bibliography(record,"apa")).toContain("https://doi.org/10.1234/example");
    expect(formatC1Bibliography(record,"compact")).toContain("人口動態統計");
  });

  it("derives P16 quality state from non-mastery StudyEvents",()=>{
    const events:StudyEvent[]=[
      event({p16Bibliography:true,bibliography:{sourceId:"s1",title:"A",organization:"Org",accessedDate:"2026-10-05",url:"https://example.test/a",savedAt:T0}}),
      event({p16SourceExcerpt:true,excerpt:{id:"e1",sourceId:"s1",locator:"p. 1",text:"十分な長さの引用テキストです。".repeat(4),access:"private_reference",savedAt:T0}}),
      event({p16SourceExcerpt:true,excerpt:{id:"e2",sourceId:"s1",locator:"p. 2",text:"再利用可能な資料の抜粋です。".repeat(4),access:"redistributable",licenseName:"CC BY 4.0",savedAt:T1}},T1),
      event({p16HumanReview:true,humanReview:{id:"r1",projectId:"p1",projectTitle:"Project",reviewerName:"Reviewer",reviewerRole:"teacher",reviewedAt:T2,scores:{argumentControl:3,sourceUse:4,languagePrecision:3,registerControl:3},feedback:"x".repeat(90),blockingIssues:[],draftOccurredAt:T0,revisionOccurredAt:T1}},T2),
      event({p16SpecialistTrack:true,specialistTrack:{id:"t1",title:"Policy",domain:"policy",goal:"x".repeat(50),sourceIds:["s1"],termIds:["l1"],projectIds:["p1"],createdAt:T2}},T2)
    ];
    const progress=buildC1ResearchQualityProgress(events);
    expect(progress.bibliographySources).toBe(1);
    expect(progress.privateExcerpts).toBe(1);
    expect(progress.redistributableExcerpts).toBe(1);
    expect(progress.reviewedProjects).toBe(1);
    expect(progress.specialistDomains).toBe(1);
  });

  it("builds a reviewer packet only from a completed delayed P15 artifact",()=>{
    const events:StudyEvent[]=[
      event({p15C1Environment:true,p15WritingProject:true,projectId:"p15-evidence-review",projectStage:"source_map",sourceMap:{projectId:"p15-evidence-review",occurredAt:T0,thesis:"人口動態について複数の資料を比較し、統計上の観測と政策上の解釈を分離して結論の射程を評価する。".repeat(2),sourceIds:["s1","s2","s3"],citationKeys:{s1:"S1",s2:"S2",s3:"S3"}}}),
      event({p15C1Environment:true,p15WritingProject:true,projectId:"p15-evidence-review",projectStage:"draft",learnerDraft:"初稿 ".repeat(220)+"[S1] [S2] [S3]",citationKeys:["S1","S2","S3"]}),
      event({p15C1Environment:true,p15WritingProject:true,p15LiveDefense:true,projectId:"p15-evidence-review",projectStage:"defense",pressureId:"a",pressureType:"causal_overclaim",learnerResponse:"反論への回答 ".repeat(30),inputMode:"text"},"2026-10-01T10:00:00.000Z"),
      event({p15C1Environment:true,p15WritingProject:true,p15LiveDefense:true,projectId:"p15-evidence-review",projectStage:"defense",pressureId:"b",pressureType:"source_credibility",learnerResponse:"資料の役割への回答 ".repeat(30),inputMode:"speech"},"2026-10-01T11:00:00.000Z"),
      event({p15C1Environment:true,p15WritingProject:true,projectId:"p15-evidence-review",projectStage:"revision",learnerRevision:"改稿 ".repeat(300)+"[S1] [S2] [S3]",citationKeys:["S1","S2","S3"]},T1),
      event({p15C1Environment:true,p15WritingProject:true,projectId:"p15-evidence-review",projectStage:"reflection",learnerReflection:"反論を受けて主張の射程と資料の役割を見直し、因果と相関の区別を明確にした。".repeat(4)},T2)
    ];
    const project=buildC1WritingProjectProgress(events,Date.parse(T2)).find((item)=>item.project.id==="p15-evidence-review")!;
    const sources:C1RegisteredSource[]=[
      {id:"s1",portalId:"estat",title:"統計",url:"https://www.e-stat.go.jp/a",publisher:"政府統計",genre:"statistics",sourceRole:"primary_data",domain:"population",registeredAt:T0},
      {id:"s2",portalId:"jstage",title:"研究",url:"https://www.jstage.jst.go.jp/a",publisher:"J-STAGE",genre:"academic_article",sourceRole:"research",domain:"population",registeredAt:T0},
      {id:"s3",portalId:"ndl-issue",title:"分析",url:"https://www.ndl.go.jp/a",publisher:"国立国会図書館",genre:"legislative_brief",sourceRole:"analysis",domain:"policy",registeredAt:T0}
    ];
    const packet=buildC1ReviewPacket({project,sources,bibliography:[],generatedAt:T2});
    expect(packet.schema).toBe("thiepn-japanese-c1-review-p16-v1");
    expect(packet.project.revision.text).toContain("[S3]");
    expect(packet.sources.map((item)=>item.citationKey)).toEqual(["S1","S2","S3"]);
    expect(packet.evidenceBoundary).toContain("does not automatically update FSRS mastery");
  });
});
