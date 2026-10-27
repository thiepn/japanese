import {describe,it,expect} from "vitest";
import {coreContent} from "../../apps/web/src/coreContent";
import {buildJapaneseLevelCatalog,parseCourseLocation,courseLocation} from "../../apps/web/src/study/cefrCourseCatalog";
import {buildCur03CourseUnitSession,deepTeachingAnchors} from "../../apps/web/src/study/cur03A1DeepCourse";
import {coursePositionKey,coursePositionFingerprint,saveCoursePosition,readCoursePosition,clearCoursePosition,type PositionStore} from "../../apps/web/src/study/cur03CoursePosition";
import {ENTRY_SELF_REPORT,recommendCourseEntry} from "../../apps/web/src/study/cur04Placement";
import type {CourseUnitProgress} from "../../apps/web/src/study/runtime";
class Store implements PositionStore{
 data=new Map<string,string>();getItem(k:string){return this.data.get(k)??null}
 setItem(k:string,v:string){this.data.set(k,v)}removeItem(k:string){this.data.delete(k)}
}
const units=coreContent.courseUnits;
const practice=units.find(u=>u.level==="A1"&&deepTeachingAnchors(u.id).length)!;
const steps=buildCur03CourseUnitSession(practice.id);
const projected=(arr:readonly typeof units[number][])=>arr.map(u=>({
 id:u.id,level:u.level,order:u.order,title:u.title,status:"ready",mastery:0,evidenceCount:0,
 assessment:{status:"waiting",answered:0,total:0,eligibleAt:null}
})) as unknown as CourseUnitProgress[];
describe("CUR-04 exact-source lesson recovery",()=>{
 it("ties the versioned checkpoint to the entire authored lesson, not just its IDs",()=>{
  const store=new Store();
  expect(saveCoursePosition("account-1",practice.id,steps,3,store)).toBe(true);
  expect(readCoursePosition("account-1",practice.id,steps,store)).toBe(3);
  const body=steps.map((step,i)=>i===1?{...step,title:"Author-reviewed correction"}:step);
  expect(body.map(s=>s.id)).toEqual(steps.map(s=>s.id));
  expect(coursePositionFingerprint(body)).not.toBe(coursePositionFingerprint(steps));
  expect(readCoursePosition("account-1",practice.id,body,store)).toBe(0);
  expect(readCoursePosition("account-1",practice.id,steps,store)).toBe(3);
  const changedAnswer=steps.map((step,i)=>i===3&&"acceptedAnswers" in step
    ?{...step,acceptedAnswers:["edited-answer"]}:step);
  expect(readCoursePosition("account-1",practice.id,changedAnswer,store)).toBe(0);
 });
 it("stores only a short fingerprint, unit and step identity; no text or learner responses",()=>{
  const store=new Store();
  saveCoursePosition("account-1",practice.id,steps,1,store);
  const receipt=store.getItem(coursePositionKey("account-1",practice.id))!;
  const data=JSON.parse(receipt);
  expect(data.version).toBe(2);
  expect(data.fingerprint).toMatch(/^[a-f0-9]{16}$/);
  expect(receipt.length).toBeLessThan(400);
  expect(receipt).not.toContain("acceptedAnswers");
  expect(receipt).not.toContain("situation");
  expect(receipt).not.toContain("eventMetadata");
  expect(receipt).not.toContain("learnerResponse");
  expect(readCoursePosition("account-2",practice.id,steps,store)).toBe(0);
 });
 it("rejects the old ID-only pointer, forged step, corrupt receipt and future ordinal",()=>{
  const store=new Store(),key=coursePositionKey("account-1",practice.id);
  expect(key).toContain("cur04-position-v2");
  store.setItem(key,JSON.stringify({version:1,unitId:practice.id,ordinal:1,stepId:steps[1]?.id,manifest:"id-only"}));
  expect(readCoursePosition("account-1",practice.id,steps,store)).toBe(0);
  saveCoursePosition("account-1",practice.id,steps,1,store);
  const data=JSON.parse(store.getItem(key)!);
  store.setItem(key,JSON.stringify({...data,stepId:"alien"}));
  expect(readCoursePosition("account-1",practice.id,steps,store)).toBe(0);
  store.setItem(key,JSON.stringify({...data,ordinal:999}));
  expect(readCoursePosition("account-1",practice.id,steps,store)).toBe(0);
  expect(clearCoursePosition("account-1",practice.id,store)).toBe(true);
 });
 it("rejects duplicate IDs, blank scope and a disabled browser store",()=>{
  const broken:PositionStore={getItem(){throw Error("offline")},setItem(){throw Error("quota")},removeItem(){throw Error("denied")}};
  expect(readCoursePosition("account-1",practice.id,steps,broken)).toBe(0);
  expect(saveCoursePosition("account-1",practice.id,steps,0,broken)).toBe(false);
  expect(clearCoursePosition("account-1",practice.id,broken)).toBe(false);
  expect(()=>coursePositionKey("",practice.id)).toThrow(/BAD_SCOPE/);
  expect(()=>coursePositionFingerprint([steps[0]!,steps[0]!])).toThrow(/DUPLICATE_STEP/);
 });
});
describe("CUR-04 optional advice is not placement credit",()=>{
 it("keeps six independent selectable levels and source-original identities",()=>{
  const catalog=buildJapaneseLevelCatalog([]);
  expect(catalog.map(v=>v.level)).toEqual(["A1","A2","B1","B2","C1","C2"]);
  expect(parseCourseLocation(courseLocation("B1",units.find(x=>x.level==="B1")!.id))).toMatchObject({level:"B1"});
  expect(catalog.flatMap(v=>v.lessons).map(v=>v.id).sort()).toEqual(units.map(u=>u.id).sort());
 });
 it("recommends a recorded-content entry, not a score or locked prerequisite",()=>{
  const progress=projected(units);
  for(const selfReport of ENTRY_SELF_REPORT){
   const advice=recommendCourseEntry(selfReport.id,progress);
   expect(advice?.unitId).toBeTruthy();
   expect(progress.some(u=>u.id===advice?.unitId)).toBe(true);
   expect(advice?.suggested).not.toBe("C2");
   expect(advice?.basis).toBe("self-report");
  }
  expect(recommendCourseEntry("advanced",[])).toBeNull();
  expect(()=>recommendCourseEntry("not-real" as "new",progress)).toThrow(/UNKNOWN_SELF_REPORT/);
 });
 it("does not mutate any saved evidence, reorder the original array or invent mastery",()=>{
  const progress=projected(units);
  const snapshot=JSON.stringify(progress);
  const advice=recommendCourseEntry("very-advanced",progress);
  expect(JSON.stringify(progress)).toBe(snapshot);
  expect(advice?.availability).toBe("available");
  expect(advice?.message).not.toMatch(/passed|certified|mastered/);
 });
 it("does not expose unmerged PR103 cf-a1 identities or relabel existing CUR-03 steps",()=>{
  expect(steps.every(s=>!s.id.startsWith("cf-a1-"))).toBe(true);
  expect(steps.some(s=>s.id.startsWith("cur03-"))).toBe(true);
  expect(steps.some(s=>s.id.startsWith("lesson-"))).toBe(true);
 });
});
