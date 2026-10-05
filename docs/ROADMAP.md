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

- 626 canonical lexemes, 327 linked sentences, 58 Can-do descriptors and 58 units;
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

**Implementation complete.** P8 consolidates B2 across time, sources and changing contexts rather than adding premature C1 labels:

- six multi-document autonomy missions combining reading, connected listening, speaking/writing and delayed transfer;
- mission progress projected from normal StudyEvents with no separate mastery store;
- four-stage AI scenario chains requiring planning, clarification, repair and follow-up;
- delayed AI revision after 20+ hours with links back to the original learner response;
- cross-session production reliability requiring structurally successful evidence on different days;
- a cumulative descriptive B2 portfolio with learner-authored productive artifacts and no pass/fail score;
- 18 phrase-family/register-transfer prompts layered onto the 120 first-class B2 lexical chunks;
- source-pack support for multiple independently licensed native recordings with speed/register/speaker metadata;
- browser switching between native recording variants while preserving segment replay;
- no-store provider health probes for AI coaching and dictionary morphology;
- visible configured/operational/degraded/fallback states without turning provider metadata into learner evidence.

P8 retains the same evidence boundaries: structural success is not complete semantic quality, AI feedback is advisory, browser speech recognition is not acoustic scoring, device TTS is not native audio and the internal B2 milestone is not an accredited CEFR examination. See `docs/P8_ACCEPTANCE.md`.

## P9 — B2 Real-World Performance, Native Listening Depth & Release Qualification

**Implementation complete; P11.2 now supplies a provenance-audited native-media inventory, while full release qualification still requires green regression evidence.**

P9 hardens sustained B2 performance before any C1-oriented curriculum:

- five functional real-world chains: appointments, workplace incidents, service failures, travel disruption and community coordination;
- 20 stable qualification-only prompts spanning unseen response, paraphrase, misunderstanding repair and timed follow-up;
- non-blocking time targets recorded separately from structural correctness;
- qualification prompts excluded from FSRS so testing does not create artificial review obligations;
- source-provenanced native multi-source listening with two/three-source selection, note taking, synthesis and 20+ hour delayed recall;
- native recording variation across source rate, register and speaker labels without weakening licensing/native-speaker rules;
- bounded AI feedback-grounding diagnostics plus repeatable provider benchmarking;
- offline/provider-outage/long-history regression drills;
- longitudinal B2 portfolio export in JSON and Markdown;
- explicit system-level release criteria for B2 breadth, real-world performance, licensed native-media depth and regression reliability.

The release contract currently requires at least 20 B2 connected texts, 20 B2 productive tasks, 120 B2 lexical chunks, five real-world chains, 20 performance prompts, four licensed native connected-source documents, eight licensed recordings, three independent speaker labels/credits, two registers, natural-rate audio, a faster source condition and all regression gates green.

The C1-roadmap gate is a **product/system readiness gate**, not a learner CEFR judgment. P11.2 now satisfies the licensed native-media portion of this contract; the broader P11 gate still remains closed until external validation is admitted. See `docs/P9_ACCEPTANCE.md` and `docs/P9_RELEASE_QUALIFICATION.md`.

### Required operational step before any C1 phase

- keep `release/p11-native-sources.json` and the derived P9 inventory provenance-clean and CI-audited;
- run the full release workflow and retain P9/P11 qualification artifacts;
- obtain and admit the real external productive-language review required by P11;
- run the strict **P11 Release Candidate Qualification** workflow;
- open a C1 roadmap only if P11 returns `OPEN_C1_ROADMAP`.

## P10 — B2 Release Operations, Native Corpus Curation & Human Evaluation

**Implementation complete.** P10 operationalizes the remaining B2 release gap without introducing C1 curriculum:

- human review for learner writing/speaking using a four-dimension 0–4 rubric;
- human review stored as separate non-mastery StudyEvents;
- portable review packets for teachers/tutors;
- native-media curation with candidate/verified/rejected states and six explicit verification checks;
- versioned export of promotion-eligible media with reviewer audit metadata;
- repository promotion tooling with preview/apply modes and conflict/license validation;
- CI validation of the P10 candidate queue;
- a release operations dashboard exposing static product gates and local verified-media readiness;
- B2 portfolio schema v2 including human-review summaries.

The P9 release gate remains authoritative and source-dependent. P10 does not fabricate native media or convert reviewer judgment into CEFR certification. See `docs/P10_ACCEPTANCE.md`.

## P11 — B2 Release Candidate Qualification, External Validation & C1 Gate Decision

**Implementation complete; qualification currently blocked by missing release evidence.** P11 composes the existing P9/P10 work into one auditable release-candidate decision:

- P9 release qualification is recomputed as a hard dependency rather than copied as a flag;
- external teacher/tutor/language-professional review is recorded in a versioned repository manifest;
- a qualifying external review must cover at least six representative productive artifacts across writing and speaking, preserve a review-packet SHA-256 and contain no blocking issues;
- provider release posture is explicit: offline-only, connected or undecided;
- connected providers require current passing benchmark evidence with full case success and verified fallback behavior;
- normal CI generates a non-strict P11 decision artifact after the full regression suite;
- the manual **P11 Release Candidate Qualification** workflow runs the same suite and enforces the strict gate;
- the only gate-opening outcome is `OPEN_C1_ROADMAP`.

The current checked-in decision remains `HOLD_B2_RELEASE_CANDIDATE`: P11.1 resolved the provider posture, and P11.2 closes the P9 native-media gap, but no qualifying external productive-language validation has yet been admitted. This is an evidence state, not an implementation defect. See `docs/P11_ACCEPTANCE.md`.

