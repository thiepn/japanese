# Roadmap

## P0 — Production Foundation, Contracts & Architecture Freeze

**Complete.** Repository structure, shared contracts, StudyEvent model, learner reducer, FSRS adapter, account-scoped IndexedDB state, Core Sync v1 mapping, persistent browser SQLite content/search, source/licensing validation, PWA/offline verification and architecture documentation are established.

Shared THIEPN Account session handoff and production Core transport remain platform-owned integration dependencies; Japanese must not reimplement them.

## P1 — Foundation Learning Engine & Study Player

P1.3 completed the kana system and event-derived mastery model.

P1.4 added a canonical source-provenanced starter lexicon, persistent lexeme/sense/kanji storage, kanji-in-vocabulary teaching, staged meaning → reading → active-use evidence, and one Today queue that interleaves words with kana without immediately tripling review load.

P1.5 adds pinned native pronunciation recordings for the starter lexicon, browser audio caching, independent vocabulary-listening evidence, mora-timing perception for っ / ッ / long vowels / ん, replay/slow/shadow controls, mobile-safe Study Player ergonomics and a repeated desktop/mobile Chromium certification matrix.

### P1 release gate

Automated implementation and browser certification can be closed by CI. The final physical-device gate remains deliberately separate because emulation cannot prove hardware audio, real PWA installation or OS interruption behavior. Use `docs/P1_5_MOBILE_CERTIFICATION.md`.

## Next: P2 — Grammar, Sentence Knowledge & Structured A1 Course

P2 should move from isolated Foundation entities to reusable sentence-backed grammar and capability lessons while keeping the same learner state. The first P2 slice should establish canonical grammar objects, sentence/entity linking, prerequisite/contrast relations, controlled contextual exercises and a real A1 lesson graph. It should not create a separate grammar progress system.

## Later

P3+ expands Reader/listening depth, A2 → B1 immersion transition, private-source ingestion, production skills, AI conversation/writing and advanced assessment only after the unified learner loop is stable.
