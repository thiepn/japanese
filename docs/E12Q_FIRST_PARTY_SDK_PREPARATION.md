# E12Q — Japanese first-party Account SDK integration (candidate only)

## Verified source boundaries — 2026-10-15

- Japanese PR #94, containing the initial integration adapter, was **merged into draft PR #91** at `f0b0f37070bbf162c805298f459487174930892b`. All subsequent readiness implementation is committed directly to the **existing PR #91 branch**. No new PR or branch was made for this batch.
- Account `main`: `7ebde5df82ecfba6ed0aed6ffbcfccafff493da9`. The canonical public-client SDK source is `thiepn/account/packages/account-session/src/{index.ts,browser-sso.ts}`, package `@thiepn/account-session@0.1.0` (repository subpackage, not installed in Japanese).
- The exact SDK API modeled by `packages/auth/src/firstPartyAccountAdapter.ts`: `createThiepnAccountSession(...)` supplies `issuer,clientId,redirectUri`; `createThiepnBrowserSso(...)` supplies `initialize,connect,signOutLocal,completeCallback,verify,getAccessToken,subscribe,clientId`. The TypeScript surface in Japanese is a **structural integration contract**, not a copied SDK, forked OAuth client or independent PKCE engine.
- Account issuer: `https://hycegznamzjhwinegaai.supabase.co`; official Account origin: `https://account.thiepn.dev`; exact Japanese callback: `https://thiepn.dev/japanese/auth/callback/`.
- Live Account read-only DB inspection on 2026-10-15: one active Japanese `account_apps` row, **zero** first-party client registry rows for Japanese and zero matching `auth.oauth_clients` redirect registrations. Do not invent a UUID.

## Implemented preparation

- `createJapaneseFirstPartySdkAdapter` adapts the real SDK's identity lifecycle into the existing Japanese `AuthProvider`. Only SDK `verify` can establish authenticated identity; incomplete or unavailable login is not treated as signed in. It uses the already-existing Japanese connection intent, Account connection RLS and `connect_thiepn_app` RPC.
- `createJapaneseFirstPartyConnectionPort` uses an SDK-authenticated bearer per operation, not client-supplied user IDs. This preserves server ownership and does not create a new OAuth provider or user store.
- An A→B identity change invalidates the current operation's result before it can be used for owner-scoped Japanese UI changes; App's existing `AccountWorkspaceLease` remains canonical for local guest claim behavior.
- One-use callback parameters are removed from browser history **after** the shared SDK handles them. Local sign-out calls SDK `signOutLocal` and does not sign out the canonical Account session or other THIEPN apps.
- **Not activated**: production entry still imports `createThiepnAccountAuthProvider` in `packages/auth/src/index.ts` and uses the original legacy Google handoff until approved, staged integration. This branch changes no active app route, OAuth registration, or live session storage.

## Required cross-repository operator gates

1. Account operator explicitly checks existing records again and approves a **single** public client with code+refresh grants, PKCE S256, token auth `none`, no secret, and the exact Japanese callback. Run DCR **manual-only** via the Account onboarding policy. Record the issued UUID out of band; never automate DCR on pushes/PRs.
2. Pin the issued client ID to `account_first_party_oauth_clients` in an independently reviewed/idempotent Account migration. No registration or migration is performed here. Run Account's first-party onboarding check, including the `/sso/probe` origin and eligibility response.
3. Owner approves a **reproducible, reviewable dependency distribution** for the pinned Account SDK subpackage. The Account GitHub repository is private; blindly adding `github:thiepn/account#...&path:packages/account-session` to Japanese CI would require cross-repo credentials and risks leaking them. Do **not** copy the SDK, add credentials, or silently publish it. Confirm distribution integrity against the pinned commit and its license before activation.
4. Then create a separate approved integration change to construct the real SDK session and SSO with the registered client ID, exact issuer/callback, `authPolicy:"guest-first"` and a distinct app-local storage key, supply them to `createJapaneseFirstPartySdkAdapter`, and select this adapter in the original `JAPANESE_ACCOUNT` singleton. No legacy Google `signInWithOAuth` fallback may be mixed into the first-party flow.
5. Before turning it on, explicitly resolve callback state continuity between physical Android standalone PWA and Chrome; the shared SDK stores one-use PKCE verifier in sessionStorage. Do not claim cross-context callback success without real device tests. Preserve existing local study and original guest/workspace claim data; do not auto-migrate legacy tokens or overwrite other account workspaces.
6. On an authorized exact-head HTTPS staging origin, run **two independent disposable Account identities A/B** through new login, callback, revoke, app-local logout, retry/offline, switch A→B→A, real PWA/resume and owner-local StudyEvents. Assert no stale A data is visible under B. No user secrets in logs or evidence.
7. Obtain independent Japanese/P11/source-rights review, physical TalkBack/VoiceOver/accessibility review and separate human release authorization. Existing Core Sync v1 push/pull is not active, so app login must **not** advertise cloud saves or device sync.

