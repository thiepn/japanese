# P0 Acceptance

P0 is not complete merely because the shell renders. The following gates define completion.

- [ ] monorepo installs and builds in CI
- [ ] PWA shell installs and loads offline
- [x] five primary surfaces exist
- [ ] THIEPN Account adapter contract and implementation are wired
- [x] canonical domain and StudyEvent contracts exist
- [x] local StudyEvent persistence has a regression test
- [x] learner reducer has deterministic regression coverage
- [x] production FSRS adapter is wired behind a package contract
- [ ] SQLite WASM content package loads locally
- [ ] global local Japanese search is backed by packaged content
- [x] source registry baseline exists
- [ ] licensing validator blocks non-exportable content
- [x] sync protocol contract includes idempotent operation IDs and cursor semantics
- [ ] server push/pull implementation exists
- [ ] multi-device review conflict reconciliation is tested
- [ ] THIEPN account partitioning is tested
- [ ] 食べる end-to-end vertical slice passes on two clients

P1 must not begin until the architectural gaps above are either completed or explicitly deferred with an ADR.
