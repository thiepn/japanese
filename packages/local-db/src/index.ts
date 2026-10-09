import type { StudyEvent } from "@thiepn/domain";
import type { MemoryTrace } from "@thiepn/scheduler";
import { studyEventToMutation, type CoreSyncMutation, type StudyEventEnvelope } from "@thiepn/sync-protocol";

const DB_VERSION = 8;
const STUDY_EVENTS = "study_events";
const MEMORY_TRACES = "memory_traces";
const OUTBOX = "sync_outbox";
const SYNC_META = "sync_meta";
const PRIVATE_DOCUMENTS = "private_documents";
const PRIVATE_VOCABULARY = "private_vocabulary";
const PRIVATE_SENTENCES = "private_sentences";
const PRIVATE_MEDIA_REVIEWS = "private_media_reviews";
const PRIVATE_PROSODY_CAPTURES = "private_prosody_captures";

export interface SyncMetaRecord { key: string; value: string; }

export type PrivateDocumentSourceKind="paste"|"text_file"|"subtitle"|"tatoeba"|"source_pack";
export interface PrivateAudioSegment {
  id:string;
  text:string;
  startMs:number;
  endMs:number;
}
export type PrivateAudioSpeechRate="slow"|"natural"|"fast";
export type PrivateAudioRegister="casual"|"neutral"|"polite"|"formal";
export interface PrivateNativeAudio {
  url:string; credit:string; licenseName:string; attributionUrl?:string; externalId?:string;
  segments?:PrivateAudioSegment[];
  speechRate?:PrivateAudioSpeechRate;
  register?:PrivateAudioRegister;
  speakerLabel?:string;
}
export interface PrivateDocumentRecord {
  id:string; accountId:string; title:string; sourceKind:PrivateDocumentSourceKind; text:string;
  importedAt:string; updatedAt:string; sourceLabel?:string; sourceUrl?:string; nativeAudio?:PrivateNativeAudio; nativeAudioVariants?:PrivateNativeAudio[];
}
export interface PrivateVocabularyRecord {
  id:string; accountId:string; canonicalForm:string; reading?:string; meaning:string;
  sourceDocumentIds:string[]; createdAt:string; updatedAt:string;
}
export interface PrivateSentenceRecord {
  id:string; accountId:string; text:string; translation:string; sourceDocumentIds:string[];
  createdAt:string; updatedAt:string;
}

export type PrivateMediaReviewStatus="candidate"|"verified"|"rejected";
export interface PrivateMediaReviewChecklist {
  sourceReachable:boolean;
  licenseVerified:boolean;
  nativeSpeakerVerified:boolean;
  transcriptMatchVerified:boolean;
  registerReviewed:boolean;
  speechRateReviewed:boolean;
}
export interface PrivateProsodyCaptureRecord {
  id:string;
  accountId:string;
  createdAt:string;
  updatedAt:string;
  mimeType:string;
  audioBlob:Blob;
  sizeBytes:number;
  durationMs:number;
  activeSpeechRatio:number;
  pauseRatio:number;
  longPauseCount:number;
  phraseCount:number;
  dynamicRangeDb:number;
  targetLabel?:string;
}

export interface PrivateMediaReviewRecord {
  id:string;
  accountId:string;
  documentId:string;
  recordingKey:string;
  status:PrivateMediaReviewStatus;
  reviewerLabel:string;
  reviewedAt:string;
  checklist:PrivateMediaReviewChecklist;
  notes?:string;
}

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
      if (!db.objectStoreNames.contains(MEMORY_TRACES)) db.createObjectStore(MEMORY_TRACES, { keyPath: "id" });
      if (!db.objectStoreNames.contains(PRIVATE_DOCUMENTS)) db.createObjectStore(PRIVATE_DOCUMENTS, { keyPath: "id" });
      if (!db.objectStoreNames.contains(PRIVATE_VOCABULARY)) db.createObjectStore(PRIVATE_VOCABULARY, { keyPath: "id" });
      if (!db.objectStoreNames.contains(PRIVATE_SENTENCES)) db.createObjectStore(PRIVATE_SENTENCES, { keyPath: "id" });
      if (!db.objectStoreNames.contains(PRIVATE_MEDIA_REVIEWS)) db.createObjectStore(PRIVATE_MEDIA_REVIEWS, { keyPath: "id" });
      if (!db.objectStoreNames.contains(PRIVATE_PROSODY_CAPTURES)) db.createObjectStore(PRIVATE_PROSODY_CAPTURES, { keyPath: "id" });
    };
    request.onsuccess = () => {
      const db = request.result;
      db.onversionchange = () => db.close();
      resolve(db);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function saveStudyEvent(event: StudyEvent): Promise<CoreSyncMutation<StudyEventEnvelope>> {
  return saveStudyReview(event);
}

/** Evidence, its outbox entry and scheduler state commit together or not at all. */
export async function saveStudyReview(event: StudyEvent, trace?: MemoryTrace): Promise<CoreSyncMutation<StudyEventEnvelope>> {
  if (trace && trace.userId !== event.userId) throw new Error("MEMORY_TRACE_ACCOUNT_MISMATCH");
  const db = await openLocalDb(event.userId);
  const mutation = studyEventToMutation(event);
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction([STUDY_EVENTS, OUTBOX, MEMORY_TRACES], "readwrite");
      try {
        transaction.objectStore(STUDY_EVENTS).put(event);
        transaction.objectStore(OUTBOX).put(mutation);
        if (trace) transaction.objectStore(MEMORY_TRACES).put(trace);
      } catch (error) {
        transaction.abort();
        reject(error);
        return;
      }
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  } finally { db.close(); }
  return mutation;
}

