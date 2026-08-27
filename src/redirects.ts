/**
 * redirects.ts — what happens to every URL the current site publishes.
 *
 * Section 6 of the brief marks this non-negotiable before deploy, and the
 * reason is arithmetic: bbdomexico.com's sitemaps list 157 indexable URLs and
 * this site has 29. Without a map, 128 URLs 404 on cutover.
 *
 * THE INVENTORY, read on 2026-08-27 from the ten sitemaps under
 * bbdomexico.com/*-sitemap.xml:
 *
 *   157 URLs indexed today
 *    41 are real content and are redirected below
 *   115 are demo pages that shipped with the WordPress theme and were never
 *       deleted — 29 under /elements/, 20 under /portfolio-page/, a whole
 *       WooCommerce store, plus /sample-page/, /pagina-ejemplo/, /test/ and
 *       /coming-soon/. They are live, indexable, and have nothing to do with
 *       the agency.
 *
 * WHY THOSE 115 ARE NOT REDIRECTED TO THE HOME
 *   Because that is a soft 404, and Google treats a redirect to an unrelated
 *   page as one: the page is dropped from the index either way, and the site
 *   collects a pile of "redirect to irrelevant page" signals on the way. 410
 *   says the resource is gone on purpose, which is exactly true here, and it
 *   is dropped faster than a 404 would manage.
 *
 * THE CASES WERE VERIFIED, NOT GUESSED
 *   The 19 campaign URLs were matched to ours by the Vimeo id embedded in each
 *   old page, not by reading the slugs — several differ (bayer-aspirina-wsfak,
 *   geep-pepsi-black, plain /portfolio/pedigree/), and a mapping done by eye
 *   would have sent people to the wrong campaign. All 19 matched.
 *
 * THREE TARGETS NEED CONFIRMING BEFORE THIS SHIPS
 *   /services/       has no equivalent here. Its page on the current site is
 *                    three quotes from a CEO who has left and the client wall
 *                    again, so there was nothing to migrate. Pointed at
 *                    /about/ as the nearest honest answer.
 *   /comite-bbdo/    answers 200 with an empty <main>. Nobody has been able to
 *                    say what it was. Pointed at /about/.
 *   /politica-privacidad/  publishes WordPress's unedited privacy template,
 *                    the one that starts "Texto sugerido". It is a fifth legal
 *                    URL nobody had inventoried. Pointed at our privacy
 *                    notice, which is what someone landing there wants.
 */

/**
 * Old path to new path, 301. Keys carry a trailing slash because that is how
 * WordPress publishes them and how they are indexed.
 */
