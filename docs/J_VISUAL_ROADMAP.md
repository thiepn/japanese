# J-Series Visual Roadmap — Japanese Art Rebuild

## Scope

The J-series is a major visual/product-version track after P22. It preserves the P20 learning architecture and evidence model while replacing the presentation layer.

It is **not P22 defect-only maintenance**. The track is reopened by explicit product-direction decision and should ship as a separately qualified major visual release.

## J0 — Japanese Visual Research & Art Bible

**Complete.**

Lock art direction, source/licensing rules, surface identities, material/pattern language, motion metaphors, accessibility limits and performance constraints.

See `docs/J0_ART_BIBLE.md` and `docs/J0_ACCEPTANCE.md`.

## J1 — Japanese Design Engine

**Implementation complete.** Reusable Japanese visual primitives are now available behind the J1 visual QA sandbox, with provenance and reduced-motion boundaries in place.

Build reusable visual primitives before page rewrites:
- design tokens;
- Japanese type roles;
- washi/sumi/lacquer/gold materials;
- SVG/CSS pattern system;
- seal/cartouche/cloud/wave primitives;
- seasonal token layer;
- light/dark themes;
- motion primitives;
- accessibility/decorative-layer helpers;
- visual QA sandbox.

## J2 — Living App Shell

**Implementation complete.** The learner-facing chrome now runs on the J1 design engine with Japanese identity, responsive five-surface navigation, sumi/washi theming, seasonal ambience and an explicit diagnostics boundary.

Replace the current shell and navigation:
- remove internal phase/release language from learner UI;
- desktop art rail/sidebar;
- tablet navigation rail;
- one-handed mobile bottom navigation;
- Japanese surface names;
- account/profile treatment;
- seasonal ambient layer;
- diagnostics/admin route separation.

## J3 — Today / 今日

**Implementation complete.** Today is now the first fully rebuilt learner surface: a Japanese daily-study ritual with shoji-derived composition, oversized 今日 display, one dominant Continue action and a four-intention ink route replacing the old six-stat dashboard.

Create the first production-quality surface:
- Japanese morning-study ritual;
- one dominant Continue action;
- ink-route queue;
- shoji-light composition;
- compact evidence/progress;
- seal-based completion moment.

J3 becomes the quality bar for subsequent surfaces.

## J4 — Learn / 学 Emakimono Journey

Replace the long stacked page with a navigable A1→C1 illustrated learning world:
- level regions;
- chapter landmarks;
- current route;
- real mastery projection;
- bridges/gates/transitions;
- progressive world enrichment;
- desktop horizontal/panoramic treatment;
- mobile guided path.

## J5 — Study Focus Chamber

Rebuild StudyPlayer around task-specific learning:
- kana/kanji writing-sheet language;
- vocabulary/grammar/listening/production variants;
- large Japanese typography;
- audio-first control;
- ink/seal feedback;
- keyboard and touch excellence;
- minimal decorative interference.

## J6 — Immerse / 浸 + Reader

Contemporary Japanese editorial/media identity:
- poster/book/magazine compositions;
- richer media taxonomy;
- Mincho-forward reader;
- layered grammar/translation support;
- native-media visual distinction;
- optional experimental vertical-reading mode only after horizontal reader quality is locked.

## J7 — Library / 蔵

Archive/dictionary experience:
- search-first layout;
- high-density results;
- semantic filters;
- refined Japanese typography;
- book/archive decorative metaphors without fake 3D shelving.

## J8 — Progress / 道

Longitudinal journey:
- mastery landscape;
- skill crest/emblem plus accessible numerical detail;
- milestone seals;
- evolving personal artwork;
- evidence drill-down;
- removal of operational release/admin panels from normal learner progress.

## J9 — Japanese Motion & Sensory Layer

Polish:
- fusuma;
- noren;
- washi turn;
- hanko;
- ink draw/bloom;
- byōbu unfold;
- emaki pan;
- restrained optional haptics/interface sound where platform allows.

No required ambience.

## J10 — Seasonal Japan

Dynamic seasonal atmosphere:
- spring;
- tsuyu;
- summer;
- autumn;
- winter;
- short New Year treatment.

Season changes ambience only, not information architecture or learner meaning.

## J11 — Developer / Operations Separation

Move:
- release operations;
- provider health;
- release identity;
- human-review administration;
- production diagnostics

to a developer/diagnostic route or tooling boundary.

## J12 — Mobile Japanese Experience

Purpose-built mobile UX:
- thumb-first navigation;
- full-screen study;
- compact Japanese typography;
- gesture-safe motion;
- safe-area handling;
- low-end Android performance qualification.

## J13 — Tablet & Desktop Exhibition Layer

Use larger canvases intentionally:
- panoramic learning path;
- asymmetric editorial layouts;
- persistent contextual rails;
- large decorative art fields;
- multi-panel progress compositions.

Do not stretch the mobile layout.

## J14 — Performance, Accessibility & Real-Device Qualification

Define and enforce:
- bundle/art budgets;
- route lazy-loading;
- image/SVG limits;
- reduced-motion coverage;
- contrast and zoom/reflow;
- screen-reader order;
- physical Android/PWA acceptance;
- desktop/tablet checks;
- offline behavior.

## J15 — Full Migration & Visual Purge

Final cutover:
- remove old learner shell;
- remove legacy card language;
- split/remove accumulated monolithic CSS;
- delete dead styles/components;
- preserve underlying learning/evidence behavior;
- run full E2E/regression suite;
- qualify and promote the new visual major release.

## Non-goal across J0–J15

The J-series does not introduce a new proficiency level or mastery authority. Any future learner-capability change requires its own roadmap decision outside this visual program.
