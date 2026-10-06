# J2 Acceptance — Living App Shell

## Status

**Implementation complete. Final CI qualification is required for the latest J2 commit.**

J2 migrates the learner-facing application chrome onto the J1 Japanese Design Engine while deliberately preserving the existing surface bodies for later J3–J8 redesign.

## Implemented

### Japanese product identity

The learner shell now uses:
- 日本語 / Japanese identity;
- a product-authored hanko-style 日 mark;
- Japanese + English primary-surface naming;
- seasonal Japanese ambience;
- J1 washi/sumi material and token systems.

The old learner-facing P22 phase string has been removed from the shell.

### Primary navigation

The five authoritative learner destinations remain unchanged:
- 今日 / Today;
- 学ぶ / Learn;
- 浸る / Immerse;
- 蔵 / Library;
- 道 / Progress.

Accessible button names remain the stable English surface names so existing navigation contracts and assistive technology remain predictable.

### Responsive shell

Desktop:
- 214px Japanese navigation rail;
- persistent product identity;
- full Japanese/English labels;
- contextual hint text;
- wide learner canvas.

Tablet:
- compact 82px rail;
- Japanese mon/glyph navigation;
- learner canvas receives the reclaimed width.

Mobile:
- fixed five-destination thumb navigation;
- safe-area support;
- compact sticky product bar;
- account and theme controls remain reachable;
- no horizontal-scroll dependency.

### Theme behavior

J2 activates the J1 light/dark material system in the actual learner shell:
- light: washi/paper;
- dark: sumi/charcoal/indigo/lacquer family;
- never green-tinted dark mode.

Theme choice persists locally when storage is available and follows OS preference when no choice has been saved.

### Seasonal ambience

The shell derives a lightweight Japanese seasonal state:
- spring;
- tsuyu;
- summer;
- autumn;
- winter;
- New Year.

Season changes only ambient token/pattern treatment. It does not modify learner content, navigation or mastery meaning.

### Operations separation

The following panels are removed from normal Progress:
- external human-review administration;
- release operations;
- deployment identity;
- provider health.

They are available only from the explicit diagnostics workspace:

`?diagnostics=1`

This boundary is organizational, not an authentication/security boundary.

B2/C1 learner portfolios remain in Progress because they represent learner evidence rather than release operations.

### Learner-engine boundary

J2 does not change:
- StudyEvent semantics;
- FSRS scheduling;
- mastery calculation;
- content packages;
- course graph;
- search;
- account identity;
- local-first persistence;
- evidence/CEFR boundaries.

StudyPlayer remains on its pre-J-series visual shell until J5.

## Automated qualification

`tests/e2e/j2-living-shell.spec.ts` covers:
- Japanese product identity;
- exactly five primary destinations;
- stable accessible English navigation names;
- active-page semantics;
- absence of learner-facing P22 release chrome;
- light/dark theme activation;
- navigation after theme change;
- horizontal-overflow regression;
- release/provider panels absent from learner Progress;
- operations available in explicit diagnostics mode;
- exit from diagnostics through learner navigation;
- mobile touch-target sizing.

The existing P21 product-navigation regression should remain valid because the five surface names and semantic navigation contract are preserved.

## J3 handoff

J3 should redesign **Today / 今日** as the first complete J-series learner surface.

J3 should not treat the existing six-stat dashboard as the visual model. It should establish:
- the Japanese morning-study ritual;
- one dominant Continue action;
- shoji-light composition;
- oversized 今日 art;
- ink-route queue composition;
- restrained daily seal;
- hierarchy between due work, new learning and optional practice;
- desktop/mobile compositions built from the J1/J2 primitives.

J3 becomes the quality bar for J4–J8.
