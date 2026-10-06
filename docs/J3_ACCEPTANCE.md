# J3 Acceptance — Today / 今日

## Status

**Implementation complete. Final CI qualification is required for the latest J3 commit.**

J3 is the first complete learner surface rebuilt on the J-series visual system. It replaces the old six-stat Today dashboard with a Japanese daily-study ritual while preserving the existing queue and Study Player behavior.

## Visual direction

Today now follows the J0/J1/J2 art direction:

- washi-based page material;
- shoji-derived light/grid structure;
- oversized 今日 calligraphic display;
- restrained seasonal pattern field;
- hanko/seal treatment;
- ink-divider and ink-progress primitives;
- asymmetric composition instead of repeated equal-weight cards.

The surface remains deliberately quieter than Learn will be in J4.

## Information architecture

The old six equal statistics are removed.

Today now presents:
- one dominant Continue action;
- one current-path summary;
- four study intentions:
  - Review;
  - Learn;
  - Listen;
  - Apply;
- a compact secondary detail row for new items, course steps and memory traces.

The four intentions are projections of the existing queue summary:
- Review = due;
- Learn = new kana + new vocabulary + course;
- Listen = listening;
- Apply = application.

No new scheduler or queue truth is introduced.

## Daily ritual

The hero communicates:
- current Japanese date via browser locale;
- 「一日一歩」 as a decorative daily-study motif;
- the current required step count;
- answers completed during the current app visit;
- whether the current planned path is complete.

The daily seal is visual reinforcement only. Numeric/text state remains explicit.

## Continue behavior

The J3 Continue control still calls the existing `buildTodayQueue()` path through the unchanged App callback.

J3 does not alter:
- queue construction;
- due-item priority;
- course selection;
- first-exposure lessons;
- memory traces;
- audio prefetch;
- Study Player;
- grading;
- FSRS/StudyEvent behavior.

## Responsive behavior

Desktop:
- asymmetric hero with wide study-intent field and narrow ritual panel;
- four-node horizontal study path.

Tablet:
- compressed ritual panel;
- two-column path.

Mobile:
- stacked hero;
- ritual summary becomes horizontal/compact;
- path becomes a vertical sequence;
- dominant Continue action remains thumb-safe;
- no horizontal navigation dependency.

## Theme and accessibility

J3 inherits J2 light/dark and seasonal tokens.

Requirements implemented:
- heading semantics retained;
- Continue remains a real button;
- queue progress remains a semantic progressbar;
- decorative glyphs are hidden where they duplicate information;
- no meaning depends on color alone;
- reduced-motion behavior preserves the layout/state;
- existing English accessible navigation remains unchanged.

## Automated qualification

`tests/e2e/j3-today.spec.ts` covers:
- J3 Today surface presence;
- Japanese visual identity;
- preserved accessible heading state;
- four-intention route;
- removal of the old six-stat dashboard;
- single dominant Continue action;
- dark-theme compatibility;
- mobile action sizing;
- horizontal-overflow regression;
- handoff from J3 Continue into the existing Study Player.

Existing J2/P21 navigation tests remain relevant.

## J4 handoff

J4 should rebuild **Learn / 学** as the signature emakimono-style A1→C1 learning journey.

It should stop rendering the current long sequence of capability cards as the primary information architecture.

J4 must preserve:
- unit ordering;
- prerequisites;
- mastery values;
- assessment states;
- milestone truth;
- direct entry into existing study/assessment sessions.

The visual metaphor may radically change; learner truth may not.
