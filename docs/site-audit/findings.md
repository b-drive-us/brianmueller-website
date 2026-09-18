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

---

## Prompt 07 — security and delivery

### F11 — no HTTP-to-HTTPS redirect — **reproduced live, fix needs Brian**

Confirmed against the running staging site, not inferred:

```
$ curl -sSI http://brianmueller.org/
HTTP/1.1 200 OK          <- served over plain HTTP, no redirect
$ curl -sSI "http://brianmueller.org/books/jonah?utm_source=test"
HTTP/1.1 200 OK          <- same on a deep path with a query
```

Calibrated first, so this is not a proxy artifact: the same client against
`http://www.cloudflare.com/` returns `301` with a `location:` header, so redirects
are passed through and brianmueller.org genuinely answers on port 80.

The fix is the **Always Use HTTPS** zone setting in Cloudflare, which issues a 301 to the
identical URL and preserves path and query.

**Fixed and verified the same day**, with Brian, in his own browser:

```
$ curl -sSI http://brianmueller.org/
HTTP/1.1 301 Moved Permanently
location: https://brianmueller.org/

$ curl -sSI "http://brianmueller.org/books/jonah?utm_source=test&x=1"
HTTP/1.1 301 Moved Permanently
location: https://brianmueller.org/books/jonah?utm_source=test&x=1

$ curl -sSL -o /dev/null -w "hops=%{num_redirects} final=%{url_effective}" http://brianmueller.org/
hops=1 final=https://brianmueller.org/
```

Path and query survive byte for byte, a 404 path redirects before it 404s, and the chain is one
hop with no loop. **F11 closed for brianmueller.org.** The same setting is still needed on
brianmueller.com at cutover — see D-12.

### F03 follow-up — robots.txt is not doing what it looks like it does

`https://brianmueller.org/robots.txt` is **66 lines**, not the 6 in this repo. Cloudflare
**prepends** a managed block, and that block contains:

```
User-agent: *
Content-Signal: search=yes,ai-train=no,use=reference
Allow: /
```

Our own `User-agent: * / Disallow: /` lands in a second group for the same user-agent token. A
crawler resolving that conflict can take the `Allow`. **The repository's robots.txt is not what is
keeping this site out of search results** — `X-Robots-Tag: noindex, nofollow` is, and that header
is confirmed present on pages, on assets, and on 404s at the live edge. The guard holds, but the
reason it holds was not the one written down.

The managed block also makes a decision on Brian's behalf: it declares `ai-train=no` and disallows
ClaudeBot, GPTBot, CCBot, Google-Extended, Applebot-Extended, Amazonbot, Bytespider and
meta-externalagent. That is a rights posture on a poet's work, arriving as a platform default.
Recorded as D-13 for a deliberate answer rather than silent acceptance.

**Brian's answer: turn it off and own the file. Done and verified the same day** —
`https://brianmueller.org/robots.txt` is now **5 lines**, exactly the file in this repository, down
from 66. The contradictory `Allow: /` is gone and the staging `Disallow: /` is the only group for
`User-agent: *`. Writing the production robots.txt, with Brian's own wording on AI training, is
Prompt 08's work; `public/robots.txt` stays `Disallow: /` until cutover.

### N10 — Astro 5 is end-of-life with ten open advisories, and the upgrade breaks the prose

**State: not upgraded, deliberately. Recorded as D-11.**

`npm audit` reports astro ≤7.2.7 as critical across ten advisories. There is **no patched 5.x** —
the line ends at 5.18.2, which is what is installed. The fix is 7.3.2, two majors up.

Every advisory was checked for reachability against this build rather than counted:

