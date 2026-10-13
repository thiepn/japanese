# THIEPN Japanese Post-P60 R2 — Historical Return Eligibility, Original Source Editorial & Recoverable Practice

## Real stacked source work

- Exact R1 parent **verified identical** before branch creation: `fix/post-p60-r1-native-course-integration` at `89d514886791ffc618aaed42c2edd46f157da4c9`.
- Separate child branch: `fix/post-p60-r2-source-editorial-recovery`.
- Changes are committed exclusively to the child. Earlier drafts, `main`, user data and production are unchanged.
- **NOT_RUN**: tests, builds, TypeScript compiler, CI, browser/mobile acceptance, audio acceptance, external Japanese proofreading and release qualification. Source-only implementation and GitHub ancestry inspection are not proof of deployed/runtime functionality.

## Original historical P40–P52 returns: one native evidence rule

Prior R1 excluded older delayed-return prompts from generic `new` sessions but the historical `return:<id>` and original phase-specific `...-kind:<id>:return` routes could still expose *never-seen* contexts. `returnEligibilityR2.ts` is a first-party **read-only** adapter over already authored P40–P52 originals:

- Uses exactly the source's original `p40`–`p52` StudyPrompt arrays, return arrays, phase-specific historical `arcId`, `sceneId`, `caseId`, `challengeId`, `readingId`, `documentId`, `missionId`, `contrastId`, `transformationId` metadata and stable original `primaryTarget + skill + cueFamily` MemoryTrace identity.
- Keeps each original return `id`, source/target and FSRS authority exactly unchanged; **no new progress/grade store**.
- Returns that have *no original source group* are locked, not unlocked by an unrelated unit's activity.
- A first historical return becomes eligible only after **one authentic owner-scoped graded source event** (correct or incorrect, `schedulerExcluded!==true`) at least **24 hours old**, or the authentic original source MemoryTrace with a **finite due timestamp already due**. Once the return itself has an existing authentic FSRS trace, voluntary re-entry is permitted without asserting it is due.
- If records are absent or come from multiple users, eligibility is locked; the existing Account owner is explicitly passed from native runtime/Learn. Event ordering and due dates use recorded timestamps, not a fabricated scheduler or fake memory.
- The original **due-only** `return-due` route still requires the actual return card's own due FSRS timestamp; unlocked-but-unscheduled first returns are never described as due.

R2 applies this rule to ALL original P40–P52 entry paths, including original generic `transfer` metadata selection, each phase specialist `:return`, existing short `return:<sourceId>`, and the new exact `return-id:<originalPromptId>` / `return-due-id:<originalPromptId>` routes. Later P53–P60 existing owner-evidence gates also apply to any returns encountered through broad transfer selectors; no P53–P60 source IDs or scheduler state are rewritten.

The **exact-ID route** addresses ambiguity when multiple historical phases happen to reuse an authored source ID. Older short-ID links remain supported for backward compatibility. With an empty/unauthorized specialist queue, the original runtime truthfully reports its existing no-eligible-prompts error rather than inventing another exercise.

## Native learner-facing recovery

- `P27LearningJourney`: original P40–P52 return rows now explain locked/source-aged/source-due/existing-card status, disable unearned return buttons and route exact prompt IDs when appropriate.
- Shows an actionable **related original source** practice handoff from the existing P60 historical source registry, *only* if it can actually identify that exact original source in the current foundational unit; otherwise the UI does not advertise a fake route.
- Preserves original previous P58–P60 unsent-writing guards and owner/unit remounting, as well as original Account local-first StudyEvents/FSRS reviews.
- Corrects original P57 delayed-review title routing by using authored `threadId`, not unrelated phase IDs.
- Source eligibility over existing owner evidence is memoized per real Learn evidence/unit/owner, not rescanned every single draft keystroke. No polling, background job, new storage or duplicate writer.
- Original mobile and keyboard control semantics remain native buttons/details; **not browser-verified**.

## Original Japanese editorial teaching and specific source corrections

- `sourceEditorialR2.ts`: **12 newly authored first-party detailed original source-specific notes** for existing original P59/P60 lessons: evidence from Japanese written text, evidence from spoken transcript, exact German interpretation, chronology and binding status, register/recipient, plausible source misconception, and an independent multi-sentence self-repair assignment. These contain no Marugoto/publisher transcription, copyrighted recording or independent certification.
- `P59PerformanceStudio` / `P60ConsolidationStudio` reveal the relevant note **only after the learner actually attempts the main question**; subsequent optional `details` prevents prematurely giving away evidence or delayed-return models. These are *ungraded instructional explanations*, not an AI-scored open-writing engine.
- P60 `consolidation60-corpus-c.ts`, housing/noise chronology: clearly distinguishes **the Thursday corridor-cleaning notice** from the separate caretaker's **tomorrow-afternoon equipment investigation**, instead of wrongly treating those two times as mutually supporting evidence.
- P60 `consolidation60-corpus-a.ts`, working-hours chronology: distinguishes written **two-days-advance request deadline** from employer's separate **tonight response commitment**.
- `consolidation60.ts`: fixed a real invalid study choice `q.flawed` (not a field on original `P60Question`); uses the existing specifically authored misconception `q.trap` and bounded native choice comparisons. The original comprehension `skill:"production"`, cue family, target, source ID and historical **FSRS trace identity** are preserved despite correcting the display prompt type. Unknown valid independent Japanese prose remains **ungraded** in the original Learn writing editor. Synthetic device TTS plus transcript does not measure recorded listening.

## Deliberate authority and copyright boundaries

- No copied Marugoto or other publisher Japanese lessons, dialogs, illustrations or audio.
- No new Account/private draft persistence, localStorage, redundant FSRS ledger, score/grade writer, artificial CEFR/JLPT qualification or automatic spoken proficiency.
- Existing owner-scoped local StudyEvents and original FSRS MemoryTraces remain sole evidence.
- No test/build/CI, PR, merge, migration, production access, deployment, credentials or paid services. Old branches remain preserved.

## Follow-up and release-readiness boundary

Further work, **only when separately authorized**, includes compilation/type-error resolution, full original source coverage and Japanese native-language editorial review, browser/manual accessibility acceptance, account-switching and study-evidence acceptance, and final PR/merge/deployment planning. R2 is source-committed rather than verified release-ready.

Possible source-only next phase: **Post-P60 R3 — Final Learner Workflow Consolidation** focused on actionable in-session navigation across original long-form sources, eliminating redundant UI and improving original course completion without fabricating mastery. That would remain separate from formal release qualification.
