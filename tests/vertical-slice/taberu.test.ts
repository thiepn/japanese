import { describe, expect, it } from "vitest";
import type { StudyEvent } from "../../packages/domain/src/index";
import { initialLearnerState, reduceStudyEvent } from "../../packages/learner-engine/src/index";
import { createFsrsScheduler } from "../../packages/scheduler/src/index";
import { InMemorySyncStore } from "../../services/api/src/sync-store";

describe("食べる P0 vertical slice", () => {
  it("carries one learning event from phone to a second client without duplicating evidence", () => {
    const event: StudyEvent = {
      id: "evt-taberu-1", userId: "account-1", deviceId: "phone", occurredAt: "2026-10-01T12:00:00Z",
      activity: "review", primaryTarget: { kind: "lexeme", id: "lex-taberu" },
      skillDimension: "meaning_recognition", promptFamily: "written-to-meaning", result: "correct"
    };

    const phoneState = reduceStudyEvent(initialLearnerState, event);
    const scheduler = createFsrsScheduler();
    const initialTrace = scheduler.create({
      id: "trace-taberu", userId: event.userId, entity: event.primaryTarget!,
      skillDimension: "meaning_recognition", cueFamily: "written-to-meaning"
    }, event.occurredAt);
    const reviewedTrace = scheduler.review(initialTrace, { grade: "good", reviewedAt: event.occurredAt });
    expect(reviewedTrace.revision).toBe(1);

    const operation = {
      operationId: `study-event:${event.id}`, entityType: "study_event", operationType: "append" as const,
      payload: event, clientTimestamp: event.occurredAt
    };
    const server = new InMemorySyncStore();
    expect(server.push({ protocolVersion: 1, deviceId: "phone", operations: [operation] })).toEqual({ accepted: 1, duplicates: 0 });
    expect(server.push({ protocolVersion: 1, deviceId: "phone", operations: [operation] })).toEqual({ accepted: 0, duplicates: 1 });

    const pulled = server.pull(null);
    const syncedEvent = pulled.changes[0]?.operation.payload as StudyEvent;
    const laptopState = reduceStudyEvent(initialLearnerState, syncedEvent);
    const key = "lexeme:lex-taberu:meaning_recognition";
    expect(laptopState.mastery[key]?.estimate).toBe(phoneState.mastery[key]?.estimate);
    expect(laptopState.mastery[key]?.evidenceCount).toBe(1);
  });
});
