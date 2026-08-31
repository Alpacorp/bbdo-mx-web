# BBDO México — Rediseño web · Brief técnico

> Este archivo es la memoria del proyecto. Es el primer prompt para Claude Code.
> Léelo completo antes de tocar nada.
>
> **Última revisión: 2026-08-28**, sobre `main` en `a3c4e64`. La revisión
> anterior era del 2026-08-24 y quedó 36 commits atrás: describía una estructura
> de repo que ya no existía y daba por pendiente lo que ya estaba construido.
> Si vuelve a pasar, se nota en la sección 8.

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

**Ampliación (2026-08-27), al inventariar para las redirecciones:** los diez
sitemaps del sitio actual publican **157 URLs indexables**. Solo 41 son contenido
real. Las otras **115 son páginas demo del tema que nunca se borraron** — 29 bajo
`/elements/`, 20 bajo `/portfolio-page/`, una tienda WooCommerce completa con
carrito, checkout y mi-cuenta, más `/sample-page/`, `/pagina-ejemplo/`, `/test/`
y `/coming-soon/`. Están vivas e indexadas bajo el nombre de la agencia.

---

## 3. Stack (decidido y en uso)

|              |                                                                             |
| ------------ | --------------------------------------------------------------------------- |
| Framework    | **Astro 7.2.x**, TypeScript strict. Node ≥ 22.12 (aquí corre 24.19).        |
| Adaptador    | **`@astrojs/vercel`**. Ver más abajo por qué deja de ser 100% estático.     |
| Animación    | **CSS puro.** GSAP se sacó el 2026-08-27 (ver sección 7).                   |
| Datos        | Content Collections (`work`, `news`) + módulos `.ts` tipados para el resto. |
| Sitemap      | `@astrojs/sitemap`, sin filtro.                                             |
| Deploy       | Vercel, con **preview por rama**.                                           |
| Correo       | Resend, desde `/api/contact`.                                               |
| Verificación | `npm run verify` = `astro check` + eslint + prettier + `check-tokens.mjs`.  |

**Qué es estático y qué no.** El adaptador de Vercel entra solo por el
formulario: **30 archivos HTML se prerenderizan** (29 páginas + el 404) y solo
`/contact/` y `/api/contact` se sirven en función. Esa fue la contrapartida
aceptada al decidir el formulario (sección 10).

**Peso de JavaScript: 7,7 KB gzip en todo el sitio**, repartido en diez módulos.
5,6 KB de esos son el `ClientRouter` de Astro; ningún componente propio pasa de
800 bytes.

### Por qué Astro (argumento de negocio, no de dev)

- Zero-JS por defecto → carga instantánea vs. RevSlider + jQuery + plugins actuales.
- El titular es **texto HTML real** → indexable, con la animación encima.
  (Hoy el H1 vive dentro del slider y no es texto.)
- Superficie de ataque ~0 (no PHP, no plugins).
- Content Collections → cada case study es data estructurada, no página suelta.

---

## 4. Arquitectura de información — construida

Alineada con la estructura del global (respaldo político). Esto ya no es una
propuesta: son las rutas que responden.

```
/                    Home — plataforma "Do Big Things" localizada a MX
/the-work/           Índice de los 19 casos
/the-work/[slug]     Case study individual  <- EL activo SEO real
/about/              Quiénes somos + liderazgo + pertenencia a Omnicom
/people/             (ex BBDOERS) muro de 117 + nómina buscable
/news/               Índice real de noticias  (1 nota, ver hallazgo B5)
/news/[slug]
/contact/            Formulario con routing: Nuevo negocio / Talento / Prensa
/legal/[slug]        Los cuatro avisos, vía OneTrust
/404 + [...legacy]   Catch-all de redirecciones
/robots.txt          Ruta generada, no archivo estático
```

Decisiones tomadas y por qué:

- **`/services/` y `/our-process/` no se migraron como páginas.** El global no
  las tiene y una agencia vende con trabajo. **Corregido en parte:** el método
  BBDO sí se recuperó, como sección del home y no como página (sección 7).
  Servicios sigue sin existir y es el hallazgo B1 de la auditoría.
- **Cada caso = una URL.** Matiz sobre el diagnóstico original: los 19 casos SÍ
  tienen URL propia hoy, en `/portfolio/[slug]/`. Lo que falla es el contenido
  (37 palabras y `<h1>Portfolio</h1>` en los 19). Ver `docs/auditoria-sitio-actual.md`.
- **La sección se llama `/the-work/`**, confirmado por el cliente el 2026-08-19.
  No `/work/` como decía este brief.
- **Un idioma por defecto (es-MX)**, decisión explícita sobre versión EN.

---

