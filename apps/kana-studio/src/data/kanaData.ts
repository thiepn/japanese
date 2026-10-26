import type { KanaItem, ConfusablePair } from '../types/kana';

// 46 Basic Hiragana
const basicHiragana: KanaItem[] = [
  // Vowels
  { id: 'h-a', script: 'hiragana', category: 'basic', kana: 'あ', romaji: 'a', group: 'vowels', order: 1, row: 'vowel', column: 'a', explanation: 'Basic vowel sound "ah", like in "father".' },
  { id: 'h-i', script: 'hiragana', category: 'basic', kana: 'い', romaji: 'i', group: 'vowels', order: 2, row: 'vowel', column: 'i', explanation: 'Basic vowel sound "ee", like in "feet".' },
  { id: 'h-u', script: 'hiragana', category: 'basic', kana: 'う', romaji: 'u', group: 'vowels', order: 3, row: 'vowel', column: 'u', explanation: 'Basic vowel sound "oo", pronounced with unrounded lips.' },
  { id: 'h-e', script: 'hiragana', category: 'basic', kana: 'え', romaji: 'e', group: 'vowels', order: 4, row: 'vowel', column: 'e', explanation: 'Basic vowel sound "eh", like in "get".' },
  { id: 'h-o', script: 'hiragana', category: 'basic', kana: 'お', romaji: 'o', group: 'vowels', order: 5, row: 'vowel', column: 'o', explanation: 'Basic vowel sound "oh", like in "boat".' },

  // K-row
  { id: 'h-ka', script: 'hiragana', category: 'basic', kana: 'か', romaji: 'ka', group: 'k-row', order: 6, row: 'K', column: 'a' },
  { id: 'h-ki', script: 'hiragana', category: 'basic', kana: 'き', romaji: 'ki', group: 'k-row', order: 7, row: 'K', column: 'i' },
  { id: 'h-ku', script: 'hiragana', category: 'basic', kana: 'く', romaji: 'ku', group: 'k-row', order: 8, row: 'K', column: 'u' },
  { id: 'h-ke', script: 'hiragana', category: 'basic', kana: 'け', romaji: 'ke', group: 'k-row', order: 9, row: 'K', column: 'e' },
  { id: 'h-ko', script: 'hiragana', category: 'basic', kana: 'こ', romaji: 'ko', group: 'k-row', order: 10, row: 'K', column: 'o' },

  // S-row
  { id: 'h-sa', script: 'hiragana', category: 'basic', kana: 'さ', romaji: 'sa', group: 's-row', order: 11, row: 'S', column: 'a', confusables: ['h-chi'] },
  { id: 'h-shi', script: 'hiragana', category: 'basic', kana: 'し', romaji: 'shi', aliases: ['si'], group: 's-row', order: 12, row: 'S', column: 'i', explanation: 'Hepburn "shi". Alveolo-palatal voiceless fricative.' },
  { id: 'h-su', script: 'hiragana', category: 'basic', kana: 'す', romaji: 'su', group: 's-row', order: 13, row: 'S', column: 'u' },
  { id: 'h-se', script: 'hiragana', category: 'basic', kana: 'せ', romaji: 'se', group: 's-row', order: 14, row: 'S', column: 'e' },
  { id: 'h-so', script: 'hiragana', category: 'basic', kana: 'そ', romaji: 'so', group: 's-row', order: 15, row: 'S', column: 'o' },

  // T-row
  { id: 'h-ta', script: 'hiragana', category: 'basic', kana: 'た', romaji: 'ta', group: 't-row', order: 16, row: 'T', column: 'a' },
  { id: 'h-chi', script: 'hiragana', category: 'basic', kana: 'ち', romaji: 'chi', aliases: ['ti'], group: 't-row', order: 17, row: 'T', column: 'i', confusables: ['h-sa'], explanation: 'Hepburn "chi". Pronounced like "chee" in "cheese".' },
  { id: 'h-tsu', script: 'hiragana', category: 'basic', kana: 'つ', romaji: 'tsu', aliases: ['tu'], group: 't-row', order: 18, row: 'T', column: 'u', explanation: 'Hepburn "tsu". Voiceless alveolar affricate.' },
  { id: 'h-te', script: 'hiragana', category: 'basic', kana: 'て', romaji: 'te', group: 't-row', order: 19, row: 'T', column: 'e' },
  { id: 'h-to', script: 'hiragana', category: 'basic', kana: 'と', romaji: 'to', group: 't-row', order: 20, row: 'T', column: 'o' },

  // N-row
  { id: 'h-na', script: 'hiragana', category: 'basic', kana: 'な', romaji: 'na', group: 'n-row', order: 21, row: 'N', column: 'a' },
  { id: 'h-ni', script: 'hiragana', category: 'basic', kana: 'に', romaji: 'ni', group: 'n-row', order: 22, row: 'N', column: 'i' },
  { id: 'h-nu', script: 'hiragana', category: 'basic', kana: 'ぬ', romaji: 'nu', group: 'n-row', order: 23, row: 'N', column: 'u', confusables: ['h-me'], explanation: 'Note the small loop at the end of the second stroke, distinguishing it from め.' },
  { id: 'h-ne', script: 'hiragana', category: 'basic', kana: 'ね', romaji: 'ne', group: 'n-row', order: 24, row: 'N', column: 'e', confusables: ['h-re'], explanation: 'Note the loop curl at the end, unlike れ which flares right.' },
  { id: 'h-no', script: 'hiragana', category: 'basic', kana: 'の', romaji: 'no', group: 'n-row', order: 25, row: 'N', column: 'o' },

  // H-row
  { id: 'h-ha', script: 'hiragana', category: 'basic', kana: 'は', romaji: 'ha', group: 'h-row', order: 26, row: 'H', column: 'a', confusables: ['h-ho'], explanation: 'Single top horizontal line connecting to the vertical. Used as topic marker particle pronounced "wa".' },
  { id: 'h-hi', script: 'hiragana', category: 'basic', kana: 'ひ', romaji: 'hi', group: 'h-row', order: 27, row: 'H', column: 'i' },
  { id: 'h-fu', script: 'hiragana', category: 'basic', kana: 'ふ', romaji: 'fu', aliases: ['hu'], group: 'h-row', order: 28, row: 'H', column: 'u', explanation: 'Hepburn "fu". Voiceless bilabial fricative, air gently expelled between lips.' },
  { id: 'h-he', script: 'hiragana', category: 'basic', kana: 'へ', romaji: 'he', group: 'h-row', order: 29, row: 'H', column: 'e', explanation: 'When used as the direction particle, pronounced "e".' },
  { id: 'h-ho', script: 'hiragana', category: 'basic', kana: 'ほ', romaji: 'ho', group: 'h-row', order: 30, row: 'H', column: 'o', confusables: ['h-ha'], explanation: 'The vertical stroke does NOT poke through the top horizontal line.' },

  // M-row
  { id: 'h-ma', script: 'hiragana', category: 'basic', kana: 'ま', romaji: 'ma', group: 'm-row', order: 31, row: 'M', column: 'a' },
  { id: 'h-mi', script: 'hiragana', category: 'basic', kana: 'み', romaji: 'mi', group: 'm-row', order: 32, row: 'M', column: 'i' },
  { id: 'h-mu', script: 'hiragana', category: 'basic', kana: 'む', romaji: 'mu', group: 'm-row', order: 33, row: 'M', column: 'u' },
  { id: 'h-me', script: 'hiragana', category: 'basic', kana: 'め', romaji: 'me', group: 'm-row', order: 34, row: 'M', column: 'e', confusables: ['h-nu'], explanation: 'Smooth finish without a terminal loop, unlike ぬ.' },
  { id: 'h-mo', script: 'hiragana', category: 'basic', kana: 'も', romaji: 'mo', group: 'm-row', order: 35, row: 'M', column: 'o' },

  // Y-row
  { id: 'h-ya', script: 'hiragana', category: 'basic', kana: 'や', romaji: 'ya', group: 'y-row', order: 36, row: 'Y', column: 'ya' },
  { id: 'h-yu', script: 'hiragana', category: 'basic', kana: 'ゆ', romaji: 'yu', group: 'y-row', order: 37, row: 'Y', column: 'yu' },
  { id: 'h-yo', script: 'hiragana', category: 'basic', kana: 'よ', romaji: 'yo', group: 'y-row', order: 38, row: 'Y', column: 'yo' },

  // R-row
  { id: 'h-ra', script: 'hiragana', category: 'basic', kana: 'ら', romaji: 'ra', group: 'r-row', order: 39, row: 'R', column: 'a' },
  { id: 'h-ri', script: 'hiragana', category: 'basic', kana: 'り', romaji: 'ri', group: 'r-row', order: 40, row: 'R', column: 'i' },
  { id: 'h-ru', script: 'hiragana', category: 'basic', kana: 'る', romaji: 'ru', group: 'r-row', order: 41, row: 'R', column: 'u', confusables: ['h-ro'], explanation: 'Ends with a small inner curl loop at the bottom, unlike ろ.' },
  { id: 'h-re', script: 'hiragana', category: 'basic', kana: 'れ', romaji: 're', group: 'r-row', order: 42, row: 'R', column: 'e', confusables: ['h-ne'], explanation: 'Ends with a rightward flare sweep, unlike ね.' },
  { id: 'h-ro', script: 'hiragana', category: 'basic', kana: 'ろ', romaji: 'ro', group: 'r-row', order: 43, row: 'R', column: 'o', confusables: ['h-ru'], explanation: 'Smooth open curve at bottom without the loop of る.' },

  // W-row & N
  { id: 'h-wa', script: 'hiragana', category: 'basic', kana: 'わ', romaji: 'wa', group: 'w-row', order: 44, row: 'W', column: 'a' },
  { id: 'h-wo', script: 'hiragana', category: 'basic', kana: 'を', romaji: 'wo', aliases: ['o'], group: 'w-row', order: 45, row: 'W', column: 'o', explanation: 'Ordinarily pronounced "o" in modern standard Japanese. Used exclusively as the grammatical object marker particle.' },
  { id: 'h-n', script: 'hiragana', category: 'basic', kana: 'ん', romaji: 'n', aliases: ['nn'], group: 'w-row', order: 46, row: 'W', column: 'other', explanation: 'Uvular or moraic nasal. The only standalone consonant kana.' }
];

