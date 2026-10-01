import "fake-indexeddb/auto";
import { describe, expect, it } from "vitest";
import { acknowledgeOutbox, databaseNameForAccount, getSyncCursor, listOutbox, listStudyEvents, saveStudyEvent, setSyncCursor } from "../../packages/local-db/src/index";
import type { StudyEvent } from "../../packages/domain/src/index";

describe("account-scoped local persistence", () => {
  it("atomically stores StudyEvent evidence and its sync operation", async () => {
    const event: StudyEvent = {
      id: "evt-local-1", userId: "user-a", deviceId: "phone", occurredAt: "2026-10-01T12:00:00Z",
      activity: "review", primaryTarget: { kind: "lexeme", id: "lex-taberu" },
      skillDimension: "meaning_recognition", result: "correct"
    };
    const operation = await saveStudyEvent(event);
    expect((await listStudyEvents("user-a")).map((item) => item.id)).toContain("evt-local-1");
    expect((await listOutbox("user-a")).map((item) => item.operationId)).toContain(operation.operationId);
    await acknowledgeOutbox("user-a", [operation.operationId]);
    expect(await listOutbox("user-a")).toHaveLength(0);
  });

  it("partitions personal data by canonical AccountId", async () => {
    expect(databaseNameForAccount("user-a")).not.toBe(databaseNameForAccount("user-b"));
    expect(await listStudyEvents("user-b")).toHaveLength(0);
  });

  it("persists the server pull cursor separately per account", async () => {
    await setSyncCursor("user-a", "42");
    expect(await getSyncCursor("user-a")).toBe("42");
    expect(await getSyncCursor("user-b")).toBeNull();
  });
});
