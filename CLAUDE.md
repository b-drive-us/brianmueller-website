# CLAUDE.md — working rules for brianmueller.com

This is Brian Mueller's author site: Astro built to static HTML, served by a
Cloudflare Worker, live at **https://www.brianmueller.com**. Read
`../PROJECT.md` for what the project is and `../RUNBOOK - Next Session.md` for
what is next. This file is the part you must not get wrong.

## The rule that outranks the others

**Do not break the site or introduce new bugs.** Brian's standing instruction,
stated at the start of the maintenance work and never withdrawn. In practice:
every change is built, the guards are allowed to fail, and anything visible is
verified on the live hostname before it is called done.

## Do not remove these two lines from astro.config.mjs

Both are load-bearing. Both have already broken this site. Both carry a comment
saying so, and the comment is not decoration.

```js
compressHTML: false,
vite: { build: { cssTarget: ['chrome87', 'edge88', 'firefox78', 'safari14'] } },
```

- **`compressHTML: false`** — Astro 7's compressor removes the whitespace
  between a text node and an adjacent inline element, so `the <em>Bull</em>
  Series` renders as `the Bull Series` with the space gone. Twelve places across
  seven pages. The upstream issue is **not** fixed; I asserted it was, and I was
  wrong. `tools/compare-build-text.py` is the gate that catches it, and it only
  catches it because it does **not** normalise whitespace before diffing.
- **`vite.build.cssTarget`** — without it Lightning CSS emits
  `@media (width <= 640px)`. Safari below 16.4 does not merely mis-parse that,
  it ignores the whole rule, taking the mobile layout with it.

## The build

`SITE_ENV` picks the site. There is **no default** — an unset or unknown value
throws, so bare `npm run build` fails on purpose. That is how a staging artifact
could once have reached production (`M16`); the fix was to delete the default,
not to change it.

```
npm run build:production   # www.brianmueller.com, indexable
npm run build:beta         # the staging Worker, noindex on every response
npm run build:preview      # localhost
```

Each one chains `generate-redirects.mjs --check`, `astro build`,
`generate-seo.mjs` and `check-build.mjs`.

The version lives in `package.json` and nowhere else. `astro.config.mjs` reads
it there (Node, unbundled) and hands it to the build via `vite.define`. **Do not
move that read into `src/site.config.mjs`** — that module is imported by
`Base.astro`, so it ends up inside the page bundle where `import.meta.url`
resolves into `dist/` and `package.json` is not there. This has already broken
the build once.

## The CSP hashes

`script-src` is five SHA-256 hashes plus one host, with no `unsafe-inline`.
Change one byte of an inline script and the browser **silently** refuses to run
it: the build succeeds, the page looks right, and the only symptom is a dead
control. So:

```
npm run build:production && python3 tools/csp-hashes.py
```

`check-build.mjs` fails on a hash that is missing **and** on a hash that is
allowed but no longer used by any page. Let it. It has caught every script
change made since it was written.

Related and easy to miss: `style-src 'self'` also refuses an inline `<style>`
inside an SVG document. That is why the favicon once shipped as a black square,
and why it now uses presentation attributes. **A CSP change is not verified
until something has been rendered under the real header.**

## The redirects

`public/_redirects` is **generated**. Edit
`docs/site-audit/redirect-map.csv` — which carries the evidence and the approval
for every single row — and run `node tools/generate-redirects.mjs`. Never edit
the output. `--check` runs on every build and fails if the two have drifted.

Status: 1,653 legacy URLs classified, 799 rules. Of the 226 legacy poem URLs,
**52 reach a poem and 174 reach `/poems`**. That work is closed (D-33, D-34,
D-35) — do not reopen it without a reason.

## Email addresses

Brian's address is **bdrive.co@gmail.com** as of 19 September 2026. It was
`brian@b-drive.us` before that, and the old one is gone from `src/` — including
the component's own doc comment, which kept it alive after every call site had
moved on. Do not write either address into a source comment.

