# Japanese

A unified, local-first Japanese learning system in the THIEPN ecosystem.

## Product contract

Course, reviews, reading, listening, writing and future AI features must all emit evidence into the same learner state rather than maintaining independent progress systems.

Primary product surfaces: **Today · Learn · Immerse · Library · Progress**.

## Current phase

**P1.4 — Production Vocabulary & Kanji Integration is implemented. Next: P1.5 — Foundation Audio, Listening & Mobile Certification.**

The current learning foundation includes:

- one reusable Study Player for lessons and reviews;
- complete hiragana/katakana coverage with FSRS-backed multi-skill evidence;
- event-derived mastery rather than independent feature progress;
- a canonical source-provenanced starter lexicon with senses and kanji relations;
- kanji taught through vocabulary instead of isolated reading lists;
- staged vocabulary mastery: meaning → reading → active use;
- a bounded Today queue that pauses new material under significant review debt;
- persistent local SQLite content/search and account-scoped learner data;
- offline/PWA browser verification and source/licensing validation.

See `docs/P1_ACCEPTANCE.md`, `docs/ROADMAP.md` and `docs/ARCHITECTURE.md`.
