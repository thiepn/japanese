import {isStudyLesson,type StudyStep} from "@thiepn/study-player";
import {coreContent} from "../coreContent";

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
  // Only the original optional CUR-03 context is bypassable; no graded
  // canonical step is ever eligible. The player shows this action for prompts
  // only after the response was successfully recorded, never during a draft.
  if(currentIndex!==0){
    if(!active.id.startsWith(prefix)||currentIndex>=i)return null;
    if(!isStudyLesson(active)){
      const anchor=active.eventMetadata?.cur03Anchor;
      if(typeof anchor!=="string"||!/^grammar-[a-z0-9-]+$/.test(anchor)||
        !new RegExp("^cur03-"+unit+"-"+anchor+"-(?:check-[1-3]|independent)$").test(active.id)||
        active.eventMetadata?.cur03!==true||active.eventMetadata?.cur03UnitId!==unit||
        active.eventMetadata?.nonAuthoritative!==true||active.eventMetadata?.schedulerExcluded!==true||
        active.eventMetadata?.independentCompetenceVerified!==false||active.sourceId!=="thiepn-original"||
        (active.promptType!=="choice"&&active.promptType!=="textarea")||
        (active.promptType==="choice"&&active.acceptedAnswers.length!==1)||
        (active.promptType==="textarea"&&active.acceptedAnswers.length!==0))
        return null;
    }
  }
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
   step.id.startsWith("cur03-"+unit+"-")&&step.id.endsWith("-independent"));
 if(index<0)return null;
 const target=steps[index]!;
 if(isStudyLesson(target)||target.promptType!=="textarea"||target.eventMetadata?.cur03UnitId!==unit||
   target.eventMetadata?.nonAuthoritative!==true||target.eventMetadata?.schedulerExcluded!==true||
   target.eventMetadata?.independentCompetenceVerified!==false||
   target.eventMetadata?.cur03!==true||target.sourceId!=="thiepn-original"||
   target.acceptedAnswers.length!==0||target.primaryTarget.kind!=="can_do")return null;
 return {index,skippedSteps:index-1};
}

/** Display-only source-based self-review. Does not judge learner text or mutate any study event. */
export function sourceLinkedA1WritingReview(steps:readonly StudyStep[],currentIndex:number):{
  explanation:string;
  examples:readonly {expression:string;note:string}[];
}|null{
 const step=steps[currentIndex];
 if(!step||isStudyLesson(step)||step.promptType!=="textarea"||step.sourceId!=="thiepn-original"||
   step.eventMetadata?.cur03!==true||step.eventMetadata?.nonAuthoritative!==true||
   step.eventMetadata?.schedulerExcluded!==true||step.eventMetadata?.independentCompetenceVerified!==false||
   step.acceptedAnswers.length!==0)return null;
 const unit=step.eventMetadata?.cur03UnitId,anchor=step.eventMetadata?.cur03Anchor;
 if(typeof unit!=="string"||!/^a1-unit-(?:0[1-9]|1[0-9]|20)$/.test(unit)||
    typeof anchor!=="string"||!/^grammar-[a-z0-9-]+$/.test(anchor))return null;
 const prefix="cur03-"+unit+"-"+anchor;
 if(step.id!==prefix+"-independent"||step.contextId!==prefix)return null;
 const context=steps.find(s=>s.id===prefix+"-context");
 const why=steps.find(s=>s.id===prefix+"-explanation");
 if(!context||!why||!isStudyLesson(context)||!isStudyLesson(why)||
   context.contextId!==prefix||why.contextId!==prefix||
   !context.sourceLabel?.includes("THIEPN original CUR-03 teaching · "+unit)||
   !why.sourceLabel?.includes("THIEPN original CUR-03 teaching · "+unit)||
   !context.examples?.length||!why.body.trim())return null;
 const sourceUnit=coreContent.courseUnits.find(u=>u.id===unit&&u.level==="A1"&&u.sourceIds.includes("thiepn-original"));
 if(!sourceUnit)return null;
 const sourceSentences=coreContent.sentences.filter(s=>sourceUnit.sentenceIds.includes(s.id));
 const originalTexts=new Set(sourceSentences.map(s=>s.text));
 // Shared grammar examples may be constructed; never label them as this unit's original source.
 const matched=context.examples.filter(e=>originalTexts.has(e.expression)).slice(0,2);
 const examples=matched.length?matched:sourceSentences.slice(0,2).map(s=>({
   expression:s.text,note:"Original sentence from this unit; compare its form with your own response."
 }));
 if(!examples.length)return null;
 return {explanation:why.body,examples};
}
