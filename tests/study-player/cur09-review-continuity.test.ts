import {describe,it,expect} from "vitest";
import type {MemoryTrace} from "../../packages/scheduler/src/index";
import {vocabularyMeaningPrompts,vocabularyApplicationPrompts} from "../../apps/web/src/study/vocabulary";
import {projectCourseLevelReview,selectCourseDuePrompts,courseReviewTraceId,
 CUR08_REVIEW_BATCH_SIZE} from "../../apps/web/src/study/cur05LevelReview";
import {createCur09Review,readCur09Review,saveCur09Review,advanceCur09Review,
 resolveCur09Review,clearCur09Review,type Cur09ReviewStore} from "../../apps/web/src/study/cur09ReviewContinuity";
class Store implements Cur09ReviewStore{
 records=new Map<string,string>();
 getItem(k:string){return this.records.get(k)??null;}
 setItem(k:string,v:string){this.records.set(k,v);}
 removeItem(k:string){this.records.delete(k);}
}
const now=Date.UTC(2026,9,28,9),clock=new Date(now);
const prompts=[...vocabularyMeaningPrompts,...vocabularyApplicationPrompts];
const empty=projectCourseLevelReview({accountId:"alice",traces:[],vocabularyPrompts:prompts,globalPrompts:prompts,now:clock});
const wordMap=new Map(empty.words.map(w=>[w.id,w] as const));
const unique=(p:typeof prompts)=>p.filter((v,i)=>p.findIndex(x=>courseReviewTraceId(x)===courseReviewTraceId(v))===i);
const a=unique(prompts.filter(p=>wordMap.get(p.primaryTarget.id)?.levels.includes("A1"))).slice(0,18);
const b=unique(prompts.filter(p=>wordMap.get(p.primaryTarget.id)?.levels.length===0)).slice(0,8);
const trace=(p:typeof prompts[number],offset=30):MemoryTrace=>({
 id:courseReviewTraceId(p),userId:"alice",entity:p.primaryTarget,skillDimension:p.skill,
 cueFamily:p.cueFamily,schedulerFamily:"fsrs",schedulerVersion:"native",revision:1,
 card:{due:new Date(now-offset*60000).toISOString(),stability:2,difficulty:5,
 elapsedDays:1,scheduledDays:1,learningSteps:0,reps:1,lapses:0,state:2}
});
const overview=(traces:readonly MemoryTrace[])=>projectCourseLevelReview({
 accountId:"alice",traces,vocabularyPrompts:prompts,globalPrompts:prompts,now:clock
});
const initial=[a[0]!,b[0]!,a[1]!],original=initial.map((p,i)=>trace(p,30-i));
const receipt=()=>createCur09Review("alice",["A1","unassigned"],initial,original,now);
describe("CUR-09 original Account-fenced review continuity",()=>{
 it("stores only bounded original prompt identifiers, no answers, grading or private content",()=>{
  const store=new Store(),r=receipt();
  expect(saveCur09Review("alice",r,store,now)).toBe(true);
  const raw=[...store.records.values()].join(" ");
  for(const forbidden of ["acceptedAnswers","response","grade","日本語"])expect(raw).not.toContain(forbidden);
  expect(r.queue).toHaveLength(3);
  expect(r.queue.every(x=>x.sourceId.length>0&&x.traceId.startsWith("lexeme:"))).toBe(true);
  expect(readCur09Review("alice",store,now)).toEqual(r);
  expect(readCur09Review("bob",store,now)).toBeNull();
  expect(clearCur09Review("bob",store)).toBe(true);
  expect(readCur09Review("alice",store,now)).toEqual(r);
 });
 it("resumes only still-due original prompts after committed navigation without duplicate review",()=>{
  const store=new Store(),r=receipt();saveCur09Review("alice",r,store,now);
  expect(advanceCur09Review("alice",initial,1,store,now+1)).toBe(true);
  const updated={...original[0]!,revision:2,card:{...original[0]!.card,
   due:new Date(now+3600000).toISOString()}};
  const current=[updated,...original.slice(1)];
  const output=resolveCur09Review("alice",readCur09Review("alice",store,now+1),
   prompts,current,overview(current),now+2)!;
  expect(output.prompts).toEqual(initial.slice(1));
  expect(output.pendingAtSnapshot).toBe(2);
  expect(output.skippedChanged).toBe(0);
  expect(current[1]!.card.due).toBe(original[1]!.card.due);
 });
 it("omits concurrent review revisions and future due cards, never changes scheduled timestamps",()=>{
  const current=[original[0]!,{...original[1]!,revision:2},
    {...original[2]!,card:{...original[2]!.card,due:new Date(now+86400000).toISOString()}}];
  const result=resolveCur09Review("alice",receipt(),prompts,current,overview(current),now)!;
  expect(result.prompts).toEqual([initial[0]]);
  expect(result.skippedChanged).toBe(2);
  expect(current[1]!.card.due).toBe(original[1]!.card.due);
 });
 it("rejects original instructional source changes even if prompt IDs are unchanged",()=>{
  const changed=prompts.map(p=>p.id===initial[0]!.id?{...p,instruction:p.instruction+" mutated"}:p);
  expect(resolveCur09Review("alice",receipt(),changed,original,overview(original),now)).toBeNull();
  const forged=prompts.map(p=>p.id===initial[0]!.id?{...p,sourceId:"fabricated-source"}:p);
  expect(resolveCur09Review("alice",receipt(),forged,original,overview(original),now)).toBeNull();
 });
 it("rejects wrong owner, foreign traces, different source-level selection and tampered source identity",()=>{
  const r=receipt();
  expect(resolveCur09Review("bob",r,prompts,original,overview(original),now)).toBeNull();
  expect(resolveCur09Review("alice",{...r,levels:["C2"]},prompts,original,overview(original),now)).toBeNull();
  expect(resolveCur09Review("alice",r,prompts,
   [{...original[0]!,userId:"bob"},...original.slice(1)],overview(original),now)).toBeNull();
  const wrong={...original[1]!,entity:{kind:"lexeme" as const,id:"forged"}};
  expect(()=>resolveCur09Review("alice",r,prompts,[original[0]!,wrong,original[2]!],
   overview(original),now)).toThrow(/CUR09_TRACE_IDENTITY_CONFLICT/);
 });
 it("prevents a local cursor from silently skipping multiple prompts",()=>{
  const store=new Store(),r=receipt();saveCur09Review("alice",r,store,now);
  expect(advanceCur09Review("alice",initial,2,store,now+1)).toBe(false);
  expect(readCur09Review("alice",store,now+1)?.cursor).toBe(0);
  expect(advanceCur09Review("alice",initial,1,store,now+2)).toBe(true);
  expect(advanceCur09Review("alice",initial,0,store,now+3)).toBe(false);
  expect(advanceCur09Review("alice",[initial[1]!,initial[0]!,initial[2]!],2,store,now+4)).toBe(false);
  expect(readCur09Review("alice",store,now+4)?.cursor).toBe(1);
 });
 it("invalidates cross-Account, oversized, future, duplicate and expired local receipts",()=>{
  const store=new Store(),r=receipt();saveCur09Review("alice",r,store,now);
  const key=[...store.records.keys()][0]!;
  const mutate=(x:unknown)=>store.setItem(key,JSON.stringify(x));
  mutate({...r,owner:"bob"});expect(readCur09Review("alice",store,now)).toBeNull();
  mutate({...r,savedAt:now+3600000});expect(readCur09Review("alice",store,now)).toBeNull();
  mutate({...r,cursor:9});expect(readCur09Review("alice",store,now)).toBeNull();
  mutate({...r,queue:[r.queue[0],r.queue[0]]});expect(readCur09Review("alice",store,now)).toBeNull();
  mutate(r);expect(readCur09Review("alice",store,now+8*86400000)).toBeNull();
  store.setItem(key,"x".repeat(4501));expect(readCur09Review("alice",store,now)).toBeNull();
 });
 it("fails closed on invalid original due or excluded prompt and cannot exceed 16",()=>{
  const future={...original[0]!,card:{...original[0]!.card,due:new Date(now+5000).toISOString()}};
  expect(()=>createCur09Review("alice",["A1","unassigned"],initial,[future,...original.slice(1)],now))
   .toThrow(/CUR09_NOT_DUE/);
  expect(()=>createCur09Review("alice",["A1"],[initial[0]!,initial[0]!],original,now))
   .toThrow(/CUR09_INVALID_OR_DUPLICATE_PROMPT/);
  expect(()=>createCur09Review("alice",["A1"],Array(CUR08_REVIEW_BATCH_SIZE+1).fill(initial[0]),original,now))
   .toThrow(/CUR09_INVALID_QUEUE/);
  expect(()=>createCur09Review("alice",["A1"],[{...initial[0]!,eventMetadata:{schedulerExcluded:true}}],
   [original[0]!],now)).toThrow(/CUR09_INVALID_OR_DUPLICATE_PROMPT/);
 });
 it("concurrent completion cannot revive even one original prompt",()=>{
  const changed=original.map(t=>({...t,revision:t.revision+1,
   card:{...t.card,due:new Date(now+86400000).toISOString()}}));
  const out=resolveCur09Review("alice",receipt(),prompts,changed,overview(changed),now)!;
  expect(out.prompts).toEqual([]);expect(out.skippedChanged).toBe(3);
 });
 it("preserves original CUR-08 multi-level due queue without a second scheduler",()=>{
  const items=[...a.slice(0,17),...b.slice(0,6)],traces=items.map((p,i)=>trace(p,1000-i));
  const o=overview(traces);
  const q=selectCourseDuePrompts({levels:["A1","unassigned"],overview:o,prompts,traces,now:clock});
  const r=createCur09Review("alice",["A1","unassigned"],q,traces,now);
  const restored=resolveCur09Review("alice",r,prompts,traces,o,now)!;
  expect(restored.prompts).toEqual(q);
  expect(new Set(restored.prompts.map(courseReviewTraceId)).size).toBe(q.length);
  expect(q.length).toBe(CUR08_REVIEW_BATCH_SIZE);
 });
 it("does not pretend persistence succeeded when browser storage rejects reads and writes",()=>{
  const denied:Cur09ReviewStore={getItem(){throw Error("private")},setItem(){throw Error("quota")},removeItem(){throw Error("private")}};
  expect(readCur09Review("alice",denied,now)).toBeNull();
  expect(saveCur09Review("alice",receipt(),denied,now)).toBe(false);
  expect(advanceCur09Review("alice",initial,1,denied,now)).toBe(false);
  expect(clearCur09Review("alice",denied)).toBe(false);
 });
});
