import type { KanaWord } from '../types/kana';

export const vocabularyList: KanaWord[] = [
  // --- Greetings & Daily Expressions (Hiragana) ---
  {
    id: 'w-arigatou',
    kana: 'ありがとう',
    romaji: 'arigatou',
    meaning: 'Thank you',
    script: 'hiragana',
    category: 'greetings',
    kanaIds: ['h-a', 'h-ri', 'h-ga', 'h-to', 'h-u'],
    notes: 'Common polite gratitude expression.'
  },
  {
    id: 'w-ohayou',
    kana: 'おはよう',
    romaji: 'ohayou',
    meaning: 'Good morning',
    script: 'hiragana',
    category: 'greetings',
    kanaIds: ['h-o', 'h-ha', 'h-yo', 'h-u'],
    notes: 'Morning greeting used with peers and family.'
  },
  {
    id: 'w-konnichiwa',
    kana: 'こんにちは',
    romaji: 'konnichiwa',
    meaning: 'Hello / Good afternoon',
    script: 'hiragana',
    category: 'greetings',
    kanaIds: ['h-ko', 'h-n', 'h-ni', 'h-chi', 'h-ha'],
    notes: 'Note: Topic particle は is pronounced "wa".'
  },
  {
    id: 'w-sayounara',
    kana: 'さようなら',
    romaji: 'sayounara',
    meaning: 'Goodbye',
    script: 'hiragana',
    category: 'greetings',
    kanaIds: ['h-sa', 'h-yo', 'h-u', 'h-na', 'h-ra'],
    notes: 'Formal or long-term farewell.'
  },
  {
    id: 'w-hai',
    kana: 'はい',
    romaji: 'hai',
    meaning: 'Yes',
    script: 'hiragana',
    category: 'greetings',
    kanaIds: ['h-ha', 'h-i'],
    notes: 'Polite affirmative response.'
  },
  {
    id: 'w-iie',
    kana: 'いいえ',
    romaji: 'iie',
    meaning: 'No',
    script: 'hiragana',
    category: 'greetings',
    kanaIds: ['h-i', 'h-i', 'h-e'],
    notes: 'Negative response.'
  },

  // --- Nature & Daily Life (Hiragana Basic Vowels & Consonants) ---
  {
    id: 'w-asa',
    kana: 'あさ',
    kanji: '朝',
    romaji: 'asa',
    meaning: 'Morning',
    script: 'hiragana',
    category: 'daily',
    kanaIds: ['h-a', 'h-sa'],
    notes: 'Uses vowels and S-row.'
  },
  {
    id: 'w-yoru',
    kana: 'よる',
    kanji: '夜',
    romaji: 'yoru',
    meaning: 'Night',
    script: 'hiragana',
    category: 'daily',
    kanaIds: ['h-yo', 'h-ru'],
    notes: 'Uses Y-row and R-row.'
  },
  {
    id: 'w-yama',
    kana: 'やま',
    kanji: '山',
    romaji: 'yama',
    meaning: 'Mountain',
    script: 'hiragana',
    category: 'nature',
    kanaIds: ['h-ya', 'h-ma'],
    notes: 'Classic pair: y-row and m-row.'
  },
  {
    id: 'w-kawa',
    kana: 'かわ',
    kanji: '川',
    romaji: 'kawa',
    meaning: 'River',
    script: 'hiragana',
    category: 'nature',
    kanaIds: ['h-ka', 'h-wa'],
    notes: 'Uses K-row and W-row.'
  },
  {
    id: 'w-sora',
    kana: 'そら',
    kanji: '空',
    romaji: 'sora',
    meaning: 'Sky',
    script: 'hiragana',
    category: 'nature',
    kanaIds: ['h-so', 'h-ra'],
    notes: 'Uses S-row and R-row.'
  },
  {
    id: 'w-ame',
    kana: 'あめ',
    kanji: '雨',
    romaji: 'ame',
    meaning: 'Rain',
    script: 'hiragana',
    category: 'nature',
    kanaIds: ['h-a', 'h-me'],
    notes: 'Vowel row + M-row.'
  },
  {
    id: 'w-hana',
    kana: 'はな',
    kanji: '花',
    romaji: 'hana',
    meaning: 'Flower',
    script: 'hiragana',
    category: 'nature',
    kanaIds: ['h-ha', 'h-na'],
    notes: 'Also means "nose" with different pitch/kanji.'
  },
  {
    id: 'w-sakura',
    kana: 'さくら',
    kanji: '桜',
    romaji: 'sakura',
    meaning: 'Cherry blossom',
    script: 'hiragana',
    category: 'nature',
    kanaIds: ['h-sa', 'h-ku', 'h-ra'],
    notes: 'Iconic symbol of Japan.'
  },
  {
    id: 'w-mizu',
    kana: 'みず',
    kanji: '水',
    romaji: 'mizu',
    meaning: 'Water',
    script: 'hiragana',
    category: 'daily',
    kanaIds: ['h-mi', 'h-zu'],
    notes: 'Combines M-row with voiced Z-row (ず).'
  },
  {
    id: 'w-ie',
    kana: 'いえ',
    kanji: '家',
    romaji: 'ie',
    meaning: 'House / Home',
    script: 'hiragana',
    category: 'daily',
    kanaIds: ['h-i', 'h-e'],
    notes: 'Pure vowels: i + e.'
  },
  {
    id: 'w-hon',
    kana: 'ほん',
    kanji: '本',
    romaji: 'hon',
    meaning: 'Book',
    script: 'hiragana',
    category: 'daily',
    kanaIds: ['h-ho', 'h-n'],
    notes: 'Practice with final moraic nasal ん.'
  },
  {
    id: 'w-hito',
    kana: 'ひと',
    kanji: '人',
    romaji: 'hito',
    meaning: 'Person',
    script: 'hiragana',
    category: 'daily',
    kanaIds: ['h-hi', 'h-to'],
    notes: 'H-row + T-row.'
  },
  {
    id: 'w-te',
    kana: 'て',
    kanji: '手',
    romaji: 'te',
    meaning: 'Hand',
    script: 'hiragana',
    category: 'daily',
    kanaIds: ['h-te'],
    notes: 'Single mora word.'
  },
  {
    id: 'w-me',
    kana: 'め',
    kanji: '目',
    romaji: 'me',
    meaning: 'Eye',
    script: 'hiragana',
    category: 'daily',
    kanaIds: ['h-me'],
    notes: 'Single mora word.'
  },
  {
    id: 'w-mimi',
    kana: 'みみ',
    kanji: '耳',
    romaji: 'mimi',
    meaning: 'Ear',
    script: 'hiragana',
    category: 'daily',
    kanaIds: ['h-mi', 'h-mi'],
    notes: 'Reduplicated mora: mi + mi.'
  },

  // --- Animals (Hiragana) ---
  {
    id: 'w-neko',
    kana: 'ねこ',
    kanji: '猫',
    romaji: 'neko',
    meaning: 'Cat',
    script: 'hiragana',
    category: 'animals',
    kanaIds: ['h-ne', 'h-ko'],
    notes: 'N-row + K-row.'
  },
  {
    id: 'w-inu',
    kana: 'いぬ',
    kanji: '犬',
    romaji: 'inu',
    meaning: 'Dog',
    script: 'hiragana',
    category: 'animals',
    kanaIds: ['h-i', 'h-nu'],
    notes: 'Vowel + N-row.'
  },
  {
    id: 'w-tori',
    kana: 'とり',
    kanji: '鳥',
    romaji: 'tori',
    meaning: 'Bird',
    script: 'hiragana',
    category: 'animals',
    kanaIds: ['h-to', 'h-ri'],
    notes: 'T-row + R-row.'
  },
  {
    id: 'w-sakana',
    kana: 'さかな',
    kanji: '魚',
    romaji: 'sakana',
    meaning: 'Fish',
    script: 'hiragana',
    category: 'animals',
    kanaIds: ['h-sa', 'h-ka', 'h-na'],
    notes: 'S-row + K-row + N-row.'
  },
  {
    id: 'w-saru',
    kana: 'さる',
    kanji: '猿',
    romaji: 'saru',
    meaning: 'Monkey',
    script: 'hiragana',
    category: 'animals',
    kanaIds: ['h-sa', 'h-ru'],
    notes: 'S-row + R-row.'
  },

  // --- Food & Drink (Hiragana & Katakana) ---
  {
    id: 'w-sushi',
    kana: 'すし',
    kanji: '寿司',
    romaji: 'sushi',
    meaning: 'Sushi',
    script: 'hiragana',
    category: 'food',
    kanaIds: ['h-su', 'h-shi'],
    notes: 'World-famous Japanese food.'
  },
  {
    id: 'w-ocha',
    kana: 'おちゃ',
    kanji: 'お茶',
    romaji: 'ocha',
    meaning: 'Green tea',
    script: 'hiragana',
    category: 'food',
    kanaIds: ['h-o', 'h-cha'],
    notes: 'Features contracted sound ちゃ (cha).'
  },
  {
    id: 'w-gohan',
    kana: 'ごはん',
    kanji: 'ご飯',
    romaji: 'gohan',
    meaning: 'Rice / Meal',
    script: 'hiragana',
    category: 'food',
    kanaIds: ['h-ga', 'h-ha', 'h-n'],
    notes: 'Features voiced ご (go) and final ん (n).'
  },
  {
    id: 'w-ringo',
    kana: 'りんご',
    kanji: '林檎',
    romaji: 'ringo',
    meaning: 'Apple',
    script: 'hiragana',
    category: 'food',
    kanaIds: ['h-ri', 'h-n', 'h-go'],
    notes: 'Features voiced ご (go).'
  },

  // --- Advanced Hiragana (Contracted / Dakuten / Double Consonant) ---
  {
    id: 'w-kyou',
    kana: 'きょう',
    kanji: '今日',
    romaji: 'kyou',
    meaning: 'Today',
    script: 'hiragana',
    category: 'daily',
    kanaIds: ['h-kyo', 'h-u'],
    notes: 'Features contracted きょ (kyo).'
  },
  {
    id: 'w-shashin',
    kana: 'しゃしん',
    kanji: '写真',
    romaji: 'shashin',
    meaning: 'Photograph',
    script: 'hiragana',
    category: 'daily',
    kanaIds: ['h-sha', 'h-shi', 'h-n'],
    notes: 'Features contracted しゃ (sha).'
  },
  {
    id: 'w-tomodachi',
    kana: 'ともだち',
    kanji: '友達',
    romaji: 'tomodachi',
    meaning: 'Friend',
    script: 'hiragana',
    category: 'daily',
    kanaIds: ['h-to', 'h-mo', 'h-da', 'h-chi'],
    notes: 'Features voiced だ (da).'
  },

  // --- Katakana Loanwords (Gairaigo) ---
  {
    id: 'w-pan',
    kana: 'パン',
    romaji: 'pan',
    meaning: 'Bread (from Portuguese pão)',
    script: 'katakana',
    category: 'loanwords',
    kanaIds: ['k-pa', 'k-n'],
    notes: 'Handakuten パ (pa) + ン (n).'
  },
  {
    id: 'w-basu',
    kana: 'バス',
    romaji: 'basu',
    meaning: 'Bus',
    script: 'katakana',
    category: 'loanwords',
    kanaIds: ['k-ba', 'k-su'],
    notes: 'Voiced バ (ba) + ス (su).'
  },
  {
    id: 'w-kamera',
    kana: 'カメラ',
    romaji: 'kamera',
    meaning: 'Camera',
    script: 'katakana',
    category: 'loanwords',
    kanaIds: ['k-ka', 'k-me', 'k-ra'],
    notes: 'Three basic Katakana morae.'
  },
  {
    id: 'w-terebi',
    kana: 'テレビ',
    romaji: 'terebi',
    meaning: 'Television (TV)',
    script: 'katakana',
    category: 'loanwords',
    kanaIds: ['k-te', 'k-re', 'k-bi'],
    notes: 'Voiced ビ (bi).'
  },
  {
    id: 'w-koohii',
    kana: 'コーヒー',
    romaji: 'koohii',
    meaning: 'Coffee',
    script: 'katakana',
    category: 'loanwords',
    kanaIds: ['k-ko', 'k-hi'],
    notes: 'Demonstrates Katakana long vowel mark ー (chōonpu).'
  },
  {
    id: 'w-aisu',
    kana: 'アイス',
    romaji: 'aisu',
    meaning: 'Ice / Ice cream',
    script: 'katakana',
    category: 'loanwords',
    kanaIds: ['k-a', 'k-i', 'k-su'],
    notes: 'Common food abbreviation in Japan.'
  },
  {
    id: 'w-keeki',
    kana: 'ケーキ',
    romaji: 'keeki',
    meaning: 'Cake',
    script: 'katakana',
    category: 'loanwords',
    kanaIds: ['k-ke', 'k-ki'],
    notes: 'Uses long vowel mark ー.'
  },
  {
    id: 'w-hoteru',
    kana: 'ホテル',
    romaji: 'hoteru',
    meaning: 'Hotel',
    script: 'katakana',
    category: 'loanwords',
    kanaIds: ['k-ho', 'k-te', 'k-ru'],
    notes: 'Essential travel term.'
  },
  {
    id: 'w-takushii',
    kana: 'タクシー',
    romaji: 'takushii',
    meaning: 'Taxi',
    script: 'katakana',
    category: 'loanwords',
    kanaIds: ['k-ta', 'k-ku', 'k-shi'],
    notes: 'Notice Katakana シ (shi).'
  },
  {
    id: 'w-toire',
    kana: 'トイレ',
    romaji: 'toire',
    meaning: 'Toilet / Restroom',
    script: 'katakana',
    category: 'loanwords',
    kanaIds: ['k-to', 'k-i', 'k-re'],
    notes: 'Everyday loanword.'
  },
  {
    id: 'w-nooto',
    kana: 'ノート',
    romaji: 'nooto',
    meaning: 'Notebook',
    script: 'katakana',
    category: 'loanwords',
    kanaIds: ['k-no', 'k-to'],
    notes: 'Uses long vowel mark ー.'
  },
  {
    id: 'w-amerika',
    kana: 'アメリカ',
    romaji: 'amerika',
    meaning: 'America (USA)',
    script: 'katakana',
    category: 'loanwords',
    kanaIds: ['k-a', 'k-me', 'k-ri', 'k-ka'],
    notes: 'Country names in modern Japanese use Katakana.'
  },
  {
    id: 'w-nihon',
    kana: 'にほん',
    kanji: '日本',
    romaji: 'nihon',
    meaning: 'Japan',
    script: 'hiragana',
    category: 'daily',
    kanaIds: ['h-ni', 'h-ho', 'h-n'],
    notes: 'Also pronounced "Nippon".'
  },
  {
    id: 'w-shatsu',
    kana: 'シャツ',
    romaji: 'shatsu',
    meaning: 'Shirt',
    script: 'katakana',
    category: 'loanwords',
    kanaIds: ['k-sha', 'k-tsu'],
    notes: 'Contrast Katakana ャ with ツ (tsu).'
  },
  {
    id: 'w-chokoreeto',
    kana: 'チョコレート',
    romaji: 'chokoreeto',
    meaning: 'Chocolate',
    script: 'katakana',
    category: 'loanwords',
    kanaIds: ['k-cho', 'k-ko', 'k-re', 'k-to'],
    notes: 'Uses contracted チョ (cho) and long vowel marks.'
  },
  {
    id: 'w-fooku',
    kana: 'フォーク',
    romaji: 'fooku',
    meaning: 'Fork',
    script: 'katakana',
    category: 'loanwords',
    kanaIds: ['k-fo', 'k-ku'],
    notes: 'Features extended Katakana フォ (fo).'
  },
  {
    id: 'w-paatii',
    kana: 'パーティー',
    romaji: 'paatii',
    meaning: 'Party',
    script: 'katakana',
    category: 'loanwords',
    kanaIds: ['k-pa', 'k-ti'],
    notes: 'Features extended Katakana ティ (ti).'
  }
];

export const vocabularyMap = new Map<string, KanaWord>(
  vocabularyList.map(w => [w.id, w])
);

/**
 * Filter words to only those where all component kana have been introduced/learned
 */
export function filterWordsByLearnedKana(
  words: KanaWord[],
  learnedKanaIds: Set<string>
): KanaWord[] {
  return words.filter(word => {
    // If word has no kanaIds recorded, skip
    if (word.kanaIds.length === 0) return false;
    // Check if every kana in word is learned
    return word.kanaIds.every(id => learnedKanaIds.has(id));
  });
}
