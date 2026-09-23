# sources/

Originals that build scripts trace or derive from. **Not shipped**: nothing
here is under `public/` or `src/assets/`, so Astro never copies it into the
site. It is in the repo so every generated asset can be regenerated and so the
provenance of each one is checkable rather than remembered.

## ajolote-appleton-1884.png

Wood engraving of an axolotl (_Siredon pisciforme_, now _Ambystoma mexicanum_)
from **Appleton's Guide to Mexico, 1884**. Author unknown.

- **Licence:** public domain. Wikimedia Commons tags it `PD-US` — published in
  1884, so copyright has expired in the United States.
- **Source:** https://commons.wikimedia.org/wiki/File:AGTM_D115_The_Axolotl_-_Siredon_pisciforme.png
- **Attribution:** not required, commercial reuse included.
- **Read on:** 2026-09-23.

ONE CAVEAT WORTH A LAWYER'S MINUTE. The Commons tag is `PD-US` specifically,
and Mexico has one of the longest copyright terms in the world. For an
anonymous work published in 1884 the Mexican term (100 years from publication
for anonymous works) also ran out long ago, so this is almost certainly clear
here too — but "almost certainly" is my reading and not advice. If the agency
has counsel, this is a thirty-second question worth asking before launch.

Traced by `scripts/build-figures.mjs` into `src/figures.ts`.
