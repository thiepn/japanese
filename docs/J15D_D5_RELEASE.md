# J15D-D5 — Final Native Migration & Release Assessment

D5 completes the source-side visual migration work and adds a **fail-closed release decision**. It does not change the learning engine, authentication, data, proficiency validation or the visible Japanese design.

## Exact evidence

The reference build is the immutable J15C SHA `d962c352aab9cd7ad2d9183fb40a3c5671ab7b4a`. The candidate is the **exact** PR SHA, not mutable main. Automated D5 CI proof is written only after successful typechecking, unit tests, content and native-source validation, P22 bundle build, J15 semantic/legibility audits, complete Playwright regression and J14 accessibility/offline qualification. Its JSON includes the commit SHA and CI run ID.

The release assessor verifies:

| Contract | Evidence |
| --- | --- |
| No retired shell selectors; protected shared CSS | D1 native CSS purge, D2 ownership inventory |
| J11 operations isolated behind lazy diagnostics | D3 built-CSS boundary |
| ≤500 KiB initial JS gzip and ≤40 KiB CSS gzip | P22 production bundle audit |
| J11/J12/J13 stay lazy | J14 experience audit |
| Dark/light, semantic tokens, editorial grammar, legibility | J15/J15B/J15C audits |
| 320px reflow, touch, keyboard, landmarks, offline PWA | J14/D4 and full Playwright regression |
| All **42** viewport/theme/surface visual screenshots | D4 exact-reference comparison JSON |
| Human comparison of all 42 diff pairs | `release/j15d-d5-visual-review.json` |
| Physical Android installed PWA and TalkBack/audio/rotation | `release/j15d-d4-device-acceptance.json` |
| Human product, accessibility and release-ops approval | `release/j15d-d5-release-signoff.json` |

The D4 visual comparison, D5 visual review, Android device record and signoffs must all reference **the same candidate SHA**. Screenshots must be independently reviewed even when pixel differences are below threshold. Any unresolved blocking defect invalidates approval. Device acceptance must use an installed PWA with verified deployed candidate identity; Chromium emulation cannot substitute.

## Commands

```sh
pnpm build
pnpm test:e2e
pnpm qualify:j15d:d5 --candidate <40-character-sha>
pnpm qualify:j15d:d5 --candidate <sha> --visual artifacts/j15d-d4-visual-comparison.json
pnpm qualify:j15d:d5:strict --candidate <sha> --visual artifacts/j15d-d4-visual-comparison.json
```

The assessor always writes `artifacts/j15d-d5-release-qualification.json` and `.md` with explicit blockers. The CI variant `pnpm qualify:j15d:d5:ci` fails on missing automated evidence but does not force a fake human pass. The strict version exits nonzero unless every gate is evidenced.

## Release decision boundary

Automated green tests can qualify an **implementation candidate**, not a stable release. Any merge to `main`, deployment to Pages, production verification, human acceptance and stable promotion are distinct operations. If `main` triggers candidate deployment, do not claim that candidate was tested on real Android hardware until the matching SHA was used on a physical device. No external Japanese proficiency validation is implied.

## Immutable candidate and independently committed approval evidence

**Important:** Manually editing a pending approval manifest on the same branch as the app changes that branch's commit. It cannot simultaneously certify the exact **old** candidate. To avoid invalidating the device-tested build, place approved records in a separate, restricted evidence branch, such as `release-evidence/j15d`, without changing the application candidate SHA.

The final on-demand workflow `.github/workflows/j15d-d5-final.yml` accepts:

1. `candidate_sha`: a real deployed and tested 40-character candidate SHA.
2. `ci_run_id`: a **successful** full application CI run for that exact SHA.
3. `visual_run_id`: a **successful** visual comparison run for that exact SHA; all 42 images must also have been reviewed.
4. `evidence_ref`: separate Git evidence branch containing the three completed `release/j15d-*.json` manifests (D4 physical PWA, D5 visual-review, D5 release-signoff).

It verifies both upstream Actions run identities and conclusions using GitHub's API, checks out the exact source commit, builds it, obtains both uploaded test artifacts, then copies only approved **data JSON** from the evidence branch. It evaluates strict qualification without creating a new application commit. A missing, mismatched or pending record fails; no workflow auto-approves.

The workflow appears in Actions when committed to the default branch. Before using it, separately deploy a traceable candidate preview and physically verify that the displayed build hash matches the candidate. The evidence branch must contain genuine reviewer reports; the system cannot authenticate the truth of a human observation by itself.

Do **not** use the successful final qualification result as an automatic production deploy. The existing P22 Pages candidate verification and controlled stable promotion are separate operations requiring explicit approval.
