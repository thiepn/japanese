# Japanese source-pack format

P6 source packs provide a controlled way to import learner-owned or redistributable Japanese corpora without copying them into the canonical public seed.

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
        "nativeSpeaker": true
      }
    }
  ]
}
```

## Admission rules

The importer requires a Japanese manifest, source URL, declared pack license and `redistributable: true`. It rejects noncommercial and no-derivatives licenses on the redistributable route. Attribution-compatible licenses require explicit attribution text.

Text and audio are licensed independently. A pack can be valid with no audio. An audio attachment is admitted only when it has a reusable license, credit and explicit `nativeSpeaker: true`; attribution-required audio also needs an attribution URL.

The importer never infers native-speaker status from a Japanese language tag, filename, host or URL. Device speech synthesis can be used as a labeled fallback but does not become native audio.

## Learner-data boundary

Imported source-pack items are saved as account-scoped private documents. Importing a redistributable pack does not silently publish it into `content/seed/jp-core.json`, create canonical mastery, or bypass the normal StudyEvent and mining paths.

Canonical publication is a separate editorial action: content must be reviewed, assigned stable canonical IDs, linked to source records, validated and included in the public package deliberately.

## Recommended pack granularity

Prefer coherent sentence/dialogue/passage items that can be studied independently. Keep provenance at the pack level and use an item-specific `sourceUrl` when the exact sentence or recording has its own source page.

For connected listening, prefer one recording per coherent item. Do not splice unrelated recordings and then label the result as a native passage recording without source and editing rights.
