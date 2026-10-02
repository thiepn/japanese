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

**Implementation complete.**

P4 extends the same learner graph through practical structured A2 and opens a controlled path to learner-owned Japanese:

- 274 canonical lexemes, 66 grammar concepts, 161 linked sentences, 32 Can-do descriptors and 32 course units;
- 16 graded texts spanning A1 through A2;
- canonical grammar-owned A2 contextual practice instead of another hard-coded learning subsystem;
- 108 additional exact-file-verified native vocabulary recordings from the pinned Tofugu/WaniKani source;
- explicit native-audio license, attribution, native-speaker and external-identity metadata;
- recorded connected playback whenever an actual source-provenanced asset is attached, with device speech synthesis retained as an explicit fallback;
- local paste / TXT / Markdown / SRT / VTT ingestion for learner-owned Japanese;
- account-scoped private-document and private-vocabulary persistence;
- hybrid arbitrary-text analysis using canonical forms, shared inflection generation, bounded A2 surface rules and browser Japanese segmentation;
- known lexical-token coverage, unresolved-form counts and advisory difficulty estimates;
- de-duplicated contextual mining into the same Today queue, learner projections and FSRS scheduler;
- a runtime Tatoeba sentence/audio route that keeps text/audio licensing separate and rejects recordings without an admitted reusable license.

P4 does not claim perfect dictionary-grade morphology or native connected recordings for every text. Private unknown forms require a learner-supplied definition before personal review. See `docs/P4_ACCEPTANCE.md`.

## P5 — B1 Expansion, Productive Language & Adaptive Immersion

**Next.** Move from supported A2 comprehension toward independent B1 use:

- broader B1 grammar, lexicon, discourse connectors and multi-paragraph reading/listening;
- structured writing tasks with reusable correction/evidence contracts;
- real speaking and pronunciation practice beyond say-then-type proxies;
- richer shadowing and connected-listening loops with licensed native recordings;
- adaptive selection of graded vs imported material from learner mastery and unknown density;
- dictionary-grade morphology/lemmatization for private authentic input without replacing canonical identities;
- better sentence mining, sense selection and duplicate handling;
- B1 milestone assessment that reports reading, listening, interaction, production and writing separately.

## Later

Later phases add AI conversation, adaptive remediation, advanced assessment, source-pack workflows and specialized authentic-language study.
