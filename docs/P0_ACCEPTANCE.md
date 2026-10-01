# P0 Acceptance

**Status: COMPLETE — local architecture accepted. Shared THIEPN platform dependencies are explicitly deferred by ADR-021 and ADR-022 rather than reimplemented inside Japanese.**

- [x] monorepo installs, typechecks, tests and builds in CI
- [x] PWA shell installation/offline behavior is verified in a real Chromium browser
- [x] five primary surfaces exist
- [x] THIEPN Account/Core adapter contract is defined
- [x] production THIEPN Account session handoff is explicitly delegated to the shared platform (ADR-022)
- [x] canonical domain and StudyEvent contracts exist
- [x] local StudyEvent persistence has regression coverage
- [x] local personal state is partitioned by canonical AccountId
- [x] local StudyEvent + sync-outbox write is atomic
- [x] learner reducer has deterministic regression coverage
- [x] production FSRS library is isolated behind a scheduler adapter
- [x] persistent SQLite/WASM content database is verified in a real browser
- [x] SQLite/WASM IndexedDB-VFS implementation is wired behind `@thiepn/content-db`
- [x] SQLite persistence strategy does not require OPFS/cross-origin isolation
- [x] Japanese search normalization has regression coverage
- [x] Library search is wired to the persistent content database
- [x] source registry baseline exists
- [x] licensing validator is wired into CI
- [x] public seed package declares an exportable source rather than bypassing provenance
- [x] sync adapter conforms to THIEPN Core Sync v1 / Event Sync v1 semantics
- [x] sync conformance harness proves idempotent push and opaque-cursor pull
- [x] production private sync is delegated to Core rather than duplicated in Japanese (ADR-021)
- [x] concurrent multi-device review scheduling conflict policy has regression coverage
- [x] account partitioning is tested locally
- [x] 食べる architecture slice proves event → mastery → FSRS → Core-event mapping → second-client mastery
- [x] full browser/Core production handoff is explicitly deferred to shared platform registration/session/sync availability (ADR-021, ADR-022)

## P0 exit

P0 has established the invariant architecture required for learning features. P1 may begin without creating substitute authentication or sync infrastructure inside `thiepn/japanese`.
