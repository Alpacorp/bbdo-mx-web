/**
 * lifecycle.ts — how a component's browser code survives client-side routing.
 *
 * THE PROBLEM THIS EXISTS FOR
 *   Every `<script>` in this project used to do its work at module scope:
 *   query the DOM, bind listeners, start an observer. That is correct exactly
 *   once. With <ClientRouter /> mounted, a module is evaluated the first time
 *   it is needed and never again, while the DOM it reached into is replaced on
 *   every navigation. So the headline animates on the page you land on and on
 *   no page after it, the menu button stops opening, the search box stops
 *   filtering. This is the reason ClientRouter had been left unmounted, and
 *   the note in Base.astro said as much.
 *
 *   `astro:page-load` is the fix: it fires on the first load and again after
 *   every swap. Registering a listener happens once, at module scope, which is
 *   the one thing modules are good at; the work happens per page.
 *
 * WHY SETUP RETURNS A TEARDOWN
 *   Anything that outlives the elements it was built for has to be undone, or
 *   it accumulates one copy per navigation: an IntersectionObserver still
 *   holding removed nodes, a GSAP timeline, a listener on document that fires
 *   as many times as you have navigated. Listeners bound to elements inside
 *   the swapped body need no teardown — those elements are gone — so returning
 *   nothing is a perfectly good answer and most components do.
 *
 *   The teardown runs on `astro:before-swap`, which is before the old document
 *   is replaced, so it still sees the DOM it was given.
 */

type Teardown = () => void;

/**
 * Runs `setup` on every page, in both senses of the word: the page you land on
 * and each one you navigate to afterwards.
 *
 * @param setup Does the component's per-page work. Return a function to undo
 *              anything that would otherwise outlive the page.
 */
export function onPage(setup: () => Teardown | void): void {
  let teardown: Teardown | void;

  document.addEventListener('astro:page-load', () => {
    teardown = setup();
  });

  document.addEventListener('astro:before-swap', () => {
    teardown?.();
    teardown = undefined;
  });
}
