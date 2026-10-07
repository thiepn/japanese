# J8 Acceptance — Progress / 道 Longitudinal Journey

## Status

**Implementation complete. Final CI/browser qualification is required for the latest J8 commit.**

J8 replaces the old stacked mastery dashboard with a longitudinal Japanese learning path. It visualizes existing mastery, assessment and portfolio evidence without creating a new progression authority.

## Primary information architecture

Progress is now organized as:

1. longitudinal path hero;
2. evolving personal landscape;
3. six skill crests;
4. milestone road;
5. explicit evidence ledger;
6. B2/C1 evidence vaults;
7. visual-summary boundary statement.

The previous sequence of equal-weight mastery sections is no longer the primary interface.

## Evolving personal artwork

The Progress hero contains a procedural Japanese landscape that becomes visually denser as the displayed mastery views rise.

Stages add:
- trees;
- bridge;
- town;
- books/knowledge detail.

The landscape is decorative and does **not** write any new learner state.

Its displayed percentage is explicitly the arithmetic mean of the six existing mastery views shown immediately below:
- script + sound;
- vocabulary;
- generated forms;
- grammar;
- connected language;
- immersion transfer.

This display mean is not a certification score, scheduler input or mastery authority.

## Current path state

The hero projects existing course progress only:
- current unit level/title;
- mastered course landmarks;
- passed delayed checks.

Unit status, order and assessment truth remain the existing `CourseUnitProgress` values.

## Skill crests

Six crests replace the previous repeated mastery panels.

### Script + sound / 文字
Uses existing Kana mastery:
- Hiragana;
- Katakana;
- recognition;
- typed reading;
- mora listening;
- model confidence.

### Vocabulary / 語彙
Uses existing vocabulary mastery:
- meaning recognition;
- reading recall;
- listening recognition;
- active use;
- model confidence.

### Generated forms / 活用
Uses existing conjugation mastery:
- polite negative;
- polite past;
- polite past negative;
- て-form;
- model confidence.

### Grammar / 文法
Uses existing grammar mastery:
- function comprehension;
- contextual form selection;
- model confidence.

### Connected language / つながり
Uses existing sentence + lexical-fluency projections:
- sentence comprehension;
- sentence production;
- lexical chunks;
- register transfer;
- combined confidence.

### Immersion transfer / 実読
Uses existing immersion projections:
- reading-text mastery;
- connected-listening mastery;
- lexical readiness;
- reading/listening check evidence.

Each crest is an expandable numerical drill-down. The decorative emblem never replaces the accessible number.

## Milestone road

Existing assessment records are now shown as physical checkpoints:

- A1 ASSESSMENT;
- B1 ASSESSMENT;
- B2 ASSESSMENT;
- C1 FOUNDATION.

Each checkpoint shows:
- answered / total activities;
- existing completion state;
- activity-score mean when evidence exists;
- existing progress fraction.

A completed seal is shown only when the underlying milestone record is complete.

No J8 milestone status is introduced.

## Evidence ledger

The visual landscape is followed by a deliberately plain evidence ledger showing existing counts:

- graded answers;
- memory traces;
- due items;
- connected texts;
- mined words;
- answers in the current visit;
- reader lookups;
- reading checks;
- listening checks.

This keeps concrete evidence visible behind the artistic summary.

## Evidence vaults

The detailed B2 and C1 portfolios remain fully available but move behind explicit learner-controlled drill-down.

### B2 longitudinal portfolio
Existing P10 evidence remains unchanged:
- multi-document missions;
- production reliability;
- delayed revisions;
- recurring advisory feedback;
- productive artifacts;
- JSON/Markdown export.

### C1→C2 advanced evidence
Existing P20 portfolio/readiness remains unchanged:
- advanced longitudinal matrix;
- external calibration;
- internal pathway qualification;
- P15–P19 evidence;
- C2-readiness boundary;
- JSON/Markdown export.

The vaults are collapsed by default so Progress reads as a learner journey rather than a developer/research report.

## Certification boundary preserved

J8 does not change:
- CEFR claims;
- C2-readiness qualification rules;
- human-review semantics;
- B2/C1 portfolio calculations;
- StudyEvent semantics;
- FSRS;
- mastery projections;
- milestone scoring;
- delayed assessment state;
- course-unit state.

The page explicitly states that the landscape and crest arrangement are visual summaries only.

## Developer/operations separation

Release operations, provider health, release identity and human-review administration remain outside normal learner Progress under the diagnostics boundary established in J2.

J8 does not reintroduce them.

## Responsive behavior

Desktop:
- two-part hero with learner narrative + evolving artwork;
- six crests in a three-column field;
- horizontal milestone road;
- sticky-free learner flow;
- detailed evidence only when requested.

Tablet:
- reduced hero art footprint;
- two-column crest field;
- compressed milestone road.

Mobile:
- hero stacks;
- artwork becomes a compact landscape;
- crest field becomes one column;
- milestone road becomes vertical;
- evidence ledger becomes one/two columns;
- evidence vaults remain expandable;
- no document-level horizontal overflow.

## Accessibility

J8 preserves:
- real `details/summary` drill-down;
- semantic headings;
- explicit percentages;
- progressbar semantics for numerical mastery dimensions;
- explicit milestone text and counts;
- visible selected/completion information without relying on color;
- reduced-motion compatibility;
- readable dark mode.

Decorative artwork is not the sole carrier of learner meaning.

## Regression migration

Legacy P20/P21 tests that assumed the advanced C1 portfolio was permanently expanded now open the J8 C1 evidence vault before asserting the P20 readiness matrix.

The P21 consolidation check now treats the J8 Progress path itself as the primary learner surface.

Existing P10 release-operations coverage still sees the visible `C1 FOUNDATION` learner checkpoint while operations remain in diagnostics.

## Dedicated J8 qualification

`tests/e2e/j8-progress.spec.ts` covers:
- J8 Progress identity;
- six mastery crests;
- A1/B1/B2/C1 milestone road;
- mastery-dimension disclosure;
- progressbar semantics;
- B2/C1 portfolio drill-down;
- P20 readiness visibility after explicit expansion;
- evidence ledger;
- explicit visual-summary boundary;
- mobile vertical milestone geometry;
- horizontal-overflow protection.

## J9 handoff

J9 should add the Japanese motion/sensory layer across the now-complete primary learner surfaces.

It should use motion to reinforce spatial metaphors already established:
- noren/opening transitions in shell/navigation;
- ink draw/bloom;
- hanko stamp;
- emakimono pan;
- washi/page transitions;
- byōbu-like milestone reveal.

Motion must remain optional, GPU-cheap, and fully reduced-motion safe. It must not add new learner meaning or block interaction.
