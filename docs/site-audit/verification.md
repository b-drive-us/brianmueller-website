# Verification log

Every entry records the environment it was run in. Local, private preview, live beta and production
are tracked separately and never conflated.

## Prompt 00 — 2026-09-12

| Check | Environment | Tool | Result |
|---|---|---|---|
| Repository identified | device working copy | `git` | `github.com/b-drive-us/brianmueller-website`, branch `main`, clean, synced |
| Checked-out commit | device | `git log` | `8ea45e5` (2026-08-30) |
| Baseline build | device, Node 22.23.2, Astro 5.18.2 | `npm run build` | exit 0, 29 HTML files, no warnings |
| Build ≡ deployed | device build vs live beta | stylesheet content hash | **identical** — `about.4CFqJ8S2.css` both sides |
| Worker last modified | Cloudflare API | `workers_list` | `2026-08-30T19:10:16Z` — unchanged since the last session |
| Baseline tests | device | — | **none exist**: no runner, lint, typecheck or CI |
| F03.1 robots meta | live beta | `curl` | `noindex, nofollow` present — intentional staging guard |
| F03.2 X-Robots-Tag | live beta | `curl -I` | `x-robots-tag: noindex, nofollow` |
| F03.3 robots.txt | live beta | `curl` | Cloudflare managed `Allow: /` block + staging `Disallow: /` — as reported |
| F03.4 sitemap | live beta | `curl` | `/sitemap.xml`, `/sitemap_index.xml`, `/sitemap-index.xml` all 404 |
| F11.1 HTTP→HTTPS | live beta | `curl http://…` | **HTTP/1.1 200 OK, no Location** — reproduced |
| F11.2 www beta | live beta | `curl` | `www.brianmueller.org` does not resolve — reproduced |
| Production host | live .com | `curl` | `brianmueller.com` → 301 → `www.brianmueller.com` (200); sitemap 200 |
| F06.1/F06.2 | source | `grep` | `retreat.astro:87` contains both invented figures — reproduced |
| F07.1 | source | `grep` | `1,832` in `index.astro:71` and `poems.astro:22` — reproduced |
| F09.6 | source | `books.json` | Trust Stillness has no `pages` field — reproduced |
| F12.1 | build output | description length census | **12 descriptions are exactly 150 characters** — reproduced at source |
| F12.2 | build output | title census | three pages share "Men Writing for Change — Brian J. Mueller" — reproduced |
| F13.1 | source | `grep` | "allowing the waves carry you" in Trust Stillness blurb — reproduced |
| F13.2 | source | `books.json` | Tomorrow Could Be Wonderful blurb opens with a fragment — reproduced |
| `docs/` excluded from output | device build | `find dist` | verified: no `docs/` path in `dist/` |

## Not tested in Prompt 00

Mobile viewports, real devices, screen readers, email delivery, registration, payments, performance
(lab or field), penetration testing, and the legacy URL inventory. None of these may be described
as passing.

## Environment notes

- Browser automation is available through the Claude in Chrome extension against Brian's own
  browser; the standalone automated pane is blocked by Cloudflare bot detection on Cloudflare
  properties and must not be used for those.
- A headless Chromium with Playwright is available in the cloud container for viewport work, but it
  cannot reach `fonts.googleapis.com` or `brianmueller.org` through the egress proxy. Local
  rendering must be served from a locally built `dist/`.
