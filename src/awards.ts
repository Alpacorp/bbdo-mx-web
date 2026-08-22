/**
 * awards.ts — what BBDO México has actually won, as far as the record shows.
 *
 * WHY THERE IS ONLY ONE
 *   The home page used to carry four counters reading "00 Leones en Cannes",
 *   "00 Círculo de Oro", "00 El Sol", "00 Effie México", each noted "pendiente
 *   de confirmar". Those were a frame invented for numbers nobody had.
 *
 *   The whole of bbdomexico.com was searched for the real ones. It has exactly
 *   one post — the sitemap lists a single entry under post-sitemap.xml, and
 *   everything else in page-sitemap.xml is Qode demo furniture — and that post
 *   is this award. There is no festival tally anywhere on the site, not on the
 *   home, not on a page of its own, not inside any of the 19 cases.
 *
 *   So the section ships with one award, and it is a real one. A counter
 *   showing "00" is not a placeholder, it is a claim that the agency has won
 *   nothing, and it reads as broken rather than as pending.
 *
 * PENDING with the agency
 *   The palmarés is a content dependency, exactly like the case photos. What
 *   is needed per entry: festival, category, level, campaign, client and year.
 *   Cannes, El Sol, Círculo de Oro, Effie and Clio all publish searchable
 *   winner archives, so this can be assembled and then signed off — but it
 *   gets signed off before it ships. Figures about a real agency are confirmed
 *   or they do not go up.
 *
 *   Also to confirm: who actually granted this one. The article on the current
 *   site closes with "Tomado de Revista Expansión", which establishes
 *   Expansión as the publication that ran it, not necessarily as the awarding
 *   body. `org` is rendered as a plain attribution line for that reason.
 */
export interface Award {
  /** As the award is named, not as we would phrase it. */
  name: string;
  /** Who gives it, or failing that, who published it. See the note above. */
  org: string;
  year: number;
  /** Festival awards belong to a campaign. This one belongs to the agency. */
  campaign?: string;
  /** Gold, Silver, a Lion, a shortlist. */
  level?: string;
  /** Where it can be checked. */
  source?: string;
}

/** Most recent first: the first one is the one the section features. */
export const AWARDS: Award[] = [
  {
    name: 'Agencia Transformadora del Año',
    org: 'Revista Expansión',
    year: 2024,
    source: 'https://bbdomexico.com/2024/11/26/bbdo-premio-agencia-transformadora/',
  },
];
