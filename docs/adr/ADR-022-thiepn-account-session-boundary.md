# ADR-022 — THIEPN Account session boundary

Status: accepted, P9 implementation active

## Context

THIEPN Account owns canonical identity and authentication. THIEPN Core verifies bearer access tokens against the Account auth service before serving private application data. Japanese must not create a second identity authority or use cached browser identity as server authorization.

P9 requires Japanese to publish its privacy-minimal language read model to Core. That creates two distinct ownership requirements:

1. the Core request must be authenticated by the canonical Account session; and
2. the local Japanese workspace being projected must belong to that same Account ID.

## Decision

Japanese is a consumer of the canonical THIEPN Account system. Its thin browser adapter is configured against the canonical THIEPN Account Auth project, but the user-facing sign-in flow enters through `https://account.thiepn.dev/japanese/entry`. Japanese does not create app-local credentials, password tables, users, profiles, OAuth issuers, or authorization claims.

The auth adapter:

- verifies current identity with `auth.getUser()`;
- uses `auth.getSession()` only to transport the bearer token to Core;
- keeps the PKCE verifier and resulting browser session in Japanese while handing the authorization request to the Account-owned tokenless entry page;
- uses the exact production callback `https://thiepn.dev/japanese/auth/callback/` with no custom callback query parameters, persisted browser sessions, refresh tokens and a Japanese browser storage key;
- never treats the session payload itself as authorization;
- leaves final token verification and owner derivation to Core;
- never sends access tokens, refresh tokens or PKCE verifiers through `account.thiepn.dev`.

Local IndexedDB remains physically partitioned by Account ID. The legacy anonymous/development workspace is treated as a guest workspace. On first authenticated use it may be claimed only when the target Account workspace is empty. Study events, memory traces and private imported content are rewritten to the canonical Account ID; server sync cursors are deliberately not migrated.

If the authenticated Account ID and active local workspace ID differ, P9 dashboard publication fails closed.

## Consequences

- Account remains the only identity authority.
- Core remains the server-side authorization boundary.
- Japanese can support guest-first local study without publishing guest data under an arbitrary signed-in identity.
- Signing into a second account on the same browser does not expose the first account's IndexedDB workspace.
- The P9 dashboard carries only the existing P8 read model, never raw StudyEvents, answers, recordings, private documents or account identifiers.
- The local adapter is only an Account consumer boundary. It is not an independent Japanese account system and may later be replaced by a shared THIEPN Account SDK without changing Japanese domain ownership semantics.

## Deployment dependency

Production Google sign-in requires the exact `https://thiepn.dev/japanese/auth/callback/` URL to be accepted by the canonical Account Auth redirect configuration. The Account entry validates that exact callback before forwarding to the canonical provider. Hosted redirect configuration is an activation prerequisite, not a reason to create a separate Japanese auth system.


## P12 production hardening

The P12 burn-in audit removed the redundant callback `flow` query parameter and now relies on the standard browser-held PKCE verifier plus a fresh tab-local pending-login marker. Japanese dashboard publication also targets the deployed Core Worker at `https://thiepn-core-gateway.thiepn.workers.dev` rather than the undeployed `api.thiepn.dev` hostname.