| Advisory | Reachable here? |
|---|---|
| XSS in `define:vars` | No — `define:vars` appears nowhere |
| Server island parameter replay | No — static output, no adapter, no server islands |
| XSS via spread attribute names (×2) | Was one spot, `Poem.astro`; **removed**, see below |
| XSS via `transition:*` on hydrated islands | No — no view transitions, no islands, zero JS in `dist` |
| Reflected XSS via View Transition properties | No — as above |
| Host header SSRF in prerendered error page | No — no SSR runtime |
| Reflected XSS via unescaped slot name | No — slot names are authored, never dynamic |
| RCE via AVIF image optimization | No — no `astro:assets`, no `<Image>`, no `getImage`; sharp never runs |
| Authorization bypass stripping `base` | No — no `base` configured |

The deployed artifact is static files with **no JavaScript, no forms, no fetch and no user input of
any kind**. The residual exposure is to the build machine processing content authored in this repo.

The upgrade was then actually attempted, and rejected on evidence. Astro 7 builds cleanly, all 29
pages render, the 406-check responsive sweep passes and the CSS is semantically identical — but
**Astro 7 drops a newline before an inline element instead of collapsing it to a space**:

```
Astro 5:  ...a chapter of\n<a href="https://illuman.org">Illuman</a>.
Astro 7:  ...a chapter of<a href="https://illuman.org">Illuman</a>.
```

which a reader sees as "a chapter ofIlluman". Minimal repro confirmed: a literal space survives, a
newline plus indentation does not. **Fourteen occurrences across eight pages**, including the
contact page's alternate email address ("write to Tom Sparough attsparough@gmail.com") and the
retreat page. Nothing in a build log, a link check or a responsive sweep catches it.

It is also not a one-off to patch fourteen times: it is a systematic rule change that will silently
damage any future paragraph written across two lines, on a site that is mostly prose.

Reverted to 5.18.2 and verified **byte-identical** to the Prompt 06 build. What came out of the
attempt instead is `tools/compare-build-text.py`, which compares the rendered text of two builds
and exits non-zero on exactly this class of regression. It is the acceptance test for the upgrade
whenever it happens; self-tested against the Astro 7 build, it reports all fourteen.

### N11 — spread props on the poem component — **fixed**

`Poem.astro` gathered `{...rest}` from `Astro.props` and spread it onto its `<div>` — the pattern
behind two of the advisories above. Not reachable (every call site is a page in this repo), and it
existed to carry exactly one inline style. The style is now a class and the spread is gone.

### N12 — ninety-one inline `style` attributes blocked a strict CSP — **fixed**

Nine distinct declarations, 91 occurrences. They would have forced `style-src 'unsafe-inline'`.
Moved into utility classes in `base.css`; `dist` now contains **zero** inline styles, so the policy
can say `style-src 'self'`. Verified with a 64-image pixel comparison across 16 templates × 2
widths × 2 themes: **64 of 64 pixel-identical**.

### N13 — no security headers at all — **fixed**

The live site returned only `x-robots-tag`. No CSP, no `nosniff`, no referrer policy, no
permissions policy, no framing protection. All now set in `public/_headers` and verified under
enforcement — see `verification.md`.

### N14 — wrangler and miniflare advisories — **fixed**

wrangler 4.127.1 (high) and its bundled miniflare (high). wrangler is a dev dependency, but it is
the tool that holds the deploy credential, so it is worth keeping current. Updated to 4.131.1,
which cleared both. Not a major bump and no build impact.

### N15 — cookie policy described services that do not exist — **fixed**

Marked "implemented" after Prompt 04. It was not. The privacy policy had been rewritten correctly,
but the cookie policy still listed **Google Analytics cookies** (`_ga`, `_gid`, `_gat`) and
**Squarespace Analytics cookies** (`ss_cid`, `ss_cpvisit`, …) as cookies "we use", and offered a
"cookie preference tool on the Website" that does not exist. The two policies contradicted each
other: Privacy said "No Google Analytics", Cookies listed its cookies.

Checked against what actually runs rather than against the source: the live site sends **no
`Set-Cookie` header at all**, injects no Cloudflare beacon, and carries two inline scripts and
nothing else. The only client-side storage is `localStorage["theme"]`, written only if the visitor
presses the theme button.

