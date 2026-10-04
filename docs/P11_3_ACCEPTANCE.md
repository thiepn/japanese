# P11.3 — External Review Handoff, Reviewer Workspace & Final Gate Operations

Status: implementation complete. P11 remains intentionally blocked until a real external teacher/tutor/language professional completes the review and the returned submission is admitted.

## Purpose

P11.3 operationalizes the final non-technical dependency before the C1 roadmap can open.

P11.1 created a cryptographic intake path.
P11.2 closed the native-media gate.
P11.3 makes the remaining external-review step practical enough to execute without requiring the reviewer to install the app, edit repository files or understand the internal evidence model.

The phase does not fabricate reviewer identity, scores or approval.

## Representative packet selection

The Human Evaluation surface now derives a P11 external-review readiness state from actual B2 productive artifacts.

A release-review packet requires at least:

- six learner-authored B2 productive artifacts;
- at least one writing artifact;
- at least one speaking artifact.

When enough evidence exists, packet selection is deterministic:

- recent evidence is preferred;
- distinct productive-task IDs are preferred before repeated attempts;
- writing and speaking are alternated while both remain available;
- a 3 writing / 3 speaking packet is produced when the available evidence permits it;
- the gate still follows the actual P11 contract, so an imbalanced packet can remain valid when one mode has fewer available artifacts as long as both modes are represented.

The readiness surface reports:

- total productive artifacts;
- writing artifacts;
- speaking artifacts;
- unique task count;
- selected packet size;
- selected writing/speaking counts;
- whether the six-item packet is balanced.

## One-click external-review handoff

The app now exposes:

**Export P11 external-review handoff**

The action creates two files from the same packet instance:

1. an immutable JSON evidence packet;
2. a self-contained offline HTML reviewer workspace.

The JSON packet is the authoritative learner-evidence payload that must be preserved unchanged for repository intake.

The HTML workspace can be sent directly to the external reviewer.

## Offline reviewer workspace

The reviewer workspace requires no account, server, API key or internet connection.

It presents:

- the six learner-authored responses;
- task identity and mode;
- the existing four 0–4 rubric dimensions:
  - task fulfillment;
  - meaning/accuracy;
  - coherence;
  - register;
- accepted/concern disposition per artifact;
- spoken-interaction vs spoken-production classification for speaking evidence;
- per-artifact comments;
- reviewer label;
- reviewer professional role;
- overall approve / approve-with-notes / block verdict;
- blocking issues;
- overall notes.

The workspace explicitly states that reviewer evidence:

- does not change learner mastery;
- does not constitute accredited CEFR certification.

## Packet fingerprint

The reviewer workspace computes the SHA-256 fingerprint of the exact embedded JSON packet when browser Web Crypto is available.

The returned reviewer submission includes that packet fingerprint.

P11.3 extends repository intake so that a reviewer-declared fingerprint must match the packet supplied to the intake command.

A mismatched packet/reviewer pair is rejected.

Repository intake still independently computes the canonical packet and submission hashes for the admitted P11 evidence record.

## Final handoff procedure

1. Complete enough B2 productive tasks for the app to show the P11 handoff as ready.
2. Open Progress → Human Evaluation.
3. Select **Export P11 external-review handoff**.
4. Keep the downloaded JSON packet unchanged.
5. Send the downloaded HTML reviewer workspace to an independent teacher, tutor or language professional.
6. The reviewer opens the HTML file locally, scores every artifact and exports the completed reviewer JSON.
7. Run:

```bash
pnpm review:p11:intake \
  --packet path/to/japanese-p11-review-packet.json \
  --submission path/to/japanese-p11-external-review.json
```

8. Verify the reviewer identity and returned submission provenance.
9. Apply:

```bash
pnpm review:p11:intake \
  --packet path/to/japanese-p11-review-packet.json \
  --submission path/to/japanese-p11-external-review.json \
  --apply
```

10. Commit the updated `release/p11-external-validation.json`.
11. Run the strict P11 release-candidate workflow.
12. Open P12 only if the generated decision is `OPEN_C1_ROADMAP`.

## Release Operations integration

The release operations panel now exposes external-review packet readiness separately from local descriptive human reviews.

This prevents three different concepts from being conflated:

- local optional review;
- external release-validation readiness;
- admitted repository release evidence.

The UI does not open the C1 gate and cannot replace repository qualification.

## Regression coverage

P11.3 adds tests for:

- deterministic six-artifact packet selection;
- 3/3 writing/speaking balancing when possible;
- preference for distinct productive tasks;
- blocking when only one modality exists;
- fallback validity when six artifacts contain both modes but cannot be perfectly balanced;
- offline reviewer workspace generation;
- reviewer submission-template structure;
- reviewer-declared packet SHA-256 verification.

## Current gate state

At implementation completion, the repository still contains no real external validation record.

Therefore the correct decision remains:

`HOLD_B2_RELEASE_CANDIDATE`

No code change can legitimately turn that into `OPEN_C1_ROADMAP` without the required real external review.

## Deliberate boundaries

P11.3 does not:

- impersonate an external reviewer;
- auto-score the external-review rubric with AI;
- accept self-review as external validation;
- infer professional reviewer status;
- turn human scores into mastery;
- interpret the review as accredited CEFR B2 certification;
- bypass the strict P11 gate;
- begin C1 curriculum before the real external evidence exists.

## P11.3 milestone

All repository-side and user-facing machinery needed to obtain and admit the final external review is implemented.

The P11 evidence blocker remains the intentionally human requirement itself. P12 curriculum development has since proceeded by explicit roadmap override, without changing P11's HOLD decision or inventing reviewer evidence.
