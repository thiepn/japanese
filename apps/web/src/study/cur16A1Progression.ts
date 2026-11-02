import {isStudyLesson,type StudyStep} from "@thiepn/study-player";

export interface OriginalCourseJump {
  /** Index of the original canonical lesson, not a graded completion event. */
  index:number;
  /** Number of optional instruction/transfer steps bypassed, never credited. */
  skippedSteps:number;
}

/**
 * The CUR-03 original A1 can-do introduction is followed by one or more complete
 * original authored but optional context cases. Each case is 7 navigation steps.
 * Find only the first unchanged canonical lesson after these cases.
 * The helper intentionally refuses unrelated, malformed or already-core sessions.
 */
export function optionalA1ContextJump(steps:readonly StudyStep[],currentIndex:number):OriginalCourseJump|null {
  const intro=steps[0];
  if(!intro||!isStudyLesson(intro)||!Number.isInteger(currentIndex)||currentIndex<0||currentIndex>=steps.length)return null;
  const unit=/^lesson-(a1-unit-(?:0[1-9]|1[0-9]|20))-intro$/.exec(intro.id)?.[1];
  if(!unit)return null;
  const prefix="cur03-"+unit+"-";
  let i=1;
  while(i<steps.length&&steps[i]!.id.startsWith(prefix))i++;
  if(i<=1||i>=steps.length||!isStudyLesson(steps[i]!))return null;
  const active=steps[currentIndex]!;
  // Never jump from graded content or from a partly written response.
  if(currentIndex!==0&&(!isStudyLesson(active)||!active.id.startsWith(prefix)))return null;
  // Original canonical steps must remain after the optional context prelude.
  if(steps.slice(i).some(s=>s.id.startsWith(prefix)))return null;
  return {index:i,skippedSteps:i-Math.max(1,currentIndex)};
}

/** Open an existing source-owned, ungraded A1 writing prompt from the intro.
 * Never credit bypassed guided prompts or duplicate the grading/scheduling path. */
export function optionalA1IndependentWritingJump(steps:readonly StudyStep[],currentIndex:number):OriginalCourseJump|null{
 if(currentIndex!==0)return null;
 const core=optionalA1ContextJump(steps,0);
 const unit=/^lesson-(a1-unit-(?:0[1-9]|1[0-9]|20))-intro$/.exec(steps[0]?.id??"")?.[1];
 if(!core||!unit)return null;
 const index=steps.findIndex((step,i)=>i>0&&i<core.index&&!isStudyLesson(step)&&
   step.id.startsWith("cur03-"+unit+"-")&&step.id.endsWith("-independent")&&
   step.promptType==="textarea"&&step.eventMetadata?.cur03UnitId===unit&&
   step.eventMetadata?.nonAuthoritative===true&&step.eventMetadata?.schedulerExcluded===true&&
   step.eventMetadata?.independentCompetenceVerified===false);
 return index<0?null:{index,skippedSteps:index-1};
}
