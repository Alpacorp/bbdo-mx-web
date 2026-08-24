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
    /* No filter. The legal notices were excluded here before they existed,
       with a comment that did not explain why; they are real, indexable pages
       reachable from the footer, exactly as they are on the current site, so
       there is no reason to hide them from the sitemap. */
    sitemap(),
  ],
});
