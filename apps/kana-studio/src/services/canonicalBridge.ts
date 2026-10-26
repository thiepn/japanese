import { createEmptyCard, type Card, type Grade, Rating } from 'ts-fsrs';
import { getMemoryTrace, listMemoryTraces, listFlashcardSuspensions, saveStudyReview, setFlashcardSuspension } from '@thiepn/local-db';
import { createFsrsScheduler, type MemoryTrace, type FsrsCardSnapshot, type ReviewGrade } from '@thiepn/scheduler';
import type { StudyEvent } from '@thiepn/domain';
import type { StudyPrompt } from '@thiepn/study-player';
import { foundationApplicationPrompts } from '../../../web/src/study/foundationPrompts';
import { getJapaneseDeviceId } from '../../../web/src/deviceIdentity';
import { kanaMap } from '../data/kanaData';
import type { StoredCardData } from '../types/kana';
import { KANA_WORKSPACE_ID, assertKanaWorkspace } from './japaneseBridge';

// The two apps share a scheduler and database ONLY for genuinely identical cues.
// Kana -> typed romaji is Japanese's "reading" cue, NOT its recognition-choice cue.
// Romaji -> Kana is Japanese's form-selection cue, provided the sound matches exactly.
// Japanese-only exception lessons and Google-only extended kana remain independent.
const canonicalScheduler = createFsrsScheduler();
const prompts = new Map<string, StudyPrompt>();
for (const prompt of foundationApplicationPrompts) {
  if (prompt.primaryTarget.kind !== 'kana') continue;
  if ((prompt.skill !== 'reading' || prompt.cueFamily !== 'kana-to-romaji-recall') &&
      (prompt.skill !== 'form_selection' || prompt.cueFamily !== 'sound-to-kana')) continue;
  prompts.set(prompt.primaryTarget.id + ':' + prompt.skill, prompt);
}
const owner = KANA_WORKSPACE_ID;
export const linkedToJapanese = owner !== 'local-guest';

function matchedPrompt(cardId: string): StudyPrompt | null {
  const reverse = cardId.endsWith(':rev');
  const id = reverse ? cardId.slice(0, -4) : cardId;
  const kana = kanaMap.get(id);
  if (!kana || kana.category === 'mechanic') return null;
  const prompt = prompts.get(kana.script + '-' + kana.kana + ':' + (reverse ? 'form_selection' : 'reading'));
  if (!prompt) return null;
  if (reverse) {
    if (prompt.prompt !== kana.romaji || prompt.displayAnswer !== kana.kana) return null;
  } else if (prompt.prompt !== kana.kana ||
    !prompt.acceptedAnswers.some(answer => answer.toLowerCase() === kana.romaji.toLowerCase())) {
    return null;
  }
  return prompt;
}
export function canonicalTraceId(cardId: string): string | null {
  const prompt = matchedPrompt(cardId);
  return prompt ? [prompt.primaryTarget.kind, prompt.primaryTarget.id, prompt.skill, prompt.cueFamily].join(':') : null;
}
export function isCanonicalKanaCard(cardId: string): boolean {
  return linkedToJapanese && canonicalTraceId(cardId) !== null;
}

function toSnapshot(card: Card): FsrsCardSnapshot {
  return {
    due: new Date(card.due).toISOString(),
    stability: card.stability,
    difficulty: card.difficulty,
    elapsedDays: card.elapsed_days,
    scheduledDays: card.scheduled_days,
    learningSteps: card.learning_steps,
    reps: card.reps,
    lapses: card.lapses,
    state: Number(card.state),
    ...(card.last_review ? { lastReviewAt: new Date(card.last_review).toISOString() } : {})
  };
}
function toCard(snapshot: FsrsCardSnapshot): Card {
  const base = createEmptyCard();
  return {
    ...base,
    due: new Date(snapshot.due),
    stability: snapshot.stability,
    difficulty: snapshot.difficulty,
    elapsed_days: snapshot.elapsedDays,
    scheduled_days: snapshot.scheduledDays,
    learning_steps: snapshot.learningSteps,
    reps: snapshot.reps,
    lapses: snapshot.lapses,
    state: snapshot.state as Card['state'],
    ...(snapshot.lastReviewAt ? {last_review: new Date(snapshot.lastReviewAt)} : {})
  };
}
function toStudio(trace: MemoryTrace, cardId: string, local?: StoredCardData, suspended = false): StoredCardData {
  return {
    cardId, card: toCard(trace.card),
    direction: cardId.endsWith(':rev') ? 'romaji-to-kana' : 'kana-to-romaji',
    totalReviews: Math.max(local?.totalReviews ?? 0, trace.card.reps),
    totalLapses: Math.max(local?.totalLapses ?? 0, trace.card.lapses),
    introducedAt: local?.introducedAt ?? trace.card.lastReviewAt ?? new Date(trace.card.due).toISOString(),
    lastReviewedAt: trace.card.lastReviewAt ?? local?.lastReviewedAt,
    isSuspended: suspended || Boolean(local?.isSuspended)
  };
}

