/**
 * build-icons.mjs — derives the whole favicon set from the brand mark.
 *
 * The BBDO wordmark only exists in this repo as a bitmap (public/v/logo-bbdo.png),
 * so the outline is traced from that file's alpha channel instead of being
 * redrawn by hand: the silhouette stays exactly the brand's, and the icons can be
 * regenerated if the logo asset is ever replaced.
 *
 *   node scripts/build-icons.mjs
 *
 * Writes public/favicon.svg, public/favicon.ico, public/apple-touch-icon.png,
 * public/icon-192.png, public/icon-512.png, public/icon-maskable-512.png and
 * public/site.webmanifest. All of them are committed; this script is only run
 * again when the source logo or the tile design changes.
 *
 * WHY A TILE AND NOT THE BARE WORDMARK
 *   The wordmark is 3.5:1. Dropped into a 16px favicon it is 16x4.6 and reads as
 *   a red smudge on whatever the browser paints behind it. Reversed out of a
 *   solid red tile it keeps the one asset that survives at that size — the red —
 *   and works on light and dark tab strips without a colour-scheme swap.
 */
import { createRequire } from 'node:module';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const sharp = createRequire(import.meta.url)('sharp');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = path.join(ROOT, 'public/v/logo-bbdo.png');
const OUT = path.join(ROOT, 'public');

/** BBDO red — must stay in step with --color-red in src/styles/tokens.css. */
const RED = '#ff0000';
/**
 * The site's own background, --color-paper. It doubles as the browser-chrome
 * tint: theme-color is meant to continue the page, not to advertise the brand,
 * and the red tile already does the advertising.
 */
const PAPER = '#fafafa';

/* ---------------------------------------------------------------- tracing */

/**
 * Reads the logo and returns its alpha as a binary mask cropped to the ink.
 */
async function readMask(file) {
  const { data, info } = await sharp(file)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const at = (x, y) => data[(y * width + x) * channels + 3] > 128;

  let x0 = width,
    y0 = height,
    x1 = -1,
    y1 = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!at(x, y)) continue;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }
  if (x1 < 0) throw new Error(`${file} has no opaque pixels`);

  const w = x1 - x0 + 1;
  const h = y1 - y0 + 1;
  const mask = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) mask[y * w + x] = at(x0 + x, y0 + y) ? 1 : 0;
  }
  return { mask, width: w, height: h };
}

/**
 * Walks the boundary between opaque and transparent pixels and returns one
 * closed ring per connected outline, in pixel-corner coordinates.
 *
 * Every ink pixel contributes its unpaired sides as directed unit segments,
 * oriented so the ink is always on the same hand. Chaining them start-to-end
 * therefore closes exactly the outlines, with no marching-squares ambiguity to
 * resolve except where two blobs meet at a single corner.
 */
function traceRings({ mask, width, height }) {
  const ink = (x, y) => x >= 0 && y >= 0 && x < width && y < height && mask[y * width + x] === 1;
  const key = (x, y) => y * (width + 1) + x;

  const outgoing = new Map();
  const push = (ax, ay, bx, by) => {
    const k = key(ax, ay);
    const list = outgoing.get(k);
    if (list) list.push([bx, by]);
    else outgoing.set(k, [[bx, by]]);
  };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!ink(x, y)) continue;
      if (!ink(x, y - 1)) push(x, y, x + 1, y);
      if (!ink(x + 1, y)) push(x + 1, y, x + 1, y + 1);
      if (!ink(x, y + 1)) push(x + 1, y + 1, x, y + 1);
      if (!ink(x - 1, y)) push(x, y + 1, x, y);
    }
  }

  const rings = [];
  for (const [start] of outgoing) {
    while (outgoing.get(start)?.length) {
      const ring = [];
      let cx = start % (width + 1);
      let cy = (start - cx) / (width + 1);
      let dx = 0;
      let dy = 0;
      do {
        const list = outgoing.get(key(cx, cy));
        if (!list?.length) throw new Error(`open outline at ${cx},${cy}`);
        // Where two blobs touch corner to corner, two segments leave the same
        // vertex. Carrying straight on keeps each blob's outline intact.
        let pick = 0;
        if (list.length > 1) {
          const straight = list.findIndex(([nx, ny]) => nx - cx === dx && ny - cy === dy);
          if (straight >= 0) pick = straight;
        }
        const [nx, ny] = list.splice(pick, 1)[0];
        ring.push([cx, cy]);
        dx = nx - cx;
        dy = ny - cy;
        cx = nx;
        cy = ny;
      } while (key(cx, cy) !== start);
      rings.push(ring);
    }
  }
  return rings;
}

