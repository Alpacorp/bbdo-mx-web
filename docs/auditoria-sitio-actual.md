# Auditoría de bbdomexico.com

Capturada en vivo el 2026-08-18 recorriendo el sitio. Actualiza y corrige la
sección 2 de PROJECT.md. Base del inventario de URLs y del mapa de redirects
301 (sección 6).

## Inventario de URLs

Las 14 URLs alcanzables desde la navegación. Es el punto de partida del mapa
de redirects, NO el inventario completo: falta el crawl de Screaming Frog de
la sección 11 para encontrar huérfanas y las que tienen tráfico.

| URL actual | Palabras | Destino propuesto (sección 4) |
|---|---|---|
| `/` | 1467 | `/` |
| `/about-us/` | 1336 | `/about/` |
| `/services/` | 1377 | matar → 301 a `/work/` |
| `/our-process/` | 1165 | matar → 301 a `/about/` |
| `/nuestros-clientes/` | 985 | absorber en `/work/` o `/about/` |
| `/portfolio-page/the-work/` | 1089 | `/work/` (y estallar en `/work/[slug]`) |
| `/bbdoers/` | 1825 | `/people/` |
| `/comite-bbdo/` | 808 | `/about/` (no aparece en PROJECT.md) |
| `/contactanos/` | 853 | `/contact/` |
| `/2024/11/26/bbdo-premio-agencia-transformadora/` | 1572 | `/news/[slug]` |
| `/aviso-de-privacidad/` | — | `/legal/privacidad/` |
| `/aviso-de-cookies/` | — | `/legal/cookies/` |
| `/aviso-de-terminos-de-uso/` | — | `/legal/terminos/` |
| `/aviso-de-alerta-de-estafa/` | — | `/legal/alerta-de-estafa/` |

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

   | Archivo | Peso |
   |---|---|
   | `head-team.mp4` | 30.8 MB |
   | `video-home.mp4` | 27.0 MB |
   | `BBDO-video.mp4` | 17.2 MB |
   | `ours.mp4` | 10.8 MB |
   | `banner-premios.mp4` | 9.7 MB |
   | `the-work-the-work.mp4` | 3.7 MB |
   | `bbdoers-rigth.mp4` | 3.6 MB |
   | `bbdoers.mp4` | 3.5 MB |

   Solo `/bbdoers/` carga 37.9 MB de video entre sus tres archivos. El nombre
   `bbdoers-rigth.mp4` lleva además un typo en el propio archivo.

6. **El muro de clientes existe y es aprovechable.** 16 marcas con logotipo:
   Modelo, Pepsi, Mirinda, Tostitos, Yoplait, Pedigree, Oscar Mayer, San
   Rafael, Norteñita, Olé, Saba, Finamex, BMW, MINI, Buchanan's y Johnnie
   Walker. Los nueve últimos están subidos en 2018 y los demás entre 2023 y
   2025: hay que confirmar cuáles siguen siendo cuenta viva antes de
   publicarlos.

7. **El home tiene 88 palabras visibles.** El resto del peso de la página es
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
