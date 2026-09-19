# Maintenance release 1.1.0 — merged plan

> **Historical, and kept deliberately.** This is the merged plan for what became
> **1.1.0**, written on 19 September 2026 from the two audits. It shipped, and so
> did everything it deferred: 1.2.0 the Astro 7 upgrade, 1.3.0 the Cookie Policy
> reset, 1.4.0 the content and email-address work, 1.4.1 the legacy-poem
> redirects. **One item from it is still open: the Terms rewrite (`R07`),**
> scoped per D-30. Kept because it records how two independent audits were
> reconciled — including the three places they disagreed, which were settled by
> measurement rather than by averaging. For the current state read `STATUS.md`.

**Inputs:** the Claude audit of 18 September (`audit-2026-09-18.md`, findings `M01`–`M18`)
and the Codex audit of the production site, delivered 19 September (findings `R01`–`R08`).
**Baseline:** `v1.0.0`, commit `afff1aa`, live.
**Written:** 19 September 2026.

---

## 1. How the two audits relate

They were run against the same site on the same day and they agree on almost
everything — which is worth stating, because where they disagree, the disagreement
is informative rather than noise.

**One finding was found independently by both, with the same root cause and the same
numbers**: the `/poems` archive button (`M01` / `R02`), measured at 1.37:1 light and
1.26:1 dark by both, both attributing it to `.archive-note a` overriding `.btn`. Two
independent measurements landing on identical figures is about as much confidence as
a finding of this kind can carry.

**They had different access, so they had different blind spots.** Codex reviewed only
the public site — "repository code, deployment credentials, administrative access,
backend tests, Search Console, analytics dashboards and server logs were outside this
public review." So Codex could not see the dependency tree, the build guards, the
`workers.dev` route, or the documentation. Conversely, I had repository access and
spent it there, and under-tested the *published content* — the policy pages' claims
against the code's behaviour, the structured data's agreement with the visible prose,
and the narrowest viewport. Codex found four real things in exactly that gap.

**Net:** 8 Codex findings, 18 mine, 2 of which are the same finding — **24 distinct
items**. Five of Codex's eight are things I missed. One of mine (`M05`, the Astro
upgrade) is the largest single change in the release and Codex could not have seen it.

### Conflicts, resolved by measurement

| | Codex said | What I measured | Resolution |
|---|---|---|---|
| **Scale of `R01`** | "920 of 1,610 historical poem-page URLs redirect to `/blog`" | 921 URLs go to `/blog`, but only **226 are poem posts**. The other 695 are 691 tag listings, 3 category listings and the blog landing page — pages that never contained a poem. | **Both right, different denominators.** Codex counted every `/living-workshop/*` URL as a poem page. The defect is real and is `R01`'s substance, but it is 226 poems, not 920. See §3. |
| **`R08` 320 px overflow** | Privacy overflows at 320 px; client area 305 px, scroll width 314 px | At a true 320 px client area: **no overflow**, on all 28 pages, both themes. At a **305 px** client area: overflow confirmed, scroll width 315 px. | **Codex is right and the mechanism is now clear.** Their browser reserved 15 px for a classic scrollbar; my phone emulation used overlay scrollbars. It is real for anyone whose browser reserves scrollbar width. Fixing it is one CSS line. |
| **`brianmueller.org`** | "The published brianmueller.org address works and redirects correctly"; `www.brianmueller.org` does not resolve | Neither resolves. No A record, no NS record. | **Codex's observation is stale.** The `.org` zone was removed from Cloudflare on 18 September (D-25) and the delegation had not yet lapsed when they tested. Not a defect — Brian retired it deliberately — but it means any `.org` link in the wild is now dead rather than redirecting. Worth knowing before Awaken. |

### Codex findings I verified before accepting

All eight. `R02`, `R03`, `R04`, `R06`, `R07` reproduced exactly as described; `R01` and
`R08` reproduced with the corrections above; `R05` is a source discrepancy only Brian's
physical copies can settle.

