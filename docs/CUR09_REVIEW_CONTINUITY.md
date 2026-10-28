# CUR-09 — Account-fenced original review continuation

This extension to merged CUR-08 preserves the existing native StudyPlayer, original FSRS writer, immutable account-owned StudyEvents, and sixteen-prompt session capacity. It does not create a second review scheduler or change original prompt IDs, due timestamps, or source registry.

## Original continuity defect

Leaving a source-filtered review session previously lost the chosen original level scope and partial queue. Returning to Course always launched a new batch, which might revisit just-attempted prompts and interrupt the original work. CUR-09 introduces an explicit **Resume unfinished review** button which is independent of the selected fresh-batch control.

A bounded, seven-day device-local receipt stores the original owner, selected source levels, up to 16 canonical original prompt IDs, source/FSRS trace IDs, revisions and due timestamps, an original instructional source fingerprint, and next index. No response, grade, private prompt body, saved answer or learner writing is stored. Only the existing StudyPlayer post-commit navigation handler advances the pointer after a genuine original StudyEvent is written; finishing clears it, exiting does not. Local storage is best effort, not an authoritative ledger, and concurrent devices cannot establish mastery.

## Source and ownership protection

On every resume, the original Account's current FSRS MemoryTraces are loaded again and original public-exportable vocabulary sources and unit links are rechecked. The old ordered prompt fingerprint must match the current canonical original source prompt content. Each candidate must still belong to the stored level scope, source ID, trace ID and owner. Only unchanged still-due prompts **after the last completed index** enter the native StudyPlayer. Newly updated revisions, future due cards and removed/changed source items are excluded. A changed entire source or invalid Account receipt fails closed; no previous grade is restored and no automatic scheduler update occurs. Fresh Review next remains separately available.

The native test suite covers modified instructional content, forbidden source IDs, cross-owner attempts, malformed or expired receipts, future due timestamps, duplicated prompt IDs, storage permission failures, concurrent revisions, strict next-position increments and original cross-level queue ordering. The real browser suite tests the new controls and refuses injected forged receipts on desktop and compact-mobile Chromium.

No merge, deployment, publication, migration, rights assertion or live Account write is authorized. Physical Galaxy/iPad, independent editorial review and source rights, original draft PR #103 and separately owned Languages PR #30 remain external acceptance gates.
