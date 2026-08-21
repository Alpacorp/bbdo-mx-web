/**
 * Main navigation. Single source for both the header and the footer.
 *
 * The structure comes from section 4 of the brief. `built` flags what already
 * exists: anything else is shown in the menu without a link, because showing
 * the full structure is useful in the client meeting and a 404 is not.
 *
 * When a page gets built, flip `built: true` and it becomes a link.
 *
 * Labels stay in Spanish on purpose: they are site copy, not code.
 */
export interface NavItem {
  label: string;
  href: string;
  built: boolean;
}

export const NAVIGATION: NavItem[] = [
  { label: 'Inicio', href: '/', built: true },
  { label: 'The Work', href: '/the-work/', built: true },
  { label: 'Nosotros', href: '/about/', built: false },
  { label: 'BBDOers', href: '/people/', built: true },
  { label: 'News', href: '/news/', built: true },
  { label: 'Contacto', href: '/contact/', built: false },
];

export const LEGAL_LINKS: NavItem[] = [
  { label: 'Aviso de privacidad', href: '/legal/privacidad/', built: false },
  { label: 'Términos de uso', href: '/legal/terminos/', built: false },
  { label: 'Aviso de cookies', href: '/legal/cookies/', built: false },
  { label: 'Alerta de estafa', href: '/legal/alerta-de-estafa/', built: false },
];
