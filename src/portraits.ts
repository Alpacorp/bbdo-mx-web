/**
 * portraits.ts — resolving a BBDOer's photo, in one place.
 *
 * The roster stores a filename, not an import, because its loader reads a JSON
 * file and `image()` only works for assets sitting next to a markdown file.
 * import.meta.glob is the bridge, and it has to be written where Vite can see
 * it statically — which is why this is a module and not a function that takes a
 * directory.
 *
 * It lived twice, in /people/ and in /about/, and two copies of a lookup that
 * throws on a missing file is two places to update when the folder moves.
 */
import type { ImageMetadata } from 'astro';

const PORTRAITS = import.meta.glob<{ default: ImageMetadata }>(
  './assets/people/*.{webp,jpg,jpeg,png}'
);

/**
 * Throws rather than falling back to a placeholder: a missing portrait is a
 * data error, and it should stop the build instead of shipping a hole.
 */
export function portraitOf(file: string): Promise<{ default: ImageMetadata }> {
  const key = `./assets/people/${file}`;
  const loader = PORTRAITS[key];
  if (!loader) throw new Error(`Missing portrait for "${file}" in src/assets/people/`);
  return loader();
}
