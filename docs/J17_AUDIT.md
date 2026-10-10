# J17 — Repository Audit & Release Reconciliation

Baseline: **`ad5f7bc67f72d085d871cec30d87278ba414633c`**, 2026-10-09. Inspection covers repository tree (475 entries), App/J2 shell, auth, local persistence, architecture and sync contracts, release manifests, two open PRs, and current Actions. This is a targeted static/code and release-evidence audit—not an exhaustive line-by-line security audit or physical testing.

## Existing main qualification

| Check | Exact evidence | Outcome |
| --- | --- | --- |
| Main CI | [37927730051](https://github.com/thiepn/japanese/actions/runs/37927730051) | Success |
| Candidate build | [37927730009](https://github.com/thiepn/japanese/actions/runs/37927730009) | Success |
| Candidate Pages deploy | [37928931864](https://github.com/thiepn/japanese/actions/runs/37928931864) | Success |
| Scheduled candidate monitor | [37935741522](https://github.com/thiepn/japanese/actions/runs/37935741522) | Success; NOT stable certification |
| Production manifest | `release/p22-production.json` | `candidate`; stable inactive |

## Branch reconciliation

- [PR #39](https://github.com/thiepn/japanese/pull/39), head `6d6c2092ecdce64d244c53efcd7f014e4a3f3e1b`: diverged from main. Main's newer merged J16F/G/H covers much of its auth/session/storage/SW intent, but main still has an Account button that immediately invokes sign-in, connect, or sign-out. #39 includes an Account status popover. Its [CI 37857280933](https://github.com/thiepn/japanese/actions/runs/37857280933) failed due to a mobile **outside-dismiss test clicking an obstructed heading**; the Account menu test itself was not the reported failure. J17 selectively ports UI and explicit action wiring while preserving merged J16 account/data code, and repairs the E2E locator. Close #39 only after review/qualification; **never cherry-pick its stale provider/storage logic**.
- [PR #28](https://github.com/thiepn/japanese/pull/28), head `b0b403902f2fca2446fe548e0c2e9ae27e819fa8`: old test-only J-series disclosure changes. Current `main` E2E already contains equivalent scoped Library-result lookups, Reader overlay close, C1 vault open, and native listening expansion. Do not merge this old branch. Confirm and close only after review.

## Severity-ranked defect and gap register

| ID | Severity | Evidence | Resolution |
| --- | --- | --- | --- |
| J17-01 | **High; confirmed** | `App.tsx` `toggleAccount()` is invoked directly from header. An Account click can initiate sign-in or sign-out instead of opening status. | Fixed in J17 candidate: status-first Account panel, explicit actions, Escape/outside/close dismissal, browser regressions. |
| J17-02 | **High; release/integration hold** | PR #39 / J16 records lack verified Japanese first-party OAuth registration and live Google return flow. | J18 owns authorized Account/Core registration, PKCE A/B, session verification. |
| J17-03 | **High; release hold** | `release/p21-device-acceptance.json`: `pending`, `devices:[]`; J16 field evidence pending. | J20 exact-SHA physical Android/PWA, TalkBack, audio, mic, safe-area acceptance. |
| J17-04 | **High; release hold** | `release/p11-external-validation.json`: `reviews:[]`. | J21 genuine six-artifact productive-language review by an independent qualified professional. |
| J17-05 | **High; release hold** | J15D visual-review and release-signoff manifests pending. | J22 human 42-case review + product/accessibility/ops signoffs. |
| J17-06 | **Medium; documented limitation** | `docs/SYNC_PROTOCOL.md`: generic Core Sync v1 gateway production transport is absent; study data remains device-local. | J19 local data recovery; separately authorized J32 cloud sync. Do NOT claim cloud saves. |
| J17-07 | **Medium; maintainability** | Two open outdated PRs diverged from current main; #39 E2E click locator fails on mobile. | Port unique change only, repair selector, preserve recorded provenance. |
| J17-08 | **Unverified; measure first** | Root stylesheet and J-series styles coexist, with existing ownership/audit tooling. No evidence from this snapshot alone that any specific selector is dead. | Never purge speculative CSS without visual evidence and tests. |
| J17-09 | **Human validation needed** | Candidate CI and synthetic monitor cannot establish live Google auth, physical microphone/audio or learner language accuracy. | J18/J20/J21. |

## Ownership and constraints

- `apps/web/src/App.tsx`: routing/workspace/Account action wiring; retain account-key remount and owner capture.
- `apps/web/src/design/J2AppShell.tsx`, `j2.css`: visible Japanese UI; J17 changes here.
- `packages/auth`: canonical THIEPN Account/PKCE and race repair; no J17 mutation.
- `packages/local-db`: account-scoped IndexedDB, atomic StudyEvents+outbox+FSRS persistence; no J17 migration or mutation.
- `packages/domain`, `learner-engine`, `scheduler`: one StudyEvent/mastery authority; untouched.
- `packages/content-schema`, `content-db`, `japanese-nlp`, `search`: canonical language content/search; J17 does not add learning capabilities.
- `packages/sync-protocol`, `services`, `platform`: Core-owned production transport/identity; no false cloud-save claims.
- `apps/web/public/sw.js`: J16 OAuth code cache exclusions retained unchanged.
- `release/`, `.github/workflows/`: P11/P21/J15D human gates and P22 candidate production posture preserved unchanged.

## Future feature inventory (proposals, not defects)

- J24–J28: validated curriculum depth, kana/kanji stroke order, real grammar transfer, memory scheduling and native audio provenance.
- J29–J33: authentic reading/mining, honest speech evaluation, calibrated AI coach, independently qualified Core sync, placement/onboarding.
- J34–J38: measured Japanese visual/typographic consistency, evidence-based personalization, mobile performance, physical accessibility and learning analytics.
- J39–J40: separate authorized V2 security, human/device qualification, immutable production release.
- Such capability growth is **outside the P20 frozen learner architecture and P22 defect-only maintenance** until explicitly authorized as a new release line.

## J17 qualification and acceptance

Require exact-head TS, unit, content and native-provenance validation, bundle/design audits, all Playwright projects, plus Account popover/browser authorization assertions. Verify regression specifically for anonymous Account opening, explicit sign-in, Escape, outside click, close, touch viewport. No merge/deploy without required approvals. CI passing does **not** satisfy human P11/P21/J15D gates.

## J18 handoff

**J18 — Authentication, Account Integration & Session Reliability:** inspect Account/Core authoritative first-party Japanese registration and PKCE flow; validate real Chrome/PWA login and guest attachment, focus/race/refresh/session handling with regressions; preserve device-local study data. **Not started.**