// 25 Voiced / Semi-voiced Hiragana
const voicedHiragana: KanaItem[] = [
  // G-row (dakuten)
  { id: 'h-ga', script: 'hiragana', category: 'voiced', kana: 'が', romaji: 'ga', group: 'g-row', order: 47, row: 'G', column: 'a', construction: { baseKana: 'か', modifierKana: '゛', explanation: 'か (ka) + dakuten ゛ → が (ga)' } },
  { id: 'h-gi', script: 'hiragana', category: 'voiced', kana: 'ぎ', romaji: 'gi', group: 'g-row', order: 48, row: 'G', column: 'i', construction: { baseKana: 'き', modifierKana: '゛', explanation: 'き (ki) + dakuten ゛ → ぎ (gi)' } },
  { id: 'h-gu', script: 'hiragana', category: 'voiced', kana: 'ぐ', romaji: 'gu', group: 'g-row', order: 49, row: 'G', column: 'u', construction: { baseKana: 'く', modifierKana: '゛', explanation: 'く (ku) + dakuten ゛ → ぐ (gu)' } },
  { id: 'h-ge', script: 'hiragana', category: 'voiced', kana: 'げ', romaji: 'ge', group: 'g-row', order: 50, row: 'G', column: 'e', construction: { baseKana: 'け', modifierKana: '゛', explanation: 'け (ke) + dakuten ゛ → げ (ge)' } },
  { id: 'h-go', script: 'hiragana', category: 'voiced', kana: 'ご', romaji: 'go', group: 'g-row', order: 51, row: 'G', column: 'o', construction: { baseKana: 'こ', modifierKana: '゛', explanation: 'こ (ko) + dakuten ゛ → ご (go)' } },

  // Z-row (dakuten)
  { id: 'h-za', script: 'hiragana', category: 'voiced', kana: 'ざ', romaji: 'za', group: 'z-row', order: 52, row: 'Z', column: 'a', construction: { baseKana: 'さ', modifierKana: '゛', explanation: 'さ (sa) + dakuten ゛ → ざ (za)' } },
  { id: 'h-ji', script: 'hiragana', category: 'voiced', kana: 'じ', romaji: 'ji', aliases: ['zi'], group: 'z-row', order: 53, row: 'Z', column: 'i', construction: { baseKana: 'し', modifierKana: '゛', explanation: 'し (shi) + dakuten ゛ → じ (ji)' } },
  { id: 'h-zu', script: 'hiragana', category: 'voiced', kana: 'ず', romaji: 'zu', group: 'z-row', order: 54, row: 'Z', column: 'u', construction: { baseKana: 'す', modifierKana: '゛', explanation: 'す (su) + dakuten ゛ → ず (zu)' } },
  { id: 'h-ze', script: 'hiragana', category: 'voiced', kana: 'ぜ', romaji: 'ze', group: 'z-row', order: 55, row: 'Z', column: 'e', construction: { baseKana: 'せ', modifierKana: '゛', explanation: 'せ (se) + dakuten ゛ → ぜ (ze)' } },
  { id: 'h-zo', script: 'hiragana', category: 'voiced', kana: 'ぞ', romaji: 'zo', group: 'z-row', order: 56, row: 'Z', column: 'o', construction: { baseKana: 'そ', modifierKana: '゛', explanation: 'そ (so) + dakuten ゛ → ぞ (zo)' } },

  // D-row (dakuten)
  { id: 'h-da', script: 'hiragana', category: 'voiced', kana: 'だ', romaji: 'da', group: 'd-row', order: 57, row: 'D', column: 'a', construction: { baseKana: 'た', modifierKana: '゛', explanation: 'た (ta) + dakuten ゛ → だ (da)' } },
  { id: 'h-dji', script: 'hiragana', category: 'voiced', kana: 'ぢ', romaji: 'ji', aliases: ['di', 'dji'], group: 'd-row', order: 58, row: 'D', column: 'i', construction: { baseKana: 'ち', modifierKana: '゛', explanation: 'ち (chi) + dakuten ゛ → ぢ (ji/di)' }, explanation: 'Pronounced identical to じ in standard Japanese (Yotsugana merger). Used in compounds like 鼻血 (はなぢ hanaji).' },
  { id: 'h-dzu', script: 'hiragana', category: 'voiced', kana: 'づ', romaji: 'zu', aliases: ['du', 'dzu'], group: 'd-row', order: 59, row: 'D', column: 'u', construction: { baseKana: 'つ', modifierKana: '゛', explanation: 'つ (tsu) + dakuten ゛ → づ (zu/du)' }, explanation: 'Pronounced identical to ず in standard Japanese (Yotsugana merger). Used in compounds like 続く (つづく tsuzuku).' },
  { id: 'h-de', script: 'hiragana', category: 'voiced', kana: 'で', romaji: 'de', group: 'd-row', order: 60, row: 'D', column: 'e', construction: { baseKana: 'て', modifierKana: '゛', explanation: 'て (te) + dakuten ゛ → で (de)' } },
  { id: 'h-do', script: 'hiragana', category: 'voiced', kana: 'ど', romaji: 'do', group: 'd-row', order: 61, row: 'D', column: 'o', construction: { baseKana: 'と', modifierKana: '゛', explanation: 'と (to) + dakuten ゛ → ど (do)' } },

  // B-row (dakuten)
  { id: 'h-ba', script: 'hiragana', category: 'voiced', kana: 'ば', romaji: 'ba', group: 'b-row', order: 62, row: 'B', column: 'a', construction: { baseKana: 'は', modifierKana: '゛', explanation: 'は (ha) + dakuten ゛ → ば (ba)' } },
  { id: 'h-bi', script: 'hiragana', category: 'voiced', kana: 'び', romaji: 'bi', group: 'b-row', order: 63, row: 'B', column: 'i', construction: { baseKana: 'ひ', modifierKana: '゛', explanation: 'ひ (hi) + dakuten ゛ → び (bi)' } },
  { id: 'h-bu', script: 'hiragana', category: 'voiced', kana: 'ぶ', romaji: 'bu', group: 'b-row', order: 64, row: 'B', column: 'u', construction: { baseKana: 'ふ', modifierKana: '゛', explanation: 'ふ (fu) + dakuten ゛ → ぶ (bu)' } },
  { id: 'h-be', script: 'hiragana', category: 'voiced', kana: 'べ', romaji: 'be', group: 'b-row', order: 65, row: 'B', column: 'e', construction: { baseKana: 'へ', modifierKana: '゛', explanation: 'へ (he) + dakuten ゛ → べ (be)' } },
  { id: 'h-bo', script: 'hiragana', category: 'voiced', kana: 'ぼ', romaji: 'bo', group: 'b-row', order: 66, row: 'B', column: 'o', construction: { baseKana: 'ほ', modifierKana: '゛', explanation: 'ほ (ho) + dakuten ゛ → ぼ (bo)' } },

  // P-row (handakuten)
  { id: 'h-pa', script: 'hiragana', category: 'semi-voiced', kana: 'ぱ', romaji: 'pa', group: 'p-row', order: 67, row: 'P', column: 'a', construction: { baseKana: 'は', modifierKana: '゜', explanation: 'は (ha) + handakuten ゜ → ぱ (pa)' } },
  { id: 'h-pi', script: 'hiragana', category: 'semi-voiced', kana: 'ぴ', romaji: 'pi', group: 'p-row', order: 68, row: 'P', column: 'i', construction: { baseKana: 'ひ', modifierKana: '゜', explanation: 'ひ (hi) + handakuten ゜ → ぴ (pi)' } },
  { id: 'h-pu', script: 'hiragana', category: 'semi-voiced', kana: 'ぷ', romaji: 'pu', group: 'p-row', order: 69, row: 'P', column: 'u', construction: { baseKana: 'ふ', modifierKana: '゜', explanation: 'ふ (fu) + handakuten ゜ → ぷ (pu)' } },
  { id: 'h-pe', script: 'hiragana', category: 'semi-voiced', kana: 'ぺ', romaji: 'pe', group: 'p-row', order: 70, row: 'P', column: 'e', construction: { baseKana: 'へ', modifierKana: '゜', explanation: 'へ (he) + handakuten ゜ → ぺ (pe)' } },
  { id: 'h-po', script: 'hiragana', category: 'semi-voiced', kana: 'ぽ', romaji: 'po', group: 'p-row', order: 71, row: 'P', column: 'o', construction: { baseKana: 'ほ', modifierKana: '゜', explanation: 'ほ (ho) + handakuten ゜ → ぽ (po)' } },
];