## 5. El efecto firma — "video en el titular"

Réplica de la técnica del global: clips de campaña incrustados en el flujo del H1,
sentados en la línea base, atados al `em` (escalan solos, sin media queries).

**El titular se renderiza como texto real; los slots de video son `aria-hidden`.**
Eso es lo que permite tener el efecto Y el texto indexable a la vez.

Assets: clips sin audio, `muted playsinline loop`, <400 KB, loop limpio.
**Cumplido el 2026-08-28:** 329 / 117 / 115 KB, recortados a 500x150 y sin la
pista AAC de 317 kbps que arrastraban. El «~600x400» del brief original no
describía nada real: los huecos van del 2,10:1 al 3,33:1, y el recorte se hace
al más ancho para que reasignar tamaños en `index.astro` no letterboxee nada.
Poster obligatorio = LCP.

**Se anima con CSS, no con GSAP** (desde 2026-08-27). Los índices del stagger se
escriben en el marcado porque el componente los conoce al renderizar. Bajo
`prefers-reduced-motion` no hay animación ni autoplay, **y el poster se pinta
sobre el slot**: antes se ocultaba el `<video>`, y como `poster` es un atributo
_del_ video, el efecto firma del sitio se veía como tres rectángulos negros.

Componente: `src/components/VideoHeadline.astro`.

---

## 6. Reglas de performance / SEO (NO negociables)

- **Poster image en todo `<video>`**. El LCP debe ser imagen, nunca video.
- Ningún texto a posicionar puede vivir solo dentro de un video.
- `preload="none"` + carga diferida en videos que no son el hero.
- Fallback móvil definido (4G MX: 4 videos simultáneos = rebote).
- `prefers-reduced-motion` respetado.
- Presupuesto: **hero <= 2,5 MB, LCP < 2,5s**. El diseño se diseña contra ese número.
  **CUMPLIDO desde el 2026-08-28.** El home descargaba 43,6 MB de vídeo y
  ahora descarga **2,46 MB**, medidos sobre el build con `encodedDataLength`,
  no estimados. El banner pasó de 32,3 MB a 2,01 en H.264 y 1,90 en AV1; los
  tres clips del titular, de 11,3 MB entre los tres a 561 KB.
- Migración: **mapa de redirects 301 uno-a-uno ANTES del deploy.** Innegociable.

### Cómo se comprime un video aquí (2026-08-28)

`ffmpeg` **no está instalado en el sistema** y ponerlo por Homebrew pide `sudo`.
Se usa el binario estático por npm, que no toca el sistema y no se guarda en
`package.json`:

```
npm i --no-save ffmpeg-static ffprobe-static
FF=./node_modules/ffmpeg-static/ffmpeg
```

Las dos codificaciones del banner, medidas contra el máster con SSIM:

```
# AV1 — 1,90 MB · SSIM 0,9959
$FF -i in.mp4 -c:v libsvtav1 -preset 6 -crf 40 -pix_fmt yuv420p \
    -an -movflags +faststart out.av1.mp4

# H.264 de respaldo — 2,01 MB · SSIM 0,9926
$FF -i in.mp4 -c:v libx264 -preset veryslow -crf 34 -pix_fmt yuv420p \
    -profile:v high -level 4.0 -an -movflags +faststart out.mp4
```

- **`-an` no es opcional.** El máster traía una pista AAC estéreo de 317 kbps
  —590 KB— que la página no reproduce nunca, porque el banner va `muted`.
- **`+faststart`** mueve el átomo `moov` al principio: la reproducción puede
  empezar antes de que llegue el archivo entero, que es lo que quieres en un
  hero.
- El original pesaba 32,3 MB a **17 Mbps**: era un export máster, no un asset
  de web. Ahí estaba el problema, no en la resolución, que se mantiene en
  1920x1080.
- Se compara con SSIM y no a ojo: `ssim=stats_file=-` sobre el clip entero.
  El peor fotograma del AV1 puntúa 0,947 y es un patrón de glitch con líneas
  de un píxel, el contenido más hostil que hay para un códec.

  **Hecho** — sección 8.

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
- **Accesibilidad: cero violaciones de axe** en las páginas principales, y se
  mantiene así. La única excepción es conocida y documentada: axe no sabe leer
  `-webkit-text-stroke` y reporta la fila en contorno de la banda cinética a
  1,04:1. Medido sobre los píxeles renderizados es 4,53:1.

---

## 7. Trampas conocidas (aprendidas, no repetir)

Estas costaron tiempo. Están aquí para que no se paguen dos veces.

### Astro y sus estilos

