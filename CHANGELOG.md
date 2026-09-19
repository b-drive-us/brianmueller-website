# Changelog

Versions are [semantic](https://semver.org/) and describe **the website**, not the
repository's tooling. For a site with no public API that means, in practice:

- **major** — the site changes in a way a visitor or an inbound link would notice:
  URLs move, a section appears or disappears, the design is reworked.
- **minor** — new pages or features, or a round of fixes and improvements shipped
  together. Nothing a returning visitor would be surprised by.
- **patch** — a correction to a single thing, shipped on its own.

The running version is stamped into every page as `<meta name="version">` and
enforced by `tools/check-build.mjs`, so what is live can be read from the site
itself rather than inferred from a deployment log:

```
curl -s https://www.brianmueller.com/ | grep 'name="version"'
```

---

## 1.2.0 — 19 September 2026

**Astro 5.18.2 → 7.3.3.** `npm audit` goes from 1 critical, 1 high and 1 low to
zero. Nothing a visitor sees changes: 68 full-page renders across all 29 pages,
two viewports and both themes are **pixel-identical** to 1.1.0.

### The upgrade needs two configuration lines, and neither is optional

**`vite.build.cssTarget`.** Astro 7 minifies CSS with Lightning CSS, which by
default rewrites every width media query to Level 4 range syntax —
`@media (max-width:640px)` becomes `@media (width<=640px)`. Browsers older than
Chrome 104 / Firefox 102 / **Safari 16.4** do not parse that and skip the whole
block. All six of this site's breakpoints are width queries, so on an iPhone
still on iOS 15 the mobile layout would simply stop applying, silently. Naming a
browser target restores the classic syntax.

**`compressHTML: false`.** Astro 7's HTML compressor removes the whitespace
between a text node and an adjacent *inline* element. Prose written across two
source lines comes out with the words run together:

```
a chapter of
<a href="https://illuman.org">Illuman</a>     renders as   "a chapter ofIlluman"
```

**12 places across 7 pages**, including the contact page's line giving Tom
Sparough's address, the retreat page's Illuman attribution, and the `/poems`
closing paragraph. Astro 5's compressor did not do this.

This is the same defect that got the 7.3.2 upgrade rejected in Prompt 07, and
**it is not fixed in 7.3.3.** The 18 September audit said it was; that was wrong,
and the correction matters more than the claim did. The audit compared rendered
text after collapsing whitespace, which erases exactly this difference — a gate
blind to the one bug it existed to catch. `tools/compare-build-text.py`, written
in Prompt 07 for precisely this, finds all 12 and exits 1. It is the gate for
this upgrade and for any future one; the ad-hoc comparison is not.

Cost of turning the compressor off: **+142 gzipped bytes per page**, +4.0% of
total HTML weight. Against 12 places where two words run together in Brian's own
prose, that is not a close call.

### Verified

- `tools/compare-build-text.py`: 29 pages, no regressions — and exit 1 with 12
  findings on the unfixed build, so the gate is known to work in both directions.
- **68 of 68 renders pixel-identical** to 1.1.0 (mobile and desktop, light and
  dark, full page, 2-pixel channel tolerance).
- All three CSP script hashes unchanged, so `_headers` needed no edit.
- Media queries confirmed still in `max-width:` form in the built stylesheet.
- Every logical-property shorthand Lightning CSS expanded (`padding-block` →
  `padding-block-start`/`-end`, and 16 others) checked value by value.
- 128 page loads under the enforced CSP at 305, 320, 390 and 1440 px in both
  themes: zero console errors, zero CSP violations, zero overflow.
- Contrast re-measured on everything 1.1.0 fixed; all still pass.

---

## 1.1.0 — 19 September 2026

The first maintenance release, built from two independent audits of the live
site: the Claude audit of 18 September (`M01`–`M18`) and the Codex audit
delivered on 19 September (`R01`–`R08`). Eight of Codex's findings and eighteen
of Claude's, two of which were the same finding, made twenty-four distinct items;
this release ships the ones that need no decision from Brian. The merged plan is
`docs/site-audit/maintenance-1.1.0-plan.md`.

### Fixed — things a visitor could see

- **The main button on `/poems` was almost unreadable.** "Search the whole
  collection" rendered dark brown on brown at **1.37:1** in light and 1.26:1 in
  dark. `.archive-note a` (specificity 0,1,1) beat `.btn` (0,1,0) and handed the
  button the link colour, which is a near-match for its own background. Found
  independently by both audits, with identical measurements (`M01` / `R02`).
- **The retreat's date line failed contrast over its photograph.** `JANUARY
  15–17, 2027 · BERGAMO CENTER` is the most commercially important line on the
  site and more than half its glyph pixels sat below 4.5:1. The cause was that
  `.hero-eyebrow` was the one element in the hero still reading a *theme* token
  (`--wheat`) instead of a fixed light colour, on a surface that is dark
  whatever the page theme is. Both hero ledes and the veil were re-measured at
  the same time; nothing in either hero is now below **4.56:1** (`M02`).
- **27 legacy poem links reached a book announcement instead of the poem.** See
  below.
- **A hostname could not wrap.** `static.cloudflareinsights.com` in the Privacy
  Policy pushed the page wider than the viewport once a browser reserved 15 px
  for a scrollbar — below about a 315 px client area (`R08`).
- **`/disclaimer` skipped a heading level**, h1 straight to h3 (`M10`).
- **Footer links gained touch padding.** They cleared WCAG 2.2 AA 2.5.8 only
  through the spacing exception, by 3 px (`M11`).

### Fixed — the poem redirects

921 legacy URLs pointed at `/blog`, a page carrying one book announcement. Codex
counted those as poem pages; **226 of them actually are** — the rest are tag,
category and date-archive listings that never held a poem.

- **27 of the 226 are now real poem redirects.** 15 are confirmed outright: the
  original text is at the destination, checked in a browser. The other 12 share
  a title with an archive poem but not its text — the old blog post was the
  longer piece and the archive holds the published poem of that name. They ship
  because the poem of the same name beats a generic fallback, and they are
  recorded as `medium - title match, text differs` with a list for Brian in
  `docs/site-audit/poem-matches-for-review.md`. Three bugs had hidden all 27: the old site dropped apostrophes from slugs while the
  archive writes them as a separator (`its-all-a-story` → `it-s-all-a-story`);
  199 URLs carry a date prefix the matcher compared whole instead of by final
  segment; and twelve poems were simply retitled between the two sites. All
  three produce false *negatives*, so no existing redirect is implicated.
- **The fallback moved from `/blog` to `/poems`**, and `/poems` now carries a
  line written for someone arriving from an old link. A reader who followed a
  ten-year-old link is told where the poems went and how to search them, instead
  of meeting an announcement for a different book.
- **`tools/generate-redirects.mjs` now exists.** `_redirects` has claimed since
  Prompt 09 to be generated by it; it was not, and 763 lines had to be kept in
  step with the CSV by hand. The generator was verified to reproduce the live
  file byte-for-byte before any change was made, and `--check` now runs on every
  build.

### Added

- **Icons.** There were none: `/favicon.ico`, `/apple-touch-icon.png` and four
  other icon paths all returned 404, so every first visit made a failed request
  and every tab and bookmark showed a blank page icon. The mark is the site's
  own Newsreader **B**, rendered from the repository's font file, with a
  dark-mode rule inside the SVG (`M07`).
- **CSP hash verification in the build.** `script-src` allows three SHA-256
  hashes and no `unsafe-inline`. Nothing checked that they still matched the
  scripts actually shipped, so any edit to an inline script would have silently
  stopped it running, with a console error as the only evidence. This matters
  more with payments coming (`M06`).
- **`manifest-src 'self'`** in the CSP, which the new web manifest needs:
  `manifest-src` falls back to `default-src`, and that is `'none'`.

### Changed

- **`npm run build` no longer means `beta`.** It now fails and names the three
  environments. `check-build.mjs` can tell whether an artifact is internally
  consistent; it cannot know which Worker the artifact is about to land on, and
  the default pointed at the one you least want to deploy by accident (`M16`).
- **`workers_dev` is off.** The production Worker's `workers.dev` hostname was
  serving a second, fully indexable copy of the site (`M04`).
- Removed `sea-900.webp`, `sea-1600.webp` and `retreat-hero-1456.webp` — 464 KB
  referenced nowhere (`M12`) — and a duplicate `section` rule whose first
  declaration was dead (`M13`).

### Still open

`R03` (the Cookie Policy describes a theme reset the code does not perform),
`R07`, and the Astro 5 → 7 upgrade are staged for the next increments. `R04`,
`R05`, `R06` and the remaining 199 poem URLs need Brian's decisions; they are
listed in §5 of the plan.

---

## 1.0.0 — 19 September 2026

**The first numbered release of the rebuilt brianmueller.com.**

The site itself went live on **18 September 2026** at commit `4e9f687`, when
`www.brianmueller.com` was cut over from Squarespace to Cloudflare Workers. It ran
for a day without a version number at all: `package.json` still carried npm's
`0.1.0` scaffold default and the repository had no tags. `1.0.0` names what was
already there, and adds the machinery to keep naming it.

### What 1.0.0 is

A static Astro site, built to HTML, served from Cloudflare Workers. 28 published
pages plus a real 404.

- **Twelve books**, each with its own page — cover, blurb, reader quote, buy link,
  and its place in a series. Three series pages gather them.
- **Eleven poems**, one from each collection, with brianspoems.com named as the
  definitive archive.
- **The retreat** — Rooted in the Land, January 15–17 2027, as a full page with an
  email interest list. Payments are not part of this release.
- **About, Contact, FAQ, Notes**, and four legal pages written against what the
  site actually does rather than against a template.
- Light and dark themes with a labelled toggle that remembers the choice.
- Self-hosted subset fonts; no third-party request leaves the page except the
  disclosed Cloudflare analytics beacon.

### Carried over from the old site

- **1,653 legacy URLs** classified, with 734 redirect rules — every one tested. 690
  poem posts were matched to brianspoems.com by comparing their text, not their
  slugs, which changed 20 of the answers.
- **24 legacy homepage fragments** (`/#jonah`, `/#mwfc-1`) resolved in the browser,
  because a fragment never reaches the server.
- **916 blog posts** archived in full rather than migrated.

### Security and delivery

- Content-Security-Policy at `default-src 'none'`, `script-src` limited to three
  SHA-256 hashes with no `unsafe-inline` anywhere. Tested enforced, not report-only.
- `X-Content-Type-Options`, `Referrer-Policy`, `Cross-Origin-Opener-Policy`, a
  permissions policy denying seventeen unused features, and `frame-ancestors`,
  `form-action` and `base-uri` all `'none'`.
- HTTP redirects to HTTPS; the apex redirects to `www`.
- The build environment is named, never guessed: `SITE_ENV` resolves to
  `production`, `beta` or `preview` and has no default. `tools/check-build.mjs`
  fails the build on any artifact that does not match the environment it claims.

### Added in this release

- **The version stamp.** `<meta name="version">` on every page, read from
  `package.json` at build time by `astro.config.mjs`. `check-build.mjs` fails the
  build if any page is missing it or disagrees with it.
- **CHANGELOG.md** — this file.

### Known, and deliberately not fixed here

The [18 September audit](docs/site-audit/audit-2026-09-18.md) found 18 items. They
are the content of 1.1.0, not of this release, which names the site as it shipped.
The one a visitor notices: the "Search the whole collection" button on `/poems`
renders brown-on-brown at 1.37:1 (`M01`).

---

## Before 1.0.0

Development ran from 28 August to 18 September 2026 and is recorded commit by
commit, and in `docs/site-audit/` — `findings.md`, `decisions.md`,
`verification.md`, and `cutover-2026-09-18.md` for the launch itself.
