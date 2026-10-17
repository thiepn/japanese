import "fake-indexeddb/auto";
import {mkdirSync,writeFileSync} from "node:fs";
import {resolve} from "node:path";
import {describe,expect,it} from "vitest";
import {createStudyEvent,isStudyLesson,type StudyPrompt} from "../../packages/study-player/src/index";
import {listMemoryTraces,listStudyEvents,saveStudyEvent} from "../../packages/local-db/src/index";
import {E02_AVAILABLE_SCENES,buildE02Journey} from "../../apps/web/src/study/a1ExcellenceCourse";
import {E03_MAPPED,buildE03Journey} from "../../apps/web/src/study/a2ExcellenceCourse";
import {E04_MAPPED,buildE04Journey} from "../../apps/web/src/study/a2ExcellenceAdvancedCourse";
import {buildE19WritingSession,projectE19Overview,compareE19Drafts} from "../../apps/web/src/study/e19SourceWriting";
const now=new Date("2026-10-17T14:00:00Z"),guest="00000000-0000-4000-8000-000000000001";
const original=(cohort:"e02"|"e03"|"e04",id:string)=>
 (cohort==="e02"?buildE02Journey(id):cohort==="e03"?buildE03Journey(id):buildE04Journey(id))
 .filter((s):s is StudyPrompt=>!isStudyLesson(s));
