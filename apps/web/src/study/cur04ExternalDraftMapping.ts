import {coreContent} from "../coreContent";
/**
 * Source-pinned identity-only handoff. PR #103 has NOT been merged; none of its
 * authored teaching, grading, sequential locks or asset rights cross this gate.
 */
export const EXTERNAL_A1_DRAFT={
 repository:"thiepn/japanese",
 branch:"feature/course-first-a1-c0-c1",
 revision:"1e3667ebdcb0cd50491c126b948c11f47414decb",
 originalSourceId:"thiepn-original",
 path:"apps/web/src/study/courseFirstA1.ts",
 editorReview:"pending",
 publishable:false
} as const;
const UNIT_NUMBERS=["01","02","03","04","05","07","12","15","16","17","18","19","20"] as const;
export interface ExternalDraftLessonIdentity {
 readonly id:string;
 readonly unitId:string;
 readonly nativeCanDoId:string;
 readonly nativeUnitSourceIds:readonly string[];
 readonly originRevision:string;
 readonly sourceOwner:"thiepn/japanese";
 readonly status:"unmerged-external-draft";
 readonly publishable:false;
}
/**
 * Exact original unit + can-do association is mandatory. This never exposes
 * or imports external authored exercises, never unlocks them, and creates no events.
 */
export function sourcePinnedExternalA1Identities():readonly ExternalDraftLessonIdentity[]{
 const byUnit=new Map(coreContent.courseUnits.map(unit=>[unit.id,unit]));
 const out:ExternalDraftLessonIdentity[]=[];
 for(const n of UNIT_NUMBERS){
  const unitId="a1-unit-"+n,unit=byUnit.get(unitId);
  if(!unit||unit.level!=="A1"||!unit.sourceIds.length||
    !coreContent.canDos.some(c=>c.id===unit.canDoId&&c.sourceIds.length>0))
    throw Error("CUR04_UNVERIFIED_EXTERNAL_CANONICAL_UNIT:"+unitId);
  for(let lesson=1;lesson<=6;lesson++)out.push({
   id:"cf-a1-"+n+"-"+String(lesson).padStart(2,"0"),
   unitId,nativeCanDoId:unit.canDoId,nativeUnitSourceIds:unit.sourceIds,
   originRevision:EXTERNAL_A1_DRAFT.revision,
   sourceOwner:"thiepn/japanese",
   status:"unmerged-external-draft",publishable:false
  });
 }
 if(new Set(out.map(x=>x.id)).size!==out.length)throw Error("CUR04_EXTERNAL_DUPLICATE");
 return out;
}
/** Deliberately refuse to convert a draft identity into a released lesson. */
export function resolveExternalA1LessonAsInstalled(id:string):never{
 if(sourcePinnedExternalA1Identities().some(candidate=>candidate.id===id))
  throw Error("CUR04_EXTERNAL_LESSON_NOT_INSTALLED:"+id);
 throw Error("CUR04_UNKNOWN_EXTERNAL_LESSON:"+id);
}
