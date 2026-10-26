import {describe,expect,it} from "vitest";
import type {StudyEvent} from "@thiepn/domain";
import type {MemoryTrace} from "@thiepn/scheduler";
import {foundationPrompts,foundationApplicationPrompts} from "../apps/web/src/study/foundationPrompts";
import {kanaReviewTraceId,kanaReviewPrompts,selectKanaReview,projectKanaReviewOverview} from "../apps/web/src/study/kanaReview";

const today=new Date("2026-10-26T10:00:00Z");
const prompt=(id:string,skill:string)=>[...foundationPrompts,...foundationApplicationPrompts]
  .find(item=>item.primaryTarget.id===id&&item.skill===skill)!;
const trace=(item:ReturnType<typeof prompt>,due:string,lapses=0,difficulty=2):MemoryTrace=>({
  id:kanaReviewTraceId(item),userId:"test-owner",entity:item.primaryTarget,skillDimension:item.skill,
  cueFamily:item.cueFamily,schedulerFamily:"fsrs",schedulerVersion:"ts-fsrs-5.4.2",revision:1,
  card:{due,stability:2,difficulty,elapsedDays:1,scheduledDays:1,learningSteps:0,
    reps:1,lapses,state:2,lastReviewAt:"2026-10-25T10:00:00Z"}
});
const event=(item:ReturnType<typeof prompt>,result:"correct"|"incorrect",at="2026-10-25T10:00:00Z")=>
  ({primaryTarget:item.primaryTarget,skillDimension:item.skill,result,occurredAt:at} as StudyEvent);
const ready=()=>true;
describe("dedicated kana FSRS review",()=>{
  it("selects the original kana prompt identities in all three skill dimensions",()=>{
    const view=selectKanaReview("mixed","all",[],[],today,ready);
    expect(view.counts.due).toBe(0);
    expect(view.counts.new).toBe(kanaReviewPrompts.length);
    expect(view.prompts).toHaveLength(5);
    expect(view.prompts.every(item=>kanaReviewPrompts.includes(item))).toBe(true);
    expect(new Set(view.prompts.map(item=>item.id)).size).toBe(view.prompts.length);
    expect(kanaReviewPrompts.some(item=>item.skill==="recognition")).toBe(true);
    expect(kanaReviewPrompts.some(item=>item.skill==="reading")).toBe(true);
    expect(kanaReviewPrompts.some(item=>item.skill==="form_selection")).toBe(true);
  });
  it("separates hiragana, katakana and mixed counts without modifying cards",()=>{
    const hi=prompt("hiragana-あ","recognition");
    const ka=prompt("katakana-ア","recognition");
    const traces=[trace(hi,"2026-10-20T10:00:00Z"),trace(ka,"2026-10-30T10:00:00Z")];
    const original=JSON.stringify(traces);
    const overview=projectKanaReviewOverview(traces,[],today,ready);
    expect(overview.hiragana.recognition.due).toBe(1);
    expect(overview.katakana.recognition.due).toBe(0);
    expect(overview.mixed.recognition.due).toBe(1);
    expect(JSON.stringify(traces)).toBe(original);
  });
  it("prioritizes lapsed and recently failed due kana, never early future cards",()=>{
    const hi=prompt("hiragana-あ","recognition");
    const second=prompt("hiragana-い","recognition");
    const future=prompt("hiragana-う","recognition");
    const traces=[trace(hi,"2026-10-20T10:00:00Z"),trace(second,"2026-10-25T10:00:00Z",3,8),trace(future,"2026-10-27T10:00:00Z")];
    const selected=selectKanaReview("hiragana","recognition",traces,[event(second,"incorrect")],today,ready);
    expect(selected.counts.due).toBe(2);
    expect(selected.counts.weakDue).toBe(1);
    expect(selected.prompts.slice(0,2)).toEqual([second,hi]);
    expect(selected.prompts).not.toContain(future);
  });
  it("respects prerequisite readiness for unseen recall and form selection",()=>{
    const requireRecognized=(item:ReturnType<typeof prompt>,known:ReadonlySet<string>)=>
      known.has("kana:"+item.primaryTarget.id+":recognition:kana-to-sound");
    const empty=selectKanaReview("hiragana","reading",[],[],today,requireRecognized);
    expect(empty.counts.new).toBe(0);
    const hi=prompt("hiragana-あ","recognition");
    const started=selectKanaReview("hiragana","reading",[trace(hi,"2026-11-01T10:00:00Z")],[],today,requireRecognized);
    expect(started.counts.new).toBeGreaterThan(0);
    expect(started.prompts.some(item=>item.primaryTarget.id==="hiragana-あ"&&item.skill==="reading")).toBe(true);
  });
  it("retains future FSRS dates after a review; due count changes only when due",()=>{
    const hi=prompt("hiragana-あ","recognition");
    const old=trace(hi,"2026-10-25T10:00:00Z");
    const postponed=trace(hi,"2026-10-30T10:00:00Z");
    expect(selectKanaReview("hiragana","recognition",[old],[],today,ready).counts.due).toBe(1);
    expect(selectKanaReview("hiragana","recognition",[postponed],[],today,ready).counts.due).toBe(0);
    expect(selectKanaReview("hiragana","recognition",[postponed],[],new Date("2026-10-30T10:00:00Z"),ready).counts.due).toBe(1);
  });
  it("does not relabel or duplicate canonical exercises",()=>{
    const ids=new Set(kanaReviewPrompts.map(item=>item.id));
    expect(ids.size).toBe(kanaReviewPrompts.length);
    expect(kanaReviewPrompts.every(item=>item.primaryTarget.kind==="kana")).toBe(true);
    expect(kanaReviewPrompts.every(item=>["recognition","reading","form_selection"].includes(item.skill))).toBe(true);
    expect(kanaReviewPrompts.some(item=>item.primaryTarget.id==="katakana-long-vowel-mark")).toBe(true);
  });
});