function scene(owner:string){
 const id=E02_AVAILABLE_SCENES[0]!.id,key="e02:"+id;
 const prompts=original("e02",id);
 const listening=prompts.find(p=>p.skill==="listening")!;
 const reading=prompts.find(p=>p.skill==="comprehension")!;
 const first=prompts.find(p=>p.promptType==="textarea"&&p.id.endsWith("-write"))!;
 const events=[listening,reading].map((prompt,i)=>createStudyEvent({
  id:"e19-source-"+owner+"-"+i,userId:owner,deviceId:"original-fixture",
  prompt,response:prompt.acceptedAnswers[0]!,
  occurredAt:"2026-10-16T10:0"+i+":00.000Z",responseTimeMs:500
 }));
 if(events.some(e=>e.result!=="correct"))throw Error("E19_TEST_CANONICAL_SOURCE_EVIDENCE_FAILED");
 return {id,key,events,first};
}
function draft(owner:string,prompt:StudyPrompt,text:string,id:string){
 const e=createStudyEvent({id,userId:owner,deviceId:"original-fixture",prompt,response:text,
  occurredAt:"2026-10-16T13:00:00.000Z",responseTimeMs:2000});
 e.result="skipped";
 return e;
}
describe("E19 original A1/A2 private source writing continuity",()=>{
 it("requires actual canonical source listening and reading, not optional drafts or invented links",()=>{
  const s=scene("e19-a");
  const before=projectE19Overview("e19-a",[],now).cases.find(c=>c.key===s.key)!;
  expect(before).toMatchObject({status:"study-source",sourceReady:false,firstDraft:null,revisedDraft:null});
  expect(()=>buildE19WritingSession(s.key,"e19-a",[],now)).toThrow("E19_LISTENING_AND_READING_SOURCE_FIRST");
  expect(()=>buildE19WritingSession(s.key,"e19-a",s.events.slice(0,1),now)).toThrow("E19_LISTENING_AND_READING_SOURCE_FIRST");
  expect(()=>buildE19WritingSession("e03:not-original","e19-a",s.events,now)).toThrow("E19_UNLINKED_OR_UNKNOWN_SOURCE");
  const ready=projectE19Overview("e19-a",s.events,now);
  expect(ready.cases.find(c=>c.key===s.key)).toMatchObject({status:"first-draft",sourceListening:true,sourceReading:true});
  const firstSteps=buildE19WritingSession(s.key,"e19-a",s.events,now);
  const actual=firstSteps.filter((step):step is StudyPrompt=>!isStudyLesson(step));
  expect(actual).toHaveLength(1);
  expect(actual[0]).toEqual(s.first);
  expect(actual[0]?.eventMetadata).toMatchObject({nonAuthoritative:true,schedulerExcluded:true});
  expect(firstSteps.filter(isStudyLesson).length).toBeGreaterThan(2);
 });
 it("preserves same-account original draft, source-grounded next revision and zero new FSRS evidence",async()=>{
  const owner="e19-writer",s=scene(owner);
  const message="おはようございます。今日はよろしくお願いします。";
  const revised="おはようございます。今日もよろしくお願いいたします。";
  const savedFirst=draft(owner,s.first,message,"e19-first");
  for(const e of [...s.events,savedFirst])await saveStudyEvent(e);
  const mine=await listStudyEvents(owner);
  const view=projectE19Overview(owner,mine,now).cases.find(c=>c.key===s.key)!;
  expect(view).toMatchObject({status:"revise",firstDraft:message,revisedDraft:null});
  const steps=buildE19WritingSession(s.key,owner,mine,now);
  const prompts=steps.filter((step):step is StudyPrompt=>!isStudyLesson(step));
  expect(prompts).toHaveLength(1);
  const revision=prompts[0]!;
  expect(revision.id).not.toBe(s.first.id);
  expect(revision.primaryTarget).toEqual(s.first.primaryTarget);
  expect(revision.sourceId).toBe(s.first.sourceId);
  expect(revision.contentVersion).toBe(s.first.contentVersion);
  expect(revision.contextId).toBe(s.first.contextId);
  expect(revision.eventMetadata).toMatchObject({
   e19:true,e19Stage:"revision",e19SourcePromptId:s.first.id,nonAuthoritative:true,
   schedulerExcluded:true,semanticScore:false,accreditedCefrVerdict:false});
  const checks=revision.eventMetadata?.e19WritingChecks;
  expect(Array.isArray(checks)&&checks.length).toBe(3);
  expect(steps.filter(isStudyLesson).flatMap(s=>s.examples??[])).toContainEqual({
   expression:"Your prior E19 source first draft (private)",note:message
  });
  await saveStudyEvent(draft(owner,revision,revised,"e19-second"));
  const after=await listStudyEvents(owner);
  expect(projectE19Overview(owner,after,now).cases.find(c=>c.key===s.key)).toMatchObject({
   status:"review",firstDraft:message,revisedDraft:revised});
  expect(compareE19Drafts(message,revised).changed).toBe(true);
  expect(compareE19Drafts(message,message)).toMatchObject({changed:false,beforeChange:"",afterChange:""});
  expect(await listMemoryTraces(owner)).toHaveLength(0);
 });
 it("never crosses owner, source version or future-timestamp partitions",()=>{
  const owner="e19-security",s=scene(owner),one=draft(owner,s.first,"日本語の原稿です。","e19-local");
  expect(()=>projectE19Overview("another-owner",[...s.events,one],now)).toThrow("E19_OWNER_WORKSPACE_MISMATCH");
  expect(()=>buildE19WritingSession(s.key,"another-owner",[...s.events,one],now)).toThrow("E19_OWNER_WORKSPACE_MISMATCH");
  expect(projectE19Overview(owner,[...s.events,{...one,contentVersion:"fake-version"}],now)
   .cases.find(c=>c.key===s.key)?.firstDraft).toBeNull();
  expect(projectE19Overview(owner,[...s.events,{...one,occurredAt:"2040-01-01T00:00:00Z"}],now)
   .cases.find(c=>c.key===s.key)?.firstDraft).toBeNull();
 });
 it("is source-compatible with every available linked E02, E03 and E04 native lesson",()=>{
  const view=projectE19Overview("e19-check",[],now);
  expect(view.total).toBe(E02_AVAILABLE_SCENES.length+E03_MAPPED.length+E04_MAPPED.length);
  for(const cohort of ["e02","e03","e04"] as const){
   const rows=view.cases.filter(c=>c.cohort===cohort);
   const mapped=cohort==="e02"?E02_AVAILABLE_SCENES.length:cohort==="e03"?E03_MAPPED.length:E04_MAPPED.length;
   expect(rows).toHaveLength(mapped);
   for(const row of rows){
    const writing=original(cohort,row.sceneId).filter(p=>p.promptType==="textarea"&&p.id.endsWith("-write"));
    expect(writing).toHaveLength(1);
    expect(writing[0]?.eventMetadata?.nonAuthoritative).toBe(true);
   }
  }
 });
 it("writes only disposable browser fixture on the CI runner",()=>{
  const s=scene(guest),message="おはようございます。今日もよろしくお願いします。";
  mkdirSync(resolve("artifacts"),{recursive:true});
  writeFileSync(resolve("artifacts/e19-browser-seed.json"),JSON.stringify({
   guest,key:s.key,events:[...s.events,draft(guest,s.first,message,"e19-browser-first")],
   firstText:message,
  }),"utf8");
  expect(s.events).toHaveLength(2);
 });
});
