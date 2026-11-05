# Acoustic crop/gain decision matrix — reviewer-only, UNAPPROVED

**Status: diagnostic analysis, not a Japanese pronunciation judgment or media-release authorization.**
**Analyzed originals: five SHA-256-pinned Wikimedia Commons Ogg Vorbis files.**
**Source identity and exact original-byte hashes:** [ORIGINAL_AUDIO_EVIDENCE.md](ORIGINAL_AUDIO_EVIDENCE.md).
**Executable analysis:** `scripts/kana-foundations-acoustic-review.py` (runs only after exact source checks).

## Core finding: three short signal windows per recording

A reproducible FFmpeg silence-threshold sweep shows three short signal-active windows, separated by approximately one second, in **each** of the five files. Here "active" means "outside an FFmpeg `silencedetect` quiet interval", **NOT** "verified voiced human speech". It cannot establish the phoneme, repeated-word identity, speaker quality, naturalness, or whether the first sound has a truncated onset.

Parameters: `silencedetect=n=-45dB:d=0.15`; timestamps in seconds; original files analyzed unmodified. The displayed first window begins at **0.000** for every file, which could mean speech is present from the file boundary. No pre-start audio exists; do not assume the onset is complete.

| Character | Window 1 | Window 2 | Window 3 | Activity durations (ms) | Quiet fraction at −45dBFS | Separations of activity-window starts |
|---|---|---|---|---|---:|---|
| あ | 0.000–0.225 | 1.132–1.225 | 2.125–2.212 | 225 / 93 / 87 | 83.74% | 1.132 / 0.993 s |
| い | 0.000–0.120 | 1.016–1.097 | 2.009–2.084 | 120 / 81 / 75 | 89.87% | 1.016 / 0.993 s |
| う | 0.000–0.128 | 1.016–1.097 | 2.014–2.084 | 128 / 81 / 69 | 89.53% | 1.016 / 0.998 s |
| え | 0.000–0.168 | 1.086–1.173 | 2.078–2.160 | 168 / 86 / 81 | 87.53% | 1.086 / 0.992 s |
| お | 0.000–0.116 | 1.028–1.135 | 2.031–2.130 | 116 / 107 / 100 | 87.16% | 1.028 / 1.003 s |

The approximately one-second repeated timing is **consistent with** multiple short sound presentations. Identical spoken content has **not** been verified; do not label these recordings as three repetitions of the same vowel without actually listening and checking. Some signal windows are under 80 ms, a warning that automatic segment extraction could omit meaningful speech context.

### Sensitivity to detection threshold

The same three-window pattern survives `silencedetect` threshold changes from −50 to −35dBFS, minimum quiet interval 0.15 seconds:

| Kana | Quiet fraction at −50 dBFS | −45 dBFS | −40 dBFS | −35 dBFS |
|---|---:|---:|---:|---:|
| あ | 83.68% | 83.74% | 83.98% | 84.61% |
| い | 89.81% | 89.87% | 90.14% | 90.44% |
| う | 89.51% | 89.53% | 89.89% | 90.13% |
| え | 87.50% | 87.53% | 87.62% | 87.85% |
| お | 87.04% | 87.16% | 87.20% | 88.21% |

These percentages do **not** mean a file contains that percentage of literal digital zero, nor do they prove the remaining material is a vowel. They merely reproduce a defined threshold/minimum-duration detector.

## File-by-file proposed decision matrix

**No cuts or gain changes are approved as teaching assets.** These are decision *options* for a Japanese speaker and an audio reviewer.