**No email address appears in the built HTML, and it must stay that way.**
`src/components/MailLink.astro` emits the two halves ROT13'd into data
attributes; one script in `Base.astro` joins them on load. Read the component's
header comment before touching it — especially the part about what this does
*not* protect against.

The check, which is worth running after any content change:

```
grep -rnoiE "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}" dist/   # expect nothing
```

The contact form is the real fix and is the next piece of work. When it lands,
the CSP's `form-action 'none'` has to open for exactly one endpoint — one, not
`'self'`.

## Verification habits, each learned the hard way

- **Verify Cloudflare settings from outside Cloudflare.** The dashboard has
  reported a change as saved when it had not been. `curl -sSI` is the check.
- **Prove a request reached production.** The sandbox's outbound DNS has twice
  served stale Squarespace responses and produced two false alarms. A genuine
  response carries `cf-ray`; a stale one says `server: Squarespace` and has none.
- **Measure contrast under the glyphs.** Mask the text with
  `setProperty('color', 'transparent', 'important')` — a plain inline style
  loses to an injected `!important` rule — then diff screenshots and read the
  background beneath. Reading the worst pixel in a bounding box produced four
  false failures in the September audit.
- **`.focus()` does not trigger `:focus-visible`.** A keyboard test built on it
  will wrongly report a focusable control as unfocusable.
- **Rebuild before comparing.** A stale `dist/` from a *preview* build once
  reported all 28 pages as differing from production.

## Deploying

Push to `main` → Cloudflare Workers Builds runs `npm run build:production` and
`npx wrangler deploy`, and **that changes what the public sees.** Push to any
other branch → `npx wrangler versions upload`, production untouched.

Deployment takes a minute or two. Confirm it by reading the version stamp back
off the live site, not from the build log:

```
curl -s "https://www.brianmueller.com/?cb=$RANDOM" | grep 'name="version"'
```

Rollback is promoting the previous version in the Worker's Version History.

## Secrets, credentials and permissions

- Claude never types or reads a password, 2FA code, API key or passkey. Brian
  holds every secret and authenticates himself.
- Claude does not complete or bypass CAPTCHAs or bot detection.
- Cloudflare's dashboard is driven through Brian's **Brave** browser via the
  Claude in Chrome extension. The standalone automated browser pane is blocked
  by Cloudflare's own bot detection.
- Ask first: DNS changes, spending money, deleting resources, plan or account
  settings, and anything that publishes.

## Where the reasoning is written down

`docs/site-audit/decisions.md` is the spine — every decision Brian made, dated,
in his words where possible, with what it feeds. Cite `D-nn` rather than
re-litigating. `findings.md`, `verification.md` and `audit-2026-09-18.md` hold
the evidence; `CHANGELOG.md` holds what shipped and why.

When you make a decision with Brian, **write it into `decisions.md` in the same
session.** That file is the reason this project can be picked up cold.

## Which GitHub account, and the SSH key that is not a GitHub key

The remote is `https://github.com/b-drive-us/brianmueller-website.git`, on
Brian's **brian@b-drive.us** account. `gh` is authenticated for it over HTTPS
and `git push` works.

`alphatax200` and `ChoosingPresence` are also authenticated in `gh` on this
machine. **They are separate accounts and separate projects of Brian's.** This
repository belongs to neither.

**If work ever moves to the alphatax200 project, stop and ask Brian to switch
accounts before touching git.** His instruction, 19 September 2026. Do not run
`gh auth switch` on his behalf and then carry on as if nothing happened — the
wrong active account is how a commit ends up pushed to the wrong repository.

Before pushing:

```
gh api repos/b-drive-us/brianmueller-website --jq .permissions.push   # expect true
```

The only SSH key on the Mac, `~/.ssh/id_choosingpresence`, is a **SiteGround
deploy key for choosingpresence.com** — port 18765, comment
`choosingpresence-deploy`. It is not a GitHub key, `~/.ssh/config` has no
`github.com` block, and loading it will not authenticate you. I suggested it
once and was wrong.

If `node_modules` will not build, it is probably holding **linux**-arm64
bindings from an earlier containerised session. `npm ci` fixes it and leaves
`package-lock.json` byte-identical.
