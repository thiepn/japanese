# J15 — Native Visual-System Migration

J15 removes the temporary compatibility architecture left after J1–J14 and makes the Japanese design system the native styling contract.

## Acceptance contract

J15 is complete when:

- `apps/web/src/styles.css` no longer owns the legacy light palette; old white/cream/beige surfaces and dark-only text literals are expressed through semantic Japanese tokens.
- light and dark modes use the same component rules with different token values.
- the J14 lazy dark compatibility runtime and stylesheet are deleted and no longer referenced.
- Study uses the same page-surface contract as the rest of the product.
- success, warning, danger, note, strong-control, muted and elevated surfaces have explicit semantic tokens.
- J11 diagnostics, J12 mobile and J13 exhibition remain lazy and within the existing experience budgets.
- the J14 dark-mode, reflow, accessibility, reduced-motion and offline regression suite remains green.
- the P22 candidate build and exact GitHub Pages candidate verification remain green.

## Static gate

Run:

```sh
pnpm verify:j15
```

The audit fails if the legacy palette returns to `styles.css`, literal white surfaces/foregrounds return, the deleted J14 compatibility runtime is referenced again, the semantic state tokens disappear, or Study regains a hard-coded page theme.

## Boundary

J15 is a structural visual-system migration, not a new product redesign. J12 mobile behavior and J13 exhibition composition remain authoritative. J14 physical-device acceptance remains a separate real-device gate and must not be inferred from automated J15 qualification.

## Visual direction lock

J15 deliberately moves the product away from generic SaaS/dashboard language.

- Desktop navigation is an editorial horizontal study rail rather than a permanent application sidebar.
- Primary pages read as washi/editorial spreads: thin ink rules, square paper edges, asymmetry, Japanese type and seal accents.
- Rounded dashboard cards, floating pills, glass panels and shadow-heavy tiles are not the default visual primitive.
- Large English marketing-style headings are constrained; Japanese glyphs, section marks, vertical labels and content structure carry more of the identity.
- Library remains archival, Learn remains emakimono/path-like, Immerse remains magazine/reader-like, Progress remains landscape/ledger-like and Today remains a study entry page. They must not collapse into one reusable dashboard template.
- Mobile keeps a conventional bottom navigation position for reachability, but its treatment is a flat paper/seal rail rather than a floating pill dock.

## J15A stabilization

J15A closes contradictions introduced by the anti-SaaS visual shift before further visual expansion.

- Seasonal styling must not reintroduce elevation shadows on the five primary page compositions.
- The mobile navigation is intentionally a flat paper/seal rail; regression tests must not require a floating shadow.
- J15A is complete only when the full cross-viewport Playwright suite is green and the exact candidate commit deploys successfully.
