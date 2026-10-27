import { createEmptyCard, fsrs, Rating, State, type Card, type ReviewLog, type Grade } from 'ts-fsrs';
import type { KanaItem, StoredCardData, UserSettings, DeckStatistics, SrsForecast, ReviewFilterOptions } from '../types/kana';
import { allKanaItems, kanaMap, confusablePairs } from '../data/kanaData';
import { getAllStoredCards, saveStoredCard, saveReviewLog } from './storage';
import { gradeJapaneseKanaCard, toggleJapaneseKanaSuspension, hasCanonicalKanaHistory } from './canonicalBridge';

// Initialize FSRS scheduler with 90% target retention
export const fScheduler = fsrs({
  request_retention: 0.90
});

export interface ScheduledQueueItem {
  kana: KanaItem;
  storedData: StoredCardData;
  isNew: boolean;
  direction: 'kana-to-romaji' | 'romaji-to-kana';
  isCram?: boolean;
}

/**
 * Creates a brand new StoredCardData for a Kana item if not already created.
 */
export function createNewCardData(
  kanaId: string,
  direction: 'kana-to-romaji' | 'romaji-to-kana' = 'kana-to-romaji',
  isIntroduced: boolean = true
): StoredCardData {
  const card = createEmptyCard();
  const storageId = direction === 'romaji-to-kana' ? `${kanaId}:rev` : kanaId;
  return {
    cardId: storageId,
    card,
    direction,
    totalReviews: 0,
    totalLapses: 0,
    introducedAt: isIntroduced ? new Date().toISOString() : undefined,
    isSuspended: false
  };
}

/**
 * Evaluates a card review using FSRS algorithm and saves the updated state.
 * If isCram is true, updates stats without modifying the scheduled due date.
 */
export async function gradeCard(
  storedData: StoredCardData,
  rating: Grade,
  reviewDate: Date = new Date(),
  isCram: boolean = false
): Promise<{ updatedData: StoredCardData; log?: ReviewLog }> {
  if (isCram) {
    // Cram is temporary practice. Never mutate either Japanese's authoritative
    // schedule or the Google copy used to project a canonical trace.
    // Session statistics are tracked by ReviewView, not by altering FSRS history.
    return { updatedData: storedData };
  }

  // For exact-matched cues Japanese's trace and event outbox are the sole scheduler authority.
  const canonical = await gradeJapaneseKanaCard(storedData, rating, reviewDate);
  if (canonical) {
    await saveStoredCard(canonical); // Non-authoritative Google UI/cache copy.
    return { updatedData: canonical };
  }

  const result = fScheduler.next(storedData.card, reviewDate, rating);

  const updatedData: StoredCardData = {
    ...storedData,
    card: result.card,
    lastReviewedAt: reviewDate.toISOString(),
    firstReviewedAt: storedData.firstReviewedAt ??
      (storedData.totalReviews===0 ? reviewDate.toISOString():undefined),
    totalReviews: storedData.totalReviews + 1,
    totalLapses: rating === Rating.Again ? storedData.totalLapses + 1 : storedData.totalLapses
  };

  await saveStoredCard(updatedData);
  await saveReviewLog(result.log, storedData.cardId);

  return { updatedData, log: result.log };
}

/**
 * Resets a card back to new state.
 */
export async function resetCardProgress(cardId: string): Promise<StoredCardData> {
  if (await hasCanonicalKanaHistory(cardId)) {
    throw new Error('This card shares Japanese review history. Resetting it here would discard canonical progress.');
  }
  const empty = createEmptyCard();
  const resetData: StoredCardData = {
    cardId,
    card: empty,
    direction: cardId.endsWith(':rev') ? 'romaji-to-kana' : 'kana-to-romaji',
    totalReviews: 0,
    totalLapses: 0,
    introducedAt: new Date().toISOString(),
    isSuspended: false
  };
  await saveStoredCard(resetData);
  return resetData;
}

/**
 * Toggles suspension status for a card.
 */
