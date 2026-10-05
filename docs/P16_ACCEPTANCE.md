# P16 Acceptance — C1 Research Quality, Bibliography, Human Review & Specialist Tracks

## Status

**Implementation complete.**

P16 deliberately deepens the P15 authentic C1 environment instead of adding another score, badge or parallel mastery store.

## Implemented

- Structured bibliography metadata for every registered P15 source: author/responsible person, organization, publication date, access date, container title, DOI and the exact source URL.
- Deterministic citation rendering in Japanese research-note, APA-like and compact display styles.
- A source vault for learner-supplied excerpts with explicit distinction between **private reference** and **redistributable/licensed** material.
- No automatic scraping or copying of external pages into the canonical content package.
- Redistributable excerpts require explicit license metadata; private excerpts remain local learner material.
- Reviewer packets bind the P15 thesis, first draft, delayed revision, defenses, source map and bibliography to one immutable review payload.
- Human review uses four 0–4 dimensions: argument control, source use, language precision and register control.
- Human review is attached to the exact draft/revision timestamps and remains non-mastery, non-CEFR evidence.
- Interest-driven specialist tracks connect the learner's real sources, mined specialist terms and C1 projects without inventing a new proficiency score.
- P16 state remains event-derived from the existing StudyEvent stream.
- The existing C1 portfolio advances to schema v3 and carries P16 bibliography, excerpt, human-review and specialist-track evidence without creating a separate progress authority.

## Evidence boundary

P16 improves evidence quality, provenance and reviewability. It does **not** claim that:
- a formatted citation proves the source was interpreted correctly;
- a pasted excerpt is redistributable unless the learner explicitly records a license;
- a human reviewer score is an accredited CEFR result;
- reviewer feedback should automatically change FSRS scheduling or durable mastery;
- a specialist track is equivalent to subject-matter expertise.

P11 remains an independent release-evidence track and may remain held until its external-review admission requirement is actually satisfied.

## Acceptance checks

- P16 unit coverage verifies bibliography rendering, event-derived quality state and artifact-bound review packet generation.
- The portable C1 JSON/Markdown portfolio exposes P16 research-quality evidence with the new evidence-boundary flags.
- Browser coverage verifies the P16 workspace, all four quality areas and the no-scraping/no-new-mastery boundary.
- Existing P15 source registration, source evaluation, multi-day writing, defense and delayed revision remain authoritative prerequisites.
- The canonical public content package is not populated from arbitrary external documents.
