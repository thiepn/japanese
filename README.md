# Japanese

A unified, local-first Japanese learning system in the THIEPN ecosystem.

## Product contract

Course, reviews, reading, listening, writing and future AI features must all emit evidence into the same learner state rather than maintaining independent progress systems.

Primary product surfaces: **Today · Learn · Immerse · Library · Progress**.

## Current phase

**P2.5 — A1 Breadth, Conjugation & Assessment Completion is implemented.**

The app now contains one connected Foundation → A1 learning path:

- reusable Study Player for lessons, reviews, listening, grammar, conjugation, sentences and assessments;
- complete hiragana/katakana Foundation with multi-skill evidence;
- a 145-word beginner lexicon with canonical senses and source provenance;
- 37 canonical grammar concepts with mental models, formations, uses, prerequisites and contrasts;
- a generated conjugation model for core verb and adjective paradigms rather than disconnected surface-form facts;
- 89 linked A1 sentences for controlled comprehension and production transfer;
- 20 capability-centered A1 units backed by Can-do descriptors;
- soft prerequisite guidance without hard-locking free study;
- delayed unit checks that unlock after essential first-pass evidence and a 20-hour spacing interval;
- a 15-task A1 milestone reporting reading, listening, spoken interaction, spoken production and writing separately;
- one Today queue and one StudyEvent / learner-state model across Foundation, course, review and assessment;
- local SQLite search across vocabulary, kanji, grammar and sentences;
- persistent account-scoped learner data, FSRS traces, PWA/offline support and mobile certification.

Current core content package: **v0.4.0** with 145 lexemes, 37 grammar concepts, 89 linked A1 sentences, 20 Can-do descriptors and 20 structured A1 units.

The milestone's spoken interaction and spoken production tasks are currently controlled **say-then-type proxies**. P2.5 does not claim pronunciation or free-speech scoring.

The next development phase is **P3 — Reader, Connected Listening & A1→A2 Immersion Bridge**.

See `docs/P1_ACCEPTANCE.md`, `docs/P2_ACCEPTANCE.md`, `docs/P2_5_ACCEPTANCE.md`, `docs/P1_5_MOBILE_CERTIFICATION.md`, `docs/ROADMAP.md`, `docs/ARCHITECTURE.md` and `docs/THIRD_PARTY_NOTICES.md`.
