/**
 * capabilities.ts — what the agency does, and a pictogram for each.
 *
 * Deliberately a CLOSED list, for the same reason src/themes.ts is one: a free
 * string across 19 cases edited by several people ends up as "Social", "social
 * media", "Redes" and "RRSS", four labels for one thing and four cache misses
 * for any future filter. Adding a capability means editing this file.
 *
 * WHERE THE LIST COMES FROM — 2026-09-22
 *   bbdomexico.com/services/, read on this date. The page declares ELEVEN
 *   things in two groups, and they are not the same kind of thing:
 *
 *     Flare · War Design · Joystick · Proximity · Pulse · Influence
 *     Social Media · Content Strategy · SEO · Creative Automation ·
 *     Desarrollo Digital
 *
 *   The first six are unit or sister-brand names, not capabilities. They are
 *   NOT in this file. See THE SIX UNITS below.
 *
 *   The five in the second group are capabilities and all five are here, with
 *   the site's exact wording kept in `sourceName`.
 *
 *   Those five are a digital-marketing list, and they do not describe the 19
 *   cases, which are mostly film and brand platform work. `film`,
 *   `plataforma` and `activacion` are therefore derived from the work itself
 *   rather than from the services page. They have no `sourceName`, which is
 *   how this file distinguishes what the agency already says from what a
 *   developer inferred — the same split process.ts makes between `sourceName`
 *   and `name`. The three derived ones need the creative director before they
 *   ship.
 *
 * THE SIX UNITS — PENDING, THE AGENCY HAS TO ANSWER THIS
 *   /services/ is eleven logos and not one line of copy. /about-us/ does not
 *   mention any of the six either. So this repo does not know what Flare, War
 *   Design, Joystick, Pulse or Influence are, and nothing here should pretend
 *   it does. Proximity is Omnicom's CRM and data agency — that one is certain;
 *   the other five are unconfirmed.
 *
 *   They are left out on purpose rather than guessed at. Questions for the
 *   agency: what is each one, is it an internal unit or a separate company,
 *   and does it belong on the new site at all? The audit already proposes
 *   killing /services/ with a 301 to /work/, so nothing breaks while this is
 *   open.
 *
 * WHY PICTOGRAMS, AND WHY THESE
 *   Lance Wyman's system for the Mexico City Metro, which is the reason the
 *   Metro is legible to someone who cannot read: every station is a drawing of
 *   ONE CONCRETE THING — the grasshopper at Chapultepec, the aqueduct at
 *   Insurgentes — never a monogram and never an abstract mark.
 *
 *   That rule is what disqualified the six units above. A pictogram of "Pulse"
 *   would be a logo, not a sign. Every entry below draws something, and
 *   `draws` records what, so the next person to touch one knows what they are
 *   editing and does not quietly turn it into a generic app icon.
 *
 *   It is also the reason this set stops at eight. Wyman's silhouettes work
 *   because no two are confusable at a glance; past a dozen marks on one
 *   grid, the distinctions go before the labels do.
 *
 * DRAWING RULES
 *   24x24 grid. Filled silhouettes in `d`; `lines` is for the forms that are
 *   honestly lines — a chevron and a ray are strokes, and faking them as
 *   outlines gives them a wobble a Wyman mark never has. Weight is fixed at
 *   PICTOGRAM_STROKE for every stroked form, mitred and butt-capped, because a
 *   set with two line weights reads as two sets.
 *
 *   `rule` is the fill rule and it is explicit per pictogram, never guessed:
 *   'evenodd' where a subpath is meant to punch a hole, 'nonzero' where
 *   subpaths are meant to merge. Getting it backwards does not error, it just
 *   silently eats half the drawing.
 */

/** Stroke weight for every line-built pictogram. One set, one weight. */
export const PICTOGRAM_STROKE = 2.6;

/** The grid every pictogram is drawn on. */
export const PICTOGRAM_SIZE = 24;

