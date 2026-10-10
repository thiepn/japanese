# J31 — Independent Operator Handoff & Release Decision Simulation

## Exact-head prerequisite

J30 stacked draft PR #56 at SHA \`c0eeac9e6b15d32697f38d10adbaf4ebd58a619a\` passed [CI #38065184935](https://github.com/thiepn/japanese/actions/runs/38065184935): **381 unit/release-security tests**, 674 Playwright passed, 82 skipped, 22 focused PWA and 16 focused accessibility tests. The 44-file artifact #11675218520 ZIP SHA-256 is \`db3dd4e34ed419253b4d4e560f01aff6e7ea184fa391acc10bc49cb0f8a72450\`. Its eight J20–J26 original raw records, J27 predecessor chain, J27/J28/J29/J30 exact-head SHA bindings and all default-denied decisions were independently checked.

J31 is stacked separately on this head. **No one has independently accepted original source images or actual physical/Account signoffs.**

## Default-denied CI outputs

\`J31_CANDIDATE_SHA=<exact-current-PR-SHA> node scripts/j31-operator-handoff.mjs\` runs after J27–J30 records have been regenerated at **the same exact head**. It rejects a modified or noncanonical J30 blocked report and emits two machine-owned records in the release evidence archive:

- \`artifacts/j31-operator-handoff.json\`: exact-head J27–J30 digest references and a nine-entry, deterministic, reviewable OPEN gap register, each with next human action and a permanent simulated DENY decision.
- \`artifacts/j31-operator-handoff.html\`: standalone offline read-only operator handoff, desktop/mobile/200%-zoom responsive, accessible table/status, no production or approval controls, excluded from the learner application.

The **real** unresolved totals must remain **9/9 open**, **0/42 original visual comparisons independently human accepted**, **0/126 original PNGs independently human accepted**; CI cannot promote any from a synthetic or cryptographically consistent packet.

## Safe decision simulation

A human may author a LOCAL and explicitly hypothetical scenario:

\`\`\`json
{
  "schema": "thiepn-japanese-j31-dry-run",
  "version": 1,
  "candidateCommit": "<EXACT_SHA>",
  "testOnly": true,
  "requestedDecision": "SIMULATE",
  "hypotheticalPasses": ["exactVisualArchive"],
  "humanApproval": false,
  "releaseAuthorized": false
}
\`\`\`

Run \`J31_CANDIDATE_SHA=<EXACT_SHA> node scripts/j31-operator-handoff.mjs --simulate ./scenario.json\` from the same checked-out exact-head tree with machine artifacts. Any subset, even all nine \`hypotheticalPasses\`, yields \`simulationDecision:"DENY"\`, \`decision:"DRY_RUN_DENIED_NOT_RELEASE_APPROVAL"\`, and all production/human permission flags false. Attempts to present real production decisions, a human approval, a changed SHA or duplicate domains fail rather than being silently reinterpreted.

## Separate offline custody of gap handoff (not human acceptance)

\`inspectExternalHandoff\` can inspect **only externally pinned** file bytes, not perform approval. It requires separate trusted-channel SHA-256 pins for:

- a \`thiepn-japanese-j31-handoff-packet\` (version 1, exact SHA, bound J30 canonical blocked report digest, unique nonce, 9 signed domain records, explicit \`MISSING_EVIDENCE_REVIEW\` and all authority flags false);
- a \`thiepn-japanese-j31-independent-operators\` roster (version 1, min 11 independently asserted, fingerprinted Ed25519 signing keys, separate roles for 9 reviewers and outgoing/incoming custody);
- the prior independent custody SHA root (not derived from this repository), a current (maximum 24h) \`thiepn-japanese-j31-revocations\` snapshot, and an \`thiepn-japanese-j31-independent-ledger\` replay history of unique batch IDs + packet digests;
- a \`thiepn-japanese-j31-handoff-custody\` transition with independent sender and receiver detached Ed25519 signatures, bindable to the exact packet SHA, candidate SHA, current/prior custody SHA and revocation snapshot.

Each record has \`kind\`, deterministic \`discrepancyId\`, \`closureState:"OPEN"\`, \`evidenceState:"EXTERNAL_HUMAN_ACCEPTANCE_MISSING"\`, distinct \`reviewerId\`, \`reviewedAt\`, \`expiresAt\` and detached base64 \`signature\`. Signers must be in the appropriate domain scope; custody roles must not overlap any of the nine reviewers. Signed message formats are exported by \`reviewSignatureMessage\` and \`custodySignatureMessage\`; neither produces signing keys.

\`\`\`sh
export J31_CANDIDATE_SHA=<EXACT_HEAD>
export J31_PACKET_SHA256=<EXTERNALLY_PINNED_SHA256>
export J31_ROSTER_SHA256=<EXTERNALLY_PINNED_SHA256>
export J31_PREVIOUS_CUSTODY_SHA256=<EXTERNALLY_PINNED_PREDECESSOR>
export J31_REVOCATION_SHA256=<EXTERNALLY_PINNED_SHA256>
export J31_LEDGER_SHA256=<EXTERNALLY_PINNED_SHA256>
export J31_CUSTODY_SHA256=<EXTERNALLY_PINNED_SHA256>
node scripts/j31-operator-handoff.mjs --inspect-handoff \
 /independent/packet.json /independent/roster.json \
 /independent/revocations.json /independent/replay-ledger.json \
 /independent/custody.json
\`\`\`

The verifier checks pins **before parsing**, exact-SHA source ancestry, signer key fingerprints, revocations, expiry, role separation, missing-evidence gap status, signed statements, duplicate or replayed batch IDs/packet hashes, and dual custody signatures. It prints a **non-authorizing** inspection and a **proposed but unwritten** replay ledger append. An external operator must independently acquire a *current* ledger before accepting custody and must actually commit the ledger append in trusted storage. A stale externally pinned ledger cannot solve replay across parallel admissions. An externally pinned roster or identity-attested field is **not proof of real human identity, source authenticity, or independence**; that requires authorized operator verification outside this software.

## Human handoff blockers preserved

All nine external acceptance domains stay OPEN. No actual Android PWA/TalkBack/audio/microphone test, first-party THIEPN Account OAuth/callback/persistence acceptance, original screenshot 42-case/126-image independent review, qualified independent Japanese/P11 learner language review, visual/accessibility/product approval, real exact-head staging, independently witnessed rollback, or final production human authority is available.

The tool performs no merge, tag, deployment, Account/Core production access, migration, golden screenshot edits or permission escalation.

## J32 proposal (not started)

**J32 — Independent Signoff Packet Reconciliation & Real-World Acceptance Preparation**. Add operator-checkable original visual/physical/Account/Japanese evidence manifests, independent reviewer audit trails, artifact discrepancies and device acceptance procedures, retaining release default-DENY until actual human acceptance and separately authorized production permission.
