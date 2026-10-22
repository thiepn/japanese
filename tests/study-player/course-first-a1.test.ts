import {validateAuthoredCourse} from "../../apps/web/src/study/courseAuthoring";
import {E02_AVAILABLE_SCENES} from "../../apps/web/src/study/a1ExcellenceCourse";
import {coreContent} from "../../apps/web/src/coreContent";
import {describe,it,expect} from "vitest";
import type {StudyEvent} from "@thiepn/domain";
import {C1_A1_UNITS,C2_A1_UNITS,C2_COVERAGE_LEDGER,C3_A1_UNITS,C3_EDITORIAL_RECORDS,C3_COVERAGE_LEDGER,C4_A1_UNITS,C4_EDITORIAL_RECORDS,C4_COVERAGE_LEDGER,buildC1A1CourseLesson,projectC1A1Course,validateC1A1Course,validateC2A1Course,validateC3A1Course,validateC4A1Course} from "../../apps/web/src/study/courseFirstA1";
import {isStudyLesson} from "../../packages/study-player/src/index";

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

describe("C2 content authoring pipeline and daily routines",()=>{
 it("validates three source-provenance-mapped ordered units without inventing study hours",()=>{
  expect(validateC2A1Course()).toEqual([]);
  expect(C2_A1_UNITS.map(x=>x.id)).toEqual(["a1-unit-01","a1-unit-02","a1-unit-03"]);
  expect(C2_COVERAGE_LEDGER).toHaveLength(3);
  expect(C2_COVERAGE_LEDGER.map(x=>x.controlledChecks)).toEqual([29,29,29]);
  expect(C2_COVERAGE_LEDGER.every(x=>x.recordedAudioAvailable===false &&
   x.verifiedStudyMinutes===null && !x.humanReviewed && !x.independentCompetenceVerified)).toBe(true);
 });
 it("preserves the first twelve lesson IDs and source-linked E02 routine capstone",()=>{
  expect(C2_A1_UNITS.slice(0,2).flatMap(u=>u.lessons.map(l=>l.id)))
   .toEqual(C1_A1_UNITS.flatMap(u=>u.lessons.map(l=>l.id)));
  expect(C2_A1_UNITS[2]?.lessons.map(l=>l.id)).toEqual(
   ["cf-a1-03-01","cf-a1-03-02","cf-a1-03-03","cf-a1-03-04","cf-a1-03-05","cf-a1-03-06"]);
  const capstone=C2_A1_UNITS[2]?.lessons[5];
  expect(capstone&&"scene" in capstone?capstone.scene:null).toBe("routine");
  expect(E02_AVAILABLE_SCENES.find(x=>x.id==="routine")?.unitId).toBe("a1-unit-03");
 });
 it("does not bypass earlier units, accepts exact native event IDs and excludes unscored writing",()=>{
  expect(()=>buildC1A1CourseLesson("cf-a1-03-01",[])).toThrow("C1_A1_LESSON_LOCKED");
  const evidence= (C2_A1_UNITS.slice(0,2)).flatMap(unit=>unit.lessons.flatMap(lesson=>{
   const ids="scene" in lesson?["hear","read","reply","recall"].map(k=>"a1-e02-"+lesson.scene+"-"+k):
    [...lesson.checks.map((_,i)=>lesson.id+"-choice-"+(i+1)),lesson.id+"-recall"];
   const canonical=coreContent.courseUnits.find(x=>x.id===unit.id)!;
   return ids.map((id,i)=>({primaryTarget:{kind:"can_do",id:canonical.canDoId},result:"correct",
    occurredAt:new Date(Date.parse("2026-10-22T10:00:00Z")+i*1000).toISOString(),
    metadata:{promptId:id}} as unknown as StudyEvent));
  }));
  expect(projectC1A1Course(evidence).nextId).toBe("cf-a1-03-01");
  const steps=buildC1A1CourseLesson("cf-a1-03-01",evidence);
  const originals=steps.filter(step=>!isStudyLesson(step));
  expect(originals).toHaveLength(6);
  expect(originals.every(s=>s.eventMetadata?.schedulerExcluded===true)).toBe(true);
  expect(originals.filter(s=>s.eventMetadata?.nonAuthoritative===true)).toHaveLength(1);
 });
 it("rejects fabricated rights, unsupported audio, invalid choices and misplaced objectives",()=>{
  const targets=new Map(coreContent.courseUnits.filter(x=>x.level==="A1").map(x=>[x.id,x.canDoId]));
  const scenes=new Map(E02_AVAILABLE_SCENES.map(x=>[x.id,x.unitId]));
  const original=C2_A1_UNITS[2]!;
  const manifest={
   unitId:original.id,sourceId:"thiepn-original" as const,level:"A1" as const,
   rights:"original-owned" as const,stageSequence:["encounter","explain","guided","read","transfer","independent"] as const,
   lessonObjectives:original.lessons.map(x=>x.objective),
   grammarFocus:["grammar-masu"],recordedAudio:"none" as const,synthesis:"device-only" as const,
   independentWriting:"ungraded" as const,linguisticReview:"pending" as const,measuredStudyMinutes:null
  };
  expect(validateAuthoredCourse([original],[manifest],targets,scenes,true)).toEqual([]);
  expect(validateAuthoredCourse([original],[manifest],targets,scenes,false)).toContain("source-rights:a1-unit-03");
  const damaged={...original,lessons:[{...original.lessons[0],checks:[["prompt","yes","yes","no","because"]]},...original.lessons.slice(1)]} as unknown as typeof original;
  expect(validateAuthoredCourse([damaged],[manifest],targets,scenes,true))
   .toContain("invalid-choice:cf-a1-03-01-choice-1");
 });
});

