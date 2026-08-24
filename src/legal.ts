/**
 * legal.ts — the four notices, and where they really come from.
 *
 * HOW THE CURRENT SITE DOES IT, AND WHY WE COPY THE MECHANISM
 *   The legal pages on bbdomexico.com contain no legal text. The pages ship
 *   empty and OneTrust injects the notice at runtime from Omnicom's own tenant
 *   (c0a325be-…). That is the OMC directive: the group drafts and updates the
 *   notices centrally, and every agency site embeds them.
 *
 *   So what gets replicated here is the embed, not the words. Copying the text
 *   into this repository would fork a legal document that Omnicom maintains:
 *   the day group legal updates it, every agency site would follow except
 *   ours, and nobody would notice until it mattered.
 *
 * WHAT IS WRONG WITH THE NOTICES THEMSELVES — for the agency, not for us
 *   Checked against the OneTrust manifests on 2026-08-24:
 *
 *   1. They are published in ENGLISH ONLY. Each manifest declares exactly one
 *      language, "en-us", flagged isDefault. There is no Spanish version.
 *   2. The privacy notice is the EU/UK GDPR one. Its own first paragraph reads
 *      "each of the Omnicom Advertising Group agencies located in ES" — ES is
 *      Spain. It never mentions México.
 *   3. It contains no LFPDPPP, no derechos ARCO and no INAI.
 *
 *   Mexico's LFPDPPP requires an aviso de privacidad naming the responsable
 *   and its domicile, the data processed, the purposes, how to exercise ARCO
 *   rights and how to revoke consent. A Spanish-jurisdiction GDPR notice in
 *   English does not do that. Whatever the contact form links to has to be a
 *   Mexican notice, and this is not one — which is a question for Omnicom
 *   legal, not something to solve in a template.
 */
export interface Notice {
  /** Last segment of /legal/<slug>/. */
  slug: string;
  title: string;
  /** Shown under the title so a reader knows whose document this is. */
  intro: string;
  /** OneTrust notice id. The <div> id must be `otnotice-${noticeId}`. */
  noticeId: string;
  /** URL on the current site. Feeds the 301 map. */
  previousPath: string;
}

/** Omnicom's OneTrust instance. Same for all four. */
export const ONETRUST_TENANT = 'c0a325be-6f68-46be-a0de-e4a750890f7d';
export const ONETRUST_CDN = 'https://omnicom-privacy-cdn.my.onetrust.com';

export const NOTICES: Notice[] = [
  {
    slug: 'privacidad',
    title: 'Aviso de privacidad',
    intro: 'Publicado y mantenido por Omnicom Advertising Group para todas sus agencias.',
    noticeId: '2a84ee3a-f77a-437e-9f4c-8ce23fd23a49',
    previousPath: '/aviso-de-privacidad/',
  },
  {
    slug: 'terminos',
    title: 'Términos de uso',
    intro: 'Publicado y mantenido por Omnicom Advertising Group para todas sus agencias.',
    noticeId: 'e2de7569-8d97-470c-8c20-682fc4c2e082',
    previousPath: '/aviso-de-terminos-de-uso/',
  },
  {
    slug: 'cookies',
    title: 'Aviso de cookies',
    intro: 'Publicado y mantenido por Omnicom Advertising Group para todas sus agencias.',
    noticeId: '6ee4ad86-07ec-4e81-838f-41d98263db80',
    previousPath: '/aviso-de-cookies/',
  },
  {
    slug: 'alerta-de-estafa',
    title: 'Alerta de estafa',
    intro: 'Sobre comunicaciones fraudulentas que suplantan a las agencias del grupo.',
    noticeId: '92994717-9f09-4e89-846c-739fdec0a853',
    previousPath: '/aviso-de-alerta-de-estafa/',
  },
];

/**
 * OneTrust locates its own <script> by this id and reads `settings` off it.
 * Without the id its loader throws on a null getAttribute and the notice never
 * renders — which is exactly what happened here before the id was copied over.
 * Vendor contract, not a preference: do not rename.
 */
export const ONETRUST_SCRIPT_ID = 'otprivacy-notice-script';

/**
 * Base64 of {"callbackUrl":"https://omnicom-privacy.my.onetrust.com/request/v1/
 * privacyNotices/stats/views"}. Taken verbatim from the current site. It is
 * what makes the notice report a view back to Omnicom, so the privacy page
 * itself is measured — worth knowing, and worth saying in the cookie notice.
 */
export const ONETRUST_SETTINGS =
  'eyJjYWxsYmFja1VybCI6Imh0dHBzOi8vb21uaWNvbS1wcml2YWN5Lm15Lm9uZXRydXN0LmNvbS9yZXF1ZXN0L3YxL3ByaXZhY3lOb3RpY2VzL3N0YXRzL3ZpZXdzIn0=';

/** Where the notice JSON lives, used for the no-JavaScript fallback. */
export function noticeSource(noticeId: string): string {
  return `${ONETRUST_CDN}/${ONETRUST_TENANT}/privacy-notices/${noticeId}.json`;
}
