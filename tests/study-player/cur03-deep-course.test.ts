import {describe,it,expect} from "vitest";
import {isStudyLesson} from "../../packages/study-player/src/index";
import {coreContent} from "../../apps/web/src/coreContent";
import {courseUnitSession} from "../../apps/web/src/study/grammarCourse";
import {buildCur03CourseUnitSession,deepTeachingAnchors} from "../../apps/web/src/study/cur03A1DeepCourse";
import {coursePositionKey,readCoursePosition,saveCoursePosition,clearCoursePosition,nextSavedPosition,type PositionStore} from "../../apps/web/src/study/cur03CoursePosition";
class MemoryStore implements PositionStore{
 data=new Map<string,string>();
 getItem(k:string){return this.data.get(k)??null}
 setItem(k:string,v:string){this.data.set(k,v)}
 removeItem(k:string){this.data.delete(k)}
}
const a1=coreContent.courseUnits.filter(unit=>unit.level==="A1");
describe("CUR-03 deep original Japanese lessons",()=>{
 it("adds contextual teaching to canonical A1 anchors without renaming original prompts",()=>{
  const enriched=a1.filter(u=>deepTeachingAnchors(u.id).length>0);
  expect(enriched.length).toBeGreaterThan(0);
  for(const unit of enriched){
   const before=courseUnitSession(unit.id),after=buildCur03CourseUnitSession(unit.id);
   let last=-1;
   for(const step of before){
    const at=after.findIndex((candidate,i)=>i>last&&candidate.id===step.id);
    expect(at).toBeGreaterThan(last);expect(after[at]).toEqual(step);last=at;
   }
   const extra=after.filter(step=>!isStudyLesson(step)&&step.eventMetadata?.cur03===true);
   expect(extra).toHaveLength(deepTeachingAnchors(unit.id).length*4);
   expect(after.filter(isStudyLesson).some(s=>s.sourceLabel?.includes(unit.id))).toBe(true);
   for(const step of extra)if(!isStudyLesson(step)){
    expect(step.id).toMatch(/^cur03-/);
    expect(step.primaryTarget).toEqual({kind:"can_do",id:unit.canDoId});
    expect(step.sourceId).toBe("thiepn-original");
    expect(step.eventMetadata).toMatchObject({nonAuthoritative:true,schedulerExcluded:true,independentCompetenceVerified:false});
   }
  }
 });
 it("preserves the unchanged advanced course and rejects unknown unit IDs",()=>{
  const advanced=coreContent.courseUnits.find(u=>u.level==="B1"||u.level==="B2")!;
  expect(buildCur03CourseUnitSession(advanced.id).map(x=>x.id)).toEqual(courseUnitSession(advanced.id).map(x=>x.id));
  expect(()=>buildCur03CourseUnitSession("not-an-existing-unit")).toThrow(/UNKNOWN_COURSE_UNIT/);
 });
});
describe("CUR-03 exact-section checkpoint contract",()=>{
 const unit=a1.find(u=>deepTeachingAnchors(u.id).length>0)!;
 const steps=buildCur03CourseUnitSession(unit.id);
 it("round trips identity, isolates different owners, and clears only this course",()=>{
  const store=new MemoryStore();
  expect(saveCoursePosition("owner-a",unit.id,steps,3,store)).toBe(true);
  expect(readCoursePosition("owner-a",unit.id,steps,store)).toBe(3);
  expect(readCoursePosition("owner-b",unit.id,steps,store)).toBe(0);
  expect(clearCoursePosition("owner-a",unit.id,store)).toBe(true);
  expect(readCoursePosition("owner-a",unit.id,steps,store)).toBe(0);
 });
 it("rejects stale changed steps without modifying the old receipt",()=>{
  const store=new MemoryStore();
  saveCoursePosition("owner-a",unit.id,steps,2,store);
  const key=coursePositionKey("owner-a",unit.id),saved=store.getItem(key);
  const changed=steps.map((x,i)=>i===2?{...x,id:"unknown-new-identity"}:x);
  expect(readCoursePosition("owner-a",unit.id,changed,store)).toBe(0);
  expect(store.getItem(key)).toBe(saved);
 });
 it("rejects corrupted, cross-unit, oversized and forged positions",()=>{
  const store=new MemoryStore(),key=coursePositionKey("owner-a",unit.id);
  store.setItem(key,"invalid JSON");
  expect(readCoursePosition("owner-a",unit.id,steps,store)).toBe(0);
  saveCoursePosition("owner-a",unit.id,steps,1,store);
  const data=JSON.parse(store.getItem(key)!);
  store.setItem(key,JSON.stringify({...data,unitId:"forged"}));
  expect(readCoursePosition("owner-a",unit.id,steps,store)).toBe(0);
  expect(()=>saveCoursePosition("owner-a",unit.id,steps,steps.length,store)).toThrow(/CUR03_BAD_POSITION/);
  expect(()=>coursePositionKey("",unit.id)).toThrow(/CUR03_BAD_SCOPE/);
 });
 it("detects duplicate session steps and only advances to a real index",()=>{
  expect(()=>readCoursePosition("owner-a",unit.id,[steps[0]!,steps[0]!],new MemoryStore())).toThrow(/CUR03_DUPLICATE_STEP/);
  expect(nextSavedPosition(0,steps)).toBe(1);
  expect(nextSavedPosition(steps.length-1,steps)).toBe(steps.length-1);
 });
 it("fails visibly instead of claiming a local storage write succeeded",()=>{
  const broken:PositionStore={getItem(){throw Error("disabled")},setItem(){throw Error("quota")},removeItem(){throw Error("denied")}};
  expect(saveCoursePosition("owner-a",unit.id,steps,1,broken)).toBe(false);
  expect(readCoursePosition("owner-a",unit.id,steps,broken)).toBe(0);
  expect(clearCoursePosition("owner-a",unit.id,broken)).toBe(false);
 });
});
describe("CUR-10 four original source-grounded A1 teaching contexts",()=>{
 const cases=[
  ["a1-unit-09","grammar-demonstrative-pronouns"],
  ["a1-unit-12","grammar-kara-made"],
  ["a1-unit-18","grammar-de-means"],
  ["a1-unit-19","grammar-te-kudasai"]
 ] as const;
 it("uses exact sentences from the corresponding canonical source unit",()=>{
  for(const [unitId,anchor] of cases){
   const unit=coreContent.courseUnits.find(item=>item.id===unitId)!;
   expect(unit.level).toBe("A1");
   expect(unit.grammarIds).toContain(anchor);
   expect(deepTeachingAnchors(unitId)).toContain(anchor);
   const session=buildCur03CourseUnitSession(unitId);
   const context=session.find(step=>isStudyLesson(step)&&step.id==="cur03-"+unitId+"-"+anchor+"-context");
   expect(context).toBeDefined();
   if(!context||!isStudyLesson(context))throw Error("CUR10_CONTEXT_MISSING");
   const originalTexts=new Set(coreContent.sentences.filter(item=>unit.sentenceIds.includes(item.id)).map(item=>item.text));
   expect(context.examples).toHaveLength(4);
   for(const example of context.examples??[])expect(originalTexts.has(example.expression)).toBe(true);
  }
 });
 it("adds three distinct unscored guided choices and one independent writing task for each anchor",()=>{
  for(const [unitId,anchor] of cases){
   const session=buildCur03CourseUnitSession(unitId);
   const prompts=session.filter(step=>!isStudyLesson(step)&&step.eventMetadata?.cur03Anchor===anchor);
   expect(prompts).toHaveLength(4);
   expect(prompts.filter(step=>!isStudyLesson(step)&&step.promptType==="choice")).toHaveLength(3);
   expect(prompts.filter(step=>!isStudyLesson(step)&&step.promptType==="textarea")).toHaveLength(1);
   for(const step of prompts)if(!isStudyLesson(step)){
    expect(step.primaryTarget.kind).toBe("can_do");
    expect(step.sourceId).toBe("thiepn-original");
    expect(step.eventMetadata).toMatchObject({nonAuthoritative:true,schedulerExcluded:true,independentCompetenceVerified:false});
    if(step.promptType==="choice"){
      expect(step.choices).toHaveLength(3);
      expect(new Set(step.choices).size).toBe(3);
      expect(step.choices).toContain(step.acceptedAnswers[0]);
    }
   }
  }
 });
});

