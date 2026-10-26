import {describe,it,expect} from "vitest";
import {isStudyLesson} from "@thiepn/study-player";
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
    expect(at).toBeGreaterThan(last);expect(after[at]).toBe(step);last=at;
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