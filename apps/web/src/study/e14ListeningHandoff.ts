import type { StudyEvent } from "@thiepn/domain";
import { isStudyLesson, type StudyLesson, type StudyPrompt, type StudyStep } from "@thiepn/study-player";
import { buildE11OptionalSession, getE06Overview, type E06CaseProgress } from "./e06IndependentCourse";
import { E11_BY_CASE } from "./e11PracticalTransfer";
import { E11_RESPONSE_BY_CASE } from "./e11ResponseMissions";

/**
 * E14 is one continuous listening -> situated reply -> independent follow-up.
 * Every interactive prompt is the ORIGINAL E11/E12 source-owned object, never
 * a new prompt, rubric, mastery engine or saved progress namespace.
 */
export type E14HandoffMode = "listen-and-reply"|"follow-up-and-revise"|"complete-handoff";
export const E14_HANDOFF_MODES: readonly {id:E14HandoffMode;label:string;detail:string}[]=[
  {id:"listen-and-reply",label:"Hear and respond",detail:"Hear the original dialogue before choosing two context-appropriate original replies."},
  {id:"follow-up-and-revise",label:"Reply, write and revise",detail:"Read the original intentions, respond to two changes, then write a private follow-up and independent revision."},
  {id:"complete-handoff",label:"Complete exchange",detail:"Hear the dialogue, interpret the notice, choose both replies, then write and revise a follow-up for the real recipient."},
];

const SUFFIX={
  intro:"-e11-optional-intro",
  setup:"-e11-setup",
  listen:"-e11-micro-listening",
  dialogue:"-e11-dialogue",
  reading:"-e11-micro-reading",
  notice:"-e11-notice",
  contrasts:"-e11-contrasts",
  rehearsal:"-e11-role-rehearsal",
  firstReply:"-e11-role-response-1",
  nextReply:"-e11-role-response-2",
  letterCoach:"-e11-letter-coach",
  letter:"-e11-original-letter",
  revisionCoach:"-e12-revision-coach",
  revision:"-e12-revised-letter",
  spoken:"-e11-speaking-prep",
} as const;
type Part=keyof typeof SUFFIX;
type ReviewKind="listening"|"reply-one"|"reply-two"|"first-draft"|"revision";
export type E14RecordedReview=Readonly<{
  key:ReviewKind;
  title:string;
  attempted:boolean;
  result:"matched"|"needs-context-review"|"unscored-writing"|"not-attempted";
  lastAt:string|null;
  learnerText:string|null;
  sourceFeedback:string;
}>;
export type E14HandoffReview=Readonly<{
  caseId:string;
  eligible:boolean;
  sourceGoal:string;
  audience:string;
  sourceCaution:string;
  review:readonly E14RecordedReview[];
  reviewQuestions:readonly Readonly<{heading:string;question:string;repair:string}>[];
}>;

function sourceCase(caseId:string){
  const source=E11_BY_CASE.get(caseId);
  const decisions=E11_RESPONSE_BY_CASE.get(caseId);
  if(!source||!decisions||decisions.decisions.length!==2)
    throw new Error("E14_ORIGINAL_SOURCE_REQUIRED:"+caseId);
  return {source,decisions};
}

function originalPart(steps:readonly StudyStep[],caseId:string,part:Part):StudyStep {
  const suffix=SUFFIX[part];
  const all=steps.filter(step=>step.id.endsWith(suffix));
  if(all.length!==1||!all[0]||!all[0].id.includes(caseId))
    throw new Error("E14_ORIGINAL_BOUNDARY_MISSING:"+caseId+":"+part);
  return all[0];
}

function promptPart(steps:readonly StudyStep[],caseId:string,part:Part):StudyPrompt {
  const step=originalPart(steps,caseId,part);
  if(isStudyLesson(step)||step.eventMetadata?.e11CaseId!==caseId||
    step.eventMetadata?.nonAuthoritative!==true||step.eventMetadata?.schedulerExcluded!==true)
    throw new Error("E14_AUTHORITATIVE_PROMPT_NOT_ALLOWED:"+caseId+":"+part);
  return step;
}
function lessonPart(steps:readonly StudyStep[],caseId:string,part:Part):StudyLesson {
  const step=originalPart(steps,caseId,part);
  if(!isStudyLesson(step))throw new Error("E14_ORIGINAL_LESSON_REQUIRED:"+part);
  return step;
}

export function eligibleE14Cases(cases:readonly E06CaseProgress[]):E06CaseProgress[]{
  return cases.filter(c=>c.prerequisiteReady&&c.canDoId!==null&&c.canonicalUnitId!==null&&
    E11_BY_CASE.has(c.id)&&E11_RESPONSE_BY_CASE.has(c.id));
}

function eventFor(events:readonly StudyEvent[],owner:string,prompt:StudyPrompt):StudyEvent|null{
  const matching=events.filter(e=>e.userId===owner&&
    e.metadata?.promptId===prompt.id&&e.metadata?.e11CaseId===prompt.eventMetadata?.e11CaseId&&
    e.metadata?.nonAuthoritative===true&&e.metadata?.schedulerExcluded===true&&
    e.sourceId===prompt.sourceId&&e.contextId===prompt.contextId&&
    e.contentVersion===prompt.contentVersion);
  return matching.sort((a,b)=>b.occurredAt.localeCompare(a.occurredAt)||b.id.localeCompare(a.id))[0]??null;
}

