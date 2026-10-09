# J25 — Independent admission and controlled release decision

## Exact-head dependency

J24 draft PR #50 exact head \`c59ddf996932162a1f058feaff4b4bdbca5a41fe\` passed all **38** steps in [CI #38001656115](https://github.com/thiepn/japanese/actions/runs/38001656115), including complete Playwright E2E, the J24 blocked-operator-readiness record and uploaded \`b2-release-qualification\`. J25 is stacked directly on J24. Earlier J17–J24 PRs remain unmerged.

## Mandatory CI behavior

The J25 CI step runs only after the full existing tests and J20–J24 qualification reports. It writes \`artifacts/j25-controlled-release-decision.json\` and checks the same exact candidate SHA as J24. Its required decision is **\`BLOCKED_EXTERNAL_ACCEPTANCE_AND_HUMAN_APPROVAL\`**. It never consumes private trust rosters, device recordings, reviewer signatures, client secrets or external human approvals from source-branch CI, and never authorizes release.

## Operator-only evidence admission

J24 already validates the **actual nine categories** of independently produced primary evidence, including all **42** screenshot cases and **126** real PNG files, live Android/TalkBack/PWA, THIEPN Account OAuth callback, language/P11 independent reviewer worksheets, accessibility, staged release SHA and rollback. J25 calls J24's complete bundle inspector before admission and then adds:

1. **Two external trust pins**: exact SHA-256 of the independently maintained Ed25519 reviewer roster and revocation snapshot, obtained through a *separate trusted operator channel*. A self-generated \`sha256\` next to an untrusted roster gives no trust and must not be used.
2. **Revocation freshness and key lifetime**: revocation validity no longer than 72 hours; reject duplicate signer IDs, duplicate key fingerprints, revoked/expired signers, non-Ed25519 keys, unauthorized roles and no-independent-reviewer declarations.
3. **Reviewer and operator separation**: distinct Japanese, P11, visual and accessibility reviewers; distinct screenshot producer and visual reviewer; separate Android checker and accessibility reviewer; distinct staging and rollback signers.
4. **Quorum of two independent release-operator attestations** over the exact candidate, J24 receipt hash, full evidence manifest hash, trust-roster and revocation digests, inspected timestamp and the explicit **no-auto-release** decision.
5. **Non-authorizing receipt**: even after valid cryptographic verification, the receipt says \`humanReleaseApprovalVerified:false\` and \`releaseAuthorized:false\`. An authorized independent operator must still verify signers' identity, source provenance, physical test performance, real browser callback, staging/deployment and rollback records.

### Offline usage

The operator maintains a private J24-compatible bundle (directory containing \`manifest.json\`, \`operator-attestations.json\`, original signed evidence files and \`screenshots/\`), plus a pinned, independently verified external trust roster and fresh revocation snapshot. J25 roster signers additionally require \`keyFingerprint\` (SHA-256 of Ed25519 SPKI DER), \`validFrom\`, and \`validUntil\`. Both operator attestations are Ed25519 signatures over the exact \`JSON.stringify\` order specified in \`evaluateAdmission\`, not arbitrary approval text.

\`\`\`sh
J25_CANDIDATE_SHA=<exact-candidate-sha> \
J25_TRUST_ROSTER_SHA256=<trusted-offline-roster-digest> \
J25_REVOCATION_SHA256=<trusted-offline-revocation-digest> \
node scripts/j25-independent-acceptance.mjs \
 --inspect-bundle /restricted/japanese-j25-evidence \
 --roster /restricted/approved-roster.json \
 --revocations /restricted/current-revocations.json
\`\`\`

The command deliberately does **not** approve, merge, deploy, register OAuth clients, mutate golden screenshots or treat browser emulation as physical Android. Keep actual signatures, reviewer contact details, access credentials, device recordings and account data outside source and CI.

## Required outstanding independent acceptance

- Real exact-head J15D D4 **42-case/126-PNG** comparison and independent visual review
- Physical installed Android PWA, TalkBack, real speaker/headphone/microphone and offline/resume checks
- Authorized first-party Account OAuth client registration and real Chrome/PWA callbacks
- Qualified independent Japanese-language review and P11 learner evidence
- Independent accessibility/product/release operations signoffs
- Exact staging release metadata, rollback to a known-good commit and human-verified restoration
- Explicit release approval under an operator-controlled, auditable policy

J26 may begin only after latest exact-head J25 automated CI is fully green, but actual production cutover is forbidden without independent human approvals.
