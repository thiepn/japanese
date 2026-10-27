import type {CourseUnitProgress} from "./runtime";
import {COURSE_LEVELS,type CourseLevel} from "./cefrCourseCatalog";

export const ENTRY_SELF_REPORT=[
 {id:"new",label:"New to Japanese",level:"A1"},
 {id:"basic",label:"Understand short everyday exchanges",level:"A2"},
 {id:"connected",label:"Follow connected conversations about familiar topics",level:"B1"},
 {id:"independent",label:"Discuss detailed everyday and abstract topics",level:"B2"},
 {id:"advanced",label:"Work with complex nuanced Japanese texts",level:"C1"},
 {id:"very-advanced",label:"Explore the most advanced material",level:"C2"}
] as const;
export type EntrySelfReport=typeof ENTRY_SELF_REPORT[number]["id"];
export type EntryAdvice=Readonly<{requested:CourseLevel;suggested:CourseLevel;unitId:string;title:string;basis:"self-report";availability:"available";message:string}>;
/** Optional navigation suggestion, NOT a CEFR test, gate, performance grade or learner state. */
export function recommendCourseEntry(selfReport:EntrySelfReport,course:readonly CourseUnitProgress[]):EntryAdvice|null{
 const choice=ENTRY_SELF_REPORT.find(item=>item.id===selfReport);
 if(!choice)throw Error("CUR04_UNKNOWN_SELF_REPORT");
 const ids=new Set<string>();
 for(const item of course){
  if(ids.has(item.id)||!COURSE_LEVELS.some(level=>level===item.level)||!item.id||!item.title.trim())
   throw Error("CUR04_INVALID_COURSE_PROGRESS");
  ids.add(item.id);
 }
 const requested=choice.level;
 const levels=[...COURSE_LEVELS];
 const targetIndex=levels.indexOf(requested);
 // Only offer existing source-backed units, and never infer a higher level.
 const candidates=levels.slice(0,targetIndex+1).reverse();
 const suggested=candidates.find(level=>course.some(unit=>unit.level===level));
 if(!suggested)return null;
 const units=course.filter(unit=>unit.level===suggested).sort((a,b)=>a.order-b.order);
 const first=units.find(unit=>unit.status==="learning")??
   units.find(unit=>unit.status!=="mastered")??units[0]!;
 return {requested,suggested,unitId:first.id,title:first.title,basis:"self-report",availability:"available",
  message:requested===suggested
   ?"Suggested starting point based on your description, not a placement score."
   :"No available source-backed unit at "+requested+"; "+suggested+" is the nearest lower level with content."};
}
