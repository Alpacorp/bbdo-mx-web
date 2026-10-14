/**
 * anniversary.ts — BBDO México's 50th, in one place.
 *
 * The agency was founded on 9 October 1976 (confirmed by the agency on
 * 2026-10-05). From 9 to 12 October 2026 the kinetic band carried the
 * anniversary line instead of the platform. Those dates are the
 * `aniversario-50` occasion in src/occasions.ts, and the swap is an
 * <Occasion> in the home: the same pieces serve any later celebration.
 *
 * The home also opened with an intro, a "50" knocked out of the banner's red.
 * It was taken out on 2026-10-10, when the letter dive (LetterDive.astro)
 * became the home's opening and the two were competing for the same first
 * screen. It is in git history as AnniversaryIntro.astro.
 */

export const ANNIVERSARY = {
  founded: 1976,
  year: 2026,
} as const;

/** The number itself, derived so it cannot disagree with the two years. */
export const ANNIVERSARY_YEARS = ANNIVERSARY.year - ANNIVERSARY.founded;

/**
 * What the kinetic band repeats during the celebration. Approved copy, not a
 * placeholder: signed off by the agency on 2026-10-05.
 */
export const ANNIVERSARY_BAND = `${ANNIVERSARY_YEARS} años de Big Things`;
