# J16C — Independent Visual Review

**Implementation:** the gallery and integrity audit are coded; **no human signoff is inferred**.

J15D-D4 produced 42 screenshot comparisons: five learner destinations across desktop, tablet and emulated Android in two themes, plus Study, Reader and Diagnostics. The source baseline is `d962c352aab9cd7ad2d9183fb40a3c5671ab7b4a`. J16C verifies that the archive matches exactly one 40-hex candidate commit, contains precisely 42 successful unique cases (≤0.8% pixel differences), and includes all 126 nonempty reference/candidate/difference PNGs.

After obtaining an exact successful J15D-D4 workflow artifact, unpack `j15d-d4-visual-comparison.json` and `j15d-d4-screenshots/` into `artifacts/` and run:

```sh
pnpm review:j16c --commit <40-character-visual-candidate-sha>
```

The command writes `artifacts/j16c-review/review-validation.json` and `index.html`. Keep the original `artifacts/j15d-d4-screenshots/` adjacent to that review folder. Open `index.html` locally: it displays all three images, per-case notes, keyboard next/previous, and an optional draft JSON export. No external network or Account access is required.

**Review concerns:** Japanese reading clarity and line breaks, contrast, card/surface layout, mobile bottom navigation, tablet Reader desk, dark-theme parity, controls and visual clipping. Keyboard behavior, TalkBack, real Android and microphone/audio are *not* proven by static screenshots. The exported JSON is always `draft_not_approved`; reviewer identity, review date, evidence, device checks and D5 approval remain distinct. An exact live merge SHA may differ from the source SHA—verify provenance rather than silently assuming equivalence.

Follow `docs/J15D_D5_RELEASE.md` to admit completed human evidence on a separate review-evidence ref; never mutate the source candidate merely to append approval data.
