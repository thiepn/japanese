import { describe,expect,it } from "vitest";
import { a1Course, allGrammarCoursePrompts, courseUnitPrompts, courseUnitSession, grammarApplicationPrompts, grammarMeaningPrompts, isGrammarCoursePromptReady, sentenceComprehensionPrompts, sentenceProductionPrompts, traceIdFor } from "../../apps/web/src/study/grammarCourse";
import { coreContent } from "../../apps/web/src/coreContent";

describe("P4 grammar, sentences and A1→B1 course",()=>{
  it("ships canonical grammar, sentence and course entities",()=>{
    expect(coreContent.lexemes).toHaveLength(336);
    expect(coreContent.grammar).toHaveLength(86);
    expect(coreContent.sentences).toHaveLength(209);
    expect(coreContent.canDos).toHaveLength(40);
    expect(coreContent.courseUnits).toHaveLength(40);
    expect(a1Course.map((item)=>item.unit.order)).toEqual(Array.from({length:40},(_,index)=>index+1));
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
  it("links B1 sentences only to grammar actually used in that sentence",()=>{
    const appearance=coreContent.sentences.find((item)=>item.id==="sentence-b1-174");
    const hearsay=coreContent.sentences.find((item)=>item.id==="sentence-b1-175");
    expect(appearance?.grammarIds).toEqual(["grammar-node-reason","grammar-sou-appearance"]);
    expect(appearance?.grammarIds).not.toContain("grammar-sou-hearsay");
    expect(hearsay?.grammarIds).toEqual(["grammar-sou-hearsay"]);
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
  it("keeps bounded conjugation work inside the capability sequence",()=>{
    const prompts=courseUnitPrompts("a1-unit-14");
    expect(prompts.filter((prompt)=>prompt.primaryTarget.kind==="lexeme"&&prompt.skill==="form_selection").length).toBeLessThanOrEqual(4);
    expect(prompts.some((prompt)=>prompt.primaryTarget.kind==="lexeme"&&prompt.skill==="meaning_recognition")).toBe(true);
  });
  it("builds capability units from reusable lessons and prompts",()=>{
    const steps=courseUnitSession("a1-unit-03");
    expect(steps[0]).toMatchObject({kind:"lesson",title:"Talk about actions"});
    expect(courseUnitPrompts("a1-unit-03").length).toBeGreaterThan(6);
    expect(steps.some((step)=>!("kind" in step)&&step.primaryTarget.kind==="grammar")).toBe(true);
    expect(steps.some((step)=>!("kind" in step)&&step.primaryTarget.kind==="sentence")).toBe(true);
    expect(steps.some((step)=>!("kind" in step)&&step.primaryTarget.kind==="sentence"&&step.skill==="production")).toBe(true);
  });
  it("does not leak the correct choice through a fixed first position",()=>{const positions=grammarMeaningPrompts.map((prompt)=>prompt.promptType==="choice"?prompt.choices.indexOf(prompt.acceptedAnswers[0]!):-1);expect(new Set(positions).size).toBeGreaterThan(1);});
  it("uses stable trace identities shared with the scheduler",()=>{
    expect(traceIdFor(grammarMeaningPrompts[0]!)).toMatch(/^grammar:/);
  });
});
