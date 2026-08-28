import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://brianmueller.org',
  trailingSlash: 'never',
  build: { format: 'file' },
});