// 36 Yōon (Contracted sounds) Hiragana (33 standard + 3 uncommon D-series)
const yoonHiragana: KanaItem[] = [
  // K
  { id: 'h-kya', script: 'hiragana', category: 'contracted', kana: 'きゃ', romaji: 'kya', group: 'ky-row', order: 72, row: 'KY', column: 'ya', construction: { baseKana: 'き', modifierKana: 'ゃ', explanation: 'き (ki) + small ゃ (ya) → きゃ (kya)' } },
  { id: 'h-kyu', script: 'hiragana', category: 'contracted', kana: 'きゅ', romaji: 'kyu', group: 'ky-row', order: 73, row: 'KY', column: 'yu', construction: { baseKana: 'き', modifierKana: 'ゅ', explanation: 'き (ki) + small ゅ (yu) → きゅ (kyu)' } },
  { id: 'h-kyo', script: 'hiragana', category: 'contracted', kana: 'きょ', romaji: 'kyo', group: 'ky-row', order: 74, row: 'KY', column: 'yo', construction: { baseKana: 'き', modifierKana: 'ょ', explanation: 'き (ki) + small ょ (yo) → きょ (kyo)' } },

  // G
  { id: 'h-gya', script: 'hiragana', category: 'contracted', kana: 'ぎゃ', romaji: 'gya', group: 'gy-row', order: 75, row: 'GY', column: 'ya', construction: { baseKana: 'ぎ', modifierKana: 'ゃ', explanation: 'ぎ (gi) + small ゃ (ya) → ぎゃ (gya)' } },
  { id: 'h-gyu', script: 'hiragana', category: 'contracted', kana: 'ぎゅ', romaji: 'gyu', group: 'gy-row', order: 76, row: 'GY', column: 'yu', construction: { baseKana: 'ぎ', modifierKana: 'ゅ', explanation: 'ぎ (gi) + small ゅ (yu) → ぎゅ (gyu)' } },
  { id: 'h-gyo', script: 'hiragana', category: 'contracted', kana: 'ぎょ', romaji: 'gyo', group: 'gy-row', order: 77, row: 'GY', column: 'yo', construction: { baseKana: 'ぎ', modifierKana: 'ょ', explanation: 'ぎ (gi) + small ょ (yo) → ぎょ (gyo)' } },

  // SH
  { id: 'h-sha', script: 'hiragana', category: 'contracted', kana: 'しゃ', romaji: 'sha', aliases: ['sya'], group: 'sh-row', order: 78, row: 'SH', column: 'ya', construction: { baseKana: 'し', modifierKana: 'ゃ', explanation: 'し (shi) + small ゃ (ya) → しゃ (sha)' } },
  { id: 'h-shu', script: 'hiragana', category: 'contracted', kana: 'しゅ', romaji: 'shu', aliases: ['syu'], group: 'sh-row', order: 79, row: 'SH', column: 'yu', construction: { baseKana: 'し', modifierKana: 'ゅ', explanation: 'し (shi) + small ゅ (yu) → しゅ (shu)' } },
  { id: 'h-sho', script: 'hiragana', category: 'contracted', kana: 'しょ', romaji: 'sho', aliases: ['syo'], group: 'sh-row', order: 80, row: 'SH', column: 'yo', construction: { baseKana: 'し', modifierKana: 'ょ', explanation: 'し (shi) + small ょ (yo) → しょ (sho)' } },

  // J
  { id: 'h-ja', script: 'hiragana', category: 'contracted', kana: 'じゃ', romaji: 'ja', aliases: ['zya', 'jya'], group: 'j-row', order: 81, row: 'J', column: 'ya', construction: { baseKana: 'じ', modifierKana: 'ゃ', explanation: 'じ (ji) + small ゃ (ya) → じゃ (ja)' } },
  { id: 'h-ju', script: 'hiragana', category: 'contracted', kana: 'じゅ', romaji: 'ju', aliases: ['zyu', 'jyu'], group: 'j-row', order: 82, row: 'J', column: 'yu', construction: { baseKana: 'じ', modifierKana: 'ゅ', explanation: 'じ (ji) + small ゅ (yu) → じゅ (ju)' } },
  { id: 'h-jo', script: 'hiragana', category: 'contracted', kana: 'じょ', romaji: 'jo', aliases: ['zyo', 'jyo'], group: 'j-row', order: 83, row: 'J', column: 'yo', construction: { baseKana: 'じ', modifierKana: 'ょ', explanation: 'じ (ji) + small ょ (yo) → じょ (jo)' } },

  // CH
  { id: 'h-cha', script: 'hiragana', category: 'contracted', kana: 'ちゃ', romaji: 'cha', aliases: ['tya'], group: 'ch-row', order: 84, row: 'CH', column: 'ya', construction: { baseKana: 'ち', modifierKana: 'ゃ', explanation: 'ち (chi) + small ゃ (ya) → ちゃ (cha)' } },
  { id: 'h-chu', script: 'hiragana', category: 'contracted', kana: 'ちゅ', romaji: 'chu', aliases: ['tyu'], group: 'ch-row', order: 85, row: 'CH', column: 'yu', construction: { baseKana: 'ち', modifierKana: 'ゅ', explanation: 'ち (chi) + small ゅ (yu) → ちゅ (chu)' } },
  { id: 'h-cho', script: 'hiragana', category: 'contracted', kana: 'ちょ', romaji: 'cho', aliases: ['tyo'], group: 'ch-row', order: 86, row: 'CH', column: 'yo', construction: { baseKana: 'ち', modifierKana: 'ょ', explanation: 'ち (chi) + small ょ (yo) → ちょ (cho)' } },

  // N
  { id: 'h-nya', script: 'hiragana', category: 'contracted', kana: 'にゃ', romaji: 'nya', group: 'ny-row', order: 87, row: 'NY', column: 'ya', construction: { baseKana: 'に', modifierKana: 'ゃ', explanation: 'に (ni) + small ゃ (ya) → にゃ (nya)' } },
  { id: 'h-nyu', script: 'hiragana', category: 'contracted', kana: 'にゅ', romaji: 'nyu', group: 'ny-row', order: 88, row: 'NY', column: 'yu', construction: { baseKana: 'に', modifierKana: 'ゅ', explanation: 'に (ni) + small ゅ (yu) → にゅ (nyu)' } },
  { id: 'h-nyo', script: 'hiragana', category: 'contracted', kana: 'にょ', romaji: 'nyo', group: 'ny-row', order: 89, row: 'NY', column: 'yo', construction: { baseKana: 'に', modifierKana: 'ょ', explanation: 'に (ni) + small ょ (yo) → にょ (nyo)' } },

  // H
  { id: 'h-hya', script: 'hiragana', category: 'contracted', kana: 'ひゃ', romaji: 'hya', group: 'hy-row', order: 90, row: 'HY', column: 'ya', construction: { baseKana: 'ひ', modifierKana: 'ゃ', explanation: 'ひ (hi) + small ゃ (ya) → ひゃ (hya)' } },
  { id: 'h-hyu', script: 'hiragana', category: 'contracted', kana: 'ひゅ', romaji: 'hyu', group: 'hy-row', order: 91, row: 'HY', column: 'yu', construction: { baseKana: 'ひ', modifierKana: 'ゅ', explanation: 'ひ (hi) + small ゅ (yu) → ひゅ (hyu)' } },
  { id: 'h-hyo', script: 'hiragana', category: 'contracted', kana: 'ひょ', romaji: 'hyo', group: 'hy-row', order: 92, row: 'HY', column: 'yo', construction: { baseKana: 'ひ', modifierKana: 'ょ', explanation: 'ひ (hi) + small ょ (yo) → ひょ (hyo)' } },

  // B
  { id: 'h-bya', script: 'hiragana', category: 'contracted', kana: 'びゃ', romaji: 'bya', group: 'by-row', order: 93, row: 'BY', column: 'ya', construction: { baseKana: 'び', modifierKana: 'ゃ', explanation: 'び (bi) + small ゃ (ya) → びゃ (bya)' } },
  { id: 'h-byu', script: 'hiragana', category: 'contracted', kana: 'びゅ', romaji: 'byu', group: 'by-row', order: 94, row: 'BY', column: 'yu', construction: { baseKana: 'び', modifierKana: 'ゅ', explanation: 'び (bi) + small ゅ (yu) → びゅ (byu)' } },
  { id: 'h-byo', script: 'hiragana', category: 'contracted', kana: 'びょ', romaji: 'byo', group: 'by-row', order: 95, row: 'BY', column: 'yo', construction: { baseKana: 'び', modifierKana: 'ょ', explanation: 'び (bi) + small ょ (yo) → びょ (byo)' } },

  // P
  { id: 'h-pya', script: 'hiragana', category: 'contracted', kana: 'ぴゃ', romaji: 'pya', group: 'py-row', order: 96, row: 'PY', column: 'ya', construction: { baseKana: 'ぴ', modifierKana: 'ゃ', explanation: 'ぴ (pi) + small ゃ (ya) → ぴゃ (pya)' } },
  { id: 'h-pyu', script: 'hiragana', category: 'contracted', kana: 'ぴゅ', romaji: 'pyu', group: 'py-row', order: 97, row: 'PY', column: 'yu', construction: { baseKana: 'ぴ', modifierKana: 'ゅ', explanation: 'ぴ (pi) + small ゅ (yu) → ぴゅ (pyu)' } },
  { id: 'h-pyo', script: 'hiragana', category: 'contracted', kana: 'ぴょ', romaji: 'pyo', group: 'py-row', order: 98, row: 'PY', column: 'yo', construction: { baseKana: 'ぴ', modifierKana: 'ょ', explanation: 'ぴ (pi) + small ょ (yo) → ぴょ (pyo)' } },

  // M
  { id: 'h-mya', script: 'hiragana', category: 'contracted', kana: 'みゃ', romaji: 'mya', group: 'my-row', order: 99, row: 'MY', column: 'ya', construction: { baseKana: 'み', modifierKana: 'ゃ', explanation: 'み (mi) + small ゃ (ya) → みゃ (mya)' } },
  { id: 'h-myu', script: 'hiragana', category: 'contracted', kana: 'みゅ', romaji: 'myu', group: 'my-row', order: 100, row: 'MY', column: 'yu', construction: { baseKana: 'み', modifierKana: 'ゅ', explanation: 'み (mi) + small ゅ (yu) → みゅ (myu)' } },
  { id: 'h-myo', script: 'hiragana', category: 'contracted', kana: 'みょ', romaji: 'myo', group: 'my-row', order: 101, row: 'MY', column: 'yo', construction: { baseKana: 'み', modifierKana: 'ょ', explanation: 'み (mi) + small ょ (yo) → みょ (myo)' } },

  // R
  { id: 'h-rya', script: 'hiragana', category: 'contracted', kana: 'りゃ', romaji: 'rya', group: 'ry-row', order: 102, row: 'RY', column: 'ya', construction: { baseKana: 'り', modifierKana: 'ゃ', explanation: 'り (ri) + small ゃ (ya) → りゃ (rya)' } },
  { id: 'h-ryu', script: 'hiragana', category: 'contracted', kana: 'りゅ', romaji: 'ryu', group: 'ry-row', order: 103, row: 'RY', column: 'yu', construction: { baseKana: 'り', modifierKana: 'ゅ', explanation: 'り (ri) + small ゅ (yu) → りゅ (ryu)' } },
  { id: 'h-ryo', script: 'hiragana', category: 'contracted', kana: 'りょ', romaji: 'ryo', group: 'ry-row', order: 104, row: 'RY', column: 'yo', construction: { baseKana: 'り', modifierKana: 'ょ', explanation: 'り (ri) + small ょ (yo) → りょ (ryo)' } },

  // Uncommon D-series
  { id: 'h-dja', script: 'hiragana', category: 'contracted', kana: 'ぢゃ', romaji: 'ja', aliases: ['dja', 'jya'], group: 'dj-row', order: 105, row: 'DJ', column: 'ya', isUncommon: true, construction: { baseKana: 'ぢ', modifierKana: 'ゃ', explanation: 'ぢ (dji) + small ゃ (ya) → ぢゃ (ja/dja)' }, explanation: 'Uncommon D-series yōon combination; phonetically merged with じゃ in modern Japanese.' },
  { id: 'h-dju', script: 'hiragana', category: 'contracted', kana: 'ぢゅ', romaji: 'ju', aliases: ['dju', 'jyu'], group: 'dj-row', order: 106, row: 'DJ', column: 'yu', isUncommon: true, construction: { baseKana: 'ぢ', modifierKana: 'ゅ', explanation: 'ぢ (dji) + small ゅ (yu) → ぢゅ (ju/dju)' }, explanation: 'Uncommon D-series yōon combination; phonetically merged with じゅ.' },
  { id: 'h-djo', script: 'hiragana', category: 'contracted', kana: 'ぢょ', romaji: 'jo', aliases: ['djo', 'jyo'], group: 'dj-row', order: 107, row: 'DJ', column: 'yo', isUncommon: true, construction: { baseKana: 'ぢ', modifierKana: 'ょ', explanation: 'ぢ (dji) + small ょ (yo) → ぢょ (jo/djo)' }, explanation: 'Uncommon D-series yōon combination; phonetically merged with じょ.' },
];

