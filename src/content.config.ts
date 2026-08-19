import { defineCollection } from 'astro:content';
// zod is imported directly rather than from 'astro:content': Astro's re-export
// is marked deprecated and filled `astro check` with 55 warnings.
import { z } from 'zod';
import { glob } from 'astro/loaders';
import { THEME_KEYS } from './themes';

/**
 * `work` collection — one file per case, one URL per case.
 *
 * This is the project's real SEO asset (section 4 of the brief): today the 19
 * cases live at /portfolio/[slug]/ with 37 words and a generic
 * <h1>Portfolio</h1> on every one of them.
 *
 * WHAT IS REAL AND WHAT IS NOT
 *   Real, read off the current site: `title`, `client`, `previousSlug` and
 *   `vimeo`. Placeholders written by me: `brand`, `campaign`, `result` and
 *   `description`. Curation is still open (section 10) and the copy is signed
 *   off by the creative director.
 *
 * `year` and `category` are left empty on purpose: on the current site all 19
 * cases share a date (10 Feb 2024, the bulk upload, not the campaign) and a
 * category (Branding), so neither is usable for filtering. The filterable index
 * the brief proposes needs that data to be created first.
 */
const work = defineCollection({
  loader: glob({ base: './src/content/work', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      /** Title exactly as it appears on the current site. Verbatim, do not edit. */
      title: z.string(),
      /** Brand the campaign runs on. My reading of the title. */
      brand: z.string(),
      /** Campaign name. My reading of the title. */
      campaign: z.string(),
      /** Account or client, from the current site's CLIENT field. Real. */
      client: z.string(),

      /** Figure or result that heads the case, as the global site does. */
      result: z.string().optional(),
      /** Standfirst. One sentence with the challenge and the outcome. */
      summary: z.string().optional(),

      image: image(),
      /** Alt text. Empty only if the image is decorative. */
      imageAlt: z.string().default(''),

      year: z.number().int().min(1990).max(2100).optional(),
      category: z.string().optional(),
      industry: z.string().optional(),
      capabilities: z.array(z.string()).default([]),
      awards: z.array(z.string()).default([]),

      /** Vimeo id. All 19 current cases carry a Vimeo embed. */
      vimeo: z.string().optional(),

      /**
       * Campaign description. The place to tell it properly: what the problem
       * was, what idea solved it and what happened next. The long body goes in
       * the markdown, below the frontmatter.
       */
      description: z.string().optional(),

      /** Credits. The global site ends its description with "AGENCY: Almap BBDO". */
      credits: z.array(z.object({ role: z.string(), name: z.string() })).default([]),

      /**
       * Case palette. A closed list, defined in src/themes.ts, where each one is
       * validated against WCAG on import. With no theme, the case inherits the
       * site tokens.
       */
      theme: z.enum(THEME_KEYS).optional(),

      /**
       * Case blocks, in order. This is what gives the page rhythm and stops it
       * being a wall of text: the global site alternates full-bleed strips of
       * one, two and three images, each entering from a different side.
       *
       * MX does not have this material yet. The types are defined so it can be
       * requested with a concrete list in hand.
       */
      blocks: z
        .array(
          z.discriminatedUnion('type', [
            z.object({
              type: z.literal('images'),
              /** 1, 2 or 3. Sets the strip's rhythm. */
              images: z.array(image()).min(1).max(3),
              alt: z.array(z.string()).default([]),
              /** Full bleed, edge to edge of the screen. */
              fullBleed: z.boolean().default(true),
              caption: z.string().optional(),
            }),
            z.object({
              type: z.literal('quote'),
              text: z.string(),
              author: z.string().optional(),
              role: z.string().optional(),
            }),
            z.object({
              type: z.literal('stats'),
              /** Case figures. What turns a case into an argument. */
              stats: z
                .array(z.object({ figure: z.string(), note: z.string() }))
                .min(1)
                .max(4),
            }),
            z.object({
              type: z.literal('text'),
              title: z.string().optional(),
              body: z.string(),
            }),
            z.object({
              type: z.literal('video'),
              src: z.string(),
              poster: image(),
              alt: z.string().default(''),
            }),
          ])
        )
        .default([]),

      /** Path on the current site. Feeds the 301 redirect map. */
      previousSlug: z.string(),

      /** Appears on the home page. At most as many as the grid fits. */
      featured: z.boolean().default(false),
      /** Lowest first. Controls index order without depending on dates. */
      order: z.number().default(99),

      draft: z.boolean().default(false),
    }),
});

export const collections = { work };
