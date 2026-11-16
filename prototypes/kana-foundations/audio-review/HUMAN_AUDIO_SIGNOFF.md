# Independent human audio approval form — unfilled

**No approval has been obtained.** This is a blank checklist; do not fabricate reviewer identity, qualifications, oral impressions, credentials, acoustic corrections, decision dates or rights clearance.

## Reviewer eligibility and identity

**Japanese-language content / phonetics reviewer:** A proficient Standard Japanese speaker with demonstrable teaching, linguistic or pronunciation-training experience. Record name, relevant qualification and contact in **access-controlled internal records only**, not in public GitHub.

**Independent rights reviewer:** An authorized reviewer familiar with reuse permissions in the intended release jurisdictions. Verify both the published public-domain dedication and whether the uploader had authority to make it; a Commons badge alone is not conclusive legal evidence.

**Audio engineering reviewer (if editing):** Familiar with speech recording, clipping, noise, loudness, mono/stereo playback, cutting boundaries and output compatibility.

Provide controlled review-record ID and signed date when reviews *actually occur*. Do not publish private signature or identity in this repository.

## Mandatory listening sequence (one original per vowel)

1. Download the review-only original artifact or retrieve the original exact Wikimedia Commons upload and verify its SHA-256 against [ORIGINAL_AUDIO_EVIDENCE.md](ORIGINAL_AUDIO_EVIDENCE.md).
2. Listen at normal speed through suitable headphones/speakers; do not assume metadata descriptions prove the phoneme.
3. Identify the actual sound and number of separate utterances. Determine whether any repeated utterances/pauses make it unsuitable as a one-click beginner sound, or might cause test leakage by rhythm/pattern.
4. Verify Standard Japanese quality: intended vowel identity and distinction against all four neighboring vowels, naturalness, length, lip/acoustic cues where audible, absence of misleading syllable transitions.
5. Listen for unwanted speech, artifacts, noisy background, clicks, clipping, harsh fade, long trailing silence and substantial level inconsistency across the five originals. Automated peak and threshold readings are just screening evidence.
6. Decide **ACCEPT_UNMODIFIED**, **EDIT_AND_REVIEW_NEW_BYTES**, or **REJECT_AND_REPLACE**. If editing, independently approve the exact start/end regions and gain, preserve originals, produce a reproducible transform and new hash, and repeat the whole signoff on the derivative. No transformations before explicit approval.
7. Test the approved *exact bytes* on Chrome, Firefox and Safari/iOS on physical devices, both online and offline. Screen-reader and other accessibility checks remain separate.
8. Independently verify the copyright owner's public-domain declaration, file history/version identity and any jurisdictional restrictions; preserve source attribution/provenance.

## Item-by-item signoff worksheet

| Kana | Original SHA-256 prefix | Actual voiced sound identified? | Repetition/pauses acceptable? | Level/noise acceptable? | Japanese reviewer verdict | Rights reviewer verdict |
|---|---|---|---|---|---|---|
| あ | 37d8b51acbde | PENDING | PENDING | PENDING | PENDING | PENDING |
| い | 39a55eee1bd2 | PENDING | PENDING | PENDING | PENDING | PENDING |
| う | 45abe18943e5 | PENDING | PENDING | PENDING | PENDING | PENDING |
| え | d529d33b371f | PENDING | PENDING | PENDING | PENDING | PENDING |
| お | daafc582b172 | PENDING | PENDING | PENDING | PENDING | PENDING |

Record each actual decision and its justification, review ID, date, full-file hash, and any approved edited derivative's new hash **only after the reviews occur**. For rejected assets, document specific phonetic or acoustic reasons without claiming the app verified them automatically.

## Final integration decision (all blank)

- [ ] Genuine Japanese-speaker/phonetic reviewer has explicitly approved **all five actual source/derived files**.
- [ ] Audio engineer has approved any level normalization, crop or other derivatives, with reproducible transformations and new hashes.
- [ ] Rights reviewer has approved exact versions and usage for the proposed distribution jurisdictions.
- [ ] Actual Android/iOS/desktop audio playback and offline fallback have been verified.
- [ ] Product owner has separately authorized integrating media into a *new isolated draft*; no production release or canonical FSRS changes are implicit.
- [ ] Reference manifest and release gate were revalidated against exact build HEAD.

**No boxes above are checked as of November 5, 2026. NO RELEASE OR MEDIA INTEGRATION.**
