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
