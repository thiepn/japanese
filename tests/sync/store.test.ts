import { describe,expect,it } from "vitest";
import { InMemorySyncStore } from "../../services/api/src/sync-store";

describe("sync store",()=>{
  it("is idempotent and exposes cursor-based pull",()=>{
    const store=new InMemorySyncStore();
    const request={protocolVersion:1 as const,deviceId:"phone",operations:[{operationId:"op-1",entityType:"study_event",operationType:"append" as const,payload:{id:"evt-1"},clientTimestamp:"2026-10-01T12:00:00Z"}]};
    expect(store.push(request)).toEqual({accepted:1,duplicates:0});
    expect(store.push(request)).toEqual({accepted:0,duplicates:1});
    const first=store.pull(null);
    expect(first.changes).toHaveLength(1);
    expect(store.pull(first.nextCursor).changes).toHaveLength(0);
  });
});
