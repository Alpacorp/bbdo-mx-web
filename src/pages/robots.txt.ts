/**
 * robots.txt — generated, not static.
 *
 * It used to be a fixed file saying `Allow: /`, and that same file is served
 * from the production domain and from every Vercel preview alike. The result
 * was that bbdo-mx-web.vercel.app sat open to crawlers: a half-built site full
 * of placeholder copy, indexable under the agency's name and competing with
 * its real one.
 *
 * The canonicals point at bbdomexico.com, which today serves the old
 * WordPress, and several of those destinations are 404s — /news/ and the
 * og:image among them. A canonical pointing at a 404 is ignored, so it
 * protects nothing.
 *
 * VERCEL_ENV is "production" only on the production domain's deployment.
 * Everything else is closed.
 */
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = ({ site }) => {
  const isProduction = import.meta.env.VERCEL_ENV === 'production';

  const body = isProduction
    ? `# BBDO México
User-agent: *
Allow: /

Sitemap: ${new URL('sitemap-index.xml', site ?? 'https://bbdomexico.com').href}
`
    : `# BBDO México — despliegue de previsualización, no indexar
User-agent: *
Disallow: /
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
