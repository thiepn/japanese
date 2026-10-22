export type CourseFirstChoice=readonly [question:string,answer:string,foil1:string,foil2:string,explanation:string];
export type CourseFirstAuthoredLesson={id:string;title:string;objective:string;teach:string;
 examples:readonly (readonly [japanese:string,meaning:string])[];
 checks:readonly CourseFirstChoice[];recall:readonly [question:string,answer:string];writing:string};
export type CourseFirstCapstone={id:string;title:string;scene:string;objective:string};
export type CourseFirstLesson=CourseFirstAuthoredLesson|CourseFirstCapstone;
export type CourseFirstUnit={id:string;title:string;objective:string;lessons:readonly CourseFirstLesson[]};
export type Stage="encounter"|"explain"|"guided"|"read"|"transfer"|"independent";
export type EditorialRecord={
 unitId:string;sourceId:"thiepn-original";level:"A1";rights:"original-owned";
 stageSequence:readonly Stage[];lessonObjectives:readonly string[];grammarFocus:readonly string[];
 recordedAudio:"none";synthesis:"device-only";independentWriting:"ungraded";
 linguisticReview:"pending";measuredStudyMinutes:null;
};
export const C2_STAGES:readonly Stage[]=["encounter","explain","guided","read","transfer","independent"];
export function isCourseFirstCapstone(l:CourseFirstLesson):l is CourseFirstCapstone{return "scene" in l;}

/** Source, objective and exercise gate. Editorial review is tracked but never invented. */
export function validateAuthoredCourse(
 units:readonly CourseFirstUnit[],
 records:readonly EditorialRecord[],
 canDos:ReadonlyMap<string,string>,
 scenes:ReadonlyMap<string,string>,
 originalSourceExportable:boolean
):string[]{
 const errors:string[]=[];
 const seenUnits=new Set<string>(),seenLessons=new Set<string>(),seenPromptIds=new Set<string>();
 for(const unit of units){
  if(seenUnits.has(unit.id))errors.push("duplicate-unit:"+unit.id);
  seenUnits.add(unit.id);
  const unitNum=unit.id.match(/^a1-unit-(\d{2})$/)?.[1];
  if(!unitNum)errors.push("unit-id:"+unit.id);
  if(!canDos.has(unit.id))errors.push("no-canonical-can-do:"+unit.id);
  if(!unit.title.trim()||!unit.objective.trim())errors.push("no-unit-objective:"+unit.id);
  const record=records.find(r=>r.unitId===unit.id);
  if(!record){errors.push("no-editorial-record:"+unit.id);continue;}
  if(record.level!=="A1"||record.sourceId!=="thiepn-original"||record.rights!=="original-owned"||!originalSourceExportable)
   errors.push("source-rights:"+unit.id);
  if(record.recordedAudio!=="none"||record.synthesis!=="device-only"||
     record.independentWriting!=="ungraded"||record.measuredStudyMinutes!==null)
   errors.push("unverified-evidence:"+unit.id);
  if(record.stageSequence.join("/")!==C2_STAGES.join("/"))errors.push("stage-sequence:"+unit.id);
  if(record.lessonObjectives.length!==unit.lessons.length||
     record.lessonObjectives.some((o,i)=>o!==unit.lessons[i]?.objective))
   errors.push("objective-map:"+unit.id);
  if(!record.grammarFocus.length)errors.push("no-grammar-map:"+unit.id);
  if(unit.lessons.length!==6)errors.push("lesson-count:"+unit.id);
  for(const [i,lesson] of unit.lessons.entries()){
   const idExpected="cf-a1-"+unitNum+"-"+String(i+1).padStart(2,"0");
   if(lesson.id!==idExpected)errors.push("lesson-order:"+lesson.id);
   if(seenLessons.has(lesson.id))errors.push("duplicate-lesson:"+lesson.id);
   seenLessons.add(lesson.id);
   if(!lesson.title.trim()||!lesson.objective.trim())errors.push("missing-lesson-objective:"+lesson.id);
   if(isCourseFirstCapstone(lesson)){
    if(i!==unit.lessons.length-1||scenes.get(lesson.scene)!==unit.id)
     errors.push("unlinked-capstone:"+lesson.id);
    continue;
   }
   if(i===unit.lessons.length-1)errors.push("missing-capstone:"+lesson.id);
   if(lesson.teach.trim().length<75||lesson.examples.length<3||lesson.checks.length<4||
      !lesson.writing.trim()||!lesson.recall[1].trim())errors.push("thin-teaching:"+lesson.id);
   const choices=lesson.checks;
   for(const [index,[question,answer,wrong1,wrong2,explanation]] of choices.entries()){
    const pid=lesson.id+"-choice-"+(index+1);
    if(seenPromptIds.has(pid))errors.push("duplicate-prompt:"+pid);
    seenPromptIds.add(pid);
    if(!question.trim()||!answer.trim()||!explanation.trim()||
       new Set([answer,wrong1,wrong2]).size!==3)errors.push("invalid-choice:"+pid);
   }
   const rid=lesson.id+"-recall";
   if(seenPromptIds.has(rid))errors.push("duplicate-prompt:"+rid);
   seenPromptIds.add(rid);
  }
 }
 for(const r of records)if(!seenUnits.has(r.unitId))errors.push("orphan-editorial-record:"+r.unitId);
 return errors;
}
/** Objective/rights ledger. Missing audio, verified competence and duration remain explicit gaps. */
export function courseCoverage(units:readonly CourseFirstUnit[],records:readonly EditorialRecord[]){
 return units.map(unit=>{
  const meta=records.find(r=>r.unitId===unit.id);
  return {unitId:unit.id,lessonCount:unit.lessons.length,objectiveCount:unit.lessons.length+1,
   controlledChecks:unit.lessons.reduce((sum,l)=>sum+(isCourseFirstCapstone(l)?4:l.checks.length+1),0),
   unscoredWritingTasks:unit.lessons.filter(l=>!isCourseFirstCapstone(l)).length,
   sourceId:meta?.sourceId??null,humanReviewed:meta?.linguisticReview==="approved",
   recordedAudioAvailable:meta?.recordedAudio!=="none",verifiedStudyMinutes:meta?.measuredStudyMinutes??null,
   independentCompetenceVerified:false,rights:meta?.rights??"missing"};
 });
}
