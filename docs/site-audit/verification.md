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

---

## Prompt 07 — security and delivery

**Scope, stated plainly: this was a configuration and code review, not a penetration test, and
nothing here is a guarantee that the website is secure.** It covers the repository, the built
output, the dependency tree, the response headers of the running staging site, and the behaviour of
a real browser under the enforced policy. It does not cover Cloudflare's own infrastructure,
Brian's account credentials, his email provider, or anything that is added later.

### The attack surface, as measured

| | Found |
|---|---|
| Server endpoints | **none** — static assets on a Cloudflare Worker, no `main`, no functions |
| Forms | **none** — no `<form>` in any of the 29 built pages |
| `fetch` / `XMLHttpRequest` | **none** |
| JavaScript files in `dist` | **zero** |
| Inline scripts | 2, identical on every page: pre-paint theme read, theme toggle |
| Inline event handlers (`onclick=` etc.) | **none** |
| Third-party subresources | **none** — every stylesheet, font and image is same-origin |
| `data:` URIs | **none** |
| `<iframe>` / `<object>` / `<embed>` / `<base>` | **none** |
| `target="_blank"` | **none**, so no reverse-tabnabbing surface |
| Client storage | `localStorage["theme"]`, written only if the visitor presses the toggle |
| Cookies set | **none** — confirmed against the live site, no `Set-Cookie` on any response |
| Secrets in the repository | none. Only `.gitignore` matches the dotfile scan; no `.env`, key or credential file is tracked |
| Source maps / docs leaked into `dist` | none |
| Deployment credential | held by Cloudflare Workers Builds, never in the repo |

There is no user-controlled input path anywhere on this site, so the injection, recipient-selection,
header-injection, unbounded-body, open-redirect and duplicate-processing questions in the prompt
have no surface to land on. That is a finding, not an omission — and it is why the CSP can be as
tight as it is.

### Dependencies

| Package | Was | Now | Action |
|---|---|---|---|
| wrangler | 4.127.1 (high) | **4.131.1** | updated — holds the deploy credential |
| miniflare | (high, via wrangler) | cleared | resolved by the above |
| astro | 5.18.2 (critical ×10) | 5.18.2 | **not upgraded** — see N10 and D-11 |
| sharp | (high, via astro) | unchanged | libvips/libheif CVEs; `astro:assets` is never used so sharp never runs |
| esbuild | (low, via astro) | unchanged | dev server on Windows only; not applicable |

The astro decision is the substantial one and it is written up in full in findings N10 and
decision D-11. Short version: all ten advisories were checked individually and none is reachable in
a static build with no user input; the upgrade to 7.3.2 was then actually attempted and **rejected
because it silently corrupts rendered prose in fourteen places across eight pages**. Reverted and
verified byte-identical to the Prompt 06 build.

`tools/compare-build-text.py` came out of that and stays in the repo. It compares the rendered text
of two builds and exits non-zero on exactly this class of regression — a space lost next to an
inline element, which no build log, link check or responsive sweep will show you. Self-tested
against the Astro 7 build: it reports all fourteen.

### Transport — F11 confirmed live

```
$ curl -sSI http://brianmueller.org/                      -> HTTP/1.1 200 OK
$ curl -sSI "http://brianmueller.org/books/jonah?utm=x"   -> HTTP/1.1 200 OK
$ curl -sSI http://www.cloudflare.com/                    -> HTTP/1.1 301 + location:
```

The third line is the calibration: redirects pass through this client intact, so the 200s are real
and not an artifact. The site answers on port 80 with no upgrade.

**Fixed the same day**, with Brian, and re-verified from outside Cloudflare:

```
$ curl -sSI http://brianmueller.org/                              -> 301 -> https://brianmueller.org/
$ curl -sSI "http://brianmueller.org/books/jonah?utm_source=test" -> 301, query preserved exactly
$ curl -sSI http://brianmueller.org/no-such-page                  -> 301 (redirect precedes the 404)
$ curl -sSL ... http://brianmueller.org/                          -> hops=1, final https, 200
```

One hop, no loop, query strings intact. **F11 closed for brianmueller.org**; the same setting is
needed on brianmueller.com at cutover. HSTS remains deliberately unset — D-12 records why and the
order to enable it in later.

