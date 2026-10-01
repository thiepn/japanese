export const SYNC_PROTOCOL_VERSION = 1 as const;
export interface SyncOperation<T = unknown> {
  operationId: string;
  entityType: string;
  operationType: "append" | "upsert" | "delete";
  payload: T;
  baseRevision?: number;
  clientTimestamp: string;
}
export interface SyncPushRequest { protocolVersion: typeof SYNC_PROTOCOL_VERSION; deviceId: string; operations: SyncOperation[]; }
export interface SyncPullResponse<T = unknown> { changes: T[]; nextCursor: string; }
export function dedupeOperations<T>(operations: SyncOperation<T>[]): SyncOperation<T>[] {
  const seen = new Set<string>();
  return operations.filter((operation) => {
    if (seen.has(operation.operationId)) return false;
    seen.add(operation.operationId);
    return true;
  });
}
