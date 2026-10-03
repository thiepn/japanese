import type { StudyEvent } from "@thiepn/domain";
import type { MemoryTrace } from "@thiepn/scheduler";
import { studyEventToMutation, type CoreSyncMutation, type StudyEventEnvelope } from "@thiepn/sync-protocol";

const DB_VERSION = 6;
const STUDY_EVENTS = "study_events";
const MEMORY_TRACES = "memory_traces";
const OUTBOX = "sync_outbox";
const SYNC_META = "sync_meta";
const PRIVATE_DOCUMENTS = "private_documents";
const PRIVATE_VOCABULARY = "private_vocabulary";
const PRIVATE_SENTENCES = "private_sentences";

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
