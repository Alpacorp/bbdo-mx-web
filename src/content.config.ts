import { defineCollection } from 'astro:content';
// zod is imported directly rather than from 'astro:content': Astro's re-export
// is marked deprecated and filled `astro check` with 55 warnings.
import { z } from 'zod';
import { glob, file } from 'astro/loaders';
import { THEME_KEYS } from './themes';
import { NETWORK_KEYS, NETWORKS, belongsTo } from './networks';

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
       * Video for the case's banner, when it is not named after the case.
       * Usually it should be: the page falls back to /v/case/<slug>.mp4 by
       * convention, and to the shared clip if neither exists. This field is
       * the escape hatch for a real campaign cut that arrives under its own
       * name.
       */
      bannerVideo: z.string().optional(),

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

      /**
       * The campaign's photo mosaic, right below the description. Every case
       * gets one: it is where the material that is not the key visual lives —
       * stills, making of, pieces in the street, product.
       *
       * Between 3 and 8. Under three there is no mosaic, only a couple of
       * loose photos; over eight the section stops being a summary and turns
       * into an archive, and the case loses its thread.
       *
       * Optional because most cases are still waiting on the material. A case
       * without it renders nothing, which is the honest state.
       */
      collage: z
        .object({
          title: z.string().default('En imágenes'),
          images: z.array(image()).min(3).max(8),
          alt: z.array(z.string()).default([]),
          caption: z.string().optional(),
        })
        .optional(),

      /** Path on the current site. Feeds the 301 redirect map. */
      previousSlug: z.string(),

      /** Appears on the home page. At most as many as the grid fits. */
      featured: z.boolean().default(false),
      /** Lowest first. Controls index order without depending on dates. */
      order: z.number().default(99),

      draft: z.boolean().default(false),
    }),
});

/**
 * `people` collection — the BBDOers roster.
 *
 * A single JSON file instead of 117 markdown ones: these records have no body
 * copy, only fields, and one file per person would be 117 files to open every
 * time someone fixes a job title.
 *
 * Name, role and portrait are REAL, read off bbdomexico.com/bbdoers/. Two
 * things to raise with the agency before publishing: the roster has
 * "Copywritter" with a double t on three entries against "Copywriter" on four,
 * and a 117-person list will go stale fast, so it needs an owner.
 */
const people = defineCollection({
  loader: file('./src/data/people.json'),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    /** Only the CCO has one on the current site. */
    quote: z.string().optional(),
    /**
     * Portrait filename inside src/assets/people/. The page resolves it with
     * import.meta.glob: `image()` cannot be used here because the loader
     * reads a JSON file, not a markdown one sitting next to the asset.
     */
    photo: z.string(),
    /** Lowest first. Leadership on top, then the rest alphabetically. */
    order: z.number().default(99),

    /**
     * Personal accounts, one key per network, all optional. A card shows an
     * icon only for the keys that are there, so absence is the default and
     * nobody appears on the site by omission.
     *
     * THIS IS PERSONAL DATA ABOUT AN IDENTIFIED PERSON, so it is opt-in by
     * construction — but the consent is the agency's to collect, not this
     * file's to assume. See section 10 bis of the brief.
     *
     * The url is checked against the network's own hosts. Pasting a LinkedIn
     * profile into `instagram` is the mistake this catches, and it is the one
     * that cannot be seen afterwards: the icon renders, the link is wrong.
     */
    social: z
      .object(
        Object.fromEntries(
          NETWORK_KEYS.map((key) => [
            key,
            z
              .string()
              .refine((url) => belongsTo(key, url), {
                message: `must be an https url on ${NETWORKS[key].hosts.join(' or ')}`,
              })
              .optional(),
          ])
        ) as Record<(typeof NETWORK_KEYS)[number], z.ZodOptional<z.ZodString>>
      )
      .optional(),
  }),
});

/**
 * `news` collection — the index the current site does not have.
 *
 * Section 2 of the brief lists it among the reasons for the rebuild: the NEWS
 * item in the menu points at a single loose post from November 2024 rather
 * than at an index. That post is the only one there is — post-sitemap.xml
 * lists exactly one entry — so this collection starts with one file.
 *
 * ABOUT `source`
 *   That article closes with "Tomado de Revista Expansión": the text is
 *   Expansión's, republished. Reproducing someone else's article in full is a
 *   permission question, not a migration question, so what is stored here is a
 *   summary written for this site plus a link to the original. `source` exists
 *   to make that attribution structural rather than something a writer has to
 *   remember to add.
 */
const news = defineCollection({
  loader: glob({ base: './src/content/news', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Publication date, as the current site has it. Drives the ordering. */
      date: z.coerce.date(),
      /** One or two sentences. Feeds the cards, the index and the meta description. */
      summary: z.string(),

      /** Optional: an entry with no image renders as a typographic card. */
      image: image().optional(),
      imageAlt: z.string().default(''),

      /** Where the text came from, when it did not come from here. */
      source: z
        .object({
          name: z.string(),
          // z.url() and not z.string().url(): the latter is deprecated in Zod 4
          // and this project already imports zod directly to keep check clean.
          url: z.url().optional(),
        })
        .optional(),

      /** Path on the current site. Feeds the 301 redirect map. */
      previousSlug: z.string().optional(),

      draft: z.boolean().default(false),
    }),
});

export const collections = { work, people, news };