export async function saveMemoryTrace(accountId: string, trace: MemoryTrace): Promise<void> {
  if (trace.userId !== accountId) throw new Error("MEMORY_TRACE_ACCOUNT_MISMATCH");
  const db = await openLocalDb(accountId);
  await putOne(db, MEMORY_TRACES, trace);
  db.close();
}

export async function getMemoryTrace(accountId: string, traceId: string): Promise<MemoryTrace | null> {
  const db = await openLocalDb(accountId);
  return new Promise((resolve, reject) => {
    const request = db.transaction(MEMORY_TRACES, "readonly").objectStore(MEMORY_TRACES).get(traceId);
    request.onsuccess = () => { db.close(); resolve((request.result as MemoryTrace | undefined) ?? null); };
    request.onerror = () => { db.close(); reject(request.error); };
  });
}

export async function listMemoryTraces(accountId: string): Promise<MemoryTrace[]> { return getAllFromStore<MemoryTrace>(accountId, MEMORY_TRACES); }
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
  await putOne(db, SYNC_META, { key: "cursor", value: cursor } satisfies SyncMetaRecord);
  db.close();
}

export async function savePrivateDocument(accountId:string,document:PrivateDocumentRecord):Promise<void>{
  if(document.accountId!==accountId)throw new Error("PRIVATE_DOCUMENT_ACCOUNT_MISMATCH");
  const db=await openLocalDb(accountId);await putOne(db,PRIVATE_DOCUMENTS,document);db.close();
}
export async function listPrivateDocuments(accountId:string):Promise<PrivateDocumentRecord[]>{
  return getAllFromStore<PrivateDocumentRecord>(accountId,PRIVATE_DOCUMENTS);
}
export async function deletePrivateDocument(accountId:string,id:string):Promise<void>{
  const db=await openLocalDb(accountId);
  await new Promise<void>((resolve,reject)=>{const tx=db.transaction(PRIVATE_DOCUMENTS,"readwrite");tx.objectStore(PRIVATE_DOCUMENTS).delete(id);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});
  db.close();
}
export async function savePrivateVocabulary(accountId:string,record:PrivateVocabularyRecord):Promise<void>{
  if(record.accountId!==accountId)throw new Error("PRIVATE_VOCABULARY_ACCOUNT_MISMATCH");
  const db=await openLocalDb(accountId);await putOne(db,PRIVATE_VOCABULARY,record);db.close();
}
export async function listPrivateVocabulary(accountId:string):Promise<PrivateVocabularyRecord[]>{
  return getAllFromStore<PrivateVocabularyRecord>(accountId,PRIVATE_VOCABULARY);
}
export async function deletePrivateVocabulary(accountId:string,id:string):Promise<void>{
  const db=await openLocalDb(accountId);
  await new Promise<void>((resolve,reject)=>{const tx=db.transaction(PRIVATE_VOCABULARY,"readwrite");tx.objectStore(PRIVATE_VOCABULARY).delete(id);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});
  db.close();
}

