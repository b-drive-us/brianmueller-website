# Release plan

> **Historical, and kept deliberately.** This describes the release candidate as
> it stood before the 18 September 2026 cutover, when staging still lived on
> `brianmueller.org`. That domain was retired at cutover (D-25) and the site has
> since shipped five tagged releases. For the current state read `STATUS.md`;
> for what is next, `../../../RUNBOOK - Next Session.md`. Nothing here should be
> acted on.

Rewritten at Prompt 10 to describe the candidate that actually exists. Updated at Prompt 11,
after the beta was deployed and verified.

---

## 1. The candidate

| | |
|---|---|
| **Branch** | `audit/2026-09` |
| **Commit** | `b2761c8` — *Say on the policy pages that the site counts visitors, and how* |
| **Base** | `main` at `8ea45e5`, which is what the 9 September audit examined |
| **Build** | Astro 5.18.2, static output, zero JavaScript files emitted |
| **Deploy** | Cloudflare Workers static assets, Worker `brianmueller-website`, via Workers Builds on push |
| **Verified on** | a clean `npm ci` in a Linux container — i.e. a machine that behaves like the Cloudflare builder, not the sandboxed bridge |

**Deployed to beta on 2026-09-18.** `brianmueller.org` serves this commit. `main` and
`audit/2026-09` are both at it. Production is untouched: `www.brianmueller.com` is still
Squarespace.

---

## 2. What is different between environments

One file decides: `src/site.config.mjs`. `SITE_ENV` names the environment and everything else
derives from it. **There is no default** — an unset or unknown value throws and the build fails.

| | `production` | `beta` | `preview` |
|---|---|---|---|
| origin | `https://www.brianmueller.com` | `https://brianmueller.org` | `http://localhost:4321` |
| canonical, `og:url`, sitemap | that origin | that origin | that origin |
| `robots` meta | `/404` only | every page | every page |
| `X-Robots-Tag` in `_headers` | absent | injected | injected |
| robots.txt | allow, AI-training crawlers disallowed, sitemap declared | blanket disallow | blanket disallow |
| build command | `npm run build:production` | `npm run build` | `npm run build:preview` |

`tools/check-build.mjs` runs after every build and fails it if the artifact and the environment
disagree. Proven by deliberate mismatch: a beta artifact checked as production produces 117
problems; a production artifact checked as beta produces 115.

---

## 3. Secrets and bindings

**Named only. No values appear in this repository, and none are needed at build time.**

| Name | Where it lives | Used for |
|---|---|---|
| Cloudflare account + Workers Builds GitHub connection | Cloudflare dashboard | building and deploying on push |
| GitHub repository `b-drive-us/brianmueller-website` | GitHub | source of truth |
| *(none in the build)* | — | the build reads no secret, calls no API, and needs no environment variable other than `SITE_ENV` |

A scan of the repository finds no `.env`, key, token or credential file tracked, and no secret
pattern in any source file. The deploy credential is held by Cloudflare, never by the repo.

**Not yet provisioned, and not needed until registration opens:** an authenticated sending domain
(D-04). The site sends no email today; contact and retreat interest are both `mailto:` links.

---

## 4. Rollback

`main` is no longer the rollback artifact — it now carries this work. The rollback artifact is the
**retained Cloudflare version** named below.

- **To undo the beta deploy:** promote version **`6b802270`** in the Worker's Version History. That
  is the `8ea45e5` build, the one that served brianmueller.org until 2026-09-18, and it is retained.
  One click, no rebuild, no push.
- **To undo a production cutover:** the DNS change is the reversible step. Until it is made,
  `www.brianmueller.com` keeps serving Squarespace, untouched by anything here.
- **Do not delete the Squarespace site** until production has been stable for a fortnight. It is the
  only copy of anything that turns out to have been missed — including, as of today, one blog post
  (see gate B3).

---

## 5. Gate A — ready for beta review

**Verdict: yes.** Everything below passes on the candidate.

| | |
|---|---|
| Three builds, clean checkout | exit 0, each producing a correct and distinct artifact |
| Environment guards | negative-tested; they fail loudly on a mismatched artifact |
| Page routes | 29 / 29 return 200 |
| Internal links / assets | 28 / 28 and 49 / 49 resolve |
| Metadata | title, description, canonical, OG and Twitter on 29 / 29, no duplicates |
| Responsive sweep | 406 checks, 0 problems |
| Enforced CSP | 58 loads, 0 violations, 0 console errors |
| Visitor journeys, 2 widths × 2 themes + keyboard | 76 checks, 0 failures |
| Redirect map | 1,653 legacy URLs classified, 0 unresolved; 1,653 / 1,653 resolve as intended |
| Contrast | all 34 text/ground pairs pass WCAG 2.2 AA in both themes |
| Artifact hygiene | no build intermediates, source maps, docs or internal notes shipped |

**Deploying to beta is Prompt 11 and needs Brian's go-ahead.** It publishes to brianmueller.org,
which is public but unindexed.

### Beta deploy steps

**Done on 2026-09-18.** Recorded here because the same shape is worth reusing:

1. Push the working branch first. A non-production branch runs `wrangler versions upload`, so it
   builds and publishes a preview version at `<prefix>-brianmueller-website.brian-b89.workers.dev`
   and **leaves `brianmueller.org` alone**. This proves the build succeeds in Cloudflare's own
   environment before anything visitors see changes.
2. Exercise that preview URL directly.
3. Fast-forward `main` and push. That runs `wrangler deploy` and is the moment the beta changes.
4. Watch the Workers Build log for `seo: beta` and `check: beta ok`. If `check-build` fails, **the
   deploy fails** — that is the design.
5. Run the live checks in section 7.

