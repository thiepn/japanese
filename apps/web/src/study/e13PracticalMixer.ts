import type { StudyEvent } from "@thiepn/domain";
import { isStudyLesson, type StudyStep } from "@thiepn/study-player";
import {
  buildE11OptionalSession,
  getE06Overview,
  type E06CaseProgress,
} from "./e06IndependentCourse";
import { E11_BY_CASE } from "./e11PracticalTransfer";

/**
 * E13: one native session spanning independently source-qualified E11 cases.
 * No new prompts, event IDs, grade, scheduler, canonical mapping or storage.
 * E11 optional prompts retain their original nonAuthoritative/schedulerExcluded
 * flags; saved E12 writing remains private in the original owner's StudyEvents.
 */
export type E13PracticeMode = "understand" | "write-revise" | "whole-situation";
export const E13_MODE_OPTIONS: readonly {
  id:E13PracticeMode; label:string; description:string;
}[] = [
  {id:"understand",label:"Listen & read",description:"Solve the original audio and notice questions before revealing each answer and its context."},
  {id:"write-revise",label:"Write & revise",description:"Review the original dialogue, notice, language contrasts and recipient; write and revise your own Japanese."},
  {id:"whole-situation",label:"Full practical exchange",description:"Work through original listening, reading, language explanation and both private writing drafts."},
];

export function eligibleE13Progress(cases:readonly E06CaseProgress[]):E06CaseProgress[]{
  return cases.filter(c=>
    c.prerequisiteReady&&c.canDoId!==null&&c.canonicalUnitId!==null&&E11_BY_CASE.has(c.id)
  ).sort((a,b)=>{
    // Put situations with genuine missing evidence first, not invented mastery.
    const incomplete=(c:E06CaseProgress)=>[
      c.e11ListeningPractised,c.e11ReadingPractised,
      c.e11WritingSubmitted,c.e12RevisedWritingSubmitted,
    ].filter(Boolean).length;
    return incomplete(a)-incomplete(b)||a.level.localeCompare(b.level)||a.id.localeCompare(b.id);
  });
}

export function eligibleE13Cases(events:readonly StudyEvent[]):E06CaseProgress[]{
  return eligibleE13Progress(getE06Overview(events).cases);
}

function originalPart(steps:StudyStep[],id:string):number{
  const index=steps.findIndex(step=>isStudyLesson(step)&&step.id.endsWith(id));
  if(index<0)throw new Error("E13_ORIGINAL_LESSON_BOUNDARY_MISSING:"+id);
  return index;
}

function selectOriginalSteps(steps:StudyStep[],mode:E13PracticeMode):StudyStep[]{
  const coach=originalPart(steps,"-e11-letter-coach");
  const intro=steps[0];
  if(!intro||!isStudyLesson(intro))throw new Error("E13_ORIGINAL_INTRO_MISSING");
  if(mode==="whole-situation")return steps;
  if(mode==="understand")return steps.slice(0,coach);
  if(mode==="write-revise"){
    // The original recipient, dialogue, notice and lexical contrasts anchor the
    // writing; omit graded audio questions, not their source context.
    const suffixes=["-e11-setup","-e11-dialogue","-e11-notice","-e11-contrasts"];
    const context=suffixes.map(suffix=>steps[originalPart(steps,suffix)]!);
    return [intro,...context,...steps.slice(coach)];
  }
  throw new Error("E13_UNKNOWN_PRACTICE_MODE");
}

export function buildE13PracticalMix(
  caseIds:readonly string[],
  mode:E13PracticeMode,
  events:readonly StudyEvent[],
):StudyStep[]{
  if(!E13_MODE_OPTIONS.some(value=>value.id===mode))
    throw new Error("E13_UNKNOWN_PRACTICE_MODE");
  if(caseIds.length<2||caseIds.length>3||new Set(caseIds).size!==caseIds.length)
    throw new Error("E13_SELECT_TWO_OR_THREE_DISTINCT_CASES");
  const eligible=new Set(eligibleE13Cases(events).map(c=>c.id));
  if(caseIds.some(id=>!eligible.has(id)))
    throw new Error("E13_ORIGINAL_SOURCE_PREREQUISITES_REQUIRED");
  const result:StudyStep[]=[];
  const promptIds=new Set<string>();
  for(const caseId of caseIds){
    // Native builder enforces the original canonical Can-do and source
    // listening/reading gates a second time. No source-only preview is scored.
    const original=buildE11OptionalSession(caseId,events);
    const selected=selectOriginalSteps(original,mode);
    for(const step of selected){
      if(!isStudyLesson(step)){
        if(promptIds.has(step.id))throw new Error("E13_DUPLICATED_CANONICAL_PROMPT");
        promptIds.add(step.id);
        if(step.eventMetadata?.nonAuthoritative!==true||
           step.eventMetadata?.schedulerExcluded!==true)
          throw new Error("E13_UNAUTHORIZED_GRADED_PROMPT");
      }
    }
    result.push(...selected);
  }
  if(!promptIds.size)throw new Error("E13_NO_ORIGINAL_INTERACTION");
  return result;
}
