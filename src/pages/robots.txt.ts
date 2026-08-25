/**
 * robots.txt — generado, no estático.
 *
 * Era un fichero fijo con `Allow: /`, y ese fichero se sirve igual desde el
 * dominio de producción que desde cada previsualización de Vercel. El
 * resultado es que bbdo-mx-web.vercel.app quedó abierto a los rastreadores:
 * un sitio a medias, con textos de relleno, indexable bajo la marca de la
 * agencia y compitiendo con su sitio real.
 *
 * Los canonical apuntan a bbdomexico.com, que hoy sirve el WordPress viejo, y
 * varios de esos destinos son 404 — /news/ y la propia og:image entre ellos.
 * Un canonical que apunta a un 404 se ignora, así que no protege de nada.
 *
 * VERCEL_ENV vale "production" solo en el despliegue del dominio de
 * producción. Todo lo demás se cierra.
 */
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = ({ site }) => {
  const esProduccion = import.meta.env.VERCEL_ENV === 'production';

  const cuerpo = esProduccion
    ? `# BBDO México
User-agent: *
Allow: /

Sitemap: ${new URL('sitemap-index.xml', site ?? 'https://bbdomexico.com').href}
`
    : `# BBDO México — despliegue de previsualización, no indexar
User-agent: *
Disallow: /
`;

  return new Response(cuerpo, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
