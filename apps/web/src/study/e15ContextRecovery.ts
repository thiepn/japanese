import type { StudyEvent } from "@thiepn/domain";
import { isStudyLesson, type StudyPrompt, type StudyStep } from "@thiepn/study-player";
import { buildE14HandoffSession, projectE14Review, type E14HandoffReview, type E14RecordedReview } from "./e14ListeningHandoff";

/**
 * Optional revisit suggestions over the EXISTING E11/E12 source events.
 * The 20h correction and 72h retrieval intervals are explicitly editorial
 * recommendations, NOT the canonical E10 delayed gate, FSRS schedule,
 * language mastery, or a newly persisted clock.
 */
export const E15_CORRECTION_REVISIT_MS = 20 * 60 * 60 * 1000;
export const E15_RETRIEVAL_REVISIT_MS = 72 * 60 * 60 * 1000;
export type E15Focus = "listen"|"reply-one"|"reply-two"|"first-draft"|"revision";

export type E15Advice = Readonly<{
  caseId:string;
  sourceGoal:string;
  focus:E15Focus;
  title:string;
  reason:"not-attempted"|"context-correction"|"independent-retrieval"|"writing-reflection"|"invalid-date";
  lastAttemptAt:string|null;
  nextSuggestedAt:string|null;
  ready:boolean;
  explanation:string;
}>;

const focusOrder:readonly E15Focus[]=["listen","reply-one","reply-two","first-draft","revision"];

function advice(caseReview:E14HandoffReview, row:E14RecordedReview, nowMs:number):E15Advice{
  if(!focusOrder.includes(row.key as E15Focus))throw new Error("E15_UNKNOWN_SOURCE_STAGE");
  const focus=row.key as E15Focus;
  const lastMs=row.lastAt===null?null:Date.parse(row.lastAt);
  const valid=lastMs===null||Number.isFinite(lastMs);
  const interval=row.result==="needs-context-review"
    ?E15_CORRECTION_REVISIT_MS:E15_RETRIEVAL_REVISIT_MS;
  const suggestionMs=valid&&lastMs!==null?lastMs+interval:null;
  const ready=valid&&(lastMs===null||Boolean(suggestionMs!==null&&nowMs>=suggestionMs));
  const reason:E15Advice["reason"]=!valid?"invalid-date"
    :row.result==="not-attempted"?"not-attempted"
    :row.result==="needs-context-review"?"context-correction"
    :row.result==="unscored-writing"?"writing-reflection":"independent-retrieval";
  const explanation=reason==="not-attempted"
    ?"This optional original task has no saved attempt yet."
    :reason==="context-correction"
      ?"The most recent bounded answer did not fit the original source. Revisit after a 20-hour pause, using the source's explanation."
      :reason==="writing-reflection"
        ?"A private writing draft exists. Revisit after 72 hours to review audience, factual detail and politeness yourself; no semantic grade is assigned."
        :reason==="invalid-date"
          ?"The saved local attempt has no usable timestamp. Reopen the original E14 handoff rather than inventing a due date."
          :"The latest supplied-answer choice matched its original context. Try retrieving it independently after 72 hours; this is not a speaking or mastery assessment.";
  return {
    caseId:caseReview.caseId,sourceGoal:caseReview.sourceGoal,focus,
    title:row.title,reason,lastAttemptAt:row.lastAt,
    nextSuggestedAt:suggestionMs===null?null:new Date(suggestionMs).toISOString(),
    ready,explanation,
  };
}

/**
 * All five stages are projected from source-checked E14 history. Caller only
 * supplies reviews produced for the currently authorized Japanese workspace;
 * no tokens, fresh scores, or duplicate storage are involved.
 */
