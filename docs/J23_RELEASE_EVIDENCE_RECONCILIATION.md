# J23 — Human acceptance and release decision reconciliation

## Automated dependency (satisfied)

J22 draft PR #48 exact head \`b8e632dd8cd9575199e1584c8b77c9f087896f90\` passed mandatory GitHub Actions #37998876833 (verify job #114052010015), including TypeScript, unit tests, both focused mobile/accessibility suites, full Chromium E2E, machine-bound evidence generation and uploaded \`b2-release-qualification\` artifact. J23 stacks on J22; no merge or production rollout is authorized.

## CI reconciliation contract

Run \`node scripts/j23-release-reconciliation.mjs\` with \`J23_CANDIDATE_SHA\` set to the exact 40-hex commit. The script runs **after** the J20, J21 and J22 artifact-generation steps and fails closed if:

- any automated artifact or reviewer packet is missing, malformed, tampered or bound to a different head;
- J20 graded-answer/offline evidence does not state automated pass while preserving no-release status;
- J21 provenance integrity is not passed or Japanese semantic/human review is misrepresented;
- J22 visual evidence erroneously claims a verified screenshot archive without the independent 42-case/126-image upstream artifact;
- any checked-in pending human manifest has an inserted fake review, device report or signoff;
- source-branch rollback/stable-promotion status or production activation is prematurely marked approved.

A successful CI job writes \`artifacts/j23-release-evidence-reconciliation.json\` with the **explicit** result \`BLOCKED_AWAITING_INDEPENDENT_EVIDENCE\`. It reports all outstanding human-only gates, never writes a release tag and never changes activation state. This is a **machine-artifact consistency pass**, not a release decision approval.

## Independent review / physical hardware / first-party Account OAuth

The actual acceptance bundle must come from real independently collected evidence: exact-SHA J15D-D4 visual comparison report plus 126 genuine PNGs and the J22 fingerprinted visual reviewer packet; J21 Japanese-language reviewed packet and signed language professional feedback; P11 independent learner evidence; J16B/P21 Android standalone PWA session with TalkBack, audio, microphone, offline/restart and 200% text; registered first-party Account OAuth client with real Chrome/PWA callback; accessibility/product/release-operations human signoffs; verified staging identity and successfully exercised rollback.

**Do not** write completed human evidence into this source PR or rely on emulation as physical evidence. Operator intake must authenticate reviewer independence, verify evidence origin/hashes and protect tokens, raw recordings, account IDs and private learner content.

## Content-addressed submission boundary

The optional command:

\`\`\`sh
J23_CANDIDATE_SHA=<exact-40-hex-sha> node scripts/j23-release-reconciliation.mjs \
  --inspect-submission path/to/content-addressed-evidence-bundle.json
\`\`\`

validates that all six evidence categories are present, each uses the same SHA and \`sha256:<64hex>\` evidence identity, and that the submitter has **not** embedded an auto-approved status. It produces a non-authorizing **structural receipt**. This cannot verify the truth of provided hashes, human identities or physical activities; an authorized independent operator must do that using the underlying artifacts.

## Release rules

No source branch may merge/deploy, mutate an approved baseline, register first-party OAuth, bypass Android/TalkBack or Japanese expert review, or infer release authorization from CI success. The next phase J24 (operator-qualified release readiness) begins only after J23 exact-head automated CI succeeds. Actual stable activation remains separately gated by genuine human and operator approval.
