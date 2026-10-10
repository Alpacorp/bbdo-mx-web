/**
 * sunstone.ts — the line ornament that fills "MÉXICO" at the end of the dive.
 *
 * Asked for on 2026-10-10 with a photo of a printed shirt as the reference:
 * the Piedra del Sol drawn as line work, dark rules on grey, with its rings of
 * U-shaped teeth, glyph "eyes", rays and stepped frets. The shirt is somebody
 * else's artwork, so nothing here is traced from it. This is drawn from the
 * stone's own structure — concentric bands, each a repeated motif — which is
 * also what makes the style recognisable.
 *
 * GENERATED, NOT DRAWN, and not a file. Every band is one motif repeated
 * around a circle, so a loop says it in a few lines where a hand-drawn SVG
 * would be thousands of nodes nobody could edit. It renders at any size,
 * which matters because it is seen through letters that grow with the screen.
 *
 * Note src/pattern.ts turned figurative Mexican motifs down for the site's
 * GROUNDS, on purpose. This is not a ground: it is one deliberate moment, the
 * word México, chosen by the agency for the landing.
 *
 * All geometry is centred on 0,0 with radius R. Strokes take `currentColor`;
 * the caller sets the colour and the stroke width.
 */

const f = (n: number) => Number(n.toFixed(2));

/** Repeats a motif drawn along the +x axis `count` times around the centre. */
function around(count: number, motif: string, offsetDeg = 0): string {
  let out = '';
  for (let i = 0; i < count; i++) {
    out += `<g transform="rotate(${f(offsetDeg + (360 / count) * i)})">${motif}</g>`;
  }
  return out;
}

const ring = (r: number) => `<circle r="${f(r)}"/>`;

export function sunstone(R: number): string {
  const r = (k: number) => k * R;

  /* Centre: the face, reduced to its concentric rings and a pupil. */
  const centre =
    ring(r(0.05)) + ring(r(0.09)) + `<circle r="${f(r(0.02))}" fill="currentColor" stroke="none"/>`;

  /* Eight rays out of the centre, each a long thin triangle. */
  const ray = (r0: number, r1: number, halfWidth: number) =>
    `<path d="M${f(r0)} ${f(-halfWidth)}L${f(r1)} 0L${f(r0)} ${f(halfWidth)}Z"/>`;
  const innerRays = around(8, ray(r(0.11), r(0.24), r(0.03)), 22.5);

  /* The glyph band: "eyes", a circle in a circle with a dot. */
  const eye =
    `<circle cx="${f(r(0.33))}" r="${f(r(0.045))}"/>` +
    `<circle cx="${f(r(0.33))}" r="${f(r(0.024))}"/>` +
    `<circle cx="${f(r(0.33))}" r="${f(r(0.008))}" fill="currentColor" stroke="none"/>`;

  /* The tooth band: U shapes, rounded end outward. */
  const tooth = (r0: number, r1: number, w: number) =>
    `<path d="M${f(r0)} ${f(-w)}L${f(r1 - w)} ${f(-w)}A${f(w)} ${f(w)} 0 0 1 ${f(r1 - w)} ${f(w)}L${f(r0)} ${f(w)}"/>`;

  /* The fret band: a stepped hook in a box, the greca's own unit. */
  const fret = (r0: number, r1: number, h: number) => {
    const m = (r0 + r1) / 2;
    const q = (r1 - r0) / 4;
    return (
      `<path d="M${f(r0)} ${f(-h)}H${f(r1)}V${f(h)}H${f(r0)}Z"/>` +
      `<path d="M${f(r0 + q)} ${f(h * 0.6)}V${f(-h * 0.6)}H${f(r1 - q)}V${f(h * 0.2)}H${f(m)}V${f(-h * 0.2)}"/>`
    );
  };

  /* The eight big rays of the outer band, each with a second triangle inside. */
  const bigRay = ray(r(0.53), r(0.71), r(0.07)) + ray(r(0.56), r(0.66), r(0.035));

  /* The rim: dots, then short rules like the stone's outer border. */
  const dot = `<circle cx="${f(r(0.78))}" r="${f(r(0.014))}"/>`;
  const rule = `<path d="M${f(r(0.81))} 0H${f(r(0.86))}"/>`;

  return [
    centre,
    innerRays,
    ring(r(0.25)),
    ring(r(0.27)),
    around(14, eye),
    ring(r(0.39)),
    ring(r(0.41)),
    around(56, tooth(r(0.42), r(0.49), r(0.018))),
    ring(r(0.5)),
    ring(r(0.52)),
    around(8, bigRay),
    around(24, fret(r(0.57), r(0.69), r(0.03)), 7.5),
    ring(r(0.72)),
    ring(r(0.74)),
    around(48, dot),
    around(120, rule),
    ring(r(0.88)),
    around(80, tooth(r(0.89), r(0.97), r(0.014)), 2.25),
    ring(r(0.98)),
  ].join('');
}
