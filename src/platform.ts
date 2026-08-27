/**
 * platform.ts — the campaign line, in one place.
 *
 * "Do Big Things" is BBDO's global platform, and this site is built on it: the
 * banner splits it across two corners with the video standing in for the middle
 * word, the headline says it in full, the kinetic band repeats it until it
 * becomes texture, and the claim's call to action echoes it in Spanish.
 *
 * That was five hard-coded copies across two files, which is exactly the shape
 * of thing where someone changes four and misses one. Platforms are replaced —
 * section 10 of the brief has the localisation of this one as an open decision
 * — so the day it changes should be one edit here, not a search.
 *
 * WHAT BREAKS IF THE SHAPE CHANGES
 *   The banner needs a first and a last word with something in between for the
 *   video to replace, so a three-word phrase is what it is built for. Two words
 *   still work — the video simply sits between them. One word would leave the
 *   banner with the same word in both corners, and at that point the banner
 *   needs rethinking rather than a different constant.
 */

/**
 * The platform, word by word, in its own language. Title case: every place that
 * renders it uppercases in CSS, so the text a screen reader and a search engine
 * read stays in normal capitalisation.
 */
export const PLATFORM_WORDS = ['Do', 'Big', 'Things'] as const;

/** The whole phrase. What the kinetic band repeats. */
export const PLATFORM = PLATFORM_WORDS.join(' ');

/**
 * The two words the banner anchors to its bottom corners. The video plays in
 * between and is the word it replaces — "BIG" today.
 */
export const PLATFORM_CORNERS = {
  left: PLATFORM_WORDS[0],
  right: PLATFORM_WORDS[PLATFORM_WORDS.length - 1],
} as const;

/**
 * The Spanish line under the headline, on the claim's call to action.
 *
 * Not a translation of the platform and not derived from it — it is its own
 * copy, and it is here because it has to move when the platform does. Leaving
 * it in the page was how this would have been missed.
 */
export const PLATFORM_ECHO = '¿Quieres hacer cosas grandes?';
