/**
 * `npm run build` used to mean `build:beta` - the one artifact you least want
 * on production, because every page in it carries a noindex. check-build.mjs
 * validates that an artifact is internally consistent; it cannot know which
 * Worker the artifact is about to land on. So the default is made to fail
 * instead of guessing (M16).
 */
console.error(`
  "npm run build" does not say which site it is building, and the answer used
  to be "beta" - an artifact with noindex on every page. Name the environment:

      npm run build:production     www.brianmueller.com, indexable
      npm run build:beta           the staging Worker, noindex
      npm run build:preview        localhost
`);
process.exit(1);
