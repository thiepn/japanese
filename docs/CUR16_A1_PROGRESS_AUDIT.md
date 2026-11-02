# CUR-16 — Full A1 progression audit and navigation-only course shortcut

## Inventory: exact installed curriculum, not speculative external CEFR certification

- A1 has **20 original canonical source-owned units**, each with a can-do and linked grammar/lexeme/sentence records.
- Previous CUR-03 through CUR-15 add contextual examples and feedback under **31 distinct grammar anchor cases** (some anchors reused by multiple units).
- The current generated unit session adds **7 optional contextual navigation steps per matched case** before the unchanged original canonical grammar, vocabulary and sentence learning. Unit 09 with three cases therefore requires 21 additional steps, and most units with two cases require 14. Repeated functions such as も/ました/よ are already substantially taught as contrasts; six unused standalone anchor IDs do not necessarily imply six missing pedagogical explanations.
- Every unit retains original canonical CourseUnit, grammar and sentence content, and the original StudySteps and FSRS ownership. The program has no defensible evidence of independently certified productive A1 proficiency, natural conversation assessment or pronunciation accuracy.

## Reproduced UX defect and bounded improvement

Optional source-owned contexts were positioned before original course material and were effectively unavoidable for a learner who only wanted to study the existing original unit (especially 14–21 extra navigation steps). This creates avoidable repetition and friction.

Added a small, scope-checked **Go to original course · skip optional contexts** action on the canonical A1 unit intro and optional contextual lesson screens. It navigates straight to the next unchanged original canonical grammar lesson. The implementation verifies the complete contiguous A1 CUR-03 prelude, refuses unrelated/malformed sessions, and never displays the action once canonical material starts. It never calls `onAnswer` or marks any optional or required prompt done. A successful source-scoped course-position save is required before the actual jump; failed saves are surfaced without moving. The jump only updates navigation position and preserves the learner's historical graded responses, FSRS traces and original StudyEvents. The displayed count is the optional navigation steps still remaining at the current screen (not the initial full prelude count), including a partially completed case only while on its lesson screen.

## Tests and holds

Native Vitest audits all 20 units: unique step IDs, all unmodified canonical steps after the exact optional prelude, consistent context totals, and refusal to skip graded prompts, unrelated sessions and malformed lists. Genuine desktop/compact-mobile browser tests exercise the 21-step Unit-09 shortcut, exit/reload resume at the same original grammar lesson, and absence of the shortcut in vocabulary journeys. Existing CUR-03 through CUR-15 suites are retained.

This is not a redesign, course reordering, migration, source licensing action or full human learning outcome qualification. Draft PR #124 stays unmerged; no deploy, publication, production write, new source approval, or manual device acceptance. Independent Japanese editorial/source rights and authenticated Account recovery remain open.
