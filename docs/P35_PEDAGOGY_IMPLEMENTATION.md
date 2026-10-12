# P35 — Conversational Integrity & Adaptive Recall

Stacked parent: feature/p34-natural-response-learning-continuity at exact commit e012919327043e78ad0f5fe4b43446adffe4d21a.
Source branch: feature/p35-conversational-integrity-adaptive-recall.

## Actual learner-facing source implementation

1. **Third-turn original conversation continuation for every P33 role:** each of eight scenarios includes one additional learner-written response in each perspective, giving 16 additional authored dialogue turns and 16 new canonical StudyPrompts. Original turn indices 0–1, their prompt IDs and existing FSRS cue families remain unchanged. The existing Learn role switcher advances through all three turns before switching perspective; no new conversation panel or scheduler.
2. **Meaning-aware expression variety:** 16 additional authored alternatives to the third-turn models are accepted and explained alongside the 32 inherited P34 role alternatives. Grading remains restricted to independently produced, author-qualified forms; unrecognized free Japanese is not declared incorrect. Speaker-perspective review also corrected seven newly written P35 role turns before handoff, including customer/employee and librarian/borrower directionality.
3. **16 new original pragmatic/particle/function distinctions:** two situations for each of eight role contexts (transport, library, café, appointment, lost property, shopping, meeting and weekends). Prompts explicitly ask the communicative function, so an alternative grammatical utterance is not treated as universally wrong. The new independent prompt IDs enter the existing StudyPlayer, Learn, Today and native FSRS trace catalog with no overwrite of old prompts.
4. **Strict FSRS due versus voluntary correction:** the inherited P27 review selector previously admitted "last incorrect" cards even when their FSRS due date lay in the future. P35 "review" now selects only cards with a valid due timestamp <= now. New "retry" practice is separately labeled as optional last-incorrect remediation and may legitimately update the canonical FSRS schedule when chosen. Never-seen material remains a distinct first-exposure path. Scheduler-excluded StudyEvents are ignored for graded-error routing.
5. **Exact-error practice:** Learn > Festigen lists up to five last-incorrect *independently graded* prompt identities with category and date, without revealing model answers or storing raw learner text. "Genau diese Aufgabe üben" launches exactly that source-owned prompt using the existing StudyPlayer. At invocation, the user's current authorized StudyEvents are rechecked, the latest result must still be incorrect, the prompt must belong to that unit, and the prompt is not truncated by the ordinary 14-card queue. No new remediation state is persisted.
6. **Direct integration and ownership:** the existing App/J4Learn/P27 route chain carries the exact error-target action; role practice can open native grammar contrast practice and the currently due FSRS review without duplicating either engine. Owner account is checked before reading records in the focused study session.
7. **Japanese IME, keyboard and mobile safety:** Ctrl/⌘+Enter controls now ignore in-progress IME composition; tile number shortcuts do likewise. Role answer, initial clarification and clarification follow-up inputs advertise shortcuts. Escape can close a repair and return to the original role response. Focus indicators and responsive mistake cards retain minimum touch-friendly targets.
8. **Privacy and pedagogy:** all new lessons and contrasts were independently authored; Marugoto served solely as a general method reference, not a source of copied lesson prose, dialogue, exercises, illustration or audio. Free production and repair responses continue to persist minimal, scheduler-excluded metadata, never raw text or audio. Session-local help/model exposure guards remain distinct from mastery.

## Known limitations and next actions

- No general Japanese semantic parser, grammar grading, pronunciation scoring or unconstrained conversational understanding is claimed. Authored alternatives cannot represent every valid Japanese expression.
- A role response based on previously encountered but not newly revealed material may be recognized as an authored target; cue history and FSRS state remain the canonical long-term evidence. Local in-memory help exposure resets upon mount, not a persistent cross-session disclosure tracker.
- Optional mistake remediation can cause an early official FSRS review if the learner elects to open it; it is never labeled overdue on that basis alone.
- Real-time due badges are snapshots of local records, not scheduled reminders or external notifications.
- Build, TypeScript validation, browser checks, CI and complete test suites remain NOT_TESTED/NOT_RUN per request. Committed source is not a certified passing runtime.

## Preservation constraints

All P23–P34 authored content, previous stacked drafts, unchanged main, native Learn/Today routes, StudyPlayer IDs, StudyEvents, FSRS and owner-scoped data authority are preserved. No PR, merge, deployment, migration, new credentials or production records.

## P36 proposed scope

Consolidate independent production quality and safe learner transitions: scenario-aware follow-up intent choices, flexible original correction exercises, timed-but-not-faked recall handoffs, accessible mobile conversation flows, and exact last-error remediation while preserving all historic trace identities. Source changes first, no new parallel grading engine or qualification-only phase.