- **Los estilos con scope compilan `data-astro-cid-*` en LOS DOS lados del
  selector.** Un elemento que no lleve ese atributo nunca casará con la regla,
  y falla en silencio. Ha mordido tres veces, en las tres direcciones posibles:
  un `<small>` creado con `document.createElement` (no lleva atributo), un
  `<svg>` que venía de otro componente (llevaba el suyo, no el del padre — se
  arregla haciendo spread de las props que el padre pasa), y una clase
  renombrada.
- **Las variables CSS sí heredan a través del scope; los nombres de clase no.**
  Por eso `NewsCard` lee `--card-muted` en vez de saber en qué página está.
- **El servidor de desarrollo sirve CSS rancio.** Al renombrar una clase, el
  HMR actualiza el marcado y no el módulo de estilos. Antes de perseguir un bug
  de CSS, **verifícalo contra el build**. Se arregla con
  `rm -rf node_modules/.vite .astro` y reiniciar.
- **Astro descarta el espacio entre dos expresiones en líneas distintas.** Un
  `{a} {b}` que Prettier parta en dos líneas se renderiza pegado. Usa una sola
  plantilla. Se detecta leyendo el **texto renderizado del elemento**, no con
  un grep sobre el HTML: un grep casa en cualquier otro punto de la página y da
  falsa confianza.

### Navegación cliente (`<ClientRouter />`)

- **Un módulo se evalúa una sola vez; el DOM se reemplaza en cada navegación.**
  Todo script que toque el DOM va colgado de `astro:page-load` a través de
  `src/lifecycle.ts`, con teardown en `astro:before-swap` para lo que sobreviva
  a sus elementos (observers, handlers en `document`). Eran **siete** scripts,
  no uno.
- **Los atributos de `<html>` NO sobreviven al swap.** ClientRouter copia los
  del documento entrante, que viene del servidor sin clase. Se reponen en
  `astro:after-swap`. Cualquier bandera de estado va en una variable de cierre,
  no en el `<html>`.
- **El anunciador de rutas de Astro no está en la salida.** Medido a 400, 900,
  1600 y 2600 ms tras navegar: ausente siempre. Lo suple una región `aria-live`
  propia.
- Un `transition:name` repetido **desactiva la transición en silencio**.

### Layout

- Sangrado completo: `width: 100vw; margin-inline: calc(50% - 50vw)`. Es seguro
  porque `html` y `body` llevan `overflow-x: clip`.
- **`overflow: clip`, no `hidden`.** `hidden` crea un contenedor de scroll, y
  entonces `view()` dentro resuelve contra él —que nunca hace scroll— y la
  animación se queda congelada.
- `aspect-ratio` con altura automática toma un **mínimo automático basado en el
  contenido**. `overflow: clip` no lo levanta; `min-height: 0` sí.
- Orden de pintado: un `position: sticky` pinta **encima** de los bloques que le
  siguen. Para que un bloque posterior quede por encima hace falta subirlo a la
  capa posicionada.

### Otras

- **`zoompan` de ffmpeg tiembla en zooms lentos, y no hay ajuste que lo cure.**
  Recalcula el origen del recorte en cada fotograma y lo **trunca a píxeles
  enteros de la entrada**. Sobre un zoom del 8% en 12 s el paso sale irregular
  —patrón medido `1222122212221221`— con el **22% de los fotogramas sin
  moverse**. Se probó, se publicó un día y hubo que retirarlo. Un `transform`
  en CSS hace el mismo movimiento con precisión de subpíxel, en el compositor,
  sin un solo byte. **Para animar una imagen fija, CSS; ffmpeg es para
  metraje.**

- El `<script>` de un componente **no debe llevar `is:inline`** si importa algo.
- Assets en `public/v/…` se referencian como `/v/…` (sin `public`).
- `astro.config`'s `redirects` **compila sin la barra final**, y todas las URLs
  que publica WordPress la llevan. Por eso el mapa vive en `[...legacy].astro`
  y no en la config. El middleware tampoco sirve: el adaptador manda lo no
  encontrado a un `404.html` estático sin invocar función.
- **`astro check` no lee selectores de CSS.** Un renombre se verifica en el
  navegador o no se verifica.
- **El código y los commits van en inglés; el copy del sitio, `docs/` y este
  archivo, en español.** Las claves del query string de contacto son la
  excepción: son el contrato con `/api/contact` y aparecen en una URL visible.

---

## 8. Estado real — qué está construido

**30 páginas prerenderizadas** + `/contact/` y `/api/contact` en función.
19 casos, 117 personas, 26 clientes, 1 nota, 1 premio.

### Contenido y datos

- Content Collections de `work` (19) y `news` (1), con esquema Zod.
- `src/data/people.json` con las 117 personas y sus retratos; el headcount, la
  agrupación por área y el buscador se recalculan solos.
