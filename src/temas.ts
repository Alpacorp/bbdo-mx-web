/**
 * Paletas de caso.
 *
 * Lista CERRADA a propósito. La primera versión dejaba el hex libre por caso y
 * eso, con 19 casos y varias manos, acaba en quince rojos distintos. Aquí hay
 * cinco temas acordados; añadir uno es tocar este archivo, que es justo la
 * fricción que se busca.
 *
 * CONTRASTE
 *   Cada paleta se valida al importarse: texto >= 4.5:1 contra el fondo (o
 *   contra AMBOS extremos del degradado), y acento >= 3:1, que es el umbral de
 *   la WCAG para texto grande, que es donde se usa: el resultado y las cifras.
 *   Si alguien añade una paleta que no cumple, `astro build` falla.
 *
 * Dato que salió al calcular esto: el rojo de marca puro (#FF0000) con texto
 * blanco da 4.00:1 y NO cumple AA. Por eso los temas con rojo usan versiones
 * más oscuras para fondo, y el #FF0000 se reserva para acento sobre claro.
 */

export interface Tema {
  nombre: string;
  fondo?: string;
  degradado?: { desde: string; hasta: string; angulo: number };
  texto: string;
  acento: string;
}

export const TEMAS = {
  claro: {
    nombre: 'Claro',
    fondo: '#FAFAFA',
    texto: '#404040',
    acento: '#FF0000',
  },
  oscuro: {
    nombre: 'Oscuro',
    fondo: '#161616',
    texto: '#FAFAFA',
    acento: '#FF3B22',
  },
  rojo: {
    nombre: 'Rojo',
    degradado: { desde: '#C1001F', hasta: '#8A0016', angulo: 155 },
    texto: '#FFFFFF',
    acento: '#FFD166',
  },
  nocturno: {
    nombre: 'Nocturno',
    degradado: { desde: '#1A1206', hasta: '#3B1B2E', angulo: 160 },
    texto: '#F5EFE6',
    acento: '#FFB020',
  },
  arena: {
    nombre: 'Arena',
    degradado: { desde: '#F2E9DC', hasta: '#E7DAC7', angulo: 150 },
    texto: '#3A2E22',
    acento: '#B3421C',
  },
} as const satisfies Record<string, Tema>;

export type ClaveTema = keyof typeof TEMAS;
export const CLAVES_TEMA = Object.keys(TEMAS) as [ClaveTema, ...ClaveTema[]];

/* --- Validación ---------------------------------------------------------- */

function aRgb(hex: string): [number, number, number] {
  let h = hex.slice(1);
  if (h.length === 3)
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
}

function luminancia(hex: string): number {
  const [r, g, b] = aRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contraste(a: string, b: string): number {
  const [x, y] = [luminancia(a), luminancia(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

/** Fondos contra los que hay que medir: uno, o los dos extremos del degradado. */
export function fondosDe(t: Tema): string[] {
  return t.degradado ? [t.degradado.desde, t.degradado.hasta] : t.fondo ? [t.fondo] : [];
}

for (const [clave, t] of Object.entries(TEMAS) as [string, Tema][]) {
  for (const fondo of fondosDe(t)) {
    const cTexto = contraste(t.texto, fondo);
    if (cTexto < 4.5) {
      throw new Error(
        `Paleta "${clave}": el texto ${t.texto} da ${cTexto.toFixed(2)}:1 sobre ${fondo}. ` +
          'La WCAG AA pide 4.5:1 para texto normal.'
      );
    }
    const cAcento = contraste(t.acento, fondo);
    if (cAcento < 3) {
      throw new Error(
        `Paleta "${clave}": el acento ${t.acento} da ${cAcento.toFixed(2)}:1 sobre ${fondo}. ` +
          'Se usa en texto grande, que pide 3:1.'
      );
    }
  }
}

/** CSS custom properties del tema, para inyectar en el elemento raíz del caso. */
export function estiloDeTema(clave: ClaveTema | undefined): string {
  if (!clave) return '';
  const t: Tema = TEMAS[clave];
  const fondo = t.degradado
    ? `linear-gradient(${t.degradado.angulo}deg, ${t.degradado.desde}, ${t.degradado.hasta})`
    : t.fondo;

  return [
    fondo && `--caso-fondo:${fondo}`,
    `--color-fg:${t.texto}`,
    `--color-accent:${t.acento}`,
    // Los tonos derivados se recalculan sobre el texto del tema; si no, el gris
    // fijo del sitio desaparece sobre fondos oscuros.
    `--color-dim:color-mix(in srgb, ${t.texto} 62%, transparent)`,
    `--color-line:color-mix(in srgb, ${t.texto} 22%, transparent)`,
  ]
    .filter(Boolean)
    .join(';');
}