export async function toggleCardSuspension(cardId: string): Promise<StoredCardData | null> {
  const storedCards = await getAllStoredCards();
  const existing = storedCards.get(cardId);
  if (!existing) return null;

  const updated: StoredCardData = {
    ...existing,
    isSuspended: !existing.isSuspended
  };
  await toggleJapaneseKanaSuspension(cardId, updated.isSuspended ?? false);
  await saveStoredCard(updated);
  return updated;
}

/**
 * Previews the next intervals/due dates for a card under each rating choice.
 */
export function getSchedulingPreviews(card: Card, now: Date = new Date()): Record<Rating, { intervalDesc: string; dueDate: Date }> {
  const ratings: Grade[] = [Rating.Again as Grade, Rating.Hard as Grade, Rating.Good as Grade, Rating.Easy as Grade];
  const previews: Partial<Record<Rating, { intervalDesc: string; dueDate: Date }>> = {};

  for (const r of ratings) {
    const next = fScheduler.next(card, now, r);

    const diffMs = next.card.due.getTime() - now.getTime();
    const diffMin = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);

    let intervalDesc = '< 1m';
    if (diffDays >= 2) {
      intervalDesc = `${diffDays}d`;
    } else if (diffHours >= 1) {
      intervalDesc = `${diffHours}h`;
    } else if (diffMin >= 1) {
      intervalDesc = `${diffMin}m`;
    }

    previews[r] = {
      intervalDesc,
      dueDate: next.card.due
    };
  }

  return previews as Record<Rating, { intervalDesc: string; dueDate: Date }>;
}

/**
 * Calculates a multi-day forecast of upcoming card reviews and retention metrics.
 */
export async function calculateSrsForecast(settings: UserSettings): Promise<SrsForecast> {
  const storedCards = await getAllStoredCards();
  const now = new Date();

  // End of today (23:59:59.999)
  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);

  // End of tomorrow
  const endOfTomorrow = new Date(endOfToday);
  endOfTomorrow.setDate(endOfTomorrow.getDate() + 1);

  // End of 3 days
  const endOf3Days = new Date(endOfToday);
  endOf3Days.setDate(endOf3Days.getDate() + 3);

  // End of 7 days
  const endOfWeek = new Date(endOfToday);
  endOfWeek.setDate(endOfWeek.getDate() + 7);

  let dueNow = 0;
  let dueToday = 0;
  let dueTomorrow = 0;
  let due3Days = 0;
  let dueWeek = 0;
  let matureCount = 0;
  let totalIntroduced = 0;

  for (const [id, data] of storedCards.entries()) {
    if (id.endsWith(':rev')) continue; // Avoid double counting
    if (data.isSuspended) continue;

    const item = kanaMap.get(id);
    if (!item) continue;
    if (settings.preferredScript !== 'both' && item.script !== settings.preferredScript) continue;

    const isIntroduced = !!data.introducedAt || data.totalReviews > 0 || data.card.state !== State.New;
    if (!isIntroduced) continue;

    totalIntroduced++;

    // Mature cards have memory stability >= 21 days
    if (data.card.stability >= 21) {
      matureCount++;
    }

    if (data.totalReviews === 0) {
      dueNow++;
      dueToday++;
      dueTomorrow++;
      due3Days++;
      dueWeek++;
    } else {
      const due = new Date(data.card.due);
      if (due <= now) {
        dueNow++;
      }
      if (due <= endOfToday) {
        dueToday++;
      }
      if (due <= endOfTomorrow) {
        dueTomorrow++;
      }
      if (due <= endOf3Days) {
        due3Days++;
      }
      if (due <= endOfWeek) {
        dueWeek++;
      }
    }
  }

  return {
    dueNow,
    dueToday,
    dueTomorrow,
    due3Days,
    dueWeek,
    matureCount,
    totalIntroduced,
    retentionRate: 90
  };
}

/**
 * Computes deck statistics and progress counters from stored cards.
 */
