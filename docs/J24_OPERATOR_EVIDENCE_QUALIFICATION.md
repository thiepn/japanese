# J24 — Operator evidence provenance qualification

## Dependency and scope

J23 PR #49 exact head \`7c610fa35cf8c62655408ea585e74b385825bbfe\` passed all 37 GitHub Actions steps in [run #38000189450](https://github.com/thiepn/japanese/actions/runs/38000189450), including J20/J22 focused suites, full Playwright, exact-head J23 reconciliation and uploaded qualification evidence. J24 is a separate stacked draft branch on J23. **No authorization to merge, deploy, register OAuth, modify baselines, or promote production is implied.**

## Automated CI

After full browser E2E and J20–J23 artifact generation, \`node scripts/j24-operator-evidence-qualification.mjs\` checks exact-head J23 machine-reconciliation provenance and writes \`artifacts/j24-operator-readiness.json\`. Its **mandatory** decision is \`BLOCKED_OPERATOR_EVIDENCE_NOT_PRESENT\`. CI cannot submit or authorize real human evidence.

## Offline evidence intake

An authorized operator may separately assemble an exact-candidate bundle on an access-controlled workstation with:
- A real 42-case J15D D4 comparison report plus all 126 actual PNGs in \`screenshots/\`. J22 validates exact commit, pinned baseline, dimensions, pixel drift, CRC and image SHA-256 before constructing its original unsigned visual packet.
- The completed J21 original-source language worksheet, reviewed by an independently authenticated Japanese-language professional, plus independently reviewed P11 productive-learner evidence.
- Completed J22 visual/accessibility reviewer worksheet, independently verified accessibility signoff, real J16B physical Android/PWA/TalkBack/mic/headphones session and live THIEPN Account OAuth client/session callback record.
- Actual staging deployment metadata showing the exact tested SHA, and the documented **performed** rollback to a distinct verified previous commit.
- A \`manifest.json\` with the schema \`thiepn-japanese-j24-independent-evidence-bundle\`, \`candidateCommit\`, \`releaseAuthorized:false\`, \`humanApprovalGranted:false\` and \`records\` keyed by the nine names in \`REQUIRED_ROLES\` in the source module. Each submitted record needs a relative JSON file, exact candidate SHA, SHA-256 file digest and a detached Ed25519 attestation. \`exactVisualArchive.imagesDigest\` also binds all 126 screenshot hashes.
- An **independently maintained**, externally verified \`thiepn-japanese-j24-external-trust-roster\` keyring mapping signer IDs to Ed25519 public keys, authorized roles, \`revoked:false\` and \`independentToProject:true\`. Neither keys nor approvals are provided by CI. The runtime checks the roster syntactically and cryptographically, **not the actual holder's identity**.

For each attestation, sign the UTF-8 \`JSON.stringify\` of \`{schema:"thiepn-japanese-j24-detached-evidence-signature", candidateCommit, kind, file, sha256, imagesDigest:<digest-or-null>, signerId}\` using the reviewer's private Ed25519 key; store only base64 signature and public key roster reference. Never commit private keys, tokens, account IDs, raw learner recordings or completed private reviews to this source branch.

With real review files and the corresponding exact-head J21 packet locally present:

\`\`\`bash
J24_CANDIDATE_SHA=<exact-40-hex-commit> node scripts/j24-operator-evidence-qualification.mjs \
  --inspect-bundle /restricted/japanese-j24-evidence --roster /restricted/approved-trust-roster.json
\`\`\`

The tool rejects mismatched SHA, missing category, modified hash, unsigned/revoked signer, role mismatch, invalid real-device checklist, incorrect OAuth/staging or rollback details, missing screenshots, symlinks and path traversal. A successful **syntactic/cryptographic** receipt explicitly states:

- \`signaturesValidAgainstSuppliedRoster:true\`;
- \`signerRosterExternallyAudited:false\` and \`humanIdentityIndependentlyVerified:false\`;
- \`releaseAuthorized:false\`.

That is not proof that a human genuinely performed the activity or a stable-release approval. Independent operators must authenticate the root trust roster and witnesses, examine primary device and deployment records, check the evidence against the exact staged build and independently authorize release on a separate auditable evidence ref.

## Outstanding release gates

The repository's J15D/P21/P11 physical, visual, language and signoff manifests are **unchanged/pending**, as is first-party OAuth registration. No source-branch CI pass, test fixture, static document or cryptographic signature automatically clears those human-only gates. Future J25 must requalify exact J24 head and external acceptance before any release decision; a live production deployment requires separate explicit approval.
