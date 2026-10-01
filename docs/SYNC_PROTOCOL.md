# Sync Protocol

Japanese does not define a parallel private-data sync protocol.

It conforms to **THIEPN Core Sync Protocol v1** and uses the **Event Sync v1** primitive for immutable StudyEvents.

## Mapping

- `app_id`: `japanese`
- StudyEvent primitive: `event`
- resource type: `study_event`
- event type: `study.event`
- StudyEvent ID is client-generated before upload and is reused as the append mutation/resource identity
- authenticated ownership is derived by Core; `userId` is deliberately stripped from the wire payload
- local cursors are opaque strings and are persisted only after changes are durably applied
- realtime is optional and never required for convergence

Local writes commit to IndexedDB and the Core-compatible outbox in one transaction. Production transport will target the shared Core gateway rather than a Japanese-specific private sync backend.

The in-repo in-memory sync store is a conformance/test harness only.
