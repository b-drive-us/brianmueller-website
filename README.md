# brianmueller-website

**brianmueller.com** — Astro, built to static HTML, served by Cloudflare Workers.

| | |
|---|---|
| **Production** | https://www.brianmueller.com — Worker `brianmueller-website`, live since 18 September 2026. The apex `brianmueller.com` 301s to `www`. |
| **Staging** | https://brianmueller-website-beta.brian-b89.workers.dev — Worker `brianmueller-website-beta`, `noindex` on every response. |
| **Deploys** | Push to `main` → Cloudflare Workers Builds runs `npm run build:production` and `npx wrangler deploy`. Push to any other branch uploads a preview version and leaves production alone. |
| **Rollback** | Promote the previous version in the Worker's Version History. |
| **Version** | **1.4.1** — stamped into every page and readable from outside: `curl -s https://www.brianmueller.com/ \| grep 'name="version"'`. See `CHANGELOG.md`. |
| **Security** | CSP at `default-src 'none'`, five script hashes, no `unsafe-inline`. HSTS on at the edge: `max-age=15552000`, no `includeSubDomains`, no preload. |

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
match the environment it claims to be, or if any page's version stamp disagrees
with `package.json`.

The version lives in `package.json` and nowhere else. `astro.config.mjs` reads it
there and hands it to the build as a constant, which `Base.astro` emits as
`<meta name="version">`. It is deliberately not read inside `src/site.config.mjs`:
that module is imported by `Base.astro` and therefore ends up inside the page
bundle, where `import.meta.url` points into `dist/` and `package.json` is not
there.

> `npm run build` with no suffix **fails on purpose**. It used to mean beta, which
> is how a staging artifact could have reached production; `M16` closed that by
> removing the default rather than changing it. Name the environment.

## Two guards you will meet

**The CSP hashes.** `script-src` is five SHA-256 hashes and one host, with no
`unsafe-inline`. Change one byte of any inline script and the browser silently
refuses to run it — the build still succeeds and the page still looks right. So
`check-build.mjs` recomputes every hash from `dist/` and fails both on a hash
that is missing and on one that is allowed but no longer used. Regenerate with:

```
npm run build:production && python3 tools/csp-hashes.py
```

**The redirects.** `public/_redirects` is **generated** from
`docs/site-audit/redirect-map.csv` by `tools/generate-redirects.mjs`. Edit the
CSV — which carries the evidence and the approval for every row — never the
output. `--check` runs on every build and fails if the two have drifted.

## Two things in astro.config.mjs that must not be removed

Both are load-bearing, both have failed in this repository, and both carry a
comment saying so:

- **`compressHTML: false`** — Astro 7's compressor eats the whitespace between a
  text node and an adjacent inline element. Twelve places across seven pages.
- **`vite.build.cssTarget`** — without it Lightning CSS emits
  `@media (width <= 640px)`, which Safari below 16.4 ignores *entirely*, taking
  the whole mobile layout with it.

## Where things are

- `src/` — pages, layout, components, styles, and `site.config.mjs`
- `src/components/MailLink.astro` — why no email address appears in the built HTML
- `public/` — fonts, covers, images, `_headers` (CSP and security headers), `_redirects`
- `tools/` — build guards, SEO generation, font subsetting, CSP hashes, text-diff harness
- `docs/site-audit/` — the full audit record: findings, decisions, verification, cutover

`CLAUDE.md` in this directory carries the working rules for anyone — human or
otherwise — picking this up cold.

Project documentation, the Squarespace audit and the retreat registration material
live in the parent folder. Start with `../PROJECT.md`, then
`../RUNBOOK - Next Session.md`.
