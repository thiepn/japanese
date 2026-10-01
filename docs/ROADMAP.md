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

### Next: P2.5 — A1 Breadth, Conjugation & Assessment Completion

Expand the existing course graph to broader functional A1 coverage without changing the architecture:

- demonstratives and location expressions;
- verb/adjective conjugation model rather than storing each surface form as an unrelated fact;
- time, numbers and counters;
- family, food, shopping, transport, routines and immediate-needs vocabulary;
- sentence-final ね / よ and basic pragmatic choice;
- more question-word patterns;
- negative/past adjective and noun predicates;
- high-frequency polite requests and classroom/clarification language;
- larger sentence bank with controlled lexical coverage;
- unit-level delayed assessment and Can-do evidence;
- A1 milestone assessment that reports reading, listening, interaction, production and writing separately.

P2.5 should finish the practical beginner breadth before deeper immersion work.

## P3 — Reader, Connected Listening & A1→A2 Immersion Bridge

After A1 breadth is stable, P3 should use the same sentence/grammar/lexeme graph for graded reading, morphology-aware text support, connected listening and the first real immersion transition. It must not create separate known-word or reader-progress truth.

## Later

Later phases expand A2→B1 immersion, private-source ingestion, writing/speaking production, AI conversation, adaptive remediation, advanced assessment and specialized authentic-language workflows.
