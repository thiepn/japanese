# Japanese source-pack format

P8 source packs provide a controlled way to import learner-owned or redistributable Japanese corpora without copying them into the canonical public seed.

## File shape

A source pack is a UTF-8 JSON file:

```json
{
  "manifest": {
    "id": "example-dialogues",
    "title": "Example Japanese Dialogues",
    "version": "1.0.0",
    "language": "ja",
    "sourceUrl": "https://example.org/japanese",
    "licenseName": "CC BY 4.0",
    "attribution": "Example Author",
    "redistributable": true
  },
  "items": [
    {
      "id": "dialogue-001",
      "title": "At work",
      "text": "A：この制度に関して、どう思いますか。\nB：便利になる一方で、課題もあります。",
      "sourceUrl": "https://example.org/japanese/dialogue-001",
      "audio": {
        "url": "https://example.org/audio/dialogue-001.mp3",
        "credit": "Example Speaker",
        "licenseName": "CC BY 4.0",
        "attributionUrl": "https://example.org/audio/dialogue-001",
        "externalId": "dialogue-001-audio",
        "nativeSpeaker": true,
        "speechRate": "natural",
        "register": "polite",
        "speakerLabel": "Speaker A",
        "segments": [
          {
            "id": "turn-a",
            "text": "この制度に関して、どう思いますか。",
            "startMs": 0,
            "endMs": 3200
          },
          {
            "id": "turn-b",
            "text": "便利になる一方で、課題もあります。",
            "startMs": 3200,
            "endMs": 6900
          }
        ]
      },
      "audioVariants": [
        {
          "url": "https://example.org/audio/dialogue-001-casual.mp3",
          "credit": "Example Speaker B",
          "licenseName": "CC BY 4.0",
          "attributionUrl": "https://example.org/audio/dialogue-001-casual",
          "externalId": "dialogue-001-casual",
          "nativeSpeaker": true,
          "speechRate": "fast",
          "register": "casual",
          "speakerLabel": "Speaker B"
        }
      ]
    }
  ]
}
```

## Admission rules

The importer requires a Japanese manifest, source URL, declared pack license and `redistributable: true`. It rejects noncommercial and no-derivatives licenses on the redistributable route. Attribution-compatible licenses require explicit attribution text.

Text and audio are licensed independently. A pack can be valid with no audio. Every audio attachment or `audioVariants` entry is admitted independently and must have a reusable license, credit and explicit `nativeSpeaker: true`; attribution-required audio also needs an attribution URL.

P8 audio variants may additionally declare `speechRate` (`slow`, `natural`, `fast`), `register` (`casual`, `neutral`, `polite`, `formal`) and a learner-facing `speakerLabel`. These fields describe the source recording; they do not change playback rate, infer speaker identity or alter licensing. Multiple variants should use distinct recording identities.

The importer never infers native-speaker status from a Japanese language tag, filename, host or URL. Device speech synthesis can be used as a labeled fallback but does not become native audio.

### Timed segments

An admitted native recording may optionally include `segments`. Every segment requires a stable `id`, the Japanese `text` heard in that interval, and millisecond `startMs` / `endMs` bounds. Timings must be positive, ordered and non-overlapping. The reader uses these bounds for sentence/turn replay and slow replay without creating edited audio copies.

Segment timing is navigation metadata. It does not change the license of the recording, prove native-speaker status, or create pronunciation evidence.

## Learner-data boundary

Imported source-pack items are saved as account-scoped private documents. Importing a redistributable pack does not silently publish it into `content/seed/jp-core.json`, create canonical mastery, or bypass the normal StudyEvent and mining paths.

Canonical publication is a separate editorial action: content must be reviewed, assigned stable canonical IDs, linked to source records, validated and included in the public package deliberately.

## Recommended pack granularity

Prefer coherent sentence/dialogue/passage items that can be studied independently. Keep provenance at the pack level and use an item-specific `sourceUrl` when the exact sentence or recording has its own source page.

For connected listening, prefer one coherent source recording per variant. P8 can retain several independently licensed variants of the same text so learners can compare natural speed/register/speaker conditions. Add timed segments when the original recording can be replayed at sentence/turn boundaries. Do not splice unrelated recordings and then label the result as a native passage recording without source and editing rights.


## P9 release-inventory use

P9 can use source-pack recordings toward a deployment's native-listening release inventory only after normal source-pack validation succeeds.

Release inventory counts are descriptive operational metadata:

- one source document can contain several independently licensed recording variants;
- each recording keeps its own credit/license/attribution/native-speaker declaration;
- speaker coverage is derived from explicit speaker labels when supplied, otherwise from recording credit;
- register coverage uses explicit `register` metadata;
- source-rate coverage uses explicit `speechRate` metadata;
- device speech synthesis never contributes to native inventory counts.

The P9 release contract intentionally stays blocked when these verified fields are missing or the inventory is too small.
