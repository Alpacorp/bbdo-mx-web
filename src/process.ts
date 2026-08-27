/**
 * process.ts — the agency's method, as the agency already words it.
 *
 * WHERE IT COMES FROM
 *   bbdomexico.com/our-process/, read on 2026-08-27. The page was not in the
 *   migration's inventory because the menu links to it in English while every
 *   other route is in Spanish, and it is the one piece of copy on the current
 *   site that says something no other agency could say about itself.
 *
 *   The three inputs and the four descriptive lines are verbatim, with one
 *   exception noted on Disrupción below.
 *
 *   The four step NAMES are not. See PROPOSED COPY.
 *
 * THE IDEA
 *   The four steps are marked B, B, D and O: the agency's own name used as the
 *   numbering of its method. That is why the marker is data and not a
 *   decorative index — renumbering these 01-04 would throw the idea away.
 *
 * PROPOSED COPY — NEEDS THE CREATIVE DIRECTOR
 *   On the current site the letters and the words do not match: GROWTH VALUE
 *   does not begin with a B, PURPOSE does not begin with a B, CREATIVE does
 *   not begin with an O. Only DISRUPTION lands. So the acrostic is announced
 *   and then not delivered, which is the kind of detail that reads as a
 *   near-miss rather than as a system.
 *
 *   `name` below is my proposal: four Spanish words that keep each step's
 *   meaning and actually start with their letter. `sourceName` keeps what the
 *   site says today, so nothing is lost and reverting is one edit in
 *   Process.astro. These four words are the only strings on this site written
 *   by a developer rather than by the agency, and they do not ship without
 *   the creative director signing them off.
 *
 *   Spanish and not English because the four lines under them are Spanish,
 *   and because an acrostic that only works in one language is the local
 *   office's asset, not the network's.
 *
 * WHAT IS STILL MISSING
 *   Each step on the current site carries a "Read More" that links nowhere.
 *   So one line per step is genuinely all the copy that exists. If planning
 *   ever writes the long form, it belongs here as an optional `detail`, and
 *   the section can then earn a page of its own — four one-liners cannot.
 */

/** One of the three things the method starts from. */
export interface Input {
  /** Verbatim, minus the trailing underscore: the wall draws that. */
  text: string;
}

export interface Step {
  /** B, B, D or O. See the note above: this is the idea, not an index. */
  letter: string;
  /** PROPOSED. Written by me so the acrostic resolves. Not signed off. */
  name: string;
  /** What bbdomexico.com/our-process/ calls this step today. Verbatim. */
  sourceName: string;
  line: string;
}

/**
 * The inputs. On the current site they are set as three separate lines above
 * the steps, each ending in the underscore that sections.css now draws.
 */
export const INPUTS: Input[] = [
  { text: 'La data nos inspira en todo momento' },
  { text: 'El contexto en el que nos movemos' },
  { text: 'Las creencias de la gente' },
];

export const STEPS: Step[] = [
  {
    letter: 'B',
    // The line is about the client's business growing, not about margin.
    // "Beneficio" was the accurate single word and it reads like a finance
    // deck; this says the same thing the way an agency would say it.
    name: 'Buenos negocios',
    sourceName: 'Growth Value',
    line: 'Creamos valor, crecemos juntos, exponenciamos el negocio de nuestras marcas',
  },
  {
    letter: 'B',
    // "Le apostamos" is literally a bet, and betting on what does not exist
    // yet takes nerve. Purpose survives: it is what the nerve is for.
    name: 'Bravura',
    sourceName: 'Purpose',
    line: 'Le apostamos a las compañías del futuro',
  },
  {
    letter: 'D',
    name: 'Disrupción',
    sourceName: 'Disruption',
    // The source reads "categoria". Corrected here, the same way the site-wide
    // "Omincon" was corrected to Omnicom: a missing accent is a typo, not copy.
    line: 'Nuevas maneras de romper con la categoría',
  },
  {
    letter: 'O',
    // "Creatividad en todo momento" is not a capability, it is a compulsion.
    // Obsesión says that; "Original" would only have said the letter.
    name: 'Obsesión',
    sourceName: 'Creative',
    line: 'Creatividad en todo momento',
  },
];
