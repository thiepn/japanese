# P32 — Advanced Contextual Practice & Learning Flow

**Stack base:** `feature/p31-contextual-fluency-journey-refinement` at `8bec37fe26a8b564602c53b18c39dde3d5e31d7d`
**Source-only branch:** `feature/p32-advanced-contextual-practice-flow`

## Learner-facing implementation

- **Four new original branching A1–A2 conversations (16 authored turns)** about campus offices, switching study locations, correcting purchase quantities, and changing weekend appointments. Added to the single inherited P28/P29/P31 continuity registry and its existing multi-scenario selector. The established prompt IDs for older scenarios are unchanged.
- **Intent-guided free Japanese:** in an extended conversation, a learner may select a German communicative intention *before* writing a reply, without being given the full Japanese model. Unknown free responses may follow the learner's declared path, rather than being semantically graded. Intent selection marks the turn assisted; subsequent events stay scheduler-excluded, with no raw response or audio stored.
- **18 new original context-specific language contrasts** covering movement/handlungsort/transport/temporal particle functions, possession and demonstratives, invitation versus suggestion, request versus permission, tense, and audience-dependent formality. Prompts ask for the *specific semantic or pragmatic function* with alternating choice order; two grammatically acceptable sentences are not misleadingly described as one globally correct and one erroneous. Source-qualified explanations are embedded in Learn and targeted StudyPlayer/Today prompts.
- **12 new original sentence puzzles**, each with a baseline and hand-authored alternative phrase order (the full integrated pool grows from 72 to **84**). Source prompts carry new stable IDs and FSRS cue families without rewriting or resetting older learning records.
- **Integrated lesson practice**: a local-only (not mastery-bearing) grammar/function check directly in the existing Learn "Verstehen" step. It displays the precise question, relevant forms, and an authored function explanation; the standalone native StudyPlayer remains the graded answer route.
- **Cross-unit delayed recall transition**: the Learn "Festigen" stage reads FSRS due dates across the 18 units, offers a shortcut to another due unit or the earliest next scheduled return, and retains the explicit next-due snapshot with date/time; no new notifications, timers, alarms or second scheduler.
- **Keyboard/mobile usability**: in the existing sentence builder, numeric keys 1–9 choose displayed tile positions, Backspace removes the last tile, and Escape clears; all buttons remain tabbable and clickable. Expanded mobile touch targets and scrollable stage tabs keep content accessible.
- **Source defects fixed**:
  - P28 sentence builder referenced a removed `grade` variable during a recognized FSRS submission. The graded branch now records the confirmed `"correct"` result, while unrecognized/assisted branches remain ungraded.
  - Extended conversation ending replies use an explicit `null` branch; the previous nullish-coalescing expression incorrectly retried the same turn instead of ending the conversation. Explicit terminal endings now work.

## Preservation and boundaries

- Only original THIEPN-authored learning material added. Marugoto and other attached pedagogical PDFs remain method references only. No publisher text, illustrations or audio copied.
- Reuses existing Learn, Today, StudyPlayer, original prompt identities, owner-scoped canonical StudyEvents and FSRS MemoryTraces. No replacement progress store, new database migration or cross-app write.
- Known authored target responses may be graded only as their actual exercise modality, subject to help/exposure safeguards. Unknown free Japanese or non-author-listed word orders remain ungraded; neither is automatically declared invalid.
- Explanation heuristics are finite. P32 does not claim grammar parsing, semantic understanding of arbitrary free Japanese, pronunciation assessment, or CEFR mastery.
- In-memory answer exposure and guided-intent state do not persist across browser reloads; this is not a separate persistent mastery model. Existing FSRS evidence remains canonical.
- Existing local speech recognition can involve browser providers; P32 does not add any speech service or collection.

## Execution status

Committed source changes only, as requested. TypeScript typechecking, compile/build, CI, tests and browser acceptance remain **NOT_TESTED/NOT_RUN**. No PR, merge, deployment, migration, production records or credentials accessed.

## P33 proposal

Tighten authoring quality and cross-unit fluency within the same learning journey: more original role-switch and repair turns, independent listening-to-response transition, richer natural order comparisons, evidence-aware context and review handoffs, accessible mobile keyboard support, and fixes to any demonstrated source defects. Do not create another standalone learning system or duplicate FSRS authority.