export interface Capability {
  /** Display label. Spanish, because the site is Spanish. */
  label: string;
  /**
   * The wording on bbdomexico.com/services/, verbatim, when the capability
   * comes from there. Absent means it was derived from the 19 cases and is
   * PENDING the creative director.
   */
  sourceName?: string;
  /**
   * What the pictogram is a drawing of. Not decoration: it is the Wyman rule
   * written down, and the check on whether a redraw is still the same sign.
   */
  draws: string;
  /** Filled path on the 24x24 grid. */
  d?: string;
  /** Stroked path on the same grid, at PICTOGRAM_STROKE. */
  lines?: string;
  /** Fill rule for `d`. Explicit on purpose — see DRAWING RULES. */
  rule?: 'evenodd' | 'nonzero';
}

export const CAPABILITIES = {
  film: {
    label: 'Film',
    draws: 'A strip of film: perforations down both edges, one frame between.',
    rule: 'evenodd',
    d: 'M1 4h22v16H1zM3.5 6.5h3v3h-3zM3.5 14.5h3v3h-3zM17.5 6.5h3v3h-3zM17.5 14.5h3v3h-3zM8.5 7h7v10h-7z',
  },

  plataforma: {
    label: 'Plataforma de marca',
    draws:
      'Blocks laid up: one wide foundation, two courses on it, one on top. A ' +
      'brand platform is the one foundation several campaigns get built on, ' +
      'and stacked stone is how that gets built here.',
    // FOUR DRAFTS, AND THE THREE THAT DIED ARE THE USEFUL PART OF THIS COMMENT.
    // Each one was legible; each one was legible as something else, and the
    // something else is what a reader would have walked away with.
    //
    //   circle on a column       JOYSTICK — and Joystick is the name of one of
    //                            the six units this file deliberately omits
    //   circle on three steps    CHESS PAWN — "a piece somebody else moves",
    //                            which is the opposite of what a platform is
    //   base, columns, lintel    BANK. Or museum, or courthouse: the
    //                            neoclassical portico is about as locked-in as
    //                            a sign gets
    //
    // All three read fine at 120px and failed at 20, which is the size this is
    // used at. That is the method this file is built on and the reason the
    // 20px check exists at all: a mark is judged where it is used, not where
    // it is designed. The first two also share a cause — a single tapering
    // vertical axis is a figurine, so the fix was to stop being one.
    //
    // Masonry rather than architecture. Blocks stacked are a foundation
    // without being a building, and nothing in the stack tapers.
    rule: 'nonzero',
    d: 'M2 15h20v7H2z' + 'M3.5 8h8v6.5h-8zM13 8h7.5v6.5H13z' + 'M7 2h10v5.5H7z',
  },

  social: {
    label: 'Social',
    sourceName: 'Social Media',
    draws: 'Two speech blocks, offset, each with its tail. A conversation, not a megaphone.',
    rule: 'nonzero',
    d: 'M1.5 2.5h12v8.5h-12zM4 11h4l-4 3.5zM10.5 12h12v8.5h-12zM16 20.5h4l-4 3.5z',
  },

  contenido: {
    label: 'Contenido',
    sourceName: 'Content Strategy',
    draws: 'A sheet with three lines of text on it, the last one short.',
    rule: 'evenodd',
    d: 'M4 1.5h16v21H4zM7 5.5h10v2.5H7zM7 10.5h10v2.5H7zM7 15.5h6v2.5H7z',
  },

  seo: {
    label: 'SEO',
    sourceName: 'SEO',
    draws: 'A magnifying glass. The one sign in the set that needs no explaining anywhere.',
    rule: 'nonzero',
    d:
      'M10 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zm0 3.5a5 5 0 1 1 0 10 5 5 0 0 1 0-10z' +
      'M13.87 16.13 16.13 13.87 22.63 20.37 20.37 22.63z',
  },

  automatizacion: {
    label: 'Automatización creativa',
    sourceName: 'Creative Automation',
    draws:
      'One master square above a row of four small ones, all the same shape. One idea, many cuts.',
    // THE WEAKEST SIGN IN THE SET, and the file should say so rather than let
    // the next person discover it. Wyman's rule is to draw one concrete thing,
    // and "creative automation" is a process — there is no object to point at,
    // which is the same reason Flare and Pulse are not in this file at all.
    //
    // Two drafts died here. A big square with three around it was a 2x2 at
    // small size: the universal sign for "apps", or nothing. A solid block
    // beside a 2x3 grid read as a layout picker, the sidebar-and-content icon
    // out of every CMS. What is left keeps the copies the SAME SHAPE as the
    // master and puts them below it rather than beside it, so the relation is
    // one-to-many instead of two-regions.
    //
    // No case uses this today — all 19 are film work — so it costs nothing
    // live. If one ever takes it, look at it at 20px before trusting it.
    rule: 'nonzero',
    d: 'M7.5 2h9v9h-9zM2 15h4.5v4.5H2zM7.5 15h4.5v4.5H7.5zM13 15h4.5v4.5H13zM18.5 15h4.5v4.5h-4.5z',
  },

  desarrollo: {
    label: 'Desarrollo digital',
    sourceName: 'Desarrollo Digital',
    draws: 'The two angle brackets. Built as strokes because that is what they are.',
    lines: 'M9.5 5 2.5 12 9.5 19M14.5 5 21.5 12 14.5 19',
  },

  activacion: {
    label: 'Activación',
    draws:
      'A burst: one mass going off, points long and short. Something happening ' +
      'in a place, which is the whole of what an activation is.',
    // WAS THE SUN, THEN WAS AN ASTERISK. Draft one was a disc with eight rays
    // detached from it — the brightness control on every phone ever made, and
    // a sign already spoken for means the wrong thing rather than nothing.
    // Draft two joined them into one solid eight-pointed star, which is right
    // at 120px and is an asterisk at 20: eight points cut from r=4.2 leaves
    // spikes about a pixel wide at the waist, and a pixel-wide spike is a
    // typographic mark, not a burst.
    //
    // Six points instead of eight and a much fatter waist (r=6.2, not 4.2):
    // fewer, thicker points survive the pixel grid and the figure goes off
    // instead of footnoting something.
    rule: 'nonzero',
    // And draft three, six fat points, is a HEXAGRAM — a religious sign, which
    // is not a thing to put on a case page by accident. Eight points again,
    // but keeping the fat waist that fixed the asterisk: r=10.5 out, r=6.2 in.
    // Eight is not six and the body is not thin, so it is neither.
    d:
      'M12 1.5 14.37 6.27 19.43 4.58 17.73 9.63 22.5 12 17.73 14.37' +
      ' 19.43 19.43 14.37 17.73 12 22.5 9.63 17.73 4.58 19.43 6.27 14.37' +
      ' 1.5 12 6.27 9.63 4.58 4.58 9.63 6.27Z',
  },
} as const satisfies Record<string, Capability>;

