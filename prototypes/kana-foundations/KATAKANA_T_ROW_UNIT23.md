# Kana Foundations Unit 23 — Katakana T-row (isolated, draft)

## Curriculum audit
Units 01–19 cover foundational hiragana and integrated reading. Unit 20 teaches vowels (ア・イ・ウ・エ・オ), Unit 21 K-row (カ・キ・ク・ケ・コ), Unit 22 S-row (サ・シ・ス・セ・ソ). This unit adds exactly タ ta / チ chi / ツ tsu / テ te / ト to, corresponding to た・ち・つ・て・と. New ー, small ッ, ン, voiced katakana, N-row, and remaining T-row combinations are NOT taught.

## Romanization fairness and visual disambiguation
Hepburn: チ chi, ツ tsu; Kunrei: チ ti, ツ tu. Accept the valid Kunrei equivalents in typed recall and word reading (クツ kutu, ツクエ tukue, コツ kotu, キツツキ kitutuki, チカチカ tikatika, チクチク tikutiku) without marking wrong consonants correct. The multiple-choice recognition remains consistently Hepburn. Explicit contrast between シ (shi, Unit 22) and ツ (tsu, new). Japan romanization sources: University of Tokyo https://park.itc.u-tokyo.ac.jp/eigo/UT-Komaba-Romanization-of-Japanese-v1.pdf and University of Passau-hosted Meguro Language Center stroke reference https://www.uni-passau.de/fileadmin/dokumente/hsg/nippon/Skripte/HiraganaKatakanaWorkSheet.pdf.

## 31 original first attempts + bounded correction evidence
Stage A (15): 5 teaching/active recall, 5 five-choice recognition, 3 word readings (タコ octopus, クツ shoes, チカチカ flickering), and 2 katakana/hiragana script choices. Checkpoint at 15 with required acknowledgment.
Stage B (16): 7 word readings (ツクエ desk, トケイ clock/watch, コツ knack/tip, テコ lever, キツツキ woodpecker, チクチク pricking, タケ bamboo), five hiragana transfers, one シ/ツ discrimination, three genuine word-meaning contrasts.
Every assessed word is constructed ONLY from the 20 katakana actually taught in Units 20–23. All meanings refer to real Japanese words; some native words such as ツクエ / トケイ / タケ more often appear in kanji or hiragana in ordinary prose. チカチカ and チクチク are established mimetic forms; キツツキ contains two ordinary ツ, not small ッ.
First-attempt records (including assisted reveals and wrong answers) are immutable within the lesson's state machine; correction records never overwrite them. Export is local JSON only.

## Data isolation and qualification gates
Dedicated storage key: thiepn:kana-foundations:katakana-t-row:prototype-only:v1. Invalid or tampered saved snapshots are refused; compare-before-write detects sequential stale-tab changes but is NOT an atomic multi-tab transaction.
Previous Units 01–22, Account, FSRS, old learner records, IndexedDB, audio, StudyEvents, production and main are read-only. One Unit 22 completion link is modified solely to navigate forward. Automated scope: Node state/lexical evidence and six Playwright browser profiles (desktop Chromium, Android, 320px Chromium, desktop Firefox, desktop WebKit, iOS emulation); no release or audio approval. Human Japanese editorial review, accessibility screen-reader, physical device operation and delayed learner performance remain unqualified.
