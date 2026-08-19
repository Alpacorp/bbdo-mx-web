# BBDO México — Rediseño web · Brief técnico

> Este archivo es la memoria del proyecto. Es el primer prompt para Claude Code.
> Léelo completo antes de scaffoldear nada.

---

## 1. Qué es esto

Rediseño completo del sitio de BBDO México (agencia de publicidad, red Omnicom).
Sitio **netamente informativo**. Objetivo doble: renovación visual + **fortalecer SEO**.

- Sitio actual: `https://bbdomexico.com/` — WordPress sobre plantilla Qode "Boldlab".
- Sitio global (referencia de estética/motion): `https://bbdo.com/` — se maneja **aparte**. Dominios independientes, confirmado.
- Yo soy el desarrollador. Hay un director creativo y un diseñador web en el equipo.

**Nota de red (corregida el 2026-08-18):** el sandbox no llega a bbdo.com, pero
la automatización del navegador sí: corre en el navegador del desarrollador y
con sus permisos. La inspección del global ya no depende de que el humano pegue
hallazgos. Lo capturado está en `docs/referencia-visual-bbdo-global.md`.

---

## 2. Por qué se rehace (hallazgos del sitio actual)

Verificados en vivo sobre bbdomexico.com:

- **Lorem ipsum en producción** en el home (sección "Our Work_" y FAQ).
- **Demo del tema sigue enlazada**: el side area apunta a `boldlab.qodeinteractive.com`
  con redes sociales del vendor (Qode Interactive).
- **Typo sitewide en meta description**: "Omincon" → debe ser "Omnicom".
- **Title duplicado**: `BBDO México - BBDO México`.
- **Home en Slider Revolution 6.6.12**: los H1/claims viven dentro del slider,
  salen desordenados en el DOM, versión con CVEs conocidos.
- **Sin JSON-LD**: cero entidad declarada, sin cadena de propiedad Omnicom.
- **Arquitectura de URLs de plantilla**: `/portfolio-page/the-work/`, mezcla es/en.
- **NEWS** en el menú apunta a un post suelto de nov-2024, no a un índice.
- **Único contacto**: `quierotrabajaren@bbdomexico.com` (solo reclutamiento).

Diagnóstico: no es que "se vea viejo", es una demo de Qode con contenido de BBDO
encima, y partes de la demo nunca se retiraron.

---

## 3. Stack decidido

- **Astro** (estable actual línea 6/7 — verificar en docs.astro.build; requiere Node 22.12+).
  100% estático salvo el formulario. Sin adaptador si se mantiene estático.
- **GSAP** para animación (islas, nunca script global).
- **CMS**: PENDIENTE decidir — WordPress headless (menor fricción) vs Sanity/Storyblok (deuda cero).
- **Deploy**: Vercel / Netlify / Cloudflare Pages, con **preview por rama** (argumento clave de venta).
- TypeScript strict.

### Por qué Astro (argumento de negocio, no de dev)

- Zero-JS por defecto → carga instantánea vs. RevSlider + jQuery + plugins actuales.
- El titular es **texto HTML real** → indexable, con la animación encima.
  (Hoy el H1 vive dentro del slider y no es texto.)
- Superficie de ataque ~0 (no PHP, no plugins).
- Content Collections → cada case study es data estructurada, no página suelta.

---

## 4. Arquitectura de información propuesta

Alineada con la estructura del global (respaldo político):

```
/                    Home — plataforma "Do Big Things" localizada a MX
/the-work/           Índice filtrable (marca / industria / capacidad / año)
/the-work/[slug]     Case study individual  <- EL activo SEO real
/about/              Quiénes somos + liderazgo + pertenencia a Omnicom
/people/             (ex BBDOERS) cultura + talento
/news/               Índice real de noticias/premios  <- hoy no existe
/news/[slug]
/contact/            Formulario con routing: New Business / Careers / Prensa
/legal/*
```

Decisiones a defender:

- **Matar `/services/` y `/our-process/`** (el global no los tiene; una agencia vende con trabajo).
- **Cada caso = una URL**. Matiz sobre el diagnóstico original: los 19 casos SÍ
  tienen URL propia hoy, en `/portfolio/[slug]/`. Lo que falla es el contenido
  (37 palabras y `<h1>Portfolio</h1>` en los 19). Ver `docs/auditoria-sitio-actual.md`.
- **La sección se llama `/the-work/`**, confirmado por el cliente el 2026-08-19.
  No `/work/` como decía este brief: es el nombre que usa BBDO México.
- **Un idioma por defecto (es-MX)**, decisión explícita sobre versión EN.
- **`/news/` como índice real.**

---

## 5. El efecto firma — "video en el titular"

Réplica de la técnica del global: clips de campaña incrustados en el flujo del H1,
sentados en la línea base, atados al `em` (escalan solos, sin media queries).

**El titular se renderiza como texto real; los slots de video son `aria-hidden`.**
Eso es lo que permite tener el efecto Y el texto indexable a la vez.

Assets: clips sin audio, `muted playsinline loop`, ~600x400, <400 KB, loop limpio.
Formato AV1 con fallback H.264 (o WebM/VP9). Poster obligatorio = LCP.

Componente ya escrito: `VideoHeadline.astro` (ver sección 8).

---

## 6. Reglas de performance / SEO (NO negociables)

