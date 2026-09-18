# Beta handoff — brianmueller.org

**18 September 2026 · Prompt 11 · the beta is live and checked. Production is untouched.**

| | |
|---|---|
| **Live beta** | <https://brianmueller.org> |
| **Build** | commit `c0b5935`, stylesheet `_astro/about.CM_4s7Jy.css` |
| **Environment** | `SITE_ENV=beta` — canonical on brianmueller.org, `noindex` everywhere, blanket `Disallow` |
| **Production** | `www.brianmueller.com` is still Squarespace. Nothing here has touched it. |
| **Rollback** | promote Cloudflare Worker version **`6b802270`** in Version History. One click, no rebuild. |

---

## What a visitor gets that they did not have before

Grouped by what it does for a reader, not by what changed in the code.

**They can find the thing they came for.** Every link to the old site still works — 1,653 legacy
URLs, all resolving. That includes 690 individual poems, each matched to its new home *by comparing
the actual text* rather than by slug: 20 of 35 title collisions turn out to need the `-2` or `-3`
permalink, so slug-matching would have quietly sent readers to the wrong poem. Twenty-four old
homepage anchors like `/#jonah` also land correctly, which no server-side rule can do because a
fragment never reaches the server.

**The site tells the truth about itself.** The fabricated venue acreage and travel time are gone.
The blog archive count no longer hard-codes a number that drifts. Book editions are labelled so the
two Men Writing for Change volumes are distinguishable. Permissions and licensing say what is
actually granted.

**It is readable on a phone and in the dark.** All 34 text-on-background pairs meet WCAG 2.2 AA in
both themes. The header collapses properly at 390px — it could not before, because the theme button
was nested inside the nav.

**It works without a mouse.** Skip link, visible focus on every control, FAQ disclosures operable by
keyboard. Verified, not assumed.

**It is private and it now says so accurately.** No cookies at all — measured, not claimed. One
third-party script, named and explained on both policy pages, with what it sees and what it cannot
do stated separately.

**It is fast and it stays correct.** Fonts cut from 528 KB to 267 KB by removing unreachable design
space. Hashed filenames on everything long-cached, so a stylesheet can never be served stale — a bug
that shipped on this project once already.

**It is hard to attack.** `default-src 'none'`, inline scripts pinned by hash, no `unsafe-inline`
anywhere, and seven negative probes (injected script, off-origin script, off-origin image,
cross-origin fetch, off-site form submit, injected `<base>`, style set from script) all blocked.

---

## F01–F14, where they stand

| | Finding | State |
|---|---|---|
| F01 | Contact route | **closed** — real address, no implementation notes |
| F02 | Legacy URLs | **closed** — 1,653/1,653 resolve, 0 unresolved |
| F03 | Indexing | **closed for beta** — sitemap, canonical, `noindex`, `X-Robots-Tag` all live and verified. Production is one word: `build:production` |
| F04 | Permissions | **closed**, from your decision |
| F05 | Policies | **closed** — and note this one was marked done in error at Prompt 04 and caught at Prompt 07; the cookie policy was still describing Google Analytics. Updated again today (D-21) |
| F06 | Venue claims | **closed** — fabricated acreage and travel time removed |
| F07 | Archive count | **closed** — durable wording, no hard-coded total |
| F08 | Jonah title | **closed** — aligned to the archive, reversible if the printed book differs (D-07) |
| F09 | Book metadata | **open, needs you** — edition labelling done; **three page counts** still unverified |
| F10 | Contrast | **closed** — 34/34 pairs pass AA in both themes |
| F11 | HTTP→HTTPS | **closed** — verified live today: `http://brianmueller.org/` → 301 |
| F12 | Metadata and page identity | **closed** — title, description, canonical, OG and Twitter on 29/29, no duplicates |
| F13 | Copy | **open, needs you** — F13.3 and F13.7 are poem text, which is yours to settle |
| F14 | Registration | **closed as designed** — honest interest list. Stripe deferred at your request |

---

## New this stage

**N22 — Cloudflare was injecting an analytics beacon the CSP was blocking.** This is the one that
matters. Ten prompts and 29 pages of local CSP testing found zero violations; the first browser run
against the live site found nine. Cloudflare inserts its Web Analytics beacon into every HTML
response at the edge — it is not in the repository, `curl` cannot see it because the injection is
gated on a browser-looking User-Agent, and it comes from a zone setting rather than from anything
here. Two things were wrong at once: every visitor got a console error, and the privacy policy had
become false, since it claimed the figures used "no cookie, **no script** and no fingerprint". The
CSP was the only thing preventing that — enforcement by accident. You chose to allow it and disclose
it (D-21); both policy pages now describe it, written from measurement rather than documentation.

**N23 — the obvious fix was wrong, and measuring caught it.** `connect-src
https://cloudflareinsights.com` looks right and is not. The beacon reports to `/cdn-cgi/rum` **on
the site's own hostname**. With the wrong directive deployed, the script loaded and the report was
still silently blocked — a state that looks fixed and is not.

