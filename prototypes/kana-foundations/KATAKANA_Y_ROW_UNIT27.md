# Kana Foundations Unit 27 — Katakana Y-row (isolated prototype)

## Cumulative scope and proper three-character row
Units 01–19 taught hiragana and integrated reading. Units 20–26 taught 35 basic katakana: vowels, K, S, T, N, H, M rows. Unit 27 introduces *exactly three* full-size standard Y-row characters: ヤ ya (や), ユ yu (ゆ), ヨ yo (よ), making 38 taught basic katakana. The modern basic syllabary has empty yi/ye positions and no additional full-size Y-row letters. Small ャ/ュ/ョ are separate combination kana, not assessed here, nor are ー, ッ, ン, voiced kana or untaught R/W rows.

Official Japanese Agency for Cultural Affairs syllabary: https://www.bunka.go.jp/seisaku/kokugo_nihongo/kyoiku/seikatsusha/h25_nihongo_program_a/pdf/a_24.pdf
Additional standard kana chart https://www.bunka.go.jp/seisaku/kokugo_nihongo/kyoiku/seikatsusha/h24_nihongo_program_a/pdf/a_44_1.pdf

## Proportionate 22 independently graded first attempts
Stage A has **11**: 3 teach/hide/recall introductions, 3 three-choice sound recognitions (no invented yi/ye), 3 full-word readings ヤマ (mountain, 山), ユキ (snow, 雪), ヨコ (side/horizontal, 横), and 2 katakana/hiragana script contrasts. Checkpoint at task index 11 requires explicit acknowledgment before Stage B.
Stage B has **11**: 5 full-word readings ユカタ (yukata, 浴衣), ヤキイモ (roasted sweet potato, 焼き芋), ヤマイモ (Japanese yam, 山芋), ヤサイ (vegetables, 野菜), ヤネ (roof, 屋根), then 3 hiragana correspondences and 3 contextual meaning contrasts. Reading of ヤキイモ is yakiimo (ヤ・キ・イ・モ, four complete morae), not a word containing small vowels, ッ or ー.

These are *genuine Japanese words*, but this does NOT imply their exercise katakana spelling is their normal everyday form. ヤマ, ユキ, ヨコ, ヤサイ, ヤネ are usually written 山, 雪, 横, 野菜 and 屋根 (or hiragana). ユカタ may appear in katakana on retail headings; ヤキイモ and ヤマイモ may appear as food/produce signage. Their kanji are given as context but are not tested.

Word evidence: Japan Foundation Y-row chart as above; JPDB vocabulary entry for 野菜 https://jpdb.io/vocabulary/1537370/%E3%82%84%E3%81%95%E3%81%84 and for 焼き芋 https://jpdb.io/search?q=%E7%84%BC%E3%81%8D%E8%8A%8B ; authoritative lexical meanings are explicitly taught, not invented lexical forms.

## First attempts, correction evidence, isolation and gates
Use dedicated key `thiepn:kana-foundations:katakana-y-row:prototype-only:v1` only, with immutable first-attempt records, separate correction attempts, true assisted-reveal indicators, explicit checkpoint and pause/resume. Invalid snapshots fail closed without overwriting their bytes. Compare-before-write rejects observed sequential cross-tab changes but is not a transactional or atomic cross-tab CAS.
Keep Units 01–26 engines, historical progress, Account, FSRS, StudyEvents, IndexedDB, audio, production and main unchanged. Only Unit 26's completed screen gets a forward navigation link.
Run exact-head Node and six-browser Playwright regression across desktop Chromium, Android-emulated Chromium, 320px Chromium, desktop Firefox, desktop WebKit and iOS WebKit emulation. No merge/deploy/release. Japanese human proofreading, physical devices, screen-reader accessibility, speech/listening and delayed retention remain NOT_TESTED.