describe("CUR-11 canonical-source A1 grammar transfer",()=>{
 const added=[
  ["a1-unit-05","grammar-to-with",3],
  ["a1-unit-08","grammar-masen",3],
  ["a1-unit-11","grammar-no-attribute",4],
  ["a1-unit-14","grammar-i-adj-past",4],
  ["a1-unit-16","grammar-counter-tsu",4]
 ] as const;
 it("does not show source-specific examples in other A1 units sharing an anchor",()=>{
  for(const [unitId,anchor] of [
   ["a1-unit-08","grammar-masen"],
   ["a1-unit-11","grammar-no-attribute"],
   ["a1-unit-16","grammar-counter-tsu"]
  ] as const){
   const otherUnits=coreContent.courseUnits.filter(u=>u.level==="A1"&&u.id!==unitId&&u.grammarIds.includes(anchor));
   expect(otherUnits.length).toBeGreaterThan(0);
   for(const other of otherUnits){
    expect(deepTeachingAnchors(other.id)).not.toContain(anchor);
    expect(buildCur03CourseUnitSession(other.id).some(step=>
      step.id==="cur03-"+other.id+"-"+anchor+"-context")).toBe(false);
   }
  }
 });
 it("links all example sentences to the correct canonical A1 source unit",()=>{
  for(const [unitId,anchor,expected] of added){
   const u=coreContent.courseUnits.find(unit=>unit.id===unitId)!;
   expect(u.level).toBe("A1");
   expect(u.sourceIds).toEqual(["thiepn-original"]);
   expect(u.grammarIds).toContain(anchor);
   expect(deepTeachingAnchors(unitId)).toContain(anchor);
   const steps=buildCur03CourseUnitSession(unitId);
   expect(new Set(steps.map(step=>step.id)).size).toBe(steps.length);
   const context=steps.find(step=>step.id==="cur03-"+unitId+"-"+anchor+"-context");
   if(!context||!isStudyLesson(context))throw Error("CUR11_MISSING_CONTEXT");
   expect(context.examples).toHaveLength(expected);
   const source=new Set(coreContent.sentences.filter(s=>u.sentenceIds.includes(s.id)).map(s=>s.text));
   for(const example of context.examples??[])expect(source.has(example.expression)).toBe(true);
  }
 });
 it("preserves all original steps and fences new prompts from authoritative FSRS",()=>{
  for(const [unitId,anchor] of added){
   const u=coreContent.courseUnits.find(unit=>unit.id===unitId)!;
   const original=courseUnitSession(unitId),steps=buildCur03CourseUnitSession(unitId);
   let previous=-1;
   for(const step of original){
    const i=steps.findIndex((v,j)=>j>previous&&v.id===step.id);
    expect(i).toBeGreaterThan(previous);
    expect(steps[i]).toEqual(step);
    previous=i;
   }
   const extra=steps.filter(step=>!isStudyLesson(step)&&step.eventMetadata?.cur03Anchor===anchor);
   expect(extra).toHaveLength(4);
   expect(extra.filter(step=>!isStudyLesson(step)&&step.promptType==="choice")).toHaveLength(3);
   expect(extra.filter(step=>!isStudyLesson(step)&&step.promptType==="textarea")).toHaveLength(1);
   for(const step of extra)if(!isStudyLesson(step)){
    expect(step.primaryTarget).toEqual({kind:"can_do",id:u.canDoId});
    expect(step.sourceId).toBe("thiepn-original");
    expect(step.eventMetadata).toMatchObject({cur03UnitId:unitId,cur03Anchor:anchor,
     nonAuthoritative:true,schedulerExcluded:true,independentCompetenceVerified:false});
    if(step.promptType==="choice"){
     expect(step.choices).toHaveLength(3);
     expect(new Set(step.choices).size).toBe(3);
     expect(step.choices).toContain(step.acceptedAnswers[0]);
     expect(step.eventMetadata?.e06FoilFeedback).toHaveLength(2);
    }else{
     expect(step.promptType).toBe("textarea");
     expect(step.acceptedAnswers).toEqual([]);
    }
   }
  }
 });
});


