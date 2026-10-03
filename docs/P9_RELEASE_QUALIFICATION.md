# P9 Release Qualification

P9 uses an explicit release contract rather than treating a feature-complete branch as proof that the B2 system is ready for a C1 roadmap.

## Static product gates

The repository must provide at least:

| Gate | Minimum |
| --- | ---: |
| B2 connected texts | 20 |
| B2 productive tasks | 20 |
| first-class B2 lexical chunks | 120 |
| real-world functional chains | 5 |
| real-world performance prompts | 20 |

These values are checked from the canonical content package and P9 performance-bank definitions.

## Licensed native-media gates

A release deployment must provide at least:

| Gate | Minimum |
| --- | ---: |
| licensed native connected-source documents | 4 |
| licensed native recordings | 8 |
| independent speaker labels/credits | 3 |
| represented registers | 2 |
| natural-rate source condition | required |
| fast/stretch source condition | required |

Every recording remains independently subject to the source-pack license, attribution and explicit native-speaker rules.

Synthetic TTS never counts toward this gate.

## Regression gates

A release candidate must have green evidence for:

- TypeScript typecheck;
- unit/integration tests;
- content validation;
- production build;
- Playwright E2E on certified viewports;
- PWA/offline resilience;
- provider-outage resilience;
- long-history projection.

## C1-roadmap rule

`c1RoadmapGateOpen` is true only when every content, performance, native-media and regression check passes.

This gate describes **product/system readiness**. It does not classify a learner, award CEFR B2, predict an external examination result or grant a C1 status.

## Source-dependent status

The repository intentionally does not fabricate or relabel audio to satisfy the native-media threshold. If the connected deployment does not contain enough reusable native material, the qualification result must remain blocked until verified sources are added.
