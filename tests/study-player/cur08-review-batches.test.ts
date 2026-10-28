import {describe,it,expect} from "vitest";
import type {MemoryTrace} from "../../packages/scheduler/src/index";
import {vocabularyMeaningPrompts,vocabularyApplicationPrompts} from "../../apps/web/src/study/vocabulary";
import {projectCourseLevelReview,selectCourseDuePrompts,reviewSelectionCounts,courseReviewTraceId,
 CUR08_REVIEW_BATCH_SIZE,courseReviewBatchPlan} from "../../apps/web/src/study/cur05LevelReview";

const now=new Date("2026-10-28T08:00:00Z");
const prompts=[...vocabularyMeaningPrompts,...vocabularyApplicationPrompts];
const empty=projectCourseLevelReview({accountId:"alice",traces:[],vocabularyPrompts:prompts,globalPrompts:prompts,now});
const wordIndex=new Map(empty.words.map(word=>[word.id,word] as const));
const unique=(items:typeof prompts)=>{
 const ids=new Set<string>();return items.filter(prompt=>{
  const id=courseReviewTraceId(prompt);
  if(ids.has(id))return false;ids.add(id);return true;
 });
};
const levelA=unique(prompts.filter(p=>wordIndex.get(p.primaryTarget.id)?.levels.includes("A1")));
const unassigned=unique(prompts.filter(p=>wordIndex.get(p.primaryTarget.id)?.levels.length===0));
const trace=(prompt:typeof prompts[number],offsetMinutes:number):MemoryTrace=>({
 id:courseReviewTraceId(prompt),userId:"alice",entity:prompt.primaryTarget,
 skillDimension:prompt.skill,cueFamily:prompt.cueFamily,schedulerFamily:"fsrs",schedulerVersion:"native",
 revision:1,card:{due:new Date(now.getTime()-offsetMinutes*60000).toISOString(),
 stability:2,difficulty:5,elapsedDays:1,scheduledDays:1,learningSteps:0,reps:1,lapses:0,state:2}
});
const overview=(traces:readonly MemoryTrace[])=>projectCourseLevelReview({
 accountId:"alice",traces,vocabularyPrompts:prompts,globalPrompts:prompts,now
});
describe("CUR-08 exact original due batches",()=>{
 it("discloses full backlog and the native queue size without claiming all due are launched",()=>{
  expect(CUR08_REVIEW_BATCH_SIZE).toBe(16);
  const a=levelA.slice(0,17),b=unassigned.slice(0,6);
  expect(a.length).toBe(17);expect(b.length).toBe(6);
  const traces=[...a.map((p,i)=>trace(p,1000-i)),...b.map((p,i)=>trace(p,500-i))];
  const data=overview(traces);
  const plan=courseReviewBatchPlan(data,["A1","unassigned"]);
  expect(plan).toEqual({selectionDue:23,queueSize:16,remainingDue:7,selectedLevels:2,order:"balanced"});
  expect(reviewSelectionCounts(data,["A1","unassigned"]).due).toBe(23);
  expect(data.globalDue).toBe(23);
  expect(courseReviewBatchPlan(data,["A1"]).order).toBe("earliest");
  expect(courseReviewBatchPlan(data,["C2"]).queueSize).toBe(0);
 });
 it("interleaves genuine source groups without creating cards or changing any due timestamps",()=>{
  const a=levelA.slice(0,17),b=unassigned.slice(0,6);
  const traces=[...a.map((p,i)=>trace(p,1000-i)),...b.map((p,i)=>trace(p,500-i))];
  const original=traces.map(t=>t.card.due),data=overview(traces);
  const selected=selectCourseDuePrompts({levels:["A1","unassigned"],overview:data,prompts,traces,now});
  expect(selected.length).toBe(16);
  expect(new Set(selected.map(courseReviewTraceId)).size).toBe(16);
  expect(selected.every(p=>prompts.includes(p))).toBe(true);
  expect(selected.slice(0,12).filter(p=>wordIndex.get(p.primaryTarget.id)?.levels.length===0).length).toBeGreaterThan(0);
  expect(traces.map(t=>t.card.due)).toEqual(original);
  const earliest=selectCourseDuePrompts({levels:["A1","unassigned"],overview:data,prompts,traces,now,order:"earliest"});
  expect(earliest).toEqual(a.slice(0,16));
  expect(selected.some(p=>b.includes(p))).toBe(true);
 });
 it("keeps each group's original chronological FSRS priority and never replays a shared trace",()=>{
  const a=levelA.slice(0,4),b=unassigned.slice(0,4);
  const traces=[...a.map((p,i)=>trace(p,100-i)),...b.map((p,i)=>trace(p,50-i))];
  const data=overview(traces);
  const result=selectCourseDuePrompts({levels:["A1","unassigned","A1"],overview:data,prompts:[...prompts,a[0]!],traces,now,limit:8});
  expect(result).toHaveLength(8);
  expect(new Set(result.map(courseReviewTraceId)).size).toBe(8);
  expect(result.filter(p=>a.includes(p))).toEqual(a);
  expect(result.filter(p=>b.includes(p))).toEqual(b);
 });
 it("returns only actually due original traces and leaves future cards untouched",()=>{
  const first=levelA[0]!,second=unassigned[0]!;
  const future=trace(second,-20),traces=[trace(first,0),future];
  const data=overview(traces);
  expect(courseReviewBatchPlan(data,["A1","unassigned"]).selectionDue).toBe(1);
  const queue=selectCourseDuePrompts({levels:["A1","unassigned"],overview:data,prompts,traces,now});
  expect(queue).toEqual([first]);
  expect(future.card.due).toBe(new Date(now.getTime()+20*60000).toISOString());
 });
 it("fails closed when a stored trace ID does not match its original source entity or skill",()=>{
  const a=levelA[0]!,good=trace(a,10);
  const corrupted={...good,entity:{kind:"lexeme" as const,id:"different-source-word"}};
  expect(()=>overview([corrupted])).toThrow(/CUR08_TRACE_IDENTITY_CONFLICT/);
  expect(()=>selectCourseDuePrompts({levels:["A1"],overview:empty,prompts,traces:[corrupted],now}))
   .toThrow(/CUR08_TRACE_IDENTITY_CONFLICT/);
  expect(()=>overview([{...good,cueFamily:"wrong-cue"}])).toThrow(/CUR08_TRACE_IDENTITY_CONFLICT/);
 });
 it("rejects forged source attribution and invalid ordering without silently using FSRS",()=>{
  const a=levelA[0]!,good=trace(a,10),data=overview([good]);
  const forged={...a,sourceId:"unlicensed-source-id"};
  expect(()=>selectCourseDuePrompts({levels:["A1"],overview:data,prompts:[forged],traces:[good],now}))
   .toThrow(/CUR08_SOURCE_ATTRIBUTION_CONFLICT/);
  expect(()=>selectCourseDuePrompts({levels:["A1"],overview:data,prompts:[a],traces:[good],now,
   order:"random" as "balanced"})).toThrow(/CUR08_INVALID_ORDER/);
  expect(()=>selectCourseDuePrompts({levels:["A1"],overview:data,prompts:[a],traces:[good],now,limit:65}))
   .toThrow(/CUR05_INVALID_LIMIT/);
 });
});