- Módulos tipados: `awards`, `clients`, `departments`, `platform`, `portraits`,
  `process`, `themes`, `organization`, `legal`, `contact-routing`, `redirects`.

### SEO e infraestructura

- **JSON-LD** `AdvertisingAgency` con la cadena BBDO México → BBDO Worldwide →
  Omnicom, en las 30 páginas. Incluye el nodo `Person` del CEO: Jorge Obregón,
  confirmado por el cliente el 2026-08-26. Camilo Plazas ya no aparece.
- **Mapa de redirecciones completo**, verificado contra las 157 URLs: 41
  redirigen 301, 115 responden **410** (no 302 al home, que es un soft 404), el
  home sigue 200 y nada da 404. Las 19 URLs de campaña se emparejaron **por el
  id de Vimeo incrustado en cada página vieja**, no por los slugs, que en varios
  casos no se parecen en nada.
- **`robots.txt` es una ruta generada**, no un archivo estático: `Allow` solo
  cuando `VERCEL_ENV` dice production, `Disallow` en todo lo demás, más un
  `noindex` en el layout bajo la misma condición. Antes los deploys de preview
  eran plenamente rastreables bajo el nombre de la agencia.
- Sitemap, canonicals, favicon set derivado del logo (`scripts/build-icons.mjs`).
- **Banner propio por caso.** Se resuelve en dos pasos: `bannerVideo` del
  frontmatter → `/v/case/<slug>.mp4` por convención. La existencia se comprueba
  en disco al construir, igual que el hermano AV1 del banner del home. **Si no
  hay ninguno, el banner no monta un `<video>`**: muestra el key visual del
  caso con un zoom lento en CSS. Ver la sección 7.

### Interacción

- **`<ClientRouter />`** con dos transiciones repartidas, porque no pueden
  convivir: **morfismo** de la tarjeta a la portada al entrar a un caso desde la
  grilla, y **la cortina** de cuatro ventanas en la navegación que no tiene
  historia propia (menú, pie, píldoras, tarjeta de noticia). La regla lee un
  atributo `data-morph` en el enlace.
- **Muro de 117 retratos** a sangre en `/people/`, decorativo y `aria-hidden`
  porque las mismas caras vuelven con nombre en la nómina de abajo.
- **Banda cinética** "DO BIG THINGS", movida por el scroll y no por un reloj.
- `ScrollFX`, fachada de Vimeo (el iframe se construye al hacer clic, no antes),
  buscador de la nómina.

### Accesibilidad

Pasada completa el 2026-08-27 con axe sobre diez páginas, más lo que un checker
no ve: enlace de salto, anunciador de rutas, foco al abrir el menú, `inert` en
el resto de la página mientras está abierto, tamaños de objetivo WCAG 2.2, y
`--color-dim` recalculado (fallaba en 76 sitios por una sola declaración).

---

## 9. Estructura real del repo

```
bbdo-mx/
├── docs/                        auditoría, redirects, referencia del global
├── public/
│   ├── v/                       clips + posters
│   └── favicon.*, icon-*.png, site.webmanifest
├── scripts/
│   ├── build-icons.mjs          deriva el set de iconos del logo
│   └── check-tokens.mjs         guardián del contrato de tokens
├── src/
│   ├── assets/                  clients/ · people/ · work/   (optimizados por Astro)
│   ├── components/              16 componentes .astro
│   ├── content/                 work/ (19) · news/ (1)
│   ├── data/people.json
│   ├── layouts/Base.astro       head, meta, canonical, JSON-LD, cortina
│   ├── pages/
│   │   ├── index · about · people · contact · 404
│   │   ├── the-work/index · the-work/[slug]
│   │   ├── news/index · news/[slug]
│   │   ├── legal/[slug]
│   │   ├── api/contact.ts       función serverless
│   │   ├── robots.txt.ts        ruta generada
│   │   └── [...legacy].astro    301 / 410
│   ├── styles/tokens.css        design system -> custom properties
│   ├── styles/sections.css
│   └── *.ts                     los módulos de datos de la sección 8
└── astro.config.mjs
```

---

## 10. Decisiones PENDIENTES (no las tome Claude Code; son de la reunión)

- [ ] Curaduría: lista cerrada de 8–12 casos priorizados + dueño de assets.
- [x] Plataforma de marca: **adoptar "Do Big Things" localizado**. Decidido el
      2026-08-18. Es campaña global; localizarla a MX es lo correcto, no una
      desviación. El copy concreto lo sigue firmando el director creativo.
      Vive en `src/platform.ts`, en un solo sitio, desde el 2026-08-28.
