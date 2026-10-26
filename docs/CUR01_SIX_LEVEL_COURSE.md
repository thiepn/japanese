# CUR-01 — Japanese six-level course navigation

The primary Course catalog is now visible at the top of **Learn** (the existing shell navigation identifier is unchanged in CUR-01 for compatibility). Direct URL entry `#course/B1` or `#course/B1/<encoded canonical-unit-id>` selects a level and highlights a canonical unit without automatically generating study history. Selecting a unit launches the existing `courseUnitSession` with its unchanged unit identity. The existing StudyPlayer persists answers to the normal StudyEvent/FSRS paths; this work adds no writer, grader or scheduler.

Current numbered entries are **existing canonical course units**, temporarily displayed as lesson-navigation entries. Their numbers are presentation-only and not IDs. Progress is read from existing `CourseUnitProgress`; a `Continue` action revisits the unit using its preserved evidence, not a new durable mid-page checkpoint. CUR-03 will deepen lesson segmentation. C2 has no canonical units and visibly says planned; no CEFR award or JLPT equivalence is implied.

The E01–E22, kana, advanced-learning and original release-authority surfaces remain intact to avoid breaking existing learner routes before CUR-02 migration. Google's separately integrated Kana Studio is not duplicated as a fabricated CEFR lesson. Source licenses, canonical IDs, storage and Account are unchanged.

Base main: `266db208a9a3a41308b0d94c009073e662c92f09`. The current full course-first A1 expansion in unmerged PR #103 has not been cherry-picked, silently claimed or replaced. Reconcile it explicitly before declaring its 78 guided lessons present in main.

Automated gate: `pnpm typecheck`, focused Vitest, `pnpm build` and CUR-01 Chromium desktop/compact-mobile. Full pre-existing browser matrix and physical-device qualification remain separate and must not be inferred.
