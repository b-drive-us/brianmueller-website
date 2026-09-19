# Changelog

Versions are [semantic](https://semver.org/) and describe **the website**, not the
repository's tooling. For a site with no public API that means, in practice:

- **major** — the site changes in a way a visitor or an inbound link would notice:
  URLs move, a section appears or disappears, the design is reworked.
- **minor** — new pages or features, or a round of fixes and improvements shipped
  together. Nothing a returning visitor would be surprised by.
- **patch** — a correction to a single thing, shipped on its own.

The running version is stamped into every page as `<meta name="version">` and
enforced by `tools/check-build.mjs`, so what is live can be read from the site
itself rather than inferred from a deployment log:

```
curl -s https://www.brianmueller.com/ | grep 'name="version"'
```

---

## 1.0.0 — 19 September 2026

**The first numbered release of the rebuilt brianmueller.com.**

The site itself went live on **18 September 2026** at commit `4e9f687`, when
`www.brianmueller.com` was cut over from Squarespace to Cloudflare Workers. It ran
for a day without a version number at all: `package.json` still carried npm's
`0.1.0` scaffold default and the repository had no tags. `1.0.0` names what was
already there, and adds the machinery to keep naming it.

### What 1.0.0 is

A static Astro site, built to HTML, served from Cloudflare Workers. 28 published
pages plus a real 404.

- **Twelve books**, each with its own page — cover, blurb, reader quote, buy link,
  and its place in a series. Three series pages gather them.
- **Eleven poems**, one from each collection, with brianspoems.com named as the
  definitive archive.
- **The retreat** — Rooted in the Land, January 15–17 2027, as a full page with an
  email interest list. Payments are not part of this release.
- **About, Contact, FAQ, Notes**, and four legal pages written against what the
  site actually does rather than against a template.
- Light and dark themes with a labelled toggle that remembers the choice.
- Self-hosted subset fonts; no third-party request leaves the page except the
  disclosed Cloudflare analytics beacon.

### Carried over from the old site

- **1,653 legacy URLs** classified, with 734 redirect rules — every one tested. 690
  poem posts were matched to brianspoems.com by comparing their text, not their
  slugs, which changed 20 of the answers.
- **24 legacy homepage fragments** (`/#jonah`, `/#mwfc-1`) resolved in the browser,
  because a fragment never reaches the server.
- **916 blog posts** archived in full rather than migrated.

### Security and delivery

- Content-Security-Policy at `default-src 'none'`, `script-src` limited to three
  SHA-256 hashes with no `unsafe-inline` anywhere. Tested enforced, not report-only.
- `X-Content-Type-Options`, `Referrer-Policy`, `Cross-Origin-Opener-Policy`, a
  permissions policy denying seventeen unused features, and `frame-ancestors`,
  `form-action` and `base-uri` all `'none'`.
- HTTP redirects to HTTPS; the apex redirects to `www`.
- The build environment is named, never guessed: `SITE_ENV` resolves to
  `production`, `beta` or `preview` and has no default. `tools/check-build.mjs`
  fails the build on any artifact that does not match the environment it claims.

### Added in this release

- **The version stamp.** `<meta name="version">` on every page, read from
  `package.json` at build time by `astro.config.mjs`. `check-build.mjs` fails the
  build if any page is missing it or disagrees with it.
- **CHANGELOG.md** — this file.

### Known, and deliberately not fixed here

The [18 September audit](docs/site-audit/audit-2026-09-18.md) found 18 items. They
are the content of 1.1.0, not of this release, which names the site as it shipped.
The one a visitor notices: the "Search the whole collection" button on `/poems`
renders brown-on-brown at 1.37:1 (`M01`).

---

## Before 1.0.0

Development ran from 28 August to 18 September 2026 and is recorded commit by
commit, and in `docs/site-audit/` — `findings.md`, `decisions.md`,
`verification.md`, and `cutover-2026-09-18.md` for the launch itself.
