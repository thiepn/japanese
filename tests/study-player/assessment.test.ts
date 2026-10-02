import { describe,expect,it } from "vitest";
import type { StudyEvent } from "../../packages/domain/src/index";
import {
  a1MilestoneAssessmentPrompts,b1MilestoneAssessmentPrompts,b2MilestoneAssessmentPrompts,buildUnitAssessment,getA1MilestoneProgress,getB1MilestoneProgress,getB2MilestoneProgress,getUnitAssessmentProgress,
  UNIT_ASSESSMENT_DELAY_MS,unitAssessmentPrompts,unitLearningPrerequisites
} from "../../apps/web/src/study/assessment";

function event(promptId:string,occurredAt:string,input:Partial<StudyEvent>={}):StudyEvent{
  return {
    id:"event-"+promptId+"-"+occurredAt,
    userId:"u",deviceId:"d",occurredAt,activity:"review",result:"correct",
    metadata:{promptId},...input
  };
}

describe("P2.5 assessment model",()=>{
  it("keeps unit checks locked until essential first-pass evidence is complete and delayed",()=>{
    const unitId="a1-unit-09";
    const prerequisites=unitLearningPrerequisites(unitId);
    const completedAt="2026-10-01T10:00:00.000Z";
    const events=prerequisites.map((prompt)=>event(prompt.id,completedAt));
    const early=getUnitAssessmentProgress(unitId,events,new Date(new Date(completedAt).getTime()+UNIT_ASSESSMENT_DELAY_MS-1));
    expect(early.status).toBe("waiting");
    const ready=getUnitAssessmentProgress(unitId,events,new Date(new Date(completedAt).getTime()+UNIT_ASSESSMENT_DELAY_MS+1));
    expect(ready.status).toBe("ready");
  });

  it("records a finite delayed Can-do check with assessment metadata",()=>{
    const unitId="a1-unit-16";
    const steps=buildUnitAssessment(unitId);
    const prompts=unitAssessmentPrompts(unitId);
    expect(steps[0]).toMatchObject({kind:"lesson"});
    expect(prompts.length).toBeGreaterThanOrEqual(5);
    expect(prompts.every((prompt)=>prompt.activity==="assessment"&&prompt.eventMetadata?.assessmentScope==="unit")).toBe(true);
  });

  it("builds a 15-item milestone with three tasks in each A1 activity area",()=>{
    const prompts=a1MilestoneAssessmentPrompts();
    expect(prompts).toHaveLength(15);
    for(const activity of ["reading","listening","spoken_interaction","spoken_production","writing"] as const){
      expect(prompts.filter((prompt)=>prompt.languageActivity===activity)).toHaveLength(3);
    }
  });

  it("builds a 15-item B1 milestone with real speech and connected-writing modes",()=>{
    const prompts=b1MilestoneAssessmentPrompts();
    expect(prompts).toHaveLength(15);
    for(const activity of ["reading","listening","spoken_interaction","spoken_production","writing"] as const)expect(prompts.filter((prompt)=>prompt.languageActivity===activity)).toHaveLength(3);
    expect(prompts.filter((prompt)=>prompt.languageActivity==="spoken_interaction"||prompt.languageActivity==="spoken_production").every((prompt)=>prompt.promptType==="speech")).toBe(true);
    expect(prompts.filter((prompt)=>prompt.languageActivity==="writing").every((prompt)=>prompt.promptType==="textarea")).toBe(true);
  });

  it("reports B1 milestone scores independently",()=>{
    const prompts=b1MilestoneAssessmentPrompts();
    const events=prompts.slice(0,5).map((prompt,index)=>event(prompt.id,"2026-10-02T11:0"+index+":00.000Z",{activity:"assessment",contextId:"assessment-b1-milestone",result:index===2?"incorrect":"correct"}));
    const progress=getB1MilestoneProgress(events);
    expect(progress.answered).toBe(5);
    expect(progress.scores.reading.answered).toBe(3);
    expect(progress.scores.listening.answered).toBe(2);
  });

  it("builds a 15-item B2 milestone with connected listening, real speech and writing",()=>{
    const prompts=b2MilestoneAssessmentPrompts();
    expect(prompts).toHaveLength(15);
    for(const activity of ["reading","listening","spoken_interaction","spoken_production","writing"] as const)expect(prompts.filter((prompt)=>prompt.languageActivity===activity)).toHaveLength(3);
    expect(prompts.filter((prompt)=>prompt.languageActivity==="listening").every((prompt)=>Boolean(prompt.speechSynthesisText)&&prompt.promptType==="choice")).toBe(true);
    expect(prompts.filter((prompt)=>prompt.languageActivity==="spoken_interaction"||prompt.languageActivity==="spoken_production").every((prompt)=>prompt.promptType==="speech")).toBe(true);
    expect(prompts.filter((prompt)=>prompt.languageActivity==="writing").every((prompt)=>prompt.promptType==="textarea")).toBe(true);
  });

  it("reports B2 milestone activity scores independently",()=>{
    const prompts=b2MilestoneAssessmentPrompts();
    const events=prompts.slice(0,7).map((prompt,index)=>event(prompt.id,"2026-10-02T12:0"+index+":00.000Z",{activity:"assessment",contextId:"assessment-b2-milestone",result:index===4?"incorrect":"correct"}));
    const progress=getB2MilestoneProgress(events);
    expect(progress.answered).toBe(7);
    expect(progress.scores.reading.answered).toBe(3);
    expect(progress.scores.listening.answered).toBe(3);
    expect(progress.scores.spoken_interaction.answered).toBe(1);
  });

  it("reports milestone activity scores independently",()=>{
    const prompts=a1MilestoneAssessmentPrompts();
    const events=prompts.slice(0,4).map((prompt,index)=>event(prompt.id,"2026-10-02T10:0"+index+":00.000Z",{
      activity:"assessment",contextId:"assessment-a1-milestone",result:index===1?"incorrect":"correct"
    }));
    const progress=getA1MilestoneProgress(events);
    expect(progress.answered).toBe(4);
    expect(progress.complete).toBe(false);
    expect(progress.scores.reading.answered).toBe(3);
    expect(progress.scores.reading.correct).toBe(2);
    expect(progress.scores.listening.answered).toBe(1);
  });
});
