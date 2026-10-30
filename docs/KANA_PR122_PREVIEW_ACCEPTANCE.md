# Kana PR #122 — isolated preview and physical Account acceptance (HOLD)

This document is an **operator handoff**, not evidence that a preview was deployed,
real hardware was tested, or OAuth/SSO is functional. PR #122 remains draft,
unmerged and NO_GO until all independent release gates are satisfied.

## Current technical source of truth

- Qualify **the newest exact PR HEAD**, not a copied SHA or the mutable main branch.
- The `Kana PR 122 qualification` GitHub Actions workflow (not Cloudflare) checks out
  `github.event.pull_request.head.sha`, writes `release-meta.json` using
  `channel: candidate` and that exact SHA, builds with
  `VITE_PUBLIC_BASE=/japanese/`, then checks Kana/Account regressions.
- After successful checks, the workflow uploads `kana-pr122-static-candidate`
  (14-day retention), including `index.html`, `404.html`,
  `auth/callback/index.html`, `kana/index.html`, `release-meta.json`,
  `sw.js`, icons and `manifest.webmanifest`. **This GitHub Actions job
  does not deploy**. Independent Cloudflare GitHub integration may still
  automatically create a preview deployment on any branch push.
- The uploaded GitHub Actions artifact is constructed for the **/japanese/**
  URL prefix. Hosting the unchanged artifact at `/` or a different prefix
  is not a qualified preview.
- **Live Cloudflare configuration (read 30 October 2026):** the `japanese`
  Pages project allows preview branches (`preview_branch_includes: ['*']`).
  Pushes to this draft PR have triggered Cloudflare preview deployment records.
  The Cloudflare build uses Vite's default **root `/` base**, which is
  **different from** the `/japanese/` GitHub Actions artifact. Neither build
  verifies the other's routes or installation behavior. A queued preview
  record or a URL is not proof that a deploy succeeded or serves the right SHA.
  Existing `docs/DOMAIN_DEPLOYMENT.md` says previews are off, but that
  statement is stale relative to the live configuration.
- The current-main integration workflow independently tests a temporary,
  unpushed merge. That merged tree has a **different commit identity** from
  the PR-only artifact: its passing tests do not certify a deployed merged build.
- Reconcile main changes and requalify if the final candidate is instead a
  merge commit. Never assert that an artifact from the PR-only SHA contains main.

## Exact-SHA HTTPS preview: approval boundary

1. Prefer an existing, verified Cloudflare branch preview at its own
   **separate-origin** HTTPS URL **only if** its exact SHA, deployment success,
   root-base assets and route checks are verified. For the GitHub Actions
   artifact instead, an authorized operator may host it under `/japanese/`
   at a separate HTTPS origin. **Do not confuse these two builds.** Do not
   use the public `thiepn.dev/japanese/` route, replace production Pages,
   trigger `P22 Candidate Pages Deploy`, or switch Cloudflare main DNS.
   This protocol does not authorize changing Pages preview configuration.
2. From the verified preview URL, read `release-meta.json` **at that
   deployment's actual root** with cache disabled and record its exact
   `commit` and `channel: candidate`. Compare with the unchanged GitHub PR
   head; for a separately hosted artifact also verify the uploaded ZIP
   digest. If any value differs, stop. Check the correct-base asset paths,
   callback route, manifest scope, service worker MIME type and icons without
   submitting credentials. Cloudflare's root preview also needs an actual
   check of legacy `/kana/` navigation; the shared source currently writes
   a `/japanese/` redirect for that legacy route.
3. The web artifact carries an unchanged Japanese OAuth implementation whose
   Account callback points to `https://thiepn.dev/japanese/auth/callback/`.
   **Do not press Sign in or attempt two-owner OAuth on an unregistered preview
   origin.** A 200 response from Account entry does not prove the callback
   matches the preview or that any login completed.
4. A real two-owner acceptance session requires separate authorization from
   the Account owner for an **exact preview-origin callback** and matching
   first-party OAuth registration/configuration. That is a cross-repository,
   separately reviewed change; never relay auth codes to another origin,
   bypass PKCE or manufacture an Account session.
5. Use disposable test owners and a test device, not a production learner
   account. The app's local IndexedDB/CacheStorage data is origin-scoped;
   moving to a new hostname **does not migrate or sync** learners' data.

## Physical Android and iPad acceptance (pending)

For each device record model, OS, browser/WebView, date, installed PWA state,
the actual **deployed** 40-character SHA, and non-sensitive evidence per check:

- Launch the exact candidate in the browser and standalone PWA; verify
  cold launch, reload, offline/reopen, foreground/background resume and
  portrait/landscape rotation. Verify service-worker caching and no stale
  branch identity.
- Test Japanese navigation and all five native Kana sections at compact
  widths, 200% system text, safe areas and dark/light. Verify single-owned
  shortcuts, touch targets, keyboard focus and TalkBack (Android) or VoiceOver
  (iPad). Check speaker/headphone audio and any explicitly supported local
  microphone capture/deletion.
- Perform graded standard Kana reviews versus ungraded chart/cram practice;
  inspect due counts and refresh/relaunch. Do not convert practice into an
  FSRS grade. Reject stale, wrong-owner or duplicate progress.
- Only **after separately approved preview OAuth**: test two disposable owner
  identities A/B, explicit sign-in, return callback, sign-out, offline attach
  failure, reload and resume; compare visible cards/progress before/after each
  owner switch. Verify account A's data never appears in B's session, failed
  attachment does not delete guest data, and same-owner backup preview does
  not overwrite canonical review history.
- Evidence must not contain names, owner IDs, account tokens, authorization
  codes, raw private study data or voice recordings.

Use `release/j16b-android-session-template.json` and the J14/P21/J15D
pending manifests for the corresponding independent device approvals.
Do **not** commit signed evidence to the immutable candidate source tree.
Real observations, product/accessibility/release-operations signoff, and
external language/source-rights validation belong to separate authorities.

## Stop / NO_GO conditions

Stop acceptance when the deployed SHA does not match, callback registration
is missing, caches serve the wrong build, an owner leak or data loss is
suspected, a high-severity accessibility/device defect is found, or an approval
cannot be substantiated. Preserve the original account and local data. After
any defect fix, verify a new exact SHA and rerun affected automated and real
device checks; do not reuse older approvals.

The full CI workflow intentionally skips **draft** PRs. The focused and
temporary-merge workflows alone are not P22 stable release authorization.
The Pages workflow has an independent manual dispatch capability; **never
use it as a PR preview**, since it acts on `main` and can affect the live
candidate. No deployment, merge, first-party OAuth registration, or stable
promotion is authorized by this document.