export async function calculateDeckStatistics(settings: UserSettings): Promise<DeckStatistics> {
  const storedCards = await getAllStoredCards();
  const now = new Date();

  const eligibleItems = allKanaItems.filter((item) => {
    if (item.category === 'mechanic') return false;
    if (settings.preferredScript === 'hiragana') return item.script === 'hiragana';
    if (settings.preferredScript === 'katakana') return item.script === 'katakana';
    return true;
  });

  const hItems = allKanaItems.filter(i => i.script === 'hiragana' && i.category !== 'mechanic');
  const kItems = allKanaItems.filter(i => i.script === 'katakana' && i.category !== 'mechanic');

  let dueNowCount = 0;
  let inLearningCount = 0;
  let inReviewCount = 0;
  let totalIntroduced = 0;
  let hiraganaIntroduced = 0;
  let katakanaIntroduced = 0;
  let nextDueTime: Date | null = null;

  for (const [id, data] of storedCards.entries()) {
    if (id.endsWith(':rev')) continue;
    if (data.isSuspended) continue;

    const item = kanaMap.get(id);
    if (!item) continue;

    const isIntroduced = !!data.introducedAt || data.totalReviews > 0 || data.card.state !== State.New;
    if (isIntroduced) {
      totalIntroduced++;
      if (item.script === 'hiragana') hiraganaIntroduced++;
      if (item.script === 'katakana') katakanaIntroduced++;

      if (data.card.state === State.Learning || data.card.state === State.Relearning) {
        inLearningCount++;
      } else if (data.card.state === State.Review) {
        inReviewCount++;
      }

      const matchesScript = settings.preferredScript === 'both' || item.script === settings.preferredScript;
      if (matchesScript) {
        if (data.totalReviews === 0) {
          dueNowCount++;
        } else {
          const dueDate = new Date(data.card.due);
          if (dueDate <= now) {
            dueNowCount++;
          } else {
            if (!nextDueTime || dueDate < nextDueTime) {
              nextDueTime = dueDate;
            }
          }
        }
      }
    }
  }

  let newAvailableCount = 0;
  for (const item of eligibleItems) {
    const data = storedCards.get(item.id);
    const isIntroduced = data && (!!data.introducedAt || data.totalReviews > 0 || data.card.state !== State.New);
    if (!isIntroduced) {
      newAvailableCount++;
    }
  }

  return {
    dueNowCount,
    newAvailableCount,
    inLearningCount,
    inReviewCount,
    totalIntroduced,
    hiraganaIntroduced,
    hiraganaTotal: hItems.length,
    katakanaIntroduced,
    katakanaTotal: kItems.length,
    nextDueTime
  };
}

/**
 * Builds the active review session queue with support for custom category filters and cram mode.
 */
