# J16C — Reader entry and return-scroll defect

The J15D visual-evidence Reader screenshots showed the content scrolled into the latter part of the article immediately after opening a text from Immerse. `Immersion.tsx` previously replaced the scrolled catalogue with Reader without resetting the document position.

The repair captures the catalogue scroll offset, resets Reader to the top before paint, focuses the article heading (programmatically focusable with `tabIndex={-1}`), and restores the saved catalogue position after closing Reader. It does not change progress, learning/mastery, audio, account, or data storage.

The new Playwright regression visits the scrolled Immerse catalogue and verifies the Reader heading is visible/focused at the top, then that returning restores a scrolled catalogue. The test runs in desktop, Android emulation and compact-mobile Chromium. Real Android/TalkBack evaluation remains pending under J16B.

This is a new intentional J16C UX repair, not an assertion of pixel identity with the prior J15D source SHA. The repaired build must pass its own CI; hardware acceptance and release signoff remain separate.
