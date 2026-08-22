/**
 * dates.ts — one place to turn a date into Spanish.
 *
 * THE OFF-BY-ONE
 *   A date-only string like "2024-11-26" is parsed as midnight UTC. Formatting
 *   that in Mexico City (UTC-6) rolls back a day and prints "25 de noviembre".
 *   The home page worked around it by splitting the string and rebuilding the
 *   date locally, which fixed the symptom in one file.
 *
 *   Formatting in UTC fixes the cause. It also makes the output independent of
 *   where the build runs, which matters as soon as it stops running here: a
 *   local build in UTC-6 and a Vercel build in UTC would otherwise disagree on
 *   what day an article was published.
 */
const LONG: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
};

export function longDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('es-MX', LONG);
}

/** The machine-readable form for <time datetime="…">. */
export function isoDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().slice(0, 10);
}
