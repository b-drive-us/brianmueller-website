# tools/

Small scripts that support the build. None of them run in the browser.

| File | What it does |
|---|---|
| `subset-fonts.py` | Shrinks the variable fonts to the weight range `base.css` actually asks for. Run after changing a font; output carries a `-vN` suffix because `/fonts/*` is cached for a year as immutable. |
| `csp-hashes.py` | Prints the SHA-256 hashes of the inline theme scripts, in the form the `Content-Security-Policy` in `public/_headers` needs. Run after touching either script — a stale hash fails silently. |
| `compare-build-text.py` | Compares the rendered text of two builds and reports where whitespace next to an inline element was lost. Written after an Astro 7 upgrade silently ran words together on eight pages. The acceptance test for any framework upgrade. |
| `check-build.mjs` | Runs after every `astro build`. Fails the build if the artifact does not match the environment it claims to be — a production build carrying `noindex`, a beta build without it, canonicals pointing at the wrong host, and so on. |