The cookie policy is rewritten to say that plainly, including a short note that earlier versions of
the site did run Squarespace and Google Analytics, so the change is visible rather than quietly
erased. The privacy policy's "Cloudflare Web Analytics" — a product that needs a beacon script that
is not present — is corrected to describe Cloudflare's edge traffic figures and server logs, and
the Workers delivery diagnostics that are switched on for launch are now disclosed. Revision dates
updated, because these are real edits.

---

## Prompt 08 — page identity and per-environment indexing

### F12 — rechecked, and mostly already fixed

The audit's claims were made against commit `8ea45e5`. Measured against the current build, three of
the six sub-issues had already been closed by the Prompt 04–05 work and the audit's description of
them is now out of date. Stating that plainly rather than re-reporting them as open:

| Sub-issue | Claim | Measured now | State |
|---|---|---|---|
| F12.1 | All twelve book descriptions exactly 150 chars, several cut mid-word | **One** survived: MWFC Vol. 2, a 151-char slice ending "…our experiences and…" | **fixed** |
| F12.2 | Three pages share one title | **0** duplicate titles across 29 pages | already fixed |
| F12.3 | Home and Books share a description | **0** duplicate descriptions across 29 pages | already fixed |
| F12.4 | No canonical link | 0 of 29 pages had one | **fixed** |
| F12.5 | No Open Graph / Twitter card | 0 of 29 pages had either | **fixed** |
| F12.6 | No structured data | 0 of 29 pages had any | **partly** — Person and Book only, see D-16 |

Two descriptions were also near-duplicates in substance rather than in bytes, which no exact-match
check catches: Jonah and The Invitation both reduced to "thought-provoking meditations for every day
of the year". Jonah's now names its volume and what is distinctive about the poems in it. Both
rewrites use only sentences already present in the book's own blurb — nothing invented.

### N16 — every canonical URL pointed at a URL that redirects — **fixed**

The most consequential thing found in this prompt, and it was introduced by the canonical work
itself rather than inherited.

`build.format: 'file'` makes `Astro.url.pathname` carry the file extension, so the first
implementation emitted:

```
<link rel="canonical" href="https://brianmueller.org/books.html">
```

But the site is served extensionless everywhere — every nav item, every internal link, and the whole
legacy redirect map use `/books`. Checked against the running site rather than assumed:

```
https://brianmueller.org/books           -> 200
https://brianmueller.org/books.html      -> 307  -> /books
https://brianmueller.org/books/          -> 307  -> /books
```

So the canonical tag would have nominated a URL that redirects, on every page of the site. A
canonical pointing away from the URL people actually link to is worse than having none: it is an
explicit instruction to consolidate on the wrong address, applied sitewide, three weeks before
cutover. The sitemap inherited the same defect and would have listed 29 redirecting URLs.

Fixed by normalising the path (`/index.html` → `/`, strip `.html`, strip trailing slash) before
building the canonical. `tools/check-build.mjs` now fails the build on any sitemap entry containing
`.html`, so it cannot come back quietly.

### N17 — the staging guard was a hand-maintained comment — **fixed**

Three separate files carried "remove this at cutover, and not before" instructions: the `noindex`
meta in `Base.astro`, the `X-Robots-Tag` line in `public/_headers`, and the whole of
`public/robots.txt`. Each depended on a person remembering, on the day, in the right order — and
each failure mode is silent. A production site that launches with `noindex` looks perfect and is
invisible; a beta that loses it gets indexed and has to be un-indexed, which is much slower than
never being indexed at all.

All three are now derived from one named environment (`src/site.config.mjs`), which has **no
default** — an unset or unknown `SITE_ENV` throws and the build fails rather than guessing. Cutover
is one word in one build command.