| Kana | Key measured issue | Candidate crop for reviewer comparison | Peak-matched preview (NOT loudness-normalized) | Decision |
|---|---|---|---|---|
| あ | First activity 225ms; subsequent activity only 93/87ms. First onset at t=0 | Compare all 3 isolated guarded windows; determine which, if any, contains intact natural vowel | −2.459 dB | HOLD — do not select automatically |
| い | Three bursts 120/81/75ms, ~90% quiet | Compare all 3 separately and assess whether any is long enough and intelligible | +6.500 dB | HOLD — very short bursts |
| う | Third active burst only 69ms; lowest original full-file peak (~−19.1 dBFS) | Compare all 3; inspect loss of vowel onset and synthetic playback artifacts | +7.104 dB | HOLD — strongest gain change, not authorized |
| え | First 168ms, later 86/81ms, all separated by silence | Compare all 3 and inspect for clipped transitions | +0.128 dB | HOLD — authenticity and length unknown |
| お | 116/107/100ms bursts, ~87% quiet | Compare all 3, include phoneme distinction from う | +3.556 dB | HOLD — naturalness/identity unknown |

**Alternative if any candidate fails:** Record a new, consistent five-vowel set with a qualified Japanese speaker and a documented commercial reuse grant. That may be more reliable than attempting to salvage extremely short bursts. A public-domain label is a rights clue, not acoustic qualification.

## Temporary reproducible transformations and hashes

**Exactly twenty unapproved test derivatives** are generated into CI's temporary `acoustic-forensics-review-only/` directory, never committed or copied into a production directory. Original source bytes are checked again after analysis.

- **15 separate audition windows:** 3 activity windows per vowel with 35ms leading and 55ms trailing context when available. Each window uses sample-aligned `round(seconds × 44100)` frame boundaries, original 2-channel PCM float32 decode, and 16-bit WAV conversion using nearest-even Python `round(value × 32767)`. This is **not** selection of speech start/end boundaries approved by a Japanese reviewer.
- **5 full-length peak-matched A/B previews:** same original content and silence, no crop; linear gain factor calculated to a peak of −12.0 dBFS, converted to 16-bit stereo WAV. Peak alignment **does not** equalize perceived loudness or improve the original signal/noise ratio. It is only a comparison for a human reviewer.
- Source decoder, FFmpeg version, Python version, crop intervals, per-interval peak/RMS, threshold sensitivity, gain values, and all **20 full derivative SHA-256 hashes** are stored in the generated `acoustic-measurements.json` plus `review-derivative-sha256sums.txt`. Re-check with `sha256sum --check` from the artifact folder.

### Five full-length A/B comparison hashes (CI FFmpeg 8.0.1-3ubuntu2)

| Kana | Review-only +gain (dB) | PCM16 WAV SHA-256 |
|---|---:|---|
| あ | −2.459 | `2879a76d0014959538802aaa463490931185866f1ebcadc2b06f19228a9b5e3e` |
| い | +6.500 | `3e7626d384583fecc69e1d5cf4f157da8be9d34edfc92bd6476852ee9cf3fad5` |
| う | +7.104 | `96ed3362b1bfe5d78315934f57d3f0b0b8f7dae8d0cff16a326355d03b8d4eda` |
| え | +0.128 | `afe7abafe04d79edf7c73612f49cf3f8a574c7881da60c177dab6cd52e3eff09` |
| お | +3.556 | `b85a804bbf58f2598a16d1134ad07c41e1354f3da9085896b9e44134551192b5` |

### Fifteen guarded activity-window candidate hashes

These identifiers are the raw output WAV SHA-256 values from the first successful acoustic CI runner, included here because the review-only artifact expires after seven days. All are **unapproved audition snippets**, never assumed to be correctly pronounced vowels.

