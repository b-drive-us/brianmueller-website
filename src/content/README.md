# Writing new blog posts

Posts live in `src/content/blog/` as markdown files. The file name becomes the URL:
`trust-stillness.md` → `/blog/trust-stillness`.

## Front matter

```yaml
---
title: "Trust Stillness is here"
date: 2026-05-23
summary: "One sentence. Shown on the blog index and used as the page description."
book: trust-stillness      # optional — adds the cover, subtitle and affiliate buy link at the foot
draft: false               # optional — true keeps it out of the build entirely
---
```

`book` must match a `slug` in `src/data/books.json`. When set, the post ends with the book's
cover, its title and subtitle, and a **Buy on Amazon** button using that book's affiliate link.
Never hand-write an Amazon URL in a post — set `book` and let the data file supply the link, so
there is one place to fix if a link ever changes.

## Poems inside a post

A poem needs one `<span class="pl">` per line so the hanging indent works:

```html
<div class="poem poem-left">
<span class="pl">When getting a physical,</span>
<span class="pl">the doctor may test</span>
<span class="pl br"></span>
<span class="pl">a new stanza begins here</span>
</div>

<p class="poem-source">Poem Title · from <em>Book Title</em></p>
```

`<span class="pl br"></span>` is a blank line between stanzas.

**Why the markup is per-line and not just a `<pre>`-style block:** the poems use a hanging
indent, so a line too long for the column wraps and its continuation is indented rather than
starting flush and being mistaken for a new line of verse. CSS `text-indent` only applies to the
first line of a block, so each line has to be its own block. This was got wrong once already —
see the commit "Fix the poem hanging indent — it was inverted".

In `.astro` pages, use the component instead and it does this for you:

```astro
import Poem from '../components/Poem.astro';
<Poem text={someMultiLineString} class="poem-left" />
```

## When Sveltia CMS is wired up

These files are what it will edit. Keep the front-matter field names stable — the CMS config
will name them.
