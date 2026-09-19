import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import { site } from './src/site.config.mjs';

// The version, read once here. This file runs in Node and is never bundled, so
// it can touch the filesystem; src/site.config.mjs cannot, because it is
// imported by Base.astro and therefore ends up inside the page build, where
// import.meta.url points into dist/ and package.json is not there.
// `define` makes it a literal in the output - no runtime cost, one source.
const { version } = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8')
);

// `site` comes from src/site.config.mjs, which resolves SITE_ENV to one of three
// named environments and throws if it is unset. Nothing here is hard-coded, so a
// production build cannot inherit a staging origin by accident.
export default defineConfig({
  site: site.origin,
  trailingSlash: 'never',
  build: { format: 'file' },
  // Astro 7's HTML compressor removes whitespace between a text node and an
  // adjacent INLINE element, so prose written across two source lines comes out
  // with the words run together: "a chapter of<a>Illuman</a>" reads as
  // "a chapter ofIlluman". Astro 5's compressor did not do this. It is the same
  // defect that got the 7.3.2 upgrade rejected in Prompt 07, and it is not
  // fixed in 7.3.3 - only made invisible to a whitespace-normalising diff.
  // tools/compare-build-text.py finds it; that harness is the gate here.
  // Cost of turning the compressor off: +124 gzipped bytes per page.
  compressHTML: false,

  vite: {
    define: { __SITE_VERSION__: JSON.stringify(version) },
    // Astro 7 minifies CSS with Lightning CSS, which by default rewrites every
    // width media query to Level 4 range syntax:
    //
    //     @media (max-width: 640px)   ->   @media (width <= 640px)
    //
    // Browsers older than Chrome 104 / Firefox 102 / Safari 16.4 do not parse
    // that and skip the whole block. All six of this site's breakpoints are
    // width queries, so on an iPhone still on iOS 15 the mobile layout would
    // simply stop applying - silently, with nothing in the build to catch it.
    // Naming a browser target keeps the classic syntax. Verified by diffing the
    // built stylesheet's @media rules before and after the upgrade.
    build: { cssTarget: ['chrome87', 'edge88', 'firefox78', 'safari14'] },
  },
});
