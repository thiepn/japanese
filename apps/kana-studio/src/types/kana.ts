import type { Card, ReviewLog } from 'ts-fsrs';

export type KanaScript = 'hiragana' | 'katakana';

export type KanaCategory = 
  | 'basic' 
  | 'voiced' 
  | 'semi-voiced' 
  | 'contracted' 
  | 'extended' 
  | 'mechanic';

export interface KanaItem {
  id: string; // unique stable ID: e.g. "h-a", "k-kya", "k-fa"
  script: KanaScript;
  category: KanaCategory;
  kana: string; // Unicode glyph(s), e.g. "あ", "きゃ", "ファ"
  romaji: string; // Canonical Hepburn romaji: "a", "kya", "fa"
  aliases?: string[]; // Allowed alternate inputs: ["si"] for "shi", etc.
  group: string; // e.g. "vowels", "k-row", "ky-row", "f-row"
  order: number; // progressive learning order
  row?: string; // e.g. "K", "S", "T", or "vowel"
  column?: 'a' | 'i' | 'u' | 'e' | 'o' | 'ya' | 'yu' | 'yo' | 'other';
  construction?: {
    baseKana: string;
    modifierKana: string;
    explanation: string;
  };
  confusables?: string[]; // IDs or characters of confusable kana
  explanation?: string; // Linguistically accurate note
  isUncommon?: boolean; // For ぢゃ, ヂャ etc.
}

export interface ConfusablePair {
  id: string;
  char1: string;
  char2: string;
  romaji1: string;
  romaji2: string;
  script: KanaScript | 'contrast';
  distinction: string;
  tip: string;
}

export interface StoredCardData {
  cardId: string; // maps to KanaItem.id
  card: Card; // ts-fsrs Card object (serialized dates)
  direction: 'kana-to-romaji' | 'romaji-to-kana';
  lastReviewedAt?: string;
  firstReviewedAt?: string;
  introducedAt?: string;
  totalReviews: number;
  totalLapses: number;
  isSuspended?: boolean; // Card suspended from review queue
}

export interface KanaWord {
  id: string;
  kana: string; // e.g. "あさ", "すし", "ねこ", "コーヒー"
  kanji?: string; // e.g. "朝", "寿司", "猫", "珈琲"
  romaji: string; // e.g. "asa", "sushi", "neko", "kōhī" / "koohii"
  meaning: string; // e.g. "Morning", "Sushi", "Cat", "Coffee"
  script: KanaScript;
  category: 'greetings' | 'daily' | 'food' | 'nature' | 'loanwords' | 'animals';
  kanaIds: string[]; // component kana IDs, e.g. ["h-a", "h-sa"]
  notes?: string;
}

export interface ReviewFilterOptions {
  script?: 'hiragana' | 'katakana' | 'both';
  category?: 'all' | 'basic' | 'voiced' | 'semi-voiced' | 'contracted' | 'confusables' | 'custom';
  row?: string; // e.g. "vowel", "K", "S", "T", "N", "H", "M", "Y", "R", "W", "G", "Z", "D", "B", "P"
  customKanaIds?: string[];
  cramMode?: boolean; // Practice ahead without affecting SRS schedule
}

export interface SrsForecast {
  dueNow: number;
  dueToday: number;
  dueTomorrow: number;
  due3Days: number;
  dueWeek: number;
  matureCount: number; // Cards with stability > 21 days
  totalIntroduced: number;
  retentionRate: number; // e.g. 90%
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  preferredScript: 'hiragana' | 'katakana' | 'both';
  dailyNewLimit: number;
  enableAudio: boolean;
  enableReversePractice: boolean;
  soundVolume: number;
}

export interface SessionStats {
  cardsReviewed: number;
  correctAnswers: number;
  incorrectAnswers: number;
  scheduledLater: number;
  startTime: number;
  endTime?: number;
}

export interface DeckStatistics {
  dueNowCount: number;
  newAvailableCount: number;
  inLearningCount: number;
  inReviewCount: number;
  totalIntroduced: number;
  hiraganaIntroduced: number;
  hiraganaTotal: number;
  katakanaIntroduced: number;
  katakanaTotal: number;
  nextDueTime: Date | null;
}


