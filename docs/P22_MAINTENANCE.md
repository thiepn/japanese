# P22 Production & Maintenance Runbook

## Capability freeze

P20 is the final learner-capability architecture for this release line. P21 is the technical hardening baseline. P22 is operations and maintenance.

A post-activation change belongs in P22 only when it fixes or safely maintains existing behavior.

## Stable activation sequence

1. Complete and admit the independent P11 external productive-language review.
2. Complete the P21 physical Android standalone-PWA acceptance for the exact candidate commit.
3. Admit the later external-review/device evidence on `main`; those evidence files may reference the already-tested product commit without changing its runtime code.
4. Confirm normal CI is green.
5. Run the manual **P22 Stable Release Activation** workflow with the exact commit and a new immutable `japanese-vX.Y.Z` tag.
6. Deploy the produced static artifact through the chosen production hosting pipeline.
7. Verify its published SHA-256 digest if the hosting/deployment path supports artifact verification.
8. Update `release/p22-production.json` with the real HTTPS URL, exact deployed commit, release tag, activation timestamp and `status: "active"`.
9. Run the P22 production monitor in strict mode.
10. Confirm the deployed `/release-meta.json` matches the recorded production commit exactly.

Do not mark production active before step 6 actually happened.

## Production incident handling

For an outage or release-impacting defect:

1. record the incident in `release/p22-production.json`;
2. mark severity and whether it is release-blocking;
3. use `maintenance` production status when intentionally operating in a degraded/maintenance state;
4. fix under the defect-only maintenance policy;
5. record the fix in `release/p22-maintenance.json`;
6. run the regression scope declared by that maintenance record;
7. perform a physical-device retest whenever the change touches PWA install, layout/safe-area, audio, microphone, lifecycle, storage/privacy or another hardware-dependent behavior;
8. deploy only after the relevant gates are green;
9. close or downgrade the incident only after production smoke verifies the exact deployed commit.

## Maintenance classification

Allowed classes are `defect`, `security`, `privacy`, `accessibility`, `dependency`, `content_correction`, `reliability` and `operations`.

Every maintenance entry must include:

- stable ID;
- allowed change class;
- concrete summary;
- exact commit;
- risk level;
- status;
- explicit regression scope;
- whether a physical-device retest is required;
- release timestamp when status becomes `released`;
- `capabilityExpansion: false`.

If the requested work needs a new capability, it is not a P22 maintenance patch and must be separately reconsidered rather than silently added.

## Rollback

Rollback is preferred over forward-fixing when a production defect is severe and the last known stable artifact is still safe.

A rollback must:

- use an already-qualified immutable stable artifact;
- update the production record to the actually deployed commit/tag;
- rerun strict production smoke;
- record the failed maintenance/release entry as `rolled_back`;
- keep incident history rather than deleting it.

## Monitoring scope

The scheduled monitor is intentionally small and deterministic:

- root availability;
- web app manifest;
- service worker;
- deployment identity;
- homepage response time;
- exact commit match.

It does not send learner data, inspect account content or upload private audio.

Provider health remains separately observable through the existing provider-health mechanisms.

## Release discipline

Normal CI may stay green while P22 reports HOLD because CI correctness and real-world release evidence are different questions.

Only the strict activation workflow may create a stable source release, and only a production record plus healthy exact-commit smoke may support a `PRODUCTION_STABLE` operational state.
