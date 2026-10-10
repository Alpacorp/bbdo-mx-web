/**
 * anniversary.ts — BBDO México's 50th, in one place.
 *
 * The agency was founded on 9 October 1976 (confirmed by the agency on
 * 2026-10-05). From 9 to 12 October 2026 the kinetic band carries the
 * anniversary line instead of the platform.
 *
 * The home also opened with an intro, a "50" knocked out of the banner's red.
 * It was taken out on 2026-10-10, when the letter dive (LetterDive.astro)
 * became the home's opening and the two were competing for the same first
 * screen. It is in git history as AnniversaryIntro.astro.
 *
 * DECIDED IN THE BROWSER, NOT AT BUILD TIME
 *   The site is static: a check against the build's clock would only flip if
 *   someone happened to deploy on the 9th, and would never flip back. So the
 *   window below is handed to the inline script in Base.astro, which compares
 *   it with the visitor's clock before first paint and sets `anniversary` on
 *   <html>. Everything else hangs off that class in CSS, so the celebration starts
 *   and ends on its own with no deploy on either side.
 *
 *   The bounds are instants, written with Mexico City's offset. Mexico has had
 *   no daylight saving since 2022, so -06:00 is right all year.
 *
 * PREVIEW
 *   `?aniversario=50` turns it on for the rest of the tab's session, whatever
 *   the date; `?aniversario=0` turns the preview off. That is how it gets
 *   reviewed before the 9th, on any deploy, without touching this file.
 */

export const ANNIVERSARY = {
  founded: 1976,
  year: 2026,
  /** First instant of the celebration, Mexico City time. */
  start: '2026-10-09T00:00:00-06:00',
  /** First instant AFTER it: the celebration runs through Monday 12 October. */
  end: '2026-10-13T00:00:00-06:00',
} as const;

/** The number itself, derived so it cannot disagree with the two years. */
export const ANNIVERSARY_YEARS = ANNIVERSARY.year - ANNIVERSARY.founded;

/**
 * What the kinetic band repeats during the celebration. Approved copy, not a
 * placeholder: signed off by the agency on 2026-10-05.
 */
export const ANNIVERSARY_BAND = `${ANNIVERSARY_YEARS} años de Big Things`;
