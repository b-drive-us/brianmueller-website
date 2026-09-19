# STATUS

| | |
|---|---|
| **Stage** | Prompts 00–12 complete and the site is live on `www.brianmueller.com` at **version 1.4.1** (tagged; see `../../CHANGELOG.md`). 1.1.0 shipped the merged audit fixes, 1.2.0 the Astro 7 upgrade, 1.3.0 the Cookie Policy theme reset (`R03`), 1.4.0 took both email addresses out of the markup and removed PDFs, review copies and the retreat schedule, 1.4.1 closed the legacy-poem redirects. **Next: the contact form, then Stripe** — both blocked on the same thing, item 24, a way for the site to send mail. |
| **Repository** | `github.com/b-drive-us/brianmueller-website`, working copy at `Publishing/brianmueller-website/06 - Site` |
| **Branch** | `main` at `da7ec4e`, pushed, tagged `v1.4.1`. |
| **Candidate commit** | `da7ec4e` — "Merge Step 5 — the legacy poem redirects" (2026-09-19) |
| **Production** | `https://www.brianmueller.com`, Worker `brianmueller-website`, `npm run build:production`, commit `da7ec4e`, live **2026-09-19** (v1.4.1). Apex 301s to www. **HSTS on at the edge**, `max-age=15552000`, no `includeSubDomains`, no preload (D-32). |
| **Staging** | `https://brianmueller-website-beta.brian-b89.workers.dev`, Worker `brianmueller-website-beta`, `npm run build:beta`, `noindex` on every response. |
| **brianmueller.org** | **Fully retired 18 Sept 2026** (D-25). Zone **removed from Cloudflare**; the domain no longer resolves. No Worker, no redirect rule, nothing in the live site references it. Registration is not expected to be renewed; the NameCheap nameservers still point at Cloudflare, which is harmless for a lapsing domain. |
| **Rollback** | Recreate `www CNAME ext-sq.squarespace.com`. Squarespace was never stopped. Full detail in `cutover-2026-09-18.md`. |
| **Divergence** | **None.** The live site serves `about.CM_4s7Jy.css`, the stylesheet this commit builds. |
| **Baseline build** | `npm run build:production` → exit 0, 29 HTML files (28 published pages + `404.html`), Astro 7.3.3, Node 22.23.2. Bare `npm run build` fails deliberately (`M16`). |
| **Checks** | `tools/check-build.mjs` fails the build on any environment/artifact mismatch, and on any page whose `<meta name="version">` is missing or disagrees with `package.json`. Live journey harness: **76/76 passing** across 1280px and 390px, light and dark, plus a keyboard-only pass. |
| **Legacy poem URLs** | **Closed 2026-09-19.** Of the 226, **52 now reach a poem** and 174 reach `/poems`, which carries a line written for a reader arriving from an old link. None reach a dead end. All 25 of Section C shipped in 1.4.1 (D-33, D-35); Section D stays as it is (D-34). Every row's evidence and approval is in `redirect-map.csv`, and `public/_redirects` is generated from it. |
| **Readiness** | Live and verified on the real hostname after DNS propagation. D-08 and D-19 were closed **by Brian’s affirmation rather than by verification** (D-22). **N20 closed** — the recovered post is in the archive. **HSTS closed** (D-32). Open: Search Console property (none exists on either Google account). |
| **Carried to the next release** | The *Bull Heart* and *Jonah* page-count caveats, *Men Writing for Change* Vol. 1 re-recorded to its second printing, `author` and `editor` in the anthologies' JSON-LD, and the Terms rewrite (`R07`, scoping §§3–5 per D-30). |
| **Mail path** | **Decided 2026-09-19: Resend** on an authenticated `brianmueller.com` (D-36). Cloudflare Email Service would send to a verified own-account address free, but external recipients — a registrant's confirmation — are beta and Workers Paid. Plan in `contact-form-plan.md`. Waiting on Brian for DNS records and a send-scoped API key. |
| **Moving to Claude Code** | 2026-09-19. `../../CLAUDE.md` carries the working rules; this file stays the state of record. |
| **Records updated** | 2026-09-19 |

## What the audit actually examined

