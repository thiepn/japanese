# J15C — Reading and Interface Legibility

**Status:** implementation rebased onto merged J15B; awaiting J15C CI and exact candidate deployment checks before release.

## Problem

J7 Library and J8 Progress currently contain real content in 6–10px labels, previews, provenance and evidence text. J12/J13 responsive styles shrink navigation even further. Density is not a valid reason to make reference material unreadable. Japanese learning requires reliable discrimination of scripts, furigana and semantic details across phone and desk layouts.

## Scope

- **Library:** retain search-first archival folio, but raise filter labels, result kinds and previews, reference explanations, section labels, badges and provenance to practical minimums (10–14px depending on role). Preserve canonical entity IDs, readings and keyboard listbox behavior.
- **Progress:** show readable evidence counts, source notes and ledger descriptors; do not touch mastery calculation or report inferred proficiency.
- **Shell:** both J12 mobile and J13 exhibition rails maintain at least 10px navigation secondary labels. The bottom rail remains flat; no floating or rounded SaaS dock.
- **Small phones:** descriptive copy hidden solely for density remains subject to future evidence-driven review; this phase improves surviving essential text, without changing content availability.
- **Study / Reader:** untouched in this phase to protect established focus and reading composition.
- **Themes:** change typography sizes only; inherit current semantic foreground, dark surfaces, focus rings and seasonal palette.

## Protection rules

1. No user-visible learning stats, evidence, course unit selection or Account state may be changed by CSS work.
2. Text and interactive controls must not overflow at 320/360px, tablet, or desktop.
3. Never use a large hero headline as a substitute for actionable content.
4. No additional always-loaded stylesheet, new image/font, background blur or budget extension.
5. Check the *computed font size* after the lazy J12/J13 layer loads, not just source declaration sizes.
6. Keep keyboard focus, screen-reader structure, reduced motion and local-first search intact.

## Executable acceptance

`pnpm verify:j15c` checks source minimums and writes `artifacts/j15c-legibility-audit.json`.
`pnpm build` includes the gate after J15B. Playwright `j15c-legibility.spec.ts` measures actual computed Library/Progress/navigation text size across all three existing browser profiles, with dark mode, focus and overflow checks. Existing J14/J15B, P22 and content qualification remain required.

## Release boundary

J15B passed CI and merged as `a7612f2`. J15C is now based directly on that merged commit. J15C must pass its own full CI before merge; then the exact public candidate deployment must be verified. The P22 initial CSS limit remains unchanged (40 KiB gzipped); redundant shadows were removed rather than increasing the limit. **Physical Android** PWA acceptance and independent language-performance validation remain separate real-world gates.
