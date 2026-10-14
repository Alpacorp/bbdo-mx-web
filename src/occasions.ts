/**
 * occasions.ts — dated moments the site dresses up for: an anniversary, a
 * campaign launch, an award night, Día de Muertos.
 *
 * An occasion is only a window of time with a name. What changes during it is
 * written where it changes, with <Occasion> (src/components/Occasion.astro):
 * the usual content in its default slot, the occasion's in `on`. Any section,
 * line or image can be swapped this way, and the same occasion can swap as
 * many of them as it needs. Adding one is an entry here and an <Occasion>
 * wherever it shows; nothing else.
 *
 * DECIDED IN THE BROWSER, NOT AT BUILD TIME
 *   The site is static: a check against the build's clock would only flip if
 *   someone happened to deploy on the first day, and would never flip back. So
 *   the windows below go to the inline script in Base.astro, which compares
 *   them with the visitor's clock before first paint and lists the active ones
 *   in <html data-occasion="…">. The CSS from `occasionStyles()` hangs off
 *   that attribute, so each occasion starts and ends on its own, with no deploy
 *   on either side. A script that needs to know can read the same attribute.
 *
 *   The bounds are instants, written with Mexico City's offset. Mexico has had
 *   no daylight saving since 2022, so -06:00 is right all year.
 *
 * PREVIEW
 *   `?ocasion=<id>` turns that occasion on for the rest of the tab's session,
 *   whatever the date; `?ocasion=0` turns the preview off. That is how one is
 *   reviewed before it starts, on any deploy, without touching this file.
 */

export interface Occasion {
  /** Lowercase and hyphenated: it goes into the URL and into a CSS selector. */
  id: string;
  /** First instant, Mexico City time. */
  start: string;
  /** First instant AFTER it. */
  end: string;
}

export const OCCASIONS = [
  /* BBDO México's 50th: 9-12 October 2026. src/anniversary.ts has the rest. */
  { id: 'aniversario-50', start: '2026-10-09T00:00:00-06:00', end: '2026-10-13T00:00:00-06:00' },
] as const satisfies readonly Occasion[];

export type OccasionId = (typeof OCCASIONS)[number]['id'];

/**
 * The CSS that swaps every <Occasion> on the page, written out once per
 * occasion because a selector cannot compare two attributes with each other.
 */
export function occasionStyles(): string {
  return OCCASIONS.map(({ id }) => {
    const on = `html[data-occasion~="${id}"] [data-occasion-of="${id}"]`;
    return `${on}>.occasion__usual{display:none}${on}>.occasion__on{display:contents}`;
  }).join('');
}