- [ ] CMS: WordPress headless vs. Sanity/Storyblok.
- [x] Formulario: **función serverless en Vercel**. Decidido el 2026-08-24.
      Los datos no salen de la infraestructura del cliente y no hay coste de
      terceros, a cambio del adaptador de Vercel: el sitio deja de ser
      puramente estático en dos rutas, `/contact/` y `/api/contact`.
      El envío lo hace Resend.
- [ ] **Los nombres de los cuatro pasos del Proceso BBDO.** Son las únicas
      cadenas del sitio escritas por un desarrollador y no por la agencia.
      En el sitio actual el acróstico se anuncia y no se cumple —GROWTH VALUE
      no empieza con B, CREATIVE no empieza con O—; la propuesta (Buenos
      negocios, Bravura, Disrupción, Obsesión) sí resuelve. **El director
      creativo tiene que firmarlos antes de publicar.** `sourceName` conserva
      los originales, así que revertir es una palabra.
- [ ] **La tilde de «Obregón».** Está publicado con acento en
      `src/organization.ts` y en `people.json`. Confirmar cuál es la correcta.
- [ ] Aprobador único + fechas.
- [ ] Confirmar con GLOBAL que no hay plan de consolidar dominios de mercado.
- [ ] Design system: tokens en Figma (color, tipo, espaciado, motion) -> los mapeo a tokens.css.

---

## 10 bis. Bloqueos para publicar contacto y legales

Nada de esto se arregla con código. Está construido y funcionando, pero **no
debe publicarse** hasta que la agencia resuelva estos cuatro puntos.

### 1. El aviso de privacidad no sirve para México — BLOQUEA EL FORMULARIO

Los cuatro avisos legales los sirve **OneTrust desde el tenant de Omnicom**
(`c0a325be-…`); las páginas del sitio llegan vacías y el script los inyecta.
Replicamos ese mecanismo, no el texto. Pero al revisar los manifiestos el
2026-08-24:

- Se publican **solo en inglés**: cada aviso declara un único idioma, `en-us`.
- El de privacidad es el del **RGPD europeo**. Su primer párrafo dice
  _"agencies located in ES"_ — España. **No menciona México ni una vez.**
- No contiene **LFPDPPP, derechos ARCO ni INAI**.

La LFPDPPP exige un aviso que nombre al responsable y su domicilio, los datos
tratados, las finalidades, cómo ejercer derechos ARCO y cómo revocar el
consentimiento. Un aviso de jurisdicción española en inglés no cumple nada de
eso, y el formulario enlaza a él en su casilla de consentimiento.

**Acción:** pedir a Omnicom el aviso de México en su OneTrust. Cuando exista,
aquí es cambiar un identificador en `src/legal.ts`.

### 2. Faltan dos buzones

**Pista nueva (2026-08-31):** al verificar las redes sociales apareció que
**el Facebook de la agencia publica `contacto@bbdomexico.com`**, junto al
mismo teléfono que ya tenemos. El sitio no la menciona en ninguna parte. No
resuelve el problema —sigue sin haber buzón de nuevo negocio ni de prensa—
pero una dirección general es mejor que mandar una consulta comercial al
buzón de currículums. **Confirmar con la agencia si está viva y quién la
lee**; si lo está, `src/contact-routing.ts` cambia en una línea.

La única dirección que publica el sitio es `quierotrabajaren@bbdomexico.com`,
de reclutamiento. Nuevo negocio y prensa no tienen la suya, así que hoy caen
ahí y el correo lo avisa con una franja roja y una etiqueta en el asunto. Se
declaran como `inbox: null` en `src/contact-routing.ts` en lugar de apuntarlas
calladamente a reclutamiento: una consulta de nuevo negocio perdida entre CVs
es el peor resultado posible de este sitio.

**Acción:** crear `nuevonegocio@` y `prensa@` (o las que la agencia decida) y
ponerlas en ese fichero. El aviso se apaga solo.

### 3. Resend necesita dominio verificado

Sin dominio verificado solo se puede enviar desde `onboarding@resend.dev`, que
**únicamente entrega al correo de la cuenta de Resend**. Con eso no se puede
enviar a la agencia.

**Acción:** verificar `bbdomexico.com` en Resend y poner `CONTACT_FROM` a una
dirección de ese dominio.

### 4. `CONTACT_TO_OVERRIDE` tiene que quedar vacía en producción

Es el desvío de pruebas: manda todo a una sola dirección. Si se despliega con
valor, una consulta real de nuevo negocio acabaría en un correo personal y no
llegaría nunca a la agencia.

---

## 10 ter. Tres destinos de redirección por confirmar

En `src/redirects.ts`, apuntados a la respuesta más honesta disponible pero sin
firmar por nadie:

