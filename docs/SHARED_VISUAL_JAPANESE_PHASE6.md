# Phase 6 — Japanese J7 Library shared visual catalog

**Shared source:** `thiepn/languages@cb38b6ae5cb6922d0bc00078f6e3a68174e7eb22`.
**Japanese original:** `thiepn/japanese@0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458`.

The existing, **read-only J7 Library word reference** now checks all 103 source-qualified
`lex-*` IDs against their exact shared sense-concept mappings before displaying
the original local illustration. The adapter joins only the original canonical ID
and requires the original file and alt to match the source contract. No guessing
from writing, reading, translations or user-imported flashcards.

The existing `VocabularyIllustration` retains its original `/vocab/*.svg` images,
source-owned alt, lazy loading, network-error fallback and online retry. Only the
Library reference figure adds an unobtrusive `data-shared-concept-id` attribute.
Study lessons, independent retrieval, Review, assessment, the grader, SRS, Account,
backup and all learner-state formats are untouched.

The 103 original Japanese images were **not copied, renamed or modified**.
The service worker retains the same `japanese-shell-vocab-v5` picture cache
and strict 48-image FIFO policy; there is no second image scheduler or cache.

Acceptance includes 103 exact-key/semantic bindings and SHA-1 Git blob hashes
for all original SVGs, unchanged 48-item cache unit tests, and real desktop/mobile
Chromium reference presentation and offline reload checks. Human device and
artwork distribution review are still independent release requirements.

This PR is stacked onto Japanese PR #102 branch
`integration/japanese-v1-finalization-20261021`, retaining that branch's
source images. It does not overwrite concurrent course-first PR #103.
After PR #102 merges, reconcile branch ancestry before changing PR base.
Do not merge or deploy without explicit release authorization.
