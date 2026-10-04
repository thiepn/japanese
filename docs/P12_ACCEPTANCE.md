# P12 — C1 Foundation & Advanced Independent Japanese

Status: implementation complete as a **C1 foundation layer**. P12 was explicitly authorized to proceed despite the still-open P11 external-review evidence gate. That roadmap override does not change, satisfy or fabricate P11 qualification evidence.

## Product decision

Earlier roadmap text coupled the start of C1 implementation to `OPEN_C1_ROADMAP`.

For P12, curriculum development is intentionally decoupled from that release-candidate evidence gate. P11 remains independently truthful:

- P9 remains qualified;
- provider posture remains explicit;
- external productive-language validation remains absent unless a real reviewer is later admitted;
- P11 may therefore continue to report `HOLD_B2_RELEASE_CANDIDATE`.

P12 does not rewrite that result. It only allows the product roadmap to continue.

## Purpose

P12 establishes the first C1-oriented layer without treating C1 as "B2 plus rarer grammar."

The foundation focuses on advanced discourse control:

- distinguishing evidence from inference;
- calibrating certainty and explicit caveats;
- separating correlation from causal claims;
- synthesizing competing viewpoints;
- answering counterarguments precisely;
- controlling formal register and rhetorical force;
- tracking implications and assumptions;
- connecting recommendations to feasibility, accountability and implementation constraints.

## Canonical C1 content

P12 adds versioned overlay packages that are merged into the same canonical runtime graph as the existing A1→B2 content.

### Lexicon

`content/seed/jp-c1-lexicon.json` adds:

- 32 advanced discourse lexemes;
- 32 linked senses.

Representative concepts include:

- 含意 — implication;
- 整合性 — consistency/coherence;
- 制約 — constraint;
- 乖離 — divergence;
- 因果関係 — causal relationship;
- 相関 — correlation;
- 枠組み — framework;
- 合意形成 — consensus building;
- 実現可能性 — feasibility;
- 持続可能性 — sustainability;
- 説明責任 — accountability;
- 透明性 — transparency;
- 視座 — perspective;
- 曖昧性 — ambiguity;
- 修辞 — rhetoric;
- 譲歩 — concession;
- 留保 — caveat/reservation;
- 熟議 — deliberation.

### Grammar and advanced discourse forms

`content/seed/jp-c1-language.json` adds 16 C1 grammar concepts:

- 〜を踏まえて;
- 〜をめぐって;
- 〜に照らして;
- 〜に即して;
- 〜と相まって;
- 〜ないまでも;
- 〜に至るまで;
- 〜を余儀なくされる;
- 〜に足る;
- 〜にもまして;
- 〜とあって;
- 〜がゆえに;
- 〜にほかならない;
- 〜を禁じ得ない;
- 〜といえども;
- 〜べく.

Each concept retains the existing grammar contract:

- concise summary;
- mental model;
- formation;
- discourse uses;
- prerequisites and contrasts;
- formal register;
- canonical contextual practice;
- source provenance.

### Sentences and collocations

The same package adds:

- 48 connected C1 sentences;
- 32 advanced lexical chunks/collocations.

The chunks are treated as first-class language units rather than reducible word lists. Examples include:

- 前提を問い直す;
- 含意を慎重に捉える;
- 留保を明示する;
- 相関と因果を区別する;
- 推論の限界を示す;
- 結論を暫定的に扱う;
- 実現可能性を見極める;
- 合意形成を図る;
- 説明責任を果たす;
- 修辞と根拠を切り分ける.

## Capability course

`content/seed/jp-c1-course.json` extends the existing course graph from unit 58 into units 59–68.

The ten C1 foundation capabilities are:

1. evidence, assumptions and implications;
2. formal listening with stance shifts;
3. competing interpretations and nuance;
4. qualified position and implications;
5. multi-source written synthesis;
6. register, rhetoric and evidential force;
7. causality, correlation and uncertainty;
8. institutional trade-offs and consensus;
9. precise counterargument and reframing;
10. integrated recommendation and accountability.

The first C1 unit depends on the final B2 unit. The remaining units continue sequentially.

They use the same:

- Study Player;
- StudyEvent evidence;
- learner projection;
- FSRS review path;
- delayed unit checks;
- advisory prerequisite model.

No parallel C1 progress database is introduced.

## Connected C1 reading and listening

P12 adds eight connected C1 texts across:

