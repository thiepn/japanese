import { describe, expect, it } from "vitest";
import { initialLearnerState, reduceStudyEvent } from "../../packages/learner-engine/src/index";
import type { StudyEvent } from "../../packages/domain/src/index";

const event: StudyEvent = {
  id: "evt-1",
  userId: "user-1",
  deviceId: "device-1",
  occurredAt: "2026-10-01T12:00:00Z",
  activity: "review",
  primaryTarget: { kind: "lexeme", id: "lex-taberu" },
  skillDimension: "meaning_recognition",
  result: "correct"
};

describe("reduceStudyEvent", () => {
  it("creates mastery evidence for the primary target", () => {
    const next = reduceStudyEvent(initialLearnerState, event);
    const projection = next.mastery["lexeme:lex-taberu:meaning_recognition"];
    expect(projection?.estimate).toBeGreaterThan(0.25);
    expect(projection?.evidenceCount).toBe(1);
    expect(next.eventCount).toBe(1);
  });
});
