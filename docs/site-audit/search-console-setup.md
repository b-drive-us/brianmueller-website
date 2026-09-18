# Search Console — the one step that needs your hands

**Status: not set up.** Nothing exists and nothing was half-created; the state is clean.

## What I found

There is **no Search Console property for brianmueller.com**, and there never was one. Neither
`commodifyme@gmail.com` nor `bdrive.co@gmail.com` has a single property of any kind. Prompt 12's
instruction was to use *existing authorized* access to submit the sitemap — there was none to use.

Brian's decision: the property should belong to **`bdrive.co@gmail.com`**.

## Why I stopped

Two routes, both blocked on something I should not push through:

1. **Google's own Cloudflare integration** verifies by asking you to *authorize Google to access your
   Cloudflare DNS account*. That is an OAuth grant giving a third party standing access to the DNS
   of every domain in the account, to prove ownership of one. Far more than the job needs, and not a
   grant to make on someone's behalf. Declined deliberately.
2. **The manual TXT record** is the right route, and I got as far as the token. Adding it needs
   Cloudflare's "Add record" dialog, which would not render through browser automation — the form
   exists in the page but never becomes visible to drive. Not worth forcing.

## The 60-second version, for you

**Step 1 — add the record.** Cloudflare → brianmueller.com → DNS → Records → **Add record**:

| Field | Value |
|---|---|
| Type | `TXT` |
| Name | `@` |
| Content | `google-site-verification=zQqjxeFgsJmUj9y8bRLbt6ll4T9RBXX1ZqSRki2yqEg` |
| TTL | Auto |

That token was issued to **bdrive.co@gmail.com** for a **Domain** property on `brianmueller.com`.
Google tokens do not expire, but if you create the property fresh and Google shows a different
token, use the one on your screen — not this one.

Adding a second TXT record at the apex is safe. It sits alongside the SPF record and does not
affect mail.

**Step 2 — verify.** In Search Console as `bdrive.co@gmail.com`: Add property → **Domain** →
`brianmueller.com` → switch "Instructions for" from *Cloudflare.com* to **"Any DNS provider"** →
Verify. That switch is what avoids the OAuth grant.

**Step 3 — submit the sitemap.** Sitemaps → `sitemap.xml` → Submit. The full URL is
`https://www.brianmueller.com/sitemap.xml` and it currently lists 28 pages.

## Domain property vs URL prefix

Use **Domain**. It covers the apex, `www`, and both protocols in one property, which matters here
because the apex 301s to www and you want both sides of that visible in one place. It is the reason
DNS verification is required at all — a URL-prefix property could be verified with an HTML meta tag
instead, but would only ever cover `https://www.brianmueller.com`.

## None of this is blocking

Google will find and index the site regardless — robots.txt allows it, the sitemap is live and
correct, and every page carries a canonical. A submitted sitemap speeds up discovery and gives you
the coverage and performance reports. The site does not depend on it.

**When it is done:** the AI-training crawlers are disallowed in robots.txt by your earlier decision,
so expect Search Console to report those as "blocked" — that is intended, not a fault.
