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
  it('validates entire backups before writing and restores only missing Google cards and logs',async()=>{
    vi.stubGlobal('window',{indexedDB});
    const storage=await import('../apps/kana-studio/src/services/storage');
    const safe=await import('../apps/kana-studio/src/services/backupRestore');
    const earlier=createEmptyCard(new Date('2026-10-20T08:00:00.000Z'));
    earlier.due=new Date('2030-02-01T08:00:00.000Z');
    earlier.reps=5;earlier.state=2;
    await storage.saveStoredCard({cardId:'h-o',card:earlier,direction:'kana-to-romaji',
      totalReviews:5,totalLapses:0});
    const incoming=createEmptyCard(new Date('2026-10-20T08:00:00.000Z'));
    incoming.due=new Date('2027-01-01T08:00:00.000Z');
    incoming.reps=1;incoming.state=2;
    const cards=['h-o','h-e'].map(cardId=>({cardId,card:incoming,direction:'kana-to-romaji',
      totalReviews:1,totalLapses:0}));
    const original={version:1,appName:'KANA',cards,
      logs:[{cardId:'h-e',reviewTime:'2026-10-20T08:00:00.000Z',log:{rating:3}}],settings:null};
    const json=JSON.stringify(original);
    expect((await storage.previewProgressImportJSON(json))).toMatchObject({
      newCards:1,existingCards:1,logs:1
    });
    const malformed=JSON.stringify({...original,cards:[
      ...cards,{...cards[0],cardId:'h-a',card:{...incoming,due:'invalid'}}]});
    await expect(storage.previewProgressImportJSON(malformed)).rejects.toThrow('BACKUP_INVALID_CARD');
    expect(safe.parseKanaBackup(json).cards).toHaveLength(2);
    const first=await storage.importProgressJSON(json);
    expect(first).toMatchObject({success:true,count:1});
    expect((await storage.readStudioCards()).get('h-o')?.card.due.toISOString())
      .toBe('2030-02-01T08:00:00.000Z');
    expect((await storage.readStudioCards()).get('h-e')?.totalReviews).toBe(1);
    expect((await storage.getReviewLogs()).filter(x=>x.cardId==='h-e')).toHaveLength(1);
    const again=await storage.importProgressJSON(json);
    expect(again).toMatchObject({success:true,count:0});
    expect((await storage.getReviewLogs()).filter(x=>x.cardId==='h-e')).toHaveLength(1);
    const archived=JSON.parse(await storage.exportProgressJSON());
    expect(archived.cards.find((x:{cardId:string})=>x.cardId==='h-o').card.due)
      .toBe('2030-02-01T08:00:00.000Z');
  });
  it('portable backup retains canonical schedules without duplicating review evidence on same-owner restore', async () => {
    const storage=await import('../apps/kana-studio/src/services/storage');
    const original=await storage.exportProgressJSON();
    const data=JSON.parse(original);
    expect(data.owner).toBe(owner);
    expect(data.canonicalProjection.some((card:{cardId:string})=>card.cardId==='h-a')).toBe(true);
    const candidate=createEmptyCard(new Date('2026-10-19T12:00:00.000Z'));
    candidate.reps=3;candidate.state=2;candidate.stability=4;
    candidate.difficulty=4;candidate.due=new Date('2026-11-10T12:00:00.000Z');
    data.canonicalProjection.push({cardId:'h-ke',card:candidate,direction:'kana-to-romaji',
      totalReviews:3,totalLapses:0,lastReviewedAt:'2026-10-19T12:00:00.000Z'});
    const json=JSON.stringify(data);
    const preview=await storage.previewProgressImportJSON(json);
    expect(preview.canonicalOwnerMatched).toBe(true);
    expect(preview.canonicalEligible).toBe(1);
    const before=(await listStudyEvents(owner)).length;
    expect(await storage.restorePortableJapaneseSchedules(json)).toMatchObject({imported:1,skipped:2});
    expect((await getMemoryTrace(owner,bridge.canonicalTraceId('h-ke')!))?.card.reps).toBe(3);
    expect(await storage.restorePortableJapaneseSchedules(json)).toMatchObject({imported:0});
    expect((await listStudyEvents(owner)).length).toBe(before+1);
    const foreign=JSON.stringify({...data,owner:'different-account'});
    await expect(storage.previewProgressImportJSON(foreign)).rejects.toThrow('BACKUP_ACCOUNT_MISMATCH');
    await expect(storage.restorePortableJapaneseSchedules(foreign)).rejects.toThrow('BACKUP_ACCOUNT_MISMATCH');
    expect((await storage.importProgressJSON(foreign)).success).toBe(false);
  });
  it('cram review does not change canonical or Google FSRS schedules',async()=>{
    const srs=await import('../apps/kana-studio/src/services/srs');
    const card=srs.createNewCardData('h-a');
    const original=await getMemoryTrace(owner,bridge.canonicalTraceId('h-a')!);
    const reviewed=await srs.gradeCard(card,Rating.Again as Grade,new Date(),true);
    expect(reviewed.updatedData.totalReviews).toBe(card.totalReviews);
    expect(reviewed.updatedData.card.due).toEqual(card.card.due);
    expect(await getMemoryTrace(owner,bridge.canonicalTraceId('h-a')!)).toEqual(original);
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
