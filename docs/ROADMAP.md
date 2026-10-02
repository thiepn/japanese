# Roadmap

## P0 — Production Foundation, Contracts & Architecture Freeze

**Complete.** Repository structure, shared contracts, StudyEvent model, learner reducer, FSRS adapter, account-scoped IndexedDB state, Core Sync v1 mapping, persistent browser SQLite content/search, source/licensing validation, PWA/offline verification and architecture documentation are established.

Shared THIEPN Account session handoff and production Core transport remain platform-owned integration dependencies; Japanese must not reimplement them.

## P1 — Foundation Learning Engine & Study Player

**Implementation complete.** P1 established the reusable Study Player, kana foundation, canonical starter lexicon, kanji-in-vocabulary model, source-provenanced pronunciation audio, independent listening evidence, FSRS-backed review flow and desktop/mobile PWA certification.

The final physical-device Android/PWA hardware pass remains a release-certification task, not an architectural dependency. See `docs/P1_5_MOBILE_CERTIFICATION.md`.

## P2 — Grammar, Sentence Knowledge & Structured A1 Course

**Core implementation complete.**

P2 establishes the reusable architecture required for structured language learning beyond isolated words:

- canonical grammar concepts with concise mental models, formations, uses, prerequisites and contrasts;
- canonical sentence entities with reading, translation, token/entity links, grammar links, register and level metadata;
- Can-do descriptors separated from the linguistic concepts that support them;
- a structured A1 course graph with soft prerequisite edges;
- grammar comprehension and contextual-form evidence as separate learner dimensions;
- sentence comprehension and production as separate learner dimensions;
- reusable grammar/sentence lessons rendered through the same Study Player;
- course progress projected from StudyEvents rather than stored as an independent completion database;
- A1 items entering the same Today queue and FSRS system used by Foundation learning;
- grammar and sentence search in the canonical local content database;
- structural validation for grammar, sentence, Can-do and course-graph references.

Initial P2 content package: 36 starter lexemes, 15 grammar concepts, 22 linked sentences, 8 Can-do descriptors and 8 capability-centered A1 units.

## P2.5 — A1 Breadth, Conjugation & Assessment Completion

**Implementation complete.**

P2.5 expands the existing architecture into practical structured beginner breadth without creating parallel learning systems:

- 145 canonical beginner lexemes, 37 grammar concepts, 89 linked A1 sentences and 20 capability-centered course units;
- demonstratives, locations, question words, time, numbers, counters and core noun-linking patterns;
- family, food, shopping, transport, routines and immediate-needs vocabulary;
- sentence-final ね / よ and basic pragmatic choice;
- negative/past adjective and noun predicates plus common polite requests;
- first-class inflection metadata and rule-generated core verb/adjective paradigms;
- bounded conjugation practice recorded in the same learner evidence model;
- delayed unit-level Can-do checks after first-pass learning;
- a five-area A1 milestone reporting reading, listening, spoken interaction, spoken production and writing separately.

The two spoken milestone areas are controlled say-then-type proxies in P2.5; pronunciation and open-ended speech evaluation remain later work. See `docs/P2_5_ACCEPTANCE.md`.

## P3 — Reader, Connected Listening & A1→A2 Immersion Bridge

**Implementation complete.**

P3 turns Immerse into the first real transition from structured course material to connected Japanese:

- 8 canonical graded texts spanning A1, A1+ and A2-entry support;
- text entities composed from the existing canonical sentence graph;
- graph-aware word support that recognizes canonical forms and generated core inflections;
- optional reading hints, per-sentence translation and canonical grammar links;
- contextual lookup and one-action vocabulary mining;
- mined vocabulary returning to the same Today queue rather than a reader-specific SRS;
- lexical readiness derived from existing learner mastery;
- full-text connected playback through a Japanese device speech-synthesis voice when available;
- separate text-level reading and connected-listening evidence;
- local persistence, search, validation, Progress integration and responsive browser certification.

The tokenizer is intentionally bounded to the app's known graph and core inflection model, and device speech synthesis is not presented as sourced native-speaker audio. See `docs/P3_ACCEPTANCE.md`.

## P4 — A2 Expansion, Native Audio & Authentic-Input Pipeline

**Next.** Expand the bridge into broader A2 capability and prepare for genuine outside input:

- broader A2 grammar, lexicon and connected-text coverage;
- source-provenanced native sentence/passage audio where licensing permits;
- robust morphology/tokenization beyond the curated graph;
- private-source ingestion for learner-owned text and subtitles;
- unknown-word density and text difficulty estimation for imported material;
- stable mining/de-duplication from authentic input into the existing learner model;
- stronger connected-listening and shadowing workflows;
- transition from curated graded texts toward controlled authentic material.

## Later

Later phases expand A2→B1 immersion, writing/speaking production, AI conversation, adaptive remediation, advanced assessment and specialized authentic-language workflows.
