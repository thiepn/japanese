import "fake-indexeddb/auto";
import { describe, expect, it } from "vitest";
import { acknowledgeOutbox, databaseNameForAccount, getSyncCursor, listOutbox, listStudyEvents, saveStudyEvent, setSyncCursor } from "../../packages/local-db/src/index";
import type { StudyEvent } from "../../packages/domain/src/index";

describe("account-scoped local persistence", () => {
  it("atomically stores StudyEvent evidence and its Core Sync event mutation", async () => {
    const event: StudyEvent = {
      id: "evt-local-1", userId: "user-a", deviceId: "phone", occurredAt: "2026-10-01T12:00:00Z",
      activity: "review", primaryTarget: { kind: "lexeme", id: "lex-taberu" }, skillDimension: "meaning_recognition", result: "correct"
    };
    const mutation = await saveStudyEvent(event);
    expect((await listStudyEvents("user-a")).map((item) => item.id)).toContain("evt-local-1");
    expect(mutation.data.data).not.toHaveProperty("userId");
    expect((await listOutbox("user-a")).map((item) => item.mutation_id)).toContain(mutation.mutation_id);
    await acknowledgeOutbox("user-a", [mutation.mutation_id]);
    expect(await listOutbox("user-a")).toHaveLength(0);
  });

  it("partitions personal data by canonical AccountId", async () => {
    expect(databaseNameForAccount("user-a")).not.toBe(databaseNameForAccount("user-b"));
    expect(await listStudyEvents("user-b")).toHaveLength(0);
  });

  it("persists opaque server pull cursors separately per account", async () => {
    await setSyncCursor("user-a", "v1:42");
    expect(await getSyncCursor("user-a")).toBe("v1:42");
    expect(await getSyncCursor("user-b")).toBeNull();
  });
});
