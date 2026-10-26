import type {StudyPrompt,StudyStep} from "@thiepn/study-player";

// An immediate correction consolidates the answer but must not advance a
// spaced-repetition card before the next genuinely delayed encounter.
export function appendKanaCorrection(
  steps:readonly StudyStep[],
  failed:StudyPrompt,
  alreadyRetried:Set<string>,
):StudyStep[]{
  if(failed.primaryTarget.kind!=="kana"||failed.eventMetadata?.kanaImmediateRetry===true||
    alreadyRetried.has(failed.id))return [...steps];
  alreadyRetried.add(failed.id);
  return [...steps,{
    ...failed,
    eventMetadata:{
      ...failed.eventMetadata,
      schedulerExcluded:true,
      kanaImmediateRetry:true
    }
  }];
}
