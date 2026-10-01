# Roadmap

## P0 — Production Foundation, Contracts & Architecture Freeze

**Complete.** Repository structure, shared contracts, StudyEvent model, learner reducer, FSRS adapter, account-scoped persistence, Core Sync v1 mapping, persistent browser content DB, PWA/offline verification, source/licensing registry and the 食べる vertical architecture proof are established.

Shared THIEPN Account session handoff and production Core transport remain platform-owned integration dependencies; Japanese must not reimplement them.

## P1 — Foundation Learning Engine & Study Player

P1.3 completed the kana system and event-derived mastery model.

P1.4 adds a canonical source-provenanced starter lexicon, persistent lexeme/sense/kanji storage, kanji-in-vocabulary teaching, staged meaning→reading→active-use evidence, and one Today queue that interleaves words with kana without immediately tripling review load.

### Next: P1.5 — Foundation Audio, Listening & Mobile Certification

Add real audio assets/provider contracts, mora and length discrimination, kana/word listening evidence, replay/shadow controls, offline audio caching, and a dedicated phone-size interaction audit. Finish with a P1 release-candidate burn-in on real mobile browser/PWA behavior.

P1 milestone: a complete beginner can install the app, learn first Japanese through one Study Player, leave, return later, and receive correctly scheduled continuation from the same learner model.

## Later

P2+ expands Reader/listening depth, A2→B1 immersion transition, private-source ingestion, production skills, AI conversation/writing and advanced assessment only after the unified learner loop is stable.
