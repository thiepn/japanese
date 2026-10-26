import 'fake-indexeddb/auto';
import { beforeAll, afterAll, describe, expect, it, vi } from 'vitest';
import { createEmptyCard, Rating, type Grade } from 'ts-fsrs';
import { getMemoryTrace, listOutbox, listStudyEvents } from '../packages/local-db/src/index';
import type { StoredCardData } from '../apps/kana-studio/src/types/kana';

const owner = 'kana-test-' + crypto.randomUUID();
const handoff = { owner, at: Date.now() };
let bridge: typeof import('../apps/kana-studio/src/services/canonicalBridge');

beforeAll(async () => {
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
  it('keeps account-scoped suspensions and fails closed on a changed handoff', async () => {
    await bridge.toggleJapaneseKanaSuspension('h-a', true);
    expect((await bridge.overlayJapaneseKanaCards(new Map())).get('h-a')?.isSuspended).toBe(true);
    await bridge.toggleJapaneseKanaSuspension('h-a', false);
    expect((await bridge.overlayJapaneseKanaCards(new Map())).get('h-a')?.isSuspended).toBe(false);
    handoff.owner = 'different-owner';
    const card: StoredCardData = {
      cardId: 'h-a', card: createEmptyCard(), direction: 'kana-to-romaji',
      totalReviews: 0, totalLapses: 0
    };
    await expect(bridge.gradeJapaneseKanaCard(card, Rating.Again as Grade, new Date()))
      .rejects.toThrow('KANA_WORKSPACE_CHANGED_REOPEN_JAPANESE');
    handoff.owner = owner;
  });
});
