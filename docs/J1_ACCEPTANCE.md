# J1 Acceptance — Japanese Design Engine

## Status

**Implementation complete. Awaiting normal CI/device-independent browser qualification for the final J1 commit.**

J1 implements the reusable visual primitives required by the J0 art bible without redesigning the learner product yet.

## Implemented engine

### Token system

`apps/web/src/design/j1.css` defines:
- washi, sumi, indigo, vermilion, gold, matcha and sakura families;
- dedicated sumi/charcoal/lacquer dark mode;
- spacing, radius, shadow and motion tokens;
- semantic light/dark surface tokens;
- six seasonal token sets: spring, tsuyu, summer, autumn, winter and New Year.

### Typography roles

The engine defines:
- UI Gothic stack;
- editorial Mincho stack;
- display Japanese stack;
- vertical-writing utility;
- protected readable Japanese/ruby examples in the QA sandbox.

No external font is bundled in J1; later font bundling still requires provenance/licensing review.

### Material primitives

Implemented:
- procedural washi;
- sumi surface;
- lacquer surface;
- gold field;
- ink-wash layer.

J1 uses procedural CSS only and ships no third-party visual artwork.

### Pattern primitives

Implemented as original CSS redraws:
- seigaiha;
- asanoha;
- shippō;
- ichimatsu;
- kikkō;
- yagasuri;
- sayagata;
- karakusa.

Patterns are reusable through `JPattern` and remain separate from learning-content text zones.

### Signature React primitives

`apps/web/src/design/primitives.tsx` provides:
- `JSurface`;
- `JPattern`;
- `JCartouche`;
- `JSeal`;
- `JSectionMark`;
- `JDivider`;
- `JInkProgress`;
- `JBrushButton`.

These are exported through `apps/web/src/design/index.ts`.

### Motion language

Implemented CSS primitives:
- hanko land;
- ink draw;
- fusuma entry;
- noren entry.

All J1 motion primitives have a `prefers-reduced-motion: reduce` path.

### Artwork provenance

`apps/web/src/design/artAssets.ts` introduces a machine-readable external visual-asset registry and validator.

The registry is intentionally empty in J1. No external artwork has been admitted.

`tests/design/j1-assets.test.ts` verifies that weakly documented/non-redistributable assets fail the registry boundary.

### Visual QA sandbox

`apps/web/src/design/J1VisualSandbox.tsx` is available through:

`?visual-qa=j1`

The sandbox demonstrates:
- light/dark themes;
- seasonal switching;
- all initial materials;
- all eight patterns;
- Japanese typography;
- cartouches;
- seals;
- brush action;
- ink progress;
- motion primitives.

This is a QA surface, not a learner-facing navigation item.

## Regression boundary

J1 does **not** replace the current learner shell.

`main.tsx` renders the normal `App` unless `visual-qa=j1` is explicitly requested. This allows J1 primitives to be qualified before J2 shell migration.

No StudyEvent, FSRS, account, search, content, learner mastery or evidence behavior is changed.

## Automated checks

Added:
- provenance registry unit coverage;
- Playwright J1 sandbox coverage;
- theme switch coverage;
- seasonal switch coverage;
- semantic progressbar coverage;
- reduced-motion coverage;
- horizontal-overflow check.

Normal legacy P21/P22 regression remains applicable because the default product route is unchanged.

## J1 acceptance criteria

J1 passes when:
- TypeScript succeeds;
- unit tests pass;
- the normal production build succeeds within the existing bundle budget;
- the J1 Playwright sandbox tests pass;
- existing product E2E remains green;
- no third-party visual asset appears outside the provenance registry;
- the default learner route still renders the legacy shell unchanged.

## J2 handoff

J2 may now build the Living App Shell on top of J1.

The next phase should:
- introduce the new primary navigation shell;
- use Japanese/English surface identity;
- remove phase/release text from learner chrome;
- establish desktop, tablet and mobile shell layouts;
- preserve legacy surface bodies while shell migration is qualified;
- create a diagnostics/admin boundary for operational panels;
- add seasonal ambience only through J1 tokens/primitives.
