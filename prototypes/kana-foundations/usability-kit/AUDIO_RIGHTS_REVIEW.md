# Five-vowel audio candidate review — license verified, pronunciation NOT approved

**Research date:** November 5, 2026. **Scope:** only あ, い, う, え, お. **Status:** five original files downloaded into a temporary review-only CI artifact and SHA-1/SHA-256 verified, but nothing bundled, shipped, approved or integrated; no native-speaker auditory review or approval. See [original-byte forensic report](../audio-review/ORIGINAL_AUDIO_EVIDENCE.md) and [blank human signoff](../audio-review/HUMAN_AUDIO_SIGNOFF.md).

## Five individually checked Commons file pages

All five pages describe one intended hiragana vowel and identify an original recording by **Hakatanoshio117117**, dated October 4, 2009. Each page contains the creator's declaration releasing that recording into the **public domain** (with an unconditional worldwide use grant where public-domain dedication cannot operate). This is a primary-source *published rights declaration*, not a substitute for final legal review or proof of pronunciation quality.

| Kana / target | Exact Commons source page | Original stream duration (verified with ffprobe) | Rights on file page | Human review |
|---|---|---:|---|---|
| あ / a | https://commons.wikimedia.org/wiki/File:Ja-A.oga | 2.485 s | Author-declared public domain | PENDING |
| い / i | https://commons.wikimedia.org/wiki/File:Japanese_I.ogg | 2.729 s | Author-declared public domain | PENDING |
| う / u | https://commons.wikimedia.org/wiki/File:Japanese_U.ogg | 2.659 s | Author-declared public domain | PENDING |
| え / e | https://commons.wikimedia.org/wiki/File:Ja-E.oga | 2.694 s | Author-declared public domain | PENDING |
| お / o | https://commons.wikimedia.org/wiki/File:Japanese_O.ogg | 2.519 s | Author-declared public domain | PENDING |

**Duration caveat:** The Commons page display on some files uses shorter or rounded durations; the table now uses verified original Vorbis decoded durations, not the page's presentation metadata. Each original has three long detected silent intervals, so pedagogical suitability remains a hard hold.

**Provenance caveat:** \`File:Japanese_A.ogg\` redirects to \`File:Ja-A.oga\`; \`File:Japanese_E.ogg\` is also a redirect rather than an independent asset. Preserve the *actual source file names* above when retrieving content. Do not silently use similarly named alternative \`Ja-U.oga\`, \`Ja-O.oga\`, etc., which may be different authors, recordings and dates.

## Do not use: the Japan Foundation Marugoto recordings

Published rights:
- https://marugoto.jpf.go.jp/en/copyright/
- https://marugoto.jpf.go.jp/en/sitepolicy/

The Foundation does **not** permit downloading, cutting/modifying and redistributing its audio to app users; classroom usage and personal study exceptions do not authorize publishing the sounds as app assets. Do not copy Marugoto audio from any of the supplied learner/reference PDFs or affiliated sites into the prototype.

## Human-language and rights release gates (ALL pending)

Independent Japanese speaker / qualified language educator must listen to the **actual original audio bytes**, *not a TTS reconstruction*:
- [ ] The speaker actually says the designated isolated kana sound; identify whether sustained vowel / repeated syllable / extraneous phonetic context.
- [ ] Sound is intelligible, accurate for modern Standard Japanese, correctly differentiated from neighboring vowels and not misleading to absolute beginners.
- [ ] Recording is natural enough for **listening assessment**, not merely a spelling demonstration; no severe noise, clipping, unwanted speech or inconsistent gain.
- [ ] The five recordings' pace, loudness, duration and presentation are coherent. Any proposed trimming, normalization or transcoding must have a documented decision, be justified and be reproducible.
- [ ] Retain original file SHA-256, downloaded byte size, source file history version, review date, file page, author and license text in a future reviewed media manifest.
- [ ] Verify browser-decode compatibility (Ogg/MP3 as appropriate) on real Chromium/Firefox/WebKit, including offline behavior and fallback. Do not present a playable state until actual playback succeeds.
- [ ] Independent rights reviewer confirms creator's public-domain dedication and use in the planned distribution jurisdictions. Preserve an author/Commons credit even where attribution is not legally required (good provenance practice).
- [ ] Review signoff is documented with genuine date, reviewer identity in controlled internal records, and verdict. **Do not fill any placeholder with fabricated credentials.**

No browser speech-synthesis output, automated media-duration check, public-domain label or text description alone can substitute for listening/linguistic evaluation. The app currently uses clearly labeled device TTS and remains on hold for verified recordings.

## Decision table

| Candidate class | May research? | May bundle into shipped app now? | Reason |
|---|---|---|---|
| Above author-declared public-domain Commons originals | YES | **NO — pending auditory + rights release gates** | Rights declaration verified, acoustic suitability unverified |
| Official Marugoto audio | YES | **NO** | Redistribution/editing restrictions |
| Device-native Japanese speech synthesis | Already in prototype | Not as verified pronunciation/audio assessment | Voice and output differ across browsers/devices |
| Newly commissioned Japanese-speaker vowel recordings | YES | After explicit reuse grant and quality review | Would give clearer chain of rights and consistent quality |

**No audio files were committed, bundled in application assets, configured for lesson playback, or deployed. Original bytes exist only in short-lived, explicitly review-only CI artifacts and are not an approval of teaching suitability.**
