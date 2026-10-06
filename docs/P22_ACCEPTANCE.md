# P22 Acceptance — Stable Release Activation, Production Monitoring & Maintenance

## Status

**Implementation complete. Stable production activation remains evidence-gated.**

P22 adds the operational machinery needed to release and maintain the frozen P20 capability set. It does not add a new learner capability layer.

The repository can now:

- validate the final P21 gate before activation;
- create immutable release metadata for an exact commit;
- package a static stable artifact only after strict P11 + P21 qualification;
- refuse stable-tag overwrite;
- expose the deployed build identity inside Progress;
- monitor production availability and exact deployed commit;
- keep an explicit production activation record;
- enforce a defect-only maintenance ledger;
- report HOLD states honestly when production, device or external evidence is absent.

The checked-in production record remains `inactive` until a real deployment occurs.

## Stable release activation

The manual **P22 Stable Release Activation** workflow requires:

- an exact 40-character release commit;
- an immutable semantic release tag such as `japanese-v1.0.0`;
- complete typecheck, tests, content validation, provenance audit, production build and Playwright suite;
- strict P11 external productive-language qualification;
- strict P21 release qualification for the same commit;
- physical-device evidence already bound to that commit.

Only after those checks pass does the workflow:

1. write `/release-meta.json` with the exact stable commit;
2. rebuild the static web artifact;
3. package the built site;
4. refuse to overwrite an existing stable tag;
5. create an immutable GitHub release containing the deployable artifact and qualification evidence.

A GitHub release is **source/package activation evidence**, not proof of successful production deployment.

## Production activation record

`release/p22-production.json` is the authoritative checked-in production declaration.

States:

- `inactive` — no production release is claimed;
- `candidate` — deployment preparation may be underway but stable production is not claimed;
- `active` — a concrete HTTPS deployment, release tag, exact commit and activation timestamp are recorded;
- `maintenance` — production is intentionally operating under a maintenance condition.

The current manifest is deliberately `inactive`.

An inactive manifest must not contain a production URL, release commit, release tag or activation timestamp.

## Deploy-time release identity

`apps/web/public/release-meta.json` exists in development with no immutable commit.

During stable activation, `scripts/p22-write-release-meta.mjs` overwrites that file in the build workspace with:

- schema/version;
- P22 phase identity;
- `stable` channel;
- exact 40-character commit;
- build timestamp.

Progress includes a P22 deployment-identity panel that reads this file at runtime. The panel never treats a missing or malformed identity as a stable release.

## Production monitoring

`scripts/p22-production-monitor.mjs` validates the production manifest and, when active, checks:

- the application root;
- `/manifest.webmanifest`;
- `/sw.js`;
- `/release-meta.json`;
- homepage latency against the configured threshold;
- exact release-metadata commit equality.

The scheduled **P22 Production Monitor** workflow runs every six hours.

When production is inactive it records a skipped monitor result without inventing a deployment.

When production is active or in maintenance state, monitoring runs in strict mode and fails if required paths or exact release identity are not healthy.

Synthetic monitoring verifies availability and release identity only. It does not replace physical-device acceptance.

## Release-state machine

`scripts/p22-release-status.mjs` keeps source, production and monitoring state separate.

Principal decisions:

- `HOLD_P21_RELEASE_GATE`;
- `READY_TO_ACTIVATE`;
- `PRODUCTION_MAINTENANCE`;
- `HOLD_PRODUCTION_INCIDENT`;
- `HOLD_PRODUCTION_MONITOR`;
- `HOLD_RELEASE_IDENTITY_MISMATCH`;
- `PRODUCTION_STABLE`.

Normal CI emits the current P22 release status as an artifact.

## Defect-only maintenance

`release/p22-maintenance.json` fixes the post-release policy at:

- `policy: "defect-only"`;
- `capabilityFreeze: "P20"`.

Allowed maintenance classes:

- defect;
- security;
- privacy;
- accessibility;
- dependency;
- content correction;
- reliability;
- operations.

Each recorded maintenance change must carry an immutable commit, risk level, explicit regression scope, device-retest requirement and lifecycle status.

New proficiency layers, new primary surfaces, new mastery authorities and other capability expansion are not P22 maintenance.

## Evidence boundary

P22 does **not** claim that:

- normal green CI means stable production is activated;
- a release artifact proves deployment success;
- synthetic monitoring proves real handset behavior;
- a runtime `stable` metadata label waives P11/P21 evidence;
- production release qualification is learner CEFR certification;
- P20 internal advanced-pathway qualification is an accredited C2 result;
- maintenance policy can be used to smuggle in new language capabilities.

## Acceptance checks

- release-operation unit tests cover deploy metadata, inactive production truthfulness, exact release identity, healthy/unhealthy production smoke, release-state transitions and defect-only maintenance constraints;
- Progress exposes P22 deployment identity without treating the development placeholder as stable;
- CI validates the maintenance ledger and production manifest, then emits P22 production/release status artifacts;
- manual stable activation fails closed through strict P11 and P21 gates;
- scheduled production monitoring remains dormant rather than fabricated while production is inactive.

Until real device and P11 evidence are admitted, P22 is operationally implemented but the stable activation state must remain HOLD.
