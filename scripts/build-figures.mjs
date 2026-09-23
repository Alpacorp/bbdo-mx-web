/**
 * build-figures.mjs — traces the corner figures into src/figures.ts.
 *
 *   node scripts/build-figures.mjs
 *
 * Same arrangement as build-icons.mjs and src/wordmark.ts: the outline is
 * traced from a bitmap and written out as a module, which is committed. Run
 * this again only when a source in sources/ changes.
 *
 * WHY A TRACED ENGRAVING AND NOT A DRAWING
 *   Four figures were hand-plotted as SVG paths first — an axolotl three
 *   times, Teotihuacán's feathered serpent twice. Every one failed: the
 *   axolotl came out a caterpillar, then a crocodile, then a fish with a
 *   crest, and the serpent came out a flower. The lesson is narrow and worth
 *   keeping: geometric forms can be built from coordinates and corrected by
 *   iterating, and an organic figure cannot. It has to be drawn, and then
 *   traced.
 *
 *   So this traces a real one. sources/README.md carries the provenance and
 *   the licence for each source; the short version is an 1884 wood engraving
 *   from Appleton's Guide to Mexico, public domain, no attribution required.
 *
 * WHAT THE ENGRAVING NEEDS THAT A LOGO DOES NOT
 *   A wood engraving is hatching: the body is white paper with black lines
 *   over it, so thresholding alone returns a bundle of strokes rather than an
 *   animal. Two steps fix it — a small blur to close the gaps between lines,
 *   then a flood fill inward from the border, after which anything the flood
 *   never reached is inside the animal.
 */
import { createRequire } from 'node:module';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { traceRings, simplify, ringToPath } from './lib/trace.mjs';

const sharp = createRequire(import.meta.url)('sharp');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const FIGURES = [
  {
    key: 'ajolote',
    label: 'Ajolote',
    source: 'sources/ajolote-appleton-1884.png',
    /* Below the paper, above the lightest hatching. */
    cut: 238,
    /* Enough to bridge the hatching, not enough to round the gill fronds. */
    blur: 1.2,
    /*
     * 2.4 after looking at 1.6, 2.4 and 3.2 side by side: 1.6 is 5.1 kB
     * gzipped for detail nobody sees at 7% opacity, 3.2 starts eating the
     * gill fronds, and the fronds are the whole reason this animal is
     * recognisable rather than a salamander.
     */
    tolerance: 2.4,
    /* Rings shorter than this are scanner dust, not anatomy. */
    minRing: 90,
    /*
     * The engraving faces left. Anchored in a bottom-left corner a figure
     * facing left looks off the edge of the page, so it is flipped to look
     * into the content. Done here rather than in CSS: a transform on the
     * element would also flip anything laid over it later.
     */
    flip: true,
  },
];

async function traceFigure(figure) {
  const file = path.join(ROOT, figure.source);
  let image = sharp(file).greyscale();
  if (figure.blur > 0) image = image.blur(figure.blur);
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const mask = new Uint8Array(width * height);
  for (let i = 0; i < width * height; i++) mask[i] = data[i * channels] < figure.cut ? 1 : 0;

  // Flood the paper in from the border; whatever it never reached is inside.
  const outside = new Uint8Array(width * height);
  const stack = [];
  const push = (x, y) => {
    const i = y * width + x;
    if (x < 0 || y < 0 || x >= width || y >= height || outside[i] || mask[i]) return;
    outside[i] = 1;
    stack.push(i);
  };
  for (let x = 0; x < width; x++) {
    push(x, 0);
    push(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    push(0, y);
    push(width - 1, y);
  }
  while (stack.length) {
    const i = stack.pop();
    const x = i % width;
    const y = (i / width) | 0;
    push(x + 1, y);
    push(x - 1, y);
    push(x, y + 1);
    push(x, y - 1);
  }
  for (let i = 0; i < mask.length; i++) if (!outside[i]) mask[i] = 1;

  const round = (n) => Number((n / width).toFixed(4));
  const rings = traceRings({ mask, width, height }).filter((r) => r.length > figure.minRing);

  const d = rings
    .map((ring) => {
      // Pixel-corner walk, recentred on the real edge — as in build-icons.mjs.
      const centred = ring.map(([x, y], i) => {
        const [nx, ny] = ring[(i + 1) % ring.length];
        const flipped = figure.flip ? [width - x, y] : [x, y];
        const nextFlipped = figure.flip ? [width - nx, ny] : [nx, ny];
        return [(flipped[0] + nextFlipped[0]) / 2, (flipped[1] + nextFlipped[1]) / 2];
      });
      return ringToPath(simplify([...centred, centred[0]], figure.tolerance).slice(0, -1), {
        cornerAngle: 50,
        round,
      });
    })
    .join('');

  return { d, aspect: height / width, rings: rings.length };
}

const traced = [];
for (const figure of FIGURES) traced.push({ figure, ...(await traceFigure(figure)) });

const module = `/**
 * figures.ts — the corner figures, traced.
 *
 * GENERATED by scripts/build-figures.mjs from the originals in sources/. Do
 * not edit by hand: run \`npm run figures\`. Provenance and licence for every
 * source are in sources/README.md, and why these are traced rather than drawn
 * is in the build script.
 *
 * Coordinates are fractions of the figure's own width, so \`aspect\` is the
 * height of the viewBox and any size is a matter of scaling — the same shape
 * as src/wordmark.ts.
 */

export interface Figure {
  /** Human name, for the accessible description where one is wanted. */
  label: string;
  /** Path data on a viewBox of \`0 0 1 aspect\`. */
  d: string;
  /** Height of the viewBox, the figure's width being 1. */
  aspect: number;
}

export const FIGURES = {
${traced
  .map(
    ({ figure, d, aspect }) => `  ${figure.key}: {
    label: ${JSON.stringify(figure.label)},
    aspect: ${Number(aspect.toFixed(5))},
    d: ${JSON.stringify(d)},
  },`
  )
  .join('\n')}
} as const satisfies Record<string, Figure>;

export type FigureKey = keyof typeof FIGURES;
export const FIGURE_KEYS = Object.keys(FIGURES) as [FigureKey, ...FigureKey[]];
`;

await writeFile(path.join(ROOT, 'src/figures.ts'), module);
for (const { figure, d, aspect, rings } of traced) {
  console.log(
    `${figure.key.padEnd(12)} ${String(d.length).padStart(6)} B path · ` +
      `${rings} ring(s) · aspect ${aspect.toFixed(3)}`
  );
}
console.log(`${'src/figures.ts'.padEnd(12)} ${String(Buffer.byteLength(module)).padStart(6)} B`);