### N18 — `tools/csp-hashes.py` would have reported JSON-LD as needing hashes — **fixed**

Adding `<script type="application/ld+json">` made the hash tool report **15** inline scripts instead
of two, and pasting that into the CSP would have been wrong twice over: the hashes are unnecessary
(a JSON-LD block is data, the browser never executes it, so `script-src` does not apply) and they
would change every time a book's page count did.

Not assumed — verified under an enforced policy: 58 page loads with JSON-LD present, **zero CSP
violations**. The tool now skips any `<script>` whose `type` is not a JavaScript MIME type, and says
why in its own docstring.

---

## Prompt 09 — legacy link migration

### F02 — resolved. Every discovered legacy URL has an explicit disposition.

**The inventory was refreshed rather than inherited.** The live `.com` sitemap was re-fetched on
18 September 2026: **1,646 URLs**, a single flat file with no nested sitemaps, exactly matching the
audit's figure. But the audit's framing — "1,646 legacy URLs" — hides what they actually are:

| Kind | Count |
|---|---|
| `/living-workshop/tag/<tag>` listing pages | 691 |
| `/living-workshop/` posts, dated form | 677 |
| `/living-workshop/` posts, undated form | 239 |
| `/living-workshop/category/<cat>` | 3 |
| `/living-workshop` index | 1 |
| `/archive-N` | 13 |
| `/store/p/<product>` | 11 |
| `/store` and store categories | 4 |
| policies, `/home`, `/archive-14/baloney` | 7 |
| **total** | **1,646** |

So there are **916 real blog posts**, not 1,610 — the rest are the same posts under a second URL
shape, plus tag listings. That matters: it is the difference between 916 destinations to establish
and 1,610.

**Seven URLs were found that the sitemap does not list**, from the 2022 Squarespace export's content
links and from live probing. Step 2 says not to silently drop entries that disappeared from the
latest sitemap, and these are exactly that:

| URL | Where found | Live today |
|---|---|---|
| `/the-bull-series` | export content links | **404** |
| `/brians-poem-of-the-day-series` | export content links | **404** |
| `/men-writing-for-change-series` | export content links | **404** |
| `/latest-books` | export content links | **404** |
| `/archive-6` | export page list | **200**, absent from sitemap |
| `/archive-14`, `/archive-14/baloney` | live probe | **200** |

The four dead series slugs were renamed to `/archive-N` at some point; links to them still exist in
the site's own content. They now redirect instead of 404ing — an improvement on production, not a
regression.

**Final map: 1,653 legacy URLs, 100% classified, 0 unresolved.**

| Disposition | Count |
|---|---|
| Redirect to a specific poem on brianspoems.com | 690 |
| Redirect to a specific new page | 733 |
| Redirect to `/blog` (generic — no confident poem match) | 226 |
| Retained at the same path (the four policy pages) | 4 |

### N19 — slug matching would have sent poems to the wrong place

The prompt pack warned about this and named a test case. It was real.

Matching each archived post to a brianspoems.com permalink by **slug alone** produced 675 apparent
one-to-one matches and 35 ambiguous ones. Resolving the ambiguous set by **comparing the archived
post's text with the poem at each candidate permalink** showed the naive answer was wrong far more
often than not:

```
/living-workshop/transformation  ->  /poem/transformation-2   (1.00 vs 0.07 for /poem/transformation)
/living-workshop/2018/12/8/acceptance -> /poem/acceptance-3   (0.86 vs 0.10)
/living-workshop/in-the-mirror   ->  /poem/in-the-mirror-2    (0.82 vs 0.13)  <- the pack's case
```

**Twenty of the thirty-five ambiguous cases resolve to a `-2` or `-3` permalink, not the bare slug.**
Shipping slug matches would have sent each of those readers to a different poem with the same title.

All 729 candidate permalinks were then fetched (rate-limited, ~0.5 s apart) and every one of the 915
archived posts was scored against its candidates by word-sequence overlap of the poem body:

