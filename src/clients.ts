/**
 * clients.ts — the client roster shown on the home page.
 *
 * Taken from the "Nuestros Clientes_" grid on bbdomexico.com, in the order the
 * agency put them in. It replaces the list of 16 plain names the redesign had
 * been carrying: the current site has the real marks and there was no reason
 * to keep typing brands out by hand.
 *
 * THE ART IS MONOCHROME
 *   Measured over all 26 files: 25 of them have 0% mean saturation. These are
 *   not colour logos. They are greyscale art that arrives in two polarities —
 *   some drawn in white for a dark background, some in black for a light one —
 *   so on any single background roughly half of them would disappear.
 *
 *   The wall puts them on light chips and normalises them to dark ink. Because
 *   the art is greyscale, flipping polarity is lossless: a wordmark knocked out
 *   of a solid shape stays exactly as readable inverted.
 *
 *   `invert` was decided by measurement, not by eye. For each file, the share
 *   of its ink that lands dark enough to read on a light chip was computed in
 *   both polarities, and it is only flipped where the flip wins decisively.
 *   Marks that are half light and half dark come out near even either way, and
 *   those are left as the brand drew them.
 *
 *   Flattening them to white silhouettes was tried first and rejected: it
 *   destroyed about half the set, because every mark whose name is knocked out
 *   of a solid shape collapsed into a blob.
 *
 * ABOUT `chip`
 *   Two files are genuinely two-tone — dark shape, white lettering — and need a
 *   background in between or one half of the mark vanishes. Rendered on tones
 *   250 / 190 / 150 / 110, both only resolve fully around 150.
 *
 * PENDING with the agency
 *   These are downscaled raster copies, some of them 183x175. Vector or
 *   single-colour originals would be better on every count, and would remove
 *   the two exceptions below. `el-cazo` is the worst of them: it arrived as an
 *   opaque grey rectangle with no alpha at all, and its transparency here was
 *   reconstructed from its luminance.
 */
export interface Client {
  /** Used as the alt text, so it must read as the brand does. */
  name: string;
  /** File in src/assets/clients/. */
  file: string;
  /** Light art on a light chip: flip it to dark ink. */
  invert: boolean;
  /** Only for two-tone marks that need a background between the two. */
  chip?: 'mid';
}

export const CLIENTS: Client[] = [
  { name: "Buchanan's", file: 'buchanans.png', invert: true },
  { name: 'Johnnie Walker', file: 'johnnie-walker.png', invert: true },
  { name: 'Saba', file: 'saba.png', invert: false },
  { name: 'Finamex', file: 'finamex.png', invert: true },
  { name: 'Pedigree', file: 'pedigree.png', invert: false },
  { name: 'Tostitos', file: 'tostitos.png', invert: false },
  { name: 'Norteñita', file: 'nortenita.png', invert: false },
  { name: 'Olé', file: 'ole.png', invert: false },
  { name: 'Oscar Mayer', file: 'oscar-mayer.png', invert: false },
  { name: 'San Rafael Balance', file: 'san-rafael-balance.png', invert: false, chip: 'mid' },
  { name: 'San Rafael', file: 'san-rafael.png', invert: false },
  { name: 'Mirinda', file: 'mirinda.png', invert: true },
  { name: 'Pepsi Black', file: 'pepsi-black.png', invert: true },
  { name: 'Modelo', file: 'modelo.png', invert: false, chip: 'mid' },
  { name: 'FedEx', file: 'fedex.webp', invert: false },
  { name: 'Banamex', file: 'banamex.webp', invert: true },
  { name: 'Yoplait', file: 'yoplait.webp', invert: true },
  { name: 'BMW', file: 'bmw.webp', invert: true },
  { name: 'MINI', file: 'mini.webp', invert: true },
  { name: 'El Cazo Mexicano', file: 'el-cazo.png', invert: true },
  { name: 'Yoplait Skyr', file: 'yoplait-skyr.png', invert: false },
  { name: 'Saladitas', file: 'saladitas.png', invert: false },
  { name: 'Habaneras', file: 'habaneras.png', invert: true },
  { name: 'Sabritas', file: 'sabritas.png', invert: false },
  { name: 'Crackets', file: 'crackets.png', invert: false },
  { name: 'Prime', file: 'prime.png', invert: false },
];
