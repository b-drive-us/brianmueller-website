#!/usr/bin/env python3
"""
Compare two built copies of this site and report where the RENDERED TEXT differs.

Why this exists: during Prompt 07 an Astro 5 -> 7 upgrade was tried to clear a
set of security advisories. The build succeeded, every page rendered, the 406-
check responsive sweep passed, and the CSS was semantically identical - but
Astro 7 drops a newline before an inline element instead of collapsing it to a
space, so prose written across two lines came out with the words run together:

    "a chapter of<a>Illuman</a>"   ->  reads as "a chapter ofIlluman"

Fourteen of those across eight pages, including the contact page's email
address and the retreat page. Nothing in a normal test suite catches it. This
script does, and it is the acceptance test for any future framework upgrade.

Usage:
    python3 tools/compare-build-text.py OLD_DIST NEW_DIST

Typical run:
    git stash && npm ci && npm run build && cp -r dist /tmp/dist-before
    git stash pop && npm install && npm run build
    python3 tools/compare-build-text.py /tmp/dist-before dist

Exit status is 1 if any regression is found, so it can gate a build.
"""
import os, re, sys

# Elements that sit inside a line of prose. Whitespace next to these is what a
# reader actually sees; whitespace between block elements is not.
INLINE = r"(?:a|em|strong|b|i|span|cite|code|abbr|small|sub|sup|q|mark|time)"
OPEN = re.compile(r"([\w,;:.)’”]+)<(" + INLINE + r")\b", re.I)
CLOSE = re.compile(r"</(" + INLINE + r")>([\w‘“(])", re.I)


def pages(root):
    for dirpath, _, files in os.walk(root):
        for f in sorted(files):
            if f.endswith(".html"):
                yield os.path.relpath(os.path.join(dirpath, f), root)


def main(old_root, new_root):
    problems = []
    old_pages = set(pages(old_root))
    new_pages = set(pages(new_root))

    for missing in sorted(old_pages - new_pages):
        problems.append((missing, "page missing from new build", ""))
    for added in sorted(new_pages - old_pages):
        problems.append((added, "page only in new build", ""))

    for rel in sorted(old_pages & new_pages):
        old = open(os.path.join(old_root, rel), encoding="utf-8").read()
        new = open(os.path.join(new_root, rel), encoding="utf-8").read()

        for m in OPEN.finditer(new):
            # The new build has word<tag>. Did the old build have whitespace there?
            if re.search(re.escape(m.group(1)) + r"\s+<" + m.group(2) + r"\b", old, re.I):
                problems.append((rel, "space lost before <%s>" % m.group(2),
                                 excerpt(new, m.start())))

        for m in CLOSE.finditer(new):
            if re.search(r"</" + m.group(1) + r">\s+" + re.escape(m.group(2)), old, re.I):
                problems.append((rel, "space lost after </%s>" % m.group(1),
                                 excerpt(new, m.start())))

    if not problems:
        print("No rendered-text regressions. %d pages compared." % len(old_pages & new_pages))
        return 0

    print("%d rendered-text regression(s):\n" % len(problems))
    for rel, what, ctx in problems:
        print("  %-42s %s" % (rel, what))
        if ctx:
            print("      %s" % ctx)
    return 1


def excerpt(html, at, span=55):
    s = html[max(0, at - span):at + span].replace("\n", " ")
    return "..." + re.sub(r"\s+", " ", s) + "..."


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(2)
    sys.exit(main(sys.argv[1], sys.argv[2]))
