# Decisions

Decisions Brian has already made in this project are recorded in `content-sources.md` and in
`../../PROJECT.md`. This file holds only what is **still open**, plus a recommendation for each so
that silence does not stall the work.

Blocking = cannot reach production without an answer.

---

## D-01 — Is retreat registration open at launch, or is it an interest list? · **BLOCKING**

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

## D-06 — What licence covers each collection, and who may grant it? · **BLOCKING**

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