export async function buildReviewQueue(
  settings: UserSettings,
  includeNewCards: boolean = false,
  direction: 'kana-to-romaji' | 'romaji-to-kana' = 'kana-to-romaji',
  drillKanaIds?: string[],
  filterOptions?: ReviewFilterOptions
): Promise<ScheduledQueueItem[]> {
  const storedCards = await getAllStoredCards();
  const now = new Date();

  // If specific custom IDs were requested
  const explicitIds = drillKanaIds || filterOptions?.customKanaIds;
  if (explicitIds && explicitIds.length > 0) {
    const drillItems: ScheduledQueueItem[] = [];
    for (const id of explicitIds) {
      const item = kanaMap.get(id);
      if (!item || item.category === 'mechanic') continue;
      const storageKey = direction === 'romaji-to-kana' ? `${id}:rev` : id;
      const data = storedCards.get(storageKey) || createNewCardData(id, direction, true);
      if(data.isSuspended || storedCards.get(id)?.isSuspended)continue;
      drillItems.push({
        kana: item,
        storedData: data,
        isNew: data.totalReviews === 0,
        direction,
        isCram: filterOptions?.cramMode ?? false
      });
    }
    return drillItems;
  }

  // Determine eligible script
  const scriptFilter = filterOptions?.script || settings.preferredScript;

  // Filter all items by script, category, row
  let candidates = allKanaItems.filter((item) => {
    if (item.category === 'mechanic') return false;
    if (scriptFilter === 'hiragana' && item.script !== 'hiragana') return false;
    if (scriptFilter === 'katakana' && item.script !== 'katakana') return false;

    // Category filter
    if (filterOptions?.category && filterOptions.category !== 'all') {
      if (filterOptions.category === 'confusables') {
        const isConfusable = confusablePairs.some(p => p.char1 === item.kana || p.char2 === item.kana);
        if (!isConfusable) return false;
      } else if (item.category !== filterOptions.category) {
        return false;
      }
    }

    // Row filter (e.g. 'K', 'S', 'vowel')
    if (filterOptions?.row && filterOptions.row !== 'all') {
      if (item.row !== filterOptions.row) return false;
    }

    return true;
  });

  const dueLearning: ScheduledQueueItem[] = [];
  const dueReview: ScheduledQueueItem[] = [];
  const dueNewIntroduced: ScheduledQueueItem[] = [];
  const unintroducedCandidates: ScheduledQueueItem[] = [];
  const cramCandidates: ScheduledQueueItem[] = [];

  for (const item of candidates) {
    const storageKey = direction === 'romaji-to-kana' ? `${item.id}:rev` : item.id;
    const baseData = storedCards.get(item.id);
    const data = storedCards.get(storageKey);

    // Skip suspended
    if (data?.isSuspended || baseData?.isSuspended) continue;

    const isIntroduced = (baseData && (!!baseData.introducedAt || baseData.totalReviews > 0 || baseData.card.state !== State.New)) ||
                         (data && (!!data.introducedAt || data.totalReviews > 0 || data.card.state !== State.New));

    if (isIntroduced) {
      const activeData = data || createNewCardData(item.id, direction, true);
      
      if (filterOptions?.cramMode) {
        cramCandidates.push({
          kana: item,
          storedData: activeData,
          isNew: activeData.totalReviews === 0,
          direction,
          isCram: true
        });
      } else if (activeData.totalReviews === 0) {
        dueNewIntroduced.push({ kana: item, storedData: activeData, isNew: true, direction });
      } else {
        const dueDate = new Date(activeData.card.due);
        if (dueDate <= now) {
          if (activeData.card.state === State.Learning || activeData.card.state === State.Relearning) {
            dueLearning.push({ kana: item, storedData: activeData, isNew: false, direction });
          } else {
            dueReview.push({ kana: item, storedData: activeData, isNew: false, direction });
          }
        }
      }
    } else {
      unintroducedCandidates.push({
        kana: item,
        storedData: createNewCardData(item.id, direction, false),
        isNew: true,
        direction
      });
    }
  }

  // If in Cram Mode, return all matching introduced candidates
  if (filterOptions?.cramMode) {
    return cramCandidates;
  }

  // Sort due reviews by most overdue
  dueReview.sort((a, b) => new Date(a.storedData.card.due).getTime() - new Date(b.storedData.card.due).getTime());

  // Due learning and reviews always take priority. Newly introduced cards and
  // unseen Kana share a bounded new-card allowance rather than letting a due
  // backlog block all further progression indefinitely.
  const dayStart=new Date(now);dayStart.setHours(0,0,0,0);
  const studiedToday=[...storedCards.values()].filter(card=>{
    if(!card.firstReviewedAt)return false;
    const date=new Date(card.firstReviewedAt);
    return Number.isFinite(date.getTime())&&date>=dayStart&&date<=now;
  }).length;
  const limit = includeNewCards ?
    Math.max(0, Math.floor(settings.dailyNewLimit)-studiedToday) : 0;
  const introducedNew = dueNewIntroduced.slice(0, limit);
  const remaining = Math.max(0, limit - introducedNew.length);
  const unseenNew = unintroducedCandidates.slice(0, remaining);
  return [...dueLearning, ...dueReview, ...introducedNew, ...unseenNew];
}