| URL vieja               | Apunta hoy a         | Por qué hace falta confirmarlo                                                                                                |
| ----------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `/services/`            | `/about/`            | No tiene equivalente. Su página en el sitio actual son tres citas de un CEO que ya no está, más el muro de clientes otra vez. |
| `/comite-bbdo/`         | `/about/`            | Responde 200 con un `<main>` vacío. Nadie ha sabido decir qué era.                                                            |
| `/politica-privacidad/` | `/legal/privacidad/` | Quinta URL legal que nadie había inventariado. Publica la plantilla de WordPress sin editar, la que empieza «Texto sugerido». |

---

## 11. La auditoría UX/UI — 2026-08-27

Recorrido de las 29 páginas migradas contra bbdomexico.com y bbdo.com en la
misma sesión. **21 hallazgos**, de los cuales **8 son de activos, no de diseño**.
Documento completo:
`https://claude.ai/code/artifact/944ddb4c-3e07-474e-8290-f426153226ad`

> **El veredicto:** el techo del sitio hoy ya no lo pone el código. La retícula,
> la accesibilidad y el rendimiento están en orden. Lo que llega al ojo son
> materiales provisionales.

### Las cuatro fases, en dependencia estricta

El orden importa: rediseñar la grilla antes de tener key art es maquillar
fotogramas, y hacerlo después es el mismo trabajo con el triple de efecto.

**Fase 00 — Pedir los materiales.** ⛔ BLOQUEADA EN LA AGENCIA. No es trabajo de
front-end y desbloquea todo lo demás. La lista está en la sección 12.

**Fase 01 — Subir el volumen con lo que ya hay.** ✅ COMPLETA (`685f776`).
Los siete puntos: ritmo de bandas papel/rojo/negro, píldoras en lugar de enlaces
subrayados, riel de etiquetas rotadas, el guion bajo recuperado, muro de
clientes de cinco en cinco y en flex, nombres siempre visibles en BBDOers, y el
fotograma fijo como respaldo de «reducir movimiento».

**Fase 02 — Rehacer The Work.** ⛔ DEPENDE DE LA FASE 00. Sin key art no vale la
pena. Pendientes: fondo oscuro, grilla asimétrica con un caso protagonista, loop
en silencio al pasar el cursor, filtros por cliente/categoría/año. **Dos puntos
sí se hicieron**, porque no dependían de assets: la transición de vista entre la
grilla y el caso, y la portada del caso a sangre sin la cortina (`30480ef`).

**Fase 03 — Contar qué hace la agencia.** ⚠️ PARCIAL.

- ✅ **Proceso BBDO** recuperado del sitio viejo, como sección del home
  (`30b6732`). No estaba en el inventario de migración porque el menú lo enlaza
  en inglés mientras el resto de rutas van en español.
- ⛔ **Servicios**: sigue sin existir. Espera copy.
- ⛔ **Premios como palmarés real**: 1 entrada. Espera datos verificados.
- ⛔ **Resultados dentro de cada caso**: `result` está vacío en los 19.

### Los hallazgos abiertos, por qué esperan