describe("C3 substantive A1 past and origin sequence",()=>{
 const required=(unit:(typeof C3_A1_UNITS)[number])=>unit.lessons.flatMap(lesson=>{
  const ids="scene" in lesson?["hear","read","reply","recall"].map(k=>"a1-e02-"+lesson.scene+"-"+k):
   [...lesson.checks.map((_,i)=>lesson.id+"-choice-"+(i+1)),lesson.id+"-recall"];
  const canonical=coreContent.courseUnits.find(x=>x.id===unit.id)!;
  return ids.map((id,i)=>({
   primaryTarget:{kind:"can_do",id:canonical.canDoId},result:"correct",
   occurredAt:new Date(Date.parse("2026-10-22T10:00:00Z")+i*1000).toISOString(),
   metadata:{promptId:id}
  } as unknown as StudyEvent));
 });
 it("validates five ordered original-rights A1 units with unchanged predecessor IDs",()=>{
  expect(validateC3A1Course()).toEqual([]);
  expect(C3_A1_UNITS.map(u=>u.id)).toEqual(["a1-unit-01","a1-unit-02","a1-unit-03","a1-unit-04","a1-unit-05"]);
  expect(C3_A1_UNITS.slice(0,3).flatMap(u=>u.lessons.map(l=>l.id)))
   .toEqual(C2_A1_UNITS.flatMap(u=>u.lessons.map(l=>l.id)));
  expect(C3_A1_UNITS.flatMap(u=>u.lessons)).toHaveLength(30);
  expect(C3_COVERAGE_LEDGER.map(x=>x.controlledChecks)).toEqual([29,29,29,29,29]);
  expect(C3_COVERAGE_LEDGER.every(x=>!x.humanReviewed&&!x.recordedAudioAvailable&&
   x.verifiedStudyMinutes===null&&!x.independentCompetenceVerified)).toBe(true);
  expect(C3_EDITORIAL_RECORDS.map(x=>x.unitId)).toEqual(C3_A1_UNITS.map(x=>x.id));
 });
 it("uses original mapped E02 past and origin source capstones without changed E02 IDs",()=>{
  expect(E02_AVAILABLE_SCENES.find(x=>x.id==="past")?.unitId).toBe("a1-unit-04");
  expect(E02_AVAILABLE_SCENES.find(x=>x.id==="origin")?.unitId).toBe("a1-unit-05");
  for(const [index,scene] of [[3,"past"],[4,"origin"]] as const){
   const unit=C3_A1_UNITS[index]!;
   expect(unit.lessons.map(x=>x.id))
    .toEqual([1,2,3,4,5,6].map(n=>"cf-a1-"+String(index+1).padStart(2,"0")+"-"+String(n).padStart(2,"0")));
   const capstone=unit.lessons[5];
   expect(capstone&&"scene" in capstone?capstone.scene:null).toBe(scene);
  }
 });
 it("unlocks C3 only after source-linked earlier units; no synthetic writing grade",()=>{
  expect(()=>buildC1A1CourseLesson("cf-a1-04-01",[])).toThrow("C1_A1_LESSON_LOCKED");
  expect(()=>buildC1A1CourseLesson("cf-a1-05-01",[])).toThrow("C1_A1_LESSON_LOCKED");
  const previous=C3_A1_UNITS.slice(0,3).flatMap(required);
  expect(projectC1A1Course(previous).nextId).toBe("cf-a1-04-01");
  const first=buildC1A1CourseLesson("cf-a1-04-01",previous);
  expect(first.filter(x=>!isStudyLesson(x))).toHaveLength(6);
  const writing=first.find(x=>!isStudyLesson(x)&&x.eventMetadata?.nonAuthoritative===true);
  expect(writing).toBeTruthy();
  expect(first.filter(x=>!isStudyLesson(x)&&x.eventMetadata?.schedulerExcluded!==true)).toHaveLength(0);
  const priorC3=[...previous,...required(C3_A1_UNITS[3]!)];
  expect(projectC1A1Course(priorC3).nextId).toBe("cf-a1-05-01");
  expect(buildC1A1CourseLesson("cf-a1-05-01",priorC3).some(x=>!isStudyLesson(x)&&x.eventMetadata?.nonAuthoritative===true)).toBe(true);
  expect(projectC1A1Course([...priorC3,...required(C3_A1_UNITS[4]!)]).nextId).toBe("cf-a1-07-01");
 });
 it("rejects a misplaced origin capstone and non-unique distractors",()=>{
  const targets=new Map(coreContent.courseUnits.filter(x=>x.level==="A1").map(x=>[x.id,x.canDoId]));
  const scenes=new Map(E02_AVAILABLE_SCENES.map(x=>[x.id,x.unitId]));
  const unit=C3_A1_UNITS[4]!,manifest=C3_EDITORIAL_RECORDS[4]!;
  const invalid={...unit,lessons:[{...unit.lessons[0],checks:[["Question","X","X","Y","Explanation"]]},...unit.lessons.slice(1,-1),{...unit.lessons[5],scene:"past"}]} as unknown as typeof unit;
  expect(validateAuthoredCourse([invalid],[manifest],targets,scenes,true))
   .toEqual(expect.arrayContaining(["invalid-choice:cf-a1-05-01-choice-1","unlinked-capstone:cf-a1-05-06"]));
 });
});

