/**
 * Shared knobs for the photo pipeline. These are the numbers you change when
 * the prints stop matching the paper, so they live in one place.
 */

import path from 'node:path';

export const WIDTHS = [480, 768, 1200, 1800, 2400];
export const FALLBACK_WIDTH = 1200;
export const INPUT_RE = /\.(jpe?g|png|tiff?|webp|avif|heic)$/i;

/**
 * Base grade. These numbers are deliberately moderate — the goal is a print
 * that sits on #F2EEE6 without looking like a filter was dropped on it.
 *
 *   contrast    multiplier applied around mid-grey (1.0 = untouched)
 *   lift        adds to the black point, opens crushed shadows (0-20)
 *   brightness  overall exposure (1.0 = untouched)
 *   saturation  chroma (1.0 = untouched)
 *   warmth      0-0.10, pushes red up and blue down; matches the paper
 *   sharpen     light output sharpening after downscale
 */
export const BASE_GRADE = {
  contrast: 1.07,
  lift: 8,
  brightness: 1.05,
  saturation: 1.3,
  warmth: 0.035,
  sharpen: true,
};

export const QUALITY = { avif: 55, webp: 76, jpeg: 82 };

export const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

export const slugify = (file) =>
  path
    .basename(file, path.extname(file))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
