/**
 * Runs after `astro build` and `generate-seo.mjs`. Fails the build when the
 * artifact does not match the environment it claims to be.
 *
 * The two mistakes this exists to catch are both silent:
 *   - a PRODUCTION build that still carries staging indexing directives, so
 *     the new site launches invisible to search;
 *   - a BETA build without them, so a work-in-progress gets indexed and has to
 *     be un-indexed afterwards, which is far slower than never being indexed.
 *
 * Neither shows up in a page, a screenshot or a link check. Both show up here.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { site } from '../src/site.config.mjs';

const DIST = 'dist';
const problems = [];
const fail = (m) => problems.push(m);

function htmlFiles(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const f = join(dir, e);
    if (statSync(f).isDirectory()) out.push(...htmlFiles(f));
    else if (e.endsWith('.html')) out.push(f);
  }
  return out;
}

const pages = htmlFiles(DIST);
if (pages.length === 0) fail('dist/ contains no HTML at all.');

const otherOrigins = Object.values(
  await import('../src/site.config.mjs').then(m => m.ENVIRONMENTS)
).map(e => e.origin).filter(o => o !== site.origin);

let noindexCount = 0;
for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];

  if (!canonical) fail(`${file}: no canonical link`);
  else if (!canonical.startsWith(site.origin + '/') && canonical !== site.origin + '/')
    fail(`${file}: canonical "${canonical}" is not on ${site.origin}`);

  const hasNoindex = /<meta name="robots"[^>]*noindex/i.test(html);
  if (hasNoindex) noindexCount++;
  if (site.indexable && hasNoindex && !file.endsWith('404.html'))
    fail(`${file}: production build carries a noindex directive`);
  if (!site.indexable && !hasNoindex)
    fail(`${file}: ${site.name} build is missing its noindex directive`);

  // An absolute URL anywhere in the markup pointing at a DIFFERENT environment
  // of this same site means a hard-coded host survived into the artifact.
  for (const origin of otherOrigins) {
    if (html.includes(origin)) fail(`${file}: contains a hard-coded "${origin}"`);
  }

  for (const prop of ['og:url', 'og:image', 'twitter:image']) {
    const v = html.match(new RegExp(`(?:property|name)="${prop}" content="([^"]+)"`))?.[1];
    if (!v) fail(`${file}: missing ${prop}`);
    else if (!v.startsWith('https://') && !v.startsWith('http://localhost'))
      fail(`${file}: ${prop} is not absolute — "${v}"`);
  }
}

// ---- generated files -------------------------------------------------------
const robots = existsSync(join(DIST, 'robots.txt')) ? readFileSync(join(DIST, 'robots.txt'), 'utf8') : '';
if (!robots) fail('dist/robots.txt is missing');
else if (robots.includes('PLACEHOLDER'))
  fail('dist/robots.txt is still the placeholder — tools/generate-seo.mjs did not run');
else if (site.indexable) {
  if (/^\s*User-agent:\s*\*\s*$[\r\n]+\s*Disallow:\s*\/\s*$/m.test(robots))
    fail('production robots.txt contains a blanket disallow');
  if (!robots.includes(`Sitemap: ${site.origin}/sitemap.xml`))
    fail('production robots.txt does not point at the sitemap');
} else if (!robots.includes('Disallow: /')) {
  fail(`${site.name} robots.txt has no disallow`);
}

const sitemapPath = join(DIST, 'sitemap.xml');
if (!existsSync(sitemapPath)) fail('dist/sitemap.xml is missing');
else {
  const xml = readFileSync(sitemapPath, 'utf8');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  if (locs.length === 0) fail('sitemap.xml has no URLs');
  for (const loc of locs) {
    if (!loc.startsWith(site.origin)) fail(`sitemap: "${loc}" is not on ${site.origin}`);
    if (/[<>"']/.test(loc)) fail(`sitemap: "${loc}" contains an unescaped character`);
  }
  if (locs.some(l => l.endsWith('/404'))) fail('sitemap: contains the 404 page');
  if (new Set(locs).size !== locs.length) fail('sitemap: contains duplicate URLs');
  // Every indexable page should be listed, and nothing else.
  const expected = pages.length - 1; // minus 404
  if (locs.length !== expected)
    fail(`sitemap: ${locs.length} urls but ${expected} indexable pages were built`);
}

const headers = readFileSync(join(DIST, '_headers'), 'utf8');
const headerNoindex = /^[ \t]+X-Robots-Tag:\s*noindex/m.test(headers);
if (site.indexable && headerNoindex) fail('production _headers still sets X-Robots-Tag: noindex');
if (!site.indexable && !headerNoindex) fail(`${site.name} _headers is missing X-Robots-Tag: noindex`);

// ---- report ----------------------------------------------------------------
if (problems.length) {
  console.error(`\ncheck-build: ${problems.length} problem(s) for a "${site.name}" build\n`);
  for (const p of problems) console.error('  ✗ ' + p);
  console.error('');
  process.exit(1);
}
console.log(
  `check: ${site.name} ok · ${pages.length} pages · canonical on ${site.origin} · ` +
  `noindex on ${noindexCount} · _headers X-Robots-Tag ${headerNoindex ? 'set' : 'absent'}`
);
