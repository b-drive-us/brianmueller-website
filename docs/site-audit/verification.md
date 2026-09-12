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

---

## Prompt 06 — narrow screens and performance

### Narrow-screen behaviour

| Check | Scope | Result |
|---|---|---|
| Full sweep, no overflow, no clipped control | 29 pages × 7 widths (320/375/390/430/768/1024/1440) × 2 themes = **406 checks** | **0 problems** |
| Emulation is real, not a CSS illusion | requested 390 px → `window.innerWidth` 390, `innerHeight` 740, DPR 3 | confirmed |
| Target size, phone widths | every link, button and summary at 320/390/430 | **0 under 24 px, 0 under 44 px** |
| Target size, pointer:fine | 768 / 1280 | 0 under 24 px; the theme toggle is 30 px — above the WCAG 2.2 floor, mouse only |
| Header cost on a phone | 320 / 390 / 430 | **115 px at every phone width**, `position:static` |
| Deep-link anchor | `/retreat#register` at 390 px | lands at `top = 20 px`, in view |
| Theme persistence | toggle → navigate → browser back | dark held through all three |
| Disclosures | 6 retreat FAQ items, keyboard-operated at 390 px | all 6 open, overflow with all open = **0** |

### What changed on narrow screens

The phone header was three stacked rows — wordmark, then the links, then the theme button on a
line of its own — **164 px**, held on screen by `position: sticky`. Two faults, one in the markup
and one in the CSS:

1. The theme button lived *inside* `<nav>`, so the grid placement meant to put it beside the
   wordmark could never apply. It is now a sibling of `.nav`, which is also the more accurate
   markup: a theme control is not navigation.
2. `.nav` inherited `flex-wrap: wrap`, so at 320 px the links broke to a second line and the
   header grew back to **172 px** — worse at the narrowest width, which is the opposite of what
   a narrow-screen rule should do.

The header is now **115 px at 320, 390 and 430 px** and it scrolls away rather than sticking, so
the cost is paid once instead of permanently. With nothing pinned, anchors need no offset and land
exactly. Below 360 px the link row scrolls sideways and its last link is faded, so it reads as a
row that continues rather than a row that ends; Contact is also in the footer.

### Performance — laboratory, not field

**There is no field dataset for this beta.** The site is on a staging hostname with
`noindex, nofollow` and a `X-Robots-Tag` guard, has no analytics and no real traffic, so no Chrome
UX Report data exists and none can exist before cutover. Everything below is a lab baseline
measured on the built `dist/`, and lab numbers are a floor to design against, not a prediction of
what Brian's readers will see.

Conditions: headless Chromium 141, viewport 390 × 740, DPR 3, mobile emulation, **4× CPU
throttle**, network shaped to **1.6 Mbps down / 150 ms RTT** — Chrome's "Slow 4G" profile. Served
over plain HTTP/1.1 from a local static server, so the real site behind Cloudflare (HTTP/2 or /3,
edge compression, a nearer first byte) should do better, not worse.

| Template | Before | After | LCP before | LCP after | CLS |
|---|---|---|---|---|---|
| home | 521 KB | **371 KB** | 2692 ms | **2160 ms** | 0.0001 |
| books | 485 KB | **334 KB** | 828 ms | 852 ms | 0.0001 |
| book (long) | 352 KB | **202 KB** | 940 ms | 908 ms | 0 |
| poems | 343 KB | **193 KB** | 872 ms | 856 ms | 0 |
| retreat | 571 KB | **421 KB** | 3116 ms | **2368 ms** | 0.0352 |
| contact | 190 KB | **141 KB** | 844 ms | 812 ms | 0 |
| about | — | 241 KB | — | 928 ms | 0.001 |

Every template is now inside the "good" Core Web Vitals bands under this profile: **LCP under
2.5 s** and **CLS under 0.1**. Retreat was the one page over the LCP threshold before, at 3.1 s.

### What actually caused it

The single bottleneck was the **font payload**, and the cause was not obvious from page weight
alone: the six self-hosted faces shipped their full variable axis ranges. Archivo carried
wght 100–900 and Newsreader carried wght 200–800 *plus* an optical-size axis 6–72, while
`base.css` never asks for a weight outside 400–600. Every delta outside that band was bytes
nobody rendered — **528 KB of faces, of which roughly half was unreachable design space.**