| Result | Count |
|---|---|
| **confirmed** — overlap ≥ 0.75, or ≥ 0.50 with a ≥ 0.30 margin over the runner-up | **690** |
| **no candidate** — no permalink with that title exists on brianspoems.com | 205 |
| **needs review** — a candidate exists but the text does not support asserting it | 20 |

The 225 unconfirmed posts redirect to `/blog`, which explains where the archive lives. They are
listed by URL in `redirect-map.csv` with `confidence = low - needs review`, so the work is visible
rather than buried.

A caution worth recording: the overlap score conflates "wrong poem" with "poem later revised".
`/living-workshop/2019/07/04/war-is-hell` scores only 0.41 against `/poem/war-is-hell`, but reading
them side by side they are plainly the same poem, lightly reworked. Those sit in the review bucket
by design — an unglamorous `/blog` landing is better than a confident wrong answer.

### N20 — one blog post exists on the live site but is missing from the archive — **CLOSED 18 Sept 2026**

**Fixed before Squarespace could be cancelled.** The post was fetched directly from Squarespace on
18 September 2026 — the old site was still serving it, reached by forcing the request to a Squarespace
IP, since `www.brianmueller.com` now answers from Cloudflare — and added to
`08 - Blog Archive/` by hand in the same format as the other 915 entries: full text with poem
lineation preserved, the Anne Frank quote block as a markdown blockquote, the adaptation note, the
copyright line and the outbound links. It sits in date order between `thursday-poem` (2023-03-02)
and `darlings-of-the-status-quo` (2023-03-04) — the gap the finding predicted. The CSV index gained
its row (now 916) and every count in both READMEs was corrected from 915 to 916, with the 2023 year
total from 163 to 164.

**One thing nearly went missing inside the fix, and the scare that followed was unfounded.** The
first pass at converting this one post dropped its Anne Frank epigraph, because the step that
removes Squarespace images strips `<figure>` elements — and a Squarespace quote block is also a
`<figure>`. Caught by reading the output against the source instead of trusting the converter.

That raised an obvious worry: if the original 915-post extraction shared the rule, hundreds of
entries could be missing their quotes. **They are not.** The Squarespace export contains **657**
`<blockquote>` elements; the archive contains **658** entries carrying a blockquote — those 657 plus
this newly added one. The original extraction handled quote blocks correctly and nothing is missing.
Checked rather than assumed, in both directions.

The archive README now records why the export was short: the post was absent from the Squarespace
export but present in the live sitemap. If another gap ever appears, the sitemap is the place to
look, not the export.

#### Original finding

Reconciling the 915-row archive index against the 916 post URLs in the live sitemap leaves exactly
one:

**`/living-workshop/let-the-mystery-be`** — "Let the Mystery Be", published 2023-03-03. Live and
returning 200 today; absent from `08 - Blog Archive/`, whose README describes itself as complete.

It was fetched and preserved during this prompt. **The archive README's count should be corrected
and the post added before the old site is taken down**, because after cutover there is no other copy.

### F02.3 — homepage fragments — **implemented**

The old site was largely one long homepage, so links in the world point at `brianmueller.com/#jonah`,
`/#mwfc-1`, `/#trust` and so on. A fragment is never sent to the server, so no redirect rule can see
one; this is the only part of the migration that has to run in the browser.

24 legacy fragments were recovered from the live old homepage's own `id` attributes and internal
links, and mapped to the pages those sections became. `src/components/LegacyFragments.astro` runs
**only on the home page**, acts **only on that fixed list**, yields to any real element with that id,
and uses `location.replace()` so the old URL does not become a back-button trap.

Tested in a browser: **12 of 12** sample fragments land on the right page; `/retreat#register`,
`/retreat#is-it-for-me` and `/#main` are untouched and still scroll to the right place; after
`/#jonah` the back button returns to the previous page rather than bouncing.

