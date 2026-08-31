/**
 * organization.ts — the agency as an entity, in one place.
 *
 * WHY THIS FILE EXISTS
 *   The JSON-LD lived inline in Base.astro, and that is how a claim nobody had
 *   verified ended up asserted on every page of the site. /about/ deliberately
 *   refuses to name a CEO — Camilo Plazas is named as such by the November 2024
 *   article and by the JSON-LD drafted during the proposal, but he appears
 *   nowhere in the 117-person roster the agency publishes — and meanwhile the
 *   structured data was telling search engines he runs the company. Careful
 *   wording in the copy is worth nothing if the machine-readable layer says
 *   something else.
 *
 * THE RULE
 *   Anything in UNVERIFIED does not ship. It is not commented out and it is not
 *   left to a developer to remember: `organizationGraph()` simply does not emit
 *   what is not confirmed. To publish one of these, the agency confirms it, the
 *   value moves into the block above, and it appears everywhere at once.
 *
 * Verified means: someone at BBDO México said yes, or it is on a public
 * register. "It was on the old site" is not verification — the old site also
 * says "Omincon" in every meta description.
 */

export const SITE_NAME = 'BBDO México';

/**
 * Canonical origin, taken from `site` in astro.config.mjs so there is one
 * source for it. The fallback only exists because import.meta.env.SITE is
 * typed as possibly undefined; if it ever fires, the config lost its `site`
 * and the sitemap is broken too.
 */
export const SITE_URL = (import.meta.env.SITE ?? 'https://bbdomexico.com').replace(/\/$/, '');

/**
 * PENDING CONFIRMATION — none of this is published.
 *
 * Held here rather than deleted so the questions stay visible and the answers
 * have somewhere obvious to land.
 */
export const UNVERIFIED = {
  /** Razón social exacta, and whether it differs from the trading name. */
  legalName: null,

  /** foundingDate. Never invent a founding year for a real company. */
  foundingDate: null,

  /** A new-business address. Today the only public one is recruitment. */
  newBusinessEmail: null,
};

const CEO = {
  '@type': 'Person',
  '@id': `${SITE_URL}/#jorge-obregon`,
  name: 'Jorge Obregón',
  jobTitle: 'Chief Executive Officer',
  worksFor: { '@id': `${SITE_URL}/#organization` },
} as const;

/** Verified: read off the current site and unchanged for years. */
const ADDRESS = {
  '@type': 'PostalAddress',
  streetAddress: 'Calle Palo Santo 22, Piso 1, Lomas Altas',
  addressLocality: 'Miguel Hidalgo',
  addressRegion: 'Ciudad de México',
  postalCode: '11950',
  addressCountry: 'MX',
} as const;

export const TELEPHONE = '+52-55-5267-1500';
export const HR_EMAIL = 'quierotrabajaren@bbdomexico.com';

/**
 * The agency's own accounts, each one opened and checked on 2026-08-31 rather
 * than copied across.
 *
 * WHY THAT MATTERED HERE
 *   bbdomexico.com's markup carries the theme vendor's accounts alongside the
 *   agency's — facebook.com/QodeInteractive and twitter.com/QodeInteractive,
 *   part of the Qode demo that section 2 of the brief lists as never removed.
 *   Copying "the social links off the current site" would have published them.
 *
 * WHAT EACH CHECK FOUND
 *   facebook  live, "BBDO México", advertising agency, 2k followers, and the
 *             same telephone as TELEPHONE above.
 *   tiktok    live: uniqueId bbdomx, 335 followers, bio "THE WORK. THE WORK.
 *             THE WORK". Absent from our list until now; it is in the current
 *             site's own JSON-LD and the audit had flagged the gap.
 *   linkedin  live. The current site links the ADMIN url, /company/bbdomx/
 *             mycompany/, which is a page only a page admin can open. The
 *             public one is this.
 *   x         x.com and not twitter.com: the site's own JSON-LD moved, its
 *             markup did not.
 *   instagram live.
 *
 * Order is by what an agency's audience goes looking for: the work first, then
 * the people, then the rest.
 */
export const SOCIAL = [
  { label: 'Instagram', href: 'https://www.instagram.com/bbdomx/' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/bbdomx/' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@bbdomx' },
  { label: 'Facebook', href: 'https://www.facebook.com/bbdomx' },
  { label: 'X', href: 'https://x.com/BBDOmx' },
] as const;

/** Just the urls, which is the shape schema.org's sameAs takes. */
export const SOCIAL_URLS = SOCIAL.map((s) => s.href);

/**
 * The @graph every page carries: the agency, its ownership chain up to
 * Omnicom, and the site itself. Section 2 of the brief lists "sin JSON-LD:
 * cero entidad declarada, sin cadena de propiedad Omnicom" among the findings;
 * this is the answer to it.
 */
export function organizationGraph(): Record<string, unknown>[] {
  return [
    {
      '@type': 'AdvertisingAgency',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      alternateName: 'BBDO MX',
      url: `${SITE_URL}/`,
      description:
        'BBDO México es una de las agencias de publicidad más premiadas del país y forma parte de BBDO Worldwide, red creativa de Omnicom Group.',
      slogan: 'Do Big Things',
      logo: {
        '@type': 'ImageObject',
        '@id': `${SITE_URL}/#logo`,
        url: `${SITE_URL}/v/logo-bbdo.png`,
        caption: SITE_NAME,
      },
      image: { '@id': `${SITE_URL}/#logo` },
      parentOrganization: {
        '@type': 'Organization',
        '@id': 'https://bbdo.com/#organization',
        name: 'BBDO Worldwide',
        url: 'https://bbdo.com/',
        parentOrganization: {
          '@type': 'Organization',
          name: 'Omnicom Group',
          url: 'https://www.omnicomgroup.com/',
          tickerSymbol: 'NYSE:OMC',
        },
      },
      address: ADDRESS,
      geo: { '@type': 'GeoCoordinates', latitude: 19.3968252, longitude: -99.2276834 },
      telephone: TELEPHONE,
      areaServed: { '@type': 'Country', name: 'México' },
      knowsLanguage: ['es-MX', 'en'],
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'human resources',
          email: HR_EMAIL,
          telephone: TELEPHONE,
          areaServed: 'MX',
          availableLanguage: ['Spanish', 'English'],
        },
      ],
      sameAs: SOCIAL_URLS,
      employee: { '@id': CEO['@id'] },
    },
    CEO,
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      inLanguage: 'es-MX',
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
  ];
}
