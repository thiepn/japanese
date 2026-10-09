# J18 — Account / OAuth Session Reliability (candidate)

## Dependencies and verified evidence

- J17 draft PR #43 exact head `94f864af0cc3513b762f04e664d04805bfcf633a` passed the **mandatory CI** [37953043994](https://github.com/thiepn/japanese/actions/runs/37953043994) (2026-10-09). J15D D4 conditional visual workflow was skipped, not a human approval. J17 remains a draft; this phase is a stacked PR on its exact head.
- Inspected Account `main` at `15eac7f908fb5db930d19e6e2474b4be785a1c9d` and Core `main` at `f8f3f10f2aeedde67f53a850c916cff139c9329a`.
- **Read-only** connected Account production database check on 2026-10-09: `account_apps.japanese` is active; `account_first_party_oauth_clients` has **no Japanese row**, and a targeted `auth.oauth_clients` query found no named Japanese/callback client. Existing Library, Languages, French registrations are distinct.
- Account's `docs/FIRST_PARTY_CLIENT_ONBOARDING.md` requires manual-only public OAuth client creation, then a pinned, checked idempotent Account migration. **No OAuth registration, DB update, DCR workflow, authorization grant, or production code deployment was performed in J18.**
- `account/src/account/api/japaneseEntry.ts` continues to validate the older Google `/auth/v1/authorize` request; Japanese currently builds that handoff. It must not be presented as the registered first-party SSO client flow. The Account shell already has a newer `/oauth/consent` implementation for registered public clients.

## Confirmed provider defects and scoped repair

1. The Japanese callback successfully exchanged its one-use PKCE code, then called `getUser`. When that **second** verification failed transiently, `completeCallback` caught it as an **OAuth exchange failure**, recorded `AUTH-02`, cleared connection intent and published `expired`, potentially returning the UI to guest. J18 now distinguishes an already-successful exchange from an exchange error; the callback URL is still sanitized, the app-local token/session is not erased, and the caller receives a retryable verification error. **No authenticated identity is inferred from an unverified session.**
2. A background `onAuthStateChange` verification failure unconditionally called `publish(ANONYMOUS_CONTEXT)`, even when previously authenticated. J18 avoids falsely signing out a user on a transient error; actual `SIGNED_OUT` and verified anonymous results still clear identity normally.
3. `buildJapaneseAccountEntryUrl` trusted arbitrary same-origin `/auth/v1/authorize` query parameters even though Account validates exact Google/S256/callback fields. J18 rejects wrong providers, redirects, weak/noncanonical PKCE challenges and unexpected/duplicate query keys before opening Account. This mirrors the Account-side contract; it does not replace Account validation.

## Regression coverage

`tests/platform/j18-auth-recovery.test.ts` tests post-exchange transient `/user` failure and recovery without code replay, retention of Account identity during background network failure, and rejection of malicious/malformed authorization requests. Existing J16 tests for real sign-out races, cross-account data isolation, atomic scheduler writes, callback errors and service-worker cache exclusion remain mandatory.

## Human/operator-only blockers

1. Check Account production for an existing matching **authorized** public client before any manual DCR operation; the read-only snapshot showed none.
2. Manually register a single Japanese public Authorization Code + PKCE S256 client with exact `https://thiepn.dev/japanese/auth/callback/`, no client secret; pin UUID in Account migration; verify issuer, probe and control-plane ownership. **Requires independent Account operator approval and cross-repo change.**
3. Only after registration and approved cross-repo implementation switch Japanese to first-party `client_id`-scoped OAuth flow; do not mix legacy `provider=google` URL with the first-party client flow.
4. Physically test actual Google → Account → Japanese in Chrome and installed Android PWA, account switching, background/resume and logout. Do not infer these from mocks or Playwright.
5. P11 productive-language, P21 Android and J15D visual/accessibility release approvals remain pending. No stable promotion.

## Exit criteria and J19 dependency

The J18 code changes are review candidates only until **all mandatory exact-head GitHub CI** is green. J19 — Learning Data Integrity & Recovery — must not start before J18 qualifies. J19 should preserve atomic StudyEvent/FSRS/outbox storage, account-scoped local ownership, historical migrations, offline interruption recovery and non-destructive export/import. Cross-device cloud save transport is separately gated; do not claim it active.
