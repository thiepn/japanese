import "fake-indexeddb/auto";
import { describe, expect, it } from "vitest";
import { acknowledgeOutbox, databaseNameForAccount, getMemoryTrace, getSyncCursor, listOutbox, listStudyEvents, saveMemoryTrace, saveStudyEvent, setSyncCursor } from "../../packages/local-db/src/index";
import { createFsrsScheduler } from "../../packages/scheduler/src/index";
import type { StudyEvent } from "../../packages/domain/src/index";

describe("account-scoped local persistence", () => {
  it("atomically stores StudyEvent evidence and its Core Sync event mutation", async () => {
    const event: StudyEvent = {
      id:"evt-local-1",userId:"user-a",deviceId:"phone",occurredAt:"2026-10-01T12:00:00Z",activity:"review",
      primaryTarget:{kind:"lexeme",id:"lex-taberu"},skillDimension:"meaning_recognition",result:"correct"
    };
    const mutation=await saveStudyEvent(event);
    expect((await listStudyEvents("user-a")).map((item)=>item.id)).toContain("evt-local-1");
    expect(mutation.data.data).not.toHaveProperty("userId");
    expect((await listOutbox("user-a")).map((item)=>item.mutation_id)).toContain(mutation.mutation_id);
    await acknowledgeOutbox("user-a",[mutation.mutation_id]);
    expect(await listOutbox("user-a")).toHaveLength(0);
  });
  it("partitions personal data by canonical AccountId", async () => {
    expect(databaseNameForAccount("user-a")).not.toBe(databaseNameForAccount("user-b"));
    expect(await listStudyEvents("user-b")).toHaveLength(0);
  });
  it("persists opaque server pull cursors separately per account", async () => {
    await setSyncCursor("user-a","v1:42");
    expect(await getSyncCursor("user-a")).toBe("v1:42");
    expect(await getSyncCursor("user-b")).toBeNull();
  });
  it("persists FSRS memory traces independently from event history", async () => {
    const scheduler=createFsrsScheduler();
    const trace=scheduler.create({id:"trace-1",userId:"user-a",entity:{kind:"kana",id:"kana-a"},skillDimension:"recognition",cueFamily:"kana-to-sound"},"2026-10-01T12:00:00Z");
    await saveMemoryTrace("user-a",trace);
    expect((await getMemoryTrace("user-a","trace-1"))?.card.due).toBe(trace.card.due);
  });
});
