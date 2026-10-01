import { describe, expect, it } from "vitest";
import { dedupeOperations } from "../../packages/sync-protocol/src/index";

describe("sync operation idempotency", () => {
  it("drops duplicate operation IDs before transport", () => {
    const operation = {
      operationId: "op-1",
      entityType: "study_event",
      operationType: "append" as const,
      payload: { id: "evt-1" },
      clientTimestamp: "2026-10-01T12:00:00Z"
    };
    expect(dedupeOperations([operation, operation])).toHaveLength(1);
  });
});
