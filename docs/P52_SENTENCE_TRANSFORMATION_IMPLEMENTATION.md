# THIEPN Japanese P52 — Japanese Sentence Transformation

**Verified exact parent:** `feature/p51-contextual-a2-grammar-contrasts` at `3b46444bbd57b8f26b4bee9ade77027d9ef0c05e`, identical to its requested branch head before creating this separate child.

**Stacked source branch:** `feature/p52-a2-sentence-transformation` (no PR).

## Authored instructional material

62 wholly original progressive contextual A2-targeted sentence-transformation records in three independent first-party corpora:

- `transformation52-corpus-a.ts` — 21: social roles, respect, mitigated requests, permission versus invitation, explicit personal intention, deadlines, simultaneous action and event ordering.
- `transformation52-corpus-b.ts` — 20: habits versus current activity, action versus resulting state, completion, 〜ておく, 〜てみる, 〜てしまう, 〜たり, 〜たら, natural-consequence と, conversational なら, concessions, cause and changing obligations.
- `transformation52-corpus-c.ts` — 21: visual そう, hearsay そう, own judgment, possibility, indirect evidence, present potential and learned ability, relative comparisons and bounded superlatives, だけ／しか, giving/receiving perspective, active/passive focus, naming and past experiences.

Every record includes an original Japanese source sentence, named speaker relationship and lived situation, explicit preservation/semantic-change requirement, three independently authored initial target alternatives, nuanced meaning explanation, a concrete tempting false transformation and context-specific repair. Every record adds **two separate newly authored communicative situations** (new source, new goal, one original canonical target plus one alternative each): (a) independent production and (b) genuinely changed-context later recall. The later situation is not printed in the Learn studio before unlock.

**Scope:** 62 records; 186 contextual source-to-output exercises; 186 stable native StudyPrompt IDs; 434 authored accepted model-answer slots across the three practice stages, without implying 434 independent semantic forms. Some nuanced polite, evidential and passive structures are *A2-bridge/stretch content*, not proof of mastery or an official JLPT classification.

## First-party architecture, not new services

- `transformation52-types.ts`: compact strongly typed original authoring contract and structured independent/return tasks.
- `transformation52.ts`: stable `p52-transform-<id>`, `p52-production-<id>`, `p52-return-<id>` keys; original `primaryTarget`, `cueFamily`, `contextId`, `answerNormalization:"japanese"`, `sourceId:"thiepn-original"`, `contentVersion:"p52-1"` and source-owned `eventMetadata`. The existing native StudyPlayer remains the only assessed production route. Finite exact-pattern matching intentionally never declares unknown paraphrases grammatically wrong.
- `runtime.ts`: all 186 source prompts in the original native Today due lookup and Learn catalog; no separate queue, local database, FSRS scheduler or owner state.
- `journey27.ts`: `transform:<id>`, `transform-kind:<id>:transform|production|return`, and original return/due routing. Each route checks the authored unit relationship; existing `return-due:<id>` checks only real `MemoryTrace.card.due`. Unseen P52 return cases do not leak into generic `new`, `production`, or ordinary unit recommendation catalogs.
- `P52TransformationStudio.tsx`, `p52-transformations.css`: searchable responsive Learn catalog, domain filtering, full original Japanese context, role and semantic-change distinctions, typed independent drafts, bounded post-attempt comparisons, three optional original models, tempting error explanation, accessible buttons/input controls and direct native StudyPlayer and writing handoffs. This studio stores no free draft or mastery.
- `P27LearningJourney.tsx`: mounts P52 in existing owner-sensitive Learn; handles unit-specific native sessions, source-backed P52 recommendation on actual mistakes, original Learn writing drafts/revisions and original scheduler-excluded writing events containing no raw learner text. Uses the same existing account, owner-private `StudyEvents` and `MemoryTraces` evidence.
- `remediation36.ts`: targeted correction advice for evidence, speaker/agent roles, time/condition and unseen changed-context recovery, never a new grading engine.

### Real delayed recall, not manufactured due dates

Before the first unseen P52 return situation can be opened in the Learn studio, the original *transformation* prompt must have either (1) an actual original FSRS MemoryTrace already due or (2) an independently graded original StudyEvent at least 24 hours old. These are different conditions: the latter is a pedagogical unlock, **not** an FSRS due event. Subsequent return reviews are truly due only when the native `p52-return-<id>` card owns an FSRS-scheduled due timestamp. The existing Today queue includes only truly due P52 prompts; all undisclosed or not-yet-scheduled return contexts stay out of the normal new-prompt pool. Source-level first-read exposure is distinct from graded retrieval.

### Pedagogical accuracy and rights limits

All Japanese tasks, targets, alternatives, misconceptions and changed-context recall passages were authored for THIEPN Japanese. Uploaded Marugoto A1/A2, grammar and kanji books were used for curricular framing/reference only: no copied exercises, images, model audio or publisher lessons. Finite normalization cannot recognize every correct Japanese reformulation or decide equivalence of meaning, evidence or register. A human Japanese language editorial review would be needed before making claims of fully verified linguistic accuracy.

## Excluded operations and status

**NOT_RUN:** unit/integration/end-to-end tests, TypeScript checks, builds, CI, browser/device QA, runtime acceptance, grammatical expert verification and release qualification. **NOT_DONE:** PR creation, merges, migrations, account or database modifications, deployments, production operations, credentials or paid services. Existing P23–P51 IDs, older branch refs, main, source rights and local-first authority are unchanged.

This phase is source implementation, not a validated release.
