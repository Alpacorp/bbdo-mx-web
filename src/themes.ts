/**
 * Case palettes.
 *
 * Deliberately a CLOSED list. The first version allowed a free hex per case,
 * and with 19 cases and several people editing that ends up as fifteen
 * different reds. These are five agreed themes; adding one means editing this
 * file, which is exactly the friction we want.
 *
 * WHERE THE COLOURS COME FROM — 2026-09-22
 *   They used to be called Light, Dark, Red, Night and Sand: a neutral white,
 *   a neutral black, an orange red, a brown-purple and a beige. Correct, and
 *   from nowhere. Every one now has a source somebody can name, because the
 *   Mexican layer of this site should be provenance rather than ornament —
 *   papel picado and calaveras are the Mexico of the tourist, and an agency
 *   from here doing that reads as less sophisticated, not more.
 *
 *     cal        The lime wash on walls from pre-Hispanic stucco to the
 *                vernacular house. Not white: warm, and what a whitewashed
 *                wall looks like in sun.
 *     obsidiana  Volcanic glass, black with a cool cast. Blades, and
 *                Tezcatlipoca's smoking mirror.
 *     grana      Cochineal, from Oaxaca. The dye that coloured European
 *                royalty for three centuries and was this country's most
 *                valuable export after silver — a Mexican red that coloured
 *                the world. Carmine, with a blue undertone, which is what
 *                separates it from the orange-red of the brand.
 *     tezontle   The porous volcanic rock of the Valley of Mexico. The Templo
 *                Mayor is built of it and so is half the Centro Histórico: it
 *                is, literally, the colour of this city's old walls.
 *     cantera    The pink volcanic stone of Michoacán. Morelia's entire
 *                historic centre is cut from it.
 *
 *   The accents carry the same rule. `tezontle` takes ROSA MEXICANO, which is
 *   Barragán's move exactly — that pink against volcanic earth is Cuadra San
 *   Cristóbal — and `grana` takes maize yellow, because cochineal and maize is
 *   a pairing older than the country.
 *
 * A PALETTE NOBODY CAN SEE IS A RELABEL
 *   The first pass at this kept every colour close to the one it replaced, so
 *   three of the five moved by a ΔE of about 3 — under the threshold where a
 *   person notices — and that covered 13 of the 19 cases. The provenance was
 *   real and it was invisible: it lived in this comment and in the key, not on
 *   screen. The contrast validator below was never the constraint; text was
 *   landing at 7:1 against a 4.5 floor, with room to spare that went unused.
 *
 *   Every background now sits at ΔE 8 or more from the one it replaced —
 *   cal 10.2, obsidiana 8.1, cantera 9.6 and 16.5, tezontle 20.7 and 28.2,
 *   grana 24.1 and 20.2 — which is the point where a change stops being a
 *   rename.
 *
 * CONTRAST
 *   Every palette is validated on import: text >= 4.5:1 against the background
 *   (or against BOTH ends of the gradient), and accent >= 3:1, the WCAG
 *   threshold for large text, which is where it is used: the headline result
 *   and the stat figures. If someone adds a palette that fails, `astro build`
 *   fails with it. Provenance does not buy an exemption — two candidate
 *   pinks were rejected by this check before the one below passed.
 *
 * Something this surfaced: the pure brand red (#FF0000) against white text is
 * 4.00:1 and does NOT meet AA. That is why the red themes use darker shades
 * for backgrounds, and #FF0000 is reserved for accents on light backgrounds.
 */

export interface Theme {
  name: string;
  background?: string;
  gradient?: { from: string; to: string; angle: number };
  text: string;
  accent: string;
}

export const THEMES = {
  cal: {
    name: 'Cal',
    background: '#F5EDDC',
    text: '#363027',
    accent: '#D40000',
  },
  obsidiana: {
    name: 'Obsidiana',
    background: '#0B141E',
    text: '#E6EDF2',
    accent: '#FF4A2E',
  },
  grana: {
    name: 'Grana cochinilla',
    gradient: { from: '#A8143A', to: '#6E0C24', angle: 155 },
    text: '#FFFFFF',
    accent: '#FFD166',
  },
  tezontle: {
    name: 'Tezontle',
    gradient: { from: '#3A0F0C', to: '#5E2118', angle: 160 },
    text: '#F7EBE4',
    accent: '#FF2D8E',
  },
  cantera: {
    name: 'Cantera rosa',
    gradient: { from: '#F6D7C9', to: '#DDB3A4', angle: 150 },
    text: '#3E2A23',
    accent: '#9E0E33',
  },
} as const satisfies Record<string, Theme>;

export type ThemeKey = keyof typeof THEMES;
export const THEME_KEYS = Object.keys(THEMES) as [ThemeKey, ...ThemeKey[]];

/* --- Validation ----------------------------------------------------------- */

function toRgb(hex: string): [number, number, number] {
  let h = hex.slice(1);
  if (h.length === 3)
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
}

function luminance(hex: string): number {
  const [r, g, b] = toRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string): number {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

/** Backgrounds to measure against: one, or both ends of the gradient. */
export function backgroundsOf(t: Theme): string[] {
  return t.gradient ? [t.gradient.from, t.gradient.to] : t.background ? [t.background] : [];
}

for (const [key, t] of Object.entries(THEMES) as [string, Theme][]) {
  for (const background of backgroundsOf(t)) {
    const textRatio = contrast(t.text, background);
    if (textRatio < 4.5) {
      throw new Error(
        `Palette "${key}": text ${t.text} is ${textRatio.toFixed(2)}:1 on ${background}. ` +
          'WCAG AA requires 4.5:1 for body text.'
      );
    }
    const accentRatio = contrast(t.accent, background);
    if (accentRatio < 3) {
      throw new Error(
        `Palette "${key}": accent ${t.accent} is ${accentRatio.toFixed(2)}:1 on ${background}. ` +
          'It is used on large text, which requires 3:1.'
      );
    }
  }
}

/** The theme's CSS custom properties, to inject on the case root element. */
export function themeStyle(key: ThemeKey | undefined): string {
  if (!key) return '';
  const t: Theme = THEMES[key];
  const background = t.gradient
    ? `linear-gradient(${t.gradient.angle}deg, ${t.gradient.from}, ${t.gradient.to})`
    : t.background;

  return [
    background && `--case-background:${background}`,
    `--color-fg:${t.text}`,
    `--color-accent:${t.accent}`,
    // Derived tones are recomputed from the theme text colour. Otherwise the
    // site's fixed grey disappears against dark backgrounds.
    // 75%, for the same reason as --color-dim in tokens.css: at 62% the muted
    // tone of the light themes lands at 3.3:1 against its own background.
    `--color-dim:color-mix(in srgb, ${t.text} 75%, transparent)`,
    `--color-line:color-mix(in srgb, ${t.text} 22%, transparent)`,
  ]
    .filter(Boolean)
    .join(';');
}
