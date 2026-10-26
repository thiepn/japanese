import {coreContent,canDoDescriptor} from "../coreContent";
import type {CourseUnitProgress} from "./runtime";

/** Navigation-only mirror of THIEPN Languages' CEFR_LEVELS contract. */
export const COURSE_LEVELS=["A1","A2","B1","B2","C1","C2"] as const;
export type CourseLevel=typeof COURSE_LEVELS[number];
export interface ExistingCourseLesson {
  readonly id:string;
  readonly legacyUnitId:string;
  readonly title:string;
  readonly number:number;
  readonly level:CourseLevel;
  readonly canDo:string;
  readonly sourceIds:readonly string[];
  readonly progress:CourseUnitProgress|null;
}
export interface JapaneseLevelCatalog {
  readonly level:CourseLevel;
  readonly availability:"available"|"planned";
  readonly lessons:readonly ExistingCourseLesson[];
}

/** Retains canonical course-unit IDs. Presentation numbers are NOT event identities. */
export function buildJapaneseLevelCatalog(progress:readonly CourseUnitProgress[]):readonly JapaneseLevelCatalog[]{
  const progressById=new Map(progress.map(item=>[item.id,item]));
  if(progressById.size!==progress.length)throw new Error("CUR01_DUPLICATE_PROGRESS_ID");
  const canonicalIds=new Set<string>();
  for(const unit of coreContent.courseUnits){
    if(canonicalIds.has(unit.id))throw new Error("CUR01_DUPLICATE_CANONICAL_UNIT:"+unit.id);
    canonicalIds.add(unit.id);
    if(!COURSE_LEVELS.some(level=>level===unit.level))throw new Error("CUR01_UNKNOWN_LEVEL:"+unit.level);
    if(!unit.sourceIds.length||unit.sourceIds.some(source=>!source.trim()))throw new Error("CUR01_MISSING_SOURCE:"+unit.id);
  }
  for(const entry of progress)if(!canonicalIds.has(entry.id))throw new Error("CUR01_UNKNOWN_PROGRESS_UNIT:"+entry.id);
  return COURSE_LEVELS.map(level=>{
    const units=coreContent.courseUnits.filter(unit=>unit.level===level).sort((a,b)=>a.order-b.order);
    const lessons:ExistingCourseLesson[]=units.map((unit,index)=>({
      id:unit.id,legacyUnitId:unit.id,title:unit.title,number:index+1,level,
      canDo:canDoDescriptor(unit.canDoId).statement,sourceIds:unit.sourceIds,
      progress:progressById.get(unit.id)??null
    }));
    return {level,availability:lessons.length?"available":"planned",lessons};
  });
}

/** A link chooses an existing lesson; it never awards credits or auto-launches a study session. */
export function parseCourseLocation(hash:string):{level:CourseLevel;unitId:string|null}|null{
  const segments=hash.match(/^#course\/(A1|A2|B1|B2|C1|C2)(?:\/([^/?#]+))?$/);
  if(!segments)return null;
  let unitId:string|null=null;
  if(segments[2]){
    try{unitId=decodeURIComponent(segments[2]);}catch{return null;}
    if(!unitId||unitId.includes("/")||unitId.length>160)return null;
  }
  return {level:segments[1] as CourseLevel,unitId};
}
export function courseLocation(level:CourseLevel,unitId?:string):string{
  return "#course/"+level+(unitId?"/"+encodeURIComponent(unitId):"");
}
