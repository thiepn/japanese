import "fake-indexeddb/auto";
import {mkdirSync,writeFileSync} from "node:fs";
import {resolve} from "node:path";
import {describe,expect,it} from "vitest";
import {createStudyEvent,isStudyLesson,type StudyPrompt} from "../../packages/study-player/src/index";
import {e02ReviewPrompts,getE02Overview} from "../../apps/web/src/study/a1ExcellenceCourse";
import {getE03Overview} from "../../apps/web/src/study/a2ExcellenceCourse";
import {getE04Overview} from "../../apps/web/src/study/a2ExcellenceAdvancedCourse";
import {buildE18OriginalMixedReview,eligibleE18Cases,type E18Mode} from "../../apps/web/src/study/e18OriginalMixedReview";
import {listMemoryTraces,saveStudyEvent} from "../../packages/local-db/src/index";

const now=new Date("2026-10-17T14:00:00.000Z");
const guest="00000000-0000-4000-8000-000000000001";
function sourceReady(owner:string){
 const scenes=[...new Set(e02ReviewPrompts.map(p=>String(p.eventMetadata?.e02SceneId)))].slice(0,3);
 if(scenes.length<2)throw Error("E18_INSUFFICIENT_ORIGINAL_LINKED_SCENES");
 const originals=e02ReviewPrompts.filter(p=>scenes.includes(String(p.eventMetadata?.e02SceneId)));
 const events=originals.map((prompt,i)=>createStudyEvent({
  id:"e18-"+owner+"-"+i,userId:owner,deviceId:"e18-fixture",
  prompt,response:prompt.acceptedAnswers[0]!,
  occurredAt:new Date(Date.UTC(2026,8,15,10,0,i)).toISOString(),responseTimeMs:420,
 }));
 if(events.some(e=>e.result!=="correct"))throw Error("E18_FIXTURE_NOT_CORRECT");
 const candidates=eligibleE18Cases(getE02Overview(events,now),getE03Overview(events,now),getE04Overview(events,now));
 if(candidates.length<2)throw Error("E18_FIXTURE_NOT_SOURCE_COMPLETED");
 return {events,originals,candidates,keys:candidates.slice(0,2).map(c=>c.key)};
}
const prompts=(steps:ReturnType<typeof buildE18OriginalMixedReview>):StudyPrompt[]=>
 steps.filter((step):step is StudyPrompt=>!isStudyLesson(step));

describe("E18 interleaved original A1–A2 recall, not another mastery engine",()=>{
 const base=sourceReady("e18-owner");
 it("is locked until at least two distinct verified original sources have complete controlled evidence",()=>{
  expect(eligibleE18Cases(getE02Overview([],now),getE03Overview([],now),getE04Overview([],now))).toHaveLength(0);
  expect(()=>buildE18OriginalMixedReview(base.keys,"listen-read","e18-owner",[],now)).toThrow("E18_SOURCE_LESSON_NOT_COMPLETED");
  expect(()=>buildE18OriginalMixedReview(base.keys.slice(0,1),"listen-read","e18-owner",base.events,now)).toThrow("E18_REQUIRES_TWO_OR_THREE_DISTINCT_SOURCES");
  expect(()=>buildE18OriginalMixedReview([base.keys[0]!,base.keys[0]!],"listen-read","e18-owner",base.events,now)).toThrow("E18_REQUIRES_TWO_OR_THREE_DISTINCT_SOURCES");
  expect(()=>buildE18OriginalMixedReview([base.keys[0]!,"e04:invented"],"listen-read","e18-owner",base.events,now)).toThrow("E18_SOURCE_LESSON_NOT_COMPLETED");
  expect(()=>buildE18OriginalMixedReview(base.keys,"nonexistent" as E18Mode,"e18-owner",base.events,now)).toThrow("E18_UNKNOWN_MODE");
  const missing=base.events.filter(e=>e.metadata?.promptId!==base.originals[0]?.id);
  expect(()=>buildE18OriginalMixedReview(base.keys,"listen-read","e18-owner",missing,now)).toThrow("E18_SOURCE_LESSON_NOT_COMPLETED");
 });
 it.each([["listen-read",4],["respond-recall",4],["whole-source",8]] as const)(
  "interleaves %s with exactly %i unchanged original canonical questions", (mode,count)=>{
   const steps=buildE18OriginalMixedReview(base.keys,mode,"e18-owner",base.events,now);
   const included=prompts(steps);
   expect(included).toHaveLength(count);
   expect(steps.filter(isStudyLesson)).toHaveLength(2);
   expect(new Set(included.map(p=>p.id)).size).toBe(count);
   const originalById=new Map(base.originals.map(p=>[p.id,p]));
   expect(included.every(p=>JSON.stringify(p)===JSON.stringify(originalById.get(p.id)))).toBe(true);
   expect(included.every(p=>p.primaryTarget.kind==="can_do"&&p.sourceId==="thiepn-original"&&p.activity==="review")).toBe(true);
   expect(included.every(p=>p.eventMetadata?.nonAuthoritative!==true&&p.eventMetadata?.schedulerExcluded!==true)).toBe(true);
   expect(included.every(p=>!p.id.includes("delayed")&&p.promptType!=="textarea"&&p.promptType!=="speech")).toBe(true);
   expect(included.map(p=>p.eventMetadata?.e02SceneId)).toEqual(
    mode==="whole-source"?
     [base.candidates[0]!.sceneId,base.candidates[0]!.sceneId,base.candidates[0]!.sceneId,base.candidates[0]!.sceneId,
      base.candidates[1]!.sceneId,base.candidates[1]!.sceneId,base.candidates[1]!.sceneId,base.candidates[1]!.sceneId]:
     [base.candidates[0]!.sceneId,base.candidates[0]!.sceneId,base.candidates[1]!.sceneId,base.candidates[1]!.sceneId]);
  });
 it("rejects foreign owner source evidence and never grants memory through session construction",async()=>{
  expect(()=>buildE18OriginalMixedReview(base.keys,"whole-source","other-owner",base.events,now))
   .toThrow("E18_OWNER_WORKSPACE_MISMATCH");
  const owner="e18-owner-no-grades";
  const source=sourceReady(owner);
  const steps=buildE18OriginalMixedReview(source.keys,"whole-source",owner,source.events,now);
  expect(steps.length).toBeGreaterThan(2);
  await saveStudyEvent(source.events[0]!);
  expect(await listMemoryTraces(owner)).toHaveLength(0);
 });
 it("writes only disposable original StudyEvents for real browser playback",()=>{
  const sample=sourceReady(guest);
  mkdirSync(resolve("artifacts"),{recursive:true});
  writeFileSync(resolve("artifacts/e18-browser-seed.json"),JSON.stringify({
   guest,caseKeys:sample.keys,events:sample.events,
  }),"utf8");
  expect(sample.events.length).toBeGreaterThanOrEqual(8);
 });
});
