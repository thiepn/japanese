# Original five-vowel audio — independent source evidence and HARD release hold

**Evidence collected 2026-11-05 UTC from original Wikimedia Commons upload bytes.**
**Review status: NOT APPROVED for pronunciation instruction, quiz audio, distribution or app integration.**
**No original media file or generated derivative is committed to this repository.**

## 1. Exactly identified original assets

MediaWiki Commons \`action=query&prop=imageinfo\` returned the original-file URL, upload timestamp, uploader, file size, SHA-1, MIME and publicly declared license. The evidence script downloaded the **original upload**, checked byte size and SHA-1 against MediaWiki, and independently computed SHA-256. No MP3 transcodes or redirects were substituted.

| Kana | Canonical original | Upload timestamp UTC | Bytes | Verified SHA-256 |
|---|---|---|---:|---|
| あ | Ja-A.oga | 2009-10-04 09:57:13 | 22,897 | 37d8b51acbdec5f1a4768520c4ad94a14f21f1230f33a2d7f50406ca9b32aff6 |
| い | Japanese_I.ogg | 2009-10-04 10:13:03 | 17,751 | 39a55eee1bd2dbacbee318c7c7a4f499d905b909dcf0b3400961b1142801e9f2 |
| う | Japanese_U.ogg | 2009-10-04 10:14:37 | 13,193 | 45abe18943e57e1d0bbe68e57a2a617f2ce917b5af44baf1e057390d292b231d |
| え | Ja-E.oga | 2009-10-04 10:19:48 | 21,198 | d529d33b371fd63b3edeb2e3be5e785d90d4fba66281be9b55076a477a3ee297 |
| お | Japanese_O.ogg | 2009-10-04 10:22:53 | 19,499 | daafc582b17287df5707038bdd08e43754e44c03b08b723e2afa81015155c198 |

Source description pages: [あ](https://commons.wikimedia.org/wiki/File:Ja-A.oga), [い](https://commons.wikimedia.org/wiki/File:Japanese_I.ogg), [う](https://commons.wikimedia.org/wiki/File:Japanese_U.ogg), [え](https://commons.wikimedia.org/wiki/File:Ja-E.oga), [お](https://commons.wikimedia.org/wiki/File:Japanese_O.ogg).

All original upload metadata currently attributes the recordings to uploader **Hakatanoshio117117**, uploaded October 4, 2009. Each Commons page declares the work released into the **public domain worldwide**, with a fallback unconditional grant of use where public-domain dedication is not legally effective (except conditions required by law). The repository reproduces no copyrighted license-page prose; the original descriptions remain the primary license evidence. **Uploader self-declaration is verified, but independent confirmation of ownership and jurisdictional interpretation is not.** Retain author credit and source URLs even if attribution is not obligatory.

The Commons on-page displayed durations for some files differ from the actual original Vorbis stream durations; prioritize original hashed bytes and decoded ffprobe/granule timestamps, not rounded thumbnails.

## 2. Objective decoded-signal checks (NOT linguistic review)

All original files: \`application/ogg\`, Ogg Vorbis, 2-channel stereo, 44,100 Hz; FFmpeg full-stream decoding succeeded on each. They are approximately 2.5–2.7 seconds long. The following measurements are from **decoded originals**, not edited clips:

| Kana | Stream duration (s) | Mean dBFS | Peak dBFS | Intervals of silence | Estimated quiet fraction |
|---|---:|---:|---:|---:|---:|
| あ | 2.485 | −35.6 | −9.5 | 3 | 83.7% |
| い | 2.729 | −39.0 | −18.5 | 3 | 89.9% |
| う | 2.659 | −39.1 | −19.1 | 3 | 89.5% |
| え | 2.694 | −38.0 | −12.1 | 3 | 87.5% |
| お | 2.519 | −37.4 | −15.6 | 3 | 87.2% |

**Measurement definition:** \`ffmpeg -af silencedetect=n=-45dB:d=0.15\` detects intervals where level remains below the -45 dBFS threshold for at least 0.15 s. The percentage is threshold-dependent and is *not* a claim that no relevant acoustic information exists there. The current collection has roughly 0.9-second long pauses after short audible portions, with several gaps per file. It **may** be multiple isolated utterances or processed audio separated by silence; this must be determined by actual listening. The peak-level spread of approximately 9.6 dB across files is a source of potentially inconsistent perceived volume; the low mean level is influenced by large silent sections.

**High-priority release hold:** A fast listening question needs one clear prompt at consistent loudness. Do not select a random portion, trim, change playback rate, amplify or normalize the originals for teaching until an actual Japanese speaker and sound reviewer identify and approve the intended usable region for each vowel. Document any later derivative's transformation commands and new SHA-256 separately.

Decode success does not certify pronunciation, naturalness, meaningful segmentation, intelligibility, acceptable loudness or freedom from prior recording artefacts.

## 3. Real browser decode evidence

An isolated temporary local HTTP server served original, SHA-256-verified bytes to installed browser engines in GitHub Actions.

| Engine (headless CI) | Original bytes verified via Web Crypto | HTMLAudioElement metadata | AudioContext.decodeAudioData |
|---|---:|---:|---:|
| Chromium | 5/5 | 5/5 | 5/5 |
| Firefox | 5/5 | 5/5 | 5/5 |
| WebKit | 5/5 | 5/5 | 5/5 |

This is **automated decoding**, not playback listened to through real speakers, a test on physical Safari/iOS, or an assurance that a user will hear the correct phoneme. No native app route or production audio asset was changed. Browser playback and offline behavior on actual devices remain release gates.

Reproduction: run \`python3 scripts/kana-foundations-audio-evidence.py --output /tmp/kana-vowels-review\` with FFmpeg/ffprobe available; then set \`KANA_AUDIO_REVIEW_DIR=/tmp/kana-vowels-review\` and run \`pnpm exec playwright test --config playwright.kana-audio-evidence.config.ts\`. The code does not copy media into the built app. CI artifacts are review-only and expire after seven days; the permanent identities above allow verifying a new download.

## 4. Human and ownership signoff

Use [HUMAN_AUDIO_SIGNOFF.md](HUMAN_AUDIO_SIGNOFF.md) and listen to *the exact original bytes* after checking SHA-256. Every candidate remains **PENDING** until qualified Japanese audio/phonetic signoff and independent rights approval. No persons, reviewers, sessions, perceived sound, acceptance, pronunciation grade, legal ruling or approval should be invented. See the detailed checklist for rejection/trim/replace decisions.

**HARD GATE: NO APP AUDIO INTEGRATION BEFORE SIGNOFF.**
