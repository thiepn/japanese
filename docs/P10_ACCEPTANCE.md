# P10 — B2 Release Operations, Native Corpus Curation & Human Evaluation

Status: implementation complete; P9 release qualification remains source-dependent until verified native inventory satisfies the existing gate.

## Purpose

P10 operationalizes the remaining gap between a feature-complete B2 system and a release-qualified one.

It does not add C1 curriculum. Instead it provides auditable workflows for:

- human review of learner production;
- human verification of imported native media;
- promotion of verified media into the repository release inventory;
- release-readiness visibility without weakening P9 criteria.

## Human productive-evidence review

P10 adds an optional human review workflow for B2 writing and speaking artifacts.

Each review records:

- source learner-event identity;
- reviewer label;
- task fulfillment score (0–4);
- meaning/accuracy score (0–4);
- coherence score (0–4);
- register score (0–4);
- strengths;
- next priority;
- optional detailed comment.

Human reviews emit separate StudyEvents with `result=skipped`.

They explicitly carry:

- `humanReviewAppliedToMastery=false`;
- `accreditedCefrVerdict=false`.

Reviewer judgment therefore remains descriptive evidence and does not silently alter FSRS, mastery projections or CEFR milestones.

## Human-review packet export

Unreviewed or recent productive artifacts can be exported as a versioned JSON review packet.

The packet contains learner-authored responses plus the rubric contract and explicit boundaries stating that:

- reviewer scores do not change mastery automatically;
- a reviewer score is not CEFR certification.

This allows an external teacher/tutor to review evidence without requiring a paid AI provider.

## Native corpus curation

P10 adds a local operational store for media reviews.

Each imported recording can be marked candidate / verified / rejected and must be checked for:

- source URL accessibility;
- reuse license;
- explicit native-speaker evidence;
- transcript/content match;
- register classification;
- source speech-rate classification.

A recording cannot become promotion-eligible unless status is `verified` and every checklist field is true.

This operational review data is intentionally separate from learner StudyEvents.

## Candidate export

The Immerse surface can export only promotion-eligible recordings into a versioned P10 candidate manifest.

The export preserves:

- source-document identity and text;
- source URL/label;
- recording identity and URL;
- credit/license/attribution;
- explicit native-speaker status;
- speech-rate/register/speaker labels;
- reviewer/checklist audit metadata.

Local verification alone does not modify the repository release inventory.

## Repository promotion

P10 adds `scripts/p10-native-promote.mjs`.

Commands:

- `pnpm native:p10:preview` validates the checked-in candidate queue and writes a preview inventory;
- `pnpm native:p10:apply` applies reviewed candidates to `release/p9-native-inventory.json`.

Promotion rejects:

- incomplete verification;
- restricted NC/ND licensing;
- missing attribution where required;
- invalid URLs;
- missing native-speaker evidence;
- missing rate/register metadata;
- duplicate/conflicting recording identities.

CI runs the preview validator on every branch.

## Release operations dashboard

Progress now shows:

- static P9 product gates;
- local verified-media counts;
- speaker/register/rate readiness;
- human-review queue size.

The dashboard is explicitly informational. Official P9 qualification still comes from repository CI and the checked-in release inventory.

## Portfolio v2

The B2 portfolio export advances to schema version 2 / phase P10.

It adds human-review summary data while preserving explicit evidence boundaries.

Older P9 schema-v1 exports remain serializable/readable.

## Regression coverage

P10 adds tests for:

- human review linkage and non-mastery semantics;
- review-packet evidence boundaries;
- native curation blockers;
- promotion eligibility;
- verified candidate export;
- repository promotion conflict handling;
- restricted-license rejection;
- P10 Progress/Immerse surfaces across certified Playwright viewports.

## Deliberate boundaries

P10 still does not fabricate native content.

It does not infer native-speaker status from Japanese language alone.

It does not turn a tutor rubric into durable mastery.

It does not open the C1 roadmap merely because review tooling exists.

The P9 release gate remains authoritative.

## P10 milestone

The app now has an end-to-end operational path from imported source-provenanced media to human verification, candidate export, repository promotion and CI recertification, plus a separate human-evaluation path for learner production.

The next phase should be P11 — B2 Release Candidate Qualification, External Validation & C1 Gate Decision. P11 must treat the P9 release gate as a hard product dependency rather than bypassing it.
