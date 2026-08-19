/**
 * Navegación principal. Una sola fuente para el header y el pie.
 *
 * La arquitectura sale de la sección 4 del brief. `construida` marca lo que ya
 * existe: lo que no, se muestra en el menú pero sin enlace, porque enseñar la
 * estructura completa vale para la reunión y un 404 no vale para nada.
 *
 * Al crear cada página, poner `construida: true` y ya aparece enlazada.
 */
export interface Entrada {
  texto: string;
  href: string;
  construida: boolean;
}

export const NAVEGACION: Entrada[] = [
  { texto: 'Inicio', href: '/', construida: true },
  { texto: 'The Work', href: '/the-work/', construida: true },
  { texto: 'Nosotros', href: '/about/', construida: false },
  { texto: 'BBDOers', href: '/people/', construida: false },
  { texto: 'News', href: '/news/', construida: false },
  { texto: 'Contacto', href: '/contact/', construida: false },
];

export const LEGALES: Entrada[] = [
  { texto: 'Aviso de privacidad', href: '/legal/privacidad/', construida: false },
  { texto: 'Términos de uso', href: '/legal/terminos/', construida: false },
  { texto: 'Aviso de cookies', href: '/legal/cookies/', construida: false },
  { texto: 'Alerta de estafa', href: '/legal/alerta-de-estafa/', construida: false },
];
