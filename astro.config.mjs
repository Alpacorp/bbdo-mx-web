// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * `site` is not decoration. Without it Astro.site is undefined, no sitemap can
 * be generated, and every absolute URL has to be built from a domain typed by
 * hand somewhere — which is how the JSON-LD ended up pointing its logo at
 * /wp-content/uploads/, a path that stops existing the day WordPress is
 * switched off.
 *
 * The redirect map in docs/ and section 6 of the brief both depend on this
 * being the real production origin before deploy.
 */
export default defineConfig({
  site: 'https://bbdomexico.com',
  integrations: [
    sitemap({
      // Section 11: the old post URLs are handled by 301s, not by listing them.
      filter: (page) => !page.includes('/legal/'),
    }),
  ],
});
