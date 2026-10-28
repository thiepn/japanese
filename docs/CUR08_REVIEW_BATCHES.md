# CUR-08: Honest source-fair review batches

This native Japanese Course follow-up is based on the merged CUR-01–07 baseline. The original sixteen-question StudyPlayer queue, original FSRS due timestamps, Account-scoped StudyEvents and original source-authenticated `CourseUnit.vocabularyIds` mapping remain authoritative.

## Original behavior and corrected edge

Before CUR-08, the Course button showed **Review selected due (N)** while the runtime returned at most sixteen original due prompts. For larger backlogs that understated the remaining due count. CUR-08 displays **Review next 16 of N due** and explicitly states how many are not in this current session. It does not automatically clear them or call a second scheduler.

For one selected level, original FSRS due chronological order is unchanged. For multiple selected source levels, a deterministic native *source-group round-robin* draws from the exact original due prompts. A shared source-linked word is assigned to only one eligible level bucket, so no prompt can appear twice. Within each source group, the order remains the original FSRS due order. Unassigned means genuinely not linked to an original course unit, not a guessed CEFR rating. Planned C2 has no fabricated content.

The original global due count retains the other Japanese categories and private prompts. Selection due counts are not confused with the actual capped queue, and the due timeline remains untouched for unreviewed cards. Every original candidate validates its source ID against the source-authenticated word and public source registry, and every stored trace must agree with the original target/skill/cue identity. Malformed or cross-owner state is rejected, not silently treated as valid. No content, lesson, original source title, answer, prompt ID, grade, FSRS trace, owner account or event store is invented or modified.

## Qualification

Exact-head TypeScript, original CUR-01–07 native and desktop/mobile Chromium, new adversarial cross-level/cap/source validation, original Kana and combined CI. Physical Android/iPad, independent source rights and editorial review, evolving PR #103 and Languages PR #30 integration remain separate release blockers. Draft branch only, no merge, migration, staging or production writes.
