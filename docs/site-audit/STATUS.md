# STATUS

| | |
|---|---|
| **Stage** | Prompts 00-04 complete. Prompt 05 (design and accessibility) is next. |
| **Repository** | `github.com/b-drive-us/brianmueller-website`, working copy at `Publishing/brianmueller-website/06 - Site` |
| **Branch** | `audit/2026-09`, **unpushed**. `main` and `origin/main` both still at `8ea45e5`. |
| **Candidate commit** | `8ea45e5` — "Fix two layout bugs the audit turned up" (2026-08-30) |
| **Deployed beta** | `https://brianmueller.org`, Cloudflare Worker `brianmueller-website`, last modified **2026-08-30T19:10:16Z** |
| **Divergence** | **None.** Built stylesheet hash `about.4CFqJ8S2.css` is byte-identical to the one the live site serves. |
| **Baseline build** | `npm run build` → exit 0, 29 HTML files (28 published pages + `404.html`), Astro 5.18.2, Node 22.23.2 |
| **Baseline tests** | **None exist.** No test runner, no lint, no typecheck, no CI. |
| **Readiness** | Not ready for production. Not yet re-verified after the 9 September audit. |
| **Records updated** | 2026-09-12 |

## What the audit actually examined

The Cloudflare Worker has not been modified since 2026-08-30. The September 9 audit therefore
examined **exactly the build that is checked out today**. Nothing has drifted in between, so the
audit's observations should reproduce against this commit without allowance for changes.

## Safe working procedure for Prompts 01–10

**Pushing to `main` deploys.** Cloudflare Workers Builds is connected to this repository and
builds on push to `main`. There is no separate deploy step to withhold.

Therefore, for Prompts 01–10:

- Work on branch `audit/2026-09` and **do not push it** until Prompt 11.
- `npm run build` is safe: it writes only to `dist/`, which is gitignored, and publishes nothing.
- `npm run preview` and `npx astro dev` serve locally and publish nothing.
- Whether Cloudflare produces preview deployments for non-`main` branches is **not yet confirmed**;
  until it is, treat any push of any branch as potentially publishing.

## Disposition summary after Prompt 04

| Finding | State |
|---|---|
| F01 Contact | **implemented** — real address, no implementation notes |
| F02 Legacy URLs | reproduced, **open** — Prompt 09. Scope is ~35 real mappings, not 1,646 |
| F03 Indexing | reproduced (intentional), **open** — cutover gate; sitemap still missing |
| F04 Permissions | **implemented** from Brian's decision; two wording questions outstanding |
| F05 Policies | **implemented** — Privacy and Cookies now describe what runs |
| F06 Venue | **implemented** — fabricated acreage and travel time removed |
| F07 Archive count | **implemented** — durable wording, no hard-coded total |
| F08 Jonah title | **implemented** — aligned to the archive; reversible if the book differs |
| F09 Book metadata | **partly implemented** — edition labelling done; three page counts need Brian |
| F10 Contrast | reproduced with exact figures, **open** — Prompt 05 |
| F11 HTTP→HTTPS | reproduced, **open** — Prompt 07 |
| F12 Metadata | **implemented** for titles and descriptions; canonical/OG remain — Prompt 08 |
| F13 Copy | **implemented** except F13.3 and F13.7, which are poem text and need Brian |
| F14 Registration | **implemented** as an honest interest list; Stripe deferred by Brian |

## Prompt 05 and 06

**Prompt 05 — visual quality, navigation and accessibility: done.** F10 closed. All 34
text/ground pairs across both themes pass WCAG 2.2 AA. Details in `verification.md`.

**Prompt 06 — narrow screens and performance: done.**

- 406 checks (29 pages x 7 widths x 2 themes) — 0 problems.
- Phone header cut from 164 px sticky (172 px at 320 px) to **115 px at every phone width**, and
  it now scrolls away. Two real faults fixed: the theme button was inside `<nav>` so it could
  never be placed beside the wordmark, and `.nav` inherited `flex-wrap: wrap` so the narrowest
  screens got the tallest header.
- Fonts were shipping their full variable axis ranges while the stylesheet only ever asks for
  weights 400-600. Subset via `tools/subset-fonts.py`: **528,560 -> 267,468 bytes**, of which
  50,572 came off the critical path of every single page.
- Every template now inside the good Core Web Vitals bands under a Slow 4G / 4x CPU lab profile.
  Retreat LCP 3116 -> 2368 ms, home 2692 -> 2160 ms. Labelled as laboratory, not field — there is
  no field dataset and cannot be before cutover.
- Heroes and covers were measured and deliberately **not** changed; the reasoning is written down
  in `verification.md` so it is not re-litigated later.
- Known and accepted: retreat CLS 0.0352, caused by the hero `h1` wrapping differently in
  Newsreader than in the fallback between 375 and 430 px. Inside the good band; every available
  fix costs more than it buys. Reasoning recorded.
- **Only Chromium was available.** Safari and Firefox are unverified. `device-checklist.md` is the
  twenty-minute list for Brian to close that gap on real hardware.

## Next step

Prompt 07 — harden delivery: F11 HTTP to HTTPS, security headers, CSP.