The Cloudflare Worker has not been modified since 2026-08-30. The September 9 audit therefore
examined **exactly the build that is checked out today**. Nothing has drifted in between, so the
audit's observations should reproduce against this commit without allowance for changes.

## How deployment actually works — confirmed 2026-09-18 (D-10 closed)

Read from the dashboard and then verified by doing it, rather than assumed:

| Setting | Value |
|---|---|
| Git repository | `b-drive-us/brianmueller-website` |
| Build command | `npm run build:production` — switched from `npm run build` at the cutover (see `cutover-2026-09-18.md`). It chains `astro build`, `generate-seo.mjs` and `check-build.mjs`. Bare `npm run build` still means **beta**; see finding `M16`. |
| Deploy command | `npx wrangler deploy` |
| Version command | `npx wrangler versions upload` |
| Root directory | `/` — correct; the repository root is `06 - Site` |
| Production branch | `main` |
| Builds for non-production branches | **on** |

What that means in practice, and it is the useful part:

- **A push to `main` runs the deploy command and changes what `www.brianmueller.com` serves.**
  That hostname is a Production custom domain on this Worker. (Written before the cutover, when
  the Worker's custom domain was `brianmueller.org`; the mechanism is unchanged.)
- **A push to any other branch runs the *version* command instead.** It uploads a preview version,
  reachable at `<version-prefix>-brianmueller-website.brian-b89.workers.dev`, and does **not**
  touch the production hostname. Confirmed by pushing `audit/2026-09` first and watching the active
  deployment stay on `6b802270`.
- That makes a branch push a genuinely safe rehearsal: it proves the build succeeds in Cloudflare's
  own environment, on a real URL, before production branch is touched. It was used that way here
  and it is worth using that way again.
- Preview URLs are public. Cloudflare adds its own `x-robots-tag: noindex` to `workers.dev`
  responses, on top of the one this build sets.
- `npm run build` locally is still safe and publishes nothing. Only a push does.

## Disposition summary after Prompt 04

| Finding | State |
|---|---|
| F01 Contact | **implemented** — real address, no implementation notes |
| F02 Legacy URLs | **implemented** — 1,653 legacy URLs, 100% classified, 0 unresolved. 690 poems matched by text, not slug |
| F03 Indexing | reproduced (intentional), **open** — cutover gate; sitemap still missing |
| F04 Permissions | **implemented** from Brian's decision; two wording questions outstanding |
| F05 Policies | Privacy **implemented**; Cookies was marked implemented in error and was still describing Google Analytics and Squarespace — **fixed in Prompt 07**, see N15 |
| F06 Venue | **implemented** — fabricated acreage and travel time removed |
| F07 Archive count | **implemented** — durable wording, no hard-coded total |
| F08 Jonah title | **implemented** — aligned to the archive; reversible if the book differs |
| F09 Book metadata | **partly implemented** — edition labelling done; three page counts need Brian |
| F10 Contrast | reproduced with exact figures, **open** — Prompt 05 |
| F11 HTTP→HTTPS | **reproduced live** in Prompt 07; fix is a Cloudflare zone setting — **waiting on Brian**, D-12 |
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

**Prompt 07 — security and delivery: done, with two things waiting on Brian.**

- **F11 confirmed live**, not inferred: `http://brianmueller.org/` answers `200` on plain HTTP.
  Calibrated against a site that does redirect, so it is not a client artifact. The fix is the
  Always Use HTTPS zone setting — an account settings change, so **Brian's call**. See D-12, which
  also sets out why HSTS is deliberately not enabled yet.
- **Security headers: there were none** beyond `x-robots-tag`. Now a CSP at `default-src 'none'`
  with `script-src` limited to two SHA-256 hashes and **no** `unsafe-inline` anywhere, plus nosniff,
  referrer policy, a permissions policy denying seventeen unused features, `frame-ancestors 'none'`,
  `form-action 'none'` and `base-uri 'none'`. Tested **enforced**, not report-only: 58 page loads,
  0 violations, 0 console errors, theme script and fonts working on every one. Seven negative probes
  all blocked.
- **91 inline `style` attributes removed** into utility classes first, which is what made
  `style-src 'self'` possible. 64 of 64 screenshots pixel-identical afterwards.
- **Astro stays on 5.18.2, deliberately.** All ten advisories checked individually — none reachable
  in a static build with no user input. The upgrade to 7.3.2 was then attempted and **rejected
  because it silently corrupts prose in fourteen places across eight pages**. See N10 / D-11.
  `tools/compare-build-text.py` is the acceptance test for doing it later.
- **wrangler updated** 4.127.1 → 4.131.1, clearing it and miniflare.
- **robots.txt is not what is protecting this site.** Cloudflare prepends a managed block with
  `Allow: /` ahead of our `Disallow: /`. `X-Robots-Tag` is the guard that actually works, and it is
  verified on pages, assets and 404s at the live edge. The managed block also declares
  `ai-train=no` and blocks nine AI crawlers — a rights decision about Brian's poetry made by a
  hosting default. **Brian's call**, see D-13.
- **F05 was marked implemented after Prompt 04 and was not.** The cookie policy still listed Google
  Analytics and Squarespace cookies and contradicted the privacy policy. Both rewritten against
  measured behaviour: the live site sets **no cookies at all**.

## Done with Brian, 12 September 2026 — both verified from outside Cloudflare

| | What | Evidence |
|---|---|---|
| D-12 | **Always Use HTTPS on** for brianmueller.org. **F11 is closed.** | `http://…/` → 301, deep path + query preserved exactly, single hop, no loop. Same setting still needed on brianmueller.com at cutover. |
| D-13 | **Cloudflare's managed robots.txt turned off.** Brian owns the file. | `robots.txt` is now 5 lines — exactly the repo file — down from 66. The contradictory `Allow: /` is gone. |

A note for later: on the HTTPS toggle, the Cloudflare dashboard reported a successful change that
had **not** saved — the page said "last changed a few seconds ago" while `curl` still returned 200
and a reload showed it off. A second click by screen position took. **Verify Cloudflare settings
from outside Cloudflare**, not from its own UI.

Still open from D-13: the production robots.txt needs writing, including Brian's own position on AI
training rather than Cloudflare's default. That belongs to **Prompt 08**.

**Prompt 08 — page identity and per-environment indexing: done.**

- **D-02 resolved: `www.brianmueller.com`.** Re-confirmed live first (`brianmueller.com` 301s to www
  today), so www is genuinely the incumbent. It now lives in exactly one place.
- **One environment configuration.** `SITE_ENV` names the site — `production`, `beta` or `preview` —
  and the origin, canonical, robots meta, robots.txt, sitemap and `X-Robots-Tag` all derive from it.
  **No default**: an unset or unknown value throws and the build fails rather than guessing.
- **Cutover is now one word.** `npm run build` → beta; `npm run build:production` → production. The
  three "remove this at cutover, and not before" comments are gone.
- **The guards were negative-tested, not just written.** A beta artifact checked as production →
  117 problems. A production artifact checked as beta → 115.
- **Caught a bug I had just introduced.** Every canonical initially pointed at `/books.html`, which
  Cloudflare 307-redirects to `/books`. A sitewide canonical nominating a redirecting URL is worse
  than none. Verified against the live server, fixed, and the build now fails on any sitemap entry
  containing `.html`. See N16.
- **F12 rechecked honestly.** Three of six sub-issues were already fixed by earlier prompts; the
  audit's description of them is out of date. One real truncation remained (MWFC Vol. 2) plus two
  descriptions that were near-duplicates in substance. Canonical, Open Graph and Twitter card now on
  29/29 pages.
- **Structured data, narrowly.** Person and Book only, every field already visible on the page. No
  offers, prices, availability or ratings anywhere — checked automatically. No `Event` markup while
  registration is an email interest list (D-16).
- **robots.txt now says what Brian wants**, in his own file: search engines welcome, AI-training
  crawlers disallowed, with a note that the work is his and CC BY-NC-ND licensed.
- **Regression clean**: 406 responsive checks, 58 enforced-CSP loads with zero violations, zero
  rendered-text regressions.

**Prompt 09 — legacy link migration: done.**

- **Inventory refreshed, not inherited.** The live .com sitemap still holds 1,646 URLs, but they
  decompose to **916 real blog posts**, 691 tag listings, 13 archive pages, 15 store URLs and 7
  others. Seven more URLs were found outside the sitemap, in the 2022 export's content links and by
  live probing — four old series slugs that **404 on production today**.
- **1,653 legacy URLs, every one with an explicit disposition, none unresolved.**
- **Poems matched by text, not by slug — which changed the answer.** 20 of the 35 title collisions
  resolve to a `-2` or `-3` permalink. The pack's named case is confirmed:
  `/living-workshop/in-the-mirror` belongs to `/poem/in-the-mirror-2`, scoring 0.82 against it and
  0.13 against `/poem/in-the-mirror`. All 729 candidates were fetched and scored; **690 confirmed**,
  225 sent to `/blog` and listed for review rather than guessed at.
- **734 rules**, all 301, tested: no new route shadowed, no loops, no chains, 1,653/1,653 resolving
  as intended, query strings preserved, no open redirect possible.
- **Fragments handled** — 24 legacy homepage anchors, browser-tested 12/12, with the new site's own
  anchors untouched and no back-button trap.
- **Found a content gap:** `/living-workshop/let-the-mystery-be` is live but missing from the
  "complete" blog archive. Recovered; the archive should be corrected before the old site goes away.

## Needs Brian

| | What |
|---|---|
| N20 | One post is missing from `08 - Blog Archive/`. Recovered here — worth adding, and the README's 915 count corrected, before the old site is taken down. |
| D-05 | `/refund-policy` now 301s to `/terms-conditions`, which carries the same substance. Overrule if you would rather keep it as a standalone historical page. |
| 225 posts | Redirect to `/blog` because no poem match could be confirmed. Listed in `redirect-map.csv` as `low - needs review`. Improvable any time; not a launch blocker. |

**Prompt 10 — integrated release candidate verified: done. Verdict — ready for beta, not yet for production.**

Five defects found and four fixed, which is what a verification pass is for:

- **`npm run build` was broken.** The scripts never called `generate-seo`, so robots.txt would have
  shipped as a placeholder with no sitemap and `check-build` would have failed the Cloudflare build.
  Invisible locally only because this device's sandbox stops the chain earlier. **Fixed**, and all
  three targets now verified end to end on a clean `npm ci` in a Linux container that behaves like
  Cloudflare's builder.
- **The legal pages defined "the Website" as the apex host**, which 301s to www — a Terms of Use
  pointing at a redirect. **Fixed**, plus a guard so it cannot return.
- **`generate-seo` was not idempotent.** **Fixed.**
- **The two Men Writing for Change volumes were indistinguishable** in the book page heading and in
  the poem attribution. **Fixed.**
- **Home LCP regressed to ~2.5 s.** Partly improved and honestly reported — see below.

Verified: 29/29 routes 200 · 28/28 internal links · 49/49 assets · metadata complete with no
duplicates · 12/12 books with correct Amazon attribution · 406 responsive checks · 58 enforced-CSP
loads, 0 violations · 76 journey checks across two widths, two themes and keyboard, 0 failures ·
1,653/1,653 redirects resolving · nothing deleted, no new runtime dependency, no internal notes or
build intermediates in the artifact.

**Performance, stated plainly.** Home sits at ~2536 ms LCP on the 1.6 Mbps / 4x CPU lab profile,
just over the 2.5 s line. Two fixes were tried: `fetchpriority="low"` bought nothing, and trimming
the decorative retreat strip saved 68 KB and moved LCP by nothing. That is the finding — home is not
bandwidth-bound on lazy images, it is serialised behind 113 KB of preloaded fonts and a 130 KB hero.
Getting under the line means dropping the font preload or softening the hero, and neither trade is
worth making for a laboratory number. To be settled with field data after cutover.

## Needs Brian before production

| | What |
|---|---|
| **D-08** | Confirm the retreat's room and meal promises against the Bergamo agreement. The page states them as fact from a promotional document. |
| **D-19** | The Wendell Berry permission claim names Counterpoint Press and has **no recorded source** anywhere in this project. It likely came from the same flyer that produced the "450 acres" error. Produce it, soften it, or drop it. |
| **N20** | Add the recovered post `let-the-mystery-be` to the blog archive and correct its count. After Squarespace goes, there is no other copy. |
| **D-20** | The $350 rate ends 1 December; registration has no opening date and 74 days to run. |

**Prompt 11 — beta deployed and verified live: done. Verdict — the beta is correct; production still gated on four owner decisions.**

Deployed in two steps on purpose. `audit/2026-09` was pushed first, which uploads a preview version
and leaves `brianmueller.org` alone — proving the build succeeds in Cloudflare's own environment
before the production branch was touched. `main` was then fast-forwarded to the same commit, which
deployed. Rollback is one click: promote version `6b802270` in Version History.

**One real defect, and it only existed on the live origin.** Cloudflare was injecting its Web
Analytics beacon into every HTML response, and the CSP was blocking it — a console error on every
page, and a privacy policy that had quietly become false. Ten stages of local testing could not have
caught it: the injection happens at the edge, is gated on a browser-looking User-Agent, and comes
from a zone setting rather than from this repository. See N22.

Brian chose to allow it and disclose it (D-21). The first fix named the wrong host — measuring on
the live origin showed the beacon reports to `/cdn-cgi/rum` on the site's own hostname, not to
`cloudflareinsights.com` (N23). Corrected, and the policy pages were then written from what was
measured: zero cookies, zero local/session storage, zero IndexedDB, one script, HTTP 204 accepted.

Verified live on `brianmueller.org`: 29/29 routes · 76/76 journey checks at two widths, two themes
and keyboard-only · **0 CSP violations** · 24/24 legacy fragments, plus both negative cases · 51
sampled redirect rules and all five catch-alls, 0 failures · four retained policy paths correctly
**not** redirecting · canonical and noindex correct on all 28 · `X-Robots-Tag: noindex, nofollow` on
pages, assets and 404s · HTTP→HTTPS 301 · no external subresource but the one disclosed above ·
nothing from `docs/`, `src/`, `tools/` or `.git/` reachable (12/12 probes 404).

**Prompt 12 — production cutover: done 18 September 2026.** Full record in
`cutover-2026-09-18.md`. Verified against the Cloudflare edge while the `.com` delegation was still
propagating: 28/28 pages 200 with the right canonical and no `.org` reference, indexability guards
removed, 51 sampled redirects and all catch-alls passing, apex→www with query strings preserved,
**76/76 journey checks** on the production artifact.

**Post-propagation verification: done, same day.** Delegation landed a few hours after the cutover
and everything was re-run against the real hostname with no forced DNS — 28/28 pages, 61 sampled
redirects, 76/76 journeys, valid TLS, MX and SPF intact, legacy fragments confirmed in Brian's own
browser. Recorded in `cutover-2026-09-18.md`.

**N20: closed.** "Let the Mystery Be" is in `08 - Blog Archive/`, in date order, with its counts
corrected to 916. Fetched from Squarespace while it was still serving.

## Next step

Prompt 13 — post-launch checks and the maintenance handoff, once there is real traffic to look at.

Two things need Brian first:

1. **Search Console.** There is **no property for brianmueller.com** — neither `commodifyme@gmail.com`
   nor `bdrive.co@gmail.com` has any property at all. One has to be created and verified before a
   sitemap can be submitted, and which Google account owns it is Brian's decision, not a detail.
   Verification by DNS TXT is straightforward now that the zone is on Cloudflare.
2. **Squarespace.** Do not cancel for at least a fortnight. N20 is closed, so the last hard
   dependency is gone, but it remains the only copy of anything else that turns out to be missing.

### Superseded

The cutover section of `release-plan.md` describes a DNS-record change on a zone already at
Cloudflare. That was wrong: brianmueller.com was on NS1 nameservers, and one Worker could not serve
both environments. **`cutover-2026-09-18.md` is the accurate record of what was actually done** and
supersedes that section. The gates listed there are settled: D-08 and D-19 by Brian's affirmation
(D-22), and the second-Worker question by D-23.
