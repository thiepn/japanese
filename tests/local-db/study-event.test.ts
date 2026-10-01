import "fake-indexeddb/auto";
import { describe, expect, it } from "vitest";
import { listStudyEvents, saveStudyEvent } from "../../packages/local-db/src/index";
import type { StudyEvent } from "../../packages/domain/src/index";

describe("local StudyEvent persistence", () => {
  it("persists immutable learning evidence locally", async () => {
    const event: StudyEvent = {
      id: "evt-local-1",
      userId: "user-1",
      deviceId: "device-1",
      occurredAt: "2026-10-01T12:00:00Z",
      activity: "review",
      primaryTarget: { kind: "lexeme", id: "lex-taberu" },
      skillDimension: "meaning_recognition",
      result: "correct"
    };
    await saveStudyEvent(event);
    const events = await listStudyEvents();
    expect(events.some((item) => item.id === "evt-local-1")).toBe(true);
  });
});
