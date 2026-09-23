/**
 * trace.mjs — bitmap outline tracing, shared by the build scripts.
 *
 * Lifted verbatim out of build-icons.mjs when a second thing needed tracing
 * (the axolotl in build-figures.mjs). Nothing here changed in the move, and
 * the proof is that regenerating src/wordmark.ts afterwards produced a
 * byte-identical file.
 *
 * The walk runs along pixel corners, so callers step to the midpoint of each
 * unit segment to recentre the outline on the real edge — see either caller.
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
export { traceRings, deviation, simplify, turn, ringToPath };
