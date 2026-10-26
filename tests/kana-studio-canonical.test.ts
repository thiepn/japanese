import 'fake-indexeddb/auto';
import { beforeAll, afterAll, describe, expect, it, vi } from 'vitest';
import { createEmptyCard, Rating, type Grade } from 'ts-fsrs';
import { getMemoryTrace, listOutbox, listStudyEvents } from '../packages/local-db/src/index';
import type { StoredCardData } from '../apps/kana-studio/src/types/kana';

const owner = 'kana-test-' + crypto.randomUUID();
const lease = { owner, epoch: 'e'.repeat(32) };
const handoff = { ...lease, at: Date.now() };
let bridge: typeof import('../apps/kana-studio/src/services/canonicalBridge');

beforeAll(async () => {
  vi.stubGlobal('localStorage', {getItem: (key: string) => key === 'thiepn:japanese:kana-owner:v2' ? JSON.stringify(lease) : null});
  vi.stubGlobal('sessionStorage', {
    getItem: (key: string) => key === 'thiepn:japanese:kana-handoff' ? JSON.stringify(handoff) : null,
    removeItem: () => {}
  });
  vi.resetModules();
  bridge = await import('../apps/kana-studio/src/services/canonicalBridge');
});
afterAll(() => vi.unstubAllGlobals());

