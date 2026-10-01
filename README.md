# Japanese

A unified, local-first Japanese learning system in the THIEPN ecosystem.

## Product contract

Course, reviews, reading, listening, writing and future AI features must all emit evidence into the same learner state rather than maintaining independent progress systems.

Primary product surfaces: **Today · Learn · Immerse · Library · Progress**.

## Current phase

**P2 — Grammar, Sentence Knowledge & Structured A1 Course has a production-ready core implementation.**

The app now contains one connected Foundation → A1 learning path:

- reusable Study Player for lessons, reviews, listening, grammar and sentence work;
- complete hiragana/katakana Foundation with multi-skill evidence;
- canonical vocabulary, senses, kanji relationships and source-provenanced pronunciation audio;
- canonical grammar objects with mental models, formation, uses, prerequisites and contrast relationships;
- first-class sentence objects linked back to lexemes and grammar concepts;
- independent grammar comprehension/form-selection and sentence comprehension/production mastery;
- eight capability-centered A1 course units backed by Can-do descriptors rather than a disconnected grammar list;
- soft prerequisite guidance: units can be recommended, learning, mastered or challenging without hard-locking free study;
- one Today queue combining due reviews, Foundation practice and the current A1 course;
- course progress derived from learner evidence rather than lesson-completion flags;
- local SQLite search across vocabulary, kanji, grammar and sentences;
- persistent account-scoped learner data, FSRS traces, PWA/offline support and mobile certification.

Current core content package: **v0.3.0** with 36 starter lexemes, 15 grammar concepts, 22 linked A1 sentences, 8 Can-do descriptors and 8 structured A1 units.

The next content-development step is **P2.5 — A1 Breadth, Conjugation & Assessment Completion**. It should expand this architecture into broader A1 communicative coverage rather than creating new parallel systems.

See `docs/P1_ACCEPTANCE.md`, `docs/P2_ACCEPTANCE.md`, `docs/P1_5_MOBILE_CERTIFICATION.md`, `docs/ROADMAP.md`, `docs/ARCHITECTURE.md` and `docs/THIRD_PARTY_NOTICES.md`.
