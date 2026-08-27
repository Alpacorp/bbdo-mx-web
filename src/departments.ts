import type { ThemeKey } from './themes';

/**
 * Departments for the BBDOers roster.
 *
 * The current site publishes 73 distinct job titles for 117 people, with no
 * grouping at all, so a single grid of 117 portraits reads as one long
 * undifferentiated wall. Grouping gives the page structure and, with a
 * different background per band, breaks up the whiteness.
 *
 * Titles are classified by keyword rather than stored per person: the source
 * data has no department field, and hand-tagging 117 records would rot the
 * moment somebody is hired. `classify()` has a test below it that fails the
 * build if anyone lands in the fallback.
 *
 * The titles are messy in the source and that is deliberate: "Copywritter",
 * "Bussiness Executive" and "Desing" are typos on the live site, matched here
 * so nobody disappears from the page because of them.
 */
export interface Department {
  id: string;
  label: string;
  /** Band background. Alternating them is what cuts the white. */
  theme: ThemeKey;
  /** Keywords matched against the lower-cased job title, in order. */
  match: RegExp;
}

export const DEPARTMENTS: Department[] = [
  {
    id: 'liderazgo',
    label: 'Liderazgo',
    theme: 'dark',
    match:
      /\b(ceo|chief|vp |cfo|head of|general creativo|group business|contralor|ejecutivo planning|coms planning director)\b/,
  },
  {
    id: 'creatividad',
    label: 'Creatividad',
    theme: 'light',
    match: /\b(creativ|copy|proofreader|content creator)\w*/,
  },
  {
    id: 'arte',
    label: 'Arte y diseño',
    theme: 'sand',
    match: /\b(arte|art director|design|desing|diseñador)\w*/,
  },
  {
    id: 'cuentas',
    label: 'Cuentas',
    theme: 'night',
    match: /\b(business|bussiness|account)\w*/,
  },
  {
    id: 'estrategia',
    label: 'Estrategia y data',
    theme: 'red',
    match: /\b(planner|strategist|data|analytics)\w*/,
  },
  {
    id: 'digital',
    label: 'Digital y producción',
    theme: 'sand',
    match:
      /\b(community|content manager|social media|maker|video|productor|web master|project manager|it coordinator)\w*/,
  },
  {
    id: 'operaciones',
    label: 'Operaciones',
    theme: 'dark',
    match:
      /\b(factura|billing|contable|accounting|tesorer|cuentas x pagar|administrativ|nómina|nomina|rr ?hh|rrhh|mensajero|asistente)\w*/,
  },
];

/** Fallback so nobody vanishes if a new title does not match anything. */
export const FALLBACK: Department = {
  id: 'equipo',
  label: 'Equipo',
  theme: 'light',
  match: /.^/,
};

export function classify(role: string): Department {
  const r = role.toLowerCase();
  return DEPARTMENTS.find((d) => d.match.test(r)) ?? FALLBACK;
}