`tools/subset-fonts.py` now instances them down. Optical size is **kept** on the upright faces,
where headings run to about 87 px and the display cut is visibly finer; it is **pinned at 22** on
the italic faces, which `base.css` only ever uses between 18 px and 27 px. Verified rather than
assumed: italic text rendered before and after is the same width to the pixel (524 px) and differs
by a mean of 0.13/255 per pixel — no reflow, no visible change.

| Face | Before | After |
|---|---|---|
| newsreader-normal-latin (preloaded) | 131,848 | **92,208** |
| newsreader-normal-latin-ext | 86,628 | **59,228** |
| newsreader-italic-latin | 147,060 | **43,316** |
| newsreader-italic-latin-ext | 95,412 | **26,564** |
| archivo-normal-latin (preloaded) | 34,940 | **24,008** |
| archivo-normal-latin-ext | 32,672 | **22,144** |
| **total** | **528,560** | **267,468 (51%)** |

The two preloaded faces — the ones on the critical path of *every* page — went from 166,788 to
116,216 bytes. That is why the flat 150 KB came off every template in the table above, including
pages with no images at all.

Filenames now carry a `-v2` suffix. `public/_headers` caches `/fonts/*` for a year as `immutable`,
so a regenerated face **must** get a new filename; overwriting one in place would leave returning
visitors on the old file forever. The pristine originals are kept in `tools/fonts-original/` so
the subsetting is reproducible and reversible.

### What was measured and deliberately left alone

- **Hero images are correctly sized, not oversized.** The first read of the numbers suggested the
  browser was picking the wrong srcset variant on a phone. It was not. Both heroes are
  `object-fit: cover` in a tall box, so cover scales by height: the retreat band renders about
  1674 CSS px wide inside a 390 px viewport, and at DPR 3 the device wants roughly 5000 px. The
  1456 px file is the largest that exists and is already an upscale. `sizes="100vw"` under-states
  the need rather than over-stating it.
- **Dropping the phone to a smaller variant was tested and rejected.** Rendered side by side at
  1:1 device pixels, `retreat-band-1000` is visibly softer in the branches and `-700` is mushy.
  The retreat hero stays at 231 KB; it is the LCP element on a page that now loads in 2.4 s.
- **Book covers are not over-encoded.** `more-bull-320` is 38 KB against `bull-head-320` at 11 KB,
  which looks like an encoding fault but is not: re-derived from the 1800 × 2700 masters, the
  current files sit at about q78 and the heavy ones are heavy because the artwork is photographic.
  Going to q72 saves 11% and costs visible quality on the one thing a publishing site must render
  well. Left alone.
- **JavaScript: there is none.** `dist/` contains zero `.js` files. The only scripts are two
  inline blocks in the layout — the pre-paint theme read and the toggle handler.
- **Render-blocking work** is one 21 KB content-hashed stylesheet plus two font preloads.

### Known and accepted: retreat CLS 0.0352

Measured, understood, and inside the "good" band. The cause is exact: the hero `h1`
"Rooted in the Land" sits right at its wrap point between 375 px and 430 px. It renders as **one
line in the fallback serif and two lines in Newsreader**, so when the webfont swaps the hero grows
by one 49 px line and the content below it moves.

| Width | Newsreader | Fallback | Shift |
|---|---|---|---|
| 320 | 2 lines | 2 lines | none |
| 375 | 2 lines | 1 line | 50 px |
| 390 | 2 lines | 1 line | 50 px |
| 430 | 1 line | 1 line | none |
| 768 + | 1 line | 1 line | none |

No fix was shipped, because each one costs more than 0.035 of CLS is worth:

- `font-display: optional` removes the shift completely but means a first-time visitor on a slow
  connection reads the whole first page in Georgia. On a poet's site the typography *is* the
  impression.
- Reserving two lines for the hero `h1` below 430 px fixes retreat and puts a blank line under the
  home hero, which renders on one line at those widths.
- A metric-matched `size-adjust` fallback is the textbook answer, but the correct value depends on
  which fallback the visitor actually has — Georgia is wider than Newsreader, Liberation Serif is
  narrower — so one number cannot be right for macOS, Windows and Android at once, and none of
  them can be verified from this container.

Revisit if field data after cutover shows real users hitting it.

### Browser matrix — stated plainly

**Only Chromium 141 was available.** WebKit and Firefox executables are not present in this
environment and cannot be installed here. Every result above is Chromium. Safari and Firefox are
unverified, which matters for this site specifically because Safari is where most iPhone readers
will arrive from an email link. See `docs/site-audit/device-checklist.md`.
