# Kana Foundations course map

A read-only map for 27 existing Kana Foundations prototype lessons. It reads each unit's dedicated prototype-only localStorage key and validates it with that unit's own engine. No Account, IndexedDB, FSRS, StudyEvents or backup writes or migrations.

Unit 01 is considered complete only at its original results phase, or during later optional practice with all original readings recorded. Corrections and optional practice are never portrayed as mastery. Invalid and inaccessible saved data is identified rather than overwritten. The next-lesson link prioritizes unfinished work, then earliest unstarted.

Open `course-map.html`, or follow the added navigation on Unit 01 and Unit 27 welcome/results pages. This is not a production route. Test with the prototype Node suite and six Playwright profiles. No deployment, merge, release or physical-device qualification authorized.

Course-map unit numbers are anchored to existing HTML `<title>` numbering (especially reading-review Unit 11, sokuon Unit 15, yōon Units 16–18), checked by a Node regression test rather than assigning IDs from an assumed pedagogical order.

Units 02–26 now display a small **All units** return link in the top bar only when paused or completed. Active questions retain the existing Exit action; use Exit to save and then return to the map. Unit 01 and Unit 27 keep their existing welcome/results course-map links. This is navigation-only; no persistence or grader changes.

## Local backup export

The course map provides **Download local progress**. The export reads all 27 verified, separate prototype localStorage keys fresh on click. Version 1 JSON contains format, version, createdAt, and records with unitId, exact key, and verbatim raw string. Absent keys are omitted; malformed/incompatible saved records are included byte-for-byte. The operation makes no storage, network, Account or FSRS writes. Unavailable keys or a failed read block the entire export rather than misleadingly saving an incomplete backup. An empty browser does not download a file. Export does not offer restore/import and is not cross-device synchronization. Test Node unit cases and Playwright downloads in all six projects.

## Read-only first-attempt review

`review.html` presents one source-authored difficult first-attempt prompt at a time (wrong, assisted, or revealed). The answer, note and meaning come from the existing original lesson task definitions; the answer is concealed by default. Learners can filter units and move between prompts without changing lesson evidence. The review excludes correction rounds, practice-only answers, unassessed skips and unapproved listening exercises. Unit 01 uses its existing vowel and word records. Invalid or unavailable snapshots are not overwritten. No grading, mastery inference, IndexedDB, Account or FSRS writes.

## Self-check rounds (in-memory only)

First-attempt review now supports optional self-rating after revealing the source-grounded answer: **I remembered** or **Review again**. Each rating moves to the next card, with a Round summary of self-reported remembered/again/skipped. **Retry missed or skipped** repeats only not-remembered prompts; **Review all again** restarts the selected unit scope. Unrated navigations count as skipped. Filtering starts a fresh in-memory round; refreshing the page discards ratings. There is no grading, FSRS scheduling, Account storage, IndexedDB, extra localStorage data or saved mastery claim. The original read-only first-attempt evidence remains unchanged.


## Optional typed response before reveal

On every review card, learners may enter kana, romaji or free text using the native IME-friendly input. The response is kept verbatim in memory and frozen on the card's first answer reveal, so the initial attempt is available for manual comparison. Returning to a card keeps its response within the current round; a new round, filter change or page reload clears drafts and attempts. Source-authored alternate answer spellings (when present) appear alongside the reference answer, but the app does not generate alternative pronunciations, score approximate matches or infer comprehension. Blank responses still allow reveal and self-rating. This feature does not write localStorage, IndexedDB, Account, FSRS, lesson records or backups.
