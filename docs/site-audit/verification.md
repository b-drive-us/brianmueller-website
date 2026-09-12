# Verification log

Every entry records the environment it was run in. Local, private preview, live beta and production
are tracked separately and never conflated.

## Prompt 00 — 2026-09-12

| Check | Environment | Tool | Result |
|---|---|---|---|
| Repository identified | device working copy | `git` | `github.com/b-drive-us/brianmueller-website`, branch `main`, clean, synced |
| Checked-out commit | device | `git log` | `8ea45e5` (2026-08-30) |
| Baseline build | device, Node 22.23.2, Astro 5.18.2 | `npm run build` | exit 0, 29 HTML files, no warnings |
| Build ≡ deployed | device build vs live beta | stylesheet content hash | **identical** — `about.4CFqJ8S2.css` both sides |
| Worker last modified | Cloudflare API | `workers_list` | `2026-08-30T19:10:16Z` — unchanged since the last session |
| Baseline tests | device | — | **none exist**: no runner, lint, typecheck or CI |
| F03.1 robots meta | live beta | `curl` | `noindex, nofollow` present — intentional staging guard |
| F03.2 X-Robots-Tag | live beta | `curl -I` | `x-robots-tag: noindex, nofollow` |
| F03.3 robots.txt | live beta | `curl` | Cloudflare managed `Allow: /` block + staging `Disallow: /` — as reported |
| F03.4 sitemap | live beta | `curl` | `/sitemap.xml`, `/sitemap_index.xml`, `/sitemap-index.xml` all 404 |
| F11.1 HTTP→HTTPS | live beta | `curl http://…` | **HTTP/1.1 200 OK, no Location** — reproduced |
| F11.2 www beta | live beta | `curl` | `www.brianmueller.org` does not resolve — reproduced |
| Production host | live .com | `curl` | `brianmueller.com` → 301 → `www.brianmueller.com` (200); sitemap 200 |
| F06.1/F06.2 | source | `grep` | `retreat.astro:87` contains both invented figures — reproduced |
| F07.1 | source | `grep` | `1,832` in `index.astro:71` and `poems.astro:22` — reproduced |
| F09.6 | source | `books.json` | Trust Stillness has no `pages` field — reproduced |
| F12.1 | build output | description length census | **12 descriptions are exactly 150 characters** — reproduced at source |
| F12.2 | build output | title census | three pages share "Men Writing for Change — Brian J. Mueller" — reproduced |
| F13.1 | source | `grep` | "allowing the waves carry you" in Trust Stillness blurb — reproduced |
| F13.2 | source | `books.json` | Tomorrow Could Be Wonderful blurb opens with a fragment — reproduced |
| `docs/` excluded from output | device build | `find dist` | verified: no `docs/` path in `dist/` |

## Not tested in Prompt 00

Mobile viewports, real devices, screen readers, email delivery, registration, payments, performance
(lab or field), penetration testing, and the legacy URL inventory. None of these may be described
as passing.

## Environment notes

- Browser automation is available through the Claude in Chrome extension against Brian's own
  browser; the standalone automated pane is blocked by Cloudflare bot detection on Cloudflare
  properties and must not be used for those.
- A headless Chromium with Playwright is available in the cloud container for viewport work, but it
  cannot reach `fonts.googleapis.com` or `brianmueller.org` through the egress proxy. Local
  rendering must be served from a locally built `dist/`.

## Prompt 01 — 2026-09-12 — independent verification

Method: BFS crawl of the live beta from `/` over internal links; every anchor, `src` and `srcset`
destination checked with redirect chains followed; contrast computed from the deployed stylesheet;
poem bodies compared line-by-line against brianspoems.com; the .com sitemap fetched and decomposed.

