# ADR-022 — THIEPN Account session boundary

Status: accepted, P9 implementation active

## Context

THIEPN Account owns canonical identity and authentication. THIEPN Core verifies bearer access tokens against the Account auth service before serving private application data. Japanese must not create a second identity authority or use cached browser identity as server authorization.

P9 requires Japanese to publish its privacy-minimal language read model to Core. That creates two distinct ownership requirements:

1. the Core request must be authenticated by the canonical Account session; and
2. the local Japanese workspace being projected must belong to that same Account ID.

## Decision

Japanese uses a thin Supabase client configured against the canonical THIEPN Account Auth project. It does not create app-local credentials, password tables, users, or authorization claims.

The auth adapter:

- verifies current identity with `auth.getUser()`;
- uses `auth.getSession()` only to transport the bearer token to Core;
- uses PKCE, persisted browser sessions, refresh tokens and the Japanese-specific browser storage key;
- never treats the session payload itself as authorization;
- leaves final token verification and owner derivation to Core.

Local IndexedDB remains physically partitioned by Account ID. The legacy anonymous/development workspace is treated as a guest workspace. On first authenticated use it may be claimed only when the target Account workspace is empty. Study events, memory traces and private imported content are rewritten to the canonical Account ID; server sync cursors are deliberately not migrated.

If the authenticated Account ID and active local workspace ID differ, P9 dashboard publication fails closed.

## Consequences

- Account remains the only identity authority.
- Core remains the server-side authorization boundary.
- Japanese can support guest-first local study without publishing guest data under an arbitrary signed-in identity.
- Signing into a second account on the same browser does not expose the first account's IndexedDB workspace.
- The P9 dashboard carries only the existing P8 read model, never raw StudyEvents, answers, recordings, private documents or account identifiers.
- A future shared THIEPN Account SDK may replace this thin adapter without changing Japanese domain ownership semantics.

## Deployment dependency

Production Google sign-in still requires `https://japanese.thiepn.dev` to be accepted by the canonical Account Auth redirect configuration. That hosted configuration is an activation prerequisite, not a reason to create a separate Japanese auth system.
