# J14 Acceptance — Performance, Accessibility & Real-Device Qualification

## Status

**Implementation and automated qualification infrastructure are complete. Physical Android/PWA acceptance remains intentionally pending until a real device is tested.**

J14 is a hardening phase. It does not add another visual concept or another learner feature.

## Dark-mode repair

J14 fixes the dark-mode breakage introduced by the coexistence of the older pre-J-series CSS and the newer token-driven J-series surfaces.

The root problem was not the J1 dark palette itself. The J1/J2 shell correctly supplied dark tokens, but hundreds of older learner/research controls still used literal light values such as:

- white card backgrounds;
- cream input backgrounds;
- pale neutral chips;
- light green success states;
- light rust correction states;
- fixed beige borders;
- fixed dark text.

As a result, switching the shell to dark mode could leave nested advanced panels, Reader/support controls, portfolio evidence and other legacy components visibly light.

J14 preserves the light baseline for bundle efficiency and adds a lazy dark-compatibility layer that remaps legacy controls onto the existing J-series token system only when dark mode is actually used.

### Lazy dark compatibility

Dark compatibility is split into:

`J14DarkRuntime.ts`
`j14-dark.css`

It is loaded before the first React render when a persisted/system dark preference is active, and before a light→dark theme toggle is committed.

This avoids both a broken nested dark UI and a permanent cost to the light-mode entry stylesheet.

The document theme is also primed before React mounts and is no longer torn down during shell→Study→shell transitions, removing the previous light-theme flash/flicker boundary.

### Neutral surfaces

Dark legacy surfaces now derive from:

- `--j-bg`;
- `--j-bg-elevated`;
- `--j-bg-muted`;
- `--j-fg`;
- `--j-fg-muted`;
- `--j-line`;
- `--j-line-strong`.

This applies to cards, inputs, textareas, selects, result rows, study controls, reader support, advanced research panels and portfolio evidence.

### Semantic states

Success/selected/warning/correction states now use theme-aware `color-mix()` values against the active J-series background rather than hard-coded pale surfaces.

Dark mode therefore keeps:
- success green as a dark restrained green tint;
- warning/correction as a dark vermilion/rust tint;
- neutral chips as charcoal/elevated-paper tints;
- readable semantic text without a white card behind it.

Light mode preserves the same semantic categories.

### Study

The isolated J5 Study Focus Chamber already had a dark shell. J14 finishes compatibility for inherited pre-J5 controls so a dark Study session no longer exposes light legacy inputs/cards inside the dark chamber.

### Persistence

The active theme continues to persist through:

`japanese:j-theme`

and is synchronized with:
- `html[data-j-theme]`;
- the J2 shell;
- Study;
- browser/PWA `theme-color`.

J14 adds regression coverage for dark → reload → light → reload.

## J14 experience budgets

The production build now runs:

`scripts/j14-experience-budget.mjs`

after the existing P22 initial-entry budget.

The J14 budget enforces:

### Lazy technical/responsive layers

These chunks must remain lazy and must not be referenced eagerly by `index.html`:

- `J11Diagnostics`;
- `J12MobileRuntime`;
- `J13ExhibitionRuntime`;
- `J14DarkRuntime`.

Per lazy chunk:
- CSS gzip budget: 12 KiB;
- JS gzip budget: 64 KiB.

The stricter existing P22 entry budgets remain unchanged.

### Visual assets

Shipped image/font assets are bounded by:

- 1.5 MiB maximum per visual asset;
- 4 MiB maximum total visual/font payload.

J14 does not authorize new third-party artwork. The J1 provenance registry remains authoritative.

A machine-readable report is written to:

`artifacts/j14-experience-budget.json`.

## Reflow and zoom-equivalent qualification

J14 adds an explicit 320 CSS-pixel reflow pass across:

- Today;
- Learn;
- Immerse;
- Library;
- Progress.

A 320 CSS-pixel viewport is the relevant narrow reflow target for the desktop-width/zoom accessibility boundary.

The test fails on document-level horizontal overflow.

This complements the existing compact/mobile profiles rather than replacing them.

