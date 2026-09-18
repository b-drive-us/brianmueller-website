# Release plan

**Status: not started.** Written in Prompt 10. This file exists so Prompt 00's record set is
complete and so the two gates below are visible from the outset.

## Two distinct gates

| Gate | Meaning | Authorised by |
|---|---|---|
| **Ready for beta review** | The candidate can be deployed to `brianmueller.org` for Brian to look at | Prompt 11 |
| **Ready for production** | The candidate can replace the live `brianmueller.com` | Prompt 12, explicitly |

Prompt 11 does not authorise production. Nothing in this pack authorises production except Prompt 12.

## Known before Prompt 10

- Deploy mechanism: push to `main` → Cloudflare Workers Builds → `brianmueller-website`.
  **There is no separate deploy command to withhold; the push is the deploy.**
- Rollback: redeploy the previous commit, or roll back the Worker deployment in the Cloudflare
  dashboard. `8ea45e5` is the current known-good beta.
- Secrets: none in the repository. No secret store is in use yet, because nothing needs one. A
  Stripe key or Resend key would be the first — by name only, entered by Brian in the Cloudflare
  dashboard, never in this repository or in conversation.
- Production DNS lives at Namecheap. Brian makes registrar changes himself.

## Cutover items already known

1. Remove `public/_headers`' `X-Robots-Tag` staging guard.
2. Remove the `robots` meta from `src/layouts/Base.astro`.
3. Replace `public/robots.txt`'s staging `Disallow: /`.
4. Point `astro.config.mjs`'s `site` at the production hostname (D-02).
5. Publish a sitemap (N02 — does not exist yet).
6. Activate the legacy redirect map (F02 — does not exist yet).
7. Keep Squarespace paid for 30 days past cutover.

## Cutover additions from Prompt 07

Two Cloudflare settings were changed on **brianmueller.org** on 12 September 2026 and verified from
outside Cloudflare. Neither carries over to brianmueller.com automatically — both must be repeated
on that zone at cutover, in this order:

1. **Always Use HTTPS: On** (SSL/TLS → Edge Certificates). Verify with
   `curl -sSI http://brianmueller.com/` and expect a `301` with a `location:` on https, and again on
   a deep path with a query string. Do this **before** pointing traffic at the hostname.
2. **Managed robots.txt: Off** (AI Crawl Control → Signals), then confirm
   `curl -sS https://brianmueller.com/robots.txt` returns exactly the file in this repository and
   nothing prepended.
3. ~~Remove the `X-Robots-Tag` line from `public/_headers`.~~ **No longer a manual step.** Since
   Prompt 08 the indexing directives are derived from `SITE_ENV`. Cutover is changing the Cloudflare
   build command from `npm run build` to **`npm run build:production`** — that one word switches the
   canonical host, the robots meta, robots.txt, the sitemap origin and the `X-Robots-Tag` header
   together, and `tools/check-build.mjs` fails the build if any of them disagree.
   Confirm afterwards with `curl -sSI https://www.brianmueller.com/ | grep -i x-robots` returning
   nothing.
4. **Confirm the CSP survives the edge.** It has only ever been tested against a local server
   applying the same `_headers` file. After the first production deploy, check
   `curl -sSI https://brianmueller.com/ | grep -i content-security-policy`, then load the site in a
   real browser and confirm the theme toggle works and the console is clean. A stale script hash
   fails silently — the page looks right and the toggle is simply dead.
5. **Then, and only then**, begin the HSTS ramp in D-12: `max-age=300` first, watch for a few days,
   raise to a year, and treat `includeSubDomains` and `preload` as separate decisions.

**Do not trust the Cloudflare dashboard's own confirmation for any of these.** During Prompt 07 it
reported a setting change that had not saved. Every one of these steps has a `curl` check next to it
for that reason.

## Production checks that can only run after cutover

Everything about the production configuration has been verified on a locally built production
artifact. These five need the real hostname and are not yet done:

1. `curl -sS https://www.brianmueller.com/robots.txt` — must be exactly the generated file. Watch for
   a platform prepending its own block, which is what Cloudflare was doing on the .org zone until
   12 September.
2. `curl -sSI https://www.brianmueller.com/` and a 404 path and an asset — `X-Robots-Tag` must be
   **absent** from all three.
3. `curl -sS https://www.brianmueller.com/sitemap.xml` — fetchable, and every URL in it returns 200
   rather than a redirect. A sitemap full of redirects is a Search Console warning on day one.
4. For a sample of pages, the `<link rel="canonical">` must match the URL that actually served the
   page — no `.html`, no trailing slash, right host.
5. Submit the sitemap in Search Console and watch for "Page with redirect" or "Alternate page with
   proper canonical tag". Either means one of the above is wrong.

Also at cutover, on the **brianmueller.com** zone specifically:

- **Always Use HTTPS: On** (it is on for .org; it does not carry over).
- **Managed robots.txt: Off** (same — the .org setting is not the .com setting).

And do not trust the Cloudflare dashboard's own confirmation for either: during Prompt 07 it
reported a change that had not saved. Every step above has a `curl` next to it for that reason.
