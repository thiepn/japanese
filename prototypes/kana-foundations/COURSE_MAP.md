# Kana Foundations course map

A read-only map for 27 existing Kana Foundations prototype lessons. It reads each unit's dedicated prototype-only localStorage key and validates it with that unit's own engine. No Account, IndexedDB, FSRS, StudyEvents or backup writes or migrations.

Unit 01 is considered complete only at its original results phase, or during later optional practice with all original readings recorded. Corrections and optional practice are never portrayed as mastery. Invalid and inaccessible saved data is identified rather than overwritten. The next-lesson link prioritizes unfinished work, then earliest unstarted.

Open `course-map.html`, or follow the added navigation on Unit 01 and Unit 27 welcome/results pages. This is not a production route. Test with the prototype Node suite and six Playwright profiles. No deployment, merge, release or physical-device qualification authorized.

Course-map unit numbers are anchored to existing HTML `<title>` numbering (especially reading-review Unit 11, sokuon Unit 15, yōon Units 16–18), checked by a Node regression test rather than assigning IDs from an assumed pedagogical order.

Units 02–26 now display a small **All units** return link in the top bar only when paused or completed. Active questions retain the existing Exit action; use Exit to save and then return to the map. Unit 01 and Unit 27 keep their existing welcome/results course-map links. This is navigation-only; no persistence or grader changes.
