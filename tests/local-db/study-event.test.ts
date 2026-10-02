import "fake-indexeddb/auto";
import { describe, expect, it } from "vitest";
import { acknowledgeOutbox, databaseNameForAccount, deletePrivateDocument, deletePrivateVocabulary, getMemoryTrace, getSyncCursor, listOutbox, listPrivateDocuments, listPrivateVocabulary, listStudyEvents, saveMemoryTrace, savePrivateDocument, savePrivateVocabulary, saveStudyEvent, setSyncCursor } from "../../packages/local-db/src/index";
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
  it("persists private authentic documents and mined vocabulary account-locally",async()=>{
    await savePrivateDocument("user-a",{id:"doc-1",accountId:"user-a",title:"Private text",sourceKind:"paste",text:"日本語を勉強します。",importedAt:"2026-10-02T00:00:00Z",updatedAt:"2026-10-02T00:00:00Z"});
    await savePrivateVocabulary("user-a",{id:"private-lex-1",accountId:"user-a",canonicalForm:"例",reading:"れい",meaning:"example",sourceDocumentIds:["doc-1"],createdAt:"2026-10-02T00:00:00Z",updatedAt:"2026-10-02T00:00:00Z"});
    expect((await listPrivateDocuments("user-a")).map((item)=>item.id)).toContain("doc-1");
    expect(await listPrivateDocuments("user-b")).toHaveLength(0);
    expect((await listPrivateVocabulary("user-a")).map((item)=>item.id)).toContain("private-lex-1");
    await deletePrivateVocabulary("user-a","private-lex-1");
    await deletePrivateDocument("user-a","doc-1");
    expect(await listPrivateVocabulary("user-a")).toHaveLength(0);
    expect(await listPrivateDocuments("user-a")).toHaveLength(0);
  });
  it("persists FSRS memory traces independently from event history", async () => {
    const scheduler=createFsrsScheduler();
    const trace=scheduler.create({id:"trace-1",userId:"user-a",entity:{kind:"kana",id:"kana-a"},skillDimension:"recognition",cueFamily:"kana-to-sound"},"2026-10-01T12:00:00Z");
    await saveMemoryTrace("user-a",trace);
    expect((await getMemoryTrace("user-a","trace-1"))?.card.due).toBe(trace.card.due);
  });
});
