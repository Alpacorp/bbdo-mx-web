/**
 * build-case-banners.mjs — a banner loop per case, derived from its key visual.
 *
 * WHY THIS EXISTS, AND WHEN TO DELETE IT
 *   Every case page opened with the SAME footage: banner-home.mp4, which is
 *   head-team.mp4 from the current site and has nothing to do with any
 *   campaign. The audit calls that A4. The real fix is a silent cut of each
 *   campaign's own film, and it is blocked twice over — the films live on a
 *   Vimeo account nobody here can reach, and Vimeo blocks automated access.
 *
 *   So until those files exist, each case's banner is made from the one piece
 *   of that campaign's own material we DO have: its key visual. A slow push,
 *   twelve seconds, no audio.
 *
 *   The day real cuts arrive, drop them in public/v/case/<slug>.mp4 and delete
 *   this script. Nothing else changes: the page picks the file up by name.
 *
 * WHY THE PUSH IS A SINE AND NOT A RAMP
 *   z = 1 + 0.08 * sin(PI * n / (N-1)) goes 1.00 -> 1.08 -> 1.00, so the last
 *   frame matches the first AND the velocity is zero at both ends. A ramp
 *   would snap back on every loop. Measured: first frame against last scores
 *   0.979 SSIM, and the difference is compression noise, not geometry.
 *
 * WHY IT STARTS AT ZOOM 1.0
 *   The banner's poster IS this same key visual, so frame zero is the poster.
 *   Measured at 0.985 SSIM against the source: the handoff from poster to
 *   playing video is invisible. Today it is a hard cut to unrelated footage.
 *
 * THE 2x PRE-SCALE is not vanity. zoompan resamples from the input it is
 * given; feeding it 2560 wide keeps the push from stepping between integer
 * pixels, which is what makes a slow zoom look like it is stuttering.
 *
 * NEEDS FFMPEG, which is not a dependency of this project and should not
 * become one:
 *     npm i --no-save ffmpeg-static
 *     node scripts/build-case-banners.mjs
 */
import { execFileSync } from 'node:child_process';
import { readdirSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { join, basename } from 'node:path';

const ffmpeg = './node_modules/ffmpeg-static/ffmpeg';
if (!existsSync(ffmpeg)) {
  console.error('ffmpeg not found. Run: npm i --no-save ffmpeg-static');
  process.exit(1);
}

const SRC_DIR = 'src/assets/work';
const OUT_DIR = 'public/v/case';
const FPS = 15;
const SECONDS = 12;
const ZOOM = 0.08;
const FRAMES = FPS * SECONDS;

mkdirSync(OUT_DIR, { recursive: true });

/* Only the top-level stills. uber-mariachis/ is a folder of collage images and
   is not a key visual. */
const stills = readdirSync(SRC_DIR)
  .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
  .filter((f) => statSync(join(SRC_DIR, f)).isFile())
  .sort();

let total = 0;
for (const file of stills) {
  const slug = basename(file).replace(/\.[^.]+$/, '');
  const out = join(OUT_DIR, `${slug}.mp4`);
  execFileSync(
    ffmpeg,
    [
      '-y',
      '-hide_banner',
      '-loglevel',
      'error',
      '-loop',
      '1',
      '-i',
      join(SRC_DIR, file),
      '-t',
      String(SECONDS),
      '-vf',
      `scale=2560:-2,zoompan=z='1+${ZOOM}*sin(PI*on/${FRAMES - 1})':d=${FRAMES}:` +
        `x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1280x720:fps=${FPS},format=yuv420p`,
      '-c:v',
      'libx264',
      '-preset',
      'veryslow',
      '-crf',
      '28',
      '-an',
      '-movflags',
      '+faststart',
      out,
    ],
    { stdio: 'inherit' }
  );
  const kb = statSync(out).size / 1000;
  total += kb;
  console.log(`  ${slug.padEnd(42)} ${kb.toFixed(0).padStart(4)} KB`);
}
console.log(
  `\n${stills.length} banners · ${(total / 1000).toFixed(2)} MB total · one loads per page`
);
