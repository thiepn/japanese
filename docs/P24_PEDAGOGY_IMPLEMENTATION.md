# P24 — Guided communication and active production

Implementation branch: feature/p24-guided-communication-production, stacked on P23 at c4ca466c5977f67ba946c367a072945b392bad27.

## Product changes
- Eight original linked branching conversations with contextual alternatives, explicit recovery turns after mismatches, and persistently recorded choice answers.
- Two original word-order sentence construction tasks per A1/A2 scenario (16 total). Shuffled token choices, accessible button interaction, reset/undo, explanation after submission, and FSRS-backed review.
- Two original grammar-context transfer tasks per scenario (16 total), available in the existing StudyPlayer via a dedicated practice session.
- Eight paired free writing and speaking scenarios. Browser speech recognition where available, editable transcription fallback, and an explicit character/feature observation checklist. No automated semantic or acoustic assessment.
- Advisory practice recommendation per scenario from existing account-scoped StudyEvents and memory traces, prioritizing FSRS due items, recent errors, then unseen work.
- Original explanations and vocabulary context remain in the P23 learning studio; the P24 lab is embedded directly below the selected scenario.
- Dialogue, sentence and transfer graded prompts share canonical StudyEvent storage, scheduler and Today reviews. Free production writes only ungraded StudyEvents with no raw text or audio stored.
- No database migration, alternate scheduler, separate mastery state, external API, paid service, merge, or deployment.

## Correctness boundary
The deterministic StudyPlayer grader handles exact target answers for choice and sentence order. A correct event establishes performance on that prompt only, not CEFR mastery or overall fluency. Multi-turn replies are deliberately constrained to authored choices; they are not an open-ended chatbot. The free production checker only observes length and literal feature occurrence. Speech recognition, if available, is browser-provided and not evidence of pronunciation accuracy.

## Follow-up P25
Deepen authored open-ended communication with revision and delayed transfer; better structured feedback across sentences and grammar explanations; expand original A1/A2 coverage; improve review recommendations using non-overlapping learner evidence without inventing external certification.
