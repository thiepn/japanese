# Third-party notices

## WaniKani / Tofugu Japanese Vocabulary Pronunciation Audio

Vocabulary pronunciation recordings are served from the public
`tofugu/japanese-vocabulary-pronunciation-audio` repository, pinned to commit
`9725e0e7d628ab616e8b14e126d3daa33eba8d36`.

- Authors/credit: **Tofugu and WaniKani**
- License: **Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)**
- Source: https://github.com/tofugu/japanese-vocabulary-pronunciation-audio
- Use in Japanese: unmodified pronunciation recordings are referenced by immutable source URL and may be cached locally on the learner's device for offline playback.

The application code and THIEPN-authored learning content are not relicensed by
the presence of these separately licensed audio recordings. Any redistributed
copy of an audio recording remains subject to its CC BY-SA 4.0 terms.


## Tatoeba runtime sentence/audio import

P4 can import a Japanese Tatoeba sentence by user-supplied sentence ID at runtime.

- Source: https://tatoeba.org/
- Sentence text: Tatoeba's default sentence-text license is CC BY 2.0 FR unless a specific item/source says otherwise.
- Audio: licensing is per recording and is **not** inferred from the sentence-text license.
- Admission policy: the app attaches a recording only when the Tatoeba audio metadata declares a reusable license accepted by the runtime policy (for example CC0/public-domain or attribution/share-alike licenses). Missing-license, NC and ND recordings are rejected from the reusable-audio path.
- Attribution: when audio is admitted, the private import stores the recording credit, declared license, source/attribution URL and external audio ID.

Tatoeba imports are learner-initiated private documents. They are not copied into the public canonical seed package by the runtime importer.

## Mozilla Common Voice

Mozilla Common Voice was evaluated as a possible Japanese native-speech source. P4 does not mirror or bundle Common Voice dataset material in this repository. Dataset acquisition and redistribution remain outside the app's public content package.
