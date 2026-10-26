import type { KanaItem } from '../types/kana';
import { allKanaItems, confusablePairs, kanaMap } from '../data/kanaData';

/**
 * Generates 3 plausible kana distractors for Romaji → Kana multiple-choice questions.
 * Distractors are prioritized from:
 * 1. Directly confusable pairs (e.g. シ vs ツ, or きゃ vs きや)
 * 2. Same group/row (e.g. きゅ, きょ, ぎゅ for きゃ)
 * 3. Same script items
 */
export function generateKanaDistractors(target: KanaItem): { options: KanaItem[]; targetIndex: number } {
  const distractors: KanaItem[] = [];
  const usedIds = new Set<string>([target.id]);

  // 1. Check confusable pairs first
  for (const pair of confusablePairs) {
    if (distractors.length >= 3) break;
    let otherChar = '';
    if (pair.char1 === target.kana) otherChar = pair.char2;
    else if (pair.char2 === target.kana) otherChar = pair.char1;

    if (otherChar) {
      const match = allKanaItems.find(k => k.kana === otherChar);
      if (match && !usedIds.has(match.id)) {
        distractors.push(match);
        usedIds.add(match.id);
      }
    }
  }

  // 2. Add from same group (e.g. other items in k-row or ky-row)
  const sameGroup = allKanaItems.filter(
    k => k.group === target.group && k.script === target.script && !usedIds.has(k.id)
  );
  for (const item of sameGroup) {
    if (distractors.length >= 3) break;
    distractors.push(item);
    usedIds.add(item.id);
  }

  // 3. Add from same category & script
  const sameCategory = allKanaItems.filter(
    k => k.category === target.category && k.script === target.script && !usedIds.has(k.id)
  );
  // Deterministic shuffle using target id hash so options remain stable during card view
  let hash = 0;
  for (let i = 0; i < target.id.length; i++) {
    hash = (hash * 31 + target.id.charCodeAt(i)) & 0xffffffff;
  }

  const sortedCat = [...sameCategory].sort((a, b) => {
    const ha = (hash ^ a.id.charCodeAt(0)) % 100;
    const hb = (hash ^ b.id.charCodeAt(0)) % 100;
    return ha - hb;
  });

  for (const item of sortedCat) {
    if (distractors.length >= 3) break;
    distractors.push(item);
    usedIds.add(item.id);
  }

  // 4. Fallback from any matching script if needed
  if (distractors.length < 3) {
    const remaining = allKanaItems.filter(
      k => k.script === target.script && k.category !== 'mechanic' && !usedIds.has(k.id)
    );
    for (const item of remaining) {
      if (distractors.length >= 3) break;
      distractors.push(item);
      usedIds.add(item.id);
    }
  }

  // Combine and place target at position based on hash
  const allFour = [...distractors.slice(0, 3)];
  const targetIndex = Math.abs(hash) % 4;
  allFour.splice(targetIndex, 0, target);

  return {
    options: allFour,
    targetIndex
  };
}
