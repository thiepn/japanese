# P11.1 — Release Evidence Closure & External Review Intake

Status: implementation complete; P12 remains blocked until the P11 release-candidate decision becomes `OPEN_C1_ROADMAP`.

## Purpose

P11.1 closes the remaining avoidable process gaps around the P11 gate without inventing evidence that does not exist.

It focuses on two tasks:

1. freeze a conservative release-provider posture that does not claim an unverified live AI dependency;
2. make external teacher/tutor validation cryptographically traceable to the exact learner-evidence packet that was reviewed.

P11.1 does not weaken P9, fabricate native media, self-attest external review or begin C1 curriculum.

## Offline-only release profile

The checked-in P11 provider manifest now declares:

`releaseProfile: "offline-only"`

with no configured providers and no benchmark runs.

This is the conservative release baseline for the current local-first product. It means:

- the release does not claim that a live AI coach or morphology provider is part of the qualified release;
- no provider benchmark is fabricated merely to satisfy a gate;
- optional provider integrations may still exist in the codebase, but a future connected release must explicitly switch the profile to `connected` and supply passing benchmark evidence;
- P11 provider-profile and provider-benchmark checks can now pass without external service dependence.

## External review intake

P11.1 adds `scripts/p11-external-review-intake.mjs`.

The workflow starts from a real P10 human-review packet exported by the app.

### Generate a reviewer submission template

```bash
pnpm review:p11:intake --packet path/to/review-packet.json --template path/to/external-review.json
```

The generated submission contains one rubric record per packet artifact.

Each artifact review records:

- packet event identity;
- task fulfillment score, 0–4;
- meaning/accuracy score, 0–4;
- coherence score, 0–4;
- register score, 0–4;
- accepted/concern disposition;
- speaking modality when applicable;
- optional comment.

The reviewer submission also records:

- reviewer label;
- reviewer role: teacher, tutor or language professional;
- explicit external-to-project status;
- review timestamp;
- overall verdict;
- blocking issues;
- optional notes.

## Provenance validation

The intake command validates that:

- the source packet is a real `thiepn-japanese-human-review-packet` v1 document;
- the packet preserves the existing evidence boundaries;
- every reviewed artifact exists in the packet;
- no artifact is reviewed twice;
- all rubric values are valid 0–4 integers;
- writing/speaking modality is derived from packet-linked evidence rather than trusted as a free-form aggregate;
- speaking reviews explicitly distinguish spoken interaction vs spoken production;
- reviewer role and external status are valid;
- verdict and blockers use the P11 contract.

The intake process computes SHA-256 digests for both:

- the exact review packet;
- the exact external-review submission.

The resulting release entry therefore binds the P11 manifest to immutable reviewed inputs.

## Preview and apply

Preview:

```bash
pnpm review:p11:intake \
  --packet path/to/review-packet.json \
  --submission path/to/external-review.json
```

Apply only after reviewer identity and submission provenance have been checked:

```bash
pnpm review:p11:intake \
  --packet path/to/review-packet.json \
  --submission path/to/external-review.json \
  --apply
```

The command refuses to silently overwrite a conflicting review identity.

## External-review qualification

The P11 gate still requires at least:

- one external teacher/tutor/language-professional reviewer;
- six reviewed productive artifacts;
- writing evidence;
- speaking evidence;
- no blocking review issues.

P11.1 makes those facts reproducible from packet-linked review data rather than manually entering aggregate counts.

## Remaining blockers

After P11.1, the provider decision is no longer a blocker.

The remaining substantive evidence work is:

1. admit enough independently verified reusable connected native media to satisfy P9;
2. perform a real external review of representative B2 productive evidence and admit it through the P11.1 intake workflow.

Until those exist, `HOLD_B2_RELEASE_CANDIDATE` remains correct.

## Deliberate boundaries

P11.1 does not:

- allow ChatGPT or another model to impersonate the external reviewer;
- infer reviewer identity;
- invent review scores;
- claim a connected provider that was not benchmarked;
- turn external scores into learner mastery;
- classify the learner as accredited CEFR B2;
- open P12 based only on completed software work.

## P11.1 milestone

The release now has a conservative provider baseline and an auditable external-review handoff/intake path. The remaining C1-gate blockers require real native-media provenance and real external human review rather than more implementation-only work.
