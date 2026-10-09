# J21 — Japanese content provenance and independent language review

## Prerequisites / implementation boundary

J20 draft PR #46 at exact head \`187030265abdc2b265f9086ea38fc1f878ee8066\` passed GitHub CI #37995894402, including the focused PWA browser gate, full Playwright matrix and release artifact. J21 is stacked on J20; J17, J18, J19 and J20 remain unmerged. This is automated infrastructure and a review handoff, **not a completed Japanese-language review**.

## Automated content-source audit

\`scripts/j21-language-audit.mjs\` reads the actual public source registry, jp-core manifest, canonical core seed and three C1 seed bundles. It checks unique typed content IDs, declared source IDs, public export permissions, non-empty licensing metadata, manifest inclusion and corrupted Unicode markers. Existing \`pnpm validate:content\` remains required for course references, grammar links and all cross-file integrity.

It produces \`artifacts/j21-content-audit.json\`, recording machine integrity only. It does **not** claim grammar accuracy, natural phrasing, kanji readings, pronunciation, frequency, CEFR validity, source pedagogical interpretation or copyright permission beyond the existing registry metadata.

## Actual reviewer packet and worksheet

The script selects a deterministic bounded set of actual repository grammar, lexemes, sentences, can-dos and course units. Each sample retains its source file, source IDs, declared licenses, teaching sample and exact candidate commit. The packet is fingerprinted with SHA-256 including the source-file digests: \`artifacts/j21-language-review-packet.json\`.

The generated \`artifacts/j21-reviewer-submission-blank.json\` is deliberately unfilled: reviewer identity and evidence are empty, verdicts are \`pending\`, rubric scores are \`null\`. It is a genuine reviewer worksheet, not a fabricated score.

Human review must examine grammaticality, meaning, register, level appropriateness, example naturalness, kana/kanji reading and pedagogical progression. Any needed correction remains a normal reviewed source change with tests. Reviewer files must not contain authentication secrets or learner-private content.

## Independent evidence intake

A reviewer may return a completed submission referencing the exact packet hash and candidate SHA. On a secured workstation, run:

\`\`\`bash
node scripts/j21-language-audit.mjs --verify-submission path/to/j21-language-review-packet.json path/to/completed-independent-review.json
\`\`\`

The intake validates full item coverage, per-item rubrics, declared reviewer role/independence, evidence reference, consistency of decisions and exact SHA-256 integrity. It **never** modifies the public release manifest or automatically approves a reviewer; the resulting receipt explicitly says reviewer identity is unverified and human review is not admitted. An actual operator must authenticate reviewer independence and the returned evidence out of band and record signed evidence separately.

Existing \`release/p11-external-validation.json\` and its independent B2 productive-evidence review requirements remain separate and unchanged. This J21 packet evaluates product content, not learner ability or accredited CEFR certification.

## Release blockers

Physical Android, installed-PWA and real Google OAuth acceptance; independent Japanese language review; independent visual/accessibility review and exact production rollout are pending. No merge, deploy, automatic OAuth client registration, human approval or stable promotion is authorized. J22 source implementation may begin only after J21 exact-head automated CI passes.
