/**
 * Runs after `astro build`. Writes the three files whose contents depend on
 * which site this build is, rather than leaving them as hand-edited constants
 * somebody has to remember to change at cutover:
 *
 *   dist/robots.txt   - crawl directives, and the staging blanket disallow
 *   dist/sitemap.xml  - the canonical URL of every indexable page
 *   dist/_headers     - the X-Robots-Tag staging guard, injected or not
 *
 * The sitemap is built from the pages Astro ACTUALLY emitted, read back out of
 * dist/, not from a second list of routes kept in parallel. A parallel list is
 * a list that drifts.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { site, NON_INDEXABLE_PATHS } from '../src/site.config.mjs';

const DIST = 'dist';

function htmlFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...htmlFiles(full));
    else if (entry.endsWith('.html')) out.push(full);
  }
  return out;
}

const pages = [];
for (const file of htmlFiles(DIST)) {
  const html = readFileSync(file, 'utf8');
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (!canonical) {
    throw new Error(`${file} has no canonical link. Every page must have one.`);
  }
  const path = new URL(canonical).pathname.replace(/\/$/, '') || '/';
  if (NON_INDEXABLE_PATHS.has(path)) continue;

  // lastmod only where a real content date exists. Blog posts carry one in a
  // <time datetime>; nothing else on this site has a trustworthy update date,
  // and inventing one is worse than omitting the field.
  const lastmod = relative(DIST, file).split(sep)[0] === 'blog'
    ? html.match(/<time[^>]+datetime="(\d{4}-\d{2}-\d{2})/)?.[1]
    : undefined;

  pages.push({ canonical, lastmod });
}
pages.sort((a, b) => a.canonical.localeCompare(b.canonical));

const xmlEscape = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
   .replace(/"/g, '&quot;').replace(/'/g, '&apos;');

writeFileSync(join(DIST, 'sitemap.xml'),
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  pages.map(p =>
    '  <url>\n' +
    `    <loc>${xmlEscape(p.canonical)}</loc>\n` +
    (p.lastmod ? `    <lastmod>${p.lastmod}</lastmod>\n` : '') +
    '  </url>\n').join('') +
  '</urlset>\n');

// ---- robots.txt ------------------------------------------------------------
// Note for whoever reads this later: robots.txt is NOT access control. It is a
// request that well-behaved crawlers honour. It keeps nothing private and stops
// nobody who does not want to be stopped. See docs/site-audit/decisions.md D-15.
const robots = site.indexable
  ? `# ${site.origin}
#
# Brian's own position, not a hosting default. The poems and books on this site
# are his copyrighted work, published under CC BY-NC-ND.
#
# Search engines are welcome: people looking for these books should be able to
# find them. Crawlers that collect text to train generative models are not.
#
# This file is a request, not a lock. It cannot enforce anything.

User-agent: *
Allow: /

# Generative-model training crawlers.
User-agent: Amazonbot
User-agent: Applebot-Extended
User-agent: Bytespider
User-agent: CCBot
User-agent: ClaudeBot
User-agent: Google-Extended
User-agent: GPTBot
User-agent: meta-externalagent
Disallow: /

Sitemap: ${site.origin}/sitemap.xml
`
  : `# ${site.origin} - ${site.label}
#
# This is not the public site. Nothing here should be indexed.
#
# This file alone is not what keeps it out of search results: a Disallow tells a
# crawler not to FETCH the page, which also means it never sees a noindex on it,
# and a URL that is only disallowed can still be listed from external links. The
# X-Robots-Tag header in _headers is the directive that actually applies, and it
# is set on every response including 404s.

User-agent: *
Disallow: /
`;
writeFileSync(join(DIST, 'robots.txt'), robots);

// ---- _headers --------------------------------------------------------------
const headersPath = join(DIST, '_headers');
let headers = readFileSync(headersPath, 'utf8');
// A directive line, not the word in a comment: header lines are indented,
// comment lines start with '#'.
const DIRECTIVE = /^[ \t]+X-Robots-Tag:/m;
if (DIRECTIVE.test(headers)) {
  throw new Error('public/_headers must not set X-Robots-Tag; this script adds it.');
}
if (!site.indexable) {
  headers = headers.replace(
    /^(\/\*\n)/m,
    `$1  X-Robots-Tag: noindex, nofollow\n`
  );
  if (!DIRECTIVE.test(headers)) {
    throw new Error('Could not inject X-Robots-Tag: no "/*" block found in _headers.');
  }
}
writeFileSync(headersPath, headers);

const withLastmod = pages.filter(p => p.lastmod).length;
console.log(
  `seo: ${site.name} · ${site.origin}\n` +
  `     sitemap.xml  ${pages.length} urls (${withLastmod} with lastmod)\n` +
  `     robots.txt   ${site.indexable ? 'allow, with AI-training crawlers disallowed' : 'blanket disallow'}\n` +
  `     _headers     X-Robots-Tag ${site.indexable ? 'absent' : 'injected'}`
);