// 46 Basic Katakana
const basicKatakana: KanaItem[] = [
  // Vowels
  { id: 'k-a', script: 'katakana', category: 'basic', kana: 'ア', romaji: 'a', group: 'vowels', order: 108, row: 'vowel', column: 'a', explanation: 'Katakana "a", angular counterpart to あ.' },
  { id: 'k-i', script: 'katakana', category: 'basic', kana: 'イ', romaji: 'i', group: 'vowels', order: 109, row: 'vowel', column: 'i' },
  { id: 'k-u', script: 'katakana', category: 'basic', kana: 'ウ', romaji: 'u', group: 'vowels', order: 110, row: 'vowel', column: 'u' },
  { id: 'k-e', script: 'katakana', category: 'basic', kana: 'エ', romaji: 'e', group: 'vowels', order: 111, row: 'vowel', column: 'e' },
  { id: 'k-o', script: 'katakana', category: 'basic', kana: 'オ', romaji: 'o', group: 'vowels', order: 112, row: 'vowel', column: 'o' },

  // K-row
  { id: 'k-ka', script: 'katakana', category: 'basic', kana: 'カ', romaji: 'ka', group: 'k-row', order: 113, row: 'K', column: 'a' },
  { id: 'k-ki', script: 'katakana', category: 'basic', kana: 'キ', romaji: 'ki', group: 'k-row', order: 114, row: 'K', column: 'i' },
  { id: 'k-ku', script: 'katakana', category: 'basic', kana: 'ク', romaji: 'ku', group: 'k-row', order: 115, row: 'K', column: 'u', confusables: ['k-ke'], explanation: 'Single curved sweep down-left, distinguishing it from ケ.' },
  { id: 'k-ke', script: 'katakana', category: 'basic', kana: 'ケ', romaji: 'ke', group: 'k-row', order: 116, row: 'K', column: 'e', confusables: ['k-ku'], explanation: 'Features a clear horizontal crossbar.' },
  { id: 'k-ko', script: 'katakana', category: 'basic', kana: 'コ', romaji: 'ko', group: 'k-row', order: 117, row: 'K', column: 'o' },

  // S-row
  { id: 'k-sa', script: 'katakana', category: 'basic', kana: 'サ', romaji: 'sa', group: 's-row', order: 118, row: 'S', column: 'a' },
  { id: 'k-shi', script: 'katakana', category: 'basic', kana: 'シ', romaji: 'shi', aliases: ['si'], group: 's-row', order: 119, row: 'S', column: 'i', confusables: ['k-tsu'], explanation: 'Strokes 1 & 2 align more vertically; the main 3rd stroke sweeps upward from bottom-left to top-right.' },
  { id: 'k-su', script: 'katakana', category: 'basic', kana: 'ス', romaji: 'su', group: 's-row', order: 120, row: 'S', column: 'u', confusables: ['k-nu'], explanation: 'Angular right down-stroke without a loop or crossover stroke.' },
  { id: 'k-se', script: 'katakana', category: 'basic', kana: 'セ', romaji: 'se', group: 's-row', order: 121, row: 'S', column: 'e' },
  { id: 'k-so', script: 'katakana', category: 'basic', kana: 'ソ', romaji: 'so', group: 's-row', order: 122, row: 'S', column: 'o', confusables: ['k-n'], explanation: 'The short stroke is more vertical; the main stroke descends downward from top-right to bottom-left.' },

  // T-row
  { id: 'k-ta', script: 'katakana', category: 'basic', kana: 'タ', romaji: 'ta', group: 't-row', order: 123, row: 'T', column: 'a' },
  { id: 'k-chi', script: 'katakana', category: 'basic', kana: 'チ', romaji: 'chi', aliases: ['ti'], group: 't-row', order: 124, row: 'T', column: 'i' },
  { id: 'k-tsu', script: 'katakana', category: 'basic', kana: 'ツ', romaji: 'tsu', aliases: ['tu'], group: 't-row', order: 125, row: 'T', column: 'u', confusables: ['k-shi'], explanation: 'Strokes 1 & 2 align horizontally; the main 3rd stroke sweeps downward from top-right to bottom-left.' },
  { id: 'k-te', script: 'katakana', category: 'basic', kana: 'テ', romaji: 'te', group: 't-row', order: 126, row: 'T', column: 'e' },
  { id: 'k-to', script: 'katakana', category: 'basic', kana: 'ト', romaji: 'to', group: 't-row', order: 127, row: 'T', column: 'o' },

  // N-row
  { id: 'k-na', script: 'katakana', category: 'basic', kana: 'ナ', romaji: 'na', group: 'n-row', order: 128, row: 'N', column: 'a' },
  { id: 'k-ni', script: 'katakana', category: 'basic', kana: 'ニ', romaji: 'ni', group: 'n-row', order: 129, row: 'N', column: 'i' },
  { id: 'k-nu', script: 'katakana', category: 'basic', kana: 'ヌ', romaji: 'nu', group: 'n-row', order: 130, row: 'N', column: 'u', confusables: ['k-su'], explanation: 'The second stroke crosses through the first down-sweep and terminates.' },
  { id: 'k-ne', script: 'katakana', category: 'basic', kana: 'ネ', romaji: 'ne', group: 'n-row', order: 131, row: 'N', column: 'e' },
  { id: 'k-no', script: 'katakana', category: 'basic', kana: 'ノ', romaji: 'no', group: 'n-row', order: 132, row: 'N', column: 'o' },

  // H-row
  { id: 'k-ha', script: 'katakana', category: 'basic', kana: 'ハ', romaji: 'ha', group: 'h-row', order: 133, row: 'H', column: 'a' },
  { id: 'k-hi', script: 'katakana', category: 'basic', kana: 'ヒ', romaji: 'hi', group: 'h-row', order: 134, row: 'H', column: 'i' },
  { id: 'k-fu', script: 'katakana', category: 'basic', kana: 'フ', romaji: 'fu', aliases: ['hu'], group: 'h-row', order: 135, row: 'H', column: 'u', confusables: ['k-wa'], explanation: 'A single angled stroke hooking left without the vertical left side of ワ.' },
  { id: 'k-he', script: 'katakana', category: 'basic', kana: 'ヘ', romaji: 'he', group: 'h-row', order: 136, row: 'H', column: 'e' },
  { id: 'k-ho', script: 'katakana', category: 'basic', kana: 'ホ', romaji: 'ho', group: 'h-row', order: 137, row: 'H', column: 'o' },

  // M-row
  { id: 'k-ma', script: 'katakana', category: 'basic', kana: 'マ', romaji: 'ma', group: 'm-row', order: 138, row: 'M', column: 'a' },
  { id: 'k-mi', script: 'katakana', category: 'basic', kana: 'ミ', romaji: 'mi', group: 'm-row', order: 139, row: 'M', column: 'i' },
  { id: 'k-mu', script: 'katakana', category: 'basic', kana: 'ム', romaji: 'mu', group: 'm-row', order: 140, row: 'M', column: 'u' },
  { id: 'k-me', script: 'katakana', category: 'basic', kana: 'メ', romaji: 'me', group: 'm-row', order: 141, row: 'M', column: 'e' },
  { id: 'k-mo', script: 'katakana', category: 'basic', kana: 'モ', romaji: 'mo', group: 'm-row', order: 142, row: 'M', column: 'o' },

  // Y-row
  { id: 'k-ya', script: 'katakana', category: 'basic', kana: 'ヤ', romaji: 'ya', group: 'y-row', order: 143, row: 'Y', column: 'ya' },
  { id: 'k-yu', script: 'katakana', category: 'basic', kana: 'ユ', romaji: 'yu', group: 'y-row', order: 144, row: 'Y', column: 'yu' },
  { id: 'k-yo', script: 'katakana', category: 'basic', kana: 'ヨ', romaji: 'yo', group: 'y-row', order: 145, row: 'Y', column: 'yo' },

  // R-row
  { id: 'k-ra', script: 'katakana', category: 'basic', kana: 'ラ', romaji: 'ra', group: 'r-row', order: 146, row: 'R', column: 'a' },
  { id: 'k-ri', script: 'katakana', category: 'basic', kana: 'リ', romaji: 'ri', group: 'r-row', order: 147, row: 'R', column: 'i' },
  { id: 'k-ru', script: 'katakana', category: 'basic', kana: 'ル', romaji: 'ru', group: 'r-row', order: 148, row: 'R', column: 'u' },
  { id: 'k-re', script: 'katakana', category: 'basic', kana: 'レ', romaji: 're', group: 'r-row', order: 149, row: 'R', column: 'e' },
  { id: 'k-ro', script: 'katakana', category: 'basic', kana: 'ロ', romaji: 'ro', group: 'r-row', order: 150, row: 'R', column: 'o' },

  // W-row & N
  { id: 'k-wa', script: 'katakana', category: 'basic', kana: 'ワ', romaji: 'wa', group: 'w-row', order: 151, row: 'W', column: 'a', confusables: ['k-fu'], explanation: 'Starts with a distinct vertical downward stroke on the left.' },
  { id: 'k-wo', script: 'katakana', category: 'basic', kana: 'ヲ', romaji: 'wo', aliases: ['o'], group: 'w-row', order: 152, row: 'W', column: 'o', explanation: 'Katakana equivalent of を, pronounced "o". Rare in modern Katakana, mainly found in stylistic writing.' },
  { id: 'k-n', script: 'katakana', category: 'basic', kana: 'ン', romaji: 'n', aliases: ['nn'], group: 'w-row', order: 153, row: 'W', column: 'other', confusables: ['k-so'], explanation: 'The short stroke is more horizontal; the main stroke sweeps upward from bottom-left to top-right.' }
];

// 25 Voiced / Semi-voiced Katakana
const voicedKatakana: KanaItem[] = [
  // G-row
  { id: 'k-ga', script: 'katakana', category: 'voiced', kana: 'ガ', romaji: 'ga', group: 'g-row', order: 154, row: 'G', column: 'a', construction: { baseKana: 'カ', modifierKana: '゛', explanation: 'カ (ka) + dakuten ゛ → ガ (ga)' } },
  { id: 'k-gi', script: 'katakana', category: 'voiced', kana: 'ギ', romaji: 'gi', group: 'g-row', order: 155, row: 'G', column: 'i', construction: { baseKana: 'キ', modifierKana: '゛', explanation: 'キ (ki) + dakuten ゛ → ギ (gi)' } },
  { id: 'k-gu', script: 'katakana', category: 'voiced', kana: 'グ', romaji: 'gu', group: 'g-row', order: 156, row: 'G', column: 'u', construction: { baseKana: 'ク', modifierKana: '゛', explanation: 'ク (ku) + dakuten ゛ → グ (gu)' } },
  { id: 'k-ge', script: 'katakana', category: 'voiced', kana: 'ゲ', romaji: 'ge', group: 'g-row', order: 157, row: 'G', column: 'e', construction: { baseKana: 'ケ', modifierKana: '゛', explanation: 'ケ (ke) + dakuten ゛ → ゲ (ge)' } },
  { id: 'k-go', script: 'katakana', category: 'voiced', kana: 'ゴ', romaji: 'go', group: 'g-row', order: 158, row: 'G', column: 'o', construction: { baseKana: 'コ', modifierKana: '゛', explanation: 'コ (ko) + dakuten ゛ → ゴ (go)' } },

  // Z-row
  { id: 'k-za', script: 'katakana', category: 'voiced', kana: 'ザ', romaji: 'za', group: 'z-row', order: 159, row: 'Z', column: 'a', construction: { baseKana: 'サ', modifierKana: '゛', explanation: 'サ (sa) + dakuten ゛ → ザ (za)' } },
  { id: 'k-ji', script: 'katakana', category: 'voiced', kana: 'ジ', romaji: 'ji', aliases: ['zi'], group: 'z-row', order: 160, row: 'Z', column: 'i', construction: { baseKana: 'シ', modifierKana: '゛', explanation: 'シ (shi) + dakuten ゛ → ジ (ji)' } },
  { id: 'k-zu', script: 'katakana', category: 'voiced', kana: 'ズ', romaji: 'zu', group: 'z-row', order: 161, row: 'Z', column: 'u', construction: { baseKana: 'ス', modifierKana: '゛', explanation: 'ス (su) + dakuten ゛ → ズ (zu)' } },
  { id: 'k-ze', script: 'katakana', category: 'voiced', kana: 'ゼ', romaji: 'ze', group: 'z-row', order: 162, row: 'Z', column: 'e', construction: { baseKana: 'セ', modifierKana: '゛', explanation: 'セ (se) + dakuten ゛ → ゼ (ze)' } },
  { id: 'k-zo', script: 'katakana', category: 'voiced', kana: 'ゾ', romaji: 'zo', group: 'z-row', order: 163, row: 'Z', column: 'o', construction: { baseKana: 'ソ', modifierKana: '゛', explanation: 'ソ (so) + dakuten ゛ → ゾ (zo)' } },

  // D-row
  { id: 'k-da', script: 'katakana', category: 'voiced', kana: 'ダ', romaji: 'da', group: 'd-row', order: 164, row: 'D', column: 'a', construction: { baseKana: 'タ', modifierKana: '゛', explanation: 'タ (ta) + dakuten ゛ → ダ (da)' } },
  { id: 'k-dji', script: 'katakana', category: 'voiced', kana: 'ヂ', romaji: 'ji', aliases: ['di', 'dji'], group: 'd-row', order: 165, row: 'D', column: 'i', construction: { baseKana: 'チ', modifierKana: '゛', explanation: 'チ (chi) + dakuten ゛ → ヂ (ji/di)' }, explanation: 'Katakana D-row voiced character, phonetically ji/di.' },
  { id: 'k-dzu', script: 'katakana', category: 'voiced', kana: 'ヅ', romaji: 'zu', aliases: ['du', 'dzu'], group: 'd-row', order: 166, row: 'D', column: 'u', construction: { baseKana: 'ツ', modifierKana: '゛', explanation: 'ツ (tsu) + dakuten ゛ → ヅ (zu/du)' }, explanation: 'Katakana D-row voiced character, phonetically zu/du.' },
  { id: 'k-de', script: 'katakana', category: 'voiced', kana: 'デ', romaji: 'de', group: 'd-row', order: 167, row: 'D', column: 'e', construction: { baseKana: 'テ', modifierKana: '゛', explanation: 'テ (te) + dakuten ゛ → デ (de)' } },
  { id: 'k-do', script: 'katakana', category: 'voiced', kana: 'ド', romaji: 'do', group: 'd-row', order: 168, row: 'D', column: 'o', construction: { baseKana: 'ト', modifierKana: '゛', explanation: 'ト (to) + dakuten ゛ → ド (do)' } },

  // B-row
  { id: 'k-ba', script: 'katakana', category: 'voiced', kana: 'バ', romaji: 'ba', group: 'b-row', order: 169, row: 'B', column: 'a', construction: { baseKana: 'ハ', modifierKana: '゛', explanation: 'ハ (ha) + dakuten ゛ → バ (ba)' } },
  { id: 'k-bi', script: 'katakana', category: 'voiced', kana: 'ビ', romaji: 'bi', group: 'b-row', order: 170, row: 'B', column: 'i', construction: { baseKana: 'ヒ', modifierKana: '゛', explanation: 'ヒ (hi) + dakuten ゛ → ビ (bi)' } },
  { id: 'k-bu', script: 'katakana', category: 'voiced', kana: 'ブ', romaji: 'bu', group: 'b-row', order: 171, row: 'B', column: 'u', construction: { baseKana: 'フ', modifierKana: '゛', explanation: 'フ (fu) + dakuten ゛ → ブ (bu)' } },
  { id: 'k-be', script: 'katakana', category: 'voiced', kana: 'ベ', romaji: 'be', group: 'b-row', order: 172, row: 'B', column: 'e', construction: { baseKana: 'ヘ', modifierKana: '゛', explanation: 'ヘ (he) + dakuten ゛ → ベ (be)' } },
  { id: 'k-bo', script: 'katakana', category: 'voiced', kana: 'ボ', romaji: 'bo', group: 'b-row', order: 173, row: 'B', column: 'o', construction: { baseKana: 'ホ', modifierKana: '゛', explanation: 'ホ (ho) + dakuten ゛ → ボ (bo)' } },

  // P-row
  { id: 'k-pa', script: 'katakana', category: 'semi-voiced', kana: 'パ', romaji: 'pa', group: 'p-row', order: 174, row: 'P', column: 'a', construction: { baseKana: 'ハ', modifierKana: '゜', explanation: 'ハ (ha) + handakuten ゜ → パ (pa)' } },
  { id: 'k-pi', script: 'katakana', category: 'semi-voiced', kana: 'ピ', romaji: 'pi', group: 'p-row', order: 175, row: 'P', column: 'i', construction: { baseKana: 'ヒ', modifierKana: '゜', explanation: 'ヒ (hi) + handakuten ゜ → ピ (pi)' } },
  { id: 'k-pu', script: 'katakana', category: 'semi-voiced', kana: 'プ', romaji: 'pu', group: 'p-row', order: 176, row: 'P', column: 'u', construction: { baseKana: 'フ', modifierKana: '゜', explanation: 'フ (fu) + handakuten ゜ → プ (pu)' } },
  { id: 'k-pe', script: 'katakana', category: 'semi-voiced', kana: 'ペ', romaji: 'pe', group: 'p-row', order: 177, row: 'P', column: 'e', construction: { baseKana: 'ヘ', modifierKana: '゜', explanation: 'ヘ (he) + handakuten ゜ → ペ (pe)' } },
  { id: 'k-po', script: 'katakana', category: 'semi-voiced', kana: 'ポ', romaji: 'po', group: 'p-row', order: 178, row: 'P', column: 'o', construction: { baseKana: 'ホ', modifierKana: '゜', explanation: 'ホ (ho) + handakuten ゜ → ポ (po)' } },
];

