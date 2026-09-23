/**
 * pattern.ts — the ground the sections sit on.
 *
 * A greca: the fret that covers the palace walls at Mitla, in Oaxaca. Not a
 * border on them — the walls ARE this, tens of thousands of cut stones set
 * into bands, with no mortar holding any of it.
 *
 * WHY A GRECA AND NOT THE OTHER FOUR
 *   Five candidates were drawn and looked at on the real grounds: this, a
 *   stepped greca, petatillo (the over-under of a woven palm mat), tezontle
 *   (the pore structure of the volcanic rock), and celosía (the pierced
 *   concrete screen of every Mexican modernist building). Every one of them is
 *   a MATERIAL or what gets cut into one, which is the rule the palette
 *   follows too — cal, obsidiana, tezontle and cantera are all materials.
 *   Nothing figurative. Papel picado is the Mexico of the tourist.
 *
 *   The brief was "subtle but identifiable", and those two pull against each
 *   other. What settles it is scale:
 *
 *     motifs WITH STRUCTURE    only identifiable large. Small, they are noise.
 *     TEXTURES                 only work small. Large they fall apart — the
 *                              tezontle at x3 is polka dots, the petatillo is
 *                              loose dashes.
 *
 *   And a texture at small scale identifies as NOTHING. Tezontle at 7% is
 *   paper grain; it could come from anywhere. So "subtle and identifiable" is
 *   only reachable with a structured motif, which ruled out both textures —
 *   they were the nicest surfaces of the five and they say nothing.
 *
 *   Between the two grecas: a stepped zigzag reads as geometry, but it could
 *   be Navajo, Greek or Andean. THE HOOK IS THE PART THAT IS NOBODY ELSE'S.
 *   That is the whole difference between a pattern that says "geometric" and
 *   one that says where it is from.
 *
 * IT IS PAINTED IN THE GROUND'S OWN INK
 *   The tile is a mask, not an image, and what shows through it is
 *   `--color-fg` — so one definition serves all five case palettes and the
 *   site's own paper and dark, instead of a light variant and a dark variant
 *   drifting apart. A new theme gets the greca for free.
 *
 * IT NEVER GOES OVER MEDIA
 *   Learned the hard way while prototyping: dropped on a wrapper that included
 *   the case banner, it painted a fret across a playing video. The greca
 *   belongs to the section GROUND. Everywhere it is used it goes on the
 *   element that paints the background, underneath the content, never on a
 *   container that also holds an image.
 */
import { THEMES, contrast, backgroundsOf, type Theme } from './themes';

/** The tile, on its own grid. 48x24 so the bands stack every 24px. */
export const GRECA = {
  width: 48,
  height: 24,
  /**
   * A continuous baseline with a fret hooking up out of it, once per tile.
   * Butt caps and mitred joins: a greca is cut stone, and a rounded corner
   * would be the one thing in it that could not be.
   */
  path: 'M0 21h48M30 21V9H18v6h6',
  stroke: 2.6,
} as const;

/**
 * How much of the ink shows. Every point of this costs text contrast, so it
 * is validated below rather than chosen by eye.
 */
export const GRECA_OPACITY = 0.07;

/** The tile as a data URI, ready for `mask-image`. */
export function grecaMask(): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${GRECA.width}" height="${GRECA.height}" ` +
    `viewBox="0 0 ${GRECA.width} ${GRECA.height}">` +
    `<path d="${GRECA.path}" fill="none" stroke="#000" stroke-width="${GRECA.stroke}" ` +
    `stroke-linecap="butt" stroke-linejoin="miter"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/* --- Validation ----------------------------------------------------------- */

/*
 * A PATTERN BEHIND TEXT SPENDS CONTRAST, so this is the same bargain as the
 * palette check in themes.ts: raise GRECA_OPACITY past what the darkest ground
 * can carry and `astro build` fails, instead of shipping a page that is a
 * little bit harder to read for everyone and measurably worse for some.
 *
 * Where the greca paints, the ground is no longer the flat background: it is
 * the background with the text colour laid over it at GRECA_OPACITY. That
 * blend is what text actually sits on, so that is what gets measured — for
 * both ends of every gradient, the same way the palettes are measured.
 *
 * There is room for this, and the room is not an accident. When the palettes
 * were corrected, text was landing between 7:1 and 16:1 against a 4.5 floor,
 * and that headroom was noted as going unused. This is it being used.
 */

const AA_BODY = 4.5;

function toRgb(hex: string): [number, number, number] {
  const h = hex.slice(1);
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
}

/** The ground under the ink, where the pattern paints. */
function blend(background: string, ink: string, alpha: number): string {
  const [b, i] = [toRgb(background), toRgb(ink)];
  return (
    '#' +
    b
      .map((v, n) =>
        Math.round(v * (1 - alpha) + i[n] * alpha)
          .toString(16)
          .padStart(2, '0')
      )
      .join('')
  );
}

/**
 * The site's own ground, which is not a case palette and so is not in THEMES.
 * Kept in step with --color-paper and --color-ink in src/styles/tokens.css.
 */
const SITE = { background: '#FAFAFA', text: '#111111' };

const grounds: [string, string, string][] = [
  ['site', SITE.background, SITE.text],
  ...Object.entries(THEMES).flatMap(([key, theme]) =>
    backgroundsOf(theme as Theme).map(
      (background, i, all) =>
        [
          all.length > 1 ? `${key}[${i ? 'to' : 'from'}]` : key,
          background,
          (theme as Theme).text,
        ] as [string, string, string]
    )
  ),
];

for (const [name, background, text] of grounds) {
  const ratio = contrast(text, blend(background, text, GRECA_OPACITY));
  if (ratio < AA_BODY) {
    throw new Error(
      `The greca at ${Math.round(GRECA_OPACITY * 100)}% puts text on "${name}" at ` +
        `${ratio.toFixed(2)}:1, under the ${AA_BODY}:1 WCAG AA needs for body text. ` +
        'Lower GRECA_OPACITY, or leave the greca off that ground.'
    );
  }
}
