import { JAPANESE_APP_ID, SYNC_PROTOCOL_VERSION, type CoreSyncChange, type CoreSyncMutation, type CoreSyncMutationResult, type CoreSyncPullRequest, type CoreSyncPullResponse, type CoreSyncPushRequest, type CoreSyncPushResponse } from "@thiepn/sync-protocol";

interface StoredChange { sequence: number; change: CoreSyncChange; }
interface AppliedMutation { digest: string; result: CoreSyncMutationResult; }

export class InMemorySyncStore {
  private sequence = 0;
  private readonly applied = new Map<string, AppliedMutation>();
  private readonly changes: StoredChange[] = [];

  push(request: CoreSyncPushRequest): CoreSyncPushResponse {
    if (request.protocol_version !== SYNC_PROTOCOL_VERSION) throw new Error("PROTOCOL_VERSION_UNSUPPORTED");
    if (request.app_id !== JAPANESE_APP_ID) throw new Error("APP_UNREGISTERED");
    const results: CoreSyncMutationResult[] = [];
    for (const mutation of request.mutations) {
      const digest = canonicalDigest(mutation);
      const existing = this.applied.get(mutation.mutation_id);
      if (existing) {
        if (existing.digest !== digest) throw new Error("MUTATION_ID_REUSE");
        results.push({ ...existing.result, status: "already_applied" });
        continue;
      }

      this.sequence += 1;
      const cursor = encodeCursor(this.sequence);
      const change: CoreSyncChange = {
        cursor, app_id: JAPANESE_APP_ID, primitive: mutation.primitive, resource_type: mutation.resource_type,
        resource_id: mutation.resource_id, operation: mutation.operation, schema_version: mutation.schema_version,
        server_changed_at: new Date().toISOString(), data: mutation.data
      };
      this.changes.push({ sequence: this.sequence, change });
      const result: CoreSyncMutationResult = { mutation_id: mutation.mutation_id, status: "applied", resource_id: mutation.resource_id, change_cursor: cursor };
      this.applied.set(mutation.mutation_id, { digest, result });
      results.push(result);
    }
    return { protocol_version: SYNC_PROTOCOL_VERSION, results };
  }

  pull(request: CoreSyncPullRequest): CoreSyncPullResponse {
    if (request.protocol_version !== SYNC_PROTOCOL_VERSION) throw new Error("PROTOCOL_VERSION_UNSUPPORTED");
    const after = decodeCursor(request.cursor);
    const limit = Math.max(1, Math.min(request.limit ?? 500, 500));
    const available = this.changes.filter((entry) => entry.sequence > after);
    const page = available.slice(0, limit);
    const nextSequence = page.at(-1)?.sequence ?? after;
    return {
      protocol_version: SYNC_PROTOCOL_VERSION,
      changes: page.map((entry) => entry.change),
      next_cursor: encodeCursor(nextSequence),
      has_more: available.length > page.length,
      reset_required: false
    };
  }
}

function canonicalDigest(mutation: CoreSyncMutation): string { return JSON.stringify(mutation); }
function encodeCursor(sequence: number): string { return `v1:${sequence}`; }
function decodeCursor(cursor: string | null): number {
  if (cursor === null) return 0;
  const match = /^v1:(\d+)$/.exec(cursor);
  if (!match) throw new Error("SYNC_CURSOR_EXPIRED");
  return Number(match[1]);
}