export type CapabilityKey = keyof typeof CAPABILITIES;
export const CAPABILITY_KEYS = Object.keys(CAPABILITIES) as [CapabilityKey, ...CapabilityKey[]];

/** The three this repo inferred rather than read off the agency's own site. */
export const DERIVED_CAPABILITIES = CAPABILITY_KEYS.filter(
  (k) => !('sourceName' in CAPABILITIES[k])
);

/* --- Validation ----------------------------------------------------------- */

/*
 * Same bargain as the contrast check in themes.ts: a pictogram that breaks a
 * rule fails `astro build` rather than shipping wrong. What can actually be
 * caught here is geometry — whether the drawing fits the grid it is drawn on.
 * A path that runs past 24 does not error anywhere, it just gets clipped, and
 * a clipped pictogram looks like a bad drawing rather than like a bug.
 *
 * THIS HAS TO TRACE THE PATH, NOT READ ITS NUMBERS
 *   The first version of this check just bounds-checked every number in the
 *   `d` string, and it failed on the very first pictogram it was given: in
 *   `a5.5 5.5 0 0 1 0-11` the -11 is a RELATIVE delta, a legal way to say
 *   "eleven units up from here", and the check called it a coordinate outside
 *   the grid. Deltas are not positions. Reading the numbers can only ever
 *   approximate where the pen actually goes, so this walks the path and keeps
 *   the real bounding box.
 */

