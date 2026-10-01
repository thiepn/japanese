# Architecture

## Core invariant

Canonical Japanese, learner evidence, pedagogical content and source material are separate domains.

All learning surfaces emit immutable StudyEvents. Learner mastery and memory state are projections derived from that evidence. No feature may maintain an independent authoritative known-word or mastery database.

## Target topology

- PWA: React + TypeScript
- Mutable local learner data: IndexedDB
- Large read-mostly Japanese data: SQLite WASM + OPFS, with capability fallback
- Offline assets: service worker + Cache Storage
- Identity: existing THIEPN Account/Core
- Backend: modular monolith
- Canonical server data: PostgreSQL
- Binary/private sources: object storage
- Background jobs: worker

## Dependency rule

`packages/domain` has no dependency on React, databases, HTTP or provider SDKs. Higher layers depend inward on domain contracts.
