# ADR-022 — THIEPN Account session boundary

Status: accepted

## Context

THIEPN Account owns canonical identity and authentication. THIEPN Core verifies bearer access tokens against the Account auth service before serving private application data. Japanese must not create a second identity authority or silently couple its domain model to a separate Supabase user system.

The current shared platform does not yet expose a repository-independent session-handoff SDK/contract that Japanese can consume without duplicating Account implementation details.

## Decision

Japanese keeps authentication behind `@thiepn/auth` and treats production session handoff as a shared THIEPN platform dependency.

The Japanese app:

- uses canonical THIEPN AccountId as the only user ownership identifier;
- partitions all local private data by AccountId;
- never uses email as an ownership key;
- never invents an app-local password/account system;
- never treats cached local identity as server authorization;
- supplies a valid Account access token to THIEPN Core through the future shared session bridge;
- keeps app permissions/control-plane registration separate from Core data-path authorization.

## Consequences

P0 may complete without cloning Account auth logic into this repository. The remaining production handoff is explicitly external and must be integrated when the shared Account/Core bridge is available. Until then, authenticated cloud sync is not represented as production-ready.