## Honest acceptance state

- SDK structural adapter and focused fixture tests: pending exact-head CI at creation.
- Existing PR #91 baseline: 469 Vitest PASS, full build/budget PASS, 48 Chromium PASS/3 SKIP (not rerun in this preparation by default).
- Real first-party client: **BLOCKED** (not registered).
- Real SDK package resolution and Android callback: **NOT TESTED**, approval required.
- Real OAuth A/B and cloud device sync: **BLOCKED**; physical device, external language and source-rights signoffs **NOT TESTED**.
- Production, main and prior PRs: unchanged. No merge, deployment, migration or credentials in this PR.

## Follow-up on PR #91: actual source-ownership and race hardening

- `packages/auth/src/firstPartySdkCandidate.ts` now provides the dormant, generic typed composition of the **real** `createThiepnAccountSession` and `createThiepnBrowserSso` exports. It uses the exact Account issuer, Japanese callback, a separate app-local session storage key and `guest-first` policy. It has **no default, guessed or production client UUID**. The live `App.tsx` remains on the original legacy provider; this factory is not imported by the production entry.
- `scripts/verify-account-sdk-distribution.mjs` is a **read-only, offline source integrity guard**. The Account subpackage is private, and no GitHub release or credential-free package registry artifact was found during source inspection. The operator must stage the approved package bytes separately, then run `node scripts/verify-account-sdk-distribution.mjs --package-root /approved/staged/account-session`. The verifier rejects extra files, symlinks and altered files, validates the package identity and matches **four Git blob SHAs** read from Account's exact main commit `7ebde5df82ecfba6ed0aed6ffbcfccafff493da9`. It does not fetch or distribute the SDK and cannot attest reviewer identity, OAuth registration, or production authority.
- `scripts/verify-account-sdk-distribution.test.mjs` exercises that guard with synthetic local fixtures (never private Account SDK material). The original E12Q exact-head workflow now runs these regressions and **fails** if they fail. Normal CI does not attempt to load private Account code or require secrets.
- `packages/auth/src/firstPartyAccountAdapter.ts` now joins concurrent callback refreshes into one SDK call; scrubs callback code, state and error after SDK processing; invalidates stale asynchronous verification or slow SSO-probe results on sign-out/account changes; and fences late callback results. The original Account SDK remains the only authority for PKCE exchange and identity.
- `tests/platform/j38-first-party-sdk-readiness.test.ts` uses Account-SDK-shaped tests for factory options, invalid/unregistered client placeholders, A→B→A races, duplicated callbacks, in-flight logout, late verification and invalid/cancelled callback recovery. These are **fixtures**, not a successful live OAuth login.
- **Exact-head CI is the acceptance boundary** for this PR. P22 performance thresholds and StudyEvents/FSRS local storage are unchanged. All external human/device/source-rights approvals remain unsubmitted.

## External prerequisites remain mandatory

- **Account operator:** verify existing production records; manually register one public first-party client; approve the exact callback and use an independently reviewed/idempotent Account registry migration. Absolutely no automated DCR; do not publish any secret.
- **SDK distribution owner:** approve an auditable way to make the exact pinned, first-party-licensed package available for Japanese and run the offline source check on the actual delivered bytes. A matching checksum is **necessary but not sufficient** for operational authorization.
- **Japanese application owner:** in a separately reviewed activation change, supply the real registered client UUID, load the verified real SDK, construct this dormant factory, and deliberately retire legacy Google direct login. Do not mix session/token stores. Test one-use callback state in both Chrome and a physical standalone Android PWA; sessionStorage-based PKCE does **not** automatically cross contexts.
- **Security/QA:** use two actually authorized disposable Account identities to test grant, revoke, background/retry, A→B→A switching and owner-scoped workspace data without exchanging tokens or private student content. Retain separate independent Japanese/media rights, TalkBack/accessibility and release authority evidence.
- **Core operator:** production Sync v1 push/pull is still absent for Japanese. **Never advertise cloud saves** based solely on Account authentication.

Nothing in this change authorizes registration, a production deploy, a merge, a migration, genuine multi-device sync or a release.