`R03` deserves a note because it is the sharpest thing either audit found in the prose.
The Cookie Policy says, of the stored theme preference: *"So does switching the theme
button back — the site then simply follows whatever your device is set to."* The
delivered script calls `localStorage.setItem("theme", next)` on **every** click and
always sets `data-theme`. There is no code path that removes the key. So the published
instruction for removing stored data does not remove it. That is a policy page
describing behaviour the site does not have — the same class of problem as `N15` and
`N22` earlier in this project, and the third time it has happened.

---

## 2. The merged register

24 items. Ordered by what they cost a visitor, not by which audit found them.

| ID | Also | Severity | What | Needs |
|---|---|---|---|---|
| **H1** | R01 | **High** | 226 legacy poem URLs land on `/blog`, a book announcement | code + a decision |
| **H2** | M01 / R02 | **High** | `/poems` primary button is illegible, 1.37:1 | code |
| M1 | R03 | Medium | Cookie Policy describes a theme reset that does not exist | code + copy |
| M2 | M05 | Medium | Astro 5.18.2 → 7.3.3; clears 1 critical + 1 high + 1 low | code |
| M3 | M06 | Medium | Nothing verifies the CSP hashes still match the scripts | code |
| M4 | M03 / Codex | Medium | No HSTS | Cloudflare setting |
| M5 | M04 | Medium | `workers.dev` serves an indexable copy of the site | one line |
| M6 | R07 | Medium | Terms mixes current and historical sales; stale revision date | copy |
| M7 | R04 | Medium | Public-domain contributions vs licensed poems not distinguished | **Brian** |
| M8 | R05 | Medium | Three page counts differ from the retailer listing | **Brian** |
| M9 | M02 | Medium | Retreat hero date line fails contrast over the photo | code |
| L1 | R08 | Low | `static.cloudflareinsights.com` cannot wrap; overflows below ~315 px | one line |
| L2 | R06 | Low | Anthology JSON-LD credits only Brian | **Brian** + code |
| L3 | M07 | Low | No favicon, touch icon or manifest — all 404 | code |
| L4 | M10 | Low | `/disclaimer` skips h1 → h3 | one line |
| L5 | M13 | Low | `section{padding-block}` declared twice; the first is dead | one line |
| L6 | M12 | Low | 464 KB of unreferenced images ship every deploy | delete |
| L7 | M16 | Low | bare `npm run build` produces the *beta* artifact | code |
| L8 | M08 | Low | Homepage mobile LCP 3.24 s on a slow-phone profile | code |
| L9 | M11 | Low | Footer targets 21 px — passes AA by 3 px via the spacing exception | code |
| L10 | M14 | Low | Book pages share the generic OG image | code |
| L11 | M09 | Low | `/about` CLS 0.061 from font swap — inside the good band | defer |
| L12 | M15 | Low | Tom's personal Gmail in plain text on 2 pages | **Brian** |
| L13 | M17 | Low | `http://brianmueller.com` takes two hops | Cloudflare rule |

`M18` (documentation drift) is closed — done on 18–19 September.

---

## 3. H1, stated accurately

This is the most important finding in either audit and the one I missed, so it is worth
being precise about what it is.

**Today:** 921 legacy URLs redirect to `/blog`. That page carries one book announcement
and a link to the archive. A reader who followed a ten-year-old link to a specific poem
lands on an announcement for a different book and has to start searching.

**Of those 921:**

| | Count | What it is |
|---|---|---|
| Tag listings | 691 | `/living-workshop/tag/...` — never contained a poem |
| Date archives | 677\* | `/living-workshop/2020/07/...` — index pages |
| Category listings | 3 | |
| The blog landing page | 1 | |
| **Real poem posts** | **226** | **the actual defect** |

\* Date-archive URLs and poem posts overlap in the inventory; the 226 is the count of
distinct poem posts currently sent to `/blog`.

**Of the 226 poem posts, I have now recovered the following — confirmed, not guessed:**

| | Count | Confidence | Method |
|---|---|---|---|
| Slug matches | **27** | certain | Normalised the slug and compared against all 1,834 archive slugs |
| Strong text matches | **12** | high | Jaccard ≥ 0.55 on the poem body, boilerplate removed |
| Plausible text matches | **13** | needs reading | 0.30–0.55, with a clear gap to the runner-up |
| No archive counterpart found | **174** | — | Best score under 0.30 |

**Why my original pass missed them**, because it matters for trusting the other 690:

