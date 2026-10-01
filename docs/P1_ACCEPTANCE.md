# P1 — Foundation Learning Engine & Study Player

Status: in progress

## P1.3 — Complete Kana Foundation & Real Mastery

- [x] reusable Study Player domain contract exists
- [x] choice and typed-answer prompt modes exist
- [x] lesson/explanation cards are integrated into the same session player
- [x] answers emit immutable StudyEvents
- [x] StudyEvents and memory scheduling share primary target / skill dimension / cue family
- [x] FSRS traces persist locally per AccountId
- [x] Today creates one bounded queue from due + unseen + application items
- [x] Learn launches the same Study Player instead of a separate course engine
- [x] all 46 basic hiragana are represented
- [x] hiragana dakuten / handakuten / yōon / small-っ are represented
- [x] all 46 basic katakana are represented
- [x] katakana dakuten / handakuten / yōon / small-ッ / long-vowel mark are represented
- [x] common Hepburn/Kunrei typed-answer equivalents are normalized
- [x] recognition, typed reading recall and form selection use independent evidence/memory traces
- [x] early kana-only vocabulary bridges prevent a long symbol-only onboarding sequence
- [x] learner mastery is replayed from immutable StudyEvents rather than inferred from activity counts
- [x] Progress exposes overall/script/skill mastery, confidence, accuracy and mature-skill counts
- [x] Study Player flow is covered by browser E2E tests

## Remaining P1 gates

- [ ] first production vocabulary entity set with source provenance
- [ ] kanji-in-vocabulary teaching surface
- [ ] listening/audio evidence enters the same foundation learner state
- [ ] P1 real-device mobile UX pass

## P1 milestone

A complete beginner can install the app, learn first Japanese through one Study Player, leave, return later, and receive correctly scheduled continuation from the same learner model.