| Kana | Window | Review-only PCM16 WAV SHA-256 |
|---|---:|---|
| あ | 1 | `9dc3d40bfaec201f7beb158d2e943ef3eed1526f36a33234e1b15a8615f90118` |
| あ | 2 | `20ae6f05b91d5295785a1f36484509b2cf8cfb0c8c2a24709dd86708d483205e` |
| あ | 3 | `26e15c31e0c141aac0737afc1880bc43d4a6d800877dcf3b6fad3d22d6493bbf` |
| い | 1 | `3646af02f13b0926bec380dcfec61098e913dd9614c606f169a7196d01e42e4d` |
| い | 2 | `05c0e0591178b1313c91a0598b43f0838bc9ef61208724690519865d7ece3f84` |
| い | 3 | `e6d311aad7e687af8365ce126ada1cba2ee138f3cba25c92d41162c3bca39869` |
| う | 1 | `86b85217abe65e29966e79ac88f1712c0df82f8d5b0d7dcafdd627921af90ab2` |
| う | 2 | `49b601cac318db44756c3e623c529d0e3a17f83d61056d1ccd0a086156a97f42` |
| う | 3 | `e167888edb82efe9bee8b77219157e9ba19dad50c402da0052d739594ca6a25b` |
| え | 1 | `4b5c2dea09617a164d138250677dccaa603fbc80e717502b85af46bb2134f474` |
| え | 2 | `d6a9c7ef25d79fae40e29067789095e187e279192c4e9ea402f7a6e8560ff3e9` |
| え | 3 | `f94c9e0ab53ffe2bebcd931a7bee40f1ca17911a4018a369d401694fac9a12b5` |
| お | 1 | `ac83ebab32104630ae1533db22c599dd2e86f2729145ecc374199b2a92a84911` |
| お | 2 | `228e161d691dda8f84602cadf72fcceb05d4d30a60ab93a65c78415c33d964f6` |
| お | 3 | `f575755223e77f5e204559ad432e11bea537dcfda006f01c7497cee6aee63d72` |

The acoustic script also computes an **energy-selected 30ms autocorrelation periodicity proxy** for each activity window. If its peak indicates pitch-like periodicity, that is still not proof of human voicing, speech repetition, or the intended Japanese vowel; those assertions remain expressly *unverified*.

These hashes identify the generated derivative bytes **in the documented runner environment**; a different FFmpeg decode implementation or PCM rounding environment may produce differing hashes. They are not hashes of original Commons files (see [original evidence](ORIGINAL_AUDIO_EVIDENCE.md)). All fifteen window-specific hashes remain in the machine-readable review artifact to avoid risk of manual transcription errors.

## Reproduce and validate (review-only)

From repository root with Python 3, FFmpeg and FFprobe:

```bash
python3 scripts/kana-foundations-audio-evidence.py --output /tmp/kana-vowels-review
python3 scripts/kana-foundations-acoustic-review.py --review-root /tmp/kana-vowels-review
cd /tmp/kana-vowels-review
sha256sum --check sha256sums.txt
cd acoustic-forensics-review-only
sha256sum --check review-derivative-sha256sums.txt
```

The first step validates source identity/size/SHA-1 from Commons API and calculates original SHA-256; the second independently rechecks those source hashes and regenerates threshold analyses and reviewer-only derivatives. GitHub Actions stores the review artifact temporarily (7-day retention).

**No teaching clip, crop boundary, normalization value, phoneme reading, rights conclusion, or pedagogical result is approved by these tests.**

## Human signoff: blocking questions

A qualified Japanese speaker with teaching/phonetic expertise must inspect the exact **hash-pinned original and three candidate windows per vowel** and record:
- How many separate utterances (if any), and are they all truly the target vowel?
- Is the sound at the file's initial boundary truncated? Are the later tiny windows enough to preserve a natural phoneme?
- Does trimming change the perceived phoneme or expose a click? Which exact candidate(s) are acceptable and why?
- Is original/peak-matched loudness comfortable and balanced at an ordinary listening level, on real devices?
- If no candidate passes, should five new licensed recordings replace the set?

An independent rights reviewer must verify ownership/reuse authority and intended jurisdictions. Audio engineer must review edits and approve new derived bytes and hashes. **Do not ship any original or reviewer-only derivative until all signoffs exist and a separate integration authorization is given.**

**Current signoffs: zero. No deployment, no Account, no FSRS, no learner-data modifications.**
