# J33 — Independent Acceptance Discrepancy Triage & Operator Escalation

## Status and exact prerequisite

J33 is a separate stacked draft on fully qualified J32 PR #58 at repaired exact head decd14f16fecfc31fd0010426c79689892d718ec. J32 CI 38072713366 passed (81 Vitest files; full browser 710 passed, 82 skipped), and its independently downloaded 49-entry artifact ZIP SHA-256 b51efe1dea7f15aa660799a83b366b571e69cbae9b09a3bbd8d09d5b42711949 passed ZIP CRC, original J27 chain and J28–J32 report-binding checks.

No merge, deployed release, stable tag, migration, production signoff or original physical/human acceptance is authorized by J33.

## Purpose and user value

Convert J31/J32's nine source-backed OPEN evidence domains into a prioritized and independently inspectable set of next actions. J33 does not make another learner-facing screen, build a competing approval authority or certify any external claim. The generated read-only HTML is for human operators, not the public application.

The priority order is explicit: physical Android/TalkBack/PWA, real first-party Account OAuth, Japanese content review, P11 independent productive-language review, all 42 original visual cases and 126 original PNGs, then visual accessibility, separate accessibility approval, exact staging identity and independently demonstrated rollback.

The report retains the original J31 discrepancy identifiers and upstream actions. It identifies the required witness role, original evidence needed, concrete next action, priority, source-only triage label and release impact for each category. All nine remain OPEN and BLOCKING even if notes are submitted.

## Machine verification

scripts/j33-acceptance-triage.mjs independently recomputes J32's canonical blocked result from the exact candidate's J27/J28/J29/J30/J31 files; it refuses mismatch, swapped head, amended release flags, altered chain, invented closure and missing cases. It binds its report to the exact J31/J32 report digests and upstream J27 root.

Normal CI execution, after J32's machine report, runs:

node scripts/j33-acceptance-triage.mjs

It generates:
- artifacts/j33-acceptance-triage.json
- artifacts/j33-acceptance-triage.html
- artifacts/j33-operator-observations-blank.json

The blank observation template contains no eyewitness accounts, images, external reviewer identities, signatures or acceptance decisions.

## Optional local operator notes (NOT source verification)

An operator may fill the blank template with actual preliminary discrepancy reports and run:

node scripts/j33-acceptance-triage.mjs --observations /path/to/private-notes.json

Set J33_CANDIDATE_SHA to the exact candidate commit. The envelope must match the canonical J32 report digest. Each uniquely identified observation must explicitly record reporter role, time, domain, description, a non-approving assessment and denial of independent identity/human/release authority. Assessment values are MISSING, SOURCE_SUPPLIED_UNVERIFIED, DEFECT_REPORTED or CONFLICT_REPORTED. Source paths, when present, must be safe relative evidence paths and have a SHA-256 reference. J33 does not read, authenticate, prove authorship of or admit those source bytes. The note label and checksum are an investigation lead, not validated evidence.

J33 rejects contradictory release claims, fake approval, wrong candidate/digest, duplicate observation IDs, unsafe path references and malformed entries. Reported conflicts and defects are escalated for independent reproduction; they never close acceptance.

Use J32's externally pinned original-byte/signature verifier and actual independent human procedures to authenticate sources separately. Do not treat J33 note intake as a substitute for J32.

## Real-world acceptance checklist

1. On a genuine Android device, record model/OS/build SHA, standalone PWA install, five primary destinations, study controls, offline reload, background/resume, rotation, enlarged text, speaker/headphones, microphone, locally stored audio deletion, TalkBack and safe-area navigation. Capture actual outcomes and original diagnostic files. Do not convert Playwright Android emulation to physical evidence.
2. Complete a real THIEPN Account Google OAuth consent and callback from Chrome and installed PWA. Verify the Account UUID only after authenticated user verification; check persistence, sign-out, aborted/failed exchange, privacy and guest/account data isolation. Never include tokens, authorization codes or private account IDs in public CI logs.
3. Give the original J21 Japanese language review packet and provenance to an independent qualified Japanese reviewer. Obtain identifiable original feedback on kana, kanji, reading, grammar, level coverage and audio. Do not infer language approval from structural source checks.
4. Give at least six original productive artifacts (speaking and writing represented) to a genuine independent teacher/tutor/language professional for P11 external review. Preserve reviewer identity provenance and original packet hash. Do not award CEFR level or mastery.
5. Retrieve all original 42 visual scenarios and 126 actual PNGs (reference/candidate/diff), verify source bytes and original filenames, compare visually at desktop/mobile/320px/200%/dark and record each human decision. The 42/126 J32 placeholders are not original images.
6. Independently witness assistive-technology and keyboard behavior and record accessibility issues/signoffs distinct from screenshot review.
7. Verify exact-SHA staging origin, rights/provenance and release binary. Independently rehearse an authorized restore/rollback to original known-good bytes on disposable staging.
8. Keep owner merge, deployment, tag, release and post-release decisions separate. No automation may infer these from a valid signature, unsigned note, a test run or a healthy HTTP response.

## Verification and restrictions

Vitest adversarial tests cover all nine domains, source-linked candidate binding, conflicting/duplicate notes, false approvals, wrong digest, source traversal, forged upstream state and HTML injection. Playwright checks read-only HTML, accessible table semantics, dark and reduced-motion, 320px/200% layout and the absence of interactive release buttons.

J33 outputs a default-denied operator report. It never modifies original screenshot goldens, canonical content, public app UI, local learner state, identity, staging or production. Any discovered product defect requires a separately demonstrated source repair and new exact-head qualification.
