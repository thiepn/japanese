# J35 — Original evidence acquisition and real-world defect reproduction

## Boundary and prerequisite
J35 must be stacked directly on qualified J34 PR #61 exact source head 9d970bf6080bb4ac303da5310ec16a08038fcbbb. J34 CI 38077405549 passed 420 unit tests, 728 Playwright passed/82 skipped, and the 53-file artifact #11678563351 matched SHA-256 9963d0d80166baeb17d94b319bcb319732720560615770dc9f4e5268eb589bec with intact ZIP CRC. J34 P11/P21 release reports carry its actual candidate SHA but remain HOLD. No merged predecessor changes, releases, deployments, migration or real credential accesses are authorized here.

## Practical functionality
The tool at scripts/j35-original-evidence-repro.mjs links the exact J33 machine triage to its canonical J34 field kit. It rejects a replaced, modified or cross-SHA machine field kit, and emits:
- artifacts/j35-evidence-reproduction.json — 32 observable check IDs (6 Account/OAuth; 14 physical Android/PWA; 6 language/P11; 6 visual/rollback); every one NOT_TESTED by default. All real-world/human/release acceptance fields remain FALSE.
- artifacts/j35-evidence-reproduction.md — human-readable action and issue-reproduction list, never claiming independent approval.

CI **does not** receive original screenshots, protected sources, device recordings, OAuth credentials, real witness signatures or actual user-produced reviewer packets. Default CI mode has **no** external inputs. This is a product/usefulness tool, not an additional release gate.

### Optional original operator observation processing
1. Get J34's exact-head offline HTML field kit from that same CI artifact. Open it **locally** on a device, not through an unknown website.
2. Only on an independently **authorized disposable staging candidate with the exact tested SHA**, enter observed release-meta.json SHA and the actual results. Record Android version and TalkBack/permissions observations in nonsecret source notes. For OAuth use only independently approved disposable THIEPN Account identities.
3. Export unverified J34 JSON from the HTML. The operator's self-report always has independentlyWitnessed:false, no authority and never becomes an external P11/P21 acceptance record.
4. Use this locally in a qualified J35 checkout after generating its ordinary J33/J34 reports:

    J35_CANDIDATE_SHA=<exact-J35-head> node scripts/j35-original-evidence-repro.mjs --operator-export /local/private/j34-unverified-field-session.json

J35 validates structure and exact-candidate match using the inherited J34 validator. It produces **only observation status, check ID, next reproduction step and hashes of any note/evidence reference**. Raw text, usernames, account IDs, private recordings, tokens, callback codes and original path strings are never placed in the derived reports. A reported PASS remains an **unverified operator statement**; a reported FAIL becomes an actionable **reproduction request**, not a confirmed code defect. No automated review acceptance is inferred.

A J34 export made against the old J34 SHA is **not valid evidence for a new J35 code SHA**, even if the changed source only adds tooling; do not relabel it to bypass source binding.

### Optional original visual bytes (independently sourced only)
This phase **does not generate** the original 42 cases or 126 images. Real original files must be obtained from authorized independent custody. Never use goldens, machine placeholders or synthetic fixtures as proof of original asset authenticity.

Prepare an external JSON manifest, outside this repository:

- schema: thiepn-japanese-j35-original-files
- version: 1
- candidateCommit: exact J35 source SHA
- humanApprovedCases: 0
- humanApprovedPngs: 0
- cases: exactly 42 ordered IDs VIS-001…VIS-042, each with nonempty originalCaseLabel and humanCompared:false
- pngs: exactly 126 ordered IDs PNG-001…PNG-126, each with caseId referring to one of those 42 cases, a unique originalFilename, safe relativePath beginning original/ and ending .png, actual byte length, lowercase SHA-256 and humanApproved:false.

Every case must have at least one real file assigned. An example shape for ONE entry (NOT a real original case or approval) is:

    {"id":"VIS-001","originalCaseLabel":"REPLACE WITH REAL SOURCE CASE LABEL","humanCompared":false}
    {"id":"PNG-001","caseId":"VIS-001","relativePath":"original/replace-with-real-file.png","originalFilename":"replace-with-real-file.png","sha256":"<REAL 64-HEX HASH>","bytes":12345,"humanApproved":false}

These are **format examples only**, not supplied real images or evidence. The manifest and PNG bytes must originate externally; the source tool does not create them.

Offline invocation, still without release authority:

    J35_CANDIDATE_SHA=<exact-J35-head> node scripts/j35-original-evidence-repro.mjs --original-manifest /authorized/private/source-manifest.json --original-root /authorized/private/archive

Both optional modes may be combined with --operator-export in one invocation. For each original image, the local CLI rechecks path confinement, no symlink aliasing, byte length, SHA-256, PNG dimensions, ordered IHDR/IDAT/IEND structure and CRC of all PNG chunks. Only hash/coverage summaries appear in the generated reports. **Byte correctness does not authenticate original provenance, approve visual differences or prove reviewer identity**. Genuine human visual and accessibility review must still occur separately.

## Real owner/reviewer actions required
1. Owner must first expressly authorize a disposable, nonproduction exact-J35-head staging environment, real physical Android/PWA testing and disposable OAuth test accounts. If no staging is authorized, source development ends at machine readiness.
2. Actual Android operator must install as standalone PWA on a real device and witness 12 P21 checks plus TalkBack; explicitly reproduce faults in the correct build and report the minimal nonsecret sequence.
3. Actual THIEPN Account operator must test first-party Google consent/PKCE callback, verified identity, restart, logout and account/guest isolation. Stop on privacy or session-owner defects. The CI tool cannot access or perform this flow.
4. Actual Japanese reviewer must examine kana/kanji/readings/grammar/native audio and source licensing; independent P11 qualified teacher/tutor must review at least six representative original writing and speaking artifacts.
5. Independent visual custodian must supply the authentic 42-case mapping and 126 source PNGs and the human reviewer must personally inspect reference/candidate/diff plus contrast/reflow; machine source slots are not approvals.
6. Separately authorized operations reviewer must witness actual exact-build staging identity, controlled rollback and restoration of independently confirmed known-good bytes. No rollback may be simulated as a pass.

## Test, integration, and release restrictions
Adversarial tests cover cross-SHA, forged release/identity flags, unreadable or malicious path, symlink, tampered PNG SHA or CRC, incomplete 42/126 mapping, forged observed pass, and note privacy. CI runs J35 after J33/J34, retaining the inherited entire unit, content/provenance, typecheck, build and full cross-viewport Playwright suite.

No screenshot goldens are edited. No code here can mark nine independent release domains closed, turn on a feature flag, merge, deploy, migrate, tag, access protected originals, handle real secrets or publish a stable release. A new exact-head real-world acceptance requires real humans/hardware and a separately approved operation.
