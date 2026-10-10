# J27 — Exact-Head Evidence Chain & Browser Reliability

## Verified prerequisite

J26 draft PR #52 exact head \`e70f54e201ee23d75d5f7cc32d04c0ef9d761905\` passed [CI #38008299237](https://github.com/thiepn/japanese/actions/runs/38008299237), job #114082124503, all 40 steps; the \`b2-release-qualification\` artifact was uploaded. The browser suite reported **637 passed, 82 skipped and one flaky case that passed on retry**. J27 is stacked directly on J26 and must requalify its own exact head.

## Evidence chain

\`scripts/j27-release-evidence-chain.mjs\` runs after J20–J26 reports have been generated. It reads the **actual bytes** of the eight prerequisite machine records (J20, J21, J21 reviewer packet, J22–J26) in frozen order. It requires all candidate SHAs to match the tested head, validates each preceding blocked decision and the known 42 original visual cases / 126 images, and hashes each raw record into a predecessor-linked SHA-256 ledger. It also hashes the three checked-in J15D, J16 and P22 manifests and rejects any fabricated signoff, staging rollback or stable activation. The reproducible record is \`artifacts/j27-evidence-chain.json\`; it is uploaded with the existing \`b2-release-qualification\` evidence.

Reverify from the same checked-out commit and generated artifacts:

\`\`\`sh
J27_CANDIDATE_SHA=<exact-40-hex-head> node scripts/j27-release-evidence-chain.mjs \
 --verify-chain artifacts/j27-evidence-chain.json
\`\`\`

A valid chain **does not authenticate independent human reviewers**. The CI decision is necessarily \`BLOCKED_INDEPENDENT_ACCEPTANCE_EVIDENCE\`, with merge, deployment and release flags all false. Only an authorized operator can accept real, independent exact-SHA evidence on a separately controlled evidence ref.

## Search stability

J7's Library search is asynchronous. Previously a new query could display a stale result while its debounced search was still pending, allowing a click to select a different entry after the response arrived. J27 immediately clears prior results and displays a loading state as the query changes, and checks that the clicked word's canonical details remain visible after the results settle. No assertion is disabled.

## Non-automated release blockers

- Actual 42-case J15D screenshot comparison and independent reviewer of 126 real PNGs
- Qualified Japanese/P11 review and independent accessibility/product/operator signoffs
- Physical installed Android PWA/TalkBack/audio and microphone session
- Real THIEPN Account OAuth client registration, callbacks, persistence and logout
- Exact staging metadata, witnessed rollback to a known-good SHA, independent approval-roster identity
- Human release and production-cutover authorization

No J27 automation merges, deploys, creates OAuth clients, replaces golden screenshots or fabricates human approval. J28 may begin only after full exact-head J27 CI is green; promotion remains operator-only.
