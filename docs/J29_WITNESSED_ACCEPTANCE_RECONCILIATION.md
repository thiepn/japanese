# J29 — Witnessed Acceptance & Release-Authority Reconciliation

## Verified prerequisite and custody boundary
The predecessor is J28 stacked draft PR #54 at exact SHA \`ceb333bcf1148f08e309d427ee14e78cd5f9de7b\`, [CI #38055432282](https://github.com/thiepn/japanese/actions/runs/38055432282), 649 passed / 82 skipped Playwright tests (one P13 flaky retry), 260 unit tests, and 40-file \`b2-release-qualification\` artifact #11672111319 (\`sha256:23b56e660b10bf0676d7ccbdbb6b0a167005fe58a20caf39f0430e774ed1da14\`). The J27 predecessor-linked evidence sequence, raw J20–J26 archive record digests and J28 report exact-head binding were independently checked. This phase is a separate stacked draft, not approval to merge or deploy.

## CI-generated operator reconciliation

\`node scripts/j29-witness-reconciliation.mjs\` runs **only after J27 and J28 machine reports have been regenerated at the same CI SHA**. It checks the J27 chain and requires an *exact canonical blocked J28 report*, then writes:
- \`artifacts/j29-operator-reconciliation.json\`
- \`artifacts/j29-operator-reconciliation.html\` — static, offline, mobile-readable, accessible **read-only** operator report; never shipped as a learner route.

The machine report always says \`BLOCKED_WITNESSED_ACCEPTANCE_AND_RELEASE_AUTHORITY\`, with nine acceptance domains **OPEN**, independently accepted original visual cases **0/42**, accepted original PNGs **0/126**, and no human approval, merge, deployment or release authority. CI never imports private reviewer packets or signs approvals.

## Optional independent offline operator inspection

A separate operator may use \`--inspect-witness\` only with real **external** independently pinned inputs and independently verified source observations. No trusted keys, authentic witness reports, hardware, OAuth client or release decisions are provided by this repository.

Requires:
- A J28 \`thiepn-japanese-j28-custody-inspection\` receipt from an independently run J28 verifier, pinned by a **separate trusted channel**, bound to the J27 exact SHA, 9 evidence-record digests and \`actualEvidenceTruth:"NOT_ATTESTED_BY_AUTOMATED_TOOL"\`. J29 validates the receipt structure and pin, **not a replacement for rerunning the J28 verifier against genuine source bytes**.
- \`bundle/manifest.json\`, schema \`thiepn-japanese-j29-witness-packet\`, version 1. It binds \`candidateCommit\`, \`j28ReceiptSha256\`, distinct 32-hex \`batchId\`, \`createdAt\`, \`expiresAt\`, nine \`records\`, and all release/approval flags explicitly false.
- Nine \`observations/<safe-name>.json\` raw source statements, schema \`thiepn-japanese-j29-observation\`, exact candidate, distinct review domains, and \`statement:"EXTERNAL_WITNESS_CLAIM_NOT_AUTOMATED_ACCEPTANCE"\`. Domain-specific factual *claims* include 42 cases/126 original PNGs plus archive hash, physical installed Android PWA/TalkBack/audio/mic, genuine Account OAuth registration/callback/persistence/logout, independent Japanese/P11 and accessibility review hashes, same-SHA staging deployment, and rollback to a different known-good commit. No machine treats these claims as actual human approval.
- A separately externally pinned witness roster (\`thiepn-japanese-j29-independent-witness-roster\`) with eleven independent Ed25519 signer entries, unique keys, audited identity declarations, domain scopes, expiry and \`previousRosterSha256\` independently pinned outside the repo. A separately pinned \`thiepn-japanese-j29-revocations\` snapshot must be valid at inspection (maximum 24h). A separately pinned \`thiepn-japanese-j29-independent-replay-ledger\` must be current and have no previously consumed batch/packet.
- Every witness signs the canonical \`witnessPayload\` over the exact candidate, J28 receipt digest, nonce, domain, J28 primary record SHA-256, separately hashed raw observation, signer ID and time window. Witnesses must be distinct from J28 custody signers and release-authority signers. This is independent evidence **structure**, not proof of actual physical or source truth.
- A separately pinned \`thiepn-japanese-j29-authority-transition\` with old and new signer signatures over \`continuityPayload\`, including predecessor roster SHA, current roster SHA, revocation SHA, candidate and receipt SHA. Both key custody signers must be independent of all nine reviewers. The signed transition **only** demonstrates the supplied key custody transition, never final release authorization.

From an exactly qualified local checkout with J27/J28 generated artifacts:

\`\`\`sh
J29_CANDIDATE_SHA=<exact-40-hex-head> \
J29_J28_RECEIPT_SHA256=<separate-pin> \
J29_WITNESS_ROSTER_SHA256=<separate-pin> \
J29_REVOCATION_SHA256=<separate-pin> \
J29_LEDGER_SHA256=<separate-pin> \
J29_CONTINUITY_SHA256=<separate-pin> \
J29_PREVIOUS_ROSTER_SHA256=<separate-pin> \
node scripts/j29-witness-reconciliation.mjs --inspect-witness \
 /independent/bundle /independent/j28-custody-receipt.json \
 /independent/witness-roster.json /independent/revocations.json \
 /independent/replay-ledger.json /independent/authority-transition.json
\`\`\`

The printed structurally verified receipt proposes an updated replay ledger but **never writes it**; custody controls require an independent append-only ledger with operator-verified adoption. A stale externally pinned ledger snapshot cannot reliably prevent replay. The tool cannot witness actual Android, Account OAuth or original screenshots; it cannot validate the independence of real people from a self-declared roster, and it cannot grant final release approval.

## Explicitly blocked
0/42 real original visual comparisons, 0/126 real source images; genuine Android PWA/TalkBack/audio/microphone, Account OAuth, Japanese/P11 review, independent accessibility/product/operations signoffs, staged release and witnessed rollback, independent signer identity and final human cutover decisions remain **OPEN**. No screenshot goldens, live data, production infrastructure, migrations, deployment, tags, merges or human signoffs may be modified in J29.

## Next (not started): J30 — Independent Release Evidence Audit & Operator Signoff Readiness
Validate independently archived witness/source pairs and cross-operator receipt continuity, expose verifiable discrepancies, and prepare manual human acceptance handoffs with a separate default-denied authorization gate.