- **Poster image en todo `<video>`**. El LCP debe ser imagen, nunca video.
- Ningún texto a posicionar puede vivir solo dentro de un video.
- `preload="none"` + carga diferida en videos que no son el hero.
- Fallback móvil definido (4G MX: 4 videos simultáneos = rebote).
- `prefers-reduced-motion` respetado.
- Presupuesto: **hero <= 2.5 MB, LCP < 2.5s**. El diseño se diseña contra ese número.
- Migración: **mapa de redirects 301 uno-a-uno ANTES del deploy.** Innegociable.
- **Mobile-first, OBLIGATORIO.** Toda vista se trabaja desde móvil desde el
  primer momento, no se adapta después. Decidido el 2026-08-18. Una vista no
  se da por hecha hasta estar verificada en móvil: sin scroll horizontal,
  rejillas reflowadas, tipografía legible y las máscaras y proporciones
  revisadas en vertical, no solo estiradas.
  Breakpoint principal: **1024px**, el mismo que usa el global.
  Se prueban las dos orientaciones, no solo vertical. La matriz mínima:
  390x844 y 844x390 (móvil), 768x1024 y 1024x768 (tablet) y 1512x787.
  Cómo se verifica aquí: la ventana de Chrome está maximizada y macOS ignora
  el redimensionado, así que se prueba con un **iframe de ancho fijo**, que sí
  crea un viewport real y dispara las media queries. Para capturarlo cuando no
  cabe en pantalla, se le aplica `transform: scale()`: el layout interior se
  mantiene al tamaño real porque `transform` no afecta al viewport.

---

## 7. Trampas conocidas (aprendidas, no repetir)

- El `<script>` de `VideoHeadline` **NO debe llevar `is:inline`** -> rompe el import de GSAP.
  Sin `is:inline`, Astro lo bundlea y solo carga donde se usa el componente.
- En Astro 6+ las transiciones usan **`<ClientRouter />`** (antes `<ViewTransitions />`);
  el timing de eventos cambió -> probar cualquier JS que escuche `astro:page-load`.
- Assets en `public/v/…` se referencian como `/v/…` (sin `public`).
- El formulario es lo único no-estático -> decisión temprana (Netlify Forms / endpoint / Formspree).
  El flujo del global es multi-paso: topic -> región -> oficina + drag & drop de archivos.

---

## 8. Estado de los artefactos ya creados

Estos archivos ya existen (creados en la fase de propuesta). Hay que traerlos al repo:

- `VideoHeadline.astro` — componente de producción, GSAP como isla, titular
  parametrizado (words + clips + accentIndex), poster como LCP. -> va en `src/components/`.
- `bbdo-mx-prototipo.html` — prototipo autocontenido para la reunión (no va al repo).
- `jsonld-bbdo-mexico.html` — bloque JSON-LD `AdvertisingAgency` con cadena
  BBDO México -> BBDO Worldwide -> Omnicom (NYSE:OMC) + plantilla `CreativeWork`
  por caso. -> el contenido va en el `<head>` del layout, con `set:html`.

Datos a verificar antes de publicar el JSON-LD (con marketing/legal):
razón social exacta, foundingDate, si Camilo Plazas sigue como CEO tras
integración Omnicom-IPG, correo de new business.

---

## 9. Estructura objetivo del repo

```
bbdo-mx/
├── public/
│   └── v/                       clips + posters
├── src/
│   ├── components/
│   │   └── VideoHeadline.astro
│   ├── layouts/
│   │   └── Base.astro           head, meta, canonical, JSON-LD
│   ├── pages/
│   │   ├── index.astro
│   │   ├── work/[slug].astro
│   │   └── ...
│   ├── content/                 Content Collections (work, news)
│   └── styles/
│       └── tokens.css           design system -> CSS custom properties
└── astro.config.mjs
```

---

## 10. Decisiones PENDIENTES (no las tome Claude Code; son de la reunión)

- [ ] Curaduría: lista cerrada de 8–12 casos priorizados + dueño de assets.
- [x] Plataforma de marca: **adoptar "Do Big Things" localizado**. Decidido el
      2026-08-18. Es campaña global; localizarla a MX es lo correcto, no una
      desviación. El copy concreto lo sigue firmando el director creativo.
- [ ] CMS: WordPress headless vs. Sanity/Storyblok.
- [ ] Formulario: proveedor/approach.
- [ ] Aprobador único + fechas.
- [ ] Confirmar con GLOBAL que no hay plan de consolidar dominios de mercado.
- [ ] Design system: tokens en Figma (color, tipo, espaciado, motion) -> los mapeo a tokens.css.

---

## 11. Baseline a capturar ANTES de tocar el WP (irreversible si no se hace)

- [ ] Export de GSC: 16 meses (queries, páginas, CTR, impresiones).
- [ ] GA4: tráfico orgánico actual.
- [ ] Crawl completo (Screaming Frog) -> inventario de URLs con tráfico -> base del mapa de redirects.

---

## 12. Primer objetivo en Claude Code

1. Scaffold Astro (Empty + TS strict) con la estructura de la sección 9.
2. Traer `VideoHeadline.astro`, crear `tokens.css` y `Base.astro` de soporte.
3. `index.astro` con el VideoHeadline usando placeholders.
4. `npm run dev` corriendo, efecto visible.
5. Deploy con preview por rama.

NO adelantar componentes que dependan de decisiones de la sección 10.
El camino crítico es CONTENIDO (curaduría de casos), no código.
