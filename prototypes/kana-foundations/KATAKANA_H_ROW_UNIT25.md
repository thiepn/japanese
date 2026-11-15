# Kana Foundations Unit 25 — Katakana H-row (isolated prototype)

## Exact curriculum continuity
Units 01–19 taught hiragana and reading; Units 20–24 introduced katakana vowels (5), K-row (5), S-row (5), T-row (5), N-row (5). Unit 25 adds ハ ha, ヒ hi, フ fu (Kunrei hu), ヘ he and ホ ho. Their hiragana counterparts are は・ひ・ふ・へ・ほ. The assessed word inventory uses only the 30 katakana from these six introduction units. No long vowel mark ー, small ッ, standalone nasal ン, voiced katakana, or untaught rows assessed.

## Writing and romanization precision
Standard Hepburn フ = fu, valid Kunrei フ = hu. The Japanese mora is often described phonetically as [ɸɯ]; neither English f nor English h is a perfect pronunciation substitute. Typed original recall and words containing フ accept the documented hu alternatives (フタ huta, フク huku, フネ hune), while recognition choices consistently show the Hepburn form fu. ハチ hachi also accepts the earlier valid Kunrei hati. The standalone pair ヘ (katakana) versus へ (hiragana) is explicitly assessed although many fonts make the two almost indistinguishable. This is a script-identification question with labeled choices, not a visual-only discriminability score.
Hiragana は and へ can also be pronounced wa and e when used as particles; Unit 25 teaches *isolated kana* readings, not particle grammar.

## 31 independent first attempts
Stage A (15): 5 active-hide-recall introductions, 5 sound recognition questions, 3 genuinely decodable words ハチ (bee/wasp insect context), フタ (lid) and ホタテ (scallop), and 2 script distinctions.
Stage B (16): 7 full-word readings ハコ (box), ハナ (flower), ヒト (human), フク (clothes), フネ (boat), ヘソ (navel), ホネ (bone), 5 hiragana matches and 4 meaning contrasts with explicit context.
The word meanings are genuine, but common writing differs: ハコ is ordinarily 箱, ハナ as flower is 花 (not 鼻/nose), ヒト is often 人, フク as clothing is 服 (not 福/fortune), フネ often 船 and ホネ 骨. Nature/food words ハチ (蜂), ホタテ (帆立), plus フタ (蓋) and ヘソ (臍), are accepted katakana spellings.

## Sources
- ハチ (bee/wasp/hornet): JMdict mirror https://www.japandict.com/%E3%83%8F%E3%83%81
- フタ (lid): JMdict mirror https://www.japandict.com/%E3%83%95%E3%82%BF and academic attestation https://www.i-repository.net/contents/outemon/ir/505/505250304.pdf
- ホタテ (scallop): JMdict mirror https://www.japandict.com/%E3%83%9B%E3%82%BF%E3%83%86
- ヘソ (navel): JMdict mirror https://www.japandict.com/%E3%83%98%E3%82%BD and source dictionary https://www2.ninjal.ac.jp/dictionaries/IPALBN/pdf_dir/%E3%81%B8%E3%81%9D.pdf
- The Katakana Handbook (University of Duisburg-Essen) supplies precedent for using fully decoded native words in katakana reading exercises: https://www.uni-due.de/imperia/md/content/japan/katakana_handbook.pdf

## Data and qualification gates
New independent localStorage namespace thiepn:kana-foundations:katakana-h-row:prototype-only:v1. Original wrong/assisted answers remain separately preserved from corrections, checkpoint must be acknowledged, pause/reload resumes, tampered snapshots reject and sequential competing writes fail closed. This is not a transactional or strongly atomic cross-tab lock.
No writes to original Units 01–24, Account, FSRS, StudyEvents, IndexedDB, audio or production. Only existing Unit 24 result screen gains a forward link.
Automated tests cover the engine/data and six Playwright profiles (desktop Chromium, Android, compact 320px Chromium, desktop Firefox, desktop WebKit, iOS WebKit), while physical-device acceptance, screen-reader accessibility, human Japanese editorial review and delayed learning retention remain unqualified.