// 36 Yōon Katakana (33 standard + 3 uncommon D-series)
const yoonKatakana: KanaItem[] = [
  // K
  { id: 'k-kya', script: 'katakana', category: 'contracted', kana: 'キャ', romaji: 'kya', group: 'ky-row', order: 179, row: 'KY', column: 'ya', construction: { baseKana: 'キ', modifierKana: 'ャ', explanation: 'キ (ki) + small ャ (ya) → キャ (kya)' } },
  { id: 'k-kyu', script: 'katakana', category: 'contracted', kana: 'キュ', romaji: 'kyu', group: 'ky-row', order: 180, row: 'KY', column: 'yu', construction: { baseKana: 'キ', modifierKana: 'ュ', explanation: 'キ (ki) + small ュ (yu) → キュ (kyu)' } },
  { id: 'k-kyo', script: 'katakana', category: 'contracted', kana: 'キョ', romaji: 'kyo', group: 'ky-row', order: 181, row: 'KY', column: 'yo', construction: { baseKana: 'キ', modifierKana: 'ョ', explanation: 'キ (ki) + small ョ (yo) → キョ (kyo)' } },

  // G
  { id: 'k-gya', script: 'katakana', category: 'contracted', kana: 'ギャ', romaji: 'gya', group: 'gy-row', order: 182, row: 'GY', column: 'ya', construction: { baseKana: 'ギ', modifierKana: 'ャ', explanation: 'ギ (gi) + small ャ (ya) → ギャ (gya)' } },
  { id: 'k-gyu', script: 'katakana', category: 'contracted', kana: 'ギュ', romaji: 'gyu', group: 'gy-row', order: 183, row: 'GY', column: 'yu', construction: { baseKana: 'ギ', modifierKana: 'ュ', explanation: 'ギ (gi) + small ュ (yu) → ギュ (gyu)' } },
  { id: 'k-gyo', script: 'katakana', category: 'contracted', kana: 'ギョ', romaji: 'gyo', group: 'gy-row', order: 184, row: 'GY', column: 'yo', construction: { baseKana: 'ギ', modifierKana: 'ョ', explanation: 'ギ (gi) + small ョ (yo) → ギョ (gyo)' } },

  // SH
  { id: 'k-sha', script: 'katakana', category: 'contracted', kana: 'シャ', romaji: 'sha', aliases: ['sya'], group: 'sh-row', order: 185, row: 'SH', column: 'ya', construction: { baseKana: 'シ', modifierKana: 'ャ', explanation: 'シ (shi) + small ャ (ya) → シャ (sha)' } },
  { id: 'k-shu', script: 'katakana', category: 'contracted', kana: 'シュ', romaji: 'shu', aliases: ['syu'], group: 'sh-row', order: 186, row: 'SH', column: 'yu', construction: { baseKana: 'シ', modifierKana: 'ュ', explanation: 'シ (shi) + small ュ (yu) → シュ (shu)' } },
  { id: 'k-sho', script: 'katakana', category: 'contracted', kana: 'ショ', romaji: 'sho', aliases: ['syo'], group: 'sh-row', order: 187, row: 'SH', column: 'yo', construction: { baseKana: 'シ', modifierKana: 'ョ', explanation: 'シ (shi) + small ョ (yo) → ショ (sho)' } },

  // J
  { id: 'k-ja', script: 'katakana', category: 'contracted', kana: 'ジャ', romaji: 'ja', aliases: ['zya', 'jya'], group: 'j-row', order: 188, row: 'J', column: 'ya', construction: { baseKana: 'ジ', modifierKana: 'ャ', explanation: 'ジ (ji) + small ャ (ya) → ジャ (ja)' } },
  { id: 'k-ju', script: 'katakana', category: 'contracted', kana: 'ジュ', romaji: 'ju', aliases: ['zyu', 'jyu'], group: 'j-row', order: 189, row: 'J', column: 'yu', construction: { baseKana: 'ジ', modifierKana: 'ュ', explanation: 'ジ (ji) + small ュ (yu) → ジュ (ju)' } },
  { id: 'k-jo', script: 'katakana', category: 'contracted', kana: 'ジョ', romaji: 'jo', aliases: ['zyo', 'jyo'], group: 'j-row', order: 190, row: 'J', column: 'yo', construction: { baseKana: 'ジ', modifierKana: 'ョ', explanation: 'ジ (ji) + small ョ (yo) → ジョ (jo)' } },

  // CH
  { id: 'k-cha', script: 'katakana', category: 'contracted', kana: 'チャ', romaji: 'cha', aliases: ['tya'], group: 'ch-row', order: 191, row: 'CH', column: 'ya', construction: { baseKana: 'チ', modifierKana: 'ャ', explanation: 'チ (chi) + small ャ (ya) → チャ (cha)' } },
  { id: 'k-chu', script: 'katakana', category: 'contracted', kana: 'チュ', romaji: 'chu', aliases: ['tyu'], group: 'ch-row', order: 192, row: 'CH', column: 'yu', construction: { baseKana: 'チ', modifierKana: 'ュ', explanation: 'チ (chi) + small ュ (yu) → チュ (chu)' } },
  { id: 'k-cho', script: 'katakana', category: 'contracted', kana: 'チョ', romaji: 'cho', aliases: ['tyo'], group: 'ch-row', order: 193, row: 'CH', column: 'yo', construction: { baseKana: 'チ', modifierKana: 'ョ', explanation: 'チ (chi) + small ョ (yo) → チョ (cho)' } },

  // N
  { id: 'k-nya', script: 'katakana', category: 'contracted', kana: 'ニャ', romaji: 'nya', group: 'ny-row', order: 194, row: 'NY', column: 'ya', construction: { baseKana: 'ニ', modifierKana: 'ャ', explanation: 'ニ (ni) + small ャ (ya) → ニャ (nya)' } },
  { id: 'k-nyu', script: 'katakana', category: 'contracted', kana: 'ニュ', romaji: 'nyu', group: 'ny-row', order: 195, row: 'NY', column: 'yu', construction: { baseKana: 'ニ', modifierKana: 'ュ', explanation: 'ニ (ni) + small ュ (yu) → ニュ (nyu)' } },
  { id: 'k-nyo', script: 'katakana', category: 'contracted', kana: 'ニョ', romaji: 'nyo', group: 'ny-row', order: 196, row: 'NY', column: 'yo', construction: { baseKana: 'ニ', modifierKana: 'ョ', explanation: 'ニ (ni) + small ョ (yo) → ニョ (nyo)' } },

  // H
  { id: 'k-hya', script: 'katakana', category: 'contracted', kana: 'ヒャ', romaji: 'hya', group: 'hy-row', order: 197, row: 'HY', column: 'ya', construction: { baseKana: 'ヒ', modifierKana: 'ャ', explanation: 'ヒ (hi) + small ャ (ya) → ヒャ (hya)' } },
  { id: 'k-hyu', script: 'katakana', category: 'contracted', kana: 'ヒュ', romaji: 'hyu', group: 'hy-row', order: 198, row: 'HY', column: 'yu', construction: { baseKana: 'ヒ', modifierKana: 'ュ', explanation: 'ヒ (hi) + small ュ (yu) → ヒュ (hyu)' } },
  { id: 'k-hyo', script: 'katakana', category: 'contracted', kana: 'ヒョ', romaji: 'hyo', group: 'hy-row', order: 199, row: 'HY', column: 'yo', construction: { baseKana: 'ヒ', modifierKana: 'ョ', explanation: 'ヒ (hi) + small ョ (yo) → ヒョ (hyo)' } },

  // B
  { id: 'k-bya', script: 'katakana', category: 'contracted', kana: 'ビャ', romaji: 'bya', group: 'by-row', order: 200, row: 'BY', column: 'ya', construction: { baseKana: 'ビ', modifierKana: 'ャ', explanation: 'ビ (bi) + small ャ (ya) → ビャ (bya)' } },
  { id: 'k-byu', script: 'katakana', category: 'contracted', kana: 'ビュ', romaji: 'byu', group: 'by-row', order: 201, row: 'BY', column: 'yu', construction: { baseKana: 'ビ', modifierKana: 'ュ', explanation: 'ビ (bi) + small ュ (yu) → ビュ (byu)' } },
  { id: 'k-byo', script: 'katakana', category: 'contracted', kana: 'ビョ', romaji: 'byo', group: 'by-row', order: 202, row: 'BY', column: 'yo', construction: { baseKana: 'ビ', modifierKana: 'ョ', explanation: 'ビ (bi) + small ョ (yo) → ビョ (byo)' } },

  // P
  { id: 'k-pya', script: 'katakana', category: 'contracted', kana: 'ピャ', romaji: 'pya', group: 'py-row', order: 203, row: 'PY', column: 'ya', construction: { baseKana: 'ピ', modifierKana: 'ャ', explanation: 'ピ (pi) + small ャ (ya) → ピャ (pya)' } },
  { id: 'k-pyu', script: 'katakana', category: 'contracted', kana: 'ピュ', romaji: 'pyu', group: 'py-row', order: 204, row: 'PY', column: 'yu', construction: { baseKana: 'ピ', modifierKana: 'ュ', explanation: 'ピ (pi) + small ュ (yu) → ピュ (pyu)' } },
  { id: 'k-pyo', script: 'katakana', category: 'contracted', kana: 'ピョ', romaji: 'pyo', group: 'py-row', order: 205, row: 'PY', column: 'yo', construction: { baseKana: 'ピ', modifierKana: 'ョ', explanation: 'ピ (pi) + small ョ (yo) → ピョ (pyo)' } },

  // M
  { id: 'k-mya', script: 'katakana', category: 'contracted', kana: 'ミャ', romaji: 'mya', group: 'my-row', order: 206, row: 'MY', column: 'ya', construction: { baseKana: 'ミ', modifierKana: 'ャ', explanation: 'ミ (mi) + small ャ (ya) → ミャ (mya)' } },
  { id: 'k-myu', script: 'katakana', category: 'contracted', kana: 'ミュ', romaji: 'myu', group: 'my-row', order: 207, row: 'MY', column: 'yu', construction: { baseKana: 'ミ', modifierKana: 'ュ', explanation: 'ミ (mi) + small ュ (yu) → ミュ (myu)' } },
  { id: 'k-myo', script: 'katakana', category: 'contracted', kana: 'ミョ', romaji: 'myo', group: 'my-row', order: 208, row: 'MY', column: 'yo', construction: { baseKana: 'ミ', modifierKana: 'ョ', explanation: 'ミ (mi) + small ョ (yo) → ミョ (myo)' } },

  // R
  { id: 'k-rya', script: 'katakana', category: 'contracted', kana: 'リャ', romaji: 'rya', group: 'ry-row', order: 209, row: 'RY', column: 'ya', construction: { baseKana: 'リ', modifierKana: 'ャ', explanation: 'リ (ri) + small ャ (ya) → リャ (rya)' } },
  { id: 'k-ryu', script: 'katakana', category: 'contracted', kana: 'リュ', romaji: 'ryu', group: 'ry-row', order: 210, row: 'RY', column: 'yu', construction: { baseKana: 'リ', modifierKana: 'ュ', explanation: 'リ (ri) + small ュ (yu) → リュ (ryu)' } },
  { id: 'k-ryo', script: 'katakana', category: 'contracted', kana: 'リョ', romaji: 'ryo', group: 'ry-row', order: 211, row: 'RY', column: 'yo', construction: { baseKana: 'リ', modifierKana: 'ョ', explanation: 'リ (ri) + small ョ (yo) → リョ (ryo)' } },

  // Uncommon D-series
  { id: 'k-dja', script: 'katakana', category: 'contracted', kana: 'ヂャ', romaji: 'ja', aliases: ['dja', 'jya'], group: 'dj-row', order: 212, row: 'DJ', column: 'ya', isUncommon: true, construction: { baseKana: 'ヂ', modifierKana: 'ャ', explanation: 'ヂ (dji) + small ャ (ya) → ヂャ (ja/dja)' }, explanation: 'Uncommon Katakana D-series combination.' },
  { id: 'k-dju', script: 'katakana', category: 'contracted', kana: 'ヂュ', romaji: 'ju', aliases: ['dju', 'jyu'], group: 'dj-row', order: 213, row: 'DJ', column: 'yu', isUncommon: true, construction: { baseKana: 'ヂ', modifierKana: 'ュ', explanation: 'ヂ (dji) + small ュ (yu) → ヂュ (ju/dju)' }, explanation: 'Uncommon Katakana D-series combination.' },
  { id: 'k-djo', script: 'katakana', category: 'contracted', kana: 'ヂョ', romaji: 'jo', aliases: ['djo', 'jyo'], group: 'dj-row', order: 214, row: 'DJ', column: 'yo', isUncommon: true, construction: { baseKana: 'ヂ', modifierKana: 'ョ', explanation: 'ヂ (dji) + small ョ (yo) → ヂョ (jo/djo)' }, explanation: 'Uncommon Katakana D-series combination.' },
];

