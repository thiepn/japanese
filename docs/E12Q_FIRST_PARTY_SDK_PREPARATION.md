# E12Q — Japanese first-party Account SDK integration (candidate only)

## Verified source boundaries — 2026-10-15

- Japanese parent: draft PR #91, `d5d14e59f8dddd76a7fa14689939ebe51c3faeae`, passing E12Q Actions #38798386792. This integration is a **separate stacked draft**.
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
