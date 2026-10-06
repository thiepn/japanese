# ADR-023 — J-Series Major Visual Product Version

## Status

Accepted.

## Context

P21/P22 froze learner-capability growth and moved the current release line into release qualification and defect-only maintenance. The existing learner-facing interface, however, accumulated many phase-specific panels and a large monolithic stylesheet. Product direction has explicitly requested a major visual redesign whose scope includes navigation, primary-surface composition, responsive behavior, Japanese-specific art direction and separation of operational/admin UI from learner UI.

Treating that work as ordinary P22 maintenance would violate the intent of the maintenance freeze.

## Decision

Create a separate **J-series visual/product-version track**.

The J-series may:
- replace the learner shell and navigation;
- redesign primary surfaces;
- introduce reusable Japanese visual primitives and themes;
- recompose existing functionality;
- move release/diagnostic/admin controls out of normal learner navigation;
- change responsive and motion behavior;
- add decorative/seasonal visual layers;
- improve accessibility and interaction quality.

The J-series may not, by virtue of this ADR:
- add a new proficiency layer;
- create another scheduler or mastery authority;
- change StudyEvent truth semantics;
- weaken provenance, privacy or local-first boundaries;
- promote AI/model feedback into durable mastery;
- claim new assessment validity.

The P20 learning architecture remains authoritative. P22 remains the operational baseline for the current release line. The J-series should be qualified as a new major presentation/product version rather than smuggled through defect-only maintenance.

## Visual authority

`docs/J0_ART_BIBLE.md` is the design authority for the J-series.

`docs/J_VISUAL_ROADMAP.md` defines implementation order.

`docs/J0_ACCEPTANCE.md` defines J0 completion and future-phase visual acceptance tests.

## Consequences

Positive:
- the visual rebuild can be ambitious without corrupting the stable release policy;
- learner truth and scheduling remain isolated from presentation changes;
- old UI can be removed rather than endlessly patched;
- visual QA can be judged against one locked art direction.

Cost:
- the next visual release requires its own regression/device qualification;
- shell and primary-surface changes cannot inherit P21 physical-device evidence automatically;
- artwork/font reuse needs explicit provenance and licensing checks;
- the monolithic legacy CSS must be migrated deliberately rather than rewritten in one unsafe cutover.
