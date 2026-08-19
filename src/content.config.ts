import { defineCollection } from 'astro:content';
// zod se importa directo y no desde 'astro:content': el re-export de Astro está
// marcado como deprecado y llenaba `astro check` de 55 avisos.
import { z } from 'zod';
import { glob } from 'astro/loaders';
import { CLAVES_TEMA } from './temas';

/**
 * Colección `work` — un archivo por caso, una URL por caso.
 *
 * Es el activo SEO real del proyecto (sección 4 del brief): hoy los 19 casos
 * de bbdomexico.com viven en /portfolio/[slug]/ con 37 palabras y un <h1>
 * genérico que dice "Portfolio" en todos.
 *
 * QUÉ ES REAL Y QUÉ NO
 *   Reales, leídos del sitio actual: `titulo`, `cliente`, `slugAnterior`.
 *   Placeholder míos: `marca`, `campana`, `resultado`, `descripcion` y las
 *   imágenes. La curaduría sigue abierta (sección 10) y el copy lo firma el
 *   director creativo.
 *
 * `anio` va vacío a propósito: en el sitio actual los 19 casos tienen la misma
 * fecha (10 feb 2024), que es la de la carga masiva, no la de la campaña. Y
 * `categoria` es "Branding" en los 19, así que tampoco sirve para filtrar. El
 * índice filtrable que propone el brief necesita que esos datos se creen.
 */
const work = defineCollection({
  loader: glob({ base: './src/content/work', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      /** Título tal cual aparece hoy en el sitio actual. Verbatim, no tocar. */
      titulo: z.string(),
      /** Marca sobre la que corre la campaña. Mi lectura del título. */
      marca: z.string(),
      /** Nombre de la campaña. Mi lectura del título. */
      campana: z.string(),
      /** Cuenta o cliente, del campo CLIENT del sitio actual. Real. */
      cliente: z.string(),

      /** Cifra o resultado que encabeza el caso, como hace el global. */
      resultado: z.string().optional(),
      /** Entradilla. Una frase con el reto y el resultado. */
      resumen: z.string().optional(),

      imagen: image(),
      /** Texto alternativo. Vacío solo si la imagen es decorativa. */
      imagenAlt: z.string().default(''),

      anio: z.number().int().min(1990).max(2100).optional(),
      categoria: z.string().optional(),
      industria: z.string().optional(),
      capacidades: z.array(z.string()).default([]),
      premios: z.array(z.string()).default([]),

      /** Id de Vimeo. Los 19 casos actuales llevan un embed de Vimeo. */
      vimeo: z.string().optional(),

      /**
       * Descripción de la campaña. Es el espacio para contarla con calma:
       * qué problema había, qué idea lo resolvió y qué pasó después.
       * El cuerpo largo va en el markdown, debajo del frontmatter.
       */
      descripcion: z.string().optional(),

      /** Créditos. El global remata su descripción con "AGENCY: Almap BBDO". */
      creditos: z.array(z.object({ rol: z.string(), nombre: z.string() })).default([]),

      /**
       * Paleta del caso. Lista cerrada, definida en src/temas.ts, donde cada
       * una se valida contra la WCAG al importarse. Sin tema, el caso hereda
       * los tokens del sitio.
       */
      tema: z.enum(CLAVES_TEMA).optional(),

      /**
       * Bloques del caso, en orden. Es lo que da ritmo a la página y evita
       * que sea un muro de texto: el global alterna tiras de una, dos y tres
       * imágenes a sangre, y cada tira entra por un lado distinto.
       *
       * MX todavía no tiene este material. Los tipos están definidos para
       * poder pedirlo con una lista concreta en la mano.
       */
      bloques: z
        .array(
          z.discriminatedUnion('tipo', [
            z.object({
              tipo: z.literal('imagenes'),
              /** 1, 2 o 3. Marca el ritmo de la tira. */
              imagenes: z.array(image()).min(1).max(3),
              alt: z.array(z.string()).default([]),
              /** A sangre, de borde a borde de la pantalla. */
              sangre: z.boolean().default(true),
              pie: z.string().optional(),
            }),
            z.object({
              tipo: z.literal('cita'),
              texto: z.string(),
              autor: z.string().optional(),
              cargo: z.string().optional(),
            }),
            z.object({
              tipo: z.literal('datos'),
              /** Cifras del caso. Lo que convierte un caso en argumento. */
              datos: z
                .array(z.object({ cifra: z.string(), nota: z.string() }))
                .min(1)
                .max(4),
            }),
            z.object({
              tipo: z.literal('texto'),
              titulo: z.string().optional(),
              cuerpo: z.string(),
            }),
            z.object({
              tipo: z.literal('video'),
              src: z.string(),
              poster: image(),
              alt: z.string().default(''),
            }),
          ])
        )
        .default([]),

      /** Ruta en el sitio actual. Alimenta el mapa de redirects 301. */
      slugAnterior: z.string(),

      /** Sale en el home. Máximo los que quepan en la rejilla. */
      destacado: z.boolean().default(false),
      /** Menor primero. Controla el orden del índice sin depender de fechas. */
      orden: z.number().default(99),

      borrador: z.boolean().default(false),
    }),
});

export const collections = { work };