---

## 6. Gate B — ready for production

**Verdict: not yet.** Four things are outstanding, and none of them is code.

| | What is needed | From |
|---|---|---|
| **B1** | **D-08** — confirm the accommodation promises against the Bergamo premises agreement. The retreat page states "Single occupancy, private bathroom. No roommates, no negotiating" and "Every meal… Dietary needs accommodated" as fact, sourced from a promotional document. Airport pickup is correctly hedged; these are not. | Brian |
| **B2** | **D-19** — produce the Counterpoint Press permission, or soften the sentence, or drop it. A public claim that a named publisher granted a licence should not rest on a flyer — the same flyer that produced the "450 acres" error. | Brian |
| **B3** | **N20** — add the recovered post `/living-workshop/let-the-mystery-be` to `08 - Blog Archive/` and correct the README's count from 915 to 916. After the Squarespace site is gone there is no other copy. | Brian |
| **B4** | **D-20** — decide whether registration opens before 1 December, or the price step moves. As it stands the $350 rate has 74 days to live and no opening date. | Brian |

**B5 is not a gate, but it will bite silently if missed:** the Web Analytics site is registered for
`brianmueller.org` only. See step 2a of the cutover.

Not blocking, but worth an answer before launch: **D-07**, whether the printed book says "Truth" or
"Behold". F08 is implemented against the archive and is reversible either way.

### Cutover steps, in order

1. **On the brianmueller.com zone in Cloudflare** — neither setting carries over from .org:
   - SSL/TLS → Edge Certificates → **Always Use HTTPS: On**
   - AI Crawl Control → Signals → **Managed robots.txt: Off**
2a. **Register `www.brianmueller.com` as a Web Analytics site** (Analytics → Web Analytics → Add a
   site). The beacon is injected by the zone whether or not a site is registered, so skipping this
   means every visitor loads a script that reports nowhere — all of the cost, none of the data, and
   a privacy policy describing analytics that do not exist. Verify afterwards that page views appear.
   If Brian would rather production not count visitors at all, the reverse applies: turn the zone's
   Web Analytics off **and** revert the CSP and both policy pages together (D-21).

2b. Change the Cloudflare build command to **`npm run build:production`**. That one word switches the
   canonical host, the robots meta, robots.txt, the sitemap origin and the `X-Robots-Tag` header
   together. There is nothing else to remember to remove.
3. Deploy, and verify at the real hostname (section 7) **before** pointing DNS at it.
4. Move DNS. This is the reversible step and the real moment of cutover.
5. Submit the sitemap in Search Console. **Do not file a Change of Address** — the production
   address is not changing, only the platform behind it (D-18).
6. Only after production is stable, begin the HSTS ramp: `max-age=300` for a few days, then a year,
   then treat `includeSubDomains` and `preload` as separate decisions (D-12).

**Do not trust the Cloudflare dashboard's own confirmation for any of these.** During Prompt 07 it
reported a setting change that had not saved. Every step below has a `curl` beside it for that reason.

---

## 7. Validation that can only run against a live host

Nothing in section 5 was measured against a real deployment. These are the checks that need one.

### On the beta, immediately after deploying

```
curl -sSI https://brianmueller.org/            | grep -i x-robots     # must be present
curl -sSI https://brianmueller.org/nope        | grep -i x-robots     # present on 404s too
curl -sS  https://brianmueller.org/robots.txt                          # exactly the repo file
curl -sSI https://brianmueller.org/ | grep -i content-security-policy  # the CSP survives the edge
```
Then in a browser: the theme toggle works (a stale script hash breaks it **silently**), and the
console is clean.

### The critical redirect smoke set

```
/home                                 -> 301 /
/store                                -> 301 /books
/store/p/jonah                        -> 301 /books/jonah
/archive-1                            -> 301 /books/trust-stillness
/archive-13                           -> 301 /series/the-bull-series
/the-bull-series                      -> 301 /series/the-bull-series
/refund-policy                        -> 301 /terms-conditions
/privacy-policy                       -> 200   (retained — must NOT redirect)
/living-workshop                      -> 301 /blog
/living-workshop/in-the-mirror        -> 301 https://brianspoems.com/poem/in-the-mirror-2
/living-workshop/2018/11/10/troubles  -> 301 https://brianspoems.com/poem/troubles
/living-workshop/tag/love             -> 301 /blog
```
Plus, in a browser: `/#jonah` lands on `/books/jonah`, and `/retreat#register` still scrolls to the
registration section.

**Also settle here:** whether Cloudflare normalises a trailing slash before or after `_redirects` is
evaluated. `/living-workshop/in-the-mirror/` currently falls through to `/blog` in the local model
(N21). One request answers it.

### On production, after cutover

1. `robots.txt` is the generated file with nothing prepended.
2. `X-Robots-Tag` is **absent** from pages, assets and 404s.
3. `sitemap.xml` is fetchable and every URL in it returns 200, not a redirect.
4. Each sampled page's canonical matches the URL that served it.
5. Search Console Coverage shows no "Page with redirect" or "Alternate page with proper canonical".

---

## 8. Checks needing a person, not a machine

| | Who |
|---|---|
| Real devices — iPhone Safari above all. Only Chromium was ever available here. `device-checklist.md` is a twenty-minute list. | Brian |
| Click two or three Amazon links from a phone. They resolve to the right ASINs but return HTTP 500 to a datacentre IP, so neither "works" nor "broken" has been established. | Brian |
| A screen reader. The structure is correct; correct structure is not the same as sounding right. | anyone with VoiceOver |
| Account security — Cloudflare and GitHub credentials, two-factor, who else can deploy. Out of scope here and unreviewed. | Brian |
