# P9 — B2 Real-World Performance, Native Listening Depth & Release Qualification

Status: implementation complete; final release qualification remains intentionally conditional on a real licensed native-audio inventory and green release-regression evidence

## Purpose

P9 hardens the existing B2 system under conditions that are closer to actual use: unseen prompts, time pressure, paraphrase, misunderstanding repair, multiple native sources, delayed recall, provider outages and long evidence histories.

P9 does not add a C1 label and does not convert internal evidence into an accredited CEFR result.

## Real-world functional performance

P9 adds five functional chains:

- appointment change under constraints;
- workplace incident and response;
- service problem and resolution;
- travel disruption and replanning;
- community coordination under pressure.

Each chain contains four stable performance dimensions:

1. unseen response;
2. paraphrase;
3. repair;
4. timed follow-up.

The bank therefore contains 20 stable real-world performance prompts.

Every prompt records:

- stable chain/prompt identity;
- first-presentation vs repeat status;
- writing or speech-recognition mode;
- structural target coverage;
- learner-authored response/transcript;
- response time;
- whether the response was within the explicit time target.

Time targets are evidence, not hard submission locks. A late response can still be structurally correct.

Performance prompts are qualification-only and explicitly excluded from FSRS scheduling so testing does not create artificial review obligations.

## Native multi-source listening

P9 adds a native-listening lab over account-scoped reusable source documents.

Only source-provenanced recordings admitted by the existing license/native-speaker policy can enter the lab. Device speech synthesis is not eligible for native-listening qualification evidence.

The lab supports:

- selection of two or three independent source documents;
- multiple licensed recording variants per document;
- source-rate/register/speaker metadata;
- native playback without relabeling synthetic fallback;
- per-source note taking;
- cross-source synthesis;
- delayed recall after at least 20 hours.

Notes, synthesis and delayed recall are stored as learner artifacts with semantic grading disabled. The system therefore records endurance and transfer practice without claiming that an unreviewed summary proves comprehension mastery.

P9 does not fabricate connected native audio when a deployment has not supplied enough reusable recordings.

## Timed production evidence

`StudyPrompt` now supports an optional `timeLimitSeconds`.

The Study Player shows a live, non-blocking countdown. `StudyEvent` metadata stores:

- the configured time target;
- whether the submitted response was within the target.

Time-target failure never automatically converts an otherwise structurally correct response into an incorrect answer.

## Feedback grounding and provider benchmarking

P9 adds a bounded feedback-quality diagnostic for AI coaching.

The diagnostic checks:

- whether quoted correction spans are anchored in the learner's actual text;
- whether requested goals appear in the feedback/revision response;
- whether a writing-revision response includes a revision prompt;
- whether prohibited authority-style language appears;
- feedback density.

The resulting score is a provider-quality diagnostic only. It never changes learner mastery.

The API package also exposes a repeatable coach-provider benchmark with curated error/overclaim/register/coherence cases. It measures:

- schema/evidence-contract safety;
- grounding score;
- expected semantic signal recall;
- forbidden authority signals.

This benchmark is intended for release/provider qualification and does not become learner evidence.

## Longitudinal B2 portfolio export

P9 extends the P8 portfolio with portable export.

The learner can export:

- JSON with a stable schema/version;
- readable Markdown.

Exports include:

- B2 reading/listening breadth;
- speaking/writing breadth;
- recent learner-authored productive artifacts;
- cross-session reliability;
- autonomy-mission progress;
- real-world performance progress;
- native-listening depth metrics;
- explicit evidence-boundary declarations.

The export explicitly states that it is not an accredited CEFR result.

## Provider and outage resilience

P9 keeps P8 provider health probes and adds release-level outage certification.

When the AI coach is unavailable:

- health state is visible;
- no fabricated model response is produced;
- learner mastery is unchanged.

When dictionary morphology is unavailable:

- the UI falls back visibly to bounded local analysis;
- fallback is never relabeled dictionary-grade.

## Long-history and offline resilience

P9 regression coverage includes:

- projection over a synthetic 5,000-event B2 history;
- PWA offline reload with P9 surfaces;
- provider-outage routing;
- certified desktop/mobile viewport checks;
- content validation, typecheck and production build.

## Release qualification contract

P9 codifies explicit system-level release criteria in `releaseQualification.ts`.

Content/performance thresholds include:

- at least 20 B2 connected texts;
- at least 20 B2 productive tasks;
- at least 120 first-class B2 lexical chunks;
- at least five real-world functional chains;
- at least 20 unseen/paraphrase/repair/timed performance prompts.

Native-media thresholds include:

- at least four licensed native connected-source documents;
- at least eight licensed recordings;
- at least three independent speaker labels/credits;
- at least two registers;
- natural-rate native audio;
- a faster native source condition.

Regression gates include:

- typecheck;
- unit/integration tests;
- content validation;
- production build;
- certified E2E;
- offline drill;
- provider-outage drill;
- long-history drill.

The C1-roadmap gate opens only when every release check passes.

This is a **system/product readiness gate**, not a judgment that any individual learner is C1-ready.

## Deliberate release boundary

The repository can implement and certify the software paths without inventing a licensed native inventory.

Therefore P9 distinguishes:

- **implementation complete**: code, evidence contracts, workflows and regression coverage exist;
- **release qualified**: the deployment also meets the real native-media inventory threshold and the recorded regression suite is green.

A deployment with too little licensed connected native audio remains correctly blocked by the release contract.

## P9 milestone

The B2 system can now test functional performance on unseen timed prompts, require paraphrase and repair, preserve first-attempt evidence, support real multi-source native listening with notes/synthesis/delayed recall, benchmark AI feedback quality, survive provider/offline failures and export a longitudinal B2 evidence portfolio.

No C1 curriculum should begin until the P9 release gate is actually satisfied.
