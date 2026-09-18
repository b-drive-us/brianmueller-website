#!/usr/bin/env python3
"""
Print the SHA-256 hashes of every inline <script> in the built site, in the
form the Content-Security-Policy in public/_headers needs.

Run after ANY change to the theme scripts in src/layouts/Base.astro:

    npm run build && python3 tools/csp-hashes.py

then paste the script-src line into public/_headers. A stale hash does not
break the build and does not show up in a page diff - the browser just
silently refuses to run the script, and the only symptom is the theme toggle
going dead and a violation in the console. Check it, do not assume it.

Only EXECUTABLE scripts are hashed. A <script type="application/ld+json">
block is data, not code: the browser never executes it, so CSP's script-src
does not apply and it needs no hash. Verified under an enforced policy - 58
page loads with JSON-LD present, zero violations. Hashing them would also be
a trap, because the hash would change every time a book's page count did.
"""
import base64, glob, hashlib, re, sys, os

if not os.path.isdir("dist"):
    sys.exit("No dist/ - run `npm run build` first.")

found = {}
for path in sorted(glob.glob("dist/**/*.html", recursive=True)):
    html = open(path, encoding="utf-8").read()
    for m in re.finditer(r"<script(?![^>]*\bsrc=)([^>]*)>(.*?)</script>", html, re.S):
        attrs = m.group(1)
        # Skip data blocks: any type= that is not a JavaScript MIME type.
        type_match = re.search(r'type\s*=\s*["\']([^"\']+)', attrs)
        if type_match and type_match.group(1).strip().lower() not in (
            "text/javascript", "application/javascript", "module"
        ):
            continue
        digest = hashlib.sha256(m.group(2).encode("utf-8")).digest()
        h = "sha256-" + base64.b64encode(digest).decode()
        entry = found.setdefault(h, {"pages": 0, "preview": ""})
        entry["pages"] += 1
        if not entry["preview"]:
            entry["preview"] = " ".join(m.group(2).split())[:66]

print(f"{len(found)} distinct inline script(s):\n")
for h, e in found.items():
    print(f"  {h}")
    print(f"      {e['pages']} pages | {e['preview']}...")

print("\nscript-src line for public/_headers:\n")
print("  script-src " + " ".join(f"'{h}'" for h in found) + ";")
