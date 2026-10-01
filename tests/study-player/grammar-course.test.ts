import { describe,expect,it } from "vitest";
import { a1Course, allGrammarCoursePrompts, courseUnitPrompts, courseUnitSession, grammarApplicationPrompts, grammarMeaningPrompts, isGrammarCoursePromptReady, sentenceComprehensionPrompts, sentenceProductionPrompts, traceIdFor } from "../../apps/web/src/study/grammarCourse";
import { coreContent } from "../../apps/web/src/coreContent";

describe("P2 grammar, sentences and A1 course",()=>{
  it("ships canonical grammar, sentence and course entities",()=>{
    expect(coreContent.grammar).toHaveLength(15);
    expect(coreContent.sentences).toHaveLength(22);
    expect(coreContent.canDos).toHaveLength(8);
    expect(coreContent.courseUnits).toHaveLength(8);
    expect(a1Course.map((item)=>item.unit.order)).toEqual([1,2,3,4,5,6,7,8]);
  });
  it("keeps sentence knowledge linked to canonical grammar and lexemes",()=>{
    const grammarIds=new Set(coreContent.grammar.map((item)=>item.id));
    const lexemeIds=new Set(coreContent.lexemes.map((item)=>item.id));
    for(const sentence of coreContent.sentences){
      expect(sentence.grammarIds.every((id)=>grammarIds.has(id))).toBe(true);
      for(const ref of sentence.entityRefs){
        if(ref.kind==="grammar")expect(grammarIds.has(ref.id)).toBe(true);
        if(ref.kind==="lexeme")expect(lexemeIds.has(ref.id)).toBe(true);
      }
    }
  });
  it("creates independent grammar comprehension/form and sentence comprehension/production evidence",()=>{
    expect(grammarMeaningPrompts).toHaveLength(coreContent.grammar.length);
    expect(grammarApplicationPrompts).toHaveLength(coreContent.grammar.length);
    expect(sentenceComprehensionPrompts).toHaveLength(coreContent.sentences.length);
    expect(sentenceProductionPrompts).toHaveLength(coreContent.sentences.length);
    expect(new Set(allGrammarCoursePrompts.filter(p=>p.primaryTarget.kind==="grammar").map(p=>p.skill))).toEqual(new Set(["comprehension","form_selection"]));
    expect(new Set(allGrammarCoursePrompts.filter(p=>p.primaryTarget.kind==="sentence").map(p=>p.skill))).toEqual(new Set(["comprehension","production"]));
  });
  it("requires comprehension before grammar form selection and sentence production",()=>{
    const form=grammarApplicationPrompts.find((p)=>p.primaryTarget.id==="grammar-desu")!;
    expect(isGrammarCoursePromptReady(form,new Set())).toBe(false);
    expect(isGrammarCoursePromptReady(form,new Set(["grammar:grammar-desu:comprehension:grammar-label-to-function"]))).toBe(true);
    const production=sentenceProductionPrompts.find((p)=>p.primaryTarget.id==="sentence-a1-001")!;
    expect(isGrammarCoursePromptReady(production,new Set())).toBe(false);
    expect(isGrammarCoursePromptReady(production,new Set(["sentence:sentence-a1-001:comprehension:sentence-ja-to-meaning"]))).toBe(true);
  });
  it("builds capability units from reusable lessons and prompts",()=>{
    const steps=courseUnitSession("a1-unit-03");
    expect(steps[0]).toMatchObject({kind:"lesson",title:"Talk about actions"});
    expect(courseUnitPrompts("a1-unit-03").length).toBeGreaterThan(6);
    expect(steps.some((step)=>!("kind" in step)&&step.primaryTarget.kind==="grammar")).toBe(true);
    expect(steps.some((step)=>!("kind" in step)&&step.primaryTarget.kind==="sentence")).toBe(true);
  });
  it("uses stable trace identities shared with the scheduler",()=>{
    expect(traceIdFor(grammarMeaningPrompts[0]!)).toMatch(/^grammar:/);
  });
});