describe('AI Studio Kana ↔ canonical Japanese study bridge', () => {
  it('maps only exact canonical cues and never conflates recognition with typed recall', () => {
    expect(bridge.canonicalTraceId('h-a')).toBe('kana:hiragana-あ:reading:kana-to-romaji-recall');
    expect(bridge.canonicalTraceId('h-a:rev')).toBe('kana:hiragana-あ:form_selection:sound-to-kana');
    expect(bridge.canonicalTraceId('h-wo:rev')).toBeNull(); // Japanese uses sound 'o', Google uses 'wo'
    expect(bridge.canonicalTraceId('not-a-card')).toBeNull();
  });
  it('grades one shared FSRS trace, saved study event and outbox, then projects it back', async () => {
    const card: StoredCardData = {
      cardId: 'h-a', card: createEmptyCard(), direction: 'kana-to-romaji',
      totalReviews: 0, totalLapses: 0
    };
    const reviewed = await bridge.gradeJapaneseKanaCard(card, Rating.Good as Grade, new Date());
    expect(reviewed).not.toBeNull();
    const traceId = bridge.canonicalTraceId('h-a')!;
    const trace = await getMemoryTrace(owner, traceId);
    expect(trace?.revision).toBe(1);
    expect(trace?.card.due).toBe(reviewed?.card.due.toISOString());
    const events = await listStudyEvents(owner);
    const event = events.find(x => x.metadata?.googleKanaStudio === true);
    expect(event).toMatchObject({
      baseRevision: 0, skillDimension: 'reading', responseMode: 'flashcard',
      metadata: { selfGraded: true, reviewGrade: 'good', flashcard: true }
    });
    expect((await listOutbox(owner)).length).toBe(1);
    const overlay = await bridge.overlayJapaneseKanaCards(new Map());
    expect(overlay.get('h-a')?.card.due.toISOString()).toBe(trace?.card.due);
    expect(await getMemoryTrace('some-other-owner', traceId)).toBeNull();
  });
  it('imports a validated historical FSRS snapshot only once with ungraded provenance', async () => {
    const original = createEmptyCard(new Date('2026-10-20T12:00:00.000Z'));
    original.reps = 2;
    original.state = 2;
    original.stability = 4;
    original.difficulty = 4;
    original.due = new Date('2026-11-05T12:00:00.000Z');
    const card: StoredCardData = {
      cardId:'h-i',card:original,direction:'kana-to-romaji',
      totalReviews:2,totalLapses:0,lastReviewedAt:'2026-10-20T12:00:00.000Z'
    };
    const before = await bridge.previewLegacyKanaImport([card]);
    expect(before.eligible).toBe(1);
    expect(await bridge.importLegacyKanaSnapshots([card],'legacy-guest'))
      .toMatchObject({imported:1,skipped:0});
    const traceId = bridge.canonicalTraceId('h-i')!;
    const trace = await getMemoryTrace(owner,traceId);
    expect(trace).toMatchObject({revision:0,card:{reps:2}});
    const importEvent = (await listStudyEvents(owner)).find(event=>event.metadata?.kanaStudioImport===true);
    expect(importEvent).toMatchObject({result:'skipped',metadata:{schedulerExcluded:true,sourceReviewCount:2}});
    expect(await bridge.importLegacyKanaSnapshots([card],'legacy-guest'))
      .toMatchObject({imported:0,skipped:1});
    expect((await listStudyEvents(owner)).filter(e=>e.metadata?.kanaStudioImport===true)).toHaveLength(1);
    const next = await bridge.gradeJapaneseKanaCard(card,Rating.Good as Grade,new Date());
    expect(next).not.toBeNull();
    expect((await getMemoryTrace(owner,traceId))?.revision).toBe(1);
  });
  it('reads previous guest cards and backs up original logs without deleting them', async () => {
    const old = createEmptyCard(new Date('2026-10-18T11:00:00.000Z'));
    old.reps = 1;
    old.state = 2;
    const req = indexedDB.open('kana_mastery_v1:local-guest', 1);
    await new Promise<void>((resolve,reject) => {
      req.onupgradeneeded = () => {
        const db=req.result;
        db.createObjectStore('cards',{keyPath:'cardId'});
        db.createObjectStore('review_logs',{autoIncrement:true});
        db.createObjectStore('settings',{keyPath:'key'});
      };
      req.onsuccess=()=>resolve();
      req.onerror=()=>reject(req.error);
    });
    const db=req.result;
    await new Promise<void>((resolve,reject) => {
      const tx=db.transaction(['cards','review_logs','settings'],'readwrite');
      tx.objectStore('cards').put({cardId:'h-u',card:old,direction:'kana-to-romaji',
        totalReviews:1,totalLapses:0});
      tx.objectStore('review_logs').add({cardId:'h-u',reviewTime:'2026-10-18T11:00:00.000Z',
        log:{rating:3}});
      tx.objectStore('settings').put({key:'app_settings',value:{theme:'dark'}});
      tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);
    });
    db.close();
    const storage = await import('../apps/kana-studio/src/services/storage');
    const guest=await storage.readLegacyGuestCards();
    expect(guest.find(card=>card.cardId==='h-u')?.totalReviews).toBe(1);
    const backup=JSON.parse(await storage.serializeLegacyKanaBackup(guest,'legacy-guest'));
    expect(backup.cards).toHaveLength(1);
    expect(backup.logs).toHaveLength(1);
    expect(backup.settings.theme).toBe('dark');
    const imported=await bridge.importLegacyKanaSnapshots(guest,'legacy-guest');
    expect(imported.imported).toBe(1);
    expect((await storage.readLegacyGuestCards()).length).toBe(1);
  });
  it('keeps account-scoped suspensions and fails closed on a changed handoff', async () => {
    await bridge.toggleJapaneseKanaSuspension('h-a', true);
    expect((await bridge.overlayJapaneseKanaCards(new Map())).get('h-a')?.isSuspended).toBe(true);
    await bridge.toggleJapaneseKanaSuspension('h-a', false);
    expect((await bridge.overlayJapaneseKanaCards(new Map())).get('h-a')?.isSuspended).toBe(false);
    lease.epoch = 'f'.repeat(32);
    const card: StoredCardData = {
      cardId: 'h-a', card: createEmptyCard(), direction: 'kana-to-romaji',
      totalReviews: 0, totalLapses: 0
    };
    await expect(bridge.gradeJapaneseKanaCard(card, Rating.Again as Grade, new Date()))
      .rejects.toThrow('KANA_WORKSPACE_CHANGED_REOPEN_JAPANESE');
    lease.epoch = 'e'.repeat(32);
  });
});
