import { describe, expect, it } from "vitest";
import type { StudyEvent } from "../../packages/domain/src/index";
import { initialLearnerState, reduceStudyEvent } from "../../packages/learner-engine/src/index";
import { createFsrsScheduler } from "../../packages/scheduler/src/index";
import { JAPANESE_APP_ID, studyEventFromChange, studyEventToMutation, type StudyEventEnvelope } from "../../packages/sync-protocol/src/index";
import { InMemorySyncStore } from "../../services/api/src/sync-store";

describe("食べる P0 vertical slice", () => {
  it("carries one learning event through Core Event Sync semantics without duplicating evidence", () => {
    const event: StudyEvent = {
      id: "evt-taberu-1", userId: "account-1", deviceId: "phone", occurredAt: "2026-10-01T12:00:00Z",
      activity: "review", primaryTarget: { kind: "lexeme", id: "lex-taberu" }, skillDimension: "meaning_recognition",
      promptFamily: "written-to-meaning", result: "correct", baseRevision: 0
    };

    const phoneState = reduceStudyEvent(initialLearnerState, event);
    const scheduler = createFsrsScheduler();
    const trace = scheduler.review(scheduler.create({ id: "trace-taberu", userId: event.userId, entity: event.primaryTarget!, skillDimension: "meaning_recognition", cueFamily: "written-to-meaning" }, event.occurredAt), { grade: "good", reviewedAt: event.occurredAt });
    expect(trace.revision).toBe(1);

    const server = new InMemorySyncStore();
    const mutation = studyEventToMutation(event);
    const push = server.push({ protocol_version: 1, device_id: "phone", app_id: JAPANESE_APP_ID, mutations: [mutation] });
    expect(push.results[0]?.status).toBe("applied");
    expect(server.push({ protocol_version: 1, device_id: "phone", app_id: JAPANESE_APP_ID, mutations: [mutation] }).results[0]?.status).toBe("already_applied");

    const pulled = server.pull({ protocol_version: 1, device_id: "laptop", cursor: null });
    const change = pulled.changes[0] as typeof pulled.changes[number] & { data: StudyEventEnvelope };
    const syncedEvent = studyEventFromChange(change, "account-1");
    const laptopState = reduceStudyEvent(initialLearnerState, syncedEvent);
    const key = "lexeme:lex-taberu:meaning_recognition";
    expect(laptopState.mastery[key]?.estimate).toBe(phoneState.mastery[key]?.estimate);
    expect(laptopState.mastery[key]?.evidenceCount).toBe(1);
  });
});
