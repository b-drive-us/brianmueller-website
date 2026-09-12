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

## D-02 — Which production hostname: `brianmueller.com` or `www.brianmueller.com`? · **BLOCKING**

**Evidence.** Today `brianmueller.com` 301s to `www.brianmueller.com`, so www is the incumbent
canonical. Canonical tags, the sitemap, redirects and `astro.config.mjs`'s `site` all depend on the
answer, and getting it wrong splits ranking signals across two hosts.

**Recommendation.** Keep `www.brianmueller.com`. It is what is already indexed and linked; changing
it adds a redirect hop and a migration risk for no benefit.

**Affects.** F03, F11, F12, Prompts 07, 08, 09, 12.

---

## D-03 — What happens to `brianmueller.org` after cutover? · Non-blocking

**Options.** Keep it as a private staging host (needs access control beyond `noindex`); redirect it
to the production host; or retire it.

**Recommendation.** Keep it as staging, and add real protection — `noindex` asks politely, it does
not prevent access. Cloudflare Access is the usual answer.

**Affects.** F03, F11, Prompt 08.

---

## D-04 — How does site email actually send? · **BLOCKING**

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
