import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const source=path=>readFileSync(new URL('../../../'+path,import.meta.url),'utf8');
const local=source('packages/local-db/src/index.ts');
const bridge=source('apps/kana-studio/src/services/canonicalBridge.ts');
const sync=source('packages/sync-protocol/src/index.ts');
const lease=source('apps/kana-studio/src/services/japaneseBridge.ts');
const take=(s,start,end)=>s.slice(s.indexOf(start),s.indexOf(end,s.indexOf(start)+start.length));

test('production StudyEvent, outbox and MemoryTrace share one IndexedDB transaction and completion gate',()=>{
 const fn=take(local,'export async function saveStudyReview(','export async function importKanaSnapshotIfMissing(');
 assert(fn.includes('db.transaction([STUDY_EVENTS, OUTBOX, MEMORY_TRACES], "readwrite")'));
 assert(fn.includes('objectStore(STUDY_EVENTS).add(event)'),'event uniqueness uses IDB add, not put');
 assert(fn.includes('objectStore(OUTBOX).put(mutation)'));
 assert(fn.includes('traces.put(trace)'));
 assert(fn.includes('transaction.oncomplete = () => resolve()'));
 assert(fn.includes('transaction.onabort = () => reject('));
 assert(fn.includes('current.onsuccess'));
 assert(fn.includes('saved?.revision??0'));
});
test('outbox mutation ID is identical to StudyEvent ID, so only SAME-ID retries are covered by existing event uniqueness',()=>{
 const fn=take(sync,'export function studyEventToMutation(','export function studyEventFromChange(');
 assert(fn.includes('mutation_id: event.id'));
 assert(fn.includes('resource_id: event.id'));
 const grader=take(bridge,'export async function gradeJapaneseKanaCard(','export async function toggleJapaneseKanaSuspension(');
 assert(grader.includes('id: crypto.randomUUID()'),'current grader generates a fresh ID per invocation');
 assert(grader.includes('await saveStudyReview(event, updated)'));
});
test('owner lease epoch is verified in workspace but NOT atomically in production saveStudyReview transaction',()=>{
 const assertFn=take(lease,'export function assertKanaWorkspace(): void {','export function returnToJapanese(): void {');
 assert(assertFn.includes('active.epoch!==embeddedLease.epoch'));
 const writer=take(local,'export async function saveStudyReview(','export async function importKanaSnapshotIfMissing(');
 assert(!writer.includes('leaseAtCommit')&&!writer.includes('assertKanaWorkspace')&&!writer.includes('epoch'));
 const grader=take(bridge,'export async function gradeJapaneseKanaCard(','export async function toggleJapaneseKanaSuspension(');
 assert(grader.includes('assertKanaWorkspace()'));
});
test('atomic grade and conflict checks do NOT imply a durable attemptId uniqueness index',()=>{
 const migration=take(local,'export async function openLocalDb(','export async function saveStudyEvent(');
 assert(migration.includes('db.createObjectStore(STUDY_EVENTS, { keyPath: "id" })'));
 assert(!migration.includes('"attemptId"')&&!migration.includes('unique: true'));
 const writer=take(local,'export async function saveStudyReview(','export async function importKanaSnapshotIfMissing(');
 assert(!writer.includes('attemptId'));
});
