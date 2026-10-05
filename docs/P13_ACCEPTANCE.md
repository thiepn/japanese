# P13 — C1 Native-Source Depth, Multi-Source Synthesis & Spontaneous Interaction

Status: implementation complete.

P13 deepens the C1 foundation created in P12. It does not add a separate learner model and it does not convert internal product evidence into CEFR certification.

## Purpose

P12 established advanced discourse control on canonical C1 material. P13 adds three missing forms of pressure:

1. source-provenanced native connected speech;
2. synthesis across multiple sources instead of single-text comprehension;
3. interaction where later complications are hidden until the learner reaches them.

The goal is to move from controlled advanced practice toward more realistic independent Japanese while preserving the existing evidence contract.

## 1. Repository-verified C1 native-source depth

P13 reuses the provenance-audited native inventory already admitted by P11.2.

`apps/web/src/study/c1NativeDepth.ts` reads `release/p9-native-inventory.json` and exposes only recordings whose repository verification checklist confirms:

- source identity;
- recording identity;
- reusable license;
- native-speaker status;
- content match;
- connected speech;
- register review;
- source-rate review.

P13 does not create a second source inventory and does not weaken those checks.

The current P13 source layer contains:

- 8 repository-verified connected recordings;
- 5+ distinct speaker labels;
- formal and polite registers;
- natural and relative fast/stretch source conditions.

### Native source sets

P13 groups those recordings into four advanced listening sets:

- policy continuity across two formal addresses;
- press-conference stance under pressure;
- same-speaker register shift;
- public communication across multiple speakers.

Each set requires listening to all selected recordings before the in-app synthesis can be saved.

Source notes and synthesis are stored as StudyEvents with:

- source IDs;
- source-rate/register/speaker metadata;
- repository-verification marker;
- semantic grading disabled;
- model-to-mastery propagation disabled.

Playback completion is recorded as source exposure. Selecting a source without playing it does not count as listening evidence.

## 2. Multi-source C1 synthesis

`apps/web/src/study/c1Synthesis.ts` adds six reusable synthesis packs built from the canonical P12 C1 texts:

1. evidence, causality and justified conclusions;
2. automation, judgment and accountability;
3. local autonomy under shared constraints;
4. public disagreement without false certainty;
5. feasibility, sustainability and unequal costs;
6. cross-domain framework transfer.

Every pack requires at least two C1 sources and specifies:

- a cross-source question;
- three discourse moves;
- three transparent language targets;
- a minimum connected-response length;
- writing or spoken-production mode.

The packs run through the normal Study Player and normal StudyEvent path.

The built-in result remains intentionally narrow:

- it checks minimum length and explicit target-language coverage;
- it does not judge whether the synthesis is semantically correct;
- it does not award CEFR C1 status;
- it does not replace human review.

## 3. C1 spontaneous interaction

The coach contract now supports `targetLevel: "C1"` and an explicit interaction style:

- `guided`;
- `spontaneous`.

P13 adds five C1 scenario chains:

- policy recommendation under challenge;
- causal interpretation under methodological pressure;
- institutional negotiation across unequal capacity;
- difficult public interview;
- cross-domain argument transfer.

Each C1 chain has five stages:

1. position;
2. probe;
3. pressure;
4. repair;
5. synthesis.

Unlike the B2 chains, P13 C1 chains set `hiddenFutureStages: true`.

The UI reveals only completed stages and the current stage. Future complications remain hidden.

The model receives the current communicative goals, but the learner does not automatically see them in spontaneous mode. They remain behind an optional **Reveal target moves** disclosure.

### Server behavior

The server coach prompt now explicitly tells the model, in spontaneous mode, to:

- act as the interlocutor first;
- avoid previewing future challenges;
- introduce one realistic complication at a time;
- require the learner to infer when clarification, concession, repair, reframing or qualification is needed;
- continue natural Japanese interaction rather than turning every turn into a lecture.

C1 interaction events record:

- target level;
- chain and stage;
- interaction style;
- current pressure type when applicable;
- the existing safe advisory feedback contract.

AI feedback still cannot change mastery automatically.

## 4. Immerse integration

The Immerse surface now contains a dedicated **P13 C1 Source Depth** workspace.

It combines:

- repository-verified native recordings;
- source metadata and attribution;
- source-specific listening notes;
- native multi-source synthesis;
- canonical multi-source reasoning packs.

Learners can open the underlying P12 C1 texts directly from each synthesis pack and then start the synthesis in the normal Study Player.

The earlier P9 private/imported native-listening lab remains available. P13 does not replace it; it adds a stable repository-backed advanced source layer.

## 5. Coach progression

The AI Coach now exposes two explicit interaction levels:

- **B2 guided** — retains the original four-stage scenario architecture;
- **C1 spontaneous** — uses hidden-future five-stage pressure chains.

Writing revision also respects the selected or original attempt level, so C1 revisions stay C1 rather than silently falling back to B2.

The coach evidence boundary remains unchanged:

- advisory only;
- no mastery mutation;
- no CEFR pass/fail claim;
- no acoustic pronunciation score.

## 6. Runtime architecture

P13 preserves the single learning OS:

- C1 synthesis sessions are launched through `study/runtime.ts`;
- Study Player remains the productive-session renderer;
- StudyEvents remain the evidence store;
- local learner projections remain authoritative for durable learner state;
- no separate P13 progress database is introduced.

P13 source-depth progress is derived from StudyEvents rather than written into a parallel progress model.

## 7. Regression requirements

P13 adds regression coverage for:

- all repository native sources passing the existing provenance checklist;
- source-set references resolving to admitted native sources;
- six synthesis packs requiring multiple canonical C1 texts;
- synthesis prompts retaining semantic-grading and CEFR boundaries;
- five C1 spontaneous chains with hidden future stages;
- server-side C1 spontaneous-interaction instructions;
- the original P8 B2 scenario chains remaining four-stage guided interactions.

## Evidence boundaries

P13 deliberately distinguishes:

**Evidence that can be recorded**

- a verified native recording was played;
- source notes were written;
- a cross-source synthesis was attempted;
- a structural target was present in a productive response;
- a learner completed a spontaneous coach turn;
- the model returned advisory feedback.

**Claims P13 does not make**

- that listening notes prove full comprehension;
- that a structurally complete synthesis is semantically correct;
- that speech recognition measures pronunciation;
- that AI feedback is a human assessment;
- that internal C1 work certifies CEFR C1.

P11 release-candidate evidence remains independent. The project-owner roadmap override used for P12 continues to permit C1 product development without fabricating the missing external P11 review.

## P13 milestone

P13 turns the C1 foundation into a materially more realistic advanced-learning environment:

- verified native connected speech;
- multi-speaker and register comparison;
- source-note discipline;
- cross-source synthesis;
- cross-domain reasoning;
- hidden-future interaction pressure;
- C1-level AI-coach conversations;
- no new mastery silo and no weakened evidence semantics.

The next phase should deepen **long-form C1 autonomy, domain specialization, native text/audio breadth and productive reliability across days**, rather than simply adding more isolated grammar items.