### N21 — known gaps in redirect coverage, stated rather than glossed

Both are visible in testing and neither is fixed, on purpose:

1. **Trailing-slash variants of the 690 poem rules fall through to `/blog`.**
   `/living-workshop/in-the-mirror/` matches the catch-all, not the specific rule, because
   `_redirects` static matching is exact. Doubling the file to 1,419 rules to cover a URL shape that
   appears nowhere in the sitemap is a poor trade; Cloudflare also normalises trailing slashes for
   asset requests (`/books/` → 307 → `/books`), and whether that happens before `_redirects` is
   evaluated **can only be established on the deployed beta**. Recheck at Prompt 11.
2. **Matching is case-sensitive.** `/LIVING-WORKSHOP/...` 404s. Squarespace URLs were lowercase
   throughout, so the exposure is small.

**No open redirect exists.** Every destination is a fixed literal; no rule interpolates any part of
the request into its target. Probes with `/store/https://evil.example` and `/living-workshop//example.com`
resolve to `/books` and `/blog` on this origin.

---

## New during Prompt 11 — beta deployment

### N22 — Cloudflare was injecting an analytics beacon the CSP was blocking · High · Stage 11

**Found only on the live origin, and only by a real browser.** Prompts 01–10 tested 29 pages under
enforcement and found zero CSP violations. The first browser run against deployed
`brianmueller.org` found nine.

Every HTML response from the `brianmueller.org` zone carries
`static.cloudflareinsights.com/beacon.min.js`, inserted by Cloudflare at the edge. It is not in this
repository, and `curl` does not see it: the injection is gated on a browser-looking `User-Agent`.
That is the whole reason ten stages of local testing missed it. It comes from a zone setting —
**Web Analytics → brianmueller.org → Automatic setup**, added 2026-08-28 — and it will reappear on
any hostname where that setting is on, including `brianmueller.com` after cutover. Turning it off
is a dashboard action; it cannot be fixed in this repository.

Two things were wrong at once:

1. **Every visitor got a console error**, on every page, because `script-src` did not name the host.
2. **The privacy policy had become false.** It said Cloudflare's figures used "no cookie, no script
   and no fingerprint". A script was being served on every page. The CSP was the only thing
   stopping it, which is enforcement by accident: relax the CSP for any unrelated reason and the
   site silently starts doing something its policy denies.

Brian's decision (D-21) is to let it run and say so. See D-21 for what was measured, what the
policy pages now claim, and what has to change together if it is ever switched off.

### N23 — the first fix named the wrong host, and measuring caught it

The obvious `connect-src https://cloudflareinsights.com` was wrong. Measured in a real browser on
the live origin, the beacon POSTs to **`/cdn-cgi/rum` on the site's own hostname**, which Cloudflare
answers at the edge. With that directive deployed the script loaded and the report was still
blocked — a state that looks fixed in the dashboard settings and is not. `connect-src 'self'` is
correct, and is also the form that survives the hostname change at cutover, since `_headers` is
shared by beta and production.

Recorded because the general lesson has now cost this project twice: a Cloudflare behaviour
described in documentation is not evidence of the Cloudflare behaviour in front of you.

### N24 — stale git lock files still block ordinary commits · Low (process) · Stage 11

`.git/index.lock`, `.git/refs/heads/audit/2026-09.lock` and `.git/refs/tags/_probe.lock` exist and
cannot be removed from this session — deletion inside the mounted folder returns "Operation not
permitted" even after the permission change Brian applied. `git add`, `git commit`, `git checkout`
and `git update-ref` all fail against them.

Worked around with plumbing: a scratch index via `GIT_INDEX_FILE`, then `write-tree` /
`commit-tree`, then writing the ref file directly. The commits are ordinary and correct; only the
route to them is unusual. **Brian should delete those three files** from Finder or a terminal on his
own machine, after which normal git works again. Nothing else depends on it.
