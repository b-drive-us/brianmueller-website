# Approved content sources

What each fact on the site is allowed to come from, and what Brian has already decided.

## Source hierarchy

| Rank | Source | Holds |
|---|---|---|
| 1 | The printed books | Poem text, lineation, titles, subtitles, page counts, ISBNs |
| 2 | `05 - Reference/Rooted in the Land - Event Notice.docx` | Retreat programme, venue, guides |
| 3 | The Bergamo premises agreement (retreat folder) | Rooms, meals, capacity, what is contractually promised |
| 4 | `01 - Audit/export-2026-08-29/` | Book blurbs, page counts, years, ISBNs, About/Contact/FAQ copy |
| 5 | `07 - Poem Database/collected-poems-catalog.json` | Working copy of 1,832 published poems, June 2026 |
| 6 | brianspoems.com | Public reference for poems; the site names it definitive |
| 7 | Amazon listings | The edition a buy link sells — **not** first-publication authority |
| 8 | www.brianmueller.com | Comparison only; contains known inherited errors |

**The old .com site is not an authority.** The audit confirms it repeats Jonah's description and
metadata on The Invitation's page. The beta corrected that; the correction stands.

## Book asset provenance

Covers are generated from `03 - Assets/covers-source/`, which came from
`Publishing/01 - Published Books/Covers/ebook covers/Basic Covers 2x3/` — flat fronts at a uniform
1800×2700. Regeneration command is in `03 - Assets/README.md`.

## Decisions already made (do not re-open without cause)

| Date | Decision |
|---|---|
| 2026-08-28 | Poems live at brianspoems.com; brianmueller.com is the author site |
| 2026-08-28 | Drop all YouTube links and embeds; keep only the ~35 images used on live pages |
| 2026-08-29 | The 915 `/living-workshop/` posts are archived, not migrated (`08 - Blog Archive/`) |
| 2026-08-29 | A curated selection of eleven poems on the site; the archive stays definitive |
| 2026-08-29 | Books are standalone purchases and also grouped into three series |
| 2026-08-29 | Every book links through Brian's own affiliate tag `digitalalphab-20` |
| 2026-08-30 | Trust Stillness: published 23 May 2026, ISBN 979-8195992392 (check digit valid) |
| 2026-08-30 | Retreat Friday: arrive 4:00, rooms by 5:00, dinner 6:00, first session ~7:00 |
| 2026-08-30 | Dayton and Beavercreek are interchangeable for the venue at ZIP 45430 |
| 2026-08-30 | Tom Sparough approved his own biography |
| 2026-08-30 | Collection agent agreement signed by the Acting President, Ohio Illuman Board — **superseded 2026-09-19 by D-39: Brian owns the retreat and collects the fees himself, so the site depends on no agency relationship. The signing is left on the record because it happened; it is simply no longer load-bearing.** |

## Known fabrications to remove

| Where | What | Status |
|---|---|---|
| `retreat.astro:87` | "Four hundred and fifty acres" — invented, source says 150 | F06.1, open |
| `retreat.astro:87` | "forty minutes from downtown Dayton" — invented, source says near the airport | F06.2, open |

Both were introduced during authoring on 2026-08-30 with no source. Any other unsourced specific
number on the retreat page should be treated as suspect until checked against the event notice.