export function projectE14Review(
  caseId:string,owner:string,events:readonly StudyEvent[],
):E14HandoffReview{
  if(!owner)throw new Error("E14_OWNER_REQUIRED");
  const {source,decisions}=sourceCase(caseId);
  const eligible=eligibleE14Cases(getE06Overview(events.filter(e=>e.userId===owner)).cases)
    .some(c=>c.id===caseId);
  // Only source-qualified cases get original prompts, including for review.
  if(!eligible)throw new Error("E14_SOURCE_PREREQUISITES_REQUIRED:"+caseId);
  const steps=buildE11OptionalSession(caseId,events.filter(e=>e.userId===owner));
  const descriptions:readonly [Part,ReviewKind,string,string][]=[
    ["listen","listening","Original listening",source.listening.answer+" — "+source.grammar.function],
    ["firstReply","reply-one","First situated reply",
      source.turns[decisions.decisions[0].correctTurn]!.ja+" · "+source.turns[decisions.decisions[0].correctTurn]!.intent],
    ["nextReply","reply-two","Changed-situation reply",
      source.turns[decisions.decisions[1].correctTurn]!.ja+" · "+source.turns[decisions.decisions[1].correctTurn]!.intent],
    ["letter","first-draft","Your first private message",
      "Audience: "+source.writingAudience+". "+source.pragmaticDecision],
    ["revision","revision","Your revised private message",
      "Recheck meaning, audience, details and politeness; changed text is not a semantic grade."],
  ];
  const review=descriptions.map(([part,key,title,sourceFeedback]):E14RecordedReview=>{
    const prompt=promptPart(steps,caseId,part);
    const event=eventFor(events,owner,prompt);
    const freeText=(part==="letter"||part==="revision")&&
      typeof event?.metadata?.learnerResponse==="string"
      ?event.metadata.learnerResponse.slice(0,9000):null;
    const result=event===null?"not-attempted"
      :freeText!==null?"unscored-writing"
      :event.result==="correct"?"matched":"needs-context-review";
    return {key,title,attempted:event!==null,result,
      lastAt:event?.occurredAt??null,learnerText:freeText,sourceFeedback};
  });
  return {caseId,eligible,sourceGoal:source.goal,audience:source.writingAudience,
    sourceCaution:source.grammar.mistake,
    review,reviewQuestions:source.writingRevision.map(([heading,question,repair])=>({heading,question,repair}))};
}

export function buildE14HandoffSession(
  caseId:string,mode:E14HandoffMode,owner:string,events:readonly StudyEvent[],
):StudyStep[]{
  if(!E14_HANDOFF_MODES.some(option=>option.id===mode))
    throw new Error("E14_UNKNOWN_MODE");
  if(!owner||events.some(e=>e.userId!==owner))throw new Error("E14_OWNER_MISMATCH");
  // This invokes the native builder's original source/can-do/prerequisite gate.
  const full=buildE11OptionalSession(caseId,events);
  const {source}=sourceCase(caseId);
  if(!eligibleE14Cases(getE06Overview(events).cases).some(c=>c.id===caseId))
    throw new Error("E14_SOURCE_PREREQUISITES_REQUIRED:"+caseId);
  const parts:Part[]=mode==="listen-and-reply"
    ?["intro","setup","listen","dialogue","rehearsal","firstReply","nextReply","spoken"]
    :mode==="follow-up-and-revise"
      ?["intro","setup","dialogue","contrasts","rehearsal","firstReply","nextReply","letterCoach","letter","revisionCoach","revision","spoken"]
      :["intro","setup","listen","dialogue","reading","notice","contrasts","rehearsal","firstReply","nextReply","letterCoach","letter","revisionCoach","revision","spoken"];
  const selected=parts.map(part=>part==="listen"||part==="reading"||
    part==="firstReply"||part==="nextReply"||part==="letter"||part==="revision"
    ?promptPart(full,caseId,part):lessonPart(full,caseId,part));
  const recordedPromptIds=new Set<string>();
  for(const step of selected){
    if(isStudyLesson(step))continue;
    if(recordedPromptIds.has(step.id))throw new Error("E14_DUPLICATE_ORIGINAL_PROMPT");
    recordedPromptIds.add(step.id);
  }
  if(recordedPromptIds.size<2)throw new Error("E14_INTERACTION_MISSING");
  // Reuse the original closing lesson ID and native StudyPlayer rendering.
  // This is source-backed guidance, not a new grade or invented transcript.
  const final=selected.at(-1);
  if(!final||!isStudyLesson(final))throw new Error("E14_SPEAKING_PREP_MISSING");
  const closing:StudyLesson={
    ...final,
    title:"After the handoff · compare your own response with the source",
    body:source.spokenChallenge+" Review the original intention and the checklist. Your writing and role choices are saved privately as original optional StudyEvents. Return to this situation to inspect your previous attempts. No speech, grammar, CEFR or FSRS grade is awarded.",
    examples:[
      ...source.turns.map(turn=>({expression:turn.speaker+"： "+turn.ja,
        note:turn.en+" · Communicative intent: "+turn.intent})),
      ...source.writingRevision.map(([heading,question,repair])=>({
        expression:heading+" · "+question,note:repair,
      })),
    ],
  };
  return [...selected.slice(0,-1),closing];
}
