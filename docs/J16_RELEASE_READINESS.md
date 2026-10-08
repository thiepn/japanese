# J16 — Release Readiness & Field Acceptance

**Status:** J16A synthetic live-candidate verification implemented; physical/human acceptance still pending. This is an operational phase, **not** P23 learner-capability development, new AI features, a new dashboard, or another J-series visual redesign.

## Product and release boundary

The 15-stage Japanese visual migration culminates in J15D; remaining blockers are real-device and reviewer acceptance, not additional style production. J16 consolidates those outstanding release obligations. The P20 learner capability freeze, P11 human evidence boundary, P21 real-device qualification and P22 production/maintenance controls remain authoritative. J16 does not override or replace any of them.

**Immutable candidate principle:** All screenshots, browser tests, live candidate routes and installed Android PWA checks must identify the same actual tested commit. A commit on a feature branch is not automatically the live Pages deployment. A successful GitHub Pages push is not automatically a stable-release promotion.

## J16A — Candidate identity, deploy preview and rollback

- Complete and merge J15D code after *exact-head* full CI and the 42-case visual comparison succeed. Record merge SHA separately from its source PR SHA, especially if squash-merged.
- Verify built Pages commit metadata on the public URL, Account entry/callback paths and version identity; do not infer deployed commit from PR branch name.
- Freeze the actual deployed Pages candidate SHA; preserve stable and candidate identities separately.
- Record last known good candidate and a rollback process. Do not auto-enable P22 stable status.
- Produce a candidate-verification record in `release/j16-field-acceptance.json` only after actually observing the deployed URL.

## J16B — Physical Android PWA acceptance

A human tester uses a real installed Android PWA on the frozen candidate. Evidence must identify model, Android version, browser/WebView version, PWA install state and exact displayed build SHA. Cover: cold launch, all five destinations, full-screen Study and controls, Reader, Library search/filters, light/dark persistence, offline reload, background-resume, rotation, safe areas, 200% text, keyboard, TalkBack, speakers and headphones, microphone permission/recording and private local audio deletion.

Do not mark an emulator, CI screenshot or a test that ran on a different SHA as physical pass. J14/P21/J15D physical acceptance remains pending until genuine evidence is recorded.

## J16C — Independent visual/a11y review

Review all 42 J15D screenshot reference, candidate and difference images. Check more than raw pixel equality: interactive focus, Japanese text line breaks/legibility, theme contrast, reduced motion, mobile navigation, tablet Reader desk, desktop hierarchy and operational-panel isolation. Record reviewer identity, date, evidence references and exact candidate. Resolve blocking issues through tracked defect-only PRs with repeat CI and device retests.

## J16D — Signoffs and controlled stable-release decision

Re-run strict J15D-D5 against the **same frozen candidate**, a successful CI run, a successful 42-case visual run and independently recorded reviewer/physical acceptance. Separately respect strict P11/P21 qualification and P22 production rules; do not claim independent CEFR certification. Human product, accessibility and release-ops approvals are required. If any gate is pending, remain candidate-only.

Only then deliberately activate stable via the existing P22 release mechanism, verify immutable release identity, preserve rollback, and perform post-deployment smoke checks.

## J16E — Observed field stabilization

Continue for a bounded review window after any authorized activation: review meaningful performance issues, crashes, offline behavior, Account redirects, touch navigation, screen reader usability and real learner confusion. Fix evidence-backed defects without introducing unrelated features. Monitor production identity and availability using existing P22 operational tools. Escalate any capability change to a **separate roadmap decision** rather than treating J16 as authorization for unbounded development.

## J16 acceptance table

| Milestone | Exit condition | Current status |
| --- | --- | --- |
| A: Verified candidate | Actual deployed SHA and live routes evidenced | Pending |
| B: Device QA | Real Android PWA tests, exact SHA, no blocking defects | Pending |
| C: Visual review | 42 cases reviewed by person, accessibility and focus checked | Pending |
| D: Controlled release | All applicable strict gates + authorized release + smoke verification | Pending |
| E: Stabilization | Time-bound defect review, monitoring and rollback verified | Pending |

## Important rule

**Never manufacture a passing manifest or silently switch a pending gate to passed.** Code CI and visual-diff automation can be finished without declaring that user-operated Android hardware checks, professional reviewer qualifications or stable production activation already occurred.

### J16A automated verifier

`pnpm verify:j16a --commit <exact-live-main-sha> --strict` checks the **actual public Pages candidate** against the immutable expected SHA. It probes the homepage, release metadata (`channel: candidate`), Account entry URL, app callback route, standalone PWA manifest and icon, and JS service-worker response. Results are written to `artifacts/j16a-live-candidate.json` and `.md`. The independent `J16A Live Candidate Verification` workflow checks that public candidate on PR review or explicit on-demand dispatch. When main changes, compare against the new **deployed** commit rather than treating a stale cache as success. This is only synthetic HTTP route verification: live sign-in/SSO, installed Android operation and offline behavior remain separate human/test gates. The checked-in pending field manifest is not automatically rewritten.
