import "fake-indexeddb/auto";
import {describe,expect,it} from "vitest";
import {createStudyEvent,isStudyLesson,type StudyPrompt} from "../../packages/study-player/src/index";
import {listMemoryTraces,listStudyEvents,saveStudyEvent} from "../../packages/local-db/src/index";
import {e02ReviewPrompts} from "../../apps/web/src/study/a1ExcellenceCourse";
import {e03ReviewPrompts} from "../../apps/web/src/study/a2ExcellenceCourse";
import {e04ReviewPrompts} from "../../apps/web/src/study/a2ExcellenceAdvancedCourse";
import {E06_LINKED_CASES,buildE11OptionalSession,getE06Overview} from "../../apps/web/src/study/e06IndependentCourse";

/**
 * Exact E12 source-contract acceptance, without a new store, grader or fixture
 * endpoint in the application. Browser execution is separately qualified.
 */
const sourceSets={e02:e02ReviewPrompts,e03:e03ReviewPrompts,e04:e04ReviewPrompts};
function originalPrerequisites(userId:string){
 const rows=getE06Overview([]).cases;
 for(const entry of E06_LINKED_CASES){
  const c=rows.find(row=>row.id===entry.id);
  if(!c?.canonicalUnitId||!c.canDoId)continue;
  const prompts=sourceSets[c.anchorCohort].filter(prompt=>
   prompt.primaryTarget.kind==="can_do"&&prompt.primaryTarget.id===c.canDoId&&
   prompt.eventMetadata?.[c.anchorCohort+"SceneId"]===c.anchorSceneId&&
   prompt.eventMetadata?.[c.anchorCohort+"UnitId"]===c.canonicalUnitId);
  const listen=prompts.find(p=>p.skill==="listening"||p.skill==="audio_recognition");
  const read=prompts.find(p=>p.skill==="reading"||p.skill==="comprehension"||p.skill==="form_selection");
  if(!listen||!read||!listen.acceptedAnswers[0]||!read.acceptedAnswers[0])continue;
  const events=[listen,read].map((prompt,i)=>
   createStudyEvent({id:"e12-source-"+userId+"-"+i,userId,deviceId:"fixture",
    prompt,response:prompt.acceptedAnswers[0]!,occurredAt:new Date(Date.UTC(2026,9,15,8,i)).toISOString(),
    responseTimeMs:650}));
  if(events.every(e=>e.result==="correct")&&getE06Overview(events).cases.find(x=>x.id===c.id)?.prerequisiteReady)
   return {id:c.id,events};
 }
 throw Error("E12_NO_VERIFIABLE_LINKED_ORIGINAL_LISTENING_AND_READING_FIXTURE");
}
function promptBySuffix(steps:ReturnType<typeof buildE11OptionalSession>,suffix:string):StudyPrompt{
 const step=steps.find(s=>!isStudyLesson(s)&&s.id.endsWith(suffix));
 if(!step||isStudyLesson(step))throw Error("E12_MISSING_PROMPT:"+suffix);
 return step;
}
function ownerEvent(prompt:StudyPrompt,userId:string,id:string,response:string,minute:number){
 const event=createStudyEvent({id,userId,deviceId:"fixture",prompt,response,
  occurredAt:new Date(Date.UTC(2026,9,15,9,minute)).toISOString(),responseTimeMs:750});
 // Exactly the original nonAuthoritative runtime treatment, not a grade.
 event.result="skipped";
 return event;
}

describe("E12 native optional writing, event identity, and account continuity",()=>{
 it("preserves source gating, original IDs and unscored revision outside FSRS",()=>{
  const source=originalPrerequisites("e12-proof-source");
  const steps=buildE11OptionalSession(source.id,source.events);
  const first=promptBySuffix(steps,"-e11-original-letter");
  const revised=promptBySuffix(steps,"-e12-revised-letter");
  expect(first.id).not.toBe(revised.id);
  expect(first.cueFamily).not.toBe(revised.cueFamily);
  expect(revised.primaryTarget).toEqual(first.primaryTarget);
  expect(revised.eventMetadata).toMatchObject({
   e06:true,e11:true,e12:true,e11Task:"revised-letter",
   nonAuthoritative:true,schedulerExcluded:true,e12DraftStage:"revision",
   e06CaseId:source.id});
  expect(steps.findIndex(s=>s.id===first.id)).toBeLessThan(steps.findIndex(s=>s.id===revised.id));
  expect(getE06Overview(source.events).cases.find(x=>x.id===source.id)).toMatchObject({
   correct:0,e11WritingSubmitted:false,e12RevisedWritingSubmitted:false});
  expect(()=>buildE11OptionalSession(source.id,[])).toThrow("E11_SOURCE_LESSON_FIRST");
 });
 it("restores only the same account's saved E11 original and independently counts E12",async()=>{
  const alpha="e12-qualified-alpha",beta="e12-qualified-beta";
  const src=originalPrerequisites(alpha);
  for(const event of src.events)await saveStudyEvent(event);
  const available=buildE11OptionalSession(src.id,await listStudyEvents(alpha));
  const first=promptBySuffix(available,"-e11-original-letter");
  const revision=promptBySuffix(available,"-e12-revised-letter");
  const original="ご連絡ありがとうございます。もう一度日時と場所を確認させてください。";
  const changed="ご連絡ありがとうございます。日時と場所を確認してから、お返事いたします。";
  await saveStudyEvent(ownerEvent(first,alpha,"e12-alpha-first",original,0));
  const alphaEvents=await listStudyEvents(alpha);
  const afterFirst=buildE11OptionalSession(src.id,alphaEvents);
  const coach=afterFirst.find(s=>isStudyLesson(s)&&s.id.endsWith("-e12-revision-coach"));
  expect(coach&&isStudyLesson(coach)?coach.examples?.some(x=>
   x.expression==="Your prior E11 first draft (private)"&&x.note===original):false).toBe(true);
  expect(getE06Overview(alphaEvents).cases.find(c=>c.id===src.id)).toMatchObject({
   correct:0,e11WritingSubmitted:true,e12RevisedWritingSubmitted:false});
  expect(await listStudyEvents(beta)).toHaveLength(0);
  expect(()=>buildE11OptionalSession(src.id,[])).toThrow();
  await saveStudyEvent(ownerEvent(revision,alpha,"e12-alpha-revised",changed,1));
  const afterRevision=await listStudyEvents(alpha);
  expect(afterRevision.find(e=>e.id==="e12-alpha-first")?.metadata?.learnerResponse).toBe(original);
  expect(afterRevision.find(e=>e.id==="e12-alpha-revised")?.metadata?.learnerResponse).toBe(changed);
  expect(getE06Overview(afterRevision).cases.find(c=>c.id===src.id)).toMatchObject({
   correct:0,e11WritingSubmitted:true,e12RevisedWritingSubmitted:true});
  expect(await listMemoryTraces(alpha)).toHaveLength(0);
  expect(await listStudyEvents(beta)).toHaveLength(0);
 });
});