/** Perpendicular distance from p to the segment ab. */
function deviation(p, a, b) {
  const vx = b[0] - a[0];
  const vy = b[1] - a[1];
  const len = Math.hypot(vx, vy);
  if (len === 0) return Math.hypot(p[0] - a[0], p[1] - a[1]);
  return Math.abs(vx * (a[1] - p[1]) - vy * (a[0] - p[0])) / len;
}

/** Ramer–Douglas–Peucker, iterative so long rings cannot blow the stack. */
function simplify(points, tolerance) {
  if (points.length < 3) return points.slice();
  const keep = new Uint8Array(points.length);
  keep[0] = keep[points.length - 1] = 1;
  const spans = [[0, points.length - 1]];
  while (spans.length) {
    const [lo, hi] = spans.pop();
    let worst = 0;
    let index = -1;
    for (let i = lo + 1; i < hi; i++) {
      const d = deviation(points[i], points[lo], points[hi]);
      if (d > worst) {
        worst = d;
        index = i;
      }
    }
    if (index < 0 || worst <= tolerance) continue;
    keep[index] = 1;
    spans.push([lo, index], [index, hi]);
  }
  return points.filter((_, i) => keep[i] === 1);
}

/** Interior turn at b, in degrees. 0 means the outline carries straight on. */
function turn(a, b, c) {
  const cross = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]);
  const dot = (b[0] - a[0]) * (c[0] - b[0]) + (b[1] - a[1]) * (c[1] - b[1]);
  return Math.abs((Math.atan2(cross, dot) * 180) / Math.PI);
}

/**
 * Emits a ring as SVG path commands, curving through the vertices that sit on
 * an arc and keeping the ones that are real corners sharp.
 *
 * Simplification alone leaves the bowls and the O as visible polygons, and no
 * tolerance fixes that without ballooning the point count: the fix is to treat
 * a run of gentle turns as a curve. Catmull-Rom through those points, written
 * out as cubics, restores the arcs at a fraction of the vertices.
 */
function ringToPath(ring, { cornerAngle, round }) {
  const n = ring.length;
  const corner = ring.map(
    (p, i) => turn(ring[(i - 1 + n) % n], p, ring[(i + 1) % n]) > cornerAngle
  );
  // With no corner at all — a circle — any vertex will do as the seam.
  if (!corner.some(Boolean)) corner[0] = true;

  const at = (i) => ring[((i % n) + n) % n];
  const start = corner.indexOf(true);
  let d = `M${round(at(start)[0])} ${round(at(start)[1])}`;

  for (let k = 0; k < n; k++) {
    const i = start + k;
    const p0 = at(i);
    const p1 = at(i + 1);
    // A segment between two corners is a straight edge of the letterform.
    if (corner[((i % n) + n) % n] && corner[(((i + 1) % n) + n) % n]) {
      d += `L${round(p1[0])} ${round(p1[1])}`;
      continue;
    }
    // Clamp the tangents at corners so the curve stops there instead of
    // rounding through them.
    const before = corner[((i % n) + n) % n] ? p0 : at(i - 1);
    const after = corner[(((i + 1) % n) + n) % n] ? p1 : at(i + 2);
    const c1 = [p0[0] + (p1[0] - before[0]) / 6, p0[1] + (p1[1] - before[1]) / 6];
    const c2 = [p1[0] - (after[0] - p0[0]) / 6, p1[1] - (after[1] - p0[1]) / 6];
    d += `C${round(c1[0])} ${round(c1[1])} ${round(c2[0])} ${round(c2[1])} ${round(p1[0])} ${round(p1[1])}`;
  }
  return d + 'Z';
}

/**
 * Traces the logo into a path whose coordinates are fractions of the mark's
 * width, so it can be dropped into any tile by scaling alone.
 *
 * `tolerance` is in source pixels against a 573px-wide mark; the largest place
 * these icons are ever drawn is the 512px app icon, where the mark is 400px, so
 * a pixel here is comfortably under one there.
 */