export function planE15Revisits(
  reviews:readonly E14HandoffReview[],
  now=new Date(),
):E15Advice[]{
  const ms=now.getTime();
  if(!Number.isFinite(ms))throw new Error("E15_INVALID_NOW");
  const result:E15Advice[]=[];
  for(const report of reviews){
    if(!report.eligible)continue;
    const byKey=new Map(report.review.map(row=>[row.key,row]));
    for(const key of focusOrder){
      const row=byKey.get(key);
      if(!row)throw new Error("E15_SOURCE_STAGE_MISSING:"+report.caseId+":"+key);
      // A revision cannot be recorded without a prior original first draft;
      // the existing StudyPlayer enforces that same private E12 boundary.
      if(key==="revision"&&!byKey.get("first-draft")?.attempted)continue;
      result.push(advice(report,row,ms));
    }
  }
  const priority=(x:E15Advice)=>x.reason==="context-correction"?0
    :x.reason==="not-attempted"?1:x.reason==="writing-reflection"?2:3;
  return result.sort((a,b)=>Number(b.ready)-Number(a.ready)
    ||priority(a)-priority(b)
    ||(a.nextSuggestedAt??"").localeCompare(b.nextSuggestedAt??"")
    ||a.caseId.localeCompare(b.caseId)
    ||focusOrder.indexOf(a.focus)-focusOrder.indexOf(b.focus));
}

type E15Part="intro"|"setup"|"listen"|"dialogue"|"reading"|"notice"|
  "contrasts"|"rehearsal"|"firstReply"|"nextReply"|"letterCoach"|
  "letter"|"revisionCoach"|"revision"|"spoken";
const endings:Record<E15Part,string>={
  intro:"-e11-optional-intro",setup:"-e11-setup",listen:"-e11-micro-listening",
  dialogue:"-e11-dialogue",reading:"-e11-micro-reading",notice:"-e11-notice",
  contrasts:"-e11-contrasts",rehearsal:"-e11-role-rehearsal",
  firstReply:"-e11-role-response-1",nextReply:"-e11-role-response-2",
  letterCoach:"-e11-letter-coach",letter:"-e11-original-letter",
  revisionCoach:"-e12-revision-coach",revision:"-e12-revised-letter",
  spoken:"-e11-speaking-prep",
};
const sessionParts:Record<E15Focus,readonly E15Part[]>={
  listen:["intro","setup","listen","dialogue","reading","notice","contrasts"],
  "reply-one":["intro","setup","dialogue","rehearsal","firstReply","spoken"],
  "reply-two":["intro","setup","dialogue","rehearsal","nextReply","spoken"],
  "first-draft":["intro","setup","dialogue","contrasts","letterCoach","letter","revisionCoach","revision","spoken"],
  revision:["intro","setup","dialogue","contrasts","letterCoach","revisionCoach","revision","spoken"],
};

export function buildE15SourceRecovery(
  caseId:string,
  focus:E15Focus,
  owner:string,
  events:readonly StudyEvent[],
  now=new Date(),
):StudyStep[]{
  if(!owner||events.some(e=>e.userId!==owner))throw new Error("E15_OWNER_MISMATCH");
  if(!Object.prototype.hasOwnProperty.call(sessionParts,focus))
    throw new Error("E15_UNKNOWN_FOCUS");
  const report=projectE14Review(caseId,owner,events);
  const advice=planE15Revisits([report],now).find(x=>x.focus===focus);
  if(!advice)throw new Error("E15_ORIGINAL_ADVICE_MISSING");
  if(!advice.ready)throw new Error("E15_REVISIT_NOT_YET_SUGGESTED");

  const original=buildE14HandoffSession(caseId,"complete-handoff",owner,events);
  const selected=sessionParts[focus].map(part=>{
    const suffix=endings[part];
    const found=original.filter(step=>step.id.endsWith(suffix));
    if(found.length!==1||!found[0])throw new Error("E15_ORIGINAL_SOURCE_BOUNDARY_MISSING:"+part);
    const step=found[0];
    if(!isStudyLesson(step)){
      if(step.eventMetadata?.nonAuthoritative!==true||
        step.eventMetadata?.schedulerExcluded!==true||
        step.eventMetadata?.e11CaseId!==caseId)
        throw new Error("E15_AUTHORITATIVE_SOURCE_NOT_ALLOWED");
    }
    return step;
  });
  const originalIds=new Set(original.filter((step):step is StudyPrompt=>!isStudyLesson(step)).map(step=>step.id));
  const actual=selected.filter((step):step is StudyPrompt=>!isStudyLesson(step));
  if(!actual.length||new Set(actual.map(step=>step.id)).size!==actual.length||
    actual.some(step=>!originalIds.has(step.id)))
    throw new Error("E15_ORIGINAL_PROMPT_INTEGRITY_INVALID");
  return selected;
}
