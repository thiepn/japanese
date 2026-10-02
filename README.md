# Japanese

A unified, local-first Japanese learning system in the THIEPN ecosystem.

## Product contract

Course, reviews, reading, listening, writing and future AI features must all emit evidence into the same learner state rather than maintaining independent progress systems.

Primary product surfaces: **Today · Learn · Immerse · Library · Progress**.

## Current phase

**P3 — Reader, Connected Listening & A1→A2 Immersion Bridge is implemented.**

The app now contains one connected Foundation → A1 → immersion learning system:

- reusable Study Player for lessons, reviews, listening, grammar, conjugation, sentences and assessments;
- complete hiragana/katakana Foundation with multi-skill evidence;
- a 145-word beginner lexicon with canonical senses and source provenance;
- 37 canonical grammar concepts with mental models, formations, uses, prerequisites and contrasts;
- a generated conjugation model for core verb and adjective paradigms;
- 89 linked A1 sentences and 20 capability-centered A1 units;
- delayed unit checks plus a five-area A1 milestone assessment;
- 8 canonical graded texts spanning A1, A1+ and A2-entry support levels;
- a graph-aware reader with optional reading hints, per-sentence translation, word lookup and canonical grammar support;
- one-action vocabulary mining whose pending words return to the unified Today queue;
- connected whole-text Japanese playback through the device speech-synthesis voice, plus separate reading and listening checks;
- immersion readiness and text mastery derived from the same StudyEvents and learner projections used by the course;
- local SQLite search across vocabulary, kanji, grammar, sentences and graded texts;
- persistent account-scoped learner data, FSRS traces, PWA/offline reading support and mobile certification.

Current core content package: **v0.5.0** with 145 lexemes, 37 grammar concepts, 89 linked A1 sentences, 20 Can-do descriptors, 20 structured A1 units and 8 graded immersion texts.

P3 deliberately does **not** claim full unrestricted Japanese morphology or native-speaker connected audio. The reader recognizes canonical forms plus the app's generated core inflections; connected passage playback currently uses a Japanese device speech-synthesis voice when available.

The next development phase is **P4 — A2 Expansion, Native Audio & Authentic-Input Pipeline**.

See `docs/P1_ACCEPTANCE.md`, `docs/P2_ACCEPTANCE.md`, `docs/P2_5_ACCEPTANCE.md`, `docs/P3_ACCEPTANCE.md`, `docs/P1_5_MOBILE_CERTIFICATION.md`, `docs/ROADMAP.md`, `docs/ARCHITECTURE.md` and `docs/THIRD_PARTY_NOTICES.md`.
