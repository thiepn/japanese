# ADR-021 — Reuse THIEPN Core Sync v1

Status: accepted

## Context

`thiepn/core` already defines a shared private-data Sync Protocol v1, including authenticated ownership, registered `app_id`, opaque cursors, idempotent mutations, bootstrap, tombstones and Event Sync for immutable study/review facts.

Creating an unrelated Japanese PostgreSQL sync API would duplicate platform infrastructure and could diverge from THIEPN ownership/security semantics.

## Decision

Japanese uses Core Sync v1. StudyEvents use Event Sync v1. The Japanese repository owns domain schemas/reducers and a protocol adapter/conformance harness, but not a second private sync authority.

The client never trusts a wire `user_id`; synced StudyEvents are re-associated with the locally authenticated canonical AccountId after Core authorization.

## Consequences

- production sync transport depends on the generic Core sync gateway becoming available;
- until then, Japanese tests protocol behavior through the in-memory conformance harness;
- P0 does not create a duplicate PostgreSQL synchronization service;
- future device revocation, bootstrap, cursor expiry and platform backup semantics remain platform-consistent.
