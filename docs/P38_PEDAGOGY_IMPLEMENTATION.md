# P38 — Coherent Production Progression & Teaching Refinement

**Starting point:** `feature/p37-natural-production-contextual-review` at exact commit `c6020c802990dccc44dcc0cf56e0d61645b1598b`
**Isolated stacked source branch:** `feature/p38-coherent-production-teaching-refinement`

## Actual learner-facing implementation

1. **20 original cross-unit meaning/grammar decisions** in `study/transfer38.ts`: は versus が, destination に versus action-site で, object を, movement へ, temporal particles, topic frames, invitations versus joint proposals, permission versus wishing, polite/casual address, past tense and service language. Every contrast is rooted in a clear German communicative situation with independently authored Japanese expressions, a single contextual target and a detailed German explanation. Each case links two existing A1–A2 units rather than adding another course engine. New stable `StudyPrompt` identities and FSRS cues register in canonical Today, StudyPlayer and Learn.
2. **16 original Japanese cross-unit written-production transfers** in `study/production38.ts`. These target specific situations such as asking permission in a library, rephrasing an appointment, describing a lost item, asking directions, purchasing and exchanging politeness. Each task includes two context-appropriate Japanese accepted forms, a contrastive explanation and a source-owned, new prompt identity. The tasks are available in the original writing and transfer flow, not a second writer.
3. **Integrated "Learn" grammar walkthrough**: the existing Verstehen stage now shows up to three context-comparison choices for the current unit. Learners can select a Japanese sentence, inspect its contextual difference and open the other relevant unit directly. These in-lesson comparisons are ungraded; independent source prompts remain in the native StudyPlayer.
4. **Integrated writing transfer**: the existing Schreiben stage surfaces the current unit's related original transfer tasks without prematurely revealing authored target answers, and navigates directly to the established StudyPlayer's typed practice. The transfer focus explicitly includes the new cross-context comprehension and production prompts.
5. **Distinct learning evidence routes**: new `JourneyPractice="new"` selects prompts with neither a canonical FSRS trace nor independently graded StudyEvent; `"retry"` remains voluntary last-incorrect work; `"review"` remains strictly due-by-existing-FSRS date. The existing Festigen stage displays three clearly separated learner actions explaining what each does. No fake mastery, additional scheduler, deferred notification or new progress store.
6. **Progress count correctness**: `deriveJourneyProgress` now counts a prompt with a genuinely graded StudyEvent but absent FSRS trace as already practiced, rather than erroneously labeling it unseen. It still treats truly unseen content as distinct from due/retry.
7. **Specialist-queue containment**: removed the fallback that silently substituted unrelated unit prompts whenever a focused register/transfer/grammar/production queue was empty. `buildP27JourneySession` rejects lesson-only specialized sessions, and the App callback accepts the new first-exposure mode.
8. **Contextual last-mistake assistance**: source metadata for new cross-context transfers and writing reformulations now directs learners back to the most relevant existing Learn or Write stage with target-free particle/topic/register hints. The established exact-mistake StudyPlayer route, original recorded error event and source ownership stay authoritative.
9. **Mobile/keyboard writing continuity**: new IME-safe Ctrl/⌘+Enter controls submit independent dialogue drafts or advance the existing writing and rewrite steps. Textareas advertise the keyboard shortcut, have visible focus treatment and keep mobile-friendly touch dimensions.

## Data boundaries and pedagogy

- Preserves all P23–P37 original authored lessons, prompts, IDs, StudyEvents, FSRS MemoryTraces, Today/Learn, independent collection and account authority. Source-only additions with new IDs; no destructive rewrite of earlier curriculum or previous stacked drafts.
- P38's original Japanese and German teaching texts were independently authored. Marugoto PDFs and other references are used only as pedagogical references; no publisher prose, dialog, examples, artwork, recordings or exercise assets were copied into the repository.
- Graded evidence is produced only by the inherited StudyPlayer or the original independently verified path, not by inline teaching explanations. Free Japanese responses outside the finite authored alternatives are not automatically declared wrong or CEFR-graded.
- FSRS dates and last-mistake status are snapshots of the original owner-scoped local records. Optional early mistake exercises may update real FSRS schedules and are explicitly separated from due-now review.
- No new learner records, credentials, database migrations, additional auth systems or production access. No raw learner Japanese writing or audio is stored by P38's new teaching comparisons.
- UI choices and short text-marker feedback do not constitute universal Japanese parsing, semantic evaluation, pronunciation scoring or guaranteed naturalness for all contexts.

## Execution and qualifications

**Source commits only.** TypeScript checks, builds, unit tests, browser/device acceptance, CI and full suites are **NOT_RUN/NOT_TESTED** as requested. Branch and GitHub compare verification only. Source-level implementation does not certify compilation or functional correctness. No PR, merge, release or deployment.

## P39 proposed scope

Advance the existing A1–A2 pedagogical path with additional original real-life production and careful misconception-specific explanation, richer context-based Japanese revision, better per-unit ownership of assessment cues and accessible minimal mobile study controls. Keep first exposure, volunteered retry and genuinely due FSRS review separate. No duplicate lesson player, dashboard, grading engine or new persistent mastery authority.
