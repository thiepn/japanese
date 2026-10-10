# J28 — Independent Evidence Custody & Operator Acceptance Workbench

## Prerequisite verified

J27 draft PR #53 at exact SHA \`3b76fdf73be6da793676ae9309b1020294706c30\` passed [CI #38035248667](https://github.com/thiepn/japanese/actions/runs/38035248667), with 260 unit tests, 638 browser tests and the 38-file release evidence archive (\`sha256:49a590c68e9c9bed905c0abdd7f3ce21829119266bb50efad8e3e68ccf36eee2\`). The eight raw upstream record hashes, predecessor chain and J27 report hash were independently checked.

## Automated default-denied path

After J20–J27 exact-head CI report generation, \`node scripts/j28-independent-custody.mjs\` checks J27's exact candidate SHA, serialized report digest, eight-phase chain, manifest digest root and all prior blocked approval flags. It writes:
- \`artifacts/j28-operator-workbench.json\`
- \`artifacts/j28-operator-workbench.html\`

The HTML is a static, accessible, print-ready, read-only **offline operator report**, not a public learner route. It displays nine OPEN acceptance domains and 0/42 independently accepted screenshot cases, 0/126 independently accepted images. Neither CI nor the HTML imports external files, keys or human permissions.

## Optional external operator-only offline custody inspection

All external files and pins must come from **separately controlled** independent custody channels, NOT from the repository, workflow output or same evidence folder. The verifier deliberately does not produce signing keys or trust anchors.

- Independently pin SHA-256 digests for the actual J27 candidate report JSON, Ed25519 reviewer roster, fresh revocation snapshot and externally controlled replay ledger. Pass these in \`J28_J27_SHA256\`, \`J28_ROSTER_SHA256\`, \`J28_REVOCATION_SHA256\`, \`J28_LEDGER_SHA256\`.
- Provide \`bundle/manifest.json\` and exactly nine raw files under \`bundle/evidence/<safe-name>.(json|bin|png|md)\`. The manifest schema is \`thiepn-japanese-j28-external-custody\`, version 1. Fields include \`candidateCommit\`, \`j27ReportDigest\`, a unique 32-hex-digit \`batchId\`, \`createdAt\`, \`expiresAt\`, \`records\`, and explicit \`releaseAuthorized:false\`, \`mergeAuthorized:false\`, \`deploymentAuthorized:false\`.
- Each record binds a known evidence \`kind\`, safe \`path\`, exact raw \`sha256\`, \`bytes\`, unique \`signerId\`, \`signedAt\`, \`expiresAt\` and detached base64 Ed25519 \`signature\`. The exact canonical signed message is returned by \`signatureMessage(recordWithCandidateJ27AndBatch)\`.
- Independently pinned roster schema \`thiepn-japanese-j28-independent-roster\` (version 1): \`signers\` with unique \`id\`, \`roles\`, \`publicKeyPem\`, correct \`keyFingerprint\`, \`independentToProject:true\`, \`identityAuditedByOperator:true\`, \`identityEvidenceSha256\`, \`revoked:false\`, \`validFrom\`, \`validUntil\`. Each custody domain needs a unique signer. Identity assertions in the roster **are not self-authenticating**.
- Fresh revocation snapshot schema \`thiepn-japanese-j28-independent-revocations\` (version 1): \`revokedIds\`, \`validFrom\`, \`validUntil\` (up to 24 h). Ledger schema \`thiepn-japanese-j28-external-ledger\` (version 1): \`candidateCommit\`, arrays of unique \`consumedBatchIds\` and matching \`receiptDigests\`, externally pinned separately.

From the exact checked-out candidate with its generated J27 artifact:

\`\`\`sh
J28_CANDIDATE_SHA=<exact-head> \
J28_J27_SHA256=<independent-sha256> \
J28_ROSTER_SHA256=<independent-sha256> \
J28_REVOCATION_SHA256=<independent-sha256> \
J28_LEDGER_SHA256=<independent-sha256> \
node scripts/j28-independent-custody.mjs --inspect-external \
 /independent/bundle /independent/roster.json \
 /independent/revocations.json /independent/ledger.json
\`\`\`

Inspection rehashes raw evidence, validates detached signatures, unique signer roles, independent key fingerprints, clock windows and revoked IDs; blocks replayed batch IDs or receipts; emits a **non-authorizing receipt** and \`proposedLedger\` for independently witnessed external adoption. It never updates the ledger itself. A stale independent ledger pin cannot prevent replay; the operator must obtain a current ledger snapshot independently on each admission.

## Explicit OPEN gates

- 0/42 original visual comparison cases and 0/126 original screenshot images independently accepted.
- Real installed Android PWA / TalkBack / audio / microphone testing remains unperformed.
- Real THIEPN Account Google OAuth registration, callbacks and logout remain unverified.
- Independent Japanese/P11, visual, accessibility, product and operations approvals are absent.
- Genuine exact staging provenance, witnessed rollback, separate release approval and production cutover authorization are absent.

Cryptographic custody means **only that signed bytes match an externally pinned roster**; it never attests real-world truth, physical witnessing or final human identity. CI records remain blocked and cannot merge, tag, migrate or deploy. No golden screenshots were regenerated.

## Next phase

**J29 — Witnessed Acceptance & Release-Authority Reconciliation** (not started). Cross-check externally witnessed visual, physical device, Account OAuth, Japanese review and staging/rollback outcomes against exact-SHA independently pinned custody records. Produce an operator reconciliation that is still default-denied until explicit separate authorization.
