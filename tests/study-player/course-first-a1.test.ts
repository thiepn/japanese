import {describe,it,expect} from "vitest";
import type {StudyEvent} from "@thiepn/domain";
import {C1_A1_UNITS,buildC1A1CourseLesson,projectC1A1Course,validateC1A1Course} from "../../apps/web/src/study/courseFirstA1";
import {isStudyLesson} from "@thiepn/study-player";

const mockEvent=(prompt:ReturnType<typeof buildC1A1CourseLesson>[number],result:"correct"|"incorrect",at:number):StudyEvent=>{
 if(isStudyLesson(prompt))throw Error("EXPECTED_PROMPT");
 return {primaryTarget:prompt.primaryTarget,result,occurredAt:new Date(at).toISOString(),
  metadata:{promptId:prompt.id, ...prompt.eventMetadata}} as unknown as StudyEvent;
};

describe("C0/C1 course-first A1 pilot",()=>{
 it("has two original canonical A1 units with six uniquely identified lessons apiece",()=>{
  expect(validateC1A1Course()).toEqual([]);
  expect(C1_A1_UNITS).toHaveLength(2);
  expect(C1_A1_UNITS.map(x=>x.id)).toEqual(["a1-unit-01","a1-unit-02"]);
  const ids=C1_A1_UNITS.flatMap(u=>u.lessons.map(l=>l.id));
  expect(ids).toHaveLength(12);
  expect(new Set(ids).size).toBe(12);
 });
 it("has one first lesson and keeps later units locked by real native answer evidence",()=>{
  const state=projectC1A1Course([]);
  expect(state.nextId).toBe("cf-a1-01-01");
  expect(state.units[0]?.lessons[0]?.unlocked).toBe(true);
  expect(state.units[0]?.lessons[1]?.unlocked).toBe(false);
  expect(state.units[1]?.lessons[0]?.unlocked).toBe(false);
  expect(()=>buildC1A1CourseLesson("cf-a1-02-01",[])).toThrow("C1_A1_LESSON_LOCKED");
 });
 it("resumes from original correct StudyEvents without creating a separate store",()=>{
  const id="cf-a1-01-01";
  const steps=buildC1A1CourseLesson(id,[]);
  const checks=steps.filter(s=>!isStudyLesson(s)&&s.eventMetadata?.nonAuthoritative!==true);
  expect(checks).toHaveLength(5);
  for(const step of checks){
   if(isStudyLesson(step))continue;
   expect(step.eventMetadata?.schedulerExcluded).toBe(true);
   expect(step.eventMetadata?.accreditedCefrVerdict).toBe(false);
  }
  const one=[mockEvent(checks[0]!, "correct",Date.parse("2026-10-22T10:00:00Z"))];
  const resumed=buildC1A1CourseLesson(id,one);
  expect(resumed.some(s=>s.id===checks[0]?.id)).toBe(false);
  expect(resumed.some(s=>s.id===checks[1]?.id)).toBe(true);
  expect(projectC1A1Course(one).units[0]?.lessons[0]?.done).toBe(1);
  const complete=checks.map((p,i)=>mockEvent(p,"correct",Date.parse("2026-10-22T10:00:00Z")+i*1000));
  const after=projectC1A1Course(complete);
  expect(after.nextId).toBe("cf-a1-01-02");
  expect(after.units[0]?.lessons[0]?.completed).toBe(true);
  expect(after.units[0]?.lessons[1]?.unlocked).toBe(true);
 });
 it("does not credit an incorrect retry or unscored writing as completion",()=>{
  const id="cf-a1-01-01",steps=buildC1A1CourseLesson(id,[]);
  const required=steps.filter(s=>!isStudyLesson(s)&&s.eventMetadata?.nonAuthoritative!==true);
  const correct=required.map((p,i)=>mockEvent(p,"correct",Date.parse("2026-10-22T11:00:00Z")+i*1000));
  const fail=mockEvent(required[0]!,"incorrect",Date.parse("2026-10-22T12:00:00Z"));
  const writing=steps.find(s=>!isStudyLesson(s)&&s.eventMetadata?.nonAuthoritative===true)!;
  const state=projectC1A1Course([...correct,fail,mockEvent(writing,"correct",Date.parse("2026-10-22T12:01:00Z"))]);
  expect(state.units[0]?.lessons[0]?.completed).toBe(false);
  expect(state.units[0]?.lessons[0]?.done).toBe(required.length-1);
 });
 it("reuses real E02 capstones and never invents missing audio or a second FSRS path",()=>{
  const first=C1_A1_UNITS[0]?.lessons[5];
  const second=C1_A1_UNITS[1]?.lessons[5];
  expect(first&&"scene" in first?first.scene:"").toBe("greetings");
  expect(second&&"scene" in second?second.scene:"").toBe("personal");
  for(const unit of C1_A1_UNITS)
   for(const lesson of unit.lessons)
    if(!("scene" in lesson)){
     const checks=lesson.checks;
     expect(checks.length).toBeGreaterThanOrEqual(4);
     expect(new Set(checks.map(c=>c[0])).size).toBe(checks.length);
    }
 });
});
