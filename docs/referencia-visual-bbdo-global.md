# Referencia visual — bbdo.com (global)

Capturado el 2026-08-18 leyendo estilos computados del sitio en vivo.

**Cómo leer esto.** Los valores de tipografía, color y medidas salen de
`getComputedStyle`, así que son exactos. Lo que NO pude ver es la
**composición**: el home está animado por scroll y visibilidad, y en pestaña
de segundo plano no llega a pintar (sale el rojo del hero y poco más). El
ritmo vertical, los tiempos de transición y la sensación general los tienes
que juzgar tú a ojo.

## Tipografía

|                | Global (bbdo.com)                        | Nuestro scaffold hoy    |
| -------------- | ---------------------------------------- | ----------------------- |
| Display        | **Outfit**, weight 600                   | Anton, weight 400       |
| Texto          | Inter / InterVariable                    | Inter                   |
| Titular        | 137px, line-height 140px (~1.02)         | 139px, line-height 0.88 |
| letter-spacing | `normal`                                 | `-0.015em`              |
| text-transform | `none` (las mayúsculas vienen del texto) | `uppercase`             |

**Outfit es el cambio más grande.** El prototipo eligió Anton como parecido,
pero el global usa Outfit 600, que es bastante menos condensada. Outfit está
en Google Fonts, así que no hay problema de licencia. Cambiarla toca
`--font-display` en `tokens.css` y hay que rehacer los cálculos de la máscara
del titular, que están calibrados contra la tinta de Anton.

Ojo con el `line-height`: ellos usan ~1.02, nosotros 0.88. Ese 0.88 es la
causa de que las líneas se solapen y de todo el trabajo de máscara que hice.
Con 1.02 el problema desaparece solo.

## Color

| Rol                     | Valor                        |
| ----------------------- | ---------------------------- |
| Rojo de marca           | `rgb(255, 0, 0)` — rojo puro |
| Fondo claro             | `#FAFAFA`                    |
| Texto sobre claro       | `rgb(64, 64, 64)`            |
| Oscuros                 | `#161616`, `#212121`         |
| Texto sobre rojo/oscuro | `#FAFAFA`                    |

Nuestro `tokens.css` usa `#E4002B`, heredado del prototipo. **No coincide.**
Antes de cambiarlo hay que confirmar con el director creativo cuál es el rojo
correcto para MX: el `#FF0000` del global es una decisión de marca, no un
descuido, pero puede que MX tenga el suyo.

El hero va sobre rojo pleno (`section.contact-section`), con el fondo general
del sitio en claro. Nuestro scaffold hoy es al revés: fondo oscuro.

## El efecto firma, como está hecho de verdad

El titular es `h2.main-title` y los clips son `<span class="contact-video">`
intercalados en el texto:

```html
<h2 class="main-title">
  WE ARE
  <span class="contact-video open-modal" data-video="...chase-cars-preview-home_Opt.mp4">
    <video autoplay loop muted playsinline>
      <source src="...chase-cars-preview-home_Opt.mp4" type="video/mp4" />
    </video>
  </span>
  <span class="contact-video large-wide open-modal" data-video="...">...</span>
  ...
</h2>
```

Medidas de los slots, con el titular a 137px:

| Slot         | Medida       | En `em`        |
| ------------ | ------------ | -------------- |
| normal       | 233 × 111 px | 1.70 × 0.81 em |
| `large-wide` | 370 × 111 px | 2.70 × 0.81 em |
| tercero      | 288 × 111 px | 2.10 × 0.81 em |

- `border-radius: 16px` → **0.117em** (nosotros: 0.08em)
- `vertical-align: baseline` (nosotros: `bottom`)
- `overflow: hidden`, `display: inline-block`, `margin: 0`
- **Anchos variables por clip**, no uno fijo. Nosotros usamos 1.55em fijo con
  hover a 2.4em. La altura sí coincide casi exacta: 0.81em contra nuestro 0.78em.

### Diferencias que NO debemos copiar

1. **Los videos no llevan `poster`, van con `autoplay` y `preload` por
   defecto (auto).** Uno de ellos se llama literalmente `video-pesado.mp4` y
   mide 1465×755. Esto viola de frente la sección 6 del brief: poster
   obligatorio, LCP imagen, `preload="none"` fuera del hero. Nuestro
   componente ya lo hace bien; hay que mantenerlo así aunque el global no.
2. **La página no tiene ni un `<h1>`.** El titular es `h2`. Nosotros usamos
   `h1`, que es lo correcto y además es medio argumento del rediseño.
3. Los slots **no** son `aria-hidden`. Los nuestros sí, que es lo accesible.

### Diferencia que sí hay que decidir

Los slots del global son **interactivos**: `open-modal` + `data-video` abren
un modal con el video completo del caso. Los nuestros son decorativos, con un
hover que los ensancha. Es una decisión de producto, no de CSS: convierte el
titular en un punto de entrada a los casos.

## Arquitectura de información del global

URLs reales encontradas: `/`, `/about/`, `/work/`, `/work/[slug]`, `/news/`.

Confirma la sección 4 del brief: **no existen `/services/` ni `/our-process/`**,
así que matarlas tiene respaldo. Dos matices:

- **No hay `/people/`.** La sección 4 lo propone como destino de BBDOERS
  diciendo que está "alineada con la estructura del global". No lo está.
- **No hay `/contact/`.** El contacto es un modal dentro del home, con el
  flujo multi-paso que describe la sección 7: "Select a topic" → "Select a
  region" → "Tell us about yourself".

Slugs de casos: `/work/pepsi-2/`, `/work/budweiser-2/`, `/work/mcdonalds-france/`,
`/work/skinny/`, `/work/whiskas/`. Son por marca. Los sufijos `-2` son
colisiones de slug de WordPress: un defecto, no un patrón a imitar.

Tarjeta de caso en el home: marca como `h2` (32px, weight 400) y campaña como
`h3` debajo. Ejemplos: Pepsi / "The Choice", Budweiser / "American Icons",
McDonald's France / "Happy Doggy", Skinny / "Ads In My Phone Calls",
WHISKAS® / "Lucky Cat".

Titular del home: **"WE ARE BBDO WE DO BIG THINGS"**, con los clips
intercalados entre las palabras.