// 24 Extended Katakana for foreign loanwords
const extendedKatakana: KanaItem[] = [
  // F-series
  { id: 'k-fa', script: 'katakana', category: 'extended', kana: 'ファ', romaji: 'fa', group: 'f-ext', order: 215, row: 'EXT-F', column: 'a', construction: { baseKana: 'フ', modifierKana: 'ァ', explanation: 'フ + small ァ → ファ (fa)' }, explanation: 'Used for foreign "fa" sound, as in ファミリー (family).' },
  { id: 'k-fi', script: 'katakana', category: 'extended', kana: 'フィ', romaji: 'fi', group: 'f-ext', order: 216, row: 'EXT-F', column: 'i', construction: { baseKana: 'フ', modifierKana: 'ィ', explanation: 'フ + small ィ → フィ (fi)' }, explanation: 'Used for foreign "fi" sound, as in フィルム (film).' },
  { id: 'k-fe', script: 'katakana', category: 'extended', kana: 'フェ', romaji: 'fe', group: 'f-ext', order: 217, row: 'EXT-F', column: 'e', construction: { baseKana: 'フ', modifierKana: 'ェ', explanation: 'フ + small ェ → フェ (fe)' }, explanation: 'Used for foreign "fe" sound, as in カフェ (cafe).' },
  { id: 'k-fo', script: 'katakana', category: 'extended', kana: 'フォ', romaji: 'fo', group: 'f-ext', order: 218, row: 'EXT-F', column: 'o', construction: { baseKana: 'フ', modifierKana: 'ォ', explanation: 'フ + small ォ → フォ (fo)' }, explanation: 'Used for foreign "fo" sound, as in フォーク (fork).' },
  { id: 'k-fyu', script: 'katakana', category: 'extended', kana: 'フュ', romaji: 'fyu', group: 'f-ext', order: 219, row: 'EXT-F', column: 'yu', construction: { baseKana: 'フ', modifierKana: 'ュ', explanation: 'フ + small ュ → フュ (fyu)' }, explanation: 'Used for foreign "fyu" sound, as in フュージョン (fusion).' },

  // T / D series
  { id: 'k-ti', script: 'katakana', category: 'extended', kana: 'ティ', romaji: 'ti', group: 't-ext', order: 220, row: 'EXT-T', column: 'i', construction: { baseKana: 'テ', modifierKana: 'ィ', explanation: 'テ + small ィ → ティ (ti)' }, explanation: 'Used for foreign "ti" sound (distinct from チ chi), as in パーティー (party).' },
  { id: 'k-di', script: 'katakana', category: 'extended', kana: 'ディ', romaji: 'di', group: 't-ext', order: 221, row: 'EXT-T', column: 'i', construction: { baseKana: 'デ', modifierKana: 'ィ', explanation: 'デ + small ィ → ディ (di)' }, explanation: 'Used for foreign "di" sound (distinct from ジ ji), as in ディスク (disk).' },
  { id: 'k-tu', script: 'katakana', category: 'extended', kana: 'トゥ', romaji: 'tu', group: 't-ext', order: 222, row: 'EXT-T', column: 'u', construction: { baseKana: 'ト', modifierKana: 'ゥ', explanation: 'ト + small ゥ → トゥ (tu)' }, explanation: 'Used for foreign "tu" sound (distinct from ツ tsu), as in タトゥー (tattoo).' },
  { id: 'k-du', script: 'katakana', category: 'extended', kana: 'ドゥ', romaji: 'du', group: 't-ext', order: 223, row: 'EXT-T', column: 'u', construction: { baseKana: 'ド', modifierKana: 'ゥ', explanation: 'ド + small ゥ → ドゥ (du)' }, explanation: 'Used for foreign "du" sound, as in ドゥー (do).' },

  // S / J / CH series
  { id: 'k-she', script: 'katakana', category: 'extended', kana: 'シェ', romaji: 'she', group: 's-ext', order: 224, row: 'EXT-S', column: 'e', construction: { baseKana: 'シ', modifierKana: 'ェ', explanation: 'シ + small ェ → シェ (she)' }, explanation: 'Used for foreign "she" sound, as in シェフ (chef).' },
  { id: 'k-je', script: 'katakana', category: 'extended', kana: 'ジェ', romaji: 'je', group: 's-ext', order: 225, row: 'EXT-S', column: 'e', construction: { baseKana: 'ジ', modifierKana: 'ェ', explanation: 'ジ + small ェ → ジェ (je)' }, explanation: 'Used for foreign "je" sound, as in ジェット (jet).' },
  { id: 'k-che', script: 'katakana', category: 'extended', kana: 'チェ', romaji: 'che', group: 's-ext', order: 226, row: 'EXT-S', column: 'e', construction: { baseKana: 'チ', modifierKana: 'ェ', explanation: 'チ + small ェ → チェ (che)' }, explanation: 'Used for foreign "che" sound, as in チェック (check).' },

  // W series
  { id: 'k-wi', script: 'katakana', category: 'extended', kana: 'ウィ', romaji: 'wi', group: 'w-ext', order: 227, row: 'EXT-W', column: 'i', construction: { baseKana: 'ウ', modifierKana: 'ィ', explanation: 'ウ + small ィ → ウィ (wi)' }, explanation: 'Used for foreign "wi" sound, as in ウィンドウ (window).' },
  { id: 'k-we', script: 'katakana', category: 'extended', kana: 'ウェ', romaji: 'we', group: 'w-ext', order: 228, row: 'EXT-W', column: 'e', construction: { baseKana: 'ウ', modifierKana: 'ェ', explanation: 'ウ + small ェ → ウェ (we)' }, explanation: 'Used for foreign "we" sound, as in ウェブ (web).' },
  { id: 'k-wo-ext', script: 'katakana', category: 'extended', kana: 'ウォ', romaji: 'wo', group: 'w-ext', order: 229, row: 'EXT-W', column: 'o', construction: { baseKana: 'ウ', modifierKana: 'ォ', explanation: 'ウ + small ォ → ウォ (wo)' }, explanation: 'Used for foreign "wo/wa" sound, as in ウォーター (water).' },

  // TS series
  { id: 'k-tsa', script: 'katakana', category: 'extended', kana: 'ツァ', romaji: 'tsa', group: 'ts-ext', order: 230, row: 'EXT-TS', column: 'a', construction: { baseKana: 'ツ', modifierKana: 'ァ', explanation: 'ツ + small ァ → ツァ (tsa)' } },
  { id: 'k-tsi', script: 'katakana', category: 'extended', kana: 'ツィ', romaji: 'tsi', group: 'ts-ext', order: 231, row: 'EXT-TS', column: 'i', construction: { baseKana: 'ツ', modifierKana: 'ィ', explanation: 'ツ + small ィ → ツィ (tsi)' } },
  { id: 'k-tse', script: 'katakana', category: 'extended', kana: 'ツェ', romaji: 'tse', group: 'ts-ext', order: 232, row: 'EXT-TS', column: 'e', construction: { baseKana: 'ツ', modifierKana: 'ェ', explanation: 'ツ + small ェ → ツェ (tse)' } },
  { id: 'k-tso', script: 'katakana', category: 'extended', kana: 'ツォ', romaji: 'tso', group: 'ts-ext', order: 233, row: 'EXT-TS', column: 'o', construction: { baseKana: 'ツ', modifierKana: 'ォ', explanation: 'ツ + small ォ → ツォ (tso)' } },

  // V series
  { id: 'k-vu', script: 'katakana', category: 'extended', kana: 'ヴ', romaji: 'vu', group: 'v-ext', order: 234, row: 'EXT-V', column: 'u', construction: { baseKana: 'ウ', modifierKana: '゛', explanation: 'ウ + dakuten ゛ → ヴ (vu)' }, explanation: 'Represents the "v" sound in loanwords, e.g. ヴァイオリン (violin).' },
  { id: 'k-va', script: 'katakana', category: 'extended', kana: 'ヴァ', romaji: 'va', group: 'v-ext', order: 235, row: 'EXT-V', column: 'a', construction: { baseKana: 'ヴ', modifierKana: 'ァ', explanation: 'ヴ + small ァ → ヴァ (va)' } },
  { id: 'k-vi', script: 'katakana', category: 'extended', kana: 'ヴィ', romaji: 'vi', group: 'v-ext', order: 236, row: 'EXT-V', column: 'i', construction: { baseKana: 'ヴ', modifierKana: 'ィ', explanation: 'ヴ + small ィ → ヴィ (vi)' } },
  { id: 'k-ve', script: 'katakana', category: 'extended', kana: 'ヴェ', romaji: 've', group: 'v-ext', order: 237, row: 'EXT-V', column: 'e', construction: { baseKana: 'ヴ', modifierKana: 'ェ', explanation: 'ヴ + small ェ → ヴェ (ve)' } },
  { id: 'k-vo', script: 'katakana', category: 'extended', kana: 'ヴォ', romaji: 'vo', group: 'v-ext', order: 238, row: 'EXT-V', column: 'o', construction: { baseKana: 'ヴ', modifierKana: 'ォ', explanation: 'ヴ + small ォ → ヴォ (vo)' } },
];

