# Auditoría de bbdomexico.com

Capturada en vivo el 2026-08-18 recorriendo el sitio. Actualiza y corrige la
sección 2 de PROJECT.md. Base del inventario de URLs y del mapa de redirects
301 (sección 6).

## Inventario de URLs

Las 14 URLs alcanzables desde la navegación. Es el punto de partida del mapa
de redirects, NO el inventario completo: falta el crawl de Screaming Frog de
la sección 11 para encontrar huérfanas y las que tienen tráfico.

| URL actual                                        | Palabras | Destino propuesto (sección 4)           |
| ------------------------------------------------- | -------- | --------------------------------------- |
| `/`                                               | 1467     | `/`                                     |
| `/about-us/`                                      | 1336     | `/about/`                               |
| `/services/`                                      | 1377     | matar → 301 a `/work/`                  |
| `/our-process/`                                   | 1165     | matar → 301 a `/about/`                 |
| `/nuestros-clientes/`                             | 985      | absorber en `/work/` o `/about/`        |
| `/portfolio-page/the-work/`                       | 1089     | `/work/` (y estallar en `/work/[slug]`) |
| `/bbdoers/`                                       | 1825     | `/people/`                              |
| `/comite-bbdo/`                                   | 808      | `/about/` (no aparece en PROJECT.md)    |
| `/contactanos/`                                   | 853      | `/contact/`                             |
| `/2024/11/26/bbdo-premio-agencia-transformadora/` | 1572     | `/news/[slug]`                          |
| `/aviso-de-privacidad/`                           | —        | `/legal/privacidad/`                    |
| `/aviso-de-cookies/`                              | —        | `/legal/cookies/`                       |
| `/aviso-de-terminos-de-uso/`                      | —        | `/legal/terminos/`                      |
| `/aviso-de-alerta-de-estafa/`                     | —        | `/legal/alerta-de-estafa/`              |

`/comite-bbdo/` y las cuatro páginas legales no estaban en el brief.
`/aviso-de-alerta-de-estafa/` sugiere que hubo suplantación de la marca en
procesos de reclutamiento: conviene preguntar antes de moverla o quitarla.

## Hallazgos nuevos, no listados en el brief

1. **`lang="es-CO"` en las 10 páginas.** Colombia, no México. Está también en
   el JSON-LD (`inLanguage: es-CO`). Señal geográfica equivocada para un sitio
   que quiere posicionar en MX.

2. **`<h1>Boldlab</h1>` en las 10 páginas.** Sale del widget
   `widget_boldlab_core_highlight`, del área de widgets global de la demo del
   tema. En 6 de las 10 páginas es el ÚNICO H1: `/our-process/`,
   `/nuestros-clientes/`, `/portfolio-page/the-work/`, `/comite-bbdo/`,
   `/contactanos/` y el post de noticias no tienen H1 propio. El H1 de todo el
   sitio es el nombre comercial de la plantilla.

3. **Lorem ipsum en las 10 páginas, no solo en el home.** Vive en un
   `widget_text` del mismo área de widgets. El brief lo situaba solo en "Our
   Work_" y FAQ del home.

4. **Tres page builders apilados**: Slider Revolution 6.6.12 + WPBakery +
   Elementor 4.2.2, más Site Kit by Google. Cada uno con su CSS y su JS.

5. **Videos sin comprimir.** El home carga `video-home.mp4` de **27 MB**, y
   hay `BBDO-video.mp4` de 17 MB y `ours.mp4` de 10.8 MB. El presupuesto de
   la sección 6 del brief es de 2.5 MB para el hero entero. El sitio actual
   lo excede diez veces. Inventario de lo encontrado:

   | Archivo                 | Peso    |
   | ----------------------- | ------- |
   | `head-team.mp4`         | 30.8 MB |
   | `video-home.mp4`        | 27.0 MB |
   | `BBDO-video.mp4`        | 17.2 MB |
   | `ours.mp4`              | 10.8 MB |
   | `banner-premios.mp4`    | 9.7 MB  |
   | `the-work-the-work.mp4` | 3.7 MB  |
   | `bbdoers-rigth.mp4`     | 3.6 MB  |
   | `bbdoers.mp4`           | 3.5 MB  |

   Solo `/bbdoers/` carga 37.9 MB de video entre sus tres archivos. El nombre
   `bbdoers-rigth.mp4` lleva además un typo en el propio archivo.

6. **El muro de clientes existe y es aprovechable.** 16 marcas con logotipo:
   Modelo, Pepsi, Mirinda, Tostitos, Yoplait, Pedigree, Oscar Mayer, San
   Rafael, Norteñita, Olé, Saba, Finamex, BMW, MINI, Buchanan's y Johnnie
   Walker. Los nueve últimos están subidos en 2018 y los demás entre 2023 y
   2025: hay que confirmar cuáles siguen siendo cuenta viva antes de
   publicarlos.

