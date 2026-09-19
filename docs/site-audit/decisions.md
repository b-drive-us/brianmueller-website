# Decisions

Decisions Brian has already made in this project are recorded in `content-sources.md` and in
`../../PROJECT.md`. This file holds only what is **still open**, plus a recommendation for each so
that silence does not stall the work.

Blocking = cannot reach production without an answer.

---

## D-01 — Registration: sequencing · **ANSWERED 2026-09-12**

**Brian's decision.** Do not add the payment service yet. Fix everything else first. Stripe *is*
coming, on Brian's own Stripe account, and he has Illuman's authorisation to take payment for the
retreat. Registration will be finished — after the rest of the audit work lands.

**What this means for the staged work.** Prompt 03 completes the retreat page as an honest,
clearly-labelled interest list, and states that registration opens later. No mailto is dressed up as
a signup. The Stripe build becomes its own stage after Prompt 10, before or alongside Prompt 11.
Nothing in Prompts 01–10 should be shaped around a payment flow that is not being built yet.

**Still needed before the Stripe stage starts:** D-04 (email sending) and an opening date (F14.2).

---

## D-01a — original framing, superseded

**Evidence.** The retreat page says "Opening soon" and offers a mailto. The project plan commits to
registration being live and promotable before Awaken (5–8 November). No payment path, roster or
confirmation email exists yet. The collection agent agreement was signed by the Acting President of
the Ohio Illuman Board on 2026-08-30, so the money route is papered.

**Tension with the prompt pack.** The pack's standing instruction says not to introduce "a new
framework, content platform, payment service, or major dependency just to complete this audit", and
Prompt 03 says to "use the existing supported service". **There is no existing service.** Building
registration means adding Stripe plus a Worker route plus an email sender — exactly what the pack
tells me not to add casually. The pack also offers the alternative: "a transparent pre-registration
state can be correct before bookings open."

**Recommendation.** Split it. Ship the corrected site with an honest, clearly-labelled interest
list (Prompt 03 completes this, cheaply and truthfully). Treat the Stripe build as its own project
with its own gate, not as audit remediation. That keeps the audit closable and does not force
payment infrastructure through a content-correction workflow.

**Affects.** F14, Prompt 03, the whole release plan.

---

## D-02 — Which production hostname? · **ANSWERED 2026-09-18: `www.brianmueller.com`**

**Evidence.** Today `brianmueller.com` 301s to `www.brianmueller.com`, so www is the incumbent
canonical. Canonical tags, the sitemap, redirects and `astro.config.mjs`'s `site` all depend on the
answer, and getting it wrong splits ranking signals across two hosts.

**Recommendation.** Keep `www.brianmueller.com`. It is what is already indexed and linked; changing
it adds a redirect hop and a migration risk for no benefit.

**Brian's answer, 18 September 2026: `www.brianmueller.com`. RESOLVED — no longer blocking.**

Re-confirmed live before asking: `brianmueller.com` 301s to `www.brianmueller.com` on both http and
https today, so www is genuinely the incumbent. It is now the `production` origin in
`src/site.config.mjs` and is the single place the value lives — canonical tags, `og:url`, the
sitemap and Astro's `site` all derive from it.

**Affects.** F03, F11, F12, Prompts 07, 08, 09, 12.

---

## D-03 — What happens to `brianmueller.org` after cutover? · Non-blocking

**Options.** Keep it as a private staging host (needs access control beyond `noindex`); redirect it
to the production host; or retire it.

**Recommendation.** Keep it as staging, and add real protection — `noindex` asks politely, it does
not prevent access. Cloudflare Access is the usual answer.

**Decided in Prompt 08: keep it open, keep it unindexed.** Brian's brief calls this a *public*
beta — people he sends the link to need to open it without an account, so Cloudflare Access would
defeat its purpose. The exclusion strategy is therefore `X-Robots-Tag: noindex, nofollow` on every
response (pages, assets and 404s) plus a blanket `Disallow` in robots.txt, both generated from
`SITE_ENV` rather than hand-maintained.

Be clear about what that does and does not buy: **the beta is publicly readable by anyone with the
URL, and always was.** Nothing here is access control. It keeps the site out of search results; it
does not keep anyone out. Nothing on the beta is confidential, so that is an acceptable trade — but
it should be a known one, not an assumed one. See D-15.

**Affects.** F03, F11, Prompt 08.

---

## D-04 — How does site email actually send? · **open; blocks registration, not the beta**

**Evidence.** Contact, any registration confirmation, and the December travel form all need to send
mail from an authenticated domain. Nothing exists. This has been open since 2026-08-30.

**Recommendation.** Resend on the production domain (~$20/month at this volume), with SPF/DKIM
records added at the same time as the cutover DNS work so it is one change, not two.

**Affects.** F01, F14, Prompts 03, 07, 11.

---

## D-05 — Do direct digital sales stay retired? · Non-blocking but affects policy text

**Evidence.** Terms still describes direct orders and downloads; the site now sends every purchase
to Amazon. `/refund-policy` exists on the old site and was deliberately not carried over.

**Recommendation.** Confirm retired. Keep terms that still bind past customers, say plainly that
purchases are now through Amazon, and decide whether `/refund-policy` redirects or is retained as a
historical page.

