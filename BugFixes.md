# Bug Fix Log

This document tracks bugs that have been fixed in the Deluge Next project. Each entry should include the date, a description of the bug, how it was fixed, and who contributed to the fix.

## Format

```
## [YYYY-MM-DD] Bug Title

**Description:**
Brief description of the bug

**Fix:**
Explanation of how the bug was fixed

**Fixed by:** @username (if applicable)

**Related Issue:** #issue-number (if applicable)
```

## Bug Fixes

<!-- Add new bug fixes at the top -->

## [2025-05-20] Fixed Progress and Speed Calculation for Active Torrent Speed Polling

**Description:**
The progress values for torrents were incorrectly calculated, causing inaccurate display of download progress and speed information in the UI.

**Fix:**
Modified the code to properly calculate and normalize the progress values by dividing by 100 to convert from percentage to decimal format. Also ensured that speed calculations for seeding, downloading, and checking torrents were all handled consistently.

**Fixed by:** @JokeJason

---

## [2025-05-20] Initial Bug Fix Log Created

**Description:**
Created initial bug fix log for tracking resolved issues

**Fix:**
Added BugFixes.md to repository

**Fixed by:** GitHub Copilot

---

## How to Use This Log

When fixing a bug:

1. Add a new entry at the top of the bug fixes section
2. Use the date format YYYY-MM-DD
3. Write a clear title for the bug
4. Provide enough detail that someone unfamiliar with the issue can understand what was wrong and how it was fixed
5. Credit contributors when applicable
6. Reference relevant GitHub issues or PRs
