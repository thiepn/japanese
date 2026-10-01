# P0 Acceptance

P0 is not complete merely because the shell renders. The following gates define completion.

- [x] monorepo installs, typechecks, tests and builds in CI
- [ ] PWA shell installation/offline behavior verified in a real browser
- [x] five primary surfaces exist
- [x] THIEPN Account/Core adapter contract is defined
- [ ] production THIEPN Account adapter implementation is wired
- [x] canonical domain and StudyEvent contracts exist
- [x] local StudyEvent persistence has regression coverage
- [x] local personal state is partitioned by canonical AccountId
- [x] local StudyEvent + sync-outbox write is atomic
- [x] learner reducer has deterministic regression coverage
- [x] production FSRS library is isolated behind a scheduler adapter
- [ ] persistent SQLite/WASM content package loads locally
- [x] Japanese search normalization has regression coverage
- [ ] global search reads from the persistent content package
- [x] source registry baseline exists
- [x] licensing validator is wired into CI
- [x] sync protocol has idempotent operation IDs and cursor semantics
- [x] sync-store contract implementation proves idempotent push/cursor pull
- [ ] PostgreSQL-backed push/pull implementation exists
- [ ] concurrent multi-device review reconciliation is tested
- [x] account partitioning is tested locally
- [x] 食べる architecture slice proves event → mastery → FSRS → sync → second-client mastery
- [ ] 食べる full browser/server vertical slice passes on two real clients

P1 must not begin until the remaining architectural gaps are completed or explicitly deferred with an ADR.
