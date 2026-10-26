import {describe,it,expect} from "vitest";
import {buildJapaneseLevelCatalog,COURSE_LEVELS,courseLocation,parseCourseLocation} from "../../apps/web/src/study/cefrCourseCatalog";
import {coreContent} from "../../apps/web/src/coreContent";
describe("CUR-01 canonical Japanese curriculum compatibility",()=>{
  it("exposes all six levels with no invented C2 lessons",()=>{
    const catalog=buildJapaneseLevelCatalog([]);
    expect(catalog.map(item=>item.level)).toEqual([...COURSE_LEVELS]);
    expect(catalog.find(item=>item.level==="C2")).toMatchObject({availability:"planned",lessons:[]});
    expect(catalog.flatMap(item=>item.lessons).length).toBe(coreContent.courseUnits.length);
  });
  it("preserves original course-unit IDs, titles, source references, and level",()=>{
    const catalog=buildJapaneseLevelCatalog([]);
    for(const legacy of coreContent.courseUnits){
      const unit=catalog.flatMap(item=>item.lessons).find(item=>item.id===legacy.id);
      expect(unit).toMatchObject({legacyUnitId:legacy.id,title:legacy.title,level:legacy.level,sourceIds:legacy.sourceIds,progress:null});
    }
  });
  it("keeps existing saved evidence rather than manufacturing completion",()=>{
    const canonical=coreContent.courseUnits[0]!;
    const evidence={id:canonical.id,order:canonical.order,title:canonical.title,level:canonical.level,canDo:"",status:"learning" as const,mastery:.2,evidenceCount:3,
      assessment:{status:"waiting" as const,answered:0,total:0,eligibleAt:null}};
    const lesson=buildJapaneseLevelCatalog([evidence as import("../../apps/web/src/study/runtime").CourseUnitProgress])
      .flatMap(level=>level.lessons).find(unit=>unit.id===canonical.id)!;
    expect(lesson.progress).toBe(evidence);
    expect(lesson.legacyUnitId).toBe(canonical.id);
  });
  it("supports shareable navigation while rejecting malformed and unknown levels",()=>{
    const url=courseLocation("B1","course-with?special");
    expect(parseCourseLocation(url)).toEqual({level:"B1",unitId:"course-with?special"});
    expect(parseCourseLocation("#course/C2")).toEqual({level:"C2",unitId:null});
    expect(parseCourseLocation("#course/N5")).toBeNull();
    expect(parseCourseLocation("#course/A1/%E0%A4%A")).toBeNull();
  });
});
