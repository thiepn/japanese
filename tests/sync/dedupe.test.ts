import { describe, expect, it } from "vitest";
import { dedupeMutations } from "../../packages/sync-protocol/src/index";

describe("Core Sync mutation idempotency", () => {
  it("drops duplicate mutation IDs before transport", () => {
    const mutation = {
      mutation_id: "mutation-1", primitive: "event" as const, resource_type: "study_event", resource_id: "event-1", operation: "append" as const,
      schema_version: 1, data: { value: true }
    };
    expect(dedupeMutations([mutation, mutation])).toHaveLength(1);
  });
});
