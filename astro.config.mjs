import { defineConfig } from 'astro/config';
import { site } from './src/site.config.mjs';

// `site` comes from src/site.config.mjs, which resolves SITE_ENV to one of three
// named environments and throws if it is unset. Nothing here is hard-coded, so a
// production build cannot inherit a staging origin by accident.
export default defineConfig({
  site: site.origin,
  trailingSlash: 'never',
  build: { format: 'file' },
});
