# Findings ledger

Original claims are from the audit of **2026-09-09**. Dispositions are assigned in Prompt 01;
everything below marked *(not yet verified)* carries the original claim only.

Disposition values: `reproduced` · `already resolved` · `not reproduced` · `incorrect as stated` ·
`launch condition` · `owner decision required`.
Implementation values: `open` · `in progress` · `implemented` · `verified`.

---

## F01 — Contact page is unfinished · High · Stage 03

**Original claim (2026-09-09).** `/contact` shows an internal note beginning "The form needs
rebuilding" describing the Squarespace migration and a future Cloudflare Worker. No form, no email
link. FAQ, Privacy, Terms, Disclaimer and the 404 page all route visitors there.

| Sub-issue | Claim | Disposition | Impl |
|---|---|---|---|
| F01.1 | Public copy contains internal implementation notes | *(not yet verified)* | open |
| F01.2 | No usable contact method on the page | *(not yet verified)* | open |
| F01.3 | FAQ depends on it for messages, permissions, PDFs, review copies | *(not yet verified)* | open |
| F01.4 | Privacy / Terms / Disclaimer / 404 depend on it | *(not yet verified)* | open |

**Prompt 00 note.** The site has no form backend of any kind and no email-sending path. See
`decisions.md` D-04.

---

## F02 — Legacy URL migration not demonstrated · High · Stage 09

**Original claim.** The .com sitemap lists 1,646 URLs. Eight representative legacy paths returned
404 on the beta: `/home`, `/store`, `/store/p/bull-head`, `/store/p/the-invitation`,
`/living-workshop`, `/living-workshop/in-the-mirror`, `/archive-1`, `/refund-policy`.
The audit explicitly notes this does not prove production redirect rules are absent.

| Sub-issue | Claim | Disposition | Impl |
|---|---|---|---|
| F02.1 | Eight legacy paths 404 on beta | *(not yet verified)* | open |
| F02.2 | No redirect configuration exists for the legacy inventory | *(not yet verified)* | open |
| F02.3 | Homepage fragments (`/#trust`, `/#contact`, …) unhandled | *(not yet verified)* | open |
| F02.4 | `/s/` downloads and cart URLs need an explicit disposition | *(not yet verified)* | open |

