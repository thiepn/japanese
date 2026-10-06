# J0 Acceptance — Japanese Visual Research & Art Bible

## Status

**Complete. Visual direction is locked for J1 implementation.**

J0 reopens primary-surface design after the P22 maintenance freeze by explicit product-direction decision. It does **not** reopen learner-capability growth.

## Deliverables

J0 is accepted when the repository contains:

- a locked Japanese visual art bible;
- an explicit visual-version roadmap distinct from P0–P22 learner capability work;
- surface-by-surface art direction for Today, Learn, Study, Immerse/Reader, Library and Progress;
- light and dark material/color families;
- pattern, calligraphy, seal, ink, architecture, seasonal and contemporary-Japan systems;
- motion metaphors and reduced-motion requirements;
- art/source licensing and provenance requirements;
- accessibility and PWA-performance boundaries;
- explicit anti-rules preventing cliché collage, anime-copy identity, dark-green theming, generic card SaaS and unverified artwork reuse.

## Architecture decision

The J-series is a major presentation/product evolution on top of the frozen P20 learning architecture.

Allowed:
- visual redesign;
- navigation redesign;
- re-composition of existing learner functionality;
- moving operational/admin UI out of learner navigation;
- new decorative/art primitives;
- new responsive behavior;
- new theme/season systems;
- accessibility and interaction improvements.

Not authorized by J0:
- a new CEFR/proficiency layer;
- a second scheduler;
- a second mastery source of truth;
- changes to StudyEvent semantics;
- changing evidence boundaries;
- adding model output directly to durable mastery;
- replacing local-first learner storage;
- claiming new assessment validity.

## Acceptance tests for later phases

Every later J-phase must be judged against these questions:

1. Could this interface plausibly belong to a generic productivity app after replacing Japanese text with English? If yes, it fails art direction.
2. Does decoration reduce the speed or legibility of learning? If yes, it fails usability.
3. Is every reused external art asset provenance-verified? If no, it fails licensing.
4. Does reduced motion preserve understandable state transitions? If no, it fails accessibility.
5. Does the page have one dominant visual idea rather than a pile of motifs? If no, it fails composition.
6. Are learner truth/evidence semantics unchanged? If no, it exceeds the visual track.
7. Does dark mode read as sumi/charcoal/indigo/lacquer rather than dark green? If no, it fails theme direction.

## J1 handoff

J1 should implement the Japanese Design Engine before broad page rewrites:

- token architecture;
- type roles;
- procedural pattern primitives;
- washi/sumi material layers;
- seal/cartouche primitives;
- cloud/wave separators;
- dark/light themes;
- motion primitives;
- decorative-layer accessibility helpers;
- visual QA sandbox.

No full-page redesign should be treated as final until those primitives are reusable.