## P11.1 — Release Evidence Closure & External Review Intake

**Implementation complete; release qualification still awaits real evidence.** P11.1 closes the remaining process gaps without weakening the P11 decision:

- freezes the current release profile as conservative `offline-only`, so the qualified baseline does not claim an unbenchmarked live AI/morphology dependency;
- adds cryptographic external-review intake bound to the exact exported P10 review packet;
- derives reviewed artifact count and writing/speaking modality from packet-linked evidence instead of hand-entered summary claims;
- requires one rubric review per admitted artifact and validates the existing 0–4 human-review dimensions;
- records SHA-256 digests for both packet and reviewer submission;
- refuses conflicting review identities and preserves the non-mastery / non-CEFR evidence boundary.

The provider-profile blockers are therefore resolved in the checked-in baseline. P11.2 subsequently closes the native-media side of the gate, leaving external human review as the remaining substantive release-candidate dependency. See `docs/P11_1_ACCEPTANCE.md`.

## P11.2 — Native Corpus Sourcing, Provenance Verification & P9 Media-Gate Closure

**Implementation complete; P9 native-media thresholds are now satisfied by checked-in provenance evidence.**

- eight connected native recordings are admitted through a dedicated source registry;
- five explicitly evidenced native speakers are represented;
- formal and polite registers are represented;
- natural and relative fast/stretch source conditions are represented without claiming acoustic rate scoring;
- every entry carries source, media, license, native-speaker and content evidence URLs;
- clips under 30 seconds, NC/ND licensing, missing provenance, incomplete verification and inventory drift are rejected;
- `release/p9-native-inventory.json` is reproducibly generated from the registry;
- normal CI plus strict P9/P11 workflows enforce the P11.2 audit.

The P9 media gate is no longer the reason P11 is held. P11.3 operationalizes the remaining external-review handoff without fabricating the reviewer evidence itself. See `docs/P11_2_ACCEPTANCE.md`.

## P11.3 — External Review Handoff, Reviewer Workspace & Final Gate Operations

**Implementation complete; the final gate now depends on a real external human action rather than missing product infrastructure.**

- derives external-review readiness from actual B2 learner-authored productive evidence;
- deterministically selects six representative artifacts, preferring recent and task-diverse evidence while balancing writing and speaking when possible;
- exports the immutable JSON packet plus a self-contained offline reviewer HTML workspace in one handoff action;
- lets an external teacher/tutor/language professional score every artifact with the existing 0–4 rubric and return a structured reviewer JSON;
- records spoken-interaction vs spoken-production coverage explicitly;
- computes a packet SHA-256 in the reviewer workspace when Web Crypto is available;
- rejects a returned submission whose declared packet fingerprint does not match the supplied packet;
- exposes final external-review handoff readiness in Release Operations;
- preserves the non-mastery / non-CEFR evidence boundary end to end.

At this point, all implementation-only work required to obtain and admit the P11 external review is present. P11 itself remains at `HOLD_B2_RELEASE_CANDIDATE` until an actual external reviewer completes the handoff. P12 curriculum development was subsequently authorized by explicit roadmap override; that override does not alter the P11 evidence result. See `docs/P11_3_ACCEPTANCE.md`.

## P12 — C1 Foundation & Advanced Independent Japanese

**Implementation complete under explicit roadmap override while P11 release evidence remains independently held.** P12 deliberately decouples curriculum development from the unfinished external-review qualification without fabricating or rewriting that evidence.

P12 establishes:

- 32 C1 foundation lexemes and senses;
- 16 advanced grammar/discourse concepts;
- 48 linked C1 sentences;
- 32 first-class C1 lexical chunks;
- 10 new Can-do descriptors and course units, extending the graph through unit 68;
- eight connected C1 reading/listening texts;
- 12 advanced productive tasks across speaking and writing;
- eight explicit discourse-control moves with 12 canonical practice prompts;
- a 15-item five-area C1 foundation diagnostic;
- A1→C1 course continuity and B2→C1 extensive immersion tracks;
- merged local search, SQLite persistence, StudyEvent evidence and FSRS integration;
- content validation that enforces P12 minimums and cross-overlay reference integrity.

P12 remains a **foundation**, not a claim of comprehensive CEFR C1 preparation or learner certification. Device synthesis, speech-recognition transcripts, structural productive checks and internal diagnostics keep their existing evidence labels. See `docs/P12_ACCEPTANCE.md`.

## P13 — C1 Native-Source Depth, Multi-Source Synthesis & Spontaneous Interaction

**Implementation complete.** P13 deepens the P12 C1 foundation through real-source listening and unscripted response pressure:

- reuses all eight provenance-audited P11.2 connected native sources without duplicating or weakening their evidence;
- adds four multi-source C1 synthesis missions using two or three independently identified sources;
- keeps speaker, license, attribution, register and source-rate condition visible in the learner workflow;
- records per-source notes and final synthesis as non-mastery StudyEvents;
- adds four four-stage spontaneous interaction scenarios across research, public policy, executive and media domains;
- reveals follow-up pressure one stage at a time so the whole exchange cannot be pre-scripted;
- records response timing, preparation use and self-repair while keeping speech-recognition transcripts explicitly non-acoustic;
- integrates both labs directly into Immerse rather than creating a parallel progress system.

See `docs/P13_ACCEPTANCE.md`.

## Later

Later phases should broaden C1 genres and speakers, add longer multi-document reading/listening synthesis, live provider-driven opposition, domain-specific tracks and cross-session advanced writing reliability while preserving the independent P11 release-evidence record.
