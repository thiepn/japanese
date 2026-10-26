import {describe,expect,it} from "vitest";
import {createFsrsScheduler} from "@thiepn/scheduler";
import {effectiveStudyEvents,replayStudyEvents} from "@thiepn/learner-engine";
import {foundationPrompts,foundationApplicationPrompts} from "../apps/web/src/study/foundationPrompts";
import {buildKanaFlashcards,asFlashcard,gradeResult,normalizedFlashcardLimits} from "../apps/web/src/study/flashcards";
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