**N24 — three stale git lock files** in the repository cannot be deleted from this session even
after the permission change. Commits were made with git plumbing instead; they are ordinary
commits. **Worth deleting by hand** on your machine — `.git/index.lock`,
`.git/refs/heads/audit/2026-09.lock`, `.git/refs/tags/_probe.lock` — after which normal git works.

---

## What was checked, on the live site

| | |
|---|---|
| Routes | 29/29 return 200 |
| Visitor journeys | **76/76** — 1280px and 390px, light and dark, plus keyboard-only |
| CSP violations | **0** |
| Legacy fragments | 24/24, plus both negative cases (unlisted fragment untouched; does not fire off the home page) |
| Redirects | 51 sampled rules from 734 + all five catch-alls — 0 failures. Four retained policy paths correctly do *not* redirect |
| Metadata | canonical and `noindex` correct on all 28 published pages |
| `X-Robots-Tag` | `noindex, nofollow` on pages, on assets, and on 404s |
| HTTP → HTTPS | 301, single hop |
| External subresources | one, disclosed on both policy pages. Nothing else |
| Evidence leakage | 12 probes for `docs/`, `src/`, `tools/`, `.git/`, `package.json` — **all 404** |
| Contact copy | no implementation notes, no placeholders, no framework names |

**Screenshots** taken at 2× from the live site: home (desktop light, desktop dark, mobile), retreat
(desktop, mobile dark), books, poems, and the 404 page.

**Not tested:** no email or registration delivery test was run, because that specific live action
has not been authorized and there is no form to submit — the interest route is a `mailto:` link. The
remaining manual test is one line: send a message to `brian@choosingpresence.org` from an outside
address and confirm it arrives.

---

## Before production — four decisions, all yours, none of them code

| | What is needed |
|---|---|
| **D-08** | Confirm the retreat's room and meal promises against the **Bergamo premises agreement**. The page states single occupancy, private bathroom and dietary accommodation as fact, sourced from a promotional document. Airport pickup is correctly hedged; these are not. |
| **D-19** | The **Wendell Berry permission** claim names Counterpoint Press and has no recorded source anywhere in this project. It likely came from the same flyer that produced the "450 acres" error. Produce it, soften it to "used with permission", or drop the sentence. |
| **N20** | Add the recovered post `/living-workshop/let-the-mystery-be` to the blog archive and correct the README count from 915 to 916. **After Squarespace goes there is no other copy.** |
| **D-20** | The **$350 rate ends 1 December** and registration still has no opening date — 74 days and counting. Open registration before then, move the price step, or accept that the early rate is a courtesy to the interest list. Then say so on the page. |

Also worth an answer, not blocking: **F09** three book page counts, **F13.3 / F13.7** poem text, and
**D-07** whether the printed book says "Truth" or "Behold".

---

## Cutover checklist

Full version in `release-plan.md`. In order:

1. On the **brianmueller.com zone** — neither setting carries over from .org:
   - SSL/TLS → Edge Certificates → **Always Use HTTPS: On**
   - AI Crawl Control → Signals → **Managed robots.txt: Off**
2. **Register `www.brianmueller.com` as a Web Analytics site.** The beacon is injected by the zone
   whether or not a site exists to receive it — skip this and every visitor loads a script that
   reports nowhere, and the privacy policy describes analytics that are not happening. *(If you would
   rather production not count visitors at all, do the reverse: turn the zone's Web Analytics off
   **and** revert the CSP and both policy pages together. All three move as one.)*
3. Change the Cloudflare **build command to `npm run build:production`**. That one word switches the
   canonical host, the robots meta, robots.txt, the sitemap origin and the `X-Robots-Tag` header
   together. There is nothing else to remember to remove.
4. Deploy and verify **at the real hostname** before touching DNS.
5. **Move DNS.** This is the reversible step and the actual moment of cutover.
6. Submit the sitemap in Search Console. **Do not file a Change of Address** — the address is not
   changing, only the platform behind it.
7. Only once production is stable, begin the HSTS ramp: `max-age=300` for a few days, then a year,
   then treat `includeSubDomains` and `preload` as separate decisions.

**Do not trust the Cloudflare dashboard's own confirmation for any of these.** During Prompt 07 it
reported a setting change that had not saved. Every step in the release plan carries a `curl` beside
it for that reason. And expect the Web Analytics summary card to read **0** even when it is
working — it excludes bot traffic by default; open the site's own overview page instead.

### Rollback

- **Beta:** promote version `6b802270` in the Worker's Version History.
- **Production:** the DNS change is the reversible step. Until it is made, `www.brianmueller.com`
  keeps serving Squarespace, untouched.
- **Do not delete the Squarespace site** until production has been stable for a fortnight. It is the
  only copy of anything that turns out to have been missed — including, today, one blog post.

---

**Ready for production?** The build is. The content is not, until D-08, D-19, D-20 and N20 are
settled — two of those are public claims resting on a document that has already been wrong once, and
one is a copy of a blog post that disappears when Squarespace does.
