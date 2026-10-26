import test from 'node:test';
import assert from 'node:assert/strict';
import { allKanaItems, confusablePairs, learningStages } from './kanaData';

test('kana dataset inventory counts match exact requirements', () => {
  const hiraganaItems = allKanaItems.filter(k => k.script === 'hiragana');
  const katakanaItems = allKanaItems.filter(k => k.script === 'katakana');

  const coreHiragana = hiraganaItems.filter(k => k.category !== 'mechanic');
  const coreKatakana = katakanaItems.filter(k => k.category !== 'extended' && k.category !== 'mechanic');
  const extendedKatakana = katakanaItems.filter(k => k.category === 'extended');
  const mechanics = allKanaItems.filter(k => k.category === 'mechanic');

  // Core Hiragana: 46 basic + 25 voiced/semi-voiced + 36 yōon = 107
  assert.equal(coreHiragana.length, 107, `Expected 107 core Hiragana, got ${coreHiragana.length}`);

  // Core Katakana: 46 basic + 25 voiced/semi-voiced + 36 yōon = 107
  assert.equal(coreKatakana.length, 107, `Expected 107 core Katakana, got ${coreKatakana.length}`);

  // Total core across both scripts = 214
  assert.equal(coreHiragana.length + coreKatakana.length, 214, 'Total core kana must be 214');

  // Extended Katakana = 24
  assert.equal(extendedKatakana.length, 24, `Expected 24 extended Katakana, got ${extendedKatakana.length}`);

  // Mechanics = 5 (Hiragana sokuon, Katakana sokuon, Chōonpu, Hiragana small vowels, Katakana small vowels)
  assert.equal(mechanics.length, 5, `Expected 5 mechanics, got ${mechanics.length}`);
});


test('all kana have unique IDs', () => {
  const ids = new Set<string>();
  for (const item of allKanaItems) {
    assert.equal(ids.has(item.id), false, `Duplicate ID detected: ${item.id}`);
    ids.add(item.id);
  }
});

test('required specific phonetic mappings match Hepburn standard', () => {
  const checks: [string, string][] = [
    ['あ', 'a'],
    ['し', 'shi'],
    ['ち', 'chi'],
    ['つ', 'tsu'],
    ['ふ', 'fu'],
    ['じ', 'ji'],
    ['ぢ', 'ji'],
    ['づ', 'zu'],
    ['ぱ', 'pa'],
    ['きゃ', 'kya'],
    ['しゃ', 'sha'],
    ['ちゃ', 'cha'],
    ['じゃ', 'ja'],
    ['ぴゅ', 'pyu'],
    ['りょ', 'ryo'],
    ['キャ', 'kya'],
    ['ジュ', 'ju'],
    ['ピュ', 'pyu'],
    ['シ', 'shi'],
    ['ツ', 'tsu'],
    ['ン', 'n'],
    ['ファ', 'fa'],
    ['ティ', 'ti'],
    ['ジェ', 'je'],
    ['ヴ', 'vu'],
  ];

  for (const [kana, expectedRomaji] of checks) {
    const item = allKanaItems.find(k => k.kana === kana);
    assert.ok(item, `Kana character not found in dataset: ${kana}`);
    assert.equal(item.romaji, expectedRomaji, `Incorrect romaji for ${kana}: expected ${expectedRomaji}, got ${item.romaji}`);
  }
});

test('contracted kana explicitly use small Unicode characters', () => {
  const pyu = allKanaItems.find(k => k.kana === 'ぴゅ');
  assert.ok(pyu);
  // Second character in ぴゅ must be small ゅ (U+3085), NOT full ゆ (U+3086)
  assert.equal(pyu.kana.charCodeAt(1), 0x3085, 'Expected small ゅ');
  assert.notEqual(pyu.kana.charCodeAt(1), 0x3086, 'Must NOT be full ゆ');

  const kya = allKanaItems.find(k => k.kana === 'きゃ');
  assert.ok(kya);
  // Second character in きゃ must be small ゃ (U+3083), NOT full や (U+3084)
  assert.equal(kya.kana.charCodeAt(1), 0x3083, 'Expected small ゃ');
  assert.notEqual(kya.kana.charCodeAt(1), 0x3084, 'Must NOT be full や');

  const katakanaKyu = allKanaItems.find(k => k.kana === 'キュ');
  assert.ok(katakanaKyu);
  // Second character in キュ must be small ュ (U+30E5), NOT full ユ (U+30E6)
  assert.equal(katakanaKyu.kana.charCodeAt(1), 0x30E5, 'Expected small ュ');
  assert.notEqual(katakanaKyu.kana.charCodeAt(1), 0x30E6, 'Must NOT be full ユ');
});

test('confusable pairs are defined with distinction and tips', () => {
  assert.ok(confusablePairs.length >= 10, 'Must have at least 10 confusable pairs');
  for (const pair of confusablePairs) {
    assert.ok(pair.char1 && pair.char2);
    assert.ok(pair.distinction.length > 5);
    assert.ok(pair.tip.length > 10);
  }
});

test('learning stages cover entire curriculum', () => {
  assert.ok(learningStages.length >= 25, 'Expected at least 25 progressive stages');
  const stageKanaIds = new Set(learningStages.flatMap(s => s.kanaIds));
  assert.ok(stageKanaIds.size > 200, 'Stages should cover the vast majority of kana');
});