|        | Hallazgo                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Espera                             |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| A1     | Las 19 portadas son **fotogramas de video** con bandas negras, subtítulos y leyendas legales quemadas («ENJOY RESPONSIBLY», «SUGERENCIA DE CONSUMO», un timecode). Los propios datos lo admiten: `imageAlt: 'Fotograma de la campaña…'`. Es la diferencia visual más grande contra el global.                                                                                                                                                                                   | Key art                            |
| ~~A2~~ | ~~El **póster del banner no tiene imagen**~~ — **RESUELTO el 2026-08-28.** Eran **cuatro** degradados vacíos, no uno: el del banner y los tres de los huecos del titular. Los cuatro son ahora un fotograma real de su propio vídeo, en WebP y en `t=0` para que no haya salto al arrancar. De paso apareció que `og:image` apuntaba a uno de ellos, así que **las 30 páginas compartían un degradado vacío como vista previa social**; ahora hay una cartela BBDO de 1200x630. | ~~Un fotograma real~~              |
| ~~A3~~ | ~~El **video del banner pesa 32,3 MB**~~ — **RESUELTO el 2026-08-28**: 2,01 MB en H.264 y 1,90 en AV1, sin pista de audio. Lo que queda abierto ya no es compresión: **los 19 casos abren con el mismo metraje, y ese metraje —igual que los tres clips del titular— es material provisional del sitio actual.** Ver el hallazgo nuevo A5.                                                                                                                                      | Metraje por caso                   |
| A5     | **Los tres clips del titular no contienen a sus marcas.** Se llaman `modelo`, `pepsi` y `banamex` y al abrirlos fotograma a fotograma son cartelas tipográficas del sitio actual — «THE WORK», «BBDOERS» —: ni un frame de Modelo, Pepsi o Banamex. Misma deuda que `banner-home.mp4`, que es `head-team.mp4`. Los nombres de archivo hacen creer que hay metraje de campaña donde no lo hay.                                                                                   | Clips de campaña reales            |
| ~~A4~~ | ~~Las 19 fichas **abrían con la misma cortina roja** y con el mismo metraje~~ — **RESUELTO el 2026-08-31.** Cada ficha abre con **su propio key visual y un zoom lento en CSS**, cero bytes de vídeo. No es el film de la campaña —viven en una cuenta de Vimeo sin acceso— pero es material de esa campaña, que el clip compartido nunca fue. Cuando lleguen los cortes reales: `public/v/case/<slug>.mp4` o `bannerVideo` en el frontmatter, sin tocar código.                | ~~Video por caso~~ · cortes reales |
| B1     | **No hay Servicios.** Quien entra preguntando «¿qué hacen?» no encuentra respuesta.                                                                                                                                                                                                                                                                                                                                                                                             | Copy                               |
| B3     | **Premios tiene un solo premio**, mientras la meta description dice «una de las agencias más premiadas del país». La sección contradice la frase en vez de sostenerla.                                                                                                                                                                                                                                                                                                          | Palmarés                           |
| B4     | **Ningún caso tiene resultado, categoría ni año.** Los campos existen y están vacíos: `result 0/19`, `category 0/19`, `year 1/19`. Sin resultados, cada caso son treinta palabras y un video.                                                                                                                                                                                                                                                                                   | Datos                              |
| B5     | **El collage no se ve en ninguna campaña**: el componente está construido y enlazado, pero ninguna tiene fotos. Es trabajo hecho que hoy no existe para el visitante.                                                                                                                                                                                                                                                                                                           | Fotos                              |
| B6     | **News tiene una sola nota**, de noviembre de 2024. Comunica que la agencia lleva casi dos años sin pasar nada.                                                                                                                                                                                                                                                                                                                                                                 | Notas                              |
| D3     | **The Work no tiene filtros.** Con 19 ya cuesta; con 40 será inservible. Es la misma tarea que B4: primero los campos.                                                                                                                                                                                                                                                                                                                                                          | B4                                 |

Todo el frente C (ser más conservadores que el manual global) y el resto del D
está cerrado por las fases 01 y por la pasada de accesibilidad.

---

### Por qué NO se embebe Vimeo de fondo (evaluado el 2026-08-31)

Vimeo tiene modo `background=1`, y verificado en un navegador real acepta
`loop` y `muted`. Se descartó igual, por tres razones y en este orden:

1. **Sería un iframe de terceros reproduciéndose solo en las 19 fichas.** La
   fachada de `VimeoPlayer` existe precisamente para no pagar ~1 MB de JS de
   Vimeo, ni una visita registrada, por la mayoría que nunca pulsa play. Esto
   lo revierte, en páginas a un clic del aviso de privacidad de la agencia.
2. **Acaba con `preload="none"`**: el iframe carga de inmediato y el póster
   deja de ser el LCP.
3. **Vimeo bloquea la automatización** — Chrome headless recibe un desafío de
   Cloudflare. En un repositorio donde todo se verifica contra el build, eso
   es una parte del sitio que nunca podría probarse.

Cubrir la pantalla sí es resoluble, pero a mano y por relación de aspecto,
porque `object-fit` no aplica a un iframe.

---

## 12. Las apuestas — quedar por encima del global

Lo de arriba nos pone a la par. Esto es lo que haría que la oficina de México
fuera la referencia dentro de la red. **Seis apuestas; tres están construidas.**

### ✅ La cortina como transición — HECHO (`5a14c41`)

_Medio · el activo ya existía._ La máscara de cuatro ventanas ya estaba y es
geometría oficial de marca: usarla como transición convierte un recurso
decorativo en el lenguaje de navegación del sitio. **Ninguna otra oficina de la
red lo está haciendo.**

La tensión que hubo que resolver: la cortina y el morfismo no pueden convivir en
la misma navegación —si la cortina tapa la pantalla, nadie ve crecer la
portada—. Se repartieron: cortina en el menú y el pie, morfismo al entrar a un
caso desde la grilla.

### ✅ El muro de los 117 — HECHO (`0df6766`)

_Bajo · el activo ya existía._ Era el activo más infrautilizado del sitio: 117
retratos en blanco y negro con el mismo tratamiento, usados como lista. Ahora
son una sola imagen a sangre, ~105 en pantalla a la vez. La página dice que la
agencia son 117 personas antes de que nadie lea la línea que lo dice.

### ✅ La banda cinética — HECHO (`53cbb83`)

