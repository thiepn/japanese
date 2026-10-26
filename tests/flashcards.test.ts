import {describe,expect,it} from "vitest";
import {createFsrsScheduler} from "../packages/scheduler/src/index";
import {effectiveStudyEvents,replayStudyEvents} from "../packages/learner-engine/src/index";
import {foundationPrompts,foundationApplicationPrompts} from "../apps/web/src/study/foundationPrompts";
import {buildKanaFlashcards,asFlashcard,gradeResult,normalizedFlashcardLimits,openFlashcardQueue,advanceFlashcardQueue,nextAvailableFlashcard,nextFlashcardWaitMs,withoutFlashcard} from "../apps/web/src/study/flashcards";
import {kanaReviewTraceId} from "../apps/web/src/study/kanaReview";
import type {StudyEvent} from "@thiepn/domain";

const ready=()=>true;
const now=new Date("2026-10-26T17:00:00Z");
const first=foundationPrompts.find(p=>p.primaryTarget.id==="hiragana-あ")!;
const counterpart=foundationPrompts.find(p=>p.primaryTarget.id==="katakana-ア")!;
const reading=foundationApplicationPrompts.find(p=>p.primaryTarget.id==="hiragana-あ"&&p.skill==="form_selection")!;

describe("Anki-style kana flashcards",()=>{
 it("shows canonical kana on front, reading on back, and reverse direction independently",()=>{
  expect(asFlashcard(first)).toMatchObject({id:kanaReviewTraceId(first),front:"あ",back:"a",state:"new"});
  expect(asFlashcard(counterpart)).toMatchObject({front:"ア",back:"a"});
  expect(asFlashcard(reading)).toMatchObject({front:"a",back:"あ",direction:"Sound → Kana"});
  expect(reading.primaryTarget.id).toBe(first.primaryTarget.id);
  expect(kanaReviewTraceId(reading)).not.toBe(kanaReviewTraceId(first));
 });
 it("uses existing FSRS traces, preserves future-due cards and respects suspensions",()=>{
  const fsrs=createFsrsScheduler();
  const identity={id:kanaReviewTraceId(first),userId:"study-a",entity:first.primaryTarget,
    skillDimension:first.skill,cueFamily:first.cueFamily};
  const fresh=fsrs.create(identity,"2026-10-25T10:00:00Z");
  const traced=fsrs.review(fresh,{grade:"good",reviewedAt:"2026-10-25T10:00:00Z"});
  const original=JSON.stringify(traced);
  const due={...traced,card:{...traced.card,due:"2026-10-26T15:00:00Z"}};
  const selected=buildKanaFlashcards("hiragana","recognition",[due],[],now,ready,new Set(),
    {reviews:12,newCards:0});
  expect(selected[0]).toMatchObject({id:identity.id,front:"あ",state:asFlashcard(first,due).state});
  expect(buildKanaFlashcards("hiragana","recognition",[due],[],now,ready,new Set([identity.id]),
    {reviews:12,newCards:0})).toHaveLength(0);
  expect(buildKanaFlashcards("hiragana","recognition",[traced],[],new Date("2026-10-24T10:00:00Z"),ready,new Set(),
    {reviews:12,newCards:0})).toHaveLength(0);
  expect(JSON.stringify(traced)).toBe(original);
 });
 it("caps new and due cards without changing canonical prompt or scheduler identity",()=>{
  const mixed=buildKanaFlashcards("mixed","recognition",[],[],now,ready,new Set(),
    {reviews:10,newCards:4});
  expect(mixed).toHaveLength(4);
  expect(mixed.map(p=>p.prompt.primaryTarget.id.split("-")[0]))
    .toEqual(["hiragana","katakana","hiragana","katakana"]);
  expect(new Set(mixed.map(p=>p.id)).size).toBe(4);
  expect(normalizedFlashcardLimits({reviews:1000,newCards:-3})).toEqual({reviews:100,newCards:0});
 });
 it("maps all four self-grades to learner evidence without changing the FSRS grade",()=>{
  expect(["again","hard","good","easy"].map(value=>gradeResult(value as "again"|"hard"|"good"|"easy")))
    .toEqual(["incorrect","partial","correct","correct"]);
 });
 it("requeues a failed learning card using only the FSRS due timestamp, after other available cards",()=>{
  const a=asFlashcard(first),b=asFlashcard(counterpart);
  const original=openFlashcardQueue([a,b]);
  const fsrs=createFsrsScheduler();
  const base=fsrs.create({id:a.id,userId:"test",entity:first.primaryTarget,
    skillDimension:first.skill,cueFamily:first.cueFamily},"2026-10-26T10:00:00Z");
  const actual=fsrs.review(base,{grade:"again",reviewedAt:"2026-10-26T10:00:00Z"});
  expect([1,3]).toContain(actual.card.state);
  const pending=advanceFlashcardQueue(original,0,actual);
  expect(pending).toHaveLength(2);
  expect(pending[0]!.card.id).toBe(b.id);
  expect(pending[1]!.card.id).toBe(a.id);
  expect(pending[1]!.availableAt).toBe(Date.parse(actual.card.due));
  const before=Date.parse(actual.card.due)-1000;
  expect(nextAvailableFlashcard(pending,before)).toBe(0);
  const onlyLearning=pending.slice(1);
  expect(nextAvailableFlashcard(onlyLearning,before)).toBe(-1);
  expect(nextFlashcardWaitMs(onlyLearning,before)).toBe(1000);
  expect(nextAvailableFlashcard(onlyLearning,Date.parse(actual.card.due))).toBe(0);
  expect(original).toHaveLength(2);
 });
 it("supports relearning states, graduation, card suspension and exact queue rollback",()=>{
  const original=openFlashcardQueue([asFlashcard(first),asFlashcard(counterpart)]);
  const fsrs=createFsrsScheduler();
  const base=fsrs.create({id:original[0]!.card.id,userId:"test",entity:first.primaryTarget,
    skillDimension:first.skill,cueFamily:first.cueFamily},"2026-10-26T10:00:00Z");
  const learning={...base,revision:5,card:{...base.card,state:3,due:"2026-10-26T11:03:00Z"}};
  const pending=advanceFlashcardQueue(original,0,learning);
  expect(pending[1]!.card.state).toBe("relearning");
  expect(pending[1]!.availableAt).toBe(Date.parse(learning.card.due));
  const graduated={...learning,revision:6,card:{...learning.card,state:2,due:"2026-10-28T10:00:00Z"}};
  expect(advanceFlashcardQueue(pending,1,graduated)).toHaveLength(1);
  expect(withoutFlashcard(pending,first.primaryTarget.id)).toHaveLength(2);
  expect(withoutFlashcard(pending,pending[1]!.card.id)).toHaveLength(1);
  expect(original).toEqual(openFlashcardQueue([asFlashcard(first),asFlashcard(counterpart)]));
  expect(()=>advanceFlashcardQueue(original,1,graduated)).toThrow("FLASHCARD_QUEUE_TRACE_MISMATCH");
  expect(()=>advanceFlashcardQueue(original,0,{...learning,card:{...learning.card,due:"invalid"}}))
    .toThrow("FLASHCARD_INVALID_FSRS_DUE");
 });
 it("retains append-only undo evidence but removes cancelled grades from mastery replay",()=>{
  const base={id:"grade-1",userId:"learner",deviceId:"mobile",occurredAt:"2026-10-26T10:00:00Z",
    activity:"review" as const,primaryTarget:first.primaryTarget,skillDimension:first.skill,
    promptFamily:first.cueFamily,result:"correct" as const,metadata:{flashcard:true,reviewGrade:"good"}};
  const undo:StudyEvent={...base,id:"undo-1",occurredAt:"2026-10-26T10:00:01Z",
    result:"skipped",metadata:{flashcardUndo:true,undoOf:"grade-1",schedulerExcluded:true}};
  const active=effectiveStudyEvents([base,undo]);
  expect(active).toEqual([]);
  expect(replayStudyEvents([base,undo]).eventCount).toBe(0);
  expect(replayStudyEvents([base]).eventCount).toBe(1);
 });
});
