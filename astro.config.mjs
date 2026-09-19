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
  vite: { define: { __SITE_VERSION__: JSON.stringify(version) } },
});
