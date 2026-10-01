import { describe, expect, it } from "vitest";
import type { StudyEvent } from "../../packages/domain/src/index";
import { ReviewRevisionGate } from "../../services/api/src/review-revision-gate";

function review(id: string, deviceId: string, baseRevision: number): StudyEvent {
  return {
    id, userId: "account-1", deviceId, occurredAt: "2026-10-01T12:00:00Z", activity: "review",
    primaryTarget: { kind: "lexeme", id: "lex-taberu" }, skillDimension: "meaning_recognition",
    promptFamily: "written-to-meaning", result: "correct", baseRevision
  };
}

describe("concurrent review reconciliation", () => {
  it("lets only one offline review advance a trace revision", () => {
    const gate = new ReviewRevisionGate();
    const phone = gate.assess(review("phone-review", "phone", 0));
    const laptop = gate.assess(review("laptop-review", "laptop", 0));
    expect(phone).toMatchObject({ advancesSchedule: true, reason: "advanced", nextRevision: 1 });
    expect(laptop).toMatchObject({ advancesSchedule: false, reason: "stale_revision", observedRevision: 1, nextRevision: 1 });
  });

  it("rejects impossible future revisions instead of guessing", () => {
    const gate = new ReviewRevisionGate();
    expect(gate.assess(review("future", "phone", 3))).toMatchObject({ advancesSchedule: false, reason: "future_revision", observedRevision: 0 });
  });
});