- policy and research evidence;
- automation and professional judgment;
- urban resilience;
- causal interpretation;
- institutional transparency;
- education reform and local autonomy;
- climate-transition trade-offs;
- public/editorial argument.

Each text contains:

- six linked C1 sentences;
- canonical grammar links;
- lexical targets;
- three comprehension questions;
- segment-level replay metadata;
- full local search/index integration.

Where no independently licensed native recording is attached, listening remains explicitly marked as device speech synthesis.

Synthetic speech is never relabeled as native audio.

## Advanced productive work

P12 adds 12 productive tasks:

- six speaking tasks;
- six writing tasks.

Speaking covers:

- source synthesis;
- counterargument;
- policy briefing;
- uncertainty;
- institutional negotiation;
- register transfer.

Writing covers:

- evidence synthesis;
- policy memo;
- causal analysis;
- editorial response;
- critical expert-claim response;
- integrated recommendation.

The P12 rubric shifts beyond simple target coverage toward:

- task achievement;
- evidence and qualification;
- discourse control;
- range and register.

Structural checking is still narrower than complete semantic or pragmatic evaluation.

## C1 discourse-control practice

P12 adds `apps/web/src/study/c1Foundation.ts`.

It defines eight reusable advanced discourse moves:

1. evidence ≠ inference;
2. calibrated certainty;
3. causal restraint;
4. multi-source synthesis;
5. precise counterargument;
6. register control;
7. implication tracking;
8. decision accountability.

Twelve canonical prompts practice these moves against actual C1 sentence evidence.

The practice uses the same learner evidence model as the rest of the app.

## C1 foundation diagnostic

P12 adds a 15-item internal diagnostic across the same five language-activity areas used by earlier milestones:

- reading — 3;
- listening — 3;
- spoken interaction — 3;
- spoken production — 3;
- writing — 3.

The diagnostic is deliberately described as **C1 foundation**, not as proof that the learner is CEFR C1.

Listening uses explicitly labeled device synthesis unless source-provenanced audio is available.

Speaking relies on speech-recognition transcripts and structural checks.

Writing uses transparent task/target checks.

None of those are silently upgraded into accredited external assessment.

## Immersion progression

The Immerse surface now spans **A1 → C1 autonomy**.

The extensive-reading engine retains the existing B2 tracks and adds C1 tracks for:

- evidence, policy and causal reasoning;
- institutions, autonomy and accountability;
- public argument and rhetoric.

Adaptive canonical recommendations now give C1 material an appropriate advanced-level priority while still considering lexical readiness and prior mastery.

## Runtime and storage integration

P12 overlay content is merged into `coreContent`, so C1 automatically participates in:

- local SQLite persistence;
- Library search;
- grammar lookup;
- sentence lookup;
- reading-text lookup;
- productive-task lookup;
- course progress;
- Today scheduling;
- FSRS;
- learner projections;
- review history.

The canonical content version advances to `0.10.0`.

## Validation

Repository content validation now merges the base package and all P12 overlays before validating references.

It additionally enforces P12 minimums:

| C1 foundation area | Minimum |
| --- | ---: |
| Lexemes | 32 |
| Grammar concepts | 16 |
| Sentences | 48 |
| Lexical chunks | 32 |
| Can-do descriptors | 10 |
| Course units | 10 |
| Connected texts | 8 |
| Productive tasks | 12 |

Both writing and speaking tasks are required.

Duplicate IDs across base and overlay packages are rejected.

## Evidence boundaries

P12 preserves the existing truth model:

- curriculum implementation is not learner certification;
- an internal C1 diagnostic is not an accredited CEFR examination;
- AI feedback is advisory;
- structural productive-task success is not complete semantic quality;
- browser speech recognition is not acoustic pronunciation scoring;
- device TTS is not native audio;
- the P11 external-review result remains independent of the P12 roadmap override.

## P12 milestone

P12 establishes a coherent C1 foundation inside the existing Japanese learning OS:

- advanced lexical/discourse breadth;
- formal grammar and register control;
- connected C1 reading/listening;
- advanced speaking/writing;
- explicit discourse-move practice;
- five-area internal diagnostics;
- A1→C1 course continuity;
- B2→C1 immersion progression.

Later phases should deepen native-source breadth, spontaneous interaction, domain-specific C1 work and long-form multi-source autonomy rather than merely adding more isolated grammar patterns.