**Affects.** F05.6, F02, Prompt 04.

---

## D-06 — Poem licensing · **ANSWERED 2026-09-12, with two questions back**

**Brian's decision.** All poems are licensed under Creative Commons, including those in the Men
Writing for Change volumes. The men who contributed poems to those books released them into the
public domain.

**That resolves the hardest part of F04** — the site-wide footer grant is legitimate, and the
collaborative volumes are not an exception to it.

**Two things still need Brian before the wording is published:**

1. **Cock-A-Doodle-Doo.** Brian's own FAQ — carried over verbatim from his Squarespace site — says
   its haiku are under traditional copyright and "cannot be used, adapted, copied, or published
   without Brian's permission." That is the opposite of a Creative Commons grant. "All poems are
   Creative Commons" would overwrite a restriction Brian himself published. Which is current?
2. **Public domain and CC BY-NC-ND are different grants.** A public-domain dedication reserves
   nothing — commercial use and derivatives included. CC BY-NC-ND forbids both. So the contributors'
   poems cannot accurately be described as CC BY-NC-ND on the strength of a public-domain release.
   The honest form is probably: the volumes are compilations Brian licenses CC BY-NC-ND, and the
   individual contributed poems were released by their authors into the public domain. That is a
   sentence worth getting right once.

Independent policy work continues meanwhile; only the final licence sentences wait.

---

## D-06a — original framing, superseded

**Evidence.** The footer grants CC BY-NC-ND 4.0 over "poems" site-wide. The FAQ limits it to two
series and excludes Cock-A-Doodle-Doo. Trust Stillness is unclassified. **The Men Writing for
Change volumes contain poems by retreat participants**, and a footer notice on Brian's site cannot
license another man's work.

**Recommendation.** A per-collection matrix: Bull series CC BY-NC-ND; Poem of the Day CC BY-NC-ND;
Cock-A-Doodle-Doo all rights reserved; Trust Stillness — Brian to state; Men Writing for Change —
excluded from the site-wide grant, with a note that contributors retain their own rights. Brian
approves the wording before it is published.

**Affects.** F04, Prompt 04.

---

## D-07 — Which text is authoritative for a poem? · **BLOCKING for F08**

**Evidence.** Three candidate sources disagree: the printed book, the June 2026
`collected-poems-catalog.json`, and brianspoems.com. The site currently says the archive is
definitive while displaying a title the archive does not use ("Truth" vs "Behold").

**Recommendation.** The printed book is the master; the archive is the public reference; the
catalog is a working copy. Where the archive and the site disagree, check the book and correct
whichever is wrong — including the archive. Do not edit poem text to resolve a title dispute.

**Affects.** F08, F13.3, F13.7, Prompt 02.

---

## D-08 — Are the retreat's accommodation promises confirmed? · **BLOCKING for F06**

**Evidence.** The page promises single occupancy, a private bathroom for every participant, all
meals, dietary accommodation, and volunteer airport pickup. These come from the event notice, which
is a promotional document. The audit is right that a promotional document is not a venue contract.

**Recommendation.** Check each against the Bergamo premises agreement. Anything unconfirmed gets
qualified ("we expect", "we will try to arrange") rather than dropped or stated flatly.

**Affects.** F06.3, F14.4, Prompt 02.

---

## D-09 — Spelling convention · Non-blocking

British spellings ("favourite", "licence") are mine and are inconsistent with Brian's US-oriented
copy. **Recommendation:** US throughout. No decision needed unless Brian disagrees.

---

## D-10 — Does the audit workflow allow a pushed branch? · Process

Whether Cloudflare builds non-`main` branches is unconfirmed. Until it is, nothing gets pushed.
**Recommendation:** confirm in the Cloudflare dashboard during Prompt 01; if preview deployments
are off, branch pushes are safe and make review easier.

---

## D-11 — Stay on Astro 5.18.2 through cutover; upgrade after, on its own branch

**Decided by:** Claude, on evidence, during Prompt 07. **Brian can overrule.**

Astro 5 is end-of-life and `npm audit` calls it critical. Every one of the ten advisories was
checked against this build and none is reachable: no SSR, no islands, no image optimization, no
`define:vars`, no `base`, and now no spread props. The deployed artifact is static files with no
JavaScript, no forms and no user input.

The upgrade to 7.3.2 was attempted and rejected because it silently corrupts rendered prose in
fourteen places across eight pages (N10), and will keep doing it to new writing. Taking a two-major
framework jump whose failure mode is invisible text corruption, three weeks before a go/no-go, to
clear advisories that cannot be triggered, is the wrong trade.

**The plan, after cutover:** a branch of its own, `npm install astro@latest`, then
`python3 tools/compare-build-text.py <old dist> <new dist>` until it reports zero, then the
406-check sweep, then a pixel comparison. Rewriting the affected paragraphs so the inline element
sits on the same line as the text before it is a stable fix in every Astro version.

**Review this if** any of these becomes true: the site gains a form, an endpoint, SSR, an adapter,
`astro:assets`, or any handling of visitor input. Any one of them turns "unreachable" into
"reachable" and the upgrade becomes urgent.

