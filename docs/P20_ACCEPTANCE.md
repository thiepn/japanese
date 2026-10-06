# P20 Acceptance — Longitudinal C2 Readiness Consolidation, External Calibration & Final Advanced-Learner Qualification

## Status

**Implementation complete.**

P20 does not add another isolated practice subsystem. It consolidates P14–P19 advanced evidence into a transparent readiness model and introduces a deliberately narrow **internal advanced-pathway qualification**.

The qualification is a product state, not an accredited CEFR C2 certificate.

## Qualification architecture

P20 uses eleven explicit gates:

1. **Longitudinal evidence window** — at least 28 days and 8 advanced active days.
2. **Reliable long-form production** — at least 2 delayed-reliable artifacts across at least 4 production days.
3. **Precision breadth** — at least 8 P17 transformations across 6 precision modes and 3 days.
4. **Sustained specialist discourse** — at least one delayed-reliable specialist track and 10 specialist turns.
5. **Repeated interaction pressure** — at least 2 robust P18 sessions on different days and at least 10 of 12 pressure types.
6. **Actual human exchange** — at least 2 real-partner logs, 45 total minutes and 2 days.
7. **Audio/listening breadth** — at least 4 real-audio captures across 3 prosody targets plus 4 overlap attempts across 3 tasks and multiple days.
8. **Repeated broad external review** — at least 2 broad P19 reviews, two distinct reviewer labels and at least a 7-day review span.
9. **Seven-dimension repeated observation** — every advanced dimension must be scored in at least two broad reviews.
10. **Stable advanced external performance** — every dimension must remain at or above the advanced-control floor and aggregate broad-review performance must be at least 3.50/5.
11. **Calibration resolution** — no unresolved 3-point or greater disagreement on a jointly scored dimension in the latest label-distinct broad-review pair.

All thresholds are visible in the UI and export. There is no hidden weighted readiness score.

## Seven-dimension readiness matrix

P20 tracks the same externally reviewable dimensions introduced in P19:

- lexical precision;
- grammatical control;
- discourse organization;
- interaction repair;
- register flexibility;
- prosodic control;
- listening under pressure.

For each dimension P20 exposes:

- internal structural evidence count and support band;
- all external observations;
- qualifying broad-review observations;
- broad-review mean;
- latest score;
- earliest-to-latest trend;
- score spread;
- readiness status;
- persistent weakness flag.

Internal evidence and external human scores remain separate. P20 does **not** convert structural evidence counts into a language-quality score.

## External reviewer calibration

P20 compares the latest useful pair of broad reviews and shows:

- earlier/later reviewer labels;
- per-dimension scores;
- signed score deltas;
- mean absolute delta;
- maximum absolute delta;
- dimensions with severe disagreement.

Calibration states are:

- unavailable;
- single reviewer label;
- aligned;
- mixed;
- divergent.

A 3-point-or-greater disagreement on any jointly observed dimension is considered unresolved divergence and blocks qualification.

Different reviewer labels **do not prove reviewer identity or independence**. The app does not verify credentials.

## Persistent weakness handling

P20 does not allow a high aggregate to hide a weak dimension.

A dimension is weak when repeated broad-review evidence falls below the advanced-control floor. Repeated scores of 2 or below are explicitly marked as persistent weakness and surface in the next-evidence plan.

Final internal qualification requires all seven dimensions to be stable or strong.

## Internal advanced-pathway qualification

When all eleven gates pass, P20 can display:

**Advanced pathway qualified**

This means only that the THIEPN Japanese product has collected enough longitudinal, externally calibrated evidence to satisfy its published internal advanced-learning gate.

It does **not** mean:

- accredited CEFR C2 certification;
- an official language examination result;
- verified reviewer identity or credentials;
- automatic FSRS/mastery changes;
- subject-matter expertise;
- verified native-speaker equivalence.

## Exports

P20 adds dedicated JSON and Markdown readiness reports containing:

- qualification status;
- all eleven gate results;
- seven-dimension readiness matrix;
- reviewer-calibration evidence;
- unresolved weak dimensions;
- next recommended evidence actions;
- explicit non-certification boundaries.

The main portable portfolio advances to **schema v7 / P20** and embeds the same readiness summary.

## Acceptance checks

- Unit tests cover full internal qualification, reviewer divergence, label-distinct review limitations and persistent weak-dimension blocking.
- Browser tests verify the P20 Progress surface, eleven visible gates, seven-dimension matrix, exports and certification boundary.
- Earlier P14–P19 browser tests remain scoped to the capabilities introduced by those phases.
- CI continues to require typecheck, unit tests, content validation, native/provenance audits, production build and Playwright.