// Special mechanics & Small Kana
const specialMechanics: KanaItem[] = [
  {
    id: 'mech-h-sokuon',
    script: 'hiragana',
    category: 'mechanic',
    kana: 'っ',
    romaji: '(geminate consonant)',
    aliases: ['xtsu', 'ltsu'],
    group: 'mechanics',
    order: 239,
    explanation: 'Small tsu (sokuon, 促音). Indicates a geminate (doubled) consonant sound, creating a brief glottal pause. e.g. がっこう (gakkō), きって (kitte).'
  },
  {
    id: 'mech-k-sokuon',
    script: 'katakana',
    category: 'mechanic',
    kana: 'ッ',
    romaji: '(geminate consonant)',
    aliases: ['xtsu', 'ltsu'],
    group: 'mechanics',
    order: 240,
    explanation: 'Katakana small tsu (sokuon). Doubles the following consonant in loanwords. e.g. ベッド (beddo), カップ (kappu).'
  },
  {
    id: 'mech-k-choonpu',
    script: 'katakana',
    category: 'mechanic',
    kana: 'ー',
    romaji: '(long vowel)',
    aliases: ['-'],
    group: 'mechanics',
    order: 241,
    explanation: 'Chōonpu (長音符). Extends the sound of the preceding vowel by one mora. Essential in Katakana loanwords: コーヒー (kōhī), ケーキ (kēki).'
  },
  {
    id: 'mech-h-small-vowels',
    script: 'hiragana',
    category: 'mechanic',
    kana: 'ぁ ぃ ぅ ぇ ぉ',
    romaji: '(small vowels)',
    aliases: ['small vowels'],
    group: 'mechanics',
    order: 242,
    explanation: 'Small Hiragana vowels (捨て仮名 sute-gana). Used to express trailing vowel sounds, sighs, or emotional tone: あぁ (aah), ねぇ (nee).'
  },
  {
    id: 'mech-k-small-vowels',
    script: 'katakana',
    category: 'mechanic',
    kana: 'ァ ィ ゥ ェ ォ',
    romaji: '(small vowels)',
    aliases: ['small vowels'],
    group: 'mechanics',
    order: 243,
    explanation: 'Small Katakana vowels. Combined with full-size characters to form modern loanword phonemes such as ファ (fa), ティ (ti), and ウィ (wi).'
  }
];


// Master list
export const allKanaItems: KanaItem[] = [
  ...basicHiragana,
  ...voicedHiragana,
  ...yoonHiragana,
  ...basicKatakana,
  ...voicedKatakana,
  ...yoonKatakana,
  ...extendedKatakana,
  ...specialMechanics
];

export const kanaMap = new Map<string, KanaItem>(
  allKanaItems.map((item) => [item.id, item])
);

// Confusable character pairs for specialized visual training
export const confusablePairs: ConfusablePair[] = [
  {
    id: 'c-shi-tsu',
    script: 'katakana',
    char1: 'シ',
    char2: 'ツ',
    romaji1: 'shi',
    romaji2: 'tsu',
    distinction: 'Stroke angle & release sweep direction',
    tip: 'シ (shi) strokes 1 & 2 are stacked more vertically, and the long 3rd stroke sweeps UPWARD from bottom-left to top-right. In ツ (tsu), strokes 1 & 2 lie horizontally side-by-side, and the 3rd stroke drops DOWNWARD from top-right to bottom-left.'
  },
  {
    id: 'c-so-n',
    script: 'katakana',
    char1: 'ソ',
    char2: 'ン',
    romaji1: 'so',
    romaji2: 'n',
    distinction: 'Dot angle & main sweep trajectory',
    tip: 'ソ (so) has a downward-slanting dot, and the main stroke sweeps DOWN from top to bottom. ン (n) has a flatter horizontal dot, and the main stroke shoots UPWARD from bottom-left to top-right.'
  },
  {
    id: 'c-ku-ke',
    script: 'katakana',
    char1: 'ク',
    char2: 'ケ',
    romaji1: 'ku',
    romaji2: 'ke',
    distinction: 'Presence of horizontal crossbar',
    tip: 'ク (ku) is a simple curved diagonal and downward hook with no crossbar. ケ (ke) has a distinct horizontal crossbar through the left diagonal.'
  },
  {
    id: 'c-fu-wa',
    script: 'katakana',
    char1: 'フ',
    char2: 'ワ',
    romaji1: 'fu',
    romaji2: 'wa',
    distinction: 'Left vertical stem',
    tip: 'フ (fu) is a standalone top corner hook. ワ (wa) begins with an initial vertical stroke on the far left before the corner.'
  },
  {
    id: 'c-su-nu',
    script: 'katakana',
    char1: 'ス',
    char2: 'ヌ',
    romaji1: 'su',
    romaji2: 'nu',
    distinction: 'Crossing diagonal stroke',
    tip: 'ス (su) turns downward and drops a diagonal right slash from the corner. ヌ (nu) drops a crossing diagonal that extends completely through the stroke.'
  },
  {
    id: 'c-nu-me',
    script: 'hiragana',
    char1: 'ぬ',
    char2: 'め',
    romaji1: 'nu',
    romaji2: 'me',
    distinction: 'Terminal tail loop',
    tip: 'ぬ (nu) has a small circular knot-loop at the lower right finish. め (me) has no loop and smoothly tapers off.'
  },
  {
    id: 'c-re-ne',
    script: 'hiragana',
    char1: 'れ',
    char2: 'ね',
    romaji1: 're',
    romaji2: 'ne',
    distinction: 'End-stroke curl vs outward flare',
    tip: 'れ (re) curves down and boldly flares OUTWARD to the right. ね (ne) curls into a tight, closed circular loop at the bottom right.'
  },
  {
    id: 'c-ru-ro',
    script: 'hiragana',
    char1: 'る',
    char2: 'ろ',
    romaji1: 'ru',
    romaji2: 'ro',
    distinction: 'Bottom curl loop',
    tip: 'る (ru) terminates with an inward loop circle at the bottom. ろ (ro) remains open like the numeral "3".'
  },
  {
    id: 'c-ha-ho',
    script: 'hiragana',
    char1: 'は',
    char2: 'ほ',
    romaji1: 'ha',
    romaji2: 'ho',
    distinction: 'Top horizontal stroke closure',
    tip: 'は (ha) has only one top horizontal stroke, through which the vertical line extends. ほ (ho) has an extra top bar, and the vertical line does NOT poke through the top.'
  },
  {
    id: 'c-sa-chi',
    script: 'hiragana',
    char1: 'さ',
    char2: 'ち',
    romaji1: 'sa',
    romaji2: 'chi',
    distinction: 'Mirror orientation & loop position',
    tip: 'さ (sa) sweeps down to the left and curves its bottom arc clockwise opening to the left. ち (chi) starts higher with a rightward slant and its main rounded belly curves to the right.'
  },
  {
    id: 'c-contrast-kya',
    script: 'contrast',
    char1: 'きゃ',
    char2: 'きや',
    romaji1: 'kya (1 mora)',
    romaji2: 'ki-ya (2 morae)',
    distinction: 'Small kana contract vs full-size separate syllable',
    tip: 'Notice the size difference: ゃ in きゃ is half-height and contracted into a single syllable "kya". In きや, や is full size, creating two distinct rhythm beats: "ki-ya".'
  },
  {
    id: 'c-contrast-shu',
    script: 'contrast',
    char1: 'しゅ',
    char2: 'しゆ',
    romaji1: 'shu (1 mora)',
    romaji2: 'shi-yu (2 morae)',
    distinction: 'Contracted palatal sound vs two independent syllables',
    tip: 'ゅ in しゅ is small and contracts the sound into one syllable "shu". In しゆ, ゆ is normal size and pronounced as two separate beats "shi - yu".'
  },
  {
    id: 'c-contrast-k-kya',
    script: 'contrast',
    char1: 'キャ',
    char2: 'キヤ',
    romaji1: 'kya (1 mora)',
    romaji2: 'ki-ya (2 morae)',
    distinction: 'Small Katakana contraction vs full glyph',
    tip: 'ャ in キャ is half-height and forms the contracted sound "kya". In キヤ, both characters are full size, producing two beats "ki - ya".'
  },
  {
    id: 'c-contrast-pyu',
    script: 'contrast',
    char1: 'ピュ',
    char2: 'ピユ',
    romaji1: 'pyu (1 mora)',
    romaji2: 'pi-yu (2 morae)',
    distinction: 'Small Katakana contraction vs full vowel',
    tip: 'ュ in ピュ is rendered at half size and forms the single syllable "pyu". In contrast, ピユ is pronounced as two distinct beats "pi - yu".'
  }
];


