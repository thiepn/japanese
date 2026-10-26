import test from 'node:test';
import assert from 'node:assert/strict';
import { createNewCardData, fScheduler, getSchedulingPreviews } from './srs';
import { Rating, State } from 'ts-fsrs';
import { checkAnswer } from '../utils/romaji';

test('new card data initial state is New (state 0)', () => {
  const cardData = createNewCardData('h-a', 'kana-to-romaji', true);
  assert.equal(cardData.cardId, 'h-a');
  assert.equal(cardData.totalReviews, 0);
  assert.equal(cardData.totalLapses, 0);
  assert.equal(cardData.card.state, State.New);
  assert.equal(cardData.card.reps, 0);
  assert.ok(cardData.introducedAt, 'introducedAt must be populated when isIntroduced is true');

  const unintroduced = createNewCardData('h-a', 'kana-to-romaji', false);
  assert.equal(unintroduced.introducedAt, undefined);
});

test('FSRS scheduler transitions states and updates stability', () => {
  const cardData = createNewCardData('h-a');
  const now = new Date('2026-10-26T12:00:00Z');

  // Reviewing with Rating.Good
  const resGood = fScheduler.next(cardData.card, now, Rating.Good);
  assert.ok(resGood.card.due.getTime() > now.getTime(), 'Due date should advance into future');
  assert.equal(resGood.card.reps, 1);
  assert.ok(resGood.card.stability > 0);

  // Reviewing with Rating.Again
  const resAgain = fScheduler.next(cardData.card, now, Rating.Again);
  assert.ok(resAgain.card.due.getTime() >= now.getTime());
  assert.equal(resAgain.card.state, State.Learning);

  // Reviewing with Rating.Easy
  const resEasy = fScheduler.next(cardData.card, now, Rating.Easy);
  assert.ok(resEasy.card.stability > resGood.card.stability, 'Easy must yield higher stability than Good');
});

test('scheduling previews provide formatted intervals for 1-4 buttons', () => {
  const cardData = createNewCardData('h-ka');
  const previews = getSchedulingPreviews(cardData.card);
  assert.ok(previews[Rating.Again].intervalDesc);
  assert.ok(previews[Rating.Hard].intervalDesc);
  assert.ok(previews[Rating.Good].intervalDesc);
  assert.ok(previews[Rating.Easy].intervalDesc);
});

test('romaji answer checking handles canonical and valid aliases', () => {
  // Direct match
  const a = checkAnswer('h-a', 'a');
  assert.equal(a.isCorrect, true);

  // Case insensitive & whitespace
  const ka = checkAnswer('h-ka', '  KA  ');
  assert.equal(ka.isCorrect, true);

  // shi and si alias
  assert.equal(checkAnswer('h-shi', 'shi').isCorrect, true);
  assert.equal(checkAnswer('h-shi', 'si').isCorrect, true);
  assert.equal(checkAnswer('h-shi', 'xi').isCorrect, false);

  // chi and ti alias
  assert.equal(checkAnswer('h-chi', 'chi').isCorrect, true);
  assert.equal(checkAnswer('h-chi', 'ti').isCorrect, true);

  // tsu and tu alias
  assert.equal(checkAnswer('h-tsu', 'tsu').isCorrect, true);
  assert.equal(checkAnswer('h-tsu', 'tu').isCorrect, true);

  // fu and hu alias
  assert.equal(checkAnswer('h-fu', 'fu').isCorrect, true);
  assert.equal(checkAnswer('h-fu', 'hu').isCorrect, true);

  // Contracted sounds
  assert.equal(checkAnswer('h-kya', 'kya').isCorrect, true);
  assert.equal(checkAnswer('h-pyu', 'pyu').isCorrect, true);
  assert.equal(checkAnswer('h-sha', 'sha').isCorrect, true);
  assert.equal(checkAnswer('h-sha', 'sya').isCorrect, true);

  // Blank is never correct
  assert.equal(checkAnswer('h-a', '').isCorrect, false);
  assert.equal(checkAnswer('h-a', '   ').isCorrect, false);
});

test('cram mode grading preserves card due date while recording review count', async () => {
  const cardData = createNewCardData('h-sa');
  // Set fixed due date in future
  const futureDue = new Date(Date.now() + 86400000 * 5);
  cardData.card.due = futureDue;

  const { updatedData } = await (await import('./srs')).gradeCard(cardData, Rating.Good, new Date(), true);
  assert.equal(updatedData.totalReviews, 1);
  assert.equal(updatedData.card.due.getTime(), futureDue.getTime(), 'Due date should not change in cram mode');
});

test('resetCardProgress clears card history back to pristine state', async () => {
  const { resetCardProgress } = await import('./srs');
  const res = await resetCardProgress('h-ta');
  assert.equal(res.cardId, 'h-ta');
  assert.equal(res.totalReviews, 0);
  assert.equal(res.totalLapses, 0);
  assert.equal(res.isSuspended, false);
});

test('toggleCardSuspension toggles isSuspended state', async () => {
  const { toggleCardSuspension, createNewCardData } = await import('./srs');
  const { saveStoredCard } = await import('./storage');

  const card = createNewCardData('h-na');
  await saveStoredCard(card);

  const suspended = await toggleCardSuspension('h-na');
  assert.equal(suspended?.isSuspended, true);

  const unsuspended = await toggleCardSuspension('h-na');
  assert.equal(unsuspended?.isSuspended, false);
});