export async function savePrivateSentence(accountId:string,record:PrivateSentenceRecord):Promise<void>{
  if(record.accountId!==accountId)throw new Error("PRIVATE_SENTENCE_ACCOUNT_MISMATCH");
  const db=await openLocalDb(accountId);await putOne(db,PRIVATE_SENTENCES,record);db.close();
}
export async function listPrivateSentences(accountId:string):Promise<PrivateSentenceRecord[]>{
  return getAllFromStore<PrivateSentenceRecord>(accountId,PRIVATE_SENTENCES);
}
export async function deletePrivateSentence(accountId:string,id:string):Promise<void>{
  const db=await openLocalDb(accountId);
  await new Promise<void>((resolve,reject)=>{const tx=db.transaction(PRIVATE_SENTENCES,"readwrite");tx.objectStore(PRIVATE_SENTENCES).delete(id);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});
  db.close();
}

export async function savePrivateMediaReview(accountId:string,record:PrivateMediaReviewRecord):Promise<void>{
  if(record.accountId!==accountId)throw new Error("PRIVATE_MEDIA_REVIEW_ACCOUNT_MISMATCH");
  const db=await openLocalDb(accountId);await putOne(db,PRIVATE_MEDIA_REVIEWS,record);db.close();
}
export async function listPrivateMediaReviews(accountId:string):Promise<PrivateMediaReviewRecord[]>{
  return getAllFromStore<PrivateMediaReviewRecord>(accountId,PRIVATE_MEDIA_REVIEWS);
}
export async function deletePrivateMediaReview(accountId:string,id:string):Promise<void>{
  const db=await openLocalDb(accountId);
  await new Promise<void>((resolve,reject)=>{const tx=db.transaction(PRIVATE_MEDIA_REVIEWS,"readwrite");tx.objectStore(PRIVATE_MEDIA_REVIEWS).delete(id);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});
  db.close();
}

export async function savePrivateProsodyCapture(accountId:string,record:PrivateProsodyCaptureRecord):Promise<void>{
  if(record.accountId!==accountId)throw new Error("PRIVATE_PROSODY_CAPTURE_ACCOUNT_MISMATCH");
  if(record.audioBlob.size!==record.sizeBytes)throw new Error("PRIVATE_PROSODY_CAPTURE_SIZE_MISMATCH");
  if(record.sizeBytes<=0||record.sizeBytes>20_000_000)throw new Error("PRIVATE_PROSODY_CAPTURE_SIZE_INVALID");
  const db=await openLocalDb(accountId);await putOne(db,PRIVATE_PROSODY_CAPTURES,record);db.close();
}
export async function listPrivateProsodyCaptures(accountId:string):Promise<PrivateProsodyCaptureRecord[]>{
  return getAllFromStore<PrivateProsodyCaptureRecord>(accountId,PRIVATE_PROSODY_CAPTURES);
}
export async function deletePrivateProsodyCapture(accountId:string,id:string):Promise<void>{
  const db=await openLocalDb(accountId);
  await new Promise<void>((resolve,reject)=>{const tx=db.transaction(PRIVATE_PROSODY_CAPTURES,"readwrite");tx.objectStore(PRIVATE_PROSODY_CAPTURES).delete(id);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});
  db.close();
}


export type GuestWorkspaceClaimResult =
  | "same-account"
  | "guest-empty"
  | "target-populated"
  | "migrated";

const pendingClaims = new Map<string, Promise<GuestWorkspaceClaimResult>>();
export function claimGuestWorkspace(
  guestAccountId: string,
  targetAccountId: string,
): Promise<GuestWorkspaceClaimResult> {
  const previous = pendingClaims.get(guestAccountId) ?? Promise.resolve();
  const attempt = previous.catch(() => {}).then(() => {
    const migrate = () => claimGuestWorkspaceUnlocked(guestAccountId, targetAccountId);
    // Serialize separate PWA/tab contexts as well as simultaneous auth refreshes.
    if (globalThis.navigator?.locks) {
      return navigator.locks.request(`japanese-workspace-claim:${guestAccountId}`, migrate);
    }
    return migrate();
  });
  pendingClaims.set(guestAccountId, attempt);
  void attempt.finally(() => {
    if (pendingClaims.get(guestAccountId) === attempt) pendingClaims.delete(guestAccountId);
  }).catch(() => {});
  return attempt;
}

