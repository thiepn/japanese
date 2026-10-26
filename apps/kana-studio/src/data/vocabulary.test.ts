import test from 'node:test';
import assert from 'node:assert/strict';
import { vocabularyList, filterWordsByLearnedKana } from './vocabulary';
import { kanaMap } from './kanaData';

test('vocabulary dataset has valid words and unique IDs', () => {
  assert.ok(vocabularyList.length >= 30, 'vocabularyList has at least 30 entries');
  const ids = new Set<string>();
  for (const word of vocabularyList) {
    assert.ok(word.id.startsWith('w-'), `id ${word.id} should start with w-`);
    assert.ok(!ids.has(word.id), `duplicate word id: ${word.id}`);
    ids.add(word.id);
    assert.ok(word.kana.length > 0, `kana should not be empty for ${word.id}`);
    assert.ok(word.romaji.length > 0, `romaji should not be empty for ${word.id}`);
    assert.ok(word.meaning.length > 0, `meaning should not be empty for ${word.id}`);
  }
});

test('all vocabulary kanaIds point to valid KanaItems in the kanaMap', () => {
  for (const word of vocabularyList) {
    for (const kanaId of word.kanaIds) {
      const exists = kanaMap.has(kanaId);
      assert.ok(exists, `Word ${word.id} (${word.kana}) references non-existent kanaId: ${kanaId}`);
    }
  }
});

test('filterWordsByLearnedKana accurately returns words with all components unlocked', () => {
  // Mock learned set with basic vowels and S-row:
  const learned = new Set(['h-a', 'h-sa', 'h-i', 'h-e', 'h-ne', 'h-ko']);
  const filtered = filterWordsByLearnedKana(vocabularyList, learned);
  
  // "あさ" (h-a, h-sa) should be present
  const asa = filtered.find(w => w.id === 'w-asa');
  assert.ok(asa, 'w-asa should be present when h-a and h-sa are learned');

  // "いえ" (h-i, h-e) should be present
  const ie = filtered.find(w => w.id === 'w-ie');
  assert.ok(ie, 'w-ie should be present when h-i and h-e are learned');

  // "さくら" (h-sa, h-ku, h-ra) should NOT be present (missing h-ku, h-ra)
  const sakura = filtered.find(w => w.id === 'w-sakura');
  assert.equal(sakura, undefined, 'w-sakura should not be present if ku/ra not learned');
});
