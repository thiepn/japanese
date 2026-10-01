# Sync Protocol v1

The client is local-first. Mutations commit locally, append an outbox operation, and synchronize later.

Requirements:

- idempotent operation IDs
- append-only StudyEvent merge
- cursor-based pull synchronization
- explicit protocol version
- conflict policy by data type rather than universal last-write-wins
- concurrent stale reviews must never double-advance a memory schedule
- account switch must partition local personal data