7. **Los casos SÍ tienen URL propia.** El brief decía que todo "The Work"
   vive en una sola página y que no hay páginas indexables por marca. No es
   exacto: los 19 casos existen en `/portfolio/[slug]/`. Ver
   `docs/redirects-work.md` para el mapa uno-a-uno.

   Lo que sí falla es lo que hay dentro: **`<h1>Portfolio</h1>` en los 19**,
   el nombre del caso relegado a `h2`, y **37 palabras** por página. Sin
   descripción, sin resultado, sin premios. Solo un embed de Vimeo y tres
   campos: CLIENT, DATE y CATEGORY.

8. **Los metadatos de los casos no sirven para filtrar.** Los 19 comparten
   fecha (10 feb 2024, la de la carga masiva, no la de la campaña) y
   categoría (Branding). El índice filtrable por marca / industria /
   capacidad / año que propone la sección 4 del brief no tiene datos detrás:
   hay que crearlos en la curaduría.

9. **Los key visuals son PNG de ~4 MB.** A 1920×1080 y sin optimizar. Los 19
   suman unos 75 MB. Convertirlos a WebP o AVIF es parte de la migración.

10. **Los videos de campaña están en Vimeo, no en el sitio.** Cada caso
    incrusta un reproductor de Vimeo; no hay ni un `.mp4` propio por campaña.
    Los ids están recogidos en el campo `vimeo` de cada caso. Consecuencia
    práctica: **no se pueden usar como fondo en bucle del banner**, porque un
    embed de Vimeo no es un archivo de video. Para eso hace falta un mp4 mudo
    y recortado por campaña.

    Lo que sí se puede aprovechar, y ya se hizo: la **miniatura** de cada video
    vía el oEmbed público de Vimeo, a 1280×720. Son los key visuals reales que
    se ven hoy en `/work/`, los **19 de 19**.

    Dos requirieron un segundo intento, y conviene saberlo para futuras
    migraciones: ABI – Friends Delivery incrusta **dos** videos y el primero
    (908820654) está privado o borrado; el bueno es el segundo, que además
    revela que la campaña es de **Stella Artois**, no de ABI a secas. Y Saba –
    Vulvacare sí tiene video (908789954), solo que su embed no lleva el
    prefijo `player.` en la URL.

11. **El rojo de marca puro no cumple accesibilidad con texto blanco.**
    `#FF0000` con `#FFFFFF` da **4.00:1**, por debajo del 4.5:1 que pide la
    WCAG AA. Afecta a cualquier bloque de texto blanco sobre rojo pleno,
    incluidas las palabras del banner. Las paletas de caso usan rojos más
    oscuros para fondo y reservan el `#FF0000` para acento sobre claro.

12. **BBDOers es el mejor contenido del sitio actual.** 117 personas con
    nombre, cargo y retrato, en WebP de 800×1033 y entre 50 y 110 KB. Es lo
    único que estaba ya optimizado y listo para migrar tal cual. Contrasta con
    los key visuals de casos, que son PNG de 4 MB.

    Dos avisos para la agencia: el listado tiene **"Copywritter" con doble t**
    en tres fichas contra "Copywriter" en cuatro, y una lista de 117 personas
    se queda desactualizada rápido, así que necesita dueño y un proceso de
    altas y bajas antes de publicarla.

13. **El home tiene 88 palabras visibles.** El resto del peso de la página es
    chrome del tema.

## Correcciones al brief

- **"Sin JSON-LD" ya no es cierto.** Yoast inyecta un `@graph` con `WebPage`,
  `BreadcrumbList`, `WebSite` y `Organization`. Pero el diagnóstico de fondo
  aguanta: es `Organization` genérico, no `AdvertisingAgency`, y **no declara
  `parentOrganization`**, así que la cadena a BBDO Worldwide y Omnicom sigue
  sin existir. Tampoco lleva `address` ni `telephone`.
- El `sameAs` de Yoast incluye **TikTok** (`@bbdomx`) y usa `x.com` en vez de
  `twitter.com`. El JSON-LD de `jsonld-bbdo-mexico.html` no tiene TikTok y sí
  LinkedIn: hay que reconciliar las dos listas y verificar cuáles siguen vivas.
  **RECONCILIADO el 2026-08-31**: las cinco (Instagram, LinkedIn, TikTok,
  Facebook, X) abiertas y comprobadas una a una, y publicadas en el pie. Ver
  `src/organization.ts`. La de LinkedIn del sitio actual es la url de
  administración (`/mycompany/`), que solo abre un administrador.

## Confirmado del brief

- Title duplicado: `BBDO México - BBDO México`.
- Typo "Omincon" en la meta description, idéntica en las 10 páginas.
- Demo del tema enlazada: `boldlab.qodeinteractive.com` y
  `twitter.com/QodeInteractive`. Entre 5 y 7 referencias a `qodeinteractive`
  por página.
- Menú NEWS apunta al post suelto de nov-2024, no a un índice.
- Único contacto: `quierotrabajaren@bbdomexico.com`.
- Mezcla es/en en URLs y títulos: `/about-us/`, `/services/`, `/our-process/`
  conviven con `/nuestros-clientes/` y `/contactanos/`.
