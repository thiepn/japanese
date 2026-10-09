# J19 — Local Data Integrity & Recovery (draft)

**Dependency:** J18 PR #44 exact head `f50bf88acb46224e26e2a9c3c7f05670d686d348` passed CI [37965016728](https://github.com/thiepn/japanese/actions/runs/37965016728). J17 PR #43 also passed mandatory CI. Both remain unmerged; this draft is stacked on J18.

## Confirmed storage defect

`saveStudyReview` previously used IndexedDB `put(event)` for immutable StudyEvents, so a duplicate event ID could silently replace earlier evidence and its outbox representation. J19 changes that statement to `add(event)`. An ID conflict now aborts the **existing shared transaction** containing StudyEvent, outbox mutation and FSRS memory trace; no partial write is committed. This is not a change in mastery authority, scheduler version, or storage schema.

## Local device backup / restore API

New `packages/local-db/src/backup.ts` exports:

- `exportLocalWorkspaceBackup(accountId): Promise<string>`: one consistent readonly transaction across eight local owner-scoped stores; portable JSON with SHA-256 corruption detection, private prosody Blob encoded as reversible base64.
- `restoreLocalWorkspaceBackup(accountId, json): Promise<void>`: same-owner only; verifies version, schema, hash, record owners, duplicate IDs and audio metadata; refuses **any** existing record or sync cursor; writes all eight stores in a single IndexedDB transaction. It does not delete or overwrite existing data.
- Remote server sync cursor is deliberately **not included**. Exported files are sensitive and contain personal Japanese documents and audio; users must keep them private.
- This is an internal API, **not yet an in-app file picker/export/download UI**. Actual durable backup depends on the caller saving the returned JSON off-device. It is not cloud sync, an automatic scheduled backup or an authenticated server restore.

## Regression coverage

`tests/local-db/j19-integrity.test.ts` covers immutable duplicate IDs, concurrent collision, scheduler/outbox rollback, audio fidelity, non-destructive same-account restore, cross-account refusal, tamper detection, cursor preservation, transaction interruption and read-forward migration from legacy schema v1 to current v8.

## Outstanding risk and acceptance

- Local `pendingReviews` serializes in-process writes; cross-tab concurrent updates to the **same** scheduler projection still need a deliberate Web Locks guard / revision protocol before global concurrency is fully certified. Do not claim solved by a duplicate-ID fix.
- Backup size, quota exhaustion, device interruptions and actual Android private-data restore still require on-device acceptance. SHA-256 is a corruption check, **not** an authenticity signature or proof against intentional tampering.
- Automatic client first-party OAuth registration is **absent** in Account production, per J18 read-only audit; human-operated onboarding remains mandatory.
- P11 external language review, P21 physical device, J15D visual reviewer and J16 field signoffs remain pending. No stable release.

## J20 handoff

**J20 — Physical Android, PWA & Browser Qualification:** freeze exact candidate SHA after automated gates, run real installed Android PWA across portrait/landscape/TalkBack/200% font, verify physical headphone/speaker/microphone, storage quota and offline restart, perform private backup-download/restore recovery on disposable data, qualify Account Chrome-to-PWA callbacks and record user-operated evidence. Until this is complete, J20 remains not started.
