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

**Implementation complete.** P13 deepens the P12 C1 foundation through realistic source and interaction pressure without creating a new mastery silo:

- eight repository-verified connected native sources are exposed as an advanced listening layer;
- four C1 native-source sets require complete playback, source notes and cross-source synthesis;
- six canonical C1 multi-source synthesis packs combine two or three P12 C1 texts;
- synthesis tasks run through the normal Study Player and preserve structural-vs-semantic evidence boundaries;
- the coach contract now supports C1 plus an explicit spontaneous interaction mode;
- five hidden-future C1 scenario chains add evidence conflict, methodological challenge, resource constraints, trust/accountability pressure and public-interview reframing;
- future C1 pressure stages stay hidden from the learner until reached;
- B2 guided interaction remains unchanged as a separate lower-pressure mode;
- C1 native-depth and synthesis progress is derived from StudyEvents rather than stored in a parallel progress system.

P13 still does not claim CEFR certification, semantic grading of free production or acoustic pronunciation scoring. The P11 external-review evidence state remains independent of the continuing C1 roadmap. See `docs/P13_ACCEPTANCE.md`.

## P14 — C1 Long-Form Autonomy, Domain Specialization & Cross-Session Productive Reliability

**Implementation complete.** P14 converts the P12/P13 C1 toolkit into longitudinal autonomy rather than another isolated exercise layer:

- five domain missions span canonical C1 reading, audited native-source synthesis, P13 multi-source synthesis, hidden-future interaction, production, delayed transfer and reflection;
- delayed transfer requires successful evidence on two different days separated by at least 20 hours;
- C1 interaction stages require coverage of the full hidden-future scenario chain rather than one AI turn;
- domain status is derived from normal StudyEvents as not-started, exploring, developing or sustained;
- canonical C1 productive tasks and P13 synthesis packs gain cross-session reliability projections;
- spontaneous C1 interaction reliability is tracked separately from structural productive reliability;
- a dedicated C1 longitudinal portfolio summarizes domain breadth, native-source work, synthesis, interaction and repeated performance;
- the C1 portfolio exports to JSON and Markdown with the evidence boundary embedded;
- mission cards route directly into the relevant reading, source set, synthesis pack, C1 coach chain or productive task;
- no parallel mastery database, scheduler, native registry or CEFR authority is introduced.

P14 still treats internal reliability as descriptive product evidence rather than external proficiency certification. P11 remains an independent held evidence track. See `docs/P14_ACCEPTANCE.md`.

## P15 — Authentic C1 Environment, Source Evaluation, Multi-Day Writing & Live Defense

**Implementation complete.** P15 moves advanced Japanese beyond a course-authored C1 simulation into a source-driven working environment:

- 12 curated Japanese-language source portals span white papers, official statistics, research releases, academic articles, policy research, legislative briefs, statutory law, institutional speech, digital-government policy and demographic research;
- the learner registers the exact HTTPS page actually used; URLs are validated against the selected source portal instead of treating a portal click as evidence;
- sources keep explicit publisher, genre, source-role and domain metadata;
- source evaluation requires claim, evidence basis, limitation, institutional/rhetorical purpose and learner confidence before a source can enter a long-form project;
- specialist terminology can be mined from a registered source into the existing private-vocabulary review path;
- five multi-day C1 writing projects require evaluated-source breadth across multiple genres and publishers/institutions;
- each project freezes a stable source map and assigns `[S#]` traceability markers that must survive the first draft and delayed revision;
- 16 hidden pressure types create unpredictable post-draft defense across causality, source credibility, conflicting evidence, legal/implementation constraints, numerical inconsistency, audience/register shift and other advanced reasoning pressure;
- project defense requires at least two different pressure types after the active first draft;
- delayed revision unlocks only after 20+ hours and stale evidence from an older draft does not satisfy a later draft;
- browser speech recognition can capture defense transcripts, with typed fallback explicitly labeled as a proxy rather than acoustic evidence;
- the C1 portfolio schema advances to v2 and includes authentic-environment sources, evaluations, specialist terms, writing-project stages and defense breadth.

P15 stores source identity and learner-authored work rather than automatically copying external documents into the canonical course. Learner source evaluation remains critical-reading evidence, not independent fact verification, and the independent P11 release-evidence state remains unchanged. See `docs/P15_ACCEPTANCE.md`.

## P16 — C1 Research Quality, Bibliography, Human Review & Specialist Tracks

**Implementation complete.** P16 raises the evidential and research quality of the P15 authentic C1 environment instead of creating another progress subsystem:

