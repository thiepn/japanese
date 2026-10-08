# J15D — Native CSS Ownership & Legacy Shell Purge

**State:** First implementation slice staged for CI. J15C is merged; this is the next structural cutover, not another visual redesign.

## Baseline and disposition

The initial `apps/web/src/styles.css` was 96,172 source bytes and still included the J0-era `app-shell`, `nav`, `topbar`, `content`, and pre-J5 `study-*` page structures. The active application uses J2 shell (`j2-shell` / `j2-nav`), J5 Study (`j5-study`) and five independently designed J pages.

A source review of all 35 application TSX files found no exact assignments of those retired class names. **The first slice removes 60 selectors across 13 obsolete roots**, and preserves the four mixed declarations' still-active selectors rather than dropping whole rules. No learning, database, content, auth, or routes are changed.

This is deliberately not a global delete-everything-labeled-old process. The large common stylesheet also supports active C1 native listening, research, portfolios, human review, and offline evidence workflows.

## CSS ownership after slice 1

| File | Role | Treatment |
| --- | --- | --- |
| `styles.css` | Existing core/common and advanced-tool components | Remove obsolete shell and old Study rules; protect shared controls, research and portfolios |
| `j1.css` + `j15b.css` | Semantic palette and cross-page Japanese visual grammar | Remain the J-series styling authority |
| `j2.css` – `j10.css` | Destination-specific art and surface composition | Keep separate; avoid generic dashboard convergence |
| `j12.css`, `j13.css` | Lazy mobile/exhibition overrides | Keep lazy-loaded and individually qualified |
| `j11.css` | Developer diagnostics | Keep lazy-loaded, out of learner entry path |

## Acceptance criteria

1. No bare old shell styles return, including `app-shell`, `topbar`, `nav`, `content`, `study-shell`, `study-card` and obsolete Study derivatives. Current `j2-nav` / `j5-study` remain.
2. Mixed selectors continue applying to the still-active declarations.
3. `primary`, `course-kicker`, `result-card`, `reader-token`, `p20-readiness`, and `skip-link` remain in common CSS.
4. No new CSS layer, markup refactor, global `!important`, shadow system, or changed bundle budget.
5. Keep Today → Study, five-page navigation, Library search, Progress, dark/light modes, compact-mobile navigation, offline behavior and accessibility tests green.
6. `pnpm verify:j15d` produces `artifacts/j15d-native-css-purge.json`. P22 full build and the 40 KiB compressed CSS limit remain mandatory.

## Remaining J15D phases

- **D2:** independently inventory currently used legacy advanced-tool and shared component selectors, classify dynamic class names, and document deletion evidence before removing more CSS.
- **D3:** modularize only proven-independent common styles by owning route; lazy-import advanced support where safe and benchmark first paint.
- **D4:** browser visual diffs and physical device evidence; qualify exact candidate commit and desktop/tablet/Android layouts.
- **D5:** final native visual-system migration release assessment, including accessibility, contrast, input controls, PWA and bundle budgets.

**Release boundary:** automated CI does not constitute **physical Android** PWA acceptance, independent Japanese proficiency validation, or stable channel promotion. J15D must not be merged until its own CI passes.
