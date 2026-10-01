# P1 — Foundation Learning Engine & Study Player

Status: in progress

## P1.3 — Complete Kana Foundation & Real Mastery

- [x] reusable Study Player domain contract exists
- [x] choice and typed-answer prompt modes exist
- [x] lesson/explanation cards are integrated into the same session player
- [x] answers emit immutable StudyEvents
- [x] StudyEvents and memory scheduling share primary target / skill dimension / cue family
- [x] FSRS traces persist locally per AccountId
- [x] full hiragana and katakana foundation including marks/combinations is represented
- [x] recognition, typed reading recall and form selection use independent evidence/memory traces
- [x] learner mastery is replayed from immutable StudyEvents rather than inferred from activity counts

## P1.4 — Production Vocabulary & Kanji Integration

- [x] bridge-only words are replaced by one canonical starter lexicon
- [x] starter content has canonical lexeme, sense and kanji entities
- [x] every public starter entity carries source provenance
- [x] public content validation checks per-entity provenance against the export manifest
- [x] canonical lexemes, senses, kanji and word↔kanji relations persist in the local SQLite content database
- [x] Library search is generated from canonical content rather than a hard-coded search seed
- [x] 34 starter words are ordered for early Foundation/A1 use
- [x] kanji is introduced inside vocabulary lessons rather than as isolated reading lists
- [x] whole-word readings such as 今日 / きょう are not falsely segmented into character readings
- [x] vocabulary meaning recognition, reading recall and active use are separate learner dimensions
- [x] reading recall unlocks after meaning evidence; active use unlocks after meaning + reading evidence
- [x] StudyEvents retain content source and content-version provenance
- [x] Today protects due reviews and interleaves bounded kana, vocabulary and application work
- [x] Progress reports kana and vocabulary mastery separately
- [x] first-exposure vocabulary lessons show reading, meaning, word class and kanji-in-word relationships

## Remaining P1 gates

- [ ] listening/audio evidence enters the same learner state
- [ ] pronunciation/perception tasks for mora length, っ / ッ and ん are wired to audio
- [ ] P1 real-device mobile UX pass
- [ ] P1 release-candidate burn-in after audio/mobile integration

## P1 milestone

A complete beginner can install the app, learn first Japanese through one Study Player, leave, return later, and receive correctly scheduled continuation from the same learner model.
