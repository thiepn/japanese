# Kana Foundations Unit 22 — Katakana S-row (isolated prototype)

## Scope and teaching sequence
Units 01–19 establish hiragana, voice marks, mora timing, yōon, and integrated reading. Units 20–21 introduce katakana vowels and K-row. Unit 22 adds exactly five S-row forms: サ sa, シ shi (Kunrei si), ス su, セ se, ソ so; they map directly to hiragana さ・し・す・せ・そ. No ー, small kana, voiced katakana or T-row is introduced.

## 31 original first attempts, plus separate corrections
- Stage A (15): five teach/hide/recall introductions; five recognition multiple choices; full-word reading スシ (sushi), イス (chair), アシ (leg or foot); two script distinctions. Explicit checkpoint after 15.
- Stage B (16): full-word reading スイカ (watermelon), アサ (morning), イシ (stone), ウソ (lie), エサ (animal feed/bait), セキ (seat), サケ (salmon); five hiragana correspondences; four independently answerable word-meaning contrasts.
- All characters in all ten assessed words come from Unit 20's vowels, Unit 21's K-row, or Unit 22's S-row. No unseen katakana are silently assessed.
- Hepburn shi is taught; Kunrei si and its equivalent in スシ/アシ/イシ are accepted for type-in grading, but uncorrect sound or meaning distractors are not accepted.

## Source and spelling integrity
The University of Duisburg-Essen katakana reading workbook lists such practice spellings as スシ, イス, アシ, スイカ, アサ, イシ, ウソ, エサ, セキ. See https://www.uni-due.de/imperia/md/content/japan/katakana_handbook.pdf. Common everyday writing for native words like アサ / イシ / セキ is often kanji or hiragana, and the lessons state that explicitly. サケ for the salmon fish (鮭), not an alcoholic beverage, is also confirmed in Japanese sea-animal vocabulary at https://nihongo-net.com/2020/07/13/vocabulary-water-animal/.
Reading exercises do not certify lexical-frequency rank, spoken fluency or long-term knowledge.

## Data isolation, qualification and gates
New key: thiepn:kana-foundations:katakana-s-row:prototype-only:v1. First-attempt and correction records are distinct; checkpoint/pause/reload works and invalid saved snapshots refuse overwrite. Sequential localStorage compare-before-write is not atomic multi-tab protection. Existing Units 01–21, Account, FSRS, IndexedDB, StudyEvents, audio assets, main and production must remain unchanged. The only earlier-file edit is a forward link from the Unit 21 completion page.
Qualification: Node tests and six Playwright projects (desktop Chromium, Android emulation, 320px Chromium, desktop Firefox, desktop WebKit, iOS WebKit). Pending: native device and independent human Japanese, accessibility/screen-reader, and learner-retention acceptance.
