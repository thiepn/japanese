# J30 — Independent Release Evidence Audit & Operator Signoff Readiness

## Qualified predecessor

J29 draft PR #55 at head \`9c738c42305102749c3caf7593ce3eb3cde4ec20\` passed [CI run 38060921952](https://github.com/thiepn/japanese/actions/runs/38060921952), job 114238836200, with all 43 steps successful, 260 unit tests, 662 Playwright tests and 82 skips. The 42-file artifact #11674000879 has ZIP digest \`sha256:0ce43c82169f8fc09906c3f9aef7c60b5a6d8e2017112dd58671c615b65361a6\`. Independently checked ZIP bytes, J27 raw eight-record source digests and predecessor chain, and J28/J29 exact-head SHA and report digests. J29 has **no human approvals**.

## CI report and learner safety

J30 runs \`scripts/j30-primary-evidence-audit.mjs\` only *after* regenerating exact-head J27, J28 and J29 machine reports. The default (no CLI args) checks the canonical blocked J29 state and writes:
- \`artifacts/j30-signoff-readiness.json\`
- \`artifacts/j30-signoff-readiness.html\` — a standalone read-only, responsive, keyboard-compatible operator inspection document kept outside the learner application.

It shows nine acceptance domains **OPEN**, independently accepted screenshots 0/42 original cases and 0/126 original PNGs, zero admitted real external primary sources and an explicit discrepancy list. These are **missing human evidence**, not automatically passed release gates. All merge, deployment and release flags remain false.

## Independent operator-only source inspection

\`inspectPrimaryEvidenceAudit\` is an optional **offline** function for genuine independent operator inputs. All roots/pins are required from separate trusted custody systems; none are generated or authenticated by CI.

1. Supply the complete J29 independent external verification context (original J28 custody receipt; signed nine-domain witness packet; pinned witness roster, revocations, replay ledger and dual-signed release-key continuity; original observation files and exact candidate). J30 **re-runs J29 cryptographic witness inspection**, rather than trusting a source-controlled "passed" JSON receipt.
2. Supply a separately pinned \`thiepn-japanese-j30-primary-evidence-audit\` version-1 audit manifest, exact candidate, digest of the fresh J29 re-inspection, unique batch nonce, 9 records, \`status:"SUBMITTED_FOR_INDEPENDENT_HUMAN_REVIEW"\` and all authorization flags false. Each record binds one domain, \`primaryPath\`, \`primarySha256\`, \`primaryBytes\`, \`auditorId\`, \`signedAt\`, \`expiresAt\` and a detached Ed25519 \`signature\`.
3. Supply the actual bytes of nine source files under \`primary/<safe-name>.(json|bin|png|md)\`. J30 compares the SHA-256 digest of each original primary source with the digest attested in the **signed** J29 witness observation (screenshot archive, device session, real OAuth session, reviewer packet, staging receipt or rollback receipt). A valid match authenticates **byte equality to the claim**, not actual field-test execution, image authenticity, real participant identity, safety or acceptance.
4. Supply an independently pinned \`thiepn-japanese-j30-independent-auditor-roster\` version 1, minimum 9 distinct Ed25519 keys, declared identity audit, one verified role for each source domain, explicit independent-to-project state, validity windows and fingerprints. Source auditors must be disjoint from J28 custody signers, J29 field witnesses and J29 old/new authority custodians.
5. Supply the separately pinned fresh \`thiepn-japanese-j30-auditor-revocations\` snapshot (maximum 24 hours) and the independently current append-only \`thiepn-japanese-j30-independent-audit-ledger\` version 1, with separate \`consumedBatches\` and matching \`receiptDigests\`. Replayed nonces, revoked keys, stale snapshots, mismatched primary bytes and forged signatures cause failure.
6. Every auditor signs canonical \`auditPayload\` bytes (candidate, independently rederived J29 witness digest, audit nonce, source kind/path/sha256/length, signer ID and time window). The tool verifies the signatures but **does not establish human independence by itself**.

Example offline CLI (all files and SHA pins obtained from separate operator-controlled custody and supplied externally):

\`\`\`sh
export J30_CANDIDATE_SHA=<qualified-40-hex-candidate>
export J29_J28_RECEIPT_SHA256=<separately-pinned>
export J29_WITNESS_ROSTER_SHA256=<separately-pinned>
export J29_REVOCATION_SHA256=<separately-pinned>
export J29_LEDGER_SHA256=<separately-pinned>
export J29_CONTINUITY_SHA256=<separately-pinned>
export J29_PREVIOUS_ROSTER_SHA256=<separately-pinned>
export J30_WITNESS_LEDGER_FILE=/independent/j29-ledger.json
export J30_AUTHORITY_TRANSITION_FILE=/independent/authority-transition.json
export J30_AUDIT_MANIFEST_SHA256=<separately-pinned>
export J30_AUDITOR_ROSTER_SHA256=<separately-pinned>
export J30_AUDITOR_REVOCATION_SHA256=<separately-pinned>
export J30_AUDIT_LEDGER_SHA256=<separately-pinned>
node scripts/j30-primary-evidence-audit.mjs --inspect-primary \
 /independent/primary-package /independent/audit-manifest.json \
 /independent/auditors.json /independent/auditor-revocations.json \
 /independent/audit-ledger.json /independent/j29-witness-package \
 /independent/j28-custody-receipt.json /independent/j29-witness-roster.json \
 /independent/j29-witness-revocations.json
\`\`\`

Any successful structural inspection returns a **non-authorizing** discrepancy/readiness report and a proposed, **not written**, updated replay ledger. The real operator must independently adopt the new append-only ledger state. Independent pins and signature validation cannot substitute for witnessing an Android session or checking source-image authenticity.

## Explicit OPEN human gates
- **0/42 original visual cases and 0/126 original PNGs** independently compared/approved.
- No real installed Android PWA, TalkBack, audio and microphone physical acceptance.
- No real first-party THIEPN Account OAuth client, callback/persistence/logout acceptance.
- No independent Japanese/P11, original visual, accessibility, product or operator human signoff.
- No genuine staged exact-head deployment and physically witnessed known-good rollback, or independent real identity/revocation custody approvals.
- No final owner/operator human production permission. **Never** merge, deploy, create tags, change screenshot goldens or perform live data migrations in J30.

## Next (not started): J31 — Independent Operator Handoff & Release Decision Simulation

Build source-to-decision traceability and human-verifiable discrepancy closure packages. Conduct only simulated, default-denied decision workflows, reserving real release permissions for separately approved owner and operator actions.
