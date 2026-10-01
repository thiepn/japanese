import { describe, expect, it } from "vitest";
import { JAPANESE_APP_ID } from "../../packages/sync-protocol/src/index";
import { InMemorySyncStore } from "../../services/api/src/sync-store";

describe("THIEPN Core Sync v1 conformance harness", () => {
  it("applies mutations idempotently and exposes opaque cursor pull", () => {
    const store = new InMemorySyncStore();
    const request = {
      protocol_version: 1 as const, device_id: "phone", app_id: JAPANESE_APP_ID,
      mutations: [{ mutation_id: "mutation-1", primitive: "event" as const, resource_type: "study_event", resource_id: "event-1", operation: "append" as const, schema_version: 1, data: { id: "event-1" } }]
    };
    expect(store.push(request).results[0]?.status).toBe("applied");
    expect(store.push(request).results[0]?.status).toBe("already_applied");
    const first = store.pull({ protocol_version: 1, device_id: "laptop", cursor: null });
    expect(first.changes).toHaveLength(1);
    expect(first.next_cursor).toMatch(/^v1:/);
    expect(store.pull({ protocol_version: 1, device_id: "laptop", cursor: first.next_cursor }).changes).toHaveLength(0);
  });

  it("rejects mutation ID reuse with changed content", () => {
    const store = new InMemorySyncStore();
    const base = { protocol_version: 1 as const, device_id: "phone", app_id: JAPANESE_APP_ID };
    store.push({ ...base, mutations: [{ mutation_id: "same", primitive: "event", resource_type: "study_event", resource_id: "event-1", operation: "append", schema_version: 1, data: { a: 1 } }] });
    expect(() => store.push({ ...base, mutations: [{ mutation_id: "same", primitive: "event", resource_type: "study_event", resource_id: "event-1", operation: "append", schema_version: 1, data: { a: 2 } }] })).toThrow("MUTATION_ID_REUSE");
  });
});
