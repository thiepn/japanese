import { describe, expect, it } from "vitest";
import { createFsrsScheduler } from "../../packages/scheduler/src/index";

describe("FSRS adapter", () => {
  it("creates and advances a versioned memory trace", () => {
    const scheduler = createFsrsScheduler();
    const trace = scheduler.create({
      id: "trace-1",
      userId: "user-1",
      entity: { kind: "lexeme", id: "lex-taberu" },
      skillDimension: "meaning_recognition",
      cueFamily: "written-to-meaning"
    }, "2026-10-01T12:00:00Z");
    const reviewed = scheduler.review(trace, { grade: "good", reviewedAt: "2026-10-01T12:00:00Z" });
    expect(reviewed.revision).toBe(1);
    expect(reviewed.card.reps).toBeGreaterThan(0);
    expect(new Date(reviewed.card.due).getTime()).toBeGreaterThanOrEqual(new Date("2026-10-01T12:00:00Z").getTime());
  });
});