/** A read-only projection: never overwrite a saved Google card when showing native progress. */
export async function overlayJapaneseKanaCards(cards: Map<string, StoredCardData>): Promise<Map<string, StoredCardData>> {
  if (!linkedToJapanese) return cards;
  assertKanaWorkspace();
  const [traces, suspensions] = await Promise.all([
    listMemoryTraces(owner), listFlashcardSuspensions(owner)
  ]);
  assertKanaWorkspace();
  const byTrace = new Map(traces.map(trace => [trace.id, trace]));
  const suspended = new Set(suspensions);
  const merged = new Map(cards);
  for (const item of kanaMap.values()) {
    for (const key of [item.id, item.id + ':rev']) {
      const traceId = canonicalTraceId(key);
      const trace = traceId ? byTrace.get(traceId) : null;
      if (trace) merged.set(key, toStudio(trace, key, cards.get(key), suspended.has(trace.id)));
      else if (traceId && suspended.has(traceId) && merged.has(key)) {
        merged.set(key, { ...merged.get(key)!, isSuspended: true });
      }
    }
  }
  return merged;
}

/** Canonical Japanese FSRS is the single writer for mapped card grades. */
export async function gradeJapaneseKanaCard(
  current: StoredCardData, rating: Grade, reviewedAt: Date
): Promise<StoredCardData | null> {
  if (!linkedToJapanese) return null;
  const prompt = matchedPrompt(current.cardId);
  if (!prompt) return null;
  assertKanaWorkspace();
  const traceId = canonicalTraceId(current.cardId)!;
  const previous = await getMemoryTrace(owner, traceId);
  assertKanaWorkspace();
  const fresh = canonicalScheduler.create({
    id: traceId, userId: owner,
    entity: prompt.primaryTarget, skillDimension: prompt.skill, cueFamily: prompt.cueFamily
  }, reviewedAt.toISOString());
  // Preserve a previously studied Google-only schedule when the canonical cue has no trace.
  // Native history begins with this graded event; old Google logs are not fabricated as native events.
  const base: MemoryTrace = previous ?? (
    current.totalReviews > 0 && current.card.reps > 0
      ? { ...fresh, card: toSnapshot(current.card) }
      : fresh
  );
  const grade: ReviewGrade =
    rating === Rating.Again ? 'again' : rating === Rating.Hard ? 'hard' :
    rating === Rating.Easy ? 'easy' : 'good';
  const event: StudyEvent = {
    id: crypto.randomUUID(), userId: owner, deviceId: getJapaneseDeviceId(),
    occurredAt: reviewedAt.toISOString(), activity: 'review',
    primaryTarget: prompt.primaryTarget, skillDimension: prompt.skill,
    promptFamily: prompt.cueFamily, responseMode: 'flashcard',
    result: grade === 'again' ? 'incorrect' : grade === 'hard' ? 'partial' : 'correct',
    attempts: 1, baseRevision: base.revision,
    ...(prompt.contextId ? { contextId: prompt.contextId } : {}),
    ...(prompt.sourceId ? { sourceId: prompt.sourceId } : {}),
    ...(prompt.contentVersion ? { contentVersion: prompt.contentVersion } : {}),
    metadata: {
      promptId: prompt.id, flashcard: true, selfGraded: true, reviewGrade: grade,
      googleKanaStudio: true,
      ...(previous === null && current.totalReviews > 0 ? { previousStudioReviews: current.totalReviews } : {})
    }
  };
  const updated = canonicalScheduler.review(base, { grade, reviewedAt: reviewedAt.toISOString() });
  await saveStudyReview(event, updated);
  assertKanaWorkspace();
  return toStudio(updated, current.cardId, current);
}
export async function toggleJapaneseKanaSuspension(cardId: string, suspended: boolean): Promise<boolean> {
  if (!linkedToJapanese) return false;
  const traceId = canonicalTraceId(cardId);
  if (!traceId) return false;
  assertKanaWorkspace();
  await setFlashcardSuspension(owner, traceId, suspended);
  assertKanaWorkspace();
  return true;
}
export async function hasCanonicalKanaHistory(cardId: string): Promise<boolean> {
  if (!linkedToJapanese) return false;
  const id = canonicalTraceId(cardId);
  if (!id) return false;
  assertKanaWorkspace();
  return (await getMemoryTrace(owner, id)) !== null;
}
