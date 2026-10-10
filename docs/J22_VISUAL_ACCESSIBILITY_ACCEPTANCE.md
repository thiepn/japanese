# J22 — Visual archive, semantic accessibility and independent acceptance

## Automated prerequisite

J21 draft PR #47 exact head \`67c4003c6bfbc9628911cb40786e8bf5cb38c586\` passed mandatory GitHub Actions CI #37997267092 (full Playwright, source audit and uploaded qualification evidence). J22 is stacked on J21. All phases remain unmerged and undeployed.

## What CI actually proves

- Existing full Playwright suite and J20 focused PWA matrix, with additional J22 browser checks for the five semantic primary destinations, dark-mode navigation, keyboard skip link and focus, reduced motion preference, 320px mobile and text scaling, and Account Escape focus restoration.
- \`scripts/j22-visual-accessibility.mjs\` declares exactly **42** required visual cases and **126** required PNG files (reference/candidate/diff). The CI report \`artifacts/j22-automated-acceptance.json\` explicitly reports the visual archive as **pending**, never as an unperformed screenshot comparison.
- Unit tests create synthetic PNG fixtures only inside test code to test fail-closed verification. These are **not** release screenshots or baselines.
- Automated checks do not prove TalkBack, real Android, speaker/microphone, real OAuth, Japanese language correctness or independent visual judgment.

## Authentic 42-case visual archive handoff

The existing **J15D-D4 Visual Regression** workflow must independently generate an exact-head screenshot report and all 126 real screenshots. Obtain its successful exact-SHA workflow artifacts. Existing \`J16C Visual Review Gallery\` workflow checks the upstream SHA, run status and screenshot archive.

Place the original \`j15d-d4-visual-comparison.json\` report and all actual PNGs under \`artifacts/\`, then run the CLI with the candidate SHA:

\`\`\`sh
J22_CANDIDATE_SHA=<exact-40-hex-test-sha> node scripts/j22-visual-accessibility.mjs \
  --archive artifacts/j15d-d4-visual-comparison.json \
  --images artifacts/j15d-d4-screenshots
\`\`\`

This checks the existing frozen visual baseline SHA, 42 distinct required cases, comparison drift bound (0.8% per case), exact candidate SHA, 126 decodable CRC-checked nonempty PNGs, image dimensions and SHA-256 hashes. Any missing, corrupt or mismatched input fails closed; no golden screenshot is automatically accepted or replaced.

The output \`artifacts/j22-visual-review-packet.json\` fingerprints the exact images, candidate commit and comparison cases. \`artifacts/j22-reviewer-blank.json\` is a truly unfilled independent-review worksheet.

## Reviewer intake is not approval

The reviewer must examine all 42 screenshot sets and separately record keyboard, reduced-motion, TalkBack, 200% text-scale and actual physical Android evidence. Return the worksheet with per-case observations, evidence refs and an independent reviewer declaration. Structurally validate locally:

\`\`\`sh
node scripts/j22-visual-accessibility.mjs --verify-submission \
  artifacts/j22-visual-review-packet.json path/to/returned-independent-review.json
\`\`\`

Validation checks exact packet SHA-256, candidate SHA, all 42 case results, five accessibility categories, required evidence references and decision consistency. The receipt explicitly states **independent reviewer identity unverified, human visual/accessibility approval false and release unauthorized**. Identity, independence and device/session evidence must be verified by a human operator out of band.

The existing \`release/j15d-d5-visual-review.json\`, \`release/j15d-d4-device-acceptance.json\` and \`release/j15d-d5-release-signoff.json\` remain untouched and pending. Only authorized review operators can admit real human evidence against the exact tested candidate on an appropriate separate evidence ref.

## Pending non-automated release boundaries

No merge or deploy. No OAuth registration or real Google SSO assertion. No approval of new baselines. Real Android installation, microphone/headphones, TalkBack, J21 Japanese expert review, independent visual/product/accessibility signoffs, exact candidate staging and rollback still require human evidence.