describe("CUR-12 four complete source-owned A1 communication journeys",()=>{
 const additions=[
  ["a1-unit-10","grammar-location-words",5],
  ["a1-unit-13","grammar-masen-deshita",5],
  ["a1-unit-17","grammar-question-words",5],
  ["a1-unit-20","grammar-ne",5]
 ] as const;
 it("places the selected unit's authored context before generic shared-question instruction",()=>{
  for(const [unitId,anchor] of [
   ["a1-unit-10","grammar-location-words"],
   ["a1-unit-20","grammar-ne"]
  ] as const){
   const steps=buildCur03CourseUnitSession(unitId);
   expect(steps[1]?.id).toBe("cur03-"+unitId+"-"+anchor+"-context");
   expect(deepTeachingAnchors(unitId)[0]).toBe(anchor);
   expect(steps.some(x=>x.id==="cur03-"+unitId+"-grammar-ka-question-context")).toBe(true);
  }
 });
 it("uses only sentences linked to each original canonical A1 unit",()=>{
  for(const [unitId,anchor,expectedCount] of additions){
   const unit=coreContent.courseUnits.find(x=>x.id===unitId)!;
   expect(unit.level).toBe("A1"); expect(unit.grammarIds).toContain(anchor);
   expect(unit.sourceIds).toEqual(["thiepn-original"]);
   expect(deepTeachingAnchors(unitId)).toContain(anchor);
   const steps=buildCur03CourseUnitSession(unitId);
   expect(new Set(steps.map(x=>x.id)).size).toBe(steps.length);
   const first=steps.find(s=>s.id==="cur03-"+unitId+"-"+anchor+"-context");
   if(!first||!isStudyLesson(first))throw Error("CUR12_CONTEXT_MISSING");
   expect(first.examples).toHaveLength(expectedCount);
   const approved=new Set(coreContent.sentences.filter(s=>unit.sentenceIds.includes(s.id)).map(s=>s.text));
   for(const example of first.examples??[])expect(approved.has(example.expression)).toBe(true);
  }
 });
 it("keeps canonical prompt identity/order and protects every new check from FSRS",()=>{
  for(const [unitId,anchor] of additions){
   const before=courseUnitSession(unitId),after=buildCur03CourseUnitSession(unitId);
   let pos=-1;
   for(const canonical of before){
    const next=after.findIndex((s,i)=>i>pos&&s.id===canonical.id);
    expect(next).toBeGreaterThan(pos); expect(after[next]).toEqual(canonical);pos=next;
   }
   const extras=after.filter(s=>!isStudyLesson(s)&&s.eventMetadata?.cur03Anchor===anchor);
   expect(extras).toHaveLength(4);
   expect(extras.filter(s=>!isStudyLesson(s)&&s.promptType==="choice")).toHaveLength(3);
   expect(extras.filter(s=>!isStudyLesson(s)&&s.promptType==="textarea")).toHaveLength(1);
   for(const step of extras)if(!isStudyLesson(step)){
    expect(step.primaryTarget).toEqual({kind:"can_do",id:coreContent.courseUnits.find(u=>u.id===unitId)!.canDoId});
    expect(step.sourceId).toBe("thiepn-original");
    expect(step.eventMetadata).toMatchObject({cur03UnitId:unitId,cur03Anchor:anchor,nonAuthoritative:true,
     schedulerExcluded:true,independentCompetenceVerified:false});
    if(step.promptType==="choice"){
     expect(step.choices).toHaveLength(3);
     expect(new Set(step.choices).size).toBe(3);
     expect(step.choices).toContain(step.acceptedAnswers[0]);
     expect(step.eventMetadata?.e06FoilFeedback).toHaveLength(2);
    }else expect(step.acceptedAnswers).toEqual([]);
   }
  }
 });
 it("keeps reused grammar isolated from non-owning source units",()=>{
  for(const [unitId,anchor] of additions){
   const other=coreContent.courseUnits.filter(x=>x.level==="A1"&&x.id!==unitId&&x.grammarIds.includes(anchor));
   for(const unit of other){
    expect(deepTeachingAnchors(unit.id)).not.toContain(anchor);
    expect(buildCur03CourseUnitSession(unit.id).some(step=>
      step.id==="cur03-"+unit.id+"-"+anchor+"-context")).toBe(false);
   }
  }
 });
});