| Check | Environment | Result |
|---|---|---|
| Page discovery | live beta | **28 pages**, all 200 — exactly Appendix B, nothing added or missing |
| Link/asset check | live beta + external | **102 distinct destinations, 911 occurrences**; every internal and external destination resolves |
| spacepainter.com | external | returns **202** to an automated client (audit saw 403); browser loads it. Verification-method artefact, not a broken link — audit's conclusion upheld |
| Internal fragments | live beta | `#register`, `#is-it-for-me` both present in `/retreat` |
| mailto encoding | live beta | all three well-formed; subject correctly percent-encoded |
| F10.1 | deployed CSS | white `#FFFFFF` on `--ember` dark `#E09A66` = **2.34:1** — matches the audit exactly |
| F10.2 | deployed CSS | white on `--ember-deep` dark `#F0B183` = **1.85:1** — matches exactly |
| F10.3 | deployed CSS | `--ink-3` `#7C7065` on `--paper` `#F7F4EF` = **4.39:1** — matches exactly |
| **F10.5 (new)** | deployed CSS | `--ink-3` on `--paper-2` `#EFEAE1` = **4.02:1** — worse, and not in the audit |
| Light-theme button | deployed CSS | white on light `--ember` `#8C4A22` = **6.74:1 PASS** — the failure is dark-theme only |
| F08 | brianspoems.com | archive heading is **"Behold"**, subtitle **"…the truth in her smile."**; site says "Truth" / "Behold her smile!" — reproduced |
| F08 body | archive vs site | **11 of 11 lines identical** — same poem, title dispute only |
| Sample bodies | archive vs site | all twelve match; near-misses are typographic apostrophes and stanza blanks |
| F07 | brianspoems.com | the archive's own page states **"all 1,834 pieces … 1,675 poems, 38 prose pieces"** — reproduced from the source |
| F02.1 | beta vs .com | all **8 legacy routes 404 on the beta and 200 on .com** — real breakage at cutover |
| F02 inventory | .com sitemap | **1,646 URLs, no nested sitemaps** — count confirmed |
| F01 | live beta | `/contact` still publishes "The form needs rebuilding… Cloudflare Worker" — reproduced |
| F05.1/F05.2 | live beta | Privacy names Squarespace and Google Analytics — reproduced |
| F05.4 | live beta | "configuration.Third-Party Cookies" run together — reproduced |
| F12.1/F12.2/F12.3 | build output | 12 descriptions at exactly 150 chars; 3 shared titles; `/` and `/books` share one — reproduced |

### The legacy inventory decomposed — this changes the shape of F02

The audit reported 1,646 legacy URLs without breaking them down. They are:

| Segment | Count | Treatment |
|---|---:|---|
| `/living-workshop/…` | **1,611** | Blog posts. Brian decided 2026-08-29 to archive, not migrate. One blanket rule. |
| `/store/…` | 15 | Book and series pages. Individually mapped to `/books/…` and `/series/…`. |
| `/archive-N` | ~14 | The disabled pages, already mined into the new site's content. |
| Policies and other | ~6 | `/refund-policy`, `/terms-conditions`, `/disclaimer`, … |

**98% of the inventory is one decision Brian has already made.** The bespoke mapping work is about
35 URLs, not 1,646. That is a materially smaller and more tractable job than the headline figure
implies, and it should be said plainly rather than left as an intimidating number.

## Still not verified — do not describe as passing

Mobile viewports and real devices, screen readers, email delivery, registration, payment, lab or
field performance, penetration testing, and the content of the 1,611 archived blog URLs.

## Prompt 05 — 2026-09-12 — design, navigation, accessibility

| Check | Environment | Result |
|---|---|---|
| **Contrast, every text/ground pair** | built stylesheet, computed | **34 combinations across both themes — all PASS at 4.5:1**, focus ring checked at 3:1 |
| F10.1 dark button | computed | was 2.34:1 → **7.90:1** |
| F10.2 dark button hover | computed | was 1.85:1 → **9.96:1** |
| F10.3 light secondary text | computed | was 4.39:1 → **5.02:1** on paper, **4.60:1** on paper-2, **4.52:1** on ember-soft |
| F10.5 (new, audit missed it) | computed | `--ink-3` on `--paper-2` was 4.02:1 → 4.60:1 |
| Skip link | Chromium, 10 templates | present and **first focusable element** on every page |
| Focus visibility | Chromium | 3px `--ember` outline with offset on every interactive element; lighter variants over the hero photograph and the dark band |
| Focus not hidden by sticky header | Chromium | `scroll-margin-top: 5.5rem` on headings and every `[id]` |
| Landmarks / `h1` / `lang` | 29 built pages | one `<main>`, exactly one `<h1>`, `lang` present on all |
| Images without `alt` | 29 built pages | **none** |
| Ambiguous link names | 29 built pages | 14 identical "Buy on Amazon" links now carry the book title in a visually-hidden span |
| Generic link text | home | "More about it" / "Read it" / "All notes" replaced with specific labels |
| Target size ≥24×24 | 10 templates × 2 themes | no control under 24 px |
| Horizontal overflow | 10 templates × 2 themes @1280 | **zero** |
| Narrow reflow | 320 / 375 / 390 / 430 / 768 / 1024 px, 6 templates | **zero page overflow, zero poem overflow** |

### Refinement direction taken

Not a redesign — the literary identity stays. Three things changed:

1. **`--ember` was doing two jobs with opposite contrast needs**: a link colour on the page ground
   (7.62:1, fine) and a button background under white text (2.34:1, failing). One token cannot
   satisfy both. Buttons now have their own `--btn-bg` / `--btn-bg-hover` / `--btn-fg` triple, so
   the dark theme puts dark ink on the ember rather than white.
2. **Secondary ink was too light on two of four grounds.** Darkened once, at token level, so every
   usage is fixed at once.
3. **Two-column blocks were left-aligned in a 72 rem wrap**, leaving about 20 rem of dead space on
   the right of every book, about and feature block. They now centre.

### Still not verified

Real devices, screen readers, 400% browser zoom in a real browser (320 px reflow is covered),
`prefers-reduced-motion` behaviour beyond the existing global rule, and field performance.
