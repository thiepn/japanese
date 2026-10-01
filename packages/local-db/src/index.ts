import type { StudyEvent } from "@thiepn/domain";
import { studyEventToMutation, type CoreSyncMutation, type StudyEventEnvelope } from "@thiepn/sync-protocol";

const DB_VERSION = 2;
const STUDY_EVENTS = "study_events";
const OUTBOX = "sync_outbox";
const SYNC_META = "sync_meta";

export interface SyncMetaRecord { key: string; value: string; }

export function databaseNameForAccount(accountId: string): string {
  if (!accountId.trim()) throw new Error("ACCOUNT_ID_REQUIRED");
  return `thiepn-japanese:${accountId}`;
}

export async function openLocalDb(accountId: string): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseNameForAccount(accountId), DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = request.result;
      const oldVersion = (event as IDBVersionChangeEvent).oldVersion;
      if (!db.objectStoreNames.contains(STUDY_EVENTS)) db.createObjectStore(STUDY_EVENTS, { keyPath: "id" });
      if (oldVersion < 2 && db.objectStoreNames.contains(OUTBOX)) db.deleteObjectStore(OUTBOX);
      if (!db.objectStoreNames.contains(OUTBOX)) db.createObjectStore(OUTBOX, { keyPath: "mutation_id" });
      if (!db.objectStoreNames.contains(SYNC_META)) db.createObjectStore(SYNC_META, { keyPath: "key" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveStudyEvent(event: StudyEvent): Promise<CoreSyncMutation<StudyEventEnvelope>> {
  const db = await openLocalDb(event.userId);
  const mutation = studyEventToMutation(event);
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction([STUDY_EVENTS, OUTBOX], "readwrite");
    transaction.objectStore(STUDY_EVENTS).put(event);
    transaction.objectStore(OUTBOX).put(mutation);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
  db.close();
  return mutation;
}

export async function listStudyEvents(accountId: string): Promise<StudyEvent[]> { return getAllFromStore<StudyEvent>(accountId, STUDY_EVENTS); }
export async function listOutbox(accountId: string): Promise<CoreSyncMutation[]> { return getAllFromStore<CoreSyncMutation>(accountId, OUTBOX); }

export async function acknowledgeOutbox(accountId: string, mutationIds: readonly string[]): Promise<void> {
  if (mutationIds.length === 0) return;
  const db = await openLocalDb(accountId);
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(OUTBOX, "readwrite");
    const store = transaction.objectStore(OUTBOX);
    for (const mutationId of mutationIds) store.delete(mutationId);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
  db.close();
}

export async function getSyncCursor(accountId: string): Promise<string | null> {
  const db = await openLocalDb(accountId);
  return new Promise((resolve, reject) => {
    const request = db.transaction(SYNC_META, "readonly").objectStore(SYNC_META).get("cursor");
    request.onsuccess = () => { db.close(); resolve((request.result as SyncMetaRecord | undefined)?.value ?? null); };
    request.onerror = () => { db.close(); reject(request.error); };
  });
}

export async function setSyncCursor(accountId: string, cursor: string): Promise<void> {
  const db = await openLocalDb(accountId);
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(SYNC_META, "readwrite");
    transaction.objectStore(SYNC_META).put({ key: "cursor", value: cursor } satisfies SyncMetaRecord);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
  db.close();
}

async function getAllFromStore<T>(accountId: string, storeName: string): Promise<T[]> {
  const db = await openLocalDb(accountId);
  return new Promise((resolve, reject) => {
    const request = db.transaction(storeName, "readonly").objectStore(storeName).getAll();
    request.onsuccess = () => { db.close(); resolve(request.result as T[]); };
    request.onerror = () => { db.close(); reject(request.error); };
  });
}
