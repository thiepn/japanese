# J13 Acceptance — Tablet & Desktop Exhibition Layer

## Status

**Implementation complete. Final CI/browser qualification is required for the latest J13 commit.**

J13 makes tablet and desktop intentionally composed Japanese learning environments rather than enlarged versions of the phone UI.

The learner information architecture and evidence model remain unchanged.

## Lazy exhibition boundary

The large-screen layer is loaded only when the viewport is wider than the mobile breakpoint.

`main.tsx` uses:

`matchMedia("(min-width: 761px)")`

to lazy-load:

`J13ExhibitionRuntime.ts`
`j13.css`

Desktop/tablet presentation therefore remains separated from:
- J12 phone-only CSS;
- J11 diagnostics CSS;
- the initial shared J-series bundle.

If a session begins on mobile and later becomes wider, the exhibition layer is loaded on first entry into the tablet/desktop range.

## Tablet composition

At 761–1179px, J13 preserves the compact J2 rail while using the available canvas for stronger two-pane layouts.

Tablet behavior includes:
- left-side primary navigation rather than phone bottom navigation;
- Today keeping four intentions in one horizontal route;
- Learn retaining horizontal emakimono behavior;
- Reader using sticky tools beside the reading paper;
- Library using catalog + reference columns;
- Progress preserving a two-part hero.

Tablet is not treated as a scaled phone.

## Desktop shell

At ≥1180px:
- primary navigation grows into a deliberate 238px contextual rail;
- top-bar rhythm becomes more spacious;
- learner content expands to a 1540px exhibition canvas;
- navigation remains sticky;
- Japanese glyphs and labels retain a vertical spatial relationship;
- learner content no longer inherits the former 880–1120px generic-dashboard ceiling.

At very wide screens (≥1500px), the rail and content field expand once more without stretching text columns arbitrarily.

## Exhibition marginalia

Today, Learn, Immerse, Library and Progress gain large low-contrast Japanese marginal glyphs:

- 今日;
- 学;
- 浸;
- 蔵;
- 道.

They are decorative only and do not enter the accessibility tree or change heading structure.

The effect is a Japanese exhibition/page-margin treatment rather than a SaaS background watermark.

## Today / 今日

Large-screen Today becomes an asymmetric morning composition.

Desktop:
- hero grows to a 1.6 / 0.4 composition;
- title lockup gains much larger Japanese scale;
- the daily ritual becomes a dedicated narrow side panel;
- Continue remains the primary action;
- the four-intention route spans the full horizontal field;
- secondary statistics sit as a quieter offset strip.

Queue priority, due counts and session behavior are unchanged.

## Learn / 学

Desktop Learn becomes the signature panoramic emakimono.

J13:
- increases the hero art field;
- expands the level regions;
- creates a 640px-tall scroll panorama;
- uses mandatory horizontal scroll snapping at desktop width;
- keeps the section heading visible as a contextual rail;
- gives each A1→C1 region enough room to read as a landscape chapter;
- expands specialist-practice and evidence layouts across the wider field.

Scrolling remains learner-controlled.

No automatic panning or hidden progression is introduced.

## Immerse / 浸

Desktop Immerse becomes a large editorial wall.

J13:
- expands the hero;
- uses four media columns at standard large desktop and five at extra-wide desktop;
- increases feature-story asymmetry;
- uses wider series/mission grids;
- preserves Advanced Studios as progressive disclosure.

The visual density is intentionally closer to a Japanese magazine/bookshop/editorial wall than an application dashboard.

## Reader

Tablet and desktop Reader use the wide screen as a reading desk.

Desktop:
- persistent 270px reading-control rail;
- centered paper with an intentional maximum reading width;
- larger Japanese reading typography and line height;
- larger paper margins;
- word lookup remains a peripheral overlay.

Tablet keeps the same two-pane logic at reduced width.

Japanese text remains the center of attention; the wider screen does not produce unbounded line lengths.

## Library / 蔵

Large-screen Library becomes a research desk.

Desktop:
- larger archive masthead;
- full eight-category filter row;
- catalog/reference ratio favors the result corpus;
- reference sheet stays sticky;
- reference paper becomes taller and more spacious;
- Japanese headwords gain stronger scale.

At extra-wide desktop the reference panel remains bounded while the searchable catalog receives additional room.

The local search index and reference data remain unchanged.

## Progress / 道

Desktop Progress becomes an asymmetric byōbu-like evidence exhibition.

The page uses:
- a full-width hero;
- two-column lower composition;
- skill crests in the larger left panel;
- milestone road as a vertical right panel;
- full-width evidence ledger;
- full-width B2/C1 evidence vaults.

This changes presentation only.

The existing:
- mastery projections;
- evidence counts;
- milestones;
- B2 portfolio;
- C1→C2 portfolio

remain authoritative.

## Study

Large-screen Study becomes a quiet study desk rather than a huge stretched card.

J13:
- centers the task inside a bounded 1220px stage;
- gives the study-mode rail more breathing room;
- caps the actual prompt surface around a readable 900px;
- increases Japanese prompt scale;
- uses two-column choices where space allows.

Study remains the same J5 isolated focus chamber.

## Keyboard and pointer affordances

J13 explicitly strengthens large-screen input behavior.

Primary controls receive visible `:focus-visible` outlines.

The Learn emakimono remains keyboard-focusable and retains its own focus ring.

Sticky contextual rails are used where they support desktop reading:
- main navigation;
- Learn section context;
- Reader controls;
- Library reference.

No pointer-only action is introduced.

## Performance boundary

J13 is a separately lazy-loaded CSS chunk.

It does not add:
- raster art;
- video;
- Canvas;
- WebGL;
- new fonts;
- additional data fetches;
- continuous animation loops;
- large JavaScript layout systems.

The exhibition effect is achieved through responsive composition, existing procedural artwork and CSS.

J12 mobile CSS does not load initially on a desktop viewport, and J13 does not load initially on a phone viewport.

## Automated qualification

Added:

`tests/e2e/j13-exhibition.spec.ts`

Coverage includes:
- lazy large-screen runtime activation;
- mobile-runtime absence on initial desktop load;
- sticky desktop primary rail;
- mandatory panoramic Learn scroll snapping;
- document-overflow protection;
- tablet two-pane Reader geometry;
- persistent Reader tools;
- desktop Library catalog/reference composition;
- sticky Library reference;
- asymmetric Progress skill/milestone panels;
- vertical desktop milestone road;
- explicit keyboard focus visibility.

## J14 handoff

J14 should stop adding visual concepts and qualify the entire J-series as a finished product.

It should enforce:
- route/chunk and art budgets;
- contrast;
- zoom/reflow;
- screen-reader order;
- keyboard traversal;
- reduced-motion coverage;
- Android/PWA physical-device checks;
- tablet checks;
- desktop checks;
- offline behavior;
- long-session rendering/performance;
- representative low-end-device behavior.

J14 is a qualification/hardening phase, not another redesign.
