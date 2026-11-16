# Kana Foundations Unit 26 — Katakana M-row (isolated prototype)

## Curriculum and scope
Units 01–19 established hiragana and integrated reading. Unit 20 introduced katakana vowels, 21 K-row, 22 S-row, 23 T-row, 24 N-row and 25 H-row. Unit 26 adds exactly マ ma / ミ mi / ム mu / メ me / モ mo, matched with ま・み・む・め・も. This brings the cumulative count to 35 distinct standard katakana. No new ン, ー, ッ, voiced forms, Y-row or R-row is assessed.

## Word provenance and teaching precision
University of Duisburg-Essen, Rafael E. Beermann, Katakana Handbook (2006), p. 6 Exercise 8, explicitly lists マメ (bean), ムシ (insect), モモ (peach), ムネ (breast), among other words written in full katakana for beginner reading practice: https://www.uni-due.de/imperia/md/content/japan/katakana_handbook.pdf. The same workbook explains that native words commonly use kanji or hiragana in ordinary prose, even when written in katakana for reading practice.
Additional reading-practice resources provide メモ (memo) and マスク (mask): https://www.kikokusha-center.or.jp/resource/kyozai/kikin/sample/pdf/center/rkata3-s.pdf.
The remaining words are genuine Japanese words: ミミ (ear, usually 耳), ママ (informal mom), マウス (computer mouse), モチ (mochi rice cake, usually 餅/もち).
In an explicitly fruit-market context, モモ means peach, while it can mean chicken thigh on poultry menus; ムネ in poultry context refers to chicken breast meat. A Japanese poultry-industry source documents both labels: https://www.nipponham.co.jp/recipes/meat/knowledge/poultry/.
No word contains a character beyond the 35 katakana taught through Unit 26. This is a script-decoding lesson, not a claim that all displayed katakana are the most frequent writing of each lexical item.

## 31 first attempts and protected correction evidence
Stage A (15): five explicit teach/hide/recall introductions; five five-choice recognition prompts; three fully decodable word readings マメ, ミミ, ムシ; two script contrasts.
Stage B (16): seven fully decodable words メモ, モモ, マスク, ママ, マウス, モチ, ムネ; five katakana-to-hiragana correspondences; four context-specific word-meaning contrasts. Prior standard romanization alternatives are accepted for ムシ (musi), モチ (moti); the new M-row itself has no alternative Hepburn/Kunrei spellings.
Persist to the new localStorage namespace thiepn:kana-foundations:katakana-m-row:prototype-only:v1 only. Immutable original first attempts, assisted reveal flags, separate correction records, explicit checkpoint acknowledgment and pause/reload recovery follow the earlier engine. Tampered snapshots fail validation and sequential conflicting writes are refused. LocalStorage check-then-set does not provide an atomic cross-tab transaction or guaranteed transactional durability.

## Preservation and acceptance boundaries
Only Unit 25's results screen gets a forward link to Unit 26. All other older lesson engines and learner records, Account/FSRS, IndexedDB, StudyEvents, audio, main, and production are unchanged. Automated acceptance requires the exact HEAD Node suite and six Playwright profiles (desktop Chromium, Android-emulated Chromium, 320px compact Chromium, desktop Firefox, desktop WebKit, iOS-emulated WebKit). Japanese human proofreading, physical hardware, screen-reader accessibility, listening/speaking, and delayed-retention testing remain distinct and NOT_TESTED. Never merge, deploy or publish under this task.
