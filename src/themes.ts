/**
 * Case palettes.
 *
 * Deliberately a CLOSED list. The first version allowed a free hex per case,
 * and with 19 cases and several people editing that ends up as fifteen
 * different reds. These are five agreed themes; adding one means editing this
 * file, which is exactly the friction we want.
 *
 * CONTRAST
 *   Every palette is validated on import: text >= 4.5:1 against the background
 *   (or against BOTH ends of the gradient), and accent >= 3:1, the WCAG
 *   threshold for large text, which is where it is used: the headline result
 *   and the stat figures. If someone adds a palette that fails, `astro build`
 *   fails with it.
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
  light: {
    name: 'Light',
    background: '#FAFAFA',
    text: '#404040',
    accent: '#FF0000',
  },
  dark: {
    name: 'Dark',
    background: '#161616',
    text: '#FAFAFA',
    accent: '#FF3B22',
  },
  red: {
    name: 'Red',
    gradient: { from: '#C1001F', to: '#8A0016', angle: 155 },
    text: '#FFFFFF',
    accent: '#FFD166',
  },
  night: {
    name: 'Night',
    gradient: { from: '#1A1206', to: '#3B1B2E', angle: 160 },
    text: '#F5EFE6',
    accent: '#FFB020',
  },
  sand: {
    name: 'Sand',
    gradient: { from: '#F2E9DC', to: '#E7DAC7', angle: 150 },
    text: '#3A2E22',
    accent: '#B3421C',
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