async function claimGuestWorkspaceUnlocked(
  guestAccountId: string,
  targetAccountId: string,
): Promise<GuestWorkspaceClaimResult> {
  if (!guestAccountId.trim() || !targetAccountId.trim())
    throw new Error("ACCOUNT_ID_REQUIRED");
  if (guestAccountId === targetAccountId) return "same-account";

  const stores = [
    STUDY_EVENTS,
    MEMORY_TRACES,
    OUTBOX,
    PRIVATE_DOCUMENTS,
    PRIVATE_VOCABULARY,
    PRIVATE_SENTENCES,
    PRIVATE_MEDIA_REVIEWS,
    PRIVATE_PROSODY_CAPTURES,
  ] as const;

  const target = await openLocalDb(targetAccountId);
  try {
    for (const store of stores) {
      if ((await getAllFromOpenStore<unknown>(target, store)).length > 0)
        return "target-populated";
    }
    if ((await getAllFromOpenStore<unknown>(target, SYNC_META)).length > 0)
      return "target-populated";
  } finally {
    target.close();
  }

  const guest = await openLocalDb(guestAccountId);
  let snapshot: Record<string, unknown[]>;
  try {
    snapshot = Object.fromEntries(
      await Promise.all(
        stores.map(async (store) => [
          store,
          await getAllFromOpenStore<unknown>(guest, store),
        ]),
      ),
    );
  } finally {
    guest.close();
  }

  if (stores.every((store) => snapshot[store]!.length === 0))
    return "guest-empty";

  const destination = await openLocalDb(targetAccountId);
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = destination.transaction([...stores], "readwrite");
      for (const event of snapshot[STUDY_EVENTS] as StudyEvent[]) {
        transaction
          .objectStore(STUDY_EVENTS)
          .put({ ...event, userId: targetAccountId });
      }
      for (const trace of snapshot[MEMORY_TRACES] as MemoryTrace[]) {
        transaction
          .objectStore(MEMORY_TRACES)
          .put({ ...trace, userId: targetAccountId });
      }
      for (const mutation of snapshot[OUTBOX] as CoreSyncMutation[]) {
        transaction.objectStore(OUTBOX).put(mutation);
      }
      for (const document of snapshot[PRIVATE_DOCUMENTS] as PrivateDocumentRecord[]) {
        transaction
          .objectStore(PRIVATE_DOCUMENTS)
          .put({ ...document, accountId: targetAccountId });
      }
      for (const record of snapshot[PRIVATE_VOCABULARY] as PrivateVocabularyRecord[]) {
        transaction
          .objectStore(PRIVATE_VOCABULARY)
          .put({ ...record, accountId: targetAccountId });
      }
      for (const record of snapshot[PRIVATE_SENTENCES] as PrivateSentenceRecord[]) {
        transaction
          .objectStore(PRIVATE_SENTENCES)
          .put({ ...record, accountId: targetAccountId });
      }
      for (const review of snapshot[PRIVATE_MEDIA_REVIEWS] as PrivateMediaReviewRecord[]) {
        transaction
          .objectStore(PRIVATE_MEDIA_REVIEWS)
          .put({ ...review, accountId: targetAccountId });
      }
      for (const capture of snapshot[PRIVATE_PROSODY_CAPTURES] as PrivateProsodyCaptureRecord[]) {
        transaction
          .objectStore(PRIVATE_PROSODY_CAPTURES)
          .put({ ...capture, accountId: targetAccountId });
      }
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  } finally {
    destination.close();
  }

  // Remove only the rows actually copied. A late study save or import can
  // arrive during attachment; deleting the whole database would lose it.
  const source = await openLocalDb(guestAccountId);
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = source.transaction([...stores, SYNC_META], "readwrite");
      for (const name of stores) {
        const store = transaction.objectStore(name);
        for (const value of snapshot[name] as Record<string, unknown>[]) {
          const key = value[name === OUTBOX ? "mutation_id" : "id"] as IDBValidKey;
          const request = store.get(key);
          request.onsuccess = () => {
            if (JSON.stringify(request.result) === JSON.stringify(value)) store.delete(key);
          };
        }
      }
      transaction.objectStore(SYNC_META).clear();
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  } finally { source.close(); }
  return "migrated";
}

async function getAllFromOpenStore<T>(
  db: IDBDatabase,
  storeName: string,
): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const request = db.transaction(storeName, "readonly").objectStore(storeName).getAll();
    request.onsuccess = () => resolve(request.result as T[]);
    request.onerror = () => reject(request.error);
  });
}

async function putOne(db: IDBDatabase, storeName: string, value: unknown): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    transaction.objectStore(storeName).put(value);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}

async function getAllFromStore<T>(accountId: string, storeName: string): Promise<T[]> {
  const db = await openLocalDb(accountId);
  return new Promise((resolve, reject) => {
    const request = db.transaction(storeName, "readonly").objectStore(storeName).getAll();
    request.onsuccess = () => { db.close(); resolve(request.result as T[]); };
    request.onerror = () => { db.close(); reject(request.error); };
  });
}
