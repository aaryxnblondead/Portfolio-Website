import sharp from 'sharp';
import path from 'node:path';
import { WIDTHS, FALLBACK_WIDTH, QUALITY } from './config.mjs';
import { applyGrade, lqip, dominant } from './grade.mjs';

/**
 * Emit every derivative for one photograph and describe it for the manifest.
 * Returns undefined when the source has no readable dimensions.
 */
export async function derivePhoto({ slug, input, outDir, g }) {
  const meta = await sharp(input).rotate().metadata();
  const srcW = meta.width ?? 0;
  const srcH = meta.height ?? 0;
  if (!srcW || !srcH) throw new Error(`could not read dimensions for ${slug}`);

  const widths = WIDTHS.filter((w) => w <= srcW);
  if (widths.length === 0) widths.push(srcW);
  if (!widths.includes(srcW) && srcW < WIDTHS[0]) widths.push(srcW);

  const sets = { avif: [], webp: [], jpg: [] };

  for (const w of widths) {
    const base = applyGrade(
      sharp(input).rotate().resize({ width: w, withoutEnlargement: true, fit: 'inside' }),
      g,
    );
    const finished = g.sharpen ? base.sharpen({ sigma: 0.7, m1: 0.4, m2: 0.6 }) : base;

    await Promise.all([
      finished.clone().avif({ quality: QUALITY.avif, effort: 5 })
        .toFile(path.join(outDir, `${slug}-${w}.avif`)),
      finished.clone().webp({ quality: QUALITY.webp })
        .toFile(path.join(outDir, `${slug}-${w}.webp`)),
      finished.clone().jpeg({ quality: QUALITY.jpeg, mozjpeg: true, chromaSubsampling: '4:4:4' })
        .toFile(path.join(outDir, `${slug}-${w}.jpg`)),
    ]);

    sets.avif.push(`/photos/${slug}-${w}.avif ${w}w`);
    sets.webp.push(`/photos/${slug}-${w}.webp ${w}w`);
    sets.jpg.push(`/photos/${slug}-${w}.jpg ${w}w`);
  }

  const fallbackW = widths.includes(FALLBACK_WIDTH) ? FALLBACK_WIDTH : widths[widths.length - 1];

  return {
    slug,
    width: srcW,
    height: srcH,
    aspect: Number((srcW / srcH).toFixed(4)),
    src: `/photos/${slug}-${fallbackW}.jpg`,
    avif: sets.avif.join(', '),
    webp: sets.webp.join(', '),
    jpg: sets.jpg.join(', '),
    lqip: await lqip(input, g),
    tone: await dominant(input, g),
  };
}
