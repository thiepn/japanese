# J10 Acceptance — Seasonal Japan System

## Status

**Implementation complete. Final CI/browser qualification is required for the latest J10 commit.**

J10 turns the existing J-series seasonal tokens into a controlled ambient-art system across the learner product. Layout, study priority, mastery, evidence and navigation remain stable; only atmosphere, material tint and decorative motifs change with the season.

## Seasonal worlds

The system supports six deterministic visual worlds:

- Spring / 春;
- Rainy season / 梅雨;
- Summer / 夏;
- Autumn / 秋;
- Winter / 冬;
- New Year / 正月.

The calendar mapping is intentionally simple and deterministic:

- January 1–7 → New Year;
- December, January 8–31, February → Winter;
- March–May → Spring;
- June → Rainy season;
- July–August → Summer;
- September–November → Autumn.

This is a product-art calendar, not a weather service or location-dependent forecast.

## Visual QA override

A query-string preview is available for deterministic testing and art review:

`?season=spring`
`?season=tsuyu`
`?season=summer`
`?season=autumn`
`?season=winter`
`?season=new-year`

Unknown values fall back to the calendar-derived season.

The override changes visual season only. It does not change learner data, scheduling, dates or study behavior.

## Shared seasonal vocabulary

Each season defines additional non-semantic art tokens:

- season ink;
- secondary accent;
- ambient wash;
- ambient glow;
- paper tint;
- decorative line tone.

These extend, rather than replace, the existing J1/J2 theme tokens.

Dark mode receives separate restrained seasonal mixes so dark mode remains sumi/charcoal rather than becoming colored wallpaper.

## Spring / 春

Art direction:
- pale blossom-toned wash;
- fresh green secondary note;
- sparse petal geometry;
- thin branch-like lines.

Guardrail:
- no sakura wallpaper;
- petals remain a small ambient detail rather than the product identity.

## Rainy season / 梅雨

Art direction:
- cool indigo/blue-grey wash;
- fine rain lines;
- water-ring geometry;
- quieter paper tint.

The system does not animate falling rain by default.

## Summer / 夏

Art direction:
- deeper indigo evening note;
- restrained vermilion/amber warmth;
- abstract lantern-like forms;
- subtle horizontal evening lines.

No festival background, fireworks loop or required ambience is introduced.

## Autumn / 秋

Art direction:
- vermilion/rust;
- restrained gold;
- abstract momiji-inspired geometry;
- warm paper shift.

The existing Progress landscape receives a small seasonal foliage shift without changing its mastery-stage geometry.

## Winter / 冬

Art direction:
- blue-grey air;
- sparse snow points;
- plum-toned branch line;
- cooler paper tint.

There is no animated snowfall.

## New Year / 正月

Art direction:
- vermilion;
- paper white;
- restrained gold;
- mizuhiki-inspired circular/line geometry;
- formal quiet.

New Year does not change rewards, streaks, mastery or curriculum.

## Shared seasonal ambient component

`J10SeasonalWorld` provides the procedural decorative layer.

It uses CSS geometry only:
- no image download;
- no museum asset;
- no remote texture;
- no external seasonal illustration;
- no additional provenance burden.

The component is always `aria-hidden` and `pointer-events:none`.

It cannot carry essential learner meaning.

## Surface integration

### App shell

The J2 shell now uses the J10 season resolver and J10 ambient artwork.

The existing seasonal label remains visible in the top bar.

The procedural J1 pattern also continues to change by season:
- spring → shippō;
- rainy season/summer → seigaiha;
- autumn → asanoha;
- winter → kikkō;
- New Year → ichimatsu.

### Today / Learn / Immerse / Library / Progress

Primary surface structure does not move.

Seasonal state may change:
- very light material glow;
- border/highlight tone;
- ambient background art.

The layout, information hierarchy and actions stay fixed.

### Reader

The Reader remains deliberately quiet.

Seasonality is restricted to:
- an extremely small paper/material tint;
- support-rail accent.

Japanese reading typography, ruby, spacing and support hierarchy are unchanged.

No seasonal motif is placed inside the reading column.

### Study Focus Chamber

Study receives the calendar season even though the normal app shell is removed during focused study.

The J10 ambient component is mounted in compact mode at much lower opacity.

The task sheet and prompt remain visually dominant.

Seasonal art cannot change:
- answer order;
- prompt content;
- grading;
- StudyEvent creation;
- timing;
- audio controls.

## Theme continuity

The shell and Study Player now both expose:

`data-j-season="<season>"`

The document element also receives the same active season.

This keeps:
- theme;
- season;
- Study isolation

visually consistent across shell → Study → shell transitions.

## Reduced motion

J10 ambient art is static by default.

Under `prefers-reduced-motion: reduce`:
- all J10 descendants explicitly suppress animation/transition;
- no seasonal motion is introduced by this phase.

J9 remains responsible for the optional one-shot motion language.

## Performance boundary

J10 adds:
- one small procedural ambient DOM layer;
- CSS gradients;
- borders;
- clip-path geometry;
- existing token changes.

It does not add:
- network requests;
- raster artwork;
- SVG asset downloads;
- canvas;
- WebGL;
- video;
- particles;
- animation loops;
- location/weather APIs.

## Learning architecture preserved

J10 does not change:
- Today queue;
- course graph;
- StudyStep/StudyEvent contracts;
- FSRS;
- mastery projections;
- milestone state;
- immersion evidence;
- Library search;
- Progress calculations;
- account state;
- diagnostics.

Season is purely presentation.

## Automated qualification

Added:

`tests/design/j10-season.test.ts`
`tests/e2e/j10-seasonal.spec.ts`

Coverage includes:
- calendar mapping;
- all six seasons;
- invalid-preview fallback;
- Japanese season labels;
- seasonal pattern mapping;
- query-string visual QA override;
- shell season attributes;
- distinct seasonal ink tokens;
- normal navigation under every preview season;
- season continuity inside isolated Study;
- Reader readability with active season;
- reduced-motion static behavior;
- mobile overflow regression across all six worlds.

## J11 handoff

J11 should finish the developer/operations separation already started in J2.

It should:
- make diagnostics an explicitly separate technical workspace;
- remove remaining phase/release vocabulary from learner surfaces;
- ensure learner Progress, Learn and Immerse contain no operations controls by default;
- preserve human-review/evidence tools where they are genuinely learner/research workflow, but distinguish them from release/runtime administration;
- retain direct diagnostic URLs for maintainers;
- avoid changing learner evidence or release semantics.