export const MOVED: Record<string, string> = {
  // --- Pages -------------------------------------------------------------
  '/about-us/': '/about/',
  '/bbdoers/': '/people/',
  '/contactanos/': '/contact/',
  '/blog/': '/news/',
  '/services/': '/about/',
  '/comite-bbdo/': '/about/',

  // Sections that no longer have a page of their own: the content moved onto
  // the home, so the fragment lands on it instead of at the top.
  '/nuestros-clientes/': '/#clients-title',
  '/our-process/': '/#process-title',

  // --- Legal -------------------------------------------------------------
  '/aviso-de-privacidad/': '/legal/privacidad/',
  '/aviso-de-cookies/': '/legal/cookies/',
  '/aviso-de-terminos-de-uso/': '/legal/terminos/',
  '/aviso-de-alerta-de-estafa/': '/legal/alerta-de-estafa/',
  '/politica-privacidad/': '/legal/privacidad/',

  // --- The work ----------------------------------------------------------
  '/portfolio/': '/the-work/',
  '/portfolio-page/the-work/': '/the-work/',

  // Matched by Vimeo id. Left column is the current site's slug, and several
  // of them are nothing like ours.
  '/portfolio/abi-friends-delivery/': '/the-work/abi-friends-delivery/',
  '/portfolio/pony-malta/': '/the-work/pony-malta/',
  '/portfolio/ea-sports-siempre-vivos/': '/the-work/ea-sports-siempre-vivos/',
  '/portfolio/ea-sports-el-alebrije/': '/the-work/ea-sports-el-alebrije/',
  '/portfolio/pedigree-ipouchyou/': '/the-work/pedigree-i-pouch-you/',
  '/portfolio/pedigree/': '/the-work/pedigree-dogscar/',
  '/portfolio/bayer-alka-setzer-el-juego-de-mesa/': '/the-work/alka-seltzer-el-juego-de-mesa/',
  '/portfolio/bayer-flanax-pride/': '/the-work/flanax-pride/',
  '/portfolio/bayer-flanax-bayer-vs-bayer/': '/the-work/flanax-bayer-vs-bayer/',
  '/portfolio/bayer-aspirina-wsfak/': '/the-work/aspirina-worlds-smallest-first-aid-kit/',
  '/portfolio/uber-pereatsfoneo/': '/the-work/uber-pereatsfoneo/',
  '/portfolio/uber-que-tu-auto-aporte/': '/the-work/uber-que-tu-auto-aporte/',
  '/portfolio/uber-mariachis/': '/the-work/uber-mariachis/',
  '/portfolio/saba/': '/the-work/saba-vulvacare/',
  '/portfolio/san-rafael-balance-escucha-tu-cuerpo/': '/the-work/san-rafael-escucha-tu-cuerpo/',
  '/portfolio/tostitos-sabritas/': '/the-work/tostitos-sabritas/',
  '/portfolio/gepp-pepsi-black-a-que-te-sabe/': '/the-work/pepsi-black-a-que-te-sabe/',
  '/portfolio/gepp-pepsi-sabe-a-todo/': '/the-work/pepsi-sabe-a-todo/',
  '/portfolio/geep-pepsi-black/': '/the-work/pepsi-black-into-the-void/',

  // --- News --------------------------------------------------------------
  '/2024/11/26/bbdo-premio-agencia-transformadora/': '/news/bbdo-premio-agencia-transformadora/',
  '/category/news-2/': '/news/',

  // --- Taxonomies --------------------------------------------------------
  // WordPress publishes an archive per term. The terms themselves do not
  // survive the migration, so each one goes to the page that replaced it.
  '/portfolio-category/art/': '/the-work/',
  '/portfolio-category/branding/': '/the-work/',
  '/team-category/all-team/': '/people/',
  '/team-category/manager/': '/people/',
  '/clients-category/clients-1/': '/#clients-title',
};

/**
 * Whole families of theme demos. Prefixes and not a list of paths: the
 * sitemap is what WordPress chose to publish, and these templates generate
 * more URLs than they declare.
 *
 * /portfolio-page/ and /blog/ appear here AND in MOVED. MOVED is checked
 * first, so /portfolio-page/the-work/ and /blog/ survive and their demo
 * siblings do not.
 */
export const GONE_PREFIXES: readonly string[] = [
  '/elements/',
  '/portfolio-page/',
  '/blog/',
  '/product/',
  '/product-list/',
  '/product-category/',
  '/testimonials-category/',
];

/** The demos that do not belong to a family. */
export const GONE_EXACT: readonly string[] = [
  '/agency-home/',
  '/app-showcase/',
  '/blog-metro/',
  '/cart/',
  '/cart-2/',
  '/cascading-portfolio/',
  '/checkout/',
  '/checkout-2/',
  '/coming-soon/',
  '/elementor-15/',
  '/fullscreen-showcase/',
  '/interactive-links/',
  '/justified-portfolio/',
  '/landing/',
  '/landing-new/',
  '/my-account/',
  '/my-account-2/',
  '/pagina-ejemplo/',
  '/portfolio-metro/',
  '/pricing-packages/',
  '/refund_returns/',
  '/sample-page/',
  '/shop/',
  '/shop-home/',
  '/test/',
];

/** Trailing slash, so `/test` and `/test/` are the same lookup. */
function normalise(pathname: string): string {
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

/**
 * True when the path is one of the theme demos and must answer 410.
 *
 * MOVED wins, always: several demo families share a prefix with a page that
 * is genuinely moving.
 */
export function isGone(pathname: string): boolean {
  const path = normalise(pathname);
  if (path in MOVED) return false;
  if (GONE_EXACT.includes(path)) return true;
  return GONE_PREFIXES.some((prefix) => path.startsWith(prefix));
}