const TOKEN = /([A-Za-z])|(-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?)/gi;

/** How many numbers each command consumes per repetition. */
const ARITY: Record<string, number> = {
  m: 2,
  l: 2,
  t: 2,
  h: 1,
  v: 1,
  c: 6,
  s: 4,
  q: 4,
  a: 7,
  z: 0,
};

/** Points along an elliptical arc, from the SVG endpoint parameterisation. */
function arcPoints(
  x1: number,
  y1: number,
  rx: number,
  ry: number,
  deg: number,
  large: number,
  sweep: number,
  x2: number,
  y2: number
): [number, number][] {
  if (rx === 0 || ry === 0) return [[x2, y2]];
  const phi = (deg * Math.PI) / 180;
  const [cos, sin] = [Math.cos(phi), Math.sin(phi)];
  const dx = (x1 - x2) / 2;
  const dy = (y1 - y2) / 2;
  const x1p = cos * dx + sin * dy;
  const y1p = -sin * dx + cos * dy;

  rx = Math.abs(rx);
  ry = Math.abs(ry);
  // An arc whose radii are too small to reach the endpoint is scaled up until
  // it can — the spec's correction, not an error.
  const lambda = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
  if (lambda > 1) {
    const s = Math.sqrt(lambda);
    rx *= s;
    ry *= s;
  }

  const num = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p;
  const den = rx * rx * y1p * y1p + ry * ry * x1p * x1p;
  const factor = (large === sweep ? -1 : 1) * Math.sqrt(Math.max(0, num / den));
  const cxp = (factor * rx * y1p) / ry;
  const cyp = (-factor * ry * x1p) / rx;
  const cx = cos * cxp - sin * cyp + (x1 + x2) / 2;
  const cy = sin * cxp + cos * cyp + (y1 + y2) / 2;

  const theta = Math.atan2((y1p - cyp) / ry, (x1p - cxp) / rx);
  const end = Math.atan2((-y1p - cyp) / ry, (-x1p - cxp) / rx);
  let sweepAngle = end - theta;
  if (sweep === 0 && sweepAngle > 0) sweepAngle -= 2 * Math.PI;
  if (sweep === 1 && sweepAngle < 0) sweepAngle += 2 * Math.PI;

  const STEPS = 48;
  const points: [number, number][] = [];
  for (let i = 0; i <= STEPS; i++) {
    const t = theta + (sweepAngle * i) / STEPS;
    points.push([
      cx + rx * cos * Math.cos(t) - ry * sin * Math.sin(t),
      cy + rx * sin * Math.cos(t) + ry * cos * Math.sin(t),
    ]);
  }
  return points;
}

