import type {StudyEvent} from "@thiepn/domain";
import type {MemoryTrace} from "@thiepn/scheduler";
import type {StudyPrompt} from "@thiepn/study-player";
import {kanaReviewTraceId,selectKanaReview,type KanaReviewReadiness,type KanaReviewScript,type KanaReviewSkill} from "./kanaReview";

/** Reusable two-sided view: language-specific content is supplied by canonical prompts. */
export interface FlashcardView {
  id:string;
  prompt:StudyPrompt;
  front:string;
  back:string;
  direction:string;
  state:"new"|"learning"|"review"|"relearning";
  dueAt:string|null;
}
export interface FlashcardLimits {newCards:number;reviews:number}
export const DEFAULT_FLASHCARD_LIMITS:FlashcardLimits={newCards:5,reviews:16};
export function normalizedFlashcardLimits(value:FlashcardLimits):FlashcardLimits{
  return {newCards:Math.max(0,Math.min(30,Math.floor(value.newCards)||0)),
    reviews:Math.max(0,Math.min(100,Math.floor(value.reviews)||0))};
}
export function asFlashcard(prompt:StudyPrompt,trace?:MemoryTrace):FlashcardView{
  const state=trace?.card.state;
  return {id:kanaReviewTraceId(prompt),prompt,front:prompt.prompt,back:prompt.displayAnswer,
    direction:prompt.skill==="form_selection"?"Sound → Kana":"Kana → Sound",
    state:state===1?"learning":state===2?"review":state===3?"relearning":"new",
    dueAt:trace?.card.due??null};
}
export function buildKanaFlashcards(
  script:KanaReviewScript,skill:KanaReviewSkill,
  traces:readonly MemoryTrace[],events:readonly StudyEvent[],now:Date,
  ready:KanaReviewReadiness,suspended:ReadonlySet<string>,
  limits:FlashcardLimits=DEFAULT_FLASHCARD_LIMITS,
):FlashcardView[]{
  const cap=normalizedFlashcardLimits(limits);
  const selection=selectKanaReview(script,skill,traces,events,now,ready,{
    maxDue:cap.reviews,maxNew:cap.newCards,maxSession:cap.reviews+cap.newCards,
    excluded:suspended
  });
  const indexed=new Map(traces.map(trace=>[trace.id,trace]));
  return selection.prompts.map(prompt=>asFlashcard(prompt,indexed.get(kanaReviewTraceId(prompt))));
}
export type FlashcardGrade="again"|"hard"|"good"|"easy";
export const FLASHCARD_GRADES:readonly FlashcardGrade[]=["again","hard","good","easy"];
export function gradeResult(grade:FlashcardGrade):"incorrect"|"partial"|"correct"{
  return grade==="again"?"incorrect":grade==="hard"?"partial":"correct";
}