No estaba en la lista original de apuestas; salió del inventario de recursos del
global que esta migración no había tomado. "DO BIG THINGS" sólido y en contorno,
movido por el scroll y no por un reloj: atado a `view()`, las filas viajan
exactamente lo que el lector hace scroll y se paran cuando él se para.

### ⏳ El cursor que dice VER — PENDIENTE, y no depende de nadie

_Coste bajo._ **Es la única apuesta que no espera a la agencia.** Un disco rojo
que sigue al cursor sobre la grilla de The Work y sobre el muro de clientes. Es
una microinteracción de firma y resuelve además un problema real: hoy las
tarjetas no comunican que son clicables.

Advertencia de alcance, aprendida con la etiqueta del muro: **`hover` es un
gesto de puntero y no traduce a un toque.** En móvil esto no existe, y eso es
una decisión, no una omisión.

### ⛔ Un reel de verdad — REQUIERE PRODUCCIÓN

_Coste alto._ A una agencia se la juzga por su reel. Hoy la portada es un loop
ambiental sin sonido. Un sizzle de cuarenta y cinco segundos con control de
audio, arrancando en silencio, es lo más parecido a una presentación de
credenciales que puede vivir en un sitio.

### ⛔ «Cómo lo hicimos» — EL CÓDIGO YA ESTÁ, FALTAN LAS FOTOS

_Medio · el código ya existe._ Es el hallazgo B5 leído como oportunidad. Con
fotos de proceso —bocetos, rodaje, la pieza en la calle— cada caso pasa de ser
un video incrustado a ser una historia. **Es la diferencia entre un portafolio y
un argumento.**

### ⛔ La data, con números — ACUERDO INTERNO

_Bajo en código · alto en acuerdo._ El sitio actual dice «la data nos inspira en
todo momento» y no enseña un solo dato. Una sección de proceso con cifras reales
de la agencia sería, literalmente, practicar lo que se predica.

---

## 13. La petición a la agencia — una sola lista

Esto es la fase 00. Mientras no llegue, el sitio no puede pasar de donde está.

| Para                         | Qué                                                                                                                                                   |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A cada equipo de cuenta**  | Key art de su campaña en 16:9 y 4:5. Sin bandas negras, sin subtítulos, sin leyendas legales. Si no existe, un fotograma limpio sirve mientras tanto. |
| **A post-producción**        | Ya no hace falta comprimir: se hizo aquí el 2026-08-28. Lo que sí hace falta es **metraje propio por caso**, porque los 19 abren con el mismo clip.   |
| **A dirección creativa**     | Un resultado por campaña. Una cifra, un premio o una frase de impacto. Diecinueve renglones. Y firmar los nombres del Proceso BBDO (sección 10).      |
| **A comunicación**           | El palmarés completo con año, festival y nivel. Y tres notas más para que News no parezca detenido en 2024.                                           |
| **A planning**               | Los tres pilares del Proceso BBDO escritos para publicarse, y la lista de servicios como se venden hoy.                                               |
| **A quien tenga el archivo** | Fotos de proceso de las tres o cuatro campañas más fuertes: bocetos, rodaje, la pieza en la calle.                                                    |
| **A Omnicom legal**          | El aviso de privacidad de México en OneTrust (sección 10 bis).                                                                                        |
| **A sistemas**               | Los buzones `nuevonegocio@` y `prensa@`, y `bbdomexico.com` verificado en Resend.                                                                     |

---

## 14. Baseline a capturar ANTES de tocar el WP (irreversible si no se hace)

- [ ] Export de GSC: 16 meses (queries, páginas, CTR, impresiones).
- [ ] GA4: tráfico orgánico actual.
- [ ] Crawl completo (Screaming Frog) -> inventario de URLs con tráfico.
      **Ya no es la base del mapa de redirects** —ese se hizo contra los diez
      sitemaps del sitio, 157 URLs, sección 8— pero sigue haciendo falta para
      saber cuáles de esas URLs traen tráfico de verdad.

---

## 15. Qué sigue

Por orden, y con la dependencia dicha:

1. **Mandar la lista de la sección 13.** Es lo único que desbloquea las fases 00
   y 02, y no lo puede hacer el desarrollo.
2. **Nada de vídeo.** El presupuesto de la sección 6 se cumple: 2,46 MB en el
   home. Lo que queda es contenido, no compresión — ver el hallazgo A5.
3. **El cursor VER.** La única apuesta sin dependencias externas.
4. Cuando llegue el key art: **fase 02 completa** —fondo oscuro, grilla
   asimétrica, filtros.

Nada de lo anterior toca el camino crítico real, que sigue siendo **CONTENIDO**,
no código.