- registered P15 sources can receive structured bibliography metadata covering responsible author/person, organization, publication date, access date, container/report/journal, DOI and exact URL;
- one canonical bibliography record renders into Japanese research-note, APA-like and compact citation displays without changing source identity;
- learner-supplied source excerpts are stored as either private-reference material or explicitly redistributable/licensed material;
- redistributable excerpts require explicit license metadata, while arbitrary external pages are never automatically scraped or promoted into the public canonical package;
- completed P15 projects can export reviewer packets binding thesis, first draft, delayed revision, defenses, source map, bibliography and an explicit review rubric;
- human review records four separate 0–4 dimensions: argument control, source use, language precision and register control;
- each human review is bound to the exact draft/revision timestamps and remains external qualitative evidence rather than durable mastery or CEFR certification;
- specialist tracks connect existing real sources, mined specialist terms and C1 projects around the learner's actual interests;
- P16 progress is projected from the same StudyEvent stream and does not introduce a second scheduler, mastery store or proficiency authority.

P15 remains authoritative for source evaluation, project sequencing, hidden-pressure defense and delayed revision. P11 remains an independent held release-evidence track until its actual external-review admission requirement is satisfied. See `docs/P16_ACCEPTANCE.md`.

## P17 — C1→C2 Precision Bridge, Stylistic Control & Specialist Discourse

**Implementation complete.** P17 targets advanced control rather than adding more broad curriculum volume:

- eight precision-transformation modes train compression, expansion, register shift, stance/certainty calibration, lexical precision, cohesion restructuring, counterargument integration and audience translation;
- every transformation preserves the original text, revised text and learner rationale, so the evidence remains inspectable and does not become an opaque style score;
- compression and expansion receive bounded structural validation, while semantic quality remains outside automatic mastery;
- P16 specialist tracks become the anchor for a five-function advanced discourse cycle: position, mechanism/evidence, expert challenge, audience shift and synthesis;
- one complete five-stage cycle records breadth; sustained specialist discourse requires a delayed 20+ hour repeat of every stage;
- Japanese browser speech recognition is admitted as transcript evidence only, with typed fallback explicitly marked as a speaking proxy;
- fresh-source refresh work compares two exact P15 registered sources and requires explicit analysis of changed claim, continuity, argumentative impact and remaining uncertainty;
- P16 human-review evidence feeds a repair loop where the learner explicitly accepts, modifies or rejects feedback and produces a reasoned revised passage;
- all P17 progress is derived from normal StudyEvents with no second scheduler or mastery store;
- the C1/C2 portfolio advances to schema v4 and carries precision, specialist-discourse reliability, fresh-source and human-review-repair evidence.

P17 is a C1→C2 **bridge**, not a C2 certificate. Structural precision, delayed specialist repetition, source comparison and human-feedback repair remain bounded evidence. P11 release qualification stays independent. See `docs/P17_ACCEPTANCE.md`.

## P18 — Advanced Native Interaction, Real-Time Repair & C2-Style Discourse Pressure

**Implementation complete.** P18 extends deliberate P17 precision into hidden, live interaction pressure:

- 12 pressure moves remain hidden until the learner commits a Japanese position, covering interruption, clarification, reformulation, implicature, register pivot, evidence conflict, stance narrowing, time pressure, cross-domain transfer, floor recovery, certainty challenge and synthesis;
- every saved pressure response becomes the next committed position, creating a continuous repair chain rather than disconnected speaking prompts;
- pressure moves are grouped into floor-control, repair, stance/evidence, audience/register and transfer/synthesis families;
- a complete simulated session requires four or more turns across four pressure types; robust coverage requires six or more types across at least four pressure families;
- browser speech recognition can capture Japanese transcripts where available, while typed fallback stays explicitly labeled as a speaking proxy;
- response latency is descriptive only and is not converted into a fluency, pronunciation or CEFR score;
- the existing C1 AI-coach path adds hidden-future committee, specialist-roundtable and cross-domain-transfer chains and emits P18 interaction evidence while remaining advisory;
- actual human interaction is stored separately from simulation with medium, learner-reported partner profile, duration, domain, difficult moment, repair/adaptation and reflection;
- P16 specialist tracks can be pushed into unfamiliar domains through explicit portable-principle and boundary-condition work;
- P18 state is projected from the same StudyEvent stream and does not introduce a second mastery or scheduling system;
- the C1/C2 portfolio advances to schema v5 and carries simulated pressure, AI pressure, actual human-interaction and cross-domain-transfer evidence.

P18 deliberately refuses several tempting shortcuts: simulated native-style pressure is not native-speaker evidence, AI dialogue is not human evidence, learner-reported partner profile is not independently verified, response timing is not fluency scoring, speech recognition is not acoustic analysis, and pressure coverage is not accredited C2 certification. P11 remains independent. See `docs/P18_ACCEPTANCE.md`.

## Later

The next phase should deepen evidence quality rather than add another interaction breadth layer: prosodic control only where real audio analysis exists, listening under overlap and fast/degraded input, turn-entry and repair under genuine audio pressure, and an external C2-oriented human evaluation protocol that remains separate from automatic mastery.
