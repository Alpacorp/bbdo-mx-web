/**
 * contact-routing.ts — where each kind of enquiry goes.
 *
 * Section 4 of the brief asks the contact page to route: New Business,
 * Careers and Prensa. Section 2 records why that matters — today the site
 * publishes exactly one address, quierotrabajaren@bbdomexico.com, and it is a
 * recruitment inbox. Everything else that reaches the agency through the site
 * lands in a mailbox meant for CVs.
 *
 * PENDING with the agency: two of these three have nowhere of their own to go.
 * They are declared here with `inbox: null` rather than quietly pointed at
 * recruitment, so the gap is visible in code and the fix is a one-line edit.
 * Until they exist, the endpoint falls back to the recruitment inbox and says
 * so in the subject line, which is worse than a real address but better than
 * dropping the message.
 */
export interface Topic {
  id: 'nuevo-negocio' | 'talento' | 'prensa';
  label: string;
  /** What this is for, in the visitor's words. */
  hint: string;
  /** null = the agency has not given us one yet. */
  inbox: string | null;
}

/** The only address the agency publishes today. */
export const FALLBACK_INBOX = 'quierotrabajaren@bbdomexico.com';

export const TOPICS: Topic[] = [
  {
    id: 'nuevo-negocio',
    label: 'Nuevo negocio',
    hint: 'Tienes un proyecto o un concurso y quieres saber si encajamos.',
    inbox: null,
  },
  {
    id: 'talento',
    label: 'Talento',
    hint: 'Quieres trabajar en BBDO México o dejarnos tu portafolio.',
    inbox: FALLBACK_INBOX,
  },
  {
    id: 'prensa',
    label: 'Prensa',
    hint: 'Escribes una nota y necesitas datos, imágenes o una declaración.',
    inbox: null,
  },
];

export function topicById(id: string): Topic | undefined {
  return TOPICS.find((t) => t.id === id);
}
