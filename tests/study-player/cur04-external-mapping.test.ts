import {describe,it,expect} from "vitest";
import {coreContent} from "../../apps/web/src/coreContent";
import {buildCur03CourseUnitSession} from "../../apps/web/src/study/cur03A1DeepCourse";
import {EXTERNAL_A1_DRAFT,sourcePinnedExternalA1Identities,resolveExternalA1LessonAsInstalled} from "../../apps/web/src/study/cur04ExternalDraftMapping";
describe("CUR-04 explicit Japanese PR #103 draft-only source ownership",()=>{
 it("links precisely 78 external draft IDs to 13 existing source-backed native A1 units",()=>{
  const identities=sourcePinnedExternalA1Identities();
  expect(identities).toHaveLength(78);
  expect(new Set(identities.map(x=>x.id)).size).toBe(78);
  expect(new Set(identities.map(x=>x.unitId)).size).toBe(13);
  for(const id of identities){
   const unit=coreContent.courseUnits.find(u=>u.id===id.unitId)!;
   expect(unit.level).toBe("A1");
   expect(id.nativeCanDoId).toBe(unit.canDoId);
   expect(id.nativeUnitSourceIds).toEqual(unit.sourceIds);
   expect(id.originRevision).toBe(EXTERNAL_A1_DRAFT.revision);
   expect(id.publishable).toBe(false);
   expect(id.id).toMatch(/^cf-a1-\d{2}-\d{2}$/);
  }
 });
 it("refuses release and does not collide with installed CUR-03 or original study step IDs",()=>{
  const external=sourcePinnedExternalA1Identities();
  const native=new Set(coreContent.courseUnits.filter(u=>u.level==="A1")
   .flatMap(u=>buildCur03CourseUnitSession(u.id).map(s=>s.id)));
  expect(external.every(candidate=>!native.has(candidate.id))).toBe(true);
  expect(EXTERNAL_A1_DRAFT.publishable).toBe(false);
  expect(EXTERNAL_A1_DRAFT.editorReview).toBe("pending");
  expect(()=>resolveExternalA1LessonAsInstalled(external[0]!.id)).toThrow(/NOT_INSTALLED/);
  expect(()=>resolveExternalA1LessonAsInstalled("invented")).toThrow(/UNKNOWN_EXTERNAL_LESSON/);
 });
});