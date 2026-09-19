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

## 1.4.1 — 19 September 2026

**Twenty-five more legacy poem URLs now reach a poem instead of a directory
page.** All of Section C of `docs/site-audit/poem-matches-for-review.md`, which
had been sitting unshipped because each entry asserts that two differently
titled pieces are the same work — Brian's call, not the matcher's.

Twelve are the same poem under a rewritten title (*Who'm I Kidding?* → *Who am
I Kidding?*, *One in the Same* → *One and the Same*, *Allow Yourself to Sit* →
*Choosing Presence*, and nine more). Confirmed by Brian (`D-33`).

The other thirteen settled themselves. Each of those blog posts ends with a
line Brian wrote at the time — *"This poem has been adapted and was originally
shared on April 6, 2017, and was titled Men and Their Feelings"* — which names
the original outright. All thirteen agreed with what the scores had proposed.
*Here I Am Love* gives only a date, 28 March 2017, which is the date the
archive carries for *Here I am!*, with the same opening line.

Worth stating plainly, because the redirect implies more than it delivers:
**these thirteen are adaptations, not the same text.** *Ode to Mortality* is a
rewrite of *Landfill*; the archive holds *Landfill* and the adaptation exists
nowhere. A reader following the old link arrives at the poem's ancestor.
Better than a directory page, and Brian's own closing line is what establishes
the lineage — but not the thing they clicked (`D-35`).

*Poets Wanted* and *Tsunami of Poems* are both adaptations of *Handful of
Poems*, so two legacy URLs share one destination. All twenty-four distinct
destinations verified HTTP 200 before the commit.

The 174 legacy URLs with no counterpart anywhere in the 1,834-poem archive stay
pointed at `/poems`, which carries a line written for a reader arriving from an
old link (`D-34`). That closes the legacy-redirect work: **52 of 226 reach a
poem, 174 reach `/poems`, none reach a dead end.**

Every row is recorded in `redirect-map.csv` with its evidence and approval, and
`public/_redirects` is regenerated from that file rather than edited.

---

## 1.4.0 — 19 September 2026

**Brian's address is no longer printed on the website.** It was in the markup as
a `mailto:` link on five pages — contact, retreat (twice), privacy policy,
cookies policy — which is precisely the shape an address harvester looks for.
Tom Sparough's was there twice as well. All seven are now assembled in the
browser by `src/components/MailLink.astro` and one script in `Base.astro`: the
two halves of each address are ROT13'd into data attributes and joined on load.

A grep of the whole build for anything shaped like an address now returns
nothing. That is the honest limit of it — the page is public, and a scraper that
runs JavaScript can assemble what a browser can. It defeats the ordinary case,
which is the one that fills an inbox. **The contact form is the real fix and is
next.**

Without JavaScript each of those spots falls back to a link to `/contact`,
never to a readable address. The registration button on the retreat page keeps
its appearance and remains clickable either way.

The new script is the fifth CSP hash. `tools/check-build.mjs` caught its absence
on the first build and then caught the stale hash left behind when the script
changed, which is the whole reason that guard exists.

**Review copies and PDF downloads are gone from the site.** The site offered PDF
copies on request in three places and carried a review-copy policy in two. There
is no mechanism behind either — /store has not existed for years. Reviewers are
welcome to write; the contact page covers it. PDFs may come back as something to
buy, at which point they get a page of their own rather than a footnote.
(Decision D-30.)

**The retreat schedule has gone.** "Six writing experiences" and the six-session
grid described a weekend that is not yet fixed. The heading is now *Multiple
Writing Experiences*, and what survived — evening social time, optional morning
prayer, wandering or rest, the Sunday open mic — reads as prose. The `.sessions`
CSS went with it.

**The anthology copyright note was wrong.** It said contributors released their
poems into the public domain. They granted Brian the copyright, which is why
those poems carry the same Creative Commons licence as everything else on the
site. Corrected on the questions page; the men are still credited as the authors
they are.

**The disclaimer now points at the licence.** Its fair-use section told readers
to seek permission from the copyright owner without mentioning that, for almost
everything here, permission has already been granted.

**HSTS is on at the edge** — `max-age=15552000`, no `includeSubDomains`, no
preload. Verified on the live origin rather than in the dashboard:

```
curl -sSI https://www.brianmueller.com/ | grep -i strict-transport
strict-transport-security: max-age=15552000
```

Cloudflare's control offers 0 or one to twelve months and nothing shorter, so
the graduated ramp that was planned (300s, then a day, then a year) is not
available on this zone; Brian chose the value Cloudflare marks as recommended.

Still open from the interview and carried to the next release: the page-count
caveats on *Bull Heart* and *Jonah*, *Men Writing for Change* Vol. 1 re-recorded
to its second printing, `author` and `editor` in the anthologies' JSON-LD, and
the Terms rewrite (`R07`).

---

## 1.3.0 — 19 September 2026

**The Cookie Policy now performs the reset it describes.** It said: *"So does
switching the theme button back — the site then simply follows whatever your
device is set to."* The toggle calls `localStorage.setItem` on every click and
has no path that removes the key, so switching back stored the opposite value.
The published instruction for removing stored data did not remove it. Found by
the Codex audit (`R03`).

### What changed

- **A real control.** `/cookies-policy` carries a **Use my device setting**
  button that deletes the `theme` key, drops the `data-theme` override and tells
  the header toggle to repaint. The two inline scripts talk through two events
  (`themechanged`, `themecleared`) rather than reaching into each other, so
  neither depends on the other loading first.
- **A status line** that says what is actually stored right now, updated live —
  including while the header toggle a few centimetres above is being used.
- **The copy rewritten**, and it says plainly that the page previously claimed
  the opposite: switching the header toggle back stores the other choice, it
  does not clear anything.
- **Two help links corrected.** Firefox pointed at *enhanced tracking
  protection* and Brave at a *marketing page* — neither explains clearing site
  data. Now the Firefox and Brave articles that do. All five opened in a real
  browser; Firefox's help site blocks automated requests, so that one is correct
  by article name but unconfirmed by rendering.

### Three things the first attempt got wrong

Each found by exercising the control rather than reading it, and worth recording
because they are the same class of defect as the bug being fixed:

1. **The status line went stale.** Clicking the header toggle left the page
   still saying "nothing is stored" until a reload — the page telling a visitor
   something false, on the page whose whole job is being accurate.
2. **Disabling the button dropped keyboard focus** to the top of the document.
   It is never disabled now: clearing a key that is not there is a no-op, so the
   button is always safe to press and the line always says what is true.
3. A keyboard test reported the button unreachable. That was the **test** being
   wrong — `.focus()` does not trigger `:focus-visible`. Confirmed reachable by
   real Tab navigation, with a 3px focus outline.

### The CSP guard earned its keep

The hash verification added in 1.1.0 caught **all four** inline-script changes
this work took. Each time it failed the build, named the hash to add and the
stale one to remove, and refused to proceed until `_headers` agreed. Without it
the theme toggle would have silently stopped running on all 28 pages, with a
console error as the only evidence. `script-src` now carries four hashes.

### Verified

- Behaviour walked end to end in both device schemes: fresh visit, pressing
  reset with nothing stored, toggle out and back (which **does** leave a value
  stored, as the new copy states), reset, and persistence across navigation.
- Keyboard: reachable by Tab, activates on Enter, focus retained afterwards.
- 128 loads under the enforced CSP at 305, 320, 390 and 1440 px in both themes —
  zero console errors, zero CSP violations, zero overflow.
- The button measures 6.74:1 light and 7.90:1 dark, hover 9.24 and 9.96, and the
  status line 7.88 and 8.76.

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
