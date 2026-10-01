# StudyEvent Specification

StudyEvent is the durable evidence record for learner activity.

Properties:

- immutable after append
- globally unique client-generated ID
- device and user scoped
- records primary and secondary language targets separately
- identifies the skill dimension being tested
- preserves prompt/result/hints/attempts/latency when relevant
- records model/content/scheduler versions where interpretation depends on them
- survives offline operation and can be replayed to rebuild learner projections

Displaying an entity is not equivalent to retrieval. A lookup indicates an encounter and uncertainty, not mastery. Hinted success must preserve the initial retrieval failure.
