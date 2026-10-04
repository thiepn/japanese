import { describe,expect,it } from "vitest";
import { coreContent } from "../../apps/web/src/coreContent";
import {
  c1DiscoursePrompts,c1FoundationPractice,getC1FoundationOverview
} from "../../apps/web/src/study/c1Foundation";
import {
  buildC1FoundationAssessment,c1FoundationAssessmentPrompts,getC1FoundationProgress
} from "../../apps/web/src/study/assessment";

describe("P12 C1 foundation",()=>{
  it("merges the C1 overlay into the canonical content graph",()=>{
    const overview=getC1FoundationOverview();
    expect(coreContent.version).toBe("0.10.0");
    expect(overview).toMatchObject({
      grammar:16,
      sentences:48,
      lexicalChunks:32,
      courseUnits:10,
      readingTexts:8,
      productiveTasks:12,
      discourseMoves:8,
      discoursePrompts:12
    });
    expect(coreContent.lexemes.filter((item)=>item.tags?.includes("c1"))).toHaveLength(32);
  });

  it("extends the same course graph from B2 unit 58 into C1 units 59 through 68",()=>{
    const units=coreContent.courseUnits.filter((unit)=>unit.level==="C1").sort((a,b)=>a.order-b.order);
    expect(units).toHaveLength(10);
    expect(units[0]).toMatchObject({id:"p12-unit-59",order:59,prerequisiteUnitIds:["p7-unit-58"]});
    expect(units.at(-1)).toMatchObject({id:"p12-unit-68",order:68});
    for(let index=1;index<units.length;index++){
      expect(units[index]?.prerequisiteUnitIds).toContain("p12-unit-"+(58+index));
    }
  });

  it("keeps C1 discourse practice on canonical C1 sentence evidence",()=>{
    expect(c1DiscoursePrompts).toHaveLength(12);
    for(const prompt of c1DiscoursePrompts){
      expect(prompt.primaryTarget.kind).toBe("sentence");
      const sentence=coreContent.sentences.find((item)=>item.id===prompt.primaryTarget.id);
      expect(sentence?.level).toBe("C1");
      expect(prompt.eventMetadata).toMatchObject({p12C1Foundation:true,diagnosticOnly:true,accreditedCefrVerdict:false});
    }
    const session=c1FoundationPractice();
    expect(session[0]).toMatchObject({kind:"lesson",id:"p12-c1-foundation-intro"});
    expect(session).toHaveLength(13);
  });

  it("provides connected C1 texts with comprehension checks and transparent synthetic listening support",()=>{
    const texts=coreContent.readingTexts.filter((text)=>text.level==="C1");
    expect(texts).toHaveLength(8);
    for(const text of texts){
      expect(text.sentenceIds).toHaveLength(6);
      expect(text.comprehensionQuestions).toHaveLength(3);
      expect(text.audioMode).toBe("speech_synthesis");
      expect(text.sourceIds).toEqual(["thiepn-original"]);
    }
  });

  it("provides advanced writing and speaking tasks with explicit discourse targets",()=>{
    const tasks=coreContent.productiveTasks.filter((task)=>task.level==="C1");
    expect(tasks).toHaveLength(12);
    expect(tasks.filter((task)=>task.mode==="writing")).toHaveLength(6);
    expect(tasks.filter((task)=>task.mode==="speaking")).toHaveLength(6);
    expect(tasks.some((task)=>task.milestoneArea==="spoken_interaction")).toBe(true);
    expect(tasks.some((task)=>task.milestoneArea==="spoken_production")).toBe(true);
    for(const task of tasks){
      expect(task.requiredTerms.length).toBeGreaterThanOrEqual(3);
      expect(task.targetChunkIds?.length).toBeGreaterThanOrEqual(3);
      expect(task.rubric.reduce((sum,item)=>sum+item.weight,0)).toBeCloseTo(1);
    }
  });

  it("builds a five-area internal C1 foundation diagnostic rather than an external certification",()=>{
    const prompts=c1FoundationAssessmentPrompts();
    expect(prompts).toHaveLength(15);
    for(const activity of ["reading","listening","spoken_interaction","spoken_production","writing"] as const){
      expect(prompts.filter((prompt)=>prompt.languageActivity===activity)).toHaveLength(3);
    }
    expect(prompts.filter((prompt)=>prompt.languageActivity==="listening").every((prompt)=>prompt.eventMetadata?.audioKind==="device-speech-synthesis")).toBe(true);
    expect(prompts.every((prompt)=>prompt.eventMetadata?.accreditedCefrVerdict===false)).toBe(true);

    const session=buildC1FoundationAssessment();
    expect(session[0]).toMatchObject({kind:"lesson",id:"lesson-assessment-c1-foundation"});
    expect(session).toHaveLength(16);

    const progress=getC1FoundationProgress([]);
    expect(progress).toMatchObject({complete:false,answered:0,total:15});
  });
});
