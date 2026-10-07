# J12 Acceptance — Mobile Japanese Experience

## Status

**Implementation complete. Final CI/browser qualification is required for the latest J12 commit.**

J12 turns the J-series mobile experience into a purpose-built phone interface rather than a desktop composition that merely collapses at a breakpoint.

The learning architecture is unchanged.

## Mobile runtime boundary

The J12 mobile layer is loaded only when the viewport reaches the mobile breakpoint.

`main.tsx` uses `matchMedia("(max-width: 760px)")` to lazy-load:

`J12MobileRuntime.ts`
`j12.css`

If the application starts wider than the mobile breakpoint, the layer is not downloaded until the viewport first enters mobile width.

This keeps the existing P22 entry CSS budget intact and avoids charging desktop users for phone-only composition rules.

## Safe-area support

The document viewport now includes:

`viewport-fit=cover`

Mobile chrome uses:
- `env(safe-area-inset-top)`;
- `env(safe-area-inset-bottom)`;
- dynamic viewport units.

This protects:
- the sticky top bar;
- bottom navigation;
- full-screen Study;
- Reader;
- mobile content padding

on Android/iOS devices with display cutouts or gesture areas.

## Thumb-first shell

The five learner destinations remain:

- Today;
- Learn;
- Immerse;
- Library;
- Progress.

On mobile they become a dedicated fixed bottom navigation.

J12:
- increases the minimum tab target;
- makes the active Japanese glyph visually primary;
- keeps the English destination label;
- anchors navigation above the device safe area;
- removes expensive backdrop blur;
- keeps document horizontal overflow at zero.

The normal learner IA is unchanged.

## Today

Mobile Today is treated as a study launch surface.

Changes:
- tighter Japanese title lockup;
- smaller decorative footprint;
- primary Continue action remains above the bottom navigation fold;
- compact daily-status block;
- four intentions become a compact two-column route;
- secondary statistics are compressed.

The queue itself and its priority are unchanged.

## Learn

The desktop emakimono remains the conceptual model, but mobile uses a vertical chapter path rather than trying to preserve a wide illustrated scroll.

Changes:
- smaller hero;
- lighter decorative crest;
- compact foundation section;
- vertical level regions;
- tighter landmarks and assessment gates;
- thumb-sized quick-practice controls.

Course order, mastery and assessments are unchanged.

## Immerse

Mobile Immerse becomes a Japanese editorial shelf.

Changes:
- narrower vertical masthead/sign treatment;
- one-column reading/media compositions;
- compact ledger;
- thumb-safe advanced studios;
- reduced decorative cost.

Native-source learning and advanced research work remain available.

Release/source-promotion administration remains in J11 diagnostics.

## Reader

Reader receives a mobile reading treatment:
- dynamic-viewport minimum height;
- sticky Reader header beneath the app bar;
- full-width paper;
- compact margins;
- larger Japanese reading type;
- safe bottom padding.

Seasonal decoration remains outside the reading column.

## Library

Library now behaves as a mobile reference tool instead of a stacked desktop catalog.

Changes:
- compact archive masthead;
- sticky search field beneath the app bar;
- horizontal thumb-scrollable type filters;
- touch-safe result rows;
- tighter reference sheets;
- reference targets use mobile scroll margins.

The search index/content source is unchanged.

## Progress

Progress keeps the Japanese landscape/art direction while prioritizing evidence on a phone.

Changes:
- compact hero;
- reduced landscape height;
- tighter skill crests;
- vertical milestone road;
- compact evidence vaults;
- reduced descriptive copy at the narrowest width.

No mastery calculation changes.

## Full-screen Study

J12 makes Study a genuine mobile focus chamber.

During a Study session:
- learner primary navigation is absent;
- Study uses `100dvh`;
- the Study header is sticky;
- progress remains immediately below it;
- the task sheet fills the usable viewport;
- choice targets are at least 48px high;
- Continue stays thumb-reachable;
- writing fields retain a 16px input size to avoid mobile browser zoom;
- bottom padding respects gesture-safe areas.

StudyStep, grading, StudyEvent and scheduling semantics are unchanged.

## Low-end Android design boundary

J12 explicitly reduces expensive presentation work at phone widths.

The mobile layer:
- removes shell `backdrop-filter`;
- hides the large ambient brush;
- reduces ambient pattern size/opacity;
- lowers seasonal ambient opacity;
- disables hover-only transform effects for coarse pointers;
- uses `content-visibility:auto` for long lower sections;
- keeps animation subject to the existing reduced-motion system.

This is a rendering-cost qualification strategy, not a synthetic CPU benchmark.

The compact-mobile Playwright profile remains the constrained-layout regression proxy.

## Android / standalone PWA

The manifest now has:
- stable `id`;
- `display: standalone`;
- `display_override` with standalone first;
- no related native-app preference;
- J-series washi launch/background color.

The service-worker shell cache advances to v4 so the J12 shell replaces older cached shell state.

The J12 mobile CSS/JS chunk is fetched through the existing same-origin service worker and remains available after an online-controlled load followed by an offline reload.

## Browser chrome theme

The PWA/browser `theme-color` meta now follows the active J-series theme:

- light → `#FBF8F1`;
- dark → `#0D0D0C`.

The same synchronization is applied inside the isolated Study Player, so entering Study does not make Android browser/PWA chrome jump to the wrong theme.

## Performance architecture

J12 mobile CSS is not part of the initial desktop stylesheet.

The implementation preserves the existing production bundle budget by code-splitting mobile-only styling.

J11 technical diagnostics remains separately lazy-loaded as well.

No bundle-budget increase is authorized by J12.

## Automated qualification

Added:

`tests/e2e/j12-mobile.spec.ts`

Expanded:

`tests/e2e/mobile.spec.ts`
`tests/e2e/pwa.spec.ts`

Coverage includes:
- mobile-layer lazy activation;
- safe-area viewport metadata;
- removal of expensive mobile backdrop filters;
- Today primary action above navigation fold;
- bottom-nav anchoring;
- 48px navigation/choice targets;
- sticky Library search;
- horizontal filter strip;
- full-screen Study;
- all five learner surfaces without document overflow;
- low-cost long-section rendering;
- dynamic PWA theme-color;
- standalone manifest fields;
- J12 mobile layer surviving offline reload.

## J13 handoff

J13 should optimize the opposite end of the responsive spectrum: tablet and desktop as deliberately composed Japanese art spaces rather than enlarged phone layouts.

It should focus on:
- large-screen spatial composition;
- richer emakimono/landscape presentation;
- tablet two-pane reading/reference layouts;
- desktop editorial density;
- pointer/keyboard affordances;
- wide-screen artwork without SaaS dashboard framing;
- responsive continuity with the J12 phone experience.