// Stages for progressive learning
export interface LearningStage {
  id: string;
  title: string;
  script: 'hiragana' | 'katakana' | 'mechanics';
  description: string;
  kanaIds: string[];
}

export const learningStages: LearningStage[] = [
  // Hiragana Stages
  {
    id: 'h-stage-1',
    title: '1. Hiragana Vowels (あ・い・う・え・お)',
    script: 'hiragana',
    description: 'The foundation of all Japanese pronunciation.',
    kanaIds: ['h-a', 'h-i', 'h-u', 'h-e', 'h-o']
  },
  {
    id: 'h-stage-2',
    title: '2. K-Row (か・き・く・け・こ)',
    script: 'hiragana',
    description: 'Crisp k-consonant syllables.',
    kanaIds: ['h-ka', 'h-ki', 'h-ku', 'h-ke', 'h-ko']
  },
  {
    id: 'h-stage-3',
    title: '3. S-Row (さ・し・す・せ・そ)',
    script: 'hiragana',
    description: 'Includes the irregular pronunciation "shi".',
    kanaIds: ['h-sa', 'h-shi', 'h-su', 'h-se', 'h-so']
  },
  {
    id: 'h-stage-4',
    title: '4. T-Row (た・ち・つ・て・と)',
    script: 'hiragana',
    description: 'Includes the irregular sounds "chi" and "tsu".',
    kanaIds: ['h-ta', 'h-chi', 'h-tsu', 'h-te', 'h-to']
  },
  {
    id: 'h-stage-5',
    title: '5. N-Row (な・に・ぬ・ね・の)',
    script: 'hiragana',
    description: 'Pay close attention to ぬ vs め and ね vs れ.',
    kanaIds: ['h-na', 'h-ni', 'h-nu', 'h-ne', 'h-no']
  },
  {
    id: 'h-stage-6',
    title: '6. H-Row (は・ひ・ふ・へ・ほ)',
    script: 'hiragana',
    description: 'Includes the soft bilabial "fu". Note は vs ほ.',
    kanaIds: ['h-ha', 'h-hi', 'h-fu', 'h-he', 'h-ho']
  },
  {
    id: 'h-stage-7',
    title: '7. M-Row (ま・み・む・め・も)',
    script: 'hiragana',
    description: 'Smooth m-consonant syllables. Contrast め with ぬ.',
    kanaIds: ['h-ma', 'h-mi', 'h-mu', 'h-me', 'h-mo']
  },
  {
    id: 'h-stage-8',
    title: '8. Y-Row (や・ゆ・よ)',
    script: 'hiragana',
    description: 'Three core glide syllables.',
    kanaIds: ['h-ya', 'h-yu', 'h-yo']
  },
  {
    id: 'h-stage-9',
    title: '9. R-Row (ら・り・る・れ・ろ)',
    script: 'hiragana',
    description: 'Japanese flap consonant. Note る vs ろ.',
    kanaIds: ['h-ra', 'h-ri', 'h-ru', 'h-re', 'h-ro']
  },
  {
    id: 'h-stage-10',
    title: '10. W-Row & N (わ・を・ん)',
    script: 'hiragana',
    description: 'Object particle を and the moraic nasal ん.',
    kanaIds: ['h-wa', 'h-wo', 'h-n']
  },
  {
    id: 'h-stage-11',
    title: '11. Dakuten Voiced (が・ざ・だ・ば)',
    script: 'hiragana',
    description: 'Voiced consonants created by adding the dakuten mark ゛.',
    kanaIds: [
      'h-ga', 'h-gi', 'h-gu', 'h-ge', 'h-go',
      'h-za', 'h-ji', 'h-zu', 'h-ze', 'h-zo',
      'h-da', 'h-dji', 'h-dzu', 'h-de', 'h-do',
      'h-ba', 'h-bi', 'h-bu', 'h-be', 'h-bo'
    ]
  },
  {
    id: 'h-stage-12',
    title: '12. Handakuten Semi-voiced (ぱ・ぴ・ぷ・ぺ・ぽ)',
    script: 'hiragana',
    description: 'Semi-voiced p-consonants created by adding the circle mark ゜.',
    kanaIds: ['h-pa', 'h-pi', 'h-pu', 'h-pe', 'h-po']
  },
  {
    id: 'h-stage-13',
    title: '13. Contracted Sounds Yōon (きゃ・しゃ・ちゃ etc.)',
    script: 'hiragana',
    description: 'Contracted syllables combining i-row consonants with small ゃ, ゅ, ょ.',
    kanaIds: [
      'h-kya', 'h-kyu', 'h-kyo',
      'h-gya', 'h-gyu', 'h-gyo',
      'h-sha', 'h-shu', 'h-sho',
      'h-ja', 'h-ju', 'h-jo',
      'h-cha', 'h-chu', 'h-cho',
      'h-nya', 'h-nyu', 'h-nyo',
      'h-hya', 'h-hyu', 'h-hyo',
      'h-bya', 'h-byu', 'h-byo',
      'h-pya', 'h-pyu', 'h-pyo',
      'h-mya', 'h-myu', 'h-myo',
      'h-rya', 'h-ryu', 'h-ryo',
      'h-dja', 'h-dju', 'h-djo'
    ]
  },

  // Katakana Stages
  {
    id: 'k-stage-1',
    title: '14. Katakana Vowels (ア・イ・ウ・エ・オ)',
    script: 'katakana',
    description: 'Angular Katakana vowel glyphs.',
    kanaIds: ['k-a', 'k-i', 'k-u', 'k-e', 'k-o']
  },
  {
    id: 'k-stage-2',
    title: '15. Katakana K-Row (カ・キ・ク・ケ・コ)',
    script: 'katakana',
    description: 'Sharp, angular strokes. Contrast ク with ケ.',
    kanaIds: ['k-ka', 'k-ki', 'k-ku', 'k-ke', 'k-ko']
  },
  {
    id: 'k-stage-3',
    title: '16. Katakana S-Row (サ・シ・ス・セ・ソ)',
    script: 'katakana',
    description: 'Critical confusable kana: シ (shi) vs ツ (tsu) and ソ (so) vs ン (n).',
    kanaIds: ['k-sa', 'k-shi', 'k-su', 'k-se', 'k-so']
  },
  {
    id: 'k-stage-4',
    title: '17. Katakana T-Row (タ・チ・ツ・テ・ト)',
    script: 'katakana',
    description: 'Master the stroke angle of ツ (tsu).',
    kanaIds: ['k-ta', 'k-chi', 'k-tsu', 'k-te', 'k-to']
  },
  {
    id: 'k-stage-5',
    title: '18. Katakana N-Row (ナ・ニ・ヌ・ネ・ノ)',
    script: 'katakana',
    description: 'Straightforward clean angles. Note ヌ vs ス.',
    kanaIds: ['k-na', 'k-ni', 'k-nu', 'k-ne', 'k-no']
  },
  {
    id: 'k-stage-6',
    title: '19. Katakana H-Row (ハ・ヒ・フ・ヘ・ホ)',
    script: 'katakana',
    description: 'Contrast フ (fu) with ワ (wa).',
    kanaIds: ['k-ha', 'k-hi', 'k-fu', 'k-he', 'k-ho']
  },
  {
    id: 'k-stage-7',
    title: '20. Katakana M-Row (マ・ミ・ム・メ・モ)',
    script: 'katakana',
    description: 'Distinctive geometric Katakana forms.',
    kanaIds: ['k-ma', 'k-mi', 'k-mu', 'k-me', 'k-mo']
  },
  {
    id: 'k-stage-8',
    title: '21. Katakana Y-Row (ヤ・ユ・ヨ)',
    script: 'katakana',
    description: 'Core glide consonants in Katakana.',
    kanaIds: ['k-ya', 'k-yu', 'k-yo']
  },
  {
    id: 'k-stage-9',
    title: '22. Katakana R-Row (ラ・リ・ル・レ・ロ)',
    script: 'katakana',
    description: 'R-series Katakana forms.',
    kanaIds: ['k-ra', 'k-ri', 'k-ru', 'k-re', 'k-ro']
  },
  {
    id: 'k-stage-10',
    title: '23. Katakana W-Row & N (ワ・ヲ・ン)',
    script: 'katakana',
    description: 'Contrast ン (n) with ソ (so), and ワ (wa) with フ (fu).',
    kanaIds: ['k-wa', 'k-wo', 'k-n']
  },
  {
    id: 'k-stage-11',
    title: '24. Katakana Voiced (ガ・ザ・ダ・バ)',
    script: 'katakana',
    description: 'Voiced Katakana syllables with dakuten ゛.',
    kanaIds: [
      'k-ga', 'k-gi', 'k-gu', 'k-ge', 'k-go',
      'k-za', 'k-ji', 'k-zu', 'k-ze', 'k-zo',
      'k-da', 'k-dji', 'k-dzu', 'k-de', 'k-do',
      'k-ba', 'k-bi', 'k-bu', 'k-be', 'k-bo'
    ]
  },
  {
    id: 'k-stage-12',
    title: '25. Katakana Handakuten (パ・ピ・プ・ペ・ポ)',
    script: 'katakana',
    description: 'Semi-voiced Katakana syllables with handakuten ゜.',
    kanaIds: ['k-pa', 'k-pi', 'k-pu', 'k-pe', 'k-po']
  },
  {
    id: 'k-stage-13',
    title: '26. Katakana Contracted Yōon (キャ・シャ・チャ etc.)',
    script: 'katakana',
    description: 'Contracted syllables with small ャ, ュ, ョ.',
    kanaIds: [
      'k-kya', 'k-kyu', 'k-kyo',
      'k-gya', 'k-gyu', 'k-gyo',
      'k-sha', 'k-shu', 'k-sho',
      'k-ja', 'k-ju', 'k-jo',
      'k-cha', 'k-chu', 'k-cho',
      'k-nya', 'k-nyu', 'k-nyo',
      'k-hya', 'k-hyu', 'k-hyo',
      'k-bya', 'k-byu', 'k-byo',
      'k-pya', 'k-pyu', 'k-pyo',
      'k-mya', 'k-myu', 'k-myo',
      'k-rya', 'k-ryu', 'k-ryo',
      'k-dja', 'k-dju', 'k-djo'
    ]
  },
  {
    id: 'k-stage-14',
    title: '27. Extended Katakana for Foreign Sounds (ファ・ティ・シェ・ヴ etc.)',
    script: 'katakana',
    description: 'Special combinations used in loanwords to represent foreign phonemes.',
    kanaIds: [
      'k-fa', 'k-fi', 'k-fe', 'k-fo', 'k-fyu',
      'k-ti', 'k-di', 'k-tu', 'k-du',
      'k-she', 'k-je', 'k-che',
      'k-wi', 'k-we', 'k-wo-ext',
      'k-tsa', 'k-tsi', 'k-tse', 'k-tso',
      'k-vu', 'k-va', 'k-vi', 'k-ve', 'k-vo'
    ]
  },
  {
    id: 'mech-stage',
    title: '28. Special Kana Mechanics (っ・ッ・ー)',
    script: 'mechanics',
    description: 'Sokuon (geminate consonants) and Chōonpu (long vowel mark).',
    kanaIds: ['mech-h-sokuon', 'mech-k-sokuon', 'mech-k-choonpu']
  }
];
