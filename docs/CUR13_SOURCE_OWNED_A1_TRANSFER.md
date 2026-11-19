# CUR-13 — A1 family, schedules, descriptions, and polite action requests

Continuation on original Japanese [draft PR #124](https://github.com/thiepn/japanese/pull/124), preserving learner custody and the native Course/StudyPlayer integration.

Four previously uncovered A1 instructional distinctions receive two original situational/explanation screens, three misconception-targeted choices, a transfer section, and one ungraded independent writing prompt per unit.

| Original unit | Unit-owned grammar anchor | Distinct transfer |
| --- | --- | --- |
| a1-unit-15 Family | grammar-counter-nin | family size 人 versus occupations and locations |
| a1-unit-12 Time | grammar-time-counters | 時 and 半 clock readings versus scheduled に and range から…まで |
| a1-unit-07 Preferences | grammar-i-adj-polite | descriptive い-adjectives + です versus 好きが preference |
| a1-unit-19 Requests | grammar-te-form | observed 書いて/言って/話して + ください versus 分かりません |

**18 exact Japanese examples** are read from each matching installed original THIEPN `CourseUnit.sentenceIds` at authoring time, and tests assert source attribution and initial context order. The example display is not a new audio or certified performance claim. Original teaching explanations and original transfer exercises are not copied from Marugoto or proprietary books.

The original canonical steps, StudyEvents, MemoryTraces, account ownership, source registry, prompt IDs, FSRS and scheduling are unchanged. All 16 new contextual prompts are marked `nonAuthoritative:true`, `schedulerExcluded:true`, `independentCompetenceVerified:false`. Contexts are fenced to exact owning `unitId`, including when grammar is shared, and original shared teaching remains available. Previous navigation-only checkpoint fingerprints may fail closed after content changes without altering evidence.

Tests include source verification, canonical step preservation, ungraded metadata, cross-unit leakage, first-screen navigation, and genuine Chromium desktop/mobile evidence. General CI is not considered passing if skipped by draft rules. Hold merge, release, deployment, publication, migration, physical-device acceptance and Account recovery. Independent editorial/source rights and separate Japanese draft #103/shared Languages PR #30 remain unapproved.
