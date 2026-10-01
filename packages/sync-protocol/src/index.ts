import type { StudyEvent } from "@thiepn/domain";

export const SYNC_PROTOCOL_VERSION = 1 as const;
export const JAPANESE_APP_ID = "japanese" as const;
export const STUDY_EVENT_SCHEMA_VERSION = 1 as const;

export type SyncPrimitive = "row" | "event" | "document" | "file";
export type SyncOperation = "create" | "update" | "delete" | "append" | "upsert";

export interface CoreSyncMutation<T = unknown> {
  mutation_id: string;
  primitive: SyncPrimitive;
  resource_type: string;
  resource_id: string;
  operation: SyncOperation;
  base_revision?: number;
  schema_version: number;
  data: T;
}

export interface CoreSyncPushRequest<T = unknown> {
  protocol_version: typeof SYNC_PROTOCOL_VERSION;
  device_id: string;
  app_id: typeof JAPANESE_APP_ID;
  mutations: CoreSyncMutation<T>[];
}

export type SyncMutationStatus = "applied" | "already_applied" | "conflict" | "invalid" | "forbidden" | "retryable";
export interface CoreSyncMutationResult {
  mutation_id: string;
  status: SyncMutationStatus;
  resource_id: string;
  revision?: number;
  change_cursor?: string;
}
export interface CoreSyncPushResponse {
  protocol_version: typeof SYNC_PROTOCOL_VERSION;
  results: CoreSyncMutationResult[];
}

export interface CoreSyncPullRequest {
  protocol_version: typeof SYNC_PROTOCOL_VERSION;
  device_id: string;
  cursor: string | null;
  limit?: number;
}

export interface CoreSyncChange<T = unknown> {
  cursor: string;
  app_id: typeof JAPANESE_APP_ID;
  primitive: SyncPrimitive;
  resource_type: string;
  resource_id: string;
  operation: SyncOperation;
  revision?: number;
  schema_version: number;
  server_changed_at: string;
  data: T;
}
export interface CoreSyncPullResponse<T = unknown> {
  protocol_version: typeof SYNC_PROTOCOL_VERSION;
  changes: CoreSyncChange<T>[];
  next_cursor: string;
  has_more: boolean;
  reset_required: boolean;
}

export type StudyEventWirePayload = Omit<StudyEvent, "userId" | "receivedAt">;
export interface StudyEventEnvelope {
  event_id: string;
  app_id: typeof JAPANESE_APP_ID;
  event_type: "study.event";
  schema_version: typeof STUDY_EVENT_SCHEMA_VERSION;
  occurred_at: string;
  data: StudyEventWirePayload;
}

export function studyEventToMutation(event: StudyEvent): CoreSyncMutation<StudyEventEnvelope> {
  const { userId: _ownerIsServerDerived, receivedAt: _serverOwned, ...data } = event;
  return {
    mutation_id: event.id,
    primitive: "event",
    resource_type: "study_event",
    resource_id: event.id,
    operation: "append",
    schema_version: STUDY_EVENT_SCHEMA_VERSION,
    data: {
      event_id: event.id,
      app_id: JAPANESE_APP_ID,
      event_type: "study.event",
      schema_version: STUDY_EVENT_SCHEMA_VERSION,
      occurred_at: event.occurredAt,
      data
    }
  };
}

export function studyEventFromChange(change: CoreSyncChange<StudyEventEnvelope>, authenticatedAccountId: string): StudyEvent {
  if (change.app_id !== JAPANESE_APP_ID || change.primitive !== "event" || change.resource_type !== "study_event") throw new Error("NOT_JAPANESE_STUDY_EVENT");
  if (change.data.event_type !== "study.event" || change.data.event_id !== change.resource_id || change.data.data.id !== change.resource_id) throw new Error("INVALID_STUDY_EVENT_ENVELOPE");
  return { ...change.data.data, userId: authenticatedAccountId, receivedAt: change.server_changed_at };
}

export function dedupeMutations<T>(mutations: CoreSyncMutation<T>[]): CoreSyncMutation<T>[] {
  const seen = new Set<string>();
  return mutations.filter((mutation) => {
    if (seen.has(mutation.mutation_id)) return false;
    seen.add(mutation.mutation_id);
    return true;
  });
}
