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

**Implementation complete.**

P5 moves the unified system from supported A2 comprehension toward independent B1 use:

- 336 canonical lexemes, 86 grammar concepts, 209 linked sentences, 40 Can-do descriptors and 40 course units;
- 22 graded texts spanning A1 through B1;
- 10 canonical productive tasks for connected writing and microphone-based speaking;
- first-class writing and speech StudyPrompt modes using the existing StudyEvent, learner-projection and FSRS paths;
- a separate 15-item B1 milestone reporting reading, listening, spoken interaction, spoken production and writing independently;
- Japanese browser speech recognition for actual spoken responses when supported, with skip-without-mastery behavior when unavailable;
- listen → record → compare shadowing with browser-local recordings and explicit self-rated pronunciation evidence;
- evidence-derived adaptive immersion recommendations for graded and learner-owned material;
- 56 additional exact-file-verified native vocabulary recordings from the pinned Tofugu/WaniKani source;
- improved B1 canonical/deinflected resolution for common potential/passive, causative, volitional and conditional forms;
- deduplicated private sentence mining with learner-supplied meaning;
- private sentence comprehension/production returning to the same Today/review system;
- productive-task persistence, Library search and structural validation as first-class canonical content.

P5 does not claim phonetic/acoustic pronunciation scoring, unrestricted semantic writing correction, complete Japanese morphology, or native connected recordings where none have been licensed. See `docs/P5_ACCEPTANCE.md`.

## P6 — B1→B2 Independent Communication, AI Conversation & Advanced Feedback

**Implementation complete.**

P6 moves the unified system from controlled B1 production toward more independent B2-targeted communication:

- 416 canonical lexemes, 102 grammar concepts, 267 linked sentences, 50 Can-do descriptors and 50 course units;
- 30 graded texts spanning A1 through B2, including coherent multi-speaker dialogue;
- 20 productive tasks, with 10 B2 scenarios for conversation and connected writing;
- a separate 15-item B2 milestone reporting reading, listening, spoken interaction, spoken production and writing independently;
- multi-turn AI conversation and writing revision through a provider-agnostic server contract;
- explicit AI evidence contracts that prevent model judgments from silently becoming durable learner mastery;
- advanced feedback separated into grammar, vocabulary, coherence and task achievement;
- transcript-gated listening-first connected playback;
- cross-surface adaptive remediation across course, production and immersion evidence;
- B2 deinflection, resolution confidence and explicit canonical sense ambiguity;
- a dictionary-grade morphology provider contract that can replace bounded local guesses while preserving canonical/private identity;
- redistributable JSON source-pack import with independent text/audio license checks and explicit native-speaker admission;
- continued refusal to relabel device TTS, speech-recognition transcripts or learner self-ratings as native/acoustic evidence.

P6 deliberately does **not** claim that the current 416-word core is comprehensive CEFR B2 preparation. Live AI coaching requires a configured server-side model provider, dictionary-grade morphology becomes active only when a real provider is connected, and acoustic pronunciation scoring remains absent until a documented acoustic model exists. See `docs/P6_ACCEPTANCE.md`.

## P7 — B2 Breadth, Native Media & Advanced Lexical/Collocational Fluency

**Implementation complete.** P7 turns the focused B2 bridge into materially broader B2 practice while keeping the same evidence model:

- 634 canonical lexemes, 327 linked sentences, 58 Can-do descriptors and 58 units;
- 120 first-class B2 lexical chunks/collocations with separate recognition and active-use mastery;
- 42 graded texts, including 20 B2 texts across workplace, media, research, community, public-service, environment, everyday and synthesis genres;
- 32 productive tasks, including 12 new P7 collocation-targeted scenarios;
- readiness-driven extensive B2 tracks with no hard gates;
- sentence/turn replay loops with optional source-timed native-audio segments;
- source-pack validation and replay for licensed native recordings without relabeling device TTS;
- executable dictionary-grade morphology HTTP/provider boundary with a Sudachi-compatible server adapter, visible confidence and explicit fallback;
- authentic-input collocation detection;
- advisory AI revision history with repeated correction themes and recent drafts;
- unchanged learner-truth boundary: provider/model output cannot silently become durable mastery.

The 15-item B2 milestone remains an internal five-activity diagnostic rather than being inflated merely because the corpus is larger. See `docs/P7_ACCEPTANCE.md`.

## P8 — B2 Consolidation, Long-Form Autonomy & Production Reliability

**Next.** Consolidate B2 before introducing C1 labels:

- longer multi-document reading/listening tasks and sustained topic chains;
- multi-turn real-world scenario chains that require planning, repair, clarification and follow-up;
- stronger production reliability from delayed revision, recurring-error remediation and cross-session transfer;
- broader licensed native connected-audio packs and listening under natural speed/register variation;
- deployed morphology and AI providers with production observability/fallback certification;
- deeper vocabulary sense/register contrasts and phrase-family transfer;
- cumulative B2 portfolios and longitudinal evidence without manufacturing an overall CEFR pass/fail score.

## Later

Later phases add advanced domain-specific Japanese, C1-oriented comprehension and production only after B2 breadth is credible, specialized source packs, higher-level writing/speaking assessment and long-term adaptive curricula.
