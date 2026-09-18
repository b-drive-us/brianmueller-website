/**
 * One place that decides what environment this build is, and therefore:
 * the public origin, whether search engines may index it, what robots.txt
 * says, and whether a sitemap is produced at all.
 *
 * WHY THIS FILE EXISTS
 * The failure this guards against is shipping a production site that still
 * says "noindex", or a staging site that does not. Both are silent: the pages
 * look correct either way and you find out weeks later from Search Console.
 * So the environment is named explicitly at build time and everything else is
 * derived from that one name.
 *
 * There is deliberately NO DEFAULT. An unset or unknown SITE_ENV throws and
 * the build fails, rather than quietly guessing. Use the npm scripts:
 *
 *   npm run build              -> beta        (brianmueller.org, noindex)
 *   npm run build:production   -> production  (www.brianmueller.com, indexable)
 *   npm run build:preview      -> preview     (localhost, noindex)
 *
 * The canonical host is NEVER read from a request header. It is one of the
 * constants below and nothing else.
 */

export const ENVIRONMENTS = {
  production: {
    name: 'production',
    // D-02: www is the incumbent. brianmueller.com 301s to www today, so every
    // existing inbound link and all ~1,646 legacy URLs already resolve here.
    origin: 'https://www.brianmueller.com',
    indexable: true,
    label: 'production',
  },
  beta: {
    name: 'beta',
    origin: 'https://brianmueller.org',
    indexable: false,
    label: 'public beta — deliberately excluded from search',
  },
  preview: {
    name: 'preview',
    origin: 'http://localhost:4321',
    indexable: false,
    label: 'local preview',
  },
};

const requested = process.env.SITE_ENV;

if (!requested) {
  throw new Error(
    'SITE_ENV is not set. This build has no idea which site it is.\n' +
    '  npm run build             (beta)\n' +
    '  npm run build:production  (www.brianmueller.com)\n' +
    '  npm run build:preview     (localhost)'
  );
}
if (!Object.hasOwn(ENVIRONMENTS, requested)) {
  throw new Error(
    `SITE_ENV="${requested}" is not one of: ${Object.keys(ENVIRONMENTS).join(', ')}`
  );
}

export const site = ENVIRONMENTS[requested];

/** Absolute URL for a site-root-relative path, in this environment. */
export const absolute = (path = '/') => new URL(path, site.origin).href;

/**
 * Pages that exist but should never appear in a sitemap or carry a canonical
 * that invites indexing. 404 is the obvious one; the legal pages are real and
 * indexable, so they are not listed here.
 */
export const NON_INDEXABLE_PATHS = new Set(['/404']);
