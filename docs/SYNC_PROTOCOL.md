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


## P22 production status

The protocol adapter and durable local outbox are implemented, but production cross-device workspace sync is not activated in the current P22 release line. The shared Core gateway does not yet expose the generic Sync v1 push/pull/bootstrap routes required by this adapter.

Current behavior:

- THIEPN Account authentication is real and canonical.
- Japanese Account connection state is real.
- Japanese can publish its privacy-minimal language read model to Core.
- StudyEvents are written atomically to local IndexedDB and the Core-compatible outbox.
- The outbox is not currently uploaded to a production Sync v1 endpoint.
- Private documents, mined vocabulary/sentences, media-review records and private prosody captures remain device-local.
- The THIEPN Account app manifest therefore advertises `sync:false` and `cloud_saves:false` until a complete, tested transport exists.

Account identity must not be presented as evidence that learner data has been cloud-saved. Future sync activation requires a separately certified transport, reconciliation policy, deletion/lifecycle behavior and user-facing status.
