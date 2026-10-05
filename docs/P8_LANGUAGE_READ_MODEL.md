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
- P14 C1 autonomy/reliability portfolio summaries;
- StudyEvents only long enough to calculate activity counts, streak and last-study time.

It does not change those systems.

## Projection

The emitted snapshot contains:

- due/new/practice/course workload;
- today and seven-day activity counts;
- streak and last-study timestamp;
- kana/vocabulary/course progress counters;
- C1 autonomy missions completed, reliable production-artifact count, and C1 active evidence days;
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


## Producer refresh after P14

The transport remains `p8-read-model-v1`; the envelope did not need a schema change.

Producer revision `japanese-p8-read-model-v2` additionally consumes the current P14 portfolio summary and exposes only aggregate C1 progress metrics. It does **not** export portfolio responses, artifacts, StudyEvents, or raw reliability evidence.

C1 autonomy/reliability is intentionally presented as progress evidence rather than being converted into a synthetic C1 proficiency score.

Verification continues to use the unchanged `p8-read-model-v1` privacy and authority guarantees.