## D-12 — Turn on Always Use HTTPS; hold HSTS until after cutover — **needs Brian**

`http://brianmueller.org/` answers `200` on plain HTTP today (F11, reproduced live).

**Brian's answer, 12 September 2026: walk him through it in his own browser.** Doing it together
rather than unattended, so he sees the setting and confirms before it changes.

**What is needed, in the Cloudflare dashboard for the zone:**
SSL/TLS → Edge Certificates → **Always Use HTTPS: On**. It 301s to the identical URL, preserving
path and query. Not a DNS change, reversible in one click. It is an account settings change, so it
is not being made without Brian's say-so. It should be set on **brianmueller.com** as well as
**brianmueller.org** at cutover.

**HSTS is deliberately NOT enabled and no `Strict-Transport-Security` header is set.** HSTS tells
a browser to refuse plain HTTP for a host for months. Enabling it before every hostname that will
serve this site can answer over TLS locks people out, and `includeSubDomains` extends that to
subdomains that may not be ready. `preload` is close to irreversible.

### Done, 12 September 2026 — verified

Turned on with Brian watching, in his own browser. Confirmed from outside Cloudflare:

```
http://brianmueller.org/                       -> 301  location: https://brianmueller.org/
http://brianmueller.org/books/jonah?utm=x&x=1  -> 301  location: .../books/jonah?utm=x&x=1
http://brianmueller.org/no-such-page           -> 301  (redirect precedes the 404, correct)
curl -L http://brianmueller.org/                -> hops=1, final https, 200. No loop.
```

Query strings survive intact and the chain is a single hop. Cloudflare's own warning about redirect
loops does not apply here: it is about an origin that also forces HTTPS, and this origin is Workers
static assets, which serves whatever scheme it is asked on.

One thing worth writing down for next time: the first click, made against the toggle's accessibility
reference, reported success and the page even said "this setting was last changed a few seconds
ago" — but it had not saved. `curl` still returned 200, and a reload showed the toggle off. Clicking
the toggle by screen coordinate worked. **The dashboard's own confirmation was wrong; the external
check was right.** Verify Cloudflare settings from outside Cloudflare.

**Still to do at cutover:** the same setting on **brianmueller.com**.

**Order, once Brian approves:**
1. ~~Always Use HTTPS on, on both hostnames.~~ Done on brianmueller.org. brianmueller.com at cutover.
2. Cutover completes and production is stable on brianmueller.com.
3. Then `Strict-Transport-Security: max-age=300` for a few days, watching for anything that breaks.
4. Then raise to `max-age=31536000`.
5. `includeSubDomains` only after checking every subdomain of brianmueller.com — and note that
   brianspoems.com is a separate domain, so it is unaffected either way.
6. `preload` only if Brian actively wants it. It is very hard to undo.

## D-13 — Cloudflare's managed robots.txt makes an AI-training decision for Brian — **needs Brian**

Cloudflare prepends a managed block to robots.txt (see F03 follow-up). Beyond weakening the staging
`Disallow` — which the `X-Robots-Tag` header covers — it declares on Brian's behalf:

```
Content-Signal: search=yes,ai-train=no,use=reference
```

and disallows ClaudeBot, GPTBot, CCBot, Google-Extended, Applebot-Extended, Amazonbot, Bytespider
and meta-externalagent.

That is a rights position on Brian's poetry, set by a hosting default. It may well be the position
he wants — his books are CC BY-NC-ND, which is a restrictive licence — but it should be his, and it
interacts with how the poems are licensed and how `brianspoems.com` is configured.

**Three options:**
1. **Keep it.** Simplest. Search engines may index, AI training is refused.
2. **Turn the managed robots.txt off** (Cloudflare → the zone → Settings) and write the whole file
   in this repo. Brian controls every line and it is reviewable in git — which also removes the
   conflicting `Allow: /` for good.
3. **Keep the block but change the signals** in Cloudflare to whatever Brian actually wants.

Recommendation: **option 2** at cutover. On a site whose entire content is the author's own
copyrighted work, the file that tells crawlers what they may do should live in the repository and
not change when a vendor updates a default.

**Brian's answer, 12 September 2026: option 2 — turn the managed robots.txt off and own the file.**

Doing it **now** rather than at cutover, because it strictly strengthens the staging guard: with the
managed block gone, the repository's `Disallow: /` is the only group for `User-agent: *` and the
conflicting `Allow: /` disappears. There is no downside to being early here.

Two pieces of work follow:

1. **Cloudflare** — ~~turn the managed robots.txt off for the zone.~~ **Done, 12 September 2026**,
   in AI Crawl Control → Signals. Verified: `https://brianmueller.org/robots.txt` is now **5 lines**,
   exactly the file in this repository, down from 66. The prepended `User-agent: * / Allow: /` is
   gone, so the staging `Disallow: /` is now the only group for `*` and no longer competes with a
   contradictory rule. The `X-Robots-Tag` header remains the primary guard regardless.
