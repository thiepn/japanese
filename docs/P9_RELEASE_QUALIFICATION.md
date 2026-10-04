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


## Automated certification evidence

The repository now carries an auditable release manifest and a deterministic qualification command:

- `release/p9-native-inventory.json` is the only repository-owned native-media inventory used by the release certifier;
- `pnpm certify:p9` generates `artifacts/p9-release-qualification.json` and `artifacts/p9-release-qualification.md` without failing when the gate is still blocked;
- `pnpm certify:p9:strict` generates the same evidence and exits non-zero unless every P9 release check passes;
- normal CI writes regression evidence only after typecheck, unit/integration tests, content validation, production build and certified E2E have all succeeded, then uploads the qualification report as a workflow artifact;
- the manual **P9 Release Qualification** workflow runs the full suite and then invokes the strict gate.

The certification CLI derives B2 text/task/chunk counts directly from `content/seed/jp-core.json` and derives the real-world chain/prompt inventory from the checked-in P9 performance bank. Native-media counts are derived from individual manifest entries rather than editable summary totals.

Every listed native recording must have a stable id, source URL, recording URL, reusable license, credit, explicit `nativeSpeaker:true`, and valid register/rate metadata when those fields are claimed. Attribution-required licenses require an attribution URL.

### Current checked-in state

P11.2 now supplies a provenance-audited native connected-speech registry at `release/p11-native-sources.json` and a derived `release/p9-native-inventory.json`.

The checked-in media evidence currently provides:

- 8 connected-source documents;
- 8 licensed native recordings;
- 5 independent speaker labels;
- 2 represented registers;
- natural-rate source conditions;
- relative fast/stretch source conditions.

`pnpm native:p11:audit` validates source/media identity, reusable licensing, attribution, explicit native-speaker evidence, connected-speech duration, content provenance, register/rate review and exact inventory reproducibility. Inventory drift from the registry is a failure.

The `fast` label is a relative pedagogical stretch-source condition, not an acoustic words-per-minute measurement. Synthetic TTS, inferred native status, restricted licensing and short pronunciation clips still do not count.

The native-media portion of P9 is therefore satisfied by the checked-in repository evidence. Full strict P9 qualification still requires the complete green regression suite.
