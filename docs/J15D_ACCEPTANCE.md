# J15D — Native CSS Ownership & Legacy Shell Purge

**State:** D1–D4 browser regression CI passed on a previous candidate; D5 release-decision gates are implemented and require exact-head CI, visual review and physical Android acceptance. J15C is merged; this is the next structural cutover, not another visual redesign.

## Baseline and disposition

The initial `apps/web/src/styles.css` was 96,172 source bytes and still included the J0-era `app-shell`, `nav`, `topbar`, `content`, and pre-J5 `study-*` page structures. The active application uses J2 shell (`j2-shell` / `j2-nav`), J5 Study (`j5-study`) and five independently designed J pages.

The initial static scan missed compatibility class names still carried by the live J5 Study markup. CI exposed the mismatch. **D1 removes 60 selectors from shared CSS across 13 obsolete roots and removes the corresponding retired Study class names from active React markup**, preserving the four mixed CSS rules' still-active selectors. Native J5 class names replace inherited test selectors. No learning, database, content, authentication, or routing behavior is changed.

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

1. No obsolete shell classes remain in active Study markup or bare old shell styles, including `app-shell`, `topbar`, `nav`, `content`, `study-shell`, `study-card` and obsolete Study derivatives. Current `j2-nav` / `j5-study` remain.
2. Mixed selectors continue applying to the still-active declarations.
3. `primary`, `course-kicker`, `result-card`, `reader-token`, `p20-readiness`, and `skip-link` remain in common CSS.
4. No new CSS layer, markup refactor, global `!important`, shadow system, or changed bundle budget.
5. Keep Today → Study, five-page navigation, Library search, Progress, dark/light modes, compact-mobile navigation, offline behavior and accessibility tests green.
6. `pnpm verify:j15d` produces `artifacts/j15d-native-css-purge.json`. P22 full build and the 40 KiB compressed CSS limit remain mandatory.

## Remaining J15D phases

- **D2 ownership inventory (implemented; CI pending):** scan application, package and service sources for common-CSS class references; classify J-series, phase-specific and shared selectors; report dynamic class construction and unresolved selectors, and require manual review before any further deletion. Produces `artifacts/j15d-css-ownership.json`.
- **D3 (implemented, CI pending):** move the independently owned P10 human-review / media-curation / release-operations CSS to the already lazy J11 diagnostics route; verify entry/lazy bundle boundaries and the actual Vite CSS sizes without inferring browser paint timing. Further C1/C2 modularization remains out of scope pending owner evidence.
- **D4 (implementation staged; CI pending):** compare J15C and J15D screenshot evidence at desktop/tablet/mobile in light/dark, and separately collect physical Android PWA checks against the exact deployed commit. See J15D_D4_ACCEPTANCE.md.
- **D5 (implemented; CI pending):** evidence-based final visual migration decision for semantic tokens, CSS ownership, accessibility, input controls, offline PWA, lazy bundles, the 42-case visual comparison, physical Android validation and formal release signoffs. See J15D_D5_RELEASE.md.

**Release boundary:** automated CI does not constitute **physical Android** PWA acceptance, independent Japanese proficiency validation, or stable channel promotion. J15D must not be merged until its own CI passes.

## D2 ownership inventory safeguards

`pnpm verify:j15d` runs both native-shell purge and **D2 ownership inventory**. The inventory scans the complete source tree (including lazy submodules) for CSS class references and distinguishes observed source references from unresolved selectors; unresolved does **not** equal safe to delete because `className` may be composed dynamically or rendered externally. This phase does not automatically delete a second tranche of shared CSS. The protected classes include `primary`, `reader-token`, `p20-readiness`, `course-kicker`, `result-card`, and `skip-link`. Review the JSON artifact and current browser UI before proposing future removals.

## D3 — Diagnostics CSS extraction

The P10 administrative CSS block is isolated into `apps/web/src/design/j11-operations.css`, imported **only** in `J11Diagnostics.tsx` before its existing `j11.css`. This route is already lazy via `React.lazy` in `App.tsx`. The three owning components (`HumanReviewPanel`, `NativeCurationPanel`, `ReleaseOperationsPanel`) render exclusively from that route; no learner-owned or C1 study component requires this block. This is a controlled split, not a new global cascade layer. P13–P20 learner/advanced work stays in `styles.css` because it is shared across Learn, Immerse and Progress.

The initial source stylesheet was 92,129 bytes after D1. D3 removes the exact P10 source block without modifying its rules. Source and built-artifact audits check that P10 selectors disappear from initial CSS, appear in exactly one lazy J11 CSS chunk, preserve J11's original rules, and remain functional at desktop, Android and compact-mobile widths. `pnpm verify:j15d:d3` checks the **built** CSS and produces `artifacts/j15d-d3-css-boundary.json` with actual gzip byte counts; the regular `pnpm verify:j15d` runs the source boundary audit too. Gzip entry size is a reproducible CSS transfer proxy, **not** a claim of measured FCP or LCP. Capturing actual first-paint timing would require separate calibrated browser/performance data; no such timing is invented here.

Physical Android PWA approval, screen-reader sessions and stable promotion remain separate from green CI.

## D5 — Final release assessment

`pnpm qualify:j15d:d5:ci` checks automated artifacts after complete CI and emits a blocked release report until separately reviewed screenshots, physical Android testing and three human signoffs are complete. `pnpm qualify:j15d:d5:strict` fails closed unless ALL gates pass at the same exact candidate SHA. Automated green CI is neither Android device acceptance nor stable channel approval.

### Immutable evidence workflow

Approvals are stored on a **separate evidence ref**, not appended to the tested application commit. The on-demand `j15d-d5-final.yml` workflow rechecks exact upstream CI/visual run SHAs and reads completed reviewer and physical-device manifests from that evidence ref. This prevents an evidence-only commit from silently changing the tested candidate. See `docs/J15D_D5_RELEASE.md`.