async function markPath({ tolerance = 1.6, cornerAngle = 50 } = {}) {
  const mask = await readMask(SOURCE);
  const round = (n) => Number((n / mask.width).toFixed(4));
  const rings = traceRings(mask);
  const d = rings
    .map((ring) => {
      // The walk runs along pixel corners, so it hugs the outside of every
      // staircase and inflates curves by about half a pixel. Stepping to the
      // midpoint of each unit segment recentres the outline on the real edge.
      const centred = ring.map(([x, y], i) => {
        const [nx, ny] = ring[(i + 1) % ring.length];
        return [(x + nx) / 2, (y + ny) / 2];
      });
      return ringToPath(simplify([...centred, centred[0]], tolerance).slice(0, -1), {
        cornerAngle,
        round,
      });
    })
    .join('');
  return { d, aspect: mask.height / mask.width, rings: rings.length };
}

/* ------------------------------------------------------------------ tiles */

/**
 * A red tile with the wordmark reversed out of it.
 *
 * @param markWidth fraction of the tile the wordmark spans
 * @param radius    corner radius as a fraction of the tile; 0 is full bleed,
 *                  which is what iOS and Android want since they apply their
 *                  own mask on top
 */
function tile(mark, { markWidth, radius }) {
  const S = 64;
  const w = S * markWidth;
  const h = w * mark.aspect;
  const x = (S - w) / 2;
  const y = (S - h) / 2;
  const round = (n) => Number(n.toFixed(3));
  const corner = radius > 0 ? ` rx="${round(S * radius)}"` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}" role="img" aria-label="BBDO">
  <rect width="${S}" height="${S}"${corner} fill="${RED}"/>
  <path transform="translate(${round(x)} ${round(y)}) scale(${round(w)})" d="${mark.d}" fill="#fff"/>
</svg>
`;
}

/** Rasterises an SVG string at a given square size. */
const raster = (svg, size) =>
  sharp(Buffer.from(svg), { density: 384 })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toBuffer();

/** Flattens onto red, so icons that get masked have no transparent edge. */
const opaque = (svg, size) =>
  sharp(Buffer.from(svg), { density: 384 })
    .resize(size, size)
    .flatten({ background: RED })
    .png({ compressionLevel: 9 })
    .toBuffer();

/**
 * Packs PNGs into an .ico. Every browser still shipping — and Google's favicon
 * crawler, which only ever asks for /favicon.ico — reads PNG-in-ICO.
 */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  let offset = 6 + images.length * 16;
  const entries = images.map(({ size, data }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    return entry;
  });

  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

/* ------------------------------------------------------------------- main */

const mark = await markPath();

// Tabs and bookmarks: rounded, so the tile reads as a deliberate icon rather
// than a failed image at 16px.
const tabTile = tile(mark, { markWidth: 0.78, radius: 0.125 });
// Home screens: full bleed, because iOS and Android round it themselves.
const appTile = tile(mark, { markWidth: 0.78, radius: 0 });
// Adaptive icons crop to the inscribed circle of the middle 80%; the wordmark
// has to fit inside that circle, corners included.
const maskableTile = tile(mark, { markWidth: 0.7, radius: 0 });

const icoSizes = [16, 32, 48];
const icoImages = await Promise.all(
  icoSizes.map(async (size) => ({ size, data: await raster(tabTile, size) }))
);

const manifest = {
  name: 'BBDO México',
  short_name: 'BBDO',
  lang: 'es-MX',
  start_url: '/',
  display: 'browser',
  background_color: PAPER,
  theme_color: PAPER,
  icons: [
    { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
};

const written = [
  ['favicon.svg', tabTile],
  ['favicon.ico', ico(icoImages)],
  ['apple-touch-icon.png', await opaque(appTile, 180)],
  ['icon-192.png', await opaque(appTile, 192)],
  ['icon-512.png', await opaque(appTile, 512)],
  ['icon-maskable-512.png', await opaque(maskableTile, 512)],
  ['site.webmanifest', JSON.stringify(manifest, null, 2) + '\n'],
];

for (const [name, body] of written) {
  await writeFile(path.join(OUT, name), body);
  const bytes = Buffer.isBuffer(body) ? body.length : Buffer.byteLength(body);
  console.log(`${name.padEnd(24)} ${String(bytes).padStart(7)} B`);
}
console.log(`\ntraced ${mark.rings} outline(s), aspect ${mark.aspect.toFixed(3)}`);
