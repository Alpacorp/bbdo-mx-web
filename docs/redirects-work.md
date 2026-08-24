# Mapa de redirects 301 — casos

Generado desde el campo `slugAnterior` de la colección `work`. Si se añade
o renombra un caso, se regenera; no se mantiene a mano.

La sección 6 del brief marca el mapa uno-a-uno como innegociable antes del
deploy. Estas son las 19 URLs de caso. **Falta** el resto del sitio: el
inventario completo sale del crawl de Screaming Frog de la sección 11.

**La sección va en `/the-work/`, no en `/work/`**, por confirmación del
cliente. Coincide con el `/portfolio-page/the-work/` de hoy, así que la
parte reconocible de la URL se conserva.

| Actual                                             | Nueva                                               | Caso                                                |
| -------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- |
| `/portfolio/abi-friends-delivery/`                 | `/the-work/abi-friends-delivery/`                   | ABI – Friends Delivery                              |
| `/portfolio/bayer-alka-setzer-el-juego-de-mesa/`   | `/the-work/alka-seltzer-el-juego-de-mesa/`          | Bayer – Alka Setzer – El juego de mesa              |
| `/portfolio/bayer-aspirina-wsfak/`                 | `/the-work/aspirina-worlds-smallest-first-aid-kit/` | Bayer – Aspirina – The World Smallest First Aid Kit |
| `/portfolio/bayer-flanax-bayer-vs-bayer/`          | `/the-work/flanax-bayer-vs-bayer/`                  | Bayer – Flanax – Bayer Vs Bayer                     |
| `/portfolio/bayer-flanax-pride/`                   | `/the-work/flanax-pride/`                           | Bayer – Flanax – Pride                              |
| `/portfolio/ea-sports-el-alebrije/`                | `/the-work/ea-sports-el-alebrije/`                  | EA Sports – El Alebrije                             |
| `/portfolio/ea-sports-siempre-vivos/`              | `/the-work/ea-sports-siempre-vivos/`                | EA Sports – Siempre vivos                           |
| `/portfolio/geep-pepsi-black/`                     | `/the-work/pepsi-black-into-the-void/`              | GEPP – Pepsi Black Into the void                    |
| `/portfolio/gepp-pepsi-black-a-que-te-sabe/`       | `/the-work/pepsi-black-a-que-te-sabe/`              | GEPP – Pepsi Black ¿A qué te sabe?                  |
| `/portfolio/gepp-pepsi-sabe-a-todo/`               | `/the-work/pepsi-sabe-a-todo/`                      | GEPP – Pepsi sabe a todo                            |
| `/portfolio/pedigree-ipouchyou/`                   | `/the-work/pedigree-i-pouch-you/`                   | Pedigree – I Pouch You                              |
| `/portfolio/pedigree/`                             | `/the-work/pedigree-dogscar/`                       | Pedigree – Dogscar                                  |
| `/portfolio/pony-malta/`                           | `/the-work/pony-malta/`                             | Pony Malta                                          |
| `/portfolio/saba/`                                 | `/the-work/saba-vulvacare/`                         | Saba – Vulvacare                                    |
| `/portfolio/san-rafael-balance-escucha-tu-cuerpo/` | `/the-work/san-rafael-escucha-tu-cuerpo/`           | San Rafael Balance – Escucha tu Cuerpo              |
| `/portfolio/tostitos-sabritas/`                    | `/the-work/tostitos-sabritas/`                      | Tostitos – Sabritas                                 |
| `/portfolio/uber-mariachis/`                       | `/the-work/uber-mariachis/`                         | Uber – Mariachis                                    |
| `/portfolio/uber-pereatsfoneo/`                    | `/the-work/uber-pereatsfoneo/`                      | Uber – Pereatsfoneo                                 |
| `/portfolio/uber-que-tu-auto-aporte/`              | `/the-work/uber-que-tu-auto-aporte/`                | Uber – Que tu auto aporte                           |

## Notas

- `/portfolio-page/the-work/` → `/the-work/` (el índice).
- `/portfolio-category/branding/` → `/the-work/`. Es la única categoría que
  existe y agrupa los 19 casos, así que no aporta nada como página propia.
- Dos slugs actuales llevan erratas que NO se arrastran a las URLs nuevas:
  `/portfolio/geep-pepsi-black/` (GEEP por GEPP) y `/portfolio/pedigree/`,
  que es Dogscar pero ocupa el slug genérico de la marca, dejando a
  `/portfolio/pedigree-ipouchyou/` sin sitio natural.
- ABI – Friends Delivery es en realidad una campaña de **Stella Artois**;
  el título actual confunde la cervecera dueña con la marca anunciada.

Total: 19 redirects de caso.

## Noticias

Generado desde `previousSlug` de la colección `news`. La sección 2 del brief
marca que el menú NEWS apunta hoy a un post suelto en lugar de a un índice;
ese post es el único que existe y cambia de URL al migrar.

| Actual                                            | Nueva                                       |
| ------------------------------------------------- | ------------------------------------------- |
| `/2024/11/26/bbdo-premio-agencia-transformadora/` | `/news/bbdo-premio-agencia-transformadora/` |

Falta decidir qué pasa con `/blog/`, que existe en `page-sitemap.xml` y queda
sin destino: lo natural es 301 a `/news/`.

## Legales

Generado desde `previousPath` de `src/legal.ts`. Las cuatro existen hoy y son
indexables, pero **ninguna aparece en `page-sitemap.xml`** del sitio actual, así
que hoy solo se llega a ellas por el pie de página.

| Actual                        | Nueva                      |
| ----------------------------- | -------------------------- |
| `/aviso-de-privacidad/`       | `/legal/privacidad/`       |
| `/aviso-de-terminos-de-uso/`  | `/legal/terminos/`         |
| `/aviso-de-cookies/`          | `/legal/cookies/`          |
| `/aviso-de-alerta-de-estafa/` | `/legal/alerta-de-estafa/` |
