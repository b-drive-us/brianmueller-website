# The contact form — plan

_Written 2026-09-19. Blocked only on item 24: Brian's DNS records and API key._

The provider decision and its reasoning are D-36. This is how it gets built.

## Why it matters more than it looks

1.4.0 took Brian's address out of the markup, which defeats crawlers that regex
the HTML — the kind that actually fills an inbox. It does not defeat a scraper
driving a headless browser, and no client-side scheme can. **The form is what
removes the need for the address to be on the page at all.**

The same sending path is what unblocks Stripe, so this is the gate on the
retreat registration too.

---

## What Brian does (once)

1. **Verify `brianmueller.com` in Resend.** It will give three or four DNS
   records — SPF (TXT), DKIM (TXT or CNAME), and a return-path CNAME. Add them
   to the zone at Cloudflare. Note the zone currently has **no mail records at
   all**; check that before assuming, and if anything already exists on those
   names, stop and ask rather than overwriting it.
2. **Create an API key scoped to sending only.** Not a full-access key.
3. Put it in the Worker: `npx wrangler secret put RESEND_API_KEY`. **Brian runs
   this. Claude never sees the key, and it never goes in a file, a commit, or a
   `.dev.vars` that could be committed.**

---

## What Claude builds

### The endpoint

A `POST /api/contact` route on the existing Worker. The site is otherwise pure
static assets, so this is the first server-side code in it — keep it small
enough to read in one sitting.

It should:

- Accept `application/x-www-form-urlencoded`, so the form works with no
  JavaScript. **This is the point of doing it properly:** a plain HTML form that
  posts and reloads is a better fallback than an address behind a script.
- Validate: name and message present, message within a sane length, email
  syntactically plausible. Reject rather than sanitise.
- Send via Resend with `from` an address on the authenticated domain (something
  like `forms@brianmueller.com`, never a spoofed sender), `to` Brian, and
  **`reply_to` the visitor** — so hitting reply in his mail client just works.
- Return a redirect to a thank-you state on success and re-render the form with
  the message intact on failure. **Never lose what someone typed.**

### Spam

In order of preference, and the first two are probably enough:

1. **A honeypot field**, hidden from people and from screen readers, rejected if
   filled.
2. **A timestamp check** — a submission under a couple of seconds old is a bot.
3. **Cloudflare Turnstile** only if the first two prove insufficient. It is a
   bot check, which means it must never be presented in a way Claude would be
   the one to solve.

Rate limit by IP at the edge.

### The CSP

`form-action 'none'` has to change. **Open it for exactly the one endpoint** —
`form-action 'self'` would be lazier and broader than necessary. If the
submission ends up using `fetch` for the enhanced path, `connect-src` already
allows `'self'`.

If any new inline script is added for progressive enhancement, it is a **sixth
CSP hash** and `check-build.mjs` will fail the build until `public/_headers`
carries it. That is correct behaviour; regenerate with
`python3 tools/csp-hashes.py`.

### The page

`/contact` loses the assembled `mailto:` card and gains the form. Keep the
"What people usually write about" list — it does real work in setting
expectations.

`MailLink` stays in the repository for the retreat page's Tom Sparough line and
the two legal pages, unless those become form links too. **Do not leave it in
use on `/contact` "just in case".**

---

## Tests before it is called done

- A submission with JavaScript disabled arrives in Brian's inbox.
- Reply-to actually addresses the visitor.
- A submission with the honeypot filled is rejected and does **not** send.
- The failure path preserves the typed message.
- The live response headers still carry the CSP, and the browser console is
  clean on `/contact` under the real header.
- `grep` for an address-shaped string in `dist/` still returns nothing.
- Every page still 200s and the version stamp is the new one.

## Then

Retreat registration on Stripe, which uses the same sender for confirmations —
this time to an **external** recipient, which is the whole reason D-36 went the
way it did.
