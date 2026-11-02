/** Coordinates read-only Kana progress refreshes without modifying FSRS or account state.
 * A slow predecessor must never publish over a newer snapshot or after unmount. */
export type KanaProgressSnapshot<S, C, T> = { settings: S; cards: C; stats: T };

export async function refreshLatestKanaProgress<S, C, T>(
  generation: { current: number },
  operations: {
    readSettings: () => Promise<S>;
    readCards: () => Promise<C>;
    calculateStats: (settings: S, cards: C) => Promise<T>;
    publish: (snapshot: KanaProgressSnapshot<S, C, T>) => void;
    onError?: (error: unknown) => void;
  },
): Promise<boolean> {
  const ticket = ++generation.current;
  try {
    const settings = await operations.readSettings();
    const cards = await operations.readCards();
    // Derive counters from the same projected cards that will be displayed.
    const stats = await operations.calculateStats(settings, cards);
    if (ticket !== generation.current) return false;
    operations.publish({ settings, cards, stats });
    return true;
  } catch (error) {
    if (ticket === generation.current) operations.onError?.(error);
    return false;
  }
}
