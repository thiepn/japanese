import type { StudyEvent } from "@thiepn/domain";

const DB_NAME = "thiepn-japanese";
const DB_VERSION = 1;
const STUDY_EVENTS = "study_events";
const OUTBOX = "sync_outbox";

export async function openLocalDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STUDY_EVENTS)) db.createObjectStore(STUDY_EVENTS, { keyPath: "id" });
      if (!db.objectStoreNames.contains(OUTBOX)) db.createObjectStore(OUTBOX, { keyPath: "operationId" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveStudyEvent(event: StudyEvent): Promise<void> {
  const db = await openLocalDb();
  await runTransaction(db, STUDY_EVENTS, "readwrite", (store) => store.put(event));
}
export async function listStudyEvents(): Promise<StudyEvent[]> {
  const db = await openLocalDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STUDY_EVENTS, "readonly");
    const request = transaction.objectStore(STUDY_EVENTS).getAll();
    request.onsuccess = () => resolve(request.result as StudyEvent[]);
    request.onerror = () => reject(request.error);
  });
}
function runTransaction(db: IDBDatabase, storeName: string, mode: IDBTransactionMode, mutate: (store: IDBObjectStore) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, mode);
    mutate(transaction.objectStore(storeName));
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}
