#!/usr/bin/env node
/**
 * photos/ -> public/photos/ + src/lib/photo-manifest.json
 *
 * Does three things:
 *   1. Grades every source photo so it reads lively on a warm paper surface
 *      (lifts shadows, opens midtones, adds saturation and a touch of warmth).
 *   2. Emits AVIF / WebP / JPEG derivatives at five widths.
 *   3. Writes a manifest with dimensions, srcsets, a dominant colour and a
 *      20px blurred LQIP so the mount never flashes empty paper.
 *
 * Run:  npm run photos
 * Deps: npm i -D sharp
 *
 * Per-photo overrides live in photos/grade.json, e.g.
 *   { "anora-lobby": { "saturation": 1.42, "lift": 12, "warmth": 0.06 } }
 */

import sharp from 'sharp';
import { readdir, mkdir, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, 'photos');
const OUT_DIR = path.join(ROOT, 'public', 'photos');
const MANIFEST = path.join(ROOT, 'src', 'lib', 'photo-manifest.json');
const GRADE_FILE = path.join(SRC_DIR, 'grade.json');

const WIDTHS = [480, 768, 1200, 1800, 2400];
const FALLBACK_WIDTH = 1200;
const INPUT_RE = /\.(jpe?g|png|tiff?|webp|avif|heic)$/i;

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
const BASE_GRADE = {
  contrast: 1.07,
  lift: 8,
  brightness: 1.05,
  saturation: 1.3,
  warmth: 0.035,
  sharpen: true,
};

const QUALITY = { avif: 55, webp: 76, jpeg: 82 };

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

const slugify = (file) =>
  path
    .basename(file, path.extname(file))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

async function loadOverrides() {
  if (!existsSync(GRADE_FILE)) return {};
  try {
    return JSON.parse(await readFile(GRADE_FILE, 'utf8'));
  } catch {
    console.warn('  ! photos/grade.json is not valid JSON — ignoring it');
    return {};
  }
}

/** Apply the grade to a sharp pipeline. Order matters: tone, then colour. */
function grade(pipeline, g) {
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

async function lqip(input, g) {
  const buf = await grade(sharp(input).rotate().resize({ width: 24 }), g)
    .blur(1.2)
    .webp({ quality: 40 })
    .toBuffer();
  return `data:image/webp;base64,${buf.toString('base64')}`;
}

async function dominant(input, g) {
  const buf = await grade(sharp(input).rotate().resize({ width: 160 }), g)
    .png()
    .toBuffer();
  const { dominant: d } = await sharp(buf).stats();
  const hex = (n) => n.toString(16).padStart(2, '0');
  return `#${hex(d.r)}${hex(d.g)}${hex(d.b)}`;
}

async function processOne(file, overrides) {
  const slug = slugify(file);
  const input = path.join(SRC_DIR, file);
  const g = { ...BASE_GRADE, ...(overrides[slug] ?? {}) };

  const meta = await sharp(input).rotate().metadata();
  const srcW = meta.width ?? 0;
  const srcH = meta.height ?? 0;
  if (!srcW || !srcH) throw new Error(`could not read dimensions for ${file}`);

  const widths = WIDTHS.filter((w) => w <= srcW);
  if (widths.length === 0) widths.push(srcW);
  if (!widths.includes(srcW) && srcW < WIDTHS[0]) widths.push(srcW);

  const sets = { avif: [], webp: [], jpg: [] };

  for (const w of widths) {
    const base = grade(
      sharp(input).rotate().resize({ width: w, withoutEnlargement: true, fit: 'inside' }),
      g,
    );
    const finished = g.sharpen ? base.sharpen({ sigma: 0.7, m1: 0.4, m2: 0.6 }) : base;

    await Promise.all([
      finished.clone().avif({ quality: QUALITY.avif, effort: 5 })
        .toFile(path.join(OUT_DIR, `${slug}-${w}.avif`)),
      finished.clone().webp({ quality: QUALITY.webp })
        .toFile(path.join(OUT_DIR, `${slug}-${w}.webp`)),
      finished.clone().jpeg({ quality: QUALITY.jpeg, mozjpeg: true, chromaSubsampling: '4:4:4' })
        .toFile(path.join(OUT_DIR, `${slug}-${w}.jpg`)),
    ]);

    sets.avif.push(`/photos/${slug}-${w}.avif ${w}w`);
    sets.webp.push(`/photos/${slug}-${w}.webp ${w}w`);
    sets.jpg.push(`/photos/${slug}-${w}.jpg ${w}w`);
  }

  const fallbackW = widths.includes(FALLBACK_WIDTH)
    ? FALLBACK_WIDTH
    : widths[widths.length - 1];

  return [
    slug,
    {
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
    },
  ];
}

async function main() {
  if (!existsSync(SRC_DIR)) {
    console.error(`No ${path.relative(ROOT, SRC_DIR)}/ directory found.`);
    process.exit(1);
  }

  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(path.dirname(MANIFEST), { recursive: true });

  const overrides = await loadOverrides();
  const files = (await readdir(SRC_DIR)).filter((f) => INPUT_RE.test(f)).sort();

  if (files.length === 0) {
    console.error(`No images in ${path.relative(ROOT, SRC_DIR)}/.`);
    process.exit(1);
  }

  const manifest = {};
  for (const file of files) {
    process.stdout.write(`  ${file} … `);
    try {
      const [slug, entry] = await processOne(file, overrides);
      manifest[slug] = entry;
      console.log(`${entry.width}×${entry.height}  ${entry.tone}`);
    } catch (err) {
      console.log(`failed — ${err.message}`);
    }
  }

  await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log(
    `\n${Object.keys(manifest).length} photo(s) → public/photos/, manifest → src/lib/photo-manifest.json`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
