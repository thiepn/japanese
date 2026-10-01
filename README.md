# Japanese

A unified, local-first Japanese learning system in the THIEPN ecosystem.

## Product contract

Course, reviews, reading, listening, writing and future AI features must all emit evidence into the same learner state rather than maintaining independent progress systems.

Primary product surfaces: **Today · Learn · Immerse · Library · Progress**.

## Current phase

**P1.5 — Foundation Audio, Listening & Mobile Certification is implementation-complete.** Final physical-device certification is tracked separately; the next development phase is **P2 — Grammar, Sentence Knowledge & Structured A1 Course**.

The current learning foundation includes:

- one reusable Study Player for lessons, reviews and listening;
- complete hiragana/katakana coverage with FSRS-backed multi-skill evidence;
- canonical vocabulary, senses, kanji relationships and source-provenanced audio;
- independent meaning, reading, listening and active-use mastery;
- word-linked kanji teaching rather than isolated reading lists;
- native word audio with replay, slower playback and shadowing;
- explicit mora-timing perception for っ, ッ, vowel length and ん;
- a bounded Today queue that pauses new material under significant review debt;
- persistent local SQLite content/search, browser audio caching and account-scoped learner data;
- desktop + mobile Chromium PWA certification in CI with repeated burn-in.

See `docs/P1_ACCEPTANCE.md`, `docs/P1_5_MOBILE_CERTIFICATION.md`, `docs/ROADMAP.md`, `docs/ARCHITECTURE.md` and `docs/THIRD_PARTY_NOTICES.md`.