2. **The repository** — author the production robots.txt, including whatever AI-crawler position
   Brian wants stated in his own words rather than Cloudflare's defaults. That belongs to
   **Prompt 08**, which is where robots directives, canonical URLs and the sitemap are set per
   environment; `public/robots.txt` stays `Disallow: /` until cutover. Open question for Prompt 08:
   whether Brian wants to keep the substance of what Cloudflare was asserting (search yes, AI
   training no) or take a different line — and whether brianspoems.com should say the same thing.

## D-14 — Workers delivery diagnostics stay on through launch

`wrangler.jsonc` has `observability.enabled: true`, which records request-level logs at Cloudflare.
Kept on: it is how a broken redirect or a 404 storm gets noticed in the days after cutover. It is
now disclosed in the privacy policy rather than being an undocumented data flow. Worth revisiting a
month after cutover, when the diagnostic value has largely been spent.

## D-15 — robots.txt is not access control, and Disallow is not noindex

**Recorded in Prompt 08** because both confusions are easy to make and expensive to discover late.

**robots.txt is a request.** It is a public file asking well-behaved crawlers to stay out. It
authenticates nobody, blocks nobody, and is itself readable by anyone — a `Disallow` line is a
signpost to the thing it names. Nothing on this site is protected by it, and nothing confidential
should ever rely on it.

**Disallow and noindex do different jobs, and combining them badly does neither.** `Disallow` tells
a crawler *not to fetch* the page. A page it never fetches is a page whose `noindex` it never sees —
so a URL that is only disallowed can still end up listed, without a description, on the strength of
links pointing at it from elsewhere. If the goal is "not in search results", the directive has to
reach the crawler: `X-Robots-Tag` on the response, or a `robots` meta tag on a page the crawler is
allowed to fetch.

**What this site does, and why:**

| | Beta (brianmueller.org) | Production (www.brianmueller.com) |
|---|---|---|
| `X-Robots-Tag` | `noindex, nofollow` on every response | absent |
| robots meta | on every page | on `/404` only |
| robots.txt | blanket `Disallow: /` | `Allow: /`, AI-training crawlers disallowed, sitemap declared |
| sitemap.xml | generated, listing beta URLs | generated, listing production URLs |

The header is the guard that actually works on the beta, and it is the one verified at the live
edge. The robots.txt disallow is belt and braces, and is honest about being so in its own comments.

A sitemap is generated in **both** environments on purpose. A sitemap is not an invitation to index —
the `noindex` directives decide that — and having one on the beta is the only way to test that it is
correct before the day it matters.

## D-16 — No Event structured data on the retreat page yet

The retreat's dates, venue and organiser are approved facts and could carry schema.org `Event`
markup. It is deliberately not there.

`Event` markup invites Google to present the retreat as something you can book, and registration is
currently an honest email interest list, not a booking (F14). Marking it up as an event while the
only action is "send an email" sets an expectation the page does not meet — and the prompt pack is
explicit about never inventing offers, availability or event status for rich results.

`Person` and `Book` markup **is** emitted, because every field in it is already visible on the page
and verified in `src/data/books.json`: title, author, ISBN-13, page count, year, publisher. No
offers, no prices, no availability, no ratings, no reviews.

**Revisit** when the Stripe registration flow is live. At that point `Event` with real `offers`
becomes accurate rather than aspirational.

## D-05 — resolved: `/refund-policy` redirects to Terms

Direct digital sales are retired; every purchase now goes to Amazon from the book pages. The old
`/refund-policy` said, in substance, "all sales are final, no refunds, purchases from other sellers
follow that seller's policy".

The new `/terms-conditions` already carries the same substance in its section **4) All Sales Final /
No Refunds**, including the cancellation case. So `/refund-policy` **301s to `/terms-conditions`**
rather than being dropped: a past customer following an old link still reaches the terms that bind
their purchase, which is what step 4 of the prompt asks for. Nothing binding was removed.

`/cart` and `/checkout` redirect to `/books`, where every title links to its Amazon listing.

**Brian can overrule this** — the alternative is keeping `/refund-policy` as a standalone historical
page. That is a content decision, not a technical one.

## D-17 — the blog is redirected per-poem where the poem is identifiable, and to `/blog` otherwise

916 legacy blog URLs, and Brian's standing decision that brianspoems.com is the definitive home for
the poems while the new brianmueller.com is the author site.

Sending all 916 to one page would throw away every specific inbound link. Sending all 916 to a
same-titled poem would, demonstrably, send many readers to **the wrong poem** — 20 of the 35
title-collision cases resolve to a `-2` or `-3` permalink rather than the bare slug (N19).

So: **690 redirect to their specific poem, confirmed by comparing the actual text**; the remaining
226 redirect to `/blog`, which explains where the archive lives. The unconfirmed ones are listed in
`redirect-map.csv` with `confidence = low - needs review`, so the residue is visible and can be
worked through later rather than being quietly papered over.

## D-18 — `.org` after cutover, and no Change of Address

**The production site address is not changing.** `www.brianmueller.com` is the production hostname
today and remains so (D-02). What changes is the platform behind it.

Therefore: **do not file a Search Console Change of Address.** That tool is for moving a site to a
different domain. Filing one because a beta host is being retired would be telling Google about a
move that is not happening.