Worth recording because it nearly produced a false pass: the **first click reported success and did
not save**. The dashboard displayed "this setting was last changed a few seconds ago" while `curl`
still returned 200, and a reload showed the toggle off. A second click landed and the external check
then confirmed the 301. **Verify Cloudflare settings from outside Cloudflare** — its own UI said the
change had happened when it had not.

### Headers, and what they were before

The live site returned exactly one security-relevant header: `x-robots-tag`. No CSP, no `nosniff`,
no referrer policy, no permissions policy, no framing protection, no HSTS.

The policy now in `public/_headers`:

```
default-src 'none';
script-src 'sha256-ReSDczqo…' 'sha256-QglPjucd…';
style-src 'self'; img-src 'self'; font-src 'self';
base-uri 'none'; form-action 'none'; frame-ancestors 'none';
upgrade-insecure-requests
```

plus `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, a
`Permissions-Policy` denying seventeen features the site never uses, and
`Cross-Origin-Opener-Policy: same-origin`.

Two things about it are worth stating because they were earned rather than assumed:

- **`script-src` is two hashes and nothing else.** No `'unsafe-inline'`, no `'self'`, no nonce.
  That is only possible because the site has exactly two scripts and they never change per page.
- **`style-src` is `'self'` with no `'unsafe-inline'`.** That is only possible because the 91
  inline `style` attributes were moved into utility classes first (N12).

`Cross-Origin-Resource-Policy` is set per directory rather than globally, on purpose: `same-origin`
on the stylesheet and fonts to stop other sites spending Brian's bandwidth, `cross-origin` on
`/img/` and `/covers/` so Illuman, Choosing Presence or a reviewer can embed a book cover. A global
`same-origin` would have quietly broken that, which is the kind of thing a copied header block
does.

### Enforcement test — not report-only

The policy was tested **enforced**, by serving the real `dist/` through a server that applies the
real `_headers` file, and driving a real browser against it.

| Check | Result |
|---|---|
| Pages loaded under enforcement | **58** (29 pages × 2 themes) |
| CSP violations | **0** |
| Console errors | **0** |
| Theme script ran and applied correctly | **58 / 58** |
| Webfonts loaded | **58 / 58** |
| 406-check responsive sweep, under the policy | **0 problems** |

Because it survives enforcement on every page in both themes, it ships **enforced**, not
report-only. Report-only would not be enforcement and would not be worth claiming as protection.

### Negative tests

Harmless probes against the enforced policy, each asserting the browser refuses:

| Probe | Result |
|---|---|
| Inline `<script>` injected into the page | **blocked** |
| External script from another origin (jsDelivr) | **blocked** |
| `style` attribute set from script | **blocked** |
| Off-origin image | **blocked** |
| `fetch()` to another origin | **blocked** |
| Form injected and submitted to `example.com` | **blocked** — navigation did not occur |
| `<base href="https://evil.example/">` injected | **blocked** — relative links unaffected |

Positive control on the same page: theme toggle present and working, 3 font faces loaded.

### Header coverage — pages, assets, and errors

| Path | Core security headers | CORP |
|---|---|---|
| `/index.html` | 6 / 6 | — |
| `/nope-404` (the 404 page) | 6 / 6 | — |
| `/robots.txt` | 6 / 6 | — |
| `/fonts/…woff2` | 6 / 6 | same-origin |
| `/img/…webp` | 6 / 6 | cross-origin |
| `/covers/…webp` | 6 / 6 | cross-origin |

Confirmed at the live edge as well, for the header that matters most right now: `x-robots-tag` is
present on the running site's pages, on `robots.txt`, **and on 404 responses**. Cloudflare applies
`/*` rules to error responses. The CSP itself cannot be confirmed at the edge until this branch is
deployed at Prompt 11; that check belongs there.

### Indexing guard — the reason it works is not the reason we wrote down

`https://brianmueller.org/robots.txt` is 66 lines, not the 6 in this repo: Cloudflare **prepends** a
managed block containing `User-agent: * / Allow: /`, ahead of our `Disallow: /`. The repository's
robots.txt is therefore not reliably keeping this site out of search results. `X-Robots-Tag:
noindex, nofollow` is, and it is verified present everywhere. The guard holds; the documented
reason for it was wrong and is now corrected in `public/_headers`.

The same managed block declares `ai-train=no` and blocks nine AI crawlers — a rights decision about
Brian's poetry, arriving as a hosting default. Raised as D-13 rather than accepted silently.

**Brian chose to turn it off and own the file, and it is done**: AI Crawl Control → Signals →
Managed robots.txt, off. `https://brianmueller.org/robots.txt` went from **66 lines to 5** — exactly
the repository's file. The contradictory `Allow: /` is gone, so the staging `Disallow: /` now stands
alone for `User-agent: *`, and the `X-Robots-Tag` header continues to be the primary guard. The
production robots.txt, stating Brian's own position on AI training rather than a vendor's default,
is Prompt 08's work.

### Data practices rechecked against Prompt 04 — and a correction

Prompt 04 recorded F05 as implemented. **It was not, and that was my error.** The privacy policy had
been rewritten correctly; the cookie policy had not. It still listed Google Analytics cookies
(`_ga`, `_gid`, `_gat`) and Squarespace Analytics cookies (`ss_cid`, `ss_cpvisit`, …) as cookies the
site uses, and offered a cookie preference tool that does not exist — so the two policies flatly
contradicted each other.

Rechecked against behaviour, not source: the live site sends **no `Set-Cookie` on any response**,
injects no Cloudflare beacon, and carries two inline scripts and nothing else.

- **Cookie policy rewritten.** It now opens by saying the site sets no cookies, describes the single
  `localStorage` theme value and how to clear it, and keeps a short honest note that earlier
  versions of the site did run Squarespace and Google Analytics.
- **Privacy policy corrected.** "Cloudflare Web Analytics" named a product that requires a beacon
  script the site does not load; it now describes Cloudflare's edge traffic figures and server logs.
  The Workers delivery diagnostics are disclosed (D-14). The "(if enabled) cookie preference tools"
  hedge is gone.
- Revision dates on both moved to September 12, 2026, because these were real edits.

No diagnostics on this site touch message content or personal details, because no message or
personal detail ever reaches it: contact is a `mailto:` link and the retreat is an email interest
list. Delivery logs are request lines at Cloudflare.

### Remaining risks, explicitly

1. ~~HTTP still answers on port 80.~~ **Closed** — Always Use HTTPS is on for brianmueller.org and
   verified. The residual piece is **brianmueller.com**, which has no such redirect yet and must get
   one at cutover, before any traffic is pointed at it.
2. **Astro stays on an end-of-life major** (D-11). No advisory is reachable today; the moment the
   site gains a form, an endpoint or SSR, that changes and the upgrade becomes urgent.
3. **sharp ships with libvips/libheif CVEs** in the dependency tree. It is never invoked, because
   `astro:assets` is never used. If image optimization is ever turned on, revisit first.
4. **The CSP is brittle by design.** Editing either theme script by one byte breaks it silently —
   the build passes, the page looks right, the toggle is dead. `tools/csp-hashes.py` regenerates
   the hashes; the `_headers` comment says so at the point of use.
5. **The CSP has not been confirmed at the Cloudflare edge**, only under an identical local
   enforcement of the same `_headers` file. That confirmation belongs to Prompt 11.
6. **Account security is out of scope and unreviewed**: Cloudflare and GitHub credentials, two-factor
   enrolment, and who else can deploy. Worth Brian's own look before cutover.

---

## Prompt 08 — page identity and per-environment indexing

### The three environments, built and checked independently

`SITE_ENV` names the environment; everything else derives from it. There is no default — an unset or
unknown value throws.

| | `production` | `beta` | `preview` |
|---|---|---|---|
| origin | `https://www.brianmueller.com` | `https://brianmueller.org` | `http://localhost:4321` |
| canonical on 29 pages | ✓ all on that origin | ✓ | ✓ |
| `noindex` meta | **1 page** (`/404` only) | 29 | 29 |
| `X-Robots-Tag` in `_headers` | absent | injected | injected |
| robots.txt | `Allow: /`, AI-training crawlers disallowed, sitemap declared | blanket `Disallow: /` | blanket `Disallow: /` |
| sitemap.xml | 28 URLs | 28 URLs | 28 URLs |
| `check-build.mjs` | **ok** | **ok** | **ok** |

28 URLs, not 29, because `/404` is excluded by name.

### The guards actually fire

Not "the checks exist" — they were run against deliberately mismatched artifacts:

| Scenario | Result |
|---|---|
| A **beta** artifact shipped as production | **117 problems.** Wrong canonical host on every page, `noindex` on every page, hard-coded `brianmueller.org` throughout, `X-Robots-Tag` present, sitemap on the wrong origin. |
| A **production** artifact shipped as beta | **115 problems.** Wrong canonical host, missing `noindex`, hard-coded `www.brianmueller.com`, no `X-Robots-Tag`. |
| `SITE_ENV` unset | Build throws: "SITE_ENV is not set. This build has no idea which site it is." |
| `SITE_ENV=nonsense` | Build throws, naming the three valid values. |

### Metadata, measured

| Check | Result |
|---|---|
| Pages | 29 |
| Duplicate titles | **0** |
| Duplicate descriptions | **0** |
| Descriptions ending in an ellipsis | **0** |
| Description length | min 21, median 101, max 161 |
| Canonical link | 29 / 29 |
| Open Graph + Twitter card | 29 / 29 |
| `og:image` / `twitter:image` absolute | 29 / 29 |
| Referenced social images that exist in `dist/` | **all**, none missing |
| Social images at 1200 × 630 | both, confirmed by reading the files |

The two social images are real crops of artwork already used on the site — the bull photograph from
the home hero, and the Illuman event graphic for the retreat page, cropped so its own title text
survives. Nothing generated, nothing with invented text on it.

### Structured data — what it claims and what it refuses to

14 JSON-LD blocks, all valid JSON. Automated check for `offers`, `price`, `priceCurrency`,
`availability`, `aggregateRating`, `review`, `ratingValue`, `eventStatus`: **none present anywhere.**

Sample (Jonah): `{"@type":"Book","name":"Jonah","isbn":"978-1733501200","numberOfPages":450,
"datePublished":"2019"}` — every field of which is visible on the page and recorded in
`src/data/books.json` with a source.

No `Event` markup on the retreat page. Reasoning in D-16: registration is an email interest list,
and `Event` markup invites Google to present it as bookable.

### Sitemap

Parsed with an XML parser, not a regex: root is `urlset` in the sitemap 0.9 namespace, 28 `<url>`
entries each with a `<loc>`, **0 duplicates**, **0 entries containing `.html`**, all on the
environment's own origin, no unescaped characters. One `<lastmod>` — the single blog post, taken
from its own `<time datetime>`. Every other page omits `lastmod` rather than inventing one.

### Regression — nothing earlier broke

The layout's `<head>` changed, so the whole Prompt 05–07 suite was re-run against the new build:

| | Result |
|---|---|
| Responsive sweep, 29 pages × 7 widths × 2 themes | **406 checks, 0 problems** |
| Enforced CSP, 29 pages × 2 themes | **58 loads, 0 violations, 0 console errors** |
| Theme script applied / webfonts loaded | 58 / 58 both |
| Rendered-text comparison | **0 regressions** |
| CSP hashes | still the same two; no change to either theme script |

The CSP result matters more than it looks: JSON-LD introduced `<script>` elements to a site whose
`script-src` is two hashes and nothing else. Zero violations confirms a data block is not subject to
`script-src` — tested rather than taken from the spec.

### Checks that passed on a production-configured PREVIEW, not on production

Stated separately, as the prompt requires. Everything in the production column above was verified on
a **locally built production artifact**. None of it has been served from `www.brianmueller.com`,
because nothing has been deployed there. The following can only be confirmed after cutover and are
listed in `release-plan.md`:

1. That `https://www.brianmueller.com/robots.txt` is the generated file and not something a platform
   prepends — Cloudflare did exactly that on the .org zone.
2. That `X-Robots-Tag` is **absent** from live production responses, including 404s and assets.
3. That `https://www.brianmueller.com/sitemap.xml` is fetchable and its URLs all return 200 rather
   than redirecting.
4. That the canonical on each live page matches the URL that actually served it.
5. That Search Console accepts the sitemap without "Page with redirect" or "Alternate page with
   proper canonical tag" warnings.

### Still true, and worth repeating

`robots.txt` is not access control, and `Disallow` is not `noindex`. The beta is readable by anyone
with the link and always has been; what it is not is indexed. D-15 has the full reasoning and the
per-environment table.

---

## Prompt 09 — legacy link migration

### Inventory sources, and what could not be reached

| Source | Used | Yield |
|---|---|---|
| Live `.com` sitemap, re-fetched 2026-09-18 | yes | 1,646 URLs, one flat file, no nested sitemaps |
| Squarespace export, 2022-10-11 | yes | 916 posts, 19 pages, 914 attachments; **7 URLs absent from the sitemap** |
| `08 - Blog Archive/` index | yes | 915 posts with title, date and original URL |
| brianspoems.com sitemap | yes | 1,834 `/poem/` permalinks — the destination set |
| Old homepage, fetched live | yes | 24 legacy fragment ids |
| Live probing of shapes not in the sitemap | yes | `/archive-6`, `/archive-14`, `/cart`, `/checkout` all live |
| **Search Console / analytics** | **no** | not connected to this session. URLs with inbound traffic but no sitemap entry would not appear in any source above. |
| **`/s/` Squarespace download URLs** | **not found** | none in the sitemap, the export or the old homepage. Absence of evidence — if Brian shared a `/s/` link by email it would not be discoverable here. |

**The inventory is not claimed to be exhaustive.** It is exhaustive with respect to every source
reachable from this session, and the two gaps above are named rather than assumed empty.

### Matching method

Slug matching alone is not evidence, and the prompt pack says so. The method actually used:

1. Propose candidates from the post title and URL slug, including `-2`/`-3` siblings.
2. Fetch every candidate permalink from brianspoems.com, rate-limited ~0.5 s apart — 729 pages.
3. Extract the poem body and score word-sequence overlap against the archived post text.
4. Confirm only on overlap ≥ 0.75, or ≥ 0.50 with a ≥ 0.30 margin over the runner-up.

| Outcome | Count | Share |
|---|---|---|
| confirmed by text | **690** | 75.4% |
| no permalink with that title exists | 205 | 22.4% |
| candidate exists, text does not support asserting it | 20 | 2.2% |

**690 of 690 external destinations were verified to be real pages** carrying a poem body, and a
random sample of 12 re-checked live: all 200.

### Rule testing

Tested against a faithful evaluator of Cloudflare's documented semantics — static rules first,
top-most wins, then dynamic — and then against a local server applying the real `_redirects` and
`_headers` files.

| Check | Result |
|---|---|
| New site routes shadowed by a legacy rule | **none** (all 29 checked) |
| Self-redirects | **none** |
| Chains — a destination that is itself a source | **none** |
| Every one of the 1,653 mapped URLs resolves to its intended target | **1,653 / 1,653, 0 mismatches** |
| All rules permanent | **734 / 734 are 301** |
| Specific poem rule beats the `/living-workshop/*` catch-all | yes — `/living-workshop/in-the-mirror` → `/poem/in-the-mirror-2` |
| Query strings preserved | yes, on internal and external targets |
| Open-redirect probes | **none possible** — no rule interpolates request input into a destination |
| Rule budget | 729 static + 5 dynamic, against limits of 2,000 and 100 |

Known gaps, deliberately not fixed: trailing-slash variants of the poem rules fall through to
`/blog`, and matching is case-sensitive. Both are in findings N21 with reasoning.

### Fragments, tested in a browser

| Check | Result |
|---|---|
| Legacy fragments landing on the right page | **12 / 12** |
| `/retreat#register`, `/retreat#is-it-for-me`, `/#main` left alone | yes — all still scroll correctly, element top = 85 px, clearing the 65 px sticky header |
| Back button after `/#jonah` | returns to the previous page, no trap |
| CSP violations | **0** |

### Regression

| | Result |
|---|---|
| Responsive sweep, 29 pages × 7 widths × 2 themes | **406 checks, 0 problems** |
| Enforced CSP, 29 pages × 2 themes | **58 loads, 0 violations, 0 console errors** |
| Rendered-text comparison | **0 regressions** |
| Environment check, beta and production | both **ok** |

The CSP needed updating: the fragment handler is a third inline script, and `script-src` is a hash
allowlist. Its hash covers the fragment table baked into it, so **adding a legacy fragment changes
the hash** — noted at the point of use in `public/_headers`.

### What has NOT been tested, and cannot be until deployment

Everything above ran against a local server reproducing Cloudflare's documented `_redirects`
semantics. That is a model of production, not production.

1. That Cloudflare evaluates these rules in the order the documentation describes.
2. Whether trailing-slash normalisation happens before or after `_redirects` (N21).
3. That 734 rules load without hitting an undocumented limit.
4. That the external redirects to brianspoems.com are followed cleanly from a real browser.
5. The critical smoke set below, against the real hostname.

### Critical smoke set for cutover

Twelve URLs, chosen to cover one case of each rule class. Run against the production hostname
immediately after cutover:

```
/home                                   -> 301 /
/store                                  -> 301 /books
/store/p/jonah                          -> 301 /books/jonah
/archive-1                              -> 301 /books/trust-stillness
/archive-13                             -> 301 /series/the-bull-series
/the-bull-series                        -> 301 /series/the-bull-series
/refund-policy                          -> 301 /terms-conditions
/privacy-policy                         -> 200  (retained, must NOT redirect)
/living-workshop                        -> 301 /blog
/living-workshop/in-the-mirror          -> 301 https://brianspoems.com/poem/in-the-mirror-2
/living-workshop/2018/11/10/troubles    -> 301 https://brianspoems.com/poem/troubles
/living-workshop/tag/love               -> 301 /blog
```

Plus, in a browser: `/#jonah` lands on `/books/jonah`, and `/retreat#register` still scrolls to the
registration section.

---

## Prompt 10 — the integrated release candidate

### Defects found in this stage

Prompt 10 is a verification pass, but it found five things worth fixing, which is the point of
having one.

| # | Found | Severity | State |
|---|---|---|---|
| N22 | **`npm run build` was broken.** The scripts ran `astro build && check-build` with no `generate-seo` between them, so robots.txt stayed a placeholder and no sitemap was written. `check-build` would have failed the Cloudflare build outright. It was invisible locally only because this device's sandbox makes Astro's own cleanup step exit non-zero, stopping the chain early. | **high** | fixed |
| N23 | **The legal pages defined "the Website" as `https://brianmueller.com`** — the apex, which 301s to www. A Terms of Use pointing at a redirect. `check-build` could not see it, because it only looked for *other environment* origins. | medium | fixed, plus a new guard |
| N24 | **`generate-seo.mjs` was not idempotent.** It read and rewrote `dist/_headers`, so a second run on the same output tripped its own guard. Cloudflare always builds clean, so it would never have failed there — which is exactly why it was worth fixing. | low | fixed |
| N25 | **The two Men Writing for Change volumes were indistinguishable in two places.** The book page `<h1>` said "Men Writing for Change" while its `<title>` said "…, Vol. 1", and `/poems` attributed a Vol. 1 poem to the series with no volume. | medium | fixed |
| N26 | **Home page LCP regressed** to ~2.5 s from 2160 ms at Prompt 06. | low | partly improved, honestly reported below |

### Builds

Run on a clean checkout of the candidate in a Linux container where file deletion works — that is,
a machine that behaves like Cloudflare's builder, not like the sandboxed bridge:

| Command | Result |
|---|---|
| `npm ci` | clean |
| `npm run build` (beta) | **exit 0** — 29 pages, canonical on brianmueller.org, noindex on 29, X-Robots-Tag set |
| `npm run build:production` | **exit 0** — canonical on www.brianmueller.com, noindex on 1, X-Robots-Tag absent |
| `npm run build:preview` | **exit 0** |
| `generate-seo` run twice on one build | idempotent — exactly one `X-Robots-Tag` line |

### The built artifact contains nothing it should not

91 files: 49 webp, 29 html, 6 woff2, 2 jpg, 1 css, 1 xml, 1 txt, `_headers`, `_redirects`.
**Zero** build intermediates, **zero** source maps, **zero** dotfiles, **zero** files from `docs/`.
No HTML comments survive the build. No `TODO`, `FIXME`, internal path or `SITE_ENV` reference
appears in any shipped file. No runtime dependency was added across the whole branch — the only
dependency changes are a wrangler patch bump and pinning Astro to the version already in use.

**Nothing was deleted.** `git diff --diff-filter=D main..HEAD` is empty; the six font files show as
renames into `tools/fonts-original/`, which is the subsetting archive, not a loss.

### Crawl

| Check | Result |
|---|---|
| Page routes returning 200 | **29 / 29** |
| Distinct internal link targets resolving | **28 / 28**, none broken |
| Distinct assets resolving | **49 / 49**, none missing |
| `<title>` / description / canonical / `og:title` / `og:image` | present on 29/29, **no duplicates** except the shared default social card |
| `<h1>` | present on 29/29 |
| All twelve books: page, Amazon link, `rel="sponsored nofollow"`, ISBN and page count shown | **12 / 12** |
| Curated poems naming their source book and linking to the archive | **11 / 11** |
| Licence/permissions reachable from home, /poems and /faq | yes |
| Four policy pages present and linked from the footer | yes |

Five pages have an `<h1>` that is not a substring of the `<title>` — "Notes" titled "Writing",
"The books" titled "Books", a home page headed with a line of poetry. These are editorial choices,
not defects, and are recorded here so nobody re-reports them.

### Before and after

| Old site — 1,646 sitemap URLs | | Candidate — 29 pages | |
|---|---:|---|---:|
| blog posts and index | 917 | book pages | 12 |
| blog tag/category listings | 694 | core pages | 9 |
| storefront | 15 | policies | 4 |
| `/archive-N` | 14 | series pages | 3 |
| other pages | 6 | notes posts | 1 |

The fall from 1,646 to 29 is almost entirely the blog: 916 posts, 691 tag listings, 3 category pages
and the index, archived rather than migrated per Brian's decision of 29 August 2026, with 690 of them
redirecting to their specific poem on brianspoems.com. The storefront goes because direct sales are
retired; the `/archive-N` pages were Squarespace's leftovers from earlier layouts. **All 1,653
legacy URLs have a row in `redirect-map.csv`** — nothing was dropped silently.

### Visitor journeys — 76 checks, 0 failures

Each journey run at 1280 px and 390 px, in light and dark, plus a keyboard-only pass:

discover a book from the home page → open its page → find a correctly-attributed Amazon link ·
understand what the anthology collects · read a poem and see which book it came from ·
evaluate the retreat: dates, venue, price, capacity · express interest ·
reach Brian · find the permissions · recover from a 404.

Keyboard: first Tab reveals the skip link, Enter moves focus to `<main>`, all 60 sampled controls
show a focus ring, and all six FAQ disclosures open with Enter.

Two apparent failures in the first run were **my harness, not the site**, and are recorded because
a test that lies is worse than no test: the local server was not serving `404.html` the way
Cloudflare's `not_found_handling` does, and a date assertion was case-sensitive against an eyebrow
that CSS renders in capitals. Both harness bugs fixed; the site was right both times.

### Regression

| | Result |
|---|---|
| Responsive sweep, 29 pages × 7 widths × 2 themes | **406 checks, 0 problems** |
| Enforced CSP, 29 pages × 2 themes | **58 loads, 0 violations, 0 console errors** |
| Theme script and webfonts | 58 / 58 both |
| Redirect rules | 1,653 / 1,653 resolving as intended |
| Environment separation | beta and production artifacts both verified distinct and correct |

### Performance — an honest regression report

Same lab profile as Prompt 06: Chromium, 390 × 740, DPR 3, 4× CPU, 1.6 Mbps / 150 ms.

| Template | Prompt 06 | Candidate | |
|---|---|---|---|
| home | 371 KB · 2160 ms | 467 KB · **2536 ms** | over the 2.5 s line |
| books | 334 KB · 852 ms | 425 KB · 932 ms | |
| book | 202 KB · 908 ms | 204 KB · 1048 ms | |
| poems | 192 KB · 856 ms | 194 KB · 932 ms | |
| retreat | 420 KB · 2380 ms | 422 KB · **2436 ms** | just under |
| contact | 141 KB · 812 ms | 142 KB · 900 ms | |

Home is the regression. What was tried and what it bought:

- `fetchpriority="low"` on the below-the-fold images: **no measurable change**. Chromium's preload
  scanner still queues them.
- Reducing the decorative retreat strip from the 1000 w file to the 700 w file on phones: **68 KB
  saved, LCP unchanged**. Kept anyway — it is a real saving with no visual cost, and the strip still
  renders at 2× density behind a dark band.

That the second change saved 68 KB and moved LCP by nothing is the finding. **Home LCP is not
bandwidth-bound on the lazy images; it is serialised behind the critical path** — 14 KB of HTML,
22 KB of CSS, 113 KB of preloaded fonts, then the 130 KB hero. At 200 KB/s that is about 1.4 s of
pure transfer before the hero can finish, and ~2.5 s with latency and a 4× CPU throttle is what that
adds up to.

Getting under 2.5 s from here means giving something up: not preloading the fonts (trading LCP for
a font swap and the CLS that comes with it), or a visibly softer hero, which was measured and
rejected in Prompt 06. **Neither trade is worth making on a laboratory number.** This is a 1.6 Mbps
single-connection figure; production is HTTP/2 from a CDN edge. Recorded as a known measurement to
settle with field data after cutover, not as a defect to paper over now.

`poems` CLS was measured once at 0.0595 and twice at 0 in the same session — the italic font swap,
same root cause as the retreat hero's 0.0352, and within the same accepted band (N09).

### Content review against 18 September 2026

Every date, deadline and time-sensitive claim on all 29 pages was checked against today.

**Correct:** the retreat's dates (stated twice — the hero eyebrow and the Dates section), the venue
and address, the 150-acre figure, the fifty-place capacity, the $350/$400 prices, the refund tiers,
the airport pickup which is properly hedged as "we'll try to arrange", the single Notes post's date,
and the policy revision dates. Three apparent stray years (2030, 2061, 2054) are ISBN digits.

**Two things Brian must settle** — both raised here, neither fixed unilaterally:

- **D-19: the Wendell Berry permission claim has no recorded source.** The page asserts that
  Counterpoint Press granted permission to use excerpts. Nothing in this project records where that
  came from. It most likely came from the same promotional event notice that produced the
  "450 acres" error removed in F06. A public claim naming a publisher's licence should not stand on
  a flyer.
- **D-20: the early rate expires before registration is scheduled to open.** Registration is
  "opening soon" with no fixed date, and the $350 rate ends on 1 December — 74 days out. Not a copy
  defect; a timing decision.

### Decisions still open, not converted into passes

| | Status |
|---|---|
| **D-08** — are the retreat's accommodation promises confirmed against the Bergamo agreement? | **open and blocking F06.** The page still states "Single occupancy, private bathroom. No roommates, no negotiating" and "Every meal… Dietary needs accommodated" flatly, sourced from a promotional document. Airport pickup was correctly hedged; these were not. |
| **D-07** — which text is authoritative for a poem? | **open.** F08 was implemented by aligning to the archive ("Truth" → "Behold"), and is reversible, but nobody has checked the printed book. |
| **D-19** — the Berry permission claim | **open**, raised in this prompt |
| **D-20** — early rate vs registration opening | **open**, raised in this prompt |
| **D-04** — how site email actually sends | **open, but not blocking the beta.** The site sends no email today; contact and retreat interest are both `mailto:`. It becomes blocking when registration opens. |
| **D-03** — .org after cutover | decided: stays as an open, unindexed beta (D-15) |

### What is still unverified, and cannot be verified here

1. Everything about production behaviour. No artifact has been served from `www.brianmueller.com`.
2. The 734 redirect rules have been tested against a faithful local model of Cloudflare's documented
   `_redirects` semantics — not against Cloudflare.
3. Safari and Firefox. Only Chromium is available; `device-checklist.md` is the real-device list.
4. Screen readers.
5. Field performance. No Chrome UX Report data exists for a noindexed beta.
6. The twelve Amazon affiliate links resolve to the correct product pages — the redirect chain
   lands on the right ASIN every time — but return **HTTP 500 to this client**, which is Amazon
   refusing a datacentre IP. That is not evidence the links are broken, and not evidence they work
   for a visitor. Brian should click two or three from a phone.
