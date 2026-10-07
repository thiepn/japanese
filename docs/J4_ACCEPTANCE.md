# J4 Acceptance — Learn / 学 Emakimono Journey

## Status

**Implementation complete. Final CI qualification is required for the latest J4 commit.**

J4 replaces the old stacked Learn dashboard with the signature J-series learning world while preserving the existing course graph, mastery model, milestone truth and study-session entry points.

## Primary information architecture

Learn is now organized as one continuous A1→C1 road rather than a sequence of equal-weight dashboard cards.

The primary hierarchy is:

1. journey overview;
2. script/lexical foundation;
3. illustrated A1→C1 emakimono road;
4. level gates/milestones;
5. specialist training grounds;
6. compact evidence overview.

Advanced tools remain available, but they are no longer allowed to dominate the primary course path.

## Course-level projection

J4 adds `level` to `CourseUnitProgress`.

This is a presentation projection of the existing `CourseUnit.level` value and does not create a new level system.

The course is grouped dynamically by the canonical unit level and displayed in ordered regions:

- A1 — はじまり / First forms;
- A2 — 暮らし / Everyday life;
- B1 — つながり / Connected language;
- B2 — 広がり / Independent world;
- C1 — 深み / Advanced depth.

Unit ordering remains the existing `order` field.

## Emakimono learning world

Desktop/tablet:
- horizontal scroll/pan composition;
- five illustrated course regions;
- continuous road/water/mountain field;
- course units become landmarks;
- current unit receives stronger visual emphasis;
- mastered, learning, ready and challenging states remain distinct;
- each landmark exposes real mastery/evidence data;
- unit session and delayed-check actions remain directly available.

Mobile:
- the same journey becomes a vertical route;
- no horizontal-document dependency;
- landmarks remain in canonical order;
- gates remain attached to their region.

The visual world is a projection of learner truth, not a second progression engine.

## Foundations

The previous script/vocabulary summary is retained but recomposed as the entry landscape.

It uses:
- kana introduction coverage;
- vocabulary introduction coverage;
- real kana mastery;
- real vocabulary mastery.

No new foundation score is introduced.

## Level gates

Existing milestone/diagnostic flows are attached to the course road:

- A1 milestone;
- B1 milestone;
- B2 milestone;
- C1 foundation diagnostic.

A2 uses a visual crossing marker because there is no separate A2 milestone flow in the current learning engine.

Gate completion uses existing milestone progress only.

## Specialist training grounds

The following existing functionality remains available outside the primary journey:

Quick entry:
- lexical fluency;
- writing;
- speaking;
- C1 discourse control.

Expandable training grounds:
- Adaptive remediation;
- Real-world performance;
- AI coach.

This intentionally prevents the old advanced-panel stack from becoming Learn's primary information architecture while preserving the capabilities themselves.

AI/advisory work remains outside durable mastery unless existing evidence rules explicitly allow otherwise.

## Existing behavior preserved

J4 does not change:
- course prerequisites;
- unit ordering;
- unit mastery calculation;
- evidence counts;
- delayed assessment state;
- StudyEvent semantics;
- FSRS;
- milestone scoring;
- Study Player session generation;
- productive-task semantics;
- real-world chain semantics;
- AI coach evidence boundaries.

`buildCourseUnitSession()`, `buildUnitAssessmentSession()`, milestone builders and specialist-practice callbacks remain the action targets.

## Regression migration

Legacy E2E tests that assumed the old stacked Learn page were migrated to the J4 architecture.

Changes include:
- `.unit-card` course assertions → `.j4-landmark`;
- `Foundation → C1` heading → `Your Japanese journey`;
- advanced Learn tests explicitly opening the relevant J4 training ground;
- P9 real-world regression opening the Real-world performance drawer;
- prior J2 operations tests using the diagnostics workspace rather than learner Progress;
- mobile/PWA flows using the J3 Today action label.

These are test-architecture migrations, not removals of learner capability.

## Automated J4 qualification

`tests/e2e/j4-learning-journey.spec.ts` covers:
- J4 learner heading and art identity;
- five A1→C1 regions;
- all 68 canonical unit landmarks;
- first and last unit identity;
- removal of the old `.unit-card` architecture;
- unit entry into the existing Study Player;
- milestone gate visibility;
- specialist-practice progressive disclosure;
- mobile vertical-route conversion;
- document horizontal-overflow regression.

## J5 handoff

J5 should rebuild **Study** as the focused practice chamber.

The shell and illustrated learning world should recede completely once a study session begins.

J5 should establish task-specific treatments for:
- kana;
- kanji;
- vocabulary;
- grammar;
- listening;
- sentence work;
- productive writing;
- speaking.

The Study Player remains the highest-clarity surface in the product. Decorative systems must support the task and never compete with the prompt.
