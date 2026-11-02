import { describe, expect, it, vi } from 'vitest';
import { createEmptyCard } from 'ts-fsrs';
import { refreshLatestKanaProgress } from '../apps/kana-studio/src/services/progressRefresh';
import { calculateDeckStatistics } from '../apps/kana-studio/src/services/srs';
import { defaultSettings } from '../apps/kana-studio/src/services/storage';
import type { StoredCardData } from '../apps/kana-studio/src/types/kana';

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((done, fail) => { resolve = done; reject = fail; });
  return { promise, resolve, reject };
}

describe('Kana progress snapshot synchronization', () => {
  it('publishes only the latest response even when an older IndexedDB read completes last', async () => {
    const earlier = deferred<string>();
    const latest = deferred<string>();
    const settings = [earlier.promise, latest.promise];
    let reads = 0;
    const gate = { current: 0 };
    const published: string[] = [];
    const readCards = vi.fn(async () => new Map([['h-a', 'ready']]));
    const calculateStats = vi.fn(async (_settings: string, cards: Map<string, string>) => cards.size);
    const operations = {
      readSettings: () => settings[reads++]!,
      readCards,
      calculateStats,
      publish: ({ settings: value }: { settings: string; cards: Map<string, string>; stats: number }) => {
        published.push(value);
      },
    };
    const first = refreshLatestKanaProgress(gate, operations);
    const second = refreshLatestKanaProgress(gate, operations);
    latest.resolve('newest');
    expect(await second).toBe(true);
    earlier.resolve('stale');
    expect(await first).toBe(false);
    expect(published).toEqual(['newest']);
    expect(readCards).toHaveBeenCalledTimes(2);
    expect(calculateStats).toHaveBeenCalledTimes(2);
  });

  it('invalidates in-flight progress after unmount without callbacks', async () => {
    const waiting = deferred<string>();
    const gate = { current: 0 };
    const publish = vi.fn();
    const pending = refreshLatestKanaProgress(gate, {
      readSettings: () => waiting.promise,
      readCards: async () => new Map<string, string>(),
      calculateStats: async () => 0,
      publish,
    });
    gate.current++; // equivalent to KanaExperience unmount
    waiting.resolve('guest');
    expect(await pending).toBe(false);
    expect(publish).not.toHaveBeenCalled();
  });

  it('suppresses stale failures but reports a current read failure', async () => {
    const pending = deferred<string>();
    const gate = { current: 0 };
    const onError = vi.fn();
    const operations = {
      readSettings: () => pending.promise,
      readCards: async () => new Map<string, string>(),
      calculateStats: async () => 0,
      publish: vi.fn(),
      onError,
    };
    const old = refreshLatestKanaProgress(gate, operations);
    gate.current++;
    pending.reject(new Error('stale IndexedDB failure'));
    expect(await old).toBe(false);
    expect(onError).not.toHaveBeenCalled();
    const latest = refreshLatestKanaProgress(gate, {
      ...operations,
      readSettings: async (): Promise<string> => { throw Error('active failure'); },
    });
    expect(await latest).toBe(false);
    expect(onError).toHaveBeenCalledOnce();
  });

  it('derives due progress from the supplied canonical-projected card map', async () => {
    const card: StoredCardData = {
      cardId: 'h-a', card: createEmptyCard(), direction: 'kana-to-romaji',
      totalReviews: 0, totalLapses: 0,
      introducedAt: '2026-10-20T12:00:00.000Z',
    };
    const projected = new Map([['h-a', card]]);
    const due = await calculateDeckStatistics(defaultSettings, projected);
    expect(due.dueNowCount).toBe(1);
    expect(due.totalIntroduced).toBe(1);

    const reviewed: StoredCardData = {
      ...card, totalReviews: 1,
      card: { ...card.card, due: new Date('2099-01-01T00:00:00Z') },
    };
    const refreshed = await calculateDeckStatistics(defaultSettings, new Map([['h-a', reviewed]]));
    expect(refreshed.dueNowCount).toBe(0);
    expect(refreshed.totalIntroduced).toBe(1);
  });
});
