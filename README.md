# brianmueller-website

**brianmueller.com** — Astro, built to static HTML, served by Cloudflare Workers.

| | |
|---|---|
| **Production** | https://www.brianmueller.com — Worker `brianmueller-website`, live since 18 September 2026. The apex `brianmueller.com` 301s to `www`. |
| **Staging** | https://brianmueller-website-beta.brian-b89.workers.dev — Worker `brianmueller-website-beta`, `noindex` on every response. |
| **Deploys** | Push to `main` → Cloudflare Workers Builds runs `npm run build:production` and `npx wrangler deploy`. Push to any other branch uploads a preview version and leaves production alone. |
| **Rollback** | Promote the previous version in the Worker's Version History. |

## Building

`SITE_ENV` decides which site is being built — the canonical origin, the robots
meta, robots.txt, the sitemap and `X-Robots-Tag` all derive from it. There is no
default: an unset or unknown value throws and the build fails.

```
npm run build:production   # www.brianmueller.com, indexable
npm run build:beta         # the staging Worker, noindex
npm run build:preview      # localhost
```

`tools/check-build.mjs` runs after every build and fails it if the artifact does not
match the environment it claims to be.

> `npm run build` with no suffix currently means **beta**. See finding `M16` in
> `docs/site-audit/audit-2026-09-18.md`.

## Where things are

- `src/` — pages, layout, components, styles, and `site.config.mjs`
- `public/` — fonts, covers, images, `_headers` (CSP and security headers), `_redirects`
- `tools/` — build guards, SEO generation, font subsetting, CSP hashes, text-diff harness
- `docs/site-audit/` — the full audit record: findings, decisions, verification, cutover

Project documentation, the Squarespace audit and the retreat registration material
live in the parent folder. Start with `../PROJECT.md`.
