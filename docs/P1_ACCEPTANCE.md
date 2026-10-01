# P1 — Foundation Learning Engine & Study Player

Status: in progress

## Acceptance gates

- [x] reusable Study Player domain contract exists
- [x] choice and typed-answer prompt modes exist
- [x] lesson/explanation cards are integrated into the same session player
- [x] answers emit immutable StudyEvents
- [x] StudyEvents and memory scheduling share the same primary target / skill dimension / cue family
- [x] FSRS traces persist locally per AccountId
- [x] Today creates one bounded queue from due + unseen + application items
- [x] Learn launches the same Study Player instead of a separate course engine
- [x] all 46 basic hiragana exist in the ordered foundation curriculum
- [x] early kana-only vocabulary bridges prevent a long symbol-only onboarding sequence
- [x] reverse-cue kana practice uses a separate skill dimension and memory trace
- [x] common alternate romaji answers are represented for し / ち / つ / ふ / を
- [x] Study Player flow is included in browser E2E coverage
- [ ] hiragana dakuten / handakuten / yōon / small-っ curriculum
- [ ] complete katakana foundation curriculum
- [ ] Japanese typed-answer equivalence rules beyond basic romaji aliases
- [ ] first production vocabulary entity set with source provenance
- [ ] kanji-in-vocabulary teaching surface
- [ ] learner projection is visible in Progress beyond memory/activity counts
- [ ] P1 real-device mobile UX pass

## P1 milestone

A complete beginner can install the app, learn first Japanese through one Study Player, leave, return later, and receive correctly scheduled continuation from the same learner model.
