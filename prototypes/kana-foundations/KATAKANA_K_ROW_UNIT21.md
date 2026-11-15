# Kana Foundations Unit 21 — Katakana K-row (isolated prototype)

## Curriculum provenance and scope
Prior units 01–10 introduced basic hiragana; 11 reviewed readings; 12–14 taught voiced marks; 15 taught sokuon; 16–18 introduced yōon; 19 checked integrated hiragana reading; 20 introduced katakana ア・イ・ウ・エ・オ with 23 first attempts. Unit 21 adds カ・キ・ク・ケ・コ, mapped to already known hiragana か・き・く・け・こ. It does not introduce long-vowel ー, small katakana, voiced katakana, or any S-row letters.

## First-attempt plan (27)
Stage A: five actively introduced K-row forms, five five-choice romaji recognition items, three completely decodable words カキ/キク/コケ and two script contrasts = 15 first answers. Checkpoint persists and requires explicit continuation.
Stage B: four completely decodable loanwords キウイ (kiwifruit), ココア (cocoa), カカオ (cacao), エコ (eco); five hiragana correspondence contrasts; three word-meaning contrasts = 12 more answers.
Every letter of every assessed word comes from Unit 20's vowels or Unit 21's K-row; no untaught kana are graded.

The nature terms are real, though less central to beginning conversational vocabulary: カキ is oyster in seafood context, but the same reading can mean persimmon in a different context; キク is chrysanthemum and コケ is moss, often written with kanji or hiragana elsewhere. Never misrepresent these as necessarily the most frequent beginner words. The cocoa/cacao distinction is meaningful.

## Evidence and release constraints
Use local-only `thiepn:kana-foundations:katakana-k-row:prototype-only:v1`. Preserve all first answers and correction attempts separately, allow checkpoint pause/reload, reject invalid saved snapshots, refuse overwriting data changed by another sequential writer. Browser localStorage comparisons are **not** a transactional conflict-resolution system.
Do not modify old lesson engines/records, Account, FSRS, IndexedDB, audio, StudyEvents, sync, main or production. One Unit 20 result link is updated to move forward.
Automated Node tests and six Playwright projects (desktop Chromium, Android/mobile Chromium, compact 320px, desktop Firefox, desktop WebKit, iOS WebKit) assess written decoding, correctness, reloading, isolation and user flows. They do not establish pronunciation, listening, delayed learning retention, real screen-reader or human-device acceptance.