describe("CUR-13 source-owned A1 functional transfers",()=>{
 const cases=[
  ["a1-unit-15","grammar-counter-nin",5],
  ["a1-unit-12","grammar-time-counters",5],
  ["a1-unit-07","grammar-i-adj-polite",4],
  ["a1-unit-19","grammar-te-form",4]
 ] as const;
 it("renders only exact linked original sentences for the selected unit",()=>{
  for(const [unitId,anchor,count] of cases){
   const unit=coreContent.courseUnits.find(u=>u.id===unitId)!;
   expect(unit.level).toBe("A1");
   expect(unit.sourceIds).toEqual(["thiepn-original"]);
   expect(unit.grammarIds).toContain(anchor);
   expect(deepTeachingAnchors(unitId)[0]).toBe(anchor);
   const steps=buildCur03CourseUnitSession(unitId);
   const teaching=steps[1];
   if(!teaching||!isStudyLesson(teaching))throw Error("CUR13_TEACHING_MISSING");
   expect(teaching.id).toBe("cur03-"+unitId+"-"+anchor+"-context");
   expect(teaching.examples).toHaveLength(count);
   const authentic=new Set(coreContent.sentences.filter(s=>unit.sentenceIds.includes(s.id)).map(s=>s.text));
   for(const e of teaching.examples??[])expect(authentic.has(e.expression)).toBe(true);
   expect(new Set(steps.map(s=>s.id)).size).toBe(steps.length);
  }
 });
 it("keeps the ordered canonical player steps unchanged and new tasks ungraded",()=>{
  for(const [unitId,anchor] of cases){
   const before=courseUnitSession(unitId),after=buildCur03CourseUnitSession(unitId);
   let last=-1;
   for(const step of before){
    const index=after.findIndex((s,i)=>i>last&&s.id===step.id);
    expect(index).toBeGreaterThan(last);
    expect(after[index]).toEqual(step);
    last=index;
   }
   const added=after.filter(s=>!isStudyLesson(s)&&s.eventMetadata?.cur03Anchor===anchor);
   expect(added).toHaveLength(4);
   expect(added.filter(s=>!isStudyLesson(s)&&s.promptType==="choice")).toHaveLength(3);
   expect(added.filter(s=>!isStudyLesson(s)&&s.promptType==="textarea")).toHaveLength(1);
   const unit=coreContent.courseUnits.find(u=>u.id===unitId)!;
   for(const step of added)if(!isStudyLesson(step)){
    expect(step.primaryTarget).toEqual({kind:"can_do",id:unit.canDoId});
    expect(step.sourceId).toBe("thiepn-original");
    expect(step.eventMetadata).toMatchObject({cur03UnitId:unitId,cur03Anchor:anchor,nonAuthoritative:true,
      schedulerExcluded:true,independentCompetenceVerified:false});
    if(step.promptType==="choice"){
     expect(step.choices).toHaveLength(3);
     expect(new Set(step.choices).size).toBe(3);
     expect(step.choices).toContain(step.acceptedAnswers[0]);
     expect(step.eventMetadata?.e06FoilFeedback).toHaveLength(2);
    }else expect(step.acceptedAnswers).toEqual([]);
   }
  }
 });
 it("does not leak context to other units sharing grammar",()=>{
  for(const [unitId,anchor] of cases){
   const others=coreContent.courseUnits.filter(u=>u.level==="A1"&&u.id!==unitId&&u.grammarIds.includes(anchor));
   for(const u of others){
    expect(deepTeachingAnchors(u.id)).not.toContain(anchor);
    expect(buildCur03CourseUnitSession(u.id).some(s=>s.id==="cur03-"+u.id+"-"+anchor+"-context")).toBe(false);
   }
  }
 });
});

