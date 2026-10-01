# ADR-005 — Browser content database persistence

Status: accepted (revised during P0)

## Context

Japanese needs a large read-mostly relational knowledge store in the browser. The original research baseline assumed SQLite WASM over OPFS. The official sqlite-wasm OPFS VFS requires capabilities such as SharedArrayBuffer/cross-origin isolation in its standard configuration, which may be unavailable on simple static hosting.

## Decision

SQLite remains the logical local content database, but persistence is provider-based:

1. compatibility baseline: an IndexedDB-backed SQLite VFS that works on static hosting without requiring cross-origin isolation;
2. acceleration path: OPFS when the browser and deployment headers support the chosen safe VFS;
3. capability detection chooses the provider; application correctness must not depend on OPFS.

The initial implementation candidate is `@journeyapps/wa-sqlite` with `IDBBatchAtomicVFS`; OPFS variants may be introduced after real-device benchmarks.

## Consequences

- Japanese keeps relational SQLite queries/search while remaining deployable to ordinary static hosting.
- OPFS is an optimization, not an architectural dependency.
- Content databases remain replaceable downloaded packages; mutable user evidence remains in the separate account-scoped IndexedDB store.
- Storage provider choice stays behind a `content-db` package contract.
