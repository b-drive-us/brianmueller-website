#!/usr/bin/env python3
"""
Shrink the self-hosted variable fonts to the design range the stylesheet
actually declares.

Why: the faces downloaded from Google carry their full axis ranges. Archivo
ships wght 100-900 and Newsreader ships wght 200-800 PLUS an optical-size
axis 6-72. base.css only ever asks for weights 400-600, so every delta
outside that band is bytes nobody renders.

Optical size is kept on the upright faces - headings run to ~87px there and
the display cut is visibly finer. It is pinned on the italic faces, which
base.css only uses between 18px and 27px (.lede, .poem-sub, .book-card .s,
.pull, .occasion, .ll-sub), where one optical instance is indistinguishable
from the interpolated one.

The output files carry a -vN suffix. public/_headers caches /fonts/* for a
year as immutable, so a regenerated face MUST get a new filename - never
overwrite one in place, or a returning visitor keeps the old file forever.
Bump the suffix here and in src/styles/fonts.css and src/layouts/Base.astro
together.

Run from the site root:  python3 tools/subset-fonts.py
Requires: fonttools, brotli.
"""
import os, glob
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

SRC = "tools/fonts-original"   # pristine faces as downloaded, committed alongside
DEST = "public/fonts"
WGHT = (400, 600)          # the range base.css declares in every @font-face
ITALIC_OPSZ = 22           # midpoint of the 18-27px band italic is used at
SUFFIX = "-v2"             # bump whenever the subsetting parameters change

total_before = total_after = 0

for src in sorted(glob.glob(f"{SRC}/*.woff2")):
    name = os.path.basename(src)
    before = os.path.getsize(src)

    font = TTFont(src)
    axes = {a.axisTag for a in font["fvar"].axes}
    limits = {}
    if "wght" in axes:
        limits["wght"] = WGHT
    if "opsz" in axes and "italic" in name:
        limits["opsz"] = ITALIC_OPSZ

    instancer.instantiateVariableFont(font, limits, inplace=True, updateFontNames=False)
    font.flavor = "woff2"
    out = os.path.join(DEST, name.replace(".woff2", SUFFIX + ".woff2"))
    font.save(out)

    after = os.path.getsize(out)
    total_before += before
    total_after += after
    print(f"{name:38s} {before:7,d} -> {after:7,d}  ({100*after/before:.0f}%)")

print(f"{'TOTAL':38s} {total_before:7,d} -> {total_after:7,d}  "
      f"({100*total_after/total_before:.0f}%)")
