import sharp from 'sharp';
import { clamp } from './config.mjs';

/**
 * Apply the grade to a sharp pipeline. Order matters: tone, then colour.
 */
export function applyGrade(pipeline, g) {
  const contrast = clamp(g.contrast, 0.5, 2);
  const lift = clamp(g.lift, -40, 40);
  // Pivot the contrast around mid-grey (128) so the image doesn't just go dark,
  // then add the shadow lift on top.
  const intercept = 128 * (1 - contrast) + lift;

  let p = pipeline.linear(contrast, intercept).modulate({
    brightness: clamp(g.brightness, 0.5, 2),
    saturation: clamp(g.saturation, 0, 3),
  });

  const w = clamp(g.warmth ?? 0, 0, 0.12);
  if (w > 0) {
    // Warm the print without tinting the neutrals into sepia.
    p = p.recomb([
      [1 + w, 0, 0],
      [0, 1 + w * 0.25, 0],
      [0, 0, 1 - w],
    ]);
  }

  return p;
}

/** A 24px-wide WebP, inlined as a data URL so the mount never flashes paper. */
export async function lqip(input, g) {
  const buf = await applyGrade(sharp(input).rotate().resize({ width: 24 }), g)
    .blur(1.2)
    .webp({ quality: 40 })
    .toBuffer();
  return `data:image/webp;base64,${buf.toString('base64')}`;
}

/** The average colour of the print, as the plate's paper tone. */
export async function dominant(input, g) {
  const buf = await applyGrade(sharp(input).rotate().resize({ width: 160 }), g)
    .png()
    .toBuffer();
  const { dominant: d } = await sharp(buf).stats();
  const hex = (n) => n.toString(16).padStart(2, '0');
  return `#${hex(d.r)}${hex(d.g)}${hex(d.b)}`;
}