**Prompt 00 note.** 915 legacy `/living-workshop/` posts were deliberately archived, not migrated
(Brian's decision, 2026-08-29; see `content-sources.md`). That decision removes the *content*
question but not the *redirect* question. No redirect rules exist in `public/_headers` or
`wrangler.jsonc` today.

---

## F03 — Staging indexing controls need a cutover checklist · High · Stage 08

**Original claim.** All 28 pages carry HTML `noindex, nofollow` and the header
`X-Robots-Tag: noindex, nofollow`. `robots.txt` mixes a Cloudflare-managed `Allow: /` block with a
staging `Disallow: /`. No sitemap at `/sitemap.xml` or `/sitemap_index.xml`.

| Sub-issue | Claim | Disposition | Impl |
|---|---|---|---|
| F03.1 | HTML robots meta noindex on every page | **reproduced 2026-09-12** — intentional staging guard | open (cutover) |
| F03.2 | `X-Robots-Tag: noindex, nofollow` header | **reproduced 2026-09-12** | open (cutover) |
| F03.3 | robots.txt has both managed Allow and staging Disallow | **reproduced 2026-09-12** | open (cutover) |
| F03.4 | No sitemap at either location | **reproduced 2026-09-12** — all three candidates 404 | open |
| F03.5 | No canonical URL configuration | *(not yet verified)* | open |

**Prompt 00 note.** F03.1–F03.3 are the deliberate staging guard and must stay until cutover. The
*defect* inside F03 is F03.4/F03.5: there is no sitemap and no environment-aware canonical
configuration ready for production.

---

## F04 — Poem sharing permissions contradict one another · High · Stage 04

**Original claim.** The footer licenses poems broadly under CC BY-NC-ND 4.0 on every page. The FAQ
limits that licence to the Bull and Poem of the Day series and says Cock-A-Doodle-Doo may not be
copied without permission. Trust Stillness and the collaborative Men Writing for Change volumes are
not classified. Terms section 6 requires written permission for redistribution without recognising
the Creative Commons grant.

| Sub-issue | Claim | Disposition | Impl |
|---|---|---|---|
| F04.1 | Footer grant is broader than the FAQ grant | *(not yet verified)* | open |
| F04.2 | Trust Stillness unclassified | *(not yet verified)* | open |
| F04.3 | Men Writing for Change (other authors' work) unclassified | *(not yet verified)* | open |
| F04.4 | Terms contradicts the CC grant | *(not yet verified)* | open |
| F04.5 | brianspoems.com carries its own broad statement | *(not yet verified)* | owner decision |

**Prompt 00 note.** F04.3 is the sharpest one. The Men Writing for Change volumes contain poems by
retreat participants, not by Brian. A blanket footer licence over "poems" cannot grant rights in
another man's work. This needs Brian's decision, not a wording fix. See `decisions.md` D-06.

---

## F05 — Policy text retains Squarespace-era claims · Medium · Stage 04

**Original claim.** Privacy describes Squarespace hosting and Google/Squarespace Analytics; neither
appears in the beta source. Cookie Policy promises browser links, resources and a contact
destination that are missing, and contains run-together text "configuration.Third-Party Cookies".
Terms still discusses direct orders and downloads while purchases now go to Amazon.

| Sub-issue | Claim | Disposition | Impl |
|---|---|---|---|
| F05.1 | Privacy names Squarespace as host | *(not yet verified)* | open |
| F05.2 | Privacy claims Google + Squarespace Analytics | *(not yet verified)* | open |
| F05.3 | Cookie Policy's promised links are missing | *(not yet verified)* | open |
| F05.4 | "configuration.Third-Party Cookies" run together | *(not yet verified)* | open |
| F05.5 | Privacy and Cookies do not cross-reference | *(not yet verified)* | open |
| F05.6 | Terms describes direct sales that no longer exist | *(not yet verified)* | owner decision |

**Prompt 00 note.** Two real data flows the policies do not mention and the audit could not see
from page source: Cloudflare Web Analytics (a beacon script is injected by the platform) and the
`localStorage` theme preference. Both need describing. Recorded as **N01** below.

---

## F06 — Venue description conflicts with the venue · Medium · Stage 02

**Original claim.** The retreat page says "Four hundred and fifty acres" in one place and 150 acres
in two others. Bergamo's own About page says 150 acres. The beta says "forty minutes from downtown
Dayton"; the venue describes itself as minutes away. The street address matches.

| Sub-issue | Claim | Disposition | Impl |
|---|---|---|---|
| F06.1 | 450 acres contradicts 150 acres | **reproduced 2026-09-12** | open |
| F06.2 | "forty minutes from downtown Dayton" unsupported | **reproduced 2026-09-12** | open |
| F06.3 | Private bathroom / meals / dietary / airport pickup need organiser evidence | *(not yet verified)* | owner decision |

**Prompt 00 note — this one is mine and it is the worst finding in the report.**
`src/pages/retreat.astro:87` reads "Four hundred and fifty acres of quiet, forty minutes from
downtown Dayton". **Both figures were invented during authoring.** The source document
(`05 - Reference/Rooted in the Land - Event Notice.docx`) says 150 acres and "near the Dayton
airport", and says nothing about forty minutes or downtown. This is fabricated venue detail
published on a page that will take money. Fix in Prompt 02 and re-check every other number on that
page against the event notice rather than against my own prose.

---

## F07 — Archive count is stale and mislabelled · Medium · Stage 02

**Original claim.** Home and Poems promote 1,832 poems. The archive reports 1,834 pieces:
1,675 poems, 38 prose, 121 haiku. Calling the whole archive "poems" is inaccurate, and a hard-coded
total guarantees future drift.

| Sub-issue | Claim | Disposition | Impl |
|---|---|---|---|
| F07.1 | 1,832 is stale | **reproduced 2026-09-12** — appears in `index.astro:71` and `poems.astro:22` | open |
| F07.2 | "poems" mislabels a mixed collection | **reproduced 2026-09-12** | open |
| F07.3 | Hard-coded totals will drift again | **reproduced 2026-09-12** | open |

**Prompt 00 note.** The figure came from `07 - Poem Database/collected-poems-catalog.json`
(compiled June 2026): 1,832 = 1,673 poems + 121 haiku + 38 prose. The archive has since added two
poems. The audit's recommended durable wording is the right fix.

---

## F08 — Jonah sample title disagrees with the archive · Medium · Stage 02

**Original claim.** The Poems page labels the Jonah selection "Truth" with subtitle "Behold her
smile!". The archive publishes the same body as "Behold", subtitled "…the truth in her smile.",
attributed to Jonah, March 22. The site calls the archive definitive, which makes the mismatch worse.

| Sub-issue | Claim | Disposition | Impl |
|---|---|---|---|
| F08.1 | Title and subtitle disagree with the designated authority | *(not yet verified)* | owner decision |
| F08.2 | Samples lack direct archive permalinks | *(not yet verified)* | open |

**Prompt 00 note.** The site's title/subtitle came from the June 2026 catalog, which is a third
source — so there are potentially three versions. Which is authoritative is Brian's call
(`decisions.md` D-07), not a text substitution.

---

## F09 — Book metadata differs from the linked editions · Medium · Stage 02

**Original claim.** Page counts: Bull Heart 118 vs listing 100; Jonah 478 vs 476; MWFC Vol 1 52 vs
48. Years: Bull Head 2002 vs listing 2007-06-01; Tomorrow Could Be Wonderful 2017 vs 2019-04-12.
Trust Stillness shows no page count; its listing says 113. All twelve primary ISBNs match and pass
their check digits.

| Sub-issue | Claim | Disposition | Impl |
|---|---|---|---|
| F09.1 | Bull Heart 118 vs 100 (the .com store also says 100) | *(not yet verified)* | open |
| F09.2 | Jonah 478 vs 476 | *(not yet verified)* | open |
| F09.3 | MWFC Vol 1 52 vs 48, plus the second-printing ISBN | *(not yet verified)* | open |
| F09.4 | Bull Head first-publication vs linked edition date | *(not yet verified)* | open |
| F09.5 | Tomorrow Could Be Wonderful ditto | *(not yet verified)* | open |
| F09.6 | Trust Stillness page count absent | **reproduced 2026-09-12** — no `pages` field in `books.json` | open |
| F09.7 | Publisher/imprint labels vary across listings | *(not yet verified)* | owner decision |

**Prompt 00 note.** Page counts and years came from the disabled Squarespace pages recovered on
2026-08-29 — i.e. Brian's own published copy, not from Amazon. A retailer disagreeing with the
author's own record is not automatically the author being wrong. The distinction the site is
missing is "first published" versus "the edition this link sells".

---

## F10 — Contrast failures in both themes · Medium · Stage 05

**Original claim.** Dark theme: white on button `#E09A66` ≈ 2.34:1; hover `#F0B183` ≈ 1.85:1; text
is 13.6 px semibold, which is not large text, so it needs 4.5:1. Light theme: secondary `#7C7065`
on `#F7F4EF` ≈ 4.39:1, below 4.5:1. Suggested: dark text `#17130F` on `#E09A66` ≈ 7.90:1.

| Sub-issue | Claim | Disposition | Impl |
|---|---|---|---|
| F10.1 | Dark-theme filled button fails (≈2.34:1) | *(not yet verified — recompute)* | open |
| F10.2 | Dark-theme button hover fails (≈1.85:1) | *(not yet verified)* | open |
| F10.3 | Light-theme secondary text marginal (≈4.39:1) | *(not yet verified)* | open |
| F10.4 | Focus and disabled states not separately checked | *(not yet verified)* | open |

**Prompt 00 note.** `#E09A66` is `--ember` in the dark palette and `#7C7065` is `--ink-3` in the
light palette — both are design tokens, so a token-level fix corrects every usage at once.

---

## F11 — HTTP does not redirect to HTTPS · Medium · Stage 07

**Original claim.** `http://brianmueller.org/` returned HTTP 200 and stayed on HTTP. HTTPS works.
`www.brianmueller.org` did not resolve — a staging-only observation.

| Sub-issue | Claim | Disposition | Impl |
|---|---|---|---|
| F11.1 | HTTP serves 200 with no redirect | **reproduced 2026-09-12** — `curl http://brianmueller.org/` → `HTTP/1.1 200 OK`, no `Location` | open |
| F11.2 | `www.brianmueller.org` does not resolve | **reproduced 2026-09-12** — DNS failure | open (low) |
| F11.3 | Production hostname preference undecided | *(not yet verified)* | owner decision |

**Prompt 00 note.** `brianmueller.com` currently 301s to `www.brianmueller.com`, so the incumbent
canonical host is the www variant. Whether the new site keeps www is D-02.

---

## F12 — Metadata and page identity incomplete · Medium · Stage 08

**Original claim.** All twelve book descriptions are exactly 150 characters and several end
mid-word ("mind an", "poems int"). Three pages share the title "Men Writing for Change — Brian J.
Mueller". Home and Books reuse one description. No canonical, Open Graph, Twitter card or JSON-LD
anywhere on the 28 pages.

| Sub-issue | Claim | Disposition | Impl |
|---|---|---|---|
| F12.1 | Descriptions truncated mid-word at exactly 150 chars | *(not yet verified)* | open |
| F12.2 | Three pages share one title | *(not yet verified)* | open |
| F12.3 | Home and Books share a description | *(not yet verified)* | open |
| F12.4 | No canonical link | *(not yet verified)* | open |
| F12.5 | No Open Graph / Twitter card | *(not yet verified)* | open |
| F12.6 | No structured data | *(not yet verified)* | enhancement, not a defect |

**Prompt 00 note.** F12.1 has an identified cause: `books/[slug].astro` passes
`description={book.blurb.slice(0,150)}` — a hard character slice, which is exactly the mechanism the
audit describes.

---

## F13 — Copy errors and count explanations · Low · Stage 02

| Sub-issue | Claim | Disposition | Impl |
|---|---|---|---|
| F13.1 | "allowing the waves carry you" missing "to" | **reproduced 2026-09-12** — `books.json`, Trust Stillness blurb | open |
| F13.2 | Tomorrow Could Be Wonderful opens with a fragment | **reproduced 2026-09-12** — verb lost when the blurb was trimmed | open |
| F13.3 | "which has often lead to war" in The Way of Council | *(not yet verified)* | owner decision — poem text |
| F13.4 | "Twenty-four years of writing" vs publishing span | *(not yet verified)* | open |
| F13.5 | Poems intro should explain eleven samples vs twelve books | *(not yet verified)* | open |
| F13.6 | Mixed British/American spelling ("favourite", "licence") | *(not yet verified)* | open |
| F13.7 | Our Grip Weakens loses two indentations vs the archive | *(not yet verified)* | open |

**Prompt 00 note.** F13.1 is inherited from Brian's own Squarespace homepage, so it is his book
blurb, not my prose — correcting it still needs his nod. F13.2 is mine: the source sentence read
"…poet Brian Mueller provides you with heartfelt meditations…" and the subject was lost when I
trimmed the title out. F13.6 is mine throughout.

---

## F14 — Retreat registration needs a prelaunch operating plan · Medium · Stage 03

**Original claim.** The Registration button correctly scrolls to "Opening soon". "Tell me when it
opens" is a mailto with a subject line, not a subscription. Dates, price steps and capacity are
internally consistent but not independently verified as booking commitments.

| Sub-issue | Claim | Disposition | Impl |
|---|---|---|---|
| F14.1 | CTA label implies signup, opens an email draft | *(not yet verified)* | open |
| F14.2 | No stated opening date | *(not yet verified)* | owner decision |
| F14.3 | Nobody named as recipient/follow-up owner for interest | *(not yet verified)* | owner decision |
| F14.4 | Cancellation / refund / accessibility not stated beside registration | *(not yet verified)* | open |
| F14.5 | Venue booking and capacity not independently evidenced | *(not yet verified)* | owner decision |

**Prompt 00 note.** This is the finding with a real deadline attached. See `decisions.md` D-01.

---

# New findings

## N01 — Policies omit two data flows that do exist · Medium · Stage 04

Cloudflare injects its Web Analytics beacon (`static.cloudflareinsights.com`) into every page, and
the theme toggle writes a `theme` key to `localStorage`. Neither is described in Privacy or Cookies.
The audit could not see the beacon because it is injected at the edge, not present in source.
Known since 2026-08-29; recorded here as a finding rather than a note.

## N02 — No sitemap generation exists at all · Medium · Stage 08

Distinct from F03.4, which observes the 404. There is no `@astrojs/sitemap` integration and no
hand-written sitemap, so there is nothing to publish at cutover. Adding it is new work, not a
configuration change.

## N03 — No automated checks of any kind · Medium · Stage 10

No test runner, linter, typechecker or CI. Every regression in this project so far — the inverted
poem indent, the stale-stylesheet cache bug, the centred sections — was found by eye. The pack asks
for "meaningful checks for behavior, security boundaries, redirects, and content consistency"; there
is no harness to put them in.

## N04 — Pushing to `main` publishes · High (process) · Stage 00

Cloudflare Workers Builds deploys on push to `main`. There is no held-back deploy step. Prompts
01–10 must therefore work on an unpushed branch. Recorded so it is not rediscovered mid-stage.

---

## New during Prompt 06

### N05 — Theme button nested inside `<nav>`, so the phone header could never collapse

**Severity:** medium (layout), low (semantics)
**State:** fixed

The mobile header rule placed `.theme-toggle` at grid row 1, column 2, beside the wordmark. It had
no effect, because the button was a child of `<nav>` rather than of `.bar` — grid placement only
applies to a grid container's own children. The header therefore stayed three stacked rows at
164 px on a phone. Moving the button out of `<nav>` is also the more accurate markup: a theme
control is not navigation, and it should not be announced as a navigation link.

### N06 — `.nav` inherited `flex-wrap: wrap`, making the narrowest screens worst

**Severity:** medium
**State:** fixed

The narrow-screen block set `overflow-x: auto` on `.nav` intending a single scrolling row, but did
not override `flex-wrap: wrap` from the base rule. At 320 px the six links broke to a second line
and the header grew to **172 px** — taller than at 390 px. A narrow-screen rule that makes the
narrowest screen worse is the rule failing at exactly the width it exists for. With
`flex-wrap: nowrap` the header is a flat 115 px from 320 px to 430 px. Below 360 px the row is
masked at its right edge so the overflow reads as continuing rather than ending.

### N07 — Variable fonts shipped their full axis ranges

**Severity:** high (performance)
**State:** fixed

The six self-hosted faces were the Google originals, carrying Archivo wght 100-900 and Newsreader
wght 200-800 plus an optical-size axis 6-72. `base.css` declares `font-weight: 400 600` on every
`@font-face` and never asks for anything outside it, so roughly half of 528 KB was design space no
visitor could reach. Two of these faces are `rel=preload`ed on the critical path of every page.

Fixed by `tools/subset-fonts.py`, which instances the weight axis to 400-600 everywhere and pins
optical size at 22 on the italic faces only (upright faces keep it — headings run to ~87 px and
the display cut is visibly finer there). **528,560 -> 267,468 bytes**; the preloaded pair
166,788 -> 116,216. This is what moved LCP on every template, including pages with no images.

Originals retained in `tools/fonts-original/`. Output filenames carry `-v2` because
`public/_headers` caches `/fonts/*` for a year as `immutable` — a regenerated face must never
reuse a filename.

### N08 — No cache policy on `/img/` or `/covers/`

**Severity:** low
**State:** fixed

Artwork paths carried no `Cache-Control` at all, so repeat views revalidated every image. They now
get `max-age=604800` — a week, deliberately **not** `immutable` and deliberately short, because
these paths carry no content hash. The header file says so in place: replacing a picture in place
means some visitors see the old one for up to seven days, so artwork must be renamed rather than
overwritten. This is the same class of mistake as the stale-stylesheet bug earlier in the project,
kept bounded on purpose.

### N09 — Retreat hero CLS 0.0352 from a font-dependent line break

**Severity:** low
**State:** accepted, not fixed — reasoning recorded in `verification.md`

"Rooted in the Land" fits on one line in the fallback serif and wraps to two in Newsreader between
375 px and 430 px, so the hero grows 49 px when the webfont swaps. Inside the good CLS band
(<0.1). `font-display: optional`, reserving two h1 lines, and a metric-matched `size-adjust`
fallback were each considered and each costs more than 0.035 of CLS is worth. Revisit with field
data after cutover.