/** The path's real bounding box: [minX, minY, maxX, maxY]. */
function boundsOf(path: string): [number, number, number, number] {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  const see = (x: number, y: number) => {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  };

  const tokens = [...path.matchAll(TOKEN)].map((m) => (m[1] ? m[1] : Number(m[2])));
  let x = 0,
    y = 0,
    startX = 0,
    startY = 0;
  let command = '';
  let i = 0;

  while (i < tokens.length) {
    if (typeof tokens[i] === 'string') {
      command = tokens[i] as string;
      i++;
    } else if (!command) {
      throw new Error(`Path starts with a number, not a command: ${path.slice(0, 24)}`);
    } else if (command === 'M') {
      command = 'L';
    } else if (command === 'm') {
      command = 'l';
    }

    const lower = command.toLowerCase();
    const relative = command === lower;
    if (!(lower in ARITY)) {
      throw new Error(
        `Path uses the command "${command}", which this bounds check cannot trace. ` +
          'Add it here rather than leaving the pictogram unchecked.'
      );
    }
    const n = ARITY[lower];
    const args = tokens.slice(i, i + n) as number[];
    i += n;
    if (n > 0 && args.length < n) {
      throw new Error(`Path command "${command}" is missing arguments: ${path.slice(0, 40)}`);
    }

    if (lower === 'z') {
      x = startX;
      y = startY;
      see(x, y);
      continue;
    }

    if (lower === 'a') {
      const [rx, ry, rot, large, sweep, ax, ay] = args;
      const nx = relative ? x + ax : ax;
      const ny = relative ? y + ay : ay;
      for (const [px, py] of arcPoints(x, y, rx, ry, rot, large, sweep, nx, ny)) see(px, py);
      x = nx;
      y = ny;
      continue;
    }

    if (lower === 'h') {
      x = relative ? x + args[0] : args[0];
    } else if (lower === 'v') {
      y = relative ? y + args[0] : args[0];
    } else {
      // The endpoint is the last pair; the control points before it are inside
      // the hull of the curve, so measuring them is conservative but safe.
      for (let k = 0; k + 1 < args.length; k += 2) {
        const px = relative ? x + args[k] : args[k];
        const py = relative ? y + args[k + 1] : args[k + 1];
        see(px, py);
      }
      x = relative ? x + args[args.length - 2] : args[args.length - 2];
      y = relative ? y + args[args.length - 1] : args[args.length - 1];
    }

    if (lower === 'm') {
      startX = x;
      startY = y;
    }
    see(x, y);
  }

  return [minX, minY, maxX, maxY];
}

for (const [key, capability] of Object.entries(CAPABILITIES) as [string, Capability][]) {
  if (!capability.d && !capability.lines) {
    throw new Error(`Capability "${key}" has no pictogram. Every capability draws something.`);
  }
  if (!capability.draws.trim()) {
    throw new Error(
      `Capability "${key}" does not say what it draws. That note is the Wyman rule ` +
        'written down — a pictogram nobody can describe is a logo.'
    );
  }
  for (const [field, path] of [
    ['d', capability.d],
    ['lines', capability.lines],
  ] as const) {
    if (!path) continue;
    // Half the stroke sits outside the centreline, so a stroked form reaches
    // that much further than the box its coordinates describe.
    const bleed = field === 'lines' ? PICTOGRAM_STROKE / 2 : 0;
    const [minX, minY, maxX, maxY] = boundsOf(path);
    const low = Math.min(minX - bleed, minY - bleed);
    const high = Math.max(maxX + bleed, maxY + bleed);
    if (low < 0 || high > PICTOGRAM_SIZE) {
      throw new Error(
        `Capability "${key}": ${field} draws from ` +
          `(${minX.toFixed(2)}, ${minY.toFixed(2)}) to (${maxX.toFixed(2)}, ${maxY.toFixed(2)})` +
          `${bleed ? ` plus ${bleed} of stroke` : ''}, outside the 0-${PICTOGRAM_SIZE} grid. ` +
          'It would be clipped, and a clipped pictogram reads as a bad drawing ' +
          'rather than as a bug.'
      );
    }
  }
}

const labels = new Set<string>();
for (const [key, capability] of Object.entries(CAPABILITIES) as [string, Capability][]) {
  const normalised = capability.label.toLowerCase();
  if (labels.has(normalised)) {
    throw new Error(`Capability "${key}" repeats the label "${capability.label}".`);
  }
  labels.add(normalised);
}