1. **An apostrophe rule.** The old Squarespace slug dropped apostrophes
   (`its-all-a-story`); the archive turns them into a separator (`it-s-all-a-story`).
   Any poem with an apostrophe in its title failed to match. Both of Codex's two named
   examples — `its-all-a-story` and `thats-all-folks` — are exactly this.
2. **A date-prefix bug.** 199 of the unmatched URLs are of the form
   `/living-workshop/2020/7/24/perfection`. The matcher compared the whole path rather
   than the final segment, so a poem whose slug was unchanged still failed.
3. **Twelve titles simply changed between the two sites** — "A Slave Ship Named Jesus"
   became "A Slave Ship Called Jesus"; "It's Alright" became "It's All Right"; "Allow
   Yourself to Sit" is now published as "Choosing Presence". Only body text finds these.
   I spot-read four and the bodies are verbatim identical.

**The 690 already-matched redirects are not implicated.** These three bugs all cause
*false negatives* — a failure to find a match, not a wrong one. Nothing here suggests
an existing redirect points at the wrong poem. That said, `R01`'s acceptance check is
right: availability is not correctness, and a sample of the 690 should be content-checked.

**The 174 with no counterpart need a decision, not a guess.** Reading the titles, many
look like announcements rather than poems — "Happy Fourth Anniversary of…", "Poets
Wanted". Codex's guidance is the right standard: *"do not imply that an unrelated
announcement is the replacement poem."* Options in §5.

---

## 4. The release, sequenced

Four stages. Each is independently verifiable and independently revertable, and each
ends at a point where stopping is safe. Stage 1 needs nothing from Brian.

### Stage 1 — certain fixes, no decisions (deploy first)

| | Change | Finding |
|---|---|---|
| 1.1 | `/poems` button: scope `.archive-note a` so it cannot reach `.btn`; check default, hover and focus | H2 |
| 1.2 | Retreat hero eyebrow contrast over the photograph | M9 |
| 1.3 | `overflow-wrap` on inline code in the policy pages | L1 |
| 1.4 | `/disclaimer` h3 → h2 | L4 |
| 1.5 | Delete the dead `section{padding-block}` rule | L5 |
| 1.6 | Delete `sea-900`, `sea-1600`, `retreat-hero-1456` | L6 |
| 1.7 | Favicon, apple-touch-icon, manifest, theme-color | L3 |
| 1.8 | Footer tap-target padding under `pointer:coarse` | L9 |
| 1.9 | Book pages use their own cover as the OG image | L10 |
| 1.10 | The **27 slug-confirmed** poem redirects | H1 (part) |
| 1.11 | CSP hash verification in `check-build.mjs` | M3 |
| 1.12 | Bare `npm run build` no longer means beta | L7 |
| 1.13 | `"workers_dev": false` | M5 |

**Acceptance:** all 29 pages build; rendered text unchanged except where intended;
CSP hashes still 3 of 3; the button measured ≥ 4.5:1 in both themes at both sizes and
in hover and focus; no overflow at a 305 px client area; the 27 redirects land on the
right poem, content-checked, not just 301-checked.

### Stage 2 — the theme-reset fix and the policy corrections

| | Change | Finding |
|---|---|---|
| 2.1 | Add a real "Use device setting" action that removes the `theme` key and the `data-theme` override | M1 |
| 2.2 | Rewrite the Cookie Policy's removal section to match what the code now does | M1 |
| 2.3 | Replace the Firefox and Brave help links with actual site-data instructions | M1 |
| 2.4 | Terms: separate historical direct sales, current retailer sales, and retreat bookings; correct the revision date | M6 |

2.1 changes an inline script, so **the CSP hash changes** — which is precisely the case
`M3` exists to catch. Stage 1 ships that guard first, deliberately, so Stage 2 is the
first change it protects.

### Stage 3 — the Astro upgrade, on its own

Alone, because it is the only change that touches every file.

- Astro 5.18.2 → 7.3.3, **with** `vite: { build: { cssTarget: [...] } }`. Without that
  line Lightning CSS rewrites all six width media queries to Level 4 range syntax and
  the responsive layout silently stops applying below Safari 16.4.
