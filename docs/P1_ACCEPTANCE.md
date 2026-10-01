# P1 — Foundation Learning Engine & Study Player

Status: implementation complete; physical-device certification pending

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

## P1.5 — Foundation Audio, Listening & Mobile Certification

- [x] production vocabulary audio is represented as canonical, source-provenanced content
- [x] every starter lexeme has a pinned pronunciation recording
- [x] audio licensing/attribution is registered and documented
- [x] listening evidence enters the same StudyEvent → learner model → FSRS path
- [x] vocabulary listening recognition is independent from written meaning, reading and active use
- [x] listening items unlock only after prerequisite meaning evidence
- [x] perception tasks cover hiragana っ, katakana ッ, vowel length and moraic ん
- [x] Study Player supports Play, Replay, Slower and Shadow ×2 without exposing the answer first
- [x] audio source/version metadata is retained in StudyEvent metadata
- [x] session audio can be cached in browser Cache Storage for later offline playback
- [x] audio prefetch does not block opening the study session
- [x] Today mixes listening with other practice without allowing audio to flood the queue
- [x] Progress exposes kana/mora listening and vocabulary listening separately
- [x] mobile layout accounts for safe areas, compact heights and touch targets
- [x] CI runs desktop, Pixel-profile and compact-touch Playwright projects
- [x] CI repeats the browser/PWA certification twice as a release-candidate burn-in
- [ ] physical Android/PWA audio + interruption pass recorded in `docs/P1_5_MOBILE_CERTIFICATION.md`

## P1 milestone

The implementation milestone is complete when CI is green. Final device certification additionally requires the one physical-device pass above.

A complete beginner can install the app, learn first Japanese through one Study Player, leave, return later, and receive correctly scheduled continuation from the same learner model.
