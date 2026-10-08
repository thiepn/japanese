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

**Implementation complete.** Learn is now a navigable A1→C1 emakimono-style world with dynamic course regions, canonical unit landmarks, real mastery/evidence projection, milestone gates, specialist training grounds and a dedicated mobile vertical route.

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

**Implementation complete.** Study now runs as an isolated task-adaptive focus chamber with dedicated kana, kanji, vocabulary, grammar, sentence, listening, writing, speaking, assessment and review treatments while preserving the existing StudyStep/StudyEvent learning contracts.

Rebuild StudyPlayer around task-specific learning:
- kana/kanji writing-sheet language;
- vocabulary/grammar/listening/production variants;
- large Japanese typography;
- audio-first control;
- ink/seal feedback;
- keyboard and touch excellence;
- minimal decorative interference.

## J6 — Immerse / 浸 + Reader

**Implementation complete.** Immerse is now a contemporary Japanese editorial reading room with genre-led covers, adaptive feature placement, thematic series, missions and progressive-disclosure advanced studios; the Reader is rebuilt as a quiet Mincho-first layered reading surface.

Contemporary Japanese editorial/media identity:
- poster/book/magazine compositions;
- richer media taxonomy;
- Mincho-forward reader;
- layered grammar/translation support;
- native-media visual distinction;
- optional experimental vertical-reading mode only after horizontal reader quality is locked.

## J7 — Library / 蔵

**Implementation complete.** Library is now a search-first Japanese knowledge archive with semantic entity filters, a dense catalog, keyboard/touch navigation and differentiated canonical reference sheets for words, kanji, grammar, sentences, chunks, texts and productive tasks.

Archive/dictionary experience:
- search-first layout;
- high-density results;
- semantic filters;
- refined Japanese typography;
- book/archive decorative metaphors without fake 3D shelving.

## J8 — Progress / 道

**Implementation complete.** Progress is now a longitudinal Japanese learning path with an evolving procedural landscape, six mastery crests, milestone seals, an explicit evidence ledger and learner-controlled B2/C1 portfolio vaults.

Longitudinal journey:
- mastery landscape;
- skill crest/emblem plus accessible numerical detail;
- milestone seals;
- evolving personal artwork;
- evidence drill-down;
- removal of operational release/admin panels from normal learner progress.

## J9 — Japanese Motion & Sensory Layer

**Implementation complete.** The J-series now uses a restrained one-shot motion language for fusuma routing, noren thresholds, emakimono reveal, washi page turns, hanko results, ink progress and byōbu drill-down, plus explicit opt-in local haptics/interface tones.

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

**Implementation complete.** The J-series now has six controlled calendar-driven Japanese ambient worlds—spring, rainy season, summer, autumn, winter and New Year—using procedural CSS art, stable layouts, dark-mode-specific tints, Study/Reader restraint and deterministic QA overrides.

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

**Implementation complete.** Mobile now uses a lazy-loaded, safe-area-aware Japanese composition layer with thumb-first navigation, full-screen Study, sticky Library search, phone-specific surface layouts, Android/PWA chrome integration and low-cost rendering rules for constrained devices.

Purpose-built mobile UX:
- thumb-first navigation;
- full-screen study;
- compact Japanese typography;
- gesture-safe motion;
- safe-area handling;
- low-end Android performance qualification.

## J13 — Tablet & Desktop Exhibition Layer

**Implementation complete.** Tablet and desktop now use a lazy-loaded exhibition layer with panoramic Learn, asymmetric editorial compositions, persistent contextual rails, large Japanese marginal art, a two-pane Reader/Library desk, multi-panel Progress and bounded large-screen Study.

Use larger canvases intentionally:
- panoramic learning path;
- asymmetric editorial layouts;
- persistent contextual rails;
- large decorative art fields;
- multi-panel progress compositions.

Do not stretch the mobile layout.

## J14 — Performance, Accessibility & Real-Device Qualification

**Implementation and automated hardening complete. Physical Android/PWA acceptance remains intentionally pending.** J14 now enforces lazy/art budgets, dark-mode compatibility, 320px reflow, keyboard and screen-reader structure, reduced-motion coverage, responsive/offline regression evidence and a machine-readable qualification report.

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

### J15A — Stabilization
**Verified on J15A candidate.** Reconcile seasonal shadows and mobile navigation with the new flat editorial structure; retain full Playwright and candidate-deploy requirements.

### J15B — Japanese Visual Grammar
**Implemented as a testable visual contract; CI/release validation required.** Freeze material hierarchy, typography, rectangular paper geometry, restrained motifs and motion, accessibility and five destination-specific compositions. See `docs/J15B_VISUAL_GRAMMAR.md`. No new learner capability and no generic dashboard template.

### J15C — Reading and Interface Legibility
**Implemented on a stacked qualification branch; pending CI.** Increase tiny Library/Progress content typography and responsive navigation labels, with computed-style browser assertions and a source audit. Preserve each destination's distinct identity and keep the P22 CSS budget unchanged. See `docs/J15C_ACCEPTANCE.md`.

### J15D — Native CSS Ownership & Legacy Shell Purge
**D1/D2 CI green; D3 route-specific technical CSS extraction implemented, CI pending.** Remove confirmed dead J0 shell/Study CSS, protect currently shared advanced tools and audit native CSS ownership without raising the P22 CSS budget. See `docs/J15D_ACCEPTANCE.md`. Physical-device acceptance remains separate.

## Non-goal across J0–J15

The J-series does not introduce a new proficiency level or mastery authority. Any future learner-capability change requires its own roadmap decision outside this visual program.