- Gate: `tools/compare-build-text.py` — and it must be **that** harness, not a
  whitespace-normalising text diff, which cannot see the inline-space bug.
  **Shipped in 1.2.0**, and it needed `compressHTML: false` as well: the Prompt 07
  whitespace regression is not fixed in 7.3.3.

### Stage 4 — after deployment, one at a time

- HSTS ramp: `max-age=300` → `86400` → `31536000`. **No `preload`** without a separate
  decision; it is effectively irreversible. Verify certificate renewal first, as Codex
  notes. (M4)
- Collapse the `http://brianmueller.com` double hop. (L13)

### Deliberately not in 1.1.0

- **The remaining 199 poem URLs** (12 strong + 13 plausible + 174 unresolved). The 25
  matchable ones need Brian to confirm a retitle; the 174 need the decision in §5. This
  is its own piece of work and it is tracked, not dropped.
- `/about` CLS (L11) — inside the good band; every fix costs more than it buys.
- `Event` structured data on `/retreat` — belongs with Stripe, per D-16.
- Plain-text email addresses (L12) — a decision, not a patch.

---

## 5. What needs Brian

Ordered by what blocks the most work.

1. **The 174 poem URLs with no archive counterpart.** Three options, and I would take
   the second:
   - *(a)* Leave them on `/blog`. Honest only if `/blog` says something useful to
     someone who arrived looking for a poem — today it does not.
   - *(b)* **Send them to `/poems`** and add a short line to that page addressed to
     exactly this reader: *the poem you followed a link to is most likely in the
     archive; here is how to search it.* Costs one paragraph, and `/poems` already
     exists to point at brianspoems.com.
   - *(c)* Let them 404. Cleanest signal to search engines, worst for a human.
   The 691 tag listings deserve the same treatment as (b) rather than `/blog`.
2. **The 12 strong and 13 plausible text matches.** I can produce a table of old title,
   proposed archive poem, and the first lines of each, for a yes/no pass. Perhaps
   twenty minutes of reading.
3. **`M7` / R04 — the rights question.** The FAQ says every poem is under copyright and
   also that other men's contributions to Men Writing for Change were released into the
   public domain; the footer applies NC-ND to "Poems" without distinguishing them. I can
   draft wording, but the underlying decision is Brian's and the contributor permission
   records are the evidence.
4. **`M8` / R05 — three page counts.** Bull Heart 86 vs 100, Jonah 450 vs 476, MWFC
   Vol. 1 50 vs 48. Same ISBN on both sides in each case. Only the physical copies or
   the publishing files settle it. Codex's caution is right: do not overwrite an
   owner-verified first-edition fact with Amazon's listing.
5. **`L2` / R06 — anthology credits.** What should the Men Writing for Change JSON-LD
   say? Brian as `editor` with contributors named, Brian as `editor` alone, or
   `author` plus a `contributor` note? Needs the approved credits, not invention.
6. **`L12` — Tom Sparough's personal Gmail** is published on two pages. His address,
   so his call.

### Operational, from Codex, not defects

Before registration opens: confirm the venue booking, the fifty-place capacity, the
private-bathroom rooms, meals, dietary and access arrangements, transport and the
refund policy with Bergamo. Send an authorized test message through the contact and
retreat-interest paths and confirm receipt. Add a venue/directions link to `/retreat`.
And create the Search Console property — it is still the thing that would settle `L8`
with field data instead of a lab number.

---

## 6. Acceptance for the release as a whole

Nothing ships without the checks that caught problems last time:

1. Clean `npm ci` and build of all three environments in a Linux container that behaves
   like Cloudflare's builder.
2. Rendered text diffed page by page against production; every difference intended.
3. CSP hashes recomputed from `dist/` and compared to `_headers` — now enforced by the
   build itself.
4. Contrast measured **under the glyphs**, not around them. Reading the worst pixel in
   an element's bounding box is what produced four false failures in the first audit.
5. Responsive sweep at **305 px** as well as 320, 390 and 1440 — Codex's finding exists
   because 305 was never tested.
6. Every changed redirect content-checked at its destination, not just confirmed as 301.
7. A live pass after deploy: all 28 pages 200, zero console errors, zero CSP violations,
   both themes, both viewports.
8. Prove every response reached Cloudflare (`cf-ray`) before believing any symptom.