`brianmueller.org` stays as the beta (D-03): publicly reachable, `noindex` on every response, and
never a canonical target. Nothing on the production site points at it — `tools/check-build.mjs`
fails the build if a production artifact contains the string.

What *does* need Search Console at cutover is the new sitemap, and watching Coverage for redirect
and canonical warnings. Both are in `release-plan.md`.

## D-19 — The Wendell Berry permission claim has no recorded source — **needs Brian**

Raised in Prompt 10. The retreat page states, as fact:

> Permission to use excerpts from his work has been graciously granted by his publisher,
> Counterpoint Press. Please note that Mr. Berry has not endorsed or sponsored this event.

The disclaimer in the second sentence is careful and right. The first sentence is a **public claim
that a named publisher granted a licence**, and there is no record of where it came from anywhere in
this project's files — no email, no letter, no note in `content-sources.md`.

It most likely came from the retreat's promotional event notice. That is the same document that
produced "four hundred and fifty acres", which was wrong by a factor of three and had to be removed
in F06. A promotional flyer is not a permissions file.

**This is not a claim to leave standing on unverified provenance.** Three ways to settle it, in
order of preference:

1. **Brian produces the grant** — the email or letter from Counterpoint. Record it in
   `content-sources.md` and the sentence stays exactly as it is.
2. **Soften to what is certainly true**: "Excerpts from Wendell Berry's work are used with
   permission." Still a claim, but a smaller one, and it drops the publisher's name from an
   assertion they have not seen.
3. **Remove the sentence.** The retreat is "inspired by and celebrates" Berry either way, and the
   non-endorsement disclaimer can stand alone.

Until Brian answers, this is an **open content risk on a live page**, and it is listed as a gate in
`release-plan.md` rather than treated as settled.

## D-20 — The early rate expires before registration is scheduled to open — **needs Brian**

Not a defect in the page. A timing problem the page makes visible.

Today is **18 September 2026**. The retreat page says registration is "opening soon" and that the
opening date is not fixed. It also says **$350 through December 1, 2026, $400 after that**, and the
refund tiers step on the same date.

That leaves 74 days. If registration opens in, say, late November, almost nobody will have had a
realistic chance at the lower rate, and the December 1 refund tier will have been live for only days
before it changed. If it opens after December 1, the $350 rate never existed in practice.

**Brian's call, and it is a business decision, not a copy edit.** The options are to open
registration well before December 1, to move the price step, or to keep both and accept that the
early rate is mostly a courtesy to people already on the interest list. Whichever he chooses, the
page should then say it plainly.

## D-21 — The site counts visitors, and the policy pages say so — **decided by Brian, 18 Sept 2026**

The `brianmueller.org` zone had Cloudflare Web Analytics on automatic setup, so Cloudflare was
injecting a beacon into every HTML response. The CSP was blocking it (N22). Brian was given the
choice of turning the injection off or allowing it and updating the policies, and chose to allow it
— consistent with `brianspoems.com` and `mroptalk.com`, which already run it.

**What was measured, on the live origin, in a real browser, before any policy copy was written:**

| | |
|---|---|
| Script | `static.cloudflareinsights.com/beacon.min.js`, loaded with an SRI `integrity` hash |
| Reports to | `/cdn-cgi/rum` on **this site's own hostname** — not to a third-party endpoint |
| Cookies set | none, after two page views |
| `localStorage` | empty |
| `sessionStorage` | empty |
| IndexedDB | no databases |
| Other off-origin requests | none |

The `spa` mode in the injected token is 2, but this is a multi-page site, so each page load reports
once and there is no history hooking to speak of.

**What the CSP now allows**, and why each piece is the shape it is:

- `script-src … https://static.cloudflareinsights.com` — the host serving the beacon. Hashes and a
  host source coexist; the three inline-script hashes are unchanged and still enforced.
- `connect-src 'self'` — not a third-party host, because the report is same-origin (N23), and not a
  literal origin, because `_headers` is shared by beta and production and the hostname differs.
  `'self'` stays tight here: the site makes no `fetch` or XHR of its own at all.

**What the policy pages now say**, written from the table above rather than from Cloudflare's
documentation:

- The **cookie policy** keeps "this website sets no cookies", which is measured and true, but no
  longer lets a reader infer "no analytics" from it. A new section names the script, separates what
  it does see (IP address, which page) from what it does not do (cookie, identifier, cross-site
  tracking), and states that a content blocker stops it with no loss of function.
- The **privacy policy** replaces the claim that Cloudflare's figures used "no cookie, no script and
  no fingerprint". The no-script half of that became false the moment the beacon ran.

**The coupling to remember.** Three things now have to agree: the zone setting, the CSP, and the two
policy pages. Switch Web Analytics off for a hostname and all three change together, or the site
starts claiming something that is no longer true — which is exactly the failure this decision was
made to end. `public/_headers` says so at the point of the change.

**At cutover this is not automatic.** The Web Analytics site is registered for `brianmueller.org`.
`www.brianmueller.com` will need its own Web Analytics site, or the beacon will be injected on a
hostname that has no place to report to. Listed in the cutover checklist in `release-plan.md`.

## D-22 — D-08 and D-19 closed by Brian's affirmation, not by verification — **recorded 18 Sept 2026**