describe("CUR-14 exact source-backed foundational A1 teaching",()=>{
 const additions=[
  ["a1-unit-01","grammar-desu",2],
  ["a1-unit-03","grammar-masu",4],
  ["a1-unit-06","grammar-ga-subject",2],
  ["a1-unit-16","grammar-o-kudasai",4]
 ] as const;
 it("starts with each unit's own lesson and renders only its canonical original Japanese sentences",()=>{
  for(const [id,anchor,count] of additions){
   const u=coreContent.courseUnits.find(x=>x.id===id)!;
   expect(u.level).toBe("A1");
   expect(u.sourceIds).toEqual(["thiepn-original"]);
   expect(u.grammarIds).toContain(anchor);
   expect(deepTeachingAnchors(id)[0]).toBe(anchor);
   const session=buildCur03CourseUnitSession(id);
   const intro=session[1];
   if(!intro||!isStudyLesson(intro))throw Error("CUR14_CONTEXT_NOT_FOUND");
   expect(intro.id).toBe("cur03-"+id+"-"+anchor+"-context");
   expect(intro.examples).toHaveLength(count);
   const sourceTexts=new Set(coreContent.sentences.filter(s=>u.sentenceIds.includes(s.id)).map(s=>s.text));
   for(const e of intro.examples??[])expect(sourceTexts.has(e.expression)).toBe(true);
   expect(new Set(session.map(s=>s.id)).size).toBe(session.length);
  }
 });
 it("preserves original session steps and keeps all teaching responses excluded from FSRS",()=>{
  for(const [id,anchor] of additions){
   const original=courseUnitSession(id),actual=buildCur03CourseUnitSession(id);
   let last=-1;
   for(const step of original){
    const i=actual.findIndex((s,k)=>k>last&&s.id===step.id);
    expect(i).toBeGreaterThan(last);
    expect(actual[i]).toEqual(step);
    last=i;
   }
   const u=coreContent.courseUnits.find(x=>x.id===id)!;
   const prompts=actual.filter(s=>!isStudyLesson(s)&&s.eventMetadata?.cur03Anchor===anchor);
   expect(prompts).toHaveLength(4);
   expect(prompts.filter(s=>!isStudyLesson(s)&&s.promptType==="choice")).toHaveLength(3);
   expect(prompts.filter(s=>!isStudyLesson(s)&&s.promptType==="textarea")).toHaveLength(1);
   for(const step of prompts)if(!isStudyLesson(step)){
    expect(step.primaryTarget).toEqual({kind:"can_do",id:u.canDoId});
    expect(step.sourceId).toBe("thiepn-original");
    expect(step.eventMetadata).toMatchObject({cur03UnitId:id,cur03Anchor:anchor,
      nonAuthoritative:true,schedulerExcluded:true,independentCompetenceVerified:false});
    if(step.promptType==="choice"){
     expect(step.choices).toHaveLength(3);
     expect(new Set(step.choices).size).toBe(3);
     expect(step.choices).toContain(step.acceptedAnswers[0]);
     expect(step.eventMetadata?.e06FoilFeedback).toHaveLength(2);
    }else expect(step.acceptedAnswers).toEqual([]);
   }
  }
 });
 it("does not leak unit-specific examples to other units with the same grammar",()=>{
  for(const [id,anchor] of additions){
   const others=coreContent.courseUnits.filter(u=>u.level==="A1"&&u.id!==id&&u.grammarIds.includes(anchor));
   for(const u of others){
    expect(deepTeachingAnchors(u.id)).not.toContain(anchor);
    expect(buildCur03CourseUnitSession(u.id).some(s=>s.id==="cur03-"+u.id+"-"+anchor+"-context")).toBe(false);
   }
  }
 });
});