## Keyboard qualification

J14 verifies that:

- learner navigation can receive visible keyboard focus;
- Enter activates a learner destination;
- the Learn emakimono can receive a visible focus indicator;
- expandable specialist-practice summaries are keyboard reachable and keyboard operable.

J13 large-screen focus rules remain part of the production design.

No pointer-only learner navigation is introduced.

## Screen-reader structure

J14 verifies the core landmark/heading contract:

- exactly one learner `main#main-content`;
- exactly one primary learner navigation landmark;
- five named learner destinations;
- primary navigation precedes main content in DOM reading order;
- each primary learner destination exposes one primary `h1`.

J13 exhibition marginalia is implemented as real `aria-hidden` content rather than CSS-generated text so it cannot leak into accessible reading order.

J11 diagnostics continues to replace—not duplicate—the learner primary navigation when open.

## Reduced motion

J14 runs all five learner destinations under:

`prefers-reduced-motion: reduce`

and verifies that the J9 surface choreography resolves to no animation.

The fusuma transition remains removed in reduced-motion mode.

J10 seasonal artwork remains static.

## Route/runtime separation

The app now has four deliberately separated secondary runtime layers:

- J11 diagnostics — technical only;
- J12 mobile composition — ≤760px;
- J13 exhibition composition — ≥761px;
- J14 dark compatibility — only when dark mode is active/selected.

J14 budgets assert that all three remain code-split.

This prevents later visual work from quietly re-merging every responsive/technical concern into the initial learner bundle.

## Offline/PWA

Existing PWA qualification remains authoritative for:
- service-worker shell caching;
- local content search;
- offline reload;
- mobile J12 chunk availability after controlled online load.

J14 includes `offlinePwa` in its automated qualification evidence rather than introducing a second service worker.

## CI qualification report

CI now records:

`artifacts/j14-regression-evidence.json`

after the complete Playwright suite passes.

It then runs:

`pnpm qualify:j14`

which combines:
- typecheck;
- unit tests;
- content validation;
- native provenance audit;
- production build;
- P22 bundle gate;
- J14 lazy/art budget;
- E2E;
- dark mode;
- 320px reflow;
- keyboard;
- screen-reader structure;
- reduced motion;
- mobile;
- tablet/desktop;
- offline PWA.

Outputs:

`artifacts/j14-qualification.json`
`artifacts/j14-qualification.md`

## Physical-device boundary

J14 does **not** convert Playwright's Pixel/compact emulation into a physical-device claim.

The checked-in acceptance manifest is:

`release/j14-device-acceptance.json`

It remains `pending` until a real Android/PWA pass records all required checks against an identified 40-character build commit.

Required physical checks include:
- standalone install;
- cold launch;
- light/dark toggle;
- dark-mode core surfaces;
- dark-mode advanced studios;
- full learner-surface traversal;
- full-screen Study;
- Reader;
- Library;
- offline reload;
- background/resume;
- rotation;
- safe areas;
- 200% text scale;
- screen-reader smoke test;
- speaker/headphone audio;
- microphone recording;
- local-audio deletion.

Until that manifest becomes `pass`, J14 qualification status is:

`blocked_physical_device`

provided all automated evidence is green.

That is intentional and should not be overridden by emulated evidence.

## Dedicated J14 browser qualification

`tests/e2e/j14-qualification.spec.ts` covers:

- dark-mode token integrity;
- dark nested legacy surfaces;
- WCAG-style contrast threshold on sampled dark surfaces;
- theme persistence;
- 320px reflow;
- landmark/heading order;
- reduced-motion suppression;
- keyboard focus/activation.

Existing J2–J13 and PWA suites continue to cover their own contracts.

## J15 handoff

J15 should be migration/cleanup only.

It should:
- remove CSS and React paths made unreachable by J2–J14;
- remove obsolete pre-J-series selectors after proving no current component uses them;
- consolidate duplicate breakpoints;
- preserve every J14 qualification gate;
- reduce CSS/JS debt and bundle size;
- avoid changing learner IA, mastery semantics or the locked J-series art direction.

No new product design should begin in J15.
