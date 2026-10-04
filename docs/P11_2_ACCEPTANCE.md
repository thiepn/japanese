# P11.2 — Native Corpus Sourcing, Provenance Verification & P9 Media-Gate Closure

Status: implementation complete. The checked-in P9 native-media inventory now satisfies the repository media thresholds through a provenance-audited native connected-speech corpus. P12 remains blocked because P11 still requires real external human validation.

## Purpose

P11.2 closes the source-dependent P9 media gap without weakening the release contract.

The phase replaces the previously empty native inventory with a checked-in source registry whose entries carry explicit evidence for:

- recording identity;
- reusable licensing;
- attribution;
- native-speaker status;
- source/content identity;
- connected-speech duration;
- register;
- source-rate condition.

The P9 inventory is generated from that registry rather than being maintained as an independent hand-edited truth.

## Source registry

P11.2 adds `release/p11-native-sources.json`.

The initial admitted corpus contains eight connected recordings across five speakers:

- Naoto Kan;
- Yoshihiko Noda;
- Shinzō Abe;
- Shigeru Ishiba;
- Yoshihide Suga.

The sources combine official Kantei / Government Public Relations material with Wikimedia Commons distribution pages where the reusable media is hosted.

The corpus intentionally covers both:

- **formal** prepared addresses;
- **polite** press-conference material.

It also contains both:

- **natural** baseline connected speech;
- **fast/stretch** press-conference source conditions.

## Evidence boundary for rate labels

The P9 `fast` condition is interpreted as a **relative pedagogical stretch-source condition**, not an acoustic words-per-minute score.

P11.2 therefore requires every rate label to carry:

- an evidence URL;
- a documented classification method;
- a rationale;
- an explicit `stretchCondition` flag.

A source labeled `fast` cannot pass the audit unless it is explicitly marked as a stretch condition.

This does not claim phonetic or acoustic speech-rate measurement.

## Native-speaker evidence

Language of the recording is not enough.

Every admitted source requires a dedicated `nativeSpeakerEvidenceUrl`. The initial registry points to speaker records that explicitly identify Japanese as native language.

The audit rejects an entry if this evidence URL is absent even when the recording itself is clearly in Japanese.

## License evidence

Every admitted source requires:

- a reusable license name;
- a license-evidence URL;
- an attribution URL;
- a source/media page.

NC and ND licenses are rejected.

The initial corpus uses:

- CC BY 3.0 material released by the Prime Minister's Official Residence;
- CC BY 4.0-compatible Japanese Public Data / Government Standard Terms material.

Public Data License compatibility is treated as explicit license evidence, not inferred from government authorship alone.

## Connected-speech requirement

P11.2 rejects clips shorter than 30 seconds.

The current registry therefore does not use short pronunciation snippets to inflate the media count.

Every admitted item is a connected speech, press-conference or extended official address.

## Deterministic audit and inventory generation

P11.2 adds `scripts/p11-native-source-audit.mjs`.

Commands:

```bash
pnpm native:p11:audit
pnpm native:p11:apply
```

`native:p11:audit`:

- validates the complete provenance contract;
- rejects duplicate source/media identities;
- rejects restricted licenses;
- rejects missing native-speaker/license/content evidence;
- rejects short non-connected clips;
- validates register and rate metadata;
- validates the eight provenance checklist dimensions;
- derives the P9 inventory;
- checks all P9 native-media thresholds;
- verifies that the checked-in P9 inventory exactly matches the registry-derived inventory;
- generates JSON and Markdown audit artifacts.

`native:p11:apply` regenerates `release/p9-native-inventory.json` from the registry before running the same audit.

Hand-editing the P9 inventory away from the verified registry causes CI to fail.

## P9 media-gate result

The checked-in registry now provides:

| Gate | Required | P11.2 |
| --- | ---: | ---: |
| Native connected-source documents | 4 | 8 |
| Licensed recordings | 8 | 8 |
| Independent speaker labels | 3 | 5 |
| Registers | 2 | 2 |
| Natural-rate condition | required | present |
| Fast/stretch condition | required | present |

Therefore the **P9 native-media gate is closed as a repository evidence gap**.

Full P9 release qualification still requires the complete regression suite, which CI supplies during release qualification.

## CI integration

Normal CI now runs the P11.2 provenance audit before build/E2E release qualification.

The strict P9 and P11 manual workflows also run the provenance audit before evaluating their respective gates.

Qualification artifacts now include:

- `artifacts/p11-native-source-audit.json`;
- `artifacts/p11-native-source-audit.md`.

## Regression coverage

P11.2 adds tests that prove:

- the checked-in registry satisfies every P9 media threshold;
- missing native-speaker/license/content evidence is rejected;
- NC licensing is rejected;
- short clips are rejected;
- a fast label without stretch evidence is rejected;
- missing verification checklist fields are rejected;
- hand-edited P9 inventory drift is detected;
- the checked-in P9 inventory is reproducible from the registry.

## Remaining P11 blocker

P11.2 closes the native-media side of the release candidate.

It does **not** fabricate the external validation required by P11.

The remaining substantive gate is a real external teacher/tutor/language-professional review covering at least six representative productive artifacts across writing and speaking, admitted through the P11.1 cryptographic intake workflow.

Until that exists, the correct product decision remains:

`HOLD_B2_RELEASE_CANDIDATE`

## Deliberate boundaries

P11.2 does not:

- count synthetic TTS;
- infer native-speaker status from Japanese-language audio;
- admit NC/ND media;
- use short voice samples to inflate connected-media breadth;
- call relative stretch conditions acoustic speech-rate measurements;
- make external-review evidence appear without an external reviewer;
- open C1 merely because the P9 media gate is now satisfied.

## P11.2 milestone

The repository now has a reproducible, provenance-audited native connected-speech inventory that satisfies the P9 media thresholds and is enforced in CI.

The remaining path to `OPEN_C1_ROADMAP` is external human validation, not additional native-media or provider plumbing.