describe("C4 source-linked preference and meeting-time units",()=>{
 const nativeEvents=(units:readonly (typeof C4_A1_UNITS)[number][])=>units.flatMap(unit=>{
  const target=coreContent.courseUnits.find(x=>x.id===unit.id)?.canDoId;
  if(!target)throw Error("MISSING_CAN_DO:"+unit.id);
  return unit.lessons.flatMap(lesson=>{
   const ids="scene" in lesson?["hear","read","reply","recall"].map(n=>"a1-e02-"+lesson.scene+"-"+n):
    [...lesson.checks.map((_,i)=>lesson.id+"-choice-"+(i+1)),lesson.id+"-recall"];
   return ids.map((id,i)=>({
    primaryTarget:{kind:"can_do",id:target},result:"correct",
    occurredAt:new Date(Date.parse("2026-10-22T10:00:00Z")+i*1000).toISOString(),
    metadata:{promptId:id}
   } as unknown as StudyEvent));
  });
 });
 it("validates original rights, canonical scene links and preserves all thirty C3 lesson IDs",()=>{
  expect(validateC4A1Course()).toEqual([]);
  expect(C4_A1_UNITS.map(x=>x.id)).toEqual([
   "a1-unit-01","a1-unit-02","a1-unit-03","a1-unit-04","a1-unit-05","a1-unit-07","a1-unit-12"
  ]);
  expect(C4_A1_UNITS.slice(0,5).flatMap(x=>x.lessons.map(l=>l.id)))
   .toEqual(C3_A1_UNITS.flatMap(x=>x.lessons.map(l=>l.id)));
  expect(C4_A1_UNITS.flatMap(x=>x.lessons)).toHaveLength(42);
  expect(C4_COVERAGE_LEDGER.map(x=>x.controlledChecks)).toEqual([29,29,29,29,29,29,29]);
  expect(C4_EDITORIAL_RECORDS).toHaveLength(7);
  expect(C4_COVERAGE_LEDGER.every(x=>!x.humanReviewed&&!x.recordedAudioAvailable&&
   x.verifiedStudyMinutes===null&&!x.independentCompetenceVerified)).toBe(true);
 });
 it("does not falsely count missing canonical units or remap the E02 capstones",()=>{
  expect(C4_A1_UNITS.some(x=>x.id==="a1-unit-06")).toBe(false);
  expect(["a1-unit-08","a1-unit-09","a1-unit-10","a1-unit-11"].every(id=>
   !C4_A1_UNITS.some(x=>x.id===id))).toBe(true);
  const mapped:[string,string,string][]=[
   ["a1-unit-07","preferences","07"],["a1-unit-12","time","12"]
  ];
  for(const [unitId,scene,num] of mapped){
   const unit=C4_A1_UNITS.find(x=>x.id===unitId)!;
   expect(unit.lessons.map(x=>x.id)).toEqual([1,2,3,4,5,6].map(n=>
    "cf-a1-"+num+"-"+String(n).padStart(2,"0")));
   const capstone=unit.lessons[5];
   expect(capstone&&"scene" in capstone?capstone.scene:null).toBe(scene);
   expect(E02_AVAILABLE_SCENES.find(x=>x.id===scene)?.unitId).toBe(unitId);
  }
 });
 it("unlocks original preference lessons after first thirty and meeting lessons only after preference",()=>{
  expect(()=>buildC1A1CourseLesson("cf-a1-07-01",[])).toThrow("C1_A1_LESSON_LOCKED");
  expect(()=>buildC1A1CourseLesson("cf-a1-12-01",[])).toThrow("C1_A1_LESSON_LOCKED");
  const old=nativeEvents(C3_A1_UNITS);
  expect(projectC1A1Course(old).nextId).toBe("cf-a1-07-01");
  const first=buildC1A1CourseLesson("cf-a1-07-01",old);
  expect(first.filter(s=>!isStudyLesson(s)&&s.eventMetadata?.nonAuthoritative!==true)).toHaveLength(5);
  expect(first.filter(s=>!isStudyLesson(s)&&s.eventMetadata?.nonAuthoritative===true)).toHaveLength(1);
  expect(first.filter(s=>!isStudyLesson(s)&&s.eventMetadata?.schedulerExcluded!==true)).toHaveLength(0);
  const allThroughPreference=nativeEvents(C4_A1_UNITS.slice(0,6));
  expect(projectC1A1Course(allThroughPreference).nextId).toBe("cf-a1-12-01");
  expect(projectC1A1Course(nativeEvents(C4_A1_UNITS)).nextId).toBeNull();
 });
 it("rejects unlinked capstones, duplicate options, false export rights and fabricated hours",()=>{
  const targets=new Map(coreContent.courseUnits.filter(x=>x.level==="A1").map(x=>[x.id,x.canDoId]));
  const scenes=new Map(E02_AVAILABLE_SCENES.map(x=>[x.id,x.unitId]));
  const unit=C4_A1_UNITS[5]!,metadata=C4_EDITORIAL_RECORDS[5]!;
  expect(validateAuthoredCourse([unit],[metadata],targets,scenes,true)).toEqual([]);
  expect(validateAuthoredCourse([unit],[metadata],targets,scenes,false)).toContain("source-rights:a1-unit-07");
  const damaged={...unit,lessons:[{...unit.lessons[0],
   checks:[["Question","yes","yes","no","Feedback"]]},...unit.lessons.slice(1,-1),
   {...unit.lessons[5],scene:"time"}]} as unknown as typeof unit;
  expect(validateAuthoredCourse([damaged],[metadata],targets,scenes,true))
   .toEqual(expect.arrayContaining(["invalid-choice:cf-a1-07-01-choice-1","unlinked-capstone:cf-a1-07-06"]));
  const falseHours={...metadata,measuredStudyMinutes:120} as unknown as typeof metadata;
  expect(validateAuthoredCourse([unit],[falseHours],targets,scenes,true))
   .toContain("unverified-evidence:a1-unit-07");
 });
});
