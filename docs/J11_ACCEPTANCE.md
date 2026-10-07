# J11 Acceptance — Developer / Operations Separation

## Status

**Implementation complete. Final CI/browser qualification is required for the latest J11 commit.**

J11 finishes the product boundary between the learner experience and technical operations. Release qualification, runtime/provider status, deployment identity, source-curation administration and external-review administration now live in an explicit diagnostics workspace rather than appearing inside normal learner surfaces.

## Diagnostics workspace

The technical workspace is available through:

`?diagnostics=1`

It is intentionally separate from Today, Learn, Immerse, Library and Progress.

When diagnostics is active:
- the normal learner primary navigation is removed;
- the shell switches to a technical layout;
- an explicit “Back to Japanese” action returns to the learner product;
- the learner account/theme shell remains available;
- technical controls cannot be mistaken for Progress or course content.

## Technical panels

J11 groups operations into five panels.

### Overview / 総

Explains the technical boundary and provides direct maintainer routes.

### Human review / 評

Contains the existing human-review administration:
- productive artifact review;
- advisory rubric scoring;
- external-review packet generation;
- reviewer workspace export;
- explicit no-mastery-rewrite boundary.

### Release gates / 門

Contains:
- native-source curation;
- static product/release gates;
- media provenance readiness;
- external-review readiness;
- physical-device qualification boundary;
- stable activation/maintenance evidence.

Native curation is no longer exposed inside learner Immerse.

### Deployment / 版

Contains the existing immutable deployment/release identity view.

### Runtime / 脈

Contains the existing provider/runtime health view.

## Direct maintainer routes

J11 supports deterministic direct technical URLs:

`?diagnostics=1&panel=review`
`?diagnostics=1&panel=release`
`?diagnostics=1&panel=deployment`
`?diagnostics=1&panel=runtime`

Unknown or absent panel values open the diagnostics overview.

The panel query changes presentation only.

## Learner navigation boundary

Normal learner surfaces continue to expose exactly five primary destinations:

- Today;
- Learn;
- Immerse;
- Library;
- Progress.

Diagnostics is not added as a sixth learner destination.

Opening a learner destination from the application after diagnostics removes the diagnostics query state.

The dedicated Back action also removes:
- `diagnostics`;
- `panel`.

## Native curation moved out of Immerse

The source-curation/release-verification panel previously appeared in Immerse under Advanced Studios.

J11 moves it to:

Diagnostics → Release gates.

Learner Immerse still contains genuine learner/research activities:
- native listening;
- shadowing;
- authentic/private input;
- C1 source work;
- C1 research work;
- precision;
- interaction;
- prosody/evaluation;
- autonomy.

It no longer contains the repository-release curation control.

## Learner-facing phase vocabulary removed

Internal historical phase identifiers remain valid in code, tests, stored metadata and technical diagnostics where needed.

They are no longer used as learner-facing product labels across the advanced learning surfaces.

Examples now shown to learners include:

- C1 Native Source Depth;
- C1 Long-form Autonomy;
- C1 Real-source Environment;
- C1 Research Quality;
- C1→C2 Precision Bridge;
- Advanced Native Interaction;
- Prosody · Overlap · External Review;
- B2 Longitudinal Portfolio;
- C1→C2 Longitudinal Portfolio;
- Longitudinal C2 Readiness;
- Advanced Live Interaction;
- Real-world Performance.

This is a wording/presentation migration only.

## Progress evidence boundary

The detailed B2/C1 evidence portfolios remain available to the learner in Progress because they are genuine learner evidence.

However:
- release controls are absent;
- deployment identity is absent;
- provider health is absent;
- source promotion is absent;
- reviewer administration is absent.

The portfolios themselves now use learner-facing evidence names instead of internal implementation-phase names.

## Advanced Immerse boundary

Advanced source/research work remains in Immerse where it supports learning.

J11 distinguishes that from operations by asking whether the control is for the learner’s Japanese work or for shipping/operating the application.

Learner/research:
- reading native sources;
- registering sources for a learner project;
- writing/synthesis;
- source evaluation;
- specialist tracks;
- learner artifacts;
- partner interaction logs;
- audio evidence;
- optional external review evidence.

Operations:
- source promotion readiness;
- release thresholds;
- deployment identity;
- runtime/provider health;
- release activation/maintenance;
- reviewer administration.

Only the second group belongs in diagnostics.

## Evidence semantics preserved

J11 does not change:
- StudyEvent storage;
- FSRS;
- mastery;
- milestone scoring;
- C1/B2 portfolio calculations;
- C2-readiness calculations;
- external-review evidence format;
- source provenance data;
- release thresholds;
- deployment identity schema;
- provider-health logic;
- source-curation logic.

It changes where these controls are presented and how learner-facing labels are written.

## Accessibility

Diagnostics uses:
- a dedicated `Technical diagnostics` navigation landmark;
- explicit current-panel state;
- semantic headings;
- real buttons;
- a visible operations-boundary note;
- touch-safe tabs;
- explicit Back action.

The learner `Primary` navigation landmark is absent while diagnostics is open, preventing two competing primary navigation systems.

## Responsive behavior

Desktop:
- full-width technical workspace;
- five-panel diagnostics navigation;
- multi-column overview.

Tablet:
- diagnostics navigation wraps to three columns.

Mobile:
- diagnostics tabs become two/one-column depending on width;
- Back action remains explicit;
- no learner rail is shown;
- no horizontal-document overflow is introduced.

## Regression migration

Existing P9–P22 regression tests remain named after their historical implementation phases where useful for repository traceability.

Assertions have been migrated to:
- learner-facing names on learner surfaces;
- technical phase/release terminology only inside diagnostics.

This keeps implementation history available without exposing it as product UI.

## Dedicated J11 qualification

`tests/e2e/j11-diagnostics.spec.ts` covers:
- diagnostics identity;
- learner-nav removal;
- technical-nav presence;
- direct panel URLs;
- Back-to-Japanese query cleanup;
- source-curation removal from Immerse;
- real-source learner workspace preservation;
- phase-label removal from B2/C1 Progress portfolios;
- mobile touch targets;
- horizontal-overflow regression.

Existing release-operation tests now enter the appropriate J11 technical panel before checking release evidence.

## J12 handoff

J12 should treat mobile as a first-class Japanese application rather than a compressed desktop layout.

It should prioritize:
- thumb-first primary navigation;
- safe-area handling;
- compact but readable Japanese typography;
- dedicated mobile Today/Learn/Immerse/Library/Progress compositions;
- full-screen Study behavior;
- gesture-safe drawers/details;
- Android standalone-PWA behavior;
- low-end-device performance;
- no loss of the J-series Japanese visual identity.
