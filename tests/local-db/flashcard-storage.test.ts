import "fake-indexeddb/auto";
import {describe,expect,it} from "vitest";
import {createFsrsScheduler} from "@thiepn/scheduler";
import type {StudyEvent} from "@thiepn/domain";
import {getMemoryTrace,listFlashcardSuspensions,listOutbox,listStudyEvents,saveStudyReview,
  setFlashcardSuspension,undoPendingFlashcardReview,acknowledgeOutbox} from "../../packages/local-db/src/index";

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
 it("rejects rollback after a newer FSRS update and keeps original event intact",async()=>{
  const owner="flashcard-conflict-1";const {id,original,updated,event,undo}=prepared(owner);
  const later=scheduler.review(updated,{grade:"good",reviewedAt:"2026-10-26T10:03:00Z"});
  await saveStudyReview(event,later);
  await expect(undoPendingFlashcardReview({accountId:owner,originalEventId:event.id,
    previous:original,updated,undoEvent:undo})).rejects.toThrow();
  expect(await getMemoryTrace(owner,id)).toEqual(later);
  expect((await listStudyEvents(owner)).map(row=>row.id)).toEqual([event.id]);
 });
});
