# Kana PR #122 — isolated preview and physical Account acceptance (HOLD)

This document is an **operator handoff**, not evidence that a preview was deployed,
real hardware was tested, or OAuth/SSO is functional. PR #122 remains draft,
unmerged and NO_GO until all independent release gates are satisfied.

## Current technical source of truth

- Qualify **the newest exact PR HEAD**, not a copied SHA or the mutable main branch.
- The `Kana PR 122 qualification` workflow checks out
  `github.event.pull_request.head.sha`, writes `release-meta.json` using
  `channel: candidate` and that exact SHA, builds with
  `VITE_PUBLIC_BASE=/japanese/`, then checks Kana/Account regressions.
- After successful checks, the workflow uploads `kana-pr122-static-candidate`
  (14-day retention), including `index.html`, `404.html`,
  `auth/callback/index.html`, `kana/index.html`, `release-meta.json`,
  `sw.js`, icons and `manifest.webmanifest`. **No deployment occurs**.
- The artifact is constructed for the **/japanese/** URL prefix. Hosting the
  unchanged artifact at `/` or a different prefix is not a qualified preview.
- The current-main integration workflow independently tests a temporary,
  unpushed merge. That merged tree has a **different commit identity** from
  the PR-only artifact: its passing tests do not certify a deployed merged build.
- Reconcile main changes and requalify if the final candidate is instead a
  merge commit. Never assert that an artifact from the PR-only SHA contains main.

## Exact-SHA HTTPS preview: approval boundary

1. An authorized operator must choose a disposable, **separate-origin** HTTPS
   preview serving the complete artifact under `/japanese/`. Do not use
   the public `thiepn.dev/japanese/` route, replace production Pages,
   trigger `P22 Candidate Pages Deploy`, or switch Cloudflare main DNS.
   Cloudflare branch preview is currently configured off; this protocol does
   not authorize switching it on.
2. After publication **by an authorized independent operator**, read
   `/japanese/release-meta.json` with cache disabled and record its exact
   `commit` and `channel: candidate`. Compare with the unchanged GitHub PR
   head and verify the deployed artifact SHA/digest from its workflow run.
   If any value differs, stop. Check the callback route, manifest scope,
   service worker MIME type and icons without submitting credentials.
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
