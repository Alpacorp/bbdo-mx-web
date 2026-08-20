/**
 * check-tokens.mjs — catches `var(--name)` where --name is never defined.
 *
 * WHY THIS EXISTS
 *   An undefined custom property is not an error in CSS: the declaration is
 *   simply dropped and the element silently falls back to its initial value.
 *   The build passes, `astro check` passes, the linter passes, and the page
 *   renders with no gap, no padding or no background, which reads as a layout
 *   bug rather than as a typo.
 *
 *   It has already cost this project three times: variables that no longer
 *   existed in themes.ts, `--color-text` for what is really `--color-fg`, and
 *   `--space-sm` / `--space-md` for a scale that is spelled `--space-s` /
 *   `--space-m`. Every one of them was found by eye, in the browser.
 *
 * ALLOWED EXCEPTIONS
 *   Properties written from JavaScript at runtime. They are declared below so
 *   the list stays short and deliberate.
 */
import { readFileSync } from 'node:fs';
import { globSync } from 'node:fs';

/** Set from JS, never declared in CSS. */
const SET_AT_RUNTIME = new Set(['--fx-delay', '--i']);

const files = globSync('src/**/*.{astro,css,ts}');

const defined = new Set(SET_AT_RUNTIME);
const used = new Map();

for (const file of files) {
  const text = readFileSync(file, 'utf8');
  for (const [, name] of text.matchAll(/(--[\w-]+)\s*:/g)) defined.add(name);
  for (const [, name] of text.matchAll(/var\(\s*(--[\w-]+)/g)) {
    if (!used.has(name)) used.set(name, new Set());
    used.get(name).add(file);
  }
}

const missing = [...used].filter(([name]) => !defined.has(name));

if (missing.length > 0) {
  console.error('Custom properties used but never defined:\n');
  for (const [name, where] of missing) {
    console.error(`  ${name}  ->  ${[...where].join(', ')}`);
  }
  console.error('\nDefine it in src/styles/tokens.css, or fix the name.');
  process.exit(1);
}

console.log(`check-tokens: ${used.size} custom properties, all defined.`);
