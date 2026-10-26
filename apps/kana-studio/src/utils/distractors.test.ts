import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKanaDistractors } from './distractors';
import { kanaMap } from '../data/kanaData';

test('distractor generator produces 4 distinct plausible options including target', () => {
  const pyu = kanaMap.get('h-pyu');
  assert.ok(pyu);

  const res = generateKanaDistractors(pyu);
  assert.equal(res.options.length, 4);
  assert.equal(res.options[res.targetIndex].id, pyu.id);

  // All 4 options are unique
  const ids = new Set(res.options.map(o => o.id));
  assert.equal(ids.size, 4);

  // All 4 options are Hiragana
  for (const opt of res.options) {
    assert.equal(opt.script, 'hiragana');
  }
});

test('distractor generator prioritizes confusable pairs', () => {
  const shi = kanaMap.get('k-shi');
  assert.ok(shi);

  const res = generateKanaDistractors(shi);
  const tsu = res.options.find(o => o.kana === 'ツ');
  assert.ok(tsu, 'Katakana tsu (ツ) should be included as a top distractor for shi (シ)');
});
