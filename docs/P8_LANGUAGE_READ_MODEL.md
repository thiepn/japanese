# P8 Language Read Model

Japanese now exposes a privacy-minimal P8 language read model through:

`apps/web/src/languageReadModel.ts`

Platform pin:

- `thiepn/languages@e74a10aa9d9d161c7f427ce7691be32df4bbc31c`
- read model package: `0.8.0`
- contract: `p8-read-model-v1`

## Authoritative inputs

The producer reads existing Japanese state only:

- Today workload from `getStudySummary()`;
- kana/vocabulary/grammar/sentence/lexical-fluency summaries;
- course-unit progress;
- A1/B1/B2/C1-foundation milestone diagnostics;
- StudyEvents only long enough to calculate activity counts, streak and last-study time.

It does not change those systems.

## Projection

The emitted snapshot contains:

- due/new/practice/course workload;
- today and seven-day activity counts;
- streak and last-study timestamp;
- kana/vocabulary/course progress counters;
- scoped internal proficiency dimensions;
- current/frontier internal milestone labels;
- one Today-queue next action.

## Privacy

The snapshot never contains:

- StudyEvents;
- account/user IDs;
- FSRS traces;
- answers/responses;
- private documents;
- private vocabulary/sentences.

The shared P8 validator rejects those fields if they appear.

## Proficiency scope

Milestones are reported as:

`THIEPN Japanese internal communicative milestones`

with claim type `internal`.

They are not converted into accredited CEFR certification.

## Authority

Japanese remains authoritative for queue construction, StudyEvents, FSRS, mastery, course state, milestone evaluation and sync.

P8 only projects a read model for Hub consumption.

Cross-device persistence of this projection is deferred to P9.
