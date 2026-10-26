import "fake-indexeddb/auto";
import {describe,expect,it} from "vitest";
import {createFsrsScheduler} from "../../packages/scheduler/src/index";
import type {StudyEvent} from "@thiepn/domain";
import {getMemoryTrace,listMemoryTraces,listFlashcardSuspensions,listOutbox,listStudyEvents,saveStudyReview,
  setFlashcardSuspension,undoPendingFlashcardReview,acknowledgeOutbox,getFlashcardDeckLimits,saveFlashcardDeckLimits} from "../../packages/local-db/src/index";

const scheduler=createFsrsScheduler();
function prepared(owner:string){
 const id="kana:hiragana-あ:recognition:kana-to-sound";
 const primaryTarget={kind:"kana" as const,id:"hiragana-あ"};
 const original=scheduler.create({id,userId:owner,entity:primaryTarget,skillDimension:"recognition",cueFamily:"kana-to-sound"},"2026-10-26T10:00:00Z");
 const updated=scheduler.review(original,{grade:"hard",reviewedAt:"2026-10-26T10:01:00Z"});
 const event:StudyEvent={id:"review-"+owner,userId:owner,deviceId:"device",occurredAt:"2026-10-26T10:01:00Z",
  activity:"review",primaryTarget,skillDimension:"recognition",promptFamily:"kana-to-sound",
  responseMode:"flashcard",result:"partial",baseRevision:original.revision,
  metadata:{flashcard:true,reviewGrade:"hard"}};
 const undo:StudyEvent={...event,id:"undo-"+owner,occurredAt:"2026-10-26T10:02:00Z",result:"skipped",
  metadata:{flashcardUndo:true,undoOf:event.id,schedulerExcluded:true}};
 return {id,original,updated,event,undo};
}
describe("durable kana flashcard storage",()=>{
 it("keeps suspensions scoped to owner without overwriting FSRS or study history",async()=>{
  const user="flashcard-suspension-1",other="flashcard-suspension-2";
  await setFlashcardSuspension(user,"kana:hiragana-あ:recognition:kana-to-sound",true);
  expect(await listFlashcardSuspensions(user)).toEqual(["kana:hiragana-あ:recognition:kana-to-sound"]);
  expect(await listFlashcardSuspensions(other)).toEqual([]);
  expect(await listStudyEvents(user)).toEqual([]);
  await setFlashcardSuspension(user,"kana:hiragana-あ:recognition:kana-to-sound",false);
  expect(await listFlashcardSuspensions(user)).toEqual([]);
 });
 it("persists per-deck offline limits without leaking across accounts or deck selections",async()=>{
  const a="flashcard-limits-1",b="flashcard-limits-2";
  await expect(getFlashcardDeckLimits(a,"mixed:recognition")).resolves.toBeNull();
  await saveFlashcardDeckLimits(a,"mixed:recognition",{newCards:3,reviews:24});
  await saveFlashcardDeckLimits(a,"hiragana:reading",{newCards:0,reviews:10});
  expect(await getFlashcardDeckLimits(a,"mixed:recognition")).toEqual({newCards:3,reviews:24});
  expect(await getFlashcardDeckLimits(a,"hiragana:reading")).toEqual({newCards:0,reviews:10});
  expect(await getFlashcardDeckLimits(b,"mixed:recognition")).toBeNull();
  await expect(saveFlashcardDeckLimits(a,"mixed:recognition",{newCards:31,reviews:4})).rejects.toThrow();
  await expect(saveFlashcardDeckLimits(a,"invalid:reading",{newCards:1,reviews:4})).rejects.toThrow();
  expect((await listMemoryTraces(a))).toEqual([]);
  expect((await listStudyEvents(a))).toEqual([]);
 });
 it("atomically appends an undo marker and reverts the previous FSRS snapshot",async()=>{
  const owner="flashcard-undo-1";const {id,original,updated,event,undo}=prepared(owner);
  await saveStudyReview(event,updated);
  expect((await getMemoryTrace(owner,id))?.revision).toBe(updated.revision);
  await undoPendingFlashcardReview({accountId:owner,originalEventId:event.id,previous:original,updated,undoEvent:undo});
  expect(await getMemoryTrace(owner,id)).toEqual(original);
  expect((await listStudyEvents(owner)).map(row=>row.id).sort()).toEqual([event.id,undo.id].sort());
  expect((await listOutbox(owner)).map(row=>row.mutation_id).sort()).toEqual([event.id,undo.id].sort());
 });
 it("refuses undo after sync acknowledgment without modifying the reviewed schedule",async()=>{
  const owner="flashcard-synced-1";const {id,original,updated,event,undo}=prepared(owner);
  await saveStudyReview(event,updated);await acknowledgeOutbox(owner,[event.id]);
  await expect(undoPendingFlashcardReview({accountId:owner,originalEventId:event.id,
    previous:original,updated,undoEvent:undo})).rejects.toThrow();
  expect(await getMemoryTrace(owner,id)).toEqual(updated);
  expect((await listStudyEvents(owner)).map(row=>row.id)).toEqual([event.id]);
 });
 it("rejects a stale concurrent flashcard grade atomically without losing the winning review",async()=>{
  const owner="flashcard-race-1";const {id,updated,event}=prepared(owner);
  await saveStudyReview(event,updated);
  const stale:StudyEvent={...event,id:"stale-"+owner,occurredAt:"2026-10-26T10:01:01Z"};
  await expect(saveStudyReview(stale,updated)).rejects.toThrow("FLASHCARD_REVISION_CONFLICT");
  expect(await getMemoryTrace(owner,id)).toEqual(updated);
  expect((await listStudyEvents(owner)).map(row=>row.id)).toEqual([event.id]);
  expect((await listOutbox(owner)).map(row=>row.mutation_id)).toEqual([event.id]);
 });
 it("rejects rollback after a newer FSRS update and keeps original event intact",async()=>{
  const owner="flashcard-conflict-1";const {id,original,updated,event,undo}=prepared(owner);
  const later=scheduler.review(updated,{grade:"good",reviewedAt:"2026-10-26T10:03:00Z"});
  await saveStudyReview(event,updated);
  const newer:StudyEvent={...event,id:"newer-"+owner,occurredAt:"2026-10-26T10:03:00Z",
    baseRevision:updated.revision};
  await saveStudyReview(newer,later);
  await expect(undoPendingFlashcardReview({accountId:owner,originalEventId:event.id,
    previous:original,updated,undoEvent:undo})).rejects.toThrow();
  expect(await getMemoryTrace(owner,id)).toEqual(later);
  expect((await listStudyEvents(owner)).map(row=>row.id).sort()).toEqual([event.id,newer.id].sort());
 });
});