At the Prompt 12 gate Brian was shown what cutover would publish and chose **"cut over as-is, I
accept the claims."** Both are therefore closed for launch. The distinction this entry exists to
preserve:

- **D-08 (Bergamo room and meal promises)** and **D-19 (the Counterpoint Press permission for
  Wendell Berry's work)** are closed **because Brian affirmed them from his own knowledge.**
- Neither was verified against a source document. The premises agreement was not seen. The
  permission grant was not produced. No source for either is recorded in `content-sources.md`.

That is a legitimate way to close them — Brian is the person who would know, and it is his site and
his retreat. It is recorded this way so that nobody later reads "closed" as "checked", and so that
if either claim is ever questioned, the record says exactly what it rests on.

**D-19 remains the more exposed of the two**, because it names a third party. If Counterpoint Press
ever asks, the answer is Brian's recollection rather than a document. Softening the sentence to
"used with permission" without naming the publisher would remove that exposure at no real cost to
the page, and remains available at any time.

**N20 is untouched by this and is not a launch blocker.** Cutover does not delete anything: the
Squarespace site stays up. But `/living-workshop/let-the-mystery-be` still exists in only one place,
and that place disappears the day Squarespace is cancelled. Add it to `08 - Blog Archive/` before
then.

## D-23 — Two Workers, because the artifact is environment-specific — **18 Sept 2026**

The release plan assumed the cutover was a build-command change. It is not, and the reason is worth
stating plainly because it was nearly missed.

**This project bakes the environment into the files.** `npm run build:production` writes the
canonical host, the robots meta, robots.txt, the sitemap origin and the `X-Robots-Tag` header into
the artifact itself. That was a deliberate design — "one word is the whole switch", nothing to
remember to remove at cutover — and it works. But it has a consequence nobody drew out until now:

**One Worker cannot serve two environments.** `brianmueller.org` and `www.brianmueller.com` were
both custom domains on the same Worker, serving one artifact. The moment the build command became
`build:production`, brianmueller.org would have started serving indexable pages whose canonical
pointed at brianmueller.com — a duplicate of the new site, live, competing with it in search, and in
direct contradiction of D-03 and D-18, which say .org stays `noindex` on every response.

Three ways out were put to Brian: a second Worker for the beta; retiring .org to a redirect; or
keeping one Worker and forcing `noindex` on .org with a zone-level header rule. **Brian chose the
second Worker.**

It is also the right answer for a reason beyond this cutover. The third option would have
reintroduced exactly the per-hostname state the build design exists to eliminate — one forgotten
zone rule and .org competes with .com. The second option would have left the site with no staging
host at all, on a project that has just spent twelve stages finding things that only appeared when
something was deployed. The beta earns its keep.

| Worker | Config | Build command | Hostname |
|---|---|---|---|
| `brianmueller-website` | `wrangler.jsonc` | `npm run build:production` | `www.brianmueller.com` |
| `brianmueller-website-beta` | `wrangler.beta.jsonc` | `npm run build:beta` | `brianmueller.org` |

Both build from `main`. **The beta project's deploy command must be
`npx wrangler deploy -c wrangler.beta.jsonc`.** Without `-c` it reads `wrangler.jsonc`, whose name is
`brianmueller-website`, and the beta project deploys over production. That is the single way to get
this wrong, and it is called out at the top of `wrangler.beta.jsonc` as well as here.

## D-24 — `brianmueller.org` retired; the staging Worker kept — **decided by Brian, 18 Sept 2026**

Hours after launch Brian asked to delete brianmueller.org and point it at the live site. Two things
were tangled in that request, and separating them mattered.

**The hostname and the staging capability are not the same thing.** The Worker
`brianmueller-website-beta` has its own address and works whether or not `.org` points at it. Given
that three defects in this project surfaced *only* once something was deployed — the injected
analytics beacon (N22), a canonical nominating a redirect (N16), and a `npm run build` that was
silently broken (Prompt 10) — a place to deploy that is not production earns its keep. Brian chose
to retire the hostname and keep the Worker.

**What is live now:**

| | |
|---|---|
| `brianmueller.org`, any path | **301 → `https://www.brianmueller.com/<same path>`**, query string preserved |
| Staging | `https://brianmueller-website-beta.brian-b89.workers.dev`, still `noindex, nofollow` |
| Production | unchanged |

**The part that looks like clutter and is not.** `brianmueller.org` is still attached to the beta
Worker as a custom domain, and that attachment is load-bearing: it *is* the proxied DNS record that
brings requests to Cloudflare's edge, which is where the redirect rule runs. Redirect rules execute
before the Worker, so the Worker never actually serves .org. **Remove that custom domain and the
redirect stops working** — .org would resolve to nothing. If it is ever removed deliberately,
replace it with a proxied placeholder record (the usual pattern is `AAAA @ 100::`, proxied) or the
domain goes dark.

**A consequence that had to be fixed in the same breath.** The beta build's canonical said
`https://brianmueller.org/` — which now redirects. A canonical nominating a redirecting URL is worse
than none, and it is precisely the bug N16 recorded. `site.config.mjs` now gives the beta its Worker
address as its origin, so the beta's canonical, sitemap and `og:url` name the place it actually
lives. `check-build.mjs` passes on all three environments; production is untouched and still asserts
that no production artifact contains the string `brianmueller.org`.

**Not done, and deliberately:** the `.org` domain registration was left alone. A retired domain that
still redirects is only worth anything while it is registered, and letting it lapse would hand a
live 301 into someone else's hands. Renew it, or decide separately to let the redirect die.

## D-25 — `brianmueller.org` fully retired, the redirect included — **decided by Brian, 18 Sept 2026**

Hours after D-24 Brian went further: remove every attachment to the domain, not just the hostname,
because he does not expect to renew it and does not want anything of his still wired to a name
someone else may register.

**One premise in that reasoning is worth correcting, and it is reassuring rather than otherwise.**
Removing the Cloudflare configuration is not what protects him. The moment the registration lapses
and a new owner points the domain at their own nameservers, this account's zone becomes irrelevant
regardless of what is in it. The actual protection was already in place and was measured before
anything was touched: **nothing depends on .org.** No MX, no SPF, no TXT, and **zero references to
the string `brianmueller.org` anywhere in the live site**, its sitemap or its robots.txt. The
cleanup is tidiness, not risk reduction.

**Removed, in this order:** the redirect rule created hours earlier under D-24; the `brianmueller.org`
custom domain on `brianmueller-website-beta`; the last DNS record with it; and finally the **zone
itself**. The staging Worker is untouched and still serves at
`brianmueller-website-beta.brian-b89.workers.dev`. Production is untouched.

**What could not be achieved, stated plainly.** Brian asked for the domain to "appear as a parked
domain at Cloudflare." It does not quite. With zero DNS records the apex *still* resolves to
Cloudflare's anycast addresses and returns **HTTP 530** (error 1016, origin DNS error) — a
Cloudflare-branded error page rather than a clean "site not found". Pausing the zone did not change
it; Cloudflare's own pause notice says it "continues to resolve the DNS". `www.brianmueller.org`
does correctly return NXDOMAIN; only the apex behaves this way.

**Resolved the same evening: Brian chose to remove the zone entirely.** Done — Overview → Advanced
Actions → Remove from Cloudflare, confirmed by typing the domain name. Cloudflare's own dialog
states it does not touch the domain registration, and the account was on the Free plan, so no
subscription was cancelled.

**The 530 is gone.** `https://brianmueller.org/` now fails to connect at all rather than serving a
Cloudflare error page — which is the state Brian was after. Public resolvers will keep returning the
old addresses until their cached TTLs expire; that is cache, not configuration.

**One loose end, and it belongs at the registrar, not here.** The nameservers at NameCheap still
delegate brianmueller.org to `david`/`dora.ns.cloudflare.com`, which no longer host a zone for it.
For a domain being allowed to lapse that is harmless — it simply stays dark. If Brian wants it tidy
before expiry, switching NameCheap back to its own BasicDNS takes a minute and is a registrar
action, not a Cloudflare one.

**Also not done, deliberately:** the domain registration itself. Letting it lapse is Brian's stated
intent and needs no action — but it is a decision, not an oversight, and it is recorded here as one.

---

## D-26 — Page counts: the site counts numbered pages, Amazon counts printed leaves

**Brian, 19 September 2026**, from the books in his hands.

| | site | numbered pages, verified | Amazon |
|---|---|---|---|
| Bull Heart (978-0996812023) | 86 | **86** | 100 |
| Jonah (978-1733501200) | 450 | **450** | 476 |

Both Amazon links resolve to the same ISBN the site shows (`/dp/0996812024`,
`/dp/1733501207`), so these compare the same printing. Amazon's figure counts
every printed leaf, including unnumbered front and back matter; the site counts
numbered pages. **Both site numbers stand.** The caveat changes from "may sell a
later printing with a different date or page count" — which explains nothing —
to naming the actual difference, which a reader can check.

Closes the Bull Heart and Jonah halves of `R05`.

## D-27 — Men Writing for Change Vol. 1 is recorded from the second printing

The site showed "Pages 50 · ISBN 978-1979552424". The 50 is real — Brian counted
it — but the copy he counted is **978-1717351692, the second printing**. The
Amazon link resolves to `/dp/1979552428` = 978-1979552424, the **first**
printing, listed at 48 pages. The two sides were never describing the same book,
so Amazon's 48 was never a contradiction; and the site's page count was attached
to a printing nobody has verified.

**Decision:** the second printing becomes the primary record — 978-1717351692,
50 numbered pages — with the first printing (978-1979552424, 2017) noted, and a
line saying which one the Amazon link sells. Record what can be vouched for.

Closes `R05`.

## D-28 — Men Writing for Change: contributors stay off the structured data

**Brian, 19 September 2026.** Credit him as **author and editor** on both
volumes. The contributing men are not named in the machine-readable record.

They are real people and a poem written in a council circle is a personal
thing; nothing goes into a public dataset without their say-so, and nobody is
invented. The visible prose on both pages already says the poems are the
retreat's rather than Brian's alone, which is where a reader learns it. Adding
`editor` alongside `author` narrows the gap between the two.

Closes `R06`.

## D-29 — The Men Writing for Change poems were assigned to Brian, not released to the public domain

**Brian, 19 September 2026:** *"When I published the poems in the Men Writing
for Change series, they explicitly granted the copyright to me. I've licensed
everything under the CC-BY-NC-ND terms."*

This settles a contradiction the FAQ carried in a single answer: one paragraph
licensed the Men Writing for Change poems under CC BY-NC-ND, and the next said
those poems were "released by their authors into the public domain". Both cannot
be true — CC BY-NC-ND is a copyright licence, and nobody can attach
non-commercial and no-derivatives conditions to a work in the public domain.

Because the copyright was **assigned**, the licensing statement is the correct
one and the footer's flat "Poems licensed CC BY-NC-ND 4.0" is accurate across all
twelve books. Only the public-domain sentence is wrong. It is replaced with a
statement of the assignment that still credits the men who wrote the poems.

The Disclaimer also gains a pointer to the licence: it told readers to "obtain
permission from the copyright owner" without mentioning that almost everything
here is already licensed, so someone following it wrote to ask for permission
they had been granted before they asked.

Closes `R04`.

## D-30 — The retreat's refund schedule governs, and PDFs come off the site

**Brian, 19 September 2026.**

- **Refunds.** The schedule published on `/retreat` is the policy and the one he
  will hold to when Stripe is live: full refund less a $35 administrative fee
  through 1 December 2026, half from 2 December to 1 January, none after
  1 January because the Bergamo Center bills for the room and meals either way —
  with a standing invitation to write if something serious happens. Terms §4
  ("All purchases are final. We do not offer refunds") is scoped to historical
  direct sales and explicitly does not reach retreat bookings.
- **Direct sales did happen.** brianmueller.com sold PDF copies of the books in
  the past, through a `/store` page that no longer exists. So §§3–5 are not
  fiction; they are history, and they are written in the present tense. They get
  scoped rather than deleted, which also preserves any obligation to a past
  buyer.
- **PDFs come off for now.** Brian intends to sell PDFs again later. Until then
  the site should not offer them.
- **The weekend schedule comes off `/retreat`.** The six numbered sessions and
  their times are removed; the heading becomes "Multiple Writing Experiences".
  The programme is not being committed to in public at this level of detail.

Feeds `R07` and the Terms rewrite.

## D-31 — Both addresses come out of the markup; the form is the real fix

**Brian, 19 September 2026.** *"Get my email off the contact page ASAP. I don't
want that out there."* Tom Sparough's gets the same treatment.

Shipped in 1.4.0: `src/components/MailLink.astro` plus one assembling script in
`Base.astro`. No address, and no `mailto:`, survives in the built HTML.

What this is worth, stated plainly so nobody later mistakes it for more than it
is: it stops a crawler that regexes the HTML, which is the kind that actually
fills an inbox. It does not stop a scraper driving a headless browser, and it
cannot — the page is public and the browser has to be able to assemble the
address for a visitor to use it. **The contact form removes the need for the
address to be on the page at all, and it is the next piece of work.**

Blocked, as Stripe is, on item 24: a way for the site to send mail. Note that
the CSP carries `form-action 'none'`, which the form will have to change.

## D-32 — HSTS at six months, because Cloudflare offers nothing shorter

**Brian, 19 September 2026.** The plan called for a graduated ramp — 300
seconds, then a day, then a year — so that a mistake could be undone quickly.
Cloudflare's control offers 0 or one to twelve months and nothing between, and
the API enforces the same list, so the ramp was not available on this zone.

Brian chose 6 months (`max-age=15552000`), `includeSubDomains` off, `preload`
off. Preload stays off: it is close to irreversible and is not worth it here.
Verified on the live origin with `curl -sSI`, not in the dashboard.

## D-33 — The twelve title-changed poems are the same poems; ship the redirects

**Brian, 19 September 2026.** Section C of `poem-matches-for-review.md`, the
matches found by body text after the title changed. Brian approved all twelve:
the eight where the title was only rewritten (*Who'm I Kidding?* → *Who am I
Kidding?*, *A Slave Ship Named Jesus* → *…Called Jesus*, *One in the Same* →
*One and the Same*, *It's Alright* → *It's All Right*, the schwa spelling of
*Imperfect Love*, *Your Life Story* → *My Life Story*, *Pet Alligator PSA* →
*Alligator PSA*, *Trust Stillness (Journey into Midlife)* → *Trust Stillness*)
and the four renamed outright (*Allow Yourself to Sit* → *Choosing Presence*,
*Darlings of the Status Quo* → *We Were Among the Young and Sexy*, *Vulnerable
and Open* → *A Speck of Truth*, *Don't Interfere (With Love)* → *Everywhere*).

All twelve destinations verified HTTP 200 on 19 September 2026.

## D-34 — The 174 unmatched legacy URLs stay pointed at /poems

**Brian, 19 September 2026.** Section D. Nothing scored above 0.30 against any
of the 1,834 archive poems and many of the titles are announcements rather than
poems. `/poems` carries a line written for a reader arriving from an old link,
which is the right landing for them. Question closed.
