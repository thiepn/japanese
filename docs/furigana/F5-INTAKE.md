# F5 — Independent furigana review and physical-pilot evidence intake

**Source-only, conservative intake. Not a signoff mechanism.** This phase preserves F1 #71, F2 #72, F3 #73, F4 #74 and the original P11/J21/J22/P21/P22 gates. The intake validates structure and byte integrity, **not** truth of an eyewitness statement, cryptographic signer authority, human identity, pronunciation correctness, device authenticity, original screenshot provenance, or a production deployment.

## Baseline and observed state

- F4 draft head: `2ba4b5eb4df6a1b9187fe3cb103767c392af2e2a` (CI 38176202279: 93 passed unit-test files, 782 passed Playwright tests, 82 skipped); original artifact 11716730224 SHA-256 `bc3129490f8e4ab194c68ba530d265c1a940348011d01bef163a3d6916ecd59f` (55 entries, CRC OK).
- There are 240 mandatory source-anchored editorial cases and 15 physical-pilot checks. All remain NOT_TESTED in checked-in templates.
- F4's 33 source/token discrepancies include **three exact unresolved alignment cases**: `sentence-a1-040`, `sentence-a1-043`, `sentence-a1-072`. They cannot be automatically approved.
- In F4 artifacts, J21 independent review pending; J22 42-case/126-image original visual archive and independent accessibility/device review pending; J32/J33/J35 original witness custody not accepted; P21 13/17 checks and HOLD; P22 HOLD. No completed independent reviewer/device submissions were found in checked-in source, PR #74 reviews/comments, or that CI archive.

## Preparing genuine material

1. Independently obtain the actual reviewed build SHA (40 lowercase hexadecimal), approved disposable test-origin URL, original observations, and non-sensitive raw evidence files. The reviewer should fill a **copy** of `docs/furigana/f4-review-submission.template.json`; the physical operator should independently fill a **copy** of `docs/furigana/f4-device-witness.template.json`. Keep the source snapshot and record actual candidate SHA in both, not a deployment that merely happens to display the same content.
2. Set per-item `PASS`, `FAIL`, or `NOT_TESTED`. PASS requires a meaningful `observedReading` and `reason` for editorial cases; FAIL additionally requires `expectedCorrection` and reproducible `reproduction`. Physical observations require actual evidence; do not turn an automated browser profile into a physical handset result. Record visible observations verbatim.
3. For submitted cases with observed results, include the claimed independent reviewer's `label`, `role`, `reviewedAt` ISO UTC, `independentFromImplementation: true`, and `consentToShareEvidence: true`. Provide `independenceEvidenceRef` to a byte-backed independent attestation. For device testimony include the operator and hardware fields, genuine HTTPS staging origin, and `attestationEvidenceRef`. These are **unverified declarations** until a separate trusted operator authenticates the person/device and attestations.
4. Create a local evidence directory. Do not check in sensitive user data, personal recordings, authentication secrets or protected material. Each referenced file must have a digest and exact byte count in an evidence manifest. Example (fill with **actual bytes**; placeholders are not acceptable for a real submission):

```json
{
  "schema": "thiepn-japanese-f5-evidence-manifest",
  "schemaVersion": 1,
  "candidateCommit": "<actual 40-character qualified build SHA>",
  "files": [
    {
      "ref": "observations/a1-time-reading.txt",
      "sha256": "<actual 64-character SHA-256>",
      "sizeBytes": 100,
      "kind": "observation"
    },
    {
      "ref": "attestations/editor.txt",
      "sha256": "<actual 64-character SHA-256>",
      "sizeBytes": 100,
      "kind": "attestation"
    }
  ]
}
```

Manifest references are relative to the provided evidence root; all referenced raw bytes are inspected and hashed. Unsafe paths, symlinks, missing or extra unreferenced claims, incorrect SHA-256, unexpected IDs, contradiction with the 240 case IDs or 15 device IDs, missing independent-attestation bytes, or an asserted release authorization are rejected. Correct digests prove equality of the supplied bytes, **not** their trustworthiness.

## Non-privileged operation

Inventory-only (valid even before any submission):

```bash
node scripts/f5-furigana-evidence-intake.mjs --candidate <exact F5 SHA>
```

Offline local intake when genuinely received:

```bash
node scripts/f5-furigana-evidence-intake.mjs \
  --candidate <exact independently verified build SHA> \
  --reviewer /private/path/completed-review.json \
  --device /private/path/completed-device.json \
  --manifest /private/path/manifest.json \
  --evidence-dir /private/path/evidence-files
```

The script returns a JSON **receipt only**, with self-declared pass/fail/not-tested counts and unverified identity claims. It never writes back to source, changes a verdict, modifies a release record, creates reviewer signoffs, or flips any release gate; even a structurally complete all-PASS submission always ends with `NO_GO_INDEPENDENT_OPERATOR_AND_OWNER_GATES_REQUIRED`. Absent evidence is shown as NOT_PROVIDED and all cases NOT_TESTED.

## Reconciliation and next authorization

1. Independently authenticate reviewer identity and separation from the developer, genuine evidence provenance and original-file custody, witnessed Android/TalkBack/keyboard/200% zoom and exact served build identity. Resolve three ambiguous A1 sentences with a qualified independent linguist, correct source only in a new reviewed draft if needed, then demand exact-head CI requalification.
2. Submit any separately required J21 language-review worksheet; original J22 42 cases / 126 images; P11 learner review; independent accessibility; J32/J35 source integrity; production OAuth privacy; P21 device gate and P22 owner signoff. F5 **does not replace or waive** any of these.
3. Hold all decisions until a trusted human owner explicitly reconciles the original evidence after independent review. Do **not** merge, deploy, migrate, touch secrets, mutate learner state or authorize stable release in this phase.
